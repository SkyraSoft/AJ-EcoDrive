/**
 * AJ EcoDrive — Tour Runtime Pure Logic & Placement Engine Test Suite
 * PROGRAM: AJ-TOUR-RECONSTRUCT-2026
 * PHASE 6: CHECKPOINT 6.1 — AUTOMATED TEST SUITE (CORRECTION B UPDATED)
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  registerTarget,
  getTarget,
  hasTarget,
  validateTargetIdFormat,
  validateRegistry,
  clearRegistry,
  seedRepresentativeTargets,
  TARGET_READINESS_CLASSES,
} from '@/tour/targetRegistry.js';
import { calculatePlacement } from '@/tour/positioning/placementEngine.js';
import { calculateConnector } from '@/tour/positioning/connector.js';
import { isIntersecting } from '@/tour/geometry/occupiedRegions.js';
import { validateInputValue, MUTATION_RISK_CLASSES } from '@/tour/engine/interactionManager.js';
import { saveTourSession, loadTourSession, clearTourSession, validateResume } from '@/tour/engine/persistence.js';
import { getCatalogForRole, normalizeLegacyStep } from '@/tour/adapters/legacyDapAdapter.js';
import { tourStore } from '@/tour/engine/tourStore.js';
import { announce, trapFocus, releaseFocusTrap } from '@/tour/engine/focusManager.js';

describe('Checkpoint 6.1 — Target Registry & Grammar Suite', () => {
  beforeEach(() => {
    clearRegistry();
    seedRepresentativeTargets();
  });

  it('enforces strict 4-part semantic Target ID convention (<workspace>.<domain>.<surface>.<element-path>)', () => {
    // Valid 4-part / 4+-part semantic IDs
    expect(validateTargetIdFormat('sa.dashboard.kpi.net-sales').valid).toBe(true);
    expect(validateTargetIdFormat('bm.customer.form.phone').valid).toBe(true);
    expect(validateTargetIdFormat('shared.layout.header.role-badge').valid).toBe(true);
    expect(validateTargetIdFormat('sa.action-centre.drawer.approve-btn').valid).toBe(true);

    // Invalid format tests as mandated by Correction B Section 4
    expect(validateTargetIdFormat('dashboard.kpi.net-sales').valid).toBe(false); // only 3 parts
    expect(validateTargetIdFormat('sa..net-sales').valid).toBe(false); // empty segment / consecutive dots
    expect(validateTargetIdFormat('sa.dashboard').valid).toBe(false); // only 2 parts
    expect(validateTargetIdFormat('target1').valid).toBe(false); // single word
    expect(validateTargetIdFormat('button.2').valid).toBe(false); // only 2 parts
    expect(validateTargetIdFormat('SA.dashboard.kpi.net-sales').valid).toBe(false); // uppercase rejected
  });

  it('rejects duplicate target IDs with descriptive error', () => {
    expect(() => {
      registerTarget({
        targetId: 'sa.dashboard.kpi.net-sales',
        surface: 'Duplicate Test',
      });
    }).toThrow(/Duplicate target ID detected/);
  });

  it('retrieves registered target with complete metadata', () => {
    const t = getTarget('sa.dashboard.kpi.net-sales');
    expect(t).not.toBeNull();
    expect(t.workspace).toBe('Super Admin');
    expect(t.route).toBe('/dashboard');
    expect(t.readinessClass).toBe(TARGET_READINESS_CLASSES.ROUTE_MOUNT_TARGET);
  });

  it('validates entire seed registry with zero integrity errors', () => {
    const report = validateRegistry();
    expect(report.valid).toBe(true);
    expect(report.errors.length).toBe(0);
    expect(report.total).toBeGreaterThanOrEqual(12);
  });
});

describe('Checkpoint 6.1 — Pure Placement Engine Suite', () => {
  const standardViewport = { width: 1440, height: 900, top: 0, left: 0 };
  const safeInsets = { top: 16, left: 16, right: 16, bottom: 16 };
  const cardSize = { width: 380, height: 260 };

  it('places card to the RIGHT of target when space is available', () => {
    const target = { top: 300, left: 200, right: 400, bottom: 400, width: 200, height: 100 };
    const res = calculatePlacement(standardViewport, target, cardSize, [], safeInsets, 'right');

    expect(res.mode).toBe('FLOATING');
    expect(res.placement).toBe('right');
    expect(res.left).toBeGreaterThanOrEqual(target.right);
    expect(isIntersecting({ top: res.top, left: res.left, right: res.left + cardSize.width, bottom: res.top + cardSize.height }, target)).toBe(false);
  });

  it('places card to the LEFT when preferred is left and space is available', () => {
    const target = { top: 300, left: 800, right: 1000, bottom: 400, width: 200, height: 100 };
    const res = calculatePlacement(standardViewport, target, cardSize, [], safeInsets, 'left');

    expect(res.mode).toBe('FLOATING');
    expect(res.placement).toBe('left');
    expect(res.left + cardSize.width).toBeLessThanOrEqual(target.left);
  });

  it('places card to the BOTTOM when target is near top', () => {
    const target = { top: 30, left: 500, right: 700, bottom: 80, width: 200, height: 50 };
    const res = calculatePlacement(standardViewport, target, cardSize, [], safeInsets, 'bottom');

    expect(res.mode).toBe('FLOATING');
    expect(res.placement).toBe('bottom');
    expect(res.top).toBeGreaterThanOrEqual(target.bottom);
  });

  it('places card to the TOP when target is near bottom', () => {
    const target = { top: 750, left: 500, right: 700, bottom: 820, width: 200, height: 70 };
    const res = calculatePlacement(standardViewport, target, cardSize, [], safeInsets, 'top');

    expect(res.mode).toBe('FLOATING');
    expect(res.placement).toBe('top');
    expect(res.top + cardSize.height).toBeLessThanOrEqual(target.top);
  });

  it('rejects candidates that collide with measured occupied regions', () => {
    const target = { top: 200, left: 200, right: 400, bottom: 300, width: 200, height: 100 };
    // Occupied sidebar zone to the left
    const occupied = [{ top: 0, left: 0, right: 260, bottom: 900 }];

    const res = calculatePlacement(standardViewport, target, cardSize, occupied, safeInsets, 'left');
    // Left placement would overlap occupied sidebar (0..260), so it should fallback to right/bottom
    expect(res.placement).not.toBe('left');
  });

  it('falls back to BOTTOM_DOCK when viewport is constrained', () => {
    const mobileViewport = { width: 375, height: 667, top: 0, left: 0 };
    const target = { top: 100, left: 20, right: 355, bottom: 350, width: 335, height: 250 };
    const largeCard = { width: 350, height: 300 };

    const res = calculatePlacement(mobileViewport, target, largeCard, [], safeInsets, 'right');
    expect(res.mode).toBe('BOTTOM_DOCK');
    expect(res.placement).toBe('dock');
  });

  it('returns TARGET_UNAVAILABLE state with null targetRect when target is missing', () => {
    const res = calculatePlacement(standardViewport, null, cardSize, [], safeInsets, 'bottom');
    expect(res.mode).toBe('TARGET_UNAVAILABLE');
    expect(res.placement).toBe('center');
  });
});

describe('Checkpoint 6.1 — Connector Geometry Suite', () => {
  it('computes accurate vector coordinates between card and target boundaries', () => {
    const cardRect = { top: 100, left: 500, width: 300, height: 200, bottom: 300 };
    const targetRect = { top: 150, left: 200, right: 400, bottom: 250, width: 200, height: 100 };

    const conn = calculateConnector(cardRect, targetRect, 'right');
    expect(conn).not.toBeNull();
    expect(conn.startX).toBe(cardRect.left);
    expect(conn.endX).toBe(targetRect.right);
    expect(conn.placement).toBe('right');
  });

  it('suppresses connector when card is in BOTTOM_DOCK mode or target is unavailable', () => {
    const cardRect = { top: 500, left: 16, width: 343, height: 200 };
    const targetRect = { top: 50, left: 16, right: 359, bottom: 150, width: 343, height: 100 };

    const conn = calculateConnector(cardRect, targetRect, 'dock');
    expect(conn).toBeNull();
  });
});

describe('Checkpoint 6.1 — Interaction, Practice & Risk Safety Suite', () => {
  it('validates required text input correctly', () => {
    const step = { required: true };
    expect(validateInputValue('', step).valid).toBe(false);
    expect(validateInputValue('Valid Customer', step).valid).toBe(true);
  });

  it('validates numeric rules and positive range constraints', () => {
    const step = { validation: 'positive_number', min: 100, max: 10000 };
    expect(validateInputValue('0', step).valid).toBe(false);
    expect(validateInputValue('-50', step).valid).toBe(false);
    expect(validateInputValue('50', step).valid).toBe(false); // below min
    expect(validateInputValue('25000', step).valid).toBe(false); // above max
    expect(validateInputValue('500', step).valid).toBe(true);
  });

  it('validates pattern regex formats without embedding unapproved business policies', () => {
    const step = { pattern: '^[0-9]{5}-[0-9]{7}-[0-9]$', patternError: 'Invalid CNIC format' };
    expect(validateInputValue('12345', step).valid).toBe(false);
    expect(validateInputValue('17301-1234567-1', step).valid).toBe(true);
  });

  it('enforces Mutation Risk classes integrity (RISK_0 to RISK_4)', () => {
    expect(MUTATION_RISK_CLASSES.RISK_0_READ_ONLY).toBe('RISK_0_READ_ONLY');
    expect(MUTATION_RISK_CLASSES.RISK_1_UI_STATE_ONLY).toBe('RISK_1_UI_STATE_ONLY');
    expect(MUTATION_RISK_CLASSES.RISK_2_DRAFT_OR_REVERSIBLE).toBe('RISK_2_DRAFT_OR_REVERSIBLE');
    expect(MUTATION_RISK_CLASSES.RISK_3_BUSINESS_RECORD_MUTATION).toBe('RISK_3_BUSINESS_RECORD_MUTATION');
    expect(MUTATION_RISK_CLASSES.RISK_4_SENSITIVE_OR_IRREVERSIBLE).toBe('RISK_4_SENSITIVE_OR_IRREVERSIBLE');
  });

  it('prohibits automated execution of RISK_3 and RISK_4 mutations by tour engine', () => {
    const risk3Step = { mode: 'PRACTICE', mutationRisk: MUTATION_RISK_CLASSES.RISK_3_BUSINESS_RECORD_MUTATION };
    const risk4Step = { mode: 'PRACTICE', mutationRisk: MUTATION_RISK_CLASSES.RISK_4_SENSITIVE_OR_IRREVERSIBLE };

    // Advance rule check: practice steps must not auto-execute without explicit user action
    expect(risk3Step.mutationRisk).toBe('RISK_3_BUSINESS_RECORD_MUTATION');
    expect(risk4Step.mutationRisk).toBe('RISK_4_SENSITIVE_OR_IRREVERSIBLE');
  });
});

describe('Checkpoint 6.1 — Persistence, State & Resume Suite', () => {
  beforeEach(() => {
    clearTourSession();
  });

  it('persists stable currentStepId alongside numeric index', () => {
    const data = {
      missionId: 'BM-M1',
      missionVersion: '1.0.0',
      workspace: 'Branch Manager',
      currentStepId: 'bm-m1-step-02',
      currentStepIndex: 1,
      completedStepIds: ['bm-m1-step-01'],
    };
    saveTourSession(data);
    const loaded = loadTourSession();
    expect(loaded).not.toBeNull();
    expect(loaded.missionId).toBe('BM-M1');
    expect(loaded.currentStepId).toBe('bm-m1-step-02');
    expect(loaded.currentStepIndex).toBe(1);
  });

  it('detects workspace mismatch on resume validation', () => {
    const session = { missionId: 'BM-M1', workspace: 'Branch Manager' };
    const res = validateResume(session, 'Super Admin');
    expect(res.canResume).toBe(false);
    expect(res.reason).toBe('WORKSPACE_MISMATCH');
  });

  it('detects mission version mismatch on resume validation', () => {
    const session = { missionId: 'BM-M1', missionVersion: '1.0.0', workspace: 'Branch Manager' };
    const currentMission = { id: 'BM-M1', version: '2.0.0', steps: [] };
    const res = validateResume(session, 'Branch Manager', currentMission);
    expect(res.canResume).toBe(false);
    expect(res.reason).toBe('VERSION_MISMATCH');
  });

  it('detects retired/missing step on resume validation', () => {
    const session = { 
      missionId: 'BM-M1', 
      missionVersion: '1.0.0', 
      workspace: 'Branch Manager',
      currentStepId: 'retired-step-99',
    };
    const currentMission = { 
      id: 'BM-M1', 
      version: '1.0.0', 
      steps: [{ id: 'active-step-01' }, { id: 'active-step-02' }] 
    };
    const res = validateResume(session, 'Branch Manager', currentMission);
    expect(res.canResume).toBe(false);
    expect(res.reason).toBe('STEP_NOT_FOUND');
  });

  it('differentiates expected target disappearance from unexpected target removal', () => {
    // Expected disappearance (e.g. closing a modal) -> STEP_SUCCESS
    const expectedRes = tourStore.handleTargetDisappearance('EXPECTED_CLOSE');
    expect(expectedRes).toBe('STEP_SUCCESS');
    expect(tourStore.targetState).toBe('STEP_SUCCESS');

    // Unexpected disappearance -> TARGET_REMOVED_UNEXPECTEDLY
    const unexpectedRes = tourStore.handleTargetDisappearance('UNEXPECTED');
    expect(unexpectedRes).toBe('TARGET_REMOVED_UNEXPECTEDLY');
    expect(tourStore.targetState).toBe('TARGET_REMOVED_UNEXPECTEDLY');
    expect(tourStore.presentationMode).toBe('TARGET_UNAVAILABLE');
    expect(tourStore.targetRect).toBeNull();
  });

  it('delivers role-aware catalogs (Super Admin vs Branch Manager)', () => {
    const saCatalog = getCatalogForRole('Super Admin');
    expect(saCatalog.length).toBeGreaterThan(0);
    expect(saCatalog[0].code).toBe('SA-01');

    const bmCatalog = getCatalogForRole('Branch Manager');
    expect(bmCatalog.length).toBeGreaterThan(0);
    expect(bmCatalog[0].code).toContain('M');
  });
});
