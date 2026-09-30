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
let resizeObserver = null
let pollInterval = null

function updateTargetRect() {
  const step = dapStore.currentStep
  if (!dapStore.isActive || !step) {
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
    // Fallback if target element not found on current screen: create a subtle centered target
    targetRect.value = null
  }
}

function handleNext() {
  dapStore.nextStep()
  nextTick(() => {
    setTimeout(updateTargetRect, 200)
  })
}

function handlePrev() {
  dapStore.prevStep()
  nextTick(() => {
    setTimeout(updateTargetRect, 200)
  })
}

function handleClose() {
  dapStore.stopDAP()
}

function handleSkipMission() {
  dapStore.nextStep()
}

function handleBackdropClick() {
  // Advance or pulse
  handleNext()
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
  window.removeEventListener('resize', updateTargetRect)
  window.removeEventListener('scroll', updateTargetRect, true)
  if (pollInterval) clearInterval(pollInterval)
})
</script>
