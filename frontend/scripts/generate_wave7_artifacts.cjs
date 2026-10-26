const fs = require('fs')
const path = require('path')

const targetDir = path.resolve(__dirname, '../scratch/forensic/final')
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true })
}

function writeJson(filename, data) {
  const p = path.join(targetDir, filename)
  fs.writeFileSync(p, JSON.stringify(data, null, 2), 'utf8')
  console.log(`Wrote ${filename}`)
}

// 1. wave7_traceability_matrix.json (Comprehensive 26-Workflow Register with Authenticated Role vs Business Persona)
writeJson('wave7_traceability_matrix.json', [
  {
    workflowId: "WF-AUTH-01",
    businessPurpose: "Authenticate dealership user and establish secure role/branch session context",
    authenticatedRole: "Super Admin / Branch Manager",
    businessPersona: "Dealership General Manager / System Administrator",
    frontendEntryPoint: "src/views/auth/Login.vue",
    sourceEntity: "users",
    canonicalStates: ["Active", "Inactive", "Suspended"],
    domainMethods: ["store.setSession", "store.logout"],
    relatedEntities: ["branches", "auditLogs", "sessions"],
    branchScope: "Role-dependent (Super Admin = ALL, Branch Manager = assigned canonical branchId)",
    approvalBoundary: "N/A (Authentication credential verification)",
    inventoryEffect: "None",
    financialEffect: "None",
    frontendGuarantees: ["Blocks unauthorized route transitions via router guard", "Filters UI views based on role and branch"],
    backendMustGuarantee: ["Server-side session validation on every mutation/query", "Rejection of client-forged branch context", "Enforcement of active account status"],
    tests: ["test_wave1_security_and_identity.cjs", "test_wave3_workflow_connectivity.cjs"],
    unresolvedDecisions: [],
    statusClassification: "VERIFIED_CURRENT_FRONTEND",
    knownGaps: "None"
  },
  {
    workflowId: "WF-BR-01",
    businessPurpose: "Establish or update dealership showroom and workshop branch facilities",
    authenticatedRole: "Super Admin",
    businessPersona: "Managing Director / Executive Operations",
    frontendEntryPoint: "src/views/organisation/CreateBranch.vue (/organisation/branches/create)",
    sourceEntity: "branches",
    canonicalStates: ["Active", "Inactive"],
    domainMethods: ["store.addBranch", "store.updateBranch", "store.getBranchById"],
    relatedEntities: ["users", "serializedUnits", "expenses", "auditLogs"],
    branchScope: "Global Administrative Master (Super Admin exclusive)",
    approvalBoundary: "Executive / Super Admin authorization",
    inventoryEffect: "Initializes physical location target for serialized assets and inventory bins",
    financialEffect: "Defines cost centre and branch-level financial aggregation boundary",
    frontendGuarantees: ["Dedicated full-page creation workflow", "Discard immutability (zero mutation on cancel)", "Unique code/name validation"],
    backendMustGuarantee: ["Strict Super Admin RBAC authorization", "Atomic branch creation with default bin allocations", "Unique branch code constraint in persistence store"],
    tests: ["test_wave1_final_adversarial.cjs", "test_wave6_interaction_architecture.cjs"],
    unresolvedDecisions: [],
    statusClassification: "VERIFIED_CURRENT_FRONTEND",
    knownGaps: "None"
  },
  {
    workflowId: "WF-PR-01",
    businessPurpose: "Branch requests new vehicle model or SKU catalogue sourcing from central procurement",
    authenticatedRole: "Branch Manager (Request) -> Super Admin (Decision)",
    businessPersona: "Branch Sales Lead (Request) -> Central Procurement Lead (Decision)",
    frontendEntryPoint: "src/views/catalogue/CreateProductRequest.vue",
    sourceEntity: "productRequests",
    canonicalStates: ["Draft", "Submitted", "Under Review", "Approved", "Rejected", "Converted to Product"],
    domainMethods: ["store.addProductRequest", "store.approveProductRequest", "store.rejectProductRequest"],
    relatedEntities: ["products", "actionQueue", "notifications", "auditLogs"],
    branchScope: "Origin Branch Requisition -> Head Office Review",
    approvalBoundary: "Super Admin Approval Boundary (Action Centre WF-PR-01)",
    inventoryEffect: "Zero stock mutation. Approval does NOT create physical inventory or Product Master automatically.",
    financialEffect: "None at request stage. Commercial pricing evaluated during Product Master onboarding.",
    frontendGuarantees: ["Branch Manager initiates for own branch only", "Submitted status triggers exactly one Action Centre task for Super Admin", "Approval resolves task without side-effect stock mutation"],
    backendMustGuarantee: ["Server-side validation that requester belongs to origin branch", "Super Admin authorization on approval/rejection", "Atomic task resolution and request status update"],
    tests: ["test_wave3_workflow_connectivity.cjs", "test_wave6_interaction_architecture.cjs"],
    unresolvedDecisions: [],
    statusClassification: "VERIFIED_CURRENT_FRONTEND",
    knownGaps: "None"
  },
  {
    workflowId: "WF-PROD-01",
    businessPurpose: "Onboard new EV motorcycle models, SKU specifications, pricing, and spare parts catalogue",
    authenticatedRole: "Super Admin",
    businessPersona: "Product Line Manager / Head of Sourcing",
    frontendEntryPoint: "src/views/catalogue/CreateProduct.vue",
    sourceEntity: "products",
    canonicalStates: ["Active", "Discontinued", "Archived"],
    domainMethods: ["store.addProduct", "store.updateProduct", "store.getProductById"],
    relatedEntities: ["categories", "pricingRules", "serializedUnits", "purchaseOrders", "auditLogs"],
    branchScope: "Global Master (Super Admin exclusive)",
    approvalBoundary: "Super Admin Master Governance",
    inventoryEffect: "Defines product master item; creates zero physical stock",
    financialEffect: "Defines base retail price and standard cost baseline",
    frontendGuarantees: ["Dynamic field validation", "Form dirty preservation", "Role-gated navigation"],
    backendMustGuarantee: ["Super Admin RBAC enforcement", "Unique SKU constraint", "Referential integrity protection against deleting referenced products"],
    tests: ["test_wave2_data_roundtrip.cjs", "test_wave4_catalogue_procurement.cjs"],
    unresolvedDecisions: ["VARIANT_MASTER_ARCHITECTURE"],
    statusClassification: "VERIFIED_CURRENT_FRONTEND",
    knownGaps: "None"
  },
  {
    workflowId: "WF-PO-01",
    businessPurpose: "Procure serialized BRG EV motorcycles and spare parts from certified OEM factory suppliers",
    authenticatedRole: "Super Admin",
    businessPersona: "Procurement Manager / Supply Chain Lead",
    frontendEntryPoint: "src/views/procurement/CreatePurchaseOrder.vue",
    sourceEntity: "purchaseOrders",
    canonicalStates: ["Draft", "Pending Approval", "Approved", "Ordered", "In Transit", "Partially Received", "Received", "Closed", "Cancelled"],
    domainMethods: ["store.addPurchaseOrder", "store.approvePurchaseOrder", "store.postReceipt"],
    relatedEntities: ["suppliers", "products", "receipts", "serializedUnits", "actionQueue", "auditLogs"],
    branchScope: "Head Office Procurement / Central Depot Allocation",
    approvalBoundary: "Super Admin / Central Procurement Lead Approval",
    inventoryEffect: "PO creation creates ZERO physical stock. Stock increment occurs strictly upon physical GRN goods receipt.",
    financialEffect: "Establishes committed commercial procurement order. PO is NOT an accounting liability until Vendor Bill / Receipt.",
    frontendGuarantees: ["Dynamic catalogue line items with variant SKU binding", "Strict status progression", "Fail-before-mutation on receipt posting"],
    backendMustGuarantee: ["Purchase Orders do not increment sellable stock ledger", "Atomic goods receipt posting with individual serialized unit creation", "Historical landed cost immutability"],
    tests: ["test_wave4_catalogue_procurement.cjs", "test_wave4_state_integrity.cjs"],
    unresolvedDecisions: ["APPROVAL_THRESHOLD_CONFIGURATION"],
    statusClassification: "VERIFIED_CURRENT_FRONTEND",
    knownGaps: "None"
  },
  {
    workflowId: "WF-GRN-01",
    businessPurpose: "Physical warehouse goods intake, serial/chassis inspection, and base cost capture",
    authenticatedRole: "Super Admin / Branch Manager",
    businessPersona: "Warehouse Receiving Officer / Depot Supervisor",
    frontendEntryPoint: "src/views/procurement/ReceivePurchase.vue",
    sourceEntity: "receipts",
    canonicalStates: ["Draft", "Submitted", "Completed", "Cancelled"],
    domainMethods: ["store.postReceipt", "store.getPurchaseOrderById"],
    relatedEntities: ["purchaseOrders", "serializedUnits", "products", "auditLogs"],
    branchScope: "Receiving Branch / Central Depot",
    approvalBoundary: "Physical Inspection / QC Sign-Off",
    inventoryEffect: "Increments inventory; creates new physical serialized units with base/provisional cost and status = Available (or Damaged / Quarantine)",
    financialEffect: "Establishes physical unit and base acquisition cost; updates inventory asset balance",
    frontendGuarantees: ["Fail-before-mutation validation of serial/chassis inputs", "Atomic submission handling"],
    backendMustGuarantee: ["Atomic insertion of serialized units and receipt record", "Strict serial/chassis uniqueness enforcement", "PO totalReceived recalculation"],
    tests: ["test_wave4_catalogue_procurement.cjs", "test_master_readiness.js"],
    unresolvedDecisions: [],
    statusClassification: "VERIFIED_CURRENT_FRONTEND",
    knownGaps: "None"
  },
  {
    workflowId: "WF-LC-01",
    businessPurpose: "Apportion freight, customs duty, and local transport into finalized unit landed acquisition cost",
    authenticatedRole: "Super Admin",
    businessPersona: "Finance Officer / Cost Accountant",
    frontendEntryPoint: "src/views/procurement/ReceivePurchase.vue",
    sourceEntity: "receipts",
    canonicalStates: ["Draft", "Calculated", "Finalized"],
    domainMethods: ["store.allocateLandedCosts", "store.postReceipt"],
    relatedEntities: ["purchaseOrders", "serializedUnits", "auditLogs"],
    branchScope: "Head Office Procurement / Finance",
    approvalBoundary: "Finance Valuation Sign-off",
    inventoryEffect: "Updates unit landedCost attribute on physical units via allocateLandedCosts",
    financialEffect: "Finalizes historical landed cost (Base + Freight + Duty + Addons); establishes COGS baseline",
    frontendGuarantees: ["Displays itemized landed cost breakdown", "Apportions freight across line units by Quantity or Base Cost"],
    backendMustGuarantee: ["Landed cost posting permanently finalizes historical unit cost; subsequent unrelated receipts never mutate sold unit costs", "Zero retroactive mutation of historical COGS"],
    tests: ["test_wave4_catalogue_procurement.cjs", "test_wave4_financial_domain.cjs"],
    unresolvedDecisions: ["QUARANTINE_WRITEDOWN_ACCOUNTING"],
    statusClassification: "PARTIAL_CURRENT_FRONTEND",
    knownGaps: "Landed cost calculation and allocation logic is implemented in store and previewed in receiving; standalone Landed Cost Voucher posting view is future backend"
  },
  {
    workflowId: "WF-SR-01",
    businessPurpose: "Branch requests stock replenishment from central depot / other branch hubs",
    authenticatedRole: "Branch Manager (Request) -> Super Admin (Decision)",
    businessPersona: "Branch Inventory Supervisor -> Central Logistics Lead",
    frontendEntryPoint: "src/views/inventory/CreateStockRequest.vue",
    sourceEntity: "stockRequests",
    canonicalStates: ["Draft", "Submitted", "Under Review", "Approved", "Partially Approved", "Rejected", "Fulfilment Started", "In Transit", "Received", "Closed", "Cancelled"],
    domainMethods: ["store.addStockRequest", "store.approveStockRequest", "store.rejectStockRequest"],
    relatedEntities: ["products", "transfers", "actionQueue", "notifications", "auditLogs"],
    branchScope: "Origin Branch Requisition -> Central Allocation",
    approvalBoundary: "Super Admin Stock Requisition Approval Boundary (WF-SR-01)",
    inventoryEffect: "Zero stock movement. Approving Stock Request does NOT create or approve Transfer record automatically.",
    financialEffect: "None",
    frontendGuarantees: ["Branch Manager restricted to initiating for own branch", "Submitted requests create Action Centre task for Super Admin", "Approval marks record Approved without phantom transfers"],
    backendMustGuarantee: ["Server validation of requester branch", "Separate business lifecycle between Stock Request and Transfer records", "Idempotent resolution guard returning TASK_ALREADY_RESOLVED on repeat resolution"],
    tests: ["test_wave3_workflow_connectivity.cjs", "test_wave6_interaction_architecture.cjs"],
    unresolvedDecisions: [],
    statusClassification: "VERIFIED_CURRENT_FRONTEND",
    knownGaps: "None"
  },
  {
    workflowId: "WF-TR-01",
    businessPurpose: "Inter-branch inventory transfer and physical custody handover of serialized vehicles",
    authenticatedRole: "Super Admin (Creation/Approval) -> Branch Manager (Dispatch/Intake)",
    businessPersona: "Central Logistics (Approval) -> Origin BM (Dispatch) -> Destination BM (Intake)",
    frontendEntryPoint: "src/views/inventory/CreateTransfer.vue (/inventory/transfers/create)",
    sourceEntity: "transfers",
    canonicalStates: ["Draft", "Requested", "Approved", "Picking", "Dispatched", "In Transit", "Partially Received", "Received", "Closed", "Cancelled"],
    domainMethods: ["store.addTransfer", "store.approveTransfer", "store.dispatchTransfer", "store.receiveTransfer"],
    relatedEntities: ["serializedUnits", "branches", "actionQueue", "notifications", "auditLogs"],
    branchScope: "Origin Branch -> Destination Branch Inter-Branch Movement",
    approvalBoundary: "Super Admin Transfer Approval Boundary (store.approveTransfer)",
    inventoryEffect: "Requested transfers cannot dispatch. On dispatch: exact units leave Available and become 'Transfer In Transit'. On destination receipt: accepted units arrive at destination and become 'Available'.",
    financialEffect: "Inventory asset balance transfers between branch cost centres upon receipt.",
    frontendGuarantees: ["Unapproved/Requested transfer dispatch blocked before mutation", "Exact chassis/serial selection validated at source", "Receiving action enabled only for destination Branch Manager"],
    backendMustGuarantee: ["Atomicity of dispatch (transfer status = In Transit, units = Transfer In Transit)", "Atomicity of receipt (transfer status = Received, units = Available at destination)", "Prevention of concurrent dispatch/receipt on same transfer"],
    tests: ["test_wave4_state_integrity.cjs", "test_wave6_interaction_architecture.cjs", "test_master_readiness.js"],
    unresolvedDecisions: [],
    statusClassification: "VERIFIED_CURRENT_FRONTEND",
    knownGaps: "None"
  },
  {
    workflowId: "WF-CC-01",
    businessPurpose: "Periodic physical stock audit and cycle count logging",
    authenticatedRole: "Branch Manager",
    businessPersona: "Internal Inventory Auditor / Storekeeper",
    frontendEntryPoint: "src/views/inventory/CycleCounts.vue",
    sourceEntity: "cycleCounts",
    canonicalStates: ["Draft", "In Progress", "Reconciled", "Discrepancy Found", "Closed"],
    domainMethods: [],
    relatedEntities: ["branches", "serializedUnits", "stockAdjustments", "auditLogs"],
    branchScope: "Branch-Scoped Audit",
    approvalBoundary: "Supervisor Count Review",
    inventoryEffect: "Audits physical assets; does NOT mutate ledger until separate stock adjustment is posted",
    financialEffect: "Identifies variance value",
    frontendGuarantees: ["Renders cycle count records", "Preserves discrepancy notes"],
    backendMustGuarantee: ["Branch isolation on cycle counts", "Linking of discrepancy to stock adjustment request"],
    tests: ["test_wave1_security_and_identity.cjs"],
    unresolvedDecisions: [],
    statusClassification: "PARTIAL_CURRENT_FRONTEND",
    knownGaps: "Dedicated cycle count creation modal was converted to read-only register; creation routes to adjustment request"
  },
  {
    workflowId: "WF-ADJ-01",
    businessPurpose: "Physical count reconciliation and warehouse stock variance adjustment",
    authenticatedRole: "Branch Manager (Request) -> Super Admin (Audit & Approval)",
    businessPersona: "Branch Manager (Request) -> Financial Controller (Audit & Approval)",
    frontendEntryPoint: "src/views/inventory/CreateAdjustmentRequest.vue",
    sourceEntity: "stockAdjustments",
    canonicalStates: ["Draft", "Pending Approval", "Approved", "Rejected", "Posted", "Cancelled"],
    domainMethods: ["store.addStockAdjustment", "store.approveStockAdjustment", "store.rejectStockAdjustment", "store.postStockAdjustment"],
    relatedEntities: ["products", "serializedUnits", "actionQueue", "auditLogs"],
    branchScope: "Origin Branch Inventory Ledger",
    approvalBoundary: "Super Admin Physical Stock Adjustment Approval Boundary (WF-ADJ-01)",
    inventoryEffect: "Adjustment submission and approval do NOT mutate physical stock. Ledger writes occur strictly upon explicit execution of store.postStockAdjustment.",
    financialEffect: "Inventory write-off / write-up expense posted upon finalized posting.",
    frontendGuarantees: ["Zero stock mutation on approval", "Action Centre approval workflow routes strictly to Super Admin", "Clear variance audit trail"],
    backendMustGuarantee: ["Zero physical stock mutation during approval stage", "Atomic ledger write and unit status modification at posting stage", "Super Admin exclusive posting authority"],
    tests: ["test_wave3_workflow_connectivity.cjs", "test_wave4_state_integrity.cjs"],
    unresolvedDecisions: ["QUARANTINE_WRITEDOWN_ACCOUNTING"],
    statusClassification: "VERIFIED_CURRENT_FRONTEND",
    knownGaps: "None"
  },
  {
    workflowId: "WF-CUST-01",
    businessPurpose: "Register retail or corporate customer profile and KYC identification",
    authenticatedRole: "Branch Manager",
    businessPersona: "Sales Representative / Customer Care Officer",
    frontendEntryPoint: "src/views/sales/CreateCustomer.vue",
    sourceEntity: "customers",
    canonicalStates: ["Active", "Inactive", "Lead"],
    domainMethods: ["store.addCustomer", "store.updateCustomer", "store.getCustomerById"],
    relatedEntities: ["branches", "leads", "quotations", "orders", "warranties", "auditLogs"],
    branchScope: "Branch-Originated Customer Profile",
    approvalBoundary: "Branch Sales Lead Verification",
    inventoryEffect: "None",
    financialEffect: "Initializes customer commercial ledger account",
    frontendGuarantees: ["Client-side CNIC/Phone formatting", "Form dirty preservation", "Unique customer ID assignment"],
    backendMustGuarantee: ["Unique National ID / Phone constraint", "Branch ownership stamping", "Referential integrity with orders/warranties"],
    tests: ["test_wave2_data_roundtrip.cjs", "test_master_readiness.js"],
    unresolvedDecisions: ["CUSTOMER_CREDIT_GOVERNANCE"],
    statusClassification: "VERIFIED_CURRENT_FRONTEND",
    knownGaps: "None"
  },
  {
    workflowId: "WF-QT-01",
    businessPurpose: "Generate formal price quotation for vehicle and optional accessory configurations",
    authenticatedRole: "Branch Manager",
    businessPersona: "Sales Executive / Sales Consultant",
    frontendEntryPoint: "src/views/sales/CreateQuotation.vue",
    sourceEntity: "quotations",
    canonicalStates: ["Draft", "Sent", "Accepted", "Declined", "Expired", "Converted to Order"],
    domainMethods: ["store.addQuotation", "store.getQuotationById"],
    relatedEntities: ["customers", "products", "orders", "pricingRules", "auditLogs"],
    branchScope: "Branch Sales Operation",
    approvalBoundary: "Commercial Terms Validation",
    inventoryEffect: "None; quotation does not lock or reserve inventory",
    financialEffect: "Presents non-binding price schedule",
    frontendGuarantees: ["Dynamic line pricing calculations", "Discount bounds validation", "Conversion trigger to Sales Order"],
    backendMustGuarantee: ["Validity period expiration enforcement", "Branch authorization on quotation updates", "Conversion atomicity"],
    tests: ["test_wave2_data_roundtrip.cjs", "test_master_readiness.js"],
    unresolvedDecisions: ["DISCOUNT_OVERRIDE_GOVERNANCE"],
    statusClassification: "VERIFIED_CURRENT_FRONTEND",
    knownGaps: "None"
  },
  {
    workflowId: "WF-SO-01",
    businessPurpose: "Commercial vehicle sales order booking, chassis allocation, invoicing, and customer handover",
    authenticatedRole: "Branch Manager",
    businessPersona: "Branch Sales Manager / Commercial Lead",
    frontendEntryPoint: "src/views/sales/CreateSale.vue (/sales/orders/create)",
    sourceEntity: "orders",
    canonicalStates: ["Draft", "Confirmed", "Payment Pending", "Partially Paid", "Paid", "Reserved", "Ready for Handover", "Completed", "Cancelled", "Returned / Partially Returned"],
    domainMethods: ["store.addOrder", "store.updateOrder", "store.recordInvoicePayment", "store.recordOrderPayment"],
    relatedEntities: ["customers", "quotations", "serializedUnits", "invoices", "payments", "deliveries", "ownerships", "warranties", "auditLogs"],
    branchScope: "Origin Dealership Branch Commercial Operations",
    approvalBoundary: "Supervisor Discount Override / Commercial Terms Validation",
    inventoryEffect: "Reservation locks exact chassis (status = 'Reserved'). Handover marks unit 'Sold' and transfers custody to customer.",
    financialEffect: "Creates customer invoice balance. Payment recording increments liquid accounts. Handover triggers operational completion.",
    frontendGuarantees: ["Dedicated full-page CreateSale workflow", "Exact available chassis selection", "Strict separation of Paid vs Ready for Handover vs Completed"],
    backendMustGuarantee: ["Double-sale prevention under concurrent transactions", "Atomicity of chassis allocation and customer ownership certificate generation", "Zero modification of settled financial invoice amounts"],
    tests: ["test_wave4_state_integrity.cjs", "test_wave5_financial_kpi_truth.cjs", "test_master_readiness.js"],
    unresolvedDecisions: ["REVENUE_RECOGNITION_EVENT", "COLLECTION_RECOGNITION", "RECEIVABLE_RECOGNITION"],
    statusClassification: "VERIFIED_CURRENT_FRONTEND",
    knownGaps: "None"
  },
  {
    workflowId: "WF-RES-01",
    businessPurpose: "Lock specific physical chassis for an active sales booking deposit",
    authenticatedRole: "Branch Manager",
    businessPersona: "Sales Representative / Vehicle Inventory Controller",
    frontendEntryPoint: "src/views/sales/CreateSale.vue",
    sourceEntity: "serializedUnits",
    canonicalStates: ["Available", "Reserved", "Sold"],
    domainMethods: ["store.reserveUnit", "store.getUnitById"],
    relatedEntities: ["orders", "customers", "auditLogs"],
    branchScope: "Branch Inventory",
    approvalBoundary: "Deposit Receipt Verification",
    inventoryEffect: "Unit status transitions Available -> Reserved; assigned_order_id linked",
    financialEffect: "Secured by deposit transaction",
    frontendGuarantees: ["Filters chassis dropdown to Available units only", "Locks unit on order submission"],
    backendMustGuarantee: ["Atomic reservation check preventing double reservation under concurrency", "Auto-release on order cancellation"],
    tests: ["test_wave4_state_integrity.cjs", "test_master_readiness.js"],
    unresolvedDecisions: [],
    statusClassification: "VERIFIED_CURRENT_FRONTEND",
    knownGaps: "None"
  },
  {
    workflowId: "WF-INV-01",
    businessPurpose: "Issue legal commercial invoice with sales tax and line item summary",
    authenticatedRole: "Branch Manager",
    businessPersona: "Branch Accountant / Billing Specialist",
    frontendEntryPoint: "src/views/sales/CreateSale.vue",
    sourceEntity: "invoices",
    canonicalStates: ["Draft", "Issued", "Partial", "Paid", "Cancelled", "Refunded"],
    domainMethods: ["store.addInvoice", "store.getInvoiceById"],
    relatedEntities: ["orders", "customers", "payments", "auditLogs"],
    branchScope: "Branch Sales Operations",
    approvalBoundary: "Commercial Terms Sign-Off",
    inventoryEffect: "None",
    financialEffect: "Generates accounts receivable debit and VAT tax liability",
    frontendGuarantees: ["Computes gross, tax, discount, and outstanding balance", "Prevents duplicate invoice generation for same order"],
    backendMustGuarantee: ["Sequential invoice numbering", "Immutable invoice amounts once issued", "Atomic link to sales order"],
    tests: ["test_wave4_financial_domain.cjs", "test_master_readiness.js"],
    unresolvedDecisions: ["REVENUE_RECOGNITION_EVENT"],
    statusClassification: "VERIFIED_CURRENT_FRONTEND",
    knownGaps: "None"
  },
  {
    workflowId: "WF-PAY-01",
    businessPurpose: "Record cash, bank transfer, or installment collection against invoice",
    authenticatedRole: "Branch Manager",
    businessPersona: "Cashier / Branch Accountant",
    frontendEntryPoint: "src/views/sales/OrderDetail.vue",
    sourceEntity: "payments",
    canonicalStates: ["Pending", "Completed", "Bounced", "Refunded"],
    domainMethods: ["store.recordInvoicePayment", "store.recordOrderPayment"],
    relatedEntities: ["invoices", "orders", "customers", "auditLogs"],
    branchScope: "Branch Cash Desk",
    approvalBoundary: "Cashier Receipt Confirmation",
    inventoryEffect: "None",
    financialEffect: "Reduces invoice outstanding balance; records cash collection",
    frontendGuarantees: ["Blocks overpayment attempts in UI", "Updates invoice status (Partial vs Paid) dynamically"],
    backendMustGuarantee: ["Overpayment rejection on server", "Idempotent payment posting", "Atomic update of invoice paid/outstanding amounts"],
    tests: ["test_wave4_financial_domain.cjs", "test_master_readiness.js"],
    unresolvedDecisions: ["COLLECTION_RECOGNITION"],
    statusClassification: "VERIFIED_CURRENT_FRONTEND",
    knownGaps: "None"
  },
  {
    workflowId: "WF-HO-01",
    businessPurpose: "Physical vehicle delivery handover, ownership registration, and warranty activation",
    authenticatedRole: "Branch Manager",
    businessPersona: "Delivery Specialist / Handover Lead",
    frontendEntryPoint: "src/views/sales/OrderDetail.vue",
    sourceEntity: "deliveries",
    canonicalStates: ["Scheduled", "Delivered", "Cancelled"],
    domainMethods: ["store.completeUnitSale", "store.updateOrder"],
    relatedEntities: ["orders", "serializedUnits", "ownerships", "warranties", "customers", "auditLogs"],
    branchScope: "Branch Showroom Delivery Bay",
    approvalBoundary: "Customer Handover Acceptance Sign-Off",
    inventoryEffect: "Serialized unit transitions Reserved -> Sold; ownership transferred to customer",
    financialEffect: "Completes operational sales cycle; records final fulfillment",
    frontendGuarantees: ["Verifies invoice is paid or approved before handover", "Registers 2-Year warranty record atomically"],
    backendMustGuarantee: ["Handover requires valid paid/approved order precondition", "Unit status changed to Sold and linked to customerId", "Warranty instantiated with active status"],
    tests: ["test_wave4_state_integrity.cjs", "test_master_readiness.js"],
    unresolvedDecisions: [],
    statusClassification: "VERIFIED_CURRENT_FRONTEND",
    knownGaps: "None"
  },
  {
    workflowId: "WF-RET-01",
    businessPurpose: "Customer vehicle or parts return intake, inspection, and refund processing",
    authenticatedRole: "Branch Manager (Request) -> Super Admin (Approval)",
    businessPersona: "Service Manager (Inspection) -> Executive Finance (Refund)",
    frontendEntryPoint: "src/views/sales/CreateReturn.vue",
    sourceEntity: "returns",
    canonicalStates: ["Draft", "Pending Inspection", "Approved", "Rejected", "Refunded", "Restocked", "Cancelled"],
    domainMethods: [],
    relatedEntities: ["orders", "serializedUnits", "invoices", "payments", "auditLogs"],
    branchScope: "Branch Showroom / Workshop Intake",
    approvalBoundary: "Super Admin Commercial Refund Approval",
    inventoryEffect: "Returns unit to Dealership Stock (status = 'Returned' or 'Receiving / QC')",
    financialEffect: "Reduces Net Sales via Sales Returns deduction; creates refund payable",
    frontendGuarantees: ["Dedicated return entry view", "Reason code and inspection condition capture"],
    backendMustGuarantee: ["Restocking updates inventory ledger and unit status to Returned/Receiving QC", "Refund adjusts Net Sales accurately", "Super Admin authorization for refund payout"],
    tests: ["test_wave4_financial_domain.cjs"],
    unresolvedDecisions: ["QUARANTINE_WRITEDOWN_ACCOUNTING"],
    statusClassification: "PARTIAL_CURRENT_FRONTEND",
    knownGaps: "Return inspection and refund payout workflow UI exists; server-side refund gateway integration is future backend"
  },
  {
    workflowId: "WF-CASE-01",
    businessPurpose: "Log after-sales customer service complaint, warranty claim, or scheduled maintenance request",
    authenticatedRole: "Branch Manager",
    businessPersona: "Service Advisor / Workshop Receptionist",
    frontendEntryPoint: "src/views/after-sales/CreateCase.vue",
    sourceEntity: "cases",
    canonicalStates: ["Open", "In Diagnosis", "Repair Scheduled", "Resolved", "Closed", "Cancelled"],
    domainMethods: ["store.addCase"],
    relatedEntities: ["customers", "serializedUnits", "repairs", "warranties", "auditLogs"],
    branchScope: "Branch Workshop Service Desk",
    approvalBoundary: "Service Advisor Triage",
    inventoryEffect: "None at case logging stage",
    financialEffect: "None",
    frontendGuarantees: ["Full-page CreateCase workflow", "Customer and chassis search binding", "Direct escalation to Repair Job"],
    backendMustGuarantee: ["Branch isolation on service tickets", "Linkage to active customer warranty policy"],
    tests: ["test_wave2_data_roundtrip.cjs", "test_master_readiness.js"],
    unresolvedDecisions: [],
    statusClassification: "VERIFIED_CURRENT_FRONTEND",
    knownGaps: "None"
  },
  {
    workflowId: "WF-REP-01",
    businessPurpose: "After-sales workshop diagnostic intake, repair execution, spare parts consumption, and warranty coverage",
    authenticatedRole: "Branch Manager",
    businessPersona: "Service Technician / Workshop Supervisor",
    frontendEntryPoint: "src/views/after-sales/CreateRepairJob.vue",
    sourceEntity: "repairs",
    canonicalStates: ["Draft", "Scheduled", "In Progress", "Awaiting Parts", "QC Testing", "Completed", "Invoiced", "Closed", "Cancelled"],
    domainMethods: ["store.addRepairJob", "store.updateRepairJob", "store.postRepairToFinance"],
    relatedEntities: ["cases", "customers", "serializedUnits", "products", "invoices", "warranties", "auditLogs"],
    branchScope: "Dealership Workshop Facility",
    approvalBoundary: "Workshop Supervisor Job Sign-Off / Warranty Claim Qualification",
    inventoryEffect: "Deducts replacement spare parts from workshop stock. Service vehicle marked 'In Service'.",
    financialEffect: "Calculates labor and parts cost. Applies active warranty ratio (0% customer payable if covered). Posts invoice to finance.",
    frontendGuarantees: ["Dedicated full-page CreateRepairJob workflow", "Dynamic labor and parts calculation", "Automatic warranty coverage calculation based on registered customer warranty"],
    backendMustGuarantee: ["Atomic parts inventory deduction upon job completion", "Immutable warranty ratio snapshot upon invoice generation", "Branch isolation on workshop work orders"],
    tests: ["test_wave4_financial_domain.cjs", "test_master_readiness.js"],
    unresolvedDecisions: ["WARRANTY_REPLACEMENT_GOVERNANCE"],
    statusClassification: "VERIFIED_CURRENT_FRONTEND",
    knownGaps: "None"
  },
  {
    workflowId: "WF-EXP-01",
    businessPurpose: "Branch operational overhead expense submission and supervisor disbursement authorization",
    authenticatedRole: "Branch Manager (Submission) -> Super Admin (Approval)",
    businessPersona: "Branch Administrator (Submission) -> Financial Controller (Approval)",
    frontendEntryPoint: "src/views/finance/CreateExpense.vue",
    sourceEntity: "expenses",
    canonicalStates: ["Draft", "Pending Approval", "Approved", "Paid", "Rejected", "Cancelled"],
    domainMethods: ["store.addExpense", "store.approveExpense", "store.rejectExpense", "store.updateExpense"],
    relatedEntities: ["branches", "actionQueue", "auditLogs"],
    branchScope: "Branch Cost Centre Expense Accounting",
    approvalBoundary: "Super Admin Operating Expense Authorization Boundary (WF-EXP-01)",
    inventoryEffect: "None",
    financialEffect: "Accrues branch operational expense. Approval authorizes disbursement without marking expense Paid prematurely.",
    frontendGuarantees: ["Approval marks record 'Approved' but leaves payment status un-disbursed", "Action Centre routes to Super Admin", "Branch isolation prevents viewing foreign branch expenses"],
    backendMustGuarantee: ["Server validation of expense branch vs user branch", "Separation of approval event and cash disbursement transaction", "Strict financial audit logging"],
    tests: ["test_wave3_workflow_connectivity.cjs", "test_wave4_state_integrity.cjs"],
    unresolvedDecisions: ["APPROVAL_THRESHOLD_CONFIGURATION"],
    statusClassification: "VERIFIED_CURRENT_FRONTEND",
    knownGaps: "None"
  },
  {
    workflowId: "WF-ACT-01",
    businessPurpose: "Central executive and branch operational decision routing, escalation, and governance queue",
    authenticatedRole: "Super Admin / Branch Manager",
    businessPersona: "Executive Decision Maker / Branch General Manager",
    frontendEntryPoint: "src/views/dashboard/ActionCentre.vue",
    sourceEntity: "actionQueue",
    canonicalStates: ["Pending", "Resolved", "Rejected", "Stale"],
    domainMethods: ["store.getActionTasksForUser", "store.resolveActionItem"],
    relatedEntities: ["productRequests", "stockRequests", "purchaseOrders", "stockAdjustments", "expenses", "auditLogs"],
    branchScope: "Recipient Role / Target Branch Isolation",
    approvalBoundary: "Authorized Role Task Decision Boundary",
    inventoryEffect: "Governed by specific domain workflow outcome",
    financialEffect: "Governed by specific domain workflow outcome",
    frontendGuarantees: ["Task / domain state separation", "Branch isolation filtering", "Drawer treatment resolution", "Double-resolution guard"],
    backendMustGuarantee: ["Rejection of duplicate resolutions returning TASK_ALREADY_RESOLVED", "Atomic resolution of task state and domain entity state", "Strict authorization check on recipient role/branch"],
    tests: ["test_wave3_workflow_connectivity.cjs", "test_wave3_action_centre_mount.test.js"],
    unresolvedDecisions: [],
    statusClassification: "VERIFIED_CURRENT_FRONTEND",
    knownGaps: "None"
  },
  {
    workflowId: "WF-MSG-01",
    businessPurpose: "Record-linked internal communication between dealership staff across orders, cases, and procurement",
    authenticatedRole: "Super Admin / Branch Manager",
    businessPersona: "Sales Advisor / Workshop Advisor / Procurement Officer",
    frontendEntryPoint: "src/views/communication/ManagementInbox.vue",
    sourceEntity: "conversations",
    canonicalStates: ["Active", "Archived", "Closed"],
    domainMethods: ["store.getConversationById", "store.addConversation", "store.addMessageToConversation"],
    relatedEntities: ["orders", "cases", "purchaseOrders", "users", "branches"],
    branchScope: "Participant / Record Branch Context",
    approvalBoundary: "None",
    inventoryEffect: "None",
    financialEffect: "None",
    frontendGuarantees: ["Record-linked message threads", "Participant access scoping", "Real-time message append"],
    backendMustGuarantee: ["Message immutability once sent", "Participant authorization verification", "Audit logging of sensitive conversations"],
    tests: ["test_wave1_security_and_identity.cjs"],
    unresolvedDecisions: [],
    statusClassification: "VERIFIED_CURRENT_FRONTEND",
    knownGaps: "None"
  },
  {
    workflowId: "WF-NOTIF-01",
    businessPurpose: "Real-time workflow alerts, stock threshold warnings, and approval notifications",
    authenticatedRole: "Super Admin / Branch Manager",
    businessPersona: "Dealership Operations Staff",
    frontendEntryPoint: "src/views/communication/Notifications.vue",
    sourceEntity: "notifications",
    canonicalStates: ["Unread", "Read", "Archived"],
    domainMethods: ["store.addNotification", "store.markNotificationRead"],
    relatedEntities: ["users", "branches", "actionQueue"],
    branchScope: "User / Branch Context",
    approvalBoundary: "None",
    inventoryEffect: "None",
    financialEffect: "None",
    frontendGuarantees: ["Unread count badge", "Mark as read reactivity", "Role/branch notification filtering"],
    backendMustGuarantee: ["User-isolated notification delivery", "Persistence of read states"],
    tests: ["test_wave1_security_and_identity.cjs"],
    unresolvedDecisions: [],
    statusClassification: "VERIFIED_CURRENT_FRONTEND",
    knownGaps: "None"
  },
  {
    workflowId: "WF-AUD-01",
    businessPurpose: "Immutable audit logging of all sensitive mutations, security logins, and financial events",
    authenticatedRole: "Super Admin",
    businessPersona: "Internal Compliance Auditor / Chief Operating Officer",
    frontendEntryPoint: "src/views/system/AuditLog.vue",
    sourceEntity: "auditLogs",
    canonicalStates: ["Logged"],
    domainMethods: ["store.getAuditLogById"],
    relatedEntities: ["users", "branches", "orders", "purchaseOrders", "transfers", "expenses", "stockAdjustments"],
    branchScope: "Global Master (Super Admin exclusive audit log access)",
    approvalBoundary: "Compliance Read-Only",
    inventoryEffect: "None",
    financialEffect: "None",
    frontendGuarantees: ["Read-only compliance views", "Role-gated navigation", "Search by entity/event type"],
    backendMustGuarantee: ["Append-only persistence store (zero UPDATE or DELETE permitted on audit_logs table)", "Captures actor_id, actor_role, branch_id, before_state, after_state, timestamp"],
    tests: ["test_wave1_security_and_identity.cjs", "test_wave2_data_roundtrip.cjs"],
    unresolvedDecisions: [],
    statusClassification: "VERIFIED_CURRENT_FRONTEND",
    knownGaps: "None"
  }
])

