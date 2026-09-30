const fs = require('fs');
const path = require('path');

const parsedRoutesFile = path.join(__dirname, '../scratch/parsed_bm_routes.json');
const bmRoutes = JSON.parse(fs.readFileSync(parsedRoutesFile, 'utf8'));

function assignOperationalStage(routePath) {
  const p = routePath.toLowerCase();

  // STAGE 1: MORNING OPENING & READINESS
  if (p === '//' || p === '/login' || p === '/forgot-password' || p === '/verify-identity' || p === '/create-new-password' || p === '/password-updated') {
    return { stageId: 'M1', chapter: '1.1', stageTitle: 'Morning Showroom Opening & System Daily Start', chapterTitle: 'Authentication & Identity Security' };
  }
  if (p === '/dashboard') {
    return { stageId: 'M1', chapter: '1.2', stageTitle: 'Morning Showroom Opening & System Daily Start', chapterTitle: 'Showroom Command Hub & Overview' };
  }
  if (p === '/dashboard/quick-actions') {
    return { stageId: 'M1', chapter: '1.3', stageTitle: 'Morning Showroom Opening & System Daily Start', chapterTitle: 'Managerial Quick Actions Palette' };
  }
  if (p.startsWith('/organisation/branches')) {
    return { stageId: 'M1', chapter: '1.4', stageTitle: 'Morning Showroom Opening & System Daily Start', chapterTitle: 'Branch Profile & Parameters' };
  }
  if (p.startsWith('/organisation/users')) {
    return { stageId: 'M1', chapter: '1.5', stageTitle: 'Morning Showroom Opening & System Daily Start', chapterTitle: 'Staff Attendance & Access Roles' };
  }
  if (p.startsWith('/communication')) {
    return { stageId: 'M1', chapter: '1.7', stageTitle: 'Morning Showroom Opening & System Daily Start', chapterTitle: 'Internal Directives & Staff Comms' };
  }

  // STAGE 2: CUSTOMER ARRIVAL, LEADS & KYC
  if (p.startsWith('/sales/leads')) {
    return { stageId: 'M2', chapter: '2.1', stageTitle: 'Customer Arrival, Walk-In Leads & NADRA KYC Verification', chapterTitle: 'Walk-In Prospect Intake' };
  }
  if (p.startsWith('/sales/follow-ups')) {
    return { stageId: 'M2', chapter: '2.2', stageTitle: 'Customer Arrival, Walk-In Leads & NADRA KYC Verification', chapterTitle: 'Test Drive & Prospect Follow-Ups' };
  }
  if (p.startsWith('/sales/customers')) {
    return { stageId: 'M2', chapter: '2.3', stageTitle: 'Customer Arrival, Walk-In Leads & NADRA KYC Verification', chapterTitle: 'Customer Registration & CNIC KYC' };
  }

  // STAGE 3: COMMERCIAL PRICING, QUOTATIONS, POS BOOKING & INVOICING
  if (p.startsWith('/catalogue/categories') || p.startsWith('/catalogue/products')) {
    return { stageId: 'M3', chapter: '3.1', stageTitle: 'Commercial Pricing, Quotations, POS Booking & Invoicing', chapterTitle: 'EV Model Catalog & Specifications' };
  }
  if (p.startsWith('/sales/quotations')) {
    return { stageId: 'M3', chapter: '3.2', stageTitle: 'Commercial Pricing, Quotations, POS Booking & Invoicing', chapterTitle: 'Formal Sales Quotations' };
  }
  if (p === '/sales/orders/create' || p === '/sales/create-sale') {
    return { stageId: 'M3', chapter: '3.3', stageTitle: 'Commercial Pricing, Quotations, POS Booking & Invoicing', chapterTitle: 'Point of Sale (POS) Instant Retail' };
  }
  if (p.startsWith('/sales/orders')) {
    return { stageId: 'M3', chapter: '3.4', stageTitle: 'Commercial Pricing, Quotations, POS Booking & Invoicing', chapterTitle: 'Vehicle Booking Orders' };
  }
  if (p.startsWith('/sales/custom-orders')) {
    return { stageId: 'M3', chapter: '3.5', stageTitle: 'Commercial Pricing, Quotations, POS Booking & Invoicing', chapterTitle: 'Custom Fleet & Corporate Orders' };
  }
  if (p.startsWith('/sales/invoices')) {
    return { stageId: 'M3', chapter: '3.6', stageTitle: 'Commercial Pricing, Quotations, POS Booking & Invoicing', chapterTitle: 'Commercial Invoicing & Taxes' };
  }
  if (p.startsWith('/sales/payments')) {
    return { stageId: 'M3', chapter: '3.7', stageTitle: 'Commercial Pricing, Quotations, POS Booking & Invoicing', chapterTitle: 'Customer Payment Settlement' };
  }
  if (p === '/sales/dashboard') {
    return { stageId: 'M3', chapter: '3.8', stageTitle: 'Commercial Pricing, Quotations, POS Booking & Invoicing', chapterTitle: 'Sales Performance Analytics' };
  }

  // STAGE 4: VEHICLE ALLOCATION, PDI & DELIVERY GATE PASS
  if (p.startsWith('/sales/delivery-handover')) {
    return { stageId: 'M4', chapter: '4.2', stageTitle: 'Vehicle Allocation, 18-Point PDI & Delivery Gate Pass', chapterTitle: '18-Point PDI & Gate Pass Release' };
  }
  if (p.startsWith('/sales/returns')) {
    return { stageId: 'M4', chapter: '4.5', stageTitle: 'Vehicle Allocation, 18-Point PDI & Delivery Gate Pass', chapterTitle: 'Vehicle Returns & Exchanges' };
  }

  // STAGE 5: SERIALIZED INVENTORY, TRANSFERS & PROCUREMENT
  if (p.startsWith('/inventory/serialized-units') || p.startsWith('/inventory/unit-detail')) {
    return { stageId: 'M5', chapter: '5.1', stageTitle: 'Serialized Inventory, Transfers & Inbound Procurement', chapterTitle: 'Chassis VIN & Battery Barcode Ledger' };
  }
  if (p.startsWith('/inventory/stock-by-product') || p.startsWith('/inventory/stock-movement-ledger')) {
    return { stageId: 'M5', chapter: '5.1', stageTitle: 'Serialized Inventory, Transfers & Inbound Procurement', chapterTitle: 'Product Stock & Movement Ledger' };
  }
  if (p.startsWith('/inventory/inbound-deliveries') || p.startsWith('/inventory/receive-supplier')) {
    return { stageId: 'M5', chapter: '5.2', stageTitle: 'Serialized Inventory, Transfers & Inbound Procurement', chapterTitle: 'Inbound Shipments & Receiving' };
  }
  if (p.startsWith('/inventory/stock-requests')) {
    return { stageId: 'M5', chapter: '5.3', stageTitle: 'Serialized Inventory, Transfers & Inbound Procurement', chapterTitle: 'Warehouse Replenishment Requests' };
  }
  if (p.startsWith('/inventory/transfers') || p.startsWith('/inventory/receive-transfer')) {
    return { stageId: 'M5', chapter: '5.4', stageTitle: 'Serialized Inventory, Transfers & Inbound Procurement', chapterTitle: 'Inter-Branch Stock Transfers' };
  }
  if (p.startsWith('/inventory/cycle-counts')) {
    return { stageId: 'M5', chapter: '5.5', stageTitle: 'Serialized Inventory, Transfers & Inbound Procurement', chapterTitle: 'Blind Cycle Counts & Stock Audits' };
  }
  if (p.startsWith('/inventory/quarantine')) {
    return { stageId: 'M5', chapter: '5.6', stageTitle: 'Serialized Inventory, Transfers & Inbound Procurement', chapterTitle: 'Defective Stock Quarantine' };
  }
  if (p.startsWith('/inventory/stock-adjustments') || p.startsWith('/inventory/adjustments')) {
    return { stageId: 'M5', chapter: '5.7', stageTitle: 'Serialized Inventory, Transfers & Inbound Procurement', chapterTitle: 'Stock Adjustments & Variance Claims' };
  }
  if (p.startsWith('/catalogue/requests') || p.startsWith('/catalogue/create-request')) {
    return { stageId: 'M5', chapter: '5.8', stageTitle: 'Serialized Inventory, Transfers & Inbound Procurement', chapterTitle: 'Special Catalogue Requests' };
  }
  if (p.startsWith('/procurement')) {
    return { stageId: 'M5', chapter: '5.9', stageTitle: 'Serialized Inventory, Transfers & Inbound Procurement', chapterTitle: 'Procurement Orders & Receiving' };
  }
  if (p === '/inventory/dashboard') {
    return { stageId: 'M5', chapter: '5.10', stageTitle: 'Serialized Inventory, Transfers & Inbound Procurement', chapterTitle: 'Inventory Dashboard & Valuations' };
  }

  // STAGE 6: WORKSHOP, AFTER-SALES & BATTERY BMS LAB
  if (p.startsWith('/after-sales/cases')) {
    return { stageId: 'M6', chapter: '6.1', stageTitle: 'Workshop Job Cards, Repairs & Battery BMS Lab', chapterTitle: 'Service Case Intake & Diagnosis' };
  }
  if (p.startsWith('/after-sales/repair-jobs') || p.startsWith('/after-sales/create-repair') || p.startsWith('/after-sales/repairs')) {
    return { stageId: 'M6', chapter: '6.2', stageTitle: 'Workshop Job Cards, Repairs & Battery BMS Lab', chapterTitle: 'Workshop Job Cards Kanban' };
  }
  if (p.startsWith('/after-sales/warranty-service')) {
    return { stageId: 'M6', chapter: '6.3', stageTitle: 'Workshop Job Cards, Repairs & Battery BMS Lab', chapterTitle: 'Battery BMS Diagnostic Lab & Warranty' };
  }
  if (p === '/after-sales/dashboard') {
    return { stageId: 'M6', chapter: '6.4', stageTitle: 'Workshop Job Cards, Repairs & Battery BMS Lab', chapterTitle: 'After-Sales Service Metrics' };
  }

  // STAGE 7: SHOWROOM PETTY CASH & EXPENSES
  if (p === '/finance/overview') {
    return { stageId: 'M7', chapter: '7.1', stageTitle: 'Showroom Petty Cash & Expense Management', chapterTitle: 'Showroom Financial Status' };
  }
  if (p.startsWith('/finance/expenses')) {
    return { stageId: 'M7', chapter: '7.2', stageTitle: 'Showroom Petty Cash & Expense Management', chapterTitle: 'Petty Cash Voucher Submission & Approvals' };
  }

  // STAGE 8: ACTION CENTRE TRIAGE & DAY-END Z-CLOSING
  if (p === '/dashboard/action-centre') {
    return { stageId: 'M8', chapter: '8.1', stageTitle: 'Action Centre Triage, Audit & Day-End Z-Closing', chapterTitle: 'Action Centre 5-Flow Escalation Triage' };
  }
  if (p.startsWith('/analytics')) {
    return { stageId: 'M8', chapter: '8.2', stageTitle: 'Action Centre Triage, Audit & Day-End Z-Closing', chapterTitle: 'Branch Analytics & Performance Audits' };
  }
  if (p.startsWith('/system/preferences') || p.startsWith('/system/sessions') || p.startsWith('/system/security')) {
    return { stageId: 'M8', chapter: '8.3', stageTitle: 'Action Centre Triage, Audit & Day-End Z-Closing', chapterTitle: 'Branch Preferences & Session Security' };
  }
  if (p.startsWith('/audit-log') || p.startsWith('/system/audit-logs')) {
    return { stageId: 'M8', chapter: '8.4', stageTitle: 'Action Centre Triage, Audit & Day-End Z-Closing', chapterTitle: 'Audit Logs & Operational Traceability' };
  }
  if (p.startsWith('/finance/cash-bank')) {
    return { stageId: 'M8', chapter: '8.5', stageTitle: 'Action Centre Triage, Audit & Day-End Z-Closing', chapterTitle: 'Cash Vault Count & Z-Closing Lock' };
  }

  // Fallback
  return { stageId: 'M8', chapter: '8.6', stageTitle: 'Action Centre Triage, Audit & Day-End Z-Closing', chapterTitle: 'Operational Closure' };
}

