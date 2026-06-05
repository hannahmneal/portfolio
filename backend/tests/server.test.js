import { test } from 'node:test'
import assert from 'node:assert/strict'
import request from 'supertest'
import app from '../server.js'

test('GET /health returns ok', async () => {
    const res = await request(app).get('/health')
    assert.equal(res.status, 200)
    assert.equal(res.body.status, 'ok')
})

test('POST /api/contact with missing fields returns 400', async () => {
    const res = await request(app)
        .post('/api/contact')
        .send({ name: 'Hannah' })  // missing email and message
    assert.equal(res.status, 400)
})