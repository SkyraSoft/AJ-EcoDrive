const fs = require('fs');
const path = require('path');

const { superAdminMissions } = require('../src/tour/content/superAdmin/superAdminMissions.js');
const { branchManagerMissions } = require('../src/tour/content/branchManager/branchManagerMissions.js');
const { crossRoleScenarios } = require('../src/tour/content/scenarios/crossRoleScenarios.js');
const { contextHelpRegistry } = require('../src/tour/content/contextHelp/contextHelpRegistry.js');
const { fieldGuideRegistry, getFieldMatrixSummary } = require('../src/tour/content/fieldGuides/fieldGuideRegistry.js');
const { getAllTargets, validateTargetIdFormat } = require('../src/tour/targetRegistry.js');

console.log('=== REFERENTIAL INTEGRITY AUDIT: TARGETS, SURFACES & FIELDS ===');

// 1. Audit Target Registry
const registeredTargets = getAllTargets();
const regTargetIds = new Set(registeredTargets.map(t => t.targetId));

console.log('Total targets registered in targetRegistry:', registeredTargets.length);

// 2. Audit All Curriculum Step Targets
const curriculumStepAudit = [];
let totalSteps = 0;
let targetedSteps = 0;
let untargetedSteps = 0;
let dynamicResolverSteps = 0;
let missingFromRegistry = [];

function checkStep(step, moduleCode, workspace, route, surface) {
  totalSteps++;
  const targetId = step.targetId || step.target;
  let resolutionType = 'STATIC_SEMANTIC_DOM_TARGET';
  
  if (!targetId || targetId === 'NONE' || targetId === null) {
    resolutionType = 'NO_TARGET_REQUIRED';
    untargetedSteps++;
  } else if (targetId.includes('.row.') || targetId.includes('.item.') || targetId.includes(':id')) {
    resolutionType = 'DYNAMIC_SEMANTIC_TARGET';
    targetedSteps++;
    dynamicResolverSteps++;
  } else if (surface && surface.toLowerCase().includes('modal')) {
    resolutionType = 'MODAL_TARGET';
    targetedSteps++;
  } else if (surface && surface.toLowerCase().includes('drawer')) {
    resolutionType = 'DRAWER_TARGET';
    targetedSteps++;
  } else {
    targetedSteps++;
  }

  const inRegistry = targetId && targetId !== 'NONE' ? regTargetIds.has(targetId) : true;
  if (!inRegistry) {
    missingFromRegistry.push({ moduleCode, stepId: step.id, targetId });
  }

  curriculumStepAudit.push({
    moduleCode,
    stepId: step.id,
    workspace,
    route,
    surface,
    targetId: targetId || 'NONE',
    resolutionType,
    inRegistry
  });
}

// SA Steps
for (const m of superAdminMissions) {
  for (const s of m.steps) {
    checkStep(s, m.code, m.workspace, s.route || m.route, m.surface);
  }
}

// BM Steps
for (const m of branchManagerMissions) {
  for (const s of m.steps) {
    checkStep(s, m.code, m.workspace, s.route || m.route, m.surface);
  }
}

// Scenario Segments
for (const sc of crossRoleScenarios) {
  for (const seg of sc.segments) {
    checkStep(seg, sc.code, seg.workspace, seg.route, seg.surface);
  }
}

console.log('Total curriculum steps audited:', totalSteps);
console.log('Targeted steps:', targetedSteps);
console.log('Untargeted steps (general orientation / docked):', untargetedSteps);
console.log('Missing from targetRegistry:', missingFromRegistry.length);
if (missingFromRegistry.length > 0) {
  console.log('Missing targets list:', missingFromRegistry);
}

// 3. Audit 640 Logical Fields Target Strategy
const fieldMatrix = getFieldMatrixSummary();
console.log('\n--- 640 LOGICAL FIELDS AUDIT ---');
console.log('Total Fields:', fieldMatrix.totalFields);
console.log('Dimension A (Role):', fieldMatrix.dimensionA);
console.log('Dimension B (Treatment):', fieldMatrix.dimensionB);
console.log('Business Decision Holds covered:', fieldMatrix.holdsCovered);

// 4. Audit Surface Universe (147 Meaningful Surfaces)
// Surface mapping across the 147 normalized surfaces
console.log('\n--- 147 MEANINGFUL SURFACES AUDIT ---');
const surfacesMap = new Map();

for (const audit of curriculumStepAudit) {
  const key = `${audit.route}::${audit.surface}`;
  if (!surfacesMap.has(key)) {
    surfacesMap.set(key, {
      route: audit.route,
      surface: audit.surface,
      stepsCount: 0,
      targets: new Set()
    });
  }
  const entry = surfacesMap.get(key);
  entry.stepsCount++;
  if (audit.targetId !== 'NONE') {
    entry.targets.add(audit.targetId);
  }
}

console.log('Distinct route-surface combinations exercised in primary missions:', surfacesMap.size);

// Save comprehensive audit manifest
const auditReport = {
  timestamp: new Date().toISOString(),
  targetRegistryCount: registeredTargets.length,
  curriculumSteps: {
    total: totalSteps,
    targeted: targetedSteps,
    untargeted: untargetedSteps,
    dynamicResolver: dynamicResolverSteps,
    missingFromRegistryCount: missingFromRegistry.length
  },
  fieldMatrixSummary: fieldMatrix,
  surfacesExercisedCount: surfacesMap.size
};

fs.writeFileSync(path.join(__dirname, '..', 'scratch', 'referential_integrity_audit.json'), JSON.stringify(auditReport, null, 2), 'utf8');
console.log('\nSaved scratch/referential_integrity_audit.json successfully.');
