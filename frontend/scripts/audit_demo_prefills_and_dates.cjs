const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const components = JSON.parse(fs.readFileSync(path.join(rootDir, 'scratch/forensic/components.json'), 'utf8'));

const createViews = components.filter(c => c.fileName.startsWith('Create') || c.fileName.startsWith('Add'));

const prefillAudit = [];
const staticDateAudit = [];
const financialStorageAudit = [];

for (const comp of createViews) {
  const fp = path.join(rootDir, comp.filePath);
  if (!fs.existsSync(fp)) continue;
  const content = fs.readFileSync(fp, 'utf8');

  // Find form initial state
  const formMatch = content.match(/const\s+form\s*=\s*(?:ref|reactive)\s*\(\{([\s\S]*?)\}\)/);
  if (!formMatch) continue;

  const formBody = formMatch[1];
  const lines = formBody.split('\n');

  for (const line of lines) {
    const propMatch = line.match(/^\s*([a-zA-Z0-9_]+)\s*:\s*([^,\n]+)/);
    if (!propMatch) continue;

    const propName = propMatch[1];
    const rawVal = propMatch[2].trim();

    // Check classification
    let classification = 'SAFE_BUSINESS_DEFAULT';
    let risk = 'LOW';

    // Static dates
    if (rawVal.match(/['"]\d{4}-\d{2}-\d{2}['"]/)) {
      classification = 'DEMO_PREFILL';
      risk = 'HIGH';
      staticDateAudit.push({
        component: comp.filePath,
        property: propName,
        value: rawVal,
        purpose: 'Form field default date',
        risk: 'HIGH - Hardcodes fixed historical/future date instead of today / dynamic date'
      });
    } else if (rawVal.includes('PKR') || rawVal.includes('$')) {
      classification = 'DANGEROUS_PREFILL';
      risk = 'HIGH';
      financialStorageAudit.push({
        component: comp.filePath,
        property: propName,
        value: rawVal,
        issueType: 'FORMATTED_STRING_USED_AS_DOMAIN_VALUE',
        risk: 'HIGH - Form stores formatted string currency instead of canonical integer/float'
      });
    } else if (rawVal === "''" || rawVal === '""' || rawVal === 'null' || rawVal === '[]' || rawVal === 'false' || rawVal === '0') {
      classification = 'SAFE_BUSINESS_DEFAULT';
      risk = 'LOW';
    } else if (rawVal.includes('store.getActiveBranch') || rawVal.includes('new Date()') || rawVal.includes('Date.now()')) {
      classification = 'DERIVED_DEFAULT';
      risk = 'LOW';
    } else if (rawVal.startsWith("'") || rawVal.startsWith('"')) {
      const strVal = rawVal.replace(/['"]/g, '');
      if (strVal.length > 0) {
        classification = 'DANGEROUS_PREFILL';
        risk = 'HIGH';
      }
    } else if (!isNaN(Number(rawVal)) && Number(rawVal) > 0) {
      classification = 'DEMO_PREFILL';
      risk = 'MEDIUM';
    }

    prefillAudit.push({
      component: comp.filePath,
      property: propName,
      initialValue: rawVal,
      classification,
      risk
    });
  }
}

// Global scan for financial formatting issues in store.js
const storeContent = fs.readFileSync(path.join(rootDir, 'src/store.js'), 'utf8');
const pkrStringProps = [...storeContent.matchAll(/([a-zA-Z0-9_]+):\s*['"]PKR\s+([0-9,]+)['"]/g)];
const pkrUniqueProps = [...new Set(pkrStringProps.map(m => m[1]))];
pkrUniqueProps.forEach(prop => {
  financialStorageAudit.push({
    component: 'src/store.js',
    property: prop,
    value: 'PKR [formatted string]',
    issueType: 'FORMATTED_STRING_USED_AS_DOMAIN_VALUE',
    risk: 'HIGH - Entity stores formatted string instead of raw numeric value, requiring parsing for arithmetic'
  });
});

fs.writeFileSync(
  path.join(rootDir, 'scratch/forensic/baseline/demo_prefill_audit.json'),
  JSON.stringify(prefillAudit, null, 2),
  'utf8'
);

fs.writeFileSync(
  path.join(rootDir, 'scratch/forensic/baseline/static_date_audit.json'),
  JSON.stringify(staticDateAudit, null, 2),
  'utf8'
);

fs.writeFileSync(
  path.join(rootDir, 'scratch/forensic/baseline/financial_storage_audit.json'),
  JSON.stringify(financialStorageAudit, null, 2),
  'utf8'
);

console.log(`Audited ${prefillAudit.length} form prefill properties:`);
const pCounts = {};
prefillAudit.forEach(p => pCounts[p.classification] = (pCounts[p.classification] || 0) + 1);
console.log('Prefill breakdown:', pCounts);
console.log(`Static date defaults detected: ${staticDateAudit.length}`);
console.log(`Financial storage string issues detected: ${financialStorageAudit.length}`);
