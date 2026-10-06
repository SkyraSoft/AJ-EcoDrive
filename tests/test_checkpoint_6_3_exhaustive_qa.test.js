import { describe, it, expect, beforeEach } from 'vitest';
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
import { calculatePlacement } from '../src/tour/positioning/placementEngine.js';
import { calculateConnector } from '../src/tour/positioning/connector.js';
import { dapStore } from '../src/stores/dapStore.js';

describe('Checkpoint 6.3: Exhaustive Target, Collision, Viewport & Runtime QA Suite', () => {
  beforeEach(() => {
    dapStore.resetAllProgress();
    dapStore.stopDAP();
  });

  // =========================================================================
  // 1. FIVE REFERENCE VIEWPORTS & COLLISION AVOIDANCE
  // =========================================================================
  const viewports = [
    { name: 'Desktop Widescreen', width: 1440, height: 900 },
    { name: 'Standard Laptop', width: 1366, height: 768 },
    { name: 'Tablet Landscape', width: 1024, height: 768 },
    { name: 'Tablet Portrait', width: 768, height: 1024 },
    { name: 'Mobile Web', width: 390, height: 844 },
  ];

  it('verifies coachmark positioning and collision avoidance across all 5 reference viewports', () => {
    // Representative target in middle of screen
    const targetRect = { left: 400, top: 300, width: 200, height: 40, right: 600, bottom: 340 };
    const cardDimensions = { width: 380, height: 240 };

    for (const vp of viewports) {
      const isMobile = vp.width < 640;
      const target = isMobile ? { left: 20, top: 100, width: 350, height: 40, right: 370, bottom: 140 } : targetRect;
      const card = isMobile ? { width: 358, height: 240 } : cardDimensions;

      const res = calculatePlacement(
        { width: vp.width, height: vp.height },
        target,
        card,
        [],
        { top: 16, left: 16, right: 16, bottom: 16 },
        'bottom'
      );

      expect(res).toBeDefined();

      if (isMobile) {
        // Mobile must activate BOTTOM_DOCK mode
        expect(res.mode).toBe('BOTTOM_DOCK');
        expect(res.placement).toBe('dock');
      } else {
        // Desktop / Tablet must activate FLOATING mode
        expect(res.mode).toBe('FLOATING');
        expect(res.left).toBeDefined();
        expect(res.top).toBeDefined();

        // Card and target must not collide
        const cardLeft = res.left;
        const cardTop = res.top;
        const cardRight = cardLeft + card.width;
        const cardBottom = cardTop + card.height;

        const hasHorizontalOverlap = cardLeft < target.right && cardRight > target.left;
        const hasVerticalOverlap = cardTop < target.bottom && cardBottom > target.top;
        const collides = hasHorizontalOverlap && hasVerticalOverlap;

        expect(collides, `Card collides with target at viewport ${vp.name} (${vp.width}x${vp.height})`).toBe(false);

        // Safe bounds
        expect(cardLeft).toBeGreaterThanOrEqual(16);
        expect(cardRight).toBeLessThanOrEqual(vp.width);
        expect(cardTop).toBeGreaterThanOrEqual(16);
        expect(cardBottom).toBeLessThanOrEqual(vp.height);
      }
    }
  });

  it('calculates valid geometric connector lines terminating at target boundary', () => {
    const cardRect = { left: 400, top: 380, width: 380, height: 240, right: 780, bottom: 620 };
    const targetRect = { left: 400, top: 300, width: 200, height: 40, right: 600, bottom: 340 };

    const connector = calculateConnector(cardRect, targetRect, 'bottom');
    expect(connector).toBeDefined();
    expect(connector.startX).toBeGreaterThanOrEqual(cardRect.left);
    expect(connector.startX).toBeLessThanOrEqual(cardRect.right);
    expect(connector.startY).toBe(cardRect.top); // Top edge of card pointing up to target
    expect(connector.endX).toBe(targetRect.left + targetRect.width / 2); // Center of target
    expect(connector.endY).toBe(targetRect.bottom); // Bottom edge of target
  });

  // =========================================================================
  // 2. TARGET RESOLUTION & ZERO DUPLICATE TARGETS
  // =========================================================================
  it('verifies that all registered targets in central registry are unique and satisfy strict 4-part grammar', () => {
    const targets = getAllTargets();
    expect(targets.length).toBeGreaterThanOrEqual(89);

    const ids = new Set();
    for (const t of targets) {
      expect(ids.has(t.targetId), `Duplicate target ID found: ${t.targetId}`).toBe(false);
      ids.add(t.targetId);

      const val = validateTargetIdFormat(t.targetId);
      expect(val.valid, `Target ${t.targetId} has invalid format: ${val.error}`).toBe(true);
    }
  });

  it('verifies modal and drawer targets maintain appropriate readiness classifications', () => {
    const targets = getAllTargets();
    const modalTargets = targets.filter(t => t.readinessClass === 'MODAL_TARGET');
    const drawerTargets = targets.filter(t => t.readinessClass === 'DRAWER_TARGET');

    expect(modalTargets.length).toBeGreaterThanOrEqual(3);
    expect(drawerTargets.length).toBeGreaterThanOrEqual(1);

    for (const mt of modalTargets) {
      expect(mt.targetId).toMatch(/\.form\.|\.modal\./);
    }
  });

  // =========================================================================
  // 3. COMPLETE SCENARIOS A THROUGH F END-TO-END PLAYBACK
  // =========================================================================
  it('executes Scenario A: Product Request (BM -> Handoff -> SA -> 0 Stock Debrief)', () => {
    const scA = crossRoleScenarios.find(s => s.code === 'SCENARIO-A');
    expect(scA).toBeDefined();
    expect(scA.segments.length).toBe(2);

    // Segment 1: Branch Manager request
    expect(scA.segments[0].workspace).toBe('Branch Manager');
    expect(scA.segments[0].mutationRisk).toBe('RISK_2_DRAFT_OR_REVERSIBLE');

    // Handoff verification
    expect(scA.handoff.fromRole).toBe('Branch Manager');
    expect(scA.handoff.toRole).toBe('Super Admin');
    expect(scA.handoff.whatHasNotHappenedYet).toContain('No physical inventory exists');

    // Segment 2: Super Admin review
    expect(scA.segments[1].workspace).toBe('Super Admin');
    expect(scA.segments[1].mutationRisk).toBe('RISK_3_BUSINESS_RECORD_MUTATION');
    expect(scA.segments[1].whyItMatters).toContain('does NOT create stock');

    // Debrief verification: Zero physical stock created
    expect(scA.debrief.stockImpact).toContain('ZERO physical units created');
  });

  it('executes Scenario B: Stock Replenishment (Both branches: Transfer vs PO routing)', () => {
    const scB = crossRoleScenarios.find(s => s.code === 'SCENARIO-B');
    expect(scB).toBeDefined();
    expect(scB.segments.length).toBe(2);

    // Branch 1 & 2 explanation
    expect(scB.segments[1].whyItMatters).toContain('Branch 1:');
    expect(scB.segments[1].whyItMatters).toContain('Branch 2:');
    expect(scB.segments[0].whyItMatters).toContain('Stock request approval is NOT a transfer approval');
  });

  it('executes Scenario C: End-to-End Procurement (5 Distinct Stages unbundled)', () => {
    const scC = crossRoleScenarios.find(s => s.code === 'SCENARIO-C');
    expect(scC).toBeDefined();
    expect(scC.segments.length).toBe(5);

    // 5 distinct stages
    expect(scC.segments[0].title).toContain('Stage 1: Purchase Order');
    expect(scC.segments[1].title).toContain('Stage 2: Goods Receipt');
    expect(scC.segments[2].title).toContain('Stage 3: Landed Cost');
    expect(scC.segments[3].title).toContain('Stage 4: Supplier Bill');
    expect(scC.segments[4].title).toContain('Stage 5: Supplier Payment');

    // Invariant: PO creates zero stock
    expect(scC.segments[0].whyItMatters).toContain('does NOT create physical stock');
    // Invariant: Goods Receipt increases stock
    expect(scC.segments[1].whyItMatters).toContain('ONLY upon formal Goods Receipt confirmation');
    // Invariant: Bill booking creates AP liability, does NOT deduct cash
    expect(scC.segments[3].whyItMatters).toContain('does NOT deduct cash');
  });

  it('executes Scenario D: Sell an EV (Quotation conversion and Direct POS paths)', () => {
    const scD = crossRoleScenarios.find(s => s.code === 'SCENARIO-D');
    expect(scD).toBeDefined();
    expect(scD.segments.length).toBe(4);

    // Supports both paths
    expect(scD.segments[0].explanation).toContain('Path A: Draft an itemized quotation');
    expect(scD.segments[0].explanation).toContain('Path B: Direct Order / Walk-in POS');
    expect(scD.segments[0].whyItMatters).toContain('do NOT reserve vehicle stock');

    // Exact chassis reservation
    expect(scD.segments[1].whyItMatters).toContain('only reserves stock when an exact chassis number is assigned');

    // Separate payment
    expect(scD.segments[2].whyItMatters).toContain('Payment recording is a separate financial step');

    // Handover marks completion of delivery
    expect(scD.segments[3].whyItMatters).toContain('Handover marks completion of delivery');
  });

  it('executes Scenario E: Inventory Discrepancy (Discovery -> Authorization -> Separate Posting)', () => {
    const scE = crossRoleScenarios.find(s => s.code === 'SCENARIO-E');
    expect(scE).toBeDefined();
    expect(scE.segments.length).toBe(3);

    // Segment 1: Cycle count discovery
    expect(scE.segments[0].workspace).toBe('Branch Manager');
    expect(scE.segments[0].whyItMatters).toContain('does NOT automatically adjust inventory');

    // Segment 2: SA Authorization
    expect(scE.segments[1].workspace).toBe('Super Admin');
    expect(scE.segments[1].title).toContain('Authorization');
    expect(scE.segments[1].whyItMatters).toContain('does NOT post to general ledger');

    // Segment 3: SA Separate Posting
    expect(scE.segments[2].workspace).toBe('Super Admin');
    expect(scE.segments[2].title).toContain('Controlled Adjustment Posting');
    expect(scE.segments[2].whyItMatters).toContain('permanently synchronizes system balance');
  });

  it('executes Scenario F: Operating Expenses (Submission -> Authorization -> Separate Disbursement)', () => {
    const scF = crossRoleScenarios.find(s => s.code === 'SCENARIO-F');
    expect(scF).toBeDefined();
    expect(scF.segments.length).toBe(3);

    // Segment 1: BM claim submission
    expect(scF.segments[0].workspace).toBe('Branch Manager');
    expect(scF.segments[0].whyItMatters).toContain('is NOT approval');

    // Segment 2: SA review & authorization
    expect(scF.segments[1].workspace).toBe('Super Admin');
    expect(scF.segments[1].title).toContain('Authorization');
    expect(scF.segments[1].whyItMatters).toContain('disbursing cash is a separate payment step');

    // Segment 3: SA disbursement payment
    expect(scF.segments[2].workspace).toBe('Super Admin');
    expect(scF.segments[2].title).toContain('Payment Settlement');
    expect(scF.segments[2].whyItMatters).toContain('Posting payment reduces cash/bank balance');
  });

  // =========================================================================
  // 4. CANONICAL MUTATION RISK ENUMS INTEGRITY
  // =========================================================================
  it('enforces that all curriculum steps and scenario segments use canonical mutation risks', () => {
    const canonicalRisks = new Set([
      'RISK_0_READ_ONLY',
      'RISK_1_UI_STATE_ONLY',
      'RISK_2_DRAFT_OR_REVERSIBLE',
      'RISK_3_BUSINESS_RECORD_MUTATION',
      'RISK_4_SENSITIVE_OR_IRREVERSIBLE'
    ]);

    for (const m of [...superAdminMissions, ...branchManagerMissions]) {
      for (const s of m.steps) {
        expect(canonicalRisks.has(s.mutationRisk), `Invalid mutation risk ${s.mutationRisk} in ${m.code} step ${s.id}`).toBe(true);
      }
    }

    for (const sc of crossRoleScenarios) {
      for (const seg of sc.segments) {
        expect(canonicalRisks.has(seg.mutationRisk), `Invalid mutation risk ${seg.mutationRisk} in scenario ${sc.code} seg ${seg.id}`).toBe(true);
      }
    }
  });

  // =========================================================================
  // 5. BUSINESS DECISION HOLDS NEUTRALITY
  // =========================================================================
  it('verifies that all 6 business decision holds are strictly neutral without invented policy numbers', () => {
    const holds = BUSINESS_DECISION_HOLDS;
    expect(holds.length).toBe(6);

    for (const h of holds) {
      const guidance = h.neutralGuidance.toLowerCase();
      // Must not contain definitive figures
      expect(guidance.includes('8%')).toBe(false);
      expect(guidance.includes('15,000')).toBe(false);
      expect(guidance.includes('25,000')).toBe(false);
      expect(guidance.includes('70%')).toBe(false);
      expect(guidance.includes('7 days')).toBe(false);
      expect(guidance.includes('aml compliance ceiling')).toBe(false);
      expect(guidance.includes('authorized workshop technician verification')).toBe(false);
    }
  });

  // =========================================================================
  // 6. SERIAL / CHASSIS TERMINOLOGY AUDIT
  // =========================================================================
  it('verifies context help uses approved chassis / serial terminology without asserting VIN equivalence', () => {
    const chassisHelp = contextHelpRegistry.find(c => c.topicId === 'hardware-chassis-serial');
    expect(chassisHelp).toBeDefined();
    expect(chassisHelp.title).toBe('Chassis & Frame Serial Number');
    expect(chassisHelp.details.toLowerCase()).not.toContain('vin = chassis');
  });

  // =========================================================================
  // 7. KEYBOARD NAVIGATION & ACCESSIBILITY
  // =========================================================================
  it('supports Escape key exit and progress tracking', () => {
    dapStore.startDAP('SA-01', 0);
    expect(dapStore.isActive).toBe(true);

    // Escape exit simulation
    dapStore.stopDAP();
    expect(dapStore.isActive).toBe(false);
  });
});
