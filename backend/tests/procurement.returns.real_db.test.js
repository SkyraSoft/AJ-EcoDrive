import { test } from 'node:test'
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

test('AJ EcoDrive Backend — Purchase Returns & Vendor Debit Notes Real DB Suite', async (t) => {
  let isDbReady = false
  const adminHeaders = getAdminAuthHeader()
  const peshawarBmHeaders = getBranchManagerAuthHeader('BR-01', 'Peshawar')
  const lahoreBmHeaders = getBranchManagerAuthHeader('BR-03', 'Lahore')
  const techHeaders = getTechnicianAuthHeader('BR-01', 'Peshawar')
  const readOnlyHeaders = getReadOnlyProcurementAuthHeader()

  const FIXTURE_PREFIX = 'RET-E2E'
  const TEST_SUP_CODE = `SUP-${FIXTURE_PREFIX}-99`
  const TEST_SUP_NAME = 'Precision Eco Components Real Ltd'
  const TEST_PROD_ID = 'PROD-007' // PowerCell 72V 30Ah
  const TEST_BRANCH_ID = 'BR-01' // Peshawar
  const TEST_RECEIPT_NUMBER = `GR-${FIXTURE_PREFIX}-001`
  const TEST_DELIVERY_NOTE = `DN-${FIXTURE_PREFIX}-001`
  const TEST_SERIAL_ACCEPTED = `SN-${FIXTURE_PREFIX}-ACC-01`
  const TEST_SERIAL_QC = `SN-${FIXTURE_PREFIX}-QC-02`

  let supplierId = null
  let createdPoId = null
  let createdPoNumber = null
  let receiptId = null
  let billId = null
  let initialStockOnHand = 0
  let initialStockAvailable = 0

  let draftReturnId = null
  let draftReturnNumber = null

  // -------------------------------------------------------------------------
  // 0. Setup and Fixture Seeding via Standard System Lifecycle
  // -------------------------------------------------------------------------
  await t.test('0. Database initialization & baseline capture', async () => {
    isDbReady = await connectDB()
    assert.strictEqual(isDbReady, true, 'Database must be successfully connected')
    await runMigrations()

    // Non-destructive cleanup of any prior run's RET-E2E fixtures by prefix
    await query('DELETE FROM `vendor_debit_notes` WHERE `return_number` LIKE ? OR `notes` LIKE ?', [`%${FIXTURE_PREFIX}%`, `%${FIXTURE_PREFIX}%`])
    await query('DELETE FROM `purchase_returns` WHERE `return_number` LIKE ? OR `reason` LIKE ?', [`%${FIXTURE_PREFIX}%`, `%${FIXTURE_PREFIX}%`])
    await query('DELETE FROM `vendor_bills` WHERE `supplier_id` LIKE ? OR `receipt_id` LIKE ? OR `po_number` LIKE ? OR `po_id` LIKE ?', [`%${FIXTURE_PREFIX}%`, `%${FIXTURE_PREFIX}%`, `%${FIXTURE_PREFIX}%`, `%${FIXTURE_PREFIX}%`])
    await query('DELETE FROM `goods_receipts` WHERE `receipt_number` LIKE ? OR `id` LIKE ?', [`%${FIXTURE_PREFIX}%`, `%${FIXTURE_PREFIX}%`])
    await query('DELETE FROM `purchase_orders` WHERE `notes` LIKE ? OR `po_number` LIKE ? OR `id` LIKE ?', [`%${FIXTURE_PREFIX}%`, `%${FIXTURE_PREFIX}%`, `%${FIXTURE_PREFIX}%`])
    const priorSups = await query('SELECT id FROM `suppliers` WHERE `code` = ?', [TEST_SUP_CODE])
    for (const sup of (priorSups || [])) {
      await query('DELETE FROM `suppliers` WHERE `id` = ?', [sup.id])
    }
    await query('DELETE FROM `stock_movements` WHERE `notes` LIKE ? OR `reason` LIKE ? OR `reference_id` LIKE ?', [`%${FIXTURE_PREFIX}%`, `%${FIXTURE_PREFIX}%`, `%${FIXTURE_PREFIX}%`])
    await query('DELETE FROM `serialized_units` WHERE `serial_number` LIKE ?', [`%${FIXTURE_PREFIX}%`])

    // Capture stock baseline before anything
    const [stockRow] = await query(
      'SELECT on_hand, available FROM `inventory_stock` WHERE `product_id` = ? AND `branch_id` = ?',
      [TEST_PROD_ID, TEST_BRANCH_ID]
    )
    initialStockOnHand = stockRow ? parseInt(stockRow.on_hand || 0, 10) : 0
    initialStockAvailable = stockRow ? parseInt(stockRow.available || 0, 10) : 0

    // 1. Create Supplier via API
    const supRes = await request(app)
      .post('/api/v1/procurement/suppliers')
      .set(adminHeaders)
      .send({
        code: TEST_SUP_CODE,
        name: TEST_SUP_NAME,
        contact: 'Zainab Qazi',
        phone: '+92 345 1112233',
        email: 'supplier@rete2e.test',
        city: 'Peshawar',
        terms: 'Net 30',
        currency: 'PKR'
      })
    assert.strictEqual(supRes.status, 201)
    supplierId = supRes.body.id

    // 2. Create Purchase Order via API (5 units @ 100,000 PKR)
    const poRes = await request(app)
      .post('/api/v1/procurement/purchase-orders')
      .set(adminHeaders)
      .send({
        id: `PO-${FIXTURE_PREFIX}-001`,
        supplier_id: supplierId,
        branch_id: TEST_BRANCH_ID,
        branch: 'Peshawar',
        destination: 'Peshawar',
        notes: `RET-E2E Consignment for returns verification`,
        items: [
          {
            product_id: TEST_PROD_ID,
            product: 'PowerCell 72V 30Ah',
            sku: `SKU-${FIXTURE_PREFIX}-BAT`,
            ordered_quantity: 5,
            unit_cost: 100000.00,
            is_serialized: 1
          }
        ]
      })
    assert.strictEqual(poRes.status, 201)
    createdPoId = poRes.body.id
    createdPoNumber = poRes.body.po_number

    // 3. Approve PO
    const approvePoRes = await request(app)
      .post(`/api/v1/procurement/purchase-orders/${createdPoId}/approve`)
      .set(adminHeaders)
    assert.strictEqual(approvePoRes.status, 200)

    // 4. Inward Goods Receipt: Receive 3 units (2 Accepted, 1 Damaged/QC Hold)
    const recRes = await request(app)
      .post(`/api/v1/procurement/purchase-orders/${createdPoId}/receive`)
      .set(adminHeaders)
      .send({
        receipt_number: TEST_RECEIPT_NUMBER,
        delivery_note: TEST_DELIVERY_NOTE,
        received_by: 'E2E Bay Inspector',
        lines: [
          {
            product_id: TEST_PROD_ID,
            current_received_quantity: 3,
            damaged_quantity: 1, // 2 accepted, 1 damaged
            discrepancy_reason: '1 unit dented battery casing during carrier transit'
          }
        ],
        serializedUnits: [
          {
            serial: TEST_SERIAL_ACCEPTED,
            condition: 'Good',
            qc: 'Pass'
          },
          {
            serial: TEST_SERIAL_QC,
            condition: 'Damaged',
            qc: 'QC Hold'
          }
        ]
      })
    assert.strictEqual(recRes.status, 201)
    receiptId = recRes.body.receipt_number

    // Find the generated vendor bill
    const [billRow] = await query('SELECT * FROM `vendor_bills` WHERE `po_id` = ? OR `receipt_id` = ?', [createdPoId, receiptId])
    assert.ok(billRow, 'Vendor bill must be automatically created upon receiving')
    billId = billRow.id
  })

  // -------------------------------------------------------------------------
  // 1. RBAC & Security Endpoints
  // -------------------------------------------------------------------------
  await t.test('1. RBAC: rejects unauthenticated requests (401)', async () => {
    const res = await request(app).get('/api/v1/procurement/returns')
    assert.strictEqual(res.status, 401)
  })

  await t.test('2. RBAC: rejects users lacking procurement.write permission (403)', async () => {
    const res = await request(app)
      .post('/api/v1/procurement/returns')
      .set(techHeaders) // Technician has aftersales but not procurement.write
      .send({
        supplier_id: supplierId,
        items: [{ product_id: TEST_PROD_ID, quantity: 1, unit_cost: 100000 }]
      })
    assert.strictEqual(res.status, 403)
  })

  await t.test('3. RBAC: read-only user can list returns but cannot create one (403)', async () => {
    const resGet = await request(app)
      .get('/api/v1/procurement/returns')
      .set(readOnlyHeaders)
    assert.strictEqual(resGet.status, 200)

    const resPost = await request(app)
      .post('/api/v1/procurement/returns')
      .set(readOnlyHeaders)
      .send({
        supplier_id: supplierId,
        items: [{ product_id: TEST_PROD_ID, quantity: 1, unit_cost: 100000 }]
      })
    assert.strictEqual(resPost.status, 403)
  })

  // -------------------------------------------------------------------------
  // 2. Input Validation & Over-Return Guardrails
  // -------------------------------------------------------------------------
  await t.test('4. rejects return with empty items array (400)', async () => {
    const res = await request(app)
      .post('/api/v1/procurement/returns')
      .set(peshawarBmHeaders)
      .send({
        supplier_id: supplierId,
        items: []
      })
    assert.ok([400, 422].includes(res.status))
    assert.match(res.body.message, /item/i)
  })

  await t.test('5. rejects negative return quantity (400)', async () => {
    const res = await request(app)
      .post('/api/v1/procurement/returns')
      .set(peshawarBmHeaders)
      .send({
        supplier_id: supplierId,
        reason: 'Testing negative return quantity rejection',
        items: [{ product_id: TEST_PROD_ID, quantity: -2, unit_cost: 100000 }]
      })
    assert.strictEqual(res.status, 400)
    assert.match(res.body.message, /greater than 0/i)
  })

  await t.test('6. rejects over-returning exceeding receipt accepted/received quantity (400)', async () => {
    // Total received on this receipt was 3 units; requesting 10 must be blocked
    const res = await request(app)
      .post('/api/v1/procurement/returns')
      .set(peshawarBmHeaders)
      .send({
        supplier_id: supplierId,
        receipt_id: receiptId,
        po_id: createdPoId,
        reason: 'Attempted excess return',
        items: [{ product_id: TEST_PROD_ID, quantity: 10, unit_cost: 100000 }]
      })
    assert.strictEqual(res.status, 400)
    assert.match(res.body.message, /exceeds.*returnable/i)
  })

  // -------------------------------------------------------------------------
  // 3. Draft Return Creation & Zero Side-Effects Invariant
  // -------------------------------------------------------------------------
  await t.test('7. creates Draft return with ZERO side effects on stock, bills, or debit notes', async () => {
    // Read stock before draft creation
    const [stockBefore] = await query(
      'SELECT on_hand, available FROM `inventory_stock` WHERE `product_id` = ? AND `branch_id` = ?',
      [TEST_PROD_ID, TEST_BRANCH_ID]
    )

    // Read bill before draft creation
    const [billBefore] = await query(
      'SELECT outstanding_amount, status FROM `vendor_bills` WHERE `id` = ?',
      [billId]
    )

    const res = await request(app)
      .post('/api/v1/procurement/returns')
      .set(peshawarBmHeaders)
      .send({
        return_number: `PRTN-${FIXTURE_PREFIX}-001`,
        supplier_id: supplierId,
        po_id: createdPoId,
        po_number: createdPoNumber,
        receipt_id: receiptId,
        reason: 'Cell defect observed during staging (RET-E2E)',
        items: [
          {
            product_id: TEST_PROD_ID,
            product_name: 'PowerCell 72V 30Ah',
            sku: `SKU-${FIXTURE_PREFIX}-BAT`,
            serial_number: TEST_SERIAL_ACCEPTED,
            quantity: 1,
            unit_cost: 100000.00,
            reason: 'Performance defect'
          }
        ]
      })

    assert.strictEqual(res.status, 201)
    assert.ok(res.body.id)
    assert.strictEqual(res.body.status, 'Draft')
    assert.strictEqual(parseFloat(res.body.total_credit_amount), 100000.00)

    draftReturnId = res.body.id
    draftReturnNumber = res.body.return_number

    // INVARIANT CHECK 1: Inventory stock MUST NOT change on Draft
    const [stockAfter] = await query(
      'SELECT on_hand, available FROM `inventory_stock` WHERE `product_id` = ? AND `branch_id` = ?',
      [TEST_PROD_ID, TEST_BRANCH_ID]
    )
    assert.strictEqual(parseInt(stockAfter.on_hand), parseInt(stockBefore.on_hand), 'on_hand must not change on Draft')
    assert.strictEqual(parseInt(stockAfter.available), parseInt(stockBefore.available), 'available must not change on Draft')

    // INVARIANT CHECK 2: Stock movements MUST NOT have a RETURN movement for this return
    const movements = await query('SELECT * FROM `stock_movements` WHERE `reference_id` = ?', [draftReturnNumber])
    assert.strictEqual(movements.length, 0, 'No stock movements allowed on Draft')

    // INVARIANT CHECK 3: No vendor debit notes created on Draft
    const debitNotes = await query('SELECT * FROM `vendor_debit_notes` WHERE `return_id` = ?', [draftReturnId])
    assert.strictEqual(debitNotes.length, 0, 'No debit notes allowed on Draft')

    // INVARIANT CHECK 4: Vendor bill outstanding amount unchanged
    const [billAfter] = await query('SELECT outstanding_amount, status FROM `vendor_bills` WHERE `id` = ?', [billId])
    assert.strictEqual(parseFloat(billAfter.outstanding_amount), parseFloat(billBefore.outstanding_amount), 'Bill outstanding must not change on Draft')
    assert.strictEqual(billAfter.status, billBefore.status, 'Bill status must not change on Draft')
  })

  // -------------------------------------------------------------------------
  // 4. Branch Isolation on Returns
  // -------------------------------------------------------------------------
  await t.test('8. Branch Isolation: Lahore BM cannot view or approve Peshawar return (403)', async () => {
    // Lahore BM attempts to GET Peshawar return
    const resGet = await request(app)
      .get(`/api/v1/procurement/returns/${draftReturnId}`)
      .set(lahoreBmHeaders)
    assert.strictEqual(resGet.status, 403)

    // Lahore BM attempts to Approve Peshawar return
    const resApprove = await request(app)
      .post(`/api/v1/procurement/returns/${draftReturnId}/approve`)
      .set(lahoreBmHeaders)
    assert.strictEqual(resApprove.status, 403)
  })

  // -------------------------------------------------------------------------
  // 5. Approval Workflow (Atomic Execution, Stock, Ledger, Debit Note, Bill)
  // -------------------------------------------------------------------------
  await t.test('9. approves Draft return atomically and reconciles stock, ledger, debit note, and bill', async () => {
    const [stockBefore] = await query(
      'SELECT on_hand, available FROM `inventory_stock` WHERE `product_id` = ? AND `branch_id` = ?',
      [TEST_PROD_ID, TEST_BRANCH_ID]
    )

    const [billBefore] = await query('SELECT outstanding_amount FROM `vendor_bills` WHERE `id` = ?', [billId])
    const billBeforeAmt = parseFloat(billBefore.outstanding_amount)

    const res = await request(app)
      .post(`/api/v1/procurement/returns/${draftReturnId}/approve`)
      .set(peshawarBmHeaders)

    assert.strictEqual(res.status, 200)
    assert.strictEqual(res.body.status, 'Approved')
    assert.ok(res.body.approved_by)

    // 1. Stock Decrement Verification
    const [stockAfter] = await query(
      'SELECT on_hand, available FROM `inventory_stock` WHERE `product_id` = ? AND `branch_id` = ?',
      [TEST_PROD_ID, TEST_BRANCH_ID]
    )
    assert.strictEqual(parseInt(stockAfter.on_hand), parseInt(stockBefore.on_hand) - 1, 'on_hand must decrement by 1')
    assert.strictEqual(parseInt(stockAfter.available), parseInt(stockBefore.available) - 1, 'available must decrement by 1')

    // 2. Stock Movement Verification
    const [mov] = await query(
      'SELECT * FROM `stock_movements` WHERE `reference_id` = ? AND `reference_type` = "RETURN"',
      [draftReturnNumber]
    )
    assert.ok(mov, 'Stock movement record must exist')
    assert.strictEqual(parseInt(mov.quantity), -1)
    assert.strictEqual(parseInt(mov.on_hand_before), parseInt(stockBefore.on_hand))
    assert.strictEqual(parseInt(mov.on_hand_after), parseInt(stockAfter.on_hand))

    // 3. Serialized Unit Status Verification
    const [unit] = await query('SELECT * FROM `serialized_units` WHERE `serial_number` = ?', [TEST_SERIAL_ACCEPTED])
    assert.ok(unit)
    assert.strictEqual(unit.status, 'Returned to Vendor')

    // 4. Vendor Debit Note Verification
    const [debitNote] = await query('SELECT * FROM `vendor_debit_notes` WHERE `return_id` = ?', [draftReturnId])
    assert.ok(debitNote, 'Vendor debit note must be generated')
    assert.strictEqual(parseFloat(debitNote.amount), 100000.00)
    assert.strictEqual(parseFloat(debitNote.applied_amount), 100000.00)
    assert.strictEqual(parseFloat(debitNote.remaining_credit), 0.00)
    assert.strictEqual(debitNote.status, 'Applied')

    // 5. Vendor Bill Reconciliation Verification
    const [billAfter] = await query('SELECT * FROM `vendor_bills` WHERE `id` = ?', [billId])
    assert.ok(billAfter)
    assert.strictEqual(parseFloat(billAfter.outstanding_amount), billBeforeAmt - 100000.00)
    // Bill still has balance, status must be Partially Credited
    assert.strictEqual(billAfter.status, 'Partially Credited', 'Must be Partially Credited, NEVER marked Paid')
  })

  // -------------------------------------------------------------------------
  // 6. Duplicate Approval Guard
  // -------------------------------------------------------------------------
  await t.test('10. prevents duplicate approval on already approved return (400)', async () => {
    const res = await request(app)
      .post(`/api/v1/procurement/returns/${draftReturnId}/approve`)
      .set(peshawarBmHeaders)

    assert.strictEqual(res.status, 400)
    assert.match(res.body.message, /already in "Approved" state/i)
  })

  // -------------------------------------------------------------------------
  // 7. Cumulative Over-Return Check Across Multiple Returns
  // -------------------------------------------------------------------------
  await t.test('11. prevents over-returning across cumulative approved returns for same receipt (400)', async () => {
    // Receipt had 3 units total. 1 was already returned in draftReturnId (now approved).
    // Remaining returnable: 2 units. Attempting to return 3 units must be rejected!
    const res = await request(app)
      .post('/api/v1/procurement/returns')
      .set(peshawarBmHeaders)
      .send({
        supplier_id: supplierId,
        receipt_id: receiptId,
        po_id: createdPoId,
        reason: 'Attempting cumulative over-return',
        items: [
          {
            product_id: TEST_PROD_ID,
            product_name: 'PowerCell 72V 30Ah',
            sku: `SKU-${FIXTURE_PREFIX}-BAT`,
            quantity: 3, // Only 2 remaining!
            unit_cost: 100000.00
          }
        ]
      })

    assert.strictEqual(res.status, 400)
    assert.match(res.body.message, /exceeds.*returnable/i)
  })

  // -------------------------------------------------------------------------
  // 8. Return of QC Hold Units (No Active Stock Deduction Invariant)
  // -------------------------------------------------------------------------
  await t.test('12. QC Hold unit return: updates unit status but DOES NOT deduct active stock a second time', async () => {
    const [stockBefore] = await query(
      'SELECT on_hand, available FROM `inventory_stock` WHERE `product_id` = ? AND `branch_id` = ?',
      [TEST_PROD_ID, TEST_BRANCH_ID]
    )

    // Create Draft return for QC Hold unit
    const createRes = await request(app)
      .post('/api/v1/procurement/returns')
      .set(peshawarBmHeaders)
      .send({
        return_number: `PRTN-${FIXTURE_PREFIX}-002`,
        supplier_id: supplierId,
        po_id: createdPoId,
        receipt_id: receiptId,
        reason: 'Returning damaged cell on QC Hold (RET-E2E)',
        items: [
          {
            product_id: TEST_PROD_ID,
            product_name: 'PowerCell 72V 30Ah',
            sku: `SKU-${FIXTURE_PREFIX}-BAT`,
            serial_number: TEST_SERIAL_QC,
            is_qc_hold: true,
            condition: 'Damaged',
            qc: 'Fail',
            quantity: 1,
            unit_cost: 100000.00
          }
        ]
      })

    assert.strictEqual(createRes.status, 201)
    const qcReturnId = createRes.body.id

    // Approve the QC Hold return
    const approveRes = await request(app)
      .post(`/api/v1/procurement/returns/${qcReturnId}/approve`)
      .set(peshawarBmHeaders)

    assert.strictEqual(approveRes.status, 200)

    // INVARIANT CHECK: Stock on_hand and available MUST NOT decrease because QC Hold units were never in available stock
    const [stockAfter] = await query(
      'SELECT on_hand, available FROM `inventory_stock` WHERE `product_id` = ? AND `branch_id` = ?',
      [TEST_PROD_ID, TEST_BRANCH_ID]
    )
    assert.strictEqual(parseInt(stockAfter.on_hand), parseInt(stockBefore.on_hand), 'Stock on_hand must not decrease for QC Hold return')
    assert.strictEqual(parseInt(stockAfter.available), parseInt(stockBefore.available), 'Stock available must not decrease for QC Hold return')

    // Serialized unit status must still be updated
    const [qcUnit] = await query('SELECT * FROM `serialized_units` WHERE `serial_number` = ?', [TEST_SERIAL_QC])
    assert.strictEqual(qcUnit.status, 'Returned to Vendor')
  })

  // -------------------------------------------------------------------------
  // 9. Vendor Bill Full Credit Status Distinction
  // -------------------------------------------------------------------------
  await t.test('13. sets bill status to Credited (not Paid) when debit note clears full remaining balance', async () => {
    // Current bill outstanding: read directly
    const [bill] = await query('SELECT * FROM `vendor_bills` WHERE `id` = ?', [billId])
    const billRemaining = parseFloat(bill.outstanding_amount)

    // Create 3rd return for remaining balance
    const createRes = await request(app)
      .post('/api/v1/procurement/returns')
      .set(peshawarBmHeaders)
      .send({
        return_number: `PRTN-${FIXTURE_PREFIX}-003`,
        supplier_id: supplierId,
        po_id: createdPoId,
        receipt_id: receiptId,
        reason: 'Final batch return clearing bill (RET-E2E)',
        items: [
          {
            product_id: TEST_PROD_ID,
            product_name: 'PowerCell 72V 30Ah',
            sku: `SKU-${FIXTURE_PREFIX}-BAT`,
            quantity: 1,
            unit_cost: billRemaining
          }
        ]
      })
    assert.strictEqual(createRes.status, 201)

    const approveRes = await request(app)
      .post(`/api/v1/procurement/returns/${createRes.body.id}/approve`)
      .set(peshawarBmHeaders)
    assert.strictEqual(approveRes.status, 200)

    // Bill outstanding should now be 0.00
    // Because paid_amount was 0, status must be 'Credited' NOT 'Paid'!
    const [billFinal] = await query('SELECT * FROM `vendor_bills` WHERE `id` = ?', [billId])
    assert.strictEqual(parseFloat(billFinal.outstanding_amount), 0.00)
    assert.strictEqual(billFinal.status, 'Credited', 'Must be Credited when cleared solely by debit notes')
  })

  // -------------------------------------------------------------------------
  // 10. Open Credit / Surplus Debit Note (No Eligible Bill)
  // -------------------------------------------------------------------------
  await t.test('14. creates Open Credit debit note when return exceeds bill or no eligible bill exists', async () => {
    // Create return with non-existent PO/bill and QC Hold item (no active inventory deduction)
    const createRes = await request(app)
      .post('/api/v1/procurement/returns')
      .set(adminHeaders)
      .send({
        return_number: `PRTN-${FIXTURE_PREFIX}-004`,
        supplier_id: supplierId,
        reason: 'Excess credit test without bill (RET-E2E)',
        items: [
          {
            product_id: TEST_PROD_ID,
            product_name: 'PowerCell 72V 30Ah',
            sku: `SKU-${FIXTURE_PREFIX}-BAT`,
            is_qc_hold: true,
            condition: 'Damaged',
            quantity: 1,
            unit_cost: 50000.00
          }
        ]
      })
    assert.strictEqual(createRes.status, 201)

    const approveRes = await request(app)
      .post(`/api/v1/procurement/returns/${createRes.body.id}/approve`)
      .set(adminHeaders)
    assert.strictEqual(approveRes.status, 200)

    // Verify debit note was created with Open Credit
    const [debitNote] = await query('SELECT * FROM `vendor_debit_notes` WHERE `return_id` = ?', [createRes.body.id])
    assert.ok(debitNote)
    assert.strictEqual(parseFloat(debitNote.amount), 50000.00)
    assert.strictEqual(parseFloat(debitNote.applied_amount), 0.00)
    assert.strictEqual(parseFloat(debitNote.remaining_credit), 50000.00)
    assert.strictEqual(debitNote.status, 'Open Credit')
  })

  // -------------------------------------------------------------------------
  // 11. Cleanup and Stock Restoration
  // -------------------------------------------------------------------------
  await t.test('15. Safe teardown and baseline restoration', async () => {
    if (isDbReady) {
      await query('DELETE FROM `vendor_debit_notes` WHERE `return_number` LIKE ? OR `notes` LIKE ?', [`%${FIXTURE_PREFIX}%`, `%${FIXTURE_PREFIX}%`])
      await query('DELETE FROM `purchase_returns` WHERE `return_number` LIKE ? OR `reason` LIKE ?', [`%${FIXTURE_PREFIX}%`, `%${FIXTURE_PREFIX}%`])
      await query('DELETE FROM `vendor_bills` WHERE `supplier_id` LIKE ? OR `receipt_id` LIKE ? OR `po_number` LIKE ? OR `po_id` LIKE ?', [`%${FIXTURE_PREFIX}%`, `%${FIXTURE_PREFIX}%`, `%${FIXTURE_PREFIX}%`, `%${FIXTURE_PREFIX}%`])
      await query('DELETE FROM `goods_receipts` WHERE `receipt_number` LIKE ? OR `id` LIKE ?', [`%${FIXTURE_PREFIX}%`, `%${FIXTURE_PREFIX}%`])
      await query('DELETE FROM `purchase_orders` WHERE `notes` LIKE ? OR `po_number` LIKE ? OR `id` LIKE ?', [`%${FIXTURE_PREFIX}%`, `%${FIXTURE_PREFIX}%`, `%${FIXTURE_PREFIX}%`])
      if (supplierId) {
        await query('DELETE FROM `suppliers` WHERE `id` = ?', [supplierId])
      }
      await query('DELETE FROM `stock_movements` WHERE `notes` LIKE ? OR `reason` LIKE ? OR `reference_id` LIKE ?', [`%${FIXTURE_PREFIX}%`, `%${FIXTURE_PREFIX}%`, `%${FIXTURE_PREFIX}%`])
      await query('DELETE FROM `serialized_units` WHERE `serial_number` LIKE ?', [`%${FIXTURE_PREFIX}%`])

      // Revert stock back to baseline
      await query(
        'UPDATE `inventory_stock` SET `on_hand` = ?, `available` = ?, `updated_at` = NOW() WHERE `product_id` = ? AND `branch_id` = ?',
        [initialStockOnHand, initialStockAvailable, TEST_PROD_ID, TEST_BRANCH_ID]
      )

      await disconnectDB()
    }
  })
})
