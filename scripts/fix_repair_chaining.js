import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const repPath = path.join(__dirname, '../src/views/after-sales/RepairDetail.vue');
let rep = fs.readFileSync(repPath, 'utf8');

rep = rep.replace(/repairData\.warrantyCoverage\./g, 'repairData.warrantyCoverage?.');
rep = rep.replace(/repairData\.customerApproval\./g, 'repairData.customerApproval?.');

fs.writeFileSync(repPath, rep, 'utf8');
console.log('Fixed optional chaining in RepairDetail.vue');
