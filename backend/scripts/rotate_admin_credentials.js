/**
 * AJ ECODRIVE ERP — CREDENTIAL ROTATION & NIST COMPLEXITY UTILITY
 * 
 * Safely updates administrative passwords in the MySQL `users` table:
 * 1. Enforces NIST SP 800-63B password complexity standards
 * 2. Uses bcrypt with adaptive cost factor 12
 * 3. Never deletes or mutates roles, permissions, or branch bindings
 * 4. Can generate cryptographically secure random passwords or accept manual input
 */

import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import { query, connectDB, disconnectDB } from '../src/config/db.js'
import {
  PASSWORD_RULES,
  COMMON_PASSWORDS_BLACKLIST,
  validatePasswordComplexity,
  generateStrongPassword
} from '../src/utils/security.js'

export {
  PASSWORD_RULES,
  COMMON_PASSWORDS_BLACKLIST,
  validatePasswordComplexity,
  generateStrongPassword
}

export async function rotateUserPassword(usernameOrId, newPassword, options = {}) {
  const cleanTarget = String(usernameOrId).trim().toLowerCase()
  const validation = validatePasswordComplexity(newPassword)
  if (!validation.valid) {
    throw new Error(`Password complexity validation failed: ${validation.errors.join(' ')}`)
  }

  const [user] = await query(
    'SELECT id, username, email, role_id, branch_id FROM users WHERE LOWER(username) = ? OR id = ?',
    [cleanTarget, usernameOrId]
  )

  if (!user) {
    throw new Error(`User '${usernameOrId}' was not found in registered accounts.`)
  }

  // Hash with bcrypt work factor 12
  const hash = await bcrypt.hash(newPassword, 12)

  await query(
    'UPDATE users SET password_hash = ?, updated_at = NOW() WHERE id = ?',
    [hash, user.id]
  )

  return {
    success: true,
    userId: user.id,
    username: user.username,
    roleId: user.role_id,
    branchId: user.branch_id,
    timestamp: new Date().toISOString()
  }
}

// CLI runner
if (process.argv[1] && process.argv[1].endsWith('rotate_admin_credentials.js')) {
  async function runCli() {
    console.log('===============================================================')
    console.log('AJ ECODRIVE ERP — CREDENTIAL ROTATION UTILITY')
    console.log('===============================================================\n')

    const args = process.argv.slice(2)
    const userArg = args.find(a => a.startsWith('--user='))
    const passArg = args.find(a => a.startsWith('--pass='))
    const genArg = args.includes('--generate')

    const targetUser = userArg ? userArg.split('=')[1] : null
    let targetPass = passArg ? passArg.split('=')[1] : null

    if (!targetUser) {
      console.log('Usage: node backend/scripts/rotate_admin_credentials.js --user=<username> [--pass=<password> | --generate]')
      console.log('Example: node backend/scripts/rotate_admin_credentials.js --user=admin --generate\n')
      process.exit(1)
    }

    if (genArg || !targetPass) {
      targetPass = generateStrongPassword(16)
      console.log(`Generated strong NIST-compliant password for ${targetUser}`)
    }

    await connectDB()
    try {
      const res = await rotateUserPassword(targetUser, targetPass)
      console.log('\n[SUCCESS] Password updated successfully!')
      console.log(`User ID:      ${res.userId}`)
      console.log(`Username:     ${res.username}`)
      console.log(`New Password: ${targetPass}`)
      console.log(`Timestamp:    ${res.timestamp}`)
      console.log('\nIMPORTANT: Store these credentials in your enterprise password vault.')
    } finally {
      await disconnectDB()
    }
    console.log('===============================================================')
  }

  runCli().catch(err => {
    console.error('[ERROR]', err.message)
    process.exit(1)
  })
}
