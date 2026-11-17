import pg from "pg"
import "dotenv/config"

// This Postgres instance is shared with other projects, whose tables live in
// `public`. Pinning search_path to the `portfolio` schema means an unqualified
// query in a route can only ever resolve to this app's own tables — a table
// named `projects` or `users` appearing in `public` cannot shadow or be
// mistaken for ours, and this app can never write to another project's data.
//
// Migrations deliberately do NOT use this (see migrate.js): they name schemas
// explicitly, because they are what creates the schema in the first place.
const SCHEMA = process.env.DB_SCHEMA ?? "portfolio"
const options = `-c search_path=${SCHEMA}`

// Render + Neon (production): DATABASE_URL is a postgres:// URI and requires SSL.
// Local dev: discrete DB_* vars against a plain local Postgres, no SSL.
export const pool = process.env.DATABASE_URL
    ? new pg.Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
        options,
    })
    : new pg.Pool({
        host: process.env.DB_HOST ?? "localhost",
        port: Number(process.env.DB_PORT ?? 5432),
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        options,
    })

// Log a warning on connection errors so they surface clearly in the console
pool.on("error", (err) => {
    console.error("Postgres pool error:", err.message)
})
