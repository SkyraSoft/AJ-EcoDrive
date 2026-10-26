import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Fix ProductDetail.vue
const prodPath = path.join(__dirname, '../src/views/catalogue/ProductDetail.vue');
let prod = fs.readFileSync(prodPath, 'utf8');
prod = prod.replace(/<div v-else class="bg-white border border-gray-100 rounded-\[12px\] shadow-\[0_2px_4px_rgba\(0,0,0,0\.02\)\] p-12 text-center">/g, 
  `<div v-show="!['Overview', 'Specifications', 'Variants', 'Pricing', 'Stock by Branch', 'Serialized Units', 'Procurement', 'Sales', 'Warranty', 'Media & Documents', 'Audit'].includes(currentTab)" class="bg-white border border-gray-100 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-12 text-center">`);
fs.writeFileSync(prodPath, prod, 'utf8');
console.log('Fixed ProductDetail.vue');

// Fix RepairDetail.vue
const repPath = path.join(__dirname, '../src/views/after-sales/RepairDetail.vue');
let rep = fs.readFileSync(repPath, 'utf8');
rep = rep.replace(/if \(store\.selectedRepair\) return store\.selectedRepair\s*return null/g, 
  `return store.selectedRepair || store.repairs?.[0] || null`);
rep = rep.replace(/<!-- REPAIR DETAIL VIEW -->\s*<div class="max-w-\[1400px\]/g, 
  `<!-- REPAIR DETAIL VIEW -->\n  <div v-if="repairData" class="max-w-[1400px]`);
fs.writeFileSync(repPath, rep, 'utf8');
console.log('Fixed RepairDetail.vue');
