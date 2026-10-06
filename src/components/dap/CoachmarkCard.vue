<template>
  <div
    v-if="isVisible && step"
    ref="cardRef"
    class="fixed z-[9995] text-white transition-all duration-300 pointer-events-auto select-none"
    :class="[
      placementMode === 'BOTTOM_DOCK'
        ? 'bottom-4 left-4 right-4 max-w-[640px] mx-auto bg-slate-900/98 backdrop-blur-2xl border border-emerald-500/50 rounded-2xl shadow-2xl p-5 max-h-[45vh] overflow-y-auto'
        : placementMode === 'TARGET_UNAVAILABLE'
        ? 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[420px] w-[90vw] bg-slate-900/98 backdrop-blur-2xl border border-amber-500/60 rounded-2xl shadow-2xl p-5'
        : 'max-w-[440px] w-[92vw] bg-slate-900/95 backdrop-blur-2xl border border-emerald-500/40 rounded-2xl shadow-2xl p-5'
    ]"
    :style="cardPositionStyle"
    role="region"
    aria-label="Interactive Tour Guidance"
  >
    <!-- Geometric SVG Connector line pointing to target (Floating mode only) -->
    <svg
      v-if="placementMode === 'FLOATING' && connectorCoords"
      class="fixed inset-0 pointer-events-none z-[9994] overflow-visible"
    >
      <line
        :x1="connectorCoords.startX"
        :y1="connectorCoords.startY"
        :x2="connectorCoords.endX"
        :y2="connectorCoords.endY"
        stroke="#10b981"
        stroke-width="2.5"
        stroke-dasharray="4 2"
        stroke-linecap="round"
      />
      <circle :cx="connectorCoords.endX" :cy="connectorCoords.endY" r="4" fill="#34d1bf" />
    </svg>

    <!-- Header: Mission Tag, Step Counter & Close -->
    <div class="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-slate-700/60">
      <div class="flex items-center gap-2">
        <span class="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
          {{ mission?.code || 'TOUR' }}: {{ step.badge || mission?.category || 'Walkthrough' }}
        </span>
        <span class="text-xs text-slate-400 font-medium">
          Step {{ stepIndex + 1 }} of {{ totalSteps }}
        </span>
      </div>
      <button
        @click="$emit('close')"
        class="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        title="Exit Walkthrough (Esc)"
        aria-label="Close tour"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- TARGET UNAVAILABLE / MISSING STATE CARD -->
    <div v-if="placementMode === 'TARGET_UNAVAILABLE'" class="space-y-3">
      <div class="flex items-center gap-2 text-amber-400 font-semibold text-sm">
        <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <span>This item isn't available on the current screen.</span>
      </div>
      <p class="text-xs text-slate-300 leading-relaxed">
        Return to the expected page or retry after the page finishes loading.
      </p>
      <div class="flex items-center justify-end gap-2 pt-2 border-t border-slate-700/60">
        <button
          @click="$emit('retry')"
          class="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
        >
          Retry
        </button>
        <button
          v-if="step.skippable !== false"
          @click="$emit('next')"
          class="px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-600 hover:bg-amber-500 text-white transition-colors"
        >
          Skip
        </button>
        <button
          @click="$emit('close')"
          class="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 transition-colors"
        >
          Exit Tour
        </button>
      </div>
    </div>

    <!-- STANDARD NORMAL CONTENT (FLOATING OR BOTTOM DOCK) -->
    <div v-else>
      <!-- Step Title -->
      <h3 class="text-base font-bold text-white mb-2 flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        {{ step.title || step.task || 'Dealership Operational Step' }}
      </h3>

      <!-- Pedagogical Body: Explanation & Instruction -->
      <div class="text-xs text-slate-300 space-y-2 mb-4 leading-relaxed">
        <p v-if="step.explanation">{{ step.explanation }}</p>
        <p v-if="step.instruction" class="p-2 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-200 font-medium">
          <span class="text-emerald-400 font-bold">Action:</span> {{ step.instruction }}
        </p>
        <p v-if="step.whyItMatters" class="text-[11px] text-slate-400 italic">
          <span class="text-slate-300 font-semibold not-italic">Why it matters:</span> {{ step.whyItMatters }}
        </p>
      </div>

      <!-- Interactive Input / Validation Feedback -->
      <div v-if="dapStore.stepValidationError" class="mb-3 p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-2">
        <svg class="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{{ dapStore.stepValidationError }}</span>
      </div>

      <!-- Action Completed Feedback -->
      <div v-else-if="dapStore.isStepValidated && (step.trainingType === 'practice' || step.trainingType === 'input-practice' || step.mode === 'PRACTICE')" class="mb-3 p-2.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
        <svg class="w-4 h-4 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        <span class="font-medium">{{ step.successMessage || 'Action completed! You can now proceed to the next step.' }}</span>
      </div>

      <!-- Navigation & Action Footer -->
      <div class="flex items-center justify-between gap-2 pt-2 border-t border-slate-700/60">
        <div class="flex items-center gap-1.5">
          <button
            v-if="stepIndex > 0"
            @click="$emit('prev')"
            class="px-2.5 py-1 text-xs rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            Back
          </button>
          <button
            v-if="step.skippable !== false && stepIndex < totalSteps - 1"
            @click="$emit('next')"
            class="px-2.5 py-1 text-xs rounded-lg text-slate-500 hover:text-slate-300 transition-colors"
          >
            Skip
          </button>
        </div>

        <button
          @click="$emit('next')"
          :disabled="!dapStore.canAdvance"
          class="px-4 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5"
          :class="dapStore.canAdvance
            ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/25 cursor-pointer'
            : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'"
        >
          <span>{{ stepIndex === totalSteps - 1 ? 'Complete Tour' : 'Next Step' }}</span>
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { dapStore } from '@/stores/dapStore.js'
import { calculatePlacement } from '@/tour/positioning/placementEngine.js'
import { getViewportRect, getSafeInsets } from '@/tour/geometry/viewport.js'
import { getOccupiedRegions } from '@/tour/geometry/occupiedRegions.js'

