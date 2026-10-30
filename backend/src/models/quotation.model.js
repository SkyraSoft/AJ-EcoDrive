import { query } from '../config/db.js'

/**
 * Normalizes a database quotation item row into frontend camelCase structure
 */
export function formatQuotationItemRow(row) {
  if (!row) return null
  const qty = parseInt(row.quantity || 1, 10)
  const price = parseFloat(row.selling_price || 0)
  const subtotal = parseFloat(row.subtotal || qty * price)

  return {
    id: row.id,
    quotation_id: row.quotation_id,
    product: row.product,
    product_id: row.product_id || null,
    quantity: qty,
    sellingPrice: price,
    subtotal: subtotal,
    warranty: row.warranty || '1-Year Standard Service',
    notes: row.notes || ''
  }
}

/**
 * Normalizes a database quotation row and its items into frontend camelCase contract
 */
export function formatQuotationRow(row, items = []) {
  if (!row) return null

  const subtotal = parseFloat(row.subtotal || 0)
  const discount = parseFloat(row.discount || 0)
  const total = parseFloat(row.total || Math.max(0, subtotal - discount))

  const subtotalStr = `PKR ${subtotal.toLocaleString()}`
  const discountStr = `PKR ${discount.toLocaleString()}`
  const totalStr = `PKR ${total.toLocaleString()}`

  const defaultStatusClass = row.status === 'Accepted'
    ? 'bg-[#dcfce7] text-[#165A31]'
    : (row.status === 'Sent' ? 'bg-[#eff6ff] text-[#2563eb]' : 'bg-gray-100 text-gray-700')

  const totalQty = items.length > 0
    ? items.reduce((sum, it) => sum + (parseInt(it.quantity || 1, 10)), 0)
    : (parseInt(row.quantity || 1, 10) || 1)

  return {
    id: row.id,
    quote: row.quote_number || row.id,
    quote_id: row.id,
    customer: row.customer_name,
    customer_id: row.customer_id,
    branch: row.branch,
    branch_id: row.branch_id,
    branchId: row.branch_id,
    branchName: row.branch,
    product: row.product || (items[0]?.product) || 'Standard Unit',
    product_id: row.product_id || (items[0]?.product_id) || null,
    quantity: row.quantity || `${totalQty} unit${totalQty > 1 ? 's' : ''}`,
    items: items.map(formatQuotationItemRow),
    sellingPrice: subtotalStr,
    subtotal: subtotalStr,
    rawSubtotal: subtotal,
    discount: discountStr,
    rawDiscount: discount,
    total: totalStr,
    rawTotal: total,
    value: totalStr,
    amount: totalStr,
    validity: row.validity || '30 Days',
    validTill: row.validity || '30 Days',
    validUntil: row.validity || '30 Days',
    paymentTerms: row.payment_terms || '100% Advance / Bank Transfer',
    taxRegFees: row.tax_reg_fees || 'Included in Quote',
    deliveryLeadTime: row.delivery_lead_time || 'Within 3 business days',
    notes: row.notes || '',
    status: row.status || 'Draft',
    statusClass: row.status_class || defaultStatusClass,
    owner: row.owner || 'Hamza Ali',
    sales_order_id: row.sales_order_id || null,
    date: row.date || 'Today',
    createdAt: row.created_at ? new Date(row.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : new Date().toISOString()
  }
}

export const QuotationModel = {
  /**
   * Find all quotations with optional branch, status, search, and pagination
   */
  async findAll({ branch_id, status, search, limit = 100, offset = 0 } = {}) {
    let sql = 'SELECT * FROM `quotations` WHERE 1=1'
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
      sql += ' AND (`quote_number` LIKE ? OR `customer_name` LIKE ? OR `product` LIKE ? OR `id` LIKE ?)'
      params.push(term, term, term, term)
    }

    sql += ' ORDER BY `created_at` DESC LIMIT ? OFFSET ?'
    params.push(parseInt(limit, 10), parseInt(offset, 10))

    const quoteRows = await query(sql, params)
    if (quoteRows.length === 0) return []

    // Fetch items for all retrieved quotations
    const quoteIds = quoteRows.map(q => q.id)
    const placeholders = quoteIds.map(() => '?').join(', ')
    const itemRows = await query(
      `SELECT * FROM \`quotation_items\` WHERE \`quotation_id\` IN (${placeholders}) ORDER BY \`id\` ASC`,
      quoteIds
    )

    const itemsByQuoteId = {}
    for (const item of itemRows) {
      if (!itemsByQuoteId[item.quotation_id]) {
        itemsByQuoteId[item.quotation_id] = []
      }
      itemsByQuoteId[item.quotation_id].push(item)
    }

    return quoteRows.map(row => formatQuotationRow(row, itemsByQuoteId[row.id] || []))
  },

  /**
   * Find a single quotation by ID or quote number
   */
  async findById(idOrQuote) {
    if (!idOrQuote) return null
    const sql = 'SELECT * FROM `quotations` WHERE `id` = ? OR `quote_number` = ? LIMIT 1'
    const rows = await query(sql, [idOrQuote, idOrQuote])
    if (rows.length === 0) return null

    const quote = rows[0]
    const itemRows = await query(
      'SELECT * FROM `quotation_items` WHERE `quotation_id` = ? ORDER BY `id` ASC',
      [quote.id]
    )

    return formatQuotationRow(quote, itemRows)
  },

  /**
   * Create a new quotation with server-calculated totals and line items
   */
  async create(data) {
    let id = data.id || data.quote || data.quote_id
    if (!id) {
      let attempts = 0
      while (attempts < 15) {
        const candidate = `QT-${Math.floor(1885 + Math.random() * 8000)}`
        const existing = await query('SELECT `id` FROM `quotations` WHERE `id` = ? LIMIT 1', [candidate])
        if (existing.length === 0) {
          id = candidate
          break
        }
        attempts++
      }
      if (!id) id = `QT-${Date.now().toString().slice(-6)}`
    }
    const quoteNumber = data.quote || data.quote_id || id
    const customerId = data.customer_id
    const customerName = data.customer || data.customer_name || 'Customer'
    const branchId = data.branch_id || data.branchId || 'BR-01'
    const branchName = data.branch || data.branchName || (branchId === 'BR-02' ? 'Islamabad' : (branchId === 'BR-03' ? 'Lahore' : 'Peshawar'))

    // 1. Process and validate line items on the server
    const rawItems = Array.isArray(data.items) && data.items.length > 0 ? data.items : []
    const validatedItems = []
    let computedSubtotal = 0

    for (const item of rawItems) {
      const productName = (item.product || '').trim()
      const qty = Math.max(1, parseInt(item.quantity, 10) || 1)
      const unitPrice = Math.max(0, parseFloat(String(
        item.unitPrice !== undefined ? item.unitPrice :
        (item.unit_price !== undefined ? item.unit_price :
        (item.sellingPrice !== undefined ? item.sellingPrice :
        (item.selling_price !== undefined ? item.selling_price :
        (item.price !== undefined ? item.price : (item.rate || 0)))))
      ).replace(/[^0-9.]/g, '')) || 0)
      const lineSubtotal = qty * unitPrice

      computedSubtotal += lineSubtotal
      validatedItems.push({
        product: productName,
        product_id: item.product_id || null,
        quantity: qty,
        selling_price: unitPrice,
        subtotal: lineSubtotal,
        warranty: item.warranty || '1-Year Standard Service',
        notes: item.notes || null
      })
    }

    if (computedSubtotal === 0 && (data.subtotal !== undefined || data.rawSubtotal !== undefined || data.total !== undefined || data.amount !== undefined)) {
      computedSubtotal = Math.max(0, parseFloat(String(data.subtotal !== undefined ? data.subtotal : (data.rawSubtotal !== undefined ? data.rawSubtotal : (data.total !== undefined ? data.total : data.amount))).replace(/[^0-9.]/g, '')) || 0)
    }

    // 2. Compute discount and net total on server (never trust client total)
    const rawDiscount = Math.max(0, parseFloat(String(data.discount || data.rawDiscount || 0).replace(/[^0-9.]/g, '')) || 0)
    const computedTotal = Math.max(0, computedSubtotal - rawDiscount)

    // Summary product and quantity
    const totalQty = validatedItems.reduce((acc, curr) => acc + curr.quantity, 0)
    const summaryProduct = validatedItems[0]?.product || data.product || 'Standard Unit'
    const summaryProductId = validatedItems[0]?.product_id || data.product_id || null
    const summaryQty = `${totalQty} unit${totalQty > 1 ? 's' : ''}`

    const status = data.status || 'Draft'
    const statusClass = data.statusClass || (status === 'Accepted'
      ? 'bg-[#dcfce7] text-[#165A31]'
      : (status === 'Sent' ? 'bg-[#eff6ff] text-[#2563eb]' : 'bg-gray-100 text-gray-700'))

    const insertQuoteSql = `
      INSERT INTO \`quotations\` (
        \`id\`, \`quote_number\`, \`customer_id\`, \`customer_name\`,
        \`branch_id\`, \`branch\`, \`product_id\`, \`product\`, \`quantity\`,
        \`subtotal\`, \`discount\`, \`total\`, \`status\`, \`status_class\`,
        \`validity\`, \`payment_terms\`, \`tax_reg_fees\`, \`delivery_lead_time\`,
        \`notes\`, \`owner\`, \`sales_order_id\`, \`date\`
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `

    const quoteParams = [
      id,
      quoteNumber,
      customerId,
      customerName,
      branchId,
      branchName,
      summaryProductId,
      summaryProduct,
      summaryQty,
      computedSubtotal,
      rawDiscount,
      computedTotal,
      status,
      statusClass,
      data.validity || data.validTill || '30 Days',
      data.paymentTerms || '100% Advance / Bank Transfer',
      data.taxRegFees || 'Included in Quote',
      data.deliveryLeadTime || 'Within 3 business days',
      data.notes || null,
      data.owner || 'Hamza Ali',
      data.sales_order_id || null,
      data.date || 'Today'
    ]

    await query(insertQuoteSql, quoteParams)

    // Insert line items
    if (validatedItems.length > 0) {
      for (const it of validatedItems) {
        await query(
          `INSERT INTO \`quotation_items\` (
            \`quotation_id\`, \`product_id\`, \`product\`, \`quantity\`,
            \`selling_price\`, \`subtotal\`, \`warranty\`, \`notes\`
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [id, it.product_id, it.product, it.quantity, it.selling_price, it.subtotal, it.warranty, it.notes]
        )
      }
    }

    return this.findById(id)
  },

  /**
   * Update an existing quotation and recalculate totals
   */
  async update(idOrQuote, data) {
    const existing = await this.findById(idOrQuote)
    if (!existing) return null

    let computedSubtotal = existing.rawSubtotal
    let rawDiscount = existing.rawDiscount

    // If items are being updated, recalculate line items and subtotal
    if (Array.isArray(data.items)) {
      computedSubtotal = 0
      const validatedItems = []

      for (const item of data.items) {
        const productName = (item.product || '').trim()
        const qty = Math.max(1, parseInt(item.quantity, 10) || 1)
        const unitPrice = Math.max(0, parseFloat(String(
          item.unitPrice !== undefined ? item.unitPrice :
          (item.unit_price !== undefined ? item.unit_price :
          (item.sellingPrice !== undefined ? item.sellingPrice :
          (item.selling_price !== undefined ? item.selling_price :
          (item.price !== undefined ? item.price : (item.rate || 0)))))
        ).replace(/[^0-9.]/g, '')) || 0)
        const lineSubtotal = qty * unitPrice

        computedSubtotal += lineSubtotal
        validatedItems.push({
          product: productName,
          product_id: item.product_id || null,
          quantity: qty,
          selling_price: unitPrice,
          subtotal: lineSubtotal,
          warranty: item.warranty || '1-Year Standard Service',
          notes: item.notes || null
        })
      }

      // Replace existing items
      await query('DELETE FROM `quotation_items` WHERE `quotation_id` = ?', [existing.id])
      for (const it of validatedItems) {
        await query(
          `INSERT INTO \`quotation_items\` (
            \`quotation_id\`, \`product_id\`, \`product\`, \`quantity\`,
            \`selling_price\`, \`subtotal\`, \`warranty\`, \`notes\`
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [existing.id, it.product_id, it.product, it.quantity, it.selling_price, it.subtotal, it.warranty, it.notes]
        )
      }
    }

    if (data.discount !== undefined || data.rawDiscount !== undefined) {
      rawDiscount = Math.max(0, parseFloat(String(data.discount !== undefined ? data.discount : data.rawDiscount).replace(/[^0-9.]/g, '')) || 0)
    }

    const computedTotal = Math.max(0, computedSubtotal - rawDiscount)

    const updates = []
    const params = []

    const fieldMap = {
      customer: 'customer_name',
      customer_id: 'customer_id',
      branch: 'branch',
      branch_id: 'branch_id',
      product: 'product',
      product_id: 'product_id',
      validity: 'validity',
      paymentTerms: 'payment_terms',
      taxRegFees: 'tax_reg_fees',
      deliveryLeadTime: 'delivery_lead_time',
      notes: 'notes',
      status: 'status',
      statusClass: 'status_class',
      owner: 'owner',
      sales_order_id: 'sales_order_id',
      date: 'date'
    }

    for (const [key, col] of Object.entries(fieldMap)) {
      if (data[key] !== undefined) {
        updates.push(`\`${col}\` = ?`)
        params.push(data[key])
      }
    }

    // Always update server-calculated financial fields if items or discount changed
    updates.push('`subtotal` = ?', '`discount` = ?', '`total` = ?')
    params.push(computedSubtotal, rawDiscount, computedTotal)

    params.push(existing.id)
    const sql = `UPDATE \`quotations\` SET ${updates.join(', ')} WHERE \`id\` = ?`
    await query(sql, params)

    return this.findById(existing.id)
  },

  /**
   * Update quotation status (e.g. Sent, Accepted, Expired)
   */
  async updateStatus(idOrQuote, { status, statusClass, sales_order_id } = {}) {
    const existing = await this.findById(idOrQuote)
    if (!existing) return null

    const updates = ['`status` = ?']
    const params = [status]

    if (statusClass) {
      updates.push('`status_class` = ?')
      params.push(statusClass)
    } else {
      const defaultClass = status === 'Accepted'
        ? 'bg-[#dcfce7] text-[#165A31]'
        : (status === 'Sent' ? 'bg-[#eff6ff] text-[#2563eb]' : 'bg-gray-100 text-gray-700')
      updates.push('`status_class` = ?')
      params.push(defaultClass)
    }

    if (sales_order_id !== undefined) {
      updates.push('`sales_order_id` = ?')
      params.push(sales_order_id)
    }

    params.push(existing.id)
    await query(`UPDATE \`quotations\` SET ${updates.join(', ')} WHERE \`id\` = ?`, params)

    return this.findById(existing.id)
  },

  /**
   * Delete quotation safely
   */
  async delete(idOrQuote) {
    const existing = await this.findById(idOrQuote)
    if (!existing) return null

    // Business rule: Quotations linked to a sales order cannot be deleted
    if (existing.sales_order_id) {
      const err = new Error(`Cannot delete quotation ${existing.quote} because it is linked to Sales Order ${existing.sales_order_id}.`)
      err.code = 'CANNOT_DELETE_ACCEPTED_QUOTATION'
      err.statusCode = 400
      throw err
    }

    await query('DELETE FROM `quotations` WHERE `id` = ?', [existing.id])
    return existing
  }
}
