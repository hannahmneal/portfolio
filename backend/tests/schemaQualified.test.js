import test from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"

// Guards the production outage of 2026-11-18.
//
// The app used to reach its tables through search_path, pinned with the
// `options` connection parameter. Render connects over Neon's pooled endpoint
// (PgBouncer, transaction mode), which rejects that parameter outright:
//
//   unsupported startup parameter in options: search_path
//
// Every query failed at connect time in production while passing locally,
// where the connection is direct. The fix was to name the schema in the SQL.
// This test fails if an unqualified table name creeps back in, because the
// symptom appears only against a pooled connection — which is to say, only in
// production.

const here = dirname(fileURLToPath(import.meta.url))
const FILES = ["server.js", "validate.js"]

// Captures the identifier after a clause that introduces a table.
const TABLE_REF = /\b(?:FROM|INTO|JOIN|UPDATE)\s+([A-Za-z_$][\w.${}]*)/g

// Comments are prose, and prose contains sentences like "build an UPDATE from
// validated values" that read as SQL to the pattern above. Strip them first so
// the scan sees only code.
function stripComments(source) {
    return source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "")
}

test("every table reference in app SQL names its schema", () => {
    for (const file of FILES) {
        const source = stripComments(readFileSync(join(here, "..", file), "utf8"))
        for (const [match, identifier] of source.matchAll(TABLE_REF)) {
            // `UPDATE ${table}` in buildUpdate is a placeholder; the value
            // comes from the caller, which this same scan checks in server.js.
            if (identifier.startsWith("${")) continue
            assert.ok(
                identifier.startsWith("portfolio."),
                `${file}: "${match}" is not schema-qualified. Unqualified names ` +
                "resolve through search_path, which the pooled connection cannot set."
            )
        }
    }
})

test("buildUpdate is called with a qualified table name", () => {
    const source = readFileSync(join(here, "..", "server.js"), "utf8")
    for (const [, arg] of source.matchAll(/buildUpdate\(\s*"([^"]+)"/g)) {
        assert.ok(arg.startsWith("portfolio."), `buildUpdate("${arg}") is not qualified`)
    }
})
