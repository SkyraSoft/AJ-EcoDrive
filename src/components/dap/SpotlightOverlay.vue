<template>
  <div v-if="isActive && targetRect" class="fixed inset-0 z-[9990] pointer-events-none transition-all duration-300">
    <svg class="w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
      <!-- Dark backdrop with true geometric cutout: painted outside, hollow inside -->
      <path
        :d="backdropPath"
        fill="rgba(15, 23, 42, 0.75)"
        fill-rule="evenodd"
        class="pointer-events-auto cursor-pointer"
        @click="$emit('backdrop-click')"
      />
    </svg>

    <!-- Glowing spotlight border around the cutout -->
    <div
      class="fixed pointer-events-none border-2 border-emerald-400/80 rounded-xl shadow-[0_0_25px_rgba(52,211,153,0.6)] transition-all duration-300 ease-out z-[9992]"
      :style="{
        top: `${spotlightY}px`,
        left: `${spotlightX}px`,
        width: `${spotlightWidth}px`,
        height: `${spotlightHeight}px`
      }"
    >
      <!-- Pulsing Beacon in Top Corner -->
      <span class="absolute -top-2 -right-2 flex h-4 w-4">
        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span class="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-slate-900"></span>
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  isActive: { type: Boolean, default: false },
  targetRect: { type: Object, default: null },
  padding: { type: Number, default: 8 }
})

defineEmits(['backdrop-click'])

const spotlightX = computed(() => {
  if (!props.targetRect) return 0
  return Math.max(0, props.targetRect.left - props.padding)
})

const spotlightY = computed(() => {
  if (!props.targetRect) return 0
  return Math.max(0, props.targetRect.top - props.padding)
})

const spotlightWidth = computed(() => {
  if (!props.targetRect) return 0
  return props.targetRect.width + (props.padding * 2)
})

const spotlightHeight = computed(() => {
  if (!props.targetRect) return 0
  return props.targetRect.height + (props.padding * 2)
})

const backdropPath = computed(() => {
  if (!props.targetRect) return ''
  const vw = typeof window !== 'undefined' ? (window.innerWidth || 1920) : 1920
  const vh = typeof window !== 'undefined' ? (window.innerHeight || 1080) : 1080
  const x = spotlightX.value
  const y = spotlightY.value
  const w = spotlightWidth.value
  const h = spotlightHeight.value
  const r = 10

  // Outer full-screen rect + inner rounded rect cutout with evenodd fill rule
  return `M 0,0 L ${vw},0 L ${vw},${vh} L 0,${vh} Z ` +
    `M ${x + r},${y} ` +
    `H ${x + w - r} ` +
    `A ${r},${r} 0 0 1 ${x + w},${y + r} ` +
    `V ${y + h - r} ` +
    `A ${r},${r} 0 0 1 ${x + w - r},${y + h} ` +
    `H ${x + r} ` +
    `A ${r},${r} 0 0 1 ${x},${y + h - r} ` +
    `V ${y + r} ` +
    `A ${r},${r} 0 0 1 ${x + r},${y} Z`
})
</script>
