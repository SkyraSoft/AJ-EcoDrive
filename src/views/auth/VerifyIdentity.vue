<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import AuthCard from '@/components/ui/AuthCard.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import OTPInput from '@/components/ui/OTPInput.vue'

const router = useRouter()
const otpValue = ref('')
const isExpired = ref(true) // Set to true to show the expired state for preview

const title = computed(() => isExpired.value ? 'Verification code expired' : 'Verify your identity')
const subtitle = computed(() => isExpired.value ? 'Request a new code or use the configured recovery option.' : 'Enter the verification code from your configured authentication method.')

const handleAction = () => {
  if (isExpired.value) {
    // Reset to normal state on resend
    isExpired.value = false
    otpValue.value = ''
  } else {
    router.push('/create-new-password')
  }
}
</script>

<template>
  <AuthCard :title="title" :subtitle="subtitle">
    <form @submit.prevent="handleAction">
      <BaseInput v-if="!isExpired" label="Authentication Method" modelValue="Authenticator App" readonly class="pointer-events-none opacity-80" />
      
      <OTPInput v-model="otpValue" :length="6" :has-error="isExpired" />

      <div v-if="isExpired" class="p-3 mb-6 bg-red-50 border border-red-100 rounded-lg">
        <p class="text-xs text-red-600 font-medium">This code has expired. Request a new verification code.</p>
      </div>

      <div v-if="!isExpired" class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 mb-6">
        <span class="text-xs text-gray-500">Code expires shortly</span>
        <button type="button" @click="isExpired = true" class="text-xs font-semibold text-[#13763A] hover:underline">Resend / Recovery option</button>
      </div>

      <BaseButton type="submit">{{ isExpired ? 'Resend Code' : 'Verify & Continue' }}</BaseButton>

      <div v-if="!isExpired" class="mt-6 p-4 bg-[#f2fbfa] rounded-lg">
        <p class="text-xs text-gray-500 leading-relaxed">
          MFA is mandatory for Super Admin. Branch Manager MFA is supported and can be enforced by policy.
        </p>
      </div>
    </form>
  </AuthCard>
</template>
