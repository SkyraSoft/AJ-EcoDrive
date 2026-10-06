const { superAdminMissions } = require('../src/tour/content/superAdmin/superAdminMissions.js');
const { branchManagerMissions } = require('../src/tour/content/branchManager/branchManagerMissions.js');
const { crossRoleScenarios } = require('../src/tour/content/scenarios/crossRoleScenarios.js');
const { contextHelpRegistry } = require('../src/tour/content/contextHelp/contextHelpRegistry.js');

console.log('--- CURRICULUM AUDIT ---');
console.log('SA Modules count:', superAdminMissions.length);
console.log('BM Modules count:', branchManagerMissions.length);
console.log('Scenarios count:', crossRoleScenarios.length);
console.log('Context Help items count:', contextHelpRegistry.length);

const allTargets = new Set();
const invalidTargets = [];

function checkTarget(targetId, source) {
  if (!targetId || targetId === 'NONE') return;
  allTargets.add(targetId);
  const parts = targetId.split('.');
  if (parts.length < 4 || !['sa', 'bm', 'shared'].includes(parts[0]) || targetId !== targetId.toLowerCase()) {
    invalidTargets.push({ targetId, source });
  }
}

// Check SA
for (const m of superAdminMissions) {
  for (const s of m.steps) {
    checkTarget(s.targetId, `SA: ${m.code} step ${s.id}`);
  }
}

// Check BM
for (const m of branchManagerMissions) {
  for (const s of m.steps) {
    checkTarget(s.targetId, `BM: ${m.code} step ${s.id}`);
  }
}

// Check Scenarios
for (const sc of crossRoleScenarios) {
  for (const s of sc.segments) {
    checkTarget(s.targetId, `Scenario: ${sc.code} seg ${s.id}`);
  }
}

// Check Context Help
for (const ch of contextHelpRegistry) {
  checkTarget(ch.targetId, `ContextHelp: ${ch.topicId}`);
}

console.log('Total unique semantic targets across curriculum:', allTargets.size);
console.log('Invalid targets:', invalidTargets.length);
if (invalidTargets.length > 0) {
  console.log('Invalid target list:', invalidTargets);
}
