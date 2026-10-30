import { PriceRuleModel, ProductRequestModel } from '../models/catalogue_extensions.model.js'
import { getEffectiveBranch } from '../utils/branchScope.js'

export const CatalogueExtensionsController = {
  // ==========================================
  // 1. Price Rules
  // ==========================================
  async listPriceRules(req, res, next) {
    try {
      const { status, search, limit, offset } = req.query
      const branchId = getEffectiveBranch(req)
      const data = await PriceRuleModel.findAll({
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

  async getPriceRuleById(req, res, next) {
    try {
      const { id } = req.params
      const record = await PriceRuleModel.findById(id)
      if (!record) {
        return res.status(404).json({ ok: false, error: 'NOT_FOUND', message: `Price rule ${id} not found` })
      }
      res.status(200).json({ ok: true, data: record })
    } catch (err) {
      next(err)
    }
  },

  async createPriceRule(req, res, next) {
    try {
      const { product, sellingPrice, selling_price, minimum } = req.body
      if (!product || !String(product).trim()) {
        return res.status(400).json({ ok: false, error: 'VALIDATION_ERROR', message: 'Target product is required' })
      }
      if (!sellingPrice && !selling_price) {
        return res.status(400).json({ ok: false, error: 'VALIDATION_ERROR', message: 'Selling price is required' })
      }
      if (!minimum) {
        return res.status(400).json({ ok: false, error: 'VALIDATION_ERROR', message: 'Minimum price threshold is required' })
      }

      const created = await PriceRuleModel.create(req.body)
      res.status(201).json({ ok: true, data: created })
    } catch (err) {
      next(err)
    }
  },

  async updatePriceRule(req, res, next) {
    try {
      const { id } = req.params
      const updated = await PriceRuleModel.update(id, req.body)
      if (!updated) {
        return res.status(404).json({ ok: false, error: 'NOT_FOUND', message: `Price rule ${id} not found` })
      }
      res.status(200).json({ ok: true, data: updated })
    } catch (err) {
      next(err)
    }
  },

  async deletePriceRule(req, res, next) {
    try {
      const { id } = req.params
      const deleted = await PriceRuleModel.delete(id)
      if (!deleted) {
        return res.status(404).json({ ok: false, error: 'NOT_FOUND', message: `Price rule ${id} not found` })
      }
      res.status(200).json({ ok: true, message: `Price rule ${id} deleted successfully` })
    } catch (err) {
      next(err)
    }
  },

  // ==========================================
  // 2. Product Requests
  // ==========================================
  async listProductRequests(req, res, next) {
    try {
      const { status, search, limit, offset } = req.query
      const branchId = getEffectiveBranch(req)
      const data = await ProductRequestModel.findAll({
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

  async getProductRequestById(req, res, next) {
    try {
      const { id } = req.params
      const record = await ProductRequestModel.findById(id)
      if (!record) {
        return res.status(404).json({ ok: false, error: 'NOT_FOUND', message: `Product request ${id} not found` })
      }
      res.status(200).json({ ok: true, data: record })
    } catch (err) {
      next(err)
    }
  },

  async createProductRequest(req, res, next) {
    try {
      const productName = req.body.productName || req.body.product || req.body.product_name
      const category = req.body.category
      const reason = req.body.reason

      if (!productName || !String(productName).trim()) {
        return res.status(400).json({ ok: false, error: 'VALIDATION_ERROR', message: 'Product name is required' })
      }
      if (!category || !String(category).trim()) {
        return res.status(400).json({ ok: false, error: 'VALIDATION_ERROR', message: 'Category is required' })
      }
      if (!reason || !String(reason).trim()) {
        return res.status(400).json({ ok: false, error: 'VALIDATION_ERROR', message: 'Reason for request is required' })
      }

      const branchId = req.body.branch_id || getEffectiveBranch(req) || 'BR-01'
      const created = await ProductRequestModel.create({ ...req.body, branch_id: branchId })
      res.status(201).json({ ok: true, data: created })
    } catch (err) {
      next(err)
    }
  },

  async updateProductRequest(req, res, next) {
    try {
      const { id } = req.params
      const updated = await ProductRequestModel.update(id, req.body)
      if (!updated) {
        return res.status(404).json({ ok: false, error: 'NOT_FOUND', message: `Product request ${id} not found` })
      }
      res.status(200).json({ ok: true, data: updated })
    } catch (err) {
      next(err)
    }
  },

  async deleteProductRequest(req, res, next) {
    try {
      const { id } = req.params
      const deleted = await ProductRequestModel.delete(id)
      if (!deleted) {
        return res.status(404).json({ ok: false, error: 'NOT_FOUND', message: `Product request ${id} not found` })
      }
      res.status(200).json({ ok: true, message: `Product request ${id} deleted successfully` })
    } catch (err) {
      next(err)
    }
  }
}
