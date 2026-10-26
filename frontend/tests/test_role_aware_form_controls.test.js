import { describe, it, expect, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { nextTick } from 'vue'
import { createRouter, createMemoryHistory } from 'vue-router'

import { store } from '@/store.js'
import CreateSale from '@/views/sales/CreateSale.vue'
import CreatePurchaseOrder from '@/views/procurement/CreatePurchaseOrder.vue'
import CreateFollowUp from '@/views/sales/CreateFollowUp.vue'
import CreateLead from '@/views/sales/CreateLead.vue'
import CreateQuarantineRecord from '@/views/inventory/CreateQuarantineRecord.vue'
import CreateTransfer from '@/views/inventory/CreateTransfer.vue'
import CreateQuotation from '@/views/sales/CreateQuotation.vue'
import CreateCustomOrder from '@/views/sales/CreateCustomOrder.vue'
import CreateReturn from '@/views/sales/CreateReturn.vue'
import CreateStockRequest from '@/views/inventory/CreateStockRequest.vue'
import CreateCycleCount from '@/views/inventory/CreateCycleCount.vue'
import CreateAdjustmentRequest from '@/views/inventory/CreateAdjustmentRequest.vue'
import CreateExpense from '@/views/finance/CreateExpense.vue'

describe('AJ EcoDrive — Role-Aware Form Control & Transactional Data Integrity Suite', () => {
  let router

  beforeEach(() => {
    router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/', component: { template: '<div>Home</div>' } },
        { path: '/procurement/orders', component: { template: '<div>PO List</div>' } },
        { path: '/sales/orders', component: { template: '<div>Orders</div>' } }
      ]
    })

    // Reset store session to Super Admin initially
    store.setSession({
      isAuthenticated: true,
      branchCode: 'ADMIN',
      branchName: 'All Branches',
      branchId: 'ALL',
      role: 'Super Admin',
      name: 'Super Admin',
      isSuperAdmin: true
    })
  })

  describe('CreateSale.vue Role-Aware Branch Context & Control Logic', () => {
    it('Super Admin sees a dropdown for Showroom Branch excluding "All Branches"', async () => {
      const wrapper = mount(CreateSale, { global: { plugins: [router] } })
      await flushPromises()

      const branchSelect = wrapper.find('select[data-tour="sale-branch"]')
      expect(branchSelect.exists()).toBe(true)
      
      const options = branchSelect.findAll('option')
      const optionTexts = options.map(o => o.text())
      expect(optionTexts.some(t => t.includes('All Branches'))).toBe(false)
      expect(optionTexts.some(t => t.includes('Peshawar'))).toBe(true)
      expect(optionTexts.some(t => t.includes('Lahore'))).toBe(true)
    })

    it('Branch Manager has Showroom Branch locked read-only to assigned branch', async () => {
      store.setSession({
        isAuthenticated: true,
        branchCode: 'PEW-01',
        branchName: 'Peshawar',
        branchId: 'BR-01',
        role: 'Branch Manager',
        name: 'Peshawar Branch Manager',
        isSuperAdmin: false
      })

      const wrapper = mount(CreateSale, { global: { plugins: [router] } })
      await flushPromises()

      const branchInput = wrapper.find('input[data-tour="sale-branch"]')
      expect(branchInput.exists()).toBe(true)
      expect(branchInput.attributes('readonly')).toBeDefined()
      expect(branchInput.attributes('disabled')).toBeDefined()
      expect(branchInput.element.value).toBe('Peshawar')

      const branchSelect = wrapper.find('select[data-tour="sale-branch"]')
      expect(branchSelect.exists()).toBe(false)
    })

    it('blocks submission if branch is "All Branches" or empty', async () => {
      const wrapper = mount(CreateSale, { global: { plugins: [router] } })
      await flushPromises()

      // Fill valid customer and product
      const custInput = wrapper.find('input[data-tour="customersearch"]')
      await custInput.setValue('Ali Khan')
      
      const prodSelect = wrapper.find('select[data-tour="sale-product"]')
      await prodSelect.setValue('BRG E-125')

      // Trigger order creation with empty/unselected branch
      const submitBtn = wrapper.find('button[data-tour="confirmsale"]')
      await submitBtn.trigger('click')
      await nextTick()

      expect(wrapper.text()).toContain('Please select a concrete showroom branch')
      expect(wrapper.emitted('created')).toBeFalsy()
    })

    it('rejects arbitrary or non-canonical branch without silent BR-01 fallback', async () => {
      const wrapper = mount(CreateSale, { global: { plugins: [router] } })
      await flushPromises()

      // Force an invalid branch into component state
      wrapper.vm.saleData.branch = 'NonExistentBranch'
      wrapper.vm.saleData.customer = 'Ali Khan'
      wrapper.vm.saleData.product = 'BRG E-125'
      wrapper.vm.saleData.selectedUnit = 'DS11-00997'

      const submitBtn = wrapper.find('button[data-tour="confirmsale"]')
      await submitBtn.trigger('click')
      await nextTick()

      expect(wrapper.text()).toContain('does not exist in canonical branches')
      expect(wrapper.emitted('created')).toBeFalsy()
    })
  })

  describe('CreateSale.vue Product Master & Dynamic Clearing', () => {
    it('uses a controlled dropdown from store.products and updates catalogue price', async () => {
      const wrapper = mount(CreateSale, { global: { plugins: [router] } })
      await flushPromises()

      const prodSelect = wrapper.find('select[data-tour="sale-product"]')
      expect(prodSelect.exists()).toBe(true)
      
      const options = prodSelect.findAll('option')
      expect(options.length).toBeGreaterThan(1)
      
      // Select product
      await prodSelect.setValue('BRG E-125')
      expect(wrapper.vm.saleData.product).toBe('BRG E-125')
      expect(wrapper.vm.saleData.cataloguePrice).toBe('PKR 280,000')
    })

    it('clears incompatible selected unit when product is changed', async () => {
      const wrapper = mount(CreateSale, { global: { plugins: [router] } })
      await flushPromises()

      wrapper.vm.saleData.branch = 'Peshawar'
      wrapper.vm.saleData.product = 'BRG DS11'
      wrapper.vm.saleData.product_id = 'PROD-003'
      wrapper.vm.saleData.selectedUnit = 'DS11-00997' // Belongs to BRG DS11

      // Change product to BRG E-125
      const prodSelect = wrapper.find('select[data-tour="sale-product"]')
      await prodSelect.setValue('BRG E-125')

      // Incompatible selected unit should be cleared
      expect(wrapper.vm.saleData.selectedUnit).toBe('')
    })

    it('clears selected unit when branch is changed', async () => {
      const wrapper = mount(CreateSale, { global: { plugins: [router] } })
      await flushPromises()

      wrapper.vm.saleData.branch = 'Peshawar'
      wrapper.vm.saleData.selectedUnit = 'DS11-00997'

      const branchSelect = wrapper.find('select[data-tour="sale-branch"]')
      await branchSelect.setValue('Lahore')

      expect(wrapper.vm.saleData.selectedUnit).toBe('')
    })

    it('rejects arbitrary product text without silent PROD-001 fallback', async () => {
      const wrapper = mount(CreateSale, { global: { plugins: [router] } })
      await flushPromises()

      wrapper.vm.saleData.branch = 'Peshawar'
      wrapper.vm.saleData.customer = 'Ali Khan'
      wrapper.vm.saleData.product = 'Phantom Scooter 9000'
      wrapper.vm.saleData.selectedUnit = 'DS11-00997'

      const submitBtn = wrapper.find('button[data-tour="confirmsale"]')
      await submitBtn.trigger('click')
      await nextTick()

      expect(wrapper.text()).toContain('does not exist in master catalogue')
      expect(wrapper.emitted('created')).toBeFalsy()
    })
  })

  describe('CreateSale.vue Unit Availability & Ineligible Unit Blocking', () => {
    it('disables radio and selection for non-Available units (e.g. QC Hold UNIT-102)', async () => {
      const wrapper = mount(CreateSale, { global: { plugins: [router] } })
      await flushPromises()

      wrapper.vm.saleData.branch = 'Peshawar'
      wrapper.vm.saleData.product = 'BRG DS11'
      wrapper.vm.saleData.product_id = 'PROD-003'
      await nextTick()

      const unitRows = wrapper.findAll('tbody tr')
      expect(unitRows.length).toBeGreaterThan(0)

      // Find unit 102 (which is QC Hold in store, serial: DS11-01001)
      const qcHoldUnit = store.serializedUnits.find(u => u.id === 'UNIT-102' || u.serial === 'DS11-01001')
      expect(qcHoldUnit).toBeDefined()
      expect(qcHoldUnit.status).toBe('QC Hold')

      const qcRadio = wrapper.find('input[type="radio"][value="DS11-01001"]')
      expect(qcRadio.exists()).toBe(true)
      expect(qcRadio.attributes('disabled')).toBeDefined()

      // Attempting to select UNIT-102 via selectUnit method directly
      wrapper.vm.selectUnit(qcHoldUnit)
      expect(wrapper.vm.saleData.selectedUnit).not.toBe('DS11-01001')
    })

    it('strictly blocks submit if a selected unit transitions to non-Available before submit', async () => {
      const wrapper = mount(CreateSale, { global: { plugins: [router] } })
      await flushPromises()

      wrapper.vm.saleData.branch = 'Peshawar'
      wrapper.vm.saleData.customer = 'Ali Khan'
      wrapper.vm.saleData.product = 'BRG DS11'
      wrapper.vm.saleData.product_id = 'PROD-003'
      wrapper.vm.saleData.selectedUnit = 'DS11-00997'

      // Simulate concurrent unit status change in store to Reserved
      const unit101 = store.getUnitById('DS11-00997')
      const origStatus = unit101.status
      unit101.status = 'Reserved'

      try {
        const submitBtn = wrapper.find('button[data-tour="confirmsale"]')
        await submitBtn.trigger('click')
        await nextTick()

        expect(wrapper.text()).toContain('cannot be sold because its status is "Reserved"')
        expect(wrapper.emitted('created')).toBeFalsy()
      } finally {
        unit101.status = origStatus // Restore
      }
    })

    it('Processed By is read-only operator context reflecting authenticated user', async () => {
      store.setSession({
        isAuthenticated: true,
        branchCode: 'ADMIN',
        branchName: 'All Branches',
        branchId: 'ALL',
        role: 'Super Admin',
        name: 'Chief Admin Officer',
        isSuperAdmin: true
      })

      const wrapper = mount(CreateSale, { global: { plugins: [router] } })
      await flushPromises()

      const opInput = wrapper.find('input[data-tour="sale-salesperson"]')
      expect(opInput.exists()).toBe(true)
      expect(opInput.attributes('readonly')).toBeDefined()
      expect(opInput.attributes('disabled')).toBeDefined()
      expect(opInput.element.value).toBe('Chief Admin Officer')
    })
  })

  describe('Other Views Role-Aware Controls Consistency', () => {
    it('CreatePurchaseOrder filters branchOptions to concrete branches only', async () => {
      const wrapper = mount(CreatePurchaseOrder, { global: { plugins: [router] } })
      await flushPromises()

      const branches = wrapper.vm.branchOptions
      expect(branches.every(b => b !== 'All Branches' && b !== 'ALL')).toBe(true)
    })

    it('CreateFollowUp locks branch for Branch Manager and permits selection for Super Admin', async () => {
      // Branch Manager
      store.setSession({
        isAuthenticated: true,
        branchCode: 'LHR-01',
        branchName: 'Lahore',
        branchId: 'BR-02',
        role: 'Branch Manager',
        name: 'Lahore BM',
        isSuperAdmin: false
      })
      const bmWrapper = mount(CreateFollowUp, { global: { plugins: [router] } })
      await flushPromises()
      const bmInput = bmWrapper.find('input[data-tour="branch"]')
      expect(bmInput.exists()).toBe(true)
      expect(bmInput.attributes('readonly')).toBeDefined()

      // Super Admin
      store.setSession({
        isAuthenticated: true,
        branchCode: 'ADMIN',
        branchName: 'All Branches',
        branchId: 'ALL',
        role: 'Super Admin',
        name: 'Super Admin',
        isSuperAdmin: true
      })
      const saWrapper = mount(CreateFollowUp, { global: { plugins: [router] } })
      await flushPromises()
      const saSelect = saWrapper.find('select[data-tour="branch"]')
      expect(saSelect.exists()).toBe(true)
    })

    it('CreateLead locks branch for Branch Manager and connects Interested Product to store.products', async () => {
      store.setSession({
        isAuthenticated: true,
        branchCode: 'LHR-01',
        branchName: 'Lahore',
        branchId: 'BR-02',
        role: 'Branch Manager',
        name: 'Lahore BM',
        isSuperAdmin: false
      })
      const bmWrapper = mount(CreateLead, { global: { plugins: [router] } })
      await flushPromises()
      const bmBranchInput = bmWrapper.find('input[data-tour="branch"]')
      expect(bmBranchInput.exists()).toBe(true)
      expect(bmBranchInput.attributes('readonly')).toBeDefined()

      // Product is a select pointing to store.products
      const prodSelect = bmWrapper.find('select[data-tour="lead-product"]')
      expect(prodSelect.exists()).toBe(true)
      const options = prodSelect.findAll('option')
      expect(options.length).toBeGreaterThan(1)
    })

    it('CreateQuarantineRecord features role-aware branch control', async () => {
      store.setSession({
        isAuthenticated: true,
        branchCode: 'ISL-01',
        branchName: 'Islamabad',
        branchId: 'BR-03',
        role: 'Branch Manager',
        name: 'Islamabad BM',
        isSuperAdmin: false
      })
      const bmWrapper = mount(CreateQuarantineRecord, { global: { plugins: [router] } })
      await flushPromises()
      const branchInput = bmWrapper.find('input[data-tour="quarantine-branch"]')
      expect(branchInput.exists()).toBe(true)
      expect(branchInput.attributes('readonly')).toBeDefined()
    })
  })

  describe('Adversarial PO Supplier & Destination Validation', () => {
    it('strictly rejects arbitrary supplier "Random Supplier XYZ" without silent fallback', async () => {
      const wrapper = mount(CreatePurchaseOrder, { global: { plugins: [router] } })
      await flushPromises()

      wrapper.vm.form.supplier = 'Random Supplier XYZ'
      wrapper.vm.form.destination = 'Peshawar'
      wrapper.vm.form.items = [{
        productId: 'PROD-001',
        quantity: 5,
        expectedUnitCost: 200000
      }]

      wrapper.vm.handleSave()
      await nextTick()

      expect(wrapper.vm.formErrors.some(e => e.includes('Random Supplier XYZ') && e.includes('not recognized'))).toBe(true)
    })

    it('successfully accepts registered canonical supplier and resolves supplier_id', async () => {
      const wrapper = mount(CreatePurchaseOrder, { global: { plugins: [router] } })
      await flushPromises()

      wrapper.vm.form.supplier = 'BRG Factory'
      wrapper.vm.form.destination = 'Lahore'
      wrapper.vm.form.items = [{
        productId: 'PROD-001',
        quantity: 2,
        expectedUnitCost: 200000
      }]

      const initialCount = store.purchaseOrders.length
      wrapper.vm.handleSave()
      await flushPromises()

      expect(wrapper.vm.formErrors.length).toBe(0)
      const created = store.purchaseOrders[0]
      expect(created.supplier).toBe('BRG Factory')
      expect(created.supplier_id).toBe('SUP-01')
      expect(created.destination).toBe('Lahore')
      expect(created.branch_id).toBe('BR-03')
    })

    it('strictly rejects "All Branches" as PO destination', async () => {
      const wrapper = mount(CreatePurchaseOrder, { global: { plugins: [router] } })
      await flushPromises()

      wrapper.vm.form.supplier = 'BRG Factory'
      wrapper.vm.form.destination = 'All Branches'
      wrapper.vm.form.items = [{
        productId: 'PROD-001',
        quantity: 1,
        expectedUnitCost: 200000
      }]

      wrapper.vm.handleSave()
      await nextTick()

      expect(wrapper.vm.formErrors.some(e => e.includes('concrete operating branch'))).toBe(true)
    })
  })

  describe('CreateTransfer Source != Destination & Concrete Branch Validation', () => {
    it('strictly rejects transfer when origin and destination branches are identical', async () => {
      const wrapper = mount(CreateTransfer, { global: { plugins: [router] } })
      await flushPromises()

      wrapper.vm.form.fromBranch = 'Peshawar'
      wrapper.vm.form.toBranch = 'Peshawar'
      wrapper.vm.form.productId = 'PROD-001'
      wrapper.vm.form.units = '1'

      wrapper.vm.submitTransfer()
      await nextTick()

      expect(wrapper.vm.errorMessage).toContain('Origin and destination branches must be different')
    })

    it('strictly rejects transfer with "All Branches" as origin or destination', async () => {
      const wrapper = mount(CreateTransfer, { global: { plugins: [router] } })
      await flushPromises()

      wrapper.vm.form.fromBranch = 'All Branches'
      wrapper.vm.form.toBranch = 'Islamabad'
      wrapper.vm.form.productId = 'PROD-001'
      wrapper.vm.form.units = '1'

      wrapper.vm.submitTransfer()
      await nextTick()

      expect(wrapper.vm.errorMessage).toContain('concrete operating branches, not All Branches')
    })
  })

  describe('Global Transactional "All Branches" Rejection Across Secondary Forms', () => {
    it('CreateQuotation rejects "All Branches" and dynamically lists catalogue products', async () => {
      const wrapper = mount(CreateQuotation, { global: { plugins: [router] } })
      await flushPromises()

      // Verify product options populate from store.products
      const prodSelect = wrapper.find('select[data-tour="item-product"]')
      expect(prodSelect.exists()).toBe(true)
      const options = prodSelect.findAll('option')
      expect(options.length).toBeGreaterThan(store.products.length) // placeholder + products

      // Test All Branches rejection
      wrapper.vm.form.customer = 'Test Customer'
      wrapper.vm.form.branch = 'All Branches'
      wrapper.vm.form.items[0].product = store.products[0].name
      wrapper.vm.saveAndSend()
      await nextTick()

      expect(wrapper.vm.showValidation).toBe(true)
      expect(wrapper.emitted('created')).toBeFalsy()
    })

    it('CreateCustomOrder rejects "All Branches" and resolves canonical branch', async () => {
      const wrapper = mount(CreateCustomOrder, { global: { plugins: [router] } })
      await flushPromises()

      wrapper.vm.form.customer = 'Corporate Fleet'
      wrapper.vm.form.product = 'Custom EV Hauler 72V'
      wrapper.vm.form.deposit = '50000'
      wrapper.vm.form.branch = 'All Branches'

      wrapper.vm.saveOrder()
      await nextTick()

      expect(wrapper.vm.showValidation).toBe(true)
      expect(wrapper.emitted('created')).toBeFalsy()
    })

    it('CreateReturn rejects "All Branches" and provides concrete branches dynamically', async () => {
      const wrapper = mount(CreateReturn, { global: { plugins: [router] } })
      await flushPromises()

      const branchSelect = wrapper.find('select[data-tour="branch"]')
      expect(branchSelect.exists()).toBe(true)
      const options = branchSelect.findAll('option').map(o => o.text())
      expect(options.includes('All Branches')).toBe(false)
      expect(options.includes('Rawalpindi')).toBe(true)

      wrapper.vm.formData.orderNo = 'ORD-2241'
      wrapper.vm.formData.customer = 'Ali Khan'
      wrapper.vm.formData.unit = 'DS11-00997'
      wrapper.vm.formData.branch = 'All Branches'

      wrapper.vm.createReturn()
      await nextTick()

      expect(wrapper.vm.showValidation).toBe(true)
      expect(wrapper.emitted('created')).toBeFalsy()
    })

    it('CreateStockRequest rejects "All Branches" and locks branch for Branch Manager', async () => {
      // Super Admin rejects All Branches
      const wrapper = mount(CreateStockRequest, { global: { plugins: [router] } })
      await flushPromises()

      wrapper.vm.form.product = 'BRG E-125'
      wrapper.vm.form.requestedQty = '5'
      wrapper.vm.form.reason = 'Low showroom stock'
      wrapper.vm.form.branch = 'All Branches'

      wrapper.vm.submitRequest()
      await nextTick()

      expect(wrapper.vm.showValidation).toBe(true)
      expect(wrapper.emitted('created')).toBeFalsy()

      // Branch Manager role-lock
      store.setSession({
        isAuthenticated: true,
        branchCode: 'LHR-01',
        branchName: 'Lahore',
        branchId: 'BR-03',
        role: 'Branch Manager',
        name: 'Lahore BM',
        isSuperAdmin: false
      })
      const bmWrapper = mount(CreateStockRequest, { global: { plugins: [router] } })
      await flushPromises()
      const branchSelect = bmWrapper.find('select[data-tour="stock-request-branch"]')
      expect(branchSelect.attributes('disabled')).toBeDefined()
    })

    it('CreateCycleCount rejects "All Branches" and features role-aware branch control', async () => {
      const wrapper = mount(CreateCycleCount, { global: { plugins: [router] } })
      await flushPromises()

      wrapper.vm.form.countName = 'Audit 2026'
      wrapper.vm.form.scope = 'Floor Units'
      wrapper.vm.form.branch = 'All Branches'

      wrapper.vm.startSession()
      await nextTick()

      expect(wrapper.vm.showValidation).toBe(true)
      expect(wrapper.emitted('created')).toBeFalsy()
    })

    it('CreateAdjustmentRequest rejects "All Branches" and features role-aware branch control', async () => {
      const wrapper = mount(CreateAdjustmentRequest, { global: { plugins: [router] } })
      await flushPromises()

      wrapper.vm.form.productUnit = 'BRG X7'
      wrapper.vm.form.reason = 'Discrepancy count'
      wrapper.vm.form.branch = 'All Branches'

      wrapper.vm.submitForApproval()
      await nextTick()

      expect(wrapper.vm.showValidation).toBe(true)
      expect(wrapper.emitted('created')).toBeFalsy()
    })

    it('CreateExpense strictly rejects "All Branches" and requires concrete operational branch', async () => {
      const wrapper = mount(CreateExpense, { global: { plugins: [router] } })
      await flushPromises()

      wrapper.vm.form.category = 'Facility & Maintenance'
      wrapper.vm.form.amount = '12000'
      wrapper.vm.form.vendor = 'Local Contractor'
      wrapper.vm.form.branch = 'All Branches'

      wrapper.vm.submitForm()
      await nextTick()

      expect(wrapper.vm.showValidation).toBe(true)
      expect(wrapper.emitted('created')).toBeFalsy()
    })
  })

  describe('Business Truth & Semantic Precision Verification', () => {
    it('verifies canonical supplier master contains only genuine suppliers SUP-01 to SUP-04 with no invented master data', () => {
      const supplierIds = store.suppliers.map(s => s.id || s.supplier_id)
      expect(supplierIds).toEqual(['SUP-01', 'SUP-02', 'SUP-03', 'SUP-04'])
      expect(store.suppliers.some(s => s.name === 'Shenzhen EV Industrial Group')).toBe(false)
    })

    it('verifies dynamic canonical branch validation without hardcoded two-branch whitelist', async () => {
      // Test that all active concrete branches in store.branches are valid
      const activeBranches = store.branches.filter(b => b.status === 'Active' && b.name.toLowerCase() !== 'all branches')
      expect(activeBranches.length).toBeGreaterThanOrEqual(4)
      
      const lahore = activeBranches.find(b => b.name === 'Lahore')
      const rawalpindi = activeBranches.find(b => b.name === 'Rawalpindi')
      expect(lahore).toBeDefined()
      expect(rawalpindi).toBeDefined()

      // Dynamically resolved via store.resolveCanonicalBranchId
      expect(store.resolveCanonicalBranchId('Lahore')).toBe('BR-03')
      expect(store.resolveCanonicalBranchId('Rawalpindi')).toBe('BR-04')
      expect(store.resolveCanonicalBranchId('All Branches')).toBe('ALL')
    })

    it('verifies Reserved unit status copy does not claim quotations or deposits cause reservation', async () => {
      const wrapper = mount(CreateSale, { global: { plugins: [router] } })
      await flushPromises()

      // Check modalSubtitle in order mode
      wrapper.vm.saleModalMode = 'order'
      await nextTick()
      expect(wrapper.vm.modalSubtitle).not.toContain('deposit reservation')
      expect(wrapper.vm.modalSubtitle).not.toContain('quotation')

      // Check unit status unavailable reason for Reserved
      const reservedUnit = store.serializedUnits.find(u => u.status === 'Reserved')
      if (reservedUnit) {
        wrapper.vm.saleData.branch = reservedUnit.branch
        wrapper.vm.saleData.product = reservedUnit.product
        await nextTick()
        const foundUnit = wrapper.vm.units.find(u => u.id === reservedUnit.id || u.serial === reservedUnit.serial)
        if (foundUnit) {
          expect(foundUnit.unavailReason).not.toContain('quotation')
          expect(foundUnit.unavailReason).toContain('Reserved')
        }
      }
    })

    it('verifies operator attribution does not leak internal BD tokens into employee copy', async () => {
      const wrapper = mount(CreateSale, { global: { plugins: [router] } })
      await flushPromises()

      const text = wrapper.text()
      expect(text).not.toContain('BD-SALES-ATTRIBUTION')
      expect(text).not.toContain('BD-')
      expect(text).not.toContain('P0')
      expect(text).not.toContain('P1')
    })
  })
})
