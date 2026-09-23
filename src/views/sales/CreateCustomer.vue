<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { X } from 'lucide-vue-next'
import { store } from '@/store'

const props = defineProps({
  isModal: {
    type: Boolean,
    default: true
  },
  customer: {
    type: Object,
    default: null
  }
})

const router = useRouter()
const emit = defineEmits(['close', 'created', 'updated'])
const isBranchUser = computed(() => store.isBranchUser())
const user = computed(() => store.currentUser)

const showValidation = ref(false)
const isEditMode = ref(false)

const formData = ref({
  code: '',
  id: '',
  name: '',
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  cnic: '',
  address: '',
  city: 'Peshawar',
  branch: user.value?.branchName || 'Peshawar',
  status: 'Active',
  notes: ''
})

const loadData = (data) => {
  if (!data) return
  isEditMode.value = true
  const parts = (data.name || '').split(' ')
  formData.value = {
    ...formData.value,
    code: data.code || data.id || formData.value.code,
    id: data.id || data.code || formData.value.id,
    name: data.name || formData.value.name,
    firstName: data.firstName || parts[0] || formData.value.firstName,
    lastName: data.lastName || parts.slice(1).join(' ') || formData.value.lastName,
    phone: data.phone || formData.value.phone,
    email: data.email || formData.value.email,
    cnic: data.cnic || formData.value.cnic,
    address: data.address || formData.value.address,
    city: data.city || formData.value.city,
    branch: data.branch || formData.value.branch,
    status: data.status || formData.value.status,
    notes: data.notes || formData.value.notes
  }
}

onMounted(() => {
  if (props.customer) {
    loadData(props.customer)
  } else if (store.originalEditCustomer) {
    loadData(store.originalEditCustomer)
  }
})

watch(() => props.customer, (newVal) => {
  if (newVal) loadData(newVal)
}, { immediate: true })

const close = (e) => {
  if (e && e.stopPropagation) e.stopPropagation()
  store.originalEditCustomer = null
  emit('close')
  if (!props.isModal && router.currentRoute.value.path === '/sales/customers/create') {
    router.push('/sales/customers')
  }
}

const createCustomer = () => {
  if ((!formData.value.firstName.trim() && !formData.value.name.trim()) || !formData.value.phone.trim()) {
    showValidation.value = true
    return
  }

  const fullName = formData.value.name.trim() || `${formData.value.firstName} ${formData.value.lastName}`.trim()
  const existing = props.customer || (isEditMode.value ? store.getCustomerById(formData.value.id || formData.value.code) : null)
  
  const status = formData.value.status || existing?.status || 'Active'
  const statusClass = status === 'Active' ? 'bg-[#dcfce7] text-[#165A31]' : (status === 'Lead' ? 'bg-[#eff6ff] text-[#2563eb]' : 'bg-[#f3f4f6] text-[#6b7280]')

  const payload = {
    ...(existing || {}),
    code: formData.value.code || existing?.code || `CUS-${Math.floor(1000 + Math.random() * 9000)}`,
    id: formData.value.id || existing?.id || `CUST-${Math.floor(100 + Math.random() * 900)}`,
    customer_id: formData.value.id || existing?.id || `CUST-${Math.floor(100 + Math.random() * 900)}`,
    name: fullName,
    firstName: formData.value.firstName || fullName.split(' ')[0] || '',
    lastName: formData.value.lastName || fullName.split(' ').slice(1).join(' ') || '',
    phone: formData.value.phone,
    email: formData.value.email,
    cnic: formData.value.cnic,
    address: formData.value.address,
    city: formData.value.city,
    branch: formData.value.branch || user.value?.branchName || 'Peshawar',
    status,
    statusClass,
    orders: existing ? (existing.orders ?? existing.ordersCount ?? 0) : 0,
    ordersCount: existing ? (existing.ordersCount ?? existing.orders ?? 0) : 0,
    outstanding: existing ? (existing.outstanding ?? 'PKR 0') : 'PKR 0',
    rawBalance: existing ? (existing.rawBalance ?? 0) : 0,
    balance: existing ? (existing.balance ?? '0') : '0',
    ltv: existing ? (existing.ltv ?? '0') : '0',
    totalPurchases: existing ? (existing.totalPurchases ?? 'PKR 0') : 'PKR 0',
    units: existing ? (existing.units ?? 0) : 0,
    activity: existing ? (existing.activity || 'Just updated') : 'Just now',
    notes: formData.value.notes
  }

  if (isEditMode.value) {
    store.updateCustomer(payload.id || payload.code, payload)
    emit('updated', payload)
  } else {
    store.addCustomer(payload)
    emit('created', payload)
  }
  close()
}
</script>

