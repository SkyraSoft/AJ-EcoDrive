import { InvoiceModel } from '../models/invoice.model.js'
import { CustomerModel } from '../models/customer.model.js'
import { getEffectiveBranch, assertBranchAccess, resolveBranchId, getBranchName } from '../utils/branchScope.js'

export const InvoiceController = {
  /**
   * GET /api/v1/invoices
   */
  async list(req, res, next) {
    try {
      const { status, customer_id, order_id, search, limit, offset } = req.query

      // Multi-tenant branch context enforcement strictly derived from verified server-side identity
      const effectiveBranch = getEffectiveBranch(req)

      const invoices = await InvoiceModel.findAll({
        branch_id: effectiveBranch,
        status,
        customer_id,
        order_id,
        search,
        limit: limit ? parseInt(limit, 10) : 100,
        offset: offset ? parseInt(offset, 10) : 0
      })

      res.status(200).json(invoices)
    } catch (err) {
      next(err)
    }
  },

  /**
   * GET /api/v1/invoices/:id
   */
  async getById(req, res, next) {
    try {
      const { id } = req.params
      const invoice = await InvoiceModel.findById(id)

      if (!invoice) {
        return res.status(404).json({
          ok: false,
          error: 'NOT_FOUND',
          message: `Invoice with ID or number '${id}' was not found.`
        })
      }

      // Prevent cross-branch IDOR
      if (!assertBranchAccess(invoice.branch_id, req, res)) return

      res.status(200).json(invoice)
    } catch (err) {
      next(err)
    }
  },

  /**
   * POST /api/v1/invoices
   */
  async create(req, res, next) {
    try {
      const body = req.body || {}
      const errors = []

      // 1. Customer reference validation against actual database records
      const customerInput = (body.customer_id || body.customer || '').trim()
      if (!customerInput) {
        errors.push({ field: 'customer', message: 'Customer selection or customer ID is required.' })
      }

      let matchedCustomer = null
      if (body.customer_id) {
        matchedCustomer = await CustomerModel.findById(body.customer_id)
      }
      if (!matchedCustomer && body.customer) {
        const matchingCustomers = await CustomerModel.findAll({ search: body.customer.trim(), limit: 1 })
        if (matchingCustomers.length > 0) {
          matchedCustomer = matchingCustomers[0]
        }
      }

      if (!matchedCustomer && customerInput) {
        errors.push({
          field: 'customer_id',
          message: `Customer '${customerInput}' was not found in registered database records.`
        })
      }

      // 2. Branch context validation
      const user = req.user
      const isSuperAdmin = user?.isSuperAdmin || user?.role === 'Super Admin' || !user?.branch_id || user?.branch_id === 'ALL'
      const rawBranch = isSuperAdmin
        ? (body.branch_id || body.branchId || body.branch || matchedCustomer?.branch_id || '')
        : (user?.branch_id || 'BR-01')

      const cleanBranch = String(rawBranch).trim().toLowerCase()
      if (!cleanBranch || cleanBranch === 'all' || cleanBranch === 'all branches' || cleanBranch === 'global') {
        errors.push({ field: 'branch', message: 'A specific valid branch (e.g. Peshawar, Islamabad, Lahore) is required.' })
      }

      // 3. Line items validation
      const items = Array.isArray(body.items) ? body.items : []
      if (items.length > 0) {
        items.forEach((item, index) => {
          const desc = String(item.description !== undefined ? item.description : (item.product !== undefined ? item.product : (item.item || ''))).trim()
          if (!desc) {
            errors.push({ field: `items[${index}].description`, message: `Line item #${index + 1} requires a product description.` })
          }
          const qty = parseInt(item.quantity, 10)
          if (isNaN(qty) || qty <= 0) {
            errors.push({ field: `items[${index}].quantity`, message: `Line item #${index + 1} quantity must be a positive integer.` })
          }
        })
      } else if (!body.amount && !body.total) {
        errors.push({ field: 'items', message: 'Invoice must include at least one product line item or total amount.' })
      }

      if (errors.length > 0) {
        return res.status(422).json({
          ok: false,
          error: 'VALIDATION_FAILED',
          message: 'Invoice validation failed.',
          errors
        })
      }

      // Idempotency: if explicit ID passed and already exists, return existing
      const candidateId = body.id || body.invoice_id || body.invoiceId
      if (candidateId) {
        const existing = await InvoiceModel.findById(candidateId)
        if (existing) {
          if (!assertBranchAccess(existing.branch_id, req, res)) return
          return res.status(200).json(existing)
        }
      }

      let branchId = isSuperAdmin ? (resolveBranchId(rawBranch) || 'BR-01') : (resolveBranchId(user.branch_id) || 'BR-01')
      let branchName = getBranchName(branchId)

      const createdInvoice = await InvoiceModel.create({
        ...body,
        customer_id: matchedCustomer ? matchedCustomer.id : body.customer_id,
        customer: matchedCustomer ? matchedCustomer.name : body.customer,
        branch_id: branchId,
        branch: branchName
      })

      res.status(201).json(createdInvoice)
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({
          ok: false,
          error: 'DUPLICATE_ENTRY',
          message: 'An invoice with this invoice number already exists.'
        })
      }
      next(err)
    }
  },

  /**
   * PUT /api/v1/invoices/:id
   */
  async update(req, res, next) {
    try {
      const { id } = req.params
      const body = req.body || {}

      const existing = await InvoiceModel.findById(id)
      if (!existing) {
        return res.status(404).json({
          ok: false,
          error: 'NOT_FOUND',
          message: `Cannot update invoice: ID '${id}' not found.`
        })
      }

      // Prevent cross-branch IDOR
      if (!assertBranchAccess(existing.branch_id, req, res)) return

      const updated = await InvoiceModel.update(id, body)
      res.status(200).json(updated)
    } catch (err) {
      next(err)
    }
  },

  /**
   * POST /api/v1/invoices/:id/payments
   * Records a payment against the invoice in an atomic ACID transaction
   */
  async recordPayment(req, res, next) {
    try {
      const { id } = req.params
      const body = req.body || {}

      const existing = await InvoiceModel.findById(id)
      if (!existing) {
        return res.status(404).json({
          ok: false,
          error: 'NOT_FOUND',
          message: `Invoice '${id}' was not found.`
        })
      }

      // Prevent cross-branch IDOR
      if (!assertBranchAccess(existing.branch_id, req, res)) return

      const result = await InvoiceModel.recordPayment(id, body)
      res.status(201).json({
        ok: true,
        message: `Payment of PKR ${result.amount.toLocaleString()} successfully recorded for invoice ${id}.`,
        payment: result.payment,
        invoice: result.invoice,
        remainingBalance: result.remainingBalance
      })
    } catch (err) {
      if (err.code === 'NOT_FOUND') {
        return res.status(404).json({
          ok: false,
          error: 'NOT_FOUND',
          message: err.message
        })
      }
      if (err.code === 'INVOICE_CANCELLED' || err.code === 'EXCESSIVE_PAYMENT_AMOUNT') {
        return res.status(400).json({
          ok: false,
          error: err.code,
          message: err.message
        })
      }
      if (err.code === 'INVALID_PAYMENT_AMOUNT') {
        return res.status(422).json({
          ok: false,
          error: err.code,
          message: err.message
        })
      }
      if (err.code === 'DUPLICATE_PAYMENT' || err.code === 'ER_DUP_ENTRY' || err.message?.includes('Duplicate entry')) {
        return res.status(409).json({
          ok: false,
          error: 'DUPLICATE_PAYMENT',
          message: err.message?.includes('Duplicate entry')
            ? 'A payment with this transaction reference has already been processed.'
            : err.message
        })
      }
      next(err)
    }
  },

  /**
   * DELETE /api/v1/invoices/:id
   */
  async delete(req, res, next) {
    try {
      const { id } = req.params
      const existing = await InvoiceModel.findById(id)

      if (!existing) {
        return res.status(404).json({
          ok: false,
          error: 'NOT_FOUND',
          message: `Cannot delete invoice: ID '${id}' not found.`
        })
      }

      // Prevent cross-branch IDOR
      if (!assertBranchAccess(existing.branch_id, req, res)) return

      await InvoiceModel.delete(id)
      res.status(200).json({
        ok: true,
        message: `Invoice ${existing.invoice} has been removed.`,
        id: existing.id
      })
    } catch (err) {
      if (err.code === 'CANNOT_DELETE_PAID_INVOICE') {
        return res.status(400).json({
          ok: false,
          error: err.code,
          message: err.message
        })
      }
      next(err)
    }
  }
}
