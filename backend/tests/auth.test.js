// Unit tests for the key parsing / loading rules in middleware/auth.js.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { parseApiKeys, loadApiKeys } from '../middleware/auth.js'

const LONG = 'a'.repeat(40)

test('parseApiKeys reads label, scope and key', () => {
    assert.deepEqual(parseApiKeys(` laptop:write:${LONG} , proxy:read:${LONG} `), [
        { label: 'laptop', scope: 'write', secret: LONG },
        { label: 'proxy', scope: 'read', secret: LONG },
    ])
})

test('parseApiKeys treats only the first two colons as structural', () => {
    const secret = `part1:part2:${LONG}`
    assert.deepEqual(parseApiKeys(`ci:write:${secret}`), [
        { label: 'ci', scope: 'write', secret },
    ])
})

test('loadApiKeys refuses to start with no keys configured', () => {
    assert.throws(() => loadApiKeys({}), /API_KEYS is not set/)
    assert.throws(() => loadApiKeys({ API_KEYS: '  ,  ' }), /API_KEYS is not set/)
})

test('loadApiKeys rejects an entry with no explicit scope', () => {
    // The dangerous case: an old-format `label:key` entry must NOT be read as
    // a key with a default scope, or a proxy key silently gains write access.
    assert.throws(() => loadApiKeys({ API_KEYS: `laptop:${LONG}` }), /malformed/)
})

test('loadApiKeys rejects an unrecognised scope', () => {
    assert.throws(() => loadApiKeys({ API_KEYS: `laptop:admin:${LONG}` }), /invalid scope/)
})

test('loadApiKeys rejects keys too short to resist guessing', () => {
    assert.throws(() => loadApiKeys({ API_KEYS: 'laptop:write:hunter2' }), /shorter than 32/)
})

test('loadApiKeys never retains the plaintext secret', () => {
    const [key] = loadApiKeys({ API_KEYS: `laptop:write:${LONG}` })
    assert.equal(key.label, 'laptop')
    assert.equal(key.scope, 'write')
    assert.ok(Buffer.isBuffer(key.hash))
    assert.ok(!JSON.stringify(key).includes(LONG))
})
