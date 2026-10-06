const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const storeContent = fs.readFileSync(path.join(rootDir, 'src/store.js'), 'utf8');

// 32 store arrays
const allStoreArrays = [
  'branches', 'users', 'roles', 'categories', 'products', 'pricingRules', 'productRequests',
  'suppliers', 'purchaseOrders', 'receipts', 'landedCosts', 'vendorBills', 'purchaseReturns',
  'serializedUnits', 'transfers', 'inboundDeliveries', 'stockRequests', 'stockAdjustments',
  'cycleCounts', 'quarantine', 'stockLedger', 'quotations', 'orders', 'invoices', 'payments',
  'customers', 'leads', 'followUps', 'customOrders', 'deliveries', 'salesReturns',
  'cases', 'repairs', 'expenses', 'conversations', 'actionQueue', 'notifications', 'auditLogs'
];

const entityClassifications = [];

for (const arr of allStoreArrays) {
  const isFormalStateMachine = ['purchaseOrders', 'serializedUnits', 'orders', 'invoices', 'expenses', 'transfers', 'cases', 'repairs', 'quarantine'].includes(arr);
  const isBusinessEntityInSchemaDiff = !['roles', 'landedCosts', 'vendorBills', 'stockLedger', 'receipts', 'inboundDeliveries', 'conversations', 'actionQueue', 'notifications', 'auditLogs'].includes(arr);

  let statusFields = [];
  const statusProps = ['status', 'state', 'approval', 'stage', 'phase', 'resolution', 'condition', 'paymentStatus', 'approvalStatus', 'deliveryStatus', 'payment'];
  
  // Search store initial data for this array
  const regex = new RegExp(`${arr}:\\s*\\[([\\s\\S]*?)\\]\\s*,`, 'm');
  const match = storeContent.match(regex);
  if (match) {
    statusProps.forEach(sp => {
      if (match[1].includes(`${sp}:`)) statusFields.push(sp);
    });
  }

  let type = 'AUXILIARY_LOG_OR_QUEUE';
  if (isFormalStateMachine) type = 'FORMAL_STATE_MACHINE_ENTITY';
  else if (statusFields.length > 0) type = 'STATEFUL_BUSINESS_ENTITY_SIMPLE';
  else if (isBusinessEntityInSchemaDiff) type = 'STATIC_OR_CONFIG_ENTITY';

  entityClassifications.push({
    collectionName: arr,
    isBusinessEntity: isBusinessEntityInSchemaDiff,
    hasStatusOrStateProperty: statusFields.length > 0,
    statusPropertiesFound: statusFields,
    isFormalStateMachine: isFormalStateMachine,
    categoryType: type,
    rationale: isFormalStateMachine ? 'Undergoes multi-stage lifecycle with business role handoffs and terminal states.' : 
               (statusFields.length > 0 ? 'Possesses binary or simple status (e.g. Active/Inactive) without complex multi-step state machine.' : 
               'Config entity or immutable ledger/log.')
  });
}

const summary = {
  TOTAL_STORE_COLLECTIONS: allStoreArrays.length,
  BUSINESS_ENTITIES_IN_SCHEMA_DIFF: entityClassifications.filter(e => e.isBusinessEntity).length,
  ENTITIES_WITH_STATUS_PROPERTIES: entityClassifications.filter(e => e.hasStatusOrStateProperty).length,
  FORMAL_STATE_MACHINE_ENTITIES: entityClassifications.filter(e => e.isFormalStateMachine).length,
  AUXILIARY_OR_LEDGER_COLLECTIONS: entityClassifications.filter(e => !e.isBusinessEntity).length,
  entities: entityClassifications
};

fs.writeFileSync(
  path.join(rootDir, 'scratch/forensic/baseline/stateful_entity_universe.json'),
  JSON.stringify(summary, null, 2),
  'utf8'
);

console.log('=== STATEFUL ENTITY RECONCILIATION ===');
console.log('Total Store Collections:', summary.TOTAL_STORE_COLLECTIONS);
console.log('Business Entities in Schema Diff:', summary.BUSINESS_ENTITIES_IN_SCHEMA_DIFF);
console.log('Entities with Status/State Properties:', summary.ENTITIES_WITH_STATUS_PROPERTIES);
console.log('Formal State Machine Entities:', summary.FORMAL_STATE_MACHINE_ENTITIES);
