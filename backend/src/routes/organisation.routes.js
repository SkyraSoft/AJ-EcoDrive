import { Router } from 'express'
import { OrganisationController } from '../controllers/organisation.controller.js'
import { authenticateJWT, authorizePermissions } from '../middleware/auth.js'

const router = Router()

router.use(authenticateJWT)

// Branches
router.get('/branches', OrganisationController.listBranches)
router.get('/branches/:id', OrganisationController.getBranchById)
router.post('/branches', authorizePermissions('organisation.write', 'admin'), OrganisationController.createBranch)
router.put('/branches/:id', authorizePermissions('organisation.write', 'admin'), OrganisationController.updateBranch)

// Users
router.get('/users', OrganisationController.listUsers)
router.get('/users/:id', OrganisationController.getUserById)
router.post('/users', authorizePermissions('users.write', 'admin'), OrganisationController.createUser)
router.put('/users/:id', authorizePermissions('users.write', 'admin'), OrganisationController.updateUser)

// Roles
router.get('/roles', OrganisationController.listRoles)
router.post('/roles', authorizePermissions('roles.write', 'admin'), OrganisationController.createRole)

export default router
