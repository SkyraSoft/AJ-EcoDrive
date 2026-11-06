/**
 * AJ EcoDrive — Login Error Handling, Health Retries & Production UX Verification Suite
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import Login from '../src/views/auth/Login.vue'
import { store } from '../src/store.js'
import { api, ApiError } from '../src/services/api.js'
import * as authModule from '../src/auth.js'

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/login', component: Login },
    { path: '/dashboard', component: { template: '<div>Dashboard</div>' } },
    { path: '/forgot-password', component: { template: '<div>Forgot Password</div>' } }
  ]
})

describe('Login Error Handling & API Connectivity Suite', () => {
  beforeEach(async () => {
    vi.restoreAllMocks()
    router.push('/login')
    await router.isReady()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('1. ApiError Classification & Message Formatting', () => {
    it('categorizes 401 as authentication error and formats message correctly', () => {
      const err = new ApiError('Unauthorized', 401)
      expect(err.isAuthError).toBe(true)
      expect(err.isOffline).toBe(false)
      expect(err.getUserFriendlyMessage()).toBe('Invalid username/branch code or password. Please verify your credentials and try again.')
    })

    it('categorizes 403 as forbidden error and formats message correctly', () => {
      const err = new ApiError('Forbidden', 403, { message: 'Your account is disabled.' })
      expect(err.isForbidden).toBe(true)
      expect(err.isOffline).toBe(false)
      expect(err.getUserFriendlyMessage()).toBe('Your account is disabled.')
    })

    it('categorizes 429 as rate limited error and formats message correctly', () => {
      const err = new ApiError('Too Many Requests', 429)
      expect(err.isRateLimited).toBe(true)
      expect(err.isOffline).toBe(false)
      expect(err.getUserFriendlyMessage()).toContain('Too many attempts')
    })

    it('categorizes 500/502/503 as server error and formats message correctly', () => {
      const err500 = new ApiError('Internal Error', 500)
      const err502 = new ApiError('Bad Gateway', 502)
      expect(err500.isServerError).toBe(true)
      expect(err502.isServerError).toBe(true)
      expect(err500.getUserFriendlyMessage()).toBe('Backend service problem (HTTP 500). Please try again later.')
      expect(err502.getUserFriendlyMessage()).toBe('Backend service problem (HTTP 502). Please try again later.')
    })

    it('categorizes status 0 / network failure as offline/unreachable', () => {
      const err = new ApiError('Failed to fetch', 0, null, true)
      expect(err.isOffline).toBe(true)
      expect(err.getUserFriendlyMessage()).toContain('Backend cannot be reached')
    })
  })

  describe('2. api.checkHealthWithRetry Resilience', () => {
    it('succeeds on first attempt when backend health is 200', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ ok: true, status: 'healthy' })
      })

      const res = await api.checkHealthWithRetry({ timeoutMs: 15000, maxRetries: 2, retryDelayMs: 10 })
      expect(res.ok).toBe(true)
      expect(res.attempts).toBe(1)
      expect(res.data.status).toBe('healthy')
    })

    it('retries up to 2 times on initial failure and recovers', async () => {
      vi.spyOn(globalThis, 'fetch')
        .mockRejectedValueOnce(new TypeError('Failed to fetch'))
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          headers: new Headers({ 'content-type': 'application/json' }),
          json: async () => ({ ok: true, status: 'healthy' })
        })

      const res = await api.checkHealthWithRetry({ timeoutMs: 15000, maxRetries: 2, retryDelayMs: 10 })
      expect(res.ok).toBe(true)
      expect(res.attempts).toBe(2)
    })

    it('does not throw when all retries fail, returning clean error envelope', async () => {
      vi.spyOn(globalThis, 'fetch').mockRejectedValue(new TypeError('Failed to fetch'))

      const res = await api.checkHealthWithRetry({ timeoutMs: 15000, maxRetries: 2, retryDelayMs: 10 })
      expect(res.ok).toBe(false)
      expect(res.attempts).toBe(3)
      expect(res.error).toBeDefined()
    })
  })

  describe('3. authenticateBranch Username Normalization', () => {
    it('normalizes uppercase ADMIN to lowercase admin when calling backend API', async () => {
      const loginSpy = vi.spyOn(api.auth, 'login').mockResolvedValueOnce({
        token: 'test-token',
        user: { id: 'usr-1', username: 'admin', role: 'Super Admin' }
      })

      await authModule.authenticateBranch('ADMIN', 'Secret123')
      expect(loginSpy).toHaveBeenCalledWith({
        username: 'admin',
        password: 'Secret123'
      })
    })

    it('normalizes PEW-01 to lowercase pew-01 when calling backend API', async () => {
      const loginSpy = vi.spyOn(api.auth, 'login').mockResolvedValueOnce({
        token: 'test-token',
        user: { id: 'usr-2', username: 'pew-01', role: 'Branch Manager', branch_id: 'BR-01' }
      })

      await authModule.authenticateBranch('PEW-01', 'Secret123')
      expect(loginSpy).toHaveBeenCalledWith({
        username: 'pew-01',
        password: 'Secret123'
      })
    })

    it('re-throws ApiError preserving HTTP status code', async () => {
      vi.spyOn(api.auth, 'login').mockRejectedValueOnce(new ApiError('Invalid credentials', 401))

      try {
        await authModule.authenticateBranch('admin', 'wrongpass')
        expect.fail('Should have thrown')
      } catch (err) {
        expect(err.status).toBe(401)
        expect(err.isOffline).toBe(false)
      }
    })
  })

  describe('4. Login.vue Error Display Separation', () => {
    const mountLogin = () => {
      return mount(Login, {
        global: {
          plugins: [router],
          provide: { store },
          stubs: { RouterLink: true }
        }
      })
    }

    it('displays 401 error message and NEVER "Backend API server unreachable"', async () => {
      vi.spyOn(authModule, 'authenticateBranch').mockRejectedValueOnce(
        new ApiError('Invalid username/email or password', 401)
      )

      const wrapper = mountLogin()
      await wrapper.find('form').trigger('submit.prevent')
      await flushPromises()

      const text = wrapper.text()
      expect(text).toContain('Invalid username/branch code or password')
      expect(text).not.toContain('Backend API server unreachable')
      expect(text).not.toContain('Backend cannot be reached')
    })

    it('displays 403 error message when account is disabled or unauthorized', async () => {
      vi.spyOn(authModule, 'authenticateBranch').mockRejectedValueOnce(
        new ApiError('Account suspended', 403, { message: 'Your account is currently inactive or suspended.' })
      )

      const wrapper = mountLogin()
      await wrapper.find('form').trigger('submit.prevent')
      await flushPromises()

      const text = wrapper.text()
      expect(text).toContain('Your account is currently inactive or suspended')
      expect(text).not.toContain('Backend API server unreachable')
    })

    it('displays 429 rate limit message when too many requests occur', async () => {
      vi.spyOn(authModule, 'authenticateBranch').mockRejectedValueOnce(
        new ApiError('Too many requests', 429)
      )

      const wrapper = mountLogin()
      await wrapper.find('form').trigger('submit.prevent')
      await flushPromises()

      const text = wrapper.text()
      expect(text).toContain('Too many login attempts')
    })

    it('displays 500 server error message when backend fails', async () => {
      vi.spyOn(authModule, 'authenticateBranch').mockRejectedValueOnce(
        new ApiError('Internal Error', 500)
      )

      const wrapper = mountLogin()
      await wrapper.find('form').trigger('submit.prevent')
      await flushPromises()

      const text = wrapper.text()
      expect(text).toContain('Backend service problem (HTTP 500)')
    })

    it('displays unreachable message ONLY on actual network / CORS / timeout error', async () => {
      vi.spyOn(authModule, 'authenticateBranch').mockRejectedValueOnce(
        new ApiError('Failed to fetch', 0, null, true)
      )

      const wrapper = mountLogin()
      await wrapper.find('form').trigger('submit.prevent')
      await flushPromises()

      const text = wrapper.text()
      expect(text).toContain('Backend cannot be reached')
    })
  })
})
