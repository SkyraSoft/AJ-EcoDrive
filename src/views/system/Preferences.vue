<script setup>
import { ref } from 'vue'
import { CheckCircle2 } from 'lucide-vue-next'

const preferences = ref({
  theme: 'LightDarkSystem',
  tableDensity: 'Comfortable',
  language: 'English',
  dateFormat: 'DD MMM YYYY',
  timezone: 'Asia/Karachi',
  currencyDisplay: 'PKR 185,000',
  decimalPrecision: '0 for PKR',
  defaultDateRange: 'This Month',
  defaultScope: 'All Branches'
})

const defaultPreferences = {
  theme: 'LightDarkSystem',
  tableDensity: 'Comfortable',
  language: 'English',
  dateFormat: 'DD MMM YYYY',
  timezone: 'Asia/Karachi',
  currencyDisplay: 'PKR 185,000',
  decimalPrecision: '0 for PKR',
  defaultDateRange: 'This Month',
  defaultScope: 'All Branches'
}

const showToast = ref(false)
const toastMessage = ref('')

const savePreferences = () => {
  toastMessage.value = 'Preferences saved successfully!'
  showToast.value = true
  setTimeout(() => { showToast.value = false }, 3000)
}

const resetPreferences = () => {
  preferences.value = { ...defaultPreferences }
  toastMessage.value = 'Preferences reset to default values.'
  showToast.value = true
  setTimeout(() => { showToast.value = false }, 3000)
}
</script>

<template>
  <div class="max-w-[1400px] mx-auto space-y-6 pb-12">
    <!-- Toast Notification -->
    <div 
      v-if="showToast" 
      class="fixed bottom-5 right-5 z-[110] bg-[#165A31] text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-200"
    >
      <CheckCircle2 class="w-5 h-5 text-green-300" />
      <span class="text-xs font-bold">{{ toastMessage }}</span>
    </div>

    <!-- Header & Breadcrumbs -->
    <div>
      <div class="text-[10px] text-gray-500 mb-1">
        Super Admin / System / <span class="font-bold text-gray-800">Preferences</span>
      </div>
      <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Preferences</h1>
      <p class="text-sm text-gray-500 mt-1">Configure personal appearance, localization and table behavior.</p>
    </div>

    <!-- 2x2 Grid of Settings Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
      <!-- 1. Appearance Card -->
      <div class="bg-white p-6 sm:p-7 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
        <h3 class="text-[13px] font-bold text-gray-900">Appearance</h3>
        
        <div class="space-y-4">
          <div>
            <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Theme</label>
            <input 
              v-model="preferences.theme"
              type="text" 
              class="w-full px-3.5 py-2.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)] text-gray-800"
            />
          </div>

          <div>
            <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Table Density</label>
            <input 
              v-model="preferences.tableDensity"
              type="text" 
              class="w-full px-3.5 py-2.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)] text-gray-800"
            />
          </div>
        </div>
      </div>

      <!-- 2. Localization Card -->
      <div class="bg-white p-6 sm:p-7 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
        <h3 class="text-[13px] font-bold text-gray-900">Localization</h3>
        
        <div class="space-y-4">
          <div>
            <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Language</label>
            <input 
              v-model="preferences.language"
              type="text" 
              class="w-full px-3.5 py-2.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)] text-gray-800"
            />
          </div>

          <div>
            <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Date Format</label>
            <input 
              v-model="preferences.dateFormat"
              type="text" 
              class="w-full px-3.5 py-2.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)] text-gray-800"
            />
          </div>

          <div>
            <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Timezone</label>
            <input 
              v-model="preferences.timezone"
              type="text" 
              class="w-full px-3.5 py-2.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)] text-gray-800"
            />
          </div>
        </div>
      </div>

      <!-- 3. Numbers Card -->
      <div class="bg-white p-6 sm:p-7 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
        <h3 class="text-[13px] font-bold text-gray-900">Numbers</h3>
        
        <div class="space-y-4">
          <div>
            <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Currency Display</label>
            <input 
              v-model="preferences.currencyDisplay"
              type="text" 
              class="w-full px-3.5 py-2.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)] text-gray-800"
            />
          </div>

          <div>
            <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Decimal Precision</label>
            <input 
              v-model="preferences.decimalPrecision"
              type="text" 
              class="w-full px-3.5 py-2.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)] text-gray-800"
            />
          </div>
        </div>
      </div>

      <!-- 4. Defaults Card -->
      <div class="bg-white p-6 sm:p-7 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
        <h3 class="text-[13px] font-bold text-gray-900">Defaults</h3>
        
        <div class="space-y-4">
          <div>
            <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Default Date Range</label>
            <input 
              v-model="preferences.defaultDateRange"
              type="text" 
              class="w-full px-3.5 py-2.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)] text-gray-800"
            />
          </div>

          <div>
            <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Default Scope</label>
            <input 
              v-model="preferences.defaultScope"
              type="text" 
              class="w-full px-3.5 py-2.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)] text-gray-800"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Actions -->
    <div class="flex items-center justify-end gap-3 pt-2">
      <button 
        @click="resetPreferences"
        class="bg-white border border-gray-200 text-gray-700 text-xs font-semibold px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer shadow-sm"
      >
        Reset
      </button>
      <button 
        @click="savePreferences"
        class="bg-[#165A31] text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-[#124a28] transition-colors cursor-pointer shadow-sm"
      >
        Save Preferences
      </button>
    </div>

  </div>
</template>
