<script setup>
import { useRouter } from 'vue-router'
import AuthCard from '@/components/ui/AuthCard.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const router = useRouter()

const handleReset = () => {
  router.push('/password-updated')
}
</script>

<template>
  <AuthCard title="Create a new password" subtitle="Choose a strong new password for your AJ ECODRIVE account.">
    <form @submit.prevent="handleReset">
      <BaseInput label="New Password" type="password" placeholder="••••••••••••" />
      <BaseInput label="Confirm Password" type="password" placeholder="••••••••••••" />
      
      <div class="mt-2 mb-6">
        <ul class="text-[11px] text-gray-500 space-y-1">
          <li class="flex items-center gap-1"><span class="text-green-600">✓</span> Minimum length requirement</li>
          <li class="flex items-center gap-1"><span class="text-green-600">✓</span> Upper/lowercase and number</li>
          <li class="flex items-center gap-1"><span class="text-green-600">✓</span> Not the same as your recent password</li>
          <li class="flex items-center gap-1"><span class="text-green-600">✓</span> Passwords match</li>
        </ul>
      </div>

      <BaseButton type="submit">Reset Password</BaseButton>
    </form>
  </AuthCard>
</template>
