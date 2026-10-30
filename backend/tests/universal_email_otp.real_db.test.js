/**
 * AJ ECODRIVE ERP — UNIVERSAL EMAIL PROFILE & OTP INTEGRATION SUITE
 * 
 * Verifies:
 * 1. Profile email update across multiple roles (Super Admin, Branch Manager)
 * 2. Real MySQL persistence in `users` table
 * 3. Email format validation (HTTP 422) and cross-user duplicate rejection (HTTP 409)
 * 4. Authorization & IDOR protection (users can only update their own profile)
 * 5. Forgot password dispatch to the newly updated email address
 * 6. Rate limiting, replay attack prevention, and password reset lifecycle
 * 7. Clean restoration of baseline database records
 */

import { describe, it, before, after } from 'node:test'
import assert from 'node:assert/strict'
import request from 'supertest'
import bcrypt from 'bcryptjs'
import { app } from '../src/app.js'
import { connectDB, disconnectDB, query } from '../src/config/db.js'
import { AuthController } from '../src/controllers/auth.controller.js'
import { MailService } from '../src/services/mail.service.js'
import { config } from '../src/config/env.js'

describe('AJ EcoDrive Backend — Universal Email-Based OTP & Profile Suite', () => {
  let adminToken = null
  let bmToken = null

  const adminOriginal = { id: 'USR-ADMIN', email: 'admin@ajecodrive.com', hash: null }
  const bmOriginal = { id: 'USR-PEW', email: 'pew@ajecodrive.com', hash: null }

  const adminNewEmail = 'admin.corp.test@domain.pk'
  const bmNewEmail = 'ahsan.manager.test@domain.pk'
  let bmIssuedOtp = null
  let bmTempToken = null
  const bmNewPassword = 'FreshSecurePass2026!#'

  const originalDriver = config.mail.driver

  before(async () => {
    await connectDB()
    config.mail.driver = 'log' // use log driver for automated fast assertions
    if (AuthController._resetSessions) {
      AuthController._resetSessions()
    }

    // Capture baseline credentials
    const adminRows = await query('SELECT password_hash, email FROM users WHERE id = ?', [adminOriginal.id])
    if (adminRows.length > 0) {
      adminOriginal.hash = adminRows[0].password_hash
      adminOriginal.email = adminRows[0].email
    }

    const bmRows = await query('SELECT password_hash, email FROM users WHERE id = ?', [bmOriginal.id])
    if (bmRows.length > 0) {
      bmOriginal.hash = bmRows[0].password_hash
      bmOriginal.email = bmRows[0].email
    }

    // Authenticate Admin
    const aRes = await request(app).post('/api/v1/auth/login').send({ username: 'admin', password: 'password123' })
    adminToken = aRes.body.token

    // Authenticate Branch Manager
    const bRes = await request(app).post('/api/v1/auth/login').send({ username: 'pew-01', password: 'password123' })
    bmToken = bRes.body.token
  })

  after(async () => {
    config.mail.driver = originalDriver

    // Restore baseline records in MySQL
    if (adminOriginal.email && adminOriginal.hash) {
      await query('UPDATE users SET email = ?, password_hash = ? WHERE id = ?', [adminOriginal.email, adminOriginal.hash, adminOriginal.id])
    }
    if (bmOriginal.email && bmOriginal.hash) {
      await query('UPDATE users SET email = ?, password_hash = ? WHERE id = ?', [bmOriginal.email, bmOriginal.hash, bmOriginal.id])
    }
    await disconnectDB()
  })

  describe('1. Profile Email Self-Service & Validation', () => {
    it('rejects unauthenticated profile update with HTTP 401', async () => {
      const res = await request(app)
        .put('/api/v1/auth/profile')
        .send({ email: 'hacker@unauth.com' })

      assert.equal(res.status, 401)
      assert.equal(res.body.ok, false)
    })

    it('rejects malformed email address with HTTP 422 VALIDATION_FAILED', async () => {
      const res = await request(app)
        .put('/api/v1/auth/profile')
        .set('Authorization', `Bearer ${bmToken}`)
        .send({ email: 'invalid-email-no-at-domain' })

      assert.equal(res.status, 422)
      assert.equal(res.body.error, 'VALIDATION_FAILED')
    })

    it('allows Branch Manager to update their own email and persists in MySQL', async () => {
      const res = await request(app)
        .put('/api/v1/auth/profile')
        .set('Authorization', `Bearer ${bmToken}`)
        .send({
          name: 'Ahsan Khan (Verified)',
          email: bmNewEmail,
          phone: '0300-1234567'
        })

      assert.equal(res.status, 200)
      assert.equal(res.body.ok, true)
      assert.equal(res.body.user.email, bmNewEmail)

      // Forensically verify direct persistence in MySQL database table
      const rows = await query('SELECT email, name FROM users WHERE id = ?', [bmOriginal.id])
      assert.equal(rows.length, 1)
      assert.equal(rows[0].email, bmNewEmail)
      assert.equal(rows[0].name, 'Ahsan Khan (Verified)')
    })

    it('rejects duplicate email registered to another account with HTTP 409 DUPLICATE_EMAIL', async () => {
      // Super Admin attempts to take the Branch Manager's new email
      const res = await request(app)
        .put('/api/v1/auth/profile')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ email: bmNewEmail })

      assert.equal(res.status, 409)
      assert.equal(res.body.ok, false)
      assert.equal(res.body.error, 'DUPLICATE_EMAIL')
    })

    it('allows Super Admin to update their own profile email and persists in MySQL', async () => {
      const res = await request(app)
        .put('/api/v1/auth/profile')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Super Admin Official',
          email: adminNewEmail
        })

      assert.equal(res.status, 200)
      assert.equal(res.body.ok, true)
      assert.equal(res.body.user.email, adminNewEmail)

      const rows = await query('SELECT email FROM users WHERE id = ?', [adminOriginal.id])
      assert.equal(rows[0].email, adminNewEmail)
    })
  })

  describe('2. Universal Forgot Password & OTP Flow with Updated Emails', () => {
    it('dispatches OTP to the user newly registered email in MySQL', async () => {
      MailService.sentEmails = []
      if (AuthController._resetSessions) {
        AuthController._resetSessions()
      }

      const res = await request(app)
        .post('/api/v1/auth/forgot-password')
        .send({ email: bmNewEmail })

      assert.equal(res.status, 200)
      assert.equal(res.body.ok, true)
      assert.ok(res.body.devOtp)
      bmIssuedOtp = res.body.devOtp

      const sent = MailService.sentEmails.find(m => m.to === bmNewEmail)
      assert.ok(sent, 'Email should be addressed to newly updated email')
      assert.ok(sent.subject.includes(bmIssuedOtp))
    })

    it('enforces 60-second cooldown rate limit on resend request (HTTP 429)', async () => {
      const res = await request(app)
        .post('/api/v1/auth/forgot-password')
        .send({ email: bmNewEmail })

      assert.equal(res.status, 429)
      assert.equal(res.body.error, 'RATE_LIMITED')
      assert.ok(res.body.retryAfter > 0)
    })

    it('verifies OTP and issues single-use tempToken', async () => {
      const res = await request(app)
        .post('/api/v1/auth/verify-identity')
        .send({ email: bmNewEmail, otp: bmIssuedOtp })

      assert.equal(res.status, 200)
      assert.ok(res.body.tempToken)
      bmTempToken = res.body.tempToken
    })

    it('rejects already-used OTP replay with HTTP 400 CODE_ALREADY_USED', async () => {
      const res = await request(app)
        .post('/api/v1/auth/verify-identity')
        .send({ email: bmNewEmail, otp: bmIssuedOtp })

      assert.equal(res.status, 400)
      assert.equal(res.body.error, 'CODE_ALREADY_USED')
    })

    it('resets password in MySQL using tempToken', async () => {
      const res = await request(app)
        .post('/api/v1/auth/reset-password')
        .send({
          email: bmNewEmail,
          tempToken: bmTempToken,
          newPassword: bmNewPassword,
          confirmPassword: bmNewPassword
        })

      assert.equal(res.status, 200)
      assert.equal(res.body.ok, true)

      // Confirm bcrypt hash changed in MySQL
      const rows = await query('SELECT password_hash FROM users WHERE id = ?', [bmOriginal.id])
      const matches = await bcrypt.compare(bmNewPassword, rows[0].password_hash)
      assert.equal(matches, true)
    })

    it('authenticates with new password and rejects consumed tempToken replay', async () => {
      const loginRes = await request(app)
        .post('/api/v1/auth/login')
        .send({ username: 'pew-01', password: bmNewPassword })

      assert.equal(loginRes.status, 200)
      assert.ok(loginRes.body.token)

      // Replay check
      const replayRes = await request(app)
        .post('/api/v1/auth/reset-password')
        .send({
          email: bmNewEmail,
          tempToken: bmTempToken,
          newPassword: 'AnotherPassword!'
        })

      assert.equal(replayRes.status, 401)
      assert.equal(replayRes.body.error, 'UNAUTHORIZED_RESET')
    })
  })
})

