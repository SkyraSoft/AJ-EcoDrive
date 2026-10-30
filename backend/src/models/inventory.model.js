import { query, withTransaction } from '../config/db.js'

/**
 * Branch lookup helper
 */
const BRANCH_NAMES = {
  'BR-01': 'Peshawar',
  'BR-02': 'Islamabad',
  'BR-03': 'Lahore',
  'BR-04': 'Rawalpindi'
}

function resolveBranchName(branchId, fallback = 'Peshawar') {
  if (!branchId) return fallback
  return BRANCH_NAMES[branchId] || branchId
}

function resolveBranchId(branchName, fallback = 'BR-01') {
  if (!branchName) return fallback
  for (const [id, name] of Object.entries(BRANCH_NAMES)) {
    if (name.toLowerCase() === branchName.toLowerCase() || id.toLowerCase() === branchName.toLowerCase()) {
      return id
    }
  }
  return fallback
}

/**
 * Normalizes an inventory stock row into frontend structure
 */
export function formatStockRow(row) {
  if (!row) return null
  const onHand = parseInt(row.on_hand || 0, 10)
  const reserved = parseInt(row.reserved || 0, 10)
  const available = Math.max(0, onHand - reserved)
  const reorderLevel = parseInt(row.reorder_level || 5, 10)

  return {
    id: row.id,
    productId: row.product_id,
    product_id: row.product_id,
    product: row.product_name || row.name,
    name: row.product_name || row.name,
    sku: row.sku,
    category: row.category,
    categoryId: row.category_id,
    branch_id: row.branch_id,
    branchId: row.branch_id,
    branch: row.branch,
    branchName: row.branch,
    onHand,
    reserved,
    available,
    incoming: parseInt(row.incoming || 0, 10),
    reorderLevel,
    isLowStock: available <= reorderLevel,
    stockStatus: available <= 0 ? 'Out of Stock' : (available <= reorderLevel ? 'Low Stock' : 'Healthy'),
    statusClass: available <= 0 ? 'bg-red-50 text-red-700' : (available <= reorderLevel ? 'bg-[#fef3c7] text-[#b45309]' : 'bg-[#dcfce7] text-[#165A31]'),
    updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : new Date().toISOString()
  }
}

/**
 * Normalizes a stock movement ledger row
 */
export function formatMovementRow(row) {
  if (!row) return null
  const created = row.created_at ? new Date(row.created_at) : new Date()
  const timeFormatted = created.toISOString().replace('T', ' ').slice(0, 16)

  return {
    id: row.id,
    movementNumber: row.movement_number,
    movement: row.reference_type,
    type: row.reference_type,
    reference: row.reference_id,
    referenceId: row.reference_id,
    productId: row.product_id,
    product_id: row.product_id,
    product: row.product_name,
    unit: row.unit_id,
    unitProduct: row.unit_id || row.product_name,
    branch_id: row.branch_id,
    branch: row.branch,
    quantity: parseInt(row.quantity || 0, 10),
    onHandBefore: parseInt(row.on_hand_before || 0, 10),
    onHandAfter: parseInt(row.on_hand_after || 0, 10),
    user: row.user || 'System',
    reason: row.reason,
    notes: row.notes || '',
    time: timeFormatted,
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString()
  }
}

/**
 * Normalizes a stock adjustment row
 */
