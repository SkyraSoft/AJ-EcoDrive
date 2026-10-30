import { query } from '../config/db.js'
import bcrypt from 'bcryptjs'

export const UserModel = {
  /**
   * Find user by ID including role, branch, and permissions
   */
  async findById(id) {
    const sql = `
      SELECT 
        u.id, u.username, u.email, u.name, u.role_id, u.branch_id, u.status, u.phone,
        u.last_login_at, u.created_at, u.updated_at,
        r.name as role,
        b.name as branch_name, b.code as branch_code
      FROM \`users\` u
      LEFT JOIN \`roles\` r ON u.role_id = r.id
      LEFT JOIN \`branches\` b ON u.branch_id = b.id
      WHERE u.id = ?
      LIMIT 1
    `
    const rows = await query(sql, [id])
    if (!rows || rows.length === 0) return null

    const user = rows[0]
    user.permissions = await this.getPermissionsForRole(user.role_id)
    return user
  },

  /**
   * Find user by username or email for authentication (includes password_hash)
   */
  async findByUsernameOrEmail(identifier) {
    if (!identifier) return null
    const clean = String(identifier).trim().toLowerCase()

    const sql = `
      SELECT 
        u.id, u.username, u.email, u.password_hash, u.name, u.role_id, u.branch_id, u.status, u.phone,
        u.last_login_at, u.created_at,
        r.name as role,
        b.name as branch_name, b.code as branch_code
      FROM \`users\` u
      LEFT JOIN \`roles\` r ON u.role_id = r.id
      LEFT JOIN \`branches\` b ON u.branch_id = b.id
      WHERE LOWER(u.username) = ? OR LOWER(u.email) = ?
      LIMIT 1
    `
    const rows = await query(sql, [clean, clean])
    if (!rows || rows.length === 0) return null

    const user = rows[0]
    user.permissions = await this.getPermissionsForRole(user.role_id)
    return user
  },

  /**
   * Verify plaintext password against stored bcrypt hash
   */
  async verifyPassword(plainPassword, passwordHash) {
    if (!plainPassword || !passwordHash) return false
    return bcrypt.compare(String(plainPassword), String(passwordHash))
  },

  /**
   * Update last login timestamp
   */
  async updateLastLogin(userId) {
    await query('UPDATE `users` SET `last_login_at` = CURRENT_TIMESTAMP WHERE `id` = ?', [userId])
  },

  /**
   * Get list of permission codes for a role
   */
  async getPermissionsForRole(roleId) {
    if (!roleId) return []
    const sql = `
      SELECT p.code
      FROM \`role_permissions\` rp
      INNER JOIN \`permissions\` p ON rp.permission_id = p.id
      WHERE rp.role_id = ?
    `
    const rows = await query(sql, [roleId])
    return rows.map(r => r.code)
  },

  /**
   * List users with optional branch, role, or search filtering
   */
  async findAll({ branch_id, role_id, search, status, limit = 100, offset = 0 } = {}) {
    let sql = `
      SELECT 
        u.id, u.username, u.email, u.name, u.role_id, u.branch_id, u.status, u.phone,
        u.last_login_at, u.created_at, u.updated_at,
        r.name as role,
        b.name as branch_name, b.code as branch_code
      FROM \`users\` u
      LEFT JOIN \`roles\` r ON u.role_id = r.id
      LEFT JOIN \`branches\` b ON u.branch_id = b.id
      WHERE 1=1
    `
    const params = []

    if (branch_id && branch_id.toLowerCase() !== 'all') {
      sql += ' AND u.branch_id = ?'
      params.push(branch_id)
    }

    if (role_id) {
      sql += ' AND u.role_id = ?'
      params.push(role_id)
    }

    if (status) {
      sql += ' AND u.status = ?'
      params.push(status)
    }

    if (search) {
      sql += ' AND (u.name LIKE ? OR u.username LIKE ? OR u.email LIKE ?)'
      const term = `%${search}%`
      params.push(term, term, term)
    }

    sql += ' ORDER BY u.created_at DESC LIMIT ? OFFSET ?'
    params.push(parseInt(limit, 10), parseInt(offset, 10))

    return query(sql, params)
  },

  /**
   * Update password hash in MySQL for a user by ID, email, or username
   */
  async updatePassword(identifier, newPasswordHash) {
    if (!identifier || !newPasswordHash) return false
    const sql = `
      UPDATE \`users\`
      SET \`password_hash\` = ?, \`updated_at\` = CURRENT_TIMESTAMP
      WHERE \`id\` = ? OR LOWER(\`email\`) = LOWER(?) OR LOWER(\`username\`) = LOWER(?)
    `
    const result = await query(sql, [newPasswordHash, identifier, identifier, identifier])
    return (result?.affectedRows || 0) > 0
  },

  /**
   * Check if an email is already registered to another user
   */
  async checkEmailExists(email, excludeUserId = null) {
    if (!email) return false
    let sql = 'SELECT `id` FROM `users` WHERE LOWER(`email`) = LOWER(?)'
    const params = [String(email).trim().toLowerCase()]
    if (excludeUserId) {
      sql += ' AND `id` != ?'
      params.push(excludeUserId)
    }
    sql += ' LIMIT 1'
    const rows = await query(sql, params)
    return Boolean(rows && rows.length > 0)
  },

  /**
   * Update user profile (name, email, phone) in MySQL
   */
  async updateProfile(userId, { name, email, phone }) {
    if (!userId) return null

    const sets = []
    const params = []

    if (name !== undefined) {
      sets.push('`name` = ?')
      params.push(String(name).trim())
    }
    if (email !== undefined) {
      sets.push('`email` = LOWER(?)')
      params.push(String(email).trim().toLowerCase())
    }
    if (phone !== undefined) {
      sets.push('`phone` = ?')
      params.push(String(phone).trim())
    }

    if (sets.length === 0) return this.findById(userId)

    sets.push('`updated_at` = CURRENT_TIMESTAMP')
    params.push(userId)

    const sql = `UPDATE \`users\` SET ${sets.join(', ')} WHERE \`id\` = ?`
    await query(sql, params)

    return this.findById(userId)
  }
}

