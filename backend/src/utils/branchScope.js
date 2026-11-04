/**
 * AJ EcoDrive — Server-Side Multi-Tenant Branch Scoping & Authorization Helper
 */

export const CANONICAL_BRANCH_MAP = {
  'BR-01': { id: 'BR-01', code: 'PEW-01', name: 'Peshawar' },
  'BR-02': { id: 'BR-02', code: 'ISB-01', name: 'Islamabad' },
  'BR-03': { id: 'BR-03', code: 'LHE-01', name: 'Lahore' },
  'BR-04': { id: 'BR-04', code: 'RWP-01', name: 'Rawalpindi' },
  'BR-HQ': { id: 'BR-HQ', code: 'ADMIN', name: 'Head Office' }
}

export function isUserSuperAdmin(user) {
  if (!user) return false
  return Boolean(user.role === 'Super Admin' || user.isSuperAdmin === true)
}

export function getBranchName(branchId) {
  const canonical = CANONICAL_BRANCH_MAP[branchId]
  if (canonical) return canonical.name
  if (branchId === 'BR-01') return 'Peshawar'
  if (branchId === 'BR-02') return 'Islamabad'
  if (branchId === 'BR-03') return 'Lahore'
  if (branchId === 'BR-04') return 'Rawalpindi'
  return 'Peshawar'
}

/**
 * Normalizes branch name, code, or alias to canonical branch ID (e.g. 'BR-01')
 */
export function resolveBranchId(input) {
  if (!input) return null
  const clean = String(input).trim().toLowerCase()
  if (['all', 'all branches', 'global'].includes(clean)) {
    return 'ALL'
  }
  if (['br-hq', 'head office', 'admin'].includes(clean)) {
    return 'BR-HQ'
  }
  if (['br-01', 'pew-01', 'pew', 'peshawar'].includes(clean)) return 'BR-01'
  if (['br-02', 'isb-01', 'isb', 'islamabad'].includes(clean)) return 'BR-02'
  if (['br-03', 'lhe-01', 'lhe', 'lahore'].includes(clean)) return 'BR-03'
  if (['br-04', 'rwp-01', 'rwp', 'rawalpindi'].includes(clean)) return 'BR-04'
  if (/^br-[a-z0-9_-]+$/i.test(input)) return input.toUpperCase()
  return input
}

/**
 * Derives effective branch filter for database queries strictly from verified server-side identity (req.user).
 * Super Admin can optionally filter by query ?branch_id=... or view all (null).
 * Branch Manager is strictly constrained to their assigned branch.
 */
export function getEffectiveBranch(req) {
  const user = req.user
  if (!user) return null

  if (isUserSuperAdmin(user)) {
    if (req.query?.branch_id) {
      const resolved = resolveBranchId(req.query.branch_id)
      return resolved === 'ALL' ? null : resolved
    }
    return null
  }

  // Branch-restricted role: enforce assigned branch strictly based on server JWT
  const userBranch = resolveBranchId(user.branch_id)
  return userBranch || user.branch_id
}

/**
 * Asserts that the authenticated user has permission to access a record belonging to a given branch.
 * Returns true if permitted. If forbidden, writes a 403 Forbidden JSON response and returns false.
 */
export function assertBranchAccess(recordBranchId, req, res) {
  const user = req.user
  if (!user) {
    if (res) {
      res.status(401).json({
        ok: false,
        error: 'UNAUTHORIZED',
        message: 'Authentication required.'
      })
    }
    return false
  }

  if (isUserSuperAdmin(user)) return true

  const userBranch = resolveBranchId(user.branch_id)
  const targetBranch = resolveBranchId(recordBranchId)

  // If record has no branch assignment, allow branch manager to view
  if (!targetBranch) return true

  if (userBranch !== targetBranch) {
    if (res) {
      res.status(403).json({
        ok: false,
        error: 'FORBIDDEN',
        message: 'Access denied: You do not have permission to access resources belonging to other branches.'
      })
    }
    return false
  }

  return true
}

/**
 * Asserts that the authenticated user has Super Admin authority.
 */
export function assertSuperAdminRole(req, res, actionName = 'This action') {
  const user = req.user
  if (!user || !isUserSuperAdmin(user)) {
    if (res) {
      res.status(403).json({
        ok: false,
        error: 'FORBIDDEN',
        message: `${actionName} requires Super Admin authorization.`
      })
    }
    return false
  }
  return true
}

/**
 * Enforces separation of duties: prevents self-approval.
 */
export function assertNotSelf(req, res, targetUserIdOrName, actionName = 'Approval') {
  const user = req.user
  if (!user) return false
  const currentUserId = String(user.id || '').trim().toLowerCase()
  const currentUsername = String(user.username || '').trim().toLowerCase()
  const currentName = String(user.name || '').trim().toLowerCase()
  const target = String(targetUserIdOrName || '').trim().toLowerCase()

  if (target && (target === currentUserId || target === currentUsername || target === currentName)) {
    if (res) {
      res.status(403).json({
        ok: false,
        error: 'SELF_APPROVAL_PROHIBITED',
        message: `${actionName} requires separation of duties. You cannot approve your own submission.`
      })
    }
    return false
  }
  return true
}
