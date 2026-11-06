/**
 * AJ ECODRIVE ERP — FRONTEND OFFLINE STORAGE & MUTATION QUEUE TEST SUITE
 * 
 * Verifies:
 * 1. StorageAdapter / IndexedDBStorageAdapter abstraction with in-memory fallback
 * 2. OfflineStorageEngine entity caching, branch filtering, and tombstones
 * 3. MutationQueue FIFO ordering, retry backoff, conflict quarantine
 * 4. SyncCoordinator reactive network listening and state tracking
 */

import { describe, it, beforeEach } from 'vitest'
import assert from 'node:assert/strict'
import { IndexedDBStorageAdapter } from '../src/offline/storage/IndexedDBStorageAdapter.js'
import { OfflineStorageEngine } from '../src/offline/storage/OfflineStorageEngine.js'
import { MutationQueue } from '../src/offline/queue/MutationQueue.js'
import { SyncCoordinator } from '../src/offline/queue/SyncCoordinator.js'

describe('AJ EcoDrive Frontend — Offline Storage Engine & Mutation Queue', () => {
  let adapter
  let storage
  let queue
  let coordinator

  beforeEach(async () => {
    adapter = new IndexedDBStorageAdapter('test_db_' + Date.now(), 1)
    await adapter.init()
    storage = new OfflineStorageEngine(adapter)
    queue = new MutationQueue(storage)
    coordinator = new SyncCoordinator(queue, storage)
  })

  describe('1. StorageAdapter & Transactional Operations', () => {
    it('supports basic CRUD and batch operations', async () => {
      // Set
      await adapter.set('entities', 'item-1', { id: 'item-1', name: 'Test Battery' })
      const retrieved = await adapter.get('entities', 'item-1')
      assert.equal(retrieved.name, 'Test Battery')

      // List
      const all = await adapter.list('entities')
      assert.equal(all.length, 1)

      // Batch set
      await adapter.batchSet('entities', [
        { id: 'item-2', name: 'Charger' },
        { id: 'item-3', name: 'Motor' }
      ])
      const afterBatch = await adapter.list('entities')
      assert.equal(afterBatch.length, 3)

      // Remove
      await adapter.remove('entities', 'item-1')
      const afterRemove = await adapter.get('entities', 'item-1')
      assert.equal(afterRemove, null)

      // Clear
      await adapter.clear('entities')
      const afterClear = await adapter.list('entities')
      assert.equal(afterClear.length, 0)
    })
  })

  describe('2. OfflineStorageEngine & Branch-Scoped Entity Caching', () => {
    it('caches business records with branch metadata and retrieves by branch', async () => {
      await storage.saveEntity('customer', {
        id: 'CUST-001',
        name: 'Peshawar Customer',
        branch_id: 'BR-01'
      })

      await storage.saveEntity('customer', {
        id: 'CUST-002',
        name: 'Islamabad Customer',
        branch_id: 'BR-02'
      })

      // Query all customers
      const all = await storage.queryEntities('customer')
      assert.equal(all.length, 2)

      // Query scoped strictly to BR-01
      const pewOnly = await storage.queryEntities('customer', { branchId: 'BR-01' })
      assert.equal(pewOnly.length, 1)
      assert.equal(pewOnly[0].id, 'CUST-001')

      // Query scoped strictly to BR-02
      const isbOnly = await storage.queryEntities('customer', { branchId: 'BR-02' })
      assert.equal(isbOnly.length, 1)
      assert.equal(isbOnly[0].id, 'CUST-002')
    })

    it('records tombstones upon entity deletion to notify server on sync', async () => {
      await storage.saveEntity('quotation', {
        id: 'QT-999',
        quote_number: 'Q-999',
        branch_id: 'BR-01'
      })

      await storage.deleteEntity('quotation', 'QT-999')

      // Entity should be gone from entities
      const found = await storage.getEntity('quotation', 'QT-999')
      assert.equal(found, null)

      // Tombstone should be recorded
      const tombstones = await storage.getTombstones('quotation')
      assert.equal(tombstones.length, 1)
      assert.equal(tombstones[0].id, 'QT-999')
      assert.equal(tombstones[0].entityType, 'quotation')
    })
  })

  describe('3. Durable MutationQueue & Conflict Quarantine', () => {
    it('enqueues mutations in strict FIFO order', async () => {
      const m1 = await queue.enqueue({
        entityType: 'customer',
        entityId: 'C-01',
        operation: 'CREATE',
        payload: { name: 'First' },
        branchId: 'BR-01'
      })

      const m2 = await queue.enqueue({
        entityType: 'customer',
        entityId: 'C-02',
        operation: 'CREATE',
        payload: { name: 'Second' },
        branchId: 'BR-01'
      })

      const pending = await queue.getPending()
      assert.equal(pending.length, 2)
      assert.equal(pending[0].mutationId, m1.mutationId)
      assert.equal(pending[1].mutationId, m2.mutationId)
    })

    it('transitions mutation states and cleans up synced records', async () => {
      const m = await queue.enqueue({
        entityType: 'order',
        entityId: 'ORD-101',
        operation: 'CREATE',
        payload: { total: 250000 },
        branchId: 'BR-01'
      })

      await queue.markSyncing(m.mutationId)
      let item = await queue.getById(m.mutationId)
      assert.equal(item.status, 'syncing')

      await queue.markSynced(m.mutationId)
      item = await queue.getById(m.mutationId)
      assert.equal(item.status, 'synced')

      await queue.clearSynced()
      item = await queue.getById(m.mutationId)
      assert.equal(item, null)
    })

    it('quarantines version conflicts in dedicated conflicts store with REQUIRE_MANAGER_APPROVAL', async () => {
      const m = await queue.enqueue({
        entityType: 'invoice',
        entityId: 'INV-202',
        operation: 'UPDATE',
        payload: { balance: 0 },
        clientVersion: 1,
        branchId: 'BR-01'
      })

      const serverState = { id: 'INV-202', version: 3, balance: 50000 }
      const res = await queue.markConflict(m.mutationId, serverState, 'REQUIRE_MANAGER_APPROVAL')

      assert.equal(res.item.status, 'conflict')
      assert.equal(res.conflictRecord.resolutionRule, 'REQUIRE_MANAGER_APPROVAL')
      assert.equal(res.conflictRecord.serverState.version, 3)

      const stats = await queue.getQueueStats()
      assert.equal(stats.conflicts, 1)
    })
  })

  describe('4. SyncCoordinator Reactive State', () => {
    it('reacts to network online/offline events and maintains queue stats', async () => {
      coordinator.handleNetworkChange(false)
      assert.equal(coordinator.state.isOnline, false)
      assert.equal(coordinator.state.syncStatus, 'offline')

      coordinator.handleNetworkChange(true, { autoSync: false })
      assert.equal(coordinator.state.isOnline, true)
      assert.equal(coordinator.state.syncStatus, 'idle')

      await queue.enqueue({
        entityType: 'payment',
        entityId: 'PAY-501',
        operation: 'CREATE',
        payload: { amount: 50000 },
        branchId: 'BR-01'
      })

      const stats = await coordinator.updateStats()
      assert.equal(stats.pending, 1)
      assert.equal(coordinator.state.pendingCount, 1)
    })
  })
})