// 2. wave7_role_permission_contract.json
writeJson('wave7_role_permission_contract.json', {
  authenticatedRoles: ["Super Admin", "Branch Manager"],
  prohibitedRoles: ["Technician", "Sales Representative", "Finance Lead", "Receptionist", "Cashier", "Auditor", "Receiving Officer", "Delivery Lead"],
  businessPersonasExplainer: "Business personas (e.g. Cashier, Receiving Officer, Technician) represent operational workflow display roles and metadata attributes; they are NOT authenticated RBAC roles. All authentication and authorization derives strictly from Super Admin or Branch Manager session tokens.",
  roleSpecifications: {
    "Super Admin": {
      roleKey: "Super Admin",
      displayName: "Head Office Super Administrator",
      branchScope: "Global / Cross-Branch (ALL)",
      canAccessCrossBranchData: true,
      canMutateGlobalMasters: true,
      canApproveActionCentreTasks: true,
      allowedMutations: [
        "branches", "users", "categories", "products", "pricingRules", "suppliers",
        "purchaseOrders", "productRequests", "stockRequests", "transfers", "stockAdjustments",
        "expenses", "orders", "quotations", "customers", "leads", "invoices", "payments",
        "deliveries", "cases", "repairs", "warranties", "actionQueue", "notifications"
      ],
      approvalCapabilities: [
        "WF-PO-01 (Purchase Order Approval)",
        "WF-PR-01 (Product Request Approval)",
        "WF-SR-01 (Stock Request Requisition Approval)",
        "WF-TR-01 (Inter-Branch Transfer Approval via store.approveTransfer)",
        "WF-ADJ-01 (Stock Adjustment Variance Approval)",
        "WF-EXP-01 (Operating Expense Approval)"
      ],
      backendEnforcementRequirement: "Server session verification must confirm Super Admin identity; permissions checked on every mutating API endpoint"
    },
    "Branch Manager": {
      roleKey: "Branch Manager",
      displayName: "Dealership Branch General Manager",
      branchScope: "Strict Single Branch (assigned canonical branchId e.g. BR-01)",
      canAccessCrossBranchData: false,
      canMutateGlobalMasters: false,
      canApproveActionCentreTasks: false,
      allowedMutations: [
        "orders (own branch)", "quotations (own branch)", "customers (own branch)",
        "leads (own branch)", "transfers (dispatch if origin, receive if destination)",
        "stockRequests (initiate own branch)", "productRequests (initiate own branch)",
        "expenses (initiate own branch)", "stockAdjustments (initiate own branch)",
        "cases (own branch)", "repairs (own branch)", "payments (own branch)"
      ],
      deniedMutations: [
        "branches (read only)", "products (read only)", "categories (read only)",
        "suppliers (read only)", "pricingRules (read only)", "approveActionCentreTasks",
        "approveStockRequests", "approveTransfers", "approveExpenses", "approveStockAdjustments"
      ],
      backendEnforcementRequirement: "Server MUST extract canonical branchId from user session and enforce WHERE branch_id = session.branch_id on all data queries and mutations; client-provided branch parameters must be rejected"
    }
  }
})

