<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import AuthCard from '@/components/ui/AuthCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import OTPInput from '@/components/ui/OTPInput.vue'
import { verifyResetOtp, generateResetOtp } from '@/auth.js'

const router = useRouter()
const route = useRoute()
const email = route.query.email || ''

const otpValue = ref('')
const errorMessage = ref('')
const successMessage = ref(route.query.sent === '1' ? 'A 6-digit verification code has been dispatched to your email.' : '')
const isLoading = ref(false)
const isResending = ref(false)
const cooldownSeconds = ref(60)
let timer = null

const title = 'Verify your identity'
const subtitle = 'Enter the 6-digit verification code sent to your email.'

const hasError = computed(() => !!errorMessage.value)
const hasSuccess = computed(() => !!successMessage.value)

const startCooldown = (seconds = 60) => {
  cooldownSeconds.value = seconds
  if (timer) clearInterval(timer)
  timer = setInterval(() => {
    if (cooldownSeconds.value > 0) {
      cooldownSeconds.value -= 1
    } else {
      clearInterval(timer)
      timer = null
    }
  }, 1000)
}

onMounted(() => {
  startCooldown(60)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

const handleVerify = async () => {
  if (!email || otpValue.value.length < 6) return
  
  isLoading.value = true
  errorMessage.value = ''
  try {
    const tempToken = await verifyResetOtp(email, otpValue.value)
    router.push({ path: '/create-new-password', query: { email, tempToken } })
  } catch (err) {
    errorMessage.value = err.message || 'Invalid or expired verification code.'
  } finally {
    isLoading.value = false
  }
}

const handleResend = async () => {
  if (!email || cooldownSeconds.value > 0 || isResending.value) return
  
  isResending.value = true
  errorMessage.value = ''
  successMessage.value = ''
  try {
    await generateResetOtp(email)
    otpValue.value = ''
    successMessage.value = 'A new verification code has been sent to your email.'
    startCooldown(60)
  } catch (err) {
    errorMessage.value = err.message || 'Failed to resend code.'
  } finally {
    isResending.value = false
  }
}
</script>

<template>
  <AuthCard :title="title" :subtitle="subtitle">
    <form @submit.prevent="handleVerify">
      
      <div v-if="hasSuccess" class="p-3 mb-4 bg-emerald-50 border border-emerald-200 rounded-lg">
        <p class="text-xs text-emerald-700 font-medium">{{ successMessage }}</p>
      </div>

      <div v-if="hasError" class="p-3 mb-4 bg-red-50 border border-red-200 rounded-lg">
        <p class="text-xs text-red-600 font-medium">{{ errorMessage }}</p>
      </div>

      <OTPInput v-model="otpValue" :length="6" :has-error="hasError" />

      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 mt-4 mb-6">
        <span class="text-xs text-gray-500">Code expires in 5 minutes</span>
        <button 
          type="button" 
          @click="handleResend" 
          :disabled="isResending || cooldownSeconds > 0" 
          class="text-xs font-semibold text-[#13763A] hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="isResending">Resending...</span>
          <span v-else-if="cooldownSeconds > 0">Resend Code ({{ cooldownSeconds }}s)</span>
          <span v-else>Resend Code</span>
        </button>
      </div>

      <BaseButton type="submit" :disabled="isLoading || otpValue.length < 6">
        {{ isLoading ? 'Verifying...' : 'Verify & Continue' }}
      </BaseButton>

      <div class="mt-6 p-4 bg-[#f2fbfa] rounded-lg">
        <p class="text-xs text-gray-500 leading-relaxed">
          Check your spam folder if you do not see the email in your inbox.
        </p>
      </div>
    </form>
  </AuthCard>
</template>
