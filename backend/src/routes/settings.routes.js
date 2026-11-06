import { Router } from 'express'
import { SettingsController } from '../controllers/settings.controller.js'
import { authenticateJWT, authorizeRoles } from '../middleware/auth.js'

const router = Router()

// All settings routes are strictly protected for administrative roles
const ADMIN_ROLES = ['Super Admin', 'Director', 'Owner']

router.use(authenticateJWT)
router.use(authorizeRoles(...ADMIN_ROLES))

router.get('/', SettingsController.getSettings)
router.get('/:section', SettingsController.getSettings)
router.put('/:section', SettingsController.updateSettings)

export default router
