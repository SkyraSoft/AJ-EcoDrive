import { Router } from 'express'
import { ProductController } from '../controllers/product.controller.js'

const router = Router()

router.get('/', ProductController.listCategories)
router.post('/', ProductController.createCategory)

export default router
