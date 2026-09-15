<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    required: false
  }
})
</script>

<template>
  <div class="bg-white rounded-[20px] p-10 w-full max-w-[480px] shadow-sm">
    <h2 class="text-[28px] font-bold text-gray-900 mb-2">{{ title }}</h2>
    <p v-if="subtitle" class="text-gray-500 text-sm mb-8">{{ subtitle }}</p>
    
    <slot />
  </div>
</template>
