<script setup>
import { ref, onMounted, computed } from 'vue'
import { X } from 'lucide-vue-next'
import { store } from '../../store.js'

const emit = defineEmits(['close'])

const quoteData = ref({
  branch: 'Peshawar Branch',
  customer: 'Faisal Khan',
  validUntil: '2026-09-02',
  product: 'BRG DS11',
  quantity: '1',
  sellingPrice: '185K',
  discount: '0',
  taxFees: '',
  total: '185K',
  notes: 'Quote valid while stock remains available.',
  deliveryEstimate: ''
})

const isEditMode = computed(() => !!store.originalEditQuotation)
const showValidation = ref(false)

onMounted(() => {
  if (store.originalEditQuotation) {
    quoteData.value = { ...quoteData.value, ...store.originalEditQuotation }
  }
})

const close = () => {
  store.originalEditQuotation = null
  emit('close')
}

const createQuotation = () => {
  if (!quoteData.value.branch || !quoteData.value.customer || !quoteData.value.product) {
    showValidation.value = true
    return
  }

  if (isEditMode.value) {
    store.applyEdit(store.originalEditQuotation, quoteData.value)
    store.originalEditQuotation = null
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
            Super Admin / Sales & CRM / Quotations / <span class="font-bold text-gray-800">{{ isEditMode ? 'Edit Quotation' : 'Create Quotation' }}</span>
          </div>
          <h1 class="text-[32px] tracking-tight font-bold text-gray-900">{{ isEditMode ? 'Edit Quotation' : 'Create Quotation' }}</h1>
          <p class="text-sm text-gray-500 mt-1">Prepare a customer quotation using current catalogue pricing and branch availability.</p>
        </div>

        <!-- 2-Column Form Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          
          <!-- 1. Customer & Branch -->
          <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
            <h3 class="text-[14px] font-bold text-gray-900 mb-4">Customer & Branch</h3>
            
            <div class="space-y-4">
              <div>
                <label class="block text-[11px] font-semibold text-gray-700 mb-1">Branch</label>
                <input v-model="quoteData.branch" type="text" class="w-full px-3 py-2 text-[12px] bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors" />
              </div>
              
              <div>
                <label class="block text-[11px] font-semibold text-gray-700 mb-1">Customer</label>
                <input v-model="quoteData.customer" type="text" class="w-full px-3 py-2 text-[12px] bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors" />
              </div>

              <div>
                <label class="block text-[11px] font-semibold text-gray-700 mb-1">Valid Until</label>
                <input v-model="quoteData.validUntil" type="date" class="w-full px-3 py-2 text-[12px] bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors text-gray-800" />
              </div>
            </div>
          </div>

          <!-- 2. Commercial Pricing -->
          <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
            <h3 class="text-[14px] font-bold text-gray-900 mb-4">Commercial Terms</h3>
            
            <div class="space-y-4">
              <div>
                <label class="block text-[11px] font-semibold text-gray-700 mb-1">Selling Price</label>
                <input v-model="quoteData.sellingPrice" type="text" class="w-full px-3 py-2 text-[12px] bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors" />
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 mb-1">Discount</label>
                  <input v-model="quoteData.discount" type="text" class="w-full px-3 py-2 text-[12px] bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors" />
                </div>
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 mb-1">Tax / Fees</label>
                  <input v-model="quoteData.taxFees" type="text" class="w-full px-3 py-2 text-[12px] bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors" />
                </div>
              </div>

              <div>
                <label class="block text-[11px] font-semibold text-gray-700 mb-1">Total Quote Value</label>
                <input v-model="quoteData.total" type="text" class="w-full px-3 py-2 text-[12px] bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors font-bold text-gray-900" />
              </div>
            </div>
          </div>

          <!-- 3. Product Selection -->
          <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
            <h3 class="text-[14px] font-bold text-gray-900 mb-4">Product Details</h3>
            
            <div class="space-y-4">
              <div>
                <label class="block text-[11px] font-semibold text-gray-700 mb-1">Product</label>
                <input v-model="quoteData.product" type="text" class="w-full px-3 py-2 text-[12px] bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors" />
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 mb-1">Quantity</label>
                  <input v-model="quoteData.quantity" type="number" class="w-full px-3 py-2 text-[12px] bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors" />
                </div>
                <div>
                  <label class="block text-[11px] font-semibold text-gray-700 mb-1">Delivery Estimate</label>
                  <input v-model="quoteData.deliveryEstimate" type="text" placeholder="e.g. 5 business days" class="w-full px-3 py-2 text-[12px] bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors" />
                </div>
              </div>
            </div>
          </div>

          <!-- 4. Notes & Terms -->
          <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
            <h3 class="text-[14px] font-bold text-gray-900 mb-4">Terms & Notes</h3>
            
            <div>
              <label class="block text-[11px] font-semibold text-gray-700 mb-1">Quotation Notes</label>
              <textarea v-model="quoteData.notes" rows="4" class="w-full px-3 py-2 text-[12px] bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors"></textarea>
            </div>
          </div>

        </div>

        <!-- Footer Actions -->
        <div class="flex items-center justify-end gap-3 pt-2">
          <button @click="close" class="bg-white border border-gray-200 text-gray-700 text-xs font-semibold px-5 py-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer shadow-sm">
            Cancel
          </button>
          <button @click="createQuotation" class="bg-[#165A31] text-white text-xs font-semibold px-5 py-2 rounded-lg hover:bg-[#124a28] transition-colors cursor-pointer shadow-sm">
            {{ isEditMode ? 'Update Quotation' : 'Create Quotation' }}
          </button>
        </div>
      </div>

    </div>
  </div>
</template>
