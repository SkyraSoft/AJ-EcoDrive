/**
 * AJ EcoDrive — Modern Reactive Tour State Machine
 * PROGRAM: AJ-TOUR-RECONSTRUCT-2026
 * PHASE 6: CHECKPOINT 6.1 — STATE MACHINE RUNTIME
 *
 * Implements:
 * - Role-aware catalog & workspace management (Super Admin vs Branch Manager)
 * - Safe step transitions and completion rules
 * - Separation of Observe and Practice modes
 * - Mutation Risk protection
 * - Geometry coordination
 */

import { reactive, computed, nextTick } from 'vue';
import router from '@/router';
import { resolveTarget, waitForTarget } from '../targetResolver.js';
import { getViewportRect, getSafeInsets } from '../geometry/viewport.js';
import { getOccupiedRegions } from '../geometry/occupiedRegions.js';
import { calculatePlacement } from '../positioning/placementEngine.js';
import { MUTATION_RISK_CLASSES } from './interactionManager.js';
import { saveTourSession, loadTourSession, clearTourSession } from './persistence.js';
import { announce, focusPracticeTarget, trapFocus, releaseFocusTrap } from './focusManager.js';

const initialSession = loadTourSession();

export const tourStore = reactive({
  isActive: false,
  workspace: initialSession?.workspace || 'Branch Manager',
  activeMission: null,
  currentStepIndex: initialSession?.currentStepIndex || 0,
  targetState: 'UNRESOLVED',
  presentationMode: 'FLOATING',
  placement: null,
  targetRect: null,
  cardRect: { width: 400, height: 280 },
  targetElement: null,
  cardElement: null,
  isStepValidated: false,
  validationError: null,
  interactiveValue: null,
  completedMissions: [],
  completedSteps: {},
  missionsList: [],

  // Computed Properties
  get currentStep() {
    if (!this.activeMission || !this.activeMission.steps) return null;
    return this.activeMission.steps[this.currentStepIndex] || null;
  },

  get totalSteps() {
    return this.activeMission?.steps?.length || 0;
  },

  get canAdvance() {
    const step = this.currentStep;
    if (!step) return false;
    // Observe steps can advance freely
    if (step.mode === 'OBSERVE' || step.trainingType === 'observe') return true;
    // Practice steps require validation
    return this.isStepValidated;
  },

  get masteryPercentage() {
    if (this.completedMissions.length === 0) return 0;
    const total = this.missionsList.length || 10;
    return Math.min(100, Math.round((this.completedMissions.length / total) * 100));
  },

  // State Machine Actions
  setWorkspace(ws) {
    if (['Super Admin', 'Branch Manager'].includes(ws)) {
      this.workspace = ws;
    }
  },

  setMissions(missions) {
    this.missionsList = missions;
  },

  startTour(mission, startIndex = 0) {
    this.activeMission = mission;
    this.currentStepIndex = startIndex;
    this.isActive = true;
    this.isStepValidated = false;
    this.validationError = null;

    saveTourSession({
      missionId: mission?.id || mission?.code || 'mission-1',
      missionVersion: mission?.version || '1.0.0',
      workspace: this.workspace,
      currentStepId: this.currentStep?.id || null,
      currentStepIndex: this.currentStepIndex,
      completedStepIds: Object.keys(this.completedSteps),
    });

    this.syncCurrentStep();
  },

  handleTargetDisappearance(context = 'UNEXPECTED') {
    const step = this.currentStep;
    if (step?.expectDisappearance || step?.expectedAction === 'close' || context === 'EXPECTED_CLOSE') {
      this.targetState = 'STEP_SUCCESS';
      this.isStepValidated = true;
      return 'STEP_SUCCESS';
    } else {
      this.targetState = 'TARGET_REMOVED_UNEXPECTEDLY';
      this.presentationMode = 'TARGET_UNAVAILABLE';
      this.targetRect = null;
      this.targetElement = null;
      return 'TARGET_REMOVED_UNEXPECTEDLY';
    }
  },

  stopTour() {
    releaseFocusTrap();
    this.isActive = false;
    this.activeMission = null;
    this.targetRect = null;
    this.targetElement = null;
    clearTourSession();
  },

  toggleTour() {
    if (this.isActive) {
      this.stopTour();
    } else {
      const defaultMission = this.missionsList[0] || null;
      if (defaultMission) {
        this.startTour(defaultMission);
      }
    }
  },

  async syncCurrentStep() {
    const step = this.currentStep;
    if (!step || !this.isActive) return;

    // Reset step validation state
    this.isStepValidated = step.mode === 'OBSERVE' || step.trainingType === 'observe';
    this.validationError = null;
    this.interactiveValue = null;

    // Route navigation if step specifies a target route
    if (step.route && router && router.currentRoute.value.path !== step.route && step.route !== '*') {
      try {
        await router.push(step.route);
        await nextTick();
      } catch (e) {
        // ignore navigation duplicate
      }
    }

    // Resolve target element and geometry
    const targetId = step.targetId || step.target;
    const resolved = await waitForTarget(targetId, 2500);

    this.targetState = resolved.state;
    this.targetElement = resolved.element;
    this.targetRect = resolved.rect;

    this.updatePlacement();

    // Accessibility announcement
    announce(`Step ${this.currentStepIndex + 1} of ${this.totalSteps}: ${step.title || step.task}`);

    // Focus handling
    if (step.mode === 'PRACTICE' || step.trainingType === 'practice' || step.trainingType === 'input-practice') {
      if (this.targetElement) {
        focusPracticeTarget(this.targetElement);
      }
    }
  },

  updatePlacement() {
    if (!this.isActive) return;

    const viewport = getViewportRect();
    const safeInsets = getSafeInsets();
    const occupied = getOccupiedRegions({ targetElement: this.targetElement });

    // Measure live card element if mounted
    if (this.cardElement) {
      const cr = this.cardElement.getBoundingClientRect();
      if (cr.width > 0 && cr.height > 0) {
        this.cardRect = {
          width: cr.width,
          height: cr.height,
        };
      }
    }

    const preferred = this.currentStep?.preferredPlacement || this.currentStep?.placement || 'right';
    const result = calculatePlacement(
      viewport,
      this.targetRect,
      this.cardRect,
      occupied,
      safeInsets,
      preferred
    );

    this.presentationMode = result.mode;
    this.placement = result;
  },

  nextStep() {
    if (this.currentStepIndex < this.totalSteps - 1) {
      // Mark current step completed
      if (this.currentStep?.id) {
        this.completedSteps[this.currentStep.id] = true;
      }
      this.currentStepIndex++;
      this.syncCurrentStep();
    } else {
      // Mission completed
      if (this.activeMission?.id && !this.completedMissions.includes(this.activeMission.id)) {
        this.completedMissions.push(this.activeMission.id);
      }
      this.stopTour();
    }
  },

  prevStep() {
    // Back must never undo a completed irreversible business transaction
    if (this.currentStepIndex > 0) {
      this.currentStepIndex--;
      this.syncCurrentStep();
    }
  },

  skipStep() {
    // Check if step allows skip
    if (this.currentStep?.skippable !== false) {
      this.nextStep();
    }
  },

  retryStep() {
    this.isStepValidated = false;
    this.validationError = null;
    this.syncCurrentStep();
  },

  handleValidationSuccess(val) {
    this.interactiveValue = val;
    this.isStepValidated = true;
    this.validationError = null;
  },

  handleValidationError(errMsg) {
    this.isStepValidated = false;
    this.validationError = errMsg;
  },
});
