import { describe, it, before, after } from 'node:test'
import assert from 'node:assert'
import request from 'supertest'
import { app } from '../src/app.js'
import { connectDB, disconnectDB } from '../src/config/db.js'
import { PricingService } from '../src/services/pricing.service.js'
import { getAdminAuthHeader, getBranchManagerAuthHeader } from './helpers/auth.helper.js'

describe('Pricing Validation Error Taxonomy & Structured Details Suite', () => {
  let isDbReady = false
  const adminHeaders = getAdminAuthHeader()
  const branchHeaders = getBranchManagerAuthHeader('BR-01', 'Peshawar')

  before(async () => {
    isDbReady = await connectDB()
  })

  after(async () => {
    await disconnectDB()
  })

  // Base ratified dealership policy for testing
  const ratifiedRule = {
    ruleId: 'RULE-RATIFIED-01',
    ruleName: 'Ratified BRG E-125 Dealership Standard',
    product: 'BRG E-125',
    productId: 'PROD-001',
    branch: 'Peshawar',
    branchId: 'BR-01',
    customerSegment: 'Standard',
    basePrice: 280000,
    minimumPrice: 260000, // Floor price: PKR 260,000
    costPrice: 200000,
    maxDiscountPercent: 5.0, // 5% of 280,000 = PKR 14,000
    maxDiscountPkr: 14000,
    minMarginPercent: 20.0, // 20% minimum margin required
    requiresApproval: true,
    isConfigured: true,
    isApprovedPolicy: true,
    policyClassification: 'Business-approved',
    status: 'Active',
    approvedBy: 'Super Admin'
  }

  // 1. Case 1: POLICY_UNCONFIRMED
  it('Case 1: should return POLICY_UNCONFIRMED when pricing rule is Demo, Draft, or unapproved', () => {
    const unapprovedRule = {
      ...ratifiedRule,
      isApprovedPolicy: false,
      policyClassification: 'Demo/example data',
      status: 'Demo',
      approvedBy: null
    }

    const res = PricingService.validateDiscount({
      rule: unapprovedRule,
      subtotal: 280000,
      discount: 5000,
      costPrice: 200000,
      isSuperAdmin: false
    })

    assert.strictEqual(res.allowed, false)
    assert.strictEqual(res.code, 'POLICY_UNCONFIRMED')
    assert.strictEqual(res.error, 'POLICY_UNCONFIRMED')
    assert.strictEqual(res.message, 'This pricing rule has not yet been approved by Super Admin.')

    // Validate structured details
    assert.ok(res.details, 'details object must be present')
    assert.strictEqual(res.details.product, 'BRG E-125')
    assert.strictEqual(res.details.branch, 'Peshawar')
    assert.strictEqual(res.details.appliedRule, 'Ratified BRG E-125 Dealership Standard')
    assert.strictEqual(res.details.requestedDiscount, 5000)
    assert.strictEqual(res.details.allowedPercentage, 0)
    assert.strictEqual(res.details.allowedPkrAmount, 0)
    assert.strictEqual(res.details.finalSellingPrice, 275000)
    assert.strictEqual(res.details.minimumSellingPrice, 260000)
    assert.strictEqual(typeof res.details.calculatedMargin, 'number')
    assert.strictEqual(res.details.requiredApproval, true)
  })

  // 2. Case 2: DISCOUNT_LIMIT_EXCEEDED
  it('Case 2: should return DISCOUNT_LIMIT_EXCEEDED when discount exceeds authority but price and margin are safe', () => {
    // Subtotal 280,000; allowed discount 14,000 (5%).
    // Requested discount: 18,000.
    // Final selling price: 262,000 (above min price 260,000).
    // Margin: (262,000 - 200,000) / 262,000 = 23.66% (above min margin 20%).
    const res = PricingService.validateDiscount({
      rule: ratifiedRule,
      subtotal: 280000,
      discount: 18000,
      costPrice: 200000,
      isSuperAdmin: false
    })

    assert.strictEqual(res.allowed, false)
    assert.strictEqual(res.code, 'DISCOUNT_LIMIT_EXCEEDED')
    assert.strictEqual(res.error, 'DISCOUNT_LIMIT_EXCEEDED')
    assert.strictEqual(res.message, 'This discount exceeds the approved limit for this product and branch.')

    // Validate structured details
    assert.ok(res.details, 'details object must be present')
    assert.strictEqual(res.details.product, 'BRG E-125')
    assert.strictEqual(res.details.branch, 'Peshawar')
    assert.strictEqual(res.details.appliedRule, 'Ratified BRG E-125 Dealership Standard')
    assert.strictEqual(res.details.requestedDiscount, 18000)
    assert.strictEqual(res.details.allowedPercentage, 5.0)
    assert.strictEqual(res.details.allowedPkrAmount, 14000)
    assert.strictEqual(res.details.finalSellingPrice, 262000)
    assert.strictEqual(res.details.minimumSellingPrice, 260000)
    assert.strictEqual(res.details.calculatedMargin, 23.7)
    assert.strictEqual(res.details.requiredApproval, true)
  })

  // 3. Case 3: BELOW_MINIMUM_PRICE
  it('Case 3: should return BELOW_MINIMUM_PRICE when selling price falls below minimum price floor', () => {
    // Rule allows higher discount (e.g. 10% = 28,000), but floor price is 265,000.
    const ruleWithHighLimit = {
      ...ratifiedRule,
      maxDiscountPercent: 10.0,
      maxDiscountPkr: 28000,
      minimumPrice: 265000
    }

    // Subtotal 280,000; discount 20,000 <= allowed 28,000.
    // Final selling price: 260,000 < minimum floor 265,000!
    const res = PricingService.validateDiscount({
      rule: ruleWithHighLimit,
      subtotal: 280000,
      discount: 20000,
      costPrice: 200000,
      isSuperAdmin: false
    })

    assert.strictEqual(res.allowed, false)
    assert.strictEqual(res.code, 'BELOW_MINIMUM_PRICE')
    assert.strictEqual(res.error, 'BELOW_MINIMUM_PRICE')
    assert.strictEqual(res.message, 'This selling price is below the permitted minimum price.')

    // Validate structured details
    assert.ok(res.details, 'details object must be present')
    assert.strictEqual(res.details.product, 'BRG E-125')
    assert.strictEqual(res.details.branch, 'Peshawar')
    assert.strictEqual(res.details.requestedDiscount, 20000)
    assert.strictEqual(res.details.allowedPercentage, 10.0)
    assert.strictEqual(res.details.allowedPkrAmount, 28000)
    assert.strictEqual(res.details.finalSellingPrice, 260000)
    assert.strictEqual(res.details.minimumSellingPrice, 265000)
    assert.strictEqual(res.details.requiredApproval, true)
  })

  // 4. Case 4: BELOW_MINIMUM_MARGIN
  it('Case 4: should return BELOW_MINIMUM_MARGIN when margin falls below configured minimum margin', () => {
    // Rule allows discount of 20,000 and floor price is 250,000.
    // Minimum margin is 25%.
    // Cost price is 220,000.
    const ruleHighMarginReq = {
      ...ratifiedRule,
      maxDiscountPercent: 10.0,
      maxDiscountPkr: 28000,
      minimumPrice: 250000,
      minMarginPercent: 25.0, // Requires 25% margin
      costPrice: 220000
    }

    // Subtotal 280,000; discount 15,000 <= allowed 28,000.
    // Final price: 265,000 > floor 250,000.
    // Calculated margin: (265,000 - 220,000) / 265,000 = 16.98% < required 25%!
    const res = PricingService.validateDiscount({
      rule: ruleHighMarginReq,
      subtotal: 280000,
      discount: 15000,
      costPrice: 220000,
      isSuperAdmin: false
    })

    assert.strictEqual(res.allowed, false)
    assert.strictEqual(res.code, 'BELOW_MINIMUM_MARGIN')
    assert.strictEqual(res.error, 'BELOW_MINIMUM_MARGIN')
    assert.strictEqual(res.message, 'This sale falls below the required minimum margin.')

    // Validate structured details
    assert.ok(res.details, 'details object must be present')
    assert.strictEqual(res.details.product, 'BRG E-125')
    assert.strictEqual(res.details.branch, 'Peshawar')
    assert.strictEqual(res.details.requestedDiscount, 15000)
    assert.strictEqual(res.details.finalSellingPrice, 265000)
    assert.strictEqual(res.details.minimumSellingPrice, 250000)
    assert.strictEqual(res.details.calculatedMargin, 17.0)
    assert.strictEqual(res.details.minimumMargin, 25.0)
    assert.strictEqual(res.details.requiredApproval, true)
  })

  // 5. Allowed Sale within all limits
  it('should allow sale when discount, floor price, and margin are all compliant', () => {
    // Discount of 10,000 <= 14,000; final price 270,000 > 260,000; margin (270k - 200k)/270k = 25.9% > 20%
    const res = PricingService.validateDiscount({
      rule: ratifiedRule,
      subtotal: 280000,
      discount: 10000,
      costPrice: 200000,
      isSuperAdmin: false
    })

    assert.strictEqual(res.allowed, true)
    assert.strictEqual(res.details.requiredApproval, false)
    assert.strictEqual(res.details.finalSellingPrice, 270000)
    assert.strictEqual(res.details.calculatedMargin, 25.9)
  })

  // 6. Super Admin Executive Override
  it('should allow Super Admin executive override regardless of showroom limits', () => {
    const res = PricingService.validateDiscount({
      rule: ratifiedRule,
      subtotal: 280000,
      discount: 50000, // Massive PKR 50k discount
      costPrice: 200000,
      isSuperAdmin: true
    })

    assert.strictEqual(res.allowed, true)
    assert.strictEqual(res.reason, 'Super Admin executive pricing authority override')
    assert.strictEqual(res.details.requiredApproval, false)
  })

  // 7. HTTP API: POST /api/v1/catalogue/pricing-rules/validate-discount
  it('HTTP API: should return 422 with structured details when validating discount against Demo rule', async () => {
    const res = await request(app)
      .post('/api/v1/catalogue/pricing-rules/validate-discount')
      .set(branchHeaders)
      .send({
        product_id: 'PROD-001',
        branch_id: 'BR-01',
        subtotal: 280000,
        discount: 5000
      })

    assert.strictEqual(res.status, 422)
    assert.strictEqual(res.body.ok, false)
    assert.strictEqual(res.body.code, 'POLICY_UNCONFIRMED')
    assert.strictEqual(res.body.error, 'POLICY_UNCONFIRMED')
    assert.strictEqual(res.body.message, 'This pricing rule has not yet been approved by Super Admin.')
    assert.ok(res.body.details, 'details must be present')
    assert.strictEqual(res.body.details.product, 'BRG E-125')
    assert.strictEqual(res.body.details.branch, 'Peshawar')
    assert.strictEqual(res.body.details.requestedDiscount, 5000)
    assert.strictEqual(res.body.details.requiredApproval, true)
  })

  // 8. HTTP API: POST /api/v1/orders
  it('HTTP API: POST /api/v1/orders should return 422 with POLICY_UNCONFIRMED when branch manager submits discount on unapproved rule', async () => {
    const res = await request(app)
      .post('/api/v1/orders')
      .set(branchHeaders)
      .send({
        customer: 'Walk-in Client',
        customer_id: 'CUST-101',
        branch: 'Peshawar',
        branch_id: 'BR-01',
        product_id: 'PROD-001',
        product: 'BRG E-125',
        subtotal: 280000,
        discount: 5000,
        total: 275000,
        items: [{
          product_id: 'PROD-001',
          product: 'BRG E-125',
          quantity: 1,
          unitPrice: 280000,
          subtotal: 280000
        }]
      })

    assert.strictEqual(res.status, 422)
    assert.strictEqual(res.body.ok, false)
    assert.strictEqual(res.body.error, 'POLICY_UNCONFIRMED')
    assert.strictEqual(res.body.message, 'This pricing rule has not yet been approved by Super Admin.')
    assert.ok(res.body.details, 'details must be present')
    assert.strictEqual(res.body.details.requestedDiscount, 5000)
    assert.strictEqual(res.body.details.requiredApproval, true)
  })

  // 9. HTTP API: POST /api/v1/quotations
  it('HTTP API: POST /api/v1/quotations should return 422 with POLICY_UNCONFIRMED when branch manager submits discount on unapproved rule', async () => {
    const res = await request(app)
      .post('/api/v1/quotations')
      .set(branchHeaders)
      .send({
        customer: 'Inquiry Client',
        customer_id: 'CUST-101',
        branch: 'Peshawar',
        branch_id: 'BR-01',
        product_id: 'PROD-001',
        product: 'BRG E-125',
        subtotal: 280000,
        discount: 5000,
        total: 275000,
        validity: '15 Days',
        items: [{
          product_id: 'PROD-001',
          product: 'BRG E-125',
          quantity: 1,
          sellingPrice: 280000
        }]
      })

    assert.strictEqual(res.status, 422)
    assert.strictEqual(res.body.ok, false)
    assert.strictEqual(res.body.error, 'POLICY_UNCONFIRMED')
    assert.strictEqual(res.body.message, 'This pricing rule has not yet been approved by Super Admin.')
    assert.ok(res.body.details, 'details must be present')
    assert.strictEqual(res.body.details.requestedDiscount, 5000)
    assert.strictEqual(res.body.details.requiredApproval, true)
  })
})
