import { describe, it, before, after } from 'node:test'
import assert from 'node:assert'
import request from 'supertest'
import { app } from '../src/app.js'
import { connectDB, disconnectDB, getDbStatus, query, withTransaction } from '../src/config/db.js'
import { runMigrations } from '../src/db/migrations.js'
import { getAdminAuthHeader, getBranchManagerAuthHeader, getTechnicianAuthHeader } from './helpers/auth.helper.js'

describe('AJ EcoDrive Backend — CRM Lead Conversion Module REAL MySQL Integration Suite', () => {
  let isDbReady = false

  const adminHeaders = getAdminAuthHeader()
  const peshawarBmHeaders = getBranchManagerAuthHeader('BR-01', 'Peshawar')
  const islamabadBmHeaders = getBranchManagerAuthHeader('BR-02', 'Islamabad')
  const technicianHeaders = getTechnicianAuthHeader('BR-01', 'Peshawar') // Lacks leads.convert

  const TEST_LEAD_SUCCESS_ID = 'LD-TEST-CONV-01'
  const TEST_LEAD_SAME_PHONE = '+92 312 9988001'
  const TEST_LEAD_DUP_CUST_ID = 'LD-TEST-CONV-DUP'
  const TEST_LEAD_ISB_ID = 'LD-TEST-CONV-ISB'
  const TEST_LEAD_CONC_ID = 'LD-TEST-CONV-RACE'
  const TEST_LEAD_ROLLBACK_ID = 'LD-TEST-CONV-ROLL'

  before(async () => {
    isDbReady = await connectDB()
    if (isDbReady) {
      await runMigrations()

      // Clean up previous test artifacts
      await query('DELETE FROM `follow_ups` WHERE `lead_id` LIKE "LD-TEST-CONV%" OR `id` LIKE "FU-TEST-CONV%"')
      await query('DELETE FROM `leads` WHERE `id` LIKE "LD-TEST-CONV%"')
      await query('DELETE FROM `customers` WHERE `id` LIKE "CUST-TEST-CONV%" OR `phone` IN (?, "+92 312 9988002", "+92 312 9988003", "+92 312 9988004")', [TEST_LEAD_SAME_PHONE])
    }
  })

  after(async () => {
    if (isDbReady) {
      // Clean up all test artifacts
      await query('DELETE FROM `follow_ups` WHERE `lead_id` LIKE "LD-TEST-CONV%" OR `id` LIKE "FU-TEST-CONV%"')
      await query('DELETE FROM `leads` WHERE `id` LIKE "LD-TEST-CONV%"')
      await query('DELETE FROM `customers` WHERE `id` LIKE "CUST-TEST-CONV%" OR `phone` IN (?, "+92 312 9988002", "+92 312 9988003", "+92 312 9988004")', [TEST_LEAD_SAME_PHONE])
      await disconnectDB()
    }
  })

  // 1. Connection check
  it('1. Verifies MySQL database connection is live and active', () => {
    const status = getDbStatus()
    assert.strictEqual(status.isConnected, true, 'Real MySQL connection must be active')
  })

  // 2. Unauthenticated request rejection (401)
  it('2. Authentication: Rejects unauthenticated conversion request with 401', async () => {
    const res = await request(app).post(`/api/v1/leads/${TEST_LEAD_SUCCESS_ID}/convert`)
    assert.strictEqual(res.status, 401)
    assert.strictEqual(res.body.ok, false)
    assert.strictEqual(res.body.error, 'UNAUTHORIZED')
  })

  // 3. Unauthorized request rejection (403 - Lacks leads.convert permission)
  it('3. Permissions: Rejects user lacking leads.convert permission with 403', async () => {
    const res = await request(app)
      .post(`/api/v1/leads/${TEST_LEAD_SUCCESS_ID}/convert`)
      .set(technicianHeaders)
      .send({})

    assert.strictEqual(res.status, 403)
    assert.strictEqual(res.body.ok, false)
    assert.strictEqual(res.body.error, 'FORBIDDEN')
  })

  // 4. Missing lead rejection (404)
  it('4. Lead Existence: Rejects conversion of non-existent lead with 404 Not Found', async () => {
    const res = await request(app)
      .post('/api/v1/leads/LD-NON-EXISTENT-9999/convert')
      .set(peshawarBmHeaders)
      .send({ name: 'Valid Customer Name' })

    assert.strictEqual(res.status, 404)
    assert.strictEqual(res.body.ok, false)
    assert.strictEqual(res.body.error, 'NOT_FOUND')
  })

  // 5. Cross-branch conversion rejection (403)
  it('5. Branch Isolation: Rejects conversion of another branch lead with 403 Forbidden', async () => {
    // Insert a lead belonging to Islamabad (BR-02)
    await query(`
      INSERT INTO \`leads\` (
        \`id\`, \`lead_number\`, \`customer_name\`, \`phone\`, \`branch_id\`, \`branch\`, \`stage\`, \`status\`
      ) VALUES (
        ?, 'LD-TEST-CONV-ISB', 'Islamabad Prospect', '+92 312 9988002', 'BR-02', 'Islamabad', 'Qualified', 'Qualified'
      )
    `, [TEST_LEAD_ISB_ID])

    // Peshawar manager (BR-01) tries to convert Islamabad lead (BR-02)
    const res = await request(app)
      .post(`/api/v1/leads/${TEST_LEAD_ISB_ID}/convert`)
      .set(peshawarBmHeaders)
      .send({})

    assert.strictEqual(res.status, 403)
    assert.strictEqual(res.body.ok, false)
    assert.strictEqual(res.body.error, 'FORBIDDEN')
  })

  // 6. Pre-transaction validation: Required fields (422)
  it('6. Validation: Rejects conversion with invalid phone or missing name (422)', async () => {
    // Insert a test lead with temporary invalid state or test payload override
    const testLeadId = 'LD-TEST-CONV-VAL-01'
    await query(`
      INSERT INTO \`leads\` (
        \`id\`, \`lead_number\`, \`customer_name\`, \`phone\`, \`branch_id\`, \`branch\`, \`stage\`, \`status\`
      ) VALUES (
        ?, 'LD-TEST-CONV-VAL-01', 'Validation Test Lead', '+92 312 9988003', 'BR-01', 'Peshawar', 'Qualified', 'Qualified'
      )
    `, [testLeadId])

    // Invalid phone passed in payload
    const res1 = await request(app)
      .post(`/api/v1/leads/${testLeadId}/convert`)
      .set(peshawarBmHeaders)
      .send({ phone: '123' }) // Invalid short phone

    assert.strictEqual(res1.status, 422)
    assert.strictEqual(res1.body.ok, false)
    assert.strictEqual(res1.body.error, 'VALIDATION_FAILED')

    // Invalid CNIC format
    const res2 = await request(app)
      .post(`/api/v1/leads/${testLeadId}/convert`)
      .set(peshawarBmHeaders)
      .send({ cnic: '12345-invalid' })

    assert.strictEqual(res2.status, 422)
    assert.strictEqual(res2.body.ok, false)
    assert.strictEqual(res2.body.error, 'VALIDATION_FAILED')

    // Invalid email format
    const res3 = await request(app)
      .post(`/api/v1/leads/${testLeadId}/convert`)
      .set(peshawarBmHeaders)
      .send({ email: 'not-an-email' })

    assert.strictEqual(res3.status, 422)
    assert.strictEqual(res3.body.ok, false)
    assert.strictEqual(res3.body.error, 'VALIDATION_FAILED')

    // Clean up
    await query('DELETE FROM `leads` WHERE `id` = ?', [testLeadId])
  })

  // 7. Successful atomic lead conversion to NEW customer
  it('7. Successful Conversion: Converts lead to new customer, updates lead status, and links follow-up (200)', async () => {
    // Insert fresh qualified lead
    await query(`
      INSERT INTO \`leads\` (
        \`id\`, \`lead_number\`, \`customer_name\`, \`phone\`, \`email\`, \`city\`,
        \`branch_id\`, \`branch\`, \`stage\`, \`status\`, \`notes\`
      ) VALUES (
        ?, 'LD-TEST-CONV-01', 'Kashif Mehmood', ?, 'kashif.m@example.com', 'Peshawar',
        'BR-01', 'Peshawar', 'Qualified', 'Qualified', 'Ready for EV booking'
      )
    `, [TEST_LEAD_SUCCESS_ID, TEST_LEAD_SAME_PHONE])

    // Insert linked follow-up
    const testFuId = 'FU-TEST-CONV-01'
    await query(`
      INSERT INTO \`follow_ups\` (
        \`id\`, \`branch_id\`, \`branch\`, \`lead_id\`, \`customer_id\`, \`customer_name\`,
        \`phone\`, \`task_type\`, \`status\`
      ) VALUES (
        ?, 'BR-01', 'Peshawar', ?, NULL, 'Kashif Mehmood', ?, 'Lead follow-up', 'Upcoming'
      )
    `, [testFuId, TEST_LEAD_SUCCESS_ID, TEST_LEAD_SAME_PHONE])

    const res = await request(app)
      .post(`/api/v1/leads/${TEST_LEAD_SUCCESS_ID}/convert`)
      .set(peshawarBmHeaders)
      .send({
        cnic: '17301-5544332-1',
        address: 'Hayatabad Phase 5, Peshawar',
        city: 'Peshawar',
        type: 'Individual'
      })

    assert.strictEqual(res.status, 200)
    assert.strictEqual(res.body.ok, true)
    assert.strictEqual(res.body.isExistingCustomer, false)

    // Verify Customer record
    const customer = res.body.customer
    assert.ok(customer.id, 'Created customer must have an ID')
    assert.strictEqual(customer.name, 'Kashif Mehmood')
    assert.strictEqual(customer.phone, '+92 312 9988001')
    assert.strictEqual(customer.cnic, '17301-5544332-1')
    assert.strictEqual(customer.branch_id, 'BR-01')
    assert.strictEqual(customer.status, 'Active')

    // Verify Lead record in response
    const lead = res.body.lead
    assert.strictEqual(lead.customer_id, customer.id)
    assert.strictEqual(lead.stage, 'Converted')
    assert.strictEqual(lead.status, 'Converted')

    // Verify MySQL persistence for customer
    const [savedCust] = await query('SELECT * FROM `customers` WHERE `id` = ?', [customer.id])
    assert.ok(savedCust, 'Customer row must exist in MySQL')
    assert.strictEqual(savedCust.name, 'Kashif Mehmood')
    assert.strictEqual(savedCust.branch_id, 'BR-01')

    // Verify MySQL persistence for lead
    const [savedLead] = await query('SELECT customer_id, stage, status FROM `leads` WHERE `id` = ?', [TEST_LEAD_SUCCESS_ID])
    assert.strictEqual(savedLead.customer_id, customer.id)
    assert.strictEqual(savedLead.stage, 'Converted')

    // Verify linked follow-up was updated with customer_id
    const [savedFu] = await query('SELECT customer_id FROM `follow_ups` WHERE `id` = ?', [testFuId])
    assert.strictEqual(savedFu.customer_id, customer.id)
  })

  // 8. Repeated conversion rejection (400)
  it('8. Repeated Conversion: Rejects converting an already converted lead (400)', async () => {
    // Attempt to convert TEST_LEAD_SUCCESS_ID again
    const res = await request(app)
      .post(`/api/v1/leads/${TEST_LEAD_SUCCESS_ID}/convert`)
      .set(peshawarBmHeaders)
      .send({})

    assert.strictEqual(res.status, 400)
    assert.strictEqual(res.body.ok, false)
    assert.strictEqual(res.body.error, 'LEAD_ALREADY_CONVERTED')
  })

  // 9. Existing matching customer handling in SAME branch
  it('9. Existing Customer Match (Same Branch): Safely links lead to existing customer without duplicate customer (200)', async () => {
    // Create an existing customer in Peshawar (BR-01)
    const existingCustId = 'CUST-TEST-CONV-SAME'
    const matchPhone = '+92 312 9988004'

    await query(`
      INSERT INTO \`customers\` (
        \`id\`, \`code\`, \`name\`, \`phone\`, \`branch_id\`, \`branch\`, \`balance\`, \`orders\`
      ) VALUES (
        ?, 'CUS-TEST-9901', 'Farooq Shah', ?, 'BR-01', 'Peshawar', '50000', 2
      )
    `, [existingCustId, matchPhone])

    // Insert a new lead with matching phone (different format to test normalization match)
    await query(`
      INSERT INTO \`leads\` (
        \`id\`, \`lead_number\`, \`customer_name\`, \`phone\`, \`branch_id\`, \`branch\`, \`stage\`, \`status\`
      ) VALUES (
        ?, 'LD-TEST-CONV-DUP', 'Farooq Prospect', '0312-9988004', 'BR-01', 'Peshawar', 'Qualified', 'Qualified'
      )
    `, [TEST_LEAD_DUP_CUST_ID])

    // Convert lead
    const res = await request(app)
      .post(`/api/v1/leads/${TEST_LEAD_DUP_CUST_ID}/convert`)
      .set(peshawarBmHeaders)
      .send({})

    assert.strictEqual(res.status, 200)
    assert.strictEqual(res.body.ok, true)
    assert.strictEqual(res.body.isExistingCustomer, true, 'Must indicate linked to existing customer')
    assert.strictEqual(res.body.customer.id, existingCustId, 'Must link to existing customer ID')

    // Confirm customer details were preserved and NOT overwritten
    const [custAfter] = await query('SELECT name, balance, orders FROM `customers` WHERE `id` = ?', [existingCustId])
    assert.strictEqual(custAfter.name, 'Farooq Shah', 'Existing customer name must NOT be overwritten')
    assert.strictEqual(String(custAfter.balance), '50000', 'Existing balance must NOT be altered')
    assert.strictEqual(custAfter.orders, 2, 'Existing order count must NOT be altered')

    // Confirm lead was updated
    const [leadAfter] = await query('SELECT customer_id, stage FROM `leads` WHERE `id` = ?', [TEST_LEAD_DUP_CUST_ID])
    assert.strictEqual(leadAfter.customer_id, existingCustId)
    assert.strictEqual(leadAfter.stage, 'Converted')
  })

  // 10. Existing matching customer in DIFFERENT branch rejection (409)
  it('10. Cross-Branch Duplicate Customer: Rejects conversion when customer with same phone exists in another branch (409)', async () => {
    // Existing customer belongs to Islamabad (BR-02)
    const isbCustId = 'CUST-TEST-CONV-ISB-01'
    const sharedPhone = '+92 312 9988009'

    await query(`
      INSERT INTO \`customers\` (
        \`id\`, \`code\`, \`name\`, \`phone\`, \`branch_id\`, \`branch\`
      ) VALUES (
        ?, 'CUS-TEST-ISB-01', 'Islamabad VIP Customer', ?, 'BR-02', 'Islamabad'
      )
    `, [isbCustId, sharedPhone])

    // New lead in Peshawar (BR-01) with the same phone
    const pewLeadId = 'LD-TEST-CONV-CROSS-01'
    await query(`
      INSERT INTO \`leads\` (
        \`id\`, \`lead_number\`, \`customer_name\`, \`phone\`, \`branch_id\`, \`branch\`, \`stage\`, \`status\`
      ) VALUES (
        ?, 'LD-TEST-CONV-CROSS-01', 'Peshawar Prospect Shared Phone', ?, 'BR-01', 'Peshawar', 'Qualified', 'Qualified'
      )
    `, [pewLeadId, sharedPhone])

    // Peshawar manager attempts to convert
    const res = await request(app)
      .post(`/api/v1/leads/${pewLeadId}/convert`)
      .set(peshawarBmHeaders)
      .send({})

    assert.strictEqual(res.status, 409)
    assert.strictEqual(res.body.ok, false)
    assert.strictEqual(res.body.error, 'CUSTOMER_BRANCH_MISMATCH')

    // Clean up
    await query('DELETE FROM `leads` WHERE `id` = ?', [pewLeadId])
    await query('DELETE FROM `customers` WHERE `id` = ?', [isbCustId])
  })

  // 11. Concurrent conversion requests race condition
  it('11. Concurrency: Concurrent conversion requests on same lead: exactly one succeeds, others rejected', async () => {
    // Insert a new qualified lead
    await query(`
      INSERT INTO \`leads\` (
        \`id\`, \`lead_number\`, \`customer_name\`, \`phone\`, \`branch_id\`, \`branch\`, \`stage\`, \`status\`
      ) VALUES (
        ?, 'LD-TEST-CONV-RACE', 'Concurrent Race Prospect', '+92 312 9988015', 'BR-01', 'Peshawar', 'Qualified', 'Qualified'
      )
    `, [TEST_LEAD_CONC_ID])

    // Fire 2 simultaneous conversion requests for the same lead
    const [res1, res2] = await Promise.all([
      request(app).post(`/api/v1/leads/${TEST_LEAD_CONC_ID}/convert`).set(peshawarBmHeaders).send({}),
      request(app).post(`/api/v1/leads/${TEST_LEAD_CONC_ID}/convert`).set(peshawarBmHeaders).send({})
    ])

    const statuses = [res1.status, res2.status].sort()
    assert.deepStrictEqual(statuses, [200, 400], 'Exactly one request must succeed (200) and the other must fail (400 LEAD_ALREADY_CONVERTED)')

    // Confirm exactly one customer was created for this phone
    const customers = await query('SELECT * FROM `customers` WHERE `phone` = "+92 312 9988015"')
    assert.strictEqual(customers.length, 1, 'Only one customer row must exist in MySQL despite racing requests')

    // Clean up
    await query('DELETE FROM `customers` WHERE `phone` = "+92 312 9988015"')
  })

  // 12. Atomic Transaction Rollback on Failure
  it('12. Transaction Rollback: Complete rollback on transaction failure leaves lead and customer untouched', async () => {
    // Insert a test lead for rollback
    await query(`
      INSERT INTO \`leads\` (
        \`id\`, \`lead_number\`, \`customer_name\`, \`phone\`, \`branch_id\`, \`branch\`, \`stage\`, \`status\`
      ) VALUES (
        ?, 'LD-TEST-CONV-ROLL', 'Rollback Prospect', '+92 312 9988099', 'BR-01', 'Peshawar', 'Qualified', 'Qualified'
      )
    `, [TEST_LEAD_ROLLBACK_ID])

    const failedCustId = 'CUST-TEST-CONV-ROLLBACK-99'

    // Simulate an unexpected transaction failure midway
    await assert.rejects(async () => {
      await withTransaction(async (conn) => {
        // Step 1: Insert customer row
        await conn.execute(`
          INSERT INTO \`customers\` (\`id\`, \`code\`, \`name\`, \`phone\`, \`branch_id\`, \`branch\`)
          VALUES (?, 'CUS-ROLL-99', 'Rollback Customer', '+92 312 9988099', 'BR-01', 'Peshawar')
        `, [failedCustId])

        // Step 2: Intentional simulated failure before lead commit
        throw new Error('SIMULATED_TRANSACTION_FAILURE')
      })
    }, /SIMULATED_TRANSACTION_FAILURE/)

    // Verify Customer row was rolled back and does NOT exist in MySQL
    const custCheck = await query('SELECT * FROM `customers` WHERE `id` = ?', [failedCustId])
    assert.strictEqual(custCheck.length, 0, 'Rolled back customer must NOT exist in MySQL')

    // Verify Lead row remains in original unconverted state
    const [leadCheck] = await query('SELECT customer_id, stage, status FROM `leads` WHERE `id` = ?', [TEST_LEAD_ROLLBACK_ID])
    assert.strictEqual(leadCheck.customer_id, null, 'Lead customer_id must remain NULL')
    assert.strictEqual(leadCheck.stage, 'Qualified', 'Lead stage must remain Qualified')
  })

  // 13. Regression Check: Converted customer is accessible via Customer API
  it('13. Regression: Converted customer is queryable via GET /api/v1/customers and /api/v1/customers/:id', async () => {
    // Get converted customer from test #7
    const [leadRow] = await query('SELECT customer_id FROM `leads` WHERE `id` = ?', [TEST_LEAD_SUCCESS_ID])
    assert.ok(leadRow?.customer_id, 'Lead must have customer_id')

    // Fetch single customer via customer API
    const resDetail = await request(app)
      .get(`/api/v1/customers/${leadRow.customer_id}`)
      .set(peshawarBmHeaders)

    assert.strictEqual(resDetail.status, 200)
    assert.strictEqual(resDetail.body.id, leadRow.customer_id)
    assert.strictEqual(resDetail.body.phone, '+92 312 9988001')

    // Fetch customer list via customer API
    const resList = await request(app)
      .get('/api/v1/customers')
      .query({ search: 'Kashif Mehmood' })
      .set(peshawarBmHeaders)

    assert.strictEqual(resList.status, 200)
    assert.ok(Array.isArray(resList.body))
    const found = resList.body.find(c => c.id === leadRow.customer_id)
    assert.ok(found, 'Customer must appear in customer list')
  })
})
