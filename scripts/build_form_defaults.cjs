const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const controlEvidence = JSON.parse(fs.readFileSync(path.join(rootDir, 'scratch/forensic/baseline/control_evidence.json'), 'utf8'));
const components = JSON.parse(fs.readFileSync(path.join(rootDir, 'scratch/forensic/components.json'), 'utf8'));

// Filter components that represent Create / Add / Edit forms
const formViews = components.filter(c => 
  c.fileName.startsWith('Create') || 
  c.fileName.startsWith('Add') || 
  c.fileName.startsWith('Edit') ||
  c.fileName.startsWith('Receive')
);

const formDefaults = [];

for (const comp of formViews) {
  const fp = path.join(rootDir, comp.filePath);
  if (!fs.existsSync(fp)) continue;
  const content = fs.readFileSync(fp, 'utf8');

  // Match reactive form definition
  const formMatch = content.match(/const\s+(?:form|saleData|leadData|customerData|expenseData|userData|branchData|poData|caseData|repairData)\s*=\s*(?:ref|reactive)\s*\(\{([\s\S]*?)\}\)/);
  if (!formMatch) continue;

  const formBody = formMatch[1];
  const lines = formBody.split('\n');

  for (const line of lines) {
    const propMatch = line.match(/^\s*([a-zA-Z0-9_]+)\s*:\s*([^,\n]+)/);
    if (!propMatch) continue;

    const propName = propMatch[1];
    const rawVal = propMatch[2].trim();

    // Find corresponding control in control_evidence
    const ctrl = controlEvidence.find(c => c.component === comp.filePath && (c.modelBinding?.endsWith(propName) || c.label?.toLowerCase() === propName.toLowerCase()));

    let classification = 'UNRESOLVED';
    let justification = '';

    const strVal = rawVal.replace(/^['"]|['"]$/g, '').trim();

    if (rawVal === "''" || rawVal === '""' || rawVal === 'null' || rawVal === '[]' || rawVal === 'false' || rawVal === '0') {
      classification = 'SAFE_BUSINESS_DEFAULT';
      justification = 'Initializes to standard empty/falsy state.';
    } else if (rawVal.includes('store.getActiveBranch') || rawVal.includes('user.value?.branchName') || rawVal.includes('new Date()') || rawVal.includes('Date.now()')) {
      classification = 'DERIVED_DEFAULT';
      justification = 'Dynamically initialized from active authentication context or system clock.';
    } else if (comp.fileName.startsWith('Edit')) {
      classification = 'CONFIGURATION_DEFAULT';
      justification = 'Default fallback prior to edit-mode record loadData() hydration.';
    } else if (rawVal.match(/['"]\d{4}-\d{2}-\d{2}['"]/) || rawVal.match(/['"]\d+\s+[A-Za-z]{3}\s+\d{4}['"]/)) {
      classification = 'DEMO_PREFILL';
      justification = 'Hardcoded calendar date literal in create form; should be today or empty.';
    } else if (['paymentMethod', 'shipmentMethod', 'category', 'status', 'type', 'priority', 'role'].includes(propName) && !rawVal.includes('Faisal') && !rawVal.includes('Hamza')) {
      classification = 'CONFIGURATION_DEFAULT';
      justification = 'Default option selected in enum dropdown.';
    } else if (strVal.length > 0 && !isNaN(Number(strVal.replace(/[^0-9.-]/g, ''))) && Number(strVal.replace(/[^0-9.-]/g, '')) > 0) {
      classification = 'DEMO_PREFILL';
      justification = 'Hardcoded non-zero quantity or price literal in create form.';
    } else if (strVal.length > 0) {
      classification = 'DANGEROUS_PREFILL';
      justification = 'Pre-populates create form with mock business entity data (names, notes, proforma filenames). If submitted unchanged, creates fake records.';
    }

    formDefaults.push({
      controlId: ctrl ? ctrl.controlId : `DERIVED-PROP-${comp.fileName}-${propName}`,
      route: ctrl ? ctrl.route : null,
      component: comp.filePath,
      model: propName,
      defaultValue: rawVal,
      classification,
      justification,
      evidence: `${comp.filePath} reactive state initialization: ${line.trim()}`
    });
  }
}

fs.writeFileSync(
  path.join(rootDir, 'scratch/forensic/baseline/form_defaults.json'),
  JSON.stringify(formDefaults, null, 2),
  'utf8'
);

const counts = {};
formDefaults.forEach(d => counts[d.classification] = (counts[d.classification] || 0) + 1);

console.log('=== FORM DEFAULTS CLASSIFICATION ===');
console.log('Total Form Default Properties Audited:', formDefaults.length);
console.log('Breakdown:', counts);
