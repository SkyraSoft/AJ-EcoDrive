import { LeadModel, ALLOWED_LEAD_STAGES, ALLOWED_LEAD_SOURCES } from '../models/lead.model.js'
import { getEffectiveBranch, assertBranchAccess, resolveBranchId } from '../utils/branchScope.js'
import { isValidPhoneNumber } from '../utils/phone.js'

export const LeadController = {
  /**
   * GET /api/v1/leads
   * List leads with branch scoping, filtering, and search
   */
  async getLeads(req, res, next) {
    try {
      const branchId = getEffectiveBranch(req)
      const { stage, status, source, product_id, search, limit = 100, offset = 0 } = req.query

      const leads = await LeadModel.findLeads({
        branch_id: branchId,
        stage,
        status,
        source,
        product_id,
        search,
        limit,
        offset
      })

      res.status(200).json(leads)
    } catch (err) {
      next(err)
    }
  },

  /**
   * GET /api/v1/leads/:id
   * Retrieve a single lead with branch isolation
   */
  async getLeadById(req, res, next) {
    try {
      const { id } = req.params
      const lead = await LeadModel.findLeadById(id)

      if (!lead) {
        return res.status(404).json({
          ok: false,
          error: 'NOT_FOUND',
          message: `Lead "${id}" was not found.`
        })
      }

      if (!assertBranchAccess(lead.branch_id, req, res)) {
        return
      }

      res.status(200).json(lead)
    } catch (err) {
      next(err)
    }
  },

  /**
   * POST /api/v1/leads
   * Create a new lead with server-side validation and branch isolation
   */
  async createLead(req, res, next) {
    try {
      const payload = req.body || {}

      const customerName = (payload.customer_name || payload.customer || payload.name || payload.customerName || '').trim()
      const phone = (payload.phone || '').trim()

      // Validation 1: Customer Name
      if (!customerName) {
        return res.status(400).json({
          ok: false,
          error: 'VALIDATION_ERROR',
          message: 'Customer name is required to register a lead.'
        })
      }

      // Validation 2: Phone Number
      if (!phone) {
        return res.status(400).json({
          ok: false,
          error: 'VALIDATION_ERROR',
          message: 'Phone number is required to register a lead.'
        })
      }

      if (!isValidPhoneNumber(phone)) {
        return res.status(400).json({
          ok: false,
          error: 'VALIDATION_ERROR',
          message: 'A valid Pakistani phone number (at least 10 digits) is required.'
        })
      }

      // Validation 3: Stage
      const stage = payload.stage || payload.status || 'New'
      if (stage && !ALLOWED_LEAD_STAGES.includes(stage)) {
        return res.status(400).json({
          ok: false,
          error: 'VALIDATION_ERROR',
          message: `Invalid lead stage "${stage}". Allowed stages: ${ALLOWED_LEAD_STAGES.join(', ')}.`
        })
      }

      // Validation 4: Source
      const source = payload.source || 'Walk-in'
      if (source && !ALLOWED_LEAD_SOURCES.includes(source)) {
        return res.status(400).json({
          ok: false,
          error: 'VALIDATION_ERROR',
          message: `Invalid lead source "${source}". Allowed sources: ${ALLOWED_LEAD_SOURCES.join(', ')}.`
        })
      }

      // Enforce branch isolation
      const user = req.user
      const isSuperAdmin = user?.role === 'Super Admin' || user?.isSuperAdmin || !user?.branch_id || user?.branch_id === 'ALL'
      if (!isSuperAdmin) {
        const userBranch = resolveBranchId(user?.branch_id)
        if (payload.branch_id && resolveBranchId(payload.branch_id) !== userBranch) {
          return res.status(403).json({
            ok: false,
            error: 'FORBIDDEN',
            message: `You cannot create a lead for branch "${payload.branch_id}". Access restricted to "${user?.branch_id}".`
          })
        }
        payload.branch_id = userBranch
      }

      const created = await LeadModel.createLead(payload, user)
      res.status(201).json({
        ok: true,
        message: `Lead ${created.leadNo} registered successfully.`,
        lead: created,
        ...created
      })
    } catch (err) {
      if (err.status === 409 || err.code === 'CONFLICT' || err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({
          ok: false,
          error: 'CONFLICT',
          message: err.message
        })
      }
      if (err.status) {
        return res.status(err.status).json({
          ok: false,
          error: err.code || 'ERROR',
          message: err.message
        })
      }
      next(err)
    }
  },

  /**
   * PUT /api/v1/leads/:id
   * Update an existing lead record
   */
  async updateLead(req, res, next) {
    try {
      const { id } = req.params
      const existing = await LeadModel.findLeadById(id)

      if (!existing) {
        return res.status(404).json({
          ok: false,
          error: 'NOT_FOUND',
          message: `Lead "${id}" was not found.`
        })
      }

      if (!assertBranchAccess(existing.branch_id, req, res)) {
        return
      }

      const payload = req.body || {}

      if (payload.stage && !ALLOWED_LEAD_STAGES.includes(payload.stage)) {
        return res.status(400).json({
          ok: false,
          error: 'VALIDATION_ERROR',
          message: `Invalid lead stage "${payload.stage}". Allowed stages: ${ALLOWED_LEAD_STAGES.join(', ')}.`
        })
      }

      if (payload.phone && !isValidPhoneNumber(payload.phone)) {
        return res.status(400).json({
          ok: false,
          error: 'VALIDATION_ERROR',
          message: 'A valid Pakistani phone number (at least 10 digits) is required.'
        })
      }

      const updated = await LeadModel.updateLead(id, payload, req.user)
      res.status(200).json({
        ok: true,
        message: `Lead "${id}" updated successfully.`,
        lead: updated,
        ...updated
      })
    } catch (err) {
      if (err.status === 409 || err.code === 'CONFLICT' || err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({
          ok: false,
          error: 'CONFLICT',
          message: err.message
        })
      }
      if (err.status) {
        return res.status(err.status).json({
          ok: false,
          error: err.code || 'ERROR',
          message: err.message
        })
      }
      next(err)
    }
  },

  /**
   * DELETE /api/v1/leads/:id
   */
  async deleteLead(req, res, next) {
    try {
      const { id } = req.params
      const existing = await LeadModel.findLeadById(id)

      if (!existing) {
        return res.status(404).json({
          ok: false,
          error: 'NOT_FOUND',
          message: `Lead "${id}" was not found.`
        })
      }

      if (!assertBranchAccess(existing.branch_id, req, res)) {
        return
      }

      await LeadModel.deleteLead(id)
      res.status(200).json({
        ok: true,
        message: `Lead "${id}" removed successfully.`
      })
    } catch (err) {
      next(err)
    }
  },

  /**
   * POST /api/v1/leads/:id/convert
   * Atomic Lead-to-Customer conversion
   */
  async convertLead(req, res, next) {
    try {
      const { id } = req.params
      const payload = req.body || {}

      // 1. Fetch lead for pre-transaction validation
      const lead = await LeadModel.findLeadById(id)
      if (!lead) {
        return res.status(404).json({
          ok: false,
          error: 'NOT_FOUND',
          message: `Lead "${id}" was not found.`
        })
      }

      // 2. Branch access check
      if (!assertBranchAccess(lead.branch_id, req, res)) {
        return
      }

      // 3. Repeated conversion check
      if (lead.customer_id || lead.stage === 'Converted') {
        return res.status(400).json({
          ok: false,
          error: 'LEAD_ALREADY_CONVERTED',
          message: `Lead "${lead.lead_number}" has already been converted to customer "${lead.customer_id}".`
        })
      }

      // 4. Validate required customer fields before starting transaction
      const customerName = (payload.name || payload.customer_name || payload.customer || lead.customer_name || '').trim()
      if (!customerName) {
        return res.status(422).json({
          ok: false,
          error: 'VALIDATION_FAILED',
          message: 'Customer name is required for conversion.'
        })
      }

      const phone = (payload.phone || lead.phone || '').trim()
      if (!phone || !isValidPhoneNumber(phone)) {
        return res.status(422).json({
          ok: false,
          error: 'VALIDATION_FAILED',
          message: 'A valid Pakistani phone number is required for customer conversion.'
        })
      }

      if (payload.cnic && String(payload.cnic).trim() !== '') {
        const cleanedCnic = String(payload.cnic).replace(/[^0-9]/g, '')
        if (cleanedCnic.length !== 13) {
          return res.status(422).json({
            ok: false,
            error: 'VALIDATION_FAILED',
            message: 'CNIC must consist of 13 digits (format: 12345-1234567-1).'
          })
        }
      }

      if (payload.email && String(payload.email).trim() !== '') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(String(payload.email).trim())) {
          return res.status(422).json({
            ok: false,
            error: 'VALIDATION_FAILED',
            message: 'Please provide a valid email address.'
          })
        }
      }

      // 5. Execute conversion inside atomic transaction with row locking
      const result = await LeadModel.convertLead(id, payload, req.user)

      res.status(200).json({
        ok: true,
        message: result.isExistingCustomer
          ? `Lead ${result.lead.leadNo} successfully linked to existing customer ${result.customer.id}.`
          : `Lead ${result.lead.leadNo} successfully converted to new customer ${result.customer.id}.`,
        lead: result.lead,
        customer: result.customer,
        isExistingCustomer: result.isExistingCustomer
      })
    } catch (err) {
      if (err.status === 409 || err.code === 'CONFLICT' || err.code === 'CUSTOMER_BRANCH_MISMATCH' || err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({
          ok: false,
          error: err.code || 'CONFLICT',
          message: err.message
        })
      }
      if (err.status === 400 || err.code === 'LEAD_ALREADY_CONVERTED') {
        return res.status(400).json({
          ok: false,
          error: err.code || 'BAD_REQUEST',
          message: err.message
        })
      }
      if (err.status === 403 || err.code === 'FORBIDDEN') {
        return res.status(403).json({
          ok: false,
          error: 'FORBIDDEN',
          message: err.message
        })
      }
      if (err.status === 404 || err.code === 'NOT_FOUND') {
        return res.status(404).json({
          ok: false,
          error: 'NOT_FOUND',
          message: err.message
        })
      }
      if (err.status) {
        return res.status(err.status).json({
          ok: false,
          error: err.code || 'ERROR',
          message: err.message
        })
      }
      next(err)
    }
  }
}
