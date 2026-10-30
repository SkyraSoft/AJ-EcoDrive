import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load .env from backend root
dotenv.config({ path: path.resolve(__dirname, '../../.env') })

export const config = {
  port: parseInt(process.env.PORT, 10) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigins: process.env.CORS_ORIGIN 
    ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
    : ['http://localhost:5173', 'http://127.0.0.1:5173'],
  db: {
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    name: process.env.DB_NAME || 'ecodrive',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT, 10) || 10,
    connectTimeoutMs: parseInt(process.env.DB_CONNECT_TIMEOUT_MS, 10) || 5000
  },
  jwtSecret: process.env.JWT_SECRET || 'dev_secret_change_me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  mail: {
    driver: process.env.MAIL_DRIVER || 'log', // 'smtp' | 'log'
    host: process.env.SMTP_HOST || '127.0.0.1',
    port: parseInt(process.env.SMTP_PORT, 10) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    from: process.env.SMTP_FROM || 'ECodrive Security <security@ecodrive.pk>'
  }
}

/**
 * Asserts that the current runtime configuration complies with production security standards.
 * Enforces high-entropy secrets and prevents running with default development keys in production.
 */
export function assertProductionSecurity(customConfig = config) {
  if (customConfig.nodeEnv === 'production') {
    const secret = customConfig.jwtSecret
    const weakSecrets = ['dev_secret_change_me', 'ecodrive_development_secret_key_change_in_production', 'password123']
    if (!secret || secret.length < 32 || weakSecrets.includes(secret)) {
      throw new Error('[SECURITY FATAL] Production environment requires a high-entropy JWT_SECRET of at least 32 characters. Run "node backend/scripts/generate_production_secrets.js" to generate a secure secret.')
    }
  }
  return true
}
