import { query } from '../config/db.js'

export function formatCustomOrderRow(row) {
  if (!row) return null
  return {
    id: row.id,
    orderNo: row.order_no || row.id,
    order_no: row.order_no || row.id,
    customer: row.customer,
    customer_id: row.customer_id,
    product: row.product,
    requirement: row.requirement || row.product,
    budget: row.budget,
    total: row.total || row.budget,
    deposit: row.deposit,
    paymentMethod: row.payment_method,
    payment_method: row.payment_method,
    transactionId: row.transaction_id,
    transaction_id: row.transaction_id,
    desiredDate: row.desired_date,
    desired_date: row.desired_date,
    eta: row.eta || row.desired_date,
    reservation: row.reservation,
    status: row.status,
    statusClass: row.status_class,
    status_class: row.status_class,
    branch: row.branch,
    branch_id: row.branch_id,
    branchId: row.branch_id,
    notes: row.notes || '',
    createdAt: row.created_at,
    updatedAt: row.updated_at
  }
}

export function formatDeliveryHandoverRow(row) {
  if (!row) return null
  return {
    id: row.id,
    delivery_id: row.delivery_id || row.id,
    deliveryId: row.delivery_id || row.id,
    order: row.order_id,
    order_id: row.order_id,
    orderId: row.order_id,
    customer: row.customer,
    customer_id: row.customer_id,
    unit: row.unit,
    unit_id: row.unit_id || row.unit,
    scheduled: row.scheduled,
    scheduledTime: row.scheduled_time || row.scheduled,
    officer: row.officer,
    status: row.status,
    statusClass: row.status_class,
    status_class: row.status_class,
    branch: row.branch,
    branch_id: row.branch_id,
    branchId: row.branch_id,
    identityVerified: Boolean(row.identity_verified),
    identity_verified: Boolean(row.identity_verified),
    paymentComplete: Boolean(row.payment_complete),
    payment_complete: Boolean(row.payment_complete),
    chassisVerified: Boolean(row.chassis_verified),
    chassis_verified: Boolean(row.chassis_verified),
    accessoriesIncluded: Boolean(row.accessories_included),
    accessories_included: Boolean(row.accessories_included),
    warrantyBriefed: Boolean(row.warranty_briefed),
    warranty_briefed: Boolean(row.warranty_briefed),
    notes: row.notes || '',
    createdAt: row.created_at,
    updatedAt: row.updated_at
  }
}

export function formatSalesReturnRow(row) {
  if (!row) return null
  return {
    id: row.id,
    returnNo: row.return_no || row.id,
    return_no: row.return_no || row.id,
    order: row.order_no,
    orderNo: row.order_no,
    order_no: row.order_no,
    customer: row.customer,
    customer_id: row.customer_id,
    unit: row.unit,
    unit_id: row.unit_id || row.unit,
    branch: row.branch,
    branch_id: row.branch_id,
    branchId: row.branch_id,
    reason: row.reason,
    requested: row.requested,
    status: row.status,
    statusClass: row.status_class,
    status_class: row.status_class,
    statusColor: row.status_color || row.status_class,
    refundAmount: Number(row.refund_amount || 0),
    refund_amount: Number(row.refund_amount || 0),
    notes: row.notes || '',
    createdAt: row.created_at,
    updatedAt: row.updated_at
  }
}

