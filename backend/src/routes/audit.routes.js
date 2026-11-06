import { Router } from 'express'
import { AuditController } from '../controllers/audit.controller.js'
import { authenticateJWT, authorizeRoles } from '../middleware/auth.js'

const router = Router()

router.use(authenticateJWT)

// GET /api/v1/system/audit-logs - List audit logs
router.get('/', AuditController.listLogs)
router.get('/logs', AuditController.listLogs)

// GET /api/v1/system/audit-logs/entity/:entityType/:entityId - Entity audit trail
router.get('/entity/:entityType/:entityId', AuditController.getByEntity)

// POST /api/v1/system/audit-logs - Create audit log entry (Restricted to Super Admin only)
router.post('/', authorizeRoles('Super Admin'), AuditController.createLog)
router.post('/logs', authorizeRoles('Super Admin'), AuditController.createLog)

// NOTE: No PUT, PATCH, or DELETE routes exist. Audit records are permanently preserved and immutable.

export default router
