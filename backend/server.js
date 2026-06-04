// =============================================================================
// backend/server.js — Express API server
//
// Runs on your home desktop on port 3001.
// Cloudflare Tunnel routes api.redqueen.run → http://localhost:3001
//
// Start for development:  npm run dev   (uses nodemon, auto-restarts on save)
// Start for production:   npm start
// =============================================================================

import express from "express"
import cors from "cors"
import { pool } from "./db.js"
import { ulid } from "ulid"

const app = express()
const PORT = process.env.PORT ?? 3001

// Parse JSON request bodies
app.use(express.json())

// CORS: only allow requests from your Cloudflare Pages domain.
// Update this once your custom domain is live.
app.use(cors({
    origin: [
        "https://portfolio-3dk.pages.dev",
        // Add your custom domain here once it's live:
        "https://redqueen.run",
        // Allow localhost during frontend development:
        "http://localhost:5173",
    ],
    methods: ["GET", "POST"],
}))

// ---------------------------------------------------------------------------
// Health check — use this to verify the tunnel is working after Phase 2 setup
// Test it: curl https://api.redqueen.run/health
// ---------------------------------------------------------------------------
app.get("/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() })
})

// ---------------------------------------------------------------------------
// Users — read all users from the database
// ---------------------------------------------------------------------------
app.get("/api/users", async (_req, res) => {
    try {
        const { rows } = await pool.query(
            "SELECT * FROM users ORDER BY created_at DESC"
        )
        res.json(rows)
    } catch (err) {
        console.error("GET /api/users error:", err)
        res.status(500).json({ error: "Failed to fetch users" })
    }
})
// ---------------------------------------------------------------------------
// Projects — read all portfolio projects from the database
// ---------------------------------------------------------------------------
app.get("/api/projects", async (_req, res) => {
    try {
        const { rows } = await pool.query(
            "SELECT * FROM projects ORDER BY created_at DESC"
        )
        res.json(rows)
    } catch (err) {
        console.error("GET /api/projects error:", err)
        res.status(500).json({ error: "Failed to fetch projects" })
    }
})

// ---------------------------------------------------------------------------
// Contact form — write a message to the database
// ---------------------------------------------------------------------------
app.post("/api/contact", async (req, res) => {
    const { name, email, message } = req.body
    const id = ulid();

    if (!name || !email || !message) {
        return res.status(400).json({ error: "name, email, and message are required" })
    }

    try {
        await pool.query(
            "INSERT INTO contact_messages (name, email, message) VALUES ($1, $2, $3, $4)",
            [id, name, email, message]
        )
        res.status(201).json({ success: true })
    } catch (err) {
        console.error("POST /api/contact error:", err)
        res.status(500).json({ error: "Failed to save message" })
    }
})

app.listen(PORT, () => {
    console.log(`API running on http://localhost:${PORT}`)
})