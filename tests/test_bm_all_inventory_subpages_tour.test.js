import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';

vi.mock('vue-router', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useRouter: () => ({ push: vi.fn(), currentRoute: { value: { path: '/inventory/dashboard' } } }),
    useRoute: () => ({ query: {}, path: '/inventory/dashboard' })
  };
});

import { store } from '@/store.js';
import { dapStore } from '@/stores/dapStore.js';
import { getPageTour, getMissionById } from '@/tour/content/catalog.js';
import { CURRICULUM_SEEDED_TARGETS } from '@/tour/curriculumTargets.js';

// Vue Components
import StockByProduct from '@/views/inventory/StockByProduct.vue';
import SerializedUnits from '@/views/inventory/SerializedUnits.vue';
import StockRequests from '@/views/inventory/StockRequests.vue';
import CreateStockRequest from '@/views/inventory/CreateStockRequest.vue';
import Transfers from '@/views/inventory/Transfers.vue';
import CreateTransfer from '@/views/inventory/CreateTransfer.vue';
import InboundDeliveries from '@/views/inventory/InboundDeliveries.vue';
import StockAdjustments from '@/views/inventory/StockAdjustments.vue';
import CreateAdjustmentRequest from '@/views/inventory/CreateAdjustmentRequest.vue';
import CycleCounts from '@/views/inventory/CycleCounts.vue';
import CreateCycleCount from '@/views/inventory/CreateCycleCount.vue';
import StockMovementLedger from '@/views/inventory/StockMovementLedger.vue';
import Quarantine from '@/views/inventory/Quarantine.vue';
import CreateQuarantineRecord from '@/views/inventory/CreateQuarantineRecord.vue';

