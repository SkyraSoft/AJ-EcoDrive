<script setup>
import { ref } from 'vue'
import { CheckCircle2, ChevronDown } from 'lucide-vue-next'

const profile = ref({
  name: 'Super Admin',
  email: 'admin@ajecodrive.com',
  role: 'Super Admin',
  status: 'Active'
})

const preferences = ref({
  theme: 'Light',
  timezone: 'Asia/Karachi',
  dateFormat: 'DD MMM YYYY'
})

const isEditing = ref(false)
const showToast = ref(false)
const toastMessage = ref('')

const saveProfile = () => {
  isEditing.value = false
  toastMessage.value = 'Profile updated successfully!'
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
        Super Admin / System / <span class="font-bold text-gray-800">Account</span>
      </div>
      <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Account</h1>
      <p class="text-sm text-gray-500 mt-1">Manage the signed-in Super Admin profile.</p>
    </div>

    <!-- Top Profile Banner Card -->
    <div class="bg-white p-6 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 class="text-xl font-bold text-gray-900">Super Admin</h2>
        <div class="text-xs text-gray-500 font-medium mt-0.5">
          Organisation-wide administrator
        </div>
      </div>

      <div class="flex items-center gap-2">
        <span class="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#eefcf2] text-[#165A31]">
          Active
        </span>
        <button 
          @click="isEditing = !isEditing"
          class="bg-white border border-gray-200 text-gray-700 text-xs font-semibold px-3.5 py-1.5 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer shadow-sm"
        >
          {{ isEditing ? 'Cancel' : 'Edit Profile' }}
        </button>
        <button class="bg-white border border-gray-200 text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer shadow-sm flex items-center gap-1">
          <span>More</span>
          <ChevronDown class="w-3.5 h-3.5 text-gray-500" />
        </button>
      </div>
    </div>

    <!-- Edit Profile Inline Modal/Card if editing -->
    <div v-if="isEditing" class="bg-white p-6 sm:p-8 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4 animate-in fade-in duration-150">
      <h3 class="text-[13px] font-bold text-gray-900">Edit Profile Details</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
        <div>
          <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Name</label>
          <input 
            v-model="profile.name"
            type="text" 
            class="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31]"
          />
        </div>
        <div>
          <label class="block text-[11px] font-medium text-gray-700 mb-1.5">Email</label>
          <input 
            v-model="profile.email"
            type="email" 
            class="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#165A31] focus:border-[#165A31]"
          />
        </div>
      </div>
      <div class="pt-2 flex justify-end gap-2">
        <button 
          @click="isEditing = false"
          class="px-3.5 py-1.5 text-xs font-semibold text-gray-600 hover:text-gray-800"
        >
          Cancel
        </button>
        <button 
          @click="saveProfile"
          class="bg-[#165A31] text-white text-xs font-bold px-4 py-1.5 rounded-lg hover:bg-[#124a28]"
        >
          Save
        </button>
      </div>
    </div>

    <!-- 2-Column Info Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Left Card: Profile -->
      <div class="bg-white p-6 sm:p-7 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
        <h3 class="text-[13px] font-bold text-gray-900">Profile</h3>
        
        <div class="space-y-3 pt-1">
          <div class="flex items-center justify-between text-xs py-1">
            <span class="text-gray-500 font-medium">Name</span>
            <span class="font-bold text-gray-900">{{ profile.name }}</span>
          </div>

          <div class="flex items-center justify-between text-xs py-1">
            <span class="text-gray-500 font-medium">Email</span>
            <span class="font-bold text-gray-900">{{ profile.email }}</span>
          </div>

          <div class="flex items-center justify-between text-xs py-1">
            <span class="text-gray-500 font-medium">Role</span>
            <span class="font-bold text-gray-900">{{ profile.role }}</span>
          </div>
        </div>
      </div>

      <!-- Right Card: Preferences Summary -->
      <div class="bg-white p-6 sm:p-7 rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
        <h3 class="text-[13px] font-bold text-gray-900">Preferences Summary</h3>
        
        <div class="space-y-3 pt-1">
          <div class="flex items-center justify-between text-xs py-1">
            <span class="text-gray-500 font-medium">Theme</span>
            <span class="font-bold text-gray-900">{{ preferences.theme }}</span>
          </div>

          <div class="flex items-center justify-between text-xs py-1">
            <span class="text-gray-500 font-medium">Timezone</span>
            <span class="font-bold text-gray-900">{{ preferences.timezone }}</span>
          </div>

          <div class="flex items-center justify-between text-xs py-1">
            <span class="text-gray-500 font-medium">Date Format</span>
            <span class="font-bold text-gray-900">{{ preferences.dateFormat }}</span>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>
