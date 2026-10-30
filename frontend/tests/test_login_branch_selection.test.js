/**
 * AJ EcoDrive — Login Branch Selection & Demo Credentials Test Suite
 */
import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createRouter, createMemoryHistory } from 'vue-router';
import Login from '../src/views/auth/Login.vue';
import { store } from '../src/store.js';
import * as authModule from '../src/auth.js';

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/login', component: Login },
    { path: '/dashboard', component: { template: '<div>Dashboard</div>' } },
    { path: '/forgot-password', component: { template: '<div>Forgot Password</div>' } }
  ]
});

describe('Login.vue — Branch Selection & Credentials Auto-Fill', () => {
  let wrapper;

  beforeEach(async () => {
    router.push('/login');
    await router.isReady();

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
    });
  });

  it('renders all presentation demo branch accounts and guided-tour selectors', () => {
    expect(wrapper.exists()).toBe(true);

    // Tour selectors check
    const emailInput = wrapper.find('[data-tour="auth-email"]');
    const passwordInput = wrapper.find('[data-tour="auth-password"]');
    const submitBtn = wrapper.find('[data-tour="auth-submit"]');

    expect(emailInput.exists()).toBe(true);
    expect(passwordInput.exists()).toBe(true);
    expect(submitBtn.exists()).toBe(true);

    // Initial default values
    expect(emailInput.element.value).toBe('ADMIN');
    expect(passwordInput.element.value).toBe('password123');

    // Demo account buttons count (5 accounts)
    const text = wrapper.text();
    expect(text).toContain('Presentation Demo Credentials');
    expect(text).toContain('Super Admin');
    expect(text).toContain('Head Office');
    expect(text).toContain('Peshawar Showroom');
    expect(text).toContain('Islamabad Showroom');
    expect(text).toContain('Lahore Showroom');
    expect(text).toContain('Rawalpindi Showroom');
  });

  it('clicking Peshawar branch auto-fills PEW-01 and demo password', async () => {
    const buttons = wrapper.findAll('button[type="button"]');
    const pewButton = buttons.find(b => b.text().includes('PEW-01'));
    expect(pewButton).toBeDefined();

    await pewButton.trigger('click');

    const emailInput = wrapper.find('[data-tour="auth-email"]');
    const passwordInput = wrapper.find('[data-tour="auth-password"]');

    expect(emailInput.element.value).toBe('PEW-01');
    expect(passwordInput.element.value).toBe('password123');
    expect(pewButton.text()).toContain('Selected');
  });

  it('clicking Islamabad branch auto-fills ISB-01 and demo password', async () => {
    const buttons = wrapper.findAll('button[type="button"]');
    const isbButton = buttons.find(b => b.text().includes('ISB-01'));
    expect(isbButton).toBeDefined();

    await isbButton.trigger('click');

    const emailInput = wrapper.find('[data-tour="auth-email"]');
    const passwordInput = wrapper.find('[data-tour="auth-password"]');

    expect(emailInput.element.value).toBe('ISB-01');
    expect(passwordInput.element.value).toBe('password123');
    expect(isbButton.text()).toContain('Selected');
  });

  it('clicking Lahore branch auto-fills LHE-01 and demo password', async () => {
    const buttons = wrapper.findAll('button[type="button"]');
    const lheButton = buttons.find(b => b.text().includes('LHE-01'));
    expect(lheButton).toBeDefined();

    await lheButton.trigger('click');

    const emailInput = wrapper.find('[data-tour="auth-email"]');
    const passwordInput = wrapper.find('[data-tour="auth-password"]');

    expect(emailInput.element.value).toBe('LHE-01');
    expect(passwordInput.element.value).toBe('password123');
    expect(lheButton.text()).toContain('Selected');
  });

  it('clicking Rawalpindi branch auto-fills RWP-01 and demo password', async () => {
    const buttons = wrapper.findAll('button[type="button"]');
    const rwpButton = buttons.find(b => b.text().includes('RWP-01'));
    expect(rwpButton).toBeDefined();

    await rwpButton.trigger('click');

    const emailInput = wrapper.find('[data-tour="auth-email"]');
    const passwordInput = wrapper.find('[data-tour="auth-password"]');

    expect(emailInput.element.value).toBe('RWP-01');
    expect(passwordInput.element.value).toBe('password123');
    expect(rwpButton.text()).toContain('Selected');
  });

  it('clicking Super Admin branch auto-fills ADMIN and demo password', async () => {
    // Switch to another branch first
    const buttons = wrapper.findAll('button[type="button"]');
    const pewButton = buttons.find(b => b.text().includes('PEW-01'));
    await pewButton.trigger('click');

    // Switch back to ADMIN
    const adminButton = buttons.find(b => b.text().includes('ADMIN'));
    await adminButton.trigger('click');

    const emailInput = wrapper.find('[data-tour="auth-email"]');
    const passwordInput = wrapper.find('[data-tour="auth-password"]');

    expect(emailInput.element.value).toBe('ADMIN');
    expect(passwordInput.element.value).toBe('password123');
    expect(adminButton.text()).toContain('Selected');
  });

  it('form submission triggers authentication and routes to dashboard', async () => {
    const pushSpy = vi.spyOn(router, 'push');
    const authSpy = vi.spyOn(authModule, 'authenticateBranch').mockResolvedValueOnce({
      isAuthenticated: true,
      role: 'Super Admin',
      branchCode: 'ADMIN',
      token: 'mock-jwt-token'
    });
    const setSessionSpy = vi.spyOn(store, 'setSession');

    await wrapper.find('form').trigger('submit.prevent');

    expect(authSpy).toHaveBeenCalledWith('ADMIN', 'password123');
    expect(setSessionSpy).toHaveBeenCalled();
    expect(pushSpy).toHaveBeenCalledWith('/dashboard');
  });
});
