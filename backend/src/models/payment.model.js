import { query } from '../config/db.js'
import { InvoiceModel } from './invoice.model.js'

/**
 * Normalizes a payment database row into the frontend camelCase contract
 */
export function formatPaymentRow(row) {
  if (!row) return null
  const amt = parseFloat(row.amount || 0)
  const amtStr = `PKR ${amt.toLocaleString()}`

  return {
    id: row.id,
    payment: row.payment_number || row.id,
    payment_id: row.id,
    paymentNo: row.payment_number || row.id,
    invoice_id: row.invoice_id,
    invoiceNo: row.invoice_id,
    order_id: row.order_id || null,
    order: row.order_id || null,
    orderNo: row.order_id || null,
    customer_id: row.customer_id,
    customer: row.customer_name,
    customer_name: row.customer_name,
    branch_id: row.branch_id,
    branch: row.branch,
    branchId: row.branch_id,
    branchName: row.branch,
    method: row.payment_method,
    paymentMethod: row.payment_method,
    amount: amtStr,
    rawAmount: amt,
    transactionRef: row.transaction_ref || '',
    ref: row.transaction_ref || '',
    bankAccount: row.bank_account || '',
    date: row.payment_date ? new Date(row.payment_date).toISOString().split('T')[0] : 'Today',
    status: row.status || 'Reconciled',
    statusClass: row.status_class || 'bg-[#dcfce7] text-[#165A31]',
    notes: row.notes || '',
    createdAt: row.created_at ? new Date(row.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : new Date().toISOString()
  }
}

export const PaymentModel = {
  /**
   * Find all payments with optional branch, status, invoice, customer, order, search, pagination
   */
  async findAll({ branch_id, status, invoice_id, customer_id, order_id, search, limit = 100, offset = 0 } = {}) {
    let sql = 'SELECT * FROM `payments` WHERE 1=1'
    const params = []

    if (branch_id && branch_id !== 'ALL' && branch_id !== 'All Branches') {
      sql += ' AND (`branch_id` = ? OR `branch` = ?)'
      params.push(branch_id, branch_id)
    }

    if (status && status !== 'All') {
      sql += ' AND `status` = ?'
      params.push(status)
    }

    if (invoice_id) {
      sql += ' AND `invoice_id` = ?'
      params.push(invoice_id)
    }

    if (customer_id) {
      sql += ' AND `customer_id` = ?'
      params.push(customer_id)
    }

    if (order_id) {
      sql += ' AND `order_id` = ?'
      params.push(order_id)
    }

    if (search && search.trim() !== '') {
      const term = `%${search.trim()}%`
      sql += ' AND (`payment_number` LIKE ? OR `customer_name` LIKE ? OR `transaction_ref` LIKE ? OR `invoice_id` LIKE ? OR `id` LIKE ?)'
      params.push(term, term, term, term, term)
    }

    sql += ' ORDER BY `created_at` DESC LIMIT ? OFFSET ?'
    params.push(parseInt(limit, 10), parseInt(offset, 10))

    const rows = await query(sql, params)
    return rows.map(formatPaymentRow)
  },

  /**
   * Find a single payment by ID or payment number
   */
  async findById(idOrPaymentNo) {
    if (!idOrPaymentNo) return null
    const sql = 'SELECT * FROM `payments` WHERE `id` = ? OR `payment_number` = ? LIMIT 1'
    const rows = await query(sql, [idOrPaymentNo, idOrPaymentNo])
    if (rows.length === 0) return null
    return formatPaymentRow(rows[0])
  },

  /**
   * Record a payment (delegates to InvoiceModel.recordPayment if invoice_id is present)
   */
  async create(data) {
    if (data.invoice_id || data.invoiceId) {
      const invId = data.invoice_id || data.invoiceId
      const result = await InvoiceModel.recordPayment(invId, data)
      const paymentRow = await this.findById(result.paymentId)
      return {
        payment: paymentRow,
        invoice: result.invoice,
        amount: result.amount,
        remainingBalance: result.remainingBalance
      }
    }

    // Standalone payment without invoice
    const isExplicitId = Boolean(data.id || data.payment || data.payment_id || data.paymentNo)
    let id = data.id || data.payment || data.payment_id || data.paymentNo
    const customerId = data.customer_id
    const customerName = data.customer || data.customer_name || 'Customer'
    const branchId = data.branch_id || data.branchId || 'BR-01'
    const branchName = data.branch || data.branchName || (branchId === 'BR-02' ? 'Islamabad' : (branchId === 'BR-03' ? 'Lahore' : 'Peshawar'))
    const rawAmt = parseFloat(String(data.amount || data.rawAmount || 0).replace(/[^0-9.]/g, '')) || 0

    const maxAttempts = isExplicitId ? 1 : 5
    let lastErr = null

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      if (!isExplicitId) {
        let attempts = 0
        while (attempts < 15) {
          const candidate = `PAY-${Math.floor(7800 + Math.random() * 2199)}`
          const existing = await query('SELECT `id` FROM `payments` WHERE `id` = ? LIMIT 1', [candidate])
          if (existing.length === 0) {
            id = candidate
            break
          }
          attempts++
        }
        if (!id) id = `PAY-${Date.now().toString().slice(-6)}`
      }
      const paymentNumber = data.paymentNo || data.payment || id
      const txnRef = (data.transactionRef || data.transaction_ref || data.ref || `TXN-${id}`).trim()

      const insertSql = `
        INSERT INTO \`payments\` (
          \`id\`, \`payment_number\`, \`invoice_id\`, \`order_id\`, \`customer_id\`, \`customer_name\`,
          \`branch_id\`, \`branch\`, \`payment_method\`, \`amount\`, \`transaction_ref\`, \`bank_account\`,
          \`payment_date\`, \`status\`, \`status_class\`, \`notes\`
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `

      try {
        await query(insertSql, [
          id,
          paymentNumber,
          'STANDALONE',
          data.order_id || null,
          customerId,
          customerName,
          branchId,
          branchName,
          data.payment_method || data.method || data.paymentMethod || 'Bank Transfer',
          rawAmt,
          txnRef,
          data.bankAccount || null,
          new Date().toISOString().split('T')[0],
          data.status || 'Reconciled',
          data.statusClass || 'bg-[#dcfce7] text-[#165A31]',
          data.notes || null
        ])

        return {
          payment: await this.findById(id),
          invoice: null,
          amount: rawAmt,
          remainingBalance: 0
        }
      } catch (err) {
        lastErr = err
        if (!isExplicitId && (err.code === 'ER_DUP_ENTRY' || err.errno === 1062) && err.message?.includes('PRIMARY')) {
          id = null
          continue
        }
        if (err.code === 'ER_DUP_ENTRY' || err.errno === 1062) {
          const dupErr = new Error(`A payment with transaction reference '${txnRef}' or payment number has already been recorded.`)
          dupErr.code = 'DUPLICATE_PAYMENT'
          dupErr.statusCode = 409
          throw dupErr
        }
        throw err
      }
    }

    if (lastErr) throw lastErr
  }
}
