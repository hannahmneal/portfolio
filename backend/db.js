import pg from "pg"
import "dotenv/config"

export const pool = new pg.Pool({
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

