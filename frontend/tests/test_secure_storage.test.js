import { describe, it, expect, beforeEach } from 'vitest'
import { SecureStorage } from '../src/offline/storage/SecureStorage.js'

describe('AJ EcoDrive — SecureStorage Multi-Platform Suite', () => {
  beforeEach(async () => {
    await SecureStorage.clear()
  })

  it('stores, retrieves, and updates sensitive token in memory fallback / node context', async () => {
    await SecureStorage.setItem('auth_token', 'jwt.test.token.payload')
    const retrieved = await SecureStorage.getItem('auth_token')
    expect(retrieved).toBe('jwt.test.token.payload')

    // Update
    await SecureStorage.setItem('auth_token', 'jwt.updated.token')
    expect(await SecureStorage.getItem('auth_token')).toBe('jwt.updated.token')
  })

  it('returns null for non-existent key', async () => {
    const val = await SecureStorage.getItem('non_existent_key_123')
    expect(val).toBeNull()
  })

  it('removes item cleanly', async () => {
    await SecureStorage.setItem('temp_session_key', 'session_data_456')
    expect(await SecureStorage.getItem('temp_session_key')).toBe('session_data_456')

    await SecureStorage.removeItem('temp_session_key')
    expect(await SecureStorage.getItem('temp_session_key')).toBeNull()
  })

  it('purges all items on clear() during logout or user switching', async () => {
    await SecureStorage.setItem('key_1', 'val_1')
    await SecureStorage.setItem('key_2', 'val_2')
    await SecureStorage.setItem('key_3', 'val_3')

    await SecureStorage.clear()

    expect(await SecureStorage.getItem('key_1')).toBeNull()
    expect(await SecureStorage.getItem('key_2')).toBeNull()
    expect(await SecureStorage.getItem('key_3')).toBeNull()
  })

  it('reports status and provider diagnostics', async () => {
    const status = await SecureStorage.getStatus()
    expect(status).toBeDefined()
    expect(typeof status).toBe('object')
  })
})
