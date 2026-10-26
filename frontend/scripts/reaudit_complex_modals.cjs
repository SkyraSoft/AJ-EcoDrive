const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const complexModals = JSON.parse(fs.readFileSync(path.join(rootDir, 'scratch/forensic/baseline/complex_modals.json'), 'utf8'));

const questionableModals = complexModals.filter(m => m.classification === 'SHOULD_BE_PAGE' || m.classification === 'OVERLOADED_MODAL');

const reauditedModals = [];

for (const modal of questionableModals) {
  const compPath = modal.component;
  const fp = path.join(rootDir, compPath);
  const content = fs.readFileSync(fp, 'utf8');

  const fieldCount = modal.fieldCount;
  const hasAttachments = modal.attachments;
  const hasFinancial = modal.financialConsequence;
  const hasInventory = modal.inventoryConsequence;
  const hasCrossRole = modal.crossRoleConsequence;

  let patternClassification = 'PREFERENCE_ONLY';
  let designRationale = '';

  // Critical evaluations:
  if (compPath.includes('CreatePurchaseOrder.vue')) {
    patternClassification = 'CONFIRMED_WRONG_PATTERN';
    designRationale = 'PO creation has 12 fields, freight terms, document attachments, and line item financial consequences; crammed into an unscrollable modal with silent data loss.';
  } else if (compPath.includes('CreateSale.vue')) {
    patternClassification = 'NEEDS_BUSINESS_DECISION';
    designRationale = 'POS walk-in sales benefit from quick single-screen modal overlay if structured properly, but commercial bookings with customer profiles and delivery scheduling benefit from dedicated page.';
  } else if (compPath.includes('CreateProduct.vue') || compPath.includes('EditProduct.vue')) {
    patternClassification = 'CONFIRMED_WRONG_PATTERN';
    designRationale = 'Product catalogue authoring includes 20 fields across specs, battery chemistry, motor power, dimensions, pricing tiers, and photo uploads; requires dedicated full-page form.';
  } else if (compPath.includes('CreateRole.vue')) {
    patternClassification = 'CONFIRMED_WRONG_PATTERN';
    designRationale = 'RBAC Role creation contains 33 granular permission toggle switches across 13 modules; impossible to manage reliably in a modal window.';
  } else if (compPath.includes('ActionCentre.vue')) {
    patternClassification = 'CURRENT_PATTERN_ACCEPTABLE';
    designRationale = 'Manual action item injection is an auxiliary admin tool; modal dialog is appropriate for quick manual routing.';
  } else if (compPath.includes('CreateCase.vue') || compPath.includes('CreateRepairJob.vue')) {
    patternClassification = 'NEEDS_BUSINESS_DECISION';
    designRationale = 'Service advisor workshop intake has 13-17 fields with diagnostic codes; could be an expanded drawer or dedicated page depending on dealership workshop tablet UX.';
  } else if (compPath.includes('CreateBranch.vue') || compPath.includes('EditBranch.vue')) {
    patternClassification = 'NEEDS_BUSINESS_DECISION';
    designRationale = 'Dealership branch provisioning has 15 fields (coordinates, manager, target quotas). Dedicated page is cleaner, but modal is functional if scroll is supported.';
  } else if (fieldCount <= 8 && !hasAttachments) {
    patternClassification = 'CURRENT_PATTERN_ACCEPTABLE';
    designRationale = 'Moderate form complexity (5-8 fields) with no attachments; modal dialog provides good context preservation over background listing grid.';
  } else {
    patternClassification = 'PREFERENCE_ONLY';
    designRationale = 'Functional in modal; conversion to dedicated page is an optional UX ergonomics preference.';
  }

  reauditedModals.push({
    component: compPath,
    name: modal.name,
    fieldCount,
    hasAttachments,
    hasFinancial,
    hasInventory,
    hasCrossRole,
    initialBaselineClassification: modal.classification,
    reauditedPatternClassification: patternClassification,
    designRationale
  });
}

fs.writeFileSync(
  path.join(rootDir, 'scratch/forensic/baseline/reaudited_modals.json'),
  JSON.stringify({
    totalQuestionableModalsAudited: reauditedModals.length,
    reauditedModals
  }, null, 2),
  'utf8'
);

const mCounts = {};
reauditedModals.forEach(m => mCounts[m.reauditedPatternClassification] = (mCounts[m.reauditedPatternClassification] || 0) + 1);

console.log('=== RE-AUDITED MODAL PATTERNS ===');
console.log('Total Modals Re-audited:', reauditedModals.length);
console.log('Pattern Breakdown:', mCounts);