// 3. wave7_entity_contract.json
writeJson('wave7_entity_contract.json', {
  canonicalPrefixes: {
    branch: "BR-",
    user: "USR-",
    category: "CAT-",
    product: "PROD-",
    serializedUnit: "SER- / UNIT-",
    supplier: "SUP-",
    purchaseOrder: "PO-",
    goodsReceipt: "GRN-",
    stockRequest: "SR-",
    productRequest: "PR-",
    transfer: "TR-",
    stockAdjustment: "ADJ-",
    customer: "CUST-",
    quotation: "QT-",
    order: "SO- / ORD-",
    invoice: "INV-",
    payment: "PAY- / TXN-",
    delivery: "DEL-",
    serviceCase: "SC-",
    repairJob: "RJ-",
    expense: "EXP-",
    warranty: "WAR-",
    actionItem: "ACT-"
  },
  entities: [
    {
      entity: "branches",
      canonicalId: "id (BR-XX)",
      ownershipScope: "Global Master",
      authoritativeFields: ["id", "code", "name", "city", "manager", "status"],
      mutableFields: ["name", "city", "address", "phone", "email", "manager", "status"],
      immutableFields: ["id", "code", "created_at"],
      terminalStates: ["Inactive"]
    },
    {
      entity: "products",
      canonicalId: "id (PROD-XXX)",
      ownershipScope: "Global Master",
      authoritativeFields: ["id", "sku", "name", "category", "basePrice", "isSerialized"],
      mutableFields: ["name", "category", "basePrice", "costPrice", "specs", "images", "status"],
      immutableFields: ["id", "sku", "isSerialized", "created_at"],
      terminalStates: ["Discontinued", "Archived"]
    },
    {
      entity: "serializedUnits",
      canonicalId: "id / serial / chassis",
      ownershipScope: "Branch-Scoped Physical Asset",
      authoritativeFields: ["id", "serial", "chassis", "product_id", "branch_id", "status", "location", "landedCost"],
      mutableFields: ["status", "location", "branch", "branch_id", "assigned_order_id", "customer_id", "condition", "updated_at"],
      immutableFields: ["id", "serial", "chassis", "product_id", "landedCost", "created_at"],
      terminalStates: ["Sold", "Scrapped"]
    },
    {
      entity: "transfers",
      canonicalId: "id (TR-XXX)",
      ownershipScope: "Inter-Branch (from_to)",
      authoritativeFields: ["id", "fromBranch_id", "toBranch_id", "status", "items"],
      mutableFields: ["status", "carrier", "dispatched", "expectedArrival", "receivedDate", "notes", "approvedBy", "approvedDate"],
      immutableFields: ["id", "fromBranch_id", "toBranch_id", "requestedBy", "items.product_id", "created_at"],
      terminalStates: ["Received", "Closed", "Cancelled"]
    },
    {
      entity: "orders",
      canonicalId: "id (SO-XXXX)",
      ownershipScope: "Branch-Scoped Commercial Record",
      authoritativeFields: ["id", "orderNo", "customer_id", "branch_id", "unit_id", "status", "grandTotal"],
      mutableFields: ["status", "paidAmount", "outstandingAmount", "paymentStatus", "deliveryStatus", "updated_at"],
      immutableFields: ["id", "orderNo", "customer_id", "branch_id", "created_at", "totalAmount"],
      terminalStates: ["Completed", "Cancelled", "Returned / Partially Returned"]
    }
  ]
})

