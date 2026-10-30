import { describe, it, before, after } from 'node:test'
import assert from 'node:assert'
import request from 'supertest'
import bcrypt from 'bcryptjs'
import { app } from '../src/app.js'
import { connectDB, disconnectDB, query } from '../src/config/db.js'
import { getAdminAuthHeader, getBranchManagerAuthHeader } from './helpers/auth.helper.js'

describe('AJ EcoDrive Backend — Exhaustive Form-to-Database Audit & Read-Back Verification Suite', () => {
  let isDbReady = false
  const adminHeaders = getAdminAuthHeader()
  const pewHeaders = getBranchManagerAuthHeader('BR-01', 'Peshawar')

  // Isolated test identifiers
  const testIds = {
    branchCode: 'AUDIT-BR-01',
    userUsername: 'audit_user_99',
    userEmail: 'audit_user_99@ajecodrive.com',
    roleName: 'Audit Special Role',
    supplierCode: 'SUP-AUDIT-99',
    customerId: 'CUST-AUDIT-8801',
    customerPhone: '03009988771',
    leadPhone: '03009988772',
    leadId: null,
    productId: 'PROD-AUDIT-99',
    productSku: 'SKU-AUDIT-99',
    categoryId: 'CAT-AUDIT-99',
    categoryCode: 'AUDIT-CAT',
    poId: null,
    poNumber: null,
    expenseId: null,
    caseId: null,
    repairJobId: null
  }
  let baselineBankBalance = null

  before(async () => {
    isDbReady = await connectDB()
    if (isDbReady) {
      // Clean up any stale audit records from prior runs
      await query('DELETE FROM `branches` WHERE `code` = ?', [testIds.branchCode])
      await query('DELETE FROM `users` WHERE `username` = ? OR `email` = ?', [testIds.userUsername, testIds.userEmail])
      await query('DELETE FROM `roles` WHERE `name` = ?', [testIds.roleName])
      await query('DELETE FROM `suppliers` WHERE `code` = ?', [testIds.supplierCode])
      await query('DELETE FROM `customers` WHERE `id` = ? OR `phone` = ?', [testIds.customerId, testIds.customerPhone])
      await query('DELETE FROM `leads` WHERE `phone` LIKE "%9988772%"')
      await query('DELETE FROM `products` WHERE `id` = ? OR `sku` = ?', [testIds.productId, testIds.productSku])
      await query('DELETE FROM `categories` WHERE `id` = ? OR `code` = ?', [testIds.categoryId, testIds.categoryCode])
      await query('DELETE FROM `purchase_order_items` WHERE `po_id` IN (SELECT `id` FROM `purchase_orders` WHERE `supplier_id` = ?)', [testIds.supplierCode])
      await query('DELETE FROM `purchase_orders` WHERE `supplier_id` = ?', [testIds.supplierCode])

      const bankRows = await query('SELECT `current_balance` FROM `cash_bank_accounts` WHERE `id` = "ACC-BANK-01"')
      if (bankRows.length > 0) {
        baselineBankBalance = bankRows[0].current_balance
      }
    }
  })

  after(async () => {
    if (isDbReady) {
      // Safe teardown of test-only identifiers
      await query('DELETE FROM `branches` WHERE `code` = ?', [testIds.branchCode])
      await query('DELETE FROM `users` WHERE `username` = ? OR `email` = ?', [testIds.userUsername, testIds.userEmail])
      await query('DELETE FROM `roles` WHERE `name` = ?', [testIds.roleName])
      await query('DELETE FROM `suppliers` WHERE `code` = ?', [testIds.supplierCode])
      await query('DELETE FROM `customers` WHERE `id` = ? OR `phone` = ?', [testIds.customerId, testIds.customerPhone])
      await query('DELETE FROM `leads` WHERE `phone` LIKE "%9988772%"')
      await query('DELETE FROM `products` WHERE `id` = ? OR `sku` = ?', [testIds.productId, testIds.productSku])
      await query('DELETE FROM `categories` WHERE `id` = ? OR `code` = ?', [testIds.categoryId, testIds.categoryCode])
      if (testIds.poId || testIds.poNumber) {
        if (testIds.poId) {
          await query('DELETE FROM `purchase_order_items` WHERE `po_id` = ?', [testIds.poId])
          await query('DELETE FROM `purchase_orders` WHERE `id` = ?', [testIds.poId])
        }
        if (testIds.poNumber) {
          await query('DELETE FROM `purchase_orders` WHERE `po_number` = ?', [testIds.poNumber])
        }
      }
      if (testIds.expenseId) {
        await query('DELETE FROM `general_ledger` WHERE `source_id` = ? OR `entry_number` LIKE ?', [testIds.expenseId, `%${testIds.expenseId}%`])
        await query('DELETE FROM `financial_transactions` WHERE `id` = ? OR `reference_id` = ?', [`TRX-${testIds.expenseId}`, testIds.expenseId])
        await query('DELETE FROM `expenses` WHERE `id` = ?', [testIds.expenseId])
      }
      if (baselineBankBalance !== null) {
        await query('UPDATE `cash_bank_accounts` SET `current_balance` = ? WHERE `id` = "ACC-BANK-01"', [baselineBankBalance])
      }
      if (testIds.repairJobId) {
        await query('DELETE FROM `repair_job_items` WHERE `repair_job_id` = ?', [testIds.repairJobId])
        await query('DELETE FROM `repair_jobs` WHERE `id` = ?', [testIds.repairJobId])
      }
      if (testIds.caseId) {
        await query('DELETE FROM `service_cases` WHERE `id` = ?', [testIds.caseId])
      }
      await disconnectDB()
    }
  })

  // ==========================================================================
  // MODULE 1: ORGANISATION, BRANCHES, USERS & ROLES
  // ==========================================================================
  describe('Module 1: Organisation & Access Master', () => {
    it('1.1 CreateBranch form persists all fields to MySQL `branches` and verifies read-back', async () => {
      const branchPayload = {
        code: testIds.branchCode,
        name: 'Audit Northern Hub',
        city: 'Gilgit',
        phone: '05811-455221',
        email: 'gilgit@ajecodrive.com',
        address: 'Main Karakoram Highway, Jutial',
        status: 'Active'
      }

      const res = await request(app)
        .post('/api/v1/organisation/branches')
        .set(adminHeaders)
        .send(branchPayload)

      assert.strictEqual(res.status, 201)
      assert.strictEqual(res.body.ok, true)

      // Direct MySQL Read-Back
      const rows = await query('SELECT * FROM `branches` WHERE `code` = ?', [testIds.branchCode])
      assert.strictEqual(rows.length, 1)
      assert.strictEqual(rows[0].name, 'Audit Northern Hub')
      assert.strictEqual(rows[0].city, 'Gilgit')
      assert.strictEqual(rows[0].phone, '05811-455221')
      assert.strictEqual(rows[0].email, 'gilgit@ajecodrive.com')
      assert.strictEqual(rows[0].status, 'Active')
    })

    it('1.2 EditBranch form updates fields in MySQL `branches` and verifies read-back', async () => {
      const updatePayload = {
        name: 'Audit Northern Hub (Renovated)',
        phone: '05811-999888',
        city: 'Gilgit City'
      }

      const res = await request(app)
        .put(`/api/v1/organisation/branches/${testIds.branchCode}`)
        .set(adminHeaders)
        .send(updatePayload)

      assert.strictEqual(res.status, 200)

      // Direct MySQL Read-Back
      const rows = await query('SELECT * FROM `branches` WHERE `code` = ?', [testIds.branchCode])
      assert.strictEqual(rows[0].name, 'Audit Northern Hub (Renovated)')
      assert.strictEqual(rows[0].phone, '05811-999888')
    })

    it('1.3 CreateUser form persists user to MySQL `users` with bcrypt hash and verifies read-back', async () => {
      const userPayload = {
        name: 'Audit Officer Tariq',
        username: testIds.userUsername,
        email: testIds.userEmail,
        password: 'SecurePassword123!',
        role: 'Branch Manager',
        branch_id: 'BR-01',
        phone: '03451122334',
        status: 'Active'
      }

      const res = await request(app)
        .post('/api/v1/organisation/users')
        .set(adminHeaders)
        .send(userPayload)

      assert.strictEqual(res.status, 201)
      assert.strictEqual(res.body.ok, true)

      // Direct MySQL Read-Back
      const rows = await query('SELECT * FROM `users` WHERE `username` = ?', [testIds.userUsername])
      assert.strictEqual(rows.length, 1)
      assert.strictEqual(rows[0].name, 'Audit Officer Tariq')
      assert.strictEqual(rows[0].email, testIds.userEmail)
      assert.strictEqual(rows[0].role_id, 'ROLE-BM')
      assert.strictEqual(rows[0].branch_id, 'BR-01')
      assert.strictEqual(rows[0].phone, '03451122334')
      
      // Verify bcrypt password hash
      const isMatch = await bcrypt.compare('SecurePassword123!', rows[0].password_hash)
      assert.strictEqual(isMatch, true)
    })

    it('1.4 EditUser form updates profile in MySQL `users` and verifies read-back', async () => {
      const updatePayload = {
        name: 'Audit Senior Officer Tariq',
        phone: '03459998877'
      }

      const res = await request(app)
        .put(`/api/v1/organisation/users/${testIds.userUsername}`)
        .set(adminHeaders)
        .send(updatePayload)

      assert.strictEqual(res.status, 200)

      // Direct MySQL Read-Back
      const rows = await query('SELECT * FROM `users` WHERE `username` = ?', [testIds.userUsername])
      assert.strictEqual(rows[0].name, 'Audit Senior Officer Tariq')
      assert.strictEqual(rows[0].phone, '03459998877')
    })

    it('1.5 CreateRole form persists to MySQL `roles` and `role_permissions` and verifies read-back', async () => {
      const rolePayload = {
        name: testIds.roleName,
        description: 'Special Auditor role with procurement and audit inspect access',
        permissions: ['procurement.read', 'inventory.read', 'finance.read']
      }

      const res = await request(app)
        .post('/api/v1/organisation/roles')
        .set(adminHeaders)
        .send(rolePayload)

      assert.strictEqual(res.status, 201)

      // Direct MySQL Read-Back
      const roleRows = await query('SELECT * FROM `roles` WHERE `name` = ?', [testIds.roleName])
      assert.strictEqual(roleRows.length, 1)
      assert.strictEqual(roleRows[0].description, rolePayload.description)

      const permRows = await query('SELECT * FROM `role_permissions` WHERE `role_id` = ?', [roleRows[0].id])
      assert.strictEqual(permRows.length, 3)
    })
  })

  // ==========================================================================
  // MODULE 2: CUSTOMERS & CRM
  // ==========================================================================
  describe('Module 2: Customers & CRM', () => {
    it('2.1 CreateCustomer form persists all 11 fields to MySQL `customers` and verifies read-back', async () => {
      const customerPayload = {
        id: testIds.customerId,
        code: 'CUS-AUDIT-88',
        name: 'Rashid Mahmood',
        firstName: 'Rashid',
        lastName: 'Mahmood',
        phone: testIds.customerPhone,
        email: 'rashid.audit@gmail.com',
        cnic: '37405-9988771-3',
        address: 'House 14, Street 9, Hayatabad Phase 3',
        city: 'Peshawar',
        branch_id: 'BR-01',
        branch: 'Peshawar',
        status: 'Active',
        notes: 'VIP fleet inquiry customer'
      }

      const res = await request(app)
        .post('/api/v1/customers')
        .set(pewHeaders)
        .send(customerPayload)

      assert.strictEqual(res.status, 201)

      // Direct MySQL Read-Back
      const rows = await query('SELECT * FROM `customers` WHERE `id` = ?', [testIds.customerId])
      assert.strictEqual(rows.length, 1)
      assert.strictEqual(rows[0].name, 'Rashid Mahmood')
      assert.strictEqual(rows[0].first_name, 'Rashid')
      assert.strictEqual(rows[0].last_name, 'Mahmood')
      assert.strictEqual(rows[0].phone, testIds.customerPhone)
      assert.strictEqual(rows[0].email, 'rashid.audit@gmail.com')
      assert.strictEqual(rows[0].cnic, '37405-9988771-3')
      assert.strictEqual(rows[0].address, 'House 14, Street 9, Hayatabad Phase 3')
      assert.strictEqual(rows[0].city, 'Peshawar')
      assert.strictEqual(rows[0].branch_id, 'BR-01')
      assert.strictEqual(rows[0].status, 'Active')
      assert.strictEqual(rows[0].notes, 'VIP fleet inquiry customer')
    })

    it('2.2 EditCustomer updates fields in MySQL `customers` and verifies read-back', async () => {
      const updatePayload = {
        email: 'rashid.updated@gmail.com',
        address: 'Sector F1, Phase 6, Hayatabad',
        notes: 'Confirmed 2-unit EV booking in discussion'
      }

      const res = await request(app)
        .put(`/api/v1/customers/${testIds.customerId}`)
        .set(pewHeaders)
        .send(updatePayload)

      assert.strictEqual(res.status, 200)

      // Direct MySQL Read-Back
      const rows = await query('SELECT * FROM `customers` WHERE `id` = ?', [testIds.customerId])
      assert.strictEqual(rows[0].email, 'rashid.updated@gmail.com')
      assert.strictEqual(rows[0].address, 'Sector F1, Phase 6, Hayatabad')
      assert.strictEqual(rows[0].notes, 'Confirmed 2-unit EV booking in discussion')
    })

    it('2.3 CreateLead form persists all fields to MySQL `leads` and verifies read-back', async () => {
      const leadPayload = {
        name: 'Kamran Akmal',
        phone: testIds.leadPhone,
        email: 'kamran.lead@gmail.com',
        source: 'Walk-in',
        branch_id: 'BR-01',
        branch: 'Peshawar',
        owner: 'Ahsan Khan',
        stage: 'Qualified',
        product: 'BRG E-125 EV Scooter',
        budget: 'PKR 350,000',
        next_follow_up: '2026-11-05'
      }

      const res = await request(app)
        .post('/api/v1/leads')
        .set(pewHeaders)
        .send(leadPayload)

      assert.strictEqual(res.status, 201)
      testIds.leadId = res.body.id || res.body.data?.id

      // Direct MySQL Read-Back
      const rows = await query('SELECT * FROM `leads` WHERE `id` = ?', [testIds.leadId])
      assert.strictEqual(rows.length, 1)
      assert.strictEqual(rows[0].customer_name, 'Kamran Akmal')
      assert.strictEqual(rows[0].source, 'Walk-in')
      assert.strictEqual(rows[0].stage, 'Qualified')
      assert.strictEqual(rows[0].branch_id, 'BR-01')
    })

    it('2.4 CreateFollowUp form persists to MySQL `follow_ups` and verifies read-back', async () => {
      const followUpPayload = {
        customer_name: 'Kamran Akmal',
        lead_id: testIds.leadId,
        task_type: 'Test Drive',
        priority: 'High',
        channel: 'In-Person',
        owner: 'Ahsan Khan',
        branch_id: 'BR-01',
        branch: 'Peshawar',
        due_date: '2026-11-06',
        due_time: '14:30:00',
        notes: 'Schedule 30-min showroom test ride for BRG E-125'
      }

      const res = await request(app)
        .post('/api/v1/follow-ups')
        .set(pewHeaders)
        .send(followUpPayload)

      assert.strictEqual(res.status, 201)
      const followUpId = res.body.id || res.body.data?.id

      // Direct MySQL Read-Back
      const rows = await query('SELECT * FROM `follow_ups` WHERE `id` = ?', [followUpId])
      assert.strictEqual(rows.length, 1)
      assert.strictEqual(rows[0].task_type, 'Test Drive')
      assert.strictEqual(rows[0].priority, 'High')
      assert.strictEqual(rows[0].notes, 'Schedule 30-min showroom test ride for BRG E-125')

      // Clean up follow-up
      await query('DELETE FROM `follow_ups` WHERE `id` = ?', [followUpId])
    })
  })

  // ==========================================================================
  // MODULE 3: PROCUREMENT & SUPPLIERS
  // ==========================================================================
  describe('Module 3: Procurement & Suppliers', () => {
    it('3.1 CreateSupplier form persists all 9 fields to MySQL `suppliers` and verifies read-back', async () => {
      const supplierPayload = {
        code: testIds.supplierCode,
        name: 'Audit PowerCell Global Ltd',
        contact: 'Wang Shuo',
        contact_person: 'Wang Shuo',
        phone: '+86 21 8899 7711',
        email: 'sales@powercell-audit.cn',
        address: 'Hi-Tech Industrial Park, Zone B, Shenzhen',
        currency: 'USD',
        terms: 'LC 60 Days',
        payment_terms: 'LC 60 Days',
        tax_id: '91440300MA5F123456',
        notes: 'OEM Lithium Iron Phosphate (LFP) battery pack supplier'
      }

      const res = await request(app)
        .post('/api/v1/procurement/suppliers')
        .set(adminHeaders)
        .send(supplierPayload)

      assert.strictEqual(res.status, 201)

      // Direct MySQL Read-Back
      const rows = await query('SELECT * FROM `suppliers` WHERE `code` = ?', [testIds.supplierCode])
      assert.strictEqual(rows.length, 1)
      assert.strictEqual(rows[0].name, 'Audit PowerCell Global Ltd')
      assert.strictEqual(rows[0].contact, 'Wang Shuo')
      assert.strictEqual(rows[0].phone, '+86 21 8899 7711')
      assert.strictEqual(rows[0].email, 'sales@powercell-audit.cn')
      assert.strictEqual(rows[0].currency, 'USD')
      assert.strictEqual(rows[0].terms, 'LC 60 Days')
      assert.strictEqual(rows[0].tax_id, '91440300MA5F123456')
      assert.strictEqual(rows[0].notes, 'OEM Lithium Iron Phosphate (LFP) battery pack supplier')
    })

    it('3.2 EditSupplier updates fields in MySQL `suppliers` and verifies read-back', async () => {
      const updatePayload = {
        name: 'Audit PowerCell Global International Ltd',
        phone: '+86 21 8899 9999',
        terms: 'LC 90 Days'
      }

      const res = await request(app)
        .put(`/api/v1/procurement/suppliers/${testIds.supplierCode}`)
        .set(adminHeaders)
        .send(updatePayload)

      assert.strictEqual(res.status, 200)

      // Direct MySQL Read-Back
      const rows = await query('SELECT * FROM `suppliers` WHERE `code` = ?', [testIds.supplierCode])
      assert.strictEqual(rows[0].name, 'Audit PowerCell Global International Ltd')
      assert.strictEqual(rows[0].phone, '+86 21 8899 9999')
      assert.strictEqual(rows[0].terms, 'LC 90 Days')
    })

    it('3.3 CreatePurchaseOrder form persists PO and lines to MySQL `purchase_orders` & `purchase_order_items`', async () => {
      const poPayload = {
        supplier_id: testIds.supplierCode,
        branch_id: 'BR-01',
        branch: 'Peshawar',
        destination: 'Peshawar',
        expected_date: '2026-11-25',
        carrier: 'Air & Sea Freight',
        shipment_method: 'Air & Sea Freight',
        payment_terms: 'LC 90 Days',
        notes: 'Priority battery batch for Lahore & Peshawar showrooms',
        items: [
          {
            product_id: 'PROD-007',
            product: 'PowerCell 72V 30Ah',
            sku: 'BAT-72V-30AH',
            ordered_quantity: 5,
            unit_cost: 95000,
            is_serialized: 1
          }
        ]
      }

      const res = await request(app)
        .post('/api/v1/procurement/purchase-orders')
        .set(adminHeaders)
        .send(poPayload)

      assert.strictEqual(res.status, 201)
      testIds.poNumber = res.body.po_number || res.body.po || res.body.id

      // Direct MySQL Read-Back
      const poRows = await query('SELECT * FROM `purchase_orders` WHERE `po_number` = ?', [testIds.poNumber])
      assert.strictEqual(poRows.length, 1)
      testIds.poId = poRows[0].id
      assert.strictEqual(poRows[0].branch_id, 'BR-01')
      assert.strictEqual(poRows[0].total_ordered, 5)
      assert.strictEqual(Number(poRows[0].amount), 475000)
      assert.strictEqual(poRows[0].status, 'Draft')

      const itemRows = await query('SELECT * FROM `purchase_order_items` WHERE `po_id` = ?', [poRows[0].id])
      assert.strictEqual(itemRows.length, 1)
      assert.strictEqual(itemRows[0].product_id, 'PROD-007')
      assert.strictEqual(itemRows[0].ordered_quantity, 5)
      assert.strictEqual(Number(itemRows[0].unit_cost), 95000)
    })
  })

  // ==========================================================================
  // MODULE 4: CATALOGUE & PRODUCTS
  // ==========================================================================
  describe('Module 4: Catalogue & Products', () => {
    it('4.1 CreateCategory form persists to MySQL `categories` and verifies read-back', async () => {
      const categoryPayload = {
        id: testIds.categoryId,
        code: testIds.categoryCode,
        name: 'Audit High-Efficiency Inverters',
        description: 'Next-gen solar and DC-to-AC pure sine wave inverters',
        status: 'Active'
      }

      const res = await request(app)
        .post('/api/v1/catalogue/categories')
        .set(adminHeaders)
        .send(categoryPayload)

      assert.strictEqual(res.status, 201)

      // Direct MySQL Read-Back
      const rows = await query('SELECT * FROM `categories` WHERE `code` = ?', [testIds.categoryCode])
      assert.strictEqual(rows.length, 1)
      assert.strictEqual(rows[0].name, 'Audit High-Efficiency Inverters')
      assert.strictEqual(rows[0].status, 'Active')
    })

    it('4.2 CreateProduct form persists all fields to MySQL `products` and verifies read-back', async () => {
      const productPayload = {
        id: testIds.productId,
        sku: testIds.productSku,
        name: 'EcoDrive PureSine 5KW Inverter',
        category_id: testIds.categoryId,
        category: 'Audit High-Efficiency Inverters',
        cost_price: 120000,
        selling_price: 165000,
        dealer_price: 145000,
        reorder_level: 4,
        description: '5KW pure sine wave hybrid inverter with CANbus integration'
      }

      const res = await request(app)
        .post('/api/v1/catalogue/products')
        .set(adminHeaders)
        .send(productPayload)

      assert.strictEqual(res.status, 201)

      // Direct MySQL Read-Back
      const rows = await query('SELECT * FROM `products` WHERE `sku` = ?', [testIds.productSku])
      assert.strictEqual(rows.length, 1)
      assert.strictEqual(rows[0].name, 'EcoDrive PureSine 5KW Inverter')
      assert.strictEqual(Number(rows[0].cost_price), 120000)
      assert.strictEqual(Number(rows[0].selling_price), 165000)
      assert.strictEqual(Number(rows[0].dealer_price), 145000)
      assert.strictEqual(rows[0].reorder_level, 4)
    })

    it('4.3 EditProduct updates prices and specifications in MySQL `products` and verifies read-back', async () => {
      const updatePayload = {
        selling_price: 172000,
        dealer_price: 150000,
        reorder_level: 6
      }

      const res = await request(app)
        .put(`/api/v1/catalogue/products/${testIds.productId}`)
        .set(adminHeaders)
        .send(updatePayload)

      assert.strictEqual(res.status, 200)

      // Direct MySQL Read-Back
      const rows = await query('SELECT * FROM `products` WHERE `id` = ?', [testIds.productId])
      assert.strictEqual(Number(rows[0].selling_price), 172000)
      assert.strictEqual(Number(rows[0].dealer_price), 150000)
      assert.strictEqual(rows[0].reorder_level, 6)
    })
  })

  // ==========================================================================
  // MODULE 5: FINANCE & EXPENSES
  // ==========================================================================
  describe('Module 5: Finance & Expenses', () => {
    it('5.1 CreateExpense form persists to MySQL `expenses` and verifies read-back', async () => {
      const expensePayload = {
        category: 'Utilities & Power',
        category_id: 'EXPCAT-002',
        description: 'Peshawar Showroom Commercial Electricity Bill Q3',
        amount: 45000,
        payee: 'Peshawar Electric Supply Company (PESCO)',
        vendor: 'Peshawar Electric Supply Company (PESCO)',
        branch_id: 'BR-01',
        branch: 'Peshawar',
        payment_method: 'Bank Transfer',
        receipt_number: 'PESCO-ELEC-9921',
        date: '2026-10-28',
        notes: 'Monthly high-tension 3-phase commercial tariff'
      }

      const res = await request(app)
        .post('/api/v1/finance/expenses')
        .set(pewHeaders)
        .send(expensePayload)

      assert.strictEqual(res.status, 201)
      testIds.expenseId = res.body.id || res.body.data?.id || res.body.expense?.id

      // Direct MySQL Read-Back
      const rows = await query('SELECT * FROM `expenses` WHERE `id` = ?', [testIds.expenseId])
      assert.strictEqual(rows.length, 1)
      assert.strictEqual(rows[0].description, 'Peshawar Showroom Commercial Electricity Bill Q3')
      assert.strictEqual(Number(rows[0].raw_amount), 45000)
      assert.strictEqual(rows[0].vendor, 'Peshawar Electric Supply Company (PESCO)')
      assert.strictEqual(rows[0].branch_id, 'BR-01')
      assert.strictEqual(rows[0].approval, 'Pending')
    })

    it('5.2 Approve and Pay expense updates status in MySQL and records financial transaction', async () => {
      // 1. Approve
      const resApprove = await request(app)
        .post(`/api/v1/finance/expenses/${testIds.expenseId}/approve`)
        .set(adminHeaders)

      assert.strictEqual(resApprove.status, 200)

      const approveRow = await query('SELECT approval FROM `expenses` WHERE `id` = ?', [testIds.expenseId])
      assert.strictEqual(approveRow[0].approval, 'Approved')

      // 2. Pay
      const resPay = await request(app)
        .post(`/api/v1/finance/expenses/${testIds.expenseId}/pay`)
        .set(adminHeaders)
        .send({ paymentMethod: 'Bank Transfer' })

      assert.strictEqual(resPay.status, 200)

      const payRow = await query('SELECT payment FROM `expenses` WHERE `id` = ?', [testIds.expenseId])
      assert.strictEqual(payRow[0].payment, 'Paid')
    })
  })

  // ==========================================================================
  // MODULE 6: AFTER-SALES & SERVICE
  // ==========================================================================
  describe('Module 6: After-Sales & Workshop', () => {
    it('6.1 CreateCase form persists service case to MySQL `service_cases` and verifies read-back', async () => {
      const casePayload = {
        customer_name: 'Rashid Mahmood',
        customer: 'Rashid Mahmood',
        phone: testIds.customerPhone,
        unit_id: 'UNIT-001',
        vin: 'PAK-BRG-2026-0001',
        category: 'Scheduled Maintenance',
        priority: 'Normal',
        odometer: 4200,
        issue: '1st periodic inspection, brake fluid inspection and battery cell balancing',
        symptoms: '1st periodic inspection, brake fluid inspection and battery cell balancing',
        branch_id: 'BR-01',
        branch: 'Peshawar',
        technician: 'Kamran Ali (Lead Technician)'
      }

      const res = await request(app)
        .post('/api/v1/after-sales/cases')
        .set(pewHeaders)
        .send(casePayload)

      assert.strictEqual(res.status, 201)
      testIds.caseId = res.body.id || res.body.data?.id || res.body.case?.id

      // Direct MySQL Read-Back
      const rows = await query('SELECT * FROM `service_cases` WHERE `id` = ?', [testIds.caseId])
      assert.strictEqual(rows.length, 1)
      assert.strictEqual(rows[0].customer_name, 'Rashid Mahmood')
      assert.strictEqual(rows[0].category, 'Scheduled Maintenance')
      assert.strictEqual(Number(rows[0].odometer), 4200)
    })

    it('6.2 CreateRepairJob form persists parts and labor to MySQL `repair_jobs` & `repair_job_items`', async () => {
      const repairPayload = {
        case_id: testIds.caseId,
        customer_name: 'Rashid Mahmood',
        customer: 'Rashid Mahmood',
        branch_id: 'BR-01',
        branch: 'Peshawar',
        technician: 'Kamran Ali (Lead Technician)',
        estimated_duration: 3,
        priority: 'Normal',
        labor_hours: 2,
        labor_rate: 2500,
        diagnosis: 'Brake pads cleaned, regenerative braking re-calibrated',
        diagnosis_notes: 'Brake pads cleaned, regenerative braking re-calibrated',
        items: [
          {
            part_id: 'PROD-009',
            part_name: 'Synthetic Brake Fluid DOT 4',
            quantity: 1,
            unit_price: 1800,
            is_warranty: 0
          }
        ]
      }

      const res = await request(app)
        .post('/api/v1/after-sales/repair-jobs')
        .set(pewHeaders)
        .send(repairPayload)

      assert.strictEqual(res.status, 201)
      testIds.repairJobId = res.body.id || res.body.data?.id || res.body.job?.id || res.body.repair?.id

      // Direct MySQL Read-Back
      const jobRows = await query('SELECT * FROM `repair_jobs` WHERE `id` = ?', [testIds.repairJobId])
      assert.strictEqual(jobRows.length, 1)
      assert.strictEqual(Number(jobRows[0].labour_cost), 5000)
      assert.strictEqual(Number(jobRows[0].total_cost), 6800)

      const itemRows = await query('SELECT * FROM `repair_job_items` WHERE `repair_job_id` = ?', [testIds.repairJobId])
      assert.strictEqual(itemRows.length, 2)
      const partItem = itemRows.find(i => i.item_type === 'part')
      assert.ok(partItem, 'Part item must be persisted')
      assert.strictEqual(partItem.item_name, 'Synthetic Brake Fluid DOT 4')
      assert.strictEqual(Number(partItem.unit_price), 1800)
      const labourItem = itemRows.find(i => i.item_type === 'labour')
      assert.ok(labourItem, 'Labour item must be persisted')
      assert.strictEqual(Number(labourItem.subtotal), 5000)
    })
  })

  // ==========================================================================
  // MODULE 7: DESTRUCTIVE DELETION & INTEGRITY
  // ==========================================================================
  describe('Module 7: Destructive Deletion & Negative Guardrails', () => {
    it('7.1 Deleting customer removes record from MySQL `customers` and prevents reading', async () => {
      const res = await request(app)
        .delete(`/api/v1/customers/${testIds.customerId}`)
        .set(pewHeaders)

      assert.strictEqual(res.status, 200)

      // Direct MySQL Read-Back
      const rows = await query('SELECT * FROM `customers` WHERE `id` = ?', [testIds.customerId])
      assert.strictEqual(rows.length, 0, 'Customer must be deleted from MySQL')
    })

    it('7.2 Deleting supplier with PO is blocked, standalone supplier is cleanly removed from MySQL `suppliers`', async () => {
      // 1. Guardrail: supplier with linked PO cannot be deleted
      const resBlocked = await request(app)
        .delete(`/api/v1/procurement/suppliers/${testIds.supplierCode}`)
        .set(adminHeaders)
      assert.strictEqual(resBlocked.status, 400)

      // 2. Clean delete on unlinked supplier
      const delSupCode = 'SUP-DEL-' + Math.floor(100 + Math.random() * 900)
      await request(app)
        .post('/api/v1/procurement/suppliers')
        .set(adminHeaders)
        .send({
          code: delSupCode,
          name: 'Temporary Supplier To Delete Ltd',
          contact: 'Test Contact',
          phone: '+92 300 9998888'
        })

      const res = await request(app)
        .delete(`/api/v1/procurement/suppliers/${delSupCode}`)
        .set(adminHeaders)

      assert.strictEqual(res.status, 200)

      // Direct MySQL Read-Back
      const rows = await query('SELECT * FROM `suppliers` WHERE `code` = ?', [delSupCode])
      assert.strictEqual(rows.length, 0, 'Supplier must be deleted from MySQL')
    })

    it('7.3 Destructive deletion rejects non-existent records with HTTP 404', async () => {
      const res = await request(app)
        .delete('/api/v1/customers/NON-EXISTENT-ID-999')
        .set(adminHeaders)

      assert.strictEqual(res.status, 404)
    })
  })
})
