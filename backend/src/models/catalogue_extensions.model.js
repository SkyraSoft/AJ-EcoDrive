import { query } from '../config/db.js'

export function formatPriceRuleRow(row) {
  if (!row) return null
  return {
    id: row.id,
    name: row.rule_name || row.product,
    rule_name: row.rule_name || row.product,
    product: row.product,
    product_id: row.product_id,
    sellingPrice: row.selling_price,
    selling_price: row.selling_price,
    minimum: row.minimum,
    landedCostRef: row.landed_cost_ref,
    landed_cost_ref: row.landed_cost_ref,
    markup: row.markup,
    margin: row.margin,
    branchOverride: row.branch_override,
    branch_override: row.branch_override,
    effective: row.effective,
    discountPercent: Number(row.discount_percent || 0),
    discount_percent: Number(row.discount_percent || 0),
    startDate: row.start_date,
    start_date: row.start_date,
    endDate: row.end_date,
    end_date: row.end_date,
    ruleType: row.rule_type,
    rule_type: row.rule_type,
    reason: row.reason || '',
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  }
}

export function formatProductRequestRow(row) {
  if (!row) return null
  return {
    id: row.id,
    product: row.product_name,
    productName: row.product_name,
    product_name: row.product_name,
    category: row.category,
    specifications: row.specifications || '',
    reference: row.reference || '',
    customerDemand: row.customer_demand || '',
    customer_demand: row.customer_demand || '',
    quantity: Number(row.quantity || 1),
    urgency: row.urgency,
    images: row.images || '',
    reason: row.reason || '',
    status: row.status,
    branch: row.branch,
    branch_id: row.branch_id,
    branchId: row.branch_id,
    requestedBy: row.requested_by,
    requested_by: row.requested_by,
    date: row.created_at ? new Date(row.created_at).toISOString().split('T')[0] : 'Today',
    createdAt: row.created_at,
    updatedAt: row.updated_at
  }
}