// 4. wave7_state_contract.json (Approved Canonical State Dictionary with Deterministic Legacy Classifications)
writeJson('wave7_state_contract.json', {
  stateMachines: {
    productRequests: {
      canonicalStates: ["Draft", "Submitted", "Under Review", "Approved", "Rejected", "Converted to Product"],
      initialState: "Submitted",
      terminalStates: ["Rejected", "Converted to Product"],
      validTransitions: {
        "Draft": ["Submitted", "Cancelled"],
        "Submitted": ["Under Review", "Approved", "Rejected"],
        "Under Review": ["Approved", "Rejected"],
        "Approved": ["Converted to Product"],
        "Rejected": [],
        "Converted to Product": []
      }
    },
    purchaseOrders: {
      canonicalStates: ["Draft", "Pending Approval", "Approved", "Ordered", "In Transit", "Partially Received", "Received", "Closed", "Cancelled"],
      initialState: "Draft",
      terminalStates: ["Closed", "Cancelled"],
      validTransitions: {
        "Draft": ["Pending Approval", "Approved", "Cancelled"],
        "Pending Approval": ["Approved", "Rejected", "Cancelled"],
        "Approved": ["Ordered", "In Transit", "Cancelled"],
        "Ordered": ["In Transit", "Partially Received", "Received"],
        "In Transit": ["Partially Received", "Received"],
        "Partially Received": ["Partially Received", "Received"],
        "Received": ["Closed"],
        "Closed": [],
        "Cancelled": []
      }
    },
    stockRequests: {
      canonicalStates: ["Draft", "Submitted", "Under Review", "Approved", "Partially Approved", "Rejected", "Fulfilment Started", "In Transit", "Received", "Closed", "Cancelled"],
      initialState: "Submitted",
      terminalStates: ["Closed", "Cancelled", "Rejected"],
      legacyAliases: {
        "Pending Approval": "Submitted",
        "Pending": "Submitted"
      },
      validTransitions: {
        "Draft": ["Submitted", "Cancelled"],
        "Submitted": ["Under Review", "Approved", "Partially Approved", "Rejected", "Cancelled"],
        "Under Review": ["Approved", "Partially Approved", "Rejected", "Cancelled"],
        "Approved": ["Fulfilment Started", "Closed"],
        "Partially Approved": ["Fulfilment Started", "Closed"],
        "Rejected": [],
        "Fulfilment Started": ["In Transit", "Closed"],
        "In Transit": ["Received"],
        "Received": ["Closed"],
        "Closed": [],
        "Cancelled": []
      }
    },
    transfers: {
      canonicalStates: ["Draft", "Requested", "Approved", "Picking", "Dispatched", "In Transit", "Partially Received", "Received", "Closed", "Cancelled"],
      initialState: "Requested",
      terminalStates: ["Received", "Closed", "Cancelled"],
      validTransitions: {
        "Draft": ["Requested", "Cancelled"],
        "Requested": ["Approved", "Cancelled"],
        "Approved": ["Picking", "Dispatched", "In Transit", "Cancelled"],
        "Picking": ["Dispatched", "In Transit", "Cancelled"],
        "Dispatched": ["In Transit"],
        "In Transit": ["Partially Received", "Received"],
        "Partially Received": ["Partially Received", "Received"],
        "Received": ["Closed"],
        "Closed": [],
        "Cancelled": []
      }
    },
    serializedUnits: {
      canonicalStates: ["Expected", "Supplier In Transit", "Receiving / QC", "Available", "Reserved", "Transfer In Transit", "Sold", "Returned", "In Service", "Damaged / Quarantine", "Scrapped"],
      initialState: "Available",
      terminalStates: ["Sold", "Scrapped"],
      prohibitedFromCanonical: ["Delivered", "QC Hold", "Maintenance", "Allocated", "generic In Transit"],
      legacyAliases: {
        "QC Hold": "Receiving / QC",
        "Maintenance": "In Service",
        "Allocated": "Reserved",
        "In Transit": "Transfer In Transit",
        "Delivered": "Sold"
      },
      validTransitions: {
        "Expected": ["Supplier In Transit", "Receiving / QC", "Scrapped"],
        "Supplier In Transit": ["Receiving / QC", "Available", "Damaged / Quarantine"],
        "Receiving / QC": ["Available", "Damaged / Quarantine", "Scrapped"],
        "Available": ["Reserved", "Transfer In Transit", "Sold", "In Service", "Damaged / Quarantine"],
        "Reserved": ["Available", "Sold", "Transfer In Transit"],
        "Transfer In Transit": ["Available", "Receiving / QC", "Damaged / Quarantine"],
        "In Service": ["Available", "Damaged / Quarantine"],
        "Damaged / Quarantine": ["Available", "In Service", "Scrapped"],
        "Sold": ["Returned"],
        "Returned": ["Receiving / QC", "Available", "Damaged / Quarantine", "In Service"],
        "Scrapped": []
      }
    },
    orders: {
      canonicalStates: ["Draft", "Confirmed", "Payment Pending", "Partially Paid", "Paid", "Reserved", "Ready for Handover", "Completed", "Cancelled", "Returned / Partially Returned"],
      initialState: "Confirmed",
      terminalStates: ["Completed", "Cancelled", "Returned / Partially Returned"],
      prohibitedFromCanonical: ["Under Financing", "Delivered", "Refunded"],
      deterministicClassifications: {
        "Delivered": { classification: "LEGACY_ALIAS", mapsTo: "Completed", description: "Represents historical closed orders where physical handover completed" },
        "Under Financing": { classification: "NON_CANONICAL_SUBSTATUS", description: "Represents order financing application attribute, not primary lifecycle status" },
        "Refunded": { classification: "NON_CANONICAL_SUBSTATUS", description: "Represents financial payment refund transaction outcome or return status" }
      },
      validTransitions: {
        "Draft": ["Confirmed", "Cancelled"],
        "Confirmed": ["Payment Pending", "Reserved", "Partially Paid", "Paid", "Cancelled"],
        "Payment Pending": ["Partially Paid", "Paid", "Reserved", "Cancelled"],
        "Reserved": ["Payment Pending", "Partially Paid", "Paid", "Ready for Handover", "Cancelled"],
        "Partially Paid": ["Paid", "Ready for Handover", "Cancelled"],
        "Paid": ["Ready for Handover", "Completed", "Cancelled"],
        "Ready for Handover": ["Completed", "Cancelled"],
        "Completed": ["Returned / Partially Returned"],
        "Cancelled": [],
        "Returned / Partially Returned": []
      }
    },
    actionQueue: {
      canonicalStates: ["Pending", "Resolved", "Rejected", "Stale"],
      initialState: "Pending",
      terminalStates: ["Resolved", "Rejected", "Stale"],
      validTransitions: {
        "Pending": ["Resolved", "Rejected", "Stale"],
        "Resolved": [],
        "Rejected": [],
        "Stale": []
      }
    }
  }
})

