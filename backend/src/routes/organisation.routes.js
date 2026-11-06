import { Router } from 'express'
import { OrganisationController } from '../controllers/organisation.controller.js'
import { authenticateJWT, authorizePermissions, authorizeRoles } from '../middleware/auth.js'

const router = Router()

router.use(authenticateJWT)

// Branches — Super Admin only
router.get('/branches', authorizeRoles('Super Admin', 'Director', 'Owner'), OrganisationController.listBranches)
router.get('/branches/:id', authorizeRoles('Super Admin', 'Director', 'Owner'), OrganisationController.getBranchById)
router.post('/branches', authorizePermissions('organisation.write', 'admin'), OrganisationController.createBranch)
router.put('/branches/:id', authorizePermissions('organisation.write', 'admin'), OrganisationController.updateBranch)

// Users — Super Admin only
router.get('/users', authorizeRoles('Super Admin', 'Director', 'Owner'), OrganisationController.listUsers)
router.get('/users/:id', authorizeRoles('Super Admin', 'Director', 'Owner'), OrganisationController.getUserById)
router.post('/users', authorizePermissions('users.write', 'admin'), OrganisationController.createUser)
router.put('/users/:id', authorizePermissions('users.write', 'admin'), OrganisationController.updateUser)

// Roles — Super Admin only
router.get('/roles', authorizeRoles('Super Admin', 'Director', 'Owner'), OrganisationController.listRoles)
router.post('/roles', authorizePermissions('roles.write', 'admin'), OrganisationController.createRole)

export default router
