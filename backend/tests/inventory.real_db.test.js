import { describe, it, before, after } from 'node:test'
import assert from 'node:assert'
import request from 'supertest'
import { app } from '../src/app.js'
import { connectDB, disconnectDB, getDbStatus, query, withTransaction } from '../src/config/db.js'
import { runMigrations } from '../src/db/migrations.js'
import { getAdminAuthHeader } from './helpers/auth.helper.js'

describe('AJ EcoDrive Backend — Inventory Management Module REAL MySQL Database Suite', () => {
  let isDbReady = false
  const adminHeaders = getAdminAuthHeader()

  const TEST_CAT_CODE = 'TESTCAT'
  const TEST_PROD_SKU = 'SKU-TEST-INV-01'
  let createdCatId = null
  let createdProdId = null
  let testAdjId = null
  let testTransferId = null
  let testOrderId = null

  before(async () => {
    isDbReady = await connectDB()
    if (isDbReady) {
      await runMigrations()
      // Clean up previous test artifacts if any
      await query('DELETE FROM `order_items` WHERE `product_id` = "PROD-TEST-INV-01" OR `order_id` LIKE "%TEST%"')
      await query('DELETE FROM `orders` WHERE `product_id` = "PROD-TEST-INV-01" OR `id` LIKE "%TEST%" OR `order_number` LIKE "%TEST%"')
      await query('DELETE FROM `stock_movements` WHERE `product_id` = "PROD-TEST-INV-01" OR `product_id` LIKE "%TEST%" OR `reference_id` LIKE "%TEST%"')
      await query('DELETE FROM `stock_transfer_items` WHERE `product_id` = "PROD-TEST-INV-01" OR `product_id` LIKE "%TEST%"')
      await query('DELETE FROM `stock_transfers` WHERE `id` LIKE "%TEST%"')
      await query('DELETE FROM `stock_adjustments` WHERE `id` LIKE "%TEST%"')
      await query('DELETE FROM `inventory_stock` WHERE `product_id` = "PROD-TEST-INV-01" OR `product_id` LIKE "%TEST%"')
      await query('DELETE FROM `products` WHERE `id` = "PROD-TEST-INV-01" OR `sku` = ? OR `id` LIKE "%TEST%"', [TEST_PROD_SKU])
      await query('DELETE FROM `categories` WHERE `code` = ?', [TEST_CAT_CODE])
    }
  })

  after(async () => {
    if (isDbReady) {
      if (testOrderId) {
        await query('DELETE FROM `order_items` WHERE `order_id` = ?', [testOrderId])
        await query('DELETE FROM `orders` WHERE `id` = ?', [testOrderId])
      }
      await query('DELETE FROM `order_items` WHERE `product_id` = "PROD-TEST-INV-01"')
      await query('DELETE FROM `orders` WHERE `product_id` = "PROD-TEST-INV-01" OR `order_number` LIKE "%TEST%"')
      await query('DELETE FROM `stock_movements` WHERE `product_id` = "PROD-TEST-INV-01" OR `product_id` LIKE "%TEST%" OR `reference_id` LIKE "%TEST%"')
      await query('DELETE FROM `stock_transfer_items` WHERE `product_id` = "PROD-TEST-INV-01" OR `product_id` LIKE "%TEST%"')
      await query('DELETE FROM `stock_transfers` WHERE `id` LIKE "%TEST%"')
      await query('DELETE FROM `stock_adjustments` WHERE `id` LIKE "%TEST%"')
      await query('DELETE FROM `inventory_stock` WHERE `product_id` = "PROD-TEST-INV-01" OR `product_id` LIKE "%TEST%"')
      await query('DELETE FROM `products` WHERE `id` = "PROD-TEST-INV-01" OR `sku` = ? OR `id` LIKE "%TEST%"', [TEST_PROD_SKU])
      await query('DELETE FROM `categories` WHERE `code` = ?', [TEST_CAT_CODE])
      await disconnectDB()
    }
  })

  it('1. Verifies MySQL database connection and all inventory tables exist', async () => {
    const status = getDbStatus()
    assert.strictEqual(status.isConnected, true, 'Real MySQL connection must be active')

    const tables = await query('SHOW TABLES')
    const tableNames = tables.map(t => Object.values(t)[0])
    const required = [
      'categories', 'products', 'inventory_stock', 'serialized_units',
      'stock_movements', 'stock_adjustments', 'stock_transfers', 'stock_transfer_items'
    ]
    for (const reqTable of required) {
      assert.ok(tableNames.includes(reqTable), `Table "${reqTable}" must exist in MySQL ecodrive`)
    }
  })

  it('2. Category Validation: Rejects empty name or code', async () => {
    const res1 = await request(app)
      .post('/api/v1/catalogue/categories')
      .set(adminHeaders)
      .send({ name: '', code: 'VALID' })
    assert.strictEqual(res1.status, 400)
    assert.strictEqual(res1.body.ok, false)

    const res2 = await request(app)
      .post('/api/v1/catalogue/categories')
      .set(adminHeaders)
      .send({ name: 'Valid Name', code: '' })
    assert.strictEqual(res2.status, 400)
    assert.strictEqual(res2.body.ok, false)
  })

  it('3. Category Creation & Unique Code constraint', async () => {
    const res = await request(app)
      .post('/api/v1/catalogue/categories')
      .set(adminHeaders)
      .send({
        name: 'Test Prototype Vehicles',
        code: TEST_CAT_CODE,
        description: 'Test vehicles for unit suite'
      })
    assert.strictEqual(res.status, 201)
    assert.ok(res.body.id)
    assert.strictEqual(res.body.code, TEST_CAT_CODE)
    createdCatId = res.body.id

    // Attempting duplicate code must return 409 Conflict
    const dupRes = await request(app)
      .post('/api/v1/catalogue/categories')
      .set(adminHeaders)
      .send({
        name: 'Duplicate Category',
        code: TEST_CAT_CODE
      })
    assert.strictEqual(dupRes.status, 409)
    assert.strictEqual(dupRes.body.error, 'DUPLICATE_CODE')
  })

  it('4. Product Validation: Rejects empty name or SKU', async () => {
    const res1 = await request(app)
      .post('/api/v1/catalogue/products')
      .set(adminHeaders)
      .send({ name: '', sku: 'SKU-001' })
    assert.strictEqual(res1.status, 400)
    assert.strictEqual(res1.body.ok, false)

    const res2 = await request(app)
      .post('/api/v1/catalogue/products')
      .set(adminHeaders)
      .send({ name: 'Valid Product', sku: '' })
    assert.strictEqual(res2.status, 400)
    assert.strictEqual(res2.body.ok, false)
  })

  it('5. Product Creation with initial branch stock and SKU uniqueness', async () => {
    const res = await request(app)
      .post('/api/v1/catalogue/products')
      .set(adminHeaders)
      .send({
        id: 'PROD-TEST-INV-01',
        name: 'EcoDrive Test Bike Turbo',
        modelName: 'ED-Test Turbo',
        sku: TEST_PROD_SKU,
        categoryId: createdCatId,
        category: 'Test Prototype Vehicles',
        specs: '72V 40Ah · 1500W · Test Edition',
        sellingPrice: 320000,
        costPrice: 240000,
        dealerPrice: 280000,
        reorderLevel: 4,
        initialStock: {
          peshawar: 10,
          islamabad: 5,
          lahore: 2,
          rawalpindi: 0
        }
      })

    assert.strictEqual(res.status, 201)
    assert.ok(res.body.id)
    assert.strictEqual(res.body.sku, TEST_PROD_SKU)
    assert.strictEqual(res.body.sellingPrice, 320000)
    assert.strictEqual(res.body.total, 17) // 10 + 5 + 2 + 0
    assert.strictEqual(res.body.available, 17)
    assert.strictEqual(res.body.peshawar, 10)
    assert.strictEqual(res.body.islamabad, 5)
    assert.strictEqual(res.body.lahore, 2)
    createdProdId = res.body.id

    // Verify stock rows directly in MySQL
    const stockRows = await query('SELECT * FROM `inventory_stock` WHERE `product_id` = ?', [createdProdId])
    assert.strictEqual(stockRows.length, 4, 'Stock rows must be initialized across 4 branches')

    // Duplicate SKU check must return 409
    const dupRes = await request(app)
      .post('/api/v1/catalogue/products')
      .set(adminHeaders)
      .send({
        name: 'Another Bike',
        sku: TEST_PROD_SKU
      })
    assert.strictEqual(dupRes.status, 409)
    assert.strictEqual(dupRes.body.error, 'DUPLICATE_SKU')
  })

  it('6. Stock Calculations: Invariant available = on_hand - reserved and low-stock threshold alert', async () => {
    const res = await request(app)
      .get(`/api/v1/inventory/stock?product_id=${createdProdId}&branch_id=BR-01`)
      .set(adminHeaders)
    assert.strictEqual(res.status, 200)
    assert.ok(Array.isArray(res.body))
    const item = res.body.find(s => s.product_id === createdProdId && s.branch_id === 'BR-01')
    assert.ok(item, 'Peshawar stock row must be returned')
    assert.strictEqual(item.available, item.onHand - item.reserved)
    assert.strictEqual(item.isLowStock, item.available <= item.reorderLevel)
  })

  it('7. Stock Receipts: Inward receipt increases on_hand and appends immutable ledger entry', async () => {
    const beforeRes = await request(app)
      .get(`/api/v1/inventory/stock?product_id=${createdProdId}&branch_id=BR-01`)
      .set(adminHeaders)
    const initialOnHand = beforeRes.body[0].onHand

    const receiptRes = await request(app)
      .post('/api/v1/inventory/receipts')
      .set(adminHeaders)
      .send({
        product_id: createdProdId,
        branch_id: 'BR-01',
        quantity: 5,
        reference: 'GRN-TEST-101',
        user: 'Store Officer Test',
        notes: 'Inward shipment of 5 units'
      })
    assert.strictEqual(receiptRes.status, 201)
    assert.strictEqual(receiptRes.body.ok, true)
    assert.strictEqual(receiptRes.body.data.afterOnHand, initialOnHand + 5)

    // Verify updated stock in MySQL
    const [updatedStock] = await query(
      'SELECT on_hand, reserved, available FROM `inventory_stock` WHERE `product_id` = ? AND `branch_id` = "BR-01"',
      [createdProdId]
    )
    assert.strictEqual(updatedStock.on_hand, initialOnHand + 5)
    assert.strictEqual(updatedStock.available, updatedStock.on_hand - updatedStock.reserved)

    // Verify movement ledger entry was created
    const [ledgerEntry] = await query(
      'SELECT * FROM `stock_movements` WHERE `product_id` = ? AND `reference_id` = "GRN-TEST-101"',
      [createdProdId]
    )
    assert.ok(ledgerEntry, 'Immutable ledger row must exist')
    assert.strictEqual(ledgerEntry.reference_type, 'RECEIPT')
    assert.strictEqual(ledgerEntry.quantity, 5)
    assert.strictEqual(ledgerEntry.user, 'Store Officer Test')
  })

  it('8. Stock Issues: Deducts on_hand, prevents negative stock, and appends ledger entry', async () => {
    // 1. Valid issue
    const issueRes = await request(app)
      .post('/api/v1/inventory/issues')
      .set(adminHeaders)
      .send({
        product_id: createdProdId,
        branch_id: 'BR-01',
        quantity: 3,
        reference: 'ISSUE-TEST-01',
        reason: 'Service Bay Allocation',
        user: 'Store Officer Test'
      })
    assert.strictEqual(issueRes.status, 200)
    assert.strictEqual(issueRes.body.ok, true)

    // 2. Invalid issue exceeding available stock must return 400 Bad Request
    const excessiveIssueRes = await request(app)
      .post('/api/v1/inventory/issues')
      .set(adminHeaders)
      .send({
        product_id: createdProdId,
        branch_id: 'BR-01',
        quantity: 9999, // Way more than available
        reference: 'ISSUE-TEST-FAIL',
        reason: 'Impossible Issue'
      })
    assert.strictEqual(excessiveIssueRes.status, 400)
    assert.strictEqual(excessiveIssueRes.body.error, 'INSUFFICIENT_STOCK')
  })

  it('9. Stock Adjustments: Enforces MANDATORY reason validation (HTTP 422)', async () => {
    // Missing reason
    const failRes1 = await request(app)
      .post('/api/v1/inventory/adjustments')
      .set(adminHeaders)
      .send({
        product_id: createdProdId,
        branch_id: 'BR-01',
        new_quantity: 10
      })
    assert.strictEqual(failRes1.status, 422)
    assert.strictEqual(failRes1.body.error, 'VALIDATION_ERROR')
    assert.ok(failRes1.body.message.toLowerCase().includes('mandatory'))

    // Empty string reason
    const failRes2 = await request(app)
      .post('/api/v1/inventory/adjustments')
      .set(adminHeaders)
      .send({
        product_id: createdProdId,
        branch_id: 'BR-01',
        reason: '   ',
        new_quantity: 10
      })
    assert.strictEqual(failRes2.status, 422)
    assert.strictEqual(failRes2.body.error, 'VALIDATION_ERROR')
  })

  it('10. Stock Adjustments: Creates adjustment with reason and approves it with ACID transaction', async () => {
    const [stockBefore] = await query(
      'SELECT on_hand, reserved, available FROM `inventory_stock` WHERE `product_id` = ? AND `branch_id` = "BR-01"',
      [createdProdId]
    )

    const createRes = await request(app)
      .post('/api/v1/inventory/adjustments')
      .set(adminHeaders)
      .send({
        id: 'ADJ-TEST-901',
        product_id: createdProdId,
        branch_id: 'BR-01',
        branch: 'Peshawar',
        old_quantity: stockBefore.on_hand,
        new_quantity: stockBefore.on_hand + 2,
        difference: 2,
        reason: 'Annual Physical Stock Audit Reconciliation',
        notes: 'Found 2 units in staging bay'
      })
    assert.strictEqual(createRes.status, 201)
    assert.strictEqual(createRes.body.status, 'Pending')
    testAdjId = createRes.body.id

    // Approve adjustment
    const approveRes = await request(app)
      .post(`/api/v1/inventory/adjustments/${testAdjId}/approve`)
      .set(adminHeaders)
      .send({ approvedBy: 'Super Admin Test' })
    assert.strictEqual(approveRes.status, 200)
    assert.strictEqual(approveRes.body.ok, true)
    assert.strictEqual(approveRes.body.adjustment.status, 'Approved')

    // Verify stock was updated in MySQL
    const [stockAfter] = await query(
      'SELECT on_hand, reserved, available FROM `inventory_stock` WHERE `product_id` = ? AND `branch_id` = "BR-01"',
      [createdProdId]
    )
    assert.strictEqual(stockAfter.on_hand, stockBefore.on_hand + 2)
    assert.strictEqual(stockAfter.available, stockAfter.on_hand - stockAfter.reserved)

    // Verify movement ledger record
    const [mov] = await query(
      'SELECT * FROM `stock_movements` WHERE `reference_type` = "ADJUSTMENT" AND `reference_id` = ?',
      [testAdjId]
    )
    assert.ok(mov, 'Movement ledger must record adjustment')
    assert.strictEqual(mov.quantity, 2)
    assert.strictEqual(mov.user, 'Super Admin Test')
  })

  it('11. Controlled Inter-Branch Transfers: Dispatch and Receive strictly conserves system-wide stock', async () => {
    // Check initial stock at BR-01 (Peshawar) and BR-02 (Islamabad)
    const [peshawarBefore] = await query(
      'SELECT on_hand, reserved, available FROM `inventory_stock` WHERE `product_id` = ? AND `branch_id` = "BR-01"',
      [createdProdId]
    )
    const [islamabadBefore] = await query(
      'SELECT on_hand, reserved, available FROM `inventory_stock` WHERE `product_id` = ? AND `branch_id` = "BR-02"',
      [createdProdId]
    )
    const totalBefore = peshawarBefore.on_hand + islamabadBefore.on_hand

    // 1. Create transfer from BR-01 to BR-02 of 4 units
    const createTransRes = await request(app)
      .post('/api/v1/inventory/transfers')
      .set(adminHeaders)
      .send({
        id: 'TR-TEST-881',
        fromBranch_id: 'BR-01',
        toBranch_id: 'BR-02',
        carrier: 'Pak Logistics Express Test',
        requestedBy: 'Bilal Shah',
        notes: 'Replenishment for Islamabad branch',
        items: [
          {
            product_id: createdProdId,
            quantity: 4
          }
        ]
      })
    assert.strictEqual(createTransRes.status, 201)
    assert.strictEqual(createTransRes.body.status, 'Pending')
    testTransferId = createTransRes.body.id

    // 2. Dispatch transfer (deducts from BR-01)
    const dispatchRes = await request(app)
      .post(`/api/v1/inventory/transfers/${testTransferId}/dispatch`)
      .set(adminHeaders)
      .send({
        dispatchedBy: 'Peshawar Warehouse Manager',
        carrier: 'Pak Logistics Express Test'
      })
    assert.strictEqual(dispatchRes.status, 200)
    assert.strictEqual(dispatchRes.body.transfer.status, 'In Transit')

    const [peshawarAfterDispatch] = await query(
      'SELECT on_hand FROM `inventory_stock` WHERE `product_id` = ? AND `branch_id` = "BR-01"',
      [createdProdId]
    )
    assert.strictEqual(peshawarAfterDispatch.on_hand, peshawarBefore.on_hand - 4)

    // 3. Receive transfer (adds to BR-02)
    const receiveRes = await request(app)
      .post(`/api/v1/inventory/transfers/${testTransferId}/receive`)
      .set(adminHeaders)
      .send({
        receiverName: 'Islamabad Receiving Officer',
        receiverNotes: 'All 4 units intact in showroom condition'
      })
    assert.strictEqual(receiveRes.status, 200)
    assert.strictEqual(receiveRes.body.transfer.status, 'Received')

    const [islamabadAfterReceive] = await query(
      'SELECT on_hand FROM `inventory_stock` WHERE `product_id` = ? AND `branch_id` = "BR-02"',
      [createdProdId]
    )
    assert.strictEqual(islamabadAfterReceive.on_hand, islamabadBefore.on_hand + 4)

    // 4. Verify system-wide stock conservation: total stock must be unchanged!
    const totalAfter = peshawarAfterDispatch.on_hand + islamabadAfterReceive.on_hand
    assert.strictEqual(totalAfter, totalBefore, 'Stock must be 100% conserved across branches')
  })

  it('12. Sales Order Stock Reservation & Cancellation: Atomic reservation and release with row locks', async () => {
    const [stockBefore] = await query(
      'SELECT on_hand, reserved, available FROM `inventory_stock` WHERE `product_id` = ? AND `branch_id` = "BR-01"',
      [createdProdId]
    )

    // 1. Create order for 3 units
    const orderRes = await request(app)
      .post('/api/v1/orders')
      .set(adminHeaders)
      .send({
        order_number: 'ORD-TEST-INV-RES-01',
        customer_id: 'CUST-101',
        customer_name: 'Ahsan Khan',
        branch_id: 'BR-01',
        branch: 'Peshawar',
        salesperson: 'Hamza Ali',
        items: [
          {
            product_id: createdProdId,
            product: 'EcoDrive Test Bike Turbo',
            quantity: 3,
            unit_price: 320000
          }
        ]
      })
    assert.strictEqual(orderRes.status, 201)
    testOrderId = orderRes.body.id

    // 2. Verify stock reserved was incremented and available was decremented
    const [stockAfterReserve] = await query(
      'SELECT on_hand, reserved, available FROM `inventory_stock` WHERE `product_id` = ? AND `branch_id` = "BR-01"',
      [createdProdId]
    )
    assert.strictEqual(stockAfterReserve.reserved, stockBefore.reserved + 3)
    assert.strictEqual(stockAfterReserve.available, stockBefore.available - 3)
    assert.strictEqual(stockAfterReserve.on_hand, stockBefore.on_hand)

    // Verify reservation logged in movement ledger
    const [resMov] = await query(
      'SELECT * FROM `stock_movements` WHERE `reference_type` = "SALE_RESERVATION" AND `reference_id` = ?',
      [orderRes.body.order]
    )
    assert.ok(resMov, 'Sales order reservation must be logged in stock movements')

    // 3. Cancel order and verify release of reservation
    const cancelRes = await request(app)
      .post(`/api/v1/orders/${testOrderId}/cancel`)
      .set(adminHeaders)
    assert.strictEqual(cancelRes.status, 200)
    assert.strictEqual(cancelRes.body.order?.status || cancelRes.body.status, 'Cancelled')

    const [stockAfterCancel] = await query(
      'SELECT on_hand, reserved, available FROM `inventory_stock` WHERE `product_id` = ? AND `branch_id` = "BR-01"',
      [createdProdId]
    )
    assert.strictEqual(stockAfterCancel.reserved, stockBefore.reserved)
    assert.strictEqual(stockAfterCancel.available, stockBefore.available)

    // Verify cancellation release logged in movement ledger
    const [relMov] = await query(
      'SELECT * FROM `stock_movements` WHERE `reference_type` = "SALE_RELEASE" AND `reference_id` = ?',
      [orderRes.body.order]
    )
    assert.ok(relMov, 'Sales order release must be logged in stock movements')
  })

  it('13. Concurrency & Row Locking: Concurrent stock operations prevent race conditions and negative stock', async () => {
    // Current available stock
    const [stock] = await query(
      'SELECT on_hand, reserved, available FROM `inventory_stock` WHERE `product_id` = ? AND `branch_id` = "BR-02"',
      [createdProdId]
    )
    const available = stock.available

    // Attempt 3 concurrent issues that each take available - 1
    // At most 1 should succeed; the others must fail with HTTP 400 INSUFFICIENT_STOCK
    const promises = [1, 2, 3].map(i =>
      request(app)
        .post('/api/v1/inventory/issues')
        .set(adminHeaders)
        .send({
          product_id: createdProdId,
          branch_id: 'BR-02',
          quantity: available,
          reference: `ISSUE-CONCURRENT-${i}`,
          reason: 'Concurrent stress check'
        })
    )

    const results = await Promise.all(promises)
    const successful = results.filter(r => r.status === 200)
    const rejected = results.filter(r => r.status === 400)

    assert.strictEqual(successful.length, 1, 'Only one concurrent issue of all available stock should succeed')
    assert.strictEqual(rejected.length, 2, 'The other concurrent issues must be rejected due to row locking')

    // Verify stock never went negative
    const [finalStock] = await query(
      'SELECT on_hand, reserved, available FROM `inventory_stock` WHERE `product_id` = ? AND `branch_id` = "BR-02"',
      [createdProdId]
    )
    assert.ok(finalStock.available >= 0, 'Available stock must NEVER be negative')
    assert.ok(finalStock.on_hand >= finalStock.reserved, 'On-hand must be >= reserved')
  })

  it('14. Immutable Movement Ledger: Query ledger returns chronological audit trail with user and reference', async () => {
    const res = await request(app)
      .get(`/api/v1/inventory/ledger?product_id=${createdProdId}&with_kpis=true`)
      .set(adminHeaders)
    assert.strictEqual(res.status, 200)
    assert.ok(res.body.movements)
    assert.ok(res.body.movements.length >= 4, 'Ledger must contain receipts, issues, adjustments, and transfers')
    assert.ok(res.body.kpis, 'Ledger summary KPIs must be present')

    // Check immutability: movement numbers are unique and chronological
    const movNumbers = res.body.movements.map(m => m.movementNumber)
    const uniqueNumbers = new Set(movNumbers)
    assert.strictEqual(uniqueNumbers.size, movNumbers.length, 'Movement numbers must all be unique')
  })
})
