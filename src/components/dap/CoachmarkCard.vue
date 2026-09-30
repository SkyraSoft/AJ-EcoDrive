<template>
  <div
    v-if="isVisible && step"
    ref="cardRef"
    class="fixed z-[9995] max-w-[420px] w-[90vw] bg-slate-900/95 backdrop-blur-2xl border border-emerald-500/40 rounded-2xl shadow-2xl p-5 text-white transition-all duration-300 pointer-events-auto select-none"
    :style="cardPositionStyle"
  >
    <!-- Arrow pointer pointing to target -->
    <div
      v-if="arrowStyle"
      class="absolute w-3 h-3 bg-slate-900 border-emerald-500/50 transform rotate-45 pointer-events-none"
      :style="arrowStyle"
    ></div>

    <!-- Header: Mission Tag, Step Counter & Close -->
    <div class="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-slate-700/60">
      <div class="flex items-center gap-2">
        <span class="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
          {{ mission.code }}: {{ step.badge || mission.category }}
        </span>
        <span class="text-xs text-slate-400 font-medium">
          Step {{ stepIndex + 1 }} of {{ totalSteps }}
        </span>
      </div>
      <button
        @click="$emit('close')"
        class="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        title="Exit Walkthrough"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Step Title -->
    <h3 class="text-base font-bold text-white mb-2 flex items-center gap-2">
      <span class="text-emerald-400 text-lg">{{ mission.icon || '🎯' }}</span>
      <span>{{ step.title }}</span>
    </h3>

    <!-- Step Description -->
    <p class="text-xs text-slate-300 leading-relaxed mb-3 font-normal">
      {{ step.description }}
    </p>

    <!-- Dealership Context Box (Pakistani EV Realities) -->
    <div v-if="step.dealershipContext" class="mb-3.5 p-2.5 rounded-xl bg-slate-800/90 border border-slate-700/80 text-[11px] text-slate-300 space-y-1">
      <div class="font-semibold text-emerald-300 flex items-center gap-1.5">
        <span>🇵🇰</span> Dealership Operational Compliance:
      </div>
      <div class="text-slate-400 leading-normal">
        {{ step.dealershipContext }}
      </div>
    </div>

    <!-- Action Required Box -->
    <div v-if="step.actionRequired" class="mb-3.5 px-3 py-2 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-[11px] text-emerald-200 flex items-center gap-2">
      <span class="text-emerald-400 text-xs animate-pulse font-bold">👉</span>
      <span><strong>Action Required:</strong> {{ step.actionRequired }}</span>
    </div>

    <!-- Progress Bar -->
    <div class="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-3.5">
      <div
        class="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-300 rounded-full"
        :style="{ width: `${((stepIndex + 1) / totalSteps) * 100}%` }"
      ></div>
    </div>

    <!-- Footer Action Buttons -->
    <div class="flex items-center justify-between gap-2 pt-1">
      <button
        @click="$emit('prev')"
        :disabled="isFirstStep"
        class="px-3 py-1.5 text-xs font-medium rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
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
          class="px-4 py-1.5 text-xs font-semibold rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20 flex items-center gap-1.5 transition-all transform active:scale-95 cursor-pointer"
        >
          <span>{{ isLastStep ? 'Complete Stage &rsaquo;' : 'Next Step &rarr;' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  isVisible: { type: Boolean, default: false },
  step: { type: Object, default: null },
  mission: { type: Object, default: () => ({}) },
  stepIndex: { type: Number, default: 0 },
  totalSteps: { type: Number, default: 1 },
  targetRect: { type: Object, default: null }
})

defineEmits(['next', 'prev', 'close', 'skip-mission'])

const cardRef = ref(null)

const isFirstStep = computed(() => props.stepIndex === 0)
const isLastStep = computed(() => props.stepIndex >= props.totalSteps - 1)

