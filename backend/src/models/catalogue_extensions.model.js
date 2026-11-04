import { query } from '../config/db.js'

export function formatPriceRuleRow(row) {
  if (!row) return null
  return {
    id: row.id,
    name: row.rule_name || row.product,
    rule_name: row.rule_name || row.product,
    ruleName: row.rule_name || row.product,
    product: row.product,
    product_id: row.product_id,
    productId: row.product_id,
    product_variant: row.product_variant || null,
    productVariant: row.product_variant || null,
    branch_id: row.branch_id,
    branchId: row.branch_id,
    branch: row.branch || 'All Branches',
    customer_segment: row.customer_segment || 'Standard',
    customerSegment: row.customer_segment || 'Standard',
    base_price: Number(row.base_price || 0),
    basePrice: Number(row.base_price || 0),
    branch_price: row.branch_price !== null && row.branch_price !== undefined ? Number(row.branch_price) : null,
    branchPrice: row.branch_price !== null && row.branch_price !== undefined ? Number(row.branch_price) : null,
    minimum_price: row.minimum_price !== null && row.minimum_price !== undefined ? Number(row.minimum_price) : null,
    minimumPrice: row.minimum_price !== null && row.minimum_price !== undefined ? Number(row.minimum_price) : null,
    min_margin_percent: row.min_margin_percent !== null && row.min_margin_percent !== undefined ? Number(row.min_margin_percent) : null,
    minMarginPercent: row.min_margin_percent !== null && row.min_margin_percent !== undefined ? Number(row.min_margin_percent) : null,
    max_discount_percent: Number(row.max_discount_percent ?? row.discount_percent ?? 0),
    maxDiscountPercent: Number(row.max_discount_percent ?? row.discount_percent ?? 0),
    max_discount_pkr: Number(row.max_discount_pkr ?? 0),
    maxDiscountPkr: Number(row.max_discount_pkr ?? 0),
    requires_approval: Boolean(row.requires_approval ?? 1),
    requiresApproval: Boolean(row.requires_approval ?? 1),
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
    effectiveFrom: row.effective_from,
    effective_from: row.effective_from,
    effectiveTo: row.effective_to,
    effective_to: row.effective_to,
    priority: Number(row.priority ?? 1),
    ruleType: row.rule_type,
    rule_type: row.rule_type,
    reason: row.reason || '',
    createdBy: row.created_by,
    created_by: row.created_by,
    approvedBy: row.approved_by,
    approved_by: row.approved_by,
    policyClassification: row.policy_classification || 'Unconfirmed configuration',
    policy_classification: row.policy_classification || 'Unconfirmed configuration',
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
      sql += ' AND (`branch_id` = ? OR `branch_id` = "ALL" OR `branch_id` IS NULL OR `branch_override` = ? OR `branch_override` = "None")'
      params.push(branch_id, branch_id)
    }

    if (status && status !== 'All') {
      sql += ' AND `status` = ?'
      params.push(status)
    }

    if (search && search.trim() !== '') {
      sql += ' AND (`product` LIKE ? OR `rule_name` LIKE ? OR `branch` LIKE ?)'
      const term = `%${search.trim()}%`
      params.push(term, term, term)
    }

    sql += ' ORDER BY `priority` DESC, `created_at` DESC LIMIT ? OFFSET ?'
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
    const productVariant = data.productVariant || data.product_variant || null
    const branchId = data.branchId || data.branch_id || 'ALL'
    const branch = data.branch || 'All Branches'
    const customerSegment = data.customerSegment || data.customer_segment || 'Standard'
    const basePrice = Number(data.basePrice || data.base_price || 0)
    const branchPrice = data.branchPrice !== undefined && data.branchPrice !== null ? Number(data.branchPrice) : (data.branch_price ? Number(data.branch_price) : null)
    const minimumPrice = data.minimumPrice !== undefined && data.minimumPrice !== null ? Number(data.minimumPrice) : (data.minimum_price ? Number(data.minimum_price) : null)
    const minMarginPercent = data.minMarginPercent !== undefined && data.minMarginPercent !== null ? Number(data.minMarginPercent) : (data.min_margin_percent ? Number(data.min_margin_percent) : null)
    const maxDiscountPercent = Number(data.maxDiscountPercent ?? data.max_discount_percent ?? data.discountPercent ?? data.discount_percent ?? 0)
    const maxDiscountPkr = Number(data.maxDiscountPkr ?? data.max_discount_pkr ?? 0)
    const requiresApproval = (data.requiresApproval !== undefined ? Boolean(data.requiresApproval) : (data.requires_approval !== undefined ? Boolean(data.requires_approval) : true)) ? 1 : 0
    const priority = Number(data.priority ?? 1)
    const effectiveFrom = data.effectiveFrom || data.effective_from || null
    const effectiveTo = data.effectiveTo || data.effective_to || null
    const createdBy = data.createdBy || data.created_by || null
    const approvedBy = data.approvedBy || data.approved_by || null
    const policyClassification = data.policyClassification || data.policy_classification || (data.status === 'Active' && approvedBy ? 'Business-approved' : 'Unconfirmed configuration')

    const sellingPrice = String(data.sellingPrice || data.selling_price || basePrice || '0')
    const minimum = String(data.minimum || minimumPrice || '0')
    const landedCostRef = data.landedCostRef || data.landed_cost_ref || null
    const markup = data.markup || null
    const margin = data.margin || null
    const branchOverride = data.branchOverride || data.branch_override || (branchId !== 'ALL' ? `${branch}: ${branchPrice || sellingPrice}` : 'None')
    const effective = data.effective || effectiveFrom || null
    const discountPercent = maxDiscountPercent
    const startDate = data.startDate || data.start_date || effective
    const endDate = data.endDate || data.end_date || effectiveTo || null
    const ruleType = data.ruleType || data.rule_type || 'standard'
    const reason = data.reason || null
    const status = data.status || 'Draft'

    await query(`
      INSERT INTO \`price_rules\` (
        \`id\`, \`rule_name\`, \`product\`, \`product_id\`, \`product_variant\`, \`branch_id\`, \`branch\`,
        \`customer_segment\`, \`base_price\`, \`branch_price\`, \`minimum_price\`,
        \`min_margin_percent\`, \`max_discount_percent\`, \`max_discount_pkr\`, \`requires_approval\`,
        \`effective_from\`, \`effective_to\`, \`priority\`, \`created_by\`, \`approved_by\`,
        \`selling_price\`, \`minimum\`, \`landed_cost_ref\`, \`markup\`, \`margin\`, \`branch_override\`,
        \`effective\`, \`discount_percent\`, \`start_date\`, \`end_date\`,
        \`rule_type\`, \`reason\`, \`status\`, \`policy_classification\`
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        \`rule_name\` = VALUES(\`rule_name\`),
        \`product\` = VALUES(\`product\`),
        \`product_id\` = VALUES(\`product_id\`),
        \`product_variant\` = VALUES(\`product_variant\`),
        \`branch_id\` = VALUES(\`branch_id\`),
        \`branch\` = VALUES(\`branch\`),
        \`customer_segment\` = VALUES(\`customer_segment\`),
        \`base_price\` = VALUES(\`base_price\`),
        \`branch_price\` = VALUES(\`branch_price\`),
        \`minimum_price\` = VALUES(\`minimum_price\`),
        \`min_margin_percent\` = VALUES(\`min_margin_percent\`),
        \`max_discount_percent\` = VALUES(\`max_discount_percent\`),
        \`max_discount_pkr\` = VALUES(\`max_discount_pkr\`),
        \`requires_approval\` = VALUES(\`requires_approval\`),
        \`effective_from\` = VALUES(\`effective_from\`),
        \`effective_to\` = VALUES(\`effective_to\`),
        \`priority\` = VALUES(\`priority\`),
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
        \`status\` = VALUES(\`status\`),
        \`policy_classification\` = VALUES(\`policy_classification\`),
        \`approved_by\` = VALUES(\`approved_by\`)
    `, [
      id, ruleName, product, productId, productVariant, branchId, branch,
      customerSegment, basePrice, branchPrice, minimumPrice,
      minMarginPercent, maxDiscountPercent, maxDiscountPkr, requiresApproval,
      effectiveFrom, effectiveTo, priority, createdBy, approvedBy,
      sellingPrice, minimum, landedCostRef, markup, margin, branchOverride,
      effective, discountPercent, startDate, endDate,
      ruleType, reason, status, policyClassification
    ])

    return this.findById(id)
  },

  async update(id, data) {
    const existing = await this.findById(id)
    if (!existing) return null

    const ruleName = data.name || data.ruleName || data.rule_name || existing.name
    const branchId = data.branchId !== undefined ? data.branchId : (data.branch_id !== undefined ? data.branch_id : existing.branchId)
    const branch = data.branch !== undefined ? data.branch : existing.branch
    const customerSegment = data.customerSegment !== undefined ? data.customerSegment : (data.customer_segment !== undefined ? data.customer_segment : existing.customerSegment)
    const basePrice = data.basePrice !== undefined ? Number(data.basePrice) : (data.base_price !== undefined ? Number(data.base_price) : existing.basePrice)
    const branchPrice = data.branchPrice !== undefined ? (data.branchPrice !== null ? Number(data.branchPrice) : null) : existing.branchPrice
    const minimumPrice = data.minimumPrice !== undefined ? (data.minimumPrice !== null ? Number(data.minimumPrice) : null) : existing.minimumPrice
    const minMarginPercent = data.minMarginPercent !== undefined ? (data.minMarginPercent !== null ? Number(data.minMarginPercent) : null) : existing.minMarginPercent
    const maxDiscountPercent = data.maxDiscountPercent !== undefined ? Number(data.maxDiscountPercent) : (data.max_discount_percent !== undefined ? Number(data.max_discount_percent) : existing.maxDiscountPercent)
    const maxDiscountPkr = data.maxDiscountPkr !== undefined ? Number(data.maxDiscountPkr) : (data.max_discount_pkr !== undefined ? Number(data.max_discount_pkr) : existing.maxDiscountPkr)
    const requiresApproval = data.requiresApproval !== undefined ? (data.requiresApproval ? 1 : 0) : (data.requires_approval !== undefined ? (data.requires_approval ? 1 : 0) : (existing.requiresApproval ? 1 : 0))
    const priority = data.priority !== undefined ? Number(data.priority) : existing.priority
    const effectiveFrom = data.effectiveFrom !== undefined ? data.effectiveFrom : existing.effectiveFrom
    const effectiveTo = data.effectiveTo !== undefined ? data.effectiveTo : existing.effectiveTo

    const sellingPrice = data.sellingPrice !== undefined ? String(data.sellingPrice) : existing.sellingPrice
    const minimum = data.minimum !== undefined ? String(data.minimum) : existing.minimum
    const landedCostRef = data.landedCostRef !== undefined ? data.landedCostRef : existing.landedCostRef
    const markup = data.markup !== undefined ? data.markup : existing.markup
    const margin = data.margin !== undefined ? data.margin : existing.margin
    const branchOverride = data.branchOverride || data.branch_override || existing.branchOverride
    const effective = data.effective !== undefined ? data.effective : existing.effective
    const discountPercent = maxDiscountPercent
    const endDate = data.endDate !== undefined ? data.endDate : existing.endDate
    const reason = data.reason !== undefined ? data.reason : existing.reason
    const status = data.status !== undefined ? data.status : existing.status
    const policyClassification = data.policyClassification !== undefined ? data.policyClassification : (data.policy_classification !== undefined ? data.policy_classification : existing.policyClassification)
    const productVariant = data.productVariant !== undefined ? data.productVariant : (data.product_variant !== undefined ? data.product_variant : existing.productVariant)
    const approvedBy = data.approvedBy !== undefined ? data.approvedBy : (data.approved_by !== undefined ? data.approved_by : (policyClassification === 'Business-approved' ? (data.updatedBy || 'Super Admin') : existing.approvedBy))

    await query(`
      UPDATE \`price_rules\` SET
        \`rule_name\` = ?,
        \`product_variant\` = ?,
        \`branch_id\` = ?,
        \`branch\` = ?,
        \`customer_segment\` = ?,
        \`base_price\` = ?,
        \`branch_price\` = ?,
        \`minimum_price\` = ?,
        \`min_margin_percent\` = ?,
        \`max_discount_percent\` = ?,
        \`max_discount_pkr\` = ?,
        \`requires_approval\` = ?,
        \`priority\` = ?,
        \`effective_from\` = ?,
        \`effective_to\` = ?,
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
        \`status\` = ?,
        \`policy_classification\` = ?,
        \`approved_by\` = ?
      WHERE \`id\` = ? OR \`product\` = ?
    `, [
      ruleName, productVariant, branchId, branch, customerSegment, basePrice, branchPrice,
      minimumPrice, minMarginPercent, maxDiscountPercent, maxDiscountPkr,
      requiresApproval, priority, effectiveFrom, effectiveTo,
      sellingPrice, minimum, landedCostRef, markup,
      margin, branchOverride, effective, discountPercent, endDate,
      reason, status, policyClassification, approvedBy, id, id
    ])

    return this.findById(id)
  },

  async delete(id) {
    const existing = await this.findById(id)
    if (!existing) return false
    await query('DELETE FROM `price_rules` WHERE `id` = ? OR `product` = ?', [id, id])
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
