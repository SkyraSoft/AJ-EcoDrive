import { CustomerModel } from '../models/customer.model.js'
import { getEffectiveBranch, assertBranchAccess, resolveBranchId } from '../utils/branchScope.js'

export const CustomerController = {
  /**
   * GET /api/v1/customers
   */
  async list(req, res, next) {
    try {
      const { status, search, limit, offset } = req.query
      
      // Verified server-side multi-tenant branch context
      const effectiveBranch = getEffectiveBranch(req)

      const customers = await CustomerModel.findAll({
        branch_id: effectiveBranch,
        status,
        search,
        limit: limit ? parseInt(limit, 10) : 100,
        offset: offset ? parseInt(offset, 10) : 0
      })

      // Send array directly for standard collection contract
      res.status(200).json(customers)
    } catch (err) {
      next(err)
    }
  },

  /**
   * GET /api/v1/customers/:id
   */
  async getById(req, res, next) {
    try {
      const { id } = req.params
      const customer = await CustomerModel.findById(id)

      if (!customer) {
        return res.status(404).json({
          ok: false,
          error: 'NOT_FOUND',
          message: `Customer with ID or code '${id}' not found`
        })
      }

      // Prevent cross-branch IDOR
      if (!assertBranchAccess(customer.branch_id, req, res)) return

      res.status(200).json(customer)
    } catch (err) {
      next(err)
    }
  },

  /**
   * POST /api/v1/customers
   */
  async create(req, res, next) {
    try {
      const body = req.body || {}
      const errors = []

      // 1. Mandatory field validation
      const name = (body.name || `${body.firstName || ''} ${body.lastName || ''}`.trim()).trim()
      if (!name) {
        errors.push({ field: 'name', message: 'Customer name or first name is required.' })
      }

      const phone = (body.phone || '').trim()
      if (!phone) {
        errors.push({ field: 'phone', message: 'Customer contact phone number is required.' })
      }

      // 2. CNIC format check if provided
      if (body.cnic && body.cnic.trim() !== '') {
        const cleanedCnic = body.cnic.replace(/[^0-9]/g, '')
        if (cleanedCnic.length !== 13) {
          errors.push({ field: 'cnic', message: 'CNIC must consist of 13 digits (format: 12345-1234567-1).' })
        }
      }

      // 3. Email format check if provided
      if (body.email && body.email.trim() !== '') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(body.email.trim())) {
          errors.push({ field: 'email', message: 'Please provide a valid email address.' })
        }
      }

      if (errors.length > 0) {
        return res.status(422).json({
          ok: false,
          error: 'VALIDATION_FAILED',
          message: 'Customer validation failed.',
          errors
        })
      }

      // Branch derivation strictly from verified server-side identity
      const user = req.user
      const isSuperAdmin = user?.isSuperAdmin || user?.role === 'Super Admin' || !user?.branch_id || user?.branch_id === 'ALL'
      const branchId = isSuperAdmin
        ? (resolveBranchId(body.branch_id || body.branchId || body.branch) || 'BR-01')
        : (resolveBranchId(user.branch_id) || 'BR-01')

      // Check if customer already exists by explicit ID or code
      if (body.id || body.customer_id) {
        const existing = await CustomerModel.findById(body.id || body.customer_id)
        if (existing) {
          if (!assertBranchAccess(existing.branch_id, req, res)) return
          return res.status(200).json(existing)
        }
      }

      const newCustomer = await CustomerModel.create({
        ...body,
        name,
        phone,
        branch_id: branchId
      })

      res.status(201).json(newCustomer)
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({
          ok: false,
          error: 'DUPLICATE_ENTRY',
          message: 'A customer with this code or identifier already exists in the system.'
        })
      }
      next(err)
    }
  },

  /**
   * PUT /api/v1/customers/:id
   */
  async update(req, res, next) {
    try {
      const { id } = req.params
      const body = req.body || {}

      const existing = await CustomerModel.findById(id)
      if (!existing) {
        return res.status(404).json({
          ok: false,
          error: 'NOT_FOUND',
          message: `Cannot update customer: ID '${id}' not found.`
        })
      }

      // Prevent cross-branch IDOR
      if (!assertBranchAccess(existing.branch_id, req, res)) return

      const updated = await CustomerModel.update(id, body)
      res.status(200).json(updated)
    } catch (err) {
      next(err)
    }
  },

  /**
   * DELETE /api/v1/customers/:id
   */
  async delete(req, res, next) {
    try {
      const { id } = req.params
      const existing = await CustomerModel.findById(id)

      if (!existing) {
        return res.status(404).json({
          ok: false,
          error: 'NOT_FOUND',
          message: `Cannot delete customer: ID '${id}' not found.`
        })
      }

      // Prevent cross-branch IDOR
      if (!assertBranchAccess(existing.branch_id, req, res)) return

      await CustomerModel.delete(id)
      res.status(200).json({
        ok: true,
        message: `Customer ${existing.name} (${existing.id}) has been removed.`,
        id: existing.id
      })
    } catch (err) {
      if (err.code === 'CANNOT_DELETE_ACTIVE_CUSTOMER') {
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
