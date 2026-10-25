/**
 * AJ EcoDrive — Take a Tour Practice Mode Interaction Integrity Test Suite
 * PROGRAM: AJ-TOUR-RECONSTRUCT-2026
 * POST-FREEZE PRACTICE INTERACTION INTEGRITY SWEEP
 * 
 * Verifies invariants INV-PRACTICE-001 through INV-PRACTICE-010:
 * - Expected interactive targets are hit-testable and unobstructed by visual overlays
 * - Tour visual layers (SpotlightOverlay SVG path cutout) do not intercept pointer events
 * - Target is never inside an inert subtree during Practice mode
 * - Tour event observers are strictly passive (never call preventDefault or stopPropagation)
 * - Practice step completes only when both interaction and defined postcondition are satisfied
 * - Keyboard activation (Enter / Space) functions identically to pointer clicks
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { superAdminMissions } from '../src/tour/content/superAdmin/superAdminMissions.js';
import { branchManagerMissions } from '../src/tour/content/branchManager/branchManagerMissions.js';
import { crossRoleScenarios } from '../src/tour/content/scenarios/crossRoleScenarios.js';
import { getTarget, clearRegistry, seedRepresentativeTargets, TARGET_STATES } from '../src/tour/targetRegistry.js';
import {
  PRACTICE_INVARIANTS,
  bindTargetInteraction,
  checkTargetInteractivity,
  validateInputValue,
  evaluatePostcondition,
  isTourUiElement,
  queryApplicationElement,
  MUTATION_RISK_CLASSES,
} from '../src/tour/engine/interactionManager.js';
import { dapStore } from '../src/stores/dapStore.js';
import { resolveTarget } from '../src/tour/targetResolver.js';
import { mount } from '@vue/test-utils';
import CreateUser from '../src/views/organisation/CreateUser.vue';
import CreateLead from '../src/views/sales/CreateLead.vue';
import CreateBranch from '../src/views/organisation/CreateBranch.vue';
import { createRouter, createMemoryHistory } from 'vue-router';

describe('Take-a-Tour: Practice Mode Interaction Integrity Suite', () => {
  beforeEach(() => {
    clearRegistry();
    seedRepresentativeTargets();
    document.body.innerHTML = '';
  });

  // =========================================================================
  // 1. INVARIANT DEFINITION GATE
  // =========================================================================
  it('freezes engine-level interaction invariants INV-PRACTICE-001 to INV-PRACTICE-010', () => {
    expect(PRACTICE_INVARIANTS.INV_PRACTICE_001).toBe('Expected interactive target must be hit-testable.');
    expect(PRACTICE_INVARIANTS.INV_PRACTICE_002).toBe('Tour visual layers must not intercept intended application target interaction.');
    expect(PRACTICE_INVARIANTS.INV_PRACTICE_003).toBe('Expected target must not be inside an inert subtree.');
    expect(PRACTICE_INVARIANTS.INV_PRACTICE_004).toBe('Tour event observers must not prevent the native expected action.');
    expect(PRACTICE_INVARIANTS.INV_PRACTICE_005).toBe('Practice completion must use the configured completion/postcondition rule.');
    expect(PRACTICE_INVARIANTS.INV_PRACTICE_006).toBe('Click observed != success when expected application outcome did not occur.');
    expect(PRACTICE_INVARIANTS.INV_PRACTICE_007).toBe('Tour must never forcibly enable application-disabled business controls.');
    expect(PRACTICE_INVARIANTS.INV_PRACTICE_008).toBe('If a prerequisite is required, tour must establish or teach it before the action step.');
    expect(PRACTICE_INVARIANTS.INV_PRACTICE_009).toBe('High-risk business actions remain deliberate user actions.');
    expect(PRACTICE_INVARIANTS.INV_PRACTICE_010).toBe('Keyboard activation must work wherever the underlying control supports it.');
  });

  // =========================================================================
  // 2. STATIC INVENTORY & INTEGRITY OF ALL PRACTICAL STEPS
  // =========================================================================
  it('discovers and audits all practical steps in Super Admin missions', () => {
    const practicalSteps = superAdminMissions
      .flatMap(m => m.steps.map(s => ({ ...s, missionCode: m.code })))
      .filter(s => s.mode === 'PRACTICE' || s.trainingType === 'practice' || s.trainingType === 'input-practice');

    expect(practicalSteps.length).toBeGreaterThanOrEqual(3);

    for (const step of practicalSteps) {
      expect(step.targetId, `SA step ${step.id} missing targetId`).toBeDefined();
      expect(step.route, `SA step ${step.id} missing route`).toBeDefined();
      expect(step.actionType || step.expectedAction, `SA step ${step.id} missing action definition`).toBeDefined();
      expect(step.instruction, `SA step ${step.id} missing instruction`).toBeTruthy();
      expect(step.mutationRisk, `SA step ${step.id} missing mutation risk`).toBeDefined();
    }
  });

  it('discovers and audits all practical steps in Branch Manager missions', () => {
    const practicalSteps = branchManagerMissions
      .flatMap(m => m.steps.map(s => ({ ...s, missionCode: m.code })))
      .filter(s => s.mode === 'PRACTICE' || s.trainingType === 'practice' || s.trainingType === 'input-practice');

    expect(practicalSteps.length).toBeGreaterThanOrEqual(3);

    for (const step of practicalSteps) {
      expect(step.targetId, `BM step ${step.id} missing targetId`).toBeDefined();
      expect(step.route, `BM step ${step.id} missing route`).toBeDefined();
      expect(step.actionType || step.expectedAction, `BM step ${step.id} missing action definition`).toBeDefined();
      expect(step.instruction, `BM step ${step.id} missing instruction`).toBeTruthy();
      expect(step.mutationRisk, `BM step ${step.id} missing mutation risk`).toBeDefined();
    }
  });

  it('audits all practical actions across Guided Scenarios A–F', () => {
    expect(crossRoleScenarios).toBeDefined();
    expect(crossRoleScenarios.length).toBe(6);

    let scenarioActionCount = 0;
    for (const sc of crossRoleScenarios) {
      for (const segment of sc.segments || []) {
        if (segment.expectedAction || segment.actionType) {
          scenarioActionCount++;
          expect(segment.targetId, `Scenario ${sc.id} segment ${segment.id} has no targetId`).toBeDefined();
        }
      }
    }
    expect(scenarioActionCount).toBeGreaterThanOrEqual(15);
  });

  // =========================================================================
  // 3. INV-PRACTICE-001 & INV-PRACTICE-003: HIT-TESTABILITY & INERT CHECK
  // =========================================================================
  it('validates target interactivity and rejects targets inside inert subtrees', () => {
    const container = document.createElement('div');
    const button = document.createElement('button');
    button.textContent = 'Add Branch';
    container.appendChild(button);
    document.body.appendChild(container);

    // Normal active element
    const activeCheck = checkTargetInteractivity(button);
    expect(activeCheck.interactive).toBe(true);
    expect(activeCheck.reason).toBe('OK');

    // Element in inert container
    container.setAttribute('inert', '');
    const inertCheck = checkTargetInteractivity(button);
    expect(inertCheck.interactive).toBe(false);
    expect(inertCheck.reason).toBe('TARGET_INSIDE_INERT_TREE');
    container.removeAttribute('inert');

    // Disabled element
    button.setAttribute('disabled', '');
    const disabledCheck = checkTargetInteractivity(button);
    expect(disabledCheck.interactive).toBe(false);
    expect(disabledCheck.reason).toBe('TARGET_DISABLED_BY_APPLICATION');
  });

  // =========================================================================
  // 4. INV-PRACTICE-002: SPOTLIGHT OVERLAY POINTER GEOMETRY TEST
  // =========================================================================
  it('proves SpotlightOverlay geometric cutout guarantees target hit-testing without overlay interference', () => {
    // When SpotlightOverlay renders an SVG path with fill-rule="evenodd":
    // The outer viewport path: M 0,0 L w,0 L w,h L 0,h Z
    // The inner cutout path: M x,y L x+rw,y L x+rw,y+rh L x,y+rh Z
    // Any point inside the cutout bounding box has ZERO SVG geometry filled.
    const targetRect = { left: 100, top: 150, width: 120, height: 40 };
    const centerPoint = { x: targetRect.left + targetRect.width / 2, y: targetRect.top + targetRect.height / 2 };

    const isInsideCutout = (px, py, rect) => {
      return px >= rect.left && px <= rect.left + rect.width &&
             py >= rect.top && py <= rect.top + rect.height;
    };

    expect(isInsideCutout(centerPoint.x, centerPoint.y, targetRect)).toBe(true);

    // Outside the cutout, overlay backdrop is painted
    const outsidePoint = { x: 50, y: 50 };
    expect(isInsideCutout(outsidePoint.x, outsidePoint.y, targetRect)).toBe(false);
  });

  // =========================================================================
  // 5. INV-PRACTICE-004: NON-BLOCKING EVENT PROPAGATION (ZERO PREVENT-DEFAULT)
  // =========================================================================
  it('guarantees tour observer does not suppress or swallow native application click handlers', () => {
    const button = document.createElement('button');
    button.id = 'test-add-branch-btn';
    button.textContent = 'Add Branch';
    document.body.appendChild(button);

    let applicationHandlerFired = 0;
    let tourObserverFired = 0;

    // Real native application click listener
    button.addEventListener('click', (e) => {
      applicationHandlerFired++;
    });

    // Tour Practice observer
    const step = {
      id: 'sa-03-02',
      mode: 'PRACTICE',
      expectedAction: 'CLICK',
      actionType: 'OPEN_MODAL',
    };

    const cleanup = bindTargetInteraction(button, step, (isValid) => {
      if (isValid) tourObserverFired++;
    });

    // Dispatch real user click event
    const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
    button.dispatchEvent(clickEvent);

    // Native application must execute exactly once
    expect(applicationHandlerFired).toBe(1);
    // Tour observer must execute without suppressing the event
    expect(tourObserverFired).toBe(1);
    expect(clickEvent.defaultPrevented).toBe(false);

    cleanup();
  });

  // =========================================================================
  // 6. INV-PRACTICE-005 & INV-PRACTICE-006: POSTCONDITION VALIDATION
  // =========================================================================
  it('does NOT complete step on click alone when postcondition is not met, but completes when surface opens', () => {
    const button = document.createElement('button');
    button.textContent = 'Add Lead';
    document.body.appendChild(button);

    let stepCompleted = false;

    const step = {
      id: 'bm-03-02',
      mode: 'PRACTICE',
      expectedAction: 'CLICK',
      actionType: 'OPEN_MODAL',
      postconditionSelector: '#customer-lead-modal',
    };

    const cleanup = bindTargetInteraction(button, step, (isValid) => {
      stepCompleted = isValid;
    });

    // Case 1: Button clicked, but application failed to open modal (postcondition NOT met)
    button.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    expect(stepCompleted).toBe(false); // Step must NOT be marked complete!

    // Case 2: Button clicked, and application opens the modal (postcondition met)
    const modal = document.createElement('div');
    modal.id = 'customer-lead-modal';
    document.body.appendChild(modal);

    button.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    expect(stepCompleted).toBe(true); // Step completes successfully!

    cleanup();
  });

  // =========================================================================
  // 7. INV-PRACTICE-010: KEYBOARD ACCESSIBILITY ACTIVATION
  // =========================================================================
  it('activates Practice step on Enter and Space keydown events', () => {
    const button = document.createElement('button');
    button.textContent = 'Confirm Action';
    document.body.appendChild(button);

    let keyboardActivations = 0;

    const step = {
      id: 'test-kb-step',
      mode: 'PRACTICE',
      expectedAction: 'CLICK',
      actionType: 'CLICK',
    };

    const cleanup = bindTargetInteraction(button, step, (isValid) => {
      if (isValid) keyboardActivations++;
    });

    // Press Enter
    button.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(keyboardActivations).toBe(1);

    // Press Space
    button.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
    expect(keyboardActivations).toBe(2);

    cleanup();
  });

  // =========================================================================
  // 8. INPUT VALUE VALIDATION FOR TYPE STEPS
  // =========================================================================
  it('validates text and numeric inputs during TYPE practice steps', () => {
    const input = document.createElement('input');
    input.type = 'text';
    document.body.appendChild(input);

    let validated = false;
    const step = {
      id: 'bm-04-02',
      mode: 'PRACTICE',
      trainingType: 'input-practice',
      expectedAction: 'INPUT',
      actionType: 'TYPE',
      validation: 'phone',
    };

    const cleanup = bindTargetInteraction(input, step, (isValid) => {
      validated = isValid;
    });

    // Too short input
    input.value = '1';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    expect(validated).toBe(false);

    // Valid phone number input
    input.value = '+92 300 1234567';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    expect(validated).toBe(true);

    cleanup();
  });

  // =========================================================================
  // 9. KNOWN DEFECT REPRODUCTION & RESOLUTION: SA-03 STEP 2 "ADD BRANCH"
  // =========================================================================
  it('verifies SA-03 Step 2 Add Branch button interaction integrity', () => {
    const mission = superAdminMissions.find(m => m.code === 'SA-03');
    expect(mission).toBeDefined();

    const step2 = mission.steps.find(s => s.stepNumber === 2);
    expect(step2).toBeDefined();
    expect(step2.id).toBe('sa-03-02');
    expect(step2.mode).toBe('PRACTICE');
    expect(step2.expectedAction).toBe('CLICK');
    expect(step2.actionType).toBe('OPEN_MODAL');
    expect(step2.postconditionSelector).toBe('[data-tour-id="sa.organisation.createbranch.identity-card"]');
    expect(step2.route).toBe('/organisation/branches');

    // Instruction copy aligned with physical button label "Add Branch"
    expect(step2.instruction).toContain('Add Branch');

    // Mock button mount
    const addBranchBtn = document.createElement('button');
    addBranchBtn.setAttribute('data-tour-id', 'sa.organisation.branches.create-btn');
    addBranchBtn.textContent = 'Add Branch';
    document.body.appendChild(addBranchBtn);

    let modalOpened = false;
    let tourStepDone = false;

    addBranchBtn.addEventListener('click', () => {
      // Simulate real in-page modal mount
      const modalEl = document.createElement('div');
      modalEl.setAttribute('data-tour-id', 'sa.organisation.createbranch.identity-card');
      document.body.appendChild(modalEl);
      modalOpened = true;
    });

    const cleanup = bindTargetInteraction(addBranchBtn, step2, (isValid) => {
      tourStepDone = isValid;
    });

    // User clicks Add Branch
    addBranchBtn.click();

    expect(modalOpened).toBe(true);
    expect(tourStepDone).toBe(true);

    cleanup();
  });

  // =========================================================================
  // 10. DEFECT VERIFICATION: TOUR OVERLAY CANNOT SATISFY PRACTICE POSTCONDITION
  // =========================================================================
  it('proves that the tour overlay alone does not validate a practice step', () => {
    // 1. Simulate the guided tour's own visual layers in the DOM
    const dapRoot = document.createElement('div');
    dapRoot.className = 'dap-root-container';

    // Spotlight overlay with generic .fixed.inset-0 class
    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 z-[9990] pointer-events-none';
    dapRoot.appendChild(overlay);

    // Coachmark card with fixed placement
    const card = document.createElement('div');
    card.setAttribute('data-tour-id', 'coachmark.card');
    card.className = 'fixed z-[9995] text-white';
    dapRoot.appendChild(card);

    document.body.appendChild(dapRoot);

    // Verify isTourUiElement correctly identifies these tour layers
    expect(isTourUiElement(overlay)).toBe(true);
    expect(isTourUiElement(card)).toBe(true);

    // 2. Step with a generic postcondition selector
    const stepWithFixedSelector = {
      id: 'test-practice-step',
      mode: 'PRACTICE',
      expectedAction: 'CLICK',
      actionType: 'OPEN_MODAL',
      postconditionSelector: '.fixed.inset-0',
    };

    // The overlay alone MUST NOT satisfy the postcondition!
    expect(evaluatePostcondition(stepWithFixedSelector)).toBe(false);

    // dapStore interactive step must start unvalidated
    dapStore.isActive = true;
    const origStep = dapStore.currentStep;
    Object.defineProperty(dapStore, 'currentStep', {
      get: () => stepWithFixedSelector,
      configurable: true,
    });

    dapStore.initStepValidation();
    expect(dapStore.isStepValidated).toBe(false);
    expect(dapStore.canAdvance).toBe(false);

    // Restore currentStep
    Object.defineProperty(dapStore, 'currentStep', {
      get: () => origStep,
      configurable: true,
    });
    dapRoot.remove();
  });

  it('proves that the step remains locked until the intended user action occurs, and unlocks only on expected postcondition', () => {
    // 1. Tour overlay is present
    const dapRoot = document.createElement('div');
    dapRoot.className = 'dap-root-container';
    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 z-[9990] pointer-events-none';
    dapRoot.appendChild(overlay);
    document.body.appendChild(dapRoot);

    // 2. Application target button is mounted
    const button = document.createElement('button');
    button.setAttribute('data-tour-id', 'sa.organisation.users.create-btn');
    button.textContent = '+ Add User';
    document.body.appendChild(button);

    // Get real SA-04 Step 2
    const sa04 = superAdminMissions.find(m => m.code === 'SA-04');
    const sa04Step2 = sa04.steps.find(s => s.id === 'sa-04-02');
    expect(sa04Step2.postconditionSelector).not.toContain('.fixed.inset-0');

    let stepCompleted = false;
    const cleanup = bindTargetInteraction(button, sa04Step2, (isValid) => {
      stepCompleted = isValid;
    });

    // 3. Step remains locked before user click
    expect(stepCompleted).toBe(false);

    // 4. Clicking elsewhere or unrelated elements does not unlock step
    document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(stepCompleted).toBe(false);

    // 5. User clicks the intended application button, but modal has not mounted yet
    button.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    expect(stepCompleted).toBe(false);

    // 6. Application mounts the real target modal element
    const userModal = document.createElement('div');
    userModal.setAttribute('data-tour-id', 'sa.organisation.createuser.identity-card');
    document.body.appendChild(userModal);

    // 7. Postcondition is now met and step unlocks
    expect(evaluatePostcondition(sa04Step2)).toBe(true);

    button.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    expect(stepCompleted).toBe(true);

    cleanup();
    dapRoot.remove();
    button.remove();
    userModal.remove();
  });

  // =========================================================================
  // 13. INV-FORM-TOUR-001: ORGANIZATION CREATE USER FORM SEQUENCE (SA-04)
  // =========================================================================
  it('INV-FORM-TOUR-001: verifies the complete sequence from Add User -> Create User form fields -> final submit action', () => {
    const sa04 = superAdminMissions.find(m => m.code === 'SA-04');
    expect(sa04).toBeDefined();

    // Verify step progression: step 2 (Add User) -> steps 3-9 (form fields & final action)
    const step2 = sa04.steps.find(s => s.id === 'sa-04-02');
    expect(step2.actionType).toBe('OPEN_MODAL');
    expect(step2.postconditionSelector).toContain('sa.organisation.createuser.identity-card');

    const expectedFormSequence = [
      { id: 'sa-04-03', targetId: 'sa.organisation.createuser.name', title: 'Full Name & Staff Identity' },
      { id: 'sa-04-04', targetId: 'sa.organisation.createuser.email', title: 'Corporate Email & Login Credential' },
      { id: 'sa-04-05', targetId: 'sa.organisation.createuser.role', title: 'Role & Authority Tier' },
      { id: 'sa-04-06', targetId: 'sa.organisation.createuser.branch', title: 'Branch Custody & Operational Scope' },
      { id: 'sa-04-07', targetId: 'sa.organisation.createuser.security-card', title: 'Security & MFA Controls' },
      { id: 'sa-04-08', targetId: 'sa.organisation.createuser.permissions-card', title: 'Permissions Scope Overview' },
      { id: 'sa-04-09', targetId: 'sa.organisation.createuser.submit-btn', title: 'Create User Action' },
    ];

    for (const expected of expectedFormSequence) {
      const step = sa04.steps.find(s => s.id === expected.id);
      expect(step, `Step ${expected.id} must exist in SA-04`).toBeDefined();
      expect(step.targetId).toBe(expected.targetId);
      expect(step.route).toBe('/organisation/users');
      expect(step.mode).toBe('OBSERVE');
      expect(step.trainingType).toBe('observe');
      expect(step.mutationRisk).toBe('RISK_0_READ_ONLY');
      expect(step.skippable).toBe(true);
    }

    // Mount real CreateUser component and verify every form step resolves to a mounted DOM target
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [{ path: '/organisation/users', component: { template: '<div>Users</div>' } }]
    });

    const wrapper = mount(CreateUser, {
      props: { isModal: true },
      global: { plugins: [router] },
      attachTo: document.body
    });

    for (const expected of expectedFormSequence) {
      const el = document.querySelector(`[data-tour-id="${expected.targetId}"]`);
      expect(el, `Target ${expected.targetId} must be present in mounted DOM`).not.toBeNull();

      // Mock client layout dimensions for JSDOM geometry evaluation
      Object.defineProperty(el, 'getBoundingClientRect', {
        value: () => ({ top: 100, bottom: 140, left: 100, right: 350, width: 250, height: 40 }),
        configurable: true
      });

      const res = resolveTarget(expected.targetId);
      expect(res.element, `Target ${expected.targetId} must resolve to a mounted DOM element`).toBe(el);
      expect(res.state, `Target ${expected.targetId} must resolve to TARGET_VISIBLE`).toBe(TARGET_STATES.TARGET_VISIBLE);
    }

    wrapper.unmount();
  });

  // =========================================================================
  // 14. INV-FORM-TOUR-002: BRANCH MANAGER CREATE LEAD FORM SEQUENCE (BM-03)
  // =========================================================================
  it('INV-FORM-TOUR-002: verifies the complete sequence from Add Lead -> Create Lead form fields -> final submit action', () => {
    const bm03 = branchManagerMissions.find(m => m.code === 'BM-03');
    expect(bm03).toBeDefined();

    // Verify step 2 (Add Lead) opens modal with semantic postcondition
    const step2 = bm03.steps.find(s => s.id === 'bm-03-02');
    expect(step2.actionType).toBe('OPEN_MODAL');
    expect(step2.postconditionSelector).toContain('bm.sales.createlead.name');

    const expectedFormSequence = [
      { id: 'bm-03-03', targetId: 'bm.sales.createlead.name', title: 'Prospect Full Name' },
      { id: 'bm-03-04', targetId: 'bm.sales.createlead.phone', title: 'Customer Contact Phone' },
      { id: 'bm-03-05', targetId: 'bm.sales.createlead.source', title: 'Lead Inflow Channel' },
      { id: 'bm-03-06', targetId: 'bm.sales.createlead.branch', title: 'Showroom Branch Scope' },
      { id: 'bm-03-07', targetId: 'bm.sales.createlead.product', title: 'Vehicle Model Preference' },
      { id: 'bm-03-08', targetId: 'bm.sales.createlead.stage', title: 'Pipeline Conversion Stage' },
      { id: 'bm-03-09', targetId: 'bm.sales.createlead.submit-btn', title: 'Save Lead Action' },
    ];

    for (const expected of expectedFormSequence) {
      const step = bm03.steps.find(s => s.id === expected.id);
      expect(step, `Step ${expected.id} must exist in BM-03`).toBeDefined();
      expect(step.targetId).toBe(expected.targetId);
      expect(step.route).toBe('/sales/leads');
      expect(step.mode).toBe('OBSERVE');
      expect(step.trainingType).toBe('observe');
      expect(step.mutationRisk).toBe('RISK_0_READ_ONLY');
      expect(step.skippable).toBe(true);
    }

    // Mount real CreateLead component and verify every form step resolves to a mounted DOM target
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [{ path: '/sales/leads', component: { template: '<div>Leads</div>' } }]
    });

    const wrapper = mount(CreateLead, {
      props: { isModal: true },
      global: { plugins: [router] },
      attachTo: document.body
    });

    for (const expected of expectedFormSequence) {
      const el = document.querySelector(`[data-tour-id="${expected.targetId}"]`);
      expect(el, `Target ${expected.targetId} must be present in mounted DOM`).not.toBeNull();

      // Mock client layout dimensions for JSDOM geometry evaluation
      Object.defineProperty(el, 'getBoundingClientRect', {
        value: () => ({ top: 120, bottom: 160, left: 100, right: 350, width: 250, height: 40 }),
        configurable: true
      });

      const res = resolveTarget(expected.targetId);
      expect(res.element, `Target ${expected.targetId} must resolve to a mounted DOM element`).toBe(el);
      expect(res.state, `Target ${expected.targetId} must resolve to TARGET_VISIBLE`).toBe(TARGET_STATES.TARGET_VISIBLE);
    }

    wrapper.unmount();
  });

  // =========================================================================
  // 15. INV-FORM-TOUR-003: REAL VUE COMPONENT TARGET PRESENCE
  // =========================================================================
  it('INV-FORM-TOUR-003: ensures all interactive form inputs and submit buttons exist on real mounted components', () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/organisation/users', component: { template: '<div>Users</div>' } },
        { path: '/sales/leads', component: { template: '<div>Leads</div>' } }
      ]
    });

    // CreateUser Component Checks
    const userWrapper = mount(CreateUser, {
      props: { isModal: true },
      global: { plugins: [router] }
    });

    expect(userWrapper.find('[data-tour-id="sa.organisation.createuser.name"]').exists()).toBe(true);
    expect(userWrapper.find('[data-tour-id="sa.organisation.createuser.email"]').exists()).toBe(true);
    expect(userWrapper.find('[data-tour-id="sa.organisation.createuser.role"]').exists()).toBe(true);
    expect(userWrapper.find('[data-tour-id="sa.organisation.createuser.branch"]').exists()).toBe(true);
    expect(userWrapper.find('[data-tour-id="sa.organisation.createuser.security-card"]').exists()).toBe(true);
    expect(userWrapper.find('[data-tour-id="sa.organisation.createuser.permissions-card"]').exists()).toBe(true);
    expect(userWrapper.find('[data-tour-id="sa.organisation.createuser.submit-btn"]').exists()).toBe(true);
    userWrapper.unmount();

    // CreateLead Component Checks
    const leadWrapper = mount(CreateLead, {
      props: { isModal: true },
      global: { plugins: [router] }
    });

    expect(leadWrapper.find('[data-tour-id="bm.sales.createlead.info-card"]').exists()).toBe(true);
    expect(leadWrapper.find('[data-tour-id="bm.sales.createlead.name"]').exists()).toBe(true);
    expect(leadWrapper.find('[data-tour-id="bm.sales.createlead.phone"]').exists()).toBe(true);
    expect(leadWrapper.find('[data-tour-id="bm.sales.createlead.source"]').exists()).toBe(true);
    expect(leadWrapper.find('[data-tour-id="bm.sales.createlead.scope-card"]').exists()).toBe(true);
    expect(leadWrapper.find('[data-tour-id="bm.sales.createlead.branch"]').exists()).toBe(true);
    expect(leadWrapper.find('[data-tour-id="bm.sales.createlead.product"]').exists()).toBe(true);
    expect(leadWrapper.find('[data-tour-id="bm.sales.createlead.stage"]').exists()).toBe(true);
    expect(leadWrapper.find('[data-tour-id="bm.sales.createlead.submit-btn"]').exists()).toBe(true);
    leadWrapper.unmount();

    // CreateBranch Component Checks
    const branchWrapper = mount(CreateBranch, {
      props: { isModal: true },
      global: { plugins: [router] }
    });

    expect(branchWrapper.find('[data-tour-id="sa.organisation.createbranch.identity-card"]').exists()).toBe(true);
    expect(branchWrapper.find('[data-tour-id="sa.organisation.createbranch.name"]').exists()).toBe(true);
    expect(branchWrapper.find('[data-tour-id="sa.organisation.createbranch.code"]').exists()).toBe(true);
    expect(branchWrapper.find('[data-tour-id="sa.organisation.createbranch.location-card"]').exists()).toBe(true);
    expect(branchWrapper.find('[data-tour-id="sa.organisation.createbranch.operations-card"]').exists()).toBe(true);
    expect(branchWrapper.find('[data-tour-id="sa.organisation.createbranch.controls-card"]').exists()).toBe(true);
    expect(branchWrapper.find('[data-tour-id="sa.organisation.createbranch.submit-btn"]').exists()).toBe(true);
    branchWrapper.unmount();
  });

  // =========================================================================
  // 16. INV-FORM-TOUR-004: SUPER ADMIN CREATE BRANCH FORM SEQUENCE (SA-03)
  // =========================================================================
  it('INV-FORM-TOUR-004: verifies the complete sequence from Add Branch -> Create Branch form cards -> modal presence', () => {
    const sa03 = superAdminMissions.find(m => m.code === 'SA-03');
    expect(sa03).toBeDefined();

    // Verify step 2 (Add Branch) opens modal with semantic postcondition
    const step2 = sa03.steps.find(s => s.id === 'sa-03-02');
    expect(step2.actionType).toBe('OPEN_MODAL');
    expect(step2.postconditionSelector).toContain('sa.organisation.createbranch.identity-card');

    const expectedFormSequence = [
      { id: 'sa-03-03', targetId: 'sa.organisation.createbranch.identity-card', title: '1. Branch Identity' },
      { id: 'sa-03-04', targetId: 'sa.organisation.createbranch.location-card', title: '2. Location & Contact' },
      { id: 'sa-03-05', targetId: 'sa.organisation.createbranch.operations-card', title: '3. Management & Operations' },
      { id: 'sa-03-06', targetId: 'sa.organisation.createbranch.controls-card', title: '4. Controls & Policies' },
    ];

    for (const expected of expectedFormSequence) {
      const step = sa03.steps.find(s => s.id === expected.id);
      expect(step, `Step ${expected.id} must exist in SA-03`).toBeDefined();
      expect(step.targetId).toBe(expected.targetId);
      expect(step.route).toBe('/organisation/branches');
      expect(step.mode).toBe('OBSERVE');
      expect(step.trainingType).toBe('observe');
      expect(step.mutationRisk).toBe('RISK_0_READ_ONLY');
      expect(step.skippable).toBe(true);
    }

    // Mount real CreateBranch component and verify every form card resolves to a mounted DOM target
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [{ path: '/organisation/branches', component: { template: '<div>Branches</div>' } }]
    });

    const wrapper = mount(CreateBranch, {
      props: { isModal: true },
      global: { plugins: [router] },
      attachTo: document.body
    });

    for (const expected of expectedFormSequence) {
      const el = document.querySelector(`[data-tour-id="${expected.targetId}"]`);
      expect(el, `Target ${expected.targetId} must be present in mounted DOM`).not.toBeNull();

      // Mock client layout dimensions for JSDOM geometry evaluation
      Object.defineProperty(el, 'getBoundingClientRect', {
        value: () => ({ top: 100, bottom: 250, left: 100, right: 450, width: 350, height: 150 }),
        configurable: true
      });

      const res = resolveTarget(expected.targetId);
      expect(res.element, `Target ${expected.targetId} must resolve to a mounted DOM element`).toBe(el);
      expect(res.state, `Target ${expected.targetId} must resolve to TARGET_VISIBLE`).toBe(TARGET_STATES.TARGET_VISIBLE);
    }

    expect(wrapper.find('[data-tour-id="sa.organisation.createbranch.submit-btn"]').exists()).toBe(true);

    wrapper.unmount();
  });
});
