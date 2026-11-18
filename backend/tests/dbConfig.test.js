import test from "node:test"
import assert from "node:assert/strict"
import { parse } from "pg-connection-string"
import { buildConnectionConfig, stripSslParams } from "../dbConfig.js"

const NEON = "postgresql://user:pw@ep-x-pooler.us-east-2.aws.neon.tech/portfolio"

test("sslmode is stripped, other parameters survive", () => {
    assert.equal(
        stripSslParams(`${NEON}?sslmode=require&application_name=portfolio`),
        `${NEON}?application_name=portfolio`
    )
})

test("every ssl-related parameter is stripped, whatever its case", () => {
    const uri = `${NEON}?sslmode=verify-full&sslrootcert=/x.pem&SSLCERT=/y.pem&uselibpqcompat=true&keep=1`
    assert.equal(stripSslParams(uri), `${NEON}?keep=1`)
})

test("the question mark goes too when nothing else is left", () => {
    assert.equal(stripSslParams(`${NEON}?sslmode=require`), NEON)
})

test("a uri with no query string is returned unchanged", () => {
    assert.equal(stripSslParams(NEON), NEON)
})

test("credentials are not re-encoded", () => {
    // The password lives in this string. Round-tripping it through URL or
    // URLSearchParams can change bytes the server then rejects, so everything
    // before the query string must come back identical.
    const withOddPassword = "postgresql://user:p%40ss%2Fword@host/db?sslmode=require"
    assert.equal(stripSslParams(withOddPassword), "postgresql://user:p%40ss%2Fword@host/db")
})

test("production asks for a verified certificate", () => {
    const config = buildConnectionConfig({ DATABASE_URL: `${NEON}?sslmode=require` })
    assert.deepEqual(config.ssl, { rejectUnauthorized: true })
    assert.equal(config.connectionString, NEON)
})

test("the uri can no longer override the ssl decision", () => {
    // This is the regression this module exists for. node-postgres merges a
    // parsed connection string OVER the config object:
    //
    //   config = Object.assign({}, config, parse(config.connectionString))
    //   (pg/lib/connection-parameters.js)
    //
    // so an sslmode in the uri used to win silently. Reproduce that merge and
    // assert that verification survives it, even for the mode that means
    // "do not verify".
    for (const mode of ["no-verify", "require", "prefer", "disable"]) {
        const config = buildConnectionConfig({ DATABASE_URL: `${NEON}?sslmode=${mode}` })
        const merged = Object.assign({}, config, parse(config.connectionString))
        assert.deepEqual(
            merged.ssl,
            { rejectUnauthorized: true },
            `sslmode=${mode} must not survive into the connection config`
        )
    }
})

test("local development connects without TLS", () => {
    const config = buildConnectionConfig({
        DB_HOST: "100.66.10.92", DB_PORT: "5433",
        DB_NAME: "portfolio", DB_USER: "hannah", DB_PASS: "x",
    })
    assert.ok(!("ssl" in config), "local config must not request TLS")
    assert.ok(!("connectionString" in config))
    assert.equal(config.port, 5433)
    assert.equal(typeof config.port, "number")
})

test("local development falls back to localhost:5432", () => {
    const config = buildConnectionConfig({ DB_NAME: "portfolio" })
    assert.equal(config.host, "localhost")
    assert.equal(config.port, 5432)
})
