const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const fieldLifecycles = JSON.parse(fs.readFileSync(path.join(rootDir, 'scratch/forensic/baseline/field_lifecycle.json'), 'utf8'));

// Filter the PASS population (failureType === null)
const passPopulation = fieldLifecycles.filter(f => f.failureType === null);
console.log('Total PASS population:', passPopulation.length);

// Stratified sample of 75 controls across modules
const sampleSize = 75;
const step = Math.floor(passPopulation.length / sampleSize);
const sampledControls = [];

for (let i = 0; i < passPopulation.length && sampledControls.length < sampleSize; i += step) {
  sampledControls.push(passPopulation[i]);
}

const redteamResults = [];
let confirmedPass = 0;
let falsePass = 0;

for (const ctrl of sampledControls) {
  const fp = path.join(rootDir, ctrl.component);
  const content = fs.existsSync(fp) ? fs.readFileSync(fp, 'utf8') : '';
  const prop = ctrl.modelProperty;

  // Verify whether prop is included in submit payload
  // e.g. payload contains prop or spread operator ...form.value or ...saleData.value
  const hasDirectPayloadMapping = content.includes(`${prop}:`) || 
                                  content.includes(`...form.value`) || 
                                  content.includes(`...form`) ||
                                  content.includes(`...saleData.value`) ||
                                  content.includes(`...customerData.value`) ||
                                  content.includes(`...leadData.value`) ||
                                  content.includes(`...userData.value`);

  let status = 'CONFIRMED_TRUE_PASS';
  let issue = null;

  if (!hasDirectPayloadMapping && prop && !['id', 'status'].includes(prop)) {
    // Check if the property is dropped during explicit object assembly
    status = 'FALSE_PASS_DETECTED';
    issue = `Property '${prop}' in ${ctrl.component} is not explicitly passed in the submit payload`;
    falsePass++;
  } else {
    confirmedPass++;
  }

  redteamResults.push({
    controlId: ctrl.controlId,
    component: ctrl.component,
    modelProperty: prop,
    storeMethod: ctrl.storeMethod,
    submitHandler: ctrl.submitHandler,
    hasCausalPayloadMapping: hasDirectPayloadMapping,
    status,
    issue
  });
}

const falsePassRate = ((falsePass / sampledControls.length) * 100).toFixed(2);

fs.writeFileSync(
  path.join(rootDir, 'scratch/forensic/baseline/lifecycle_pass_redteam.json'),
  JSON.stringify({
    sampleSize: sampledControls.length,
    confirmedPassCount: confirmedPass,
    falsePassCount: falsePass,
    falsePassRate: `${falsePassRate}%`,
    auditSample: redteamResults
  }, null, 2),
  'utf8'
);

console.log('=== FIELD LIFECYCLE PASS POPULATION RED-TEAM ===');
console.log('Sample Size:', sampledControls.length);
console.log('Confirmed True Passes:', confirmedPass);
console.log('False Passes Detected:', falsePass);
console.log('False Pass Rate:', `${falsePassRate}%`);
