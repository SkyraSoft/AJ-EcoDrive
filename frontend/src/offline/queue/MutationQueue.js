/**
 * AJ ECODRIVE ERP — DURABLE MUTATION QUEUE
 * 
 * Manages the client-side outbox queue in IndexedDB.
 * Ensures mutations survive page reloads, tab closes, and network outages.
 * Enforces FIFO processing order, idempotency keys, and conflict tracking.
 */

import { offlineStorage } from '../storage/OfflineStorageEngine.js'

function generateUUID() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return 'mut_' + Date.now() + '_' + Math.random().toString(36).substring(2, 10)
}

function sanitizePayload(obj) {
  if (!obj || typeof obj !== 'object') return {}
  const clean = {}
  for (const [k, v] of Object.entries(obj)) {
    // Exclude transient properties, closures, and internal store flags
    if (k.startsWith('_') || typeof v === 'function' || typeof v === 'symbol') continue
    clean[k] = v
  }
  return JSON.parse(JSON.stringify(clean))
}

export class MutationQueue {
  constructor(storage = offlineStorage) {
    this.storage = storage
  }

  async enqueue({
    entityType,
    entityId,
    operation,
    payload = {},
    clientVersion = 1,
    branchId = null,
    userId = null,
    userRole = null,
    idempotencyKey = null
  }) {
    if (!entityType || !operation || !entityId) {
      throw new Error('Mutation requires entityType, operation, and entityId.')
    }

    const mutationId = generateUUID()
    const finalIdempotencyKey = idempotencyKey || `${entityType}:${operation}:${entityId}:${Date.now()}`

    const mutation = {
      mutationId,
      idempotencyKey: finalIdempotencyKey,
      entityType,
      entityId: String(entityId),
      operation: operation.toUpperCase(),
      payload: sanitizePayload(payload),
      clientVersion: Number(clientVersion) || 1,
      branchId: branchId || null,
      userId: userId || null,
      userRole: userRole || null,
      status: 'pending', // 'pending' | 'syncing' | 'synced' | 'failed' | 'conflict' | 'rejected'
      retryCount: 0,
      lastError: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    await this.storage.adapter.set('outbox', mutationId, mutation)
    return mutation
  }

  async getPending({ branchId = null, userRole = null } = {}) {
    const list = await this.storage.adapter.list('outbox', (m) => {
      if (m.status !== 'pending') return false
      if (userRole && userRole !== 'Super Admin' && branchId) {
        if (m.branchId && m.branchId !== branchId) return false
      }
      return true
    })
    // Return in strict FIFO chronological order
    return list.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
  }

  async getAll() {
    return this.storage.adapter.list('outbox')
  }

  async getById(mutationId) {
    return this.storage.adapter.get('outbox', mutationId)
  }

  async markSyncing(mutationId) {
    const item = await this.getById(mutationId)
    if (!item) return null
    item.status = 'syncing'
    item.updatedAt = new Date().toISOString()
    await this.storage.adapter.set('outbox', mutationId, item)
    return item
  }

  async markSynced(mutationId) {
    const item = await this.getById(mutationId)
    if (!item) return null
    item.status = 'synced'
    item.updatedAt = new Date().toISOString()
    await this.storage.adapter.set('outbox', mutationId, item)
    return item
  }

  async markFailed(mutationId, error) {
    const item = await this.getById(mutationId)
    if (!item) return null
    item.retryCount = (item.retryCount || 0) + 1
    item.lastError = typeof error === 'string' ? error : (error?.message || 'Network sync error')
    // Allow up to 5 retries before marking as permanently failed
    if (item.retryCount < 5) {
      item.status = 'pending'
    } else {
      item.status = 'failed'
    }
    item.updatedAt = new Date().toISOString()
    await this.storage.adapter.set('outbox', mutationId, item)
    return item
  }

  async markConflict(mutationId, serverState = null, resolutionRule = 'REQUIRE_MANAGER_APPROVAL') {
    const item = await this.getById(mutationId)
    if (!item) return null
    item.status = 'conflict'
    item.updatedAt = new Date().toISOString()
    await this.storage.adapter.set('outbox', mutationId, item)

    // Store in dedicated conflicts store
    const conflictId = 'cnf_' + mutationId
    const conflictRecord = {
      conflictId,
      mutationId,
      entityType: item.entityType,
      entityId: item.entityId,
      clientPayload: item.payload,
      serverState,
      resolutionRule,
      resolved: false,
      createdAt: new Date().toISOString()
    }
    await this.storage.adapter.set('conflicts', conflictId, conflictRecord)
    return { item, conflictRecord }
  }

  async markRejected(mutationId, reason) {
    const item = await this.getById(mutationId)
    if (!item) return null
    item.status = 'rejected'
    item.lastError = reason
    item.updatedAt = new Date().toISOString()
    await this.storage.adapter.set('outbox', mutationId, item)
    return item
  }

  async removeMutation(mutationId) {
    return this.storage.adapter.remove('outbox', mutationId)
  }

  async clearSynced() {
    const synced = await this.storage.adapter.list('outbox', m => m.status === 'synced')
    const keys = synced.map(s => s.mutationId)
    return this.storage.adapter.batchRemove('outbox', keys)
  }

  async clearAll() {
    return this.storage.adapter.clear('outbox')
  }

  async getQueueStats() {
    const all = await this.getAll()
    const stats = {
      total: all.length,
      pending: 0,
      syncing: 0,
      synced: 0,
      conflicts: 0,
      failed: 0,
      rejected: 0
    }
    for (const m of all) {
      if (m.status === 'pending') stats.pending++
      else if (m.status === 'syncing') stats.syncing++
      else if (m.status === 'synced') stats.synced++
      else if (m.status === 'conflict') stats.conflicts++
      else if (m.status === 'failed') stats.failed++
      else if (m.status === 'rejected') stats.rejected++
    }
    return stats
  }
}

export const mutationQueue = new MutationQueue()
