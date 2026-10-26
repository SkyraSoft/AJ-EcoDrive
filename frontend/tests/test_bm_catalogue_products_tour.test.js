import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import Products from '@/views/catalogue/Products.vue';
import { store } from '@/store.js';
import { dapStore } from '@/stores/dapStore.js';
import { getPageTour, getMissionById } from '@/tour/content/catalog.js';
import { CURRICULUM_SEEDED_TARGETS } from '@/tour/curriculumTargets.js';
import { resolveTarget } from '@/tour/targetResolver.js';

describe('Branch Manager — Catalogue › Products Guided Tour Suite', () => {
  beforeEach(() => {
    store.currentUser = {
      role: 'Branch Manager',
      name: 'Tariq Khan',
      branchName: 'Peshawar',
      branchCode: 'PEW',
      isSuperAdmin: false,
      isAuthenticated: true
    };
    dapStore.stopDAP();
  });

  it('1. Enforces strict role isolation: Branch Manager on /catalogue/products receives BM-CAT-PROD and NOT Super Admin SA-05', () => {
    const bmTour = getPageTour('/catalogue/products', 'Branch Manager');
    expect(bmTour).toBeDefined();
    expect(bmTour.id).toBe('bm-page-catalogue-products');
    expect(bmTour.code).toBe('BM-CAT-PROD');
    expect(bmTour.workspace).toBe('Branch Manager');
    expect(bmTour.route).toBe('/catalogue/products');
    expect(bmTour.steps.length).toBe(4);

    // Verify Super Admin still gets SA-05
    const saTour = getPageTour('/catalogue/products', 'Super Admin');
    expect(saTour).toBeDefined();
    expect(saTour.code).toBe('SA-05');
    expect(saTour.workspace).toBe('Super Admin');
  });

  it('2. Registers all 4 Branch Manager Catalogue Products tour targets in curriculum targets catalog', () => {
    const expectedTargets = [
      'bm.catalogue.products.kpi-cards',
      'bm.catalogue.products.filters',
      'bm.catalogue.products.table',
      'bm.catalogue.products.export-btn',
    ];

    for (const tId of expectedTargets) {
      const match = CURRICULUM_SEEDED_TARGETS.find(t => t.targetId === tId);
      expect(match, `Target ${tId} must be registered in CURRICULUM_SEEDED_TARGETS`).toBeDefined();
      expect(match.workspace).toBe('Branch Manager');
      expect(match.route).toBe('/catalogue/products');
      expect(match.readinessClass).toBe('ROUTE_MOUNT_TARGET');
    }
  });

  it('3. Products.vue mounts for Branch Manager with all 4 tour target elements rendered with data-tour-id', () => {
    const wrapper = mount(Products, {
      global: {
        mocks: {
          $router: { push: () => {} },
          $route: { path: '/catalogue/products' }
        },
        stubs: {
          Search: true,
          ChevronDown: true,
          Check: true,
          MoreHorizontal: true,
          CheckCircle2: true,
          Eye: true,
          Plus: true
        }
      }
    });

    // Verify Branch Manager view is rendered and Super Admin view is not
    expect(wrapper.find('[data-tour-id="bm.catalogue.products.kpi-cards"]').exists()).toBe(true);
    expect(wrapper.find('[data-tour-id="bm.catalogue.products.filters"]').exists()).toBe(true);
    expect(wrapper.find('[data-tour-id="bm.catalogue.products.table"]').exists()).toBe(true);
    expect(wrapper.find('[data-tour-id="bm.catalogue.products.export-btn"]').exists()).toBe(true);

    // Verify Super Admin create button is absent in Branch Manager view
    expect(wrapper.find('[data-tour-id="sa.catalogue.products.create-btn"]').exists()).toBe(false);
  });

  it('4. dapStore.startContinuousTour(/catalogue/products) runs Branch Manager tour step-by-step with Next and Prev', () => {
    const tourResult = dapStore.startContinuousTour('/catalogue/products');
    expect(tourResult.success).toBe(true);
    expect(dapStore.isActive).toBe(true);
    expect(dapStore.currentMission.code).toBe('BM-CAT-PROD');
    expect(dapStore.totalStepsInCurrentMission).toBe(4);

    // Step 1: KPI Cards
    expect(dapStore.currentStepIndex).toBe(0);
    expect(dapStore.currentStep.targetId).toBe('bm.catalogue.products.kpi-cards');
    expect(dapStore.isFirstStep).toBe(true);
    expect(dapStore.isFinalStep).toBe(false);

    // Forward to Step 2: Filters
    dapStore.nextStep();
    expect(dapStore.currentStepIndex).toBe(1);
    expect(dapStore.currentStep.targetId).toBe('bm.catalogue.products.filters');
    expect(dapStore.isFirstStep).toBe(false);

    // Backward to Step 1
    dapStore.prevStep();
    expect(dapStore.currentStepIndex).toBe(0);
    expect(dapStore.currentStep.targetId).toBe('bm.catalogue.products.kpi-cards');

    // Forward to Step 3: Table
    dapStore.nextStep();
    dapStore.nextStep();
    expect(dapStore.currentStepIndex).toBe(2);
    expect(dapStore.currentStep.targetId).toBe('bm.catalogue.products.table');

    // Forward to Step 4: Export Button
    dapStore.nextStep();
    expect(dapStore.currentStepIndex).toBe(3);
    expect(dapStore.currentStep.targetId).toBe('bm.catalogue.products.export-btn');
    expect(dapStore.isFinalStep).toBe(true);

    // Next on final step finishes tour cleanly
    dapStore.nextStep();
    expect(dapStore.isActive).toBe(false);
  });

  it('5. Manual control: No auto-clicking, auto-submitting, or data mutation occurs during tour execution', () => {
    dapStore.startContinuousTour('/catalogue/products');
    const steps = dapStore.currentStepsList;

    for (const step of steps) {
      // Must be OBSERVE mode so the tour never auto-clicks or auto-submits
      expect(step.mode).toBe('OBSERVE');
      expect(step.mutationRisk).toBe('RISK_0_READ_ONLY');
    }
  });
});
