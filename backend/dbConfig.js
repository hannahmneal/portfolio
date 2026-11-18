// =============================================================================
// backend/dbConfig.js — how this app connects to Postgres, and on what terms
//
// Split out of db.js so that the pool (db.js) and the migration runner
// (migrate.js) cannot drift apart on TLS. They disagreed once already: both
// carried their own copy of `ssl: { rejectUnauthorized: false }`, which meant
// CI applied schema changes over a connection whose certificate was never
// checked.
//
// WHY THIS IS NOT JUST `ssl: { rejectUnauthorized: true }`
//
// node-postgres merges a parsed connection string OVER the config object:
//
//     config = Object.assign({}, config, parse(config.connectionString))
//     (pg/lib/connection-parameters.js)
//
// So any `ssl` option set in code is silently discarded when the URI carries
// an `sslmode` parameter — the URI always wins. Worse, what a given sslmode
// MEANS is version-dependent. In pg 8.x, `require` is treated as an alias for
// `verify-full` (certificate and hostname both checked), but pg-connection-string
// emits a deprecation warning saying that in pg 9 / pg-connection-string 3 it
// will revert to libpq semantics, where `require` means encrypt but verify
// NOTHING. A dependency bump would then quietly downgrade the connection.
//
// Rather than depend on which of those is true at install time, we take the
// decision away from the URI: strip every ssl parameter out of it and state
// the terms explicitly in code. The result is the same on every pg version.
// =============================================================================

// Parameters libpq and node-postgres both read to decide TLS behaviour. Any of
// these in the URI would override what we set below, so all of them go.
const SSL_PARAMS = new Set([
    "ssl",
    "sslmode",
    "sslcert",
    "sslkey",
    "sslrootcert",
    "sslpassword",
    "uselibpqcompat",
])

/**
 * Remove ssl-related query parameters from a Postgres connection URI.
 *
 * Everything outside the query string is left byte-for-byte identical, and
 * surviving parameters keep their original encoding: the password lives in
 * this string, and re-encoding it through URL/URLSearchParams can change bytes
 * that the server then rejects.
 */
export function stripSslParams(uri) {
    const q = uri.indexOf("?")
    if (q === -1) return uri

    const base = uri.slice(0, q)
    const kept = uri
        .slice(q + 1)
        .split("&")
        .filter((segment) => {
            if (segment === "") return false
            const key = segment.split("=")[0].toLowerCase()
            return !SSL_PARAMS.has(key)
        })

    return kept.length > 0 ? `${base}?${kept.join("&")}` : base
}

/**
 * Build the connection config for a pg Pool or Client.
 *
 * Production (DATABASE_URL set): TLS with full verification — the certificate
 * must chain to a trusted root AND the hostname must match. Node's bundled CA
 * store already trusts the ISRG Root X1 certificate Neon serves, so no custom
 * CA is needed. We deliberately do not pin a CA: pinning breaks silently when
 * the provider rotates roots, and the failure mode is the whole API refusing
 * to start.
 *
 * Local development (discrete DB_* vars): no TLS. The local server is reached
 * over a private network and does not serve a certificate; demanding one would
 * only mean turning verification off again to get work done.
 */
export function buildConnectionConfig(env = process.env) {
    if (env.DATABASE_URL) {
        return {
            connectionString: stripSslParams(env.DATABASE_URL),
            ssl: { rejectUnauthorized: true },
        }
    }

    return {
        host: env.DB_HOST ?? "localhost",
        port: Number(env.DB_PORT ?? 5432),
        database: env.DB_NAME,
        user: env.DB_USER,
        password: env.DB_PASS,
    }
}
