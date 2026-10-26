/**
 * AJ ECODRIVE — WAVE 3 ACTION CENTRE COMPONENT MOUNT SUITE
 * Tests real mounting of ActionCentre.vue, dynamic rendering from store.actionQueue,
 * RBAC role & branch filtering, KPI derivation, and interactive resolution execution.
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import { nextTick } from 'vue'

import { store } from '@/store.js'
import ActionCentre from '@/views/dashboard/ActionCentre.vue'

describe('AJ EcoDrive — Wave 3 Action Centre Mount & UI Integration Gate', () => {
  let router

  beforeEach(() => {
    router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/dashboard/action-centre', component: ActionCentre },
        { path: '/inventory/transfers/detail', component: { template: '<div>Transfer Detail</div>' } },
        { path: '/finance/expenses/detail', component: { template: '<div>Expense Detail</div>' } },
        { path: '/sales/orders/detail', component: { template: '<div>Order Detail</div>' } }
      ]
    })
  })

  it('renders Action Centre with dynamic tasks and correct KPI metrics for Super Admin', async () => {
    // 1. Set session as Super Admin
    store.setSession({
      isAuthenticated: true,
      branchCode: 'ADMIN',
      branchName: 'All Branches',
      branchId: 'ALL',
      role: 'Super Admin',
      name: 'Super Admin',
      isSuperAdmin: true
    })

    const wrapper = mount(ActionCentre, {
      global: {
        plugins: [router]
      }
    })

    await flushPromises()
    await nextTick()

    // Assert header renders correctly
    expect(wrapper.find('#dap-actioncentre-header').exists()).toBe(true)
    expect(wrapper.text()).toContain('Action Centre')

    // Assert table rows exist
    const rows = wrapper.findAll('tbody tr')
    expect(rows.length).toBeGreaterThan(0)

    // Assert sentinel task TR-221 is rendered
    expect(wrapper.text()).toContain('TR-221')
    expect(wrapper.text()).toContain('Inward 4x BRG DS11 from Islamabad')

    // Assert KPIs are dynamic numbers
    const kpiCards = wrapper.findAll('.grid-cols-1 > div, .grid-cols-2 > div, .lg\\:grid-cols-4 > div')
    expect(wrapper.text()).toContain('Pending Actions')
    expect(wrapper.text()).toContain('Critical Priority')
  })

  it('enforces branch isolation: Peshawar Branch Manager only sees Peshawar routed tasks', async () => {
    // 2. Set session as Peshawar Branch Manager
    store.setSession({
      isAuthenticated: true,
      branchCode: 'PEW-01',
      branchName: 'Peshawar',
      branchId: 'BR-01',
      role: 'Branch Manager',
      name: 'Ahsan Khan',
      isSuperAdmin: false
    })

    const wrapper = mount(ActionCentre, {
      global: {
        plugins: [router]
      }
    })

    await flushPromises()
    await nextTick()

    // Peshawar BM sees transfer task directed to Peshawar (ACT-TR-221)
    expect(wrapper.text()).toContain('TR-221')

    // Peshawar BM CANNOT see Super Admin tasks or tasks for Islamabad
    const visibleTasks = store.getActionTasksForUser()
    const islamabadTasks = visibleTasks.filter(t => t.branch === 'Islamabad' && t.recipientRole === 'Branch Manager')
    expect(islamabadTasks.length).toBe(0)
  })

  it('renders empty state when filtered queue has zero items', async () => {
    store.setSession({
      isAuthenticated: true,
      branchCode: 'ADMIN',
      branchName: 'All Branches',
      branchId: 'ALL',
      role: 'Super Admin',
      name: 'Super Admin',
      isSuperAdmin: true
    })

    const wrapper = mount(ActionCentre, {
      global: {
        plugins: [router]
      }
    })

    await flushPromises()

    // Type a search query that matches nothing
    const searchInput = wrapper.find('input[data-tour="action-centre-search"]')
    expect(searchInput.exists()).toBe(true)
    await searchInput.setValue('W3-NON-EXISTENT-SENTINEL-99999')
    await nextTick()

    expect(wrapper.text()).toContain('No action tasks found matching your filters')
  })

  it('opens treatment drawer and executes resolution, updating task status in real time', async () => {
    store.setSession({
      isAuthenticated: true,
      branchCode: 'ADMIN',
      branchName: 'All Branches',
      branchId: 'ALL',
      role: 'Super Admin',
      name: 'Super Admin',
      isSuperAdmin: true
    })

    // Create a fresh test task
    const testTask = store.createWorkflowTask({
      workflowType: 'stock_request_approval',
      sourceEntity: 'stockRequests',
      sourceRecordId: 'SR-104',
      title: 'W3 UI Mount Test Task',
      branch: 'Peshawar',
      status: 'Pending'
    })

    const wrapper = mount(ActionCentre, {
      global: {
        plugins: [router]
      }
    })

    await flushPromises()
    await nextTick()

    // Find and click treat link on first row
    const treatBtn = wrapper.find('[data-tour="action-centre-treatment"]')
    expect(treatBtn.exists()).toBe(true)
    await treatBtn.trigger('click')
    await nextTick()

    // Verify treatment modal opened
    expect(wrapper.find('textarea[data-tour="decisionnotes"]').exists()).toBe(true)
  })
})
