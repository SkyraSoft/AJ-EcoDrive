<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const handleCancel = () => {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/dashboard')
  }
}

const handleSignOut = () => {
  // Clear any stored user state or tokens
  localStorage.removeItem('auth_user')
  router.push('/login')
}
</script>

<template>
  <div class="max-w-[1400px] mx-auto space-y-6 pb-12">
    <!-- Header & Breadcrumbs -->
    <div>
      <div class="text-[10px] text-gray-500 mb-1">
        Super Admin / System / <span class="font-bold text-gray-800">Logout</span>
      </div>
      <h1 class="text-[32px] tracking-tight font-bold text-gray-900">Logout</h1>
      <p class="text-sm text-gray-500 mt-1">End the current authenticated Super Admin session.</p>
    </div>

    <!-- Centered Sign Out Confirmation Card -->
    <div class="pt-16 sm:pt-24 flex items-center justify-center">
      <div class="bg-white p-8 sm:p-12 rounded-[16px] border border-gray-100 shadow-[0_4px_16px_rgba(0,0,0,0.02)] max-w-lg w-full text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
        <div class="space-y-2">
          <h2 class="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
            Sign out of AJ ECODRIVE?
          </h2>
          <p class="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
            Your current session will end. Unsaved draft changes should be saved before signing out.
          </p>
        </div>

        <div class="flex items-center justify-center gap-3 pt-2">
          <button 
            @click="handleCancel"
            class="bg-white border border-gray-200 text-gray-700 text-xs font-semibold px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer shadow-sm"
          >
            Cancel
          </button>
          
          <button 
            @click="handleSignOut"
            class="bg-white border border-red-200 text-red-500 hover:bg-red-50 text-xs font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer shadow-sm"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
