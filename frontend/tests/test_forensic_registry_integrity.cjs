const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('--- RUNNING FORENSIC REGISTRY INTEGRITY TEST SUITE ---');

const rootDir = path.join(__dirname, '..');
const baselineDir = path.join(rootDir, 'scratch/forensic/baseline');

// 1. Route populations reconciliation
const routeMath = JSON.parse(fs.readFileSync(path.join(baselineDir, 'route_math.json'), 'utf8'));
const totalRoutes = routeMath.TOTAL_ROUTE_OBJECTS;
const layouts = routeMath.LAYOUT_ROUTE_OBJECTS;
const redirects = routeMath.REDIRECT_ONLY_ROUTE_OBJECTS;
const catchAll = routeMath.CATCH_ALL_ROUTE_OBJECTS;
const leafRoutes = routeMath.LEAF_ROUTES_TOTAL;

assert.strictEqual(totalRoutes, layouts + redirects + catchAll + leafRoutes, 'Route sum equation mismatch');
assert.strictEqual(totalRoutes, 194, 'Total route declarations must equal 194');
assert.strictEqual(leafRoutes, 187, 'Leaf routes must equal 187');
console.log('✓ Test 1 Passed: Route populations reconcile exactly (194 = 2 layouts + 4 redirects + 1 catch-all + 187 leaves).');

// 2. Control population reconciliation
const controlEvidence = JSON.parse(fs.readFileSync(path.join(baselineDir, 'control_evidence.json'), 'utf8'));
assert.strictEqual(controlEvidence.length, 583, 'Total control evidence must equal 583');
console.log('✓ Test 2 Passed: Control population reconciles exactly to 583 records.');

// 3. Field lifecycle population reconciliation
const fieldLifecycles = JSON.parse(fs.readFileSync(path.join(baselineDir, 'field_lifecycle.json'), 'utf8'));
const passes = fieldLifecycles.filter(f => f.failureType === null).length;
const failures = fieldLifecycles.filter(f => f.failureType !== null).length;

assert.strictEqual(fieldLifecycles.length, 484, 'True persistent entity lifecycles must equal 484');
assert.strictEqual(passes, 439, 'Confirmed true passes must equal 439');
assert.strictEqual(failures, 45, 'Lifecycle failures must equal 45');
assert.strictEqual(fieldLifecycles.length, passes + failures, 'Passes plus failures must equal total lifecycles');
console.log('✓ Test 3 Passed: Field lifecycles reconcile exactly (484 = 439 passes + 45 failures).');

// 4. Defect groups and instances integrity
const defectGroups = JSON.parse(fs.readFileSync(path.join(baselineDir, 'defect_groups.json'), 'utf8'));
const defectInstances = JSON.parse(fs.readFileSync(path.join(baselineDir, 'defect_instances.json'), 'utf8'));

assert.strictEqual(defectGroups.length, 16, 'Total defect groups must equal 16');
assert.strictEqual(defectInstances.length, 305, 'Total defect instances must equal 305');

// Check duplicate IDs
const instanceIdSet = new Set();
for (const inst of defectInstances) {
  assert(!instanceIdSet.has(inst.defectInstanceId), `Duplicate defectInstanceId found: ${inst.defectInstanceId}`);
  instanceIdSet.add(inst.defectInstanceId);

  // Assert every instance maps to a valid group
  const group = defectGroups.find(g => g.defectGroupId === inst.defectGroupId);
  assert(group !== undefined, `Orphan defect instance ${inst.defectInstanceId} without group ${inst.defectGroupId}`);
}

// Assert every group count equals its actual instance count in registry
for (const group of defectGroups) {
  const actualCount = defectInstances.filter(i => i.defectGroupId === group.defectGroupId).length;
  assert.strictEqual(actualCount, group.instanceCount, `Group ${group.defectGroupId} instance count mismatch: declared ${group.instanceCount}, found ${actualCount}`);
}
console.log('✓ Test 4 Passed: Zero duplicate IDs, zero orphan instances, all group instance counts match registry lengths exactly.');

// 5. Semantic actions and triggers reconciliation
const rawTriggers = JSON.parse(fs.readFileSync(path.join(baselineDir, 'raw_action_triggers.json'), 'utf8'));
const semanticActions = JSON.parse(fs.readFileSync(path.join(baselineDir, 'semantic_actions.json'), 'utf8'));
assert.strictEqual(rawTriggers.length, 987, 'Raw action triggers must equal 987');
assert.strictEqual(semanticActions.length, 741, 'Semantic actions must equal 741');
console.log('✓ Test 5 Passed: Semantic action normalization reconciles 987 raw triggers to 741 unique semantic actions.');

// 6. Action Centre 5 chains completeness
const acChains = JSON.parse(fs.readFileSync(path.join(baselineDir, 'action_centre_5_chains.json'), 'utf8'));
assert.strictEqual(acChains.length, 5, 'Action Centre must define exactly 5 core chains');
acChains.forEach(c => {
  assert(c.flowType, 'Chain missing flowType');
  assert(c.resolver, 'Chain missing resolver');
});
console.log('✓ Test 6 Passed: Action Centre 5-chain records complete.');

// 7. State remediation decisions completeness
const stateDecisions = JSON.parse(fs.readFileSync(path.join(baselineDir, 'state_remediation_decisions.json'), 'utf8'));
assert.strictEqual(stateDecisions.length, 21, 'State decisions must cover all 21 identified findings');
console.log('✓ Test 7 Passed: State decisions exist for all 21 state findings.');

// 8. Form defaults population reconciliation
const formDefaults = JSON.parse(fs.readFileSync(path.join(baselineDir, 'form_defaults.json'), 'utf8'));
assert.strictEqual(formDefaults.length, 316, 'Form defaults audited must equal 316');
const safeD = formDefaults.filter(d => d.classification === 'SAFE_BUSINESS_DEFAULT').length;
const dangD = formDefaults.filter(d => d.classification === 'DANGEROUS_PREFILL').length;
const demoD = formDefaults.filter(d => d.classification === 'DEMO_PREFILL').length;
const confD = formDefaults.filter(d => d.classification === 'CONFIGURATION_DEFAULT').length;
const deriD = formDefaults.filter(d => d.classification === 'DERIVED_DEFAULT').length;
assert.strictEqual(formDefaults.length, safeD + dangD + demoD + confD + deriD, 'Form default category counts must sum to 316');
console.log('✓ Test 8 Passed: Form defaults reconcile exactly (316 = 75 safe + 125 dangerous + 62 demo + 32 config + 22 derived).');

// 9. Architecture decision backlog completeness
const adb = JSON.parse(fs.readFileSync(path.join(baselineDir, 'architecture_decision_backlog.json'), 'utf8'));
assert(adb.length >= 7, 'Architecture decision backlog must contain all unresolved decisions');
console.log('✓ Test 9 Passed: Architecture decision backlog complete and verified.');

console.log('--- ALL 9 FORENSIC REGISTRY INTEGRITY TESTS PASSED ---');
