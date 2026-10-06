const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const dashboardFiles = [
  'src/views/dashboard/SuperAdminDashboard.vue',
  'src/views/dashboard/BranchPerformance.vue',
  'src/views/dashboard/BusinessPerformance.vue',
  'src/views/inventory/InventoryDashboard.vue',
  'src/views/sales/SalesDashboard.vue',
  'src/views/after-sales/AfterSalesDashboard.vue'
];

const kpiRegistry = [];
let kpiIdx = 0;

for (const relPath of dashboardFiles) {
  const fp = path.join(rootDir, relPath);
  if (!fs.existsSync(fp)) continue;
  const content = fs.readFileSync(fp, 'utf8');

  // 1. Search script for KPI array declarations like const superAdminKpis = [...], const kpis = [...]
  const arrayMatches = [...content.matchAll(/const\s+([a-zA-Z0-9_]*kpis?|[a-zA-Z0-9_]*stats?|[a-zA-Z0-9_]*metrics?)\s*=\s*(?:ref\()?\[([\s\S]*?)\]/gi)];
  for (const arrMatch of arrayMatches) {
    const varName = arrMatch[1];
    const body = arrMatch[2];
    const items = [...body.matchAll(/\{([^{}]+)\}/g)];
    for (const it of items) {
      const itStr = it[1];
      const labelM = itStr.match(/label:\s*['"]([^'"]+)['"]|title:\s*['"]([^'"]+)['"]|name:\s*['"]([^'"]+)['"]/);
      const valM = itStr.match(/value:\s*([^,\n]+)/);
      if (labelM && valM) {
        kpiIdx++;
        const label = labelM[1] || labelM[2] || labelM[3];
        const rawVal = valM[1].trim();
        const isDynamic = rawVal.includes('stats.') || rawVal.includes('store.') || rawVal.includes('computed') || rawVal.includes('Count');
        const isHardcoded = rawVal.startsWith("'") || rawVal.startsWith('"') || (!isNaN(Number(rawVal)) && !isDynamic);

        kpiRegistry.push({
          kpiId: `KPI-${String(kpiIdx).padStart(3, '0')}`,
          dashboard: relPath,
          variableName: varName,
          label: label,
          rawFormula: rawVal,
          isDynamic: isDynamic,
          scope: relPath.includes('SuperAdmin') ? 'GLOBAL' : 'BRANCH_SCOPED',
          fallback: rawVal.includes('||') ? rawVal.split('||')[1].trim() : (isHardcoded ? rawVal : '0'),
          reconciliationStatus: isHardcoded ? 'HARDCODED_UNRECONCILED_DEFECT' : 'COMPUTED_STORE_DYNAMIC'
        });
      }
    }
  }
}

// Store fixture calculation
const storeContent = fs.readFileSync(path.join(rootDir, 'src/store.js'), 'utf8');
const orderUnits = [...storeContent.matchAll(/totalOrdered:\s*([0-9]+)/g)].map(m => parseInt(m[1], 10)).reduce((a, b) => a + b, 0);

const hardcodedDefects = kpiRegistry.filter(k => k.reconciliationStatus === 'HARDCODED_UNRECONCILED_DEFECT');

fs.writeFileSync(
  path.join(rootDir, 'scratch/forensic/baseline/kpis.json'),
  JSON.stringify({
    totalKpisAudited: kpiRegistry.length,
    dynamicComputedKpis: kpiRegistry.filter(k => k.isDynamic).length,
    hardcodedStaticKpis: hardcodedDefects.length,
    hardcodedDefectsList: hardcodedDefects,
    kpiRegistry
  }, null, 2),
  'utf8'
);

console.log(`Audited ${kpiRegistry.length} dashboard KPI definitions:`);
console.log(`Dynamic Store-Computed KPIs: ${kpiRegistry.filter(k => k.isDynamic).length}`);
console.log(`Hardcoded Static Fake KPIs (OPEN DEFECTS): ${hardcodedDefects.length}`);
hardcodedDefects.forEach(k => console.log(`  - [${k.kpiId}] ${k.label}: ${k.rawFormula} (${k.dashboard})`));
