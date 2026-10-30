import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { api } from '../src/services/api.js'
import { store } from '../src/store.js'

import CreateLead from '../src/views/sales/CreateLead.vue'
import Leads from '../src/views/sales/Leads.vue'
import LeadDetail from '../src/views/sales/LeadDetail.vue'
import CreateFollowUp from '../src/views/sales/CreateFollowUp.vue'
import FollowUps from '../src/views/sales/FollowUps.vue'
import FollowUpDetail from '../src/views/sales/FollowUpDetail.vue'

// Simulated router
const mockPush = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockPush,
    currentRoute: { value: { path: '/sales/leads' } }
  }),
  useRoute: () => ({
    params: { id: '9001' },
    query: { customer: 'Tariq Mehmood', record: 'LD-9001' }
  }),
  RouterLink: {
    template: '<a><slot /></a>'
  }
}))

describe('End-to-End CRM Workflow Integration Test', () => {
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

  it('completes the entire end-to-end CRM lifecycle: Create Lead -> View in List -> Convert to Customer -> Schedule Follow-Up -> View in Follow-ups List -> Complete Follow-Up', async () => {
    // --- STEP 1: Create a Lead ---
    const createdLeadData = {
      id: 9001,
      lead_number: 'LD-9001',
      customer_name: 'Tariq Mehmood',
      name: 'Tariq Mehmood',
      customer: 'Tariq Mehmood',
      phone: '+92 312 9988776',
      interest: 'BRG X7',
      product: 'BRG X7',
      source: 'Website',
      branch: 'Peshawar',
      owner: 'Hamza Khan',
      stage: 'New',
      customer_id: null
    }

    vi.spyOn(api.leads, 'create').mockResolvedValueOnce({
      ok: true,
      status: 201,
      data: {
        lead: createdLeadData
      }
    })

    const createLeadWrapper = mount(CreateLead, {
      props: { isModal: true },
      global: {
        stubs: { X: true, Loader2: true, AlertCircle: true }
      }
    })

    await createLeadWrapper.find('input[data-tour="lead-name"]').setValue('Tariq Mehmood')
    await createLeadWrapper.find('input[data-tour="lead-phone"]').setValue('+92 312 9988776')
    await createLeadWrapper.find('form').trigger('submit.prevent')
    await new Promise(r => setTimeout(r, 20))

    expect(createLeadWrapper.emitted('created')).toBeTruthy()
    const emittedLead = createLeadWrapper.emitted('created')[0][0]
    expect(emittedLead.customer_name).toBe('Tariq Mehmood')

    // --- STEP 2: View in Leads List ---
    vi.spyOn(api.leads, 'getAll').mockResolvedValueOnce([createdLeadData])

    const leadsWrapper = mount(Leads, {
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

    await new Promise(r => setTimeout(r, 20))
    await leadsWrapper.vm.$nextTick()

    expect(leadsWrapper.text()).toContain('Tariq Mehmood')
    expect(leadsWrapper.text()).toContain('9001')

    // --- STEP 3: Lead Detail & Conversion to Customer ---
    vi.spyOn(api.leads, 'getById').mockResolvedValueOnce({
      ok: true,
      status: 200,
      data: {
        lead: createdLeadData
      }
    })

    const convertedCustomer = {
      id: 'CUS-9001',
      name: 'Tariq Mehmood',
      phone: '+92 312 9988776',
      branch: 'Peshawar'
    }

    const convertSpy = vi.spyOn(api.leads, 'convertToCustomer').mockResolvedValueOnce({
      ok: true,
      status: 200,
      data: {
        status: 'success',
        message: 'Lead converted into registered customer successfully.',
        isExistingCustomer: false,
        customer: convertedCustomer,
        lead: {
          ...createdLeadData,
          customer_id: 'CUS-9001',
          stage: 'Converted'
        }
      }
    })

    const leadDetailWrapper = mount(LeadDetail, {
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
    await leadDetailWrapper.vm.$nextTick()

    expect(leadDetailWrapper.text()).toContain('Tariq Mehmood')

    // Trigger Convert Modal
    const convertBtn = leadDetailWrapper.findAll('button').find(b => b.text().includes('Convert to Customer'))
    expect(convertBtn).toBeDefined()
    await convertBtn.trigger('click')

    // Confirm conversion
    const confirmBtn = leadDetailWrapper.findAll('button').find(b => b.text().includes('Confirm & Convert'))
    expect(confirmBtn).toBeDefined()
    await confirmBtn.trigger('click')

    await new Promise(r => setTimeout(r, 20))
    await leadDetailWrapper.vm.$nextTick()

    expect(convertSpy).toHaveBeenCalledWith('9001', expect.objectContaining({ name: 'Tariq Mehmood' }))
    expect(leadDetailWrapper.text()).toContain('Customer Created Successfully')
    expect(leadDetailWrapper.text()).toContain('CUS-9001')

    // --- STEP 4: Schedule Follow-Up for this Customer ---
    const createdFollowUpData = {
      id: 501,
      customer: 'Tariq Mehmood',
      customer_name: 'Tariq Mehmood',
      linkedRecord: 'CUS-9001',
      type: 'Payment Reminder',
      priority: 'High',
      status: 'Due Today',
      statusClass: 'bg-[#fef3c7] text-[#b45309]',
      due: 'Today 15:00',
      owner: 'Hamza Khan',
      branch: 'Peshawar'
    }

    const createFollowUpSpy = vi.spyOn(api.followUps, 'create').mockResolvedValueOnce({
      ok: true,
      status: 201,
      data: {
        followUp: createdFollowUpData
      }
    })

    const createFollowUpWrapper = mount(CreateFollowUp, {
      props: { isModal: true },
      global: {
        stubs: { X: true, Loader2: true, AlertCircle: true }
      }
    })

    await createFollowUpWrapper.find('input[data-tour="customer"]').setValue('Tariq Mehmood')
    await createFollowUpWrapper.find('input[data-tour="linkedrecord"]').setValue('CUS-9001')
    await createFollowUpWrapper.find('form').trigger('submit.prevent')
    await new Promise(r => setTimeout(r, 20))

    expect(createFollowUpSpy).toHaveBeenCalledWith(expect.objectContaining({
      customer: 'Tariq Mehmood',
      linkedRecord: 'CUS-9001'
    }))
    expect(createFollowUpWrapper.emitted('created')).toBeTruthy()

    // --- STEP 5: View Follow-Up in FollowUps List ---
    vi.spyOn(api.followUps, 'getAll').mockResolvedValueOnce([createdFollowUpData])

    const followUpsWrapper = mount(FollowUps, {
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

    await new Promise(r => setTimeout(r, 20))
    await followUpsWrapper.vm.$nextTick()

    expect(followUpsWrapper.text()).toContain('Tariq Mehmood')
    expect(followUpsWrapper.text()).toContain('CUS-9001')

    // --- STEP 6: View Follow-Up Detail & Mark Complete ---
    vi.spyOn(api.followUps, 'getById').mockResolvedValueOnce({
      ok: true,
      status: 200,
      data: {
        followUp: createdFollowUpData
      }
    })

    const completeFollowUpSpy = vi.spyOn(api.followUps, 'complete').mockResolvedValueOnce({
      ok: true,
      status: 200,
      data: {
        followUp: { ...createdFollowUpData, status: 'Completed' }
      }
    })

    const followUpDetailWrapper = mount(FollowUpDetail, {
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

    await new Promise(r => setTimeout(r, 20))
    await followUpDetailWrapper.vm.$nextTick()

    expect(followUpDetailWrapper.text()).toContain('Tariq Mehmood')
    const completeFollowUpBtn = followUpDetailWrapper.findAll('button').find(b => b.text().includes('Complete Follow-up'))
    expect(completeFollowUpBtn).toBeDefined()
    await completeFollowUpBtn.trigger('click')

    await new Promise(r => setTimeout(r, 20))
    await followUpDetailWrapper.vm.$nextTick()

    expect(completeFollowUpSpy).toHaveBeenCalledWith('9001')
    expect(followUpDetailWrapper.text()).toContain('Completed')
  })
})
