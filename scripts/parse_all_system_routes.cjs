const fs = require('fs');
const path = require('path');

const routerFile = path.join(__dirname, '../src/router/index.js');
const content = fs.readFileSync(routerFile, 'utf8');

// We will parse the routes by scanning top-level layouts and their children
// AuthLayout children and MainLayout children
const lines = content.split('\n');

const routes = [];
let currentLayout = null;
let currentRoute = null;
let inChildren = false;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  // Detect Layouts
  if (line.includes("import('@/layouts/AuthLayout.vue')")) {
    currentLayout = 'AuthLayout';
  } else if (line.includes("import('@/layouts/MainLayout.vue')")) {
    currentLayout = 'MainLayout';
  }

  // Detect path of route
  const pathMatch = line.match(/^\s*path:\s*['"]([^'"]+)['"]/);
  if (pathMatch) {
    const rawPath = pathMatch[1];
    if (rawPath === '/') {
      // Top level layout route, flush any active route
      if (currentRoute) {
        routes.push(currentRoute);
        currentRoute = null;
      }
      continue;
    }

    // This is an actual child route
    if (currentRoute) {
      routes.push(currentRoute);
    }

    currentRoute = {
      path: rawPath,
      name: '',
      component: '',
      layout: currentLayout,
      roles: [],
      isPublic: false,
      line: i + 1
    };
    continue;
  }

  // If inside a route definition
  if (currentRoute) {
    const nameMatch = line.match(/^\s*name:\s*['"]([^'"]+)['"]/);
    if (nameMatch) {
      currentRoute.name = nameMatch[1];
    }

    const compMatch = line.match(/import\(['"]([^'"]+)['"]\)/);
    if (compMatch) {
      // Only assign if it's NOT a layout
      if (!compMatch[1].includes('Layout')) {
        currentRoute.component = compMatch[1];
      }
    }

    const rolesMatch = line.match(/roles:\s*\[([^\]]+)\]/);
    if (rolesMatch) {
      currentRoute.roles = rolesMatch[1].replace(/['"\s]/g, '').split(',').filter(Boolean);
    }

    if (line.includes('isPublic: true')) {
      currentRoute.isPublic = true;
      if (currentRoute.roles.length === 0) {
        currentRoute.roles = ['Public'];
      }
    }
  }
}

if (currentRoute) {
  routes.push(currentRoute);
}

console.log(`Accurately Parsed Routes: ${routes.length}`);

// Test Regression Case A
const pwUpdated = routes.find(r => r.path === 'password-updated');
console.log('Regression Case A (/password-updated):', pwUpdated);

// Test Regression Case B
const poCreate = routes.filter(r => r.component.includes('CreatePurchaseOrder'));
console.log('Regression Case B (CreatePurchaseOrder):', poCreate);

fs.writeFileSync(path.join(__dirname, '../scratch/parsed_all_system_routes.json'), JSON.stringify({
  totalRoutesCount: routes.length,
  routes
}, null, 2), 'utf8');

console.log('Saved accurately parsed routes to scratch/parsed_all_system_routes.json');
