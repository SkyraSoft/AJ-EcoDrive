/**
 * AJ ECODRIVE ERP — CAPACITOR SQLITE STORAGE ADAPTER TEST SUITE
 * 
 * Validates the Android Capacitor SQLite storage adapter:
 * - Table schema migrations
 * - Branch-scoped entity caching
 * - Durable outbox mutations and idempotency
 * - Conflict quarantine isolation
 * - Tombstones and sync state tracking
 * - Batch operations and error recovery
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { CapacitorSQLiteStorageAdapter } from '../src/offline/storage/CapacitorSQLiteStorageAdapter.js'
import { OfflineStorageEngine, createDefaultStorageAdapter } from '../src/offline/storage/OfflineStorageEngine.js'

describe('AJ EcoDrive — Phase 9 Capacitor SQLite Storage Adapter Suite', () => {
  let adapter

  beforeEach(async () => {
    adapter = new CapacitorSQLiteStorageAdapter('test_cap_offline_db')
    await adapter.init()
  })

  it('1. Initialization: Initializes storage and reports fallback or native state', async () => {
    expect(adapter).toBeDefined()
    expect(adapter.dbName).toBe('test_cap_offline_db')
    // In headless Node/Vitest environment, fallback in-memory store is active
    expect(adapter.isFallback).toBe(true)
  })

  it('2. Entity Operations: CRUD operations in entities store with branch scoping', async () => {
    const customer = {
      id: 'CUST-AND-001',
      name: 'Tariq Mehmood',
      phone: '03001234567',
      cnic: '37405-1234567-1',
      branch_id: 'BR-PEW-01',
      entityType: 'customers'
    }

    await adapter.set('entities', customer.id, customer)
    const fetched = await adapter.get('entities', 'CUST-AND-001')
    expect(fetched).toBeDefined()
    expect(fetched.name).toBe('Tariq Mehmood')
    expect(fetched.branch_id).toBe('BR-PEW-01')

    const list = await adapter.list('entities', e => e.branch_id === 'BR-PEW-01')
    expect(list.length).toBeGreaterThanOrEqual(1)
    expect(list[0].id).toBe('CUST-AND-001')

    await adapter.remove('entities', 'CUST-AND-001')
    const removed = await adapter.get('entities', 'CUST-AND-001')
    expect(removed).toBeNull()
  })

  it('3. Outbox Queue: Enqueue, list pending, update status, and purge', async () => {
    const mutation = {
      id: 'mut_and_001',
      idempotency_key: 'idemp_and_001',
      entity_type: 'orders',
      entity_id: 'SO-AND-001',
      action: 'CREATE',
      status: 'pending',
      branch_id: 'BR-ISB-01',
      payload: { total: 450000, model: 'EcoDrive Sprint' }
    }

    await adapter.set('outbox', mutation.id, mutation)
    const pending = await adapter.list('outbox', m => m.status === 'pending')
    expect(pending.length).toBe(1)
    expect(pending[0].idempotency_key).toBe('idemp_and_001')

    // Update status to synced
    mutation.status = 'synced'
    await adapter.set('outbox', mutation.id, mutation)
    const remaining = await adapter.list('outbox', m => m.status === 'pending')
    expect(remaining.length).toBe(0)

    await adapter.remove('outbox', mutation.id)
    const check = await adapter.get('outbox', mutation.id)
    expect(check).toBeNull()
  })

  it('4. Conflict Quarantine: Isolates 409 optimistic concurrency records', async () => {
    const conflict = {
      id: 'conf_and_001',
      mutation_id: 'mut_and_002',
      entity_type: 'invoices',
      entity_id: 'INV-AND-001',
      local_payload: { grand_total: 420000 },
      server_payload: { grand_total: 425000 },
      status: 'pending_review'
    }

    await adapter.set('conflicts', conflict.id, conflict)
    const fetched = await adapter.get('conflicts', 'conf_and_001')
    expect(fetched).toBeDefined()
    expect(fetched.entity_id).toBe('INV-AND-001')
    expect(fetched.status).toBe('pending_review')

    const unresolved = await adapter.list('conflicts', c => c.status === 'pending_review')
    expect(unresolved.length).toBe(1)
  })

  it('5. Sync State & Tombstones: Persists high-water mark timestamps and deletions', async () => {
    await adapter.set('sync_state', 'last_pull_timestamp', '2026-11-16T12:00:00.000Z')
    const val = await adapter.get('sync_state', 'last_pull_timestamp')
    expect(val).toBe('2026-11-16T12:00:00.000Z')

    const tombstone = {
      id: 'tomb_and_001',
      entity_type: 'customers',
      entity_id: 'CUST-OLD-999',
      branch_id: 'BR-LHE-01',
      deleted_at: '2026-11-16T12:05:00.000Z'
    }
    await adapter.set('tombstones', tombstone.id, tombstone)
    const fetchedTomb = await adapter.get('tombstones', 'tomb_and_001')
    expect(fetchedTomb.entity_id).toBe('CUST-OLD-999')
  })

  it('6. Batch Operations: Executes batchSet and batchRemove cleanly', async () => {
    const batch = [
      { id: 'item_1', name: 'Item 1', branch_id: 'BR-RWP-01' },
      { id: 'item_2', name: 'Item 2', branch_id: 'BR-RWP-01' },
      { id: 'item_3', name: 'Item 3', branch_id: 'BR-RWP-01' }
    ]

    await adapter.batchSet('entities', batch)
    const list = await adapter.list('entities', e => e.branch_id === 'BR-RWP-01')
    expect(list.length).toBe(3)

    await adapter.batchRemove('entities', ['item_1', 'item_3'])
    const remaining = await adapter.list('entities', e => e.branch_id === 'BR-RWP-01')
    expect(remaining.length).toBe(1)
    expect(remaining[0].id).toBe('item_2')
  })

  it('7. Dynamic Adapter Integration: OfflineStorageEngine accommodates Android adapter', async () => {
    const engine = new OfflineStorageEngine(adapter)
    await engine.init()
    expect(engine.adapter).toBe(adapter)

    const defaultAdapter = createDefaultStorageAdapter()
    expect(defaultAdapter).toBeDefined()
  })
})