describe('Branch Manager — ALL 10 Inventory Subpages Guided Tour Suite', () => {
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

  const inventorySubpages = [
    { route: '/inventory/dashboard', code: 'BM-INV-DASH', minSteps: 4 },
    { route: '/inventory/stock-by-product', code: 'BM-INV-STOCK', minSteps: 5 },
    { route: '/inventory/serialized-units', code: 'BM-INV-UNITS', minSteps: 5 },
    { route: '/inventory/stock-requests', code: 'BM-INV-REQ', minSteps: 13 },
    { route: '/inventory/transfers', code: 'BM-INV-TRANS', minSteps: 13 },
    { route: '/inventory/inbound-deliveries', code: 'BM-INV-INBOUND', minSteps: 6 },
    { route: '/inventory/stock-adjustments', code: 'BM-INV-ADJ', minSteps: 13 },
    { route: '/inventory/cycle-counts', code: 'BM-INV-CYCLE', minSteps: 12 },
    { route: '/inventory/stock-movement-ledger', code: 'BM-INV-LEDGER', minSteps: 5 },
    { route: '/inventory/quarantine', code: 'BM-INV-QUARANTINE', minSteps: 13 },
  ];

  it('1. Role isolation & resolution: All 10 Inventory routes resolve to dedicated Branch Manager tours', () => {
    for (const subpage of inventorySubpages) {
      const tour = getPageTour(subpage.route, 'Branch Manager');
      expect(tour, `Route ${subpage.route} must return a dedicated tour`).toBeDefined();
      expect(tour.code).toBe(subpage.code);
      expect(tour.workspace).toBe('Branch Manager');
      expect(tour.steps.length).toBeGreaterThanOrEqual(subpage.minSteps);

      // Verify mission can be resolved by ID
      const byId = getMissionById(tour.id);
      expect(byId).toBeDefined();
      expect(byId.code).toBe(subpage.code);

      // Verify Super Admin does not receive Branch Manager custom page tours
      const saTour = getPageTour(subpage.route, 'Super Admin');
      if (saTour) {
        expect(saTour.code).not.toBe(subpage.code);
      }
    }
  });

  it('2. Central Target Registry: All Inventory tour targets are registered and follow 4-part semantic grammar', () => {
    for (const subpage of inventorySubpages) {
      const tour = getPageTour(subpage.route, 'Branch Manager');
      for (const step of tour.steps) {
        const targetId = step.targetId;
        expect(targetId, `Step ${step.id} has no targetId`).toBeTruthy();

        // 4-part grammar: <workspace>.<domain>.<surface>.<element-path>
        const parts = targetId.split('.');
        expect(parts.length, `Target ${targetId} must have 4 segments`).toBe(4);
        expect(parts[0]).toMatch(/^(bm|shared|sa)$/);

        // Registry lookup
        const regMatch = CURRICULUM_SEEDED_TARGETS.find(t => t.targetId === targetId);
        expect(regMatch, `Target ${targetId} must exist in CURRICULUM_SEEDED_TARGETS`).toBeDefined();
        expect(regMatch.workspace).toBe('Branch Manager');
        expect(regMatch.readinessClass).toBe('ROUTE_MOUNT_TARGET');
      }
    }
  });

  it('3. Read-only subpages mount with all tour targets in DOM', () => {
    // 3a. Stock by Product
    const wStock = mount(StockByProduct, {
      global: { mocks: { $router: { push: () => {} }, $route: { path: '/inventory/stock-by-product' } } }
    });
    expect(wStock.find('[data-tour-id="bm.inventory.stock.header"]').exists()).toBe(true);
    expect(wStock.find('[data-tour-id="bm.inventory.stock.kpis"]').exists()).toBe(true);
    expect(wStock.find('[data-tour-id="bm.inventory.stock.filters"]').exists()).toBe(true);
    expect(wStock.find('[data-tour-id="bm.inventory.stock.table"]').exists()).toBe(true);
    expect(wStock.find('[data-tour-id="bm.inventory.stock.export-btn"]').exists()).toBe(true);

    // 3b. Serialized Units
    const wUnits = mount(SerializedUnits, {
      global: { mocks: { $router: { push: () => {} }, $route: { path: '/inventory/serialized-units' } } }
    });
    expect(wUnits.find('[data-tour-id="bm.inventory.units.header"]').exists()).toBe(true);
    expect(wUnits.find('[data-tour-id="bm.inventory.units.kpis"]').exists()).toBe(true);
    expect(wUnits.find('[data-tour-id="bm.inventory.units.filters"]').exists()).toBe(true);
    expect(wUnits.find('[data-tour-id="bm.inventory.units.table"]').exists()).toBe(true);
    expect(wUnits.find('[data-tour-id="bm.inventory.units.export-btn"]').exists()).toBe(true);

    // 3c. Inbound Deliveries
    const wInbound = mount(InboundDeliveries, {
      global: { mocks: { $router: { push: () => {} }, $route: { path: '/inventory/inbound-deliveries' } } }
    });
    expect(wInbound.find('[data-tour-id="bm.inventory.inbound.header"]').exists()).toBe(true);
    expect(wInbound.find('[data-tour-id="bm.inventory.inbound.receive-btn"]').exists()).toBe(true);
    expect(wInbound.find('[data-tour-id="bm.inventory.inbound.kpis"]').exists()).toBe(true);
    expect(wInbound.find('[data-tour-id="bm.inventory.inbound.filters"]').exists()).toBe(true);
    expect(wInbound.find('[data-tour-id="bm.inventory.inbound.export-btn"]').exists()).toBe(true);
    expect(wInbound.find('[data-tour-id="bm.inventory.inbound.table"]').exists()).toBe(true);

    // 3d. Stock Movement Ledger
    const wLedger = mount(StockMovementLedger, {
      global: { mocks: { $router: { push: () => {} }, $route: { path: '/inventory/stock-movement-ledger' } } }
    });
    expect(wLedger.find('[data-tour-id="bm.inventory.ledger.header"]').exists()).toBe(true);
    expect(wLedger.find('[data-tour-id="bm.inventory.ledger.kpis"]').exists()).toBe(true);
    expect(wLedger.find('[data-tour-id="bm.inventory.ledger.filters"]').exists()).toBe(true);
    expect(wLedger.find('[data-tour-id="bm.inventory.ledger.export-btn"]').exists()).toBe(true);
    expect(wLedger.find('[data-tour-id="bm.inventory.ledger.table"]').exists()).toBe(true);
  });

  it('4. Subpages with Modals: Main page targets and Modal targets exist', () => {
    // 4a. Stock Requests & Create Modal
    const wReq = mount(StockRequests, {
      global: { mocks: { $router: { push: () => {} }, $route: { path: '/inventory/stock-requests' } } }
    });
    expect(wReq.find('[data-tour-id="bm.inventory.requests.header"]').exists()).toBe(true);
    expect(wReq.find('[data-tour-id="bm.inventory.requests.kpis"]').exists()).toBe(true);
    expect(wReq.find('[data-tour-id="bm.inventory.requests.filters"]').exists()).toBe(true);
    expect(wReq.find('[data-tour-id="bm.inventory.requests.table"]').exists()).toBe(true);
    expect(wReq.find('[data-tour-id="bm.inventory.requests.create-btn"]').exists()).toBe(true);

    const wCreateReq = mount(CreateStockRequest, {
      props: { isModal: true },
      global: { mocks: { $router: { push: () => {} } } }
    });
    expect(wCreateReq.find('[data-tour-id="bm.inventory.requests.modal"]').exists()).toBe(true);
    expect(wCreateReq.find('[data-tour-id="bm.inventory.requests.branch"]').exists()).toBe(true);
    expect(wCreateReq.find('[data-tour-id="bm.inventory.requests.product"]').exists()).toBe(true);
    expect(wCreateReq.find('[data-tour-id="bm.inventory.requests.quantity"]').exists()).toBe(true);
    expect(wCreateReq.find('[data-tour-id="bm.inventory.requests.urgency"]').exists()).toBe(true);
    expect(wCreateReq.find('[data-tour-id="bm.inventory.requests.demand"]').exists()).toBe(true);
    expect(wCreateReq.find('[data-tour-id="bm.inventory.requests.reason"]').exists()).toBe(true);
    expect(wCreateReq.find('[data-tour-id="bm.inventory.requests.submit-btn"]').exists()).toBe(true);

    // 4b. Transfers & Create Modal
    const wTrans = mount(Transfers, {
      global: { mocks: { $router: { push: () => {} }, $route: { path: '/inventory/transfers' } } }
    });
    expect(wTrans.find('[data-tour-id="bm.inventory.transfers.header"]').exists()).toBe(true);
    expect(wTrans.find('[data-tour-id="bm.inventory.transfers.kpis"]').exists()).toBe(true);
    expect(wTrans.find('[data-tour-id="bm.inventory.transfers.filters"]').exists()).toBe(true);
    expect(wTrans.find('[data-tour-id="bm.inventory.transfers.table"]').exists()).toBe(true);
    expect(wTrans.find('[data-tour-id="bm.inventory.transfers.create-btn"]').exists()).toBe(true);

    const wCreateTrans = mount(CreateTransfer, {
      props: { isModal: true },
      global: { mocks: { $router: { push: () => {} } } }
    });
    expect(wCreateTrans.find('[data-tour-id="bm.inventory.transfers.modal"]').exists()).toBe(true);
    expect(wCreateTrans.find('[data-tour-id="bm.inventory.transfers.origin"]').exists()).toBe(true);
    expect(wCreateTrans.find('[data-tour-id="bm.inventory.transfers.destination"]').exists()).toBe(true);
    expect(wCreateTrans.find('[data-tour-id="bm.inventory.transfers.product"]').exists()).toBe(true);
    expect(wCreateTrans.find('[data-tour-id="bm.inventory.transfers.units"]').exists()).toBe(true);
    expect(wCreateTrans.find('[data-tour-id="bm.inventory.transfers.carrier"]').exists()).toBe(true);
    expect(wCreateTrans.find('[data-tour-id="bm.inventory.transfers.gatepass"]').exists()).toBe(true);
    expect(wCreateTrans.find('[data-tour-id="bm.inventory.transfers.submit-btn"]').exists()).toBe(true);

    // 4c. Stock Adjustments & Create Modal
    const wAdj = mount(StockAdjustments, {
      global: { mocks: { $router: { push: () => {} }, $route: { path: '/inventory/stock-adjustments' } } }
    });
    expect(wAdj.find('[data-tour-id="bm.inventory.adjustments.header"]').exists()).toBe(true);
    expect(wAdj.find('[data-tour-id="bm.inventory.adjustments.kpis"]').exists()).toBe(true);
    expect(wAdj.find('[data-tour-id="bm.inventory.adjustments.filters"]').exists()).toBe(true);
    expect(wAdj.find('[data-tour-id="bm.inventory.adjustments.table"]').exists()).toBe(true);
    expect(wAdj.find('[data-tour-id="bm.inventory.adjustments.create-btn"]').exists()).toBe(true);

    const wCreateAdj = mount(CreateAdjustmentRequest, {
      props: { isModal: true },
      global: { mocks: { $router: { push: () => {} } } }
    });
    expect(wCreateAdj.find('[data-tour-id="bm.inventory.adjustments.modal"]').exists()).toBe(true);
    expect(wCreateAdj.find('[data-tour-id="bm.inventory.adjustments.product-unit"]').exists()).toBe(true);
    expect(wCreateAdj.find('[data-tour-id="bm.inventory.adjustments.existing-state"]').exists()).toBe(true);
    expect(wCreateAdj.find('[data-tour-id="bm.inventory.adjustments.corrected-state"]').exists()).toBe(true);
    expect(wCreateAdj.find('[data-tour-id="bm.inventory.adjustments.reason"]').exists()).toBe(true);
    expect(wCreateAdj.find('[data-tour-id="bm.inventory.adjustments.evidence"]').exists()).toBe(true);
    expect(wCreateAdj.find('[data-tour-id="bm.inventory.adjustments.branch"]').exists()).toBe(true);
    expect(wCreateAdj.find('[data-tour-id="bm.inventory.adjustments.submit-btn"]').exists()).toBe(true);

    // 4d. Cycle Counts & Create Modal
    const wCycle = mount(CycleCounts, {
      global: { mocks: { $router: { push: () => {} }, $route: { path: '/inventory/cycle-counts' } } }
    });
    expect(wCycle.find('[data-tour-id="bm.inventory.cycle.header"]').exists()).toBe(true);
    expect(wCycle.find('[data-tour-id="bm.inventory.cycle.kpis"]').exists()).toBe(true);
    expect(wCycle.find('[data-tour-id="bm.inventory.cycle.filters"]').exists()).toBe(true);
    expect(wCycle.find('[data-tour-id="bm.inventory.cycle.table"]').exists()).toBe(true);
    expect(wCycle.find('[data-tour-id="bm.inventory.cycle.create-btn"]').exists()).toBe(true);

    const wCreateCycle = mount(CreateCycleCount, {
      props: { isModal: true },
      global: { mocks: { $router: { push: () => {} } } }
    });
    expect(wCreateCycle.find('[data-tour-id="bm.inventory.cycle.modal"]').exists()).toBe(true);
    expect(wCreateCycle.find('[data-tour-id="bm.inventory.cycle.name"]').exists()).toBe(true);
    expect(wCreateCycle.find('[data-tour-id="bm.inventory.cycle.scope"]').exists()).toBe(true);
    expect(wCreateCycle.find('[data-tour-id="bm.inventory.cycle.assigned-to"]').exists()).toBe(true);
    expect(wCreateCycle.find('[data-tour-id="bm.inventory.cycle.expected-units"]').exists()).toBe(true);
    expect(wCreateCycle.find('[data-tour-id="bm.inventory.cycle.branch"]').exists()).toBe(true);
    expect(wCreateCycle.find('[data-tour-id="bm.inventory.cycle.submit-btn"]').exists()).toBe(true);

    // 4e. Quarantine & Create Modal
    const wQuar = mount(Quarantine, {
      global: { mocks: { $router: { push: () => {} }, $route: { path: '/inventory/quarantine' } } }
    });
    expect(wQuar.find('[data-tour-id="bm.inventory.quarantine.header"]').exists()).toBe(true);
    expect(wQuar.find('[data-tour-id="bm.inventory.quarantine.kpis"]').exists()).toBe(true);
    expect(wQuar.find('[data-tour-id="bm.inventory.quarantine.filters"]').exists()).toBe(true);
    expect(wQuar.find('[data-tour-id="bm.inventory.quarantine.table"]').exists()).toBe(true);
    expect(wQuar.find('[data-tour-id="bm.inventory.quarantine.create-btn"]').exists()).toBe(true);

    const wCreateQuar = mount(CreateQuarantineRecord, {
      props: { isModal: true },
      global: { mocks: { $router: { push: () => {} } } }
    });
    expect(wCreateQuar.find('[data-tour-id="bm.inventory.quarantine.modal"]').exists()).toBe(true);
    expect(wCreateQuar.find('[data-tour-id="bm.inventory.quarantine.branch"]').exists()).toBe(true);
    expect(wCreateQuar.find('[data-tour-id="bm.inventory.quarantine.unit"]').exists()).toBe(true);
    expect(wCreateQuar.find('[data-tour-id="bm.inventory.quarantine.product"]').exists()).toBe(true);
    expect(wCreateQuar.find('[data-tour-id="bm.inventory.quarantine.condition"]').exists()).toBe(true);
    expect(wCreateQuar.find('[data-tour-id="bm.inventory.quarantine.status"]').exists()).toBe(true);
    expect(wCreateQuar.find('[data-tour-id="bm.inventory.quarantine.decision"]').exists()).toBe(true);
    expect(wCreateQuar.find('[data-tour-id="bm.inventory.quarantine.submit-btn"]').exists()).toBe(true);
  });

  it('5. Zero automatic execution: Tour never auto-mutates data or auto-clicks business buttons', () => {
    for (const subpage of inventorySubpages) {
      const tour = getPageTour(subpage.route, 'Branch Manager');
      for (const step of tour.steps) {
        // Must be read-only or explicit practice
        expect(step.mutationRisk).toBe('RISK_0_READ_ONLY');
        if (step.mode === 'PRACTICE') {
          // Practice is strictly limited to opening a dialog
          expect(step.actionType).toBe('OPEN_MODAL');
        }
      }
    }
  });

  it('6. Step navigation: startContinuousTour works smoothly on each Inventory subpage (standalone)', () => {
    for (const subpage of inventorySubpages) {
      dapStore.stopDAP();
      const res = dapStore.startContinuousTour(subpage.route, { standalone: true });
      expect(res.success).toBe(true);
      expect(dapStore.isActive).toBe(true);
      expect(dapStore.currentMission.code).toBe(subpage.code);

      // Verify first step
      expect(dapStore.currentStepIndex).toBe(0);
      expect(dapStore.isFirstStep).toBe(true);

      // Verify advance
      dapStore.nextStep();
      expect(dapStore.currentStepIndex).toBe(1);

      // Verify rewind
      dapStore.prevStep();
      expect(dapStore.currentStepIndex).toBe(0);
    }
  });
});
