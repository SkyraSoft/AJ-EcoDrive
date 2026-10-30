import jwt from 'jsonwebtoken'
import { config } from '../config/env.js'

/**
 * Generate a signed JWT token with standard user identity claims
 */
export function generateToken(user) {
  const payload = {
    id: user.id,
    username: user.username,
    email: user.email,
    name: user.name,
    role: user.role,
    role_id: user.role_id,
    branch_id: user.branch_id || null,
    branch_name: user.branch_name || (user.branch_id ? null : 'All Branches'),
    branch_code: user.branch_code || (user.branch_id ? null : 'ADMIN'),
    isSuperAdmin: user.role === 'Super Admin' || !user.branch_id || user.branch_id === 'ALL',
    permissions: user.permissions || []
  }

  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
    issuer: 'aj-ecodrive-erp',
    audience: 'aj-ecodrive-client'
  })
}

/**
 * Verify and decode a JWT token. Throws if invalid or expired.
 */
export function verifyToken(token) {
  return jwt.verify(token, config.jwtSecret, {
    issuer: 'aj-ecodrive-erp',
    audience: 'aj-ecodrive-client'
  })
}
