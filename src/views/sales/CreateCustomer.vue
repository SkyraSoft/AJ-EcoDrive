<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { X, UserCheck, Check, ShieldCheck } from 'lucide-vue-next'
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
  const statusClass = status === 'Active' ? 'bg-[#dcfce7] dark:bg-emerald-950/60 text-[#165A31] dark:text-emerald-400' : (status === 'Lead' ? 'bg-[#eff6ff] dark:bg-blue-950/60 text-[#2563eb] dark:text-blue-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300')

  const payload = {
    ...(existing || {}),
    code: formData.value.code || existing?.code || `CUS-${Math.floor(1000 + Math.random() * 9000)}`,
    id: formData.value.id || existing?.id || `CUST-${Math.floor(100 + Math.random() * 900)}`,
    name: fullName,
    firstName: formData.value.firstName,
    lastName: formData.value.lastName,
    phone: formData.value.phone,
    email: formData.value.email,
    cnic: formData.value.cnic,
    address: formData.value.address,
    city: formData.value.city,
    branch: formData.value.branch,
    status: status,
    statusClass: statusClass,
    type: existing?.type || 'Individual',
    spent: existing ? existing.spent : 'PKR 0',
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
    <button @click.stop="close" class="fixed top-4 right-4 sm:top-6 sm:right-6 p-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full z-[160] shadow-lg transition-colors cursor-pointer">
      <X class="w-5 h-5" />
    </button>

    <!-- Modal Card -->
    <div class="bg-white dark:bg-[#161d2b] border border-gray-100 dark:border-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 relative">
      
      <!-- Scrollable Form Body -->
      <div class="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 pb-4 border-b border-gray-100 dark:border-gray-800">
          <div>
            <div class="text-[10px] text-gray-400 dark:text-gray-500 mb-1">
              <span v-if="isBranchUser">Branch Manager / Customers / <span class="font-bold text-gray-700 dark:text-gray-300">{{ isEditMode ? 'Edit Customer' : 'Add Customer' }}</span></span>
              <span v-else>Super Admin / Sales & CRM / Customers / <span class="font-bold text-gray-700 dark:text-gray-300">{{ isEditMode ? 'Edit Customer' : 'Add Customer' }}</span></span>
            </div>
            <h1 class="text-[28px] sm:text-[32px] tracking-tight font-bold text-gray-900 dark:text-white">{{ isEditMode ? 'Edit Customer' : 'Register Dealership Customer' }}</h1>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Create or update customer record, KYC identification and showroom profile.</p>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/80">
              Registered Branch: {{ formData.branch }}
            </span>
          </div>
        </div>

        <form @submit.prevent="createCustomer" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <!-- 1. Personal Details Card -->
            <div class="bg-gray-50/50 dark:bg-[#1e293b]/50 p-6 rounded-xl border border-gray-100 dark:border-gray-800 space-y-4">
              <h3 class="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <UserCheck class="w-4 h-4 text-[#165A31]" />
                Personal Details
              </h3>
              
              <div class="space-y-4">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1">First Name *</label>
                    <input 
                      v-model="formData.firstName" 
                      type="text" 
                      placeholder="e.g. Ahsan" 
                      class="w-full px-3.5 py-2 text-xs bg-white dark:bg-[#0f172a] border rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-[#165A31] transition-colors"
                      :class="showValidation && !formData.firstName.trim() && !formData.name.trim() ? 'border-red-300 bg-red-50/20 dark:border-red-500/50' : 'border-gray-200 dark:border-gray-700'"
                    />
                    <p v-if="showValidation && !formData.firstName.trim() && !formData.name.trim()" class="text-[10px] text-red-500 mt-1">Name is required</p>
                  </div>
                  <div>
                    <label class="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1">Last Name</label>
                    <input v-model="formData.lastName" type="text" placeholder="e.g. Khan" class="w-full px-3.5 py-2 text-xs bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-[#165A31] transition-colors" />
                  </div>
                </div>
                
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1">Mobile Phone Number *</label>
                  <input 
                    v-model="formData.phone" 
                    type="text" 
                    placeholder="e.g. 0300 1234567" 
                    class="w-full px-3.5 py-2 text-xs bg-white dark:bg-[#0f172a] border rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-[#165A31] transition-colors"
                    :class="showValidation && !formData.phone.trim() ? 'border-red-300 bg-red-50/20 dark:border-red-500/50' : 'border-gray-200 dark:border-gray-700'"
                  />
                  <p v-if="showValidation && !formData.phone.trim()" class="text-[10px] text-red-500 mt-1">Phone number is required</p>
                </div>

                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                  <input v-model="formData.email" type="email" placeholder="customer@example.com" class="w-full px-3.5 py-2 text-xs bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-[#165A31] transition-colors" />
                </div>

                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1">CNIC / National Identity Card</label>
                  <input v-model="formData.cnic" type="text" placeholder="17301-XXXXXXX-X" class="w-full px-3.5 py-2 text-xs bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-[#165A31] transition-colors font-mono" />
                </div>
              </div>
            </div>

            <!-- 2. Address & Branch Information Card -->
            <div class="bg-gray-50/50 dark:bg-[#1e293b]/50 p-6 rounded-xl border border-gray-100 dark:border-gray-800 space-y-4">
              <h3 class="text-sm font-bold text-gray-900 dark:text-white">Address & Classification</h3>
              
              <div class="space-y-4">
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1">Residential / Business Street Address</label>
                  <textarea v-model="formData.address" rows="3" placeholder="House #, Street, Sector, Area..." class="w-full px-3.5 py-2 text-xs bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-[#165A31] transition-colors resize-none"></textarea>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1">City</label>
                    <input v-model="formData.city" type="text" placeholder="e.g. Peshawar" class="w-full px-3.5 py-2 text-xs bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-[#165A31] transition-colors" />
                  </div>
                  <div>
                    <label class="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1">Registered Branch</label>
                    <select v-model="formData.branch" class="w-full px-3.5 py-2 text-xs bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-[#165A31] transition-colors cursor-pointer">
                      <option value="Peshawar">Peshawar</option>
                      <option value="Islamabad">Islamabad</option>
                      <option value="Lahore">Lahore</option>
                      <option value="Rawalpindi">Rawalpindi</option>
                    </select>
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1">Customer Lifecycle Status</label>
                    <select v-model="formData.status" class="w-full px-3.5 py-2 text-xs bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-[#165A31] transition-colors cursor-pointer">
                      <option value="Active">Active Customer</option>
                      <option value="Lead">Showroom Walk-in Lead</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1">Profile Notes</label>
                    <textarea v-model="formData.notes" rows="2" placeholder="Corporate fleet manager, VIP buyer..." class="w-full px-3.5 py-2 text-xs bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-[#165A31] transition-colors resize-none"></textarea>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer Actions -->
          <div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
            <button 
              type="button" 
              @click.stop="close" 
              class="px-5 py-2.5 text-xs font-bold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              class="bg-[#165A31] text-white text-xs font-bold px-6 py-2.5 rounded-lg hover:bg-[#124a28] transition-colors shadow-sm cursor-pointer flex items-center gap-2"
            >
              <Check class="w-4 h-4" />
              {{ isEditMode ? 'Update Customer' : 'Save Customer' }}
            </button>
          </div>
        </form>
      </div>

    </div>
  </div>
</template>