// Collision-Free Dynamic Smart Positioning Engine
const computedPlacement = computed(() => {
  if (!props.targetRect) {
    return { placement: 'center', top: 0, left: 0 }
  }

  const gap = 18
  const cardWidth = 420
  const cardHeight = 310
  const windowW = window.innerWidth
  const windowH = window.innerHeight
  const target = props.targetRect

  // Target center coordinates
  const targetCenterX = target.left + (target.width / 2)
  const targetCenterY = target.top + (target.height / 2)

  // Preferred placement from step config (or auto-calculate)
  let pref = props.step?.placement || 'auto'

  // Calculate free space in all 4 directions
  const spaceLeft = target.left
  const spaceRight = windowW - target.right
  const spaceTop = target.top
  const spaceBottom = windowH - target.bottom

  let chosenPlacement = pref

  if (pref === 'auto') {
    // If target is in right half of screen, prefer LEFT placement so target is completely visible
    if (targetCenterX > windowW * 0.55 && spaceLeft >= cardWidth + gap) {
      chosenPlacement = 'left'
    } 
    // If target is in left half of screen, prefer RIGHT placement
    else if (targetCenterX < windowW * 0.45 && spaceRight >= cardWidth + gap) {
      chosenPlacement = 'right'
    } 
    // If target is near top, prefer BOTTOM placement
    else if (spaceBottom >= cardHeight + gap) {
      chosenPlacement = 'bottom'
    } 
    // If target is near bottom, prefer TOP placement
    else if (spaceTop >= cardHeight + gap) {
      chosenPlacement = 'top'
    } 
    else {
      // Pick direction with largest free space
      const maxSpace = Math.max(spaceLeft, spaceRight, spaceBottom, spaceTop)
      if (maxSpace === spaceLeft) chosenPlacement = 'left'
      else if (maxSpace === spaceRight) chosenPlacement = 'right'
      else if (maxSpace === spaceBottom) chosenPlacement = 'bottom'
      else chosenPlacement = 'top'
    }
  }

  let top = 0
  let left = 0

  if (chosenPlacement === 'left') {
    left = Math.max(20, target.left - cardWidth - gap)
    top = Math.min(Math.max(20, targetCenterY - (cardHeight / 2)), windowH - cardHeight - 20)
  } else if (chosenPlacement === 'right') {
    left = Math.min(target.right + gap, windowW - cardWidth - 20)
    top = Math.min(Math.max(20, targetCenterY - (cardHeight / 2)), windowH - cardHeight - 20)
  } else if (chosenPlacement === 'bottom') {
    top = Math.min(target.bottom + gap, windowH - cardHeight - 20)
    left = Math.min(Math.max(20, targetCenterX - (cardWidth / 2)), windowW - cardWidth - 20)
  } else if (chosenPlacement === 'top') {
    top = Math.max(20, target.top - cardHeight - gap)
    left = Math.min(Math.max(20, targetCenterX - (cardWidth / 2)), windowW - cardWidth - 20)
  } else {
    // center
    return { placement: 'center', top: '50%', left: '50%', isCenter: true }
  }

  return { placement: chosenPlacement, top: `${top}px`, left: `${left}px`, isCenter: false }
})

const cardPositionStyle = computed(() => {
  const p = computedPlacement.value
  if (p.isCenter || !props.targetRect) {
    return {
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
    }
  }
  return {
    top: p.top,
    left: p.left
  }
})

const arrowStyle = computed(() => {
  if (!props.targetRect || computedPlacement.value.isCenter) return null
  const p = computedPlacement.value.placement

  if (p === 'left') {
    return { right: '-6px', top: '45%', borderTop: '1px solid', borderRight: '1px solid' }
  }
  if (p === 'right') {
    return { left: '-6px', top: '45%', borderBottom: '1px solid', borderLeft: '1px solid' }
  }
  if (p === 'bottom') {
    return { top: '-6px', left: '45%', borderTop: '1px solid', borderLeft: '1px solid' }
  }
  if (p === 'top') {
    return { bottom: '-6px', left: '45%', borderBottom: '1px solid', borderRight: '1px solid' }
  }
  return null
})
</script>
