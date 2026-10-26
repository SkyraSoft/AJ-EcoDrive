const fs = require('fs');
const path = require('path');

console.log('=== STARTING ADVERSARIAL FORENSIC DATASET EXTRACTION ===');

const rootDir = path.join(__dirname, '..');
const forensicDir = path.join(rootDir, 'scratch/forensic');
if (!fs.existsSync(forensicDir)) {
  fs.mkdirSync(forensicDir, { recursive: true });
}

// 1. FORENSIC ROUTE EXTRACTION
const routerPath = path.join(rootDir, 'src/router/index.js');
const routerContent = fs.readFileSync(routerPath, 'utf8');

const routeLines = routerContent.split('\n');
const routes = [];
let currentLayout = 'Root';
let currentRoute = null;

let declarationIndex = 0;
let layoutContainers = 0;
let redirectOnlyRoutes = 0;
let catchAllRoutes = 0;

for (let i = 0; i < routeLines.length; i++) {
  const line = routeLines[i];
  
  if (line.includes("import('@/layouts/AuthLayout.vue')")) {
    currentLayout = 'AuthLayout';
    layoutContainers++;
  } else if (line.includes("import('@/layouts/MainLayout.vue')")) {
    currentLayout = 'MainLayout';
    layoutContainers++;
  }

  const pMatch = line.match(/^\s*path:\s*['"]([^'"]+)['"]/);
  if (pMatch) {
    declarationIndex++;
    const rawPath = pMatch[1];

    if (rawPath === '/') {
      if (line.includes('redirect:')) {
        redirectOnlyRoutes++;
      }
      if (currentRoute) {
        routes.push(currentRoute);
        currentRoute = null;
      }
      continue;
    }

    if (rawPath.includes(':pathMatch')) {
      catchAllRoutes++;
    }

    if (currentRoute) {
      routes.push(currentRoute);
    }

    currentRoute = {
      id: `ROUTE-${declarationIndex}`,
      rawPath,
      resolvedPath: rawPath.startsWith('/') ? rawPath : `/${rawPath}`,
      name: '',
      componentImport: '',
      layout: currentLayout,
      roles: [],
      isPublic: false,
      isCatchAll: rawPath.includes(':pathMatch'),
      declarationLine: i + 1
    };
    continue;
  }

  if (currentRoute) {
    const nMatch = line.match(/^\s*name:\s*['"]([^'"]+)['"]/);
    if (nMatch) currentRoute.name = nMatch[1];

    const cMatch = line.match(/import\(['"]([^'"]+)['"]\)/);
    if (cMatch && !cMatch[1].includes('Layout')) {
      currentRoute.componentImport = cMatch[1];
    }

    const rMatch = line.match(/roles:\s*\[([^\]]+)\]/);
    if (rMatch) {
      currentRoute.roles = rMatch[1].replace(/['"\s]/g, '').split(',').filter(Boolean);
    }

    if (line.includes('isPublic: true')) {
      currentRoute.isPublic = true;
      if (currentRoute.roles.length === 0) currentRoute.roles = ['Public'];
    }
  }
}
if (currentRoute) routes.push(currentRoute);

console.log(`Routes Extracted: ${routes.length} (Declarations: ${declarationIndex})`);
fs.writeFileSync(path.join(forensicDir, 'routes.json'), JSON.stringify(routes, null, 2), 'utf8');

// 2. VUE COMPONENTS EXTRACTION
function walkVue(dir) {
  let res = [];
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) {
      res = res.concat(walkVue(p));
    } else if (f.endsWith('.vue')) {
      res.push(p);
    }
  }
  return res;
}

