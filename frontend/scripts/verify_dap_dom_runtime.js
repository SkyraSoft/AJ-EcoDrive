import { createServer } from 'vite';
import { JSDOM } from 'jsdom';
import { createApp } from 'vue';
import { renderToString } from 'vue/server-renderer';
import { createRouter, createMemoryHistory } from 'vue-router';
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getRealRoutePath(route, store) {
  let p = route === '//' ? '/' : route;
  
  if (p.includes('repair')) {
    const id = store.repairs?.[0]?.repairId || store.repairs?.[0]?.id || 'RJ-188';
    const base = p.replace(':id', id).replace(/\/detail$/, `/detail`);
    return base.includes('?') ? base : `${base}?id=${id}`;
  }
  if (p.includes('serialized-unit') || p.includes('unit')) {
    const id = store.serializedUnits?.[0]?.id || 'UNIT-101';
    const base = p.replace(':id', id).replace(/\/detail$/, `/detail`);
    return base.includes('?') ? base : `${base}?id=${id}`;
  }
  if (p.includes('customer')) {
    const id = store.customers?.[0]?.id || 'CUST-001';
    const base = p.replace(':id', id).replace(/\/detail$/, `/detail`);
    return base.includes('?') ? base : `${base}?id=${id}`;
  }
  if (p.includes('purchase-order') || p.includes('purchase')) {
    const id = store.purchaseOrders?.[0]?.id || store.purchaseOrders?.[0]?.po || 'PO-2048';
    const base = p.replace(':id', id).replace(/\/detail$/, `/detail`);
    return base.includes('?') ? base : `${base}?id=${id}`;
  }
  if (p.includes('order')) {
    const id = store.orders?.[0]?.id || 'SO-101';
    const base = p.replace(':id', id).replace(/\/detail$/, `/detail`);
    return base.includes('?') ? base : `${base}?id=${id}`;
  }
  if (p.includes('quotation') || p.includes('quote')) {
    const id = store.quotations?.[0]?.id || 'QT-101';
    const base = p.replace(':id', id).replace(/\/detail$/, `/detail`);
    return base.includes('?') ? base : `${base}?id=${id}`;
  }
  if (p.includes('invoice')) {
    const id = store.invoices?.[0]?.id || 'INV-101';
    const base = p.replace(':id', id).replace(/\/detail$/, `/detail`);
    return base.includes('?') ? base : `${base}?id=${id}`;
  }
  if (p.includes('transfer')) {
    const id = store.transfers?.[0]?.id || 'TR-01';
    const base = p.replace(':id', id).replace(/\/detail$/, `/detail`);
    return base.includes('?') ? base : `${base}?id=${id}`;
  }
  if (p.includes('adjustment')) {
    const id = store.stockAdjustments?.[0]?.id || store.adjustments?.[0]?.id || 'ADJ-018';
    const base = p.replace(':id', id).replace(/\/detail$/, `/detail`);
    return base.includes('?') ? base : `${base}?id=${id}`;
  }
  if (p.includes('case')) {
    const id = store.cases?.[0]?.id || 'SC-01';
    const base = p.replace(':id', id).replace(/\/detail$/, `/detail`);
    return base.includes('?') ? base : `${base}?id=${id}`;
  }
  if (p.includes('follow-up')) {
    const id = store.followUps?.[0]?.id || 'FU-01';
    const base = p.replace(':id', id).replace(/\/detail$/, `/detail`);
    return base.includes('?') ? base : `${base}?id=${id}`;
  }
  if (p.includes('payment')) {
    const id = store.payments?.[0]?.id || 'PAY-01';
    const base = p.replace(':id', id).replace(/\/detail$/, `/detail`);
    return base.includes('?') ? base : `${base}?id=${id}`;
  }
  if (p.includes('delivery')) {
    const id = store.deliveries?.[0]?.id || 'DEL-01';
    const base = p.replace(':id', id).replace(/\/detail$/, `/detail`);
    return base.includes('?') ? base : `${base}?id=${id}`;
  }
  if (p.includes('branch')) {
    const id = store.branches?.[0]?.id || 'BR-01';
    const base = p.replace(':id', id).replace(/\/detail$/, `/detail`);
    return base.includes('?') ? base : `${base}?id=${id}`;
  }
  if (p.includes('supplier')) {
    const id = store.suppliers?.[0]?.id || 'SUP-01';
    const base = p.replace(':id', id).replace(/\/detail$/, `/detail`);
    return base.includes('?') ? base : `${base}?id=${id}`;
  }
  if (p.includes('cycle-count')) {
    const id = store.cycleCounts?.[0]?.id || 'CC-01';
    const base = p.replace(':id', id).replace(/\/detail$/, `/detail`);
    return base.includes('?') ? base : `${base}?id=${id}`;
  }
  if (p.includes('quarantine')) {
    const id = store.quarantineRecords?.[0]?.id || 'QR-01';
    const base = p.replace(':id', id).replace(/\/detail$/, `/detail`);
    return base.includes('?') ? base : `${base}?id=${id}`;
  }
  if (p.includes('stock-request')) {
    const id = store.stockRequests?.[0]?.id || 'SR-01';
    const base = p.replace(':id', id).replace(/\/detail$/, `/detail`);
    return base.includes('?') ? base : `${base}?id=${id}`;
  }
  if (p.includes('inbox') || p.includes('conversation')) {
    const id = store.conversations?.[0]?.id || 'CONV-01';
    const base = p.replace(':id', id).replace(/\/detail$/, `/detail`);
    return base.includes('?') ? base : `${base}?id=${id}`;
  }
  return p.replace(':id', '1');
}

