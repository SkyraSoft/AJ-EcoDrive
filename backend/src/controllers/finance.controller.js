import { ExpenseModel } from '../models/expense.model.js'
import { FinanceModel } from '../models/finance.model.js'
import { getEffectiveBranch, assertBranchAccess, getBranchName } from '../utils/branchScope.js'

export const FinanceController = {
  // ==========================================================================
  // EXPENSES
  // ==========================================================================

  /**
   * GET /api/v1/finance/expenses
   * Retrieves list of expenses with branch isolation and query filters
   */
  async listExpenses(req, res, next) {
    try {
      const branchId = getEffectiveBranch(req)
      const { approval, status, payment, category, search, limit = 100, offset = 0 } = req.query

      const expenses = await ExpenseModel.findAll({
        branch_id: branchId,
        approval,
        status,
        payment,
        category,
        search,
        limit,
        offset
      })

      // Return array directly with attached ok property for flexible caller support
      res.status(200).json(expenses)
    } catch (err) {
      next(err)
    }
  },

  /**
   * GET /api/v1/finance/expenses/:id
   * Retrieves single expense by ID with branch scoping
   */
  async getExpenseById(req, res, next) {
    try {
      const { id } = req.params
      const expense = await ExpenseModel.findById(id)

      if (!expense) {
        return res.status(404).json({
          ok: false,
          error: 'NOT_FOUND',
          message: `Expense with ID "${id}" was not found.`
        })
      }

      if (!assertBranchAccess(expense.branch_id, req, res)) {
        return
      }

      res.status(200).json({
        ok: true,
        expense,
        ...expense
      })
    } catch (err) {
      next(err)
    }
  },

  /**
   * POST /api/v1/finance/expenses
   * Creates a new showroom expense record
   */
  async createExpense(req, res, next) {
    try {
      const { category, amount, rawAmount, branch_id, branch, paymentMethod, transactionId } = req.body || {}
      const vendor = (req.body?.vendor || req.body?.payee || '').trim()
      const errors = []

      if (!category || String(category).trim() === '') {
        errors.push({ field: 'category', message: 'Expense category is required.' })
      }

      if (!vendor) {
        errors.push({ field: 'vendor', message: 'Vendor/payee name is required.' })
      }

      const rawInput = rawAmount !== undefined ? rawAmount : (amount !== undefined ? amount : 0)
      const isNegative = String(rawInput).trim().startsWith('-')
      const cleaned = String(rawInput).replace(/[^0-9.]/g, '')
      let numAmount = parseFloat(cleaned)
      if (isNegative) numAmount = -numAmount

      if (isNaN(numAmount) || numAmount <= 0) {
        errors.push({ field: 'amount', message: 'Expense amount must be greater than zero.' })
      }

      // Branch derivation & validation
      const effectiveBranch = getEffectiveBranch(req)
      let resolvedBranchId = effectiveBranch
      let resolvedBranchName = getBranchName(effectiveBranch)

      if (!effectiveBranch) {
        // Super admin can specify branch
        resolvedBranchId = branch_id || 'BR-01'
        resolvedBranchName = branch || getBranchName(resolvedBranchId)
      }

      if (errors.length > 0) {
        return res.status(422).json({
          ok: false,
          error: 'VALIDATION_FAILED',
          message: errors[0].message,
          errors
        })
      }

      const created = await ExpenseModel.create({
        ...req.body,
        rawAmount: numAmount,
        branch_id: resolvedBranchId,
        branch: resolvedBranchName
      }, req.user)

      res.status(201).json({
        ok: true,
        expense: created,
        ...created
      })
    } catch (err) {
      next(err)
    }
  },

  /**
   * PUT /api/v1/finance/expenses/:id
   * Updates an existing expense
   */
  async updateExpense(req, res, next) {
    try {
      const { id } = req.params
      const existing = await ExpenseModel.findById(id)

      if (!existing) {
        return res.status(404).json({
          ok: false,
          error: 'NOT_FOUND',
          message: `Expense with ID "${id}" was not found.`
        })
      }

      if (!assertBranchAccess(existing.branch_id, req, res)) {
        return
      }

      if (existing.payment === 'Paid') {
        return res.status(400).json({
          ok: false,
          error: 'ALREADY_PAID',
          message: `Expense "${id}" has already been paid and settled. Paid expenses cannot be modified.`
        })
      }

      const updated = await ExpenseModel.update(id, req.body)
      res.status(200).json({
        ok: true,
        expense: updated,
        ...updated
      })
    } catch (err) {
      next(err)
    }
  },

  /**
   * POST /api/v1/finance/expenses/:id/approve
   * Approves an expense claim (governed by PKR 15,000 threshold)
   */
  async approveExpense(req, res, next) {
    try {
      const { id } = req.params
      const existing = await ExpenseModel.findById(id)

      if (!existing) {
        return res.status(404).json({
          ok: false,
          error: 'NOT_FOUND',
          message: `Expense with ID "${id}" was not found.`
        })
      }

      if (!assertBranchAccess(existing.branch_id, req, res)) {
        return
      }

      // Dealership governance policy check:
      // If expense > 15,000, only Super Admin can approve
      const isSuperAdmin = req.user.role === 'Super Admin' || !req.user.branch_id || req.user.branch_id === 'ALL'
      if (existing.rawAmount > 15000 && !isSuperAdmin) {
        return res.status(403).json({
          ok: false,
          error: 'APPROVAL_LIMIT_EXCEEDED',
          message: 'Emergency operational expense exceeding PKR 15,000 requires Super Admin authorization.'
        })
      }

      const approved = await ExpenseModel.approve(id, {
        approvedBy: req.user.name || (isSuperAdmin ? 'Super Admin' : 'Branch Manager')
      })

      res.status(200).json({
        ok: true,
        expense: approved,
        ...approved
      })
    } catch (err) {
      next(err)
    }
  },

  /**
   * POST /api/v1/finance/expenses/:id/reject
   * Rejects an expense claim with audit justification
   */
  async rejectExpense(req, res, next) {
    try {
      const { id } = req.params
      const { reason } = req.body || {}

      if (!reason || String(reason).trim() === '') {
        return res.status(422).json({
          ok: false,
          error: 'VALIDATION_FAILED',
          message: 'Rejection reason is required for the financial audit trail.',
          errors: [{ field: 'reason', message: 'Rejection reason cannot be blank.' }]
        })
      }

      const existing = await ExpenseModel.findById(id)
      if (!existing) {
        return res.status(404).json({
          ok: false,
          error: 'NOT_FOUND',
          message: `Expense with ID "${id}" was not found.`
        })
      }

      if (!assertBranchAccess(existing.branch_id, req, res)) {
        return
      }

      const rejected = await ExpenseModel.reject(id, {
        rejectedBy: req.user.name || 'Super Admin',
        reason: String(reason).trim()
      })

      res.status(200).json({
        ok: true,
        expense: rejected,
        ...rejected
      })
    } catch (err) {
      next(err)
    }
  },

  /**
   * POST /api/v1/finance/expenses/:id/pay
   * Disburses payment against an approved expense atomically
   */
  async payExpense(req, res, next) {
    try {
      const { id } = req.params
      const existing = await ExpenseModel.findById(id)

      if (!existing) {
        return res.status(404).json({
          ok: false,
          error: 'NOT_FOUND',
          message: `Expense with ID "${id}" was not found.`
        })
      }

      if (!assertBranchAccess(existing.branch_id, req, res)) {
        return
      }

      if (existing.approval !== 'Approved') {
        return res.status(400).json({
          ok: false,
          error: 'EXPENSE_NOT_APPROVED',
          message: `Cannot disburse payment: Expense "${id}" is in "${existing.approval}" state. Approval is required before payment.`
        })
      }

      if (existing.payment === 'Paid') {
        return res.status(400).json({
          ok: false,
          error: 'ALREADY_PAID',
          message: `Expense "${id}" has already been paid.`
        })
      }

      const result = await ExpenseModel.pay(id, {
        accountId: req.body?.accountId || 'ACC-BANK-01',
        paymentMethod: req.body?.paymentMethod || existing.paymentMethod || 'Bank Transfer',
        transactionRef: req.body?.transactionRef || null,
        paidBy: req.user.name || 'Super Admin'
      })

      const updatedExpense = await ExpenseModel.findById(id)

      res.status(200).json({
        ok: true,
        message: 'Expense disbursement posted successfully.',
        expense: updatedExpense,
        disbursement: result
      })
    } catch (err) {
      next(err)
    }
  },

  /**
   * DELETE /api/v1/finance/expenses/:id
   * Deletes an unapproved expense record
   */
  async deleteExpense(req, res, next) {
    try {
      const { id } = req.params
      const existing = await ExpenseModel.findById(id)

      if (!existing) {
        return res.status(404).json({
          ok: false,
          error: 'NOT_FOUND',
          message: `Expense with ID "${id}" was not found.`
        })
      }

      if (!assertBranchAccess(existing.branch_id, req, res)) {
        return
      }

      if (existing.payment === 'Paid' || existing.glPosted) {
        return res.status(400).json({
          ok: false,
          error: 'AUDIT_LOCK',
          message: `Cannot delete expense "${id}": Financial audit trail forbids deleting settled disbursements.`
        })
      }

      const result = await ExpenseModel.delete(id)
      res.status(200).json(result)
    } catch (err) {
      next(err)
    }
  },

  // ==========================================================================
  // CASH & BANK
  // ==========================================================================

  /**
   * GET /api/v1/finance/cash-bank
   * Returns accounts, KPIs, and reconciliation transactions
   */
  async getCashBank(req, res, next) {
    try {
      const branchId = getEffectiveBranch(req)
      const { account, status, search } = req.query

      const [kpis, accounts, transactions] = await Promise.all([
        FinanceModel.getCashBankKPIs(branchId),
        FinanceModel.getAccounts({ branch_id: branchId }),
        FinanceModel.getTransactions({ branch_id: branchId, account, status, search })
      ])

      res.status(200).json({
        ok: true,
        kpis,
        accounts,
        reconciliations: transactions,
        transactions
      })
    } catch (err) {
      next(err)
    }
  },

  /**
   * GET /api/v1/finance/transactions
   * Retrieves financial transactions with branch scoping
   */
  async listTransactions(req, res, next) {
    try {
      const branchId = getEffectiveBranch(req)
      const { account, status, search, limit = 100, offset = 0 } = req.query

      const transactions = await FinanceModel.getTransactions({
        branch_id: branchId,
        account,
        status,
        search,
        limit,
        offset
      })

      res.status(200).json(transactions)
    } catch (err) {
      next(err)
    }
  },

  /**
   * POST /api/v1/finance/transactions/:id/reverse
   * Non-destructively reverses an erroneous transaction with offsetting GL entries
   */
  async reverseTransaction(req, res, next) {
    try {
      const { id } = req.params
      const { reason } = req.body || {}

      if (!reason || String(reason).trim() === '') {
        return res.status(422).json({
          ok: false,
          error: 'VALIDATION_FAILED',
          message: 'Reversal reason is required for the financial audit trail.',
          errors: [{ field: 'reason', message: 'Reversal reason cannot be blank.' }]
        })
      }

      const trx = await FinanceModel.getTransactionById(id)
      if (!trx) {
        return res.status(404).json({
          ok: false,
          error: 'NOT_FOUND',
          message: `Transaction with ID "${id}" was not found.`
        })
      }

      if (!assertBranchAccess(trx.branch_id, req, res)) {
        return
      }

      const result = await FinanceModel.reverseTransaction(id, {
        reversedBy: req.user.name || 'Super Admin',
        reason: String(reason).trim()
      })

      res.status(200).json({
        ok: true,
        message: 'Transaction successfully reversed with offsetting GL journal entries.',
        ...result
      })
    } catch (err) {
      if (err.message.includes('already been reversed') || err.message.includes('negative') || err.message.includes('not found')) {
        return res.status(400).json({
          ok: false,
          error: 'BAD_REQUEST',
          message: err.message
        })
      }
      next(err)
    }
  },

  // ==========================================================================
  // GENERAL LEDGER & TRIAL BALANCE
  // ==========================================================================

  /**
   * GET /api/v1/finance/general-ledger
   * Retrieves double-entry audit general ledger rows
   */
  async getGeneralLedger(req, res, next) {
    try {
      const branchId = getEffectiveBranch(req)
      const { gl_account_code, source_module, limit = 100, offset = 0 } = req.query

      const entries = await FinanceModel.getGeneralLedger({
        branch_id: branchId,
        gl_account_code,
        source_module,
        limit,
        offset
      })

      res.status(200).json(entries)
    } catch (err) {
      next(err)
    }
  },

  /**
   * GET /api/v1/finance/trial-balance
   * Verifies double-entry equilibrium report
   */
  async getTrialBalance(req, res, next) {
    try {
      const branchId = getEffectiveBranch(req)
      const report = await FinanceModel.getTrialBalance(branchId)
      res.status(200).json({
        ok: true,
        ...report
      })
    } catch (err) {
      next(err)
    }
  },

  // ==========================================================================
  // OVERVIEW & CATEGORIES
  // ==========================================================================

  /**
   * GET /api/v1/finance/overview
   * Returns enterprise financial overview KPIs and branch contributions
   */
  async getOverview(req, res, next) {
    try {
      const branchId = getEffectiveBranch(req)
      const overview = await FinanceModel.getOverviewKPIs(branchId)
      res.status(200).json({
        ok: true,
        ...overview
      })
    } catch (err) {
      next(err)
    }
  },

  /**
   * GET /api/v1/finance/categories
   * Returns available expense categories
   */
  async getCategories(req, res, next) {
    try {
      const categories = await FinanceModel.getCategories()
      res.status(200).json(categories)
    } catch (err) {
      next(err)
    }
  }
}