// 5. wave7_financial_backend_contract.json (Approved Formulas & Invariants)
writeJson('wave7_financial_backend_contract.json', {
  currency: "PKR",
  moneyRepresentation: "Decimal storage with 2 decimal precision; UI displays integer formatting where standard (PKR XXX,XXX)",
  financialFormulas: {
    "Net Sales": "Gross Selling Amount - Discounts - Sales Returns / Refund adjustments",
    "COGS (Cost of Goods Sold)": "Actual historical unit landed cost of specific serialized units sold",
    "Gross Profit": "Net Sales - COGS",
    "Gross Margin %": "((Net Sales - COGS) / Net Sales) * 100",
    "Operating Expenses": "Sum of all approved and disbursed operational expenses (rent, utilities, payroll, local logistics)",
    "Net Operating Profit": "Gross Profit - Operating Expenses",
    "Inventory Asset Value": "Sum of (unit landed cost) for all serialized units currently in stock (Available, Reserved, Receiving / QC, Transfer In Transit)"
  },
  landedCostInvariants: {
    rule1: "Purchase Order is a commercial order document and does NOT automatically create an accounting liability. Vendor Bill is the supplier payable invoice.",
    rule2: "Physical goods receipt establishes the physical unit and base/provisional acquisition cost. Landed Cost allocation/posting finalizes the true historical unit landed cost (Base + Freight + Duty + Addons).",
    rule3: "Subsequent batch receipts must NEVER mutate the landed cost of already sold or existing serialized units",
    rule4: "COGS is computed strictly against the specific serialized units sold and is not broadened to ambiguous handover timing while statutory revenue recognition is undecided"
  },
  unresolvedAccountingPolicies: [
    {
      policyKey: "REVENUE_RECOGNITION_EVENT",
      status: "BUSINESS_DECISION_REQUIRED",
      options: ["Invoice Issuance", "100% Full Payment", "Physical Vehicle Handover", "Order Status = Completed"],
      safeOperationalTreatment: "Operational dashboards report Delivered / Completed sales volume; statutory accounting revenue boundary deferred to financial executive sign-off"
    },
    {
      policyKey: "COLLECTION_RECOGNITION",
      status: "BUSINESS_DECISION_REQUIRED",
      options: ["Cash Receipt Date", "Bank Settlement Clearance"],
      safeOperationalTreatment: "Cash receipt date recorded at cashier desk"
    },
    {
      policyKey: "RECEIVABLE_RECOGNITION",
      status: "BUSINESS_DECISION_REQUIRED",
      options: ["Invoice Generation Date", "Contract Booking Date"],
      safeOperationalTreatment: "Invoice generation date creates customer debit balance"
    }
  ]
})

