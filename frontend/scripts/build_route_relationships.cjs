const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const routeMath = JSON.parse(fs.readFileSync(path.join(rootDir, 'scratch/forensic/baseline/route_math.json'), 'utf8'));

// Find all navigation links in the application components to determine which routes are linked in menus/sidebars
const components = JSON.parse(fs.readFileSync(path.join(rootDir, 'scratch/forensic/components.json'), 'utf8'));
const navigationLinks = new Set();

for (const comp of components) {
  const fp = path.join(rootDir, comp.filePath);
  if (!fs.existsSync(fp)) continue;
  const content = fs.readFileSync(fp, 'utf8');

  // Match router-link :to, to, router.push
  const toMatches = [...content.matchAll(/(?:to=["']|:to="\{?\s*path:\s*['"]|router\.push\(?['"])([^'"}?]+)/g)];
  for (const m of toMatches) {
    let p = m[1].trim();
    if (p.startsWith('/')) p = p.substring(1);
    navigationLinks.add(p);
  }
}

// Group routes by component
const byComponent = {};
for (const decl of routeMath.allDeclarations) {
  if (decl.component) {
    if (!byComponent[decl.component]) byComponent[decl.component] = [];
    byComponent[decl.component].push(decl);
  }
}

const relationshipRecords = [];
const multiRouteComps = Object.entries(byComponent).filter(([c, list]) => list.length > 1);

for (const [comp, list] of multiRouteComps) {
  // Determine canonical route: the one with full standard RESTful path or dynamic :id
  // and check legacy aliases
  for (const r of list) {
    let relType = 'CANONICAL_STATIC_VARIANT';
    let reason = '';

    const isDynamic = r.fullPath.includes(':');
    const isNamedAlias = r.name && (r.name.includes('-alias') || r.name.includes('-legacy'));
    const isLinked = navigationLinks.has(r.fullPath.replace(/^\//, '')) || navigationLinks.has(r.fullPath);

    if (r.name && r.name.includes('-legacy')) {
      relType = 'LEGACY_COMPATIBILITY_ROUTE';
      reason = `Explicit legacy route '${r.fullPath}' retained for backward compatibility with query-param navigation.`;
    } else if (r.name && r.name.includes('-alias')) {
      relType = 'TRUE_ALIAS';
      reason = `Alternate shortcut alias path '${r.fullPath}' pointing to primary RESTful component.`;
    } else if (comp.includes('ReceivePurchase.vue') && r.fullPath.includes('/procurement/receipts')) {
      relType = 'DISTINCT_BUSINESS_ROUTE_SHARED_COMPONENT';
      reason = `Receipts grid tab (/procurement/receipts) intentionally reuses ReceivePurchase component in listing mode.`;
    } else if (comp.includes('AuditLog.vue') && r.fullPath.includes('/system/audit-log/:id')) {
      relType = 'CANONICAL_DYNAMIC_VARIANT';
      reason = `Canonical detail inspection view for single audit event log record.`;
    } else if (comp.includes('AuditLog.vue') && r.fullPath === '/system/audit-log') {
      relType = 'CANONICAL_STATIC_VARIANT';
      reason = `Canonical ledger grid view for organization audit event stream.`;
    } else if (isDynamic) {
      relType = 'CANONICAL_DYNAMIC_VARIANT';
      reason = `Primary parameterized RESTful route for record ID detail inspection.`;
    } else {
      relType = 'CANONICAL_STATIC_VARIANT';
      reason = `Primary static route for creation form or domain entry point.`;
    }

    relationshipRecords.push({
      forensicId: r.forensicId,
      fullPath: r.fullPath,
      name: r.name,
      component: comp,
      relationshipType: relType,
      isNavigable: r.isNavigable,
      isLinkedFromMenu: isLinked,
      reason,
      routerEvidence: `Line ${r.line} in src/router/index.js`
    });
  }
}

fs.writeFileSync(
  path.join(rootDir, 'scratch/forensic/baseline/route_relationships.json'),
  JSON.stringify({
    multiRouteComponentCount: multiRouteComps.length,
    classifiedRouteCount: relationshipRecords.length,
    relationships: relationshipRecords
  }, null, 2),
  'utf8'
);

const relCounts = {};
relationshipRecords.forEach(r => relCounts[r.relationshipType] = (relCounts[r.relationshipType] || 0) + 1);

console.log('=== ROUTE RELATIONSHIP CLASSIFICATION ===');
console.log('Multi-route Components Audited:', multiRouteComps.length);
console.log('Route Declarations Classified:', relationshipRecords.length);
console.log('Relationship Breakdown:', relCounts);
