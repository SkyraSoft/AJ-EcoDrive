/**
 * AJ EcoDrive — Login Security & Client Invariant Test Suite
 *
 * Verifies strict production security posture:
 * 1. Login input fields are strictly empty on initial render.
 * 2. No presentation demo credential box or 1-click buttons are rendered.
 * 3. No default, demo, or real passwords appear anywhere in rendered HTML.
 * 4. Invalid credentials show an explicit authentication error, never a network/unreachable error.
 * 5. User-supplied credentials route to dashboard upon successful authentication.
 */
import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createRouter, createMemoryHistory } from 'vue-router'
import Login from '../src/views/auth/Login.vue'
import { store } from '../src/store.js'
import * as authModule from '../src/auth.js'
import { ApiError } from '../src/services/api.js'

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/login', component: Login },
    { path: '/dashboard', component: { template: '<div>Dashboard</div>' } },
    { path: '/forgot-password', component: { template: '<div>Forgot Password</div>' } }
  ]
})

describe('Login.vue — Production Security Posture & Authentication Error Handling', () => {
  let wrapper

  beforeEach(async () => {
    vi.restoreAllMocks()
    router.push('/login')
    await router.isReady()

    wrapper = mount(Login, {
      global: {
        plugins: [router],
        provide: {
          store
        },
        stubs: {
          'RouterLink': true
        }
      }
    })
  })

  it('1. Login fields are strictly empty on initial render', () => {
    expect(wrapper.exists()).toBe(true)

    const emailInput = wrapper.find('[data-tour="auth-email"]')
    const passwordInput = wrapper.find('[data-tour="auth-password"]')
    const submitBtn = wrapper.find('[data-tour="auth-submit"]')

    expect(emailInput.exists()).toBe(true)
    expect(passwordInput.exists()).toBe(true)
    expect(submitBtn.exists()).toBe(true)

    // Security check: Must NOT pre-fill any credentials
    expect(emailInput.element.value).toBe('')
    expect(passwordInput.element.value).toBe('')
  })

  it('2. No presentation demo credential box, badge, or 1-click auto-fill buttons are rendered', () => {
    const text = wrapper.text()
    expect(text).not.toContain('Presentation & Tester Credentials')
    expect(text).not.toContain('1-click auto-fill')
    expect(text).not.toContain('Universal Demo Password')
    expect(text).not.toContain('demoAccounts')

    // Confirm no pre-configured branch role quick-fill buttons exist
    const buttons = wrapper.findAll('button[type="button"]')
    const quickFillBtn = buttons.find(b => b.text().includes('Head Office') || b.text().includes('Peshawar Showroom'))
    expect(quickFillBtn).toBeUndefined()
  })

  it('3. No passwords appear in rendered HTML or client markup', () => {
    const html = wrapper.html()
    expect(html).not.toContain('password123')
    expect(html).not.toContain('Skyrasoft@2233')
    expect(html).not.toContain('Universal Demo Password')
  })

  it('4. Invalid credentials show an explicit authentication error, NOT a network/backend unreachable error', async () => {
    vi.spyOn(authModule, 'authenticateBranch').mockRejectedValueOnce(
      new ApiError('Invalid username/email or password', 401, 'INVALID_CREDENTIALS')
    )

    const emailInput = wrapper.find('[data-tour="auth-email"]')
    const passwordInput = wrapper.find('[data-tour="auth-password"]')

    await emailInput.setValue('admin')
    await passwordInput.setValue('wrongpassword')
    await wrapper.find('form').trigger('submit.prevent')

    // Wait for async handler
    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 50))

    const text = wrapper.text()
    expect(text).toContain('Invalid username/branch code or password')
    expect(text).not.toContain('Backend API server unreachable')
  })

  it('5. Successful authentication passes user-entered credentials and navigates to dashboard', async () => {
    const pushSpy = vi.spyOn(router, 'push')
    const authSpy = vi.spyOn(authModule, 'authenticateBranch').mockResolvedValueOnce({
      isAuthenticated: true,
      role: 'Super Admin',
      branchCode: 'ADMIN',
      token: 'mock-jwt-token'
    })
    vi.spyOn(store, 'setSession').mockImplementation(() => {})

    const emailInput = wrapper.find('[data-tour="auth-email"]')
    const passwordInput = wrapper.find('[data-tour="auth-password"]')

    await emailInput.setValue('my-admin-user')
    await passwordInput.setValue('MySecureP@ssw0rd2026!')

    await wrapper.find('form').trigger('submit.prevent')
    await wrapper.vm.$nextTick()

    expect(authSpy).toHaveBeenCalledWith('my-admin-user', 'MySecureP@ssw0rd2026!')
    expect(pushSpy).toHaveBeenCalledWith('/dashboard')
  })
})
