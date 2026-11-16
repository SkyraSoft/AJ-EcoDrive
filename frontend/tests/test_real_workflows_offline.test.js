/**
 * AJ ECODRIVE ERP — REAL WORKFLOW OFFLINE & SYNCHRONIZATION INTEGRATION TEST SUITE
 * 
 * Verifies:
 * 1. Real store methods (addCustomer, addQuotation, addOrder, addInvoice, addExpense, reserveUnit, updateRepairJob)
 * 2. Vue reactive state changes
 * 3. IndexedDB entity storage and Multi-Tenant Branch isolation
 * 4. Durable MutationQueue outbox entries (no closures, pure JSON)
 * 5. State survival across new storage engine instances (page refresh / app restart)
 * 6. Reconnect sync and queue drain upon server acknowledgement
 * 7. Server rejection preservation and 409 conflict quarantine
 * 8. Deletion with durable tombstones
 * 9. Secure logout with pending changes and partition wipe
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { store, offlineStorage, mutationQueue, syncCoordinator, api } from '../src/store.js'
import { IndexedDBStorageAdapter } from '../src/offline/storage/IndexedDBStorageAdapter.js'
import { OfflineStorageEngine } from '../src/offline/storage/OfflineStorageEngine.js'
import { MutationQueue } from '../src/offline/queue/MutationQueue.js'

describe('AJ EcoDrive — Phase 6 Real Workflow Offline Integration Suite', () => {
  beforeEach(async () => {
    // 1. Wipe offline storage partitions
    await offlineStorage.clearAllData()
    await mutationQueue.clearAll()
    store.syncOutbox = []

    // 2. Configure active Peshawar Branch Manager session
    store.setSession({
      id: 'USR-BM-PEW',
      name: 'Ahsan Khan (Peshawar)',
      role: 'Branch Manager',
      branchCode: 'PEW-01',
      branch_id: 'BR-01',
      isSuperAdmin: false
    })

    // 3. Reset network state to offline
    syncCoordinator.handleNetworkChange(false, { autoSync: false })
  })

  afterEach(() => {
    vi.restoreAllMocks()
    syncCoordinator.handleNetworkChange(true, { autoSync: false })
  })

  describe('1. Real Business Workflow Creation While Offline', () => {
    it('customer create offline: updates Vue state, persists to IndexedDB, and enqueues durable mutation', async () => {
      const apiSpy = vi.spyOn(api.customers, 'create')

      const cust = store.addCustomer({
        id: 'CUST-OFFLINE-001',
        name: 'Kamran Akmal',
        phone: '+92 300 7766554',
        city: 'Peshawar',
        branch_id: 'BR-01'
      })

      await cust._syncPromise

      // 1. Vue state changed
      expect(store.customers.some(c => c.id === 'CUST-OFFLINE-001')).toBe(true)
      expect(cust._syncStatus).toBe('offline_local')
      expect(cust._isLocalOnly).toBe(true)

      // 2. IndexedDB entity exists
      const entity = await offlineStorage.getEntity('customer', 'CUST-OFFLINE-001')
      expect(entity).toBeDefined()
      expect(entity.name).toBe('Kamran Akmal')
      expect(entity.branch_id).toBe('BR-01')
      expect(entity._syncStatus).toBe('offline_local')

      // 3. IndexedDB outbox entry exists
      const pending = await mutationQueue.getPending()
      const mut = pending.find(m => m.entityId === 'CUST-OFFLINE-001')
      expect(mut).toBeDefined()
      expect(mut.entityType).toBe('customer')
      expect(mut.operation).toBe('CREATE')
      expect(mut.payload.name).toBe('Kamran Akmal')
      expect(mut.branchId).toBe('BR-01')
      expect(mut.status).toBe('pending')
      expect(typeof mut.payload).toBe('object')
      expect(mut.payload.retryFn).toBeUndefined() // No serialized closures

      // 4. Honest offline toast
      expect(store.activeToast?.message).toContain('waiting for synchronization')
      expect(store.activeToast?.message).not.toContain('Data saved successfully')
    })

    it('quotation create offline: creates local record and durable outbox item', async () => {
      const quote = store.addQuotation({
        id: 'QT-OFFLINE-001',
        quote_id: 'QT-OFFLINE-001',
        customer: 'Tariq Mehmood',
        total: 320000,
        branch_id: 'BR-01'
      })

      await quote._syncPromise

      // Vue state
      expect(store.quotations.some(q => q.id === 'QT-OFFLINE-001')).toBe(true)
      expect(quote._syncStatus).toBe('offline_local')

      // IndexedDB entity
      const entity = await offlineStorage.getEntity('quotation', 'QT-OFFLINE-001')
      expect(entity).toBeDefined()
      expect(entity.customer).toBe('Tariq Mehmood')

      // MutationQueue
      const pending = await mutationQueue.getPending()
      expect(pending.some(m => m.entityType === 'quotation' && m.entityId === 'QT-OFFLINE-001')).toBe(true)
    })

    it('order create offline: creates local order and durable outbox item', async () => {
      const order = store.addOrder({
        id: 'ORD-OFFLINE-001',
        order_id: 'ORD-OFFLINE-001',
        customer: 'Tariq Mehmood',
        total: 'PKR 320,000',
        unit: 'VIN-TEST-001',
        branch_id: 'BR-01'
      })

      await order._syncPromise

      expect(store.orders.some(o => o.id === 'ORD-OFFLINE-001')).toBe(true)
      expect(order._syncStatus).toBe('offline_local')

      const entity = await offlineStorage.getEntity('order', 'ORD-OFFLINE-001')
      expect(entity).toBeDefined()

      const pending = await mutationQueue.getPending()
      expect(pending.some(m => m.entityType === 'order' && m.entityId === 'ORD-OFFLINE-001')).toBe(true)
    })

    it('invoice create offline: creates local invoice and durable outbox item', async () => {
      const inv = store.addInvoice({
        id: 'INV-OFFLINE-001',
        invoice_id: 'INV-OFFLINE-001',
        customer: 'Tariq Mehmood',
        amount: 320000,
        branch_id: 'BR-01'
      })

      await inv._syncPromise

      expect(store.invoices.some(i => i.id === 'INV-OFFLINE-001')).toBe(true)
      expect(inv._syncStatus).toBe('offline_local')

      const entity = await offlineStorage.getEntity('invoice', 'INV-OFFLINE-001')
      expect(entity).toBeDefined()

      const pending = await mutationQueue.getPending()
      expect(pending.some(m => m.entityType === 'invoice' && m.entityId === 'INV-OFFLINE-001')).toBe(true)
    })

    it('expense create offline: creates local expense and durable outbox item', async () => {
      const exp = store.addExpense({
        id: 'EXP-OFFLINE-001',
        expense_id: 'EXP-OFFLINE-001',
        category: 'Generator Fuel',
        amount: 18500,
        branch: 'Peshawar',
        branch_id: 'BR-01'
      })

      await exp._syncPromise

      expect(store.expenses.some(e => e.id === 'EXP-OFFLINE-001')).toBe(true)
      expect(exp._syncStatus).toBe('offline_local')

      const entity = await offlineStorage.getEntity('expense', 'EXP-OFFLINE-001')
      expect(entity).toBeDefined()
      expect(entity.amount).toBe(18500)

      const pending = await mutationQueue.getPending()
      expect(pending.some(m => m.entityType === 'expense' && m.entityId === 'EXP-OFFLINE-001')).toBe(true)
    })

    it('inventory mutation offline: reserveUnit updates unit and enqueues durable mutation', async () => {
      // Setup available unit
      store.serializedUnits.unshift({
        id: 'VIN-RESERVE-01',
        serial: 'VIN-RESERVE-01',
        unit_id: 'VIN-RESERVE-01',
        status: 'Available',
        ownership_status: 'Inventory',
        branch_id: 'BR-01',
        branch: 'Peshawar'
      })

      const unit = store.reserveUnit('VIN-RESERVE-01', 'ORD-OFFLINE-001', 'CUST-OFFLINE-001')
      await unit._syncPromise

      // Vue state
      expect(unit.status).toBe('Reserved')
      expect(unit._syncStatus).toBe('offline_local')

      // IndexedDB entity
      const entity = await offlineStorage.getEntity('serialized_unit', 'VIN-RESERVE-01')
      expect(entity).toBeDefined()
      expect(entity.status).toBe('Reserved')

      // MutationQueue
      const pending = await mutationQueue.getPending()
      expect(pending.some(m => m.entityType === 'serialized_unit' && m.entityId === 'VIN-RESERVE-01')).toBe(true)
    })

    it('repair update offline: updateRepairJob updates job and enqueues durable mutation', async () => {
      store.repairs.unshift({
        id: 'JOB-OFFLINE-01',
        jobId: 'JOB-OFFLINE-01',
        customer: 'Kamran Akmal',
        progress: 25,
        status: 'In Progress',
        branch_id: 'BR-01',
        branch: 'Peshawar'
      })

      const rep = store.updateRepairJob('JOB-OFFLINE-01', { progress: 80, notes: 'Motor calibrated' })
      await rep._syncPromise

      expect(rep.progress).toBe(80)
      expect(rep._syncStatus).toBe('offline_local')

      const entity = await offlineStorage.getEntity('repair_job', 'JOB-OFFLINE-01')
      expect(entity).toBeDefined()
      expect(entity.progress).toBe(80)

      const pending = await mutationQueue.getPending()
      expect(pending.some(m => m.entityType === 'repair_job' && m.entityId === 'JOB-OFFLINE-01')).toBe(true)
    })
  })

  describe('2. State Survival Across Refresh / Application Restart', () => {
    it('refresh while offline: entities and outbox survive a new storage engine instance', async () => {
      // 1. Create offline customer
      const cust = store.addCustomer({
        id: 'CUST-SURVIVE-01',
        name: 'Persistent Customer',
        phone: '+92 333 1122334',
        branch_id: 'BR-01'
      })
      await cust._syncPromise

      // 2. Simulate browser reload by initializing brand new storage adapter & engine
      const freshAdapter = new IndexedDBStorageAdapter()
      await freshAdapter.init()
      const freshStorage = new OfflineStorageEngine(freshAdapter)
      const freshQueue = new MutationQueue(freshStorage)

      // 3. Verify entity survived in fresh instance
      const freshEntity = await freshStorage.getEntity('customer', 'CUST-SURVIVE-01')
      expect(freshEntity).toBeDefined()
      expect(freshEntity.name).toBe('Persistent Customer')

      // 4. Verify outbox mutation survived in fresh instance
      const freshPending = await freshQueue.getPending()
      const match = freshPending.find(m => m.entityId === 'CUST-SURVIVE-01')
      expect(match).toBeDefined()
      expect(match.payload.name).toBe('Persistent Customer')

      // 5. Verify UI hydration restores record into empty Vue collection
      store.customers = []
      expect(store.customers.some(c => c.id === 'CUST-SURVIVE-01')).toBe(false)

      await store.hydrateFromOfflineStorage()
      expect(store.customers.some(c => c.id === 'CUST-SURVIVE-01')).toBe(true)
    })
  })

  describe('3. Reconnect Synchronization & Queue Drain', () => {
    it('reconnect synchronizes pending mutations and clears queue only after server acknowledgement', async () => {
      // Create pending offline mutations
      const c = store.addCustomer({ id: 'CUST-SYNC-01', name: 'Sync Cust', branch_id: 'BR-01' })
      const q = store.addQuotation({ id: 'QT-SYNC-01', quote_id: 'QT-SYNC-01', customer: 'Sync Cust', branch_id: 'BR-01' })
      await Promise.all([c._syncPromise, q._syncPromise])

      expect((await mutationQueue.getPending()).length).toBe(2)

      // Mock backend /sync/push and /sync/pull endpoints
      vi.spyOn(api, 'get').mockImplementation((url) => {
        if (url.includes('/sync/pull')) {
          return Promise.resolve({ ok: true, data: { entities: {}, tombstones: [] } })
        }
        return Promise.resolve({ ok: true, data: {} })
      })

      const pushSpy = vi.spyOn(api, 'post').mockImplementation((url, body) => {
        if (url === '/sync/push') {
          return Promise.resolve({
            ok: true,
            data: {
              results: body.mutations.map(m => ({
                mutationId: m.mutationId,
                status: 'synced',
                serverState: { id: m.entityId, version: 1 }
              }))
            }
          })
        }
        return Promise.resolve({ ok: true, data: {} })
      })

      // Simulate reconnect
      syncCoordinator.handleNetworkChange(true, { autoSync: false })
      await syncCoordinator.syncNow()

      expect(pushSpy).toHaveBeenCalled()

      // Verify outbox queue drained
      const remaining = await mutationQueue.getPending()
      expect(remaining.length).toBe(0)
      expect(syncCoordinator.state.pendingCount).toBe(0)

      // Verify local status updated to synced
      expect(c._syncStatus).toBe('synced')
      expect(c._isLocalOnly).toBe(false)
    })

    it('duplicate retry: preserves idempotency key across retries', async () => {
      const c = store.addCustomer({ id: 'CUST-IDEM-01', name: 'Idem Cust', branch_id: 'BR-01' })
      await c._syncPromise

      const pending = await mutationQueue.getPending()
      const m1 = pending.find(m => m.entityId === 'CUST-IDEM-01')
      expect(m1.idempotencyKey).toBeDefined()

      // Retry same mutation
      const m1Key = m1.idempotencyKey
      await mutationQueue.markFailed(m1.mutationId, 'Network blip')

      const retried = await mutationQueue.getById(m1.mutationId)
      expect(retried.idempotencyKey).toBe(m1Key) // Idempotency key never altered
    })

    it('server rejection: retains rejected mutation in queue with error details without discarding', async () => {
      const c = store.addCustomer({ id: 'CUST-REJECT-01', name: 'Bad Customer', branch_id: 'BR-01' })
      await c._syncPromise

      vi.spyOn(api, 'post').mockImplementation((url, body) => {
        if (url === '/sync/push') {
          return Promise.resolve({
            ok: true,
            data: {
              results: body.mutations.map(m => ({
                mutationId: m.mutationId,
                status: 'rejected',
                error: 'CNIC already registered to another branch'
              }))
            }
          })
        }
        return Promise.resolve({ ok: true, data: {} })
      })

      syncCoordinator.handleNetworkChange(true, { autoSync: false })
      await syncCoordinator.syncNow()

      const all = await mutationQueue.getAll()
      const rej = all.find(m => m.entityId === 'CUST-REJECT-01')
      expect(rej).toBeDefined()
      expect(rej.status).toBe('rejected')
      expect(rej.lastError).toContain('CNIC already registered')
    })

    it('conflict response (409): isolates conflicted record into dedicated conflicts store', async () => {
      const c = store.addCustomer({ id: 'CUST-CONF-01', name: 'Conflicted Customer', branch_id: 'BR-01' })
      await c._syncPromise

      vi.spyOn(api, 'post').mockImplementation((url, body) => {
        if (url === '/sync/push') {
          return Promise.resolve({
            ok: true,
            data: {
              results: body.mutations.map(m => ({
                mutationId: m.mutationId,
                status: 'conflict',
                serverState: { id: m.entityId, name: 'Server Version Name', version: 8 },
                resolutionRule: 'REQUIRE_MANAGER_APPROVAL'
              }))
            }
          })
        }
        return Promise.resolve({ ok: true, data: {} })
      })

      syncCoordinator.handleNetworkChange(true, { autoSync: false })
      await syncCoordinator.syncNow()

      const all = await mutationQueue.getAll()
      const conf = all.find(m => m.entityId === 'CUST-CONF-01')
      expect(conf).toBeDefined()
      expect(conf.status).toBe('conflict')

      // Verify conflict record exists in dedicated conflicts store
      const conflictRecord = await offlineStorage.adapter.get('conflicts', 'cnf_' + conf.mutationId)
      expect(conflictRecord).toBeDefined()
      expect(conflictRecord.serverState.version).toBe(8)
      expect(conflictRecord.resolutionRule).toBe('REQUIRE_MANAGER_APPROVAL')
      expect(syncCoordinator.state.conflictCount).toBeGreaterThan(0)
    })
  })

  describe('4. Multi-Tenant Branch Isolation & Secure Deletion', () => {
    it('branch isolation: Branch Manager cannot query or receive other branches cached records', async () => {
      // Save entities belonging to Peshawar (BR-01) and Islamabad (BR-02)
      await offlineStorage.saveEntity('customer', { id: 'C-PEW-1', name: 'Peshawar Cust', branch_id: 'BR-01' })
      await offlineStorage.saveEntity('customer', { id: 'C-ISB-1', name: 'Islamabad Cust', branch_id: 'BR-02' })

      // Query as Peshawar Branch Manager
      const pewQuery = await offlineStorage.queryEntities('customer', {
        branchId: 'BR-01',
        userRole: 'Branch Manager'
      })

      expect(pewQuery.length).toBe(1)
      expect(pewQuery[0].id).toBe('C-PEW-1')
      expect(pewQuery.some(c => c.id === 'C-ISB-1')).toBe(false)

      // Query as Super Admin (unrestricted)
      const adminQuery = await offlineStorage.queryEntities('customer', {
        userRole: 'Super Admin'
      })
      expect(adminQuery.length).toBe(2)
    })

    it('deletion: creates durable tombstones and enqueues DELETE mutation', async () => {
      // Seed customer in store and offline storage
      store.customers.unshift({
        id: 'CUST-DEL-01',
        customer_id: 'CUST-DEL-01',
        name: 'Delete Target',
        branch_id: 'BR-01'
      })
      await offlineStorage.saveEntity('customer', { id: 'CUST-DEL-01', name: 'Delete Target', branch_id: 'BR-01' })

      // Perform deletion while offline
      const deleted = store.deleteCustomer('CUST-DEL-01')
      expect(deleted).toBe(true)
      if (store._lastSyncPromise) await store._lastSyncPromise

      // 1. Removed from Vue store
      expect(store.customers.some(c => c.id === 'CUST-DEL-01')).toBe(false)

      // 2. Tombstone recorded in IndexedDB
      const tombstones = await offlineStorage.getTombstones('customer')
      expect(tombstones.some(t => t.id === 'CUST-DEL-01')).toBe(true)

      // 3. DELETE mutation in outbox
      const pending = await mutationQueue.getPending()
      const delMut = pending.find(m => m.entityId === 'CUST-DEL-01')
      expect(delMut).toBeDefined()
      expect(delMut.operation).toBe('DELETE')
    })

    it('logout with pending changes: purgeAllOfflineData wipes partitions so user switching does not leak data', async () => {
      // Create pending offline mutation
      const c = store.addCustomer({ id: 'CUST-LOGOUT-01', name: 'Unsaved Cust', branch_id: 'BR-01' })
      await c._syncPromise

      expect((await mutationQueue.getPending()).length).toBe(1)
      expect(syncCoordinator.state.pendingCount).toBe(1)

      // Execute explicit partition wipe
      await store.purgeAllOfflineData()

      // Outbox and entities wiped completely
      expect((await mutationQueue.getPending()).length).toBe(0)
      expect((await offlineStorage.queryEntities('customer')).length).toBe(0)
      expect(syncCoordinator.state.pendingCount).toBe(0)
    })
  })
})
