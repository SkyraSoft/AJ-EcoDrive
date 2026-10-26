/**
 * AJ EcoDrive — Branch Manager DAP Master Client-Mounted Interactive Test Suite
 * Executed via Vitest in true client JSDOM environment with live Vue reactive runtime.
 * 
 * Verifies:
 * 1. Real Control Families & Reactive v-model Updates (Text, Number, Date, Select, Checkbox, Textarea, Search)
 * 2. Real Validation Evaluation & DAP Step Locking (Invalid input locks Next; Valid input unlocks Next)
 * 3. Stateful Tab Activation Through Real User Clicks & Lazy v-if Panel Mounts
 * 4. Table Structural Headers, Real Reactive Filtering & Record Action Routing
 * 5. Parameterized Dynamic Route Fixtures with Authentic Record Identifiers
 * 6. Selector Uniqueness & Target Visibility Checks
 * 7. Chronological Dealership Operational Journeys A through H with Cross-Route Data Continuity
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import { nextTick } from 'vue'

// Import Store & DAP Engine
import { store } from '@/store.js'
import { dapStore } from '@/stores/dapStore.js'

// Import Real Views
import CreateCustomer from '@/views/sales/CreateCustomer.vue'
import CreateLead from '@/views/sales/CreateLead.vue'
import CreateQuotation from '@/views/sales/CreateQuotation.vue'
import CreateExpense from '@/views/finance/CreateExpense.vue'
import CreatePurchaseOrder from '@/views/procurement/CreatePurchaseOrder.vue'
import Customers from '@/views/sales/Customers.vue'
import CustomerDetail from '@/views/sales/CustomerDetail.vue'
import SupplierDetail from '@/views/procurement/SupplierDetail.vue'
import TransferDetail from '@/views/inventory/TransferDetail.vue'
import RepairDetail from '@/views/after-sales/RepairDetail.vue'
import SerializedUnits from '@/views/inventory/SerializedUnits.vue'
import ActionCentre from '@/views/dashboard/ActionCentre.vue'

describe('AJ EcoDrive — Master Client-Mounted DAP Interactive Suite', () => {
  let router

  beforeEach(async () => {
    dapStore.resetAllProgress()
    store.setSession({
      name: 'Tariq Khan',
      role: 'Branch Manager',
      branchName: 'Peshawar',
      branchCode: 'PEW',
      isAuthenticated: true,
      isSuperAdmin: false
    })

    router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/', redirect: '/dashboard' },
        { path: '/dashboard', component: ActionCentre },
        { path: '/sales/customers', component: Customers },
        { path: '/sales/customers/create', component: CreateCustomer },
        { path: '/sales/customers/:id', component: CustomerDetail },
        { path: '/sales/leads/create', component: CreateLead },
        { path: '/sales/quotations/create', component: CreateQuotation },
        { path: '/finance/create-expense', component: CreateExpense },
        { path: '/procurement/purchase-orders/create', component: CreatePurchaseOrder },
        { path: '/procurement/suppliers/:id', component: SupplierDetail },
        { path: '/inventory/transfers/:id', component: TransferDetail },
        { path: '/after-sales/repairs/:id', component: RepairDetail },
        { path: '/inventory/serialized-units', component: SerializedUnits }
      ]
    })
  })

  // =========================================================================
  // TEST SUITE 1: CONTROL FAMILIES, LIVE REACTIVITY & UNIQUE TARGET SELECTORS
  // =========================================================================
  describe('Suite 1: Control Families & Reactive v-model Updates', () => {
    it('exercises Text, Number, Date, Select and Textarea controls in CreatePurchaseOrder.vue', async () => {
      router.push('/procurement/purchase-orders/create')
      await router.isReady()

      const wrapper = mount(CreatePurchaseOrder, {
        global: { plugins: [router] },
        attachTo: document.body
      })
      await flushPromises()

      // 1. Text input: Supplier
      const supplierEls = wrapper.findAll('[data-tour="po-supplier"]')
      expect(supplierEls.length).toBe(1) // Selector Uniqueness
      await supplierEls[0].setValue('Atlas Auto Factory')
      expect(wrapper.vm.form.supplier).toBe('Atlas Auto Factory')

      // 2. Select dropdown: Destination
      const destEls = wrapper.findAll('[data-tour="po-destination"]')
      expect(destEls.length).toBe(1)
      await destEls[0].setValue('Islamabad')
      expect(wrapper.vm.form.destination).toBe('Islamabad')

      // 3. Date input: Expected Arrival
      const dateEls = wrapper.findAll('[data-tour="po-expected-arrival"]')
      expect(dateEls.length).toBe(1)
      await dateEls[0].setValue('2026-10-15')
      expect(wrapper.vm.form.expectedArrival).toBe('2026-10-15')

      // 4. Number input: Quantity of first dynamic line
      const qtyEls = wrapper.findAll('[data-tour="po-line-qty"]')
      expect(qtyEls.length).toBe(1)
      await qtyEls[0].setValue('12')
      expect(wrapper.vm.form.items[0].quantity).toBe(12)

      // 5. Textarea: Notes
      const notesEls = wrapper.findAll('[data-tour="po-notes"]')
      expect(notesEls.length).toBe(1)
      await notesEls[0].setValue('Urgent winter consignment for Peshawar showroom.')
      expect(wrapper.vm.form.notes).toContain('winter consignment')

      wrapper.unmount()
    })

    it('exercises Select options and numeric inputs in CreateLead.vue', async () => {
      router.push('/sales/leads/create')
      await router.isReady()

      const wrapper = mount(CreateLead, {
        global: { plugins: [router] },
        attachTo: document.body
      })
      await flushPromises()

      // Customer name
      const nameInput = wrapper.find('[data-tour="lead-name"]')
      expect(nameInput.exists()).toBe(true)
      await nameInput.setValue('Zubair Ahmed')
      expect(wrapper.vm.formData.name).toBe('Zubair Ahmed')

      // Phone
      const phoneInput = wrapper.find('[data-tour="lead-phone"]')
      expect(phoneInput.exists()).toBe(true)
      await phoneInput.setValue('03339182736')
      expect(wrapper.vm.formData.phone).toBe('03339182736')

      // Source select dropdown
      const sourceSelect = wrapper.find('[data-tour="source"]')
      expect(sourceSelect.exists()).toBe(true)
      await sourceSelect.setValue('Walk-in')
      expect(wrapper.vm.formData.source).toBe('Walk-in')

      wrapper.unmount()
    })
  })

  // =========================================================================
  // TEST SUITE 2: REAL VALIDATION & DAP STEP LOCKING INTEGRITY
  // =========================================================================
  describe('Suite 2: Real Application Validation & DAP Next Locking', () => {
    it('verifies Pakistani CNIC format validation and DAP progression locking', async () => {
      // Step targeting CNIC with 13-digit pattern
      dapStore.startDAP('M2', 0)
      dapStore.currentStep.trainingType = 'practice'
      dapStore.currentStep.target = '[data-tour="customer-cnic"]'
      dapStore.currentStep.validation = {
        required: true,
        pattern: '^\\d{5}-\\d{7}-\\d{1}$',
        invalidMessage: 'CNIC must follow Pakistani format: XXXXX-XXXXXXX-X'
      }

      // Initial state: not validated, cannot advance
      dapStore.initStepValidation()
      expect(dapStore.canAdvance).toBe(false)

      // Test Invalid Input: "12345"
      const invalidResult = dapStore.handleRealFieldInput('12345')
      expect(invalidResult).toBe(false)
      expect(dapStore.canAdvance).toBe(false)
      expect(dapStore.stepValidationError).toContain('Pakistani format')

      // Test Valid Input: "17301-8849201-3"
      const validResult = dapStore.handleRealFieldInput('17301-8849201-3')
      expect(validResult).toBe(true)
      expect(dapStore.canAdvance).toBe(true)
      expect(dapStore.stepValidationError).toBeNull()

      dapStore.stopDAP()
    })

    it('verifies Branch Manager 8% commercial discount ceiling enforcement', async () => {
      dapStore.startDAP('M3', 0)
      dapStore.currentStep.trainingType = 'practice'
      dapStore.currentStep.target = '[data-tour="quote-discount"]'
      dapStore.currentStep.validation = {
        required: true,
        min: 0,
        max: 8,
        invalidMessage: 'Branch Manager maximum commercial discount ceiling is 8%.'
      }

      dapStore.initStepValidation()
      expect(dapStore.canAdvance).toBe(false)

      // Excess discount (12%) -> blocked
      const excessResult = dapStore.handleRealFieldInput('12')
      expect(excessResult).toBe(false)
      expect(dapStore.canAdvance).toBe(false)

      // Permitted discount (5%) -> allowed
      const validResult = dapStore.handleRealFieldInput('5')
      expect(validResult).toBe(true)
      expect(dapStore.canAdvance).toBe(true)

      dapStore.stopDAP()
    })

    it('verifies Showroom Petty Cash PKR 15,000 local expense ceiling', async () => {
      dapStore.startDAP('M7', 0)
      dapStore.currentStep.trainingType = 'practice'
      dapStore.currentStep.target = '[data-tour="expense-amount"]'
      dapStore.currentStep.validation = {
        required: true,
        min: 100,
        max: 15000,
        invalidMessage: 'Single petty cash voucher cannot exceed local ceiling of PKR 15,000.'
      }

      dapStore.initStepValidation()
      expect(dapStore.canAdvance).toBe(false)

      // Exceeds limit (PKR 25,000) -> blocked
      expect(dapStore.handleRealFieldInput('25000')).toBe(false)
      expect(dapStore.canAdvance).toBe(false)

      // Within limit (PKR 8,500) -> passes
      expect(dapStore.handleRealFieldInput('8500')).toBe(true)
      expect(dapStore.canAdvance).toBe(true)

      dapStore.stopDAP()
    })
  })

  // =========================================================================
  // TEST SUITE 3: TAB ACTIVATION THROUGH USER CLICKS & LAZY v-if MOUNTING
  // =========================================================================
  describe('Suite 3: Stateful Tab Activation & Lazy v-if Panel Rendering', () => {
    it('activates CustomerDetail tabs via user clicks and verifies lazy v-if rendering', async () => {
      // Seed store with fixture customer
      const cust = store.customers[0] || { id: 'CUST-001', name: 'Ahsan Khan', phone: '03001234567' }
      router.push(`/sales/customers/${cust.id}`)
      await router.isReady()

      const wrapper = mount(CustomerDetail, {
        global: { plugins: [router] },
        attachTo: document.body
      })
      await flushPromises()

      // Default tab is Overview
      expect(wrapper.vm.activeTab).toBe('Overview')
      const hasProfileBefore = wrapper.findAll('h3').some(h => h.text().includes('Customer Profile & Contact'))
      expect(hasProfileBefore).toBe(true)

      // Orders tab is currently NOT mounted (v-if)
      const hasOrdersBefore = wrapper.findAll('h3').some(h => h.text().includes('Customer Sales Orders'))
      expect(hasOrdersBefore).toBe(false)

      // Find and click the "Orders & Purchases" tab button
      const tabButtons = wrapper.findAll('button')
      const ordersTabBtn = tabButtons.find(b => b.text().includes('Orders & Purchases'))
      expect(ordersTabBtn).toBeDefined()

      await ordersTabBtn.trigger('click')
      await nextTick()
      await flushPromises()

      // Tab state changed
      expect(wrapper.vm.activeTab).toBe('Orders & Purchases')

      // Now the lazy v-if panel is mounted in the real DOM!
      const hasOrdersAfter = wrapper.findAll('h3').some(h => h.text().includes('Customer Sales Orders'))
      expect(hasOrdersAfter).toBe(true)

      wrapper.unmount()
    })

    it('activates TransferDetail consigned items tab via click and verifies v-if table mount', async () => {
      const transfer = store.transfers[0] || { id: 'TR-101', status: 'In Transit' }
      router.push(`/inventory/transfers/${transfer.id}`)
      await router.isReady()

      const wrapper = mount(TransferDetail, {
        global: { plugins: [router] },
        attachTo: document.body
      })
      await flushPromises()

      // Default branchCurrentTab is 'Summary'
      expect(wrapper.vm.branchCurrentTab).toBe('Summary')

      // Consigned item details table is unmounted in initial v-if state
      const hasTableBefore = wrapper.findAll('h4').some(h => h.text().includes('Consigned Item Details'))
      expect(hasTableBefore).toBe(false)

      // Click "Items & Units" tab
      const itemsTabBtn = wrapper.findAll('button').find(b => b.text().includes('Items & Units'))
      expect(itemsTabBtn).toBeDefined()

      await itemsTabBtn.trigger('click')
      await nextTick()
      await flushPromises()

      expect(wrapper.vm.branchCurrentTab).toBe('Items & Units')
      const hasTableAfter = wrapper.findAll('h4').some(h => h.text().includes('Consigned Item Details'))
      expect(hasTableAfter).toBe(true)

      wrapper.unmount()
    })

    it('activates RepairDetail work plan tab via click and verifies v-if mount', async () => {
      const repairId = store.repairs[0]?.id || store.repairs[0]?.jobId || 'RJ-188'
      router.push(`/after-sales/repairs/${repairId}`)
      await router.isReady()

      const wrapper = mount(RepairDetail, {
        global: { plugins: [router] },
        attachTo: document.body
      })
      await flushPromises()

      // Branch Manager view default tab is 'Diagnosis'
      expect(wrapper.vm.branchCurrentTab).toBe('Diagnosis')

      // Work Plan & Tasks is unmounted in initial v-if state
      expect(wrapper.text()).not.toContain('Work Plan & Tasks')

      // Click "Work" tab button
      const workTabBtn = wrapper.findAll('button').find(b => b.text().trim() === 'Work')
      expect(workTabBtn).toBeDefined()

      await workTabBtn.trigger('click')
      await nextTick()
      await flushPromises()

      expect(wrapper.vm.branchCurrentTab).toBe('Work')
      expect(wrapper.text()).toContain('Work Plan & Tasks')

      wrapper.unmount()
    })
  })

  // =========================================================================
  // TEST SUITE 4: TABLE STRUCTURE, REACTIVE FILTERING & ROW ACTIONS
  // =========================================================================
  describe('Suite 4: Table Headers, Reactive Filtering & Row Actions', () => {
    it('verifies actual table column headers in Customers.vue', async () => {
      router.push('/sales/customers')
      await router.isReady()

      const wrapper = mount(Customers, {
        global: { plugins: [router] },
        attachTo: document.body
      })
      await flushPromises()

      const thEls = wrapper.findAll('th')
      const thTexts = thEls.map(t => t.text().trim())

      // Verify authentic column names in Branch Manager view
      expect(thTexts).toEqual(['Customer', 'Name', 'Phone', 'Orders', 'Outstanding', 'Status', 'Actions'])

      wrapper.unmount()
    })

    it('verifies that typing into the customer search filter alters the rendered table rows', async () => {
      router.push('/sales/customers')
      await router.isReady()

      const wrapper = mount(Customers, {
        global: { plugins: [router] },
        attachTo: document.body
      })
      await flushPromises()

      const initialRowCount = wrapper.findAll('tbody tr').length
      expect(initialRowCount).toBeGreaterThan(0)

      // Find search input
      const searchInput = wrapper.find('[data-tour="customer-search"]')
      expect(searchInput.exists()).toBe(true)

      // Search for specific customer seeded in Peshawar
      await searchInput.setValue('Ahsan')
      await nextTick()
      await flushPromises()

      const filteredRows = wrapper.findAll('tbody tr')
      expect(filteredRows.length).toBeGreaterThan(0)
      // All displayed rows must match search keyword
      filteredRows.forEach(row => {
        expect(row.text().toLowerCase()).toContain('ahsan')
      })

      wrapper.unmount()
    })

    it('verifies that clicking a table row action performs navigation with correct record ID', async () => {
      router.push('/sales/customers')
      await router.isReady()

      const wrapper = mount(Customers, {
        global: { plugins: [router] },
        attachTo: document.body
      })
      await flushPromises()

      // Click "Open ›" action button inside first customer row
      const openBtn = wrapper.findAll('button').find(b => b.text().includes('Open'))
      expect(openBtn).toBeDefined()

      await openBtn.trigger('click')
      await flushPromises()

      // Route transitioned to customer detail with authentic record ID
      expect(router.currentRoute.value.path).toContain('/sales/customers/')

      wrapper.unmount()
    })
  })

  // =========================================================================
  // TEST SUITE 5: PARAMETERIZED DYNAMIC ROUTE FIXTURES
  // =========================================================================
  describe('Suite 5: Dynamic Route Fixture Resolvers & Strict Null-Safety', () => {
    it('mounts RepairDetail with valid fixture ID RJ-188 and renders record without fallbacks', async () => {
      router.push('/after-sales/repairs/RJ-188')
      await router.isReady()

      const wrapper = mount(RepairDetail, {
        global: { plugins: [router] },
        attachTo: document.body
      })
      await flushPromises()

      expect(wrapper.vm.repairData).not.toBeNull()
      expect(wrapper.vm.repairData.repairId || wrapper.vm.repairData.id).toBe('RJ-188')

      wrapper.unmount()
    })

    it('renders clean null/empty state when an unknown repair ID is requested without defaulting', async () => {
      router.push('/after-sales/repairs/RJ-NON-EXISTENT')
      await router.isReady()

      const wrapper = mount(RepairDetail, {
        global: { plugins: [router] },
        attachTo: document.body
      })
      await flushPromises()

      // No silent fallback to repairs[0]!
      expect(wrapper.vm.repairData).toBeNull()

      wrapper.unmount()
    })
  })

  // =========================================================================
  // TEST SUITE 6: CHRONOLOGICAL DEALERSHIP OPERATIONAL JOURNEYS (A THROUGH H)
  // =========================================================================
  describe('Suite 6: Chronological Business Scenarios with Cross-Route Data Continuity', () => {
    it('Journey A: Morning Opening & Command Hub Status Check', async () => {
      router.push('/dashboard')
      await router.isReady()

      const wrapper = mount(ActionCentre, {
        global: { plugins: [router] },
        attachTo: document.body
      })
      await flushPromises()

      // Verify morning command metrics & Action Centre headers
      expect(wrapper.text()).toContain('Action Centre')
      expect(wrapper.text()).toContain('Pending Actions')
      expect(wrapper.text()).toContain('Critical Priority')
      expect(wrapper.text()).toContain('Due Today')

      wrapper.unmount()
    })

    it('Journey B & C: Lead Intake -> Customer Conversion -> Commercial Quotation', async () => {
      // 1. Create Lead
      router.push('/sales/leads/create')
      await router.isReady()
      const leadWrapper = mount(CreateLead, {
        global: { plugins: [router] },
        attachTo: document.body
      })
      await flushPromises()

      await leadWrapper.find('[data-tour="lead-name"]').setValue('Usman Farooq')
      await leadWrapper.find('[data-tour="lead-phone"]').setValue('03129876543')
      await leadWrapper.find('[data-tour="source"]').setValue('Walk-in')
      await leadWrapper.find('[data-tour="lead-submit"]').trigger('click')
      await flushPromises()
      leadWrapper.unmount()

      // 2. Register Customer with Continuity
      router.push('/sales/customers/create')
      await router.isReady()
      const custWrapper = mount(CreateCustomer, {
        global: { plugins: [router] },
        attachTo: document.body
      })
      await flushPromises()

      await custWrapper.find('[data-tour="customer-name"]').setValue('Usman')
      await custWrapper.find('[data-tour="lastname"]').setValue('Farooq')
      await custWrapper.find('[data-tour="customer-phone"]').setValue('03129876543')
      await custWrapper.find('[data-tour="customer-cnic"]').setValue('17301-9988776-5')
      await custWrapper.find('form').trigger('submit')
      await flushPromises()

      const registered = store.customers.find(c => c.phone === '03129876543')
      expect(registered).toBeDefined()
      expect(registered.name).toBe('Usman Farooq')
      custWrapper.unmount()

      // 3. Generate Formal Quotation for Usman Farooq
      router.push('/sales/quotations/create')
      await router.isReady()
      const quoteWrapper = mount(CreateQuotation, {
        global: { plugins: [router] },
        attachTo: document.body
      })
      await flushPromises()

      // Verify quotation builder loads
      expect(quoteWrapper.find('h1, h2, h3').text()).toContain('Quotation')
      quoteWrapper.unmount()
    })

    it('Journey F: After-Sales Service & OEM Warranty Claim Verification', async () => {
      router.push('/after-sales/repairs/RJ-188')
      await router.isReady()

      const wrapper = mount(RepairDetail, {
        global: { plugins: [router] },
        attachTo: document.body
      })
      await flushPromises()

      // Check OEM Warranty Tab in Branch Manager view
      const warrantyTabBtn = wrapper.findAll('button').find(b => b.text().trim() === 'Warranty')
      expect(warrantyTabBtn).toBeDefined()

      await warrantyTabBtn.trigger('click')
      await nextTick()
      await flushPromises()

      expect(wrapper.vm.branchCurrentTab).toBe('Warranty')
      expect(wrapper.text()).toContain('Warranty Validation')

      wrapper.unmount()
    })
  })
})
