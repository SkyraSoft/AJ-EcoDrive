import { describe, it, expect } from 'vitest';
import { superAdminMissions } from '../src/tour/content/superAdmin/superAdminMissions.js';
import { branchManagerMissions } from '../src/tour/content/branchManager/branchManagerMissions.js';
import { crossRoleScenarios } from '../src/tour/content/scenarios/crossRoleScenarios.js';
import { contextHelpRegistry } from '../src/tour/content/contextHelp/contextHelpRegistry.js';
import {
  fieldGuideRegistry,
  getFieldMatrixSummary,
  BUSINESS_DECISION_HOLDS
} from '../src/tour/content/fieldGuides/fieldGuideRegistry.js';
import {
  getMissionsForRole,
  getMissionById,
  getPageTour,
  getQuickOrientation,
  getFieldGuides,
  getGuidedTasks,
  getContextHelp,
  getAllScenarios,
  TOUR_MODES
} from '../src/tour/content/catalog.js';
import { getAllTargets, validateRegistry, validateTargetIdFormat } from '../src/tour/targetRegistry.js';

describe('Checkpoint 6.2: Full Curriculum Catalog Integrity Tests', () => {
  // 1. Authoritative Module & Denominator Counts
  it('enforces exact curriculum module denominators: 20 SA, 19 BM, 6 Scenarios', () => {
    expect(superAdminMissions.length).toBe(20);
    expect(branchManagerMissions.length).toBe(19);
    expect(crossRoleScenarios.length).toBe(6);
  });

  it('verifies all 20 Super Admin module codes (SA-01 to SA-20) are unique and sequential', () => {
    const codes = superAdminMissions.map(m => m.code);
    expect(new Set(codes).size).toBe(20);
    for (let i = 1; i <= 20; i++) {
      const expected = `SA-${String(i).padStart(2, '0')}`;
      expect(codes).toContain(expected);
    }
  });

  it('verifies all 19 Branch Manager module codes (BM-01 to BM-19) are unique and sequential', () => {
    const codes = branchManagerMissions.map(m => m.code);
    expect(new Set(codes).size).toBe(19);
    for (let i = 1; i <= 19; i++) {
      const expected = `BM-${String(i).padStart(2, '0')}`;
      expect(codes).toContain(expected);
    }
  });

  it('verifies all 6 cross-role scenario codes (SCENARIO-A to SCENARIO-F) are unique', () => {
    const codes = crossRoleScenarios.map(s => s.code);
    expect(new Set(codes).size).toBe(6);
    const expected = ['SCENARIO-A', 'SCENARIO-B', 'SCENARIO-C', 'SCENARIO-D', 'SCENARIO-E', 'SCENARIO-F'];
    for (const exp of expected) {
      expect(codes).toContain(exp);
    }
  });

  it('enforces uniqueness of all mission and content IDs across the entire catalog', () => {
    const allMissionIds = new Set();
    const allStepIds = new Set();

    for (const m of [...superAdminMissions, ...branchManagerMissions]) {
      expect(allMissionIds.has(m.id)).toBe(false);
      allMissionIds.add(m.id);

      for (const s of m.steps) {
        expect(allStepIds.has(s.id)).toBe(false);
        allStepIds.add(s.id);
      }
    }

    for (const sc of crossRoleScenarios) {
      expect(allMissionIds.has(sc.id)).toBe(false);
      allMissionIds.add(sc.id);

      for (const seg of sc.segments) {
        expect(allStepIds.has(seg.id)).toBe(false);
        allStepIds.add(seg.id);
      }
    }
  });

  // 2. Role Isolation & Access Control
  it('enforces strict role workspace declarations on curriculum modules', () => {
    for (const m of superAdminMissions) {
      expect(m.workspace).toBe('Super Admin');
    }
    for (const m of branchManagerMissions) {
      expect(m.workspace).toBe('Branch Manager');
    }
  });

  it('catalog provider isolates missions by role', () => {
    const saCatalog = getMissionsForRole('Super Admin');
    const bmCatalog = getMissionsForRole('Branch Manager');

    // Super Admin gets 20 SA + 6 Scenarios = 26
    expect(saCatalog.length).toBe(26);
    // Branch Manager gets 19 BM + 6 Scenarios = 25
    expect(bmCatalog.length).toBe(25);

    // Verify SA catalog does not contain any BM-exclusive modules
    for (const m of saCatalog) {
      if (m.code.startsWith('BM-')) {
        expect.fail(`SA catalog should not contain BM module ${m.code}`);
      }
    }

    // Verify BM catalog does not contain any SA-exclusive modules
    for (const m of bmCatalog) {
      if (m.code.startsWith('SA-')) {
        expect.fail(`BM catalog should not contain SA module ${m.code}`);
      }
    }
  });

  // 3. Strict 4-Part Target Grammar & Registry Resolution
  it('enforces strict 4-part semantic target ID grammar across all curriculum steps', () => {
    const checkedTargets = new Set();

    function verifyTarget(targetId, ctx) {
      if (!targetId || targetId === 'NONE') return;
      checkedTargets.add(targetId);
      const validation = validateTargetIdFormat(targetId);
      expect(validation.valid, `Target ${targetId} in ${ctx} must be valid: ${validation.error}`).toBe(true);
    }

    for (const m of superAdminMissions) {
      for (const s of m.steps) {
        verifyTarget(s.targetId, `SA ${m.code} step ${s.id}`);
      }
    }

    for (const m of branchManagerMissions) {
      for (const s of m.steps) {
        verifyTarget(s.targetId, `BM ${m.code} step ${s.id}`);
      }
    }

    for (const sc of crossRoleScenarios) {
      for (const seg of sc.segments) {
        verifyTarget(seg.targetId, `Scenario ${sc.code} segment ${seg.id}`);
      }
    }

    for (const ch of contextHelpRegistry) {
      verifyTarget(ch.targetId, `Context Help ${ch.topicId}`);
    }

    expect(checkedTargets.size).toBeGreaterThanOrEqual(80);
  });

  it('validates that central targetRegistry is clean and contains all curriculum targets', () => {
    const audit = validateRegistry();
    expect(audit.valid).toBe(true);
    expect(audit.errors.length).toBe(0);

    const allRegTargets = getAllTargets();
    expect(allRegTargets.length).toBeGreaterThanOrEqual(85);
  });

  // 4. 640 Logical Field Matrix Reconciliation
  it('reconciles exact 640 logical fields across Dimension A and Dimension B', () => {
    const summary = getFieldMatrixSummary();
    expect(summary.totalFields).toBe(640);

    // Dimension A: Role Applicability
    expect(summary.dimensionA.SA_ONLY).toBeGreaterThan(0);
    expect(summary.dimensionA.BM_ONLY).toBeGreaterThan(0);
    expect(summary.dimensionA.SHARED_SAME_GUIDANCE).toBeGreaterThan(0);
    expect(summary.dimensionA.SHARED_ROLE_SPECIFIC_GUIDANCE).toBeGreaterThan(0);
    expect(
      summary.dimensionA.SA_ONLY +
      summary.dimensionA.BM_ONLY +
      summary.dimensionA.SHARED_SAME_GUIDANCE +
      summary.dimensionA.SHARED_ROLE_SPECIFIC_GUIDANCE
    ).toBe(640);

    // Dimension B: Guidance Treatment
    expect(summary.dimensionB.FULL_FIELD_GUIDE).toBeGreaterThan(0);
    expect(summary.dimensionB.GROUPED_FIELD_GUIDE).toBeGreaterThan(0);
    expect(summary.dimensionB.SELF_EVIDENT_NO_DEDICATED_GUIDE).toBeGreaterThan(0);
    expect(summary.dimensionB.BUSINESS_DECISION_BLOCKED).toBeGreaterThan(0);
    expect(
      summary.dimensionB.FULL_FIELD_GUIDE +
      summary.dimensionB.GROUPED_FIELD_GUIDE +
      summary.dimensionB.SELF_EVIDENT_NO_DEDICATED_GUIDE +
      summary.dimensionB.BUSINESS_DECISION_BLOCKED
    ).toBe(640);

    // All 6 Business Decision Holds Covered
    expect(summary.holdsCovered.length).toBe(6);
    expect(BUSINESS_DECISION_HOLDS.length).toBe(6);
  });

  // 5. Cross-Role Scenarios Quality & Invariants
  it('verifies all 6 scenarios contain explicit role handoffs and structured debrief cards', () => {
    for (const sc of crossRoleScenarios) {
      expect(sc.segments.length).toBeGreaterThanOrEqual(2);
      expect(sc.handoff).toBeDefined();
      expect(sc.handoff.whatYouCompleted).toBeTruthy();
      expect(sc.handoff.whatChanged).toBeTruthy();
      expect(sc.handoff.nextOwner).toBeTruthy();
      expect(sc.handoff.whatNextOwnerDoes).toBeTruthy();
      expect(sc.handoff.whatHasNotHappenedYet).toBeTruthy();
      expect(sc.handoff.whatYouShouldCheckNext).toBeTruthy();

      expect(sc.debrief).toBeDefined();
      expect(sc.debrief.recordImpact).toBeTruthy();
      expect(sc.debrief.stockImpact).toBeTruthy();
      expect(sc.debrief.moneyImpact).toBeTruthy();
      expect(sc.debrief.customerOrderImpact).toBeTruthy();
      expect(sc.debrief.nextOwner).toBeTruthy();
      expect(sc.debrief.nextCheck).toBeTruthy();
    }
  });

  // 6. Five Tour Modes Integration
  it('wires all 5 user-facing tour modes correctly in catalog provider', () => {
    // Mode 1: Quick Orientation
    const qo = getQuickOrientation('/dashboard', 'Super Admin');
    expect(qo).toBeDefined();
    expect(qo.tourLevels).toContain(TOUR_MODES.QUICK_ORIENTATION);

    // Mode 2: Learn This Page (Page Tour)
    const pt = getPageTour('/dashboard', 'Super Admin');
    expect(pt).toBeDefined();

    // Mode 3: Show Me Every Field (Field Guide)
    const fg = getFieldGuides('/sales/customers', 'Branch Manager');
    expect(Array.isArray(fg)).toBe(true);

    // Mode 4: Guide Me Through This Task (Guided Task)
    const tasks = getGuidedTasks('/sales/orders', 'Branch Manager');
    expect(Array.isArray(tasks)).toBe(true);

    // Mode 5: What Does This Mean? (Context Help)
    const ch = getContextHelp('status-available');
    expect(ch).toBeDefined();
    expect(ch.title).toContain('Available');
  });

  // 7. Policy-Safety Verification Scan
  it('ensures zero unauthorized definitive policy figures in employee copy', () => {
    const forbiddenPhrases = [
      '8% discount ceiling',
      'universal 8%',
      'must be 8%',
      'PKR 15,000 threshold',
      'universal PKR 15,000',
      'PKR 25,000 universal',
      'PKR 50,000 universal',
      'strictly 7 days',
      'strictly 70% SOH',
      '30,000 km mandatory',
      '18-point PDI',
      'minimum price floor strictly'
    ];

    function scanText(text, context) {
      if (!text) return;
      const lower = text.toLowerCase();
      for (const phrase of forbiddenPhrases) {
        expect(lower.includes(phrase.toLowerCase()), `Unauthorized phrase "${phrase}" found in ${context}`).toBe(false);
      }
    }

    for (const m of [...superAdminMissions, ...branchManagerMissions]) {
      scanText(m.title, `${m.code} title`);
      scanText(m.description, `${m.code} description`);
      for (const s of m.steps) {
        scanText(s.title, `${m.code} step ${s.id} title`);
        scanText(s.explanation, `${m.code} step ${s.id} explanation`);
        scanText(s.instruction, `${m.code} step ${s.id} instruction`);
        scanText(s.whyItMatters, `${m.code} step ${s.id} whyItMatters`);
      }
    }

    for (const sc of crossRoleScenarios) {
      scanText(sc.title, `${sc.code} title`);
      scanText(sc.description, `${sc.code} description`);
      scanText(sc.handoff.whatYouCompleted, `${sc.code} handoff completed`);
      scanText(sc.handoff.whatHasNotHappenedYet, `${sc.code} handoff not happened`);
      scanText(sc.debrief.recordImpact, `${sc.code} debrief recordImpact`);
      scanText(sc.debrief.stockImpact, `${sc.code} debrief stockImpact`);
    }
  });

  // 8. Architecture & Security Claims Scan
  it('ensures zero unsupported architectural or security claims in employee copy', () => {
    const unsupportedClaims = [
      'server-enforced branch isolation',
      'tamper-proof ledger',
      'immutable ledger',
      'cryptographic protection',
      'Electron',
      'Tauri',
      'native mobile app'
    ];

    function scanSecurity(text, context) {
      if (!text) return;
      for (const claim of unsupportedClaims) {
        expect(text.includes(claim), `Unsupported claim "${claim}" found in ${context}`).toBe(false);
      }
    }

    for (const m of [...superAdminMissions, ...branchManagerMissions]) {
      scanSecurity(m.description, `${m.code} description`);
      for (const s of m.steps) {
        scanSecurity(s.explanation, `${m.code} step ${s.id} explanation`);
      }
    }
  });

  // 9. Developer Jargon Scan
  it('ensures zero developer jargon terms in user-facing employee copy', () => {
    const jargonList = [
      'payload',
      'mutation',
      'Pinia',
      'router.push',
      'modelValue',
      'computed',
      'watcher',
      'API endpoint',
      'DOM selector'
    ];

    function scanJargon(text, context) {
      if (!text) return;
      const lower = text.toLowerCase();
      for (const j of jargonList) {
        expect(lower.includes(j.toLowerCase()), `Developer jargon "${j}" found in employee copy at ${context}`).toBe(false);
      }
    }

    for (const m of [...superAdminMissions, ...branchManagerMissions]) {
      for (const s of m.steps) {
        scanJargon(s.explanation, `${m.code} step ${s.id} explanation`);
        scanJargon(s.instruction, `${m.code} step ${s.id} instruction`);
      }
    }

    for (const sc of crossRoleScenarios) {
      for (const seg of sc.segments) {
        scanJargon(seg.explanation, `${sc.code} segment ${seg.id} explanation`);
        scanJargon(seg.instruction, `${sc.code} segment ${seg.id} instruction`);
      }
    }
  });

  // 10. Business Invariants Verification
  it('validates that fundamental dealership business invariants are maintained in educational copy', () => {
    // Invariant: Product creation creates zero physical stock
    const sa05 = superAdminMissions.find(m => m.code === 'SA-05');
    const hasZeroStock = sa05.steps.some(s => s.whyItMatters.includes('ZERO physical stock') || s.explanation.includes('zero physical stock'));
    expect(hasZeroStock).toBe(true);

    // Invariant: Quotation does NOT reserve stock
    const bm05 = branchManagerMissions.find(m => m.code === 'BM-05');
    const quoteStep = bm05.steps.find(s => s.whyItMatters.includes('does NOT reserve'));
    expect(quoteStep).toBeDefined();

    // Invariant: Stock Request Approval != Transfer Approval (moves via Transfer)
    const bm11 = branchManagerMissions.find(m => m.code === 'BM-11');
    const reqStep = bm11.steps.find(s => s.whyItMatters.includes('Inter-Branch Transfer'));
    expect(reqStep).toBeDefined();

    // Invariant: Expense Approval != Payment (disbursement follows authorized workflow)
    const sa17 = superAdminMissions.find(m => m.code === 'SA-17');
    const expStep = sa17.steps.find(s => s.whyItMatters.includes('cash disbursement follows'));
    expect(expStep).toBeDefined();
  });
});
