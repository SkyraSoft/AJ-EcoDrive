import { after, describe, it } from 'node:test'
import assert from 'node:assert'
import { app } from '../src/app.js'

// Simple HTTP request helper using Node built-in fetch or app listener
import http from 'node:http'

function startTestServer() {
  return new Promise((resolve) => {
    const server = http.createServer(app)
    server.listen(0, '127.0.0.1', () => {
      const port = server.address().port
      resolve({
        server,
        baseUrl: `http://127.0.0.1:${port}`
      })
    })
  })
}

describe('AJ EcoDrive Backend — Multi-Client CORS Verification Suite', async () => {
  const { server, baseUrl } = await startTestServer()

  // TEST A: Origin: http://tauri.localhost -> Expected: Allowed
  it('TEST A: Origin http://tauri.localhost receives Access-Control-Allow-Origin header', async () => {
    const res = await fetch(`${baseUrl}/api/v1/health`, {
      headers: { 'Origin': 'http://tauri.localhost' }
    })
    assert.strictEqual(res.headers.get('access-control-allow-origin'), 'http://tauri.localhost')
    assert.strictEqual(res.headers.get('access-control-allow-credentials'), 'true')
  })

  // TEST B: Origin: https://aj-eco-drive.vercel.app -> Expected: Allowed
  it('TEST B: Origin https://aj-eco-drive.vercel.app receives Access-Control-Allow-Origin header', async () => {
    const res = await fetch(`${baseUrl}/api/v1/health`, {
      headers: { 'Origin': 'https://aj-eco-drive.vercel.app' }
    })
    assert.strictEqual(res.headers.get('access-control-allow-origin'), 'https://aj-eco-drive.vercel.app')
    assert.strictEqual(res.headers.get('access-control-allow-credentials'), 'true')
  })

  // TEST C: Origin: https://ecodrive.skyrasoft.com -> Expected: Allowed
  it('TEST C: Origin https://ecodrive.skyrasoft.com receives Access-Control-Allow-Origin header', async () => {
    const res = await fetch(`${baseUrl}/api/v1/health`, {
      headers: { 'Origin': 'https://ecodrive.skyrasoft.com' }
    })
    assert.strictEqual(res.headers.get('access-control-allow-origin'), 'https://ecodrive.skyrasoft.com')
    assert.strictEqual(res.headers.get('access-control-allow-credentials'), 'true')
  })

  // TEST D: Origin: https://unauthorized-example.com -> Expected: No Access-Control-Allow-Origin header
  it('TEST D: Unauthorized origin receives NO Access-Control-Allow-Origin header and no 500 error', async () => {
    const res = await fetch(`${baseUrl}/api/v1/health`, {
      headers: { 'Origin': 'https://unauthorized-example.com' }
    })
    assert.strictEqual(res.headers.get('access-control-allow-origin'), null)
    // Server should not throw a 500 internal server error due to CORS rejection
    assert.notStrictEqual(res.status, 500)
  })

  // TEST E: OPTIONS /api/v1/auth/login with Origin: http://tauri.localhost
  it('TEST E: Preflight OPTIONS /api/v1/auth/login succeeds with 204/200 and allowed headers', async () => {
    const res = await fetch(`${baseUrl}/api/v1/auth/login`, {
      method: 'OPTIONS',
      headers: {
        'Origin': 'http://tauri.localhost',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type, Authorization, X-Branch-ID'
      }
    })
    assert.ok(res.status === 200 || res.status === 204, `Preflight status was ${res.status}`)
    assert.strictEqual(res.headers.get('access-control-allow-origin'), 'http://tauri.localhost')
    assert.strictEqual(res.headers.get('access-control-allow-credentials'), 'true')
    const allowMethods = res.headers.get('access-control-allow-methods') || ''
    assert.ok(allowMethods.includes('POST'), 'Allow methods must include POST')
  })

  // TEST F: GET /api/v1/health with Origin: http://tauri.localhost
  it('TEST F: GET /api/v1/health with Origin: http://tauri.localhost returns 200 with correct CORS headers', async () => {
    const res = await fetch(`${baseUrl}/api/v1/health`, {
      headers: { 'Origin': 'http://tauri.localhost' }
    })
    assert.strictEqual(res.status, 200)
    assert.strictEqual(res.headers.get('access-control-allow-origin'), 'http://tauri.localhost')
    assert.strictEqual(res.headers.get('access-control-allow-credentials'), 'true')
    const json = await res.json()
    assert.strictEqual(json.ok, true)
    assert.strictEqual(json.service, 'AJ EcoDrive ERP Backend API')
  })

  after(() => new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve())))
})
