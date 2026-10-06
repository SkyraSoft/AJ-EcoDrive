/**
 * AJ ECODRIVE — WAVE 4 VERIFICATION SUITE
 * Test Suite: Catalogue-Driven Procurement & Dynamic Lines Contract
 */

const assert = require('assert')
const path = require('path')

// Load Store
const storePath = path.resolve(__dirname, '../src/store.js')
delete require.cache[require.resolve(storePath)]
const { store } = require(storePath)

// Initialize session
store.setSession({
  id: 'usr-admin-01',
  name: 'Global Administrator',
  email: 'admin@ajecodrive.com',
  role: 'Super Admin',
  isSuperAdmin: true,
  branch: 'All',
  branchCode: 'ALL'
})

console.log('=== WAVE 4: CATALOGUE-DRIVEN PROCUREMENT & DYNAMIC LINES ===\n')

let passedTests = 0
let failedTests = 0

function runTest(name, fn) {
  try {
    fn()
    console.log(`[PASS] ${name}`)
    passedTests++
  } catch (err) {
    console.error(`[FAIL] ${name}`)
    console.error(`  Error: ${err.message}`)
    failedTests++
  }
}

// 1. Rejection of Hardcoded Line Quantities & Mandatory Product Lines
runTest('PO Line Validation: Rejects PO without line items', () => {
  assert.throws(() => {
    store.validatePurchaseOrderLines([])
  }, /must contain at least one product line/i)

  assert.throws(() => {
    store.validatePurchaseOrderLines(null)
  }, /must contain at least one product line/i)
})

// 2. Product ID validation against canonical catalogue
runTest('PO Line Validation: Rejects invalid product IDs', () => {
  assert.throws(() => {
    store.validatePurchaseOrderLines([
      { product_id: 'NON-EXISTENT-PROD-999', quantity: 5, expectedUnitCost: 100000 }
    ])
  }, /not found in canonical catalogue/i)
})

// 3. Rejects Archived Products for New Procurement
runTest('PO Line Validation: Rejects archived catalogue items for new POs', () => {
  // Find or temporarily create an archived product in store
  const archivedProdId = 'PROD-ARCHIVED-TEST'
  store.products.push({
    id: archivedProdId,
    product_id: archivedProdId,
    name: 'Legacy Discontinued Scooter',
    status: 'Archived',
    costPrice: 50000
  })

  assert.throws(() => {
    store.validatePurchaseOrderLines([
      { product_id: archivedProdId, quantity: 2, expectedUnitCost: 50000 }
    ])
  }, /not active in catalogue/i)

  // Clean up
  store.products = store.products.filter(p => p.id !== archivedProdId)
})

// 4. Rejects Non-Positive Quantities
runTest('PO Line Validation: Rejects quantity <= 0 or invalid numbers', () => {
  assert.throws(() => {
    store.validatePurchaseOrderLines([
      { product_id: 'PROD-001', quantity: 0, expectedUnitCost: 150000 }
    ])
  }, /quantity must be greater than 0/i)

  assert.throws(() => {
    store.validatePurchaseOrderLines([
      { product_id: 'PROD-001', quantity: -5, expectedUnitCost: 150000 }
    ])
  }, /quantity must be greater than 0/i)
})

// 5. Rejects Duplicate Product Lines Deterministically
runTest('PO Line Validation: Rejects duplicate product lines in same PO', () => {
  assert.throws(() => {
    store.validatePurchaseOrderLines([
      { product_id: 'PROD-001', quantity: 5, expectedUnitCost: 150000 },
      { product_id: 'PROD-001', quantity: 3, expectedUnitCost: 150000 }
    ])
  }, /duplicate product/i)
})

