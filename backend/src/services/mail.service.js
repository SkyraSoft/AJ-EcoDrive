/**
 * AJ ECODRIVE ERP — TRANSACTIONAL MAIL & OTP SERVICE
 * 
 * Provides robust dual-mode email dispatch:
 * 1. Production SMTP: Connects via nodemailer to configured SMTP relays (SendGrid, AWS SES, Mailgun, Corporate SMTP, Ethereal)
 * 2. Log / Mock Driver: Safely captures sent emails in-memory and logs them during development, testing, and offline execution.
 */

import nodemailer from 'nodemailer'
import dns from 'dns'
import { config } from '../config/env.js'

// Fast DNS cache to prevent libuv threadpool starvation during heavy crypto/bcrypt tests
const hostIpCache = new Map([
  ['smtp.ethereal.email', '95.216.108.161'],
  ['smtp.gmail.com', '192.179.20.108']
])

function customLookup(hostname, options, callback) {
  if (typeof options === 'function') {
    callback = options
    options = {}
  }
  if (hostIpCache.has(hostname)) {
    return callback(null, hostIpCache.get(hostname), 4)
  }
  dns.resolve4(hostname, (err, addresses) => {
    if (!err && addresses && addresses.length > 0) {
      hostIpCache.set(hostname, addresses[0])
      return callback(null, addresses[0], 4)
    }
    dns.lookup(hostname, options, callback)
  })
}

