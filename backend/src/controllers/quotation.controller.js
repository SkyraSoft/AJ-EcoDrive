import { QuotationModel } from '../models/quotation.model.js'
import { CustomerModel } from '../models/customer.model.js'
import { OrderModel } from '../models/order.model.js'
import { getEffectiveBranch, assertBranchAccess, resolveBranchId } from '../utils/branchScope.js'

export const QuotationController = {
  /**
   * GET /api/v1/quotations
   */
  async list(req, res, next) {
    try {
      const { status, search, limit, offset } = req.query

      // Multi-tenant branch context enforcement strictly derived from verified server-side identity
      const effectiveBranch = getEffectiveBranch(req)

      const quotations = await QuotationModel.findAll({
        branch_id: effectiveBranch,
        status,
        search,
        limit: limit ? parseInt(limit, 10) : 100,
        offset: offset ? parseInt(offset, 10) : 0
      })

      // Send array directly for standard collection contract
      res.status(200).json(quotations)
    } catch (err) {
      next(err)
    }
  },

  /**
   * GET /api/v1/quotations/:id
   */
  async getById(req, res, next) {
    try {
      const { id } = req.params
      const quotation = await QuotationModel.findById(id)

      if (!quotation) {
        return res.status(404).json({
          ok: false,
          error: 'NOT_FOUND',
          message: `Quotation with ID or quote number '${id}' not found`
        })
      }

      // Prevent cross-branch IDOR
      if (!assertBranchAccess(quotation.branch_id, req, res)) return

      res.status(200).json(quotation)
    } catch (err) {
      next(err)
    }
  },

  /**
   * POST /api/v1/quotations
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
          message: `Customer '${customerInput}' was not found in registered database records. Please register the customer first.`
        })
      }

      // 2. Branch context validation
      const user = req.user
      const isSuperAdmin = user?.isSuperAdmin || user?.role === 'Super Admin' || !user?.branch_id || user?.branch_id === 'ALL'
      const rawBranch = isSuperAdmin
        ? (body.branch_id || body.branchId || body.branch || '')
        : (user?.branch_id || 'BR-01')

      const cleanBranch = String(rawBranch).trim().toLowerCase()
      if (!cleanBranch || cleanBranch === 'all' || cleanBranch === 'all branches' || cleanBranch === 'global') {
        errors.push({ field: 'branch', message: 'A specific valid branch (e.g. Peshawar, Islamabad, Lahore) is required.' })
      }

      // 3. Line items validation
      const items = Array.isArray(body.items) ? body.items : []
      if (items.length === 0) {
        errors.push({ field: 'items', message: 'Quotation must include at least one product line item.' })
      } else {
        items.forEach((item, index) => {
          if (!item.product || String(item.product).trim() === '') {
            errors.push({ field: `items[${index}].product`, message: `Line item #${index + 1} requires a product name.` })
          }
          const qty = parseInt(item.quantity, 10)
          if (isNaN(qty) || qty <= 0) {
            errors.push({ field: `items[${index}].quantity`, message: `Line item #${index + 1} quantity must be a positive integer.` })
          }
          const price = parseFloat(String(item.sellingPrice || item.price || 0).replace(/[^0-9.]/g, ''))
          if (isNaN(price) || price < 0) {
            errors.push({ field: `items[${index}].sellingPrice`, message: `Line item #${index + 1} selling price must be non-negative.` })
          }
        })
      }

      // 4. Discount validation
      if (body.discount !== undefined && body.discount !== null) {
        const rawDisc = parseFloat(String(body.discount).replace(/[^0-9.]/g, ''))
        if (isNaN(rawDisc) || rawDisc < 0) {
          errors.push({ field: 'discount', message: 'Discount amount must be non-negative.' })
        }
      }

      if (errors.length > 0) {
        return res.status(422).json({
          ok: false,
          error: 'VALIDATION_FAILED',
          message: 'Quotation validation failed.',
          errors
        })
      }

      // Idempotency check
      const candidateId = body.id || body.quote || body.quote_id
      if (candidateId) {
        const existing = await QuotationModel.findById(candidateId)
        if (existing) {
          if (!assertBranchAccess(existing.branch_id, req, res)) return
          return res.status(200).json(existing)
        }
      }

      const canonicalBranchId = resolveBranchId(rawBranch) || (isSuperAdmin ? 'BR-01' : user.branch_id)

      // Calculate server-side total
      const calculatedSubtotal = items.reduce((sum, it) => {
        const price = parseFloat(String(it.sellingPrice || it.price || 0).replace(/[^0-9.]/g, '')) || 0
        const qty = parseInt(it.quantity, 10) || 1
        return sum + (price * qty)
      }, 0)

      const discountAmt = parseFloat(String(body.discount || 0).replace(/[^0-9.]/g, '')) || 0
      const calculatedTotal = Math.max(0, calculatedSubtotal - discountAmt)

      const newQuotation = await QuotationModel.create({
        ...body,
        branch_id: canonicalBranchId,
        customer_id: matchedCustomer ? matchedCustomer.id : body.customer_id,
        customer_name: matchedCustomer ? (matchedCustomer.name || matchedCustomer.code) : body.customer,
        subtotal: calculatedSubtotal,
        discount: discountAmt,
        total: calculatedTotal,
        items
      })

      res.status(201).json(newQuotation)
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({
          ok: false,
          error: 'DUPLICATE_ENTRY',
          message: 'A quotation with this quote number or ID already exists.'
        })
      }
      next(err)
    }
  },

  /**
   * PUT /api/v1/quotations/:id
   */
  async update(req, res, next) {
    try {
      const { id } = req.params
      const body = req.body || {}

      const existing = await QuotationModel.findById(id)
      if (!existing) {
        return res.status(404).json({
          ok: false,
          error: 'NOT_FOUND',
          message: `Cannot update quotation: ID '${id}' not found.`
        })
      }

      // Prevent cross-branch IDOR
      if (!assertBranchAccess(existing.branch_id, req, res)) return

      if (existing.sales_order_id) {
        return res.status(400).json({
          ok: false,
          error: 'CANNOT_MODIFY_LOCKED_QUOTATION',
          message: `Quotation '${id}' is already linked to Sales Order '${existing.sales_order_id}' and cannot be modified.`
        })
      }

      if (body.customer_id) {
        const cust = await CustomerModel.findById(body.customer_id)
        if (!cust) {
          return res.status(422).json({
            ok: false,
            error: 'VALIDATION_FAILED',
            message: `Customer '${body.customer_id}' does not exist in registered database records.`
          })
        }
      }

      const updated = await QuotationModel.update(id, body)
      res.status(200).json(updated)
    } catch (err) {
      next(err)
    }
  },

  /**
   * PATCH /api/v1/quotations/:id/status
   */
  async updateStatus(req, res, next) {
    try {
      const { id } = req.params
      const { status, statusClass, sales_order_id } = req.body || {}

      const existing = await QuotationModel.findById(id)
      if (!existing) {
        return res.status(404).json({
          ok: false,
          error: 'NOT_FOUND',
          message: `Cannot update status: Quotation '${id}' not found.`
        })
      }

      // Prevent cross-branch IDOR
      if (!assertBranchAccess(existing.branch_id, req, res)) return

      const validStatuses = ['Draft', 'Sent', 'Accepted', 'Expired', 'Cancelled', 'Open']
      if (status && !validStatuses.includes(status)) {
        return res.status(422).json({
          ok: false,
          error: 'VALIDATION_FAILED',
          message: `Invalid quotation status '${status}'. Must be one of: ${validStatuses.join(', ')}`
        })
      }

      const updated = await QuotationModel.updateStatus(id, { status, statusClass, sales_order_id })
      res.status(200).json(updated)
    } catch (err) {
      next(err)
    }
  },

  /**
   * POST /api/v1/quotations/:id/convert-to-order
   */
  async convertToOrder(req, res, next) {
    try {
      const { id } = req.params
      const body = req.body || {}

      const existing = await QuotationModel.findById(id)
      if (!existing) {
        return res.status(404).json({
          ok: false,
          error: 'NOT_FOUND',
          message: `Quotation '${id}' was not found.`
        })
      }

      // Prevent cross-branch IDOR
      if (!assertBranchAccess(existing.branch_id, req, res)) return

      const result = await OrderModel.convertFromQuotation(id, {
        unit_id: body.unitId || body.unit_id || null,
        salesperson: body.salesperson || body.assignedSalesperson || null,
        customOrderId: body.orderId || body.sales_order_id || null,
        paymentMethod: body.paymentMethod || null
      })

      const updatedQuotation = await QuotationModel.findById(id)

      res.status(200).json({
        ok: true,
        message: `Quotation ${id} successfully converted to Sales Order ${result.orderId}.`,
        quotation: updatedQuotation,
        order: result.order,
        orderId: result.orderId
      })
    } catch (err) {
      if (err.code === 'DUPLICATE_CONVERSION') {
        return res.status(409).json({
          ok: false,
          error: 'DUPLICATE_CONVERSION',
          message: err.message
        })
      }
      if (err.code === 'NOT_FOUND') {
        return res.status(404).json({
          ok: false,
          error: 'NOT_FOUND',
          message: err.message
        })
      }
      next(err)
    }
  },

  /**
   * DELETE /api/v1/quotations/:id
   */
  async delete(req, res, next) {
    try {
      const { id } = req.params
      const existing = await QuotationModel.findById(id)

      if (!existing) {
        return res.status(404).json({
          ok: false,
          error: 'NOT_FOUND',
          message: `Cannot delete quotation: ID '${id}' not found.`
        })
      }

      // Prevent cross-branch IDOR
      if (!assertBranchAccess(existing.branch_id, req, res)) return

      await QuotationModel.delete(id)
      res.status(200).json({
        ok: true,
        message: `Quotation ${existing.quote} has been removed.`,
        id: existing.id
      })
    } catch (err) {
      if (err.code === 'CANNOT_DELETE_ACCEPTED_QUOTATION') {
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
