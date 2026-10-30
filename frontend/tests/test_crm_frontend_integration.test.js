import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { api, ApiError } from '../src/services/api.js'
import { store } from '../src/store.js'

// Import all 6 CRM views
import Leads from '../src/views/sales/Leads.vue'
import CreateLead from '../src/views/sales/CreateLead.vue'
import LeadDetail from '../src/views/sales/LeadDetail.vue'
import FollowUps from '../src/views/sales/FollowUps.vue'
import CreateFollowUp from '../src/views/sales/CreateFollowUp.vue'
import FollowUpDetail from '../src/views/sales/FollowUpDetail.vue'

// Mock vue-router
const mockPush = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockPush,
    currentRoute: { value: { path: '/sales/leads' } }
  }),
  useRoute: () => ({
    params: { id: '1' },
    query: {}
  }),
  RouterLink: {
    template: '<a><slot /></a>'
  }
}))

describe('Phase 4 — Step 4: CRM Frontend Integration Test Suite', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    mockPush.mockClear()
    store.setSession({
      id: 'USR-PEW-01',
      name: 'Hamza Khan',
      role: 'Branch Manager',
      branchCode: 'PEW-01',
      branchId: 'BR-01',
      branchName: 'Peshawar',
      token: 'jwt-crm-test-token-2026',
      permissions: ['leads.read', 'leads.write', 'leads.convert'],
      isAuthenticated: true
    })
  })

  describe('1. API Client CRM Endpoints Definition & Contracts', () => {
    it('exposes all required leads API methods', () => {
      expect(api.leads).toBeDefined()
      expect(typeof api.leads.getAll).toBe('function')
      expect(typeof api.leads.getById).toBe('function')
      expect(typeof api.leads.create).toBe('function')
      expect(typeof api.leads.update).toBe('function')
      expect(typeof api.leads.delete).toBe('function')
      expect(typeof api.leads.convertToCustomer).toBe('function')
    })

    it('exposes all required follow-ups API methods', () => {
      expect(api.followUps).toBeDefined()
      expect(typeof api.followUps.getAll).toBe('function')
      expect(typeof api.followUps.getById).toBe('function')
      expect(typeof api.followUps.create).toBe('function')
      expect(typeof api.followUps.update).toBe('function')
      expect(typeof api.followUps.complete).toBe('function')
      expect(typeof api.followUps.delete).toBe('function')
    })

    it('api.leads.convertToCustomer calls POST /api/v1/leads/:id/convert with customer payload', async () => {
      const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({
          status: 'success',
          message: 'Lead converted successfully',
          isExistingCustomer: false,
          customer: { id: 'CUS-991', name: 'Zubair Khan', phone: '+92 300 1234567' },
          lead: { id: 1, customer_id: 'CUS-991', stage: 'Converted' }
        })
      })

      const payload = {
        name: 'Zubair Khan',
        phone: '+92 300 1234567',
        cnic: '17301-1234567-1',
        city: 'Peshawar'
      }

      const res = await api.leads.convertToCustomer(1, payload)
      expect(res.ok).toBe(true)
      expect(res.data.status).toBe('success')
      expect(res.data.customer.id).toBe('CUS-991')
      expect(res.data.isExistingCustomer).toBe(false)

      expect(fetchSpy).toHaveBeenCalledTimes(1)
      const callUrl = fetchSpy.mock.calls[0][0]
      const callOpts = fetchSpy.mock.calls[0][1]
      expect(callUrl).toContain('/api/v1/leads/1/convert')
      expect(callOpts.method).toBe('POST')
      expect(JSON.parse(callOpts.body)).toMatchObject({ name: 'Zubair Khan' })
    })

    it('api.followUps.complete calls POST /api/v1/follow-ups/:id/complete', async () => {
      const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({
          ok: true,
          message: 'Follow-up marked as completed.',
          followUp: { id: 5, status: 'Completed' }
        })
      })

      const res = await api.followUps.complete(5)
      expect(res.ok).toBe(true)
      expect(fetchSpy).toHaveBeenCalledTimes(1)
      const callUrl = fetchSpy.mock.calls[0][0]
      expect(callUrl).toContain('/api/v1/follow-ups/5/complete')
    })
  })

  describe('2. Store Hydration & Normalization for CRM Collections', () => {
    it('fetchRemoteLeads fetches and normalizes remote leads into store.leads', async () => {
      vi.spyOn(api.leads, 'getAll').mockResolvedValueOnce([
        {
          id: 101,
          lead_number: 'LD-101',
          customer_name: 'Imran Tariq',
          phone: '+92 321 9876543',
          interest: 'BRG E-125',
          source: 'Website',
          branch: 'Peshawar',
          branch_name: 'Peshawar',
          assigned_to_name: 'Hamza',
          stage: 'Qualified',
          customer_id: null
        }
      ])

      const leads = await store.fetchRemoteLeads()
      const found = leads.find(l => l.id === 101)
      expect(found).toBeDefined()
      expect(found.customer).toBe('Imran Tariq')
      expect(found.leadNo).toBe('LD-101')
      expect(found.product).toBe('BRG E-125')
      expect(found.stage).toBe('Qualified')
    })

    it('fetchRemoteFollowUps fetches and normalizes remote follow-ups into store.followUps', async () => {
      vi.spyOn(api.followUps, 'getAll').mockResolvedValueOnce([
        {
          id: 202,
          customer_name: 'Rashid Ali',
          type: 'Call',
          due_date: '2026-10-30T10:00:00.000Z',
          priority: 'High',
          status: 'Scheduled',
          branch: 'Peshawar',
          assigned_to_name: 'Hamza'
        }
      ])

      const followUps = await store.fetchRemoteFollowUps()
      const found = followUps.find(f => f.id === 202)
      expect(found).toBeDefined()
      expect(found.customer).toBe('Rashid Ali')
      expect(found.owner).toBe('Hamza')
      expect(found.priorityColor).toBe('bg-orange-50 text-orange-700')
      expect(found.status).toBe('Due Today') // 'Scheduled' maps to active 'Due Today'
    })
  })

  describe('3. Leads View (Leads.vue) Integration', () => {
    it('mounts cleanly, preserves guided tour attributes, and loads remote leads', async () => {
      const fetchSpy = vi.spyOn(store, 'fetchRemoteLeads').mockResolvedValue([])

      const wrapper = mount(Leads, {
        global: {
          stubs: {
            CreateLeadModal: true,
            ChevronDown: true,
            Search: true,
            Plus: true,
            Loader2: true,
            AlertCircle: true
          }
        }
      })

      expect(wrapper.exists()).toBe(true)
      expect(fetchSpy).toHaveBeenCalled()

      // Tour attributes preservation check
      expect(wrapper.find('[data-tour-id="bm.sales.leads.header"]').exists()).toBe(true)
      expect(wrapper.find('[data-tour-id="bm.sales.leads.create-btn"]').exists()).toBe(true)
      expect(wrapper.find('[data-tour-id="bm.sales.leads.kpi-cards"]').exists()).toBe(true)
      expect(wrapper.find('[data-tour-id="bm.sales.leads.table"]').exists()).toBe(true)
    })
  })

  describe('4. CreateLead View (CreateLead.vue) Validation & 409 Conflict Handling', () => {
    it('catches HTTP 409 duplicate phone conflict and displays error banner', async () => {
      vi.spyOn(api.leads, 'create').mockRejectedValueOnce({
        status: 409,
        message: 'A lead or customer with phone "+92 300 1234567" already exists in this branch.',
        data: {
          code: 'DUPLICATE_PHONE',
          message: 'A lead or customer with phone "+92 300 1234567" already exists in this branch.'
        }
      })

      const wrapper = mount(CreateLead, {
        props: {
          isModal: true
        },
        global: {
          stubs: {
            X: true,
            Loader2: true,
            AlertCircle: true
          }
        }
      })

      // Fill form
      const nameInput = wrapper.find('input[data-tour="lead-name"]')
      const phoneInput = wrapper.find('input[data-tour="lead-phone"]')
      await nameInput.setValue('Duplicate Candidate')
      await phoneInput.setValue('+92 300 1234567')

      // Submit form
      await wrapper.find('form').trigger('submit.prevent')
      await new Promise(r => setTimeout(r, 10))

      // Check error banner appears with message
      expect(wrapper.text()).toContain('already exists in this branch')
    })
  })

  describe('5. LeadDetail View (LeadDetail.vue) & Conversion Dialog', () => {
    it('mounts and renders lead information and conversion button for qualified leads', async () => {
      vi.spyOn(api.leads, 'getById').mockResolvedValueOnce({
        ok: true,
        status: 200,
        data: {
          lead: {
            id: 1,
            lead_number: 'LD-1001',
            customer_name: 'Fahad Mehmood',
            phone: '+92 333 5551234',
            city: 'Peshawar',
            branch: 'Peshawar',
            owner: 'Hamza',
            stage: 'Qualified',
            customer_id: null
          }
        }
      })

      const wrapper = mount(LeadDetail, {
        global: {
          stubs: {
            NotFoundState: true,
            CreateLeadModal: true,
            ChevronDown: true,
            CheckCircle2: true,
            UserCheck: true,
            Loader2: true,
            AlertCircle: true,
            ExternalLink: true,
            X: true,
            RouterLink: true
          }
        }
      })

      // Allow onMounted async resolution
      await new Promise(r => setTimeout(r, 20))
      await wrapper.vm.$nextTick()

      expect(wrapper.exists()).toBe(true)
      expect(wrapper.text()).toContain('Fahad Mehmood')
      expect(wrapper.text()).toContain('Convert to Customer')
    })

    it('successfully executes lead conversion and presents customer link action', async () => {
      vi.spyOn(api.leads, 'getById').mockResolvedValueOnce({
        ok: true,
        status: 200,
        data: {
          lead: {
            id: 1,
            lead_number: 'LD-1001',
            customer_name: 'Fahad Mehmood',
            phone: '+92 333 5551234',
            city: 'Peshawar',
            branch: 'Peshawar',
            stage: 'Qualified',
            customer_id: null
          }
        }
      })

      const convertSpy = vi.spyOn(api.leads, 'convertToCustomer').mockResolvedValueOnce({
        ok: true,
        status: 200,
        data: {
          status: 'success',
          message: 'Lead converted into registered customer.',
          isExistingCustomer: false,
          customer: { id: 'CUS-888', name: 'Fahad Mehmood', phone: '+92 333 5551234' },
          lead: { id: 1, customer_id: 'CUS-888', stage: 'Converted' }
        }
      })

      const wrapper = mount(LeadDetail, {
        global: {
          stubs: {
            NotFoundState: true,
            CreateLeadModal: true,
            ChevronDown: true,
            CheckCircle2: true,
            UserCheck: true,
            Loader2: true,
            AlertCircle: true,
            ExternalLink: true,
            X: true,
            RouterLink: true
          }
        }
      })

      await new Promise(r => setTimeout(r, 20))
      await wrapper.vm.$nextTick()

      // Open conversion modal
      const convertBtn = wrapper.findAll('button').find(b => b.text().includes('Convert to Customer'))
      expect(convertBtn).toBeDefined()
      await convertBtn.trigger('click')

      // Confirm modal is opened
      expect(wrapper.text()).toContain('Convert Lead to Customer')

      // Trigger confirm and convert
      const confirmBtn = wrapper.findAll('button').find(b => b.text().includes('Confirm & Convert'))
      expect(confirmBtn).toBeDefined()
      await confirmBtn.trigger('click')

      await new Promise(r => setTimeout(r, 10))
      await wrapper.vm.$nextTick()

      expect(convertSpy).toHaveBeenCalledWith('1', expect.objectContaining({ name: 'Fahad Mehmood' }))
      expect(wrapper.text()).toContain('Customer Created Successfully')
      expect(wrapper.text()).toContain('CUS-888')
    })
  })

  describe('6. FollowUps View (FollowUps.vue) & Completion Workflow', () => {
    it('mounts, preserves tour attributes, and calls complete API on follow-up', async () => {
      vi.spyOn(store, 'fetchRemoteFollowUps').mockResolvedValue([])
      const completeSpy = vi.spyOn(api.followUps, 'complete').mockResolvedValueOnce({
        ok: true,
        followUp: { id: 1, status: 'Completed' }
      })

      // Seed follow-up in store
      store.followUps = [
        {
          id: 1,
          customer: 'Kamran Akmal',
          linkedRecord: 'ORD-5501',
          owner: 'Hamza',
          due: 'Today 14:00',
          branch: 'Peshawar',
          status: 'Due Today',
          statusClass: 'bg-[#fef3c7] text-[#b45309]',
          priority: 'High'
        }
      ]

      const wrapper = mount(FollowUps, {
        global: {
          stubs: {
            CreateFollowUp: true,
            Search: true,
            ChevronDown: true,
            Check: true,
            Plus: true,
            Pencil: true,
            CheckCircle2: true,
            Loader2: true,
            AlertCircle: true
          }
        }
      })

      // Check tour selectors
      expect(wrapper.find('[data-tour-id="bm.sales.followups.header"]').exists()).toBe(true)
      expect(wrapper.find('[data-tour-id="bm.sales.followups.create-btn"]').exists()).toBe(true)
      expect(wrapper.find('[data-tour-id="bm.sales.followups.kpi-cards"]').exists()).toBe(true)
      expect(wrapper.find('[data-tour-id="bm.sales.followups.table"]').exists()).toBe(true)

      // Find Complete button and click
      const completeBtn = wrapper.findAll('button').find(b => b.text().includes('Complete'))
      expect(completeBtn).toBeDefined()
      await completeBtn.trigger('click')

      await new Promise(r => setTimeout(r, 10))
      await wrapper.vm.$nextTick()

      expect(completeSpy).toHaveBeenCalledWith(1)
    })
  })

  describe('7. CreateFollowUp View (CreateFollowUp.vue)', () => {
    it('calls api.followUps.create and closes on valid submission', async () => {
      const createSpy = vi.spyOn(api.followUps, 'create').mockResolvedValueOnce({
        ok: true,
        followUp: {
          id: 77,
          customer: 'Adnan Sami',
          linkedRecord: 'LD-902',
          taskType: 'Lead Inquiry Check',
          priority: 'High',
          status: 'Due Today'
        }
      })

      const wrapper = mount(CreateFollowUp, {
        props: { isModal: true },
        global: {
          stubs: {
            X: true,
            Loader2: true,
            AlertCircle: true
          }
        }
      })

      await wrapper.find('input[data-tour="customer"]').setValue('Adnan Sami')
      await wrapper.find('input[data-tour="linkedrecord"]').setValue('LD-902')

      await wrapper.find('form').trigger('submit.prevent')
      await new Promise(r => setTimeout(r, 10))

      expect(createSpy).toHaveBeenCalledWith(expect.objectContaining({
        customer: 'Adnan Sami',
        linkedRecord: 'LD-902'
      }))
      expect(wrapper.emitted('created')).toBeTruthy()
    })
  })

  describe('8. FollowUpDetail View (FollowUpDetail.vue)', () => {
    it('loads follow-up by ID from API and marks it complete via real endpoint', async () => {
      vi.spyOn(api.followUps, 'getById').mockResolvedValueOnce({
        ok: true,
        status: 200,
        data: {
          followUp: {
            id: 1,
            customer: 'Sajid Khan',
            linkedRecord: 'LD-551',
            owner: 'Hamza',
            due: 'Today 14:00',
            priority: 'Normal',
            status: 'Due Today',
            branch: 'Peshawar'
          }
        }
      })

      const completeSpy = vi.spyOn(api.followUps, 'complete').mockResolvedValueOnce({
        ok: true,
        followUp: { id: 1, status: 'Completed' }
      })

      const wrapper = mount(FollowUpDetail, {
        global: {
          stubs: {
            NotFoundState: true,
            CreateFollowUp: true,
            CheckCircle2: true,
            Loader2: true,
            ArrowLeft: true,
            Pencil: true,
            RouterLink: true
          }
        }
      })

      await new Promise(r => setTimeout(r, 10))
      await wrapper.vm.$nextTick()

      expect(wrapper.text()).toContain('Sajid Khan')
      const completeBtn = wrapper.findAll('button').find(b => b.text().includes('Complete Follow-up'))
      expect(completeBtn).toBeDefined()
      await completeBtn.trigger('click')

      await new Promise(r => setTimeout(r, 10))
      await wrapper.vm.$nextTick()

      expect(completeSpy).toHaveBeenCalledWith('1')
    })
  })
})
