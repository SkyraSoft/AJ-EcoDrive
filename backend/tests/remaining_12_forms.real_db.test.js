import { describe, it, before, after } from 'node:test'
import assert from 'node:assert'
import request from 'supertest'
import { app } from '../src/app.js'
import { connectDB, disconnectDB, query } from '../src/config/db.js'
import { getAdminAuthHeader } from './helpers/auth.helper.js'

describe('AJ EcoDrive Backend — Remaining 12 Forms Real Database Integration Suite', () => {
  let isDbReady = false
  const adminHeaders = getAdminAuthHeader()

  // Track created test record IDs for safe cleanup
  const cleanups = {
    customOrderIds: [],
    deliveryIds: [],
    salesReturnIds: [],
    priceRuleIds: [],
    productRequestIds: [],
    cycleCountIds: [],
    quarantineIds: [],
    stockRequestIds: [],
    conversationIds: [],
    customReportIds: []
  }

  before(async () => {
    isDbReady = await connectDB()
    assert.strictEqual(isDbReady, true, 'Database connection pool must be ready')

    // Clean up any stale test fixtures from prior runs
    await query('DELETE FROM `custom_orders` WHERE `order_no` LIKE "CO-TEST-%" OR `customer` LIKE "%Test%"')
    await query('DELETE FROM `delivery_handovers` WHERE `order_id` LIKE "%TEST-%" OR `customer` LIKE "%Test%"')
    await query('DELETE FROM `sales_returns` WHERE `return_no` LIKE "RET-TEST-%" OR `customer` LIKE "%Test%"')
    await query('DELETE FROM `price_rules` WHERE `reason` LIKE "%Test%" OR `product` LIKE "%Test%"')
    await query('DELETE FROM `product_requests` WHERE `product_name` LIKE "%Test%" OR `reason` LIKE "%Test%"')
    await query('DELETE FROM `cycle_counts` WHERE `name` LIKE "%Test%" OR `notes` LIKE "%Test%"')
    await query('DELETE FROM `quarantine_records` WHERE `unit` LIKE "VIN-TEST-%" OR `unit` LIKE "VIN-DEF-%"')
    await query('DELETE FROM `stock_requests` WHERE `reason` LIKE "%Test%" OR `product` LIKE "%Test%"')
    await query('DELETE FROM `conversations` WHERE `title` LIKE "%Test%"')
    await query('DELETE FROM `custom_reports` WHERE `name` LIKE "%Test%"')
  })

  after(async () => {
    if (isDbReady) {
      for (const id of cleanups.customOrderIds) {
        await query('DELETE FROM `custom_orders` WHERE `id` = ?', [id])
      }
      for (const id of cleanups.deliveryIds) {
        await query('DELETE FROM `delivery_handovers` WHERE `id` = ?', [id])
      }
      for (const id of cleanups.salesReturnIds) {
        await query('DELETE FROM `sales_returns` WHERE `id` = ?', [id])
      }
      for (const id of cleanups.priceRuleIds) {
        await query('DELETE FROM `price_rules` WHERE `id` = ?', [id])
      }
      for (const id of cleanups.productRequestIds) {
        await query('DELETE FROM `product_requests` WHERE `id` = ?', [id])
      }
      for (const id of cleanups.cycleCountIds) {
        await query('DELETE FROM `cycle_counts` WHERE `id` = ?', [id])
      }
      for (const id of cleanups.quarantineIds) {
        await query('DELETE FROM `quarantine_records` WHERE `id` = ?', [id])
      }
      for (const id of cleanups.stockRequestIds) {
        await query('DELETE FROM `stock_requests` WHERE `id` = ?', [id])
      }
      for (const id of cleanups.conversationIds) {
        await query('DELETE FROM `conversation_messages` WHERE `conversation_id` = ?', [id])
        await query('DELETE FROM `conversations` WHERE `id` = ?', [id])
      }
      for (const id of cleanups.customReportIds) {
        await query('DELETE FROM `custom_reports` WHERE `id` = ?', [id])
      }
    }
  })

  // ==========================================================================
  // Form 1: FRM-CRM-08 — Custom Order
  // ==========================================================================
  describe('Form 1 (FRM-CRM-08): Custom Order Database Persistence', () => {
    let orderId = null

    it('1.1 Should persist a new custom order to MySQL table `custom_orders`', async () => {
      const payload = {
        orderNo: 'CO-TEST-8801',
        customer: 'Sardar Test Khan',
        product: 'BRG DS11 Cargo Special',
        budget: '185,000',
        deposit: '50,000',
        desiredDate: '2026-11-20',
        paymentMethod: 'Bank Transfer',
        reservation: 'On arrival',
        notes: 'Dual battery pack requested for commercial delivery',
        status: 'Sourcing',
        branch: 'Peshawar',
        branch_id: 'BR-01'
      }

      const res = await request(app)
        .post('/api/v1/custom-orders')
        .set(adminHeaders)
        .send(payload)

      assert.strictEqual(res.status, 201, `Expected 201, got ${res.status}: ${JSON.stringify(res.body)}`)
      assert.strictEqual(res.body.ok, true)
      assert.ok(res.body.data.id)
      orderId = res.body.data.id
      cleanups.customOrderIds.push(orderId)

      // Direct MySQL Read-back Verification
      const rows = await query('SELECT * FROM `custom_orders` WHERE `id` = ?', [orderId])
      assert.strictEqual(rows.length, 1, 'Row must exist in `custom_orders`')
      assert.strictEqual(rows[0].customer, 'Sardar Test Khan')
      assert.strictEqual(rows[0].product, 'BRG DS11 Cargo Special')
      assert.strictEqual(rows[0].deposit, '50,000')
      assert.strictEqual(rows[0].status, 'Sourcing')
      assert.strictEqual(rows[0].branch_id, 'BR-01')
    })

    it('1.2 Should fetch and read the persisted custom order via GET API', async () => {
      assert.ok(orderId)
      const res = await request(app)
        .get(`/api/v1/custom-orders/${orderId}`)
        .set(adminHeaders)

      assert.strictEqual(res.status, 200)
      assert.strictEqual(res.body.ok, true)
      assert.strictEqual(res.body.data.customer, 'Sardar Test Khan')
      assert.strictEqual(res.body.data.deposit, '50,000')
    })

    it('1.3 Should update custom order status and deposit in MySQL', async () => {
      assert.ok(orderId)
      const updatePayload = {
        status: 'Production',
        deposit: '65,000',
        notes: 'Deposit verified by finance; dispatched to manufacturing'
      }

      const res = await request(app)
        .put(`/api/v1/custom-orders/${orderId}`)
        .set(adminHeaders)
        .send(updatePayload)

      assert.strictEqual(res.status, 200)
      assert.strictEqual(res.body.data.status, 'Production')

      // Direct MySQL Read-back
      const rows = await query('SELECT status, deposit, notes FROM `custom_orders` WHERE `id` = ?', [orderId])
      assert.strictEqual(rows[0].status, 'Production')
      assert.strictEqual(rows[0].deposit, '65,000')
    })

    it('1.4 Should delete isolated test custom order from MySQL', async () => {
      assert.ok(orderId)
      const res = await request(app)
        .delete(`/api/v1/custom-orders/${orderId}`)
        .set(adminHeaders)

      assert.strictEqual(res.status, 200)

      // Confirm deletion in MySQL
      const rows = await query('SELECT id FROM `custom_orders` WHERE `id` = ?', [orderId])
      assert.strictEqual(rows.length, 0, 'Record must be removed from MySQL')
    })
  })

  // ==========================================================================
  // Form 2: FRM-CRM-09 — Delivery Handover
  // ==========================================================================
  describe('Form 2 (FRM-CRM-09): Delivery Handover Database Persistence', () => {
    let deliveryId = null

    it('2.1 Should persist a new delivery handover to MySQL table `delivery_handovers`', async () => {
      const payload = {
        delivery_id: 'DEL-TEST-9901',
        order: 'ORD-TEST-9901',
        order_id: 'ORD-TEST-9901',
        customer: 'Ali Test Raza',
        unit: 'VIN-TEST-8801',
        scheduled: 'Tomorrow 3:00 PM',
        officer: 'Hamza Khan',
        branch: 'Peshawar',
        branch_id: 'BR-01',
        identityVerified: true,
        paymentComplete: true,
        chassisVerified: true,
        accessoriesIncluded: true,
        warrantyBriefed: true,
        notes: 'Comprehensive pre-delivery checklist confirmed'
      }

      const res = await request(app)
        .post('/api/v1/deliveries')
        .set(adminHeaders)
        .send(payload)

      assert.strictEqual(res.status, 201)
      assert.strictEqual(res.body.ok, true)
      assert.ok(res.body.data.id)
      deliveryId = res.body.data.id
      cleanups.deliveryIds.push(deliveryId)

      // Direct MySQL Read-back Verification
      const rows = await query('SELECT * FROM `delivery_handovers` WHERE `id` = ?', [deliveryId])
      assert.strictEqual(rows.length, 1)
      assert.strictEqual(rows[0].customer, 'Ali Test Raza')
      assert.strictEqual(rows[0].unit, 'VIN-TEST-8801')
      assert.strictEqual(Number(rows[0].identity_verified), 1)
      assert.strictEqual(Number(rows[0].payment_complete), 1)
      assert.strictEqual(Number(rows[0].chassis_verified), 1)
    })

    it('2.2 Should fetch and read the persisted delivery handover via GET API', async () => {
      assert.ok(deliveryId)
      const res = await request(app)
        .get(`/api/v1/deliveries/${deliveryId}`)
        .set(adminHeaders)

      assert.strictEqual(res.status, 200)
      assert.strictEqual(res.body.data.customer, 'Ali Test Raza')
      assert.strictEqual(res.body.data.unit, 'VIN-TEST-8801')
    })

    it('2.3 Should complete delivery handover and update status to Delivered in MySQL', async () => {
      assert.ok(deliveryId)
      const res = await request(app)
        .post(`/api/v1/deliveries/${deliveryId}/complete`)
        .set(adminHeaders)
        .send({ notes: 'Handover complete. Keys, warranty booklet, and charger delivered.' })

      assert.strictEqual(res.status, 200)
      assert.strictEqual(res.body.data.status, 'Delivered')

      // Direct MySQL Read-back
      const rows = await query('SELECT status FROM `delivery_handovers` WHERE `id` = ?', [deliveryId])
      assert.strictEqual(rows[0].status, 'Delivered')
    })

    it('2.4 Should delete isolated test delivery handover from MySQL', async () => {
      assert.ok(deliveryId)
      const res = await request(app)
        .delete(`/api/v1/deliveries/${deliveryId}`)
        .set(adminHeaders)

      assert.strictEqual(res.status, 200)
      const rows = await query('SELECT id FROM `delivery_handovers` WHERE `id` = ?', [deliveryId])
      assert.strictEqual(rows.length, 0)
    })
  })

  // ==========================================================================
  // Form 3: FRM-CRM-10 — Sales Return / Customer Return
  // ==========================================================================
  describe('Form 3 (FRM-CRM-10): Sales Return Database Persistence', () => {
    let returnId = null

    it('3.1 Should persist a new customer return to MySQL table `sales_returns`', async () => {
      const payload = {
        returnNo: 'RET-TEST-7701',
        order: 'ORD-TEST-9902',
        customer: 'Fatima Test Bibi',
        unit: 'VIN-TEST-8802',
        reason: 'Performance Issue',
        requested: 'Exchange',
        refundAmount: 18000,
        status: 'Inspection',
        branch: 'Peshawar',
        branch_id: 'BR-01',
        notes: 'Range drop under load; customer requests battery diagnostics'
      }

      const res = await request(app)
        .post('/api/v1/sales-returns')
        .set(adminHeaders)
        .send(payload)

      assert.strictEqual(res.status, 201)
      assert.strictEqual(res.body.ok, true)
      assert.ok(res.body.data.id)
      returnId = res.body.data.id
      cleanups.salesReturnIds.push(returnId)

      // Direct MySQL Read-back Verification
      const rows = await query('SELECT * FROM `sales_returns` WHERE `id` = ?', [returnId])
      assert.strictEqual(rows.length, 1)
      assert.strictEqual(rows[0].customer, 'Fatima Test Bibi')
      assert.strictEqual(rows[0].reason, 'Performance Issue')
      assert.strictEqual(rows[0].unit, 'VIN-TEST-8802')
      assert.strictEqual(Number(rows[0].refund_amount), 18000)
    })

    it('3.2 Should update sales return record to Completed status in MySQL', async () => {
      assert.ok(returnId)
      const res = await request(app)
        .put(`/api/v1/sales-returns/${returnId}`)
        .set(adminHeaders)
        .send({ status: 'Completed', notes: 'Replacement unit issued and verified' })

      assert.strictEqual(res.status, 200)
      assert.strictEqual(res.body.data.status, 'Completed')

      // Direct MySQL Read-back
      const rows = await query('SELECT status FROM `sales_returns` WHERE `id` = ?', [returnId])
      assert.strictEqual(rows[0].status, 'Completed')
    })

    it('3.3 Should delete isolated test sales return record from MySQL', async () => {
      assert.ok(returnId)
      const res = await request(app)
        .delete(`/api/v1/sales-returns/${returnId}`)
        .set(adminHeaders)

      assert.strictEqual(res.status, 200)
      const rows = await query('SELECT id FROM `sales_returns` WHERE `id` = ?', [returnId])
      assert.strictEqual(rows.length, 0)
    })
  })

  // ==========================================================================
  // Form 4 & 5: FRM-CAT-04 & FRM-CAT-05 — Create & Edit Price Rule
  // ==========================================================================
  describe('Forms 4 & 5 (FRM-CAT-04, FRM-CAT-05): Price Rules Persistence', () => {
    let ruleId = null

    it('4.1 (FRM-CAT-04) Should persist a new price rule to MySQL table `price_rules`', async () => {
      const payload = {
        product: 'BRG DS11 Test Edition',
        branchOverride: 'Peshawar',
        effective: '2026-11-01',
        sellingPrice: '165K',
        minimum: '155K',
        landedCostRef: '130K',
        markup: '26.9%',
        margin: '21.2%',
        reason: 'Test promotional campaign for showroom launch',
        status: 'Active'
      }

      const res = await request(app)
        .post('/api/v1/catalogue/pricing-rules')
        .set(adminHeaders)
        .send(payload)

      assert.strictEqual(res.status, 201)
      assert.strictEqual(res.body.ok, true)
      assert.ok(res.body.data.id)
      ruleId = res.body.data.id
      cleanups.priceRuleIds.push(ruleId)

      // Direct MySQL Read-back Verification
      const rows = await query('SELECT * FROM `price_rules` WHERE `id` = ?', [ruleId])
      assert.strictEqual(rows.length, 1)
      assert.strictEqual(rows[0].product, 'BRG DS11 Test Edition')
      assert.strictEqual(rows[0].selling_price, '165K')
      assert.strictEqual(rows[0].minimum, '155K')
      assert.strictEqual(rows[0].branch_override, 'Peshawar')
    })

    it('5.1 (FRM-CAT-05) Should update price rule thresholds and margin in MySQL', async () => {
      assert.ok(ruleId)
      const updatePayload = {
        sellingPrice: '160K',
        minimum: '150K',
        margin: '18.7%',
        reason: 'Revised competitor pricing match'
      }

      const res = await request(app)
        .put(`/api/v1/catalogue/pricing-rules/${ruleId}`)
        .set(adminHeaders)
        .send(updatePayload)

      assert.strictEqual(res.status, 200)
      assert.strictEqual(res.body.data.sellingPrice, '160K')

      // Direct MySQL Read-back
      const rows = await query('SELECT selling_price, minimum, margin FROM `price_rules` WHERE `id` = ?', [ruleId])
      assert.strictEqual(rows[0].selling_price, '160K')
      assert.strictEqual(rows[0].minimum, '150K')
    })

    it('5.2 Should delete isolated test price rule from MySQL', async () => {
      assert.ok(ruleId)
      const res = await request(app)
        .delete(`/api/v1/catalogue/pricing-rules/${ruleId}`)
        .set(adminHeaders)

      assert.strictEqual(res.status, 200)
      const rows = await query('SELECT id FROM `price_rules` WHERE `id` = ?', [ruleId])
      assert.strictEqual(rows.length, 0)
    })
  })

  // ==========================================================================
  // Form 6: FRM-CAT-06 — Product Request
  // ==========================================================================
  describe('Form 6 (FRM-CAT-06): Product Request Database Persistence', () => {
    let reqId = null

    it('6.1 Should persist a new product request to MySQL table `product_requests`', async () => {
      const payload = {
        productName: 'BRG Test EcoCarrier Heavy',
        category: 'Cargo',
        specifications: '72V 50Ah LiFePO4, 3000W High Torque',
        reference: 'Fleet transport contract demand',
        customerDemand: 'High',
        urgency: 'High',
        quantity: 5,
        reason: 'Corporate logistics courier customer inquiry',
        branch: 'Peshawar',
        branch_id: 'BR-01'
      }

      const res = await request(app)
        .post('/api/v1/catalogue/product-requests')
        .set(adminHeaders)
        .send(payload)

      assert.strictEqual(res.status, 201)
      assert.strictEqual(res.body.ok, true)
      assert.ok(res.body.data.id)
      reqId = res.body.data.id
      cleanups.productRequestIds.push(reqId)

      // Direct MySQL Read-back Verification
      const rows = await query('SELECT * FROM `product_requests` WHERE `id` = ?', [reqId])
      assert.strictEqual(rows.length, 1)
      assert.strictEqual(rows[0].product_name, 'BRG Test EcoCarrier Heavy')
      assert.strictEqual(rows[0].category, 'Cargo')
      assert.strictEqual(rows[0].urgency, 'High')
      assert.strictEqual(Number(rows[0].quantity), 5)
    })

    it('6.2 Should update product request to Approved in MySQL', async () => {
      assert.ok(reqId)
      const res = await request(app)
        .put(`/api/v1/catalogue/product-requests/${reqId}`)
        .set(adminHeaders)
        .send({ status: 'Approved', urgency: 'Urgent' })

      assert.strictEqual(res.status, 200)
      assert.strictEqual(res.body.data.status, 'Approved')

      // Direct MySQL Read-back
      const rows = await query('SELECT status, urgency FROM `product_requests` WHERE `id` = ?', [reqId])
      assert.strictEqual(rows[0].status, 'Approved')
      assert.strictEqual(rows[0].urgency, 'Urgent')
    })

    it('6.3 Should delete isolated test product request from MySQL', async () => {
      assert.ok(reqId)
      const res = await request(app)
        .delete(`/api/v1/catalogue/product-requests/${reqId}`)
        .set(adminHeaders)

      assert.strictEqual(res.status, 200)
      const rows = await query('SELECT id FROM `product_requests` WHERE `id` = ?', [reqId])
      assert.strictEqual(rows.length, 0)
    })
  })

  // ==========================================================================
  // Form 7: FRM-INV-03 — Create Cycle Count
  // ==========================================================================
  describe('Form 7 (FRM-INV-03): Cycle Count Database Persistence', () => {
    let countId = null

    it('7.1 Should persist a new cycle count to MySQL table `cycle_counts`', async () => {
      const payload = {
        name: 'Test Showroom Bi-Weekly Audit',
        scope: 'Showroom Units',
        category: 'Electric Bikes',
        assignedTo: 'Lead Auditor Farhan',
        scheduledDate: '2026-11-05',
        expectedUnits: '25 units',
        targetLocation: 'Main Showroom Display Floor',
        notes: 'Scheduled physical stock count test fixture',
        branch: 'Peshawar',
        branch_id: 'BR-01'
      }

      const res = await request(app)
        .post('/api/v1/inventory/cycle-counts')
        .set(adminHeaders)
        .send(payload)

      assert.strictEqual(res.status, 201)
      assert.strictEqual(res.body.ok, true)
      assert.ok(res.body.data.id)
      countId = res.body.data.id
      cleanups.cycleCountIds.push(countId)

      // Direct MySQL Read-back Verification
      const rows = await query('SELECT * FROM `cycle_counts` WHERE `id` = ?', [countId])
      assert.strictEqual(rows.length, 1)
      assert.strictEqual(rows[0].name, 'Test Showroom Bi-Weekly Audit')
      assert.strictEqual(rows[0].assigned_to, 'Lead Auditor Farhan')
      assert.strictEqual(rows[0].branch_id, 'BR-01')
    })

    it('7.2 Should update cycle count to Completed with counted units in MySQL', async () => {
      assert.ok(countId)
      const res = await request(app)
        .put(`/api/v1/inventory/cycle-counts/${countId}`)
        .set(adminHeaders)
        .send({ counted: '25 units', variance: '0', status: 'Completed' })

      assert.strictEqual(res.status, 200)
      assert.strictEqual(res.body.data.status, 'Completed')

      // Direct MySQL Read-back
      const rows = await query('SELECT status, counted, variance FROM `cycle_counts` WHERE `id` = ?', [countId])
      assert.strictEqual(rows[0].status, 'Completed')
      assert.strictEqual(rows[0].counted, '25 units')
    })

    it('7.3 Should delete isolated test cycle count from MySQL', async () => {
      assert.ok(countId)
      const res = await request(app)
        .delete(`/api/v1/inventory/cycle-counts/${countId}`)
        .set(adminHeaders)

      assert.strictEqual(res.status, 200)
      const rows = await query('SELECT id FROM `cycle_counts` WHERE `id` = ?', [countId])
      assert.strictEqual(rows.length, 0)
    })
  })

  // ==========================================================================
  // Form 8: FRM-INV-04 — Create Quarantine Record
  // ==========================================================================
  describe('Form 8 (FRM-INV-04): Quarantine Record Database Persistence', () => {
    let quarantineId = null

    it('8.1 Should persist a new quarantine record to MySQL table `quarantine_records`', async () => {
      const payload = {
        unit: 'VIN-DEF-4411',
        product: 'BRG DS11 Test Bike',
        defectType: 'Battery Management Controller',
        severity: 'High',
        source: 'Showroom Floor',
        inspector: 'Lead QC Engineer',
        condition: 'BMS cut-off triggers under heavy 40A throttle load',
        evidence: 'diagnostic_trace_4411.pdf',
        decision: 'Propose BMS controller replacement under manufacturer warranty',
        notes: 'Isolated in workshop quarantine bay',
        branch: 'Peshawar',
        branch_id: 'BR-01'
      }

      const res = await request(app)
        .post('/api/v1/inventory/quarantine')
        .set(adminHeaders)
        .send(payload)

      assert.strictEqual(res.status, 201)
      assert.strictEqual(res.body.ok, true)
      assert.ok(res.body.data.id)
      quarantineId = res.body.data.id
      cleanups.quarantineIds.push(quarantineId)

      // Direct MySQL Read-back Verification
      const rows = await query('SELECT * FROM `quarantine_records` WHERE `id` = ?', [quarantineId])
      assert.strictEqual(rows.length, 1)
      assert.strictEqual(rows[0].unit, 'VIN-DEF-4411')
      assert.strictEqual(rows[0].defect_type, 'Battery Management Controller')
      assert.strictEqual(rows[0].severity, 'High')
      assert.strictEqual(rows[0].inspector, 'Lead QC Engineer')
    })

    it('8.2 Should update quarantine disposition status to Repaired in MySQL', async () => {
      assert.ok(quarantineId)
      const res = await request(app)
        .put(`/api/v1/inventory/quarantine/${quarantineId}`)
        .set(adminHeaders)
        .send({ status: 'Repaired', decision: 'Replacement BMS installed; passed 50km road test' })

      assert.strictEqual(res.status, 200)
      assert.strictEqual(res.body.data.status, 'Repaired')

      // Direct MySQL Read-back
      const rows = await query('SELECT status, decision FROM `quarantine_records` WHERE `id` = ?', [quarantineId])
      assert.strictEqual(rows[0].status, 'Repaired')
    })

    it('8.3 Should delete isolated test quarantine record from MySQL', async () => {
      assert.ok(quarantineId)
      const res = await request(app)
        .delete(`/api/v1/inventory/quarantine/${quarantineId}`)
        .set(adminHeaders)

      assert.strictEqual(res.status, 200)
      const rows = await query('SELECT id FROM `quarantine_records` WHERE `id` = ?', [quarantineId])
      assert.strictEqual(rows.length, 0)
    })
  })

  // ==========================================================================
  // Form 9: FRM-INV-05 — Create Stock Request
  // ==========================================================================
  describe('Form 9 (FRM-INV-05): Stock Request Database Persistence', () => {
    let stockReqId = null

    it('9.1 Should persist a new stock request to MySQL table `stock_requests`', async () => {
      const payload = {
        product: 'City Mini E-Scoot Test',
        currentStock: '1 unit',
        qty: 3,
        urgency: 'High',
        expectedDemand: 'Three confirmed corporate customer reservations',
        orderLink: 'ORD-TEST-9903',
        reason: 'Low stock replenishment from central warehouse',
        notes: 'Priority dispatch requested via express logistics',
        branch: 'Peshawar',
        branch_id: 'BR-01'
      }

      const res = await request(app)
        .post('/api/v1/inventory/stock-requests')
        .set(adminHeaders)
        .send(payload)

      assert.strictEqual(res.status, 201)
      assert.strictEqual(res.body.ok, true)
      assert.ok(res.body.data.id)
      stockReqId = res.body.data.id
      cleanups.stockRequestIds.push(stockReqId)

      // Direct MySQL Read-back Verification
      const rows = await query('SELECT * FROM `stock_requests` WHERE `id` = ?', [stockReqId])
      assert.strictEqual(rows.length, 1)
      assert.strictEqual(rows[0].product, 'City Mini E-Scoot Test')
      assert.strictEqual(Number(rows[0].qty), 3)
      assert.strictEqual(rows[0].urgency, 'High')
      assert.strictEqual(rows[0].branch_id, 'BR-01')
    })

    it('9.2 Should update stock request to Approved in MySQL', async () => {
      assert.ok(stockReqId)
      const res = await request(app)
        .put(`/api/v1/inventory/stock-requests/${stockReqId}`)
        .set(adminHeaders)
        .send({ status: 'Approved', notes: 'HQ Logistics dispatch authorized' })

      assert.strictEqual(res.status, 200)
      assert.strictEqual(res.body.data.status, 'Approved')

      // Direct MySQL Read-back
      const rows = await query('SELECT status FROM `stock_requests` WHERE `id` = ?', [stockReqId])
      assert.strictEqual(rows[0].status, 'Approved')
    })

    it('9.3 Should delete isolated test stock request from MySQL', async () => {
      assert.ok(stockReqId)
      const res = await request(app)
        .delete(`/api/v1/inventory/stock-requests/${stockReqId}`)
        .set(adminHeaders)

      assert.strictEqual(res.status, 200)
      const rows = await query('SELECT id FROM `stock_requests` WHERE `id` = ?', [stockReqId])
      assert.strictEqual(rows.length, 0)
    })
  })

  // ==========================================================================
  // Form 10 & 11: FRM-COMM-01 & FRM-COMM-02 — Create Conversation & Reply
  // ==========================================================================
  describe('Forms 10 & 11 (FRM-COMM-01, FRM-COMM-02): Internal Communication Persistence', () => {
    let conversationId = null

    it('10.1 (FRM-COMM-01) Should persist a new conversation to MySQL table `conversations`', async () => {
      const payload = {
        title: 'Emergency Stock Allocation Peshawar Showroom Test',
        linked: 'SR-TEST-301',
        linkedType: 'Stock Request',
        recipient: 'Super Admin',
        priority: 'High',
        message: 'Requesting emergency allocation of 3 DS11 units for confirmed corporate buyer',
        branch: 'Peshawar',
        branch_id: 'BR-01'
      }

      const res = await request(app)
        .post('/api/v1/communication/conversations')
        .set(adminHeaders)
        .send(payload)

      assert.strictEqual(res.status, 201)
      assert.strictEqual(res.body.ok, true)
      assert.ok(res.body.data.id)
      conversationId = res.body.data.id
      cleanups.conversationIds.push(conversationId)

      // Direct MySQL Read-back Verification
      const rows = await query('SELECT * FROM `conversations` WHERE `id` = ?', [conversationId])
      assert.strictEqual(rows.length, 1)
      assert.strictEqual(rows[0].title, 'Emergency Stock Allocation Peshawar Showroom Test')
      assert.strictEqual(rows[0].priority, 'High')
      assert.strictEqual(rows[0].branch_id, 'BR-01')

      // Also confirm the first initial message was created in `conversation_messages`
      const msgRows = await query('SELECT * FROM `conversation_messages` WHERE `conversation_id` = ?', [conversationId])
      assert.strictEqual(msgRows.length, 1)
      assert.ok(msgRows[0].text.includes('Requesting emergency allocation'))
    })

    it('11.1 (FRM-COMM-02) Should append a reply message to MySQL table `conversation_messages`', async () => {
      assert.ok(conversationId)
      const replyPayload = {
        sender: 'Super Admin',
        role: 'Head Office Executive',
        branch: 'All Branches',
        text: 'Corporate allocation approved. Lahore depot will dispatch 3 units tomorrow morning at 09:00 AM.',
        time: 'Just now'
      }

      const res = await request(app)
        .post(`/api/v1/communication/conversations/${conversationId}/messages`)
        .set(adminHeaders)
        .send(replyPayload)

      assert.strictEqual(res.status, 201)
      assert.strictEqual(res.body.ok, true)
      assert.strictEqual(res.body.data.messages.length, 2, 'Conversation must now contain 2 messages')

      // Direct MySQL Read-back Verification
      const msgRows = await query('SELECT * FROM `conversation_messages` WHERE `conversation_id` = ? ORDER BY `id` ASC', [conversationId])
      assert.strictEqual(msgRows.length, 2)
      assert.strictEqual(msgRows[1].sender, 'Super Admin')
      assert.ok(msgRows[1].text.includes('Corporate allocation approved'))

      // Also verify conversation `last_msg` and `replies` counter in parent table
      const convRows = await query('SELECT last_msg, replies FROM `conversations` WHERE `id` = ?', [conversationId])
      assert.ok(convRows[0].last_msg.includes('Corporate allocation approved'))
      assert.strictEqual(Number(convRows[0].replies), 2)
    })

    it('11.2 Should delete isolated test conversation and cascaded messages from MySQL', async () => {
      assert.ok(conversationId)
      const res = await request(app)
        .delete(`/api/v1/communication/conversations/${conversationId}`)
        .set(adminHeaders)

      assert.strictEqual(res.status, 200)

      // Confirm both parent and messages are deleted from MySQL
      const convRows = await query('SELECT id FROM `conversations` WHERE `id` = ?', [conversationId])
      assert.strictEqual(convRows.length, 0)
      const msgRows = await query('SELECT id FROM `conversation_messages` WHERE `conversation_id` = ?', [conversationId])
      assert.strictEqual(msgRows.length, 0)
    })
  })

  // ==========================================================================
  // Form 12: FRM-REP-01 — Build Custom Report
  // ==========================================================================
  describe('Form 12 (FRM-REP-01): Custom Report Builder Database Persistence', () => {
    let reportId = null

    it('12.1 Should persist a new custom report configuration to MySQL table `custom_reports`', async () => {
      const payload = {
        name: 'Executive Multi-Branch Operations Test Report',
        category: 'Sales Reports',
        scope: 'All Branches',
        dateRange: 'This Quarter',
        comparison: 'Previous Period',
        status: 'All Active',
        schedule: 'Monthly',
        format: 'PDF Summary',
        email: 'director-test@ajecodrive.com',
        metrics: {
          revenue: true,
          volume: true,
          orders: true,
          margins: true,
          kpi: true
        }
      }

      const res = await request(app)
        .post('/api/v1/analytics/custom-reports')
        .set(adminHeaders)
        .send(payload)

      assert.strictEqual(res.status, 201)
      assert.strictEqual(res.body.ok, true)
      assert.ok(res.body.data.id)
      reportId = res.body.data.id
      cleanups.customReportIds.push(reportId)

      // Direct MySQL Read-back Verification
      const rows = await query('SELECT * FROM `custom_reports` WHERE `id` = ?', [reportId])
      assert.strictEqual(rows.length, 1)
      assert.strictEqual(rows[0].name, 'Executive Multi-Branch Operations Test Report')
      assert.strictEqual(rows[0].format, 'PDF Summary')
      assert.strictEqual(rows[0].date_range, 'This Quarter')
      assert.strictEqual(rows[0].email, 'director-test@ajecodrive.com')

      // Verify JSON metrics column
      const parsedMetrics = JSON.parse(rows[0].metrics)
      assert.strictEqual(parsedMetrics.revenue, true)
      assert.strictEqual(parsedMetrics.margins, true)
    })

    it('12.2 Should update custom report schedule and format in MySQL', async () => {
      assert.ok(reportId)
      const res = await request(app)
        .put(`/api/v1/analytics/custom-reports/${reportId}`)
        .set(adminHeaders)
        .send({
          schedule: 'Weekly',
          format: 'Excel Spreadsheet',
          status: 'Active'
        })

      assert.strictEqual(res.status, 200)
      assert.strictEqual(res.body.data.schedule, 'Weekly')
      assert.strictEqual(res.body.data.format, 'Excel Spreadsheet')

      // Direct MySQL Read-back
      const rows = await query('SELECT schedule, format FROM `custom_reports` WHERE `id` = ?', [reportId])
      assert.strictEqual(rows[0].schedule, 'Weekly')
      assert.strictEqual(rows[0].format, 'Excel Spreadsheet')
    })

    it('12.3 Should delete isolated test custom report from MySQL', async () => {
      assert.ok(reportId)
      const res = await request(app)
        .delete(`/api/v1/analytics/custom-reports/${reportId}`)
        .set(adminHeaders)

      assert.strictEqual(res.status, 200)
      const rows = await query('SELECT id FROM `custom_reports` WHERE `id` = ?', [reportId])
      assert.strictEqual(rows.length, 0)
    })
  })

  after(async () => {
    await disconnectDB()
  })
})
