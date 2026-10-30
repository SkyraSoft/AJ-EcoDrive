import { OrderModel } from '../models/order.model.js'
import { CustomerModel } from '../models/customer.model.js'
import { getEffectiveBranch, assertBranchAccess, resolveBranchId, getBranchName } from '../utils/branchScope.js'

export const OrderController = {
  /**
   * GET /api/v1/orders
   */
  async list(req, res, next) {
    try {
      const { status, search, limit, offset } = req.query

      // Multi-tenant branch context enforcement strictly derived from verified server-side identity
      const effectiveBranch = getEffectiveBranch(req)

      const orders = await OrderModel.findAll({
        branch_id: effectiveBranch,
        status,
        search,
        limit: limit ? parseInt(limit, 10) : 100,
        offset: offset ? parseInt(offset, 10) : 0
      })

      // Send array directly for standard collection contract
      res.status(200).json(orders)
    } catch (err) {
      next(err)
    }
  },

  /**
   * GET /api/v1/orders/:id
   */
  async getById(req, res, next) {
    try {
      const { id } = req.params
      const order = await OrderModel.findById(id)

      if (!order) {
        return res.status(404).json({
          ok: false,
          error: 'NOT_FOUND',
          message: `Sales Order with ID or number '${id}' not found`
        })
      }

      // Prevent cross-branch IDOR
      if (!assertBranchAccess(order.branch_id, req, res)) return

      res.status(200).json(order)
    } catch (err) {
      next(err)
    }
  },

  /**
   * POST /api/v1/orders and POST /api/v1/orders/checkout
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
        ? (body.branch_id || body.branchId || body.branch || matchedCustomer?.branch_id || '')
        : (user?.branch_id || 'BR-01')

      const cleanBranch = String(rawBranch).trim().toLowerCase()
      if (!cleanBranch || cleanBranch === 'all' || cleanBranch === 'all branches' || cleanBranch === 'global') {
        errors.push({ field: 'branch', message: 'A specific valid branch (e.g. Peshawar, Islamabad, Lahore) is required.' })
      }

      // 3. Line items or product validation
      const items = Array.isArray(body.items) ? body.items : []
      if (items.length > 0) {
        items.forEach((item, index) => {
          if (!item.product || String(item.product).trim() === '') {
            errors.push({ field: `items[${index}].product`, message: `Line item #${index + 1} requires a product name.` })
          }
          const qty = parseInt(item.quantity, 10)
          if (isNaN(qty) || qty <= 0) {
            errors.push({ field: `items[${index}].quantity`, message: `Line item #${index + 1} quantity must be a positive integer.` })
          }
        })
      } else if (!body.product || String(body.product).trim() === '') {
        errors.push({ field: 'product', message: 'Sales order requires a valid product name.' })
        errors.push({ field: 'items', message: 'Sales order must include at least one product line item.' })
      }

      if (errors.length > 0) {
        return res.status(422).json({
          ok: false,
          error: 'VALIDATION_FAILED',
          message: 'Order validation failed.',
          errors
        })
      }

      // Idempotency: if explicit ID passed and already exists, return existing
      const candidateId = body.id || body.order_id || body.orderId
      if (candidateId) {
        const existing = await OrderModel.findById(candidateId)
        if (existing) {
          if (!assertBranchAccess(existing.branch_id, req, res)) return
          return res.status(200).json(existing)
        }
      }

      // Canonical branch mapping
      let branchId = isSuperAdmin ? (resolveBranchId(rawBranch) || 'BR-01') : (resolveBranchId(user.branch_id) || 'BR-01')
      let branchName = getBranchName(branchId)

      const createdOrder = await OrderModel.create({
        ...body,
        customer_id: matchedCustomer ? matchedCustomer.id : body.customer_id,
        customer: matchedCustomer ? matchedCustomer.name : body.customer,
        branch_id: branchId,
        branch: branchName
      })

      res.status(201).json(createdOrder)
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({
          ok: false,
          error: 'DUPLICATE_ENTRY',
          message: 'An order with this order number or quotation reference already exists.'
        })
      }
      next(err)
    }
  },

  /**
   * PUT /api/v1/orders/:id
   */
  async update(req, res, next) {
    try {
      const { id } = req.params
      const body = req.body || {}

      const existing = await OrderModel.findById(id)
      if (!existing) {
        return res.status(404).json({
          ok: false,
          error: 'NOT_FOUND',
          message: `Cannot update order: ID '${id}' not found.`
        })
      }

      // Prevent cross-branch IDOR
      if (!assertBranchAccess(existing.branch_id, req, res)) return

      // Validate customer if customer reference is changing
      if (body.customer_id && body.customer_id !== existing.customer_id) {
        const cust = await CustomerModel.findById(body.customer_id)
        if (!cust) {
          return res.status(422).json({
            ok: false,
            error: 'VALIDATION_FAILED',
            message: `Customer '${body.customer_id}' does not exist in registered database records.`
          })
        }
      }

      const updated = await OrderModel.update(id, body)
      res.status(200).json(updated)
    } catch (err) {
      next(err)
    }
  },

  /**
   * POST /api/v1/orders/:id/cancel
   */
  async cancel(req, res, next) {
    try {
      const { id } = req.params
      const existing = await OrderModel.findById(id)

      if (!existing) {
        return res.status(404).json({
          ok: false,
          error: 'NOT_FOUND',
          message: `Cannot cancel order: ID '${id}' not found.`
        })
      }

      // Prevent cross-branch IDOR
      if (!assertBranchAccess(existing.branch_id, req, res)) return

      const cancelled = await OrderModel.cancel(id)
      res.status(200).json({
        ok: true,
        message: `Order ${existing.order} has been cancelled.`,
        order: cancelled
      })
    } catch (err) {
      if (err.code === 'CANNOT_CANCEL_DELIVERED_ORDER') {
        return res.status(400).json({
          ok: false,
          error: err.code,
          message: err.message
        })
      }
      next(err)
    }
  },

  /**
   * DELETE /api/v1/orders/:id
   */
  async delete(req, res, next) {
    try {
      const { id } = req.params
      const existing = await OrderModel.findById(id)

      if (!existing) {
        return res.status(404).json({
          ok: false,
          error: 'NOT_FOUND',
          message: `Cannot delete order: ID '${id}' not found.`
        })
      }

      // Prevent cross-branch IDOR
      if (!assertBranchAccess(existing.branch_id, req, res)) return

      await OrderModel.delete(id)
      res.status(200).json({
        ok: true,
        message: `Order ${existing.order} has been removed.`,
        id: existing.id
      })
    } catch (err) {
      if (err.code === 'CANNOT_DELETE_ACTIVE_ORDER') {
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
