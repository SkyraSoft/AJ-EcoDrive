import { Router } from 'express'
import { PaymentController } from '../controllers/payment.controller.js'

const router = Router()

// GET /api/v1/payments - List payments
router.get('/', PaymentController.list)

// Payment Gateway Integrations
router.get('/providers', PaymentController.listProviders)
router.post('/checkout-session', PaymentController.createCheckoutSession)
router.post('/webhook', PaymentController.handleWebhook)

// POST /api/v1/payments - Record payment
router.post('/', PaymentController.create)

// GET /api/v1/payments/:id - Retrieve single payment
router.get('/:id', PaymentController.getById)

export default router
