/**
 * AJ ECODRIVE ERP — OFFLINE STORAGE ENGINE
 * 
 * Provides unified transactional access for cached business entities,
 * branch-scoped queries, tombstones, and local persistence.
 */

import { IndexedDBStorageAdapter } from './IndexedDBStorageAdapter.js'

export class OfflineStorageEngine {
  constructor(adapter = null) {
    this.adapter = adapter || new IndexedDBStorageAdapter()
  }

  async init() {
    return this.adapter.init()
  }

  // --- ENTITY OPERATIONS ---

  async saveEntity(entityType, record) {
    if (!record || !record.id) {
      throw new Error(`Cannot save entity of type '${entityType}' without an id.`)
    }

    const item = {
      ...record,
      entityType,
      branchId: record.branch_id || record.branchId || null,
      updatedAt: record.updated_at || record.updatedAt || new Date().toISOString()
    }

    await this.adapter.set('entities', item.id, item)
    return item
  }

  async getEntity(entityType, id) {
    const item = await this.adapter.get('entities', String(id))
    if (!item) return null
    if (item.entityType && item.entityType !== entityType) return null
    return item
  }

  async queryEntities(entityType, { branchId = null, filter = null } = {}) {
    return this.adapter.list('entities', (item) => {
      if (item.entityType !== entityType) return false
      if (branchId) {
        const itemBranch = item.branch_id || item.branchId
        if (itemBranch && itemBranch !== branchId) return false
      }
      if (typeof filter === 'function') {
        return filter(item)
      }
      return true
    })
  }

  async deleteEntity(entityType, id) {
    const cleanId = String(id)
    await this.adapter.remove('entities', cleanId)
    // Record tombstone so sync can inform server
    await this.adapter.set('tombstones', cleanId, {
      id: cleanId,
      entityType,
      deletedAt: new Date().toISOString()
    })
    return true
  }

  async cacheRemoteEntities(entityType, records, branchId = null) {
    if (!Array.isArray(records) || records.length === 0) return []

    const items = records.map(r => ({
      ...r,
      entityType,
      branchId: r.branch_id || r.branchId || branchId || null,
      updatedAt: r.updated_at || r.updatedAt || new Date().toISOString()
    }))

    await this.adapter.batchSet('entities', items)
    return items
  }

  // --- TOMBSTONE OPERATIONS ---

  async getTombstones(entityType = null) {
    return this.adapter.list('tombstones', (item) => {
      if (entityType && item.entityType !== entityType) return false
      return true
    })
  }

  async clearTombstones(ids = []) {
    if (ids.length === 0) return true
    return this.adapter.batchRemove('tombstones', ids)
  }

  // --- SYNC STATE METADATA ---

  async getSyncState(key) {
    const record = await this.adapter.get('sync_state', key)
    return record ? record.value : null
  }

  async setSyncState(key, value) {
    return this.adapter.set('sync_state', key, {
      key,
      value,
      updatedAt: new Date().toISOString()
    })
  }

  // --- WIPE ON SECURE LOGOUT ---

  async clearAllData() {
    await Promise.all([
      this.adapter.clear('entities'),
      this.adapter.clear('outbox'),
      this.adapter.clear('conflicts'),
      this.adapter.clear('sync_state'),
      this.adapter.clear('tombstones')
    ])
    return true
  }
}

// Singleton storage engine instance
export const offlineStorage = new OfflineStorageEngine()
