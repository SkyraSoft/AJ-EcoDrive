import { describe, it, before, after } from 'node:test'
import assert from 'node:assert'
import request from 'supertest'
import bcrypt from 'bcryptjs'
import { app } from '../src/app.js'
import { AuthController } from '../src/controllers/auth.controller.js'
import { connectDB, disconnectDB, query } from '../src/config/db.js'

describe('AJ EcoDrive Backend — Auth Password Reset & MySQL Persistence Suite', () => {
  let isDbReady = false
  const testEmail = 'admin@ajecodrive.com'
  let originalPasswordHash = null
  let issuedOtp = null
  let issuedTempToken = null
  const tempNewPassword = 'newSecretPassword2026!'

  before(async () => {
    if (AuthController._resetSessions) {
      AuthController._resetSessions()
    }
    isDbReady = await connectDB()
    if (isDbReady) {
      // Backup original password hash for admin@ajecodrive.com
      const rows = await query('SELECT password_hash FROM `users` WHERE LOWER(email) = ? LIMIT 1', [testEmail])
      if (rows && rows.length > 0) {
        originalPasswordHash = rows[0].password_hash
      }
    }
  })

  after(async () => {
    if (isDbReady && originalPasswordHash) {
      // Strictly restore original password hash to preserve baseline environment integrity
      await query('UPDATE `users` SET `password_hash` = ? WHERE LOWER(email) = ?', [originalPasswordHash, testEmail])
    }
    await disconnectDB()
  })

  it('1. POST /api/v1/auth/forgot-password rejects blank email with HTTP 422', async () => {
    const res = await request(app)
      .post('/api/v1/auth/forgot-password')
      .send({ email: '' })

    assert.strictEqual(res.status, 422)
    assert.strictEqual(res.body.ok, false)
    assert.strictEqual(res.body.error, 'VALIDATION_FAILED')
  })

  it('2. POST /api/v1/auth/forgot-password generates 6-digit OTP for existing user', async () => {
    const res = await request(app)
      .post('/api/v1/auth/forgot-password')
      .send({ email: testEmail })

    assert.strictEqual(res.status, 200)
    assert.strictEqual(res.body.ok, true)
    assert.ok(res.body.message.includes('sent'))
    assert.ok(res.body.devOtp, 'devOtp should be present in non-production test runner')
    assert.strictEqual(typeof res.body.devOtp, 'string')
    assert.strictEqual(res.body.devOtp.length, 6)
    issuedOtp = res.body.devOtp
  })

  it('3. POST /api/v1/auth/verify-identity rejects wrong verification code with HTTP 400', async () => {
    const res = await request(app)
      .post('/api/v1/auth/verify-identity')
      .send({ email: testEmail, otp: '000000' })

    assert.strictEqual(res.status, 400)
    assert.strictEqual(res.body.ok, false)
    assert.strictEqual(res.body.error, 'INVALID_CODE')
  })

  it('4. POST /api/v1/auth/verify-identity accepts correct OTP and returns tempToken', async () => {
    const res = await request(app)
      .post('/api/v1/auth/verify-identity')
      .send({ email: testEmail, otp: issuedOtp })

    assert.strictEqual(res.status, 200)
    assert.strictEqual(res.body.ok, true)
    assert.ok(res.body.tempToken, 'tempToken must be issued upon valid verification')
    assert.strictEqual(typeof res.body.tempToken, 'string')
    issuedTempToken = res.body.tempToken
  })

  it('5. POST /api/v1/auth/reset-password rejects passwords shorter than 8 characters', async () => {
    const res = await request(app)
      .post('/api/v1/auth/reset-password')
      .send({
        email: testEmail,
        tempToken: issuedTempToken,
        newPassword: 'short'
      })

    assert.strictEqual(res.status, 422)
    assert.strictEqual(res.body.ok, false)
    assert.ok(res.body.message.includes('8 characters'))
  })

  it('6. POST /api/v1/auth/reset-password updates bcrypt password hash in MySQL users table', async () => {
    const res = await request(app)
      .post('/api/v1/auth/reset-password')
      .send({
        email: testEmail,
        tempToken: issuedTempToken,
        newPassword: tempNewPassword,
        confirmPassword: tempNewPassword
      })

    assert.strictEqual(res.status, 200)
    assert.strictEqual(res.body.ok, true)
    assert.ok(res.body.message.includes('successfully updated'))

    // Forensically verify database persistence in MySQL
    const dbRows = await query('SELECT password_hash FROM `users` WHERE LOWER(email) = ?', [testEmail])
    assert.ok(dbRows && dbRows.length > 0)
    const newHashInDb = dbRows[0].password_hash
    assert.notStrictEqual(newHashInDb, originalPasswordHash, 'Password hash in MySQL must change')

    // Verify bcrypt comparison succeeds with the new password
    const matches = await bcrypt.compare(tempNewPassword, newHashInDb)
    assert.strictEqual(matches, true, 'bcrypt.compare must verify against the newly stored hash in MySQL')
  })

  it('7. POST /api/v1/auth/login authenticates with the newly reset password', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        username: testEmail,
        password: tempNewPassword
      })

    assert.strictEqual(res.status, 200)
    assert.strictEqual(res.body.ok, true)
    assert.ok(res.body.token, 'Must return signed JWT on login with new password')
    assert.strictEqual(res.body.user.email, testEmail)
  })

  it('8. POST /api/v1/auth/reset-password rejects replay attack using the consumed tempToken', async () => {
    const res = await request(app)
      .post('/api/v1/auth/reset-password')
      .send({
        email: testEmail,
        tempToken: issuedTempToken,
        newPassword: 'anotherPassword123'
      })

    assert.strictEqual(res.status, 401)
    assert.strictEqual(res.body.ok, false)
    assert.strictEqual(res.body.error, 'UNAUTHORIZED_RESET')
  })
})
