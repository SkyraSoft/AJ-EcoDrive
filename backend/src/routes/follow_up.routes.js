import { Router } from 'express'
import { FollowUpController } from '../controllers/follow_up.controller.js'
import { authorizePermissions } from '../middleware/auth.js'

const router = Router()

// GET /api/v1/follow-ups - List follow-ups with branch scoping and filters
router.get('/', FollowUpController.getFollowUps)

// GET /api/v1/follow-ups/:id - Retrieve single follow-up
router.get('/:id', FollowUpController.getFollowUpById)

// POST /api/v1/follow-ups - Schedule new follow-up
router.post('/', authorizePermissions('leads.write'), FollowUpController.createFollowUp)

// PUT /api/v1/follow-ups/:id - Update existing follow-up
router.put('/:id', authorizePermissions('leads.write'), FollowUpController.updateFollowUp)

// POST /api/v1/follow-ups/:id/complete - Mark follow-up as completed
router.post('/:id/complete', authorizePermissions('leads.write'), FollowUpController.completeFollowUp)

// DELETE /api/v1/follow-ups/:id - Remove follow-up
router.delete('/:id', authorizePermissions('leads.write'), FollowUpController.deleteFollowUp)

export default router
