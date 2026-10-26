<script setup>
import { ref, watch, nextTick } from 'vue'

const props = defineProps({
  length: {
    type: Number,
    default: 6
  },
  modelValue: {
    type: String,
    default: ''
  },
  hasError: {
    type: Boolean,
    default: false
  }
})

// ... (keep the rest of the script setup the same)
const emit = defineEmits(['update:modelValue'])

const otpArray = ref(new Array(props.length).fill(''))
const inputs = ref([])

watch(() => props.modelValue, (newVal) => {
  if (newVal.length <= props.length) {
    const chars = newVal.split('')
    otpArray.value = new Array(props.length).fill('').map((_, i) => chars[i] || '')
  }
}, { immediate: true })

const handleInput = (event, index) => {
  let val = event.target.value
  val = val.replace(/\D/g, '')
  
  if (val) {
    otpArray.value[index] = val[val.length - 1]
    if (index < props.length - 1) {
      inputs.value[index + 1].focus()
    }
  } else {
    otpArray.value[index] = ''
  }
  
  emit('update:modelValue', otpArray.value.join(''))
}

const handleKeydown = (event, index) => {
  if (event.key === 'Backspace' && !otpArray.value[index] && index > 0) {
    inputs.value[index - 1].focus()
  } else if (event.key === 'ArrowLeft' && index > 0) {
    inputs.value[index - 1].focus()
  } else if (event.key === 'ArrowRight' && index < props.length - 1) {
    inputs.value[index + 1].focus()
  }
}

const handlePaste = (event) => {
  event.preventDefault()
  let paste = (event.clipboardData || window.clipboardData).getData('text')
  paste = paste.replace(/\D/g, '').slice(0, props.length)
  
  const chars = paste.split('')
  for (let i = 0; i < chars.length; i++) {
    otpArray.value[i] = chars[i]
  }
  
  emit('update:modelValue', otpArray.value.join(''))
  
  const nextEmptyIndex = otpArray.value.findIndex(val => val === '')
  const focusIndex = nextEmptyIndex === -1 ? props.length - 1 : nextEmptyIndex
  if (inputs.value[focusIndex]) {
    inputs.value[focusIndex].focus()
  }
}
</script>

<template>
  <div class="flex justify-between gap-3 my-6">
    <input
      v-for="(val, index) in otpArray"
      :key="index"
      :ref="el => { if (el) inputs[index] = el }"
      type="text"
      inputmode="numeric"
      maxlength="1"
      :value="val"
      @input="handleInput($event, index)"
      @keydown="handleKeydown($event, index)"
      @paste="handlePaste"
      class="w-12 h-14 text-center text-xl font-bold rounded-lg border focus:ring-1 outline-none transition-colors"
      :class="[
        hasError 
          ? 'border-red-200 text-red-900 focus:border-red-400 focus:ring-red-400 bg-red-50/10'
          : 'border-gray-200 focus:border-[#13763A] focus:ring-[#13763A]'
      ]"
    />
  </div>
</template>
