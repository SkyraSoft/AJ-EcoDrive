/**
 * AJ EcoDrive — Unified Frontend Architecture & Data Lineage Registry
 * Authoritative Machine-Readable Source of Truth
 */

export const unifiedFrontendArchitectureRegistry = [
  {
    "route": "/login",
    "name": "login",
    "component": "src/views/auth/Login.vue",
    "roles": [
      "Public"
    ],
    "accessTier": "Public Authentication",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 5,
    "elementInventory": {
      "headers": [],
      "tabs": [],
      "kpis": [
        "Presentation Demo Credentials"
      ],
      "tables": [],
      "fields": [],
      "buttons": [
        ": Selected"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/forgot-password",
    "name": "forgot-password",
    "component": "src/views/auth/ForgotPassword.vue",
    "roles": [
      "Public"
    ],
    "accessTier": "Public Authentication",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 2,
    "elementInventory": {
      "headers": [],
      "tabs": [],
      "kpis": [
        "Back to Login"
      ],
      "tables": [],
      "fields": [],
      "buttons": []
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/verify-identity",
    "name": "verify-identity",
    "component": "src/views/auth/VerifyIdentity.vue",
    "roles": [
      "Public"
    ],
    "accessTier": "Public Authentication",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 1,
    "elementInventory": {
      "headers": [],
      "tabs": [],
      "kpis": [],
      "tables": [],
      "fields": [],
      "buttons": []
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/create-new-password",
    "name": "create-new-password",
    "component": "src/views/auth/CreateNewPassword.vue",
    "roles": [
      "Public"
    ],
    "accessTier": "Public Authentication",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 2,
    "elementInventory": {
      "headers": [],
      "tabs": [],
      "kpis": [],
      "tables": [],
      "fields": [],
      "buttons": []
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/password-updated",
    "name": "password-updated",
    "component": "src/layouts/MainLayout.vue",
    "roles": [
      "Public"
    ],
    "accessTier": "Public Authentication",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 1,
    "elementInventory": {
      "headers": [],
      "tabs": [],
      "kpis": [
        "WORKSPACE"
      ],
      "tables": [],
      "fields": [],
      "buttons": []
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/dashboard",
    "name": "dashboard",
    "component": "src/views/dashboard/SuperAdminDashboard.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 36,
    "elementInventory": {
      "headers": [
        "Branch Manager Dashboard",
        "Sales Trend",
        "Branch Snapshot",
        "Action Required",
        "Super Admin Dashboard",
        "Sales Performance",
        "Branch Performance",
        "Inventory Overview",
        "Expense Summary",
        "Management Communication",
        "Recent Activity"
      ],
      "tabs": [],
      "kpis": [
        "· Click to view &rsaquo;",
        "Branch Snapshot Click tile to open module",
        "Action",
        "Open",
        "Expense Summary Manage Expenses"
      ],
      "tables": [
        [
          "Priority",
          "Item",
          "Record",
          "Status",
          "Action"
        ]
      ],
      "fields": [],
      "buttons": [
        "View Full Action Centre &rsaquo;",
        "Open",
        "View All &rsaquo;",
        "Action Centre &rsaquo;",
        "Open Tasks &rsaquo;"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/dashboard/branch-performance",
    "name": "branch-performance",
    "component": "src/views/dashboard/BranchPerformance.vue",
    "roles": [
      "SuperAdmin"
    ],
    "accessTier": "Super Admin Restricted",
    "branchScope": "Global / All Branches",
    "checkpointsCount": 7,
    "elementInventory": {
      "headers": [
        "My Branch Performance",
        "Target vs Actual",
        "Performance Indicators",
        "Branch Performance",
        "Branch Ranking",
        "Sales vs Expenses",
        "Detailed Branch Comparison"
      ],
      "tabs": [],
      "kpis": [],
      "tables": [
        [
          "Branch",
          "Sales",
          "COGS",
          "Gross Profit",
          "OpEx",
          "Net Profit",
          "Units",
          "Margin",
          "Inventory",
          "Action"
        ]
      ],
      "fields": [],
      "buttons": []
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/dashboard/business-performance",
    "name": "business-performance",
    "component": "src/views/dashboard/BusinessPerformance.vue",
    "roles": [
      "SuperAdmin"
    ],
    "accessTier": "Super Admin Restricted",
    "branchScope": "Global / All Branches",
    "checkpointsCount": 5,
    "elementInventory": {
      "headers": [
        "Business Performance",
        "Profitability Trend",
        "Branch Contribution",
        "Top Products",
        "Top Categories"
      ],
      "tabs": [],
      "kpis": [],
      "tables": [
        [
          "Product",
          "Revenue",
          "Units",
          "Margin",
          "Category",
          "Revenue",
          "Gross Profit",
          "Share"
        ]
      ],
      "fields": [],
      "buttons": []
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/dashboard/action-centre",
    "name": "action-centre",
    "component": "src/views/dashboard/ActionCentre.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 48,
    "elementInventory": {
      "headers": [
        "Action Centre",
        "Active Operational Work Queue",
        "Commercial Waiver Breakdown",
        "Inter-Branch Route & Allocation Details",
        "Reimbursement & Payee Verification",
        "Technical Diagnostics & Warranty Sign-Off",
        "Governance Audit & Quarantine Sign-Off"
      ],
      "tabs": [
        "Reset",
        "Clear all filters",
        "&larr; Back to Categories"
      ],
      "kpis": [
        "Pending Actions",
        "Action Required",
        "High Severity",
        "Same Day SLA",
        "Completed",
        "Status:",
        "Reset",
        "Treatment",
        "Operational Context:",
        "Commercial Waiver Breakdown Customer",
        "Inter-Branch Route & Allocation Details Transit Route",
        "Reimbursement & Payee Verification Payee Vendor",
        "Technical Diagnostics & Warranty Sign-Off Customer & VIN",
        "Governance Audit & Quarantine Sign-Off Affected VINs"
      ],
      "tables": [
        [
          "Priority",
          "Type",
          "Action Description",
          "Branch / Source",
          "Linked Ref",
          "Due",
          "Status",
          "Treatment"
        ]
      ],
      "fields": [
        "Search actions, records, VINs...",
        "Concise operational action title...",
        "actionForm.priority",
        "e.g. Peshawar Logistics Co",
        "0300-XXXXXXX",
        "actionForm.pricing.modelName",
        "SO-8821 or QT-8421",
        "action-pricing-unitcount",
        "action-pricing-requesteddiscountpercent",
        "Why should Head Office grant this price reduction? (e.g. competitor offer, key trial deal)...",
        "actionForm.stock.originBranch",
        "actionForm.stock.destinationBranch",
        "actionForm.stock.modelName",
        "action-stock-requestedqty",
        "e.g. VIN-LHE-2026-00411",
        "SO-7910",
        "actionForm.stock.logisticsCarrier",
        "action-stock-freightcostestimate",
        "Why is this stock pull required urgently? Customer deposit status, delivery deadline...",
        "actionForm.expense.expenseCategory",
        "action-expense-amountpkr",
        "Vendor company name",
        "NTN-XXXXXXX",
        "actionForm.expense.paymentMethod",
        "INV-XXXX",
        "Why is this emergency expenditure necessary? Explain consequence of not approving...",
        "Customer Name",
        "VIN-PK-BRG-XXXX-XXXXX",
        "action-warranty-odometerkm",
        "actionForm.warranty.defectComponent",
        "e.g. BMS-ERR-042: Cell Under-Voltage",
        "PART-BAT-7252-NMC",
        "Describe cell voltage drift, temperature shutdown, lack of water damage/puncture...",
        "VIN-PK-BRG-2026-00941",
        "actionForm.governance.modelName",
        "action-governance-discrepancyunitcount",
        "action-governance-estimatedvariancepkr",
        "actionForm.governance.rootCauseClassification",
        "actionForm.governance.recommendedAction",
        "Detailed physical observations, damaged parts, crate status, delivery slip notations...",
        "Enter official sign-off notes, conditions, or instructions...",
        "counterdiscountpercent",
        "Action Title *",
        "Priority",
        "Customer / Organization Name *",
        "Customer Phone",
        "Vehicle Model / Category",
        "Quotation / Order Ref",
        "Unit Count",
        "Requested Discount % (Showroom Limit: 8%)",
        "Competitor Context & Deal Justification *",
        "Origin Source Branch / Hub *",
        "Destination Requesting Showroom *",
        "Target Model SKU",
        "Units Required",
        "Specific Chassis VINs (if known)",
        "Linked Customer Booking / Order Ref",
        "Logistics Carrier Mode",
        "Estimated Freight Cost (PKR)",
        "Urgency & Operational Reason *",
        "Expense Category *",
        "Invoice / Bill Amount (PKR) *",
        "Payee Vendor / Contractor Name *",
        "Vendor NTN / Tax ID",
        "Disbursement Mode",
        "Bill / Invoice Reference #",
        "Emergency Justification & Impact of Delay *",
        "Customer Name & Phone *",
        "Vehicle Chassis VIN *",
        "Odometer Reading (km)",
        "Defective Component *",
        "OBD / BMS Diagnostic DTC Code",
        "Replacement OEM SKU Needed",
        "Workshop Technician Findings & Safety Assessment *",
        "Affected Serialized VIN(s) / SKU *",
        "Vehicle Model",
        "Discrepancy / Damaged Unit Count",
        "Estimated Financial Impact (PKR)",
        "Root Cause Classification",
        "Proposed Resolution Action",
        "Incident Report & Evidence Description *",
        "Treatment & Decision Rationale Notes"
      ],
      "buttons": [
        "Branch:",
        "Status:",
        "Reset",
        "Export Queue",
        "Treat / Inspect &rarr;",
        "Clear all filters",
        "&larr; Back to Categories",
        "Cancel",
        "Submit Action Request",
        "Apply Cap",
        "Open Source Document",
        "Counter-Offer / Cap",
        "Reject Waiver",
        "Approve Full Discount"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/dashboard/quick-actions",
    "name": "quick-actions",
    "component": "src/views/dashboard/QuickActions.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 5,
    "elementInventory": {
      "headers": [
        "Showroom Quick Actions",
        "Commercial & Sales Actions",
        "Showroom Operations & Workshop"
      ],
      "tabs": [],
      "kpis": [],
      "tables": [],
      "fields": [],
      "buttons": []
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/organisation/branches",
    "name": "organisation-branches",
    "component": "src/views/organisation/Branches.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 14,
    "elementInventory": {
      "headers": [
        "Branches",
        "Archive branch?"
      ],
      "tabs": [
        "Clear Filters",
        "Reset filters"
      ],
      "kpis": [
        "Clear Filters",
        "Actions"
      ],
      "tables": [
        [
          "Branch",
          "Code",
          "City",
          "Manager",
          "Sales",
          "Inventory",
          "Expenses",
          "Net Profit",
          "Status",
          "Actions"
        ]
      ],
      "fields": [
        "Search branches..."
      ],
      "buttons": [
        "Add Branch",
        "Clear Filters",
        "Reset filters",
        "Cancel",
        "Archive branch"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/organisation/branches/create",
    "name": "organisation-create-branch",
    "component": "src/views/organisation/CreateBranch.vue",
    "roles": [
      "SuperAdmin"
    ],
    "accessTier": "Super Admin Restricted",
    "branchScope": "Global / All Branches",
    "checkpointsCount": 37,
    "elementInventory": {
      "headers": [
        "Create Branch",
        "1. Branch Identity",
        "2. Location & Contact",
        "3. Management & Operations",
        "4. Controls & Policies"
      ],
      "tabs": [],
      "kpis": [
        "Active Inactive"
      ],
      "tables": [],
      "fields": [
        "e.g. Peshawar Branch",
        "e.g. PEW-01",
        "form.status",
        "e.g. 123 Main St",
        "e.g. Peshawar",
        "e.g. Hayatabad",
        "+92 300 1234567",
        "pew@ajecodrive.com",
        "form.manager",
        "e.g. 9 AM - 6 PM",
        "e.g. Main Warehouse",
        "100000",
        "10%",
        "Standard BRG retail rules",
        "Optional internal notes...",
        "Branch Name *",
        "Branch Code *",
        "Status",
        "Address",
        "City *",
        "Area",
        "Phone *",
        "Email *",
        "Branch Manager",
        "Opening Hours",
        "Default Stock Location",
        "Expense Limit (PKR)",
        "Discount Limit",
        "Sales Settings",
        "Notes"
      ],
      "buttons": [
        "Cancel",
        "Create Branch"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/organisation/branches/edit",
    "name": "organisation-edit-branch-legacy",
    "component": "src/views/organisation/EditBranch.vue",
    "roles": [
      "SuperAdmin"
    ],
    "accessTier": "Super Admin Restricted",
    "branchScope": "Global / All Branches",
    "checkpointsCount": 37,
    "elementInventory": {
      "headers": [
        "Edit Branch",
        "1. Identity",
        "2. Location & Contact",
        "3. Manager & Operations",
        "4. Controls & Policies"
      ],
      "tabs": [],
      "kpis": [
        "· ·",
        "Active Inactive"
      ],
      "tables": [],
      "fields": [
        "branchData.name",
        "branchData.code",
        "branchData.status",
        "branchData.address",
        "branchData.city",
        "branchData.area",
        "branchData.phone",
        "branchData.email",
        "branchData.manager",
        "branchData.defaultLocation",
        "branchData.hours",
        "branchData.expenseLimit",
        "branchData.discountLimit",
        "branchData.salesRules",
        "Quarterly branch configuration review.",
        "Branch Name *",
        "Branch Code *",
        "Status",
        "Address",
        "City *",
        "Area",
        "Phone *",
        "Email *",
        "Branch Manager",
        "Default Stock Location",
        "Opening Hours",
        "Expense Limit (PKR)",
        "Discount Limit",
        "Sales Rules",
        "Change Note"
      ],
      "buttons": [
        "Cancel",
        "Save Changes"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/organisation/branches/edit/:id",
    "name": "organisation-edit-branch",
    "component": "src/views/organisation/EditBranch.vue",
    "roles": [
      "SuperAdmin"
    ],
    "accessTier": "Super Admin Restricted",
    "branchScope": "Global / All Branches",
    "checkpointsCount": 37,
    "elementInventory": {
      "headers": [
        "Edit Branch",
        "1. Identity",
        "2. Location & Contact",
        "3. Manager & Operations",
        "4. Controls & Policies"
      ],
      "tabs": [],
      "kpis": [
        "· ·",
        "Active Inactive"
      ],
      "tables": [],
      "fields": [
        "branchData.name",
        "branchData.code",
        "branchData.status",
        "branchData.address",
        "branchData.city",
        "branchData.area",
        "branchData.phone",
        "branchData.email",
        "branchData.manager",
        "branchData.defaultLocation",
        "branchData.hours",
        "branchData.expenseLimit",
        "branchData.discountLimit",
        "branchData.salesRules",
        "Quarterly branch configuration review.",
        "Branch Name *",
        "Branch Code *",
        "Status",
        "Address",
        "City *",
        "Area",
        "Phone *",
        "Email *",
        "Branch Manager",
        "Default Stock Location",
        "Opening Hours",
        "Expense Limit (PKR)",
        "Discount Limit",
        "Sales Rules",
        "Change Note"
      ],
      "buttons": [
        "Cancel",
        "Save Changes"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/organisation/branches/detail",
    "name": "organisation-branch-detail-legacy",
    "component": "src/views/organisation/BranchDetail.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 18,
    "elementInventory": {
      "headers": [
        "Branch Detail &mdash;",
        "Peshawar Branch",
        "Branch Identity",
        "Current Alerts"
      ],
      "tabs": [],
      "kpis": [
        "Peshawar Branch PEW-01 &middot; Peshawar &middot; Manager: Ahsan Khan",
        "Net Sales",
        "Branch Identity Manager Ahsan Khan"
      ],
      "tables": [],
      "fields": [],
      "buttons": [
        "Edit Branch",
        "More"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/organisation/branches/:id",
    "name": "organisation-branch-detail",
    "component": "src/views/organisation/BranchDetail.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 18,
    "elementInventory": {
      "headers": [
        "Branch Detail &mdash;",
        "Peshawar Branch",
        "Branch Identity",
        "Current Alerts"
      ],
      "tabs": [],
      "kpis": [
        "Peshawar Branch PEW-01 &middot; Peshawar &middot; Manager: Ahsan Khan",
        "Net Sales",
        "Branch Identity Manager Ahsan Khan"
      ],
      "tables": [],
      "fields": [],
      "buttons": [
        "Edit Branch",
        "More"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/organisation/users",
    "name": "organisation-users",
    "component": "src/views/organisation/UsersAccess.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 11,
    "elementInventory": {
      "headers": [
        "Users & Access"
      ],
      "tabs": [
        "Clear Filters",
        "Reset filters"
      ],
      "kpis": [
        "Clear Filters",
        "Actions"
      ],
      "tables": [
        [
          "User",
          "Role",
          "Branch",
          "MFA",
          "Last Login",
          "Status",
          "Actions"
        ]
      ],
      "fields": [
        "Search users..."
      ],
      "buttons": [
        "Add User",
        "Clear Filters",
        "Reset filters"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/organisation/users/create",
    "name": "organisation-create-user",
    "component": "src/views/organisation/CreateUser.vue",
    "roles": [
      "SuperAdmin"
    ],
    "accessTier": "Super Admin Restricted",
    "branchScope": "Global / All Branches",
    "checkpointsCount": 23,
    "elementInventory": {
      "headers": [
        "Add User",
        "1. User Identity",
        "2. Role & Scope",
        "3. Security & Access",
        "4. Permissions Scope"
      ],
      "tabs": [],
      "kpis": [
        "Active Pending Inactive"
      ],
      "tables": [],
      "fields": [
        "e.g. Ahsan Khan",
        "e.g. ahsan@ajecodrive.com",
        "+92 300 555 0191",
        "form.role",
        "form.branch",
        "form.status",
        "form.mfa",
        "form.sessionPolicy",
        "Full Name *",
        "Email Address *",
        "Mobile Number",
        "Role *",
        "Assigned Branch *",
        "Status",
        "MFA Requirement",
        "Session Policy"
      ],
      "buttons": [
        "Cancel",
        "Create User & Send Invite"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/organisation/users/edit",
    "name": "organisation-edit-user-legacy",
    "component": "src/views/organisation/EditUser.vue",
    "roles": [
      "SuperAdmin"
    ],
    "accessTier": "Super Admin Restricted",
    "branchScope": "Global / All Branches",
    "checkpointsCount": 23,
    "elementInventory": {
      "headers": [
        "Edit User",
        "1. User Identity",
        "2. Role & Scope",
        "3. Security & Access",
        "4. Permissions Scope"
      ],
      "tabs": [],
      "kpis": [
        "· ·",
        "Active Pending Inactive"
      ],
      "tables": [],
      "fields": [
        "userData.name",
        "userData.email",
        "userData.mobile",
        "userData.role",
        "userData.branch",
        "userData.status",
        "userData.mfa",
        "userData.sessionPolicy",
        "Full Name *",
        "Email *",
        "Mobile",
        "Role *",
        "Assigned Branch *",
        "Status",
        "MFA Requirement",
        "Session Policy"
      ],
      "buttons": [
        "Cancel",
        "Save Changes"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/organisation/users/edit/:id",
    "name": "organisation-edit-user",
    "component": "src/views/organisation/EditUser.vue",
    "roles": [
      "SuperAdmin"
    ],
    "accessTier": "Super Admin Restricted",
    "branchScope": "Global / All Branches",
    "checkpointsCount": 23,
    "elementInventory": {
      "headers": [
        "Edit User",
        "1. User Identity",
        "2. Role & Scope",
        "3. Security & Access",
        "4. Permissions Scope"
      ],
      "tabs": [],
      "kpis": [
        "· ·",
        "Active Pending Inactive"
      ],
      "tables": [],
      "fields": [
        "userData.name",
        "userData.email",
        "userData.mobile",
        "userData.role",
        "userData.branch",
        "userData.status",
        "userData.mfa",
        "userData.sessionPolicy",
        "Full Name *",
        "Email *",
        "Mobile",
        "Role *",
        "Assigned Branch *",
        "Status",
        "MFA Requirement",
        "Session Policy"
      ],
      "buttons": [
        "Cancel",
        "Save Changes"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/organisation/users/detail",
    "name": "organisation-user-detail-legacy",
    "component": "src/views/organisation/UserDetail.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 13,
    "elementInventory": {
      "headers": [
        "User Detail —",
        "Ahsan Khan",
        "Profile",
        "Account Summary"
      ],
      "tabs": [],
      "kpis": [
        "Ahsan Khan Branch Manager · Peshawar Branch · ahsan@ajecodrive.com",
        "Account Summary"
      ],
      "tables": [],
      "fields": [],
      "buttons": [
        "Edit User",
        "More"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/organisation/users/:id",
    "name": "organisation-user-detail",
    "component": "src/views/organisation/UserDetail.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 13,
    "elementInventory": {
      "headers": [
        "User Detail —",
        "Ahsan Khan",
        "Profile",
        "Account Summary"
      ],
      "tabs": [],
      "kpis": [
        "Ahsan Khan Branch Manager · Peshawar Branch · ahsan@ajecodrive.com",
        "Account Summary"
      ],
      "tables": [],
      "fields": [],
      "buttons": [
        "Edit User",
        "More"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/organisation/roles",
    "name": "organisation-roles",
    "component": "src/views/organisation/RolesPermissions.vue",
    "roles": [
      "SuperAdmin"
    ],
    "accessTier": "Super Admin Restricted",
    "branchScope": "Global / All Branches",
    "checkpointsCount": 6,
    "elementInventory": {
      "headers": [
        "Roles & Permissions",
        "Roles",
        "Permission Model",
        "Selected Role ·"
      ],
      "tabs": [],
      "kpis": [
        "Action No roles found."
      ],
      "tables": [
        [
          "Role",
          "Users",
          "Scope",
          "Status",
          "Action",
          "Module",
          "View",
          "Create",
          "Edit",
          "Approve",
          "Export"
        ]
      ],
      "fields": [
        "Search role..."
      ],
      "buttons": [
        "Create Role"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/organisation/roles/create",
    "name": "organisation-create-role",
    "component": "src/views/organisation/CreateRole.vue",
    "roles": [
      "SuperAdmin"
    ],
    "accessTier": "Super Admin Restricted",
    "branchScope": "Global / All Branches",
    "checkpointsCount": 12,
    "elementInventory": {
      "headers": [
        "Create / Edit Role",
        "Role Details",
        "Module Permissions"
      ],
      "tabs": [],
      "kpis": [],
      "tables": [
        [
          "Module",
          "View",
          "Create",
          "Edit",
          "Approve",
          "Export"
        ]
      ],
      "fields": [
        "e.g. Area Manager",
        "Assigned Branch",
        "Brief description of the role",
        "Role Name",
        "Scope",
        "Description"
      ],
      "buttons": [
        "Grant All Access",
        "Cancel",
        "Save Role"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/catalogue/categories",
    "name": "catalogue-categories",
    "component": "src/views/catalogue/Categories.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 13,
    "elementInventory": {
      "headers": [
        "Categories",
        "Category Hierarchy",
        "Specification Templates"
      ],
      "tabs": [
        "Clear Filters",
        "Reset filters"
      ],
      "kpis": [
        "Clear Filters",
        "Category Hierarchy Showing categories",
        "Actions",
        "Reset filters",
        "Specification Templates"
      ],
      "tables": [
        [
          "Category",
          "Subcategories",
          "Products",
          "Template",
          "Status",
          "Actions"
        ]
      ],
      "fields": [
        "Search category, template..."
      ],
      "buttons": [
        "Add Category",
        "Clear Filters",
        "Reset filters"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/catalogue/categories/create",
    "name": "catalogue-create-category",
    "component": "src/views/catalogue/CreateCategory.vue",
    "roles": [
      "SuperAdmin"
    ],
    "accessTier": "Super Admin Restricted",
    "branchScope": "Global / All Branches",
    "checkpointsCount": 13,
    "elementInventory": {
      "headers": [
        "Create Category",
        "1. Category Details",
        "2. Hierarchy & Templates"
      ],
      "tabs": [],
      "kpis": [],
      "tables": [],
      "fields": [
        "e.g. Electric Bikes",
        "e.g. E-BIKE",
        "Category Name",
        "Category Code",
        "Description (Optional)",
        "Category Type",
        "Parent Category (If Subcategory)",
        "Specification Template"
      ],
      "buttons": [
        "Cancel",
        "Create Category"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/catalogue/products",
    "name": "catalogue-products",
    "component": "src/views/catalogue/Products.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 32,
    "elementInventory": {
      "headers": [
        "Products",
        "Branch Product Catalogue",
        "Product Catalogue",
        "No matching results",
        "Archive product?"
      ],
      "tabs": [
        "Clear",
        "Clear all filters",
        "Clear Filters",
        "Clear filters"
      ],
      "kpis": [
        "Status:",
        "Status Actions View Details Mark as Low Stock Mark as Poor Stock",
        "Clear Filters",
        "Clear filters"
      ],
      "tables": [
        [
          "Product",
          "SKU",
          "Category",
          "Selling Price",
          "Available",
          "Reserved",
          "Incoming",
          "Status",
          "Actions",
          "Product",
          "SKU",
          "Category",
          "Selling Price",
          "Total",
          "Available",
          "Reserved",
          "Incoming",
          "Low Stock",
          "Status",
          "Actions"
        ]
      ],
      "fields": [
        "Search product, SKU...",
        "Search product / SKU..."
      ],
      "buttons": [
        "Status:",
        "Category:",
        "Stock:",
        "10)', 'Low Stock (",
        "Price:",
        "Clear",
        "Columns",
        "Export",
        "View Details",
        "Mark as Low Stock",
        "Mark as Poor Stock",
        "Clear all filters",
        "Create Product",
        "Clear Filters",
        "Clear filters",
        "Cancel",
        "Archive product"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/catalogue/products/create",
    "name": "catalogue-create-product",
    "component": "src/views/catalogue/CreateProduct.vue",
    "roles": [
      "SuperAdmin"
    ],
    "accessTier": "Super Admin Restricted",
    "branchScope": "Global / All Branches",
    "checkpointsCount": 38,
    "elementInventory": {
      "headers": [
        "Create Product",
        "1. Identity & Classification",
        "2. Tracking & Variants",
        "3. Specifications & Media",
        "4. Commercial Rules",
        "Saved successfully",
        "Success"
      ],
      "tabs": [],
      "kpis": [],
      "tables": [],
      "fields": [
        "Electric Bikes",
        "Commuter",
        "Serialized - Serial + Chassis",
        "e.g. 5",
        "e.g. 90",
        "Active after review",
        "Product Name",
        "Category",
        "Subcategory",
        "Model",
        "SKU",
        "Tracking Method",
        "Variants",
        "Warranty",
        "Motor",
        "Battery",
        "Range",
        "Top Speed",
        "Product Images",
        "Selling Price",
        "Low Stock Threshold (Units)",
        "Poor Stock Threshold (Days Unsold)",
        "Documents",
        "Upload handleDocumentUpload(e, 'brochure')\" />",
        "Upload handleDocumentUpload(e, 'specSheet')\" />",
        "Upload handleDocumentUpload(e, 'warranty')\" />",
        "Activation"
      ],
      "buttons": [
        "Cancel",
        "Save Draft",
        "Review & Activate Product",
        "Continue"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/catalogue/create-product",
    "name": "catalogue-create-product-alias",
    "component": "src/views/catalogue/CreateProduct.vue",
    "roles": [
      "SuperAdmin"
    ],
    "accessTier": "Super Admin Restricted",
    "branchScope": "Global / All Branches",
    "checkpointsCount": 38,
    "elementInventory": {
      "headers": [
        "Create Product",
        "1. Identity & Classification",
        "2. Tracking & Variants",
        "3. Specifications & Media",
        "4. Commercial Rules",
        "Saved successfully",
        "Success"
      ],
      "tabs": [],
      "kpis": [],
      "tables": [],
      "fields": [
        "Electric Bikes",
        "Commuter",
        "Serialized - Serial + Chassis",
        "e.g. 5",
        "e.g. 90",
        "Active after review",
        "Product Name",
        "Category",
        "Subcategory",
        "Model",
        "SKU",
        "Tracking Method",
        "Variants",
        "Warranty",
        "Motor",
        "Battery",
        "Range",
        "Top Speed",
        "Product Images",
        "Selling Price",
        "Low Stock Threshold (Units)",
        "Poor Stock Threshold (Days Unsold)",
        "Documents",
        "Upload handleDocumentUpload(e, 'brochure')\" />",
        "Upload handleDocumentUpload(e, 'specSheet')\" />",
        "Upload handleDocumentUpload(e, 'warranty')\" />",
        "Activation"
      ],
      "buttons": [
        "Cancel",
        "Save Draft",
        "Review & Activate Product",
        "Continue"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/catalogue/products/edit",
    "name": "catalogue-edit-product-legacy",
    "component": "src/views/catalogue/EditProduct.vue",
    "roles": [
      "SuperAdmin"
    ],
    "accessTier": "Super Admin Restricted",
    "branchScope": "Global / All Branches",
    "checkpointsCount": 41,
    "elementInventory": {
      "headers": [
        "Edit Product",
        "1. Identity & Classification",
        "2. Tracking & Variants",
        "3. Specifications & Media",
        "4. Commercial Rules"
      ],
      "tabs": [],
      "kpis": [],
      "tables": [],
      "fields": [
        "productData.name",
        "Electric Bikes",
        "Commuter",
        "productData.model",
        "productData.sku",
        "Serialized - Serial + Chassis",
        "productData.variants",
        "productData.warranty",
        "productData.motor",
        "productData.battery",
        "productData.range",
        "productData.speed",
        "productData.price",
        "productData.reorderLevel",
        "productData.documents",
        "Active after review",
        "Product Name",
        "Category",
        "Subcategory",
        "Model",
        "SKU",
        "Tracking Method",
        "Variants",
        "Warranty",
        "Motor",
        "Battery",
        "Range",
        "Top Speed",
        "Media",
        "Selling Price",
        "Reorder Level",
        "Documents",
        "Activation"
      ],
      "buttons": [
        "Cancel",
        "Save Draft",
        "Save Product Changes"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/catalogue/products/edit/:id",
    "name": "catalogue-edit-product",
    "component": "src/views/catalogue/EditProduct.vue",
    "roles": [
      "SuperAdmin"
    ],
    "accessTier": "Super Admin Restricted",
    "branchScope": "Global / All Branches",
    "checkpointsCount": 41,
    "elementInventory": {
      "headers": [
        "Edit Product",
        "1. Identity & Classification",
        "2. Tracking & Variants",
        "3. Specifications & Media",
        "4. Commercial Rules"
      ],
      "tabs": [],
      "kpis": [],
      "tables": [],
      "fields": [
        "productData.name",
        "Electric Bikes",
        "Commuter",
        "productData.model",
        "productData.sku",
        "Serialized - Serial + Chassis",
        "productData.variants",
        "productData.warranty",
        "productData.motor",
        "productData.battery",
        "productData.range",
        "productData.speed",
        "productData.price",
        "productData.reorderLevel",
        "productData.documents",
        "Active after review",
        "Product Name",
        "Category",
        "Subcategory",
        "Model",
        "SKU",
        "Tracking Method",
        "Variants",
        "Warranty",
        "Motor",
        "Battery",
        "Range",
        "Top Speed",
        "Media",
        "Selling Price",
        "Reorder Level",
        "Documents",
        "Activation"
      ],
      "buttons": [
        "Cancel",
        "Save Draft",
        "Save Product Changes"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/catalogue/edit-product/:id",
    "name": "catalogue-edit-product-alias",
    "component": "src/views/catalogue/EditProduct.vue",
    "roles": [
      "SuperAdmin"
    ],
    "accessTier": "Super Admin Restricted",
    "branchScope": "Global / All Branches",
    "checkpointsCount": 41,
    "elementInventory": {
      "headers": [
        "Edit Product",
        "1. Identity & Classification",
        "2. Tracking & Variants",
        "3. Specifications & Media",
        "4. Commercial Rules"
      ],
      "tabs": [],
      "kpis": [],
      "tables": [],
      "fields": [
        "productData.name",
        "Electric Bikes",
        "Commuter",
        "productData.model",
        "productData.sku",
        "Serialized - Serial + Chassis",
        "productData.variants",
        "productData.warranty",
        "productData.motor",
        "productData.battery",
        "productData.range",
        "productData.speed",
        "productData.price",
        "productData.reorderLevel",
        "productData.documents",
        "Active after review",
        "Product Name",
        "Category",
        "Subcategory",
        "Model",
        "SKU",
        "Tracking Method",
        "Variants",
        "Warranty",
        "Motor",
        "Battery",
        "Range",
        "Top Speed",
        "Media",
        "Selling Price",
        "Reorder Level",
        "Documents",
        "Activation"
      ],
      "buttons": [
        "Cancel",
        "Save Draft",
        "Save Product Changes"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/catalogue/products/detail",
    "name": "catalogue-product-detail-legacy",
    "component": "src/views/catalogue/ProductDetail.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 48,
    "elementInventory": {
      "headers": [
        "Product Detail — BRG E9 Pro",
        "Product Detail —",
        "BRG DS11",
        "Product Summary",
        "Availability",
        "Technical Specifications",
        "Variants",
        "Price History",
        "Branch Stock",
        "Units",
        "Procurement History",
        "Recent Sales",
        "Warranty Rules & Cases",
        "Media & Documents",
        "Product Audit",
        "Data"
      ],
      "tabs": [],
      "kpis": [
        "Active",
        "BRG DS11 SKU BRG-DS11 · Electric Bikes · Serialized",
        "Product Summary",
        "Value",
        "Landed Cost Customer Action Open &rarr;",
        "Data This section is not implemented in the current prototype."
      ],
      "tables": [
        [
          "Specification",
          "Value",
          "Variant",
          "Code",
          "Selling Price",
          "Active",
          "Stock",
          "Effective",
          "Price",
          "Reason",
          "Changed By",
          "Branch",
          "Available",
          "Reserved",
          "Incoming",
          "QC",
          "Total",
          "Value",
          "Serial",
          "Chassis",
          "Branch",
          "Status",
          "Landed Cost",
          "Customer",
          "Action",
          "PO",
          "Supplier",
          "Qty",
          "Received",
          "Avg Landed Cost",
          "Date",
          "Action",
          "Order",
          "Branch",
          "Unit",
          "Customer",
          "Price",
          "Date",
          "File",
          "Type",
          "Usage",
          "Updated"
        ]
      ],
      "fields": [],
      "buttons": [
        "Edit Product",
        "More ▼"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/catalogue/products/:id",
    "name": "catalogue-product-detail",
    "component": "src/views/catalogue/ProductDetail.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 48,
    "elementInventory": {
      "headers": [
        "Product Detail — BRG E9 Pro",
        "Product Detail —",
        "BRG DS11",
        "Product Summary",
        "Availability",
        "Technical Specifications",
        "Variants",
        "Price History",
        "Branch Stock",
        "Units",
        "Procurement History",
        "Recent Sales",
        "Warranty Rules & Cases",
        "Media & Documents",
        "Product Audit",
        "Data"
      ],
      "tabs": [],
      "kpis": [
        "Active",
        "BRG DS11 SKU BRG-DS11 · Electric Bikes · Serialized",
        "Product Summary",
        "Value",
        "Landed Cost Customer Action Open &rarr;",
        "Data This section is not implemented in the current prototype."
      ],
      "tables": [
        [
          "Specification",
          "Value",
          "Variant",
          "Code",
          "Selling Price",
          "Active",
          "Stock",
          "Effective",
          "Price",
          "Reason",
          "Changed By",
          "Branch",
          "Available",
          "Reserved",
          "Incoming",
          "QC",
          "Total",
          "Value",
          "Serial",
          "Chassis",
          "Branch",
          "Status",
          "Landed Cost",
          "Customer",
          "Action",
          "PO",
          "Supplier",
          "Qty",
          "Received",
          "Avg Landed Cost",
          "Date",
          "Action",
          "Order",
          "Branch",
          "Unit",
          "Customer",
          "Price",
          "Date",
          "File",
          "Type",
          "Usage",
          "Updated"
        ]
      ],
      "fields": [],
      "buttons": [
        "Edit Product",
        "More ▼"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/catalogue/pricing",
    "name": "catalogue-pricing",
    "component": "src/views/catalogue/Pricing.vue",
    "roles": [
      "SuperAdmin"
    ],
    "accessTier": "Super Admin Restricted",
    "branchScope": "Global / All Branches",
    "checkpointsCount": 8,
    "elementInventory": {
      "headers": [
        "Pricing",
        "Pricing Matrix",
        "Pricing History"
      ],
      "tabs": [
        "Clear Filters",
        "Reset filters"
      ],
      "kpis": [],
      "tables": [
        [
          "Product",
          "Category",
          "Selling Price",
          "Landed Cost Ref",
          "Markup",
          "Margin",
          "Minimum",
          "Branch Override",
          "Effective",
          "Actions",
          "Date",
          "Old Price",
          "New Price",
          "Changed By",
          "Reason"
        ]
      ],
      "fields": [
        "Search product..."
      ],
      "buttons": [
        "New Price Rule",
        "Clear Filters",
        "Reset filters",
        "Close"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/catalogue/pricing/create",
    "name": "catalogue-create-price-rule",
    "component": "src/views/catalogue/CreatePriceRule.vue",
    "roles": [
      "SuperAdmin"
    ],
    "accessTier": "Super Admin Restricted",
    "branchScope": "Global / All Branches",
    "checkpointsCount": 15,
    "elementInventory": {
      "headers": [
        "Create Price Rule",
        "1. Target & Scope",
        "2. Pricing Configuration"
      ],
      "tabs": [],
      "kpis": [],
      "tables": [],
      "fields": [
        "e.g. 185,000",
        "e.g. 176,000",
        "e.g. Market update, Promo",
        "Target Product",
        "Branch Override",
        "Effective Date",
        "Selling Price (PKR)",
        "Minimum Allowed Floor (PKR)",
        "Reason for Change"
      ],
      "buttons": [
        "Cancel",
        "Save Draft",
        "Create Price Rule"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/catalogue/pricing/edit",
    "name": "catalogue-edit-price-rule-legacy",
    "component": "src/views/catalogue/EditPriceRule.vue",
    "roles": [
      "SuperAdmin"
    ],
    "accessTier": "Super Admin Restricted",
    "branchScope": "Global / All Branches",
    "checkpointsCount": 18,
    "elementInventory": {
      "headers": [
        "Edit Price Rule",
        "1. Target & Scope",
        "2. Pricing Configuration"
      ],
      "tabs": [],
      "kpis": [],
      "tables": [],
      "fields": [
        "priceRuleData.product",
        "priceRuleData.branchOverride",
        "e.g. Aug 10",
        "e.g. 185K",
        "e.g. 176K",
        "e.g. Market update, Promo",
        "Target Product",
        "Branch Override",
        "Effective Date",
        "Selling Price",
        "Minimum Allowed Floor",
        "Reason for Change"
      ],
      "buttons": [
        "Cancel",
        "Save Draft",
        "Save Changes"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/catalogue/pricing/edit/:id",
    "name": "catalogue-edit-price-rule",
    "component": "src/views/catalogue/EditPriceRule.vue",
    "roles": [
      "SuperAdmin"
    ],
    "accessTier": "Super Admin Restricted",
    "branchScope": "Global / All Branches",
    "checkpointsCount": 18,
    "elementInventory": {
      "headers": [
        "Edit Price Rule",
        "1. Target & Scope",
        "2. Pricing Configuration"
      ],
      "tabs": [],
      "kpis": [],
      "tables": [],
      "fields": [
        "priceRuleData.product",
        "priceRuleData.branchOverride",
        "e.g. Aug 10",
        "e.g. 185K",
        "e.g. 176K",
        "e.g. Market update, Promo",
        "Target Product",
        "Branch Override",
        "Effective Date",
        "Selling Price",
        "Minimum Allowed Floor",
        "Reason for Change"
      ],
      "buttons": [
        "Cancel",
        "Save Draft",
        "Save Changes"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/catalogue/requests",
    "name": "catalogue-requests",
    "component": "src/views/catalogue/ProductRequests.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 18,
    "elementInventory": {
      "headers": [
        "Product Requests",
        "Requests"
      ],
      "tabs": [
        "Clear",
        "Reset filters"
      ],
      "kpis": [
        "Status:",
        "Product Requests Showing requests",
        "Actions No product requests match your filters.",
        "Requests Showing requests"
      ],
      "tables": [
        [
          "Request",
          "Requested Product",
          "Reason",
          "Submitted",
          "Status",
          "Actions",
          "Request",
          "Branch",
          "Requested Product",
          "Reason",
          "Submitted",
          "Status",
          "Action"
        ]
      ],
      "fields": [
        "Search request or product...",
        "Search request..."
      ],
      "buttons": [
        "New Product Request",
        "Status:",
        "Clear",
        "&rarr;",
        "Reset filters"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/catalogue/requests/create",
    "name": "catalogue-create-request",
    "component": "src/views/catalogue/CreateProductRequest.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 13,
    "elementInventory": {
      "headers": [
        "Requested Product",
        "Demand & Evidence"
      ],
      "tabs": [],
      "kpis": [
        "Requested Product Proposed Product / Model * Product model name is required",
        "No matching categories. Type to enter a custom category.",
        "Demand & Evidence Customer Demand"
      ],
      "tables": [],
      "fields": [
        "e.g. BRG Urban Mini",
        "e.g. Electric Scooter",
        "e.g. Compact urban electric model",
        "e.g. Optional reference code",
        "e.g. 4 recent inquiries",
        "form.urgency",
        "e.g. 2 references attached",
        "Explain why this model should be added to the catalogue...",
        "Proposed Product / Model *",
        "Category *",
        "Specifications",
        "Supplier / Product Reference",
        "Customer Demand",
        "Urgency",
        "Images / Evidence Attachment",
        "Reason for Request *"
      ],
      "buttons": [
        "Use custom: \"\" Custom",
        "Cancel"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/catalogue/create-request",
    "name": "catalogue-create-request-alias",
    "component": "src/views/catalogue/CreateProductRequest.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 13,
    "elementInventory": {
      "headers": [
        "Requested Product",
        "Demand & Evidence"
      ],
      "tabs": [],
      "kpis": [
        "Requested Product Proposed Product / Model * Product model name is required",
        "No matching categories. Type to enter a custom category.",
        "Demand & Evidence Customer Demand"
      ],
      "tables": [],
      "fields": [
        "e.g. BRG Urban Mini",
        "e.g. Electric Scooter",
        "e.g. Compact urban electric model",
        "e.g. Optional reference code",
        "e.g. 4 recent inquiries",
        "form.urgency",
        "e.g. 2 references attached",
        "Explain why this model should be added to the catalogue...",
        "Proposed Product / Model *",
        "Category *",
        "Specifications",
        "Supplier / Product Reference",
        "Customer Demand",
        "Urgency",
        "Images / Evidence Attachment",
        "Reason for Request *"
      ],
      "buttons": [
        "Use custom: \"\" Custom",
        "Cancel"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/catalogue/requests/detail",
    "name": "catalogue-request-detail-legacy",
    "component": "src/views/catalogue/ProductRequestDetail.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 35,
    "elementInventory": {
      "headers": [
        "Product Request PR-028",
        "Branch context",
        "Product Request Detail",
        "PR-0181 - BRG DS12",
        "Request",
        "Duplicate Check"
      ],
      "tabs": [],
      "kpis": [
        "PR-0181 - BRG DS12 Peshawar Branch - Submitted by Ahsan Khan"
      ],
      "tables": [],
      "fields": [],
      "buttons": [
        "Review Request",
        "More ▼",
        "Reject",
        "Request Information",
        "Approve & Convert to Product"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/catalogue/requests/:id",
    "name": "catalogue-request-detail",
    "component": "src/views/catalogue/ProductRequestDetail.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 35,
    "elementInventory": {
      "headers": [
        "Product Request PR-028",
        "Branch context",
        "Product Request Detail",
        "PR-0181 - BRG DS12",
        "Request",
        "Duplicate Check"
      ],
      "tabs": [],
      "kpis": [
        "PR-0181 - BRG DS12 Peshawar Branch - Submitted by Ahsan Khan"
      ],
      "tables": [],
      "fields": [],
      "buttons": [
        "Review Request",
        "More ▼",
        "Reject",
        "Request Information",
        "Approve & Convert to Product"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/procurement/suppliers",
    "name": "procurement-suppliers",
    "component": "src/views/procurement/Suppliers.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 11,
    "elementInventory": {
      "headers": [
        "Suppliers"
      ],
      "tabs": [
        "Clear Filters",
        "Reset filters"
      ],
      "kpis": [
        "Clear Filters",
        "Actions"
      ],
      "tables": [
        [
          "Supplier",
          "Contact",
          "Products",
          "Open POs",
          "Purchases YTD",
          "Payable",
          "On-Time",
          "Status",
          "Actions"
        ]
      ],
      "fields": [
        "Search supplier, contact..."
      ],
      "buttons": [
        "Add Supplier",
        "Clear Filters",
        "Reset filters"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/procurement/suppliers/create",
    "name": "procurement-create-supplier",
    "component": "src/views/procurement/CreateSupplier.vue",
    "roles": [
      "SuperAdmin"
    ],
    "accessTier": "Super Admin Restricted",
    "branchScope": "Global / All Branches",
    "checkpointsCount": 18,
    "elementInventory": {
      "headers": [
        "Add Supplier",
        "1. Supplier Identity",
        "2. Commercial & Operational"
      ],
      "tabs": [],
      "kpis": [],
      "tables": [],
      "fields": [
        "e.g. BRG Factory",
        "e.g. Li Wei",
        "Contract details, performance notes, etc.",
        "Company Name",
        "Primary Contact",
        "Phone Number",
        "Email Address",
        "Business Address",
        "Currency",
        "Payment Terms",
        "Tax ID / NTN",
        "Internal Notes"
      ],
      "buttons": [
        "Cancel",
        "Save Draft",
        "Create Supplier"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/procurement/suppliers/edit",
    "name": "procurement-edit-supplier-legacy",
    "component": "src/views/procurement/EditSupplier.vue",
    "roles": [
      "SuperAdmin"
    ],
    "accessTier": "Super Admin Restricted",
    "branchScope": "Global / All Branches",
    "checkpointsCount": 23,
    "elementInventory": {
      "headers": [
        "Edit Supplier",
        "1. Supplier Identity",
        "2. Commercial & Operational"
      ],
      "tabs": [],
      "kpis": [],
      "tables": [],
      "fields": [
        "supplierData.name",
        "supplierData.contact",
        "supplierData.phone",
        "supplierData.email",
        "supplierData.address",
        "supplierData.currency",
        "supplierData.terms",
        "supplierData.taxId",
        "supplierData.notes",
        "Company Name",
        "Primary Contact",
        "Phone Number",
        "Email Address",
        "Business Address",
        "Currency",
        "Payment Terms",
        "Tax ID / NTN",
        "Internal Notes"
      ],
      "buttons": [
        "Cancel",
        "Save Changes"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/procurement/suppliers/edit/:id",
    "name": "procurement-edit-supplier",
    "component": "src/views/procurement/EditSupplier.vue",
    "roles": [
      "SuperAdmin"
    ],
    "accessTier": "Super Admin Restricted",
    "branchScope": "Global / All Branches",
    "checkpointsCount": 23,
    "elementInventory": {
      "headers": [
        "Edit Supplier",
        "1. Supplier Identity",
        "2. Commercial & Operational"
      ],
      "tabs": [],
      "kpis": [],
      "tables": [],
      "fields": [
        "supplierData.name",
        "supplierData.contact",
        "supplierData.phone",
        "supplierData.email",
        "supplierData.address",
        "supplierData.currency",
        "supplierData.terms",
        "supplierData.taxId",
        "supplierData.notes",
        "Company Name",
        "Primary Contact",
        "Phone Number",
        "Email Address",
        "Business Address",
        "Currency",
        "Payment Terms",
        "Tax ID / NTN",
        "Internal Notes"
      ],
      "buttons": [
        "Cancel",
        "Save Changes"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/procurement/suppliers/detail",
    "name": "procurement-supplier-detail-legacy",
    "component": "src/views/procurement/SupplierDetail.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 22,
    "elementInventory": {
      "headers": [
        "Supplier Detail —",
        "BRG Factory",
        "Supplier Summary",
        "Contacts",
        "Supplied Products",
        "Purchase Orders",
        "Receipts",
        "Bills & Payments",
        "Purchase Returns",
        "Delivery Performance",
        "Supplier Documents",
        "Supplier Activity"
      ],
      "tabs": [],
      "kpis": [
        "BRG Factory SUP-BRG-001 &middot; Shenzhen, China",
        "Purchases YTD",
        "Supplier Summary Primary Contact Li Wei",
        "ETA Action Open &rarr;"
      ],
      "tables": [
        [
          "Name",
          "Role",
          "Email",
          "Phone",
          "Primary",
          "Product",
          "SKU",
          "Last Cost",
          "Lead Time",
          "MOQ",
          "Active",
          "PO",
          "Destination",
          "Amount",
          "Status",
          "ETA",
          "Action",
          "Receipt",
          "PO",
          "Location",
          "Units",
          "Discrepancy",
          "Date",
          "Action",
          "Bill",
          "PO",
          "Amount",
          "Due",
          "Paid",
          "Outstanding",
          "Match",
          "Return",
          "PO",
          "Units",
          "Reason",
          "Credit",
          "Status",
          "Document",
          "Type",
          "Uploaded",
          "Expiry",
          "Action"
        ]
      ],
      "fields": [],
      "buttons": [
        "Edit Supplier",
        "More ▼"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/procurement/suppliers/:id",
    "name": "procurement-supplier-detail",
    "component": "src/views/procurement/SupplierDetail.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 22,
    "elementInventory": {
      "headers": [
        "Supplier Detail —",
        "BRG Factory",
        "Supplier Summary",
        "Contacts",
        "Supplied Products",
        "Purchase Orders",
        "Receipts",
        "Bills & Payments",
        "Purchase Returns",
        "Delivery Performance",
        "Supplier Documents",
        "Supplier Activity"
      ],
      "tabs": [],
      "kpis": [
        "BRG Factory SUP-BRG-001 &middot; Shenzhen, China",
        "Purchases YTD",
        "Supplier Summary Primary Contact Li Wei",
        "ETA Action Open &rarr;"
      ],
      "tables": [
        [
          "Name",
          "Role",
          "Email",
          "Phone",
          "Primary",
          "Product",
          "SKU",
          "Last Cost",
          "Lead Time",
          "MOQ",
          "Active",
          "PO",
          "Destination",
          "Amount",
          "Status",
          "ETA",
          "Action",
          "Receipt",
          "PO",
          "Location",
          "Units",
          "Discrepancy",
          "Date",
          "Action",
          "Bill",
          "PO",
          "Amount",
          "Due",
          "Paid",
          "Outstanding",
          "Match",
          "Return",
          "PO",
          "Units",
          "Reason",
          "Credit",
          "Status",
          "Document",
          "Type",
          "Uploaded",
          "Expiry",
          "Action"
        ]
      ],
      "fields": [],
      "buttons": [
        "Edit Supplier",
        "More ▼"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/procurement/purchase-orders",
    "name": "procurement-purchase-orders",
    "component": "src/views/procurement/PurchaseOrders.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 7,
    "elementInventory": {
      "headers": [
        "Purchase Orders"
      ],
      "tabs": [
        "Clear",
        "Reset filters"
      ],
      "kpis": [],
      "tables": [
        [
          "PO",
          "Supplier",
          "Destination",
          "Amount",
          "Units",
          "Expected",
          "Status",
          "Match",
          "Actions"
        ]
      ],
      "fields": [
        "Search PO..."
      ],
      "buttons": [
        "Create Purchase Order",
        "Clear",
        "Reset filters"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/procurement/purchase-orders/create",
    "name": "procurement-create-purchase-order",
    "component": "src/views/procurement/CreatePurchaseOrder.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 17,
    "elementInventory": {
      "headers": [
        "Create Purchase Order",
        "1. Supplier & Destination",
        "2. Products",
        "3. Costs & Shipment",
        "4. Terms & Review"
      ],
      "tabs": [],
      "kpis": [],
      "tables": [],
      "fields": [
        "form.supplier",
        "form.destination",
        "form.expectedArrival",
        "po-qty-ds11",
        "po-qty-ev5",
        "po-qty-cargo",
        "form.expectedCost",
        "form.estimatedFreight",
        "form.shipmentMethod",
        "form.paymentTerms",
        "form.documents",
        "form.notes",
        "Supplier",
        "Destination",
        "Expected Arrival",
        "BRG DS11 - Qty",
        "BRG EV-5 - Qty",
        "Cargo Pro - Qty",
        "Expected Product Cost",
        "Estimated Freight",
        "Shipment Method",
        "Payment Terms",
        "Documents",
        "Notes"
      ],
      "buttons": [
        "Cancel",
        "Save Draft",
        "Submit for Approval"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/procurement/create-po",
    "name": "procurement-create-po-alias",
    "component": "src/views/procurement/CreatePurchaseOrder.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 17,
    "elementInventory": {
      "headers": [
        "Create Purchase Order",
        "1. Supplier & Destination",
        "2. Products",
        "3. Costs & Shipment",
        "4. Terms & Review"
      ],
      "tabs": [],
      "kpis": [],
      "tables": [],
      "fields": [
        "form.supplier",
        "form.destination",
        "form.expectedArrival",
        "po-qty-ds11",
        "po-qty-ev5",
        "po-qty-cargo",
        "form.expectedCost",
        "form.estimatedFreight",
        "form.shipmentMethod",
        "form.paymentTerms",
        "form.documents",
        "form.notes",
        "Supplier",
        "Destination",
        "Expected Arrival",
        "BRG DS11 - Qty",
        "BRG EV-5 - Qty",
        "Cargo Pro - Qty",
        "Expected Product Cost",
        "Estimated Freight",
        "Shipment Method",
        "Payment Terms",
        "Documents",
        "Notes"
      ],
      "buttons": [
        "Cancel",
        "Save Draft",
        "Submit for Approval"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/procurement/purchase-orders/detail",
    "name": "procurement-purchase-order-detail-legacy",
    "component": "src/views/procurement/PurchaseOrderDetail.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 21,
    "elementInventory": {
      "headers": [
        "Purchase Order",
        "Cancel Purchase Order",
        "Summary"
      ],
      "tabs": [],
      "kpis": [
        "PO Value",
        "Summary Supplier",
        "() &bull;"
      ],
      "tables": [],
      "fields": [],
      "buttons": [
        "Back to Orders",
        "More ▼",
        "Receive goods",
        "Duplicate PO",
        "Cancel PO",
        "Keep PO",
        "Confirm Cancel"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/procurement/purchase-orders/:id",
    "name": "procurement-purchase-order-detail",
    "component": "src/views/procurement/PurchaseOrderDetail.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 21,
    "elementInventory": {
      "headers": [
        "Purchase Order",
        "Cancel Purchase Order",
        "Summary"
      ],
      "tabs": [],
      "kpis": [
        "PO Value",
        "Summary Supplier",
        "() &bull;"
      ],
      "tables": [],
      "fields": [],
      "buttons": [
        "Back to Orders",
        "More ▼",
        "Receive goods",
        "Duplicate PO",
        "Cancel PO",
        "Keep PO",
        "Confirm Cancel"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/procurement/purchase-orders/:id/receive",
    "name": "procurement-receive-purchase-order",
    "component": "src/views/procurement/ReceivePurchase.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 28,
    "elementInventory": {
      "headers": [
        "Goods Receipt & Inwarding",
        "Purchase Order Not Found",
        "Unauthorized Branch Access",
        "1. Inwarding Location",
        "2. Receiving Personnel",
        "3. Delivery Logistics",
        "Line Items &bull; Expected vs Actual",
        "Serialized Unit & QC Capture ( Units)",
        "Review Goods Receipt Summary",
        "Line Items to Post",
        "Serialized Units to be Created in Inventory ()",
        "Post Physical Receipt to Inventory"
      ],
      "tabs": [
        "Edit Quantities",
        "&larr; Make Changes",
        "&larr; Back to Quantity Entry"
      ],
      "kpis": [
        "&middot;",
        "&bull; Previously Received: units &bull; Remaining: units",
        "Quantities Match Expected Discrepancies Detected",
        "Receipt Inspection Notes",
        "Total Received",
        "Physical units received",
        "Entering active stock",
        "Isolated from stock"
      ],
      "tables": [
        [
          "Product / SKU",
          "Ordered",
          "Prev. Received",
          "Outstanding",
          "Current Received",
          "Damaged",
          "Accepted",
          "Short",
          "Excess",
          "Discrepancy Reason",
          "#",
          "Product",
          "Chassis / VIN",
          "Motor Serial",
          "Battery Serial",
          "Condition",
          "QC Decision",
          "Product",
          "Ordered",
          "Prev. Rec",
          "Current Rec",
          "Accepted",
          "Short",
          "Excess",
          "Damaged",
          "Discrepancy Notes"
        ]
      ],
      "fields": [
        "receivingForm.location",
        "receivingForm.receiver",
        "receivingForm.receiptDate",
        "DN-2048-01",
        "line-current-received-quantity",
        "line-damaged-quantity",
        "CH-XXXX-XXXX",
        "MTR-72V-XXXX",
        "BAT-7230-XXXX",
        "unit.condition",
        "unit.qc",
        "Add any specific observations or freight remarks...",
        "Receiving Branch & Bay",
        "Receiver Name",
        "Receipt Date",
        "Delivery Note / Tracking",
        "Receipt Inspection Notes"
      ],
      "buttons": [
        "Back to PO",
        "Save Draft",
        "Review GRN &rarr;",
        "Edit Quantities",
        "Re-scan / Generate IDs",
        "Cancel",
        "&larr; Make Changes",
        "&larr; Back to Quantity Entry",
        "Confirm & Post Receipt",
        "Post Receipt Now"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/procurement/receipts",
    "name": "procurement-receipts",
    "component": "src/views/procurement/ReceivePurchase.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 28,
    "elementInventory": {
      "headers": [
        "Goods Receipt & Inwarding",
        "Purchase Order Not Found",
        "Unauthorized Branch Access",
        "1. Inwarding Location",
        "2. Receiving Personnel",
        "3. Delivery Logistics",
        "Line Items &bull; Expected vs Actual",
        "Serialized Unit & QC Capture ( Units)",
        "Review Goods Receipt Summary",
        "Line Items to Post",
        "Serialized Units to be Created in Inventory ()",
        "Post Physical Receipt to Inventory"
      ],
      "tabs": [
        "Edit Quantities",
        "&larr; Make Changes",
        "&larr; Back to Quantity Entry"
      ],
      "kpis": [
        "&middot;",
        "&bull; Previously Received: units &bull; Remaining: units",
        "Quantities Match Expected Discrepancies Detected",
        "Receipt Inspection Notes",
        "Total Received",
        "Physical units received",
        "Entering active stock",
        "Isolated from stock"
      ],
      "tables": [
        [
          "Product / SKU",
          "Ordered",
          "Prev. Received",
          "Outstanding",
          "Current Received",
          "Damaged",
          "Accepted",
          "Short",
          "Excess",
          "Discrepancy Reason",
          "#",
          "Product",
          "Chassis / VIN",
          "Motor Serial",
          "Battery Serial",
          "Condition",
          "QC Decision",
          "Product",
          "Ordered",
          "Prev. Rec",
          "Current Rec",
          "Accepted",
          "Short",
          "Excess",
          "Damaged",
          "Discrepancy Notes"
        ]
      ],
      "fields": [
        "receivingForm.location",
        "receivingForm.receiver",
        "receivingForm.receiptDate",
        "DN-2048-01",
        "line-current-received-quantity",
        "line-damaged-quantity",
        "CH-XXXX-XXXX",
        "MTR-72V-XXXX",
        "BAT-7230-XXXX",
        "unit.condition",
        "unit.qc",
        "Add any specific observations or freight remarks...",
        "Receiving Branch & Bay",
        "Receiver Name",
        "Receipt Date",
        "Delivery Note / Tracking",
        "Receipt Inspection Notes"
      ],
      "buttons": [
        "Back to PO",
        "Save Draft",
        "Review GRN &rarr;",
        "Edit Quantities",
        "Re-scan / Generate IDs",
        "Cancel",
        "&larr; Make Changes",
        "&larr; Back to Quantity Entry",
        "Confirm & Post Receipt",
        "Post Receipt Now"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/procurement/receive-purchase",
    "name": "procurement-receive-purchase-alias",
    "component": "src/views/procurement/ReceivePurchase.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 28,
    "elementInventory": {
      "headers": [
        "Goods Receipt & Inwarding",
        "Purchase Order Not Found",
        "Unauthorized Branch Access",
        "1. Inwarding Location",
        "2. Receiving Personnel",
        "3. Delivery Logistics",
        "Line Items &bull; Expected vs Actual",
        "Serialized Unit & QC Capture ( Units)",
        "Review Goods Receipt Summary",
        "Line Items to Post",
        "Serialized Units to be Created in Inventory ()",
        "Post Physical Receipt to Inventory"
      ],
      "tabs": [
        "Edit Quantities",
        "&larr; Make Changes",
        "&larr; Back to Quantity Entry"
      ],
      "kpis": [
        "&middot;",
        "&bull; Previously Received: units &bull; Remaining: units",
        "Quantities Match Expected Discrepancies Detected",
        "Receipt Inspection Notes",
        "Total Received",
        "Physical units received",
        "Entering active stock",
        "Isolated from stock"
      ],
      "tables": [
        [
          "Product / SKU",
          "Ordered",
          "Prev. Received",
          "Outstanding",
          "Current Received",
          "Damaged",
          "Accepted",
          "Short",
          "Excess",
          "Discrepancy Reason",
          "#",
          "Product",
          "Chassis / VIN",
          "Motor Serial",
          "Battery Serial",
          "Condition",
          "QC Decision",
          "Product",
          "Ordered",
          "Prev. Rec",
          "Current Rec",
          "Accepted",
          "Short",
          "Excess",
          "Damaged",
          "Discrepancy Notes"
        ]
      ],
      "fields": [
        "receivingForm.location",
        "receivingForm.receiver",
        "receivingForm.receiptDate",
        "DN-2048-01",
        "line-current-received-quantity",
        "line-damaged-quantity",
        "CH-XXXX-XXXX",
        "MTR-72V-XXXX",
        "BAT-7230-XXXX",
        "unit.condition",
        "unit.qc",
        "Add any specific observations or freight remarks...",
        "Receiving Branch & Bay",
        "Receiver Name",
        "Receipt Date",
        "Delivery Note / Tracking",
        "Receipt Inspection Notes"
      ],
      "buttons": [
        "Back to PO",
        "Save Draft",
        "Review GRN &rarr;",
        "Edit Quantities",
        "Re-scan / Generate IDs",
        "Cancel",
        "&larr; Make Changes",
        "&larr; Back to Quantity Entry",
        "Confirm & Post Receipt",
        "Post Receipt Now"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/procurement/receipts/detail",
    "name": "procurement-receipt-detail-legacy",
    "component": "src/views/procurement/ReceiptDetail.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 15,
    "elementInventory": {
      "headers": [
        "Goods Receipt",
        "Receipt Metadata"
      ],
      "tabs": [],
      "kpis": [
        "Total Received",
        "Receipt Metadata Purchase Order"
      ],
      "tables": [],
      "fields": [],
      "buttons": [
        "Back to PO",
        "Open PO"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/procurement/receipts/:id",
    "name": "procurement-receipt-detail",
    "component": "src/views/procurement/ReceiptDetail.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 15,
    "elementInventory": {
      "headers": [
        "Goods Receipt",
        "Receipt Metadata"
      ],
      "tabs": [],
      "kpis": [
        "Total Received",
        "Receipt Metadata Purchase Order"
      ],
      "tables": [],
      "fields": [],
      "buttons": [
        "Back to PO",
        "Open PO"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/procurement/landed-costs",
    "name": "procurement-landed-costs",
    "component": "src/views/procurement/LandedCost.vue",
    "roles": [
      "SuperAdmin"
    ],
    "accessTier": "Super Admin Restricted",
    "branchScope": "Global / All Branches",
    "checkpointsCount": 10,
    "elementInventory": {
      "headers": [
        "Success",
        "Landed Cost",
        "Landed Cost &middot; GR-991",
        "Cost Components",
        "Allocation Rule",
        "Allocated Unit Cost"
      ],
      "tabs": [],
      "kpis": [
        "Landed Cost &middot; GR-991 PO-2048 &middot; 16 received units",
        "316K",
        "2.966M"
      ],
      "tables": [
        [
          "Component",
          "Amount",
          "Source",
          "Product",
          "Qty",
          "Base / Unit",
          "Allocated Add-on",
          "Final Landed / Unit"
        ]
      ],
      "fields": [
        "Method"
      ],
      "buttons": [
        "Save Draft",
        "Cancel",
        "Post Landed Cost"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/procurement/vendor-bills",
    "name": "procurement-vendor-bills",
    "component": "src/views/procurement/VendorBills.vue",
    "roles": [
      "SuperAdmin"
    ],
    "accessTier": "Super Admin Restricted",
    "branchScope": "Global / All Branches",
    "checkpointsCount": 4,
    "elementInventory": {
      "headers": [
        "Vendor Bills"
      ],
      "tabs": [
        "Clear Filters",
        "Reset filters"
      ],
      "kpis": [
        "Open Bills",
        "Clear Filters"
      ],
      "tables": [
        [
          "Bill",
          "Supplier",
          "PO",
          "Receipt",
          "Amount",
          "Due",
          "Paid",
          "Outstanding",
          "Match",
          "Actions"
        ]
      ],
      "fields": [
        "Search bill, supplier, PO..."
      ],
      "buttons": [
        "Clear Filters",
        "Reset filters"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/procurement/purchase-returns",
    "name": "procurement-purchase-returns",
    "component": "src/views/procurement/PurchaseReturns.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 10,
    "elementInventory": {
      "headers": [
        "Purchase Returns"
      ],
      "tabs": [
        "Clear",
        "Reset filters"
      ],
      "kpis": [],
      "tables": [
        [
          "Return",
          "Supplier",
          "PO",
          "Units",
          "Reason",
          "Credit",
          "Status",
          "Action"
        ]
      ],
      "fields": [
        "Search return, supplier, reason..."
      ],
      "buttons": [
        "Create Purchase Return",
        "Clear",
        "Reset filters"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/procurement/purchase-returns/create",
    "name": "procurement-create-purchase-return",
    "component": "src/views/procurement/CreatePurchaseReturn.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 14,
    "elementInventory": {
      "headers": [
        "Create Purchase Return",
        "Return Details",
        "Units to Return",
        "Summary"
      ],
      "tabs": [],
      "kpis": [
        "Summary Total Units 0",
        "Draft"
      ],
      "tables": [
        [
          "Product / Serial",
          "Credit Value"
        ]
      ],
      "fields": [
        "e.g. Transit damage, QC failure",
        "Select product or scan serial",
        "PKR",
        "Supplier",
        "Original PO / Receipt",
        "Reason for Return"
      ],
      "buttons": [
        "Save Draft",
        "+ Add Item",
        "&times;",
        "Cancel",
        "Submit Return"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/procurement/purchase-returns/detail",
    "name": "procurement-purchase-return-detail-legacy",
    "component": "src/views/procurement/PurchaseReturnDetail.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 14,
    "elementInventory": {
      "headers": [
        "Purchase Return Detail —",
        "PRTN-044",
        "Summary"
      ],
      "tabs": [],
      "kpis": [
        "PRTN-044 BRG Factory &middot; PO-2022",
        "Units",
        "Summary Reason QC failure"
      ],
      "tables": [],
      "fields": [],
      "buttons": [
        "Update Return",
        "More ▼"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/procurement/purchase-returns/:id",
    "name": "procurement-purchase-return-detail",
    "component": "src/views/procurement/PurchaseReturnDetail.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 14,
    "elementInventory": {
      "headers": [
        "Purchase Return Detail —",
        "PRTN-044",
        "Summary"
      ],
      "tabs": [],
      "kpis": [
        "PRTN-044 BRG Factory &middot; PO-2022",
        "Units",
        "Summary Reason QC failure"
      ],
      "tables": [],
      "fields": [],
      "buttons": [
        "Update Return",
        "More ▼"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/inventory/dashboard",
    "name": "inventory-dashboard",
    "component": "src/views/inventory/InventoryDashboard.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 23,
    "elementInventory": {
      "headers": [
        "Branch Inventory Dashboard",
        "Inventory Status",
        "Branch Inventory Value",
        "Inventory Dashboard",
        "Stock by Branch",
        "Stock Health",
        "Aged & Low Stock"
      ],
      "tabs": [],
      "kpis": [
        "Inventory Status",
        "Branch Inventory Value Visibility Shown only if authorised",
        "Total Units",
        "Transfer In Transit"
      ],
      "tables": [
        [
          "Product",
          "Branch",
          "Available",
          "Reorder",
          "Age",
          "Alert",
          "Action"
        ]
      ],
      "fields": [],
      "buttons": []
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/inventory/stock-by-product",
    "name": "inventory-stock-by-product",
    "component": "src/views/inventory/StockByProduct.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 18,
    "elementInventory": {
      "headers": [
        "Stock by Product",
        "Stock by Product ()"
      ],
      "tabs": [
        "Clear",
        "Clear all filters",
        "Reset Filters",
        "Reset filters"
      ],
      "kpis": [
        "Status:",
        "Stock:",
        "Stock by Product Showing products"
      ],
      "tables": [
        [
          "Product",
          "SKU",
          "Category",
          "Available",
          "Reserved",
          "Incoming",
          "Reorder Level",
          "Product",
          "SKU",
          "Category",
          "Total",
          "Available",
          "Reserved",
          "Peshawar",
          "Islamabad",
          "Incoming",
          "Reorder",
          "Value"
        ]
      ],
      "fields": [
        "Search product, SKU...",
        "Search product / SKU..."
      ],
      "buttons": [
        "Status:",
        "Category:",
        "Stock:",
        "Clear",
        "Columns",
        "Export",
        "Request Stock",
        "Clear all filters",
        "Stock Health:",
        "Reset Filters",
        "Reset filters"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/inventory/serialized-units",
    "name": "inventory-serialized-units",
    "component": "src/views/inventory/SerializedUnits.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 19,
    "elementInventory": {
      "headers": [
        "Serialized Units",
        "Serialized Unit Register"
      ],
      "tabs": [
        "Clear",
        "Clear all filters",
        "Clear Filters",
        "Reset filters"
      ],
      "kpis": [
        "Status:",
        "Serialized Unit Register Showing units",
        "Clear Filters"
      ],
      "tables": [
        [
          "Serial / Chassis",
          "Product",
          "Location",
          "Status",
          "Order / Customer",
          "Source",
          "Actions",
          "Serial",
          "Chassis",
          "Product",
          "Branch",
          "Location",
          "Source PO",
          "Landed Cost",
          "Status",
          "Customer",
          "Order"
        ]
      ],
      "fields": [
        "Search serial, chassis, product...",
        "Serial, chassis, product, customer, order..."
      ],
      "buttons": [
        "Status:",
        "Product:",
        "Location:",
        "Clear",
        "Columns",
        "Export",
        "Open &rsaquo;",
        "Clear all filters",
        "Clear Filters",
        "Reset filters"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/inventory/serialized-units/detail",
    "name": "inventory-unit-detail-legacy",
    "component": "src/views/inventory/UnitDetail.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 38,
    "elementInventory": {
      "headers": [
        "Serialized Unit Not Found",
        "Unit",
        "Branch Context",
        "Unit Detail —",
        "Unit Summary"
      ],
      "tabs": [],
      "kpis": [
        "Move to",
        "&middot; Chassis &middot;",
        "Serial"
      ],
      "tables": [],
      "fields": [],
      "buttons": [
        "&larr; Back to Serialized Units",
        "Back",
        "Move to"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/inventory/serialized-units/:id",
    "name": "inventory-unit-detail",
    "component": "src/views/inventory/UnitDetail.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 38,
    "elementInventory": {
      "headers": [
        "Serialized Unit Not Found",
        "Unit",
        "Branch Context",
        "Unit Detail —",
        "Unit Summary"
      ],
      "tabs": [],
      "kpis": [
        "Move to",
        "&middot; Chassis &middot;",
        "Serial"
      ],
      "tables": [],
      "fields": [],
      "buttons": [
        "&larr; Back to Serialized Units",
        "Back",
        "Move to"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/inventory/units/:id",
    "name": "inventory-unit-detail-alias",
    "component": "src/views/inventory/UnitDetail.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 38,
    "elementInventory": {
      "headers": [
        "Serialized Unit Not Found",
        "Unit",
        "Branch Context",
        "Unit Detail —",
        "Unit Summary"
      ],
      "tabs": [],
      "kpis": [
        "Move to",
        "&middot; Chassis &middot;",
        "Serial"
      ],
      "tables": [],
      "fields": [],
      "buttons": [
        "&larr; Back to Serialized Units",
        "Back",
        "Move to"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/inventory/purchase-orders",
    "name": "/inventory/purchase-orders",
    "component": "Unknown",
    "roles": [
      "Super Admin"
    ],
    "accessTier": "Super Admin Restricted",
    "branchScope": "Global / All Branches",
    "checkpointsCount": 0,
    "elementInventory": {
      "headers": [],
      "tabs": [],
      "kpis": [],
      "tables": [],
      "fields": [],
      "buttons": []
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/inventory/transfers",
    "name": "inventory-transfers",
    "component": "src/views/inventory/Transfers.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 18,
    "elementInventory": {
      "headers": [
        "Transfers",
        "Branch Transfers"
      ],
      "tabs": [],
      "kpis": [
        "Status:",
        "Branch Transfers Showing transfers",
        "Actions Open &rsaquo;"
      ],
      "tables": [
        [
          "Transfer",
          "Direction",
          "From / To",
          "Units",
          "Dispatched",
          "Expected",
          "Status",
          "Actions",
          "Category",
          "Product Name",
          "Quantity"
        ]
      ],
      "fields": [
        "Search transfer ID..."
      ],
      "buttons": [
        "Create Transfer",
        "Status:",
        "Open &rsaquo;"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/inventory/transfers/create",
    "name": "inventory-create-transfer",
    "component": "src/views/inventory/CreateTransfer.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 14,
    "elementInventory": {
      "headers": [
        "Transfer Route & Stock",
        "Dispatch & Carrier Logistics"
      ],
      "tabs": [],
      "kpis": [
        "\"Receive Transfer\" to finalize custody."
      ],
      "tables": [],
      "fields": [
        "transfer-origin",
        "transfer-destination",
        "transfer-product",
        "e.g. 2",
        "e.g. Today",
        "e.g. AJ Logistics Truck #4 (LES-4921) / TCS",
        "e.g. Tariq Mehmood (0301-5558192)",
        "e.g. GP-TR-8812",
        "e.g. Tomorrow 14:00",
        "Secure battery tie-down ropes, avoid rain exposure...",
        "From Branch (Origin) *",
        "To Branch (Destination) *",
        "Product to Move *",
        "Units to Move *",
        "Requested / Dispatch Date",
        "Carrier / Truck Vehicle No.",
        "Driver Name & Mobile No.",
        "Outbound Gate Pass Reference",
        "Expected Arrival Date/Time",
        "Handling & Priority Notes"
      ],
      "buttons": [
        "Cancel"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/inventory/transfers/receive",
    "name": "inventory-receive-transfer",
    "component": "src/views/inventory/ReceiveTransfer.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 13,
    "elementInventory": {
      "headers": [
        "Receive Transfer",
        "Transfer Record Not Found",
        "Transfer Already Fully Received",
        "Consignment Verification Checklist",
        "Intake Details",
        "Condition Notes &amp; Discrepancy Remarks"
      ],
      "tabs": [],
      "kpis": [
        "Origin Branch Branch"
      ],
      "tables": [
        [
          "Product",
          "Type",
          "Dispatched",
          "Prev. Received",
          "Remaining",
          "Received Now *",
          "Damaged Qty",
          "Shortage"
        ]
      ],
      "fields": [
        "receive-qty-input",
        "receive-damaged-input",
        "receiverName",
        "receiverLocation",
        "Record any exterior box defects, seal integrity, packaging discrepancies...",
        "Receiving Officer",
        "Storage Bay / Local Location",
        "Receiver Observations"
      ],
      "buttons": [
        "Back",
        "View All Transfers",
        "View Complete Transfer Details &rsaquo;",
        "Confirm Arrival &amp; Post"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/inventory/transfers/receive/:id",
    "name": "inventory-receive-transfer-id",
    "component": "src/views/inventory/ReceiveTransfer.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 13,
    "elementInventory": {
      "headers": [
        "Receive Transfer",
        "Transfer Record Not Found",
        "Transfer Already Fully Received",
        "Consignment Verification Checklist",
        "Intake Details",
        "Condition Notes &amp; Discrepancy Remarks"
      ],
      "tabs": [],
      "kpis": [
        "Origin Branch Branch"
      ],
      "tables": [
        [
          "Product",
          "Type",
          "Dispatched",
          "Prev. Received",
          "Remaining",
          "Received Now *",
          "Damaged Qty",
          "Shortage"
        ]
      ],
      "fields": [
        "receive-qty-input",
        "receive-damaged-input",
        "receiverName",
        "receiverLocation",
        "Record any exterior box defects, seal integrity, packaging discrepancies...",
        "Receiving Officer",
        "Storage Bay / Local Location",
        "Receiver Observations"
      ],
      "buttons": [
        "Back",
        "View All Transfers",
        "View Complete Transfer Details &rsaquo;",
        "Confirm Arrival &amp; Post"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/inventory/transfers/:id/receive",
    "name": "inventory-receive-transfer-param",
    "component": "src/views/inventory/ReceiveTransfer.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 13,
    "elementInventory": {
      "headers": [
        "Receive Transfer",
        "Transfer Record Not Found",
        "Transfer Already Fully Received",
        "Consignment Verification Checklist",
        "Intake Details",
        "Condition Notes &amp; Discrepancy Remarks"
      ],
      "tabs": [],
      "kpis": [
        "Origin Branch Branch"
      ],
      "tables": [
        [
          "Product",
          "Type",
          "Dispatched",
          "Prev. Received",
          "Remaining",
          "Received Now *",
          "Damaged Qty",
          "Shortage"
        ]
      ],
      "fields": [
        "receive-qty-input",
        "receive-damaged-input",
        "receiverName",
        "receiverLocation",
        "Record any exterior box defects, seal integrity, packaging discrepancies...",
        "Receiving Officer",
        "Storage Bay / Local Location",
        "Receiver Observations"
      ],
      "buttons": [
        "Back",
        "View All Transfers",
        "View Complete Transfer Details &rsaquo;",
        "Confirm Arrival &amp; Post"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/inventory/transfers/detail",
    "name": "inventory-transfer-detail-legacy",
    "component": "src/views/inventory/TransferDetail.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 33,
    "elementInventory": {
      "headers": [
        "Transfer",
        "Transfer Not Found",
        "Consigned Item Details",
        "Branch Scope &amp; Context"
      ],
      "tabs": [],
      "kpis": [],
      "tables": [
        [
          "Product",
          "SKU",
          "Dispatched",
          "Received",
          "Serial Numbers"
        ]
      ],
      "fields": [],
      "buttons": [
        "Back",
        "Dispatch Transfer",
        "Receive Consignment",
        "Return to Transfers"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/inventory/transfers/:id",
    "name": "inventory-transfer-detail",
    "component": "src/views/inventory/TransferDetail.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 33,
    "elementInventory": {
      "headers": [
        "Transfer",
        "Transfer Not Found",
        "Consigned Item Details",
        "Branch Scope &amp; Context"
      ],
      "tabs": [],
      "kpis": [],
      "tables": [
        [
          "Product",
          "SKU",
          "Dispatched",
          "Received",
          "Serial Numbers"
        ]
      ],
      "fields": [],
      "buttons": [
        "Back",
        "Dispatch Transfer",
        "Receive Consignment",
        "Return to Transfers"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/inventory/inbound-deliveries",
    "name": "inventory-inbound-deliveries",
    "component": "src/views/inventory/InboundDeliveries.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 20,
    "elementInventory": {
      "headers": [
        "Inbound Deliveries"
      ],
      "tabs": [
        "Clear"
      ],
      "kpis": [
        "Status:",
        "Inbound Deliveries Showing deliveries",
        "Status Open &rsaquo; Delivery Contents products"
      ],
      "tables": [
        [
          "Inbound",
          "PO Reference",
          "Supplier",
          "Expected",
          "Products",
          "Status",
          "Category",
          "Product Name",
          "Quantity"
        ]
      ],
      "fields": [
        "Search inbound, PO, supplier..."
      ],
      "buttons": [
        "Status:",
        "Supplier:",
        "Clear",
        "Columns",
        "Export",
        "Open &rsaquo;"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/inventory/inbound-deliveries/detail",
    "name": "inventory-inbound-delivery-detail-legacy",
    "component": "src/views/inventory/InboundDeliveryDetail.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 31,
    "elementInventory": {
      "headers": [
        "Inbound Delivery",
        "Branch context"
      ],
      "tabs": [],
      "kpis": [],
      "tables": [],
      "fields": [],
      "buttons": [
        "Receive Delivery"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/inventory/inbound-deliveries/:id",
    "name": "inventory-inbound-delivery-detail",
    "component": "src/views/inventory/InboundDeliveryDetail.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 31,
    "elementInventory": {
      "headers": [
        "Inbound Delivery",
        "Branch context"
      ],
      "tabs": [],
      "kpis": [],
      "tables": [],
      "fields": [],
      "buttons": [
        "Receive Delivery"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/inventory/inbound-deliveries/receive",
    "name": "inventory-receive-supplier-delivery",
    "component": "src/views/inventory/ReceiveSupplierDelivery.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 12,
    "elementInventory": {
      "headers": [
        "Receive Supplier Delivery",
        "Approved Inbound",
        "Inspection"
      ],
      "tabs": [],
      "kpis": [
        "Approved Inbound Inbound",
        "Inspection Serialized Units"
      ],
      "tables": [],
      "fields": [
        "form.inbound",
        "form.poReference",
        "form.expectedProducts",
        "form.receivingLocation",
        "form.serializedUnits",
        "form.condition",
        "form.photos",
        "form.discrepancy",
        "Inbound",
        "PO Reference",
        "Expected Products",
        "Receiving Location",
        "Serialized Units",
        "Condition",
        "Photos",
        "Discrepancy"
      ],
      "buttons": [
        "Post Receipt"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/inventory/stock-requests",
    "name": "inventory-stock-requests",
    "component": "src/views/inventory/StockRequests.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 18,
    "elementInventory": {
      "headers": [
        "Stock Requests"
      ],
      "tabs": [
        "Clear",
        "Reset filters"
      ],
      "kpis": [
        "Status:",
        "Stock Requests Showing requests",
        "Actions No stock requests match your filters."
      ],
      "tables": [
        [
          "Request",
          "Product",
          "Qty",
          "Expected",
          "Status",
          "Actions",
          "Request",
          "Branch",
          "Products",
          "Units",
          "Need By",
          "Priority",
          "Status",
          "Action"
        ]
      ],
      "fields": [
        "Search request or product...",
        "Search request..."
      ],
      "buttons": [
        "New Stock Request",
        "Status:",
        "Clear",
        "&rarr;",
        "Reset filters"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/inventory/stock-requests/create",
    "name": "inventory-create-stock-request",
    "component": "src/views/inventory/CreateStockRequest.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 11,
    "elementInventory": {
      "headers": [
        "Stock Requirement",
        "Demand & Justification"
      ],
      "tabs": [],
      "kpis": [
        "Stock Requirement Select Vehicle / Item * () — network total",
        "Demand & Justification Expected Demand / Pipeline"
      ],
      "tables": [],
      "fields": [
        "form.productId",
        "e.g. 6 available / 1 reserved",
        "e.g. 4",
        "form.urgency",
        "e.g. 2 active quotations + corporate fleet visit",
        "e.g. SO-9723 / QT-402",
        "Explain why stock replenishment is necessary now...",
        "Specific delivery gate or unloading instructions...",
        "Select Vehicle / Item *",
        "Current Branch Stock State",
        "Requested Units Qty *",
        "Urgency Level",
        "Expected Demand / Pipeline",
        "Customer / Order Link (Optional)",
        "Reason for Request *",
        "Logistics & Handling Notes"
      ],
      "buttons": [
        "Cancel"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/inventory/stock-requests/detail",
    "name": "inventory-stock-request-detail-legacy",
    "component": "src/views/inventory/StockRequestDetail.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 23,
    "elementInventory": {
      "headers": [
        "Stock Request"
      ],
      "tabs": [],
      "kpis": [],
      "tables": [],
      "fields": [],
      "buttons": [
        "Back",
        "Reject",
        "Approve Request"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/inventory/stock-requests/:id",
    "name": "inventory-stock-request-detail",
    "component": "src/views/inventory/StockRequestDetail.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 23,
    "elementInventory": {
      "headers": [
        "Stock Request"
      ],
      "tabs": [],
      "kpis": [],
      "tables": [],
      "fields": [],
      "buttons": [
        "Back",
        "Reject",
        "Approve Request"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/inventory/stock-adjustments",
    "name": "inventory-stock-adjustments",
    "component": "src/views/inventory/StockAdjustments.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 15,
    "elementInventory": {
      "headers": [
        "Stock Adjustments",
        "Adjustments"
      ],
      "tabs": [
        "Clear"
      ],
      "kpis": [
        "Status:",
        "Adjustments Showing adjustments",
        "Actions No adjustments found matching filters.",
        "Requested By Action &rarr; No adjustments found matching filters."
      ],
      "tables": [
        [
          "Adjustment",
          "Product / Unit",
          "Before",
          "After",
          "Reason",
          "Status",
          "Actions",
          "Adjustment",
          "Branch",
          "Unit/Product",
          "Type",
          "Qty Effect",
          "Reason",
          "Status",
          "Requested By",
          "Action"
        ]
      ],
      "fields": [
        "Search adjustment...",
        "Search adjustments..."
      ],
      "buttons": [
        "Adjustment Request",
        "Status:",
        "New Adjustment",
        "Clear",
        "&rarr;"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/inventory/stock-adjustments/create",
    "name": "inventory-create-adjustment-request",
    "component": "src/views/inventory/CreateAdjustmentRequest.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 11,
    "elementInventory": {
      "headers": [
        "Adjustment Details",
        "Evidence & Verification"
      ],
      "tabs": [],
      "kpis": [
        "Adjustment Details Product / Unit * Product / Unit is required",
        "Evidence & Verification Evidence Attachment",
        "Cancel"
      ],
      "tables": [],
      "fields": [
        "e.g. BRG X5 or CHS-01882",
        "e.g. 6 available",
        "e.g. 5 available",
        "e.g. Physical count variance, damaged in showroom...",
        "e.g. Count_Sheet_Aug28.pdf",
        "Additional observations or stock keeper remarks...",
        "form.requestedBy",
        "form.approval",
        "Product / Unit *",
        "Existing System State",
        "Corrected / Physical State",
        "Reason for Adjustment *",
        "Evidence Attachment",
        "Notes",
        "Requested By",
        "Approval Hierarchy"
      ],
      "buttons": [
        "Cancel"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/inventory/stock-adjustments/detail",
    "name": "inventory-adjustment-detail-legacy",
    "component": "src/views/inventory/AdjustmentDetail.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 41,
    "elementInventory": {
      "headers": [
        "Stock Adjustment Not Found",
        "Adjustment",
        "Branch context",
        "Adjustment Detail —"
      ],
      "tabs": [],
      "kpis": [
        "Reject / Recount Approve Adjustment",
        "&middot;",
        "Approve Adjustment Reject"
      ],
      "tables": [],
      "fields": [],
      "buttons": [
        "&larr; Back to Stock Adjustments",
        "Back",
        "Reject / Recount",
        "Approve Adjustment",
        "Reject"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/inventory/stock-adjustments/:id",
    "name": "inventory-adjustment-detail",
    "component": "src/views/inventory/AdjustmentDetail.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 41,
    "elementInventory": {
      "headers": [
        "Stock Adjustment Not Found",
        "Adjustment",
        "Branch context",
        "Adjustment Detail —"
      ],
      "tabs": [],
      "kpis": [
        "Reject / Recount Approve Adjustment",
        "&middot;",
        "Approve Adjustment Reject"
      ],
      "tables": [],
      "fields": [],
      "buttons": [
        "&larr; Back to Stock Adjustments",
        "Back",
        "Reject / Recount",
        "Approve Adjustment",
        "Reject"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/inventory/adjustments/:id",
    "name": "inventory-adjustment-detail-alias",
    "component": "src/views/inventory/AdjustmentDetail.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 41,
    "elementInventory": {
      "headers": [
        "Stock Adjustment Not Found",
        "Adjustment",
        "Branch context",
        "Adjustment Detail —"
      ],
      "tabs": [],
      "kpis": [
        "Reject / Recount Approve Adjustment",
        "&middot;",
        "Approve Adjustment Reject"
      ],
      "tables": [],
      "fields": [],
      "buttons": [
        "&larr; Back to Stock Adjustments",
        "Back",
        "Reject / Recount",
        "Approve Adjustment",
        "Reject"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/inventory/cycle-counts",
    "name": "inventory-cycle-counts",
    "component": "src/views/inventory/CycleCounts.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 14,
    "elementInventory": {
      "headers": [
        "Cycle Counts"
      ],
      "tabs": [
        "Clear"
      ],
      "kpis": [
        "Status:",
        "Cycle Counts Showing count sessions",
        "Actions No cycle counts match your filters.",
        "Owner Action &rarr; No cycle counts match your filters."
      ],
      "tables": [
        [
          "Count",
          "Scope",
          "Due",
          "Expected",
          "Counted",
          "Status",
          "Actions",
          "Count",
          "Branch",
          "Scope",
          "Expected Units",
          "Counted",
          "Variance",
          "Status",
          "Owner",
          "Action"
        ]
      ],
      "fields": [
        "Search count or scope...",
        "Search cycle counts..."
      ],
      "buttons": [
        "Start Count",
        "Status:",
        "Create Cycle Count",
        "Clear",
        "&rarr;"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/inventory/cycle-counts/create",
    "name": "inventory-create-cycle-count",
    "component": "src/views/inventory/CreateCycleCount.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 10,
    "elementInventory": {
      "headers": [
        "Count Scope",
        "Count Target & Location"
      ],
      "tabs": [],
      "kpis": [
        "Count Scope Count Name * Count name is required",
        "Count Target & Location Expected Units Count"
      ],
      "tables": [],
      "fields": [
        "e.g. Showroom Count",
        "e.g. Showroom Units or Battery Storage",
        "e.g. Branch Team",
        "e.g. Today or 30 Aug",
        "e.g. 20 units",
        "e.g. Main Showroom & Staging Area",
        "Instructions for team e.g. verify barcode & serial tags...",
        "Count Name *",
        "Scope Area *",
        "Assigned Team / Auditor",
        "Scheduled Date",
        "Expected Units Count",
        "Target Location",
        "Instructions & Notes"
      ],
      "buttons": [
        "Cancel"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/inventory/cycle-counts/detail",
    "name": "inventory-cycle-count-detail-legacy",
    "component": "src/views/inventory/CycleCountDetail.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 38,
    "elementInventory": {
      "headers": [
        "Cycle Count",
        "Branch context",
        "Cycle Count Detail —",
        "CC-091"
      ],
      "tabs": [],
      "kpis": [
        "CC-091 Peshawar &middot; Main Showroom"
      ],
      "tables": [],
      "fields": [],
      "buttons": [
        "Review Count"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/inventory/cycle-counts/:id",
    "name": "inventory-cycle-count-detail",
    "component": "src/views/inventory/CycleCountDetail.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 38,
    "elementInventory": {
      "headers": [
        "Cycle Count",
        "Branch context",
        "Cycle Count Detail —",
        "CC-091"
      ],
      "tabs": [],
      "kpis": [
        "CC-091 Peshawar &middot; Main Showroom"
      ],
      "tables": [],
      "fields": [],
      "buttons": [
        "Review Count"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/inventory/stock-movement-ledger",
    "name": "inventory-stock-movement-ledger",
    "component": "src/views/inventory/StockMovementLedger.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 16,
    "elementInventory": {
      "headers": [
        "Stock Movement Ledger",
        "Movement Ledger"
      ],
      "tabs": [
        "Clear",
        "Clear all filters"
      ],
      "kpis": [
        "Status:",
        "Movement Ledger Showing movements"
      ],
      "tables": [
        [
          "Time",
          "Unit / Product",
          "Movement",
          "From",
          "To",
          "Reference",
          "User",
          "Time",
          "Unit / Product",
          "Movement",
          "From",
          "To",
          "Reference",
          "User"
        ]
      ],
      "fields": [
        "Search unit, reference, user...",
        "Serial, SKU, reference..."
      ],
      "buttons": [
        "Status:",
        "Type:",
        "Location:",
        "Clear",
        "Columns",
        "Export",
        "Clear all filters"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/inventory/quarantine",
    "name": "inventory-quarantine",
    "component": "src/views/inventory/Quarantine.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 16,
    "elementInventory": {
      "headers": [
        "Damaged / Quarantine",
        "Affected Units",
        "Damaged / Quarantine / Scrap",
        "Quarantine Units"
      ],
      "tabs": [
        "Clear"
      ],
      "kpis": [
        "Status:",
        "Affected Units Showing units",
        "Actions No quarantine units match your filters.",
        "QC Hold",
        "Clear",
        "Action Edit &rarr; No quarantine units match your filters."
      ],
      "tables": [
        [
          "Unit",
          "Product",
          "Condition",
          "Source",
          "Decision",
          "Status",
          "Actions",
          "Serial",
          "Product",
          "Branch",
          "Reason",
          "Since",
          "Proposed Action",
          "Status",
          "Action"
        ]
      ],
      "fields": [
        "Search unit or product...",
        "Search serial, model..."
      ],
      "buttons": [
        "Report Damaged / Quarantine",
        "Status:",
        "Clear",
        "Edit &rarr;"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/inventory/quarantine/create",
    "name": "inventory-create-quarantine",
    "component": "src/views/inventory/CreateQuarantineRecord.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 13,
    "elementInventory": {
      "headers": [
        "Affected Unit Details",
        "Inspection & Disposition"
      ],
      "tabs": [],
      "kpis": [
        "Affected Unit Details Unit / Serial Number * Unit serial is required",
        "Quarantine (Isolated) Decision Pending QC Hold Service Route"
      ],
      "tables": [],
      "fields": [
        "e.g. M3-01014",
        "e.g. BRG M3",
        "e.g. TR-221, Inbound INB-083, Showroom Floor",
        "e.g. Packaging damage, Body panel dent, Faulty battery",
        "form.status",
        "form.decision",
        "e.g. Photo_Inspection_01.jpg",
        "Describe visible damage, test results, or reason for quarantine...",
        "form.approval",
        "Unit / Serial Number *",
        "Product / Model *",
        "Source / Origin",
        "Condition / Defect Description *",
        "Initial Status",
        "Proposed Decision / Route",
        "Inspection Evidence / Attached File",
        "Detailed Inspection Notes",
        "Reported By",
        "Approval Required"
      ],
      "buttons": [
        "Cancel"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/inventory/quarantine/detail",
    "name": "inventory-quarantine-detail-legacy",
    "component": "src/views/inventory/QuarantineDetail.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 39,
    "elementInventory": {
      "headers": [
        "Quarantine Unit",
        "Branch context"
      ],
      "tabs": [],
      "kpis": [
        "Peshawar &middot; BRG M3"
      ],
      "tables": [],
      "fields": [],
      "buttons": [
        "Back to List",
        "Report Unit",
        "Disposition Review"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/inventory/quarantine/:id",
    "name": "inventory-quarantine-detail",
    "component": "src/views/inventory/QuarantineDetail.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 39,
    "elementInventory": {
      "headers": [
        "Quarantine Unit",
        "Branch context"
      ],
      "tabs": [],
      "kpis": [
        "Peshawar &middot; BRG M3"
      ],
      "tables": [],
      "fields": [],
      "buttons": [
        "Back to List",
        "Report Unit",
        "Disposition Review"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/sales/dashboard",
    "name": "sales-dashboard",
    "component": "src/views/sales/SalesDashboard.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 19,
    "elementInventory": {
      "headers": [
        "Sales Dashboard",
        "Sales Trend",
        "Top Products",
        "Branch Sales",
        "Collections & Outstanding"
      ],
      "tabs": [],
      "kpis": [
        "Sales Trend",
        "Top Products BRG E-125 12 units"
      ],
      "tables": [
        [
          "Product",
          "Revenue",
          "Units",
          "Margin",
          "Branch",
          "Collected",
          "Outstanding",
          "Overdue"
        ]
      ],
      "fields": [],
      "buttons": []
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/sales/quotations",
    "name": "sales-quotations",
    "component": "src/views/sales/Quotations.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 21,
    "elementInventory": {
      "headers": [
        "Quotations",
        "Branch Quotations",
        "Quotations ()"
      ],
      "tabs": [
        "Reset Filters",
        "Reset filters"
      ],
      "kpis": [
        "Status:",
        "Branch Quotations Showing quotations",
        "Actions Open &rsaquo;"
      ],
      "tables": [
        [
          "Quotation",
          "Customer",
          "Product",
          "Value",
          "Status",
          "Actions",
          "Quote",
          "Branch",
          "Customer",
          "Items",
          "Amount",
          "Valid Until",
          "Status",
          "Owner",
          "Action"
        ]
      ],
      "fields": [
        "Search quotation or customer...",
        "Search quotation #, customer, item..."
      ],
      "buttons": [
        "New Quotation",
        "Status:",
        "Open &rsaquo;",
        "Reset Filters",
        "Edit &rarr;",
        "Reset filters"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/sales/quotations/create",
    "name": "sales-create-quotation",
    "component": "src/views/sales/CreateQuotation.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 21,
    "elementInventory": {
      "headers": [
        "Branch Assignment",
        "Customer & Commercial Terms",
        "Delivery & Validity Terms",
        "Vehicles & Quoted Items",
        "Remarks & Internal Justification"
      ],
      "tabs": [],
      "kpis": [
        "Customer & Commercial Terms Customer Name / Phone *",
        "Vehicles & Quoted Items All prices in Pakistani Rupees (PKR)",
        "PKR"
      ],
      "tables": [],
      "fields": [
        "form.branch",
        "Search customer by name, mobile, or CNIC...",
        "quote-payment-terms",
        "form.taxRegFees",
        "e.g. Within 3 business days",
        "form.validity",
        "item.product",
        "item.quantity",
        "item.sellingPrice",
        "item.warranty",
        "quote-discount",
        "Enter customer special requests or business justification for special pricing...",
        "Origin Showroom",
        "Customer Name / Phone *",
        "Payment Terms",
        "Tax / Registration Fees",
        "Delivery Lead Time",
        "Quotation Valid Until",
        "Product Model *",
        "Quantity",
        "Unit Price (PKR)",
        "Warranty Package"
      ],
      "buttons": [
        "Create New Customer",
        "+ Add New Customer",
        "Add Vehicle",
        "Cancel"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/sales/quotations/detail",
    "name": "sales-quotation-detail-legacy",
    "component": "src/views/sales/QuotationDetail.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 41,
    "elementInventory": {
      "headers": [
        "Quotation Not Found",
        "Quotation",
        "Related information"
      ],
      "tabs": [],
      "kpis": [
        "Accept Quote Convert to Sales Order"
      ],
      "tables": [],
      "fields": [],
      "buttons": [
        "Back to Quotations",
        "Back to List",
        "Accept Quote",
        "Convert to Sales Order"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/sales/quotations/:id",
    "name": "sales-quotation-detail",
    "component": "src/views/sales/QuotationDetail.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 41,
    "elementInventory": {
      "headers": [
        "Quotation Not Found",
        "Quotation",
        "Related information"
      ],
      "tabs": [],
      "kpis": [
        "Accept Quote Convert to Sales Order"
      ],
      "tables": [],
      "fields": [],
      "buttons": [
        "Back to Quotations",
        "Back to List",
        "Accept Quote",
        "Convert to Sales Order"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/sales/orders",
    "name": "sales-orders",
    "component": "src/views/sales/Orders.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 25,
    "elementInventory": {
      "headers": [
        "Orders",
        "Branch Orders"
      ],
      "tabs": [
        "Reset filters"
      ],
      "kpis": [
        "Status:",
        "Branch Orders Order Customer Product Total Status Action Open &rsaquo;",
        "Status Delivery Action View"
      ],
      "tables": [
        [
          "Order",
          "Customer",
          "Product",
          "Total",
          "Status",
          "Action",
          "Order",
          "Branch",
          "Customer",
          "Unit",
          "Amount",
          "Paid",
          "Balance",
          "Status",
          "Delivery",
          "Action"
        ]
      ],
      "fields": [
        "Search orders, customer...",
        "Search order #, customer, unit..."
      ],
      "buttons": [
        "Create Sale",
        "Status:",
        "Open &rsaquo;",
        "Create Order",
        "Branch:",
        "View",
        "Reset filters"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/sales/orders/create",
    "name": "sales-create-order",
    "component": "src/views/sales/CreateSale.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 24,
    "elementInventory": {
      "headers": [
        "1. Dealership & Customer",
        "2. Vehicle Price & Discounts",
        "3. Exact Showroom Unit (Chassis / VIN)",
        "4. Payment & Down Deposit"
      ],
      "tabs": [],
      "kpis": [
        "Branch Manager / Orders / Super Admin / Sales & CRM /",
        "1. Dealership & Customer Step 1 of 4",
        "2. Vehicle Price & Discounts All amounts in PKR",
        "Landed Cost Select",
        "4. Payment & Down Deposit Step 4 of 4",
        "Debit / Credit Card (POS Terminal) Digital QR / Mobile Gateway",
        "Bank Transaction ID / IBFT Ref # * Transaction ID is required for bank transfer",
        "Cancel"
      ],
      "tables": [
        [
          "Serial",
          "Chassis (VIN)",
          "Status",
          "Landed Cost",
          "Select"
        ]
      ],
      "fields": [
        "saleData.branch",
        "Search by customer name, phone, or CNIC...",
        "saleData.salesperson",
        "saleData.product",
        "e.g. PKR 240,000",
        "e.g. PKR 10,000",
        "e.g. PKR 230,000",
        "saleData.selectedUnit",
        "saleData.paymentMethod",
        "e.g. TXN-984210-MEEZAN",
        "saleData.bankAccount",
        "e.g. CHQ-889012",
        "e.g. MCB Bank Limited",
        "PKR 0",
        "Showroom Branch *",
        "Customer (Name or Mobile #) *",
        "Sales Executive",
        "Product Model *",
        "MSRP / Catalogue Price",
        "Authorized Discount",
        "Net Vehicle Sale Price (Payable)",
        "Payment Method *",
        "Bank Transaction ID / IBFT Ref # *",
        "Target Deposit Bank Account",
        "Cheque / Pay Order # *",
        "Drawee Bank Name",
        "Amount Received",
        "Remaining Balance"
      ],
      "buttons": [
        "&bull;",
        "Create New Customer",
        "+ Add New Customer",
        "Cancel"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/sales/create-sale",
    "name": "sales-create-sale-alias",
    "component": "src/views/sales/CreateSale.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 24,
    "elementInventory": {
      "headers": [
        "1. Dealership & Customer",
        "2. Vehicle Price & Discounts",
        "3. Exact Showroom Unit (Chassis / VIN)",
        "4. Payment & Down Deposit"
      ],
      "tabs": [],
      "kpis": [
        "Branch Manager / Orders / Super Admin / Sales & CRM /",
        "1. Dealership & Customer Step 1 of 4",
        "2. Vehicle Price & Discounts All amounts in PKR",
        "Landed Cost Select",
        "4. Payment & Down Deposit Step 4 of 4",
        "Debit / Credit Card (POS Terminal) Digital QR / Mobile Gateway",
        "Bank Transaction ID / IBFT Ref # * Transaction ID is required for bank transfer",
        "Cancel"
      ],
      "tables": [
        [
          "Serial",
          "Chassis (VIN)",
          "Status",
          "Landed Cost",
          "Select"
        ]
      ],
      "fields": [
        "saleData.branch",
        "Search by customer name, phone, or CNIC...",
        "saleData.salesperson",
        "saleData.product",
        "e.g. PKR 240,000",
        "e.g. PKR 10,000",
        "e.g. PKR 230,000",
        "saleData.selectedUnit",
        "saleData.paymentMethod",
        "e.g. TXN-984210-MEEZAN",
        "saleData.bankAccount",
        "e.g. CHQ-889012",
        "e.g. MCB Bank Limited",
        "PKR 0",
        "Showroom Branch *",
        "Customer (Name or Mobile #) *",
        "Sales Executive",
        "Product Model *",
        "MSRP / Catalogue Price",
        "Authorized Discount",
        "Net Vehicle Sale Price (Payable)",
        "Payment Method *",
        "Bank Transaction ID / IBFT Ref # *",
        "Target Deposit Bank Account",
        "Cheque / Pay Order # *",
        "Drawee Bank Name",
        "Amount Received",
        "Remaining Balance"
      ],
      "buttons": [
        "&bull;",
        "Create New Customer",
        "+ Add New Customer",
        "Cancel"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/sales/orders/detail",
    "name": "sales-order-detail-legacy",
    "component": "src/views/sales/OrderDetail.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 45,
    "elementInventory": {
      "headers": [
        "Order",
        "Related information",
        "Order Detail —"
      ],
      "tabs": [],
      "kpis": [
        "Delivery Handover Cancel Order",
        "Delivery Handover",
        "· ·",
        "Order Actions",
        "Order Total"
      ],
      "tables": [],
      "fields": [],
      "buttons": [
        "Back to List",
        "Delivery Handover",
        "Cancel Order",
        "Order Actions"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/sales/orders/:id",
    "name": "sales-order-detail",
    "component": "src/views/sales/OrderDetail.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 45,
    "elementInventory": {
      "headers": [
        "Order",
        "Related information",
        "Order Detail —"
      ],
      "tabs": [],
      "kpis": [
        "Delivery Handover Cancel Order",
        "Delivery Handover",
        "· ·",
        "Order Actions",
        "Order Total"
      ],
      "tables": [],
      "fields": [],
      "buttons": [
        "Back to List",
        "Delivery Handover",
        "Cancel Order",
        "Order Actions"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/sales/invoices",
    "name": "sales-invoices",
    "component": "src/views/sales/Invoices.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 19,
    "elementInventory": {
      "headers": [
        "Invoices & Receivables",
        "Invoices"
      ],
      "tabs": [
        "Clear",
        "Clear all filters",
        "Reset Filters"
      ],
      "kpis": [
        "Status:",
        "Invoices Showing invoices",
        "Reset Filters",
        "Action Open"
      ],
      "tables": [
        [
          "Invoice",
          "Customer",
          "Order",
          "Amount",
          "Status",
          "Actions",
          "Invoice",
          "Order",
          "Branch",
          "Customer",
          "Amount",
          "Issued",
          "Payment Status",
          "Action"
        ]
      ],
      "fields": [
        "Search invoice, customer, order..."
      ],
      "buttons": [
        "Create Invoice",
        "Status:",
        "Amount:",
        "Clear",
        "Columns",
        "Export",
        "Open &rsaquo;",
        "Clear all filters",
        "Reset Filters",
        "Open"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/sales/invoices/create",
    "name": "sales-create-invoice",
    "component": "src/views/sales/CreateInvoice.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 22,
    "elementInventory": {
      "headers": [
        "Assignment",
        "Customer Details",
        "Related Reference",
        "Invoice Terms",
        "Line Items",
        "Internal Notes & Custom Text"
      ],
      "tabs": [],
      "kpis": [
        "Unpaid Partial Paid",
        "PKR"
      ],
      "tables": [],
      "fields": [
        "form.branch",
        "Search customer...",
        "e.g. QT-1882 or ORD-2241",
        "form.paymentTerms",
        "form.issueDate",
        "form.dueDate",
        "form.status",
        "e.g. Advance Deposit for 5 E-Scooters",
        "item.quantity",
        "item.unitPrice",
        "form.discount",
        "form.tax",
        "Added to the bottom of the invoice...",
        "Branch",
        "Customer Name *",
        "Link to Order or Quotation (Optional)",
        "Payment Terms / Instructions",
        "Issue Date",
        "Due Date",
        "Status",
        "Description *",
        "Quantity",
        "Unit Price (PKR)"
      ],
      "buttons": [
        "Create New Customer",
        "+ Add New Customer",
        "Add Custom Item",
        "Cancel"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/sales/invoices/detail",
    "name": "sales-invoice-detail-legacy",
    "component": "src/views/sales/InvoiceDetail.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 9,
    "elementInventory": {
      "headers": [
        "Invoice Not Found",
        "Invoice",
        "Bill To"
      ],
      "tabs": [],
      "kpis": [
        "PKR PKR",
        "Subtotal PKR",
        "PKR"
      ],
      "tables": [
        [
          "Description",
          "Qty",
          "Unit Price",
          "Total Amount"
        ]
      ],
      "fields": [],
      "buttons": [
        "Back to Invoices",
        "Print",
        "Download PDF"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/sales/invoices/:id",
    "name": "sales-invoice-detail",
    "component": "src/views/sales/InvoiceDetail.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 9,
    "elementInventory": {
      "headers": [
        "Invoice Not Found",
        "Invoice",
        "Bill To"
      ],
      "tabs": [],
      "kpis": [
        "PKR PKR",
        "Subtotal PKR",
        "PKR"
      ],
      "tables": [
        [
          "Description",
          "Qty",
          "Unit Price",
          "Total Amount"
        ]
      ],
      "fields": [],
      "buttons": [
        "Back to Invoices",
        "Print",
        "Download PDF"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/sales/payments",
    "name": "sales-payments",
    "component": "src/views/sales/Payments.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 18,
    "elementInventory": {
      "headers": [
        "Payments"
      ],
      "tabs": [],
      "kpis": [
        "Status:",
        "Clear",
        "Payments Payment Customer Method Amount Status Actions Open &rsaquo;",
        "No payment records found",
        "Payment Order Customer Branch Method Amount Date Status Actions"
      ],
      "tables": [
        [
          "Payment",
          "Customer",
          "Method",
          "Amount",
          "Status",
          "Actions",
          "Payment",
          "Order",
          "Customer",
          "Branch",
          "Method",
          "Amount",
          "Date",
          "Status",
          "Actions"
        ]
      ],
      "fields": [
        "Search payments..."
      ],
      "buttons": [
        "Record Payment",
        "Status:",
        "Clear",
        "Columns",
        "Export",
        "Open &rsaquo;"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/sales/payments/create",
    "name": "sales-create-payment",
    "component": "src/views/sales/CreatePayment.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 13,
    "elementInventory": {
      "headers": [
        "Collection Details",
        "Verification & Reconciliation"
      ],
      "tabs": [],
      "kpis": [
        "Card / POS Terminal"
      ],
      "tables": [],
      "fields": [
        "form.invoice_id",
        "e.g. Ahsan Khan",
        "e.g. SO-9723 / INV-0492",
        "form.method",
        "e.g. PKR 280,000",
        "e.g. TXN-2241-BANK-01",
        "form.bankAccount",
        "e.g. Today",
        "Counter teller notes, customer CNIC match, or installment remarks...",
        "Select Invoice to Settle",
        "Customer Name *",
        "Linked Order / Invoice Reference *",
        "Payment Method",
        "Amount Collected (PKR) *",
        "Bank Transaction Reference / Slip Number * (Mandatory for Bank Transfer)",
        "Deposit Bank Account / Vault",
        "Payment Date",
        "Collector & Reconciliation Remarks"
      ],
      "buttons": [
        "Cancel"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/sales/payments/detail",
    "name": "sales-payment-detail-legacy",
    "component": "src/views/sales/PaymentDetail.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 38,
    "elementInventory": {
      "headers": [
        "Payment Not Found",
        "Payment",
        "Related information"
      ],
      "tabs": [],
      "kpis": [],
      "tables": [],
      "fields": [],
      "buttons": [
        "Back to Payments",
        "Back to List",
        "Record Payment"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/sales/payments/:id",
    "name": "sales-payment-detail",
    "component": "src/views/sales/PaymentDetail.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 38,
    "elementInventory": {
      "headers": [
        "Payment Not Found",
        "Payment",
        "Related information"
      ],
      "tabs": [],
      "kpis": [],
      "tables": [],
      "fields": [],
      "buttons": [
        "Back to Payments",
        "Back to List",
        "Record Payment"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/sales/customers",
    "name": "sales-customers",
    "component": "src/views/sales/Customers.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 22,
    "elementInventory": {
      "headers": [
        "Customers",
        "Branch Customers"
      ],
      "tabs": [
        "Reset Filters",
        "Reset filters"
      ],
      "kpis": [
        "Status:",
        "Clear",
        "Branch Customers Customer Name Phone Orders Outstanding Status Actions Open ›",
        "No customers found matching the filter",
        "Balance:",
        "Reset Filters",
        "No customers found matching the selected filters Reset filters"
      ],
      "tables": [
        [
          "Customer",
          "Name",
          "Phone",
          "Orders",
          "Outstanding",
          "Status",
          "Actions",
          "Customer",
          "Phone",
          "Branch",
          "Orders",
          "Owned Units",
          "Lifetime Value",
          "Balance",
          "Last Activity",
          "Actions"
        ]
      ],
      "fields": [
        "Search customers...",
        "Search name, phone, branch..."
      ],
      "buttons": [
        "Add Customer",
        "Status:",
        "Clear",
        "Columns",
        "Export",
        "Open ›",
        "Balance:",
        "Reset Filters",
        "Open &rarr;",
        "Reset filters"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/sales/customers/create",
    "name": "sales-create-customer",
    "component": "src/views/sales/CreateCustomer.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 12,
    "elementInventory": {
      "headers": [
        "Personal Details",
        "Address & Classification"
      ],
      "tabs": [],
      "kpis": [
        "Branch Manager / Customers / Super Admin / Sales & CRM / Customers /",
        "Personal Details First Name * Name is required",
        "Address & Classification Residential / Business Street Address",
        "Active Customer Showroom Walk-in Lead Inactive"
      ],
      "tables": [],
      "fields": [
        "e.g. Ahsan",
        "e.g. Khan",
        "e.g. 0300 1234567",
        "customer@example.com",
        "17301-XXXXXXX-X",
        "House #, Street, Sector, Area...",
        "e.g. Peshawar",
        "formData.branch",
        "formData.status",
        "Corporate fleet manager, VIP buyer...",
        "First Name *",
        "Last Name",
        "Mobile Phone Number *",
        "Email Address",
        "CNIC / National Identity Card",
        "Residential / Business Street Address",
        "City",
        "Registered Branch",
        "Customer Lifecycle Status",
        "Profile Notes"
      ],
      "buttons": [
        "Cancel"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/sales/customers/detail",
    "name": "sales-customer-detail-legacy",
    "component": "src/views/sales/CustomerDetail.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 39,
    "elementInventory": {
      "headers": [
        "Customer Profile & Contact",
        "Financial Health & Collections",
        "Recent Sales Orders",
        "Recent Payment Records",
        "Comprehensive Contact & Identification Details",
        "Personal Identity",
        "Contact & Address",
        "Customer Sales Orders ()",
        "Customer Tax Invoices ()",
        "Customer Payment Receipts ()",
        "Registered Vehicles & Chassis ()",
        "Active OEM Warranties",
        "Workshop Service & Repair Cases ()",
        "Showroom Inquiries & Lead History",
        "Official Document Verification Checklist",
        "Internal Customer Notes",
        "Customer Audit Trail & System Events"
      ],
      "tabs": [
        "View All () ›"
      ],
      "kpis": [
        "Branch",
        "Lifetime Sales",
        "Confirmed orders & paid invoices",
        "active order records",
        "Registered chassis on road",
        "Customer Profile & Contact Edit Profile",
        "Financial Health & Collections Total Billed",
        "Recent Sales Orders View All () ›",
        "Recent Payment Records View All () ›",
        "Paid Amount Balance Status Action View Order ›",
        "Paid Amount Outstanding Payment Status Action View Invoice ›",
        "Action View Receipt ›",
        "Active OEM Warranties 0\" class=\"space-y-3\"> Active Coverage",
        "Workshop Service & Repair Cases () + Log Service Case"
      ],
      "tables": [
        [
          "Order Number",
          "Date",
          "Vehicle / Model",
          "Total Amount",
          "Paid Amount",
          "Balance",
          "Status",
          "Action",
          "Invoice Number",
          "Issue Date",
          "Due Date",
          "Total Amount",
          "Paid Amount",
          "Outstanding",
          "Payment Status",
          "Action",
          "Receipt / Payment #",
          "Linked Order",
          "Amount Cleared",
          "Payment Method",
          "Date",
          "Reference / Slip",
          "Status",
          "Action",
          "Chassis / VIN",
          "Product Model",
          "Branch Location",
          "Handover Date",
          "Warranty Coverage",
          "Action"
        ]
      ],
      "fields": [],
      "buttons": [
        "Back to Customers",
        "Edit Customer",
        "New Quote",
        "Create Order",
        "Edit Profile",
        "+ New Order",
        "+ Record Payment",
        "View All () ›",
        "Create New Order",
        "View Order ›",
        "Create First Order",
        "Go to Invoices Hub",
        "View Invoice ›",
        "Record Payment",
        "View Receipt ›",
        "Record First Payment",
        "View Vehicle ›",
        "Warranty Certificate ›",
        "+ Log Service Case",
        "View Job Card ›",
        "View Lead ›",
        "Edit Notes"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/sales/customers/:id",
    "name": "sales-customer-detail",
    "component": "src/views/sales/CustomerDetail.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 39,
    "elementInventory": {
      "headers": [
        "Customer Profile & Contact",
        "Financial Health & Collections",
        "Recent Sales Orders",
        "Recent Payment Records",
        "Comprehensive Contact & Identification Details",
        "Personal Identity",
        "Contact & Address",
        "Customer Sales Orders ()",
        "Customer Tax Invoices ()",
        "Customer Payment Receipts ()",
        "Registered Vehicles & Chassis ()",
        "Active OEM Warranties",
        "Workshop Service & Repair Cases ()",
        "Showroom Inquiries & Lead History",
        "Official Document Verification Checklist",
        "Internal Customer Notes",
        "Customer Audit Trail & System Events"
      ],
      "tabs": [
        "View All () ›"
      ],
      "kpis": [
        "Branch",
        "Lifetime Sales",
        "Confirmed orders & paid invoices",
        "active order records",
        "Registered chassis on road",
        "Customer Profile & Contact Edit Profile",
        "Financial Health & Collections Total Billed",
        "Recent Sales Orders View All () ›",
        "Recent Payment Records View All () ›",
        "Paid Amount Balance Status Action View Order ›",
        "Paid Amount Outstanding Payment Status Action View Invoice ›",
        "Action View Receipt ›",
        "Active OEM Warranties 0\" class=\"space-y-3\"> Active Coverage",
        "Workshop Service & Repair Cases () + Log Service Case"
      ],
      "tables": [
        [
          "Order Number",
          "Date",
          "Vehicle / Model",
          "Total Amount",
          "Paid Amount",
          "Balance",
          "Status",
          "Action",
          "Invoice Number",
          "Issue Date",
          "Due Date",
          "Total Amount",
          "Paid Amount",
          "Outstanding",
          "Payment Status",
          "Action",
          "Receipt / Payment #",
          "Linked Order",
          "Amount Cleared",
          "Payment Method",
          "Date",
          "Reference / Slip",
          "Status",
          "Action",
          "Chassis / VIN",
          "Product Model",
          "Branch Location",
          "Handover Date",
          "Warranty Coverage",
          "Action"
        ]
      ],
      "fields": [],
      "buttons": [
        "Back to Customers",
        "Edit Customer",
        "New Quote",
        "Create Order",
        "Edit Profile",
        "+ New Order",
        "+ Record Payment",
        "View All () ›",
        "Create New Order",
        "View Order ›",
        "Create First Order",
        "Go to Invoices Hub",
        "View Invoice ›",
        "Record Payment",
        "View Receipt ›",
        "Record First Payment",
        "View Vehicle ›",
        "Warranty Certificate ›",
        "+ Log Service Case",
        "View Job Card ›",
        "View Lead ›",
        "Edit Notes"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/sales/leads",
    "name": "sales-leads",
    "component": "src/views/sales/Leads.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 25,
    "elementInventory": {
      "headers": [
        "Leads & Inquiries",
        "Branch Leads",
        "Leads ()"
      ],
      "tabs": [
        "Clear",
        "Reset filters",
        "Clear Filters",
        "Reset all filters"
      ],
      "kpis": [
        "Status:",
        "Branch Leads leads",
        "No leads match the selected filters Reset all filters"
      ],
      "tables": [
        [
          "c.key === 'leadNo')?.visible\" class=\"px-5 py-3\">Lead",
          "c.key === 'customer')?.visible\" class=\"px-5 py-3\">Customer",
          "c.key === 'source')?.visible\" class=\"px-5 py-3\">Source",
          "c.key === 'product')?.visible\" class=\"px-5 py-3\">Product",
          "c.key === 'status')?.visible\" class=\"px-5 py-3\">Status",
          "Lead",
          "Name",
          "Source",
          "Interest",
          "Branch",
          "Owner",
          "Stage",
          "Next Follow-up",
          "Action"
        ]
      ],
      "fields": [
        "Search leads...",
        "col.visible",
        "Search by lead #, name, product, branch..."
      ],
      "buttons": [
        "Add Lead",
        "Status:",
        "Source:",
        "Product:",
        "Clear",
        "Columns",
        "Export",
        "Reset filters",
        "Clear Filters",
        "View",
        "Reset all filters"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/sales/leads/create",
    "name": "sales-create-lead",
    "component": "src/views/sales/CreateLead.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 14,
    "elementInventory": {
      "headers": [
        "Lead Information",
        "Assignment & Scope",
        "Opportunity",
        "Follow-up Timeline"
      ],
      "tabs": [],
      "kpis": [
        "Branch Manager / Leads / Super Admin / Sales & CRM / Leads /",
        "Lead Information Lead / Customer Name * Name is required",
        "Assignment & Scope Branch Peshawar Islamabad Lahore",
        "New Contacted Qualified Quoted Converted",
        "Opportunity Interested Product",
        "Follow-up Timeline Next Follow-up Date"
      ],
      "tables": [],
      "fields": [
        "Full name...",
        "+92 3XX XXXXXXX",
        "formData.source",
        "formData.branch",
        "e.g. Hamza Ali",
        "formData.stage",
        "e.g. BRG X7 / EV-5",
        "e.g. PKR 220K",
        "e.g. Aug 30",
        "Lead / Customer Name *",
        "Phone Number *",
        "Lead Source",
        "Branch",
        "Assigned Sales Owner",
        "Stage / Status",
        "Interested Product",
        "Budget Estimate",
        "Next Follow-up Date"
      ],
      "buttons": [
        "Cancel"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/sales/leads/detail",
    "name": "sales-lead-detail-legacy",
    "component": "src/views/sales/LeadDetail.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 34,
    "elementInventory": {
      "headers": [
        "Lead",
        "Related information",
        "Lead Detail",
        "Lead Profile",
        "Opportunity",
        "Timeline"
      ],
      "tabs": [],
      "kpis": [
        "New",
        "· lead · Interested in",
        "Edit Lead More",
        "Lead Profile Phone"
      ],
      "tables": [],
      "fields": [],
      "buttons": [
        "Edit Lead",
        "More",
        "Create Quotation",
        "Convert to Customer"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/sales/leads/:id",
    "name": "sales-lead-detail",
    "component": "src/views/sales/LeadDetail.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 34,
    "elementInventory": {
      "headers": [
        "Lead",
        "Related information",
        "Lead Detail",
        "Lead Profile",
        "Opportunity",
        "Timeline"
      ],
      "tabs": [],
      "kpis": [
        "New",
        "· lead · Interested in",
        "Edit Lead More",
        "Lead Profile Phone"
      ],
      "tables": [],
      "fields": [],
      "buttons": [
        "Edit Lead",
        "More",
        "Create Quotation",
        "Convert to Customer"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/sales/follow-ups",
    "name": "sales-follow-ups",
    "component": "src/views/sales/FollowUps.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 25,
    "elementInventory": {
      "headers": [
        "Follow-ups",
        "Customer Follow-ups",
        "Follow-up Queue ()"
      ],
      "tabs": [
        "Reset Filters",
        "Reset filters"
      ],
      "kpis": [
        "Status:",
        "Clear",
        "No follow-ups match the selected filters",
        "Follow-up Queue ()",
        "Actions",
        "No follow-ups match the selected filters Reset filters"
      ],
      "tables": [
        [
          "Customer",
          "Linked Record",
          "Owner",
          "Due",
          "Status",
          "Actions",
          "Due",
          "Customer / Lead",
          "Type",
          "Branch",
          "Owner",
          "Priority",
          "Status",
          "Actions"
        ]
      ],
      "fields": [
        "Search follow-ups..."
      ],
      "buttons": [
        "Follow-up",
        "Status:",
        "Clear",
        "Columns",
        "Export",
        "Open ›",
        "Schedule Follow-up",
        "Reset Filters",
        "Reset filters"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/sales/follow-ups/create",
    "name": "sales-create-follow-up",
    "component": "src/views/sales/CreateFollowUp.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 14,
    "elementInventory": {
      "headers": [
        "Follow-up Details",
        "Assignment & Timeline"
      ],
      "tabs": [],
      "kpis": [
        "Branch Manager / Follow-ups / Super Admin / Sales & CRM / Follow-ups /",
        "Follow-up Details Customer / Lead Name * Customer name is required",
        "Assignment & Timeline Assigned Owner"
      ],
      "tables": [],
      "fields": [
        "e.g. Bilal Shah or Sajid Khan",
        "e.g. ORD-2238 or LD-551",
        "form.taskType",
        "form.priority",
        "form.channel",
        "e.g. Hamza",
        "form.branch",
        "e.g. Today or 18 Sep 2026",
        "e.g. 11:30 or 14:00",
        "Specify call purpose, outstanding amount or customer questions...",
        "form.sendReminder",
        "Customer / Lead Name *",
        "Linked Record (Order / Lead / Quote) *",
        "Task Type",
        "Priority",
        "Channel",
        "Assigned Owner",
        "Branch",
        "Due Date",
        "Due Time",
        "Follow-up Notes / Instructions",
        "Send reminder notification to assignee"
      ],
      "buttons": [
        "Cancel"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/sales/follow-ups/detail",
    "name": "sales-follow-up-detail-legacy",
    "component": "src/views/sales/FollowUpDetail.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 35,
    "elementInventory": {
      "headers": [
        "Follow-up —",
        "Related information",
        "Follow-up Detail",
        "Follow-up Summary"
      ],
      "tabs": [],
      "kpis": [
        "Customer:"
      ],
      "tables": [],
      "fields": [],
      "buttons": []
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/sales/follow-ups/:id",
    "name": "sales-follow-up-detail",
    "component": "src/views/sales/FollowUpDetail.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 35,
    "elementInventory": {
      "headers": [
        "Follow-up —",
        "Related information",
        "Follow-up Detail",
        "Follow-up Summary"
      ],
      "tabs": [],
      "kpis": [
        "Customer:"
      ],
      "tables": [],
      "fields": [],
      "buttons": []
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/sales/custom-orders",
    "name": "sales-custom-orders",
    "component": "src/views/sales/CustomOrders.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 22,
    "elementInventory": {
      "headers": [
        "Custom Orders",
        "Custom Orders & Reservations"
      ],
      "tabs": [
        "Reset Filters",
        "Reset filters"
      ],
      "kpis": [
        "Status:",
        "Clear",
        "Custom Orders Custom Order Customer Requirement Deposit Status Actions Open ›",
        "No custom orders found matching the filter",
        "Reset Filters",
        "ETA Status Actions Open &rarr;",
        "No custom orders found matching the selected filters Reset filters"
      ],
      "tables": [
        [
          "Custom Order",
          "Customer",
          "Requirement",
          "Deposit",
          "Status",
          "Actions",
          "Order",
          "Customer",
          "Branch",
          "Product",
          "Deposit",
          "Total",
          "ETA",
          "Status",
          "Actions"
        ]
      ],
      "fields": [
        "Search custom orders...",
        "Search order #, customer, product..."
      ],
      "buttons": [
        "Custom Order",
        "Status:",
        "Clear",
        "Columns",
        "Export",
        "Open ›",
        "Create Custom Order",
        "Reset Filters",
        "Open &rarr;",
        "Reset filters"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/sales/custom-orders/create",
    "name": "sales-create-custom-order",
    "component": "src/views/sales/CreateCustomOrder.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 13,
    "elementInventory": {
      "headers": [
        "Requirement & Customer",
        "Commercial & Reservation"
      ],
      "tabs": [],
      "kpis": [
        "Branch Manager / Custom Orders / Super Admin / Sales & CRM / Custom Orders /",
        "Requirement & Customer Customer Name * Customer name is required",
        "Commercial & Reservation Deposit Amount * Deposit amount is required",
        "Card",
        "Sourcing Procurement In Assembly Arrived Ready"
      ],
      "tables": [],
      "fields": [
        "e.g. Jawad Khan",
        "e.g. BRG X7 / Matte Black",
        "e.g. PKR 360,000",
        "e.g. 15 Sep 2026",
        "e.g. PKR 100,000",
        "form.paymentMethod",
        "e.g. TXN-CUSTOM-8812",
        "form.status",
        "e.g. On arrival",
        "Customer notes or special specs...",
        "Customer Name *",
        "Product / Specification *",
        "Customer Budget",
        "Target ETA / Date",
        "Deposit Amount *",
        "Payment Method",
        "Bank Transaction ID / Ref *",
        "Status",
        "Reservation Rule",
        "Notes & Special Requirements"
      ],
      "buttons": [
        "Cancel"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/sales/custom-orders/detail",
    "name": "sales-custom-order-detail-legacy",
    "component": "src/views/sales/CustomOrderDetail.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 17,
    "elementInventory": {
      "headers": [
        "Custom Order",
        "Requirement",
        "Related information",
        "Customer Profile",
        "Order History",
        "Deposit & Commercial Summary",
        "Product Request Detail",
        "Stock Request Tracking",
        "Inbound Arrival Logistics",
        "Reservation & Allocation",
        "Sale Conversion",
        "Customer Communication Log",
        "Activity & Audit Trail",
        "Custom Order Detail",
        "Fulfilment",
        "Communication & Activity"
      ],
      "tabs": [],
      "kpis": [
        "Requirement Status",
        "Related information Product Request",
        "Advance Deposit Cleared via Bank Transfer",
        "Agreed specification",
        "Due at delivery scan",
        "· ·",
        "Update Custom Order More",
        "Deposit",
        "Requirement Product / Requirement"
      ],
      "tables": [],
      "fields": [],
      "buttons": [
        "Update Custom Order",
        "More"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/sales/custom-orders/:id",
    "name": "sales-custom-order-detail",
    "component": "src/views/sales/CustomOrderDetail.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 17,
    "elementInventory": {
      "headers": [
        "Custom Order",
        "Requirement",
        "Related information",
        "Customer Profile",
        "Order History",
        "Deposit & Commercial Summary",
        "Product Request Detail",
        "Stock Request Tracking",
        "Inbound Arrival Logistics",
        "Reservation & Allocation",
        "Sale Conversion",
        "Customer Communication Log",
        "Activity & Audit Trail",
        "Custom Order Detail",
        "Fulfilment",
        "Communication & Activity"
      ],
      "tabs": [],
      "kpis": [
        "Requirement Status",
        "Related information Product Request",
        "Advance Deposit Cleared via Bank Transfer",
        "Agreed specification",
        "Due at delivery scan",
        "· ·",
        "Update Custom Order More",
        "Deposit",
        "Requirement Product / Requirement"
      ],
      "tables": [],
      "fields": [],
      "buttons": [
        "Update Custom Order",
        "More"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/sales/delivery",
    "name": "sales-delivery",
    "component": "src/views/sales/DeliveryHandover.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 21,
    "elementInventory": {
      "headers": [
        "Delivery / Handover",
        "Handover · SO-7731",
        "Customer Verification",
        "Unit Verification",
        "Handover Confirmation"
      ],
      "tabs": [],
      "kpis": [
        "Status:",
        "Clear",
        "Delivery / Handover Order Customer Unit Scheduled Status Actions Open &rsaquo;",
        "No scheduled deliveries found",
        "Handover · SO-7731 Saad Ahmad · DS11-00988"
      ],
      "tables": [
        [
          "Order",
          "Customer",
          "Unit",
          "Scheduled",
          "Status",
          "Actions"
        ]
      ],
      "fields": [
        "Search handovers...",
        "formData.recipientName",
        "formData.handoverDate",
        "formData.notes",
        "Recipient Name",
        "Handover Date",
        "Notes"
      ],
      "buttons": [
        "Schedule Handover",
        "Status:",
        "Clear",
        "Columns",
        "Export",
        "Open &rsaquo;",
        "Cancel",
        "Complete Handover & Mark Sold"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/sales/delivery/create",
    "name": "sales-create-delivery",
    "component": "src/views/sales/CreateDeliveryHandover.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 17,
    "elementInventory": {
      "headers": [
        "Handover & Order Details",
        "Pre-delivery Verification Checklist"
      ],
      "tabs": [],
      "kpis": [
        "Branch Manager / Delivery / Handover / Super Admin / Sales & CRM / Delivery /",
        "Handover & Order Details Order / Sale ID * Select from active orders... —",
        "Ready Scheduled In Progress"
      ],
      "tables": [],
      "fields": [
        "handover-order-select",
        "e.g. ORD-2241 or ORD-2235",
        "e.g. Ahsan Khan or Sami Ullah",
        "e.g. CHS-01882 or CH 8-BRG-26-01731",
        "e.g. Today 16:00",
        "form.status",
        "handover-chk-identity",
        "form.paymentComplete",
        "handover-chk-chassis",
        "form.accessoriesIncluded",
        "form.warrantyBriefed",
        "Enter handover details or customer special requests...",
        "Order / Sale ID *",
        "Customer Name *",
        "Unit / Chassis Number *",
        "Scheduled Time",
        "Handover Status",
        "Customer CNIC / Identity verified",
        "Payment completed and invoice issued",
        "Chassis & Serial numbers verified",
        "Standard accessories & charger included",
        "Warranty terms and booklet handed over",
        "Handover Notes / Instructions"
      ],
      "buttons": [
        "Cancel"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/sales/delivery/detail",
    "name": "sales-delivery-detail-legacy",
    "component": "src/views/sales/DeliveryHandoverDetail.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 33,
    "elementInventory": {
      "headers": [
        "Delivery Handover Record Not Found",
        "Handover —",
        "Related information"
      ],
      "tabs": [],
      "kpis": [
        "Complete Handover & Activate Warranty"
      ],
      "tables": [],
      "fields": [],
      "buttons": [
        "Back to Delivery List",
        "Back to List",
        "Complete Handover & Activate Warranty"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/sales/delivery/:id",
    "name": "sales-delivery-detail",
    "component": "src/views/sales/DeliveryHandoverDetail.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 33,
    "elementInventory": {
      "headers": [
        "Delivery Handover Record Not Found",
        "Handover —",
        "Related information"
      ],
      "tabs": [],
      "kpis": [
        "Complete Handover & Activate Warranty"
      ],
      "tables": [],
      "fields": [],
      "buttons": [
        "Back to Delivery List",
        "Back to List",
        "Complete Handover & Activate Warranty"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/sales/returns",
    "name": "sales-returns",
    "component": "src/views/sales/Returns.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 22,
    "elementInventory": {
      "headers": [
        "Returns",
        "Branch Returns",
        "Returns & Refunds",
        "Returns ()"
      ],
      "tabs": [
        "Clear",
        "Clear all filters",
        "Reset Filters",
        "Reset filters"
      ],
      "kpis": [
        "Status:",
        "Branch Returns Showing returns",
        "Status Actions Open ›",
        "No returns found matching the filter Clear all filters",
        "Reset Filters",
        "Actions Open &rarr;",
        "No returns found matching the selected filters Reset filters"
      ],
      "tables": [
        [
          "Return",
          "Order",
          "Customer",
          "Unit",
          "Reason",
          "Requested",
          "Status",
          "Actions",
          "Return",
          "Order",
          "Customer",
          "Unit",
          "Branch",
          "Reason",
          "Requested",
          "Status",
          "Actions"
        ]
      ],
      "fields": [
        "Search return, order, unit...",
        "Search return #, order #, unit..."
      ],
      "buttons": [
        "Create Return",
        "Status:",
        "Reason:",
        "Resolution:",
        "Clear",
        "Columns",
        "Export",
        "Open ›",
        "Clear all filters",
        "Reset Filters",
        "Open &rarr;",
        "Reset filters"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/sales/returns/create",
    "name": "sales-create-return",
    "component": "src/views/sales/CreateReturn.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 12,
    "elementInventory": {
      "headers": [
        "Original Order & Customer",
        "Unit & Destination",
        "Return Reason & Inspection"
      ],
      "tabs": [],
      "kpis": [
        "Original Order & Customer Original Order No * Order number is required",
        "Unit & Destination Unit Serial No * Unit serial is required",
        "Under Inspection Pending Approval Refund Approved Completed"
      ],
      "tables": [],
      "fields": [
        "e.g. ORD-2188 or SO-7702",
        "e.g. Noman Ali",
        "e.g. CH 8-BRG-26-01731",
        "formData.branch",
        "formData.requested",
        "formData.reason",
        "formData.status",
        "Condition details, battery health or reason specifics...",
        "Original Order No *",
        "Customer Name *",
        "Unit Serial No *",
        "Receiving Branch",
        "Requested Action",
        "Reason for Return",
        "Inspection Status",
        "Inspection Notes"
      ],
      "buttons": [
        "Cancel"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/sales/returns/detail",
    "name": "sales-return-detail-legacy",
    "component": "src/views/sales/ReturnDetail.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 39,
    "elementInventory": {
      "headers": [
        "Return",
        "Related information",
        "Return Detail —"
      ],
      "tabs": [],
      "kpis": [
        "· ·"
      ],
      "tables": [],
      "fields": [],
      "buttons": []
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/sales/returns/:id",
    "name": "sales-return-detail",
    "component": "src/views/sales/ReturnDetail.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 39,
    "elementInventory": {
      "headers": [
        "Return",
        "Related information",
        "Return Detail —"
      ],
      "tabs": [],
      "kpis": [
        "· ·"
      ],
      "tables": [],
      "fields": [],
      "buttons": []
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/after-sales/dashboard",
    "name": "after-sales-dashboard",
    "component": "src/views/after-sales/AfterSalesDashboard.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 23,
    "elementInventory": {
      "headers": [
        "After-sales Dashboard",
        "Service Workload",
        "Branch Workload",
        "Response Time",
        "Priority Cases"
      ],
      "tabs": [],
      "kpis": [
        "Service Workload Case / Job Customer Unit Issue Status Open ›",
        "Action Open &rarr;"
      ],
      "tables": [
        [
          "Case / Job",
          "Customer",
          "Unit",
          "Issue",
          "Status",
          "Case",
          "Branch",
          "Customer",
          "Unit",
          "Type",
          "Age",
          "Status",
          "Action"
        ]
      ],
      "fields": [],
      "buttons": [
        "Open ›"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/after-sales/warranty",
    "name": "after-sales-warranty",
    "component": "src/views/after-sales/WarrantyService.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 22,
    "elementInventory": {
      "headers": [
        "Warranty & Service Cases",
        "Service Cases",
        "Warranty & Service"
      ],
      "tabs": [
        "Clear Filters",
        "Reset filters"
      ],
      "kpis": [
        "Status:",
        "Clear",
        "Service Cases Case Customer Unit Issue Priority Status Actions Open ›",
        "No service cases found matching the filter",
        "Actions"
      ],
      "tables": [
        [
          "Case",
          "Customer",
          "Unit",
          "Issue",
          "Priority",
          "Status",
          "Actions",
          "Case",
          "Branch",
          "Customer",
          "Unit",
          "Type",
          "Opened",
          "Warranty",
          "Status",
          "Actions"
        ]
      ],
      "fields": [
        "Search cases...",
        "Search cases, customer, unit...",
        "selectedBranch"
      ],
      "buttons": [
        "Create Case",
        "Status:",
        "Date",
        "Clear",
        "Columns",
        "Export",
        "Open ›",
        "Clear Filters",
        "Reset filters"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/after-sales/warranty/create",
    "name": "after-sales-create-case",
    "component": "src/views/after-sales/CreateCase.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 17,
    "elementInventory": {
      "headers": [
        "Customer & Vehicle Lookup",
        "Complaint & Intake Details"
      ],
      "tabs": [],
      "kpis": [
        "Customer & Vehicle Lookup Customer Name *"
      ],
      "tables": [],
      "fields": [
        "Search existing customer...",
        "+92 300 0000000",
        "customer@example.com",
        "Search chassis/serial (e.g. EV5-00322)...",
        "e.g. 4,200 km",
        "Jan 12, 2025",
        "form.category",
        "Describe reported vehicle symptoms or complaint details...",
        "form.urgency",
        "form.branch",
        "e.g. Usman (Senior Tech)",
        "e.g. 30 Aug 2026",
        "Vehicle received with key, charger & mirror accessories...",
        "Customer Name *",
        "Phone Number",
        "Email Address",
        "Serialized Unit / Chassis *",
        "Odometer Reading (km)",
        "Purchase Date",
        "Issue Category *",
        "Customer Complaint & Symptoms *",
        "Priority / Urgency",
        "Branch Location",
        "Assigned Technician",
        "Target Completion Date",
        "Intake Notes & Condition"
      ],
      "buttons": [
        "&middot;",
        "&middot; VIN: &middot; Warranty:",
        "Cancel"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/after-sales/create-case",
    "name": "after-sales-create-case-alias",
    "component": "src/views/after-sales/CreateCase.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 17,
    "elementInventory": {
      "headers": [
        "Customer & Vehicle Lookup",
        "Complaint & Intake Details"
      ],
      "tabs": [],
      "kpis": [
        "Customer & Vehicle Lookup Customer Name *"
      ],
      "tables": [],
      "fields": [
        "Search existing customer...",
        "+92 300 0000000",
        "customer@example.com",
        "Search chassis/serial (e.g. EV5-00322)...",
        "e.g. 4,200 km",
        "Jan 12, 2025",
        "form.category",
        "Describe reported vehicle symptoms or complaint details...",
        "form.urgency",
        "form.branch",
        "e.g. Usman (Senior Tech)",
        "e.g. 30 Aug 2026",
        "Vehicle received with key, charger & mirror accessories...",
        "Customer Name *",
        "Phone Number",
        "Email Address",
        "Serialized Unit / Chassis *",
        "Odometer Reading (km)",
        "Purchase Date",
        "Issue Category *",
        "Customer Complaint & Symptoms *",
        "Priority / Urgency",
        "Branch Location",
        "Assigned Technician",
        "Target Completion Date",
        "Intake Notes & Condition"
      ],
      "buttons": [
        "&middot;",
        "&middot; VIN: &middot; Warranty:",
        "Cancel"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/after-sales/warranty/detail",
    "name": "after-sales-case-detail-legacy",
    "component": "src/views/after-sales/CaseDetail.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 16,
    "elementInventory": {
      "headers": [
        "Service Case Not Found",
        "Service Case",
        "Summary",
        "Related Information",
        "Customer Details",
        "Service History",
        "Vehicle Specification",
        "Warranty Verification",
        "Diagnostic Scan & Checklist",
        "Action Plan & Resolution",
        "Service Cost Estimation",
        "Customer Communication",
        "Case Evidence & Attachments",
        "Activity Timeline",
        "Warranty Case Detail"
      ],
      "tabs": [],
      "kpis": [
        "Summary Status",
        "Related Information Technician"
      ],
      "tables": [],
      "fields": [],
      "buttons": [
        "+ Create Repair Job"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/after-sales/warranty/:id",
    "name": "after-sales-case-detail",
    "component": "src/views/after-sales/CaseDetail.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 16,
    "elementInventory": {
      "headers": [
        "Service Case Not Found",
        "Service Case",
        "Summary",
        "Related Information",
        "Customer Details",
        "Service History",
        "Vehicle Specification",
        "Warranty Verification",
        "Diagnostic Scan & Checklist",
        "Action Plan & Resolution",
        "Service Cost Estimation",
        "Customer Communication",
        "Case Evidence & Attachments",
        "Activity Timeline",
        "Warranty Case Detail"
      ],
      "tabs": [],
      "kpis": [
        "Summary Status",
        "Related Information Technician"
      ],
      "tables": [],
      "fields": [],
      "buttons": [
        "+ Create Repair Job"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/after-sales/cases/:id",
    "name": "after-sales-case-detail-canonical",
    "component": "src/views/after-sales/CaseDetail.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 16,
    "elementInventory": {
      "headers": [
        "Service Case Not Found",
        "Service Case",
        "Summary",
        "Related Information",
        "Customer Details",
        "Service History",
        "Vehicle Specification",
        "Warranty Verification",
        "Diagnostic Scan & Checklist",
        "Action Plan & Resolution",
        "Service Cost Estimation",
        "Customer Communication",
        "Case Evidence & Attachments",
        "Activity Timeline",
        "Warranty Case Detail"
      ],
      "tabs": [],
      "kpis": [
        "Summary Status",
        "Related Information Technician"
      ],
      "tables": [],
      "fields": [],
      "buttons": [
        "+ Create Repair Job"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/after-sales/cases",
    "name": "/after-sales/cases",
    "component": "Unknown",
    "roles": [
      "Super Admin"
    ],
    "accessTier": "Super Admin Restricted",
    "branchScope": "Global / All Branches",
    "checkpointsCount": 0,
    "elementInventory": {
      "headers": [],
      "tabs": [],
      "kpis": [],
      "tables": [],
      "fields": [],
      "buttons": []
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/after-sales/warranties",
    "name": "/after-sales/warranties",
    "component": "Unknown",
    "roles": [
      "Super Admin"
    ],
    "accessTier": "Super Admin Restricted",
    "branchScope": "Global / All Branches",
    "checkpointsCount": 0,
    "elementInventory": {
      "headers": [],
      "tabs": [],
      "kpis": [],
      "tables": [],
      "fields": [],
      "buttons": []
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/after-sales/repairs",
    "name": "after-sales-repairs",
    "component": "src/views/after-sales/RepairJobs.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 18,
    "elementInventory": {
      "headers": [
        "Repair Jobs"
      ],
      "tabs": [
        "Clear",
        "Reset filters",
        "Clear Filters"
      ],
      "kpis": [
        "Status:",
        "Repair Jobs records",
        "Actions"
      ],
      "tables": [
        [
          "c.key === 'repairId')?.visible\" class=\"py-3 px-4\">Repair",
          "c.key === 'caseRef')?.visible\" class=\"py-3 px-4\">Case",
          "c.key === 'customer')?.visible\" class=\"py-3 px-4\">Customer",
          "c.key === 'unit')?.visible\" class=\"py-3 px-4\">Unit",
          "c.key === 'technician')?.visible\" class=\"py-3 px-4\">Technician",
          "c.key === 'promised')?.visible\" class=\"py-3 px-4\">Promised",
          "c.key === 'status')?.visible\" class=\"py-3 px-4\">Status",
          "Actions",
          "Repair ID",
          "Branch",
          "Customer",
          "Unit Serial",
          "Diagnosis",
          "Status",
          "Actions"
        ]
      ],
      "fields": [
        "Search repairs...",
        "col.visible",
        "Search repair, unit, customer..."
      ],
      "buttons": [
        "Create Repair Job",
        "Status:",
        "Technician:",
        "Unit:",
        "Clear",
        "Columns",
        "Export",
        "Open ›",
        "Reset filters",
        "Clear Filters"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/after-sales/repairs/create",
    "name": "after-sales-create-repair",
    "component": "src/views/after-sales/CreateRepairJob.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 18,
    "elementInventory": {
      "headers": [
        "1. Service Case & Customer Reference",
        "2. Diagnosis & Decision",
        "3. Parts & Materials Allocation",
        "4. Work Plan & Target Schedule"
      ],
      "tabs": [],
      "kpis": [
        "Super Admin / After-sales / Repair Jobs /",
        "Approved In Progress Parts Waiting Ready"
      ],
      "tables": [],
      "fields": [
        "Search active case (e.g. SC-229)...",
        "Enter customer name...",
        "e.g. CHS-01882",
        "form.branch",
        "e.g. BRG X7 Electric / Black",
        "e.g. Controller fault, Battery replacement",
        "e.g. Controller intermittently loses power under load",
        "e.g. Replace 72V controller",
        "e.g. Usman",
        "e.g. 72V Smart Controller Module",
        "form.partQty",
        "18K",
        "form.partSource",
        "e.g. 30 Aug",
        "form.status",
        "Add task step...",
        "Link Service Case (SC / WAR) *",
        "Customer Name *",
        "Unit Serial / Chassis *",
        "Branch",
        "Unit Model & Variant",
        "Diagnosis Category *",
        "Fault Details",
        "Work Decision",
        "Lead Technician",
        "Required Part Name",
        "Qty",
        "Est. Cost",
        "Source Stock",
        "Target Delivery Date",
        "Job Status",
        "Technician Work Plan Tasks"
      ],
      "buttons": [
        "&middot; Unit: &middot;",
        "+ Add",
        "Cancel"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/after-sales/create-repair",
    "name": "after-sales-create-repair-alias",
    "component": "src/views/after-sales/CreateRepairJob.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 18,
    "elementInventory": {
      "headers": [
        "1. Service Case & Customer Reference",
        "2. Diagnosis & Decision",
        "3. Parts & Materials Allocation",
        "4. Work Plan & Target Schedule"
      ],
      "tabs": [],
      "kpis": [
        "Super Admin / After-sales / Repair Jobs /",
        "Approved In Progress Parts Waiting Ready"
      ],
      "tables": [],
      "fields": [
        "Search active case (e.g. SC-229)...",
        "Enter customer name...",
        "e.g. CHS-01882",
        "form.branch",
        "e.g. BRG X7 Electric / Black",
        "e.g. Controller fault, Battery replacement",
        "e.g. Controller intermittently loses power under load",
        "e.g. Replace 72V controller",
        "e.g. Usman",
        "e.g. 72V Smart Controller Module",
        "form.partQty",
        "18K",
        "form.partSource",
        "e.g. 30 Aug",
        "form.status",
        "Add task step...",
        "Link Service Case (SC / WAR) *",
        "Customer Name *",
        "Unit Serial / Chassis *",
        "Branch",
        "Unit Model & Variant",
        "Diagnosis Category *",
        "Fault Details",
        "Work Decision",
        "Lead Technician",
        "Required Part Name",
        "Qty",
        "Est. Cost",
        "Source Stock",
        "Target Delivery Date",
        "Job Status",
        "Technician Work Plan Tasks"
      ],
      "buttons": [
        "&middot; Unit: &middot;",
        "+ Add",
        "Cancel"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/after-sales/repairs/detail",
    "name": "after-sales-repair-detail-legacy",
    "component": "src/views/after-sales/RepairDetail.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 59,
    "elementInventory": {
      "headers": [
        "Repair Job Not Found",
        "Repair Job",
        "Related information",
        "Repair Detail —",
        "Diagnosis",
        "Work Plan",
        "Parts",
        "Labour",
        "Cost Summary",
        "OEM Warranty Claim Verification",
        "Job Files & Diagnostics",
        "Customer Authorization Record",
        "Workshop & Repair History"
      ],
      "tabs": [
        "Manage Work Plan",
        "Reserve More Parts"
      ],
      "kpis": [
        "Confirm Schedule Complete Service",
        "Related information",
        "· ·",
        "Posted: Post to Finance Repair Actions Update Status",
        "Approved In Progress Parts Waiting Ready / Completed",
        "Generate Invoice Cancel Repair Job",
        "Parts Total",
        "820 KB · Generated by Workshop"
      ],
      "tables": [
        [
          "Task",
          "Technician",
          "Status",
          "Part",
          "Qty",
          "Cost",
          "Source",
          "Status",
          "Work",
          "Hours",
          "Rate",
          "Amount"
        ]
      ],
      "fields": [],
      "buttons": [
        "Back",
        "Post to Finance",
        "Confirm Schedule",
        "Complete Service",
        "Back to Repairs",
        "Repair Actions",
        "Approved",
        "In Progress",
        "Parts Waiting",
        "Ready / Completed",
        "Manage Work Plan",
        "Reserve More Parts",
        "More",
        "Print Job Card",
        "Generate Invoice",
        "Cancel Repair Job",
        "Upload Photo / Document"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/after-sales/repairs/:id",
    "name": "after-sales-repair-detail",
    "component": "src/views/after-sales/RepairDetail.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 59,
    "elementInventory": {
      "headers": [
        "Repair Job Not Found",
        "Repair Job",
        "Related information",
        "Repair Detail —",
        "Diagnosis",
        "Work Plan",
        "Parts",
        "Labour",
        "Cost Summary",
        "OEM Warranty Claim Verification",
        "Job Files & Diagnostics",
        "Customer Authorization Record",
        "Workshop & Repair History"
      ],
      "tabs": [
        "Manage Work Plan",
        "Reserve More Parts"
      ],
      "kpis": [
        "Confirm Schedule Complete Service",
        "Related information",
        "· ·",
        "Posted: Post to Finance Repair Actions Update Status",
        "Approved In Progress Parts Waiting Ready / Completed",
        "Generate Invoice Cancel Repair Job",
        "Parts Total",
        "820 KB · Generated by Workshop"
      ],
      "tables": [
        [
          "Task",
          "Technician",
          "Status",
          "Part",
          "Qty",
          "Cost",
          "Source",
          "Status",
          "Work",
          "Hours",
          "Rate",
          "Amount"
        ]
      ],
      "fields": [],
      "buttons": [
        "Back",
        "Post to Finance",
        "Confirm Schedule",
        "Complete Service",
        "Back to Repairs",
        "Repair Actions",
        "Approved",
        "In Progress",
        "Parts Waiting",
        "Ready / Completed",
        "Manage Work Plan",
        "Reserve More Parts",
        "More",
        "Print Job Card",
        "Generate Invoice",
        "Cancel Repair Job",
        "Upload Photo / Document"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/finance/expenses",
    "name": "finance-expenses",
    "component": "src/views/finance/Expenses.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 23,
    "elementInventory": {
      "headers": [
        "Expenses",
        "Branch Expenses"
      ],
      "tabs": [
        "Clear Filters"
      ],
      "kpis": [
        "Status:",
        "Clear",
        "Branch Expenses Expense Category Vendor Amount Date Status Actions Open ›",
        "No expenses found matching the filter",
        "Actions"
      ],
      "tables": [
        [
          "Expense",
          "Category",
          "Vendor",
          "Amount",
          "Date",
          "Status",
          "Actions",
          "Expense ID",
          "Branch",
          "Category",
          "Vendor",
          "Amount",
          "Status",
          "Actions"
        ]
      ],
      "fields": [
        "Search expenses...",
        "Search ID, vendor, category..."
      ],
      "buttons": [
        "Add Expense",
        "Status:",
        "Clear",
        "Columns",
        "Export",
        "Open ›",
        "Clear Filters"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/finance/expenses/create",
    "name": "finance-create-expense",
    "component": "src/views/finance/CreateExpense.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 23,
    "elementInventory": {
      "headers": [
        "Expense Details Showroom Outflow",
        "Payment & Evidence Audit Compliance"
      ],
      "tabs": [],
      "kpis": [
        "/ Expenses /",
        "Expense Details Showroom Outflow Category *"
      ],
      "tables": [],
      "fields": [
        "expense-category",
        "e.g. PKR 48,500",
        "e.g. 27 Aug 2026",
        "e.g. PESCO Electric / Shell Petrol / City Landlord",
        "expense-payment-method",
        "e.g. TXN-EXP-5591",
        "e.g. Branch electricity bill / Generator oil change",
        "e.g. pescobill_aug.pdf",
        "Specific remarks for the CFO or finance auditor...",
        "Category *",
        "Amount (PKR) * (Type numbers only)",
        "Date of Expense",
        "Vendor / Payee Name *",
        "Payment Method *",
        "Bank Transaction ID / Ref *",
        "Description / Purpose",
        "Receipt / Invoice File Attachment",
        "Internal Audit Notes"
      ],
      "buttons": [
        "Cancel"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/finance/create-expense",
    "name": "finance-create-expense-alias",
    "component": "src/views/finance/CreateExpense.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 23,
    "elementInventory": {
      "headers": [
        "Expense Details Showroom Outflow",
        "Payment & Evidence Audit Compliance"
      ],
      "tabs": [],
      "kpis": [
        "/ Expenses /",
        "Expense Details Showroom Outflow Category *"
      ],
      "tables": [],
      "fields": [
        "expense-category",
        "e.g. PKR 48,500",
        "e.g. 27 Aug 2026",
        "e.g. PESCO Electric / Shell Petrol / City Landlord",
        "expense-payment-method",
        "e.g. TXN-EXP-5591",
        "e.g. Branch electricity bill / Generator oil change",
        "e.g. pescobill_aug.pdf",
        "Specific remarks for the CFO or finance auditor...",
        "Category *",
        "Amount (PKR) * (Type numbers only)",
        "Date of Expense",
        "Vendor / Payee Name *",
        "Payment Method *",
        "Bank Transaction ID / Ref *",
        "Description / Purpose",
        "Receipt / Invoice File Attachment",
        "Internal Audit Notes"
      ],
      "buttons": [
        "Cancel"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/finance/expenses/detail",
    "name": "finance-expense-detail-legacy",
    "component": "src/views/finance/ExpenseDetail.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 33,
    "elementInventory": {
      "headers": [
        "Expense",
        "Related information",
        "Expense Detail",
        "Expense Details",
        "Approval & Payment"
      ],
      "tabs": [],
      "kpis": [
        "Related information",
        "· ·"
      ],
      "tables": [],
      "fields": [],
      "buttons": [
        "Back",
        "Approve",
        "Reject"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/finance/expenses/:id",
    "name": "finance-expense-detail",
    "component": "src/views/finance/ExpenseDetail.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 33,
    "elementInventory": {
      "headers": [
        "Expense",
        "Related information",
        "Expense Detail",
        "Expense Details",
        "Approval & Payment"
      ],
      "tabs": [],
      "kpis": [
        "Related information",
        "· ·"
      ],
      "tables": [],
      "fields": [],
      "buttons": [
        "Back",
        "Approve",
        "Reject"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/finance/overview",
    "name": "finance-overview",
    "component": "src/views/finance/FinanceOverview.vue",
    "roles": [
      "SuperAdmin"
    ],
    "accessTier": "Super Admin Restricted",
    "branchScope": "Global / All Branches",
    "checkpointsCount": 3,
    "elementInventory": {
      "headers": [
        "Finance Overview",
        "Branch Contribution",
        "Cash Collections"
      ],
      "tabs": [],
      "kpis": [],
      "tables": [],
      "fields": [],
      "buttons": []
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/finance/receivables",
    "name": "finance-receivables",
    "component": "src/views/finance/Receivables.vue",
    "roles": [
      "SuperAdmin"
    ],
    "accessTier": "Super Admin Restricted",
    "branchScope": "Global / All Branches",
    "checkpointsCount": 4,
    "elementInventory": {
      "headers": [
        "Receivables"
      ],
      "tabs": [
        "Clear Filters",
        "Reset filters"
      ],
      "kpis": [
        "Clear Filters"
      ],
      "tables": [
        [
          "Customer",
          "Branch",
          "Order",
          "Total",
          "Paid",
          "Balance",
          "Due",
          "Age",
          "Action"
        ]
      ],
      "fields": [
        "Search customer, order, balance..."
      ],
      "buttons": [
        "Clear Filters",
        "Reset filters"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/finance/payables",
    "name": "finance-payables",
    "component": "src/views/finance/Payables.vue",
    "roles": [
      "SuperAdmin"
    ],
    "accessTier": "Super Admin Restricted",
    "branchScope": "Global / All Branches",
    "checkpointsCount": 4,
    "elementInventory": {
      "headers": [
        "Payables"
      ],
      "tabs": [
        "Clear Filters",
        "Reset filters"
      ],
      "kpis": [
        "Clear Filters"
      ],
      "tables": [
        [
          "Supplier",
          "Bill",
          "PO",
          "Amount",
          "Paid",
          "Outstanding",
          "Due",
          "Match",
          "Action"
        ]
      ],
      "fields": [
        "Search supplier, bill, PO..."
      ],
      "buttons": [
        "Clear Filters",
        "Reset filters"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/finance/cash-bank",
    "name": "finance-cash-bank",
    "component": "src/views/finance/CashBank.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 10,
    "elementInventory": {
      "headers": [
        "Cash / Bank",
        "Reconciliation"
      ],
      "tabs": [
        "Clear Filters",
        "Reset filters"
      ],
      "kpis": [
        "Clear Filters"
      ],
      "tables": [
        [
          "Date",
          "Account",
          "Reference",
          "Recorded",
          "Statement",
          "Difference",
          "Status",
          "Action"
        ]
      ],
      "fields": [
        "Search reference, account, date..."
      ],
      "buttons": [
        "Clear Filters",
        "Reset filters"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/communication/inbox",
    "name": "communication-inbox",
    "component": "src/views/communication/ManagementInbox.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 22,
    "elementInventory": {
      "headers": [
        "Management Inbox",
        "Conversations"
      ],
      "tabs": [
        "Clear"
      ],
      "kpis": [
        "Status:",
        "Conversations Showing conversations",
        "Status Open › No conversations found matching the filter"
      ],
      "tables": [
        [
          "Thread",
          "Linked Record",
          "From",
          "Last Message",
          "Priority",
          "Status",
          "Thread Topic",
          "Branch",
          "Linked Context",
          "From",
          "Last Message Preview",
          "Priority",
          "Action"
        ]
      ],
      "fields": [
        "Search conversations...",
        "Search thread, linked, from..."
      ],
      "buttons": [
        "New Conversation",
        "Status:",
        "Priority:",
        "Type:",
        "From:",
        "Clear",
        "Columns",
        "Export",
        "Open ›",
        "New Thread",
        "Branch:"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/communication/inbox/create",
    "name": "communication-create-conversation",
    "component": "src/views/communication/CreateConversation.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 10,
    "elementInventory": {
      "headers": [
        "Topic & Linked Record",
        "Message & Documents",
        "Conversation title is required"
      ],
      "tabs": [],
      "kpis": [
        "Branch Manager / Management Inbox /",
        "Message & Documents Initial Message / Context"
      ],
      "tables": [],
      "fields": [
        "e.g. Stock request clarification",
        "form.linkedType",
        "e.g. SR-122",
        "form.recipient",
        "form.priority",
        "Provide details or questions regarding the linked operational record...",
        "e.g. customer_requirement.pdf",
        "Conversation Title / Subject *",
        "Linked Type",
        "Linked Record ID",
        "Recipient",
        "Priority",
        "Initial Message / Context",
        "Attachment File"
      ],
      "buttons": [
        "Cancel"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/communication/inbox/detail",
    "name": "communication-inbox-detail-legacy",
    "component": "src/views/communication/ConversationDetail.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 22,
    "elementInventory": {
      "headers": [
        "Conversation Messages",
        "Attached Documents & Verification Records ()",
        "Linked Business Record Details",
        "Multi-Branch Thread Participants",
        "Upload Document Attachment"
      ],
      "tabs": [],
      "kpis": [
        "Priority:",
        "No documents attached to this conversation yet.",
        "Dispatched / In Transit"
      ],
      "tables": [
        [
          "Document Name",
          "Shared / Uploaded By",
          "Date & Time",
          "File Size & Format",
          "Operational Purpose",
          "Actions"
        ]
      ],
      "fields": [
        "Write your update or reply... (visible to all participating showroom managers and Head Office)",
        "e.g. transfer_dispatch_receipt.pdf",
        "uploadForm.scope",
        "e.g. 380 KB",
        "Reply to Multi-Branch Thread",
        "Document / File Name *",
        "Operational Purpose / Scope",
        "Simulated File Size"
      ],
      "buttons": [
        "Back to Management Inbox",
        "Attach File",
        "View",
        "Attach Document",
        "Send Reply",
        "Upload Attachment",
        "Preview",
        "Download",
        "Open &rarr;",
        "Cancel"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/communication/inbox/:id",
    "name": "communication-inbox-detail",
    "component": "src/views/communication/ConversationDetail.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 22,
    "elementInventory": {
      "headers": [
        "Conversation Messages",
        "Attached Documents & Verification Records ()",
        "Linked Business Record Details",
        "Multi-Branch Thread Participants",
        "Upload Document Attachment"
      ],
      "tabs": [],
      "kpis": [
        "Priority:",
        "No documents attached to this conversation yet.",
        "Dispatched / In Transit"
      ],
      "tables": [
        [
          "Document Name",
          "Shared / Uploaded By",
          "Date & Time",
          "File Size & Format",
          "Operational Purpose",
          "Actions"
        ]
      ],
      "fields": [
        "Write your update or reply... (visible to all participating showroom managers and Head Office)",
        "e.g. transfer_dispatch_receipt.pdf",
        "uploadForm.scope",
        "e.g. 380 KB",
        "Reply to Multi-Branch Thread",
        "Document / File Name *",
        "Operational Purpose / Scope",
        "Simulated File Size"
      ],
      "buttons": [
        "Back to Management Inbox",
        "Attach File",
        "View",
        "Attach Document",
        "Send Reply",
        "Upload Attachment",
        "Preview",
        "Download",
        "Open &rarr;",
        "Cancel"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/communication/notifications",
    "name": "communication-notifications",
    "component": "src/views/communication/Notifications.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 23,
    "elementInventory": {
      "headers": [
        "Notifications"
      ],
      "tabs": [
        "Clear",
        "Reset filters"
      ],
      "kpis": [
        "Status:",
        "Notifications Mark all read"
      ],
      "tables": [
        [
          "c.key === 'time')?.visible\" class=\"py-3 px-4\">Time",
          "c.key === 'category')?.visible\" class=\"py-3 px-4\">Category",
          "c.key === 'notification')?.visible\" class=\"py-3 px-4\">Notification",
          "c.key === 'record')?.visible\" class=\"py-3 px-4\">Record",
          "c.key === 'status')?.visible\" class=\"py-3 px-4\">Status",
          "c.key === 'action')?.visible\" class=\"py-3 px-4 text-right\">Action",
          "Time",
          "Category",
          "Notification",
          "Branch",
          "Read",
          "Action"
        ]
      ],
      "fields": [
        "Search notifications...",
        "col.visible"
      ],
      "buttons": [
        "Status:",
        "Category:",
        "Clear",
        "Columns",
        "Export",
        "Mark all read",
        "Mark Read",
        "Open",
        "Reset filters"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/analytics/reports-hub",
    "name": "analytics-reports-hub",
    "component": "src/views/analytics/ReportsHub.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 13,
    "elementInventory": {
      "headers": [
        "Reports Hub",
        "Trend",
        "Key Breakdown",
        "Saved & Recent Reports"
      ],
      "tabs": [],
      "kpis": [
        "Trend",
        "Key Breakdown Top Segment BRG E-Series"
      ],
      "tables": [
        [
          "Report",
          "Owner",
          "Scope",
          "Last Run",
          "Schedule",
          "Action"
        ]
      ],
      "fields": [],
      "buttons": [
        "Export CSV",
        "Export PDF",
        "Build Report"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/analytics/reports/build",
    "name": "analytics-build-report",
    "component": "src/views/analytics/BuildReport.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 21,
    "elementInventory": {
      "headers": [
        "Build Report",
        "Report Setup",
        "Date & Comparison",
        "Included Metrics",
        "Schedule & Delivery"
      ],
      "tabs": [],
      "kpis": [
        "Report Setup Report Title",
        "All Active Records Completed / Settled Only Pending / In Review Only",
        "Weekly Digest Monthly Full Report",
        "PDF Document (.pdf) Excel Spreadsheet (.xlsx / .csv) Interactive Dashboard View"
      ],
      "tables": [],
      "fields": [
        "Enter report title...",
        "form.category",
        "form.scope",
        "form.dateRange",
        "form.comparison",
        "form.status",
        "form.metrics.revenue",
        "form.metrics.volume",
        "form.metrics.orders",
        "form.metrics.margins",
        "form.metrics.kpi",
        "form.schedule",
        "form.format",
        "admin@ajecodrive.com",
        "Report Title",
        "Category",
        "Branch Scope",
        "Date Range",
        "Comparison Benchmark",
        "Status Filter",
        "Net Sales & Revenue Breakdown",
        "Unit Volumes & Inventory Inflow/Outflow",
        "Order & Transaction Counts",
        "Gross Profit Margins & Discounts",
        "Variance against Target Budgets",
        "Schedule Frequency",
        "Export Format",
        "Recipient Notification"
      ],
      "buttons": [
        "Cancel",
        "Generate Report"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/analytics/reports/sales",
    "name": "analytics-sales-report",
    "component": "src/views/analytics/SalesReport.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 12,
    "elementInventory": {
      "headers": [
        "Sales Report",
        "Trend ()",
        "Breakdown",
        "Detailed Report"
      ],
      "tabs": [
        "Clear Filters"
      ],
      "kpis": [
        "Trend ()",
        "Breakdown"
      ],
      "tables": [
        [
          "Branch",
          "Sales",
          "Units",
          "Orders",
          "Discount",
          "Margin"
        ]
      ],
      "fields": [],
      "buttons": [
        "Save View",
        "Schedule",
        "Export",
        "Clear Filters"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/analytics/reports/inventory",
    "name": "analytics-inventory-report",
    "component": "src/views/analytics/InventoryReport.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 12,
    "elementInventory": {
      "headers": [
        "Inventory Report",
        "Trend ()",
        "Breakdown",
        "Detailed Report"
      ],
      "tabs": [
        "Clear Filters"
      ],
      "kpis": [
        "Available Reserved Incoming Value"
      ],
      "tables": [
        [
          "Product",
          "Total",
          "Available",
          "Reserved",
          "Incoming",
          "Value"
        ]
      ],
      "fields": [],
      "buttons": [
        "Save View",
        "Schedule",
        "Export",
        "Clear Filters"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/analytics/reports/procurement",
    "name": "analytics-procurement-report",
    "component": "src/views/analytics/ProcurementReport.vue",
    "roles": [
      "SuperAdmin"
    ],
    "accessTier": "Super Admin Restricted",
    "branchScope": "Global / All Branches",
    "checkpointsCount": 8,
    "elementInventory": {
      "headers": [
        "Procurement Report",
        "Trend ()",
        "Breakdown",
        "Detailed Report"
      ],
      "tabs": [
        "Clear Filters"
      ],
      "kpis": [],
      "tables": [
        [
          "Supplier",
          "POs",
          "Received",
          "Spend",
          "Lead Time",
          "On-Time"
        ]
      ],
      "fields": [],
      "buttons": [
        "Save View",
        "Schedule",
        "Export",
        "Clear Filters"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/analytics/reports/expense",
    "name": "analytics-expense-report",
    "component": "src/views/analytics/ExpenseReport.vue",
    "roles": [
      "SuperAdmin"
    ],
    "accessTier": "Super Admin Restricted",
    "branchScope": "Global / All Branches",
    "checkpointsCount": 8,
    "elementInventory": {
      "headers": [
        "Expense Report",
        "Trend ()",
        "Breakdown",
        "Detailed Report"
      ],
      "tabs": [
        "Clear Filters"
      ],
      "kpis": [],
      "tables": [
        [
          "Category",
          "Amount",
          "Share",
          "Budget",
          "Variance"
        ]
      ],
      "fields": [],
      "buttons": [
        "Save View",
        "Schedule",
        "Export",
        "Clear Filters"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/analytics/reports/profitability",
    "name": "analytics-profitability-report",
    "component": "src/views/analytics/ProfitabilityReport.vue",
    "roles": [
      "SuperAdmin"
    ],
    "accessTier": "Super Admin Restricted",
    "branchScope": "Global / All Branches",
    "checkpointsCount": 8,
    "elementInventory": {
      "headers": [
        "Profitability Report",
        "Trend ()",
        "Breakdown",
        "Detailed Report"
      ],
      "tabs": [
        "Clear Filters"
      ],
      "kpis": [
        "Trend ()",
        "Breakdown"
      ],
      "tables": [
        [
          "Branch",
          "Sales",
          "COGS",
          "Gross Profit",
          "OpEx",
          "Net Operating Profit"
        ]
      ],
      "fields": [],
      "buttons": [
        "Save View",
        "Schedule",
        "Export",
        "Clear Filters"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/analytics/reports/crm",
    "name": "analytics-crm-report",
    "component": "src/views/analytics/CrmReport.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 12,
    "elementInventory": {
      "headers": [
        "CRM Report",
        "Trend ()",
        "Breakdown",
        "Detailed Report"
      ],
      "tabs": [
        "Clear Filters"
      ],
      "kpis": [],
      "tables": [
        [
          "Source",
          "Leads",
          "Qualified",
          "Quoted",
          "Converted",
          "Rate"
        ]
      ],
      "fields": [],
      "buttons": [
        "Save View",
        "Schedule",
        "Export",
        "Clear Filters"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/analytics/reports/branch",
    "name": "analytics-branch-report",
    "component": "src/views/analytics/BranchReport.vue",
    "roles": [
      "SuperAdmin"
    ],
    "accessTier": "Super Admin Restricted",
    "branchScope": "Global / All Branches",
    "checkpointsCount": 9,
    "elementInventory": {
      "headers": [
        "Branch Report",
        "Trend ()",
        "Breakdown",
        "Performance Breakdown"
      ],
      "tabs": [
        "Clear Filters"
      ],
      "kpis": [
        "Previous Variance"
      ],
      "tables": [
        [
          "Metric",
          "Previous",
          "Variance"
        ]
      ],
      "fields": [],
      "buttons": [
        "Save View",
        "Schedule",
        "Export",
        "Branch",
        "Clear Filters"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/system/audit-log",
    "name": "system-audit-log",
    "component": "src/views/system/AuditLog.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 12,
    "elementInventory": {
      "headers": [
        "Audit Log",
        "Audit Events",
        "Audit Event Trace",
        "Audit Record Notice"
      ],
      "tabs": [
        "Clear Filters",
        "Reset filters"
      ],
      "kpis": [
        "Total Visible Events",
        "Audit Description",
        "Return to Audit Log"
      ],
      "tables": [
        [
          "Timestamp",
          "User / Actor",
          "Role",
          "Branch",
          "Module",
          "Operation",
          "Affected Record",
          "Change / Description",
          "Action"
        ]
      ],
      "fields": [
        "User, record, operation, description..."
      ],
      "buttons": [
        "Clear Filters",
        "Reset filters",
        "Close",
        "View Source Record",
        "Return to Audit Log"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/system/audit-log/:id",
    "name": "system-audit-log-detail",
    "component": "src/views/system/AuditLog.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 12,
    "elementInventory": {
      "headers": [
        "Audit Log",
        "Audit Events",
        "Audit Event Trace",
        "Audit Record Notice"
      ],
      "tabs": [
        "Clear Filters",
        "Reset filters"
      ],
      "kpis": [
        "Total Visible Events",
        "Audit Description",
        "Return to Audit Log"
      ],
      "tables": [
        [
          "Timestamp",
          "User / Actor",
          "Role",
          "Branch",
          "Module",
          "Operation",
          "Affected Record",
          "Change / Description",
          "Action"
        ]
      ],
      "fields": [
        "User, record, operation, description..."
      ],
      "buttons": [
        "Clear Filters",
        "Reset filters",
        "Close",
        "View Source Record",
        "Return to Audit Log"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/audit-logs/:id",
    "name": "audit-log-direct-alias",
    "component": "src/views/system/AuditLog.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 12,
    "elementInventory": {
      "headers": [
        "Audit Log",
        "Audit Events",
        "Audit Event Trace",
        "Audit Record Notice"
      ],
      "tabs": [
        "Clear Filters",
        "Reset filters"
      ],
      "kpis": [
        "Total Visible Events",
        "Audit Description",
        "Return to Audit Log"
      ],
      "tables": [
        [
          "Timestamp",
          "User / Actor",
          "Role",
          "Branch",
          "Module",
          "Operation",
          "Affected Record",
          "Change / Description",
          "Action"
        ]
      ],
      "fields": [
        "User, record, operation, description..."
      ],
      "buttons": [
        "Clear Filters",
        "Reset filters",
        "Close",
        "View Source Record",
        "Return to Audit Log"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/audit-log/:id",
    "name": "audit-log-direct-alias-2",
    "component": "src/views/system/AuditLog.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 12,
    "elementInventory": {
      "headers": [
        "Audit Log",
        "Audit Events",
        "Audit Event Trace",
        "Audit Record Notice"
      ],
      "tabs": [
        "Clear Filters",
        "Reset filters"
      ],
      "kpis": [
        "Total Visible Events",
        "Audit Description",
        "Return to Audit Log"
      ],
      "tables": [
        [
          "Timestamp",
          "User / Actor",
          "Role",
          "Branch",
          "Module",
          "Operation",
          "Affected Record",
          "Change / Description",
          "Action"
        ]
      ],
      "fields": [
        "User, record, operation, description..."
      ],
      "buttons": [
        "Clear Filters",
        "Reset filters",
        "Close",
        "View Source Record",
        "Return to Audit Log"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/system/settings",
    "name": "system-settings",
    "component": "src/views/system/Settings.vue",
    "roles": [
      "SuperAdmin"
    ],
    "accessTier": "Super Admin Restricted",
    "branchScope": "Global / All Branches",
    "checkpointsCount": 61,
    "elementInventory": {
      "headers": [
        "Settings —",
        "System Settings",
        "Business Profile",
        "Branch Defaults",
        "Product Master Data",
        "Canonical Statuses",
        "Pricing Rules",
        "Payment Methods",
        "Expense Categories",
        "Approval Rules",
        "Document Numbering & Prefixes",
        "Notification Rules",
        "Data Import & Export",
        "Integrations",
        "Security Settings"
      ],
      "tabs": [],
      "kpis": [
        "Canonical Statuses"
      ],
      "tables": [
        [
          "Entity",
          "Statuses",
          "Method",
          "Active",
          "Requires Reference",
          "Category",
          "Active",
          "Approval Rule",
          "Workflow",
          "Branch Limit",
          "Above Limit",
          "Super Admin",
          "Business Document",
          "Active Prefix",
          "Next Available ID",
          "Event",
          "In-App",
          "Email",
          "Action Centre",
          "Integration",
          "Purpose",
          "Status"
        ]
      ],
      "fields": [
        "Enter business legal name...",
        "Enter primary brand or distribution...",
        "info@ajecodrive.com",
        "+92 91 588 4000",
        "https://ecodrive.com.pk",
        "NTN-7489201-3",
        "University Road, Phase 3, Peshawar, Khyber Pakhtunkhwa",
        "Asia/Karachi",
        "PKR",
        "09:00 AM - 06:00 PM",
        "PKR 100,000",
        "10%",
        "Serialized where applicable",
        "BRG-[CAT]-[MODEL]-[YEAR]",
        "3-Year Battery & Controller",
        "Fixed Selling Price · Cost + Markup",
        "15%",
        "8%",
        "num.prefix",
        "securitySettings.mfaPolicy",
        "securitySettings.sessionTimeout",
        "securitySettings.passwordPolicy",
        "Business Legal Name",
        "Brand / Distribution",
        "Official Email Address",
        "Contact Phone",
        "Website URL",
        "Tax / NTN Registration Number",
        "Head Office Physical Address",
        "Timezone",
        "Default System Currency",
        "Default Opening Hours",
        "Branch Expense Approval Limit",
        "Max Branch Discount Allowance",
        "Inventory Tracking Method",
        "Default SKU Pattern",
        "Standard Default Warranty",
        "Default Pricing Strategy",
        "Minimum Gross Margin Target",
        "Manager Approval Discount Threshold",
        "MFA Policy",
        "Session Timeout",
        "Password Policy"
      ],
      "buttons": [
        "Restore Defaults",
        "Save Changes",
        "Save Numbering"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/system/branch-team",
    "name": "system-branch-team",
    "component": "src/views/system/BranchTeam.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 19,
    "elementInventory": {
      "headers": [
        "Branch Team",
        "Branch Staff"
      ],
      "tabs": [],
      "kpis": [
        "Status:",
        "Clear",
        "No team members match the filter",
        "Active Inactive"
      ],
      "tables": [
        [
          "Team Member",
          "Role / Function",
          "Phone Contact",
          "Email Address",
          "Last Active",
          "Status",
          "Actions"
        ]
      ],
      "fields": [
        "Search staff, role, contact...",
        "e.g. Hamza Khan",
        "memberForm.role",
        "memberForm.status",
        "e.g. 0300 111 2211",
        "e.g. hamza@ecodrive.pk",
        "Full Name *",
        "Role / Function",
        "Status",
        "Phone Contact *",
        "Email Address"
      ],
      "buttons": [
        "Add Team Member",
        "Status:",
        "Clear",
        "Columns",
        "Export",
        "Cancel"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/system/account",
    "name": "system-account",
    "component": "src/views/system/Account.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 11,
    "elementInventory": {
      "headers": [
        "Account Profile",
        "Personal Profile",
        "Access & Role Information"
      ],
      "tabs": [],
      "kpis": [
        "Personal Profile Full Name",
        "Access & Role Information System Role Enforced",
        "Active Session"
      ],
      "tables": [],
      "fields": [
        "profileForm.name",
        "profileForm.email",
        "profileForm.phone",
        "profileForm.photo",
        "profileForm.contactPreference",
        "Full Name",
        "Email Address",
        "Phone Number",
        "Assigned Operating Branch",
        "System Role",
        "Profile Photo Identifier",
        "Notification Channel Preference",
        "Account Status"
      ],
      "buttons": [
        "Save Changes"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/system/security",
    "name": "system-security",
    "component": "src/views/system/SecuritySessions.vue",
    "roles": [
      "SuperAdmin"
    ],
    "accessTier": "Super Admin Restricted",
    "branchScope": "Global / All Branches",
    "checkpointsCount": 12,
    "elementInventory": {
      "headers": [
        "Security & Sessions",
        "Active Sessions"
      ],
      "tabs": [
        "Clear",
        "Reset filters"
      ],
      "kpis": [
        "Status:",
        "Active Sessions sessions"
      ],
      "tables": [
        [
          "c.key === 'session')?.visible\" class=\"py-3 px-4\">Session",
          "c.key === 'device')?.visible\" class=\"py-3 px-4\">Device",
          "c.key === 'location')?.visible\" class=\"py-3 px-4\">Location",
          "c.key === 'lastActive')?.visible\" class=\"py-3 px-4\">Last Active",
          "c.key === 'status')?.visible\" class=\"py-3 px-4\">Status"
        ]
      ],
      "fields": [
        "Search sessions...",
        "col.visible"
      ],
      "buttons": [
        "Status:",
        "Device:",
        "Location:",
        "Clear",
        "Columns",
        "Export",
        "Revoke",
        "Reset filters"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/system/preferences",
    "name": "system-preferences",
    "component": "src/views/system/Preferences.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 12,
    "elementInventory": {
      "headers": [
        "Preferences",
        "Appearance & Localization",
        "Operational Notification Preferences"
      ],
      "tabs": [
        "Comfortable Compact Dense"
      ],
      "kpis": [
        "Appearance & Localization Theme Light Dark System Default",
        "Operational Notification Preferences Inventory Alerts Enabled Disabled"
      ],
      "tables": [],
      "fields": [
        "preferencesForm.theme",
        "preferencesForm.language",
        "preferencesForm.dateFormat",
        "preferencesForm.tableDensity",
        "preferencesForm.inventoryAlerts",
        "preferencesForm.salesAlerts",
        "preferencesForm.serviceAlerts",
        "preferencesForm.managementMessages",
        "Theme",
        "Language",
        "Date Format",
        "Table Density",
        "Inventory Alerts",
        "Sales Alerts",
        "Service Alerts",
        "Management Messages"
      ],
      "buttons": [
        "Save Preferences"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/system/logout",
    "name": "system-logout",
    "component": "src/views/system/Logout.vue",
    "roles": [
      "SuperAdmin",
      "BranchManager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 3,
    "elementInventory": {
      "headers": [
        "Logout",
        "Sign out of AJ ECODRIVE?"
      ],
      "tabs": [],
      "kpis": [],
      "tables": [],
      "fields": [],
      "buttons": [
        "Cancel",
        "Sign Out"
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/:pathMatch(.*)*",
    "name": "/:pathMatch(.*)*",
    "component": "Unknown",
    "roles": [
      "Super Admin"
    ],
    "accessTier": "Super Admin Restricted",
    "branchScope": "Global / All Branches",
    "checkpointsCount": 0,
    "elementInventory": {
      "headers": [],
      "tabs": [],
      "kpis": [],
      "tables": [],
      "fields": [],
      "buttons": []
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/login",
    "name": "/login",
    "component": "Unknown",
    "roles": [
      "Super Admin",
      "Branch Manager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 5,
    "elementInventory": {
      "headers": [
        "password123",
        "(or ",
        "View Interactive Client Operations Guide (400+ Q&As)"
      ],
      "tabs": [],
      "kpis": [],
      "tables": [],
      "fields": [
        null,
        null
      ],
      "buttons": []
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/dashboard",
    "name": "/dashboard",
    "component": "Unknown",
    "roles": [
      "Super Admin",
      "Branch Manager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 36,
    "elementInventory": {
      "headers": [
        "Branch Manager Dashboard",
        "· Click to view &rsaquo;",
        "Sales Trend",
        "Branch Snapshot",
        "Click tile to open module"
      ],
      "tabs": [],
      "kpis": [
        "Units Sold",
        "Payments Collected",
        "Expenses",
        "Open Orders",
        "Available Stock",
        "Reserved",
        "Incoming",
        "Low Stock",
        "Service Cases",
        "Net Sales",
        "Purchases",
        "Operating Expenses",
        "Gross Profit",
        "Net Operating Profit",
        "Inventory Value",
        "Receivables",
        "Peshawar",
        "Islamabad",
        "Lahore",
        "Rawalpindi",
        "Salaries",
        "Rent",
        "Utilities",
        "Marketing",
        "Logistics"
      ],
      "tables": [],
      "fields": [],
      "buttons": [
        null,
        null,
        null,
        null,
        null
      ]
    },
    "status": "Verified Frontend Architecture"
  },
  {
    "route": "/dashboard",
    "name": "/dashboard",
    "component": "Unknown",
    "roles": [
      "Super Admin",
      "Branch Manager"
    ],
    "accessTier": "Shared Operational Access",
    "branchScope": "Own Branch (BM) / Global Filterable (SA)",
    "checkpointsCount": 36,
    "elementInventory": {
      "headers": [
        "Branch Manager Dashboard",
        "· Click to view &rsaquo;",
        "Sales Trend",
        "Branch Snapshot",
        "Click tile to open module"
      ],
      "tabs": [],
      "kpis": [
        "Units Sold",
        "Payments Collected",
        "Expenses",
        "Open Orders",
        "Available Stock",
        "Reserved",
        "Incoming",
        "Low Stock",
        "Service Cases",
        "Net Sales",
        "Purchases",
        "Operating Expenses",
        "Gross Profit",
        "Net Operating Profit",
        "Inventory Value",
        "Receivables",
        "Peshawar",
        "Islamabad",
        "Lahore",
        "Rawalpindi",
        "Salaries",
        "Rent",
        "Utilities",
        "Marketing",
        "Logistics"
      ],
      "tables": [],
      "fields": [],
      "buttons": [
        null,
        null,
        null,
        null,
        null
      ]
    },
    "status": "Verified Frontend Architecture"
  }
];

export const totalSystemRoutesCount = 194;
export const superAdminRoutesCount = 194;
export const branchManagerRoutesCount = 156;
export const superAdminOnlyRoutesCount = 38;

export default {
  unifiedRegistry: unifiedFrontendArchitectureRegistry,
  totalSystemRoutes: totalSystemRoutesCount,
  superAdminRoutes: superAdminRoutesCount,
  branchManagerRoutes: branchManagerRoutesCount,
  superAdminOnlyRoutes: superAdminOnlyRoutesCount
};
