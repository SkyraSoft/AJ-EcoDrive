const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');

const code = fs.readFileSync(path.join(__dirname, '../src/router/index.js'), 'utf8');
const ast = parser.parse(code, { sourceType: 'module', plugins: ['dynamicImport'] });

let routesArrayNode = null;
function findRoutes(node) {
  if (!node || typeof node !== 'object') return;
  if (node.type === 'ObjectProperty' && node.key && (node.key.name === 'routes' || node.key.value === 'routes')) {
    if (node.value.type === 'ArrayExpression') {
      routesArrayNode = node.value;
      return;
    }
  }
  for (const key of Object.keys(node)) {
    if (key === 'loc' || key === 'start' || key === 'end') continue;
    const child = node[key];
    if (Array.isArray(child)) {
      for (const c of child) { findRoutes(c); if (routesArrayNode) return; }
    } else if (child && typeof child === 'object') {
      findRoutes(child); if (routesArrayNode) return;
    }
  }
}
findRoutes(ast);

function getProp(node, propName) {
  if (!node || node.type !== 'ObjectExpression') return null;
  const prop = node.properties.find(p => p.key && (p.key.name === propName || p.key.value === propName));
  return prop ? prop.value : null;
}

const allRouteDecls = [];
function walkRoute(node, parentPath = '', layoutContext = null) {
  if (!node || node.type !== 'ObjectExpression') return;
  const pathNode = getProp(node, 'path');
  const nameNode = getProp(node, 'name');
  const redirectNode = getProp(node, 'redirect');
  const componentNode = getProp(node, 'component');
  const metaNode = getProp(node, 'meta');
  const childrenNode = getProp(node, 'children');

  const pathVal = pathNode && pathNode.type === 'StringLiteral' ? pathNode.value : null;
  const nameVal = nameNode && nameNode.type === 'StringLiteral' ? nameNode.value : null;
  const redirectVal = redirectNode && redirectNode.type === 'StringLiteral' ? redirectNode.value : null;
  let componentName = null;
  if (componentNode && (componentNode.type === 'ArrowFunctionExpression' || componentNode.type === 'FunctionExpression')) {
    const body = componentNode.body;
    if (body && body.type === 'CallExpression' && body.arguments && body.arguments.length > 0) {
      componentName = body.arguments[0].value;
    }
  }
  let roles = [];
  let isPublic = false;
  if (metaNode && metaNode.type === 'ObjectExpression') {
    const rolesProp = getProp(metaNode, 'roles');
    if (rolesProp && rolesProp.type === 'ArrayExpression') {
      roles = rolesProp.elements.map(e => e.value).filter(Boolean);
    }
    const publicProp = getProp(metaNode, 'isPublic');
    if (publicProp && publicProp.type === 'BooleanLiteral') isPublic = publicProp.value;
  }
  let fullPath = pathVal;
  if (parentPath && pathVal) {
    if (pathVal.startsWith('/')) fullPath = pathVal;
    else fullPath = parentPath === '/' ? '/' + pathVal : parentPath + '/' + pathVal;
  } else if (!pathVal && parentPath) fullPath = parentPath;

  const declIndex = allRouteDecls.length + 1;
  const forensicId = `ROUTE-${String(declIndex).padStart(3, '0')}`;

  const decl = {
    forensicId: forensicId,
    index: declIndex,
    line: node.loc.start.line,
    endLine: node.loc.end.line,
    rawPath: pathVal,
    fullPath: fullPath,
    name: nameVal,
    redirect: redirectVal,
    component: componentName,
    hasChildren: !!(childrenNode && childrenNode.elements && childrenNode.elements.length > 0),
    layout: layoutContext,
    roles: roles,
    isPublic: isPublic
  };
  allRouteDecls.push(decl);

  if (childrenNode && childrenNode.type === 'ArrayExpression') {
    const nextLayout = componentName ? componentName.split('/').pop().replace('.vue', '') : layoutContext;
    for (const child of childrenNode.elements) {
      walkRoute(child, fullPath, nextLayout);
    }
  }
}

for (const topRoute of routesArrayNode.elements) walkRoute(topRoute, '', null);

// Classifications
const layoutRoutes = allRouteDecls.filter(r => r.hasChildren);
const redirectOnlyRoutes = allRouteDecls.filter(r => r.redirect && !r.hasChildren && (!r.rawPath || !r.rawPath.includes(':pathMatch')));
const catchAllRoutes = allRouteDecls.filter(r => r.rawPath && r.rawPath.includes(':pathMatch'));
const leafRoutes = allRouteDecls.filter(r => !r.hasChildren && !r.redirect && (!r.rawPath || !r.rawPath.includes(':pathMatch')));

