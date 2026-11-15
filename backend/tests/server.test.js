// Route-level auth tests.
//
// server.js calls requireApiKey() at module load, which throws if API_KEYS is
// unset — the same fail-closed path that runs in production. ESM imports are
// hoisted above any statement here, so the test keys cannot be assigned in this
// file; they are set in the `test` script in package.json instead.
//
// These tests deliberately never reach a successful database write: they assert
// the gate, the scope and the validation, all of which answer before any query
// runs. There is no test database in CI.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import request from 'supertest'
import app from '../server.js'

const WRITE_KEY = 'w'.repeat(40)
const READ_KEY = 'r'.repeat(40)
const BASE = '/portfolio'

test('GET /health is public and returns ok', async () => {
    const res = await request(app).get('/health')
    assert.equal(res.status, 200)
    assert.equal(res.body.status, 'ok')
})

test('GET projects without a key is rejected', async () => {
    const res = await request(app).get(`${BASE}/projects`)
    assert.equal(res.status, 401)
    assert.equal(res.body.error, 'Unauthorized')
})

test('a wrong key is rejected', async () => {
    const res = await request(app)
        .get(`${BASE}/users`)
        .set('Authorization', `Bearer ${'z'.repeat(40)}`)
    assert.equal(res.status, 401)
})

test('x-api-key header is accepted as well as Bearer', async () => {
    const res = await request(app)
        .post(`${BASE}/contact`)
        .set('x-api-key', WRITE_KEY)
        .send({})
    assert.equal(res.status, 400)  // reached validation, so the key was accepted
})

test('unauthenticated callers cannot map which routes exist', async () => {
    const res = await request(app).get(`${BASE}/does-not-exist`)
    assert.equal(res.status, 401)
})

test('a key holder gets a truthful 404 on an unknown path', async () => {
    const res = await request(app)
        .get(`${BASE}/does-not-exist`)
        .set('Authorization', `Bearer ${WRITE_KEY}`)
    assert.equal(res.status, 404)
})

test('cross-origin browser requests get no allow-origin header', async () => {
    const res = await request(app)
        .get('/health')
        .set('Origin', 'https://redqueen.run')
    assert.equal(res.headers['access-control-allow-origin'], undefined)
})

test('the API does not answer on an /api-prefixed path', async () => {
    // The `api.` subdomain already carries that meaning; only the site-side
    // proxy path uses /api/. Both of these must miss.
    for (const path of ['/api/projects', '/api/portfolio/projects']) {
        const res = await request(app).get(path).set('Authorization', `Bearer ${WRITE_KEY}`)
        assert.equal(res.status, 404)
    }
})

// ---------------------------------------------------------------------------
// Scopes: the read-scoped key is the one the public Pages proxy holds, so it
// must not be able to write even if the proxy forwards a write.
// ---------------------------------------------------------------------------

test('a read-scoped key may read', async () => {
    const res = await request(app)
        .get(`${BASE}/projects`)
        .set('Authorization', `Bearer ${READ_KEY}`)
    // 500 here means it got past auth and tried the (absent) database.
    assert.notEqual(res.status, 401)
    assert.notEqual(res.status, 403)
})

for (const [method, path] of [
    ['post', `${BASE}/projects`],
    ['patch', `${BASE}/projects/01KT2XWJ9G63F5JVNXQFEECYJJ`],
    ['post', `${BASE}/contact`],
]) {
    test(`a read-scoped key cannot ${method.toUpperCase()} ${path}`, async () => {
        const res = await request(app)[method](path)
            .set('Authorization', `Bearer ${READ_KEY}`)
            .send({ title: 'x' })
        assert.equal(res.status, 403)
        assert.equal(res.body.error, 'Forbidden')
    })
}

// ---------------------------------------------------------------------------
// Write validation. All of these answer before any query runs.
// ---------------------------------------------------------------------------

const asWriter = (method, path) => request(app)[method](path)
    .set('Authorization', `Bearer ${WRITE_KEY}`)

test('POST projects requires a title', async () => {
    const res = await asWriter('post', `${BASE}/projects`).send({ description: 'x' })
    assert.equal(res.status, 400)
    assert.match(res.body.error, /title is required/)
})

test('POST projects rejects fields that are not writable', async () => {
    const res = await asWriter('post', `${BASE}/projects`)
        .send({ title: 'x', id: 'chosen-by-caller', created_at: '1999-01-01' })
    assert.equal(res.status, 400)
    assert.match(res.body.error, /unknown field/)
})

test('POST projects rejects a javascript: url', async () => {
    const res = await asWriter('post', `${BASE}/projects`)
        // eslint-disable-next-line no-script-url
        .send({ title: 'x', url: 'javascript:alert(1)' })
    assert.equal(res.status, 400)
    assert.match(res.body.error, /http\(s\) URL/)
})

test('PATCH projects rejects an empty body', async () => {
    const res = await asWriter('patch', `${BASE}/projects/abc`).send({})
    assert.equal(res.status, 400)
    assert.match(res.body.error, /no writable fields/)
})

test('POST contact requires all three fields', async () => {
    const res = await asWriter('post', `${BASE}/contact`).send({ name: 'Hannah' })
    assert.equal(res.status, 400)
})

test('POST contact rejects a malformed email', async () => {
    const res = await asWriter('post', `${BASE}/contact`)
        .send({ name: 'A', email: 'not-an-email', message: 'hi' })
    assert.equal(res.status, 400)
    assert.match(res.body.error, /valid address/)
})

test('malformed JSON gets a JSON error, not an HTML stack trace', async () => {
    const res = await asWriter('post', `${BASE}/contact`)
        .set('Content-Type', 'application/json')
        .send('{"name": ')
    assert.equal(res.status, 400)
    assert.equal(res.body.error, 'Invalid JSON body')
})

test('an oversized body is rejected', async () => {
    const res = await asWriter('post', `${BASE}/projects`)
        .send({ title: 'x', description: 'y'.repeat(20_000) })
    assert.equal(res.status, 413)
})
