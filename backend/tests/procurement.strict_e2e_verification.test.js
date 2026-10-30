import { test, before, after } from 'node:test'
import assert from 'node:assert'
import request from 'supertest'
import { app } from '../src/app.js'
import { connectDB, disconnectDB, query } from '../src/config/db.js'
import { runMigrations } from '../src/db/migrations.js'
import { 
  getAdminAuthHeader, 
  getBranchManagerAuthHeader, 
  getTechnicianAuthHeader, 
  getReadOnlyProcurementAuthHeader 
} from './helpers/auth.helper.js'

test('AJ EcoDrive Backend — Strict E2E Verification & Stock Reconciliation Suite', async (t) => {
  let isDbReady = false
  const adminHeaders = getAdminAuthHeader()
  const peshawarBmHeaders = getBranchManagerAuthHeader('BR-01', 'Peshawar')
  const lahoreBmHeaders = getBranchManagerAuthHeader('BR-03', 'Lahore')
  const techHeaders = getTechnicianAuthHeader('BR-01', 'Peshawar')
  const readOnlyHeaders = getReadOnlyProcurementAuthHeader()

  const TEST_SUP_CODE = 'SUP-E2E-VERIF-99'
  const TEST_SUP_NAME = 'Precision E2E Supplier Industrial Ltd'
  const TEST_PROD_ID = 'PROD-007' // PowerCell 72V 30Ah
  const TEST_BRANCH_ID = 'BR-01' // Peshawar
  const TEST_RECEIPT_NUMBER = 'GR-E2E-VERIF-001'
  const TEST_DELIVERY_NOTE = 'DN-E2E-VERIF-8801'

  let createdSupplierId = null
  let createdPoId = null
  let createdPoNumber = null
  let initialStockOnHand = 0
  let initialStockAvailable = 0

  await t.test('0. Database initialization & baseline capture', async () => {
    isDbReady = await connectDB()
    assert.strictEqual(isDbReady, true, 'Database must be successfully connected')
    await runMigrations()

    // Clean up any stale test fixtures before starting
    await query('DELETE FROM `stock_movements` WHERE `reference_id` LIKE "%E2E-VERIF%"')
    await query('DELETE FROM `vendor_bills` WHERE `supplier_id` = ? OR `po_id` LIKE "%E2E-VERIF%" OR `bill_number` LIKE "%E2E-VERIF%"', [TEST_SUP_CODE])
    await query('DELETE FROM `goods_receipt_items` WHERE `receipt_id` LIKE "%E2E-VERIF%"')
    await query('DELETE FROM `goods_receipts` WHERE `id` LIKE "%E2E-VERIF%" OR `receipt_number` LIKE "%E2E-VERIF%" OR `po_id` LIKE "%E2E-VERIF%"')
    await query('DELETE FROM `purchase_order_items` WHERE `po_id` IN (SELECT `id` FROM `purchase_orders` WHERE `supplier_id` = ?)', [TEST_SUP_CODE])
    await query('DELETE FROM `purchase_orders` WHERE `supplier_id` = ?', [TEST_SUP_CODE])
    await query('DELETE FROM `purchase_order_items` WHERE `po_id` LIKE "%E2E-VERIF%"')
    await query('DELETE FROM `purchase_orders` WHERE `id` LIKE "%E2E-VERIF%" OR `po_number` LIKE "%E2E-VERIF%"')
    await query('DELETE FROM `suppliers` WHERE `code` = ? OR `name` = ? OR `id` LIKE "%E2E-VERIF%"', [TEST_SUP_CODE, TEST_SUP_NAME])
    await query('DELETE FROM `serialized_units` WHERE `chassis_number` LIKE "%E2E-VERIF%" OR `serial_number` LIKE "%E2E-VERIF%"')

    // Read initial stock baseline
    const [stockRow] = await query(
      'SELECT on_hand, available FROM `inventory_stock` WHERE `product_id` = ? AND `branch_id` = ?',
      [TEST_PROD_ID, TEST_BRANCH_ID]
    )
    initialStockOnHand = stockRow ? parseInt(stockRow.on_hand || 0, 10) : 0
    initialStockAvailable = stockRow ? parseInt(stockRow.available || 0, 10) : 0
  })

  // =========================================================================
  // 1. SUPPLIERS WORKFLOW
  // =========================================================================
  await t.test('1. rejects creating supplier with missing required fields (422)', async () => {
    const res = await request(app)
      .post('/api/v1/procurement/suppliers')
      .set(adminHeaders)
      .send({
        name: '', // missing
        contact: 'Test Person'
      })

    assert.strictEqual(res.status, 422)
    assert.strictEqual(res.body.ok, false)
    assert.match(res.body.message, /Supplier name is required/i)
  })

  await t.test('2. creates a uniquely identifiable test supplier and verifies database persistence', async () => {
    const res = await request(app)
      .post('/api/v1/procurement/suppliers')
      .set(adminHeaders)
      .send({
        code: TEST_SUP_CODE,
        name: TEST_SUP_NAME,
        contact: 'Zainab Qazi',
        phone: '+92 345 1112233',
        email: 'zainab@e2e-supplier.test',
        city: 'Karachi',
        terms: 'Net 45',
        currency: 'PKR',
        tax_id: 'TRN-E2E-998877'
      })

    assert.strictEqual(res.status, 201)
    assert.ok(res.body.id, 'Must return generated supplier ID')
    createdSupplierId = res.body.id

    // Direct MySQL Verification
    const [dbRow] = await query('SELECT * FROM `suppliers` WHERE `id` = ?', [createdSupplierId])
    assert.ok(dbRow, 'Supplier must exist in MySQL database')
    assert.strictEqual(dbRow.code, TEST_SUP_CODE)
    assert.strictEqual(dbRow.name, TEST_SUP_NAME)
    assert.strictEqual(dbRow.contact, 'Zainab Qazi')
    assert.strictEqual(dbRow.phone, '+92 345 1112233')
    assert.strictEqual(dbRow.terms, 'Net 45')
  })

  await t.test('3. rejects duplicate supplier code and duplicate name (409)', async () => {
    const resCodeDup = await request(app)
      .post('/api/v1/procurement/suppliers')
      .set(adminHeaders)
      .send({
        code: TEST_SUP_CODE,
        name: 'Another Unique Name',
        contact: 'Some Contact',
        phone: '+92 300 0000000'
      })
    assert.strictEqual(resCodeDup.status, 409)

    const resNameDup = await request(app)
      .post('/api/v1/procurement/suppliers')
      .set(adminHeaders)
      .send({
        code: 'SUP-ANOTHER-01',
        name: TEST_SUP_NAME,
        contact: 'Some Contact',
        phone: '+92 300 0000000'
      })
    assert.strictEqual(resNameDup.status, 409)
  })

  await t.test('4. edits supplier and confirms updated values persist in database and reload cleanly', async () => {
    const res = await request(app)
      .put(`/api/v1/procurement/suppliers/${createdSupplierId}`)
      .set(adminHeaders)
      .send({
        contact: 'Zainab Qazi (Promoted Director)',
        phone: '+92 345 9998877',
        terms: 'Net 60',
        notes: 'Authorised battery supplier verified under ISO-9001'
      })

    assert.strictEqual(res.status, 200)
    assert.strictEqual(res.body.contact, 'Zainab Qazi (Promoted Director)')
    assert.strictEqual(res.body.terms, 'Net 60')

    // Direct MySQL reload check
    const [dbRow] = await query('SELECT contact, phone, terms, notes FROM `suppliers` WHERE `id` = ?', [createdSupplierId])
    assert.strictEqual(dbRow.contact, 'Zainab Qazi (Promoted Director)')
    assert.strictEqual(dbRow.phone, '+92 345 9998877')
    assert.strictEqual(dbRow.terms, 'Net 60')
    assert.strictEqual(dbRow.notes, 'Authorised battery supplier verified under ISO-9001')
  })

  // =========================================================================
  // 2. PURCHASE ORDERS WORKFLOW
  // =========================================================================
  await t.test('5. creates a PO and verifies server totals, database line items, and Draft status', async () => {
    const poPayload = {
      supplier_id: createdSupplierId,
      branch_id: TEST_BRANCH_ID,
      branch: 'Peshawar',
      destination: 'Peshawar',
      order_date: new Date().toISOString().split('T')[0],
      expected_date: '2026-11-30',
      carrier: 'National Express Freight',
      shipment_method: 'Ground Express',
      payment_terms: 'Net 60',
      notes: 'Strict E2E Verification Consignment for PowerCell Packs',
      tax: 5000,
      items: [
        {
          product_id: TEST_PROD_ID,
          product: 'PowerCell 72V 30Ah',
          sku: 'SKU-BAT-7230',
          ordered_quantity: 10,
          unit_cost: 45000,
          is_serialized: 1
        }
      ]
    }

    const res = await request(app)
      .post('/api/v1/procurement/purchase-orders')
      .set(adminHeaders)
      .send(poPayload)

    assert.strictEqual(res.status, 201)
    const data = res.body
    assert.ok(data.id, 'Must return PO ID')
    assert.ok(data.po_number, 'Must return server PO number')
    createdPoId = data.id
    createdPoNumber = data.po_number

    assert.strictEqual(data.status, 'Draft')
    assert.strictEqual(data.totalOrdered, 10)
    assert.strictEqual(data.remainingUnits, 10)
    assert.strictEqual(data.subtotal, 450000)
    assert.strictEqual(data.totalAmount, 455000) // 450,000 + 5,000 tax

    // Direct MySQL Verification
    const [poDb] = await query('SELECT * FROM `purchase_orders` WHERE `id` = ?', [createdPoId])
    assert.ok(poDb, 'PO must exist in database')
    assert.strictEqual(poDb.po_number, createdPoNumber)
    assert.strictEqual(poDb.status, 'Draft')
    assert.strictEqual(parseFloat(poDb.amount), 455000)

    const itemsDb = await query('SELECT * FROM `purchase_order_items` WHERE `po_id` = ?', [createdPoId])
    assert.strictEqual(itemsDb.length, 1)
    assert.strictEqual(itemsDb[0].product_id, TEST_PROD_ID)
    assert.strictEqual(itemsDb[0].ordered_quantity, 10)
    assert.strictEqual(itemsDb[0].received_quantity, 0)
  })

  await t.test('6. rejects receiving goods on Draft PO before approval (400)', async () => {
    const res = await request(app)
      .post(`/api/v1/procurement/purchase-orders/${createdPoId}/receive`)
      .set(adminHeaders)
      .send({
        lines: [{ product_id: TEST_PROD_ID, current_received_quantity: 5 }]
      })

    assert.strictEqual(res.status, 400)
    assert.match(res.body.message, /Order must be Approved before receiving/i)
  })

  await t.test('7. approves PO and verifies status transition to Approved', async () => {
    const res = await request(app)
      .post(`/api/v1/procurement/purchase-orders/${createdPoId}/approve`)
      .set(adminHeaders)

    assert.strictEqual(res.status, 200)
    assert.strictEqual(res.body.status, 'Approved')

    const [poDb] = await query('SELECT status, approved_by FROM `purchase_orders` WHERE `id` = ?', [createdPoId])
    assert.strictEqual(poDb.status, 'Approved')
    assert.ok(poDb.approved_by)
  })

  await t.test('8. tests PO cancellation on an unreceived PO and rejects cancelling active POs', async () => {
    // Create a temporary PO to test cancellation
    const cancelPoRes = await request(app)
      .post('/api/v1/procurement/purchase-orders')
      .set(adminHeaders)
      .send({
        supplier_id: createdSupplierId,
        branch_id: TEST_BRANCH_ID,
        branch: 'Peshawar',
        items: [{ product_id: TEST_PROD_ID, ordered_quantity: 2, unit_cost: 45000 }]
      })

    const cancelPoId = cancelPoRes.body.id
    const resCancel = await request(app)
      .post(`/api/v1/procurement/purchase-orders/${cancelPoId}/cancel`)
      .set(adminHeaders)
      .send({ reason: 'Accidental duplicate demand' })

    assert.strictEqual(resCancel.status, 200)
    assert.strictEqual(resCancel.body.status, 'Cancelled')

    const [cancelledDb] = await query('SELECT status, cancellation_reason FROM `purchase_orders` WHERE `id` = ?', [cancelPoId])
    assert.strictEqual(cancelledDb.status, 'Cancelled')
    assert.strictEqual(cancelledDb.cancellation_reason, 'Accidental duplicate demand')

    // Clean up cancel test PO
    await query('DELETE FROM `purchase_order_items` WHERE `po_id` = ?', [cancelPoId])
    await query('DELETE FROM `purchase_orders` WHERE `id` = ?', [cancelPoId])
  })

  // =========================================================================
  // 3. GOODS RECEIVING & STOCK RECONCILIATION
  // =========================================================================
  await t.test('9. receives goods: 6 received (5 accepted, 1 damaged) and verifies ONLY accepted units increment stock', async () => {
    const receiptPayload = {
      receipt_number: TEST_RECEIPT_NUMBER,
      delivery_note: TEST_DELIVERY_NOTE,
      receipt_date: new Date().toISOString().split('T')[0],
      received_by: 'E2E Bay Inspector',
      notes: 'Initial consignment delivery inspected at Bay 1',
      lines: [
        {
          product_id: TEST_PROD_ID,
          product: 'PowerCell 72V 30Ah',
          sku: 'SKU-BAT-7230',
          current_received_quantity: 6,
          damaged_quantity: 1, // 5 accepted, 1 damaged
          discrepancy_reason: '1 unit dented battery casing during carrier transit'
        }
      ],
      serializedUnits: [
        {
          serial: 'E2E-VERIF-SN-001',
          chassis: 'E2E-VERIF-CH-001',
          vin: 'E2E-VERIF-VIN-001',
          motorNumber: 'MTR-72V-001',
          batteryNumber: 'BAT-7230-001',
          condition: 'Good',
          qc: 'Pass'
        },
        {
          serial: 'E2E-VERIF-SN-002',
          chassis: 'E2E-VERIF-CH-002',
          vin: 'E2E-VERIF-VIN-002',
          motorNumber: 'MTR-72V-002',
          batteryNumber: 'BAT-7230-002',
          condition: 'Damaged', // Damaged unit
          qc: 'Fail'
        }
      ]
    }

    const res = await request(app)
      .post(`/api/v1/procurement/purchase-orders/${createdPoId}/receive`)
      .set(adminHeaders)
      .send(receiptPayload)

    assert.strictEqual(res.status, 201)
    assert.strictEqual(res.body.receipt_number, TEST_RECEIPT_NUMBER)
    assert.strictEqual(res.body.status, 'Posted')

    // 1. Stock Reconciliation Check:
    // Stock MUST increase by EXACTLY 5 (accepted units), NOT 6!
    const [stockDb] = await query(
      'SELECT on_hand, available FROM `inventory_stock` WHERE `product_id` = ? AND `branch_id` = ?',
      [TEST_PROD_ID, TEST_BRANCH_ID]
    )
    assert.ok(stockDb, 'Stock record must exist')
    const currentOnHand = parseInt(stockDb.on_hand, 10)
    const currentAvailable = parseInt(stockDb.available, 10)

    assert.strictEqual(currentOnHand, initialStockOnHand + 5, 'on_hand must strictly increase by accepted units (5)')
    assert.strictEqual(currentAvailable, initialStockAvailable + 5, 'available must strictly increase by accepted units (5)')

    // 2. Audit Ledger Movement Check:
    const movements = await query(
      'SELECT * FROM `stock_movements` WHERE `reference_id` = ? AND `product_id` = ?',
      [TEST_RECEIPT_NUMBER, TEST_PROD_ID]
    )
    assert.strictEqual(movements.length, 1, 'Exactly one stock movement ledger entry must be created')
    assert.strictEqual(movements[0].reference_type, 'RECEIPT')
    assert.strictEqual(movements[0].quantity, 5, 'Movement quantity must be exactly 5')
    assert.strictEqual(movements[0].on_hand_before, initialStockOnHand)
    assert.strictEqual(movements[0].on_hand_after, initialStockOnHand + 5)

    // 3. Serialized Units QC Status Check:
    const [goodUnit] = await query('SELECT status, condition_status FROM `serialized_units` WHERE `chassis_number` = "E2E-VERIF-CH-001"')
    assert.strictEqual(goodUnit.status, 'Available')

    const [damagedUnit] = await query('SELECT status, condition_status FROM `serialized_units` WHERE `chassis_number` = "E2E-VERIF-CH-002"')
    assert.strictEqual(damagedUnit.status, 'QC Hold', 'Damaged unit must be flagged QC Hold and excluded from available inventory')

    // 4. Purchase Order Status Check:
    const [poDb] = await query('SELECT status, total_received, remaining_units FROM `purchase_orders` WHERE `id` = ?', [createdPoId])
    assert.strictEqual(poDb.status, 'Partially Received')
    assert.strictEqual(poDb.total_received, 6)
    assert.strictEqual(poDb.remaining_units, 4)
  })

  await t.test('10. enforces duplicate delivery note guardrail (409)', async () => {
    const res = await request(app)
      .post(`/api/v1/procurement/purchase-orders/${createdPoId}/receive`)
      .set(adminHeaders)
      .send({
        delivery_note: TEST_DELIVERY_NOTE, // Duplicate
        lines: [{ product_id: TEST_PROD_ID, current_received_quantity: 1 }]
      })

    assert.strictEqual(res.status, 409)
    assert.match(res.body.message, /already been posted/i)
  })

  await t.test('11. enforces over-receiving guardrail without discrepancy reason (400)', async () => {
    // Remaining is 4. Trying to receive 10 without discrepancy reason
    const res = await request(app)
      .post(`/api/v1/procurement/purchase-orders/${createdPoId}/receive`)
      .set(adminHeaders)
      .send({
        delivery_note: 'DN-EXCESS-01',
        lines: [{ product_id: TEST_PROD_ID, current_received_quantity: 10, discrepancy_reason: '' }]
      })

    assert.strictEqual(res.status, 400)
    assert.match(res.body.message, /Over-receiving prevented/i)
  })

  await t.test('12. enforces negative quantity rejection guardrail (400)', async () => {
    const res = await request(app)
      .post(`/api/v1/procurement/purchase-orders/${createdPoId}/receive`)
      .set(adminHeaders)
      .send({
        delivery_note: 'DN-NEG-01',
        lines: [{ product_id: TEST_PROD_ID, current_received_quantity: -2 }]
      })

    assert.strictEqual(res.status, 400)
    assert.match(res.body.message, /cannot be negative/i)
  })

  await t.test('13. cannot cancel a purchase order once items have been received (400)', async () => {
    const res = await request(app)
      .post(`/api/v1/procurement/purchase-orders/${createdPoId}/cancel`)
      .set(adminHeaders)
      .send({ reason: 'Should fail' })

    assert.strictEqual(res.status, 400)
    assert.match(res.body.message, /already been received/i)
  })

  await t.test('14. completes the remaining 4 units and verifies transition to Fully Received', async () => {
    const res = await request(app)
      .post(`/api/v1/procurement/purchase-orders/${createdPoId}/receive`)
      .set(adminHeaders)
      .send({
        receipt_number: 'GR-E2E-VERIF-002',
        delivery_note: 'DN-E2E-VERIF-8802',
        received_by: 'E2E Bay Inspector',
        lines: [
          {
            product_id: TEST_PROD_ID,
            current_received_quantity: 4,
            damaged_quantity: 0
          }
        ]
      })

    assert.strictEqual(res.status, 201)

    // Stock should have increased by 4 more
    const [stockDb] = await query(
      'SELECT on_hand, available FROM `inventory_stock` WHERE `product_id` = ? AND `branch_id` = ?',
      [TEST_PROD_ID, TEST_BRANCH_ID]
    )
    assert.strictEqual(parseInt(stockDb.on_hand, 10), initialStockOnHand + 5 + 4)

    const [poDb] = await query('SELECT status, total_received, remaining_units FROM `purchase_orders` WHERE `id` = ?', [createdPoId])
    assert.strictEqual(poDb.status, 'Fully Received')
    assert.strictEqual(poDb.total_received, 10)
    assert.strictEqual(poDb.remaining_units, 0)
  })

  await t.test('15. rejects receiving goods against a Fully Received PO (400)', async () => {
    const res = await request(app)
      .post(`/api/v1/procurement/purchase-orders/${createdPoId}/receive`)
      .set(adminHeaders)
      .send({
        delivery_note: 'DN-AFTER-FULL',
        lines: [{ product_id: TEST_PROD_ID, current_received_quantity: 1 }]
      })

    assert.strictEqual(res.status, 400)
    assert.match(res.body.message, /already Fully Received/i)
  })

  // =========================================================================
  // 4. RBAC & BRANCH ISOLATION
  // =========================================================================
  await t.test('16. strictly rejects unauthenticated requests with HTTP 401', async () => {
    const res = await request(app)
      .get('/api/v1/procurement/suppliers')

    assert.strictEqual(res.status, 401)
    assert.strictEqual(res.body.ok, false)
    assert.strictEqual(res.body.error, 'UNAUTHORIZED')
  })

  await t.test('17. strictly rejects users lacking procurement permissions with HTTP 403 (Technician role)', async () => {
    const res = await request(app)
      .get('/api/v1/procurement/suppliers')
      .set(techHeaders)

    assert.strictEqual(res.status, 403)
    assert.strictEqual(res.body.ok, false)
    assert.strictEqual(res.body.error, 'FORBIDDEN')
  })

  await t.test('18. enforces read-only permissions: can view but cannot create or mutate', async () => {
    // 1. Read is permitted
    const resGet = await request(app)
      .get('/api/v1/procurement/suppliers')
      .set(readOnlyHeaders)
    assert.strictEqual(resGet.status, 200)

    // 2. Write is blocked
    const resPost = await request(app)
      .post('/api/v1/procurement/suppliers')
      .set(readOnlyHeaders)
      .send({ name: 'Blocked Supplier', phone: '+92 300 1234567' })
    assert.strictEqual(resPost.status, 403)
  })

  await t.test('19. enforces branch isolation: Peshawar BM cannot create PO for Lahore branch (403)', async () => {
    const res = await request(app)
      .post('/api/v1/procurement/purchase-orders')
      .set(peshawarBmHeaders)
      .send({
        supplier_id: createdSupplierId,
        branch_id: 'BR-03', // Lahore (Unauthorized for Peshawar BM)
        branch: 'Lahore',
        items: [{ product_id: TEST_PROD_ID, ordered_quantity: 1, unit_cost: 45000 }]
      })

    assert.strictEqual(res.status, 403)
    assert.match(res.body.message, /Access denied: You cannot create a purchase order for branch/i)
  })

  await t.test('20. enforces branch isolation: Lahore BM cannot approve, receive, or inspect Peshawar PO (403)', async () => {
    // 1. Lahore BM attempts to inspect Peshawar PO
    const resInspect = await request(app)
      .get(`/api/v1/procurement/purchase-orders/${createdPoId}`)
      .set(lahoreBmHeaders)
    assert.strictEqual(resInspect.status, 403)

    // 2. Lahore BM attempts to approve Peshawar PO
    const resApprove = await request(app)
      .post(`/api/v1/procurement/purchase-orders/${createdPoId}/approve`)
      .set(lahoreBmHeaders)
    assert.strictEqual(resApprove.status, 403)

    // 3. Lahore BM attempts to receive Peshawar PO
    const resReceive = await request(app)
      .post(`/api/v1/procurement/purchase-orders/${createdPoId}/receive`)
      .set(lahoreBmHeaders)
      .send({
        lines: [{ product_id: TEST_PROD_ID, current_received_quantity: 1 }]
      })
    assert.strictEqual(resReceive.status, 403)
  })

  await t.test('21. confirms Super Admin has authoritative access across branches', async () => {
    const res = await request(app)
      .get(`/api/v1/procurement/purchase-orders/${createdPoId}`)
      .set(adminHeaders)

    assert.strictEqual(res.status, 200)
    assert.strictEqual(res.body.id, createdPoId)
  })

  // Cleanup block executed inside test flow before disconnect
  await t.test('22. Post-test cleanup and stock restoration', async () => {
    if (isDbReady) {
      // Reconcile and revert stock to initial baseline
      await query(
        'UPDATE `inventory_stock` SET `on_hand` = ?, `available` = ?, `updated_at` = NOW() WHERE `product_id` = ? AND `branch_id` = ?',
        [initialStockOnHand, initialStockAvailable, TEST_PROD_ID, TEST_BRANCH_ID]
      )

      // Clean up all generated test artifacts
      await query('DELETE FROM `stock_movements` WHERE `reference_id` LIKE "%E2E-VERIF%"')
      await query('DELETE FROM `vendor_bills` WHERE `supplier_id` = ? OR `po_id` LIKE "%E2E-VERIF%" OR `bill_number` LIKE "%E2E-VERIF%"', [TEST_SUP_CODE])
      await query('DELETE FROM `goods_receipt_items` WHERE `receipt_id` LIKE "%E2E-VERIF%"')
      await query('DELETE FROM `goods_receipts` WHERE `id` LIKE "%E2E-VERIF%" OR `receipt_number` LIKE "%E2E-VERIF%" OR `po_id` LIKE "%E2E-VERIF%"')
      if (createdPoId) {
        await query('DELETE FROM `purchase_order_items` WHERE `po_id` = ?', [createdPoId])
        await query('DELETE FROM `purchase_orders` WHERE `id` = ? OR `po_number` = ?', [createdPoId, createdPoNumber])
      }
      await query('DELETE FROM `purchase_order_items` WHERE `po_id` IN (SELECT `id` FROM `purchase_orders` WHERE `supplier_id` = ?)', [createdSupplierId || TEST_SUP_CODE])
      await query('DELETE FROM `purchase_orders` WHERE `supplier_id` = ?', [createdSupplierId || TEST_SUP_CODE])
      await query('DELETE FROM `purchase_order_items` WHERE `po_id` LIKE "%E2E-VERIF%"')
      await query('DELETE FROM `purchase_orders` WHERE `id` LIKE "%E2E-VERIF%" OR `po_number` LIKE "%E2E-VERIF%"')
      await query('DELETE FROM `suppliers` WHERE `code` = ? OR `name` = ? OR `id` LIKE "%E2E-VERIF%"', [TEST_SUP_CODE, TEST_SUP_NAME])
      await query('DELETE FROM `serialized_units` WHERE `chassis_number` LIKE "%E2E-VERIF%" OR `serial_number` LIKE "%E2E-VERIF%"')

      await disconnectDB()
    }
  })
})
