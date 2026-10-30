import { query, withTransaction } from '../config/db.js'
import bcrypt from 'bcryptjs'

function formatBranchRow(row) {
  if (!row) return null
  return {
    id: row.id,
    branch_id: row.id,
    code: row.code,
    name: row.name,
    city: row.city || '',
    address: row.address || '',
    phone: row.phone || '',
    email: row.email || '',
    status: row.status || 'Active',
    statusClass: row.status === 'Active' ? 'bg-[#dcfce7] text-[#165A31]' : 'bg-gray-100 text-gray-700',
    createdAt: row.created_at,
    updatedAt: row.updated_at
  }
}

function formatUserRow(row) {
  if (!row) return null
  return {
    id: row.id,
    user_id: row.id,
    username: row.username,
    email: row.email,
    name: row.name,
    role_id: row.role_id,
    role: row.role || (row.role_id === 'ROLE-ADMIN' ? 'Super Admin' : 'Branch Manager'),
    branch_id: row.branch_id,
    branch: row.branch || (row.branch_id === 'BR-01' ? 'Peshawar' : (row.branch_id === 'BR-02' ? 'Islamabad' : (row.branch_id === 'BR-03' ? 'Lahore' : (row.branch_id === 'BR-04' ? 'Rawalpindi' : 'Head Office')))),
    status: row.status || 'Active',
    phone: row.phone || '',
    mobile: row.phone || '',
    lastLoginAt: row.last_login_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  }
}

