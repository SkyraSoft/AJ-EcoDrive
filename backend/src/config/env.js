import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load .env from backend root
dotenv.config({ path: path.resolve(__dirname, '../../.env') })

const REQUIRED_CORS_ORIGINS = [
  'https://aj-eco-drive.vercel.app',
  'https://evee-showroom-management-system.vercel.app',
  'https://ecodrive.skyrasoft.com',
  // Tauri v2 on Windows uses this origin for the production WebView.
  'http://tauri.localhost'
]

function parseCorsOrigins(value) {
  if (!value) return []

  return value
    .split(',')
    .map(origin => origin.trim())
    .filter(origin => {
      // Never turn a wildcard or malformed value into an authorization rule.
      if (!origin || origin === '*') return false
      try {
        const parsed = new URL(origin)
        return (parsed.protocol === 'http:' || parsed.protocol === 'https:') &&
          !parsed.username && !parsed.password && !parsed.pathname.replace(/\/$/, '') &&
          !parsed.search && !parsed.hash
      } catch {
        return false
      }
    })
}

export const config = {
  port: parseInt(process.env.PORT, 10) || 3000,
  socketPath: process.env.SOCKET_PATH || null,
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigins: [...new Set([
    ...REQUIRED_CORS_ORIGINS,
    ...parseCorsOrigins(process.env.CORS_ORIGIN),
    ...(process.env.CORS_ORIGIN ? [] : ['http://localhost:5173', 'http://127.0.0.1:5173'])
  ])],
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
    from: process.env.SMTP_FROM || 'EVEE Showroom Security <security@eveeshowroom.com>'
  }
}

/**
 * Asserts that the current runtime configuration complies with production security standards.
 * Enforces high-entropy secrets and prevents running with default development keys in production.
 */
export function assertProductionSecurity(customConfig = config) {
  if (customConfig.nodeEnv === 'production') {
    // Prohibit demo/bypass environment variables
    if (process.env.ALLOW_DEMO_LOGIN === 'true' || process.env.ALLOW_DEMO_PASSWORDS === 'true') {
      throw new Error('[SECURITY FATAL] Production environment strictly prohibits ALLOW_DEMO_LOGIN or ALLOW_DEMO_PASSWORDS bypass flags.')
    }

    const secret = customConfig.jwtSecret
    const weakSecrets = ['dev_secret_change_me', 'ecodrive_development_secret_key_change_in_production', 'password123']
    if (!secret || secret.length < 32 || weakSecrets.includes(secret)) {
      throw new Error('[SECURITY FATAL] Production environment requires a high-entropy JWT_SECRET of at least 32 characters. Run "node backend/scripts/generate_production_secrets.js" to generate a secure secret.')
    }
  }
  return true
}
