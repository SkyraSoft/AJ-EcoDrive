/**
 * AJ ECODRIVE ERP — INDEXEDDB STORAGE ADAPTER
 * 
 * Production IndexedDB storage engine for Web SPA.
 * Supports asynchronous transactional CRUD, compound indices,
 * branch isolation, and resilient in-memory fallback for test harnesses.
 */

import { StorageAdapter } from './StorageAdapter.js'

const DB_NAME = 'ecodrive_offline_db'
const DB_VERSION = 2

// Shared in-memory fallback store by database name to simulate cross-instance persistence in tests
const SHARED_MEMORY_DATABASES = new Map()

export class IndexedDBStorageAdapter extends StorageAdapter {
  constructor(dbName = DB_NAME, version = DB_VERSION) {
    super()
    this.dbName = dbName
    this.version = version
    this.db = null
    this.isFallback = false

    if (!SHARED_MEMORY_DATABASES.has(dbName)) {
      SHARED_MEMORY_DATABASES.set(dbName, new Map())
    }
  }

  async init() {
    if (this.db) return this.db

    const idb = typeof window !== 'undefined' ? (window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB) : null

    if (!idb) {
      // In-memory fallback for Node environments or headless tests
      this.isFallback = true
      return null
    }

    return new Promise((resolve, reject) => {
      const request = idb.open(this.dbName, this.version)

      request.onupgradeneeded = (event) => {
        const db = event.target.result

        // 1. Entities store: Local mirrors of server business records
        let entityStore
        if (!db.objectStoreNames.contains('entities')) {
          entityStore = db.createObjectStore('entities', { keyPath: 'id' })
        } else {
          entityStore = request.transaction.objectStore('entities')
        }
        if (!entityStore.indexNames.contains('by_entity_type')) entityStore.createIndex('by_entity_type', 'entityType', { unique: false })
        if (!entityStore.indexNames.contains('by_branch')) entityStore.createIndex('by_branch', 'branchId', { unique: false })
        if (!entityStore.indexNames.contains('by_type_branch')) entityStore.createIndex('by_type_branch', ['entityType', 'branchId'], { unique: false })
        if (!entityStore.indexNames.contains('by_user')) entityStore.createIndex('by_user', 'userId', { unique: false })
        if (!entityStore.indexNames.contains('by_updated')) entityStore.createIndex('by_updated', 'updatedAt', { unique: false })

        // 2. Outbox store: Durable append-only queue of mutations waiting to sync
        let outboxStore
        if (!db.objectStoreNames.contains('outbox')) {
          outboxStore = db.createObjectStore('outbox', { keyPath: 'mutationId' })
        } else {
          outboxStore = request.transaction.objectStore('outbox')
        }
        if (!outboxStore.indexNames.contains('by_status')) outboxStore.createIndex('by_status', 'status', { unique: false })
        if (!outboxStore.indexNames.contains('by_created')) outboxStore.createIndex('by_created', 'createdAt', { unique: false })
        if (!outboxStore.indexNames.contains('by_entity_type')) outboxStore.createIndex('by_entity_type', 'entityType', { unique: false })
        if (!outboxStore.indexNames.contains('by_branch')) outboxStore.createIndex('by_branch', 'branchId', { unique: false })

        // 3. Conflicts store: Records requiring managerial resolution
        let conflictStore
        if (!db.objectStoreNames.contains('conflicts')) {
          conflictStore = db.createObjectStore('conflicts', { keyPath: 'conflictId' })
        } else {
          conflictStore = request.transaction.objectStore('conflicts')
        }
        if (!conflictStore.indexNames.contains('by_mutation')) conflictStore.createIndex('by_mutation', 'mutationId', { unique: false })
        if (!conflictStore.indexNames.contains('by_entity')) conflictStore.createIndex('by_entity', 'entityType', { unique: false })
        if (!conflictStore.indexNames.contains('by_created')) conflictStore.createIndex('by_created', 'createdAt', { unique: false })

        // 4. Sync State store: Metadata like lastSyncTimestamp, branchVersion
        if (!db.objectStoreNames.contains('sync_state')) {
          db.createObjectStore('sync_state', { keyPath: 'key' })
        }

        // 5. Tombstones store: Locally deleted records to notify server during sync
        let tombstoneStore
        if (!db.objectStoreNames.contains('tombstones')) {
          tombstoneStore = db.createObjectStore('tombstones', { keyPath: 'id' })
        } else {
          tombstoneStore = request.transaction.objectStore('tombstones')
        }
        if (!tombstoneStore.indexNames.contains('by_entity_type')) tombstoneStore.createIndex('by_entity_type', 'entityType', { unique: false })
        if (!tombstoneStore.indexNames.contains('by_deleted')) tombstoneStore.createIndex('by_deleted', 'deletedAt', { unique: false })
      }

      request.onsuccess = (event) => {
        this.db = event.target.result
        resolve(this.db)
      }

      request.onerror = (event) => {
        console.warn('[IndexedDBStorageAdapter] IndexedDB open error, falling back to in-memory:', event.target.error)
        this.isFallback = true
        resolve(null)
      }
    })
  }

