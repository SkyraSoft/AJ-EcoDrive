import { Router } from 'express'
import { ProductController } from '../controllers/product.controller.js'
import { authorizeRoles } from '../middleware/auth.js'

const router = Router()

const CATALOGUE_ADMIN_ROLES = ['Super Admin', 'Director', 'Owner']

router.get('/', ProductController.listCategories)
router.post('/', authorizeRoles(...CATALOGUE_ADMIN_ROLES), ProductController.createCategory)

export default router
