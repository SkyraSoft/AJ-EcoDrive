const fs = require('fs');
const path = require('path');

const instances = JSON.parse(fs.readFileSync('scratch/forensic/baseline/defect_instances.json'));
const groups = JSON.parse(fs.readFileSync('scratch/forensic/baseline/defect_groups.json'));

const fixSpecs = [
  {
    fixId: 'FIX-SEC-001',
    defectGroupIds: ['DG-SEC-001'],
    defectInstanceIds: instances.filter(i => i.defectGroupId === 'DG-SEC-001').map(i => i.defectInstanceId),
    title: 'Centralized Branch Scoping & Authorization for Store Getters, Mutations, and Router Navigation',
    wave: 'WAVE 1',
    currentBehavior: 'Branch isolation is enforced solely at the view list level. Direct getter calls (e.g. getCustomerById, getSaleById) and store mutations do not verify branch ownership. A Branch Manager can view or modify records belonging to other branches by navigating to direct URLs or invoking store actions.',
    expectedBehavior: 'Implement centralized access control in store.js (canAccessRecord, assertRecordAccess, getScopedRecordById). Super Admin has global access; Branch Managers and staff are strictly restricted to records matching currentUser.branchId. Unauthorized access attempts trigger an audit event and return null or reject the mutation.',
    approvedRequirementSource: 'AJ EcoDrive Security & Branch Isolation Policy; branch_authorization_contract.json',
    filesLikelyAffected: [
      'src/store.js',
      'src/router/index.js',
      'src/views/CustomerDetail.vue',
      'src/views/SaleDetail.vue',
      'src/views/InventoryDetail.vue'
    ],
    schemaChanges: 'None to persistent storage; adds branchId enforcement to all 21 branch-scoped entity getters and mutations.',
    backwardCompatibility: 'Super Admin retains unrestricted global access across all branches. System-wide entities (Users, Roles, Global Settings) remain accessible as defined by role permissions.',
    risks: 'Potential UI regressions if views fail to handle null return values gracefully when a user attempts to access an unauthorized record.',
    testsBefore: ['tests/unit/branch_isolation_baseline.spec.js'],
    testsAfter: ['tests/unit/branch_authorization_centralized.spec.js'],
    rollbackConsideration: 'Revert store.js getter/mutation wrappers to original unscoped array find operations.',
    authority: 'ARCHITECTURAL'
  },
  {
    fixId: 'FIX-RECORD-001',
    defectGroupIds: ['DG-RECORD-001', 'DG-RECORD-002', 'DG-RECORD-003'],
    defectInstanceIds: instances.filter(i => ['DG-RECORD-001', 'DG-RECORD-002', 'DG-RECORD-003'].includes(i.defectGroupId)).map(i => i.defectInstanceId),
    title: 'Eliminate Fallback to First Record (array[0]) and Fabricated Record Display on Invalid Route ID',
    wave: 'WAVE 1',
    currentBehavior: 'When an invalid, non-existent, or cross-branch ID is passed in the route params, detail views (PaymentDetail, DeliveryDetail, SupplierDetail, BranchDetail, UserDetail) silently fall back to records[0] or render hardcoded demo fixtures, leaking real personal/financial data or displaying false information.',
    expectedBehavior: 'Detail views must verify that the record exists and is authorized. If the record is not found or access is denied, render an explicit "Record Not Found / Access Denied" 404 state with a return button. Zero fallback to records[0] or synthetic demo records.',
    approvedRequirementSource: 'Zero-Trust Forensic Data Privacy Contract; DG-RECORD Root-Cause Remediation Spec',
    filesLikelyAffected: [
      'src/views/PaymentDetail.vue',
      'src/views/DeliveryDetail.vue',
      'src/views/SupplierDetail.vue',
      'src/views/BranchDetail.vue',
      'src/views/UserDetail.vue',
      'src/components/common/NotFoundState.vue'
    ],
    schemaChanges: 'None.',
    backwardCompatibility: 'Valid IDs continue to resolve and display correct domain data. Invalid URLs stop exposing unrelated customer/financial records.',
    risks: 'Existing tests expecting automatic default data rendering on empty routes will fail and must be updated to expect the 404 state.',
    testsBefore: ['tests/unit/detail_view_fallback_baseline.spec.js'],
    testsAfter: ['tests/unit/detail_view_not_found_integrity.spec.js'],
    rollbackConsideration: 'Restore original route parameter fallback defaults in the target detail components.',
    authority: 'DETERMINISTIC'
  },
  {
    fixId: 'FIX-DATA-001',
    defectGroupIds: ['DG-DATA-001', 'DG-DATA-003'],
    defectInstanceIds: instances.filter(i => ['DG-DATA-001', 'DG-DATA-003'].includes(i.defectGroupId)).map(i => i.defectInstanceId),
    title: 'Fix Silent Form Field Discarding on Submit and Broken Edit Round-Trip Lifecycle',
    wave: 'WAVE 2',
    currentBehavior: 'Form fields captured in UI inputs (e.g. ReceiveTransfer receiverLocation, CreateSupplier taxNumber/notes, CreateCustomer secondaryPhone/cnic, CreateSale paymentNotes) are dropped before payload dispatch or ignored during store mutation. Edit forms fail to preload existing properties.',
    expectedBehavior: 'Ensure complete causal transmission: Input Model -> Form Payload -> Store Mutation -> Entity State -> Edit Preload -> Update -> Redisplay. Every persistent entity field must be stored and preserved.',
    approvedRequirementSource: 'field_lifecycle.json causal audit; fieldOwnershipDecisions.json',
    filesLikelyAffected: [
      'src/views/ReceiveTransfer.vue',
      'src/views/CreateSupplier.vue',
      'src/views/EditSupplier.vue',
      'src/views/CreateCustomer.vue',
      'src/views/EditCustomer.vue',
      'src/views/CreateSale.vue',
      'src/store.js'
    ],
    schemaChanges: 'Align entity state schemas in store.js to store all captured business fields (taxNumber, secondaryPhone, cnic, paymentNotes, receiverLocation, etc.).',
    backwardCompatibility: 'Existing stored records without these fields will default to empty strings/nulls gracefully without crashing.',
    risks: 'Minor validation adjustments if previously ignored fields now enforce data formats.',
    testsBefore: ['tests/unit/field_lifecycle_baseline.spec.js'],
    testsAfter: ['tests/unit/field_lifecycle_causal_integrity.spec.js'],
    rollbackConsideration: 'Revert store mutation payload mappings to previous subsets.',
    authority: 'DETERMINISTIC'
  },
  {
    fixId: 'FIX-DATA-002',
    defectGroupIds: ['DG-DATA-002'],
    defectInstanceIds: instances.filter(i => i.defectGroupId === 'DG-DATA-002').map(i => i.defectInstanceId),
    title: 'Decouple Procurement and Inbound Receiving from Hardwired 3-Model Product Line',
    wave: 'WAVE 4',
    currentBehavior: 'Procurement creation forms and PO line items are hardwired to only 3 static vehicle models (EcoStandard, EcoDeluxe, EcoCargo), making it impossible to procure newly configured catalog models, parts, or accessories.',
    expectedBehavior: 'Procurement forms dynamically source available products from store.catalog / store.products with category and supplier filtering. Line items support any active product.',
    approvedRequirementSource: 'AJ EcoDrive Dynamic Product Catalogue Contract; DG-DATA-002 Forensic Finding',
    filesLikelyAffected: [
      'src/views/CreatePurchaseOrder.vue',
      'src/views/ReceivePurchaseOrder.vue',
      'src/store.js'
    ],
    schemaChanges: 'Ensure PO line items reference productId, productCode, and title dynamically from catalog state.',
    backwardCompatibility: 'Existing PO records with standard model names remain valid and render seamlessly.',
    risks: 'If catalog has zero items loaded, PO form must display a friendly empty-catalogue warning.',
    testsBefore: ['tests/unit/procurement_products_baseline.spec.js'],
    testsAfter: ['tests/unit/procurement_dynamic_catalog.spec.js'],
    rollbackConsideration: 'Restore static product options dropdown in CreatePurchaseOrder.vue.',
    authority: 'ARCHITECTURAL'
  },
  {
    fixId: 'FIX-WORKFLOW-001',
    defectGroupIds: ['DG-WORKFLOW-001', 'DG-WORKFLOW-002'],
    defectInstanceIds: instances.filter(i => ['DG-WORKFLOW-001', 'DG-WORKFLOW-002'].includes(i.defectGroupId)).map(i => i.defectInstanceId),
    title: 'Establish Live Action Centre Producers, Resolvers, and Downstream Domain Mutations',
    wave: 'WAVE 3',
    currentBehavior: 'Action Centre items are seeded with static mock fixtures. Live operational events (sale discount >8%, expense approval >15k, credit limit override, warranty claim, transfer approval) do not create queue items. Resolving items in Action Centre does not mutate source domain records.',
    expectedBehavior: 'Implement live event emission in source workflows using action_centre_business_contract.json. When Action Centre approve/reject is triggered, execute transactional mutations on the source entity (Sale, Expense, Customer, Warranty, Transfer) and log audit events.',
    approvedRequirementSource: 'action_centre_business_contract.json; AJ EcoDrive Cross-Role Operational Governance Policy',
    filesLikelyAffected: [
      'src/store.js',
      'src/views/ActionCenter.vue',
      'src/views/CreateSale.vue',
      'src/views/CreateExpense.vue',
      'src/views/InventoryTransfers.vue'
    ],
    schemaChanges: 'Add sourceEntity, sourceEntityId, requestPayload, and auditLog tracking to Action Centre queue items.',
    backwardCompatibility: 'Mock initial seed records replaced with realistic initial items or empty state if clean queue.',
    risks: 'Asynchronous approval flow requires sales/expenses to remain in Pending state until resolved.',
    testsBefore: ['tests/unit/action_centre_baseline.spec.js'],
    testsAfter: ['tests/unit/action_centre_end_to_end_chains.spec.js'],
    rollbackConsideration: 'Decouple Action Centre resolution handler from source store mutations.',
    authority: 'ARCHITECTURAL'
  },
  {
    fixId: 'FIX-OPERATIONAL-001',
    defectGroupIds: ['DG-OPERATIONAL-001'],
    defectInstanceIds: instances.filter(i => i.defectGroupId === 'DG-OPERATIONAL-001').map(i => i.defectInstanceId),
    title: 'Replace Hardcoded Dashboard Metrics and Counters with Real Dynamic Store Aggregations',
    wave: 'WAVE 5',
    currentBehavior: 'Executive, Branch Manager, and Service dashboards render static hardcoded numbers (e.g. fixed 42 deliveries, 1,240,000 PKR revenue, 98% efficiency) regardless of actual store data.',
    expectedBehavior: 'Derive all dashboard KPI cards, summary charts, and counters dynamically from scoped store entities (sales, deliveries, inventory, expenses, service jobs) using reactive computed getters.',
    approvedRequirementSource: 'AJ EcoDrive Executive KPI Reporting Contract; DG-OPERATIONAL-001 Forensic Finding',
    filesLikelyAffected: [
      'src/views/Dashboard.vue',
      'src/views/ServiceDashboard.vue',
      'src/views/InventoryDashboard.vue',
      'src/store.js'
    ],
    schemaChanges: 'Add reusable getter aggregations to store.js (e.g. getBranchRevenue, getActiveDeliveriesCount).',
    backwardCompatibility: 'Zero visual regression; metrics reflect actual operational state rather than unmoving constants.',
    risks: 'If store has empty datasets, KPIs will display 0 or empty state instead of impressive mock metrics.',
    testsBefore: ['tests/unit/dashboard_metrics_baseline.spec.js'],
    testsAfter: ['tests/unit/dashboard_metrics_dynamic_integrity.spec.js'],
    rollbackConsideration: 'Restore static metric constants in dashboard view templates.',
    authority: 'DETERMINISTIC'
  },
  {
    fixId: 'FIX-OPERATIONAL-002',
    defectGroupIds: ['DG-OPERATIONAL-002'],
    defectInstanceIds: instances.filter(i => i.defectGroupId === 'DG-OPERATIONAL-002').map(i => i.defectInstanceId),
    title: 'Purge 125 Dangerous Prefills and 62 Demo Data Fixtures from Production Creation Forms',
    wave: 'WAVE 5',
    currentBehavior: 'Creation forms (CreateSale, CreateCustomer, CreateSupplier, CreateExpense, CreateJobCard, etc.) initialize with pre-filled names, CNICs, phone numbers, fixed future dates, and preset financial amounts. Users submitting without editing inadvertently create duplicate garbage records.',
    expectedBehavior: 'All operational creation forms must initialize with empty input fields or valid business defaults (e.g. today\'s date, logged-in user\'s branch, default unit 1). Placeholders provide guidance without submitting fake data.',
    approvedRequirementSource: 'form_defaults.json audit; AJ EcoDrive Data Governance Directive',
    filesLikelyAffected: [
      'src/views/CreateSale.vue',
      'src/views/CreateCustomer.vue',
      'src/views/CreateSupplier.vue',
      'src/views/CreateExpense.vue',
      'src/views/CreateRepairJob.vue',
      'src/views/CreatePurchaseOrder.vue'
    ],
    schemaChanges: 'None.',
    backwardCompatibility: 'All form submission handlers and field validators function identically; users enter genuine data.',
    risks: 'Forms with required field validation will now require manual user entry before submit is enabled.',
    testsBefore: ['tests/unit/form_prefill_baseline.spec.js'],
    testsAfter: ['tests/unit/form_clean_initialization_integrity.spec.js'],
    rollbackConsideration: 'Re-insert default mock strings into reactive ref initializers.',
    authority: 'DETERMINISTIC'
  },
  {
    fixId: 'FIX-STATE-001',
    defectGroupIds: ['DG-STATE-001'],
    defectInstanceIds: instances.filter(i => i.defectGroupId === 'DG-STATE-001').map(i => i.defectInstanceId),
    title: 'Implement Valid State Transitions and Eliminate Unreachable State Badges',
    wave: 'WAVE 4',
    currentBehavior: 'Various domain entities (Sale, Delivery, Warranty, JobCard) display badge colors for states that cannot be reached through UI actions, or trap records in dead-end states. Meanwhile, filter dropdowns list states not supported by business workflows.',
    expectedBehavior: 'Apply decisions from state_remediation_decisions.json: remove invalid UI filter options (e.g. Invoice.Draft, Expense.Draft), preserve intentional terminal states (Delivered, Paid, Rejected, Cancelled), and implement verified business transitions (e.g. PDI.Scheduled -> In_Progress -> Passed).',
    approvedRequirementSource: 'state_remediation_decisions.json (21 verified state decisions)',
    filesLikelyAffected: [
      'src/store.js',
      'src/views/Deliveries.vue',
      'src/views/Invoices.vue',
      'src/views/Expenses.vue',
      'src/views/PDIInspection.vue',
      'src/views/JobCardDetail.vue'
    ],
    schemaChanges: 'Ensure state machine enum in store.js contains only valid business states and allowed transitions.',
    backwardCompatibility: 'Existing records in terminal states remain undisturbed. Unreachable fake badges removed from UI.',
    risks: 'State transition guards must prevent illegal out-of-order jumps.',
    testsBefore: ['tests/unit/state_machine_baseline.spec.js'],
    testsAfter: ['tests/unit/state_machine_transitions_integrity.spec.js'],
    rollbackConsideration: 'Revert state validation logic in store mutation handlers.',
    authority: 'DETERMINISTIC'
  },
  {
    fixId: 'FIX-FINANCE-001',
    defectGroupIds: ['DG-FINANCE-001'],
    defectInstanceIds: instances.filter(i => i.defectGroupId === 'DG-FINANCE-001').map(i => i.defectInstanceId),
    title: 'Standardize Monetary Fields to Canonical Whole-Integer PKR and Centralize Formatters',
    wave: 'WAVE 4',
    currentBehavior: 'Monetary amounts are stored inconsistently across the codebase as raw numbers, strings with currency symbols (e.g. "PKR 1,500,000"), or floating-point numbers subject to rounding anomalies.',
    expectedBehavior: 'Store all domain money fields as non-negative whole-integer PKR (0 decimal places, Math.round). Use standard input parsing (parseCurrency) and presentation formatting (formatCurrency) helpers.',
    approvedRequirementSource: 'financial_value_contract.json; AJ EcoDrive Financial Data Integrity Standard',
    filesLikelyAffected: [
      'src/store.js',
      'src/utils/formatters.js',
      'src/views/CreateSale.vue',
      'src/views/CreateExpense.vue',
      'src/views/Sales.vue',
      'src/views/Invoices.vue'
    ],
    schemaChanges: 'Normalize store initial data and mutation payloads to store clean integer values for all 30 audited financial fields.',
    backwardCompatibility: 'Formatters ensure visual representation in UI continues to display "Rs. X,XXX,XXX" or "PKR X,XXX,XXX" consistently.',
    risks: 'Existing code doing direct string concatenation with currency values must be refactored to use formatters.',
    testsBefore: ['tests/unit/financial_fields_baseline.spec.js'],
    testsAfter: ['tests/unit/financial_fields_canonical_integrity.spec.js'],
    rollbackConsideration: 'Revert store payload sanitizers in financial mutations.',
    authority: 'ARCHITECTURAL'
  },
  {
    fixId: 'FIX-INTERACTION-001',
    defectGroupIds: ['DG-INTERACTION-001'],
    defectInstanceIds: instances.filter(i => i.defectGroupId === 'DG-INTERACTION-001').map(i => i.defectInstanceId),
    title: 'Remediate Confirmed Wrong-Pattern Modals to Dedicated Responsive Workflow Views',
    wave: 'WAVE 6',
    currentBehavior: 'Four complex operational workflows (CreateSale, CreateCase, CreateRepairJob, CreateBranch) are constrained within cramped modal overlays, causing scroll traps, poor mobile ergonomics, and data loss upon accidental backdrop dismissal.',
    expectedBehavior: 'Provide dedicated full-page routes for complex multi-step workflows while retaining lightweight modals strictly for quick confirmations and simple atomic actions. Ensure form state persistence or exit confirmation.',
    approvedRequirementSource: 'architecture_decision_backlog.json (ADB-001..ADB-004); UX Pattern Contract',
    filesLikelyAffected: [
      'src/router/index.js',
      'src/views/Sales.vue',
      'src/views/Cases.vue',
      'src/views/RepairJobs.vue',
      'src/views/Branches.vue'
    ],
    schemaChanges: 'None.',
    backwardCompatibility: 'Existing modal triggers can redirect to full-page route or open responsive view container seamlessly.',
    risks: 'Navigation flow change from in-place modal to full page requires proper back-button breadcrumb support.',
    testsBefore: ['tests/unit/modal_interaction_baseline.spec.js'],
    testsAfter: ['tests/unit/workflow_navigation_integrity.spec.js'],
    rollbackConsideration: 'Revert router entries and re-enable modal dialog wrappers.',
    authority: 'DETERMINISTIC'
  },
  {
    fixId: 'FIX-DOC-001',
    defectGroupIds: ['DG-DOC-001'],
    defectInstanceIds: ['INST-DOC-001'],
    title: 'Align PDI Inspection Scope in Documentation with Source Truth Pending Business Decision',
    wave: 'BACKLOG / QUARANTINED',
    currentBehavior: 'Documentation claims an 18-point comprehensive PDI inspection process, whereas source code implements a 5-point verification checklist.',
    expectedBehavior: 'Update documentation to accurately reflect the 5-point verification checklist currently implemented in source code. Do NOT implement 18-point checklist until formal business approval is granted.',
    approvedRequirementSource: 'architecture_decision_backlog.json (ADB-006); Directive Instruction 24 & 26',
    filesLikelyAffected: [
      'AJ_ECODRIVE_MASTER_FRONTEND_TRUTH_AND_ARCHITECTURE.md',
      'AJ_ECODRIVE_COMPLETE_CLIENT_GUIDE_QA.md'
    ],
    schemaChanges: 'None.',
    backwardCompatibility: 'Source code remains untouched; documentation aligns with reality.',
    risks: 'None.',
    testsBefore: [],
    testsAfter: [],
    rollbackConsideration: 'Revert documentation edits.',
    authority: 'BUSINESS_DECISION_REQUIRED'
  },
  {
    fixId: 'FIX-DOC-002',
    defectGroupIds: ['DG-DOC-002'],
    defectInstanceIds: ['INST-DOC-002'],
    title: 'Synchronize Cryptographic Ledger Claims in Documentation with In-Memory Structured Audit Log',
    wave: 'BACKLOG / QUARANTINED',
    currentBehavior: 'Documentation references a future cryptographic tamper-evident blockchain/hash-chained audit ledger, whereas frontend source implements in-memory structured audit logs.',
    expectedBehavior: 'Update documentation to document structured audit event logging as CURRENT truth and classify cryptographic ledger as FUTURE_BACKEND_DEPENDENT. Zero cryptographic code added to frontend.',
    approvedRequirementSource: 'architecture_decision_backlog.json (ADB-007); Directive Instruction 25 & 27',
    filesLikelyAffected: [
      'AJ_ECODRIVE_MASTER_FRONTEND_TRUTH_AND_ARCHITECTURE.md',
      'PLATFORM_SUPPORT_POLICY.md'
    ],
    schemaChanges: 'None.',
    backwardCompatibility: 'Source code remains untouched; documentation claims accurate.',
    risks: 'None.',
    testsBefore: [],
    testsAfter: [],
    rollbackConsideration: 'Revert documentation edits.',
    authority: 'BACKEND_DEPENDENT'
  }
];

