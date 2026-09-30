<template>
  <div
    v-if="isVisible && step"
    class="fixed z-[9995] max-w-md w-full bg-slate-900/95 backdrop-blur-xl border border-emerald-500/40 rounded-2xl shadow-2xl p-5 text-white transition-all duration-300 pointer-events-auto"
    :style="cardStyle"
  >
    <!-- Header: Mission Tag & Close -->
    <div class="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-slate-700/60">
      <div class="flex items-center gap-2">
        <span class="px-2.5 py-1 text-xs font-semibold uppercase tracking-wider rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
          {{ mission.code }}: {{ step.badge || mission.category }}
        </span>
        <span class="text-xs text-slate-400 font-medium">
          Step {{ stepIndex + 1 }} of {{ totalSteps }}
        </span>
      </div>
      <button
        @click="$emit('close')"
        class="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        title="Exit Guided Walkthrough"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Step Title -->
    <h3 class="text-lg font-bold text-white mb-2 flex items-center gap-2">
      <span class="text-emerald-400">{{ mission.icon || '🎯' }}</span>
      {{ step.title }}
    </h3>

    <!-- Step Description -->
    <p class="text-sm text-slate-300 leading-relaxed mb-3">
      {{ step.description }}
    </p>

    <!-- Dealership Context Box (Pakistani EV Realities) -->
    <div v-if="step.dealershipContext" class="mb-4 p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-300 space-y-1">
      <div class="font-semibold text-emerald-300 flex items-center gap-1.5">
        <span>🇵🇰</span> Dealership Operational Compliance:
      </div>
      <div class="text-slate-400 leading-normal">
        {{ step.dealershipContext }}
      </div>
    </div>

    <!-- Action Prompt / Interactive Instruction -->
    <div v-if="step.actionRequired" class="mb-4 px-3 py-2 rounded-lg bg-emerald-950/40 border border-emerald-500/20 text-xs text-emerald-200 flex items-center gap-2">
      <span class="animate-pulse">👉</span>
      <span><strong>Action Required:</strong> {{ step.actionRequired }}</span>
    </div>

    <!-- Progress Bar in Current Mission -->
    <div class="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-4">
      <div
        class="bg-emerald-400 h-full transition-all duration-300 rounded-full"
        :style="{ width: `${((stepIndex + 1) / totalSteps) * 100}%` }"
      ></div>
    </div>

    <!-- Footer Action Buttons -->
    <div class="flex items-center justify-between gap-2 pt-1">
      <button
        @click="$emit('prev')"
        :disabled="isFirstStep"
        class="px-3.5 py-1.5 text-xs font-medium rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        &larr; Back
      </button>

      <div class="flex items-center gap-2">
        <button
          @click="$emit('skip-mission')"
          class="px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors"
        >
          Skip Stage
        </button>

        <button
          @click="$emit('next')"
          class="px-4 py-1.5 text-xs font-semibold rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20 flex items-center gap-1.5 transition-all transform active:scale-95"
        >
          <span>{{ isLastStep ? 'Complete Stage &rsaquo;' : 'Next Step &rarr;' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  isVisible: { type: Boolean, default: false },
  step: { type: Object, default: null },
  mission: { type: Object, default: () => ({}) },
  stepIndex: { type: Number, default: 0 },
  totalSteps: { type: Number, default: 1 },
  targetRect: { type: Object, default: null }
})

defineEmits(['next', 'prev', 'close', 'skip-mission'])

const isFirstStep = computed(() => props.stepIndex === 0)
const isLastStep = computed(() => props.stepIndex >= props.totalSteps - 1)

const cardStyle = computed(() => {
  if (!props.targetRect) {
    // Center of screen fallback
    return {
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
    }
  }

  const padding = 16
  const cardWidth = 440
  const cardHeight = 320
  const windowWidth = window.innerWidth
  const windowHeight = window.innerHeight

  let top = props.targetRect.bottom + padding
  let left = props.targetRect.left

  // If card overflows bottom, position above target
  if (top + cardHeight > windowHeight - 20) {
    top = Math.max(20, props.targetRect.top - cardHeight - padding)
  }

  // If card overflows right, shift left
  if (left + cardWidth > windowWidth - 20) {
    left = Math.max(20, windowWidth - cardWidth - 20)
  }

  // Ensure left is at least padding from edge
  left = Math.max(20, left)

  return {
    top: `${top}px`,
    left: `${left}px`
  }
})
</script>
