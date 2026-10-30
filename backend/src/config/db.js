import mysql from 'mysql2/promise'
import { config } from './env.js'

let pool = null

const dbState = {
  status: 'disconnected', // 'connected' | 'disconnected' | 'error'
  client: 'mysql2',
  type: 'mysql',
  host: null,
  port: null,
  database: null,
  error: null,
  lastConnected: null
}

export function getDbStatus() {
  return {
    ...dbState,
    isConnected: dbState.status === 'connected',
    poolActive: pool !== null
  }
}

export function getPool() {
  if (!pool) {
    throw new Error('Database connection pool is not initialized. Please call connectDB() first.')
  }
  return pool
}

/**
 * Execute parameterized query using the connection pool
 */
export async function query(sql, params = []) {
  const p = getPool()
  const [results, fields] = await p.execute(sql, params)
  return results
}

/**
 * Execute a unit of work inside an explicit ACID transaction
 * Automatically begins, commits, or rolls back, and releases connection.
 */
export async function withTransaction(callback) {
  const p = getPool()
  const conn = await p.getConnection()
  try {
    await conn.beginTransaction()
    const result = await callback(conn)
    await conn.commit()
    return result
  } catch (err) {
    await conn.rollback()
    throw err
  } finally {
    conn.release()
  }
}

/**
 * Test and initialize MySQL connection pool
 */
export async function connectDB() {
  try {
    dbState.host = config.db.host
    dbState.port = config.db.port
    dbState.database = config.db.name

    console.log(`[Database] Initializing MySQL connection pool for ${config.db.user}@${config.db.host}:${config.db.port}/${config.db.name}...`)

    pool = mysql.createPool({
      host: config.db.host,
      port: config.db.port,
      user: config.db.user,
      password: config.db.password,
      database: config.db.name,
      waitForConnections: true,
      connectionLimit: config.db.connectionLimit,
      queueLimit: 0,
      connectTimeout: config.db.connectTimeoutMs,
      enableKeepAlive: true,
      keepAliveInitialDelay: 10000,
      charset: 'utf8mb4'
    })

    // Test connection
    const connection = await pool.getConnection()
    await connection.ping()
    connection.release()

    dbState.status = 'connected'
    dbState.error = null
    dbState.lastConnected = new Date().toISOString()

    console.log(`[Database] MySQL connected successfully to database "${config.db.name}" on ${config.db.host}:${config.db.port}`)
    return true
  } catch (err) {
    dbState.status = 'disconnected'
    dbState.error = err.message
    console.warn(`[Database] MySQL connection failed (${err.message}). Server will continue running without database persistence.`)
    return false
  }
}

/**
 * Gracefully close MySQL connection pool
 */
export async function disconnectDB() {
  if (pool) {
    try {
      await pool.end()
      dbState.status = 'disconnected'
      pool = null
      console.log('[Database] MySQL connection pool closed.')
    } catch (err) {
      console.error('[Database] Error closing MySQL pool:', err.message)
    }
  }
}
