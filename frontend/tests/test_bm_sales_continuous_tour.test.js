import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import router from '@/router';
import { store } from '@/store.js';
import { dapStore } from '@/stores/dapStore.js';
import { BM_SALES_SUBPAGE_ROUTES, branchManagerPageTours } from '@/tour/content/catalog.js';
import { CURRICULUM_SEEDED_TARGETS } from '@/tour/curriculumTargets.js';

describe('Branch Manager — All 11 Sales & Customers Subpages Continuous Guided Tour', () => {
  let pushSpy;
  let pushedRoutes = [];

  beforeEach(() => {
    store.currentUser = {
      role: 'Branch Manager',
      name: 'Tariq Khan',
      branchName: 'Peshawar',
      branchCode: 'PEW',
      isSuperAdmin: false,
      isAuthenticated: true
    };
    dapStore.resetAllProgress();
    dapStore.stopDAP();
    pushedRoutes = [];
    pushSpy = vi.spyOn(router, 'push').mockImplementation((target) => {
      pushedRoutes.push(target);
      return Promise.resolve();
    });
  });

  afterEach(() => {
    if (pushSpy) pushSpy.mockRestore();
    dapStore.resetAllProgress();
    dapStore.stopDAP();
  });

  it('1. Requirement 1 & 2: Identifies and chains all 11 Sales & Customers subpages in exact navigation order', () => {
    const res = dapStore.startSalesContinuousTour();
    expect(res.success).toBe(true);
    expect(dapStore.isActive).toBe(true);
    expect(dapStore.isSalesChainActive).toBe(true);
    expect(dapStore.isInventoryChainActive).toBe(false);
    expect(dapStore.currentSalesSubpageIndex).toBe(0);
    expect(dapStore.currentMission.route).toBe('/sales/dashboard');
    expect(dapStore.currentMission.code).toBe('BM-SALES-DASH');

    // Verify exact 11 subpages in order
    expect(BM_SALES_SUBPAGE_ROUTES).toEqual([
      '/sales/dashboard',
      '/sales/quotations',
      '/sales/orders',
      '/sales/invoices',
      '/sales/payments',
      '/sales/delivery',
      '/sales/returns',
      '/sales/customers',
      '/sales/leads',
      '/sales/follow-ups',
      '/sales/custom-orders'
    ]);
    expect(BM_SALES_SUBPAGE_ROUTES.length).toBe(11);

    // Total steps across all 11 subpages (4 + 10 * 5 = 54)
    const expectedTotalSteps = BM_SALES_SUBPAGE_ROUTES.reduce((sum, r) => {
      return sum + branchManagerPageTours[r].steps.length;
    }, 0);
    expect(dapStore.totalSystemSteps).toBe(expectedTotalSteps);
    expect(expectedTotalSteps).toBe(54);
  });

  it('2. Requirement 3: First 10 subpages do NOT finish on last step; Next Page navigates to next subpage', () => {
    dapStore.startSalesContinuousTour();

    for (let subIdx = 0; subIdx < BM_SALES_SUBPAGE_ROUTES.length - 1; subIdx++) {
      const currentRoute = BM_SALES_SUBPAGE_ROUTES[subIdx];
      const nextRoute = BM_SALES_SUBPAGE_ROUTES[subIdx + 1];
      const totalSteps = branchManagerPageTours[currentRoute].steps.length;

      // Advance to the last step of this subpage
      dapStore.goToStep(totalSteps - 1);
      expect(dapStore.currentStepIndex).toBe(totalSteps - 1);

      // Must NOT finish on subpage boundary
      expect(dapStore.isFinalStep, `Subpage ${currentRoute} must not finish on last step`).toBe(false);
      expect(dapStore.isSubpageBoundaryStep, `Subpage ${currentRoute} last step must be a boundary step`).toBe(true);
      expect(dapStore.nextSubpageRoute).toBe(nextRoute);

      // Click Next Page
      dapStore.nextStep();

      // Must have navigated to the next subpage and continued tour
      expect(dapStore.isActive).toBe(true);
      expect(dapStore.currentSalesSubpageIndex).toBe(subIdx + 1);
      expect(dapStore.currentMission.route).toBe(nextRoute);
      expect(dapStore.currentStepIndex).toBe(0);
      expect(pushedRoutes).toContain(nextRoute);
    }
  });

  it('3. Requirement 3: ONLY the 11th subpage (/sales/custom-orders) shows Finish on its last step and completes tour', () => {
    dapStore.startSalesContinuousTour();

    // Jump to the 11th subpage: /sales/custom-orders (index 10)
    dapStore.currentSalesSubpageIndex = 10;
    dapStore.activePageMission = branchManagerPageTours['/sales/custom-orders'];
    dapStore.currentStepIndex = 0;

    const customOrdersTotalSteps = branchManagerPageTours['/sales/custom-orders'].steps.length;
    expect(customOrdersTotalSteps).toBe(5);

    // On steps 0 through 3: isFinalStep must be false
    for (let i = 0; i < customOrdersTotalSteps - 1; i++) {
      dapStore.goToStep(i);
      expect(dapStore.isFinalStep).toBe(false);
      expect(dapStore.isSubpageBoundaryStep).toBe(false);
    }

    // On step 4 (the 5th step, final step of Custom Orders): isFinalStep MUST be true!
    dapStore.goToStep(customOrdersTotalSteps - 1);
    expect(dapStore.isFinalStep).toBe(true);
    expect(dapStore.isSubpageBoundaryStep).toBe(false);

    // Clicking Finish ends the tour cleanly
    dapStore.nextStep();
    expect(dapStore.isActive).toBe(false);
    expect(dapStore.isSalesChainActive).toBe(false);
    expect(dapStore.activePageMission).toBe(null);
  });

  it('4. Requirement 3: Previous Page on step 0 returns to the last step of the previous subpage', () => {
    // Start on Subpage 1: /sales/quotations
    dapStore.startContinuousTour('/sales/quotations');
    expect(dapStore.currentSalesSubpageIndex).toBe(1);
    expect(dapStore.currentStepIndex).toBe(0);

    // Because there is a previous subpage (/sales/dashboard), isFirstStep must be false
    expect(dapStore.isFirstStep).toBe(false);
    expect(dapStore.isSubpageInitialStep).toBe(true);

    // Clicking Previous Page must rewind to /sales/dashboard's last step (step 3)
    dapStore.prevStep();
    expect(dapStore.currentSalesSubpageIndex).toBe(0);
    expect(dapStore.currentMission.route).toBe('/sales/dashboard');
    expect(dapStore.currentStepIndex).toBe(3);
    expect(pushedRoutes).toContain('/sales/dashboard');

    // On step 0 of /sales/dashboard (the absolute beginning of Sales), isFirstStep is true
    dapStore.goToStep(0);
    expect(dapStore.isFirstStep).toBe(true);
    expect(dapStore.isSubpageInitialStep).toBe(false);
  });

  it('5. Standalone mode: Individual page tours remain accessible when options.standalone is true', () => {
    const tourResult = dapStore.startContinuousTour('/sales/quotations', { standalone: true });
    expect(tourResult.success).toBe(true);
    expect(dapStore.isActive).toBe(true);
    expect(dapStore.isSalesChainActive).toBe(false); // Standalone, not chained!
    expect(dapStore.totalStepsInCurrentMission).toBe(5);

    // On step 5 of Quotations in standalone mode, it DOES finish!
    dapStore.goToStep(4);
    expect(dapStore.isFinalStep).toBe(true);
    expect(dapStore.isSubpageBoundaryStep).toBe(false);

    dapStore.nextStep();
    expect(dapStore.isActive).toBe(false);
  });

  it('6. Non-destructive safety & exit: stopDAP cleans up state cleanly with zero loops or rogue navigation', () => {
    dapStore.startSalesContinuousTour();
    dapStore.goToStep(2);
    expect(dapStore.isActive).toBe(true);

    // Reset captured pushed routes before closing
    pushedRoutes.length = 0;

    // User closes tour
    dapStore.stopDAP();
    expect(dapStore.isActive).toBe(false);
    expect(dapStore.isSalesChainActive).toBe(false);
    expect(dapStore.activePageMission).toBe(null);

    // Ensure no unexpected page navigation was pushed
    expect(pushedRoutes.length).toBe(0);
  });

  it('7. Role isolation: Super Admin does not engage Branch Manager sales chain', () => {
    store.currentUser = {
      role: 'Super Admin',
      name: 'Admin User',
      isSuperAdmin: true,
      isAuthenticated: true
    };

    dapStore.startContinuousTour('/sales/dashboard');
    expect(dapStore.isSalesChainActive).toBe(false);
    expect(dapStore.currentMission.workspace).not.toBe('Branch Manager');
  });

  it('8. Target completeness & safety: All 54 steps across all 11 Sales tours have valid, safe targets', () => {
    const validTargetIds = new Set(CURRICULUM_SEEDED_TARGETS.map(t => t.targetId));

    BM_SALES_SUBPAGE_ROUTES.forEach((route) => {
      const tour = branchManagerPageTours[route];
      expect(tour, `Tour definition for ${route} must exist`).toBeDefined();
      expect(tour.steps.length).toBeGreaterThanOrEqual(4);

      tour.steps.forEach((step) => {
        expect(validTargetIds.has(step.targetId), `Step ${step.id} target ${step.targetId} must be in CURRICULUM_SEEDED_TARGETS`).toBe(true);
        expect(step.mutationRisk).toBe('RISK_0_READ_ONLY');
        expect(step.mode).toBe('OBSERVE');
      });
    });
  });
});
