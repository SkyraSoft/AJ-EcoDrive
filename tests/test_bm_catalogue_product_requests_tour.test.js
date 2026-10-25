import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import ProductRequests from '@/views/catalogue/ProductRequests.vue';
import CreateProductRequest from '@/views/catalogue/CreateProductRequest.vue';
import { store } from '@/store.js';
import { dapStore } from '@/stores/dapStore.js';
import { getPageTour, getMissionById } from '@/tour/content/catalog.js';
import { CURRICULUM_SEEDED_TARGETS } from '@/tour/curriculumTargets.js';

describe('Branch Manager — Catalogue › Product Requests Guided Tour Suite', () => {
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

  it('1. Enforces strict role isolation: Branch Manager on /catalogue/requests receives BM-CAT-REQ', () => {
    const bmTour = getPageTour('/catalogue/requests', 'Branch Manager');
    expect(bmTour).toBeDefined();
    expect(bmTour.id).toBe('bm-page-catalogue-requests');
    expect(bmTour.code).toBe('BM-CAT-REQ');
    expect(bmTour.workspace).toBe('Branch Manager');
    expect(bmTour.route).toBe('/catalogue/requests');
    expect(bmTour.steps.length).toBe(14);

    // Verify lookup by ID
    const byId = getMissionById('bm-page-catalogue-requests');
    expect(byId).toBeDefined();
    expect(byId.code).toBe('BM-CAT-REQ');

    // Super Admin does not receive BM-CAT-REQ
    const saTour = getPageTour('/catalogue/requests', 'Super Admin');
    expect(saTour?.id).not.toBe('bm-page-catalogue-requests');
  });

  it('2. Registers all 17 Branch Manager Product Requests tour targets in curriculum targets catalog', () => {
    const expectedTargets = [
      'bm.catalogue.requests.kpi-cards',
      'bm.catalogue.requests.filters',
      'bm.catalogue.requests.table',
      'bm.catalogue.requests.create-btn',
      'bm.catalogue.createrequest.modal',
      'bm.catalogue.createrequest.product-name',
      'bm.catalogue.createrequest.category',
      'bm.catalogue.createrequest.specifications',
      'bm.catalogue.createrequest.reference',
      'bm.catalogue.createrequest.demand',
      'bm.catalogue.createrequest.urgency',
      'bm.catalogue.createrequest.images',
      'bm.catalogue.createrequest.reason',
      'bm.catalogue.createrequest.notice',
      'bm.catalogue.createrequest.submit-btn',
      'bm.catalogue.createrequest.cancel-btn',
      'bm.catalogue.createrequest.close-btn'
    ];

    for (const tId of expectedTargets) {
      const match = CURRICULUM_SEEDED_TARGETS.find(t => t.targetId === tId);
      expect(match, `Target ${tId} must be registered in CURRICULUM_SEEDED_TARGETS`).toBeDefined();
      expect(match.workspace).toBe('Branch Manager');
      expect(match.route).toBe('/catalogue/requests');
      expect(match.readinessClass).toBe('ROUTE_MOUNT_TARGET');
    }
  });

  it('3. ProductRequests.vue mounts for Branch Manager with all 4 page tour target elements', () => {
    const wrapper = mount(ProductRequests, {
      global: {
        mocks: {
          $router: { push: () => {} },
          $route: { path: '/catalogue/requests' }
        },
        stubs: {
          Search: true,
          ChevronDown: true,
          Check: true,
          Plus: true,
          Pencil: true,
          CreateProductRequestModal: true
        }
      }
    });

    expect(wrapper.find('[data-tour-id="bm.catalogue.requests.kpi-cards"]').exists()).toBe(true);
    expect(wrapper.find('[data-tour-id="bm.catalogue.requests.filters"]').exists()).toBe(true);
    expect(wrapper.find('[data-tour-id="bm.catalogue.requests.table"]').exists()).toBe(true);
    expect(wrapper.find('[data-tour-id="bm.catalogue.requests.create-btn"]').exists()).toBe(true);
  });

  it('4. CreateProductRequest.vue mounts with all 13 modal tour target elements', () => {
    const wrapper = mount(CreateProductRequest, {
      global: {
        mocks: {
          $router: { push: () => {} },
          $route: { path: '/catalogue/requests' }
        },
        stubs: {
          X: true,
          Plus: true,
          Check: true,
          ChevronDown: true
        }
      }
    });

    expect(wrapper.find('[data-tour-id="bm.catalogue.createrequest.modal"]').exists()).toBe(true);
    expect(wrapper.find('[data-tour-id="bm.catalogue.createrequest.close-btn"]').exists()).toBe(true);
    expect(wrapper.find('[data-tour-id="bm.catalogue.createrequest.product-name"]').exists()).toBe(true);
    expect(wrapper.find('[data-tour-id="bm.catalogue.createrequest.category"]').exists()).toBe(true);
    expect(wrapper.find('[data-tour-id="bm.catalogue.createrequest.specifications"]').exists()).toBe(true);
    expect(wrapper.find('[data-tour-id="bm.catalogue.createrequest.reference"]').exists()).toBe(true);
    expect(wrapper.find('[data-tour-id="bm.catalogue.createrequest.demand"]').exists()).toBe(true);
    expect(wrapper.find('[data-tour-id="bm.catalogue.createrequest.urgency"]').exists()).toBe(true);
    expect(wrapper.find('[data-tour-id="bm.catalogue.createrequest.images"]').exists()).toBe(true);
    expect(wrapper.find('[data-tour-id="bm.catalogue.createrequest.reason"]').exists()).toBe(true);
    expect(wrapper.find('[data-tour-id="bm.catalogue.createrequest.notice"]').exists()).toBe(true);
    expect(wrapper.find('[data-tour-id="bm.catalogue.createrequest.cancel-btn"]').exists()).toBe(true);
    expect(wrapper.find('[data-tour-id="bm.catalogue.createrequest.submit-btn"]').exists()).toBe(true);
  });

  it('5. Full step progression: Covers 4 page steps and 10 modal steps with Next/Prev and pause for click', async () => {
    const tourResult = dapStore.startContinuousTour('/catalogue/requests');
    expect(tourResult.success).toBe(true);
    expect(dapStore.isActive).toBe(true);
    expect(dapStore.currentMission.code).toBe('BM-CAT-REQ');
    expect(dapStore.totalStepsInCurrentMission).toBe(14);

    // Step 1: KPI Cards
    expect(dapStore.currentStepIndex).toBe(0);
    expect(dapStore.currentStep.targetId).toBe('bm.catalogue.requests.kpi-cards');
    expect(dapStore.canAdvance).toBe(true);

    // Step 2: Filters
    dapStore.nextStep();
    expect(dapStore.currentStepIndex).toBe(1);
    expect(dapStore.currentStep.targetId).toBe('bm.catalogue.requests.filters');
    expect(dapStore.canAdvance).toBe(true);

    // Step 3: Table
    dapStore.nextStep();
    expect(dapStore.currentStepIndex).toBe(2);
    expect(dapStore.currentStep.targetId).toBe('bm.catalogue.requests.table');
    expect(dapStore.canAdvance).toBe(true);

    // Step 4: + New Product Request Button (Practice step - requires user click)
    dapStore.nextStep();
    expect(dapStore.currentStepIndex).toBe(3);
    expect(dapStore.currentStep.targetId).toBe('bm.catalogue.requests.create-btn');
    expect(dapStore.currentStep.mode).toBe('PRACTICE');
    expect(dapStore.currentStep.actionType).toBe('OPEN_MODAL');
    expect(dapStore.canAdvance).toBe(false); // Pauses for manual click

    // Mount page component
    const wrapper = mount(ProductRequests, {
      global: {
        mocks: {
          $router: { push: () => {} },
          $route: { path: '/catalogue/requests' }
        },
        stubs: {
          Search: true,
          ChevronDown: true,
          Check: true,
          Plus: true,
          Pencil: true
        }
      }
    });

    // Simulate user manually clicking the + New Product Request button
    const createBtn = wrapper.find('[data-tour-id="bm.catalogue.requests.create-btn"]');
    await createBtn.trigger('click');

    // Modal is now open and step is validated
    expect(wrapper.vm.showCreateModal).toBe(true);
    expect(dapStore.canAdvance).toBe(true);

    // Step 5: Proposed Product / Model Name
    dapStore.nextStep();
    expect(dapStore.currentStepIndex).toBe(4);
    expect(dapStore.currentStep.targetId).toBe('bm.catalogue.createrequest.product-name');

    // Step 6: Category
    dapStore.nextStep();
    expect(dapStore.currentStepIndex).toBe(5);
    expect(dapStore.currentStep.targetId).toBe('bm.catalogue.createrequest.category');

    // Step 7: Specifications
    dapStore.nextStep();
    expect(dapStore.currentStepIndex).toBe(6);
    expect(dapStore.currentStep.targetId).toBe('bm.catalogue.createrequest.specifications');

    // Step 8: Supplier Reference
    dapStore.nextStep();
    expect(dapStore.currentStepIndex).toBe(7);
    expect(dapStore.currentStep.targetId).toBe('bm.catalogue.createrequest.reference');

    // Step 9: Demand
    dapStore.nextStep();
    expect(dapStore.currentStepIndex).toBe(8);
    expect(dapStore.currentStep.targetId).toBe('bm.catalogue.createrequest.demand');

    // Step 10: Urgency
    dapStore.nextStep();
    expect(dapStore.currentStepIndex).toBe(9);
    expect(dapStore.currentStep.targetId).toBe('bm.catalogue.createrequest.urgency');

    // Step 11: Images
    dapStore.nextStep();
    expect(dapStore.currentStepIndex).toBe(10);
    expect(dapStore.currentStep.targetId).toBe('bm.catalogue.createrequest.images');

    // Step 12: Reason
    dapStore.nextStep();
    expect(dapStore.currentStepIndex).toBe(11);
    expect(dapStore.currentStep.targetId).toBe('bm.catalogue.createrequest.reason');

    // Step 13: Approval notice
    dapStore.nextStep();
    expect(dapStore.currentStepIndex).toBe(12);
    expect(dapStore.currentStep.targetId).toBe('bm.catalogue.createrequest.notice');

    // Step 14: Submit Button (final step)
    dapStore.nextStep();
    expect(dapStore.currentStepIndex).toBe(13);
    expect(dapStore.currentStep.targetId).toBe('bm.catalogue.createrequest.submit-btn');
    expect(dapStore.isFinalStep).toBe(true);

    // Modal remained open during all modal steps
    expect(wrapper.vm.showCreateModal).toBe(true);
  });

  it('6. Next/Previous navigation: Rewinding to Step 4 closes the modal so page button is visible', async () => {
    dapStore.startContinuousTour('/catalogue/requests');
    dapStore.goToStep(3); // On Step 4

    const wrapper = mount(ProductRequests, {
      global: {
        mocks: {
          $router: { push: () => {} },
          $route: { path: '/catalogue/requests' }
        },
        stubs: {
          Search: true,
          ChevronDown: true,
          Check: true,
          Plus: true,
          Pencil: true
        }
      }
    });

    // User clicks button to open modal
    await wrapper.find('[data-tour-id="bm.catalogue.requests.create-btn"]').trigger('click');
    expect(wrapper.vm.showCreateModal).toBe(true);

    // Tour advances into modal (Step 5)
    dapStore.nextStep();
    expect(dapStore.currentStepIndex).toBe(4);
    expect(wrapper.vm.showCreateModal).toBe(true);

    // User clicks Previous back to Step 4
    dapStore.prevStep();
    await wrapper.vm.$nextTick();

    expect(dapStore.currentStepIndex).toBe(3);
    expect(dapStore.currentStep.targetId).toBe('bm.catalogue.requests.create-btn');
    // Modal is safely closed so user can see page button again
    expect(wrapper.vm.showCreateModal).toBe(false);
  });

  it('7. Safe modal exit: Closing modal via Cancel or X rewinds tour safely to Step 4 without mutating data', async () => {
    const initialRequestsCount = (store.productRequests || []).length;

    dapStore.startContinuousTour('/catalogue/requests');
    dapStore.goToStep(3); // Step 4

    const wrapper = mount(ProductRequests, {
      global: {
        mocks: {
          $router: { push: () => {} },
          $route: { path: '/catalogue/requests' }
        },
        stubs: {
          Search: true,
          ChevronDown: true,
          Check: true,
          Plus: true,
          Pencil: true
        }
      }
    });

    // User opens modal
    await wrapper.find('[data-tour-id="bm.catalogue.requests.create-btn"]').trigger('click');
    expect(wrapper.vm.showCreateModal).toBe(true);

    // Advance to Step 6 inside modal
    dapStore.goToStep(5);
    expect(dapStore.currentStepIndex).toBe(5);
    expect(dapStore.currentStep.targetId).toBe('bm.catalogue.createrequest.category');

    // User closes modal via cancel/close handler
    wrapper.vm.handleModalClose();
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.showCreateModal).toBe(false);
    // Tour rewound back to Step 4 trigger button
    expect(dapStore.currentStepIndex).toBe(3);
    expect(dapStore.currentStep.targetId).toBe('bm.catalogue.requests.create-btn');

    // Verify zero data mutation occurred
    expect((store.productRequests || []).length).toBe(initialRequestsCount);
  });

  it('8. Strict Invariant: Tour never auto-clicks, auto-fills, or submits data', () => {
    const initialRequestsCount = (store.productRequests || []).length;

    dapStore.startContinuousTour('/catalogue/requests');

    for (let i = 0; i < 14; i++) {
      dapStore.goToStep(i);
      expect((store.productRequests || []).length).toBe(initialRequestsCount);
    }
  });
});
