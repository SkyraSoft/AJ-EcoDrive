/**
 * AJ ECODRIVE ERP — SECURITY HARDENING & CREDENTIAL ROTATION TEST SUITE
 */

import { describe, it, before, after } from 'node:test'
import assert from 'node:assert/strict'
import bcrypt from 'bcryptjs'
import { generateSecrets } from '../scripts/generate_production_secrets.js'
import {
  validatePasswordComplexity,
  generateStrongPassword,
  rotateUserPassword
} from '../scripts/rotate_admin_credentials.js'
import { assertProductionSecurity } from '../src/config/env.js'
import { query, connectDB, disconnectDB } from '../src/config/db.js'

describe('AJ EcoDrive Backend — Production Security Hardening & Credential Rotation Suite', () => {
  const TEST_USER_ID = 'USR-SEC-TEST-99'
  const TEST_USERNAME = 'sectestuser99'

  before(async () => {
    await connectDB()
    // Clean any prior artifact
    await query('DELETE FROM users WHERE id = ? OR username = ?', [TEST_USER_ID, TEST_USERNAME])
  })

  after(async () => {
    await query('DELETE FROM users WHERE id = ? OR username = ?', [TEST_USER_ID, TEST_USERNAME])
    await disconnectDB()
  })

  describe('1. High-Entropy Secret Generator', () => {
    it('generates 256-bit hex strings with sufficient cryptographic entropy', () => {
      const s1 = generateSecrets()
      const s2 = generateSecrets()

      assert.ok(s1.jwtSecret && s1.jwtSecret.length === 64, 'JWT secret should be 64 hex chars (256-bit)')
      assert.ok(s1.webhookSecret.startsWith('whsec_'), 'Webhook secret should have whsec_ prefix')
      assert.notEqual(s1.jwtSecret, s2.jwtSecret, 'Successive secrets must be unique')
    })
  })

  describe('2. NIST Password Complexity Validation', () => {
    it('rejects passwords shorter than 12 characters', () => {
      const res = validatePasswordComplexity('Short1!abc')
      assert.equal(res.valid, false)
      assert.ok(res.errors.some(e => e.includes('at least 12 characters')))
    })

    it('rejects passwords missing uppercase, lowercase, numbers, or special chars', () => {
      const noUpper = validatePasswordComplexity('lowercase12345!@#')
      assert.equal(noUpper.valid, false)

      const noSpecial = validatePasswordComplexity('Uppercase12345678')
      assert.equal(noSpecial.valid, false)
    })

    it('rejects common demo default passwords', () => {
      const res = validatePasswordComplexity('password123')
      assert.equal(res.valid, false)
      assert.ok(res.errors.some(e => e.includes('prohibited in production')))
    })

    it('accepts strong NIST-compliant passwords', () => {
      const res = validatePasswordComplexity('EcoDrive#2026!EnterpriseSecure')
      assert.equal(res.valid, true)
      assert.equal(res.errors.length, 0)
    })

    it('generateStrongPassword produces compliant passwords', () => {
      for (let i = 0; i < 5; i++) {
        const pwd = generateStrongPassword(16)
        assert.equal(pwd.length, 16)
        const check = validatePasswordComplexity(pwd)
        assert.equal(check.valid, true, `Generated password failed validation: ${pwd}`)
      }
    })
  })

  describe('3. Production Security Assertion', () => {
    it('allows standard development keys in development mode', () => {
      assert.doesNotThrow(() => {
        assertProductionSecurity({ nodeEnv: 'development', jwtSecret: 'dev_secret_change_me' })
      })
    })

    it('fatal error in production if JWT_SECRET is weak or default', () => {
      assert.throws(() => {
        assertProductionSecurity({ nodeEnv: 'production', jwtSecret: 'dev_secret_change_me' })
      }, /SECURITY FATAL/)

      assert.throws(() => {
        assertProductionSecurity({ nodeEnv: 'production', jwtSecret: 'short_key' })
      }, /SECURITY FATAL/)
    })

    it('passes in production when 256-bit secret is provided', () => {
      const strongSecret = 'f479d1882d27cfb416059f36244bd439e080ed444a122ef6caea2a90ec260c82'
      assert.doesNotThrow(() => {
        assertProductionSecurity({ nodeEnv: 'production', jwtSecret: strongSecret })
      })
    })
  })

  describe('4. Real Database User Credential Rotation Lifecycle', () => {
    it('creates test user, rotates password with bcrypt 12, and preserves existing bindings', async () => {
      const initialHash = await bcrypt.hash('InitialTempPass#123!', 10)
      
      await query(`
        INSERT INTO users (id, username, email, password_hash, name, role_id, branch_id, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [TEST_USER_ID, TEST_USERNAME, 'sectest@ecodrive.pk', initialHash, 'Security Test User', 'ROLE-ADMIN', 'BR-01', 'Active'])

      const newPassword = generateStrongPassword(18)
      const rotateRes = await rotateUserPassword(TEST_USERNAME, newPassword)

      assert.equal(rotateRes.success, true)
      assert.equal(rotateRes.userId, TEST_USER_ID)

      // Fetch fresh record from MySQL
      const [updatedUser] = await query('SELECT * FROM users WHERE id = ?', [TEST_USER_ID])
      assert.ok(updatedUser, 'User must exist in MySQL')
      assert.equal(updatedUser.branch_id, 'BR-01', 'Branch ID must be preserved')
      assert.equal(updatedUser.role_id, 'ROLE-ADMIN', 'Role ID must be preserved')
      assert.equal(updatedUser.status, 'Active', 'Status must be preserved')

      // Verify bcrypt match
      const isMatch = await bcrypt.compare(newPassword, updatedUser.password_hash)
      assert.equal(isMatch, true, 'New password must verify against stored bcrypt hash')

      // Verify old password does NOT match
      const oldMatch = await bcrypt.compare('InitialTempPass#123!', updatedUser.password_hash)
      assert.equal(oldMatch, false, 'Old password must no longer be valid')
    })
  })
})

