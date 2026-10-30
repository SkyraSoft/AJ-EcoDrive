import { query } from '../config/db.js'

export function formatCycleCountRow(row) {
  if (!row) return null
  return {
    id: row.id,
    session: row.session || row.id,
    name: row.name,
    countName: row.name,
    scope: row.scope,
    category: row.category,
    assignedTo: row.assigned_to,
    date: row.scheduled_date || 'Today',
    scheduledDate: row.scheduled_date || 'Today',
    expected: row.expected || '0 units',
    expectedUnits: row.expected || '0 units',
    counted: row.counted || '0 units',
    variance: row.variance || '0',
    location: row.location || '',
    targetLocation: row.location || '',
    notes: row.notes || '',
    status: row.status,
    branch: row.branch,
    branch_id: row.branch_id,
    branchId: row.branch_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  }
}

export function formatQuarantineRow(row) {
  if (!row) return null
  return {
    id: row.id,
    unit: row.unit,
    product: row.product,
    defectType: row.defect_type,
    severity: row.severity,
    source: row.source || 'Showroom Floor',
    inspector: row.inspector,
    condition: row.condition_desc || '',
    condition_desc: row.condition_desc || '',
    status: row.status,
    notes: row.notes || '',
    evidence: row.evidence || '',
    decision: row.decision || '',
    branch: row.branch,
    branch_id: row.branch_id,
    branchId: row.branch_id,
    date: row.created_at ? new Date(row.created_at).toISOString().split('T')[0] : 'Today',
    createdAt: row.created_at,
    updatedAt: row.updated_at
  }
}

export function formatStockRequestRow(row) {
  if (!row) return null
  return {
    id: row.id,
    requestNo: row.request_no || row.id,
    request_no: row.request_no || row.id,
    product: row.product,
    productId: row.product_id,
    product_id: row.product_id,
    currentStock: row.current_stock || '',
    qty: Number(row.qty || 1),
    requestedQty: Number(row.qty || 1),
    units: row.units || `${row.qty} units`,
    urgency: row.urgency || 'Medium',
    expectedDemand: row.expected_demand || '',
    orderLink: row.order_link || '',
    reason: row.reason || '',
    notes: row.notes || '',
    status: row.status,
    branch: row.branch,
    branch_id: row.branch_id,
    branchId: row.branch_id,
    date: row.created_at ? new Date(row.created_at).toISOString().split('T')[0] : 'Today',
    createdAt: row.created_at,
    updatedAt: row.updated_at
  }
}

