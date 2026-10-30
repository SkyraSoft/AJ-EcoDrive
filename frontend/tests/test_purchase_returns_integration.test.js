import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { api, ApiError } from '../src/services/api.js'
import { store } from '../src/store.js'

import CreatePurchaseReturn from '../src/views/procurement/CreatePurchaseReturn.vue'
import PurchaseReturns from '../src/views/procurement/PurchaseReturns.vue'
import PurchaseReturnDetail from '../src/views/procurement/PurchaseReturnDetail.vue'

// Mock vue-router
const mockPush = vi.fn()
const mockBack = vi.fn()
let currentRouteParams = { id: 'PRTN-001' }
let currentRouteQuery = {}

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockPush,
    back: mockBack,
    currentRoute: { value: { path: '/procurement/returns' } }
  }),
  useRoute: () => ({
    params: currentRouteParams,
    query: currentRouteQuery
  }),
  RouterLink: {
    template: '<a><slot /></a>'
  }
}))

describe('Phase 5 — Step 4: Purchase Returns & Vendor Debit Notes Frontend Integration', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    mockPush.mockClear()
    mockBack.mockClear()
    currentRouteParams = { id: 'PRTN-001' }
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

    store.suppliers = [
      {
        id: 'SUP-01',
        supplier_id: 'SUP-01',
        code: 'SUP-01',
        name: 'BRG Factory Ltd',
        contact: 'Li Wei'
      }
    ]

    store.purchaseOrders = [
      {
        id: 'PO-001',
        po_number: 'PO-001',
        supplier_id: 'SUP-01',
        supplier: 'BRG Factory Ltd',
        status: 'Approved'
      }
    ]

    store.receipts = [
      {
        id: 'GR-001',
        receipt_number: 'GR-001',
        po_id: 'PO-001',
        po_number: 'PO-001',
        supplier: 'BRG Factory Ltd'
      }
    ]

    store.purchaseReturns = [
      {
        id: 'PRTN-001',
        return_number: 'PRTN-001',
        supplier_id: 'SUP-01',
        supplier: 'BRG Factory Ltd',
        po_number: 'PO-001',
        receipt_number: 'GR-001',
        branch: 'Peshawar',
        total_units: 1,
        total_credit_amount: 100000.00,
        reason: 'Transit Damage',
        status: 'Draft',
        status_class: 'bg-gray-100 text-gray-700',
        created_at: '2026-10-28T10:00:00Z',
        items: [
          {
            id: 1,
            product_id: 'PROD-007',
            product: 'PowerCell 72V 30Ah Battery',
            sku: 'BAT-PC-7230',
            serial_number: 'SN-001',
            quantity: 1,
            unit_cost: 100000.00,
            subtotal: 100000.00,
            condition: 'Defective'
          }
        ]
      }
    ]
  })

  // -------------------------------------------------------------------------
  // 1. CreatePurchaseReturn.vue Component Tests
  // -------------------------------------------------------------------------
  describe('CreatePurchaseReturn.vue', () => {
    it('mounts and strictly preserves required guided-tour selectors', () => {
      const wrapper = mount(CreatePurchaseReturn)

      expect(wrapper.find('[data-tour="e-g-transit-damage-qc-failure"]').exists()).toBe(true)
      expect(wrapper.find('[data-tour="select-product-or-scan-serial"]').exists()).toBe(true)
      expect(wrapper.find('[data-tour="pkr"]').exists()).toBe(true)
    })

    it('populates supplier dropdown and calculates credit totals dynamically', async () => {
      const wrapper = mount(CreatePurchaseReturn)
      await flushPromises()

      const supplierSelect = wrapper.find('select')
      expect(supplierSelect.exists()).toBe(true)
      expect(wrapper.text()).toContain('BRG Factory Ltd')

      // Verify credit calculation and initial product
      expect(wrapper.text()).toContain('Estimated Credit')
      expect(wrapper.text()).toContain('PKR 168,000')
    })

    it('submits Draft return via API, updates store, and navigates', async () => {
      const mockReturn = {
        id: 'PRTN-002',
        return_number: 'PRTN-002',
        supplier_id: 'SUP-01',
        supplier: 'BRG Factory Ltd',
        status: 'Draft',
        total_credit_amount: 100000.00
      }

      vi.spyOn(api.procurement, 'createPurchaseReturn').mockResolvedValueOnce(mockReturn)

      const wrapper = mount(CreatePurchaseReturn)
      await flushPromises()

      // Fill reason
      const reasonInput = wrapper.find('[data-tour="e-g-transit-damage-qc-failure"]')
      await reasonInput.setValue('Transit defect reported by bay')

      // Click Save Draft button
      const draftBtn = wrapper.findAll('button').find(b => b.text().includes('Save Draft'))
      expect(draftBtn).toBeDefined()
      await draftBtn.trigger('click')
      await flushPromises()

      expect(api.procurement.createPurchaseReturn).toHaveBeenCalledTimes(1)
      expect(mockPush).toHaveBeenCalledWith('/procurement/purchase-returns')
    })

    it('displays error banner when API returns validation or business rule failure', async () => {
      vi.spyOn(api.procurement, 'createPurchaseReturn').mockRejectedValueOnce(
        new ApiError('Return quantity exceeds remaining returnable units', 400)
      )

      const wrapper = mount(CreatePurchaseReturn)
      await flushPromises()

      const reasonInput = wrapper.find('[data-tour="e-g-transit-damage-qc-failure"]')
      await reasonInput.setValue('Attempted excess return')

      const submitBtn = wrapper.findAll('button').find(b => b.text().includes('Submit & Approve Return'))
      await submitBtn.trigger('click')
      await flushPromises()

      expect(wrapper.text()).toContain('Return quantity exceeds remaining returnable units')
    })
  })

  // -------------------------------------------------------------------------
  // 2. PurchaseReturns.vue List & Search Tests
  // -------------------------------------------------------------------------
  describe('PurchaseReturns.vue', () => {
    it('mounts and preserves data-tour="searchquery" selector', async () => {
      vi.spyOn(api.procurement, 'getPurchaseReturns').mockResolvedValueOnce(store.purchaseReturns)

      const wrapper = mount(PurchaseReturns)
      await flushPromises()

      expect(wrapper.find('[data-tour="searchquery"]').exists()).toBe(true)
      expect(wrapper.text()).toContain('PRTN-001')
      expect(wrapper.text()).toContain('BRG Factory Ltd')
    })

    it('filters returns by status and supplier', async () => {
      vi.spyOn(api.procurement, 'getPurchaseReturns').mockResolvedValueOnce([
        {
          id: 'PRTN-001',
          return_number: 'PRTN-001',
          supplier: 'BRG Factory Ltd',
          status: 'Draft',
          total_credit_amount: 100000
        },
        {
          id: 'PRTN-002',
          return_number: 'PRTN-002',
          supplier: 'Pak Cables Ltd',
          status: 'Approved',
          total_credit_amount: 50000
        }
      ])

      const wrapper = mount(PurchaseReturns)
      await flushPromises()

      // Click the 'Approved' filter pill
      const approvedBtn = wrapper.findAll('button').find(b => b.text().trim() === 'Approved')
      expect(approvedBtn).toBeDefined()
      await approvedBtn.trigger('click')
      await flushPromises()

      expect(wrapper.text()).toContain('PRTN-002')
      expect(wrapper.text()).not.toContain('PRTN-001')
    })

    it('clicking a return navigates to /procurement/returns/:id', async () => {
      vi.spyOn(api.procurement, 'getPurchaseReturns').mockResolvedValueOnce(store.purchaseReturns)

      const wrapper = mount(PurchaseReturns)
      await flushPromises()

      const tableRow = wrapper.find('tbody tr')
      expect(tableRow.exists()).toBe(true)
      await tableRow.trigger('click')

      expect(mockPush).toHaveBeenCalledWith('/procurement/returns/PRTN-001')
    })
  })

  // -------------------------------------------------------------------------
  // 3. PurchaseReturnDetail.vue Detail & Approval Action Tests
  // -------------------------------------------------------------------------
  describe('PurchaseReturnDetail.vue', () => {
    it('mounts and renders return lines, supplier info, and Draft status badge', async () => {
      vi.spyOn(api.procurement, 'getPurchaseReturnById').mockResolvedValueOnce(store.purchaseReturns[0])

      const wrapper = mount(PurchaseReturnDetail)
      await flushPromises()

      expect(wrapper.text()).toContain('PRTN-001')
      expect(wrapper.text()).toContain('BRG Factory Ltd')
      expect(wrapper.text()).toContain('Transit Damage')

      // Switch to Units tab to inspect item line
      const unitsTabBtn = wrapper.findAll('button').find(b => b.text().trim() === 'Units')
      expect(unitsTabBtn).toBeDefined()
      await unitsTabBtn.trigger('click')
      await flushPromises()

      expect(wrapper.text()).toContain('PowerCell 72V 30Ah Battery')

      // Approve button should be visible for Draft return
      expect(wrapper.text()).toContain('Approve Return')
    })

    it('approves Draft return atomically and displays generated vendor debit note', async () => {
      vi.spyOn(api.procurement, 'getPurchaseReturnById').mockResolvedValueOnce(store.purchaseReturns[0])

      const approvedRecord = {
        ...store.purchaseReturns[0],
        status: 'Approved',
        status_class: 'bg-[#dcfce7] text-[#165A31]',
        approved_by: 'Super Admin',
        debit_notes: [
          {
            id: 'VDN-001',
            debit_note_number: 'VDN-001',
            amount: 100000.00,
            applied_amount: 100000.00,
            remaining_credit: 0.00,
            status: 'Applied',
            status_class: 'bg-[#eff6ff] text-[#2563eb]',
            created_at: '2026-10-28T10:05:00Z'
          }
        ]
      }

      vi.spyOn(api.procurement, 'approvePurchaseReturn').mockResolvedValueOnce(approvedRecord)

      const wrapper = mount(PurchaseReturnDetail)
      await flushPromises()

      // Find and click "Approve Return"
      const approveBtn = wrapper.findAll('button').find(b => b.text().includes('Approve Return'))
      expect(approveBtn).toBeDefined()
      await approveBtn.trigger('click')
      await flushPromises()

      expect(api.procurement.approvePurchaseReturn).toHaveBeenCalledWith('PRTN-001')

      // Switch to Supplier Credit tab to see debit note details
      const creditTabBtn = wrapper.findAll('button').find(b => b.text().trim() === 'Supplier Credit')
      expect(creditTabBtn).toBeDefined()
      await creditTabBtn.trigger('click')
      await flushPromises()

      expect(wrapper.text()).toContain('VDN-001')
      expect(wrapper.text()).toContain('Vendor Debit Note')
    })

    it('handles approval error gracefully and presents alert banner', async () => {
      vi.spyOn(api.procurement, 'getPurchaseReturnById').mockResolvedValueOnce(store.purchaseReturns[0])
      vi.spyOn(api.procurement, 'approvePurchaseReturn').mockRejectedValueOnce(
        new ApiError('Cannot approve purchase return: Insufficient stock on hand', 400)
      )

      const wrapper = mount(PurchaseReturnDetail)
      await flushPromises()

      const approveBtn = wrapper.findAll('button').find(b => b.text().includes('Approve Return'))
      await approveBtn.trigger('click')
      await flushPromises()

      expect(wrapper.text()).toContain('Cannot approve purchase return: Insufficient stock on hand')
    })
  })
})
