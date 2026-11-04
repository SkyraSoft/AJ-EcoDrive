import { Router } from 'express'
import { SettingsController } from '../controllers/settings.controller.js'
import { authenticateJWT, authorizeRoles } from '../middleware/auth.js'

const router = Router()

// All settings routes are protected; writes require Super Admin
router.get('/', SettingsController.getSettings)
router.get('/:section', SettingsController.getSettings)
router.put('/:section', authorizeRoles('Super Admin', 'Director', 'Owner'), SettingsController.updateSettings)

export default router
