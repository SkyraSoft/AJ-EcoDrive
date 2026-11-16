/**
 * AJ ECODRIVE ERP — SQLITE STORAGE ADAPTER
 * 
 * Production SQLite storage engine for Windows Tauri Desktop Application.
 * Supports transactional ACID writes, schema migrations, durable outbox queueing,
 * branch-scoped indexing, and seamless in-memory fallback for unit testing.
 */

import { StorageAdapter } from './StorageAdapter.js'

export const SQLITE_DB_NAME = 'sqlite:ecodrive_offline.db'
export const SCHEMA_VERSION = 1

// Shared in-memory fallback for test harnesses or environments without Tauri runtime
const SQLITE_FALLBACK_STORES = new Map()

export class SQLiteStorageAdapter extends StorageAdapter {
  constructor(dbUri = SQLITE_DB_NAME, version = SCHEMA_VERSION) {
    super()
    this.dbUri = dbUri
    this.version = version
    this.db = null
    this.isFallback = false
    this.migrated = false

    if (!SQLITE_FALLBACK_STORES.has(dbUri)) {
      SQLITE_FALLBACK_STORES.set(dbUri, new Map([
        ['entities', new Map()],
        ['outbox', new Map()],
        ['conflicts', new Map()],
        ['tombstones', new Map()],
        ['sync_state', new Map()]
      ]))
    }
  }

  /**
   * Detects whether running inside active Tauri runtime
   */
  static isTauriAvailable() {
    return typeof window !== 'undefined' && Boolean(window.__TAURI_INTERNALS__ || window.__TAURI__)
  }

  /**
   * Initializes the SQLite database and executes migrations
   */
  async init() {
    if (this.db) return this.db

    if (!SQLiteStorageAdapter.isTauriAvailable()) {
      this.isFallback = true
      return null
    }

    try {
      // Dynamically load the Tauri SQL plugin
      const { default: Database } = await import('@tauri-apps/plugin-sql')
      this.db = await Database.load(this.dbUri)
      await this.runMigrations()
      return this.db
    } catch (err) {
      console.warn('[SQLiteStorageAdapter] Tauri SQL connection failed, falling back to memory store:', err)
      this.isFallback = true
      return null
    }
  }

