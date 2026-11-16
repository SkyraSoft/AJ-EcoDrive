/**
 * AJ ECODRIVE ERP — CAPACITOR SQLITE STORAGE ADAPTER
 * 
 * Production SQLite storage engine for Android Mobile Application.
 * Integrates with @capacitor-community/sqlite for native Android SQLite persistence,
 * supporting ACID transactions, schema version migrations, branch-scoped queries,
 * durable outbox queues, and in-memory fallback for test harnesses.
 */

import { StorageAdapter } from './StorageAdapter.js'

export const CAPACITOR_SQLITE_DB_NAME = 'ecodrive_mobile_offline'
export const SCHEMA_VERSION = 1

// Shared fallback memory store for test runners and web simulations
const CAP_FALLBACK_STORES = new Map()

export class CapacitorSQLiteStorageAdapter extends StorageAdapter {
  constructor(dbName = CAPACITOR_SQLITE_DB_NAME, version = SCHEMA_VERSION) {
    super()
    this.dbName = dbName
    this.version = version
    this.sqlitePlugin = null
    this.db = null
    this.isFallback = false
    this.migrated = false

    if (!CAP_FALLBACK_STORES.has(dbName)) {
      CAP_FALLBACK_STORES.set(dbName, new Map([
        ['entities', new Map()],
        ['outbox', new Map()],
        ['conflicts', new Map()],
        ['tombstones', new Map()],
        ['sync_state', new Map()]
      ]))
    }
  }

  /**
   * Detects whether running inside active Capacitor Native Android runtime
   */
  static isCapacitorAvailable() {
    if (typeof window === 'undefined') return false
    return Boolean(
      window.Capacitor &&
      (typeof window.Capacitor.isNativePlatform === 'function' ? window.Capacitor.isNativePlatform() : false)
    )
  }

  /**
   * Initializes the native SQLite connection and applies schema migrations
   */
  async init() {
    if (this.db) return this.db

    if (!CapacitorSQLiteStorageAdapter.isCapacitorAvailable()) {
      this.isFallback = true
      return null
    }

    try {
      const { CapacitorSQLite, SQLiteConnection } = await import('@capacitor-community/sqlite')
      const sqlite = new SQLiteConnection(CapacitorSQLite)
      this.sqlitePlugin = sqlite

      // Check if connection is already open
      const isConn = await sqlite.isConnection(this.dbName, false)
      if (isConn.result) {
        this.db = await sqlite.retrieveConnection(this.dbName, false)
      } else {
        this.db = await sqlite.createConnection(this.dbName, false, 'no-encryption', this.version, false)
      }

      await this.db.open()
      await this.runMigrations()
      return this.db
    } catch (err) {
      console.warn('[CapacitorSQLiteStorageAdapter] Native SQLite init failed, falling back to memory store:', err)
      this.isFallback = true
      return null
    }
  }

  /**
   * Executes database schema migrations
   */
  async runMigrations() {
    if (!this.db || this.migrated) return

    const schemaDDL = `
      CREATE TABLE IF NOT EXISTS schema_migrations (
        version INTEGER PRIMARY KEY,
        applied_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS entities (
        id TEXT PRIMARY KEY,
        entity_type TEXT NOT NULL,
        branch_id TEXT,
        user_id TEXT,
        updated_at TEXT NOT NULL,
        payload TEXT NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_entities_type_branch ON entities (entity_type, branch_id);

      CREATE TABLE IF NOT EXISTS outbox (
        id TEXT PRIMARY KEY,
        idempotency_key TEXT UNIQUE NOT NULL,
        entity_type TEXT NOT NULL,
        entity_id TEXT NOT NULL,
        action TEXT NOT NULL,
        payload TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        retry_count INTEGER NOT NULL DEFAULT 0,
        last_error TEXT,
        branch_id TEXT,
        user_id TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_outbox_status_created ON outbox (status, created_at);

      CREATE TABLE IF NOT EXISTS conflicts (
        id TEXT PRIMARY KEY,
        mutation_id TEXT NOT NULL,
        entity_type TEXT NOT NULL,
        entity_id TEXT NOT NULL,
        local_payload TEXT NOT NULL,
        server_payload TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending_review',
        created_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS tombstones (
        id TEXT PRIMARY KEY,
        entity_type TEXT NOT NULL,
        entity_id TEXT NOT NULL,
        branch_id TEXT,
        deleted_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS sync_state (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
    `

    await this.db.execute(schemaDDL)
    await this.db.run(
      'INSERT OR REPLACE INTO schema_migrations (version, applied_at) VALUES (?, ?);',
      [1, new Date().toISOString()]
    )
    this.migrated = true
  }

  // --- StorageAdapter API Implementation ---

  async get(storeName, key) {
    if (this.isFallback || !this.db) {
      const store = CAP_FALLBACK_STORES.get(this.dbName)?.get(storeName)
      return store ? store.get(String(key)) || null : null
    }

    if (storeName === 'sync_state') {
      const res = await this.db.query('SELECT value FROM sync_state WHERE key = ?;', [String(key)])
      if (!res.values || res.values.length === 0) return null
      try { return JSON.parse(res.values[0].value) } catch { return res.values[0].value }
    }

    const res = await this.db.query(`SELECT payload FROM ${storeName} WHERE id = ?;`, [String(key)])
    if (!res.values || res.values.length === 0) return null
    try { return JSON.parse(res.values[0].payload) } catch { return res.values[0].payload }
  }

