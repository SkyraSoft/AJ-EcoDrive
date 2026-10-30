import { FollowUpModel, ALLOWED_FOLLOW_UP_STATUSES, ALLOWED_TASK_TYPES, ALLOWED_PRIORITIES } from '../models/follow_up.model.js'
import { getEffectiveBranch, assertBranchAccess, resolveBranchId } from '../utils/branchScope.js'

export const FollowUpController = {
  /**
   * GET /api/v1/follow-ups
   * List follow-ups with branch scoping and filters
   */
  async getFollowUps(req, res, next) {
    try {
      const branchId = getEffectiveBranch(req)
      const { status, lead_id, customer_id, search, limit = 100, offset = 0 } = req.query

      const followUps = await FollowUpModel.findFollowUps({
        branch_id: branchId,
        status,
        lead_id,
        customer_id,
        search,
        limit,
        offset
      })

      res.status(200).json(followUps)
    } catch (err) {
      next(err)
    }
  },

  /**
   * GET /api/v1/follow-ups/:id
   * Retrieve a single follow-up with branch isolation
   */
  async getFollowUpById(req, res, next) {
    try {
      const { id } = req.params
      const followUp = await FollowUpModel.findFollowUpById(id)

      if (!followUp) {
        return res.status(404).json({
          ok: false,
          error: 'NOT_FOUND',
          message: `Follow-up "${id}" was not found.`
        })
      }

      if (!assertBranchAccess(followUp.branch_id, req, res)) {
        return
      }

      res.status(200).json(followUp)
    } catch (err) {
      next(err)
    }
  },

  /**
   * POST /api/v1/follow-ups
   * Create a new follow-up with cross-branch reference checks
   */
  async createFollowUp(req, res, next) {
    try {
      const payload = req.body || {}

      const customerName = (payload.customer_name || payload.customer || payload.customerName || '').trim()

      if (!customerName) {
        return res.status(400).json({
          ok: false,
          error: 'VALIDATION_ERROR',
          message: 'Customer name is required for scheduling a follow-up.'
        })
      }

      if (payload.status && !ALLOWED_FOLLOW_UP_STATUSES.includes(payload.status)) {
        return res.status(400).json({
          ok: false,
          error: 'VALIDATION_ERROR',
          message: `Invalid follow-up status "${payload.status}". Allowed statuses: ${ALLOWED_FOLLOW_UP_STATUSES.join(', ')}.`
        })
      }

      if (payload.priority && !ALLOWED_PRIORITIES.includes(payload.priority)) {
        return res.status(400).json({
          ok: false,
          error: 'VALIDATION_ERROR',
          message: `Invalid follow-up priority "${payload.priority}". Allowed: ${ALLOWED_PRIORITIES.join(', ')}.`
        })
      }

      // Enforce branch isolation for non-superadmin
      const user = req.user
      const isSuperAdmin = user?.role === 'Super Admin' || user?.isSuperAdmin || !user?.branch_id || user?.branch_id === 'ALL'
      if (!isSuperAdmin) {
        const userBranch = resolveBranchId(user?.branch_id)
        if (payload.branch_id && resolveBranchId(payload.branch_id) !== userBranch) {
          return res.status(403).json({
            ok: false,
            error: 'FORBIDDEN',
            message: `You cannot schedule a follow-up for branch "${payload.branch_id}". Access restricted to "${user?.branch_id}".`
          })
        }
        payload.branch_id = userBranch
      }

      const created = await FollowUpModel.createFollowUp(payload, user)
      res.status(201).json({
        ok: true,
        message: `Follow-up for ${created.customer} scheduled successfully.`,
        followUp: created,
        ...created
      })
    } catch (err) {
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
   * PUT /api/v1/follow-ups/:id
   * Update an existing follow-up
   */
  async updateFollowUp(req, res, next) {
    try {
      const { id } = req.params
      const existing = await FollowUpModel.findFollowUpById(id)

      if (!existing) {
        return res.status(404).json({
          ok: false,
          error: 'NOT_FOUND',
          message: `Follow-up "${id}" was not found.`
        })
      }

      if (!assertBranchAccess(existing.branch_id, req, res)) {
        return
      }

      const payload = req.body || {}

      if (payload.status && !ALLOWED_FOLLOW_UP_STATUSES.includes(payload.status)) {
        return res.status(400).json({
          ok: false,
          error: 'VALIDATION_ERROR',
          message: `Invalid follow-up status "${payload.status}". Allowed statuses: ${ALLOWED_FOLLOW_UP_STATUSES.join(', ')}.`
        })
      }

      const updated = await FollowUpModel.updateFollowUp(id, payload, req.user)
      res.status(200).json({
        ok: true,
        message: `Follow-up "${id}" updated successfully.`,
        followUp: updated,
        ...updated
      })
    } catch (err) {
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
   * POST /api/v1/follow-ups/:id/complete
   * Mark follow-up as Completed
   */
  async completeFollowUp(req, res, next) {
    try {
      const { id } = req.params
      const existing = await FollowUpModel.findFollowUpById(id)

      if (!existing) {
        return res.status(404).json({
          ok: false,
          error: 'NOT_FOUND',
          message: `Follow-up "${id}" was not found.`
        })
      }

      if (!assertBranchAccess(existing.branch_id, req, res)) {
        return
      }

      const completed = await FollowUpModel.completeFollowUp(id)
      res.status(200).json({
        ok: true,
        message: `Follow-up "${id}" marked as completed.`,
        followUp: completed,
        ...completed
      })
    } catch (err) {
      next(err)
    }
  },

  /**
   * DELETE /api/v1/follow-ups/:id
   */
  async deleteFollowUp(req, res, next) {
    try {
      const { id } = req.params
      const existing = await FollowUpModel.findFollowUpById(id)

      if (!existing) {
        return res.status(404).json({
          ok: false,
          error: 'NOT_FOUND',
          message: `Follow-up "${id}" was not found.`
        })
      }

      if (!assertBranchAccess(existing.branch_id, req, res)) {
        return
      }

      await FollowUpModel.deleteFollowUp(id)
      res.status(200).json({
        ok: true,
        message: `Follow-up "${id}" removed successfully.`
      })
    } catch (err) {
      next(err)
    }
  }
}
