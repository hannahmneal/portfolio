import pg from "pg"
import { buildConnectionConfig } from "./dbConfig.js"
import "dotenv/config"

// This Postgres instance is shared with other projects, whose tables live in
// `public`. Isolation comes from every query naming its schema explicitly
// (portfolio.projects, never projects), exactly as the migrations do.
//
// It used to come from pinning search_path through the `options` connection
// parameter. That cannot work here: Render connects over Neon's POOLED
// endpoint, which is PgBouncer in transaction mode, and PgBouncer rejects the
// connection outright rather than ignoring the parameter:
//
//   unsupported startup parameter in options: search_path
//
// So every query failed at connect time in production while working locally,
// where the connection is direct. Naming the schema in the SQL has no such
// dependency: it behaves identically on a pooled connection, a direct one,
// and a local server, and it cannot be silently dropped in transit.
export const pool = new pg.Pool(buildConnectionConfig())

// Log a warning on connection errors so they surface clearly in the console
pool.on("error", (err) => {
    console.error("Postgres pool error:", err.message)
})
