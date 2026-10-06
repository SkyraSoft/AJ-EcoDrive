/**
 * AJ EcoDrive — Tour Session Persistence & Resume Validator
 * PROGRAM: AJ-TOUR-RECONSTRUCT-2026
 * PHASE 6: CHECKPOINT 6.1 — PERSISTENCE RUNTIME
 *
 * Persists ONLY essential tour execution metadata.
 * Uses durable `currentStepId` as the primary step anchor (with `currentStepIndex` derived).
 * Strictly avoids saving business records, customer data, or form payloads in localStorage.
 */

const STORAGE_KEY = 'aj_ecodrive_tour_session_v3';

export function saveTourSession(sessionData) {
  if (typeof localStorage === 'undefined') return;

  try {
    const payload = {
      missionId: sessionData.missionId || null,
      missionVersion: sessionData.missionVersion || '1.0.0',
      workspace: sessionData.workspace || 'Branch Manager',
      currentStepId: sessionData.currentStepId || null,
      currentStepIndex: typeof sessionData.currentStepIndex === 'number' ? sessionData.currentStepIndex : 0,
      completedStepIds: Array.isArray(sessionData.completedStepIds) ? sessionData.completedStepIds : [],
      scenarioCheckpoint: sessionData.scenarioCheckpoint || null,
      timestamp: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (e) {
    console.warn('Failed to save tour session to localStorage', e);
  }
}

export function loadTourSession() {
  if (typeof localStorage === 'undefined') return null;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    // Expire stale sessions older than 24 hours
    if (Date.now() - data.timestamp > 24 * 60 * 60 * 1000) {
      clearTourSession();
      return null;
    }
    return data;
  } catch (e) {
    console.warn('Failed to load tour session', e);
    return null;
  }
}

export function clearTourSession() {
  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      // ignore
    }
  }
}

/**
 * Validates whether a saved session can be safely resumed.
 * Checks:
 * - Active session presence
 * - Workspace match
 * - Mission version compatibility
 * - Step ID existence within current mission definition (if supplied)
 */
export function validateResume(session, activeWorkspace, currentMission = null) {
  if (!session || !session.missionId) {
    return { canResume: false, reason: 'NO_SAVED_SESSION' };
  }

  if (session.workspace && activeWorkspace && session.workspace !== activeWorkspace) {
    return { 
      canResume: false, 
      reason: 'WORKSPACE_MISMATCH',
      message: `Saved tour belongs to ${session.workspace}, but active workspace is ${activeWorkspace}` 
    };
  }

  if (currentMission) {
    if (currentMission.version && session.missionVersion && currentMission.version !== session.missionVersion) {
      return {
        canResume: false,
        reason: 'VERSION_MISMATCH',
        message: `Saved tour version ${session.missionVersion} does not match current mission version ${currentMission.version}`
      };
    }

    if (session.currentStepId && Array.isArray(currentMission.steps)) {
      const stepExists = currentMission.steps.some(s => s.id === session.currentStepId);
      if (!stepExists) {
        return {
          canResume: false,
          reason: 'STEP_NOT_FOUND',
          message: `Saved step "${session.currentStepId}" no longer exists in current mission definition`
        };
      }
    }
  }

  return { canResume: true };
}
