import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { store } from '@/store.js'
import ReceivePurchase from '@/views/procurement/ReceivePurchase.vue'
import ReceiveTransfer from '@/views/inventory/ReceiveTransfer.vue'

// Mock vue-router
const pushMock = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: pushMock,
    currentRoute: {
      value: { path: '/procurement/receive-purchase' }
    }
  }),
  useRoute: () => ({
    params: { id: 'PO-2048' },
    query: { po: 'PO-2048', id: 'PO-2048' }
  })
}))

describe('AJ EcoDrive — Wave 6 Navigation Integrity & Component Mount Suite', () => {
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

  it('mounts ReceivePurchase and binds target PO record context', async () => {
    const wrapper = mount(ReceivePurchase, {
      global: {
        stubs: {
          ArrowLeft: true,
          CheckCircle2: true,
          AlertTriangle: true,
          AlertCircle: true,
          Package: true,
          ShieldCheck: true,
          FileText: true,
          Check: true,
          Plus: true,
          Trash2: true,
          RefreshCw: true
        }
      }
    })

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.text()).toContain('Receive Purchase')
    expect(wrapper.text()).toContain('PO-2048')
  })

  it('mounts ReceiveTransfer and verifies back navigation destination', async () => {
    const wrapper = mount(ReceiveTransfer, {
      global: {
        stubs: {
          ArrowLeft: true,
          CheckCircle2: true,
          AlertCircle: true,
          PackageCheck: true,
          AlertTriangle: true
        }
      }
    })

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.text()).toContain('Receive Transfer')
    
    // Find and click the Back button
    const backBtn = wrapper.find('button')
    expect(backBtn.exists()).toBe(true)
    await backBtn.trigger('click')
    
    expect(pushMock).toHaveBeenCalledWith('/inventory/transfers')
  })

  it('renders NotFoundState gracefully when non-existent transfer is supplied', async () => {
    // Override route mock to supply an unknown ID
    const origGetTransferById = store.getTransferById
    store.getTransferById = () => null

    const wrapper = mount(ReceiveTransfer, {
      global: {
        stubs: {
          ArrowLeft: true,
          CheckCircle2: true,
          AlertCircle: true,
          PackageCheck: true,
          AlertTriangle: true
        }
      }
    })

    expect(wrapper.text()).toContain('Transfer Record Not Found')
    store.getTransferById = origGetTransferById
  })
})
