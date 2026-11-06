/**
 * AJ ECODRIVE ERP — SECURITY HARDENING & CREDENTIAL ROTATION TEST SUITE
 */

import { describe, it, before, after } from 'node:test'
import assert from 'node:assert/strict'
import bcrypt from 'bcryptjs'
import request from 'supertest'
import { app } from '../src/app.js'
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
      assert.ok(res.errors.some(e => e.includes('prohibited')))
    })

    it('rejects Skyrasoft@2233 as a blacklisted credential', () => {
      const res = validatePasswordComplexity('Skyrasoft@2233')
      assert.equal(res.valid, false)
      assert.ok(res.errors.some(e => e.includes('prohibited')))
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

  describe('3. Production Security Assertion & Demo Flag Prohibitions', () => {
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

    it('fatal error in production if ALLOW_DEMO_LOGIN is enabled', () => {
      const orig = process.env.ALLOW_DEMO_LOGIN
      try {
        process.env.ALLOW_DEMO_LOGIN = 'true'
        assert.throws(() => {
          assertProductionSecurity({ nodeEnv: 'production', jwtSecret: 'f479d1882d27cfb416059f36244bd439e080ed444a122ef6caea2a90ec260c82' })
        }, /ALLOW_DEMO_LOGIN/)
      } finally {
        process.env.ALLOW_DEMO_LOGIN = orig
      }
    })

    it('fatal error in production if ALLOW_DEMO_PASSWORDS is enabled', () => {
      const orig = process.env.ALLOW_DEMO_PASSWORDS
      try {
        process.env.ALLOW_DEMO_PASSWORDS = 'true'
        assert.throws(() => {
          assertProductionSecurity({ nodeEnv: 'production', jwtSecret: 'f479d1882d27cfb416059f36244bd439e080ed444a122ef6caea2a90ec260c82' })
        }, /ALLOW_DEMO_PASSWORDS/)
      } finally {
        process.env.ALLOW_DEMO_PASSWORDS = orig
      }
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

  describe('5. Fallback Password Rejection & Production Authentication Enforcement', () => {
    const SECURE_TEST_PASSWORD = 'NIST#AuthSecPass2026!'
    let originalUserHashes = {}

    before(async () => {
      // Snapshot original hashes for standard accounts
      const rows = await query('SELECT username, password_hash FROM users WHERE username IN (?, ?, ?, ?, ?)', [
        'admin', 'pew-01', 'isb-01', 'lhe-01', 'rwp-01'
      ])
      for (const r of rows) {
        originalUserHashes[r.username] = r.password_hash
      }

      // Set explicit secure password for test accounts
      const secureHash = await bcrypt.hash(SECURE_TEST_PASSWORD, 10)
      await query('UPDATE users SET password_hash = ? WHERE username IN (?, ?, ?, ?, ?)', [
        secureHash, 'admin', 'pew-01', 'isb-01', 'lhe-01', 'rwp-01'
      ])
    })

    after(async () => {
      // Restore original hashes
      for (const [username, hash] of Object.entries(originalUserHashes)) {
        await query('UPDATE users SET password_hash = ? WHERE username = ?', [hash, username])
      }
    })

    it('rejects password123 for Super Admin with 401', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ username: 'admin', password: 'password123' })

      assert.equal(res.status, 401)
      assert.equal(res.body.ok, false)
      assert.equal(res.body.error, 'INVALID_CREDENTIALS')
    })

    it('rejects password for Super Admin with 401', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ username: 'admin', password: 'password' })

      assert.equal(res.status, 401)
      assert.equal(res.body.ok, false)
      assert.equal(res.body.error, 'INVALID_CREDENTIALS')
    })

    it('rejects password123 for pew-01 with 401', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ username: 'pew-01', password: 'password123' })

      assert.equal(res.status, 401)
      assert.equal(res.body.ok, false)
      assert.equal(res.body.error, 'INVALID_CREDENTIALS')
    })

    it('rejects fallback passwords for every branch manager with 401', async () => {
      const branchUsers = ['pew-01', 'isb-01', 'lhe-01', 'rwp-01']
      const fallbackPasswords = ['password123', 'password', 'admin', 'admin123']

      for (const user of branchUsers) {
        for (const pass of fallbackPasswords) {
          const res = await request(app)
            .post('/api/v1/auth/login')
            .send({ username: user, password: pass })

          assert.equal(res.status, 401, `Expected 401 for ${user} with fallback ${pass}`)
          assert.equal(res.body.ok, false)
          assert.equal(res.body.error, 'INVALID_CREDENTIALS')
        }
      }
    })

    it('authenticates successfully with valid stored bcrypt password', async () => {
      const adminRes = await request(app)
        .post('/api/v1/auth/login')
        .send({ username: 'admin', password: SECURE_TEST_PASSWORD })

      assert.equal(adminRes.status, 200)
      assert.equal(adminRes.body.ok, true)
      assert.ok(adminRes.body.token)
      assert.equal(adminRes.body.user.role, 'Super Admin')

      const pewRes = await request(app)
        .post('/api/v1/auth/login')
        .send({ username: 'pew-01', password: SECURE_TEST_PASSWORD })

      assert.equal(pewRes.status, 200)
      assert.equal(pewRes.body.ok, true)
      assert.ok(pewRes.body.token)
      assert.equal(pewRes.body.user.branch_id, 'BR-01')
    })

    it('branch managers remain strictly branch-scoped after login', async () => {
      const pewLogin = await request(app)
        .post('/api/v1/auth/login')
        .send({ username: 'pew-01', password: SECURE_TEST_PASSWORD })

      const token = pewLogin.body.token

      // Attempting to query branches administrative route returns 403
      const branchesRes = await request(app)
        .get('/api/v1/organisation/branches')
        .set('Authorization', `Bearer ${token}`)

      assert.equal(branchesRes.status, 403)
    })

    it('Super Admin restrictions remain enforced across protected routes', async () => {
      const adminLogin = await request(app)
        .post('/api/v1/auth/login')
        .send({ username: 'admin', password: SECURE_TEST_PASSWORD })

      const token = adminLogin.body.token

      const branchesRes = await request(app)
        .get('/api/v1/organisation/branches')
        .set('Authorization', `Bearer ${token}`)

      assert.equal(branchesRes.status, 200)
      assert.ok(Array.isArray(branchesRes.body))
    })
  })

  describe('6. Account Creation & Password Complexity Policy Enforcement', () => {
    let adminToken = ''

    before(async () => {
      // Snapshot admin hash and give a known password
      const [admin] = await query('SELECT password_hash FROM users WHERE username = ?', ['admin'])
      const testPass = 'NIST#AdminCreator2026!'
      const hash = await bcrypt.hash(testPass, 10)
      await query('UPDATE users SET password_hash = ? WHERE username = ?', [hash, 'admin'])

      const loginRes = await request(app)
        .post('/api/v1/auth/login')
        .send({ username: 'admin', password: testPass })

      adminToken = loginRes.body.token

      // Restore admin hash
      if (admin) {
        await query('UPDATE users SET password_hash = ? WHERE username = ?', [admin.password_hash, 'admin'])
      }
    })

    it('rejects user creation with missing password (422)', async () => {
      const res = await request(app)
        .post('/api/v1/organisation/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'No Password User',
          username: 'nopassworduser',
          email: 'nopass@ecodrive.pk',
          role: 'Branch Manager'
        })

      assert.equal(res.status, 422)
      assert.equal(res.body.ok, false)
      assert.ok(res.body.message.includes('Password is required'))
    })

    it('rejects user creation with weak or common demo password (422)', async () => {
      const res = await request(app)
        .post('/api/v1/organisation/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Weak Pass User',
          username: 'weakpassuser',
          email: 'weakpass@ecodrive.pk',
          password: 'password123',
          role: 'Branch Manager'
        })

      assert.equal(res.status, 422)
      assert.equal(res.body.ok, false)
      assert.equal(res.body.error, 'PASSWORD_COMPLEXITY_FAILED')
    })

    it('successfully creates user with NIST-compliant password', async () => {
      const tempUsername = 'secusercreated' + Math.floor(Math.random() * 1000)
      try {
        const res = await request(app)
          .post('/api/v1/organisation/users')
          .set('Authorization', `Bearer ${adminToken}`)
          .send({
            name: 'Valid Password User',
            username: tempUsername,
            email: `${tempUsername}@ecodrive.pk`,
            password: 'Strong#SecureUserPass2026!',
            role: 'Branch Manager',
            branch: 'BR-01'
          })

        assert.equal(res.status, 201)
        assert.equal(res.body.ok, true)
        assert.equal(res.body.data.username, tempUsername)
      } finally {
        await query('DELETE FROM users WHERE username = ?', [tempUsername])
      }
    })
  })
})