<template>
  <div class="fixed inset-0 bg-gray-900/60 z-[150] flex items-center justify-center p-4 sm:p-6 backdrop-blur-sm" @click.self.stop="close">
    
    <!-- Close button on top-right of screen overlay -->
    <button @click.stop="close" class="fixed top-4 right-4 sm:top-6 sm:right-6 p-2 text-gray-700 hover:text-gray-900 bg-white hover:bg-gray-100 rounded-full z-[160] shadow-lg transition-colors cursor-pointer">
      <X class="w-5 h-5" />
    </button>

    <!-- Modal Card -->
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 relative">
      
      <!-- Scrollable Form Body -->
      <div class="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
        <!-- Header -->
        <div>
          <div class="text-[10px] text-gray-500 mb-1">
            <span v-if="isBranchUser">Branch Manager / Customers / <span class="font-bold text-gray-800">{{ isEditMode ? 'Edit Customer' : 'Add Customer' }}</span></span>
            <span v-else>Super Admin / Sales & CRM / Customers / <span class="font-bold text-gray-800">{{ isEditMode ? 'Edit Customer' : 'Add Customer' }}</span></span>
          </div>
          <h1 class="text-[32px] tracking-tight font-bold text-gray-900">{{ isEditMode ? 'Edit Customer' : 'Add Customer' }}</h1>
          <p class="text-sm text-gray-500 mt-1">Create or update complete customer record, contact channels and identification details.</p>
        </div>

        <form @submit.prevent="createCustomer" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <!-- 1. Personal Details Card -->
            <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
              <h3 class="text-[14px] font-bold text-gray-900 mb-4">Personal Details</h3>
              
              <div class="space-y-4">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-[11px] font-semibold text-gray-700 mb-1">First Name *</label>
                    <input 
                      v-model="formData.firstName" 
                      type="text" 
                      placeholder="First name..." 
                      class="w-full px-3.5 py-2 text-[12px] bg-white border rounded-lg focus:outline-none focus:border-[#165A31] transition-colors"
                      :class="showValidation && !formData.firstName.trim() && !formData.name.trim() ? 'border-red-300 bg-red-50/20' : 'border-gray-200'"
                    />
                    <p v-if="showValidation && !formData.firstName.trim() && !formData.name.trim()" class="text-[10px] text-red-500 mt-1">Name is required</p>
                  </div>
                  <div>
                    <label class="block text-[11px] font-semibold text-gray-700 mb-1">Last Name</label>
                    <input v-model="formData.lastName" type="text" placeholder="Last name..." class="w-full px-3.5 py-2 text-[12px] bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#165A31] transition-colors" />
                  </div>
                </div>
                
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 mb-1">Phone Number *</label>
                  <input 
                    v-model="formData.phone" 
                    type="text" 
                    placeholder="0300 1234567" 
                    class="w-full px-3.5 py-2 text-[12px] bg-white border rounded-lg focus:outline-none focus:border-[#165A31] transition-colors"
                    :class="showValidation && !formData.phone.trim() ? 'border-red-300 bg-red-50/20' : 'border-gray-200'"
                  />
                  <p v-if="showValidation && !formData.phone.trim()" class="text-[10px] text-red-500 mt-1">Phone number is required</p>
                </div>

                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 mb-1">Email Address</label>
                  <input v-model="formData.email" type="email" placeholder="customer@example.com" class="w-full px-3.5 py-2 text-[12px] bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#165A31] transition-colors" />
                </div>

                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 mb-1">CNIC / ID Number</label>
                  <input v-model="formData.cnic" type="text" placeholder="XXXXX-XXXXXXX-X" class="w-full px-3.5 py-2 text-[12px] bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#165A31] transition-colors" />
                </div>
              </div>
            </div>

            <!-- 2. Address & Branch Information Card -->
            <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
              <h3 class="text-[14px] font-bold text-gray-900 mb-4">Address & Scope</h3>
              
              <div class="space-y-4">
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 mb-1">Street Address</label>
                  <textarea v-model="formData.address" rows="3" placeholder="Full residential or business address..." class="w-full px-3.5 py-2 text-[12px] bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#165A31] transition-colors resize-none"></textarea>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-[11px] font-semibold text-gray-700 mb-1">City</label>
                    <input v-model="formData.city" type="text" placeholder="e.g. Peshawar" class="w-full px-3.5 py-2 text-[12px] bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#165A31] transition-colors" />
                  </div>
                  <div>
                    <label class="block text-[11px] font-semibold text-gray-700 mb-1">Branch</label>
                    <select v-model="formData.branch" class="w-full px-3.5 py-2 text-[12px] bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#165A31] transition-colors">
                      <option value="Peshawar">Peshawar</option>
                      <option value="Islamabad">Islamabad</option>
                      <option value="Lahore">Lahore</option>
                      <option value="Rawalpindi">Rawalpindi</option>
                    </select>
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-[11px] font-semibold text-gray-700 mb-1">Customer Status</label>
                    <select v-model="formData.status" class="w-full px-3.5 py-2 text-[12px] bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#165A31] transition-colors">
                      <option value="Active">Active</option>
                      <option value="Lead">Lead</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-[11px] font-semibold text-gray-700 mb-1">Internal Notes</label>
                    <textarea v-model="formData.notes" rows="2" placeholder="Optional notes or customer tier..." class="w-full px-3.5 py-2 text-[12px] bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#165A31] transition-colors resize-none"></textarea>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer Actions -->
          <div class="flex items-center justify-end gap-3 pt-2">
            <button 
              type="button" 
              @click.stop="close" 
              class="bg-white border border-gray-200 text-gray-700 text-xs font-semibold px-5 py-2.5 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer shadow-sm"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              class="bg-[#165A31] text-white text-xs font-semibold px-5 py-2.5 rounded-lg hover:bg-[#124a28] transition-colors cursor-pointer shadow-sm"
            >
              {{ isEditMode ? 'Update Customer' : 'Add Customer' }}
            </button>
          </div>
        </form>
      </div>

    </div>
  </div>
</template>
