<template>
  <div class="min-h-[400px] flex items-center justify-center p-6 bg-gray-50/50">
    <div class="max-w-md w-full bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center">
      <div class="w-14 h-14 mx-auto mb-4 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <h2 class="text-xl font-bold text-gray-900 mb-2">{{ title }}</h2>
      <p class="text-sm text-gray-600 mb-6 leading-relaxed">
        {{ message }}
      </p>
      <div class="flex items-center justify-center gap-3">
        <button
          v-if="showBack"
          @click="handleBack"
          type="button"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#165A31] transition-colors"
        >
          {{ backText }}
        </button>
        <button
          v-if="backRoute"
          @click="handleNavigate"
          type="button"
          class="px-4 py-2 text-sm font-medium text-white bg-[#165A31] rounded-lg hover:bg-[#134e2a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#165A31] transition-colors"
        >
          {{ listText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  title: {
    type: String,
    default: 'Record Not Found'
  },
  message: {
    type: String,
    default: 'The requested record could not be found or you do not have permission to view it in your current branch context.'
  },
  backRoute: {
    type: String,
    default: ''
  },
  backText: {
    type: String,
    default: 'Go Back'
  },
  listText: {
    type: String,
    default: 'Return to List'
  },
  showBack: {
    type: Boolean,
    default: true
  }
})

const router = useRouter()

function handleBack() {
  if (window.history.length > 1) {
    router.back()
  } else if (props.backRoute) {
    router.push(props.backRoute)
  } else {
    router.push('/dashboard')
  }
}

function handleNavigate() {
  if (props.backRoute) {
    router.push(props.backRoute)
  } else {
    router.push('/dashboard')
  }
}
</script>
