import { Router } from 'express'
import { AuditController } from '../controllers/audit.controller.js'

const router = Router()

// GET /api/v1/system/audit-logs - List audit logs
router.get('/', AuditController.listLogs)
router.get('/logs', AuditController.listLogs)

// POST /api/v1/system/audit-logs - Create audit log entry
router.post('/', AuditController.createLog)
router.post('/logs', AuditController.createLog)

// GET /api/v1/system/audit-logs/entity/:entityType/:entityId - Entity audit trail
router.get('/entity/:entityType/:entityId', AuditController.getByEntity)

export default router

