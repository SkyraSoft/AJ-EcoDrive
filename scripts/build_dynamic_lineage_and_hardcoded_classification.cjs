const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const components = JSON.parse(fs.readFileSync(path.join(rootDir, 'scratch/forensic/components.json'), 'utf8'));
const rawHardcoded = JSON.parse(fs.readFileSync(path.join(rootDir, 'scratch/forensic/hardcoded_operational_values.json'), 'utf8'));

// 1. Recount all dynamic expressions directly from current Vue source
const dynamicLineage = [];
let dynIdx = 0;

for (const comp of components) {
  const fp = path.join(rootDir, comp.filePath);
  if (!fs.existsSync(fp)) continue;
  const content = fs.readFileSync(fp, 'utf8');

  const templateMatch = content.match(/<template>([\s\S]*?)<\/template>/);
  if (!templateMatch) continue;
  const tpl = templateMatch[1];

  // Match all {{ expression }}
  const mustacheMatches = [...tpl.matchAll(/\{\{([\s\S]*?)\}\}/g)];
  for (const m of mustacheMatches) {
    dynIdx++;
    const expr = m[1].trim();
    let sourceType = 'LOCAL_STATE_OR_PROP';
    if (expr.includes('store.')) sourceType = 'CENTRAL_STORE_REACTIVE';
    else if (expr.includes('formatCurrency') || expr.includes('formatDate')) sourceType = 'FORMATTER_FUNCTION';
    else if (expr.includes('computed') || expr.includes('Length') || expr.includes('.length')) sourceType = 'DERIVED_COMPUTED';

    dynamicLineage.push({
      id: `DYN-${dynIdx}`,
      component: comp.filePath,
      expression: expr,
      sourceType: sourceType,
      hasFallback: expr.includes('||') || expr.includes('??'),
      fallbackValue: expr.includes('||') ? expr.split('||')[1].trim() : (expr.includes('??') ? expr.split('??')[1].trim() : null)
    });
  }
}

fs.writeFileSync(
  path.join(rootDir, 'scratch/forensic/baseline/dynamic_value_lineage.json'),
  JSON.stringify(dynamicLineage, null, 2),
  'utf8'
);

console.log(`Dynamic value expressions extracted directly from source: ${dynamicLineage.length}`);

// 2. Classify all 458 hardcoded / fallback candidates
const classifiedCandidates = [];
const misleadingDefects = [];

for (const item of rawHardcoded) {
  const comp = item.component || '';
  const rawText = item.rawText || '';
  const fallback = (item.fallbackValue || '').trim();

  let classification = 'STATIC_REFERENCE_TEXT';
  let isMisleading = false;
  let rationale = '';

  if (comp.includes('Dashboard') || comp.includes('Performance') || comp.includes('Reports')) {
    if (fallback.includes('PKR') || fallback.includes('%') || !isNaN(Number(fallback.replace(/[^0-9.-]/g, '')))) {
      classification = 'MISLEADING_FALLBACK';
      isMisleading = true;
      rationale = 'Operational metric falls back to a fabricated number/currency string when live data is missing';
    } else {
      classification = 'DEMO_OPERATIONAL_VALUE';
      rationale = 'Static metric label or operational demonstration badge';
    }
  } else if (comp.includes('Create') || comp.includes('Add')) {
    if (fallback.length > 0 && fallback !== "''" && fallback !== '0') {
      classification = 'FORM_PREFILL';
      rationale = 'Form input prefilled with demo value';
    } else {
      classification = 'REAL_BUSINESS_DEFAULT';
      rationale = 'Empty string, zero, or null business default';
    }
  } else if (comp.includes('dap') || comp.includes('Coachmark')) {
    classification = 'SAFE_DEMO_FIXTURE';
    rationale = 'In-app guidance and walkthrough fixture';
  } else if (fallback.includes('store.getActiveBranch') || fallback.includes('currentUser')) {
    classification = 'SHOULD_BE_DERIVED';
    rationale = 'Derived from active authentication or branch context';
  } else if (fallback.length === 0 || fallback === "''" || fallback === '—' || fallback === 'N/A') {
    classification = 'REAL_BUSINESS_DEFAULT';
    rationale = 'Safe empty fallback indicator';
  } else {
    classification = 'CONFIGURATION';
    rationale = 'Static UI constant or configuration literal';
  }

  const record = {
    id: item.id,
    component: comp,
    type: item.type,
    rawText: rawText,
    fallbackValue: fallback,
    classification: classification,
    isMisleading: isMisleading,
    rationale: rationale
  };

  classifiedCandidates.push(record);

  if (isMisleading) {
    misleadingDefects.push({
      id: item.id,
      component: comp,
      fallbackValue: fallback,
      rationale: rationale
    });
  }
}

fs.writeFileSync(
  path.join(rootDir, 'scratch/forensic/baseline/hardcoded_classification.json'),
  JSON.stringify(classifiedCandidates, null, 2),
  'utf8'
);

console.log(`Classified all ${classifiedCandidates.length} hardcoded/fallback candidates.`);
const cCounts = {};
classifiedCandidates.forEach(c => cCounts[c.classification] = (cCounts[c.classification] || 0) + 1);
console.log('Classification breakdown:', cCounts);
console.log(`Misleading operational fallbacks (OPEN DEFECTS): ${misleadingDefects.length}`);