  /**
   * Applies schema definitions and version migrations
   */
  async runMigrations() {
    if (!this.db || this.migrated) return

    // 1. Schema Migrations table
    await this.db.execute(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        version INTEGER PRIMARY KEY,
        applied_at TEXT NOT NULL
      );
    `)

    // Check current version
    const applied = await this.db.select(
      'SELECT version FROM schema_migrations ORDER BY version DESC LIMIT 1'
    )
    const currentVersion = applied.length > 0 ? applied[0].version : 0

    if (currentVersion < 1) {
      // Version 1: Core tables & indices
      await this.db.execute(`
        -- 1. Entities store: local mirrors of business models
        CREATE TABLE IF NOT EXISTS entities (
          id TEXT PRIMARY KEY,
          entity_type TEXT NOT NULL,
          branch_id TEXT,
          user_id TEXT,
          updated_at TEXT NOT NULL,
          payload TEXT NOT NULL
        );
        CREATE INDEX IF NOT EXISTS idx_entities_type_branch ON entities (entity_type, branch_id);
        CREATE INDEX IF NOT EXISTS idx_entities_updated ON entities (updated_at);

        -- 2. Outbox store: durable append-only queue of mutations waiting to sync
        CREATE TABLE IF NOT EXISTS outbox (
          mutation_id TEXT PRIMARY KEY,
          entity_type TEXT NOT NULL,
          entity_id TEXT NOT NULL,
          action TEXT NOT NULL,
          branch_id TEXT,
          status TEXT NOT NULL,
          created_at TEXT NOT NULL,
          retry_count INTEGER DEFAULT 0,
          payload TEXT NOT NULL
        );
        CREATE INDEX IF NOT EXISTS idx_outbox_status_created ON outbox (status, created_at);
        CREATE INDEX IF NOT EXISTS idx_outbox_branch ON outbox (branch_id);

        -- 3. Conflicts store: quarantined mutation mismatches
        CREATE TABLE IF NOT EXISTS conflicts (
          conflict_id TEXT PRIMARY KEY,
          mutation_id TEXT,
          entity_type TEXT,
          entity_id TEXT,
          branch_id TEXT,
          created_at TEXT NOT NULL,
          payload TEXT NOT NULL
        );

        -- 4. Tombstones store: records deleted locally
        CREATE TABLE IF NOT EXISTS tombstones (
          id TEXT PRIMARY KEY,
          entity_type TEXT NOT NULL,
          branch_id TEXT,
          deleted_at TEXT NOT NULL,
          payload TEXT NOT NULL
        );

        -- 5. Sync State store: metadata, tokens, sync timestamps
        CREATE TABLE IF NOT EXISTS sync_state (
          key TEXT PRIMARY KEY,
          payload TEXT NOT NULL,
          updated_at TEXT NOT NULL
        );

        INSERT INTO schema_migrations (version, applied_at) VALUES (1, datetime('now'));
      `)
    }

    this.migrated = true
  }

  // --- CRUD IMPLEMENTATIONS ---

  async get(storeName, key) {
    const cleanKey = String(key)
    if (this.isFallback || !this.db) {
      const store = SQLITE_FALLBACK_STORES.get(this.dbUri)?.get(storeName)
      const raw = store ? store.get(cleanKey) : null
      return raw ? JSON.parse(JSON.stringify(raw)) : null
    }

    const pkColumn = storeName === 'outbox' ? 'mutation_id' : (storeName === 'conflicts' ? 'conflict_id' : (storeName === 'sync_state' ? 'key' : 'id'))
    const rows = await this.db.select(
      `SELECT payload FROM ${storeName} WHERE ${pkColumn} = $1 LIMIT 1`,
      [cleanKey]
    )

    if (rows && rows.length > 0) {
      return JSON.parse(rows[0].payload)
    }
    return null
  }

  async set(storeName, key, value) {
    const cleanKey = String(key)
    if (this.isFallback || !this.db) {
      const store = SQLITE_FALLBACK_STORES.get(this.dbUri)?.get(storeName)
      if (store) store.set(cleanKey, JSON.parse(JSON.stringify(value)))
      return value
    }

    const payloadStr = JSON.stringify(value)

    if (storeName === 'entities') {
      const entityType = value.entityType || value.entity_type || 'unknown'
      const branchId = value.branch_id || value.branchId || null
      const userId = value.userId || value.user_id || null
      const updatedAt = value.updatedAt || value.updated_at || new Date().toISOString()

      await this.db.execute(`
        INSERT INTO entities (id, entity_type, branch_id, user_id, updated_at, payload)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT(id) DO UPDATE SET
          entity_type = excluded.entity_type,
          branch_id = excluded.branch_id,
          user_id = excluded.user_id,
          updated_at = excluded.updated_at,
          payload = excluded.payload;
      `, [cleanKey, entityType, branchId, userId, updatedAt, payloadStr])

    } else if (storeName === 'outbox') {
      const entityType = value.entityType || 'unknown'
      const entityId = String(value.entityId || '')
      const action = value.action || 'create'
      const branchId = value.branchId || value.branch_id || null
      const status = value.status || 'pending'
      const createdAt = value.createdAt || new Date().toISOString()
      const retryCount = value.retryCount || 0

      await this.db.execute(`
        INSERT INTO outbox (mutation_id, entity_type, entity_id, action, branch_id, status, created_at, retry_count, payload)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT(mutation_id) DO UPDATE SET
          entity_type = excluded.entity_type,
          entity_id = excluded.entity_id,
          action = excluded.action,
          branch_id = excluded.branch_id,
          status = excluded.status,
          created_at = excluded.created_at,
          retry_count = excluded.retry_count,
          payload = excluded.payload;
      `, [cleanKey, entityType, entityId, action, branchId, status, createdAt, retryCount, payloadStr])

    } else if (storeName === 'conflicts') {
      const mutationId = value.mutationId || null
      const entityType = value.entityType || null
      const entityId = value.entityId ? String(value.entityId) : null
      const branchId = value.branchId || null
      const createdAt = value.createdAt || new Date().toISOString()

      await this.db.execute(`
        INSERT INTO conflicts (conflict_id, mutation_id, entity_type, entity_id, branch_id, created_at, payload)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT(conflict_id) DO UPDATE SET
          payload = excluded.payload;
      `, [cleanKey, mutationId, entityType, entityId, branchId, createdAt, payloadStr])

    } else if (storeName === 'tombstones') {
      const entityType = value.entityType || 'unknown'
      const branchId = value.branchId || null
      const deletedAt = value.deletedAt || new Date().toISOString()

      await this.db.execute(`
        INSERT INTO tombstones (id, entity_type, branch_id, deleted_at, payload)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT(id) DO UPDATE SET
          payload = excluded.payload;
      `, [cleanKey, entityType, branchId, deletedAt, payloadStr])

    } else if (storeName === 'sync_state') {
      const updatedAt = new Date().toISOString()

      await this.db.execute(`
        INSERT INTO sync_state (key, payload, updated_at)
        VALUES ($1, $2, $3)
        ON CONFLICT(key) DO UPDATE SET
          payload = excluded.payload,
          updated_at = excluded.updated_at;
      `, [cleanKey, payloadStr, updatedAt])
    }

    return value
  }

  async remove(storeName, key) {
    const cleanKey = String(key)
    if (this.isFallback || !this.db) {
      const store = SQLITE_FALLBACK_STORES.get(this.dbUri)?.get(storeName)
      if (store) store.delete(cleanKey)
      return true
    }

    const pkColumn = storeName === 'outbox' ? 'mutation_id' : (storeName === 'conflicts' ? 'conflict_id' : (storeName === 'sync_state' ? 'key' : 'id'))
    await this.db.execute(`DELETE FROM ${storeName} WHERE ${pkColumn} = $1`, [cleanKey])
    return true
  }

  async list(storeName, filterFn = null) {
    if (this.isFallback || !this.db) {
      const store = SQLITE_FALLBACK_STORES.get(this.dbUri)?.get(storeName)
      if (!store) return []
      const items = Array.from(store.values()).map(v => JSON.parse(JSON.stringify(v)))
      return typeof filterFn === 'function' ? items.filter(filterFn) : items
    }

    const rows = await this.db.select(`SELECT payload FROM ${storeName}`)
    const items = rows.map(r => JSON.parse(r.payload))
    return typeof filterFn === 'function' ? items.filter(filterFn) : items
  }

  async clear(storeName) {
    if (this.isFallback || !this.db) {
      const store = SQLITE_FALLBACK_STORES.get(this.dbUri)?.get(storeName)
      if (store) store.clear()
      return true
    }

    await this.db.execute(`DELETE FROM ${storeName}`)
    return true
  }

  async batchSet(storeName, entries) {
    if (!Array.isArray(entries) || entries.length === 0) return true
    for (const [key, val] of entries) {
      await this.set(storeName, key, val)
    }
    return true
  }

  async batchRemove(storeName, keys) {
    if (!Array.isArray(keys) || keys.length === 0) return true
    for (const key of keys) {
      await this.remove(storeName, key)
    }
    return true
  }
}