export const PriceRuleModel = {
  async findAll({ branch_id, status, search, limit = 100, offset = 0 } = {}) {
    let sql = 'SELECT * FROM `price_rules` WHERE 1=1'
    const params = []

    if (branch_id && branch_id !== 'ALL' && branch_id !== 'All Branches') {
      sql += ' AND (`branch_override` = ? OR `branch_override` = ? OR `branch_override` = "None")'
      params.push(branch_id, branch_id)
    }

    if (status && status !== 'All') {
      sql += ' AND `status` = ?'
      params.push(status)
    }

    if (search && search.trim() !== '') {
      sql += ' AND (`product` LIKE ? OR `rule_name` LIKE ?)'
      const term = `%${search.trim()}%`
      params.push(term, term)
    }

    sql += ' ORDER BY `created_at` DESC LIMIT ? OFFSET ?'
    params.push(Number(limit), Number(offset))

    const rows = await query(sql, params)
    return rows.map(formatPriceRuleRow)
  },

  async findById(id) {
    const rows = await query('SELECT * FROM `price_rules` WHERE `id` = ? OR `product` = ? LIMIT 1', [id, id])
    return rows.length > 0 ? formatPriceRuleRow(rows[0]) : null
  },

  async create(data) {
    let id = data.id
    if (!id) {
      let attempts = 0
      while (attempts < 15) {
        const candidate = `PR-${Math.floor(100 + Math.random() * 900)}`
        const existing = await query('SELECT `id` FROM `price_rules` WHERE `id` = ? LIMIT 1', [candidate])
        if (existing.length === 0) {
          id = candidate
          break
        }
        attempts++
      }
      if (!id) id = `PR-${Date.now().toString().slice(-6)}`
    }
    const ruleName = data.name || data.ruleName || data.rule_name || data.product || 'Standard Price Rule'
    const product = data.product || ''
    const productId = data.productId || data.product_id || null
    const sellingPrice = String(data.sellingPrice || data.selling_price || '0')
    const minimum = String(data.minimum || '0')
    const landedCostRef = data.landedCostRef || data.landed_cost_ref || null
    const markup = data.markup || null
    const margin = data.margin || null
    const branchOverride = data.branchOverride || data.branch_override || 'None'
    const effective = data.effective || null
    const discountPercent = Number(data.discountPercent || data.discount_percent || 0)
    const startDate = data.startDate || data.start_date || effective
    const endDate = data.endDate || data.end_date || null
    const ruleType = data.ruleType || data.rule_type || 'standard'
    const reason = data.reason || null
    const status = data.status || 'Active'

    await query(`
      INSERT INTO \`price_rules\` (
        \`id\`, \`rule_name\`, \`product\`, \`product_id\`, \`selling_price\`,
        \`minimum\`, \`landed_cost_ref\`, \`markup\`, \`margin\`, \`branch_override\`,
        \`effective\`, \`discount_percent\`, \`start_date\`, \`end_date\`,
        \`rule_type\`, \`reason\`, \`status\`
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        \`rule_name\` = VALUES(\`rule_name\`),
        \`product\` = VALUES(\`product\`),
        \`selling_price\` = VALUES(\`selling_price\`),
        \`minimum\` = VALUES(\`minimum\`),
        \`landed_cost_ref\` = VALUES(\`landed_cost_ref\`),
        \`markup\` = VALUES(\`markup\`),
        \`margin\` = VALUES(\`margin\`),
        \`branch_override\` = VALUES(\`branch_override\`),
        \`effective\` = VALUES(\`effective\`),
        \`discount_percent\` = VALUES(\`discount_percent\`),
        \`start_date\` = VALUES(\`start_date\`),
        \`end_date\` = VALUES(\`end_date\`),
        \`rule_type\` = VALUES(\`rule_type\`),
        \`reason\` = VALUES(\`reason\`),
        \`status\` = VALUES(\`status\`)
    `, [
      id, ruleName, product, productId, sellingPrice,
      minimum, landedCostRef, markup, margin, branchOverride,
      effective, discountPercent, startDate, endDate,
      ruleType, reason, status
    ])

    return this.findById(id)
  },

  async update(id, data) {
    const existing = await this.findById(id)
    if (!existing) return null

    const ruleName = data.name || data.ruleName || data.rule_name || existing.name
    const sellingPrice = data.sellingPrice !== undefined ? String(data.sellingPrice) : existing.sellingPrice
    const minimum = data.minimum !== undefined ? String(data.minimum) : existing.minimum
    const landedCostRef = data.landedCostRef !== undefined ? data.landedCostRef : existing.landedCostRef
    const markup = data.markup !== undefined ? data.markup : existing.markup
    const margin = data.margin !== undefined ? data.margin : existing.margin
    const branchOverride = data.branchOverride || data.branch_override || existing.branchOverride
    const effective = data.effective !== undefined ? data.effective : existing.effective
    const discountPercent = data.discountPercent !== undefined ? Number(data.discountPercent) : existing.discountPercent
    const endDate = data.endDate !== undefined ? data.endDate : existing.endDate
    const reason = data.reason !== undefined ? data.reason : existing.reason
    const status = data.status !== undefined ? data.status : existing.status

    await query(`
      UPDATE \`price_rules\` SET
        \`rule_name\` = ?,
        \`selling_price\` = ?,
        \`minimum\` = ?,
        \`landed_cost_ref\` = ?,
        \`markup\` = ?,
        \`margin\` = ?,
        \`branch_override\` = ?,
        \`effective\` = ?,
        \`discount_percent\` = ?,
        \`end_date\` = ?,
        \`reason\` = ?,
        \`status\` = ?
      WHERE \`id\` = ? OR \`product\` = ?
    `, [
      ruleName, sellingPrice, minimum, landedCostRef, markup,
      margin, branchOverride, effective, discountPercent, endDate,
      reason, status, id, id
    ])

    return this.findById(id)
  },

  async delete(id) {
    const existing = await this.findById(id)
    if (!existing) return false
    await query('DELETE FROM \`price_rules\` WHERE \`id\` = ? OR \`product\` = ?', [id, id])
    return true
  }
}

