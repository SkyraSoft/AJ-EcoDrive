import { AuditModel } from '../models/audit.model.js'
import { isUserSuperAdmin, getEffectiveBranch } from '../utils/branchScope.js'

export const AuditController = {
  /**
   * List audit logs with role-based scoping
   */
  async listLogs(req, res, next) {
    try {
      const user = req.user
      const isSuper = isUserSuperAdmin(user)
      
      let targetBranch = null
      if (isSuper) {
        // Super admin can filter by query branch_id or view all
        targetBranch = req.query.branch_id || null
      } else {
        // Non-super admin is strictly scoped to their assigned branch
        targetBranch = getEffectiveBranch(req)
      }

      const { search = '', entity_type = '', limit = 100, offset = 0 } = req.query

      const logs = await AuditModel.findAll({
        branch_id: targetBranch,
        search,
        entity_type,
        limit,
        offset
      })

      const total = await AuditModel.countAll({
        branch_id: targetBranch,
        search,
        entity_type
      })

      res.status(200).json({
        ok: true,
        data: logs,
        total,
        limit: Number(limit),
        offset: Number(offset)
      })
    } catch (err) {
      next(err)
    }
  },

  /**
   * Create an audit log record
   */
  async createLog(req, res, next) {
    try {
      const user = req.user || {}
      const logData = {
        ...req.body,
        user_id: req.body.user_id || user.id,
        user_name: req.body.user_name || user.name || 'System',
        role: req.body.role || user.role || 'Staff',
        branch_id: req.body.branch_id || user.branch_id || 'BR-01',
        branch: req.body.branch || user.branch || 'Peshawar',
        ip_address: req.ip || req.connection?.remoteAddress || '127.0.0.1'
      }

      const created = await AuditModel.createLog(logData)
      res.status(201).json({ ok: true, data: created })
    } catch (err) {
      next(err)
    }
  },

  /**
   * Get audit logs for specific entity
   */
  async getByEntity(req, res, next) {
    try {
      const { entityType, entityId } = req.params
      const logs = await AuditModel.findByEntity(entityType, entityId)
      res.status(200).json({ ok: true, data: logs })
    } catch (err) {
      next(err)
    }
  }
}
