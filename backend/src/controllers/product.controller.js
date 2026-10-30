import { ProductModel } from '../models/product.model.js'
import { getEffectiveBranch } from '../utils/branchScope.js'

export const ProductController = {
  /**
   * GET /api/v1/catalogue/products or /api/v1/products
   */
  async listProducts(req, res, next) {
    try {
      const { category_id, search, status, low_stock, limit, offset } = req.query

      const effectiveBranch = getEffectiveBranch(req)

      const products = await ProductModel.findAll({
        category_id,
        branch_id: effectiveBranch,
        search,
        status,
        low_stock: low_stock === 'true' || low_stock === '1',
        limit: limit ? parseInt(limit, 10) : 100,
        offset: offset ? parseInt(offset, 10) : 0
      })

      res.status(200).json(products)
    } catch (err) {
      next(err)
    }
  },

  /**
   * GET /api/v1/catalogue/products/:id or /api/v1/products/:id
   */
  async getProductById(req, res, next) {
    try {
      const { id } = req.params
      const effectiveBranch = getEffectiveBranch(req)
      const product = await ProductModel.findById(id, effectiveBranch)

      if (!product) {
        return res.status(404).json({
          ok: false,
          error: 'NOT_FOUND',
          message: `Product '${id}' not found`
        })
      }

      res.status(200).json(product)
    } catch (err) {
      next(err)
    }
  },

  /**
   * POST /api/v1/catalogue/products or /api/v1/products
   */
  async createProduct(req, res, next) {
    try {
      const { name, sku, category_id, category, selling_price, sellingPrice, cost_price, costPrice, dealer_price, dealerPrice, reorder_level, reorderLevel } = req.body

      if (!name || !String(name).trim()) {
        return res.status(400).json({
          ok: false,
          error: 'VALIDATION_ERROR',
          message: 'Product name is required'
        })
      }

      if (!sku || !String(sku).trim()) {
        return res.status(400).json({
          ok: false,
          error: 'VALIDATION_ERROR',
          message: 'Product SKU is required'
        })
      }

      const product = await ProductModel.create({
        ...req.body,
        name: String(name).trim(),
        sku: String(sku).trim(),
        categoryId: category_id || req.body.categoryId,
        category,
        sellingPrice: sellingPrice !== undefined ? sellingPrice : selling_price,
        costPrice: costPrice !== undefined ? costPrice : cost_price,
        dealerPrice: dealerPrice !== undefined ? dealerPrice : dealer_price,
        reorderLevel: reorderLevel !== undefined ? reorderLevel : reorder_level
      })

      res.status(201).json(product)
    } catch (err) {
      if (err.message && err.message.includes('already exists')) {
        return res.status(409).json({
          ok: false,
          error: 'DUPLICATE_SKU',
          message: err.message
        })
      }
      next(err)
    }
  },

  /**
   * PUT /api/v1/catalogue/products/:id or /api/v1/products/:id
   */
  async updateProduct(req, res, next) {
    try {
      const { id } = req.params
      const product = await ProductModel.update(id, req.body)

      res.status(200).json(product)
    } catch (err) {
      if (err.message && err.message.includes('already taken')) {
        return res.status(409).json({
          ok: false,
          error: 'DUPLICATE_SKU',
          message: err.message
        })
      }
      if (err.message && err.message.includes('not found')) {
        return res.status(404).json({
          ok: false,
          error: 'NOT_FOUND',
          message: err.message
        })
      }
      next(err)
    }
  },

  /**
   * GET /api/v1/catalogue/categories or /api/v1/categories
   */
  async listCategories(req, res, next) {
    try {
      const categories = await ProductModel.findAllCategories()
      res.status(200).json(categories)
    } catch (err) {
      next(err)
    }
  },

  /**
   * POST /api/v1/catalogue/categories or /api/v1/categories
   */
  async createCategory(req, res, next) {
    try {
      const { name, code, description, status } = req.body

      if (!name || !String(name).trim()) {
        return res.status(400).json({
          ok: false,
          error: 'VALIDATION_ERROR',
          message: 'Category name is required'
        })
      }

      if (!code || !String(code).trim()) {
        return res.status(400).json({
          ok: false,
          error: 'VALIDATION_ERROR',
          message: 'Category code is required'
        })
      }

      const category = await ProductModel.createCategory({
        name,
        code,
        description,
        status
      })

      res.status(201).json(category)
    } catch (err) {
      if (err.message && err.message.includes('already exists')) {
        return res.status(409).json({
          ok: false,
          error: 'DUPLICATE_CODE',
          message: err.message
        })
      }
      next(err)
    }
  },

  /**
   * Pricing rules stubs
   */
  async listPricingRules(req, res) {
    res.status(200).json([])
  },

  async createPricingRule(req, res) {
    res.status(201).json({ id: 'PR-01', ...req.body, status: 'Active' })
  }
}
