/**
 * AJ ECODRIVE — WAVE 5 FORM INITIALIZATION TEST
 * Master Artifact ID: 73158
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('--- STARTING TEST: WAVE 5 FORM INITIALIZATION ---');

const viewsDir = path.resolve(__dirname, '../src/views');

// Find all Create*.vue files
function findCreateFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(findCreateFiles(fullPath));
    } else if (file.startsWith('Create') && file.endsWith('.vue')) {
      results.push(fullPath);
    }
  });
  return results;
}

const createFiles = findCreateFiles(viewsDir);
console.log(`Found ${createFiles.length} create form components to verify.`);

// Banned fake transaction defaults that should NEVER be hardcoded initial form states
const bannedFakeDefaults = [
  { pattern: /customer:\s*['"](Faisal Khan|Jawad Khan|Ahsan Khan)['"]/i, name: 'Fake Customer Name' },
  { pattern: /customer_id:\s*['"]CUST-101['"]/i, name: 'Fake Customer ID' },
  { pattern: /selectedUnit:\s*['"]DS11-00997['"]/i, name: 'Fake Selected Unit' },
  { pattern: /unit:\s*['"](M3-01014|CH 8-BRG-26-01731)['"]/i, name: 'Fake Serial / Chassis' },
  { pattern: /cataloguePrice:\s*['"]PKR 240,000['"]/i, name: 'Fake Catalogue Price' },
  { pattern: /amount:\s*['"](48,500|PKR 48,500|25000)['"]/i, name: 'Fake Transaction Amount' },
  { pattern: /partCost:\s*['"]18000['"]/i, name: 'Fake Part Cost' },
  { pattern: /totalCost:\s*['"]PKR 21,500['"]/i, name: 'Fake Total Repair Cost' },
  { pattern: /requestedQty:\s*['"]4['"]/i, name: 'Fake Requested Qty' },
  { pattern: /evidence:\s*['"]Photo_Inspection_01\.jpg['"]/i, name: 'Fake Evidence File' },
  { pattern: /carrier:\s*['"]AJ Logistics Truck #4/i, name: 'Fake Carrier String' }
];

let checkedCount = 0;

for (const filePath of createFiles) {
  const content = fs.readFileSync(filePath, 'utf8');
  const relativeName = path.relative(viewsDir, filePath);
  
  // Extract the initial form state block (form = ref({ ... }) or formData = ref({ ... }) or saleData = ref({ ... }))
  const formStateMatch = content.match(/(?:form|formData|saleData)\s*=\s*ref\(\s*\{([\s\S]*?)\}\s*\)/);
  if (formStateMatch) {
    const formStateBody = formStateMatch[1];
    
    for (const check of bannedFakeDefaults) {
      assert(
        !check.pattern.test(formStateBody),
        `Defect in ${relativeName}: Found ${check.name} in initial form state!`
      );
    }
  }
  checkedCount++;
}

console.log(`  ✓ Successfully audited ${checkedCount} create forms. Zero fake transaction defaults found.`);
console.log('=== TEST PASSED: WAVE 5 FORM INITIALIZATION ===');
