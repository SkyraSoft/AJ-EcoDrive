<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { store } from '../../store.js'

const router = useRouter()

const priceRuleData = ref({
  product: '',
  sellingPrice: '',
  landedCostRef: '',
  markup: '',
  margin: '',
  minimum: '',
  branchOverride: '',
  effective: '',
  reason: ''
})

const showValidation = ref(false)

onMounted(() => {
  if (store.originalEditPriceRule) {
    priceRuleData.value = { ...priceRuleData.value, ...store.originalEditPriceRule }
  }
})

const saveChanges = () => {
  if (!priceRuleData.value.product || !priceRuleData.value.sellingPrice || !priceRuleData.value.minimum) {
    showValidation.value = true
    return
  }

  if (store.originalEditPriceRule) {
    store.applyEdit(store.originalEditPriceRule, priceRuleData.value)
  }
  router.push('/catalogue/pricing')
}

const cancel = () => {
  router.push('/catalogue/pricing')
}
</script>

<template>
  <div class="fixed inset-0 bg-gray-900/50 z-[100] flex items-center justify-center p-4 sm:p-6 backdrop-blur-sm" @click.self="router.back()">
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      
      <!-- Close button on top right -->
      <button @click="router.back()" class="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 text-gray-400 hover:text-gray-600 bg-white hover:bg-gray-100 rounded-full z-50 shadow-sm transition-colors">
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <!-- Scrollable Body -->
      <div class="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 relative">
        
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <div class="text-[10px] text-gray-500 mb-1">Super Admin / Catalogue / Pricing / <span class="font-bold text-gray-800">Edit Price Rule</span></div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Edit Price Rule</h1>
        <p class="text-sm text-gray-500 mt-1">Update an existing pricing rule or branch override.</p>
      </div>
    </div>

    <!-- Form Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-1 md:grid-cols-2 gap-6">
      
      <!-- 1. Target & Scope -->
      <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
        <h3 class="text-[14px] font-bold text-gray-900 mb-2">1. Target & Scope</h3>
        
        <div>
          <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Target Product</label>
          <select v-model="priceRuleData.product" :class="showValidation && !priceRuleData.product ? 'border-red-300 bg-red-50/30 text-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-200 focus:ring-[#165A31] focus:border-[#165A31]'" class="w-full px-3 py-2 text-[12px] border rounded-lg focus:outline-none focus:ring-1 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)] bg-white">
            <option value="" disabled>Select a product...</option>
            <option>BRG DS11</option>
            <option>BRG EV-5</option>
            <option>Cargo Pro</option>
          </select>
          <p v-if="showValidation && !priceRuleData.product" class="text-[10px] text-red-500 mt-1.5 font-medium">This field is required.</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Branch Override</label>
            <select v-model="priceRuleData.branchOverride" class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)] bg-white">
              <option>None</option>
              <option>Peshawar</option>
              <option>Islamabad</option>
              <option>Lahore</option>
              <!-- Added mocked options based on data format "Peshawar: 205K" -->
              <option>Peshawar: 205K</option>
            </select>
          </div>
          <div>
            <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Effective Date</label>
            <input v-model="priceRuleData.effective" type="text" placeholder="e.g. Aug 10" class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />
          </div>
        </div>
      </div>

      <!-- 2. Pricing Configuration -->
      <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
        <h3 class="text-[14px] font-bold text-gray-900 mb-2">2. Pricing Configuration</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Selling Price</label>
            <input v-model="priceRuleData.sellingPrice" type="text" placeholder="e.g. 185K" :class="showValidation && !priceRuleData.sellingPrice ? 'border-red-300 bg-red-50/30 text-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-200 focus:ring-[#165A31] focus:border-[#165A31]'" class="w-full px-3 py-2 text-[12px] border rounded-lg focus:outline-none focus:ring-1 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />
            <p v-if="showValidation && !priceRuleData.sellingPrice" class="text-[10px] text-red-500 mt-1.5 font-medium">This field is required.</p>
          </div>
          <div>
            <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Minimum Allowed Floor</label>
            <input v-model="priceRuleData.minimum" type="text" placeholder="e.g. 176K" :class="showValidation && !priceRuleData.minimum ? 'border-red-300 bg-red-50/30 text-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-200 focus:ring-[#165A31] focus:border-[#165A31]'" class="w-full px-3 py-2 text-[12px] border rounded-lg focus:outline-none focus:ring-1 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />
            <p v-if="showValidation && !priceRuleData.minimum" class="text-[10px] text-red-500 mt-1.5 font-medium">This field is required.</p>
          </div>
        </div>
        
        <div class="p-4 bg-gray-50 rounded-lg border border-gray-100 mt-2">
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 mb-2">
            <span class="text-[11px] font-medium text-gray-500">Reference Landed Cost</span>
            <span class="text-[12px] font-bold text-gray-900">{{ priceRuleData.landedCostRef || 'N/A' }}</span>
          </div>
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 mb-2">
            <span class="text-[11px] font-medium text-gray-500">Calculated Markup</span>
            <span class="text-[12px] font-bold text-gray-900">{{ priceRuleData.markup || '0%' }}</span>
          </div>
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
            <span class="text-[11px] font-medium text-gray-500">Calculated Margin</span>
            <span class="text-[12px] font-bold text-gray-900">{{ priceRuleData.margin || '0%' }}</span>
          </div>
        </div>

        <div>
          <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Reason for Change</label>
          <input v-model="priceRuleData.reason" type="text" placeholder="e.g. Market update, Promo" class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />
        </div>
      </div>
    </div>

    <!-- Actions Footer -->
    <div class="flex items-center justify-end pt-4">
      <div class="flex flex-wrap items-center gap-3">
        <button @click="cancel" class="px-5 py-2 text-[11px] font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          Cancel
        </button>
        <button class="px-5 py-2 text-[11px] font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          Save Draft
        </button>
        <button @click="saveChanges" class="px-5 py-2 text-[11px] font-bold text-white bg-[#165A31] rounded-lg hover:bg-[#124a28] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
          Save Changes
        </button>
      </div>
    </div>
  </div>

      </div>
    </div>
  </div>
</template>
