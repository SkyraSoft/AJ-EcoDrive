import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { dapStore } from '../src/stores/dapStore.js';
import { store } from '../src/store.js';
import { resolveTarget } from '../src/tour/targetResolver.js';
import { cleanUpInteractionListeners } from '../src/tour/engine/interactionManager.js';

describe('Action Centre Guided Tour Bug Resolution & Modal Lifecycle Contract', () => {
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

  it('1. Trace & Verification: Starting tour on /dashboard/action-centre for Super Admin correctly routes to SA-02 step 13', () => {
    store.currentUser = {
      role: 'Super Admin',
      branchName: 'Head Office',
      isSuperAdmin: true,
      isAuthenticated: true
    };

    const res = dapStore.startContinuousTour('/dashboard/action-centre');
    expect(res.success).toBe(true);
    expect(dapStore.isActive).toBe(true);
    expect(dapStore.currentMission.code).toBe('SA-02');
    expect(dapStore.currentStep.route).toBe('/dashboard/action-centre');
    expect(dapStore.currentStep.targetId).toBe('sa.action-centre.header.filters');

    // Does NOT open Customer modal or navigate to /sales/customers/create
    expect(dapStore.currentStep.targetId).not.toContain('customer');
    expect(dapStore.currentStep.route).not.toBe('/sales/customers/create');
  });

  it('2. Trace & Verification: Starting tour on /dashboard/action-centre for Branch Manager correctly routes to BM-02 step 4', () => {
    store.currentUser = {
      role: 'Branch Manager',
      branchName: 'Peshawar',
      branchCode: 'PEW',
      isSuperAdmin: false,
      isAuthenticated: true
    };

    const res = dapStore.startContinuousTour('/dashboard/action-centre');
    expect(res.success).toBe(true);
    expect(dapStore.isActive).toBe(true);
    expect(dapStore.currentMission.code).toBe('BM-02');
    expect(dapStore.currentStep.route).toBe('/dashboard/action-centre');
    expect(dapStore.currentStep.targetId).toBe('bm.action-centre.header.filters');

    // Never jumps to BM-04 or /sales/customers/create
    expect(dapStore.currentMission.code).not.toBe('BM-04');
    expect(dapStore.currentStep.route).not.toBe('/sales/customers/create');
    expect(dapStore.currentStep.targetId).not.toContain('bm.customer.form');
  });

  it('3. Super Admin Action Centre: 5 category cards display before detail form, field-by-field navigation works with Next/Previous', () => {
    store.currentUser = {
      role: 'Super Admin',
      branchName: 'Head Office',
      isSuperAdmin: true,
      isAuthenticated: true
    };

    dapStore.startContinuousTour('/dashboard/action-centre');
    // Step 13: filters
    expect(dapStore.currentStep.targetId).toBe('sa.action-centre.header.filters');

    // Next to Step 14: "+ Issue Action Directive" button
    dapStore.nextStep();
    expect(dapStore.currentStep.targetId).toBe('sa.action-centre.header.create-btn');
    expect(dapStore.currentStep.actionType).toBe('OPEN_MODAL');

    // Next through the 5 category cards (Step 15-19)
    const categoryCards = [
      'sa.action-centre.modal.type-commercial-pricing',
      'sa.action-centre.modal.type-stock-reallocation',
      'sa.action-centre.modal.type-operational-expense',
      'sa.action-centre.modal.type-warranty-escalation',
      'sa.action-centre.modal.type-inventory-governance'
    ];

    categoryCards.forEach(targetId => {
      dapStore.nextStep();
      expect(dapStore.currentStep.targetId).toBe(targetId);
      expect(dapStore.canAdvance).toBe(true);
    });

    // Next through the detail form fields (Step 20-29)
    const detailFields = [
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

    detailFields.forEach(targetId => {
      dapStore.nextStep();
      expect(dapStore.currentStep.targetId).toBe(targetId);
      expect(dapStore.canAdvance).toBe(true);
    });

    // Previous navigation steps backwards through detail form to category cards
    for (let i = 0; i < detailFields.length; i++) {
      dapStore.prevStep();
    }
    // Now back at Card 5
    expect(dapStore.currentStep.targetId).toBe('sa.action-centre.modal.type-inventory-governance');
  });

  it('4. Branch Manager Action Centre: 5 category cards display before detail form, field-by-field navigation works with Next/Previous', () => {
    store.currentUser = {
      role: 'Branch Manager',
      branchName: 'Peshawar',
      branchCode: 'PEW',
      isSuperAdmin: false,
      isAuthenticated: true
    };

    dapStore.startContinuousTour('/dashboard/action-centre');
    // Step 4: filters
    expect(dapStore.currentStep.targetId).toBe('bm.action-centre.header.filters');

    // Step 5: "+ Raise Action Request" button
    dapStore.nextStep();
    expect(dapStore.currentStep.targetId).toBe('bm.action-centre.header.create-btn');

    // 5 Category Cards (Step 6-10)
    const bmCategoryCards = [
      'bm.action-centre.modal.type-commercial-pricing',
      'bm.action-centre.modal.type-stock-reallocation',
      'bm.action-centre.modal.type-operational-expense',
      'bm.action-centre.modal.type-warranty-escalation',
      'bm.action-centre.modal.type-inventory-governance'
    ];

    bmCategoryCards.forEach(targetId => {
      dapStore.nextStep();
      expect(dapStore.currentStep.targetId).toBe(targetId);
    });

    // Detail form fields (Step 11-20)
    const bmDetailFields = [
      'bm.action-centre.modal.field-title',
      'bm.action-centre.modal.field-priority',
      'bm.action-centre.modal.field-customer',
      'bm.action-centre.modal.field-phone',
      'bm.action-centre.modal.field-model',
      'bm.action-centre.modal.field-orderref',
      'bm.action-centre.modal.field-unitcount',
      'bm.action-centre.modal.field-discount',
      'bm.action-centre.modal.field-justification',
      'bm.action-centre.modal.submit-btn'
    ];

    bmDetailFields.forEach(targetId => {
      dapStore.nextStep();
      expect(dapStore.currentStep.targetId).toBe(targetId);
    });

    // Step 21: Queue table
    dapStore.nextStep();
    expect(dapStore.currentStep.targetId).toBe('bm.action-centre.queue.list');
  });

  it('5. Target Resolver seamlessly resolves all bm.action-centre targets via shared alias mappings', () => {
    const testTargets = [
      'bm.action-centre.header.filters',
      'bm.action-centre.header.create-btn',
      'bm.action-centre.modal.type-commercial-pricing',
      'bm.action-centre.modal.type-stock-reallocation',
      'bm.action-centre.modal.type-operational-expense',
      'bm.action-centre.modal.type-warranty-escalation',
      'bm.action-centre.modal.type-inventory-governance',
      'bm.action-centre.modal.field-title',
      'bm.action-centre.modal.field-priority',
      'bm.action-centre.modal.field-customer',
      'bm.action-centre.modal.field-phone',
      'bm.action-centre.modal.field-model',
      'bm.action-centre.modal.field-orderref',
      'bm.action-centre.modal.field-unitcount',
      'bm.action-centre.modal.field-discount',
      'bm.action-centre.modal.field-justification',
      'bm.action-centre.modal.submit-btn',
      'bm.action-centre.queue.list'
    ];

    testTargets.forEach(targetId => {
      const el = document.createElement('div');
      // Set the underlying semantic attribute in DOM
      el.setAttribute('data-tour-id', targetId.replace('bm.', 'sa.'));
      container.appendChild(el);

      const res = resolveTarget(targetId);
      expect(res.element, `Target ${targetId} should resolve via semantic alias`).toBe(el);
      container.removeChild(el);
    });
  });
});