// 6. Zero Inventory Creation Invariant
runTest('Zero Inventory Invariant: PO Creation creates ZERO physical stock and ZERO serialized units', () => {
  const prod = store.getProductById('PROD-001')
  const initialStockStr = prod.stock
  const initialUnitsCount = store.serializedUnits.length

  const createdPO = store.addPurchaseOrder({
    supplier_id: 'SUP-01',
    supplier: 'Super EV Shenzhen Ltd',
    destination: 'Peshawar',
    branch_id: 'BR-01',
    status: 'Pending Approval',
    estimatedFreight: 45000,
    paymentTerms: 'Net 30',
    shipmentMethod: 'Sea Freight',
    items: [
      { product_id: 'PROD-001', product: prod.name, sku: prod.sku, quantity: 10, expectedUnitCost: 150000, subtotal: 1500000 }
    ]
  })

  assert(createdPO.id, 'PO must be created with ID')
  assert.strictEqual(prod.stock, initialStockStr, 'Physical stock must not change on PO creation')
  assert.strictEqual(store.serializedUnits.length, initialUnitsCount, 'Serialized units count must not change on PO creation')
  assert.strictEqual(createdPO.status, 'Pending Approval')
  assert.strictEqual(createdPO.totalOrdered, 10)
  assert.strictEqual(createdPO.totalReceived, 0)
  assert.strictEqual(createdPO.remainingUnits, 10)

  // Verify Wave 2 metadata preserved
  assert.strictEqual(createdPO.estimatedFreight, 45000)
  assert.strictEqual(createdPO.paymentTerms, 'Net 30')
  assert.strictEqual(createdPO.shipmentMethod, 'Sea Freight')
})

// 7. Dynamic Goods Receipt from saved PO lines
runTest('Dynamic Goods Receipt: Receipts dynamically link to PO lines and capture unique serialized identities', () => {
  // Create an approved PO
  const po = store.addPurchaseOrder({
    supplier_id: 'SUP-01',
    supplier: 'Super EV Shenzhen Ltd',
    destination: 'Peshawar',
    branch_id: 'BR-01',
    status: 'Pending Approval',
    items: [
      { product_id: 'PROD-001', product: 'BRG E-125', sku: 'SKU-E125-BLK', quantity: 2, expectedUnitCost: 180000, subtotal: 360000 }
    ]
  })

  // Approve PO
  store.setSession({ id: 'USR-01', name: 'Super Admin', role: 'Super Admin', isSuperAdmin: true, branch: 'All', branchCode: 'ALL' })
  store.approvePurchaseOrder(po.id)
  assert.strictEqual(po.status, 'Approved')

  // Receive goods with serialized identities
  const receiptResult = store.postReceipt({
    receiptData: {
      po_id: po.id,
      notes: 'Received 2 units in Peshawar showroom',
      lines: [
        {
          product_id: 'PROD-001',
          product: 'BRG E-125',
          sku: 'SKU-E125-BLK',
          ordered_quantity: 2,
          previously_received_quantity: 0,
          current_received_quantity: 2,
          accepted_quantity: 2,
          damaged_quantity: 0
        }
      ],
      serializedUnits: [
        {
          product_id: 'PROD-001',
          product: 'BRG E-125',
          chassis: 'W4-CHASSIS-001',
          serial: 'W4-SERIAL-001',
          vin: 'W4-VIN-001',
          qc: 'Pass',
          condition: 'Good'
        },
        {
          product_id: 'PROD-001',
          product: 'BRG E-125',
          chassis: 'W4-CHASSIS-002',
          serial: 'W4-SERIAL-002',
          vin: 'W4-VIN-002',
          qc: 'Pass',
          condition: 'Good'
        }
      ]
    }
  })

  assert(receiptResult.success, 'Receipt must post successfully')
  assert.strictEqual(po.status, 'Fully Received')
  assert.strictEqual(po.remainingUnits, 0)
  assert.strictEqual(po.totalReceived, 2)

  // Verify units created in store with unit landed cost preserved
  const u1 = store.getUnitById('W4-CHASSIS-001')
  const u2 = store.getUnitById('W4-CHASSIS-002')
  assert(u1, 'Unit 1 must exist in serializedUnits')
  assert(u2, 'Unit 2 must exist in serializedUnits')
  assert.strictEqual(u1.status, 'Available')
  assert.strictEqual(u1.landedCost, 180000, 'Unit landed cost must match PO line unit cost')
  assert.strictEqual(u2.landedCost, 180000, 'Unit landed cost must match PO line unit cost')
})

