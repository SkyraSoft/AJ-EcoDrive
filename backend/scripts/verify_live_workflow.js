/**
 * EcoDrive ERP - Live E2E Workflow Verification Script
 * Tests:
 * 1. Create a sales order
 * 2. Generate its invoice
 * 3. Record a partial payment
 * 4. Verify the invoice balance decreases correctly and status becomes 'Partial'
 * 5. Record the remaining payment
 * 6. Verify the invoice becomes 'Paid' and order balance becomes 0
 */

const API_BASE = 'http://localhost:3000/api/v1';

async function request(method, path, body = null, headers = {}) {
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
  return { status: res.status, data: parsed };
}

function extractEntity(data) {
  if (!data) return null;
  if (data.data) return data.data;
  return data;
}

function getNumeric(val, fallback = 0) {
  if (val === undefined || val === null) return fallback;
  if (typeof val === 'number') return val;
  const num = parseFloat(String(val).replace(/[^0-9.-]/g, ''));
  return isNaN(num) ? fallback : num;
}

async function run() {
  console.log('=== Starting EcoDrive ERP Live E2E Workflow Test ===\n');

  // Step 1: Create Sales Order with Net Total 280,000
  const orderPayload = {
    order_number: 'ORD-LIVE-' + Math.floor(1000 + Math.random() * 9000),
    customer_id: 'CUST-101',
    customer_name: 'Ahsan Khan',
    branch_id: 'BR-01',
    branch: 'Peshawar',
    product: 'EcoDrive Cargo Pro 2026',
    discount: 20000,
    salesperson: 'Hamza Ali',
    items: [
      {
        product: 'EcoDrive Cargo Pro 2026',
        item_name: 'EcoDrive Cargo Pro 2026',
        quantity: 1,
        unitPrice: 300000,
        discount: 20000,
        total_price: 280000,
      },
    ],
  };

  console.log('1. Creating Sales Order...');
  const orderRes = await request('POST', '/orders', orderPayload);
  if (orderRes.status !== 201) {
    throw new Error(`Failed to create order: ${JSON.stringify(orderRes.data)}`);
  }
  const order = extractEntity(orderRes.data);
  const orderTotal = getNumeric(order.rawTotal ?? order.total);
  const orderBalance = getNumeric(order.rawBalance ?? order.balance);
  console.log(`   Order created: ID = ${order.id}, Total = PKR ${orderTotal}, Balance = PKR ${orderBalance}`);

  if (orderTotal !== 280000 || orderBalance !== 280000) {
    throw new Error(`Unexpected order amounts: Total=${orderTotal}, Balance=${orderBalance}`);
  }

  // Step 2: Generate Invoice for Sales Order
  const invoicePayload = {
    invoice_number: 'INV-LIVE-' + Math.floor(1000 + Math.random() * 9000),
    order_id: order.id,
    order_number: order.order_number || order.orderNumber || order.id,
    customer_id: 'CUST-101',
    customer_name: 'Ahsan Khan',
    branch_id: 'BR-01',
    branch: 'Peshawar',
    subtotal: 300000,
    discount: 20000,
    tax: 0,
    items: [
      {
        product: 'EcoDrive Cargo Pro 2026',
        item_name: 'EcoDrive Cargo Pro 2026',
        quantity: 1,
        unit_price: 300000,
        discount: 20000,
        total: 280000,
      },
    ],
  };

  console.log('\n2. Generating Invoice for Sales Order...');
  const invRes = await request('POST', '/invoices', invoicePayload);
  if (invRes.status !== 201) {
    throw new Error(`Failed to generate invoice: ${JSON.stringify(invRes.data)}`);
  }
  const invoice = extractEntity(invRes.data);
  const invTotal = getNumeric(invoice.rawTotal ?? invoice.total);
  const invPaid = getNumeric(invoice.rawPaid ?? invoice.paid_amount);
  const invOutstanding = getNumeric(invoice.rawBalance ?? invoice.outstanding_amount);

  console.log(`   Invoice generated: ID = ${invoice.id}, Number = ${invoice.invoice_number || invoice.invoiceNo}`);
  console.log(`   Invoice Total = PKR ${invTotal}, Paid = PKR ${invPaid}, Outstanding = PKR ${invOutstanding}`);
  console.log(`   Invoice Status = ${invoice.status}`);

  if (invTotal !== 280000) {
    throw new Error(`Unexpected invoice total: ${invTotal}`);
  }
  if (invOutstanding !== 280000) {
    throw new Error(`Unexpected invoice outstanding balance: ${invOutstanding}`);
  }

  // Step 3: Record Partial Payment (PKR 100,000)
  console.log('\n3. Recording Partial Payment of PKR 100,000...');
  const partialPaymentPayload = {
    amount: 100000,
    payment_method: 'Bank Transfer',
    transaction_ref: 'TXN-PARTIAL-' + Date.now(),
    bank_account: 'Meezan Bank - PK00MEZN0012345678',
    notes: 'Partial advance payment for Cargo Pro',
  };

  const partPayRes = await request('POST', `/invoices/${invoice.id}/payments`, partialPaymentPayload);
  if (partPayRes.status !== 201) {
    throw new Error(`Failed to record partial payment: ${JSON.stringify(partPayRes.data)}`);
  }
  const partPayData = partPayRes.data;
  const p1InvPaid = getNumeric(partPayData.invoice.paid_amount ?? partPayData.invoice.rawPaid);
  const p1InvBal = getNumeric(partPayData.invoice.outstanding_amount ?? partPayData.invoice.rawBalance);
  console.log(`   Payment Recorded: ID = ${partPayData.payment.id}, Amount = PKR ${partPayData.payment.amount}`);
  console.log(`   Updated Invoice Paid = PKR ${p1InvPaid}, Balance = PKR ${p1InvBal}`);
  console.log(`   Updated Invoice Status = ${partPayData.invoice.status}`);

  // Step 4: Verify Invoice Balance & Order Balance after Partial Payment
  console.log('\n4. Verifying Invoice & Order Status after Partial Payment...');
  const invVerify1 = await request('GET', `/invoices/${invoice.id}`);
  const v1 = extractEntity(invVerify1.data);
  const v1Bal = getNumeric(v1.rawBalance ?? v1.outstandingAmount ?? v1.outstanding_amount);
  console.log(`   GET /invoices/${invoice.id} => Outstanding = PKR ${v1Bal}, Status = ${v1.status}`);
  if (v1Bal !== 180000) {
    throw new Error(`Invoice balance is not 180,000! Received: ${v1Bal}`);
  }
  if (v1.status !== 'Partial') {
    throw new Error(`Invoice status is not 'Partial'! Received: ${v1.status}`);
  }

  const ordVerify1 = await request('GET', `/orders/${order.id}`);
  const o1 = extractEntity(ordVerify1.data);
  const o1Paid = getNumeric(o1.rawPaid ?? o1.paid);
  const o1Bal = getNumeric(o1.rawBalance ?? o1.balance);
  console.log(`   GET /orders/${order.id} => Paid = PKR ${o1Paid}, Balance = PKR ${o1Bal}`);
  if (o1Paid !== 100000) {
    throw new Error(`Order paid is not 100,000! Received: ${o1Paid}`);
  }
  if (o1Bal !== 180000) {
    throw new Error(`Order balance is not 180,000! Received: ${o1Bal}`);
  }

  // Step 5: Record Remaining Payment (PKR 180,000)
  console.log('\n5. Recording Remaining Payment of PKR 180,000...');
  const finalPaymentPayload = {
    amount: 180000,
    payment_method: 'Bank Transfer',
    transaction_ref: 'TXN-FINAL-' + Date.now(),
    bank_account: 'Meezan Bank - PK00MEZN0012345678',
    notes: 'Final settlement payment for Cargo Pro',
  };

  const finalPayRes = await request('POST', `/invoices/${invoice.id}/payments`, finalPaymentPayload);
  if (finalPayRes.status !== 201) {
    throw new Error(`Failed to record final payment: ${JSON.stringify(finalPayRes.data)}`);
  }
  const finalPayData = finalPayRes.data;
  const p2InvPaid = getNumeric(finalPayData.invoice.paid_amount ?? finalPayData.invoice.rawPaid);
  const p2InvBal = getNumeric(finalPayData.invoice.outstanding_amount ?? finalPayData.invoice.rawBalance);
  console.log(`   Final Payment Recorded: ID = ${finalPayData.payment.id}, Amount = PKR ${finalPayData.payment.amount}`);
  console.log(`   Updated Invoice Paid = PKR ${p2InvPaid}, Balance = PKR ${p2InvBal}`);
  console.log(`   Updated Invoice Status = ${finalPayData.invoice.status}`);

  // Step 6: Verify Invoice Becomes 'Paid' and Order Balance is 0
  console.log('\n6. Verifying Invoice Becomes "Paid" and Order Balance is 0...');
  const invVerify2 = await request('GET', `/invoices/${invoice.id}`);
  const v2 = extractEntity(invVerify2.data);
  const v2Bal = getNumeric(v2.rawBalance ?? v2.outstandingAmount ?? v2.outstanding_amount);
  console.log(`   GET /invoices/${invoice.id} => Outstanding = PKR ${v2Bal}, Status = ${v2.status}`);
  if (v2Bal !== 0) {
    throw new Error(`Invoice balance is not 0! Received: ${v2Bal}`);
  }
  if (v2.status !== 'Paid') {
    throw new Error(`Invoice status is not 'Paid'! Received: ${v2.status}`);
  }

  const ordVerify2 = await request('GET', `/orders/${order.id}`);
  const o2 = extractEntity(ordVerify2.data);
  const o2Paid = getNumeric(o2.rawPaid ?? o2.paid);
  const o2Bal = getNumeric(o2.rawBalance ?? o2.balance);
  console.log(`   GET /orders/${order.id} => Paid = PKR ${o2Paid}, Balance = PKR ${o2Bal}, Status = ${o2.status}`);
  if (o2Bal !== 0) {
    throw new Error(`Order balance is not 0! Received: ${o2Bal}`);
  }
  if (o2Paid !== 280000) {
    throw new Error(`Order paid is not 280,000! Received: ${o2Paid}`);
  }
  if (o2.status !== 'Ready') {
    throw new Error(`Order status is not 'Ready'! Received: ${o2.status}`);
  }

  // Step 7: Check Payments list
  console.log('\n7. Checking Payment History for Invoice...');
  const payListRes = await request('GET', `/payments?invoice_id=${invoice.id}`);
  const payments = Array.isArray(payListRes.data) ? payListRes.data : payListRes.data.data;
  console.log(`   Payments linked to ${invoice.id}: count = ${payments.length}`);
  payments.forEach((p, idx) => {
    console.log(`   - Payment ${idx + 1}: ${p.paymentNo || p.id} | Amount: ${p.amount} | Ref: ${p.transactionRef || p.transaction_ref} | Status: ${p.status}`);
  });
  if (payments.length !== 2) {
    throw new Error(`Expected 2 payments, found ${payments.length}`);
  }

  console.log('\n>>> All Live Workflow steps PASSED successfully! <<<');
  return {
    orderId: order.id,
    invoiceId: invoice.id,
    paymentIds: payments.map((p) => p.id),
  };
}

run()
  .then((res) => {
    console.log('\nSaved records for verification:', JSON.stringify(res, null, 2));
  })
  .catch((err) => {
    console.error('\nWorkflow Test Failed:', err);
    process.exit(1);
  });
