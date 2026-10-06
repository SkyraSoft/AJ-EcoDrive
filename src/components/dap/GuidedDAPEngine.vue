<template>
  <Teleport to="body">
    <div v-if="dapStore.isActive" class="dap-root-container">
      <!-- SVG Spotlight Overlay -->
      <SpotlightOverlay
        :is-active="dapStore.isActive && targetState !== 'TARGET_TIMEOUT' && targetState !== 'TARGET_HIDDEN_CONDITIONALLY'"
        :target-rect="targetRect"
        @backdrop-click="handleBackdropClick"
      />

      <!-- Floating or Bottom-Dock Coachmark Card -->
      <CoachmarkCard
        :is-visible="dapStore.isActive"
        :step="dapStore.currentStep"
        :mission="dapStore.currentMission"
        :step-index="dapStore.currentStepIndex"
        :total-steps="dapStore.totalStepsInCurrentMission"
        :target-rect="targetRect"
        :target-state="targetState"
        @next="handleNext"
        @prev="handlePrev"
        @close="handleClose"
        @skip-mission="handleSkipMission"
        @retry="handleRetry"
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
import { resolveTarget, waitForTarget } from '@/tour/targetResolver.js'
import { bindTargetInteraction, cleanUpInteractionListeners } from '@/tour/engine/interactionManager.js'
import { trapFocus, releaseFocusTrap, focusPracticeTarget } from '@/tour/engine/focusManager.js'
import SpotlightOverlay from './SpotlightOverlay.vue'
import CoachmarkCard from './CoachmarkCard.vue'
import DAPFloatingHUD from './DAPFloatingHUD.vue'

const route = useRoute()
const targetRect = ref(null)
const targetState = ref('UNRESOLVED')
const activeElement = ref(null)
let resizeObserver = null

async function updateTargetGeometry() {
  const step = dapStore.currentStep
  if (!dapStore.isActive || !step) {
    cleanUpInteractionListeners()
    releaseFocusTrap()
    targetRect.value = null
    targetState.value = 'UNRESOLVED'
    activeElement.value = null
    return
  }

  // Check if current route satisfies the step's postcondition route
  if (step.postconditionRoute && route.path === step.postconditionRoute) {
    dapStore.handleRealFieldAction()
  }

  const targetIdentifier = step.targetId || step.target
  if (!targetIdentifier) {
    targetRect.value = null
    targetState.value = 'UNRESOLVED'
    return
  }

  const res = await waitForTarget(targetIdentifier, 1500)
  targetState.value = res.state
  activeElement.value = res.element
  targetRect.value = res.rect

  if (res.element) {
    // Practice mode binding
    if (step.trainingType === 'practice' || step.trainingType === 'input-practice' || step.mode === 'PRACTICE') {
      bindTargetInteraction(
        res.element,
        step,
        (val) => {
          dapStore.handleRealFieldInput(step.field || step.key || 'input', val)
        },
        (errMsg) => {
          dapStore.stepValidationError = errMsg
          dapStore.isStepValidated = false
        }
      )
      focusPracticeTarget(res.element)
    }

    // Set up ResizeObserver on the target element
    if (typeof ResizeObserver !== 'undefined') {
      if (resizeObserver) resizeObserver.disconnect()
      resizeObserver = new ResizeObserver(() => {
        if (activeElement.value) {
          const r = activeElement.value.getBoundingClientRect()
          targetRect.value = {
            top: r.top,
            left: r.left,
            bottom: r.bottom,
            right: r.right,
            width: r.width,
            height: r.height,
          }
        }
      })
      resizeObserver.observe(res.element)
    }
  }
}

function handleNext() {
  cleanUpInteractionListeners()
  dapStore.nextStep()
  nextTick(() => {
    updateTargetGeometry()
  })
}

function handlePrev() {
  cleanUpInteractionListeners()
  dapStore.prevStep()
  nextTick(() => {
    updateTargetGeometry()
  })
}

function handleClose() {
  cleanUpInteractionListeners()
  releaseFocusTrap()
  dapStore.stopDAP()
}

function handleSkipMission() {
  cleanUpInteractionListeners()
  dapStore.skipMission()
}

function handleRetry() {
  updateTargetGeometry()
}

function handleBackdropClick() {
  // If current step is observe, clicking backdrop advances
  if (dapStore.currentStep?.trainingType === 'observe' || dapStore.currentStep?.mode === 'OBSERVE') {
    handleNext()
  }
}

// Watchers
watch(
  () => [dapStore.isActive, dapStore.currentMissionIndex, dapStore.currentStepIndex, route.path],
  () => {
    if (dapStore.isActive) {
      nextTick(() => {
        updateTargetGeometry()
      })
    }
  }
)

onMounted(() => {
  window.addEventListener('resize', updateTargetGeometry)
  window.addEventListener('scroll', updateTargetGeometry, true)

  if (dapStore.isActive) {
    updateTargetGeometry()
  }
})

onUnmounted(() => {
  cleanUpInteractionListeners()
  releaseFocusTrap()
  window.removeEventListener('resize', updateTargetGeometry)
  window.removeEventListener('scroll', updateTargetGeometry, true)
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }
})
</script>

<style scoped>
.dap-root-container {
  position: relative;
  z-index: 9990;
}
</style>
