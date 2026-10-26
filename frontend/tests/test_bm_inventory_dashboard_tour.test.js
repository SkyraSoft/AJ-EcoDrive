import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import InventoryDashboard from '@/views/inventory/InventoryDashboard.vue';
import { store } from '@/store.js';
import { dapStore } from '@/stores/dapStore.js';
import { getPageTour, getMissionById } from '@/tour/content/catalog.js';
import { CURRICULUM_SEEDED_TARGETS } from '@/tour/curriculumTargets.js';

describe('Branch Manager — Inventory › My Inventory Guided Tour Suite', () => {
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

  it('1. Enforces strict role isolation: Branch Manager on /inventory/dashboard receives BM-INV-DASH', () => {
    const bmTour = getPageTour('/inventory/dashboard', 'Branch Manager');
    expect(bmTour).toBeDefined();
    expect(bmTour.id).toBe('bm-page-inventory-dashboard');
    expect(bmTour.code).toBe('BM-INV-DASH');
    expect(bmTour.workspace).toBe('Branch Manager');
    expect(bmTour.route).toBe('/inventory/dashboard');
    expect(bmTour.steps.length).toBe(4);

    // Verify lookup by ID
    const byId = getMissionById('bm-page-inventory-dashboard');
    expect(byId).toBeDefined();
    expect(byId.code).toBe('BM-INV-DASH');

    // Super Admin does not receive BM-INV-DASH
    const saTour = getPageTour('/inventory/dashboard', 'Super Admin');
    expect(saTour?.id).not.toBe('bm-page-inventory-dashboard');
  });

  it('2. Registers all 4 Branch Manager Inventory Dashboard tour targets in curriculum targets catalog', () => {
    const expectedTargets = [
      'bm.inventory.dashboard.header',
      'bm.inventory.dashboard.kpis',
      'bm.inventory.dashboard.status-grid',
      'bm.inventory.dashboard.valuation'
    ];

    for (const tId of expectedTargets) {
      const match = CURRICULUM_SEEDED_TARGETS.find(t => t.targetId === tId);
      expect(match, `Target ${tId} must be registered in CURRICULUM_SEEDED_TARGETS`).toBeDefined();
      expect(match.workspace).toBe('Branch Manager');
      expect(match.route).toBe('/inventory/dashboard');
      expect(match.readinessClass).toBe('ROUTE_MOUNT_TARGET');
    }
  });

  it('3. InventoryDashboard.vue mounts for Branch Manager with all 4 tour target elements and isolates from Super Admin view', () => {
    const wrapper = mount(InventoryDashboard, {
      global: {
        mocks: {
          $router: { push: () => {} },
          $route: { path: '/inventory/dashboard' }
        }
      }
    });

    // Branch Manager elements exist
    expect(wrapper.find('[data-tour-id="bm.inventory.dashboard.header"]').exists()).toBe(true);
    expect(wrapper.find('[data-tour-id="bm.inventory.dashboard.kpis"]').exists()).toBe(true);
    expect(wrapper.find('[data-tour-id="bm.inventory.dashboard.status-grid"]').exists()).toBe(true);
    expect(wrapper.find('[data-tour-id="bm.inventory.dashboard.valuation"]').exists()).toBe(true);

    // Super Admin specific elements are absent in Branch Manager view
    expect(wrapper.find('[data-tour-id="sa.inventory.dashboard.kpis"]').exists()).toBe(false);
  });

  it('4. dapStore.startContinuousTour(/inventory/dashboard) steps through all 4 sections with Next and Prev (standalone)', () => {
    const tourResult = dapStore.startContinuousTour('/inventory/dashboard', { standalone: true });
    expect(tourResult.success).toBe(true);
    expect(dapStore.isActive).toBe(true);
    expect(dapStore.currentMission.code).toBe('BM-INV-DASH');
    expect(dapStore.totalStepsInCurrentMission).toBe(4);

    // Step 1: Header & Custody Overview
    expect(dapStore.currentStepIndex).toBe(0);
    expect(dapStore.currentStep.targetId).toBe('bm.inventory.dashboard.header');
    expect(dapStore.isFirstStep).toBe(true);
    expect(dapStore.isFinalStep).toBe(false);

    // Step 2: 4 Top KPIs
    dapStore.nextStep();
    expect(dapStore.currentStepIndex).toBe(1);
    expect(dapStore.currentStep.targetId).toBe('bm.inventory.dashboard.kpis');
    expect(dapStore.isFirstStep).toBe(false);
    expect(dapStore.isFinalStep).toBe(false);

    // Step 3: Status Grid
    dapStore.nextStep();
    expect(dapStore.currentStepIndex).toBe(2);
    expect(dapStore.currentStep.targetId).toBe('bm.inventory.dashboard.status-grid');
    expect(dapStore.isFirstStep).toBe(false);
    expect(dapStore.isFinalStep).toBe(false);

    // Step 4: Valuation & Governance Policy
    dapStore.nextStep();
    expect(dapStore.currentStepIndex).toBe(3);
    expect(dapStore.currentStep.targetId).toBe('bm.inventory.dashboard.valuation');
    expect(dapStore.isFirstStep).toBe(false);
    expect(dapStore.isFinalStep).toBe(true);

    // Navigate backwards
    dapStore.prevStep();
    expect(dapStore.currentStepIndex).toBe(2);
    expect(dapStore.currentStep.targetId).toBe('bm.inventory.dashboard.status-grid');

    dapStore.prevStep();
    expect(dapStore.currentStepIndex).toBe(1);
    expect(dapStore.currentStep.targetId).toBe('bm.inventory.dashboard.kpis');

    dapStore.prevStep();
    expect(dapStore.currentStepIndex).toBe(0);
    expect(dapStore.currentStep.targetId).toBe('bm.inventory.dashboard.header');

    // Finish tour from final step
    dapStore.goToStep(3);
    dapStore.nextStep();
    expect(dapStore.isActive).toBe(false);
  });

  it('5. Manual control: Tour execution never mutates inventory data', () => {
    const initialStats = store.getInventoryStats('Peshawar');
    const initialProductCount = store.products.length;

    dapStore.startContinuousTour('/inventory/dashboard');

    for (let i = 0; i < 4; i++) {
      dapStore.goToStep(i);
      const currentStats = store.getInventoryStats('Peshawar');
      expect(currentStats.available).toBe(initialStats.available);
      expect(currentStats.total).toBe(initialStats.total);
      expect(store.products.length).toBe(initialProductCount);
    }
  });
});
