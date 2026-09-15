<script setup>
defineProps({
  label: {
    type: String,
    required: true
  },
  modelValue: {
    type: [String, Number],
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  placeholder: {
    type: String,
    default: ''
  },
  hasError: {
    type: Boolean,
    default: false
  }
})

defineEmits(['update:modelValue'])
</script>

<template>
  <div class="mb-4">
    <label class="block text-sm font-semibold text-gray-900 mb-1.5">{{ label }}</label>
    <input 
      :type="type"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :placeholder="placeholder"
      class="w-full px-4 py-3 rounded-lg border focus:outline-none transition-colors placeholder:text-gray-400"
      :class="[
        hasError 
          ? 'border-red-200 text-red-900 focus:border-red-400 focus:ring-1 focus:ring-red-400 bg-red-50/10'
          : 'border-gray-200 focus:border-[#13763A] focus:ring-1 focus:ring-[#13763A] bg-white text-gray-900'
      ]"
    />
  </div>
</template>
