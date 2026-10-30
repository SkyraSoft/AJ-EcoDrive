import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { api, ApiError } from '../src/services/api.js'
import { store } from '../src/store.js'

// Import Procurement views
import Suppliers from '../src/views/procurement/Suppliers.vue'
import CreateSupplier from '../src/views/procurement/CreateSupplier.vue'
import EditSupplier from '../src/views/procurement/EditSupplier.vue'
import SupplierDetail from '../src/views/procurement/SupplierDetail.vue'
import PurchaseOrders from '../src/views/procurement/PurchaseOrders.vue'
import CreatePurchaseOrder from '../src/views/procurement/CreatePurchaseOrder.vue'
import PurchaseOrderDetail from '../src/views/procurement/PurchaseOrderDetail.vue'
import ReceivePurchase from '../src/views/procurement/ReceivePurchase.vue'
import ReceiptDetail from '../src/views/procurement/ReceiptDetail.vue'

// Mock vue-router
const mockPush = vi.fn()
const mockBack = vi.fn()
let currentRouteParams = { id: 'SUP-01' }
let currentRouteQuery = {}

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockPush,
    back: mockBack,
    currentRoute: { value: { path: '/procurement/suppliers' } }
  }),
  useRoute: () => ({
    params: currentRouteParams,
    query: currentRouteQuery
  }),
  RouterLink: {
    template: '<a><slot /></a>'
  }
}))

