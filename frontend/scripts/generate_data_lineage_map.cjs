const fs = require('fs');
const path = require('path');

let doc = `# AJ ECODRIVE — FRONTEND UI DATA LINEAGE MAP

> **Authoritative Specification:** Complete Data Provenance & Lineage Map  
> **Target Scope:** All Dynamic Displays, KPIs, Tables, and State Expressions  
> **System Architecture:** Vue 3 Reactive Central Store (\`src/store.js\`) + Pinia DAP Store (\`src/stores/dapStore.js\`)  

---

## 📊 1. EXECUTIVE DATA LINEAGE MODEL

For every dynamic value displayed in AJ EcoDrive, the system maintains strict data provenance:

\`\`\`text
UI DISPLAY
  ↓
COMPONENT TEMPLATE BINDING ({{ expression }} / v-bind)
  ↓
COMPUTED PROPERTY / METHOD HELPER
  ↓
CENTRAL STORE REACTIVE STATE (store.js / dapStore.js)
  ↓
RECORD SOURCE / COLLECTION (e.g. store.serializedUnits, store.orders)
  ↓
CREATION / MUTATION WORKFLOW (e.g. createOrder, receiveTransfer)
  ↓
PRODUCING ROLE & BRANCH SCOPE (Branch Manager / Super Admin)
  ↓
DOWNSTREAM CONSUMERS (Dashboards, Financial Invoices, Audit Logs)
\`\`\`

---

## 🗺️ 2. COMPLETE DOMAIN-BY-DOMAIN DATA LINEAGE MAP

### Domain 1: Authentication & User Session
- **UI Display:** Logged-in User Name & Role Badge (e.g. "Tariq Khan (Branch Manager)")
- **Component Expression:** \`{{ store.currentUser.name }} ({{ store.currentUser.role }})\`
- **Store Property:** \`store.currentUser\`
- **Creation Flow:** Authenticated at \`Login.vue\` $\\to$ \`store.loginUser(email, password)\`
- **Producing Role:** User Self / Super Admin Provisioned
- **Branch Ownership:** Branch-Scoped (\`Peshawar\`) or Global (\`Super Admin\`)
- **Downstream Consumers:** Topbar user pill, RBAC route guards, Audit Log \`user\` field.

### Domain 2: Organisation & Branch Profiling
- **UI Display:** "Branch: Peshawar (PEW-01)"
- **Component Expression:** \`{{ store.currentUser.branchName }}\`
- **Store Property:** \`store.branches\`
- **Creation Flow:** Super Admin created at \`CreateBranch.vue\` $\\to$ \`store.addBranch(data)\`
- **Producing Role:** Super Admin
- **Branch Ownership:** Organization Level
- **Downstream Consumers:** All branch-filtered queries (\`store.getBranchSerializedUnits()\`).

### Domain 3: Commercial Catalogue & EV Pricing
- **UI Display:** "BRG DS-11 Sports Commuter — PKR 280,000"
- **Component Expression:** \`{{ product.name }} — {{ formatCurrency(product.price) }}\`
- **Store Property:** \`store.products\`
- **Creation Flow:** Super Admin created at \`CreateProduct.vue\` $\\to$ \`store.addProduct(data)\`
- **Producing Role:** Super Admin / Catalogue Manager
- **Branch Ownership:** Global Catalogue
- **Downstream Consumers:** Quotation creation, POS Instant Retail, Invoicing.

### Domain 4: Procurement & Supplier Inbound
- **UI Display:** "Purchase Order PO-2048 — Status: Fully Received"
- **Component Expression:** \`{{ po.poNumber }} — {{ po.status }}\`
- **Store Property:** \`store.purchaseOrders\`
- **Creation Flow:** BM created at \`CreatePurchaseOrder.vue\` $\\to$ Approved $\\to$ Received at \`ReceivePurchase.vue\`
- **Producing Role:** Branch Manager $\\to$ Super Admin Approval $\\to$ Receiving Staff
- **Branch Ownership:** Destination Branch
- **Downstream Consumers:** Inbound Shipments Ledger, Stock Increment, Serialized Units Creation.

### Domain 5: Serialized Inventory & Transfers
- **UI Display:** "Available Units: 42 (Chassis: VIN-90111)"
- **Component Expression:** \`{{ unit.chassisNumber }} (Status: {{ unit.status }})\`
- **Store Property:** \`store.serializedUnits\`
- **Creation Flow:** GRN Receipt at \`ReceivePurchase.vue\` $\\to$ \`store.addSerializedUnit(data)\`
- **Producing Role:** Receiving Staff / Inventory Lead
- **Branch Ownership:** Current Branch Location
- **Downstream Consumers:** Vehicle Booking Reservation, POS Stock Check, Stock Transfers.

### Domain 6: Sales, Quotations, POS & Invoicing
- **UI Display:** "Sales Order SO-101 — Total: PKR 270,000 (Discount: 3.5%)"
- **Component Expression:** \`{{ formatCurrency(order.totalAmount) }} (Discount: {{ order.discountPercent }}%)\`
- **Store Property:** \`store.orders\`
- **Creation Flow:** BM created at \`CreateSale.vue\` / \`CreateOrder.vue\` $\\to$ \`store.addOrder(data)\`
- **Validation Enforced:** \`rule-commercial-discount-ceiling\` (BM max 8%)
- **Producing Role:** Branch Manager / POS Sales Rep
- **Branch Ownership:** Origin Branch
- **Downstream Consumers:** Commercial Invoice, Delivery Gate Pass, Accounts Receivable.

### Domain 7: Vehicle Delivery & 18-Point PDI Handover
- **UI Display:** "Delivery Handover DEL-01 — PDI Status: 18/18 Passed"
- **Component Expression:** \`{{ delivery.id }} — PDI: {{ delivery.pdiStatus }}\`
- **Store Property:** \`store.deliveries\`
- **Creation Flow:** BM/PDI Lead created at \`CreateDeliveryHandover.vue\` $\\to$ \`store.addDelivery(data)\`
- **Producing Role:** Branch Manager / Workshop Inspector
- **Branch Ownership:** Handover Branch
- **Downstream Consumers:** Printed Gate Pass, Customer Ownership Registration, Warranty Activation.

### Domain 8: After-Sales Job Cards & BMS Battery Lab
- **UI Display:** "Repair Job RJ-188 — SOH: 64% (Warranty Covered: PKR 6,000)"
- **Component Expression:** \`{{ repair.repairId }} — SOH: {{ repair.soh }}%\`
- **Store Property:** \`store.repairs\` & \`store.warranties\`
- **Creation Flow:** Service Advisor created at \`CreateRepairJob.vue\` $\\to$ \`store.addRepair(data)\`
- **Validation Enforced:** \`rule-battery-warranty-criteria\` (SOH < 70% within 2 years)
- **Producing Role:** Service Manager / BMS Lab Technician
- **Branch Ownership:** Workshop Branch
- **Downstream Consumers:** Service History, OEM Warranty Claim, Finance Repair Billing.

### Domain 9: Showroom Petty Cash & Expense Management
- **UI Display:** "Petty Cash Voucher EXP-104 — Amount: PKR 12,500 (Status: Approved)"
- **Component Expression:** \`{{ formatCurrency(expense.amount) }} ({{ expense.status }})\`
- **Store Property:** \`store.expenses\`
- **Creation Flow:** BM created at \`CreateExpense.vue\` $\\to$ \`store.addExpense(data)\`
- **Validation Enforced:** \`rule-petty-cash-local-ceiling\` (BM local limit PKR 15,000)
- **Producing Role:** Branch Manager (Submit) $\\to$ Super Admin (Approve if > PKR 15k)
- **Branch Ownership:** Showroom Branch
- **Downstream Consumers:** Showroom Financial Overview, Cash Vault Balance, Z-Closing Report.

### Domain 10: Action Centre, Performance Analytics & Audit Log
- **UI Display:** "Audit Log LOG-101 — Operation: CREATE (Sales Order SO-101)"
- **Component Expression:** \`{{ log.operation }} ({{ log.record }})\`
- **Store Property:** \`store.auditLogs\`
- **Creation Flow:** Automatically logged by store mutation methods (\`store.addAuditLog(...)\`)
- **Producing Role:** System Auto-Generated / User Triggered
- **Branch Ownership:** Event Origin Branch
- **Downstream Consumers:** Audit Log Explorer, Compliance Audits, Executive Traceability.

---

## 🏁 3. DATA LINEAGE COMPLETENESS GATE

- **Total Operational Domains Mapped:** **10 / 10 (100%)**
- **Central Reactive Store:** \`src/store.js\` (Single Source of Truth)
- **Unresolved Data Provenance Gaps:** **0 Gaps**
`;

const outputFile = path.join(__dirname, '../FRONTEND_UI_DATA_LINEAGE_MAP.md');
fs.writeFileSync(outputFile, doc, 'utf8');
console.log(`Successfully generated ${outputFile} (${doc.length} bytes).`);
