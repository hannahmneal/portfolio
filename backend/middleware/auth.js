// =============================================================================
// backend/middleware/auth.js — API key authentication with read/write scopes
// =============================================================================

import { createHash, timingSafeEqual } from "node:crypto"

const MIN_KEY_LENGTH = 32
const SCOPES = ["read", "write"]
const SAFE_METHODS = ["GET", "HEAD"]

// Hash every configured key once at startup
function digest(value) {
    return createHash("sha256").update(value, "utf8").digest()
}

/**
 * Parse one `label:scope:key` entry. Both leading fields are required: an
 * entry without an explicit scope is rejected rather than defaulting, because
 * a silent default here is how a proxy key quietly gains write access.
 */
export function parseApiKeys(raw) {
    return (raw ?? "")
        .split(",")
        .map((entry) => entry.trim())
        .filter(Boolean)
        .map((entry) => {
            // Split into at most 3 fields
            const first = entry.indexOf(":")
            const second = entry.indexOf(":", first + 1)
            if (first <= 0 || second <= first + 1) {
                return { raw: entry, malformed: true }
            }
            return {
                label: entry.slice(0, first).trim(),
                scope: entry.slice(first + 1, second).trim().toLowerCase(),
                secret: entry.slice(second + 1).trim(),
            }
        })
}

export function loadApiKeys(env = process.env) {
    const entries = parseApiKeys(env.API_KEYS)

    if (entries.length === 0) {
        // Fail closed
        throw new Error(
            "API_KEYS is not set. The API refuses to start without at least one " +
            'key. Format: "label:scope:key" (scope is read or write); generate ' +
            "a key with `openssl rand -hex 32`."
        )
    }

    const malformed = entries.filter((e) => e.malformed || !e.secret)
    if (malformed.length > 0) {
        throw new Error(
            `API_KEYS has ${malformed.length} malformed entry/entries. Each must be ` +
            '"label:scope:key", e.g. "laptop:write:<key>".'
        )
    }

    const badScope = entries.filter((e) => !SCOPES.includes(e.scope))
    if (badScope.length > 0) {
        throw new Error(
            `API_KEYS has invalid scope(s): ` +
            `${badScope.map((e) => `${e.label}:${e.scope}`).join(", ")}. ` +
            `Valid scopes are ${SCOPES.join(", ")}.`
        )
    }

    const weak = entries.filter((e) => e.secret.length < MIN_KEY_LENGTH)
    if (weak.length > 0) {
        throw new Error(
            `API_KEYS contains ${weak.length} key(s) shorter than ${MIN_KEY_LENGTH} ` +
            `characters (${weak.map((e) => e.label).join(", ")}). Generate keys with ` +
            "`openssl rand -hex 32`."
        )
    }

    return entries.map(({ label, scope, secret }) => ({
        label,
        scope,
        hash: digest(secret),
    }))
}

function presentedKey(req) {
    const auth = req.get("authorization")
    if (auth) {
        const [scheme, ...rest] = auth.trim().split(/\s+/)
        if (scheme.toLowerCase() === "bearer" && rest.length > 0) {
            return rest.join(" ")
        }
    }
    return req.get("x-api-key") ?? null
}

/**
 * Express middleware factory. Rejects any request that does not carry a
 * whitelisted API key with a bare 401 and any attempted write with read
 * scopes with a 403.
 */
export function requireApiKey(keys = loadApiKeys()) {
    return function apiKeyGuard(req, res, next) {
        const presented = presentedKey(req)

        if (!presented) {
            // Logged distinctly from a wrong key: this means no credential
            // arrived at all, or the Authorization header could not be parsed
            // (e.g. a missing space after "Bearer"). Neither branch logs the
            // presented value.
            console.warn(
                `Rejected ${req.method} ${req.originalUrl} from ${req.ip}: ` +
                "no API key presented"
            )
            res.set("WWW-Authenticate", "Bearer")
            return res.status(401).json({ error: "Unauthorized" })
        }

        const presentedHash = digest(presented)

        let matched = null
        for (const key of keys) {
            if (timingSafeEqual(presentedHash, key.hash)) {
                matched = key
            }
        }

        if (!matched) {
            console.warn(
                `Rejected ${req.method} ${req.originalUrl} from ${req.ip}: invalid API key`
            )
            res.set("WWW-Authenticate", "Bearer")
            return res.status(401).json({ error: "Unauthorized" })
        }

        if (matched.scope === "read" && !SAFE_METHODS.includes(req.method)) {
            // 403, not 401: the key is valid, the operation is not permitted.
            console.warn(
                `Rejected ${req.method} ${req.originalUrl} from ${req.ip}: ` +
                `key "${matched.label}" is read-scoped`
            )
            return res.status(403).json({ error: "Forbidden" })
        }

        // Downstream handlers / logs can see which *caller* it was
        req.apiKeyLabel = matched.label
        req.apiKeyScope = matched.scope
        return next()
    }
}
