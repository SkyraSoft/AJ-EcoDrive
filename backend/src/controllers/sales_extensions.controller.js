import { CustomOrderModel, DeliveryHandoverModel, SalesReturnModel } from '../models/sales_extensions.model.js'
import { OrderModel } from '../models/order.model.js'
import { query } from '../config/db.js'
import { getEffectiveBranch, assertBranchAccess, assertSuperAdminRole, isUserSuperAdmin } from '../utils/branchScope.js'

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
      const existing = await DeliveryHandoverModel.findById(id)
      if (!existing) {
        return res.status(404).json({ ok: false, error: 'NOT_FOUND', message: `Delivery handover ${id} not found` })
      }

      // 1. Payment Clearance Verification
      const orderId = existing.order_id || req.body.order_id || existing.id
      let isCleared = false
      let orderRecord = null

      if (orderId) {
        orderRecord = await OrderModel.findById(orderId)
      }

      if (orderRecord) {
        const bal = parseFloat(String(orderRecord.balance || orderRecord.outstanding_amount || 0).replace(/[^0-9.]/g, ''))
        const pStatus = String(orderRecord.payment_status || orderRecord.status || '').toLowerCase()
        if (pStatus === 'paid' || bal === 0 || req.body.payment_complete === true || req.body.payment_complete === 1 || existing.payment_complete) {
          isCleared = true
        }
      } else if (existing.payment_complete || req.body.payment_complete) {
        isCleared = true
      }

      if (!isCleared) {
        return res.status(400).json({
          ok: false,
          error: 'PAYMENT_UNCLEARED',
          message: 'Vehicle cannot be marked Delivered or authorized for Gate Pass without 100% payment clearance.'
        })
      }

      // 2. Generate Security Gate Pass number
      const gatePassNo = existing.gate_pass_number || req.body.gate_pass_number || `GP-DEL-${Math.floor(1000 + Math.random() * 9000)}`

      const updated = await DeliveryHandoverModel.update(id, {
        status: 'Delivered',
        status_class: 'bg-[#165A31] text-white',
        statusClass: 'bg-[#165A31] text-white',
        payment_complete: 1,
        gate_pass_number: gatePassNo,
        delivered_at: new Date(),
        ...req.body
      })

      // 3. Update allocated serialized unit status to Delivered
      const unitIdentifier = existing.unit || existing.unit_id || req.body.unit || req.body.unit_id
      if (unitIdentifier) {
        try {
          await query(
            'UPDATE `serialized_units` SET `status` = "Delivered", `status_class` = "bg-[#165A31] text-white", `location` = "Customer Handover" WHERE `id` = ? OR `unit_id` = ? OR `serial_number` = ? OR `chassis_number` = ? OR `vin` = ?',
            [unitIdentifier, unitIdentifier, unitIdentifier, unitIdentifier, unitIdentifier]
          )
        } catch (e) {
          console.warn('[completeDelivery] Unit status update note:', e.message)
        }
      }

      // 4. Update order status if exists
      if (orderRecord) {
        try {
          await query(
            'UPDATE `orders` SET `delivery_status` = "Delivered", `status` = "Completed" WHERE `id` = ?',
            [orderRecord.id]
          )
        } catch (e) {
          console.warn('[completeDelivery] Order status update note:', e.message)
        }
      }

      res.status(200).json({ ok: true, data: { ...updated, gate_pass_number: gatePassNo } })
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
      const existing = await SalesReturnModel.findById(id)
      if (!existing) {
        return res.status(404).json({ ok: false, error: 'NOT_FOUND', message: `Sales return ${id} not found` })
      }
      if (!assertBranchAccess(existing.branch_id, req, res)) return

      if (req.body.status && (req.body.status === 'Approved' || req.body.status === 'Refunded')) {
        if (!assertSuperAdminRole(req, res, 'Sales Return & Refund Approval')) return
      }

      const updated = await SalesReturnModel.update(id, req.body)
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