fs.writeFileSync('PRE_REMEDIATION_FIX_SPEC.json', JSON.stringify(fixSpecs, null, 2));

// Also generate PRE_REMEDIATION_FIX_SPEC.md
let md = `# AJ ECODRIVE — PRE-REMEDIATION FIX SPECIFICATIONS & ARCHITECTURAL FREEZE
**Document Version:** 3.5.0  
**Status:** FROZEN — PRE-REMEDIATION GATE COMPLIANT  
**Date:** 2026-10-01  
**Scope:** Complete implementation contracts for all reconciled defect groups and instances.

---

## Executive Summary

Phase 3.5 has eliminated false passes from the field lifecycle baseline, reconciled all defect group and instance arithmetic to 100% mathematical precision, established definitive domain contracts for financial fields, entity ownership, state machines, and branch authorization, and quarantined unresolved business features in the Architecture Decision Backlog.

This document and \`PRE_REMEDIATION_FIX_SPEC.json\` define the strict, frozen specifications for each remediation wave. Under the Phase 3.5 zero-trust directive, **only fixes classified as DETERMINISTIC or ARCHITECTURAL are admitted into code implementation waves**. Backlog and backend-dependent items are strictly deferred.

---

## Master Fix Specification Registry

`;

for (const fix of fixSpecs) {
  md += `### ${fix.fixId}: ${fix.title}\n\n`;
  md += `- **Remediation Wave:** \`${fix.wave}\`\n`;
  md += `- **Fix Authority:** \`${fix.authority}\`\n`;
  md += `- **Covered Defect Groups:** ${fix.defectGroupIds.map(g => `\`${g}\``).join(', ')}\n`;
  md += `- **Covered Defect Instances (${fix.defectInstanceIds.length}):** ${fix.defectInstanceIds.slice(0, 5).map(id => `\`${id}\``).join(', ')}${fix.defectInstanceIds.length > 5 ? ` ... and ${fix.defectInstanceIds.length - 5} more` : ''}\n`;
  md += `- **Approved Requirement Source:** ${fix.approvedRequirementSource}\n`;
  md += `- **Current Behavior:**\n  > ${fix.currentBehavior}\n`;
  md += `- **Expected Behavior:**\n  > ${fix.expectedBehavior}\n`;
  md += `- **Files Likely Affected:**\n${fix.filesLikelyAffected.map(f => `  - \`${f}\``).join('\n')}\n`;
  md += `- **Schema Changes:** ${fix.schemaChanges}\n`;
  md += `- **Backward Compatibility:** ${fix.backwardCompatibility}\n`;
  md += `- **Identified Risks:** ${fix.risks}\n`;
  md += `- **Tests Before Execution:** ${fix.testsBefore.length ? fix.testsBefore.map(t => `\`${t}\``).join(', ') : 'None (Documentation)'}\n`;
  md += `- **Tests After Execution:** ${fix.testsAfter.length ? fix.testsAfter.map(t => `\`${t}\``).join(', ') : 'None (Documentation)'}\n`;
  md += `- **Rollback Consideration:** ${fix.rollbackConsideration}\n\n`;
  md += `---\n\n`;
}

md += `## Reconciled Implementation Waves

