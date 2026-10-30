import express from 'express'
import cors from 'cors'
import { config } from './config/env.js'
import apiRouter from './routes/index.js'
import { notFoundHandler } from './middleware/notFound.js'
import { errorHandler } from './middleware/errorHandler.js'

export const app = express()

// 1. CORS Configuration for EcoDrive Frontend
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true)
    
    if (config.corsOrigins.includes(origin) || config.corsOrigins.includes('*')) {
      return callback(null, true)
    }
    
    // In development mode, allow localhost on any port
    if (config.nodeEnv === 'development' && /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
      return callback(null, true)
    }

    return callback(new Error(`CORS error: Origin ${origin} not allowed by Access-Control policy`))
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
  exposedHeaders: ['Content-Range', 'X-Total-Count']
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
