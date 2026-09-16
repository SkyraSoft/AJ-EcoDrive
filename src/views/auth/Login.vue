<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import AuthCard from '@/components/ui/AuthCard.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { authenticateBranch } from '@/auth.js'
import { store } from '@/store.js'

const router = useRouter()
const branchCode = ref('PEW-01')
const password = ref('')
const rememberMe = ref(true)
const errorMessage = ref('')
const isLoading = ref(false)

const hasError = computed(() => !!errorMessage.value)
const title = computed(() => hasError.value ? 'Unable to sign in' : 'Welcome back')
const subtitle = computed(() => hasError.value ? 'Check the highlighted information and try again.' : 'Sign in to access your branch dashboard.')

const handleLogin = async () => {
  errorMessage.value = ''
  isLoading.value = true

  try {
    const session = await authenticateBranch(branchCode.value, password.value)
    store.setSession(session, rememberMe.value)
    router.push('/dashboard')
  } catch (err) {
    errorMessage.value = err.message || 'Email/username or password is incorrect. Review your details and try again.'
  } finally {
    isLoading.value = false
  }
}

const quickFill = (code, pass) => {
  branchCode.value = code
  password.value = pass
  errorMessage.value = ''
}
</script>

<template>
  <AuthCard :title="title" :subtitle="subtitle">
    <form @submit.prevent="handleLogin">
      <BaseInput 
        v-model="branchCode"
        label="Branch Code / Username" 
        placeholder="e.g. PEW-01, ISB-01 or ADMIN" 
        :has-error="hasError" 
      />
      
      <BaseInput 
        v-model="password"
        label="Password" 
        type="password" 
        placeholder="••••••••••••" 
        :has-error="hasError" 
      />
      
      <div v-if="hasError" class="p-3 mt-2 mb-4 bg-red-50 border border-red-100 rounded-lg">
        <p class="text-xs text-red-600 font-medium">{{ errorMessage }}</p>
      </div>

      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 mt-2 mb-6">
        <label class="flex items-center gap-2 cursor-pointer">
          <input 
            v-model="rememberMe"
            type="checkbox" 
            class="w-4 h-4 rounded border-gray-300 text-[#13763A] focus:ring-[#13763A]" 
          />
          <span class="text-sm text-gray-600 font-medium">Remember me</span>
        </label>
        
        <RouterLink to="/forgot-password" class="text-sm font-semibold text-[#13763A] hover:underline">
          Forgot Password?
        </RouterLink>
      </div>

      <BaseButton type="submit" :disabled="isLoading">
        {{ isLoading ? 'Authenticating...' : (hasError ? 'Try Again' : 'Login') }}
      </BaseButton>

      <div class="mt-6 p-4 bg-[#f2fbfa] rounded-lg">
        <p class="text-xs text-gray-500 leading-relaxed mb-2">
          Your role and assigned branch are determined automatically upon sign in with your Branch Code:
        </p>
        <div class="flex flex-wrap gap-2 text-[11px]">
          <button 
            type="button" 
            @click="quickFill('PEW-01', 'password123')"
            class="px-2.5 py-1 bg-white border border-green-200 text-[#165A31] font-bold rounded hover:bg-green-50 transition-colors cursor-pointer"
          >
            Peshawar (PEW-01)
          </button>
          <button 
            type="button" 
            @click="quickFill('ISB-01', 'password123')"
            class="px-2.5 py-1 bg-white border border-gray-200 text-gray-700 font-medium rounded hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Islamabad (ISB-01)
          </button>
          <button 
            type="button" 
            @click="quickFill('ADMIN', 'password123')"
            class="px-2.5 py-1 bg-white border border-gray-200 text-gray-700 font-medium rounded hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Super Admin
          </button>
        </div>
      </div>
    </form>
  </AuthCard>
</template>
