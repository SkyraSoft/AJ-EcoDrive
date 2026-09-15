<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const cancel = () => {
  router.push('/procurement/purchase-returns')
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
        <div class="text-[10px] text-gray-500 mb-1">Super Admin / Procurement / Purchase Returns / <span class="font-bold text-gray-800">Create</span></div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Create Purchase Return</h1>
        <p class="text-sm text-gray-500 mt-1">Initiate a return for defective or rejected units.</p>
      </div>
      <div>
        <button class="px-4 py-1.5 text-[11px] font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          Save Draft
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      
      <!-- Main Form -->
      <div class="lg:col-span-2 space-y-6">
        
        <!-- Return Details -->
        <div class="bg-white rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6">
          <h2 class="text-[14px] font-bold text-gray-900 mb-4">Return Details</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Supplier</label>
              <select class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)] bg-white">
                <option value="">Select Supplier</option>
                <option>BRG Factory</option>
                <option>Pak Logistics</option>
              </select>
            </div>
            <div>
              <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Original PO / Receipt</label>
              <select class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)] bg-white">
                <option value="">Select PO</option>
                <option>PO-2048</option>
                <option>PO-2022</option>
              </select>
            </div>
            <div class="md:col-span-2">
              <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Reason for Return</label>
              <input type="text" placeholder="e.g. Transit damage, QC failure" class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />
            </div>
          </div>
        </div>

        <!-- Units to Return -->
        <div class="bg-white rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden flex flex-col">
          <div class="p-6 border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
            <h3 class="text-[14px] font-bold text-gray-900">Units to Return</h3>
            <button class="text-[11px] font-bold text-[#165A31] hover:text-[#124a28] transition-colors">+ Add Item</button>
          </div>
          <div class="overflow-x-auto flex-1 p-6 pt-0">
            <div class="w-full overflow-x-auto"><table class="w-full text-left border-collapse mt-4">
              <thead>
                <tr class="bg-[#fbfbfc] border-b border-gray-100 text-[10px] font-bold text-gray-400">
                  <th class="px-5 py-3 rounded-tl-lg">Product / Serial</th>
                  <th class="px-5 py-3">Credit Value</th>
                  <th class="px-5 py-3 rounded-tr-lg"></th>
                </tr>
              </thead>
              <tbody class="text-[11px]">
                <tr class="border-b border-gray-50">
                  <td class="px-5 py-4">
                    <input type="text" placeholder="Select product or scan serial" class="w-full px-3 py-1.5 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31]" />
                  </td>
                  <td class="px-5 py-4">
                    <input type="text" placeholder="PKR" class="w-full px-3 py-1.5 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31]" />
                  </td>
                  <td class="px-5 py-4 text-right">
                    <button class="text-gray-400 hover:text-red-500 font-bold">&times;</button>
                  </td>
                </tr>
              </tbody>
            </table></div>
          </div>
        </div>
      </div>

      <!-- Sidebar Form Summary -->
      <div class="space-y-6">
        <div class="bg-white rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6">
          <h3 class="text-[14px] font-bold text-gray-900 mb-4">Summary</h3>
          <div class="space-y-3">
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 text-[11px]">
              <span class="text-gray-500 font-medium">Total Units</span>
              <span class="font-bold text-gray-900">0</span>
            </div>
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 text-[11px]">
              <span class="text-gray-500 font-medium">Estimated Credit</span>
              <span class="font-bold text-gray-900">PKR 0</span>
            </div>
            <div class="pt-4 mt-4 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
              <span class="text-[11px] font-bold text-gray-900">Status</span>
              <span class="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[10px] font-bold bg-gray-100 text-gray-600">Draft</span>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- Actions Footer -->
    <div class="flex items-center justify-end pt-4">
      <div class="flex flex-wrap items-center gap-3">
        <button @click="cancel" class="px-5 py-2 text-[11px] font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          Cancel
        </button>
        <button class="px-5 py-2 text-[11px] font-bold text-white bg-[#165A31] rounded-lg hover:bg-[#124a28] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
          Submit Return
        </button>
      </div>
    </div>
  </div>

      </div>
    </div>
  </div>
</template>