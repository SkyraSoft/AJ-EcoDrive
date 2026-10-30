import { describe, it, before, after } from 'node:test'
import assert from 'node:assert'
import request from 'supertest'
import jwt from 'jsonwebtoken'
import { app } from '../src/app.js'
import { connectDB, disconnectDB, getDbStatus, query } from '../src/config/db.js'
import { runMigrations } from '../src/db/migrations.js'
import { config } from '../src/config/env.js'
import { getAdminAuthHeader, getBranchManagerAuthHeader } from './helpers/auth.helper.js'

describe('AJ EcoDrive Backend — Phase 1: Secure JWT Authentication REAL DB Suite', () => {
  let isDbReady = false
  const adminHeaders = getAdminAuthHeader()
  const pewHeaders = getBranchManagerAuthHeader('BR-01', 'Peshawar')
  const isbHeaders = getBranchManagerAuthHeader('BR-02', 'Islamabad')

  const testCustomerPew = {
    id: 'CUST-AUTH-PEW-01',
    code: 'CUS-AUTH-PEW-01',
    name: 'Peshawar Auth Test Customer',
    phone: '03001112233',
    branch_id: 'BR-01',
    branch: 'Peshawar'
  }

  const testCustomerIsb = {
    id: 'CUST-AUTH-ISB-01',
    code: 'CUS-AUTH-ISB-01',
    name: 'Islamabad Auth Test Customer',
    phone: '03004445566',
    branch_id: 'BR-02',
    branch: 'Islamabad'
  }

  before(async () => {
    isDbReady = await connectDB()
    if (isDbReady) {
      await runMigrations()
      // Clean up previous test runs
      await query('DELETE FROM `customers` WHERE `id` IN (?, ?)', [testCustomerPew.id, testCustomerIsb.id])
      // Insert branch-specific test records
      await query(
        'INSERT INTO `customers` (`id`, `code`, `name`, `phone`, `branch_id`, `branch`) VALUES (?, ?, ?, ?, ?, ?), (?, ?, ?, ?, ?, ?)',
        [
          testCustomerPew.id, testCustomerPew.code, testCustomerPew.name, testCustomerPew.phone, testCustomerPew.branch_id, testCustomerPew.branch,
          testCustomerIsb.id, testCustomerIsb.code, testCustomerIsb.name, testCustomerIsb.phone, testCustomerIsb.branch_id, testCustomerIsb.branch
        ]
      )
    }
  })

  after(async () => {
    if (isDbReady) {
      await query('DELETE FROM `customers` WHERE `id` IN (?, ?)', [testCustomerPew.id, testCustomerIsb.id])
      await disconnectDB()
    }
  })

  it('verifies MySQL database connection and all 5 auth tables exist', async () => {
    const status = getDbStatus()
    assert.strictEqual(status.isConnected, true)

    const tables = await query('SHOW TABLES')
    const tableNames = tables.map(t => Object.values(t)[0])
    assert.ok(tableNames.includes('users'), 'users table must exist')
    assert.ok(tableNames.includes('roles'), 'roles table must exist')
    assert.ok(tableNames.includes('permissions'), 'permissions table must exist')
    assert.ok(tableNames.includes('role_permissions'), 'role_permissions table must exist')
    assert.ok(tableNames.includes('branches'), 'branches table must exist')
  })

  describe('1. Login Endpoint (/api/v1/auth/login)', () => {
    it('POST /api/v1/auth/login succeeds with valid Super Admin credentials', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ username: 'admin', password: 'password123' })

      assert.strictEqual(res.status, 200)
      assert.strictEqual(res.body.ok, true)
      assert.strictEqual(typeof res.body.token, 'string')
      assert.strictEqual(res.body.tokenType, 'Bearer')
      assert.strictEqual(res.body.user.username, 'admin')
      assert.strictEqual(res.body.user.role, 'Super Admin')
      assert.strictEqual(res.body.user.isSuperAdmin, true)
    })

    it('POST /api/v1/auth/login succeeds with email identifier and bcrypt verification', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'admin@ajecodrive.com', password: 'password123' })

      assert.strictEqual(res.status, 200)
      assert.strictEqual(res.body.ok, true)
      assert.strictEqual(res.body.user.email, 'admin@ajecodrive.com')
    })

    it('POST /api/v1/auth/login succeeds for Branch Manager (Peshawar)', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ username: 'pew-01', password: 'password123' })

      assert.strictEqual(res.status, 200)
      assert.strictEqual(res.body.ok, true)
      assert.strictEqual(res.body.user.username, 'pew-01')
      assert.strictEqual(res.body.user.role, 'Branch Manager')
      assert.strictEqual(res.body.user.branch_id, 'BR-01')
      assert.strictEqual(res.body.user.isSuperAdmin, false)
    })

    it('POST /api/v1/auth/login rejects non-existent username with 401', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ username: 'ghost_user', password: 'password123' })

      assert.strictEqual(res.status, 401)
      assert.strictEqual(res.body.ok, false)
      assert.strictEqual(res.body.error, 'INVALID_CREDENTIALS')
    })

    it('POST /api/v1/auth/login rejects incorrect password with 401', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ username: 'admin', password: 'wrong_password_99' })

      assert.strictEqual(res.status, 401)
      assert.strictEqual(res.body.ok, false)
      assert.strictEqual(res.body.error, 'INVALID_CREDENTIALS')
    })

    it('POST /api/v1/auth/login rejects missing username or password with 422', async () => {
      const res1 = await request(app)
        .post('/api/v1/auth/login')
        .send({ password: 'password123' })
      assert.strictEqual(res1.status, 422)

      const res2 = await request(app)
        .post('/api/v1/auth/login')
        .send({ username: 'admin' })
      assert.strictEqual(res2.status, 422)
    })
  })

  describe('2. Protected Route Authentication & Token Verification', () => {
    it('GET /api/v1/customers rejects missing Authorization header with 401', async () => {
      const res = await request(app).get('/api/v1/customers')
      assert.strictEqual(res.status, 401)
      assert.strictEqual(res.body.ok, false)
      assert.strictEqual(res.body.error, 'UNAUTHORIZED')
      assert.ok(res.body.message.includes('No authorization token was provided'))
    })

    it('GET /api/v1/customers rejects malformed authorization header with 401', async () => {
      const res = await request(app)
        .get('/api/v1/customers')
        .set('Authorization', 'InvalidFormatHeaderWithoutBearer')

      assert.strictEqual(res.status, 401)
      assert.strictEqual(res.body.error, 'UNAUTHORIZED')
    })

    it('GET /api/v1/customers rejects invalid/forged signature JWT with 401', async () => {
      const forgedToken = jwt.sign({ username: 'hacker', role: 'Super Admin' }, 'wrong_secret_key_123')
      const res = await request(app)
        .get('/api/v1/customers')
        .set('Authorization', `Bearer ${forgedToken}`)

      assert.strictEqual(res.status, 401)
      assert.strictEqual(res.body.error, 'UNAUTHORIZED')
    })

    it('GET /api/v1/customers rejects expired JWT token with 401', async () => {
      const expiredToken = jwt.sign(
        { id: 'USR-ADMIN', role: 'Super Admin' },
        config.jwtSecret,
        { expiresIn: '-1s', issuer: 'aj-ecodrive-erp', audience: 'aj-ecodrive-client' }
      )
      const res = await request(app)
        .get('/api/v1/customers')
        .set('Authorization', `Bearer ${expiredToken}`)

      assert.strictEqual(res.status, 401)
      assert.strictEqual(res.body.error, 'UNAUTHORIZED')
      assert.ok(res.body.message.includes('expired'))
    })

    it('GET /api/v1/auth/me returns authenticated user identity derived from verified token', async () => {
      const res = await request(app)
        .get('/api/v1/auth/me')
        .set(adminHeaders)

      assert.strictEqual(res.status, 200)
      assert.strictEqual(res.body.ok, true)
      assert.strictEqual(res.body.user.username, 'admin')
      assert.strictEqual(res.body.user.role, 'Super Admin')
      assert.ok(Array.isArray(res.body.user.permissions))
    })

    it('POST /api/v1/auth/logout returns 200 OK', async () => {
      const res = await request(app).post('/api/v1/auth/logout')
      assert.strictEqual(res.status, 200)
      assert.strictEqual(res.body.ok, true)
    })
  })

  describe('3. Multi-Tenant Branch Isolation & Cross-Branch IDOR Protection', () => {
    it('Branch Manager (Peshawar) can only see Peshawar customers, never Islamabad customers', async () => {
      const res = await request(app)
        .get('/api/v1/customers')
        .set(pewHeaders)

      assert.strictEqual(res.status, 200)
      assert.ok(Array.isArray(res.body))
      const ids = res.body.map(c => c.id)
      assert.ok(ids.includes(testCustomerPew.id), 'Must include Peshawar customer')
      assert.strictEqual(ids.includes(testCustomerIsb.id), false, 'Must NOT include Islamabad customer')
    })

    it('Branch Manager (Peshawar) cannot bypass branch scoping by passing ?branch_id=BR-02 in query', async () => {
      const res = await request(app)
        .get('/api/v1/customers?branch_id=BR-02')
        .set(pewHeaders)

      assert.strictEqual(res.status, 200)
      const ids = res.body.map(c => c.id)
      assert.ok(ids.includes(testCustomerPew.id), 'Query override must be ignored; user stays locked to BR-01')
      assert.strictEqual(ids.includes(testCustomerIsb.id), false, 'Islamabad customer must not be returned')
    })

    it('Cross-Branch IDOR: Branch Manager (Peshawar) GET /customers/:id for Islamabad record returns 403 Forbidden', async () => {
      const res = await request(app)
        .get(`/api/v1/customers/${testCustomerIsb.id}`)
        .set(pewHeaders)

      assert.strictEqual(res.status, 403)
      assert.strictEqual(res.body.ok, false)
      assert.strictEqual(res.body.error, 'FORBIDDEN')
      assert.ok(res.body.message.includes('permission to access resources belonging to other branches'))
    })

    it('Cross-Branch IDOR: Branch Manager (Peshawar) PUT /customers/:id for Islamabad record returns 403 Forbidden', async () => {
      const res = await request(app)
        .put(`/api/v1/customers/${testCustomerIsb.id}`)
        .set(pewHeaders)
        .send({ name: 'Tampered Name' })

      assert.strictEqual(res.status, 403)
      assert.strictEqual(res.body.ok, false)
      assert.strictEqual(res.body.error, 'FORBIDDEN')
    })

    it('Cross-Branch IDOR: Branch Manager (Peshawar) DELETE /customers/:id for Islamabad record returns 403 Forbidden', async () => {
      const res = await request(app)
        .delete(`/api/v1/customers/${testCustomerIsb.id}`)
        .set(pewHeaders)

      assert.strictEqual(res.status, 403)
      assert.strictEqual(res.body.ok, false)
      assert.strictEqual(res.body.error, 'FORBIDDEN')
    })

    it('Super Admin can access records across all branches without 403', async () => {
      const resPew = await request(app)
        .get(`/api/v1/customers/${testCustomerPew.id}`)
        .set(adminHeaders)
      assert.strictEqual(resPew.status, 200)

      const resIsb = await request(app)
        .get(`/api/v1/customers/${testCustomerIsb.id}`)
        .set(adminHeaders)
      assert.strictEqual(resIsb.status, 200)
    })
  })
})
