/**
 * AJ EcoDrive — Universal Mount Test for all 135 Views
 */
import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import { createRouter, createMemoryHistory } from 'vue-router';
import { store } from '../src/store.js';

// Setup minimal dummy router
const router = createRouter({
  history: createMemoryHistory(),
  routes: [{ path: '/', component: { template: '<div>home</div>' } }]
});

// Import all .vue files from src/views
const viewModules = import.meta.glob('../src/views/**/*.vue');

describe('Universal View Mount & Rendering Audit', () => {
  for (const [path, importFn] of Object.entries(viewModules)) {
    const viewName = path.replace('../src/views/', '');
    
    it(`mounts ${viewName} without throwing fatal exceptions`, async () => {
      const module = await importFn();
      const Component = module.default;
      expect(Component).toBeDefined();

      let wrapper;
      try {
        wrapper = mount(Component, {
          global: {
            plugins: [router],
            provide: {
              store,
              dapStore: { isActive: false, currentStep: null }
            },
            stubs: {
              'router-link': true,
              'router-view': true,
              'Teleport': true
            }
          }
        });
        expect(wrapper.exists()).toBe(true);
      } catch (err) {
        console.error(`Error mounting ${viewName}:`, err.message);
        throw err;
      } finally {
        if (wrapper) wrapper.unmount();
      }
    });
  }
});
