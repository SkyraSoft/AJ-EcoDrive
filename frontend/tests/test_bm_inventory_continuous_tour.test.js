import { describe, it, expect, beforeEach, vi } from 'vitest';
import router from '@/router';
import { store } from '@/store.js';
import { dapStore } from '@/stores/dapStore.js';
import { BM_INVENTORY_SUBPAGE_ROUTES, branchManagerPageTours } from '@/tour/content/catalog.js';

describe('Branch Manager — All 10 Inventory Subpages Continuous Guided Tour', () => {
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
  });

  it('1. Requirement 1 & 4: Starts continuous guided tour from My Inventory and chains through all 10 subpages', () => {
    const pushedRoutes = [];
    const pushSpy = vi.spyOn(router, 'push').mockImplementation((target) => {
      pushedRoutes.push(target);
      return Promise.resolve();
    });

    const res = dapStore.startContinuousTour('/inventory/dashboard');
    expect(res.success).toBe(true);
    expect(dapStore.isActive).toBe(true);
    expect(dapStore.isInventoryChainActive).toBe(true);
    expect(dapStore.currentInventorySubpageIndex).toBe(0);
    expect(dapStore.currentMission.route).toBe('/inventory/dashboard');
    expect(dapStore.currentMission.code).toBe('BM-INV-DASH');

    // Total steps across all 10 subpages
    const expectedTotalSteps = BM_INVENTORY_SUBPAGE_ROUTES.reduce((sum, r) => {
      return sum + branchManagerPageTours[r].steps.length;
    }, 0);
    expect(dapStore.totalSystemSteps).toBe(expectedTotalSteps);
    expect(expectedTotalSteps).toBe(89);

    pushSpy.mockRestore();
  });

  it('2. Requirement 2 & 3: First 9 subpages do NOT finish on last step; Next Page navigates to next subpage', () => {
    const pushedRoutes = [];
    const pushSpy = vi.spyOn(router, 'push').mockImplementation((target) => {
      pushedRoutes.push(target);
      return Promise.resolve();
    });

    dapStore.startContinuousTour('/inventory/dashboard');

    for (let subIdx = 0; subIdx < BM_INVENTORY_SUBPAGE_ROUTES.length - 1; subIdx++) {
      const currentRoute = BM_INVENTORY_SUBPAGE_ROUTES[subIdx];
      const nextRoute = BM_INVENTORY_SUBPAGE_ROUTES[subIdx + 1];
      const totalSteps = branchManagerPageTours[currentRoute].steps.length;

      // Advance to the last step of this subpage
      dapStore.goToStep(totalSteps - 1);
      expect(dapStore.currentStepIndex).toBe(totalSteps - 1);

      // Must NOT be final step of tour!
      expect(dapStore.isFinalStep, `Subpage ${currentRoute} must not finish on last step`).toBe(false);
      expect(dapStore.isSubpageBoundaryStep, `Subpage ${currentRoute} last step must be a boundary step`).toBe(true);
      expect(dapStore.nextSubpageRoute).toBe(nextRoute);

      // Click Next Page
      dapStore.nextStep();

      // Must have navigated to the next subpage and continued tour
      expect(dapStore.isActive).toBe(true);
      expect(dapStore.currentInventorySubpageIndex).toBe(subIdx + 1);
      expect(dapStore.currentMission.route).toBe(nextRoute);
      expect(dapStore.currentStepIndex).toBe(0);
      expect(pushedRoutes).toContain(nextRoute);
    }

    pushSpy.mockRestore();
  });

  it('3. Requirement 5: ONLY the 10th subpage (Quarantine) shows Finish on its last step and completes tour', () => {
    const pushSpy = vi.spyOn(router, 'push').mockImplementation(() => Promise.resolve());

    dapStore.startContinuousTour('/inventory/dashboard');

    // Jump to the 10th subpage: /inventory/quarantine (index 9)
    dapStore.currentInventorySubpageIndex = 9;
    dapStore.activePageMission = branchManagerPageTours['/inventory/quarantine'];
    dapStore.currentStepIndex = 0;

    const quarantineTotalSteps = branchManagerPageTours['/inventory/quarantine'].steps.length;
    expect(quarantineTotalSteps).toBe(13);

    // On steps 0 through 11: isFinalStep must be false
    for (let i = 0; i < quarantineTotalSteps - 1; i++) {
      dapStore.goToStep(i);
      expect(dapStore.isFinalStep).toBe(false);
      expect(dapStore.isSubpageBoundaryStep).toBe(false);
    }

    // On step 12 (the 13th step, final step of Quarantine): isFinalStep MUST be true!
    dapStore.goToStep(quarantineTotalSteps - 1);
    expect(dapStore.isFinalStep).toBe(true);
    expect(dapStore.isSubpageBoundaryStep).toBe(false);

    // Clicking Finish ends the tour
    dapStore.nextStep();
    expect(dapStore.isActive).toBe(false);
    expect(dapStore.isInventoryChainActive).toBe(false);
    expect(dapStore.activePageMission).toBe(null);

    pushSpy.mockRestore();
  });

  it('4. Requirement 6: Previous Page on step 0 returns to the last step of the previous subpage', () => {
    const pushedRoutes = [];
    const pushSpy = vi.spyOn(router, 'push').mockImplementation((target) => {
      pushedRoutes.push(target);
      return Promise.resolve();
    });

    // Start on Subpage 1: /inventory/stock-by-product
    dapStore.startContinuousTour('/inventory/stock-by-product');
    expect(dapStore.currentInventorySubpageIndex).toBe(1);
    expect(dapStore.currentStepIndex).toBe(0);

    // Because there is a previous subpage (/inventory/dashboard), isFirstStep must be false
    expect(dapStore.isFirstStep).toBe(false);
    expect(dapStore.isSubpageInitialStep).toBe(true);

    // Clicking Previous Page must rewind to /inventory/dashboard's last step (step 3)
    dapStore.prevStep();
    expect(dapStore.currentInventorySubpageIndex).toBe(0);
    expect(dapStore.currentMission.route).toBe('/inventory/dashboard');
    expect(dapStore.currentStepIndex).toBe(3);
    expect(pushedRoutes).toContain('/inventory/dashboard');

    // On step 0 of /inventory/dashboard (the absolute beginning), isFirstStep is true
    dapStore.goToStep(0);
    expect(dapStore.isFirstStep).toBe(true);
    expect(dapStore.isSubpageInitialStep).toBe(false);

    pushSpy.mockRestore();
  });

  it('5. Requirement 9: Standalone page tours remain accessible when options.standalone is true', () => {
    const tourResult = dapStore.startContinuousTour('/inventory/dashboard', { standalone: true });
    expect(tourResult.success).toBe(true);
    expect(dapStore.isActive).toBe(true);
    expect(dapStore.isInventoryChainActive).toBe(false); // Standalone, not chained!
    expect(dapStore.totalStepsInCurrentMission).toBe(4);

    // On step 4 of My Inventory in standalone mode, it DOES finish!
    dapStore.goToStep(3);
    expect(dapStore.isFinalStep).toBe(true);
    expect(dapStore.isSubpageBoundaryStep).toBe(false);

    dapStore.nextStep();
    expect(dapStore.isActive).toBe(false);
  });

  it('6. Requirement 10: Tour exit / stopDAP cleans up state cleanly with zero loops or rogue navigation', () => {
    const pushedRoutes = [];
    const pushSpy = vi.spyOn(router, 'push').mockImplementation((target) => {
      pushedRoutes.push(target);
      return Promise.resolve();
    });

    dapStore.startContinuousTour('/inventory/dashboard');
    dapStore.goToStep(2);
    expect(dapStore.isActive).toBe(true);

    // Reset captured pushed routes before closing
    pushedRoutes.length = 0;

    // User closes tour
    dapStore.stopDAP();
    expect(dapStore.isActive).toBe(false);
    expect(dapStore.isInventoryChainActive).toBe(false);
    expect(dapStore.activePageMission).toBe(null);

    // Ensure no unexpected page navigation was pushed
    expect(pushedRoutes.length).toBe(0);

    pushSpy.mockRestore();
  });

  it('7. Requirement 8: Role isolation — Super Admin does not engage Branch Manager inventory chain', () => {
    store.currentUser = {
      role: 'Super Admin',
      name: 'Admin User',
      isSuperAdmin: true,
      isAuthenticated: true
    };

    dapStore.startContinuousTour('/inventory/dashboard');
    expect(dapStore.isInventoryChainActive).toBe(false);
    expect(dapStore.currentMission.workspace).not.toBe('Branch Manager');
  });
});