export const CustomOrderModel = {
  async findAll({ branch_id, status, search, limit = 100, offset = 0 } = {}) {
    let sql = 'SELECT * FROM `custom_orders` WHERE 1=1'
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
      sql += ' AND (`order_no` LIKE ? OR `customer` LIKE ? OR `product` LIKE ?)'
      const term = `%${search.trim()}%`
      params.push(term, term, term)
    }

    sql += ' ORDER BY `created_at` DESC LIMIT ? OFFSET ?'
    params.push(Number(limit), Number(offset))

    const rows = await query(sql, params)
    return rows.map(formatCustomOrderRow)
  },

  async findById(id) {
    const rows = await query('SELECT * FROM `custom_orders` WHERE `id` = ? OR `order_no` = ? LIMIT 1', [id, id])
    return rows.length > 0 ? formatCustomOrderRow(rows[0]) : null
  },

  async create(data) {
    let id = data.id || data.orderNo
    if (!id) {
      let attempts = 0
      while (attempts < 15) {
        const candidate = `CO-${Math.floor(100 + Math.random() * 900)}`
        const existing = await query('SELECT `id` FROM `custom_orders` WHERE `id` = ? LIMIT 1', [candidate])
        if (existing.length === 0) {
          id = candidate
          break
        }
        attempts++
      }
      if (!id) id = `CO-${Date.now().toString().slice(-6)}`
    }
    const orderNo = data.orderNo || data.order_no || id
    const customer = data.customer || ''
    const customerId = data.customer_id || data.customerId || null
    const product = data.product || data.requirement || ''
    const requirement = data.requirement || data.product || ''
    const budget = data.budget || data.total || ''
    const total = data.total || data.budget || ''
    const deposit = data.deposit || ''
    const paymentMethod = data.paymentMethod || data.payment_method || 'Bank Transfer'
    const transactionId = data.transactionId || data.transaction_id || null
    const desiredDate = data.desiredDate || data.desired_date || null
    const eta = data.eta || desiredDate || null
    const reservation = data.reservation || 'On arrival'
    const status = data.status || 'Sourcing'
    const statusClass = data.statusClass || data.status_class || 'bg-[#fef3c7] text-[#b45309]'
    const branchId = data.branch_id || data.branchId || 'BR-01'
    const branch = data.branch || 'Peshawar'
    const notes = data.notes || null

    await query(`
      INSERT INTO \`custom_orders\` (
        \`id\`, \`order_no\`, \`customer\`, \`customer_id\`, \`product\`, \`requirement\`,
        \`budget\`, \`total\`, \`deposit\`, \`payment_method\`, \`transaction_id\`,
        \`desired_date\`, \`eta\`, \`reservation\`, \`status\`, \`status_class\`,
        \`branch_id\`, \`branch\`, \`notes\`
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        \`customer\` = VALUES(\`customer\`),
        \`product\` = VALUES(\`product\`),
        \`requirement\` = VALUES(\`requirement\`),
        \`budget\` = VALUES(\`budget\`),
        \`total\` = VALUES(\`total\`),
        \`deposit\` = VALUES(\`deposit\`),
        \`payment_method\` = VALUES(\`payment_method\`),
        \`transaction_id\` = VALUES(\`transaction_id\`),
        \`desired_date\` = VALUES(\`desired_date\`),
        \`eta\` = VALUES(\`eta\`),
        \`reservation\` = VALUES(\`reservation\`),
        \`status\` = VALUES(\`status\`),
        \`status_class\` = VALUES(\`status_class\`),
        \`notes\` = VALUES(\`notes\`)
    `, [
      id, orderNo, customer, customerId, product, requirement,
      budget, total, deposit, paymentMethod, transactionId,
      desiredDate, eta, reservation, status, statusClass,
      branchId, branch, notes
    ])

    return this.findById(id)
  },

  async update(id, data) {
    const existing = await this.findById(id)
    if (!existing) return null

    const customer = data.customer !== undefined ? data.customer : existing.customer
    const product = data.product !== undefined ? data.product : existing.product
    const requirement = data.requirement !== undefined ? data.requirement : existing.requirement
    const budget = data.budget !== undefined ? data.budget : existing.budget
    const total = data.total !== undefined ? data.total : existing.total
    const deposit = data.deposit !== undefined ? data.deposit : existing.deposit
    const paymentMethod = data.paymentMethod || data.payment_method || existing.paymentMethod
    const transactionId = data.transactionId !== undefined ? data.transactionId : existing.transactionId
    const desiredDate = data.desiredDate || data.desired_date || existing.desiredDate
    const eta = data.eta || data.desiredDate || existing.eta
    const reservation = data.reservation !== undefined ? data.reservation : existing.reservation
    const status = data.status !== undefined ? data.status : existing.status
    const statusClass = data.statusClass || data.status_class || existing.statusClass
    const notes = data.notes !== undefined ? data.notes : existing.notes

    await query(`
      UPDATE \`custom_orders\` SET
        \`customer\` = ?,
        \`product\` = ?,
        \`requirement\` = ?,
        \`budget\` = ?,
        \`total\` = ?,
        \`deposit\` = ?,
        \`payment_method\` = ?,
        \`transaction_id\` = ?,
        \`desired_date\` = ?,
        \`eta\` = ?,
        \`reservation\` = ?,
        \`status\` = ?,
        \`status_class\` = ?,
        \`notes\` = ?
      WHERE \`id\` = ? OR \`order_no\` = ?
    `, [
      customer, product, requirement, budget, total, deposit,
      paymentMethod, transactionId, desiredDate, eta, reservation,
      status, statusClass, notes, id, id
    ])

    return this.findById(id)
  },

  async delete(id) {
    const existing = await this.findById(id)
    if (!existing) return false
    await query('DELETE FROM \`custom_orders\` WHERE \`id\` = ? OR \`order_no\` = ?', [id, id])
    return true
  }
}

