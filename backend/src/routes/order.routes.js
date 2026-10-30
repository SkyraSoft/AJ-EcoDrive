import { Router } from 'express'
import { OrderController } from '../controllers/order.controller.js'

const router = Router()

// GET /api/v1/orders - List sales orders with multi-tenant branch filtering
router.get('/', OrderController.list)

// POST /api/v1/orders - Create new sales order
router.post('/', OrderController.create)

// POST /api/v1/orders/checkout - POS quick checkout sale
router.post('/checkout', OrderController.create)

// GET /api/v1/orders/:id - Get single sales order with line items
router.get('/:id', OrderController.getById)

// PUT /api/v1/orders/:id - Update sales order details & items
router.put('/:id', OrderController.update)

// POST /api/v1/orders/:id/cancel - Cancel active sales order
router.post('/:id/cancel', OrderController.cancel)

// DELETE /api/v1/orders/:id - Delete order (safe rule: only unfulfilled/cancelled without payments)
router.delete('/:id', OrderController.delete)

export default router
