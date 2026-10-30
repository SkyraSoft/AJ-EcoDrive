import nodemailer from 'nodemailer'
import { config } from '../src/config/env.js'
import { MailService } from '../src/services/mail.service.js'

async function main() {
  console.log('[SMTP Verification] Inspecting current mail configuration...')
  console.log('Driver:', config.mail.driver)
  console.log('Host:', config.mail.host)
  console.log('Port:', config.mail.port)
  console.log('User:', config.mail.user ? '***configured***' : '(empty)')

  // Direct test of Ethereal account
  const testTransporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    family: 4,
    tls: {
      servername: 'smtp.ethereal.email',
      rejectUnauthorized: false
    },
    auth: {
      user: 'zhbqg3ybu3wbua6u@ethereal.email',
      pass: 'cZm9jt67fzSUmqm4FT'
    }
  })

  console.log('[SMTP Verification] Verifying connection to smtp.ethereal.email:587...')
  await testTransporter.verify()
  console.log('[SMTP Verification] SUCCESS: Ethereal SMTP server connection verified!')

  console.log('[SMTP Verification] Sending test OTP dispatch email...')
  const testOtp = '748291'
  const info = await testTransporter.sendMail({
    from: 'AJ EcoDrive Security <zhbqg3ybu3wbua6u@ethereal.email>',
    to: 'admin@ajecodrive.com',
    subject: `[ECodrive ERP] Your Password Reset Verification Code: ${testOtp}`,
    text: `Your password reset code is: ${testOtp}. It expires in 5 minutes.`,
    html: `<div style="font-family:sans-serif;padding:20px;border:1px solid #e2e8f0;border-radius:8px;">
      <h2 style="color:#0f172a;">AJ ECODRIVE ERP</h2>
      <p>Your password reset code is: <b style="font-size:24px;letter-spacing:4px;color:#10b981;">${testOtp}</b></p>
      <p>This code expires in 5 minutes.</p>
    </div>`
  })

  console.log('[SMTP Verification] Message dispatched successfully!')
  console.log('[SMTP Verification] Message ID:', info.messageId)
  const previewUrl = nodemailer.getTestMessageUrl(info)
  console.log('[SMTP Verification] View delivered email in browser:', previewUrl)
}

main().catch(err => {
  console.error('[SMTP Verification] Error:', err)
  process.exit(1)
})
