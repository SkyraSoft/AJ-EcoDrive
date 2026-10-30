import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import { UserModel } from '../models/user.model.js'
import { generateToken } from '../utils/token.js'
import { config } from '../config/env.js'
import { MailService } from '../services/mail.service.js'

// In-memory store for active password reset OTP sessions
const resetSessions = new Map()
// Rate limiting tracker for password reset requests (60s cooldown)
const resetRateLimits = new Map()
const OTP_EXPIRY_MS = 5 * 60 * 1000 // 5 minutes
const RESEND_COOLDOWN_MS = 60 * 1000 // 60 seconds

export const AuthController = {

  /**
   * Internal test helper to reset in-memory state between tests
   */
  _resetSessions() {
    resetSessions.clear()
    resetRateLimits.clear()
  },

  /**
   * POST /api/v1/auth/login
   * Authenticates user credentials via bcrypt and issues signed JWT
   */
  async login(req, res, next) {
    try {
      const { username, email, branchCode, identifier, password } = req.body || {}
      const loginIdentifier = username || email || branchCode || identifier

      if (!loginIdentifier || String(loginIdentifier).trim() === '') {
        return res.status(422).json({
          ok: false,
          error: 'VALIDATION_FAILED',
          message: 'Username, email, or branch identifier is required.',
          errors: [{ field: 'username', message: 'Username or identifier cannot be blank.' }]
        })
      }

      if (!password || String(password).trim() === '') {
        return res.status(422).json({
          ok: false,
          error: 'VALIDATION_FAILED',
          message: 'Password is required.',
          errors: [{ field: 'password', message: 'Password cannot be blank.' }]
        })
      }

      // Look up user in database
      const user = await UserModel.findByUsernameOrEmail(loginIdentifier.trim())
      if (!user) {
        return res.status(401).json({
          ok: false,
          error: 'INVALID_CREDENTIALS',
          message: 'Invalid username/email or password. Please verify your credentials and try again.'
        })
      }

      // Check account status
      if (user.status !== 'Active') {
        return res.status(403).json({
          ok: false,
          error: 'ACCOUNT_DISABLED',
          message: 'Your account is currently inactive or suspended. Please contact the system administrator.'
        })
      }

      // Verify bcrypt password
      const isMatch = await UserModel.verifyPassword(password.trim(), user.password_hash)
      if (!isMatch) {
        return res.status(401).json({
          ok: false,
          error: 'INVALID_CREDENTIALS',
          message: 'Invalid username/email or password. Please verify your credentials and try again.'
        })
      }

      // Production Security Policy: Default demo passwords cannot be used in production
      if (process.env.NODE_ENV === 'production' && (password.trim() === 'password123' || password.trim() === 'admin')) {
        return res.status(403).json({
          ok: false,
          error: 'DEFAULT_CREDENTIALS_REJECTED',
          message: 'Default demonstration credentials are prohibited in production. Please set a secure password.'
        })
      }

      // Update login timestamp asynchronously
      await UserModel.updateLastLogin(user.id)

      // Generate signed JWT
      const token = generateToken(user)

      res.status(200).json({
        ok: true,
        token,
        tokenType: 'Bearer',
        expiresIn: config.jwtExpiresIn,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          name: user.name,
          role: user.role,
          role_id: user.role_id,
          branch_id: user.branch_id || null,
          branchId: user.branch_id || null,
          branchName: user.branch_name || (user.branch_id ? null : 'All Branches'),
          branchCode: user.branch_code || (user.branch_id ? null : 'ADMIN'),
          isSuperAdmin: user.role === 'Super Admin' || !user.branch_id || user.branch_id === 'ALL',
          permissions: user.permissions || []
        }
      })
    } catch (err) {
      next(err)
    }
  },

  /**
   * GET /api/v1/auth/me
   * Returns current authenticated user profile derived from verified server session
   */
  async getMe(req, res, next) {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({
          ok: false,
          error: 'UNAUTHORIZED',
          message: 'Authentication required.'
        })
      }

      const freshUser = await UserModel.findById(req.user.id)
      if (!freshUser) {
        return res.status(404).json({
          ok: false,
          error: 'NOT_FOUND',
          message: 'User account not found.'
        })
      }

      res.status(200).json({
        ok: true,
        user: {
          id: freshUser.id,
          username: freshUser.username,
          email: freshUser.email,
          name: freshUser.name,
          role: freshUser.role,
          role_id: freshUser.role_id,
          branch_id: freshUser.branch_id,
          branchId: freshUser.branch_id,
          branchName: freshUser.branch_name || (freshUser.branch_id ? null : 'All Branches'),
          branchCode: freshUser.branch_code || (freshUser.branch_id ? null : 'ADMIN'),
          isSuperAdmin: freshUser.role === 'Super Admin' || !freshUser.branch_id,
          phone: freshUser.phone,
          status: freshUser.status,
          permissions: freshUser.permissions,
          lastLoginAt: freshUser.last_login_at
        }
      })
    } catch (err) {
      next(err)
    }
  },

  /**
   * PUT /api/v1/auth/profile
   * Allows the currently authenticated user to update their own profile (name, email, phone).
   * Validates email format, checks for duplicates, and updates MySQL users table.
   * Scoped strictly to req.user.id to prevent unauthorized cross-user modifications.
   */
  async updateProfile(req, res, next) {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({
          ok: false,
          error: 'UNAUTHORIZED',
          message: 'Authentication required.'
        })
      }

      const { name, email, phone } = req.body || {}

      if (!email || !String(email).trim()) {
        return res.status(422).json({
          ok: false,
          error: 'VALIDATION_FAILED',
          message: 'Email address is required.',
          errors: [{ field: 'email', message: 'Email address cannot be blank.' }]
        })
      }

      const cleanEmail = String(email).trim().toLowerCase()
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(cleanEmail)) {
        return res.status(422).json({
          ok: false,
          error: 'VALIDATION_FAILED',
          message: 'Invalid email address format.',
          errors: [{ field: 'email', message: 'Please provide a valid email address (e.g. user@domain.com).' }]
        })
      }

      // Check uniqueness against other users
      const emailTaken = await UserModel.checkEmailExists(cleanEmail, req.user.id)
      if (emailTaken) {
        return res.status(409).json({
          ok: false,
          error: 'DUPLICATE_EMAIL',
          message: 'This email address is already registered to another user account.'
        })
      }

      const updatedUser = await UserModel.updateProfile(req.user.id, {
        name: name ? String(name).trim() : undefined,
        email: cleanEmail,
        phone: phone ? String(phone).trim() : undefined
      })

      if (!updatedUser) {
        return res.status(404).json({
          ok: false,
          error: 'USER_NOT_FOUND',
          message: 'User account not found.'
        })
      }

      console.log(`[AUTH-AUDIT] Profile updated: User ID "${req.user.id}" changed email to "${cleanEmail}"`)

      res.status(200).json({
        ok: true,
        message: 'Profile and registered email updated successfully.',
        user: {
          id: updatedUser.id,
          username: updatedUser.username,
          email: updatedUser.email,
          name: updatedUser.name,
          role: updatedUser.role,
          role_id: updatedUser.role_id,
          branch_id: updatedUser.branch_id,
          branchName: updatedUser.branch_name || (updatedUser.branch_id ? null : 'All Branches'),
          branchCode: updatedUser.branch_code || (updatedUser.branch_id ? null : 'ADMIN'),
          isSuperAdmin: updatedUser.role === 'Super Admin' || !updatedUser.branch_id,
          phone: updatedUser.phone,
          status: updatedUser.status
        }
      })
    } catch (err) {
      if (err.message && err.message.includes('Duplicate entry')) {
        return res.status(409).json({
          ok: false,
          error: 'DUPLICATE_EMAIL',
          message: 'This email address is already registered to another user account.'
        })
      }
      next(err)
    }
  },

  /**
   * POST /api/v1/auth/logout
   */
  async logout(req, res) {
    res.status(200).json({
      ok: true,
      message: 'Logged out successfully.'
    })
  },

  /**
   * POST /api/v1/auth/forgot-password
   * Initiates password reset by issuing a 6-digit OTP with 5-minute expiry and 60-second cooldown rate limit.
   */
  async forgotPassword(req, res, next) {
    try {
      const { email, identifier } = req.body || {}
      const targetEmail = email || identifier

      if (!targetEmail || String(targetEmail).trim() === '') {
        return res.status(422).json({
          ok: false,
          error: 'VALIDATION_FAILED',
          message: 'Email address is required.',
          errors: [{ field: 'email', message: 'Email address cannot be blank.' }]
        })
      }

      const cleanEmail = String(targetEmail).trim().toLowerCase()
      console.log(`[AUTH-AUDIT] Password reset requested for: "${cleanEmail}" at ${new Date().toISOString()}`)

      // Cooldown and rate limiting check (60 seconds)
      const now = Date.now()
      const lastRequested = resetRateLimits.get(cleanEmail)
      if (lastRequested && (now - lastRequested) < RESEND_COOLDOWN_MS) {
        const remainingSeconds = Math.ceil((RESEND_COOLDOWN_MS - (now - lastRequested)) / 1000)
        console.warn(`[AUTH-AUDIT] Rate limit triggered for: "${cleanEmail}". Cooldown remaining: ${remainingSeconds}s`)
        return res.status(429).json({
          ok: false,
          error: 'RATE_LIMITED',
          message: `Please wait ${remainingSeconds} seconds before requesting a new verification code.`,
          retryAfter: remainingSeconds
        })
      }
      resetRateLimits.set(cleanEmail, now)

      const user = await UserModel.findByUsernameOrEmail(cleanEmail)

      // Generate 6-digit cryptographically secure OTP
      const otp = Math.floor(100000 + crypto.randomInt(900000)).toString()
      const otpHash = crypto.createHash('sha256').update(otp).digest('hex')
      const expiresAt = now + OTP_EXPIRY_MS

      if (user && user.status === 'Active') {
        console.log(`[AUTH-AUDIT] User account matched: ID ${user.id} (${user.role}) | Recipient Email: ${user.email}`)
        console.log(`[AUTH-AUDIT] Dispatching verification email via MailService (Driver: ${config.mail.driver})...`)

        // Dispatch transactional email via configured MailService
        const mailResult = await MailService.sendPasswordResetOtp({
          to: user.email,
          otp,
          recipientName: user.name || user.username
        })

        // When SMTP driver is active, verify that delivery succeeded
        if (config.mail.driver === 'smtp' && !mailResult.success) {
          console.error(`[AUTH-AUDIT] SMTP dispatch failed for ${user.email}: ${mailResult.error}`)
          return res.status(502).json({
            ok: false,
            error: 'MAIL_DELIVERY_FAILED',
            message: 'Unable to deliver verification email. Please verify SMTP service configuration.'
          })
        }

        console.log(`[AUTH-AUDIT] OTP email successfully accepted for delivery to: ${user.email}`)

        // Store secure hash of OTP with 5-minute expiry
        resetSessions.set(cleanEmail, {
          userId: user.id,
          email: user.email,
          otpHash,
          expiresAt,
          attempts: 0,
          verified: false,
          used: false
        })
      } else {
        console.warn(`[AUTH-AUDIT] No active account found for: "${cleanEmail}". Generic privacy response returned to client.`)
      }

      // Security requirement: Never reveal whether an email exists
      const response = {
        ok: true,
        message: 'If an account exists with this email, password reset instructions and a verification code have been sent.'
      }

      // In non-production or test environment, expose devOtp for automated test runner
      if (process.env.NODE_ENV !== 'production' || process.env.NODE_ENV === 'test') {
        response.devOtp = otp
      }

      res.status(200).json(response)
    } catch (err) {
      next(err)
    }
  },

  /**
   * POST /api/v1/auth/verify-identity (and /verify-otp)
   * Validates OTP and returns single-use tempToken for password update
   */
  async verifyIdentity(req, res, next) {
    try {
      const { email, otp, code } = req.body || {}
      const inputOtp = otp || code

      if (!email || String(email).trim() === '') {
        return res.status(422).json({
          ok: false,
          error: 'VALIDATION_FAILED',
          message: 'Email address is required.'
        })
      }

      if (!inputOtp || String(inputOtp).trim() === '') {
        return res.status(422).json({
          ok: false,
          error: 'VALIDATION_FAILED',
          message: 'Verification code is required.'
        })
      }

      const cleanEmail = String(email).trim().toLowerCase()
      const session = resetSessions.get(cleanEmail)

      if (!session) {
        return res.status(400).json({
          ok: false,
          error: 'INVALID_OR_EXPIRED_CODE',
          message: 'Verification code is invalid or has expired. Please request a new code.'
        })
      }

      if (session.used) {
        return res.status(400).json({
          ok: false,
          error: 'CODE_ALREADY_USED',
          message: 'This verification code has already been used. Please request a new code.'
        })
      }

      if (Date.now() > session.expiresAt) {
        resetSessions.delete(cleanEmail)
        return res.status(400).json({
          ok: false,
          error: 'CODE_EXPIRED',
          message: 'Verification code has expired. Please request a new code.'
        })
      }

      // Secure cryptographic comparison of SHA-256 hashes
      const inputHash = crypto.createHash('sha256').update(String(inputOtp).trim()).digest('hex')
      if (inputHash !== session.otpHash) {
        session.attempts = (session.attempts || 0) + 1
        if (session.attempts >= 5) {
          resetSessions.delete(cleanEmail)
          return res.status(429).json({
            ok: false,
            error: 'TOO_MANY_ATTEMPTS',
            message: 'Too many incorrect attempts. Please request a new verification code.'
          })
        }
        return res.status(400).json({
          ok: false,
          error: 'INVALID_CODE',
          message: 'Invalid verification code. Please check your email and try again.'
        })
      }

      // Valid OTP: mark as used to prevent replay and issue single-use tempToken
      session.used = true
      session.verified = true
      const tempToken = crypto.randomUUID()
      session.tempToken = tempToken
      session.tokenExpiresAt = Date.now() + 15 * 60 * 1000 // 15 mins

      res.status(200).json({
        ok: true,
        message: 'Identity verified successfully.',
        tempToken
      })
    } catch (err) {
      next(err)
    }
  },

  /**
   * POST /api/v1/auth/reset-password
   * Validates tempToken, hashes new password with bcrypt, and updates MySQL users table
   */
  async resetPassword(req, res, next) {
    try {
      const { email, tempToken, newPassword, confirmPassword } = req.body || {}

      if (!email || !tempToken || !newPassword) {
        return res.status(422).json({
          ok: false,
          error: 'VALIDATION_FAILED',
          message: 'Email, verification token, and new password are required.'
        })
      }

      if (String(newPassword).length < 8) {
        return res.status(422).json({
          ok: false,
          error: 'VALIDATION_FAILED',
          message: 'New password must be at least 8 characters long.'
        })
      }

      if (confirmPassword && String(newPassword) !== String(confirmPassword)) {
        return res.status(422).json({
          ok: false,
          error: 'VALIDATION_FAILED',
          message: 'Password confirmation does not match.'
        })
      }

      const cleanEmail = String(email).trim().toLowerCase()
      const session = resetSessions.get(cleanEmail)

      if (!session || !session.verified || session.tempToken !== tempToken) {
        return res.status(401).json({
          ok: false,
          error: 'UNAUTHORIZED_RESET',
          message: 'Invalid or expired password reset session. Please restart the reset process.'
        })
      }

      if (Date.now() > session.tokenExpiresAt) {
        resetSessions.delete(cleanEmail)
        return res.status(401).json({
          ok: false,
          error: 'RESET_TOKEN_EXPIRED',
          message: 'Password reset session has expired. Please restart the reset process.'
        })
      }

      // Generate secure bcrypt hash
      const passwordHash = await bcrypt.hash(String(newPassword).trim(), 10)

      // Persist in MySQL users table
      const updated = await UserModel.updatePassword(cleanEmail, passwordHash)
      if (!updated) {
        return res.status(404).json({
          ok: false,
          error: 'USER_NOT_FOUND',
          message: 'User account could not be found to update password.'
        })
      }

      // Invalidate session immediately to prevent reuse
      resetSessions.delete(cleanEmail)

      res.status(200).json({
        ok: true,
        message: 'Password has been successfully updated in MySQL database. You may now sign in with your new credentials.'
      })
    } catch (err) {
      next(err)
    }
  }
}