async function runRuntimeVerification() {
  console.log('\n================================================================');
  console.log('AJ ECODRIVE — DAP TRUE RUNTIME DOM VERIFICATION ENGINE');
  console.log('================================================================\n');

  const coveragePath = path.join(__dirname, '../src/config/branchManagerDAPCoverage.js');
  const { branchManagerCoverageRegistry, branchManagerCoverageMetrics } = await import(pathToFileURL(coveragePath).href);

  const dom = new JSDOM('<!DOCTYPE html><html><body><div id="app"></div></body></html>', {
    url: 'http://localhost:3000'
  });
  globalThis.window = dom.window;
  globalThis.document = dom.window.document;
  globalThis.location = dom.window.location;

  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom'
  });

  // Load store module to inject real entities for detail views
  const storeMod = await vite.ssrLoadModule('src/store.js');
  const store = storeMod.store;

  // Set active authenticated Branch Manager session so all isBranchUser conditionals render
  store.currentUser = {
    isAuthenticated: true,
    branchCode: 'PEW-01',
    branchName: 'Peshawar',
    role: 'Branch Manager',
    name: 'Tariq Khan',
    email: 'manager.peshawar@ajecodrive.com',
    isSuperAdmin: false
  };

  // Prime store with selected entities so detail pages render their full view
  if (store.repairs && store.repairs.length > 0) store.selectedRepair = store.repairs[0];
  if (store.customers && store.customers.length > 0) store.selectedCustomer = store.customers[0];
  if (store.serializedUnits && store.serializedUnits.length > 0) store.selectedUnit = store.serializedUnits[0];
  if (store.orders && store.orders.length > 0) store.selectedOrder = store.orders[0];
  if (store.invoices && store.invoices.length > 0) store.selectedInvoice = store.invoices[0];
  if (store.transfers && store.transfers.length > 0) store.selectedTransfer = store.transfers[0];
  if (store.purchaseOrders && store.purchaseOrders.length > 0) store.selectedPurchaseOrder = store.purchaseOrders[0];
  if (store.suppliers && store.suppliers.length > 0) store.selectedSupplier = store.suppliers[0];
  if (store.cases && store.cases.length > 0) store.selectedCase = store.cases[0];
  if (store.branches && store.branches.length > 0) store.selectedBranch = store.branches[0];
  if (store.leads && store.leads.length > 0) store.selectedLead = store.leads[0];
  if (store.followUps && store.followUps.length > 0) store.selectedFollowUp = store.followUps[0];
  if (store.quotations && store.quotations.length > 0) store.selectedQuotation = store.quotations[0];

  let totalCheckpoints = 0;
  let resolvedCount = 0;
  let unresolvedCount = 0;
  const failuresByRoute = {};
  const verifiedRegistry = [];

  const compCache = {};

  for (let rIdx = 0; rIdx < branchManagerCoverageRegistry.length; rIdx++) {
    const routeObj = branchManagerCoverageRegistry[rIdx];
    const compPath = routeObj.component;

    let html = '';
    try {
      if (!compCache[compPath]) {
        const mod = await vite.ssrLoadModule(compPath);
        compCache[compPath] = mod.default;
      }
      const Component = compCache[compPath];

      // Provide entity ID parameter if detail route
      let navPath = getRealRoutePath(routeObj.route, store);
      const navBase = navPath.split('?')[0];

      const rawRoute = routeObj.route === '//' ? '/' : routeObj.route;
      const routes = [{ path: rawRoute, component: Component }];
      if (navBase !== rawRoute) {
        routes.push({ path: navBase, component: Component });
      }
      const router = createRouter({
        history: createMemoryHistory(),
        routes
      });

      const app = createApp(Component);
      app.use(router);
      await router.push(navPath);
      await router.isReady();

      const ssrContext = { modules: new Set() };
      html = await renderToString(app, ssrContext);
    } catch (err) {
      console.warn(`[WARN] Could not render component ${compPath} for route ${routeObj.route}: ${err.message}`);
    }

    dom.window.document.getElementById('app').innerHTML = html;

    const auditedCheckpoints = [];
    let routeResolved = 0;

    for (const cp of routeObj.checkpoints) {
      totalCheckpoints++;
      let resolvedEl = null;

      try {
        if (cp.targetSelector) {
          resolvedEl = dom.window.document.querySelector(cp.targetSelector);
        }
      } catch (selErr) {
        // syntax error in selector
      }

      if (resolvedEl) {
        resolvedCount++;
        routeResolved++;
        auditedCheckpoints.push({
          ...cp,
          domBound: true,
          runtimeVerified: true,
          resolvedTag: resolvedEl.tagName.toLowerCase(),
          resolvedSnippet: resolvedEl.outerHTML.slice(0, 100).replace(/\s+/g, ' '),
          runtimeError: null
        });
      } else {
        unresolvedCount++;
        if (!failuresByRoute[routeObj.route]) {
          failuresByRoute[routeObj.route] = [];
        }
        failuresByRoute[routeObj.route].push({
          id: cp.id,
          category: cp.elementCategory,
          selector: cp.targetSelector,
          label: cp.label || cp.fieldName || cp.actionName || 'Element'
        });

        auditedCheckpoints.push({
          ...cp,
          domBound: false,
          runtimeVerified: false,
          resolvedTag: null,
          runtimeError: `Selector '${cp.targetSelector}' not found in rendered DOM for route '${routeObj.route}'`
        });
      }
    }

    const routePercent = Math.round((routeResolved / routeObj.checkpoints.length) * 100);
    const statusText = routePercent === 100
      ? '100% Fully Implemented (Real UI DOM-Bound)'
      : `${routePercent}% Verified (${routeResolved}/${routeObj.checkpoints.length} in DOM)`;

    verifiedRegistry.push({
      ...routeObj,
      coverageStatus: statusText,
      checkpoints: auditedCheckpoints
    });

    if ((rIdx + 1) % 25 === 0 || rIdx === branchManagerCoverageRegistry.length - 1) {
      console.log(`Audited ${rIdx + 1} / ${branchManagerCoverageRegistry.length} routes... Verified: ${resolvedCount} | Unresolved: ${unresolvedCount}`);
    }
  }

  await vite.close();

  console.log('\n================================================================');
  console.log('TRUE RUNTIME VERIFICATION RESULTS');
  console.log('================================================================');
  console.log(`Total Checkpoints Audited: ${totalCheckpoints}`);
  console.log(`Successfully Resolved in Real DOM: ${resolvedCount} (${((resolvedCount / totalCheckpoints) * 100).toFixed(1)}%)`);
  console.log(`Unresolved in Real DOM: ${unresolvedCount} (${((unresolvedCount / totalCheckpoints) * 100).toFixed(1)}%)`);

  // Write runtime audit results
  fs.writeFileSync(path.join(__dirname, '../scratch/runtime_audit_results.json'), JSON.stringify({
    totalCheckpoints,
    resolvedCount,
    unresolvedCount,
    failuresByRoute
  }, null, 2), 'utf8');

  // Update machine-readable coverage registry with verified status
  const updatedMetrics = {
    ...branchManagerCoverageMetrics,
    totalDomBound: resolvedCount,
    totalRuntimeVerified: resolvedCount,
    overallFullyCovered: unresolvedCount === 0,
    coveragePercentage: `${((resolvedCount / totalCheckpoints) * 100).toFixed(1)}%`
  };

  const outputCode = `/**
 * AJ EcoDrive — Branch Manager DAP Machine-Readable Coverage Registry
 * Real UI-Bound & Field-by-Field Interactive Multi-Status Verification Model
 *
 * Total Branch Manager Routes: ${verifiedRegistry.length}
 * Total Mapped Training Checkpoints: ${totalCheckpoints}
 * Real DOM Verified Checkpoints: ${resolvedCount}
 * Unresolved Checkpoints: ${unresolvedCount}
 */

export const branchManagerCoverageMetrics = ${JSON.stringify(updatedMetrics, null, 2)};

export const branchManagerCoverageRegistry = ${JSON.stringify(verifiedRegistry, null, 2)};

export const totalBranchManagerRoutes = ${verifiedRegistry.length};
export const totalBranchManagerCheckpoints = ${totalCheckpoints};
export const totalRuntimeVerifiedCheckpoints = ${resolvedCount};

export default {
  coverageMetrics: branchManagerCoverageMetrics,
  coverageRegistry: branchManagerCoverageRegistry,
  totalRoutes: totalBranchManagerRoutes,
  totalCheckpoints: totalBranchManagerCheckpoints,
  totalRuntimeVerified: totalRuntimeVerifiedCheckpoints
};
`;

  fs.writeFileSync(coveragePath, outputCode, 'utf8');
  console.log(`\nUpdated ${coveragePath} with genuine runtime verification data.`);
}

runRuntimeVerification().catch(console.error);
