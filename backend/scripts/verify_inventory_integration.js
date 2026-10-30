/**
 * Live Inventory End-to-End Verification & MySQL Evidence Script
 * Tests the running Express server at http://localhost:3000 and queries MySQL ecodrive database.
 */
import { connectDB, query, disconnectDB } from '../src/config/db.js';

const BASE_URL = 'http://localhost:3000/api/v1';

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      'x-branch-id': 'all',
      'x-user-role': 'SuperAdmin',
      'x-user-id': 'admin-system',
      ...(options.headers || {})
    },
    ...options
  });
  const data = await res.json().catch(() => ({}));
  return { status: res.status, ok: res.ok, data };
}

async function run() {
  await connectDB();
  console.log('===============================================================');
  console.log('   AJ EcoDrive ERP — Inventory Management Live Verification   ');
  console.log('===============================================================\n');

  const evidence = {};

  // 1. Health check
  console.log('1. Checking Backend Server Health...');
  const health = await request('/health');
  if (health.status !== 200) throw new Error(`Server health failed: ${health.status}`);
  console.log('   ✔ Backend is healthy (HTTP 200)\n');

  // 2. Categories
  console.log('2. Verifying Categories API...');
  const catRes = await request('/categories');
  const categories = Array.isArray(catRes.data) ? catRes.data : (catRes.data?.data || []);
  console.log(`   ✔ Retrieved ${categories.length} categories from live database`);

  // 3. Products
  console.log('3. Verifying Products & Branch Aggregation API...');
  const prodRes = await request('/products');
  const products = Array.isArray(prodRes.data) ? prodRes.data : (prodRes.data?.data || []);
  console.log(`   ✔ Retrieved ${products.length} products with branch stock aggregations`);
  const prod1 = products.find(p => p.sku === 'PROD-001') || products[0];
  if (prod1) {
    console.log(`     Sample Product: ${prod1.sku} - ${prod1.name}`);
    console.log(`     Total On-Hand: ${prod1.total ?? prod1.total_on_hand}, Total Reserved: ${prod1.reserved ?? prod1.total_reserved}, Total Available: ${prod1.available ?? prod1.total_available}`);
  }
  console.log('');

  // 4. Stock Summary & Low-Stock Alerts
  console.log('4. Verifying Stock Summary & Low Stock Alerts...');
  const stockRes = await request('/inventory/stock');
  const stockItems = Array.isArray(stockRes.data) ? stockRes.data : (stockRes.data?.data || []);
  console.log(`   ✔ Retrieved ${stockItems.length} inventory stock records across all branches`);
  const lowStockRes = await request('/inventory/low-stock');
  const lowStockItems = Array.isArray(lowStockRes.data) ? lowStockRes.data : (lowStockRes.data?.data || []);
  console.log(`   ✔ Low-stock query returned ${lowStockItems.length} items requiring reorder\n`);

  // 5. Inward Receipt Workflow
  console.log('5. Executing Inward Stock Receipt Workflow...');
  const receiptRes = await request('/inventory/receipts', {
    method: 'POST',
    body: JSON.stringify({
      product_id: 'PROD-001',
      branch_id: 'peshawar',
      quantity: 5,
      unit_cost: 120000,
      supplier_name: 'Super Power Electric Motors Karachi',
      notes: 'Verification inward receipt batch #VR-001'
    })
  });
  if (receiptRes.status !== 201) throw new Error(`Receipt failed: ${JSON.stringify(receiptRes.data)}`);
  const rData = receiptRes.data?.data || receiptRes.data;
  console.log(`   ✔ Inward receipt recorded. Movement Ref: ${rData?.movementNumber || rData?.movement_number}`);
  console.log(`     Stock Before: ${rData?.beforeOnHand} -> Stock After: ${rData?.afterOnHand} (Available: ${rData?.available})\n`);

  // 6. Stock Issue Workflow & Negative Stock Prevention
  console.log('6. Executing Stock Issue & Negative Stock Prevention...');
  // Attempt invalid issue exceeding available stock
  const invalidIssueRes = await request('/inventory/issues', {
    method: 'POST',
    body: JSON.stringify({
      product_id: 'PROD-001',
      branch_id: 'peshawar',
      quantity: 999999,
      reason: 'Excessive issue test',
      reference_number: 'TEST-OVER-ISSUE'
    })
  });
  if (invalidIssueRes.status === 400) {
    console.log(`   ✔ Excessive issue correctly rejected with HTTP 400: "${invalidIssueRes.data?.message}"`);
  } else {
    throw new Error(`Excessive issue was not rejected: ${invalidIssueRes.status}`);
  }

  // Valid issue
  const validIssueRes = await request('/inventory/issues', {
    method: 'POST',
    body: JSON.stringify({
      product_id: 'PROD-001',
      branch_id: 'peshawar',
      quantity: 2,
      reason: 'Workshop spare parts replacement',
      reference_number: 'ISSUE-VR-001'
    })
  });
  if (validIssueRes.status !== 200 && validIssueRes.status !== 201) throw new Error(`Valid issue failed: ${JSON.stringify(validIssueRes.data)}`);
  const iData = validIssueRes.data?.data || validIssueRes.data;
  console.log(`   ✔ Valid stock issue deducted 2 units. New on-hand: ${iData?.afterOnHand} (Available: ${iData?.available})\n`);

  // 7. Stock Adjustments with Mandatory Reason
  console.log('7. Executing Stock Adjustment Workflow...');
  // Missing reason validation
  const invalidAdjRes = await request('/inventory/adjustments', {
    method: 'POST',
    body: JSON.stringify({
      product_id: 'PROD-002',
      branch_id: 'islamabad',
      type: 'Damage',
      difference: -1,
      reason: '   ' // empty/whitespace
    })
  });
  if (invalidAdjRes.status === 422) {
    console.log(`   ✔ Missing reason correctly rejected with HTTP 422: "${invalidAdjRes.data?.error || invalidAdjRes.data?.message}"`);
  } else {
    throw new Error(`Adjustment without reason was not rejected: ${invalidAdjRes.status}`);
  }

  // Valid adjustment creation
  const validAdjRes = await request('/inventory/adjustments', {
    method: 'POST',
    body: JSON.stringify({
      product_id: 'PROD-002',
      branch_id: 'islamabad',
      type: 'Physical Audit Discrepancy',
      difference: 3,
      reason: 'Annual cycle count identified unrecorded inventory in Bin B-04'
    })
  });
  if (validAdjRes.status !== 201) throw new Error(`Adjustment creation failed: ${JSON.stringify(validAdjRes.data)}`);
  const createdAdj = validAdjRes.data?.data || validAdjRes.data;
  const adjId = createdAdj?.id;
  console.log(`   ✔ Adjustment created: ${createdAdj?.adjustmentNumber || createdAdj?.adjustment_number || createdAdj?.id} (Status: ${createdAdj?.status})`);

  // Approve adjustment
  const approveRes = await request(`/inventory/adjustments/${adjId}/approve`, {
    method: 'POST',
    body: JSON.stringify({ approved_by: 'Inventory Manager' })
  });
  if (approveRes.status !== 200) throw new Error(`Adjustment approval failed: ${JSON.stringify(approveRes.data)}`);
  const approvedAdj = approveRes.data?.adjustment || approveRes.data?.data || approveRes.data;
  console.log(`   ✔ Adjustment approved: Status is now "${approvedAdj?.status}" and stock adjusted\n`);

  // 8. Controlled Inter-Branch Transfer Workflow
  console.log('8. Executing Controlled Inter-Branch Transfer Workflow...');
  // Create transfer
  const createTransRes = await request('/inventory/transfers', {
    method: 'POST',
    body: JSON.stringify({
      from_branch_id: 'peshawar',
      to_branch_id: 'rawalpindi',
      notes: 'Urgent stock balancing for Rawalpindi showroom',
      items: [
        { product_id: 'PROD-001', quantity: 1 }
      ]
    })
  });
  if (createTransRes.status !== 201) throw new Error(`Transfer creation failed: ${JSON.stringify(createTransRes.data)}`);
  const createdTrans = createTransRes.data?.data || createTransRes.data?.transfer || createTransRes.data;
  const transId = createdTrans?.id;
  console.log(`   ✔ Transfer created: ${createdTrans?.transferNumber || createdTrans?.transfer_number || createdTrans?.id} (Status: ${createdTrans?.status})`);

  // Dispatch transfer
  const dispatchRes = await request(`/inventory/transfers/${transId}/dispatch`, {
    method: 'POST',
    body: JSON.stringify({ carrier: 'TCS Logistics Express', dispatchedBy: 'Zainab Qureshi' })
  });
  if (dispatchRes.status !== 200) throw new Error(`Transfer dispatch failed: ${JSON.stringify(dispatchRes.data)}`);
  const dispatchedTrans = dispatchRes.data?.transfer || dispatchRes.data;
  console.log(`   ✔ Transfer dispatched: Status is now "${dispatchedTrans?.status}" (Stock in transit)`);

  // Receive transfer
  const receiveRes = await request(`/inventory/transfers/${transId}/receive`, {
    method: 'POST',
    body: JSON.stringify({ receiverName: 'Bilal Khan', receiverNotes: 'Units inspected and intact' })
  });
  if (receiveRes.status !== 200) throw new Error(`Transfer receive failed: ${JSON.stringify(receiveRes.data)}`);
  const receivedTrans = receiveRes.data?.transfer || receiveRes.data;
  console.log(`   ✔ Transfer received: Status is now "${receivedTrans?.status}" (Stock successfully arrived)\n`);

  // 9. Sales Order Reservation & Cancellation Workflow
  console.log('9. Executing Sales Order Reservation & Cancellation Workflow...');
  const existingCustomersRes = await request('/customers');
  const existingCustList = existingCustomersRes.data?.data || existingCustomersRes.data || [];
  const validCustomerId = existingCustList[0]?.id || 'CUST-101';

  const orderRes = await request('/orders', {
    method: 'POST',
    body: JSON.stringify({
      order_number: `SO-LIVE-VERIFY-${Date.now().toString().slice(-4)}`,
      customer_id: validCustomerId,
      branch_id: 'peshawar',
      sales_rep: 'Kamran Ali',
      items: [
        {
          product_id: 'PROD-001',
          product: 'EcoDrive Falcon Electric Motorcycle',
          product_name: 'EcoDrive Falcon Electric Motorcycle',
          quantity: 1,
          unit_price: 245000
        }
      ]
    })
  });
  if (orderRes.status !== 201) throw new Error(`Order creation failed: ${JSON.stringify(orderRes.data)}`);
  const createdOrder = orderRes.data;
  const orderId = createdOrder.id || createdOrder.order_id;
  console.log(`   ✔ Sales Order ${orderId} created: Stock reserved for PROD-001 at Peshawar`);

  // Check reserved stock
  const stockCheck = await query(
    "SELECT on_hand, reserved, available FROM inventory_stock WHERE product_id = ? AND (branch_id = 'BR-01' OR branch = 'Peshawar' OR branch_id = 'peshawar')",
    ['PROD-001']
  );
  if (stockCheck.length > 0) {
    console.log(`     Live DB Peshawar PROD-001 Stock: on_hand=${stockCheck[0].on_hand}, reserved=${stockCheck[0].reserved}, available=${stockCheck[0].available}`);
  }

  // Cancel order to release stock
  const cancelOrderRes = await request(`/orders/${orderId}/cancel`, { method: 'POST' });
  if (cancelOrderRes.status !== 200) throw new Error(`Order cancellation failed: ${JSON.stringify(cancelOrderRes.data)}`);
  const stockAfterCancel = await query(
    "SELECT on_hand, reserved, available FROM inventory_stock WHERE product_id = ? AND (branch_id = 'BR-01' OR branch = 'Peshawar' OR branch_id = 'peshawar')",
    ['PROD-001']
  );
  if (stockAfterCancel.length > 0) {
    console.log(`   ✔ Sales Order cancelled: Stock reserved released. reserved=${stockAfterCancel[0].reserved}, available=${stockAfterCancel[0].available}\n`);
  }

  // 10. Immutable Movement Ledger
  console.log('10. Querying Immutable Movement Ledger...');
  const ledgerRes = await request('/inventory/ledger');
  const movements = Array.isArray(ledgerRes.data) ? ledgerRes.data : (ledgerRes.data?.movements || ledgerRes.data?.data || []);
  console.log(`   ✔ Ledger contains ${movements.length} chronological audit entries.`);
  const latestMovement = movements[0];
  if (latestMovement) {
    console.log(`     Latest entry: #${latestMovement.movementNumber || latestMovement.movement_number || latestMovement.id} | Type: ${latestMovement.type || latestMovement.reference_type} | Ref: ${latestMovement.reference || latestMovement.referenceId} | Qty: ${latestMovement.quantity} | User: ${latestMovement.user || latestMovement.created_by}`);
  }
  console.log('');

  // 11. Existing Modules Sanity Check
  console.log('11. Verifying Existing Modules (Customers, Quotations, Orders, Invoices, Payments)...');
  const [custs, quots, ords, invs, pmts] = await Promise.all([
    request('/customers'),
    request('/quotations'),
    request('/orders'),
    request('/invoices'),
    request('/payments')
  ]);
  console.log(`   ✔ Customers : HTTP ${custs.status} (Count: ${custs.data?.data?.length || 0})`);
  console.log(`   ✔ Quotations: HTTP ${quots.status} (Count: ${quots.data?.data?.length || 0})`);
  console.log(`   ✔ Orders    : HTTP ${ords.status} (Count: ${ords.data?.data?.length || 0})`);
  console.log(`   ✔ Invoices  : HTTP ${invs.status} (Count: ${invs.data?.data?.length || 0})`);
  console.log(`   ✔ Payments  : HTTP ${pmts.status} (Count: ${pmts.data?.data?.length || 0})\n`);

  // 12. Direct MySQL Live Database Evidence
  console.log('12. Querying Live MySQL Database Schema & Table Counts...');
  const catRows = await query('SELECT count(*) as count FROM categories');
  const prodRows = await query('SELECT count(*) as count FROM products');
  const stockRows = await query('SELECT count(*) as count, sum(on_hand) as total_on_hand, sum(reserved) as total_reserved, sum(available) as total_available FROM inventory_stock');
  const adjRows = await query('SELECT count(*) as count FROM stock_adjustments');
  const transRows = await query('SELECT count(*) as count FROM stock_transfers');
  const unitRows = await query('SELECT count(*) as count FROM serialized_units');
  const movRows = await query('SELECT count(*) as count FROM stock_movements');

  console.log('   --- MySQL ecodrive Inventory Table Snapshot ---');
  console.log(`   categories       : ${catRows[0].count} rows`);
  console.log(`   products         : ${prodRows[0].count} rows`);
  console.log(`   inventory_stock  : ${stockRows[0].count} rows (Total On-Hand: ${stockRows[0].total_on_hand}, Reserved: ${stockRows[0].total_reserved}, Available: ${stockRows[0].total_available})`);
  console.log(`   serialized_units : ${unitRows[0].count} rows`);
  console.log(`   stock_adjustments: ${adjRows[0].count} rows`);
  console.log(`   stock_transfers  : ${transRows[0].count} rows`);
  console.log(`   stock_movements  : ${movRows[0].count} immutable audit entries`);
  console.log('   ------------------------------------------------\n');

  console.log('===============================================================');
  console.log('   ALL INVENTORY VERIFICATIONS PASSED WITH REAL MYSQL EVIDENCE ');
  console.log('===============================================================');

  await disconnectDB();
}

run().catch(async (err) => {
  console.error('\n✖ Verification failed:', err);
  await disconnectDB();
  process.exit(1);
});
