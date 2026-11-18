import express from 'express'
import cors from 'cors'
import { config } from './config/env.js'
import apiRouter from './routes/index.js'
import { notFoundHandler } from './middleware/notFound.js'
import { errorHandler } from './middleware/errorHandler.js'

export const app = express()

function isAllowedOrigin(origin) {
  if (!origin) return true // Allow requests without Origin (e.g. mobile apps, curl, server-to-server)

  // Required web and Windows Tauri production origins plus validated CORS_ORIGIN values.
  if (config.corsOrigins.includes(origin)) return true

  // Official Vercel preview deployments for AJ EcoDrive.
  if (/^https:\/\/aj-eco-drive[a-z0-9-]*\.vercel\.app$/.test(origin) ||
      /^https:\/\/aj-eco-drive[a-z0-9-]*\.skyrasofts-projects\.vercel\.app$/.test(origin)) {
    return true
  }

  // 4. In development mode only, allow localhost on development ports
  if (config.nodeEnv === 'development' && /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
    return true
  }

  return false
}

const corsOptions = {
  origin: (origin, callback) => {
    if (isAllowedOrigin(origin)) {
      return callback(null, true)
    }
    // For unauthorized origins, pass null, false:
    // 1. No Access-Control-Allow-Origin header is emitted.
    // 2. Prevents throwing a generic HTTP 500 error on the server.
    return callback(null, false)
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'X-Branch-ID',
    'X-User-Role'
  ],
  exposedHeaders: ['Content-Range', 'X-Total-Count'],
  optionsSuccessStatus: 204
}

app.use(cors(corsOptions))

// 2. Request Parsers
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// 3. API Root & Versioned Routes
app.use('/api/v1', apiRouter)

// Root welcome route
app.get('/', (req, res) => {
  res.json({
    ok: true,
    service: 'AJ EcoDrive ERP Backend Gateway',
    version: '1.0.0',
    apiDocs: '/api/v1',
    health: '/api/v1/health'
  })
})

// 4. Fallback Handlers
app.use(notFoundHandler)
app.use(errorHandler)
