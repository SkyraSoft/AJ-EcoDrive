import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { dapStore } from '../src/stores/dapStore.js';
import { superAdminMissions } from '../src/tour/content/superAdmin/superAdminMissions.js';
import { getTarget } from '../src/tour/targetRegistry.js';
import RolesPermissions from '../src/views/organisation/RolesPermissions.vue';
import CreateRole from '../src/views/organisation/CreateRole.vue';

describe('Roles & Permissions Tour Integrity and Field-by-Field Modal Flow', () => {
  beforeEach(() => {
    dapStore.isActive = false;
  });

  afterEach(() => {
    dapStore.isActive = false;
  });

  it('1. Target Registry registers all 10 Roles and CreateRole target IDs', () => {
    const requiredTargets = [
      'sa.organisation.roles.table',
      'sa.organisation.roles.model',
      'sa.organisation.roles.matrix',
      'sa.organisation.roles.create-btn',
      'sa.organisation.createrole.modal',
      'sa.organisation.createrole.name',
      'sa.organisation.createrole.scope',
      'sa.organisation.createrole.description',
      'sa.organisation.createrole.permissions',
      'sa.organisation.createrole.submit-btn'
    ];

    for (const targetId of requiredTargets) {
      const def = getTarget(targetId);
      expect(def, `Target ${targetId} must be registered in targetRegistry`).not.toBeNull();
      expect(def.targetId).toBe(targetId);
    }
  });

  it('2. findMissionAndStepForRoute resolves /organisation/roles to SA-04 step 10', () => {
    const resolution = dapStore.findMissionAndStepForRoute('/organisation/roles');
    expect(resolution).not.toBeNull();
    const mission = dapStore.missions[resolution.missionIndex];
    expect(mission.id).toBe('sa-mission-04');
    expect(resolution.stepIndex).toBe(9); // 0-indexed step 10
    expect(mission.steps[resolution.stepIndex].targetId).toBe('sa.organisation.roles.table');
  });

  it('3. SA-04 contains sequential tour steps for overview and CreateRole modal fields', () => {
    const mission = superAdminMissions.find(m => m.id === 'sa-mission-04');
    expect(mission).toBeDefined();

    const roleSteps = mission.steps.filter(s => s.route === '/organisation/roles');
    expect(roleSteps.length).toBe(9);

    const expectedOrder = [
      'sa.organisation.roles.table',
      'sa.organisation.roles.model',
      'sa.organisation.roles.matrix',
      'sa.organisation.roles.create-btn',
      'sa.organisation.createrole.name',
      'sa.organisation.createrole.scope',
      'sa.organisation.createrole.description',
      'sa.organisation.createrole.permissions',
      'sa.organisation.createrole.submit-btn'
    ];

    roleSteps.forEach((step, idx) => {
      expect(step.targetId).toBe(expectedOrder[idx]);
    });

    // Check practice action on create button
    const createBtnStep = roleSteps.find(s => s.targetId === 'sa.organisation.roles.create-btn');
    expect(createBtnStep.mode).toBe('PRACTICE');
    expect(createBtnStep.expectedAction).toBe('CLICK');

    // Field-by-field steps must preserve manual user agency
    const formSteps = roleSteps.slice(4);
    for (const step of formSteps) {
      expect(step.mode).not.toBe('AUTO_INTERACT');
      expect(step.skippable).toBe(true);
    }
  });

  it('4. RolesPermissions.vue mounts and exposes required overview and action targets', () => {
    const wrapper = mount(RolesPermissions, {
      global: {
        stubs: {
          CreateRole: true,
          'router-view': true
        }
      }
    });

    expect(wrapper.find('[data-tour-id="sa.organisation.roles.table"]').exists()).toBe(true);
    expect(wrapper.find('[data-tour-id="sa.organisation.roles.model"]').exists()).toBe(true);
    expect(wrapper.find('[data-tour-id="sa.organisation.roles.matrix"]').exists()).toBe(true);
    expect(wrapper.find('[data-tour-id="sa.organisation.roles.create-btn"]').exists()).toBe(true);
  });

  it('5. CreateRole.vue mounts and exposes modal container, inputs, permissions table, and submit button', () => {
    const wrapper = mount(CreateRole);

    expect(wrapper.find('[data-tour-id="sa.organisation.createrole.modal"]').exists()).toBe(true);
    expect(wrapper.find('[data-tour-id="sa.organisation.createrole.name"]').exists()).toBe(true);
    expect(wrapper.find('[data-tour-id="sa.organisation.createrole.scope"]').exists()).toBe(true);
    expect(wrapper.find('[data-tour-id="sa.organisation.createrole.description"]').exists()).toBe(true);
    expect(wrapper.find('[data-tour-id="sa.organisation.createrole.permissions"]').exists()).toBe(true);
    expect(wrapper.find('[data-tour-id="sa.organisation.createrole.submit-btn"]').exists()).toBe(true);
    expect(wrapper.find('[data-tour-id="sa.organisation.createrole.cancel-btn"]').exists()).toBe(true);
  });
});