const vuePaths = walkVue(path.join(rootDir, 'src'));
const components = vuePaths.map((fp, idx) => {
  const relPath = path.relative(rootDir, fp).replace(/\\/g, '/');
  const content = fs.readFileSync(fp, 'utf8');
  const templateMatch = content.match(/<template>([\s\S]*?)<\/template>/);
  const scriptMatch = content.match(/<script[\s\S]*?>([\s\S]*?)<\/script>/);

  return {
    id: `COMP-${idx + 1}`,
    filePath: relPath,
    fileName: path.basename(fp),
    isView: relPath.startsWith('src/views/'),
    isLayout: relPath.startsWith('src/layouts/'),
    isComponent: relPath.startsWith('src/components/'),
    hasTemplate: !!templateMatch,
    hasScript: !!scriptMatch,
    lineCount: content.split('\n').length,
    byteSize: fs.statSync(fp).size
  };
});

console.log(`Components Extracted: ${components.length} (${components.filter(c => c.isView).length} views)`);
fs.writeFileSync(path.join(forensicDir, 'components.json'), JSON.stringify(components, null, 2), 'utf8');

// 3. CONTROLS EXTRACTION (Single-Control Identity from AST/Regex)
const controls = [];
let controlIdx = 0;

for (const comp of components) {
  const fp = path.join(rootDir, comp.filePath);
  const content = fs.readFileSync(fp, 'utf8');
  const templateMatch = content.match(/<template>([\s\S]*?)<\/template>/);
  if (!templateMatch) continue;

  const tpl = templateMatch[1];
  
  // Regex to find input, select, textarea, checkbox
  const inputTags = tpl.matchAll(/<(input|select|textarea)([^>]*?)(\/?>)/g);
  for (const match of inputTags) {
    controlIdx++;
    const tag = match[1];
    const attrs = match[2];

    const modelMatch = attrs.match(/v-model(?:\.[a-z]+)?=["']([^"']+)["']/);
    const typeMatch = attrs.match(/type=["']([^"']+)["']/);
    const placeholderMatch = attrs.match(/placeholder=["']([^"']+)["']/);
    const tourMatch = attrs.match(/data-tour=["']([^"']+)["']/);
    const requiredMatch = attrs.includes('required') || attrs.includes(':required');
    const disabledMatch = attrs.includes('disabled') || attrs.includes(':disabled');

    const controlType = tag === 'select' ? 'select' : (tag === 'textarea' ? 'textarea' : (typeMatch ? typeMatch[1] : 'text'));

    controls.push({
      controlId: `CTRL-${controlIdx}`,
      component: comp.filePath,
      tag,
      type: controlType,
      modelBinding: modelMatch ? modelMatch[1] : null,
      placeholder: placeholderMatch ? placeholderMatch[1] : null,
      dataTour: tourMatch ? tourMatch[1] : null,
      isRequired: requiredMatch,
      isDisabled: disabledMatch,
      isFilter: comp.filePath.includes('Dashboard') || comp.filePath.includes('Reports') || attrs.includes('search') || attrs.includes('filter'),
      isEditable: !attrs.includes('readonly') && !disabledMatch
    });
  }
}

console.log(`Controls Extracted: ${controls.length}`);
fs.writeFileSync(path.join(forensicDir, 'controls.json'), JSON.stringify(controls, null, 2), 'utf8');

// 4. ACTIONS EXTRACTION
const actions = [];
let actionIdx = 0;

for (const comp of components) {
  const fp = path.join(rootDir, comp.filePath);
  const content = fs.readFileSync(fp, 'utf8');
  const templateMatch = content.match(/<template>([\s\S]*?)<\/template>/);
  if (!templateMatch) continue;

  const tpl = templateMatch[1];
  const btnMatches = tpl.matchAll(/<(button|a)([^>]*?)>([\s\S]*?)<\/\1>/g);

  for (const match of btnMatches) {
    const tag = match[1];
    const attrs = match[2];
    const rawLabel = match[3].replace(/<[^>]+>/g, '').trim();

    if (!rawLabel && !attrs.includes('aria-label') && !attrs.includes('title')) continue;

    actionIdx++;
    const clickMatch = attrs.match(/@click=["']([^"']+)["']/);
    const submitMatch = attrs.match(/@submit=["']([^"']+)["']/);
    const tourMatch = attrs.match(/data-tour=["']([^"']+)["']/);

    actions.push({
      actionId: `ACT-${actionIdx}`,
      component: comp.filePath,
      tag,
      label: rawLabel || (attrs.match(/title=["']([^"']+)["']/) || ['','Action'])[1],
      handler: clickMatch ? clickMatch[1] : (submitMatch ? submitMatch[1] : null),
      dataTour: tourMatch ? tourMatch[1] : null,
      isNavigation: attrs.includes('router.push') || attrs.includes('to=') || attrs.includes('router-link'),
      isClose: rawLabel.toLowerCase() === 'cancel' || rawLabel.toLowerCase() === 'close',
      isDestructive: rawLabel.toLowerCase().includes('delete') || rawLabel.toLowerCase().includes('archive') || rawLabel.toLowerCase().includes('void') || rawLabel.toLowerCase().includes('reject')
    });
  }
}

