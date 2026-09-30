const fs = require('fs');
const path = require('path');

const routerFile = path.join(__dirname, '../src/router/index.js');
const content = fs.readFileSync(routerFile, 'utf8');

// Regex to capture path, name, component, roles
const routeRegex = /path:\s*['"]([^'"]+)['"][\s\S]*?(?:name:\s*['"]([^'"]+)['"][\s\S]*?)?component:\s*\(\)\s*=>\s*import\(['"]([^'"]+)['"]\)(?:[\s\S]*?meta:\s*\{([^}]+)\})?/g;

const routes = [];
let match;

// We will split by route block or parse line by line
const lines = content.split('\n');
let currentRoute = null;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.includes("path:") && !line.includes("path: '/'")) {
    const pathMatch = line.match(/path:\s*['"]([^'"]+)['"]/);
    if (pathMatch) {
      if (currentRoute) routes.push(currentRoute);
      currentRoute = { path: pathMatch[1], name: '', component: '', roles: [] };
    }
  } else if (currentRoute) {
    if (line.includes("name:")) {
      const nameMatch = line.match(/name:\s*['"]([^'"]+)['"]/);
      if (nameMatch) currentRoute.name = nameMatch[1];
    }
    if (line.includes("component:")) {
      const compMatch = line.match(/import\(['"]([^'"]+)['"]\)/);
      if (compMatch) currentRoute.component = compMatch[1];
    }
    if (line.includes("roles:")) {
      const rolesMatch = line.match(/roles:\s*\[([^\]]+)\]/);
      if (rolesMatch) {
        currentRoute.roles = rolesMatch[1].replace(/['"\s]/g, '').split(',');
      }
    }
    if (line.includes("isPublic: true")) {
      currentRoute.roles = ['Public'];
    }
  }
}
if (currentRoute) routes.push(currentRoute);

console.log(`Total System Routes Found: ${routes.length}`);

const saRoutes = routes.filter(r => r.roles.includes('SuperAdmin') || r.roles.includes('Super Admin') || r.roles.includes('Public'));
const bmRoutes = routes.filter(r => r.roles.includes('BranchManager') || r.roles.includes('Branch Manager') || r.roles.includes('Public'));
const saOnlyRoutes = routes.filter(r => (r.roles.includes('SuperAdmin') || r.roles.includes('Super Admin')) && !r.roles.includes('BranchManager') && !r.roles.includes('Branch Manager'));
const bmOnlyRoutes = routes.filter(r => (r.roles.includes('BranchManager') || r.roles.includes('Branch Manager')) && !r.roles.includes('SuperAdmin') && !r.roles.includes('Super Admin'));

console.log(`Super Admin Accessible Routes: ${saRoutes.length}`);
console.log(`Branch Manager Accessible Routes: ${bmRoutes.length}`);
console.log(`Super Admin ONLY Routes: ${saOnlyRoutes.length}`);
console.log(`Branch Manager ONLY Routes: ${bmOnlyRoutes.length}`);

fs.writeFileSync(path.join(__dirname, '../scratch/parsed_all_system_routes.json'), JSON.stringify({
  totalRoutesCount: routes.length,
  superAdminRoutesCount: saRoutes.length,
  branchManagerRoutesCount: bmRoutes.length,
  superAdminOnlyCount: saOnlyRoutes.length,
  routes
}, null, 2), 'utf8');
