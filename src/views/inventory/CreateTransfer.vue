<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
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
        <div class="text-[10px] text-gray-500 mb-1">Super Admin / Inventory / Transfers / <span class="font-bold text-gray-800">Create Transfer</span></div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Create Transfer</h1>
        <p class="text-sm text-gray-500 mt-1">Move exact units between branches with dispatch and receiving control.</p>
      </div>
    </div>

    <!-- Form Content -->
    <div class="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Left Column -->
      <div class="space-y-6">
        <!-- Transfer Route Card -->
        <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6">
          <h3 class="text-[14px] font-bold text-gray-900 mb-5">Transfer Route</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-[11px] font-semibold text-gray-700 mb-1">From Branch</label>
              <input type="text" value="Islamabad" class="w-full px-3 py-2 text-[12px] bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors" />
            </div>
            <div>
              <label class="block text-[11px] font-semibold text-gray-700 mb-1">To Branch</label>
              <input type="text" value="Peshawar" class="w-full px-3 py-2 text-[12px] bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors" />
            </div>
            <div>
              <label class="block text-[11px] font-semibold text-gray-700 mb-1">Requested Date</label>
              <input type="text" class="w-full px-3 py-2 text-[12px] bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors" />
            </div>
          </div>
        </div>

        <!-- Dispatch Card -->
        <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6">
          <h3 class="text-[14px] font-bold text-gray-900 mb-5">Dispatch</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-[11px] font-semibold text-gray-700 mb-1">Carrier</label>
              <input type="text" value="Internal logistics" class="w-full px-3 py-2 text-[12px] bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors" />
            </div>
            <div>
              <label class="block text-[11px] font-semibold text-gray-700 mb-1">Expected Arrival</label>
              <input type="text" class="w-full px-3 py-2 text-[12px] bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors" />
            </div>
            <div>
              <label class="block text-[11px] font-semibold text-gray-700 mb-1">Notes</label>
              <textarea rows="3" class="w-full px-3 py-2 text-[12px] bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors resize-none">Urgent stock balancing.</textarea>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column -->
      <div class="space-y-6">
        <!-- Units Card -->
        <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6">
          <h3 class="text-[14px] font-bold text-gray-900 mb-5">Units</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-[11px] font-semibold text-gray-700 mb-1">BRG DS11</label>
              <input type="text" class="w-full px-3 py-2 text-[12px] bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors" />
            </div>
            <div>
              <label class="block text-[11px] font-semibold text-gray-700 mb-1">BRG EV-5</label>
              <input type="text" class="w-full px-3 py-2 text-[12px] bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors" />
            </div>
          </div>
        </div>

        <!-- Review Card -->
        <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6">
          <h3 class="text-[14px] font-bold text-gray-900 mb-5">Review</h3>
          <div class="space-y-4">
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 text-[11px]">
              <span class="text-gray-500 font-medium">Total Units</span>
              <span class="font-bold text-gray-900">4</span>
            </div>
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 text-[11px]">
              <span class="text-gray-500 font-medium">Current Ownership</span>
              <span class="font-bold text-gray-900">AJ ECODRIVE</span>
            </div>
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 text-[11px]">
              <span class="text-gray-500 font-medium">On Dispatch</span>
              <span class="font-bold text-gray-900">Transfer in Transit</span>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center justify-end gap-3 pt-4">
          <button @click="router.push('/inventory/transfers')" class="px-6 py-2 text-[12px] font-bold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
            Cancel
          </button>
          <button @click="router.push('/inventory/transfers')" class="px-6 py-2 text-[12px] font-bold text-white bg-[#165A31] rounded-lg hover:bg-[#114a28] transition-colors shadow-sm">
            Create Transfer
          </button>
        </div>
      </div>
    </div>

  </div>

      </div>
    </div>
  </div>
</template>