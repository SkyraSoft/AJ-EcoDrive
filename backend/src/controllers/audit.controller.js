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
   * Create an audit log record — strictly restricted to Super Admin.
   * Client-supplied identity fields are stripped and ignored;
   * all acting identity is derived authoritatively from the verified JWT.
   */
  async createLog(req, res, next) {
    try {
      if (!isUserSuperAdmin(req.user)) {
        return res.status(403).json({
          ok: false,
          error: 'FORBIDDEN',
          message: 'Access denied: Creating audit logs requires Super Admin authorization.'
        })
      }

      const user = req.user || {}
      const {
        user_id,
        user_name,
        user: clientUser,
        role,
        branch_id,
        branch,
        acting_user_branch_id,
        ip_address,
        ip,
        timestamp,
        created_at,
        updated_at,
        ...safeBody
      } = req.body || {}

      const logData = {
        ...safeBody,
        user_id: user.id || 'USR-ADMIN',
        user_name: user.name || 'Super Admin',
        user: user.name || 'Super Admin',
        role: user.role || 'Super Admin',
        branch_id: user.branch_id || 'BR-HQ',
        branch: user.branch_name || (user.branch_id ? user.branch_id : 'Head Office'),
        acting_user_branch_id: user.branch_id || 'BR-HQ',
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
