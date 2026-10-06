const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const kpisData = JSON.parse(fs.readFileSync(path.join(rootDir, 'scratch/forensic/baseline/kpis.json'), 'utf8'));
const hardcodedData = JSON.parse(fs.readFileSync(path.join(rootDir, 'scratch/forensic/baseline/hardcoded_classification.json'), 'utf8'));

const misleadingFallbacks = hardcodedData.filter(h => h.classification === 'MISLEADING_FALLBACK');
const hardcodedKpis = kpisData.hardcodedDefectsList;

const overlapGraph = [];
const sharedSourceElements = [];

for (const kpi of hardcodedKpis) {
  // Check if any misleading fallback exists in the same dashboard file with matching string or related metric
  const relatedFallbacks = misleadingFallbacks.filter(f => f.component === kpi.dashboard);

  overlapGraph.push({
    kpiId: kpi.kpiId,
    label: kpi.label,
    dashboard: kpi.dashboard,
    kpiRawFormula: kpi.rawFormula,
    rootCause: 'DASHBOARD_METRIC_HARDCODED_IN_SCRIPT',
    sameSourceElementAs: relatedFallbacks.map(f => f.id),
    overlapType: relatedFallbacks.length > 0 ? 'CO-LOCATED_DASHBOARD_MOCK' : 'INDEPENDENT_SCRIPT_LITERAL',
    isDistinctDefectInstance: true
  });
}

// Summary of distinct instances
const totalDistinctDefectInstances = hardcodedKpis.length + misleadingFallbacks.filter(f => !hardcodedKpis.some(k => k.dashboard === f.component)).length;

fs.writeFileSync(
  path.join(rootDir, 'scratch/forensic/baseline/kpi_fallback_overlap.json'),
  JSON.stringify({
    totalHardcodedKpis: hardcodedKpis.length,
    totalMisleadingFallbacks: misleadingFallbacks.length,
    distinctOperationalMockInstances: totalDistinctDefectInstances,
    overlapGraph
  }, null, 2),
  'utf8'
);

console.log('=== KPI / FALLBACK OVERLAP ANALYSIS ===');
console.log('Hardcoded Script KPIs:', hardcodedKpis.length);
console.log('Template Misleading Fallbacks:', misleadingFallbacks.length);
console.log('Distinct Operational Metric Mock Instances:', totalDistinctDefectInstances);