export const DeliveryHandoverModel = {
  async findAll({ branch_id, status, search, limit = 100, offset = 0 } = {}) {
    let sql = 'SELECT * FROM \`delivery_handovers\` WHERE 1=1'
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
      sql += ' AND (`delivery_id` LIKE ? OR `customer` LIKE ? OR `order_id` LIKE ? OR `unit` LIKE ?)'
      const term = `%${search.trim()}%`
      params.push(term, term, term, term)
    }

    sql += ' ORDER BY `created_at` DESC LIMIT ? OFFSET ?'
    params.push(Number(limit), Number(offset))

    const rows = await query(sql, params)
    return rows.map(formatDeliveryHandoverRow)
  },

  async findById(id) {
    const rows = await query('SELECT * FROM \`delivery_handovers\` WHERE \`id\` = ? OR \`delivery_id\` = ? LIMIT 1', [id, id])
    return rows.length > 0 ? formatDeliveryHandoverRow(rows[0]) : null
  },

  async create(data) {
    let id = data.id || data.delivery_id || data.deliveryId
    if (!id) {
      let attempts = 0
      while (attempts < 15) {
        const candidate = `DEL-${Math.floor(1000 + Math.random() * 9000)}`
        const existing = await query('SELECT `id` FROM `delivery_handovers` WHERE `id` = ? LIMIT 1', [candidate])
        if (existing.length === 0) {
          id = candidate
          break
        }
        attempts++
      }
      if (!id) id = `DEL-${Date.now().toString().slice(-6)}`
    }
    const deliveryId = data.delivery_id || data.deliveryId || id
    const orderId = data.order || data.order_id || data.orderId || ''
    const customer = data.customer || ''
    const customerId = data.customer_id || data.customerId || null
    const unit = data.unit || data.unit_id || ''
    const unitId = data.unit_id || data.unit || null
    const scheduled = data.scheduled || data.scheduledTime || 'Today'
    const scheduledTime = data.scheduled_time || data.scheduledTime || scheduled
    const officer = data.officer || null
    const status = data.status || 'Ready'
    const statusClass = data.statusClass || data.status_class || (status === 'Delivered' ? 'bg-[#165A31] text-white' : 'bg-[#dcfce7] text-[#165A31]')
    const branchId = data.branch_id || data.branchId || 'BR-01'
    const branch = data.branch || 'Peshawar'
    const identityVerified = data.identityVerified || data.identity_verified ? 1 : 0
    const paymentComplete = data.paymentComplete || data.payment_complete ? 1 : 0
    const chassisVerified = data.chassisVerified || data.chassis_verified ? 1 : 0
    const accessoriesIncluded = data.accessoriesIncluded || data.accessories_included ? 1 : 0
    const warrantyBriefed = data.warrantyBriefed || data.warranty_briefed ? 1 : 0
    const notes = data.notes || null

    await query(`
      INSERT INTO \`delivery_handovers\` (
        \`id\`, \`delivery_id\`, \`order_id\`, \`customer\`, \`customer_id\`,
        \`unit\`, \`unit_id\`, \`scheduled\`, \`scheduled_time\`, \`officer\`,
        \`status\`, \`status_class\`, \`branch_id\`, \`branch\`,
        \`identity_verified\`, \`payment_complete\`, \`chassis_verified\`,
        \`accessories_included\`, \`warranty_briefed\`, \`notes\`
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        \`customer\` = VALUES(\`customer\`),
        \`unit\` = VALUES(\`unit\`),
        \`scheduled\` = VALUES(\`scheduled\`),
        \`scheduled_time\` = VALUES(\`scheduled_time\`),
        \`officer\` = VALUES(\`officer\`),
        \`status\` = VALUES(\`status\`),
        \`status_class\` = VALUES(\`status_class\`),
        \`identity_verified\` = VALUES(\`identity_verified\`),
        \`payment_complete\` = VALUES(\`payment_complete\`),
        \`chassis_verified\` = VALUES(\`chassis_verified\`),
        \`accessories_included\` = VALUES(\`accessories_included\`),
        \`warranty_briefed\` = VALUES(\`warranty_briefed\`),
        \`notes\` = VALUES(\`notes\`)
    `, [
      id, deliveryId, orderId, customer, customerId,
      unit, unitId, scheduled, scheduledTime, officer,
      status, statusClass, branchId, branch,
      identityVerified, paymentComplete, chassisVerified,
      accessoriesIncluded, warrantyBriefed, notes
    ])

    return this.findById(id)
  },

  async update(id, data) {
    const existing = await this.findById(id)
    if (!existing) return null

    const customer = data.customer !== undefined ? data.customer : existing.customer
    const unit = data.unit !== undefined ? data.unit : existing.unit
    const scheduled = data.scheduled !== undefined ? data.scheduled : existing.scheduled
    const scheduledTime = data.scheduledTime || data.scheduled_time || existing.scheduledTime
    const officer = data.officer !== undefined ? data.officer : existing.officer
    const status = data.status !== undefined ? data.status : existing.status
    const statusClass = data.statusClass || data.status_class || existing.statusClass
    const identityVerified = data.identityVerified !== undefined ? (data.identityVerified ? 1 : 0) : (existing.identityVerified ? 1 : 0)
    const paymentComplete = data.paymentComplete !== undefined ? (data.paymentComplete ? 1 : 0) : (existing.paymentComplete ? 1 : 0)
    const chassisVerified = data.chassisVerified !== undefined ? (data.chassisVerified ? 1 : 0) : (existing.chassisVerified ? 1 : 0)
    const accessoriesIncluded = data.accessoriesIncluded !== undefined ? (data.accessoriesIncluded ? 1 : 0) : (existing.accessoriesIncluded ? 1 : 0)
    const warrantyBriefed = data.warrantyBriefed !== undefined ? (data.warrantyBriefed ? 1 : 0) : (existing.warrantyBriefed ? 1 : 0)
    const notes = data.notes !== undefined ? data.notes : existing.notes

    await query(`
      UPDATE \`delivery_handovers\` SET
        \`customer\` = ?,
        \`unit\` = ?,
        \`scheduled\` = ?,
        \`scheduled_time\` = ?,
        \`officer\` = ?,
        \`status\` = ?,
        \`status_class\` = ?,
        \`identity_verified\` = ?,
        \`payment_complete\` = ?,
        \`chassis_verified\` = ?,
        \`accessories_included\` = ?,
        \`warranty_briefed\` = ?,
        \`notes\` = ?
      WHERE \`id\` = ? OR \`delivery_id\` = ?
    `, [
      customer, unit, scheduled, scheduledTime, officer,
      status, statusClass, identityVerified, paymentComplete,
      chassisVerified, accessoriesIncluded, warrantyBriefed, notes,
      id, id
    ])

    return this.findById(id)
  },

  async delete(id) {
    const existing = await this.findById(id)
    if (!existing) return false
    await query('DELETE FROM \`delivery_handovers\` WHERE \`id\` = ? OR \`delivery_id\` = ?', [id, id])
    return true
  }
}

