import { describe, it, before, after } from 'node:test'
import assert from 'node:assert'
import request from 'supertest'
import { app } from '../src/app.js'
import { connectDB, disconnectDB, getDbStatus, query, withTransaction } from '../src/config/db.js'
import { runMigrations } from '../src/db/migrations.js'
import { getAdminAuthHeader, getBranchManagerAuthHeader } from './helpers/auth.helper.js'

describe('AJ EcoDrive Backend — Invoices & Payments Module REAL MySQL Database Suite', () => {
  let isDbReady = false
  const adminHeaders = getAdminAuthHeader()
  const testCustomerId = 'CUST-101' // Pre-seeded valid customer
  const testOrderId = 'ORD-2241' // Pre-seeded valid order
  const testInvoiceId = 'INV-TEST-PERSIST-01'
  const linkedOrderId = 'ORD-TEST-FOR-INVOICE'

  before(async () => {
    isDbReady = await connectDB()
    if (isDbReady) {
      await runMigrations()
      // Clean up any test leftovers
      await query('DELETE FROM `payments` WHERE `invoice_id` = ? OR `id` LIKE "PAY-TEST-%"', [testInvoiceId])
      await query('DELETE FROM `invoices` WHERE `id` = ?', [testInvoiceId])
      await query('DELETE FROM `orders` WHERE `id` = ?', [linkedOrderId])
    }
  })

  after(async () => {
    if (isDbReady) {
      await query('DELETE FROM `payments` WHERE `invoice_id` = ? OR `id` LIKE "PAY-TEST-%"', [testInvoiceId])
      await query('DELETE FROM `invoices` WHERE `id` = ?', [testInvoiceId])
      await query('DELETE FROM `orders` WHERE `id` = ?', [linkedOrderId])
      await disconnectDB()
    }
  })

  it('verifies MySQL database connection is live and active for invoices & payments testing', () => {
    const status = getDbStatus()
    assert.strictEqual(status.isConnected, true, 'Real MySQL database connection must be active')
    assert.strictEqual(status.type, 'mysql')
  })

  describe('Validation Enforcement (HTTP 422)', () => {
    it('POST /api/v1/invoices rejects non-existent customer reference with 422', async () => {
      const res = await request(app)
        .post('/api/v1/invoices')
        .set(adminHeaders)
        .send({
          customer_id: 'CUST-NON-EXISTENT-888',
          branch: 'Peshawar',
          branch_id: 'BR-01',
          items: [{ description: 'Spare Battery', quantity: 1, unitPrice: 40000 }]
        })

      assert.strictEqual(res.status, 422)
      assert.strictEqual(res.body.ok, false)
      assert.strictEqual(res.body.error, 'VALIDATION_FAILED')
      assert.ok(res.body.errors.some(e => e.field === 'customer_id'))
    })

    it('POST /api/v1/invoices rejects global or missing branch with 422', async () => {
      const res = await request(app)
        .post('/api/v1/invoices')
        .set(adminHeaders)
        .send({
          customer_id: testCustomerId,
          branch: 'All Branches',
          branch_id: 'ALL',
          items: [{ description: 'Spare Battery', quantity: 1, unitPrice: 40000 }]
        })

      assert.strictEqual(res.status, 422)
      assert.strictEqual(res.body.ok, false)
      assert.ok(res.body.errors.some(e => e.field === 'branch'))
    })

    it('POST /api/v1/invoices rejects items with missing description with 422', async () => {
      const res = await request(app)
        .post('/api/v1/invoices')
        .set(adminHeaders)
        .send({
          customer_id: testCustomerId,
          branch: 'Peshawar',
          branch_id: 'BR-01',
          items: [{ description: '', quantity: 1, unitPrice: 40000 }]
        })

      assert.strictEqual(res.status, 422)
      assert.strictEqual(res.body.ok, false)
      assert.ok(res.body.errors.some(e => e.field === 'items[0].description'))
    })

    it('POST /api/v1/payments rejects payment amount <= 0 with 422', async () => {
      const res = await request(app)
        .post('/api/v1/payments')
        .set(adminHeaders)
        .send({
          invoice_id: 'INV-2241',
          amount: 0,
          method: 'Cash'
        })

      assert.strictEqual(res.status, 422)
      assert.strictEqual(res.body.ok, false)
      assert.strictEqual(res.body.error, 'VALIDATION_FAILED')
    })
  })

  describe('Server-Side Financials Calculation & MySQL Persistence (CRUD)', () => {
    it('calculates subtotal, discount, tax, total, paid, and outstanding balance on server and rejects fake client totals', async () => {
      // First, create a linked order in MySQL to test order financial cross-sync
      await request(app)
        .post('/api/v1/orders')
        .set(adminHeaders)
        .send({
          id: linkedOrderId,
          orderNo: linkedOrderId,
          customer_id: testCustomerId,
          branch: 'Peshawar',
          branch_id: 'BR-01',
          product: 'BRG E-125 Test Unit',
          finalPrice: 295000,
          paid: 0,
          status: 'Processing'
        })

      const payload = {
        id: testInvoiceId,
        invoiceNo: testInvoiceId,
        order_id: linkedOrderId,
        orderNo: linkedOrderId,
        customer_id: testCustomerId,
        branch: 'Peshawar',
        branch_id: 'BR-01',
        items: [
          { description: 'BRG E-125 Motorized Unit', quantity: 1, unitPrice: 280000 },
          { description: 'Extended 2-Year Warranty Pack', quantity: 1, unitPrice: 20000 }
        ],
        discount: 10000,
        tax: 5000,
        paid: 0,
        // Malicious client supplies fake total and outstanding amounts
        total: 10,
        amount: 'PKR 10',
        outstandingAmount: 2,
        notes: 'Commercial sales tax invoice'
      }

      // Calculation expected:
      // Item 1: 1 * 280000 = 280000
      // Item 2: 1 * 20000  = 20000
      // Subtotal = 300000
      // Discount = 10000
      // Tax = 5000
      // Net Total = 300000 - 10000 + 5000 = 295000
      // Paid = 0
      // Outstanding = 295000

      const res = await request(app)
        .post('/api/v1/invoices')
        .set(adminHeaders)
        .send(payload)

      assert.strictEqual(res.status, 201)
      assert.strictEqual(res.body.id, testInvoiceId)
      assert.strictEqual(res.body.rawSubtotal, 300000, 'Server must calculate subtotal from line items')
      assert.strictEqual(res.body.rawDiscount, 10000)
      assert.strictEqual(res.body.rawTax, 5000)
      assert.strictEqual(res.body.rawTotal, 295000, 'Server must calculate net total as subtotal - discount + tax')
      assert.strictEqual(res.body.rawPaid, 0)
      assert.strictEqual(res.body.rawBalance, 295000, 'Server must calculate outstanding balance')
      assert.strictEqual(res.body.status, 'Unpaid')
      assert.strictEqual(res.body.items.length, 2)

      // Verify row directly in MySQL `invoices` table
      const rows = await query('SELECT * FROM `invoices` WHERE `id` = ?', [testInvoiceId])
      assert.strictEqual(rows.length, 1, 'Invoice must exist in MySQL table')
      assert.strictEqual(parseFloat(rows[0].subtotal), 300000.00)
      assert.strictEqual(parseFloat(rows[0].discount), 10000.00)
      assert.strictEqual(parseFloat(rows[0].tax), 5000.00)
      assert.strictEqual(parseFloat(rows[0].total), 295000.00)
      assert.strictEqual(parseFloat(rows[0].paid_amount), 0.00)
      assert.strictEqual(parseFloat(rows[0].outstanding_amount), 295000.00)
      assert.strictEqual(rows[0].status, 'Unpaid')
    })

    it('GET /api/v1/invoices retrieves list with branch scoping and items', async () => {
      const bmHeaders = getBranchManagerAuthHeader('BR-01', 'Peshawar')
      const res = await request(app)
        .get('/api/v1/invoices')
        .set(bmHeaders)

      assert.strictEqual(res.status, 200)
      assert.ok(Array.isArray(res.body), 'Response must be an array')
      const found = res.body.find(i => i.id === testInvoiceId)
      assert.ok(found, 'Created test invoice must be present in branch list')
      assert.strictEqual(found.branch, 'Peshawar')
    })

    it('GET /api/v1/invoices/:id retrieves single invoice with full line items and payments', async () => {
      const res = await request(app)
        .get(`/api/v1/invoices/${testInvoiceId}`)
        .set(adminHeaders)

      assert.strictEqual(res.status, 200)
      assert.strictEqual(res.body.id, testInvoiceId)
      assert.strictEqual(res.body.items.length, 2)
      assert.strictEqual(res.body.items[0].description, 'BRG E-125 Motorized Unit')
      assert.strictEqual(res.body.items[1].description, 'Extended 2-Year Warranty Pack')
    })

    it('PUT /api/v1/invoices/:id updates line items and recalculates totals in MySQL', async () => {
      const res = await request(app)
        .put(`/api/v1/invoices/${testInvoiceId}`)
        .set(adminHeaders)
        .send({
          items: [
            { description: 'BRG E-125 Pro Edition', quantity: 1, unitPrice: 310000 }
          ],
          discount: 10000,
          tax: 0,
          notes: 'Updated invoice with Pro Edition'
        })

      assert.strictEqual(res.status, 200)
      assert.strictEqual(res.body.rawSubtotal, 310000)
      assert.strictEqual(res.body.rawTotal, 300000)
      assert.strictEqual(res.body.rawBalance, 300000)
      assert.strictEqual(res.body.items.length, 1)

      // Verify row directly in MySQL
      const rows = await query('SELECT total, outstanding_amount, notes FROM `invoices` WHERE `id` = ?', [testInvoiceId])
      assert.strictEqual(parseFloat(rows[0].total), 300000.00)
      assert.strictEqual(parseFloat(rows[0].outstanding_amount), 300000.00)
      assert.strictEqual(rows[0].notes, 'Updated invoice with Pro Edition')
    })
  })

  describe('Payments & ACID Transaction Workflow', () => {
    const pay1Id = 'PAY-TEST-01'
    const pay2Id = 'PAY-TEST-02'
    const pay1Ref = 'TXN-TEST-BANK-01'

    it('records partial payment, updates invoice balance to Partial, and syncs linked order', async () => {
      const res = await request(app)
        .post(`/api/v1/invoices/${testInvoiceId}/payments`)
        .set(adminHeaders)
        .send({
          id: pay1Id,
          paymentNo: pay1Id,
          amount: 100000,
          method: 'Bank Transfer',
          transactionRef: pay1Ref,
          bankAccount: 'Meezan Bank',
          notes: 'First installment'
        })

      assert.strictEqual(res.status, 201)
      assert.strictEqual(res.body.ok, true)
      assert.strictEqual(res.body.remainingBalance, 200000)
      assert.strictEqual(res.body.invoice.status, 'Partial')
      assert.strictEqual(res.body.invoice.rawPaid, 100000)
      assert.strictEqual(res.body.invoice.rawBalance, 200000)

      // Verify row in MySQL `payments` table
      const payRows = await query('SELECT * FROM `payments` WHERE `id` = ?', [pay1Id])
      assert.strictEqual(payRows.length, 1)
      assert.strictEqual(parseFloat(payRows[0].amount), 100000.00)
      assert.strictEqual(payRows[0].transaction_ref, pay1Ref)
      assert.strictEqual(payRows[0].invoice_id, testInvoiceId)

      // Verify row in MySQL `invoices` table
      const invRows = await query('SELECT paid_amount, outstanding_amount, status FROM `invoices` WHERE `id` = ?', [testInvoiceId])
      assert.strictEqual(parseFloat(invRows[0].paid_amount), 100000.00)
      assert.strictEqual(parseFloat(invRows[0].outstanding_amount), 200000.00)
      assert.strictEqual(invRows[0].status, 'Partial')

      // Verify linked order counters in MySQL `orders` table
      const ordRows = await query('SELECT paid, balance FROM `orders` WHERE `id` = ?', [linkedOrderId])
      assert.strictEqual(parseFloat(ordRows[0].paid), 100000.00)
    })

    it('rejects excessive payment that exceeds the remaining balance (HTTP 400)', async () => {
      // Balance is 200,000; attempting to pay 250,000
      const res = await request(app)
        .post(`/api/v1/invoices/${testInvoiceId}/payments`)
        .set(adminHeaders)
        .send({
          amount: 250000,
          method: 'Cash'
        })

      assert.strictEqual(res.status, 400)
      assert.strictEqual(res.body.ok, false)
      assert.strictEqual(res.body.error, 'EXCESSIVE_PAYMENT_AMOUNT')
    })

    it('rejects duplicate payment with identical transaction reference (HTTP 409 Conflict)', async () => {
      // Re-submit with same pay1Ref ('TXN-TEST-BANK-01')
      const res = await request(app)
        .post(`/api/v1/invoices/${testInvoiceId}/payments`)
        .set(adminHeaders)
        .send({
          amount: 50000,
          method: 'Bank Transfer',
          transactionRef: pay1Ref
        })

      assert.strictEqual(res.status, 409)
      assert.strictEqual(res.body.ok, false)
      assert.strictEqual(res.body.error, 'DUPLICATE_PAYMENT')
    })

    it('records final payment, transitions invoice to Paid, and marks linked order Ready', async () => {
      // Remaining balance is 200,000; paying 200,000
      const res = await request(app)
        .post(`/api/v1/invoices/${testInvoiceId}/payments`)
        .set(adminHeaders)
        .send({
          id: pay2Id,
          paymentNo: pay2Id,
          amount: 200000,
          method: 'Cash',
          transactionRef: 'TXN-TEST-CASH-02',
          notes: 'Full balance settlement'
        })

      assert.strictEqual(res.status, 201)
      assert.strictEqual(res.body.ok, true)
      assert.strictEqual(res.body.remainingBalance, 0)
      assert.strictEqual(res.body.invoice.status, 'Paid')
      assert.strictEqual(res.body.invoice.rawPaid, 300000)
      assert.strictEqual(res.body.invoice.rawBalance, 0)

      // Verify in MySQL
      const invRows = await query('SELECT paid_amount, outstanding_amount, status FROM `invoices` WHERE `id` = ?', [testInvoiceId])
      assert.strictEqual(parseFloat(invRows[0].paid_amount), 300000.00)
      assert.strictEqual(parseFloat(invRows[0].outstanding_amount), 0.00)
      assert.strictEqual(invRows[0].status, 'Paid')

      // Verify linked order in MySQL is now Ready
      const ordRows = await query('SELECT paid, balance, status FROM `orders` WHERE `id` = ?', [linkedOrderId])
      assert.strictEqual(parseFloat(ordRows[0].balance), 0.00)
      assert.strictEqual(ordRows[0].status, 'Ready')
    })

    it('GET /api/v1/payments lists recorded payments and GET /api/v1/payments/:id returns single record', async () => {
      const listRes = await request(app)
        .get('/api/v1/payments')
        .set(adminHeaders)
        .query({ invoice_id: testInvoiceId })

      assert.strictEqual(listRes.status, 200)
      assert.ok(Array.isArray(listRes.body))
      assert.strictEqual(listRes.body.length, 2)

      const getRes = await request(app)
        .get(`/api/v1/payments/${pay1Id}`)
        .set(adminHeaders)

      assert.strictEqual(getRes.status, 200)
      assert.strictEqual(getRes.body.id, pay1Id)
      assert.strictEqual(getRes.body.invoice_id, testInvoiceId)
      assert.strictEqual(getRes.body.rawAmount, 100000)
    })
  })

  describe('Safe Deletion Enforcement', () => {
    it('DELETE /api/v1/invoices/:id rejects deletion of invoice with payments (HTTP 400)', async () => {
      const res = await request(app)
        .delete(`/api/v1/invoices/${testInvoiceId}`)
        .set(adminHeaders)

      assert.strictEqual(res.status, 400)
      assert.strictEqual(res.body.ok, false)
      assert.strictEqual(res.body.error, 'CANNOT_DELETE_PAID_INVOICE')
    })

    it('DELETE /api/v1/invoices/:id safely removes draft/unpaid invoice from MySQL', async () => {
      const tempInvId = 'INV-TEMP-SAFE-DELETE'
      await request(app)
        .post('/api/v1/invoices')
        .set(adminHeaders)
        .send({
          id: tempInvId,
          invoiceNo: tempInvId,
          customer_id: testCustomerId,
          branch: 'Peshawar',
          branch_id: 'BR-01',
          items: [{ description: 'Test Item', quantity: 1, unitPrice: 50000 }],
          paid: 0
        })

      const res = await request(app)
        .delete(`/api/v1/invoices/${tempInvId}`)
        .set(adminHeaders)

      assert.strictEqual(res.status, 200)
      assert.strictEqual(res.body.ok, true)

      const check = await query('SELECT * FROM `invoices` WHERE `id` = ?', [tempInvId])
      assert.strictEqual(check.length, 0, 'Invoice must be cleanly deleted from MySQL')
    })
  })
})
