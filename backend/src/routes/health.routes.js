import { Router } from 'express'
import { config } from '../config/env.js'
import { getDbStatus } from '../config/db.js'

const router = Router()

router.get('/', (req, res) => {
  const dbStatus = getDbStatus()

  res.status(200).json({
    ok: true,
    status: dbStatus.isConnected ? 'healthy' : 'degraded (db offline)',
    service: 'AJ EcoDrive ERP Backend API',
    version: '1.0.0',
    uptime: `${Math.floor(process.uptime())}s`,
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
    database: {
      type: 'mysql',
      client: dbStatus.client || 'mysql2',
      status: dbStatus.status,
      isConnected: dbStatus.isConnected,
      host: dbStatus.host || config.db.host,
      port: dbStatus.port || config.db.port,
      name: dbStatus.database || config.db.name,
      error: dbStatus.error || null,
      lastConnected: dbStatus.lastConnected || null
    },
    system: {
      nodeVersion: process.version,
      platform: process.platform,
      memoryUsageMB: Math.round(process.memoryUsage().heapUsed / 1024 / 1024)
    }
  })
})

export default router
