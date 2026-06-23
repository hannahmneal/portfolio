// vap --> variant annotation pipeline

import { Router } from "express"
import { pool } from "../../db.js"
import { ulid } from "ulid"
import requireApiToken from "../middleware/auth.js"

const router = Router()

router.post("/results", requireApiToken, async (requireApiToken, res) => {
    const { run_id, patient_id, variants, metadata } = req.body

    if (!run_id || !variants) {
        return res.status(400).json({
            error: "Bad Request: `run_id` and `variants` are required"
        })
    }

    const id = ulid()

    try {
        const { rows } = await pool.query(
            `INSERT INTO demo_bioinf_results (id, run_id, sample_id, variants, metadata)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [id, run_id, sample_id ?? null, JSON.stringify(variants), metadata ? JSON.stringify(metadata) : null]
        )
        res.status(201).json(rows[0])
    } catch (err) {
        console.error("POST `/api/demo/bioinf/results` error: ", err)
        res.status(500).json({ error: "Unable to save result" })
    }
})

router.get("/results", async(_req, res) => {
    try {
        const { rows } = await pool.query(
            "SELECT * FROM demo_bioinf_results"
        )
        res.json(rows)
    } catch (e) {
        console.error("GET `/api/demo/bioinf/results` error: ", e)
        res.status(500).json({
            error: "Unable to fetch results"
        })
    }
})

router.get("/results/:id", async (req, res) => {
    try {
        const { rows } = await pool.query(
            "SELECT * FROM demo_bioinf_results WHERE id = $1",
            [req.params.id]
        )
        if (rows.length === 0) return res.status(404).json({ error: "Not found" })
        res.json(rows[0])
    } catch (e) {
        console.error("GET `/api/demo/bioinf/results/:id` error: ", e)
        res.status(500).json({ error: "Unable to fetch result" })
    }
})

export default router