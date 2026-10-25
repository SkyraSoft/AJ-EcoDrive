/**
 * AJ EcoDrive — Universal Reconstructed Tour Catalog Provider
 * PROGRAM: AJ-TOUR-RECONSTRUCT-2026
 * PHASE 6: CHECKPOINT 6.2 — FULL CONTENT / TARGET / GUIDED-TASK ROLLOUT
 *
 * Unified catalog interface exposing:
 * - 20 Super Admin Modules (SA-01 to SA-20)
 * - 19 Branch Manager Modules (BM-01 to BM-19)
 * - 6 Cross-Role Guided Scenarios (SCENARIO-A to SCENARIO-F)
 * - 640 Logical Field Guides (Dimension A: Role, Dimension B: Treatment, 6 Holds)
 * - Context Help Registry ("What Does This Mean?")
 *
 * Powers the 5 User-Facing Tour Modes:
 * 1. Quick Orientation (Level 1)
 * 2. Learn This Page / Page Tour (Level 2)
 * 3. Show Me Every Field / Field Guide (Level 3)
 * 4. Guide Me Through This Task / Guided Task (Level 4)
 * 5. What Does This Mean? / Context Help (Level 5)
 */

import { superAdminMissions } from './superAdmin/superAdminMissions.js';
import { branchManagerMissions } from './branchManager/branchManagerMissions.js';
import { branchManagerPageTours, BM_INVENTORY_SUBPAGE_ROUTES } from './branchManager/branchManagerPageTours.js';
import { crossRoleScenarios } from './scenarios/crossRoleScenarios.js';
import { contextHelpRegistry } from './contextHelp/contextHelpRegistry.js';
import { fieldGuideRegistry, getFieldGuide, getFieldGuidesForRoute, getFieldMatrixSummary, BUSINESS_DECISION_HOLDS } from './fieldGuides/fieldGuideRegistry.js';

export const TOUR_MODES = {
  QUICK_ORIENTATION: 'QUICK_ORIENTATION',
  PAGE_TOUR: 'PAGE_TOUR',
  FIELD_GUIDE: 'FIELD_GUIDE',
  GUIDED_TASK: 'GUIDED_TASK',
  CONTEXT_HELP: 'CONTEXT_HELP'
};

/**
 * Returns all curriculum missions applicable to the active user role.
 * Super Admin receives 20 SA modules + 6 scenarios.
 * Branch Manager receives 19 BM modules + 6 scenarios.
 */
export function getMissionsForRole(role) {
  if (role === 'Super Admin') {
    return [...superAdminMissions, ...crossRoleScenarios];
  }
  if (role === 'Branch Manager') {
    return [...branchManagerMissions, ...crossRoleScenarios];
  }
  // Default fallback
  return [...superAdminMissions, ...branchManagerMissions];
}

/**
 * Find a specific mission by internal ID or canonical module code (e.g. 'SA-01', 'bm-mission-05')
 */
export function getMissionById(identifier) {
  if (!identifier) return null;
  const all = [...superAdminMissions, ...branchManagerMissions, ...crossRoleScenarios, ...Object.values(branchManagerPageTours)];
  return all.find(m => m.id === identifier || m.code === identifier) || null;
}

/**
 * Mode 1: Quick Orientation
 * Returns a high-level concise orientation mission for the active route/workspace.
 */
export function getQuickOrientation(route, role) {
  const missions = getMissionsForRole(role);
  return missions.find(m => m.route === route && m.tourLevels && m.tourLevels.includes(TOUR_MODES.QUICK_ORIENTATION)) || null;
}

/**
 * Mode 2: Learn This Page (Page Tour)
 * Returns the comprehensive operational page tour for the active route/workspace.
 */