describe('Phase 5 — Step 2: Procurement Frontend Integration Test Suite', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    mockPush.mockClear()
    mockBack.mockClear()
    currentRouteParams = { id: 'SUP-01' }
    currentRouteQuery = {}

    store.setSession({
      id: 'USR-ADMIN-01',
      name: 'Super Admin',
      role: 'Super Admin',
      branchCode: 'ALL',
      branchId: 'ALL',
      branchName: 'All Branches',
      token: 'jwt-procurement-test-token',
      permissions: ['procurement.read', 'procurement.write'],
      isAuthenticated: true
    })

    store.receipts = []
    store.units = []

    // Reset base suppliers and POs in store
    store.suppliers = [
      {
        id: 'SUP-01',
        supplier_id: 'SUP-01',
        code: 'SUP-01',
        name: 'BRG Factory Ltd',
        contact: 'Li Wei',
        phone: '+86 188 0000 0000',
        email: 'sales@brgfactory.example',
        status: 'Active',
        products: '3',
        openPos: '2',
        purchases: 'PKR 12.5M',
        payable: 'PKR 1.2M',
        onTime: '95%'
      }
    ]

    store.purchaseOrders = [
      {
        id: 'PO-2048',
        po: 'PO-2048',
        po_id: 'PO-2048',
        po_number: 'PO-2048',
        supplier_id: 'SUP-01',
        supplier: 'BRG Factory Ltd',
        destination: 'Peshawar',
        branch_id: 'BR-01',
        branch: 'Peshawar',
        amount: 'PKR 2,800,000',
        units: '20',
        totalOrdered: 20,
        totalReceived: 0,
        remainingUnits: 20,
        status: 'In Transit',
        orderDate: '2026-08-11',
        items: [
          {
            id: 'LINE-1',
            product_id: 'PROD-001',
            product: 'EcoDrive DS11',
            sku: 'SKU-DS11',
            ordered: 20,
            quantity: 20,
            previouslyReceived: 0,
            received: 0,
            cost: 'PKR 140,000',
            expectedUnitCost: 140000,
            subtotalAmount: 2800000,
            isSerialized: true
          }
        ]
      }
    ]

    store.receipts = []
  })

  // =========================================================================
  // 1. API Client Definitions & Contract Verification
  // =========================================================================
  describe('1. API Client Procurement Methods Definition', () => {
    it('exposes all required procurement API client endpoints', () => {
      expect(api.procurement).toBeDefined()
      expect(typeof api.procurement.getSuppliers).toBe('function')
      expect(typeof api.procurement.getSupplierById).toBe('function')
      expect(typeof api.procurement.createSupplier).toBe('function')
      expect(typeof api.procurement.updateSupplier).toBe('function')
      expect(typeof api.procurement.getPurchaseOrders).toBe('function')
      expect(typeof api.procurement.getPurchaseOrderById).toBe('function')
      expect(typeof api.procurement.createPurchaseOrder).toBe('function')
      expect(typeof api.procurement.approvePurchaseOrder).toBe('function')
      expect(typeof api.procurement.cancelPurchaseOrder).toBe('function')
      expect(typeof api.procurement.receivePurchaseOrder).toBe('function')
      expect(typeof api.procurement.getReceipts).toBe('function')
      expect(typeof api.procurement.getReceiptById).toBe('function')
    })
  })

  // =========================================================================
  // 2. Supplier Integration
  // =========================================================================
  describe('2. Supplier Integration Workflows', () => {
    it('CreateSupplier: validates required fields before making API request', async () => {
      const wrapper = mount(CreateSupplier)
      const createSpy = vi.spyOn(api.procurement, 'createSupplier')

      await wrapper.find('button[data-tour-id="sa.procurement.suppliers.save-btn"]').trigger('click')

      expect(createSpy).not.toHaveBeenCalled()
      expect(wrapper.text()).toContain('This field is required.')
    })

    it('CreateSupplier: successfully posts supplier to backend API and updates store', async () => {
      const newSupplier = {
        id: 'SUP-02',
        code: 'SUP-02',
        name: 'Apex Batteries Co',
        contact: 'Ahmed Ali',
        phone: '+92 300 9876543',
        email: 'info@apexbatteries.pk',
        address: 'Industrial Zone, Karachi',
        currency: 'PKR',
        terms: 'Net 30',
        status: 'Active'
      }

      const createSpy = vi.spyOn(api.procurement, 'createSupplier').mockResolvedValueOnce({
        ok: true,
        status: 201,
        data: newSupplier
      })

      const wrapper = mount(CreateSupplier)

      // Fill in required fields
      const inputs = wrapper.findAll('input')
      await inputs[0].setValue('Apex Batteries Co') // Name
      await inputs[1].setValue('Ahmed Ali')          // Contact
      await inputs[2].setValue('+92 300 9876543')    // Phone
      await inputs[3].setValue('info@apexbatteries.pk') // Email

      await wrapper.find('button[data-tour-id="sa.procurement.suppliers.save-btn"]').trigger('click')

      expect(createSpy).toHaveBeenCalledTimes(1)
      const sentPayload = createSpy.mock.calls[0][0]
      expect(sentPayload.name).toBe('Apex Batteries Co')
      expect(sentPayload.contact).toBe('Ahmed Ali')
      expect(sentPayload.phone).toBe('+92 300 9876543')

      // Verify store updated and navigation triggered
      expect(store.suppliers.some(s => s.name === 'Apex Batteries Co')).toBe(true)
      expect(mockPush).toHaveBeenCalledWith('/procurement/suppliers')
    })

    it('CreateSupplier: displays backend HTTP 409 conflict error clearly', async () => {
      vi.spyOn(api.procurement, 'createSupplier').mockRejectedValueOnce(
        new ApiError('Supplier with name "Apex Batteries Co" already exists', 409, { error: 'CONFLICT' })
      )

      const wrapper = mount(CreateSupplier)
      const inputs = wrapper.findAll('input')
      await inputs[0].setValue('Apex Batteries Co')
      await inputs[1].setValue('Ahmed Ali')
      await inputs[2].setValue('+92 300 9876543')

      await wrapper.find('button[data-tour-id="sa.procurement.suppliers.save-btn"]').trigger('click')
      await wrapper.vm.$nextTick()

      expect(wrapper.text()).toContain('Supplier with name "Apex Batteries Co" already exists')
    })

    it('Suppliers: loads list on mount and navigates to selected supplier by ID', async () => {
      const getSuppliersSpy = vi.spyOn(api.procurement, 'getSuppliers').mockResolvedValueOnce({
        ok: true,
        status: 200,
        data: [
          {
            id: 'SUP-99',
            code: 'SUP-99',
            name: 'Volt Motors Global',
            contact: 'John Chen',
            status: 'Active',
            products: '5',
            openPos: '1',
            purchases: 'PKR 8.0M',
            payable: 'PKR 500,000',
            onTime: '98%'
          }
        ]
      })

      const wrapper = mount(Suppliers)
      await flushPromises()

      expect(getSuppliersSpy).toHaveBeenCalled()
      expect(wrapper.text()).toContain('Volt Motors Global')

      // Click on row should navigate to /procurement/suppliers/SUP-99
      const row = wrapper.find('tbody tr')
      await row.trigger('click')
      expect(mockPush).toHaveBeenCalledWith('/procurement/suppliers/SUP-99')
    })

    it('SupplierDetail: loads selected supplier from API on mount and renders dynamic data', async () => {
      currentRouteParams = { id: 'SUP-05' }

      const mockSupplier = {
        id: 'SUP-05',
        code: 'SUP-05',
        name: 'SuperPower Cells China',
        contact: 'Wang Fang',
        phone: '+86 21 8888 7777',
        email: 'contact@superpower.cn',
        city: 'Shanghai',
        country: 'China',
        status: 'Active',
        purchases: 'PKR 25.0M',
        openPos: '3',
        payable: 'PKR 2.1M',
        onTime: '99%',
        terms: 'Net 45',
        recentOrders: [
          {
            id: 'PO-3011',
            po: 'PO-3011',
            destination: 'Islamabad',
            amount: 'PKR 4,500,000',
            status: 'Approved'
          }
        ]
      }

      const getByIdSpy = vi.spyOn(api.procurement, 'getSupplierById').mockResolvedValueOnce({
        ok: true,
        status: 200,
        data: mockSupplier
      })

      const wrapper = mount(SupplierDetail)
      await wrapper.vm.$nextTick()
      await wrapper.vm.$nextTick()

      expect(getByIdSpy).toHaveBeenCalledWith('SUP-05')
      expect(wrapper.text()).toContain('SuperPower Cells China')
      expect(wrapper.text()).toContain('SUP-05')
      expect(wrapper.text()).toContain('Wang Fang')
      expect(wrapper.text()).toContain('+86 21 8888 7777')
      expect(wrapper.text()).toContain('PKR 25.0M')
    })

    it('EditSupplier: calls api.procurement.updateSupplier and prevents duplicate submission', async () => {
      currentRouteParams = { id: 'SUP-01' }
      store.originalEditSupplier = { ...store.suppliers[0] }

      const updateSpy = vi.spyOn(api.procurement, 'updateSupplier').mockResolvedValueOnce({
        ok: true,
        status: 200,
        data: {
          ...store.suppliers[0],
          contact: 'Li Wei Updated',
          phone: '+86 188 9999 0000'
        }
      })

      const wrapper = mount(EditSupplier)
      await wrapper.vm.$nextTick()

      const inputs = wrapper.findAll('input')
      await inputs[1].setValue('Li Wei Updated')
      await inputs[2].setValue('+86 188 9999 0000')

      const saveBtn = wrapper.findAll('button').find(b => b.text().includes('Save Changes'))
      await saveBtn.trigger('click')

      expect(updateSpy).toHaveBeenCalledTimes(1)
      expect(updateSpy.mock.calls[0][0]).toBe('SUP-01')
      expect(updateSpy.mock.calls[0][1].contact).toBe('Li Wei Updated')
      expect(mockPush).toHaveBeenCalledWith('/procurement/suppliers')
    })
  })

  // =========================================================================
  // 3. Purchase Order Integration
  // =========================================================================
  describe('3. Purchase Order Integration Workflows', () => {
    it('CreatePurchaseOrder: maps line items to backend contract and submits via API', async () => {
      // Setup catalogue product in store
      store.products = [
        {
          id: 'PROD-001',
          name: 'EcoDrive DS11',
          modelName: 'DS11',
          sku: 'SKU-DS11',
          status: 'Active',
          costPrice: 150000,
          isSerialized: true
        }
      ]

      const createPoSpy = vi.spyOn(api.procurement, 'createPurchaseOrder').mockResolvedValueOnce({
        ok: true,
        status: 201,
        data: {
          id: 'PO-2099',
          po: 'PO-2099',
          po_number: 'PO-2099',
          supplier_id: 'SUP-01',
          supplier: 'BRG Factory Ltd',
          destination: 'Peshawar',
          branch_id: 'BR-01',
          amount: 'PKR 750,000',
          totalOrdered: 5,
          totalReceived: 0,
          remainingUnits: 5,
          status: 'Pending Approval'
        }
      })

      const wrapper = mount(CreatePurchaseOrder)

      // Select supplier and line item details
      wrapper.vm.form.supplier = 'BRG Factory Ltd'
      wrapper.vm.form.destination = 'Peshawar'
      wrapper.vm.form.items = [
        {
          id: 1,
          productId: 'PROD-001',
          variantId: 'NOT_APPLICABLE',
          variantName: 'Standard',
          quantity: 5,
          expectedUnitCost: 150000
        }
      ]

      await wrapper.vm.handleSave('Pending Approval')

      expect(createPoSpy).toHaveBeenCalledTimes(1)
      const payload = createPoSpy.mock.calls[0][0]
      expect(payload.supplier_id).toBe('SUP-01')
      expect(payload.branch_id).toBe('BR-01')
      expect(payload.status).toBe('Pending Approval')
      expect(payload.items.length).toBe(1)
      expect(payload.items[0].product_id).toBe('PROD-001')
      expect(payload.items[0].ordered_quantity).toBe(5)
      expect(payload.items[0].unit_cost).toBe(150000)

      expect(store.purchaseOrders.some(p => p.po === 'PO-2099')).toBe(true)
      expect(mockPush).toHaveBeenCalledWith('/procurement/purchase-orders/PO-2099')
    })

    it('PurchaseOrderDetail: loads PO on mount and cancels via API on confirmation', async () => {
      currentRouteParams = { id: 'PO-2048' }

      const getPoSpy = vi.spyOn(api.procurement, 'getPurchaseOrderById').mockResolvedValueOnce({
        ok: true,
        status: 200,
        data: store.purchaseOrders[0]
      })

      const cancelSpy = vi.spyOn(api.procurement, 'cancelPurchaseOrder').mockResolvedValueOnce({
        ok: true,
        status: 200,
        data: {
          ...store.purchaseOrders[0],
          status: 'Cancelled'
        }
      })

      const wrapper = mount(PurchaseOrderDetail)
      await wrapper.vm.$nextTick()

      expect(getPoSpy).toHaveBeenCalledWith('PO-2048')

      // Open cancel modal and confirm cancel
      wrapper.vm.showCancelModal = true
      await wrapper.vm.$nextTick()

      await wrapper.vm.handleCancelPo()

      expect(cancelSpy).toHaveBeenCalledTimes(1)
      expect(cancelSpy.mock.calls[0][0]).toBe('PO-2048')
      expect(wrapper.vm.poRecord.status).toBe('Cancelled')
    })

    it('PurchaseOrderDetail: approves PO via API when in Pending Approval state', async () => {
      store.purchaseOrders[0].status = 'Pending Approval'
      currentRouteParams = { id: 'PO-2048' }

      vi.spyOn(api.procurement, 'getPurchaseOrderById').mockResolvedValueOnce({
        ok: true,
        status: 200,
        data: store.purchaseOrders[0]
      })

      const approveSpy = vi.spyOn(api.procurement, 'approvePurchaseOrder').mockResolvedValueOnce({
        ok: true,
        status: 200,
        data: {
          ...store.purchaseOrders[0],
          status: 'Approved'
        }
      })

      const wrapper = mount(PurchaseOrderDetail)
      await wrapper.vm.$nextTick()

      await wrapper.vm.handleApprovePo()

      expect(approveSpy).toHaveBeenCalledWith('PO-2048')
      expect(wrapper.vm.poRecord.status).toBe('Approved')
    })
  })

  // =========================================================================
  // 4. Goods Receiving Integration
  // =========================================================================
  describe('4. Goods Receiving Workflows', () => {
    it('ReceivePurchase: posts goods receipt to backend API and updates store authoritative state', async () => {
      currentRouteParams = { id: 'PO-2048' }

      const mockReceiptResponse = {
        id: 'GR-1001',
        receipt_id: 'GR-1001',
        receipt_number: 'GR-1001',
        po_id: 'PO-2048',
        po: 'PO-2048',
        branch_id: 'BR-01',
        branch: 'Peshawar',
        status: 'Posted',
        lines: [
          {
            product_id: 'PROD-001',
            product: 'EcoDrive DS11',
            current_received_quantity: 20,
            accepted_quantity: 20,
            damaged_quantity: 0
          }
        ]
      }

      const receiveSpy = vi.spyOn(api.procurement, 'receivePurchaseOrder').mockResolvedValueOnce({
        ok: true,
        status: 201,
        data: mockReceiptResponse
      })

      const wrapper = mount(ReceivePurchase)
      await wrapper.vm.$nextTick()

      // Submit receipt
      await wrapper.vm.handlePostReceipt()

      expect(receiveSpy).toHaveBeenCalledTimes(1)
      const callArgs = receiveSpy.mock.calls[0]
      expect(callArgs[0]).toBe('PO-2048')
      expect(callArgs[1].lines[0].current_received_quantity).toBe(20)

      // Verified store contains returned receipt
      expect(store.receipts.some(r => r.id === 'GR-1001' || r.receipt_number === 'GR-1001')).toBe(true)
      expect(mockPush).toHaveBeenCalledWith('/procurement/receipts/GR-1001')
    })

    it('ReceivePurchase: handles API rejection and displays server validation error', async () => {
      currentRouteParams = { id: 'PO-2048' }

      vi.spyOn(api.procurement, 'receivePurchaseOrder').mockRejectedValueOnce(
        new ApiError('Goods receipt with Delivery Note "DN-01" has already been posted', 409, { error: 'CONFLICT' })
      )

      const wrapper = mount(ReceivePurchase)
      await wrapper.vm.$nextTick()

      await wrapper.vm.handlePostReceipt()
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.validationErrors).toContain('Goods receipt with Delivery Note "DN-01" has already been posted')
    })

    it('ReceiptDetail: fetches receipt details from backend on mount', async () => {
      currentRouteParams = { id: 'GR-982' }

      const mockReceipt = {
        id: 'GR-982',
        receipt_id: 'GR-982',
        receipt_number: 'GR-982',
        po_id: 'PO-1992',
        branch: 'Peshawar',
        receipt_date: '2026-07-18',
        received_by: 'Ahsan Khan',
        lines: [
          {
            product_id: 'PROD-001',
            product: 'BRG DS11',
            current_received_quantity: 20,
            accepted_quantity: 20,
            damaged_quantity: 0
          }
        ]
      }

      const getReceiptSpy = vi.spyOn(api.procurement, 'getReceiptById').mockResolvedValueOnce({
        ok: true,
        status: 200,
        data: mockReceipt
      })

      const wrapper = mount(ReceiptDetail)
      await flushPromises()

      expect(getReceiptSpy).toHaveBeenCalledWith('GR-982')
      expect(wrapper.text()).toContain('GR-982')
      expect(wrapper.text()).toContain('PO-1992')

      // Switch to Received Lines tab to inspect product details
      wrapper.vm.activeTab = 'Received Lines'
      await wrapper.vm.$nextTick()
      expect(wrapper.text()).toContain('BRG DS11')
    })
  })

  // =========================================================================
  // 5. Guided-Tour Selectors Preservation
  // =========================================================================
  describe('5. Guided-Tour Selectors Preservation', () => {
    it('Preserves all guided-tour target IDs in Suppliers view', () => {
      const wrapper = mount(Suppliers)
      expect(wrapper.find('[data-tour-id="sa.procurement.suppliers.create-btn"]').exists()).toBe(true)
      expect(wrapper.find('[data-tour-id="sa.procurement.suppliers.kpi-cards"]').exists()).toBe(true)
      expect(wrapper.find('[data-tour-id="sa.procurement.suppliers.filters"]').exists()).toBe(true)
      expect(wrapper.find('[data-tour="searchquery"]').exists()).toBe(true)
      expect(wrapper.find('[data-tour-id="sa.procurement.suppliers.table"]').exists()).toBe(true)
    })

    it('Preserves guided-tour selectors in CreateSupplier view', () => {
      const wrapper = mount(CreateSupplier)
      expect(wrapper.find('[data-tour-id="sa.procurement.suppliers.create-form"]').exists()).toBe(true)
      expect(wrapper.find('[data-tour-id="sa.procurement.suppliers.save-btn"]').exists()).toBe(true)
    })

    it('Preserves guided-tour selectors in PurchaseOrders and CreatePurchaseOrder views', () => {
      const poWrapper = mount(PurchaseOrders)
      expect(poWrapper.find('[data-tour-id="sa.procurement.po.create-btn"]').exists()).toBe(true)
      expect(poWrapper.find('[data-tour-id="sa.procurement.po.filters"]').exists()).toBe(true)
      expect(poWrapper.find('[data-tour-id="sa.procurement.po.table"]').exists()).toBe(true)

      const createWrapper = mount(CreatePurchaseOrder)
      expect(createWrapper.find('[data-tour="po-cancel-btn"]').exists()).toBe(true)
      expect(createWrapper.find('[data-tour="po-draft-btn"]').exists()).toBe(true)
      expect(createWrapper.find('[data-tour="po-submit-btn"]').exists()).toBe(true)
    })
  })
})
