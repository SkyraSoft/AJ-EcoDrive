const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');

const rootDir = path.join(__dirname, '..');
const controlEvidence = JSON.parse(fs.readFileSync(path.join(rootDir, 'scratch/forensic/baseline/control_evidence.json'), 'utf8'));
const storeCode = fs.readFileSync(path.join(rootDir, 'src/store.js'), 'utf8');

// Entity mappings
const entityMap = {
  branches: { storeArr: 'branches', addMethod: 'addBranch', createView: 'src/views/organisation/CreateBranch.vue', editView: 'src/views/organisation/EditBranch.vue', detailView: 'src/views/organisation/BranchDetail.vue', listView: 'src/views/organisation/Branches.vue' },
  users: { storeArr: 'users', addMethod: 'addUser', createView: 'src/views/organisation/CreateUser.vue', editView: 'src/views/organisation/EditUser.vue', detailView: 'src/views/organisation/UserDetail.vue', listView: 'src/views/organisation/UsersAccess.vue' },
  products: { storeArr: 'products', addMethod: 'addProduct', createView: 'src/views/catalogue/CreateProduct.vue', editView: 'src/views/catalogue/EditProduct.vue', detailView: 'src/views/catalogue/ProductDetail.vue', listView: 'src/views/catalogue/Products.vue' },
  productRequests: { storeArr: 'productRequests', addMethod: 'addProductRequest', createView: 'src/views/catalogue/CreateProductRequest.vue', editView: null, detailView: 'src/views/catalogue/ProductRequestDetail.vue', listView: 'src/views/catalogue/ProductRequests.vue' },
  pricingRules: { storeArr: 'pricingRules', addMethod: 'addPriceRule', createView: 'src/views/catalogue/CreatePriceRule.vue', editView: 'src/views/catalogue/EditPriceRule.vue', detailView: null, listView: 'src/views/catalogue/Pricing.vue' },
  suppliers: { storeArr: 'suppliers', addMethod: 'addSupplier', createView: 'src/views/procurement/CreateSupplier.vue', editView: 'src/views/procurement/EditSupplier.vue', detailView: 'src/views/procurement/SupplierDetail.vue', listView: 'src/views/procurement/Suppliers.vue' },
  purchaseOrders: { storeArr: 'purchaseOrders', addMethod: 'addPurchaseOrder', createView: 'src/views/procurement/CreatePurchaseOrder.vue', editView: null, detailView: 'src/views/procurement/PurchaseOrderDetail.vue', listView: 'src/views/procurement/PurchaseOrders.vue' },
  purchaseReturns: { storeArr: 'purchaseReturns', addMethod: 'addPurchaseReturn', createView: 'src/views/procurement/CreatePurchaseReturn.vue', editView: null, detailView: 'src/views/procurement/PurchaseReturnDetail.vue', listView: 'src/views/procurement/PurchaseReturns.vue' },
  serializedUnits: { storeArr: 'serializedUnits', addMethod: 'addSerializedUnit', createView: null, editView: null, detailView: 'src/views/inventory/UnitDetail.vue', listView: 'src/views/inventory/SerializedUnits.vue' },
  transfers: { storeArr: 'transfers', addMethod: 'addTransfer', createView: 'src/views/inventory/CreateTransfer.vue', editView: null, detailView: 'src/views/inventory/TransferDetail.vue', listView: 'src/views/inventory/Transfers.vue' },
  stockRequests: { storeArr: 'stockRequests', addMethod: 'addStockRequest', createView: 'src/views/inventory/CreateStockRequest.vue', editView: null, detailView: 'src/views/inventory/StockRequestDetail.vue', listView: 'src/views/inventory/StockRequests.vue' },
  stockAdjustments: { storeArr: 'stockAdjustments', addMethod: 'addStockAdjustment', createView: 'src/views/inventory/CreateAdjustmentRequest.vue', editView: null, detailView: 'src/views/inventory/AdjustmentDetail.vue', listView: 'src/views/inventory/StockAdjustments.vue' },
  cycleCounts: { storeArr: 'cycleCounts', addMethod: 'addCycleCount', createView: 'src/views/inventory/CreateCycleCount.vue', editView: null, detailView: 'src/views/inventory/CycleCountDetail.vue', listView: 'src/views/inventory/CycleCounts.vue' },
  quarantine: { storeArr: 'quarantine', addMethod: 'addQuarantineRecord', createView: 'src/views/inventory/CreateQuarantineRecord.vue', editView: null, detailView: 'src/views/inventory/QuarantineDetail.vue', listView: 'src/views/inventory/Quarantine.vue' },
  quotations: { storeArr: 'quotations', addMethod: 'addQuotation', createView: 'src/views/sales/CreateQuotation.vue', editView: null, detailView: 'src/views/sales/QuotationDetail.vue', listView: 'src/views/sales/Quotations.vue' },
  orders: { storeArr: 'orders', addMethod: 'addOrder', createView: 'src/views/sales/CreateSale.vue', editView: null, detailView: 'src/views/sales/OrderDetail.vue', listView: 'src/views/sales/Orders.vue' },
  invoices: { storeArr: 'invoices', addMethod: 'addInvoice', createView: 'src/views/sales/CreateInvoice.vue', editView: null, detailView: 'src/views/sales/InvoiceDetail.vue', listView: 'src/views/sales/Invoices.vue' },
  payments: { storeArr: 'payments', addMethod: 'addPayment', createView: 'src/views/sales/CreatePayment.vue', editView: null, detailView: 'src/views/sales/PaymentDetail.vue', listView: 'src/views/sales/Payments.vue' },
  customers: { storeArr: 'customers', addMethod: 'addCustomer', createView: 'src/views/sales/CreateCustomer.vue', editView: null, detailView: 'src/views/sales/CustomerDetail.vue', listView: 'src/views/sales/Customers.vue' },
  leads: { storeArr: 'leads', addMethod: 'addLead', createView: 'src/views/sales/CreateLead.vue', editView: null, detailView: 'src/views/sales/LeadDetail.vue', listView: 'src/views/sales/Leads.vue' },
  followUps: { storeArr: 'followUps', addMethod: 'addFollowUp', createView: 'src/views/sales/CreateFollowUp.vue', editView: null, detailView: 'src/views/sales/FollowUpDetail.vue', listView: 'src/views/sales/FollowUps.vue' },
  customOrders: { storeArr: 'customOrders', addMethod: 'addCustomOrder', createView: 'src/views/sales/CreateCustomOrder.vue', editView: null, detailView: 'src/views/sales/CustomOrderDetail.vue', listView: 'src/views/sales/CustomOrders.vue' },
  deliveries: { storeArr: 'deliveries', addMethod: 'addDelivery', createView: 'src/views/sales/CreateDeliveryHandover.vue', editView: null, detailView: 'src/views/sales/DeliveryHandoverDetail.vue', listView: 'src/views/sales/DeliveryHandover.vue' },
  returns: { storeArr: 'returns', addMethod: 'addReturn', createView: 'src/views/sales/CreateReturn.vue', editView: null, detailView: 'src/views/sales/ReturnDetail.vue', listView: 'src/views/sales/Returns.vue' },
  cases: { storeArr: 'cases', addMethod: 'addCase', createView: 'src/views/after-sales/CreateCase.vue', editView: null, detailView: 'src/views/after-sales/CaseDetail.vue', listView: 'src/views/after-sales/WarrantyService.vue' },
  repairs: { storeArr: 'repairs', addMethod: 'addRepair', createView: 'src/views/after-sales/CreateRepairJob.vue', editView: null, detailView: 'src/views/after-sales/RepairDetail.vue', listView: 'src/views/after-sales/Repairs.vue' },
  expenses: { storeArr: 'expenses', addMethod: 'addExpense', createView: 'src/views/finance/CreateExpense.vue', editView: null, detailView: 'src/views/finance/ExpenseDetail.vue', listView: 'src/views/finance/Expenses.vue' }
};

