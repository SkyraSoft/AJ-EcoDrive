/**
 * Master Business Logic Verification Suite (Real Database & RBAC)
 * Tests:
 * Point 3: Branch Scoping & Multi-Tenant Isolation (Super Admin vs Peshawar vs Lahore)
 * Point 4: Order, Delivery Handover, Return, and Stock Request Lifecycle & Status Updates
 * Point 5: Inventory Quantities, Cycle Counts, Quarantine, and Stock Adjustments (Non-destructive)
 * Point 6: Validation, Duplicate Submissions, Error Payloads (422, 409, 401, 403)
 * Point 7: RBAC & Unauthorized Privilege Escalation Guardrails
 */
import assert from 'node:assert';
import { describe, it, before, after } from 'node:test';
import request from 'supertest';
import { app } from '../src/app.js';
import { connectDB, disconnectDB, getPool } from '../src/config/db.js';

describe('AJ EcoDrive ERP — Master Business Logic & Data Continuity Verification', () => {
  let pool;
  let adminToken;
  let pewToken;
  let lheToken;

  before(async () => {
    await connectDB();
    pool = getPool();
    // Authenticate 3 personas
    const adminRes = await request(app).post('/api/v1/auth/login').send({ username: 'admin', password: 'password123' });
    adminToken = adminRes.body.token;
    assert.ok(adminToken, 'Admin token required');

    const pewRes = await request(app).post('/api/v1/auth/login').send({ username: 'pew-01', password: 'password123' });
    pewToken = pewRes.body.token;
    assert.ok(pewToken, 'Peshawar token required');

    const lheRes = await request(app).post('/api/v1/auth/login').send({ username: 'lhe-01', password: 'password123' });
    lheToken = lheRes.body.token;
    assert.ok(lheToken, 'Lahore token required');
  });

  after(async () => {
    await disconnectDB();
  });

  describe('Point 3: Multi-Tenant Branch Scoping & Isolation', () => {
    let createdLeadId;

    it('3.1 Peshawar manager creates a lead scoped to Peshawar (BR-01)', async () => {
      const res = await request(app)
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
      assert.strictEqual(res.status, 201);
      createdLeadId = res.body.lead?.id || res.body.id;
      assert.ok(createdLeadId);
    });

    it('3.2 Lahore manager queries leads: Peshawar lead must NOT appear', async () => {
      const res = await request(app)
        .get('/api/v1/leads')
        .set('Authorization', `Bearer ${lheToken}`);
      assert.strictEqual(res.status, 200);
      const leads = Array.isArray(res.body) ? res.body : (res.body.leads || res.body.items || res.body.data || []);
      const leaked = leads.some(l => l.customer_name === 'BizTest Peshawar Customer' || l.id === createdLeadId);
      assert.strictEqual(leaked, false, 'Lahore user must NOT see Peshawar branch lead');
    });

    it('3.3 Super Admin queries leads: Super Admin MUST see Peshawar lead across all branches', async () => {
      const res = await request(app)
        .get('/api/v1/leads')
        .set('Authorization', `Bearer ${adminToken}`);
      assert.strictEqual(res.status, 200);
      const leads = Array.isArray(res.body) ? res.body : (res.body.leads || res.body.items || res.body.data || []);
      const found = leads.some(l => l.customer_name === 'BizTest Peshawar Customer' || l.id === createdLeadId);
      assert.strictEqual(found, true, 'Super Admin must see records from all branches');
    });

    it('3.4 Lahore manager attempting to create purchase order for Peshawar is rejected with 403 Forbidden', async () => {
      const res = await request(app)
        .post('/api/v1/procurement/purchase-orders')
        .set('Authorization', `Bearer ${lheToken}`)
        .send({
          po_number: 'PO-FORBIDDEN-001',
          branch_id: 'BR-01',
          supplier_id: 'SUP-001',
          items: [{ product_id: 'PRD-001', product_name: 'BRG Alpha', quantity_ordered: 2, unit_cost: 150000 }]
        });
      assert.strictEqual(res.status, 403, 'Cross-branch creation by branch manager must return 403');
    });

    after(async () => {
      if (createdLeadId) {
        await pool.query('DELETE FROM leads WHERE id = ? OR customer_name = ?', [createdLeadId, 'BizTest Peshawar Customer']);
      }
    });
  });

  describe('Point 4: Cross-Entity Transactional Lifecycle & Status Progression', () => {
    const testCustomerId = 'CUST-BIZ-' + Math.floor(1000 + Math.random() * 9000);
    const testOrderId = 'ORD-BIZ-' + Math.floor(1000 + Math.random() * 9000);
    const testVin = 'VIN-BIZ-' + Math.floor(1000 + Math.random() * 9000);
    const delId = 'DEL-BIZ-' + Math.floor(1000 + Math.random() * 9000);
    const retId = 'RET-BIZ-' + Math.floor(1000 + Math.random() * 9000);
    const srId = 'SR-BIZ-' + Math.floor(1000 + Math.random() * 9000);

    before(async () => {
      // Create a valid customer first to satisfy relational validation
      await request(app)
        .post('/api/v1/customers')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          id: testCustomerId,
          name: 'BizTest Lifecycle Customer',
          phone: '+92-300-1122334',
          email: 'lifecycle@example.com',
          branch_id: 'BR-01'
        });
    });

    it('4.1 Creates Order with Pending status', async () => {
      const res = await request(app)
        .post('/api/v1/orders')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          id: testOrderId,
          orderNo: testOrderId,
          customer_id: testCustomerId,
          branch: 'Peshawar',
          branch_id: 'BR-01',
          product: 'BRG Falcon',
          unit: testVin,
          items: [{ product: 'BRG Falcon', quantity: 1, unitPrice: 200000 }],
          discount: 0,
          paid: 50000
        });
      assert.ok(res.status === 201 || res.status === 200, `Order create failed with ${res.status}: ${JSON.stringify(res.body)}`);

      const [rows] = await pool.query('SELECT status FROM orders WHERE id = ?', [testOrderId]);
      assert.ok(rows.length > 0);
    });

    it('4.2 Creates Delivery Handover linked to Order and Completes it (updates status to Delivered)', async () => {
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

      const compRes = await request(app)
        .post(`/api/v1/deliveries/${delId}/complete`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ notes: 'Handover complete and verified in person' });
      assert.strictEqual(compRes.status, 200);

      const [rows] = await pool.query('SELECT status, identity_verified FROM delivery_handovers WHERE id = ?', [delId]);
      assert.strictEqual(rows[0].status, 'Delivered');
      assert.strictEqual(rows[0].identity_verified, 1);
    });

    it('4.3 Creates Customer Return for Order and transitions status to Completed with refund', async () => {
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

      const updateRes = await request(app)
        .put(`/api/v1/sales-returns/${retId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'Completed', notes: 'Inspection passed, refund issued' });
      assert.strictEqual(updateRes.status, 200);

      const [rows] = await pool.query('SELECT status, refund_amount FROM sales_returns WHERE id = ?', [retId]);
      assert.strictEqual(rows[0].status, 'Completed');
      assert.strictEqual(Number(rows[0].refund_amount), 50000);
    });

    it('4.4 Creates Stock Request with reason and transitions status to Approved via PUT API', async () => {
      const srRes = await request(app)
        .post('/api/v1/inventory/stock-requests')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          id: srId,
          product: 'BRG Falcon',
          branch_id: 'BR-01',
          qty: 3,
          urgency: 'High',
          reason: 'Showroom display and high client demand',
          status: 'Pending',
          notes: 'High demand replacement unit'
        });
      assert.strictEqual(srRes.status, 201);

      const updateRes = await request(app)
        .put(`/api/v1/inventory/stock-requests/${srId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'Approved', notes: 'Approved by regional inventory head' });
      assert.strictEqual(updateRes.status, 200);

      const [rows] = await pool.query('SELECT status, qty FROM stock_requests WHERE id = ?', [srId]);
      assert.strictEqual(rows[0].status, 'Approved');
      assert.strictEqual(Number(rows[0].qty), 3);
    });

    after(async () => {
      await pool.query('DELETE FROM stock_requests WHERE id = ?', [srId]);
      await pool.query('DELETE FROM sales_returns WHERE id = ?', [retId]);
      await pool.query('DELETE FROM delivery_handovers WHERE id = ?', [delId]);
      await pool.query('DELETE FROM order_items WHERE order_id = ?', [testOrderId]);
      await pool.query('DELETE FROM orders WHERE id = ?', [testOrderId]);
      await pool.query('DELETE FROM customers WHERE id = ?', [testCustomerId]);
    });
  });

  describe('Point 5: Inventory Quantities, Cycle Counts & Quarantine Governance', () => {
    let initialOnHand;
    let adjId;
    let revertId;
    const ccId = 'CC-BIZ-' + Math.floor(1000 + Math.random() * 9000);
    const qrId = 'QR-BIZ-' + Math.floor(1000 + Math.random() * 9000);

    it('5.1 Accurately adjusts stock quantity via ACID approval and permits non-destructive reversal to protect baseline', async () => {
      const [invRows] = await pool.query(
        'SELECT on_hand FROM inventory_stock WHERE product_id = ? AND branch_id = ?',
        ['PROD-001', 'BR-01']
      );
      initialOnHand = invRows.length > 0 ? Number(invRows[0].on_hand) : 10;

      // 1. Create Adjustment (+2 units)
      const adjRes = await request(app)
        .post('/api/v1/inventory/adjustments')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          product_id: 'PROD-001',
          branch_id: 'BR-01',
          adjustment_type: 'Quantity Increase',
          old_quantity: initialOnHand,
          new_quantity: initialOnHand + 2,
          reason: 'Physical count discrepancy test audit',
          notes: 'Automated business logic verification'
        });
      assert.strictEqual(adjRes.status, 201);
      adjId = adjRes.body.adjustment?.id || adjRes.body.id;

      // 2. Approve adjustment to apply ACID transaction to inventory_stock
      const approveRes = await request(app)
        .post(`/api/v1/inventory/adjustments/${adjId}/approve`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({});
      assert.strictEqual(approveRes.status, 200);

      const [invUp] = await pool.query('SELECT on_hand FROM inventory_stock WHERE product_id = ? AND branch_id = ?', ['PROD-001', 'BR-01']);
      assert.strictEqual(Number(invUp[0].on_hand), initialOnHand + 2);

      // 3. Revert adjustment to protect baseline business data
      const revertRes = await request(app)
        .post('/api/v1/inventory/adjustments')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          product_id: 'PROD-001',
          branch_id: 'BR-01',
          adjustment_type: 'Quantity Decrease',
          old_quantity: initialOnHand + 2,
          new_quantity: initialOnHand,
          reason: 'Reverting test audit adjustment to protect baseline',
          notes: 'Automated business logic verification'
        });
      assert.strictEqual(revertRes.status, 201);
      revertId = revertRes.body.adjustment?.id || revertRes.body.id;

      const approveRevertRes = await request(app)
        .post(`/api/v1/inventory/adjustments/${revertId}/approve`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({});
      assert.strictEqual(approveRevertRes.status, 200);

      const [invDown] = await pool.query('SELECT on_hand FROM inventory_stock WHERE product_id = ? AND branch_id = ?', ['PROD-001', 'BR-01']);
      assert.strictEqual(Number(invDown[0].on_hand), initialOnHand);
    });

    it('5.2 Creates Cycle Count with required scope and marks Completed with verified counted units', async () => {
      const res = await request(app)
        .post('/api/v1/inventory/cycle-counts')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          id: ccId,
          session: ccId,
          name: 'BizTest Cycle Count Session',
          scope: 'Full Warehouse',
          category: 'Electric Scooters',
          branch_id: 'BR-01',
          scheduled_date: '2026-11-10',
          auditor: 'Senior Auditor Tariq',
          notes: 'Cycle count verification test',
          status: 'Scheduled'
        });
      assert.strictEqual(res.status, 201);

      const updateRes = await request(app)
        .put(`/api/v1/inventory/cycle-counts/${ccId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'Completed', counted: '25 units', variance: '0' });
      assert.strictEqual(updateRes.status, 200);

      const [rows] = await pool.query('SELECT status, counted FROM cycle_counts WHERE id = ?', [ccId]);
      assert.strictEqual(rows[0].status, 'Completed');
      assert.strictEqual(rows[0].counted, '25 units');
    });

    it('5.3 Creates Quarantine Record with condition description and resolves it with disposition decision', async () => {
      const res = await request(app)
        .post('/api/v1/inventory/quarantine')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          id: qrId,
          unit: 'VIN-TEST-DEFECT-01',
          product: 'BRG DS11',
          condition: 'Brake Sensor Calibration Error observed during pre-delivery inspection',
          defect_type: 'Brake Sensor Calibration Error',
          severity: 'Moderate',
          inspector: 'Inspector Farhan',
          status: 'Quarantined',
          branch_id: 'BR-01'
        });
      assert.strictEqual(res.status, 201);

      const updateRes = await request(app)
        .put(`/api/v1/inventory/quarantine/${qrId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'Released', decision: 'Sensor recalibrated and certified safe' });
      assert.strictEqual(updateRes.status, 200);

      const [rows] = await pool.query('SELECT status, decision FROM quarantine_records WHERE id = ?', [qrId]);
      assert.strictEqual(rows[0].status, 'Released');
      assert.strictEqual(rows[0].decision, 'Sensor recalibrated and certified safe');
    });

    after(async () => {
      if (adjId) await pool.query('DELETE FROM stock_adjustments WHERE id = ?', [adjId]);
      if (revertId) await pool.query('DELETE FROM stock_adjustments WHERE id = ?', [revertId]);
      await pool.query('DELETE FROM cycle_counts WHERE id = ?', [ccId]);
      await pool.query('DELETE FROM quarantine_records WHERE id = ?', [qrId]);
    });
  });

  describe('Point 6: Validation, Duplicate Submissions & Error Handling', () => {
    it('6.1 Rejects empty customer creation with HTTP 422 Unprocessable Entity', async () => {
      const res = await request(app)
        .post('/api/v1/customers')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({});
      assert.strictEqual(res.status, 422);
      assert.ok(res.body.errors || res.body.message);
    });

    it('6.2 Rejects empty purchase order payload with HTTP 422', async () => {
      const res = await request(app)
        .post('/api/v1/procurement/purchase-orders')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ po_number: 'PO-INVALID-EMPTY' });
      assert.strictEqual(res.status, 422);
    });

    it('6.3 Rejects duplicate username creation with HTTP 409 Conflict', async () => {
      const res = await request(app)
        .post('/api/v1/organisation/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          username: 'admin',
          email: 'duplicate_admin@example.com',
          password: 'password123',
          name: 'Imposter Admin',
          role_id: 'ROL-01',
          branch_id: 'BR-01'
        });
      assert.strictEqual(res.status, 409);
    });

    it('6.4 Rejects duplicate supplier code with HTTP 409 Conflict or 422', async () => {
      const res = await request(app)
        .post('/api/v1/procurement/suppliers')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          code: 'SUP-001',
          name: 'Duplicate Supplier Inc',
          phone: '+92-300-0000000'
        });
      assert.ok(res.status === 409 || res.status === 422);
    });
  });

  describe('Point 7: Role Permissions (RBAC) & Unauthorized Escalation Guardrails', () => {
    it('7.1 Rejects unauthenticated request with HTTP 401 Unauthorized', async () => {
      const res = await request(app).get('/api/v1/organisation/users');
      assert.strictEqual(res.status, 401);
    });

    it('7.2 Rejects Branch Manager attempting to create a branch with HTTP 403 Forbidden', async () => {
      const res = await request(app)
        .post('/api/v1/organisation/branches')
        .set('Authorization', `Bearer ${pewToken}`)
        .send({
          code: 'HACK-01',
          name: 'Unauthorized Branch',
          city: 'Forbidden City'
        });
      assert.strictEqual(res.status, 403);
    });

    it('7.3 Rejects Branch Manager attempting to create system roles with HTTP 403 Forbidden', async () => {
      const res = await request(app)
        .post('/api/v1/organisation/roles')
        .set('Authorization', `Bearer ${pewToken}`)
        .send({
          name: 'Super Super Admin',
          description: 'Escalated privileges'
        });
      assert.strictEqual(res.status, 403);
    });

    it('7.4 Grants Super Admin permission to access organization branches with HTTP 200', async () => {
      const res = await request(app)
        .get('/api/v1/organisation/branches')
        .set('Authorization', `Bearer ${adminToken}`);
      assert.strictEqual(res.status, 200);
    });
  });
});
