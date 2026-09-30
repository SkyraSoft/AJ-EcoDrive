const fs = require('fs');
const path = require('path');

function patchFile(relPath, findPattern, replacePattern) {
  const fullPath = path.join(__dirname, '..', relPath);
  if (!fs.existsSync(fullPath)) {
    console.warn('File not found:', relPath);
    return;
  }
  let content = fs.readFileSync(fullPath, 'utf8');
  if (content.includes(replacePattern)) {
    console.log('Already has replacement:', relPath);
    return;
  }
  if (!content.includes(findPattern)) {
    console.warn('Find pattern not found in:', relPath);
    return;
  }
  content = content.replace(findPattern, replacePattern);
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log('Successfully patched:', relPath);
}

// 1. DeliveryHandover.vue
patchFile(
  'src/views/sales/DeliveryHandover.vue',
  '<!-- Delivery / Handover Table Card -->\r\n    <div class="bg-white',
  '<!-- Delivery / Handover Table Card -->\r\n    <div id="dap-delivery-table" class="bg-white'
);

// 2. SerializedUnits.vue
patchFile(
  'src/views/inventory/SerializedUnits.vue',
  '<!-- Table Card: Serialized Unit Register -->\r\n    <div class="bg-white',
  '<!-- Table Card: Serialized Unit Register -->\r\n    <div id="dap-serialized-table" class="bg-white'
);

// 3. Expenses.vue
patchFile(
  'src/views/finance/Expenses.vue',
  '<!-- Add Expense Button -->\r\n      <button \r\n        @click="openCreateModal"',
  '<!-- Add Expense Button -->\r\n      <button \r\n        id="dap-btn-new-expense"\r\n        @click="openCreateModal"'
);
patchFile(
  'src/views/finance/Expenses.vue',
  '<!-- Table Card -->\r\n    <div class="bg-white rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6 space-y-4">',
  '<!-- Table Card -->\r\n    <div id="dap-expenses-table" class="bg-white rounded-[12px] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-6 space-y-4">'
);

console.log('Clean injection finished!');
