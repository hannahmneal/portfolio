// =============================================================================
// frontend/functions/api/[[path]].js — Cloudflare Pages Function: API proxy
//
// WHY THIS EXISTS
// The backend API is private: every route requires a secret API key. A static
// site cannot hold that key — anything the browser needs ends up in the built
// bundle, readable by any visitor — so the UI never talks to api.redqueen.run
// directly. Instead it calls same-origin paths on redqueen.run:
//
//   UI  fetch("/api/portfolio/projects")
//     → this Function (runs on Cloudflare's edge, holds API_KEY as a secret)
//     → https://api.redqueen.run/portfolio/projects  with Authorization: Bearer …
//
// Note the asymmetry: the site-side path keeps its /api/ prefix (on
// redqueen.run it distinguishes data from pages), while the API drops it —
// the `api.` subdomain (e.g., `api.re...`) already says it.
//
// The key never leaves the server side, and because the call is same-origin
// there is no CORS involved at all — which is why the API itself keeps CORS
// fully closed.
//
// WHAT THIS IS NOT
// This is not an open tunnel to the API. The proxy is public — anyone can call
// redqueen.run/api/* — so it forwards ONLY the exact method+path pairs in
// ALLOWED below. Everything else gets a 404, including admin writes. Treat
// adding a line to ALLOWED as publishing that endpoint to the world.
//
// CONFIGURATION (Cloudflare Pages > portfolio > Settings > Variables)
//   API_BASE_URL  plain text, e.g. https://api.redqueen.run
//   API_KEY       SECRET — a READ-scoped key from the API's API_KEYS list.
// 
// Locally, `wrangler pages dev` reads these from frontend/.dev.vars.
// =============================================================================

// Method+path allowlist. Keys are paths below /api/ (matched exactly, so
// "portfolio/projects" and "projects" are different routes); values are the
// methods the public may use.
//
// Only routes that exist on the API are listed. An entry for a route that
// hasn't been built yet is public surface bought for nothing — add
// "portfolio/main", "portfolio/now", "portfolio/techstack" and
// "portfolio/guestbook" here as each one ships, not in advance.
//
// Deliberately absent, and to stay that way: POST/PATCH on portfolio/projects
// and the other content routes (these edit the site — run them against the API
// directly with a write-scoped key), DELETE anything, and portfolio/users.
//
// Adding a line here publishes that endpoint, and its response bodies, to
// anyone on the internet. The key this function holds is read-scoped, so the
// API refuses writes regardless.
const ALLOWED = {
    "portfolio/projects": ["GET"],
    "portfolio/contact": ["POST"],
}

// Anonymous writes carry a body; cap it here so junk never reaches the API.
const MAX_BODY_BYTES = 8 * 1024

// Give up rather than hold a connection open: the API is on Render's free
// tier, so a cold start is slow but not unbounded.
const UPSTREAM_TIMEOUT_MS = 15_000

function json(status, body, extraHeaders = {}) {
    return new Response(JSON.stringify(body), {
        status,
        headers: {
            "content-type": "application/json; charset=utf-8",
            // This is an API response, never a document; keep browsers from
            // sniffing or framing it.
            "x-content-type-options": "nosniff",
            "referrer-policy": "no-referrer",
            ...extraHeaders,
        },
    })
}

export async function onRequest(context) {
    const { request, env, params } = context

    const baseUrl = env.API_BASE_URL
    const apiKey = env.API_KEY
    if (!baseUrl || !apiKey) {
        // Fail closed and loudly in the logs, but tell the caller nothing.
        console.error("API proxy misconfigured: API_BASE_URL and/or API_KEY unset")
        return json(503, { error: "Service unavailable" })
    }

    // params.path is the matched segments of /api/<...>. Join and normalise so
    // "projects/" and "projects" are the same lookup, and anything with extra
    // segments (or traversal attempts) simply misses the allowlist.
    const segments = Array.isArray(params.path) ? params.path : [params.path].filter(Boolean)
    const route = segments.join("/")

    const methods = Object.prototype.hasOwnProperty.call(ALLOWED, route)
        ? ALLOWED[route]
        : null

    // Unknown path and disallowed method answer identically, so probing the
    // proxy cannot distinguish "no such route" from "route exists, not for you".
    if (!methods || !methods.includes(request.method)) {
        return json(404, { error: "Not found" })
    }

    let body
    if (request.method !== "GET" && request.method !== "HEAD") {
        const raw = await request.text()
        if (raw.length > MAX_BODY_BYTES) {
            return json(413, { error: "Request body too large" })
        }
        // Only JSON goes upstream. Parsing here means a malformed body is
        // rejected at the edge instead of costing an API round trip.
        try {
            JSON.parse(raw)
        } catch {
            return json(400, { error: "Invalid JSON body" })
        }
        body = raw
    }

    // Build the upstream request from scratch rather than forwarding the
    // client's headers: nothing the visitor sends should be able to influence
    // how the API authenticates or caches this call.
    const upstreamUrl = `${baseUrl.replace(/\/+$/, "")}/${route}`
    const headers = {
        authorization: `Bearer ${apiKey}`,
        accept: "application/json",
    }
    if (body !== undefined) headers["content-type"] = "application/json"

    // Pass the visitor's IP along so the API's rate limiter buckets by real
    // caller instead of seeing every request as coming from one edge node.
    const clientIp = request.headers.get("cf-connecting-ip")
    if (clientIp) headers["x-forwarded-for"] = clientIp

    let upstream
    try {
        upstream = await fetch(upstreamUrl, {
            method: request.method,
            headers,
            body,
            signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
        })
    } catch (err) {
        console.error(`API proxy upstream failure for ${request.method} ${route}:`, err)
        return json(502, { error: "Upstream request failed" })
    }

    const text = await upstream.text()

    // A 401 from upstream means our key is wrong or revoked.
    if (upstream.status === 401 || upstream.status === 403) {
        console.error(`API proxy rejected by API (${upstream.status}): check API_KEY`)
        return json(502, { error: "Upstream request failed" })
    }

    // Reads are safe to cache briefly.
    const cacheControl = request.method === "GET" && upstream.ok
        ? "public, max-age=60, stale-while-revalidate=300"
        : "no-store"

    return new Response(text, {
        status: upstream.status,
        headers: {
            "content-type": "application/json; charset=utf-8",
            "cache-control": cacheControl,
            "x-content-type-options": "nosniff",
            "referrer-policy": "no-referrer",
        },
    })
}
