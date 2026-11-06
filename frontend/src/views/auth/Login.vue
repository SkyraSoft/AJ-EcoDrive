<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AuthCard from '@/components/ui/AuthCard.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { authenticateBranch } from '@/auth.js'
import { api, ApiError } from '@/services/api.js'
import { store } from '@/store.js'
import { BookOpen, ExternalLink } from 'lucide-vue-next'

const router = useRouter()

// Never ship credentials or pre-filled privileged login values in the client.
const branchCode = ref('')
const password = ref('')
const errorMessage = ref('')
const isLoading = ref(false)

const hasError = computed(() => !!errorMessage.value)
const title = computed(() => hasError.value ? 'Unable to sign in' : 'Welcome back')
const subtitle = computed(() => hasError.value ? 'Check the highlighted information and try again.' : 'Sign in to access your branch dashboard.')

// Initial background health check: 15s AbortController timeout, up to 2 retries
// Crucially: never blocks the login page or submit button
onMounted(() => {
  api.checkHealthWithRetry({ timeoutMs: 15000, maxRetries: 2 }).catch(err => {
    console.warn('[EcoDrive] Initial background health probe notice:', err?.message || err)
  })
})

const handleLogin = async () => {
  errorMessage.value = ''

  const rawCode = (branchCode.value || '').trim()
  const rawPass = (password.value || '').trim()

  if (!rawCode || !rawPass) {
    errorMessage.value = 'Please enter both Branch Code / Username and Password.'
    return
  }

  isLoading.value = true

  try {
    const session = await authenticateBranch(rawCode, rawPass)
    store.setSession(session, true)
    router.push('/dashboard')
  } catch (err) {
    // Categorize errors explicitly:
    // - Network/CORS/timeout: backend cannot be reached.
    // - 401: invalid username or password.
    // - 403: account is not authorized.
    // - 429: too many attempts.
    // - 500/502/503: backend service problem.
    const status = Number(err?.status) || 0
    const serverMessage = err?.data?.message || err?.message || ''

    if (status === 401) {
      errorMessage.value = 'Invalid username/branch code or password. Please verify your credentials and try again.'
    } else if (status === 403) {
      errorMessage.value = serverMessage || 'Your account is not authorized or has been disabled. Please contact the administrator.'
    } else if (status === 429) {
      errorMessage.value = 'Too many login attempts. Please wait a few moments and try again.'
    } else if (status >= 500) {
      errorMessage.value = `Backend service problem (HTTP ${status}). Please try again later.`
    } else if (status === 0 || err?.isOffline || err?.name === 'AbortError' || (serverMessage && serverMessage.toLowerCase().includes('failed to fetch'))) {
      errorMessage.value = 'Backend cannot be reached. Please check your internet connection or server status.'
    } else {
      errorMessage.value = serverMessage || 'Unable to sign in. Please verify your details and try again.'
    }
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
        data-tour="auth-email"
        label="Branch Code / Username" 
        placeholder="e.g. ADMIN, PEW-01, ISB-01" 
        :has-error="hasError" 
      />
      
      <BaseInput 
        v-model="password"
        data-tour="auth-password"
        label="Password" 
        type="password" 
        placeholder="••••••••••••" 
        :has-error="hasError" 
      />
      
      <div v-if="hasError" class="p-3 mt-2 mb-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-lg">
        <p class="text-xs text-red-600 dark:text-red-400 font-medium">{{ errorMessage }}</p>
      </div>

      <div class="flex justify-end mt-1 mb-5">
        <RouterLink to="/forgot-password" class="text-xs font-semibold text-[#13763A] dark:text-emerald-400 hover:underline">
          Forgot Password?
        </RouterLink>
      </div>

      <BaseButton type="submit" data-tour="auth-submit" :disabled="isLoading" class="w-full">
        {{ isLoading ? 'Authenticating...' : (hasError ? 'Try Again' : 'Login') }}
      </BaseButton>

      <!-- Production never displays or auto-fills credentials. -->

      <!-- Interactive Guide Direct Link -->
      <div class="mt-5 text-center">
        <a 
          href="/guide.html" 
          target="_blank" 
          class="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors py-1.5 px-3 rounded-lg bg-emerald-50 dark:bg-slate-800/80 border border-emerald-200 dark:border-slate-700"
        >
          <BookOpen class="w-3.5 h-3.5" />
          <span>View Interactive Client Operations Guide (400+ Q&As)</span>
          <ExternalLink class="w-3 h-3 opacity-70" />
        </a>
      </div>
    </form>
  </AuthCard>
</template>