export const ProductRequestModel = {
  async findAll({ branch_id, status, search, limit = 100, offset = 0 } = {}) {
    let sql = 'SELECT * FROM `product_requests` WHERE 1=1'
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
      sql += ' AND (`product_name` LIKE ? OR `category` LIKE ? OR `reason` LIKE ?)'
      const term = `%${search.trim()}%`
      params.push(term, term, term)
    }

    sql += ' ORDER BY `created_at` DESC LIMIT ? OFFSET ?'
    params.push(Number(limit), Number(offset))

    const rows = await query(sql, params)
    return rows.map(formatProductRequestRow)
  },

  async findById(id) {
    const rows = await query('SELECT * FROM `product_requests` WHERE `id` = ? LIMIT 1', [id])
    return rows.length > 0 ? formatProductRequestRow(rows[0]) : null
  },

  async create(data) {
    let id = data.id
    if (!id) {
      let attempts = 0
      while (attempts < 15) {
        const candidate = `REQ-${Math.floor(100 + Math.random() * 900)}`
        const existing = await query('SELECT `id` FROM `product_requests` WHERE `id` = ? LIMIT 1', [candidate])
        if (existing.length === 0) {
          id = candidate
          break
        }
        attempts++
      }
      if (!id) id = `REQ-${Date.now().toString().slice(-6)}`
    }
    const productName = data.productName || data.product || data.product_name || ''
    const category = data.category || 'Electric Bikes'
    const specifications = data.specifications || null
    const reference = data.reference || null
    const customerDemand = data.customerDemand || data.customer_demand || null
    const quantity = Number(data.quantity || 1)
    const urgency = data.urgency || 'Medium'
    const images = data.images || null
    const reason = data.reason || ''
    const status = data.status || 'Submitted'
    const branchId = data.branch_id || data.branchId || 'BR-01'
    const branch = data.branch || 'Peshawar'
    const requestedBy = data.requestedBy || data.requested_by || 'Branch Manager'

    await query(`
      INSERT INTO \`product_requests\` (
        \`id\`, \`product_name\`, \`category\`, \`specifications\`, \`reference\`,
        \`customer_demand\`, \`quantity\`, \`urgency\`, \`images\`, \`reason\`,
        \`status\`, \`branch_id\`, \`branch\`, \`requested_by\`
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        \`product_name\` = VALUES(\`product_name\`),
        \`category\` = VALUES(\`category\`),
        \`specifications\` = VALUES(\`specifications\`),
        \`reference\` = VALUES(\`reference\`),
        \`customer_demand\` = VALUES(\`customer_demand\`),
        \`quantity\` = VALUES(\`quantity\`),
        \`urgency\` = VALUES(\`urgency\`),
        \`images\` = VALUES(\`images\`),
        \`reason\` = VALUES(\`reason\`),
        \`status\` = VALUES(\`status\`)
    `, [
      id, productName, category, specifications, reference,
      customerDemand, quantity, urgency, images, reason,
      status, branchId, branch, requestedBy
    ])

    return this.findById(id)
  },

  async update(id, data) {
    const existing = await this.findById(id)
    if (!existing) return null

    const productName = data.productName || data.product || data.product_name || existing.productName
    const category = data.category !== undefined ? data.category : existing.category
    const specifications = data.specifications !== undefined ? data.specifications : existing.specifications
    const reference = data.reference !== undefined ? data.reference : existing.reference
    const customerDemand = data.customerDemand !== undefined ? data.customerDemand : existing.customerDemand
    const quantity = data.quantity !== undefined ? Number(data.quantity) : existing.quantity
    const urgency = data.urgency !== undefined ? data.urgency : existing.urgency
    const images = data.images !== undefined ? data.images : existing.images
    const reason = data.reason !== undefined ? data.reason : existing.reason
    const status = data.status !== undefined ? data.status : existing.status

    await query(`
      UPDATE \`product_requests\` SET
        \`product_name\` = ?,
        \`category\` = ?,
        \`specifications\` = ?,
        \`reference\` = ?,
        \`customer_demand\` = ?,
        \`quantity\` = ?,
        \`urgency\` = ?,
        \`images\` = ?,
        \`reason\` = ?,
        \`status\` = ?
      WHERE \`id\` = ?
    `, [
      productName, category, specifications, reference,
      customerDemand, quantity, urgency, images, reason,
      status, id
    ])

    return this.findById(id)
  },

  async delete(id) {
    const existing = await this.findById(id)
    if (!existing) return false
    await query('DELETE FROM \`product_requests\` WHERE \`id\` = ?', [id])
    return true
  }
}
