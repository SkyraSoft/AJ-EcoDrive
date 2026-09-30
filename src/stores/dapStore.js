import { reactive, computed, watch } from 'vue'
import router from '@/router'
import { branchManagerMissions } from '@/config/branchManagerDAPMissions.js'

const STORAGE_KEY = 'aj_ecodrive_dap_state_v1'

function loadSavedState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return JSON.parse(saved)
  } catch (e) {
    console.warn('Failed to load DAP state from localStorage', e)
  }
  return null
}

const saved = loadSavedState()

export const dapStore = reactive({
  isActive: false,
  mode: 'tour', // 'tour' (guided product tour) | 'mission' (interactive task mode)
  currentMissionIndex: saved?.currentMissionIndex || 0,
  currentStepIndex: saved?.currentStepIndex || 0,
  completedMissions: saved?.completedMissions || [],
  completedSteps: saved?.completedSteps || {},
  hudExpanded: false,
  soundEffects: true,
  autoStartOnLogin: true,

  // Computed properties
  get missions() {
    return branchManagerMissions
  },

  get currentMission() {
    return branchManagerMissions[this.currentMissionIndex] || branchManagerMissions[0]
  },

  get currentStep() {
    if (!this.currentMission || !this.currentMission.steps) return null
    return this.currentMission.steps[this.currentStepIndex] || null
  },

  get totalMissions() {
    return branchManagerMissions.length
  },

  get totalStepsInCurrentMission() {
    return this.currentMission?.steps?.length || 0
  },

  get totalSystemSteps() {
    return branchManagerMissions.reduce((acc, m) => acc + (m.steps?.length || 0), 0)
  },

  get totalCompletedStepsCount() {
    return Object.values(this.completedSteps).filter(Boolean).length
  },

  get masteryPercentage() {
    if (this.totalSystemSteps === 0) return 0
    return Math.min(100, Math.round((this.totalCompletedStepsCount / this.totalSystemSteps) * 100))
  },

  get isMissionCompleted() {
    return this.completedMissions.includes(this.currentMission?.id)
  },

  // Actions
  startDAP(missionId = null, stepIdx = 0, mode = 'tour') {
    this.isActive = true
    this.mode = mode
    if (missionId) {
      const idx = branchManagerMissions.findIndex(m => m.id === missionId)
      if (idx !== -1) {
        this.currentMissionIndex = idx
      }
    }
    this.currentStepIndex = stepIdx
    this.navigateToCurrentStepRoute()
    this.saveState()
  },

  stopDAP() {
    this.isActive = false
    this.saveState()
  },

  toggleDAP() {
    if (this.isActive) {
      this.stopDAP()
    } else {
      this.startDAP(this.currentMission?.id, this.currentStepIndex)
    }
  },

  nextStep() {
    if (!this.currentStep) return

    // Mark current step as completed
    const stepKey = `${this.currentMission.id}_step_${this.currentStepIndex}`
    this.completedSteps[stepKey] = true

    if (this.currentStepIndex < this.totalStepsInCurrentMission - 1) {
      this.currentStepIndex++
      this.navigateToCurrentStepRoute()
    } else {
      // Completed current mission
      if (!this.completedMissions.includes(this.currentMission.id)) {
        this.completedMissions.push(this.currentMission.id)
      }
      
      // Advance to next mission if available
      if (this.currentMissionIndex < this.totalMissions - 1) {
        this.currentMissionIndex++
        this.currentStepIndex = 0
        this.navigateToCurrentStepRoute()
      } else {
        // All missions finished!
        this.isActive = false
      }
    }
    this.saveState()
  },

  prevStep() {
    if (this.currentStepIndex > 0) {
      this.currentStepIndex--
      this.navigateToCurrentStepRoute()
    } else if (this.currentMissionIndex > 0) {
      this.currentMissionIndex--
      this.currentStepIndex = this.currentMission.steps.length - 1
      this.navigateToCurrentStepRoute()
    }
    this.saveState()
  },

  jumpToMission(missionId) {
    const idx = branchManagerMissions.findIndex(m => m.id === missionId)
    if (idx !== -1) {
      this.currentMissionIndex = idx
      this.currentStepIndex = 0
      this.isActive = true
      this.navigateToCurrentStepRoute()
      this.saveState()
    }
  },

  jumpToStep(stepIdx) {
    if (stepIdx >= 0 && stepIdx < this.totalStepsInCurrentMission) {
      this.currentStepIndex = stepIdx
      this.navigateToCurrentStepRoute()
      this.saveState()
    }
  },

  resetAllProgress() {
    this.completedMissions = []
    this.completedSteps = {}
    this.currentMissionIndex = 0
    this.currentStepIndex = 0
    this.saveState()
  },

  navigateToCurrentStepRoute() {
    const step = this.currentStep
    if (step && step.route && router.currentRoute.value.path !== step.route) {
      router.push(step.route).catch(() => {})
    }
  },

  saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        currentMissionIndex: this.currentMissionIndex,
        currentStepIndex: this.currentStepIndex,
        completedMissions: this.completedMissions,
        completedSteps: this.completedSteps,
        autoStartOnLogin: this.autoStartOnLogin
      }))
    } catch (e) {
      console.warn('Failed to save DAP state', e)
    }
  }
})