export const CycleCountModel = {
  async findAll({ branch_id, status, search, limit = 100, offset = 0 } = {}) {
    let sql = 'SELECT * FROM `cycle_counts` WHERE 1=1'
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
      sql += ' AND (`name` LIKE ? OR `session` LIKE ? OR `scope` LIKE ?)'
      const term = `%${search.trim()}%`
      params.push(term, term, term)
    }

    sql += ' ORDER BY `created_at` DESC LIMIT ? OFFSET ?'
    params.push(Number(limit), Number(offset))

    const rows = await query(sql, params)
    return rows.map(formatCycleCountRow)
  },

  async findById(id) {
    const rows = await query('SELECT * FROM `cycle_counts` WHERE `id` = ? OR `session` = ? LIMIT 1', [id, id])
    return rows.length > 0 ? formatCycleCountRow(rows[0]) : null
  },

  async create(data) {
    let id = data.id || data.session
    if (!id) {
      let attempts = 0
      while (attempts < 15) {
        const candidate = `CC-${Math.floor(100 + Math.random() * 900)}`
        const existing = await query('SELECT `id` FROM `cycle_counts` WHERE `id` = ? LIMIT 1', [candidate])
        if (existing.length === 0) {
          id = candidate
          break
        }
        attempts++
      }
      if (!id) id = `CC-${Date.now().toString().slice(-6)}`
    }
    const session = data.session || id
    const name = data.name || data.countName || 'Cycle Count Session'
    const scope = data.scope || 'Showroom Units'
    const category = data.category || null
    const assignedTo = data.assignedTo || data.assignee || 'Branch Team'
    const scheduledDate = data.scheduledDate || data.date || 'Today'
    const expected = String(data.expected || data.expectedUnits || '0 units')
    const counted = String(data.counted || '0 units')
    const variance = String(data.variance || '0')
    const location = data.location || data.targetLocation || null
    const notes = data.notes || null
    const status = data.status || 'In Progress'
    const branchId = data.branch_id || data.branchId || 'BR-01'
    const branch = data.branch || 'Peshawar'

    await query(`
      INSERT INTO \`cycle_counts\` (
        \`id\`, \`session\`, \`name\`, \`scope\`, \`category\`,
        \`assigned_to\`, \`scheduled_date\`, \`expected\`, \`counted\`,
        \`variance\`, \`location\`, \`notes\`, \`status\`,
        \`branch_id\`, \`branch\`
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        \`name\` = VALUES(\`name\`),
        \`scope\` = VALUES(\`scope\`),
        \`category\` = VALUES(\`category\`),
        \`assigned_to\` = VALUES(\`assigned_to\`),
        \`scheduled_date\` = VALUES(\`scheduled_date\`),
        \`expected\` = VALUES(\`expected\`),
        \`counted\` = VALUES(\`counted\`),
        \`variance\` = VALUES(\`variance\`),
        \`location\` = VALUES(\`location\`),
        \`notes\` = VALUES(\`notes\`),
        \`status\` = VALUES(\`status\`)
    `, [
      id, session, name, scope, category,
      assignedTo, scheduledDate, expected, counted,
      variance, location, notes, status,
      branchId, branch
    ])

    return this.findById(id)
  },

  async update(id, data) {
    const existing = await this.findById(id)
    if (!existing) return null

    const name = data.name || data.countName || existing.name
    const scope = data.scope !== undefined ? data.scope : existing.scope
    const category = data.category !== undefined ? data.category : existing.category
    const assignedTo = data.assignedTo || data.assignee || existing.assignedTo
    const scheduledDate = data.scheduledDate || data.date || existing.scheduledDate
    const expected = data.expected !== undefined ? String(data.expected) : existing.expected
    const counted = data.counted !== undefined ? String(data.counted) : existing.counted
    const variance = data.variance !== undefined ? String(data.variance) : existing.variance
    const location = data.location || data.targetLocation || existing.location
    const notes = data.notes !== undefined ? data.notes : existing.notes
    const status = data.status !== undefined ? data.status : existing.status

    await query(`
      UPDATE \`cycle_counts\` SET
        \`name\` = ?,
        \`scope\` = ?,
        \`category\` = ?,
        \`assigned_to\` = ?,
        \`scheduled_date\` = ?,
        \`expected\` = ?,
        \`counted\` = ?,
        \`variance\` = ?,
        \`location\` = ?,
        \`notes\` = ?,
        \`status\` = ?
      WHERE \`id\` = ? OR \`session\` = ?
    `, [
      name, scope, category, assignedTo, scheduledDate,
      expected, counted, variance, location, notes,
      status, id, id
    ])

    return this.findById(id)
  },

  async delete(id) {
    const existing = await this.findById(id)
    if (!existing) return false
    await query('DELETE FROM \`cycle_counts\` WHERE \`id\` = ? OR \`session\` = ?', [id, id])
    return true
  }
}

