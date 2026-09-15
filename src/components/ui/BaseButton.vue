<script setup>
defineProps({
  type: {
    type: String,
    default: 'button'
  },
  variant: {
    type: String,
    default: 'primary' // 'primary' | 'outline'
  }
})
</script>

<template>
  <button 
    :type="type"
    class="w-full py-3.5 px-4 rounded-lg font-semibold text-sm transition-colors duration-200"
    :class="[
      variant === 'primary' ? 'bg-[#13763A] hover:bg-[#0f602f] text-white' : '',
      variant === 'outline' ? 'bg-white hover:bg-gray-50 border border-gray-200 text-[#13763A]' : ''
    ]"
  >
    <slot />
  </button>
</template>
