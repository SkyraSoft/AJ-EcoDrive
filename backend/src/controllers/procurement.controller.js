import { ProcurementModel } from '../models/procurement.model.js'
import { getEffectiveBranch, assertBranchAccess, resolveBranchId, getBranchName } from '../utils/branchScope.js'

export const ProcurementController = {
  // =========================================================================
  // SUPPLIERS (Enterprise Catalog)
  // =========================================================================

  /**
   * GET /api/v1/procurement/suppliers
   */
  async getSuppliers(req, res, next) {
    try {
      const { search, status, branch_id } = req.query
      const effectiveBranch = getEffectiveBranch(req)

      const suppliers = await ProcurementModel.findAllSuppliers({
        search,
        status,
        branch_id: effectiveBranch || branch_id || null
      })

      res.status(200).json(suppliers)
    } catch (err) {
      next(err)
    }
  },

  /**
   * GET /api/v1/procurement/suppliers/:id
   */
  async getSupplierById(req, res, next) {
    try {
      const { id } = req.params
      const supplier = await ProcurementModel.findSupplierById(id)

      if (!supplier) {
        return res.status(404).json({
          ok: false,
          error: 'NOT_FOUND',
          message: `Supplier '${id}' not found`
        })
      }

      res.status(200).json(supplier)
    } catch (err) {
      next(err)
    }
  },

  /**
   * POST /api/v1/procurement/suppliers
   */
  async createSupplier(req, res, next) {
    try {
      const created = await ProcurementModel.createSupplier(req.body)
      res.status(201).json(created)
    } catch (err) {
      next(err)
    }
  },

  /**
   * PUT /api/v1/procurement/suppliers/:id
   */
  async updateSupplier(req, res, next) {
    try {
      const { id } = req.params
      const updated = await ProcurementModel.updateSupplier(id, req.body)
      res.status(200).json(updated)
    } catch (err) {
      next(err)
    }
  },

  /**
   * DELETE /api/v1/procurement/suppliers/:id
   */
  async deleteSupplier(req, res, next) {
    try {
      const { id } = req.params
      const result = await ProcurementModel.deleteSupplier(id)
      res.status(200).json(result)
    } catch (err) {
      next(err)
    }
  },

  // =========================================================================
  // PURCHASE ORDERS
  // =========================================================================

  /**
   * GET /api/v1/procurement/purchase-orders
   */
  async getPurchaseOrders(req, res, next) {
    try {
      const { search, status, supplier_id } = req.query
      const effectiveBranch = getEffectiveBranch(req)

      const orders = await ProcurementModel.findAllPurchaseOrders({
        search,
        status,
        branch_id: effectiveBranch,
        supplier_id
      })

      res.status(200).json(orders)
    } catch (err) {
      next(err)
    }
  },

  /**
   * GET /api/v1/procurement/purchase-orders/:id
   */
  async getPurchaseOrderById(req, res, next) {
    try {
      const { id } = req.params
      const order = await ProcurementModel.findPurchaseOrderById(id)

      if (!order) {
        return res.status(404).json({
          ok: false,
          error: 'NOT_FOUND',
          message: `Purchase order '${id}' not found`
        })
      }

      // Prevent cross-branch IDOR
      if (!assertBranchAccess(order.branch_id, req, res)) return

      res.status(200).json(order)
    } catch (err) {
      next(err)
    }
  },

  /**
   * POST /api/v1/procurement/purchase-orders
   */
  async createPurchaseOrder(req, res, next) {
    try {
      const user = req.user
      const isSuperAdmin = user?.isSuperAdmin || user?.role === 'Super Admin' || !user?.branch_id || user?.branch_id === 'ALL'
      
      const payload = { ...req.body }
      if (!isSuperAdmin) {
        const userBranch = resolveBranchId(user?.branch_id)
        const requestedBranch = resolveBranchId(payload.branch_id || payload.destination || payload.branch)
        if (requestedBranch && requestedBranch !== 'ALL' && requestedBranch !== userBranch) {
          return res.status(403).json({
            ok: false,
            error: 'FORBIDDEN',
            message: `Access denied: You cannot create a purchase order for branch "${payload.branch_id || payload.destination || payload.branch}". Access restricted to your assigned branch.`
          })
        }
        payload.branch_id = userBranch || 'BR-01'
        payload.branch = getBranchName(payload.branch_id)
        payload.destination = payload.branch
      }

      const created = await ProcurementModel.createPurchaseOrder(payload)
      res.status(201).json(created)
    } catch (err) {
      next(err)
    }
  },


  /**
   * PUT /api/v1/procurement/purchase-orders/:id
   */
  async updatePurchaseOrder(req, res, next) {
    try {
      const { id } = req.params
      const existing = await ProcurementModel.findPurchaseOrderById(id)
      if (!existing) {
        return res.status(404).json({ ok: false, error: 'NOT_FOUND', message: `Purchase order ${id} not found` })
      }

      if (!assertBranchAccess(existing.branch_id, req, res)) return

      const updated = await ProcurementModel.updatePurchaseOrder(id, req.body)
      res.status(200).json(updated)
    } catch (err) {
      next(err)
    }
  },

  /**
   * POST /api/v1/procurement/purchase-orders/:id/approve
   */
  async approvePurchaseOrder(req, res, next) {
    try {
      const { id } = req.params
      const existing = await ProcurementModel.findPurchaseOrderById(id)
      if (!existing) {
        return res.status(404).json({ ok: false, error: 'NOT_FOUND', message: `Purchase order ${id} not found` })
      }

      if (!assertBranchAccess(existing.branch_id, req, res)) return

      const user = req.body.user || req.user?.name || req.user?.username || 'Manager'
      const approved = await ProcurementModel.approvePurchaseOrder(id, { user })
      res.status(200).json(approved)
    } catch (err) {
      next(err)
    }
  },

  /**
   * POST /api/v1/procurement/purchase-orders/:id/send
   */
  async sendPurchaseOrder(req, res, next) {
    try {
      const { id } = req.params
      const existing = await ProcurementModel.findPurchaseOrderById(id)
      if (!existing) {
        return res.status(404).json({ ok: false, error: 'NOT_FOUND', message: `Purchase order ${id} not found` })
      }

      if (!assertBranchAccess(existing.branch_id, req, res)) return

      const sent = await ProcurementModel.sendPurchaseOrder(id, req.body)
      res.status(200).json(sent)
    } catch (err) {
      next(err)
    }
  },

  /**
   * POST /api/v1/procurement/purchase-orders/:id/cancel
   */
  async cancelPurchaseOrder(req, res, next) {
    try {
      const { id } = req.params
      const existing = await ProcurementModel.findPurchaseOrderById(id)
      if (!existing) {
        return res.status(404).json({ ok: false, error: 'NOT_FOUND', message: `Purchase order ${id} not found` })
      }

      if (!assertBranchAccess(existing.branch_id, req, res)) return

      const user = req.body.user || req.user?.name || req.user?.username || 'Admin'
      const reason = req.body.reason || 'Cancelled by user'
      const cancelled = await ProcurementModel.cancelPurchaseOrder(id, { user, reason })
      res.status(200).json(cancelled)
    } catch (err) {
      next(err)
    }
  },

  /**
   * POST /api/v1/procurement/purchase-orders/:id/receive
   */
  async receivePurchaseOrder(req, res, next) {
    try {
      const { id } = req.params
      const existing = await ProcurementModel.findPurchaseOrderById(id)
      if (!existing) {
        return res.status(404).json({ ok: false, error: 'NOT_FOUND', message: `Purchase order ${id} not found` })
      }

      if (!assertBranchAccess(existing.branch_id, req, res)) return

      const payload = {
        ...req.body,
        po_id: id,
        received_by: req.body.received_by || req.user?.name || req.user?.username || 'Receiving Officer'
      }
      const receipt = await ProcurementModel.createReceipt(payload)
      res.status(201).json(receipt)
    } catch (err) {
      next(err)
    }
  },

  // =========================================================================
  // GOODS RECEIVED NOTES (GRN)
  // =========================================================================

  /**
   * GET /api/v1/procurement/receipts
   */
  async getReceipts(req, res, next) {
    try {
      const { search, po_id } = req.query
      const effectiveBranch = getEffectiveBranch(req)

      const receipts = await ProcurementModel.findAllReceipts({
        search,
        po_id,
        branch_id: effectiveBranch
      })

      res.status(200).json(receipts)
    } catch (err) {
      next(err)
    }
  },

  /**
   * GET /api/v1/procurement/receipts/:id
   */
  async getReceiptById(req, res, next) {
    try {
      const { id } = req.params
      const receipt = await ProcurementModel.findReceiptById(id)

      if (!receipt) {
        return res.status(404).json({
          ok: false,
          error: 'NOT_FOUND',
          message: `Goods receipt '${id}' not found`
        })
      }

      if (!assertBranchAccess(receipt.branch_id, req, res)) return

      res.status(200).json(receipt)
    } catch (err) {
      next(err)
    }
  },

  /**
   * POST /api/v1/procurement/receipts
   */
  async createReceipt(req, res, next) {
    try {
      const poIdentifier = req.body.po_id || req.body.po_number || req.body.poId || req.body.po
      if (poIdentifier) {
        const existing = await ProcurementModel.findPurchaseOrderById(poIdentifier)
        if (existing) {
          if (!assertBranchAccess(existing.branch_id, req, res)) return
        }
      }

      const payload = {
        ...req.body,
        received_by: req.body.received_by || req.user?.name || req.user?.username || 'Receiving Officer'
      }
      const receipt = await ProcurementModel.createReceipt(payload)
      res.status(201).json(receipt)
    } catch (err) {
      next(err)
    }
  },


  // =========================================================================
  // VENDOR BILLS
  // =========================================================================

  /**
   * GET /api/v1/procurement/vendor-bills
   */
  async getVendorBills(req, res, next) {
    try {
      const { status, supplier_id, po_id } = req.query
      const effectiveBranch = getEffectiveBranch(req)

      const bills = await ProcurementModel.findAllVendorBills({
        status,
        branch_id: effectiveBranch,
        supplier_id,
        po_id
      })

      res.status(200).json(bills)
    } catch (err) {
      next(err)
    }
  },

  /**
   * GET /api/v1/procurement/vendor-bills/:id
   */
  async getVendorBillById(req, res, next) {
    try {
      const { id } = req.params
      const bill = await ProcurementModel.findVendorBillById(id)

      if (!bill) {
        return res.status(404).json({
          ok: false,
          error: 'NOT_FOUND',
          message: `Vendor bill '${id}' not found`
        })
      }

      if (!assertBranchAccess(bill.branch_id, req, res)) return

      res.status(200).json(bill)
    } catch (err) {
      next(err)
    }
  },

  /**
   * POST /api/v1/procurement/vendor-bills/:id/pay
   */
  async recordBillPayment(req, res, next) {
    try {
      const { id } = req.params
      const existing = await ProcurementModel.findVendorBillById(id)
      if (!existing) {
        return res.status(404).json({ ok: false, error: 'NOT_FOUND', message: `Vendor bill ${id} not found` })
      }

      if (!assertBranchAccess(existing.branch_id, req, res)) return

      const bill = await ProcurementModel.recordBillPayment(id, req.body)
      res.status(200).json(bill)
    } catch (err) {
      next(err)
    }
  },

  // =========================================================================
  // PURCHASE RETURNS & VENDOR DEBIT NOTES
  // =========================================================================

  /**
   * GET /api/v1/procurement/purchase-returns
   */
  async getPurchaseReturns(req, res, next) {
    try {
      const { search, status, supplier_id, po_id } = req.query
      const effectiveBranch = getEffectiveBranch(req)

      const returns = await ProcurementModel.findAllPurchaseReturns({
        search,
        status,
        supplier_id,
        po_id,
        branch_id: effectiveBranch
      })

      res.status(200).json(returns)
    } catch (err) {
      next(err)
    }
  },

  /**
   * GET /api/v1/procurement/purchase-returns/:id
   */
  async getPurchaseReturnById(req, res, next) {
    try {
      const { id } = req.params
      const ret = await ProcurementModel.findPurchaseReturnById(id)

      if (!ret) {
        return res.status(404).json({
          ok: false,
          error: 'NOT_FOUND',
          message: `Purchase return '${id}' not found`
        })
      }

      if (!assertBranchAccess(ret.branch_id, req, res)) return

      res.status(200).json(ret)
    } catch (err) {
      next(err)
    }
  },

  /**
   * POST /api/v1/procurement/purchase-returns
   */
  async createPurchaseReturn(req, res, next) {
    try {
      const user = req.user
      const isSuperAdmin = user?.isSuperAdmin || user?.role === 'Super Admin' || !user?.branch_id || user?.branch_id === 'ALL'
      
      const payload = { ...req.body }
      if (!isSuperAdmin) {
        const userBranch = resolveBranchId(user?.branch_id)
        const requestedBranch = resolveBranchId(payload.branch_id || payload.branch)
        if (requestedBranch && requestedBranch !== 'ALL' && requestedBranch !== userBranch) {
          return res.status(403).json({
            ok: false,
            error: 'FORBIDDEN',
            message: `Access denied: You cannot create a purchase return for branch "${payload.branch_id || payload.branch}". Access restricted to your assigned branch.`
          })
        }
        payload.branch_id = userBranch || 'BR-01'
        payload.branch = getBranchName(payload.branch_id)
      }

      const created = await ProcurementModel.createPurchaseReturn(payload, user)
      res.status(201).json(created)
    } catch (err) {
      next(err)
    }
  },

  /**
   * POST /api/v1/procurement/purchase-returns/:id/approve
   */
  async approvePurchaseReturn(req, res, next) {
    try {
      const { id } = req.params
      const existing = await ProcurementModel.findPurchaseReturnById(id)
      if (!existing) {
        return res.status(404).json({
          ok: false,
          error: 'NOT_FOUND',
          message: `Purchase return '${id}' not found`
        })
      }

      if (!assertBranchAccess(existing.branch_id, req, res)) return

      const approved = await ProcurementModel.approvePurchaseReturn(id, req.user)
      res.status(200).json(approved)
    } catch (err) {
      next(err)
    }
  },

  /**
   * GET /api/v1/procurement/vendor-debit-notes
   */
  async getVendorDebitNotes(req, res, next) {
    try {
      const { status, supplier_id, return_id } = req.query
      const effectiveBranch = getEffectiveBranch(req)

      const debitNotes = await ProcurementModel.findAllVendorDebitNotes({
        status,
        supplier_id,
        return_id,
        branch_id: effectiveBranch
      })

      res.status(200).json(debitNotes)
    } catch (err) {
      next(err)
    }
  }
}

export default ProcurementController
