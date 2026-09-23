<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AuthCard from '@/components/ui/AuthCard.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { generateResetOtp } from '@/auth.js'

const router = useRouter()
const email = ref('')
const isLoading = ref(false)

const handleSendReset = async () => {
  if (!email.value) return
  isLoading.value = true
  try {
    await generateResetOtp(email.value)
  } catch (err) {
    console.error(err)
  } finally {
    isLoading.value = false
    // Always proceed to next step to not reveal email existence
    router.push({ path: '/verify-identity', query: { email: email.value } })
  }
}
</script>

<template>
  <AuthCard title="Forgot your password?" subtitle="Enter your email address to request password reset instructions.">
    <form @submit.prevent="handleSendReset">
      <BaseInput v-model="email" label="Email" placeholder="name@ajecodrive.com" required type="email" />
      
      <div class="flex flex-col gap-3 mt-6">
        <BaseButton type="submit" :disabled="isLoading">
          {{ isLoading ? 'Sending...' : 'Send Reset Instructions' }}
        </BaseButton>
        <BaseButton variant="outline" type="button" @click.prevent="router.push('/login')">Back to Login</BaseButton>
      </div>

      <div class="mt-6 p-4 bg-[#f2fbfa] rounded-lg">
        <p class="text-xs text-gray-500 leading-relaxed">
          For security, the confirmation message does not reveal whether a specific account exists.
        </p>
      </div>
    </form>
  </AuthCard>
</template>
