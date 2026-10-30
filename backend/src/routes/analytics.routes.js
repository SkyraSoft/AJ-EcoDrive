import { Router } from 'express'
import { AnalyticsController } from '../controllers/analytics.controller.js'

const router = Router()

// Custom Reports
router.get('/custom-reports', AnalyticsController.listCustomReports)
router.get('/custom-reports/:id', AnalyticsController.getCustomReportById)
router.post('/custom-reports', AnalyticsController.createCustomReport)
router.put('/custom-reports/:id', AnalyticsController.updateCustomReport)
router.delete('/custom-reports/:id', AnalyticsController.deleteCustomReport)

// Reports root alias
router.get('/reports', AnalyticsController.listCustomReports)
router.post('/reports', AnalyticsController.createCustomReport)

// Default root analytics
router.get('/', AnalyticsController.listCustomReports)

export default router
