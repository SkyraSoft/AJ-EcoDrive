/**
 * AJ EcoDrive — Comprehensive Continuous Guided Tour Suite for Remaining 5 Modules
 * Modules:
 * 1. After-Sales (3 subpages: Dashboard -> Warranty -> Repairs)
 * 2. Expenses (2 subpages: Expenses -> Expense Summary / Finance Overview)
 * 3. Communication (2 subpages: Management Inbox -> Notifications)
 * 4. Analytics (4 subpages: Reports Hub -> Sales -> Inventory -> CRM)
 * 5. System (5 subpages: Branch Team -> Account -> Security -> Preferences -> Audit Log)
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { dapStore } from '@/stores/dapStore'
import { store } from '@/store'
import router from '@/router'
import {
  BM_AFTER_SALES_SUBPAGE_ROUTES,
  BM_EXPENSES_SUBPAGE_ROUTES,
  BM_COMMUNICATION_SUBPAGE_ROUTES,
  BM_ANALYTICS_SUBPAGE_ROUTES,
  BM_SYSTEM_SUBPAGE_ROUTES,
  branchManagerPageTours,
  BM_INVENTORY_SUBPAGE_ROUTES,
  BM_SALES_SUBPAGE_ROUTES
} from '@/tour/content/catalog'
import { CURRICULUM_SEEDED_TARGETS } from '@/tour/curriculumTargets'

describe('Branch Manager — Continuous Guided Tours for Remaining 5 Modules', () => {
  let routerPushSpy

  beforeEach(() => {
    // 1. Mock router.push synchronously to prevent async component dynamic import teardown issues
    routerPushSpy = vi.spyOn(router, 'push').mockImplementation(() => Promise.resolve())

    // 2. Set active role to Branch Manager
    store.currentUser = {
      id: 'USR-BM-01',
      name: 'Peshawar Branch Manager',
      role: 'Branch Manager',
      branchName: 'Peshawar',
      branch: 'Peshawar',
      isBranchManager: true,
      isSuperAdmin: false
    }

    // 3. Reset DAP store
    dapStore.resetAllProgress()
    dapStore.stopDAP()
  })

  afterEach(() => {
    dapStore.stopDAP()
    routerPushSpy.mockRestore()
  })

  // -------------------------------------------------------------
  // MODULE 1: AFTER-SALES
  // -------------------------------------------------------------
  describe('1. After-Sales Continuous Tour (3 Subpages)', () => {
    it('has exact routes and order matching sidebar', () => {
      expect(BM_AFTER_SALES_SUBPAGE_ROUTES).toEqual([
        '/after-sales/dashboard',
        '/after-sales/warranty',
        '/after-sales/repairs'
      ])
    })

    it('starts continuous tour on /after-sales/dashboard with correct step metrics', () => {
      const res = dapStore.startAfterSalesContinuousTour()
      expect(res.success).toBe(true)
      expect(dapStore.isAfterSalesChainActive).toBe(true)
      expect(dapStore.currentAfterSalesSubpageIndex).toBe(0)
      expect(dapStore.currentStepIndex).toBe(0)
      expect(dapStore.isFirstStep).toBe(true)
      expect(dapStore.isFinalStep).toBe(false)
      expect(dapStore.currentOverallStepNumber).toBe(1)
      expect(dapStore.totalMissions).toBe(3)
    })

    it('navigates through all 3 After-Sales subpages, showing Next Page at boundaries and Finish on final step', () => {
      dapStore.startAfterSalesContinuousTour()

      // Subpage 1: /after-sales/dashboard (3 steps)
      const sub1Steps = branchManagerPageTours['/after-sales/dashboard'].steps.length
      for (let s = 0; s < sub1Steps - 1; s++) {
        expect(dapStore.isSubpageBoundaryStep).toBe(false)
        dapStore.nextStep()
      }
      // On boundary step of Subpage 1
      expect(dapStore.isSubpageBoundaryStep).toBe(true)
      expect(dapStore.nextSubpageRoute).toBe('/after-sales/warranty')
      expect(dapStore.isFinalStep).toBe(false)

      // Advance to Subpage 2: /after-sales/warranty
      dapStore.nextStep()
      expect(dapStore.currentAfterSalesSubpageIndex).toBe(1)
      expect(dapStore.currentStepIndex).toBe(0)
      expect(dapStore.isSubpageInitialStep).toBe(true)
      expect(dapStore.isFirstStep).toBe(false)

      const sub2Steps = branchManagerPageTours['/after-sales/warranty'].steps.length
      for (let s = 0; s < sub2Steps - 1; s++) {
        dapStore.nextStep()
      }
      // On boundary step of Subpage 2
      expect(dapStore.isSubpageBoundaryStep).toBe(true)
      expect(dapStore.nextSubpageRoute).toBe('/after-sales/repairs')
      expect(dapStore.isFinalStep).toBe(false)

      // Advance to Subpage 3: /after-sales/repairs
      dapStore.nextStep()
      expect(dapStore.currentAfterSalesSubpageIndex).toBe(2)
      expect(dapStore.currentStepIndex).toBe(0)
      expect(dapStore.isSubpageInitialStep).toBe(true)

      const sub3Steps = branchManagerPageTours['/after-sales/repairs'].steps.length
      for (let s = 0; s < sub3Steps - 1; s++) {
        dapStore.nextStep()
      }

      // Final step of After-Sales module!
      expect(dapStore.isFinalStep).toBe(true)
      expect(dapStore.isSubpageBoundaryStep).toBe(false)
      expect(dapStore.nextSubpageRoute).toBe(null)

      // Calling nextStep on final step completes tour
      dapStore.nextStep()
      expect(dapStore.isActive).toBe(false)
      expect(dapStore.isAfterSalesChainActive).toBe(false)
    })

    it('supports backward traversal across After-Sales subpages via prevStep()', () => {
      dapStore.startAfterSalesContinuousTour()

      // Advance into subpage 2
      const sub1Steps = branchManagerPageTours['/after-sales/dashboard'].steps.length
      for (let s = 0; s < sub1Steps; s++) {
        dapStore.nextStep()
      }
      expect(dapStore.currentAfterSalesSubpageIndex).toBe(1)
      expect(dapStore.currentStepIndex).toBe(0)

      // Step back across route boundary to subpage 1 final step
      dapStore.prevStep()
      expect(dapStore.currentAfterSalesSubpageIndex).toBe(0)
      expect(dapStore.currentStepIndex).toBe(sub1Steps - 1)
      expect(dapStore.isSubpageBoundaryStep).toBe(true)
    })
  })

  // -------------------------------------------------------------
  // MODULE 2: EXPENSES
  // -------------------------------------------------------------
  describe('2. Expenses Continuous Tour (2 Subpages)', () => {
    it('has exact routes and order matching sidebar', () => {
      expect(BM_EXPENSES_SUBPAGE_ROUTES).toEqual([
        '/finance/expenses',
        '/finance/overview'
      ])
    })

    it('navigates through Expenses subpages continuously with Finish only at final step', () => {
      dapStore.startExpensesContinuousTour()
      expect(dapStore.isExpensesChainActive).toBe(true)
      expect(dapStore.currentExpensesSubpageIndex).toBe(0)
      expect(dapStore.isFirstStep).toBe(true)

      // Subpage 1: /finance/expenses (4 steps)
      const sub1Steps = branchManagerPageTours['/finance/expenses'].steps.length
      for (let s = 0; s < sub1Steps - 1; s++) {
        dapStore.nextStep()
      }
      expect(dapStore.isSubpageBoundaryStep).toBe(true)
      expect(dapStore.nextSubpageRoute).toBe('/finance/overview')

      // Transition to Subpage 2: /finance/overview
      dapStore.nextStep()
      expect(dapStore.currentExpensesSubpageIndex).toBe(1)
      expect(dapStore.currentStepIndex).toBe(0)
      expect(dapStore.isSubpageInitialStep).toBe(true)

      const sub2Steps = branchManagerPageTours['/finance/overview'].steps.length
      for (let s = 0; s < sub2Steps - 1; s++) {
        dapStore.nextStep()
      }

      // Final step of Expenses!
      expect(dapStore.isFinalStep).toBe(true)
      expect(dapStore.isSubpageBoundaryStep).toBe(false)

      dapStore.nextStep()
      expect(dapStore.isActive).toBe(false)
      expect(dapStore.isExpensesChainActive).toBe(false)
    })
  })

  // -------------------------------------------------------------
  // MODULE 3: COMMUNICATION
  // -------------------------------------------------------------
  describe('3. Communication Continuous Tour (2 Subpages)', () => {
    it('has exact routes and order matching sidebar', () => {
      expect(BM_COMMUNICATION_SUBPAGE_ROUTES).toEqual([
        '/communication/inbox',
        '/communication/notifications'
      ])
    })

    it('navigates through Communication subpages continuously with Finish only at final step', () => {
      dapStore.startCommunicationContinuousTour()
      expect(dapStore.isCommunicationChainActive).toBe(true)
      expect(dapStore.currentCommunicationSubpageIndex).toBe(0)
      expect(dapStore.isFirstStep).toBe(true)

      // Subpage 1: /communication/inbox (4 steps)
      const sub1Steps = branchManagerPageTours['/communication/inbox'].steps.length
      for (let s = 0; s < sub1Steps - 1; s++) {
        dapStore.nextStep()
      }
      expect(dapStore.isSubpageBoundaryStep).toBe(true)
      expect(dapStore.nextSubpageRoute).toBe('/communication/notifications')

      // Transition to Subpage 2: /communication/notifications
      dapStore.nextStep()
      expect(dapStore.currentCommunicationSubpageIndex).toBe(1)
      expect(dapStore.currentStepIndex).toBe(0)
      expect(dapStore.isSubpageInitialStep).toBe(true)

      const sub2Steps = branchManagerPageTours['/communication/notifications'].steps.length
      for (let s = 0; s < sub2Steps - 1; s++) {
        dapStore.nextStep()
      }

      expect(dapStore.isFinalStep).toBe(true)
      dapStore.nextStep()
      expect(dapStore.isActive).toBe(false)
      expect(dapStore.isCommunicationChainActive).toBe(false)
    })
  })

  // -------------------------------------------------------------
  // MODULE 4: ANALYTICS
  // -------------------------------------------------------------
  describe('4. Analytics Continuous Tour (4 Subpages)', () => {
    it('has exact routes and order matching sidebar and router', () => {
      expect(BM_ANALYTICS_SUBPAGE_ROUTES).toEqual([
        '/analytics/reports-hub',
        '/analytics/reports/sales',
        '/analytics/reports/inventory',
        '/analytics/reports/crm'
      ])
    })

    it('navigates through all 4 Analytics subpages continuously with Finish only at CRM Report final step', () => {
      dapStore.startAnalyticsContinuousTour()
      expect(dapStore.isAnalyticsChainActive).toBe(true)
      expect(dapStore.currentAnalyticsSubpageIndex).toBe(0)
      expect(dapStore.isFirstStep).toBe(true)

      for (let i = 0; i < BM_ANALYTICS_SUBPAGE_ROUTES.length; i++) {
        const route = BM_ANALYTICS_SUBPAGE_ROUTES[i]
        const steps = branchManagerPageTours[route].steps.length
        expect(dapStore.currentAnalyticsSubpageIndex).toBe(i)

        for (let s = 0; s < steps - 1; s++) {
          expect(dapStore.isFinalStep).toBe(false)
          dapStore.nextStep()
        }

        if (i < BM_ANALYTICS_SUBPAGE_ROUTES.length - 1) {
          expect(dapStore.isSubpageBoundaryStep).toBe(true)
          expect(dapStore.nextSubpageRoute).toBe(BM_ANALYTICS_SUBPAGE_ROUTES[i + 1])
          dapStore.nextStep()
        }
      }

      // Final step of final Analytics subpage
      expect(dapStore.isFinalStep).toBe(true)
      dapStore.nextStep()
      expect(dapStore.isActive).toBe(false)
      expect(dapStore.isAnalyticsChainActive).toBe(false)
    })
  })

  // -------------------------------------------------------------
  // MODULE 5: SYSTEM
  // -------------------------------------------------------------
  describe('5. System Continuous Tour (5 Subpages)', () => {
    it('has exact routes and order matching sidebar and router', () => {
      expect(BM_SYSTEM_SUBPAGE_ROUTES).toEqual([
        '/system/branch-team',
        '/system/account',
        '/system/security',
        '/system/preferences',
        '/system/audit-log'
      ])
    })

    it('navigates through all 5 System subpages continuously with Finish only at Audit Log final step', () => {
      dapStore.startSystemContinuousTour()
      expect(dapStore.isSystemChainActive).toBe(true)
      expect(dapStore.currentSystemSubpageIndex).toBe(0)
      expect(dapStore.isFirstStep).toBe(true)

      for (let i = 0; i < BM_SYSTEM_SUBPAGE_ROUTES.length; i++) {
        const route = BM_SYSTEM_SUBPAGE_ROUTES[i]
        const steps = branchManagerPageTours[route].steps.length
        expect(dapStore.currentSystemSubpageIndex).toBe(i)

        for (let s = 0; s < steps - 1; s++) {
          expect(dapStore.isFinalStep).toBe(false)
          dapStore.nextStep()
        }

        if (i < BM_SYSTEM_SUBPAGE_ROUTES.length - 1) {
          expect(dapStore.isSubpageBoundaryStep).toBe(true)
          expect(dapStore.nextSubpageRoute).toBe(BM_SYSTEM_SUBPAGE_ROUTES[i + 1])
          dapStore.nextStep()
        }
      }

      // Final step of final System subpage (/system/audit-log)
      expect(dapStore.isFinalStep).toBe(true)
      dapStore.nextStep()
      expect(dapStore.isActive).toBe(false)
      expect(dapStore.isSystemChainActive).toBe(false)
    })
  })

  // -------------------------------------------------------------
  // 6. MODULE INDEPENDENCE, STANDALONE & ROLE ISOLATION
  // -------------------------------------------------------------
  describe('6. Module Independence, Standalone & Role Isolation', () => {
    it('does not leak or continue across modules (each module is strictly independent)', () => {
      // 1. After-Sales completes without continuing into Expenses
      dapStore.startAfterSalesContinuousTour()
      expect(dapStore.isAfterSalesChainActive).toBe(true)
      expect(dapStore.isExpensesChainActive).toBe(false)

      // 2. Starting Expenses resets After-Sales
      dapStore.startExpensesContinuousTour()
      expect(dapStore.isExpensesChainActive).toBe(true)
      expect(dapStore.isAfterSalesChainActive).toBe(false)
      expect(dapStore.isCommunicationChainActive).toBe(false)

      // 3. Starting System resets Expenses
      dapStore.startSystemContinuousTour()
      expect(dapStore.isSystemChainActive).toBe(true)
      expect(dapStore.isExpensesChainActive).toBe(false)
    })

    it('supports standalone tour mode for any subpage without cross-page chain', () => {
      dapStore.startContinuousTour('/after-sales/warranty', { standalone: true })
      expect(dapStore.isActive).toBe(true)
      expect(dapStore.isAfterSalesChainActive).toBe(false)
      expect(dapStore.activeContinuousModule).toBe(null)

      // Advance to final step of standalone tour
      const steps = branchManagerPageTours['/after-sales/warranty'].steps.length
      for (let s = 0; s < steps - 1; s++) {
        dapStore.nextStep()
      }
      expect(dapStore.isFinalStep).toBe(true)
      expect(dapStore.isSubpageBoundaryStep).toBe(false)

      // Next step finishes without route change
      dapStore.nextStep()
      expect(dapStore.isActive).toBe(false)
    })

    it('enforces role isolation: Super Admin does not trigger Branch Manager continuous chain', () => {
      store.currentUser = {
        id: 'USR-SA-01',
        name: 'Super Admin',
        role: 'Super Admin',
        isSuperAdmin: true,
        isBranchManager: false
      }

      dapStore.startContinuousTour('/after-sales/dashboard')
      expect(dapStore.isAfterSalesChainActive).toBe(false)
      expect(dapStore.activeContinuousModule).toBe(null)
    })

    it('verifies all tour steps across all 16 subpages are non-destructive (OBSERVE, read-only, skippable)', () => {
      const allNewRoutes = [
        ...BM_AFTER_SALES_SUBPAGE_ROUTES,
        ...BM_EXPENSES_SUBPAGE_ROUTES,
        ...BM_COMMUNICATION_SUBPAGE_ROUTES,
        ...BM_ANALYTICS_SUBPAGE_ROUTES,
        ...BM_SYSTEM_SUBPAGE_ROUTES
      ]

      expect(allNewRoutes.length).toBe(16)

      for (const r of allNewRoutes) {
        const tour = branchManagerPageTours[r]
        expect(tour, `Tour missing for route ${r}`).toBeDefined()
        expect(tour.steps.length).toBeGreaterThanOrEqual(3)

        for (const step of tour.steps) {
          expect(step.mode).toBe('OBSERVE')
          expect(step.trainingType).toBe('observe')
          expect(step.mutationRisk).toBe('RISK_0_READ_ONLY')
          expect(step.skippable).toBe(true)
          expect(typeof step.instruction).toBe('string')
          expect(typeof step.whyItMatters).toBe('string')
          expect(typeof step.whatHappensNext).toBe('string')
        }
      }
    })

    it('verifies all 62 semantic targets exist in CURRICULUM_SEEDED_TARGETS', () => {
      const allNewRoutes = [
        ...BM_AFTER_SALES_SUBPAGE_ROUTES,
        ...BM_EXPENSES_SUBPAGE_ROUTES,
        ...BM_COMMUNICATION_SUBPAGE_ROUTES,
        ...BM_ANALYTICS_SUBPAGE_ROUTES,
        ...BM_SYSTEM_SUBPAGE_ROUTES
      ]

      const seededIds = new Set(CURRICULUM_SEEDED_TARGETS.map(t => t.targetId))

      for (const r of allNewRoutes) {
        const tour = branchManagerPageTours[r]
        for (const step of tour.steps) {
          expect(seededIds.has(step.targetId), `Target ID ${step.targetId} must be in CURRICULUM_SEEDED_TARGETS`).toBe(true)
          // Verify 4-segment semantic naming grammar
          const parts = step.targetId.split('.')
          expect(parts.length).toBe(4)
          expect(parts[0]).toBe('bm')
        }
      }
    })
  })
})
