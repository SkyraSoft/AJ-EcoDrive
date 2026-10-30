/**
 * Master Business Logic Verification Suite (Real Database & RBAC)
 * Tests:
 * 1. Branch Scoping & Multi-Tenant Isolation (Super Admin vs Peshawar vs Lahore)
 * 2. Order, Delivery Handover, Return, and Stock Request Lifecycle & Status Updates
 * 3. Inventory Quantities, Cycle Counts, Quarantine, and Stock Adjustments (Non-destructive)
 * 4. Validation, Duplicate Submissions, Error Payloads (422, 409, 401, 403)
 * 5. RBAC & Unauthorized Privilege Escalation Guardrails
 */
import assert from 'node:assert';
import request from 'supertest';
import { app } from '../backend/src/app.js';
import { getPool } from '../backend/src/db/index.js';

async function runBusinessLogicVerification() {
  console.log('========================================================================');
  console.log('  AJ ECODRIVE ERP — COMPREHENSIVE BUSINESS LOGIC VERIFICATION SUITE');
  console.log('========================================================================\n');

  const pool = getPool();
  const results = [];

  function record(point, title, passed, detail) {
    results.push({ point, title, passed, detail });
    const tag = passed ? '[PASS]' : '[FAIL]';
    console.log(`${tag} Point ${point}: ${title} — ${detail}`);
  }

  // --- Step 0: Obtain Authentication Tokens ---
  console.log('--- 0. Authenticating Personas for Multi-Tenant Testing ---');
  const adminRes = await request(app).post('/api/v1/auth/login').send({ username: 'admin', password: 'password123' });
  const adminToken = adminRes.body.token;
  assert.ok(adminToken, 'Admin token required');

  const pewRes = await request(app).post('/api/v1/auth/login').send({ username: 'pew-01', password: 'password123' });
  const pewToken = pewRes.body.token;
  assert.ok(pewToken, 'Peshawar token required');

  const lheRes = await request(app).post('/api/v1/auth/login').send({ username: 'lhe-01', password: 'password123' });
  const lheToken = lheRes.body.token;
  assert.ok(lheToken, 'Lahore token required');

  console.log('Tokens acquired: Super Admin, Peshawar Manager (BR-01), Lahore Manager (BR-03).\n');

  // --- Point 3: Branch Scoping & Multi-Tenant Isolation ---
  console.log('--- Point 3: Multi-Tenant Branch Scoping & Isolation ---');
  try {
    // 3.1 Peshawar user creates a lead scoped to Peshawar (BR-01)
    const leadRes = await request(app)
      .post('/api/v1/leads')
      .set('Authorization', `Bearer ${pewToken}`)
      .send({
        customer_name: 'BizTest Peshawar Customer',
        phone: '+92-300-9998811',
        email: 'biztest.pew@example.com',
        branch_id: 'BR-01',
        product_name: 'BRG E-Scooter Alpha',
        stage: 'New'
      });
    const leadId = leadRes.body.lead?.id || leadRes.body.id;
    assert.strictEqual(leadRes.status, 201);

    // 3.2 Lahore user queries leads: Peshawar lead must NOT appear
    const lheLeadsRes = await request(app)
      .get('/api/v1/leads')
      .set('Authorization', `Bearer ${lheToken}`);
    const lheLeads = lheLeadsRes.body.leads || lheLeadsRes.body.items || lheLeadsRes.body.data || [];
    const leakedInLahore = lheLeads.some(l => l.customer_name === 'BizTest Peshawar Customer' || l.id === leadId);
    assert.strictEqual(leakedInLahore, false, 'Lahore user must NOT see Peshawar branch lead');

    // 3.3 Super Admin queries leads: Super Admin MUST be able to see Peshawar lead
    const adminLeadsRes = await request(app)
      .get('/api/v1/leads')
      .set('Authorization', `Bearer ${adminToken}`);
    const adminLeads = adminLeadsRes.body.leads || adminLeadsRes.body.items || adminLeadsRes.body.data || [];
    const foundInAdmin = adminLeads.some(l => l.customer_name === 'BizTest Peshawar Customer' || l.id === leadId);
    assert.strictEqual(foundInAdmin, true, 'Super Admin MUST see leads across all branches');

    // 3.4 Lahore manager attempts to create procurement PO for Peshawar: MUST be rejected with 403 Forbidden
    const crossBranchPoRes = await request(app)
      .post('/api/v1/procurement/purchase-orders')
      .set('Authorization', `Bearer ${lheToken}`)
      .send({
        po_number: 'PO-FORBIDDEN-001',
        branch_id: 'BR-01', // Peshawar branch
        supplier_id: 'SUP-001',
        items: [{ product_id: 'PRD-001', product_name: 'BRG Alpha', quantity_ordered: 2, unit_cost: 150000 }]
      });
    assert.strictEqual(crossBranchPoRes.status, 403, 'Cross-branch creation by branch manager must return 403');

    // Cleanup lead
    if (leadId) {
      await pool.query('DELETE FROM leads WHERE id = ? OR customer_name = ?', [leadId, 'BizTest Peshawar Customer']);
    }

    record('3.1', 'Branch Isolation on Query Filtering', true, 'Lahore manager cannot see Peshawar records; Super Admin sees all.');
    record('3.2', 'Cross-Branch Creation Enforcement', true, 'Lahore manager rejected with HTTP 403 when posting to Peshawar.');
  } catch (err) {
    record('3', 'Branch Scoping & Multi-Tenant Isolation', false, err.message);
  }

  // --- Point 4: Lifecycle & Status Update Continuity (Order -> Delivery -> Return -> Stock Request) ---
  console.log('\n--- Point 4: Cross-Entity Lifecycle & Status Progression ---');
  try {
    const testOrderId = 'ORD-BIZ-TEST-' + Math.floor(1000 + Math.random() * 9000);
    const testVin = 'VIN-BIZ-' + Math.floor(1000 + Math.random() * 9000);

    // 4.1 Create Order
    const orderRes = await request(app)
      .post('/api/v1/orders')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        id: testOrderId,
        order_number: testOrderId,
        customer_name: 'BizTest Lifecycle Customer',
        phone: '+92-300-1122334',
        branch_id: 'BR-01',
        subtotal: 200000,
        total: 200000,
        paid: 50000,
        balance: 150000,
        status: 'Pending',
        items: [{ product_name: 'BRG Falcon', quantity: 1, unit_price: 200000, total_price: 200000 }]
      });
    assert.ok(orderRes.status === 201 || orderRes.status === 200, `Order create failed with ${orderRes.status}`);

    // Verify order in MySQL
    const [orderRows] = await pool.query('SELECT status FROM orders WHERE id = ?', [testOrderId]);
    assert.strictEqual(orderRows[0].status, 'Pending');

    // 4.2 Create Delivery Handover linked to Order
    const delId = 'DEL-BIZ-' + Math.floor(1000 + Math.random() * 9000);
    const delRes = await request(app)
      .post('/api/v1/deliveries')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        id: delId,
        order_id: testOrderId,
        customer: 'BizTest Lifecycle Customer',
        unit: testVin,
        scheduled: '2026-11-05',
        officer: 'Sardar Officer',
        identity_verified: true,
        branch_id: 'BR-01',
        status: 'Scheduled'
      });
    assert.strictEqual(delRes.status, 201);

    // 4.3 Complete Delivery Handover -> Updates Delivery Handover status to Delivered
    const compDelRes = await request(app)
      .post(`/api/v1/deliveries/${delId}/complete`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ notes: 'Handover complete and verified in person' });
    assert.strictEqual(compDelRes.status, 200);

    const [delRows] = await pool.query('SELECT status, identity_verified FROM delivery_handovers WHERE id = ?', [delId]);
    assert.strictEqual(delRows[0].status, 'Delivered');
    assert.strictEqual(delRows[0].identity_verified, 1);

    // 4.4 Create Sales Return for Order -> Updates return status
    const retId = 'RET-BIZ-' + Math.floor(1000 + Math.random() * 9000);
    const retRes = await request(app)
      .post('/api/v1/sales-returns')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        id: retId,
        order_no: testOrderId,
        customer: 'BizTest Lifecycle Customer',
        unit: testVin,
        reason: 'Minor cosmetic blemish',
        refund_amount: 50000,
        branch_id: 'BR-01',
        status: 'Pending Approval'
      });
    assert.strictEqual(retRes.status, 201);

    // Approve / Complete Return
    const updateRetRes = await request(app)
      .put(`/api/v1/sales-returns/${retId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'Completed', notes: 'Inspection passed, refund issued' });
    assert.strictEqual(updateRetRes.status, 200);

    const [retRows] = await pool.query('SELECT status, refund_amount FROM sales_returns WHERE id = ?', [retId]);
    assert.strictEqual(retRows[0].status, 'Completed');
    assert.strictEqual(Number(retRows[0].refund_amount), 50000);

    // 4.5 Create Stock Request & Update Status to Approved
    const srId = 'SR-BIZ-' + Math.floor(1000 + Math.random() * 9000);
    const srRes = await request(app)
      .post('/api/v1/inventory/stock-requests')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        id: srId,
        product: 'BRG Falcon',
        branch_id: 'BR-01',
        qty: 3,
        urgency: 'High',
        status: 'Pending',
        notes: 'High demand replacement unit'
      });
    assert.strictEqual(srRes.status, 201);

    const updateSrRes = await request(app)
      .put(`/api/v1/inventory/stock-requests/${srId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'Approved', notes: 'Approved by regional inventory head' });
    assert.strictEqual(updateSrRes.status, 200);

    const [srRows] = await pool.query('SELECT status, qty FROM stock_requests WHERE id = ?', [srId]);
    assert.strictEqual(srRows[0].status, 'Approved');
    assert.strictEqual(Number(srRows[0].qty), 3);

    // Clean up isolated test data
    await pool.query('DELETE FROM stock_requests WHERE id = ?', [srId]);
    await pool.query('DELETE FROM sales_returns WHERE id = ?', [retId]);
    await pool.query('DELETE FROM delivery_handovers WHERE id = ?', [delId]);
    await pool.query('DELETE FROM order_items WHERE order_id = ?', [testOrderId]);
    await pool.query('DELETE FROM orders WHERE id = ?', [testOrderId]);

    record('4.1', 'Order to Delivery Handover Status Transition', true, 'Handover completed and marked Delivered in MySQL.');
    record('4.2', 'Sales Return Linked Status Transition', true, 'Return created for order and transitioned to Completed with refund.');
    record('4.3', 'Stock Request Lifecycle', true, 'Stock request created as Pending and approved via PUT API in MySQL.');
  } catch (err) {
    record('4', 'Lifecycle & Status Progression', false, err.message);
  }

  // --- Point 5: Inventory Quantities, Cycle Counts, Quarantine, Adjustments (Non-destructive) ---
  console.log('\n--- Point 5: Inventory Quantities, Cycle Counts & Quarantine ---');
  try {
    // 5.1 Check current inventory baseline for product PRD-001 in BR-01
    const [invRows] = await pool.query(
      'SELECT quantity_on_hand, reserved_quantity, available_quantity FROM inventory_stock WHERE product_id = ? AND branch_id = ?',
      ['PRD-001', 'BR-01']
    );
    const initialOnHand = invRows.length > 0 ? Number(invRows[0].quantity_on_hand) : 10;

    // Apply Stock Adjustment (+2 units)
    const adjRes = await request(app)
      .post('/api/v1/inventory/adjustments')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        product_id: 'PRD-001',
        branch_id: 'BR-01',
        adjustment_type: 'increase',
        new_quantity: initialOnHand + 2,
        reason: 'Physical count discrepancy test audit',
        notes: 'Automated business logic verification'
      });
    assert.strictEqual(adjRes.status, 201);
    const adjId = adjRes.body.adjustment?.id || adjRes.body.id;

    // Verify stock increased by 2
    const [invUpdated] = await pool.query(
      'SELECT quantity_on_hand FROM inventory_stock WHERE product_id = ? AND branch_id = ?',
      ['PRD-001', 'BR-01']
    );
    assert.strictEqual(Number(invUpdated[0].quantity_on_hand), initialOnHand + 2);

    // Revert adjustment (-2 units) to protect real business data baseline
    const revertRes = await request(app)
      .post('/api/v1/inventory/adjustments')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        product_id: 'PRD-001',
        branch_id: 'BR-01',
        adjustment_type: 'decrease',
        new_quantity: initialOnHand,
        reason: 'Reverting test audit adjustment',
        notes: 'Restoring original business data'
      });
    assert.strictEqual(revertRes.status, 201);
    const revertId = revertRes.body.adjustment?.id || revertRes.body.id;

    // Verify restored stock
    const [invRestored] = await pool.query(
      'SELECT quantity_on_hand FROM inventory_stock WHERE product_id = ? AND branch_id = ?',
      ['PRD-001', 'BR-01']
    );
    assert.strictEqual(Number(invRestored[0].quantity_on_hand), initialOnHand);

    // Clean up adjustment ledger records
    if (adjId) await pool.query('DELETE FROM stock_adjustments WHERE id = ?', [adjId]);
    if (revertId) await pool.query('DELETE FROM stock_adjustments WHERE id = ?', [revertId]);

    // 5.2 Create Cycle Count and Complete it
    const ccId = 'CC-BIZ-' + Math.floor(1000 + Math.random() * 9000);
    const ccRes = await request(app)
      .post('/api/v1/inventory/cycle-counts')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        id: ccId,
        session: ccId,
        name: 'BizTest Cycle Count Session',
        category: 'Electric Scooters',
        branch_id: 'BR-01',
        scheduled_date: '2026-11-10',
        auditor: 'Senior Auditor Tariq',
        notes: 'Cycle count verification test',
        status: 'Scheduled'
      });
    assert.strictEqual(ccRes.status, 201);

    const updateCcRes = await request(app)
      .put(`/api/v1/inventory/cycle-counts/${ccId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'Completed', counted: '25 units', variance: '0' });
    assert.strictEqual(updateCcRes.status, 200);

    const [ccRows] = await pool.query('SELECT status, counted FROM cycle_counts WHERE id = ?', [ccId]);
    assert.strictEqual(ccRows[0].status, 'Completed');
    assert.strictEqual(ccRows[0].counted, '25 units');

    // 5.3 Create Quarantine Record and Resolve it
    const qrId = 'QR-BIZ-' + Math.floor(1000 + Math.random() * 9000);
    const qrRes = await request(app)
      .post('/api/v1/inventory/quarantine')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        id: qrId,
        unit: 'VIN-TEST-DEFECT-01',
        product: 'BRG DS11',
        defect_type: 'Brake Sensor Calibration Error',
        severity: 'Moderate',
        inspector: 'Inspector Farhan',
        status: 'Quarantined',
        branch_id: 'BR-01'
      });
    assert.strictEqual(qrRes.status, 201);

    const updateQrRes = await request(app)
      .put(`/api/v1/inventory/quarantine/${qrId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'Released', decision: 'Sensor recalibrated and certified safe' });
    assert.strictEqual(updateQrRes.status, 200);

    const [qrRows] = await pool.query('SELECT status, decision FROM quarantine_records WHERE id = ?', [qrId]);
    assert.strictEqual(qrRows[0].status, 'Released');
    assert.strictEqual(qrRows[0].decision, 'Sensor recalibrated and certified safe');

    // Cleanup test CC and Quarantine
    await pool.query('DELETE FROM cycle_counts WHERE id = ?', [ccId]);
    await pool.query('DELETE FROM quarantine_records WHERE id = ?', [qrId]);

    record('5.1', 'Stock Adjustment Calculation & Non-Destructive Reversibility', true, 'Stock increased and reverted cleanly; baseline unaltered.');
    record('5.2', 'Cycle Count Lifecycle Persistence', true, 'Cycle count created, counted units recorded, marked Completed.');
    record('5.3', 'Quarantine Record Lifecycle Persistence', true, 'Quarantine record created, disposition decision saved, marked Released.');
  } catch (err) {
    record('5', 'Inventory Governance & Protection', false, err.message);
  }

  // --- Point 6: Validation, Duplicate Submissions & Error Responses ---
  console.log('\n--- Point 6: Validation, Duplicate Submissions & Error Handling ---');
  try {
    // 6.1 Missing required fields on Customer creation: MUST return HTTP 422
    const emptyCustRes = await request(app)
      .post('/api/v1/customers')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({});
    assert.strictEqual(emptyCustRes.status, 422, 'Empty customer payload must return 422');
    assert.ok(emptyCustRes.body.errors || emptyCustRes.body.message, 'Must provide validation errors');

    // 6.2 Missing required fields on Purchase Order: MUST return HTTP 422
    const emptyPoRes = await request(app)
      .post('/api/v1/procurement/purchase-orders')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ po_number: 'PO-INVALID-EMPTY' });
    assert.strictEqual(emptyPoRes.status, 422, 'PO without supplier or items must return 422');

    // 6.3 Duplicate User creation (username collision): MUST return HTTP 409 Conflict
    const dupUserRes = await request(app)
      .post('/api/v1/organisation/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        username: 'admin', // already exists
        email: 'another_admin@example.com',
        password: 'password123',
        name: 'Imposter Admin',
        role_id: 'ROL-01',
        branch_id: 'BR-01'
      });
    assert.strictEqual(dupUserRes.status, 409, 'Duplicate username must return 409 Conflict');

    // 6.4 Duplicate Supplier Code collision: MUST return HTTP 409 or 422
    const dupSupRes = await request(app)
      .post('/api/v1/procurement/suppliers')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        code: 'SUP-001', // already exists
        name: 'Duplicate Supplier Inc',
        phone: '+92-300-0000000'
      });
    assert.ok(dupSupRes.status === 409 || dupSupRes.status === 422, 'Duplicate supplier code must return 409 or 422');

    record('6.1', 'Required-Field Validation Enforcement (HTTP 422)', true, 'Missing customer/PO fields rejected with HTTP 422 and error details.');
    record('6.2', 'Duplicate Submission Rejection (HTTP 409)', true, 'Duplicate username/supplier code rejected with 409 Conflict.');
  } catch (err) {
    record('6', 'Validation & Error Handling', false, err.message);
  }

  // --- Point 7: Role Permissions (RBAC) & Unauthorized Escalation Guardrails ---
  console.log('\n--- Point 7: Role Permissions & Privilege Escalation Guardrails ---');
  try {
    // 7.1 Unauthenticated Request: MUST return HTTP 401
    const unauthRes = await request(app).get('/api/v1/organisation/users');
    assert.strictEqual(unauthRes.status, 401, 'Request without token must return 401');

    // 7.2 Branch Manager attempting to create a new branch: MUST return HTTP 403 Forbidden
    const branchCreateByBm = await request(app)
      .post('/api/v1/organisation/branches')
      .set('Authorization', `Bearer ${pewToken}`)
      .send({
        code: 'HACK-01',
        name: 'Unauthorized Branch',
        city: 'Forbidden City'
      });
    assert.strictEqual(branchCreateByBm.status, 403, 'Branch creation by Branch Manager must return 403');

    // 7.3 Branch Manager attempting to create a new system role: MUST return HTTP 403 Forbidden
    const roleCreateByBm = await request(app)
      .post('/api/v1/organisation/roles')
      .set('Authorization', `Bearer ${pewToken}`)
      .send({
        name: 'Super Super Admin',
        description: 'Escalated privileges'
      });
    assert.strictEqual(roleCreateByBm.status, 403, 'Role creation by Branch Manager must return 403');

    // 7.4 Super Admin permitted to view organisation branches
    const superAdminBranchRes = await request(app)
      .get('/api/v1/organisation/branches')
      .set('Authorization', `Bearer ${adminToken}`);
    assert.strictEqual(superAdminBranchRes.status, 200);

    record('7.1', 'Unauthenticated Access Prevention (HTTP 401)', true, 'Missing token rejected with 401.');
    record('7.2', 'Branch Manager Privilege Escalation Block (HTTP 403)', true, 'Branch creation and role creation rejected with 403 Forbidden.');
    record('7.3', 'Super Admin Privilege Authorization (HTTP 200)', true, 'Authorized Super Admin allowed access to enterprise resources.');
  } catch (err) {
    record('7', 'Role Permissions & Privilege Escalation', false, err.message);
  }

  console.log('\n========================================================================');
  console.log(`  VERIFICATION RESULTS: ${results.filter(r => r.passed).length} / ${results.length} PASSED`);
  console.log('========================================================================');

  return results;
}

runBusinessLogicVerification()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('Fatal test runner error:', err);
    process.exit(1);
  });
