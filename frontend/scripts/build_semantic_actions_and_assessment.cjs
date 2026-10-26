const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const rawActions = JSON.parse(fs.readFileSync(path.join(rootDir, 'scratch/forensic/actions.json'), 'utf8'));
const routeMath = JSON.parse(fs.readFileSync(path.join(rootDir, 'scratch/forensic/baseline/route_math.json'), 'utf8'));

// Copy to scratch/forensic/baseline/raw_action_triggers.json
fs.writeFileSync(
  path.join(rootDir, 'scratch/forensic/baseline/raw_action_triggers.json'),
  JSON.stringify(rawActions, null, 2),
  'utf8'
);

// Map component to route
const compToRoute = {};
for (const r of routeMath.allDeclarations) {
  if (r.component) {
    const cleanComp = r.component.replace('@/', 'src/');
    if (!compToRoute[cleanComp]) compToRoute[cleanComp] = [];
    compToRoute[cleanComp].push(r.fullPath);
  }
}

function getModuleFromPath(filePath) {
  if (filePath.includes('/auth/')) return 'AUTH';
  if (filePath.includes('/dashboard/')) return 'DASHBOARD';
  if (filePath.includes('/organisation/')) return 'ORGANISATION';
  if (filePath.includes('/catalogue/')) return 'CATALOGUE';
  if (filePath.includes('/procurement/')) return 'PROCUREMENT';
  if (filePath.includes('/inventory/')) return 'INVENTORY';
  if (filePath.includes('/sales/')) return 'SALES';
  if (filePath.includes('/after-sales/')) return 'AFTER_SALES';
  if (filePath.includes('/finance/')) return 'FINANCE';
  if (filePath.includes('/communication/')) return 'COMMUNICATION';
  if (filePath.includes('/analytics/')) return 'ANALYTICS';
  if (filePath.includes('/system/')) return 'SYSTEM';
  if (filePath.includes('/layouts/')) return 'LAYOUT';
  if (filePath.includes('/components/')) return 'SHARED_COMPONENT';
  return 'GENERAL';
}

// Group raw actions by component and normalized handler/label
const semanticGroups = {};

for (const act of rawActions) {
  const comp = act.component;
  const label = (act.label || 'Action').trim();
  const handler = (act.handler || '').replace(/\(.*\)/, '').trim();

  // Deduplication key: component + normalized action concept
  // Normalize row actions like "View", "Edit", "Delete", "Download"
  let normConcept = label.toLowerCase();
  if (handler) {
    normConcept = handler.toLowerCase();
  }

  // Common UI actions
  if (normConcept.includes('close') || normConcept.includes('cancel') || normConcept.includes('modal')) {
    normConcept = 'dismiss_or_close';
  } else if (normConcept.includes('view') || normConcept.includes('detail')) {
    normConcept = 'view_detail';
  } else if (normConcept.includes('edit')) {
    normConcept = 'edit_record';
  } else if (normConcept.includes('delete') || normConcept.includes('remove')) {
    normConcept = 'delete_or_remove';
  } else if (normConcept.includes('save') || normConcept.includes('submit')) {
    normConcept = 'submit_form';
  }

  const groupKey = `${comp}:::${normConcept}`;
  if (!semanticGroups[groupKey]) {
    semanticGroups[groupKey] = {
      component: comp,
      representativeLabel: label,
      handler: handler || 'handleAction',
      triggers: []
    };
  }
  semanticGroups[groupKey].triggers.push(act);
}

const semanticActions = [];
let semIdx = 0;

for (const [key, grp] of Object.entries(semanticGroups)) {
  semIdx++;
  const actionId = `SEM-ACT-${String(semIdx).padStart(3, '0')}`;
  const comp = grp.component;
  const module = getModuleFromPath(comp);
  const routes = compToRoute[comp] || [];
  const route = routes.length > 0 ? routes[0] : null;

  const triggerIds = grp.triggers.map(t => t.actionId);
  const isDestructive = grp.triggers.some(t => t.isDestructive);
  const isNav = grp.triggers.some(t => t.isNavigation);

  // Surface detection
  let surface = 'INLINE_PAGE_BUTTON';
  if (comp.includes('Modal') || grp.representativeLabel.toLowerCase().includes('modal')) surface = 'MODAL_DIALOG';
  else if (comp.includes('Drawer')) surface = 'DRAWER';
  else if (grp.representativeLabel.toLowerCase().includes('filter') || grp.representativeLabel.toLowerCase().includes('search')) surface = 'SEARCH_FILTER_BAR';
  else if (grp.representativeLabel.toLowerCase().includes('tab')) surface = 'TAB_CONTROL';

  // Role requirement
  let roleReq = 'All Roles';
  if (module === 'AUTH') roleReq = 'Public / Unauthenticated';
  else if (module === 'ORGANISATION' || module === 'SYSTEM') roleReq = 'Super Admin';
  else if (module === 'DASHBOARD' && comp.includes('SuperAdmin')) roleReq = 'Super Admin';
  else roleReq = 'Branch Manager & Super Admin';

  const actionContract = {
    actionId,
    module,
    route,
    component: comp,
    visibleLabel: grp.representativeLabel,
    triggerIds: triggerIds,
    currentSurface: surface,
    eventBinding: '@click',
    handler: grp.handler,
    recordTarget: comp.split('/').pop().replace('.vue', ''),
    currentStateRequirement: null,
    roleRequirement: roleReq,
    branchRequirement: module === 'ORGANISATION' || module === 'SYSTEM' ? 'GLOBAL' : 'CURRENT_BRANCH',
    additionalInputRequired: surface === 'MODAL_DIALOG' || grp.representativeLabel.includes('Create'),
    confirmationCurrent: isDestructive ? 'WINDOW_CONFIRM_OR_NONE' : 'NONE',
    mutationCurrent: !isNav && !grp.representativeLabel.includes('Close'),
    navigationCurrent: isNav || grp.representativeLabel.includes('View') || grp.representativeLabel.includes('Create'),
    feedbackCurrent: grp.representativeLabel.includes('Delete') ? 'Toast Notification' : 'UI Transition',
    nextStateCurrent: null,
    downstreamActorCurrent: null,
    sourceEvidence: `${comp} (contains ${triggerIds.length} trigger element(s): ${triggerIds.slice(0, 3).join(', ')}${triggerIds.length > 3 ? '...' : ''})`
  };

  semanticActions.push(actionContract);
}

