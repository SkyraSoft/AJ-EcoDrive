<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const cancel = () => {
  router.push('/organisation/branches')
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
        <div class="text-[10px] text-gray-500 mb-1">Super Admin / Organisation / Branches / <span class="font-bold text-gray-800">Create Branch</span></div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Create Branch</h1>
        <p class="text-sm text-gray-500 mt-1">Create a controlled operating location with manager, stock and expense settings.</p>
      </div>
    </div>

    <!-- Form Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-1 md:grid-cols-2 gap-6">
      
      <!-- 1. Branch Identity -->
      <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
        <h3 class="text-[14px] font-bold text-gray-900 mb-2">1. Branch Identity</h3>
        
        <div>
          <label class="block text-[11px] font-medium text-gray-900 mb-1.5">Branch Name</label>
          <input type="text" value="Select a value" class="w-full px-3 py-2 text-[12px] border border-red-300 bg-red-50/30 text-red-500 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 transition-colors" />
          <p class="text-[10px] text-red-500 mt-1.5 font-medium">This field is required.</p>
        </div>
        
        <div>
          <label class="block text-[11px] font-medium text-gray-900 mb-1.5">Branch Code (Reference / amount)</label>
          <input type="text" value="Invalid value" class="w-full px-3 py-2 text-[12px] border border-red-300 bg-red-50/30 text-red-500 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 transition-colors" />
          <p class="text-[10px] text-red-500 mt-1.5 font-medium">Enter a valid value before continuing.</p>
        </div>

        <div>
          <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Status</label>
          <input type="text" placeholder="Active" class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />
        </div>
      </div>

      <!-- 2. Location & Contact -->
      <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
        <h3 class="text-[14px] font-bold text-gray-900 mb-2">2. Location & Contact</h3>
        
        <div>
          <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Address</label>
          <input type="text" class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-[11px] font-medium text-gray-700 mb-1.5">City</label>
            <input type="text" class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />
          </div>
          <div>
            <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Area</label>
            <input type="text" class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Phone</label>
            <input type="text" class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />
          </div>
          <div>
            <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Email</label>
            <input type="text" class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />
          </div>
        </div>
      </div>

      <!-- 3. Management & Operations -->
      <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
        <h3 class="text-[14px] font-bold text-gray-900 mb-2">3. Management & Operations</h3>
        
        <div>
          <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Branch Manager</label>
          <select class="w-full px-3 py-2 text-[12px] text-gray-500 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)] bg-white appearance-none">
            <option value="">Select manager...</option>
            <option value="1">Ahsan Khan</option>
            <option value="2">Hassan Ali</option>
          </select>
        </div>
        
        <div>
          <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Opening Hours</label>
          <input type="text" class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />
        </div>

        <div>
          <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Default Stock Location</label>
          <input type="text" class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />
        </div>
      </div>

      <!-- 4. Controls -->
      <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
        <h3 class="text-[14px] font-bold text-gray-900 mb-2">4. Controls</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Expense Limit</label>
            <input type="text" class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />
          </div>
          <div>
            <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Discount Limit</label>
            <input type="text" class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />
          </div>
        </div>

        <div>
          <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Sales Settings</label>
          <input type="text" placeholder="Standard BRG retail rules" class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />
        </div>

        <div>
          <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Notes</label>
          <input type="text" placeholder="New city branch setup." class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />
        </div>
      </div>

    </div>

    <!-- Actions -->
    <div class="flex items-center justify-end gap-3 pt-4">
      <button @click="cancel" class="px-5 py-2 text-[11px] font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
        Cancel
      </button>
      <button class="px-5 py-2 text-[11px] font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
        Save Draft
      </button>
      <button class="px-5 py-2 text-[11px] font-bold text-white bg-[#165A31] rounded-lg hover:bg-[#124a28] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
        Review & Create Branch
      </button>
    </div>
  </div>

      </div>
    </div>
  </div>
</template>