/**
 * AJ ECODRIVE ERP — SECURE GMAIL SMTP CONFIGURATOR
 * 
 * Safely applies and verifies Google App Password in backend/.env
 * Supports both interactive terminal prompts (via readline) and command-line arguments.
 * Never displays or logs the password secret.
 */

import fs from 'fs'
import path from 'path'
import dns from 'dns'
import readline from 'readline'
import nodemailer from 'nodemailer'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const envPath = path.resolve(__dirname, '../.env')

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

function ask(questionText) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })
  return new Promise(resolve => {
    rl.question(questionText, answer => {
      rl.close()
      resolve(String(answer || '').trim())
    })
  })
}

async function promptUntil(questionText, validator, errorMessage) {
  while (true) {
    const input = await ask(questionText)
    // Clean accidental surrounding quotes: "email@gmail.com" -> email@gmail.com
    const cleaned = input.replace(/^["']|["']$/g, '').trim()
    if (validator(cleaned)) {
      return cleaned
    }
    console.log(`\n  [!] ${errorMessage}\n`)
  }
}

async function applyGmailSmtp() {
  console.log('======================================================================')
  console.log('           AJ ECODRIVE ERP — GMAIL SMTP CONFIGURATION')
  console.log('======================================================================\n')

  let gmailUser = String(process.argv[2] || '').replace(/^["']|["']$/g, '').trim()
  let rawPass = String(process.argv[3] || '').replace(/^["']|["']$/g, '').trim()

  // 1. Interactive prompt for Gmail address if not supplied or invalid
  if (!gmailUser || !gmailUser.includes('@')) {
    console.log('Step 1 of 2: Gmail Account')
    gmailUser = await promptUntil(
      'Enter your Gmail address (e.g. name@gmail.com): ',
      val => val && val.includes('@'),
      'Please enter a valid email address containing "@" (e.g. admin@gmail.com)'
    )
    console.log('')
  }

  // 2. Interactive prompt for 16-character App Password if not supplied
  if (!rawPass) {
    console.log('Step 2 of 2: Google App Password')
    console.log('(Enter the 16-character code generated from https://myaccount.google.com/apppasswords)')
    rawPass = await promptUntil(
      'Enter your 16-character App Password: ',
      val => val && val.replace(/\s+/g, '').length >= 16,
      'App Password must be 16 characters (e.g. "abcd efgh ijkl mnop"). Please try again.'
    )
    console.log('')
  }

  // Clean password: strip all spaces
  const cleanPass = rawPass.replace(/\s+/g, '')

  console.log('----------------------------------------------------------------------')
  console.log(`Configuring for account : ${gmailUser}`)
  console.log(`App Password status     : ${cleanPass.length} characters [RECEIVED]`)
  console.log('Testing authentication against smtp.gmail.com:465...')
  console.log('----------------------------------------------------------------------\n')

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    lookup: customLookup,
    family: 4,
    auth: {
      user: gmailUser,
      pass: cleanPass
    },
    tls: {
      servername: 'smtp.gmail.com',
      rejectUnauthorized: false
    }
  })

  try {
    await transporter.verify()
    console.log('  [PASS] Authentication successful! Google SMTP accepted your credentials.\n')
  } catch (verifyErr) {
    console.error('  [FAIL] Authentication failed:', verifyErr.message)
    if (verifyErr.code === 'EAUTH') {
      console.error('\nNOTE FROM GOOGLE:')
      console.error('1. Make sure 2-Step Verification is ON in your Google Account.')
      console.error('2. Generate an App Password at: https://myaccount.google.com/apppasswords')
      console.error('3. Make sure to use the 16-character App Password, NOT your regular account password.\n')
    }
    process.exit(1)
  }

  // Read and update backend/.env safely
  let envContent = fs.readFileSync(envPath, 'utf8')

  const smtpBlock = [
    'MAIL_DRIVER=smtp',
    'SMTP_HOST=smtp.gmail.com',
    'SMTP_PORT=465',
    'SMTP_SECURE=true',
    `SMTP_USER=${gmailUser}`,
    `SMTP_PASS=${cleanPass}`,
    `SMTP_FROM="AJ EcoDrive Security <${gmailUser}>"`
  ].join('\r\n')

  const regex = /# SMTP Mail Configuration[\s\S]*$/
  if (regex.test(envContent)) {
    envContent = envContent.replace(regex, `# SMTP Mail Configuration\r\n${smtpBlock}\r\n`)
  } else {
    envContent = envContent
      .replace(/MAIL_DRIVER=.*/, 'MAIL_DRIVER=smtp')
      .replace(/SMTP_HOST=.*/, 'SMTP_HOST=smtp.gmail.com')
      .replace(/SMTP_PORT=.*/, 'SMTP_PORT=465')
      .replace(/SMTP_SECURE=.*/, 'SMTP_SECURE=true')
      .replace(/SMTP_USER=.*/, `SMTP_USER=${gmailUser}`)
      .replace(/SMTP_PASS=.*/, `SMTP_PASS=${cleanPass}`)
      .replace(/SMTP_FROM=.*/, `SMTP_FROM="AJ EcoDrive Security <${gmailUser}>"`)
  }

  fs.writeFileSync(envPath, envContent, 'utf8')
  console.log('======================================================================')
  console.log('[SUCCESS] backend/.env updated with production Gmail SMTP configuration!')
  console.log(`[STATUS] Mail Driver: smtp | Host: smtp.gmail.com | SSL: true (Port 465)`)
  console.log(`[STATUS] Active User: ${gmailUser.substring(0, 3)}***@gmail.com`)
  console.log('======================================================================\n')
}

applyGmailSmtp().catch(err => {
  console.error('Fatal configuration error:', err.message)
  process.exit(1)
})
