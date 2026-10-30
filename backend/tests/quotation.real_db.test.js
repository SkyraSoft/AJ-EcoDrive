import { describe, it, before, after } from 'node:test'
import assert from 'node:assert'
import request from 'supertest'
import { app } from '../src/app.js'
import { connectDB, disconnectDB, getDbStatus, query } from '../src/config/db.js'
import { runMigrations } from '../src/db/migrations.js'
import { getAdminAuthHeader } from './helpers/auth.helper.js'

describe('AJ EcoDrive Backend — Quotation Module REAL MySQL Database Suite', () => {
  let isDbReady = false
  const adminHeaders = getAdminAuthHeader()
  const testQuoteId = 'QT-TEST-PERSIST-01'
  const testCustomerId = 'CUST-101' // Pre-seeded valid customer from migrations

  before(async () => {
    isDbReady = await connectDB()
    if (isDbReady) {
      await runMigrations()
      // Clean up any leftovers from previous test runs
      await query('DELETE FROM `orders` WHERE `id` = ? OR `quotation_id` = ?', ['ORD-TEST-9988', testQuoteId])
      await query('DELETE FROM `quotations` WHERE `id` = ?', [testQuoteId])
    }
  })

  after(async () => {
    if (isDbReady) {
      await query('DELETE FROM `orders` WHERE `id` = ? OR `quotation_id` = ?', ['ORD-TEST-9988', testQuoteId])
      await query('DELETE FROM `quotations` WHERE `id` = ?', [testQuoteId])
      await disconnectDB()
    }
  })

  it('verifies MySQL database connection is live and active for quotation testing', () => {
    const status = getDbStatus()
    assert.strictEqual(status.isConnected, true, 'Real MySQL database connection must be active')
    assert.strictEqual(status.type, 'mysql')
  })

  describe('Validation Enforcement (HTTP 422)', () => {
    it('POST /api/v1/quotations rejects non-existent customer reference with 422', async () => {
      const res = await request(app)
        .post('/api/v1/quotations')
        .set(adminHeaders)
        .send({
          customer_id: 'CUST-NON-EXISTENT-999',
          branch: 'Peshawar',
          branch_id: 'BR-01',
          items: [{ product: 'BRG E-125', quantity: 1, sellingPrice: 280000 }]
        })

      assert.strictEqual(res.status, 422)
      assert.strictEqual(res.body.ok, false)
      assert.strictEqual(res.body.error, 'VALIDATION_FAILED')
      assert.ok(res.body.errors.some(e => e.field === 'customer_id'))
    })

    it('POST /api/v1/quotations rejects invalid or global branch with 422', async () => {
      const res = await request(app)
        .post('/api/v1/quotations')
        .set(adminHeaders)
        .send({
          customer_id: testCustomerId,
          branch: 'All Branches',
          branch_id: 'ALL',
          items: [{ product: 'BRG E-125', quantity: 1, sellingPrice: 280000 }]
        })

      assert.strictEqual(res.status, 422)
      assert.strictEqual(res.body.ok, false)
      assert.ok(res.body.errors.some(e => e.field === 'branch'))
    })

    it('POST /api/v1/quotations rejects empty items array with 422', async () => {
      const res = await request(app)
        .post('/api/v1/quotations')
        .set(adminHeaders)
        .send({
          customer_id: testCustomerId,
          branch: 'Peshawar',
          branch_id: 'BR-01',
          items: []
        })

      assert.strictEqual(res.status, 422)
      assert.strictEqual(res.body.ok, false)
      assert.ok(res.body.errors.some(e => e.field === 'items'))
    })

    it('POST /api/v1/quotations rejects items with missing product name with 422', async () => {
      const res = await request(app)
        .post('/api/v1/quotations')
        .set(adminHeaders)
        .send({
          customer_id: testCustomerId,
          branch: 'Peshawar',
          branch_id: 'BR-01',
          items: [{ product: '   ', quantity: 1, sellingPrice: 280000 }]
        })

      assert.strictEqual(res.status, 422)
      assert.strictEqual(res.body.ok, false)
      assert.ok(res.body.errors.some(e => e.field.includes('product')))
    })

    it('POST /api/v1/quotations rejects negative quantity or invalid price with 422', async () => {
      const res = await request(app)
        .post('/api/v1/quotations')
        .set(adminHeaders)
        .send({
          customer_id: testCustomerId,
          branch: 'Peshawar',
          branch_id: 'BR-01',
          items: [{ product: 'BRG E-125', quantity: 0, sellingPrice: 280000 }]
        })

      assert.strictEqual(res.status, 422)
      assert.strictEqual(res.body.ok, false)
      assert.ok(res.body.errors.some(e => e.field.includes('quantity')))
    })
  })

  describe('Server-Side Totals Calculation & MySQL Persistence (CRUD)', () => {
    it('calculates totals on the server and rejects client-supplied fake totals', async () => {
      const payload = {
        id: testQuoteId,
        quote: testQuoteId,
        customer_id: testCustomerId,
        branch: 'Peshawar',
        branch_id: 'BR-01',
        items: [
          { product: 'BRG E-125', quantity: 2, sellingPrice: 280000, warranty: '1-Year Standard' },
          { product: 'Fast Charger', quantity: 1, sellingPrice: 25000, warranty: '6-Month Warranty' }
        ],
        discount: 15000,
        // Client attempts to override with incorrect fake amounts
        subtotal: 'PKR 100',
        total: 'PKR 50',
        status: 'Sent'
      }

      // Expected calculation:
      // Item 1: 2 * 280000 = 560000
      // Item 2: 1 * 25000  = 25000
      // Subtotal = 585000
      // Discount = 15000
      // Net Total = 570000

      const res = await request(app)
        .post('/api/v1/quotations')
        .set(adminHeaders)
        .send(payload)

      assert.strictEqual(res.status, 201)
      assert.strictEqual(res.body.id, testQuoteId)
      assert.strictEqual(res.body.rawSubtotal, 585000, 'Server must calculate subtotal from items')
      assert.strictEqual(res.body.rawDiscount, 15000)
      assert.strictEqual(res.body.rawTotal, 570000, 'Server must calculate net total as subtotal - discount')
      assert.strictEqual(res.body.total, 'PKR 570,000')

      // Verify row directly in MySQL `quotations` table
      const rows = await query('SELECT * FROM `quotations` WHERE `id` = ?', [testQuoteId])
      assert.strictEqual(rows.length, 1, 'Quotation record must exist in MySQL table')
      assert.strictEqual(parseFloat(rows[0].subtotal), 585000.00)
      assert.strictEqual(parseFloat(rows[0].discount), 15000.00)
      assert.strictEqual(parseFloat(rows[0].total), 570000.00)
      assert.strictEqual(rows[0].customer_id, testCustomerId)
      assert.strictEqual(rows[0].branch_id, 'BR-01')

      // Verify rows in `quotation_items` table in MySQL
      const itemRows = await query('SELECT * FROM `quotation_items` WHERE `quotation_id` = ? ORDER BY `id` ASC', [testQuoteId])
      assert.strictEqual(itemRows.length, 2, 'Must have 2 line item rows in quotation_items')
      assert.strictEqual(itemRows[0].product, 'BRG E-125')
      assert.strictEqual(parseInt(itemRows[0].quantity, 10), 2)
      assert.strictEqual(parseFloat(itemRows[0].selling_price), 280000.00)
      assert.strictEqual(parseFloat(itemRows[0].subtotal), 560000.00)

      assert.strictEqual(itemRows[1].product, 'Fast Charger')
      assert.strictEqual(parseInt(itemRows[1].quantity, 10), 1)
      assert.strictEqual(parseFloat(itemRows[1].selling_price), 25000.00)
      assert.strictEqual(parseFloat(itemRows[1].subtotal), 25000.00)
    })

    it('GET /api/v1/quotations retrieves list with branch scoping and items', async () => {
      const res = await request(app)
        .get('/api/v1/quotations')
        .set(adminHeaders)
        .query({ branch_id: 'BR-01' })

      assert.strictEqual(res.status, 200)
      assert.ok(Array.isArray(res.body), 'Response must be an array')
      const found = res.body.find(q => q.id === testQuoteId)
      assert.ok(found, 'Created test quotation must be in branch list')
      assert.strictEqual(found.rawTotal, 570000)
      assert.strictEqual(found.items.length, 2)
    })

    it('GET /api/v1/quotations/:id retrieves single quotation with full line items', async () => {
      const res = await request(app)
        .get(`/api/v1/quotations/${testQuoteId}`)
        .set(adminHeaders)

      assert.strictEqual(res.status, 200)
      assert.strictEqual(res.body.id, testQuoteId)
      assert.strictEqual(res.body.customer_id, testCustomerId)
      assert.strictEqual(res.body.items.length, 2)
      assert.strictEqual(res.body.items[0].product, 'BRG E-125')
      assert.strictEqual(res.body.items[1].product, 'Fast Charger')
    })

    it('PUT /api/v1/quotations/:id updates line items and recalculates totals in MySQL', async () => {
      const updatedPayload = {
        notes: 'Updated delivery instructions',
        discount: 25000,
        items: [
          { product: 'BRG E-125 Pro Edition', quantity: 1, sellingPrice: 320000, warranty: '2-Year Warranty' }
        ]
      }

      // Expected calculation:
      // Subtotal = 320000
      // Discount = 25000
      // Total = 295000

      const res = await request(app)
        .put(`/api/v1/quotations/${testQuoteId}`)
        .set(adminHeaders)
        .send(updatedPayload)

      assert.strictEqual(res.status, 200)
      assert.strictEqual(res.body.rawSubtotal, 320000)
      assert.strictEqual(res.body.rawDiscount, 25000)
      assert.strictEqual(res.body.rawTotal, 295000)
      assert.strictEqual(res.body.total, 'PKR 295,000')
      assert.strictEqual(res.body.items.length, 1)
      assert.strictEqual(res.body.items[0].product, 'BRG E-125 Pro Edition')

      // Verify row directly in MySQL
      const rows = await query('SELECT * FROM `quotations` WHERE `id` = ?', [testQuoteId])
      assert.strictEqual(parseFloat(rows[0].total), 295000.00)
      assert.strictEqual(rows[0].notes, 'Updated delivery instructions')
    })

    it('POST /api/v1/quotations/:id/convert-to-order marks quotation as Accepted with sales_order_id', async () => {
      const res = await request(app)
        .post(`/api/v1/quotations/${testQuoteId}/convert-to-order`)
        .set(adminHeaders)
        .send({ sales_order_id: 'ORD-TEST-9988' })

      assert.strictEqual(res.status, 200)
      assert.strictEqual(res.body.ok, true)
      assert.strictEqual(res.body.quotation.status, 'Accepted')
      assert.strictEqual(res.body.quotation.sales_order_id, 'ORD-TEST-9988')

      // Verify in MySQL
      const rows = await query('SELECT status, sales_order_id FROM `quotations` WHERE `id` = ?', [testQuoteId])
      assert.strictEqual(rows[0].status, 'Accepted')
      assert.strictEqual(rows[0].sales_order_id, 'ORD-TEST-9988')
    })

    it('DELETE /api/v1/quotations/:id rejects deletion of quotation linked to sales order (HTTP 400)', async () => {
      const res = await request(app)
        .delete(`/api/v1/quotations/${testQuoteId}`)
        .set(adminHeaders)

      assert.strictEqual(res.status, 400)
      assert.strictEqual(res.body.ok, false)
      assert.strictEqual(res.body.error, 'CANNOT_DELETE_ACCEPTED_QUOTATION')
    })

    it('DELETE /api/v1/quotations/:id safely removes draft/unlinked quotation from MySQL', async () => {
      // First create a temporary unlinked draft quotation
      const tempId = 'QT-TEMP-DELETE-01'
      await request(app)
        .post('/api/v1/quotations')
        .set(adminHeaders)
        .send({
          id: tempId,
          quote: tempId,
          customer_id: testCustomerId,
          branch: 'Peshawar',
          branch_id: 'BR-01',
          status: 'Draft',
          items: [{ product: 'Test Part', quantity: 1, sellingPrice: 5000 }]
        })

      const deleteRes = await request(app)
        .delete(`/api/v1/quotations/${tempId}`)
        .set(adminHeaders)

      assert.strictEqual(deleteRes.status, 200)
      assert.strictEqual(deleteRes.body.ok, true)

      // Verify row and its line items are completely removed from MySQL
      const quoteCheck = await query('SELECT * FROM `quotations` WHERE `id` = ?', [tempId])
      assert.strictEqual(quoteCheck.length, 0, 'Quotation row must be deleted')

      const itemsCheck = await query('SELECT * FROM `quotation_items` WHERE `quotation_id` = ?', [tempId])
      assert.strictEqual(itemsCheck.length, 0, 'Cascaded line item rows must be deleted')
    })
  })
})
