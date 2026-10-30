import { CustomOrderModel, DeliveryHandoverModel, SalesReturnModel } from '../models/sales_extensions.model.js'
import { getEffectiveBranch } from '../utils/branchScope.js'

export const SalesExtensionsController = {
  // ==========================================
  // 1. Custom Orders
  // ==========================================
  async listCustomOrders(req, res, next) {
    try {
      const { status, search, limit, offset } = req.query
      const branchId = getEffectiveBranch(req)
      const data = await CustomOrderModel.findAll({
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

  async getCustomOrderById(req, res, next) {
    try {
      const { id } = req.params
      const record = await CustomOrderModel.findById(id)
      if (!record) {
        return res.status(404).json({ ok: false, error: 'NOT_FOUND', message: `Custom order ${id} not found` })
      }
      res.status(200).json({ ok: true, data: record })
    } catch (err) {
      next(err)
    }
  },

  async createCustomOrder(req, res, next) {
    try {
      const { customer, product, deposit } = req.body
      if (!customer || !String(customer).trim()) {
        return res.status(400).json({ ok: false, error: 'VALIDATION_ERROR', message: 'Customer name is required' })
      }
      if (!product && !req.body.requirement) {
        return res.status(400).json({ ok: false, error: 'VALIDATION_ERROR', message: 'Product or requirement is required' })
      }

      const branchId = req.body.branch_id || getEffectiveBranch(req) || 'BR-01'
      const created = await CustomOrderModel.create({ ...req.body, branch_id: branchId })
      res.status(201).json({ ok: true, data: created })
    } catch (err) {
      next(err)
    }
  },

  async updateCustomOrder(req, res, next) {
    try {
      const { id } = req.params
      const updated = await CustomOrderModel.update(id, req.body)
      if (!updated) {
        return res.status(404).json({ ok: false, error: 'NOT_FOUND', message: `Custom order ${id} not found` })
      }
      res.status(200).json({ ok: true, data: updated })
    } catch (err) {
      next(err)
    }
  },

  async deleteCustomOrder(req, res, next) {
    try {
      const { id } = req.params
      const deleted = await CustomOrderModel.delete(id)
      if (!deleted) {
        return res.status(404).json({ ok: false, error: 'NOT_FOUND', message: `Custom order ${id} not found` })
      }
      res.status(200).json({ ok: true, message: `Custom order ${id} deleted successfully` })
    } catch (err) {
      next(err)
    }
  },

  // ==========================================
  // 2. Delivery Handovers
  // ==========================================
  async listDeliveries(req, res, next) {
    try {
      const { status, search, limit, offset } = req.query
      const branchId = getEffectiveBranch(req)
      const data = await DeliveryHandoverModel.findAll({
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

  async getDeliveryById(req, res, next) {
    try {
      const { id } = req.params
      const record = await DeliveryHandoverModel.findById(id)
      if (!record) {
        return res.status(404).json({ ok: false, error: 'NOT_FOUND', message: `Delivery handover ${id} not found` })
      }
      res.status(200).json({ ok: true, data: record })
    } catch (err) {
      next(err)
    }
  },

  async createDelivery(req, res, next) {
    try {
      const order = req.body.order || req.body.order_id
      const customer = req.body.customer
      const unit = req.body.unit || req.body.unit_id

      if (!order || !String(order).trim()) {
        return res.status(400).json({ ok: false, error: 'VALIDATION_ERROR', message: 'Order reference is required' })
      }
      if (!customer || !String(customer).trim()) {
        return res.status(400).json({ ok: false, error: 'VALIDATION_ERROR', message: 'Customer name is required' })
      }
      if (!unit || !String(unit).trim()) {
        return res.status(400).json({ ok: false, error: 'VALIDATION_ERROR', message: 'Unit serial / VIN is required' })
      }

      const branchId = req.body.branch_id || getEffectiveBranch(req) || 'BR-01'
      const created = await DeliveryHandoverModel.create({ ...req.body, branch_id: branchId })
      res.status(201).json({ ok: true, data: created })
    } catch (err) {
      next(err)
    }
  },

  async updateDelivery(req, res, next) {
    try {
      const { id } = req.params
      const updated = await DeliveryHandoverModel.update(id, req.body)
      if (!updated) {
        return res.status(404).json({ ok: false, error: 'NOT_FOUND', message: `Delivery handover ${id} not found` })
      }
      res.status(200).json({ ok: true, data: updated })
    } catch (err) {
      next(err)
    }
  },

  async completeDelivery(req, res, next) {
    try {
      const { id } = req.params
      const updated = await DeliveryHandoverModel.update(id, {
        status: 'Delivered',
        status_class: 'bg-[#165A31] text-white',
        statusClass: 'bg-[#165A31] text-white',
        ...req.body
      })
      if (!updated) {
        return res.status(404).json({ ok: false, error: 'NOT_FOUND', message: `Delivery handover ${id} not found` })
      }
      res.status(200).json({ ok: true, data: updated })
    } catch (err) {
      next(err)
    }
  },

  async deleteDelivery(req, res, next) {
    try {
      const { id } = req.params
      const deleted = await DeliveryHandoverModel.delete(id)
      if (!deleted) {
        return res.status(404).json({ ok: false, error: 'NOT_FOUND', message: `Delivery handover ${id} not found` })
      }
      res.status(200).json({ ok: true, message: `Delivery handover ${id} deleted successfully` })
    } catch (err) {
      next(err)
    }
  },

  // ==========================================
  // 3. Sales Returns
  // ==========================================
  async listSalesReturns(req, res, next) {
    try {
      const { status, search, limit, offset } = req.query
      const branchId = getEffectiveBranch(req)
      const data = await SalesReturnModel.findAll({
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

  async getSalesReturnById(req, res, next) {
    try {
      const { id } = req.params
      const record = await SalesReturnModel.findById(id)
      if (!record) {
        return res.status(404).json({ ok: false, error: 'NOT_FOUND', message: `Sales return ${id} not found` })
      }
      res.status(200).json({ ok: true, data: record })
    } catch (err) {
      next(err)
    }
  },

  async createSalesReturn(req, res, next) {
    try {
      const orderNo = req.body.order || req.body.orderNo || req.body.order_no
      const customer = req.body.customer
      const unit = req.body.unit

      if (!orderNo || !String(orderNo).trim()) {
        return res.status(400).json({ ok: false, error: 'VALIDATION_ERROR', message: 'Original order number is required' })
      }
      if (!customer || !String(customer).trim()) {
        return res.status(400).json({ ok: false, error: 'VALIDATION_ERROR', message: 'Customer name is required' })
      }
      if (!unit || !String(unit).trim()) {
        return res.status(400).json({ ok: false, error: 'VALIDATION_ERROR', message: 'Unit serial number is required' })
      }

      const branchId = req.body.branch_id || getEffectiveBranch(req) || 'BR-01'
      const created = await SalesReturnModel.create({ ...req.body, branch_id: branchId })
      res.status(201).json({ ok: true, data: created })
    } catch (err) {
      next(err)
    }
  },

  async updateSalesReturn(req, res, next) {
    try {
      const { id } = req.params
      const updated = await SalesReturnModel.update(id, req.body)
      if (!updated) {
        return res.status(404).json({ ok: false, error: 'NOT_FOUND', message: `Sales return ${id} not found` })
      }
      res.status(200).json({ ok: true, data: updated })
    } catch (err) {
      next(err)
    }
  },

  async deleteSalesReturn(req, res, next) {
    try {
      const { id } = req.params
      const deleted = await SalesReturnModel.delete(id)
      if (!deleted) {
        return res.status(404).json({ ok: false, error: 'NOT_FOUND', message: `Sales return ${id} not found` })
      }
      res.status(200).json({ ok: true, message: `Sales return ${id} deleted successfully` })
    } catch (err) {
      next(err)
    }
  }
}
