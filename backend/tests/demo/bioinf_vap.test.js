import { test, before } from 'node:test'
import assert from 'node:assert/strict'
import request from 'supertest'
import app from '../../server.js'

before(() => {
    process.env.BIOINF_API_TOKEN = 'test-token'
})

test('POST /api/demo/bioinf/results without auth returns 401', async () => {
    const res = await request(app)
        .post('/api/demo/bioinf/results')
        .send({ run_id: 'run-1', variants: [] })
    assert.equal(res.status, 401)
})

test('POST /api/demo/bioinf/results with wrong token returns 401', async () => {
    const res = await request(app)
        .post('/api/demo/bioinf/results')
        .set('Authorization', 'Bearer invalid-token')
        .send({ run_id: 'run-1', variants: [] })
    assert.equal(res.status, 401)
})

test('POST /api/demo/bioinf/results missing run_id returns 400', async () => {
    const res = await request(app)
        .post('/api/demo/bioinf/results')
        .set('Authorization', 'Bearer test-token')
        .send({ run_id: 'run-1' })
    assert.equal(res.status, 400)
})