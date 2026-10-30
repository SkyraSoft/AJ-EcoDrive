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
 * Formats a supplier row into frontend-compatible format
 */
export function formatSupplierRow(row) {
  if (!row) return null
  return {
    id: row.id,
    supplier_id: row.id,
    code: row.code || row.id,
    name: row.name,
    contact: row.contact || '',
    phone: row.phone || '',
    email: row.email || '',
    address: row.address || '',
    city: row.city || '',
    country: row.country || 'Pakistan',
    tax_id: row.tax_id || '',
    taxId: row.tax_id || '',
    terms: row.terms || 'Net 30',
    currency: row.currency || 'PKR',
    status: row.status || 'Active',
    statusClass: row.status_class || (row.status === 'Active' ? 'bg-[#dcfce7] text-[#165A31]' : 'bg-gray-100 text-gray-700'),
    onTime: row.on_time || '100%',
    notes: row.notes || '',
    products: row.product_count !== undefined ? String(row.product_count) : '—',
    openPos: row.open_pos !== undefined ? String(row.open_pos) : '0',
    purchases: row.total_purchases !== undefined ? `PKR ${(parseFloat(row.total_purchases) / 1000000).toFixed(1)}M` : 'PKR 0.0M',
    payable: row.total_payable !== undefined ? `PKR ${(parseFloat(row.total_payable) / 1000000).toFixed(1)}M` : 'PKR 0.0M',
    totalPurchasesAmount: parseFloat(row.total_purchases || 0),
    totalPayableAmount: parseFloat(row.total_payable || 0),
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
    updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : new Date().toISOString()
  }
}

/**
 * Formats a purchase order line item
 */
export function formatPoItem(item) {
  if (!item) return null
  const ordered = parseInt(item.ordered_quantity || 0, 10)
  const received = parseInt(item.received_quantity || 0, 10)
  const cost = parseFloat(item.unit_cost || 0)
  const subtotal = parseFloat(item.subtotal || ordered * cost)

  return {
    id: item.id,
    product_id: item.product_id,
    productId: item.product_id,
    product: item.product,
    product_name: item.product,
    sku: item.sku || '',
    ordered_quantity: ordered,
    ordered: ordered,
    received_quantity: received,
    received: received,
    previouslyReceived: received,
    remaining: Math.max(0, ordered - received),
    unit_cost: cost,
    cost: `PKR ${cost.toLocaleString()}`,
    subtotal: `PKR ${subtotal.toLocaleString()}`,
    subtotalAmount: subtotal,
    is_serialized: Boolean(item.is_serialized),
    isSerialized: Boolean(item.is_serialized)
  }
}

/**
 * Formats a purchase order row into frontend-compatible format
 */
