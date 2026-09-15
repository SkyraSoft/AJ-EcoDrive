<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { store } from '../../store.js'

const router = useRouter()

const branchData = ref({
  name: '',
  code: '',
  status: '',
  address: '',
  city: '',
  area: '',
  phone: '',
  email: '',
  manager: '',
  defaultLocation: '',
  hours: '',
  expenseLimit: '',
  discountLimit: '',
  salesRules: '',
  changeNote: ''
})

onMounted(() => {
  if (store.originalEditBranch) {
    branchData.value = { ...branchData.value, ...store.originalEditBranch }
  }
})

const showValidation = ref(false)

const saveChanges = () => {
  if (!branchData.value.name || !branchData.value.code || !branchData.value.status) {
    showValidation.value = true
    return
  }

  if (store.originalEditBranch) {
    store.applyEdit(store.originalEditBranch, branchData.value)
  }
  router.push('/organisation/branches')
}

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
        
  <div class="max-w-5xl mx-auto space-y-6 pb-12">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <div class="text-[10px] text-gray-500 mb-1">Super Admin / Organisation / Branches / <span class="font-bold text-gray-800">Edit Branch</span></div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Edit Branch</h1>
        <p class="text-[13px] text-gray-500 mt-1">Update branch configuration or archive the location without deleting history.</p>
      </div>
    </div>

    <!-- Top Card -->
    <div class="bg-white rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
      <div class="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
        <div>
          <h2 class="text-[20px] font-bold text-gray-900 leading-none mb-2">{{ branchData.name || 'Branch Name' }}</h2>
          <div class="text-[11px] font-medium text-gray-500">
            {{ branchData.code || 'CODE-00' }} - {{ branchData.status || 'Status' }}
          </div>
        </div>
        <div>
          <button class="text-[11px] font-bold text-red-600 bg-red-50 border border-red-100 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors">
            Archive Branch
          </button>
        </div>
      </div>
    </div>

    <!-- Form Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-1 md:grid-cols-2 gap-6">
      
      <!-- 1. Identity -->
      <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
        <h3 class="text-[13px] font-bold text-gray-900 mb-2">Identity</h3>
        
        <div>
          <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Branch Name</label>
          <input v-model="branchData.name" type="text" :class="showValidation && !branchData.name ? 'border-red-300 bg-red-50/30 text-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-200 focus:ring-[#165A31] focus:border-[#165A31]'" class="w-full px-3 py-2 text-[12px] border rounded-lg focus:outline-none focus:ring-1 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />
          <p v-if="showValidation && !branchData.name" class="text-[10px] text-red-500 mt-1.5 font-medium">This field is required.</p>
        </div>
        
        <div>
          <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Branch Code</label>
          <input v-model="branchData.code" type="text" :class="showValidation && !branchData.code ? 'border-red-300 bg-red-50/30 text-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-200 focus:ring-[#165A31] focus:border-[#165A31]'" class="w-full px-3 py-2 text-[12px] border rounded-lg focus:outline-none focus:ring-1 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />
          <p v-if="showValidation && !branchData.code" class="text-[10px] text-red-500 mt-1.5 font-medium">This field is required.</p>
        </div>

        <div>
          <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Status</label>
          <input v-model="branchData.status" type="text" placeholder="Active" :class="showValidation && !branchData.status ? 'border-red-300 bg-red-50/30 text-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-200 focus:ring-[#165A31] focus:border-[#165A31]'" class="w-full px-3 py-2 text-[12px] border rounded-lg focus:outline-none focus:ring-1 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />
          <p v-if="showValidation && !branchData.status" class="text-[10px] text-red-500 mt-1.5 font-medium">This field is required.</p>
        </div>
      </div>

      <!-- 2. Location & Contact -->
      <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
        <h3 class="text-[13px] font-bold text-gray-900 mb-2">Location & Contact</h3>
        
        <div>
          <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Address</label>
          <input v-model="branchData.address" type="text" class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-[11px] font-medium text-gray-700 mb-1.5">City</label>
            <input v-model="branchData.city" type="text" class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />
          </div>
          <div>
            <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Area</label>
            <input v-model="branchData.area" type="text" class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Phone</label>
            <input v-model="branchData.phone" type="text" class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />
          </div>
          <div>
            <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Email</label>
            <input v-model="branchData.email" type="text" class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />
          </div>
        </div>
      </div>

      <!-- 3. Manager & Operations -->
      <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
        <h3 class="text-[13px] font-bold text-gray-900 mb-2">Manager & Operations</h3>
        
        <div>
          <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Branch Manager</label>
          <input v-model="branchData.manager" type="text" placeholder="Ahsan Khan" class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />
        </div>
        
        <div>
          <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Default Stock Location</label>
          <input v-model="branchData.defaultLocation" type="text" class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />
        </div>

        <div>
          <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Opening Hours</label>
          <input v-model="branchData.hours" type="text" class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />
        </div>
      </div>

      <!-- 4. Controls -->
      <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
        <h3 class="text-[13px] font-bold text-gray-900 mb-2">Controls</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Expense Limit</label>
            <input v-model="branchData.expenseLimit" type="text" class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />
          </div>
          <div>
            <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Discount Limit</label>
            <input v-model="branchData.discountLimit" type="text" class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />
          </div>
        </div>

        <div>
          <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Sales Rules</label>
          <input v-model="branchData.salesRules" type="text" placeholder="Standard BRG retail rules" class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />
        </div>

        <div>
          <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Change Note</label>
          <input v-model="branchData.changeNote" type="text" placeholder="Quarterly branch configuration review." class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />
        </div>
      </div>

    </div>

    <!-- Actions -->
    <div class="flex items-center justify-end gap-3 pt-4">
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
</template>