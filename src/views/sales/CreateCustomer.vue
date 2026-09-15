<script setup>
import { ref, onMounted } from 'vue'
import { X } from 'lucide-vue-next'
import { store } from '@/store'

const emit = defineEmits(['close'])
const formData = ref({
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  cnic: '',
  address: '',
  city: '',
  branch: 'Peshawar',
  notes: ''
})

const showValidation = ref(false)
const isEditMode = ref(false)

onMounted(() => {
  if (store.originalEditCustomer) {
    isEditMode.value = true
    formData.value = { ...store.originalEditCustomer }
  }
})

const close = () => {
  store.originalEditCustomer = null
  emit('close')
}

const createCustomer = () => {
  if (!formData.value.firstName || !formData.value.phone) {
    showValidation.value = true
    return
  }
  if (isEditMode.value) {
    store.applyEdit(store.originalEditCustomer, formData.value)
    store.originalEditCustomer = null
  }
  emit('close')
}
</script>

<template>
  <div class="fixed inset-0 bg-gray-900/50 z-[100] flex items-center justify-center p-4 sm:p-6 backdrop-blur-sm" @click.self="close">
    
    <!-- Close button on top-right of screen overlay -->
    <button @click="close" class="fixed top-4 right-4 sm:top-6 sm:right-6 p-2 text-gray-700 hover:text-gray-900 bg-white hover:bg-gray-100 rounded-full z-[110] shadow-lg transition-colors cursor-pointer">
      <X class="w-5 h-5" />
    </button>

    <!-- Modal Card -->
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 relative">
      
      <!-- Scrollable Form Body -->
      <div class="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
        <!-- Header -->
        <div>
          <div class="text-[10px] text-gray-500 mb-1">
            Super Admin / Sales & CRM / Customers / <span class="font-bold text-gray-800">{{ isEditMode ? 'Edit Customer' : 'Add Customer' }}</span>
          </div>
          <h1 class="text-[32px] tracking-tight font-bold text-gray-900">{{ isEditMode ? 'Edit Customer' : 'Add Customer' }}</h1>
          <p class="text-sm text-gray-500 mt-1">Create or update complete customer record, contact channels and identification details.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <!-- 1. Personal Details Card -->
          <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
            <h3 class="text-[14px] font-bold text-gray-900 mb-4">Personal Details</h3>
            
            <div class="space-y-4">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 mb-1">First Name *</label>
                  <input v-model="formData.firstName" type="text" placeholder="First name..." class="w-full px-3 py-2 text-[12px] bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors" />
                  <p v-if="showValidation && !formData.firstName" class="text-[10px] text-red-500 mt-1">This field is required</p>
                </div>
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 mb-1">Last Name</label>
                  <input v-model="formData.lastName" type="text" placeholder="Last name..." class="w-full px-3 py-2 text-[12px] bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors" />
                </div>
              </div>
              
              <div>
                <label class="block text-[11px] font-semibold text-gray-700 mb-1">Phone Number *</label>
                <input v-model="formData.phone" type="text" placeholder="+92 3XX XXXXXXX" class="w-full px-3 py-2 text-[12px] bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors" />
                <p v-if="showValidation && !formData.phone" class="text-[10px] text-red-500 mt-1">This field is required</p>
              </div>

              <div>
                <label class="block text-[11px] font-semibold text-gray-700 mb-1">Email Address</label>
                <input v-model="formData.email" type="email" placeholder="customer@example.com" class="w-full px-3 py-2 text-[12px] bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors" />
              </div>

              <div>
                <label class="block text-[11px] font-semibold text-gray-700 mb-1">CNIC / ID Number</label>
                <input v-model="formData.cnic" type="text" placeholder="XXXXX-XXXXXXX-X" class="w-full px-3 py-2 text-[12px] bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors" />
              </div>
            </div>
          </div>

          <!-- 2. Address & Branch Information Card -->
          <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
            <h3 class="text-[14px] font-bold text-gray-900 mb-4">Address & Scope</h3>
            
            <div class="space-y-4">
              <div>
                <label class="block text-[11px] font-semibold text-gray-700 mb-1">Street Address</label>
                <textarea v-model="formData.address" rows="3" placeholder="Full residential or business address..." class="w-full px-3 py-2 text-[12px] bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors"></textarea>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 mb-1">City</label>
                  <input v-model="formData.city" type="text" placeholder="e.g. Peshawar" class="w-full px-3 py-2 text-[12px] bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors" />
                </div>
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 mb-1">Branch</label>
                  <select v-model="formData.branch" class="w-full px-3 py-2 text-[12px] bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors">
                    <option value="Peshawar">Peshawar</option>
                    <option value="Islamabad">Islamabad</option>
                    <option value="Lahore">Lahore</option>
                  </select>
                </div>
              </div>

              <div>
                <label class="block text-[11px] font-semibold text-gray-700 mb-1">Internal Notes</label>
                <textarea v-model="formData.notes" rows="2" placeholder="Optional background or preference notes..." class="w-full px-3 py-2 text-[12px] bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors"></textarea>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="flex items-center justify-end gap-3 pt-2">
          <button @click="close" class="bg-white border border-gray-200 text-gray-700 text-xs font-semibold px-5 py-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer shadow-sm">
            Cancel
          </button>
          <button @click="createCustomer" class="bg-[#165A31] text-white text-xs font-semibold px-5 py-2 rounded-lg hover:bg-[#124a28] transition-colors cursor-pointer shadow-sm">
            {{ isEditMode ? 'Update Customer' : 'Add Customer' }}
          </button>
        </div>
      </div>

    </div>
  </div>
</template>
