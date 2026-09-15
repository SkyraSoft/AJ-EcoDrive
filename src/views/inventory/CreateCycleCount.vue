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
    <div class="flex flex-wrap items-center gap-4">
      <button @click="router.push('/inventory/cycle-counts')" class="p-2 hover:bg-gray-100 rounded-full transition-colors">
        <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </button>
      <div>
        <div class="text-[10px] text-gray-500 mb-1">Super Admin / Inventory / Cycle Counts / <span class="font-bold text-gray-800">Create Cycle Count</span></div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Create Cycle Count</h1>
      </div>
    </div>

    <!-- Form Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-1 md:grid-cols-2 gap-6">
      
      <!-- Scope Card -->
      <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6">
        <h2 class="text-[16px] font-bold text-gray-900 mb-6">Scope</h2>
        
        <div class="space-y-5">
          <!-- Branch -->
          <div>
            <label class="block text-[11px] font-bold text-gray-700 mb-1">Branch</label>
            <div class="relative">
              <select class="w-full pl-3 pr-10 py-2.5 text-[12px] bg-white border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)] text-gray-900 font-medium">
                <option>Islamabad</option>
                <option>Peshawar</option>
                <option>Lahore</option>
              </select>
              <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-400">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Count Scope -->
          <div>
            <label class="block text-[11px] font-bold text-gray-700 mb-1">Count Scope</label>
            <div class="relative">
              <select class="w-full pl-3 pr-10 py-2.5 text-[12px] bg-white border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)] text-gray-900 font-medium">
                <option>Product Category</option>
                <option>Full Branch</option>
                <option>Specific Items</option>
              </select>
              <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-400">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Categories to Count -->
          <div>
            <label class="block text-[11px] font-bold text-gray-700 mb-1">Categories to Count</label>
            <div class="relative">
              <div class="w-full pl-3 pr-10 py-2 text-[12px] bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)] flex flex-wrap gap-2 min-h-[42px] items-center cursor-pointer">
                <span class="inline-flex items-center px-2.5 py-1 rounded-[6px] text-[10px] font-bold bg-gray-100 text-gray-700 border border-gray-200">
                  EV-5 (12 units)
                  <svg class="w-3 h-3 ml-1.5 text-gray-400 hover:text-gray-600 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </span>
                <span class="inline-flex items-center px-2.5 py-1 rounded-[6px] text-[10px] font-bold bg-gray-100 text-gray-700 border border-gray-200">
                  DS-11 (8 units)
                  <svg class="w-3 h-3 ml-1.5 text-gray-400 hover:text-gray-600 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </span>
              </div>
              <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-400">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Assignment Card -->
      <div class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6">
        <h2 class="text-[16px] font-bold text-gray-900 mb-6">Assignment</h2>
        
        <div class="space-y-5">
          <!-- Assigned Counter -->
          <div>
            <label class="block text-[11px] font-bold text-gray-700 mb-1">Assigned Counter</label>
            <div class="relative">
              <select class="w-full pl-3 pr-10 py-2.5 text-[12px] bg-white border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)] text-gray-900 font-medium">
                <option>Ahsan Khan</option>
                <option>Hassan Ali</option>
                <option>Sami Ullah</option>
              </select>
              <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-400">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Scheduled Date -->
          <div>
            <label class="block text-[11px] font-bold text-gray-700 mb-1">Scheduled Date</label>
            <div class="relative">
              <input 
                type="text" 
                value="Aug 30, 2024"
                class="w-full pl-10 pr-3 py-2.5 text-[12px] bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)] text-gray-900 font-medium"
              />
              <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Instructions -->
          <div>
            <label class="block text-[11px] font-bold text-gray-700 mb-1">Instructions</label>
            <textarea 
              rows="4"
              class="w-full px-3 py-2.5 text-[12px] bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)] text-gray-900 font-medium resize-none"
            >Verify serial numbers carefully against the system manifest.</textarea>
          </div>
        </div>
      </div>

    </div>

    <!-- Bottom Actions -->
    <div class="flex items-center justify-end gap-3 pt-4">
      <button @click="router.push('/inventory/cycle-counts')" class="px-5 py-2.5 text-[11px] font-bold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
        Cancel
      </button>
      <button @click="router.push('/inventory/cycle-counts')" class="px-5 py-2.5 text-[11px] font-bold text-white bg-[#165A31] rounded-lg hover:bg-[#114a28] transition-colors shadow-sm">
        Generate Count List
      </button>
    </div>
  </div>

      </div>
    </div>
  </div>
</template>