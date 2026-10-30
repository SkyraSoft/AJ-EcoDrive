import { Router } from 'express'
import { InventoryController } from '../controllers/inventory.controller.js'
import { InventoryGovernanceController } from '../controllers/inventory_governance.controller.js'

const router = Router()

// Stock overview and low stock alerts
router.get('/stock', InventoryController.getStock)
router.get('/low-stock', InventoryController.getLowStock)

// Stock Receipts and Issues
router.post('/receipts', InventoryController.recordReceipt)
router.post('/issues', InventoryController.recordIssue)

// Movement Ledger
router.get('/ledger', InventoryController.getLedger)

// Stock Adjustments
router.get('/adjustments', InventoryController.listAdjustments)
router.get('/adjustments/:id', InventoryController.getAdjustmentById)
router.post('/adjustments', InventoryController.createAdjustment)
router.post('/adjustments/:id/approve', InventoryController.approveAdjustment)
router.post('/adjustments/:id/reject', InventoryController.rejectAdjustment)

// Inter-Branch Transfers
router.get('/transfers', InventoryController.listTransfers)
router.get('/transfers/:id', InventoryController.getTransferById)
router.post('/transfers', InventoryController.createTransfer)
router.post('/transfers/:id/dispatch', InventoryController.dispatchTransfer)
router.post('/transfers/:id/receive', InventoryController.receiveTransfer)

// Serialized Units
router.get('/units', InventoryController.listUnits)
router.get('/units/:id', InventoryController.getUnitById)
router.post('/units/:id/transition', InventoryController.transitionUnit)
router.post('/units/:id/reserve', InventoryController.reserveUnit)
router.post('/units/:id/release-reservation', InventoryController.releaseUnit)

// Cycle Counts
router.get('/cycle-counts', InventoryGovernanceController.listCycleCounts)
router.get('/cycle-counts/:id', InventoryGovernanceController.getCycleCountById)
router.post('/cycle-counts', InventoryGovernanceController.createCycleCount)
router.put('/cycle-counts/:id', InventoryGovernanceController.updateCycleCount)
router.delete('/cycle-counts/:id', InventoryGovernanceController.deleteCycleCount)

// Quarantine Records
router.get('/quarantine', InventoryGovernanceController.listQuarantine)
router.get('/quarantine/:id', InventoryGovernanceController.getQuarantineById)
router.post('/quarantine', InventoryGovernanceController.createQuarantine)
router.put('/quarantine/:id', InventoryGovernanceController.updateQuarantine)
router.delete('/quarantine/:id', InventoryGovernanceController.deleteQuarantine)

// Stock Requests
router.get('/stock-requests', InventoryGovernanceController.listStockRequests)
router.get('/stock-requests/:id', InventoryGovernanceController.getStockRequestById)
router.post('/stock-requests', InventoryGovernanceController.createStockRequest)
router.put('/stock-requests/:id', InventoryGovernanceController.updateStockRequest)
router.delete('/stock-requests/:id', InventoryGovernanceController.deleteStockRequest)

// Default root inventory route
router.get('/', InventoryController.getStock)

export default router
