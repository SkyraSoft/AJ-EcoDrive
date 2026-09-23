<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import AuthCard from '@/components/ui/AuthCard.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { authenticateBranch } from '@/auth.js'
import { store } from '@/store.js'

const router = useRouter()
const branchCode = ref('')
const password = ref('')
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
    store.setSession(session, false)
    router.push('/dashboard')
  } catch (err) {
    errorMessage.value = err.message || 'Email/username or password is incorrect. Review your details and try again.'
  } finally {
    isLoading.value = false
  }
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

      <div class="flex justify-end mt-2 mb-6">
        <RouterLink to="/forgot-password" class="text-sm font-semibold text-[#13763A] hover:underline">
          Forgot Password?
        </RouterLink>
      </div>

      <BaseButton type="submit" :disabled="isLoading">
        {{ isLoading ? 'Authenticating...' : (hasError ? 'Try Again' : 'Login') }}
      </BaseButton>
    </form>
  </AuthCard>
</template>
