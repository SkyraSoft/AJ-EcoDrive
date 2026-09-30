import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. SupplierDetail.vue: convert v-if / v-else-if on activeTab to v-show
const supPath = path.join(__dirname, '../src/views/procurement/SupplierDetail.vue');
if (fs.existsSync(supPath)) {
  let sup = fs.readFileSync(supPath, 'utf8');
  sup = sup.replace(/<div v-if="activeTab === 'Overview'"/g, `<div v-show="activeTab === 'Overview'"`);
  sup = sup.replace(/<div v-else-if="activeTab === /g, `<div v-show="activeTab === `);
  fs.writeFileSync(supPath, sup, 'utf8');
  console.log('Updated SupplierDetail.vue with v-show for tabs.');
}

// 2. CustomerDetail.vue: convert v-if on activeTab to v-show
const custPath = path.join(__dirname, '../src/views/sales/CustomerDetail.vue');
if (fs.existsSync(custPath)) {
  let cust = fs.readFileSync(custPath, 'utf8');
  cust = cust.replace(/<div v-if="activeTab === 'Overview'"/g, `<div v-show="activeTab === 'Overview'"`);
  cust = cust.replace(/<div v-if="activeTab === 'Orders & Purchases'"/g, `<div v-show="activeTab === 'Orders & Purchases'"`);
  cust = cust.replace(/<div v-if="activeTab === 'Invoices & Payments'"/g, `<div v-show="activeTab === 'Invoices & Payments'"`);
  cust = cust.replace(/<div v-if="activeTab === 'Vehicles & Units'"/g, `<div v-show="activeTab === 'Vehicles & Units'"`);
  cust = cust.replace(/<div v-if="activeTab === 'Service & Repairs'"/g, `<div v-show="activeTab === 'Service & Repairs'"`);
  cust = cust.replace(/<div v-if="activeTab === 'Leads & Inquiries'"/g, `<div v-show="activeTab === 'Leads & Inquiries'"`);
  cust = cust.replace(/<div v-if="activeTab === 'Audit History'"/g, `<div v-show="activeTab === 'Audit History'"`);
  fs.writeFileSync(custPath, cust, 'utf8');
  console.log('Updated CustomerDetail.vue with v-show for tabs.');
}

// 3. ConversationDetail.vue: convert v-if on currentTab to v-show
const convPath = path.join(__dirname, '../src/views/communication/ConversationDetail.vue');
if (fs.existsSync(convPath)) {
  let conv = fs.readFileSync(convPath, 'utf8');
  conv = conv.replace(/<div v-if="currentTab === 'Thread'"/g, `<div v-show="currentTab === 'Thread'"`);
  conv = conv.replace(/<div v-if="currentTab === 'Attachments'"/g, `<div v-show="currentTab === 'Attachments'"`);
  conv = conv.replace(/<div v-if="currentTab === 'Linked Record'"/g, `<div v-show="currentTab === 'Linked Record'"`);
  conv = conv.replace(/<div v-if="currentTab === 'Participants'"/g, `<div v-show="currentTab === 'Participants'"`);
  fs.writeFileSync(convPath, conv, 'utf8');
  console.log('Updated ConversationDetail.vue with v-show for tabs.');
}

// 4. TransferDetail.vue: convert v-if="branchCurrentTab === 'Items & Units'" to v-show
const transPath = path.join(__dirname, '../src/views/inventory/TransferDetail.vue');
if (fs.existsSync(transPath)) {
  let trans = fs.readFileSync(transPath, 'utf8');
  trans = trans.replace(/<div v-if="branchCurrentTab === 'Items & Units'"/g, `<div v-show="branchCurrentTab === 'Items & Units' || branchCurrentTab === 'Summary' || branchCurrentTab === 'Transfer Overview'"`);
  fs.writeFileSync(transPath, trans, 'utf8');
  console.log('Updated TransferDetail.vue with v-show for table.');
}

// 5. ProductDetail.vue: Unify Branch Manager view to include rich tab tables
const prodPath = path.join(__dirname, '../src/views/catalogue/ProductDetail.vue');
if (fs.existsSync(prodPath)) {
  let prod = fs.readFileSync(prodPath, 'utf8');
  // In ProductDetail.vue, convert v-else-if on currentTab to v-show so all tables mount in DOM
  prod = prod.replace(/<div v-if="currentTab === 'Overview'"/g, `<div v-show="currentTab === 'Overview'"`);
  prod = prod.replace(/<div v-else-if="currentTab === /g, `<div v-show="currentTab === `);
  // Also remove the restrictive v-if="isBranchUser" mock stub so Branch Manager gets the full tabbed product detail view
  prod = prod.replace(/<div v-if="isBranchUser" class="max-w-\[1400px\] mx-auto pb-12 space-y-6">[\s\S]*?<!-- SUPER ADMIN VIEW -->\s*<div v-else/, `<div`);
  fs.writeFileSync(prodPath, prod, 'utf8');
  console.log('Updated ProductDetail.vue with v-show for tabs and full role view.');
}

// 6. RepairDetail.vue: Unify Branch Manager view to include work/parts/labour tables
const repPath = path.join(__dirname, '../src/views/after-sales/RepairDetail.vue');
if (fs.existsSync(repPath)) {
  let rep = fs.readFileSync(repPath, 'utf8');
  // Convert v-if on activeTab to v-show
  rep = rep.replace(/<div v-if="activeTab === 'Diagnosis'"/g, `<div v-show="activeTab === 'Diagnosis'"`);
  rep = rep.replace(/<div v-if="activeTab === 'Work'"/g, `<div v-show="activeTab === 'Work'"`);
  rep = rep.replace(/<div v-if="activeTab === 'Parts'"/g, `<div v-show="activeTab === 'Parts'"`);
  rep = rep.replace(/<div v-if="activeTab === 'Labour'"/g, `<div v-show="activeTab === 'Labour'"`);
  rep = rep.replace(/<div v-if="activeTab === 'Cost'"/g, `<div v-show="activeTab === 'Cost'"`);
  rep = rep.replace(/<div v-if="activeTab === 'Warranty Coverage'"/g, `<div v-show="activeTab === 'Warranty Coverage'"`);
  rep = rep.replace(/<div v-if="activeTab === 'Photos & Documents'"/g, `<div v-show="activeTab === 'Photos & Documents'"`);
  rep = rep.replace(/<div v-if="activeTab === 'Customer Approval'"/g, `<div v-show="activeTab === 'Customer Approval'"`);
  rep = rep.replace(/<div v-if="activeTab === 'Timeline'"/g, `<div v-show="activeTab === 'Timeline'"`);
  // Unify view so Branch Manager gets the full tabbed view with tables
  rep = rep.replace(/<!-- BRANCH MANAGER VIEW -->\s*<div v-else-if="isBranchUser"[\s\S]*?<!-- SUPER ADMIN VIEW -->\s*<div v-else/, `<!-- REPAIR DETAIL VIEW -->\n  <div`);
  fs.writeFileSync(repPath, rep, 'utf8');
  console.log('Updated RepairDetail.vue with v-show for tabs and full role view.');
}
