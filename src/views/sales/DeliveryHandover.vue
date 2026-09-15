<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Check } from 'lucide-vue-next'

const router = useRouter()

const formData = ref({
  recipientName: '',
  handoverDate: '',
  notes: 'Unit inspected and accepted by customer.'
})

const submitHandover = () => {
  // In a real app, this would submit the data
  router.push('/sales/orders')
}
</script>

<template>
  <div class="max-w-[1400px] mx-auto space-y-6 pb-12">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 mb-8">
      <div>
        <div class="text-[10px] text-gray-500 mb-1">Super Admin / Sales & CRM / <span class="font-bold text-gray-800">Delivery / Handover</span></div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Delivery / Handover</h1>
        <p class="text-sm text-gray-500 mt-1">Complete customer handover and move the reserved unit to Sold.</p>
      </div>
    </div>

    <!-- Status Bar -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6 rounded-xl">
      <div>
        <h2 class="text-xl font-bold text-gray-900">Handover · SO-7731</h2>
        <p class="text-[12px] text-gray-500 mt-1">Saad Ahmad · DS11-00988</p>
      </div>
      <div>
        <span class="inline-flex items-center px-3 py-1.5 rounded-[4px] text-[11px] font-bold bg-[#eefcf2] text-[#165A31]">Ready</span>
      </div>
    </div>

    <!-- Verification Checklists -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-white rounded-xl border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6">
        <h3 class="text-[14px] font-bold text-gray-900 mb-4">Customer Verification</h3>
        <div class="grid grid-cols-2 gap-y-4">
          <div class="flex items-center gap-2">
            <Check class="w-4 h-4 text-gray-400" />
            <span class="text-[12px] text-gray-700">Customer Identity verified</span>
          </div>
          <div class="flex items-center gap-2">
            <Check class="w-4 h-4 text-gray-400" />
            <span class="text-[12px] text-gray-700">Payment complete</span>
          </div>
          <div class="flex items-center gap-2">
            <Check class="w-4 h-4 text-gray-400" />
            <span class="text-[12px] text-gray-700">Invoice issued</span>
          </div>
          <div class="flex items-center gap-2">
            <Check class="w-4 h-4 text-gray-400" />
            <span class="text-[12px] text-gray-700">Order signed</span>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6">
        <h3 class="text-[14px] font-bold text-gray-900 mb-4">Unit Verification</h3>
        <div class="grid grid-cols-2 gap-y-4">
          <div class="flex items-center gap-2">
            <Check class="w-4 h-4 text-gray-400" />
            <span class="text-[12px] text-gray-700">Serial DS11-00988</span>
          </div>
          <div class="flex items-center gap-2">
            <Check class="w-4 h-4 text-gray-400" />
            <span class="text-[12px] text-gray-700">Chassis CH-88165</span>
          </div>
          <div class="flex items-center gap-2">
            <Check class="w-4 h-4 text-gray-400" />
            <span class="text-[12px] text-gray-700">Accessories included</span>
          </div>
          <div class="flex items-center gap-2">
            <Check class="w-4 h-4 text-gray-400" />
            <span class="text-[12px] text-gray-700">Warranty explained</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Handover Confirmation Form -->
    <div class="bg-white rounded-xl border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6 space-y-6">
      <h3 class="text-[14px] font-bold text-gray-900">Handover Confirmation</h3>
      
      <div>
        <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Recipient Name</label>
        <input v-model="formData.recipientName" type="text" class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors" />
      </div>

      <div>
        <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Handover Date</label>
        <input v-model="formData.handoverDate" type="text" class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors" />
      </div>

      <div>
        <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Notes</label>
        <textarea v-model="formData.notes" rows="3" class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors"></textarea>
      </div>
    </div>

    <!-- Footer Actions -->
    <div class="flex justify-end gap-3 pt-4">
      <button class="px-5 py-2 text-[11px] font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
        Cancel
      </button>
      <button @click="submitHandover" class="px-5 py-2 text-[11px] font-bold text-white bg-[#165A31] rounded-lg hover:bg-[#124a28] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
        Complete Handover & Mark Sold
      </button>
    </div>
  </div>
</template>
