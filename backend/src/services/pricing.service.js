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
      requiresApproval: true,
      isConfigured: false,
      isApprovedPolicy: false,
      policyClassification: 'Not Configured',
      status: 'Not Configured',
      approvedBy: null
    }
  },

  /**
   * Validate a proposed sale or quotation discount against the resolved pricing rule
   */
  validateDiscount({ rule, subtotal, discount, isSuperAdmin = false }) {
    if (isSuperAdmin) {
      return {
        allowed: true,
        reason: 'Super Admin executive pricing authority override'
      }
    }

    const numSubtotal = parseFloat(subtotal || 0)
    const numDiscount = parseFloat(discount || 0)
    const finalPrice = Math.max(0, numSubtotal - numDiscount)

    if (numDiscount <= 0) {
      return { allowed: true }
    }

    // 0. Unapproved Demo / Unconfirmed Rule Restriction
    if (!rule.isApprovedPolicy) {
      return {
        allowed: false,
        error: 'POLICY_UNCONFIRMED',
        message: `Pricing and discount rule '${rule.ruleName}' is marked as '${rule.policyClassification || 'Unconfirmed configuration (Demo / Example Data)'}' and has not been approved by dealership leadership. Any discount requires Super Admin authorization.`,
        ruleName: rule.ruleName,
        policyClassification: rule.policyClassification,
        requested: numDiscount
      }
    }

    // 1. Minimum Price Floor Verification
    if (rule.minimumPrice && finalPrice < rule.minimumPrice) {
      return {
        allowed: false,
        error: 'BELOW_MINIMUM_PRICE',
        message: `Final selling price of PKR ${finalPrice.toLocaleString()} is below the minimum permitted price floor of PKR ${rule.minimumPrice.toLocaleString()} under rule '${rule.ruleName}'. Sale requires Super Admin approval.`
      }
    }

    // 2. Maximum Allowed Discount Calculation
    const allowedByPercent = rule.maxDiscountPercent > 0 ? (numSubtotal * (rule.maxDiscountPercent / 100)) : 0
    const allowedByPkr = rule.maxDiscountPkr > 0 ? rule.maxDiscountPkr : 0
    const maxAllowedDiscount = Math.max(allowedByPercent, allowedByPkr)

    if (numDiscount > maxAllowedDiscount) {
      const allowedDesc = []
      if (rule.maxDiscountPercent > 0) allowedDesc.push(`${rule.maxDiscountPercent}%`)
      if (rule.maxDiscountPkr > 0) allowedDesc.push(`PKR ${rule.maxDiscountPkr.toLocaleString()}`)
      const allowedStr = allowedDesc.join(' or ') || 'PKR 0 (Zero discount authorized)'

      return {
        allowed: false,
        error: 'DISCOUNT_EXCEEDS_LIMIT',
        message: `Discount of PKR ${numDiscount.toLocaleString()} exceeds Branch Manager authorization for ${rule.product || 'this product'} at ${rule.branch || 'this branch'} (Configured limit: ${allowedStr} under '${rule.ruleName}'). Super Admin approval required.`,
        ruleName: rule.ruleName,
        maxAllowed: maxAllowedDiscount,
        requested: numDiscount
      }
    }

    return { allowed: true }
  }
}