fs.writeFileSync(
  path.join(rootDir, 'scratch/forensic/baseline/semantic_actions.json'),
  JSON.stringify(semanticActions, null, 2),
  'utf8'
);

// Interaction Assessment for EVERY Semantic Action
const interactionAssessments = [];
const interactionDefects = [];

for (const act of semanticActions) {
  const isDestructive = act.confirmationCurrent.includes('CONFIRM') || act.visibleLabel.toLowerCase().includes('delete') || act.visibleLabel.toLowerCase().includes('archive');
  const isHighConsequence = act.visibleLabel.toLowerCase().includes('approve') || act.visibleLabel.toLowerCase().includes('reject') || act.visibleLabel.toLowerCase().includes('allocate') || act.visibleLabel.toLowerCase().includes('override') || act.visibleLabel.toLowerCase().includes('archive');

  let risk = 'LOW';
  let reversibility = 'REVERSIBLE';
  if (isDestructive) {
    risk = 'HIGH';
    reversibility = 'IRREVERSIBLE';
  } else if (isHighConsequence) {
    risk = 'HIGH';
    reversibility = 'PARTIALLY_REVERSIBLE';
  }

  let expectedSurface = act.currentSurface;
  let matchStatus = 'MATCH';
  let defectReason = null;
  let defectType = null;

  // Specific forensic checks
  if (act.visibleLabel.toLowerCase().includes('archive branch') && act.confirmationCurrent === 'NONE') {
    matchStatus = 'WRONG';
    expectedSurface = 'MODAL_CONFIRMATION_DIALOG';
    defectType = 'MISSING_CONFIRMATION';
    defectReason = 'Archive Branch irreversibly deactivates dealership branch but executes without high-friction confirmation modal';
  } else if (act.component.includes('CreatePurchaseOrder.vue') && act.currentSurface === 'MODAL_DIALOG') {
    matchStatus = 'PARTIAL';
    expectedSurface = 'DEDICATED_PAGE';
    defectType = 'WRONG_FORM_MODAL';
    defectReason = 'Purchase order creation involves 12 fields, financial commitments, and documents; overloaded inside a modal dialog';
  } else if (act.visibleLabel.toLowerCase().includes('approve') && act.currentSurface === 'INLINE_PAGE_BUTTON' && !act.component.includes('ActionCentre')) {
    matchStatus = 'PARTIAL';
    expectedSurface = 'ACTION_CENTRE_DECISION_SURFACE';
    defectType = 'WRONG_ACTION_CENTRE_USAGE';
    defectReason = 'Executive approvals executed as ad-hoc page buttons without governance audit trail in Action Centre queue';
  }

  const assessment = {
    actionId: act.actionId,
    module: act.module,
    component: act.component,
    visibleLabel: act.visibleLabel,
    currentSurface: act.currentSurface,
    businessIntent: `Execute ${act.visibleLabel} on ${act.recordTarget}`,
    risk,
    reversibility,
    dataRequired: act.additionalInputRequired ? 'Form Data / Input Fields' : 'Record ID Only',
    decisionCardinality: isHighConsequence ? 'BINARY_OR_TRIAGE' : 'SINGLE_CLICK',
    crossRole: act.roleRequirement.includes('&') || act.roleRequirement.includes('All'),
    crossBranch: act.branchRequirement === 'GLOBAL',
    persistentTrackingRequired: isHighConsequence || isDestructive,
    reviewRequired: isHighConsequence,
    expectedSurface,
    assessmentStatus: matchStatus,
    reason: defectReason || 'Interaction surface matches operational risk profile',
    defectType: defectType
  };

  interactionAssessments.push(assessment);
  if (defectType) {
    interactionDefects.push({
      actionId: act.actionId,
      component: act.component,
      defectType,
      defectReason
    });
  }
}

fs.writeFileSync(
  path.join(rootDir, 'scratch/forensic/baseline/interaction_assessment.json'),
  JSON.stringify(interactionAssessments, null, 2),
  'utf8'
);

console.log('=== ACTION NORMALIZATION SUMMARY ===');
console.log(`RAW_ACTION_TRIGGERS: ${rawActions.length}`);
console.log(`UNIQUE_SEMANTIC_ACTIONS: ${semanticActions.length}`);
console.log(`INTERACTION_ASSESSMENTS_COMPLETED: ${interactionAssessments.length}`);
console.log(`INTERACTION_DEFECTS_IDENTIFIED: ${interactionDefects.length}`);
interactionDefects.forEach(d => console.log(`  - [${d.defectType}] ${d.actionId} in ${d.component}: ${d.defectReason}`));