export const SalesReturnModel = {
  async findAll({ branch_id, status, search, limit = 100, offset = 0 } = {}) {
    let sql = 'SELECT * FROM \`sales_returns\` WHERE 1=1'
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
      sql += ' AND (`return_no` LIKE ? OR `customer` LIKE ? OR `order_no` LIKE ? OR `unit` LIKE ?)'
      const term = `%${search.trim()}%`
      params.push(term, term, term, term)
    }

    sql += ' ORDER BY `created_at` DESC LIMIT ? OFFSET ?'
    params.push(Number(limit), Number(offset))

    const rows = await query(sql, params)
    return rows.map(formatSalesReturnRow)
  },

  async findById(id) {
    const rows = await query('SELECT * FROM \`sales_returns\` WHERE \`id\` = ? OR \`return_no\` = ? LIMIT 1', [id, id])
    return rows.length > 0 ? formatSalesReturnRow(rows[0]) : null
  },

  async create(data) {
    let id = data.id || data.returnNo || data.return_no
    if (!id) {
      let attempts = 0
      while (attempts < 15) {
        const candidate = `RET-${Math.floor(100 + Math.random() * 900)}`
        const existing = await query('SELECT `id` FROM `sales_returns` WHERE `id` = ? LIMIT 1', [candidate])
        if (existing.length === 0) {
          id = candidate
          break
        }
        attempts++
      }
      if (!id) id = `RET-${Date.now().toString().slice(-6)}`
    }
    const returnNo = data.returnNo || data.return_no || id
    const orderNo = data.order || data.orderNo || data.order_no || ''
    const customer = data.customer || ''
    const customerId = data.customer_id || data.customerId || null
    const unit = data.unit || data.unit_id || ''
    const unitId = data.unit_id || data.unit || null
    const branchId = data.branch_id || data.branchId || 'BR-01'
    const branch = data.branch || 'Peshawar'
    const reason = data.reason || null
    const requested = data.requested || 'Exchange'
    const status = data.status || 'Inspection'
    const statusClass = data.statusClass || data.status_class || (status === 'Completed' ? 'bg-[#dcfce7] text-[#165A31]' : 'bg-orange-50 text-orange-700')
    const statusColor = data.statusColor || data.status_color || statusClass
    const refundAmount = Number(data.refundAmount || data.refund_amount || 0)
    const notes = data.notes || null

    await query(`
      INSERT INTO \`sales_returns\` (
        \`id\`, \`return_no\`, \`order_no\`, \`customer\`, \`customer_id\`,
        \`unit\`, \`unit_id\`, \`branch_id\`, \`branch\`, \`reason\`,
        \`requested\`, \`status\`, \`status_class\`, \`status_color\`,
        \`refund_amount\`, \`notes\`
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        \`customer\` = VALUES(\`customer\`),
        \`unit\` = VALUES(\`unit\`),
        \`reason\` = VALUES(\`reason\`),
        \`requested\` = VALUES(\`requested\`),
        \`status\` = VALUES(\`status\`),
        \`status_class\` = VALUES(\`status_class\`),
        \`status_color\` = VALUES(\`status_color\`),
        \`refund_amount\` = VALUES(\`refund_amount\`),
        \`notes\` = VALUES(\`notes\`)
    `, [
      id, returnNo, orderNo, customer, customerId,
      unit, unitId, branchId, branch, reason,
      requested, status, statusClass, statusColor,
      refundAmount, notes
    ])

    return this.findById(id)
  },

  async update(id, data) {
    const existing = await this.findById(id)
    if (!existing) return null

    const customer = data.customer !== undefined ? data.customer : existing.customer
    const unit = data.unit !== undefined ? data.unit : existing.unit
    const reason = data.reason !== undefined ? data.reason : existing.reason
    const requested = data.requested !== undefined ? data.requested : existing.requested
    const status = data.status !== undefined ? data.status : existing.status
    const statusClass = data.statusClass || data.status_class || existing.statusClass
    const statusColor = data.statusColor || data.status_color || existing.statusColor
    const refundAmount = data.refundAmount !== undefined ? Number(data.refundAmount) : existing.refundAmount
    const notes = data.notes !== undefined ? data.notes : existing.notes

    await query(`
      UPDATE \`sales_returns\` SET
        \`customer\` = ?,
        \`unit\` = ?,
        \`reason\` = ?,
        \`requested\` = ?,
        \`status\` = ?,
        \`status_class\` = ?,
        \`status_color\` = ?,
        \`refund_amount\` = ?,
        \`notes\` = ?
      WHERE \`id\` = ? OR \`return_no\` = ?
    `, [
      customer, unit, reason, requested, status,
      statusClass, statusColor, refundAmount, notes,
      id, id
    ])

    return this.findById(id)
  },

  async delete(id) {
    const existing = await this.findById(id)
    if (!existing) return false
    await query('DELETE FROM \`sales_returns\` WHERE \`id\` = ? OR \`return_no\` = ?', [id, id])
    return true
  }
}