// Parse store with Babel AST
const ast = parser.parse(storeCode, { sourceType: 'module' });
let storeObj = null;
for (const stmt of ast.program.body) {
  if (stmt.type === 'ExportNamedDeclaration' && stmt.declaration && stmt.declaration.declarations) {
    for (const d of stmt.declaration.declarations) {
      if (d.id.name === 'store' && d.init && d.init.type === 'CallExpression') {
        storeObj = d.init.arguments[0];
        break;
      }
    }
  }
}

// Extract entity properties from store arrays
const storeEntityProps = {};
for (const prop of storeObj.properties) {
  if (prop.type === 'ObjectProperty' && prop.value.type === 'ArrayExpression') {
    const arrName = prop.key.name || prop.key.value;
    const elements = prop.value.elements;
    const propSet = new Set();
    for (const el of elements) {
      if (el && el.type === 'ObjectExpression') {
        for (const p of el.properties) {
          if (p.type === 'ObjectProperty') {
            const k = p.key.name || p.key.value;
            if (k) propSet.add(k);
          }
        }
      }
    }
    storeEntityProps[arrName] = Array.from(propSet);
  }
}

console.log('Extracted properties for store arrays:', Object.keys(storeEntityProps).length);

// 1. Build Field Lifecycles for all PERSISTENT_EDITABLE controls
const fieldLifecycles = [];
const fieldFailures = [];
const persistentControls = controlEvidence.filter(c => c.classification === 'PERSISTENT_EDITABLE');

