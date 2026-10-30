import { query, withTransaction } from '../config/db.js'
import { InventoryModel } from './inventory.model.js'

/**
 * Normalizes a database order item row into frontend camelCase structure
 */
export function formatOrderItemRow(row) {
  if (!row) return null
  const qty = parseInt(row.quantity || 1, 10)
  const price = parseFloat(row.unit_price || 0)
  const subtotal = parseFloat(row.subtotal || qty * price)

  return {
    id: row.id,
    order_id: row.order_id,
    product: row.product,
    product_id: row.product_id || null,
    quantity: qty,
    unitPrice: price,
    sellingPrice: price,
    subtotal: subtotal,
    warranty: row.warranty || '1-Year Standard Service',
    notes: row.notes || ''
  }
}

/**
 * Normalizes a database order row and its items into frontend camelCase contract
 */
export function formatOrderRow(row, items = []) {
  if (!row) return null

  const subtotal = parseFloat(row.subtotal || 0)
  const discount = parseFloat(row.discount || 0)
  const total = parseFloat(row.total || Math.max(0, subtotal - discount))
  const paid = parseFloat(row.paid || 0)
  const balance = parseFloat(row.balance !== null && row.balance !== undefined ? row.balance : Math.max(0, total - paid))

  const subtotalStr = `PKR ${subtotal.toLocaleString()}`
  const discountStr = `PKR ${discount.toLocaleString()}`
  const totalStr = `PKR ${total.toLocaleString()}`
  const paidStr = `PKR ${paid.toLocaleString()}`
  const balanceStr = `PKR ${balance.toLocaleString()}`

  const defaultStatusClass = row.status === 'Completed' || row.status === 'Ready'
    ? 'bg-[#dcfce7] text-[#165A31]'
    : (row.status === 'Processing' || row.status === 'Confirmed'
      ? 'bg-[#eff6ff] text-[#2563eb]'
      : (row.status === 'Cancelled' ? 'bg-red-50 text-red-700' : 'bg-gray-100 text-gray-700'))

  return {
    id: row.id,
    order: row.order_number || row.id,
    order_id: row.id,
    orderNo: row.order_number || row.id,
    quotation_id: row.quotation_id || null,
    quotationId: row.quotation_id || null,
    customer: row.customer_name,
    customer_id: row.customer_id,
    branch: row.branch,
    branch_id: row.branch_id,
    branchId: row.branch_id,
    branchName: row.branch,
    product: row.product || (items[0]?.product) || 'Standard Unit',
    product_id: row.product_id || (items[0]?.product_id) || null,
    unit: row.unit || 'To be allocated',
    unit_id: row.unit_id || null,
    items: items.map(formatOrderItemRow),
    subtotal: subtotalStr,
    rawSubtotal: subtotal,
    discount: discountStr,
    rawDiscount: discount,
    total: totalStr,
    rawTotal: total,
    amount: totalStr,
    paid: paidStr,
    rawPaid: paid,
    balance: balanceStr,
    rawBalance: balance,
    paymentMethod: row.payment_method || 'Bank Transfer',
    transactionId: row.transaction_id || '',
    bankAccount: row.bank_account || '',
    status: row.status || 'Processing',
    statusClass: row.status_class || defaultStatusClass,
    statusColor: row.status_class || defaultStatusClass,
    delivery: row.delivery || 'Pending',
    salesperson: row.salesperson || 'Hamza Ali',
    operator: row.salesperson || 'Hamza Ali',
    processedBy: row.salesperson || 'Hamza Ali',
    notes: row.notes || '',
    createdAt: row.created_at ? new Date(row.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : new Date().toISOString()
  }
}

export const OrderModel = {
  /**
   * Find all orders with optional branch, status, search, and pagination
   */
  async findAll({ branch_id, status, search, limit = 100, offset = 0 } = {}) {
    let sql = 'SELECT * FROM `orders` WHERE 1=1'
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
      sql += ' AND (`order_number` LIKE ? OR `customer_name` LIKE ? OR `product` LIKE ? OR `unit` LIKE ? OR `id` LIKE ?)'
      params.push(term, term, term, term, term)
    }

    sql += ' ORDER BY `created_at` DESC LIMIT ? OFFSET ?'
    params.push(parseInt(limit, 10), parseInt(offset, 10))

    const orderRows = await query(sql, params)
    if (orderRows.length === 0) return []

    // Fetch items for all retrieved orders
    const orderIds = orderRows.map(o => o.id)
    const placeholders = orderIds.map(() => '?').join(', ')
    const itemRows = await query(
      `SELECT * FROM \`order_items\` WHERE \`order_id\` IN (${placeholders}) ORDER BY \`id\` ASC`,
      orderIds
    )

    const itemsByOrderId = {}
    for (const item of itemRows) {
      if (!itemsByOrderId[item.order_id]) {
        itemsByOrderId[item.order_id] = []
      }
      itemsByOrderId[item.order_id].push(item)
    }

    return orderRows.map(row => formatOrderRow(row, itemsByOrderId[row.id] || []))
  },

  /**
   * Find a single order by ID or order number
   */
  async findById(idOrOrderNo) {
    if (!idOrOrderNo) return null
    const sql = 'SELECT * FROM `orders` WHERE `id` = ? OR `order_number` = ? LIMIT 1'
    const rows = await query(sql, [idOrOrderNo, idOrOrderNo])
    if (rows.length === 0) return null

    const order = rows[0]
    const itemRows = await query(
      'SELECT * FROM `order_items` WHERE `order_id` = ? ORDER BY `id` ASC',
      [order.id]
    )

    return formatOrderRow(order, itemRows)
  },

  /**
   * Find an order linked to a specific quotation
   */
  async findByQuotationId(quotationId) {
    if (!quotationId) return null
    const sql = 'SELECT * FROM `orders` WHERE `quotation_id` = ? LIMIT 1'
    const rows = await query(sql, [quotationId])
    if (rows.length === 0) return null

    const order = rows[0]
    const itemRows = await query(
      'SELECT * FROM `order_items` WHERE `order_id` = ? ORDER BY `id` ASC',
      [order.id]
    )

    return formatOrderRow(order, itemRows)
  },

  /**
   * Create a new sales order with authoritative server-calculated totals and line items
   */
  async create(data) {
    let id = data.id || data.order || data.order_id || data.orderNo
    if (!id) {
      let attempts = 0
      while (attempts < 15) {
        const candidate = `ORD-${Math.floor(2242 + Math.random() * 8000)}`
        const existing = await query('SELECT `id` FROM `orders` WHERE `id` = ? LIMIT 1', [candidate])
        if (existing.length === 0) {
          id = candidate
          break
        }
        attempts++
      }
      if (!id) id = `ORD-${Date.now().toString().slice(-6)}`
    }
    const orderNumber = data.orderNo || data.order || id
    const customerId = data.customer_id
    const customerName = data.customer || data.customer_name || 'Customer'
    const branchId = data.branch_id || data.branchId || 'BR-01'
    const branchName = data.branch || data.branchName || (branchId === 'BR-02' ? 'Islamabad' : (branchId === 'BR-03' ? 'Lahore' : 'Peshawar'))

    // 1. Process and validate line items on the server
    const rawItems = Array.isArray(data.items) && data.items.length > 0
      ? data.items
      : [{
          product: data.product || 'Standard Vehicle Unit',
          product_id: data.product_id || null,
          quantity: 1,
          sellingPrice: data.finalPrice || data.cataloguePrice || data.total || 0,
          warranty: data.warranty || '1-Year Standard Service',
          notes: data.unit ? `Unit: ${data.unit}` : ''
        }]

    const validatedItems = []
    let computedSubtotal = 0

    for (const item of rawItems) {
      const productName = (item.product || '').trim() || 'Standard Vehicle Unit'
      const qty = Math.max(1, parseInt(item.quantity, 10) || 1)
      const unitPrice = Math.max(0, parseFloat(String(
        item.unitPrice !== undefined ? item.unitPrice :
        (item.unit_price !== undefined ? item.unit_price :
        (item.sellingPrice !== undefined ? item.sellingPrice :
        (item.selling_price !== undefined ? item.selling_price :
        (item.price !== undefined ? item.price : 0))))
      ).replace(/[^0-9.]/g, '')) || 0)
      const lineSubtotal = qty * unitPrice

      computedSubtotal += lineSubtotal
      validatedItems.push({
        product: productName,
        product_id: item.product_id || null,
        quantity: qty,
        unit_price: unitPrice,
        subtotal: lineSubtotal,
        warranty: item.warranty || '1-Year Standard Service',
        notes: item.notes || null
      })
    }

    if (computedSubtotal === 0 && (data.subtotal !== undefined || data.rawSubtotal !== undefined || data.total !== undefined || data.amount !== undefined)) {
      computedSubtotal = Math.max(0, parseFloat(String(data.subtotal !== undefined ? data.subtotal : (data.rawSubtotal !== undefined ? data.rawSubtotal : (data.total !== undefined ? data.total : data.amount))).replace(/[^0-9.]/g, '')) || 0)
    }

    // 2. Authoritative server calculation of discount, total, paid, and balance
    const rawDiscount = Math.max(0, parseFloat(String(data.discount || data.rawDiscount || 0).replace(/[^0-9.]/g, '')) || 0)
    const computedTotal = Math.max(0, computedSubtotal - rawDiscount)
    const rawPaid = Math.max(0, parseFloat(String(data.paid || data.rawPaid || data.amountReceived || 0).replace(/[^0-9.]/g, '')) || 0)
    const computedBalance = Math.max(0, computedTotal - rawPaid)

    const summaryProduct = validatedItems[0]?.product || data.product || 'Standard Unit'
    const summaryProductId = validatedItems[0]?.product_id || data.product_id || null
    const unit = data.unit || data.selectedUnit || 'To be allocated'
    const unitId = (data.unit_id !== undefined && data.unit_id !== null)
      ? data.unit_id
      : ((data.selectedUnit && data.selectedUnit !== 'To be allocated') ? data.selectedUnit : null)

    const status = data.status || (computedBalance === 0 ? 'Ready' : 'Processing')
    const statusClass = data.statusClass || (computedBalance === 0
      ? 'bg-[#dcfce7] text-[#165A31]'
      : 'bg-[#eff6ff] text-[#2563eb]')

    return withTransaction(async (conn) => {
      const insertOrderSql = `
        INSERT INTO \`orders\` (
          \`id\`, \`order_number\`, \`quotation_id\`, \`customer_id\`, \`customer_name\`,
          \`branch_id\`, \`branch\`, \`product_id\`, \`product\`, \`unit_id\`, \`unit\`,
          \`subtotal\`, \`discount\`, \`total\`, \`paid\`, \`balance\`,
          \`payment_method\`, \`transaction_id\`, \`bank_account\`, \`status\`, \`status_class\`,
          \`delivery\`, \`salesperson\`, \`notes\`
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `

      const orderParams = [
        id,
        orderNumber,
        data.quotation_id || data.quotationId || null,
        customerId || null,
        customerName || 'Customer',
        branchId,
        branchName,
        summaryProductId || null,
        summaryProduct || 'Standard Unit',
        unitId || null,
        unit || 'To be allocated',
        computedSubtotal,
        rawDiscount,
        computedTotal,
        rawPaid,
        computedBalance,
        data.paymentMethod || 'Bank Transfer',
        data.transactionId || null,
        data.bankAccount || null,
        status,
        statusClass,
        data.delivery || (computedBalance === 0 ? 'Ready' : 'Pending'),
        data.salesperson || data.operator || data.processedBy || 'Hamza Ali',
        data.notes || null
      ]

      await conn.execute(insertOrderSql, orderParams)

      // Insert line items
      for (const it of validatedItems) {
        await conn.execute(
          `INSERT INTO \`order_items\` (
            \`order_id\`, \`product_id\`, \`product\`, \`quantity\`,
            \`unit_price\`, \`subtotal\`, \`warranty\`, \`notes\`
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            id,
            it.product_id || null,
            it.product || 'Standard Vehicle Unit',
            it.quantity || 1,
            it.unit_price || 0,
            it.subtotal || 0,
            it.warranty || '1-Year Standard Service',
            it.notes || null
          ]
        )
      }

      // If quotation was specified, update quotation status
      if (data.quotation_id || data.quotationId) {
        const qId = data.quotation_id || data.quotationId
        await conn.execute(
          `UPDATE \`quotations\` SET \`status\` = 'Accepted', \`status_class\` = 'bg-[#dcfce7] text-[#165A31]', \`sales_order_id\` = ? WHERE \`id\` = ?`,
          [id, qId]
        )
      }

      // Reserve inventory stock for ordered items
      await InventoryModel.reserveStockForOrder(
        conn,
        id,
        orderNumber,
        validatedItems,
        branchId,
        branchName,
        data.salesperson || 'Sales Staff'
      )

      // Query newly inserted order with items before commit
      const [orderRows] = await conn.execute('SELECT * FROM `orders` WHERE `id` = ?', [id])
      const [itemRows] = await conn.execute('SELECT * FROM `order_items` WHERE `order_id` = ? ORDER BY `id` ASC', [id])

      return formatOrderRow(orderRows[0], itemRows)
    })
  },

  /**
   * Update an existing sales order and recalculate financial balances
   */
  async update(idOrOrderNo, data) {
    const existing = await this.findById(idOrOrderNo)
    if (!existing) return null

    let computedSubtotal = existing.rawSubtotal
    let rawDiscount = existing.rawDiscount
    let rawPaid = existing.rawPaid

    return withTransaction(async (conn) => {
      // If line items updated, recalculate line items
      if (Array.isArray(data.items)) {
        computedSubtotal = 0
        const validatedItems = []

        for (const item of data.items) {
          const productName = (item.product || '').trim() || 'Standard Vehicle Unit'
          const qty = Math.max(1, parseInt(item.quantity, 10) || 1)
          const unitPrice = Math.max(0, parseFloat(String(
            item.unitPrice !== undefined ? item.unitPrice :
            (item.unit_price !== undefined ? item.unit_price :
            (item.sellingPrice !== undefined ? item.sellingPrice :
            (item.selling_price !== undefined ? item.selling_price :
            (item.price !== undefined ? item.price : 0))))
          ).replace(/[^0-9.]/g, '')) || 0)
          const lineSubtotal = qty * unitPrice

          computedSubtotal += lineSubtotal
          validatedItems.push({
            product: productName,
            product_id: item.product_id || null,
            quantity: qty,
            unit_price: unitPrice,
            subtotal: lineSubtotal,
            warranty: item.warranty || '1-Year Standard Service',
            notes: item.notes || null
          })
        }

        // Delete old and re-insert new items
        await conn.execute('DELETE FROM `order_items` WHERE `order_id` = ?', [existing.id])
        for (const it of validatedItems) {
          await conn.execute(
            `INSERT INTO \`order_items\` (
              \`order_id\`, \`product_id\`, \`product\`, \`quantity\`,
              \`unit_price\`, \`subtotal\`, \`warranty\`, \`notes\`
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              existing.id,
              it.product_id || null,
              it.product || 'Standard Vehicle Unit',
              it.quantity || 1,
              it.unit_price || 0,
              it.subtotal || 0,
              it.warranty || '1-Year Standard Service',
              it.notes || null
            ]
          )
        }
      }

      if (data.discount !== undefined || data.rawDiscount !== undefined) {
        rawDiscount = Math.max(0, parseFloat(String(data.discount !== undefined ? data.discount : data.rawDiscount).replace(/[^0-9.]/g, '')) || 0)
      }

      const computedTotal = Math.max(0, computedSubtotal - rawDiscount)

      if (data.paid !== undefined || data.rawPaid !== undefined || data.amountReceived !== undefined) {
        const pVal = data.paid !== undefined ? data.paid : (data.rawPaid !== undefined ? data.rawPaid : data.amountReceived)
        rawPaid = Math.max(0, parseFloat(String(pVal).replace(/[^0-9.]/g, '')) || 0)
      }

      const computedBalance = Math.max(0, computedTotal - rawPaid)

      const updates = []
      const params = []

      const fieldMap = {
        customer: 'customer_name',
        customer_id: 'customer_id',
        branch: 'branch',
        branch_id: 'branch_id',
        product: 'product',
        product_id: 'product_id',
        unit: 'unit',
        unit_id: 'unit_id',
        paymentMethod: 'payment_method',
        transactionId: 'transaction_id',
        bankAccount: 'bank_account',
        status: 'status',
        statusClass: 'status_class',
        delivery: 'delivery',
        salesperson: 'salesperson',
        notes: 'notes'
      }

      for (const [key, col] of Object.entries(fieldMap)) {
        if (data[key] !== undefined) {
          updates.push(`\`${col}\` = ?`)
          params.push(data[key] === undefined || data[key] === null ? null : data[key])
        }
      }

      // Always update server-calculated financials
      updates.push('`subtotal` = ?', '`discount` = ?', '`total` = ?', '`paid` = ?', '`balance` = ?')
      params.push(computedSubtotal, rawDiscount, computedTotal, rawPaid, computedBalance)

      params.push(existing.id)
      const sql = `UPDATE \`orders\` SET ${updates.join(', ')} WHERE \`id\` = ?`
      await conn.execute(sql, params)

      const [orderRows] = await conn.execute('SELECT * FROM `orders` WHERE `id` = ?', [existing.id])
      const [itemRows] = await conn.execute('SELECT * FROM `order_items` WHERE `order_id` = ? ORDER BY `id` ASC', [existing.id])

      return formatOrderRow(orderRows[0], itemRows)
    })
  },

  /**
   * Cancel an order safely
   */
  async cancel(idOrOrderNo) {
    const existing = await this.findById(idOrOrderNo)
    if (!existing) return null

    if (existing.status === 'Delivered' || existing.status === 'Completed') {
      const err = new Error(`Order ${existing.order} is already ${existing.status} and cannot be cancelled.`)
      err.code = 'CANNOT_CANCEL_DELIVERED_ORDER'
      err.statusCode = 400
      throw err
    }

    return withTransaction(async (conn) => {
      await conn.execute(
        `UPDATE \`orders\` SET \`status\` = 'Cancelled', \`status_class\` = 'bg-red-50 text-red-700' WHERE \`id\` = ?`,
        [existing.id]
      )
      await InventoryModel.releaseStockForOrder(conn, existing.id, existing.order, existing.branch_id, existing.branch, 'System')
      const [orderRows] = await conn.execute('SELECT * FROM `orders` WHERE `id` = ?', [existing.id])
      const [itemRows] = await conn.execute('SELECT * FROM `order_items` WHERE `order_id` = ? ORDER BY `id` ASC', [existing.id])
      return formatOrderRow(orderRows[0], itemRows)
    })
  },

  /**
   * Atomic ACID Quotation-to-Order Conversion with Duplicate Prevention
   */
  async convertFromQuotation(quotationId, { unit_id, salesperson, customOrderId, paymentMethod } = {}) {
    return withTransaction(async (conn) => {
      // 1. Lock quotation record exclusively for update
      const [quoteRows] = await conn.execute(
        'SELECT * FROM `quotations` WHERE `id` = ? OR `quote_number` = ? FOR UPDATE',
        [quotationId, quotationId]
      )

      if (quoteRows.length === 0) {
        const err = new Error(`Quotation '${quotationId}' was not found.`)
        err.statusCode = 404
        err.code = 'NOT_FOUND'
        throw err
      }

      const quote = quoteRows[0]

      // 2. Strict duplicate conversion check
      if (quote.sales_order_id) {
        const err = new Error(`Quotation '${quote.quote_number || quote.id}' has already been converted to Sales Order '${quote.sales_order_id}'. Duplicate conversion is forbidden.`)
        err.statusCode = 409
        err.code = 'DUPLICATE_CONVERSION'
        throw err
      }

      // Check if any order in orders table already references this quotation
      const [existingLinkedOrders] = await conn.execute(
        'SELECT `id`, `order_number` FROM `orders` WHERE `quotation_id` = ?',
        [quote.id]
      )
      if (existingLinkedOrders.length > 0) {
        const existingOrder = existingLinkedOrders[0]
        // Ensure quotation record is kept in sync
        await conn.execute(
          'UPDATE `quotations` SET `sales_order_id` = ?, `status` = "Accepted" WHERE `id` = ?',
          [existingOrder.id, quote.id]
        )
        const err = new Error(`Quotation '${quote.quote_number || quote.id}' is already linked to Sales Order '${existingOrder.order_number}'. Duplicate conversion is forbidden.`)
        err.statusCode = 409
        err.code = 'DUPLICATE_CONVERSION'
        throw err
      }

      // 3. Fetch quotation line items
      const [itemRows] = await conn.execute(
        'SELECT * FROM `quotation_items` WHERE `quotation_id` = ? ORDER BY `id` ASC',
        [quote.id]
      )

      // 4. Generate order ID
      let orderId = customOrderId
      if (!orderId) {
        let attempts = 0
        while (attempts < 15) {
          const candidate = `ORD-${Math.floor(2242 + Math.random() * 8000)}`
          const [chk] = await conn.execute('SELECT `id` FROM `orders` WHERE `id` = ? LIMIT 1', [candidate])
          if (chk.length === 0) {
            orderId = candidate
            break
          }
          attempts++
        }
        if (!orderId) orderId = `ORD-${Date.now().toString().slice(-6)}`
      }

      let subtotal = parseFloat(quote.subtotal || 0)
      const discount = parseFloat(quote.discount || 0)
      let total = parseFloat(quote.total || 0)

      if (subtotal === 0 && itemRows.length > 0) {
        subtotal = itemRows.reduce((acc, it) => acc + (parseFloat(it.subtotal || 0)), 0)
      }
      if (total === 0 && subtotal > 0) {
        total = Math.max(0, subtotal - discount)
      }
      const paid = 0
      const balance = total
      const unit = unit_id || 'To be allocated'

      // 5. Insert new sales order
      await conn.execute(
        `INSERT INTO \`orders\` (
          \`id\`, \`order_number\`, \`quotation_id\`, \`customer_id\`, \`customer_name\`,
          \`branch_id\`, \`branch\`, \`product_id\`, \`product\`, \`unit_id\`, \`unit\`,
          \`subtotal\`, \`discount\`, \`total\`, \`paid\`, \`balance\`,
          \`payment_method\`, \`status\`, \`status_class\`, \`delivery\`, \`salesperson\`, \`notes\`
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          orderId,
          orderId,
          quote.id,
          quote.customer_id,
          quote.customer_name,
          quote.branch_id,
          quote.branch,
          quote.product_id,
          quote.product,
          unit_id || null,
          unit,
          subtotal,
          discount,
          total,
          paid,
          balance,
          paymentMethod || 'Bank Transfer',
          'Processing',
          'bg-[#eff6ff] text-[#2563eb]',
          'Pending',
          salesperson || 'Hamza Ali',
          `Converted from Quotation ${quote.quote_number || quote.id}`
        ]
      )

      // 6. Copy quotation items to order_items
      if (itemRows.length > 0) {
        for (const item of itemRows) {
          await conn.execute(
            `INSERT INTO \`order_items\` (
              \`order_id\`, \`product_id\`, \`product\`, \`quantity\`,
              \`unit_price\`, \`subtotal\`, \`warranty\`, \`notes\`
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              orderId,
              item.product_id,
              item.product,
              item.quantity,
              item.selling_price,
              item.subtotal,
              item.warranty,
              item.notes
            ]
          )
        }
      } else {
        await conn.execute(
          `INSERT INTO \`order_items\` (
            \`order_id\`, \`product_id\`, \`product\`, \`quantity\`,
            \`unit_price\`, \`subtotal\`, \`warranty\`, \`notes\`
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            orderId,
            quote.product_id,
            quote.product || 'Standard Vehicle',
            1,
            total,
            total,
            '1-Year Standard Service',
            ''
          ]
        )
      }

      // 7. Update quotation record: link order ID and mark status Accepted
      await conn.execute(
        `UPDATE \`quotations\` SET
          \`status\` = 'Accepted',
          \`status_class\` = 'bg-[#dcfce7] text-[#165A31]',
          \`sales_order_id\` = ?
         WHERE \`id\` = ?`,
        [orderId, quote.id]
      )

      // Reserve inventory stock for the converted quotation line items
      const itemsToReserve = itemRows.length > 0 ? itemRows : [{ product_id: quote.product_id, product: quote.product, quantity: 1 }]
      await InventoryModel.reserveStockForOrder(conn, orderId, orderId, itemsToReserve, quote.branch_id, quote.branch, salesperson || 'Hamza Ali')

      // 8. Fetch newly created order to return
      const [newOrderRows] = await conn.execute('SELECT * FROM `orders` WHERE `id` = ?', [orderId])
      const [newOrderItems] = await conn.execute('SELECT * FROM `order_items` WHERE `order_id` = ? ORDER BY `id` ASC', [orderId])

      return {
        order: formatOrderRow(newOrderRows[0], newOrderItems),
        orderId,
        quotationId: quote.id
      }
    })
  },

  /**
   * Delete order safely (only if not active with payments)
   */
  async delete(idOrOrderNo) {
    const existing = await this.findById(idOrOrderNo)
    if (!existing) return null

    if (existing.rawPaid > 0 || existing.status === 'Delivered' || existing.status === 'Completed') {
      const err = new Error(`Cannot delete order ${existing.order} because it has recorded payments of ${existing.paid} and active fulfillment state.`)
      err.code = 'CANNOT_DELETE_ACTIVE_ORDER'
      err.statusCode = 400
      throw err
    }

    await query('DELETE FROM `orders` WHERE `id` = ?', [existing.id])
    return existing
  }
}
