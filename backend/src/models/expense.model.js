import { query, withTransaction } from '../config/db.js'

/**
 * Normalizes an expense database row into frontend contract
 */
export function formatExpenseRow(row) {
  if (!row) return null
  const rawAmount = parseFloat(row.raw_amount || 0)
  const amountStr = row.amount || `PKR ${rawAmount.toLocaleString()}`
  const approval = row.approval || 'Pending'
  const approvalClass = row.approval_class || (
    approval === 'Approved' ? 'bg-[#dcfce7] text-[#15803d]' :
    approval === 'Rejected' ? 'bg-red-50 text-red-700' :
    'bg-[#fef3c7] text-[#92400e]'
  )
  const payment = row.payment || 'Unpaid'
  const paymentClass = row.payment_class || (
    payment === 'Paid' ? 'text-[#165A31] font-bold' :
    'text-gray-900 font-medium'
  )

  const dateStr = row.date || (row.full_date ? new Date(row.full_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : 'Today')
  const fullDateStr = row.full_date ? (row.full_date instanceof Date ? row.full_date.toISOString().split('T')[0] : String(row.full_date).split('T')[0]) : new Date().toISOString().split('T')[0]

  return {
    id: row.id,
    expense_id: row.id,
    expenseNumber: row.expense_number || row.id,
    branch_id: row.branch_id,
    branchId: row.branch_id,
    branch: row.branch,
    branchName: row.branch,
    category_id: row.category_id || null,
    category: row.category,
    vendor_id: row.vendor_id || null,
    vendor: row.vendor,
    amount: amountStr,
    rawAmount: rawAmount,
    date: dateStr,
    fullDate: fullDateStr,
    approval: approval,
    approvalClass: approvalClass,
    status: row.status || (approval === 'Approved' ? 'Approved' : (approval === 'Rejected' ? 'Rejected' : 'Pending Approval')),
    payment: payment,
    paymentClass: paymentClass,
    branchLimit: row.branch_limit || 'PKR 15,000',
    decision: row.decision || (approval === 'Approved' ? 'Approved by Policy' : 'Awaiting management review'),
    paymentMethod: row.payment_method || 'Bank Transfer',
    transactionId: row.transaction_id || '',
    description: row.description || '',
    receiptFile: row.receipt_file || '',
    receiptType: row.receipt_type || 'PDF Document',
    submittedBy: row.submitted_by || 'Branch Manager',
    approvedBy: row.approved_by || null,
    approvedDate: row.approved_date ? (row.approved_date instanceof Date ? row.approved_date.toISOString().split('T')[0] : String(row.approved_date).split('T')[0]) : null,
    rejectedBy: row.rejected_by || null,
    rejectionReason: row.rejection_reason || null,
    notes: row.notes || '',
    lastUpdate: row.last_update || 'Today 08:20',
    glPosted: Boolean(row.gl_posted),
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
    updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : new Date().toISOString()
  }
}

export const ExpenseModel = {
  /**
   * Find all expenses with branch, approval, status, category, date, and search filters
   */
  async findAll({ branch_id, approval, status, payment, category, search, limit = 100, offset = 0 } = {}) {
    let sql = 'SELECT * FROM `expenses` WHERE 1=1'
    const params = []

    if (branch_id && branch_id !== 'ALL' && branch_id !== 'All Branches') {
      sql += ' AND (`branch_id` = ? OR `branch` = ?)'
      params.push(branch_id, branch_id)
    }

    if (approval && approval !== 'All') {
      sql += ' AND `approval` = ?'
      params.push(approval)
    }

    if (status && status !== 'All') {
      sql += ' AND `status` = ?'
      params.push(status)
    }

    if (payment && payment !== 'All') {
      sql += ' AND `payment` = ?'
      params.push(payment)
    }

    if (category && category !== 'All' && category !== 'All Categories') {
      sql += ' AND `category` = ?'
      params.push(category)
    }

    if (search && String(search).trim() !== '') {
      const q = `%${String(search).trim()}%`
      sql += ' AND (`id` LIKE ? OR `expense_number` LIKE ? OR `vendor` LIKE ? OR `category` LIKE ? OR `description` LIKE ?)'
      params.push(q, q, q, q, q)
    }

    sql += ' ORDER BY `created_at` DESC LIMIT ? OFFSET ?'
    params.push(parseInt(limit, 10), parseInt(offset, 10))

    const rows = await query(sql, params)
    return rows.map(formatExpenseRow)
  },

  /**
   * Find a single expense by ID or expense_number
   */
  async findById(id) {
    if (!id) return null
    const rows = await query(
      'SELECT * FROM `expenses` WHERE `id` = ? OR `expense_number` = ? LIMIT 1',
      [id, id]
    )
    return rows.length > 0 ? formatExpenseRow(rows[0]) : null
  },

  /**
   * Create a new expense record with policy limit checking
   */
  async create(data, user = {}) {
    const rawAmount = parseFloat(String(data.rawAmount || data.amount || 0).replace(/[^0-9.]/g, ''))
    if (isNaN(rawAmount) || rawAmount <= 0) {
      throw new Error('Expense amount must be a positive number.')
    }

    const isExplicitId = Boolean(data.id)
    let id = data.id
    const branchId = data.branch_id || data.branchId || user.branch_id || 'BR-01'
    const branch = data.branch || data.branchName || user.branch_name || 'Peshawar'
    const category = data.category || 'Utilities'
    const vendor = data.vendor || data.payee || 'Operational Vendor'
    const amountFormatted = `PKR ${rawAmount.toLocaleString()}`

    const dateStr = data.date || 'Today'
    const fullDate = data.fullDate || data.date || new Date().toISOString().split('T')[0]

    // Dealership governance policy: PKR 15,000 ceiling
    // If explicitly provided approval is given (e.g. seed data or super admin creation), respect it
    const isSuperAdmin = user.role === 'Super Admin' || !user.branch_id || user.branch_id === 'ALL'
    let approval = data.approval || 'Pending'
    const status = data.status || (approval === 'Approved' ? 'Approved' : (approval === 'Rejected' ? 'Rejected' : 'Pending Approval'))
    const approvalClass = approval === 'Approved' 
      ? 'bg-[#dcfce7] text-[#15803d]' 
      : (approval === 'Rejected' ? 'bg-red-50 text-red-700' : 'bg-[#fef3c7] text-[#92400e]')
    const payment = data.payment || 'Unpaid'
    const paymentClass = payment === 'Paid' ? 'text-[#165A31] font-bold' : 'text-gray-900 font-medium'
    const branchLimit = 'PKR 15,000'
    const decision = data.decision || (approval === 'Approved' 
      ? 'Approved' 
      : (rawAmount <= 15000 ? 'Within Branch Limit' : 'Awaiting Super Admin Approval'))
    const paymentMethod = data.paymentMethod || 'Bank Transfer'
    const transactionId = data.transactionId || null
    const description = data.description || ''
    const receiptFile = data.receiptFile || data.receipt || 'receipt.pdf'
    const receiptType = data.receiptType || 'PDF Document'
    const submittedBy = data.submittedBy || user.name || (isSuperAdmin ? 'Super Admin' : 'Branch Manager')
    const notes = data.notes || ''

    let lastErr = null
    const maxAttempts = isExplicitId ? 1 : 5

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      if (!isExplicitId) {
        let attempts = 0
        while (attempts < 15) {
          const candidate = `EXP-${Math.floor(1000 + Math.random() * 9000)}`
          const existing = await query('SELECT `id` FROM `expenses` WHERE `id` = ? LIMIT 1', [candidate])
          if (existing.length === 0) {
            id = candidate
            break
          }
          attempts++
        }
        if (!id) id = `EXP-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`
      }
      const expenseNumber = data.expenseNumber || id

      try {
        await query(`
          INSERT INTO \`expenses\` (
            \`id\`, \`expense_number\`, \`branch_id\`, \`branch\`, \`category_id\`, \`category\`,
            \`vendor_id\`, \`vendor\`, \`amount\`, \`raw_amount\`, \`date\`, \`full_date\`,
            \`approval\`, \`approval_class\`, \`status\`, \`payment\`, \`payment_class\`,
            \`branch_limit\`, \`decision\`, \`payment_method\`, \`transaction_id\`,
            \`description\`, \`receipt_file\`, \`receipt_type\`, \`submitted_by\`,
            \`notes\`, \`last_update\`, \`gl_posted\`
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          id, expenseNumber, branchId, branch, data.category_id || null, category,
          data.vendor_id || null, vendor, amountFormatted, rawAmount, dateStr, fullDate,
          approval, approvalClass, status, payment, paymentClass,
          branchLimit, decision, paymentMethod, transactionId,
          description, receiptFile, receiptType, submittedBy,
          notes, 'Just now', 0
        ])

        return this.findById(id)
      } catch (err) {
        lastErr = err
        if (!isExplicitId && (err.code === 'ER_DUP_ENTRY' || err.errno === 1062)) {
          id = null
          continue
        }
        throw err
      }
    }

    if (lastErr) throw lastErr
  },

  /**
   * Update an existing expense record (allowed if not yet Paid)
   */
  async update(id, updateData) {
    const existing = await this.findById(id)
    if (!existing) {
      throw new Error(`Expense with ID "${id}" was not found.`)
    }

    if (existing.payment === 'Paid') {
      throw new Error(`Expense "${id}" has already been paid and settled. Paid expenses cannot be modified.`)
    }

    const updates = []
    const params = []

    if (updateData.category) {
      updates.push('`category` = ?')
      params.push(updateData.category)
    }

    if (updateData.vendor) {
      updates.push('`vendor` = ?')
      params.push(updateData.vendor)
    }

    if (updateData.amount !== undefined || updateData.rawAmount !== undefined) {
      const raw = parseFloat(String(updateData.rawAmount || updateData.amount).replace(/[^0-9.]/g, ''))
      if (!isNaN(raw) && raw > 0) {
        updates.push('`raw_amount` = ?, `amount` = ?')
        params.push(raw, `PKR ${raw.toLocaleString()}`)
      }
    }

    if (updateData.paymentMethod) {
      updates.push('`payment_method` = ?')
      params.push(updateData.paymentMethod)
    }

    if (updateData.transactionId !== undefined) {
      updates.push('`transaction_id` = ?')
      params.push(updateData.transactionId)
    }

    if (updateData.description !== undefined) {
      updates.push('`description` = ?')
      params.push(updateData.description)
    }

    if (updateData.notes !== undefined) {
      updates.push('`notes` = ?')
      params.push(updateData.notes)
    }

    if (updateData.receiptFile || updateData.receipt) {
      updates.push('`receipt_file` = ?')
      params.push(updateData.receiptFile || updateData.receipt)
    }

    if (updates.length === 0) return existing

    updates.push('`last_update` = ?')
    params.push('Just now')

    params.push(id)
    await query(`UPDATE \`expenses\` SET ${updates.join(', ')} WHERE \`id\` = ?`, params)
    return this.findById(id)
  },

  /**
   * Approve an expense (Super Admin or authorized clearance)
   */
  async approve(id, { approvedBy = 'Super Admin' } = {}) {
    const existing = await this.findById(id)
    if (!existing) {
      throw new Error(`Expense with ID "${id}" was not found.`)
    }

    if (existing.approval === 'Approved') {
      return existing
    }

    if (existing.approval === 'Rejected') {
      throw new Error(`Cannot approve a previously rejected expense "${id}".`)
    }

    const todayStr = new Date().toISOString().split('T')[0]
    await query(`
      UPDATE \`expenses\`
      SET \`approval\` = 'Approved',
          \`status\` = 'Approved',
          \`approval_class\` = 'bg-[#dcfce7] text-[#15803d]',
          \`decision\` = ?,
          \`approved_by\` = ?,
          \`approved_date\` = ?,
          \`last_update\` = 'Just now'
      WHERE \`id\` = ?
    `, [`Approved by ${approvedBy}`, approvedBy, todayStr, id])

    return this.findById(id)
  },

  /**
   * Reject an expense with a mandatory audit reason
   */
  async reject(id, { rejectedBy = 'Super Admin', reason = 'Exceeds monthly branch allocation' } = {}) {
    const existing = await this.findById(id)
    if (!existing) {
      throw new Error(`Expense with ID "${id}" was not found.`)
    }

    if (existing.payment === 'Paid') {
      throw new Error(`Cannot reject an expense "${id}" that has already been paid.`)
    }

    await query(`
      UPDATE \`expenses\`
      SET \`approval\` = 'Rejected',
          \`status\` = 'Rejected',
          \`approval_class\` = 'bg-red-50 text-red-700',
          \`decision\` = 'Rejected by Management',
          \`rejected_by\` = ?,
          \`rejection_reason\` = ?,
          \`last_update\` = 'Just now'
      WHERE \`id\` = ?
    `, [rejectedBy, reason, id])

    return this.findById(id)
  },

  /**
   * Execute atomic payment/disbursement against an approved expense
   */
  async pay(id, { accountId = 'ACC-BANK-01', paymentMethod = 'Bank Transfer', transactionRef = null, paidBy = 'Super Admin' } = {}) {
    return await withTransaction(async (conn) => {
      // 1. Lock and fetch expense
      const [expRows] = await conn.execute(
        'SELECT * FROM `expenses` WHERE `id` = ? FOR UPDATE',
        [id]
      )
      if (expRows.length === 0) {
        throw new Error(`Expense with ID "${id}" was not found.`)
      }
      const exp = expRows[0]

      if (exp.payment === 'Paid') {
        throw new Error(`Expense "${id}" has already been paid. Duplicate payment prevented.`)
      }

      if (exp.approval !== 'Approved') {
        throw new Error(`Cannot disburse payment for expense "${id}": Expense status is "${exp.approval}". Approval is required before payment.`)
      }

      const rawAmount = parseFloat(exp.raw_amount || 0)
      if (rawAmount <= 0) {
        throw new Error(`Invalid expense amount: ${rawAmount}`)
      }

      // 2. Lock and fetch paying account
      const [accRows] = await conn.execute(
        'SELECT * FROM `cash_bank_accounts` WHERE `id` = ? OR `code` = ? FOR UPDATE',
        [accountId, accountId]
      )
      if (accRows.length === 0) {
        throw new Error(`Paying bank or cash account "${accountId}" was not found.`)
      }
      const account = accRows[0]

      const currentBalance = parseFloat(account.current_balance || 0)
      if (currentBalance < rawAmount) {
        throw new Error(`Insufficient funds in account "${account.account_name}". Required: PKR ${rawAmount.toLocaleString()}, Available: PKR ${currentBalance.toLocaleString()}`)
      }

      // 3. Deduct account balance
      const newBalance = currentBalance - rawAmount
      await conn.execute(
        'UPDATE `cash_bank_accounts` SET `current_balance` = ? WHERE `id` = ?',
        [newBalance, account.id]
      )

      // 4. Update expense status to Paid
      await conn.execute(`
        UPDATE \`expenses\`
        SET \`payment\` = 'Paid',
            \`payment_class\` = 'text-[#165A31] font-bold',
            \`payment_method\` = ?,
            \`transaction_id\` = ?,
            \`gl_posted\` = 1,
            \`last_update\` = 'Just now'
        WHERE \`id\` = ?
      `, [paymentMethod, transactionRef || `TRX-${id}`, id])

      // 5. Insert financial transaction record
      const trxId = `TRX-${id}`
      const todayStr = new Date().toISOString().split('T')[0]
      const monthDayStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })

      await conn.execute(`
        INSERT INTO \`financial_transactions\` (
          \`id\`, \`transaction_number\`, \`account_id\`, \`account_name\`, \`branch_id\`, \`branch\`,
          \`date\`, \`full_date\`, \`type\`, \`category\`, \`reference\`, \`reference_type\`, \`reference_id\`,
          \`recorded\`, \`raw_recorded\`, \`statement\`, \`raw_statement\`, \`difference\`, \`raw_difference\`,
          \`status\`, \`status_class\`, \`action\`, \`action_class\`, \`description\`
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        trxId, trxId, account.id, account.account_type, exp.branch_id, exp.branch,
        monthDayStr, todayStr, 'Disbursement', 'Expense', exp.id, 'expense', exp.id,
        `PKR ${rawAmount.toLocaleString()}`, rawAmount, `PKR ${rawAmount.toLocaleString()}`, rawAmount,
        '0', 0.00, 'Matched', 'bg-[#eefcf2] text-[#165A31]', 'Open', 'text-gray-500 hover:text-gray-900',
        `Disbursement for ${exp.category} expense (${exp.vendor})`
      ])

      // 6. Post double-entry General Ledger rows
      const glEntryId = `GL-${id}`
      const expGlCode = '5000'
      const assetGlCode = account.gl_account_code || '1000'

      // Debit: Operating Expense Account
      await conn.execute(`
        INSERT INTO \`general_ledger\` (
          \`id\`, \`entry_number\`, \`entry_date\`, \`branch_id\`, \`branch\`,
          \`gl_account_code\`, \`gl_account_name\`, \`debit\`, \`credit\`,
          \`source_module\`, \`source_type\`, \`source_id\`, \`description\`
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        `${glEntryId}-DR`, glEntryId, todayStr, exp.branch_id, exp.branch,
        expGlCode, `Operating Expense - ${exp.category}`, rawAmount, 0.00,
        'Finance', 'expense', exp.id, `Expense: ${exp.description || exp.category} (${exp.vendor})`
      ])

      // Credit: Cash / Bank Account
      await conn.execute(`
        INSERT INTO \`general_ledger\` (
          \`id\`, \`entry_number\`, \`entry_date\`, \`branch_id\`, \`branch\`,
          \`gl_account_code\`, \`gl_account_name\`, \`debit\`, \`credit\`,
          \`source_module\`, \`source_type\`, \`source_id\`, \`description\`
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        `${glEntryId}-CR`, glEntryId, todayStr, exp.branch_id, exp.branch,
        assetGlCode, account.account_name, 0.00, rawAmount,
        'Finance', 'expense', exp.id, `Payment disbursement from ${account.account_name}`
      ])

      return {
        ok: true,
        expenseId: id,
        amount: rawAmount,
        accountName: account.account_name,
        remainingBalance: newBalance,
        transactionId: trxId,
        glEntryId
      }
    })
  },

  /**
   * Delete an expense (only allowed if unapproved/unpaid)
   */
  async delete(id) {
    const existing = await this.findById(id)
    if (!existing) {
      throw new Error(`Expense with ID "${id}" was not found.`)
    }

    if (existing.payment === 'Paid' || existing.glPosted) {
      throw new Error(`Cannot delete paid expense "${id}". Financial audit trail forbids deleting posted disbursements.`)
    }

    await query('DELETE FROM `expenses` WHERE `id` = ?', [id])
    return { ok: true, deleted: true, id }
  },

  /**
   * Aggregated KPIs for expenses roster
   */
  async getKPIs(branch_id = null) {
    let sql = 'SELECT * FROM `expenses` WHERE 1=1'
    const params = []

    if (branch_id && branch_id !== 'ALL' && branch_id !== 'All Branches') {
      sql += ' AND (`branch_id` = ? OR `branch` = ?)'
      params.push(branch_id, branch_id)
    }

    const rows = await query(sql, params)
    const submittedCount = rows.length
    const pendingRows = rows.filter(r => r.approval === 'Pending')
    const paidRows = rows.filter(r => r.payment === 'Paid')

    const totalSubmittedAmount = rows.reduce((sum, r) => sum + parseFloat(r.raw_amount || 0), 0)
    const pendingAmount = pendingRows.reduce((sum, r) => sum + parseFloat(r.raw_amount || 0), 0)
    const paidAmount = paidRows.reduce((sum, r) => sum + parseFloat(r.raw_amount || 0), 0)

    return {
      totalSubmittedCount: submittedCount,
      totalSubmittedAmount,
      pendingCount: pendingRows.length,
      pendingAmount,
      paidCount: paidRows.length,
      paidAmount
    }
  }
}
