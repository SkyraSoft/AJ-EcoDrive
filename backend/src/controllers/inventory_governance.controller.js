import { CycleCountModel, QuarantineModel, StockRequestModel } from '../models/inventory_governance.model.js'
import { getEffectiveBranch } from '../utils/branchScope.js'

export const InventoryGovernanceController = {
  // ==========================================
  // 1. Cycle Counts
  // ==========================================
  async listCycleCounts(req, res, next) {
    try {
      const { status, search, limit, offset } = req.query
      const branchId = getEffectiveBranch(req)
      const data = await CycleCountModel.findAll({
        branch_id: branchId,
        status,
        search,
        limit,
        offset
      })
      res.status(200).json({ ok: true, data })
    } catch (err) {
      next(err)
    }
  },

  async getCycleCountById(req, res, next) {
    try {
      const { id } = req.params
      const record = await CycleCountModel.findById(id)
      if (!record) {
        return res.status(404).json({ ok: false, error: 'NOT_FOUND', message: `Cycle count ${id} not found` })
      }
      res.status(200).json({ ok: true, data: record })
    } catch (err) {
      next(err)
    }
  },

  async createCycleCount(req, res, next) {
    try {
      const name = req.body.name || req.body.countName
      const scope = req.body.scope

      if (!name || !String(name).trim()) {
        return res.status(400).json({ ok: false, error: 'VALIDATION_ERROR', message: 'Cycle count name is required' })
      }
      if (!scope || !String(scope).trim()) {
        return res.status(400).json({ ok: false, error: 'VALIDATION_ERROR', message: 'Count scope is required' })
      }

      const branchId = req.body.branch_id || getEffectiveBranch(req) || 'BR-01'
      const created = await CycleCountModel.create({ ...req.body, branch_id: branchId })
      res.status(201).json({ ok: true, data: created })
    } catch (err) {
      next(err)
    }
  },

  async updateCycleCount(req, res, next) {
    try {
      const { id } = req.params
      const updated = await CycleCountModel.update(id, req.body)
      if (!updated) {
        return res.status(404).json({ ok: false, error: 'NOT_FOUND', message: `Cycle count ${id} not found` })
      }
      res.status(200).json({ ok: true, data: updated })
    } catch (err) {
      next(err)
    }
  },

  async deleteCycleCount(req, res, next) {
    try {
      const { id } = req.params
      const deleted = await CycleCountModel.delete(id)
      if (!deleted) {
        return res.status(404).json({ ok: false, error: 'NOT_FOUND', message: `Cycle count ${id} not found` })
      }
      res.status(200).json({ ok: true, message: `Cycle count ${id} deleted successfully` })
    } catch (err) {
      next(err)
    }
  },

  // ==========================================
  // 2. Quarantine Records
  // ==========================================
  async listQuarantine(req, res, next) {
    try {
      const { status, search, limit, offset } = req.query
      const branchId = getEffectiveBranch(req)
      const data = await QuarantineModel.findAll({
        branch_id: branchId,
        status,
        search,
        limit,
        offset
      })
      res.status(200).json({ ok: true, data })
    } catch (err) {
      next(err)
    }
  },

  async getQuarantineById(req, res, next) {
    try {
      const { id } = req.params
      const record = await QuarantineModel.findById(id)
      if (!record) {
        return res.status(404).json({ ok: false, error: 'NOT_FOUND', message: `Quarantine record ${id} not found` })
      }
      res.status(200).json({ ok: true, data: record })
    } catch (err) {
      next(err)
    }
  },

  async createQuarantine(req, res, next) {
    try {
      const unit = req.body.unit
      const product = req.body.product
      const condition = req.body.condition || req.body.condition_desc

      if (!unit || !String(unit).trim()) {
        return res.status(400).json({ ok: false, error: 'VALIDATION_ERROR', message: 'Unit serial / VIN is required' })
      }
      if (!product || !String(product).trim()) {
        return res.status(400).json({ ok: false, error: 'VALIDATION_ERROR', message: 'Product name is required' })
      }
      if (!condition || !String(condition).trim()) {
        return res.status(400).json({ ok: false, error: 'VALIDATION_ERROR', message: 'Physical condition description is required' })
      }

      const branchId = req.body.branch_id || getEffectiveBranch(req) || 'BR-01'
      const created = await QuarantineModel.create({ ...req.body, branch_id: branchId })
      res.status(201).json({ ok: true, data: created })
    } catch (err) {
      next(err)
    }
  },

  async updateQuarantine(req, res, next) {
    try {
      const { id } = req.params
      const updated = await QuarantineModel.update(id, req.body)
      if (!updated) {
        return res.status(404).json({ ok: false, error: 'NOT_FOUND', message: `Quarantine record ${id} not found` })
      }
      res.status(200).json({ ok: true, data: updated })
    } catch (err) {
      next(err)
    }
  },

  async deleteQuarantine(req, res, next) {
    try {
      const { id } = req.params
      const deleted = await QuarantineModel.delete(id)
      if (!deleted) {
        return res.status(404).json({ ok: false, error: 'NOT_FOUND', message: `Quarantine record ${id} not found` })
      }
      res.status(200).json({ ok: true, message: `Quarantine record ${id} deleted successfully` })
    } catch (err) {
      next(err)
    }
  },

  // ==========================================
  // 3. Stock Requests
  // ==========================================
  async listStockRequests(req, res, next) {
    try {
      const { status, search, limit, offset } = req.query
      const branchId = getEffectiveBranch(req)
      const data = await StockRequestModel.findAll({
        branch_id: branchId,
        status,
        search,
        limit,
        offset
      })
      res.status(200).json({ ok: true, data })
    } catch (err) {
      next(err)
    }
  },

  async getStockRequestById(req, res, next) {
    try {
      const { id } = req.params
      const record = await StockRequestModel.findById(id)
      if (!record) {
        return res.status(404).json({ ok: false, error: 'NOT_FOUND', message: `Stock request ${id} not found` })
      }
      res.status(200).json({ ok: true, data: record })
    } catch (err) {
      next(err)
    }
  },

  async createStockRequest(req, res, next) {
    try {
      const product = req.body.product
      const qty = req.body.qty !== undefined ? req.body.qty : req.body.requestedQty
      const reason = req.body.reason

      if (!product || !String(product).trim()) {
        return res.status(400).json({ ok: false, error: 'VALIDATION_ERROR', message: 'Product is required' })
      }
      if (!qty || Number(qty) <= 0) {
        return res.status(400).json({ ok: false, error: 'VALIDATION_ERROR', message: 'Requested quantity must be at least 1' })
      }
      if (!reason || !String(reason).trim()) {
        return res.status(400).json({ ok: false, error: 'VALIDATION_ERROR', message: 'Business justification / reason is required' })
      }

      const branchId = req.body.branch_id || getEffectiveBranch(req) || 'BR-01'
      const created = await StockRequestModel.create({ ...req.body, branch_id: branchId })
      res.status(201).json({ ok: true, data: created })
    } catch (err) {
      next(err)
    }
  },

  async updateStockRequest(req, res, next) {
    try {
      const { id } = req.params
      const updated = await StockRequestModel.update(id, req.body)
      if (!updated) {
        return res.status(404).json({ ok: false, error: 'NOT_FOUND', message: `Stock request ${id} not found` })
      }
      res.status(200).json({ ok: true, data: updated })
    } catch (err) {
      next(err)
    }
  },

  async deleteStockRequest(req, res, next) {
    try {
      const { id } = req.params
      const deleted = await StockRequestModel.delete(id)
      if (!deleted) {
        return res.status(404).json({ ok: false, error: 'NOT_FOUND', message: `Stock request ${id} not found` })
      }
      res.status(200).json({ ok: true, message: `Stock request ${id} deleted successfully` })
    } catch (err) {
      next(err)
    }
  }
}
