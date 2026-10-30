<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { CheckCircle2, Shield, Building2, AlertTriangle } from 'lucide-vue-next'
import { store } from '@/store.js'
import api from '@/services/api.js'

const isBranchUser = computed(() => store.isBranchUser())
const currentUser = computed(() => store.currentUser || {})

const isPlaceholderEmail = computed(() => {
  const em = String(profileForm.value.email || '').trim().toLowerCase()
  return !em || em.endsWith('@ajecodrive.com')
})

const profileForm = ref({
  name: '',
  email: '',
  phone: '',
  branch: '',
  role: '',
  photo: 'User Avatar',
  contactPreference: 'Email + in-app',
  accountStatus: 'Active'
})

const populateFromStore = () => {
  const u = store.currentUser || {}
  profileForm.value.name = u.name || 'Admin User'
  profileForm.value.email = u.email || 'admin@ajecodrive.com'
  profileForm.value.phone = u.phone || u.mobile || '0300 555 0001'
  profileForm.value.branch = u.branchName || u.branch || 'Peshawar'
  profileForm.value.role = u.role || (u.isSuperAdmin ? 'Super Admin' : 'Branch Manager')
  profileForm.value.accountStatus = u.status || 'Active'
}

onMounted(() => {
  populateFromStore()
})

watch(currentUser, () => {
  populateFromStore()
}, { deep: true })

const showToast = ref(false)
const toastMessage = ref('')
const toastIsError = ref(false)
const isSaving = ref(false)

