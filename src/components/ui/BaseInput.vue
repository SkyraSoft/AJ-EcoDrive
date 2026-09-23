<script setup>
import { ref, computed } from 'vue'
import { Eye, EyeOff } from 'lucide-vue-next'

const props = defineProps({
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

const isPasswordType = computed(() => props.type === 'password')
const showPassword = ref(false)
const computedType = computed(() => {
  if (isPasswordType.value) {
    return showPassword.value ? 'text' : 'password'
  }
  return props.type
})
</script>

<template>
  <div class="mb-4">
    <label class="block text-sm font-semibold text-gray-900 mb-1.5">{{ label }}</label>
    <div class="relative">
      <input 
        :type="computedType"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        :placeholder="placeholder"
        class="w-full px-4 py-3 rounded-lg border focus:outline-none transition-colors placeholder:text-gray-400"
        :class="[
          isPasswordType ? 'pr-11' : '',
          hasError 
            ? 'border-red-200 text-red-900 focus:border-red-400 focus:ring-1 focus:ring-red-400 bg-red-50/10'
            : 'border-gray-200 focus:border-[#13763A] focus:ring-1 focus:ring-[#13763A] bg-white text-gray-900'
        ]"
      />
      <button 
        v-if="isPasswordType" 
        type="button" 
        @click="showPassword = !showPassword"
        class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 p-1.5 rounded-md focus:outline-none transition-colors cursor-pointer flex items-center justify-center z-10"
        :title="showPassword ? 'Hide password' : 'Show password'"
        :aria-label="showPassword ? 'Hide password' : 'Show password'"
      >
        <i v-if="showPassword" class="fa-solid fa-eye-slash text-[#13763A] text-[15px]"></i>
        <i v-else class="fa-solid fa-eye text-gray-400 hover:text-gray-600 text-[15px]"></i>
      </button>
    </div>
  </div>
</template>