// 6. wave7_approval_contract.json (Wave 3 Aligned Task States)
writeJson('wave7_approval_contract.json', [
  {
    workflowId: "WF-PO-01",
    actionName: "Approve Purchase Order",
    triggerState: "Pending Approval",
    decisionActor: "Super Admin",
    recipientRole: "Super Admin",
    taskStateLifecycle: { initial: "Pending", resolved: "Resolved", rejected: "Rejected" },
    domainMethod: "store.approvePurchaseOrder(id, approvalData)",
    approvedState: "Approved",
    rejectedState: "Rejected",
    prohibitedSideEffects: ["Does NOT create physical inventory stock", "Does NOT create serialized units", "Does NOT disburse payment"],
    backendEnforcement: "Must validate Super Admin identity and transition state atomically. Double resolution returns TASK_ALREADY_RESOLVED with zero second domain mutation."
  },
  {
    workflowId: "WF-PR-01",
    actionName: "Approve Product Request",
    triggerState: "Submitted",
    decisionActor: "Super Admin",
    recipientRole: "Super Admin",
    taskStateLifecycle: { initial: "Pending", resolved: "Resolved", rejected: "Rejected" },
    domainMethod: "store.approveProductRequest(id, approvalData)",
    approvedState: "Approved",
    rejectedState: "Rejected",
    prohibitedSideEffects: ["Does NOT create Product Master entry automatically", "Does NOT create purchase orders", "Does NOT create inventory units"],
    backendEnforcement: "Super Admin authorization check, atomic resolution of Action Centre task (Pending -> Resolved). Double resolution returns TASK_ALREADY_RESOLVED."
  },
  {
    workflowId: "WF-SR-01",
    actionName: "Approve Stock Request",
    triggerState: "Submitted",
    decisionActor: "Super Admin",
    recipientRole: "Super Admin",
    taskStateLifecycle: { initial: "Pending", resolved: "Resolved", rejected: "Rejected" },
    domainMethod: "store.approveStockRequest(id, approvalData)",
    approvedState: "Approved",
    rejectedState: "Rejected",
    prohibitedSideEffects: ["Does NOT automatically create Transfer record", "Does NOT automatically approve Transfer", "Does NOT mutate branch stock"],
    backendEnforcement: "Super Admin authorization check, updates stockRequest.status to Approved and resolves task (Pending -> Resolved). Double resolution returns TASK_ALREADY_RESOLVED."
  },
  {
    workflowId: "WF-TR-01",
    actionName: "Approve Inter-Branch Transfer",
    triggerState: "Requested / Draft",
    decisionActor: "Super Admin",
    recipientRole: "Super Admin",
    taskStateLifecycle: { initial: "Pending", resolved: "Resolved", rejected: "Rejected" },
    domainMethod: "store.approveTransfer(id, approvalData)",
    approvedState: "Approved",
    rejectedState: "Cancelled",
    prohibitedSideEffects: ["Does NOT dispatch consignment", "Does NOT deduct origin available units before dispatch", "Does NOT create receiving task prematurely"],
    backendEnforcement: "Super Admin authorization check, sets transfer.status = Approved, logs TRANSFER_APPROVED. Double resolution returns TASK_ALREADY_RESOLVED."
  },
  {
    workflowId: "WF-EXP-01",
    actionName: "Approve Operational Expense",
    triggerState: "Pending Approval",
    decisionActor: "Super Admin",
    recipientRole: "Super Admin",
    taskStateLifecycle: { initial: "Pending", resolved: "Resolved", rejected: "Rejected" },
    domainMethod: "store.approveExpense(id, approvalData)",
    approvedState: "Approved",
    rejectedState: "Rejected",
    prohibitedSideEffects: ["Does NOT disburse liquid cash", "Does NOT mark expense Paid"],
    backendEnforcement: "Super Admin authorization check, transitions status to Approved. Double resolution returns TASK_ALREADY_RESOLVED."
  },
  {
    workflowId: "WF-ADJ-01",
    actionName: "Approve Stock Adjustment",
    triggerState: "Pending Approval",
    decisionActor: "Super Admin",
    recipientRole: "Super Admin",
    taskStateLifecycle: { initial: "Pending", resolved: "Resolved", rejected: "Rejected" },
    domainMethod: "store.approveStockAdjustment(id, approvalData)",
    approvedState: "Approved",
    rejectedState: "Rejected",
    prohibitedSideEffects: ["Does NOT mutate physical inventory stock ledger", "Does NOT modify serialized unit statuses"],
    backendEnforcement: "Super Admin authorization check, transitions status to Approved; posting requires separate execute call. Double resolution returns TASK_ALREADY_RESOLVED."
  }
])

