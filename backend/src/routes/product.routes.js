import { Router } from 'express'
import { ProductController } from '../controllers/product.controller.js'
import { CatalogueExtensionsController } from '../controllers/catalogue_extensions.controller.js'

const router = Router()

// Category routes
router.get('/categories', ProductController.listCategories)
router.post('/categories', ProductController.createCategory)

// Pricing rules routes
router.get('/pricing-rules', CatalogueExtensionsController.listPriceRules)
router.get('/pricing-rules/:id', CatalogueExtensionsController.getPriceRuleById)
router.post('/pricing-rules', CatalogueExtensionsController.createPriceRule)
router.put('/pricing-rules/:id', CatalogueExtensionsController.updatePriceRule)
router.delete('/pricing-rules/:id', CatalogueExtensionsController.deletePriceRule)

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
