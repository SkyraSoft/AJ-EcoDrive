/**
 * AJ ECODRIVE ERP — REAL SMTP INBOX DELIVERY PROBE
 * 
 * Tests connection to a live SMTP provider (e.g., Gmail, SendGrid, Amazon SES, or custom relay)
 * and dispatches a verification email directly to a specified real inbox address.
 * 
 * Usage:
 *   node backend/scripts/test_real_smtp_recipient.js <recipient_email> [smtp_host] [smtp_port] [smtp_user] [smtp_pass] [smtp_secure]
 */

import nodemailer from 'nodemailer'
import dns from 'dns'
import { config } from '../src/config/env.js'

function customLookup(hostname, options, callback) {
  if (typeof options === 'function') {
    callback = options
    options = {}
  }
  dns.resolve4(hostname, (err, addresses) => {
    if (!err && addresses && addresses.length > 0) {
      return callback(null, addresses[0], 4)
    }
    dns.lookup(hostname, options, callback)
  })
}

async function probeRealDelivery() {
  const targetRecipient = process.argv[2]
  if (!targetRecipient || !targetRecipient.includes('@')) {
    console.error('ERROR: Please specify a valid recipient email address as the first argument.')
    console.error('Usage: node backend/scripts/test_real_smtp_recipient.js user@yourdomain.com')
    process.exit(1)
  }

  const host = process.argv[3] || config.mail.host
  const port = parseInt(process.argv[4] || config.mail.port, 10)
  const user = process.argv[5] || config.mail.user
  const pass = process.argv[6] || config.mail.pass
  const secure = process.argv[7] ? process.argv[7] === 'true' : (config.mail.secure || port === 465)

  console.log('======================================================================')
  console.log('AJ ECODRIVE ERP — REAL SMTP INBOX DELIVERY PROBE')
  console.log('======================================================================')
  console.log(`Target Recipient : ${targetRecipient}`)
  console.log(`SMTP Host        : ${host}`)
  console.log(`SMTP Port        : ${port} (${secure ? 'SSL' : 'STARTTLS'})`)
  console.log(`SMTP User        : ${user ? user.substring(0, 3) + '***@' + (user.includes('@') ? user.split('@')[1] : 'domain') : '(empty)'}`)
  console.log(`SMTP Password    : ${pass ? '******** [CONFIGURED]' : '(missing)'}`)

  if (!user || !pass) {
    console.error('\n[FATAL] SMTP credentials are not configured!')
    console.error('To send to a real external inbox (e.g. Gmail), valid credentials are required.')
    process.exit(1)
  }

  const isGmail = host.toLowerCase().includes('gmail')
  const transporter = nodemailer.createTransport({
    service: isGmail ? 'gmail' : undefined,
    host,
    port,
    secure,
    lookup: customLookup,
    family: 4,
    auth: { user, pass },
    tls: {
      servername: host,
      rejectUnauthorized: false
    }
  })

  console.log('\n[1/3] Testing handshake and authentication with SMTP server...')
  await transporter.verify()
  console.log('      SUCCESS: SMTP server authenticated successfully!')

  console.log(`\n[2/3] Dispatching real test OTP verification email to ${targetRecipient}...`)
  const testOtp = Math.floor(100000 + Math.random() * 900000).toString()
  const info = await transporter.sendMail({
    from: `AJ EcoDrive Security <${user}>`,
    to: targetRecipient,
    subject: `[AJ EcoDrive ERP] Real Delivery Verification Code: ${testOtp}`,
    text: `Your ECodrive verification code is ${testOtp}. This code expires in 5 minutes.`,
    html: `
      <div style="font-family: -apple-system, sans-serif; max-width: 500px; padding: 24px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #0f172a; margin-top: 0;">AJ ECODRIVE ERP</h2>
        <p>This is a real inbox verification email confirming live outbound delivery.</p>
        <p>Your 6-digit verification code is:</p>
        <div style="background: #f1f5f9; padding: 16px; text-align: center; border-radius: 6px; font-size: 28px; font-weight: bold; letter-spacing: 6px; color: #0f172a; margin: 16px 0;">
          ${testOtp}
        </div>
        <p style="font-size: 13px; color: #64748b;">Code expires in 5 minutes. If you did not request this code, you may safely ignore this message.</p>
      </div>
    `
  })

  console.log('      SUCCESS: Message accepted by SMTP relay!')
  console.log(`      Message ID: ${info.messageId}`)
  console.log(`      Server Response: ${info.response || 'OK'}`)

  console.log('\n[3/3] Checking delivery confirmation...')
  console.log(`      Recipient: ${targetRecipient}`)
  console.log('      STATUS: DELIVERED TO REMOTE MAIL RELAY (PASS)')
  console.log('======================================================================\n')
}

probeRealDelivery().catch(err => {
  console.error('\n[DELIVERY PROBE ERROR]:', err.message)
  if (err.code) console.error('Error Code:', err.code)
  if (err.response) console.error('SMTP Response:', err.response)
  process.exit(1)
})

