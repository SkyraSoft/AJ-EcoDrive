<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import AuthCard from '@/components/ui/AuthCard.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const router = useRouter()
const hasError = ref(false) // Set to false so login works on first click

const title = computed(() => hasError.value ? 'Unable to sign in' : 'Welcome back')
const subtitle = computed(() => hasError.value ? 'Check the highlighted information and try again.' : 'Sign in with your AJ ECODRIVE account.')

const handleLogin = () => {
  if (hasError.value) {
    hasError.value = false
  } else {
    // Navigate straight to the dashboard to test main application
    router.push('/dashboard')
  }
}
</script>

<template>
  <AuthCard :title="title" :subtitle="subtitle">
    <form @submit.prevent="handleLogin">
      <BaseInput label="Email or Username" placeholder="manager@ajecodrive.com" :has-error="hasError" />
      <BaseInput label="Password" type="password" placeholder="••••••••••••" :has-error="hasError" />
      
      <div v-if="hasError" class="p-3 mt-2 mb-4 bg-red-50 border border-red-100 rounded-lg">
        <p class="text-xs text-red-600 font-medium">Email/username or password is incorrect. Review your details and try again.</p>
      </div>

      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 mt-2 mb-6">
        <label v-if="!hasError" class="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" class="w-4 h-4 rounded border-gray-300 text-[#13763A] focus:ring-[#13763A]" />
          <span class="text-sm text-gray-600 font-medium">Remember me</span>
        </label>
        <span v-else></span> <!-- Spacer when Remember Me is hidden -->
        
        <RouterLink to="/forgot-password" class="text-sm font-semibold text-[#13763A] hover:underline" @click="hasError = true">
          Forgot Password?
        </RouterLink>
      </div>

      <BaseButton type="submit">{{ hasError ? 'Try Again' : 'Login' }}</BaseButton>

      <div v-if="!hasError" class="mt-6 p-4 bg-[#f2fbfa] rounded-lg">
        <p class="text-xs text-gray-500 leading-relaxed">
          Your role and assigned branch are determined by your account. There is no role or branch selector on this screen.
        </p>
      </div>
    </form>
  </AuthCard>
</template>
