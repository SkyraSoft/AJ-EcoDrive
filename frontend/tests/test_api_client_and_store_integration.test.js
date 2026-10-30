import { describe, it, expect, vi, beforeEach } from 'vitest'
import { api, ApiError } from '../src/services/api.js'
import { store } from '../src/store.js'

describe('AJ EcoDrive — Master API Client & Store Integration Suite', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    store.setSession({
      id: 'USR-TEST-01',
      name: 'Test Officer',
      role: 'Branch Manager',
      branchCode: 'PEW-01',
      branchId: 'BR-01',
      token: 'jwt-test-token-xyz123',
      isAuthenticated: true
    })
  })

  describe('1. API Client Core Architecture & Header Injection', () => {
    it('initializes API client with valid base URL and defaults', () => {
      expect(api).toBeDefined()
      expect(typeof api.request).toBe('function')
      expect(typeof api.get).toBe('function')
      expect(typeof api.post).toBe('function')
      expect(typeof api.put).toBe('function')
      expect(typeof api.delete).toBe('function')
    })

    it('injects Authorization Bearer and X-Branch-ID headers from active session', () => {
      const headers = api.buildHeaders({ 'X-Custom-Header': 'EcoDrive-Test' })
      expect(headers['Content-Type']).toBe('application/json')
      expect(headers['Accept']).toBe('application/json')
      expect(headers['X-Custom-Header']).toBe('EcoDrive-Test')
      expect(headers['Authorization']).toBe('Bearer jwt-test-token-xyz123')
      expect(headers['X-Branch-ID']).toBe('BR-01')
      expect(headers['X-User-Role']).toBe('Branch Manager')
    })

    it('throws ApiError with normalized status and response payload on HTTP failure', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
        ok: false,
        status: 422,
        statusText: 'Unprocessable Entity',
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ message: 'Invalid CNIC format', error: 'VALIDATION_FAILED' })
      })

      await expect(api.customers.create({ name: 'Incomplete' })).rejects.toThrow('Invalid CNIC format')
    })

    it('gracefully classifies fetch failure as offline error', async () => {
      vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(new TypeError('Failed to fetch'))

      try {
        await api.customers.getAll()
        expect.fail('Should have thrown offline error')
      } catch (err) {
        expect(err).toBeInstanceOf(ApiError)
        expect(err.isOffline).toBe(true)
        expect(err.message).toContain('Backend API server unreachable')
      }
    })
  })

  describe('2. Domain Endpoint Definitions', () => {
    it('exposes all required domain services matching the architectural specification', () => {
      expect(api.auth).toBeDefined()
      expect(typeof api.auth.login).toBe('function')
      expect(typeof api.auth.logout).toBe('function')

      expect(api.customers).toBeDefined()
      expect(typeof api.customers.getAll).toBe('function')
      expect(typeof api.customers.create).toBe('function')

      expect(api.orders).toBeDefined()
      expect(typeof api.orders.getAll).toBe('function')
      expect(typeof api.orders.create).toBe('function')

      expect(api.inventory).toBeDefined()
      expect(typeof api.inventory.getUnits).toBe('function')
      expect(typeof api.inventory.transfers.create).toBe('function')
      expect(typeof api.inventory.transfers.receive).toBe('function')

      expect(api.procurement).toBeDefined()
      expect(typeof api.procurement.createPurchaseOrder).toBe('function')
      expect(typeof api.procurement.receivePurchaseOrder).toBe('function')

      expect(api.finance).toBeDefined()
      expect(typeof api.finance.createExpense).toBe('function')
      expect(typeof api.finance.approveExpense).toBe('function')

      expect(api.afterSales).toBeDefined()
      expect(typeof api.afterSales.createCase).toBe('function')
      expect(typeof api.afterSales.createRepairJob).toBe('function')
    })
  })

  describe('3. Store Integration & Dual-Execution Persistence', () => {
    it('binds api client to store instance', () => {
      expect(store.api).toBeDefined()
      expect(typeof store.api.request).toBe('function')
      expect(typeof store._dispatchApiSync).toBe('function')
    })

    it('dispatches api.customers.create when store.addCustomer is called', async () => {
      const apiSpy = vi.spyOn(api.customers, 'create').mockResolvedValueOnce({
        ok: true,
        data: { id: 'CUST-NEW-99', name: 'Zahid Khan' }
      })

      const newCust = store.addCustomer({
        name: 'Zahid Khan',
        phone: '03001234567',
        cnic: '17301-1234567-1',
        city: 'Peshawar'
      })

      expect(newCust).toBeDefined()
      expect(newCust.name).toBe('Zahid Khan')
      expect(apiSpy).toHaveBeenCalledTimes(1)
      expect(apiSpy).toHaveBeenCalledWith(expect.objectContaining({
        name: 'Zahid Khan',
        branch_id: 'BR-01'
      }))
    })

    it('dispatches api.orders.create when store.addOrder is called', async () => {
      const apiSpy = vi.spyOn(api.orders, 'create').mockResolvedValueOnce({
        ok: true,
        data: { id: 'ORD-SYNC-01' }
      })

      const order = store.addOrder({
        customer: 'Zahid Khan',
        total: 'PKR 350,000',
        unit: 'CH 8-BRG-26-01731'
      })

      expect(order).toBeDefined()
      expect(apiSpy).toHaveBeenCalledTimes(1)
    })

    it('dispatches api.finance.createExpense and approveExpense', async () => {
      const createSpy = vi.spyOn(api.finance, 'createExpense').mockResolvedValueOnce({ ok: true })
      const approveSpy = vi.spyOn(api.finance, 'approveExpense').mockResolvedValueOnce({ ok: true })

      const exp = store.addExpense({
        category: 'Utilities',
        amount: '12000',
        vendor: 'PESCO Electricity'
      })

      expect(exp).toBeDefined()
      expect(createSpy).toHaveBeenCalledTimes(1)

      store.approveExpense(exp.id)
      expect(approveSpy).toHaveBeenCalledTimes(1)
      expect(approveSpy).toHaveBeenCalledWith(exp.id)
    })

    it('handles offline backend without throwing exceptions to synchronous store callers', async () => {
      vi.spyOn(api.finance, 'createExpense').mockRejectedValueOnce(
        new ApiError('Backend API server unreachable', 0, null, true)
      )

      expect(() => {
        store.addExpense({
          category: 'Office Supplies',
          amount: '4500',
          vendor: 'Stationery Corner'
        })
      }).not.toThrow()
    })
  })

  describe('4. Remote Data Hydration', () => {
    it('populates store.customers when fetchRemoteCustomers succeeds', async () => {
      const remoteData = [
        { id: 'CUST-REMOTE-1', name: 'Farhan Tariq', branch_id: 'BR-01', status: 'Active' }
      ]
      vi.spyOn(api.customers, 'getAll').mockResolvedValueOnce({
        ok: true,
        data: remoteData
      })

      const result = await store.fetchRemoteCustomers()
      expect(result).toBeDefined()
      expect(store.customers.some(c => c.id === 'CUST-REMOTE-1')).toBe(true)
      expect(store.customers[0].name).toBe('Farhan Tariq')
    })

    it('executes syncAllWithBackend across core collections without breaking', async () => {
      vi.spyOn(api.customers, 'getAll').mockResolvedValueOnce({ ok: true, data: [] })
      vi.spyOn(api.orders, 'getAll').mockResolvedValueOnce({ ok: true, data: [] })
      vi.spyOn(api.inventory, 'getUnits').mockResolvedValueOnce({ ok: true, data: [] })
      vi.spyOn(api.invoices, 'getAll').mockResolvedValueOnce({ ok: true, data: [] })
      vi.spyOn(api.inventory.transfers, 'getAll').mockResolvedValueOnce({ ok: true, data: [] })
      vi.spyOn(api.finance, 'getExpenses').mockResolvedValueOnce({ ok: true, data: [] })
      vi.spyOn(api.procurement, 'getPurchaseOrders').mockResolvedValueOnce({ ok: true, data: [] })

      const syncResults = await store.syncAllWithBackend()
      expect(syncResults.length).toBeGreaterThanOrEqual(7)
      syncResults.forEach(res => {
        expect(res.status).toBe('fulfilled')
      })
    })

    it('preserves local offline records when remote hydration executes', async () => {
      // Local record created while offline
      const localOfflineCust = store.addCustomer({
        id: 'CUST-OFFLINE-LOCAL',
        name: 'Local Offline Customer',
        phone: '03331112233'
      })
      localOfflineCust._isLocalOnly = true

      // Remote returns different records
      const remoteData = [
        { id: 'CUST-SERVER-01', name: 'Server Stored Customer', branch_id: 'BR-01' }
      ]
      vi.spyOn(api.customers, 'getAll').mockResolvedValueOnce({ ok: true, data: remoteData })

      await store.fetchRemoteCustomers()

      // Both server record and local offline record must remain available
      const foundLocal = store.customers.find(c => c.id === 'CUST-OFFLINE-LOCAL')
      const foundRemote = store.customers.find(c => c.id === 'CUST-SERVER-01')
      expect(foundLocal).toBeDefined()
      expect(foundLocal.name).toBe('Local Offline Customer')
      expect(foundRemote).toBeDefined()
      expect(foundRemote.name).toBe('Server Stored Customer')
    })
  })

  describe('5. Error Handling & Authorization Signals (HTTP 401, 403, 422)', () => {
    it('dispatches ecodrive:unauthorized event on HTTP 401 response', async () => {
      let unauthorizedFired = false
      const listener = () => { unauthorizedFired = true }
      window.addEventListener('ecodrive:unauthorized', listener)

      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ message: 'Token expired' })
      })

      try {
        await api.customers.getAll()
      } catch (err) {
        expect(err.status).toBe(401)
      }

      window.removeEventListener('ecodrive:unauthorized', listener)
      expect(unauthorizedFired).toBe(true)
    })

    it('dispatches ecodrive:forbidden event on HTTP 403 response', async () => {
      let forbiddenFired = false
      const listener = () => { forbiddenFired = true }
      window.addEventListener('ecodrive:forbidden', listener)

      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
        ok: false,
        status: 403,
        statusText: 'Forbidden',
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ message: 'Cross-branch access forbidden' })
      })

      try {
        await api.inventory.transfers.approve('TR-001')
      } catch (err) {
        expect(err.status).toBe(403)
      }

      window.removeEventListener('ecodrive:forbidden', listener)
      expect(forbiddenFired).toBe(true)
    })

    it('correctly maps HTTP 422 validation errors array', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
        ok: false,
        status: 422,
        statusText: 'Unprocessable Entity',
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({
          message: 'Validation failed',
          errors: [
            { field: 'phone', message: 'Phone must be valid Pakistani mobile number' },
            { field: 'cnic', message: 'CNIC must have 13 digits' }
          ]
        })
      })

      try {
        await api.customers.create({ name: 'Invalid User' })
        expect.fail('Should have thrown validation error')
      } catch (err) {
        expect(err.status).toBe(422)
        expect(err.validationErrors).toHaveLength(2)
        expect(err.validationErrors[0].field).toBe('phone')
      }
    })
  })

  describe('6. Outbox Tracking, Rollback & Retry Mechanism', () => {
    it('marks record as failed and populates syncOutbox on server failure', async () => {
      const serverErr = new ApiError('Internal Server Error', 500, { error: 'DB_DOWN' })
      vi.spyOn(api.customers, 'create').mockRejectedValueOnce(serverErr)

      const cust = store.addCustomer({
        id: 'CUST-FAIL-01',
        name: 'Fail Customer',
        phone: '03009998877'
      })

      // Wait a tick for async background sync handler
      await new Promise(r => setTimeout(r, 10))

      expect(cust._syncStatus).toBe('failed')
      expect(cust._syncError).toBe('Internal Server Error')
      
      const outboxEntry = store.syncOutbox.find(o => o.entityId === 'CUST-FAIL-01')
      expect(outboxEntry).toBeDefined()
      expect(outboxEntry.status).toBe('failed')
    })

    it('successfully rolls back failed mutation from local store', async () => {
      const cust = store.addCustomer({
        id: 'CUST-ROLLBACK-TEST',
        name: 'To Be Rolled Back',
        phone: '03001112233'
      })

      expect(store.customers.some(c => c.id === 'CUST-ROLLBACK-TEST')).toBe(true)

      const rolledBack = store.rollbackMutation('customer', 'CUST-ROLLBACK-TEST')
      expect(rolledBack).toBe(true)
      expect(store.customers.some(c => c.id === 'CUST-ROLLBACK-TEST')).toBe(false)
    })

    it('retries failed sync and updates status to synced on success', async () => {
      vi.spyOn(api.customers, 'create')
        .mockRejectedValueOnce(new ApiError('Transient failure', 503))
        .mockResolvedValueOnce({ ok: true, data: { id: 'CUST-RETRY-01' } })

      const cust = store.addCustomer({
        id: 'CUST-RETRY-01',
        name: 'Retry Customer',
        phone: '03005556677'
      })

      await new Promise(r => setTimeout(r, 10))
      expect(cust._syncStatus).toBe('failed')

      const retryRes = await store.retrySync('customer', 'CUST-RETRY-01')
      expect(retryRes.ok).toBe(true)
      expect(cust._syncStatus).toBe('synced')
    })
  })

  describe('7. Deduplication & Idempotent Store Mutations', () => {
    it('prevents duplicate customer additions and duplicate API requests', async () => {
      const apiSpy = vi.spyOn(api.customers, 'create').mockResolvedValue({
        ok: true,
        data: { id: 'CUST-DEDUP-01' }
      })

      const first = store.addCustomer({
        id: 'CUST-DEDUP-01',
        code: 'CUS-9999',
        name: 'Dedup Customer'
      })

      const second = store.addCustomer({
        id: 'CUST-DEDUP-01',
        code: 'CUS-9999',
        name: 'Dedup Customer Duplicate'
      })

      expect(first).toBe(second)
      expect(apiSpy).toHaveBeenCalledTimes(1)
      const matching = store.customers.filter(c => c.id === 'CUST-DEDUP-01')
      expect(matching).toHaveLength(1)
    })

    it('prevents duplicate quotation additions and duplicate API requests', async () => {
      const apiSpy = vi.spyOn(api.quotations, 'create').mockResolvedValue({
        ok: true,
        data: { id: 'QT-DEDUP-01' }
      })

      const first = store.addQuotation({
        id: 'QT-DEDUP-01',
        customer: 'Customer A',
        total: 'PKR 100,000'
      })

      const second = store.addQuotation({
        id: 'QT-DEDUP-01',
        customer: 'Customer A',
        total: 'PKR 100,000'
      })

      expect(first).toBe(second)
      expect(apiSpy).toHaveBeenCalledTimes(1)
      const matching = store.quotations.filter(q => q.id === 'QT-DEDUP-01')
      expect(matching).toHaveLength(1)
    })

    it('prevents duplicate order additions', async () => {
      const apiSpy = vi.spyOn(api.orders, 'create').mockResolvedValue({
        ok: true,
        data: { id: 'ORD-DEDUP-01' }
      })

      const first = store.addOrder({
        id: 'ORD-DEDUP-01',
        orderNo: 'ORD-DEDUP-01',
        customer: 'Customer B'
      })

      const second = store.addOrder({
        id: 'ORD-DEDUP-01',
        orderNo: 'ORD-DEDUP-01',
        customer: 'Customer B'
      })

      expect(first).toBe(second)
      expect(apiSpy).toHaveBeenCalledTimes(1)
      const matching = store.orders.filter(o => o.id === 'ORD-DEDUP-01')
      expect(matching).toHaveLength(1)
    })
  })
})

