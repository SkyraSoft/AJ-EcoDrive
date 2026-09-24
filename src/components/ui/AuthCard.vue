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
  <div class="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-[20px] p-8 sm:p-10 w-full max-w-[500px] shadow-sm transition-colors">
    <h2 class="text-[26px] sm:text-[28px] font-bold text-gray-900 dark:text-white mb-2">{{ title }}</h2>
    <p v-if="subtitle" class="text-gray-500 dark:text-slate-400 text-sm mb-6">{{ subtitle }}</p>
    
    <slot />
  </div>
</template>