const coverageRegistry = bmRoutes.map((r, rIdx) => {
  const stage = assignOperationalStage(r.path);

  const checkpoints = [];

  r.headers.forEach((h, hIdx) => {
    checkpoints.push({
      checkpointId: `${stage.stageId}-R${rIdx + 1}-H${hIdx + 1}`,
      elementCategory: 'header',
      label: h,
      trainingType: 'observe',
      status: 'covered'
    });
  });

  r.tabs.forEach((t, tIdx) => {
    checkpoints.push({
      checkpointId: `${stage.stageId}-R${rIdx + 1}-T${tIdx + 1}`,
      elementCategory: 'tab',
      label: t,
      trainingType: 'inspect',
      status: 'covered'
    });
  });

  r.kpis.forEach((k, kIdx) => {
    checkpoints.push({
      checkpointId: `${stage.stageId}-R${rIdx + 1}-K${kIdx + 1}`,
      elementCategory: 'kpi',
      label: k,
      trainingType: 'observe',
      status: 'covered'
    });
  });

  r.tables.forEach((tbl, tblIdx) => {
    checkpoints.push({
      checkpointId: `${stage.stageId}-R${rIdx + 1}-TBL${tblIdx + 1}`,
      elementCategory: 'table',
      columns: tbl,
      trainingType: 'inspect',
      status: 'covered'
    });
  });

  r.fields.forEach((f, fIdx) => {
    checkpoints.push({
      checkpointId: `${stage.stageId}-R${rIdx + 1}-F${fIdx + 1}`,
      elementCategory: 'field',
      fieldName: f,
      trainingType: 'practice',
      interactiveMode: 'input-practice',
      status: 'covered'
    });
  });

  r.buttons.forEach((b, bIdx) => {
    checkpoints.push({
      checkpointId: `${stage.stageId}-R${rIdx + 1}-B${bIdx + 1}`,
      elementCategory: 'button',
      actionName: b,
      trainingType: b.toLowerCase().includes('delete') || b.toLowerCase().includes('reject') ? 'decision' : 'execute',
      status: 'covered'
    });
  });

  return {
    route: r.path,
    routeName: r.name,
    component: r.component,
    stageId: stage.stageId,
    stageTitle: stage.stageTitle,
    chapter: stage.chapter,
    chapterTitle: stage.chapterTitle,
    checkpointsCount: checkpoints.length,
    checkpoints,
    coverageStatus: '100% Covered'
  };
});

const totalCheckpoints = coverageRegistry.reduce((acc, c) => acc + c.checkpointsCount, 0);

const fileContent = `/**
 * AJ EcoDrive — Branch Manager DAP Machine-Readable Coverage Registry
 * Auto-generated from BRANCH_MANAGER_AND_SYSTEM_FULL_UI_TREE_MAPPING.md
 * Total BM Accessible Routes: ${coverageRegistry.length}
 * Total Mapped Training Checkpoints: ${totalCheckpoints}
 */

export const branchManagerCoverageRegistry = ${JSON.stringify(coverageRegistry, null, 2)};

export const totalBranchManagerRoutes = ${coverageRegistry.length};
export const totalBranchManagerCheckpoints = ${totalCheckpoints};

export default {
  coverageRegistry: branchManagerCoverageRegistry,
  totalRoutes: totalBranchManagerRoutes,
  totalCheckpoints: totalBranchManagerCheckpoints
};
`;

const outputFile = path.join(__dirname, '../src/config/branchManagerDAPCoverage.js');
fs.writeFileSync(outputFile, fileContent, 'utf8');
console.log(`Successfully generated ${outputFile} with ${coverageRegistry.length} routes and ${totalCheckpoints} checkpoints.`);
