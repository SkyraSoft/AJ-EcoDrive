<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { store } from '../../store.js'

const router = useRouter()

const supplierData = ref({
  name: '',
  contact: '',
  phone: '',
  email: '',
  address: '',
  currency: '',
  terms: '',
  taxId: '',
  notes: ''
})

onMounted(() => {
  if (store.originalEditSupplier) {
    supplierData.value = { ...supplierData.value, ...store.originalEditSupplier }
  }
})

const showValidation = ref(false)

const saveChanges = () => {
  if (!supplierData.value.name || !supplierData.value.contact || !supplierData.value.phone) {
    showValidation.value = true
    return
  }

  if (store.originalEditSupplier) {
    store.applyEdit(store.originalEditSupplier, supplierData.value)
  }
  router.push('/procurement/suppliers')
}

const cancel = () => {
  router.push('/procurement/suppliers')
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
        <div class="text-[10px] text-gray-500 mb-1">Super Admin / Procurement / Suppliers / <span class="font-bold text-gray-800">Edit Supplier</span></div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Edit Supplier</h1>
        <p class="text-sm text-gray-500 mt-1">Update profile information for BRG Factory.</p>
      </div>
    </div>

    <!-- Form Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-1 md:grid-cols-2 gap-6">
      
      <!-- 1. Supplier Identity -->
      <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
        <h3 class="text-[14px] font-bold text-gray-900 mb-2">1. Supplier Identity</h3>
        
        <div>
          <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Company Name</label>
          <input v-model="supplierData.name" type="text" :class="showValidation && !supplierData.name ? 'border-red-300 bg-red-50/30 text-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-200 focus:ring-[#165A31] focus:border-[#165A31]'" class="w-full px-3 py-2 text-[12px] border rounded-lg focus:outline-none focus:ring-1 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />
          <p v-if="showValidation && !supplierData.name" class="text-[10px] text-red-500 mt-1.5 font-medium">This field is required.</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Primary Contact</label>
            <input v-model="supplierData.contact" type="text" :class="showValidation && !supplierData.contact ? 'border-red-300 bg-red-50/30 text-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-200 focus:ring-[#165A31] focus:border-[#165A31]'" class="w-full px-3 py-2 text-[12px] border rounded-lg focus:outline-none focus:ring-1 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />
            <p v-if="showValidation && !supplierData.contact" class="text-[10px] text-red-500 mt-1.5 font-medium">This field is required.</p>
          </div>
          <div>
            <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Phone Number</label>
            <input v-model="supplierData.phone" type="text" :class="showValidation && !supplierData.phone ? 'border-red-300 bg-red-50/30 text-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-200 focus:ring-[#165A31] focus:border-[#165A31]'" class="w-full px-3 py-2 text-[12px] border rounded-lg focus:outline-none focus:ring-1 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />
            <p v-if="showValidation && !supplierData.phone" class="text-[10px] text-red-500 mt-1.5 font-medium">This field is required.</p>
          </div>
        </div>

        <div>
          <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Email Address</label>
          <input v-model="supplierData.email" type="email" class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />
        </div>
        
        <div>
          <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Business Address</label>
          <textarea v-model="supplierData.address" rows="2" class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]"></textarea>
        </div>
      </div>

      <!-- 2. Commercial & Operational -->
      <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
        <h3 class="text-[14px] font-bold text-gray-900 mb-2">2. Commercial & Operational</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Currency</label>
            <select v-model="supplierData.currency" class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)] bg-white">
              <option value="PKR">PKR (Pakistani Rupee)</option>
              <option value="USD">USD (US Dollar)</option>
              <option value="CNY">CNY (Chinese Yuan)</option>
            </select>
          </div>
          <div>
            <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Payment Terms</label>
            <select v-model="supplierData.terms" class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)] bg-white">
              <option value="Advance">Advance</option>
              <option value="Net 15">Net 15</option>
              <option value="Net 30">Net 30</option>
              <option value="Net 60">Net 60</option>
            </select>
          </div>
        </div>

        <div>
          <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Tax ID / NTN</label>
          <input v-model="supplierData.taxId" type="text" class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />
        </div>

        <div>
          <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Internal Notes</label>
          <textarea v-model="supplierData.notes" rows="3" class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]"></textarea>
        </div>
      </div>
    </div>

    <!-- Actions Footer -->
    <div class="flex items-center justify-end pt-4">
      <div class="flex flex-wrap items-center gap-3">
        <button @click="cancel" class="px-5 py-2 text-[11px] font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          Cancel
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