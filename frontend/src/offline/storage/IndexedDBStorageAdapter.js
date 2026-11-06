/**
 * AJ ECODRIVE ERP — INDEXEDDB STORAGE ADAPTER
 * 
 * Production IndexedDB storage engine for Web SPA.
 * Supports asynchronous transactional CRUD, compound indices,
 * and resilient in-memory fallback for test harnesses.
 */

import { StorageAdapter } from './StorageAdapter.js'

const DB_NAME = 'ecodrive_offline_db'
const DB_VERSION = 1

export class IndexedDBStorageAdapter extends StorageAdapter {
  constructor(dbName = DB_NAME, version = DB_VERSION) {
    super()
    this.dbName = dbName
    this.version = version
    this.db = null
    this.isFallback = false
    this.fallbackStore = new Map() // storeName -> Map(key, value)
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
        if (!db.objectStoreNames.contains('entities')) {
          const entityStore = db.createObjectStore('entities', { keyPath: 'id' })
          entityStore.createIndex('by_entity_type', 'entityType', { unique: false })
          entityStore.createIndex('by_branch', 'branchId', { unique: false })
          entityStore.createIndex('by_type_branch', ['entityType', 'branchId'], { unique: false })
          entityStore.createIndex('by_updated', 'updatedAt', { unique: false })
        }

        // 2. Outbox store: Durable append-only queue of mutations waiting to sync
        if (!db.objectStoreNames.contains('outbox')) {
          const outboxStore = db.createObjectStore('outbox', { keyPath: 'mutationId' })
          outboxStore.createIndex('by_status', 'status', { unique: false })
          outboxStore.createIndex('by_created', 'createdAt', { unique: false })
          outboxStore.createIndex('by_entity_type', 'entityType', { unique: false })
        }

        // 3. Conflicts store: Records requiring managerial resolution
        if (!db.objectStoreNames.contains('conflicts')) {
          const conflictStore = db.createObjectStore('conflicts', { keyPath: 'conflictId' })
          conflictStore.createIndex('by_mutation', 'mutationId', { unique: false })
          conflictStore.createIndex('by_entity', 'entityType', { unique: false })
          conflictStore.createIndex('by_created', 'createdAt', { unique: false })
        }

        // 4. Sync State store: Metadata like lastSyncTimestamp, branchVersion
        if (!db.objectStoreNames.contains('sync_state')) {
          db.createObjectStore('sync_state', { keyPath: 'key' })
        }

        // 5. Tombstones store: Locally deleted records to notify server during sync
        if (!db.objectStoreNames.contains('tombstones')) {
          const tombstoneStore = db.createObjectStore('tombstones', { keyPath: 'id' })
          tombstoneStore.createIndex('by_entity_type', 'entityType', { unique: false })
          tombstoneStore.createIndex('by_deleted', 'deletedAt', { unique: false })
        }
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
    if (!this.fallbackStore.has(storeName)) {
      this.fallbackStore.set(storeName, new Map())
    }
    return this.fallbackStore.get(storeName)
  }

  async get(storeName, key) {
    await this.init()
    if (this.isFallback) {
      return this._getMemoryStore(storeName).get(String(key)) || null
    }

    return new Promise((resolve, reject) => {
      const tx = this.db.transaction([storeName], 'readonly')
      const store = tx.objectStore(storeName)
      const req = store.get(key)
      req.onsuccess = () => resolve(req.result || null)
      req.onerror = () => reject(req.error)
    })
  }

  async set(storeName, key, value) {
    await this.init()
    const record = { ...value }
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
      const all = Array.from(this._getMemoryStore(storeName).values())
      return filterFn ? all.filter(filterFn) : all
    }

    return new Promise((resolve, reject) => {
      const tx = this.db.transaction([storeName], 'readonly')
      const store = tx.objectStore(storeName)
      const req = store.getAll()
      req.onsuccess = () => {
        const results = req.result || []
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

    if (this.isFallback) {
      const memStore = this._getMemoryStore(storeName)
      for (const item of items) {
        const key = item.id || item.mutationId || item.conflictId || item.key
        memStore.set(String(key), { ...item })
      }
      return items
    }

    return new Promise((resolve, reject) => {
      const tx = this.db.transaction([storeName], 'readwrite')
      const store = tx.objectStore(storeName)
      for (const item of items) {
        store.put(item)
      }
      tx.oncomplete = () => resolve(items)
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
