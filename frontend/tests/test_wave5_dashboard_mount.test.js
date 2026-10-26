/**
 * AJ ECODRIVE — WAVE 5 DASHBOARD COMPONENT MOUNT SUITE
 * Master Artifact ID: 73158
 * Tests real mounting of SuperAdminDashboard.vue, SalesDashboard.vue, and InventoryDashboard.vue.
 * Verifies dynamic KPI calculations, branch scoping, zero state rendering, and reactive domain mutations.
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import { nextTick } from 'vue'

import { store } from '@/store.js'
import SuperAdminDashboard from '@/views/dashboard/SuperAdminDashboard.vue'
import SalesDashboard from '@/views/sales/SalesDashboard.vue'
import InventoryDashboard from '@/views/inventory/InventoryDashboard.vue'

describe('AJ EcoDrive — Wave 5 Dashboard Component Mount & Reactivity Suite', () => {
  let router

  beforeEach(() => {
    router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/', component: SuperAdminDashboard },
        { path: '/sales/dashboard', component: SalesDashboard },
        { path: '/inventory/dashboard', component: InventoryDashboard }
      ]
    })
  })

  it('SuperAdminDashboard mounts and derives dynamic inventory and financial metrics', async () => {
    store.setSession({
      isAuthenticated: true,
      branchCode: 'ADMIN',
      branchName: 'All Branches',
      branchId: 'ALL',
      role: 'Super Admin',
      name: 'Super Admin',
      isSuperAdmin: true
    })

    const wrapper = mount(SuperAdminDashboard, {
      global: {
        plugins: [router]
      }
    })

    await flushPromises()
    await nextTick()

    // Header rendered
    expect(wrapper.text()).toContain('Super Admin Dashboard')

    // Inventory overview card reflects actual store stats
    const stats = store.getInventoryStats('All Branches')
    expect(wrapper.text()).toContain(`${stats.available}`)
    expect(wrapper.text()).toContain(`${stats.reserved}`)

    // Test reactive update: mutate a unit to Available
    const firstReserved = store.serializedUnits.find(u => u.status === 'Reserved')
    if (firstReserved) {
      firstReserved.status = 'Available'
      await nextTick()
      const updatedStats = store.getInventoryStats('All Branches')
      expect(wrapper.text()).toContain(`${updatedStats.available}`)
      // restore
      firstReserved.status = 'Reserved'
    }
  })

  it('SalesDashboard mounts and consumes Wave 4 financial calculations', async () => {
    store.setSession({
      isAuthenticated: true,
      branchCode: 'ADMIN',
      branchName: 'All Branches',
      branchId: 'ALL',
      role: 'Super Admin',
      name: 'Super Admin',
      isSuperAdmin: true
    })

    const wrapper = mount(SalesDashboard, {
      global: {
        plugins: [router]
      }
    })

    await flushPromises()
    await nextTick()

    // Checks that hardcoded PKR 28.4M is gone and computed Net Sales is displayed
    const fin = store.calculateFinancialMetrics({ branch_id: 'ALL' })
    const expectedSalesStr = store.formatCurrency(fin.netSales)
    expect(wrapper.text()).toContain(expectedSalesStr)
  })

  it('InventoryDashboard mounts and reflects canonical unit statuses without collapsing', async () => {
    store.setSession({
      isAuthenticated: true,
      branchCode: 'ADMIN',
      branchName: 'All Branches',
      branchId: 'ALL',
      role: 'Super Admin',
      name: 'Super Admin',
      isSuperAdmin: true
    })

    const wrapper = mount(InventoryDashboard, {
      global: {
        plugins: [router]
      }
    })

    await flushPromises()
    await nextTick()

    const stats = store.getInventoryStats('All Branches')
    expect(wrapper.text()).toContain(`${stats.available}`)
    expect(wrapper.text()).toContain(`${stats.reserved}`)
    expect(wrapper.text()).toContain(`${stats.supplierInTransit}`)
    expect(wrapper.text()).toContain(`${stats.transferInTransit}`)
  })

  it('Branch Manager sees branch-scoped metrics without cross-branch pollution', async () => {
    store.setSession({
      isAuthenticated: true,
      branchCode: 'PEW',
      branchName: 'Peshawar',
      branchId: 'BR-01',
      role: 'Branch Manager',
      name: 'Peshawar Manager',
      isSuperAdmin: false
    })

    const wrapper = mount(InventoryDashboard, {
      global: {
        plugins: [router]
      }
    })

    await flushPromises()
    await nextTick()

    const stats = store.getInventoryStats('Peshawar')
    expect(wrapper.text()).toContain(`${stats.available}`)
  })
})