// 9. Mixed-Variant Catalogue PO Lines Runtime Test
runTest('Mixed-Variant PO Runtime Test: Creates PO with Product A Black x 10, Product A Red x 15, Product B no variant x 5', () => {
  // Ensure Product A and B exist with variants in catalogue
  const prodA = store.getProductById('PROD-001')
  const prodB = store.getProductById('PROD-003')
  assert(prodA && prodB, 'Products PROD-001 and PROD-003 must exist')

  const poPayload = {
    po: 'PO-TEST-VAR-10-15-5',
    po_id: 'PO-TEST-VAR-10-15-5',
    supplier_id: 'SUP-01',
    supplier: 'Super EV Shenzhen Ltd',
    destination: 'Peshawar',
    branch_id: 'BR-01',
    status: 'Pending Approval',
    estimatedFreight: 85000,
    paymentTerms: 'LC at Sight',
    shipmentMethod: 'Sea Freight',
    notes: 'Mixed variant consignment test',
    items: [
      {
        lineId: 'LINE-001',
        product_id: 'PROD-001',
        productId: 'PROD-001',
        productName: prodA.name,
        variant_id: 'VAR-BLK',
        variantId: 'VAR-BLK',
        variantName: 'Midnight Black',
        sku: 'SKU-E125-BLK',
        quantity: 10,
        ordered: 10,
        expectedUnitCost: 180000,
        lineSubtotal: 1800000
      },
      {
        lineId: 'LINE-002',
        product_id: 'PROD-001',
        productId: 'PROD-001',
        productName: prodA.name,
        variant_id: 'VAR-RED',
        variantId: 'VAR-RED',
        variantName: 'Racing Red',
        sku: 'SKU-E125-RED',
        quantity: 15,
        ordered: 15,
        expectedUnitCost: 185000,
        lineSubtotal: 2775000
      },
      {
        lineId: 'LINE-003',
        product_id: 'PROD-003',
        productId: 'PROD-003',
        productName: prodB.name,
        variant_id: 'NOT_APPLICABLE',
        variantId: 'NOT_APPLICABLE',
        variantName: 'Standard',
        sku: prodB.sku || 'SKU-PROD-003',
        quantity: 5,
        ordered: 5,
        expectedUnitCost: 140000,
        lineSubtotal: 700000
      }
    ]
  }

  const createdPO = store.addPurchaseOrder(poPayload)
  assert(createdPO, 'PO must be created')
  assert.strictEqual(createdPO.items.length, 3, 'Must store exactly 3 distinct line items')
  assert.strictEqual(createdPO.totalOrdered, 30, 'Total units ordered must be 10 + 15 + 5 = 30')

  // Re-fetch from store to prove persistence and reopening
  const reopenedPO = store.getPurchaseOrderById('PO-TEST-VAR-10-15-5')
  assert(reopenedPO, 'Reopened PO must exist in store')
  assert.strictEqual(reopenedPO.items.length, 3)

  // Line 1 verification
  assert.strictEqual(reopenedPO.items[0].product_id, 'PROD-001')
  assert.strictEqual(reopenedPO.items[0].variant_id, 'VAR-BLK')
  assert.strictEqual(reopenedPO.items[0].variantName, 'Midnight Black')
  assert.strictEqual(reopenedPO.items[0].quantity, 10)
  assert.strictEqual(reopenedPO.items[0].expectedUnitCost, 180000)

  // Line 2 verification
  assert.strictEqual(reopenedPO.items[1].product_id, 'PROD-001')
  assert.strictEqual(reopenedPO.items[1].variant_id, 'VAR-RED')
  assert.strictEqual(reopenedPO.items[1].variantName, 'Racing Red')
  assert.strictEqual(reopenedPO.items[1].quantity, 15)
  assert.strictEqual(reopenedPO.items[1].expectedUnitCost, 185000)

  // Line 3 verification
  assert.strictEqual(reopenedPO.items[2].product_id, 'PROD-003')
  assert.strictEqual(reopenedPO.items[2].variant_id, 'NOT_APPLICABLE')
  assert.strictEqual(reopenedPO.items[2].quantity, 5)
  assert.strictEqual(reopenedPO.items[2].expectedUnitCost, 140000)
})

