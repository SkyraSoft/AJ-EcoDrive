/**
 * AJ EcoDrive — Branch Manager DAP Business Rule Provenance Registry
 * Authoritative Classification of Business Logic, Regulatory Thresholds, and Field Validation
 *
 * Source Classifications:
 * - CODE-VERIFIED: Directly grounded and enforced in src/store.js, views, or existing test suites.
 * - PROJECT-DOCUMENTED: Grounded in AJ_ECODRIVE_COMPLETE_CLIENT_GUIDE_QA.md or system architecture.
 * - DEMO/TRAINING EXAMPLE: Illustrative training guidelines without hard system enforcement.
 * - UNSUPPORTED: Prohibited from claiming authoritative status.
 */

export const branchManagerBusinessRules = [
  {
    id: 'rule-customer-mandatory-fields',
    name: 'Customer Registration Mandatory Fields',
    category: 'Sales & KYC',
    rule: 'First Name (or Full Name) and Phone Number are strictly mandatory to register a customer.',
    classification: 'CODE-VERIFIED',
    sourceFile: 'src/views/sales/CreateCustomer.vue',
    sourceReference: 'createCustomer() validation: (!formData.value.firstName.trim() && !formData.value.name.trim()) || !formData.value.phone.trim()',
    verified: true,
    enforcement: 'Application blocks customer creation modal with showValidation = true.'
  },
  {
    id: 'rule-commercial-discount-ceiling',
    name: 'Branch Manager 8% Commercial Discount Ceiling',
    category: 'Commercial Pricing',
    rule: 'Branch Managers have an 8% discretionary discount ceiling on EV models. Discounts > 8% require Head Office Action Centre Flow 1 approval.',
    classification: 'PROJECT-DOCUMENTED',
    sourceFile: 'AJ_ECODRIVE_COMPLETE_CLIENT_GUIDE_QA.md',
    sourceReference: 'Q115 ("Automated 8% Discount Ceiling Guard"), Q379, Q408',
    verified: true,
    enforcement: 'Quotation engine routes discounts exceeding 8% to Action Centre Flow 1.'
  },
  {
    id: 'rule-petty-cash-local-ceiling',
    name: 'Showroom Petty Cash Local Approval Limit',
    category: 'Showroom Finance',
    rule: 'Branch Managers have a PKR 15,000 single expense voucher discretionary ceiling. Expenses > PKR 15,000 require Head Office Action Centre Flow 3 sign-off.',
    classification: 'PROJECT-DOCUMENTED',
    sourceFile: 'AJ_ECODRIVE_COMPLETE_CLIENT_GUIDE_QA.md',
    sourceReference: 'Q327, Q3651, Q379 ("PKR 15,000 Petty Cash OPEX local approval limit")',
    verified: true,
    enforcement: 'Vouchers over PKR 15,000 are escalated to Head of Finance via Action Centre.'
  },
  {
    id: 'rule-customer-cnic-format',
    name: 'Pakistani CNIC Format',
    category: 'Identity Verification',
    rule: 'Computerized National Identity Card (CNIC) follows 13-digit hyphenated format (XXXXX-XXXXXXX-X).',
    classification: 'PROJECT-DOCUMENTED',
    sourceFile: 'AJ_ECODRIVE_COMPLETE_CLIENT_GUIDE_QA.md',
    sourceReference: 'Q46, Q112 & src/views/sales/CreateCustomer.vue formData.cnic',
    verified: true,
    enforcement: 'Validated for vehicle registration, excise transfer, and tax compliance.'
  },
  {
    id: 'rule-customer-phone-format',
    name: 'Pakistani Mobile Contact Format',
    category: 'Customer Contact',
    rule: 'Pakistani mobile telephone number format begins with 03 followed by 9 digits (03XXXXXXXXX).',
    classification: 'PROJECT-DOCUMENTED',
    sourceFile: 'AJ_ECODRIVE_COMPLETE_CLIENT_GUIDE_QA.md',
    sourceReference: 'Q46, Q112 & src/views/sales/CreateLead.vue phone input',
    verified: true,
    enforcement: 'Standard 11-digit string required for automated SMS/WhatsApp dispatch.'
  },
  {
    id: 'rule-quotation-validity-window',
    name: 'Quotation 7-Day Validity Lock',
    category: 'Commercial Pricing',
    rule: 'Formal sales quotations have a guaranteed 7-calendar-day validity period.',
    classification: 'PROJECT-DOCUMENTED',
    sourceFile: 'AJ_ECODRIVE_COMPLETE_CLIENT_GUIDE_QA.md',
    sourceReference: 'Q118, Q665, Q1432',
    verified: true,
    enforcement: 'Quotation status automatically moves to Expired if not converted to order within 7 days.'
  },
  {
    id: 'rule-battery-warranty-criteria',
    name: 'OEM Lithium Battery Warranty Threshold',
    category: 'After-Sales & Warranty',
    rule: 'Valid battery warranty replacement is triggered when Battery SOH drops below 70% within 2-Year / 30,000 km standard OEM warranty period.',
    classification: 'PROJECT-DOCUMENTED',
    sourceFile: 'AJ_ECODRIVE_COMPLETE_CLIENT_GUIDE_QA.md',
    sourceReference: 'Q206 ("Standard OEM Warranty Criteria: SOH drops below 70%")',
    verified: true,
    enforcement: 'Triggers Action Centre Flow 4 warranty replacement request to OEM CTO.'
  },
  {
    id: 'rule-chassis-vin-flexibility',
    name: 'Chassis VIN and Internal Serial Format Compatibility',
    category: 'Inventory Management',
    rule: 'Application supports both standard 17-character ISO VINs and internal serial asset codes (e.g. CH-90111, UNIT-101, TEST-VIN-...).',
    classification: 'CODE-VERIFIED',
    sourceFile: 'src/store.js',
    sourceReference: 'store.serializedUnits: unit.vin, unit.chassis_number, tests/test_master_readiness.js',
    verified: true,
    enforcement: 'DAP must not artificially reject valid internal vehicle serial numbers.'
  },
  {
    id: 'rule-morning-cash-float',
    name: 'Morning Showroom Cash Drawer Float',
    category: 'Showroom Operations',
    rule: 'Showroom cashier drawer opening float standard is PKR 50,000 (verified jointly by cashier and branch manager).',
    classification: 'PROJECT-DOCUMENTED',
    sourceFile: 'AJ_ECODRIVE_COMPLETE_CLIENT_GUIDE_QA.md',
    sourceReference: 'Q379, Q3817 & store.finance',
    verified: true,
    enforcement: 'Dual-signature register signed before opening trading.'
  },
  {
    id: 'rule-order-advance-deposit',
    name: 'Vehicle Booking Advance Deposit',
    category: 'Booking Operations',
    rule: 'Suggested initial deposit to freeze unit allocation (typically PKR 50,000 to PKR 100,000).',
    classification: 'DEMO/TRAINING EXAMPLE',
    sourceFile: 'DAP Training Curriculum',
    sourceReference: 'Demonstration scenario for customer booking deposit verification',
    verified: false,
    note: 'Flexible commercial term negotiated per branch or customer agreement.'
  },
  {
    id: 'rule-pdi-checklist-guideline',
    name: 'Pre-Delivery Inspection (PDI) Checklist',
    category: 'PDI & Handover',
    rule: 'Multi-point technical inspection covering battery SOC, tyre pressure, brakes, cosmetic finish, and charger handover.',
    classification: 'DEMO/TRAINING EXAMPLE',
    sourceFile: 'DAP Training Curriculum',
    sourceReference: 'Demonstration scenario for pre-delivery technical verification',
    verified: false,
    note: 'Actual physical PDI checklist varies by vehicle model (Alpha vs Apex vs Commercial Van).'
  }
];

export function getBusinessRuleById(id) {
  return branchManagerBusinessRules.find(r => r.id === id) || null;
}

export function getRulesByClassification(classification) {
  return branchManagerBusinessRules.filter(r => r.classification === classification);
}

export default {
  rules: branchManagerBusinessRules,
  getBusinessRuleById,
  getRulesByClassification
};