export function formatPurchaseOrderRow(row, items = [], receipts = [], bills = []) {
  if (!row) return null
  const totalOrdered = parseInt(row.total_ordered || 0, 10)
  const totalReceived = parseInt(row.total_received || 0, 10)
  const remainingUnits = parseInt(row.remaining_units !== undefined ? row.remaining_units : Math.max(0, totalOrdered - totalReceived), 10)
  const subtotal = parseFloat(row.subtotal || 0)
  const tax = parseFloat(row.tax || 0)
  const amount = parseFloat(row.amount || subtotal + tax)

  const orderDateStr = row.order_date ? (row.order_date instanceof Date ? row.order_date.toISOString().split('T')[0] : String(row.order_date).split('T')[0]) : ''
  const expectedDateStr = row.expected_date ? (row.expected_date instanceof Date ? row.expected_date.toISOString().split('T')[0] : String(row.expected_date).split('T')[0]) : ''

  // Format short display date for expected
  let shortExpected = ''
  if (expectedDateStr) {
    const d = new Date(expectedDateStr)
    if (!isNaN(d.getTime())) {
      shortExpected = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
  }

  // Derive status badge
  let statusClass = row.status_class
  if (!statusClass) {
    switch (row.status) {
      case 'Fully Received':
      case 'Approved':
        statusClass = 'bg-[#dcfce7] text-[#165A31]'
        break
      case 'In Transit':
      case 'Sent':
        statusClass = 'bg-blue-50 text-blue-700'
        break
      case 'Partially Received':
        statusClass = 'bg-orange-50 text-orange-700'
        break
      case 'Pending Approval':
        statusClass = 'bg-amber-50 text-amber-700'
        break
      case 'Cancelled':
        statusClass = 'bg-red-50 text-red-700'
        break
      default:
        statusClass = 'bg-gray-100 text-gray-700'
    }
  }

  const matchStatus = row.match_status || (totalReceived > 0 ? `${totalReceived}/${totalOrdered}` : '—')

  let action = 'Open'
  if (row.status === 'In Transit' || row.status === 'Approved' || row.status === 'Partially Received') {
    action = 'Open · Receive'
  } else if (row.status === 'Pending Approval') {
    action = 'Open · Approve'
  }

  return {
    id: row.id,
    po: row.po_number || row.id,
    po_id: row.id,
    po_number: row.po_number || row.id,
    supplier_id: row.supplier_id,
    supplier: row.supplier,
    branch_id: row.branch_id || 'BR-01',
    branch: row.branch || 'Peshawar',
    destination: row.destination || row.branch || 'Peshawar',
    units: String(totalOrdered),
    totalOrdered,
    totalReceived,
    remainingUnits,
    subtotal,
    tax,
    amount: `PKR ${amount.toLocaleString()}`,
    totalAmount: amount,
    orderDate: orderDateStr,
    order_date: orderDateStr,
    expected: shortExpected || expectedDateStr,
    expectedDate: expectedDateStr,
    expected_date: expectedDateStr,
    carrier: row.carrier || '',
    tracking: row.tracking || '',
    status: row.status || 'Draft',
    statusClass,
    match: matchStatus,
    match_status: matchStatus,
    action,
    requested_by: row.requested_by || '',
    approved_by: row.approved_by || '',
    approved_at: row.approved_at,
    cancelled_by: row.cancelled_by || '',
    cancelled_at: row.cancelled_at,
    cancellation_reason: row.cancellation_reason || '',
    notes: row.notes || '',
    items: items.map(formatPoItem),
    receipts: receipts || [],
    bills: bills || [],
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
    updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : new Date().toISOString()
  }
}

/**
 * Formats a GRN Goods Receipt line item
 */
export function formatReceiptItem(item) {
  if (!item) return null
  const ordered = parseInt(item.ordered_quantity || 0, 10)
  const prev = parseInt(item.previously_received_quantity || 0, 10)
  const currentRec = parseInt(item.current_received_quantity || 0, 10)
  const accepted = parseInt(item.accepted_quantity || 0, 10)
  const damaged = parseInt(item.damaged_quantity || 0, 10)
  const shortQty = parseInt(item.short_quantity || 0, 10)
  const excessQty = parseInt(item.excess_quantity || 0, 10)

  return {
    id: item.id,
    receipt_id: item.receipt_id,
    product_id: item.product_id,
    product: item.product,
    sku: item.sku || '',
    ordered_quantity: ordered,
    ordered: ordered,
    previously_received_quantity: prev,
    previouslyReceived: prev,
    current_received_quantity: currentRec,
    currentReceived: currentRec,
    accepted_quantity: accepted,
    accepted: accepted,
    damaged_quantity: damaged,
    damaged: damaged,
    short_quantity: shortQty,
    excess_quantity: excessQty,
    discrepancy_reason: item.discrepancy_reason || '',
    unit_cost: parseFloat(item.unit_cost || 0),
    status: shortQty === 0 && excessQty === 0 && damaged === 0 ? 'Complete' : (damaged > 0 ? 'QC Hold' : (shortQty > 0 ? 'Short' : 'Excess'))
  }
}

/**
 * Formats a Goods Receipt (GRN) row
 */
export function formatReceiptRow(row, lines = []) {
  if (!row) return null
  const receiptDateStr = row.receipt_date ? (row.receipt_date instanceof Date ? row.receipt_date.toISOString().split('T')[0] : String(row.receipt_date).split('T')[0]) : ''

  return {
    id: row.id,
    receipt_id: row.id,
    receipt_number: row.receipt_number || row.id,
    po_id: row.po_id,
    po_number: row.po_number,
    po: row.po_number,
    supplier_id: row.supplier_id,
    supplier: row.supplier,
    branch_id: row.branch_id || 'BR-01',
    branch: row.branch || 'Peshawar',
    delivery_note: row.delivery_note || '',
    receipt_date: receiptDateStr,
    received_by: row.received_by || '',
    receiver: row.received_by || '',
    location: row.location || 'Showroom Floor',
    total_received_units: parseInt(row.total_received_units || 0, 10),
    total_accepted_units: parseInt(row.total_accepted_units || 0, 10),
    total_damaged_units: parseInt(row.total_damaged_units || 0, 10),
    status: row.status || 'Posted',
    notes: row.notes || '',
    lines: lines.map(formatReceiptItem),
    items: lines.map(formatReceiptItem),
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
    updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : new Date().toISOString()
  }
}

/**
 * Formats a Vendor Bill row
 */
export function formatVendorBillRow(row) {
  if (!row) return null
  const amount = parseFloat(row.amount || 0)
  const paid = parseFloat(row.paid_amount || 0)
  const outstanding = parseFloat(row.outstanding_amount !== undefined ? row.outstanding_amount : Math.max(0, amount - paid))
  const dueDateStr = row.due_date ? (row.due_date instanceof Date ? row.due_date.toISOString().split('T')[0] : String(row.due_date).split('T')[0]) : ''

  return {
    id: row.id,
    bill_number: row.bill_number || row.id,
    po_id: row.po_id,
    po_number: row.po_number,
    receipt_id: row.receipt_id,
    supplier_id: row.supplier_id,
    supplier: row.supplier,
    branch_id: row.branch_id || 'BR-01',
    branch: row.branch || 'Peshawar',
    amount,
    paid_amount: paid,
    outstanding_amount: outstanding,
    due_date: dueDateStr,
    status: row.status || 'Open',
    statusClass: row.status_class || (row.status === 'Paid' ? 'bg-[#dcfce7] text-[#165A31]' : 'bg-[#eff6ff] text-[#2563eb]'),
    match_status: row.match_status || 'Matched',
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
    updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : new Date().toISOString()
  }
}

/**
 * Formats a Purchase Return Line Item
 */
export function formatPurchaseReturnItem(item) {
  if (!item) return null
  const qty = parseInt(item.quantity || 0, 10)
  const unitCost = parseFloat(item.unit_cost || 0)
  const subtotal = parseFloat(item.subtotal || (qty * unitCost))

  return {
    id: item.id,
    return_id: item.return_id,
    product_id: item.product_id,
    product: item.product,
    sku: item.sku || '',
    unit_id: item.unit_id || null,
    serial_number: item.serial_number || item.unit_id || '',
    serial: item.serial_number || item.unit_id || '',
    quantity: qty,
    units: qty,
    unit_cost: unitCost,
    unitCost,
    subtotal,
    credit: subtotal,
    condition: item.condition || 'Defective',
    is_from_qc_hold: Boolean(item.is_from_qc_hold)
  }
}

/**
 * Formats a Vendor Debit Note row
 */
export function formatVendorDebitNoteRow(row) {
  if (!row) return null
  const amount = parseFloat(row.amount || 0)
  const applied = parseFloat(row.applied_amount || 0)
  const remaining = parseFloat(row.remaining_credit !== undefined ? row.remaining_credit : Math.max(0, amount - applied))

  return {
    id: row.id,
    debit_note_number: row.debit_note_number || row.id,
    return_id: row.return_id,
    return_number: row.return_number,
    supplier_id: row.supplier_id,
    supplier: row.supplier,
    vendor_bill_id: row.vendor_bill_id || null,
    branch_id: row.branch_id || 'BR-01',
    branch: row.branch || 'Peshawar',
    amount,
    applied_amount: applied,
    remaining_credit: remaining,
    status: row.status || 'Applied',
    statusClass: row.status_class || 'bg-[#eff6ff] text-[#2563eb]',
    notes: row.notes || '',
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
    updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : new Date().toISOString()
  }
}

/**
 * Formats a Purchase Return row with items and debit notes
 */
export function formatPurchaseReturnRow(row, lines = [], debitNotes = []) {
  if (!row) return null
  const totalUnits = parseInt(row.total_units || 0, 10)
  const totalCredit = parseFloat(row.total_credit_amount || 0)
  const formattedCredit = totalCredit >= 1000 ? `${(totalCredit / 1000).toFixed(0)}K` : totalCredit.toLocaleString()

  return {
    id: row.id,
    return_id: row.id,
    return_number: row.return_number || row.id,
    returnNo: row.return_number || row.id,
    supplier_id: row.supplier_id,
    supplier: row.supplier,
    po_id: row.po_id || '',
    po_number: row.po_number || row.po_id || '',
    po: row.po_number || row.po_id || '',
    receipt_id: row.receipt_id || '',
    receipt_number: row.receipt_number || row.receipt_id || '',
    branch_id: row.branch_id || 'BR-01',
    branch: row.branch || 'Peshawar',
    total_units: totalUnits,
    units: String(totalUnits),
    total_credit_amount: totalCredit,
    credit: formattedCredit,
    creditFormatted: `PKR ${totalCredit.toLocaleString()}`,
    reason: row.reason || '',
    status: row.status || 'Draft',
    statusClass: row.status_class || 'bg-gray-100 text-gray-700',
    created_by: row.created_by || '',
    approved_by: row.approved_by || '',
    notes: row.notes || '',
    lines: lines.map(formatPurchaseReturnItem),
    items: lines.map(formatPurchaseReturnItem),
    debit_notes: debitNotes.map(formatVendorDebitNoteRow),
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
    updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : new Date().toISOString()
  }
}

export const ProcurementModel = {
  // =========================================================================
  // SUPPLIERS & VENDORS
  // =========================================================================

  /**
   * Retrieve all suppliers with optional search and status filtering
   */
  async findAllSuppliers({ search, status, branch_id } = {}) {
    let sql = `
      SELECT 
        s.*,
        (SELECT COUNT(*) FROM \`purchase_orders\` po WHERE po.supplier_id = s.id AND po.status NOT IN ('Fully Received', 'Cancelled')) AS open_pos,
        (SELECT COALESCE(SUM(po.amount), 0) FROM \`purchase_orders\` po WHERE po.supplier_id = s.id AND po.status != 'Cancelled') AS total_purchases,
        (SELECT COALESCE(SUM(vb.outstanding_amount), 0) FROM \`vendor_bills\` vb WHERE vb.supplier_id = s.id AND vb.status != 'Paid') AS total_payable
      FROM \`suppliers\` s
      WHERE 1=1
    `
    const params = []

    if (status && status !== 'All Statuses' && status !== 'all') {
      sql += ' AND s.status = ?'
      params.push(status)
    }

    if (search && search.trim()) {
      const q = `%${search.trim()}%`
      sql += ' AND (s.name LIKE ? OR s.code LIKE ? OR s.contact LIKE ? OR s.email LIKE ? OR s.phone LIKE ? OR s.city LIKE ?)'
      params.push(q, q, q, q, q, q)
    }

    sql += ' ORDER BY s.name ASC'

    const rows = await query(sql, params)
    return rows.map(formatSupplierRow)
  },

  /**
   * Retrieve a single supplier by ID with aggregate metrics and recent purchase orders
   */
  async findSupplierById(id) {
    const rows = await query(
      `SELECT 
        s.*,
        (SELECT COUNT(*) FROM \`purchase_orders\` po WHERE po.supplier_id = s.id AND po.status NOT IN ('Fully Received', 'Cancelled')) AS open_pos,
        (SELECT COALESCE(SUM(po.amount), 0) FROM \`purchase_orders\` po WHERE po.supplier_id = s.id AND po.status != 'Cancelled') AS total_purchases,
        (SELECT COALESCE(SUM(vb.outstanding_amount), 0) FROM \`vendor_bills\` vb WHERE vb.supplier_id = s.id AND vb.status != 'Paid') AS total_payable
      FROM \`suppliers\` s
      WHERE s.id = ? OR s.code = ?
      LIMIT 1`,
      [id, id]
    )

    if (!rows || rows.length === 0) return null

    const supplier = formatSupplierRow(rows[0])

    // Fetch supplier's purchase orders
    const poRows = await query(
      'SELECT * FROM `purchase_orders` WHERE `supplier_id` = ? ORDER BY `created_at` DESC LIMIT 10',
      [supplier.id]
    )
    supplier.recentOrders = poRows.map(row => formatPurchaseOrderRow(row))

    return supplier
  },

  /**
   * Create a new supplier with duplicate checks and validation
   */
  async createSupplier(data) {
    if (!data.name || !String(data.name).trim()) {
      const err = new Error('Supplier name is required')
      err.statusCode = 422
      throw err
    }
    if (!data.contact || !String(data.contact).trim()) {
      const err = new Error('Contact person is required')
      err.statusCode = 422
      throw err
    }
    if (!data.phone || !String(data.phone).trim()) {
      const err = new Error('Phone number is required')
      err.statusCode = 422
      throw err
    }

    const trimmedName = String(data.name).trim()
    let code = data.code ? String(data.code).trim().toUpperCase() : null

    // Generate code if not provided
    if (!code) {
      const countRows = await query('SELECT COUNT(*) as cnt FROM `suppliers`')
      const nextNum = (countRows[0]?.cnt || 0) + 1
      code = `SUP-${String(nextNum).padStart(2, '0')}`
    }

    const id = data.id || code

    // Check duplicate code or name (case-insensitive)
    const existing = await query(
      'SELECT id, code, name FROM `suppliers` WHERE LOWER(name) = LOWER(?) OR LOWER(code) = LOWER(?) LIMIT 1',
      [trimmedName, code]
    )

    if (existing.length > 0) {
      const match = existing[0]
      const duplicateField = match.name.toLowerCase() === trimmedName.toLowerCase() ? 'name' : 'code'
      const err = new Error(`Supplier with ${duplicateField} "${duplicateField === 'name' ? trimmedName : code}" already exists`)
      err.statusCode = 409
      throw err
    }

    const status = data.status || 'Active'
    const statusClass = status === 'Active' ? 'bg-[#dcfce7] text-[#165A31]' : 'bg-gray-100 text-gray-700'

    await query(
      `INSERT INTO \`suppliers\` (
        \`id\`, \`code\`, \`name\`, \`contact\`, \`phone\`, \`email\`, \`address\`, \`city\`, \`country\`,
        \`tax_id\`, \`terms\`, \`currency\`, \`status\`, \`status_class\`, \`on_time\`, \`notes\`
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        code,
        trimmedName,
        data.contact.trim(),
        data.phone.trim(),
        data.email ? data.email.trim() : null,
        data.address ? data.address.trim() : null,
        data.city ? data.city.trim() : null,
        data.country || 'Pakistan',
        data.tax_id || data.taxId || null,
        data.terms || 'Net 30',
        data.currency || 'PKR',
        status,
        statusClass,
        data.on_time || data.onTime || '100%',
        data.notes || null
      ]
    )

    return await this.findSupplierById(id)
  },

  /**
   * Update an existing supplier
   */
  async updateSupplier(id, data) {
    const existing = await query('SELECT * FROM `suppliers` WHERE id = ?', [id])
    if (existing.length === 0) {
      const err = new Error(`Supplier ${id} not found`)
      err.statusCode = 404
      throw err
    }

    const current = existing[0]
    const updatedName = data.name !== undefined ? String(data.name).trim() : current.name
    const updatedCode = data.code !== undefined ? String(data.code).trim().toUpperCase() : current.code

    // Duplicate check excluding self
    const duplicate = await query(
      'SELECT id FROM `suppliers` WHERE (LOWER(name) = LOWER(?) OR LOWER(code) = LOWER(?)) AND id != ? LIMIT 1',
      [updatedName, updatedCode, id]
    )

    if (duplicate.length > 0) {
      const err = new Error(`Another supplier with name "${updatedName}" or code "${updatedCode}" already exists`)
      err.statusCode = 409
      throw err
    }

    const status = data.status || current.status
    const statusClass = status === 'Active' ? 'bg-[#dcfce7] text-[#165A31]' : 'bg-gray-100 text-gray-700'

    await query(
      `UPDATE \`suppliers\` SET
        \`code\` = ?, \`name\` = ?, \`contact\` = ?, \`phone\` = ?, \`email\` = ?,
        \`address\` = ?, \`city\` = ?, \`country\` = ?, \`tax_id\` = ?, \`terms\` = ?,
        \`currency\` = ?, \`status\` = ?, \`status_class\` = ?, \`on_time\` = ?,
        \`notes\` = ?, \`updated_at\` = NOW()
      WHERE id = ?`,
      [
        updatedCode,
        updatedName,
        data.contact !== undefined ? data.contact : current.contact,
        data.phone !== undefined ? data.phone : current.phone,
        data.email !== undefined ? data.email : current.email,
        data.address !== undefined ? data.address : current.address,
        data.city !== undefined ? data.city : current.city,
        data.country !== undefined ? data.country : current.country,
        data.tax_id !== undefined ? data.tax_id : (data.taxId !== undefined ? data.taxId : current.tax_id),
        data.terms !== undefined ? data.terms : current.terms,
        data.currency !== undefined ? data.currency : current.currency,
        status,
        statusClass,
        data.on_time !== undefined ? data.on_time : (data.onTime !== undefined ? data.onTime : current.on_time),
        data.notes !== undefined ? data.notes : current.notes,
        id
      ]
    )

    return await this.findSupplierById(id)
  },

  /**
   * Delete a supplier (reject if linked purchase orders exist)
   */
  async deleteSupplier(id) {
    const poCountRows = await query('SELECT COUNT(*) as cnt FROM `purchase_orders` WHERE supplier_id = ?', [id])
    if (poCountRows[0]?.cnt > 0) {
      const err = new Error(`Cannot delete supplier: ${poCountRows[0].cnt} purchase order(s) are linked to this supplier. Deactivate instead.`)
      err.statusCode = 400
      throw err
    }

    const res = await query('DELETE FROM `suppliers` WHERE id = ?', [id])
    if (res.affectedRows === 0) {
      const err = new Error(`Supplier ${id} not found`)
      err.statusCode = 404
      throw err
    }

    return { success: true, message: `Supplier ${id} successfully deleted` }
  },

  // =========================================================================
  // PURCHASE ORDERS
  // =========================================================================

  /**
   * Retrieve all purchase orders with optional filtering
   */
  async findAllPurchaseOrders({ search, status, branch_id, supplier_id } = {}) {
    let sql = 'SELECT po.* FROM `purchase_orders` po WHERE 1=1'
    const params = []

    if (status && status !== 'All Statuses' && status !== 'all') {
      sql += ' AND po.status = ?'
      params.push(status)
    }

    if (branch_id && branch_id !== 'all' && branch_id !== 'BR-01' && branch_id !== 'HQ') {
      sql += ' AND po.branch_id = ?'
      params.push(branch_id)
    }

    if (supplier_id) {
      sql += ' AND po.supplier_id = ?'
      params.push(supplier_id)
    }

    if (search && search.trim()) {
      const q = `%${search.trim()}%`
      sql += ' AND (po.po_number LIKE ? OR po.supplier LIKE ? OR po.destination LIKE ? OR po.carrier LIKE ? OR po.tracking LIKE ?)'
      params.push(q, q, q, q, q)
    }

    sql += ' ORDER BY po.created_at DESC'

    const rows = await query(sql, params)
    if (rows.length === 0) return []

    // Fetch line items for these POs
    const poIds = rows.map(r => r.id)
    const placeholders = poIds.map(() => '?').join(',')
    const itemRows = await query(
      `SELECT * FROM \`purchase_order_items\` WHERE \`po_id\` IN (${placeholders}) ORDER BY \`id\` ASC`,
      poIds
    )

    const itemsByPo = {}
    itemRows.forEach(item => {
      if (!itemsByPo[item.po_id]) itemsByPo[item.po_id] = []
      itemsByPo[item.po_id].push(item)
    })

    return rows.map(r => formatPurchaseOrderRow(r, itemsByPo[r.id] || []))
  },

  /**
   * Retrieve single purchase order by ID or PO Number with line items, receipts, and bills
   */
  async findPurchaseOrderById(id) {
    const rows = await query(
      'SELECT * FROM `purchase_orders` WHERE id = ? OR po_number = ? LIMIT 1',
      [id, id]
    )
    if (!rows || rows.length === 0) return null

    const po = rows[0]
    const itemRows = await query('SELECT * FROM `purchase_order_items` WHERE `po_id` = ? ORDER BY `id` ASC', [po.id])
    const receiptRows = await query('SELECT * FROM `goods_receipts` WHERE `po_id` = ? ORDER BY `receipt_date` DESC', [po.id])
    const billRows = await query('SELECT * FROM `vendor_bills` WHERE `po_id` = ? ORDER BY `due_date` ASC', [po.id])

    // Load receipt line items for each receipt
    const formattedReceipts = []
    for (const r of receiptRows) {
      const rLines = await query('SELECT * FROM `goods_receipt_items` WHERE `receipt_id` = ?', [r.id])
      formattedReceipts.push(formatReceiptRow(r, rLines))
    }

    return formatPurchaseOrderRow(
      po,
      itemRows,
      formattedReceipts,
      billRows.map(formatVendorBillRow)
    )
  },

  /**
   * Create a new purchase order with validated items and server-side totals calculation
   */
  async createPurchaseOrder(data) {
    if (!data.supplier_id) {
      const err = new Error('Supplier is required for purchase order')
      err.statusCode = 422
      throw err
    }

    const items = data.items || data.lines || []
    if (!Array.isArray(items) || items.length === 0) {
      const err = new Error('Purchase order must contain at least one line item')
      err.statusCode = 422
      throw err
    }

    // Resolve supplier
    const supRows = await query('SELECT id, name FROM `suppliers` WHERE id = ? OR code = ? LIMIT 1', [data.supplier_id, data.supplier_id])
    if (supRows.length === 0) {
      const err = new Error(`Supplier ${data.supplier_id} not found`)
      err.statusCode = 404
      throw err
    }
    const supplier = supRows[0]

    // Resolve branch
    const branchId = data.branch_id || resolveBranchId(data.destination || data.branch || 'Peshawar')
    const branchName = resolveBranchName(branchId, data.destination || data.branch || 'Peshawar')
    const destination = data.destination || branchName

    // Validate and calculate totals
    let totalOrdered = 0
    let subtotal = 0

    const processedItems = []
    for (const item of items) {
      const orderedQty = parseInt(item.ordered_quantity ?? item.ordered ?? item.quantity ?? 0, 10)
      if (isNaN(orderedQty) || orderedQty <= 0) {
        const err = new Error(`Item "${item.product || item.product_id}" ordered quantity must be greater than 0`)
        err.statusCode = 422
        throw err
      }

      const unitCost = parseFloat(item.unit_cost ?? item.cost ?? 0)
      if (isNaN(unitCost) || unitCost < 0) {
        const err = new Error(`Item "${item.product || item.product_id}" unit cost cannot be negative`)
        err.statusCode = 422
        throw err
      }

      const itemSubtotal = parseFloat((orderedQty * unitCost).toFixed(2))
      totalOrdered += orderedQty
      subtotal += itemSubtotal

      processedItems.push({
        product_id: item.product_id || item.productId || `PROD-${Date.now()}`,
        product: item.product || item.product_name || 'Vehicle Kit',
        sku: item.sku || null,
        ordered_quantity: orderedQty,
        received_quantity: 0,
        unit_cost: unitCost,
        subtotal: itemSubtotal,
        is_serialized: item.is_serialized !== undefined ? (item.is_serialized ? 1 : 0) : (item.isSerialized ? 1 : 1)
      })
    }

    const tax = parseFloat(data.tax || 0)
    const amount = parseFloat((subtotal + tax).toFixed(2))

    // Generate PO Number
    let poNumber = data.po_number || data.po
    if (!poNumber) {
      const maxRows = await query('SELECT po_number FROM `purchase_orders` ORDER BY id DESC LIMIT 10')
      let maxNum = 2050
      maxRows.forEach(r => {
        const match = String(r.po_number || '').match(/PO-(\d+)/i)
        if (match) {
          const n = parseInt(match[1], 10)
          if (n > maxNum) maxNum = n
        }
      })
      poNumber = `PO-${maxNum + 1}`
    }

    const poId = data.id || poNumber

    // Check duplicate PO number
    const dupPo = await query('SELECT id FROM `purchase_orders` WHERE po_number = ? OR id = ? LIMIT 1', [poNumber, poId])
    if (dupPo.length > 0) {
      const err = new Error(`Purchase order ${poNumber} already exists`)
      err.statusCode = 409
      throw err
    }

    const initialStatus = data.status || 'Draft'
    let statusClass = 'bg-gray-100 text-gray-700'
    if (initialStatus === 'Pending Approval') statusClass = 'bg-amber-50 text-amber-700'
    else if (initialStatus === 'Approved') statusClass = 'bg-[#dcfce7] text-[#165A31]'

    const orderDate = data.order_date || data.orderDate || new Date().toISOString().split('T')[0]
    const expectedDate = data.expected_date || data.expectedDate || null

    await withTransaction(async (conn) => {
      // 1. Insert header
      await conn.execute(
        `INSERT INTO \`purchase_orders\` (
          \`id\`, \`po_number\`, \`supplier_id\`, \`supplier\`, \`branch_id\`, \`branch\`, \`destination\`,
          \`total_ordered\`, \`total_received\`, \`remaining_units\`, \`subtotal\`, \`tax\`, \`amount\`,
          \`order_date\`, \`expected_date\`, \`carrier\`, \`tracking\`, \`status\`, \`status_class\`,
          \`match_status\`, \`requested_by\`, \`approved_by\`, \`notes\`
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          poId,
          poNumber,
          supplier.id,
          supplier.name,
          branchId,
          branchName,
          destination,
          totalOrdered,
          0,
          totalOrdered,
          subtotal,
          tax,
          amount,
          orderDate,
          expectedDate,
          data.carrier || null,
          data.tracking || null,
          initialStatus,
          statusClass,
          '—',
          data.requested_by || 'Store Lead',
          initialStatus === 'Approved' ? (data.approved_by || 'Manager') : null,
          data.notes || null
        ]
      )

      // 2. Insert items
      for (const item of processedItems) {
        await conn.execute(
          `INSERT INTO \`purchase_order_items\` (
            \`po_id\`, \`product_id\`, \`product\`, \`sku\`, \`ordered_quantity\`,
            \`received_quantity\`, \`unit_cost\`, \`subtotal\`, \`is_serialized\`
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            poId,
            item.product_id,
            item.product,
            item.sku,
            item.ordered_quantity,
            0,
            item.unit_cost,
            item.subtotal,
            item.is_serialized
          ]
        )
      }

      return poId
    })

    return await this.findPurchaseOrderById(poId)
  },

  /**
   * Update purchase order in Draft / Pending Approval state
   */
  async updatePurchaseOrder(id, data) {
    const existing = await query('SELECT * FROM `purchase_orders` WHERE id = ? OR po_number = ?', [id, id])
    if (existing.length === 0) {
      const err = new Error(`Purchase order ${id} not found`)
      err.statusCode = 404
      throw err
    }

    const po = existing[0]
    if (po.status !== 'Draft' && po.status !== 'Pending Approval') {
      const err = new Error(`Cannot modify purchase order in "${po.status}" status. Only Draft and Pending Approval POs can be edited.`)
      err.statusCode = 400
      throw err
    }

    await withTransaction(async (conn) => {
      // Update items if provided
      if (data.items && Array.isArray(data.items) && data.items.length > 0) {
        // Delete old items
        await conn.execute('DELETE FROM `purchase_order_items` WHERE `po_id` = ?', [po.id])

        let totalOrdered = 0
        let subtotal = 0

        for (const item of data.items) {
          const qty = parseInt(item.ordered_quantity ?? item.ordered ?? item.quantity ?? 0, 10)
          if (qty <= 0) throw new Error('Item ordered quantity must be > 0')
          const cost = parseFloat(item.unit_cost ?? item.cost ?? 0)
          const itemSub = parseFloat((qty * cost).toFixed(2))

          totalOrdered += qty
          subtotal += itemSub

          await conn.execute(
            `INSERT INTO \`purchase_order_items\` (
              \`po_id\`, \`product_id\`, \`product\`, \`sku\`, \`ordered_quantity\`,
              \`received_quantity\`, \`unit_cost\`, \`subtotal\`, \`is_serialized\`
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              po.id,
              item.product_id || `PROD-${Date.now()}`,
              item.product || 'Vehicle Component',
              item.sku || null,
              qty,
              0,
              cost,
              itemSub,
              item.is_serialized ? 1 : 0
            ]
          )
        }

        const tax = parseFloat(data.tax !== undefined ? data.tax : po.tax)
        const amount = parseFloat((subtotal + tax).toFixed(2))

        await conn.execute(
          `UPDATE \`purchase_orders\` SET
            \`total_ordered\` = ?, \`remaining_units\` = ?, \`subtotal\` = ?, \`tax\` = ?, \`amount\` = ?,
            \`carrier\` = ?, \`tracking\` = ?, \`expected_date\` = ?, \`notes\` = ?, \`updated_at\` = NOW()
          WHERE \`id\` = ?`,
          [
            totalOrdered,
            totalOrdered,
            subtotal,
            tax,
            amount,
            data.carrier !== undefined ? data.carrier : po.carrier,
            data.tracking !== undefined ? data.tracking : po.tracking,
            data.expected_date !== undefined ? data.expected_date : po.expected_date,
            data.notes !== undefined ? data.notes : po.notes,
            po.id
          ]
        )
      } else {
        // Just header fields update
        await conn.execute(
          `UPDATE \`purchase_orders\` SET
            \`carrier\` = ?, \`tracking\` = ?, \`expected_date\` = ?, \`notes\` = ?, \`updated_at\` = NOW()
          WHERE \`id\` = ?`,
          [
            data.carrier !== undefined ? data.carrier : po.carrier,
            data.tracking !== undefined ? data.tracking : po.tracking,
            data.expected_date !== undefined ? data.expected_date : po.expected_date,
            data.notes !== undefined ? data.notes : po.notes,
            po.id
          ]
        )
      }

      return po.id
    })

    return await this.findPurchaseOrderById(po.id)
  },

  /**
   * Approve a Purchase Order (Transitions from Draft / Pending Approval to Approved)
   */
  async approvePurchaseOrder(id, { user = 'Manager' } = {}) {
    const existing = await query('SELECT * FROM `purchase_orders` WHERE id = ? OR po_number = ?', [id, id])
    if (existing.length === 0) {
      const err = new Error(`Purchase order ${id} not found`)
      err.statusCode = 404
      throw err
    }

    const po = existing[0]
    if (po.status !== 'Draft' && po.status !== 'Pending Approval') {
      const err = new Error(`Cannot approve purchase order in "${po.status}" state. Only Draft or Pending Approval POs can be approved.`)
      err.statusCode = 400
      throw err
    }

    await query(
      `UPDATE \`purchase_orders\` SET
        \`status\` = 'Approved',
        \`status_class\` = 'bg-[#dcfce7] text-[#165A31]',
        \`approved_by\` = ?,
        \`approved_at\` = NOW(),
        \`updated_at\` = NOW()
      WHERE \`id\` = ?`,
      [user, po.id]
    )

    return await this.findPurchaseOrderById(po.id)
  },

  /**
   * Mark Purchase Order as Dispatched / In Transit
   */
  async sendPurchaseOrder(id, { carrier, tracking, expected_date } = {}) {
    const existing = await query('SELECT * FROM `purchase_orders` WHERE id = ? OR po_number = ?', [id, id])
    if (existing.length === 0) {
      const err = new Error(`Purchase order ${id} not found`)
      err.statusCode = 404
      throw err
    }

    const po = existing[0]
    if (po.status !== 'Approved') {
      const err = new Error(`Cannot mark PO as sent/in transit: current status is "${po.status}". Order must be Approved first.`)
      err.statusCode = 400
      throw err
    }

    await query(
      `UPDATE \`purchase_orders\` SET
        \`status\` = 'In Transit',
        \`status_class\` = 'bg-blue-50 text-blue-700',
        \`carrier\` = COALESCE(?, \`carrier\`),
        \`tracking\` = COALESCE(?, \`tracking\`),
        \`expected_date\` = COALESCE(?, \`expected_date\`),
        \`updated_at\` = NOW()
      WHERE \`id\` = ?`,
      [carrier || null, tracking || null, expected_date || null, po.id]
    )

    return await this.findPurchaseOrderById(po.id)
  },

  /**
   * Cancel a Purchase Order (Cannot cancel if items have already been received)
   */
  async cancelPurchaseOrder(id, { user = 'Admin', reason = 'Cancelled by user' } = {}) {
    const existing = await query('SELECT * FROM `purchase_orders` WHERE id = ? OR po_number = ?', [id, id])
    if (existing.length === 0) {
      const err = new Error(`Purchase order ${id} not found`)
      err.statusCode = 404
      throw err
    }

    const po = existing[0]
    if (po.status === 'Fully Received') {
      const err = new Error('Cannot cancel a purchase order that has already been fully received')
      err.statusCode = 400
      throw err
    }

    if (parseInt(po.total_received || 0, 10) > 0) {
      const err = new Error(`Cannot cancel purchase order ${po.po_number}: ${po.total_received} unit(s) have already been received into stock`)
      err.statusCode = 400
      throw err
    }

    if (po.status === 'Cancelled') {
      const err = new Error(`Purchase order ${po.po_number} is already cancelled`)
      err.statusCode = 400
      throw err
    }

    await query(
      `UPDATE \`purchase_orders\` SET
        \`status\` = 'Cancelled',
        \`status_class\` = 'bg-red-50 text-red-700',
        \`cancelled_by\` = ?,
        \`cancelled_at\` = NOW(),
        \`cancellation_reason\` = ?,
        \`updated_at\` = NOW()
      WHERE \`id\` = ?`,
      [user, reason, po.id]
    )

    return await this.findPurchaseOrderById(po.id)
  },

  // =========================================================================
  // GOODS RECEIVED NOTES (GRN) & INVENTORY TRANSACTIONS
  // =========================================================================

  /**
   * Retrieve all Goods Received Notes (GRN)
   */
  async findAllReceipts({ search, po_id, branch_id } = {}) {
    let sql = 'SELECT * FROM `goods_receipts` WHERE 1=1'
    const params = []

    if (po_id) {
      sql += ' AND (po_id = ? OR po_number = ?)'
      params.push(po_id, po_id)
    }

    if (branch_id && branch_id !== 'all' && branch_id !== 'BR-01' && branch_id !== 'HQ') {
      sql += ' AND branch_id = ?'
      params.push(branch_id)
    }

    if (search && search.trim()) {
      const q = `%${search.trim()}%`
      sql += ' AND (receipt_number LIKE ? OR po_number LIKE ? OR supplier LIKE ? OR delivery_note LIKE ?)'
      params.push(q, q, q, q)
    }

    sql += ' ORDER BY receipt_date DESC, created_at DESC'

    const rows = await query(sql, params)
    if (rows.length === 0) return []

    const receiptIds = rows.map(r => r.id)
    const placeholders = receiptIds.map(() => '?').join(',')
    const itemRows = await query(
      `SELECT * FROM \`goods_receipt_items\` WHERE \`receipt_id\` IN (${placeholders})`,
      receiptIds
    )

    const itemsByReceipt = {}
    itemRows.forEach(item => {
      if (!itemsByReceipt[item.receipt_id]) itemsByReceipt[item.receipt_id] = []
      itemsByReceipt[item.receipt_id].push(item)
    })

    return rows.map(r => formatReceiptRow(r, itemsByReceipt[r.id] || []))
  },

  /**
   * Retrieve single Goods Received Note by ID or receipt_number
   */
  async findReceiptById(id) {
    const rows = await query(
      'SELECT * FROM `goods_receipts` WHERE id = ? OR receipt_number = ? LIMIT 1',
      [id, id]
    )
    if (!rows || rows.length === 0) return null

    const receipt = rows[0]
    const itemRows = await query('SELECT * FROM `goods_receipt_items` WHERE `receipt_id` = ?', [receipt.id])
    return formatReceiptRow(receipt, itemRows)
  },

  /**
   * Create a Goods Received Note (GRN) with Atomic Transaction and Row-Locking
   * Integrates strictly with Inventory: Only ACCEPTED units increase stock.
   * Damaged units transition to QC Hold and do not increment available inventory.
   */
  async createReceipt(data) {
    const poIdentifier = data.po_id || data.po_number || data.poId || data.po
    if (!poIdentifier) {
      const err = new Error('Purchase Order ID or Number is required to post a receipt')
      err.statusCode = 422
      throw err
    }

    const lines = data.lines || data.items || []
    if (!Array.isArray(lines) || lines.length === 0) {
      const err = new Error('Goods receipt must specify at least one received line item')
      err.statusCode = 422
      throw err
    }

    let createdReceiptId = null
    await withTransaction(async (conn) => {
      // 1. Lock Purchase Order Row FOR UPDATE
      const [poRows] = await conn.execute(
        'SELECT * FROM `purchase_orders` WHERE id = ? OR po_number = ? FOR UPDATE',
        [poIdentifier, poIdentifier]
      )

      if (poRows.length === 0) {
        const err = new Error(`Purchase order "${poIdentifier}" not found`)
        err.statusCode = 404
        throw err
      }

      const po = poRows[0]

      // State validation: PO must be in a receivable state
      if (po.status === 'Cancelled') {
        const err = new Error(`Cannot receive goods: Purchase order ${po.po_number} is Cancelled`)
        err.statusCode = 400
        throw err
      }

      if (po.status === 'Draft' || po.status === 'Pending Approval') {
        const err = new Error(`Cannot receive goods: Purchase order ${po.po_number} is in "${po.status}" state. Order must be Approved before receiving.`)
        err.statusCode = 400
        throw err
      }

      if (po.status === 'Fully Received') {
        const err = new Error(`Cannot receive goods: Purchase order ${po.po_number} is already Fully Received`)
        err.statusCode = 400
        throw err
      }

      // 2. Lock Purchase Order Line Items FOR UPDATE
      const [poItemRows] = await conn.execute(
        'SELECT * FROM `purchase_order_items` WHERE `po_id` = ? FOR UPDATE',
        [po.id]
      )

      if (poItemRows.length === 0) {
        const err = new Error(`Purchase order ${po.po_number} has no line items registered`)
        err.statusCode = 400
        throw err
      }

      // 3. Duplicate Delivery Note check (Prevent accidental double processing)
      const deliveryNote = data.delivery_note ? String(data.delivery_note).trim() : null
      if (deliveryNote) {
        const [dupNoteRows] = await conn.execute(
          'SELECT id FROM `goods_receipts` WHERE `po_id` = ? AND `delivery_note` = ? FOR UPDATE',
          [po.id, deliveryNote]
        )
        if (dupNoteRows.length > 0) {
          const err = new Error(`Goods receipt with Delivery Note "${deliveryNote}" has already been posted for PO ${po.po_number}`)
          err.statusCode = 409
          throw err
        }
      }

      // Generate Receipt Number
      let receiptNumber = data.receipt_number || data.receipt_id || data.receiptNumber
      if (!receiptNumber) {
        const [maxRows] = await conn.execute('SELECT receipt_number FROM `goods_receipts` ORDER BY id DESC LIMIT 5')
        let maxNum = 991
        maxRows.forEach(r => {
          const match = String(r.receipt_number || '').match(/GR-(\d+)/i)
          if (match) {
            const n = parseInt(match[1], 10)
            if (n > maxNum) maxNum = n
          }
        })
        receiptNumber = `GR-${maxNum + 1}`
      }

      // Check unique receipt number
      const [dupRecRows] = await conn.execute(
        'SELECT id FROM `goods_receipts` WHERE `receipt_number` = ? FOR UPDATE',
        [receiptNumber]
      )
      if (dupRecRows.length > 0) {
        const err = new Error(`Goods receipt number ${receiptNumber} already exists`)
        err.statusCode = 409
        throw err
      }

      const receiptId = receiptNumber

      // 4. Validate lines, prevent negative quantities, check over-receiving
      let totalReceivedUnits = 0
      let totalAcceptedUnits = 0
      let totalDamagedUnits = 0
      const processedLines = []

      for (const line of lines) {
        const currentRec = parseInt(line.current_received_quantity ?? line.currentReceived ?? line.received ?? line.receivedQty ?? 0, 10)
        const damaged = parseInt(line.damaged_quantity ?? line.damaged ?? line.damagedQty ?? 0, 10)

        // Negative check
        if (currentRec < 0 || damaged < 0) {
          const err = new Error('Received quantity and damaged quantity cannot be negative')
          err.statusCode = 400
          throw err
        }

        if (damaged > currentRec) {
          const err = new Error(`Damaged quantity (${damaged}) cannot exceed received quantity (${currentRec})`)
          err.statusCode = 400
          throw err
        }

        const accepted = currentRec - damaged

        // Match with PO line item
        const matchingPoItem = poItemRows.find(item => 
          (line.product_id && item.product_id === line.product_id) ||
          (line.sku && item.sku === line.sku) ||
          (line.product && item.product.toLowerCase() === line.product.toLowerCase())
        )

        if (!matchingPoItem) {
          const err = new Error(`Line item "${line.product || line.product_id}" does not belong to purchase order ${po.po_number}`)
          err.statusCode = 400
          throw err
        }

        const orderedQty = parseInt(matchingPoItem.ordered_quantity, 10)
        const prevRecQty = parseInt(matchingPoItem.received_quantity, 10)
        const outstanding = Math.max(0, orderedQty - prevRecQty)

        // Over-receiving guardrail
        if ((prevRecQty + currentRec) > orderedQty && !line.discrepancy_reason) {
          const err = new Error(
            `Over-receiving prevented for "${matchingPoItem.product}": ordered ${orderedQty}, previously received ${prevRecQty}, current received ${currentRec} (total: ${prevRecQty + currentRec}). Discrepancy reason is required for excess quantities.`
          )
          err.statusCode = 400
          throw err
        }

        const shortQty = Math.max(0, outstanding - currentRec)
        const excessQty = Math.max(0, currentRec - outstanding)

        totalReceivedUnits += currentRec
        totalAcceptedUnits += accepted
        totalDamagedUnits += damaged

        processedLines.push({
          poItemId: matchingPoItem.id,
          product_id: matchingPoItem.product_id,
          product: matchingPoItem.product,
          sku: matchingPoItem.sku,
          ordered_quantity: orderedQty,
          previously_received_quantity: prevRecQty,
          current_received_quantity: currentRec,
          accepted_quantity: accepted,
          damaged_quantity: damaged,
          short_quantity: shortQty,
          excess_quantity: excessQty,
          discrepancy_reason: line.discrepancy_reason || null,
          unit_cost: parseFloat(matchingPoItem.unit_cost || 0),
          is_serialized: matchingPoItem.is_serialized
        })
      }

      if (totalReceivedUnits <= 0) {
        const err = new Error('Total received units must be greater than 0 across receipt lines')
        err.statusCode = 400
        throw err
      }

      const receivedBy = data.received_by || data.receiver || 'Store Lead'
      const receiptDate = data.receipt_date || new Date().toISOString().split('T')[0]
      const location = data.location || `${po.branch} Main Depot`
      const branchId = po.branch_id || 'BR-01'
      const branchName = po.branch || 'Peshawar'

      // 5. Update Inventory with Row Locks (SELECT FOR UPDATE)
      // Only ACCEPTED quantities increase on_hand and available inventory stock!
      for (const line of processedLines) {
        if (line.accepted_quantity > 0) {
          // Lock stock row FOR UPDATE
          const [stockRows] = await conn.execute(
            'SELECT * FROM `inventory_stock` WHERE `product_id` = ? AND `branch_id` = ? FOR UPDATE',
            [line.product_id, branchId]
          )

          let beforeOnHand = 0
          let reserved = 0
          let stockId = null

          if (stockRows.length === 0) {
            // Insert initial row for this branch
            const [insertRes] = await conn.execute(
              `INSERT INTO \`inventory_stock\` (
                \`product_id\`, \`branch_id\`, \`branch\`, \`on_hand\`, \`reserved\`, \`available\`, \`reorder_level\`
              ) VALUES (?, ?, ?, 0, 0, 0, 5)`,
              [line.product_id, branchId, branchName]
            )
            stockId = insertRes.insertId
            beforeOnHand = 0
            reserved = 0
          } else {
            const stock = stockRows[0]
            stockId = stock.id
            beforeOnHand = parseInt(stock.on_hand || 0, 10)
            reserved = parseInt(stock.reserved || 0, 10)
          }

          const afterOnHand = beforeOnHand + line.accepted_quantity
          const afterAvailable = Math.max(0, afterOnHand - reserved)

          // Update stock table
          await conn.execute(
            'UPDATE `inventory_stock` SET `on_hand` = ?, `available` = ?, `updated_at` = NOW() WHERE `id` = ?',
            [afterOnHand, afterAvailable, stockId]
          )

          // Append audit ledger entry to stock_movements
          const movementNumber = `MOV-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`
          await conn.execute(
            `INSERT INTO \`stock_movements\` (
              \`movement_number\`, \`reference_type\`, \`reference_id\`, \`product_id\`, \`product_name\`,
              \`unit_id\`, \`branch_id\`, \`branch\`, \`quantity\`, \`on_hand_before\`, \`on_hand_after\`,
              \`user\`, \`reason\`, \`notes\`
            ) VALUES (?, 'RECEIPT', ?, ?, ?, NULL, ?, ?, ?, ?, ?, ?, 'Supplier Inward Receipt', ?)`,
            [
              movementNumber,
              receiptNumber,
              line.product_id,
              line.product,
              branchId,
              branchName,
              line.accepted_quantity,
              beforeOnHand,
              afterOnHand,
              receivedBy,
              `GRN ${receiptNumber} receipt from ${po.supplier} under ${po.po_number}`
            ]
          )
        }

        // 6. Update PO Item received quantity
        await conn.execute(
          'UPDATE `purchase_order_items` SET `received_quantity` = `received_quantity` + ?, `updated_at` = NOW() WHERE `id` = ?',
          [line.current_received_quantity, line.poItemId]
        )
      }

      // 7. Handle Serialized Units (if provided)
      if (data.serializedUnits && Array.isArray(data.serializedUnits) && data.serializedUnits.length > 0) {
        for (const unit of data.serializedUnits) {
          const isDamaged = unit.condition === 'Damaged' || unit.qc === 'Fail' || unit.condition === 'Defect'
          const isHold = unit.qc === 'QC Hold' || unit.qc === 'Hold' || unit.condition === 'Scratch'
          
          let unitStatus = 'Available'
          let statusClass = 'bg-[#dcfce7] text-[#165A31]'
          let unitLoc = location || 'Showroom Floor'

          if (isDamaged || isHold) {
            unitStatus = 'QC Hold'
            statusClass = 'bg-amber-50 text-amber-700'
            unitLoc = 'QC Inspection Bay'
          }

          const unitId = unit.serial || unit.chassis || unit.vin || `UNIT-${Date.now().toString().slice(-6)}`

          await conn.execute(
            `INSERT IGNORE INTO \`serialized_units\` (
              \`id\`, \`unit_id\`, \`serial_number\`, \`chassis_number\`, \`vin\`, \`motor_number\`, \`battery_number\`,
              \`product_id\`, \`product_name\`, \`sku\`, \`branch_id\`, \`branch\`, \`location\`,
              \`landed_cost\`, \`selling_price\`, \`status\`, \`status_class\`, \`condition_status\`,
              \`source_po\`, \`receipt_id\`
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              unitId,
              unitId,
              unit.serial || null,
              unit.chassis || null,
              unit.vin || null,
              unit.motor || null,
              unit.battery || null,
              unit.product_id || unit.productId || 'PROD-001',
              unit.product || unit.product_name || 'EV Unit',
              unit.sku || null,
              branchId,
              branchName,
              unitLoc,
              parseFloat(unit.cost || 0),
              parseFloat(unit.selling_price || 0),
              unitStatus,
              statusClass,
              unit.condition || 'Good',
              po.po_number,
              receiptNumber
            ]
          )
        }
      }

      // 8. Recalculate Purchase Order Totals and Transition State
      const [updatedItemRows] = await conn.execute(
        'SELECT SUM(received_quantity) as total_rec, SUM(ordered_quantity) as total_ord FROM `purchase_order_items` WHERE `po_id` = ?',
        [po.id]
      )

      const totalReceivedAcrossPO = parseInt(updatedItemRows[0]?.total_rec || 0, 10)
      const totalOrderedAcrossPO = parseInt(updatedItemRows[0]?.total_ord || po.total_ordered, 10)
      const remainingUnits = Math.max(0, totalOrderedAcrossPO - totalReceivedAcrossPO)

      let newPoStatus = 'Partially Received'
      let newPoStatusClass = 'bg-orange-50 text-orange-700'
      let matchStatus = `${totalReceivedAcrossPO}/${totalOrderedAcrossPO}`

      if (remainingUnits === 0) {
        newPoStatus = 'Fully Received'
        newPoStatusClass = 'bg-[#dcfce7] text-[#165A31]'
        matchStatus = 'Matched'
      }

      await conn.execute(
        `UPDATE \`purchase_orders\` SET
          \`total_received\` = ?,
          \`remaining_units\` = ?,
          \`status\` = ?,
          \`status_class\` = ?,
          \`match_status\` = ?,
          \`updated_at\` = NOW()
        WHERE \`id\` = ?`,
        [totalReceivedAcrossPO, remainingUnits, newPoStatus, newPoStatusClass, matchStatus, po.id]
      )

      // 9. Insert Goods Receipts Header
      await conn.execute(
        `INSERT INTO \`goods_receipts\` (
          \`id\`, \`receipt_number\`, \`po_id\`, \`po_number\`, \`supplier_id\`, \`supplier\`,
          \`branch_id\`, \`branch\`, \`delivery_note\`, \`receipt_date\`, \`received_by\`, \`location\`,
          \`total_received_units\`, \`total_accepted_units\`, \`total_damaged_units\`, \`status\`, \`notes\`
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Posted', ?)`,
        [
          receiptId,
          receiptNumber,
          po.id,
          po.po_number,
          po.supplier_id,
          po.supplier,
          branchId,
          branchName,
          deliveryNote,
          receiptDate,
          receivedBy,
          location,
          totalReceivedUnits,
          totalAcceptedUnits,
          totalDamagedUnits,
          data.notes || 'Inward goods verified and posted to inventory'
        ]
      )

      // 10. Insert Goods Receipt Items
      for (const line of processedLines) {
        await conn.execute(
          `INSERT INTO \`goods_receipt_items\` (
            \`receipt_id\`, \`product_id\`, \`product\`, \`sku\`, \`ordered_quantity\`,
            \`previously_received_quantity\`, \`current_received_quantity\`, \`accepted_quantity\`,
            \`damaged_quantity\`, \`short_quantity\`, \`excess_quantity\`, \`discrepancy_reason\`, \`unit_cost\`
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            receiptId,
            line.product_id,
            line.product,
            line.sku,
            line.ordered_quantity,
            line.previously_received_quantity,
            line.current_received_quantity,
            line.accepted_quantity,
            line.damaged_quantity,
            line.short_quantity,
            line.excess_quantity,
            line.discrepancy_reason,
            line.unit_cost
          ]
        )
      }

      // 11. Create / Link Vendor Bill for 3-Way Matching
      const billAmount = processedLines.reduce((acc, l) => acc + (l.accepted_quantity * l.unit_cost), 0)
      if (billAmount > 0) {
        const [maxBillRows] = await conn.execute('SELECT bill_number FROM `vendor_bills` ORDER BY id DESC LIMIT 5')
        let maxBillNum = 791
        maxBillRows.forEach(r => {
          const match = String(r.bill_number || '').match(/BILL-(\d+)/i)
          if (match) {
            const n = parseInt(match[1], 10)
            if (n > maxBillNum) maxBillNum = n
          }
        })
        const billNumber = `BILL-${maxBillNum + 1}`

        // Calculate due date (30 days from receipt)
        const d = new Date(receiptDate)
        d.setDate(d.getDate() + 30)
        const dueDate = d.toISOString().split('T')[0]

        await conn.execute(
          `INSERT INTO \`vendor_bills\` (
            \`id\`, \`bill_number\`, \`po_id\`, \`po_number\`, \`receipt_id\`, \`supplier_id\`, \`supplier\`,
            \`branch_id\`, \`branch\`, \`amount\`, \`paid_amount\`, \`outstanding_amount\`, \`due_date\`,
            \`status\`, \`status_class\`, \`match_status\`
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0.00, ?, ?, 'Open', 'bg-[#eff6ff] text-[#2563eb]', 'Matched')`,
          [
            billNumber,
            billNumber,
            po.id,
            po.po_number,
            receiptId,
            po.supplier_id,
            po.supplier,
            branchId,
            branchName,
            billAmount,
            billAmount,
            dueDate
          ]
        )
      }

      createdReceiptId = receiptId
      return receiptId
    })

    return await this.findReceiptById(createdReceiptId)
  },

  // =========================================================================
  // VENDOR BILLS
  // =========================================================================

  /**
   * Retrieve all Vendor Bills
   */
  async findAllVendorBills({ status, branch_id, supplier_id, po_id } = {}) {
    let sql = 'SELECT * FROM `vendor_bills` WHERE 1=1'
    const params = []

    if (status && status !== 'All Statuses' && status !== 'all') {
      sql += ' AND status = ?'
      params.push(status)
    }

    if (branch_id && branch_id !== 'all' && branch_id !== 'BR-01' && branch_id !== 'HQ') {
      sql += ' AND branch_id = ?'
      params.push(branch_id)
    }

    if (supplier_id) {
      sql += ' AND supplier_id = ?'
      params.push(supplier_id)
    }

    if (po_id) {
      sql += ' AND (po_id = ? OR po_number = ?)'
      params.push(po_id, po_id)
    }

    sql += ' ORDER BY due_date ASC, created_at DESC'
    const rows = await query(sql, params)
    return rows.map(formatVendorBillRow)
  },

  /**
   * Retrieve single Vendor Bill by ID
   */
  async findVendorBillById(id) {
    const rows = await query('SELECT * FROM `vendor_bills` WHERE id = ? OR bill_number = ? LIMIT 1', [id, id])
    if (!rows || rows.length === 0) return null
    return formatVendorBillRow(rows[0])
  },

  /**
   * Record payment against a vendor bill
   */
  async recordBillPayment(id, { amount, payment_method = 'Bank Transfer', ref = '' } = {}) {
    const bill = await this.findVendorBillById(id)
    if (!bill) {
      const err = new Error(`Vendor bill ${id} not found`)
      err.statusCode = 404
      throw err
    }

    const payAmt = parseFloat(amount || 0)
    if (payAmt <= 0) {
      const err = new Error('Payment amount must be greater than 0')
      err.statusCode = 422
      throw err
    }

    if (payAmt > bill.outstanding_amount) {
      const err = new Error(`Payment amount (PKR ${payAmt}) exceeds outstanding bill balance (PKR ${bill.outstanding_amount})`)
      err.statusCode = 400
      throw err
    }

    const newPaid = bill.paid_amount + payAmt
    const newOutstanding = Math.max(0, bill.amount - newPaid)
    const newStatus = newOutstanding === 0 ? 'Paid' : 'Partial'
    const statusClass = newStatus === 'Paid' ? 'bg-[#dcfce7] text-[#165A31]' : 'bg-[#fef3c7] text-[#b45309]'

    await query(
      `UPDATE \`vendor_bills\` SET
        \`paid_amount\` = ?,
        \`outstanding_amount\` = ?,
        \`status\` = ?,
        \`status_class\` = ?,
        \`updated_at\` = NOW()
      WHERE \`id\` = ?`,
      [newPaid, newOutstanding, newStatus, statusClass, bill.id]
    )

    return await this.findVendorBillById(bill.id)
  },

  // =========================================================================
  // PURCHASE RETURNS & VENDOR DEBIT NOTES
  // =========================================================================

  /**
   * Retrieve all Purchase Returns with optional search, status, and branch filtering
   */
  async findAllPurchaseReturns({ search, status, supplier_id, po_id, branch_id } = {}) {
    let sql = 'SELECT * FROM `purchase_returns` WHERE 1=1'
    const params = []

    if (status && status !== 'All' && status !== 'all') {
      sql += ' AND LOWER(status) = LOWER(?)'
      params.push(status)
    }

    if (branch_id && branch_id !== 'all' && branch_id !== 'BR-01' && branch_id !== 'HQ') {
      sql += ' AND branch_id = ?'
      params.push(branch_id)
    }

    if (supplier_id) {
      sql += ' AND supplier_id = ?'
      params.push(supplier_id)
    }

    if (po_id) {
      sql += ' AND (po_id = ? OR po_number = ?)'
      params.push(po_id, po_id)
    }

    if (search && search.trim()) {
      const q = `%${search.trim()}%`
      sql += ' AND (return_number LIKE ? OR supplier LIKE ? OR po_number LIKE ? OR reason LIKE ?)'
      params.push(q, q, q, q)
    }

    sql += ' ORDER BY created_at DESC'
    const rows = await query(sql, params)

    const results = []
    for (const r of rows) {
      const lineRows = await query('SELECT * FROM `purchase_return_items` WHERE return_id = ?', [r.id])
      const debitRows = await query('SELECT * FROM `vendor_debit_notes` WHERE return_id = ?', [r.id])
      results.push(formatPurchaseReturnRow(r, lineRows, debitRows))
    }
    return results
  },

  /**
   * Retrieve a single Purchase Return by ID or return_number with full lines and debit notes
   */
  async findPurchaseReturnById(id) {
    const rows = await query(
      'SELECT * FROM `purchase_returns` WHERE id = ? OR return_number = ? LIMIT 1',
      [id, id]
    )
    if (!rows || rows.length === 0) return null

    const ret = rows[0]
    const lineRows = await query('SELECT * FROM `purchase_return_items` WHERE return_id = ?', [ret.id])
    const debitRows = await query('SELECT * FROM `vendor_debit_notes` WHERE return_id = ?', [ret.id])
    return formatPurchaseReturnRow(ret, lineRows, debitRows)
  },

  /**
   * Create a Purchase Return in DRAFT state
   * Does NOT alter inventory stock, stock movements, or vendor bills.
   */
  async createPurchaseReturn(data, user = {}) {
    const supplierIdentifier = data.supplier_id || data.supplierId || data.supplier
    if (!supplierIdentifier) {
      const err = new Error('Supplier is required for purchase return')
      err.statusCode = 422
      throw err
    }

    const lines = data.lines || data.items || []
    if (!Array.isArray(lines) || lines.length === 0) {
      const err = new Error('Purchase return must contain at least one line item')
      err.statusCode = 422
      throw err
    }

    const reason = data.reason ? String(data.reason).trim() : ''
    if (!reason) {
      const err = new Error('Reason for return is required')
      err.statusCode = 422
      throw err
    }

    // Resolve Supplier
    const supRows = await query(
      'SELECT * FROM `suppliers` WHERE id = ? OR code = ? OR name = ? LIMIT 1',
      [supplierIdentifier, supplierIdentifier, supplierIdentifier]
    )
    const supplier = supRows && supRows.length > 0 ? supRows[0] : null
    const supplierId = supplier ? supplier.id : supplierIdentifier
    const supplierName = supplier ? supplier.name : (data.supplier || 'Vendor')

    // Resolve PO and Goods Receipt (if provided)
    let po = null
    const poIdent = data.po_id || data.poId || data.po_number || data.po
    if (poIdent) {
      const poRows = await query(
        'SELECT * FROM `purchase_orders` WHERE id = ? OR po_number = ? LIMIT 1',
        [poIdent, poIdent]
      )
      if (poRows && poRows.length > 0) po = poRows[0]
    }

    let receipt = null
    const receiptIdent = data.receipt_id || data.receiptId || data.receipt_number || data.receiptNumber
    if (receiptIdent) {
      const recRows = await query(
        'SELECT * FROM `goods_receipts` WHERE id = ? OR receipt_number = ? LIMIT 1',
        [receiptIdent, receiptIdent]
      )
      if (recRows && recRows.length > 0) receipt = recRows[0]
    }

    const branchId = data.branch_id || (po ? po.branch_id : (receipt ? receipt.branch_id : 'BR-01'))
    const branchName = data.branch || (po ? po.branch : (receipt ? receipt.branch : 'Peshawar'))

    // Validate Lines and Quantities against authoritative DB records
    let totalUnits = 0
    let totalCredit = 0.0
    const processedLines = []

    for (const line of lines) {
      const prodId = line.product_id || line.productId
      if (!prodId) {
        const err = new Error('Product ID is required for each return line')
        err.statusCode = 422
        throw err
      }

      const qty = parseInt(line.quantity || line.units || 1, 10)
      if (isNaN(qty) || qty <= 0) {
        const err = new Error(`Return quantity for product "${line.product || prodId}" must be greater than 0`)
        err.statusCode = 400
        throw err
      }

      const unitCost = parseFloat(line.unit_cost !== undefined ? line.unit_cost : (line.expectedUnitCost || 0))
      if (isNaN(unitCost) || unitCost < 0) {
        const err = new Error(`Unit cost cannot be negative for product "${line.product || prodId}"`)
        err.statusCode = 400
        throw err
      }

      // Check product catalogue
      const prodRows = await query('SELECT * FROM `products` WHERE id = ? LIMIT 1', [prodId])
      const prodName = prodRows && prodRows.length > 0 ? prodRows[0].name : (line.product || 'Product')
      const sku = prodRows && prodRows.length > 0 ? prodRows[0].sku : (line.sku || '')

      // Check eligible returnable quantity across PO/Receipt
      if (po || receipt) {
        let totalReceivedForProd = 0
        if (receipt) {
          const recItemRows = await query(
            'SELECT current_received_quantity FROM `goods_receipt_items` WHERE receipt_id = ? AND product_id = ?',
            [receipt.id, prodId]
          )
          totalReceivedForProd = (recItemRows || []).reduce((sum, r) => sum + parseInt(r.current_received_quantity || 0, 10), 0)
        } else if (po) {
          const poItemRows = await query(
            'SELECT received_quantity FROM `purchase_order_items` WHERE po_id = ? AND product_id = ?',
            [po.id, prodId]
          )
          totalReceivedForProd = (poItemRows || []).reduce((sum, r) => sum + parseInt(r.received_quantity || 0, 10), 0)
        }

        // Query previously approved returns for this PO/Receipt
        const prevRetRows = await query(
          `SELECT COALESCE(SUM(pri.quantity), 0) as total_prev_ret
           FROM \`purchase_return_items\` pri
           JOIN \`purchase_returns\` pr ON pri.return_id = pr.id
           WHERE (pr.po_id = ? OR pr.po_number = ?) AND pri.product_id = ? AND pr.status IN ('Approved', 'Shipped', 'Credited', 'Closed')`,
          [po ? po.id : receipt.po_id, po ? po.po_number : receipt.po_number, prodId]
        )
        const prevReturned = parseInt(prevRetRows && prevRetRows[0] ? prevRetRows[0].total_prev_ret : 0, 10)
        const remainingReturnable = Math.max(0, totalReceivedForProd - prevReturned)

        if (totalReceivedForProd > 0 && qty > remainingReturnable) {
          const err = new Error(
            `Return quantity (${qty}) exceeds remaining returnable units (${remainingReturnable}) for product "${prodName}". Received: ${totalReceivedForProd}, previously returned: ${prevReturned}.`
          )
          err.statusCode = 400
          throw err
        }
      }

      const lineSubtotal = qty * unitCost
      totalUnits += qty
      totalCredit += lineSubtotal

      let isQcHold = Boolean(
        line.is_from_qc_hold ||
        line.is_qc_hold ||
        line.qc_hold ||
        line.qcHold ||
        line.condition === 'Damaged' ||
        line.qc === 'Fail' ||
        line.qc === 'QC Hold'
      )

      if (!isQcHold && (line.serial_number || line.unit_id)) {
        const uId = line.serial_number || line.unit_id
        const unitRows = await query(
          'SELECT status, condition_status FROM `serialized_units` WHERE serial_number = ? OR unit_id = ? LIMIT 1',
          [uId, uId]
        )
        if (unitRows && unitRows.length > 0) {
          const u = unitRows[0]
          if (u.status === 'QC Hold' || u.condition_status === 'Damaged Cell' || u.condition_status === 'Defective') {
            isQcHold = true
          }
        }
      }

      processedLines.push({
        product_id: prodId,
        product: prodName,
        sku,
        unit_id: line.unit_id || line.serial || line.chassis || null,
        serial_number: line.serial_number || line.serial || line.chassis || null,
        quantity: qty,
        unit_cost: unitCost,
        subtotal: lineSubtotal,
        condition: line.condition || 'Defective',
        is_from_qc_hold: isQcHold
      })
    }

    // Generate Return Number
    let returnNumber = data.return_number || data.returnNo
    if (!returnNumber) {
      const maxRows = await query('SELECT return_number FROM `purchase_returns` ORDER BY id DESC LIMIT 5')
      let maxNum = 46
      if (Array.isArray(maxRows)) {
        maxRows.forEach(r => {
          const match = String(r.return_number || '').match(/PRTN-(\d+)/i)
          if (match) {
            const n = parseInt(match[1], 10)
            if (n > maxNum) maxNum = n
          }
        })
      }
      returnNumber = `PRTN-0${maxNum + 1}`
    }

    const returnId = returnNumber

    // Prevent duplicate return number
    const dupRows = await query('SELECT id FROM `purchase_returns` WHERE return_number = ?', [returnNumber])
    if (dupRows && dupRows.length > 0) {
      const err = new Error(`Purchase return number "${returnNumber}" already exists`)
      err.statusCode = 409
      throw err
    }

    const createdBy = user.name || data.created_by || 'Store Lead'

    // Insert Header in DRAFT state
    await query(
      `INSERT INTO \`purchase_returns\` (
        \`id\`, \`return_number\`, \`supplier_id\`, \`supplier\`, \`po_id\`, \`po_number\`,
        \`receipt_id\`, \`receipt_number\`, \`branch_id\`, \`branch\`, \`total_units\`,
        \`total_credit_amount\`, \`reason\`, \`status\`, \`status_class\`, \`created_by\`, \`notes\`
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Draft', 'bg-gray-100 text-gray-700', ?, ?)`,
      [
        returnId,
        returnNumber,
        supplierId,
        supplierName,
        po ? po.id : (data.po_id || null),
        po ? po.po_number : (data.po_number || null),
        receipt ? receipt.id : (data.receipt_id || null),
        receipt ? receipt.receipt_number : (data.receipt_number || null),
        branchId,
        branchName,
        totalUnits,
        totalCredit,
        reason,
        createdBy,
        data.notes || null
      ]
    )

    // Insert Line Items
    for (const l of processedLines) {
      await query(
        `INSERT INTO \`purchase_return_items\` (
          \`return_id\`, \`product_id\`, \`product\`, \`sku\`, \`unit_id\`, \`serial_number\`,
          \`quantity\`, \`unit_cost\`, \`subtotal\`, \`condition\`, \`is_from_qc_hold\`
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          returnId,
          l.product_id,
          l.product,
          l.sku,
          l.unit_id,
          l.serial_number,
          l.quantity,
          l.unit_cost,
          l.subtotal,
          l.condition,
          l.is_from_qc_hold ? 1 : 0
        ]
      )
    }

    return await this.findPurchaseReturnById(returnId)
  },

  /**
   * Approve a Purchase Return with ACID transaction and row-locking
   * Atomically decrements stock, appends ledger movements, transitions serialized units,
   * creates a vendor debit note, and safely reconciles against eligible vendor bills.
   */
  async approvePurchaseReturn(id, user = {}) {
    let approvedReturnId = null

    await withTransaction(async (conn) => {
      // 1. Lock Purchase Return Row FOR UPDATE
      const [retRows] = await conn.execute(
        'SELECT * FROM `purchase_returns` WHERE id = ? OR return_number = ? FOR UPDATE',
        [id, id]
      )

      if (retRows.length === 0) {
        const err = new Error(`Purchase return "${id}" not found`)
        err.statusCode = 404
        throw err
      }

      const ret = retRows[0]
      if (ret.status !== 'Draft') {
        const err = new Error(`Cannot approve purchase return: Return ${ret.return_number} is already in "${ret.status}" state`)
        err.statusCode = 400
        throw err
      }

      // 2. Lock Line Items FOR UPDATE
      const [itemRows] = await conn.execute(
        'SELECT * FROM `purchase_return_items` WHERE return_id = ? FOR UPDATE',
        [ret.id]
      )

      if (itemRows.length === 0) {
        const err = new Error(`Purchase return ${ret.return_number} has no line items registered`)
        err.statusCode = 400
        throw err
      }

      // 3. Process Stock Deductions and Movements
      for (const item of itemRows) {
        const isQcHold = Boolean(item.is_from_qc_hold)
        const qty = parseInt(item.quantity, 10)

        if (isQcHold) {
          // QC Hold units were excluded from active inventory during receipt.
          // Do NOT decrement active inventory_stock!
          if (item.unit_id || item.serial_number) {
            await conn.execute(
              `UPDATE \`serialized_units\` SET
                \`status\` = 'Returned to Vendor',
                \`status_class\` = 'bg-gray-100 text-gray-600',
                \`location\` = 'Returned to Supplier',
                \`condition_status\` = 'Defective/Returned',
                \`updated_at\` = NOW()
              WHERE \`unit_id\` = ? OR \`serial_number\` = ?`,
              [item.unit_id || item.serial_number, item.serial_number || item.unit_id]
            )
          }
        } else {
          // Accepted inventory: Lock inventory_stock row FOR UPDATE
          const [stockRows] = await conn.execute(
            'SELECT * FROM `inventory_stock` WHERE `product_id` = ? AND `branch_id` = ? FOR UPDATE',
            [item.product_id, ret.branch_id]
          )

          if (stockRows.length === 0) {
            const err = new Error(`Stock record not found for product "${item.product}" at branch "${ret.branch}"`)
            err.statusCode = 400
            throw err
          }

          const stock = stockRows[0]
          const currentOnHand = parseInt(stock.on_hand || 0, 10)
          const reserved = parseInt(stock.reserved || 0, 10)

          if (currentOnHand < qty) {
            const err = new Error(
              `Cannot approve purchase return: Insufficient stock on hand for "${item.product}" at branch ${ret.branch}. Current on-hand is ${currentOnHand}, requested return is ${qty}.`
            )
            err.statusCode = 400
            throw err
          }

          const newOnHand = currentOnHand - qty
          const newAvailable = Math.max(0, newOnHand - reserved)

          // Deduct inventory
          await conn.execute(
            'UPDATE `inventory_stock` SET `on_hand` = ?, `available` = ?, `updated_at` = NOW() WHERE `id` = ?',
            [newOnHand, newAvailable, stock.id]
          )

          // Append Stock Movements audit entry
          const movementNumber = `MOV-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`
          await conn.execute(
            `INSERT INTO \`stock_movements\` (
              \`movement_number\`, \`reference_type\`, \`reference_id\`, \`product_id\`, \`product_name\`,
              \`unit_id\`, \`branch_id\`, \`branch\`, \`quantity\`, \`on_hand_before\`, \`on_hand_after\`,
              \`user\`, \`reason\`, \`notes\`
            ) VALUES (?, 'RETURN', ?, ?, ?, NULL, ?, ?, ?, ?, ?, ?, 'Purchase Return to Vendor', ?)`,
            [
              movementNumber,
              ret.return_number,
              item.product_id,
              item.product,
              ret.branch_id,
              ret.branch,
              -qty,
              currentOnHand,
              newOnHand,
              user.name || 'Store Lead',
              `Purchase return ${ret.return_number} to ${ret.supplier}. Reason: ${ret.reason}`
            ]
          )

          // If serialized unit exists, update status
          if (item.unit_id || item.serial_number) {
            await conn.execute(
              `UPDATE \`serialized_units\` SET
                \`status\` = 'Returned to Vendor',
                \`status_class\` = 'bg-gray-100 text-gray-600',
                \`location\` = 'Returned to Supplier',
                \`condition_status\` = 'Defective/Returned',
                \`updated_at\` = NOW()
              WHERE \`unit_id\` = ? OR \`serial_number\` = ?`,
              [item.unit_id || item.serial_number, item.serial_number || item.unit_id]
            )
          }
        }
      }

      // 4. Create Vendor Debit Note & Safely Reconcile against Eligible Bill
      const totalCredit = parseFloat(ret.total_credit_amount || 0)

      const [maxDebitRows] = await conn.execute('SELECT debit_note_number FROM `vendor_debit_notes` ORDER BY id DESC LIMIT 5')
      let maxDebitNum = 40
      maxDebitRows.forEach(r => {
        const match = String(r.debit_note_number || '').match(/VDN-(\d+)/i)
        if (match) {
          const n = parseInt(match[1], 10)
          if (n > maxDebitNum) maxDebitNum = n
        }
      })
      const debitNoteNumber = `VDN-0${maxDebitNum + 1}`

      // Look up eligible unpaid/partially paid vendor bill linked to PO or Receipt
      let matchedBill = null
      if (ret.po_id || ret.po_number || ret.receipt_id) {
        const [billRows] = await conn.execute(
          `SELECT * FROM \`vendor_bills\` 
           WHERE (\`po_id\` = ? OR \`po_number\` = ? OR \`receipt_id\` = ?) AND \`outstanding_amount\` > 0 
           ORDER BY \`due_date\` ASC LIMIT 1 FOR UPDATE`,
          [ret.po_id || '', ret.po_number || '', ret.receipt_id || '']
        )
        if (billRows.length > 0) matchedBill = billRows[0]
      }

      let appliedCredit = 0.0
      let remainingCredit = totalCredit
      let debitStatus = 'Applied'
      let debitStatusClass = 'bg-[#eff6ff] text-[#2563eb]'
      let linkedBillId = null

      if (matchedBill) {
        linkedBillId = matchedBill.id
        const billOutstanding = parseFloat(matchedBill.outstanding_amount || 0)
        appliedCredit = Math.min(billOutstanding, totalCredit)
        const newBillOutstanding = Math.max(0, billOutstanding - appliedCredit)
        remainingCredit = Math.max(0, totalCredit - appliedCredit)

        // Status distinction: Never mark 'Paid' merely because of debit note credit!
        let newBillStatus = matchedBill.status
        let newBillStatusClass = matchedBill.status_class

        if (newBillOutstanding === 0) {
          const paidAmt = parseFloat(matchedBill.paid_amount || 0)
          if (paidAmt > 0) {
            newBillStatus = 'Paid/Adjusted'
            newBillStatusClass = 'bg-teal-50 text-teal-700'
          } else {
            newBillStatus = 'Credited'
            newBillStatusClass = 'bg-indigo-50 text-indigo-700'
          }
        } else {
          newBillStatus = 'Partially Credited'
          newBillStatusClass = 'bg-blue-50 text-blue-700'
        }

        // Update vendor bill
        await conn.execute(
          'UPDATE `vendor_bills` SET `outstanding_amount` = ?, `status` = ?, `status_class` = ?, `updated_at` = NOW() WHERE `id` = ?',
          [newBillOutstanding, newBillStatus, newBillStatusClass, matchedBill.id]
        )

        if (remainingCredit > 0) {
          debitStatus = 'Partially Applied'
          debitStatusClass = 'bg-amber-50 text-amber-700'
        } else {
          debitStatus = 'Applied'
          debitStatusClass = 'bg-[#eff6ff] text-[#2563eb]'
        }
      } else {
        // No eligible bill with outstanding balance: Debit Note remains as Open Credit
        appliedCredit = 0.0
        remainingCredit = totalCredit
        debitStatus = 'Open Credit'
        debitStatusClass = 'bg-emerald-50 text-emerald-700'
      }

      // Insert Vendor Debit Note
      await conn.execute(
        `INSERT INTO \`vendor_debit_notes\` (
          \`id\`, \`debit_note_number\`, \`return_id\`, \`return_number\`, \`supplier_id\`, \`supplier\`,
          \`vendor_bill_id\`, \`branch_id\`, \`branch\`, \`amount\`, \`applied_amount\`, \`remaining_credit\`,
          \`status\`, \`status_class\`, \`notes\`
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          debitNoteNumber,
          debitNoteNumber,
          ret.id,
          ret.return_number,
          ret.supplier_id,
          ret.supplier,
          linkedBillId,
          ret.branch_id,
          ret.branch,
          totalCredit,
          appliedCredit,
          remainingCredit,
          debitStatus,
          debitStatusClass,
          `Vendor Debit Note for Purchase Return ${ret.return_number}`
        ]
      )

      // 5. Transition Purchase Return State to Approved
      const approvedBy = user.name || 'Super Admin'
      await conn.execute(
        `UPDATE \`purchase_returns\` SET
          \`status\` = 'Approved',
          \`status_class\` = 'bg-[#dcfce7] text-[#165A31]',
          \`approved_by\` = ?,
          \`updated_at\` = NOW()
        WHERE \`id\` = ?`,
        [approvedBy, ret.id]
      )

      approvedReturnId = ret.id
    })

    return await this.findPurchaseReturnById(approvedReturnId)
  },

  /**
   * Retrieve all Vendor Debit Notes
   */
  async findAllVendorDebitNotes({ status, supplier_id, branch_id, return_id } = {}) {
    let sql = 'SELECT * FROM `vendor_debit_notes` WHERE 1=1'
    const params = []

    if (status && status !== 'All' && status !== 'all') {
      sql += ' AND LOWER(status) = LOWER(?)'
      params.push(status)
    }

    if (branch_id && branch_id !== 'all' && branch_id !== 'BR-01' && branch_id !== 'HQ') {
      sql += ' AND branch_id = ?'
      params.push(branch_id)
    }

    if (supplier_id) {
      sql += ' AND supplier_id = ?'
      params.push(supplier_id)
    }

    if (return_id) {
      sql += ' AND (return_id = ? OR return_number = ?)'
      params.push(return_id, return_id)
    }

    sql += ' ORDER BY created_at DESC'
    const rows = await query(sql, params)
    return rows.map(formatVendorDebitNoteRow)
  }
}

export default ProcurementModel
