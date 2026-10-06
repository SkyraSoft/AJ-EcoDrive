import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { superAdminMissions } from '../src/tour/content/superAdmin/superAdminMissions.js';
import { getTarget, getAllTargets, TARGET_STATES } from '../src/tour/targetRegistry.js';
import { resolveTarget } from '../src/tour/targetResolver.js';

describe('Super Admin Presentation-Readiness: Tour Target Availability Gate', () => {
  // 1. Mission Roster & Step Integrity
  it('contains all 20 Super Admin missions (SA-01 to SA-20) with 29 total steps', () => {
    expect(superAdminMissions).toBeDefined();
    expect(superAdminMissions.length).toBe(20);

    const expectedCodes = Array.from({ length: 20 }, (_, i) => `SA-${String(i + 1).padStart(2, '0')}`);
    const actualCodes = superAdminMissions.map(m => m.code);
    expect(actualCodes).toEqual(expectedCodes);

    const allSteps = superAdminMissions.flatMap(m => m.steps);
    expect(allSteps.length).toBe(29);
  });

  // 2. Semantic Target Registry Verification
  it('ensures every Super Admin step targets a registered semantic target with valid grammar', () => {
    const allSteps = superAdminMissions.flatMap(m => m.steps);

    for (const step of allSteps) {
      expect(step.targetId, `Step ${step.id} has no targetId`).toBeDefined();
      const targetDef = getTarget(step.targetId);
      expect(targetDef, `Step ${step.id} references unregistered targetId: ${step.targetId}`).toBeDefined();
      expect(['Super Admin', 'Shared'], `Unexpected workspace for target ${step.targetId}`).toContain(targetDef.workspace);
    }
  });

  // 3. Canonical Route Alignment
  it('ensures every Super Admin mission and step points to canonical router routes', () => {
    const canonicalMap = {
      'SA-10': '/inventory/serialized-units',
      'SA-13': '/inventory/stock-adjustments',
      'SA-16': '/after-sales/warranty',
      'SA-18': '/procurement/vendor-bills',
      'SA-20': '/analytics/reports/sales',
    };

    for (const mission of superAdminMissions) {
      if (canonicalMap[mission.code]) {
        expect(mission.route, `Mission ${mission.code} route mismatch`).toBe(canonicalMap[mission.code]);
        for (const step of mission.steps) {
          expect(step.route, `Step ${step.id} route mismatch`).toBe(canonicalMap[mission.code]);
        }
      }
    }
  });

  // 4. Physical DOM Template Presence Verification
  it('verifies all 29 Super Admin step targets are present in Vue component templates', () => {
    function getAllVueFiles(dir, fileList = []) {
      const files = fs.readdirSync(dir);
      for (const f of files) {
        const p = path.join(dir, f);
        const stat = fs.statSync(p);
        if (stat.isDirectory()) {
          if (!p.includes('node_modules') && !p.includes('.git') && !p.includes('tour')) {
            getAllVueFiles(p, fileList);
          }
        } else if (f.endsWith('.vue')) {
          fileList.push(p);
        }
      }
      return fileList;
    }

    const vueFiles = getAllVueFiles(path.resolve(__dirname, '../src'));
    const vueContents = vueFiles.map(f => fs.readFileSync(f, 'utf8'));

    const allSteps = superAdminMissions.flatMap(m => m.steps);
    const missingTargets = [];

    for (const step of allSteps) {
      const targetId = step.targetId;
      const found = vueContents.some(content => content.includes(targetId));
      if (!found) {
        missingTargets.push({ stepId: step.id, targetId });
      }
    }

    expect(missingTargets, `Missing targets in Vue templates: ${JSON.stringify(missingTargets)}`).toHaveLength(0);
  });

  // 5. Target Resolver Clean Resolution Simulation
  it('resolves semantic targets with TARGET_READY when elements are rendered in DOM', () => {
    const allSteps = superAdminMissions.flatMap(m => m.steps);
    const container = document.createElement('div');
    document.body.appendChild(container);

    try {
      for (const step of allSteps) {
        const el = document.createElement('div');
        el.setAttribute('data-tour-id', step.targetId);
        // Add fake layout dimensions
        Object.defineProperty(el, 'getBoundingClientRect', {
          value: () => ({ top: 100, bottom: 200, left: 100, right: 300, width: 200, height: 100, x: 100, y: 100 }),
          configurable: true,
        });
        container.appendChild(el);

        const res = resolveTarget(step.targetId);
        expect(res.state, `Target ${step.targetId} failed to resolve to TARGET_VISIBLE`).toBe(TARGET_STATES.TARGET_VISIBLE);
        expect(res.element).toBe(el);

        container.removeChild(el);
      }
    } finally {
      document.body.removeChild(container);
    }
  });

  // 6. Presentation Cleanliness: No Unneeded Business Decision Holds
  it('ensures tour steps do not display raw internal business-decision hold codes to clients', () => {
    const allSteps = superAdminMissions.flatMap(m => m.steps);
    const bdHoldRegex = /BD-00[1-6]/;

    for (const step of allSteps) {
      expect(bdHoldRegex.test(step.title), `Step ${step.id} title contains internal BD code`).toBe(false);
      expect(bdHoldRegex.test(step.explanation), `Step ${step.id} explanation contains internal BD code`).toBe(false);
    }
  });
});
