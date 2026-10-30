import { query, withTransaction } from '../config/db.js'

/**
 * Normalizes a category database row into frontend camelCase contract
 */
export function formatCategoryRow(row) {
  if (!row) return null
  return {
    id: row.id,
    categoryId: row.id,
    name: row.name,
    code: row.code,
    description: row.description || '',
    productCount: Number(row.product_count || 0),
    status: row.status || 'Active',
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString()
  }
}

/**
 * Normalizes a product database row with inventory stock breakdown
 */
export function formatProductRow(row, branchStock = []) {
  if (!row) return null

  const sellingPrice = parseFloat(row.selling_price || 0)
  const costPrice = parseFloat(row.cost_price || 0)
  const dealerPrice = parseFloat(row.dealer_price || 0)
  const isSerialized = Boolean(row.is_serialized)
  const reorderLevel = parseInt(row.reorder_level || 5, 10)

  // Aggregate branch stock if provided
  let totalOnHand = 0
  let totalReserved = 0
  let totalAvailable = 0

  const branchMap = {
    peshawar: 0,
    islamabad: 0,
    lahore: 0,
    rawalpindi: 0
  }

  branchStock.forEach(bs => {
    const onHand = parseInt(bs.on_hand || 0, 10)
    const reserved = parseInt(bs.reserved || 0, 10)
    const available = Math.max(0, onHand - reserved)
    totalOnHand += onHand
    totalReserved += reserved
    totalAvailable += available

    const branchName = (bs.branch || '').toLowerCase().trim()
    if (branchMap[branchName] !== undefined) {
      branchMap[branchName] = available
    }
  })

  // Fallback to row-level if no branch stock array was passed
  const onHand = branchStock.length > 0 ? totalOnHand : parseInt(row.on_hand ?? 0, 10)
  const reserved = branchStock.length > 0 ? totalReserved : parseInt(row.reserved ?? 0, 10)
  const available = branchStock.length > 0 ? totalAvailable : Math.max(0, onHand - reserved)

  return {
    id: row.id,
    product_id: row.id,
    name: row.name,
    product: row.name,
    modelName: row.model_name || row.name,
    sku: row.sku,
    category: row.category,
    categoryId: row.category_id,
    specs: row.specs || '',
    price: `PKR ${sellingPrice.toLocaleString()}`,
    sellingPrice,
    costPrice,
    dealerPrice,
    warranty: row.warranty || '1 Year Standard',
    warrantyMonths: parseInt(row.warranty_months || 12, 10),
    isSerialized,
    reorderLevel,
    total: onHand,
    available,
    reserved,
    inTransit: parseInt(row.in_transit || 0, 10),
    qcHold: parseInt(row.qc_hold || 0, 10),
    stock: `${available} units`,
    peshawar: branchMap.peshawar,
    islamabad: branchMap.islamabad,
    lahore: branchMap.lahore,
    rawalpindi: branchMap.rawalpindi,
    status: row.status || 'Active',
    statusClass: row.status_class || (available > reorderLevel ? 'bg-[#dcfce7] text-[#165A31]' : 'bg-[#fef3c7] text-[#b45309]'),
    isLowStock: available <= reorderLevel,
    branch: row.branch || 'Peshawar',
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
    updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : new Date().toISOString()
  }
}

