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
      <!-- Training Type Badge & Target -->
      <div class="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-slate-700/50">
        <div class="flex items-center gap-1.5 text-xs font-bold" :class="trainingTypeColor">
          <span>{{ trainingTypeIcon }}</span>
          <span class="uppercase tracking-wider text-[10px]">{{ step.trainingType }} CHECKPOINT</span>
        </div>
        <span v-if="step.field" class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
          Field: {{ step.field }}
        </span>
      </div>

      <!-- Business Rationale -->
      <div v-if="step.businessRationale" class="text-[11px] text-slate-300 mb-2 leading-relaxed">
        <strong class="text-slate-200">Business Rationale:</strong> {{ step.businessRationale }}
      </div>

      <!-- Mode 1: Practical Field Input Practice -->
      <div v-if="step.trainingType === 'practice' || step.trainingType === 'input-practice'" class="space-y-2">
        <label class="block text-[11px] font-semibold text-slate-200">
          {{ step.instruction || 'Practice entering valid operational data:' }}
        </label>
        
        <!-- Live Practice Input -->
        <div class="flex items-center gap-2">
          <!-- Dropdown if options provided -->
          <select
            v-if="step.options && step.options.length"
            v-model="practiceInputValue"
            @change="handlePracticeInput"
            class="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
          >
            <option value="" disabled>-- Select Option --</option>
            <option v-for="opt in step.options" :key="opt.value || opt" :value="opt.value || opt">
              {{ opt.label || opt }}
            </option>
          </select>
          <!-- Text/Number/Date input -->
          <input
            v-else
            :type="step.inputType || 'text'"
            v-model="practiceInputValue"
            @input="handlePracticeInput"
            :placeholder="step.exampleValue ? `e.g. ${step.exampleValue}` : 'Enter value...'"
            class="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
          <button
            v-if="step.exampleValue"
            type="button"
            @click="autofillExample"
            class="px-2 py-1.5 text-[10px] font-medium bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
            title="Autofill required example pattern"
          >
            Autofill
          </button>
        </div>

        <!-- Real-time Validation Feedback -->
        <div v-if="dapStore.isStepValidated" class="text-[11px] text-emerald-400 flex items-center gap-1.5 font-medium">
          <span>✓</span>
          <span>{{ step.successFeedback || 'Valid operational format verified.' }}</span>
        </div>
        <div v-else-if="dapStore.stepValidationError && practiceInputValue" class="text-[11px] text-rose-400 flex items-center gap-1.5 font-medium">
          <span>⚠️</span>
          <span>{{ step.incorrectFeedback || dapStore.stepValidationError }}</span>
        </div>
        <div v-else class="text-[10px] text-slate-400 flex items-center gap-1">
          <span>ℹ️</span>
          <span>{{ step.validation?.rule || 'Mandatory operational field. Enter valid data to unlock next step.' }}</span>
        </div>
      </div>

      <!-- Mode 2: Decision Scenario Practice -->
      <div v-else-if="step.trainingType === 'decision'" class="space-y-2">
        <div class="text-[11px] font-semibold text-amber-300">
          {{ step.instruction || 'Select the correct managerial decision:' }}
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
        <div class="text-[11px] text-slate-300">
          {{ step.instruction || 'Execute or simulate the action on the highlighted target.' }}
        </div>
        <div class="flex items-center gap-2">
          <button
            type="button"
            @click="handleSimulateExecution"
            class="w-full py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            :class="isExecuted ? 'bg-emerald-900/40 text-emerald-300 border border-emerald-500/40' : 'bg-purple-600 hover:bg-purple-500 text-white shadow-md'"
          >
            <span>{{ isExecuted ? '✓ Action Executed & Verified' : (step.actionName || 'Execute Action & Verify') }}</span>
          </button>
        </div>
      </div>

      <!-- Mode 4: Inspection Mode -->
      <div v-else-if="step.trainingType === 'inspect'" class="text-[11px] text-slate-300 space-y-1">
        <div class="font-medium text-sky-300 flex items-center gap-1">
          <span>🔍</span> Deep Inspection Checklist:
        </div>
        <div class="text-slate-400 leading-relaxed">
          {{ step.instruction || 'Inspect active tab, column layout, status chips, and row actions on the highlighted view.' }}
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

    <!-- Action Required Box -->
    <div v-if="step.actionRequired && !step.trainingType" class="mb-3 px-3 py-2 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-[11px] text-emerald-200 flex items-center gap-2">
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
          :title="isNextDisabled ? 'Please complete the required practice action above to continue.' : ''"
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
const practiceInputValue = ref('')
const selectedDecisionOpt = ref(null)
const isExecuted = ref(false)

const isFirstStep = computed(() => props.stepIndex === 0)
const isLastStep = computed(() => props.stepIndex >= props.totalSteps - 1)

// Whether Next button is disabled due to incomplete required practice
const isNextDisabled = computed(() => {
  if (!props.step) return false
  const tType = props.step.trainingType
  if (tType === 'practice' || tType === 'input-practice' || tType === 'decision') {
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
  (newStep) => {
    practiceInputValue.value = (newStep?.target && dapStore.interactiveInputValues[newStep.target]) || ''
    selectedDecisionOpt.value = null
    isExecuted.value = false
    dapStore.initStepValidation()
    if (practiceInputValue.value) {
      dapStore.validateCurrentStep(practiceInputValue.value)
    }
  },
  { immediate: true }
)

function handlePracticeInput() {
  dapStore.validateCurrentStep(practiceInputValue.value)
}

function autofillExample() {
  if (props.step?.exampleValue) {
    practiceInputValue.value = props.step.exampleValue
    dapStore.validateCurrentStep(props.step.exampleValue)
  }
}

function handleDecisionOption(opt) {
  selectedDecisionOpt.value = opt
  dapStore.validateCurrentStep(opt)
}

function handleSimulateExecution() {
  isExecuted.value = true
  dapStore.validateCurrentStep(true)

  // Trigger click on target element if it exists in DOM
  if (props.step?.target) {
    try {
      const el = document.querySelector(props.step.target)
      if (el && typeof el.click === 'function') {
        el.click()
      }
    } catch (e) {
      console.warn('Execution click simulated:', e)
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
