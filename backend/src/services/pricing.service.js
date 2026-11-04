import { query } from '../config/db.js'
import { resolveBranchId } from '../utils/branchScope.js'

export const PricingService = {
  /**
   * Resolve the active effective pricing and discount rule for a product, branch, and customer segment
   */
  async resolveEffectiveRule({ productId, productName, branchId, customerSegment = 'Standard', date = new Date() }) {
    const canonicalBranch = resolveBranchId(branchId)
    const targetDate = date instanceof Date ? date.toISOString().split('T')[0] : String(date).split('T')[0]

    // 1. Query price rules (Active, Demo, Draft)
    const sql = `
      SELECT * FROM \`price_rules\`
      WHERE \`status\` IN ('Active', 'Demo', 'Draft')
      ORDER BY \`priority\` DESC, \`created_at\` DESC
    `
    const rules = await query(sql)

    // 2. Find best matching rule using cascading specificity
    // Priority order:
    // a. Exact (product_id or product) AND exact branch AND exact segment AND within date
    // b. Exact (product_id or product) AND (branch_id IS NULL OR branch_id = 'ALL') AND within date
    // c. Global customer segment rule AND within date
    // d. Safe default fallback
    let matchedRule = null

    for (const rule of rules) {
      // Date range check
      if (rule.effective_from && rule.effective_from > targetDate) continue
      if (rule.effective_to && rule.effective_to < targetDate) continue

      // Product match
      const productMatches = (!rule.product_id && (!rule.product || rule.product === 'All Products')) ||
                             (productId && rule.product_id === productId) ||
                             (productName && rule.product && rule.product.toLowerCase() === productName.toLowerCase())

      if (!productMatches) continue

      // Branch match
      const ruleBranch = resolveBranchId(rule.branch_id || rule.branch_override || rule.branch)
      const isGlobalBranch = !ruleBranch || ruleBranch === 'ALL'
      const branchMatches = isGlobalBranch || (canonicalBranch && ruleBranch === canonicalBranch)

      if (!branchMatches) continue

      // Customer segment match
      const segmentMatches = !rule.customer_segment || 
                             rule.customer_segment === 'All' || 
                             rule.customer_segment.toLowerCase() === customerSegment.toLowerCase()

      if (!segmentMatches) continue

      // We found the highest priority matching rule
      matchedRule = rule
      break
    }

    // 3. Fallback to product catalogue price if no rule or rule has 0 base_price
    let catalogPrice = 0
    let costPrice = 0
    let productRecord = null

    if (productId || productName) {
      const prodRows = await query(
        'SELECT * FROM `products` WHERE `id` = ? OR `name` = ? LIMIT 1',
        [productId || '', productName || '']
      )
      if (prodRows.length > 0) {
        productRecord = prodRows[0]
        catalogPrice = parseFloat(productRecord.selling_price || 0)
        costPrice = parseFloat(productRecord.cost_price || 0)
      }
    }

    if (matchedRule) {
      const isApprovedPolicy = matchedRule.status === 'Active' && matchedRule.policy_classification === 'Business-approved' && Boolean(matchedRule.approved_by)
      const basePrice = parseFloat(matchedRule.branch_price || matchedRule.base_price || catalogPrice)
      const minPrice = matchedRule.minimum_price ? parseFloat(matchedRule.minimum_price) : (matchedRule.minimum ? parseFloat(String(matchedRule.minimum).replace(/[^0-9.]/g, '') * (matchedRule.minimum.includes('K') ? 1000 : 1)) : Math.round(basePrice * 0.95))
      const maxDiscountPercent = parseFloat(matchedRule.max_discount_percent || matchedRule.discount_percent || 0)
      const maxDiscountPkr = parseFloat(matchedRule.max_discount_pkr || 0)
      const minMarginPercent = parseFloat(matchedRule.min_margin_percent || matchedRule.margin || 15)

      return {
        ruleId: matchedRule.id,
        ruleName: matchedRule.rule_name || matchedRule.id,
        productId: matchedRule.product_id || productRecord?.id,
        product: matchedRule.product || productRecord?.name,
        productVariant: matchedRule.product_variant || null,
        branchId: matchedRule.branch_id || canonicalBranch,
        branch: matchedRule.branch || 'Branch Context',
        customerSegment,
        basePrice,
        minimumPrice: minPrice,
        costPrice,
        maxDiscountPercent,
        maxDiscountPkr,
        minMarginPercent,
        requiresApproval: !isApprovedPolicy || Boolean(matchedRule.requires_approval ?? 1),
        isConfigured: true,
        isApprovedPolicy,
        policyClassification: matchedRule.policy_classification || (matchedRule.status === 'Demo' ? 'Demo/example data' : 'Unconfirmed configuration'),
        status: matchedRule.status,
        approvedBy: matchedRule.approved_by || null
      }
    }

    // Safe configured default when no rule exists: Zero unapproved discount permitted
    return {
      ruleId: 'DEFAULT-SAFE',
      ruleName: 'Default Dealership Policy (No Approved Rule Configured)',
      productId: productRecord?.id || productId,
      product: productRecord?.name || productName,
      productVariant: null,
      branchId: canonicalBranch,
      branch: 'Branch Context',
      customerSegment,
      basePrice: catalogPrice,
      minimumPrice: catalogPrice, // Cannot sell below catalogue without approval
      costPrice,
      maxDiscountPercent: 0.00,
      maxDiscountPkr: 0.00,
      minMarginPercent: 15.0,
      requiresApproval: true,
      isConfigured: false,
      isApprovedPolicy: false,
      policyClassification: 'Not Configured',
      status: 'Not Configured',
      approvedBy: null
    }
  },

  /**
   * Validate a proposed sale or quotation discount against the resolved pricing rule.
   * Strict four-case taxonomy:
   * 1. POLICY_UNCONFIRMED
   * 2. DISCOUNT_LIMIT_EXCEEDED
   * 3. BELOW_MINIMUM_PRICE
   * 4. BELOW_MINIMUM_MARGIN
   */
  validateDiscount({ rule, subtotal, discount, costPrice, isSuperAdmin = false }) {
    const numSubtotal = parseFloat(subtotal || 0)
    const numDiscount = parseFloat(discount || 0)
    const finalPrice = Math.max(0, numSubtotal - numDiscount)
    const effectiveCost = parseFloat(costPrice || rule?.costPrice || 0)
    const calculatedMargin = finalPrice > 0
      ? Math.round(((finalPrice - effectiveCost) / finalPrice) * 1000) / 10
      : 0
    const minPrice = parseFloat(rule?.minimumPrice || rule?.minimum_price || 0)
    const minMargin = parseFloat(rule?.minMarginPercent || rule?.min_margin_percent || 0)
    const allowedPct = parseFloat(rule?.maxDiscountPercent || rule?.max_discount_percent || 0)
    const allowedPkrCap = parseFloat(rule?.maxDiscountPkr || rule?.max_discount_pkr || 0)
    const allowedByPercent = allowedPct > 0 ? (numSubtotal * (allowedPct / 100)) : 0
    const maxAllowedDiscount = Math.max(allowedByPercent, allowedPkrCap)

    const baseDetails = {
      product: rule?.product || 'Vehicle',
      branch: rule?.branch || 'Branch Context',
      appliedRule: rule?.ruleName || rule?.rule_name || rule?.id || 'Dealership Policy',
      requestedDiscount: numDiscount,
      allowedPercentage: allowedPct,
      allowedPkrAmount: maxAllowedDiscount,
      finalSellingPrice: finalPrice,
      minimumSellingPrice: minPrice,
      calculatedMargin,
      minimumMargin: minMargin,
      requiredApproval: false
    }

    if (isSuperAdmin) {
      return {
        allowed: true,
        reason: 'Super Admin executive pricing authority override',
        details: { ...baseDetails, requiredApproval: false }
      }
    }

    if (numDiscount <= 0) {
      return {
        allowed: true,
        details: baseDetails
      }
    }

    // 1. Unapproved Rule: Demo, Draft, Unconfirmed, or not ratified
    if (!rule || !rule.isApprovedPolicy) {
      return {
        allowed: false,
        error: 'POLICY_UNCONFIRMED',
        code: 'POLICY_UNCONFIRMED',
        message: 'This pricing rule has not yet been approved by Super Admin.',
        details: {
          ...baseDetails,
          allowedPercentage: 0,
          allowedPkrAmount: 0,
          requiredApproval: true,
          policyClassification: rule?.policyClassification || 'Demo/example data'
        }
      }
    }

    // 2. Requested discount exceeds configured discount authority
    if (numDiscount > maxAllowedDiscount) {
      return {
        allowed: false,
        error: 'DISCOUNT_LIMIT_EXCEEDED',
        code: 'DISCOUNT_LIMIT_EXCEEDED',
        message: 'This discount exceeds the approved limit for this product and branch.',
        details: {
          ...baseDetails,
          requiredApproval: true
        }
      }
    }

    // 3. Resulting selling price falls below configured minimum selling price
    if (minPrice > 0 && finalPrice < minPrice) {
      return {
        allowed: false,
        error: 'BELOW_MINIMUM_PRICE',
        code: 'BELOW_MINIMUM_PRICE',
        message: 'This selling price is below the permitted minimum price.',
        details: {
          ...baseDetails,
          requiredApproval: true
        }
      }
    }

    // 4. Resulting margin falls below configured minimum margin
    if (minMargin > 0 && effectiveCost > 0 && calculatedMargin < minMargin) {
      return {
        allowed: false,
        error: 'BELOW_MINIMUM_MARGIN',
        code: 'BELOW_MINIMUM_MARGIN',
        message: 'This sale falls below the required minimum margin.',
        details: {
          ...baseDetails,
          requiredApproval: true
        }
      }
    }

    return {
      allowed: true,
      details: baseDetails
    }
  }
}

