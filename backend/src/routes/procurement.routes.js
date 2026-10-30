import { Router } from 'express'
import { ProcurementController } from '../controllers/procurement.controller.js'
import { authenticateJWT, authorizePermissions } from '../middleware/auth.js'

const router = Router()

// Enforce JWT authentication on all procurement routes
router.use(authenticateJWT)

// Suppliers & Vendors (Enterprise Catalog)
router.get('/suppliers', authorizePermissions('procurement.read'), ProcurementController.getSuppliers)
router.get('/suppliers/:id', authorizePermissions('procurement.read'), ProcurementController.getSupplierById)
router.post('/suppliers', authorizePermissions('procurement.write'), ProcurementController.createSupplier)
router.put('/suppliers/:id', authorizePermissions('procurement.write'), ProcurementController.updateSupplier)
router.delete('/suppliers/:id', authorizePermissions('procurement.write'), ProcurementController.deleteSupplier)

// Purchase Orders Lifecycle & Actions
router.get('/purchase-orders', authorizePermissions('procurement.read'), ProcurementController.getPurchaseOrders)
router.get('/purchase-orders/:id', authorizePermissions('procurement.read'), ProcurementController.getPurchaseOrderById)
router.post('/purchase-orders', authorizePermissions('procurement.write'), ProcurementController.createPurchaseOrder)
router.put('/purchase-orders/:id', authorizePermissions('procurement.write'), ProcurementController.updatePurchaseOrder)
router.post('/purchase-orders/:id/approve', authorizePermissions('procurement.write'), ProcurementController.approvePurchaseOrder)
router.post('/purchase-orders/:id/send', authorizePermissions('procurement.write'), ProcurementController.sendPurchaseOrder)
router.post('/purchase-orders/:id/cancel', authorizePermissions('procurement.write'), ProcurementController.cancelPurchaseOrder)
router.post('/purchase-orders/:id/receive', authorizePermissions('procurement.write'), ProcurementController.receivePurchaseOrder)

// Goods Received Notes (GRN)
router.get('/receipts', authorizePermissions('procurement.read'), ProcurementController.getReceipts)
router.get('/receipts/:id', authorizePermissions('procurement.read'), ProcurementController.getReceiptById)
router.post('/receipts', authorizePermissions('procurement.write'), ProcurementController.createReceipt)

// Vendor Bills & Payables
router.get('/vendor-bills', authorizePermissions('procurement.read'), ProcurementController.getVendorBills)
router.get('/vendor-bills/:id', authorizePermissions('procurement.read'), ProcurementController.getVendorBillById)
router.post('/vendor-bills/:id/pay', authorizePermissions('procurement.write'), ProcurementController.recordBillPayment)

// Purchase Returns & Vendor Debit Notes
router.get(['/purchase-returns', '/returns'], authorizePermissions('procurement.read'), ProcurementController.getPurchaseReturns)
router.get(['/purchase-returns/:id', '/returns/:id'], authorizePermissions('procurement.read'), ProcurementController.getPurchaseReturnById)
router.post(['/purchase-returns', '/returns'], authorizePermissions('procurement.write'), ProcurementController.createPurchaseReturn)
router.post(['/purchase-returns/:id/approve', '/returns/:id/approve'], authorizePermissions('procurement.write'), ProcurementController.approvePurchaseReturn)
router.get('/vendor-debit-notes', authorizePermissions('procurement.read'), ProcurementController.getVendorDebitNotes)

export default router

