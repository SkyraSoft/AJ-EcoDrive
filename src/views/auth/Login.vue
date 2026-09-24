<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import AuthCard from '@/components/ui/AuthCard.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { authenticateBranch } from '@/auth.js'
import { store } from '@/store.js'
import { KeyRound, Sparkles, ArrowRight, ShieldCheck, Check } from 'lucide-vue-next'

const router = useRouter()
const branchCode = ref('ADMIN')
const password = ref('password123')
const errorMessage = ref('')
const isLoading = ref(false)
const selectedCode = ref('ADMIN')

const hasError = computed(() => !!errorMessage.value)
const title = computed(() => hasError.value ? 'Unable to sign in' : 'Welcome back')
const subtitle = computed(() => hasError.value ? 'Check the highlighted information and try again.' : 'Sign in to access your branch dashboard.')

// Presentation Demo Credentials (Common Password: password123)
const demoAccounts = [
  {
    role: 'Super Admin',
    branch: 'Head Office (All Branches)',
    code: 'ADMIN',
    pass: 'password123',
    scopeBadge: 'Enterprise HQ',
    isHQ: true
  },
  {
    role: 'Branch Manager',
    branch: 'Peshawar Showroom',
    code: 'PEW-01',
    pass: 'password123',
    scopeBadge: 'Showroom & Workshop',
    isHQ: false
  },
  {
    role: 'Branch Manager',
    branch: 'Islamabad Showroom',
    code: 'ISB-01',
    pass: 'password123',
    scopeBadge: 'Capital Flagship',
    isHQ: false
  },
  {
    role: 'Branch Manager',
    branch: 'Lahore Showroom',
    code: 'LHE-01',
    pass: 'password123',
    scopeBadge: 'Punjab Central',
    isHQ: false
  },
  {
    role: 'Branch Manager',
    branch: 'Rawalpindi Showroom',
    code: 'RWP-01',
    pass: 'password123',
    scopeBadge: 'Twin Cities',
    isHQ: false
  }
]

const selectAccount = (acc) => {
  branchCode.value = acc.code
  password.value = acc.pass
  selectedCode.value = acc.code
  errorMessage.value = ''
}

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
        placeholder="e.g. ADMIN, PEW-01, ISB-01" 
        :has-error="hasError" 
      />
      
      <BaseInput 
        v-model="password"
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

      <BaseButton type="submit" :disabled="isLoading" class="w-full">
        {{ isLoading ? 'Authenticating...' : (hasError ? 'Try Again' : 'Login') }}
      </BaseButton>

      <!-- Live Presentation Demo Credentials Box (replaces static note) -->
      <div class="mt-6 p-4 rounded-xl border border-emerald-200 dark:border-emerald-800/80 bg-emerald-50/70 dark:bg-emerald-950/40">
        <div class="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-emerald-200/80 dark:border-emerald-800/60">
          <div class="flex items-center gap-1.5">
            <Sparkles class="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
            <span class="text-xs font-bold uppercase tracking-wider text-emerald-900 dark:text-emerald-200">
              Presentation Demo Credentials
            </span>
          </div>
          <div class="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-200/70 dark:bg-emerald-900/80 text-[11px] font-mono font-bold text-emerald-900 dark:text-emerald-200">
            <KeyRound class="w-3 h-3" />
            <span>password123</span>
          </div>
        </div>

        <p class="text-[11px] text-emerald-800/90 dark:text-emerald-300/90 mb-2.5">
          Select any role below for <strong>1-click auto-fill</strong> during the live presentation:
        </p>

        <!-- 1-Click Role Fill Buttons -->
        <div class="space-y-1.5">
          <button
            v-for="acc in demoAccounts"
            :key="acc.code"
            type="button"
            @click="selectAccount(acc)"
            class="w-full flex items-center justify-between p-2 rounded-lg border text-left transition-all cursor-pointer text-xs"
            :class="selectedCode === acc.code 
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm font-semibold' 
              : 'bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-700 border-gray-200 dark:border-slate-700 text-gray-800 dark:text-gray-200'"
          >
            <div class="flex items-center gap-2 truncate">
              <span 
                class="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase shrink-0"
                :class="selectedCode === acc.code ? 'bg-white/20 text-white' : (acc.isHQ ? 'bg-amber-100 dark:bg-amber-900/50 text-amber-900 dark:text-amber-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300')"
              >
                {{ acc.code }}
              </span>
              <div class="truncate">
                <span class="font-medium">{{ acc.role }}:</span>
                <span class="ml-1 opacity-90 text-[11px]">{{ acc.branch }}</span>
              </div>
            </div>

            <div class="flex items-center gap-1 shrink-0 ml-2">
              <span 
                v-if="selectedCode === acc.code" 
                class="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-white/25 flex items-center gap-0.5"
              >
                <Check class="w-3 h-3" /> Selected
              </span>
              <ArrowRight v-else class="w-3.5 h-3.5 opacity-40 hover:opacity-100" />
            </div>
          </button>
        </div>

        <div class="mt-3 pt-2 border-t border-emerald-200/60 dark:border-emerald-800/40 flex items-center justify-between text-[11px] text-emerald-800/80 dark:text-emerald-300/80">
          <span>Common Password for all: <strong class="font-mono text-emerald-950 dark:text-emerald-200">password123</strong></span>
          <span class="text-[10px] opacity-75 font-mono">(or "password")</span>
        </div>
      </div>
    </form>
  </AuthCard>
</template>
