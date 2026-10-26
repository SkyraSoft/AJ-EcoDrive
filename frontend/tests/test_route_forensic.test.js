import { describe, it, expect } from 'vitest';
import { dapStore } from '../src/stores/dapStore.js';
import { store } from '../src/store.js';

describe('Route Matching Forensic Test', () => {
  it('Tests findMissionAndStepForRoute for both roles', () => {
    // 1. Super Admin
    store.currentUser = {
      role: 'Super Admin',
      branchName: 'Head Office',
      isSuperAdmin: true,
      isAuthenticated: true
    };
    const saLoc = dapStore.findMissionAndStepForRoute('/dashboard/action-centre');
    console.log('Super Admin loc for /dashboard/action-centre:', saLoc);
    dapStore.currentMissionIndex = saLoc.missionIndex;
    dapStore.currentStepIndex = saLoc.stepIndex;
    console.log('Super Admin mission:', dapStore.currentMission?.code, 'step:', dapStore.currentStep?.id, dapStore.currentStep?.targetId, dapStore.currentStep?.route);

    // 2. Branch Manager
    store.currentUser = {
      role: 'Branch Manager',
      branchName: 'Peshawar',
      branchCode: 'PEW',
      isSuperAdmin: false,
      isAuthenticated: true
    };
    const bmLoc = dapStore.findMissionAndStepForRoute('/dashboard/action-centre');
    console.log('Branch Manager loc for /dashboard/action-centre:', bmLoc);
    dapStore.currentMissionIndex = bmLoc.missionIndex;
    dapStore.currentStepIndex = bmLoc.stepIndex;
    console.log('Branch Manager mission:', dapStore.currentMission?.code, 'step:', dapStore.currentStep?.id, dapStore.currentStep?.targetId, dapStore.currentStep?.route);
  });
});
