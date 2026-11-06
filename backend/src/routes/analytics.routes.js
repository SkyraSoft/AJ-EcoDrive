import { Router } from 'express'
import { AnalyticsController } from '../controllers/analytics.controller.js'
import { authorizeRoles } from '../middleware/auth.js'

const router = Router()

const ANALYTICS_ADMIN_ROLES = ['Super Admin', 'Director', 'Owner']

// Custom Reports
router.get('/custom-reports', AnalyticsController.listCustomReports)
router.get('/custom-reports/:id', AnalyticsController.getCustomReportById)
router.post('/custom-reports', authorizeRoles(...ANALYTICS_ADMIN_ROLES), AnalyticsController.createCustomReport)
router.put('/custom-reports/:id', authorizeRoles(...ANALYTICS_ADMIN_ROLES), AnalyticsController.updateCustomReport)
router.delete('/custom-reports/:id', authorizeRoles(...ANALYTICS_ADMIN_ROLES), AnalyticsController.deleteCustomReport)

// Reports root alias
router.get('/reports', AnalyticsController.listCustomReports)
router.post('/reports', authorizeRoles(...ANALYTICS_ADMIN_ROLES), AnalyticsController.createCustomReport)

// Default root analytics
router.get('/', AnalyticsController.listCustomReports)

export default router