export function getPageTour(route, role) {
  if (!route) return null;
  const cleanRoute = route.split('?')[0].split('#')[0].replace(/\/+$/, '') || '/';

  // 1. Check dedicated role-specific page tour registry (ensures Branch Manager subpages use comprehensive multi-step tours)
  if (role === 'Branch Manager' && branchManagerPageTours[cleanRoute]) {
    return branchManagerPageTours[cleanRoute];
  }

  // 2. Check active role missions for exact match
  const roleMissions = getMissionsForRole(role);
  let match = roleMissions.find(m => {
    const mRoute = (m.route || '').split('?')[0].split('#')[0].replace(/\/+$/, '');
    return mRoute === cleanRoute && (!m.tourLevels || m.tourLevels.includes(TOUR_MODES.PAGE_TOUR));
  });
  if (match) return match;

  // 2. Check all missions for exact route match (enables shared pages like Catalogue Products for Branch Manager)
  const allMissions = [...superAdminMissions, ...branchManagerMissions];
  match = allMissions.find(m => {
    const mRoute = (m.route || '').split('?')[0].split('#')[0].replace(/\/+$/, '');
    return mRoute === cleanRoute && (!m.tourLevels || m.tourLevels.includes(TOUR_MODES.PAGE_TOUR));
  });
  if (match) return match;

  // 3. Check known route aliases between canonical modules
  const routeAliases = {
    '/sales/delivery': '/sales/handover',
    '/sales/handover': '/sales/delivery',
    '/inventory/serialized-units': '/inventory/units',
    '/inventory/units': '/inventory/serialized-units',
    '/inventory/stock-adjustments': '/inventory/adjustments',
    '/inventory/adjustments': '/inventory/stock-adjustments',
    '/after-sales/warranty': '/after-sales/cases',
    '/after-sales/cases': '/after-sales/warranty',
    '/analytics/reports-hub': '/analytics',
    '/analytics': '/analytics/reports-hub',
    '/catalogue/requests': '/inventory/product-requests',
    '/inventory/product-requests': '/catalogue/requests',
    '/procurement/purchase-orders': '/procurement/orders',
    '/procurement/orders': '/procurement/purchase-orders',
    '/procurement/receipts': '/procurement/receiving',
    '/procurement/receiving': '/procurement/receipts',
    '/procurement/vendor-bills': '/finance/supplier-bills',
    '/finance/supplier-bills': '/procurement/vendor-bills',
    '/sales/payments': '/finance/payments',
    '/finance/payments': '/sales/payments',
  };
  if (routeAliases[cleanRoute]) {
    const alias = routeAliases[cleanRoute];
    match = allMissions.find(m => {
      const mRoute = (m.route || '').split('?')[0].split('#')[0].replace(/\/+$/, '');
      return mRoute === alias && (!m.tourLevels || m.tourLevels.includes(TOUR_MODES.PAGE_TOUR));
    });
    if (match) return match;
  }

  // 4. Prefix match (strictly for subpages, picking the most specific matching prefix; ignores root or dashboard)
  if (cleanRoute !== '/' && cleanRoute !== '/dashboard') {
    const prefixMatches = allMissions.filter(m => {
      const mRoute = (m.route || '').split('?')[0].split('#')[0].replace(/\/+$/, '');
      return mRoute && mRoute !== '/' && mRoute !== '/dashboard' && cleanRoute.startsWith(mRoute + '/') && (!m.tourLevels || m.tourLevels.includes(TOUR_MODES.PAGE_TOUR));
    });
    if (prefixMatches.length > 0) {
      prefixMatches.sort((a, b) => (b.route?.length || 0) - (a.route?.length || 0));
      return prefixMatches[0];
    }
  }

  return null;
}

/**
 * Mode 3: Show Me Every Field (Field Guide)
 * Returns the field guide items for the active route and role.
 */
export function getFieldGuides(route, role) {
  return getFieldGuidesForRoute(route, role);
}

/**
 * Mode 4: Guide Me Through This Task (Guided Task)
 * Returns guided task missions or interactive scenario segments relevant to the active route.
 */
export function getGuidedTasks(route, role) {
  const tasks = [];
  const missions = getMissionsForRole(role);
  
  for (const m of missions) {
    if (m.steps && m.steps.some(s => s.mode === 'PRACTICE' || s.trainingType === 'practice')) {
      if (!route || m.route === route) {
        tasks.push(m);
      }
    }
  }

  // Also include scenarios that have segments on this route
  for (const scen of crossRoleScenarios) {
    const matchingSeg = scen.segments.find(s => s.route === route && s.workspace === role);
    if (matchingSeg) {
      tasks.push(scen);
    }
  }

  return tasks;
}

/**
 * Mode 5: What Does This Mean? (Context Help)
 * Resolves context help topics by term ID or associated target ID.
 */
export function getContextHelp(topicOrTargetId) {
  if (!topicOrTargetId) return null;
  return contextHelpRegistry.find(c => c.topicId === topicOrTargetId || c.targetId === topicOrTargetId) || null;
}

export function getAllContextHelp() {
  return contextHelpRegistry;
}

export function getAllScenarios() {
  return crossRoleScenarios;
}

export {
  superAdminMissions,
  branchManagerMissions,
  branchManagerPageTours,
  BM_INVENTORY_SUBPAGE_ROUTES,
  crossRoleScenarios,
  contextHelpRegistry,
  fieldGuideRegistry,
  getFieldGuide,
  getFieldGuidesForRoute,
  getFieldMatrixSummary,
  BUSINESS_DECISION_HOLDS
};
