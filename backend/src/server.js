import { app } from './app.js'
import { config } from './config/env.js'
import { connectDB, disconnectDB } from './config/db.js'
import { runMigrations } from './db/migrations.js'

async function startServer() {
  // 1. Initialize MySQL connection pool
  const dbConnected = await connectDB()

  // 2. Run safe schema migrations if connected
  if (dbConnected) {
    try {
      await runMigrations()
    } catch (migErr) {
      console.error('[Server] Schema migration warning:', migErr.message)
    }
  }

  // 3. Start Express HTTP Server
  const server = app.listen(config.port, () => {
    console.log(`
==========================================================
  AJ EcoDrive ERP — Backend Server Initialized
==========================================================
  Environment  : ${config.nodeEnv}
  Local URL    : http://localhost:${config.port}
  Health Check : http://localhost:${config.port}/api/v1/health
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
