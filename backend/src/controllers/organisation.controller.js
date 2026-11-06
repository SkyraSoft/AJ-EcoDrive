import { OrganisationModel } from '../models/organisation.model.js'
import { getEffectiveBranch, isUserSuperAdmin, assertSuperAdminRole, assertBranchAccess } from '../utils/branchScope.js'
import { validatePasswordComplexity } from '../utils/security.js'

export const OrganisationController = {
  // Branches
  async listBranches(req, res, next) {
    try {
      if (!assertSuperAdminRole(req, res, 'Listing all branches')) return
      const branches = await OrganisationModel.findAllBranches()
      res.status(200).json(branches)
    } catch (err) {
      next(err)
    }
  },

  async getBranchById(req, res, next) {
    try {
      if (!assertSuperAdminRole(req, res, 'Viewing branch details')) return
      const branch = await OrganisationModel.findBranchById(req.params.id)
      if (!branch) {
        return res.status(404).json({ ok: false, error: 'NOT_FOUND', message: `Branch '${req.params.id}' not found.` })
      }
      res.status(200).json(branch)
    } catch (err) {
      next(err)
    }
  },

  async createBranch(req, res, next) {
    try {
      if (!assertSuperAdminRole(req, res, 'Creating a branch')) return
      const { name, code } = req.body || {}
      if (!name || !String(name).trim()) {
        return res.status(422).json({ ok: false, error: 'VALIDATION_ERROR', message: 'Branch name is required.' })
      }
      if (!code || !String(code).trim()) {
        return res.status(422).json({ ok: false, error: 'VALIDATION_ERROR', message: 'Branch code is required.' })
      }

      const branch = await OrganisationModel.createBranch(req.body)
      res.status(201).json({ ok: true, data: branch, message: 'Branch created successfully.' })
    } catch (err) {
      if (err.message && err.message.includes('Duplicate entry')) {
        return res.status(409).json({ ok: false, error: 'DUPLICATE_CODE', message: `Branch code '${req.body.code}' already exists.` })
      }
      next(err)
    }
  },

  async updateBranch(req, res, next) {
    try {
      if (!assertSuperAdminRole(req, res, 'Updating branch details')) return
      const branch = await OrganisationModel.updateBranch(req.params.id, req.body)
      res.status(200).json({ ok: true, data: branch, message: 'Branch updated successfully.' })
    } catch (err) {
      next(err)
    }
  },

  // Users
  async listUsers(req, res, next) {
    try {
      const effectiveBranch = getEffectiveBranch(req)
      const users = await OrganisationModel.findAllUsers({ branch_id: effectiveBranch || req.query.branch_id })
      res.status(200).json(users)
    } catch (err) {
      next(err)
    }
  },

  async getUserById(req, res, next) {
    try {
      const user = await OrganisationModel.findUserById(req.params.id)
      if (!user) {
        return res.status(404).json({ ok: false, error: 'NOT_FOUND', message: `User '${req.params.id}' not found.` })
      }
      if (!isUserSuperAdmin(req.user) && user.branch_id && user.branch_id !== req.user.branch_id) {
        return res.status(403).json({ ok: false, error: 'FORBIDDEN', message: 'Access denied: You can only view users in your branch.' })
      }
      res.status(200).json(user)
    } catch (err) {
      next(err)
    }
  },

  async createUser(req, res, next) {
    try {
      const { name, email, username, password } = req.body || {}
      if (!name || !String(name).trim()) {
        return res.status(422).json({ ok: false, error: 'VALIDATION_ERROR', message: 'User name is required.' })
      }
      if (!email && !username) {
        return res.status(422).json({ ok: false, error: 'VALIDATION_ERROR', message: 'Email or username is required.' })
      }
      if (!password || !String(password).trim()) {
        return res.status(422).json({ ok: false, error: 'VALIDATION_ERROR', message: 'Password is required when creating a user; default passwords are not permitted.' })
      }

      const complexity = validatePasswordComplexity(password)
      if (!complexity.valid) {
        return res.status(422).json({
          ok: false,
          error: 'PASSWORD_COMPLEXITY_FAILED',
          message: `Password complexity validation failed: ${complexity.errors.join(' ')}`
        })
      }

      const user = await OrganisationModel.createUser(req.body)
      res.status(201).json({ ok: true, data: user, message: 'User created successfully.' })
    } catch (err) {
      if (err.message && err.message.includes('Duplicate entry')) {
        return res.status(409).json({ ok: false, error: 'DUPLICATE_USER', message: 'User with this username or email already exists.' })
      }
      if (err.message && err.message.includes('Password complexity validation failed')) {
        return res.status(422).json({ ok: false, error: 'PASSWORD_COMPLEXITY_FAILED', message: err.message })
      }
      next(err)
    }
  },

  async updateUser(req, res, next) {
    try {
      const { password } = req.body || {}
      if (password !== undefined && password !== null && String(password).trim() !== '') {
        const complexity = validatePasswordComplexity(String(password).trim())
        if (!complexity.valid) {
          return res.status(422).json({
            ok: false,
            error: 'PASSWORD_COMPLEXITY_FAILED',
            message: `Password complexity validation failed: ${complexity.errors.join(' ')}`
          })
        }
      }
      const user = await OrganisationModel.updateUser(req.params.id, req.body)
      res.status(200).json({ ok: true, data: user, message: 'User updated successfully.' })
    } catch (err) {
      if (err.message && err.message.includes('Password complexity validation failed')) {
        return res.status(422).json({ ok: false, error: 'PASSWORD_COMPLEXITY_FAILED', message: err.message })
      }
      next(err)
    }
  },

  // Roles
  async listRoles(req, res, next) {
    try {
      const roles = await OrganisationModel.findAllRoles()
      res.status(200).json(roles)
    } catch (err) {
      next(err)
    }
  },

  async createRole(req, res, next) {
    try {
      const { name } = req.body || {}
      if (!name || !String(name).trim()) {
        return res.status(422).json({ ok: false, error: 'VALIDATION_ERROR', message: 'Role name is required.' })
      }

      const role = await OrganisationModel.createRole(req.body)
      res.status(201).json({ ok: true, data: role, message: 'Role created successfully.' })
    } catch (err) {
      if (err.message && err.message.includes('Duplicate entry')) {
        return res.status(409).json({ ok: false, error: 'DUPLICATE_ROLE', message: `Role '${req.body.name}' already exists.` })
      }
      next(err)
    }
  }
}
