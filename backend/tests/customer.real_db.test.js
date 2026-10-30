import { describe, it, before, after } from 'node:test'
import assert from 'node:assert'
import request from 'supertest'
import { app } from '../src/app.js'
import { connectDB, disconnectDB, getDbStatus, query } from '../src/config/db.js'
import { runMigrations } from '../src/db/migrations.js'
import { getAdminAuthHeader } from './helpers/auth.helper.js'

describe('AJ EcoDrive Backend — Customer Module REAL MySQL Database Suite', () => {
  let isDbReady = false
  const adminHeaders = getAdminAuthHeader()
  const testCustomerId = 'CUST-TEST-INT-01'
  const testCustomerCode = 'CUS-TEST-INT-01'

  before(async () => {
    isDbReady = await connectDB()
    if (isDbReady) {
      await runMigrations()
      // Clean up any leftovers from previous test runs
      await query('DELETE FROM `customers` WHERE `id` = ? OR `code` = ?', [testCustomerId, testCustomerCode])
    }
  })

  after(async () => {
    if (isDbReady) {
      // Clean up test data
      await query('DELETE FROM `customers` WHERE `id` = ? OR `code` = ?', [testCustomerId, testCustomerCode])
      await disconnectDB()
    }
  })

  it('verifies MySQL database connection is live and active', () => {
    const status = getDbStatus()
    assert.strictEqual(status.isConnected, true, 'Real MySQL database connection must be active for this test suite')
    assert.strictEqual(status.type, 'mysql')
  })

  describe('Validation Enforcement (HTTP 422)', () => {
    it('POST /api/v1/customers rejects empty customer name with 422', async () => {
      const res = await request(app)
        .post('/api/v1/customers')
        .set(adminHeaders)
        .send({ phone: '03001234567' })

      assert.strictEqual(res.status, 422)
      assert.strictEqual(res.body.ok, false)
      assert.strictEqual(res.body.error, 'VALIDATION_FAILED')
      assert.ok(res.body.errors.some(e => e.field === 'name'))
    })

    it('POST /api/v1/customers rejects empty phone with 422', async () => {
      const res = await request(app)
        .post('/api/v1/customers')
        .set(adminHeaders)
        .send({ name: 'Valid Name' })

      assert.strictEqual(res.status, 422)
      assert.strictEqual(res.body.ok, false)
      assert.strictEqual(res.body.error, 'VALIDATION_FAILED')
      assert.ok(res.body.errors.some(e => e.field === 'phone'))
    })

    it('POST /api/v1/customers rejects invalid CNIC format with 422', async () => {
      const res = await request(app)
        .post('/api/v1/customers')
        .set(adminHeaders)
        .send({ name: 'Valid Name', phone: '03001234567', cnic: '123' })

      assert.strictEqual(res.status, 422)
      assert.strictEqual(res.body.ok, false)
      assert.ok(res.body.errors.some(e => e.field === 'cnic'))
    })
  })

  describe('Real Database Persistence Lifecycle (CRUD)', () => {
    it('POST /api/v1/customers creates and permanently stores record in MySQL', async () => {
      const payload = {
        id: testCustomerId,
        code: testCustomerCode,
        name: 'Automated DB Test Customer',
        firstName: 'Automated',
        lastName: 'Customer',
        phone: '+92 301 9876543',
        email: 'auto.test@example.com',
        cnic: '17301-9876543-1',
        city: 'Peshawar',
        address: 'Hayatabad Phase 3',
        branch_id: 'BR-01',
        branch: 'Peshawar',
        status: 'Active'
      }

      const res = await request(app)
        .post('/api/v1/customers')
        .set(adminHeaders)
        .send(payload)

      assert.strictEqual(res.status, 201)
      assert.strictEqual(res.body.id, testCustomerId)
      assert.strictEqual(res.body.name, 'Automated DB Test Customer')
      assert.strictEqual(res.body.branch_id, 'BR-01')

      // Directly verify row exists in MySQL table
      const rows = await query('SELECT * FROM `customers` WHERE `id` = ?', [testCustomerId])
      assert.strictEqual(rows.length, 1, 'Record must be present in MySQL customers table')
      assert.strictEqual(rows[0].phone, '+92 301 9876543')
      assert.strictEqual(rows[0].city, 'Peshawar')
    })

    it('GET /api/v1/customers retrieves records from MySQL with branch filtering', async () => {
      const res = await request(app)
        .get('/api/v1/customers')
        .set(adminHeaders)
        .query({ branch_id: 'BR-01' })

      assert.strictEqual(res.status, 200)
      assert.ok(Array.isArray(res.body), 'Response must be an array')
      const found = res.body.find(c => c.id === testCustomerId)
      assert.ok(found, 'Created test customer must be returned in branch list')
      assert.strictEqual(found.name, 'Automated DB Test Customer')
    })

    it('GET /api/v1/customers/:id retrieves the single record from MySQL', async () => {
      const res = await request(app)
        .get(`/api/v1/customers/${testCustomerId}`)
        .set(adminHeaders)

      assert.strictEqual(res.status, 200)
      assert.strictEqual(res.body.id, testCustomerId)
      assert.strictEqual(res.body.code, testCustomerCode)
      assert.strictEqual(res.body.cnic, '17301-9876543-1')
    })

    it('PUT /api/v1/customers/:id updates fields and persists to MySQL', async () => {
      const updateData = {
        city: 'Islamabad',
        notes: 'Updated via integration test',
        status: 'Lead',
        statusClass: 'bg-[#eff6ff] text-[#2563eb]'
      }

      const res = await request(app)
        .put(`/api/v1/customers/${testCustomerId}`)
        .set(adminHeaders)
        .send(updateData)

      assert.strictEqual(res.status, 200)
      assert.strictEqual(res.body.city, 'Islamabad')
      assert.strictEqual(res.body.status, 'Lead')

      // Verify row in MySQL table has updated values
      const rows = await query('SELECT city, status, notes FROM `customers` WHERE `id` = ?', [testCustomerId])
      assert.strictEqual(rows[0].city, 'Islamabad')
      assert.strictEqual(rows[0].status, 'Lead')
      assert.strictEqual(rows[0].notes, 'Updated via integration test')
    })

    it('DELETE /api/v1/customers/:id enforces safety rule against customers with transactions', async () => {
      // Simulate active orders on the customer
      await query('UPDATE `customers` SET `orders` = 3, `balance` = 150000 WHERE `id` = ?', [testCustomerId])

      const res = await request(app)
        .delete(`/api/v1/customers/${testCustomerId}`)
        .set(adminHeaders)

      assert.strictEqual(res.status, 400)
      assert.strictEqual(res.body.error, 'CANNOT_DELETE_ACTIVE_CUSTOMER')
    })

    it('DELETE /api/v1/customers/:id cleanly removes customer when no orders exist', async () => {
      // Clear orders to allow safe deletion
      await query('UPDATE `customers` SET `orders` = 0, `balance` = 0 WHERE `id` = ?', [testCustomerId])

      const res = await request(app)
        .delete(`/api/v1/customers/${testCustomerId}`)
        .set(adminHeaders)

      assert.strictEqual(res.status, 200)
      assert.strictEqual(res.body.ok, true)
      assert.strictEqual(res.body.id, testCustomerId)

      // Verify row is no longer in MySQL table
      const rows = await query('SELECT id FROM `customers` WHERE `id` = ?', [testCustomerId])
      assert.strictEqual(rows.length, 0, 'Record must be deleted from MySQL table')
    })
  })
})
