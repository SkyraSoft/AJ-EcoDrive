import { describe, it, before, after } from 'node:test'
import assert from 'node:assert'
import request from 'supertest'
import { app } from '../src/app.js'
import { connectDB, disconnectDB, getDbStatus, query, withTransaction } from '../src/config/db.js'
import { runMigrations } from '../src/db/migrations.js'
import { OrderModel } from '../src/models/order.model.js'
import { getAdminAuthHeader } from './helpers/auth.helper.js'

describe('AJ EcoDrive Backend — Sales Orders Module REAL MySQL Database Suite', () => {
  let isDbReady = false
  const adminHeaders = getAdminAuthHeader()
  const testOrderId = 'ORD-TEST-PERSIST-01'
  const testCustomerId = 'CUST-101'
  const testQuoteForConversionId = 'QT-CONVERT-TXN-01'
  const convertedOrderId = 'ORD-CONVERTED-TXN-01'
  let baselineStock1 = null

  before(async () => {
    isDbReady = await connectDB()
    if (isDbReady) {
      await runMigrations()
      // Clean up any test records from prior runs
      await query('DELETE FROM `order_items` WHERE `order_id` IN (?, ?)', [testOrderId, convertedOrderId])
      await query('DELETE FROM `orders` WHERE `id` IN (?, ?) OR `order_number` IN (?, ?) OR `quotation_id` = ?', [testOrderId, convertedOrderId, testOrderId, convertedOrderId, testQuoteForConversionId])
      await query('DELETE FROM `quotation_items` WHERE `quotation_id` = ?', [testQuoteForConversionId])
      await query('DELETE FROM `quotations` WHERE `id` = ?', [testQuoteForConversionId])
      await query('DELETE FROM `stock_movements` WHERE `reference_id` IN (?, ?)', [testOrderId, convertedOrderId])

      const [stockRows] = await query('SELECT on_hand, reserved, available FROM `inventory_stock` WHERE `id` = 1')
      if (stockRows) {
        baselineStock1 = stockRows
        // Ensure at least 1 unit available for conversion test
        if (stockRows.available < 1) {
          await query('UPDATE `inventory_stock` SET `reserved` = `on_hand` - 1, `available` = 1 WHERE `id` = 1')
        }
      }
    }
  })

  after(async () => {
    if (isDbReady) {
      await query('DELETE FROM `order_items` WHERE `order_id` IN (?, ?)', [testOrderId, convertedOrderId])
      await query('DELETE FROM `orders` WHERE `id` IN (?, ?) OR `order_number` IN (?, ?) OR `quotation_id` = ?', [testOrderId, convertedOrderId, testOrderId, convertedOrderId, testQuoteForConversionId])
      await query('DELETE FROM `quotation_items` WHERE `quotation_id` = ?', [testQuoteForConversionId])
      await query('DELETE FROM `quotations` WHERE `id` = ?', [testQuoteForConversionId])
      await query('DELETE FROM `stock_movements` WHERE `reference_id` IN (?, ?)', [testOrderId, convertedOrderId])
      if (baselineStock1) {
        await query('UPDATE `inventory_stock` SET `on_hand` = ?, `reserved` = ?, `available` = ? WHERE `id` = 1', [
          baselineStock1.on_hand,
          baselineStock1.reserved,
          baselineStock1.available
        ])
      }
      await disconnectDB()
    }
  })

  it('verifies MySQL database connection is live and active for orders testing', () => {
    const status = getDbStatus()
    assert.strictEqual(status.isConnected, true, 'Real MySQL database connection must be active')
    assert.strictEqual(status.type, 'mysql')
  })

  describe('Validation Enforcement (HTTP 422)', () => {
    it('POST /api/v1/orders rejects non-existent customer reference with 422', async () => {
      const res = await request(app)
        .post('/api/v1/orders')
        .set(adminHeaders)
        .send({
          customer_id: 'CUST-NON-EXISTENT-888',
          branch: 'Peshawar',
          branch_id: 'BR-01',
          product: 'BRG E-125',
          finalPrice: 280000
        })

      assert.strictEqual(res.status, 422)
      assert.strictEqual(res.body.ok, false)
      assert.strictEqual(res.body.error, 'VALIDATION_FAILED')
      assert.ok(res.body.errors.some(e => e.field === 'customer_id'))
    })

    it('POST /api/v1/orders rejects global or missing branch with 422', async () => {
      const res = await request(app)
        .post('/api/v1/orders')
        .set(adminHeaders)
        .send({
          customer_id: testCustomerId,
          branch: 'All Branches',
          branch_id: 'ALL',
          product: 'BRG E-125',
          finalPrice: 280000
        })

      assert.strictEqual(res.status, 422)
      assert.strictEqual(res.body.ok, false)
      assert.ok(res.body.errors.some(e => e.field === 'branch'))
    })

    it('POST /api/v1/orders rejects missing product name with 422', async () => {
      const res = await request(app)
        .post('/api/v1/orders')
        .set(adminHeaders)
        .send({
          customer_id: testCustomerId,
          branch: 'Peshawar',
          branch_id: 'BR-01',
          product: '   ',
          finalPrice: 280000
        })

      assert.strictEqual(res.status, 422)
      assert.strictEqual(res.body.ok, false)
      assert.ok(res.body.errors.some(e => e.field === 'product'))
    })
  })

  describe('Server-Side Financials Calculation & MySQL Persistence (CRUD)', () => {
    it('calculates subtotal, discount, total, paid, and balance on server and rejects fake client totals', async () => {
      const payload = {
        id: testOrderId,
        orderNo: testOrderId,
        customer_id: testCustomerId,
        branch: 'Peshawar',
        branch_id: 'BR-01',
        product: 'BRG E-125',
        unit: 'CH 8-BRG-26-99110',
        items: [
          { product: 'BRG E-125 Motorized Unit', quantity: 1, unitPrice: 280000 },
          { product: 'Lithium Battery Upgrade', quantity: 1, unitPrice: 40000 }
        ],
        discount: 20000,
        paid: 100000,
        // Client maliciously supplies fake total & balance
        total: 'PKR 10',
        balance: 'PKR 5',
        status: 'Processing',
        salesperson: 'Hamza Ali'
      }

      // Expected calculation:
      // Item 1: 1 * 280000 = 280000
      // Item 2: 1 * 40000  = 40000
      // Subtotal = 320000
      // Discount = 20000
      // Net Total = 300000
      // Paid = 100000
      // Balance = 200000

      const res = await request(app)
        .post('/api/v1/orders')
        .set(adminHeaders)
        .send(payload)

      assert.strictEqual(res.status, 201)
      assert.strictEqual(res.body.id, testOrderId)
      assert.strictEqual(res.body.rawSubtotal, 320000, 'Server must calculate subtotal from items')
      assert.strictEqual(res.body.rawDiscount, 20000)
      assert.strictEqual(res.body.rawTotal, 300000, 'Server must calculate net total as subtotal - discount')
      assert.strictEqual(res.body.rawPaid, 100000)
      assert.strictEqual(res.body.rawBalance, 200000, 'Server must calculate balance as total - paid')
      assert.strictEqual(res.body.total, 'PKR 300,000')
      assert.strictEqual(res.body.balance, 'PKR 200,000')

      // Verify row directly in MySQL `orders` table
      const rows = await query('SELECT * FROM `orders` WHERE `id` = ?', [testOrderId])
      assert.strictEqual(rows.length, 1, 'Order record must exist in MySQL table')
      assert.strictEqual(parseFloat(rows[0].subtotal), 320000.00)
      assert.strictEqual(parseFloat(rows[0].discount), 20000.00)
      assert.strictEqual(parseFloat(rows[0].total), 300000.00)
      assert.strictEqual(parseFloat(rows[0].paid), 100000.00)
      assert.strictEqual(parseFloat(rows[0].balance), 200000.00)
      assert.strictEqual(rows[0].customer_id, testCustomerId)
      assert.strictEqual(rows[0].branch_id, 'BR-01')

      // Verify line items in MySQL `order_items` table
      const itemRows = await query('SELECT * FROM `order_items` WHERE `order_id` = ? ORDER BY `id` ASC', [testOrderId])
      assert.strictEqual(itemRows.length, 2, 'Order must have 2 line items in MySQL')
      assert.strictEqual(itemRows[0].product, 'BRG E-125 Motorized Unit')
      assert.strictEqual(parseFloat(itemRows[0].subtotal), 280000.00)
      assert.strictEqual(itemRows[1].product, 'Lithium Battery Upgrade')
      assert.strictEqual(parseFloat(itemRows[1].subtotal), 40000.00)
    })

    it('GET /api/v1/orders retrieves list with branch scoping and items', async () => {
      const res = await request(app)
        .get('/api/v1/orders')
        .set(adminHeaders)
        .query({ branch_id: 'BR-01' })

      assert.strictEqual(res.status, 200)
      assert.ok(Array.isArray(res.body), 'Response must be an array')
      const found = res.body.find(o => o.id === testOrderId)
      assert.ok(found, 'Created test order must be in branch list')
      assert.strictEqual(found.rawTotal, 300000)
      assert.strictEqual(found.rawBalance, 200000)
      assert.strictEqual(found.items.length, 2)
    })

    it('GET /api/v1/orders/:id retrieves single order with full line items', async () => {
      const res = await request(app)
        .get(`/api/v1/orders/${testOrderId}`)
        .set(adminHeaders)

      assert.strictEqual(res.status, 200)
      assert.strictEqual(res.body.id, testOrderId)
      assert.strictEqual(res.body.customer_id, testCustomerId)
      assert.strictEqual(res.body.items.length, 2)
      assert.strictEqual(res.body.items[0].product, 'BRG E-125 Motorized Unit')
      assert.strictEqual(res.body.items[1].product, 'Lithium Battery Upgrade')
    })

    it('PUT /api/v1/orders/:id updates payment, notes, and recalculates balance in MySQL', async () => {
      const updatePayload = {
        notes: 'Second installment received at showroom',
        paid: 250000 // Was 100000, now 250000. Total is 300000. New balance = 50000.
      }

      const res = await request(app)
        .put(`/api/v1/orders/${testOrderId}`)
        .set(adminHeaders)
        .send(updatePayload)

      assert.strictEqual(res.status, 200)
      assert.strictEqual(res.body.rawPaid, 250000)
      assert.strictEqual(res.body.rawBalance, 50000)
      assert.strictEqual(res.body.balance, 'PKR 50,000')

      // Verify row directly in MySQL
      const rows = await query('SELECT paid, balance, notes FROM `orders` WHERE `id` = ?', [testOrderId])
      assert.strictEqual(parseFloat(rows[0].paid), 250000.00)
      assert.strictEqual(parseFloat(rows[0].balance), 50000.00)
      assert.strictEqual(rows[0].notes, 'Second installment received at showroom')
    })

    it('POST /api/v1/orders/:id/cancel cancels the order in MySQL', async () => {
      const res = await request(app)
        .post(`/api/v1/orders/${testOrderId}/cancel`)
        .set(adminHeaders)

      assert.strictEqual(res.status, 200)
      assert.strictEqual(res.body.ok, true)
      assert.strictEqual(res.body.order.status, 'Cancelled')

      const rows = await query('SELECT status FROM `orders` WHERE `id` = ?', [testOrderId])
      assert.strictEqual(rows[0].status, 'Cancelled')
    })
  })

  describe('Atomic ACID Quotation-to-Order Conversion & Duplicate Prevention', () => {
    before(async () => {
      // Create a dedicated quotation in MySQL for conversion testing
      await query(`
        INSERT INTO \`quotations\` (
          \`id\`, \`quote_number\`, \`customer_id\`, \`customer_name\`, \`branch_id\`, \`branch\`,
          \`product_id\`, \`product\`, \`quantity\`, \`subtotal\`, \`discount\`, \`total\`,
          \`status\`, \`status_class\`
        ) VALUES (
          ?, ?, 'CUST-101', 'Ahsan Khan', 'BR-01', 'Peshawar',
          'PROD-001', 'BRG E-125 Pro', '1 unit', 310000.00, 10000.00, 300000.00,
          'Sent', 'bg-[#eff6ff] text-[#2563eb]'
        )
      `, [testQuoteForConversionId, testQuoteForConversionId])

      await query(`
        INSERT INTO \`quotation_items\` (
          \`quotation_id\`, \`product_id\`, \`product\`, \`quantity\`, \`selling_price\`, \`subtotal\`, \`warranty\`
        ) VALUES (
          ?, 'PROD-001', 'BRG E-125 Pro', 1, 310000.00, 310000.00, '2-Year Warranty'
        )
      `, [testQuoteForConversionId])
    })

    it('converts quotation to order as an atomic ACID transaction and updates both tables', async () => {
      const targetOrderId = 'ORD-CONVERTED-TXN-01'
      const res = await request(app)
        .post(`/api/v1/quotations/${testQuoteForConversionId}/convert-to-order`)
        .set(adminHeaders)
        .send({
          orderId: targetOrderId,
          unitId: 'VIN-9900881',
          salesperson: 'Hamza Ali'
        })

      assert.strictEqual(res.status, 200)
      assert.strictEqual(res.body.ok, true)
      assert.strictEqual(res.body.orderId, targetOrderId)
      assert.strictEqual(res.body.order.quotation_id, testQuoteForConversionId)
      assert.strictEqual(res.body.order.rawTotal, 300000)
      assert.strictEqual(res.body.order.customer_id, 'CUST-101')
      assert.strictEqual(res.body.order.unit, 'VIN-9900881')

      // Verify order row in MySQL
      const orderRows = await query('SELECT * FROM `orders` WHERE `id` = ?', [targetOrderId])
      assert.strictEqual(orderRows.length, 1, 'Sales Order must exist in MySQL orders table')
      assert.strictEqual(orderRows[0].quotation_id, testQuoteForConversionId)
      assert.strictEqual(parseFloat(orderRows[0].total), 300000.00)

      // Verify items copied in MySQL order_items
      const orderItemRows = await query('SELECT * FROM `order_items` WHERE `order_id` = ?', [targetOrderId])
      assert.strictEqual(orderItemRows.length, 1)
      assert.strictEqual(orderItemRows[0].product, 'BRG E-125 Pro')

      // Verify quotation updated in MySQL
      const quoteRows = await query('SELECT status, sales_order_id FROM `quotations` WHERE `id` = ?', [testQuoteForConversionId])
      assert.strictEqual(quoteRows[0].status, 'Accepted', 'Quotation status must be updated to Accepted')
      assert.strictEqual(quoteRows[0].sales_order_id, targetOrderId, 'Quotation sales_order_id must point to new order')
    })

    it('rejects duplicate conversion of the same quotation with HTTP 409 Conflict', async () => {
      const res = await request(app)
        .post(`/api/v1/quotations/${testQuoteForConversionId}/convert-to-order`)
        .set(adminHeaders)
        .send({
          orderId: 'ORD-DUPLICATE-ATTEMPT',
          unitId: 'VIN-9900881'
        })

      assert.strictEqual(res.status, 409, 'Duplicate conversion attempt must be rejected with 409')
      assert.strictEqual(res.body.ok, false)
      assert.strictEqual(res.body.error, 'DUPLICATE_CONVERSION')

      // Verify no duplicate order was inserted in MySQL
      const duplicateOrder = await query('SELECT * FROM `orders` WHERE `id` = ?', ['ORD-DUPLICATE-ATTEMPT'])
      assert.strictEqual(duplicateOrder.length, 0, 'Duplicate order must not exist in MySQL')
    })

    it('rolls back completely if a failure occurs during conversion and leaves no partial rows', async () => {
      // Create a temporary quotation to test rollback
      const tempQuoteId = 'QT-ROLLBACK-TEST-99'
      await query(`
        INSERT INTO \`quotations\` (
          \`id\`, \`quote_number\`, \`customer_id\`, \`customer_name\`, \`branch_id\`, \`branch\`,
          \`subtotal\`, \`discount\`, \`total\`, \`status\`
        ) VALUES (
          ?, ?, 'CUST-101', 'Ahsan Khan', 'BR-01', 'Peshawar',
          200000.00, 0.00, 200000.00, 'Sent'
        )
      `, [tempQuoteId, tempQuoteId])

      const failedOrderId = 'ORD-FAILED-ROLLBACK-99'

      // Simulate a transaction failure midway by using invalid unit query or simulated exception
      await assert.rejects(async () => {
        await withTransaction(async (conn) => {
          // Step A: Insert order row
          await conn.execute(
            `INSERT INTO \`orders\` (
              \`id\`, \`order_number\`, \`quotation_id\`, \`customer_id\`, \`customer_name\`,
              \`branch_id\`, \`branch\`, \`total\`, \`status\`
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [failedOrderId, failedOrderId, tempQuoteId, 'CUST-101', 'Ahsan Khan', 'BR-01', 'Peshawar', 200000.00, 'Processing']
          )

          // Step B: Intentional failure before quotation update/commit
          throw new Error('SIMULATED_TRANSACTION_FAILURE')
        })
      }, /SIMULATED_TRANSACTION_FAILURE/)

      // Verify rollback: order row must NOT exist in MySQL
      const orderCheck = await query('SELECT * FROM `orders` WHERE `id` = ?', [failedOrderId])
      assert.strictEqual(orderCheck.length, 0, 'Rolled back order must NOT exist in MySQL')

      // Verify quotation row remains untouched in 'Sent' state with sales_order_id NULL
      const quoteCheck = await query('SELECT status, sales_order_id FROM `quotations` WHERE `id` = ?', [tempQuoteId])
      assert.strictEqual(quoteCheck[0].status, 'Sent')
      assert.strictEqual(quoteCheck[0].sales_order_id, null)

      // Clean up temp quotation
      await query('DELETE FROM `quotations` WHERE `id` = ?', [tempQuoteId])
    })
  })

  describe('Safe Deletion Enforcement', () => {
    it('DELETE /api/v1/orders/:id safely deletes unfulfilled test order without payments', async () => {
      const tempOrderId = 'ORD-TEMP-SAFE-DELETE'
      await request(app)
        .post('/api/v1/orders')
        .set(adminHeaders)
        .send({
          id: tempOrderId,
          orderNo: tempOrderId,
          customer_id: testCustomerId,
          branch: 'Peshawar',
          branch_id: 'BR-01',
          product: 'BRG E-125',
          finalPrice: 150000,
          paid: 0,
          status: 'Cancelled'
        })

      const res = await request(app)
        .delete(`/api/v1/orders/${tempOrderId}`)
        .set(adminHeaders)

      assert.strictEqual(res.status, 200)
      assert.strictEqual(res.body.ok, true)

      const check = await query('SELECT * FROM `orders` WHERE `id` = ?', [tempOrderId])
      assert.strictEqual(check.length, 0, 'Order must be deleted from MySQL')
    })
  })
})