export const ProductModel = {
  /**
   * Retrieve all product categories with product count
   */
  async findAllCategories() {
    const sql = `
      SELECT c.*, COUNT(p.id) as product_count
      FROM \`categories\` c
      LEFT JOIN \`products\` p ON p.category_id = c.id
      GROUP BY c.id
      ORDER BY c.code ASC
    `
    const rows = await query(sql)
    return rows.map(formatCategoryRow)
  },

  /**
   * Find a single category by id or code
   */
  async findCategoryById(id) {
    const rows = await query('SELECT * FROM `categories` WHERE `id` = ? OR `code` = ? LIMIT 1', [id, id])
    return rows.length > 0 ? formatCategoryRow(rows[0]) : null
  },

  /**
   * Create a new category with code uniqueness check
   */
  async createCategory({ name, code, description, status = 'Active' }) {
    if (!name || !name.trim()) throw new Error('Category name is required')
    if (!code || !code.trim()) throw new Error('Category code is required')

    const cleanCode = code.trim().toUpperCase()
    const existing = await query('SELECT `id` FROM `categories` WHERE `code` = ? LIMIT 1', [cleanCode])
    if (existing.length > 0) {
      throw new Error(`Category code "${cleanCode}" already exists`)
    }

    const [maxRows] = await query("SELECT id FROM `categories` WHERE id LIKE 'CAT-%' ORDER BY id DESC LIMIT 1")
    let nextNum = 6
    if (maxRows && maxRows.id) {
      const match = maxRows.id.match(/CAT-(\d+)/)
      if (match) nextNum = parseInt(match[1], 10) + 1
    }
    const id = `CAT-${String(nextNum).padStart(2, '0')}`

    await query(
      'INSERT INTO `categories` (`id`, `name`, `code`, `description`, `status`) VALUES (?, ?, ?, ?, ?)',
      [id, name.trim(), cleanCode, description?.trim() || null, status]
    )

    return this.findCategoryById(id)
  },

  /**
   * Retrieve all products with optional filters and aggregated branch stock
   */
  async findAll({ category_id, branch_id, search, status, low_stock, limit = 100, offset = 0 } = {}) {
    let sql = 'SELECT p.* FROM `products` p WHERE 1=1'
    const params = []

    if (category_id && category_id !== 'All' && category_id !== 'All Categories') {
      sql += ' AND (p.`category_id` = ? OR p.`category` = ?)'
      params.push(category_id, category_id)
    }

    if (status && status !== 'All') {
      sql += ' AND p.`status` = ?'
      params.push(status)
    }

    if (search && search.trim() !== '') {
      const term = `%${search.trim()}%`
      sql += ' AND (p.`name` LIKE ? OR p.`sku` LIKE ? OR p.`model_name` LIKE ? OR p.`category` LIKE ?)'
      params.push(term, term, term, term)
    }

    sql += ' ORDER BY p.`id` ASC LIMIT ? OFFSET ?'
    params.push(Number(limit), Number(offset))

    const products = await query(sql, params)
    if (products.length === 0) return []

    // Fetch all stock breakdown rows for the products returned
    const productIds = products.map(p => p.id)
    const placeholders = productIds.map(() => '?').join(', ')
    const stockRows = await query(
      `SELECT * FROM \`inventory_stock\` WHERE \`product_id\` IN (${placeholders})`,
      productIds
    )

    // Group stock by product_id
    const stockByProduct = {}
    stockRows.forEach(row => {
      if (!stockByProduct[row.product_id]) {
        stockByProduct[row.product_id] = []
      }
      stockByProduct[row.product_id].push(row)
    })

    let formatted = products.map(p => {
      const pStocks = stockByProduct[p.id] || []
      // If branch_id specified, filter branch stock to that branch
      let relevantStocks = pStocks
      if (branch_id && branch_id !== 'ALL' && branch_id !== 'All Branches') {
        relevantStocks = pStocks.filter(s => s.branch_id === branch_id || s.branch === branch_id)
      }
      return formatProductRow(p, relevantStocks)
    })

    if (low_stock) {
      formatted = formatted.filter(p => p.isLowStock)
    }

    return formatted
  },

  /**
   * Find product by ID with branch stock
   */
  async findById(id, branch_id = null) {
    const rows = await query('SELECT * FROM `products` WHERE `id` = ? OR `sku` = ? LIMIT 1', [id, id])
    if (rows.length === 0) return null

    const p = rows[0]
    let stockQuery = 'SELECT * FROM `inventory_stock` WHERE `product_id` = ?'
    const stockParams = [p.id]

    if (branch_id && branch_id !== 'ALL' && branch_id !== 'All Branches') {
      stockQuery += ' AND (`branch_id` = ? OR `branch` = ?)'
      stockParams.push(branch_id, branch_id)
    }

    const stockRows = await query(stockQuery, stockParams)
    return formatProductRow(p, stockRows)
  },

  /**
   * Create a new product with SKU uniqueness and initial branch stock allocation
   */
  async create(data) {
    const {
      name,
      modelName,
      sku,
      categoryId,
      category,
      specs,
      sellingPrice = 0,
      costPrice = 0,
      dealerPrice = 0,
      warranty = '1 Year Standard',
      warrantyMonths = 12,
      isSerialized = true,
      reorderLevel = 5,
      status = 'Active',
      initialStock = {}
    } = data

    if (!name || !name.trim()) throw new Error('Product name is required')
    if (!sku || !sku.trim()) throw new Error('Product SKU is required')

    const cleanSku = sku.trim().toUpperCase()
    const existing = await query('SELECT `id` FROM `products` WHERE `sku` = ? LIMIT 1', [cleanSku])
    if (existing.length > 0) {
      throw new Error(`Product with SKU "${cleanSku}" already exists`)
    }

    // Resolve category
    let finalCatId = categoryId || 'CAT-01'
    let finalCatName = category || 'Electric Scooters'
    if (categoryId) {
      const cat = await this.findCategoryById(categoryId)
      if (cat) {
        finalCatId = cat.id
        finalCatName = cat.name
      }
    }

    // Generate product ID if not provided
    let id = data.id
    if (!id || !id.startsWith('PROD-')) {
      const maxRows = await query("SELECT id FROM `products` WHERE id LIKE 'PROD-%' ORDER BY id DESC LIMIT 1")
      let nextNum = 11
      if (maxRows.length > 0 && maxRows[0].id) {
        const match = maxRows[0].id.match(/PROD-(\d+)/)
        if (match) nextNum = parseInt(match[1], 10) + 1
      }
      id = `PROD-${String(nextNum).padStart(3, '0')}`
    }

    const sPrice = Math.max(0, parseFloat(sellingPrice || 0))
    const cPrice = Math.max(0, parseFloat(costPrice || 0))
    const dPrice = Math.max(0, parseFloat(dealerPrice || 0))
    const reorder = Math.max(0, parseInt(reorderLevel || 5, 10))
    const isSer = isSerialized ? 1 : 0
    const statusClass = status === 'Active' ? 'bg-[#dcfce7] text-[#165A31]' : 'bg-gray-100 text-gray-700'

    await withTransaction(async (conn) => {
      await conn.execute(
        `INSERT INTO \`products\` (
          \`id\`, \`name\`, \`model_name\`, \`sku\`, \`category_id\`, \`category\`, \`specs\`,
          \`selling_price\`, \`cost_price\`, \`dealer_price\`, \`warranty\`, \`warranty_months\`,
          \`is_serialized\`, \`reorder_level\`, \`status\`, \`status_class\`
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id, name.trim(), (modelName || name).trim(), cleanSku, finalCatId, finalCatName,
          specs || null, sPrice, cPrice, dPrice, warranty, parseInt(warrantyMonths || 12, 10),
          isSer, reorder, status, statusClass
        ]
      )

      // Initialize default branch stock rows
      const branches = [
        { id: 'BR-01', name: 'Peshawar', initial: parseInt(initialStock.peshawar || 0, 10) },
        { id: 'BR-02', name: 'Islamabad', initial: parseInt(initialStock.islamabad || 0, 10) },
        { id: 'BR-03', name: 'Lahore', initial: parseInt(initialStock.lahore || 0, 10) },
        { id: 'BR-04', name: 'Rawalpindi', initial: parseInt(initialStock.rawalpindi || 0, 10) }
      ]

      for (const b of branches) {
        const onHand = Math.max(0, b.initial)
        await conn.execute(
          `INSERT INTO \`inventory_stock\` (
            \`product_id\`, \`branch_id\`, \`branch\`, \`on_hand\`, \`reserved\`, \`available\`, \`reorder_level\`
          ) VALUES (?, ?, ?, ?, 0, ?, ?)
          ON DUPLICATE KEY UPDATE \`on_hand\` = VALUES(\`on_hand\`), \`available\` = VALUES(\`available\`), \`reorder_level\` = VALUES(\`reorder_level\`)`,
          [id, b.id, b.name, onHand, onHand, reorder]
        )
      }
    })

    return this.findById(id)
  },

  /**
   * Update existing product details
   */
  async update(id, data) {
    const existing = await this.findById(id)
    if (!existing) throw new Error(`Product ${id} not found`)

    const fields = []
    const params = []

    if (data.name !== undefined) {
      fields.push('`name` = ?')
      params.push(data.name.trim())
    }
    if (data.modelName !== undefined) {
      fields.push('`model_name` = ?')
      params.push(data.modelName.trim())
    }
    if (data.sku !== undefined && data.sku.trim() !== existing.sku) {
      const cleanSku = data.sku.trim().toUpperCase()
      const checkSku = await query('SELECT `id` FROM `products` WHERE `sku` = ? AND `id` != ? LIMIT 1', [cleanSku, existing.id])
      if (checkSku.length > 0) throw new Error(`SKU "${cleanSku}" is already taken by another product`)
      fields.push('`sku` = ?')
      params.push(cleanSku)
    }
    if (data.categoryId !== undefined) {
      const cat = await this.findCategoryById(data.categoryId)
      if (cat) {
        fields.push('`category_id` = ?', '`category` = ?')
        params.push(cat.id, cat.name)
      }
    }
    if (data.specs !== undefined) {
      fields.push('`specs` = ?')
      params.push(data.specs)
    }
    const sPrice = data.sellingPrice !== undefined ? data.sellingPrice : data.selling_price
    if (sPrice !== undefined) {
      fields.push('`selling_price` = ?')
      params.push(Math.max(0, parseFloat(sPrice)))
    }
    const cPrice = data.costPrice !== undefined ? data.costPrice : data.cost_price
    if (cPrice !== undefined) {
      fields.push('`cost_price` = ?')
      params.push(Math.max(0, parseFloat(cPrice)))
    }
    const dPrice = data.dealerPrice !== undefined ? data.dealerPrice : data.dealer_price
    if (dPrice !== undefined) {
      fields.push('`dealer_price` = ?')
      params.push(Math.max(0, parseFloat(dPrice)))
    }
    if (data.warranty !== undefined) {
      fields.push('`warranty` = ?')
      params.push(data.warranty)
    }
    const wMonths = data.warrantyMonths !== undefined ? data.warrantyMonths : data.warranty_months
    if (wMonths !== undefined) {
      fields.push('`warranty_months` = ?')
      params.push(parseInt(wMonths, 10))
    }
    const rLevel = data.reorderLevel !== undefined ? data.reorderLevel : data.reorder_level
    if (rLevel !== undefined) {
      const reorder = Math.max(0, parseInt(rLevel, 10))
      fields.push('`reorder_level` = ?')
      params.push(reorder)
      // update default reorder level across branches
      await query('UPDATE `inventory_stock` SET `reorder_level` = ? WHERE `product_id` = ?', [reorder, existing.id])
    }
    if (data.status !== undefined) {
      fields.push('`status` = ?', '`status_class` = ?')
      params.push(data.status, data.status === 'Active' ? 'bg-[#dcfce7] text-[#165A31]' : 'bg-gray-100 text-gray-700')
    }

    if (fields.length > 0) {
      params.push(existing.id)
      await query(`UPDATE \`products\` SET ${fields.join(', ')} WHERE \`id\` = ?`, params)
    }

    return this.findById(existing.id)
  }
}
