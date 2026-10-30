import { PaymentModel } from '../models/payment.model.js'
import { CustomerModel } from '../models/customer.model.js'
import { InvoiceModel } from '../models/invoice.model.js'
import { getEffectiveBranch, assertBranchAccess, resolveBranchId } from '../utils/branchScope.js'
import { PaymentGatewayService } from '../services/payment_gateway.service.js'

export const PaymentController = {
  /**
   * GET /api/v1/payments/providers
   */
  listProviders(req, res) {
    const providers = PaymentGatewayService.getAvailableProviders()
    res.status(200).json({ ok: true, data: providers })
  },

  /**
   * POST /api/v1/payments/checkout-session
   */
  async createCheckoutSession(req, res, next) {
    try {
      const session = await PaymentGatewayService.createCheckoutSession(req.body || {})
      res.status(201).json({ ok: true, data: session })
    } catch (err) {
      res.status(400).json({ ok: false, error: 'CHECKOUT_SESSION_FAILED', message: err.message })
    }
  },

  /**
   * POST /api/v1/payments/webhook
   */
  async handleWebhook(req, res, next) {
    try {
      const { event, data } = req.body || {}
      if (event === 'payment.succeeded' && data) {
        const txnRef = data.transactionRef || data.transaction_ref || data.reference
        const paymentData = {
          amount: data.amount,
          invoice_id: data.invoiceId || data.invoice_id,
          payment_method: data.paymentMethod || 'Credit Card (Online)',
          transaction_ref: txnRef,
          transactionRef: txnRef,
          customer_id: data.customerId || data.customer_id,
          customer: data.customerName || data.customer,
          branch_id: data.branchId || data.branch_id || 'BR-01',
          notes: `Online settlement processed via ${data.provider || 'Gateway'}`
        }
        const recorded = await PaymentModel.create(paymentData)
        return res.status(200).json({ ok: true, message: 'Payment recorded from webhook.', payment: recorded })
      }
      res.status(200).json({ ok: true, received: true })
    } catch (err) {
      next(err)
    }
  },
  /**
   * GET /api/v1/payments
   */
  async list(req, res, next) {
    try {
      const { status, invoice_id, customer_id, order_id, search, limit, offset } = req.query

      // Multi-tenant branch context enforcement strictly derived from verified server-side identity
      const effectiveBranch = getEffectiveBranch(req)

      const payments = await PaymentModel.findAll({
        branch_id: effectiveBranch,
        status,
        invoice_id,
        customer_id,
        order_id,
        search,
        limit: limit ? parseInt(limit, 10) : 100,
        offset: offset ? parseInt(offset, 10) : 0
      })

      res.status(200).json(payments)
    } catch (err) {
      next(err)
    }
  },

  /**
   * GET /api/v1/payments/:id
   */
  async getById(req, res, next) {
    try {
      const { id } = req.params
      const payment = await PaymentModel.findById(id)

      if (!payment) {
        return res.status(404).json({
          ok: false,
          error: 'NOT_FOUND',
          message: `Payment with ID or number '${id}' was not found.`
        })
      }

      // Prevent cross-branch IDOR
      if (!assertBranchAccess(payment.branch_id, req, res)) return

      res.status(200).json(payment)
    } catch (err) {
      next(err)
    }
  },

  /**
   * POST /api/v1/payments
   */
  async create(req, res, next) {
    try {
      const body = req.body || {}
      const errors = []

      // 1. Amount validation
      const rawAmt = parseFloat(String(body.amount || body.rawAmount || 0).replace(/[^0-9.]/g, ''))
      if (isNaN(rawAmt) || rawAmt <= 0) {
        errors.push({ field: 'amount', message: 'Payment amount must be greater than zero.' })
      }

      // 2. If invoice is linked, verify invoice exists and check branch access
      const invoiceId = body.invoice_id || body.invoiceId
      if (invoiceId) {
        const inv = await InvoiceModel.findById(invoiceId)
        if (!inv) {
          return res.status(404).json({
            ok: false,
            error: 'NOT_FOUND',
            message: `Invoice '${invoiceId}' was not found.`
          })
        }
        if (!assertBranchAccess(inv.branch_id, req, res)) return
      } else {
        // If no invoice is linked, validate customer
        const customerInput = (body.customer_id || body.customer || '').trim()
        if (!customerInput) {
          errors.push({ field: 'customer', message: 'Customer or linked invoice reference is required.' })
        } else {
          let matchedCustomer = null
          if (body.customer_id) {
            matchedCustomer = await CustomerModel.findById(body.customer_id)
          }
          if (!matchedCustomer && body.customer) {
            const matchingCustomers = await CustomerModel.findAll({ search: body.customer.trim(), limit: 1 })
            if (matchingCustomers.length > 0) {
              matchedCustomer = matchingCustomers[0]
            }
          }
          if (!matchedCustomer) {
            errors.push({
              field: 'customer_id',
              message: `Customer '${customerInput}' was not found in registered database records.`
            })
          }
        }
      }

      if (errors.length > 0) {
        return res.status(422).json({
          ok: false,
          error: 'VALIDATION_FAILED',
          message: 'Payment validation failed.',
          errors
        })
      }

      const user = req.user
      const isSuperAdmin = user?.isSuperAdmin || user?.role === 'Super Admin' || !user?.branch_id || user?.branch_id === 'ALL'
      if (!isSuperAdmin) {
        body.branch_id = resolveBranchId(user.branch_id) || 'BR-01'
      }

      const result = await PaymentModel.create(body)
      res.status(201).json(result.payment || result)
    } catch (err) {
      if (err.code === 'NOT_FOUND') {
        return res.status(404).json({
          ok: false,
          error: 'NOT_FOUND',
          message: err.message
        })
      }
      if (err.code === 'INVOICE_CANCELLED' || err.code === 'EXCESSIVE_PAYMENT_AMOUNT') {
        return res.status(400).json({
          ok: false,
          error: err.code,
          message: err.message
        })
      }
      if (err.code === 'INVALID_PAYMENT_AMOUNT') {
        return res.status(422).json({
          ok: false,
          error: err.code,
          message: err.message
        })
      }
      if (err.code === 'DUPLICATE_PAYMENT' || err.code === 'ER_DUP_ENTRY' || err.message?.includes('Duplicate entry')) {
        return res.status(409).json({
          ok: false,
          error: 'DUPLICATE_PAYMENT',
          message: err.message?.includes('Duplicate entry')
            ? 'A payment with this transaction reference has already been recorded.'
            : err.message
        })
      }
      next(err)
    }
  }
}
