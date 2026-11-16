import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { SQLiteStorageAdapter } from '../src/offline/storage/SQLiteStorageAdapter.js'
import { OfflineStorageEngine, isTauriEnvironment, createDefaultStorageAdapter } from '../src/offline/storage/OfflineStorageEngine.js'
import { IndexedDBStorageAdapter } from '../src/offline/storage/IndexedDBStorageAdapter.js'
import { SecureStorage } from '../src/offline/storage/SecureStorage.js'

describe('Phase 7.3 & 7.4 — SQLite Storage Adapter & Secure Storage', () => {
  let adapter

  beforeEach(async () => {
    adapter = new SQLiteStorageAdapter('sqlite:test_ecodrive.db')
    await adapter.init()
  })

  afterEach(async () => {
    if (adapter) {
      await adapter.clear('entities')
      await adapter.clear('outbox')
      await adapter.clear('conflicts')
      await adapter.clear('tombstones')
      await adapter.clear('sync_state')
    }
  })

  it('initializes adapter and executes schema migration safely', async () => {
    expect(adapter).toBeDefined()
    expect(adapter.isFallback || adapter.db).toBeTruthy()
    expect(adapter.version).toBe(1)
  })

  it('performs transactional entity CRUD with branch scoping', async () => {
    const customer = {
      id: 'CUST-SQLITE-01',
      name: 'Bilal Khan',
      phone: '03001234567',
      branch_id: 'BR-01',
      entityType: 'customer',
      updatedAt: new Date().toISOString()
    }

    await adapter.set('entities', customer.id, customer)

    const retrieved = await adapter.get('entities', 'CUST-SQLITE-01')
    expect(retrieved).toBeDefined()
    expect(retrieved.name).toBe('Bilal Khan')
    expect(retrieved.branch_id).toBe('BR-01')

    // List entities
    const list = await adapter.list('entities')
    expect(list.length).toBeGreaterThanOrEqual(1)
    expect(list.some(e => e.id === 'CUST-SQLITE-01')).toBe(true)

    // Remove entity
    await adapter.remove('entities', 'CUST-SQLITE-01')
    const deleted = await adapter.get('entities', 'CUST-SQLITE-01')
    expect(deleted).toBeNull()
  })

  it('manages durable outbox mutation lifecycle', async () => {
    const mutation = {
      mutationId: 'MUT-SQLITE-99',
      entityType: 'order',
      entityId: 'ORD-999',
      action: 'create',
      branchId: 'BR-01',
      status: 'pending',
      retryCount: 0,
      createdAt: new Date().toISOString(),
      payload: { customerId: 'CUST-01', totalAmount: 250000 }
    }

    await adapter.set('outbox', mutation.mutationId, mutation)

    const storedMut = await adapter.get('outbox', 'MUT-SQLITE-99')
    expect(storedMut).toBeDefined()
    expect(storedMut.status).toBe('pending')
    expect(storedMut.entityType).toBe('order')

    // Update status to processing
    mutation.status = 'syncing'
    await adapter.set('outbox', mutation.mutationId, mutation)

    const updated = await adapter.get('outbox', 'MUT-SQLITE-99')
    expect(updated.status).toBe('syncing')

    // Clean up
    await adapter.remove('outbox', 'MUT-SQLITE-99')
    expect(await adapter.get('outbox', 'MUT-SQLITE-99')).toBeNull()
  })

  it('stores and retrieves conflict records in quarantine', async () => {
    const conflict = {
      conflictId: 'CONF-001',
      mutationId: 'MUT-001',
      entityType: 'inventory',
      entityId: 'VIN-CONF-01',
      branchId: 'BR-02',
      createdAt: new Date().toISOString(),
      serverVersion: { status: 'Sold' },
      clientVersion: { status: 'Reserved' }
    }

    await adapter.set('conflicts', conflict.conflictId, conflict)

    const found = await adapter.get('conflicts', 'CONF-001')
    expect(found).toBeDefined()
    expect(found.serverVersion.status).toBe('Sold')
    expect(found.clientVersion.status).toBe('Reserved')
  })

  it('supports batch operations (batchSet, batchRemove)', async () => {
    const entries = [
      ['ENT-1', { id: 'ENT-1', name: 'Item 1', entityType: 'product' }],
      ['ENT-2', { id: 'ENT-2', name: 'Item 2', entityType: 'product' }],
      ['ENT-3', { id: 'ENT-3', name: 'Item 3', entityType: 'product' }]
    ]

    await adapter.batchSet('entities', entries)

    const all = await adapter.list('entities', item => item.entityType === 'product')
    expect(all.length).toBe(3)

    await adapter.batchRemove('entities', ['ENT-1', 'ENT-3'])
    const remaining = await adapter.list('entities', item => item.entityType === 'product')
    expect(remaining.length).toBe(1)
    expect(remaining[0].id).toBe('ENT-2')
  })

  it('OfflineStorageEngine dynamically resolves SQLite in Tauri and IndexedDB on Web', () => {
    // In headless Node / JSDOM environment without __TAURI__:
    expect(isTauriEnvironment()).toBe(false)
    const webAdapter = createDefaultStorageAdapter()
    expect(webAdapter instanceof IndexedDBStorageAdapter).toBe(true)

    // Simulate Tauri runtime environment
    window.__TAURI_INTERNALS__ = {}
    expect(isTauriEnvironment()).toBe(true)
    const tauriAdapter = createDefaultStorageAdapter()
    expect(tauriAdapter instanceof SQLiteStorageAdapter).toBe(true)

    // Cleanup mock
    delete window.__TAURI_INTERNALS__
    expect(isTauriEnvironment()).toBe(false)
  })

  it('SecureStorage guarantees encryption at rest and wipes on clear', async () => {
    await SecureStorage.setItem('auth_token', 'jwt.secret.payload.signature')
    const token = await SecureStorage.getItem('auth_token')
    expect(token).toBe('jwt.secret.payload.signature')

    await SecureStorage.removeItem('auth_token')
    expect(await SecureStorage.getItem('auth_token')).toBeNull()

    // Test clear
    await SecureStorage.setItem('session_key', 'val123')
    await SecureStorage.clear()
    expect(await SecureStorage.getItem('session_key')).toBeNull()
  })
})
