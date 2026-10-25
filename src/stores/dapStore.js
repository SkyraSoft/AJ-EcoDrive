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
  branchManagerPageTours,
  BM_INVENTORY_SUBPAGE_ROUTES,
  TOUR_MODES
} from '@/tour/content/catalog.js'
import { superAdminMissions } from '@/tour/content/superAdmin/superAdminMissions.js'
import { branchManagerMissions } from '@/tour/content/branchManager/branchManagerMissions.js'
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

  // Continuous Multi-Page Inventory Chain State
  isInventoryChainActive: saved?.isInventoryChainActive || false,
  currentInventorySubpageIndex: saved?.currentInventorySubpageIndex || 0,

  // Page Tour dedicated context
  activePageMission: (saved?.isInventoryChainActive && branchManagerPageTours[BM_INVENTORY_SUBPAGE_ROUTES[saved?.currentInventorySubpageIndex]]) || null,
  activePageSteps: [],
  currentPageRoute: null,

  // Computed & Catalog Accessors
  get currentRole() {
    return store?.currentUser?.role || 'Super Admin'
  },

  get missions() {
    return getMissionsForRole(this.currentRole)
  },

  get currentMission() {
    if (this.activePageMission) return this.activePageMission
    const list = this.missions
    if (!list || list.length === 0) return null
    return list[this.currentMissionIndex] || list[0]
  },

  get currentStepsList() {
    const mission = this.currentMission
    if (!mission) return []
    return mission.steps || mission.segments || []
  },

  get currentStep() {
    const stepsList = this.currentStepsList
    if (!stepsList || stepsList.length === 0) return null
    return stepsList[this.currentStepIndex] || null
  },

  get currentOverallStepNumber() {
    if (this.isInventoryChainActive) {
      let count = 0
      for (let i = 0; i < this.currentInventorySubpageIndex; i++) {
        const r = BM_INVENTORY_SUBPAGE_ROUTES[i]
        const m = branchManagerPageTours[r]
        count += (m?.steps?.length || 0)
      }
      return count + this.currentStepIndex + 1
    }
    if (this.activePageMission) {
      return this.currentStepIndex + 1
    }
    let count = 0
    for (let i = 0; i < this.currentMissionIndex; i++) {
      const m = this.missions[i]
      const steps = m?.steps || m?.segments || []
      count += steps.length
    }
    return count + this.currentStepIndex + 1
  },

  get isFirstStep() {
    if (this.isInventoryChainActive) {
      return this.currentInventorySubpageIndex === 0 && this.currentStepIndex === 0
    }
    if (this.activePageMission) return this.currentStepIndex === 0
    return this.currentMissionIndex === 0 && this.currentStepIndex === 0
  },

  get isFinalStep() {
    if (this.isInventoryChainActive) {
      const isLastSubpage = this.currentInventorySubpageIndex >= BM_INVENTORY_SUBPAGE_ROUTES.length - 1
      const isLastStepOfSubpage = this.currentStepIndex >= this.totalStepsInCurrentMission - 1
      return isLastSubpage && isLastStepOfSubpage
    }
    if (this.activePageMission) {
      return this.currentStepIndex >= this.totalStepsInCurrentMission - 1
    }
    return (
      this.currentMissionIndex >= this.totalMissions - 1 &&
      this.currentStepIndex >= this.totalStepsInCurrentMission - 1
    )
  },

  get isSubpageBoundaryStep() {
    if (!this.isInventoryChainActive) return false
    const isNotLastSubpage = this.currentInventorySubpageIndex < BM_INVENTORY_SUBPAGE_ROUTES.length - 1
    const isLastStepOfSubpage = this.currentStepIndex >= this.totalStepsInCurrentMission - 1
    return isNotLastSubpage && isLastStepOfSubpage
  },

  get isSubpageInitialStep() {
    if (!this.isInventoryChainActive) return false
    return this.currentInventorySubpageIndex > 0 && this.currentStepIndex === 0
  },

  get nextSubpageRoute() {
    if (!this.isSubpageBoundaryStep) return null
    return BM_INVENTORY_SUBPAGE_ROUTES[this.currentInventorySubpageIndex + 1] || null
  },

  get nextSubpageTitle() {
    const route = this.nextSubpageRoute
    if (!route) return null
    return branchManagerPageTours[route]?.surface || branchManagerPageTours[route]?.title || 'Next Page'
  },

  get totalMissions() {
    if (this.isInventoryChainActive) return BM_INVENTORY_SUBPAGE_ROUTES.length
    if (this.activePageMission) return 1
    return this.missions.length
  },

  get totalStepsInCurrentMission() {
    return this.currentStepsList.length
  },

  get totalSystemSteps() {
    if (this.isInventoryChainActive) {
      return BM_INVENTORY_SUBPAGE_ROUTES.reduce((acc, r) => {
        const m = branchManagerPageTours[r]
        return acc + (m?.steps?.length || 0)
      }, 0)
    }
    if (this.activePageMission) {
      return this.totalStepsInCurrentMission
    }
    return this.totalStepsCount
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

  isStepInteractive(step) {
    if (!step) return false
    return Boolean(
      step.mode === 'PRACTICE' ||
      step.mode === 'CLICK' ||
      step.mode === 'OPEN_SURFACE' ||
      step.trainingType === 'practice' ||
      step.trainingType === 'input-practice' ||
      step.expectedAction === 'CLICK' ||
      step.expectedAction === 'TYPE' ||
      step.expectedAction === 'INPUT' ||
      step.expectedAction === 'SELECT' ||
      step.actionType === 'CLICK' ||
      step.actionType === 'OPEN_MODAL' ||
      step.actionType === 'OPEN_DRAWER' ||
      step.actionType === 'NAVIGATE' ||
      step.actionType === 'OPEN_SURFACE'
    )
  },

  get canAdvance() {
    const step = this.currentStep
    if (!step) return true
    if (!this.isStepInteractive(step)) {
      return true
    }
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
   * Find the starting mission and step index for a given route across all registered missions.
   */
  findMissionAndStepForRoute(route) {
    if (!route) return { missionIndex: 0, stepIndex: 0 }
    const cleanRoute = route.split('?')[0].split('#')[0].replace(/\/+$/, '') || '/'

    // 0. Dedicated Branch Manager auxiliary page tour check
    if (this.currentRole === 'Branch Manager' && branchManagerPageTours[cleanRoute]) {
      return { missionIndex: -1, stepIndex: 0, pageMission: branchManagerPageTours[cleanRoute] }
    }

    const list = this.missions
    // 1. Exact match on mission.route in active role missions
    for (let mIdx = 0; mIdx < list.length; mIdx++) {
      const m = list[mIdx]
      const mRoute = (m.route || '').split('?')[0].split('#')[0].replace(/\/+$/, '')
      if (mRoute === cleanRoute) {
        return { missionIndex: mIdx, stepIndex: 0 }
      }
    }

    // 2. Step route match
    for (let mIdx = 0; mIdx < list.length; mIdx++) {
      const m = list[mIdx]
      const steps = m.steps || m.segments || []
      for (let sIdx = 0; sIdx < steps.length; sIdx++) {
        const s = steps[sIdx]
        const sRoute = (s.route || '').split('?')[0].split('#')[0].replace(/\/+$/, '')
        if (sRoute === cleanRoute) {
          return { missionIndex: mIdx, stepIndex: sIdx }
        }
      }
    }

    // 3. Check route aliases
    const routeAliases = {
      '/sales/delivery': '/sales/handover',
      '/sales/handover': '/sales/delivery',
      '/inventory/serialized-units': '/inventory/units',
      '/inventory/units': '/inventory/serialized-units',
      '/inventory/stock-adjustments': '/inventory/adjustments',
      '/inventory/adjustments': '/inventory/stock-adjustments',
      '/after-sales/warranty': '/after-sales/cases',
      '/after-sales/cases': '/after-sales/warranty',
      '/analytics/reports-hub': '/analytics',
      '/analytics': '/analytics/reports-hub',
      '/catalogue/requests': '/inventory/product-requests',
      '/inventory/product-requests': '/catalogue/requests',
      '/procurement/purchase-orders': '/procurement/orders',
      '/procurement/orders': '/procurement/purchase-orders',
      '/procurement/receipts': '/procurement/receiving',
      '/procurement/receiving': '/procurement/receipts',
      '/procurement/vendor-bills': '/finance/supplier-bills',
      '/finance/supplier-bills': '/procurement/vendor-bills',
      '/sales/payments': '/finance/payments',
      '/finance/payments': '/sales/payments',
    }
    if (routeAliases[cleanRoute]) {
      const alias = routeAliases[cleanRoute]
      for (let mIdx = 0; mIdx < list.length; mIdx++) {
        const m = list[mIdx]
        const mRoute = (m.route || '').split('?')[0].split('#')[0].replace(/\/+$/, '')
        if (mRoute === alias) {
          return { missionIndex: mIdx, stepIndex: 0 }
        }
      }
    }

    // 4. Subpage prefix match
    if (cleanRoute !== '/' && cleanRoute !== '/dashboard') {
      for (let mIdx = 0; mIdx < list.length; mIdx++) {
        const m = list[mIdx]
        const mRoute = (m.route || '').split('?')[0].split('#')[0].replace(/\/+$/, '')
        if (mRoute && mRoute !== '/' && mRoute !== '/dashboard' && cleanRoute.startsWith(mRoute + '/')) {
          return { missionIndex: mIdx, stepIndex: 0 }
        }
      }
    }

    // 5. Cross-role check (e.g. Branch Manager visiting Catalogue Products or shared subpages)
    const allRoleMissions = [...superAdminMissions, ...branchManagerMissions]
    for (const m of allRoleMissions) {
      const steps = m.steps || m.segments || []
      for (let sIdx = 0; sIdx < steps.length; sIdx++) {
        const s = steps[sIdx]
        const sRoute = (s.route || '').split('?')[0].split('#')[0].replace(/\/+$/, '')
        if (sRoute === cleanRoute) {
          const idx = list.findIndex(item => item.id === m.id || item.code === m.code)
          if (idx !== -1) {
            return { missionIndex: idx, stepIndex: sIdx }
          }
        }
      }
    }
    for (const m of allRoleMissions) {
      const mRoute = (m.route || '').split('?')[0].split('#')[0].replace(/\/+$/, '')
      if (mRoute === cleanRoute) {
        const idx = list.findIndex(item => item.id === m.id || item.code === m.code)
        if (idx !== -1) {
          return { missionIndex: idx, stepIndex: 0 }
        }
      }
    }

    return { missionIndex: 0, stepIndex: 0 }
  },

  /**
   * Mode 2: Continuous Multi-Page Guided Tour
   * Starts from the user's current page and journeys continuously across the application.
   */
  startContinuousTour(route = null, options = {}) {
    const targetRoute = route || router?.currentRoute?.value?.path || '/dashboard'
    const cleanRoute = targetRoute.split('?')[0].split('#')[0].replace(/\/+$/, '') || '/'

    this.activeTourMode = TOUR_MODES.PAGE_TOUR
    this.isStepValidated = false
    this.stepValidationError = null

    // Check if this is a Branch Manager visiting an Inventory subpage
    if (this.currentRole === 'Branch Manager' && BM_INVENTORY_SUBPAGE_ROUTES.includes(cleanRoute)) {
      if (options.standalone) {
        // Run single page tour without cross-page chain
        this.isInventoryChainActive = false
        const pageTour = branchManagerPageTours[cleanRoute]
        this.activePageMission = pageTour
        this.currentMissionIndex = -1
        this.currentStepIndex = 0
        this.isActive = true

        this.syncActiveCheckpoint()
        this.initStepValidation()
        this.saveState()

        return {
          success: true,
          mission: pageTour,
          step: pageTour.steps?.[0]
        }
      }

      // Continuous Multi-Page Inventory Chain across all 10 subpages
      this.isInventoryChainActive = true
      const subpageIdx = BM_INVENTORY_SUBPAGE_ROUTES.indexOf(cleanRoute)
      this.currentInventorySubpageIndex = subpageIdx !== -1 ? subpageIdx : 0
      const activeRoute = BM_INVENTORY_SUBPAGE_ROUTES[this.currentInventorySubpageIndex]
      const pageTour = branchManagerPageTours[activeRoute]

      this.activePageMission = pageTour
      this.currentMissionIndex = -1
      this.currentStepIndex = 0
      this.isActive = true

      this.syncActiveCheckpoint()
      this.initStepValidation()
      this.saveState()

      return {
        success: true,
        mission: pageTour,
        step: pageTour.steps?.[0]
      }
    }

    // Other Branch Manager auxiliary page tours (e.g. Catalogue Products / Requests)
    if (this.currentRole === 'Branch Manager' && branchManagerPageTours[cleanRoute]) {
      this.isInventoryChainActive = false
      const pageTour = branchManagerPageTours[cleanRoute]
      this.activePageMission = pageTour
      this.currentMissionIndex = -1
      this.currentStepIndex = 0
      this.isActive = true

      this.syncActiveCheckpoint()
      this.initStepValidation()
      this.saveState()

      return {
        success: true,
        mission: pageTour,
        step: pageTour.steps?.[0]
      }
    }

    this.isInventoryChainActive = false
    this.activePageMission = null
    const loc = this.findMissionAndStepForRoute(cleanRoute)
    this.currentMissionIndex = loc.missionIndex
    this.currentStepIndex = loc.stepIndex
    this.isActive = true

    this.syncActiveCheckpoint()
    this.initStepValidation()
    this.saveState()

    return {
      success: true,
      mission: this.currentMission,
      step: this.currentStep
    }
  },

  startPageTour(route = null, options = {}) {
    return this.startContinuousTour(route, options)
  },

  startInventoryContinuousTour() {
    return this.startContinuousTour('/inventory/dashboard')
  },

  /**
   * Mode 3: Show Me Every Field (Field Guide)
   */
  startFieldGuide(route = null) {
    const targetRoute = route || router?.currentRoute?.value?.path || '/dashboard'
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
    this.activePageMission = null
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
    } else {
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
    this.isInventoryChainActive = false
    this.activePageMission = null
    this.activePageSteps = []
    this.saveState()
  },

  toggleDAP(route = null) {
    if (this.isActive) {
      this.stopDAP()
      return { success: true, stopped: true }
    } else {
      const currentPath = route || router?.currentRoute?.value?.path || '/dashboard'
      return this.startPageTour(currentPath)
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

    if (!this.isStepInteractive(step)) {
      this.isStepValidated = true
      this.stepValidationError = null
      return
    }

    // Interactive practice steps remain locked until the user explicitly takes action
    this.isStepValidated = false
    this.stepValidationError = null
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
      
      // Advance to next mission and next page across the continuous tour
      if (this.isInventoryChainActive) {
        if (this.currentInventorySubpageIndex < BM_INVENTORY_SUBPAGE_ROUTES.length - 1) {
          // Advance to next Inventory subpage in the continuous chain!
          this.currentInventorySubpageIndex++
          const nextRoute = BM_INVENTORY_SUBPAGE_ROUTES[this.currentInventorySubpageIndex]
          const nextTour = branchManagerPageTours[nextRoute]
          this.activePageMission = nextTour
          this.currentStepIndex = 0
          this.syncActiveCheckpoint()
          this.initStepValidation()
          this.navigateToCurrentStepRoute()
        } else {
          // All 10 Inventory subpages completed!
          this.isActive = false
          this.isInventoryChainActive = false
          this.activePageMission = null
        }
      } else if (this.activePageMission) {
        this.isActive = false
        this.activePageMission = null
      } else if (this.currentMissionIndex < this.totalMissions - 1) {
        this.currentMissionIndex++
        this.currentStepIndex = 0
        this.syncActiveCheckpoint()
        this.initStepValidation()
        this.navigateToCurrentStepRoute()
      } else {
        // All missions across the entire application finished!
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
    } else if (this.isInventoryChainActive && this.currentInventorySubpageIndex > 0) {
      // Go back to previous Inventory subpage in the continuous chain!
      this.currentInventorySubpageIndex--
      const prevRoute = BM_INVENTORY_SUBPAGE_ROUTES[this.currentInventorySubpageIndex]
      const prevTour = branchManagerPageTours[prevRoute]
      this.activePageMission = prevTour
      const prevSteps = prevTour?.steps || []
      this.currentStepIndex = Math.max(0, prevSteps.length - 1)
      this.syncActiveCheckpoint()
      this.initStepValidation()
      this.navigateToCurrentStepRoute()
    } else if (!this.activePageMission && this.currentMissionIndex > 0) {
      // Go back to previous mission and its previous page
      this.currentMissionIndex--
      const prevSteps = this.currentMission?.steps || this.currentMission?.segments || []
      this.currentStepIndex = Math.max(0, prevSteps.length - 1)
      this.syncActiveCheckpoint()
      this.initStepValidation()
      this.navigateToCurrentStepRoute()
    }
    this.saveState()
  },

  goToStep(stepIdx) {
    this.isStepValidated = false
    this.stepValidationError = null
    if (stepIdx >= 0 && stepIdx < this.totalStepsInCurrentMission) {
      this.currentStepIndex = stepIdx
      this.syncActiveCheckpoint()
      this.initStepValidation()
      this.navigateToCurrentStepRoute()
    }
    this.saveState()
  },

  jumpToMission(missionIdentifier) {
    const idx = this.missions.findIndex(m => m.id === missionIdentifier || m.code === missionIdentifier)
    if (idx !== -1) {
      this.activePageMission = null
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

  restartCurrentMission() {
    this.currentStepIndex = 0
    this.isStepValidated = false
    this.stepValidationError = null
    this.syncActiveCheckpoint()
    this.initStepValidation()
    this.navigateToCurrentStepRoute()
    this.saveState()
  },

  restartTour() {
    this.resetAllProgress()
    this.startDAP(null, 0)
  },

  resetAllProgress() {
    this.completedMissions = []
    this.completedSteps = {}
    this.completedCheckpoints = {}
    this.currentMissionIndex = 0
    this.currentStepIndex = 0
    this.isInventoryChainActive = false
    this.currentInventorySubpageIndex = 0
    this.activePageMission = null
    this.interactiveInputValues = {}
    this.isStepValidated = false
    this.stepValidationError = null
    this.syncActiveCheckpoint()
    this.saveState()
  },

  navigateToCurrentStepRoute() {
    const step = this.currentStep
    const targetRoute = step?.route || this.currentMission?.route
    if (targetRoute && router && router.currentRoute) {
      const curPath = router.currentRoute.value?.path
      const cleanTarget = targetRoute.split('?')[0].split('#')[0].replace(/\/+$/, '')
      const cleanCur = curPath ? curPath.split('?')[0].split('#')[0].replace(/\/+$/, '') : ''
      if (cleanTarget && cleanCur !== cleanTarget) {
        router.push(targetRoute).catch(() => {})
      }
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
        mode: this.mode,
        isInventoryChainActive: this.isInventoryChainActive,
        currentInventorySubpageIndex: this.currentInventorySubpageIndex
      }))
    } catch (e) {
      console.warn('Failed to save tour state', e)
    }
  }
})
