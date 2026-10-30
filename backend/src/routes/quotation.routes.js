import { Router } from 'express'
import { QuotationController } from '../controllers/quotation.controller.js'

const router = Router()

// GET /api/v1/quotations - List quotations with filtering
router.get('/', QuotationController.list)

// POST /api/v1/quotations - Create new quotation
router.post('/', QuotationController.create)

// GET /api/v1/quotations/:id - Retrieve single quotation with items
router.get('/:id', QuotationController.getById)

// PUT /api/v1/quotations/:id - Update quotation record and items
router.put('/:id', QuotationController.update)

// PATCH /api/v1/quotations/:id/status - Update quotation status
router.patch('/:id/status', QuotationController.updateStatus)

// POST /api/v1/quotations/:id/convert-to-order - Convert quotation to sales order
router.post('/:id/convert-to-order', QuotationController.convertToOrder)

// DELETE /api/v1/quotations/:id - Delete quotation (safe rule: only if not linked to sales order)
router.delete('/:id', QuotationController.delete)

export default router
