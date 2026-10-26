import pg from "pg"
import "dotenv/config"

// Render + Neon (production): DATABASE_URL is a postgres:// URI and requires SSL.
// Local dev: discrete DB_* vars against a plain local Postgres, no SSL.
export const pool = process.env.DATABASE_URL
    ? new pg.Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
    })
    : new pg.Pool({
        host: process.env.DB_HOST ?? "localhost",
        port: Number(process.env.DB_PORT ?? 5432),
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
    })

// Log a warning on connection errors so they surface clearly in the console
pool.on("error", (err) => {
    console.error("Postgres pool error:", err.message)
})

