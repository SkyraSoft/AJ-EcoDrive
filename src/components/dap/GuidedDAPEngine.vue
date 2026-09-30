<template>
  <Teleport to="body">
    <div v-if="dapStore.isActive" class="dap-root-container">
      <!-- SVG Spotlight Overlay -->
      <SpotlightOverlay
        :is-active="dapStore.isActive"
        :target-rect="targetRect"
        @backdrop-click="handleBackdropClick"
      />

      <!-- Floating Coachmark Card -->
      <CoachmarkCard
        :is-visible="dapStore.isActive"
        :step="dapStore.currentStep"
        :mission="dapStore.currentMission"
        :step-index="dapStore.currentStepIndex"
        :total-steps="dapStore.totalStepsInCurrentMission"
        :target-rect="targetRect"
        @next="handleNext"
        @prev="handlePrev"
        @close="handleClose"
        @skip-mission="handleSkipMission"
      />
    </div>

    <!-- Persistent Floating HUD Trigger -->
    <DAPFloatingHUD />
  </Teleport>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { dapStore } from '@/stores/dapStore.js'
import SpotlightOverlay from './SpotlightOverlay.vue'
import CoachmarkCard from './CoachmarkCard.vue'
import DAPFloatingHUD from './DAPFloatingHUD.vue'

const route = useRoute()
const targetRect = ref(null)
let pollInterval = null

let activeTargetContainer = null
let activeInputElement = null

function cleanUpTargetListeners() {
  if (activeTargetContainer) {
    activeTargetContainer.classList.remove('dap-interactive-target')
  }
  if (activeInputElement) {
    activeInputElement.classList.remove('dap-interactive-target')
    activeInputElement.removeEventListener('input', onFieldInput)
    activeInputElement.removeEventListener('change', onFieldChange)
    activeInputElement.removeEventListener('click', onFieldClick)
  }
  activeTargetContainer = null
  activeInputElement = null
}

function onFieldInput(e) {
  const val = e.target.value
  dapStore.handleRealFieldInput(val)
}

function onFieldChange(e) {
  const val = e.target.value !== undefined ? e.target.value : e.target.checked
  dapStore.handleRealFieldInput(val)
}

function onFieldClick() {
  const step = dapStore.currentStep
  if (step && (step.trainingType === 'execute' || step.trainingType === 'inspect')) {
    dapStore.handleRealFieldAction()
  }
}

function bindRealElementListeners(el) {
  if (!el) return
  if (activeTargetContainer === el && activeInputElement) return

  cleanUpTargetListeners()

  activeTargetContainer = el
  activeTargetContainer.classList.add('dap-interactive-target')

  // Find the exact focusable/interactive control inside or self
  const inputEl = (
    el.tagName === 'INPUT' ||
    el.tagName === 'SELECT' ||
    el.tagName === 'TEXTAREA' ||
    el.tagName === 'BUTTON'
  ) ? el : (el.querySelector('input, select, textarea, button') || el)

  activeInputElement = inputEl
  activeInputElement.classList.add('dap-interactive-target')

  const step = dapStore.currentStep
  if (!step) return

  // Practice fields listen for real typing & selection
  if (step.trainingType === 'practice' || step.trainingType === 'input-practice') {
    activeInputElement.addEventListener('input', onFieldInput)
    activeInputElement.addEventListener('change', onFieldChange)

    // Check if the actual input already has valid data in place
    if (activeInputElement.value && String(activeInputElement.value).trim().length > 0) {
      dapStore.handleRealFieldInput(activeInputElement.value)
    }
  } 
  // Buttons and tabs listen for real click events
  else if (step.trainingType === 'execute' || step.trainingType === 'inspect') {
    activeInputElement.addEventListener('click', onFieldClick)
  }
}

function updateTargetRect() {
  const step = dapStore.currentStep
  if (!dapStore.isActive || !step) {
    cleanUpTargetListeners()
    targetRect.value = null
    return
  }

  // Look for target DOM element
  let el = null
  if (step.target) {
    try {
      el = document.querySelector(step.target)
    } catch (e) {
      console.warn('Invalid selector:', step.target)
    }
  }

  if (el) {
    bindRealElementListeners(el)

    // Scroll element into view smoothly if not visible
    const rect = el.getBoundingClientRect()
    const isVisible = (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    )

    if (!isVisible) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' })
    }

    // Re-calculate bounding rect
    const finalRect = el.getBoundingClientRect()
    targetRect.value = {
      top: finalRect.top,
      left: finalRect.left,
      width: finalRect.width,
      height: finalRect.height,
      bottom: finalRect.bottom,
      right: finalRect.right
    }
  } else {
    cleanUpTargetListeners()
    targetRect.value = null
  }
}

function handleNext() {
  cleanUpTargetListeners()
  dapStore.nextStep()
  nextTick(() => {
    setTimeout(updateTargetRect, 200)
  })
}

function handlePrev() {
  cleanUpTargetListeners()
  dapStore.prevStep()
  nextTick(() => {
    setTimeout(updateTargetRect, 200)
  })
}

function handleClose() {
  cleanUpTargetListeners()
  dapStore.stopDAP()
}

function handleSkipMission() {
  cleanUpTargetListeners()
  dapStore.nextStep()
}

function handleBackdropClick() {
  // If current step is observe, advance
  if (dapStore.currentStep?.trainingType === 'observe') {
    handleNext()
  }
}

// Watchers
watch(
  () => [dapStore.isActive, dapStore.currentMissionIndex, dapStore.currentStepIndex, route.path],
  () => {
    nextTick(() => {
      setTimeout(updateTargetRect, 250)
    })
  },
  { immediate: true }
)

onMounted(() => {
  window.addEventListener('resize', updateTargetRect)
  window.addEventListener('scroll', updateTargetRect, true)

  // Polling to handle async DOM mounts
  pollInterval = setInterval(() => {
    if (dapStore.isActive) {
      updateTargetRect()
    }
  }, 800)
})

onUnmounted(() => {
  cleanUpTargetListeners()
  window.removeEventListener('resize', updateTargetRect)
  window.removeEventListener('scroll', updateTargetRect, true)
  if (pollInterval) clearInterval(pollInterval)
})
</script>

<style>
/* Elevate active target element so it is directly interactive above the SVG backdrop */
.dap-interactive-target {
  position: relative !important;
  z-index: 9994 !important;
  pointer-events: auto !important;
}
</style>
