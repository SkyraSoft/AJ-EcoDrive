/**
 * EcoDrive ERP — Comprehensive 4-Module Integration Integrity Audit
 * Modules Audited: Customers, Quotations, Sales Orders, Invoices & Payments
 */

import mysql from 'mysql2/promise';

const API_BASE = 'http://localhost:3000/api/v1';

const DB_CONFIG = {
  host: '127.0.0.1',
  port: 3306,
  user: 'root',
  password: '',
  database: 'ecodrive',
};

async function api(method, path, body = null, headers = {}) {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'x-user-role': 'Super Admin',
      'x-user-branch': 'All',
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const raw = await res.text();
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (e) {
    parsed = raw;
  }
  return { status: res.status, ok: res.ok, data: parsed };
}

function getNum(val, fallback = 0) {
  if (val === undefined || val === null) return fallback;
  if (typeof val === 'number') return val;
  const n = parseFloat(String(val).replace(/[^0-9.-]/g, ''));
  return isNaN(n) ? fallback : n;
}

async function runAudit() {
  const auditReport = {
    checks: [],
    failedChecks: [],
    passedCount: 0,
    failedCount: 0,
  };

  function recordCheck(name, passed, details = {}) {
    if (passed) {
      auditReport.passedCount++;
      auditReport.checks.push({ name, status: 'PASS', details });
      console.log(`[PASS] ${name}`);
    } else {
      auditReport.failedCount++;
      auditReport.failedChecks.push({ name, status: 'FAIL', details });
      console.error(`[FAIL] ${name} ->`, details);
    }
  }

  const db = await mysql.createPool(DB_CONFIG);

  try {
    console.log('\n======================================================');
    console.log('  STARTING ECODRIVE ERP 4-MODULE INTEGRATION AUDIT');
    console.log('======================================================\n');

    // 0. Verify MySQL connection
    const [dbTest] = await db.query('SELECT 1 AS alive');
    recordCheck('MySQL Connection Live', dbTest[0].alive === 1);

    const testTag = Date.now().toString().slice(-4);
    const auditCustId = `AUDIT-CUST-${testTag}`;
    const auditQuoId = `AUDIT-QUO-${testTag}`;
    let createdOrderId = null;
    let createdInvoiceId = null;
    const recordedPaymentIds = [];

    // --- PHASE 1: CUSTOMER MODULE AUDIT ---
    console.log('\n--- Auditing Customer Module ---');
    const custPayload = {
      id: auditCustId,
      name: `Audit Customer ${testTag}`,
      email: `audit.cust.${testTag}@ecodrive.pk`,
      phone: '+92 300 9876543',
      branch_id: 'BR-01',
      branch: 'Peshawar',
      city: 'Peshawar',
      address: 'Industrial Estate Hayatabad',
      customer_type: 'Commercial Fleet',
    };

    const custCreateRes = await api('POST', '/customers', custPayload);
    recordCheck('Customer Creation (API 201)', custCreateRes.status === 201, custCreateRes.data);

    // Verify in MySQL
    const [custRow] = await db.query('SELECT * FROM customers WHERE id = ?', [auditCustId]);
    recordCheck('Customer Real MySQL Persistence', custRow.length === 1 && custRow[0].name === custPayload.name, custRow[0]);

    // Update customer
    const custUpdateRes = await api('PUT', `/customers/${auditCustId}`, { address: 'Plot 45, Phase 4, Hayatabad' });
    const [custRowUpdated] = await db.query('SELECT address FROM customers WHERE id = ?', [auditCustId]);
    recordCheck('Customer Update & MySQL Persistence', custUpdateRes.status === 200 && custRowUpdated[0].address === 'Plot 45, Phase 4, Hayatabad');

    // --- PHASE 2: QUOTATION MODULE AUDIT ---
    console.log('\n--- Auditing Quotation Module ---');
    const quoPayload = {
      id: auditQuoId,
      quotation_number: auditQuoId,
      customer_id: auditCustId,
      customer_name: `Audit Customer ${testTag}`,
      branch_id: 'BR-01',
      branch: 'Peshawar',
      discount: 15000,
      tax: 5000,
      items: [
        {
          product_id: 'PRD-ALPHA-01',
          product: 'EcoDrive Commercial Van 300',
          quantity: 2,
          unit_price: 250000,
        },
      ],
    };

    const quoCreateRes = await api('POST', '/quotations', quoPayload);
    recordCheck('Quotation Creation (API 201)', quoCreateRes.status === 201, quoCreateRes.data);

    // Server-side calculation verification (Subtotal: 2 * 250,000 = 500,000; Total = 500,000 - 15,000 = 485,000)
    const [quoRow] = await db.query('SELECT * FROM quotations WHERE id = ?', [auditQuoId]);
    const quoSubtotal = getNum(quoRow[0]?.subtotal);
    const quoTotal = getNum(quoRow[0]?.total);
    recordCheck('Quotation Server-Side Calculations in MySQL', quoSubtotal === 500000 && quoTotal === 485000, {
      subtotal: quoSubtotal,
      total: quoTotal,
    });

    // Check items table
    const [quoItems] = await db.query('SELECT * FROM quotation_items WHERE quotation_id = ?', [auditQuoId]);
    recordCheck('Quotation Line Items Persisted in MySQL', quoItems.length === 1 && getNum(quoItems[0].subtotal) === 500000);

    // --- PHASE 3: QUOTATION-TO-ORDER ATOMIC CONVERSION ---
    console.log('\n--- Auditing Quotation-to-Order Conversion ---');
    const convertRes = await api('POST', `/quotations/${auditQuoId}/convert-to-order`, {
      deposit: 0,
      salesperson: 'Hamza Ali',
    });
    recordCheck('Quotation-to-Order Conversion API 200/201', convertRes.status === 200 || convertRes.status === 201, convertRes.data);

    createdOrderId = convertRes.data?.data?.order?.id || convertRes.data?.order?.id || convertRes.data?.orderId;
    recordCheck('Converted Order ID Created', Boolean(createdOrderId), { orderId: createdOrderId });

    // Verify quotation status in MySQL is 'Accepted' and order reference is populated
    const [quoAfterConvert] = await db.query('SELECT status, sales_order_id FROM quotations WHERE id = ?', [auditQuoId]);
    recordCheck('Quotation Transitioned to Accepted in MySQL', quoAfterConvert[0]?.status === 'Accepted' && Boolean(quoAfterConvert[0]?.sales_order_id));

    // Verify converted order in MySQL has matching totals (485,000)
    const [orderRow] = await db.query('SELECT * FROM orders WHERE id = ?', [createdOrderId]);
    recordCheck('Order Created with Correct Synchronized Totals in MySQL', orderRow.length === 1 && getNum(orderRow[0].total) === 485000 && getNum(orderRow[0].balance) === 485000, orderRow[0]);

    // Check duplicate conversion rejection (HTTP 409)
    const dupConvertRes = await api('POST', `/quotations/${auditQuoId}/convert-to-order`, {});
    recordCheck('Duplicate Quotation Conversion Rejected with HTTP 409', dupConvertRes.status === 409);

    // --- PHASE 4: INVOICE GENERATION & ORDER LINKING ---
    console.log('\n--- Auditing Invoice Generation ---');
    createdInvoiceId = `AUDIT-INV-${testTag}`;
    const invPayload = {
      id: createdInvoiceId,
      invoice_number: createdInvoiceId,
      order_id: createdOrderId,
      order_number: createdOrderId,
      customer_id: auditCustId,
      customer_name: `Audit Customer ${testTag}`,
      branch_id: 'BR-01',
      branch: 'Peshawar',
      discount: 15000,
      tax: 0,
      items: [
        {
          product_id: 'PRD-ALPHA-01',
          product: 'EcoDrive Commercial Van 300',
          quantity: 2,
          unit_price: 250000,
        },
      ],
    };

    const invCreateRes = await api('POST', '/invoices', invPayload);
    recordCheck('Invoice Creation API 201', invCreateRes.status === 201, invCreateRes.data);

    // Verify invoice row in MySQL
    const [invRow] = await db.query('SELECT * FROM invoices WHERE id = ?', [createdInvoiceId]);
    const invTotal = getNum(invRow[0]?.total);
    const invOutstanding = getNum(invRow[0]?.outstanding_amount);
    const invStatus = invRow[0]?.status;
    recordCheck('Invoice Server-Calculated Totals in MySQL', invTotal === 485000 && invOutstanding === 485000 && invStatus === 'Unpaid', {
      total: invTotal,
      outstanding: invOutstanding,
      status: invStatus,
    });

    // --- PHASE 5: PAYMENTS & ACID TRANSACTION ENGINE ---
    console.log('\n--- Auditing Payments & ACID Transactions ---');

    // 1. Invalid payment validation (amount <= 0)
    const invalidPayRes = await api('POST', `/invoices/${createdInvoiceId}/payments`, { amount: 0 });
    recordCheck('Reject Non-Positive Payment with HTTP 422', invalidPayRes.status === 422);

    // 2. Partial Payment (PKR 200,000 out of 485,000)
    const txnRef1 = `TXN-AUDIT-P1-${testTag}`;
    const partPayRes = await api('POST', `/invoices/${createdInvoiceId}/payments`, {
      amount: 200000,
      payment_method: 'Bank Transfer',
      transaction_ref: txnRef1,
      bank_account: 'Meezan Bank - Commercial PK99',
    });
    recordCheck('Partial Payment Recorded API 201', partPayRes.status === 201);
    if (partPayRes.data?.payment?.id) recordedPaymentIds.push(partPayRes.data.payment.id);

    // Verify MySQL Invoice balances after partial payment
    const [invRowP1] = await db.query('SELECT paid_amount, outstanding_amount, status FROM invoices WHERE id = ?', [createdInvoiceId]);
    recordCheck('Invoice Balance Decreased to 285,000 & Status Partial in MySQL', getNum(invRowP1[0]?.paid_amount) === 200000 && getNum(invRowP1[0]?.outstanding_amount) === 285000 && invRowP1[0]?.status === 'Partial');

    // Verify MySQL Order balances synced
    const [orderRowP1] = await db.query('SELECT paid, balance FROM orders WHERE id = ?', [createdOrderId]);
    recordCheck('Order Paid Increased to 200,000 & Balance Decreased in MySQL', getNum(orderRowP1[0]?.paid) === 200000 && getNum(orderRowP1[0]?.balance) === 285000);

    // 3. Excessive payment rejection (Try paying 350,000 when balance is 285,000)
    const excessivePayRes = await api('POST', `/invoices/${createdInvoiceId}/payments`, {
      amount: 350000,
      payment_method: 'Cash',
      transaction_ref: `TXN-AUDIT-EXCESS-${testTag}`,
    });
    recordCheck('Excessive Payment Rejected with HTTP 400', excessivePayRes.status === 400 && excessivePayRes.data?.error === 'EXCESSIVE_PAYMENT_AMOUNT');

    // 4. Duplicate transaction ref rejection
    const dupPayRes = await api('POST', `/invoices/${createdInvoiceId}/payments`, {
      amount: 50000,
      payment_method: 'Bank Transfer',
      transaction_ref: txnRef1, // Duplicate ref
    });
    recordCheck('Duplicate Transaction Ref Rejected with HTTP 409', dupPayRes.status === 409 && dupPayRes.data?.error === 'DUPLICATE_PAYMENT');

    // 5. Final settlement payment (PKR 285,000)
    const txnRef2 = `TXN-AUDIT-P2-${testTag}`;
    const finalPayRes = await api('POST', `/invoices/${createdInvoiceId}/payments`, {
      amount: 285000,
      payment_method: 'Online Transfer',
      transaction_ref: txnRef2,
      bank_account: 'Bank Alfalah - PK00ALFH00112233',
    });
    recordCheck('Final Settlement Payment Recorded API 201', finalPayRes.status === 201);
    if (finalPayRes.data?.payment?.id) recordedPaymentIds.push(finalPayRes.data.payment.id);

    // Verify invoice is Paid and balance is 0
    const [invRowFinal] = await db.query('SELECT paid_amount, outstanding_amount, status FROM invoices WHERE id = ?', [createdInvoiceId]);
    recordCheck('Invoice Status Paid & Outstanding Balance 0 in MySQL', getNum(invRowFinal[0]?.paid_amount) === 485000 && getNum(invRowFinal[0]?.outstanding_amount) === 0 && invRowFinal[0]?.status === 'Paid');

    // Verify order is Ready and balance is 0
    const [orderRowFinal] = await db.query('SELECT paid, balance, status FROM orders WHERE id = ?', [createdOrderId]);
    recordCheck('Order Status Ready & Balance 0 in MySQL', getNum(orderRowFinal[0]?.paid) === 485000 && getNum(orderRowFinal[0]?.balance) === 0 && orderRowFinal[0]?.status === 'Ready');

    // 6. Attempt deleting invoice with payments (must be rejected HTTP 400)
    const delPaidInvRes = await api('DELETE', `/invoices/${createdInvoiceId}`);
    recordCheck('Reject Deletion of Invoice with Recorded Payments HTTP 400', delPaidInvRes.status === 400 && delPaidInvRes.data?.error === 'CANNOT_DELETE_PAID_INVOICE');

    // 7. Attempt deleting quotation accepted / linked to order (must be rejected HTTP 400)
    const delQuoRes = await api('DELETE', `/quotations/${auditQuoId}`);
    recordCheck('Reject Deletion of Accepted Quotation Linked to Order HTTP 400', delQuoRes.status === 400 && delQuoRes.data?.error === 'CANNOT_DELETE_ACCEPTED_QUOTATION');

    // --- PHASE 6: BRANCH FILTERING & ROLE RULES ---
    console.log('\n--- Auditing Branch Scoping & Authorization ---');
    // Query invoices with Peshawar branch header
    const pshInvoices = await api('GET', '/invoices', null, { 'x-user-branch': 'Peshawar', 'x-user-role': 'Branch Manager' });
    const pshRecordsOnly = pshInvoices.data.every((i) => i.branch === 'Peshawar' || i.branch_id === 'BR-01');
    recordCheck('Branch Scoping Filters Invoices by User Branch', pshInvoices.status === 200 && pshRecordsOnly);

    // Query with non-matching branch Lahore
    const lhrInvoices = await api('GET', '/invoices', null, { 'x-user-branch': 'Lahore', 'x-user-role': 'Branch Manager' });
    const hasAuditPshInvoiceInLhr = lhrInvoices.data.some((i) => i.id === createdInvoiceId);
    recordCheck('Lahore Branch User Cannot See Peshawar Invoices', !hasAuditPshInvoiceInLhr);

    // --- PHASE 7: SERVER RESTART PERSISTENCE AUDIT ---
    console.log('\n--- Auditing Server Restart & State Durability ---');
    // Check direct database values for all 4 entities
    const [finalCust] = await db.query('SELECT id, name FROM customers WHERE id = ?', [auditCustId]);
    const [finalQuo] = await db.query('SELECT id, status, total FROM quotations WHERE id = ?', [auditQuoId]);
    const [finalOrd] = await db.query('SELECT id, status, paid, balance FROM orders WHERE id = ?', [createdOrderId]);
    const [finalInv] = await db.query('SELECT id, status, paid_amount, outstanding_amount FROM invoices WHERE id = ?', [createdInvoiceId]);
    const [finalPays] = await db.query('SELECT id, amount FROM payments WHERE invoice_id = ?', [createdInvoiceId]);

    recordCheck('Durability: All 4 entities exist in MySQL prior to restart',
      finalCust.length === 1 &&
      finalQuo.length === 1 &&
      finalOrd.length === 1 &&
      finalInv.length === 1 &&
      finalPays.length === 2
    );

    // --- PHASE 8: CLEAN UP TEST AUDIT RECORDS ---
    console.log('\n--- Cleaning Up Specific Audit Records ---');
    // Clean up specifically created test entities in reverse dependency order
    await db.query('DELETE FROM payments WHERE invoice_id = ?', [createdInvoiceId]);
    await db.query('DELETE FROM invoice_items WHERE invoice_id = ?', [createdInvoiceId]);
    await db.query('DELETE FROM invoices WHERE id = ?', [createdInvoiceId]);
    await db.query('DELETE FROM order_items WHERE order_id = ?', [createdOrderId]);
    await db.query('DELETE FROM orders WHERE id = ?', [createdOrderId]);
    await db.query('DELETE FROM quotation_items WHERE quotation_id = ?', [auditQuoId]);
    await db.query('DELETE FROM quotations WHERE id = ?', [auditQuoId]);
    await db.query('DELETE FROM customers WHERE id = ?', [auditCustId]);

    // Verify cleanup
    const [checkCleanCust] = await db.query('SELECT id FROM customers WHERE id = ?', [auditCustId]);
    const [checkCleanInv] = await db.query('SELECT id FROM invoices WHERE id = ?', [createdInvoiceId]);
    recordCheck('Audit-Specific Test Rows Cleaned Up Safely', checkCleanCust.length === 0 && checkCleanInv.length === 0);

    // Verify original seed data intact
    const [seedCust] = await db.query('SELECT COUNT(*) AS c FROM customers');
    const [seedQuo] = await db.query('SELECT COUNT(*) AS c FROM quotations');
    const [seedOrd] = await db.query('SELECT COUNT(*) AS c FROM orders');
    const [seedInv] = await db.query('SELECT COUNT(*) AS c FROM invoices');
    const [seedPay] = await db.query('SELECT COUNT(*) AS c FROM payments');
    recordCheck('Existing Non-Test Seed Data Preserved Intact',
      seedCust[0].c >= 7 &&
      seedQuo[0].c >= 4 &&
      seedOrd[0].c >= 10 &&
      seedInv[0].c >= 5 &&
      seedPay[0].c >= 7,
      {
        customers: seedCust[0].c,
        quotations: seedQuo[0].c,
        orders: seedOrd[0].c,
        invoices: seedInv[0].c,
        payments: seedPay[0].c,
      }
    );

    console.log('\n======================================================');
    console.log(`  AUDIT COMPLETE: ${auditReport.passedCount} PASSED, ${auditReport.failedCount} FAILED`);
    console.log('======================================================\n');

    return auditReport;
  } finally {
    await db.end();
  }
}

runAudit()
  .then((report) => {
    if (report.failedCount > 0) {
      console.error('Audit failed with errors:', report.failedChecks);
      process.exitCode = 1;
    } else {
      console.log('All audit checks PASSED successfully!');
    }
  })
  .catch((err) => {
    console.error('Audit execution error:', err);
    process.exitCode = 1;
  });
