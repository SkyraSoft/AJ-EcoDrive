import { InventoryModel } from '../models/inventory.model.js'
import { getEffectiveBranch, assertBranchAccess, resolveBranchId } from '../utils/branchScope.js'

export const InventoryController = {
  /**
   * GET /api/v1/inventory/stock
   */
  async getStock(req, res, next) {
    try {
      const { product_id, productId, category_id, search, low_stock, limit, offset } = req.query

      const effectiveBranch = getEffectiveBranch(req)

      const stock = await InventoryModel.getStockSummary({
        branch_id: effectiveBranch,
        product_id: product_id || productId,
        category_id,
        search,
        low_stock: low_stock === 'true' || low_stock === '1',
        limit: limit ? parseInt(limit, 10) : 100,
        offset: offset ? parseInt(offset, 10) : 0
      })

      res.status(200).json(stock)
    } catch (err) {
      next(err)
    }
  },

  /**
   * GET /api/v1/inventory/low-stock
   */
  async getLowStock(req, res, next) {
    try {
      const { category_id, search } = req.query
      const effectiveBranch = getEffectiveBranch(req)

      const stock = await InventoryModel.getStockSummary({
        branch_id: effectiveBranch,
        category_id,
        search,
        low_stock: true
      })

      res.status(200).json(stock)
    } catch (err) {
      next(err)
    }
  },

  /**
   * POST /api/v1/inventory/receipts
   */
  async recordReceipt(req, res, next) {
    try {
      const { product_id, productId, branch_id, branchId, branch, quantity, reference, notes } = req.body
      const user = req.user
      const isSuperAdmin = user?.isSuperAdmin || user?.role === 'Super Admin' || !user?.branch_id || user?.branch_id === 'ALL'
      const targetBranch = isSuperAdmin 
        ? (resolveBranchId(branch_id || branchId || branch) || 'BR-01')
        : (resolveBranchId(user?.branch_id) || 'BR-01')

      const result = await InventoryModel.recordReceipt({
        product_id: product_id || productId,
        branch_id: targetBranch,
        branch,
        quantity,
        user: req.body.user || req.body.userName || user?.name || user?.username || 'Store Officer',
        reference,
        notes
      })

      res.status(201).json({
        ok: true,
        message: 'Stock receipt recorded successfully',
        data: result
      })
    } catch (err) {
      if (err.message && err.message.includes('greater than 0')) {
        return res.status(400).json({ ok: false, error: 'INVALID_QUANTITY', message: err.message })
      }
      next(err)
    }
  },

  /**
   * POST /api/v1/inventory/issues
   */
  async recordIssue(req, res, next) {
    try {
      const { product_id, productId, branch_id, branchId, branch, quantity, reference, notes, reason } = req.body
      const user = req.user
      const isSuperAdmin = user?.isSuperAdmin || user?.role === 'Super Admin' || !user?.branch_id || user?.branch_id === 'ALL'
      const targetBranch = isSuperAdmin 
        ? (resolveBranchId(branch_id || branchId || branch) || 'BR-01')
        : (resolveBranchId(user?.branch_id) || 'BR-01')

      const result = await InventoryModel.recordIssue({
        product_id: product_id || productId,
        branch_id: targetBranch,
        branch,
        quantity,
        user: user?.name || user?.username || 'Store Officer',
        reference,
        notes,
        reason
      })

      res.status(200).json({
        ok: true,
        message: 'Stock issue processed successfully',
        data: result
      })
    } catch (err) {
      if (err.message && (err.message.includes('Insufficient available stock') || err.message.includes('greater than 0'))) {
        return res.status(400).json({ ok: false, error: 'INSUFFICIENT_STOCK', message: err.message })
      }
      next(err)
    }
  },

  /**
   * GET /api/v1/inventory/ledger
   */
  async getLedger(req, res, next) {
    try {
      const { product_id, productId, limit, offset } = req.query
      const effectiveBranch = getEffectiveBranch(req)

      const ledger = await InventoryModel.getMovementLedger({
        product_id: product_id || productId,
        branch_id: effectiveBranch,
        limit: limit ? parseInt(limit, 10) : 100,
        offset: offset ? parseInt(offset, 10) : 0
      })

      res.status(200).json(ledger)
    } catch (err) {
      next(err)
    }
  },

  /**
   * GET /api/v1/inventory/adjustments
   */
  async listAdjustments(req, res, next) {
    try {
      const { status, search, limit, offset } = req.query
      const effectiveBranch = getEffectiveBranch(req)

      const adjustments = await InventoryModel.findAllAdjustments({
        branch_id: effectiveBranch,
        status,
        search,
        limit: limit ? parseInt(limit, 10) : 100,
        offset: offset ? parseInt(offset, 10) : 0
      })

      res.status(200).json(adjustments)
    } catch (err) {
      next(err)
    }
  },

  /**
   * GET /api/v1/inventory/adjustments/:id
   */
  async getAdjustmentById(req, res, next) {
    try {
      const { id } = req.params
      const adj = await InventoryModel.findAdjustmentById(id)

      if (!adj) {
        return res.status(404).json({
          ok: false,
          error: 'NOT_FOUND',
          message: `Stock adjustment '${id}' not found`
        })
      }

      // Prevent cross-branch IDOR
      if (!assertBranchAccess(adj.branch_id, req, res)) return

      res.status(200).json(adj)
    } catch (err) {
      next(err)
    }
  },

  /**
   * POST /api/v1/inventory/adjustments
   */
  async createAdjustment(req, res, next) {
    try {
      const { reason, product_id, product, productUnit, existingState, correctedState, branch } = req.body

      if (!reason || typeof reason !== 'string' || reason.trim() === '') {
        return res.status(422).json({
          ok: false,
          error: 'VALIDATION_ERROR',
          message: 'Adjustment reason is mandatory and cannot be empty.'
        })
      }

      let oldQ = req.body.old_quantity !== undefined ? req.body.old_quantity : 0
      let newQ = req.body.new_quantity !== undefined ? req.body.new_quantity : 0

      if (existingState && typeof existingState === 'string') {
        const match = existingState.match(/\d+/)
        if (match) oldQ = parseInt(match[0], 10)
      }
      if (correctedState && typeof correctedState === 'string') {
        const match = correctedState.match(/\d+/)
        if (match) newQ = parseInt(match[0], 10)
      }

      const user = req.user
      const isSuperAdmin = user?.isSuperAdmin || user?.role === 'Super Admin' || !user?.branch_id || user?.branch_id === 'ALL'
      const targetBranch = isSuperAdmin
        ? (resolveBranchId(req.body.branch_id || req.body.branchId || branch) || 'BR-01')
        : (resolveBranchId(user?.branch_id) || 'BR-01')

      const adj = await InventoryModel.createAdjustment({
        ...req.body,
        branch_id: targetBranch,
        branch,
        product_id: product_id || req.body.productId,
        productName: product || productUnit,
        old_quantity: oldQ,
        new_quantity: newQ,
        reason: reason.trim()
      })

      res.status(201).json(adj)
    } catch (err) {
      if (err.status === 422) {
        return res.status(422).json({ ok: false, error: 'VALIDATION_ERROR', message: err.message })
      }
      next(err)
    }
  },

  /**
   * POST /api/v1/inventory/adjustments/:id/approve
   */
  async approveAdjustment(req, res, next) {
    try {
      const { id } = req.params
      const existing = await InventoryModel.findAdjustmentById(id)
      if (!existing) {
        return res.status(404).json({ ok: false, error: 'NOT_FOUND', message: `Adjustment ${id} not found` })
      }

      if (!assertBranchAccess(existing.branch_id, req, res)) return

      const approvedBy = req.body.approved_by || req.body.approvedBy || req.user?.name || req.user?.username || 'Super Admin'
      const adj = await InventoryModel.approveAdjustment(id, approvedBy)

      res.status(200).json({
        ok: true,
        message: `Adjustment ${id} approved and stock ledger updated`,
        adjustment: adj
      })
    } catch (err) {
      if (err.message && err.message.includes('not found')) {
        return res.status(404).json({ ok: false, error: 'NOT_FOUND', message: err.message })
      }
      if (err.message && err.message.includes('already approved')) {
        return res.status(409).json({ ok: false, error: 'ALREADY_APPROVED', message: err.message })
      }
      if (err.message && err.message.includes('below reserved')) {
        return res.status(400).json({ ok: false, error: 'INSUFFICIENT_STOCK', message: err.message })
      }
      next(err)
    }
  },

  /**
   * POST /api/v1/inventory/adjustments/:id/reject
   */
  async rejectAdjustment(req, res, next) {
    try {
      const { id } = req.params
      const existing = await InventoryModel.findAdjustmentById(id)
      if (!existing) {
        return res.status(404).json({ ok: false, error: 'NOT_FOUND', message: `Adjustment ${id} not found` })
      }

      if (!assertBranchAccess(existing.branch_id, req, res)) return

      const { reason } = req.body
      const rejectedBy = req.user?.name || req.user?.username || 'Super Admin'
      const adj = await InventoryModel.rejectAdjustment(id, rejectedBy, reason)

      res.status(200).json({
        ok: true,
        message: `Adjustment ${id} rejected`,
        adjustment: adj
      })
    } catch (err) {
      next(err)
    }
  },

  /**
   * GET /api/v1/inventory/transfers
   */
  async listTransfers(req, res, next) {
    try {
      const { status, search, limit, offset } = req.query
      const effectiveBranch = getEffectiveBranch(req)

      const transfers = await InventoryModel.findAllTransfers({
        branch_id: effectiveBranch,
        status,
        search,
        limit: limit ? parseInt(limit, 10) : 100,
        offset: offset ? parseInt(offset, 10) : 0
      })

      res.status(200).json(transfers)
    } catch (err) {
      next(err)
    }
  },

  /**
   * GET /api/v1/inventory/transfers/:id
   */
  async getTransferById(req, res, next) {
    try {
      const { id } = req.params
      const transfer = await InventoryModel.findTransferById(id)

      if (!transfer) {
        return res.status(404).json({
          ok: false,
          error: 'NOT_FOUND',
          message: `Transfer '${id}' not found`
        })
      }

      const user = req.user
      const isSuperAdmin = user?.isSuperAdmin || user?.role === 'Super Admin' || !user?.branch_id || user?.branch_id === 'ALL'
      if (!isSuperAdmin) {
        const uBranch = resolveBranchId(user?.branch_id)
        if (uBranch !== resolveBranchId(transfer.from_branch_id) && uBranch !== resolveBranchId(transfer.to_branch_id)) {
          return res.status(403).json({
            ok: false,
            error: 'FORBIDDEN',
            message: 'Access denied: You do not have permission to access transfers for other branches.'
          })
        }
      }

      res.status(200).json(transfer)
    } catch (err) {
      next(err)
    }
  },

  /**
   * POST /api/v1/inventory/transfers
   */
  async createTransfer(req, res, next) {
    try {
      const rawFrom = req.body.from_branch_id || req.body.fromBranchId || req.body.fromBranch_id || req.body.fromBranch || req.body.from_branch
      const rawTo = req.body.to_branch_id || req.body.toBranchId || req.body.toBranch_id || req.body.toBranch || req.body.to_branch
      const { items } = req.body

      const fBranch = resolveBranchId(rawFrom)
      const tBranch = resolveBranchId(rawTo)

      if (!fBranch || !tBranch) {
        return res.status(400).json({
          ok: false,
          error: 'VALIDATION_ERROR',
          message: 'Origin and destination branches are both required.'
        })
      }

      if (fBranch === tBranch) {
        return res.status(400).json({
          ok: false,
          error: 'SAME_BRANCH_TRANSFER',
          message: 'Source and destination branches cannot be the same.'
        })
      }

      const user = req.user
      const isSuperAdmin = user?.isSuperAdmin || user?.role === 'Super Admin' || !user?.branch_id || user?.branch_id === 'ALL'
      if (!isSuperAdmin && resolveBranchId(user?.branch_id) !== fBranch) {
        return res.status(403).json({
          ok: false,
          error: 'FORBIDDEN',
          message: 'Access denied: You can only initiate transfers from your own branch.'
        })
      }

      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({
          ok: false,
          error: 'VALIDATION_ERROR',
          message: 'At least one item must be included in the transfer request.'
        })
      }

      const transfer = await InventoryModel.createTransfer({
        ...req.body,
        from_branch_id: fBranch,
        to_branch_id: tBranch,
        requested_by: req.body.requested_by || req.body.requestedBy || user?.name || user?.username || 'Store Officer'
      })

      res.status(201).json(transfer)
    } catch (err) {
      if (err.message && err.message.includes('Insufficient available stock')) {
        return res.status(400).json({
          ok: false,
          error: 'INSUFFICIENT_STOCK',
          message: err.message
        })
      }
      next(err)
    }
  },

  /**
   * POST /api/v1/inventory/transfers/:id/dispatch
   */
  async dispatchTransfer(req, res, next) {
    try {
      const { id } = req.params
      const existing = await InventoryModel.findTransferById(id)
      if (!existing) {
        return res.status(404).json({ ok: false, error: 'NOT_FOUND', message: `Transfer ${id} not found` })
      }

      const user = req.user
      const isSuperAdmin = user?.isSuperAdmin || user?.role === 'Super Admin' || !user?.branch_id || user?.branch_id === 'ALL'
      if (!isSuperAdmin && resolveBranchId(user?.branch_id) !== resolveBranchId(existing.from_branch_id)) {
        return res.status(403).json({
          ok: false,
          error: 'FORBIDDEN',
          message: 'Access denied: You can only dispatch transfers originating from your branch.'
        })
      }

      const dispatchedBy = req.body.dispatchedBy || req.body.dispatched_by || user?.name || user?.username || 'Dispatcher'
      const transfer = await InventoryModel.dispatchTransfer(id, { ...req.body, dispatched_by: dispatchedBy })
      res.status(200).json({ ok: true, transfer, ...transfer })
    } catch (err) {
      if (err.message && err.message.includes('already dispatched')) {
        return res.status(409).json({ ok: false, error: 'ALREADY_DISPATCHED', message: err.message })
      }
      if (err.message && err.message.includes('Insufficient available stock')) {
        return res.status(400).json({ ok: false, error: 'INSUFFICIENT_STOCK', message: err.message })
      }
      next(err)
    }
  },

  /**
   * POST /api/v1/inventory/transfers/:id/receive
   */
  async receiveTransfer(req, res, next) {
    try {
      const { id } = req.params
      const existing = await InventoryModel.findTransferById(id)
      if (!existing) {
        return res.status(404).json({ ok: false, error: 'NOT_FOUND', message: `Transfer ${id} not found` })
      }

      const user = req.user
      const isSuperAdmin = user?.isSuperAdmin || user?.role === 'Super Admin' || !user?.branch_id || user?.branch_id === 'ALL'
      if (!isSuperAdmin && resolveBranchId(user?.branch_id) !== resolveBranchId(existing.to_branch_id)) {
        return res.status(403).json({
          ok: false,
          error: 'FORBIDDEN',
          message: 'Access denied: You can only receive transfers destined for your branch.'
        })
      }

      const receivedBy = req.body.receiverName || req.body.received_by || user?.name || user?.username || 'Receiver'
      const transfer = await InventoryModel.receiveTransfer(id, { ...req.body, received_by: receivedBy })
      res.status(200).json({ ok: true, transfer, ...transfer })
    } catch (err) {
      if (err.message && err.message.includes('already received')) {
        return res.status(409).json({ ok: false, error: 'ALREADY_RECEIVED', message: err.message })
      }
      if (err.message && err.message.includes('must be Dispatched')) {
        return res.status(400).json({ ok: false, error: 'INVALID_STATE', message: err.message })
      }
      next(err)
    }
  },

  /**
   * GET /api/v1/inventory/units
   */
  async listUnits(req, res, next) {
    try {
      const { product_id, productId, status, limit, offset } = req.query
      const effectiveBranch = getEffectiveBranch(req)

      const units = await InventoryModel.findAllUnits({
        product_id: product_id || productId,
        branch_id: effectiveBranch,
        status,
        limit: limit ? parseInt(limit, 10) : 100,
        offset: offset ? parseInt(offset, 10) : 0
      })

      res.status(200).json(units)
    } catch (err) {
      next(err)
    }
  },

  /**
   * GET /api/v1/inventory/units/:id
   */
  async getUnitById(req, res, next) {
    try {
      const { id } = req.params
      const unit = await InventoryModel.findUnitById(id)

      if (!unit) {
        return res.status(404).json({
          ok: false,
          error: 'NOT_FOUND',
          message: `Serialized unit '${id}' not found`
        })
      }

      if (!assertBranchAccess(unit.branch_id, req, res)) return

      res.status(200).json(unit)
    } catch (err) {
      next(err)
    }
  },

  /**
   * POST /api/v1/inventory/units/:id/transition
   */
  async transitionUnit(req, res, next) {
    try {
      const { id } = req.params
      const existing = await InventoryModel.findUnitById(id)
      if (!existing) {
        return res.status(404).json({ ok: false, error: 'NOT_FOUND', message: `Unit '${id}' not found` })
      }

      if (!assertBranchAccess(existing.branch_id, req, res)) return

      const updated = await InventoryModel.transitionUnitStatus(id, req.body)
      res.status(200).json(updated)
    } catch (err) {
      next(err)
    }
  },

  /**
   * POST /api/v1/inventory/units/:id/reserve
   */
  async reserveUnit(req, res, next) {
    try {
      const { id } = req.params
      const existing = await InventoryModel.findUnitById(id)
      if (!existing) {
        return res.status(404).json({ ok: false, error: 'NOT_FOUND', message: `Unit '${id}' not found` })
      }

      if (!assertBranchAccess(existing.branch_id, req, res)) return

      const result = await InventoryModel.reserveUnit(id, req.body)
      res.status(200).json(result)
    } catch (err) {
      next(err)
    }
  },

  /**
   * POST /api/v1/inventory/units/:id/release-reservation
   */
  async releaseUnit(req, res, next) {
    try {
      const { id } = req.params
      const existing = await InventoryModel.findUnitById(id)
      if (!existing) {
        return res.status(404).json({ ok: false, error: 'NOT_FOUND', message: `Unit '${id}' not found` })
      }

      if (!assertBranchAccess(existing.branch_id, req, res)) return

      const result = await InventoryModel.releaseUnitReservation(id, req.body)
      res.status(200).json(result)
    } catch (err) {
      next(err)
    }
  }
}