| Wave | Domain Focus | Fix IDs | Fix Authority |
|---|---|---|---|
| **WAVE 1** | Security, Branch Authorization & Detail Fallbacks | \`FIX-SEC-001\`, \`FIX-RECORD-001\` | ARCHITECTURAL / DETERMINISTIC |
| **WAVE 2** | Form Data Loss & Edit Round-Trip Lifecycles | \`FIX-DATA-001\` | DETERMINISTIC |
| **WAVE 3** | Action Centre Live Queue Producers & Resolvers | \`FIX-WORKFLOW-001\` | ARCHITECTURAL |
| **WAVE 4** | Dynamic Catalogue, State Machines & Integer PKR | \`FIX-DATA-002\`, \`FIX-STATE-001\`, \`FIX-FINANCE-001\` | DETERMINISTIC / ARCHITECTURAL |
| **WAVE 5** | Operational KPIs & Creation Form Prefill Purge | \`FIX-OPERATIONAL-001\`, \`FIX-OPERATIONAL-002\` | DETERMINISTIC |
| **WAVE 6** | Modal-to-Page Responsive Interaction Workflows | \`FIX-INTERACTION-001\` | DETERMINISTIC |
| **BACKLOG** | PDI Scope & Cryptographic Audit Claims | \`FIX-DOC-001\`, \`FIX-DOC-002\` | BUSINESS_DECISION_REQUIRED / BACKEND_DEPENDENT |

---
*Generated by AJ EcoDrive Phase 3.5 Automation Suite. All counts validated by tests/test_forensic_registry_integrity.cjs.*
`;

fs.writeFileSync('PRE_REMEDIATION_FIX_SPEC.md', md);
console.log('Successfully generated PRE_REMEDIATION_FIX_SPEC.json and PRE_REMEDIATION_FIX_SPEC.md');
