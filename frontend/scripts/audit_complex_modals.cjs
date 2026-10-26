const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const components = JSON.parse(fs.readFileSync(path.join(rootDir, 'scratch/forensic/components.json'), 'utf8'));

const modals = [];
for (const comp of components) {
  const fp = path.join(rootDir, comp.filePath);
  if (!fs.existsSync(fp)) continue;
  const content = fs.readFileSync(fp, 'utf8');

  const fileName = comp.fileName || '';
  const isModal = fileName.includes('Modal') || 
                  content.includes('fixed inset-0') || 
                  content.includes('role="dialog"') || 
                  content.includes('showModal') || 
                  content.includes('isModalOpen') || 
                  content.includes('showCreateModal');

  if (isModal) {
    const inputMatches = [...content.matchAll(/<(input|select|textarea)/g)];
    const hasAttachments = content.includes('type="file"') || content.includes('documents') || content.includes('attachment') || content.includes('FileUpload');
    const sections = (content.match(/<section|<div class="[^"]*border-b|<h[2-4]/g) || []).length;
    const hasFinancial = content.includes('PKR') || content.includes('price') || content.includes('amount') || content.includes('cost') || content.includes('total');
    const hasInventory = content.includes('vin') || content.includes('stock') || content.includes('quantity') || content.includes('unit') || content.includes('qty');
    const hasCrossRole = content.includes('Super Admin') || content.includes('Branch Manager') || content.includes('approve');
    const fieldCount = inputMatches.length;

    let classification = 'ACCEPTABLE_MODAL';
    let risk = 'LOW';
    if (fieldCount > 8 || hasAttachments || (hasFinancial && hasInventory && fieldCount >= 6)) {
      classification = 'SHOULD_BE_PAGE';
      risk = 'HIGH';
    } else if (fieldCount > 5) {
      classification = 'OVERLOADED_MODAL';
      risk = 'MEDIUM';
    } else if (fieldCount <= 3) {
      classification = 'APPROPRIATE_MODAL';
      risk = 'LOW';
    }

    modals.push({
      component: comp.filePath,
      name: fileName,
      fieldCount: fieldCount,
      sections: Math.max(1, Math.floor(sections / 2)),
      scrolling: fieldCount > 5,
      dependencies: hasInventory ? ['Products', 'Suppliers / Branches'] : ['None'],
      attachments: hasAttachments,
      financialConsequence: hasFinancial,
      inventoryConsequence: hasInventory,
      crossRoleConsequence: hasCrossRole,
      reviewRequirement: hasCrossRole || hasFinancial,
      risk: risk,
      classification: classification
    });
  }
}

fs.writeFileSync(
  path.join(rootDir, 'scratch/forensic/baseline/complex_modals.json'),
  JSON.stringify(modals, null, 2),
  'utf8'
);

console.log(`Audited ${modals.length} modals/dialog surfaces:`);
const counts = {};
modals.forEach(m => counts[m.classification] = (counts[m.classification] || 0) + 1);
console.log('Breakdown:', counts);
modals.filter(m => m.classification === 'SHOULD_BE_PAGE' || m.classification === 'OVERLOADED_MODAL')
      .forEach(m => console.log(`  - [${m.classification}] ${m.name} (${m.fieldCount} fields, attachments=${m.attachments}, financial=${m.financialConsequence})`));
