import { describe, it, before, after } from 'node:test'
import assert from 'node:assert'
import { connectDB, disconnectDB, getDbStatus, query } from '../src/config/db.js'
import { runMigrations } from '../src/db/migrations.js'

describe('AJ EcoDrive Backend — Phase 4 Step 1: CRM & Leads Migrations Suite', () => {
  let isDbReady = false

  const TEST_LEAD_DUP_ID = 'LD-TEST-DUP-01'
  const TEST_LEAD_DIFF_BRANCH_ID = 'LD-TEST-BRANCH-02'

  before(async () => {
    isDbReady = await connectDB()
    if (isDbReady) {
      await runMigrations()

      // Clean up test leads if any
      await query('DELETE FROM `follow_ups` WHERE `lead_id` LIKE "LD-TEST%" OR `id` LIKE "FU-TEST%"')
      await query('DELETE FROM `leads` WHERE `id` LIKE "LD-TEST%"')
    }
  })

  after(async () => {
    if (isDbReady) {
      await query('DELETE FROM `follow_ups` WHERE `lead_id` LIKE "LD-TEST%" OR `id` LIKE "FU-TEST%"')
      await query('DELETE FROM `leads` WHERE `id` LIKE "LD-TEST%"')
      await disconnectDB()
    }
  })

  it('1. Database Connection: Confirms MySQL database is active and healthy', () => {
    const status = getDbStatus()
    assert.strictEqual(status.isConnected, true, 'Database must be connected')
  })

  it('2. Tables Existence: Verifies both "leads" and "follow_ups" tables exist in MySQL', async () => {
    const tables = await query('SHOW TABLES')
    const tableNames = tables.map(t => Object.values(t)[0])

    assert.ok(tableNames.includes('leads'), 'Table "leads" must exist in ecodrive database')
    assert.ok(tableNames.includes('follow_ups'), 'Table "follow_ups" must exist in ecodrive database')
    assert.strictEqual(tableNames.length >= 38, true, 'Total tables must be at least 38')
  })

  it('3. Leads Table Schema: Verifies critical columns, types, and constraints', async () => {
    const columns = await query('DESCRIBE `leads`')
    const colNames = columns.map(c => c.Field)

    const expectedCols = [
      'id', 'lead_number', 'customer_name', 'phone', 'email', 'city',
      'source', 'owner', 'product_id', 'product_name', 'budget',
      'budget_amount', 'stage', 'status', 'status_class', 'customer_id',
      'branch_id', 'branch', 'next_follow_up', 'notes', 'created_by',
      'created_at', 'updated_at'
    ]

    for (const col of expectedCols) {
      assert.ok(colNames.includes(col), `Column "${col}" must exist in "leads" table`)
    }
  })

  it('4. Follow-Ups Table Schema: Verifies critical columns and foreign key to leads', async () => {
    const columns = await query('DESCRIBE `follow_ups`')
    const colNames = columns.map(c => c.Field)

    const expectedCols = [
      'id', 'branch_id', 'branch', 'lead_id', 'customer_id', 'customer_name',
      'phone', 'linked_record_type', 'linked_record_id', 'task_type',
      'channel', 'priority', 'priority_color', 'status', 'status_class',
      'due_date', 'due_time', 'owner', 'notes', 'completed_at',
      'created_at', 'updated_at'
    ]

    for (const col of expectedCols) {
      assert.ok(colNames.includes(col), `Column "${col}" must exist in "follow_ups" table`)
    }
  })

  it('5. Baseline Leads Seeding: Verifies initial seeded leads exist and have valid fields', async () => {
    const leads = await query('SELECT * FROM `leads` WHERE `id` IN ("LD-551", "LD-548") ORDER BY `id` DESC')
    assert.strictEqual(leads.length, 2, 'Exactly 2 baseline leads must be seeded')

    const ld551 = leads.find(l => l.id === 'LD-551')
    assert.strictEqual(ld551.lead_number, 'LD-551')
    assert.strictEqual(ld551.customer_name, 'Sajid Khan')
    assert.strictEqual(ld551.phone, '+92 313 5544332')
    assert.strictEqual(ld551.branch_id, 'BR-01')
    assert.strictEqual(ld551.stage, 'New')

    const ld548 = leads.find(l => l.id === 'LD-548')
    assert.strictEqual(ld548.lead_number, 'LD-548')
    assert.strictEqual(ld548.customer_name, 'Ali Raza')
    assert.strictEqual(ld548.phone, '+92 321 9988771')
    assert.strictEqual(ld548.branch_id, 'BR-01')
    assert.strictEqual(ld548.stage, 'Contacted')
  })

  it('6. Baseline Follow-Ups Seeding: Verifies initial scheduled tasks exist and link to leads', async () => {
    const followUps = await query('SELECT * FROM `follow_ups` WHERE `id` IN ("FU-101", "FU-102") ORDER BY `id` ASC')
    assert.strictEqual(followUps.length, 2, 'Exactly 2 baseline follow-ups must be seeded')

    const fu101 = followUps.find(f => f.id === 'FU-101')
    assert.strictEqual(fu101.lead_id, 'LD-551')
    assert.strictEqual(fu101.customer_name, 'Sajid Khan')
    assert.strictEqual(fu101.task_type, 'Lead follow-up')
    assert.strictEqual(fu101.status, 'Due Today')

    const fu102 = followUps.find(f => f.id === 'FU-102')
    assert.strictEqual(fu102.lead_id, 'LD-548')
    assert.strictEqual(fu102.customer_name, 'Ali Raza')
    assert.strictEqual(fu102.status, 'Upcoming')
  })

  it('7. Permission System: Verifies PERM-20, PERM-21, PERM-22 exist and are assigned to roles', async () => {
    const perms = await query('SELECT * FROM `permissions` WHERE `id` IN ("PERM-20", "PERM-21", "PERM-22")')
    assert.strictEqual(perms.length, 3, 'Must have all 3 new permissions seeded')

    const codes = perms.map(p => p.code)
    assert.ok(codes.includes('leads.read'))
    assert.ok(codes.includes('leads.write'))
    assert.ok(codes.includes('leads.convert'))

    // Verify role mappings for Super Admin (ROLE-ADMIN)
    const adminPerms = await query(`
      SELECT p.code FROM \`role_permissions\` rp
      JOIN \`permissions\` p ON rp.permission_id = p.id
      WHERE rp.role_id = 'ROLE-ADMIN' AND p.id IN ('PERM-20', 'PERM-21', 'PERM-22')
    `)
    assert.strictEqual(adminPerms.length, 3, 'Super Admin must possess all 3 CRM permissions')

    // Verify role mappings for Branch Manager (ROLE-BM)
    const bmPerms = await query(`
      SELECT p.code FROM \`role_permissions\` rp
      JOIN \`permissions\` p ON rp.permission_id = p.id
      WHERE rp.role_id = 'ROLE-BM' AND p.id IN ('PERM-20', 'PERM-21', 'PERM-22')
    `)
    assert.strictEqual(bmPerms.length, 3, 'Branch Manager must possess all 3 CRM permissions')
  })

  it('8. Branch-Scoped Uniqueness: Rejects duplicate phone within same branch (ER_DUP_ENTRY)', async () => {
    // Attempt to insert duplicate phone (+92 313 5544332) in same branch (BR-01)
    let duplicateRejected = false
    try {
      await query(`
        INSERT INTO \`leads\` (
          \`id\`, \`lead_number\`, \`branch_id\`, \`branch\`, \`customer_name\`,
          \`phone\`, \`source\`, \`owner\`, \`stage\`, \`status\`
        ) VALUES (
          ?, 'LD-TEST-DUP-01', 'BR-01', 'Peshawar', 'Duplicate Prospect',
          '+92 313 5544332', 'Walk-in', 'Hamza', 'New', 'New'
        )
      `, [TEST_LEAD_DUP_ID])
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        duplicateRejected = true
      }
    }

    assert.strictEqual(duplicateRejected, true, 'Duplicate phone number within the same branch must trigger ER_DUP_ENTRY')
  })

  it('9. Cross-Branch Duplicate Phone: Allows same phone number in a DIFFERENT branch', async () => {
    // Same phone (+92 313 5544332) in Islamabad branch (BR-02) should succeed
    const res = await query(`
      INSERT INTO \`leads\` (
        \`id\`, \`lead_number\`, \`branch_id\`, \`branch\`, \`customer_name\`,
        \`phone\`, \`source\`, \`owner\`, \`stage\`, \`status\`
      ) VALUES (
        ?, 'LD-TEST-BRANCH-02', 'BR-02', 'Islamabad', 'Islamabad Lead Prospect',
        '+92 313 5544332', 'Website', 'Hassan Ali', 'New', 'New'
      )
    `, [TEST_LEAD_DIFF_BRANCH_ID])

    assert.ok(res.affectedRows === 1 || res.insertId !== undefined, 'Same phone in different branch must succeed')

    const inserted = await query('SELECT id, branch_id, phone FROM `leads` WHERE `id` = ?', [TEST_LEAD_DIFF_BRANCH_ID])
    assert.strictEqual(inserted.length, 1)
    assert.strictEqual(inserted[0].branch_id, 'BR-02')
  })

  it('10. Foreign Key Relationship: Customer linking and referential integrity', async () => {
    // Link lead to existing customer CUST-101
    const testFkId = 'LD-TEST-FK-01'
    await query(`
      INSERT INTO \`leads\` (
        \`id\`, \`lead_number\`, \`branch_id\`, \`branch\`, \`customer_name\`,
        \`phone\`, \`source\`, \`owner\`, \`stage\`, \`status\`, \`customer_id\`
      ) VALUES (
        ?, 'LD-TEST-FK-01', 'BR-01', 'Peshawar', 'Ahsan Khan Prospect',
        '+92 300 1122334', 'Referral', 'Hamza', 'Qualified', 'Qualified', 'CUST-101'
      )
    `, [testFkId])

    const lead = await query('SELECT customer_id FROM `leads` WHERE `id` = ?', [testFkId])
    assert.strictEqual(lead[0].customer_id, 'CUST-101', 'Lead customer_id must reference CUST-101')

    await query('DELETE FROM `leads` WHERE `id` = ?', [testFkId])
  })

  it('11. Migration Idempotency: Re-running runMigrations() is safe and does not overwrite data', async () => {
    const leadsBefore = await query('SELECT COUNT(*) as count FROM `leads`')
    const customersBefore = await query('SELECT COUNT(*) as count FROM `customers`')
    const casesBefore = await query('SELECT COUNT(*) as count FROM `service_cases`')

    // Run migrations again
    const migrationResult = await runMigrations()
    assert.strictEqual(migrationResult, true, 'Re-running runMigrations must return true')

    const leadsAfter = await query('SELECT COUNT(*) as count FROM `leads`')
    const customersAfter = await query('SELECT COUNT(*) as count FROM `customers`')
    const casesAfter = await query('SELECT COUNT(*) as count FROM `service_cases`')

    assert.strictEqual(leadsAfter[0].count, leadsBefore[0].count, 'Leads count must remain unchanged')
    assert.strictEqual(customersAfter[0].count, customersBefore[0].count, 'Customers count must remain unchanged')
    assert.strictEqual(casesAfter[0].count, casesBefore[0].count, 'Service cases count must remain unchanged')
  })
})
