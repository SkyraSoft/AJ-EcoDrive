import { query, withTransaction } from '../config/db.js'

/**
 * Normalizes an invoice item database row into frontend contract
 */
export function formatInvoiceItemRow(row) {
  if (!row) return null
  const qty = parseInt(row.quantity || 1, 10)
  const price = parseFloat(row.unit_price || 0)
  const subtotal = parseFloat(row.subtotal !== undefined && row.subtotal !== null ? row.subtotal : qty * price)

  return {
    id: row.id,
    invoice_id: row.invoice_id,
    product_id: row.product_id || null,
    description: row.description || 'Product Item',
    item: row.description || 'Product Item',
    quantity: qty,
    qty: qty,
    unitPrice: price,
    price: price,
    rate: price,
    subtotal: subtotal,
    total: subtotal
  }
}

/**
 * Normalizes an invoice database row and its items/payments into frontend contract
 */
export function formatInvoiceRow(row, items = [], payments = []) {
  if (!row) return null

  const subtotal = parseFloat(row.subtotal || 0)
  const discount = parseFloat(row.discount || 0)
  const tax = parseFloat(row.tax || 0)
  const total = parseFloat(row.total !== undefined && row.total !== null ? row.total : Math.max(0, subtotal - discount + tax))
  const paid = parseFloat(row.paid_amount || 0)
  const outstanding = parseFloat(row.outstanding_amount !== undefined && row.outstanding_amount !== null ? row.outstanding_amount : Math.max(0, total - paid))

  const totalStr = `PKR ${total.toLocaleString()}`
  const subtotalStr = `PKR ${subtotal.toLocaleString()}`
  const balanceStr = `PKR ${outstanding.toLocaleString()}`
  const paidStr = `PKR ${paid.toLocaleString()}`

  const defaultStatusClass = row.status === 'Paid'
    ? 'bg-[#dcfce7] text-[#165A31]'
    : (row.status === 'Partial'
      ? 'bg-[#fef3c7] text-[#b45309]'
      : (row.status === 'Overdue'
        ? 'bg-red-50 text-red-600'
        : 'bg-yellow-50 text-yellow-700'))

  return {
    id: row.id,
    invoice: row.invoice_number || row.id,
    invoice_id: row.id,
    invoiceNo: row.invoice_number || row.id,
    order_id: row.order_id || null,
    order: row.order_number || row.order_id || null,
    orderNo: row.order_number || row.order_id || null,
    customer: row.customer_name,
    customer_id: row.customer_id,
    customer_name: row.customer_name,
    branch: row.branch,
    branch_id: row.branch_id,
    branchId: row.branch_id,
    branchName: row.branch,
    subtotal: subtotal,
    rawSubtotal: subtotal,
    subtotalFormatted: subtotalStr,
    discount: discount,
    rawDiscount: discount,
    tax: tax,
    rawTax: tax,
    total: total,
    rawTotal: total,
    amount: totalStr,
    paidAmount: paid,
    rawPaid: paid,
    outstandingAmount: outstanding,
    rawBalance: outstanding,
    status: row.status || (outstanding === 0 ? 'Paid' : (paid > 0 ? 'Partial' : 'Unpaid')),
    paymentStatus: row.status || (outstanding === 0 ? 'Paid' : (paid > 0 ? 'Partial' : 'Unpaid')),
    statusClass: row.status_class || defaultStatusClass,
    statusColor: row.status_class || defaultStatusClass,
    date: row.issued_date ? new Date(row.issued_date).toISOString().split('T')[0] : 'Today',
    issued: row.issued_date ? new Date(row.issued_date).toISOString().split('T')[0] : 'Today',
    dueDate: row.due_date ? new Date(row.due_date).toISOString().split('T')[0] : null,
    notes: row.notes || '',
    items: items.map(formatInvoiceItemRow),
    payments: payments,
    createdAt: row.created_at ? new Date(row.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : new Date().toISOString()
  }
}

export const InvoiceModel = {
  /**
   * Find all invoices with optional branch, status, customer, order, search, pagination
   */
  async findAll({ branch_id, status, customer_id, order_id, search, limit = 100, offset = 0 } = {}) {
    let sql = 'SELECT * FROM `invoices` WHERE 1=1'
    const params = []

    if (branch_id && branch_id !== 'ALL' && branch_id !== 'All Branches') {
      sql += ' AND (`branch_id` = ? OR `branch` = ?)'
      params.push(branch_id, branch_id)
    }

    if (status && status !== 'All') {
      sql += ' AND `status` = ?'
      params.push(status)
    }

    if (customer_id) {
      sql += ' AND `customer_id` = ?'
      params.push(customer_id)
    }

    if (order_id) {
      sql += ' AND (`order_id` = ? OR `order_number` = ?)'
      params.push(order_id, order_id)
    }

    if (search && search.trim() !== '') {
      const term = `%${search.trim()}%`
      sql += ' AND (`invoice_number` LIKE ? OR `customer_name` LIKE ? OR `order_number` LIKE ? OR `id` LIKE ?)'
      params.push(term, term, term, term)
    }

    sql += ' ORDER BY `created_at` DESC LIMIT ? OFFSET ?'
    params.push(parseInt(limit, 10), parseInt(offset, 10))

    const invoiceRows = await query(sql, params)
    if (invoiceRows.length === 0) return []

    // Fetch items for all retrieved invoices
    const invoiceIds = invoiceRows.map(i => i.id)
    const placeholders = invoiceIds.map(() => '?').join(', ')
    const itemRows = await query(
      `SELECT * FROM \`invoice_items\` WHERE \`invoice_id\` IN (${placeholders}) ORDER BY \`id\` ASC`,
      invoiceIds
    )

    const itemsByInvoiceId = {}
    for (const item of itemRows) {
      if (!itemsByInvoiceId[item.invoice_id]) {
        itemsByInvoiceId[item.invoice_id] = []
      }
      itemsByInvoiceId[item.invoice_id].push(item)
    }

    return invoiceRows.map(row => formatInvoiceRow(row, itemsByInvoiceId[row.id] || []))
  },

  /**
   * Find a single invoice by ID or invoice number, including items and recorded payments
   */
  async findById(idOrInvoiceNo) {
    if (!idOrInvoiceNo) return null
    const sql = 'SELECT * FROM `invoices` WHERE `id` = ? OR `invoice_number` = ? LIMIT 1'
    const rows = await query(sql, [idOrInvoiceNo, idOrInvoiceNo])
    if (rows.length === 0) return null

    const invoice = rows[0]
    const itemRows = await query(
      'SELECT * FROM `invoice_items` WHERE `invoice_id` = ? ORDER BY `id` ASC',
      [invoice.id]
    )
    const paymentRows = await query(
      'SELECT * FROM `payments` WHERE `invoice_id` = ? ORDER BY `created_at` DESC',
      [invoice.id]
    )

    return formatInvoiceRow(invoice, itemRows, paymentRows)
  },

  /**
   * Create an invoice with authoritative server calculation of financials and line items
   */
  async create(data) {
    let id = data.id || data.invoice || data.invoice_id || data.invoiceNo
    if (!id) {
      let attempts = 0
      while (attempts < 15) {
        const candidate = `INV-${Math.floor(4000 + Math.random() * 5999)}`
        const existing = await query('SELECT `id` FROM `invoices` WHERE `id` = ? LIMIT 1', [candidate])
        if (existing.length === 0) {
          id = candidate
          break
        }
        attempts++
      }
      if (!id) id = `INV-${Date.now().toString().slice(-6)}`
    }
    const invoiceNumber = data.invoiceNo || data.invoice || id
    const customerId = data.customer_id
    const customerName = data.customer || data.customer_name || 'Customer'
    const branchId = data.branch_id || data.branchId || 'BR-01'
    const branchName = data.branch || data.branchName || (branchId === 'BR-02' ? 'Islamabad' : (branchId === 'BR-03' ? 'Lahore' : 'Peshawar'))
    const orderId = data.order_id || data.order || data.orderNo || null
    const orderNumber = data.orderNo || data.order || data.order_id || null

    // 1. Process line items
    const rawItems = Array.isArray(data.items) && data.items.length > 0
      ? data.items
      : [{
          description: data.description || 'Commercial Vehicle / Service Sale',
          product_id: data.product_id || null,
          quantity: 1,
          unitPrice: data.total || data.amount || 0
        }]

    const validatedItems = []
    let computedSubtotal = 0

    for (const item of rawItems) {
      const desc = (item.description || item.item || item.product || 'Standard Product').trim()
      const qty = Math.max(1, parseInt(item.quantity !== undefined ? item.quantity : (item.qty || 1), 10) || 1)
      const unitPrice = Math.max(0, parseFloat(String(
        item.unitPrice !== undefined ? item.unitPrice :
        (item.unit_price !== undefined ? item.unit_price :
        (item.price !== undefined ? item.price :
        (item.sellingPrice !== undefined ? item.sellingPrice :
        (item.rate !== undefined ? item.rate : 0))))
      ).replace(/[^0-9.]/g, '')) || 0)
      const lineSubtotal = qty * unitPrice

      computedSubtotal += lineSubtotal
      validatedItems.push({
        description: desc,
        product_id: item.product_id || null,
        quantity: qty,
        unit_price: unitPrice,
        subtotal: lineSubtotal
      })
    }

    if (computedSubtotal === 0 && (data.subtotal !== undefined || data.rawSubtotal !== undefined || data.amount !== undefined)) {
      computedSubtotal = Math.max(0, parseFloat(String(data.subtotal !== undefined ? data.subtotal : (data.rawSubtotal !== undefined ? data.rawSubtotal : data.amount)).replace(/[^0-9.]/g, '')) || 0)
    }

    // 2. Authoritative server calculation of discount, tax, total, paid, and outstanding
    const rawDiscount = Math.max(0, parseFloat(String(data.discount || data.rawDiscount || 0).replace(/[^0-9.]/g, '')) || 0)
    const rawTax = Math.max(0, parseFloat(String(data.tax || data.rawTax || 0).replace(/[^0-9.]/g, '')) || 0)
    const computedTotal = Math.max(0, computedSubtotal - rawDiscount + rawTax)
    const rawPaid = Math.max(0, parseFloat(String(data.paidAmount !== undefined ? data.paidAmount : (data.paid || data.rawPaid || 0)).replace(/[^0-9.]/g, '')) || 0)
    const computedOutstanding = Math.max(0, computedTotal - rawPaid)

    const status = data.status || (computedOutstanding === 0 ? 'Paid' : (rawPaid > 0 ? 'Partial' : 'Unpaid'))
    const statusClass = status === 'Paid'
      ? 'bg-[#dcfce7] text-[#165A31]'
      : (status === 'Partial'
        ? 'bg-[#fef3c7] text-[#b45309]'
        : 'bg-yellow-50 text-yellow-700')

    const issuedDate = data.issued || data.date ? new Date().toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
    const dueDate = data.dueDate ? new Date(data.dueDate).toISOString().split('T')[0] : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

    return withTransaction(async (conn) => {
      const insertSql = `
        INSERT INTO \`invoices\` (
          \`id\`, \`invoice_number\`, \`order_id\`, \`order_number\`, \`customer_id\`, \`customer_name\`,
          \`branch_id\`, \`branch\`, \`subtotal\`, \`discount\`, \`tax\`, \`total\`,
          \`paid_amount\`, \`outstanding_amount\`, \`status\`, \`status_class\`,
          \`issued_date\`, \`due_date\`, \`notes\`
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `

      const params = [
        id,
        invoiceNumber,
        orderId || null,
        orderNumber || null,
        customerId || null,
        customerName || 'Customer',
        branchId,
        branchName,
        computedSubtotal,
        rawDiscount,
        rawTax,
        computedTotal,
        rawPaid,
        computedOutstanding,
        status,
        statusClass,
        issuedDate,
        dueDate,
        data.notes || null
      ]

      await conn.execute(insertSql, params)

      // Insert line items
      for (const it of validatedItems) {
        await conn.execute(
          `INSERT INTO \`invoice_items\` (
            \`invoice_id\`, \`product_id\`, \`description\`, \`quantity\`,
            \`unit_price\`, \`subtotal\`
          ) VALUES (?, ?, ?, ?, ?, ?)`,
          [
            id,
            it.product_id || null,
            it.description || 'Standard Product',
            it.quantity || 1,
            it.unit_price || 0,
            it.subtotal || 0
          ]
        )
      }

      // Query newly inserted invoice before commit
      const [invoiceRows] = await conn.execute('SELECT * FROM `invoices` WHERE `id` = ?', [id])
      const [itemRows] = await conn.execute('SELECT * FROM `invoice_items` WHERE `invoice_id` = ? ORDER BY `id` ASC', [id])

      return formatInvoiceRow(invoiceRows[0], itemRows, [])
    })
  },

  /**
   * Update an existing invoice and recalculate totals
   */
  async update(idOrInvoiceNo, data) {
    const existing = await this.findById(idOrInvoiceNo)
    if (!existing) return null

    let computedSubtotal = existing.rawSubtotal
    let rawDiscount = existing.rawDiscount
    let rawTax = existing.rawTax
    let rawPaid = existing.rawPaid

    return withTransaction(async (conn) => {
      // If line items updated, recalculate line items
      if (Array.isArray(data.items)) {
        computedSubtotal = 0
        const validatedItems = []

        for (const item of data.items) {
          const desc = (item.description || item.item || item.product || 'Standard Product').trim()
          const qty = Math.max(1, parseInt(item.quantity !== undefined ? item.quantity : (item.qty || 1), 10) || 1)
          const unitPrice = Math.max(0, parseFloat(String(
            item.unitPrice !== undefined ? item.unitPrice :
            (item.unit_price !== undefined ? item.unit_price :
            (item.price !== undefined ? item.price :
            (item.sellingPrice !== undefined ? item.sellingPrice :
            (item.rate !== undefined ? item.rate : 0))))
          ).replace(/[^0-9.]/g, '')) || 0)
          const lineSubtotal = qty * unitPrice

          computedSubtotal += lineSubtotal
          validatedItems.push({
            description: desc,
            product_id: item.product_id || null,
            quantity: qty,
            unit_price: unitPrice,
            subtotal: lineSubtotal
          })
        }

        // Delete old and re-insert new items
        await conn.execute('DELETE FROM `invoice_items` WHERE `invoice_id` = ?', [existing.id])
        for (const it of validatedItems) {
          await conn.execute(
            `INSERT INTO \`invoice_items\` (
              \`invoice_id\`, \`product_id\`, \`description\`, \`quantity\`,
              \`unit_price\`, \`subtotal\`
            ) VALUES (?, ?, ?, ?, ?, ?)`,
            [
              existing.id,
              it.product_id || null,
              it.description || 'Standard Product',
              it.quantity || 1,
              it.unit_price || 0,
              it.subtotal || 0
            ]
          )
        }
      }

      if (data.discount !== undefined || data.rawDiscount !== undefined) {
        rawDiscount = Math.max(0, parseFloat(String(data.discount !== undefined ? data.discount : data.rawDiscount).replace(/[^0-9.]/g, '')) || 0)
      }

      if (data.tax !== undefined || data.rawTax !== undefined) {
        rawTax = Math.max(0, parseFloat(String(data.tax !== undefined ? data.tax : data.rawTax).replace(/[^0-9.]/g, '')) || 0)
      }

      const computedTotal = Math.max(0, computedSubtotal - rawDiscount + rawTax)
      const computedOutstanding = Math.max(0, computedTotal - rawPaid)

      const status = data.status || (computedOutstanding === 0 ? 'Paid' : (rawPaid > 0 ? 'Partial' : 'Unpaid'))
      const statusClass = status === 'Paid'
        ? 'bg-[#dcfce7] text-[#165A31]'
        : (status === 'Partial'
          ? 'bg-[#fef3c7] text-[#b45309]'
          : 'bg-yellow-50 text-yellow-700')

      const updates = [
        '`subtotal` = ?',
        '`discount` = ?',
        '`tax` = ?',
        '`total` = ?',
        '`outstanding_amount` = ?',
        '`status` = ?',
        '`status_class` = ?'
      ]
      const params = [
        computedSubtotal,
        rawDiscount,
        rawTax,
        computedTotal,
        computedOutstanding,
        status,
        statusClass
      ]

      if (data.dueDate !== undefined) {
        updates.push('`due_date` = ?')
        params.push(data.dueDate ? new Date(data.dueDate).toISOString().split('T')[0] : null)
      }

      if (data.notes !== undefined) {
        updates.push('`notes` = ?')
        params.push(data.notes || null)
      }

      params.push(existing.id)
      const sql = `UPDATE \`invoices\` SET ${updates.join(', ')} WHERE \`id\` = ?`
      await conn.execute(sql, params)

      const [invoiceRows] = await conn.execute('SELECT * FROM `invoices` WHERE `id` = ?', [existing.id])
      const [itemRows] = await conn.execute('SELECT * FROM `invoice_items` WHERE `invoice_id` = ? ORDER BY `id` ASC', [existing.id])
      const [paymentRows] = await conn.execute('SELECT * FROM `payments` WHERE `invoice_id` = ? ORDER BY `created_at` DESC', [existing.id])

      return formatInvoiceRow(invoiceRows[0], itemRows, paymentRows)
    })
  },

  /**
   * Atomically records a payment against an invoice and updates both in a single ACID transaction
   */
  async recordPayment(invoiceId, paymentData) {
    return withTransaction(async (conn) => {
      // 1. Lock invoice row exclusively FOR UPDATE
      const [invoiceRows] = await conn.execute(
        'SELECT * FROM `invoices` WHERE `id` = ? OR `invoice_number` = ? FOR UPDATE',
        [invoiceId, invoiceId]
      )

      if (invoiceRows.length === 0) {
        const err = new Error(`Invoice '${invoiceId}' was not found.`)
        err.statusCode = 404
        err.code = 'NOT_FOUND'
        throw err
      }

      const invoice = invoiceRows[0]

      if (invoice.status === 'Cancelled') {
        const err = new Error(`Cannot record payment against cancelled invoice '${invoice.invoice_number}'.`)
        err.statusCode = 400
        err.code = 'INVOICE_CANCELLED'
        throw err
      }

      // 2. Validate payment amount
      const rawAmt = parseFloat(String(paymentData.amount || paymentData.rawAmount || 0).replace(/[^0-9.]/g, '')) || 0
      if (isNaN(rawAmt) || rawAmt <= 0) {
        const err = new Error('Payment amount must be greater than zero.')
        err.statusCode = 422
        err.code = 'INVALID_PAYMENT_AMOUNT'
        throw err
      }

      const currentOutstanding = parseFloat(invoice.outstanding_amount || 0)
      if (rawAmt > currentOutstanding) {
        const err = new Error(`Payment amount (PKR ${rawAmt.toLocaleString()}) cannot exceed invoice outstanding balance (PKR ${currentOutstanding.toLocaleString()}).`)
        err.statusCode = 400
        err.code = 'EXCESSIVE_PAYMENT_AMOUNT'
        throw err
      }

      // 3. Duplicate prevention: check transaction reference / idempotency
      let payId = paymentData.id || paymentData.payment || paymentData.payment_id
      if (!payId) {
        let attempts = 0
        while (attempts < 15) {
          const candidate = `PAY-${Math.floor(7800 + Math.random() * 2199)}`
          const [chk] = await conn.execute('SELECT `id` FROM `payments` WHERE `id` = ? LIMIT 1', [candidate])
          if (chk.length === 0) {
            payId = candidate
            break
          }
          attempts++
        }
        if (!payId) payId = `PAY-${Date.now().toString().slice(-6)}`
      }
      const paymentNumber = paymentData.paymentNo || payId
      const candidateRef = String(paymentData.transaction_ref || paymentData.transactionRef || paymentData.ref || '').trim()
      const txnRef = candidateRef || `TXN-${payId}`

      if (candidateRef) {
        const [existingPayments] = await conn.execute(
          'SELECT `id`, `payment_number` FROM `payments` WHERE `transaction_ref` = ? AND `invoice_id` = ?',
          [candidateRef, invoice.id]
        )
        if (existingPayments.length > 0) {
          const err = new Error(`A payment with transaction reference '${candidateRef}' has already been processed for invoice '${invoice.invoice_number}'.`)
          err.statusCode = 409
          err.code = 'DUPLICATE_PAYMENT'
          throw err
        }
      }

      // 4. Calculate new invoice financial balance and status
      const currentPaid = parseFloat(invoice.paid_amount || 0)
      const newPaid = currentPaid + rawAmt
      const newOutstanding = Math.max(0, currentOutstanding - rawAmt)
      const isFullyPaid = newOutstanding === 0
      const newStatus = isFullyPaid ? 'Paid' : 'Partial'
      const newStatusClass = isFullyPaid ? 'bg-[#dcfce7] text-[#165A31]' : 'bg-[#fef3c7] text-[#b45309]'

      // 5. Insert payment record
      const insertPaymentSql = `
        INSERT INTO \`payments\` (
          \`id\`, \`payment_number\`, \`invoice_id\`, \`order_id\`, \`customer_id\`, \`customer_name\`,
          \`branch_id\`, \`branch\`, \`payment_method\`, \`amount\`, \`transaction_ref\`, \`bank_account\`,
          \`payment_date\`, \`status\`, \`status_class\`, \`notes\`
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `

      const paymentDate = paymentData.date ? new Date().toISOString().split('T')[0] : new Date().toISOString().split('T')[0]

      await conn.execute(insertPaymentSql, [
        payId,
        paymentNumber,
        invoice.id,
        invoice.order_id || null,
        invoice.customer_id,
        invoice.customer_name,
        invoice.branch_id,
        invoice.branch,
        paymentData.payment_method || paymentData.paymentMethod || paymentData.method || 'Bank Transfer',
        rawAmt,
        txnRef,
        paymentData.bank_account || paymentData.bankAccount || null,
        paymentDate,
        paymentData.status || 'Reconciled',
        paymentData.statusClass || 'bg-[#dcfce7] text-[#165A31]',
        paymentData.notes || null
      ])

      // 6. Update invoice counters and status
      await conn.execute(
        `UPDATE \`invoices\` SET
          \`paid_amount\` = ?,
          \`outstanding_amount\` = ?,
          \`status\` = ?,
          \`status_class\` = ?
         WHERE \`id\` = ?`,
        [newPaid, newOutstanding, newStatus, newStatusClass, invoice.id]
      )

      // 7. If invoice is linked to a sales order, update order counters in the same transaction
      if (invoice.order_id) {
        const [orderRows] = await conn.execute(
          'SELECT `id`, `total`, `paid`, `balance`, `status` FROM `orders` WHERE `id` = ? FOR UPDATE',
          [invoice.order_id]
        )
        if (orderRows.length > 0) {
          const ord = orderRows[0]
          const ordTotal = parseFloat(ord.total || 0)
          const ordPaid = parseFloat(ord.paid || 0) + rawAmt
          const ordBal = Math.max(0, ordTotal - ordPaid)
          const ordStatus = (ordBal === 0 && ord.status === 'Processing') ? 'Ready' : ord.status
          const ordStatusClass = ordBal === 0 ? 'bg-[#dcfce7] text-[#165A31]' : (ord.status === 'Processing' ? 'bg-[#eff6ff] text-[#2563eb]' : 'bg-gray-100 text-gray-700')

          await conn.execute(
            `UPDATE \`orders\` SET
              \`paid\` = ?,
              \`balance\` = ?,
              \`status\` = ?,
              \`status_class\` = ?
             WHERE \`id\` = ?`,
            [ordPaid, ordBal, ordStatus, ordStatusClass, ord.id]
          )
        }
      }

      // 8. Fetch updated invoice and payment before committing transaction
      const [updatedInvoiceRows] = await conn.execute('SELECT * FROM `invoices` WHERE `id` = ?', [invoice.id])
      const [itemRows] = await conn.execute('SELECT * FROM `invoice_items` WHERE `invoice_id` = ? ORDER BY `id` ASC', [invoice.id])
      const [allPaymentRows] = await conn.execute('SELECT * FROM `payments` WHERE `invoice_id` = ? ORDER BY `created_at` DESC', [invoice.id])
      const [newPaymentRows] = await conn.execute('SELECT * FROM `payments` WHERE `id` = ?', [payId])

      return {
        invoice: formatInvoiceRow(updatedInvoiceRows[0], itemRows, allPaymentRows),
        payment: newPaymentRows.length > 0 ? newPaymentRows[0] : null,
        paymentId: payId,
        amount: rawAmt,
        remainingBalance: newOutstanding
      }
    })
  },

  /**
   * Delete invoice safely (forbidden if payments recorded)
   */
  async delete(idOrInvoiceNo) {
    const existing = await this.findById(idOrInvoiceNo)
    if (!existing) return null

    if (existing.rawPaid > 0) {
      const err = new Error(`Cannot delete invoice ${existing.invoice} because recorded payments of PKR ${existing.paidAmount.toLocaleString()} exist.`)
      err.code = 'CANNOT_DELETE_PAID_INVOICE'
      err.statusCode = 400
      throw err
    }

    await query('DELETE FROM `invoices` WHERE `id` = ?', [existing.id])
    return existing
  }
}
