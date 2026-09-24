<script setup>
import { ref, computed, onMounted } from 'vue'
import { CheckCircle2 } from 'lucide-vue-next'
import { store } from '@/store.js'

const isBranchUser = computed(() => store.isBranchUser())
const user = computed(() => store.currentUser)

const preferencesForm = ref({
  theme: 'Light',
  language: 'English',
  dateFormat: 'DD MMM YYYY',
  tableDensity: 'Comfortable',
  inventoryAlerts: 'Enabled',
  salesAlerts: 'Enabled',
  serviceAlerts: 'Enabled',
  managementMessages: 'Enabled'
})

const populateFromStore = () => {
  const sys = store.settings?.system || {}
  preferencesForm.value.theme = sys.theme || 'Light'
  preferencesForm.value.language = sys.language || 'English'
  preferencesForm.value.dateFormat = sys.dateFormat || 'DD MMM YYYY'
  preferencesForm.value.tableDensity = sys.tableDensity || 'Comfortable'
  preferencesForm.value.inventoryAlerts = sys.inventoryAlerts || 'Enabled'
  preferencesForm.value.salesAlerts = sys.salesAlerts || 'Enabled'
  preferencesForm.value.serviceAlerts = sys.serviceAlerts || 'Enabled'
  preferencesForm.value.managementMessages = sys.managementMessages || 'Enabled'
}

onMounted(() => {
  populateFromStore()
})

const showToast = ref(false)
const toastMessage = ref('')

const savePreferences = () => {
  try {
    store.updateSettings('system', preferencesForm.value)
    store.applyTheme(preferencesForm.value.theme)
    toastMessage.value = 'Preferences saved successfully!'
    showToast.value = true
    setTimeout(() => { showToast.value = false }, 3000)
  } catch (err) {
    toastMessage.value = `Error: ${err.message}`
    showToast.value = true
    setTimeout(() => { showToast.value = false }, 3000)
  }
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

    <!-- Header & Breadcrumbs (Matching Screenshot 5) -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <div class="text-[11px] text-gray-400 mb-1">
          <span v-if="isBranchUser">Branch Manager / Preferences / <span class="font-medium text-gray-600">Preferences</span></span>
          <span v-else>Super Admin / System / <span class="font-medium text-gray-600">Preferences</span></span>
        </div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Preferences</h1>
        <p class="text-xs text-gray-500 mt-1">Personalise display, language, date formats, notifications and table density.</p>
      </div>

      <button 
        @click="savePreferences"
        class="bg-[#165A31] text-white text-xs font-semibold px-5 py-2.5 rounded-lg hover:bg-[#124a28] transition-colors shadow-sm cursor-pointer"
      >
        Save Preferences
      </button>
    </div>

    <!-- 2-Card Layout (Matching Screenshot 5) -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
      
      <!-- Left Card: Appearance -->
      <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
        <h3 class="text-sm font-bold text-gray-900 mb-4">Appearance & Localization</h3>
        
        <div>
          <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Theme</label>
          <select 
            v-model="preferencesForm.theme"
            @change="store.applyTheme(preferencesForm.theme)"
            class="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors bg-white shadow-[0_1px_2px_rgba(0,0,0,0.01)] text-gray-800"
          >
            <option value="Light">Light</option>
            <option value="Dark">Dark</option>
            <option value="System">System Default</option>
          </select>
        </div>

        <div>
          <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Language</label>
          <select 
            v-model="preferencesForm.language"
            class="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors bg-white shadow-[0_1px_2px_rgba(0,0,0,0.01)] text-gray-800"
          >
            <option value="English">English</option>
            <option value="Urdu">Urdu (اردو)</option>
          </select>
        </div>

        <div>
          <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Date Format</label>
          <select 
            v-model="preferencesForm.dateFormat"
            class="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors bg-white shadow-[0_1px_2px_rgba(0,0,0,0.01)] text-gray-800"
          >
            <option value="DD MMM YYYY">DD MMM YYYY (e.g. 22 Sep 2026)</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD (e.g. 2026-09-22)</option>
            <option value="DD/MM/YYYY">DD/MM/YYYY (e.g. 22/09/2026)</option>
          </select>
        </div>

        <div>
          <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Table Density</label>
          <select 
            v-model="preferencesForm.tableDensity"
            class="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors bg-white shadow-[0_1px_2px_rgba(0,0,0,0.01)] text-gray-800"
          >
            <option value="Comfortable">Comfortable</option>
            <option value="Compact">Compact</option>
            <option value="Dense">Dense</option>
          </select>
        </div>
      </div>

      <!-- Right Card: Notifications -->
      <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
        <h3 class="text-sm font-bold text-gray-900 mb-4">Operational Notification Preferences</h3>
        
        <div>
          <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Inventory Alerts</label>
          <select 
            v-model="preferencesForm.inventoryAlerts"
            class="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors bg-white shadow-[0_1px_2px_rgba(0,0,0,0.01)] text-gray-800"
          >
            <option value="Enabled">Enabled</option>
            <option value="Disabled">Disabled</option>
          </select>
        </div>

        <div>
          <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Sales Alerts</label>
          <select 
            v-model="preferencesForm.salesAlerts"
            class="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors bg-white shadow-[0_1px_2px_rgba(0,0,0,0.01)] text-gray-800"
          >
            <option value="Enabled">Enabled</option>
            <option value="Disabled">Disabled</option>
          </select>
        </div>

        <div>
          <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Service Alerts</label>
          <select 
            v-model="preferencesForm.serviceAlerts"
            class="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors bg-white shadow-[0_1px_2px_rgba(0,0,0,0.01)] text-gray-800"
          >
            <option value="Enabled">Enabled</option>
            <option value="Disabled">Disabled</option>
          </select>
        </div>

        <div>
          <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Management Messages</label>
          <select 
            v-model="preferencesForm.managementMessages"
            class="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors bg-white shadow-[0_1px_2px_rgba(0,0,0,0.01)] text-gray-800"
          >
            <option value="Enabled">Enabled</option>
            <option value="Disabled">Disabled</option>
          </select>
        </div>
      </div>

    </div>
  </div>
</template>
