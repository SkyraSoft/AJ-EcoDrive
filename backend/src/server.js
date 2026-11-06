import fs from 'fs'
import { app } from './app.js'
import { config, assertProductionSecurity } from './config/env.js'
import { connectDB, disconnectDB } from './config/db.js'
import { runMigrations } from './db/migrations.js'

async function startServer() {
  // 0. Production security gate — fatal if weak JWT secret in production
  try {
    assertProductionSecurity(config)
  } catch (secErr) {
    console.error(`\n[SECURITY FATAL] ${secErr.message}\n`)
    process.exit(1)
  }

  // 1. Initialize MySQL connection pool
  const dbConnected = await connectDB()

  // 2. Run safe schema migrations if connected — ABORT if migrations fail
  if (dbConnected) {
    try {
      await runMigrations()
    } catch (migErr) {
      console.error(`\n[Server] FATAL: Schema migration failed — refusing to start HTTP server against a partially migrated database.\n  Error: ${migErr.message}\n`)
      await disconnectDB()
      process.exit(2)
    }
  }

  // 3. Start Express HTTP Server (TCP Port or Unix Domain Socket)
  const listenTarget = config.socketPath || config.port
  if (config.socketPath) {
    try {
      if (fs.existsSync(config.socketPath)) {
        fs.unlinkSync(config.socketPath)
      }
    } catch (_) {}
  }

  const server = app.listen(listenTarget, () => {
    if (config.socketPath) {
      try {
        fs.chmodSync(config.socketPath, '0777')
      } catch (_) {}
    }
    console.log(`
==========================================================
  AJ EcoDrive ERP — Backend Server Initialized
==========================================================
  Environment  : ${config.nodeEnv}
  Listen Target: ${listenTarget}
  Health Check : ${config.socketPath ? 'Via UNIX Domain Socket' : `http://localhost:${config.port}/api/v1/health`}
  Database     : MySQL (${config.db.user}@${config.db.host}:${config.db.port}/${config.db.name})
  CORS Allowed : ${config.corsOrigins.join(', ')}
==========================================================
`)
  })

  // 4. Graceful Shutdown Handlers
  const shutdown = async (signal) => {
    console.log(`\n[Server] Received ${signal}. Starting graceful shutdown...`)
    server.close(async () => {
      console.log('[Server] HTTP server closed.')
      if (config.socketPath) {
        try {
          if (fs.existsSync(config.socketPath)) {
            fs.unlinkSync(config.socketPath)
          }
        } catch (_) {}
      }
      await disconnectDB()
      process.exit(0)
    })

    // Force shutdown after 10s timeout
    setTimeout(() => {
      console.error('[Server] Forced shutdown after timeout.')
      process.exit(1)
    }, 10000)
  }

  process.on('SIGINT', () => shutdown('SIGINT'))
  process.on('SIGTERM', () => shutdown('SIGTERM'))

  return server
}

startServer().catch((err) => {
  console.error('[Server] Fatal startup failure:', err)
  process.exit(1)
})
