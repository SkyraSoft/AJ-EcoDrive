import { describe, it, before, after } from 'node:test'
import assert from 'node:assert'
import request from 'supertest'
import { app } from '../src/app.js'
import { connectDB, disconnectDB, getDbStatus, query } from '../src/config/db.js'
import { runMigrations } from '../src/db/migrations.js'
import { getAdminAuthHeader, getBranchManagerAuthHeader, getTechnicianAuthHeader } from './helpers/auth.helper.js'

describe('AJ EcoDrive Backend — CRM & Leads Module REAL MySQL Integration Suite', () => {
  let isDbReady = false

  const adminHeaders = getAdminAuthHeader()
  const peshawarBmHeaders = getBranchManagerAuthHeader('BR-01', 'Peshawar')
  const islamabadBmHeaders = getBranchManagerAuthHeader('BR-02', 'Islamabad')
  const technicianHeaders = getTechnicianAuthHeader('BR-01', 'Peshawar') // Lacks leads.write

  const TEST_LEAD_ID = 'LD-TEST-7001'
  const TEST_ISB_LEAD_ID = 'LD-TEST-ISB-7001'
  const TEST_CONC_PHONE = '03459988111'
  const TEST_FOLLOW_UP_ID = 'FU-TEST-7001'

  before(async () => {
    isDbReady = await connectDB()
    if (isDbReady) {
      await runMigrations()

      // Clean up previous test artifacts
      await query('DELETE FROM `follow_ups` WHERE `id` LIKE "FU-TEST%" OR `lead_id` LIKE "LD-TEST%"')
      await query('DELETE FROM `leads` WHERE `id` LIKE "LD-TEST%" OR `phone` IN ("+92 300 1234567", "+92 345 9988111")')
    }
  })

  after(async () => {
    if (isDbReady) {
      // Clean up test records
      await query('DELETE FROM `follow_ups` WHERE `id` LIKE "FU-TEST%" OR `lead_id` LIKE "LD-TEST%"')
      await query('DELETE FROM `leads` WHERE `id` LIKE "LD-TEST%" OR `phone` IN ("+92 300 1234567", "+92 345 9988111")')
      await disconnectDB()
    }
  })

  // 1. Database Connection & Tables
  it('1. Verifies MySQL database connection and CRM tables exist', async () => {
    const status = getDbStatus()
    assert.strictEqual(status.isConnected, true, 'Real MySQL connection must be active')

    const tables = await query('SHOW TABLES')
    const tableNames = tables.map(t => Object.values(t)[0])
    assert.ok(tableNames.includes('leads'), 'Table "leads" must exist in ecodrive')
    assert.ok(tableNames.includes('follow_ups'), 'Table "follow_ups" must exist in ecodrive')
  })

  // 2. Authentication Enforcement (401)
  it('2. Authentication: Rejects unauthenticated requests and invalid tokens with 401', async () => {
    // Missing token
    const res1 = await request(app).get('/api/v1/leads')
    assert.strictEqual(res1.status, 401)
    assert.strictEqual(res1.body.ok, false)

    const res2 = await request(app).get('/api/v1/follow-ups')
    assert.strictEqual(res2.status, 401)

    // Malformed token
    const res3 = await request(app)
      .get('/api/v1/leads')
      .set('Authorization', 'InvalidFormat')
    assert.strictEqual(res3.status, 401)

    // Invalid signature token
    const res4 = await request(app)
      .get('/api/v1/leads')
      .set('Authorization', 'Bearer invalid.token.value')
    assert.strictEqual(res4.status, 401)
  })

  // 3. Authorization Permissions Guardrail (403)
  it('3. Permissions: Rejects unauthorized user role lacking "leads.write" with 403', async () => {
    // Technician has only after_sales permissions, lacks leads.write
    const resLead = await request(app)
      .post('/api/v1/leads')
      .set(technicianHeaders)
      .send({
        customer_name: 'Unauthorized Prospect',
        phone: '03112233445'
      })
    assert.strictEqual(resLead.status, 403)
    assert.strictEqual(resLead.body.error, 'FORBIDDEN')

    const resFollowUp = await request(app)
      .post('/api/v1/follow-ups')
      .set(technicianHeaders)
      .send({
        customer_name: 'Unauthorized Prospect',
        phone: '03112233445'
      })
    assert.strictEqual(resFollowUp.status, 403)
    assert.strictEqual(resFollowUp.body.error, 'FORBIDDEN')
  })

  // 4. Lead Validation (400)
  it('4. Lead Validation: Rejects missing customer, missing phone, or invalid stages with 400', async () => {
    // Missing customer
    const res1 = await request(app)
      .post('/api/v1/leads')
      .set(peshawarBmHeaders)
      .send({ phone: '03001234567' })
    assert.strictEqual(res1.status, 400)
    assert.strictEqual(res1.body.error, 'VALIDATION_ERROR')

    // Missing phone
    const res2 = await request(app)
      .post('/api/v1/leads')
      .set(peshawarBmHeaders)
      .send({ customer_name: 'No Phone Customer' })
    assert.strictEqual(res2.status, 400)
    assert.strictEqual(res2.body.error, 'VALIDATION_ERROR')

    // Invalid phone length
    const res3 = await request(app)
      .post('/api/v1/leads')
      .set(peshawarBmHeaders)
      .send({ customer_name: 'Short Phone', phone: '12345' })
    assert.strictEqual(res3.status, 400)
    assert.strictEqual(res3.body.error, 'VALIDATION_ERROR')

    // Invalid stage
    const res4 = await request(app)
      .post('/api/v1/leads')
      .set(peshawarBmHeaders)
      .send({ customer_name: 'Invalid Stage Lead', phone: '03001234567', stage: 'NonExistentStage' })
    assert.strictEqual(res4.status, 400)
    assert.strictEqual(res4.body.error, 'VALIDATION_ERROR')

    // Invalid source
    const res5 = await request(app)
      .post('/api/v1/leads')
      .set(peshawarBmHeaders)
      .send({ customer_name: 'Invalid Source Lead', phone: '03001234567', source: 'AlienSatellite' })
    assert.strictEqual(res5.status, 400)
    assert.strictEqual(res5.body.error, 'VALIDATION_ERROR')
  })

  // 5. Lead Creation & Phone Normalization (201)
  it('5. Lead Creation: Creates lead with local phone format and normalizes to canonical +92', async () => {
    const res = await request(app)
      .post('/api/v1/leads')
      .set(peshawarBmHeaders)
      .send({
        id: TEST_LEAD_ID,
        lead_number: TEST_LEAD_ID,
        customer_name: 'Kashif Mehmood',
        phone: '03001234567', // Local 11-digit zero format
        email: 'kashif.m@example.com',
        city: 'Peshawar',
        source: 'Walk-in',
        owner: 'Hamza Ali',
        product: 'BRG X7',
        budget: 'PKR 350,000',
        stage: 'New',
        notes: 'Interested in Lithium 72V version for commute.'
      })

    assert.strictEqual(res.status, 201)
    assert.strictEqual(res.body.ok, true)
    assert.strictEqual(res.body.lead.phone, '+92 300 1234567', 'Phone must be normalized to canonical "+92 300 1234567"')
    assert.strictEqual(res.body.lead.branch_id, 'BR-01')
    assert.strictEqual(res.body.lead.rawBudget, 350000)

    // Verify row was written to MySQL
    const rows = await query('SELECT * FROM `leads` WHERE `id` = ?', [TEST_LEAD_ID])
    assert.strictEqual(rows.length, 1)
    assert.strictEqual(rows[0].phone, '+92 300 1234567')
    assert.strictEqual(rows[0].customer_name, 'Kashif Mehmood')
  })

  // 6. Same-Branch Duplicate Phone Rejection (409 Conflict)
  it('6. Duplicate Prevention: Rejects creating another lead with identical phone in the same branch (409)', async () => {
    const res = await request(app)
      .post('/api/v1/leads')
      .set(peshawarBmHeaders)
      .send({
        customer_name: 'Duplicate Prospect Attempt',
        phone: '03001234567' // Exactly same phone
      })

    assert.strictEqual(res.status, 409)
    assert.strictEqual(res.body.error, 'CONFLICT')
    assert.ok(res.body.message.includes('already exists'), 'Conflict message must mention duplicate phone')
  })

  // 7. Equivalent Phone Formats Normalization & Conflict Rejection (409)
  it('7. Phone Format Equivalence: Formats with hyphens, international prefix, or spaces resolve to same duplicate (409)', async () => {
    // Format A: with hyphens "0300-1234567"
    const resA = await request(app)
      .post('/api/v1/leads')
      .set(peshawarBmHeaders)
      .send({
        customer_name: 'Hyphen Format Attempt',
        phone: '0300-1234567'
      })
    assert.strictEqual(resA.status, 409)
    assert.strictEqual(resA.body.error, 'CONFLICT')

    // Format B: full international with spaces "+92 300 1234567"
    const resB = await request(app)
      .post('/api/v1/leads')
      .set(peshawarBmHeaders)
      .send({
        customer_name: 'International Format Attempt',
        phone: '+92 300 1234567'
      })
    assert.strictEqual(resB.status, 409)
    assert.strictEqual(resB.body.error, 'CONFLICT')

    // Format C: international without spaces "923001234567"
    const resC = await request(app)
      .post('/api/v1/leads')
      .set(peshawarBmHeaders)
      .send({
        customer_name: 'Prefix 92 Attempt',
        phone: '923001234567'
      })
    assert.strictEqual(resC.status, 409)
    assert.strictEqual(resC.body.error, 'CONFLICT')
  })

  // 8. Cross-Branch Duplicate Phone Allowance (201)
  it('8. Cross-Branch Isolation: Allows identical phone number to be registered in a DIFFERENT branch (201)', async () => {
    // Islamabad BM creates lead with same phone "03001234567"
    const res = await request(app)
      .post('/api/v1/leads')
      .set(islamabadBmHeaders)
      .send({
        id: TEST_ISB_LEAD_ID,
        lead_number: TEST_ISB_LEAD_ID,
        customer_name: 'Islamabad Prospect',
        phone: '0300-1234567',
        branch_id: 'BR-02',
        source: 'Website',
        owner: 'Hassan Ali'
      })

    assert.strictEqual(res.status, 201)
    assert.strictEqual(res.body.ok, true)
    assert.strictEqual(res.body.lead.phone, '+92 300 1234567')
    assert.strictEqual(res.body.lead.branch_id, 'BR-02')

    // Verify both rows exist simultaneously in MySQL with different branches
    const rows = await query('SELECT id, branch_id, phone FROM `leads` WHERE `phone` = "+92 300 1234567"')
    assert.strictEqual(rows.length, 2, 'Two distinct branch records must coexist with the same normalized phone')
  })

  // 9. Concurrent Duplicate Lead Creation Race-Condition Guard (409)
  it('9. Concurrency: Concurrent requests with identical phone in same branch results in exactly one 201 and one 409', async () => {
    const [resA, resB] = await Promise.all([
      request(app)
        .post('/api/v1/leads')
        .set(peshawarBmHeaders)
        .send({
          id: 'LD-TEST-CONC-A',
          customer_name: 'Concurrent Prospect Alpha',
          phone: TEST_CONC_PHONE // '03459988111'
        }),
      request(app)
        .post('/api/v1/leads')
        .set(peshawarBmHeaders)
        .send({
          id: 'LD-TEST-CONC-B',
          customer_name: 'Concurrent Prospect Beta',
          phone: '+92-345-9988111' // Equivalent phone with formatting
        })
    ])

    const statuses = [resA.status, resB.status]
    assert.ok(statuses.includes(201), `Exactly one concurrent request must succeed with 201. Got: ${statuses.join(', ')}`)
    assert.ok(statuses.includes(409), `The competing request must be rejected with 409 Conflict. Got: ${statuses.join(', ')}`)

    // Verify exactly one record exists in MySQL
    const count = await query('SELECT COUNT(*) as count FROM `leads` WHERE `phone` = "+92 345 9988111" AND `branch_id` = "BR-01"')
    assert.strictEqual(parseInt(count[0].count, 10), 1, 'Only one record must be inserted in database')
  })

  // 10. Lead Retrieval & Branch Scoping (200 / 403)
  it('10. Branch Scoping: Peshawar BM sees Peshawar leads; access to Islamabad lead returns 403', async () => {
    // Peshawar BM retrieves list -> should include TEST_LEAD_ID and NOT TEST_ISB_LEAD_ID
    const listRes = await request(app)
      .get('/api/v1/leads')
      .set(peshawarBmHeaders)

    assert.strictEqual(listRes.status, 200)
    assert.ok(Array.isArray(listRes.body))
    const ids = listRes.body.map(l => l.id)
    assert.ok(ids.includes(TEST_LEAD_ID))
    assert.ok(!ids.includes(TEST_ISB_LEAD_ID), 'Peshawar manager must not see Islamabad lead in list')

    // Peshawar BM attempts to get single Islamabad lead by ID -> 403 Forbidden
    const getIsbRes = await request(app)
      .get(`/api/v1/leads/${TEST_ISB_LEAD_ID}`)
      .set(peshawarBmHeaders)
    assert.strictEqual(getIsbRes.status, 403)
    assert.strictEqual(getIsbRes.body.error, 'FORBIDDEN')

    // Super Admin can freely view Islamabad lead
    const adminGet = await request(app)
      .get(`/api/v1/leads/${TEST_ISB_LEAD_ID}`)
      .set(adminHeaders)
    assert.strictEqual(adminGet.status, 200)
    assert.strictEqual(adminGet.body.id, TEST_ISB_LEAD_ID)
  })

  // 11. Lead Update & Duplicate Guardrail (200 / 409)
  it('11. Lead Update: Modifies lead attributes; duplicate phone modification returns 409', async () => {
    // 1. Valid update
    const updateRes = await request(app)
      .put(`/api/v1/leads/${TEST_LEAD_ID}`)
      .set(peshawarBmHeaders)
      .send({
        stage: 'Qualified',
        budget: 'PKR 400,000',
        notes: 'Customer budget confirmed. Ready for test drive.'
      })

    assert.strictEqual(updateRes.status, 200)
    assert.strictEqual(updateRes.body.lead.stage, 'Qualified')
    assert.strictEqual(updateRes.body.lead.rawBudget, 400000)

    // 2. Attempt to update phone to another existing lead's phone in Peshawar (LD-551 phone: +92 313 5544332)
    const conflictUpdate = await request(app)
      .put(`/api/v1/leads/${TEST_LEAD_ID}`)
      .set(peshawarBmHeaders)
      .send({
        phone: '0313 5544332' // Conflicts with LD-551
      })

    assert.strictEqual(conflictUpdate.status, 409)
    assert.strictEqual(conflictUpdate.body.error, 'CONFLICT')
  })

  // 12. Follow-Up Validation (400)
  it('12. Follow-Up Validation: Rejects missing customer name or invalid status with 400', async () => {
    // Missing customer
    const res1 = await request(app)
      .post('/api/v1/follow-ups')
      .set(peshawarBmHeaders)
      .send({ task_type: 'Lead follow-up' })
    assert.strictEqual(res1.status, 400)
    assert.strictEqual(res1.body.error, 'VALIDATION_ERROR')

    // Invalid status
    const res2 = await request(app)
      .post('/api/v1/follow-ups')
      .set(peshawarBmHeaders)
      .send({
        customer: 'Sajid Khan',
        status: 'BogusStatus'
      })
    assert.strictEqual(res2.status, 400)
    assert.strictEqual(res2.body.error, 'VALIDATION_ERROR')
  })

  // 13. Follow-Up Creation & Linkage (201)
  it('13. Follow-Up Creation: Schedules follow-up linked to authorized branch lead', async () => {
    const res = await request(app)
      .post('/api/v1/follow-ups')
      .set(peshawarBmHeaders)
      .send({
        id: TEST_FOLLOW_UP_ID,
        lead_id: TEST_LEAD_ID,
        customer_name: 'Kashif Mehmood',
        phone: '+92 300 1234567',
        task_type: 'Phone Call',
        priority: 'High',
        due_time: '15:30',
        owner: 'Hamza Ali',
        notes: 'Confirm test drive booking for BRG X7.'
      })

    assert.strictEqual(res.status, 201)
    assert.strictEqual(res.body.ok, true)
    assert.strictEqual(res.body.followUp.customer, 'Kashif Mehmood')
    assert.strictEqual(res.body.followUp.lead_id, TEST_LEAD_ID)
    assert.strictEqual(res.body.followUp.branch_id, 'BR-01')
    assert.strictEqual(res.body.followUp.status, 'Due Today')

    // Verify row in MySQL
    const rows = await query('SELECT * FROM `follow_ups` WHERE `id` = ?', [TEST_FOLLOW_UP_ID])
    assert.strictEqual(rows.length, 1)
    assert.strictEqual(rows[0].lead_id, TEST_LEAD_ID)
  })

  // 14. Cross-Branch Entity Linkage Rejection (400 / 403)
  it('14. Cross-Branch Reference: Rejects linking follow-up to a lead belonging to another branch', async () => {
    // Peshawar BM attempts to schedule follow-up linked to Islamabad lead TEST_ISB_LEAD_ID
    const res = await request(app)
      .post('/api/v1/follow-ups')
      .set(peshawarBmHeaders)
      .send({
        customer_name: 'Cross Branch Prospect',
        lead_id: TEST_ISB_LEAD_ID // Belongs to BR-02
      })

    assert.strictEqual(res.status, 400)
    assert.strictEqual(res.body.error, 'CROSS_BRANCH_REFERENCE')

    // Peshawar BM attempts to explicitly specify branch_id = 'BR-02'
    const resBranch = await request(app)
      .post('/api/v1/follow-ups')
      .set(peshawarBmHeaders)
      .send({
        customer_name: 'Unauthorized Branch Creation',
        branch_id: 'BR-02'
      })
    assert.strictEqual(resBranch.status, 403)
    assert.strictEqual(resBranch.body.error, 'FORBIDDEN')
  })

  // 15. Follow-Up Retrieval & Branch Isolation (200 / 403)
  it('15. Follow-Up Branch Scoping: Islamabad BM cannot view Peshawar follow-up (403)', async () => {
    // Islamabad BM attempts to view Peshawar follow-up
    const resForbidden = await request(app)
      .get(`/api/v1/follow-ups/${TEST_FOLLOW_UP_ID}`)
      .set(islamabadBmHeaders)

    assert.strictEqual(resForbidden.status, 403)
    assert.strictEqual(resForbidden.body.error, 'FORBIDDEN')

    // Peshawar BM can view own follow-up
    const resOk = await request(app)
      .get(`/api/v1/follow-ups/${TEST_FOLLOW_UP_ID}`)
      .set(peshawarBmHeaders)

    assert.strictEqual(resOk.status, 200)
    assert.strictEqual(resOk.body.id, TEST_FOLLOW_UP_ID)
  })

  // 16. Follow-Up Completion & Status Update (200)
  it('16. Follow-Up Completion: Marks task completed with timestamp in MySQL', async () => {
    const res = await request(app)
      .post(`/api/v1/follow-ups/${TEST_FOLLOW_UP_ID}/complete`)
      .set(peshawarBmHeaders)

    assert.strictEqual(res.status, 200)
    assert.strictEqual(res.body.ok, true)
    assert.strictEqual(res.body.followUp.status, 'Completed')
    assert.strictEqual(res.body.followUp.statusClass, 'bg-[#dcfce7] text-[#165A31]')
    assert.ok(res.body.followUp.completedAt !== null)

    // Verify row in MySQL has completed_at timestamp
    const rows = await query('SELECT status, completed_at FROM `follow_ups` WHERE `id` = ?', [TEST_FOLLOW_UP_ID])
    assert.strictEqual(rows[0].status, 'Completed')
    assert.ok(rows[0].completed_at !== null)
  })

  // 17. Cascading Integrity
  it('17. Cascading Deletion: Deleting test lead cascades to linked follow-up records', async () => {
    // Delete test lead TEST_LEAD_ID
    const delRes = await request(app)
      .delete(`/api/v1/leads/${TEST_LEAD_ID}`)
      .set(peshawarBmHeaders)
    assert.strictEqual(delRes.status, 200)

    // Verify linked follow-up TEST_FOLLOW_UP_ID was cascade-deleted by foreign key fk_followup_lead
    const fuRows = await query('SELECT * FROM `follow_ups` WHERE `id` = ?', [TEST_FOLLOW_UP_ID])
    assert.strictEqual(fuRows.length, 0, 'Follow-up must be cascade deleted when parent lead is deleted')
  })
})
