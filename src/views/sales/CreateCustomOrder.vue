<script setup>
import { ref, onMounted } from 'vue'
import { X } from 'lucide-vue-next'
import { store } from '@/store'

const emit = defineEmits(['close'])
const formData = ref({
  customer: '',
  product: '',
  variant: '',
  customerNeed: '',
  deposit: '',
  quotedPrice: '',
  eta: ''
})

const showValidation = ref(false)
const isEditMode = ref(false)

onMounted(() => {
  if (store.originalEditCustomOrder) {
    isEditMode.value = true
    formData.value = { ...store.originalEditCustomOrder }
  }
})

const close = () => {
  store.originalEditCustomOrder = null
  emit('close')
}

const saveOrder = () => {
  if (!formData.value.customer || !formData.value.product) {
    showValidation.value = true
    return
  }
  
  if (isEditMode.value) {
    store.applyEdit(store.originalEditCustomOrder, formData.value)
    store.originalEditCustomOrder = null
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
            Super Admin / Sales & CRM / Custom Orders / <span class="font-bold text-gray-800">{{ isEditMode ? 'Update Custom Order' : 'Create Custom Order' }}</span>
          </div>
          <h1 class="text-[32px] tracking-tight font-bold text-gray-900">{{ isEditMode ? 'Update Custom Order' : 'Create Custom Order' }}</h1>
          <p class="text-sm text-gray-500 mt-1">Book bespoke vehicle configurations, customer custom specifications and advance deposits.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <!-- 1. Order Information Card -->
          <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
            <h3 class="text-[14px] font-bold text-gray-900 mb-4">Order Information</h3>
            
            <div class="space-y-4">
              <div>
                <label class="block text-[11px] font-semibold text-gray-700 mb-1">Customer *</label>
                <input v-model="formData.customer" type="text" placeholder="Customer name..." class="w-full px-3 py-2 text-[12px] bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors" />
                <p v-if="showValidation && !formData.customer" class="text-[10px] text-red-500 mt-1">This field is required</p>
              </div>

              <div>
                <label class="block text-[11px] font-semibold text-gray-700 mb-1">Base Product *</label>
                <input v-model="formData.product" type="text" placeholder="e.g. Cargo Pro" class="w-full px-3 py-2 text-[12px] bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors" />
                <p v-if="showValidation && !formData.product" class="text-[10px] text-red-500 mt-1">This field is required</p>
              </div>

              <div>
                <label class="block text-[11px] font-semibold text-gray-700 mb-1">Custom Variant / Spec</label>
                <input v-model="formData.variant" type="text" placeholder="e.g. Extended Box, 72V 60Ah" class="w-full px-3 py-2 text-[12px] bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors" />
              </div>
            </div>
          </div>

          <!-- 2. Commercials & Delivery Card -->
          <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
            <h3 class="text-[14px] font-bold text-gray-900 mb-4">Commercials & Delivery</h3>
            
            <div class="space-y-4">
              <div>
                <label class="block text-[11px] font-semibold text-gray-700 mb-1">Quoted Price</label>
                <input v-model="formData.quotedPrice" type="text" placeholder="e.g. PKR 310K" class="w-full px-3 py-2 text-[12px] bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors" />
              </div>
              <div>
                <label class="block text-[11px] font-semibold text-gray-700 mb-1">Deposit Amount</label>
                <input v-model="formData.deposit" type="text" placeholder="e.g. PKR 50K" class="w-full px-3 py-2 text-[12px] bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors" />
              </div>
              <div>
                <label class="block text-[11px] font-semibold text-gray-700 mb-1">Target ETA</label>
                <input v-model="formData.eta" type="text" placeholder="e.g. Sep 15" class="w-full px-3 py-2 text-[12px] bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors" />
              </div>
            </div>
          </div>
        </div>

        <!-- Requirements Notes Card -->
        <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
          <h3 class="text-[14px] font-bold text-gray-900 mb-4">Detailed Requirements</h3>
          <div>
            <label class="block text-[11px] font-semibold text-gray-700 mb-1">Customer Specifications & Notes</label>
            <textarea v-model="formData.customerNeed" rows="3" placeholder="Specific technical requirements, delivery terms or custom paint/branding..." class="w-full px-3 py-2 text-[12px] bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors"></textarea>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="flex items-center justify-end gap-3 pt-2">
          <button @click="close" class="bg-white border border-gray-200 text-gray-700 text-xs font-semibold px-5 py-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer shadow-sm">
            Cancel
          </button>
          <button @click="saveOrder" class="bg-[#165A31] text-white text-xs font-semibold px-5 py-2 rounded-lg hover:bg-[#124a28] transition-colors cursor-pointer shadow-sm">
            {{ isEditMode ? 'Update Custom Order' : 'Create Custom Order' }}
          </button>
        </div>
      </div>

    </div>
  </div>
</template>
