import { AfterSalesModel } from '../models/after_sales.model.js'
import { getEffectiveBranch, assertBranchAccess } from '../utils/branchScope.js'

export const AfterSalesController = {
  // ==========================================================================
  // 1. SERVICE CASES
  // ==========================================================================

  async getCases(req, res, next) {
    try {
      const branchId = getEffectiveBranch(req)
      const { status, priority, category, search, limit = 100, offset = 0 } = req.query

      const cases = await AfterSalesModel.findCases({
        branch_id: branchId,
        status,
        priority,
        category,
        search,
        limit,
        offset
      })

      res.status(200).json(cases)
    } catch (err) {
      next(err)
    }
  },

  async getCaseById(req, res, next) {
    try {
      const { id } = req.params
      const caseItem = await AfterSalesModel.findCaseById(id)

      if (!caseItem) {
        return res.status(404).json({
          ok: false,
          error: 'NOT_FOUND',
          message: `Service case "${id}" was not found.`
        })
      }

      if (!assertBranchAccess(caseItem.branch_id, req, res)) {
        return
      }

      res.status(200).json(caseItem)
    } catch (err) {
      next(err)
    }
  },

  async createCase(req, res, next) {
    try {
      const payload = req.body || {}

      const customer = payload.customer || payload.customer_name
      const issue = payload.issue || payload.complaint || payload.symptoms

      if (!customer || !String(customer).trim()) {
        return res.status(400).json({
          ok: false,
          error: 'VALIDATION_ERROR',
          message: 'Customer name is required to create a service case.'
        })
      }

      if (!issue || !String(issue).trim()) {
        return res.status(400).json({
          ok: false,
          error: 'VALIDATION_ERROR',
          message: 'Issue/complaint description is required to create a service case.'
        })
      }

      // Enforce branch isolation for non-superadmin creating cases
      const user = req.user
      if (user?.branch_id && user.branch_id !== 'ALL' && user.role !== 'Super Admin') {
        if (payload.branch_id && payload.branch_id !== user.branch_id) {
          return res.status(403).json({
            ok: false,
            error: 'FORBIDDEN',
            message: `You cannot create a service case for branch "${payload.branch_id}". Access restricted to "${user.branch_id}".`
          })
        }
        payload.branch_id = user.branch_id
      }

      const created = await AfterSalesModel.createCase(payload, user)
      res.status(201).json({
        ok: true,
        message: `Service case "${created.caseId}" created successfully.`,
        case: created,
        ...created
      })
    } catch (err) {
      next(err)
    }
  },

  async updateCase(req, res, next) {
    try {
      const { id } = req.params
      const existing = await AfterSalesModel.findCaseById(id)

      if (!existing) {
        return res.status(404).json({
          ok: false,
          error: 'NOT_FOUND',
          message: `Service case "${id}" was not found.`
        })
      }

      if (!assertBranchAccess(existing.branch_id, req, res)) {
        return
      }

      const updated = await AfterSalesModel.updateCase(id, req.body, req.user)
      res.status(200).json({
        ok: true,
        message: `Service case "${id}" updated successfully.`,
        case: updated,
        ...updated
      })
    } catch (err) {
      next(err)
    }
  },

  // ==========================================================================
  // 2. REPAIR JOBS
  // ==========================================================================

  async getRepairJobs(req, res, next) {
    try {
      const branchId = getEffectiveBranch(req)
      const { status, technician, case_id, search, limit = 100, offset = 0 } = req.query

      const repairs = await AfterSalesModel.findRepairJobs({
        branch_id: branchId,
        status,
        technician,
        case_id,
        search,
        limit,
        offset
      })

      res.status(200).json(repairs)
    } catch (err) {
      next(err)
    }
  },

  async getRepairJobById(req, res, next) {
    try {
      const { id } = req.params
      const repair = await AfterSalesModel.findRepairJobById(id)

      if (!repair) {
        return res.status(404).json({
          ok: false,
          error: 'NOT_FOUND',
          message: `Repair job "${id}" was not found.`
        })
      }

      if (!assertBranchAccess(repair.branch_id, req, res)) {
        return
      }

      res.status(200).json(repair)
    } catch (err) {
      next(err)
    }
  },

  async createRepairJob(req, res, next) {
    try {
      const payload = req.body || {}
      let customer = payload.customer || payload.customer_name
      if (!customer && payload.case_id) {
        const linkedCase = await AfterSalesModel.findCaseById(payload.case_id)
        if (linkedCase) {
          customer = linkedCase.customer || linkedCase.customer_name
          payload.customer = customer
          payload.customer_id = linkedCase.customer_id
          payload.customer_phone = linkedCase.customerPhone || linkedCase.customer_phone
          payload.unit_id = linkedCase.unit_id
          payload.unit_serial = linkedCase.unitSerial || linkedCase.unit_serial
          payload.unit_model = linkedCase.unitModel || linkedCase.unit_model
          payload.vin = linkedCase.vin
        }
      }
      const diagnosis = payload.diagnosis || payload.diagnosis_notes || payload.diagnosisSummary || payload.issue

      if (!customer || !String(customer).trim()) {
        return res.status(400).json({
          ok: false,
          error: 'VALIDATION_ERROR',
          message: 'Customer name is required to create a repair job.'
        })
      }

      if (!diagnosis || !String(diagnosis).trim()) {
        return res.status(400).json({
          ok: false,
          error: 'VALIDATION_ERROR',
          message: 'Diagnostic findings/details are required to create a repair job.'
        })
      }

      // Validate parts if provided
      if (Array.isArray(payload.partsList)) {
        for (const p of payload.partsList) {
          const qty = parseFloat(p.qty || p.quantity || 1)
          const cost = parseFloat(p.rawCost ?? p.cost ?? p.unitPrice ?? p.unit_price ?? 0)
          if (qty <= 0) {
            return res.status(400).json({
              ok: false,
              error: 'VALIDATION_ERROR',
              message: `Part quantity for "${p.part || p.itemName || 'item'}" must be greater than zero.`
            })
          }
          if (cost < 0) {
            return res.status(400).json({
              ok: false,
              error: 'VALIDATION_ERROR',
              message: `Part cost for "${p.part || p.itemName || 'item'}" cannot be negative.`
            })
          }
        }
      }

      // Enforce branch isolation
      const user = req.user
      if (user?.branch_id && user.branch_id !== 'ALL' && user.role !== 'Super Admin') {
        if (payload.branch_id && payload.branch_id !== user.branch_id) {
          return res.status(403).json({
            ok: false,
            error: 'FORBIDDEN',
            message: `You cannot create a repair job for branch "${payload.branch_id}". Access restricted to "${user.branch_id}".`
          })
        }
        payload.branch_id = user.branch_id
      }

      const created = await AfterSalesModel.createRepairJob(payload, user)
      res.status(201).json({
        ok: true,
        message: `Repair job "${created.repairId}" created successfully.`,
        repair: created,
        ...created
      })
    } catch (err) {
      next(err)
    }
  },

  async updateRepairJob(req, res, next) {
    try {
      const { id } = req.params
      const existing = await AfterSalesModel.findRepairJobById(id)

      if (!existing) {
        return res.status(404).json({
          ok: false,
          error: 'NOT_FOUND',
          message: `Repair job "${id}" was not found.`
        })
      }

      if (!assertBranchAccess(existing.branch_id, req, res)) {
        return
      }

      const updated = await AfterSalesModel.updateRepairJob(id, req.body, req.user)
      res.status(200).json({
        ok: true,
        message: `Repair job "${id}" updated successfully.`,
        repair: updated,
        ...updated
      })
    } catch (err) {
      if (err.status) {
        return res.status(err.status).json({
          ok: false,
          error: err.status === 409 ? 'CONFLICT' : 'ERROR',
          message: err.message
        })
      }
      next(err)
    }
  },

  async completeRepairJob(req, res, next) {
    try {
      const { id } = req.params
      const existing = await AfterSalesModel.findRepairJobById(id)

      if (!existing) {
        return res.status(404).json({
          ok: false,
          error: 'NOT_FOUND',
          message: `Repair job "${id}" was not found.`
        })
      }

      if (!assertBranchAccess(existing.branch_id, req, res)) {
        return
      }

      const completed = await AfterSalesModel.completeRepairJob(id, {
        user: req.user,
        notes: req.body?.notes
      })

      res.status(200).json({
        ok: true,
        message: `Repair job "${id}" completed successfully. Inventory spare parts consumed and serialized unit restored.`,
        repair: completed,
        ...completed
      })
    } catch (err) {
      if (err.status) {
        return res.status(err.status).json({
          ok: false,
          error: err.status === 409 ? 'CONFLICT' : (err.status === 400 ? 'INSUFFICIENT_STOCK' : 'ERROR'),
          message: err.message
        })
      }
      next(err)
    }
  },

  async postRepairToFinance(req, res, next) {
    try {
      const { id } = req.params
      const existing = await AfterSalesModel.findRepairJobById(id)

      if (!existing) {
        return res.status(404).json({
          ok: false,
          error: 'NOT_FOUND',
          message: `Repair job "${id}" was not found.`
        })
      }

      if (!assertBranchAccess(existing.branch_id, req, res)) {
        return
      }

      const result = await AfterSalesModel.postRepairToFinance(id, req.user)
      res.status(200).json({
        ok: true,
        ...result
      })
    } catch (err) {
      if (err.status) {
        return res.status(err.status).json({
          ok: false,
          error: err.status === 409 ? 'ALREADY_POSTED' : 'ERROR',
          message: err.message
        })
      }
      next(err)
    }
  },

  // ==========================================================================
  // 3. WARRANTY CLAIMS
  // ==========================================================================

  async getWarrantyClaims(req, res, next) {
    try {
      const branchId = getEffectiveBranch(req)
      const { status, search, limit = 100, offset = 0 } = req.query

      const claims = await AfterSalesModel.findWarrantyClaims({
        branch_id: branchId,
        status,
        search,
        limit,
        offset
      })

      res.status(200).json(claims)
    } catch (err) {
      next(err)
    }
  },

  async getWarrantyClaimById(req, res, next) {
    try {
      const { id } = req.params
      const claim = await AfterSalesModel.findWarrantyClaimById(id)

      if (!claim) {
        return res.status(404).json({
          ok: false,
          error: 'NOT_FOUND',
          message: `Warranty claim "${id}" was not found.`
        })
      }

      if (!assertBranchAccess(claim.branch_id, req, res)) {
        return
      }

      res.status(200).json(claim)
    } catch (err) {
      next(err)
    }
  },

  async createWarrantyClaim(req, res, next) {
    try {
      const payload = req.body || {}

      if (!payload.customer && !payload.customer_name) {
        return res.status(400).json({
          ok: false,
          error: 'VALIDATION_ERROR',
          message: 'Customer name is required for a warranty claim.'
        })
      }

      // Enforce branch isolation
      const user = req.user
      if (user?.branch_id && user.branch_id !== 'ALL' && user.role !== 'Super Admin') {
        payload.branch_id = user.branch_id
      }

      const created = await AfterSalesModel.createWarrantyClaim(payload, user)
      res.status(201).json({
        ok: true,
        message: `Warranty claim "${created.claimNumber}" registered successfully.`,
        claim: created,
        ...created
      })
    } catch (err) {
      next(err)
    }
  },

  async approveWarrantyClaim(req, res, next) {
    try {
      const { id } = req.params
      const existing = await AfterSalesModel.findWarrantyClaimById(id)

      if (!existing) {
        return res.status(404).json({
          ok: false,
          error: 'NOT_FOUND',
          message: `Warranty claim "${id}" was not found.`
        })
      }

      // Verify permission
      const user = req.user
      const isSuperAdmin = user?.role === 'Super Admin' || user?.isSuperAdmin
      const hasPerm = Array.isArray(user?.permissions) && user.permissions.includes('after_sales.warranty_approve')

      if (!isSuperAdmin && !hasPerm) {
        return res.status(403).json({
          ok: false,
          error: 'FORBIDDEN',
          message: 'You do not have authorization permission (after_sales.warranty_approve) to approve warranty claims.'
        })
      }

      if (!assertBranchAccess(existing.branch_id, req, res)) {
        return
      }

      const approved = await AfterSalesModel.approveWarrantyClaim(id, user)
      res.status(200).json({
        ok: true,
        message: `Warranty claim "${id}" approved successfully.`,
        claim: approved,
        ...approved
      })
    } catch (err) {
      if (err.status) {
        return res.status(err.status).json({
          ok: false,
          error: err.status === 409 ? 'CONFLICT' : 'ERROR',
          message: err.message
        })
      }
      next(err)
    }
  },

  async rejectWarrantyClaim(req, res, next) {
    try {
      const { id } = req.params
      const existing = await AfterSalesModel.findWarrantyClaimById(id)

      if (!existing) {
        return res.status(404).json({
          ok: false,
          error: 'NOT_FOUND',
          message: `Warranty claim "${id}" was not found.`
        })
      }

      // Verify permission
      const user = req.user
      const isSuperAdmin = user?.role === 'Super Admin' || user?.isSuperAdmin
      const hasPerm = Array.isArray(user?.permissions) && user.permissions.includes('after_sales.warranty_approve')

      if (!isSuperAdmin && !hasPerm) {
        return res.status(403).json({
          ok: false,
          error: 'FORBIDDEN',
          message: 'You do not have authorization permission (after_sales.warranty_approve) to reject warranty claims.'
        })
      }

      if (!assertBranchAccess(existing.branch_id, req, res)) {
        return
      }

      const reason = req.body?.reason || req.body?.rejection_reason || 'Claim conditions not satisfied.'
      const rejected = await AfterSalesModel.rejectWarrantyClaim(id, reason, user)
      res.status(200).json({
        ok: true,
        message: `Warranty claim "${id}" rejected.`,
        claim: rejected,
        ...rejected
      })
    } catch (err) {
      if (err.status) {
        return res.status(err.status).json({
          ok: false,
          error: err.status === 409 ? 'CONFLICT' : 'ERROR',
          message: err.message
        })
      }
      next(err)
    }
  },

  // ==========================================================================
  // 4. OVERVIEW & DASHBOARD
  // ==========================================================================

  async getOverview(req, res, next) {
    try {
      const overview = await AfterSalesModel.getOverview(req.user)
      res.status(200).json(overview)
    } catch (err) {
      next(err)
    }
  }
}
