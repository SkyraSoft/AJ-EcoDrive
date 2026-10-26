/**
 * AJ EcoDrive — Master Business User Story Graph Registry
 * Machine-Readable Specification of End-to-End Business Journeys
 */

export const userStoryGraphRegistry = [
  {
    "storyId": "US-001",
    "actor": "Super Admin",
    "role": "Super Admin",
    "branchContext": "Global / All Branches",
    "businessGoal": "Provision Dealership Branch Network",
    "trigger": "Opening new regional dealership facility (e.g. Multan Showroom & Workshop)",
    "preconditions": "Super Admin authenticated session active",
    "startingState": "Branch record uncreated",
    "startingRoute": "/organisation/branches/create",
    "requiredInformation": [
      "Branch Name",
      "Facility Code (e.g. MLT-01)",
      "City",
      "Address",
      "Manager CNIC",
      "Phone"
    ],
    "interactionSequence": "Form input -> Validation -> Click Save Branch -> Store Mutation -> Redirect to /organisation/branches",
    "decisions": "Validate unique facility code and city assignment",
    "recordsCreated": [
      "Branch (MLT-01)"
    ],
    "recordsModified": [
      "store.branches"
    ],
    "statusTransitions": "Uncreated -> Active Branch",
    "crossRoleHandoffs": "Super Admin provisions branch -> Branch Manager assigned to MLT-01 can log in",
    "crossBranchHandoffs": "Branch added to global inter-branch transfer network",
    "successOutcome": "Branch active in store and selectable in global/branch dropdowns",
    "failureOutcome": "Duplicate code alert displayed inline",
    "cancellationOutcome": "Form reset without store modification",
    "auditEffects": "Logged in Audit Ledger: Action = BRANCH_CREATED",
    "notifications": "Notification broadcast to Super Admin dashboard",
    "nextPossibleStories": [
      "US-002: User Account Provisioning"
    ]
  },
  {
    "storyId": "US-002",
    "actor": "Super Admin",
    "role": "Super Admin",
    "branchContext": "Global / All Branches",
    "businessGoal": "Provision Staff User Accounts & Role Permissions",
    "trigger": "New Branch Manager hired for Peshawar branch",
    "preconditions": "Target branch MLT-01 or PEW-01 exists",
    "startingState": "User account unprovisioned",
    "startingRoute": "/organisation/users/create",
    "requiredInformation": [
      "Full Name",
      "CNIC",
      "Role (Branch Manager)",
      "Assigned Branch (Peshawar)",
      "Email",
      "Initial Passcode"
    ],
    "interactionSequence": "Select Role & Branch -> Input CNIC & Phone -> Submit User Form -> Store Mutation",
    "decisions": "Enforce branch scope assignment for Branch Manager role",
    "recordsCreated": [
      "User (USR-09)"
    ],
    "recordsModified": [
      "store.users"
    ],
    "statusTransitions": "Inactive -> Active User",
    "crossRoleHandoffs": "Super Admin provisions credentials -> User logs in as Branch Manager",
    "crossBranchHandoffs": "N/A",
    "successOutcome": "User can authenticate and access Peshawar branch scope",
    "failureOutcome": "CNIC format validation error",
    "cancellationOutcome": "User creation aborted",
    "auditEffects": "Logged in Audit Ledger: Action = USER_PROVISIONED",
    "notifications": "User welcome notification queued",
    "nextPossibleStories": [
      "US-003: Commercial Catalogue Setup"
    ]
  },
  {
    "storyId": "US-003",
    "actor": "Super Admin / Inventory Manager",
    "role": "Super Admin",
    "branchContext": "Global",
    "businessGoal": "Create Product Variant in Commercial Catalogue",
    "trigger": "New EV Model introduced (e.g. EcoDrive E-Sedan 60kWh)",
    "preconditions": "Super Admin authenticated session",
    "startingState": "Product variant unlisted",
    "startingRoute": "/catalogue/create",
    "requiredInformation": [
      "Model Name",
      "SKU / Variant Code",
      "Battery Capacity (kWh)",
      "MSRP Price (PKR)",
      "Color Options",
      "Warranty Period (Months/km)"
    ],
    "interactionSequence": "Fill Model details -> Set MSRP -> Save Product -> Catalogue listing updated",
    "decisions": "Set canonical pricing and warranty defaults for all branches",
    "recordsCreated": [
      "Product Variant (PROD-EV-60)"
    ],
    "recordsModified": [
      "store.products"
    ],
    "statusTransitions": "Draft -> Active Commercial Listing",
    "crossRoleHandoffs": "Super Admin sets catalogue MSRP -> Branch Managers can issue quotations",
    "crossBranchHandoffs": "Available across all branch POS inventory listings",
    "successOutcome": "Product available for Purchase Order creation and Sales Quotations",
    "failureOutcome": "SKU collision alert",
    "cancellationOutcome": "Aborted without saving",
    "auditEffects": "Logged in Audit Ledger: Action = PRODUCT_CATALOGUE_ADDED",
    "notifications": "Catalogue update broadcast to all Branch Managers",
    "nextPossibleStories": [
      "US-004: Purchase Order Generation"
    ]
  },
  {
    "storyId": "US-004",
    "actor": "Procurement Officer / Branch Manager",
    "role": "Branch Manager",
    "branchContext": "Peshawar Branch",
    "businessGoal": "Issue Factory Purchase Order & Receive EV Units",
    "trigger": "Showroom stock level below buffer threshold",
    "preconditions": "Supplier (BRG Factory) and Product SKU exist",
    "startingState": "PO Draft",
    "startingRoute": "/procurement/create-order",
    "requiredInformation": [
      "Supplier ID",
      "Product ID",
      "Order Quantity",
      "Target Branch",
      "Expected Delivery Date"
    ],
    "interactionSequence": "Select Supplier & Product -> Enter Qty -> Submit PO -> Store PO Creation -> Post Receipt at /procurement/receive-purchase -> Auto-create Serialized VINs",
    "decisions": "Validate PO approval threshold (auto-approved under PKR 5M)",
    "recordsCreated": [
      "Purchase Order (PO-8558)",
      "Goods Receipt Note (GRN-7641)",
      "Serialized Units (TEST-VIN-PROC-1790788272901)"
    ],
    "recordsModified": [
      "store.purchaseOrders",
      "store.serializedUnits",
      "store.products"
    ],
    "statusTransitions": "Draft -> Approved -> Fully Received",
    "crossRoleHandoffs": "BM issues PO -> Super Admin reviews procurement audit -> Inventory Lead receives units",
    "crossBranchHandoffs": "Units assigned to Peshawar branch stock",
    "successOutcome": "Stock incremented by Qty; Serialized VINs created with Available status",
    "failureOutcome": "Invalid quantity or supplier inactive",
    "cancellationOutcome": "PO cancelled",
    "auditEffects": "Logged: Action = PURCHASE_ORDER_RECEIVED",
    "notifications": "Inventory update notification to Peshawar Branch Manager",
    "nextPossibleStories": [
      "US-005: Inter-Branch Stock Transfer",
      "US-006: Retail Sales & Customer Booking"
    ]
  },
  {
    "storyId": "US-005",
    "actor": "Origin Branch Manager (Peshawar)",
    "role": "Branch Manager",
    "branchContext": "Multi-Branch (Peshawar -> Islamabad)",
    "businessGoal": "Execute Inter-Branch Serialized EV Unit Transfer",
    "trigger": "Islamabad branch requires specific VIN for customer order",
    "preconditions": "Unit (UNIT-101) Available in Peshawar branch stock",
    "startingState": "Unit Available at Peshawar",
    "startingRoute": "/inventory/transfers/create",
    "requiredInformation": [
      "Destination Branch (Islamabad)",
      "VIN Selection (UNIT-101)",
      "Transfer Reason",
      "Driver / Logistics Info"
    ],
    "interactionSequence": "Select Destination -> Pick Available VIN -> Submit Transfer Request -> Unit set to In Transit -> Destination BM visits /inventory/transfers/receive -> Inspect VIN & Click Receive Transfer -> Unit branch updated to Islamabad with Available status",
    "decisions": "Prevent dispatch of Reserved or Sold units",
    "recordsCreated": [
      "Transfer Record (TR-7153)"
    ],
    "recordsModified": [
      "store.transfers",
      "store.serializedUnits"
    ],
    "statusTransitions": "Available (Peshawar) -> In Transit -> Available (Islamabad)",
    "crossRoleHandoffs": "Peshawar BM dispatches -> Islamabad BM receives -> Super Admin views global movement",
    "crossBranchHandoffs": "Peshawar stock -1, Islamabad stock +1, total system units constant",
    "successOutcome": "Unit successfully reassigned to Islamabad without duplicate record creation",
    "failureOutcome": "Transfer blocked if unit is in Reserved/Sold state",
    "cancellationOutcome": "Transfer cancelled, unit remains in Peshawar Available stock",
    "auditEffects": "Logged: Action = INTER_BRANCH_TRANSFER_COMPLETED",
    "notifications": "Transfer dispatch notification to Islamabad BM",
    "nextPossibleStories": [
      "US-006: Retail Sales Booking"
    ]
  },
  {
    "storyId": "US-006",
    "actor": "Branch Sales Consultant / Branch Manager",
    "role": "Branch Manager",
    "branchContext": "Islamabad Branch",
    "businessGoal": "Walk-In Customer Lead Intake, Quotation, Booking & Sales Invoice",
    "trigger": "Walk-in customer interested in EcoDrive Sedan",
    "preconditions": "Product available in catalogue, Serialized Unit available in Islamabad stock",
    "startingState": "Walk-in Lead Intake",
    "startingRoute": "/sales/leads/create",
    "requiredInformation": [
      "Customer Name",
      "CNIC (13-digit)",
      "Phone",
      "City",
      "Product Model",
      "Quotation Discount (max 8%)",
      "Advance Payment"
    ],
    "interactionSequence": "Intake Lead -> Convert to Customer (CUST-987) -> Issue Quotation (QT-9096) -> Book Sales Order (SO-1614) reserving VIN (UNIT-101) -> Generate Invoice (INV-5419) -> Record Payment (100% Settlement) -> Unit state transitions Reserved -> Sold",
    "decisions": "Enforce 8% discount ceiling (overrides route to Super Admin approval)",
    "recordsCreated": [
      "Customer (CUST-987)",
      "Quotation (QT-9096)",
      "Sales Order (SO-1614)",
      "Invoice (INV-5419)",
      "Payment Record"
    ],
    "recordsModified": [
      "store.customers",
      "store.quotations",
      "store.orders",
      "store.invoices",
      "store.serializedUnits"
    ],
    "statusTransitions": "Lead -> Customer Created -> Quotation Active -> Order Reserved -> Invoice Paid -> Unit Sold",
    "crossRoleHandoffs": "BM completes sale -> PDI Gate Pass assigned to Delivery Officer",
    "crossBranchHandoffs": "Islamabad revenue & inventory updated",
    "successOutcome": "Invoice paid in full, unit state set to Sold, ready for PDI handover",
    "failureOutcome": "Discount ceiling violation or invalid CNIC",
    "cancellationOutcome": "Lead remains open, unit reservation released",
    "auditEffects": "Logged: Action = SALES_ORDER_SETTLED",
    "notifications": "Sale completion toast & notification to Super Admin",
    "nextPossibleStories": [
      "US-007: 18-Point PDI & Handover Delivery"
    ]
  },
  {
    "storyId": "US-007",
    "actor": "Delivery Officer / Branch Manager",
    "role": "Branch Manager",
    "branchContext": "Islamabad Branch",
    "businessGoal": "Execute 18-Point PDI Inspection & Release Vehicle Handover",
    "trigger": "Sales Order settled in full (Invoice Paid)",
    "preconditions": "Sales Order (SO-1614) status Paid, Unit status Sold",
    "startingState": "PDI Pending Handover",
    "startingRoute": "/sales/deliveries/create",
    "requiredInformation": [
      "Order ID (SO-1614)",
      "Recipient CNIC",
      "18 Checklist Pass items (BMS, Charger, Paint, Brakes, Tires, Keys, etc.)",
      "Gate Pass Ref"
    ],
    "interactionSequence": "Select Paid Order -> Check 18 PDI verification items -> Submit Delivery (DEL-9526) -> Unit state transitions Sold -> Delivered -> Auto-register 2-Year Warranty (WAR-2599)",
    "decisions": "All 18 PDI checks must pass before Gate Pass release",
    "recordsCreated": [
      "Delivery Record (DEL-9526)",
      "Ownership Certificate (OWN-496)",
      "2-Year Warranty (WAR-2599)"
    ],
    "recordsModified": [
      "store.deliveries",
      "store.serializedUnits",
      "store.customers"
    ],
    "statusTransitions": "Sold -> Delivered -> Customer Owned",
    "crossRoleHandoffs": "Delivery Officer releases vehicle -> After-Sales team manages warranty coverage",
    "crossBranchHandoffs": "N/A",
    "successOutcome": "Vehicle delivered, ownership transferred, active warranty registered",
    "failureOutcome": "PDI checklist failure blocks handover",
    "cancellationOutcome": "Delivery hold enforced",
    "auditEffects": "Logged: Action = VEHICLE_DELIVERED",
    "notifications": "Handover complete notification sent to Customer & Branch Manager",
    "nextPossibleStories": [
      "US-008: Battery BMS Service & Repair Job"
    ]
  },
  {
    "storyId": "US-008",
    "actor": "Service Advisor / Workshop Manager",
    "role": "Branch Manager",
    "branchContext": "Workshop Desk (Islamabad)",
    "businessGoal": "Service Repair Job Intake, BMS Diagnostics & Warranty Claim",
    "trigger": "Customer brings vehicle for battery check / service complaint",
    "preconditions": "Customer and Unit exist in system",
    "startingState": "Service Intake",
    "startingRoute": "/after-sales/repairs/create",
    "requiredInformation": [
      "Unit VIN",
      "Customer ID",
      "Complaint Description",
      "Battery SOH %",
      "Odometer Reading",
      "Parts & Labor Costs"
    ],
    "interactionSequence": "Lookup VIN -> Input SOH % (e.g. 68%) -> System auto-evaluates warranty (SOH < 70% & Age <= 2 yrs -> 100% Warranty Covered) -> Submit Repair Job (RJ-6786) -> Complete Repair -> Post to Finance (INV-REP-6679)",
    "decisions": "Evaluate SOH warranty formula: SOH < 70% & Age <= 2 yrs -> PKR 0 customer payable under warranty",
    "recordsCreated": [
      "Service Case (SC-1946)",
      "Repair Job (RJ-6786)",
      "Repair Invoice (INV-REP-6679)"
    ],
    "recordsModified": [
      "store.repairs",
      "store.invoices",
      "store.serializedUnits"
    ],
    "statusTransitions": "Intake -> BMS Testing -> In Repair -> Completed -> Posted to Finance",
    "crossRoleHandoffs": "Service Advisor creates job -> Workshop Tech repairs -> Finance settles warranty claim",
    "crossBranchHandoffs": "N/A",
    "successOutcome": "Repair completed, warranty claim posted to finance, vehicle returned to customer",
    "failureOutcome": "Invalid VIN or missing complaint details",
    "cancellationOutcome": "Repair job cancelled",
    "auditEffects": "Logged: Action = REPAIR_JOB_COMPLETED",
    "notifications": "Service complete notification",
    "nextPossibleStories": [
      "US-009: Petty Cash Expense & Approval Escalation"
    ]
  },
  {
    "storyId": "US-009",
    "actor": "Branch Manager / Super Admin",
    "role": "Branch Manager & Super Admin",
    "branchContext": "Own Branch -> Global Approval Queue",
    "businessGoal": "File Showroom Petty Cash Expense Voucher & Escalation",
    "trigger": "Branch incurs operational expenditure (e.g. Utility bill PKR 22,000)",
    "preconditions": "Branch Manager logged in",
    "startingState": "Voucher Draft",
    "startingRoute": "/finance/expenses/create",
    "requiredInformation": [
      "Category (Utilities)",
      "Amount (PKR 22,000)",
      "Description",
      "Receipt Reference"
    ],
    "interactionSequence": "Fill Voucher -> Submit -> Amount > PKR 15,000 local threshold -> Voucher status set to Pending SA Approval -> Super Admin visits /finance/expenses or Action Centre -> Evaluates details -> Clicks Approve -> Status updates to Approved -> Cash Vault balance updated",
    "decisions": "Amount <= PKR 15,000 auto-approved local limit; > PKR 15,000 requires Super Admin approval",
    "recordsCreated": [
      "Expense Voucher (EXP-4402)"
    ],
    "recordsModified": [
      "store.expenses",
      "store.auditLogs"
    ],
    "statusTransitions": "Draft -> Pending SA Approval -> Approved",
    "crossRoleHandoffs": "Branch Manager files voucher -> Super Admin approves -> Cash vault balance updated",
    "crossBranchHandoffs": "N/A",
    "successOutcome": "Expense approved and debited from cash vault ledger",
    "failureOutcome": "Super Admin rejects with rejection reason",
    "cancellationOutcome": "Expense voucher cancelled",
    "auditEffects": "Logged: Action = EXPENSE_APPROVED",
    "notifications": "Action Centre item created for Super Admin; approval notification sent to BM",
    "nextPossibleStories": [
      "US-010: Operational Reporting & Audit Review"
    ]
  },
  {
    "storyId": "US-010",
    "actor": "Super Admin / Compliance Officer",
    "role": "Super Admin",
    "branchContext": "Global / All Branches",
    "businessGoal": "Inspect Global Dealership Financial Ledger & Cryptographic Audit Logs",
    "trigger": "End-of-month financial reconciliation or compliance review",
    "preconditions": "Super Admin credentials active",
    "startingState": "Reporting Overview",
    "startingRoute": "/system/audit-logs",
    "requiredInformation": [
      "Date Range Filter",
      "Branch Filter",
      "User Filter",
      "Action Filter (CREATE/UPDATE/DELETE/APPROVE)"
    ],
    "interactionSequence": "Filter by Branch/Date -> Inspect cryptographic log entries -> Export PDF/CSV Audit Report -> Verify financial trial balance",
    "decisions": "Verify audit log hash integrity and cross-branch state alignment",
    "recordsCreated": [
      "Audit Report Export"
    ],
    "recordsModified": [],
    "statusTransitions": "N/A (Read-only Governance)",
    "crossRoleHandoffs": "Super Admin audits all branch activities",
    "crossBranchHandoffs": "Consolidates data across all regional branches",
    "successOutcome": "100% financial and operational traceability verified across system",
    "failureOutcome": "Discrepancy flagged for remediation",
    "cancellationOutcome": "Filters cleared",
    "auditEffects": "Logged: Action = AUDIT_LOG_INSPECTED",
    "notifications": "Compliance report ready toast",
    "nextPossibleStories": []
  }
];

export const totalUserStoriesCount = 10;

export default {
  userStories: userStoryGraphRegistry,
  totalStories: totalUserStoriesCount
};