export const QuarantineModel = {
  async findAll({ branch_id, status, search, limit = 100, offset = 0 } = {}) {
    let sql = 'SELECT * FROM `quarantine_records` WHERE 1=1'
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
      sql += ' AND (`unit` LIKE ? OR `product` LIKE ? OR `defect_type` LIKE ?)'
      const term = `%${search.trim()}%`
      params.push(term, term, term)
    }

    sql += ' ORDER BY `created_at` DESC LIMIT ? OFFSET ?'
    params.push(Number(limit), Number(offset))

    const rows = await query(sql, params)
    return rows.map(formatQuarantineRow)
  },

  async findById(id) {
    const rows = await query('SELECT * FROM `quarantine_records` WHERE \`id\` = ? OR \`unit\` = ? LIMIT 1', [id, id])
    return rows.length > 0 ? formatQuarantineRow(rows[0]) : null
  },

  async create(data) {
    let id = data.id || data.unit
    if (!id) {
      let attempts = 0
      while (attempts < 15) {
        const candidate = `QR-${Math.floor(100 + Math.random() * 900)}`
        const existing = await query('SELECT `id` FROM `quarantine_records` WHERE `id` = ? LIMIT 1', [candidate])
        if (existing.length === 0) {
          id = candidate
          break
        }
        attempts++
      }
      if (!id) id = `QR-${Date.now().toString().slice(-6)}`
    }
    const unit = data.unit || id
    const product = data.product || ''
    const defectType = data.defectType || data.defect_type || null
    const severity = data.severity || 'Medium'
    const source = data.source || 'Showroom Floor'
    const inspector = data.inspector || 'Branch Technician'
    const conditionDesc = data.condition || data.condition_desc || null
    const status = data.status || 'Quarantine'
    const notes = data.notes || null
    const evidence = data.evidence || null
    const decision = data.decision || null
    const branchId = data.branch_id || data.branchId || 'BR-01'
    const branch = data.branch || 'Peshawar'

    await query(`
      INSERT INTO \`quarantine_records\` (
        \`id\`, \`unit\`, \`product\`, \`defect_type\`, \`severity\`,
        \`source\`, \`inspector\`, \`condition_desc\`, \`status\`,
        \`notes\`, \`evidence\`, \`decision\`, \`branch_id\`, \`branch\`
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        \`product\` = VALUES(\`product\`),
        \`defect_type\` = VALUES(\`defect_type\`),
        \`severity\` = VALUES(\`severity\`),
        \`source\` = VALUES(\`source\`),
        \`inspector\` = VALUES(\`inspector\`),
        \`condition_desc\` = VALUES(\`condition_desc\`),
        \`status\` = VALUES(\`status\`),
        \`notes\` = VALUES(\`notes\`),
        \`evidence\` = VALUES(\`evidence\`),
        \`decision\` = VALUES(\`decision\`)
    `, [
      id, unit, product, defectType, severity,
      source, inspector, conditionDesc, status,
      notes, evidence, decision, branchId, branch
    ])

    return this.findById(id)
  },

  async update(id, data) {
    const existing = await this.findById(id)
    if (!existing) return null

    const product = data.product !== undefined ? data.product : existing.product
    const defectType = data.defectType || data.defect_type || existing.defectType
    const severity = data.severity !== undefined ? data.severity : existing.severity
    const source = data.source !== undefined ? data.source : existing.source
    const inspector = data.inspector !== undefined ? data.inspector : existing.inspector
    const conditionDesc = data.condition !== undefined ? data.condition : existing.condition
    const status = data.status !== undefined ? data.status : existing.status
    const notes = data.notes !== undefined ? data.notes : existing.notes
    const evidence = data.evidence !== undefined ? data.evidence : existing.evidence
    const decision = data.decision !== undefined ? data.decision : existing.decision

    await query(`
      UPDATE \`quarantine_records\` SET
        \`product\` = ?,
        \`defect_type\` = ?,
        \`severity\` = ?,
        \`source\` = ?,
        \`inspector\` = ?,
        \`condition_desc\` = ?,
        \`status\` = ?,
        \`notes\` = ?,
        \`evidence\` = ?,
        \`decision\` = ?
      WHERE \`id\` = ? OR \`unit\` = ?
    `, [
      product, defectType, severity, source, inspector,
      conditionDesc, status, notes, evidence, decision,
      id, id
    ])

    return this.findById(id)
  },

  async delete(id) {
    const existing = await this.findById(id)
    if (!existing) return false
    await query('DELETE FROM \`quarantine_records\` WHERE \`id\` = ? OR \`unit\` = ?', [id, id])
    return true
  }
}

