// =============================================================================
// backend/migrate.js — minimal forward-only migration runner
//
// Run with:  npm run migrate
//
// Applies every .sql file in migrations/ that has not been applied yet, in
// filename order, each inside its own transaction. Applied filenames are
// recorded in portfolio.schema_migrations along with a checksum of the file.
//
// WHY A RUNNER AT ALL: db_schema.sql used `CREATE TABLE IF NOT EXISTS`, which
// silently does nothing against an existing database. That is how the live
// schema drifted — a stray `content` column appeared and `contact_messages`
// was never created — without anything failing. A migration that has already
// run is recorded; one that has not is applied; a file edited after being
// applied is reported. Drift becomes visible instead of silent.
//
// Forward-only by design: no `down` steps. Rolling a schema back on a live
// database is where data gets lost, and for a site this size restoring from a
// backup is both safer and simpler. To undo something, write a new migration.
// =============================================================================

import { readdir, readFile } from "node:fs/promises"
import { createHash } from "node:crypto"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import pg from "pg"
import "dotenv/config"

const MIGRATIONS_DIR = join(dirname(fileURLToPath(import.meta.url)), "migrations")

// The runner connects WITHOUT the app's search_path: migration files name
// their schema explicitly (portfolio.users, not users), so that a migration
// can create the schema it will later live in.
function client() {
    return process.env.DATABASE_URL
        ? new pg.Client({
            connectionString: process.env.DATABASE_URL,
            ssl: { rejectUnauthorized: false },
        })
        : new pg.Client({
            host: process.env.DB_HOST ?? "localhost",
            port: Number(process.env.DB_PORT ?? 5432),
            database: process.env.DB_NAME,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
        })
}

const checksum = (sql) => createHash("sha256").update(sql, "utf8").digest("hex").slice(0, 16)

async function ensureLedger(db) {
    // The ledger lives in the portfolio schema alongside what it tracks, so a
    // database shared with other projects gains nothing in `public`.
    await db.query("CREATE SCHEMA IF NOT EXISTS portfolio")
    await db.query(`
        CREATE TABLE IF NOT EXISTS portfolio.schema_migrations (
            filename   TEXT PRIMARY KEY,
            checksum   TEXT        NOT NULL,
            applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
        )
    `)
}

export async function migrate({ dryRun = false } = {}) {
    const files = (await readdir(MIGRATIONS_DIR))
        .filter((f) => f.endsWith(".sql"))
        .sort()

    if (files.length === 0) {
        console.log("No migration files found.")
        return { applied: [], pending: [] }
    }

    const db = client()
    await db.connect()
    const applied = []

    try {
        await ensureLedger(db)
        const { rows } = await db.query(
            "SELECT filename, checksum FROM portfolio.schema_migrations"
        )
        const already = new Map(rows.map((r) => [r.filename, r.checksum]))

        for (const filename of files) {
            const sql = await readFile(join(MIGRATIONS_DIR, filename), "utf8")
            const sum = checksum(sql)

            if (already.has(filename)) {
                // An edited file is a warning, not an error: the change is not
                // applied, and editing an applied migration is how two
                // databases quietly end up different. Write a new file instead.
                if (already.get(filename) !== sum) {
                    console.warn(
                        `  ! ${filename} has changed since it was applied ` +
                        `(${already.get(filename)} → ${sum}). Not re-run; ` +
                        "add a new migration instead."
                    )
                } else {
                    console.log(`  = ${filename} (already applied)`)
                }
                continue
            }

            if (dryRun) {
                console.log(`  + ${filename} (pending)`)
                applied.push(filename)
                continue
            }

            // One transaction per file: a migration either lands completely or
            // not at all, and the ledger row commits with it, so a crash
            // mid-run can never record a migration that did not finish.
            await db.query("BEGIN")
            try {
                await db.query(sql)
                await db.query(
                    "INSERT INTO portfolio.schema_migrations (filename, checksum) VALUES ($1, $2)",
                    [filename, sum]
                )
                await db.query("COMMIT")
                console.log(`  + ${filename}`)
                applied.push(filename)
            } catch (err) {
                await db.query("ROLLBACK")
                throw new Error(`${filename} failed: ${err.message}`, { cause: err })
            }
        }
    } finally {
        await db.end()
    }

    console.log(
        dryRun
            ? `${applied.length} migration(s) pending.`
            : `${applied.length} migration(s) applied.`
    )
    return { applied }
}

// Only run when invoked directly, so tests can import migrate() without it
// firing on import.
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    migrate({ dryRun: process.argv.includes("--dry-run") }).catch((err) => {
        console.error("Migration failed:", err.message)
        process.exit(1)
    })
}
