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

  const decl = {
    index: allRouteDecls.length + 1,
    line: node.loc.start.line,
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

const layouts = allRouteDecls.filter(r => r.hasChildren);
const redirects = allRouteDecls.filter(r => r.redirect && !r.hasChildren && (!r.rawPath || !r.rawPath.includes(':pathMatch')));
const catchAll = allRouteDecls.filter(r => r.rawPath && r.rawPath.includes(':pathMatch'));
const leaves = allRouteDecls.filter(r => !r.hasChildren && !r.redirect && (!r.rawPath || !r.rawPath.includes(':pathMatch')));

// Group leaves by component
const byComponent = {};
for (const r of leaves) {
  if (!byComponent[r.component]) byComponent[r.component] = [];
  byComponent[r.component].push(r);
}

const multiRouteComponents = Object.entries(byComponent).filter(([c, list]) => list.length > 1);

console.log('=== ROUTE AST AUDIT SUMMARY ===');
console.log('TOTAL_ROUTE_OBJECTS:', allRouteDecls.length);
console.log('LAYOUT_ROUTE_OBJECTS:', layouts.length);
console.log('REDIRECT_ONLY_ROUTE_OBJECTS:', redirects.length);
console.log('CATCH_ALL_ROUTE_OBJECTS:', catchAll.length);
console.log('LEAF_ROUTES_TOTAL:', leaves.length);
console.log('UNIQUE_VIEW_COMPONENTS:', Object.keys(byComponent).length);
console.log('COMPONENTS_WITH_MULTIPLE_ROUTES:', multiRouteComponents.length);

multiRouteComponents.forEach(([comp, list]) => {
  console.log(`\nComponent ${comp} bound to ${list.length} routes:`);
  list.forEach(r => {
    console.log(`  - Line ${r.line}: name="${r.name}", fullPath="${r.fullPath}"`);
  });
});