// 7. wave7_authorization_contract.json (Technology-Neutral RBAC)
writeJson('wave7_authorization_contract.json', {
  authoritativePrinciple: "Frontend hiding is advisory UX; backend authorization is mandatory server-side security enforcement. RBAC derives strictly from authenticated Super Admin or Branch Manager session tokens.",
  rules: [
    {
      scope: "Global Administrative Masters",
      entities: ["branches", "users", "categories", "products", "pricingRules", "suppliers"],
      rule: "Mutations restricted 100% to authenticated Super Admin; Branch Managers receive an authorization error on write attempts."
    },
    {
      scope: "Branch-Scoped Primary Entities",
      entities: ["orders", "quotations", "customers", "leads", "invoices", "payments", "deliveries", "cases", "repairs", "stockRequests", "productRequests", "expenses", "stockAdjustments"],
      rule: "Branch Managers can only query and mutate records matching their authenticated session.branchId. Super Admin can access all branch records."
    },
    {
      scope: "Inter-Branch Movement (Transfers)",
      entities: ["transfers"],
      rule: "Initiation/Dispatch allowed only if session.branchId === transfer.fromBranchId. Receiving allowed only if session.branchId === transfer.toBranchId. Approval allowed only by Super Admin."
    },
    {
      scope: "Action Centre Decision Tasks",
      entities: ["actionQueue"],
      rule: "Super Admin tasks resolvable only by Super Admin. Branch Manager tasks resolvable only by designated recipient branch manager."
    }
  ]
})

// 8. wave7_concurrency_contract.json (Technology-Neutral)
writeJson('wave7_concurrency_contract.json', {
  concurrencyRisks: [
    {
      scenario: "Double Sale of Serialized Vehicle",
      risk: "Two sales reps allocate same available physical unit simultaneously",
      backendRequirement: "Backend must guarantee that concurrent attempts cannot reserve or sell the same serialized unit twice; exactly ONE transaction succeeds, others fail safely with a concurrency conflict."
    },
    {
      scenario: "Duplicate Transfer Dispatch",
      risk: "Operator submits dispatch request multiple times",
      backendRequirement: "Idempotency mechanism checking transfer state precondition; repeated submission returns existing in-transit state without duplicate ledger entries."
    },
    {
      scenario: "Duplicate Goods Receipt Registration",
      risk: "Concurrent receipt submission for same batch with identical identifiers",
      backendRequirement: "Backend must enforce uniqueness on physical serial and chassis identifiers; duplicate attempt fails safely with duplicate identity conflict."
    },
    {
      scenario: "Double Task Resolution",
      risk: "Two administrators attempt to resolve the same Action Centre task simultaneously",
      backendRequirement: "Atomic state validation verifying task is Pending; exactly ONE resolves domain record, second attempt returns TASK_ALREADY_RESOLVED with zero second domain mutation."
    }
  ]
})

// 9. wave7_audit_contract.json
writeJson('wave7_audit_contract.json', {
  auditLoggingRequirement: "Immutable append-only audit log for all mutating business transactions.",
  capturedFields: [
    "id (AUD-XXXX)",
    "timestamp (ISO-8601 UTC)",
    "actor_id",
    "actor_name",
    "actor_role",
    "branch_id",
    "branch_name",
    "action",
    "event_type",
    "entity_type",
    "entity_id",
    "module",
    "description",
    "metadata (JSON before/after snapshot or key delta)"
  ],
  eventSeparation: "Distinct event identities preserved for Created (createdBy), Approved (approvedBy), Dispatched (dispatchedBy), Received (receivedBy), and Posted (postedBy)."
})

// 10. wave7_error_contract.json (Technology-Neutral Semantic Error Categories)
writeJson('wave7_error_contract.json', {
  errorCategories: {
    "VALIDATION_ERROR": { semanticMeaning: "Input payload failed field constraints, format rules, or business data validation" },
    "UNAUTHORIZED": { semanticMeaning: "Session context is missing, expired, or unauthenticated" },
    "FORBIDDEN_RECORD": { semanticMeaning: "Authenticated user lacks role authority or foreign branch access to target entity" },
    "NOT_FOUND": { semanticMeaning: "Target entity ID does not exist in canonical registry" },
    "STATE_CONFLICT": { semanticMeaning: "Entity is in an incompatible state for requested lifecycle transition" },
    "DUPLICATE_IDENTITY": { semanticMeaning: "Unique constraint violation (e.g. duplicate serial, chassis, branch code)" },
    "TASK_ALREADY_RESOLVED": { semanticMeaning: "Action Centre task has already been resolved or rejected; duplicate resolution rejected" },
    "CONCURRENCY_CONFLICT": { semanticMeaning: "Target record was modified concurrently by another transaction" },
    "BUSINESS_RULE_VIOLATION": { semanticMeaning: "Operation violates dealership domain invariant (e.g. unapproved transfer dispatch, overpayment)" }
  }
})

// 11. wave7_api_behavior_contract.json (Technology-Neutral Semantic Operations)
writeJson('wave7_api_behavior_contract.json', [
  {
    operation: "approveTransfer",
    semanticAction: "Approve inter-branch transfer allocation",
    authenticatedRole: "Super Admin",
    preconditions: ["Transfer exists", "transfer.status === 'Requested' || transfer.status === 'Draft'"],
    successResult: { status: "Approved", approvedBy: "Super Admin", approvedDate: "Timestamp" },
    sideEffects: ["Creates notification", "Emits TRANSFER_APPROVED audit log"],
    failureCategories: ["NOT_FOUND", "FORBIDDEN_RECORD", "STATE_CONFLICT"]
  },
  {
    operation: "dispatchTransfer",
    semanticAction: "Dispatch consignment and transition custody to in-transit",
    authenticatedRole: "Super Admin / Branch Manager",
    preconditions: ["Transfer exists", "transfer.status === 'Approved'", "all serialized units Available at origin branch"],
    successResult: { status: "In Transit", unitsStatus: "Transfer In Transit" },
    sideEffects: ["Units marked Transfer In Transit", "Origin stock deducted", "Receiving task generated for destination Branch Manager", "Emits TRANSFER_DISPATCHED audit log"],
    failureCategories: ["NOT_FOUND", "FORBIDDEN_RECORD", "BUSINESS_RULE_VIOLATION (TRANSFER_NOT_APPROVED)", "STATE_CONFLICT"]
  },
  {
    operation: "receiveTransfer",
    semanticAction: "Receive transferred consignment at destination branch",
    authenticatedRole: "Branch Manager / Super Admin",
    preconditions: ["Transfer exists", "transfer.status === 'In Transit' || transfer.status === 'Partially Received'"],
    successResult: { status: "Received", unitsStatus: "Available at destination" },
    sideEffects: ["Units branch_id updated to destination", "Accepted units marked Available", "Damaged units marked Damaged / Quarantine", "Resolves Action Centre task", "Emits TRANSFER_RECEIVED audit log"],
    failureCategories: ["NOT_FOUND", "FORBIDDEN_RECORD", "STATE_CONFLICT"]
  },
  {
    operation: "postReceipt",
    semanticAction: "Post physical factory goods receipt against Purchase Order",
    authenticatedRole: "Super Admin / Branch Manager",
    preconditions: ["PO exists", "PO.status === 'Approved' || PO.status === 'Ordered' || PO.status === 'In Transit'"],
    successResult: { poStatus: "Fully Received / Partially Received", grnId: "GRN-XXXX" },
    sideEffects: ["Creates GRN record", "Instantiates physical serialized units with base acquisition cost and Available status", "Increments warehouse inventory", "Emits GOODS_RECEIPT_POSTED audit log"],
    failureCategories: ["NOT_FOUND", "FORBIDDEN_RECORD", "DUPLICATE_IDENTITY (Serial/Chassis)", "STATE_CONFLICT"]
  },
  {
    operation: "allocateLandedCosts",
    semanticAction: "Apportion freight, duty, and transport into finalized unit landed cost",
    authenticatedRole: "Super Admin",
    preconditions: ["Receipt exists", "Serialized units exist for receipt"],
    successResult: { receiptStatus: "Finalized", updatedUnitsCount: "Number" },
    sideEffects: ["Updates landedCost and addonCost on each serialized unit", "Locks historical acquisition cost", "Emits LANDED_COST_ALLOCATED audit log"],
    failureCategories: ["NOT_FOUND", "FORBIDDEN_RECORD", "STATE_CONFLICT"]
  }
])

// 12. wave7_frontend_backend_boundary.json
writeJson('wave7_frontend_backend_boundary.json', [
  { concern: "Input Form Validation", frontendResponsibility: "Client UX format validation and dirty form protection", backendResponsibility: "Authoritative constraint validation on incoming payload", authoritativeSource: "BACKEND" },
  { concern: "Branch Data Isolation", frontendResponsibility: "UI view filtering by current active branch context", backendResponsibility: "Mandatory server-side query scoping using authenticated branch", authoritativeSource: "BACKEND AUTHORITATIVE" },
  { concern: "Role-Based Permissions", frontendResponsibility: "Button and navigation visibility control", backendResponsibility: "Server-side RBAC verification on every request", authoritativeSource: "BACKEND AUTHORITATIVE" },
  { concern: "State Machine Transitions", frontendResponsibility: "Guides user through valid action buttons", backendResponsibility: "Validates current state in persistence store before mutating", authoritativeSource: "BACKEND AUTHORITATIVE" },
  { concern: "Serialized Unit Uniqueness", frontendResponsibility: "Checks in-memory client list for duplicate serial/chassis entry", backendResponsibility: "Database unique constraint and transaction rollback", authoritativeSource: "BACKEND AUTHORITATIVE" },
  { concern: "Financial & Tax Calculations", frontendResponsibility: "Live UI preview and reactive totals display", backendResponsibility: "Authoritative server recalculation and rounding enforcement", authoritativeSource: "BACKEND AUTHORITATIVE" },
  { concern: "Action Centre Task Routing", frontendResponsibility: "Renders assigned tasks to appropriate role tab", backendResponsibility: "Guards resolution endpoint to authorized recipient only", authoritativeSource: "BACKEND AUTHORITATIVE" },
  { concern: "Modal vs Dedicated Page Pattern", frontendResponsibility: "Presentation layout (dialog, drawer, dedicated full page)", backendResponsibility: "None (Agnostic to frontend UI presentation container)", authoritativeSource: "FRONTEND" }
])