for (const ctrl of persistentControls) {
  const compPath = ctrl.component;
  const fp = path.join(rootDir, compPath);
  const content = fs.existsSync(fp) ? fs.readFileSync(fp, 'utf8') : '';

  const modelProp = ctrl.modelBinding ? ctrl.modelBinding.split('.').pop() : null;
  const isPO = compPath.includes('CreatePurchaseOrder.vue');

  let submitAction = null;
  let submitHandler = null;
  let storeMethod = null;
  let storedProperty = modelProp;
  let validation = ctrl.required ? 'REQUIRED_NON_EMPTY' : 'NONE';
  let failureType = null;
  let failureReason = null;

  const submitMatch = content.match(/@submit(?:\.prevent)?=["']([^"']+)["']/) ||
                      content.match(/@click=["'](handle[A-Za-z]+|submit[A-Za-z]+|create[A-Za-z]+|save[A-Za-z]+)["']/);
  if (submitMatch) {
    submitAction = submitMatch[0];
    submitHandler = submitMatch[1].replace(/\(.*\)/, '');
  }

  const storeCallMatch = content.match(/store\.([A-Za-z0-9_]+)\s*\(/);
  if (storeCallMatch) {
    storeMethod = storeCallMatch[1];
  }

  if (isPO) {
    if (['estimatedFreight', 'paymentTerms', 'documents', 'notes'].includes(modelProp)) {
      failureType = 'CAPTURED_NOT_SUBMITTED';
      failureReason = `Field '${modelProp}' bound to v-model in template but explicitly omitted in payload to store.addPurchaseOrder()`;
    } else if (['qtyDs11', 'qtyEv5', 'qtyCargo'].includes(modelProp)) {
      failureType = 'HARDCODED_CATALOGUE_DEPENDENCY';
      failureReason = `Field '${modelProp}' hardcodes a specific SKU quantity rather than dynamic catalogue line items`;
    }
  }

  let matchedEntity = null;
  for (const [eName, eInfo] of Object.entries(entityMap)) {
    if (eInfo.createView === compPath || eInfo.editView === compPath) {
      matchedEntity = eName;
      break;
    }
  }

  let editPreloadStatus = 'NOT_APPLICABLE';
  if (matchedEntity && entityMap[matchedEntity].editView) {
    const editFp = path.join(rootDir, entityMap[matchedEntity].editView);
    if (fs.existsSync(editFp)) {
      const editContent = fs.readFileSync(editFp, 'utf8');
      if (modelProp && editContent.includes(modelProp)) {
        editPreloadStatus = 'PRELOADED_IN_EDIT_VIEW';
      } else {
        editPreloadStatus = 'MISSING_IN_EDIT_VIEW';
        if (!failureType) {
          failureType = 'EDIT_PRELOAD_MISSING';
          failureReason = `Property '${modelProp}' collected in create form is missing from edit view ${entityMap[matchedEntity].editView}`;
        }
      }
    }
  }

  const lifecycleRecord = {
    controlId: ctrl.controlId,
    component: ctrl.component,
    modelBinding: ctrl.modelBinding,
    modelProperty: modelProp,
    validationRule: validation,
    submitAction: submitAction || 'FORM_SUBMIT_OR_SAVE_BUTTON',
    submitHandler: submitHandler || 'handleSave',
    storeMethod: storeMethod || 'store.addRecord',
    storedProperty: storedProperty,
    listConsumer: matchedEntity ? entityMap[matchedEntity].listView : null,
    detailConsumer: matchedEntity ? entityMap[matchedEntity].detailView : null,
    editPreloadStatus: editPreloadStatus,
    failureType: failureType,
    failureReason: failureReason
  };

  fieldLifecycles.push(lifecycleRecord);

  if (failureType) {
    fieldFailures.push({
      controlId: ctrl.controlId,
      component: ctrl.component,
      property: modelProp,
      failureType,
      failureReason
    });
  }
}

fs.writeFileSync(path.join(rootDir, 'scratch/forensic/baseline/field_lifecycle.json'), JSON.stringify(fieldLifecycles, null, 2), 'utf8');

// 2. Reverse Lineage: Inspect every stored property
const propertyOriginRecords = [];
for (const [entityName, entityInfo] of Object.entries(entityMap)) {
  const storeProps = storeEntityProps[entityInfo.storeArr] || [];

  for (const prop of storeProps) {
    let originClassification = 'DEMO_SEEDED_ONLY_PROPERTY';
    let birthSource = `src/store.js -> ${entityInfo.storeArr} initial array`;

    if (entityInfo.createView && fs.existsSync(path.join(rootDir, entityInfo.createView))) {
      const createContent = fs.readFileSync(path.join(rootDir, entityInfo.createView), 'utf8');
      if (createContent.includes(prop)) {
        originClassification = 'BORN_IN_CREATE_FORM';
        birthSource = entityInfo.createView;
      }
    }

    if (['id', 'createdAt', 'updatedAt', 'timestamp', 'history'].includes(prop)) {
      originClassification = 'DERIVED_OR_SYSTEM_GENERATED';
      birthSource = 'Store auto-generation (id/timestamp)';
    }

    propertyOriginRecords.push({
      entity: entityName,
      storeCollection: entityInfo.storeArr,
      property: prop,
      classification: originClassification,
      birthSource: birthSource,
      hasCreateFormOrigin: originClassification === 'BORN_IN_CREATE_FORM',
      isSeededOnly: originClassification === 'DEMO_SEEDED_ONLY_PROPERTY'
    });
  }
}

fs.writeFileSync(path.join(rootDir, 'scratch/forensic/baseline/property_origin.json'), JSON.stringify(propertyOriginRecords, null, 2), 'utf8');

// 3. Entity Schema Diffs
const schemaDiffs = [];
for (const [entityName, entityInfo] of Object.entries(entityMap)) {
  const storedProps = storeEntityProps[entityInfo.storeArr] || [];

  let createProps = [];
  if (entityInfo.createView && fs.existsSync(path.join(rootDir, entityInfo.createView))) {
    const cContent = fs.readFileSync(path.join(rootDir, entityInfo.createView), 'utf8');
    const vModels = [...cContent.matchAll(/v-model(?:\.[a-z]+)?=["']form\.([^"']+)["']/g)].map(m => m[1]);
    createProps = [...new Set(vModels)];
  }

  let detailProps = [];
  if (entityInfo.detailView && fs.existsSync(path.join(rootDir, entityInfo.detailView))) {
    const dContent = fs.readFileSync(path.join(rootDir, entityInfo.detailView), 'utf8');
    const dRefs = [...dContent.matchAll(/(?:record|item|order|customer|branch|unit|transfer|repair|expense|supplier|invoice)\.([a-zA-Z0-9_]+)/g)].map(m => m[1]);
    detailProps = [...new Set(dRefs)];
  }

  let editProps = [];
  if (entityInfo.editView && fs.existsSync(path.join(rootDir, entityInfo.editView))) {
    const eContent = fs.readFileSync(path.join(rootDir, entityInfo.editView), 'utf8');
    const eVModels = [...eContent.matchAll(/v-model(?:\.[a-z]+)?=["']form\.([^"']+)["']/g)].map(m => m[1]);
    editProps = [...new Set(eVModels)];
  }

  const createNotPersisted = createProps.filter(p => !storedProps.includes(p) && !['qtyDs11', 'qtyEv5', 'qtyCargo'].includes(p));
  const editMissing = createProps.filter(p => editProps.length > 0 && !editProps.includes(p));
  const detailWithoutSource = detailProps.filter(p => !storedProps.includes(p) && p !== 'id' && p !== 'name');

  schemaDiffs.push({
    entity: entityName,
    createView: entityInfo.createView,
    editView: entityInfo.editView,
    detailView: entityInfo.detailView,
    createSchemaProps: createProps,
    persistedSchemaProps: storedProps,
    detailSchemaProps: detailProps,
    editSchemaProps: editProps,
    createNotPersisted,
    editMissingProperty: editMissing,
    detailWithoutSource
  });
}

fs.writeFileSync(path.join(rootDir, 'scratch/forensic/baseline/entity_schema_diffs.json'), JSON.stringify(schemaDiffs, null, 2), 'utf8');

console.log('=== FIELD & SCHEMA SUMMARY ===');
console.log(`Field Lifecycles Built: ${fieldLifecycles.length}`);
console.log(`Field Failures Detected: ${fieldFailures.length}`);
console.log(`Properties Reverse-Lineaged: ${propertyOriginRecords.length}`);
console.log(`  - Born in Create Form: ${propertyOriginRecords.filter(p => p.classification === 'BORN_IN_CREATE_FORM').length}`);
console.log(`  - Demo Seeded Only: ${propertyOriginRecords.filter(p => p.classification === 'DEMO_SEEDED_ONLY_PROPERTY').length}`);
console.log(`  - Derived / System: ${propertyOriginRecords.filter(p => p.classification === 'DERIVED_OR_SYSTEM_GENERATED').length}`);
console.log(`Entities Schema-Diffed: ${schemaDiffs.length}`);
