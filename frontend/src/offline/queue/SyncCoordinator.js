/**
 * AJ ECODRIVE ERP — SYNCHRONIZATION COORDINATOR
 * 
 * Orchestrates two-way synchronization between client IndexedDB and production backend.
 * Features:
 * - Reactive network listener (online/offline)
 * - Safe batched push of durable mutations
 * - Incremental delta pull by timestamp and branch
 * - Reconciles pulled changes into Vue store collections
 * - Conflict detection and quarantine
 * - Periodic background sync cadence
 */

import { reactive } from 'vue'
import { api } from '../../services/api.js'
import { offlineStorage } from '../storage/OfflineStorageEngine.js'
import { mutationQueue } from './MutationQueue.js'

export class SyncCoordinator {
  constructor(queue = mutationQueue, storage = offlineStorage) {
    this.queue = queue
    this.storage = storage

    // Reactive state exposed to Vue components
    this.state = reactive({
      isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
      syncStatus: 'idle', // 'idle' | 'syncing' | 'offline' | 'error'
      pendingCount: 0,
      conflictCount: 0,
      lastSyncTime: null,
      lastError: null
    })

    this.timer = null
    this.isSyncing = false
    this.onSyncCompleteCallbacks = new Set()
    this.pullReconciler = null
  }

  async init() {
    await this.storage.init()
    const lastSync = await this.storage.getSyncState('last_sync_timestamp')
    if (lastSync) {
      this.state.lastSyncTime = lastSync
    }
    await this.updateStats()

    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => this.handleNetworkChange(true))
      window.addEventListener('offline', () => this.handleNetworkChange(false))
    }
  }

  setPullReconciler(fn) {
    this.pullReconciler = fn
  }

  handleNetworkChange(isOnline, { autoSync = true } = {}) {
    this.state.isOnline = isOnline
    if (!isOnline) {
      this.state.syncStatus = 'offline'
    } else {
      this.state.syncStatus = 'idle'
      // Auto-trigger sync upon reconnecting if requested
      if (autoSync) {
        this.syncNow().catch(err => {
          console.warn('[SyncCoordinator] Reconnection sync error:', err?.message || err)
        })
      }
    }
  }

  startAutoSync(intervalMs = 30000) {
    this.stopAutoSync()
    this.timer = setInterval(() => {
      if (this.state.isOnline && !this.isSyncing) {
        this.syncNow().catch(e => console.warn('[SyncCoordinator] Background sync error:', e?.message || e))
      }
    }, intervalMs)
  }

  stopAutoSync() {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
  }

  onSyncComplete(cb) {
    this.onSyncCompleteCallbacks.add(cb)
    return () => this.onSyncCompleteCallbacks.delete(cb)
  }

  async updateStats() {
    const stats = await this.queue.getQueueStats()
    this.state.pendingCount = stats.pending + stats.syncing
    this.state.conflictCount = stats.conflicts
    return stats
  }

  async syncNow() {
    if (this.isSyncing) return
    if (!this.state.isOnline) {
      this.state.syncStatus = 'offline'
      return
    }

    this.isSyncing = true
    this.state.syncStatus = 'syncing'
    this.state.lastError = null

    try {
      // 1. PUSH local pending mutations to server
      await this._pushMutations()

      // 2. PULL remote changes from server
      try {
        await this._pullChanges()
      } catch (pullErr) {
        console.warn('[SyncCoordinator] Pull changes error:', pullErr?.message || pullErr)
      }

      // 3. Mark success
      this.state.syncStatus = 'idle'
      const now = new Date().toISOString()
      this.state.lastSyncTime = now
      await this.storage.setSyncState('last_sync_timestamp', now)

      // Notify store and UI listeners
      for (const cb of this.onSyncCompleteCallbacks) {
        try { cb() } catch (err) { console.error('[SyncCoordinator] callback error:', err) }
      }
    } catch (err) {
      this.state.syncStatus = 'error'
      this.state.lastError = err?.message || 'Sync failed'
      console.warn('[SyncCoordinator] Sync process error:', err)
    } finally {
      this.isSyncing = false
      await this.updateStats()
    }
  }

  async _pushMutations() {
    const pending = await this.queue.getPending()
    if (pending.length === 0) return

    // Take batch of up to 25 mutations to avoid request bloat
    const batch = pending.slice(0, 25)

    // Mark items as syncing
    for (const m of batch) {
      await this.queue.markSyncing(m.mutationId)
    }

    try {
      const response = await api.post('/sync/push', { mutations: batch })
      const results = response?.data?.results || response?.results || []

      for (const res of results) {
        const { mutationId, status, serverState, resolutionRule, error } = res
        const m = batch.find(item => item.mutationId === mutationId)
        if (status === 'synced') {
          await this.queue.markSynced(mutationId)
          if (m && m.entityType && m.entityId) {
            // Update entity in storage
            const entity = await this.storage.getEntity(m.entityType, m.entityId)
            if (entity) {
              entity._syncStatus = 'synced'
              entity._isLocalOnly = false
              if (serverState?.version) entity.version = serverState.version
              await this.storage.saveEntity(m.entityType, entity)
            }
            // Update entity in store if available
            const s = (typeof globalThis !== 'undefined' && globalThis.store) ? globalThis.store : null
            if (s && typeof s.findRecord === 'function') {
              const rec = s.findRecord(m.entityType, m.entityId)
              if (rec) {
                rec._syncStatus = 'synced'
                rec._isLocalOnly = false
                if (serverState?.version) rec.version = serverState.version
              }
            }
          }
        } else if (status === 'conflict') {
          await this.queue.markConflict(mutationId, serverState, resolutionRule)
        } else if (status === 'rejected') {
          await this.queue.markRejected(mutationId, error)
        } else {
          await this.queue.markFailed(mutationId, error || 'Unknown server response')
        }
      }

      // Cleanup synced items from outbox store
      await this.queue.clearSynced()
    } catch (err) {
      // Network failure: revert batch back to pending for retry
      for (const m of batch) {
        await this.queue.markFailed(m.mutationId, err?.message || 'Push transmission failed')
      }
      throw err
    }
  }

  async _pullChanges() {
    const since = this.state.lastSyncTime || ''
    const url = since ? `/sync/pull?since=${encodeURIComponent(since)}` : '/sync/pull'
    
    const response = await api.get(url)
    const payload = response?.data || response || {}
    const { entities = {}, tombstones = [] } = payload

    // 1. Process received entity collections into IndexedDB
    for (const [entityType, items] of Object.entries(entities)) {
      if (Array.isArray(items) && items.length > 0) {
        await this.storage.cacheRemoteEntities(entityType, items)
      }
    }

    // 2. Process remote tombstones (records deleted on server)
    for (const tombstone of tombstones) {
      if (tombstone.entityType && tombstone.id) {
        await this.storage.deleteEntity(tombstone.entityType, tombstone.id)
      }
    }

    // 3. Reconcile pulled changes into in-memory Vue store arrays
    if (typeof this.pullReconciler === 'function') {
      try {
        await this.pullReconciler(entities, tombstones)
      } catch (recErr) {
        console.warn('[SyncCoordinator] Pull reconciler error:', recErr)
      }
    }
  }
}

export const syncCoordinator = new SyncCoordinator()
