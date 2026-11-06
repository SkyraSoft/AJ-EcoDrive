import { Router } from 'express'
import { ProductController } from '../controllers/product.controller.js'
import { CatalogueExtensionsController } from '../controllers/catalogue_extensions.controller.js'
import { authorizeRoles } from '../middleware/auth.js'

const router = Router()

const CATALOGUE_ADMIN_ROLES = ['Super Admin', 'Director', 'Owner']

// Category routes
router.get('/categories', ProductController.listCategories)
router.post('/categories', authorizeRoles(...CATALOGUE_ADMIN_ROLES), ProductController.createCategory)

// Pricing rules routes (Modifications strictly restricted to Super Admin)
router.get('/pricing-rules', CatalogueExtensionsController.listPriceRules)
router.get('/pricing-rules/resolve', CatalogueExtensionsController.resolvePriceRule)
router.post('/pricing-rules/resolve', CatalogueExtensionsController.resolvePriceRule)
router.post('/pricing-rules/validate', CatalogueExtensionsController.validateDiscount)
router.post('/pricing-rules/validate-discount', CatalogueExtensionsController.validateDiscount)
router.get('/pricing-rules/:id', CatalogueExtensionsController.getPriceRuleById)
router.post('/pricing-rules', authorizeRoles(...CATALOGUE_ADMIN_ROLES), CatalogueExtensionsController.createPriceRule)
router.put('/pricing-rules/:id', authorizeRoles(...CATALOGUE_ADMIN_ROLES), CatalogueExtensionsController.updatePriceRule)
router.delete('/pricing-rules/:id', authorizeRoles(...CATALOGUE_ADMIN_ROLES), CatalogueExtensionsController.deletePriceRule)

// Product requests routes
router.get('/product-requests', CatalogueExtensionsController.listProductRequests)
router.get('/product-requests/:id', CatalogueExtensionsController.getProductRequestById)
router.post('/product-requests', CatalogueExtensionsController.createProductRequest)
router.put('/product-requests/:id', CatalogueExtensionsController.updateProductRequest)
router.delete('/product-requests/:id', CatalogueExtensionsController.deleteProductRequest)

// Product routes
router.get('/products', ProductController.listProducts)
router.get('/products/:id', ProductController.getProductById)
router.post('/products', authorizeRoles(...CATALOGUE_ADMIN_ROLES), ProductController.createProduct)
router.put('/products/:id', authorizeRoles(...CATALOGUE_ADMIN_ROLES), ProductController.updateProduct)

// Root catalogue endpoints
router.get('/', ProductController.listProducts)
router.post('/', authorizeRoles(...CATALOGUE_ADMIN_ROLES), ProductController.createProduct)
router.get('/:id', ProductController.getProductById)
router.put('/:id', authorizeRoles(...CATALOGUE_ADMIN_ROLES), ProductController.updateProduct)

export default router
