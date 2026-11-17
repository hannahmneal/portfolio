import pg from "pg"
import { buildConnectionConfig } from "./dbConfig.js"
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

// Render + Neon (production): DATABASE_URL, TLS with the certificate AND the
// hostname verified. Local dev: discrete DB_* vars, no TLS. Both shapes come
// from dbConfig.js, so this pool and the migration runner cannot disagree
// about how the connection is secured — which is exactly how they each ended
// up with their own copy of `rejectUnauthorized: false`.
export const pool = new pg.Pool({ ...buildConnectionConfig(), options })

// Log a warning on connection errors so they surface clearly in the console
pool.on("error", (err) => {
    console.error("Postgres pool error:", err.message)
})