const saveChanges = async () => {
  const cleanEmail = String(profileForm.value.email || '').trim().toLowerCase()
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!cleanEmail || !emailRegex.test(cleanEmail)) {
    toastMessage.value = 'Please provide a valid email address (e.g. name@domain.com).'
    toastIsError.value = true
    showToast.value = true
    setTimeout(() => { showToast.value = false }, 3500)
    return
  }

  isSaving.value = true
  try {
    // 1. Persist to real backend API & MySQL database
    try {
      await api.auth.updateProfile({
        name: profileForm.value.name,
        email: cleanEmail,
        phone: profileForm.value.phone
      })
    } catch (apiErr) {
      if (apiErr && !apiErr.isOffline) {
        throw new Error(apiErr.data?.message || apiErr.message || 'Failed to update email in database.')
      }
    }

    // 2. Sync client reactive store
    store.updateUserProfile({
      name: profileForm.value.name,
      email: cleanEmail,
      phone: profileForm.value.phone,
      contactPreference: profileForm.value.contactPreference
    })

    toastMessage.value = 'Account profile and registered OTP email saved successfully!'
    toastIsError.value = false
    showToast.value = true
    setTimeout(() => { showToast.value = false }, 3500)
  } catch (err) {
    toastMessage.value = `Error: ${err.message}`
    toastIsError.value = true
    showToast.value = true
    setTimeout(() => { showToast.value = false }, 4000)
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <div class="max-w-[1400px] mx-auto space-y-6 pb-12">
    <!-- Toast Notification -->
    <div 
      v-if="showToast" 
      :class="toastIsError ? 'bg-red-600' : 'bg-[#165A31]'"
      class="fixed bottom-5 right-5 z-[110] text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-200"
    >
      <CheckCircle2 class="w-5 h-5 text-white" />
      <span class="text-xs font-bold">{{ toastMessage }}</span>
    </div>

    <!-- Header & Breadcrumbs -->
    <div data-tour-id="bm.system.account.header" class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
      <div>
        <div class="text-[11px] text-gray-400 mb-1">
          <span v-if="isBranchUser">Branch Manager / Account / <span class="font-medium text-gray-600">Account Profile</span></span>
          <span v-else>Super Admin / System / <span class="font-medium text-gray-600">Account</span></span>
        </div>
        <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Account Profile</h1>
        <p class="text-xs text-gray-500 mt-1">Maintain your profile and branch contact information.</p>
      </div>

      <button data-tour-id="bm.system.account.save-btn" 
        @click="saveChanges"
        :disabled="isSaving"
        class="bg-[#165A31] text-white text-xs font-semibold px-5 py-2.5 rounded-lg hover:bg-[#124a28] transition-colors shadow-sm cursor-pointer disabled:opacity-50"
      >
        {{ isSaving ? 'Saving...' : 'Save Changes' }}
      </button>
    </div>

    <!-- 2-Card Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
      
      <!-- Left Card: Profile -->
      <div data-tour-id="bm.system.account.profile-card" class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
        <h3 class="text-sm font-bold text-gray-900 mb-4">Personal Profile</h3>
        
        <!-- Profile Email Not Configured Notice -->
        <div v-if="isPlaceholderEmail" class="p-3.5 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2.5 mb-2">
          <AlertTriangle class="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <div class="text-xs text-amber-800">
            <p class="font-bold">Recovery Email Not Configured</p>
            <p class="mt-0.5 text-[11px] text-amber-700 leading-normal">
              Your account is currently using an unconfigured demo address (<code>@ajecodrive.com</code>). Please configure your active personal or work email address below and click <strong>Save Changes</strong> so you can receive password reset OTP verification codes.
            </p>
          </div>
        </div>
        
        <div>
          <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Full Name</label>
          <input data-tour="profile-name" 
            v-model="profileForm.name" 
            type="text" 
            class="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors bg-white shadow-[0_1px_2px_rgba(0,0,0,0.01)] text-gray-800" 
          />
        </div>

        <div>
          <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Email Address</label>
          <input data-tour="profile-email" 
            v-model="profileForm.email" 
            type="email" 
            class="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors bg-white shadow-[0_1px_2px_rgba(0,0,0,0.01)] text-gray-800" 
          />
          <p class="text-[10px] text-gray-500 mt-1">This email address will receive your single-use verification OTP codes for account authentication and password resets.</p>
        </div>

        <div>
          <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Phone Number</label>
          <input data-tour="profile-phone" 
            v-model="profileForm.phone" 
            type="text" 
            class="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors bg-white shadow-[0_1px_2px_rgba(0,0,0,0.01)] text-gray-800" 
          />
        </div>

        <div>
          <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Assigned Operating Branch</label>
          <div class="flex items-center gap-2 p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-700 font-medium">
            <Building2 class="w-4 h-4 text-[#165A31]" />
            <span>{{ profileForm.branch }}</span>
            <span class="ml-auto text-[10px] text-gray-400 font-semibold uppercase">Admin Controlled</span>
          </div>
        </div>
      </div>

      <!-- Right Card: System Security & Role -->
      <div data-tour-id="bm.system.account.security-card" class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
        <h3 class="text-sm font-bold text-gray-900 mb-4">Access & Role Information</h3>
        
        <div>
          <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">System Role</label>
          <div class="flex items-center gap-2 p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-900 font-bold">
            <Shield class="w-4 h-4 text-[#165A31]" />
            <span>{{ profileForm.role }}</span>
            <span class="ml-auto text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">Enforced</span>
          </div>
        </div>

        <div>
          <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Profile Photo Identifier</label>
          <input data-tour="profile-photo" 
            v-model="profileForm.photo" 
            type="text" 
            class="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors bg-white shadow-[0_1px_2px_rgba(0,0,0,0.01)] text-gray-800" 
          />
        </div>

        <div>
          <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Notification Channel Preference</label>
          <select data-tour="profile-contactpreference" 
            v-model="profileForm.contactPreference"
            class="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31] transition-colors bg-white shadow-[0_1px_2px_rgba(0,0,0,0.01)] text-gray-800"
          >
            <option value="Email + in-app">Email + in-app</option>
            <option value="In-app only">In-app only</option>
            <option value="Email only">Email only</option>
          </select>
        </div>

        <div>
          <label class="block text-[11px] font-semibold text-gray-700 mb-1.5">Account Status</label>
          <div class="p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-[#165A31] flex items-center justify-between">
            <span>{{ profileForm.accountStatus }}</span>
            <span class="text-[10px] text-gray-400 font-normal">Active Session</span>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
