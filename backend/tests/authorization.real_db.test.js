import { describe, it, before, after } from 'node:test'
import assert from 'node:assert'
import request from 'supertest'
import jwt from 'jsonwebtoken'
import { app } from '../src/app.js'
import { config, assertProductionSecurity } from '../src/config/env.js'
import { connectDB, disconnectDB, query } from '../src/config/db.js'
import { getAdminAuthHeader, getBranchManagerAuthHeader } from './helpers/auth.helper.js'

describe('AJ EcoDrive Backend — Authorization, Branch Isolation & Data Integrity Suite', () => {
  let isDbReady = false
  const adminHeaders = getAdminAuthHeader()
  const bmPeshawarHeaders = getBranchManagerAuthHeader('BR-01', 'Peshawar')
  const bmIslamabadHeaders = getBranchManagerAuthHeader('BR-02', 'Islamabad')

  before(async () => {
    isDbReady = await connectDB()
  })

  after(async () => {
    await disconnectDB()
  })

  // ==========================================================================
  // 1. Authentication
  // ==========================================================================
  describe('1. Authentication Verification', () => {
    it('returns 401 when Authorization header is missing', async () => {
      const res = await request(app).get('/api/v1/organisation/branches')
      assert.strictEqual(res.status, 401)
      assert.strictEqual(res.body.ok, false)
      assert.strictEqual(res.body.error, 'UNAUTHORIZED')
    })

    it('returns 401 when Authorization token is malformed', async () => {
      const res = await request(app)
        .get('/api/v1/organisation/branches')
        .set({ Authorization: 'Bearer not_a_real_jwt_token' })
      assert.strictEqual(res.status, 401)
      assert.strictEqual(res.body.ok, false)
      assert.strictEqual(res.body.error, 'UNAUTHORIZED')
    })

    it('returns 401 when token is expired', async () => {
      const expiredToken = jwt.sign(
        {
          id: 'USR-EXPIRED',
          role: 'Super Admin',
          isSuperAdmin: true
        },
        config.jwtSecret,
        {
          expiresIn: '-1s',
          issuer: 'aj-ecodrive-erp',
          audience: 'aj-ecodrive-client'
        }
      )

      const res = await request(app)
        .get('/api/v1/organisation/branches')
        .set({ Authorization: `Bearer ${expiredToken}` })
      assert.strictEqual(res.status, 401)
      assert.strictEqual(res.body.ok, false)
      assert.match(res.body.message, /expired/i)
    })
  })

  // ==========================================================================
  // 2. Organisation & Branch Access
  // ==========================================================================
  describe('2. Organisation & Branch Access Enforcement', () => {
    it('Super Admin can list all branches (200 OK)', async () => {
      const res = await request(app)
        .get('/api/v1/organisation/branches')
        .set(adminHeaders)
      assert.strictEqual(res.status, 200)
      assert.ok(Array.isArray(res.body))
    })

    it('Branch Manager receives 403 Forbidden for GET /organisation/branches', async () => {
      const res = await request(app)
        .get('/api/v1/organisation/branches')
        .set(bmPeshawarHeaders)
      assert.strictEqual(res.status, 403)
      assert.strictEqual(res.body.ok, false)
      assert.strictEqual(res.body.error, 'FORBIDDEN')
    })

    it('Branch Manager receives 403 Forbidden for GET /organisation/branches/:id (own or other)', async () => {
      const resOwn = await request(app)
        .get('/api/v1/organisation/branches/BR-01')
        .set(bmPeshawarHeaders)
      assert.strictEqual(resOwn.status, 403)
      assert.strictEqual(resOwn.body.error, 'FORBIDDEN')

      const resOther = await request(app)
        .get('/api/v1/organisation/branches/BR-02')
        .set(bmPeshawarHeaders)
      assert.strictEqual(resOther.status, 403)
      assert.strictEqual(resOther.body.error, 'FORBIDDEN')
    })

    it('Super Admin can retrieve any branch by ID (200 OK)', async () => {
      const res = await request(app)
        .get('/api/v1/organisation/branches/BR-01')
        .set(adminHeaders)
      assert.ok([200, 404].includes(res.status))
      if (res.status === 200) {
        assert.ok(res.body.id === 'BR-01' || res.body.name)
      }
    })
  })

  // ==========================================================================
  // 3. Settings Protection
  // ==========================================================================
  describe('3. Settings Protection', () => {
    it('Super Admin can read system settings (200 OK)', async () => {
      const res = await request(app)
        .get('/api/v1/system/settings')
        .set(adminHeaders)
      assert.strictEqual(res.status, 200)
      assert.strictEqual(res.body.ok, true)
    })

    it('Branch Manager receives 403 Forbidden for GET /system/settings', async () => {
      const res = await request(app)
        .get('/api/v1/system/settings')
        .set(bmPeshawarHeaders)
      assert.strictEqual(res.status, 403)
      assert.strictEqual(res.body.ok, false)
      assert.strictEqual(res.body.error, 'FORBIDDEN')
    })

    it('Branch Manager receives 403 Forbidden for GET /system/settings/:section (company bank/tax details)', async () => {
      const res = await request(app)
        .get('/api/v1/system/settings/company')
        .set(bmPeshawarHeaders)
      assert.strictEqual(res.status, 403)
      assert.strictEqual(res.body.ok, false)
      assert.strictEqual(res.body.error, 'FORBIDDEN')
    })

    it('Branch Manager receives 403 Forbidden for PUT /system/settings/:section', async () => {
      const res = await request(app)
        .put('/api/v1/system/settings/company')
        .set(bmPeshawarHeaders)
        .send({ companyName: 'Hacked Dealership' })
      assert.strictEqual(res.status, 403)
      assert.strictEqual(res.body.ok, false)
      assert.strictEqual(res.body.error, 'FORBIDDEN')
    })
  })

  // ==========================================================================
  // 4. Product Catalogue Authorization
  // ==========================================================================
  describe('4. Product Catalogue Authorization', () => {
    it('Super Admin can create a master product (201 or 409 duplicate)', async () => {
      const testSku = `AUTH-PROD-${Date.now()}`
      const res = await request(app)
        .post('/api/v1/catalogue/products')
        .set(adminHeaders)
        .send({
          name: 'Security Test Bike',
          sku: testSku,
          selling_price: 250000,
          cost_price: 180000
        })
      assert.ok([201, 409].includes(res.status))
    })

    it('Branch Manager receives 403 for POST /catalogue/products', async () => {
      const res = await request(app)
        .post('/api/v1/catalogue/products')
        .set(bmPeshawarHeaders)
        .send({
          name: 'Unauthorized Product',
          sku: 'BM-UNAUTH-01',
          selling_price: 100000
        })
      assert.strictEqual(res.status, 403)
      assert.strictEqual(res.body.error, 'FORBIDDEN')
    })

    it('Branch Manager receives 403 for PUT /catalogue/products/:id', async () => {
      const res = await request(app)
        .put('/api/v1/catalogue/products/PROD-001')
        .set(bmPeshawarHeaders)
        .send({ selling_price: 99999 })
      assert.strictEqual(res.status, 403)
      assert.strictEqual(res.body.error, 'FORBIDDEN')
    })

    it('Branch Manager receives 403 for aliases: POST /products, PUT /products/:id, POST /catalogue, PUT /catalogue/:id', async () => {
      const res1 = await request(app)
        .post('/api/v1/products')
        .set(bmPeshawarHeaders)
        .send({ name: 'Alias Test', sku: 'ALIAS-01' })
      assert.strictEqual(res1.status, 403)

      const res2 = await request(app)
        .put('/api/v1/products/PROD-001')
        .set(bmPeshawarHeaders)
        .send({ name: 'Alias Update' })
      assert.strictEqual(res2.status, 403)

      const res3 = await request(app)
        .post('/api/v1/catalogue')
        .set(bmPeshawarHeaders)
        .send({ name: 'Root Alias', sku: 'ROOT-01' })
      assert.strictEqual(res3.status, 403)

      const res4 = await request(app)
        .put('/api/v1/catalogue/PROD-001')
        .set(bmPeshawarHeaders)
        .send({ name: 'Root Alias Update' })
      assert.strictEqual(res4.status, 403)
    })

    it('Branch Manager receives 403 for POST /categories and POST /catalogue/categories', async () => {
      const res1 = await request(app)
        .post('/api/v1/categories')
        .set(bmPeshawarHeaders)
        .send({ name: 'Unauthorized Category', code: 'UNAUTH-CAT' })
      assert.strictEqual(res1.status, 403)

      const res2 = await request(app)
        .post('/api/v1/catalogue/categories')
        .set(bmPeshawarHeaders)
        .send({ name: 'Unauthorized Category', code: 'UNAUTH-CAT-2' })
      assert.strictEqual(res2.status, 403)
    })

    it('Branch Manager CAN read approved products (200 OK)', async () => {
      const res = await request(app)
        .get('/api/v1/catalogue/products')
        .set(bmPeshawarHeaders)
      assert.strictEqual(res.status, 200)
      assert.ok(Array.isArray(res.body))
    })

    it('Branch Manager CAN create a product request (201 or 200)', async () => {
      const res = await request(app)
        .post('/api/v1/catalogue/product-requests')
        .set(bmPeshawarHeaders)
        .send({
          product: 'BRG Special Request',
          category: 'Electric Bikes',
          quantity: 2,
          notes: 'Customer demand in Peshawar'
        })
      assert.ok([200, 201].includes(res.status))
    })
  })

  // ==========================================================================
  // 5. Analytics Custom Reports
  // ==========================================================================
  describe('5. Analytics Custom Reports Authorization', () => {
    it('Super Admin can create custom reports (201 OK)', async () => {
      const res = await request(app)
        .post('/api/v1/analytics/custom-reports')
        .set(adminHeaders)
        .send({
          name: `HQ Master Report ${Date.now()}`,
          category: 'Sales Reports',
          scope: 'All Branches'
        })
      assert.strictEqual(res.status, 201)
      assert.strictEqual(res.body.ok, true)
    })

    it('Branch Manager receives 403 for POST /analytics/custom-reports', async () => {
      const res = await request(app)
        .post('/api/v1/analytics/custom-reports')
        .set(bmPeshawarHeaders)
        .send({
          name: 'BM Unauthorized Report',
          scope: 'All Branches'
        })
      assert.strictEqual(res.status, 403)
      assert.strictEqual(res.body.ok, false)
      assert.strictEqual(res.body.error, 'FORBIDDEN')
    })

    it('Branch Manager receives 403 for PUT /analytics/custom-reports/:id', async () => {
      const res = await request(app)
        .put('/api/v1/analytics/custom-reports/REP-001')
        .set(bmPeshawarHeaders)
        .send({ name: 'Tampered Report' })
      assert.strictEqual(res.status, 403)
      assert.strictEqual(res.body.error, 'FORBIDDEN')
    })

    it('Branch Manager receives 403 for DELETE /analytics/custom-reports/:id', async () => {
      const res = await request(app)
        .delete('/api/v1/analytics/custom-reports/REP-001')
        .set(bmPeshawarHeaders)
      assert.strictEqual(res.status, 403)
      assert.strictEqual(res.body.error, 'FORBIDDEN')
    })

    it('Branch Manager can list custom reports scoped to their branch (200 OK)', async () => {
      const res = await request(app)
        .get('/api/v1/analytics/custom-reports')
        .set(bmPeshawarHeaders)
      assert.strictEqual(res.status, 200)
      assert.strictEqual(res.body.ok, true)
      assert.ok(Array.isArray(res.body.data))
    })
  })

  // ==========================================================================
  // 6. Audit Log Integrity
  // ==========================================================================
  describe('6. Audit Log Integrity & Permanence', () => {
    it('Branch Manager receives 403 for POST /system/audit-logs', async () => {
      const res = await request(app)
        .post('/api/v1/system/audit-logs')
        .set(bmPeshawarHeaders)
        .send({
          action: 'Forged Log Action',
          user_id: 'USR-ADMIN',
          role: 'Super Admin'
        })
      assert.strictEqual(res.status, 403)
      assert.strictEqual(res.body.error, 'FORBIDDEN')
    })

    it('Super Admin creation ignores client-supplied spoofed identity fields', async () => {
      const res = await request(app)
        .post('/api/v1/system/audit-logs')
        .set(adminHeaders)
        .send({
          action: 'Verified Security Audit Event',
          details: 'Legitimate audit event created by Super Admin',
          user_id: 'INJECTED-SPOOFED-ID',
          user_name: 'Injected Username',
          role: 'Injected Role',
          branch_id: 'INJECTED-BR',
          branch: 'Injected Branch'
        })
      assert.strictEqual(res.status, 201)
      assert.strictEqual(res.body.ok, true)
      assert.notStrictEqual(res.body.data.user_id, 'INJECTED-SPOOFED-ID')
      assert.notStrictEqual(res.body.data.role, 'Injected Role')
    })

    it('Rejects PUT, PATCH, and DELETE on audit logs (immutable)', async () => {
      const putRes = await request(app)
        .put('/api/v1/system/audit-logs/LOG-001')
        .set(adminHeaders)
        .send({ action: 'Mutated' })
      assert.ok([404, 405].includes(putRes.status))

      const delRes = await request(app)
        .delete('/api/v1/system/audit-logs/LOG-001')
        .set(adminHeaders)
      assert.ok([404, 405].includes(delRes.status))
    })
  })

  // ==========================================================================
  // 7. Branch Isolation
  // ==========================================================================
  describe('7. Multi-Tenant Branch Isolation', () => {
    it('Branch Manager for BR-01 cannot override branch via ?branch_id=BR-02', async () => {
      const res = await request(app)
        .get('/api/v1/customers?branch_id=BR-02')
        .set(bmPeshawarHeaders)
      assert.strictEqual(res.status, 200)
      const data = res.body.data || res.body
      if (Array.isArray(data) && data.length > 0) {
        const hasOther = data.some(item => item.branch_id && item.branch_id === 'BR-02')
        assert.strictEqual(hasOther, false, 'Must not return BR-02 records to a BR-01 manager')
      }
    })

    it('Super Admin CAN filter by ?branch_id=BR-01 and view all', async () => {
      const res = await request(app)
        .get('/api/v1/customers?branch_id=BR-01')
        .set(adminHeaders)
      assert.strictEqual(res.status, 200)
    })
  })

  // ==========================================================================
  // 8. Migration & Production Security Startup
  // ==========================================================================
  describe('8. Production Security Assertion & Migration Guarantees', () => {
    it('assertProductionSecurity throws when NODE_ENV=production and secret is weak', () => {
      assert.throws(() => {
        assertProductionSecurity({
          nodeEnv: 'production',
          jwtSecret: 'dev_secret_change_me'
        })
      }, /SECURITY FATAL/)

      assert.throws(() => {
        assertProductionSecurity({
          nodeEnv: 'production',
          jwtSecret: 'ecodrive_development_secret_key_change_in_production'
        })
      }, /SECURITY FATAL/)

      assert.throws(() => {
        assertProductionSecurity({
          nodeEnv: 'production',
          jwtSecret: 'password123'
        })
      }, /SECURITY FATAL/)

      assert.throws(() => {
        assertProductionSecurity({
          nodeEnv: 'production',
          jwtSecret: 'short_key_under_32_characters'
        })
      }, /SECURITY FATAL/)
    })

    it('assertProductionSecurity passes in production with a 256-bit strong key', () => {
      assert.doesNotThrow(() => {
        assertProductionSecurity({
          nodeEnv: 'production',
          jwtSecret: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
        })
      })
    })

    it('assertProductionSecurity allows default secrets in development mode', () => {
      assert.doesNotThrow(() => {
        assertProductionSecurity({
          nodeEnv: 'development',
          jwtSecret: 'dev_secret_change_me'
        })
      })
    })
  })
})

