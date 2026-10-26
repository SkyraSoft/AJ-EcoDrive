const fs = require('fs');
const path = require('path');

console.log('--- STARTING FORENSIC BASELINE EVIDENCE AUDIT ---');

// 1. Git Commit Hash
const commitHash = '46ebf598d539fe4b3a302ed17d1109237ea6c7d9';

// 2. Scan Vue Files
function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(filePath));
    } else if (file.endsWith('.vue')) {
      results.push(filePath);
    }
  }
  return results;
}

const vueFiles = walk(path.join(__dirname, '../src'));
console.log(`Observed Vue Files in src/: ${vueFiles.length}`);

// 3. Inspect router/index.js
const routerPath = path.join(__dirname, '../src/router/index.js');
const routerContent = fs.readFileSync(routerPath, 'utf8');

// Find all route blocks
const routeLines = routerContent.split('\n');
const parsedRoutes = [];
let cur = null;

for (let i = 0; i < routeLines.length; i++) {
  const line = routeLines[i];
  if (line.includes("path:") && !line.includes("path: '/'")) {
    const pMatch = line.match(/path:\s*['"]([^'"]+)['"]/);
    if (pMatch) {
      if (cur) parsedRoutes.push(cur);
      cur = {
        path: pMatch[1],
        name: null,
        componentImport: null,
        roles: [],
        isPublic: false,
        line: i + 1
      };
    }
  } else if (cur) {
    const nMatch = line.match(/name:\s*['"]([^'"]+)['"]/);
    if (nMatch) cur.name = nMatch[1];
    
    const cMatch = line.match(/import\(['"]([^'"]+)['"]\)/);
    if (cMatch) cur.componentImport = cMatch[1];

    const rMatch = line.match(/roles:\s*\[([^\]]+)\]/);
    if (rMatch) {
      cur.roles = rMatch[1].replace(/['"\s]/g, '').split(',').filter(Boolean);
    }

    if (line.includes('isPublic: true')) {
      cur.isPublic = true;
    }
  }
}
if (cur) parsedRoutes.push(cur);

console.log(`Total Parsed Route Handlers in router/index.js: ${parsedRoutes.length}`);

// Check unique paths vs aliases
const pathToRoutes = {};
for (const r of parsedRoutes) {
  if (!pathToRoutes[r.path]) pathToRoutes[r.path] = [];
  pathToRoutes[r.path].push(r);
}

const uniquePaths = Object.keys(pathToRoutes);
console.log(`Unique Path Patterns: ${uniquePaths.length}`);

// Check Roles in router
const allRoles = new Set();
for (const r of parsedRoutes) {
  r.roles.forEach(role => allRoles.add(role));
}
console.log(`Observed Roles in router/index.js:`, Array.from(allRoles));

// Check Regression Cases
console.log('\n--- REGRESSION AUDIT ---');

// Case A: /password-updated
const pwUpdatedRoute = parsedRoutes.find(r => r.path === 'password-updated');
console.log('Regression Case A (/password-updated):', pwUpdatedRoute ? {
  path: pwUpdatedRoute.path,
  componentImport: pwUpdatedRoute.componentImport,
  isPublic: pwUpdatedRoute.isPublic,
  line: pwUpdatedRoute.line
} : 'NOT FOUND');

// Case B: Create Purchase Order routes
const poRoutes = parsedRoutes.filter(r => r.componentImport && r.componentImport.includes('CreatePurchaseOrder'));
console.log('Regression Case B (CreatePurchaseOrder routes):', poRoutes.map(r => ({ path: r.path, name: r.name, line: r.line })));

// Case C: Create Branch component inspection
const createBranchFile = path.join(__dirname, '../src/views/organisation/CreateBranch.vue');
const createBranchContent = fs.readFileSync(createBranchFile, 'utf8');
const branchFormMatch = createBranchContent.match(/const form = ref\(\{([\s\S]*?)\}\)/);
console.log('Regression Case C (CreateBranch.vue form fields observed in source):');
if (branchFormMatch) {
  console.log(branchFormMatch[1].trim());
}

// Case D: CreatePurchaseOrder.vue form fields
const createPoFile = path.join(__dirname, '../src/views/procurement/CreatePurchaseOrder.vue');
const createPoContent = fs.readFileSync(createPoFile, 'utf8');
const poFormMatch = createPoContent.match(/const form = ref\(\{([\s\S]*?)\}\)/);
console.log('\nCreatePurchaseOrder.vue form fields observed in source:');
if (poFormMatch) {
  console.log(poFormMatch[1].trim());
}

// Case E: Search for any PO auto-approval threshold logic in store.js
const storeContent = fs.readFileSync(path.join(__dirname, '../src/store.js'), 'utf8');
const hasPo5M = storeContent.includes('5M') || storeContent.includes('5000000');
console.log(`\nPO 5M Auto-approval logic in store.js: ${storeContent.includes('auto-approved') ? 'FOUND' : 'ZERO SOURCE EVIDENCE (HALLUCINATION)'}`);

// Check actual action centre items in store.js
console.log('\n--- ACTION CENTRE & NOTIFICATIONS IN STORE.JS ---');
const actionItemsMatch = storeContent.match(/actionCenterItems:\s*\[([\s\S]*?)\]/);
if (actionItemsMatch) {
  const count = (actionItemsMatch[1].match(/id:\s*['"]/g) || []).length;
  console.log(`Initial Action Centre items count in store.js: ${count}`);
}

fs.writeFileSync(path.join(__dirname, '../scratch/baseline_audit_output.json'), JSON.stringify({
  commitHash,
  vueFilesCount: vueFiles.length,
  totalParsedRouteHandlers: parsedRoutes.length,
  uniquePathsCount: uniquePaths.length,
  allRoles: Array.from(allRoles),
  pwUpdatedRoute,
  poRoutes,
  poFormFields: poFormMatch ? poFormMatch[1].trim() : null,
  branchFormFields: branchFormMatch ? branchFormMatch[1].trim() : null
}, null, 2), 'utf8');

console.log('\nBaseline audit data saved to scratch/baseline_audit_output.json');
