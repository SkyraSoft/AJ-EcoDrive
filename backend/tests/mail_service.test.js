/**
 * AJ ECODRIVE ERP — MAIL SERVICE & OTP DISPATCH TEST SUITE
 */

import { describe, it, before, after, beforeEach } from 'node:test'
import assert from 'node:assert/strict'
import request from 'supertest'
import express from 'express'
import { MailService } from '../src/services/mail.service.js'
import authRoutes from '../src/routes/auth.routes.js'
import { AuthController } from '../src/controllers/auth.controller.js'
import { connectDB, disconnectDB } from '../src/config/db.js'
import { config } from '../src/config/env.js'

describe('AJ EcoDrive Backend — Mail Service & Transactional OTP Suite', () => {
  let app
  const originalDriver = config.mail.driver

  before(async () => {
    await connectDB()
    app = express()
    app.use(express.json())
    app.use('/api/v1/auth', authRoutes)
    MailService.sentEmails = []
  })

  beforeEach(() => {
    if (AuthController._resetSessions) {
      AuthController._resetSessions()
    }
  })

  after(async () => {
    config.mail.driver = originalDriver
    await disconnectDB()
  })

  describe('1. MailService Core Dispatch & Connectivity', () => {
    it('verifies connection status reporting in log mode', async () => {
      config.mail.driver = 'log'
      const status = await MailService.verifyConnection()
      assert.equal(status.connected, true)
      assert.equal(status.driver, 'log')
    })

    it('dispatches email and stores in internal audit spool in log mode', async () => {
      config.mail.driver = 'log'
      const res = await MailService.sendMail({
        to: 'testuser@example.com',
        subject: 'Test Subject',
        html: '<p>Hello Test World</p>'
      })

      assert.equal(res.success, true)
      assert.ok(MailService.sentEmails.length > 0)
      const last = MailService.sentEmails[MailService.sentEmails.length - 1]
      assert.equal(last.to, 'testuser@example.com')
      assert.equal(last.subject, 'Test Subject')
      assert.equal(last.text, 'Hello Test World')
      assert.equal(last.status, 'LOGGED')
    })

    it('sendPasswordResetOtp generates formatted HTML with branded OTP box and 5-min expiry', async () => {
      config.mail.driver = 'log'
      const res = await MailService.sendPasswordResetOtp({
        to: 'ahsan@ajecodrive.com',
        otp: '849201',
        recipientName: 'Ahsan Khan'
      })

      assert.equal(res.success, true)
      const last = MailService.sentEmails[MailService.sentEmails.length - 1]
      assert.equal(last.to, 'ahsan@ajecodrive.com')
      assert.ok(last.subject.includes('849201'))
      assert.ok(last.html.includes('849201'), 'HTML should contain OTP')
      assert.ok(last.html.includes('Ahsan Khan'), 'HTML should contain recipient name')
      assert.ok(last.html.includes('5 minutes'), 'HTML should specify 5 min expiration')
      assert.ok(last.html.includes('AJ ECODRIVE ERP'), 'HTML should have brand header')
    })

    it('does not silently fall back to log mode when SMTP is configured but transport fails', async () => {
      config.mail.driver = 'smtp'
      const origUser = config.mail.user
      config.mail.user = '' // invalidate credentials

      const res = await MailService.sendMail({
        to: 'unreachable@example.com',
        subject: 'SMTP Missing Config Test',
        html: '<p>Should fail cleanly</p>'
      })

      assert.equal(res.success, false)
      assert.ok(res.error.includes('incomplete') || res.error.includes('missing'))
      config.mail.user = origUser
      config.mail.driver = 'log'
    })
  })

  describe('2. End-to-End Forgot Password Integration & Rate Limiting', () => {
    it('POST /api/v1/auth/forgot-password triggers mail dispatch for registered user', async () => {
      config.mail.driver = 'log'
      MailService.sentEmails = []

      const res = await request(app)
        .post('/api/v1/auth/forgot-password')
        .send({ email: 'admin@ajecodrive.com' })

      assert.equal(res.status, 200)
      assert.equal(res.body.ok, true)
      assert.ok(res.body.message.includes('password reset instructions'))

      assert.ok(MailService.sentEmails.length > 0, 'Mail service should have received OTP dispatch')
      const email = MailService.sentEmails.find(e => e.to === 'admin@ajecodrive.com')
      assert.ok(email, 'Email should be addressed to admin@ajecodrive.com')
      assert.ok(email.subject.includes('Verification Code'))
    })

    it('POST /api/v1/auth/forgot-password enforces 60-second cooldown rate limiting on subsequent requests', async () => {
      // First request succeeds
      const firstRes = await request(app)
        .post('/api/v1/auth/forgot-password')
        .send({ email: 'pew@ajecodrive.com' })
      assert.equal(firstRes.status, 200)

      // Immediate second request within 60s must return 429
      const secondRes = await request(app)
        .post('/api/v1/auth/forgot-password')
        .send({ email: 'pew@ajecodrive.com' })
      assert.equal(secondRes.status, 429)
      assert.equal(secondRes.body.ok, false)
      assert.equal(secondRes.body.error, 'RATE_LIMITED')
      assert.ok(secondRes.body.message.includes('seconds'))
      assert.ok(secondRes.body.retryAfter > 0)
    })

    it('POST /api/v1/auth/forgot-password with unknown email returns generic message without dispatching', async () => {
      const initialCount = MailService.sentEmails.length

      const res = await request(app)
        .post('/api/v1/auth/forgot-password')
        .send({ email: 'nonexistent_ghost_user@ecodrive.pk' })

      assert.equal(res.status, 200)
      assert.equal(res.body.ok, true)
      assert.ok(res.body.message.includes('If an account exists'))

      assert.equal(MailService.sentEmails.length, initialCount, 'No email should be dispatched for unknown accounts')
    })

    it('POST /api/v1/auth/verify-identity rejects already-used OTP code with 400 CODE_ALREADY_USED', async () => {
      // 1. Request OTP
      const reqRes = await request(app)
        .post('/api/v1/auth/forgot-password')
        .send({ email: 'isb@ajecodrive.com' })
      assert.equal(reqRes.status, 200)
      const otp = reqRes.body.devOtp
      assert.ok(otp)

      // 2. First verification succeeds
      const firstVerify = await request(app)
        .post('/api/v1/auth/verify-identity')
        .send({ email: 'isb@ajecodrive.com', otp })
      assert.equal(firstVerify.status, 200)
      assert.ok(firstVerify.body.tempToken)

      // 3. Re-submitting the same OTP must fail as already used
      const secondVerify = await request(app)
        .post('/api/v1/auth/verify-identity')
        .send({ email: 'isb@ajecodrive.com', otp })
      assert.equal(secondVerify.status, 400)
      assert.equal(secondVerify.body.error, 'CODE_ALREADY_USED')
    })
  })
})
