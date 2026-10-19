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
        @restart="handleRestart"
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
    dapStore.nextStep()
    nextTick(() => {
      updateTargetGeometry()
    })
    return
  }

  // Check if modal postcondition is already met (e.g. modal already rendered in DOM)
  if (step.postconditionSelector && typeof document !== 'undefined') {
    try {
      const modalEl = document.querySelector(step.postconditionSelector)
      if (modalEl) {
        dapStore.handleRealFieldAction()
        dapStore.nextStep()
        nextTick(() => {
          updateTargetGeometry()
        })
        return
      }
    } catch (e) {
      // safe fallback
    }
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
    // Smoothly scroll target into comfortable view if near top/bottom viewport edges
    try {
      const rect = res.element.getBoundingClientRect()
      const vh = window.innerHeight || 720
      if (rect.top < 100 || rect.bottom > vh - 140) {
        res.element.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'nearest'
        })
        setTimeout(() => {
          if (activeElement.value) {
            const updated = activeElement.value.getBoundingClientRect()
            setTargetRectIfChanged(updated)
          }
        }, 160)
      }
    } catch (e) {
      // safe fallback
    }

    // Practice mode binding
    if (step.trainingType === 'practice' || step.trainingType === 'input-practice' || step.mode === 'PRACTICE') {
      bindTargetInteraction(
        res.element,
        step,
        (val) => {
          dapStore.handleRealFieldInput(step.field || step.key || 'input', val)
          // If this was an action click / open modal / open drawer / navigate step, advance automatically
          if (
            step.expectedAction === 'CLICK' ||
            step.actionType === 'OPEN_MODAL' ||
            step.actionType === 'OPEN_DRAWER' ||
            step.actionType === 'NAVIGATE' ||
            step.actionType === 'CLICK'
          ) {
            setTimeout(() => {
              if (dapStore.isActive && dapStore.currentStep?.id === step.id) {
                dapStore.nextStep()
                nextTick(() => {
                  updateTargetGeometry()
                })
              }
            }, 260)
          }
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
          setTargetRectIfChanged(r)
        }
      })
      resizeObserver.observe(res.element)
    }
  }
}

function setTargetRectIfChanged(r) {
  if (!r) {
    targetRect.value = null
    return
  }
  const cur = targetRect.value
  if (
    !cur ||
    Math.abs(cur.top - r.top) >= 2 ||
    Math.abs(cur.left - r.left) >= 2 ||
    Math.abs(cur.width - r.width) >= 2 ||
    Math.abs(cur.height - r.height) >= 2
  ) {
    targetRect.value = {
      top: Math.round(r.top),
      left: Math.round(r.left),
      bottom: Math.round(r.bottom),
      right: Math.round(r.right),
      width: Math.round(r.width),
      height: Math.round(r.height),
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

function handleRestart() {
  cleanUpInteractionListeners()
  dapStore.restartCurrentMission()
  nextTick(() => {
    updateTargetGeometry()
  })
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

let scrollRafId = null
function handleScroll() {
  if (scrollRafId) return
  scrollRafId = requestAnimationFrame(() => {
    scrollRafId = null
    if (activeElement.value) {
      const r = activeElement.value.getBoundingClientRect()
      setTargetRectIfChanged(r)
    }
  })
}

onMounted(() => {
  window.addEventListener('resize', updateTargetGeometry)
  window.addEventListener('scroll', handleScroll, true)

  if (dapStore.isActive) {
    updateTargetGeometry()
  }
})

onUnmounted(() => {
  cleanUpInteractionListeners()
  releaseFocusTrap()
  window.removeEventListener('resize', updateTargetGeometry)
  window.removeEventListener('scroll', handleScroll, true)
  if (scrollRafId) {
    cancelAnimationFrame(scrollRafId)
    scrollRafId = null
  }
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
