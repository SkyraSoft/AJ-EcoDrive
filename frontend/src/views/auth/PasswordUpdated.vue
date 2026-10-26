<script setup>
import { useRouter } from 'vue-router'
import AuthCard from '@/components/ui/AuthCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const router = useRouter()

const handleContinue = () => {
  router.push('/login')
}
</script>

<template>
  <AuthCard title="Password updated" subtitle="Your password was changed successfully.">
    
    <div class="mb-8 mt-4">
      <div class="w-16 h-16 rounded-full bg-[#dcfce7] flex items-center justify-center">
        <svg class="w-8 h-8 text-[#13763A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
    </div>

    <div class="mb-6 p-4 bg-[#f2fbfa] rounded-lg">
      <p class="text-xs text-gray-500 leading-relaxed">
        For security, other sessions may require re-authentication according to account policy.
      </p>
    </div>

    <BaseButton @click="handleContinue">Continue to Login</BaseButton>
  </AuthCard>
</template>
