import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { superAdminMissions } from '../src/tour/content/superAdmin/superAdminMissions.js';
import { getTarget } from '../src/tour/targetRegistry.js';
import { resolveTarget } from '../src/tour/targetResolver.js';
import {
  bindTargetInteraction,
  cleanUpInteractionListeners,
  evaluatePostcondition,
  validateInputValue,
  MUTATION_RISK_CLASSES
} from '../src/tour/engine/interactionManager.js';
import { dapStore } from '../src/stores/dapStore.js';

describe('Home Module & Subpages: Interactive Button-to-Form Tour Flow Contract', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    cleanUpInteractionListeners();
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
    vi.restoreAllMocks();
  });

  it('Verifies SA-02 sequence covers all 5 Home routes across 34 continuous steps in logical order', () => {
    const sa02 = superAdminMissions.find(m => m.code === 'SA-02');
    expect(sa02).toBeDefined();
    expect(sa02.steps.length).toBe(34);

    // Verify all 5 routes are present in orderly progression
    const routes = sa02.steps.map(s => s.route);
    const uniqueRoutes = [...new Set(routes)];
    expect(uniqueRoutes).toEqual([
      '/dashboard',
      '/dashboard/branch-performance',
      '/dashboard/business-performance',
      '/dashboard/action-centre',
      '/dashboard/quick-actions'
    ]);

    // Check step numbers are strictly 1..21
    sa02.steps.forEach((step, idx) => {
      expect(step.stepNumber).toBe(idx + 1);
      expect(step.id).toBe(`sa-02-${String(idx + 1).padStart(2, '0')}`);
      expect(step.targetId).toBeDefined();
      expect(getTarget(step.targetId)).toBeDefined();
    });
  });

  it('Requirement 1 & 2: Highlights action button (+ Issue Action Directive) in PRACTICE mode without auto-triggering', () => {
    const sa02 = superAdminMissions.find(m => m.code === 'SA-02');
    const buttonStep = sa02.steps.find(s => s.id === 'sa-02-14');

    expect(buttonStep.mode).toBe('PRACTICE');
    expect(buttonStep.trainingType).toBe('practice');
    expect(buttonStep.expectedAction).toBe('CLICK');
    expect(buttonStep.actionType).toBe('OPEN_MODAL');
    expect(buttonStep.targetId).toBe('sa.action-centre.header.create-btn');
    expect(buttonStep.postconditionSelector).toBe('[data-tour="action-create-modal"]');

    // Create target button in DOM
    const btn = document.createElement('button');
    btn.setAttribute('data-tour-id', 'sa.action-centre.header.create-btn');
    container.appendChild(btn);

    let validCalled = false;
    let clickCount = 0;
    btn.addEventListener('click', () => {
      clickCount++;
    });

    bindTargetInteraction(
      btn,
      buttonStep,
      () => { validCalled = true; },
      () => {}
    );

    // Initial binding MUST NOT trigger click automatically
    expect(clickCount).toBe(0);
    expect(validCalled).toBe(false);
  });

  it('Interactive button flow: Highlight button -> Next is disabled -> User clicks button -> Expected content opens -> Next becomes available -> User clicks Next -> Advances exactly one step', () => {
    dapStore.isActive = true;
    dapStore.currentMissionIndex = 1; // SA-02
    dapStore.currentStepIndex = 13;   // sa-02-14 (+ Issue Action Directive button, interactive)
    dapStore.initStepValidation();

    // 1 & 2: Before user clicks button, Next is disabled
    expect(dapStore.isStepInteractive(dapStore.currentStep)).toBe(true);
    expect(dapStore.isStepValidated).toBe(false);
    expect(dapStore.canAdvance).toBe(false);

    // 3: User manually clicks button and modal opens
    dapStore.handleRealFieldAction();

    // 4: Next becomes available
    expect(dapStore.isStepValidated).toBe(true);
    expect(dapStore.canAdvance).toBe(true);

    // 5: User clicks Next -> advances exactly one step
    dapStore.nextStep();
    expect(dapStore.currentStepIndex).toBe(14);
  });

  it('Requirement 9: Normal Next behavior remains unchanged for steps that do not require a manual interaction', () => {
    dapStore.isActive = true;
    dapStore.currentMissionIndex = 1; // SA-02
    dapStore.currentStepIndex = 0;    // sa-02-01 (Net sales KPI, OBSERVE)
    dapStore.initStepValidation();

    // Does not require interaction: canAdvance is immediately true
    expect(dapStore.isStepInteractive(dapStore.currentStep)).toBe(false);
    expect(dapStore.canAdvance).toBe(true);

    // User clicks Next -> advances immediately to step 1
    dapStore.nextStep();
    expect(dapStore.currentStepIndex).toBe(1);
  });

  it('Requirement 3 & 4: Automatically validates and detects modal once user manually clicks the button', async () => {
    const sa02 = superAdminMissions.find(m => m.code === 'SA-02');
    const buttonStep = sa02.steps.find(s => s.id === 'sa-02-14');

    const btn = document.createElement('button');
    btn.setAttribute('data-tour-id', 'sa.action-centre.header.create-btn');
    container.appendChild(btn);

    // Simulate opening modal on user click
    btn.addEventListener('click', () => {
      const modal = document.createElement('div');
      modal.setAttribute('data-tour', 'action-create-modal');
      container.appendChild(modal);
    });

    let validated = false;
    bindTargetInteraction(
      btn,
      buttonStep,
      () => { validated = true; },
      () => {}
    );

    // User manually clicks the button
    btn.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    // InteractionManager verifies postcondition and calls onValid
    expect(validated).toBe(true);
    expect(document.querySelector('[data-tour="action-create-modal"]')).not.toBeNull();
  });

  it('Requirement 5: Sequences through all 5 action flow category cards and detail fields in proper order', () => {
    const sa02 = superAdminMissions.find(m => m.code === 'SA-02');
    const step14 = sa02.steps[13]; // sa-02-14 (+ Issue Action Directive button)
    const card1 = sa02.steps[14];  // sa-02-15 (Commercial & Pricing Exception)
    const card2 = sa02.steps[15];  // sa-02-16 (Inter-Branch Stock Reallocation)
    const card3 = sa02.steps[16];  // sa-02-17 (Emergency Operational Expenditure)
    const card4 = sa02.steps[17];  // sa-02-18 (Critical Warranty Claim)
    const card5 = sa02.steps[18];  // sa-02-19 (Inventory Governance & Quarantine)
    const field1 = sa02.steps[19]; // sa-02-20 (Title input)
    const submitBtn = sa02.steps[28]; // sa-02-29 (Submit button)

    expect(step14.targetId).toBe('sa.action-centre.header.create-btn');
    expect(card1.targetId).toBe('sa.action-centre.modal.type-commercial-pricing');
    expect(card2.targetId).toBe('sa.action-centre.modal.type-stock-reallocation');
    expect(card3.targetId).toBe('sa.action-centre.modal.type-operational-expense');
    expect(card4.targetId).toBe('sa.action-centre.modal.type-warranty-escalation');
    expect(card5.targetId).toBe('sa.action-centre.modal.type-inventory-governance');
    expect(field1.targetId).toBe('sa.action-centre.modal.field-title');
    expect(submitBtn.targetId).toBe('sa.action-centre.modal.submit-btn');

    // All 5 cards must be distinct unique practice click steps
    const cardTargetIds = [card1.targetId, card2.targetId, card3.targetId, card4.targetId, card5.targetId];
    expect(new Set(cardTargetIds).size).toBe(5);

    for (const card of [card1, card2, card3, card4, card5]) {
      expect(card.mode).toBe('OBSERVE');
      expect(card.skippable).toBe(true);
    }
  });

  it('Five Category Cards Complete Sequence: Each card advances sequentially with Next/Previous in order', () => {
    dapStore.isActive = true;
    dapStore.currentMissionIndex = 1; // SA-02
    dapStore.currentStepIndex = 14;   // sa-02-15 (Card 1: Commercial & Pricing)

    const expectedCards = [
      'sa.action-centre.modal.type-commercial-pricing',
      'sa.action-centre.modal.type-stock-reallocation',
      'sa.action-centre.modal.type-operational-expense',
      'sa.action-centre.modal.type-warranty-escalation',
      'sa.action-centre.modal.type-inventory-governance'
    ];

    for (let i = 0; i < 5; i++) {
      expect(dapStore.currentStepIndex).toBe(14 + i);
      expect(dapStore.currentStep.targetId).toBe(expectedCards[i]);

      // Category cards are in OBSERVE mode with Next navigation enabled
      dapStore.initStepValidation();
      expect(dapStore.canAdvance).toBe(true);

      // User clicks Next button to advance to next step
      dapStore.nextStep();
    }

    // After card 5, tour reaches first form field step (Directive Title)
    expect(dapStore.currentStepIndex).toBe(19);
    expect(dapStore.currentStep.targetId).toBe('sa.action-centre.modal.field-title');
  });

  it('Requirement 1, 3 & 4 for Treatment Drawer: Highlights row Treat/Inspect button and detects opened drawer on manual click', () => {
    const sa02 = superAdminMissions.find(m => m.code === 'SA-02');
    const treatBtnStep = sa02.steps.find(s => s.targetId === 'sa.action-centre.queue.treat-btn');
    const drawerStep = sa02.steps.find(s => s.targetId === 'sa.action-centre.drawer.approve-btn');

    expect(treatBtnStep.mode).toBe('PRACTICE');
    expect(treatBtnStep.expectedAction).toBe('CLICK');
    expect(treatBtnStep.actionType).toBe('OPEN_DRAWER');
    expect(treatBtnStep.postconditionSelector).toBe('[data-tour=\"action-treatment-drawer\"]');
    expect(drawerStep.targetId).toBe('sa.action-centre.drawer.approve-btn');

    // Create treat button
    const treatBtn = document.createElement('button');
    treatBtn.setAttribute('data-tour-id', 'sa.action-centre.queue.treat-btn');
    container.appendChild(treatBtn);

    treatBtn.addEventListener('click', () => {
      const drawer = document.createElement('div');
      drawer.setAttribute('data-tour', 'action-treatment-drawer');
      const approveBtn = document.createElement('button');
      approveBtn.setAttribute('data-tour-id', 'sa.action-centre.drawer.approve-btn');
      Object.defineProperty(approveBtn, 'getBoundingClientRect', {
        value: () => ({ top: 100, bottom: 150, left: 100, right: 200, width: 100, height: 50, x: 100, y: 100 }),
        configurable: true,
      });
      drawer.appendChild(approveBtn);
      container.appendChild(drawer);
    });

    let treatValidated = false;
    bindTargetInteraction(
      treatBtn,
      treatBtnStep,
      () => { treatValidated = true; },
      () => {}
    );

    // Initial check: not auto-clicked
    expect(treatValidated).toBe(false);

    // User manual click
    treatBtn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(treatValidated).toBe(true);

    // The drawer is visible and fields resolve cleanly
    const res = resolveTarget('sa.action-centre.drawer.approve-btn');
    expect(res.state).toBe('TARGET_VISIBLE');
  });

  it('Requirement 9: Mutation safety - Never automatically submits forms or executes destructive actions', () => {
    const sa02 = superAdminMissions.find(m => m.code === 'SA-02');

    // Verify all steps are either RISK_0_READ_ONLY or RISK_2_DRAFT_OR_REVERSIBLE (opening a modal/drawer)
    // NONE are RISK_3_DESTRUCTIVE or auto-submitting
    for (const step of sa02.steps) {
      expect([
        MUTATION_RISK_CLASSES.RISK_0_READ_ONLY,
        MUTATION_RISK_CLASSES.RISK_2_DRAFT_OR_REVERSIBLE
      ]).toContain(step.mutationRisk);

      // Verify no step instruction tells user that it will auto-submit
      expect(step.instruction.toLowerCase()).not.toContain('auto-submit');
      expect(step.explanation.toLowerCase()).not.toContain('auto-submit');
    }
  });

  it('Requirement 6 & 10: Preserves route tracking and does not show Finish until final step of entire tour', () => {
    dapStore.startContinuousTour('/dashboard');
    expect(dapStore.isFinalStep).toBe(false);

    // At step 1 of SA-02
    dapStore.currentMissionIndex = 1;
    dapStore.currentStepIndex = 0;
    expect(dapStore.isFinalStep).toBe(false);

    // At step 25 of SA-02
    dapStore.currentStepIndex = 24;
    // Since there are 20 total missions (SA-01 to SA-20), SA-02 is NOT the final mission
    expect(dapStore.isFinalStep).toBe(false);
  });
});
