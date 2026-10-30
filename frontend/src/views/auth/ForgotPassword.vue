<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import AuthCard from '@/components/ui/AuthCard.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { generateResetOtp } from '@/auth.js'

const router = useRouter()
const email = ref('')
const isLoading = ref(false)
const errorMessage = ref('')

const hasError = computed(() => !!errorMessage.value)

const handleSendReset = async () => {
  if (!email.value) return
  isLoading.value = true
  errorMessage.value = ''
  try {
    await generateResetOtp(email.value)
    router.push({ path: '/verify-identity', query: { email: email.value.trim().toLowerCase(), sent: '1' } })
  } catch (err) {
    errorMessage.value = err.message || 'Failed to process password reset request.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <AuthCard title="Forgot your password?" subtitle="Enter your email address to request password reset instructions.">
    <form @submit.prevent="handleSendReset">
      <BaseInput 
        data-tour="email" 
        v-model="email" 
        label="Email" 
        placeholder="name@ajecodrive.com" 
        required 
        type="email"
        :has-error="hasError"
      />
      
      <div v-if="hasError" class="p-3 mt-3 bg-red-50 border border-red-200 rounded-lg">
        <p class="text-xs text-red-600 font-medium">{{ errorMessage }}</p>
      </div>

      <div class="flex flex-col gap-3 mt-6">
        <BaseButton type="submit" :disabled="isLoading">
          {{ isLoading ? 'Sending...' : 'Send Reset Instructions' }}
        </BaseButton>
        <BaseButton variant="outline" type="button" @click.prevent="router.push('/login')">Back to Login</BaseButton>
      </div>

      <div class="mt-6 p-4 bg-[#f2fbfa] rounded-lg space-y-1.5">
        <p class="text-xs text-gray-500 leading-relaxed">
          For security, the confirmation message does not reveal whether a specific account exists.
        </p>
        <p class="text-[11px] text-gray-400 leading-relaxed">
          Verification OTP codes are dispatched only to active email addresses previously configured in the user's Account Profile (<code class="text-emerald-700">System &gt; Account</code>).
        </p>
      </div>
    </form>
  </AuthCard>
</template>
