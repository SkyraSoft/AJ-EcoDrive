import { describe, it, before, after } from 'node:test'
import assert from 'node:assert'
import request from 'supertest'
import { app } from '../src/app.js'
import { connectDB, disconnectDB, getDbStatus, query } from '../src/config/db.js'
import { runMigrations } from '../src/db/migrations.js'
import { getAdminAuthHeader, getBranchManagerAuthHeader, getTechnicianAuthHeader } from './helpers/auth.helper.js'

describe('AJ EcoDrive Backend — After-Sales & Workshop Module REAL MySQL Suite', () => {
  let isDbReady = false

  const adminHeaders = getAdminAuthHeader()
  const peshawarBmHeaders = getBranchManagerAuthHeader('BR-01', 'Peshawar')
  const islamabadBmHeaders = getBranchManagerAuthHeader('BR-02', 'Islamabad')
  const technicianHeaders = getTechnicianAuthHeader('BR-01', 'Peshawar')

  const TEST_CASE_ID = 'SC-TEST-9001'
  const TEST_REPAIR_ID = 'RJ-TEST-9001'
  const TEST_WARRANTY_REPAIR_ID = 'RJ-TEST-9002'
  const TEST_INSUFFICIENT_STOCK_REPAIR_ID = 'RJ-TEST-9003'
  const TEST_CLAIM_ID = 'CLM-TEST-9001'
  const TEST_CLAIM_REJECT_ID = 'CLM-TEST-9002'
  const TEST_UNIT_ID = 'UNIT-TEST-AS-01'
  const TEST_VIN = 'VIN-PK-TEST-AS-9001'
  const TEST_PRODUCT_ID = 'PROD-007' // PowerCell 72V 30Ah

  let initialStockOnHand = 0
  let initialStockAvailable = 0

  before(async () => {
    isDbReady = await connectDB()
    if (isDbReady) {
      await runMigrations()

      // Clean up previous test artifacts if any
      await query('DELETE FROM `invoice_items` WHERE `invoice_id` LIKE "INV-REP-RJ-TEST%"')
      await query('DELETE FROM `invoices` WHERE `id` LIKE "INV-REP-RJ-TEST%" OR `order_id` LIKE "RJ-TEST%"')
      await query('DELETE FROM `stock_movements` WHERE `reference_id` LIKE "RJ-TEST%"')
      await query('DELETE FROM `repair_job_items` WHERE `repair_job_id` LIKE "RJ-TEST%"')
      await query('DELETE FROM `repair_jobs` WHERE `id` LIKE "RJ-TEST%" OR `job_number` LIKE "RJ-TEST%"')
      await query('DELETE FROM `warranty_claims` WHERE `id` LIKE "CLM-TEST%" OR `claim_number` LIKE "CLM-TEST%"')
      await query('DELETE FROM `service_cases` WHERE `id` LIKE "SC-TEST%" OR `case_number` LIKE "SC-TEST%"')
      await query('DELETE FROM `serialized_units` WHERE `unit_id` = ?', [TEST_UNIT_ID])

      // Seed a dedicated test serialized unit
      await query(`
        INSERT INTO \`serialized_units\` (
          \`id\`, \`unit_id\`, \`serial_number\`, \`chassis_number\`, \`vin\`, \`motor_number\`, \`battery_number\`,
          \`product_id\`, \`product_name\`, \`sku\`, \`branch_id\`, \`branch\`, \`location\`,
          \`landed_cost\`, \`selling_price\`, \`status\`, \`status_class\`, \`warranty_expiry\`
        ) VALUES (
          ?, ?, 'TEST-SN-9001', 'CH-TEST-9001', ?, 'MTR-TEST-9001', 'BAT-TEST-9001',
          'PROD-003', 'BRG DS11', 'SKU-DS11-BLU', 'BR-01', 'Peshawar', 'Showroom Bay',
          145000.00, 240000.00, 'Available', 'bg-[#dcfce7] text-[#165A31]', '2028-12-31'
        )
      `, [TEST_UNIT_ID, TEST_UNIT_ID, TEST_VIN])

      // Record baseline stock for PROD-007 at BR-01
      const stockRows = await query('SELECT on_hand, available FROM `inventory_stock` WHERE `product_id` = ? AND `branch_id` = "BR-01"', [TEST_PRODUCT_ID])
      if (stockRows.length > 0) {
        initialStockOnHand = parseInt(stockRows[0].on_hand || 0, 10)
        initialStockAvailable = parseInt(stockRows[0].available || 0, 10)
        // Temporarily seed test stock for repair parts consumption
        await query('UPDATE `inventory_stock` SET on_hand = on_hand + 20, available = available + 20 WHERE `product_id` = ? AND `branch_id` = "BR-01"', [TEST_PRODUCT_ID])
      } else {
        await query(`
          INSERT INTO \`inventory_stock\` (\`product_id\`, \`branch_id\`, \`branch\`, \`on_hand\`, \`reserved\`, \`available\`, \`incoming\`)
          VALUES (?, 'BR-01', 'Peshawar', 20, 0, 20, 0)
        `, [TEST_PRODUCT_ID])
        initialStockOnHand = 0
        initialStockAvailable = 0
      }
    }
  })

  after(async () => {
    if (isDbReady) {
      // Clean up test records
      await query('DELETE FROM `invoice_items` WHERE `invoice_id` LIKE "INV-REP-RJ-TEST%"')
      await query('DELETE FROM `invoices` WHERE `id` LIKE "INV-REP-RJ-TEST%" OR `order_id` LIKE "RJ-TEST%"')
      await query('DELETE FROM `stock_movements` WHERE `reference_id` LIKE "RJ-TEST%"')
      await query('DELETE FROM `repair_job_items` WHERE `repair_job_id` LIKE "RJ-TEST%"')
      await query('DELETE FROM `repair_jobs` WHERE `id` LIKE "RJ-TEST%" OR `job_number` LIKE "RJ-TEST%"')
      await query('DELETE FROM `warranty_claims` WHERE `id` LIKE "CLM-TEST%" OR `claim_number` LIKE "CLM-TEST%"')
      await query('DELETE FROM `service_cases` WHERE `id` LIKE "SC-TEST%" OR `case_number` LIKE "SC-TEST%"')
      await query('DELETE FROM `serialized_units` WHERE `unit_id` = ?', [TEST_UNIT_ID])

      // Restore baseline stock
      await query('UPDATE `inventory_stock` SET on_hand = ?, available = ? WHERE `product_id` = ? AND `branch_id` = "BR-01"', [
        initialStockOnHand, initialStockAvailable, TEST_PRODUCT_ID
      ])

      await disconnectDB()
    }
  })

  // 1. Database Schema & Tables
  it('1. Verifies MySQL database connection and all 4 After-Sales tables exist', async () => {
    const status = getDbStatus()
    assert.strictEqual(status.isConnected, true, 'Real MySQL connection must be active')

    const tables = await query('SHOW TABLES')
    const tableNames = tables.map(t => Object.values(t)[0])
    const required = [
      'service_cases',
      'repair_jobs',
      'repair_job_items',
      'warranty_claims'
    ]
    for (const reqTable of required) {
      assert.ok(tableNames.includes(reqTable), `Table "${reqTable}" must exist in MySQL ecodrive`)
    }
  })

  // 2. Authentication Enforcement
  it('2. Authentication: Rejects unauthenticated requests and invalid tokens with 401', async () => {
    // Missing token
    const res1 = await request(app).get('/api/v1/after-sales/cases')
    assert.strictEqual(res1.status, 401)
    assert.strictEqual(res1.body.ok, false)

    // Malformed token
    const res2 = await request(app)
      .get('/api/v1/after-sales/cases')
      .set('Authorization', 'InvalidTokenFormat')
    assert.strictEqual(res2.status, 401)

    // Invalid signature token
    const res3 = await request(app)
      .get('/api/v1/after-sales/repair-jobs')
      .set('Authorization', 'Bearer invalid.jwt.token')
    assert.strictEqual(res3.status, 401)
  })

  // 3. Customer & Case Validation
  it('3. Case Validation: Rejects missing customer or missing complaint with 400', async () => {
    // Missing customer
    const res1 = await request(app)
      .post('/api/v1/after-sales/cases')
      .set(peshawarBmHeaders)
      .send({
        complaint: 'Battery indicator flickering'
      })
    assert.strictEqual(res1.status, 400)
    assert.strictEqual(res1.body.error, 'VALIDATION_ERROR')

    // Missing complaint/issue
    const res2 = await request(app)
      .post('/api/v1/after-sales/cases')
      .set(peshawarBmHeaders)
      .send({
        customer: 'Tariq Mehmood'
      })
    assert.strictEqual(res2.status, 400)
    assert.strictEqual(res2.body.error, 'VALIDATION_ERROR')
  })

  // 4. Service Case Creation & Unit State Transition
  it('4. Case Lifecycle: Creates service case and updates serialized unit status to Maintenance', async () => {
    const res = await request(app)
      .post('/api/v1/after-sales/cases')
      .set(peshawarBmHeaders)
      .send({
        id: TEST_CASE_ID,
        case_number: TEST_CASE_ID,
        customer_id: 'CUST-101',
        customer: 'Ahsan Khan',
        customerPhone: '+92 300 555 0188',
        unit_id: TEST_UNIT_ID,
        vin: TEST_VIN,
        category: 'Electrical',
        issue: 'Battery pack drops voltage abruptly below 30% capacity',
        priority: 'High',
        assignedTech: 'Tariq Mehmood'
      })

    assert.strictEqual(res.status, 201)
    assert.strictEqual(res.body.ok, true)
    assert.strictEqual(res.body.case.caseId, TEST_CASE_ID)
    assert.strictEqual(res.body.case.branch_id, 'BR-01')

    // Verify unit status was updated to Maintenance in serialized_units
    const unitRows = await query('SELECT status FROM `serialized_units` WHERE `unit_id` = ?', [TEST_UNIT_ID])
    assert.strictEqual(unitRows[0].status, 'Maintenance', 'Unit status must transition to Maintenance upon service intake')

    // Retrieve single case
    const getRes = await request(app)
      .get(`/api/v1/after-sales/cases/${TEST_CASE_ID}`)
      .set(peshawarBmHeaders)
    assert.strictEqual(getRes.status, 200)
    assert.strictEqual(getRes.body.caseId, TEST_CASE_ID)
  })

  // 5. Case Update
  it('5. Case Update: Modifies status, diagnostic summary, and technical assignee', async () => {
    const res = await request(app)
      .put(`/api/v1/after-sales/cases/${TEST_CASE_ID}`)
      .set(peshawarBmHeaders)
      .send({
        status: 'In Progress',
        diagnosis_summary: 'BMS cell balance fault confirmed on cell 4.',
        assigned_tech: 'Sami Ullah'
      })

    assert.strictEqual(res.status, 200)
    assert.strictEqual(res.body.ok, true)
    assert.strictEqual(res.body.case.status, 'In Progress')
    assert.strictEqual(res.body.case.assignedTech, 'Sami Ullah')
  })

  // 6. Branch Isolation Guardrail
  it('6. Branch Isolation: Prevents unauthorized branch manager from accessing other branch repairs', async () => {
    // Create a repair job for Peshawar
    await request(app)
      .post('/api/v1/after-sales/repair-jobs')
      .set(peshawarBmHeaders)
      .send({
        id: TEST_REPAIR_ID,
        job_number: TEST_REPAIR_ID,
        case_id: TEST_CASE_ID,
        customer_id: 'CUST-101',
        customer: 'Ahsan Khan',
        unit_id: TEST_UNIT_ID,
        diagnosis: 'BMS voltage imbalance diagnostic check',
        branch_id: 'BR-01',
        technician: 'Tariq Mehmood',
        partsList: [
          { product_id: TEST_PRODUCT_ID, part: 'PowerCell 72V 30Ah', qty: 1, cost: 85000 }
        ],
        labourList: [
          { work: 'Cell stack diagnostic calibration', hours: 2, rate: 2500 }
        ],
        warrantyStatus: 'Expired / Paid'
      })

    // Islamabad BM attempts to view Peshawar repair job -> 403 Forbidden
    const resForbidden = await request(app)
      .get(`/api/v1/after-sales/repair-jobs/${TEST_REPAIR_ID}`)
      .set(islamabadBmHeaders)
    assert.strictEqual(resForbidden.status, 403)
    assert.strictEqual(resForbidden.body.error, 'FORBIDDEN')

    // Islamabad BM attempts to complete Peshawar repair job -> 403 Forbidden
    const resCompleteForbidden = await request(app)
      .post(`/api/v1/after-sales/repair-jobs/${TEST_REPAIR_ID}/complete`)
      .set(islamabadBmHeaders)
      .send({ notes: 'Unauthorized attempt' })
    assert.strictEqual(resCompleteForbidden.status, 403)

    // Super Admin can freely view Peshawar repair job
    const resAdmin = await request(app)
      .get(`/api/v1/after-sales/repair-jobs/${TEST_REPAIR_ID}`)
      .set(adminHeaders)
    assert.strictEqual(resAdmin.status, 200)
    assert.strictEqual(resAdmin.body.repairId, TEST_REPAIR_ID)
  })

  // 7. Repair Job Creation & Totals Calculation
  it('7. Repair Job Totals: Calculates parts, labour, and customer payable server-side', async () => {
    const job = await request(app)
      .get(`/api/v1/after-sales/repair-jobs/${TEST_REPAIR_ID}`)
      .set(peshawarBmHeaders)

    assert.strictEqual(job.status, 200)
    assert.strictEqual(job.body.costSummary.rawPartsTotal, 85000)
    assert.strictEqual(job.body.costSummary.rawLabourTotal, 5000)
    assert.strictEqual(job.body.costSummary.rawTotal, 90000)
    assert.strictEqual(job.body.costSummary.rawCustomerPayable, 90000)
    assert.strictEqual(job.body.posted_to_finance, false)
  })

  // 8. Atomic Repair Completion & Stock Deduction
  it('8. Atomic Stock Consumption: Completes repair, decrements inventory stock, and logs movement', async () => {
    const preStock = await query('SELECT on_hand, available FROM `inventory_stock` WHERE `product_id` = ? AND `branch_id` = "BR-01"', [TEST_PRODUCT_ID])
    const stockBefore = parseInt(preStock[0].on_hand, 10)

    const res = await request(app)
      .post(`/api/v1/after-sales/repair-jobs/${TEST_REPAIR_ID}/complete`)
      .set(peshawarBmHeaders)
      .send({ notes: 'Repair completed and inspected' })

    assert.strictEqual(res.status, 200)
    assert.strictEqual(res.body.ok, true)
    assert.strictEqual(res.body.repair.status, 'Completed')

    // Verify inventory_stock on_hand decremented by 1
    const postStock = await query('SELECT on_hand, available FROM `inventory_stock` WHERE `product_id` = ? AND `branch_id` = "BR-01"', [TEST_PRODUCT_ID])
    const stockAfter = parseInt(postStock[0].on_hand, 10)
    assert.strictEqual(stockAfter, stockBefore - 1, 'Inventory on_hand must be decremented by the consumed quantity')

    // Verify stock_movements ledger entry
    const movements = await query('SELECT * FROM `stock_movements` WHERE `reference_id` = ? AND `reference_type` = "REPAIR_CONSUMPTION"', [TEST_REPAIR_ID])
    assert.strictEqual(movements.length, 1, 'Exactly one stock movement ledger record must be created')
    assert.strictEqual(parseInt(movements[0].quantity, 10), -1)
    assert.strictEqual(parseInt(movements[0].on_hand_before, 10), stockBefore)
    assert.strictEqual(parseInt(movements[0].on_hand_after, 10), stockAfter)

    // Verify serialized unit status restored to Available
    const unitRows = await query('SELECT status FROM `serialized_units` WHERE `unit_id` = ?', [TEST_UNIT_ID])
    assert.strictEqual(unitRows[0].status, 'Available', 'Unit status must return to Available after job completion')
  })

  // 9. Immutability Guardrail
  it('9. Immutability: Rejects modification or re-completion of completed repair job (409)', async () => {
    // Attempt re-completion
    const resRecomplete = await request(app)
      .post(`/api/v1/after-sales/repair-jobs/${TEST_REPAIR_ID}/complete`)
      .set(peshawarBmHeaders)
    assert.strictEqual(resRecomplete.status, 409)
    assert.strictEqual(resRecomplete.body.error, 'CONFLICT')

    // Attempt modification
    const resUpdate = await request(app)
      .put(`/api/v1/after-sales/repair-jobs/${TEST_REPAIR_ID}`)
      .set(peshawarBmHeaders)
      .send({ diagnosis: 'Illegal post-completion edit' })
    assert.strictEqual(resUpdate.status, 409)
    assert.strictEqual(resUpdate.body.error, 'CONFLICT')
  })

  // 10. Insufficient Stock Rollback Guardrail
  it('10. Rollback on Insufficient Stock: Prevents negative stock and preserves atomicity (400)', async () => {
    // Create a repair requesting 9999 units of spare part
    await request(app)
      .post('/api/v1/after-sales/repair-jobs')
      .set(peshawarBmHeaders)
      .send({
        id: TEST_INSUFFICIENT_STOCK_REPAIR_ID,
        job_number: TEST_INSUFFICIENT_STOCK_REPAIR_ID,
        customer_id: 'CUST-101',
        customer: 'Ahsan Khan',
        diagnosis: 'Heavy parts replacement test',
        branch_id: 'BR-01',
        partsList: [
          { product_id: TEST_PRODUCT_ID, part: 'PowerCell 72V 30Ah', qty: 9999, cost: 85000 }
        ],
        warrantyStatus: 'Paid'
      })

    const stockBefore = await query('SELECT on_hand FROM `inventory_stock` WHERE `product_id` = ? AND `branch_id` = "BR-01"', [TEST_PRODUCT_ID])

    const res = await request(app)
      .post(`/api/v1/after-sales/repair-jobs/${TEST_INSUFFICIENT_STOCK_REPAIR_ID}/complete`)
      .set(peshawarBmHeaders)

    assert.strictEqual(res.status, 400)
    assert.strictEqual(res.body.error, 'INSUFFICIENT_STOCK')

    // Verify stock was not changed
    const stockAfter = await query('SELECT on_hand FROM `inventory_stock` WHERE `product_id` = ? AND `branch_id` = "BR-01"', [TEST_PRODUCT_ID])
    assert.strictEqual(stockAfter[0].on_hand, stockBefore[0].on_hand, 'Stock must not change when transaction rolls back')

    // Verify job remains in progress
    const jobCheck = await query('SELECT status FROM `repair_jobs` WHERE `id` = ?', [TEST_INSUFFICIENT_STOCK_REPAIR_ID])
    assert.strictEqual(jobCheck[0].status, 'In Progress')
  })

  // 11. Finance Integration — Chargeable Invoice Creation
  it('11. Finance Posting: Chargeable repair generates invoice in invoices and invoice_items', async () => {
    const res = await request(app)
      .post(`/api/v1/after-sales/repair-jobs/${TEST_REPAIR_ID}/post-finance`)
      .set(peshawarBmHeaders)

    assert.strictEqual(res.status, 200)
    assert.strictEqual(res.body.ok, true)
    assert.strictEqual(res.body.posted, true)
    assert.strictEqual(res.body.invoiceId, `INV-REP-${TEST_REPAIR_ID}`)
    assert.strictEqual(res.body.payable, 90000)

    // Verify invoice created in `invoices` table
    const invoiceRows = await query('SELECT * FROM `invoices` WHERE `id` = ?', [`INV-REP-${TEST_REPAIR_ID}`])
    assert.strictEqual(invoiceRows.length, 1)
    assert.strictEqual(parseFloat(invoiceRows[0].total), 90000)
    assert.strictEqual(invoiceRows[0].customer_id, 'CUST-101')
    assert.strictEqual(invoiceRows[0].status, 'Unpaid')

    // Verify invoice items created in `invoice_items` table
    const itemRows = await query('SELECT * FROM `invoice_items` WHERE `invoice_id` = ?', [`INV-REP-${TEST_REPAIR_ID}`])
    assert.strictEqual(itemRows.length, 2, 'Must have 2 invoice items (part + labour)')

    // Verify repair job marked as posted
    const jobRows = await query('SELECT posted_to_finance, invoice_id FROM `repair_jobs` WHERE `id` = ?', [TEST_REPAIR_ID])
    assert.strictEqual(jobRows[0].posted_to_finance, 1)
    assert.strictEqual(jobRows[0].invoice_id, `INV-REP-${TEST_REPAIR_ID}`)
  })

  // 12. Duplicate Invoice Posting Prevention
  it('12. Duplicate Posting Guardrail: Second call to postRepairToFinance returns 409', async () => {
    const res = await request(app)
      .post(`/api/v1/after-sales/repair-jobs/${TEST_REPAIR_ID}/post-finance`)
      .set(peshawarBmHeaders)

    assert.strictEqual(res.status, 409)
    assert.strictEqual(res.body.error, 'ALREADY_POSTED')

    // Confirm no duplicate invoice exists in DB
    const count = await query('SELECT COUNT(*) as count FROM `invoices` WHERE `order_id` = ?', [TEST_REPAIR_ID])
    assert.strictEqual(parseInt(count[0].count, 10), 1)
  })

  // 13. 100% Warranty Repair — Zero Customer Payable
  it('13. Warranty Repair: 100% warranty coverage marks posted without generating customer invoice', async () => {
    // Create 100% warranty repair
    await request(app)
      .post('/api/v1/after-sales/repair-jobs')
      .set(peshawarBmHeaders)
      .send({
        id: TEST_WARRANTY_REPAIR_ID,
        job_number: TEST_WARRANTY_REPAIR_ID,
        customer_id: 'CUST-101',
        customer: 'Ahsan Khan',
        diagnosis: 'OEM battery cell warranty replacement',
        branch_id: 'BR-01',
        partsList: [
          { product_id: TEST_PRODUCT_ID, part: 'PowerCell 72V 30Ah', qty: 1, cost: 85000, isWarrantyCovered: true }
        ],
        labourList: [
          { work: 'Warranty diagnostic routine', hours: 1, rate: 2000, isWarrantyCovered: true }
        ],
        warrantyStatus: 'Active (100% OEM Covered)'
      })

    const res = await request(app)
      .post(`/api/v1/after-sales/repair-jobs/${TEST_WARRANTY_REPAIR_ID}/post-finance`)
      .set(peshawarBmHeaders)

    assert.strictEqual(res.status, 200)
    assert.strictEqual(res.body.warrantyCovered, true)
    assert.strictEqual(res.body.payable, 0)
    assert.strictEqual(res.body.invoiceId, null)

    // Verify NO customer receivable was posted to `invoices`
    const invRows = await query('SELECT * FROM `invoices` WHERE `order_id` = ?', [TEST_WARRANTY_REPAIR_ID])
    assert.strictEqual(invRows.length, 0, 'No customer invoice should be generated for 100% warranty repair')

    // Repair job is marked as posted
    const jobRows = await query('SELECT posted_to_finance FROM `repair_jobs` WHERE `id` = ?', [TEST_WARRANTY_REPAIR_ID])
    assert.strictEqual(jobRows[0].posted_to_finance, 1)
  })

  // 14. Warranty Claims & Permissions
  it('14. Warranty Claim Permissions: Technician without approval permission is rejected (403)', async () => {
    // Create claim
    const createRes = await request(app)
      .post('/api/v1/after-sales/warranty-claims')
      .set(peshawarBmHeaders)
      .send({
        id: TEST_CLAIM_ID,
        claim_number: TEST_CLAIM_ID,
        customer_id: 'CUST-101',
        customer: 'Ahsan Khan',
        claimAmount: 85000,
        coveragePolicy: 'Full System 2-Year OEM Warranty'
      })
    assert.strictEqual(createRes.status, 201)

    // Technician attempts to approve claim -> 403 Forbidden
    const approveRes = await request(app)
      .post(`/api/v1/after-sales/warranty-claims/${TEST_CLAIM_ID}/approve`)
      .set(technicianHeaders)
    assert.strictEqual(approveRes.status, 403)
    assert.strictEqual(approveRes.body.error, 'FORBIDDEN')

    // Authorized BM approves claim -> 200 OK
    const bmApproveRes = await request(app)
      .post(`/api/v1/after-sales/warranty-claims/${TEST_CLAIM_ID}/approve`)
      .set(peshawarBmHeaders)
    assert.strictEqual(bmApproveRes.status, 200)
    assert.strictEqual(bmApproveRes.body.claim.status, 'Approved')

    // Reject flow
    await request(app)
      .post('/api/v1/after-sales/warranty-claims')
      .set(peshawarBmHeaders)
      .send({
        id: TEST_CLAIM_REJECT_ID,
        claim_number: TEST_CLAIM_REJECT_ID,
        customer_id: 'CUST-102',
        customer: 'Noman Ali',
        claimAmount: 15000
      })

    const rejectRes = await request(app)
      .post(`/api/v1/after-sales/warranty-claims/${TEST_CLAIM_REJECT_ID}/reject`)
      .set(peshawarBmHeaders)
      .send({ reason: 'Wear and tear not covered under policy' })
    assert.strictEqual(rejectRes.status, 200)
    assert.strictEqual(rejectRes.body.claim.status, 'Rejected')
  })

  // 15. Dashboard Overview Metrics
  it('15. Overview & KPIs: Returns branch-scoped and company-wide after-sales analytics', async () => {
    // Branch manager view
    const bmRes = await request(app)
      .get('/api/v1/after-sales/overview')
      .set(peshawarBmHeaders)
    assert.strictEqual(bmRes.status, 200)
    assert.ok(bmRes.body.kpis.totalCases !== undefined || bmRes.body.kpis.openCases !== undefined)
    assert.ok(Array.isArray(bmRes.body.recentCases))
    assert.ok(Array.isArray(bmRes.body.recentRepairs))

    // Super Admin view
    const adminRes = await request(app)
      .get('/api/v1/after-sales/overview')
      .set(adminHeaders)
    assert.strictEqual(adminRes.status, 200)
    assert.ok(Array.isArray(adminRes.body.branchWorkload))
    assert.strictEqual(adminRes.body.branchWorkload.length, 4, 'Must return workload across all 4 branches')
  })

  // 16. Concurrent Repair Completion & Stock Deduction Race-Condition Guard
  it('16. Concurrent Repair Completion: Concurrent complete requests do not double-deduct stock; exactly one succeeds and one returns 409', async () => {
    const TEST_CONCURRENT_REPAIR_ID = 'RJ-TEST-CONC-01'

    // 1. Create a dedicated repair job with 1 unit of PROD-007
    await request(app)
      .post('/api/v1/after-sales/repair-jobs')
      .set(peshawarBmHeaders)
      .send({
        id: TEST_CONCURRENT_REPAIR_ID,
        job_number: TEST_CONCURRENT_REPAIR_ID,
        customer_id: 'CUST-101',
        customer: 'Ahsan Khan',
        diagnosis: 'Concurrent execution race condition test',
        branch_id: 'BR-01',
        partsList: [
          { product_id: TEST_PRODUCT_ID, part: 'PowerCell 72V 30Ah', qty: 1, cost: 85000 }
        ],
        warrantyStatus: 'Expired / Paid'
      })

    // 2. Capture stock before firing concurrent requests
    const preStock = await query('SELECT on_hand, available FROM `inventory_stock` WHERE `product_id` = ? AND `branch_id` = "BR-01"', [TEST_PRODUCT_ID])
    const stockBefore = parseInt(preStock[0].on_hand, 10)

    // 3. Fire two concurrent completion requests simultaneously
    const [resA, resB] = await Promise.all([
      request(app)
        .post(`/api/v1/after-sales/repair-jobs/${TEST_CONCURRENT_REPAIR_ID}/complete`)
        .set(peshawarBmHeaders)
        .send({ notes: 'Concurrent invocation A' }),
      request(app)
        .post(`/api/v1/after-sales/repair-jobs/${TEST_CONCURRENT_REPAIR_ID}/complete`)
        .set(peshawarBmHeaders)
        .send({ notes: 'Concurrent invocation B' })
    ])

    const statuses = [resA.status, resB.status]
    assert.ok(statuses.includes(200), `Exactly one concurrent completion must succeed with 200 OK. Got: ${statuses.join(', ')}`)
    assert.ok(statuses.includes(409), `The competing concurrent completion must be rejected with 409 Conflict. Got: ${statuses.join(', ')}`)

    // 4. Verify inventory was decremented exactly ONCE
    const postStock = await query('SELECT on_hand, available FROM `inventory_stock` WHERE `product_id` = ? AND `branch_id` = "BR-01"', [TEST_PRODUCT_ID])
    const stockAfter = parseInt(postStock[0].on_hand, 10)
    assert.strictEqual(stockAfter, stockBefore - 1, 'Inventory on_hand must be decremented exactly by 1 unit, never double-deducted')

    // 5. Verify exactly one stock movement record was created for this repair job
    const movements = await query('SELECT * FROM `stock_movements` WHERE `reference_id` = ? AND `reference_type` = "REPAIR_CONSUMPTION"', [TEST_CONCURRENT_REPAIR_ID])
    assert.strictEqual(movements.length, 1, 'Exactly one stock movement ledger entry must be created')
  })

  // 17. Cross-Branch Warranty Claim Review Guardrail
  it('17. Cross-Branch Warranty Review: Branch manager from another branch cannot approve warranty claims (403)', async () => {
    const TEST_BRANCH_CLAIM_ID = 'CLM-TEST-BRANCH-01'

    // 1. Create a claim for Peshawar branch
    await request(app)
      .post('/api/v1/after-sales/warranty-claims')
      .set(peshawarBmHeaders)
      .send({
        id: TEST_BRANCH_CLAIM_ID,
        claim_number: TEST_BRANCH_CLAIM_ID,
        customer_id: 'CUST-101',
        customer: 'Ahsan Khan',
        branch_id: 'BR-01',
        claimAmount: 45000,
        coveragePolicy: 'Standard 1-Year Battery Warranty'
      })

    // 2. Islamabad BM attempts to approve Peshawar warranty claim -> 403 Forbidden
    const resForbidden = await request(app)
      .post(`/api/v1/after-sales/warranty-claims/${TEST_BRANCH_CLAIM_ID}/approve`)
      .set(islamabadBmHeaders)
    assert.strictEqual(resForbidden.status, 403)
    assert.strictEqual(resForbidden.body.error, 'FORBIDDEN')

    // 3. Authorized Peshawar BM approves own branch warranty claim -> 200 OK
    const resApproved = await request(app)
      .post(`/api/v1/after-sales/warranty-claims/${TEST_BRANCH_CLAIM_ID}/approve`)
      .set(peshawarBmHeaders)
    assert.strictEqual(resApproved.status, 200)
    assert.strictEqual(resApproved.body.claim.status, 'Approved')
  })

  // 18. Production Credential Policy Guardrail
  it('18. Production Credential Guard: Prohibits default demonstration credentials in production mode (403)', async () => {
    const originalEnv = process.env.NODE_ENV
    try {
      process.env.NODE_ENV = 'production'
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          username: 'admin',
          password: 'password123'
        })

      assert.strictEqual(res.status, 403)
      assert.strictEqual(res.body.error, 'DEFAULT_CREDENTIALS_REJECTED')
    } finally {
      process.env.NODE_ENV = originalEnv
    }
  })
})