// 10. Real Warehouse Receiving Scenario: Ordered 5, Received 4 (3 Accepted, 1 Damaged, 1 Missing)
runTest('Real Warehouse Receiving Scenario: ordered=5, received=4, accepted=3, damaged=1, missing=1', () => {
  const po = store.addPurchaseOrder({
    po: 'PO-WH-TEST-54311',
    po_id: 'PO-WH-TEST-54311',
    supplier_id: 'SUP-01',
    supplier: 'Super EV Shenzhen Ltd',
    destination: 'Peshawar',
    branch_id: 'BR-01',
    status: 'In Transit',
    items: [
      { product_id: 'PROD-003', product: 'BRG Cargo EV', sku: 'SKU-CRG-01', quantity: 5, expectedUnitCost: 140000 }
    ]
  })
  po.status = 'In Transit'

  const initialTotalUnits = store.serializedUnits.length

  const receiptPayload = {
    receiptData: {
      po_id: po.id,
      notes: 'Container arrival at Peshawar warehouse. 1 unit carton crushed, 1 unit short.',
      lines: [
        {
          product_id: 'PROD-003',
          product: 'BRG Cargo EV',
          sku: 'SKU-CRG-01',
          ordered_quantity: 5,
          previously_received_quantity: 0,
          current_received_quantity: 4, // 4 physically arrived
          accepted_quantity: 3,         // 3 passed QC
          damaged_quantity: 1,          // 1 damaged
          short_quantity: 1             // 1 missing
        }
      ],
      serializedUnits: [
        { chassis: 'CH-CRG-WH-001', serial: 'SN-CRG-WH-001', qc: 'Pass', condition: 'Good' },
        { chassis: 'CH-CRG-WH-002', serial: 'SN-CRG-WH-002', qc: 'Pass', condition: 'Good' },
        { chassis: 'CH-CRG-WH-003', serial: 'SN-CRG-WH-003', qc: 'Pass', condition: 'Good' },
        { chassis: 'CH-CRG-WH-004', serial: 'SN-CRG-WH-004', qc: 'Fail', condition: 'Damaged' }
      ]
    }
  }

  const result = store.postReceipt(receiptPayload)
  assert(result.success, 'Receipt must post successfully')

  // Invariant 1: PO ordered quantity remains 5
  assert.strictEqual(po.totalOrdered, 5, 'PO totalOrdered MUST remain 5')
  assert.strictEqual(po.totalReceived, 4, 'PO totalReceived must be 4')
  assert.strictEqual(po.remainingUnits, 1, 'PO remaining unfulfilled units must be 1')
  assert.strictEqual(po.status, 'Partially Received', 'PO status must transition to Partially Received')

  // Invariant 2: Exactly 4 serialized units created (missing unit creates ZERO serialized records)
  assert.strictEqual(store.serializedUnits.length, initialTotalUnits + 4)

  // Invariant 3: 3 Accepted units enter normal Available inventory
  const u1 = store.getUnitById('CH-CRG-WH-001')
  const u2 = store.getUnitById('CH-CRG-WH-002')
  const u3 = store.getUnitById('CH-CRG-WH-003')
  assert.strictEqual(u1.status, 'Available')
  assert.strictEqual(u2.status, 'Available')
  assert.strictEqual(u3.status, 'Available')

  // Invariant 4: 1 Damaged unit enters 'Damaged / Quarantine' and is NOT Available
  const u4 = store.getUnitById('CH-CRG-WH-004')
  assert.strictEqual(u4.status, 'Damaged / Quarantine')
  assert.notStrictEqual(u4.status, 'Available')
})

console.log(`\n========================================`)
console.log(`Wave 4 Catalogue Procurement: ${passedTests} passed, ${failedTests} failed.`)
console.log(`========================================\n`)

if (failedTests > 0) {
  process.exit(1)
} else {
  process.exit(0)
}
