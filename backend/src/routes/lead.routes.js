import { Router } from 'express'
import { LeadController } from '../controllers/lead.controller.js'
import { authorizePermissions } from '../middleware/auth.js'

const router = Router()

// GET /api/v1/leads - List leads with filters and branch scoping
router.get('/', LeadController.getLeads)

// GET /api/v1/leads/:id - Retrieve single lead
router.get('/:id', LeadController.getLeadById)

// POST /api/v1/leads - Register new lead
router.post('/', authorizePermissions('leads.write'), LeadController.createLead)

// POST /api/v1/leads/:id/convert - Atomic Lead-to-Customer conversion
router.post('/:id/convert', authorizePermissions('leads.convert'), LeadController.convertLead)

// PUT /api/v1/leads/:id - Update lead
router.put('/:id', authorizePermissions('leads.write'), LeadController.updateLead)

// DELETE /api/v1/leads/:id - Delete lead (cleanup / admin)
router.delete('/:id', authorizePermissions('leads.write'), LeadController.deleteLead)

export default router
