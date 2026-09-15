<script setup>
import { ref, onMounted } from 'vue'
import { X } from 'lucide-vue-next'
import { store } from '@/store'

const emit = defineEmits(['close'])
const formData = ref({
  orderNo: '',
  customer: '',
  unit: '',
  branch: 'Lahore',
  reason: 'Performance Issue',
  notes: ''
})

const showValidation = ref(false)
const isEditMode = ref(false)

onMounted(() => {
  if (store.originalEditReturn) {
    isEditMode.value = true
    formData.value = { ...store.originalEditReturn }
  }
})

const close = () => {
  store.originalEditReturn = null
  emit('close')
}

const createReturn = () => {
  if (!formData.value.orderNo || !formData.value.unit) {
    showValidation.value = true
    return
  }
  
  if (isEditMode.value) {
    store.applyEdit(store.originalEditReturn, formData.value)
    store.originalEditReturn = null
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
            Super Admin / Sales & CRM / Returns & Refunds / <span class="font-bold text-gray-800">{{ isEditMode ? 'Review Return' : 'Create Return' }}</span>
          </div>
          <h1 class="text-[32px] tracking-tight font-bold text-gray-900">{{ isEditMode ? 'Review Return' : 'Create Return' }}</h1>
          <p class="text-sm text-gray-500 mt-1">Initiate customer unit return, refund assessment and inventory restocking routing.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <!-- 1. Order & Customer Info Card -->
          <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
            <h3 class="text-[14px] font-bold text-gray-900 mb-4">Original Order & Customer</h3>
            
            <div class="space-y-4">
              <div>
                <label class="block text-[11px] font-semibold text-gray-700 mb-1">Original Order No *</label>
                <input v-model="formData.orderNo" type="text" placeholder="e.g. SO-7702" class="w-full px-3 py-2 text-[12px] bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors" />
                <p v-if="showValidation && !formData.orderNo" class="text-[10px] text-red-500 mt-1">This field is required</p>
              </div>

              <div>
                <label class="block text-[11px] font-semibold text-gray-700 mb-1">Customer Name</label>
                <input v-model="formData.customer" type="text" placeholder="e.g. M. Bilal" class="w-full px-3 py-2 text-[12px] bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors" />
              </div>
            </div>
          </div>

          <!-- 2. Unit & Branch Card -->
          <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
            <h3 class="text-[14px] font-bold text-gray-900 mb-4">Unit & Destination</h3>
            
            <div class="space-y-4">
              <div>
                <label class="block text-[11px] font-semibold text-gray-700 mb-1">Unit Serial No *</label>
                <input v-model="formData.unit" type="text" placeholder="e.g. DS11-00994" class="w-full px-3 py-2 text-[12px] bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors" />
                <p v-if="showValidation && !formData.unit" class="text-[10px] text-red-500 mt-1">This field is required</p>
              </div>

              <div>
                <label class="block text-[11px] font-semibold text-gray-700 mb-1">Receiving Branch</label>
                <select v-model="formData.branch" class="w-full px-3 py-2 text-[12px] bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors">
                  <option value="Lahore">Lahore</option>
                  <option value="Peshawar">Peshawar</option>
                  <option value="Islamabad">Islamabad</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- 3. Reason & Notes Card -->
        <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
          <h3 class="text-[14px] font-bold text-gray-900 mb-4">Return Reason & Inspection</h3>
          
          <div class="space-y-4">
            <div>
              <label class="block text-[11px] font-semibold text-gray-700 mb-1">Reason for Return</label>
              <select v-model="formData.reason" class="w-full px-3 py-2 text-[12px] bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors">
                <option value="Performance Issue">Performance Issue</option>
                <option value="Customer Dissatisfaction">Customer Dissatisfaction</option>
                <option value="Damaged in Transit">Damaged in Transit</option>
                <option value="Wrong Specification">Wrong Specification</option>
              </select>
            </div>

            <div>
              <label class="block text-[11px] font-semibold text-gray-700 mb-1">Inspection Notes</label>
              <textarea v-model="formData.notes" rows="3" placeholder="Condition details, battery health or reason specifics..." class="w-full px-3 py-2 text-[12px] bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors"></textarea>
            </div>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="flex items-center justify-end gap-3 pt-2">
          <button @click="close" class="bg-white border border-gray-200 text-gray-700 text-xs font-semibold px-5 py-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer shadow-sm">
            Cancel
          </button>
          <button @click="createReturn" class="bg-[#165A31] text-white text-xs font-semibold px-5 py-2 rounded-lg hover:bg-[#124a28] transition-colors cursor-pointer shadow-sm">
            {{ isEditMode ? 'Update Return' : 'Create Return' }}
          </button>
        </div>
      </div>

    </div>
  </div>
</template>
