/**
 * AJ EcoDrive — Legacy DAP Mission Adapter & Role-Aware Catalog Bridge
 * PROGRAM: AJ-TOUR-RECONSTRUCT-2026
 * PHASE 6: CHECKPOINT 6.1 — BACKWARD COMPATIBILITY BRIDGE
 *
 * Translates historical DAP mission definitions into the new Phase 4/5 step schema.
 * @deprecated THIS ADAPTER IS DEPRECATED AND NOT DEFAULT AS OF CHECKPOINT 6.2.
 * The production employee tour runtime uses src/tour/content/catalog.js.
 * This adapter remains solely for legacy test compatibility and saved session migration.
 */

import { branchManagerMissions } from '@/config/branchManagerDAPMissions.js';

/**
 * Super Admin Interim Orientation Mission (Safe role-aware behavior for MP8)
 */
export const superAdminInterimMission = {
  id: 'sa-interim-orientation',
  code: 'SA-01',
  title: 'Super Admin Head Office Command Orientation',
  category: 'Executive Governance',
  description: 'Welcome to the Head Office command center. Explore consolidated network KPIs, approvals, and multi-branch governance.',
  steps: [
    {
      id: 'sa-step-01',
      title: 'Command Header & Role Verification',
      targetId: 'shared.layout.header.role-badge',
      mode: 'OBSERVE',
      trainingType: 'observe',
      placement: 'bottom',
      explanation: 'Confirms your active executive login as Super Admin with company-wide administrative authority.',
      instruction: 'Verify your role badge in the top navigation bar.',
      skippable: true,
    },
    {
      id: 'sa-step-02',
      title: 'Multi-Branch Viewport Switcher',
      targetId: 'shared.layout.header.branch-switcher',
      mode: 'OBSERVE',
      trainingType: 'observe',
      placement: 'bottom',
      explanation: 'Switch between company-wide consolidated views and specific dealership showroom locations.',
      instruction: 'Review the branch selector to audit individual branch inventory and sales.',
      skippable: true,
    },
    {
      id: 'sa-step-03',
      title: 'Central Action Centre Queue Trigger',
      targetId: 'shared.layout.header.action-centre',
      mode: 'OBSERVE',
      trainingType: 'observe',
      placement: 'bottom',
      explanation: 'Real-time alert indicator displaying pending showroom requests requiring Head Office authorization.',
      instruction: 'Click to open the Action Centre when showroom requests require review.',
      skippable: true,
    },
    {
      id: 'sa-step-04',
      title: 'Consolidated Network Net Sales KPI',
      targetId: 'sa.dashboard.kpi.net-sales',
      mode: 'OBSERVE',
      trainingType: 'observe',
      placement: 'bottom',
      explanation: 'Consolidated network net sales revenue across all dealerships net of discounts and authorized refunds.',
      instruction: 'Monitor daily sales pacing against monthly commercial targets.',
      skippable: true,
    },
    {
      id: 'sa-step-05',
      title: 'Total Owned Unsold Inventory Valuation',
      targetId: 'sa.dashboard.kpi.inventory-value',
      mode: 'OBSERVE',
      trainingType: 'observe',
      placement: 'bottom',
      explanation: 'Capital invested in unsold electric vehicles across all showrooms and transit warehouses.',
      instruction: 'Review inventory capital liquidity to maintain optimal showroom stock levels.',
      skippable: true,
    },
  ],
};

/**
 * Normalizes a legacy step into the modern Phase 4 step schema.
 */
export function normalizeLegacyStep(legacyStep, index) {
  if (!legacyStep) return null;

  const mode = (legacyStep.trainingType === 'observe') ? 'OBSERVE' : 'PRACTICE';
  const targetId = legacyStep.targetId || (legacyStep.target ? legacyStep.target.replace(/^[#.]/, '') : `step-target-${index}`);

  return {
    id: legacyStep.id || `step-${index + 1}`,
    stepNumber: index + 1,
    title: legacyStep.title || legacyStep.task || `Step ${index + 1}`,
    mode,
    trainingType: legacyStep.trainingType || (mode === 'OBSERVE' ? 'observe' : 'practice'),
    targetId,
    target: legacyStep.target,
    preferredPlacement: legacyStep.placement || 'right',
    placement: legacyStep.placement || 'right',
    explanation: legacyStep.explanation || legacyStep.description || '',
    instruction: legacyStep.instruction || legacyStep.task || '',
    whyItMatters: legacyStep.whyItMatters || '',
    badge: legacyStep.badge || (mode === 'OBSERVE' ? 'Walkthrough' : 'Practice'),
    validation: legacyStep.validation || null,
    expectedValue: legacyStep.expectedValue || null,
    required: legacyStep.required || false,
    route: legacyStep.route || null,
    skippable: legacyStep.skippable !== false,
  };
}

/**
 * Normalizes a legacy mission into the modern mission schema.
 */
export function normalizeLegacyMission(legacyMission) {
  if (!legacyMission) return null;

  return {
    id: legacyMission.id || legacyMission.code || 'legacy-mission',
    code: legacyMission.code || 'BM-M',
    title: legacyMission.title || 'Dealership Operational Walkthrough',
    category: legacyMission.category || 'Operations',
    description: legacyMission.description || '',
    steps: (legacyMission.steps || []).map((s, idx) => normalizeLegacyStep(s, idx)),
  };
}

/**
 * Returns role-aware mission catalog.
 */
export function getCatalogForRole(userRole = 'Branch Manager') {
  if (userRole === 'Super Admin') {
    return [superAdminInterimMission];
  }
  return branchManagerMissions.map(m => normalizeLegacyMission(m));
}