export function formatAdjustmentRow(row) {
  if (!row) return null
  const oldQty = parseInt(row.old_quantity || 0, 10)
  const newQty = parseInt(row.new_quantity || 0, 10)
  const diff = parseInt(row.difference !== null ? row.difference : (newQty - oldQty), 10)

  return {
    id: row.id,
    adjustment_id: row.id,
    adjustmentNo: row.adjustment_number || row.id,
    branch_id: row.branch_id,
    branch: row.branch,
    product_id: row.product_id,
    product: row.product_name,
    productUnit: row.unit_id || row.product_name,
    unit_id: row.unit_id,
    type: row.adjustment_type || 'Quantity',
    old_quantity: oldQty,
    new_quantity: newQty,
    existingState: `${oldQty} available`,
    correctedState: `${newQty} available`,
    difference: diff,
    qtyEffect: diff > 0 ? `+${diff}` : String(diff),
    reason: row.reason,
    status: row.status,
    statusClass: row.status_class || (row.status === 'Approved' ? 'bg-[#dcfce7] text-[#165A31]' : 'bg-[#fef3c7] text-[#b45309]'),
    requestedBy: row.requested_by,
    adjusted_by: row.requested_by,
    approvedBy: row.approved_by,
    notes: row.notes || '',
    date: row.created_at ? new Date(row.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString()
  }
}

/**
 * Normalizes a stock transfer row
 */
export function formatTransferRow(row, items = []) {
  if (!row) return null
  return {
    id: row.id,
    transfer_id: row.id,
    transferNumber: row.transfer_number || row.id,
    fromBranch_id: row.from_branch_id,
    from: row.from_branch,
    fromBranch: row.from_branch,
    toBranch_id: row.to_branch_id,
    to: row.to_branch,
    toBranch: row.to_branch,
    totalUnits: parseInt(row.total_units || 0, 10),
    units: String(row.total_units || 0),
    carrier: row.carrier || 'Internal Logistics',
    status: row.status,
    statusClass: row.status_class || (row.status === 'Received' ? 'bg-[#dcfce7] text-[#165A31]' : (row.status === 'In Transit' ? 'bg-blue-50 text-blue-700' : 'bg-[#fef3c7] text-[#b45309]')),
    requestedBy: row.requested_by,
    approvedBy: row.approved_by,
    dispatchedBy: row.dispatched_by,
    receivedBy: row.received_by,
    notes: row.notes || '',
    dispatched: row.dispatched_at ? new Date(row.dispatched_at).toISOString().split('T')[0] : null,
    receivedDate: row.received_at ? new Date(row.received_at).toISOString().split('T')[0] : null,
    items: items.map(item => ({
      id: item.id,
      transfer_id: item.transfer_id,
      product_id: item.product_id,
      product: item.product_name,
      sku: item.sku,
      requestedQty: parseInt(item.quantity || 1, 10),
      dispatchedQty: parseInt(item.dispatched_qty || 0, 10),
      receivedQty: parseInt(item.received_qty || 0, 10),
      unit_ids: typeof item.unit_ids === 'string' ? JSON.parse(item.unit_ids || '[]') : (item.unit_ids || [])
    })),
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString()
  }
}

/**
 * Normalizes a serialized unit row
 */
export function formatUnitRow(row) {
  if (!row) return null
  const landedCost = parseFloat(row.landed_cost || 0)
  const sellingPrice = parseFloat(row.selling_price || 0)

  return {
    id: row.id,
    unit_id: row.unit_id || row.id,
    serial: row.serial_number,
    serialNumber: row.serial_number,
    chassis: row.chassis_number,
    chassisNumber: row.chassis_number,
    vin: row.vin,
    motorNumber: row.motor_number,
    batteryNumber: row.battery_number,
    product_id: row.product_id,
    product: row.product_name,
    sku: row.sku,
    branch_id: row.branch_id,
    branch: row.branch,
    location: row.location || 'Showroom Floor',
    landedCost: `PKR ${landedCost.toLocaleString()}`,
    sellingPrice: `PKR ${sellingPrice.toLocaleString()}`,
    status: row.status || 'Available',
    statusClass: row.status_class || (row.status === 'Available' ? 'bg-[#dcfce7] text-[#165A31]' : 'bg-amber-50 text-amber-700'),
    condition: row.condition_status || 'Good',
    sourcePo: row.source_po,
    receiptId: row.receipt_id,
    orderId: row.order_id,
    customerId: row.customer_id,
    warrantyExpiry: row.warranty_expiry ? new Date(row.warranty_expiry).toISOString().split('T')[0] : null,
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString()
  }
}

export const InventoryModel = {
  /**
   * Get Stock Summary with computed available stock and low stock alerts
   */
  async getStockSummary({ branch_id, product_id, category_id, search, low_stock, limit = 100, offset = 0 } = {}) {
    let sql = `
      SELECT s.*, p.name as product_name, p.sku, p.category, p.category_id,
             (s.on_hand - s.reserved) as computed_available
      FROM \`inventory_stock\` s
      JOIN \`products\` p ON p.id = s.product_id
      WHERE 1=1
    `
    const params = []

    if (product_id) {
      sql += ' AND (s.`product_id` = ? OR p.`sku` = ?)'
      params.push(product_id, product_id)
    }

    if (branch_id && branch_id !== 'ALL' && branch_id !== 'All Branches') {
      sql += ' AND (s.`branch_id` = ? OR s.`branch` = ?)'
      params.push(branch_id, branch_id)
    }

    if (category_id && category_id !== 'All' && category_id !== 'All Categories') {
      sql += ' AND (p.`category_id` = ? OR p.`category` = ?)'
      params.push(category_id, category_id)
    }

    if (search && search.trim() !== '') {
      const term = `%${search.trim()}%`
      sql += ' AND (p.`name` LIKE ? OR p.`sku` LIKE ? OR p.`category` LIKE ?)'
      params.push(term, term, term)
    }

    if (low_stock) {
      sql += ' AND (s.on_hand - s.reserved) <= s.reorder_level'
    }

    sql += ' ORDER BY s.branch_id ASC, p.id ASC LIMIT ? OFFSET ?'
    params.push(Number(limit), Number(offset))

    const rows = await query(sql, params)
    return rows.map(formatStockRow)
  },

  /**
   * Helper: Ensure stock row exists for a product and branch
   */
  async ensureStockRow(conn, productId, branchId, branchName) {
    const finalBranchId = resolveBranchId(branchId)
    const finalBranchName = branchName || resolveBranchName(finalBranchId)

    await conn.execute(
      `INSERT INTO \`inventory_stock\` (
        \`product_id\`, \`branch_id\`, \`branch\`, \`on_hand\`, \`reserved\`, \`available\`, \`reorder_level\`
      ) VALUES (?, ?, ?, 0, 0, 0, 5)
      ON DUPLICATE KEY UPDATE \`branch\` = VALUES(\`branch\`)`,
      [productId, finalBranchId, finalBranchName]
    )
  },

  /**
   * Stock Inward Receipt (Atomic Transaction with FOR UPDATE lock)
   */
  async recordReceipt({ product_id, branch_id, branch, quantity, user = 'System', reference = 'GRN', notes = '' }) {
    const qty = parseInt(quantity, 10)
    if (!qty || qty <= 0) throw new Error('Receipt quantity must be greater than 0')
    if (!product_id) throw new Error('Product ID is required for stock receipt')

    const finalBranchId = resolveBranchId(branch_id)
    const finalBranchName = branch || resolveBranchName(finalBranchId)

    return await withTransaction(async (conn) => {
      // 1. Ensure row exists
      await this.ensureStockRow(conn, product_id, finalBranchId, finalBranchName)

      // 2. Lock row FOR UPDATE
      const [stockRows] = await conn.execute(
        'SELECT * FROM `inventory_stock` WHERE `product_id` = ? AND `branch_id` = ? FOR UPDATE',
        [product_id, finalBranchId]
      )
      const stock = stockRows[0]
      const beforeOnHand = parseInt(stock.on_hand || 0, 10)
      const reserved = parseInt(stock.reserved || 0, 10)
      const afterOnHand = beforeOnHand + qty
      const afterAvailable = Math.max(0, afterOnHand - reserved)

      // 3. Update stock table
      await conn.execute(
        'UPDATE `inventory_stock` SET `on_hand` = ?, `available` = ?, `updated_at` = NOW() WHERE `id` = ?',
        [afterOnHand, afterAvailable, stock.id]
      )

      // 4. Resolve product name
      const [prodRows] = await conn.execute('SELECT `name` FROM `products` WHERE `id` = ? LIMIT 1', [product_id])
      const productName = prodRows[0]?.name || product_id

      // 5. Generate movement number and insert immutable ledger entry
      const movementNumber = `MOV-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`
      await conn.execute(
        `INSERT INTO \`stock_movements\` (
          \`movement_number\`, \`reference_type\`, \`reference_id\`, \`product_id\`, \`product_name\`,
          \`unit_id\`, \`branch_id\`, \`branch\`, \`quantity\`, \`on_hand_before\`, \`on_hand_after\`,
          \`user\`, \`reason\`, \`notes\`
        ) VALUES (?, 'RECEIPT', ?, ?, ?, NULL, ?, ?, ?, ?, ?, ?, 'Stock Inward Receipt', ?)`,
        [movementNumber, reference, product_id, productName, finalBranchId, finalBranchName, qty, beforeOnHand, afterOnHand, user, notes]
      )

      return {
        success: true,
        movementNumber,
        productId: product_id,
        branchId: finalBranchId,
        beforeOnHand,
        afterOnHand,
        available: afterAvailable
      }
    })
  },

  /**
   * Stock Issue / Dispatch (Atomic Transaction with FOR UPDATE lock & negative stock check)
   */
  async recordIssue({ product_id, branch_id, branch, quantity, user = 'System', reference = 'ISSUE', notes = '', reason = 'Stock Issue' }) {
    const qty = parseInt(quantity, 10)
    if (!qty || qty <= 0) throw new Error('Issue quantity must be greater than 0')
    if (!product_id) throw new Error('Product ID is required for stock issue')

    const finalBranchId = resolveBranchId(branch_id)
    const finalBranchName = branch || resolveBranchName(finalBranchId)

    return await withTransaction(async (conn) => {
      // 1. Lock row FOR UPDATE
      const [stockRows] = await conn.execute(
        'SELECT * FROM `inventory_stock` WHERE `product_id` = ? AND `branch_id` = ? FOR UPDATE',
        [product_id, finalBranchId]
      )
      if (stockRows.length === 0) {
        throw new Error(`No stock record found for product ${product_id} in branch ${finalBranchName}`)
      }

      const stock = stockRows[0]
      const beforeOnHand = parseInt(stock.on_hand || 0, 10)
      const reserved = parseInt(stock.reserved || 0, 10)
      const currentAvailable = beforeOnHand - reserved

      // Check available quantity: cannot cause negative available stock
      if (currentAvailable < qty) {
        throw new Error(`Insufficient available stock for product ${product_id}. Available: ${currentAvailable}, Requested: ${qty}`)
      }

      const afterOnHand = beforeOnHand - qty
      const afterAvailable = afterOnHand - reserved

      // 2. Update stock table
      await conn.execute(
        'UPDATE `inventory_stock` SET `on_hand` = ?, `available` = ?, `updated_at` = NOW() WHERE `id` = ?',
        [afterOnHand, afterAvailable, stock.id]
      )

      // 3. Resolve product name
      const [prodRows] = await conn.execute('SELECT `name` FROM `products` WHERE `id` = ? LIMIT 1', [product_id])
      const productName = prodRows[0]?.name || product_id

      // 4. Generate movement number and insert immutable ledger entry
      const movementNumber = `MOV-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`
      await conn.execute(
        `INSERT INTO \`stock_movements\` (
          \`movement_number\`, \`reference_type\`, \`reference_id\`, \`product_id\`, \`product_name\`,
          \`unit_id\`, \`branch_id\`, \`branch\`, \`quantity\`, \`on_hand_before\`, \`on_hand_after\`,
          \`user\`, \`reason\`, \`notes\`
        ) VALUES (?, 'ISSUE', ?, ?, ?, NULL, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [movementNumber, reference, product_id, productName, finalBranchId, finalBranchName, -qty, beforeOnHand, afterOnHand, user, reason, notes]
      )

      return {
        success: true,
        movementNumber,
        productId: product_id,
        branchId: finalBranchId,
        beforeOnHand,
        afterOnHand,
        available: afterAvailable
      }
    })
  },

  /**
   * Find all stock adjustments
   */
  async findAllAdjustments({ branch_id, status, search, limit = 100, offset = 0 } = {}) {
    let sql = 'SELECT * FROM `stock_adjustments` WHERE 1=1'
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
      sql += ' AND (`adjustment_number` LIKE ? OR `product_name` LIKE ? OR `reason` LIKE ? OR `requested_by` LIKE ?)'
      params.push(term, term, term, term)
    }

    sql += ' ORDER BY `created_at` DESC LIMIT ? OFFSET ?'
    params.push(Number(limit), Number(offset))

    const rows = await query(sql, params)
    return rows.map(formatAdjustmentRow)
  },

  /**
   * Find single stock adjustment by ID
   */
  async findAdjustmentById(id) {
    const rows = await query('SELECT * FROM `stock_adjustments` WHERE `id` = ? OR `adjustment_number` = ? LIMIT 1', [id, id])
    return rows.length > 0 ? formatAdjustmentRow(rows[0]) : null
  },

  /**
   * Create Stock Adjustment with MANDATORY REASON validation
   */
  async createAdjustment(data) {
    const {
      branch_id,
      branch,
      product_id,
      productName,
      unit_id,
      adjustment_type = 'Quantity',
      old_quantity = 0,
      new_quantity = 0,
      reason,
      requested_by = 'Branch Manager',
      notes = ''
    } = data

    // STRICT MANDATORY REASON VALIDATION
    if (!reason || typeof reason !== 'string' || reason.trim() === '') {
      const err = new Error('Stock adjustment reason is mandatory.')
      err.status = 422
      throw err
    }

    if (!product_id && !productName) {
      throw new Error('Product is required for stock adjustment.')
    }

    const finalBranchId = resolveBranchId(branch_id || branch)
    const finalBranchName = branch || resolveBranchName(finalBranchId)

    // Resolve product ID and Name
    let resolvedProdId = product_id
    let resolvedProdName = productName
    if (!resolvedProdId && productName) {
      const [prods] = await query('SELECT `id`, `name` FROM `products` WHERE `name` = ? OR `id` = ? LIMIT 1', [productName, productName])
      if (prods) {
        resolvedProdId = prods.id
        resolvedProdName = prods.name
      }
    } else if (resolvedProdId && !resolvedProdName) {
      const [prods] = await query('SELECT `name` FROM `products` WHERE `id` = ? LIMIT 1', [resolvedProdId])
      if (prods) resolvedProdName = prods.name
    }

    resolvedProdId = resolvedProdId || 'PROD-001'
    resolvedProdName = resolvedProdName || 'BRG Product'

    const oldQty = parseInt(old_quantity || 0, 10)
    const newQty = parseInt(new_quantity || 0, 10)
    const difference = parseInt(data.difference !== undefined ? data.difference : (newQty - oldQty), 10)

    let id = data.id || data.adjNo
    if (!id || !id.startsWith('ADJ-')) {
      let attempts = 0
      while (attempts < 15) {
        const candidate = `ADJ-${Math.floor(100 + Math.random() * 900)}`
        const existing = await query('SELECT `id` FROM `stock_adjustments` WHERE `id` = ? LIMIT 1', [candidate])
        if (existing.length === 0) {
          id = candidate
          break
        }
        attempts++
      }
      if (!id) id = `ADJ-${Date.now().toString().slice(-6)}`
    }

    const status = data.status || 'Pending'
    const statusClass = status === 'Approved' ? 'bg-[#dcfce7] text-[#165A31]' : 'bg-[#fef3c7] text-[#b45309]'

    await query(
      `INSERT INTO \`stock_adjustments\` (
        \`id\`, \`adjustment_number\`, \`branch_id\`, \`branch\`, \`product_id\`, \`product_name\`,
        \`unit_id\`, \`adjustment_type\`, \`old_quantity\`, \`new_quantity\`, \`difference\`,
        \`reason\`, \`status\`, \`status_class\`, \`requested_by\`, \`approved_by\`, \`notes\`
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        \`new_quantity\` = VALUES(\`new_quantity\`),
        \`difference\` = VALUES(\`difference\`),
        \`reason\` = VALUES(\`reason\`),
        \`notes\` = VALUES(\`notes\`)`,
      [
        id, id, finalBranchId, finalBranchName, resolvedProdId, resolvedProdName,
        unit_id || null, adjustment_type, oldQty, newQty, difference,
        reason.trim(), status, statusClass, requested_by, data.approved_by || null, notes
      ]
    )

    return this.findAdjustmentById(id)
  },

  /**
   * Approve Stock Adjustment: Mutates inventory_stock inside an ACID transaction with FOR UPDATE lock
   */
  async approveAdjustment(id, approvedBy = 'Super Admin') {
    await withTransaction(async (conn) => {
      // 1. Lock adjustment record FOR UPDATE
      const [adjRows] = await conn.execute('SELECT * FROM `stock_adjustments` WHERE `id` = ? FOR UPDATE', [id])
      if (adjRows.length === 0) throw new Error(`Stock adjustment ${id} not found`)
      const adj = adjRows[0]

      if (adj.status === 'Approved') {
        throw new Error(`Stock adjustment ${id} is already approved`)
      }

      const diff = parseInt(adj.difference || 0, 10)
      const productId = adj.product_id
      const branchId = adj.branch_id
      const branchName = adj.branch

      // 2. If there is a quantity difference, apply to inventory_stock
      if (diff !== 0 && productId) {
        await this.ensureStockRow(conn, productId, branchId, branchName)

        const [stockRows] = await conn.execute(
          'SELECT * FROM `inventory_stock` WHERE `product_id` = ? AND `branch_id` = ? FOR UPDATE',
          [productId, branchId]
        )
        const stock = stockRows[0]
        const beforeOnHand = parseInt(stock.on_hand || 0, 10)
        const reserved = parseInt(stock.reserved || 0, 10)
        const afterOnHand = beforeOnHand + diff

        // Validate that on-hand quantity cannot fall below reserved quantity
        if (afterOnHand < reserved) {
          throw new Error(`Adjustment would reduce on-hand (${afterOnHand}) below reserved quantity (${reserved}) for product ${productId}`)
        }

        const afterAvailable = afterOnHand - reserved

        await conn.execute(
          'UPDATE `inventory_stock` SET `on_hand` = ?, `available` = ?, `updated_at` = NOW() WHERE `id` = ?',
          [afterOnHand, afterAvailable, stock.id]
        )

        // 3. Insert immutable ledger entry
        const movementNumber = `MOV-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`
        await conn.execute(
          `INSERT INTO \`stock_movements\` (
            \`movement_number\`, \`reference_type\`, \`reference_id\`, \`product_id\`, \`product_name\`,
            \`unit_id\`, \`branch_id\`, \`branch\`, \`quantity\`, \`on_hand_before\`, \`on_hand_after\`,
            \`user\`, \`reason\`, \`notes\`
          ) VALUES (?, 'ADJUSTMENT', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            movementNumber, adj.adjustment_number || adj.id, productId, adj.product_name,
            adj.unit_id || null, branchId, branchName, diff, beforeOnHand, afterOnHand,
            approvedBy, adj.reason, adj.notes || 'Approved stock adjustment'
          ]
        )
      }

      // 4. Update adjustment status
      await conn.execute(
        `UPDATE \`stock_adjustments\`
         SET \`status\` = 'Approved', \`status_class\` = 'bg-[#dcfce7] text-[#165A31]', \`approved_by\` = ?, \`updated_at\` = NOW()
         WHERE \`id\` = ?`,
        [approvedBy, id]
      )
    })

    return this.findAdjustmentById(id)
  },

  /**
   * Reject Stock Adjustment
   */
  async rejectAdjustment(id, rejectedBy = 'Super Admin', reason = 'Rejected') {
    const existing = await this.findAdjustmentById(id)
    if (!existing) throw new Error(`Stock adjustment ${id} not found`)

    await query(
      `UPDATE \`stock_adjustments\`
       SET \`status\` = 'Rejected', \`status_class\` = 'bg-red-50 text-red-700', \`notes\` = CONCAT(COALESCE(\`notes\`, ''), ' | Rejected: ', ?), \`updated_at\` = NOW()
       WHERE \`id\` = ?`,
      [reason, id]
    )

    return this.findAdjustmentById(id)
  },

  /**
   * Find all Inter-Branch Transfers with items
   */
  async findAllTransfers({ branch_id, status, search, limit = 100, offset = 0 } = {}) {
    let sql = 'SELECT * FROM \`stock_transfers\` WHERE 1=1'
    const params = []

    if (branch_id && branch_id !== 'ALL' && branch_id !== 'All Branches') {
      sql += ' AND (`from_branch_id` = ? OR `to_branch_id` = ? OR `from_branch` = ? OR `to_branch` = ?)'
      params.push(branch_id, branch_id, branch_id, branch_id)
    }

    if (status && status !== 'All') {
      sql += ' AND `status` = ?'
      params.push(status)
    }

    if (search && search.trim() !== '') {
      const term = `%${search.trim()}%`
      sql += ' AND (`transfer_number` LIKE ? OR `carrier` LIKE ? OR `from_branch` LIKE ? OR `to_branch` LIKE ?)'
      params.push(term, term, term, term)
    }

    sql += ' ORDER BY `created_at` DESC LIMIT ? OFFSET ?'
    params.push(Number(limit), Number(offset))

    const transfers = await query(sql, params)
    if (transfers.length === 0) return []

    const transferIds = transfers.map(t => t.id)
    const placeholders = transferIds.map(() => '?').join(', ')
    const items = await query(`SELECT * FROM \`stock_transfer_items\` WHERE \`transfer_id\` IN (${placeholders})`, transferIds)

    const itemsByTransfer = {}
    items.forEach(item => {
      if (!itemsByTransfer[item.transfer_id]) itemsByTransfer[item.transfer_id] = []
      itemsByTransfer[item.transfer_id].push(item)
    })

    return transfers.map(t => formatTransferRow(t, itemsByTransfer[t.id] || []))
  },

  /**
   * Find single transfer by ID with items
   */
  async findTransferById(id) {
    const rows = await query('SELECT * FROM `stock_transfers` WHERE `id` = ? OR `transfer_number` = ? LIMIT 1', [id, id])
    if (rows.length === 0) return null

    const t = rows[0]
    const items = await query('SELECT * FROM `stock_transfer_items` WHERE `transfer_id` = ?', [t.id])
    return formatTransferRow(t, items)
  },

  /**
   * Create Inter-Branch Transfer Request
   */
  async createTransfer(data) {
    const {
      from_branch_id,
      fromBranch_id,
      from_branch,
      from,
      to_branch_id,
      toBranch_id,
      to_branch,
      to,
      carrier = 'Internal Logistics',
      requestedBy = 'Branch Manager',
      notes = '',
      items = []
    } = data

    const fromId = resolveBranchId(from_branch_id || fromBranch_id || from_branch || from)
    const fromName = from || from_branch || resolveBranchName(fromId)
    const toId = resolveBranchId(to_branch_id || toBranch_id || to_branch || to)
    const toName = to || to_branch || resolveBranchName(toId)

    if (fromId === toId) {
      throw new Error('Source and destination branches cannot be the same for an inter-branch transfer.')
    }

    if (!items || items.length === 0) {
      throw new Error('At least one item is required for a stock transfer.')
    }

    let id = data.id || data.transfer_id
    if (!id || !id.startsWith('TR-')) {
      let attempts = 0
      while (attempts < 15) {
        const candidate = `TR-${Math.floor(100 + Math.random() * 900)}`
        const existing = await query('SELECT `id` FROM `stock_transfers` WHERE `id` = ? LIMIT 1', [candidate])
        if (existing.length === 0) {
          id = candidate
          break
        }
        attempts++
      }
      if (!id) id = `TR-${Date.now().toString().slice(-6)}`
    }

    const totalUnits = items.reduce((sum, item) => sum + parseInt(item.requestedQty || item.quantity || 1, 10), 0)

    await withTransaction(async (conn) => {
      await conn.execute(
        `INSERT INTO \`stock_transfers\` (
          \`id\`, \`transfer_number\`, \`from_branch_id\`, \`from_branch\`, \`to_branch_id\`, \`to_branch\`,
          \`total_units\`, \`carrier\`, \`status\`, \`status_class\`, \`requested_by\`, \`notes\`
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Pending', 'bg-[#fef3c7] text-[#b45309]', ?, ?)`,
        [id, id, fromId, fromName, toId, toName, totalUnits, carrier, requestedBy, notes]
      )

      for (const item of items) {
        const qty = parseInt(item.requestedQty || item.quantity || 1, 10)
        const unitIds = JSON.stringify(item.unit_ids || item.serials || [])
        await conn.execute(
          `INSERT INTO \`stock_transfer_items\` (
            \`transfer_id\`, \`product_id\`, \`product_name\`, \`sku\`, \`quantity\`,
            \`dispatched_qty\`, \`received_qty\`, \`unit_ids\`
          ) VALUES (?, ?, ?, ?, ?, 0, 0, ?)`,
          [id, item.product_id || 'PROD-001', item.product || item.product_name || 'Product', item.sku || null, qty, unitIds]
        )
      }
    })

    return this.findTransferById(id)
  },

  /**
   * Dispatch Transfer: Mutates origin branch stock inside ACID transaction with FOR UPDATE lock
   */
  async dispatchTransfer(id, { dispatchedBy = 'Dispatcher', carrier = null } = {}) {
    await withTransaction(async (conn) => {
      // 1. Lock transfer row
      const [transRows] = await conn.execute('SELECT * FROM `stock_transfers` WHERE `id` = ? FOR UPDATE', [id])
      if (transRows.length === 0) throw new Error(`Transfer ${id} not found`)
      const t = transRows[0]

      if (t.status === 'In Transit' || t.status === 'Received') {
        throw new Error(`Transfer ${id} has already been dispatched (current status: ${t.status})`)
      }

      const [items] = await conn.execute('SELECT * FROM `stock_transfer_items` WHERE `transfer_id` = ? FOR UPDATE', [t.id])

      // 2. For each item: deduct on_hand from source branch
      for (const item of items) {
        const qty = parseInt(item.quantity, 10)

        // Lock source stock row FOR UPDATE
        const [stockRows] = await conn.execute(
          'SELECT * FROM `inventory_stock` WHERE `product_id` = ? AND `branch_id` = ? FOR UPDATE',
          [item.product_id, t.from_branch_id]
        )
        if (stockRows.length === 0) {
          throw new Error(`Origin branch ${t.from_branch} has no stock record for ${item.product_name}`)
        }

        const stock = stockRows[0]
        const beforeOnHand = parseInt(stock.on_hand || 0, 10)
        const reserved = parseInt(stock.reserved || 0, 10)
        const available = beforeOnHand - reserved

        if (available < qty) {
          throw new Error(`Insufficient available stock at origin ${t.from_branch} to dispatch ${item.product_name}. Available: ${available}, Required: ${qty}`)
        }

        const afterOnHand = beforeOnHand - qty
        const afterAvailable = afterOnHand - reserved

        await conn.execute(
          'UPDATE `inventory_stock` SET `on_hand` = ?, `available` = ?, `updated_at` = NOW() WHERE `id` = ?',
          [afterOnHand, afterAvailable, stock.id]
        )

        // Update dispatched_qty on transfer item
        await conn.execute('UPDATE `stock_transfer_items` SET `dispatched_qty` = ? WHERE `id` = ?', [qty, item.id])

        // Insert immutable movement ledger row
        const movementNumber = `MOV-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`
        await conn.execute(
          `INSERT INTO \`stock_movements\` (
            \`movement_number\`, \`reference_type\`, \`reference_id\`, \`product_id\`, \`product_name\`,
            \`unit_id\`, \`branch_id\`, \`branch\`, \`quantity\`, \`on_hand_before\`, \`on_hand_after\`,
            \`user\`, \`reason\`, \`notes\`
          ) VALUES (?, 'TRANSFER_DISPATCH', ?, ?, ?, NULL, ?, ?, ?, ?, ?, ?, 'Inter-Branch Transfer Dispatch', ?)`,
          [
            movementNumber, t.transfer_number || t.id, item.product_id, item.product_name,
            t.from_branch_id, t.from_branch, -qty, beforeOnHand, afterOnHand,
            dispatchedBy, `Dispatched from ${t.from_branch} to ${t.to_branch} via ${carrier || t.carrier}`
          ]
        )

        // If serialized units are linked, transition them to 'Transfer In Transit'
        const unitIds = JSON.parse(item.unit_ids || '[]')
        for (const uid of unitIds) {
          await conn.execute(
            `UPDATE \`serialized_units\`
             SET \`status\` = 'Transfer In Transit', \`status_class\` = 'bg-blue-50 text-blue-700', \`location\` = 'Transfer In Transit', \`updated_at\` = NOW()
             WHERE \`unit_id\` = ? OR \`serial_number\` = ?`,
            [uid, uid]
          )
        }
      }

      // 3. Update transfer status
      await conn.execute(
        `UPDATE \`stock_transfers\`
         SET \`status\` = 'In Transit', \`status_class\` = 'bg-blue-50 text-blue-700',
             \`dispatched_by\` = ?, \`carrier\` = COALESCE(?, \`carrier\`),
             \`dispatched_at\` = NOW(), \`updated_at\` = NOW()
         WHERE \`id\` = ?`,
        [dispatchedBy, carrier, id]
      )
    })

    return this.findTransferById(id)
  },

  /**
   * Receive Transfer: Mutates destination branch stock inside ACID transaction with FOR UPDATE lock
   * Stock is 100% conserved across branches
   */
  async receiveTransfer(id, { receivedBy = 'Receiver', receivedItems = null, notes = '' } = {}) {
    await withTransaction(async (conn) => {
      // 1. Lock transfer row
      const [transRows] = await conn.execute('SELECT * FROM `stock_transfers` WHERE `id` = ? FOR UPDATE', [id])
      if (transRows.length === 0) throw new Error(`Transfer ${id} not found`)
      const t = transRows[0]

      if (t.status === 'Received') {
        throw new Error(`Transfer ${id} has already been received`)
      }

      const [items] = await conn.execute('SELECT * FROM `stock_transfer_items` WHERE `transfer_id` = ? FOR UPDATE', [t.id])

      // 2. For each item: add on_hand to destination branch
      for (const item of items) {
        const qtyToReceive = parseInt(item.dispatched_qty || item.quantity, 10)

        // Ensure stock row exists at destination
        await this.ensureStockRow(conn, item.product_id, t.to_branch_id, t.to_branch)

        // Lock destination stock row FOR UPDATE
        const [stockRows] = await conn.execute(
          'SELECT * FROM `inventory_stock` WHERE `product_id` = ? AND `branch_id` = ? FOR UPDATE',
          [item.product_id, t.to_branch_id]
        )
        const stock = stockRows[0]
        const beforeOnHand = parseInt(stock.on_hand || 0, 10)
        const reserved = parseInt(stock.reserved || 0, 10)
        const afterOnHand = beforeOnHand + qtyToReceive
        const afterAvailable = afterOnHand - reserved

        await conn.execute(
          'UPDATE `inventory_stock` SET `on_hand` = ?, `available` = ?, `updated_at` = NOW() WHERE `id` = ?',
          [afterOnHand, afterAvailable, stock.id]
        )

        // Update received_qty on transfer item
        await conn.execute('UPDATE `stock_transfer_items` SET `received_qty` = ? WHERE `id` = ?', [qtyToReceive, item.id])

        // Insert immutable movement ledger row
        const movementNumber = `MOV-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`
        await conn.execute(
          `INSERT INTO \`stock_movements\` (
            \`movement_number\`, \`reference_type\`, \`reference_id\`, \`product_id\`, \`product_name\`,
            \`unit_id\`, \`branch_id\`, \`branch\`, \`quantity\`, \`on_hand_before\`, \`on_hand_after\`,
            \`user\`, \`reason\`, \`notes\`
          ) VALUES (?, 'TRANSFER_RECEIVE', ?, ?, ?, NULL, ?, ?, ?, ?, ?, ?, 'Inter-Branch Transfer Receipt', ?)`,
          [
            movementNumber, t.transfer_number || t.id, item.product_id, item.product_name,
            t.to_branch_id, t.to_branch, qtyToReceive, beforeOnHand, afterOnHand,
            receivedBy, `Received at ${t.to_branch} from ${t.from_branch}`
          ]
        )

        // Update serialized units destination branch and status to 'Available'
        const unitIds = JSON.parse(item.unit_ids || '[]')
        for (const uid of unitIds) {
          await conn.execute(
            `UPDATE \`serialized_units\`
             SET \`branch_id\` = ?, \`branch\` = ?, \`status\` = 'Available',
                 \`status_class\` = 'bg-[#dcfce7] text-[#165A31]', \`location\` = 'Showroom Floor',
                 \`updated_at\` = NOW()
             WHERE \`unit_id\` = ? OR \`serial_number\` = ?`,
            [t.to_branch_id, t.to_branch, uid, uid]
          )
        }
      }

      // 3. Update transfer status to Received
      await conn.execute(
        `UPDATE \`stock_transfers\`
         SET \`status\` = 'Received', \`status_class\` = 'bg-[#dcfce7] text-[#165A31]',
             \`received_by\` = ?, \`received_at\` = NOW(),
             \`notes\` = CONCAT(COALESCE(\`notes\`, ''), ' | Received: ', ?), \`updated_at\` = NOW()
         WHERE \`id\` = ?`,
        [receivedBy, notes || 'Received in full', id]
      )
    })

    return this.findTransferById(id)
  },

  /**
   * Sales Order Integration: Reserve stock for order items (called during order creation/conversion)
   * Prevents negative available stock via FOR UPDATE row locking
   */
  async reserveStockForOrder(conn, orderId, orderNumber, items, branchId, branchName, user = 'System') {
    const finalBranchId = resolveBranchId(branchId)
    const finalBranchName = branchName || resolveBranchName(finalBranchId)

    for (const item of items) {
      const prodId = item.product_id || item.productId
      if (!prodId) continue

      const qty = parseInt(item.quantity || 1, 10)
      await this.ensureStockRow(conn, prodId, finalBranchId, finalBranchName)

      // Lock row FOR UPDATE
      const [stockRows] = await conn.execute(
        'SELECT * FROM `inventory_stock` WHERE `product_id` = ? AND `branch_id` = ? FOR UPDATE',
        [prodId, finalBranchId]
      )
      const stock = stockRows[0]
      const onHand = parseInt(stock.on_hand || 0, 10)
      const reserved = parseInt(stock.reserved || 0, 10)
      const available = onHand - reserved

      if (available < qty) {
        throw new Error(`Insufficient available stock for ${item.product || prodId} at ${finalBranchName}. Available: ${available}, Required: ${qty}`)
      }

      const newReserved = reserved + qty
      const newAvailable = onHand - newReserved

      await conn.execute(
        'UPDATE `inventory_stock` SET `reserved` = ?, `available` = ?, `updated_at` = NOW() WHERE `id` = ?',
        [newReserved, newAvailable, stock.id]
      )

      // Insert immutable movement entry
      const movementNumber = `MOV-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`
      await conn.execute(
        `INSERT INTO \`stock_movements\` (
          \`movement_number\`, \`reference_type\`, \`reference_id\`, \`product_id\`, \`product_name\`,
          \`unit_id\`, \`branch_id\`, \`branch\`, \`quantity\`, \`on_hand_before\`, \`on_hand_after\`,
          \`user\`, \`reason\`, \`notes\`
        ) VALUES (?, 'SALE_RESERVATION', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Sales Order Stock Reservation', ?)`,
        [
          movementNumber, orderNumber || orderId, prodId, item.product || prodId,
          item.unit_id || null, finalBranchId, finalBranchName, qty, onHand, onHand,
          user, `Stock reserved for order ${orderNumber || orderId}`
        ]
      )
    }
  },

  /**
   * Sales Order Integration: Release reserved stock upon order cancellation
   */
  async releaseStockForOrder(conn, orderId, orderNumber, branchId, branchName, user = 'System') {
    const finalBranchId = resolveBranchId(branchId)
    const finalBranchName = branchName || resolveBranchName(finalBranchId)

    // Retrieve order items
    const [items] = await conn.execute('SELECT * FROM `order_items` WHERE `order_id` = ?', [orderId])

    for (const item of items) {
      const prodId = item.product_id
      if (!prodId) continue

      const qty = parseInt(item.quantity || 1, 10)

      const [stockRows] = await conn.execute(
        'SELECT * FROM `inventory_stock` WHERE `product_id` = ? AND `branch_id` = ? FOR UPDATE',
        [prodId, finalBranchId]
      )
      if (stockRows.length === 0) continue

      const stock = stockRows[0]
      const onHand = parseInt(stock.on_hand || 0, 10)
      const reserved = parseInt(stock.reserved || 0, 10)
      const newReserved = Math.max(0, reserved - qty)
      const newAvailable = Math.max(0, onHand - newReserved)

      await conn.execute(
        'UPDATE `inventory_stock` SET `reserved` = ?, `available` = ?, `updated_at` = NOW() WHERE `id` = ?',
        [newReserved, newAvailable, stock.id]
      )

      // Insert immutable movement entry
      const movementNumber = `MOV-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`
      await conn.execute(
        `INSERT INTO \`stock_movements\` (
          \`movement_number\`, \`reference_type\`, \`reference_id\`, \`product_id\`, \`product_name\`,
          \`unit_id\`, \`branch_id\`, \`branch\`, \`quantity\`, \`on_hand_before\`, \`on_hand_after\`,
          \`user\`, \`reason\`, \`notes\`
        ) VALUES (?, 'SALE_RELEASE', ?, ?, ?, NULL, ?, ?, ?, ?, ?, ?, 'Sales Order Stock Release', ?)`,
        [
          movementNumber, orderNumber || orderId, prodId, item.product,
          finalBranchId, finalBranchName, -qty, onHand, onHand,
          user, `Stock reservation released due to cancellation of order ${orderNumber || orderId}`
        ]
      )
    }
  },

  /**
   * Serialized Units: Find all units
   */
  async findAllUnits({ branch_id, status, product_id, search, limit = 100, offset = 0 } = {}) {
    let sql = 'SELECT * FROM `serialized_units` WHERE 1=1'
    const params = []

    if (branch_id && branch_id !== 'ALL' && branch_id !== 'All Branches') {
      sql += ' AND (`branch_id` = ? OR `branch` = ?)'
      params.push(branch_id, branch_id)
    }

    if (status && status !== 'All') {
      sql += ' AND `status` = ?'
      params.push(status)
    }

    if (product_id) {
      sql += ' AND `product_id` = ?'
      params.push(product_id)
    }

    if (search && search.trim() !== '') {
      const term = `%${search.trim()}%`
      sql += ' AND (`unit_id` LIKE ? OR `serial_number` LIKE ? OR `vin` LIKE ? OR `product_name` LIKE ?)'
      params.push(term, term, term, term)
    }

    sql += ' ORDER BY `created_at` DESC LIMIT ? OFFSET ?'
    params.push(Number(limit), Number(offset))

    const rows = await query(sql, params)
    return rows.map(formatUnitRow)
  },

  /**
   * Serialized Units: Find unit by ID
   */
  async findUnitById(id) {
    const rows = await query('SELECT * FROM `serialized_units` WHERE `id` = ? OR `unit_id` = ? OR `serial_number` = ? LIMIT 1', [id, id, id])
    return rows.length > 0 ? formatUnitRow(rows[0]) : null
  },

  /**
   * Serialized Units: Transition status
   */
  async transitionUnitStatus(id, newStatus, meta = {}) {
    const existing = await this.findUnitById(id)
    if (!existing) throw new Error(`Unit ${id} not found`)

    const statusClass = newStatus === 'Available'
      ? 'bg-[#dcfce7] text-[#165A31]'
      : (newStatus === 'QC Hold' ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-700')

    await query(
      'UPDATE `serialized_units` SET `status` = ?, `status_class` = ?, `location` = COALESCE(?, `location`), `updated_at` = NOW() WHERE `id` = ?',
      [newStatus, statusClass, meta.location || null, existing.id]
    )

    return this.findUnitById(existing.id)
  },

  /**
   * Serialized Units: Reserve unit for order
   */
  async reserveUnit(id, orderId) {
    const existing = await this.findUnitById(id)
    if (!existing) throw new Error(`Unit ${id} not found`)

    await query(
      `UPDATE \`serialized_units\`
       SET \`status\` = 'Reserved', \`status_class\` = 'bg-blue-50 text-blue-700', \`order_id\` = ?, \`updated_at\` = NOW()
       WHERE \`id\` = ?`,
      [orderId, existing.id]
    )

    return this.findUnitById(existing.id)
  },

  /**
   * Serialized Units: Release unit reservation
   */
  async releaseUnitReservation(id) {
    const existing = await this.findUnitById(id)
    if (!existing) throw new Error(`Unit ${id} not found`)

    await query(
      `UPDATE \`serialized_units\`
       SET \`status\` = 'Available', \`status_class\` = 'bg-[#dcfce7] text-[#165A31]', \`order_id\` = NULL, \`updated_at\` = NOW()
       WHERE \`id\` = ?`,
      [existing.id]
    )

    return this.findUnitById(existing.id)
  },

  /**
   * Movement Ledger: Append-only query with KPI totals
   */
  async getMovementLedger({ branch_id, product_id, reference_type, search, limit = 100, offset = 0 } = {}) {
    let sql = 'SELECT * FROM `stock_movements` WHERE 1=1'
    const params = []

    if (branch_id && branch_id !== 'ALL' && branch_id !== 'All Branches') {
      sql += ' AND (`branch_id` = ? OR `branch` = ?)'
      params.push(branch_id, branch_id)
    }

    if (product_id) {
      sql += ' AND `product_id` = ?'
      params.push(product_id)
    }

    if (reference_type && reference_type !== 'All' && reference_type !== 'All Types') {
      sql += ' AND `reference_type` = ?'
      params.push(reference_type)
    }

    if (search && search.trim() !== '') {
      const term = `%${search.trim()}%`
      sql += ' AND (`movement_number` LIKE ? OR `product_name` LIKE ? OR `reference_id` LIKE ? OR `user` LIKE ?)'
      params.push(term, term, term, term)
    }

    sql += ' ORDER BY `created_at` DESC LIMIT ? OFFSET ?'
    params.push(Number(limit), Number(offset))

    const rows = await query(sql, params)
    const movements = rows.map(formatMovementRow)

    // Compute KPIs
    const todayStr = new Date().toISOString().split('T')[0]
    let todayCount = 0
    let receiptCount = 0
    let salesCount = 0
    let transferCount = 0

    movements.forEach(m => {
      if (m.createdAt.startsWith(todayStr)) todayCount++
      if (m.movement === 'RECEIPT') receiptCount++
      if (m.movement.includes('SALE')) salesCount++
      if (m.movement.includes('TRANSFER')) transferCount++
    })

    return {
      movements,
      kpis: {
        today: `${todayCount} movements`,
        receipts: String(receiptCount),
        sales: String(salesCount),
        transfers: String(transferCount)
      }
    }
  }
}
