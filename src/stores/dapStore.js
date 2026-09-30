import { reactive, computed } from 'vue'
import router from '@/router'
import { branchManagerMissions } from '@/config/branchManagerDAPMissions.js'
import { branchManagerCoverageRegistry, totalBranchManagerCheckpoints } from '@/config/branchManagerDAPCoverage.js'

const STORAGE_KEY = 'aj_ecodrive_dap_state_v2'

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
  mode: saved?.mode || 'practice', // 'observe' | 'inspect' | 'practice' | 'execute' | 'decision'
  currentMissionIndex: saved?.currentMissionIndex || 0,
  currentStepIndex: saved?.currentStepIndex || 0,
  currentRoute: saved?.currentRoute || '/dashboard',
  activeCheckpointId: saved?.activeCheckpointId || 'M1-R8-H1',
  completedMissions: saved?.completedMissions || [],
  completedSteps: saved?.completedSteps || {},
  completedCheckpoints: saved?.completedCheckpoints || {},
  interactiveInputValues: {},
  stepValidationError: null,
  isStepValidated: false,
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

  get totalSystemCheckpoints() {
    return totalBranchManagerCheckpoints || 3394
  },

  get totalCompletedCheckpointsCount() {
    return Object.keys(this.completedCheckpoints).length
  },

  get totalStepsCount() {
    return branchManagerMissions.reduce((acc, m) => acc + (m.steps?.length || 0), 0)
  },

  get totalSystemSteps() {
    return this.totalStepsCount
  },

  get totalCompletedStepsCount() {
    return Object.values(this.completedSteps).filter(Boolean).length
  },

  get masteryPercentage() {
    const totalRequired = this.totalStepsCount || 1
    const completed = this.totalCompletedStepsCount
    return Math.min(100, Math.round((completed / totalRequired) * 100))
  },

  get isMissionCompleted() {
    return this.completedMissions.includes(this.currentMission?.id)
  },

  // Actions
  startDAP(missionId = null, stepIdx = 0) {
    this.isActive = true
    this.isStepValidated = false
    this.stepValidationError = null
    
    if (missionId) {
      const idx = branchManagerMissions.findIndex(m => m.id === missionId)
      if (idx !== -1) {
        this.currentMissionIndex = idx
      }
    }
    this.currentStepIndex = stepIdx
    this.syncActiveCheckpoint()
    this.initStepValidation()
    this.navigateToCurrentStepRoute()
    this.saveState()
  },

  resumeTraining() {
    this.isActive = true
    this.syncActiveCheckpoint()
    this.initStepValidation()
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
      this.resumeTraining()
    }
  },

  syncActiveCheckpoint() {
    const step = this.currentStep
    if (step) {
      this.activeCheckpointId = step.checkpointId || `${this.currentMission.code}_step_${this.currentStepIndex}`
      this.currentRoute = step.route || router.currentRoute.value.path
    }
  },

  initStepValidation() {
    const step = this.currentStep
    if (!step) {
      this.isStepValidated = true
      this.stepValidationError = null
      return
    }

    const tType = step.trainingType || 'observe'
    if (tType === 'observe' || tType === 'inspect') {
      this.isStepValidated = true
      this.stepValidationError = null
    } else {
      this.isStepValidated = false
      this.stepValidationError = null
    }
  },

  validateCurrentStep(inputVal) {
    const step = this.currentStep
    if (!step) return true

    const tType = step.trainingType || 'observe'

    if (tType === 'observe' || tType === 'inspect') {
      this.isStepValidated = true
      this.stepValidationError = null
      return true
    }

    if (tType === 'execute') {
      this.isStepValidated = true
      this.stepValidationError = null
      return true
    }

    if (tType === 'decision') {
      if (inputVal && (inputVal.isCorrect === true || inputVal === true)) {
        this.isStepValidated = true
        this.stepValidationError = null
        return true
      } else {
        this.isStepValidated = false
        this.stepValidationError = inputVal?.feedback || 'Incorrect operational decision. Review branch policy.'
        return false
      }
    }

    // Practice / input validation
    const valRule = step.validation
    if (!valRule) {
      if (inputVal && String(inputVal).trim().length > 0) {
        this.isStepValidated = true
        this.stepValidationError = null
        return true
      }
      this.isStepValidated = false
      this.stepValidationError = 'This field requires input to proceed.'
      return false
    }

    if (valRule.required && (!inputVal || String(inputVal).trim() === '')) {
      this.stepValidationError = valRule.emptyMessage || step.incorrectFeedback || 'This operational field is mandatory.'
      this.isStepValidated = false
      return false
    }

    if (valRule.pattern) {
      const regex = new RegExp(valRule.pattern)
      if (!regex.test(String(inputVal).trim())) {
        this.stepValidationError = valRule.invalidMessage || step.incorrectFeedback || 'Invalid format for this field.'
        this.isStepValidated = false
        return false
      }
    }

    if (valRule.min && Number(inputVal) < valRule.min) {
      this.stepValidationError = `Value must be at least ${valRule.min}.`
      this.isStepValidated = false
      return false
    }

    if (valRule.max && Number(inputVal) > valRule.max) {
      this.stepValidationError = `Value cannot exceed ${valRule.max}.`
      this.isStepValidated = false
      return false
    }

    this.isStepValidated = true
    this.stepValidationError = null
    if (step.target) {
      this.interactiveInputValues[step.target] = inputVal
    }
    return true
  },

  nextStep() {
    if (!this.currentStep) return

    // Mark current step as completed
    const stepKey = `${this.currentMission.id}_step_${this.currentStepIndex}`
    this.completedSteps[stepKey] = true
    this.completedCheckpoints[this.activeCheckpointId] = true

    this.isStepValidated = false
    this.stepValidationError = null

    if (this.currentStepIndex < this.totalStepsInCurrentMission - 1) {
      this.currentStepIndex++
      this.syncActiveCheckpoint()
      this.initStepValidation()
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
        this.syncActiveCheckpoint()
        this.initStepValidation()
        this.navigateToCurrentStepRoute()
      } else {
        // All missions finished!
        this.isActive = false
      }
    }
    this.saveState()
  },

  prevStep() {
    this.isStepValidated = false
    this.stepValidationError = null

    if (this.currentStepIndex > 0) {
      this.currentStepIndex--
      this.syncActiveCheckpoint()
      this.initStepValidation()
      this.navigateToCurrentStepRoute()
    } else if (this.currentMissionIndex > 0) {
      this.currentMissionIndex--
      this.currentStepIndex = this.currentMission.steps.length - 1
      this.syncActiveCheckpoint()
      this.initStepValidation()
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
      this.syncActiveCheckpoint()
      this.initStepValidation()
      this.navigateToCurrentStepRoute()
      this.saveState()
    }
  },

  jumpToStep(stepIdx) {
    if (stepIdx >= 0 && stepIdx < this.totalStepsInCurrentMission) {
      this.currentStepIndex = stepIdx
      this.syncActiveCheckpoint()
      this.initStepValidation()
      this.navigateToCurrentStepRoute()
      this.saveState()
    }
  },

  resetAllProgress() {
    this.completedMissions = []
    this.completedSteps = {}
    this.completedCheckpoints = {}
    this.currentMissionIndex = 0
    this.currentStepIndex = 0
    this.interactiveInputValues = {}
    this.isStepValidated = false
    this.stepValidationError = null
    this.syncActiveCheckpoint()
    this.saveState()
  },

  navigateToCurrentStepRoute() {
    const step = this.currentStep
    if (step && step.route && router && router.currentRoute && router.currentRoute.value.path !== step.route) {
      router.push(step.route).catch(() => {})
    }
  },

  saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        currentMissionIndex: this.currentMissionIndex,
        currentStepIndex: this.currentStepIndex,
        currentRoute: this.currentRoute,
        activeCheckpointId: this.activeCheckpointId,
        completedMissions: this.completedMissions,
        completedSteps: this.completedSteps,
        completedCheckpoints: this.completedCheckpoints,
        autoStartOnLogin: this.autoStartOnLogin,
        mode: this.mode
      }))
    } catch (e) {
      console.warn('Failed to save DAP state', e)
    }
  }
})