  _getMemoryStore(storeName) {
    const dbMap = SHARED_MEMORY_DATABASES.get(this.dbName)
    if (!dbMap.has(storeName)) {
      dbMap.set(storeName, new Map())
    }
    return dbMap.get(storeName)
  }

  async get(storeName, key) {
    await this.init()
    if (this.isFallback) {
      const val = this._getMemoryStore(storeName).get(String(key))
      return val ? JSON.parse(JSON.stringify(val)) : null
    }

    return new Promise((resolve, reject) => {
      const tx = this.db.transaction([storeName], 'readonly')
      const store = tx.objectStore(storeName)
      const req = store.get(key)
      req.onsuccess = () => resolve(req.result ? JSON.parse(JSON.stringify(req.result)) : null)
      req.onerror = () => reject(req.error)
    })
  }

  async set(storeName, key, value) {
    await this.init()
    // Safe deep copy to eliminate functions or non-serializables
    const record = JSON.parse(JSON.stringify(value))

    // Ensure primary key attribute exists on the object
    if (storeName === 'entities' || storeName === 'tombstones') {
      record.id = record.id || key
    } else if (storeName === 'outbox') {
      record.mutationId = record.mutationId || key
    } else if (storeName === 'conflicts') {
      record.conflictId = record.conflictId || key
    } else if (storeName === 'sync_state') {
      record.key = record.key || key
    }

    if (this.isFallback) {
      this._getMemoryStore(storeName).set(String(key), record)
      return record
    }

    return new Promise((resolve, reject) => {
      const tx = this.db.transaction([storeName], 'readwrite')
      const store = tx.objectStore(storeName)
      const req = store.put(record)
      req.onsuccess = () => resolve(record)
      req.onerror = () => reject(req.error)
    })
  }

  async remove(storeName, key) {
    await this.init()
    if (this.isFallback) {
      this._getMemoryStore(storeName).delete(String(key))
      return true
    }

    return new Promise((resolve, reject) => {
      const tx = this.db.transaction([storeName], 'readwrite')
      const store = tx.objectStore(storeName)
      const req = store.delete(key)
      req.onsuccess = () => resolve(true)
      req.onerror = () => reject(req.error)
    })
  }

  async list(storeName, filterFn = null) {
    await this.init()
    if (this.isFallback) {
      const all = Array.from(this._getMemoryStore(storeName).values()).map(v => JSON.parse(JSON.stringify(v)))
      return filterFn ? all.filter(filterFn) : all
    }

    return new Promise((resolve, reject) => {
      const tx = this.db.transaction([storeName], 'readonly')
      const store = tx.objectStore(storeName)
      const req = store.getAll()
      req.onsuccess = () => {
        const results = (req.result || []).map(v => JSON.parse(JSON.stringify(v)))
        resolve(filterFn ? results.filter(filterFn) : results)
      }
      req.onerror = () => reject(req.error)
    })
  }

  async clear(storeName) {
    await this.init()
    if (this.isFallback) {
      this._getMemoryStore(storeName).clear()
      return true
    }

    return new Promise((resolve, reject) => {
      const tx = this.db.transaction([storeName], 'readwrite')
      const store = tx.objectStore(storeName)
      const req = store.clear()
      req.onsuccess = () => resolve(true)
      req.onerror = () => reject(req.error)
    })
  }

  async batchSet(storeName, items) {
    if (!Array.isArray(items) || items.length === 0) return []
    await this.init()

    const sanitized = JSON.parse(JSON.stringify(items))

    if (this.isFallback) {
      const memStore = this._getMemoryStore(storeName)
      for (const item of sanitized) {
        const key = item.id || item.mutationId || item.conflictId || item.key
        memStore.set(String(key), item)
      }
      return sanitized
    }

    return new Promise((resolve, reject) => {
      const tx = this.db.transaction([storeName], 'readwrite')
      const store = tx.objectStore(storeName)
      for (const item of sanitized) {
        store.put(item)
      }
      tx.oncomplete = () => resolve(sanitized)
      tx.onerror = () => reject(tx.error)
    })
  }

  async batchRemove(storeName, keys) {
    if (!Array.isArray(keys) || keys.length === 0) return true
    await this.init()

    if (this.isFallback) {
      const memStore = this._getMemoryStore(storeName)
      for (const key of keys) {
        memStore.delete(String(key))
      }
      return true
    }

    return new Promise((resolve, reject) => {
      const tx = this.db.transaction([storeName], 'readwrite')
      const store = tx.objectStore(storeName)
      for (const key of keys) {
        store.delete(key)
      }
      tx.oncomplete = () => resolve(true)
      tx.onerror = () => reject(tx.error)
    })
  }
}
