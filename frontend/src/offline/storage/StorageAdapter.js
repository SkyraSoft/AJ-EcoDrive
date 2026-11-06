/**
 * AJ ECODRIVE ERP — STORAGE ADAPTER INTERFACE
 * 
 * Abstract contract enabling cross-platform storage backends:
 * - Web SPA: IndexedDBStorageAdapter (Browser IndexedDB)
 * - Node/Test: MemoryStorageAdapter / MockIndexedDB
 * - Mobile/Desktop (Phase 7): SQLiteStorageAdapter
 */

export class StorageAdapter {
  async init() {
    throw new Error('init() must be implemented by storage adapter subclass')
  }

  async get(storeName, key) {
    throw new Error('get() must be implemented by storage adapter subclass')
  }

  async set(storeName, key, value) {
    throw new Error('set() must be implemented by storage adapter subclass')
  }

  async remove(storeName, key) {
    throw new Error('remove() must be implemented by storage adapter subclass')
  }

  async list(storeName, filterFn = null) {
    throw new Error('list() must be implemented by storage adapter subclass')
  }

  async clear(storeName) {
    throw new Error('clear() must be implemented by storage adapter subclass')
  }

  async batchSet(storeName, items) {
    throw new Error('batchSet() must be implemented by storage adapter subclass')
  }

  async batchRemove(storeName, keys) {
    throw new Error('batchRemove() must be implemented by storage adapter subclass')
  }
}
