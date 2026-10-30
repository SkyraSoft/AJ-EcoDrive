import { Router } from 'express'
import { InvoiceController } from '../controllers/invoice.controller.js'

const router = Router()

// GET /api/v1/invoices - List invoices
router.get('/', InvoiceController.list)

// POST /api/v1/invoices - Create invoice
router.post('/', InvoiceController.create)

// GET /api/v1/invoices/:id - Retrieve single invoice
router.get('/:id', InvoiceController.getById)

// PUT /api/v1/invoices/:id - Update invoice
router.put('/:id', InvoiceController.update)

// POST /api/v1/invoices/:id/payments - Record payment against invoice
router.post('/:id/payments', InvoiceController.recordPayment)

// DELETE /api/v1/invoices/:id - Delete invoice safely
router.delete('/:id', InvoiceController.delete)

export default router