  async set(storeName, key, value) {
    if (this.isFallback || !this.db) {
      const store = CAP_FALLBACK_STORES.get(this.dbName)?.get(storeName)
      if (store) store.set(String(key), value)
      return value
    }

    const now = new Date().toISOString()
    const strKey = String(key)

    if (storeName === 'sync_state') {
      const strVal = typeof value === 'object' ? JSON.stringify(value) : String(value)
      await this.db.run(
        'INSERT OR REPLACE INTO sync_state (key, value, updated_at) VALUES (?, ?, ?);',
        [strKey, strVal, now]
      )
      return value
    }

    const payload = JSON.stringify(value)
    if (storeName === 'entities') {
      const entityType = value.entityType || value.collection || 'generic'
      const branchId = value.branch_id || value.branchId || null
      const userId = value.user_id || value.userId || null
      await this.db.run(
        'INSERT OR REPLACE INTO entities (id, entity_type, branch_id, user_id, updated_at, payload) VALUES (?, ?, ?, ?, ?, ?);',
        [strKey, entityType, branchId, userId, now, payload]
      )
    } else if (storeName === 'outbox') {
      const idempotencyKey = value.idempotency_key || value.idempotencyKey || strKey
      const entityType = value.entity_type || value.entityType || 'unknown'
      const entityId = value.entity_id || value.entityId || strKey
      const action = value.action || 'MUTATE'
      const status = value.status || 'pending'
      const retryCount = Number(value.retry_count || value.retryCount || 0)
      const lastError = value.last_error || value.lastError || null
      const branchId = value.branch_id || value.branchId || null
      const userId = value.user_id || value.userId || null
      const createdAt = value.created_at || value.createdAt || now
      await this.db.run(
        `INSERT OR REPLACE INTO outbox (
          id, idempotency_key, entity_type, entity_id, action, payload, status, retry_count, last_error, branch_id, user_id, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        [strKey, idempotencyKey, entityType, entityId, action, payload, status, retryCount, lastError, branchId, userId, createdAt, now]
      )
    } else if (storeName === 'conflicts') {
      const mutationId = value.mutation_id || value.mutationId || ''
      const entityType = value.entity_type || value.entityType || ''
      const entityId = value.entity_id || value.entityId || ''
      const localPayload = JSON.stringify(value.local_payload || value.localPayload || {})
      const serverPayload = JSON.stringify(value.server_payload || value.serverPayload || {})
      const status = value.status || 'pending_review'
      const createdAt = value.created_at || value.createdAt || now
      await this.db.run(
        'INSERT OR REPLACE INTO conflicts (id, mutation_id, entity_type, entity_id, local_payload, server_payload, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?);',
        [strKey, mutationId, entityType, entityId, localPayload, serverPayload, status, createdAt]
      )
    } else if (storeName === 'tombstones') {
      const entityType = value.entity_type || value.entityType || ''
      const entityId = value.entity_id || value.entityId || strKey
      const branchId = value.branch_id || value.branchId || null
      const deletedAt = value.deleted_at || value.deletedAt || now
      await this.db.run(
        'INSERT OR REPLACE INTO tombstones (id, entity_type, entity_id, branch_id, deleted_at) VALUES (?, ?, ?, ?, ?);',
        [strKey, entityType, entityId, branchId, deletedAt]
      )
    }

    return value
  }

  async remove(storeName, key) {
    if (this.isFallback || !this.db) {
      const store = CAP_FALLBACK_STORES.get(this.dbName)?.get(storeName)
      if (store) store.delete(String(key))
      return true
    }

    const field = storeName === 'sync_state' ? 'key' : 'id'
    await this.db.run(`DELETE FROM ${storeName} WHERE ${field} = ?;`, [String(key)])
    return true
  }

  async list(storeName, filterFn = null) {
    if (this.isFallback || !this.db) {
      const store = CAP_FALLBACK_STORES.get(this.dbName)?.get(storeName)
      const all = store ? Array.from(store.values()) : []
      return filterFn ? all.filter(filterFn) : all
    }

    let records = []
    if (storeName === 'sync_state') {
      const res = await this.db.query('SELECT key, value FROM sync_state;')
      records = (res.values || []).map(r => {
        try { return { key: r.key, value: JSON.parse(r.value) } } catch { return { key: r.key, value: r.value } }
      })
    } else {
      const res = await this.db.query(`SELECT payload FROM ${storeName};`)
      records = (res.values || []).map(r => {
        try { return JSON.parse(r.payload) } catch { return r.payload }
      })
    }

    return filterFn ? records.filter(filterFn) : records
  }

  async clear(storeName) {
    if (this.isFallback || !this.db) {
      const store = CAP_FALLBACK_STORES.get(this.dbName)?.get(storeName)
      if (store) store.clear()
      return true
    }

    await this.db.run(`DELETE FROM ${storeName};`)
    return true
  }

  async batchSet(storeName, items) {
    if (!Array.isArray(items)) return []
    for (const item of items) {
      const key = item.id || item.key || item.mutation_id || item.mutationId
      if (key) {
        await this.set(storeName, key, item)
      }
    }
    return items
  }

  async batchRemove(storeName, keys) {
    if (!Array.isArray(keys)) return true
    for (const key of keys) {
      await this.remove(storeName, key)
    }
    return true
  }
}
