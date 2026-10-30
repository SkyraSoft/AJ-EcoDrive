const path = require('path');
const mysql = require(path.resolve(__dirname, '../backend/node_modules/mysql2/promise'));
const { generateToken } = require(path.resolve(__dirname, '../backend/src/utils/token.js'));

const DB_CONFIG = {
  host: '127.0.0.1',
  port: 3306,
  user: 'root',
  password: '',
  database: 'ecodrive'
};

async function testApiPersistence() {
  console.log('--- TESTING API & DB PERSISTENCE FOR TRANSFERS, ADJUSTMENTS & PURCHASE RETURNS ---');
  const conn = await mysql.createConnection(DB_CONFIG);

  // Generate Admin Token
  const token = generateToken({
    id: 'USR-ADMIN',
    username: 'admin',
    role: 'Super Admin',
    branch_id: null,
    isSuperAdmin: true
  });

  const authHeader = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  // Helper for fetch
  async function apiPost(endpoint, body) {
    const res = await fetch(`http://localhost:3000/api/v1${endpoint}`, {
      method: 'POST',
      headers: authHeader,
      body: JSON.stringify(body)
    });
    const text = await res.text();
    let data;
    try { data = JSON.parse(text); } catch(e) { data = text; }
    return { status: res.status, data };
  }

  // 1. Test Stock Transfer
  console.log('\n[1] Testing POST /api/v1/inventory/transfers');
  const transferPayload = {
    from_branch_id: 'BR-01',
    to_branch_id: 'BR-02',
    carrier: 'TCS Logistics Express',
    notes: 'Audit Inter-branch Transfer Test',
    items: [
      { product_id: 'PROD-001', quantity: 2 }
    ]
  };
  const transRes = await apiPost('/inventory/transfers', transferPayload);
  console.log('Transfer Response status:', transRes.status, 'body:', transRes.data);

  let createdTransferId = transRes.data?.data?.id || transRes.data?.id;
  if (createdTransferId) {
    const [tRows] = await conn.execute('SELECT * FROM stock_transfers WHERE id = ?', [createdTransferId]);
    console.log('[DB Assertion] stock_transfers row in MySQL:', tRows.length > 0 ? tRows[0] : 'NOT FOUND');
    await conn.execute('DELETE FROM stock_transfer_items WHERE transfer_id = ?', [createdTransferId]);
    await conn.execute('DELETE FROM stock_transfers WHERE id = ?', [createdTransferId]);
    console.log('[Cleanup] Transfer test record cleaned up.');
  }

  // 2. Test Stock Adjustment
  console.log('\n[2] Testing POST /api/v1/inventory/adjustments');
  const adjPayload = {
    branch_id: 'BR-01',
    product_id: 'PROD-001',
    adjustment_type: 'Damaged in Showroom',
    new_quantity: 8,
    reason: 'Handlebar scratch during showcase inspection',
    notes: 'Audit Adjustment Test'
  };
  const adjRes = await apiPost('/inventory/adjustments', adjPayload);
  console.log('Adjustment Response status:', adjRes.status, 'body:', adjRes.data);

  let createdAdjId = adjRes.data?.data?.id || adjRes.data?.id;
  if (createdAdjId) {
    const [aRows] = await conn.execute('SELECT * FROM stock_adjustments WHERE id = ?', [createdAdjId]);
    console.log('[DB Assertion] stock_adjustments row in MySQL:', aRows.length > 0 ? aRows[0] : 'NOT FOUND');
    await conn.execute('DELETE FROM stock_adjustments WHERE id = ?', [createdAdjId]);
    console.log('[Cleanup] Adjustment test record cleaned up.');
  }

  // 3. Test Purchase Return
  console.log('\n[3] Testing POST /api/v1/procurement/purchase-returns');
  const retPayload = {
    supplier_id: 'SUP-01',
    po_id: 'PO-1001',
    branch_id: 'BR-01',
    reason: 'Faulty BMS controller module on batch receipt',
    items: [
      { product_id: 'PROD-001', quantity: 1, unit_credit_amount: 150000 }
    ],
    notes: 'Audit Purchase Return Test'
  };
  const retRes = await apiPost('/procurement/purchase-returns', retPayload);
  console.log('Purchase Return Response status:', retRes.status, 'body:', retRes.data);

  let createdRetId = retRes.data?.data?.id || retRes.data?.id;
  if (createdRetId) {
    const [rRows] = await conn.execute('SELECT * FROM purchase_returns WHERE id = ?', [createdRetId]);
    console.log('[DB Assertion] purchase_returns row in MySQL:', rRows.length > 0 ? rRows[0] : 'NOT FOUND');
    await conn.execute('DELETE FROM purchase_return_items WHERE return_id = ?', [createdRetId]);
    await conn.execute('DELETE FROM purchase_returns WHERE id = ?', [createdRetId]);
    console.log('[Cleanup] Purchase return test record cleaned up.');
  }

  await conn.end();
  console.log('\n--- VERIFICATION EXECUTION COMPLETE ---');
}

testApiPersistence().catch(console.error);
