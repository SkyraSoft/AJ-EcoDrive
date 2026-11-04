import { query } from '../config/db.js'

function formatAuditLogRow(r) {
  if (!r) return null
  let beforeState = null
  let afterState = null
  try {
    beforeState = typeof r.before_state === 'string' ? JSON.parse(r.before_state) : r.before_state
  } catch (e) {
    beforeState = r.before_state
  }
  try {
    afterState = typeof r.after_state === 'string' ? JSON.parse(r.after_state) : r.after_state
  } catch (e) {
    afterState = r.after_state
  }

  return {
    id: r.id,
    userId: r.user_id,
    user_id: r.user_id,
    userName: r.user_name,
    user_name: r.user_name,
    role: r.role,
    branchId: r.branch_id,
    branch_id: r.branch_id,
    branch: r.branch,
    actingUserBranchId: r.acting_user_branch_id,
    acting_user_branch_id: r.acting_user_branch_id,
    actingUserBranch: r.acting_user_branch,
    acting_user_branch: r.acting_user_branch,
    affectedBranchId: r.affected_branch_id,
    affected_branch_id: r.affected_branch_id,
    affectedBranch: r.affected_branch,
    affected_branch: r.affected_branch,
    sourceBranchId: r.source_branch_id,
    source_branch_id: r.source_branch_id,
    sourceBranch: r.source_branch,
    source_branch: r.source_branch,
    destinationBranchId: r.destination_branch_id,
    destination_branch_id: r.destination_branch_id,
    destinationBranch: r.destination_branch,
    destination_branch: r.destination_branch,
    action: r.action,
    entityType: r.entity_type,
    entity_type: r.entity_type,
    entityId: r.entity_id,
    entity_id: r.entity_id,
    details: r.details,
    beforeState,
    before_state: beforeState,
    afterState,
    after_state: afterState,
    ipAddress: r.ip_address,
    ip_address: r.ip_address,
    status: r.status,
    timestamp: r.created_at ? new Date(r.created_at).toISOString().replace('T', ' ').slice(0, 16) : 'Just now',
    createdAt: r.created_at,
    created_at: r.created_at
  }
}

export const AuditModel = {
  /**
   * Insert a new persistent audit log entry
   */
  async createLog(data) {
    const id = data.id || `LOG-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    const sql = `
      INSERT INTO \`audit_logs\` (
        \`id\`, \`user_id\`, \`user_name\`, \`role\`,
        \`branch_id\`, \`branch\`,
        \`acting_user_branch_id\`, \`acting_user_branch\`,
        \`affected_branch_id\`, \`affected_branch\`,
        \`source_branch_id\`, \`source_branch\`,
        \`destination_branch_id\`, \`destination_branch\`,
        \`action\`, \`entity_type\`, \`entity_id\`,
        \`details\`, \`before_state\`, \`after_state\`,
        \`ip_address\`, \`status\`
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `
    const beforeStateJson = data.before_state ? (typeof data.before_state === 'object' ? JSON.stringify(data.before_state) : String(data.before_state)) : null
    const afterStateJson = data.after_state ? (typeof data.after_state === 'object' ? JSON.stringify(data.after_state) : String(data.after_state)) : null

    const params = [
      id,
      data.user_id || data.userId || null,
      data.user_name || data.userName || 'System',
      data.role || 'Staff',
      data.branch_id || data.branchId || null,
      data.branch || null,
      data.acting_user_branch_id || data.actingUserBranchId || null,
      data.acting_user_branch || data.actingUserBranch || null,
      data.affected_branch_id || data.affectedBranchId || null,
      data.affected_branch || data.affectedBranch || null,
      data.source_branch_id || data.sourceBranchId || null,
      data.source_branch || data.sourceBranch || null,
      data.destination_branch_id || data.destinationBranchId || null,
      data.destination_branch || data.destinationBranch || null,
      data.action,
      data.entity_type || data.entityType || 'system',
      data.entity_id || data.entityId || null,
      typeof data.details === 'object' ? JSON.stringify(data.details) : (data.details || null),
      beforeStateJson,
      afterStateJson,
      data.ip_address || data.ipAddress || null,
      data.status || 'Success'
    ]

    await query(sql, params)
    return { id, ...data }
  },

  /**
   * Retrieve audit logs with multi-branch awareness and filtering
   */
  async findAll({ branch_id = null, search = '', entity_type = '', limit = 100, offset = 0 } = {}) {
    let sql = 'SELECT * FROM `audit_logs` WHERE 1=1'
    const params = []

    const isGlobal = !branch_id || branch_id === 'ALL' || branch_id === 'All Branches'
    if (!isGlobal) {
      sql += ' AND (`branch_id` = ? OR `acting_user_branch_id` = ? OR `affected_branch_id` = ? OR `source_branch_id` = ? OR `destination_branch_id` = ? OR `branch` = ?)'
      params.push(branch_id, branch_id, branch_id, branch_id, branch_id, branch_id)
    }

    if (entity_type) {
      sql += ' AND `entity_type` = ?'
      params.push(entity_type)
    }

    if (search && search.trim()) {
      const q = `%${search.trim()}%`
      sql += ' AND (`action` LIKE ? OR `details` LIKE ? OR `user_name` LIKE ? OR `entity_id` LIKE ? OR `branch` LIKE ?)'
      params.push(q, q, q, q, q)
    }

    sql += ' ORDER BY `created_at` DESC LIMIT ? OFFSET ?'
    params.push(Number(limit), Number(offset))

    const rows = await query(sql, params)
    return rows.map(formatAuditLogRow)
  },

  /**
   * Count total logs matching filter
   */
  async countAll({ branch_id = null, search = '', entity_type = '' } = {}) {
    let sql = 'SELECT COUNT(*) as count FROM `audit_logs` WHERE 1=1'
    const params = []

    const isGlobal = !branch_id || branch_id === 'ALL' || branch_id === 'All Branches'
    if (!isGlobal) {
      sql += ' AND (`branch_id` = ? OR `acting_user_branch_id` = ? OR `affected_branch_id` = ? OR `source_branch_id` = ? OR `destination_branch_id` = ? OR `branch` = ?)'
      params.push(branch_id, branch_id, branch_id, branch_id, branch_id, branch_id)
    }

    if (entity_type) {
      sql += ' AND `entity_type` = ?'
      params.push(entity_type)
    }

    if (search && search.trim()) {
      const q = `%${search.trim()}%`
      sql += ' AND (`action` LIKE ? OR `details` LIKE ? OR `user_name` LIKE ? OR `entity_id` LIKE ? OR `branch` LIKE ?)'
      params.push(q, q, q, q, q)
    }

    const rows = await query(sql, params)
    return rows[0]?.count || 0
  },

  /**
   * Find logs for specific entity
   */
  async findByEntity(entity_type, entity_id) {
    const sql = 'SELECT * FROM `audit_logs` WHERE `entity_type` = ? AND `entity_id` = ? ORDER BY `created_at` DESC'
    const rows = await query(sql, [entity_type, entity_id])
    return rows.map(formatAuditLogRow)
  }
}

