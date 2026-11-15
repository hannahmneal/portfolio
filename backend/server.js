// =============================================================================
// backend/server.js — Express API server
//
// This API is PRIVATE. The source is public; the deployed service is not.
// Every route except /health requires a whitelisted API key, and writes
// additionally require a write-scoped key (see middleware/auth.js).
//
// All routes live under /portfolio, e.g.
//   https://api.redqueen.run/portfolio/projects
// (no /api prefix — the `api.` subdomain already says it)
//
// Start for development:  npm run dev   (uses nodemon, auto-restarts on save)
// Start for production:   npm start
// =============================================================================

import express from "express"
import helmet from "helmet"
import rateLimit, { ipKeyGenerator } from "express-rate-limit"
import { pool } from "./db.js"
import { ulid } from "ulid"
import { requireApiKey } from "./middleware/auth.js"
import {
    validateProjectCreate,
    validateProjectPatch,
    validateContact,
    buildUpdate,
} from "./validate.js"

const app = express()
const PORT = process.env.PORT ?? 3001

// Render terminates TLS at its own proxy and Cloudflare sits in front of
// that, so req.ip would otherwise be an internal hop. Trusting the chain
// makes req.ip the real client, so the rate limiter buckets by actual caller
// instead of by Render's load balancer.
app.set("trust proxy", true)
app.disable("x-powered-by")

// Security response headers.
app.use(helmet({
    contentSecurityPolicy: { directives: { "default-src": ["'none'"], "frame-ancestors": ["'none'"] } },
    crossOriginResourcePolicy: { policy: "same-origin" },
    referrerPolicy: { policy: "no-referrer" },
}))

// Cap body size: these endpoints take small JSON objects, and an unbounded
// parser is a cheap way to tie up a free-tier instance.
app.use(express.json({ limit: "16kb" }))

// NOTE: there is deliberately no CORS middleware. If an endpoint ever has to be browser-reachable directly, add CORS to that route alone.

// Cloudflare's IP, not the visitor's, is what Render sees as the socket peer;
// with `trust proxy` the visitor is req.ip. Normalise it so IPv6 callers are
// bucketed by subnet rather than by a single rotating address.
const clientKey = (req) => ipKeyGenerator(req.ip ?? "unknown", 56)

const limiter = (windowMs, limit, extra = {}) => rateLimit({
    windowMs,
    limit,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    keyGenerator: clientKey,
    message: { error: "Too many requests" },
    ...extra,
})

// Broad limiter: a backstop against a key holder (or leaked key) hammering the database.
app.use(limiter(60_000, 120))

// Tighter limiter on unauthenticated attempts. Only failures count, so a legitimate caller is never slowed by it.
const authAttemptLimiter = limiter(15 * 60_000, 20, { skipSuccessfulRequests: true })

// ---------------------------------------------------------------------------
app.get("/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() })
})

// ---------------------------------------------------------------------------
// Everything below this line requires a whitelisted API key, and every write
// requires a write-scoped one. Mounted as a gate on the whole app rather than
// per-route, so a route added later is private by default instead of
// accidentally public.
// ---------------------------------------------------------------------------
app.use(authAttemptLimiter, requireApiKey())

const api = express.Router()
app.use("/portfolio", api)

// ---------------------------------------------------------------------------
// Users — read all users from the database
// ---------------------------------------------------------------------------
api.get("/users", async (_req, res) => {
    try {
        const { rows } = await pool.query(
            "SELECT * FROM users ORDER BY created_at DESC"
        )
        res.json(rows)
    } catch (err) {
        console.error("GET /portfolio/users error:", err)
        res.status(500).json({ error: "Failed to fetch users" })
    }
})

// ---------------------------------------------------------------------------
// Projects — read all portfolio projects from the database
// ---------------------------------------------------------------------------
api.get("/projects", async (_req, res) => {
    try {
        const { rows } = await pool.query(
            "SELECT * FROM projects ORDER BY created_at DESC"
        )
        res.json(rows)
    } catch (err) {
        console.error("GET /portfolio/projects error:", err)
        res.status(500).json({ error: "Failed to fetch projects" })
    }
})

// ---------------------------------------------------------------------------
// Projects — create. Write-scoped key only: the read-scoped key the public
// proxy holds cannot reach this, whatever the proxy forwards.
// ---------------------------------------------------------------------------
api.post("/projects", async (req, res) => {
    const { values, error } = validateProjectCreate(req.body)
    if (error) return res.status(400).json({ error })

    // The server assigns the id. A caller-supplied one could collide with an
    // existing primary key, turning a create into someone else's failed write.
    const id = ulid()

    try {
        const { rows } = await pool.query(
            "INSERT INTO projects (id, title, description, url, tags) " +
            "VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [id, values.title, values.description ?? null, values.url ?? null, values.tags ?? null]
        )
        res.status(201).json(rows[0])
    } catch (err) {
        console.error("POST /portfolio/projects error:", err)
        res.status(500).json({ error: "Failed to create project" })
    }
})

// ---------------------------------------------------------------------------
// Projects — partial update. Write-scoped key only.
// ---------------------------------------------------------------------------
api.patch("/projects/:id", async (req, res) => {
    const { values, error } = validateProjectPatch(req.body)
    if (error) return res.status(400).json({ error })

    const { text, params } = buildUpdate("projects", values, "id", req.params.id)

    try {
        const { rows } = await pool.query(text, params)
        if (rows.length === 0) return res.status(404).json({ error: "Not found" })
        res.json(rows[0])
    } catch (err) {
        console.error("PATCH /portfolio/projects/:id error:", err)
        res.status(500).json({ error: "Failed to update project" })
    }
})

// ---------------------------------------------------------------------------
// Contact form — write a message to the database.
//
// This is the one write anonymous visitors can reach (the Pages proxy forwards
// it), so it gets its own tight limiter on top of validation and the honeypot.
// ---------------------------------------------------------------------------
api.post("/contact", limiter(60 * 60_000, 5), async (req, res) => {
    const { values, error, spam } = validateContact(req.body)

    if (spam) {
        console.warn(`Discarded honeypot contact submission from ${req.ip}`)
        return res.status(201).json({ success: true })
    }
    if (error) return res.status(400).json({ error })

    const id = ulid()

    try {
        await pool.query(
            "INSERT INTO contact_messages (id, name, email, message) VALUES ($1, $2, $3, $4)",
            [id, values.name, values.email, values.message]
        )
        res.status(201).json({ success: true })
    } catch (err) {
        console.error("POST /portfolio/contact error:", err)
        res.status(500).json({ error: "Failed to save message" })
    }
})

// Unknown paths. Unauthenticated callers never reach this. A key 
// holder (including the Pages Function proxy) gets a 404, which 
// keeps a typo in the proxy's allowlist from looking like a revoked key.
app.use((_req, res) => {
    res.status(404).json({ error: "Not found" })
})

// Body-parser failures would otherwise fall through to Express' default
// handler, which answers with an HTML page containing a stack trace.
app.use((err, _req, res, _next) => {
    if (err?.type === "entity.too.large") {
        return res.status(413).json({ error: "Request body too large" })
    }
    if (err instanceof SyntaxError) {
        return res.status(400).json({ error: "Invalid JSON body" })
    }
    console.error("Unhandled error:", err)
    res.status(500).json({ error: "Internal server error" })
})

// Export app for testing; only listen when run directly
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`))
}

export default app
