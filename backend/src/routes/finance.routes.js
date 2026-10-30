import { Router } from 'express'
import { FinanceController } from '../controllers/finance.controller.js'

const router = Router()

// ============================================================================
// EXPENSES & CATEGORIES
// ============================================================================

// GET /api/v1/finance/categories - List expense categories
router.get('/categories', FinanceController.getCategories)

// GET /api/v1/finance/expenses - List expenses
router.get('/expenses', FinanceController.listExpenses)

// POST /api/v1/finance/expenses - Create new expense
router.post('/expenses', FinanceController.createExpense)

// GET /api/v1/finance/expenses/:id - Retrieve single expense
router.get('/expenses/:id', FinanceController.getExpenseById)

// PUT /api/v1/finance/expenses/:id - Update expense
router.put('/expenses/:id', FinanceController.updateExpense)

// POST /api/v1/finance/expenses/:id/approve - Approve expense claim
router.post('/expenses/:id/approve', FinanceController.approveExpense)

// POST /api/v1/finance/expenses/:id/reject - Reject expense claim
router.post('/expenses/:id/reject', FinanceController.rejectExpense)

// POST /api/v1/finance/expenses/:id/pay - Disburse payment for expense
router.post('/expenses/:id/pay', FinanceController.payExpense)

// DELETE /api/v1/finance/expenses/:id - Delete unapproved expense
router.delete('/expenses/:id', FinanceController.deleteExpense)

// ============================================================================
// CASH & BANK & TRANSACTIONS
// ============================================================================

// GET /api/v1/finance/cash-bank - Cash and bank accounts with reconciliations
router.get('/cash-bank', FinanceController.getCashBank)

// GET /api/v1/finance/transactions - List financial transactions
router.get('/transactions', FinanceController.listTransactions)

// POST /api/v1/finance/transactions/:id/reverse - Non-destructive reversal of transaction
router.post('/transactions/:id/reverse', FinanceController.reverseTransaction)

// ============================================================================
// GENERAL LEDGER & TRIAL BALANCE
// ============================================================================

// GET /api/v1/finance/general-ledger - Double-entry general ledger
router.get('/general-ledger', FinanceController.getGeneralLedger)

// GET /api/v1/finance/trial-balance - Trial balance report
router.get('/trial-balance', FinanceController.getTrialBalance)

// ============================================================================
// OVERVIEW KPIS
// ============================================================================

// GET /api/v1/finance/overview - Financial overview KPIs & contributions
router.get('/overview', FinanceController.getOverview)

export default router
