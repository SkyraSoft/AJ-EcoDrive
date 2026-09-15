<script setup>
import { useRouter } from 'vue-router'
import AuthCard from '@/components/ui/AuthCard.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const router = useRouter()

const handleSendReset = () => {
  // Simulate sending reset, maybe move to OTP or notify
  // The flow in the prompt says: Forgot Password -> OTP -> New Password
  router.push('/verify-identity') 
}
</script>

<template>
  <AuthCard title="Forgot your password?" subtitle="Enter your email address to request password reset instructions.">
    <form @submit.prevent="handleSendReset">
      <BaseInput label="Email" placeholder="name@ajecodrive.com" />
      
      <div class="flex flex-col gap-3 mt-6">
        <BaseButton type="submit">Send Reset Instructions</BaseButton>
        <BaseButton variant="outline" @click.prevent="router.push('/login')">Back to Login</BaseButton>
      </div>

      <div class="mt-6 p-4 bg-[#f2fbfa] rounded-lg">
        <p class="text-xs text-gray-500 leading-relaxed">
          For security, the confirmation message does not reveal whether a specific account exists.
        </p>
      </div>
    </form>
  </AuthCard>
</template>
