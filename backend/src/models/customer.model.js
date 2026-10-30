import { query } from '../config/db.js'

/**
 * Normalizes database row to match frontend camelCase contract
 */
export function formatCustomerRow(row) {
  if (!row) return null
  return {
    id: row.id,
    customer_id: row.id,
    code: row.code,
    name: row.name,
    firstName: row.first_name || '',
    lastName: row.last_name || '',
    phone: row.phone,
    email: row.email || '',
    cnic: row.cnic || '',
    address: row.address || '',
    city: row.city || '',
    branch_id: row.branch_id,
    branchId: row.branch_id,
    branch: row.branch,
    branchName: row.branch,
    type: row.type || 'Individual',
    status: row.status || 'Active',
    statusClass: row.status_class || 'bg-[#dcfce7] text-[#165A31]',
    spent: row.spent || 'PKR 0',
    totalPurchases: row.total_purchases || 'PKR 0',
    balance: String(row.balance || '0'),
    outstanding: row.outstanding || 'PKR 0',
    ltv: row.ltv || '0',
    units: Number(row.units || 0),
    orders: Number(row.orders || 0),
    ordersCount: Number(row.orders_count || 0),
    activity: row.activity || 'Just now',
    notes: row.notes || '',
    createdAt: row.created_at ? new Date(row.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : new Date().toISOString()
  }
}

export const CustomerModel = {
  /**
   * Find all customers with optional branch, status, and search filters
   */
  async findAll({ branch_id, status, search, limit = 100, offset = 0 } = {}) {
    let sql = 'SELECT * FROM `customers` WHERE 1=1'
    const params = []

    if (branch_id && branch_id !== 'ALL' && branch_id !== 'All Branches') {
      sql += ' AND (`branch_id` = ? OR `branch` = ?)'
      params.push(branch_id, branch_id)
    }

    if (status && status !== 'All') {
      sql += ' AND `status` = ?'
      params.push(status)
    }

    if (search && search.trim() !== '') {
      const term = `%${search.trim()}%`
      sql += ' AND (`name` LIKE ? OR `phone` LIKE ? OR `cnic` LIKE ? OR `code` LIKE ? OR `city` LIKE ?)'
      params.push(term, term, term, term, term)
    }

    sql += ' ORDER BY `created_at` DESC LIMIT ? OFFSET ?'
    params.push(parseInt(limit, 10), parseInt(offset, 10))

    const rows = await query(sql, params)
    return rows.map(formatCustomerRow)
  },

  /**
   * Find a single customer by id or code
   */
  async findById(idOrCode) {
    const sql = 'SELECT * FROM `customers` WHERE `id` = ? OR `code` = ? LIMIT 1'
    const rows = await query(sql, [idOrCode, idOrCode])
    return rows.length > 0 ? formatCustomerRow(rows[0]) : null
  },

  /**
   * Find by phone or CNIC (for uniqueness checking)
   */
  async findByPhoneOrCnic(phone, cnic) {
    if (!phone && !cnic) return null
    let sql = 'SELECT * FROM `customers` WHERE 1=0'
    const params = []

    if (phone) {
      sql += ' OR `phone` = ?'
      params.push(phone)
    }
    if (cnic) {
      sql += ' OR `cnic` = ?'
      params.push(cnic)
    }
    sql += ' LIMIT 1'

    const rows = await query(sql, params)
    return rows.length > 0 ? formatCustomerRow(rows[0]) : null
  },

  /**
   * Create a new customer record
   */
  async create(data) {
    const isExplicitId = Boolean(data.id || data.customer_id)
    const isExplicitCode = Boolean(data.code)
    let id = data.id || data.customer_id
    let code = data.code
    const fullName = (data.name || `${data.firstName || ''} ${data.lastName || ''}`.trim()) || 'Unnamed Customer'
    const branchId = data.branch_id || data.branchId || 'BR-01'
    const branchName = data.branch || data.branchName || (branchId === 'BR-02' ? 'Islamabad' : (branchId === 'BR-03' ? 'Lahore' : 'Peshawar'))

    const maxAttempts = (!isExplicitId || !isExplicitCode) ? 5 : 1
    let lastErr = null

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      if (!isExplicitId && !id) {
        let attempts = 0
        while (attempts < 15) {
          const candidate = `CUST-${Math.floor(100 + Math.random() * 900)}`
          const existing = await query('SELECT `id` FROM `customers` WHERE `id` = ? LIMIT 1', [candidate])
          if (existing.length === 0) {
            id = candidate
            break
          }
          attempts++
        }
        if (!id) id = `CUST-${Date.now().toString().slice(-6)}`
      }

      if (!isExplicitCode && !code) {
        let attempts = 0
        while (attempts < 15) {
          const candidate = `CUS-${Math.floor(1000 + Math.random() * 9000)}`
          const existing = await query('SELECT `code` FROM `customers` WHERE `code` = ? LIMIT 1', [candidate])
          if (existing.length === 0) {
            code = candidate
            break
          }
          attempts++
        }
        if (!code) code = `CUS-${Date.now().toString().slice(-6)}`
      }

      const sql = `
        INSERT INTO \`customers\` (
          \`id\`, \`code\`, \`name\`, \`first_name\`, \`last_name\`, \`phone\`, \`email\`,
          \`cnic\`, \`address\`, \`city\`, \`branch_id\`, \`branch\`, \`type\`,
          \`status\`, \`status_class\`, \`spent\`, \`total_purchases\`, \`balance\`,
          \`outstanding\`, \`ltv\`, \`units\`, \`orders\`, \`orders_count\`, \`activity\`, \`notes\`
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `

      const params = [
        id,
        code,
        fullName,
        data.firstName || null,
        data.lastName || null,
        data.phone,
        data.email || null,
        data.cnic || null,
        data.address || null,
        data.city || 'Peshawar',
        branchId,
        branchName,
        data.type || 'Individual',
        data.status || 'Active',
        data.statusClass || 'bg-[#dcfce7] text-[#165A31]',
        data.spent || 'PKR 0',
        data.totalPurchases || 'PKR 0',
        String(data.balance || '0'),
        data.outstanding || 'PKR 0',
        data.ltv || '0',
        parseInt(data.units || 0, 10),
        parseInt(data.orders || 0, 10),
        parseInt(data.ordersCount || data.orders || 0, 10),
        data.activity || 'Just now',
        data.notes || null
      ]

      try {
        await query(sql, params)
        return this.findById(id)
      } catch (err) {
        lastErr = err
        const isIdOrCodeDup = (err.code === 'ER_DUP_ENTRY' || err.errno === 1062) && 
          (err.message?.includes('PRIMARY') || err.message?.includes('code') || err.message?.includes('customers.id'))
        if ((!isExplicitId || !isExplicitCode) && isIdOrCodeDup) {
          if (!isExplicitId) id = null
          if (!isExplicitCode) code = null
          continue
        }
        throw err
      }
    }

    if (lastErr) throw lastErr
  },

  /**
   * Update an existing customer record
   */
  async update(idOrCode, data) {
    const existing = await this.findById(idOrCode)
    if (!existing) return null

    const updates = []
    const params = []

    const fieldMap = {
      name: 'name',
      firstName: 'first_name',
      lastName: 'last_name',
      phone: 'phone',
      email: 'email',
      cnic: 'cnic',
      address: 'address',
      city: 'city',
      branch_id: 'branch_id',
      branch: 'branch',
      type: 'type',
      status: 'status',
      statusClass: 'status_class',
      spent: 'spent',
      totalPurchases: 'total_purchases',
      balance: 'balance',
      outstanding: 'outstanding',
      ltv: 'ltv',
      units: 'units',
      orders: 'orders',
      ordersCount: 'orders_count',
      activity: 'activity',
      notes: 'notes'
    }

    for (const [key, col] of Object.entries(fieldMap)) {
      if (data[key] !== undefined) {
        updates.push(`\`${col}\` = ?`)
        params.push(data[key])
      }
    }

    if (updates.length === 0) {
      return existing
    }

    params.push(existing.id)
    const sql = `UPDATE \`customers\` SET ${updates.join(', ')} WHERE \`id\` = ?`
    await query(sql, params)

    return this.findById(existing.id)
  },

  /**
   * Delete customer if safe (no orders or debt)
   */
  async delete(idOrCode) {
    const existing = await this.findById(idOrCode)
    if (!existing) return null

    // Safety business rule: Customers with active orders or positive balance cannot be deleted
    if (existing.orders > 0 || parseFloat(String(existing.balance || '0').replace(/[^0-9.]/g, '')) > 0) {
      const err = new Error(`Cannot delete customer ${existing.name} (${existing.id}) because they have ${existing.orders} recorded orders and active balances.`)
      err.code = 'CANNOT_DELETE_ACTIVE_CUSTOMER'
      err.statusCode = 400
      throw err
    }

    const sql = 'DELETE FROM `customers` WHERE `id` = ?'
    await query(sql, [existing.id])
    return existing
  }
}
