import { describe, it, after } from 'node:test'
import assert from 'node:assert'
import request from 'supertest'
import { app } from '../src/app.js'
import { disconnectDB } from '../src/config/db.js'

describe('AJ EcoDrive Backend — Step 1 Architecture & Health Suite', () => {
  it('GET / should return root gateway metadata', async () => {
    const res = await request(app).get('/')
    assert.strictEqual(res.status, 200)
    assert.strictEqual(res.body.ok, true)
    assert.strictEqual(res.body.service, 'AJ EcoDrive ERP Backend Gateway')
    assert.strictEqual(res.body.health, '/api/v1/health')
  })

  it('GET /api/v1 should return API version index', async () => {
    const res = await request(app).get('/api/v1')
    assert.strictEqual(res.status, 200)
    assert.strictEqual(res.body.ok, true)
    assert.strictEqual(res.body.version, '1.0.0')
  })

  it('GET /api/v1/health should return 200 and operational health metadata', async () => {
    const res = await request(app).get('/api/v1/health')
    assert.strictEqual(res.status, 200)
    assert.strictEqual(res.body.ok, true)
    assert.strictEqual(typeof res.body.uptime, 'string')
    assert.strictEqual(typeof res.body.timestamp, 'string')
    assert.ok(res.body.database, 'Database status object must be present')
    assert.strictEqual(res.body.database.type, 'mysql')
    assert.strictEqual(typeof res.body.database.isConnected, 'boolean')
    assert.strictEqual(typeof res.body.database.status, 'string')
  })

  it('GET /api/v1/unregistered-route should return JSON 404 error format', async () => {
    const res = await request(app).get('/api/v1/unregistered-route')
    assert.strictEqual(res.status, 404)
    assert.strictEqual(res.body.ok, false)
    assert.strictEqual(res.body.error, 'NOT_FOUND')
    assert.ok(res.body.message.includes('Endpoint not found'))
  })

  it('OPTIONS /api/v1/health should allow frontend origin with CORS headers', async () => {
    const res = await request(app)
      .options('/api/v1/health')
      .set('Origin', 'http://localhost:5173')
      .set('Access-Control-Request-Method', 'GET')
      .set('Access-Control-Request-Headers', 'Authorization,X-Branch-ID')

    assert.strictEqual(res.status, 204)
    assert.strictEqual(res.headers['access-control-allow-origin'], 'http://localhost:5173')
  })

  after(async () => {
    await disconnectDB()
  })
})
