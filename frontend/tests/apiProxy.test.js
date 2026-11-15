// Tests for the Pages Function that proxies the UI's same-origin /api/* calls
// to the private backend API. The point of these is the allowlist and the key
// handling: the proxy is public, so what it refuses to forward matters as much
// as what it forwards.
import { describe, test, expect, beforeEach, vi, afterEach } from 'vitest'
import { onRequest } from '../functions/api/[[path]].js'

const ENV = { API_BASE_URL: 'https://api.redqueen.run', API_KEY: 'k'.repeat(40) }

/** Invoke the Function the way the Pages runtime does. */
function call(path, { method = 'GET', body, env = ENV, headers = {} } = {}) {
    const request = new Request(`https://redqueen.run/api/${path}`, {
        method,
        headers: body !== undefined ? { 'content-type': 'application/json', ...headers } : headers,
        body,
    })
    return onRequest({ request, env, params: { path: path.split('/') } })
}

// A fresh Response per call: a Response body can only be read once, so a
// single shared instance would break any test that proxies twice.
function upstreamReturns(status, payload) {
    return vi.fn(async () => new Response(
        JSON.stringify(payload),
        { status, headers: { 'content-type': 'application/json' } }
    ))
}

beforeEach(() => {
    vi.stubGlobal('fetch', upstreamReturns(200, [{ id: '1' }]))
    vi.spyOn(console, 'error').mockImplementation(() => { })
})

afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
})

describe('allowlisted routes', () => {
    test('GET /api/portfolio/projects is forwarded, dropping the /api prefix', async () => {
        const res = await call('portfolio/projects')
        expect(res.status).toBe(200)
        expect(fetch).toHaveBeenCalledOnce()
        expect(fetch.mock.calls[0][0]).toBe('https://api.redqueen.run/portfolio/projects')
    })

    test('the API key is attached server-side and the visitor never sees it', async () => {
        const res = await call('portfolio/projects')
        expect(fetch.mock.calls[0][1].headers.authorization).toBe(`Bearer ${ENV.API_KEY}`)
        expect(JSON.stringify([...res.headers])).not.toContain(ENV.API_KEY)
        expect(await res.text()).not.toContain(ENV.API_KEY)
    })

    test('anonymous writes are forwarded with their body', async () => {
        const body = JSON.stringify({ name: 'A', email: 'a@b.c', message: 'hi' })
        await call('portfolio/contact', { method: 'POST', body })
        expect(fetch.mock.calls[0][1].method).toBe('POST')
        expect(fetch.mock.calls[0][1].body).toBe(body)
    })

    test("the visitor's IP is passed through for upstream rate limiting", async () => {
        await call('portfolio/projects', { headers: { 'cf-connecting-ip': '203.0.113.7' } })
        expect(fetch.mock.calls[0][1].headers['x-forwarded-for']).toBe('203.0.113.7')
    })
})

describe('everything not allowlisted is refused at the edge', () => {
    test.each([
        ['portfolio/users', 'GET'],       // private route
        ['portfolio/projects', 'POST'],   // content write
        ['portfolio/projects', 'PATCH'],  // content write
        ['portfolio/projects', 'DELETE'],
        ['portfolio/contact', 'GET'],     // reading others' messages
        ['portfolio/main', 'GET'],        // not built yet, so not listed
        ['portfolio/guestbook', 'POST'],  // not built yet, so not listed
        ['projects', 'GET'],              // the old unprefixed path
        ['nope', 'GET'],                  // unknown
        ['portfolio/projects/1/secret', 'GET'],
    ])('%s %s gets 404 and never reaches the API', async (route, method) => {
        const res = await call(route, { method, body: method === 'GET' ? undefined : '{}' })
        expect(res.status).toBe(404)
        expect(fetch).not.toHaveBeenCalled()
    })
})

describe('request hygiene', () => {
    test('a client-supplied Authorization header cannot override the key', async () => {
        await call('portfolio/projects', { headers: { authorization: 'Bearer attacker-key' } })
        expect(fetch.mock.calls[0][1].headers.authorization).toBe(`Bearer ${ENV.API_KEY}`)
    })

    test('an oversized body is rejected before the API is called', async () => {
        const res = await call('portfolio/contact', { method: 'POST', body: 'x'.repeat(9 * 1024) })
        expect(res.status).toBe(413)
        expect(fetch).not.toHaveBeenCalled()
    })

    test('a malformed JSON body is rejected before the API is called', async () => {
        const res = await call('portfolio/contact', { method: 'POST', body: 'not json' })
        expect(res.status).toBe(400)
        expect(fetch).not.toHaveBeenCalled()
    })
})

describe('failure modes', () => {
    test('missing configuration fails closed without leaking why', async () => {
        const res = await call('portfolio/projects', { env: {} })
        expect(res.status).toBe(503)
        expect(fetch).not.toHaveBeenCalled()
        expect(await res.json()).toEqual({ error: 'Service unavailable' })
    })

    test('a 401 from the API is reported as 502, not passed to the visitor', async () => {
        // Our key being revoked is our problem; a visitor must not be handed an
        // auth failure that invites them to try supplying credentials.
        vi.stubGlobal('fetch', upstreamReturns(401, { error: 'Unauthorized' }))
        const res = await call('portfolio/projects')
        expect(res.status).toBe(502)
        expect(await res.json()).toEqual({ error: 'Upstream request failed' })
    })

    test('a 403 from the API is reported as 502 (read-scoped key hit a write)', async () => {
        vi.stubGlobal('fetch', upstreamReturns(403, { error: 'Forbidden' }))
        const res = await call('portfolio/projects')
        expect(res.status).toBe(502)
    })

    test('an upstream 404 is passed through', async () => {
        vi.stubGlobal('fetch', upstreamReturns(404, { error: 'Not found' }))
        const res = await call('portfolio/projects')
        expect(res.status).toBe(404)
    })

    test('an upstream network failure becomes a 502', async () => {
        vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('timeout')))
        const res = await call('portfolio/projects')
        expect(res.status).toBe(502)
    })

    test('reads are cacheable, writes are not', async () => {
        const read = await call('portfolio/projects')
        expect(read.headers.get('cache-control')).toContain('max-age=60')
        const write = await call('portfolio/contact', { method: 'POST', body: '{}' })
        expect(write.headers.get('cache-control')).toBe('no-store')
    })
})
