// Unit tests for validate.js — the field whitelisting that stands between a
// write route and the database.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
    validateProjectCreate,
    validateProjectPatch,
    validateContact,
    buildUpdate,
} from '../validate.js'

test('a create keeps only whitelisted fields', () => {
    const { values } = validateProjectCreate({
        title: '  Portfolio  ',
        description: 'A site',
        url: 'https://example.com/x',
        tags: [' React ', '', 'Node'],
    })
    assert.deepEqual(values, {
        title: 'Portfolio',
        description: 'A site',
        url: 'https://example.com/x',
        tags: ['React', 'Node'],
    })
})

test('a create rejects attempts to set server-owned columns', () => {
    for (const body of [
        { title: 'x', id: 'mine' },
        { title: 'x', created_at: '1999-01-01' },
        { title: 'x', is_admin: true },
    ]) {
        assert.match(validateProjectCreate(body).error, /unknown field/)
    }
})

test('a create requires a non-blank title', () => {
    assert.match(validateProjectCreate({}).error, /title is required/)
    assert.match(validateProjectCreate({ title: '   ' }).error, /title is required/)
})

test('non-http urls are rejected', () => {
    for (const url of ['javascript:alert(1)', 'data:text/html,<script>', 'file:///etc/passwd']) {
        assert.match(validateProjectCreate({ title: 'x', url }).error, /http\(s\) URL/)
    }
})

test('oversized text and tag lists are rejected', () => {
    assert.match(validateProjectCreate({ title: 'x'.repeat(201) }).error, /200 characters/)
    assert.match(
        validateProjectCreate({ title: 'x', tags: Array(21).fill('t') }).error,
        /20 entries/
    )
    assert.match(
        validateProjectCreate({ title: 'x', tags: ['t'.repeat(41)] }).error,
        /40 characters/
    )
})

test('wrong types are rejected rather than coerced', () => {
    assert.match(validateProjectCreate({ title: 42 }).error, /must be a string/)
    assert.match(validateProjectCreate({ title: 'x', tags: 'React' }).error, /must be an array/)
    assert.match(validateProjectCreate({ title: 'x', tags: [1] }).error, /only strings/)
    assert.match(validateProjectCreate([{ title: 'x' }]).error, /JSON object/)
})

test('a patch accepts a subset but not nothing', () => {
    assert.deepEqual(validateProjectPatch({ description: 'new' }).values, { description: 'new' })
    assert.match(validateProjectPatch({}).error, /no writable fields/)
})

test('contact requires all three fields and a plausible email', () => {
    assert.match(validateContact({ name: 'A' }).error, /email is required/)
    assert.match(
        validateContact({ name: 'A', email: 'nope', message: 'hi' }).error,
        /valid address/
    )
    assert.deepEqual(
        validateContact({ name: ' A ', email: 'a@b.co', message: ' hi ' }).values,
        { name: 'A', email: 'a@b.co', message: 'hi' }
    )
})

test('a filled honeypot field marks the submission as spam', () => {
    assert.equal(
        validateContact({ name: 'A', email: 'a@b.co', message: 'hi', website: 'http://spam' }).spam,
        true
    )
    // An empty honeypot is what a real browser sends.
    assert.ok(validateContact({ name: 'A', email: 'a@b.co', message: 'hi', website: '' }).values)
})

test('buildUpdate parameterises values and takes columns from code only', () => {
    const { text, params } = buildUpdate('projects', { title: 'T', url: null }, 'id', 'abc')
    assert.equal(text, 'UPDATE projects SET title = $1, url = $2 WHERE id = $3 RETURNING *')
    assert.deepEqual(params, ['T', null, 'abc'])
})
