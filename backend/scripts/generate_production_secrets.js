/**
 * AJ ECODRIVE ERP — PRODUCTION SECRET GENERATOR UTILITY
 * 
 * Generates cryptographically secure high-entropy secrets (256-bit)
 * for JWT signing, payment webhook signatures, and data encryption.
 */

import crypto from 'crypto'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const BACKEND_DIR = path.resolve(__dirname, '../')
const PROD_EXAMPLE_PATH = path.resolve(BACKEND_DIR, '.env.production.example')

export function generateSecrets() {
  const jwtSecret = crypto.randomBytes(32).toString('hex')
  const webhookSecret = 'whsec_' + crypto.randomBytes(24).toString('hex')
  const sessionSecret = crypto.randomBytes(32).toString('hex')
  const dbPassword = crypto.randomBytes(16).toString('base64url')

  return {
    jwtSecret,
    webhookSecret,
    sessionSecret,
    dbPassword
  }
}

export function writeProductionExample(secrets) {
  const content = `# ==============================================================================
# AJ EcoDrive ERP — Production Environment Configuration (.env.production)
# GENERATED ON: ${new Date().toISOString()}
#
# IMPORTANT:
# 1. Store this file securely outside version control.
# 2. Never commit actual production secrets to Git.
# ==============================================================================

# Server Network Configuration
PORT=3000
NODE_ENV=production

# Allowed CORS Origins (Replace with production domain)
CORS_ORIGIN=https://erp.ecodrive.pk

# MySQL Database Configuration (Production Database Server)
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=ecodrive
DB_USER=ecodrive_prod
DB_PASSWORD=${secrets.dbPassword}
DB_CONNECTION_LIMIT=25
DB_CONNECT_TIMEOUT_MS=10000

# JSON Web Token Secret (High-Entropy 256-Bit Cryptographic Key)
JWT_SECRET=${secrets.jwtSecret}
JWT_EXPIRES_IN=24h

# Transactional Mail / SMTP Relay Configuration
MAIL_DRIVER=smtp
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASS=YOUR_SENDGRID_OR_AWS_SES_API_KEY
SMTP_FROM=ECodrive Security <security@ecodrive.pk>

# Payment Gateway Configuration
PAYMENT_DRIVER=sandbox
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=${secrets.webhookSecret}

# Automated Backup Settings
BACKUP_RETENTION_COUNT=14
`

  fs.writeFileSync(PROD_EXAMPLE_PATH, content, 'utf8')
  return PROD_EXAMPLE_PATH
}

if (process.argv[1] && process.argv[1].endsWith('generate_production_secrets.js')) {
  console.log('===============================================================')
  console.log('AJ ECODRIVE ERP — HIGH-ENTROPY PRODUCTION SECRETS GENERATOR')
  console.log('===============================================================\n')

  const secrets = generateSecrets()
  console.log('Cryptographic Secrets Generated Safely:')
  console.log('  JWT_SECRET:             [256-bit Key Generated - Protected]')
  console.log('  PAYMENT_WEBHOOK_SECRET: [Webhook HMAC Key Generated - Protected]')
  console.log('  SESSION_SECRET:         [Session Entropy Key Generated - Protected]')
  console.log('  SUGGESTED_DB_PASS:      [Database Password Generated - Protected]\n')

  const examplePath = writeProductionExample(secrets)
  console.log(`Written production configuration template to:`)
  console.log(`  ${examplePath}\n`)
  console.log('===============================================================')
}

