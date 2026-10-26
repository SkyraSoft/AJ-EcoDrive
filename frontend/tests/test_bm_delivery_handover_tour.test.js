/**
 * AJ EcoDrive — Branch Manager Delivery / Handover Guided Tour Test Suite
 * Mission: BM-08 (Vehicle Handover & Invoicing on /sales/delivery)
 *
 * Verifies:
 * 1. BM-08 mission definition with 10 detailed steps.
 * 2. Step 1 highlights table overview.
 * 3. Step 2 highlights "Schedule Handover" button with OPEN_MODAL practice mode and postcondition.
 * 4. Steps 3-10 guide modal field-by-field (Order, Customer, Chassis, Time, Status, Checklist, Notes, Submit).
 * 5. DeliveryHandover.vue mounts with valid data-tour-id targets for table and schedule button.
 * 6. CreateDeliveryHandover.vue contains all semantic data-tour-id targets.
 * 7. Target resolver successfully resolves all BM-08 targets in the real DOM.
 * 8. Non-destructive safety invariants (no auto-click, no auto-submit, read-only exploration).
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createRouter, createMemoryHistory } from 'vue-router';
import { branchManagerMissions } from '@/tour/content/branchManager/branchManagerMissions.js';
import { getMissionsForRole, getPageTour } from '@/tour/content/catalog.js';
import { resolveTarget } from '@/tour/targetResolver.js';
import { TARGET_STATES } from '@/tour/targetRegistry.js';
import { dapStore } from '@/stores/dapStore.js';
import { store } from '@/store.js';
import DeliveryHandover from '@/views/sales/DeliveryHandover.vue';
import CreateDeliveryHandover from '@/views/sales/CreateDeliveryHandover.vue';

describe('BM-08 Guided Tour: Vehicle Handover & Invoicing (/sales/delivery)', () => {
  let router;

  beforeEach(() => {
    // Set user as authenticated Branch Manager for Peshawar Branch
    store.currentUser = {
      isAuthenticated: true,
      id: 'USR-PESH-001',
      name: 'Peshawar Branch Manager',
      email: 'bm.peshawar@ecodrive.pk',
      role: 'Branch Manager',
      branch: 'Peshawar',
      branchName: 'Peshawar',
      branchId: 'BR-PESH-001',
      isSuperAdmin: false,
      permissions: ['sales.view', 'sales.create', 'delivery.view', 'delivery.manage']
    };

    router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/sales/delivery', component: DeliveryHandover },
        { path: '/sales/orders', component: { template: '<div>Orders</div>' } },
        { path: '/dashboard', component: { template: '<div>Dashboard</div>' } },
      ]
    });

    document.body.innerHTML = '';
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  // =========================================================================
  // 1. MISSION STRUCTURE & METADATA AUDIT
  // =========================================================================
  it('registers BM-08 with exactly 10 comprehensive steps in branchManagerMissions and role catalog', () => {
    const bmMissions = getMissionsForRole('Branch Manager');
    const bm08 = bmMissions.find(m => m.code === 'BM-08');

    expect(bm08).toBeDefined();
    expect(bm08.route).toBe('/sales/delivery');
    expect(bm08.workspace).toBe('Branch Manager');
    expect(bm08.steps.length).toBe(10);
  });

  it('verifies Step 1 is a non-destructive table overview step', () => {
    const bm08 = branchManagerMissions.find(m => m.code === 'BM-08');
    const step1 = bm08.steps[0];

    expect(step1.id).toBe('bm-08-01');
    expect(step1.stepNumber).toBe(1);
    expect(step1.targetId).toBe('bm.sales.handover.table');
    expect(step1.mode).toBe('OBSERVE');
    expect(step1.trainingType).toBe('observe');
    expect(step1.route).toBe('/sales/delivery');
    expect(step1.mutationRisk).toBe('RISK_0_READ_ONLY');
    expect(step1.skippable).toBe(true);
  });

  it('verifies Step 2 is an interactive PRACTICE step targeting Schedule Handover button with OPEN_MODAL', () => {
    const bm08 = branchManagerMissions.find(m => m.code === 'BM-08');
    const step2 = bm08.steps[1];

    expect(step2.id).toBe('bm-08-02');
    expect(step2.stepNumber).toBe(2);
    expect(step2.targetId).toBe('bm.sales.handover.create-btn');
    expect(step2.mode).toBe('PRACTICE');
    expect(step2.trainingType).toBe('practice');
    expect(step2.actionType).toBe('OPEN_MODAL');
    expect(step2.expectedAction).toBe('CLICK');
    expect(step2.route).toBe('/sales/delivery');
    expect(step2.postconditionSelector).toContain('bm.sales.createhandover.modal');
    expect(step2.mutationRisk).toBe('RISK_1_UI_STATE_ONLY');
  });

  it('verifies Steps 3-10 provide field-by-field guidance inside CreateDeliveryHandover modal', () => {
    const bm08 = branchManagerMissions.find(m => m.code === 'BM-08');
    const expectedModalSequence = [
      { id: 'bm-08-03', targetId: 'bm.sales.createhandover.order-select', title: 'Order & Sale Reference' },
      { id: 'bm-08-04', targetId: 'bm.sales.createhandover.customer', title: 'Customer Full Name' },
      { id: 'bm-08-05', targetId: 'bm.sales.createhandover.unit', title: 'Unit Chassis & VIN' },
      { id: 'bm-08-06', targetId: 'bm.sales.createhandover.scheduled', title: 'Scheduled Handover Time' },
      { id: 'bm-08-07', targetId: 'bm.sales.createhandover.status', title: 'Handover Status' },
      { id: 'bm-08-08', targetId: 'bm.sales.createhandover.checklist', title: 'Pre-delivery Verification Checklist' },
      { id: 'bm-08-09', targetId: 'bm.sales.createhandover.notes', title: 'Handover Notes & Instructions' },
      { id: 'bm-08-10', targetId: 'bm.sales.createhandover.submit-btn', title: 'Schedule / Finalize Handover' },
    ];

    for (const expected of expectedModalSequence) {
      const step = bm08.steps.find(s => s.id === expected.id);
      expect(step, `Step ${expected.id} must exist in BM-08`).toBeDefined();
      expect(step.targetId).toBe(expected.targetId);
      expect(step.route).toBe('/sales/delivery');
      expect(step.mode).toBe('OBSERVE');
      expect(step.trainingType).toBe('observe');
      expect(step.mutationRisk).toBe('RISK_0_READ_ONLY');
      expect(step.skippable).toBe(true);
    }
  });

  // =========================================================================
  // 2. COMPONENT DOM & TARGET RESOLUTION INTEGRITY
  // =========================================================================
  it('resolves bm.sales.handover.table and bm.sales.handover.create-btn on mounted DeliveryHandover.vue', async () => {
    const wrapper = mount(DeliveryHandover, {
      global: { plugins: [router] },
      attachTo: document.body
    });

    const tableEl = document.querySelector('[data-tour-id="bm.sales.handover.table"]');
    expect(tableEl, 'Delivery table must have data-tour-id="bm.sales.handover.table"').not.toBeNull();

    const createBtnEl = document.querySelector('[data-tour-id="bm.sales.handover.create-btn"]');
    expect(createBtnEl, 'Schedule Handover button must have data-tour-id="bm.sales.handover.create-btn"').not.toBeNull();

    // Mock client layout dimensions for JSDOM geometry evaluation
    Object.defineProperty(tableEl, 'getBoundingClientRect', {
      value: () => ({ top: 200, bottom: 600, left: 100, right: 900, width: 800, height: 400 }),
      configurable: true
    });
    Object.defineProperty(createBtnEl, 'getBoundingClientRect', {
      value: () => ({ top: 100, bottom: 140, left: 800, right: 950, width: 150, height: 40 }),
      configurable: true
    });

    const tableRes = resolveTarget('bm.sales.handover.table');
    expect(tableRes.state).toBe(TARGET_STATES.TARGET_VISIBLE);
    expect(tableRes.element).toBe(tableEl);

    const btnRes = resolveTarget('bm.sales.handover.create-btn');
    expect(btnRes.state).toBe(TARGET_STATES.TARGET_VISIBLE);
    expect(btnRes.element).toBe(createBtnEl);

    wrapper.unmount();
  });

  it('resolves all 8 modal form targets on mounted CreateDeliveryHandover.vue', async () => {
    const wrapper = mount(CreateDeliveryHandover, {
      props: { isModal: true },
      global: { plugins: [router] },
      attachTo: document.body
    });

    const modalEl = document.querySelector('[data-tour-id="bm.sales.createhandover.modal"]');
    expect(modalEl, 'Modal container must have data-tour-id="bm.sales.createhandover.modal"').not.toBeNull();

    const modalTargets = [
      'bm.sales.createhandover.order-select',
      'bm.sales.createhandover.order-input',
      'bm.sales.createhandover.customer',
      'bm.sales.createhandover.unit',
      'bm.sales.createhandover.scheduled',
      'bm.sales.createhandover.status',
      'bm.sales.createhandover.checklist',
      'bm.sales.createhandover.notes',
      'bm.sales.createhandover.submit-btn',
    ];

    for (const targetId of modalTargets) {
      const el = document.querySelector(`[data-tour-id="${targetId}"]`);
      expect(el, `Target ${targetId} must be present in mounted CreateDeliveryHandover DOM`).not.toBeNull();

      Object.defineProperty(el, 'getBoundingClientRect', {
        value: () => ({ top: 150, bottom: 200, left: 200, right: 500, width: 300, height: 50 }),
        configurable: true
      });

      const res = resolveTarget(targetId);
      expect(res.state, `Target ${targetId} must resolve to TARGET_VISIBLE`).toBe(TARGET_STATES.TARGET_VISIBLE);
      expect(res.element).toBe(el);
    }

    wrapper.unmount();
  });

  // =========================================================================
  // 3. INTERACTIVE MODAL OPENING & TOUR CONTINUITY
  // =========================================================================
  it('opens CreateDeliveryHandover modal when Schedule Handover button is clicked during tour', async () => {
    const wrapper = mount(DeliveryHandover, {
      global: { plugins: [router] },
      attachTo: document.body
    });

    // Verify modal is not initially present
    expect(wrapper.findComponent(CreateDeliveryHandover).exists()).toBe(false);

    // Find and click the Schedule Handover button
    const scheduleBtn = wrapper.find('[data-tour-id="bm.sales.handover.create-btn"]');
    expect(scheduleBtn.exists()).toBe(true);
    await scheduleBtn.trigger('click');

    // Verify modal is now mounted
    expect(wrapper.findComponent(CreateDeliveryHandover).exists()).toBe(true);

    const modalTarget = document.querySelector('[data-tour-id="bm.sales.createhandover.modal"]');
    expect(modalTarget).not.toBeNull();

    wrapper.unmount();
  });

  it('supports Learn This Page routing lookup for /sales/delivery for Branch Manager', () => {
    const pageTour = getPageTour('/sales/delivery', 'Branch Manager');
    expect(pageTour).toBeDefined();
    expect(pageTour.code).toBe('BM-08');
    expect(pageTour.steps.length).toBe(10);
  });
});
