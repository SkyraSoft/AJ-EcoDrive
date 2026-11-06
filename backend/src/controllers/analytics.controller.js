import { CustomReportModel } from '../models/analytics.model.js'
import { isUserSuperAdmin, getEffectiveBranch } from '../utils/branchScope.js'

const FORBIDDEN_SCOPES_FOR_BRANCH_MANAGER = ['all branches', 'all', 'global', 'company-wide']
const ANALYTICS_ADMIN_ROLES = ['Super Admin', 'Director', 'Owner']

export const AnalyticsController = {
  async listCustomReports(req, res, next) {
    try {
      const { category, search, limit, offset } = req.query
      const user = req.user

      // Branch Managers see only reports scoped to their branch
      let branchFilter = null
      if (!isUserSuperAdmin(user) && !ANALYTICS_ADMIN_ROLES.includes(user?.role)) {
        branchFilter = getEffectiveBranch(req) || user?.branch_id
      } else if (req.query.branch_id) {
        branchFilter = req.query.branch_id
      }

      const data = await CustomReportModel.findAll({
        category,
        search,
        limit,
        offset,
        branch_id: branchFilter
      })
      res.status(200).json({ ok: true, data })
    } catch (err) {
      next(err)
    }
  },

  async getCustomReportById(req, res, next) {
    try {
      const { id } = req.params
      const record = await CustomReportModel.findById(id)
      if (!record) {
        return res.status(404).json({ ok: false, error: 'NOT_FOUND', message: `Custom report ${id} not found` })
      }

      // Branch Manager cannot view reports scoped to All Branches or other branches
      if (!isUserSuperAdmin(req.user) && !ANALYTICS_ADMIN_ROLES.includes(req.user?.role)) {
        const userBranch = getEffectiveBranch(req) || req.user?.branch_id
        const isAllBranchesScope = FORBIDDEN_SCOPES_FOR_BRANCH_MANAGER.some(
          s => record.scope && record.scope.toLowerCase().includes(s)
        )
        if (isAllBranchesScope) {
          return res.status(403).json({
            ok: false,
            error: 'FORBIDDEN',
            message: 'Access denied: This report is scoped to all branches and requires administrative access.'
          })
        }
        if (record.branch_id && record.branch_id !== userBranch) {
          return res.status(403).json({
            ok: false,
            error: 'FORBIDDEN',
            message: 'Access denied: You can only view reports for your branch.'
          })
        }
      }

      res.status(200).json({ ok: true, data: record })
    } catch (err) {
      next(err)
    }
  },

  async createCustomReport(req, res, next) {
    try {
      if (!isUserSuperAdmin(req.user) && !ANALYTICS_ADMIN_ROLES.includes(req.user?.role)) {
        return res.status(403).json({
          ok: false,
          error: 'FORBIDDEN',
          message: 'Access denied: Creating custom reports requires administrative authorization.'
        })
      }

      const name = req.body.name || req.body.report
      if (!name || !String(name).trim()) {
        return res.status(400).json({ ok: false, error: 'VALIDATION_ERROR', message: 'Report title / name is required' })
      }

      // Prevent non-superadmins from setting broad scope
      let scope = req.body.scope || 'All Branches'
      if (!isUserSuperAdmin(req.user)) {
        const userBranch = req.user?.branch_id || 'BR-01'
        const isForbidden = FORBIDDEN_SCOPES_FOR_BRANCH_MANAGER.some(s => scope.toLowerCase().includes(s))
        if (isForbidden || (req.body.branch_id && req.body.branch_id !== userBranch)) {
          return res.status(403).json({
            ok: false,
            error: 'FORBIDDEN',
            message: 'Access denied: You cannot create company-wide reports or reports for other branches.'
          })
        }
      }

      // Derive owner and branch_id from JWT, never trust client
      const owner = req.user?.name || 'Super Admin'
      const ownerBranchId = req.user?.branch_id || 'BR-HQ'

      const created = await CustomReportModel.create({
        ...req.body,
        scope,
        owner,
        branch_id: isUserSuperAdmin(req.user) ? (req.body.branch_id || null) : ownerBranchId
      })
      res.status(201).json({ ok: true, data: created })
    } catch (err) {
      next(err)
    }
  },

  async updateCustomReport(req, res, next) {
    try {
      if (!isUserSuperAdmin(req.user) && !ANALYTICS_ADMIN_ROLES.includes(req.user?.role)) {
        return res.status(403).json({
          ok: false,
          error: 'FORBIDDEN',
          message: 'Access denied: Modifying custom reports requires administrative authorization.'
        })
      }

      const { id } = req.params
      const updated = await CustomReportModel.update(id, req.body)
      if (!updated) {
        return res.status(404).json({ ok: false, error: 'NOT_FOUND', message: `Custom report ${id} not found` })
      }
      res.status(200).json({ ok: true, data: updated })
    } catch (err) {
      next(err)
    }
  },

  async deleteCustomReport(req, res, next) {
    try {
      if (!isUserSuperAdmin(req.user) && !ANALYTICS_ADMIN_ROLES.includes(req.user?.role)) {
        return res.status(403).json({
          ok: false,
          error: 'FORBIDDEN',
          message: 'Access denied: Deleting custom reports requires administrative authorization.'
        })
      }

      const { id } = req.params
      const deleted = await CustomReportModel.delete(id)
      if (!deleted) {
        return res.status(404).json({ ok: false, error: 'NOT_FOUND', message: `Custom report ${id} not found` })
      }
      res.status(200).json({ ok: true, message: `Custom report ${id} deleted successfully` })
    } catch (err) {
      next(err)
    }
  }
}
