<template>
  <div
    v-if="isVisible && step"
    ref="cardRef"
    class="fixed z-[9995] max-w-[440px] w-[92vw] bg-slate-900/95 backdrop-blur-2xl border border-emerald-500/40 rounded-2xl shadow-2xl p-5 text-white transition-all duration-300 pointer-events-auto select-none"
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

    <!-- Dealership Context Box -->
    <div v-if="step.dealershipContext" class="mb-3 p-2.5 rounded-xl bg-slate-800/90 border border-slate-700/80 text-[11px] text-slate-300 space-y-1">
      <div class="font-semibold text-emerald-300 flex items-center gap-1.5">
        <span>⚡</span> Dealership Operational Compliance:
      </div>
      <div class="text-slate-400 leading-normal">
        {{ step.dealershipContext }}
      </div>
    </div>

    <!-- Interactive Training Checkpoint Box -->
    <div v-if="step.trainingType" class="mb-3.5 p-3 rounded-xl border transition-all" :class="trainingBoxClass">
      <!-- Training Type Badge & Target Indicator -->
      <div class="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-slate-700/50">
        <div class="flex items-center gap-1.5 text-xs font-bold" :class="trainingTypeColor">
          <span>{{ trainingTypeIcon }}</span>
          <span class="uppercase tracking-wider text-[10px]">{{ step.trainingType }} CHECKPOINT</span>
        </div>
        <span v-if="step.field" class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
          Target Field: {{ step.field }}
        </span>
      </div>

      <!-- Business Rationale -->
      <div v-if="step.businessRationale" class="text-[11px] text-slate-300 mb-2.5 leading-relaxed">
        <strong class="text-slate-200">Business Rationale:</strong> {{ step.businessRationale }}
      </div>

      <!-- Mode 1: REAL UI Field Interaction (User interacts with the actual page input) -->
      <div v-if="step.trainingType === 'practice' || step.trainingType === 'input-practice'" class="space-y-2.5">
        <div class="text-[11px] text-amber-200/90 flex items-start gap-1.5">
          <span class="text-xs mt-0.5">👉</span>
          <div class="flex-1 font-medium">
            {{ step.instruction || 'Interact with the highlighted field directly on the screen above:' }}
          </div>
        </div>

        <!-- Target Guide & Example Value Banner -->
        <div v-if="step.exampleValue" class="p-2 rounded-lg bg-slate-950/70 border border-slate-800 flex items-center justify-between gap-2">
          <div class="text-[10px] text-slate-400">
            <span class="text-slate-500">Expected Value / Format:</span>
            <span class="font-mono text-emerald-400 font-semibold ml-1">{{ step.exampleValue }}</span>
          </div>
          <button
            type="button"
            @click="autofillToRealField"
            class="px-2 py-1 text-[10px] font-semibold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-md transition-all cursor-pointer whitespace-nowrap active:scale-95"
            title="Populate the actual form field on the screen with this example"
          >
            Autofill to Real Field
          </button>
        </div>

        <!-- Real-time Field Monitoring Feedback -->
        <div v-if="dapStore.isStepValidated" class="p-2 rounded-lg bg-emerald-950/50 border border-emerald-500/40 text-[11px] text-emerald-300 flex items-center gap-2 font-medium">
          <span class="text-emerald-400 text-sm font-bold">✓</span>
          <div class="flex-1 leading-snug">
            {{ step.successFeedback || 'Application field updated and validated successfully on page.' }}
            <span v-if="dapStore.currentRealFieldValue" class="block font-mono text-[10px] text-emerald-400 mt-0.5">
              Value: "{{ dapStore.currentRealFieldValue }}"
            </span>
          </div>
        </div>
        <div v-else-if="dapStore.stepValidationError && dapStore.currentRealFieldValue" class="p-2 rounded-lg bg-rose-950/50 border border-rose-500/40 text-[11px] text-rose-300 flex items-center gap-2 font-medium">
          <span class="text-rose-400 text-sm font-bold">⚠️</span>
          <div class="flex-1 leading-snug">
            {{ step.incorrectFeedback || dapStore.stepValidationError }}
          </div>
        </div>
        <div v-else class="p-2 rounded-lg bg-slate-950/40 border border-slate-800 text-[10px] text-slate-400 flex items-center gap-1.5">
          <span class="animate-pulse text-amber-400">●</span>
          <span>Awaiting user input in the highlighted application field on screen...</span>
        </div>
      </div>

      <!-- Mode 2: Decision Scenario Practice -->
      <div v-else-if="step.trainingType === 'decision'" class="space-y-2">
        <div class="text-[11px] font-semibold text-amber-300">
          {{ step.instruction || 'Select the correct managerial decision based on branch SOP:' }}
        </div>
        <div class="grid grid-cols-1 gap-1.5">
          <button
            v-for="(opt, oIdx) in step.options"
            :key="oIdx"
            type="button"
            @click="handleDecisionOption(opt)"
            class="w-full text-left p-2 rounded-lg border text-xs transition-all flex items-start gap-2 cursor-pointer"
            :class="selectedDecisionOpt === opt
              ? (opt.isCorrect ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200' : 'bg-rose-950/60 border-rose-500 text-rose-200')
              : 'bg-slate-950/60 border-slate-700/80 text-slate-300 hover:border-slate-500'"
          >
            <span class="text-xs mt-0.5">{{ selectedDecisionOpt === opt ? (opt.isCorrect ? '✅' : '❌') : '⚪' }}</span>
            <div class="flex-1">
              <div class="font-medium">{{ opt.label }}</div>
              <div v-if="selectedDecisionOpt === opt" class="text-[10px] mt-1" :class="opt.isCorrect ? 'text-emerald-300' : 'text-rose-300'">
                {{ opt.feedback }}
              </div>
            </div>
          </button>
        </div>
      </div>

      <!-- Mode 3: Action Execution Practice -->
      <div v-else-if="step.trainingType === 'execute'" class="space-y-2">
        <div class="text-[11px] text-slate-300 flex items-center gap-1.5">
          <span>👉</span>
          <span>{{ step.instruction || 'Click the highlighted application button on the screen to trigger this action.' }}</span>
        </div>
        <div v-if="dapStore.isStepValidated" class="p-2 rounded-lg bg-emerald-950/50 border border-emerald-500/40 text-[11px] text-emerald-300 flex items-center gap-2">
          <span>✓</span>
          <span>Action executed and verified on application page.</span>
        </div>
        <div v-else class="flex items-center gap-2">
          <button
            type="button"
            @click="simulateRealActionClick"
            class="w-full py-1.5 px-3 rounded-lg text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white shadow-md flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <span>Trigger Highlighted Action On Screen</span>
          </button>
        </div>
      </div>

      <!-- Mode 4: Inspection Mode -->
      <div v-else-if="step.trainingType === 'inspect'" class="text-[11px] text-slate-300 space-y-1.5">
        <div class="font-medium text-sky-300 flex items-center gap-1">
          <span>🔍</span> Deep Inspection Checklist:
        </div>
        <div class="text-slate-300 leading-relaxed">
          {{ step.instruction || 'Inspect active tab, column layout, status chips, or row actions on the highlighted view.' }}
        </div>
        <div v-if="dapStore.isStepValidated" class="text-[10px] text-sky-400 flex items-center gap-1 mt-1">
          <span>✓</span> Tab / Table verified and opened.
        </div>
        <div v-else class="text-[10px] text-slate-400 mt-1">
          Click the highlighted tab or table row on screen to proceed.
        </div>
      </div>

      <!-- Mode 5: Observe Mode -->
      <div v-else-if="step.trainingType === 'observe'" class="text-[11px] text-slate-300 space-y-1">
        <div class="font-medium text-cyan-300 flex items-center gap-1">
          <span>👁️</span> Executive Visual Metric:
        </div>
        <div class="text-slate-400 leading-relaxed">
          {{ step.instruction || 'Observe this KPI card or status block. Connect it to morning showroom readiness.' }}
        </div>
      </div>
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
        class="px-3 py-1.5 text-xs font-medium rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
      >
        &larr; Back
      </button>

      <div class="flex items-center gap-2">
        <button
          @click="$emit('skip-mission')"
          class="px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
        >
          Skip Stage
        </button>

        <button
          @click="$emit('next')"
          :disabled="isNextDisabled"
          :title="isNextDisabled ? 'Please complete the required interaction with the actual page control above to continue.' : ''"
          class="px-4 py-1.5 text-xs font-semibold rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20 flex items-center gap-1.5 transition-all transform active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <span>{{ isLastStep ? 'Complete Stage &rsaquo;' : 'Next Step &rarr;' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { dapStore } from '@/stores/dapStore.js'

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
const selectedDecisionOpt = ref(null)

const isFirstStep = computed(() => props.stepIndex === 0)
const isLastStep = computed(() => props.stepIndex >= props.totalSteps - 1)

// Whether Next button is disabled due to incomplete required interaction with the real UI
const isNextDisabled = computed(() => {
  if (!props.step) return false
  const tType = props.step.trainingType
  if (tType === 'practice' || tType === 'input-practice' || tType === 'decision' || tType === 'execute') {
    return !dapStore.isStepValidated
  }
  return false
})

// Training Type UI Helpers
const trainingTypeIcon = computed(() => {
  const t = props.step?.trainingType
  if (t === 'observe') return '👁️'
  if (t === 'inspect') return '🔍'
  if (t === 'practice' || t === 'input-practice') return '✍️'
  if (t === 'execute') return '⚡'
  if (t === 'decision') return '⚖️'
  return '🎯'
})

const trainingTypeColor = computed(() => {
  const t = props.step?.trainingType
  if (t === 'observe') return 'text-cyan-400'
  if (t === 'inspect') return 'text-sky-400'
  if (t === 'practice' || t === 'input-practice') return 'text-amber-400'
  if (t === 'execute') return 'text-purple-400'
  if (t === 'decision') return 'text-orange-400'
  return 'text-emerald-400'
})

const trainingBoxClass = computed(() => {
  const t = props.step?.trainingType
  if (t === 'observe') return 'bg-cyan-950/20 border-cyan-500/30'
  if (t === 'inspect') return 'bg-sky-950/20 border-sky-500/30'
  if (t === 'practice' || t === 'input-practice') return 'bg-amber-950/20 border-amber-500/30'
  if (t === 'execute') return 'bg-purple-950/20 border-purple-500/30'
  if (t === 'decision') return 'bg-orange-950/20 border-orange-500/30'
  return 'bg-slate-800/60 border-slate-700'
})

// Sync step changes with local practice state
watch(
  () => props.step,
  () => {
    selectedDecisionOpt.value = null
    dapStore.initStepValidation()
  },
  { immediate: true }
)

function autofillToRealField() {
  if (!props.step?.exampleValue || !props.step?.target) return

  try {
    const rawEl = document.querySelector(props.step.target)
    if (!rawEl) return

    const inputEl = (rawEl.tagName === 'INPUT' || rawEl.tagName === 'SELECT' || rawEl.tagName === 'TEXTAREA')
      ? rawEl
      : (rawEl.querySelector('input, select, textarea') || rawEl)

    if (inputEl) {
      inputEl.value = props.step.exampleValue
      // Dispatch input and change events so Vue v-model updates
      inputEl.dispatchEvent(new Event('input', { bubbles: true }))
      inputEl.dispatchEvent(new Event('change', { bubbles: true }))
      inputEl.focus()
      dapStore.recordDemoAssistance(props.step.target)
      dapStore.handleRealFieldInput(props.step.exampleValue)
    }
  } catch (e) {
    console.warn('Autofill to real field error:', e)
  }
}

function handleDecisionOption(opt) {
  selectedDecisionOpt.value = opt
  dapStore.validateCurrentStep(opt)
}

function simulateRealActionClick() {
  if (props.step?.target) {
    try {
      const el = document.querySelector(props.step.target)
      if (el) {
        el.click()
        dapStore.handleRealFieldAction()
      }
    } catch (e) {
      console.warn('Execution click simulated:', e)
      dapStore.handleRealFieldAction()
    }
  }
}

// Collision-Free Dynamic Smart Positioning Engine
const computedPlacement = computed(() => {
  if (!props.targetRect) {
    return { placement: 'center', top: 0, left: 0 }
  }

  const gap = 18
  const cardWidth = 440
  const cardHeight = 360
  const windowW = window.innerWidth
  const windowH = window.innerHeight
  const target = props.targetRect

  const targetCenterX = target.left + (target.width / 2)
  const targetCenterY = target.top + (target.height / 2)

  let pref = props.step?.placement || 'auto'

  const spaceLeft = target.left
  const spaceRight = windowW - target.right
  const spaceTop = target.top
  const spaceBottom = windowH - target.bottom

  let chosenPlacement = pref

  if (pref === 'auto') {
    if (targetCenterX > windowW * 0.55 && spaceLeft >= cardWidth + gap) {
      chosenPlacement = 'left'
    } else if (targetCenterX < windowW * 0.45 && spaceRight >= cardWidth + gap) {
      chosenPlacement = 'right'
    } else if (spaceBottom >= cardHeight + gap) {
      chosenPlacement = 'bottom'
    } else if (spaceTop >= cardHeight + gap) {
      chosenPlacement = 'top'
    } else {
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