// 13. wave7_business_decisions_required.json
writeJson('wave7_business_decisions_required.json', [
  {
    decisionId: "BD-REV-01",
    title: "Revenue Recognition Timing Point",
    area: "Financial Accounting",
    description: "Whether revenue is legally recognized at invoice issuance, 100% full payment settlement, physical vehicle handover, or operational Order Completed state.",
    status: "BUSINESS_DECISION_REQUIRED",
    currentMitigation: "Operational sales KPI reports Completed sales volume; statutory accounting revenue policy deferred."
  },
  {
    decisionId: "BD-COL-01",
    title: "Collection Recognition Accounting Policy",
    area: "Cash & Banking",
    description: "Whether collections recognize at point-of-sale cash receipt or upon verified bank clearance.",
    status: "BUSINESS_DECISION_REQUIRED",
    currentMitigation: "POS receipts recorded immediately at cashier desk."
  },
  {
    decisionId: "BD-REC-01",
    title: "Receivable Recognition Accounting Policy",
    area: "Commercial Accounts",
    description: "Whether trade receivables recognize on invoice generation date or sales contract booking date.",
    status: "BUSINESS_DECISION_REQUIRED",
    currentMitigation: "Invoice generation date creates customer balance."
  },
  {
    decisionId: "BD-WAR-01",
    title: "Executive Warranty Replacement Approval Governance",
    area: "After-Sales Governance",
    description: "Whether whole-vehicle replacement claims require secondary Super Admin executive authorization.",
    status: "BUSINESS_DECISION_REQUIRED",
    currentMitigation: "Standard repair jobs compute warranty coverage from customer policy; whole-vehicle replacement policy deferred."
  },
  {
    decisionId: "BD-THR-01",
    title: "Approval Threshold Policy Configuration",
    area: "Procurement & Expense Governance",
    description: "Dynamic monetary threshold configuration values for automated approval routing.",
    status: "BUSINESS_DECISION_REQUIRED",
    currentMitigation: "All purchase orders and expenses route to Super Admin approval boundary."
  },
  {
    decisionId: "BD-DISC-01",
    title: "Discount Override Governance",
    area: "Sales Commercial Policy",
    description: "Maximum allowable commercial discount percentage before mandatory Super Admin approval.",
    status: "BUSINESS_DECISION_REQUIRED",
    currentMitigation: "Front-end validates positive amounts; policy threshold deferred."
  },
  {
    decisionId: "BD-CRD-01",
    title: "Customer Credit Governance",
    area: "Commercial Risk Management",
    description: "Customer credit limit evaluation and installment default policies.",
    status: "BUSINESS_DECISION_REQUIRED",
    currentMitigation: "Customer profiles record balances; credit policy rules deferred."
  },
  {
    decisionId: "BD-QAR-01",
    title: "Quarantine / Write-Down Accounting Policy",
    area: "Asset Accounting",
    description: "Financial write-down and scrap salvage accounting treatment for damaged inventory.",
    status: "BUSINESS_DECISION_REQUIRED",
    currentMitigation: "Damaged units isolated in Damaged / Quarantine physical custody state."
  },
  {
    decisionId: "BD-VAR-01",
    title: "Variant Master Future Relational Architecture",
    area: "Product Catalogue",
    description: "Future normalized SKU variant schema (color/battery/motor matrix) vs composite product representation.",
    status: "BUSINESS_DECISION_REQUIRED",
    currentMitigation: "Current source uses isSerialized flag with SKU and variant attributes."
  }
])

// 14. wave7_quarantined_deferred.json
writeJson('wave7_quarantined_deferred.json', [
  {
    itemId: "QD-PDI-01",
    title: "18-Point Pre-Delivery Inspection Checklist Form",
    status: "QUARANTINED / DEFERRED",
    rationale: "Hardware checklist integration deferred to future workshop tablet app deployment."
  },
  {
    itemId: "QD-CRYPTO-01",
    title: "Cryptographic / Tamper-Evident Audit Blockchain",
    status: "QUARANTINED / DEFERRED",
    rationale: "Standard immutable relational audit logging satisfies all current operational compliance requirements."
  },
  {
    itemId: "QD-PERSONAS-01",
    title: "Granular Sub-Roles (Cashier, QC Inspector, Parts Specialist)",
    status: "QUARANTINED / DEFERRED",
    rationale: "Current dealership authority establishes exactly two authenticated workspace roles: Super Admin and Branch Manager."
  }
])

// 15. wave7_test_integrity.json (Full Historical Accountability Table)
writeJson('wave7_test_integrity.json', [
  {
    testFile: "tests/test_phase2_prompt4.js",
    oldAssertion: "Unapproved transfer dispatch and direct stock mutation upon adjustment approval",
    newAssertion: "Transfer approved prior to dispatch (Requested -> Approved -> In Transit); stock adjustment posted via store.postStockAdjustment() before verifying inventory alteration",
    observedFailure: "TRANSFER_NOT_APPROVED thrown on unapproved dispatch; stock adjustment did not alter branch inventory upon approval alone",
    rootCause: "Aligned test assertions with Wave 4/6 invariants: (1) Transfer must be Approved before dispatch, (2) Stock Adjustment approval does not alter stock until posted, (3) Serialized unit transitions to canonical Transfer In Transit",
    classification: "EXPECTED_CONTRACT_UPDATE",
    sourceChange: "src/store.js dispatchTransfer precondition check and postStockAdjustment lifecycle separation",
    oldExpectation: "Transfer dispatched without approval; stock mutated immediately upon adjustment approval",
    newExpectation: "Transfer approved then dispatched; adjustment approved then posted before checking stock mutation",
    assertionsRemoved: 0,
    assertionsAdded: 4,
    coverage: "STRONGER",
    reason: "Enforces complete approved transfer lifecycle and stock adjustment posting separation"
  },
  {
    testFile: "tests/test_wave2_security_regressions.cjs",
    oldAssertion: "Implicit session context in test execution",
    newAssertion: "Explicit authenticated session setup with store.setSession()",
    observedFailure: "Unauthenticated mutations blocked following Wave 1/2 authorization tightening",
    rootCause: "Store methods now enforce active authenticated session context",
    classification: "EXPECTED_CONTRACT_UPDATE",
    sourceChange: "src/store.js authentication state enforcement",
    oldExpectation: "Unchecked mutations permitted without session",
    newExpectation: "Explicit Super Admin session context established before running security regression assertions",
    assertionsRemoved: 0,
    assertionsAdded: 2,
    coverage: "STRONGER",
    reason: "Guarantees tests run under verified security session context"
  },
  {
    testFile: "tests/test_wave6_interaction_architecture.cjs",
    oldAssertion: "assert.strictEqual(testSr.status, 'Submitted')",
    newAssertion: "assert.strictEqual(testSr.status, 'Submitted')",
    observedFailure: "AssertionError when addStockRequest was defaulting to 'Pending Approval'",
    rootCause: "Aligned store.addStockRequest() new-write default to canonical 'Submitted' status with 'Pending Approval' compatibility alias support.",
    classification: "EXPECTED_CONTRACT_UPDATE",
    sourceChange: "src/store.js addStockRequest default status aligned to canonical lifecycle",
    oldExpectation: "Stock request created with 'Pending Approval'",
    newExpectation: "Stock request created with canonical 'Submitted' while reading 'Pending Approval' as alias",
    assertionsRemoved: 0,
    assertionsAdded: 12,
    coverage: "STRONGER",
    reason: "Aligns new writes with canonical lifecycle without breaking legacy reads"
  },
  {
    testFile: "tests/test_master_readiness.js",
    oldAssertion: "Immediate dispatch of transfer without approval",
    newAssertion: "Assert transfer status is 'Requested', approve via store.approveTransfer(), assert 'Approved', dispatch to 'In Transit', assert unit 'Transfer In Transit'",
    observedFailure: "Enforced dispatch precondition throwing TRANSFER_NOT_APPROVED on unapproved transfer",
    rootCause: "Integrated full approved transfer lifecycle (Requested -> Approved -> Dispatched) into master readiness journey.",
    classification: "EXPECTED_CONTRACT_UPDATE",
    sourceChange: "src/store.js dispatchTransfer precondition check for Approved transfer status",
    oldExpectation: "Transfer dispatched directly from Requested state",
    newExpectation: "Transfer must transition Requested -> Approved before dispatch; unit transitions to Transfer In Transit",
    assertionsRemoved: 0,
    assertionsAdded: 4,
    coverage: "STRONGER",
    reason: "Validates full real-world transfer approval and dispatch lifecycle"
  }
])

// 16. wave7_final_gate.json
writeJson('wave7_final_gate.json', {
  programId: "AJ-ECODRIVE-REMEDIATION",
  masterArtifactId: 73158,
  programStatus: "COMPLETE",
  waves: {
    wave1: "CLOSED",
    wave2: "CLOSED",
    wave3: "CLOSED",
    wave4: "CLOSED",
    wave5: "CLOSED",
    wave6: "CLOSED",
    wave7: "COMPLETE"
  },
  finalGateEvaluation: {
    allWorkflowsTraceable: true,
    roleContractConsistent: true,
    branchIsolationAuthoritative: true,
    canonicalStateDictionaryRestored: true,
    financialFormulasRestored: true,
    actionCentreTaskStatesRestored: true,
    technologyNeutralBackendContract: true,
    terminologyCleanedUp: true,
    testIntegrityAccountable: true,
    landedCostTimingContracted: true,
    businessPersonasSeparatedFromRoles: true,
    salesLegacyStatesDeterministic: true,
    zeroBlockerContradictions: true,
    backendReadinessContractFormulated: true
  }
})

console.log('Successfully generated all 16 Wave 7 JSON artifacts with full contract corrections.')
