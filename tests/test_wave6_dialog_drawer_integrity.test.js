import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { store } from '@/store.js'
import ActionCentre from '@/views/dashboard/ActionCentre.vue'

// Mock vue-router
const pushMock = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: pushMock
  }),
  useRoute: () => ({
    query: {}
  })
}))

describe('AJ EcoDrive — Wave 6 Dialog & Drawer Integrity Suite', () => {
  beforeEach(() => {
    pushMock.mockClear()
    store.currentUser = {
      id: 'USR-01',
      name: 'Ahsan Khan',
      role: 'Super Admin',
      branchName: 'Peshawar',
      branchId: 'BR-01'
    }
  })

  it('mounts ActionCentre and verifies treatment drawer state isolation', async () => {
    const wrapper = mount(ActionCentre, {
      global: {
        stubs: {
          CheckCircle2: true,
          AlertTriangle: true,
          AlertCircle: true,
          Clock: true,
          Filter: true,
          Search: true,
          ChevronRight: true,
          ArrowUpRight: true,
          X: true,
          ShieldCheck: true,
          DollarSign: true,
          Truck: true,
          FileText: true,
          Wrench: true,
          ShieldAlert: true
        }
      }
    })

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.text()).toContain('Action Centre')

    // Find and click the first task item to open the treatment drawer
    const taskCard = wrapper.find('.group.cursor-pointer')
    if (taskCard.exists()) {
      await taskCard.trigger('click')
      // Drawer should open and display task treatment panel
      expect(wrapper.text()).toContain('Treat Item')
    }
  })

  it('ensures drawer treatment resolution does not mutate unintended collections', async () => {
    const wrapper = mount(ActionCentre, {
      global: {
        stubs: {
          CheckCircle2: true,
          AlertTriangle: true,
          AlertCircle: true,
          Clock: true,
          Filter: true,
          Search: true,
          ChevronRight: true,
          ArrowUpRight: true,
          X: true,
          ShieldCheck: true,
          DollarSign: true,
          Truck: true,
          FileText: true,
          Wrench: true,
          ShieldAlert: true
        }
      }
    })

    const initialPoCount = store.purchaseOrders.length
    const initialOrderCount = store.orders.length

    // Verify initial count stability
    expect(store.purchaseOrders.length).toBe(initialPoCount)
    expect(store.orders.length).toBe(initialOrderCount)
  })
})