export const MailService = {
  // In-memory spool for test verification and offline audit
  sentEmails: [],

  /**
   * Creates or retrieves nodemailer transport based on current configuration
   */
  getTransport() {
    const mailConfig = config.mail || {}
    if (mailConfig.driver === 'smtp' && mailConfig.user && mailConfig.pass && mailConfig.host) {
      const isGmail = mailConfig.host.toLowerCase().includes('gmail')
      return nodemailer.createTransport({
        service: isGmail ? 'gmail' : undefined,
        host: mailConfig.host,
        port: mailConfig.port,
        secure: mailConfig.secure || mailConfig.port === 465,
        lookup: customLookup,
        family: 4,
        auth: {
          user: mailConfig.user,
          pass: mailConfig.pass
        },
        tls: {
          servername: mailConfig.host,
          rejectUnauthorized: false
        }
      })
    }
    return null
  },

  /**
   * Verifies connectivity to the configured mail service
   */
  async verifyConnection() {
    const mailConfig = config.mail || {}
    if (mailConfig.driver === 'smtp') {
      const transport = this.getTransport()
      if (!transport) {
        return {
          connected: false,
          driver: 'smtp',
          error: 'SMTP driver selected but host, user, or pass configuration is missing.'
        }
      }
      try {
        await transport.verify()
        return {
          connected: true,
          driver: 'smtp',
          host: mailConfig.host,
          port: mailConfig.port,
          message: 'SMTP connection verified successfully.'
        }
      } catch (err) {
        return {
          connected: false,
          driver: 'smtp',
          host: mailConfig.host,
          port: mailConfig.port,
          error: err.message,
          message: `SMTP connection verification failed: ${err.message}`
        }
      }
    }

    return {
      connected: true,
      driver: 'log',
      message: 'Log driver active (in-memory test spool mode).'
    }
  },

  /**
   * Generic email dispatcher with strict error reporting.
   * Does not silently fallback to log mode when SMTP is configured.
   */
  async sendMail({ to, subject, html, text }) {
    const mailConfig = config.mail || {}
    const from = mailConfig.from || 'AJ EcoDrive Security <security@ecodrive.pk>'

    const emailRecord = {
      to,
      from,
      subject,
      html,
      text: text || html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(),
      timestamp: new Date().toISOString()
    }

    // Always record in in-memory spool for tests and auditing
    this.sentEmails.push(emailRecord)
    if (this.sentEmails.length > 50) this.sentEmails.shift()

    if (mailConfig.driver === 'smtp') {
      const transport = this.getTransport()
      if (!transport) {
        const errorMsg = 'SMTP driver active but credentials (SMTP_HOST, SMTP_USER, SMTP_PASS) are incomplete.'
        console.error(`[MailService] ${errorMsg}`)
        emailRecord.status = 'FAILED_CONFIG'
        emailRecord.error = errorMsg
        return { success: false, error: errorMsg }
      }

      try {
        console.log(`[MAIL-AUDIT] Initiating SMTP transmission to: ${to} | Subject: "${subject}" | Host: ${mailConfig.host}:${mailConfig.port}`)
        const info = await transport.sendMail({
          from,
          to,
          subject,
          text: emailRecord.text,
          html
        })
        emailRecord.messageId = info.messageId
        emailRecord.status = 'SENT'
        console.log(`[MAIL-AUDIT] SUCCESS: SMTP transmission accepted. MessageId: ${info.messageId}`)
        const previewUrl = nodemailer.getTestMessageUrl(info)
        if (previewUrl) {
          emailRecord.previewUrl = previewUrl
          console.log(`[MAIL-AUDIT] Preview URL: ${previewUrl}`)
        }
        return {
          success: true,
          messageId: info.messageId,
          previewUrl: emailRecord.previewUrl || null
        }
      } catch (err) {
        console.error(`[MAIL-AUDIT] ERROR: SMTP delivery failed for ${to}: ${err.message}`)
        if (err.code) console.error(`[MAIL-AUDIT] SMTP Error Code: ${err.code}`)
        if (err.response) console.error(`[MAIL-AUDIT] SMTP Server Response: ${err.response}`)
        emailRecord.status = 'FAILED'
        emailRecord.error = err.message
        return {
          success: false,
          error: err.message,
          fallback: false
        }
      }
    }

    // Log Driver Mode (Standard for Dev/Test)
    emailRecord.status = 'LOGGED'
    return { success: true, logged: true, record: emailRecord }
  },

  /**
   * Generates and dispatches a branded Password Reset OTP Email
   */
  async sendPasswordResetOtp({ to, otp, recipientName = 'ECodrive User' }) {
    const subject = `[ECodrive ERP] Your Password Reset Verification Code: ${otp}`
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>ECodrive ERP Verification Code</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f6f9; margin: 0; padding: 24px; }
    .card { max-width: 540px; margin: 0 auto; background: #ffffff; border-radius: 8px; border: 1px solid #e2e8f0; overflow: hidden; }
    .header { background: #0f172a; padding: 20px 24px; text-align: center; }
    .logo { color: #10b981; font-size: 20px; font-weight: bold; letter-spacing: 1px; }
    .content { padding: 32px 24px; color: #1e293b; line-height: 1.6; }
    .otp-box { background: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 8px; text-align: center; padding: 18px; margin: 24px 0; }
    .otp-code { font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #0f172a; font-family: monospace; }
    .warning { font-size: 13px; color: #64748b; margin-top: 20px; }
    .footer { background: #f8fafc; padding: 16px 24px; font-size: 12px; color: #94a3b8; text-align: center; border-top: 1px solid #e2e8f0; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div class="logo">AJ ECODRIVE ERP</div>
    </div>
    <div class="content">
      <h2 style="margin-top:0; color:#0f172a;">Password Reset Request</h2>
      <p>Hello <strong>${recipientName}</strong>,</p>
      <p>We received a request to reset your password for your ECodrive ERP account. Use the following 6-digit verification code to complete your request:</p>
      
      <div class="otp-box">
        <div class="otp-code">${otp}</div>
      </div>
      
      <p class="warning">
        • This code is single-use and will expire in <strong>5 minutes</strong>.<br>
        • If you did not request a password reset, please disregard this email or report it to your system administrator immediately.
      </p>
    </div>
    <div class="footer">
      This is an automated security notification from AJ EcoDrive ERP Platform. Please do not reply directly to this email.
    </div>
  </div>
</body>
</html>
`
    return this.sendMail({ to, subject, html })
  }
}
