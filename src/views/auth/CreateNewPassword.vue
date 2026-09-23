<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import AuthCard from '@/components/ui/AuthCard.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { resetPassword } from '@/auth.js'

const router = useRouter()
const route = useRoute()
const email = route.query.email || ''
const tempToken = route.query.tempToken || ''

const newPassword = ref('')
const confirmPassword = ref('')
const errorMessage = ref('')
const isLoading = ref(false)

const hasError = computed(() => !!errorMessage.value)
const isMatch = computed(() => newPassword.value && newPassword.value === confirmPassword.value)
const isLengthOk = computed(() => newPassword.value.length >= 8)

const handleReset = async () => {
  if (!email || !tempToken) {
    errorMessage.value = 'Invalid session. Please restart the password reset process.'
    return
  }
  if (!isMatch.value || !isLengthOk.value) {
    errorMessage.value = 'Please meet all password requirements.'
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  try {
    await resetPassword(email, tempToken, newPassword.value)
    router.push('/password-updated')
  } catch (err) {
    errorMessage.value = err.message
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <AuthCard title="Create a new password" subtitle="Choose a strong new password for your AJ ECODRIVE account.">
    <form @submit.prevent="handleReset">
      <BaseInput v-model="newPassword" label="New Password" type="password" placeholder="••••••••••••" :has-error="hasError" />
      <BaseInput v-model="confirmPassword" label="Confirm Password" type="password" placeholder="••••••••••••" :has-error="hasError" />
      
      <div v-if="hasError" class="p-3 mt-2 mb-4 bg-red-50 border border-red-100 rounded-lg">
        <p class="text-xs text-red-600 font-medium">{{ errorMessage }}</p>
      </div>

      <div class="mt-2 mb-6">
        <ul class="text-[11px] text-gray-500 space-y-1">
          <li class="flex items-center gap-1">
            <span :class="isLengthOk ? 'text-green-600' : 'text-gray-300'">✓</span> Minimum 8 characters
          </li>
          <li class="flex items-center gap-1">
            <span :class="isMatch ? 'text-green-600' : 'text-gray-300'">✓</span> Passwords match
          </li>
        </ul>
      </div>

      <BaseButton type="submit" :disabled="isLoading || !isMatch || !isLengthOk">
        {{ isLoading ? 'Saving...' : 'Reset Password' }}
      </BaseButton>
    </form>
  </AuthCard>
</template>
