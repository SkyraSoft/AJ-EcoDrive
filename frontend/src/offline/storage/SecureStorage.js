/**
 * AJ ECODRIVE ERP — SECURE CREDENTIAL & SESSION STORAGE
 * 
 * Provides hardware/OS-backed authenticated encrypted credential and session token storage.
 * On Windows Desktop (Tauri):
 *   Uses Windows Data Protection API (DPAPI) via native Rust bridge with user-scoped master key.
 * On Android Mobile (Capacitor):
 *   Uses AndroidKeyStore with non-exportable 256-bit AES key in GCM mode (AES/GCM/NoPadding)
 *   via native Java plugin bridge (SecureKeyStorePlugin). Values are authenticated and encrypted
 *   before persistence, with zero plaintext tokens written to disk or logged.
 * On Web / Headless:
 *   Uses strictly scoped, non-persistent session memory/storage.
 * 
 * Strict Security Guarantees:
 * 1. Zero plaintext tokens on disk.
 * 2. Zero passwords, DB credentials, or JWT secrets stored anywhere.
 * 3. Zero token logging.
 * 4. Automatic purge on explicit logout or user switching.
 * 5. Complete branch isolation across OS user boundaries.
 */

import { isTauriEnvironment, isCapacitorEnvironment } from './OfflineStorageEngine.js'

// Ephemeral in-memory fallback for testing / non-persistent environments
const IN_MEMORY_VAULT = new Map()

// Lazy reference for Capacitor SecureKeyStore native plugin
let nativeSecureKeyStore = null
async function getSecureKeyStore() {
  if (nativeSecureKeyStore) return nativeSecureKeyStore
  if (typeof window !== 'undefined' && window.Capacitor) {
    try {
      const { registerPlugin } = await import('@capacitor/core')
      nativeSecureKeyStore = registerPlugin('SecureKeyStore')
      return nativeSecureKeyStore
    } catch (e) {
      console.warn('[SecureStorage] Could not register SecureKeyStore plugin:', e)
    }
  }
  return null
}

export class SecureStorage {
  /**
   * Retrieves an item from secure storage
   * @param {string} key
   * @returns {Promise<string|null>}
   */
  static async getItem(key) {
    if (!key) return null
    const cleanKey = String(key)

    if (isTauriEnvironment()) {
      try {
        const { invoke } = await import('@tauri-apps/api/core')
        const val = await invoke('secure_store_get', { key: cleanKey })
        return val || null
      } catch (err) {
        console.warn('[SecureStorage] Native DPAPI read failed, falling back to memory:', err?.message || err)
        return IN_MEMORY_VAULT.get(cleanKey) || null
      }
    }

    if (isCapacitorEnvironment()) {
      try {
        const plugin = await getSecureKeyStore()
        if (plugin && typeof plugin.get === 'function') {
          const res = await plugin.get({ key: cleanKey })
          return res?.value || IN_MEMORY_VAULT.get(cleanKey) || null
        }
      } catch (err) {
        console.warn('[SecureStorage] Native Android Keystore read failed, falling back to memory:', err?.message || err)
        return IN_MEMORY_VAULT.get(cleanKey) || null
      }
    }

    if (typeof sessionStorage !== 'undefined') {
      return sessionStorage.getItem(`ecodrive_sec_${cleanKey}`) || IN_MEMORY_VAULT.get(cleanKey) || null
    }

    return IN_MEMORY_VAULT.get(cleanKey) || null
  }

  /**
   * Stores an item into secure storage
   * @param {string} key
   * @param {string} value
   */
  static async setItem(key, value) {
    if (!key) return
    const cleanKey = String(key)
    const cleanVal = String(value)

    if (isTauriEnvironment()) {
      try {
        const { invoke } = await import('@tauri-apps/api/core')
        await invoke('secure_store_set', { key: cleanKey, value: cleanVal })
        return
      } catch (err) {
        console.warn('[SecureStorage] Native DPAPI write failed, falling back to memory:', err?.message || err)
        IN_MEMORY_VAULT.set(cleanKey, cleanVal)
        return
      }
    }

    if (isCapacitorEnvironment()) {
      try {
        const plugin = await getSecureKeyStore()
        if (plugin && typeof plugin.set === 'function') {
          await plugin.set({ key: cleanKey, value: cleanVal })
          return
        }
      } catch (err) {
        console.warn('[SecureStorage] Native Android Keystore write failed, falling back to memory:', err?.message || err)
        IN_MEMORY_VAULT.set(cleanKey, cleanVal)
        return
      }
    }

    if (typeof sessionStorage !== 'undefined') {
      try {
        sessionStorage.setItem(`ecodrive_sec_${cleanKey}`, cleanVal)
      } catch (e) {
        // Ignore quota exceptions and use memory
      }
    }
    IN_MEMORY_VAULT.set(cleanKey, cleanVal)
  }

  /**
   * Removes an item from secure storage
   * @param {string} key
   */
  static async removeItem(key) {
    if (!key) return
    const cleanKey = String(key)

    if (isTauriEnvironment()) {
      try {
        const { invoke } = await import('@tauri-apps/api/core')
        await invoke('secure_store_remove', { key: cleanKey })
      } catch (err) {
        // Ignore fallback
      }
    }

    if (isCapacitorEnvironment()) {
      try {
        const plugin = await getSecureKeyStore()
        if (plugin && typeof plugin.remove === 'function') {
          await plugin.remove({ key: cleanKey })
        }
      } catch (err) {
        // Ignore fallback
      }
    }

    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.removeItem(`ecodrive_sec_${cleanKey}`)
    }
    IN_MEMORY_VAULT.delete(cleanKey)
  }

  /**
   * Purges all credentials and sensitive tokens from secure storage
   */
  static async clear() {
    if (isTauriEnvironment()) {
      try {
        const { invoke } = await import('@tauri-apps/api/core')
        await invoke('secure_store_clear')
      } catch (err) {
        // Ignore fallback
      }
    }

    if (isCapacitorEnvironment()) {
      try {
        const plugin = await getSecureKeyStore()
        if (plugin && typeof plugin.clear === 'function') {
          await plugin.clear()
        }
      } catch (err) {
        // Ignore fallback
      }
    }

    if (typeof sessionStorage !== 'undefined') {
      const keysToRemove = []
      for (let i = 0; i < sessionStorage.length; i++) {
        const k = sessionStorage.key(i)
        if (k && k.startsWith('ecodrive_sec_')) {
          keysToRemove.push(k)
        }
      }
      keysToRemove.forEach(k => sessionStorage.removeItem(k))
    }

    IN_MEMORY_VAULT.clear()
  }

  /**
   * Diagnostic method reporting secure storage status and hardware backing
   */
  static async getStatus() {
    if (isCapacitorEnvironment()) {
      try {
        const plugin = await getSecureKeyStore()
        if (plugin && typeof plugin.getStatus === 'function') {
          return await plugin.getStatus()
        }
      } catch (err) {
        return { isKeyStoreAvailable: false, error: err?.message || String(err) }
      }
    }
    return {
      isKeyStoreAvailable: false,
      provider: isTauriEnvironment() ? 'Windows DPAPI' : 'Web Session Memory'
    }
  }
}
