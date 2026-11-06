/**
 * AJ ECODRIVE ERP — SYNCHRONIZATION PROTOCOL REAL DB TEST SUITE
 * 
 * Verifies the Phase 6 offline synchronization foundation:
 * 1. POST /api/v1/sync/push with atomic transactions and idempotency
 * 2. Cross-branch mutation rejection for branch managers
 * 3. Optimistic concurrency conflict detection on financial and stock records
 * 4. GET /api/v1/sync/pull incremental delta sync with branch scoping
 * 5. Sync metadata and status telemetry
 */

import { describe, it, before, after } from 'node:test'
import assert from 'node:assert/strict'
import request from 'supertest'
import { app } from '../src/app.js'
import { generateToken } from '../src/utils/token.js'
import { query, connectDB, disconnectDB } from '../src/config/db.js'

describe('AJ EcoDrive Backend — Offline Synchronization Protocol Suite', () => {
  let superAdminToken
  let branchManagerPewToken
  let branchManagerIsbToken

  const TEST_SYNC_MUTATION_ID = 'mut_test_' + Date.now()
  const TEST_IDEMPOTENCY_KEY = 'idem_cust_create_' + Date.now()
  const TEST_CUSTOMER_ID = 'CUST-SYNC-TEST-' + Math.floor(Math.random() * 9000 + 1000)
  const TEST_INVOICE_ID = 'INV-SYNC-TEST-' + Math.floor(Math.random() * 9000 + 1000)

  before(async () => {
    await connectDB()

    // Clean any prior artifacts
    await query('DELETE FROM sync_mutations WHERE idempotency_key LIKE "idem_%"')
    await query('DELETE FROM customers WHERE id = ?', [TEST_CUSTOMER_ID])
    await query('DELETE FROM invoices WHERE id = ?', [TEST_INVOICE_ID])

    // Generate authenticated JWT tokens
    superAdminToken = generateToken({
      id: 'USR-ADMIN',
      username: 'admin',
      role: 'Super Admin',
      role_id: 'ROLE-ADMIN',
      branch_id: null,
      isSuperAdmin: true,
      permissions: ['*']
    })

    branchManagerPewToken = generateToken({
      id: 'USR-PEW',
      username: 'pew-01',
      role: 'Branch Manager',
      role_id: 'ROLE-BM',
      branch_id: 'BR-01',
      branchCode: 'PEW-01',
      isSuperAdmin: false,
      permissions: ['customers.write', 'customers.read', 'invoices.read', 'invoices.write']
    })

    branchManagerIsbToken = generateToken({
      id: 'USR-ISB',
      username: 'isb-01',
      role: 'Branch Manager',
      role_id: 'ROLE-BM',
      branch_id: 'BR-02',
      branchCode: 'ISB-01',
      isSuperAdmin: false,
      permissions: ['customers.write', 'customers.read']
    })

    // Seed baseline invoice with version = 2 for conflict testing
    try {
      await query(
        `INSERT INTO invoices (id, invoice_number, branch_id, customer_id, customer_name, total, balance, status, version)
         VALUES (?, 'INV-CONF-001', 'BR-01', 'CUST-001', 'Test Customer', 100000.00, 100000.00, 'Unpaid', 2)
         ON DUPLICATE KEY UPDATE version = 2`,
        [TEST_INVOICE_ID]
      )
    } catch (e) {
      // Table may have varying columns; ensure record exists
      await query(
        `INSERT INTO invoices (id, version, branch_id) VALUES (?, 2, 'BR-01')
         ON DUPLICATE KEY UPDATE version = 2`,
        [TEST_INVOICE_ID]
      )
    }
  })

  after(async () => {
    await query('DELETE FROM sync_mutations WHERE idempotency_key LIKE "idem_%"')
    await query('DELETE FROM customers WHERE id = ?', [TEST_CUSTOMER_ID])
    await query('DELETE FROM invoices WHERE id = ?', [TEST_INVOICE_ID])
    await disconnectDB()
  })

  describe('1. Endpoint Authentication & Protection', () => {
    it('rejects unauthenticated requests to /api/v1/sync/push with 401', async () => {
      const res = await request(app)
        .post('/api/v1/sync/push')
        .send({ mutations: [] })
      assert.equal(res.status, 401)
    })

    it('rejects unauthenticated requests to /api/v1/sync/pull with 401', async () => {
      const res = await request(app)
        .get('/api/v1/sync/pull')
      assert.equal(res.status, 401)
    })

    it('permits authenticated users to query /api/v1/sync/status', async () => {
      const res = await request(app)
        .get('/api/v1/sync/status')
        .set('Authorization', `Bearer ${superAdminToken}`)
      assert.equal(res.status, 200)
      assert.equal(res.body.ok, true)
      assert.equal(res.body.data.status, 'online')
      assert.ok(res.body.data.serverTimestamp)
    })
  })

  describe('2. Batch Push & Idempotency', () => {
    it('validates mutations parameter must be an array', async () => {
      const res = await request(app)
        .post('/api/v1/sync/push')
        .set('Authorization', `Bearer ${superAdminToken}`)
        .send({ mutations: 'not-an-array' })
      assert.equal(res.status, 400)
    })

    it('successfully processes CREATE customer mutation and returns status synced', async () => {
      const res = await request(app)
        .post('/api/v1/sync/push')
        .set('Authorization', `Bearer ${branchManagerPewToken}`)
        .send({
          mutations: [
            {
              mutationId: TEST_SYNC_MUTATION_ID,
              idempotencyKey: TEST_IDEMPOTENCY_KEY,
              entityType: 'customer',
              entityId: TEST_CUSTOMER_ID,
              operation: 'CREATE',
              payload: {
                id: TEST_CUSTOMER_ID,
                code: 'CUST-CODE-' + Date.now(),
                name: 'Offline Sync Test Customer',
                phone: '+92 300 1234567',
                branch_id: 'BR-01',
                branch: 'Peshawar'
              },
              clientVersion: 1,
              branchId: 'BR-01'
            }
          ]
        })

      assert.equal(res.status, 200)
      assert.equal(res.body.ok, true)
      assert.ok(Array.isArray(res.body.results))
      assert.equal(res.body.results.length, 1)
      assert.equal(res.body.results[0].mutationId, TEST_SYNC_MUTATION_ID)
      assert.equal(res.body.results[0].status, 'synced')
    })

    it('enforces idempotency: identical idempotencyKey returns cached status without re-executing', async () => {
      const res = await request(app)
        .post('/api/v1/sync/push')
        .set('Authorization', `Bearer ${branchManagerPewToken}`)
        .send({
          mutations: [
            {
              mutationId: TEST_SYNC_MUTATION_ID,
              idempotencyKey: TEST_IDEMPOTENCY_KEY, // Same key!
              entityType: 'customer',
              entityId: TEST_CUSTOMER_ID,
              operation: 'CREATE',
              payload: {
                name: 'Attempted Duplicate Payload'
              },
              clientVersion: 1,
              branchId: 'BR-01'
            }
          ]
        })

      assert.equal(res.status, 200)
      assert.equal(res.body.results[0].status, 'synced')
      assert.equal(res.body.results[0].idempotent, true)
    })
  })

  describe('3. Multi-Tenant Branch Isolation Enforcement', () => {
    it('rejects Branch Manager attempt to mutate records for another branch', async () => {
      const crossBranchMutationId = 'mut_cross_' + Date.now()
      const res = await request(app)
        .post('/api/v1/sync/push')
        .set('Authorization', `Bearer ${branchManagerPewToken}`) // User from BR-01
        .send({
          mutations: [
            {
              mutationId: crossBranchMutationId,
              idempotencyKey: 'idem_cross_' + Date.now(),
              entityType: 'customer',
              entityId: 'CUST-CROSS-999',
              operation: 'CREATE',
              payload: {
                branch_id: 'BR-02' // Attempting to insert into Islamabad (BR-02)
              },
              branchId: 'BR-02'
            }
          ]
        })

      assert.equal(res.status, 200)
      assert.equal(res.body.results[0].status, 'rejected')
      assert.match(res.body.results[0].error, /Unauthorized/)
    })
  })

  describe('4. Optimistic Concurrency & Conflict Detection', () => {
    it('detects version conflict on financial entity and quarantines mutation with REQUIRE_MANAGER_APPROVAL', async () => {
      const conflictMutationId = 'mut_conflict_' + Date.now()
      const res = await request(app)
        .post('/api/v1/sync/push')
        .set('Authorization', `Bearer ${branchManagerPewToken}`)
        .send({
          mutations: [
            {
              mutationId: conflictMutationId,
              idempotencyKey: 'idem_conf_' + Date.now(),
              entityType: 'invoice',
              entityId: TEST_INVOICE_ID,
              operation: 'UPDATE',
              payload: {
                status: 'Paid',
                notes: 'Offline payment reconciled'
              },
              clientVersion: 1, // Client thinks version is 1, but server version is 2!
              branchId: 'BR-01'
            }
          ]
        })

      assert.equal(res.status, 200)
      assert.equal(res.body.results[0].status, 'conflict')
      assert.equal(res.body.results[0].resolutionRule, 'REQUIRE_MANAGER_APPROVAL')
      assert.ok(res.body.results[0].serverState)
    })
  })

  describe('5. Incremental Delta Pull', () => {
    it('scopes pulled entities strictly to branch for Branch Manager', async () => {
      const res = await request(app)
        .get('/api/v1/sync/pull')
        .set('Authorization', `Bearer ${branchManagerPewToken}`)

      assert.equal(res.status, 200)
      assert.equal(res.body.ok, true)
      assert.ok(res.body.data.entities)
      assert.ok(Array.isArray(res.body.data.tombstones))

      // Every customer returned must belong to BR-01 or be universal
      const customers = res.body.data.entities.customers || []
      for (const c of customers) {
        if (c.branch_id) {
          assert.equal(c.branch_id, 'BR-01')
        }
      }
    })

    it('returns server timestamp and supports since parameter', async () => {
      const pastDate = new Date(Date.now() - 3600000).toISOString()
      const res = await request(app)
        .get(`/api/v1/sync/pull?since=${encodeURIComponent(pastDate)}`)
        .set('Authorization', `Bearer ${superAdminToken}`)

      assert.equal(res.status, 200)
      assert.ok(res.body.data.serverTimestamp)
    })
  })
})
