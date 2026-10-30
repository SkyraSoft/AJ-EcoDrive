<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { store } from '../../store.js'
import { api } from '@/services/api.js'

const router = useRouter()
const emit = defineEmits(['close', 'created'])

const form = ref({
  name: '',
  contact: '',
  phone: '',
  email: '',
  address: '',
  currency: 'PKR (Pakistani Rupee)',
  terms: 'Net 30',
  taxId: '',
  notes: ''
})

const showValidation = ref(false)
const isSubmitting = ref(false)
const apiError = ref(null)

const submitForm = async () => {
  if (!form.value.name.trim() || !form.value.contact.trim() || !form.value.phone.trim()) {
    showValidation.value = true
    return
  }

  isSubmitting.value = true
  apiError.value = null

  const payload = {
    name: form.value.name.trim(),
    contact: form.value.contact.trim(),
    phone: form.value.phone.trim(),
    email: form.value.email.trim(),
    address: form.value.address.trim(),
    currency: form.value.currency,
    terms: form.value.terms,
    tax_id: form.value.taxId?.trim() || '',
    taxId: form.value.taxId?.trim() || '',
    notes: form.value.notes?.trim() || ''
  }

  try {
    const res = await api.procurement.createSupplier(payload)
    const createdSupplier = res?.data || res

    store.addSupplier(createdSupplier)
    emit('created', createdSupplier)
    emit('close')
    router.push('/procurement/suppliers')
  } catch (err) {
    console.error('Failed to create supplier via API:', err)
    apiError.value = err.data?.message || err.message || 'Failed to create supplier. Server rejected request.'
  } finally {
    isSubmitting.value = false
  }
}

const cancel = () => {
  emit('close')
  router.push('/procurement/suppliers')
}
</script>


<template>
  <div class="fixed inset-0 bg-gray-900/50 z-[100] flex items-center justify-center p-4 sm:p-6 backdrop-blur-sm" @click.self="cancel">
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      
      <!-- Close button on top right -->
      <button @click="cancel" class="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 text-gray-400 hover:text-gray-600 bg-white hover:bg-gray-100 rounded-full z-50 shadow-sm transition-colors cursor-pointer">
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <!-- Scrollable Body -->
      <div class="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 relative">
        
  <div data-tour-id="sa.procurement.suppliers.create-form" class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <div class="text-[10px] text-gray-500 mb-1">Super Admin / Procurement / Suppliers / <span class="font-bold text-gray-800">Add Supplier</span></div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Add Supplier</h1>
        <p class="text-sm text-gray-500 mt-1">Create a new vendor profile for procurement and purchasing.</p>
      </div>
    </div>

    <!-- API Error Banner -->
    <div v-if="apiError" class="p-3.5 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs flex items-center justify-between">
      <span>{{ apiError }}</span>
      <button @click="apiError = null" class="text-red-500 hover:text-red-800 font-bold ml-2">&times;</button>
    </div>

    <!-- Form Grid -->

    <div class="grid grid-cols-1 lg:grid-cols-1 md:grid-cols-2 gap-6">
      
      <!-- 1. Supplier Identity -->
      <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
        <h3 class="text-[14px] font-bold text-gray-900 mb-2">1. Supplier Identity</h3>
        
        <div>
          <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Company Name <span class="text-red-500">*</span></label>
          <input v-model="form.name" type="text" placeholder="e.g. BRG Factory" :class="showValidation && !form.name?.trim() ? 'border-red-300 bg-red-50/30' : 'border-gray-200'" class="w-full px-3 py-2 text-[12px] border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />
          <p v-if="showValidation && !form.name?.trim()" class="text-[10px] text-red-500 mt-1 font-medium">This field is required.</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Primary Contact <span class="text-red-500">*</span></label>
            <input v-model="form.contact" type="text" placeholder="e.g. Li Wei" :class="showValidation && !form.contact?.trim() ? 'border-red-300 bg-red-50/30' : 'border-gray-200'" class="w-full px-3 py-2 text-[12px] border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />
            <p v-if="showValidation && !form.contact?.trim()" class="text-[10px] text-red-500 mt-1 font-medium">This field is required.</p>
          </div>
          <div>
            <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Phone Number <span class="text-red-500">*</span></label>
            <input v-model="form.phone" type="text" placeholder="e.g. +86 21 8839 0112" :class="showValidation && !form.phone?.trim() ? 'border-red-300 bg-red-50/30' : 'border-gray-200'" class="w-full px-3 py-2 text-[12px] border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />
            <p v-if="showValidation && !form.phone?.trim()" class="text-[10px] text-red-500 mt-1 font-medium">This field is required.</p>
          </div>
        </div>

        <div>
          <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Email Address</label>
          <input v-model="form.email" type="email" placeholder="e.g. sales@brgfactory.cn" class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />
        </div>
        
        <div>
          <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Business Address</label>
          <textarea v-model="form.address" rows="2" placeholder="e.g. Industrial Park, Building 4, Shanghai" class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]"></textarea>
        </div>
      </div>

      <!-- 2. Commercial & Operational -->
      <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
        <h3 class="text-[14px] font-bold text-gray-900 mb-2">2. Commercial & Operational</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Currency</label>
            <select v-model="form.currency" class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)] bg-white">
              <option>PKR (Pakistani Rupee)</option>
              <option>USD (US Dollar)</option>
              <option>CNY (Chinese Yuan)</option>
            </select>
          </div>
          <div>
            <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Payment Terms</label>
            <select v-model="form.terms" class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)] bg-white">
              <option>Advance</option>
              <option>Net 15</option>
              <option>Net 30</option>
              <option>Net 60</option>
            </select>
          </div>
        </div>

        <div>
          <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Tax ID / NTN</label>
          <input v-model="form.taxId" type="text" placeholder="e.g. 1234567-8" class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />
        </div>

        <div>
          <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Internal Notes</label>
          <textarea v-model="form.notes" rows="3" placeholder="Contract details, performance notes, etc." class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]"></textarea>
        </div>
      </div>
    </div>

    <!-- Actions Footer -->
    <div class="flex items-center justify-end pt-4">
      <div class="flex flex-wrap items-center gap-3">
        <button :disabled="isSubmitting" @click="cancel" class="px-5 py-2 text-[11px] font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)] cursor-pointer disabled:opacity-50">
          Cancel
        </button>
        <button :disabled="isSubmitting" @click="submitForm" class="px-5 py-2 text-[11px] font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)] cursor-pointer disabled:opacity-50">
          Save Draft
        </button>
        <button :disabled="isSubmitting" @click="submitForm" data-tour-id="sa.procurement.suppliers.save-btn" class="px-5 py-2 text-[11px] font-bold text-white bg-[#165A31] rounded-lg hover:bg-[#124a28] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.05)] cursor-pointer disabled:opacity-50 flex items-center gap-1.5">
          <span v-if="isSubmitting">Creating...</span>
          <span v-else>Create Supplier</span>
        </button>
      </div>
    </div>

  </div>

      </div>
    </div>
  </div>
</template>