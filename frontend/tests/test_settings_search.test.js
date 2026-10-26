import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import SettingsSearch from '../src/components/common/SettingsSearch.vue'
import MainLayout from '../src/layouts/MainLayout.vue'
import { store } from '../src/store.js'
import { resolveTarget } from '../src/tour/targetResolver.js'
import { TARGET_STATES } from '../src/tour/targetRegistry.js'

describe('Global Settings Search Control Test Suite', () => {
  let router

  beforeEach(() => {
    router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/', redirect: '/dashboard' },
        { path: '/dashboard', component: { template: '<div>Dashboard</div>' } },
        { path: '/organisation/users', component: { template: '<div>Users</div>' } },
        { path: '/organisation/roles', component: { template: '<div>Roles</div>' } },
        { path: '/organisation/branches', component: { template: '<div>Branches</div>' } },
        { path: '/system/settings', component: { template: '<div>Settings</div>' } },
        { path: '/system/security', component: { template: '<div>Security</div>' } },
        { path: '/system/account', component: { template: '<div>Account</div>' } },
        { path: '/system/preferences', component: { template: '<div>Preferences</div>' } },
        { path: '/system/audit-log', component: { template: '<div>Audit Log</div>' } },
        { path: '/system/branch-team', component: { template: '<div>Branch Team</div>' } },
        { path: '/catalogue/pricing', component: { template: '<div>Pricing</div>' } },
        { path: '/communication/notifications', component: { template: '<div>Notifications</div>' } },
        { path: '/after-sales/warranty', component: { template: '<div>Warranty</div>' } }
      ]
    })

    // Reset default user to Super Admin
    store.currentUser = {
      id: 'USR-SA-01',
      name: 'Super Admin User',
      role: 'Super Admin',
      branchName: 'Head Office',
      branchId: null,
      isAuthenticated: true
    }
  })

  // 1. Search Result Matching
  describe('1. Search Result Matching', () => {
    it('matches settings by core search terms', async () => {
      const wrapper = mount(SettingsSearch, {
        global: { plugins: [router] }
      })

      const testTerms = [
        { term: 'Users', expectedTitle: 'Users & Access' },
        { term: 'Roles', expectedTitle: 'Roles & Permissions' },
        { term: 'Branches', expectedTitle: 'Dealership Branches' },
        { term: 'Notifications', expectedRoute: '/communication/notifications' },
        { term: 'Organisation', expectedRoute: '/system/settings' },
        { term: 'Catalogue', expectedRoute: '/system/settings' },
        { term: 'Pricing', expectedRoute: '/system/settings' },
        { term: 'Inventory', expectedRoute: '/system/settings' },
        { term: 'Finance', expectedRoute: '/system/settings' },
        { term: 'Service', expectedRoute: '/after-sales/warranty' },
        { term: 'Audit', expectedRoute: '/system/audit-log' }
      ]

      for (const { term, expectedTitle, expectedRoute } of testTerms) {
        wrapper.vm.query = term
        await wrapper.vm.$nextTick()
        const results = wrapper.vm.filteredResults
        expect(results.length, `Expected matches for term "${term}"`).toBeGreaterThan(0)
        if (expectedTitle) {
          const match = results.some(r => r.title.includes(expectedTitle))
          expect(match, `Expected to find title "${expectedTitle}" for term "${term}"`).toBe(true)
        }
        if (expectedRoute) {
          const match = results.some(r => r.route === expectedRoute)
          expect(match, `Expected to find route "${expectedRoute}" for term "${term}"`).toBe(true)
        }
      }
    })

    it('matches settings by synonyms (MFA, 2FA, password, branch user, theme)', async () => {
      const wrapper = mount(SettingsSearch, {
        global: { plugins: [router] }
      })

      // MFA -> Security & Sessions / MFA or Security Policy
      wrapper.vm.query = 'MFA'
      await wrapper.vm.$nextTick()
      let mfaResults = wrapper.vm.filteredResults
      expect(mfaResults.some(r => r.title.includes('MFA'))).toBe(true)

      // 2FA -> Multi-Factor Authentication
      wrapper.vm.query = '2FA'
      await wrapper.vm.$nextTick()
      let twoFaResults = wrapper.vm.filteredResults
      expect(twoFaResults.some(r => r.synonyms.includes('2fa'))).toBe(true)

      // password -> Security Policy & Password Constraints
      wrapper.vm.query = 'password'
      await wrapper.vm.$nextTick()
      let pwdResults = wrapper.vm.filteredResults
      expect(pwdResults.some(r => r.title.includes('Security Policy') || r.title.includes('MFA'))).toBe(true)

      // branch user -> Users & Access / Branch Team
      wrapper.vm.query = 'branch user'
      await wrapper.vm.$nextTick()
      let userResults = wrapper.vm.filteredResults
      expect(userResults.some(r => r.title.includes('Users & Access') || r.title.includes('Branch Team'))).toBe(true)

      // theme -> Preferences
      wrapper.vm.query = 'theme'
      await wrapper.vm.$nextTick()
      let themeResults = wrapper.vm.filteredResults
      expect(themeResults.some(r => r.title.includes('Preferences'))).toBe(true)
    })

    it('each result displays title, description, and breadcrumb path', async () => {
      const wrapper = mount(SettingsSearch, {
        global: { plugins: [router] }
      })

      wrapper.vm.query = 'Security'
      wrapper.vm.isOpen = true
      await wrapper.vm.$nextTick()

      const html = wrapper.html()
      expect(html).toContain('System → Settings → Security')
      expect(html).toContain('Security Policy &amp; Password Constraints')
      expect(html).toContain('Global mandatory MFA enforcement')
    })
  })

  // 2. Role Filtering
  describe('2. Role-Aware Filtering (Super Admin vs Branch Manager)', () => {
    it('Super Admin sees full suite of system settings and configuration tabs', async () => {
      store.currentUser = {
        role: 'Super Admin',
        name: 'Head Office SA',
        branchId: null
      }

      const wrapper = mount(SettingsSearch, {
        global: { plugins: [router] }
      })

      const all = wrapper.vm.accessibleSettings
      expect(all.length).toBeGreaterThanOrEqual(20)

      // Super Admin sees /system/settings tabs
      expect(all.some(s => s.route === '/system/settings' && s.tab === 'Pricing Rules')).toBe(true)
      expect(all.some(s => s.route === '/system/settings' && s.tab === 'Security')).toBe(true)
      expect(all.some(s => s.route === '/system/security')).toBe(true)
      expect(all.some(s => s.route === '/organisation/roles')).toBe(true)
      expect(all.some(s => s.route === '/catalogue/pricing')).toBe(true)
    })

    it('Branch Manager ONLY sees BM-accessible settings and NEVER Super Admin only settings', async () => {
      store.currentUser = {
        role: 'Branch Manager',
        name: 'Peshawar BM',
        branchName: 'Peshawar',
        branchId: 'BR-01'
      }

      const wrapper = mount(SettingsSearch, {
        global: { plugins: [router] }
      })

      const bmSettings = wrapper.vm.accessibleSettings

      // Inaccessible SA-only routes must NEVER be in BM results
      expect(bmSettings.some(s => s.route === '/system/settings')).toBe(false)
      expect(bmSettings.some(s => s.route === '/system/security')).toBe(false)
      expect(bmSettings.some(s => s.route === '/organisation/roles')).toBe(false)
      expect(bmSettings.some(s => s.route === '/catalogue/pricing')).toBe(false)

      // Permitted settings MUST be accessible to BM
      expect(bmSettings.some(s => s.route === '/system/account')).toBe(true)
      expect(bmSettings.some(s => s.route === '/system/preferences')).toBe(true)
      expect(bmSettings.some(s => s.route === '/system/branch-team')).toBe(true)
      expect(bmSettings.some(s => s.route === '/system/audit-log')).toBe(true)
      expect(bmSettings.some(s => s.route === '/organisation/users')).toBe(true)
      expect(bmSettings.some(s => s.route === '/organisation/branches')).toBe(true)
      expect(bmSettings.some(s => s.route === '/communication/notifications')).toBe(true)
      expect(bmSettings.some(s => s.route === '/after-sales/warranty')).toBe(true)
    })
  })

  // 3. Navigation to Normal Settings Route
  describe('3. Navigation to Normal Settings Route', () => {
    it('navigates cleanly to standard settings route without tab', async () => {
      const pushSpy = vi.spyOn(router, 'push')
      const wrapper = mount(SettingsSearch, {
        global: { plugins: [router] }
      })

      const targetItem = wrapper.vm.accessibleSettings.find(s => s.route === '/organisation/users')
      wrapper.vm.selectSetting(targetItem)

      expect(pushSpy).toHaveBeenCalledWith({
        path: '/organisation/users',
        query: {}
      })
    })
  })

  // 4. Navigation to Settings Tab & Section
  describe('4. Navigation to Settings Tab & Section', () => {
    it('navigates to /system/settings with tab and section query params', async () => {
      const pushSpy = vi.spyOn(router, 'push')
      const wrapper = mount(SettingsSearch, {
        global: { plugins: [router] }
      })

      const pricingItem = wrapper.vm.accessibleSettings.find(s => s.tab === 'Pricing Rules')
      wrapper.vm.selectSetting(pricingItem)

      expect(pushSpy).toHaveBeenCalledWith({
        path: '/system/settings',
        query: {
          tab: 'Pricing Rules',
          section: 'section-pricing-rules'
        }
      })
    })
  })

  // 5. Empty State
  describe('5. Empty State', () => {
    it('shows exact message "No matching settings found." when query has no results', async () => {
      const wrapper = mount(SettingsSearch, {
        global: { plugins: [router] }
      })

      wrapper.vm.query = 'xyzNonExistentSetting999'
      wrapper.vm.isOpen = true
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.filteredResults.length).toBe(0)
      expect(wrapper.html()).toContain('No matching settings found.')
    })
  })

  // 6. Keyboard Navigation & Outside Click
  describe('6. Keyboard Navigation & Interaction', () => {
    it('handles typing, ArrowDown, ArrowUp, Enter, and Escape', async () => {
      const pushSpy = vi.spyOn(router, 'push')
      const wrapper = mount(SettingsSearch, {
        global: { plugins: [router] }
      })

      const input = wrapper.find('input')
      await input.setValue('Users')
      expect(wrapper.vm.isOpen).toBe(true)
      expect(wrapper.vm.selectedIndex).toBe(0)

      // Arrow Down moves to index 1
      await input.trigger('keydown', { key: 'ArrowDown' })
      expect(wrapper.vm.selectedIndex).toBe(1)

      // Arrow Up moves back to index 0
      await input.trigger('keydown', { key: 'ArrowUp' })
      expect(wrapper.vm.selectedIndex).toBe(0)

      // Enter selects active index
      const expectedItem = wrapper.vm.filteredResults[0]
      await input.trigger('keydown', { key: 'Enter' })
      expect(pushSpy).toHaveBeenCalledWith(expect.objectContaining({ path: expectedItem.route }))
      expect(wrapper.vm.isOpen).toBe(false)

      // Reopen and test Escape
      await input.setValue('Roles')
      expect(wrapper.vm.isOpen).toBe(true)
      await input.trigger('keydown', { key: 'Escape' })
      expect(wrapper.vm.isOpen).toBe(false)
    })

    it('clicking outside closes the results dropdown', async () => {
      const wrapper = mount(SettingsSearch, {
        attachTo: document.body,
        global: { plugins: [router] }
      })

      const input = wrapper.find('input')
      await input.setValue('Pricing')
      expect(wrapper.vm.isOpen).toBe(true)

      // Simulate mousedown outside component
      const outsideEl = document.createElement('div')
      document.body.appendChild(outsideEl)
      outsideEl.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))

      await wrapper.vm.$nextTick()
      expect(wrapper.vm.isOpen).toBe(false)

      wrapper.unmount()
      document.body.removeChild(outsideEl)
    })
  })

  // 7. Tour Target Resolution & Semantic Tagging
  describe('7. Tour Target Resolution & Legacy Removal', () => {
    it('resolves semantic tour target [data-tour-id="shared.header.settings-search"] in DOM', () => {
      const wrapper = mount(SettingsSearch, {
        attachTo: document.body,
        global: { plugins: [router] }
      })

      const inputEl = document.querySelector('[data-tour-id="shared.header.settings-search"]')
      expect(inputEl).not.toBeNull()
      expect(inputEl.getAttribute('placeholder')).toBe('Search settings...')

      // Target resolver finds element
      const res = resolveTarget('shared.header.settings-search')
      expect(res.element).toBe(inputEl)

      wrapper.unmount()
    })

    it('verifies MainLayout has SettingsSearch mounted with placeholder "Search settings..." and no legacy attribute', () => {
      const wrapper = mount(MainLayout, {
        global: {
          plugins: [router],
          stubs: {
            RouterView: true,
            RouterLink: true,
            GuidedDAPEngine: true,
            CreateSaleModal: true,
            CreateLeadModal: true,
            CreateQuotationModal: true,
            CreatePaymentModal: true,
            CreateCustomerModal: true,
            CreateExpenseModal: true,
            CreateStockRequestModal: true,
            CreateTransferModal: true,
            CreateCaseModal: true,
            CreatePurchaseOrderModal: true
          }
        }
      })

      const html = wrapper.html()
      // Placeholder verified
      expect(html).toContain('placeholder="Search settings..."')

      // Old product search placeholder must be removed
      expect(html).not.toContain('Search products...')
      expect(html).not.toContain('Search within')

      // Misleading tour attribute must be removed
      expect(html).not.toContain('isbranchuser-search-within-user-branchname-branch')

      // Semantic tour target must be present
      expect(wrapper.find('[data-tour-id="shared.header.settings-search"]').exists()).toBe(true)
    })
  })
})
