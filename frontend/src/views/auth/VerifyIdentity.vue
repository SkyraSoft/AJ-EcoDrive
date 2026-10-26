<script setup>
import { ref, computed } from 'vue'
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
const isLoading = ref(false)
const isResending = ref(false)

const title = 'Verify your identity'
const subtitle = 'Enter the 6-digit verification code sent to your email.'

const hasError = computed(() => !!errorMessage.value)

const handleVerify = async () => {
  if (!email || otpValue.value.length < 6) return
  
  isLoading.value = true
  errorMessage.value = ''
  try {
    const tempToken = await verifyResetOtp(email, otpValue.value)
    router.push({ path: '/create-new-password', query: { email, tempToken } })
  } catch (err) {
    errorMessage.value = err.message
  } finally {
    isLoading.value = false
  }
}

const handleResend = async () => {
  if (!email) return
  isResending.value = true
  errorMessage.value = ''
  try {
    await generateResetOtp(email)
    otpValue.value = ''
  } catch (err) {
    errorMessage.value = 'Failed to resend code.'
  } finally {
    isResending.value = false
  }
}
</script>

<template>
  <AuthCard :title="title" :subtitle="subtitle">
    <form @submit.prevent="handleVerify">
      
      <OTPInput v-model="otpValue" :length="6" :has-error="hasError" />

      <div v-if="hasError" class="p-3 mb-6 mt-2 bg-red-50 border border-red-100 rounded-lg">
        <p class="text-xs text-red-600 font-medium">{{ errorMessage }}</p>
      </div>

      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 mt-4 mb-6">
        <span class="text-xs text-gray-500">Code expires in 10 minutes</span>
        <button type="button" @click="handleResend" :disabled="isResending" class="text-xs font-semibold text-[#13763A] hover:underline disabled:opacity-50">
          {{ isResending ? 'Resending...' : 'Resend Code' }}
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