export const OrganisationModel = {
  // ==========================================
  // Branches
  // ==========================================
  async findAllBranches() {
    const rows = await query('SELECT * FROM `branches` ORDER BY `name` ASC')
    return rows.map(formatBranchRow)
  },

  async findBranchById(idOrCode) {
    const rows = await query('SELECT * FROM `branches` WHERE `id` = ? OR `code` = ? LIMIT 1', [idOrCode, idOrCode])
    return rows.length > 0 ? formatBranchRow(rows[0]) : null
  },

  async createBranch(data) {
    const code = (data.code || '').trim().toUpperCase()
    const id = data.id || data.branch_id || `BR-${code}`
    const name = (data.name || '').trim()
    const city = (data.city || '').trim()
    const address = (data.address || '').trim()
    const phone = (data.phone || '').trim()
    const email = (data.email || '').trim()
    const status = data.status || 'Active'

    await query(
      'INSERT INTO `branches` (`id`, `code`, `name`, `city`, `address`, `phone`, `email`, `status`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [id, code, name, city, address, phone, email, status]
    )

    return this.findBranchById(id)
  },

  async updateBranch(id, data) {
    const branch = await this.findBranchById(id)
    if (!branch) throw new Error(`Branch '${id}' not found.`)

    const name = data.name !== undefined ? data.name.trim() : branch.name
    const city = data.city !== undefined ? data.city.trim() : branch.city
    const address = data.address !== undefined ? data.address.trim() : branch.address
    const phone = data.phone !== undefined ? data.phone.trim() : branch.phone
    const email = data.email !== undefined ? data.email.trim() : branch.email
    const status = data.status !== undefined ? data.status : branch.status

    await query(
      'UPDATE `branches` SET `name` = ?, `city` = ?, `address` = ?, `phone` = ?, `email` = ?, `status` = ? WHERE `id` = ? OR `code` = ?',
      [name, city, address, phone, email, status, id, id]
    )

    return this.findBranchById(id)
  },

  // ==========================================
  // Users
  // ==========================================
  async findAllUsers({ branch_id } = {}) {
    let sql = `
      SELECT u.id, u.username, u.email, u.name, u.role_id, r.name as role, u.branch_id, b.name as branch, u.status, u.phone, u.last_login_at, u.created_at, u.updated_at
      FROM \`users\` u
      LEFT JOIN \`roles\` r ON u.role_id = r.id
      LEFT JOIN \`branches\` b ON u.branch_id = b.id
    `
    const params = []
    if (branch_id && branch_id !== 'ALL' && branch_id !== 'BR-HQ') {
      sql += ' WHERE u.branch_id = ?'
      params.push(branch_id)
    }
    sql += ' ORDER BY u.created_at DESC'
    const rows = await query(sql, params)
    return rows.map(formatUserRow)
  },

  async findUserById(idOrUsername) {
    const sql = `
      SELECT u.id, u.username, u.email, u.name, u.role_id, r.name as role, u.branch_id, b.name as branch, u.status, u.phone, u.last_login_at, u.created_at, u.updated_at
      FROM \`users\` u
      LEFT JOIN \`roles\` r ON u.role_id = r.id
      LEFT JOIN \`branches\` b ON u.branch_id = b.id
      WHERE u.id = ? OR u.username = ? OR u.email = ?
      LIMIT 1
    `
    const rows = await query(sql, [idOrUsername, idOrUsername, idOrUsername])
    return rows.length > 0 ? formatUserRow(rows[0]) : null
  },

  async createUser(data) {
    const username = (data.username || (data.email ? data.email.split('@')[0] : '')).trim().toLowerCase()
    const email = (data.email || `${username}@ajecodrive.com`).trim().toLowerCase()
    const name = (data.name || username).trim()
    const password = data.password || 'password123'
    const password_hash = await bcrypt.hash(password, 10)
    const id = data.id || `USER-${Math.floor(100 + Math.random() * 900)}`
    
    // Resolve role_id
    let roleId = data.role_id || data.roleId
    if (!roleId && data.role) {
      const roleStr = String(data.role).toLowerCase()
      if (roleStr.includes('admin')) roleId = 'ROLE-ADMIN'
      else if (roleStr.includes('technician')) roleId = 'ROLE-TECH'
      else if (roleStr.includes('inventory')) roleId = 'ROLE-INV'
      else roleId = 'ROLE-BM'
    }
    if (!roleId) roleId = 'ROLE-BM'

    // Resolve branch_id
    let branchId = data.branch_id || data.branchId
    if (!branchId && data.branch) {
      const bRows = await query('SELECT id FROM `branches` WHERE `id` = ? OR `code` = ? OR `name` = ? LIMIT 1', [data.branch, data.branch, data.branch])
      if (bRows.length > 0) branchId = bRows[0].id
    }
    if (!branchId && roleId !== 'ROLE-ADMIN') branchId = 'BR-01'
    if (roleId === 'ROLE-ADMIN') branchId = 'BR-HQ'

    const status = data.status || 'Active'
    const phone = (data.phone || data.mobile || '').trim()

    await query(
      'INSERT INTO `users` (`id`, `username`, `email`, `password_hash`, `name`, `role_id`, `branch_id`, `status`, `phone`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id, username, email, password_hash, name, roleId, branchId, status, phone]
    )

    return this.findUserById(id)
  },

  async updateUser(id, data) {
    const user = await this.findUserById(id)
    if (!user) throw new Error(`User '${id}' not found.`)

    const name = data.name !== undefined ? data.name.trim() : user.name
    const email = data.email !== undefined ? data.email.trim().toLowerCase() : user.email
    const phone = data.phone !== undefined ? data.phone.trim() : (data.mobile !== undefined ? data.mobile.trim() : user.phone)
    const status = data.status !== undefined ? data.status : user.status

    let roleId = user.role_id
    if (data.role_id) roleId = data.role_id
    else if (data.role) {
      const roleStr = String(data.role).toLowerCase()
      if (roleStr.includes('admin')) roleId = 'ROLE-ADMIN'
      else if (roleStr.includes('technician')) roleId = 'ROLE-TECH'
      else if (roleStr.includes('inventory')) roleId = 'ROLE-INV'
      else roleId = 'ROLE-BM'
    }

    let branchId = user.branch_id
    if (data.branch_id) branchId = data.branch_id
    else if (data.branch) {
      const bRows = await query('SELECT id FROM `branches` WHERE `id` = ? OR `code` = ? OR `name` = ? LIMIT 1', [data.branch, data.branch, data.branch])
      if (bRows.length > 0) branchId = bRows[0].id
    }

    let passwordHashUpdate = ''
    const params = [name, email, phone, status, roleId, branchId]
    if (data.password && String(data.password).length >= 6) {
      const hash = await bcrypt.hash(data.password, 10)
      passwordHashUpdate = ', `password_hash` = ?'
      params.push(hash)
    }

    params.push(id, id)
    await query(
      `UPDATE \`users\` SET \`name\` = ?, \`email\` = ?, \`phone\` = ?, \`status\` = ?, \`role_id\` = ?, \`branch_id\` = ?${passwordHashUpdate} WHERE \`id\` = ? OR \`username\` = ?`,
      params
    )

    return this.findUserById(id)
  },

  // ==========================================
  // Roles
  // ==========================================
  async findAllRoles() {
    const rows = await query(`
      SELECT r.id, r.name, r.description, r.is_system, GROUP_CONCAT(rp.permission_id) as permissions
      FROM \`roles\` r
      LEFT JOIN \`role_permissions\` rp ON r.id = rp.role_id
      GROUP BY r.id
      ORDER BY r.name ASC
    `)
    return rows.map(r => ({
      id: r.id,
      name: r.name,
      description: r.description,
      isSystem: Boolean(r.is_system),
      permissions: r.permissions ? r.permissions.split(',') : []
    }))
  },

  async createRole(data) {
    const name = (data.name || '').trim()
    const id = data.id || `ROLE-${name.toUpperCase().replace(/[^A-Z0-9]/g, '_')}`
    const description = (data.description || '').trim()

    await query('INSERT INTO `roles` (`id`, `name`, `description`, `is_system`) VALUES (?, ?, ?, 0)', [id, name, description])

    if (Array.isArray(data.permissions) && data.permissions.length > 0) {
      const allPerms = await query('SELECT id, code FROM `permissions`')
      const codeToId = new Map()
      allPerms.forEach(p => {
        codeToId.set(p.id, p.id)
        codeToId.set(p.code, p.id)
      })

      for (const p of data.permissions) {
        const permId = codeToId.get(p) || p
        await query('INSERT IGNORE INTO `role_permissions` (`role_id`, `permission_id`) VALUES (?, ?)', [id, permId])
      }
    }

    const roles = await this.findAllRoles()
    return roles.find(r => r.id === id) || { id, name, description, permissions: data.permissions || [] }
  }
}
