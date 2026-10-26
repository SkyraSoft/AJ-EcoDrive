import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { superAdminMissions } from '../src/tour/content/superAdmin/superAdminMissions.js';
import { getTarget } from '../src/tour/targetRegistry.js';
import { resolveTarget } from '../src/tour/targetResolver.js';
import {
  bindTargetInteraction,
  cleanUpInteractionListeners,
  MUTATION_RISK_CLASSES
} from '../src/tour/engine/interactionManager.js';
import { dapStore } from '../src/stores/dapStore.js';

describe('Action Centre (/dashboard/action-centre): Overview, Trigger Button & Field-by-Field Form Tour Contract', () => {
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

  it('1. Verifies Action Centre steps in SA-02 cover overview, button, category cards, and all 10 modal fields in exact sequence', () => {
    const sa02 = superAdminMissions.find(m => m.code === 'SA-02');
    expect(sa02).toBeDefined();

    const actionCentreSteps = sa02.steps.filter(s => s.route === '/dashboard/action-centre');
    expect(actionCentreSteps.length).toBe(20);

    const expectedTargetSequence = [
      'sa.action-centre.header.filters',
      'sa.action-centre.header.create-btn',
      'sa.action-centre.modal.type-commercial-pricing',
      'sa.action-centre.modal.type-stock-reallocation',
      'sa.action-centre.modal.type-operational-expense',
      'sa.action-centre.modal.type-warranty-escalation',
      'sa.action-centre.modal.type-inventory-governance',
      'sa.action-centre.modal.field-title',
      'sa.action-centre.modal.field-priority',
      'sa.action-centre.modal.field-customer',
      'sa.action-centre.modal.field-phone',
      'sa.action-centre.modal.field-model',
      'sa.action-centre.modal.field-orderref',
      'sa.action-centre.modal.field-unitcount',
      'sa.action-centre.modal.field-discount',
      'sa.action-centre.modal.field-justification',
      'sa.action-centre.modal.submit-btn',
      'sa.action-centre.queue.list',
      'sa.action-centre.queue.treat-btn',
      'sa.action-centre.drawer.approve-btn'
    ];

    expect(actionCentreSteps.map(s => s.targetId)).toEqual(expectedTargetSequence);

    // Verify all targets are officially registered in targetRegistry
    actionCentreSteps.forEach(step => {
      const targetDef = getTarget(step.targetId);
      expect(targetDef, `Target ${step.targetId} must be registered`).toBeDefined();
      expect(targetDef.route).toBe('/dashboard/action-centre');
    });
  });

  it('2. Button Practice Interaction: "+ Issue Action Directive" highlights in PRACTICE mode and waits for user click', () => {
    const sa02 = superAdminMissions.find(m => m.code === 'SA-02');
    const buttonStep = sa02.steps.find(s => s.targetId === 'sa.action-centre.header.create-btn');

    expect(buttonStep.mode).toBe('PRACTICE');
    expect(buttonStep.expectedAction).toBe('CLICK');
    expect(buttonStep.actionType).toBe('OPEN_MODAL');
    expect(buttonStep.postconditionSelector).toBe('[data-tour="action-create-modal"]');

    // Create target button in DOM
    const btn = document.createElement('button');
    btn.setAttribute('data-tour-id', 'sa.action-centre.header.create-btn');
    container.appendChild(btn);

    let validated = false;
    let clicked = false;
    btn.addEventListener('click', () => {
      clicked = true;
      const modal = document.createElement('div');
      modal.setAttribute('data-tour', 'action-create-modal');
      container.appendChild(modal);
    });

    bindTargetInteraction(
      btn,
      buttonStep,
      () => { validated = true; },
      () => {}
    );

    // Tour NEVER auto-clicks
    expect(clicked).toBe(false);
    expect(validated).toBe(false);

    // User manually clicks
    btn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(clicked).toBe(true);
    expect(validated).toBe(true);
    expect(document.querySelector('[data-tour="action-create-modal"]')).not.toBeNull();
  });

  it('3. Field-by-Field Form Navigation: Each input, select, and textarea is highlighted with Next/Previous', () => {
    dapStore.isActive = true;
    dapStore.currentMissionIndex = 1; // SA-02
    dapStore.currentStepIndex = 19;   // Step 20: sa-02-20 (Directive Title)

    const expectedFieldTargets = [
      'sa.action-centre.modal.field-title',
      'sa.action-centre.modal.field-priority',
      'sa.action-centre.modal.field-customer',
      'sa.action-centre.modal.field-phone',
      'sa.action-centre.modal.field-model',
      'sa.action-centre.modal.field-orderref',
      'sa.action-centre.modal.field-unitcount',
      'sa.action-centre.modal.field-discount',
      'sa.action-centre.modal.field-justification',
      'sa.action-centre.modal.submit-btn'
    ];

    for (let i = 0; i < expectedFieldTargets.length; i++) {
      expect(dapStore.currentStepIndex).toBe(19 + i);
      expect(dapStore.currentStep.targetId).toBe(expectedFieldTargets[i]);
      expect(dapStore.canAdvance).toBe(true);

      if (i < expectedFieldTargets.length - 1) {
        dapStore.nextStep();
      }
    }

    // Verify Previous navigation step-by-step
    for (let i = expectedFieldTargets.length - 1; i > 0; i--) {
      expect(dapStore.currentStepIndex).toBe(19 + i);
      dapStore.prevStep();
    }
    expect(dapStore.currentStepIndex).toBe(19);
    expect(dapStore.currentStep.targetId).toBe('sa.action-centre.modal.field-title');
  });

  it('4. Safety & Non-destructive Execution: All fields are non-destructive and never auto-submit', () => {
    const sa02 = superAdminMissions.find(m => m.code === 'SA-02');
    const formSteps = sa02.steps.filter(s => s.targetId.startsWith('sa.action-centre.modal.field-') || s.targetId === 'sa.action-centre.modal.submit-btn');

    expect(formSteps.length).toBe(10);
    formSteps.forEach(step => {
      expect(step.mutationRisk).toBe(MUTATION_RISK_CLASSES.RISK_0_READ_ONLY);
      expect(step.instruction.toLowerCase()).not.toContain('auto-submit');
      expect(step.instruction.toLowerCase()).not.toContain('auto-click');
    });
  });
});
