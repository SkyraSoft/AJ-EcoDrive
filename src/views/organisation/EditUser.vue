<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { store } from '../../store.js'

const router = useRouter()

const userData = ref({
  name: '',
  email: '',
  mobile: '',
  role: '',
  branch: '',
  status: '',
  mfa: '',
  invitation: '',
  sessionPolicy: ''
})

onMounted(() => {
  if (store.originalEditUser) {
    userData.value = { ...userData.value, ...store.originalEditUser }
  }
})

const showValidation = ref(false)

const saveChanges = () => {
  if (!userData.value.name || !userData.value.email || !userData.value.role || !userData.value.status) {
    showValidation.value = true
    return
  }

  if (store.originalEditUser) {
    store.applyEdit(store.originalEditUser, userData.value)
  }
  router.push('/organisation/users')
}

const cancel = () => {
  router.push('/organisation/users')
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
        <div class="text-[10px] text-gray-500 mb-1">Super Admin / Organisation / Users & Access / <span class="font-bold text-gray-800">Create / Edit User</span></div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Create / Edit User</h1>
        <p class="text-[13px] text-gray-500 mt-1">Create or update a user with role, branch scope and security controls.</p>
      </div>
    </div>

    <!-- Form Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-1 md:grid-cols-2 gap-6">
      
      <!-- 1. User Identity -->
      <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
        <h3 class="text-[13px] font-bold text-gray-900 mb-2">User Identity</h3>
        
        <div>
          <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Full Name</label>
          <input v-model="userData.name" type="text" :class="showValidation && !userData.name ? 'border-red-300 bg-red-50/30 text-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-200 focus:ring-[#165A31] focus:border-[#165A31]'" class="w-full px-3 py-2 text-[12px] border rounded-lg focus:outline-none focus:ring-1 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />
          <p v-if="showValidation && !userData.name" class="text-[10px] text-red-500 mt-1.5 font-medium">This field is required.</p>
        </div>
        
        <div>
          <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Email</label>
          <input v-model="userData.email" type="text" :class="showValidation && !userData.email ? 'border-red-300 bg-red-50/30 text-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-200 focus:ring-[#165A31] focus:border-[#165A31]'" class="w-full px-3 py-2 text-[12px] border rounded-lg focus:outline-none focus:ring-1 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />
          <p v-if="showValidation && !userData.email" class="text-[10px] text-red-500 mt-1.5 font-medium">This field is required.</p>
        </div>

        <div>
          <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Mobile</label>
          <input v-model="userData.mobile" type="text" class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />
        </div>
      </div>

      <!-- 2. Role & Scope -->
      <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
        <h3 class="text-[13px] font-bold text-gray-900 mb-2">Role & Scope</h3>
        
        <div>
          <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Role</label>
          <input v-model="userData.role" type="text" placeholder="Branch Manager" :class="showValidation && !userData.role ? 'border-red-300 bg-red-50/30 text-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-200 focus:ring-[#165A31] focus:border-[#165A31]'" class="w-full px-3 py-2 text-[12px] border rounded-lg focus:outline-none focus:ring-1 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />
          <p v-if="showValidation && !userData.role" class="text-[10px] text-red-500 mt-1.5 font-medium">This field is required.</p>
        </div>
        
        <div>
          <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Assigned Branch</label>
          <input v-model="userData.branch" type="text" placeholder="Peshawar Branch" class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />
        </div>

        <div>
          <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Status</label>
          <input v-model="userData.status" type="text" placeholder="Active" :class="showValidation && !userData.status ? 'border-red-300 bg-red-50/30 text-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-200 focus:ring-[#165A31] focus:border-[#165A31]'" class="w-full px-3 py-2 text-[12px] border rounded-lg focus:outline-none focus:ring-1 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />
          <p v-if="showValidation && !userData.status" class="text-[10px] text-red-500 mt-1.5 font-medium">This field is required.</p>
        </div>
      </div>

      <!-- 3. Security -->
      <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
        <h3 class="text-[13px] font-bold text-gray-900 mb-2">Security</h3>
        
        <div>
          <label class="block text-[11px] font-medium text-gray-700 mb-1.5">MFA Requirement</label>
          <input v-model="userData.mfa" type="text" placeholder="Required" class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />
        </div>
        
        <div>
          <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Invitation</label>
          <input v-model="userData.invitation" type="text" placeholder="Send invitation email" class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />
        </div>

        <div>
          <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Session Policy</label>
          <input v-model="userData.sessionPolicy" type="text" placeholder="Standard" class="w-full px-3 py-2 text-[12px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.01)]" />
        </div>
      </div>

      <!-- 4. Permissions -->
      <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col">
        <h3 class="text-[13px] font-bold text-gray-900 mb-4">Permissions</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-2 flex-1 pt-2">
          
          <div class="flex items-center gap-2">
            <svg class="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span class="text-[11px] font-medium text-gray-600">View assigned branch</span>
          </div>

          <div class="flex items-center gap-2">
            <svg class="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span class="text-[11px] font-medium text-gray-600">Sales & customers</span>
          </div>

          <div class="flex items-center gap-2">
            <svg class="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span class="text-[11px] font-medium text-gray-600">Inventory operations</span>
          </div>

          <div class="flex items-center gap-2">
            <svg class="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span class="text-[11px] font-medium text-gray-600">Expenses within policy</span>
          </div>

          <div class="flex items-center gap-2">
            <svg class="w-3.5 h-3.5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
            </svg>
            <span class="text-[11px] font-medium text-gray-400">Global procurement</span>
          </div>

          <div class="flex items-center gap-2">
            <svg class="w-3.5 h-3.5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
            </svg>
            <span class="text-[11px] font-medium text-gray-400">Cross-branch finance</span>
          </div>

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
      <button @click="saveChanges" class="px-5 py-2 text-[11px] font-bold text-white bg-[#165A31] rounded-lg hover:bg-[#124a28] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
        Save Changes
      </button>
    </div>
  </div>

      </div>
    </div>
  </div>
</template>