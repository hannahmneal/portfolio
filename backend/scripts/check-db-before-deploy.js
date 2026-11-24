// This script connects with the app's real settings (db.js) and runs a single query.
// The deploy job runs the query through Neon's pooler *before* telling Render to
// deploy. This prevents the pooler from rejecting a setting (in `options`) in
// production, failing it in CI instead. Direct/local connections will pass regardless.
//
// By importing `pool` from `db.js` instead of creating a new connection, the check
// uses exactly the same settings Render uses.
import { pool } from "../db.js"


try {
    await pool.query("SELECT 1 FROM portfolio.projects LIMIT 1")
    console.log("✅ Database check passed: app settings work on this connection.");
    
} catch (err) {
    console.log("Database check failed: ", err.message);
    process.exitCode = 1
} finally {
    await pool.end()
}