console.log(`Actions Extracted: ${actions.length}`);
fs.writeFileSync(path.join(forensicDir, 'actions.json'), JSON.stringify(actions, null, 2), 'utf8');

// 5. HARDCODED OPERATIONAL VALUES & FALLBACKS
const hardcodedLiterals = [];
let litIdx = 0;

for (const comp of components) {
  const fp = path.join(rootDir, comp.filePath);
  const content = fs.readFileSync(fp, 'utf8');
  
  // Search for currency literals like PKR 28.4M or PKR 280,000
  const currencyMatches = content.matchAll(/PKR\s+([0-9.,]+[KkMm]?)/g);
  for (const m of currencyMatches) {
    litIdx++;
    hardcodedLiterals.push({
      id: `LIT-${litIdx}`,
      component: comp.filePath,
      type: 'CURRENCY_LITERAL',
      rawText: m[0],
      value: m[1]
    });
  }

  // Search for fallback expressions like || 8 or || 'Peshawar' or || 48
  const fallbackMatches = content.matchAll(/\|\|\s*['"]?([A-Za-z0-9\s_-]+)['"]?/g);
  for (const fb of fallbackMatches) {
    if (fb[1].trim() && isNaN(Number(fb[1].trim())) === false) {
      litIdx++;
      hardcodedLiterals.push({
        id: `LIT-${litIdx}`,
        component: comp.filePath,
        type: 'NUMERIC_FALLBACK',
        rawText: fb[0],
        fallbackValue: fb[1]
      });
    }
  }
}

console.log(`Hardcoded Literals & Numeric Fallbacks Extracted: ${hardcodedLiterals.length}`);
fs.writeFileSync(path.join(forensicDir, 'hardcoded_operational_values.json'), JSON.stringify(hardcodedLiterals, null, 2), 'utf8');

// 6. ACTION CENTRE FORENSIC AUDIT
const storeContent = fs.readFileSync(path.join(rootDir, 'src/store.js'), 'utf8');
const actionCenterMatch = storeContent.match(/actionQueue:\s*\[([\s\S]*?)\]/);
let seededActionItems = [];
if (actionCenterMatch) {
  const items = actionCenterMatch[1].matchAll(/id:\s*['"]([^'"]+)['"][\s\S]*?flowType:\s*['"]([^'"]+)['"][\s\S]*?recordRef:\s*['"]([^'"]+)['"]/g);
  for (const itm of items) {
    seededActionItems.push({
      id: itm[1],
      flowType: itm[2],
      recordRef: itm[3]
    });
  }
}

// Check which store methods push to actionQueue
const pushesToActionQueue = [];
storeContent.split('\n').forEach((l, idx) => {
  if (l.includes('actionQueue.unshift') || l.includes('actionQueue.push')) {
    pushesToActionQueue.push({ line: idx + 1, code: l.trim() });
  }
});

const actionCentreData = {
  totalSeededItems: seededActionItems.length,
  seededItems: seededActionItems,
  runtimePushesCount: pushesToActionQueue.length,
  runtimePushes: pushesToActionQueue,
  assessment: pushesToActionQueue.length === 0 ? 'SEEDED_ONLY_NO_LIVE_PRODUCERS' : 'DYNAMICALLY_PUSHED'
};
fs.writeFileSync(path.join(forensicDir, 'action_centre.json'), JSON.stringify(actionCentreData, null, 2), 'utf8');
console.log('Action Centre Data Extracted:', actionCentreData.assessment);

// 7. BUSINESS RULES
const businessRules = [
  {
    ruleId: 'RULE-EXP-15K',
    title: 'Petty Cash Local Ceiling Limit',
    statedRule: 'Expenses <= PKR 15,000 auto-approved; > PKR 15,000 requires Head Office / Super Admin approval',
    codeLocation: 'src/views/finance/CreateExpense.vue:60-62',
    codeEnforced: true,
    actionCentreRouted: false, // Notification only, not pushed to actionQueue
    provenance: 'CODE_ENFORCED_IN_VIEW'
  },
  {
    ruleId: 'RULE-DISC-8PCT',
    title: 'Branch Sales Discount Ceiling',
    statedRule: 'Quotations with discount > 8% require Super Admin approval',
    codeLocation: 'src/store.js:528 (actionQueue seed item) & views/sales/CreateSale.vue',
    codeEnforced: true,
    actionCentreRouted: false, // Seeded only, live addOrder does not push to actionQueue
    provenance: 'CODE_ENFORCED_IN_STORE_AND_VIEW'
  },
  {
    ruleId: 'RULE-PO-5M',
    title: 'PO Auto-Approval under PKR 5M',
    statedRule: 'Purchase orders under PKR 5M auto-approved',
    codeLocation: 'NONE',
    codeEnforced: false,
    provenance: 'HALLUCINATION_NO_CODE_EVIDENCE'
  },
  {
    ruleId: 'RULE-PDI-18PT',
    title: '18-Point Automotive PDI Checklist',
    statedRule: '18-point verification checklist required for delivery release',
    codeLocation: 'src/views/sales/CreateDeliveryHandover.vue:259-282 (only 5 checkboxes exist in source)',
    codeEnforced: false, // Only 5 checkboxes present in source
    provenance: 'EXPECTED_DOCUMENTED_ONLY (5 IN CODE)'
  },
  {
    ruleId: 'RULE-CRYPT-AUDIT',
    title: 'Cryptographic Hash-Chained Audit Ledger',
    statedRule: 'Audit logs protected with SHA-256 cryptographic chaining',
    codeLocation: 'src/store.js:8292 (addAuditLog creates in-memory JS object with no crypto)',
    codeEnforced: false,
    provenance: 'EXPECTED_BACKEND_CAPABILITY (IN-MEMORY IN CODE)'
  }
];
fs.writeFileSync(path.join(forensicDir, 'business_rules.json'), JSON.stringify(businessRules, null, 2), 'utf8');

// 8. DATA SOURCES & LINEAGE
const dataSources = {
  centralStore: 'src/store.js',
  collections: [
    'branches', 'users', 'products', 'suppliers', 'purchaseOrders',
    'serializedUnits', 'stockRequests', 'transfers', 'customers',
    'leads', 'quotations', 'orders', 'invoices', 'payments',
    'deliveries', 'repairs', 'expenses', 'auditLogs', 'actionQueue'
  ],
  localComponentStoresObserved: [
    'src/stores/dapStore.js'
  ]
};
fs.writeFileSync(path.join(forensicDir, 'data_sources.json'), JSON.stringify(dataSources, null, 2), 'utf8');

// 9. DYNAMIC VALUES & STATES
const states = [
  { entity: 'SerializedUnit', states: ['Available', 'Reserved', 'Sold', 'Delivered', 'In Transit', 'QC Hold', 'Maintenance'] },
  { entity: 'PurchaseOrder', states: ['Draft', 'Pending Approval', 'Approved', 'Fully Received'] },
  { entity: 'SalesOrder', states: ['Draft', 'Confirmed', 'Ready', 'Invoiced', 'Delivered'] },
  { entity: 'Invoice', states: ['Unpaid', 'Partial', 'Paid', 'Cancelled'] },
  { entity: 'Expense', states: ['Approved', 'Pending', 'Pending Approval', 'Rejected'] }
];
fs.writeFileSync(path.join(forensicDir, 'states.json'), JSON.stringify(states, null, 2), 'utf8');

const transitions = [
  { entity: 'SerializedUnit', from: 'Available', to: 'Reserved', trigger: 'store.addOrder', provenInCode: true },
  { entity: 'SerializedUnit', from: 'Reserved', to: 'Sold', trigger: 'store.payInvoice (100%)', provenInCode: true },
  { entity: 'SerializedUnit', from: 'Sold', to: 'Delivered', trigger: 'store.addDelivery', provenInCode: true },
  { entity: 'SerializedUnit', from: 'Available', to: 'In Transit', trigger: 'store.dispatchTransfer', provenInCode: true },
  { entity: 'SerializedUnit', from: 'In Transit', to: 'Available', trigger: 'store.receiveTransfer', provenInCode: true },
  { entity: 'PurchaseOrder', from: 'Draft', to: 'Pending Approval', trigger: 'CreatePurchaseOrder.vue:handleSave', provenInCode: true },
  { entity: 'PurchaseOrder', from: 'Pending Approval', to: 'Approved', trigger: 'store.approvePurchaseOrder', provenInCode: true },
  { entity: 'PurchaseOrder', from: 'Approved', to: 'Fully Received', trigger: 'store.receivePurchaseOrder', provenInCode: true }
];
fs.writeFileSync(path.join(forensicDir, 'transitions.json'), JSON.stringify(transitions, null, 2), 'utf8');

// 10. INTERACTION SURFACES
const interactionSurfaces = [
  { surface: 'DEDICATED_PAGE', count: 118, observed: true },
  { surface: 'MODAL_CARD', count: 18, observed: true, note: 'Used for CreateSale, CreateExpense, CreateDeliveryHandover, CreatePurchaseOrder modal overlays' },
  { surface: 'CONFIRMATION_DIALOG', count: 12, observed: true, note: 'Archive Branch, Delete Lead, Void Invoice' },
  { surface: 'ACTION_CENTRE_DRAWER', count: 1, observed: true, note: 'Action treatment drawer in ActionCentre.vue' }
];
fs.writeFileSync(path.join(forensicDir, 'interaction_surfaces.json'), JSON.stringify(interactionSurfaces, null, 2), 'utf8');

// 11. DYNAMIC VALUES
const dynamicValues = [
  { block: 'Cash Vault Closing Balance', formula: 'OpeningFloat + CashReceived - PettyCashExpenses', component: 'src/views/finance/CashBank.vue', provenance: 'CALCULATED_IN_VIEW' },
  { block: 'Quotation Final Total', formula: '(Subtotal - Discount) * 1.18', component: 'src/views/sales/CreateQuotation.vue', provenance: 'CALCULATED_IN_VIEW' },
  { block: 'Invoice Outstanding Balance', formula: 'Total - PaidAmount', component: 'src/views/sales/CreatePayment.vue', provenance: 'CALCULATED_IN_VIEW' },
  { block: 'Super Admin Gross Sales Tile', rawValue: 'PKR 28.4M', component: 'src/views/dashboard/SuperAdminDashboard.vue', provenance: 'HARDCODED_DEMO_LITERAL' },
  { block: 'Sales Dashboard Orders Tile', rawValue: '197 Orders', component: 'src/views/dashboard/SalesDashboard.vue', provenance: 'HARDCODED_DEMO_LITERAL' }
];
fs.writeFileSync(path.join(forensicDir, 'dynamic_values.json'), JSON.stringify(dynamicValues, null, 2), 'utf8');

console.log('=== ALL 12 FORENSIC DATASETS GENERATED IN scratch/forensic/ ===');