// Identify Aliases vs Canonical
const legacyAliases = leafRoutes.filter(r => 
  (r.name && (r.name.includes('-alias') || r.name.includes('-legacy'))) ||
  r.rawPath === 'procurement/create-po' ||
  r.rawPath === 'procurement/receive-purchase' ||
  r.rawPath === 'sales/create-sale' ||
  r.rawPath === 'catalogue/create-product' ||
  r.rawPath === 'catalogue/create-request' ||
  r.rawPath === 'after-sales/create-case' ||
  r.rawPath === 'after-sales/create-repair' ||
  r.rawPath === 'finance/create-expense' ||
  r.rawPath === 'audit-logs/:id' ||
  r.rawPath === 'audit-log/:id' ||
  r.rawPath === 'inventory/units/:id' ||
  r.rawPath === 'inventory/adjustments/:id' ||
  r.rawPath === 'inventory/transfers/:id/receive' ||
  r.rawPath === 'after-sales/cases' ||
  r.rawPath === 'after-sales/warranties'
);

const canonicalNavigableRoutes = leafRoutes.filter(r => !legacyAliases.includes(r));
const dynamicCanonical = canonicalNavigableRoutes.filter(r => r.rawPath.includes(':'));
const dynamicLegacyAliases = legacyAliases.filter(r => r.rawPath.includes(':'));
const publicNavigable = canonicalNavigableRoutes.filter(r => r.isPublic);
const authenticatedNavigable = canonicalNavigableRoutes.filter(r => !r.isPublic);
const uniqueRouteNames = new Set(allRouteDecls.map(r => r.name).filter(Boolean));
const uniqueViewComponents = new Set(leafRoutes.map(r => r.component).filter(Boolean));

const routeMath = {
  TOTAL_ROUTE_OBJECTS: allRouteDecls.length,
  LAYOUT_ROUTE_OBJECTS: layoutRoutes.length,
  REDIRECT_ONLY_ROUTE_OBJECTS: redirectOnlyRoutes.length,
  CATCH_ALL_ROUTE_OBJECTS: catchAllRoutes.length,
  LEAF_ROUTES_TOTAL: leafRoutes.length,
  LEGACY_ALIAS_ROUTES: legacyAliases.length,
  CANONICAL_NAVIGABLE_LEAF_ROUTES: canonicalNavigableRoutes.length,
  DYNAMIC_CANONICAL_ROUTES: dynamicCanonical.length,
  DYNAMIC_LEGACY_ALIAS_ROUTES: dynamicLegacyAliases.length,
  PUBLIC_NAVIGABLE_ROUTES: publicNavigable.length,
  AUTHENTICATED_NAVIGABLE_ROUTES: authenticatedNavigable.length,
  UNIQUE_ROUTE_NAMES: uniqueRouteNames.size,
  UNIQUE_VIEW_COMPONENTS: uniqueViewComponents.size,
  SET_EQUATION: {
    total: `${layoutRoutes.length} (layouts) + ${redirectOnlyRoutes.length} (redirect-only) + ${catchAllRoutes.length} (catch-all) + ${leafRoutes.length} (leaf routes) = ${allRouteDecls.length}`,
    leafBreakdown: `${canonicalNavigableRoutes.length} (canonical leaves) + ${legacyAliases.length} (legacy aliases) = ${leafRoutes.length} (leaf routes)`,
    canonicalAuthBreakdown: `${publicNavigable.length} (public) + ${authenticatedNavigable.length} (authenticated) = ${canonicalNavigableRoutes.length} (canonical leaves)`
  },
  allDeclarations: allRouteDecls.map(r => ({
    forensicId: r.forensicId,
    line: r.line,
    name: r.name,
    fullPath: r.fullPath,
    category: r.hasChildren ? 'LAYOUT' : (r.rawPath && r.rawPath.includes(':pathMatch') ? 'CATCH_ALL' : (r.redirect ? 'REDIRECT' : (legacyAliases.includes(r) ? 'LEGACY_ALIAS' : 'CANONICAL_LEAF'))),
    component: r.component,
    isNavigable: !r.hasChildren && !r.redirect && !(r.rawPath && r.rawPath.includes(':pathMatch')),
    isPublic: r.isPublic,
    isDynamic: r.rawPath ? r.rawPath.includes(':') : false
  }))
};

fs.writeFileSync(path.join(__dirname, '../scratch/forensic/baseline/route_math.json'), JSON.stringify(routeMath, null, 2), 'utf8');
console.log('Saved scratch/forensic/baseline/route_math.json successfully.');
console.log('Total routes:', allRouteDecls.length);
console.log('Set equation:', routeMath.SET_EQUATION);
