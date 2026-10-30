import { Router } from 'express'
import { CustomerController } from '../controllers/customer.controller.js'

const router = Router()

// GET /api/v1/customers - List customers
router.get('/', CustomerController.list)

// POST /api/v1/customers - Create new customer
router.post('/', CustomerController.create)

// GET /api/v1/customers/:id - Retrieve single customer
router.get('/:id', CustomerController.getById)

// PUT /api/v1/customers/:id - Update customer record
router.put('/:id', CustomerController.update)

// DELETE /api/v1/customers/:id - Delete customer (if no transactions)
router.delete('/:id', CustomerController.delete)

export default router
