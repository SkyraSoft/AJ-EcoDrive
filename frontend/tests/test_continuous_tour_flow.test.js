import { describe, it, expect, beforeEach, vi } from 'vitest'
import { dapStore } from '../src/stores/dapStore.js'
import router from '../src/router/index.js'

describe('Continuous Multi-Page Application Tour Flow', () => {
  beforeEach(() => {
    localStorage.clear()
    dapStore.resetAllProgress()
    dapStore.stopDAP()
  })

  it('Requirement 1: Starts continuous guided tour from whatever page user is on', () => {
    // 1. Starting from Dashboard
    dapStore.startContinuousTour('/dashboard')
    expect(dapStore.isActive).toBe(true)
    expect(dapStore.currentMission.route).toBe('/dashboard')
    expect(dapStore.currentMission.code).toBe('SA-01')
    expect(dapStore.currentStepIndex).toBe(0)

    // 2. Starting from Catalogue Products
    dapStore.stopDAP()
    dapStore.startContinuousTour('/catalogue/products')
    expect(dapStore.isActive).toBe(true)
    expect(dapStore.currentMission.route).toBe('/catalogue/products')
    expect(dapStore.currentMission.code).toBe('SA-05')
    expect(dapStore.currentStepIndex).toBe(0)

    // 3. Starting from Sales Orders
    dapStore.stopDAP()
    dapStore.startContinuousTour('/sales/orders')
    expect(dapStore.isActive).toBe(true)
    expect(dapStore.currentMission.route).toBe('/sales/orders')
    expect(dapStore.currentMission.code).toBe('SA-14')
    expect(dapStore.currentStepIndex).toBe(0)
  })

  it('Requirements 3, 4, 5 & 6: Journeys continuously across pages when clicking Next without showing Finish until the final application step', () => {
    const pushSpy = vi.spyOn(router, 'push').mockImplementation(() => Promise.resolve())
    
    // Start on Dashboard (SA-01)
    dapStore.startContinuousTour('/dashboard')
    expect(dapStore.currentMissionIndex).toBe(0)
    expect(dapStore.currentStepIndex).toBe(0)
    expect(dapStore.isFinalStep).toBe(false)

    // Advance through SA-01 (4 steps)
    dapStore.nextStep() // step 1
    expect(dapStore.isFinalStep).toBe(false)
    dapStore.nextStep() // step 2
    expect(dapStore.isFinalStep).toBe(false)
    dapStore.nextStep() // step 3 (last step of SA-01)
    expect(dapStore.isFinalStep).toBe(false) // MUST NOT be final step! Requirement 5

    // Next step must advance to SA-02 and continue the tour!
    dapStore.nextStep()
    expect(dapStore.currentMissionIndex).toBe(1)
    expect(dapStore.currentStepIndex).toBe(0)
    expect(dapStore.isActive).toBe(true)
    expect(dapStore.isFinalStep).toBe(false)

    // Now jump close to the end of the entire application tour
    dapStore.currentMissionIndex = dapStore.totalMissions - 1
    dapStore.currentStepIndex = 0
    expect(dapStore.isFinalStep).toBe(false)

    // Move to the very last step of the final mission
    dapStore.currentStepIndex = dapStore.totalStepsInCurrentMission - 1
    // ONLY here is isFinalStep true!
    expect(dapStore.isFinalStep).toBe(true)

    // Clicking Finish (nextStep) completes the entire application tour
    dapStore.nextStep()
    expect(dapStore.isActive).toBe(false)

    pushSpy.mockRestore()
  })

  it('Requirement 4: Automatically navigates to new page route when transitioning across page boundaries', () => {
    const pushedRoutes = []
    const pushSpy = vi.spyOn(router, 'push').mockImplementation((target) => {
      pushedRoutes.push(target)
      return Promise.resolve()
    })

    // Start on SA-02 (/dashboard)
    dapStore.currentMissionIndex = 1
    dapStore.currentStepIndex = dapStore.totalStepsInCurrentMission - 1 // final step of SA-02

    // Next should advance to SA-03 whose route is /organisation/branches
    dapStore.nextStep()
    expect(dapStore.currentMissionIndex).toBe(2)
    expect(dapStore.currentMission.code).toBe('SA-03')
    expect(dapStore.currentMission.route).toBe('/organisation/branches')

    // Expect router.push to have been invoked with /organisation/branches!
    expect(pushedRoutes).toContain('/organisation/branches')

    pushSpy.mockRestore()
  })

  it('Requirement 7: Previous button returns to previous step and navigates back to previous page', () => {
    const pushedRoutes = []
    const pushSpy = vi.spyOn(router, 'push').mockImplementation((target) => {
      pushedRoutes.push(target)
      return Promise.resolve()
    })

    // Start on SA-03 (/organisation/branches) at step 0
    dapStore.startContinuousTour('/organisation/branches')
    expect(dapStore.currentMission.code).toBe('SA-03')
    expect(dapStore.currentStepIndex).toBe(0)
    expect(dapStore.isFirstStep).toBe(false)

    // Clicking Previous should navigate back to SA-02 (/dashboard)
    dapStore.prevStep()
    expect(dapStore.currentMission.code).toBe('SA-02')
    expect(dapStore.currentMission.route).toBe('/dashboard')
    expect(pushedRoutes).toContain('/dashboard/quick-actions')

    // When at the very first step of the tour (mission 0, step 0), isFirstStep is true
    dapStore.currentMissionIndex = 0
    dapStore.currentStepIndex = 0
    expect(dapStore.isFirstStep).toBe(true)

    pushSpy.mockRestore()
  })

  it('Requirement 8: Computes overall continuous step numbering across all pages', () => {
    dapStore.startContinuousTour('/dashboard')
    expect(dapStore.currentOverallStepNumber).toBe(1)
    expect(dapStore.totalSystemSteps).toBeGreaterThanOrEqual(20)

    // Advance 3 steps
    dapStore.nextStep()
    expect(dapStore.currentOverallStepNumber).toBe(2)
    dapStore.nextStep()
    expect(dapStore.currentOverallStepNumber).toBe(3)
  })
})
