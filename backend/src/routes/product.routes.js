import { Router } from 'express'
import { ProductController } from '../controllers/product.controller.js'
import { CatalogueExtensionsController } from '../controllers/catalogue_extensions.controller.js'
import { authorizeRoles } from '../middleware/auth.js'

const router = Router()

// Category routes
router.get('/categories', ProductController.listCategories)
router.post('/categories', authorizeRoles('Super Admin', 'Director', 'Owner'), ProductController.createCategory)

// Pricing rules routes (Modifications strictly restricted to Super Admin)
router.get('/pricing-rules', CatalogueExtensionsController.listPriceRules)
router.get('/pricing-rules/resolve', CatalogueExtensionsController.resolvePriceRule)
router.post('/pricing-rules/resolve', CatalogueExtensionsController.resolvePriceRule)
router.get('/pricing-rules/:id', CatalogueExtensionsController.getPriceRuleById)
router.post('/pricing-rules', authorizeRoles('Super Admin', 'Director', 'Owner'), CatalogueExtensionsController.createPriceRule)
router.put('/pricing-rules/:id', authorizeRoles('Super Admin', 'Director', 'Owner'), CatalogueExtensionsController.updatePriceRule)
router.delete('/pricing-rules/:id', authorizeRoles('Super Admin', 'Director', 'Owner'), CatalogueExtensionsController.deletePriceRule)

// Product requests routes
router.get('/product-requests', CatalogueExtensionsController.listProductRequests)
router.get('/product-requests/:id', CatalogueExtensionsController.getProductRequestById)
router.post('/product-requests', CatalogueExtensionsController.createProductRequest)
router.put('/product-requests/:id', CatalogueExtensionsController.updateProductRequest)
router.delete('/product-requests/:id', CatalogueExtensionsController.deleteProductRequest)

// Product routes
router.get('/products', ProductController.listProducts)
router.get('/products/:id', ProductController.getProductById)
router.post('/products', ProductController.createProduct)
router.put('/products/:id', ProductController.updateProduct)

// Root catalogue endpoints
router.get('/', ProductController.listProducts)
router.post('/', ProductController.createProduct)
router.get('/:id', ProductController.getProductById)
router.put('/:id', ProductController.updateProduct)

export default router
