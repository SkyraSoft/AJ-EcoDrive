import { Router } from 'express'
import { AfterSalesController } from '../controllers/after_sales.controller.js'
import { authorizePermissions } from '../middleware/auth.js'

const router = Router()

// ============================================================================
// OVERVIEW & DASHBOARD
// ============================================================================

// GET /api/v1/after-sales/overview - High-level metrics & branch workload
router.get('/overview', AfterSalesController.getOverview)

// ============================================================================
// SERVICE CASES
// ============================================================================

// GET /api/v1/after-sales/cases - List service cases
router.get('/cases', AfterSalesController.getCases)

// GET /api/v1/after-sales/cases/:id - Retrieve single service case
router.get('/cases/:id', AfterSalesController.getCaseById)

// POST /api/v1/after-sales/cases - Create new service case
router.post('/cases', authorizePermissions('after_sales.write'), AfterSalesController.createCase)

// PUT /api/v1/after-sales/cases/:id - Update existing service case
router.put('/cases/:id', authorizePermissions('after_sales.write'), AfterSalesController.updateCase)

// ============================================================================
// REPAIR JOBS
// ============================================================================

// GET /api/v1/after-sales/repair-jobs - List repair jobs
router.get('/repair-jobs', AfterSalesController.getRepairJobs)

// GET /api/v1/after-sales/repair-jobs/:id - Retrieve single repair job with parts/labour
router.get('/repair-jobs/:id', AfterSalesController.getRepairJobById)

// POST /api/v1/after-sales/repair-jobs - Create new repair job
router.post('/repair-jobs', authorizePermissions('after_sales.write'), AfterSalesController.createRepairJob)

// PUT /api/v1/after-sales/repair-jobs/:id - Update repair job details
router.put('/repair-jobs/:id', authorizePermissions('after_sales.write'), AfterSalesController.updateRepairJob)

// POST /api/v1/after-sales/repair-jobs/:id/complete - Complete repair job and deduct parts inventory
router.post('/repair-jobs/:id/complete', authorizePermissions('after_sales.write'), AfterSalesController.completeRepairJob)

// POST /api/v1/after-sales/repair-jobs/:id/post-finance - Post chargeable repair to Finance/Invoicing
router.post('/repair-jobs/:id/post-finance', authorizePermissions('after_sales.write'), AfterSalesController.postRepairToFinance)

// ============================================================================
// WARRANTY CLAIMS
// ============================================================================

// GET /api/v1/after-sales/warranty-claims - List warranty claims
router.get('/warranty-claims', AfterSalesController.getWarrantyClaims)

// GET /api/v1/after-sales/warranty-claims/:id - Retrieve single warranty claim
router.get('/warranty-claims/:id', AfterSalesController.getWarrantyClaimById)

// POST /api/v1/after-sales/warranty-claims - Submit warranty claim
router.post('/warranty-claims', authorizePermissions('after_sales.write'), AfterSalesController.createWarrantyClaim)

// POST /api/v1/after-sales/warranty-claims/:id/approve - Approve warranty claim
router.post('/warranty-claims/:id/approve', authorizePermissions('after_sales.warranty_approve'), AfterSalesController.approveWarrantyClaim)

// POST /api/v1/after-sales/warranty-claims/:id/reject - Reject warranty claim
router.post('/warranty-claims/:id/reject', authorizePermissions('after_sales.warranty_approve'), AfterSalesController.rejectWarrantyClaim)

export default router
