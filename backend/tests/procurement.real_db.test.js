import { describe, it, before, after } from 'node:test'
import assert from 'node:assert'
import request from 'supertest'
import { app } from '../src/app.js'
import { connectDB, disconnectDB, getDbStatus, query } from '../src/config/db.js'
import { runMigrations } from '../src/db/migrations.js'
import { 
  getAdminAuthHeader, 
  getBranchManagerAuthHeader, 
  getTechnicianAuthHeader, 
  getReadOnlyProcurementAuthHeader 
} from './helpers/auth.helper.js'

describe('AJ EcoDrive Backend — Procurement & Purchase Orders Module REAL MySQL Suite', () => {
  let isDbReady = false
  const adminHeaders = getAdminAuthHeader()

  const TEST_SUP_CODE = 'SUP-TEST-99'
  const TEST_SUP_NAME = 'Test Battery Tech Industrial Ltd'
  const TEST_PROD_ID = 'PROD-007' // PowerCell 72V 30Ah
  let createdSupplierId = null
  let createdPoId = null
  let createdPoNumber = null
  let createdReceiptId = null
  let cancelTestPoId = null

  before(async () => {
    isDbReady = await connectDB()
    if (isDbReady) {
      await runMigrations()
      // Clean up previous test artifacts if any
      await query('DELETE FROM `stock_movements` WHERE `reference_id` LIKE "%TEST%"')
      await query('DELETE FROM `vendor_bills` WHERE `po_id` LIKE "%TEST%" OR `bill_number` LIKE "%TEST%"')
      await query('DELETE FROM `goods_receipt_items` WHERE `receipt_id` LIKE "%TEST%"')
      await query('DELETE FROM `goods_receipts` WHERE `id` LIKE "%TEST%" OR `receipt_number` LIKE "%TEST%" OR `po_id` LIKE "%TEST%"')
      await query('DELETE FROM `purchase_order_items` WHERE `po_id` LIKE "%TEST%"')
      await query('DELETE FROM `purchase_orders` WHERE `id` LIKE "%TEST%" OR `po_number` LIKE "%TEST%"')
      await query('DELETE FROM `suppliers` WHERE `code` = ? OR `name` = ? OR `id` LIKE "%TEST%"', [TEST_SUP_CODE, TEST_SUP_NAME])
    }
  })

  after(async () => {
    if (isDbReady) {
      // Revert test stock additions (+9 units) to keep baseline pristine
      await query(
        'UPDATE `inventory_stock` SET on_hand = GREATEST(0, on_hand - 9), available = GREATEST(0, available - 9) WHERE `product_id` = ? AND `branch_id` = "BR-01"',
        [TEST_PROD_ID]
      )
      await query('DELETE FROM `stock_movements` WHERE `reference_id` LIKE "%TEST%"')
      await query('DELETE FROM `vendor_bills` WHERE `po_id` LIKE "%TEST%" OR `bill_number` LIKE "%TEST%"')
      await query('DELETE FROM `goods_receipt_items` WHERE `receipt_id` LIKE "%TEST%"')
      await query('DELETE FROM `goods_receipts` WHERE `id` LIKE "%TEST%" OR `receipt_number` LIKE "%TEST%" OR `po_id` LIKE "%TEST%"')
      await query('DELETE FROM `purchase_order_items` WHERE `po_id` LIKE "%TEST%"')
      await query('DELETE FROM `purchase_orders` WHERE `id` LIKE "%TEST%" OR `po_number` LIKE "%TEST%"')
      await query('DELETE FROM `suppliers` WHERE `code` = ? OR `name` = ? OR `id` LIKE "%TEST%"', [TEST_SUP_CODE, TEST_SUP_NAME])
      await disconnectDB()
    }
  })

  // 1. Database and Schema
  it('1. Verifies MySQL database connection and all 6 procurement tables exist', async () => {
    const status = getDbStatus()
    assert.strictEqual(status.isConnected, true, 'Real MySQL connection must be active')

    const tables = await query('SHOW TABLES')
    const tableNames = tables.map(t => Object.values(t)[0])
    const required = [
      'suppliers',
      'purchase_orders',
      'purchase_order_items',
      'goods_receipts',
      'goods_receipt_items',
      'vendor_bills'
    ]
    for (const reqTable of required) {
      assert.ok(tableNames.includes(reqTable), `Table "${reqTable}" must exist in MySQL ecodrive`)
    }
  })

  // 2. Supplier Validation
  it('2. Supplier Validation: Rejects missing required fields (name, contact, phone)', async () => {
    // Missing name
    const res1 = await request(app)
      .post('/api/v1/procurement/suppliers')
      .set(adminHeaders)
      .send({ contact: 'John Doe', phone: '+92 300 1234567' })
    assert.strictEqual(res1.status, 422)
    assert.strictEqual(res1.body.ok, false)

    // Missing contact
    const res2 = await request(app)
      .post('/api/v1/procurement/suppliers')
      .set(adminHeaders)
      .send({ name: 'Test Supplier', phone: '+92 300 1234567' })
    assert.strictEqual(res2.status, 422)
    assert.strictEqual(res2.body.ok, false)

    // Missing phone
    const res3 = await request(app)
      .post('/api/v1/procurement/suppliers')
      .set(adminHeaders)
      .send({ name: 'Test Supplier', contact: 'John Doe' })
    assert.strictEqual(res3.status, 422)
    assert.strictEqual(res3.body.ok, false)
  })

  // 3. Supplier Creation & Retrieval
  it('3. Supplier CRUD: Creates a supplier and verifies retrieval by ID and in list', async () => {
    const payload = {
      code: TEST_SUP_CODE,
      name: TEST_SUP_NAME,
      contact: 'Kamran Tariq',
      phone: '+92 321 9876543',
      email: 'sales@batterytech.pk',
      address: 'Industrial Estate Phase 2',
      city: 'Peshawar',
      country: 'Pakistan',
      tax_id: 'NTN-PK-99182',
      terms: 'Net 30',
      currency: 'PKR',
      notes: 'OEM battery packs testing partner'
    }

    const createRes = await request(app)
      .post('/api/v1/procurement/suppliers')
      .set(adminHeaders)
      .send(payload)

    assert.strictEqual(createRes.status, 201)
    assert.ok(createRes.body.id)
    assert.strictEqual(createRes.body.code, TEST_SUP_CODE)
    assert.strictEqual(createRes.body.name, TEST_SUP_NAME)
    assert.strictEqual(createRes.body.status, 'Active')
    createdSupplierId = createRes.body.id

    // Retrieve by ID
    const getRes = await request(app)
      .get(`/api/v1/procurement/suppliers/${createdSupplierId}`)
      .set(adminHeaders)
    assert.strictEqual(getRes.status, 200)
    assert.strictEqual(getRes.body.name, TEST_SUP_NAME)
    assert.strictEqual(getRes.body.phone, '+92 321 9876543')

    // Search in list
    const listRes = await request(app)
      .get('/api/v1/procurement/suppliers?search=Battery+Tech')
      .set(adminHeaders)
    assert.strictEqual(listRes.status, 200)
    assert.ok(Array.isArray(listRes.body))
    const found = listRes.body.find(s => s.code === TEST_SUP_CODE)
    assert.ok(found, 'Created supplier must appear in search results')
  })

  // 4. Duplicate Prevention
  it('4. Duplicate Prevention: Rejects creating a supplier with duplicate name or code', async () => {
    // Duplicate Code
    const dupCodeRes = await request(app)
      .post('/api/v1/procurement/suppliers')
      .set(adminHeaders)
      .send({
        code: TEST_SUP_CODE,
        name: 'Different Name Corp',
        contact: 'Ali Khan',
        phone: '+92 300 0000000'
      })
    assert.strictEqual(dupCodeRes.status, 409)
    assert.strictEqual(dupCodeRes.body.ok, false)

    // Duplicate Name
    const dupNameRes = await request(app)
      .post('/api/v1/procurement/suppliers')
      .set(adminHeaders)
      .send({
        code: 'SUP-NEW-99',
        name: TEST_SUP_NAME,
        contact: 'Ali Khan',
        phone: '+92 300 0000000'
      })
    assert.strictEqual(dupNameRes.status, 409)
    assert.strictEqual(dupNameRes.body.ok, false)
  })

  // 5. Supplier Update
  it('5. Supplier Update: Modifies supplier details and checks conflict guardrail', async () => {
    const updateRes = await request(app)
      .put(`/api/v1/procurement/suppliers/${createdSupplierId}`)
      .set(adminHeaders)
      .send({
        contact: 'Kamran Tariq Updated',
        phone: '+92 321 9999999',
        city: 'Islamabad'
      })
    assert.strictEqual(updateRes.status, 200)
    assert.strictEqual(updateRes.body.contact, 'Kamran Tariq Updated')
    assert.strictEqual(updateRes.body.phone, '+92 321 9999999')
    assert.strictEqual(updateRes.body.city, 'Islamabad')
  })

  // 6. Purchase Order Creation & Validation
  it('6. Purchase Order Validation: Rejects missing supplier or invalid item quantities', async () => {
    // Missing supplier
    const res1 = await request(app)
      .post('/api/v1/procurement/purchase-orders')
      .set(adminHeaders)
      .send({
        items: [{ product_id: TEST_PROD_ID, ordered_quantity: 5, unit_cost: 85000 }]
      })
    assert.strictEqual(res1.status, 422)

    // Empty items
    const res2 = await request(app)
      .post('/api/v1/procurement/purchase-orders')
      .set(adminHeaders)
      .send({
        supplier_id: createdSupplierId,
        items: []
      })
    assert.strictEqual(res2.status, 422)

    // Negative quantity
    const res3 = await request(app)
      .post('/api/v1/procurement/purchase-orders')
      .set(adminHeaders)
      .send({
        supplier_id: createdSupplierId,
        items: [{ product_id: TEST_PROD_ID, ordered_quantity: -3, unit_cost: 85000 }]
      })
    assert.strictEqual(res3.status, 422)
  })

  // 7. Purchase Order Server Totals & Draft Creation
  it('7. Purchase Order Creation: Accurately calculates server totals and creates Draft PO', async () => {
    const poPayload = {
      id: 'PO-TEST-8001',
      po_number: 'PO-TEST-8001',
      supplier_id: createdSupplierId,
      branch_id: 'BR-01',
      destination: 'Peshawar',
      order_date: '2026-10-27',
      expected_date: '2026-11-15',
      tax: 5000,
      notes: 'Test procurement order for 10 batteries',
      items: [
        {
          product_id: TEST_PROD_ID,
          product: 'PowerCell 72V 30Ah',
          sku: 'SKU-BAT-7230',
          ordered_quantity: 10,
          unit_cost: 85000.00,
          is_serialized: false
        }
      ]
    }

    const createRes = await request(app)
      .post('/api/v1/procurement/purchase-orders')
      .set(adminHeaders)
      .send(poPayload)

    assert.strictEqual(createRes.status, 201)
    assert.strictEqual(createRes.body.po_number, 'PO-TEST-8001')
    assert.strictEqual(createRes.body.totalOrdered, 10)
    assert.strictEqual(createRes.body.totalReceived, 0)
    assert.strictEqual(createRes.body.remainingUnits, 10)
    assert.strictEqual(createRes.body.subtotal, 850000.00)
    assert.strictEqual(createRes.body.tax, 5000.00)
    assert.strictEqual(createRes.body.totalAmount, 855000.00)
    assert.strictEqual(createRes.body.status, 'Draft')

    createdPoId = createRes.body.id
    createdPoNumber = createRes.body.po_number
  })

  // 8. Purchase Order Lifecycle: Approval and Dispatch
  it('8. PO Lifecycle: Transitions Draft -> Approved -> In Transit', async () => {
    // Cannot receive while in Draft
    const earlyReceiveRes = await request(app)
      .post(`/api/v1/procurement/purchase-orders/${createdPoId}/receive`)
      .set(adminHeaders)
      .send({
        lines: [{ product_id: TEST_PROD_ID, current_received_quantity: 5, damaged_quantity: 0 }]
      })
    assert.strictEqual(earlyReceiveRes.status, 400)
    assert.strictEqual(earlyReceiveRes.body.ok, false)

    // Approve PO
    const approveRes = await request(app)
      .post(`/api/v1/procurement/purchase-orders/${createdPoId}/approve`)
      .set(adminHeaders)
      .send({ user: 'Store Manager Khan' })
    assert.strictEqual(approveRes.status, 200)
    assert.strictEqual(approveRes.body.status, 'Approved')
    assert.strictEqual(approveRes.body.approved_by, 'Store Manager Khan')

    // Mark Sent / In Transit
    const sendRes = await request(app)
      .post(`/api/v1/procurement/purchase-orders/${createdPoId}/send`)
      .set(adminHeaders)
      .send({
        carrier: 'Pak Logistics Dedicated Fleet',
        tracking: 'PL-TRK-9901',
        expected_date: '2026-11-10'
      })
    assert.strictEqual(sendRes.status, 200)
    assert.strictEqual(sendRes.body.status, 'In Transit')
    assert.strictEqual(sendRes.body.carrier, 'Pak Logistics Dedicated Fleet')
    assert.strictEqual(sendRes.body.tracking, 'PL-TRK-9901')
  })

  // 9. GRN Partial Receipt with Row-Locked Inventory Stock Integration
  it('9. GRN Partial Receipt: Only ACCEPTED units increase inventory stock; records audit ledger', async () => {
    // 1. Get initial inventory stock
    const initialStockRows = await query(
      'SELECT on_hand, available, reserved FROM `inventory_stock` WHERE `product_id` = ? AND `branch_id` = "BR-01"',
      [TEST_PROD_ID]
    )
    const initialOnHand = parseInt(initialStockRows[0]?.on_hand || 0, 10)
    const initialAvailable = parseInt(initialStockRows[0]?.available || 0, 10)

    // 2. Receive 6 units total: 5 accepted, 1 damaged
    const receiptPayload = {
      po_id: createdPoId,
      receipt_number: 'GR-TEST-001',
      delivery_note: 'DN-TEST-BAT-001',
      receipt_date: '2026-10-27',
      received_by: 'Ahsan Khan',
      location: 'Peshawar Bay 1',
      notes: 'Partial delivery of 6 batteries: 5 in good order, 1 damaged casing',
      lines: [
        {
          product_id: TEST_PROD_ID,
          product: 'PowerCell 72V 30Ah',
          sku: 'SKU-BAT-7230',
          current_received_quantity: 6,
          damaged_quantity: 1, // accepted = 5
          discrepancy_reason: '1 unit transit casing damage'
        }
      ]
    }

    const receiveRes = await request(app)
      .post(`/api/v1/procurement/purchase-orders/${createdPoId}/receive`)
      .set(adminHeaders)
      .send(receiptPayload)

    assert.strictEqual(receiveRes.status, 201)
    assert.strictEqual(receiveRes.body.receipt_number, 'GR-TEST-001')
    assert.strictEqual(receiveRes.body.total_received_units, 6)
    assert.strictEqual(receiveRes.body.total_accepted_units, 5)
    assert.strictEqual(receiveRes.body.total_damaged_units, 1)
    assert.strictEqual(receiveRes.body.status, 'Posted')
    createdReceiptId = receiveRes.body.id

    // 3. Verify PO status updated to Partially Received
    const updatedPo = await request(app)
      .get(`/api/v1/procurement/purchase-orders/${createdPoId}`)
      .set(adminHeaders)
    assert.strictEqual(updatedPo.status, 200)
    assert.strictEqual(updatedPo.body.status, 'Partially Received')
    assert.strictEqual(updatedPo.body.totalReceived, 6)
    assert.strictEqual(updatedPo.body.remainingUnits, 4)
    assert.strictEqual(updatedPo.body.match, '6/10')

    // 4. Verify INVENTORY STOCK: Must increase by EXACTLY 5 (only accepted units!)
    const afterStockRows = await query(
      'SELECT on_hand, available, reserved FROM `inventory_stock` WHERE `product_id` = ? AND `branch_id` = "BR-01"',
      [TEST_PROD_ID]
    )
    const afterOnHand = parseInt(afterStockRows[0]?.on_hand || 0, 10)
    const afterAvailable = parseInt(afterStockRows[0]?.available || 0, 10)

    assert.strictEqual(
      afterOnHand,
      initialOnHand + 5,
      `Inventory on_hand must increase by accepted quantity (+5), not received (+6). Before: ${initialOnHand}, After: ${afterOnHand}`
    )
    assert.strictEqual(
      afterAvailable,
      initialAvailable + 5,
      `Inventory available must increase by accepted quantity (+5). Before: ${initialAvailable}, After: ${afterAvailable}`
    )

    // 5. Verify immutable stock_movements ledger entry
    const movementRows = await query(
      'SELECT * FROM `stock_movements` WHERE `reference_id` = "GR-TEST-001" AND `product_id` = ?',
      [TEST_PROD_ID]
    )
    assert.strictEqual(movementRows.length, 1, 'Exactly one stock movement ledger entry must be written')
    assert.strictEqual(movementRows[0].reference_type, 'RECEIPT')
    assert.strictEqual(movementRows[0].quantity, 5, 'Ledger entry quantity must be accepted units (5)')
    assert.strictEqual(movementRows[0].on_hand_before, initialOnHand)
    assert.strictEqual(movementRows[0].on_hand_after, initialOnHand + 5)

    // 6. Verify Vendor Bill was created and linked for 3-way matching
    const billRows = await query('SELECT * FROM `vendor_bills` WHERE `receipt_id` = "GR-TEST-001"')
    assert.strictEqual(billRows.length, 1, 'Vendor bill must be created for GRN')
    assert.strictEqual(parseFloat(billRows[0].amount), 5 * 85000.00, 'Bill amount must reflect accepted units * unit cost')
    assert.strictEqual(billRows[0].status, 'Open')
  })

  // 10. Over-Receiving Guardrail
  it('10. Over-Receiving Guardrail: Rejects receiving more than remaining units without discrepancy reason', async () => {
    // PO ordered 10, already received 6. Remaining is 4.
    // Attempting to receive 10 more (total 16 > 10) without discrepancy reason must fail
    const overReceiveRes = await request(app)
      .post(`/api/v1/procurement/purchase-orders/${createdPoId}/receive`)
      .set(adminHeaders)
      .send({
        receipt_number: 'GR-TEST-OVER',
        lines: [
          {
            product_id: TEST_PROD_ID,
            current_received_quantity: 10,
            damaged_quantity: 0
          }
        ]
      })

    assert.strictEqual(overReceiveRes.status, 400)
    assert.strictEqual(overReceiveRes.body.ok, false)
    assert.match(overReceiveRes.body.message, /Over-receiving/i)
  })

  // 11. Negative Quantities Guardrail
  it('11. Negative Quantities Guardrail: Rejects negative received or damaged quantities', async () => {
    const negRes1 = await request(app)
      .post(`/api/v1/procurement/purchase-orders/${createdPoId}/receive`)
      .set(adminHeaders)
      .send({
        receipt_number: 'GR-TEST-NEG1',
        lines: [
          {
            product_id: TEST_PROD_ID,
            current_received_quantity: -2,
            damaged_quantity: 0
          }
        ]
      })
    assert.strictEqual(negRes1.status, 400)

    const negRes2 = await request(app)
      .post(`/api/v1/procurement/purchase-orders/${createdPoId}/receive`)
      .set(adminHeaders)
      .send({
        receipt_number: 'GR-TEST-NEG2',
        lines: [
          {
            product_id: TEST_PROD_ID,
            current_received_quantity: 4,
            damaged_quantity: -1
          }
        ]
      })
    assert.strictEqual(negRes2.status, 400)
  })

  // 12. Duplicate Receipt & Delivery Note Prevention
  it('12. Duplicate Receipt Prevention: Rejects duplicate receipt number or duplicate delivery note', async () => {
    // Duplicate receipt_number
    const dupRecRes = await request(app)
      .post(`/api/v1/procurement/purchase-orders/${createdPoId}/receive`)
      .set(adminHeaders)
      .send({
        receipt_number: 'GR-TEST-001', // Already used
        lines: [
          {
            product_id: TEST_PROD_ID,
            current_received_quantity: 4,
            damaged_quantity: 0
          }
        ]
      })
    assert.strictEqual(dupRecRes.status, 409)

    // Duplicate delivery_note on same PO
    const dupDnRes = await request(app)
      .post(`/api/v1/procurement/purchase-orders/${createdPoId}/receive`)
      .set(adminHeaders)
      .send({
        receipt_number: 'GR-TEST-002',
        delivery_note: 'DN-TEST-BAT-001', // Already used in GR-TEST-001
        lines: [
          {
            product_id: TEST_PROD_ID,
            current_received_quantity: 4,
            damaged_quantity: 0
          }
        ]
      })
    assert.strictEqual(dupDnRes.status, 409)
  })

  // 13. GRN Final Receipt & PO Completion
  it('13. GRN Final Receipt: Completes PO to Fully Received state and updates stock', async () => {
    const stockBeforeFinal = await query(
      'SELECT on_hand FROM `inventory_stock` WHERE `product_id` = ? AND `branch_id` = "BR-01"',
      [TEST_PROD_ID]
    )
    const onHandBefore = parseInt(stockBeforeFinal[0]?.on_hand || 0, 10)

    // Receive remaining 4 units (all accepted)
    const finalReceiptPayload = {
      po_id: createdPoId,
      receipt_number: 'GR-TEST-002',
      delivery_note: 'DN-TEST-BAT-FINAL',
      receipt_date: '2026-10-27',
      received_by: 'Ahsan Khan',
      location: 'Peshawar Bay 1',
      notes: 'Final delivery of remaining 4 units. Order complete.',
      lines: [
        {
          product_id: TEST_PROD_ID,
          product: 'PowerCell 72V 30Ah',
          sku: 'SKU-BAT-7230',
          current_received_quantity: 4,
          damaged_quantity: 0
        }
      ]
    }

    const finalRes = await request(app)
      .post(`/api/v1/procurement/purchase-orders/${createdPoId}/receive`)
      .set(adminHeaders)
      .send(finalReceiptPayload)

    assert.strictEqual(finalRes.status, 201)
    assert.strictEqual(finalRes.body.total_received_units, 4)
    assert.strictEqual(finalRes.body.total_accepted_units, 4)

    // Verify PO is now Fully Received
    const completedPo = await request(app)
      .get(`/api/v1/procurement/purchase-orders/${createdPoId}`)
      .set(adminHeaders)
    assert.strictEqual(completedPo.body.status, 'Fully Received')
    assert.strictEqual(completedPo.body.totalReceived, 10)
    assert.strictEqual(completedPo.body.remainingUnits, 0)
    assert.strictEqual(completedPo.body.match, 'Matched')

    // Verify stock increased by 4
    const stockAfterFinal = await query(
      'SELECT on_hand FROM `inventory_stock` WHERE `product_id` = ? AND `branch_id` = "BR-01"',
      [TEST_PROD_ID]
    )
    const onHandAfter = parseInt(stockAfterFinal[0]?.on_hand || 0, 10)
    assert.strictEqual(onHandAfter, onHandBefore + 4)

    // Verify receiving against a Fully Received PO is rejected
    const extraRecRes = await request(app)
      .post(`/api/v1/procurement/purchase-orders/${createdPoId}/receive`)
      .set(adminHeaders)
      .send({
        receipt_number: 'GR-TEST-EXTRA',
        lines: [{ product_id: TEST_PROD_ID, current_received_quantity: 1, damaged_quantity: 0 }]
      })
    assert.strictEqual(extraRecRes.status, 400)
    assert.match(extraRecRes.body.message, /already fully received/i)
  })

  // 14. PO Cancellation & Safety Guardrails
  it('14. PO Cancellation Guardrails: Cannot cancel PO with received items; can cancel unreceived PO', async () => {
    // 1. Attempting to cancel PO-TEST-8001 (which has received 10 items) must be REJECTED
    const cancelReceivedRes = await request(app)
      .post(`/api/v1/procurement/purchase-orders/${createdPoId}/cancel`)
      .set(adminHeaders)
      .send({ reason: 'Mistake order' })
    assert.strictEqual(cancelReceivedRes.status, 400)
    assert.strictEqual(cancelReceivedRes.body.ok, false)

    // 2. Create another unreceived PO
    const cancelPoRes = await request(app)
      .post('/api/v1/procurement/purchase-orders')
      .set(adminHeaders)
      .send({
        id: 'PO-TEST-CANCEL-01',
        po_number: 'PO-TEST-CANCEL-01',
        supplier_id: createdSupplierId,
        branch_id: 'BR-01',
        destination: 'Peshawar',
        items: [{ product_id: TEST_PROD_ID, ordered_quantity: 5, unit_cost: 85000.00 }]
      })
    assert.strictEqual(cancelPoRes.status, 201)
    cancelTestPoId = cancelPoRes.body.id

    // 3. Cancel unreceived PO
    const cancelSuccessRes = await request(app)
      .post(`/api/v1/procurement/purchase-orders/${cancelTestPoId}/cancel`)
      .set(adminHeaders)
      .send({ reason: 'Supplier out of raw materials' })
    assert.strictEqual(cancelSuccessRes.status, 200)
    assert.strictEqual(cancelSuccessRes.body.status, 'Cancelled')
    assert.strictEqual(cancelSuccessRes.body.cancellation_reason, 'Supplier out of raw materials')

    // 4. Attempting to receive items against cancelled PO must be REJECTED
    const receiveCancelledRes = await request(app)
      .post(`/api/v1/procurement/purchase-orders/${cancelTestPoId}/receive`)
      .set(adminHeaders)
      .send({
        receipt_number: 'GR-TEST-CANCELLED',
        lines: [{ product_id: TEST_PROD_ID, current_received_quantity: 2, damaged_quantity: 0 }]
      })
    assert.strictEqual(receiveCancelledRes.status, 400)
    assert.match(receiveCancelledRes.body.message, /cancelled/i)
  })

  // 15. Vendor Bill Settlement
  it('15. Vendor Bill Settlement: Records payment against bill and updates status to Paid', async () => {
    const bills = await request(app)
      .get(`/api/v1/procurement/vendor-bills?po_id=${createdPoId}`)
      .set(adminHeaders)
    assert.strictEqual(bills.status, 200)
    assert.ok(bills.body.length >= 1)

    const bill = bills.body[0]
    assert.strictEqual(bill.status, 'Open')

    // Record full payment
    const payRes = await request(app)
      .post(`/api/v1/procurement/vendor-bills/${bill.id}/pay`)
      .set(adminHeaders)
      .send({
        amount: bill.outstanding_amount,
        payment_method: 'Bank Transfer Meezan Bank'
      })

    assert.strictEqual(payRes.status, 200)
    assert.strictEqual(payRes.body.status, 'Paid')
    assert.strictEqual(payRes.body.outstanding_amount, 0)
    assert.strictEqual(payRes.body.paid_amount, bill.amount)
  })

  // 16. Authentication Guardrail: Rejects unauthenticated requests with HTTP 401
  it('16. Authentication Guardrail: Rejects unauthenticated requests with HTTP 401', async () => {
    const res1 = await request(app).get('/api/v1/procurement/suppliers')
    assert.strictEqual(res1.status, 401)
    assert.strictEqual(res1.body.ok, false)
    assert.strictEqual(res1.body.error, 'UNAUTHORIZED')

    const res2 = await request(app).post('/api/v1/procurement/purchase-orders').send({})
    assert.strictEqual(res2.status, 401)
    assert.strictEqual(res2.body.ok, false)

    const res3 = await request(app).get('/api/v1/procurement/receipts')
    assert.strictEqual(res3.status, 401)

    const res4 = await request(app).get('/api/v1/procurement/vendor-bills')
    assert.strictEqual(res4.status, 401)
  })

  // 17. Granular RBAC Guardrail: Rejects authenticated users without procurement permissions with HTTP 403
  it('17. Granular RBAC Guardrail: Rejects authenticated users without procurement permissions with HTTP 403', async () => {
    const techHeaders = getTechnicianAuthHeader('BR-01')

    const res1 = await request(app).get('/api/v1/procurement/suppliers').set(techHeaders)
    assert.strictEqual(res1.status, 403)
    assert.strictEqual(res1.body.ok, false)
    assert.strictEqual(res1.body.error, 'FORBIDDEN')

    const res2 = await request(app).post('/api/v1/procurement/suppliers').set(techHeaders).send({ name: 'Tech Vendor' })
    assert.strictEqual(res2.status, 403)
    assert.strictEqual(res2.body.error, 'FORBIDDEN')

    const res3 = await request(app).get('/api/v1/procurement/purchase-orders').set(techHeaders)
    assert.strictEqual(res3.status, 403)

    const res4 = await request(app).post('/api/v1/procurement/purchase-orders').set(techHeaders).send({})
    assert.strictEqual(res4.status, 403)

    const res5 = await request(app).get('/api/v1/procurement/receipts').set(techHeaders)
    assert.strictEqual(res5.status, 403)

    const res6 = await request(app).get('/api/v1/procurement/vendor-bills').set(techHeaders)
    assert.strictEqual(res6.status, 403)
  })

  // 18. Read-Only Permission Enforcement: Read-only user can view but cannot mutate
  it('18. Read-Only Permission Enforcement: Read-only user can view but cannot mutate', async () => {
    const auditorHeaders = getReadOnlyProcurementAuthHeader('BR-01')

    // Permitted: Read suppliers and POs
    const readSupRes = await request(app).get('/api/v1/procurement/suppliers').set(auditorHeaders)
    assert.strictEqual(readSupRes.status, 200)

    const readPoRes = await request(app).get('/api/v1/procurement/purchase-orders').set(auditorHeaders)
    assert.strictEqual(readPoRes.status, 200)

    // Forbidden: Mutations without procurement.write
    const createSupRes = await request(app).post('/api/v1/procurement/suppliers').set(auditorHeaders).send({ name: 'Auditor Vendor' })
    assert.strictEqual(createSupRes.status, 403)
    assert.strictEqual(createSupRes.body.error, 'FORBIDDEN')

    const createPoRes = await request(app).post('/api/v1/procurement/purchase-orders').set(auditorHeaders).send({ supplier_id: createdSupplierId })
    assert.strictEqual(createPoRes.status, 403)
    assert.strictEqual(createPoRes.body.error, 'FORBIDDEN')

    const createRecRes = await request(app).post('/api/v1/procurement/receipts').set(auditorHeaders).send({ po_id: createdPoId })
    assert.strictEqual(createRecRes.status, 403)
  })

  // 19. Branch Isolation: Non-SuperAdmin cannot create a purchase order for another branch
  it('19. Branch Isolation: Non-SuperAdmin cannot create a purchase order for another branch', async () => {
    const bmPeshawarHeaders = getBranchManagerAuthHeader('BR-01', 'Peshawar')

    // Peshawar manager attempts to create a PO for Lahore (BR-03)
    const spoofRes = await request(app)
      .post('/api/v1/procurement/purchase-orders')
      .set(bmPeshawarHeaders)
      .send({
        supplier_id: createdSupplierId,
        branch_id: 'BR-03',
        destination: 'Lahore',
        items: [{ product_id: TEST_PROD_ID, ordered_quantity: 2, unit_cost: 150000 }]
      })

    assert.strictEqual(spoofRes.status, 403)
    assert.strictEqual(spoofRes.body.ok, false)
    assert.strictEqual(spoofRes.body.error, 'FORBIDDEN')
    assert.match(spoofRes.body.message, /restricted to your assigned branch/i)

    // Permitted: Peshawar manager creates PO for Peshawar (BR-01)
    const validBranchRes = await request(app)
      .post('/api/v1/procurement/purchase-orders')
      .set(bmPeshawarHeaders)
      .send({
        po_number: 'PO-TEST-PEW-01',
        supplier_id: createdSupplierId,
        branch_id: 'BR-01',
        destination: 'Peshawar',
        items: [{ product_id: TEST_PROD_ID, ordered_quantity: 2, unit_cost: 150000 }]
      })

    assert.strictEqual(validBranchRes.status, 201)
    assert.strictEqual(validBranchRes.body.branch_id, 'BR-01')
  })

  // 20. Branch Isolation: Non-SuperAdmin cannot access or mutate another branch's PO or receipts
  it('20. Branch Isolation: Rejects cross-branch PO inspection, approval, and receipt posting', async () => {
    const bmIslamabadHeaders = getBranchManagerAuthHeader('BR-02', 'Islamabad')
    const bmPeshawarHeaders = getBranchManagerAuthHeader('BR-01', 'Peshawar')

    // 1. Cross-branch GET PO
    const crossGetRes = await request(app)
      .get(`/api/v1/procurement/purchase-orders/PO-TEST-PEW-01`)
      .set(bmIslamabadHeaders)
    assert.strictEqual(crossGetRes.status, 403)
    assert.strictEqual(crossGetRes.body.error, 'FORBIDDEN')

    // 2. Cross-branch POST approve
    const crossApproveRes = await request(app)
      .post(`/api/v1/procurement/purchase-orders/PO-TEST-PEW-01/approve`)
      .set(bmIslamabadHeaders)
    assert.strictEqual(crossApproveRes.status, 403)
    assert.strictEqual(crossApproveRes.body.error, 'FORBIDDEN')

    // 3. Permitted: Peshawar manager can access and approve their own branch PO
    const ownGetRes = await request(app)
      .get(`/api/v1/procurement/purchase-orders/PO-TEST-PEW-01`)
      .set(bmPeshawarHeaders)
    assert.strictEqual(ownGetRes.status, 200)
    assert.strictEqual(ownGetRes.body.branch_id, 'BR-01')

    const ownApproveRes = await request(app)
      .post(`/api/v1/procurement/purchase-orders/PO-TEST-PEW-01/approve`)
      .set(bmPeshawarHeaders)
    assert.strictEqual(ownApproveRes.status, 200)
    assert.strictEqual(ownApproveRes.body.status, 'Approved')

    // 4. Cross-branch receipt intake on Peshawar PO rejected for Islamabad manager
    const crossReceiptRes = await request(app)
      .post('/api/v1/procurement/receipts')
      .set(bmIslamabadHeaders)
      .send({
        po_id: 'PO-TEST-PEW-01',
        delivery_note: 'DN-SPOOF-01',
        lines: [{ product_id: TEST_PROD_ID, current_received_quantity: 2, accepted_quantity: 2 }]
      })
    assert.strictEqual(crossReceiptRes.status, 403)
    assert.strictEqual(crossReceiptRes.body.error, 'FORBIDDEN')
  })
})

