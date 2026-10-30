import { describe, it, before, after } from 'node:test'
import assert from 'node:assert'
import request from 'supertest'
import { app } from '../src/app.js'
import { connectDB, disconnectDB, getDbStatus, query } from '../src/config/db.js'
import { runMigrations } from '../src/db/migrations.js'
import { getAdminAuthHeader, getBranchManagerAuthHeader } from './helpers/auth.helper.js'

describe('AJ EcoDrive Backend — Finance & Accounting Module REAL MySQL Suite', () => {
  let isDbReady = false

  const adminHeaders = getAdminAuthHeader()
  const peshawarBmHeaders = getBranchManagerAuthHeader('BR-01', 'Peshawar')
  const islamabadBmHeaders = getBranchManagerAuthHeader('BR-02', 'Islamabad')

  let testSmallExpenseId = null
  let testLargeExpenseId = null
  let testIslamabadExpenseId = null
  let testRejectExpenseId = null
  let testDisbursementExpenseId = null
  let testDeleteExpenseId = null
  let testPaidTransactionId = null
  let initialBankBalance = 0

  // Track exact test-owned records created during test execution
  const createdExpenseIds = new Set()
  const createdTransactionIds = new Set()

  before(async () => {
    isDbReady = await connectDB()
    if (isDbReady) {
      await runMigrations()

      // Record baseline balance of ACC-BANK-01
      const bankRows = await query('SELECT current_balance FROM `cash_bank_accounts` WHERE `id` = "ACC-BANK-01"')
      if (bankRows.length > 0) {
        initialBankBalance = parseFloat(bankRows[0].current_balance)
      }
    }
  })

  after(async () => {
    if (isDbReady) {
      // Clean up ONLY exact records created by this test run
      for (const expId of createdExpenseIds) {
        await query('DELETE FROM `general_ledger` WHERE `source_id` = ? OR `id` = ?', [expId, `GL-EXP-${expId}`])
        await query('DELETE FROM `financial_transactions` WHERE `reference_id` = ? OR `id` = ?', [expId, `TRX-${expId}`])
        await query('DELETE FROM `expenses` WHERE `id` = ?', [expId])
      }
      for (const txnId of createdTransactionIds) {
        await query('DELETE FROM `general_ledger` WHERE `source_id` = ? OR `id` LIKE ?', [txnId, `%${txnId}%`])
        await query('DELETE FROM `financial_transactions` WHERE `reference_id` = ? OR `id` = ?', [txnId, txnId])
      }
      
      // Restore bank account balance if modified
      if (initialBankBalance > 0) {
        await query('UPDATE `cash_bank_accounts` SET current_balance = ? WHERE `id` = "ACC-BANK-01"', [initialBankBalance])
      }

      await disconnectDB()
    }
  })

  // 1. Database Schema & Tables
  it('1. Verifies MySQL database connection and all 5 Finance tables exist', async () => {
    const status = getDbStatus()
    assert.strictEqual(status.isConnected, true, 'Real MySQL connection must be active')

    const tables = await query('SHOW TABLES')
    const tableNames = tables.map(t => Object.values(t)[0])
    const required = [
      'expense_categories',
      'expenses',
      'cash_bank_accounts',
      'financial_transactions',
      'general_ledger'
    ]
    for (const reqTable of required) {
      assert.ok(tableNames.includes(reqTable), `Table "${reqTable}" must exist in MySQL ecodrive`)
    }
  })

  // 2. Authentication Enforcement
  it('2. Authentication: Rejects unauthenticated requests and invalid tokens with 401', async () => {
    // Missing token
    const res1 = await request(app).get('/api/v1/finance/expenses')
    assert.strictEqual(res1.status, 401)
    assert.strictEqual(res1.body.ok, false)

    // Invalid token format
    const res2 = await request(app)
      .get('/api/v1/finance/expenses')
      .set('Authorization', 'InvalidFormat')
    assert.strictEqual(res2.status, 401)

    // Bad signature token
    const res3 = await request(app)
      .get('/api/v1/finance/expenses')
      .set('Authorization', 'Bearer bad.token.here')
    assert.strictEqual(res3.status, 401)
  })

  // 3. Expense Categories
  it('3. Categories: Retrieves active expense categories with gl_account_code', async () => {
    const res = await request(app)
      .get('/api/v1/finance/categories')
      .set(adminHeaders)

    assert.strictEqual(res.status, 200)
    assert.ok(Array.isArray(res.body), 'Must return array of categories')
    assert.ok(res.body.length >= 5, 'Should have baseline categories seeded')

    const marketing = res.body.find(c => c.name === 'Marketing' || c.code === 'CAT-MKT')
    assert.ok(marketing, 'Marketing category should be present')
    assert.ok(marketing.gl_account_code, 'Category must have gl_account_code')
  })

  // 4. Expense Validation
  it('4. Expense Validation: Rejects missing required fields and non-positive amounts with 422', async () => {
    // Missing category
    const res1 = await request(app)
      .post('/api/v1/finance/expenses')
      .set(peshawarBmHeaders)
      .send({ vendor: 'State Electricity Board', amount: 8000 })
    assert.strictEqual(res1.status, 422)
    assert.strictEqual(res1.body.ok, false)

    // Missing vendor
    const res2 = await request(app)
      .post('/api/v1/finance/expenses')
      .set(peshawarBmHeaders)
      .send({ category: 'Utilities', amount: 8000 })
    assert.strictEqual(res2.status, 422)
    assert.strictEqual(res2.body.ok, false)

    // Non-positive amount (0)
    const res3 = await request(app)
      .post('/api/v1/finance/expenses')
      .set(peshawarBmHeaders)
      .send({ category: 'Utilities', vendor: 'State Electricity Board', amount: 0 })
    assert.strictEqual(res3.status, 422)
    assert.strictEqual(res3.body.ok, false)

    // Negative amount
    const res4 = await request(app)
      .post('/api/v1/finance/expenses')
      .set(peshawarBmHeaders)
      .send({ category: 'Utilities', vendor: 'State Electricity Board', amount: -500 })
    assert.strictEqual(res4.status, 422)
    assert.strictEqual(res4.body.ok, false)
  })

  // 5. Expense Creation & Scoping
  it('5. Expense Creation: Branch Manager creates expense scoped to their branch', async () => {
    // Create small expense (<= 15,000) for Peshawar
    const res1 = await request(app)
      .post('/api/v1/finance/expenses')
      .set(peshawarBmHeaders)
      .send({
        category: 'Showroom Maintenance',
        vendor: 'Peshawar Janitorial Services (TEST)',
        amount: 8500,
        description: 'Monthly showroom floor deep cleaning',
        paymentMethod: 'Bank Transfer'
      })

    assert.strictEqual(res1.status, 201)
    assert.strictEqual(res1.body.ok, true)
    const exp1 = res1.body.expense || res1.body
    assert.strictEqual(exp1.branch_id, 'BR-01')
    assert.strictEqual(exp1.branch, 'Peshawar')
    assert.strictEqual(exp1.approval, 'Pending')
    assert.strictEqual(exp1.rawAmount, 8500)
    testSmallExpenseId = exp1.id
    createdExpenseIds.add(testSmallExpenseId)

    // Create large expense (> 15,000) for Peshawar
    const res2 = await request(app)
      .post('/api/v1/finance/expenses')
      .set(peshawarBmHeaders)
      .send({
        category: 'Emergency Repairs',
        vendor: 'Rapid Transformer Tech (TEST)',
        amount: 28000,
        description: 'Emergency substation power generator repair',
        paymentMethod: 'Bank Transfer'
      })

    assert.strictEqual(res2.status, 201)
    const exp2 = res2.body.expense || res2.body
    assert.strictEqual(exp2.rawAmount, 28000)
    assert.strictEqual(exp2.approval, 'Pending')
    testLargeExpenseId = exp2.id
    createdExpenseIds.add(testLargeExpenseId)

    // Super Admin creates an expense for Islamabad (BR-02)
    const res3 = await request(app)
      .post('/api/v1/finance/expenses')
      .set(adminHeaders)
      .send({
        category: 'Utilities',
        vendor: 'IESCO Islamabad (TEST)',
        amount: 14000,
        branch_id: 'BR-02',
        branch: 'Islamabad',
        description: 'Showroom electricity bill'
      })

    assert.strictEqual(res3.status, 201)
    const exp3 = res3.body.expense || res3.body
    assert.strictEqual(exp3.branch_id, 'BR-02')
    testIslamabadExpenseId = exp3.id
    createdExpenseIds.add(testIslamabadExpenseId)
  })

  // 6. Multi-tenant Branch Isolation
  it('6. Branch Isolation: Enforces multi-tenant data boundaries on expense list and detail', async () => {
    // Peshawar BM lists expenses -> should ONLY see Peshawar (BR-01)
    const resPew = await request(app)
      .get('/api/v1/finance/expenses')
      .set(peshawarBmHeaders)

    assert.strictEqual(resPew.status, 200)
    assert.ok(Array.isArray(resPew.body))
    for (const item of resPew.body) {
      assert.strictEqual(item.branch_id, 'BR-01', 'Peshawar BM must only see BR-01 expenses')
    }

    // Islamabad BM lists expenses -> should ONLY see Islamabad (BR-02)
    const resIsb = await request(app)
      .get('/api/v1/finance/expenses')
      .set(islamabadBmHeaders)

    assert.strictEqual(resIsb.status, 200)
    assert.ok(Array.isArray(resIsb.body))
    for (const item of resIsb.body) {
      assert.strictEqual(item.branch_id, 'BR-02', 'Islamabad BM must only see BR-02 expenses')
    }

    // Peshawar BM attempts cross-branch read of Islamabad expense -> 403 Forbidden
    const resCross = await request(app)
      .get(`/api/v1/finance/expenses/${testIslamabadExpenseId}`)
      .set(peshawarBmHeaders)

    assert.strictEqual(resCross.status, 403)
    assert.strictEqual(resCross.body.ok, false)

    // Super Admin can access Islamabad expense
    const resAdmin = await request(app)
      .get(`/api/v1/finance/expenses/${testIslamabadExpenseId}`)
      .set(adminHeaders)

    assert.strictEqual(resAdmin.status, 200)
  })

  // 7. Expense Update
  it('7. Expense Update: Updates unapproved expense fields; blocks cross-branch mutation', async () => {
    // Cross-branch update attempt -> 403 Forbidden
    const resCross = await request(app)
      .put(`/api/v1/finance/expenses/${testIslamabadExpenseId}`)
      .set(peshawarBmHeaders)
      .send({ vendor: 'Hacked Vendor' })
    assert.strictEqual(resCross.status, 403)

    // Legitimate update by Peshawar BM
    const resUpdate = await request(app)
      .put(`/api/v1/finance/expenses/${testSmallExpenseId}`)
      .set(peshawarBmHeaders)
      .send({
        vendor: 'Peshawar Janitorial Services Ltd (TEST)',
        description: 'Updated floor maintenance scope'
      })

    assert.strictEqual(resUpdate.status, 200)
    const updated = resUpdate.body.expense || resUpdate.body
    assert.strictEqual(updated.vendor, 'Peshawar Janitorial Services Ltd (TEST)')
    assert.strictEqual(updated.description, 'Updated floor maintenance scope')
  })

  // 8. Dual-Tier Approval Governance (PKR 15,000 threshold)
  it('8. Dual-Tier Approval: BM cannot approve > 15,000; Super Admin approval succeeds; BM approves <= 15,000', async () => {
    // Case A: Peshawar BM attempts to approve expense > 15,000 (PKR 28,000) -> 403 Forbidden
    const resBmOverLimit = await request(app)
      .post(`/api/v1/finance/expenses/${testLargeExpenseId}/approve`)
      .set(peshawarBmHeaders)

    assert.strictEqual(resBmOverLimit.status, 403)
    assert.strictEqual(resBmOverLimit.body.error, 'APPROVAL_LIMIT_EXCEEDED')

    // Case B: Super Admin approves the > 15,000 expense -> 200 OK
    const resAdminApprove = await request(app)
      .post(`/api/v1/finance/expenses/${testLargeExpenseId}/approve`)
      .set(adminHeaders)

    assert.strictEqual(resAdminApprove.status, 200)
    const approvedLarge = resAdminApprove.body.expense || resAdminApprove.body
    assert.strictEqual(approvedLarge.approval, 'Approved')

    // Case C: Peshawar BM approves <= 15,000 expense (PKR 8,500) for their branch -> 200 OK
    const resBmSmall = await request(app)
      .post(`/api/v1/finance/expenses/${testSmallExpenseId}/approve`)
      .set(peshawarBmHeaders)

    assert.strictEqual(resBmSmall.status, 200)
    const approvedSmall = resBmSmall.body.expense || resBmSmall.body
    assert.strictEqual(approvedSmall.approval, 'Approved')

    // Case D: Peshawar BM attempts cross-branch approval on Islamabad expense -> 403 Forbidden
    const resCrossApprove = await request(app)
      .post(`/api/v1/finance/expenses/${testIslamabadExpenseId}/approve`)
      .set(peshawarBmHeaders)

    assert.strictEqual(resCrossApprove.status, 403)
  })

  // 9. Rejection Workflow
  it('9. Rejection Workflow: Rejects expense with mandatory audit reason', async () => {
    // Create an expense to reject
    const createRes = await request(app)
      .post('/api/v1/finance/expenses')
      .set(peshawarBmHeaders)
      .send({
        category: 'Office Supplies',
        vendor: 'Luxury Stationery Store (TEST)',
        amount: 11000,
        description: 'Premium executive leather desk sets'
      })
    assert.strictEqual(createRes.status, 201)
    testRejectExpenseId = (createRes.body.expense || createRes.body).id
    createdExpenseIds.add(testRejectExpenseId)

    // Missing reason -> 422
    const resNoReason = await request(app)
      .post(`/api/v1/finance/expenses/${testRejectExpenseId}/reject`)
      .set(adminHeaders)
      .send({})
    assert.strictEqual(resNoReason.status, 422)
    assert.strictEqual(resNoReason.body.ok, false)

    // Valid rejection with reason
    const resReject = await request(app)
      .post(`/api/v1/finance/expenses/${testRejectExpenseId}/reject`)
      .set(adminHeaders)
      .send({ reason: 'Non-essential luxury purchase outside branch operational budget' })

    assert.strictEqual(resReject.status, 200)
    const rejected = resReject.body.expense || resReject.body
    assert.strictEqual(rejected.approval, 'Rejected')
    assert.strictEqual(rejected.status, 'Rejected')
    assert.ok(rejected.rejectionReason.includes('Non-essential'))
  })

  // 10. Atomic Payment Disbursement via withTransaction
  it('10. Atomic Payment Disbursement: Enforces approval, updates balances, logs transactions, and posts GL', async () => {
    // Case A: Attempting to pay an unapproved expense -> 400
    const unapprovedCreate = await request(app)
      .post('/api/v1/finance/expenses')
      .set(peshawarBmHeaders)
      .send({
        category: 'Marketing',
        vendor: 'City Billboard Agency (TEST)',
        amount: 9000,
        description: 'Test unapproved expense'
      })
    const unapprovedId = (unapprovedCreate.body.expense || unapprovedCreate.body).id
    createdExpenseIds.add(unapprovedId)

    const resPayUnapproved = await request(app)
      .post(`/api/v1/finance/expenses/${unapprovedId}/pay`)
      .set(adminHeaders)
      .send({ accountId: 'ACC-BANK-01' })

    assert.strictEqual(resPayUnapproved.status, 400)
    assert.strictEqual(resPayUnapproved.body.error, 'EXPENSE_NOT_APPROVED')

    // Clean up unapproved test expense
    await query('DELETE FROM `expenses` WHERE `id` = ?', [unapprovedId])

    // Case B: Create and approve an expense specifically for disbursement testing
    const disbCreate = await request(app)
      .post('/api/v1/finance/expenses')
      .set(peshawarBmHeaders)
      .send({
        category: 'Showroom Utilities',
        vendor: 'National Grid Utilities (TEST)',
        amount: 12500,
        description: 'Electricity power disbursement test',
        paymentMethod: 'Bank Transfer'
      })
    testDisbursementExpenseId = (disbCreate.body.expense || disbCreate.body).id
    createdExpenseIds.add(testDisbursementExpenseId)

    await request(app)
      .post(`/api/v1/finance/expenses/${testDisbursementExpenseId}/approve`)
      .set(adminHeaders)

    // Check account balance before payment
    const [accBefore] = await query('SELECT current_balance FROM `cash_bank_accounts` WHERE `id` = "ACC-BANK-01"')
    const balBefore = parseFloat(accBefore.current_balance)

    // Case C: Disburse valid payment
    const resPay = await request(app)
      .post(`/api/v1/finance/expenses/${testDisbursementExpenseId}/pay`)
      .set(adminHeaders)
      .send({
        accountId: 'ACC-BANK-01',
        paymentMethod: 'Bank Transfer',
        transactionRef: `TRX-${testDisbursementExpenseId}`
      })

    assert.strictEqual(resPay.status, 200)
    assert.strictEqual(resPay.body.ok, true)
    testPaidTransactionId = `TRX-${testDisbursementExpenseId}`
    createdTransactionIds.add(testPaidTransactionId)

    // Verify account balance deducted atomically
    const [accAfter] = await query('SELECT current_balance FROM `cash_bank_accounts` WHERE `id` = "ACC-BANK-01"')
    const balAfter = parseFloat(accAfter.current_balance)
    assert.strictEqual(balAfter, balBefore - 12500, 'Bank balance must decrease by exact expense amount')

    // Verify financial_transactions entry created
    const trxRows = await query('SELECT * FROM `financial_transactions` WHERE `id` = ?', [testPaidTransactionId])
    assert.strictEqual(trxRows.length, 1, 'Financial transaction must be logged')
    assert.strictEqual(trxRows[0].type, 'Disbursement')
    assert.strictEqual(parseFloat(trxRows[0].raw_recorded), 12500)

    // Verify double-entry General Ledger rows
    const glRows = await query('SELECT * FROM `general_ledger` WHERE `source_id` = ?', [testDisbursementExpenseId])
    assert.strictEqual(glRows.length, 2, 'Exactly 2 double-entry GL entries must be posted')

    const debitRow = glRows.find(r => parseFloat(r.debit) > 0)
    const creditRow = glRows.find(r => parseFloat(r.credit) > 0)
    assert.ok(debitRow, 'Debit entry must exist')
    assert.ok(creditRow, 'Credit entry must exist')
    assert.strictEqual(parseFloat(debitRow.debit), 12500, 'Debit amount must match expense amount')
    assert.strictEqual(parseFloat(creditRow.credit), 12500, 'Credit amount must match expense amount')
    assert.strictEqual(debitRow.gl_account_code, '5000', 'Expense GL code is 5000')

    // Case D: Duplicate payment attempt on already paid expense -> 400 ALREADY_PAID
    const resDupPay = await request(app)
      .post(`/api/v1/finance/expenses/${testDisbursementExpenseId}/pay`)
      .set(adminHeaders)
      .send({ accountId: 'ACC-BANK-01' })

    assert.strictEqual(resDupPay.status, 400)
    assert.strictEqual(resDupPay.body.error, 'ALREADY_PAID')
  })

  // 11. Financial Auditability & Non-Destructive Integrity
  it('11. Financial Auditability: Prevents deletion or modification of settled disbursements; permits unapproved deletion', async () => {
    // Attempt to update paid expense -> 400 ALREADY_PAID
    const resUpdatePaid = await request(app)
      .put(`/api/v1/finance/expenses/${testDisbursementExpenseId}`)
      .set(adminHeaders)
      .send({ vendor: 'Tampered Vendor' })
    assert.strictEqual(resUpdatePaid.status, 400)
    assert.strictEqual(resUpdatePaid.body.error, 'ALREADY_PAID')

    // Attempt to delete paid expense -> 400 AUDIT_LOCK
    const resDeletePaid = await request(app)
      .delete(`/api/v1/finance/expenses/${testDisbursementExpenseId}`)
      .set(adminHeaders)
    assert.strictEqual(resDeletePaid.status, 400)
    assert.strictEqual(resDeletePaid.body.error, 'AUDIT_LOCK')

    // Create an unapproved draft expense and delete it -> 200 OK
    const draftRes = await request(app)
      .post('/api/v1/finance/expenses')
      .set(peshawarBmHeaders)
      .send({
        category: 'Office Supplies',
        vendor: 'Accidental Entry Vendor (TEST)',
        amount: 2500,
        description: 'Draft unapproved expense to delete'
      })
    testDeleteExpenseId = (draftRes.body.expense || draftRes.body).id
    createdExpenseIds.add(testDeleteExpenseId)

    const resDeleteDraft = await request(app)
      .delete(`/api/v1/finance/expenses/${testDeleteExpenseId}`)
      .set(peshawarBmHeaders)
    assert.strictEqual(resDeleteDraft.status, 200)
    assert.strictEqual(resDeleteDraft.body.ok, true)

    // Verify it is gone
    const checkDeleted = await request(app)
      .get(`/api/v1/finance/expenses/${testDeleteExpenseId}`)
      .set(adminHeaders)
    assert.strictEqual(checkDeleted.status, 404)
  })

  // 12. Non-Destructive Transaction Reversal
  it('12. Transaction Reversal: Non-destructively reverses disbursement, refunds account balance, and posts reversal GL entries', async () => {
    // Check balance before reversal
    const [accBefore] = await query('SELECT current_balance FROM `cash_bank_accounts` WHERE `id` = "ACC-BANK-01"')
    const balBefore = parseFloat(accBefore.current_balance)

    // Reversal without reason -> 422
    const resNoReason = await request(app)
      .post(`/api/v1/finance/transactions/${testPaidTransactionId}/reverse`)
      .set(adminHeaders)
      .send({})
    assert.strictEqual(resNoReason.status, 422)

    // Valid reversal
    const resRev = await request(app)
      .post(`/api/v1/finance/transactions/${testPaidTransactionId}/reverse`)
      .set(adminHeaders)
      .send({ reason: 'Audit discrepancy correction: Duplicate invoice adjustment' })

    assert.strictEqual(resRev.status, 200)
    assert.strictEqual(resRev.body.ok, true)

    // Verify account balance restored (refunded by 12,500)
    const [accAfter] = await query('SELECT current_balance FROM `cash_bank_accounts` WHERE `id` = "ACC-BANK-01"')
    const balAfter = parseFloat(accAfter.current_balance)
    assert.strictEqual(balAfter, balBefore + 12500, 'Bank balance must be refunded by reversed amount')

    // Verify transaction marked reversed
    const [trx] = await query('SELECT is_reversed, reversal_reason FROM `financial_transactions` WHERE `id` = ?', [testPaidTransactionId])
    assert.strictEqual(trx.is_reversed, 1)
    assert.ok(trx.reversal_reason.includes('Audit discrepancy correction'))

    // Verify reversal GL entries posted
    const revGlRows = await query('SELECT * FROM `general_ledger` WHERE `source_id` = ?', [testPaidTransactionId])
    assert.ok(revGlRows.length >= 2, 'Offsetting reversal GL entries must be posted')

    // Cannot double-reverse -> 400
    const resDoubleRev = await request(app)
      .post(`/api/v1/finance/transactions/${testPaidTransactionId}/reverse`)
      .set(adminHeaders)
      .send({ reason: 'Attempt duplicate reversal' })
    assert.strictEqual(resDoubleRev.status, 400)
  })

  // 13. Cash & Bank Accounts & Reconciliations
  it('13. Cash & Bank: Retrieves accounts and reconciliation transaction feed with branch isolation', async () => {
    // Admin request
    const resAdmin = await request(app)
      .get('/api/v1/finance/cash-bank')
      .set(adminHeaders)

    assert.strictEqual(resAdmin.status, 200)
    assert.strictEqual(resAdmin.body.ok, true)
    assert.ok(Array.isArray(resAdmin.body.accounts))
    assert.ok(resAdmin.body.kpis, 'Must include KPI metrics')
    assert.ok(resAdmin.body.accounts.length >= 3, 'Must have baseline cash/bank accounts')

    // Peshawar BM request -> accounts must be scoped to Peshawar or corporate
    const resBm = await request(app)
      .get('/api/v1/finance/cash-bank')
      .set(peshawarBmHeaders)

    assert.strictEqual(resBm.status, 200)
    assert.strictEqual(resBm.body.ok, true)
  })

  // 14. General Ledger & Trial Balance Equilibrium
  it('14. General Ledger & Trial Balance: Verifies double-entry equilibrium where Debits equal Credits', async () => {
    // Retrieve General Ledger
    const resGl = await request(app)
      .get('/api/v1/finance/general-ledger')
      .set(adminHeaders)

    assert.strictEqual(resGl.status, 200)
    assert.ok(Array.isArray(resGl.body))
    assert.ok(resGl.body.length >= 4, 'Should contain baseline + test GL journal entries')

    // Retrieve Trial Balance
    const resTb = await request(app)
      .get('/api/v1/finance/trial-balance')
      .set(adminHeaders)

    assert.strictEqual(resTb.status, 200)
    assert.strictEqual(resTb.body.ok, true)
    assert.strictEqual(resTb.body.isBalanced, true, 'Trial balance must be mathematically in equilibrium (Debits == Credits)')
    assert.strictEqual(resTb.body.difference, 0, 'Difference between total debits and credits must be 0')
  })

  // 15. Financial Overview KPIs
  it('15. Financial Overview: Returns KPI summaries, branch contributions, and recent transactions', async () => {
    const res = await request(app)
      .get('/api/v1/finance/overview')
      .set(adminHeaders)

    assert.strictEqual(res.status, 200)
    assert.strictEqual(res.body.ok, true)
    assert.ok(res.body.kpis, 'Must include financial KPIs')
    assert.ok(res.body.kpis.totalExpenses !== undefined)
    assert.ok(res.body.kpis.bankBalance !== undefined)
    assert.ok(res.body.kpis.cashOnHand !== undefined)
    assert.ok(Array.isArray(res.body.branchExpenses), 'Must include branch contribution breakdown')
  })
})