const props = defineProps({
  isVisible: { type: Boolean, default: false },
  step: { type: Object, default: null },
  mission: { type: Object, default: null },
  stepIndex: { type: Number, default: 0 },
  totalSteps: { type: Number, default: 1 },
  targetRect: { type: Object, default: null },
  targetState: { type: String, default: 'TARGET_FOUND' },
})

defineEmits(['next', 'prev', 'close', 'skip-mission', 'retry'])

const cardRef = ref(null)
const cardSize = ref({ width: 400, height: 260 })
let resizeObserver = null

onMounted(() => {
  if (cardRef.value && typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect) {
          cardSize.value = {
            width: entry.contentRect.width,
            height: entry.contentRect.height,
          }
        }
      }
    })
    resizeObserver.observe(cardRef.value)
  }
})

onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect();
    resizeObserver = null;
  }
})

const placementResult = computed(() => {
  if (!props.isVisible || !props.step) return null

  // If the step has been validated (e.g. action executed and target element transitioned/unmounted)
  if (dapStore.isStepValidated && (!props.targetRect || props.targetState === 'TARGET_TIMEOUT' || props.targetState === 'TARGET_HIDDEN_CONDITIONALLY')) {
    return {
      mode: 'BOTTOM_DOCK',
      placement: 'bottom',
      top: null,
      left: null,
      connector: null,
    }
  }

  // If target element is not found or missing
  if (!props.targetRect || props.targetState === 'TARGET_TIMEOUT' || props.targetState === 'TARGET_HIDDEN_CONDITIONALLY') {
    return {
      mode: 'TARGET_UNAVAILABLE',
      placement: 'center',
      top: null,
      left: null,
      connector: null,
    }
  }

  const viewport = getViewportRect()
  const safeInsets = getSafeInsets()
  const occupied = getOccupiedRegions()

  const preferred = props.step.preferredPlacement || props.step.placement || 'right'

  return calculatePlacement(
    viewport,
    props.targetRect,
    cardSize.value,
    occupied,
    safeInsets,
    preferred
  )
})

const placementMode = computed(() => placementResult.value?.mode || 'FLOATING')

const cardPositionStyle = computed(() => {
  const p = placementResult.value
  if (!p) return {}

  if (p.mode === 'BOTTOM_DOCK') {
    return {} // Styled via Tailwind bottom-dock classes
  }

  if (p.mode === 'TARGET_UNAVAILABLE') {
    return {} // Centered via Tailwind
  }

  return {
    top: `${p.top}px`,
    left: `${p.left}px`,
  }
})

const connectorCoords = computed(() => placementResult.value?.connector || null)
</script>
