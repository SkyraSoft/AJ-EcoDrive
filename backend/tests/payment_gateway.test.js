/**
 * AJ ECODRIVE ERP — PAYMENT GATEWAY INTEGRATION TEST SUITE
 */

import { describe, it, before, after } from 'node:test'
import assert from 'node:assert/strict'
import crypto from 'crypto'
import request from 'supertest'
import express from 'express'
import paymentRoutes from '../src/routes/payment.routes.js'
import { PaymentGatewayService } from '../src/services/payment_gateway.service.js'
import { query, connectDB, disconnectDB } from '../src/config/db.js'

describe('AJ EcoDrive Backend — Payment Gateway Integration Suite', () => {
  let app
  const TEST_TXN_REF = `TXN-AUDIT-TEST-${Date.now()}`

  before(async () => {
    await connectDB()
    app = express()
    app.use(express.json())
    app.use('/api/v1/payments', paymentRoutes)

    // Clean prior artifacts
    await query('DELETE FROM payments WHERE transaction_ref = ?', [TEST_TXN_REF])
  })

  after(async () => {
    await query('DELETE FROM payments WHERE transaction_ref = ?', [TEST_TXN_REF])
    await disconnectDB()
  })

  describe('1. Providers and Capabilities', () => {
    it('GET /api/v1/payments/providers returns active payment providers', async () => {
      const res = await request(app).get('/api/v1/payments/providers')
      assert.equal(res.status, 200)
      assert.equal(res.body.ok, true)
      assert.ok(Array.isArray(res.body.data))
      assert.ok(res.body.data.some(p => p.id === 'manual'))
      assert.ok(res.body.data.some(p => p.id === 'sandbox_card'))
    })
  })

  describe('2. Checkout Session Creation', () => {
    it('POST /api/v1/payments/checkout-session rejects non-positive amount', async () => {
      const res = await request(app)
        .post('/api/v1/payments/checkout-session')
        .send({ amount: 0 })

      assert.equal(res.status, 400)
      assert.equal(res.body.ok, false)
      assert.ok(res.body.message.includes('greater than zero'))
    })

    it('POST /api/v1/payments/checkout-session generates valid checkout intent', async () => {
      const res = await request(app)
        .post('/api/v1/payments/checkout-session')
        .send({
          amount: 50000,
          customerName: 'Muhammad Tariq',
          customerEmail: 'tariq@example.pk',
          branchId: 'BR-01'
        })

      assert.equal(res.status, 201)
      assert.equal(res.body.ok, true)
      assert.ok(res.body.data.sessionId.startsWith('CS_'))
      assert.equal(res.body.data.currency, 'PKR')
      assert.equal(res.body.data.amount, 50000)
      assert.ok(res.body.data.checkoutUrl)
    })
  })

  describe('3. Sandbox Payment Processor', () => {
    it('authorizes card and returns confirmed transaction reference', async () => {
      const res = await PaymentGatewayService.processPayment({
        provider: 'sandbox_card',
        amount: 25000,
        cardDetails: { cardNumber: '4242 4242 4242 4242' }
      })

      assert.equal(res.success, true)
      assert.equal(res.brand, 'Visa')
      assert.equal(res.last4, '4242')
      assert.ok(res.transactionRef.startsWith('TXN-SBOX-'))
      assert.equal(res.status, 'Reconciled')
    })

    it('simulates card decline for card ending in 0002', async () => {
      const res = await PaymentGatewayService.processPayment({
        provider: 'sandbox_card',
        amount: 15000,
        cardDetails: { cardNumber: '4000 0000 0000 0002' }
      })

      assert.equal(res.success, false)
      assert.equal(res.errorCode, 'CARD_DECLINED')
    })

    it('verifies HMAC webhook signature verification', () => {
      const payload = { event: 'payment.succeeded', id: 'evt_123' }
      const secret = 'whsec_test_secret_key_123'
      const hmac = crypto.createHmac('sha256', secret).update(JSON.stringify(payload)).digest('hex')

      const valid = PaymentGatewayService.verifyWebhookSignature({
        payload,
        signature: hmac,
        secret
      })
      assert.equal(valid, true)

      const invalid = PaymentGatewayService.verifyWebhookSignature({
        payload,
        signature: 'invalid_tampered_signature_hex',
        secret
      })
      assert.equal(invalid, false)
    })
  })

  describe('4. Webhook Event Persistence Lifecycle', () => {
    it('POST /api/v1/payments/webhook stores confirmed card payment into MySQL', async () => {
      // Find an existing registered customer to satisfy foreign key / relationship
      const [customer] = await query('SELECT id, name FROM customers LIMIT 1')
      assert.ok(customer, 'Seed customer must exist')

      const webhookPayload = {
        event: 'payment.succeeded',
        data: {
          amount: 12500,
          paymentMethod: 'Credit Card (Online)',
          transactionRef: TEST_TXN_REF,
          customerId: customer.id,
          customerName: customer.name,
          branchId: 'BR-01',
          provider: 'Sandbox Gateway'
        }
      }

      const res = await request(app)
        .post('/api/v1/payments/webhook')
        .send(webhookPayload)

      assert.equal(res.status, 200)
      assert.equal(res.body.ok, true)

      // Verify row in MySQL payments table
      const [saved] = await query('SELECT * FROM payments WHERE transaction_ref = ?', [TEST_TXN_REF])
      assert.ok(saved, 'Payment row must be saved in MySQL')
      assert.equal(parseFloat(saved.amount), 12500)
      assert.equal(saved.payment_method, 'Credit Card (Online)')
      assert.equal(saved.branch_id, 'BR-01')

      // Clean teardown of test payment
      await query('DELETE FROM payments WHERE transaction_ref = ?', [TEST_TXN_REF])
      const [checkClean] = await query('SELECT count(*) as count FROM payments WHERE transaction_ref = ?', [TEST_TXN_REF])
      assert.equal(checkClean.count, 0, 'Test payment must be cleanly removed')
    })
  })
})
