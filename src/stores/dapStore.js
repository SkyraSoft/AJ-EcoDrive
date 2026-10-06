import { store } from '@/store.js'
import { reactive } from 'vue'
import router from '@/router'
import {
  getMissionsForRole,
  getMissionById,
  getPageTour,
  getQuickOrientation,
  getFieldGuides,
  getGuidedTasks,
  getContextHelp,
  getAllContextHelp,
  getAllScenarios,
  TOUR_MODES
} from '@/tour/content/catalog.js'
import { getCatalogForRole as getLegacyCatalogForRole } from '@/tour/adapters/legacyDapAdapter.js'

const STORAGE_KEY = 'aj_ecodrive_dap_state_v3'

function loadSavedState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return JSON.parse(saved)
  } catch (e) {
    console.warn('Failed to load tour state from localStorage', e)
  }
  return null
}

const saved = loadSavedState()

export const dapStore = reactive({
  isActive: false,
  activeTourMode: saved?.activeTourMode || TOUR_MODES.PAGE_TOUR,
  mode: saved?.mode || 'practice', // 'observe' | 'inspect' | 'practice' | 'execute' | 'decision'
  currentMissionIndex: saved?.currentMissionIndex || 0,
  currentStepIndex: saved?.currentStepIndex || 0,
  currentRoute: saved?.currentRoute || '/dashboard',
  activeCheckpointId: saved?.activeCheckpointId || 'SA-01-01',
  completedMissions: saved?.completedMissions || [],
  completedSteps: saved?.completedSteps || {},
  completedCheckpoints: saved?.completedCheckpoints || {},
  interactiveInputValues: {},
  stepValidationError: null,
  isStepValidated: false,
  hudExpanded: false,
  soundEffects: true,
  autoStartOnLogin: false,

  // Contextual help & field guides state
  activeContextHelpTopic: null,
  activeFieldGuides: [],

  // Computed & Catalog Accessors
  get currentRole() {
    return store?.currentUser?.role || 'Super Admin'
  },

  get missions() {
    return getMissionsForRole(this.currentRole)
  },

  get currentMission() {
    const list = this.missions
    if (!list || list.length === 0) return null
    return list[this.currentMissionIndex] || list[0]
  },

  get currentStep() {
    const mission = this.currentMission
    if (!mission) return null
    // Support standard mission steps or scenario segments
    const stepsList = mission.steps || mission.segments
    if (!stepsList || stepsList.length === 0) return null
    return stepsList[this.currentStepIndex] || null
  },

  get totalMissions() {
    return this.missions.length
  },

  get totalStepsInCurrentMission() {
    const mission = this.currentMission
    if (!mission) return 0
    const stepsList = mission.steps || mission.segments
    return stepsList?.length || 0
  },

  get totalSystemCheckpoints() {
    return this.totalStepsCount
  },

  get totalCompletedCheckpointsCount() {
    return Object.keys(this.completedCheckpoints).length
  },

  get totalStepsCount() {
    return this.missions.reduce((acc, m) => {
      const steps = m.steps || m.segments || []
      return acc + steps.length
    }, 0)
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

  get canAdvance() {
    return this.isStepValidated === true
  },

  demoAssistedSteps: saved?.demoAssistedSteps || {},

  recordDemoAssistance(target) {
    if (!this.demoAssistedSteps) this.demoAssistedSteps = {}
    this.demoAssistedSteps[target] = true
  },

  isDemoAssisted(target) {
    return Boolean(this.demoAssistedSteps?.[target])
  },

  // -------------------------------------------------------------
  // FIVE USER-FACING TOUR MODES
  // -------------------------------------------------------------

  /**
   * Mode 1: Quick Orientation
   */
  startQuickOrientation(route = null) {
    const targetRoute = route || router.currentRoute?.value?.path || '/dashboard'
    const mission = getQuickOrientation(targetRoute, this.currentRole)
    this.activeTourMode = TOUR_MODES.QUICK_ORIENTATION
    if (mission) {
      this.startDAP(mission.id, 0)
    } else {
      // Fallback to first available role mission
      this.startDAP(null, 0)
    }
  },

  /**
   * Mode 2: Learn This Page (Page Tour)
   */
  startPageTour(route = null) {
    const targetRoute = route || router.currentRoute?.value?.path || '/dashboard'
    const mission = getPageTour(targetRoute, this.currentRole)
    this.activeTourMode = TOUR_MODES.PAGE_TOUR
    if (mission) {
      this.startDAP(mission.id, 0)
    } else {
      this.startDAP(null, 0)
    }
  },

  /**
   * Mode 3: Show Me Every Field (Field Guide)
   */
  startFieldGuide(route = null) {
    const targetRoute = route || router.currentRoute?.value?.path || '/dashboard'
    this.activeTourMode = TOUR_MODES.FIELD_GUIDE
    this.activeFieldGuides = getFieldGuides(targetRoute, this.currentRole)
    this.isActive = true
    this.saveState()
  },

  /**
   * Mode 4: Guide Me Through This Task (Guided Task)
   */
  startGuidedTask(taskIdOrRoute = null) {
    this.activeTourMode = TOUR_MODES.GUIDED_TASK
    if (taskIdOrRoute && taskIdOrRoute.startsWith('/')) {
      const tasks = getGuidedTasks(taskIdOrRoute, this.currentRole)
      if (tasks && tasks.length > 0) {
        this.startDAP(tasks[0].id, 0)
        return
      }
    } else if (taskIdOrRoute) {
      this.startDAP(taskIdOrRoute, 0)
      return
    }
    // Default to first scenario or task
    const scenarios = getAllScenarios()
    if (scenarios && scenarios.length > 0) {
      this.startDAP(scenarios[0].id, 0)
    }
  },

  /**
   * Mode 5: What Does This Mean? (Context Help)
   */
  showContextHelp(topicOrTargetId) {
    this.activeTourMode = TOUR_MODES.CONTEXT_HELP
    const help = getContextHelp(topicOrTargetId)
    this.activeContextHelpTopic = help
    this.isActive = true
    return help
  },

  closeContextHelp() {
    this.activeContextHelpTopic = null
    if (this.activeTourMode === TOUR_MODES.CONTEXT_HELP) {
      this.isActive = false
    }
  },

  // -------------------------------------------------------------
  // PRIMARY TOUR CONTROL ACTIONS
  // -------------------------------------------------------------

  startDAP(missionId = null, stepIdx = 0) {
    this.isActive = true
    this.isStepValidated = false
    this.stepValidationError = null
    
    if (missionId) {
      const idx = this.missions.findIndex(m => m.id === missionId || m.code === missionId)
      if (idx !== -1) {
        this.currentMissionIndex = idx
      } else {
        const legacyMatch = String(missionId).match(/^M(\d+)$/i)
        if (legacyMatch) {
          const legacyIdx = parseInt(legacyMatch[1], 10) - 1
          if (legacyIdx >= 0 && legacyIdx < this.missions.length) {
            this.currentMissionIndex = legacyIdx
          } else {
            this.currentMissionIndex = 0
          }
        } else {
          this.currentMissionIndex = 0
        }
      }
    } else if (this.currentMissionIndex >= this.missions.length) {
      this.currentMissionIndex = 0
    }

    this.currentStepIndex = stepIdx
    this.syncActiveCheckpoint()
    this.initStepValidation()
    this.navigateToCurrentStepRoute()
    this.saveState()
  },

  resumeTraining() {
    this.isActive = true
    if (this.currentMissionIndex >= this.missions.length) {
      this.currentMissionIndex = 0
    }
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

  currentRealFieldValue: '',

  syncActiveCheckpoint() {
    const step = this.currentStep
    if (step) {
      this.activeCheckpointId = step.id || `${this.currentMission?.code || 'TOUR'}_step_${this.currentStepIndex}`
      this.currentRoute = step.route || router.currentRoute?.value?.path || '/dashboard'
    }
  },

  initStepValidation() {
    const step = this.currentStep
    this.currentRealFieldValue = ''
    if (!step) {
      this.isStepValidated = true
      this.stepValidationError = null
      return
    }

    const tType = step.trainingType || (step.mode === 'PRACTICE' ? 'practice' : 'observe')
    if (tType === 'observe') {
      this.isStepValidated = true
      this.stepValidationError = null
    } else {
      this.isStepValidated = false
      this.stepValidationError = null
    }
  },

  handleRealFieldInput(arg1, arg2) {
    const val = arg2 !== undefined ? arg2 : arg1
    this.currentRealFieldValue = val
    return this.validateCurrentStep(val)
  },

  handleRealFieldAction() {
    this.isStepValidated = true
    this.stepValidationError = null
    return true
  },

  validateCurrentStep(inputVal) {
    const step = this.currentStep
    if (!step) return true

    const isPractice = (step.trainingType === 'practice' || step.trainingType === 'input-practice' || step.mode === 'PRACTICE')
    if (!isPractice && (step.trainingType === 'observe' || step.mode === 'OBSERVE')) {
      this.isStepValidated = true
      this.stepValidationError = null
      return true
    }

    // Practice / input validation
    this.currentRealFieldValue = inputVal
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

    const cleanNum = Number(String(inputVal).replace(/[^0-9.-]/g, ''))
    if (valRule.min && !isNaN(cleanNum) && cleanNum < valRule.min) {
      this.stepValidationError = `Value must be at least ${valRule.min}.`
      this.isStepValidated = false
      return false
    }

    if (valRule.max && !isNaN(cleanNum) && cleanNum > valRule.max) {
      this.stepValidationError = `Value cannot exceed ${valRule.max}.`
      this.isStepValidated = false
      return false
    }

    this.isStepValidated = true
    this.stepValidationError = null
    if (step.targetId || step.target) {
      this.interactiveInputValues[step.targetId || step.target] = inputVal
    }
    return true
  },

  nextStep() {
    if (!this.currentStep) return

    // Mark current step as completed
    const stepKey = `${this.currentMission?.id}_step_${this.currentStepIndex}`
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
      if (this.currentMission?.id && !this.completedMissions.includes(this.currentMission.id)) {
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
      const prevSteps = this.currentMission?.steps || this.currentMission?.segments || []
      this.currentStepIndex = Math.max(0, prevSteps.length - 1)
      this.syncActiveCheckpoint()
      this.initStepValidation()
      this.navigateToCurrentStepRoute()
    }
    this.saveState()
  },

  jumpToMission(missionIdentifier) {
    const idx = this.missions.findIndex(m => m.id === missionIdentifier || m.code === missionIdentifier)
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
    if (step && step.route && router && router.currentRoute && router.currentRoute.value?.path !== step.route) {
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
        activeTourMode: this.activeTourMode,
        mode: this.mode
      }))
    } catch (e) {
      console.warn('Failed to save tour state', e)
    }
  }
})