export const StockRequestModel = {
  async findAll({ branch_id, status, search, limit = 100, offset = 0 } = {}) {
    let sql = 'SELECT * FROM `stock_requests` WHERE 1=1'
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
      sql += ' AND (`request_no` LIKE ? OR `product` LIKE ? OR `reason` LIKE ?)'
      const term = `%${search.trim()}%`
      params.push(term, term, term)
    }

    sql += ' ORDER BY `created_at` DESC LIMIT ? OFFSET ?'
    params.push(Number(limit), Number(offset))

    const rows = await query(sql, params)
    return rows.map(formatStockRequestRow)
  },

  async findById(id) {
    const rows = await query('SELECT * FROM `stock_requests` WHERE `id` = ? OR `request_no` = ? LIMIT 1', [id, id])
    return rows.length > 0 ? formatStockRequestRow(rows[0]) : null
  },

  async create(data) {
    let id = data.id || data.requestNo
    if (!id) {
      let attempts = 0
      while (attempts < 15) {
        const candidate = `SR-${Math.floor(200 + Math.random() * 800)}`
        const existing = await query('SELECT `id` FROM `stock_requests` WHERE `id` = ? LIMIT 1', [candidate])
        if (existing.length === 0) {
          id = candidate
          break
        }
        attempts++
      }
      if (!id) id = `SR-${Date.now().toString().slice(-6)}`
    }
    const requestNo = data.requestNo || data.request_no || id
    const product = data.product || ''
    const productId = data.productId || data.product_id || null
    const currentStock = data.currentStock || data.current_stock || null
    const qty = Number(data.qty || data.requestedQty || data.units || 1)
    const units = data.units || `${qty} units`
    const urgency = data.urgency || 'Medium'
    const expectedDemand = data.expectedDemand || data.expected_demand || null
    const orderLink = data.orderLink || data.order_link || null
    const reason = data.reason || ''
    const notes = data.notes || null
    const status = data.status || 'Pending'
    const branchId = data.branch_id || data.branchId || 'BR-01'
    const branch = data.branch || 'Peshawar'

    await query(`
      INSERT INTO \`stock_requests\` (
        \`id\`, \`request_no\`, \`product\`, \`product_id\`, \`current_stock\`,
        \`qty\`, \`units\`, \`urgency\`, \`expected_demand\`, \`order_link\`,
        \`reason\`, \`notes\`, \`status\`, \`branch_id\`, \`branch\`
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        \`product\` = VALUES(\`product\`),
        \`product_id\` = VALUES(\`product_id\`),
        \`current_stock\` = VALUES(\`current_stock\`),
        \`qty\` = VALUES(\`qty\`),
        \`units\` = VALUES(\`units\`),
        \`urgency\` = VALUES(\`urgency\`),
        \`expected_demand\` = VALUES(\`expected_demand\`),
        \`order_link\` = VALUES(\`order_link\`),
        \`reason\` = VALUES(\`reason\`),
        \`notes\` = VALUES(\`notes\`),
        \`status\` = VALUES(\`status\`)
    `, [
      id, requestNo, product, productId, currentStock,
      qty, units, urgency, expectedDemand, orderLink,
      reason, notes, status, branchId, branch
    ])

    return this.findById(id)
  },

  async update(id, data) {
    const existing = await this.findById(id)
    if (!existing) return null

    const product = data.product !== undefined ? data.product : existing.product
    const productId = data.productId || data.product_id || existing.productId
    const currentStock = data.currentStock || data.current_stock || existing.currentStock
    const qty = data.qty !== undefined ? Number(data.qty) : existing.qty
    const units = data.units || `${qty} units`
    const urgency = data.urgency !== undefined ? data.urgency : existing.urgency
    const expectedDemand = data.expectedDemand || data.expected_demand || existing.expectedDemand
    const orderLink = data.orderLink || data.order_link || existing.orderLink
    const reason = data.reason !== undefined ? data.reason : existing.reason
    const notes = data.notes !== undefined ? data.notes : existing.notes
    const status = data.status !== undefined ? data.status : existing.status

    await query(`
      UPDATE \`stock_requests\` SET
        \`product\` = ?,
        \`product_id\` = ?,
        \`current_stock\` = ?,
        \`qty\` = ?,
        \`units\` = ?,
        \`urgency\` = ?,
        \`expected_demand\` = ?,
        \`order_link\` = ?,
        \`reason\` = ?,
        \`notes\` = ?,
        \`status\` = ?
      WHERE \`id\` = ? OR \`request_no\` = ?
    `, [
      product, productId, currentStock, qty, units,
      urgency, expectedDemand, orderLink, reason, notes,
      status, id, id
    ])

    return this.findById(id)
  },

  async delete(id) {
    const existing = await this.findById(id)
    if (!existing) return false
    await query('DELETE FROM \`stock_requests\` WHERE \`id\` = ? OR \`request_no\` = ?', [id, id])
    return true
  }
}
