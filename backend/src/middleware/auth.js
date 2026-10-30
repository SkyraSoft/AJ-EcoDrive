import { verifyToken } from '../utils/token.js'

/**
 * Middleware: Enforces JWT Bearer Token Authentication
 * Rejects requests with missing, malformed, or expired tokens with HTTP 401.
 */
export function authenticateJWT(req, res, next) {
  const authHeader = req.headers['authorization'] || req.headers['Authorization']

  if (!authHeader) {
    return res.status(401).json({
      ok: false,
      error: 'UNAUTHORIZED',
      message: 'Authentication required. No authorization token was provided.'
    })
  }

  const parts = authHeader.trim().split(' ')
  if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') {
    return res.status(401).json({
      ok: false,
      error: 'UNAUTHORIZED',
      message: 'Invalid authorization header format. Expected "Bearer <token>".'
    })
  }

  const token = parts[1]

  try {
    const decoded = verifyToken(token)
    req.user = decoded
    next()
  } catch (err) {
    const isExpired = err.name === 'TokenExpiredError'
    return res.status(401).json({
      ok: false,
      error: 'UNAUTHORIZED',
      message: isExpired 
        ? 'Authorization token has expired. Please log in again.' 
        : 'Invalid or corrupted authorization token.'
    })
  }
}

/**
 * Middleware: Role-Based Access Control (RBAC)
 * Allows access only to specified roles. Rejects unauthorized roles with HTTP 403.
 */
export function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        ok: false,
        error: 'UNAUTHORIZED',
        message: 'Authentication required.'
      })
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        ok: false,
        error: 'FORBIDDEN',
        message: `Access denied: Role "${req.user.role}" does not have permission to access this resource.`
      })
    }

    next()
  }
}

/**
 * Middleware: Permission-Based Access Control
 * Requires specific fine-grained permissions. Super Admin automatically bypasses.
 */
export function authorizePermissions(...requiredPermissions) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        ok: false,
        error: 'UNAUTHORIZED',
        message: 'Authentication required.'
      })
    }

    // Super Admin has enterprise-wide authority
    if (req.user.role === 'Super Admin' || req.user.isSuperAdmin) {
      return next()
    }

    const userPerms = Array.isArray(req.user.permissions) ? req.user.permissions : []
    const hasAll = requiredPermissions.every(p => userPerms.includes(p))

    if (!hasAll) {
      return res.status(403).json({
        ok: false,
        error: 'FORBIDDEN',
        message: 'Access denied: Insufficient permissions for this action.'
      })
    }

    next()
  }
}
