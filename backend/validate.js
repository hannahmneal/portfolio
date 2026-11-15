// =============================================================================
// backend/validate.js — input validation for write routes
//
// Writes accept caller-supplied objects, so every field a caller may set is
// listed explicitly here. Nothing iterates over req.body: that is what lets a
// caller patch `id`, `created_at`, or a column added to the table later.
// =============================================================================

const MAX = {
    title: 200,
    description: 5000,
    url: 2048,
    tag: 40,
    tags: 20,
    name: 100,
    email: 254,
    message: 5000,
}

// Deliberately loose — the only goal is rejecting obvious junk, not policing
// what a valid address looks like.
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function text(value, field, { required = false } = {}) {
    if (value === undefined || value === null) {
        return required ? { error: `${field} is required` } : { skip: true }
    }
    if (typeof value !== "string") return { error: `${field} must be a string` }
    const trimmed = value.trim()
    if (required && trimmed.length === 0) return { error: `${field} is required` }
    if (trimmed.length > MAX[field]) {
        return { error: `${field} must be ${MAX[field]} characters or fewer` }
    }
    return { value: trimmed }
}

function httpUrl(value, field) {
    const t = text(value, field)
    if (t.error || t.skip) return t
    if (t.value === "") return { value: null }
    let parsed
    try {
        parsed = new URL(t.value)
    } catch {
        return { error: `${field} must be a valid URL` }
    }
    // Reject javascript:, data: and friends. These values are rendered as
    // links on the public site, so a stored `javascript:` URL would be an XSS
    // vector against visitors.
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
        return { error: `${field} must be an http(s) URL` }
    }
    return { value: parsed.toString() }
}

function tagList(value, field) {
    if (value === undefined || value === null) return { skip: true }
    if (!Array.isArray(value)) return { error: `${field} must be an array of strings` }
    if (value.length > MAX.tags) {
        return { error: `${field} must have ${MAX.tags} entries or fewer` }
    }
    const out = []
    for (const entry of value) {
        if (typeof entry !== "string") return { error: `${field} must contain only strings` }
        const trimmed = entry.trim()
        if (trimmed.length === 0) continue
        if (trimmed.length > MAX.tag) {
            return { error: `each ${field} entry must be ${MAX.tag} characters or fewer` }
        }
        out.push(trimmed)
    }
    return { value: out }
}

// The only columns a caller may ever set on `projects`. `id` and `created_at`
// are absent on purpose: the server assigns both.
const PROJECT_FIELDS = {
    title: (v, required) => text(v, "title", { required }),
    description: (v) => text(v, "description"),
    url: (v) => httpUrl(v, "url"),
    tags: (v) => tagList(v, "tags"),
}

function collect(body, fields, requiredFields) {
    if (body === null || typeof body !== "object" || Array.isArray(body)) {
        return { error: "request body must be a JSON object" }
    }
    const unknown = Object.keys(body).filter(
        (k) => !Object.prototype.hasOwnProperty.call(fields, k)
    )
    // Reject unknown fields rather than ignoring them.
    if (unknown.length > 0) {
        return { error: `unknown field(s): ${unknown.join(", ")}` }
    }

    const values = {}
    for (const [field, check] of Object.entries(fields)) {
        const result = check(body[field], requiredFields.includes(field))
        if (result.error) return { error: result.error }
        if (result.skip) continue
        values[field] = result.value
    }
    return { values }
}

/** Validate a project create. Returns { values } or { error }. */
export function validateProjectCreate(body) {
    const result = collect(body, PROJECT_FIELDS, ["title"])
    if (result.error) return result
    if (result.values.title === undefined) return { error: "title is required" }
    return result
}

/** Validate a project patch: any subset of the writable fields, but not none. */
export function validateProjectPatch(body) {
    const result = collect(body, PROJECT_FIELDS, [])
    if (result.error) return result
    if (Object.keys(result.values).length === 0) {
        return { error: "no writable fields supplied" }
    }
    return result
}

/**
 * Validate a contact message. This route is reachable by anonymous visitors
 * through the Pages proxy, so it also carries a honeypot: `website` is a
 * hidden form field no human fills in.
 */
export function validateContact(body) {
    if (body === null || typeof body !== "object" || Array.isArray(body)) {
        return { error: "request body must be a JSON object" }
    }
    if (typeof body.website === "string" && body.website.trim() !== "") {
        return { spam: true }
    }

    const name = text(body.name, "name", { required: true })
    if (name.error) return { error: name.error }
    const email = text(body.email, "email", { required: true })
    if (email.error) return { error: email.error }
    if (!EMAIL.test(email.value)) return { error: "email must be a valid address" }
    const message = text(body.message, "message", { required: true })
    if (message.error) return { error: message.error }

    return { values: { name: name.value, email: email.value, message: message.value } }
}

/**
 * Build a parameterised UPDATE from validated values. Column names come from
 * PROJECT_FIELDS keys, never from caller input, so this cannot be injected
 * through a field name; the values are bound as positional placeholders.
 */
export function buildUpdate(table, values, idColumn, id) {
    const columns = Object.keys(values)
    const assignments = columns.map((col, i) => `${col} = $${i + 1}`)
    const params = [...columns.map((col) => values[col]), id]
    return {
        text: `UPDATE ${table} SET ${assignments.join(", ")} ` +
            `WHERE ${idColumn} = $${params.length} RETURNING *`,
        params,
    }
}
