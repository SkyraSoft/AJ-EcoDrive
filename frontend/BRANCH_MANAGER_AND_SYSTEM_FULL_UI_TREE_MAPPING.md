# AJ ECODRIVE — COMPLETE CODE-BASED UI TREE MAPPING SPECIFICATION

> **Source of Truth:** Codebase Route Registry (`src/router/index.js`) & Component Templates (`src/views/**/*.vue`)
> **Architecture:** Pure Code-Extracted AST Tree Format (No Prose / Direct Code Extraction)
> **Total Registered System Routes:** 189
> **Branch Manager Operational Routes:** 155
> **Restricted / Super Admin Only Routes:** 34

## 🧭 EXECUTIVE BRANCH MANAGER OPERATIONAL MODULE INDEX

| Module Code | Module Name | Route Count | Branch Manager Accessible | Primary Dealership Function |
| :--- | :--- | :---: | :---: | :--- |
| `` |  Operations | 2 | 2 / 2 | Operational Execution & Audit |
| `AUTH` | AUTH Operations | 5 | 5 / 5 | Operational Execution & Audit |
| `DASHBOARD` | DASHBOARD Operations | 5 | 3 / 5 | Operational Execution & Audit |
| `ORGANISATION` | ORGANISATION Operations | 14 | 6 / 14 | Operational Execution & Audit |
| `CATALOGUE` | CATALOGUE Operations | 19 | 9 / 19 | Operational Execution & Audit |
| `PROCUREMENT` | PROCUREMENT Operations | 22 | 17 / 22 | Operational Execution & Audit |
| `INVENTORY` | INVENTORY Operations | 35 | 35 / 35 | Operational Execution & Audit |
| `SALES` | SALES Operations | 42 | 42 / 42 | Operational Execution & Audit |
| `AFTER-SALES` | AFTER-SALES Operations | 12 | 12 / 12 | Operational Execution & Audit |
| `FINANCE` | FINANCE Operations | 9 | 6 / 9 | Operational Execution & Audit |
| `COMMUNICATION` | COMMUNICATION Operations | 5 | 5 / 5 | Operational Execution & Audit |
| `ANALYTICS` | ANALYTICS Operations | 9 | 5 / 9 | Operational Execution & Audit |
| `SYSTEM` | SYSTEM Operations | 8 | 6 / 8 | Operational Execution & Audit |
| `AUDIT-LOGS` | AUDIT-LOGS Operations | 1 | 1 / 1 | Operational Execution & Audit |
| `AUDIT-LOG` | AUDIT-LOG Operations | 1 | 1 / 1 | Operational Execution & Audit |

---

## 🌳 HIERARCHICAL SYSTEM NAVIGATION & COMPONENT UI TREE

### 📁 MODULE: `` (2 Total Routes)

#### 📍 ROUTE: `//`
- **Route Name:** `/`
- **Source Component:** [`src/layouts/AuthLayout.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/layouts/AuthLayout.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `All Authenticated`)

```text
// [/]
│
├── 🏷️ HEADERS & TITLES
│   ├── "AJ ECODRIVE"
│   └── "One secure gateway to AJ ECODRIVE operations."
└── (No secondary dialogs)
```

#### 📍 ROUTE: `//`
- **Route Name:** `/`
- **Source Component:** [`src/layouts/MainLayout.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/layouts/MainLayout.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `All Authenticated`)

```text
// [/]
│
├── 🏷️ HEADERS & TITLES
│   ├── "WORKSPACE"
│   ├── "Branch Manager"
│   └── "SIGNED IN AS"
└── (No secondary dialogs)
```

### 📁 MODULE: `AUTH` (5 Total Routes)

#### 📍 ROUTE: `/login`
- **Route Name:** `login`
- **Source Component:** [`src/views/auth/Login.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/auth/Login.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `All Authenticated`)

```text
/login [login]
│
├── 🏷️ HEADERS & TITLES
│   ├── "password123"
│   ├── "(or "password")"
│   └── "View Interactive Client Operations Guide (400+ Q&As)"
├── 📝 FORM FIELDS & INPUT CONTROLS (2 fields)
│   ├── [FIELD] "branchCode"
│   └── [FIELD] "password"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/forgot-password`
- **Route Name:** `forgot-password`
- **Source Component:** [`src/views/auth/ForgotPassword.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/auth/ForgotPassword.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `All Authenticated`)

```text
/forgot-password [forgot-password]
│
├── 📝 FORM FIELDS & INPUT CONTROLS (1 fields)
│   └── [FIELD] "email"
├── ⚡ ACTION BUTTONS & TRIGGERS (1 buttons)
│   └── [BUTTON] "Back to Login"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/verify-identity`
- **Route Name:** `verify-identity`
- **Source Component:** [`src/views/auth/VerifyIdentity.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/auth/VerifyIdentity.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `All Authenticated`)

```text
/verify-identity [verify-identity]
│
├── 🏷️ HEADERS & TITLES
│   └── "Code expires in 10 minutes"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/create-new-password`
- **Route Name:** `create-new-password`
- **Source Component:** [`src/views/auth/CreateNewPassword.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/auth/CreateNewPassword.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `All Authenticated`)

```text
/create-new-password [create-new-password]
│
├── 📝 FORM FIELDS & INPUT CONTROLS (2 fields)
│   ├── [FIELD] "newPassword"
│   └── [FIELD] "confirmPassword"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/password-updated`
- **Route Name:** `password-updated`
- **Source Component:** [`src/views/auth/PasswordUpdated.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/auth/PasswordUpdated.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `All Authenticated`)

```text
/password-updated [password-updated]
│
├── ⚡ ACTION BUTTONS & TRIGGERS (1 buttons)
│   └── [BUTTON] "Continue to Login"
└── (No secondary dialogs)
```

### 📁 MODULE: `DASHBOARD` (5 Total Routes)

#### 📍 ROUTE: `/dashboard`
- **Route Name:** `dashboard`
- **Source Component:** [`src/views/dashboard/SuperAdminDashboard.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/dashboard/SuperAdminDashboard.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/dashboard [dashboard]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Branch Manager Dashboard"
│   ├── "· Click to view &rsaquo;"
│   ├── "Sales Trend"
│   ├── "Branch Snapshot"
│   └── "Click tile to open module"
├── 📊 SNAPSHOT METRICS & KPI CARDS (25 cards)
│   ├── [KPI CARD] Units Sold ➔ '7'
│   ├── [KPI CARD] Payments Collected ➔ 'PKR 710K'
│   ├── [KPI CARD] Expenses ➔ 'PKR 42K'
│   ├── [KPI CARD] Open Orders ➔ String(openOrdersCount)
│   ├── [KPI CARD] Available Stock ➔ String(stats.available || 48)
│   ├── [KPI CARD] Reserved ➔ String(stats.reserved || 7)
│   ├── [KPI CARD] Incoming ➔ String(incomingCount)
│   ├── [KPI CARD] Low Stock ➔ `${lowStockCount
│   ├── [KPI CARD] Service Cases ➔ `${serviceCasesCount
│   ├── [KPI CARD] Net Sales ➔ 'PKR 28.4M'
│   ├── [KPI CARD] Purchases ➔ 'PKR 14.6M'
│   ├── [KPI CARD] Operating Expenses ➔ 'PKR 3.2M'
│   ├── [KPI CARD] Gross Profit ➔ 'PKR 6.9M'
│   ├── [KPI CARD] Net Operating Profit ➔ 'PKR 3.7M'
│   ├── [KPI CARD] Inventory Value ➔ 'PKR 41.8M'
│   ├── [KPI CARD] Receivables ➔ 'PKR 2.9M'
│   ├── [KPI CARD] Peshawar ➔ 92
│   ├── [KPI CARD] Islamabad ➔ 78
│   ├── [KPI CARD] Lahore ➔ 64
│   ├── [KPI CARD] Rawalpindi ➔ 51
│   ├── [KPI CARD] Salaries ➔ 84
│   ├── [KPI CARD] Rent ➔ 61
│   ├── [KPI CARD] Utilities ➔ 43
│   ├── [KPI CARD] Marketing ➔ 31
│   └── [KPI CARD] Logistics ➔ 27
├── 📋 DATA TABLES & GRID COLUMNS (1 tables)
│   ├── [TABLE 1] Columns:
│   │   ├── [COL] "Priority"
│   │   ├── [COL] "Item"
│   │   ├── [COL] "Record"
│   │   ├── [COL] "Status"
│   │   └── [COL] "Action"
├── ⚡ ACTION BUTTONS & TRIGGERS (5 buttons)
│   ├── [BUTTON] "View Full Action Centre &rsaquo;"
│   ├── [BUTTON] "Open"
│   ├── [BUTTON] "View All &rsaquo;"
│   ├── [BUTTON] "Action Centre &rsaquo;"
│   └── [BUTTON] "Open Tasks &rsaquo;"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/dashboard/branch-performance`
- **Route Name:** `branch-performance`
- **Source Component:** [`src/views/dashboard/BranchPerformance.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/dashboard/BranchPerformance.vue)
- **RBAC Access:** 🔒 **[Role Restricted / Super Admin Only]** (Roles: `Super Admin`)

```text
/dashboard/branch-performance [branch-performance]
│
├── 🏷️ HEADERS & TITLES
│   ├── "My Branch Performance"
│   ├── "Target vs Actual"
│   ├── "Performance Indicators"
│   ├── "Gross Profit"
│   └── "PKR 1.76M"
├── 📊 SNAPSHOT METRICS & KPI CARDS (11 cards)
│   ├── [KPI CARD] Period Sales ➔ 'PKR 8.7M'
│   ├── [KPI CARD] Units Sold ➔ '31'
│   ├── [KPI CARD] Operating Expenses ➔ 'PKR 482K'
│   ├── [KPI CARD] Net Operating Profit ➔ 'PKR 1.28M'
│   ├── [KPI CARD] Organisation Sales ➔ 'PKR 28.4M'
│   ├── [KPI CARD] Gross Profit ➔ 'PKR 6.9M'
│   ├── [KPI CARD] Net Profit ➔ 'PKR 3.7M'
│   ├── [KPI CARD] Peshawar ➔ 94
│   ├── [KPI CARD] Islamabad ➔ 81
│   ├── [KPI CARD] Lahore ➔ 68
│   └── [KPI CARD] Rawalpindi ➔ 55
├── 📋 DATA TABLES & GRID COLUMNS (1 tables)
│   ├── [TABLE 1] Columns:
│   │   ├── [COL] "Branch"
│   │   ├── [COL] "Sales"
│   │   ├── [COL] "COGS"
│   │   ├── [COL] "Gross Profit"
│   │   ├── [COL] "OpEx"
│   │   ├── [COL] "Net Profit"
│   │   ├── [COL] "Units"
│   │   ├── [COL] "Margin"
│   │   ├── [COL] "Inventory"
│   │   └── [COL] "Action"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/dashboard/business-performance`
- **Route Name:** `business-performance`
- **Source Component:** [`src/views/dashboard/BusinessPerformance.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/dashboard/BusinessPerformance.vue)
- **RBAC Access:** 🔒 **[Role Restricted / Super Admin Only]** (Roles: `Super Admin`)

```text
/dashboard/business-performance [business-performance]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Business Performance"
│   ├── "Profitability Trend"
│   ├── "Branch Contribution"
│   ├── "Top Products"
│   └── "Top Categories"
├── 📊 SNAPSHOT METRICS & KPI CARDS (12 cards)
│   ├── [KPI CARD] Revenue ➔ 'PKR 28.4M'
│   ├── [KPI CARD] Purchases ➔ 'PKR 14.6M'
│   ├── [KPI CARD] COGS ➔ 'PKR 16.7M'
│   ├── [KPI CARD] Expenses ➔ 'PKR 3.2M'
│   ├── [KPI CARD] Gross Profit ➔ 'PKR 6.9M'
│   ├── [KPI CARD] Net Operating Profit ➔ 'PKR 3.7M'
│   ├── [KPI CARD] Margin ➔ '13.0%'
│   ├── [KPI CARD] Collections ➔ 'PKR 25.5M'
│   ├── [KPI CARD] Peshawar ➔ 35
│   ├── [KPI CARD] Islamabad ➔ 27
│   ├── [KPI CARD] Lahore ➔ 22
│   └── [KPI CARD] Rawalpindi ➔ 16
├── 📋 DATA TABLES & GRID COLUMNS (2 tables)
│   ├── [TABLE 1] Columns:
│   │   ├── [COL] "Product"
│   │   ├── [COL] "Revenue"
│   │   ├── [COL] "Units"
│   │   └── [COL] "Margin"
│   ├── [TABLE 2] Columns:
│   │   ├── [COL] "Category"
│   │   ├── [COL] "Revenue"
│   │   ├── [COL] "Gross Profit"
│   │   └── [COL] "Share"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/dashboard/action-centre`
- **Route Name:** `action-centre`
- **Source Component:** [`src/views/dashboard/ActionCentre.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/dashboard/ActionCentre.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/dashboard/action-centre [action-centre]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Action Centre"
│   ├── "Pending Actions"
│   ├── "Action Required"
│   ├── "Critical Priority"
│   └── "High Severity"
├── 📑 NAVIGATION TABS & FILTER PILLS (2 tabs)
│   ├── [TAB] "Reset"
│   └── [TAB] "Clear all filters"
├── 📋 DATA TABLES & GRID COLUMNS (1 tables)
│   ├── [TABLE 1] Columns:
│   │   ├── [COL] "Priority"
│   │   ├── [COL] "Type"
│   │   ├── [COL] "Action Description"
│   │   ├── [COL] "Branch / Source"
│   │   ├── [COL] "Linked Ref"
│   │   ├── [COL] "Due"
│   │   ├── [COL] "Status"
│   │   └── [COL] "Treatment"
├── 📝 FORM FIELDS & INPUT CONTROLS (30 fields)
│   ├── [FIELD] "searchQuery"
│   ├── [FIELD] "actionForm.title"
│   ├── [FIELD] "actionForm.priority"
│   ├── [FIELD] "actionForm.pricing.customerName"
│   ├── [FIELD] "actionForm.pricing.customerContact"
│   ├── [FIELD] "actionForm.pricing.modelName"
│   ├── [FIELD] "actionForm.pricing.orderRef"
│   ├── [FIELD] "actionForm.pricing.competitorContext"
│   ├── [FIELD] "actionForm.stock.originBranch"
│   ├── [FIELD] "actionForm.stock.destinationBranch"
│   ├── [FIELD] "actionForm.stock.modelName"
│   ├── [FIELD] "actionForm.stock.chassisVins"
│   ├── [FIELD] "actionForm.stock.linkedBookingRef"
│   ├── [FIELD] "actionForm.stock.logisticsCarrier"
│   ├── [FIELD] "actionForm.stock.urgencyReason"
│   ├── [FIELD] "actionForm.expense.expenseCategory"
│   ├── [FIELD] "actionForm.expense.payeeVendor"
│   ├── [FIELD] "actionForm.expense.vendorNtn"
│   ├── [FIELD] "actionForm.expense.paymentMethod"
│   ├── [FIELD] "actionForm.expense.invoiceRef"
│   ├── [FIELD] "actionForm.expense.operationalEmergencyJustification"
│   ├── [FIELD] "actionForm.warranty.customerName"
│   ├── [FIELD] "actionForm.warranty.vehicleVin"
│   ├── [FIELD] "actionForm.warranty.defectComponent"
│   ├── [FIELD] "actionForm.warranty.diagnosticCode"
│   ├── [FIELD] "actionForm.warranty.replacementSkuNeeded"
│   ├── [FIELD] "actionForm.warranty.technicianFindings"
│   ├── [FIELD] "actionForm.governance.affectedVinOrSku"
│   ├── [FIELD] "actionForm.governance.modelName"
│   └── [FIELD] "actionForm.governance.rootCauseClassification"
├── ⚡ ACTION BUTTONS & TRIGGERS (10 buttons)
│   ├── [BUTTON] "Export Queue"
│   ├── [BUTTON] "Treat / Inspect &rarr;"
│   ├── [BUTTON] "&larr; Back to Categories"
│   ├── [BUTTON] "Cancel"
│   ├── [BUTTON] "Submit Action Request"
│   ├── [BUTTON] "Apply Cap"
│   ├── [BUTTON] "Open Source Document"
│   ├── [BUTTON] "Counter-Offer / Cap"
│   ├── [BUTTON] "Reject Waiver"
│   └── [BUTTON] "Approve Full Discount"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/dashboard/quick-actions`
- **Route Name:** `quick-actions`
- **Source Component:** [`src/views/dashboard/QuickActions.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/dashboard/QuickActions.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/dashboard/quick-actions [quick-actions]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Quick Actions"
│   ├── "Showroom Quick Actions"
│   ├── "Commercial & Sales Actions"
│   ├── "5 Actions"
│   └── "Instant"
└── (No secondary dialogs)
```

### 📁 MODULE: `ORGANISATION` (14 Total Routes)

#### 📍 ROUTE: `/organisation/branches`
- **Route Name:** `organisation-branches`
- **Source Component:** [`src/views/organisation/Branches.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/organisation/Branches.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/organisation/branches [organisation-branches]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Branches"
│   ├── "Add Branch"
│   └── "Archive branch?"
├── 📑 NAVIGATION TABS & FILTER PILLS (2 tabs)
│   ├── [TAB] "Clear Filters"
│   └── [TAB] "Reset filters"
├── 📊 SNAPSHOT METRICS & KPI CARDS (4 cards)
│   ├── [KPI CARD] Total Branches ➔ String(total)
│   ├── [KPI CARD] Active ➔ String(activeCount)
│   ├── [KPI CARD] Inactive ➔ String(inactiveCount)
│   └── [KPI CARD] This Month Sales ➔ 'PKR 28.4M'
├── 📋 DATA TABLES & GRID COLUMNS (1 tables)
│   ├── [TABLE 1] Columns:
│   │   ├── [COL] "Branch"
│   │   ├── [COL] "Code"
│   │   ├── [COL] "City"
│   │   ├── [COL] "Manager"
│   │   ├── [COL] "Sales"
│   │   ├── [COL] "Inventory"
│   │   ├── [COL] "Expenses"
│   │   ├── [COL] "Net Profit"
│   │   ├── [COL] "Status"
│   │   └── [COL] "Actions"
├── 📝 FORM FIELDS & INPUT CONTROLS (1 fields)
│   └── [FIELD] "searchQuery"
├── ⚡ ACTION BUTTONS & TRIGGERS (3 buttons)
│   ├── [BUTTON] "Add Branch"
│   ├── [BUTTON] "Cancel"
│   └── [BUTTON] "Archive branch"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/organisation/branches/create`
- **Route Name:** `organisation-create-branch`
- **Source Component:** [`src/views/organisation/CreateBranch.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/organisation/CreateBranch.vue)
- **RBAC Access:** 🔒 **[Role Restricted / Super Admin Only]** (Roles: `Super Admin`)

```text
/organisation/branches/create [organisation-create-branch]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Create Branch"
│   ├── "1. Branch Identity"
│   ├── "2. Location & Contact"
│   ├── "3. Management & Operations"
│   └── "4. Controls & Policies"
├── 📝 FORM FIELDS & INPUT CONTROLS (15 fields)
│   ├── [FIELD] "form.name"
│   ├── [FIELD] "form.code"
│   ├── [FIELD] "form.status"
│   ├── [FIELD] "form.address"
│   ├── [FIELD] "form.city"
│   ├── [FIELD] "form.area"
│   ├── [FIELD] "form.phone"
│   ├── [FIELD] "form.email"
│   ├── [FIELD] "form.manager"
│   ├── [FIELD] "form.hours"
│   ├── [FIELD] "form.defaultLocation"
│   ├── [FIELD] "form.expenseLimit"
│   ├── [FIELD] "form.discountLimit"
│   ├── [FIELD] "form.salesRules"
│   └── [FIELD] "form.notes"
├── ⚡ ACTION BUTTONS & TRIGGERS (2 buttons)
│   ├── [BUTTON] "Cancel"
│   └── [BUTTON] "Create Branch"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/organisation/branches/edit`
- **Route Name:** `organisation-edit-branch-legacy`
- **Source Component:** [`src/views/organisation/EditBranch.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/organisation/EditBranch.vue)
- **RBAC Access:** 🔒 **[Role Restricted / Super Admin Only]** (Roles: `Super Admin`)

```text
/organisation/branches/edit [organisation-edit-branch-legacy]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Edit Branch"
│   ├── "1. Identity"
│   ├── "2. Location & Contact"
│   ├── "3. Manager & Operations"
│   └── "4. Controls & Policies"
├── 📝 FORM FIELDS & INPUT CONTROLS (15 fields)
│   ├── [FIELD] "branchData.name"
│   ├── [FIELD] "branchData.code"
│   ├── [FIELD] "branchData.status"
│   ├── [FIELD] "branchData.address"
│   ├── [FIELD] "branchData.city"
│   ├── [FIELD] "branchData.area"
│   ├── [FIELD] "branchData.phone"
│   ├── [FIELD] "branchData.email"
│   ├── [FIELD] "branchData.manager"
│   ├── [FIELD] "branchData.defaultLocation"
│   ├── [FIELD] "branchData.hours"
│   ├── [FIELD] "branchData.expenseLimit"
│   ├── [FIELD] "branchData.discountLimit"
│   ├── [FIELD] "branchData.salesRules"
│   └── [FIELD] "branchData.changeNote"
├── ⚡ ACTION BUTTONS & TRIGGERS (2 buttons)
│   ├── [BUTTON] "Cancel"
│   └── [BUTTON] "Save Changes"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/organisation/branches/edit/:id`
- **Route Name:** `organisation-edit-branch`
- **Source Component:** [`src/views/organisation/EditBranch.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/organisation/EditBranch.vue)
- **RBAC Access:** 🔒 **[Role Restricted / Super Admin Only]** (Roles: `Super Admin`)

```text
/organisation/branches/edit/:id [organisation-edit-branch]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Edit Branch"
│   ├── "1. Identity"
│   ├── "2. Location & Contact"
│   ├── "3. Manager & Operations"
│   └── "4. Controls & Policies"
├── 📝 FORM FIELDS & INPUT CONTROLS (15 fields)
│   ├── [FIELD] "branchData.name"
│   ├── [FIELD] "branchData.code"
│   ├── [FIELD] "branchData.status"
│   ├── [FIELD] "branchData.address"
│   ├── [FIELD] "branchData.city"
│   ├── [FIELD] "branchData.area"
│   ├── [FIELD] "branchData.phone"
│   ├── [FIELD] "branchData.email"
│   ├── [FIELD] "branchData.manager"
│   ├── [FIELD] "branchData.defaultLocation"
│   ├── [FIELD] "branchData.hours"
│   ├── [FIELD] "branchData.expenseLimit"
│   ├── [FIELD] "branchData.discountLimit"
│   ├── [FIELD] "branchData.salesRules"
│   └── [FIELD] "branchData.changeNote"
├── ⚡ ACTION BUTTONS & TRIGGERS (2 buttons)
│   ├── [BUTTON] "Cancel"
│   └── [BUTTON] "Save Changes"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/organisation/branches/detail`
- **Route Name:** `organisation-branch-detail-legacy`
- **Source Component:** [`src/views/organisation/BranchDetail.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/organisation/BranchDetail.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/organisation/branches/detail [organisation-branch-detail-legacy]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Peshawar Branch"
│   ├── "Net Sales"
│   ├── "PKR 9.8M"
│   ├── "+14.2%"
│   └── "Units Sold"
├── 📑 NAVIGATION TABS & FILTER PILLS (11 tabs)
│   ├── [TAB] "Overview"
│   ├── [TAB] "Performance"
│   ├── [TAB] "Inventory"
│   ├── [TAB] "Sales"
│   ├── [TAB] "Procurement & Inbound"
│   ├── [TAB] "Expenses"
│   ├── [TAB] "Customers"
│   ├── [TAB] "Team"
│   ├── [TAB] "Communication"
│   ├── [TAB] "Documents"
│   └── [TAB] "Activity"
├── ⚡ ACTION BUTTONS & TRIGGERS (2 buttons)
│   ├── [BUTTON] "Edit Branch"
│   └── [BUTTON] "More"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/organisation/branches/:id`
- **Route Name:** `organisation-branch-detail`
- **Source Component:** [`src/views/organisation/BranchDetail.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/organisation/BranchDetail.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/organisation/branches/:id [organisation-branch-detail]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Peshawar Branch"
│   ├── "Net Sales"
│   ├── "PKR 9.8M"
│   ├── "+14.2%"
│   └── "Units Sold"
├── 📑 NAVIGATION TABS & FILTER PILLS (11 tabs)
│   ├── [TAB] "Overview"
│   ├── [TAB] "Performance"
│   ├── [TAB] "Inventory"
│   ├── [TAB] "Sales"
│   ├── [TAB] "Procurement & Inbound"
│   ├── [TAB] "Expenses"
│   ├── [TAB] "Customers"
│   ├── [TAB] "Team"
│   ├── [TAB] "Communication"
│   ├── [TAB] "Documents"
│   └── [TAB] "Activity"
├── ⚡ ACTION BUTTONS & TRIGGERS (2 buttons)
│   ├── [BUTTON] "Edit Branch"
│   └── [BUTTON] "More"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/organisation/users`
- **Route Name:** `organisation-users`
- **Source Component:** [`src/views/organisation/UsersAccess.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/organisation/UsersAccess.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/organisation/users [organisation-users]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Users & Access"
│   └── "Add User"
├── 📑 NAVIGATION TABS & FILTER PILLS (2 tabs)
│   ├── [TAB] "Clear Filters"
│   └── [TAB] "Reset filters"
├── 📊 SNAPSHOT METRICS & KPI CARDS (4 cards)
│   ├── [KPI CARD] Users ➔ String(total)
│   ├── [KPI CARD] Active ➔ String(activeCount)
│   ├── [KPI CARD] Pending Invite ➔ String(pendingCount)
│   └── [KPI CARD] MFA Enabled ➔ String(mfaCount)
├── 📋 DATA TABLES & GRID COLUMNS (1 tables)
│   ├── [TABLE 1] Columns:
│   │   ├── [COL] "User"
│   │   ├── [COL] "Role"
│   │   ├── [COL] "Branch"
│   │   ├── [COL] "MFA"
│   │   ├── [COL] "Last Login"
│   │   ├── [COL] "Status"
│   │   └── [COL] "Actions"
├── 📝 FORM FIELDS & INPUT CONTROLS (1 fields)
│   └── [FIELD] "searchQuery"
├── ⚡ ACTION BUTTONS & TRIGGERS (1 buttons)
│   └── [BUTTON] "Add User"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/organisation/users/create`
- **Route Name:** `organisation-create-user`
- **Source Component:** [`src/views/organisation/CreateUser.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/organisation/CreateUser.vue)
- **RBAC Access:** 🔒 **[Role Restricted / Super Admin Only]** (Roles: `Super Admin`)

```text
/organisation/users/create [organisation-create-user]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Add User"
│   ├── "1. User Identity"
│   ├── "2. Role & Scope"
│   ├── "3. Security & Access"
│   └── "4. Permissions Scope"
├── 📝 FORM FIELDS & INPUT CONTROLS (8 fields)
│   ├── [FIELD] "form.name"
│   ├── [FIELD] "form.email"
│   ├── [FIELD] "form.mobile"
│   ├── [FIELD] "form.role"
│   ├── [FIELD] "form.branch"
│   ├── [FIELD] "form.status"
│   ├── [FIELD] "form.mfa"
│   └── [FIELD] "form.sessionPolicy"
├── ⚡ ACTION BUTTONS & TRIGGERS (2 buttons)
│   ├── [BUTTON] "Cancel"
│   └── [BUTTON] "Create User & Send Invite"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/organisation/users/edit`
- **Route Name:** `organisation-edit-user-legacy`
- **Source Component:** [`src/views/organisation/EditUser.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/organisation/EditUser.vue)
- **RBAC Access:** 🔒 **[Role Restricted / Super Admin Only]** (Roles: `Super Admin`)

```text
/organisation/users/edit [organisation-edit-user-legacy]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Edit User"
│   ├── "1. User Identity"
│   ├── "2. Role & Scope"
│   ├── "3. Security & Access"
│   └── "4. Permissions Scope"
├── 📝 FORM FIELDS & INPUT CONTROLS (8 fields)
│   ├── [FIELD] "userData.name"
│   ├── [FIELD] "userData.email"
│   ├── [FIELD] "userData.mobile"
│   ├── [FIELD] "userData.role"
│   ├── [FIELD] "userData.branch"
│   ├── [FIELD] "userData.status"
│   ├── [FIELD] "userData.mfa"
│   └── [FIELD] "userData.sessionPolicy"
├── ⚡ ACTION BUTTONS & TRIGGERS (2 buttons)
│   ├── [BUTTON] "Cancel"
│   └── [BUTTON] "Save Changes"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/organisation/users/edit/:id`
- **Route Name:** `organisation-edit-user`
- **Source Component:** [`src/views/organisation/EditUser.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/organisation/EditUser.vue)
- **RBAC Access:** 🔒 **[Role Restricted / Super Admin Only]** (Roles: `Super Admin`)

```text
/organisation/users/edit/:id [organisation-edit-user]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Edit User"
│   ├── "1. User Identity"
│   ├── "2. Role & Scope"
│   ├── "3. Security & Access"
│   └── "4. Permissions Scope"
├── 📝 FORM FIELDS & INPUT CONTROLS (8 fields)
│   ├── [FIELD] "userData.name"
│   ├── [FIELD] "userData.email"
│   ├── [FIELD] "userData.mobile"
│   ├── [FIELD] "userData.role"
│   ├── [FIELD] "userData.branch"
│   ├── [FIELD] "userData.status"
│   ├── [FIELD] "userData.mfa"
│   └── [FIELD] "userData.sessionPolicy"
├── ⚡ ACTION BUTTONS & TRIGGERS (2 buttons)
│   ├── [BUTTON] "Cancel"
│   └── [BUTTON] "Save Changes"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/organisation/users/detail`
- **Route Name:** `organisation-user-detail-legacy`
- **Source Component:** [`src/views/organisation/UserDetail.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/organisation/UserDetail.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/organisation/users/detail [organisation-user-detail-legacy]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Ahsan Khan"
│   ├── "Profile"
│   ├── "Full Name"
│   ├── "Email"
│   └── "ahsan@ajecodrive.com"
├── 📑 NAVIGATION TABS & FILTER PILLS (6 tabs)
│   ├── [TAB] "Profile"
│   ├── [TAB] "Role & Permissions"
│   ├── [TAB] "Assigned Branch"
│   ├── [TAB] "Sessions"
│   ├── [TAB] "Security"
│   └── [TAB] "Activity"
├── ⚡ ACTION BUTTONS & TRIGGERS (2 buttons)
│   ├── [BUTTON] "Edit User"
│   └── [BUTTON] "More"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/organisation/users/:id`
- **Route Name:** `organisation-user-detail`
- **Source Component:** [`src/views/organisation/UserDetail.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/organisation/UserDetail.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/organisation/users/:id [organisation-user-detail]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Ahsan Khan"
│   ├── "Profile"
│   ├── "Full Name"
│   ├── "Email"
│   └── "ahsan@ajecodrive.com"
├── 📑 NAVIGATION TABS & FILTER PILLS (6 tabs)
│   ├── [TAB] "Profile"
│   ├── [TAB] "Role & Permissions"
│   ├── [TAB] "Assigned Branch"
│   ├── [TAB] "Sessions"
│   ├── [TAB] "Security"
│   └── [TAB] "Activity"
├── ⚡ ACTION BUTTONS & TRIGGERS (2 buttons)
│   ├── [BUTTON] "Edit User"
│   └── [BUTTON] "More"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/organisation/roles`
- **Route Name:** `organisation-roles`
- **Source Component:** [`src/views/organisation/RolesPermissions.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/organisation/RolesPermissions.vue)
- **RBAC Access:** 🔒 **[Role Restricted / Super Admin Only]** (Roles: `Super Admin`)

```text
/organisation/roles [organisation-roles]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Roles & Permissions"
│   ├── "Create Role"
│   ├── "Roles"
│   ├── "Permission Model"
│   └── "Role Scope"
├── 📋 DATA TABLES & GRID COLUMNS (2 tables)
│   ├── [TABLE 1] Columns:
│   │   ├── [COL] "Role"
│   │   ├── [COL] "Users"
│   │   ├── [COL] "Scope"
│   │   ├── [COL] "Status"
│   │   └── [COL] "Action"
│   ├── [TABLE 2] Columns:
│   │   ├── [COL] "Module"
│   │   ├── [COL] "View"
│   │   ├── [COL] "Create"
│   │   ├── [COL] "Edit"
│   │   ├── [COL] "Approve"
│   │   └── [COL] "Export"
├── 📝 FORM FIELDS & INPUT CONTROLS (1 fields)
│   └── [FIELD] "searchQuery"
├── ⚡ ACTION BUTTONS & TRIGGERS (1 buttons)
│   └── [BUTTON] "Create Role"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/organisation/roles/create`
- **Route Name:** `organisation-create-role`
- **Source Component:** [`src/views/organisation/CreateRole.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/organisation/CreateRole.vue)
- **RBAC Access:** 🔒 **[Role Restricted / Super Admin Only]** (Roles: `Super Admin`)

```text
/organisation/roles/create [organisation-create-role]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Create / Edit Role"
│   ├── "Role Details"
│   └── "Module Permissions"
├── 📋 DATA TABLES & GRID COLUMNS (1 tables)
│   ├── [TABLE 1] Columns:
│   │   ├── [COL] "Module"
│   │   ├── [COL] "View"
│   │   ├── [COL] "Create"
│   │   ├── [COL] "Edit"
│   │   ├── [COL] "Approve"
│   │   └── [COL] "Export"
├── 📝 FORM FIELDS & INPUT CONTROLS (3 fields)
│   ├── [FIELD] "roleName"
│   ├── [FIELD] "scope"
│   └── [FIELD] "description"
├── ⚡ ACTION BUTTONS & TRIGGERS (3 buttons)
│   ├── [BUTTON] "Grant All Access"
│   ├── [BUTTON] "Cancel"
│   └── [BUTTON] "Save Role"
└── (No secondary dialogs)
```

### 📁 MODULE: `CATALOGUE` (19 Total Routes)

#### 📍 ROUTE: `/catalogue/categories`
- **Route Name:** `catalogue-categories`
- **Source Component:** [`src/views/catalogue/Categories.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/catalogue/Categories.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/catalogue/categories [catalogue-categories]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Categories"
│   ├── "Add Category"
│   ├── "Category Hierarchy"
│   └── "Specification Templates"
├── 📑 NAVIGATION TABS & FILTER PILLS (2 tabs)
│   ├── [TAB] "Clear Filters"
│   └── [TAB] "Reset filters"
├── 📊 SNAPSHOT METRICS & KPI CARDS (4 cards)
│   ├── [KPI CARD] Categories ➔ '8'
│   ├── [KPI CARD] Subcategories ➔ '23'
│   ├── [KPI CARD] Active Products ➔ '126'
│   └── [KPI CARD] Archived ➔ '4'
├── 📋 DATA TABLES & GRID COLUMNS (1 tables)
│   ├── [TABLE 1] Columns:
│   │   ├── [COL] "Category"
│   │   ├── [COL] "Subcategories"
│   │   ├── [COL] "Products"
│   │   ├── [COL] "Template"
│   │   ├── [COL] "Status"
│   │   └── [COL] "Actions"
├── 📝 FORM FIELDS & INPUT CONTROLS (1 fields)
│   └── [FIELD] "searchQuery"
├── ⚡ ACTION BUTTONS & TRIGGERS (1 buttons)
│   └── [BUTTON] "Add Category"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/catalogue/categories/create`
- **Route Name:** `catalogue-create-category`
- **Source Component:** [`src/views/catalogue/CreateCategory.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/catalogue/CreateCategory.vue)
- **RBAC Access:** 🔒 **[Role Restricted / Super Admin Only]** (Roles: `Super Admin`)

```text
/catalogue/categories/create [catalogue-create-category]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Create Category"
│   ├── "1. Category Details"
│   └── "2. Hierarchy & Templates"
├── 📝 FORM FIELDS & INPUT CONTROLS (2 fields)
│   ├── [FIELD] "e.g. Electric Bikes"
│   └── [FIELD] "e.g. E-BIKE"
├── ⚡ ACTION BUTTONS & TRIGGERS (2 buttons)
│   ├── [BUTTON] "Cancel"
│   └── [BUTTON] "Create Category"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/catalogue/products`
- **Route Name:** `catalogue-products`
- **Source Component:** [`src/views/catalogue/Products.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/catalogue/Products.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/catalogue/products [catalogue-products]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Products"
│   ├── "Columns"
│   ├── "Export"
│   ├── "Branch Product Catalogue"
│   └── "Create Product"
├── 📑 NAVIGATION TABS & FILTER PILLS (8 tabs)
│   ├── [TAB] "Clear"
│   ├── [TAB] "Clear all filters"
│   ├── [TAB] "Clear Filters"
│   ├── [TAB] "Clear filters"
│   ├── [TAB] "All Categories"
│   ├── [TAB] "Electric Bikes"
│   ├── [TAB] "Cargo"
│   └── [TAB] "Scooters"
├── 📊 SNAPSHOT METRICS & KPI CARDS (7 cards)
│   ├── [KPI CARD] Active Products ➔ '38'
│   ├── [KPI CARD] Available Units ➔ '46'
│   ├── [KPI CARD] Reserved ➔ '7'
│   ├── [KPI CARD] Low Stock ➔ '6'
│   ├── [KPI CARD] Products ➔ '134'
│   ├── [KPI CARD] Active ➔ '126'
│   └── [KPI CARD] Draft ➔ '4'
├── 📋 DATA TABLES & GRID COLUMNS (2 tables)
│   ├── [TABLE 1] Columns:
│   │   ├── [COL] "Product"
│   │   ├── [COL] "SKU"
│   │   ├── [COL] "Category"
│   │   ├── [COL] "Selling Price"
│   │   ├── [COL] "Available"
│   │   ├── [COL] "Reserved"
│   │   ├── [COL] "Incoming"
│   │   ├── [COL] "Status"
│   │   └── [COL] "Actions"
│   ├── [TABLE 2] Columns:
│   │   ├── [COL] "Product"
│   │   ├── [COL] "SKU"
│   │   ├── [COL] "Category"
│   │   ├── [COL] "Selling Price"
│   │   ├── [COL] "Total"
│   │   ├── [COL] "Available"
│   │   ├── [COL] "Reserved"
│   │   ├── [COL] "Incoming"
│   │   ├── [COL] "Low Stock"
│   │   ├── [COL] "Status"
│   │   └── [COL] "Actions"
├── 📝 FORM FIELDS & INPUT CONTROLS (2 fields)
│   ├── [FIELD] "branchSearchQuery"
│   └── [FIELD] "searchQuery"
├── ⚡ ACTION BUTTONS & TRIGGERS (8 buttons)
│   ├── [BUTTON] "Columns"
│   ├── [BUTTON] "Export"
│   ├── [BUTTON] "View Details"
│   ├── [BUTTON] "Mark as Low Stock"
│   ├── [BUTTON] "Mark as Poor Stock"
│   ├── [BUTTON] "Create Product"
│   ├── [BUTTON] "Cancel"
│   └── [BUTTON] "Archive product"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/catalogue/products/create`
- **Route Name:** `catalogue-create-product`
- **Source Component:** [`src/views/catalogue/CreateProduct.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/catalogue/CreateProduct.vue)
- **RBAC Access:** 🔒 **[Role Restricted / Super Admin Only]** (Roles: `Super Admin`)

```text
/catalogue/products/create [catalogue-create-product]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Create Product"
│   ├── "1. Identity & Classification"
│   ├── "2. Tracking & Variants"
│   ├── "3. Specifications & Media"
│   └── "4. Commercial Rules"
├── 📝 FORM FIELDS & INPUT CONTROLS (6 fields)
│   ├── [FIELD] "Electric Bikes"
│   ├── [FIELD] "Commuter"
│   ├── [FIELD] "Serialized - Serial + Chassis"
│   ├── [FIELD] "e.g. 5"
│   ├── [FIELD] "e.g. 90"
│   └── [FIELD] "Active after review"
├── ⚡ ACTION BUTTONS & TRIGGERS (4 buttons)
│   ├── [BUTTON] "Cancel"
│   ├── [BUTTON] "Save Draft"
│   ├── [BUTTON] "Review & Activate Product"
│   └── [BUTTON] "Continue"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/catalogue/create-product`
- **Route Name:** `catalogue-create-product-alias`
- **Source Component:** [`src/views/catalogue/CreateProduct.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/catalogue/CreateProduct.vue)
- **RBAC Access:** 🔒 **[Role Restricted / Super Admin Only]** (Roles: `Super Admin`)

```text
/catalogue/create-product [catalogue-create-product-alias]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Create Product"
│   ├── "1. Identity & Classification"
│   ├── "2. Tracking & Variants"
│   ├── "3. Specifications & Media"
│   └── "4. Commercial Rules"
├── 📝 FORM FIELDS & INPUT CONTROLS (6 fields)
│   ├── [FIELD] "Electric Bikes"
│   ├── [FIELD] "Commuter"
│   ├── [FIELD] "Serialized - Serial + Chassis"
│   ├── [FIELD] "e.g. 5"
│   ├── [FIELD] "e.g. 90"
│   └── [FIELD] "Active after review"
├── ⚡ ACTION BUTTONS & TRIGGERS (4 buttons)
│   ├── [BUTTON] "Cancel"
│   ├── [BUTTON] "Save Draft"
│   ├── [BUTTON] "Review & Activate Product"
│   └── [BUTTON] "Continue"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/catalogue/products/edit`
- **Route Name:** `catalogue-edit-product-legacy`
- **Source Component:** [`src/views/catalogue/EditProduct.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/catalogue/EditProduct.vue)
- **RBAC Access:** 🔒 **[Role Restricted / Super Admin Only]** (Roles: `Super Admin`)

```text
/catalogue/products/edit [catalogue-edit-product-legacy]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Edit Product"
│   ├── "1. Identity & Classification"
│   ├── "2. Tracking & Variants"
│   ├── "3. Specifications & Media"
│   └── "4. Commercial Rules"
├── 📝 FORM FIELDS & INPUT CONTROLS (16 fields)
│   ├── [FIELD] "productData.name"
│   ├── [FIELD] "productData.category"
│   ├── [FIELD] "productData.subcategory"
│   ├── [FIELD] "productData.model"
│   ├── [FIELD] "productData.sku"
│   ├── [FIELD] "productData.tracking"
│   ├── [FIELD] "productData.variants"
│   ├── [FIELD] "productData.warranty"
│   ├── [FIELD] "productData.motor"
│   ├── [FIELD] "productData.battery"
│   ├── [FIELD] "productData.range"
│   ├── [FIELD] "productData.speed"
│   ├── [FIELD] "productData.price"
│   ├── [FIELD] "productData.reorderLevel"
│   ├── [FIELD] "productData.documents"
│   └── [FIELD] "productData.activation"
├── ⚡ ACTION BUTTONS & TRIGGERS (3 buttons)
│   ├── [BUTTON] "Cancel"
│   ├── [BUTTON] "Save Draft"
│   └── [BUTTON] "Save Product Changes"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/catalogue/products/edit/:id`
- **Route Name:** `catalogue-edit-product`
- **Source Component:** [`src/views/catalogue/EditProduct.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/catalogue/EditProduct.vue)
- **RBAC Access:** 🔒 **[Role Restricted / Super Admin Only]** (Roles: `Super Admin`)

```text
/catalogue/products/edit/:id [catalogue-edit-product]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Edit Product"
│   ├── "1. Identity & Classification"
│   ├── "2. Tracking & Variants"
│   ├── "3. Specifications & Media"
│   └── "4. Commercial Rules"
├── 📝 FORM FIELDS & INPUT CONTROLS (16 fields)
│   ├── [FIELD] "productData.name"
│   ├── [FIELD] "productData.category"
│   ├── [FIELD] "productData.subcategory"
│   ├── [FIELD] "productData.model"
│   ├── [FIELD] "productData.sku"
│   ├── [FIELD] "productData.tracking"
│   ├── [FIELD] "productData.variants"
│   ├── [FIELD] "productData.warranty"
│   ├── [FIELD] "productData.motor"
│   ├── [FIELD] "productData.battery"
│   ├── [FIELD] "productData.range"
│   ├── [FIELD] "productData.speed"
│   ├── [FIELD] "productData.price"
│   ├── [FIELD] "productData.reorderLevel"
│   ├── [FIELD] "productData.documents"
│   └── [FIELD] "productData.activation"
├── ⚡ ACTION BUTTONS & TRIGGERS (3 buttons)
│   ├── [BUTTON] "Cancel"
│   ├── [BUTTON] "Save Draft"
│   └── [BUTTON] "Save Product Changes"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/catalogue/edit-product/:id`
- **Route Name:** `catalogue-edit-product-alias`
- **Source Component:** [`src/views/catalogue/EditProduct.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/catalogue/EditProduct.vue)
- **RBAC Access:** 🔒 **[Role Restricted / Super Admin Only]** (Roles: `Super Admin`)

```text
/catalogue/edit-product/:id [catalogue-edit-product-alias]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Edit Product"
│   ├── "1. Identity & Classification"
│   ├── "2. Tracking & Variants"
│   ├── "3. Specifications & Media"
│   └── "4. Commercial Rules"
├── 📝 FORM FIELDS & INPUT CONTROLS (16 fields)
│   ├── [FIELD] "productData.name"
│   ├── [FIELD] "productData.category"
│   ├── [FIELD] "productData.subcategory"
│   ├── [FIELD] "productData.model"
│   ├── [FIELD] "productData.sku"
│   ├── [FIELD] "productData.tracking"
│   ├── [FIELD] "productData.variants"
│   ├── [FIELD] "productData.warranty"
│   ├── [FIELD] "productData.motor"
│   ├── [FIELD] "productData.battery"
│   ├── [FIELD] "productData.range"
│   ├── [FIELD] "productData.speed"
│   ├── [FIELD] "productData.price"
│   ├── [FIELD] "productData.reorderLevel"
│   ├── [FIELD] "productData.documents"
│   └── [FIELD] "productData.activation"
├── ⚡ ACTION BUTTONS & TRIGGERS (3 buttons)
│   ├── [BUTTON] "Cancel"
│   ├── [BUTTON] "Save Draft"
│   └── [BUTTON] "Save Product Changes"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/catalogue/products/detail`
- **Route Name:** `catalogue-product-detail-legacy`
- **Source Component:** [`src/views/catalogue/ProductDetail.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/catalogue/ProductDetail.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/catalogue/products/detail [catalogue-product-detail-legacy]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Product Detail — BRG E9 Pro"
│   ├── "Warranty"
│   ├── "24 months"
│   ├── "Category"
│   └── "Electric Scooter"
├── 📑 NAVIGATION TABS & FILTER PILLS (11 tabs)
│   ├── [TAB] "Overview"
│   ├── [TAB] "Specifications"
│   ├── [TAB] "Variants"
│   ├── [TAB] "Pricing"
│   ├── [TAB] "Stock by Branch"
│   ├── [TAB] "Serialized Units"
│   ├── [TAB] "Procurement"
│   ├── [TAB] "Sales"
│   ├── [TAB] "Warranty"
│   ├── [TAB] "Media & Documents"
│   └── [TAB] "Audit"
├── 📊 SNAPSHOT METRICS & KPI CARDS (25 cards)
│   ├── [KPI CARD] Product ➔ pName
│   ├── [KPI CARD] SKU ➔ pSku
│   ├── [KPI CARD] Selling Price ➔ pPrice
│   ├── [KPI CARD] Available ➔ typeof p?.stock === 'number' ? `${p.stock
│   ├── [KPI CARD] Reserved ➔ '2 units'
│   ├── [KPI CARD] Incoming ➔ '4 units'
│   ├── [KPI CARD] Motor ➔ 'Approved catalogue value'
│   ├── [KPI CARD] Battery ➔ 'Approved catalogue value'
│   ├── [KPI CARD] Range ➔ 'Not set'
│   ├── [KPI CARD] Charging Time ➔ 'Not set'
│   ├── [KPI CARD] Top Speed ➔ 'Not set'
│   ├── [KPI CARD] Dimensions / Weight ➔ 'Not set'
│   ├── [KPI CARD] Approved Selling Price ➔ 'PKR 475
│   ├── [KPI CARD] Branch Override ➔ 'Not allowed'
│   ├── [KPI CARD] Discount Authority ➔ 'Within assigned limit'
│   ├── [KPI CARD] Cost / Landed Cost ➔ 'Restricted'
│   ├── [KPI CARD] Price Status ➔ 'Active'
│   ├── [KPI CARD] Effective Scope ➔ `${branchName
│   ├── [KPI CARD] QC / Hold ➔ '0 units'
│   ├── [KPI CARD] Stock Location ➔ `${branchName
│   ├── [KPI CARD] Stock Action ➔ 'Request stock'
│   ├── [KPI CARD] Serial / Chassis ➔ 'BRG-E9P-PSH-0012'
│   ├── [KPI CARD] Unit Status ➔ 'Available'
│   ├── [KPI CARD] Current Location ➔ `${branchName
│   └── [KPI CARD] Reservation ➔ 'None'
├── 📋 DATA TABLES & GRID COLUMNS (5 tables)
│   ├── [TABLE 1] Columns:
│   │   ├── [COL] "Specification"
│   │   └── [COL] "Value"
│   ├── [TABLE 2] Columns:
│   │   ├── [COL] "Variant"
│   │   ├── [COL] "Code"
│   │   ├── [COL] "Selling Price"
│   │   ├── [COL] "Active"
│   │   └── [COL] "Stock"
│   ├── [TABLE 3] Columns:
│   │   ├── [COL] "Effective"
│   │   ├── [COL] "Price"
│   │   ├── [COL] "Reason"
│   │   └── [COL] "Changed By"
│   ├── [TABLE 4] Columns:
│   │   ├── [COL] "Branch"
│   │   ├── [COL] "Available"
│   │   ├── [COL] "Reserved"
│   │   ├── [COL] "Incoming"
│   │   ├── [COL] "QC"
│   │   ├── [COL] "Total"
│   │   └── [COL] "Value"
│   ├── [TABLE 5] Columns:
│   │   ├── [COL] "Serial"
│   │   ├── [COL] "Chassis"
│   │   ├── [COL] "Branch"
│   │   ├── [COL] "Status"
│   │   ├── [COL] "Landed Cost"
│   │   ├── [COL] "Customer"
│   │   └── [COL] "Action"
├── ⚡ ACTION BUTTONS & TRIGGERS (2 buttons)
│   ├── [BUTTON] "Edit Product"
│   └── [BUTTON] "More ▼"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/catalogue/products/:id`
- **Route Name:** `catalogue-product-detail`
- **Source Component:** [`src/views/catalogue/ProductDetail.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/catalogue/ProductDetail.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/catalogue/products/:id [catalogue-product-detail]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Product Detail — BRG E9 Pro"
│   ├── "Warranty"
│   ├── "24 months"
│   ├── "Category"
│   └── "Electric Scooter"
├── 📑 NAVIGATION TABS & FILTER PILLS (11 tabs)
│   ├── [TAB] "Overview"
│   ├── [TAB] "Specifications"
│   ├── [TAB] "Variants"
│   ├── [TAB] "Pricing"
│   ├── [TAB] "Stock by Branch"
│   ├── [TAB] "Serialized Units"
│   ├── [TAB] "Procurement"
│   ├── [TAB] "Sales"
│   ├── [TAB] "Warranty"
│   ├── [TAB] "Media & Documents"
│   └── [TAB] "Audit"
├── 📊 SNAPSHOT METRICS & KPI CARDS (25 cards)
│   ├── [KPI CARD] Product ➔ pName
│   ├── [KPI CARD] SKU ➔ pSku
│   ├── [KPI CARD] Selling Price ➔ pPrice
│   ├── [KPI CARD] Available ➔ typeof p?.stock === 'number' ? `${p.stock
│   ├── [KPI CARD] Reserved ➔ '2 units'
│   ├── [KPI CARD] Incoming ➔ '4 units'
│   ├── [KPI CARD] Motor ➔ 'Approved catalogue value'
│   ├── [KPI CARD] Battery ➔ 'Approved catalogue value'
│   ├── [KPI CARD] Range ➔ 'Not set'
│   ├── [KPI CARD] Charging Time ➔ 'Not set'
│   ├── [KPI CARD] Top Speed ➔ 'Not set'
│   ├── [KPI CARD] Dimensions / Weight ➔ 'Not set'
│   ├── [KPI CARD] Approved Selling Price ➔ 'PKR 475
│   ├── [KPI CARD] Branch Override ➔ 'Not allowed'
│   ├── [KPI CARD] Discount Authority ➔ 'Within assigned limit'
│   ├── [KPI CARD] Cost / Landed Cost ➔ 'Restricted'
│   ├── [KPI CARD] Price Status ➔ 'Active'
│   ├── [KPI CARD] Effective Scope ➔ `${branchName
│   ├── [KPI CARD] QC / Hold ➔ '0 units'
│   ├── [KPI CARD] Stock Location ➔ `${branchName
│   ├── [KPI CARD] Stock Action ➔ 'Request stock'
│   ├── [KPI CARD] Serial / Chassis ➔ 'BRG-E9P-PSH-0012'
│   ├── [KPI CARD] Unit Status ➔ 'Available'
│   ├── [KPI CARD] Current Location ➔ `${branchName
│   └── [KPI CARD] Reservation ➔ 'None'
├── 📋 DATA TABLES & GRID COLUMNS (5 tables)
│   ├── [TABLE 1] Columns:
│   │   ├── [COL] "Specification"
│   │   └── [COL] "Value"
│   ├── [TABLE 2] Columns:
│   │   ├── [COL] "Variant"
│   │   ├── [COL] "Code"
│   │   ├── [COL] "Selling Price"
│   │   ├── [COL] "Active"
│   │   └── [COL] "Stock"
│   ├── [TABLE 3] Columns:
│   │   ├── [COL] "Effective"
│   │   ├── [COL] "Price"
│   │   ├── [COL] "Reason"
│   │   └── [COL] "Changed By"
│   ├── [TABLE 4] Columns:
│   │   ├── [COL] "Branch"
│   │   ├── [COL] "Available"
│   │   ├── [COL] "Reserved"
│   │   ├── [COL] "Incoming"
│   │   ├── [COL] "QC"
│   │   ├── [COL] "Total"
│   │   └── [COL] "Value"
│   ├── [TABLE 5] Columns:
│   │   ├── [COL] "Serial"
│   │   ├── [COL] "Chassis"
│   │   ├── [COL] "Branch"
│   │   ├── [COL] "Status"
│   │   ├── [COL] "Landed Cost"
│   │   ├── [COL] "Customer"
│   │   └── [COL] "Action"
├── ⚡ ACTION BUTTONS & TRIGGERS (2 buttons)
│   ├── [BUTTON] "Edit Product"
│   └── [BUTTON] "More ▼"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/catalogue/pricing`
- **Route Name:** `catalogue-pricing`
- **Source Component:** [`src/views/catalogue/Pricing.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/catalogue/Pricing.vue)
- **RBAC Access:** 🔒 **[Role Restricted / Super Admin Only]** (Roles: `Super Admin`)

```text
/catalogue/pricing [catalogue-pricing]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Pricing"
│   ├── "New Price Rule"
│   ├── "Pricing Matrix"
│   └── "Pricing History"
├── 📑 NAVIGATION TABS & FILTER PILLS (6 tabs)
│   ├── [TAB] "Clear Filters"
│   ├── [TAB] "Reset filters"
│   ├── [TAB] "All Categories"
│   ├── [TAB] "Electric Bikes"
│   ├── [TAB] "Cargo"
│   └── [TAB] "Scooters"
├── 📋 DATA TABLES & GRID COLUMNS (2 tables)
│   ├── [TABLE 1] Columns:
│   │   ├── [COL] "Product"
│   │   ├── [COL] "Category"
│   │   ├── [COL] "Selling Price"
│   │   ├── [COL] "Landed Cost Ref"
│   │   ├── [COL] "Markup"
│   │   ├── [COL] "Margin"
│   │   ├── [COL] "Minimum"
│   │   ├── [COL] "Branch Override"
│   │   ├── [COL] "Effective"
│   │   └── [COL] "Actions"
│   ├── [TABLE 2] Columns:
│   │   ├── [COL] "Date"
│   │   ├── [COL] "Old Price"
│   │   ├── [COL] "New Price"
│   │   ├── [COL] "Changed By"
│   │   └── [COL] "Reason"
├── 📝 FORM FIELDS & INPUT CONTROLS (1 fields)
│   └── [FIELD] "searchQuery"
├── ⚡ ACTION BUTTONS & TRIGGERS (2 buttons)
│   ├── [BUTTON] "New Price Rule"
│   └── [BUTTON] "Close"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/catalogue/pricing/create`
- **Route Name:** `catalogue-create-price-rule`
- **Source Component:** [`src/views/catalogue/CreatePriceRule.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/catalogue/CreatePriceRule.vue)
- **RBAC Access:** 🔒 **[Role Restricted / Super Admin Only]** (Roles: `Super Admin`)

```text
/catalogue/pricing/create [catalogue-create-price-rule]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Create Price Rule"
│   ├── "1. Target & Scope"
│   ├── "2. Pricing Configuration"
│   ├── "Reference Landed Cost"
│   └── "PKR 146,000"
├── 📝 FORM FIELDS & INPUT CONTROLS (3 fields)
│   ├── [FIELD] "e.g. 185,000"
│   ├── [FIELD] "e.g. 176,000"
│   └── [FIELD] "e.g. Market update, Promo"
├── ⚡ ACTION BUTTONS & TRIGGERS (3 buttons)
│   ├── [BUTTON] "Cancel"
│   ├── [BUTTON] "Save Draft"
│   └── [BUTTON] "Create Price Rule"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/catalogue/pricing/edit`
- **Route Name:** `catalogue-edit-price-rule-legacy`
- **Source Component:** [`src/views/catalogue/EditPriceRule.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/catalogue/EditPriceRule.vue)
- **RBAC Access:** 🔒 **[Role Restricted / Super Admin Only]** (Roles: `Super Admin`)

```text
/catalogue/pricing/edit [catalogue-edit-price-rule-legacy]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Edit Price Rule"
│   ├── "1. Target & Scope"
│   ├── "2. Pricing Configuration"
│   ├── "Reference Landed Cost"
│   └── "Calculated Markup"
├── 📝 FORM FIELDS & INPUT CONTROLS (6 fields)
│   ├── [FIELD] "priceRuleData.product"
│   ├── [FIELD] "priceRuleData.branchOverride"
│   ├── [FIELD] "priceRuleData.effective"
│   ├── [FIELD] "priceRuleData.sellingPrice"
│   ├── [FIELD] "priceRuleData.minimum"
│   └── [FIELD] "priceRuleData.reason"
├── ⚡ ACTION BUTTONS & TRIGGERS (3 buttons)
│   ├── [BUTTON] "Cancel"
│   ├── [BUTTON] "Save Draft"
│   └── [BUTTON] "Save Changes"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/catalogue/pricing/edit/:id`
- **Route Name:** `catalogue-edit-price-rule`
- **Source Component:** [`src/views/catalogue/EditPriceRule.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/catalogue/EditPriceRule.vue)
- **RBAC Access:** 🔒 **[Role Restricted / Super Admin Only]** (Roles: `Super Admin`)

```text
/catalogue/pricing/edit/:id [catalogue-edit-price-rule]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Edit Price Rule"
│   ├── "1. Target & Scope"
│   ├── "2. Pricing Configuration"
│   ├── "Reference Landed Cost"
│   └── "Calculated Markup"
├── 📝 FORM FIELDS & INPUT CONTROLS (6 fields)
│   ├── [FIELD] "priceRuleData.product"
│   ├── [FIELD] "priceRuleData.branchOverride"
│   ├── [FIELD] "priceRuleData.effective"
│   ├── [FIELD] "priceRuleData.sellingPrice"
│   ├── [FIELD] "priceRuleData.minimum"
│   └── [FIELD] "priceRuleData.reason"
├── ⚡ ACTION BUTTONS & TRIGGERS (3 buttons)
│   ├── [BUTTON] "Cancel"
│   ├── [BUTTON] "Save Draft"
│   └── [BUTTON] "Save Changes"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/catalogue/requests`
- **Route Name:** `catalogue-requests`
- **Source Component:** [`src/views/catalogue/ProductRequests.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/catalogue/ProductRequests.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/catalogue/requests [catalogue-requests]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Product Requests"
│   ├── "New Product Request"
│   └── "Requests"
├── 📑 NAVIGATION TABS & FILTER PILLS (6 tabs)
│   ├── [TAB] "Clear"
│   ├── [TAB] "Reset filters"
│   ├── [TAB] "All"
│   ├── [TAB] "Pending"
│   ├── [TAB] "Approved"
│   └── [TAB] "Rejected"
├── 📊 SNAPSHOT METRICS & KPI CARDS (4 cards)
│   ├── [KPI CARD] Open ➔ '3'
│   ├── [KPI CARD] Submitted ➔ '2'
│   ├── [KPI CARD] Approved ➔ '8'
│   └── [KPI CARD] Rejected ➔ '1'
├── 📋 DATA TABLES & GRID COLUMNS (2 tables)
│   ├── [TABLE 1] Columns:
│   │   ├── [COL] "Request"
│   │   ├── [COL] "Requested Product"
│   │   ├── [COL] "Reason"
│   │   ├── [COL] "Submitted"
│   │   ├── [COL] "Status"
│   │   └── [COL] "Actions"
│   ├── [TABLE 2] Columns:
│   │   ├── [COL] "Request"
│   │   ├── [COL] "Branch"
│   │   ├── [COL] "Requested Product"
│   │   ├── [COL] "Reason"
│   │   ├── [COL] "Submitted"
│   │   ├── [COL] "Status"
│   │   └── [COL] "Action"
├── 📝 FORM FIELDS & INPUT CONTROLS (2 fields)
│   ├── [FIELD] "branchSearchQuery"
│   └── [FIELD] "searchQuery"
├── ⚡ ACTION BUTTONS & TRIGGERS (1 buttons)
│   └── [BUTTON] "New Product Request"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/catalogue/requests/create`
- **Route Name:** `catalogue-create-request`
- **Source Component:** [`src/views/catalogue/CreateProductRequest.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/catalogue/CreateProductRequest.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/catalogue/requests/create [catalogue-create-request]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Requested Product"
│   ├── "Existing Categories"
│   ├── "Custom"
│   └── "Demand & Evidence"
├── 📝 FORM FIELDS & INPUT CONTROLS (8 fields)
│   ├── [FIELD] "form.productName"
│   ├── [FIELD] "form.category"
│   ├── [FIELD] "form.specifications"
│   ├── [FIELD] "form.reference"
│   ├── [FIELD] "form.customerDemand"
│   ├── [FIELD] "form.urgency"
│   ├── [FIELD] "form.images"
│   └── [FIELD] "form.reason"
├── ⚡ ACTION BUTTONS & TRIGGERS (1 buttons)
│   └── [BUTTON] "Cancel"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/catalogue/create-request`
- **Route Name:** `catalogue-create-request-alias`
- **Source Component:** [`src/views/catalogue/CreateProductRequest.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/catalogue/CreateProductRequest.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/catalogue/create-request [catalogue-create-request-alias]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Requested Product"
│   ├── "Existing Categories"
│   ├── "Custom"
│   └── "Demand & Evidence"
├── 📝 FORM FIELDS & INPUT CONTROLS (8 fields)
│   ├── [FIELD] "form.productName"
│   ├── [FIELD] "form.category"
│   ├── [FIELD] "form.specifications"
│   ├── [FIELD] "form.reference"
│   ├── [FIELD] "form.customerDemand"
│   ├── [FIELD] "form.urgency"
│   ├── [FIELD] "form.images"
│   └── [FIELD] "form.reason"
├── ⚡ ACTION BUTTONS & TRIGGERS (1 buttons)
│   └── [BUTTON] "Cancel"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/catalogue/requests/detail`
- **Route Name:** `catalogue-request-detail-legacy`
- **Source Component:** [`src/views/catalogue/ProductRequestDetail.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/catalogue/ProductRequestDetail.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/catalogue/requests/detail [catalogue-request-detail-legacy]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Product Request PR-028"
│   ├── "Branch context"
│   ├── "Super Admin"
│   ├── "Catalogue Team"
│   └── "Linked Product"
├── 📊 SNAPSHOT METRICS & KPI CARDS (25 cards)
│   ├── [KPI CARD] Requested Product ➔ 'BRG Urban Mini'
│   ├── [KPI CARD] Category ➔ 'Electric Scooter'
│   ├── [KPI CARD] Status ➔ 'Submitted'
│   ├── [KPI CARD] Requested Qty ➔ '4'
│   ├── [KPI CARD] Reason ➔ 'Customer demand'
│   ├── [KPI CARD] Urgency ➔ 'Medium'
│   ├── [KPI CARD] Review Status ➔ 'Under Review'
│   ├── [KPI CARD] Assigned Reviewer ➔ 'Catalogue Team'
│   ├── [KPI CARD] Feasibility ➔ 'Evaluating Specs'
│   ├── [KPI CARD] Estimated Decision ➔ 'Within 3 business days'
│   ├── [KPI CARD] Feedback Notes ➔ 'Reviewing market pricing fit'
│   ├── [KPI CARD] Action Needed ➔ 'None from branch'
│   ├── [KPI CARD] Master Product ID ➔ 'Pending creation'
│   ├── [KPI CARD] SKU Assigned ➔ 'Not assigned'
│   ├── [KPI CARD] Catalogue Category ➔ 'Electric Scooter'
│   ├── [KPI CARD] Target Launch ➔ 'Q4 2026'
│   ├── [KPI CARD] Target Price ➔ 'PKR 325
│   ├── [KPI CARD] Availability Scope ➔ 'All Branches once created'
│   ├── [KPI CARD] Latest Message ➔ 'Request received and queued for review.'
│   ├── [KPI CARD] Sender ➔ 'Head Office - Product Team'
│   ├── [KPI CARD] Timestamp ➔ '28 Aug 14:22'
│   ├── [KPI CARD] Total Messages ➔ '2 messages'
│   ├── [KPI CARD] Branch Sender ➔ `${user.value?.branchName || 'Peshawar'
│   ├── [KPI CARD] Channel ➔ 'Internal Catalogue Thread'
│   └── [KPI CARD] Created ➔ '26 Aug 10:15 by Branch Manager'
├── ⚡ ACTION BUTTONS & TRIGGERS (5 buttons)
│   ├── [BUTTON] "Review Request"
│   ├── [BUTTON] "More ▼"
│   ├── [BUTTON] "Reject"
│   ├── [BUTTON] "Request Information"
│   └── [BUTTON] "Approve & Convert to Product"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/catalogue/requests/:id`
- **Route Name:** `catalogue-request-detail`
- **Source Component:** [`src/views/catalogue/ProductRequestDetail.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/catalogue/ProductRequestDetail.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/catalogue/requests/:id [catalogue-request-detail]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Product Request PR-028"
│   ├── "Branch context"
│   ├── "Super Admin"
│   ├── "Catalogue Team"
│   └── "Linked Product"
├── 📊 SNAPSHOT METRICS & KPI CARDS (25 cards)
│   ├── [KPI CARD] Requested Product ➔ 'BRG Urban Mini'
│   ├── [KPI CARD] Category ➔ 'Electric Scooter'
│   ├── [KPI CARD] Status ➔ 'Submitted'
│   ├── [KPI CARD] Requested Qty ➔ '4'
│   ├── [KPI CARD] Reason ➔ 'Customer demand'
│   ├── [KPI CARD] Urgency ➔ 'Medium'
│   ├── [KPI CARD] Review Status ➔ 'Under Review'
│   ├── [KPI CARD] Assigned Reviewer ➔ 'Catalogue Team'
│   ├── [KPI CARD] Feasibility ➔ 'Evaluating Specs'
│   ├── [KPI CARD] Estimated Decision ➔ 'Within 3 business days'
│   ├── [KPI CARD] Feedback Notes ➔ 'Reviewing market pricing fit'
│   ├── [KPI CARD] Action Needed ➔ 'None from branch'
│   ├── [KPI CARD] Master Product ID ➔ 'Pending creation'
│   ├── [KPI CARD] SKU Assigned ➔ 'Not assigned'
│   ├── [KPI CARD] Catalogue Category ➔ 'Electric Scooter'
│   ├── [KPI CARD] Target Launch ➔ 'Q4 2026'
│   ├── [KPI CARD] Target Price ➔ 'PKR 325
│   ├── [KPI CARD] Availability Scope ➔ 'All Branches once created'
│   ├── [KPI CARD] Latest Message ➔ 'Request received and queued for review.'
│   ├── [KPI CARD] Sender ➔ 'Head Office - Product Team'
│   ├── [KPI CARD] Timestamp ➔ '28 Aug 14:22'
│   ├── [KPI CARD] Total Messages ➔ '2 messages'
│   ├── [KPI CARD] Branch Sender ➔ `${user.value?.branchName || 'Peshawar'
│   ├── [KPI CARD] Channel ➔ 'Internal Catalogue Thread'
│   └── [KPI CARD] Created ➔ '26 Aug 10:15 by Branch Manager'
├── ⚡ ACTION BUTTONS & TRIGGERS (5 buttons)
│   ├── [BUTTON] "Review Request"
│   ├── [BUTTON] "More ▼"
│   ├── [BUTTON] "Reject"
│   ├── [BUTTON] "Request Information"
│   └── [BUTTON] "Approve & Convert to Product"
└── (No secondary dialogs)
```

### 📁 MODULE: `PROCUREMENT` (22 Total Routes)

#### 📍 ROUTE: `/procurement/suppliers`
- **Route Name:** `procurement-suppliers`
- **Source Component:** [`src/views/procurement/Suppliers.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/procurement/Suppliers.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/procurement/suppliers [procurement-suppliers]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Suppliers"
│   └── "Add Supplier"
├── 📑 NAVIGATION TABS & FILTER PILLS (2 tabs)
│   ├── [TAB] "Clear Filters"
│   └── [TAB] "Reset filters"
├── 📊 SNAPSHOT METRICS & KPI CARDS (4 cards)
│   ├── [KPI CARD] Suppliers ➔ String(total)
│   ├── [KPI CARD] Active ➔ String(activeCount)
│   ├── [KPI CARD] Open POs ➔ '9'
│   └── [KPI CARD] Payables ➔ 'PKR 6.1M'
├── 📋 DATA TABLES & GRID COLUMNS (1 tables)
│   ├── [TABLE 1] Columns:
│   │   ├── [COL] "Supplier"
│   │   ├── [COL] "Contact"
│   │   ├── [COL] "Products"
│   │   ├── [COL] "Open POs"
│   │   ├── [COL] "Purchases YTD"
│   │   ├── [COL] "Payable"
│   │   ├── [COL] "On-Time"
│   │   ├── [COL] "Status"
│   │   └── [COL] "Actions"
├── 📝 FORM FIELDS & INPUT CONTROLS (1 fields)
│   └── [FIELD] "searchQuery"
├── ⚡ ACTION BUTTONS & TRIGGERS (1 buttons)
│   └── [BUTTON] "Add Supplier"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/procurement/suppliers/create`
- **Route Name:** `procurement-create-supplier`
- **Source Component:** [`src/views/procurement/CreateSupplier.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/procurement/CreateSupplier.vue)
- **RBAC Access:** 🔒 **[Role Restricted / Super Admin Only]** (Roles: `Super Admin`)

```text
/procurement/suppliers/create [procurement-create-supplier]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Add Supplier"
│   ├── "1. Supplier Identity"
│   └── "2. Commercial & Operational"
├── 📝 FORM FIELDS & INPUT CONTROLS (3 fields)
│   ├── [FIELD] "e.g. BRG Factory"
│   ├── [FIELD] "e.g. Li Wei"
│   └── [FIELD] "Contract details, performance notes, etc."
├── ⚡ ACTION BUTTONS & TRIGGERS (3 buttons)
│   ├── [BUTTON] "Cancel"
│   ├── [BUTTON] "Save Draft"
│   └── [BUTTON] "Create Supplier"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/procurement/suppliers/edit`
- **Route Name:** `procurement-edit-supplier-legacy`
- **Source Component:** [`src/views/procurement/EditSupplier.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/procurement/EditSupplier.vue)
- **RBAC Access:** 🔒 **[Role Restricted / Super Admin Only]** (Roles: `Super Admin`)

```text
/procurement/suppliers/edit [procurement-edit-supplier-legacy]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Edit Supplier"
│   ├── "1. Supplier Identity"
│   └── "2. Commercial & Operational"
├── 📝 FORM FIELDS & INPUT CONTROLS (9 fields)
│   ├── [FIELD] "supplierData.name"
│   ├── [FIELD] "supplierData.contact"
│   ├── [FIELD] "supplierData.phone"
│   ├── [FIELD] "supplierData.email"
│   ├── [FIELD] "supplierData.address"
│   ├── [FIELD] "supplierData.currency"
│   ├── [FIELD] "supplierData.terms"
│   ├── [FIELD] "supplierData.taxId"
│   └── [FIELD] "supplierData.notes"
├── ⚡ ACTION BUTTONS & TRIGGERS (2 buttons)
│   ├── [BUTTON] "Cancel"
│   └── [BUTTON] "Save Changes"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/procurement/suppliers/edit/:id`
- **Route Name:** `procurement-edit-supplier`
- **Source Component:** [`src/views/procurement/EditSupplier.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/procurement/EditSupplier.vue)
- **RBAC Access:** 🔒 **[Role Restricted / Super Admin Only]** (Roles: `Super Admin`)

```text
/procurement/suppliers/edit/:id [procurement-edit-supplier]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Edit Supplier"
│   ├── "1. Supplier Identity"
│   └── "2. Commercial & Operational"
├── 📝 FORM FIELDS & INPUT CONTROLS (9 fields)
│   ├── [FIELD] "supplierData.name"
│   ├── [FIELD] "supplierData.contact"
│   ├── [FIELD] "supplierData.phone"
│   ├── [FIELD] "supplierData.email"
│   ├── [FIELD] "supplierData.address"
│   ├── [FIELD] "supplierData.currency"
│   ├── [FIELD] "supplierData.terms"
│   ├── [FIELD] "supplierData.taxId"
│   └── [FIELD] "supplierData.notes"
├── ⚡ ACTION BUTTONS & TRIGGERS (2 buttons)
│   ├── [BUTTON] "Cancel"
│   └── [BUTTON] "Save Changes"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/procurement/suppliers/detail`
- **Route Name:** `procurement-supplier-detail-legacy`
- **Source Component:** [`src/views/procurement/SupplierDetail.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/procurement/SupplierDetail.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/procurement/suppliers/detail [procurement-supplier-detail-legacy]
│
├── 🏷️ HEADERS & TITLES
│   ├── "BRG Factory"
│   ├── "SUP-BRG-001 &middot; Shenzhen, China"
│   ├── "Purchases YTD"
│   ├── "PKR 38.4M"
│   └── "Open POs"
├── 📑 NAVIGATION TABS & FILTER PILLS (10 tabs)
│   ├── [TAB] "Overview"
│   ├── [TAB] "Contacts"
│   ├── [TAB] "Products"
│   ├── [TAB] "Purchase Orders"
│   ├── [TAB] "Receipts"
│   ├── [TAB] "Bills & Payments"
│   ├── [TAB] "Returns"
│   ├── [TAB] "Performance"
│   ├── [TAB] "Documents"
│   └── [TAB] "Activity"
├── 📋 DATA TABLES & GRID COLUMNS (5 tables)
│   ├── [TABLE 1] Columns:
│   │   ├── [COL] "Name"
│   │   ├── [COL] "Role"
│   │   ├── [COL] "Email"
│   │   ├── [COL] "Phone"
│   │   └── [COL] "Primary"
│   ├── [TABLE 2] Columns:
│   │   ├── [COL] "Product"
│   │   ├── [COL] "SKU"
│   │   ├── [COL] "Last Cost"
│   │   ├── [COL] "Lead Time"
│   │   ├── [COL] "MOQ"
│   │   └── [COL] "Active"
│   ├── [TABLE 3] Columns:
│   │   ├── [COL] "PO"
│   │   ├── [COL] "Destination"
│   │   ├── [COL] "Amount"
│   │   ├── [COL] "Status"
│   │   ├── [COL] "ETA"
│   │   └── [COL] "Action"
│   ├── [TABLE 4] Columns:
│   │   ├── [COL] "Receipt"
│   │   ├── [COL] "PO"
│   │   ├── [COL] "Location"
│   │   ├── [COL] "Units"
│   │   ├── [COL] "Discrepancy"
│   │   ├── [COL] "Date"
│   │   └── [COL] "Action"
│   ├── [TABLE 5] Columns:
│   │   ├── [COL] "Bill"
│   │   ├── [COL] "PO"
│   │   ├── [COL] "Amount"
│   │   ├── [COL] "Due"
│   │   ├── [COL] "Paid"
│   │   ├── [COL] "Outstanding"
│   │   └── [COL] "Match"
├── ⚡ ACTION BUTTONS & TRIGGERS (2 buttons)
│   ├── [BUTTON] "Edit Supplier"
│   └── [BUTTON] "More ▼"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/procurement/suppliers/:id`
- **Route Name:** `procurement-supplier-detail`
- **Source Component:** [`src/views/procurement/SupplierDetail.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/procurement/SupplierDetail.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/procurement/suppliers/:id [procurement-supplier-detail]
│
├── 🏷️ HEADERS & TITLES
│   ├── "BRG Factory"
│   ├── "SUP-BRG-001 &middot; Shenzhen, China"
│   ├── "Purchases YTD"
│   ├── "PKR 38.4M"
│   └── "Open POs"
├── 📑 NAVIGATION TABS & FILTER PILLS (10 tabs)
│   ├── [TAB] "Overview"
│   ├── [TAB] "Contacts"
│   ├── [TAB] "Products"
│   ├── [TAB] "Purchase Orders"
│   ├── [TAB] "Receipts"
│   ├── [TAB] "Bills & Payments"
│   ├── [TAB] "Returns"
│   ├── [TAB] "Performance"
│   ├── [TAB] "Documents"
│   └── [TAB] "Activity"
├── 📋 DATA TABLES & GRID COLUMNS (5 tables)
│   ├── [TABLE 1] Columns:
│   │   ├── [COL] "Name"
│   │   ├── [COL] "Role"
│   │   ├── [COL] "Email"
│   │   ├── [COL] "Phone"
│   │   └── [COL] "Primary"
│   ├── [TABLE 2] Columns:
│   │   ├── [COL] "Product"
│   │   ├── [COL] "SKU"
│   │   ├── [COL] "Last Cost"
│   │   ├── [COL] "Lead Time"
│   │   ├── [COL] "MOQ"
│   │   └── [COL] "Active"
│   ├── [TABLE 3] Columns:
│   │   ├── [COL] "PO"
│   │   ├── [COL] "Destination"
│   │   ├── [COL] "Amount"
│   │   ├── [COL] "Status"
│   │   ├── [COL] "ETA"
│   │   └── [COL] "Action"
│   ├── [TABLE 4] Columns:
│   │   ├── [COL] "Receipt"
│   │   ├── [COL] "PO"
│   │   ├── [COL] "Location"
│   │   ├── [COL] "Units"
│   │   ├── [COL] "Discrepancy"
│   │   ├── [COL] "Date"
│   │   └── [COL] "Action"
│   ├── [TABLE 5] Columns:
│   │   ├── [COL] "Bill"
│   │   ├── [COL] "PO"
│   │   ├── [COL] "Amount"
│   │   ├── [COL] "Due"
│   │   ├── [COL] "Paid"
│   │   ├── [COL] "Outstanding"
│   │   └── [COL] "Match"
├── ⚡ ACTION BUTTONS & TRIGGERS (2 buttons)
│   ├── [BUTTON] "Edit Supplier"
│   └── [BUTTON] "More ▼"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/procurement/purchase-orders`
- **Route Name:** `procurement-purchase-orders`
- **Source Component:** [`src/views/procurement/PurchaseOrders.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/procurement/PurchaseOrders.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/procurement/purchase-orders [procurement-purchase-orders]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Purchase Orders"
│   └── "Create Purchase Order"
├── 📑 NAVIGATION TABS & FILTER PILLS (2 tabs)
│   ├── [TAB] "Clear"
│   └── [TAB] "Reset filters"
├── 📋 DATA TABLES & GRID COLUMNS (1 tables)
│   ├── [TABLE 1] Columns:
│   │   ├── [COL] "PO"
│   │   ├── [COL] "Supplier"
│   │   ├── [COL] "Destination"
│   │   ├── [COL] "Amount"
│   │   ├── [COL] "Units"
│   │   ├── [COL] "Expected"
│   │   ├── [COL] "Status"
│   │   ├── [COL] "Match"
│   │   └── [COL] "Actions"
├── 📝 FORM FIELDS & INPUT CONTROLS (1 fields)
│   └── [FIELD] "searchQuery"
├── ⚡ ACTION BUTTONS & TRIGGERS (1 buttons)
│   └── [BUTTON] "Create Purchase Order"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/procurement/purchase-orders/create`
- **Route Name:** `procurement-create-purchase-order`
- **Source Component:** [`src/views/procurement/CreatePurchaseOrder.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/procurement/CreatePurchaseOrder.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/procurement/purchase-orders/create [procurement-create-purchase-order]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Create Purchase Order"
│   ├── "1. Supplier & Destination"
│   ├── "2. Products"
│   ├── "3. Costs & Shipment"
│   └── "4. Terms & Review"
├── 📝 FORM FIELDS & INPUT CONTROLS (9 fields)
│   ├── [FIELD] "form.supplier"
│   ├── [FIELD] "form.destination"
│   ├── [FIELD] "form.expectedArrival"
│   ├── [FIELD] "form.expectedCost"
│   ├── [FIELD] "form.estimatedFreight"
│   ├── [FIELD] "form.shipmentMethod"
│   ├── [FIELD] "form.paymentTerms"
│   ├── [FIELD] "form.documents"
│   └── [FIELD] "form.notes"
├── ⚡ ACTION BUTTONS & TRIGGERS (3 buttons)
│   ├── [BUTTON] "Cancel"
│   ├── [BUTTON] "Save Draft"
│   └── [BUTTON] "Submit for Approval"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/procurement/create-po`
- **Route Name:** `procurement-create-po-alias`
- **Source Component:** [`src/views/procurement/CreatePurchaseOrder.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/procurement/CreatePurchaseOrder.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/procurement/create-po [procurement-create-po-alias]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Create Purchase Order"
│   ├── "1. Supplier & Destination"
│   ├── "2. Products"
│   ├── "3. Costs & Shipment"
│   └── "4. Terms & Review"
├── 📝 FORM FIELDS & INPUT CONTROLS (9 fields)
│   ├── [FIELD] "form.supplier"
│   ├── [FIELD] "form.destination"
│   ├── [FIELD] "form.expectedArrival"
│   ├── [FIELD] "form.expectedCost"
│   ├── [FIELD] "form.estimatedFreight"
│   ├── [FIELD] "form.shipmentMethod"
│   ├── [FIELD] "form.paymentTerms"
│   ├── [FIELD] "form.documents"
│   └── [FIELD] "form.notes"
├── ⚡ ACTION BUTTONS & TRIGGERS (3 buttons)
│   ├── [BUTTON] "Cancel"
│   ├── [BUTTON] "Save Draft"
│   └── [BUTTON] "Submit for Approval"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/procurement/purchase-orders/detail`
- **Route Name:** `procurement-purchase-order-detail-legacy`
- **Source Component:** [`src/views/procurement/PurchaseOrderDetail.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/procurement/PurchaseOrderDetail.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/procurement/purchase-orders/detail [procurement-purchase-order-detail-legacy]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Actions"
│   ├── "Cancel Purchase Order"
│   ├── "PO Value"
│   ├── "Ordered Units"
│   └── "Received Units"
├── 📑 NAVIGATION TABS & FILTER PILLS (9 tabs)
│   ├── [TAB] "Summary"
│   ├── [TAB] "Items"
│   ├── [TAB] "Shipment"
│   ├── [TAB] "Receipts"
│   ├── [TAB] "Landed Costs"
│   ├── [TAB] "Vendor Bills"
│   ├── [TAB] "Payments"
│   ├── [TAB] "Documents"
│   └── [TAB] "Activity"
├── ⚡ ACTION BUTTONS & TRIGGERS (7 buttons)
│   ├── [BUTTON] "Back to Orders"
│   ├── [BUTTON] "More ▼"
│   ├── [BUTTON] "Receive goods"
│   ├── [BUTTON] "Duplicate PO"
│   ├── [BUTTON] "Cancel PO"
│   ├── [BUTTON] "Keep PO"
│   └── [BUTTON] "Confirm Cancel"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/procurement/purchase-orders/:id`
- **Route Name:** `procurement-purchase-order-detail`
- **Source Component:** [`src/views/procurement/PurchaseOrderDetail.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/procurement/PurchaseOrderDetail.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/procurement/purchase-orders/:id [procurement-purchase-order-detail]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Actions"
│   ├── "Cancel Purchase Order"
│   ├── "PO Value"
│   ├── "Ordered Units"
│   └── "Received Units"
├── 📑 NAVIGATION TABS & FILTER PILLS (9 tabs)
│   ├── [TAB] "Summary"
│   ├── [TAB] "Items"
│   ├── [TAB] "Shipment"
│   ├── [TAB] "Receipts"
│   ├── [TAB] "Landed Costs"
│   ├── [TAB] "Vendor Bills"
│   ├── [TAB] "Payments"
│   ├── [TAB] "Documents"
│   └── [TAB] "Activity"
├── ⚡ ACTION BUTTONS & TRIGGERS (7 buttons)
│   ├── [BUTTON] "Back to Orders"
│   ├── [BUTTON] "More ▼"
│   ├── [BUTTON] "Receive goods"
│   ├── [BUTTON] "Duplicate PO"
│   ├── [BUTTON] "Cancel PO"
│   ├── [BUTTON] "Keep PO"
│   └── [BUTTON] "Confirm Cancel"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/procurement/purchase-orders/:id/receive`
- **Route Name:** `procurement-receive-purchase-order`
- **Source Component:** [`src/views/procurement/ReceivePurchase.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/procurement/ReceivePurchase.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/procurement/purchase-orders/:id/receive [procurement-receive-purchase-order]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Receive Purchase (GRN)"
│   ├── "Goods Receipt & Inwarding"
│   ├── "Purchase Order Not Found"
│   ├── "Unauthorized Branch Access"
│   └── "Please correct the following errors before proceeding:"
├── 📑 NAVIGATION TABS & FILTER PILLS (1 tabs)
│   └── [TAB] "Review GRN &rarr;"
├── 📋 DATA TABLES & GRID COLUMNS (3 tables)
│   ├── [TABLE 1] Columns:
│   │   ├── [COL] "Product / SKU"
│   │   ├── [COL] "Ordered"
│   │   ├── [COL] "Prev. Received"
│   │   ├── [COL] "Outstanding"
│   │   ├── [COL] "Current Received"
│   │   ├── [COL] "Damaged"
│   │   ├── [COL] "Accepted"
│   │   ├── [COL] "Short"
│   │   ├── [COL] "Excess"
│   │   └── [COL] "Discrepancy Reason"
│   ├── [TABLE 2] Columns:
│   │   ├── [COL] "#"
│   │   ├── [COL] "Product"
│   │   ├── [COL] "Chassis / VIN"
│   │   ├── [COL] "Motor Serial"
│   │   ├── [COL] "Battery Serial"
│   │   ├── [COL] "Condition"
│   │   └── [COL] "QC Decision"
│   ├── [TABLE 3] Columns:
│   │   ├── [COL] "Product"
│   │   ├── [COL] "Ordered"
│   │   ├── [COL] "Prev. Rec"
│   │   ├── [COL] "Current Rec"
│   │   ├── [COL] "Accepted"
│   │   ├── [COL] "Short"
│   │   ├── [COL] "Excess"
│   │   ├── [COL] "Damaged"
│   │   └── [COL] "Discrepancy Notes"
├── 📝 FORM FIELDS & INPUT CONTROLS (10 fields)
│   ├── [FIELD] "receivingForm.location"
│   ├── [FIELD] "receivingForm.receiver"
│   ├── [FIELD] "receivingForm.receiptDate"
│   ├── [FIELD] "receivingForm.deliveryNote"
│   ├── [FIELD] "unit.chassis"
│   ├── [FIELD] "unit.motorNumber"
│   ├── [FIELD] "unit.batteryNumber"
│   ├── [FIELD] "unit.condition"
│   ├── [FIELD] "unit.qc"
│   └── [FIELD] "receivingForm.notes"
├── ⚡ ACTION BUTTONS & TRIGGERS (9 buttons)
│   ├── [BUTTON] "Back to PO"
│   ├── [BUTTON] "Save Draft"
│   ├── [BUTTON] "Edit Quantities"
│   ├── [BUTTON] "Re-scan / Generate IDs"
│   ├── [BUTTON] "Cancel"
│   ├── [BUTTON] "&larr; Make Changes"
│   ├── [BUTTON] "&larr; Back to Quantity Entry"
│   ├── [BUTTON] "Confirm & Post Receipt"
│   └── [BUTTON] "Post Receipt Now"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/procurement/receipts`
- **Route Name:** `procurement-receipts`
- **Source Component:** [`src/views/procurement/ReceivePurchase.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/procurement/ReceivePurchase.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/procurement/receipts [procurement-receipts]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Receive Purchase (GRN)"
│   ├── "Goods Receipt & Inwarding"
│   ├── "Purchase Order Not Found"
│   ├── "Unauthorized Branch Access"
│   └── "Please correct the following errors before proceeding:"
├── 📑 NAVIGATION TABS & FILTER PILLS (1 tabs)
│   └── [TAB] "Review GRN &rarr;"
├── 📋 DATA TABLES & GRID COLUMNS (3 tables)
│   ├── [TABLE 1] Columns:
│   │   ├── [COL] "Product / SKU"
│   │   ├── [COL] "Ordered"
│   │   ├── [COL] "Prev. Received"
│   │   ├── [COL] "Outstanding"
│   │   ├── [COL] "Current Received"
│   │   ├── [COL] "Damaged"
│   │   ├── [COL] "Accepted"
│   │   ├── [COL] "Short"
│   │   ├── [COL] "Excess"
│   │   └── [COL] "Discrepancy Reason"
│   ├── [TABLE 2] Columns:
│   │   ├── [COL] "#"
│   │   ├── [COL] "Product"
│   │   ├── [COL] "Chassis / VIN"
│   │   ├── [COL] "Motor Serial"
│   │   ├── [COL] "Battery Serial"
│   │   ├── [COL] "Condition"
│   │   └── [COL] "QC Decision"
│   ├── [TABLE 3] Columns:
│   │   ├── [COL] "Product"
│   │   ├── [COL] "Ordered"
│   │   ├── [COL] "Prev. Rec"
│   │   ├── [COL] "Current Rec"
│   │   ├── [COL] "Accepted"
│   │   ├── [COL] "Short"
│   │   ├── [COL] "Excess"
│   │   ├── [COL] "Damaged"
│   │   └── [COL] "Discrepancy Notes"
├── 📝 FORM FIELDS & INPUT CONTROLS (10 fields)
│   ├── [FIELD] "receivingForm.location"
│   ├── [FIELD] "receivingForm.receiver"
│   ├── [FIELD] "receivingForm.receiptDate"
│   ├── [FIELD] "receivingForm.deliveryNote"
│   ├── [FIELD] "unit.chassis"
│   ├── [FIELD] "unit.motorNumber"
│   ├── [FIELD] "unit.batteryNumber"
│   ├── [FIELD] "unit.condition"
│   ├── [FIELD] "unit.qc"
│   └── [FIELD] "receivingForm.notes"
├── ⚡ ACTION BUTTONS & TRIGGERS (9 buttons)
│   ├── [BUTTON] "Back to PO"
│   ├── [BUTTON] "Save Draft"
│   ├── [BUTTON] "Edit Quantities"
│   ├── [BUTTON] "Re-scan / Generate IDs"
│   ├── [BUTTON] "Cancel"
│   ├── [BUTTON] "&larr; Make Changes"
│   ├── [BUTTON] "&larr; Back to Quantity Entry"
│   ├── [BUTTON] "Confirm & Post Receipt"
│   └── [BUTTON] "Post Receipt Now"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/procurement/receive-purchase`
- **Route Name:** `procurement-receive-purchase-alias`
- **Source Component:** [`src/views/procurement/ReceivePurchase.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/procurement/ReceivePurchase.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/procurement/receive-purchase [procurement-receive-purchase-alias]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Receive Purchase (GRN)"
│   ├── "Goods Receipt & Inwarding"
│   ├── "Purchase Order Not Found"
│   ├── "Unauthorized Branch Access"
│   └── "Please correct the following errors before proceeding:"
├── 📑 NAVIGATION TABS & FILTER PILLS (1 tabs)
│   └── [TAB] "Review GRN &rarr;"
├── 📋 DATA TABLES & GRID COLUMNS (3 tables)
│   ├── [TABLE 1] Columns:
│   │   ├── [COL] "Product / SKU"
│   │   ├── [COL] "Ordered"
│   │   ├── [COL] "Prev. Received"
│   │   ├── [COL] "Outstanding"
│   │   ├── [COL] "Current Received"
│   │   ├── [COL] "Damaged"
│   │   ├── [COL] "Accepted"
│   │   ├── [COL] "Short"
│   │   ├── [COL] "Excess"
│   │   └── [COL] "Discrepancy Reason"
│   ├── [TABLE 2] Columns:
│   │   ├── [COL] "#"
│   │   ├── [COL] "Product"
│   │   ├── [COL] "Chassis / VIN"
│   │   ├── [COL] "Motor Serial"
│   │   ├── [COL] "Battery Serial"
│   │   ├── [COL] "Condition"
│   │   └── [COL] "QC Decision"
│   ├── [TABLE 3] Columns:
│   │   ├── [COL] "Product"
│   │   ├── [COL] "Ordered"
│   │   ├── [COL] "Prev. Rec"
│   │   ├── [COL] "Current Rec"
│   │   ├── [COL] "Accepted"
│   │   ├── [COL] "Short"
│   │   ├── [COL] "Excess"
│   │   ├── [COL] "Damaged"
│   │   └── [COL] "Discrepancy Notes"
├── 📝 FORM FIELDS & INPUT CONTROLS (10 fields)
│   ├── [FIELD] "receivingForm.location"
│   ├── [FIELD] "receivingForm.receiver"
│   ├── [FIELD] "receivingForm.receiptDate"
│   ├── [FIELD] "receivingForm.deliveryNote"
│   ├── [FIELD] "unit.chassis"
│   ├── [FIELD] "unit.motorNumber"
│   ├── [FIELD] "unit.batteryNumber"
│   ├── [FIELD] "unit.condition"
│   ├── [FIELD] "unit.qc"
│   └── [FIELD] "receivingForm.notes"
├── ⚡ ACTION BUTTONS & TRIGGERS (9 buttons)
│   ├── [BUTTON] "Back to PO"
│   ├── [BUTTON] "Save Draft"
│   ├── [BUTTON] "Edit Quantities"
│   ├── [BUTTON] "Re-scan / Generate IDs"
│   ├── [BUTTON] "Cancel"
│   ├── [BUTTON] "&larr; Make Changes"
│   ├── [BUTTON] "&larr; Back to Quantity Entry"
│   ├── [BUTTON] "Confirm & Post Receipt"
│   └── [BUTTON] "Post Receipt Now"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/procurement/receipts/detail`
- **Route Name:** `procurement-receipt-detail-legacy`
- **Source Component:** [`src/views/procurement/ReceiptDetail.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/procurement/ReceiptDetail.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/procurement/receipts/detail [procurement-receipt-detail-legacy]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Total Received"
│   ├── "Accepted into Stock"
│   ├── "Damaged / QC Hold"
│   ├── "Discrepancy Items"
│   └── "Receipt Metadata"
├── 📑 NAVIGATION TABS & FILTER PILLS (8 tabs)
│   ├── [TAB] "Summary"
│   ├── [TAB] "Received Lines"
│   ├── [TAB] "Serial & Chassis Units"
│   ├── [TAB] "Discrepancies"
│   ├── [TAB] "QC"
│   ├── [TAB] "Costs"
│   ├── [TAB] "Documents"
│   └── [TAB] "Activity"
├── ⚡ ACTION BUTTONS & TRIGGERS (2 buttons)
│   ├── [BUTTON] "Back to PO"
│   └── [BUTTON] "Open PO"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/procurement/receipts/:id`
- **Route Name:** `procurement-receipt-detail`
- **Source Component:** [`src/views/procurement/ReceiptDetail.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/procurement/ReceiptDetail.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/procurement/receipts/:id [procurement-receipt-detail]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Total Received"
│   ├── "Accepted into Stock"
│   ├── "Damaged / QC Hold"
│   ├── "Discrepancy Items"
│   └── "Receipt Metadata"
├── 📑 NAVIGATION TABS & FILTER PILLS (8 tabs)
│   ├── [TAB] "Summary"
│   ├── [TAB] "Received Lines"
│   ├── [TAB] "Serial & Chassis Units"
│   ├── [TAB] "Discrepancies"
│   ├── [TAB] "QC"
│   ├── [TAB] "Costs"
│   ├── [TAB] "Documents"
│   └── [TAB] "Activity"
├── ⚡ ACTION BUTTONS & TRIGGERS (2 buttons)
│   ├── [BUTTON] "Back to PO"
│   └── [BUTTON] "Open PO"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/procurement/landed-costs`
- **Route Name:** `procurement-landed-costs`
- **Source Component:** [`src/views/procurement/LandedCost.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/procurement/LandedCost.vue)
- **RBAC Access:** 🔒 **[Role Restricted / Super Admin Only]** (Roles: `Super Admin`)

```text
/procurement/landed-costs [procurement-landed-costs]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Success"
│   ├── "Landed Cost"
│   ├── "Landed Cost &middot; GR-991"
│   ├── "Cost Components"
│   └── "Allocation Rule"
├── 📋 DATA TABLES & GRID COLUMNS (2 tables)
│   ├── [TABLE 1] Columns:
│   │   ├── [COL] "Component"
│   │   ├── [COL] "Amount"
│   │   └── [COL] "Source"
│   ├── [TABLE 2] Columns:
│   │   ├── [COL] "Product"
│   │   ├── [COL] "Qty"
│   │   ├── [COL] "Base / Unit"
│   │   ├── [COL] "Allocated Add-on"
│   │   └── [COL] "Final Landed / Unit"
├── ⚡ ACTION BUTTONS & TRIGGERS (3 buttons)
│   ├── [BUTTON] "Save Draft"
│   ├── [BUTTON] "Cancel"
│   └── [BUTTON] "Post Landed Cost"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/procurement/vendor-bills`
- **Route Name:** `procurement-vendor-bills`
- **Source Component:** [`src/views/procurement/VendorBills.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/procurement/VendorBills.vue)
- **RBAC Access:** 🔒 **[Role Restricted / Super Admin Only]** (Roles: `Super Admin`)

```text
/procurement/vendor-bills [procurement-vendor-bills]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Vendor Bills"
│   ├── "Open Bills"
│   ├── "Due This Week"
│   ├── "Outstanding"
│   └── "PKR 6.1M"
├── 📑 NAVIGATION TABS & FILTER PILLS (2 tabs)
│   ├── [TAB] "Clear Filters"
│   └── [TAB] "Reset filters"
├── 📋 DATA TABLES & GRID COLUMNS (1 tables)
│   ├── [TABLE 1] Columns:
│   │   ├── [COL] "Bill"
│   │   ├── [COL] "Supplier"
│   │   ├── [COL] "PO"
│   │   ├── [COL] "Receipt"
│   │   ├── [COL] "Amount"
│   │   ├── [COL] "Due"
│   │   ├── [COL] "Paid"
│   │   ├── [COL] "Outstanding"
│   │   ├── [COL] "Match"
│   │   └── [COL] "Actions"
├── 📝 FORM FIELDS & INPUT CONTROLS (1 fields)
│   └── [FIELD] "searchQuery"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/procurement/purchase-returns`
- **Route Name:** `procurement-purchase-returns`
- **Source Component:** [`src/views/procurement/PurchaseReturns.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/procurement/PurchaseReturns.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/procurement/purchase-returns [procurement-purchase-returns]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Purchase Returns"
│   ├── "Create Purchase Return"
│   ├── "Closed"
│   ├── "Approved"
│   └── "Shipped"
├── 📑 NAVIGATION TABS & FILTER PILLS (2 tabs)
│   ├── [TAB] "Clear"
│   └── [TAB] "Reset filters"
├── 📋 DATA TABLES & GRID COLUMNS (1 tables)
│   ├── [TABLE 1] Columns:
│   │   ├── [COL] "Return"
│   │   ├── [COL] "Supplier"
│   │   ├── [COL] "PO"
│   │   ├── [COL] "Units"
│   │   ├── [COL] "Reason"
│   │   ├── [COL] "Credit"
│   │   ├── [COL] "Status"
│   │   └── [COL] "Action"
├── 📝 FORM FIELDS & INPUT CONTROLS (1 fields)
│   └── [FIELD] "searchQuery"
├── ⚡ ACTION BUTTONS & TRIGGERS (1 buttons)
│   └── [BUTTON] "Create Purchase Return"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/procurement/purchase-returns/create`
- **Route Name:** `procurement-create-purchase-return`
- **Source Component:** [`src/views/procurement/CreatePurchaseReturn.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/procurement/CreatePurchaseReturn.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/procurement/purchase-returns/create [procurement-create-purchase-return]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Create"
│   ├── "Create Purchase Return"
│   ├── "Return Details"
│   ├── "Units to Return"
│   └── "Summary"
├── 📋 DATA TABLES & GRID COLUMNS (1 tables)
│   ├── [TABLE 1] Columns:
│   │   ├── [COL] "Product / Serial"
│   │   └── [COL] "Credit Value"
├── 📝 FORM FIELDS & INPUT CONTROLS (3 fields)
│   ├── [FIELD] "e.g. Transit damage, QC failure"
│   ├── [FIELD] "Select product or scan serial"
│   └── [FIELD] "PKR"
├── ⚡ ACTION BUTTONS & TRIGGERS (5 buttons)
│   ├── [BUTTON] "Save Draft"
│   ├── [BUTTON] "+ Add Item"
│   ├── [BUTTON] "&times;"
│   ├── [BUTTON] "Cancel"
│   └── [BUTTON] "Submit Return"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/procurement/purchase-returns/detail`
- **Route Name:** `procurement-purchase-return-detail-legacy`
- **Source Component:** [`src/views/procurement/PurchaseReturnDetail.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/procurement/PurchaseReturnDetail.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/procurement/purchase-returns/detail [procurement-purchase-return-detail-legacy]
│
├── 🏷️ HEADERS & TITLES
│   ├── "PRTN-044"
│   ├── "Units"
│   ├── "Expected Credit"
│   ├── "PKR 336K"
│   └── "Shipped"
├── 📑 NAVIGATION TABS & FILTER PILLS (7 tabs)
│   ├── [TAB] "Summary"
│   ├── [TAB] "Units"
│   ├── [TAB] "Shipment Back"
│   ├── [TAB] "Supplier Credit"
│   ├── [TAB] "Financial Effect"
│   ├── [TAB] "Documents"
│   └── [TAB] "Activity"
├── ⚡ ACTION BUTTONS & TRIGGERS (2 buttons)
│   ├── [BUTTON] "Update Return"
│   └── [BUTTON] "More ▼"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/procurement/purchase-returns/:id`
- **Route Name:** `procurement-purchase-return-detail`
- **Source Component:** [`src/views/procurement/PurchaseReturnDetail.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/procurement/PurchaseReturnDetail.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/procurement/purchase-returns/:id [procurement-purchase-return-detail]
│
├── 🏷️ HEADERS & TITLES
│   ├── "PRTN-044"
│   ├── "Units"
│   ├── "Expected Credit"
│   ├── "PKR 336K"
│   └── "Shipped"
├── 📑 NAVIGATION TABS & FILTER PILLS (7 tabs)
│   ├── [TAB] "Summary"
│   ├── [TAB] "Units"
│   ├── [TAB] "Shipment Back"
│   ├── [TAB] "Supplier Credit"
│   ├── [TAB] "Financial Effect"
│   ├── [TAB] "Documents"
│   └── [TAB] "Activity"
├── ⚡ ACTION BUTTONS & TRIGGERS (2 buttons)
│   ├── [BUTTON] "Update Return"
│   └── [BUTTON] "More ▼"
└── (No secondary dialogs)
```

### 📁 MODULE: `INVENTORY` (35 Total Routes)

#### 📍 ROUTE: `/inventory/dashboard`
- **Route Name:** `inventory-dashboard`
- **Source Component:** [`src/views/inventory/InventoryDashboard.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/inventory/InventoryDashboard.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/inventory/dashboard [inventory-dashboard]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Branch Inventory Dashboard"
│   ├── "Inventory Status"
│   ├── "Branch Inventory Value"
│   ├── "Visibility"
│   └── "Shown only if authorised"
├── 📊 SNAPSHOT METRICS & KPI CARDS (17 cards)
│   ├── [KPI CARD] Available ➔ String(branchStats.value.available)
│   ├── [KPI CARD] Reserved ➔ String(branchStats.value.reserved)
│   ├── [KPI CARD] Transfer In Transit ➔ String(branchStats.value.inTransit)
│   ├── [KPI CARD] Supplier In Transit ➔ '2'
│   ├── [KPI CARD] QC Hold ➔ String(branchStats.value.qcHold)
│   ├── [KPI CARD] Returned ➔ '1'
│   ├── [KPI CARD] Service / Maint. ➔ String(branchStats.value.maintenance)
│   ├── [KPI CARD] Serialized Units ➔ String(branchStats.value.serialized)
│   ├── [KPI CARD] Low Stock Alert ➔ `${lowStockCount
│   ├── [KPI CARD] Total Catalog ➔ `${store.products.length
│   ├── [KPI CARD] Peshawar ➔ pesh
│   ├── [KPI CARD] Islamabad ➔ isl
│   ├── [KPI CARD] Lahore ➔ lhr
│   ├── [KPI CARD] Rawalpindi ➔ rwp
│   ├── [KPI CARD] Healthy ➔ healthy
│   ├── [KPI CARD] Low ➔ low
│   └── [KPI CARD] Critical ➔ critical
├── 📋 DATA TABLES & GRID COLUMNS (1 tables)
│   ├── [TABLE 1] Columns:
│   │   ├── [COL] "Product"
│   │   ├── [COL] "Branch"
│   │   ├── [COL] "Available"
│   │   ├── [COL] "Reorder"
│   │   ├── [COL] "Age"
│   │   ├── [COL] "Alert"
│   │   └── [COL] "Action"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/inventory/stock-by-product`
- **Route Name:** `inventory-stock-by-product`
- **Source Component:** [`src/views/inventory/StockByProduct.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/inventory/StockByProduct.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/inventory/stock-by-product [inventory-stock-by-product]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Stock by Product"
│   ├── "Columns"
│   └── "Export"
├── 📑 NAVIGATION TABS & FILTER PILLS (4 tabs)
│   ├── [TAB] "Clear"
│   ├── [TAB] "Clear all filters"
│   ├── [TAB] "Reset Filters"
│   └── [TAB] "Reset filters"
├── 📊 SNAPSHOT METRICS & KPI CARDS (4 cards)
│   ├── [KPI CARD] Products ➔ String(products.length)
│   ├── [KPI CARD] Low Stock ➔ String(lowStock)
│   ├── [KPI CARD] Incoming ➔ `${totalIncoming
│   └── [KPI CARD] Out of Stock ➔ String(outOfStock)
├── 📋 DATA TABLES & GRID COLUMNS (2 tables)
│   ├── [TABLE 1] Columns:
│   │   ├── [COL] "Product"
│   │   ├── [COL] "SKU"
│   │   ├── [COL] "Category"
│   │   ├── [COL] "Available"
│   │   ├── [COL] "Reserved"
│   │   ├── [COL] "Incoming"
│   │   └── [COL] "Reorder Level"
│   ├── [TABLE 2] Columns:
│   │   ├── [COL] "Product"
│   │   ├── [COL] "SKU"
│   │   ├── [COL] "Category"
│   │   ├── [COL] "Total"
│   │   ├── [COL] "Available"
│   │   ├── [COL] "Reserved"
│   │   ├── [COL] "Peshawar"
│   │   ├── [COL] "Islamabad"
│   │   ├── [COL] "Incoming"
│   │   ├── [COL] "Reorder"
│   │   └── [COL] "Value"
├── 📝 FORM FIELDS & INPUT CONTROLS (2 fields)
│   ├── [FIELD] "branchSearchQuery"
│   └── [FIELD] "searchQuery"
├── ⚡ ACTION BUTTONS & TRIGGERS (3 buttons)
│   ├── [BUTTON] "Columns"
│   ├── [BUTTON] "Export"
│   └── [BUTTON] "Request Stock"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/inventory/serialized-units`
- **Route Name:** `inventory-serialized-units`
- **Source Component:** [`src/views/inventory/SerializedUnits.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/inventory/SerializedUnits.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/inventory/serialized-units [inventory-serialized-units]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Serialized Units"
│   ├── "Columns"
│   ├── "Export"
│   └── "Serialized Unit Register"
├── 📑 NAVIGATION TABS & FILTER PILLS (4 tabs)
│   ├── [TAB] "Clear"
│   ├── [TAB] "Clear all filters"
│   ├── [TAB] "Clear Filters"
│   └── [TAB] "Reset filters"
├── 📊 SNAPSHOT METRICS & KPI CARDS (4 cards)
│   ├── [KPI CARD] Units ➔ String(stats.serialized)
│   ├── [KPI CARD] Available ➔ String(stats.available)
│   ├── [KPI CARD] Reserved ➔ String(stats.reserved)
│   └── [KPI CARD] QC / Service ➔ String(stats.qcHold + stats.maintenance)
├── 📋 DATA TABLES & GRID COLUMNS (2 tables)
│   ├── [TABLE 1] Columns:
│   │   ├── [COL] "Serial / Chassis"
│   │   ├── [COL] "Product"
│   │   ├── [COL] "Location"
│   │   ├── [COL] "Status"
│   │   ├── [COL] "Order / Customer"
│   │   ├── [COL] "Source"
│   │   └── [COL] "Actions"
│   ├── [TABLE 2] Columns:
│   │   ├── [COL] "Serial"
│   │   ├── [COL] "Chassis"
│   │   ├── [COL] "Product"
│   │   ├── [COL] "Branch"
│   │   ├── [COL] "Location"
│   │   ├── [COL] "Source PO"
│   │   ├── [COL] "Landed Cost"
│   │   ├── [COL] "Status"
│   │   ├── [COL] "Customer"
│   │   └── [COL] "Order"
├── 📝 FORM FIELDS & INPUT CONTROLS (2 fields)
│   ├── [FIELD] "branchSearchQuery"
│   └── [FIELD] "searchQuery"
├── ⚡ ACTION BUTTONS & TRIGGERS (3 buttons)
│   ├── [BUTTON] "Columns"
│   ├── [BUTTON] "Export"
│   └── [BUTTON] "Open &rsaquo;"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/inventory/serialized-units/detail`
- **Route Name:** `inventory-unit-detail-legacy`
- **Source Component:** [`src/views/inventory/UnitDetail.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/inventory/UnitDetail.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/inventory/serialized-units/detail [inventory-unit-detail-legacy]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Serialized Unit Not Found"
│   ├── "Branch Context"
│   ├── "Status"
│   ├── "Branch"
│   └── "Location"
├── 📑 NAVIGATION TABS & FILTER PILLS (6 tabs)
│   ├── [TAB] "Overview"
│   ├── [TAB] "Identification"
│   ├── [TAB] "Cost"
│   ├── [TAB] "Location"
│   ├── [TAB] "Purchase Source"
│   └── [TAB] "Timeline"
├── 📊 SNAPSHOT METRICS & KPI CARDS (25 cards)
│   ├── [KPI CARD] Product ➔ u.product || 'BRG DS11'
│   ├── [KPI CARD] Serial Number ➔ u.serial || u.id
│   ├── [KPI CARD] Chassis Number ➔ u.chassis || 'CH-90111'
│   ├── [KPI CARD] VIN ➔ u.vin || u.chassis || 'VIN-UNKNOWN'
│   ├── [KPI CARD] Current Status ➔ u.status || 'Available'
│   ├── [KPI CARD] Branch / Bay ➔ `${branchName
│   ├── [KPI CARD] Chassis No. ➔ u.chassis || 'N/A'
│   ├── [KPI CARD] Motor Serial ➔ u.motorSerial || 'MTR-44102'
│   ├── [KPI CARD] Battery Serial ➔ u.batterySerial || 'BAT-88210'
│   ├── [KPI CARD] Color / Variant ➔ u.color || 'Onyx Black'
│   ├── [KPI CARD] Product Model ➔ u.product || 'BRG DS11'
│   ├── [KPI CARD] Assigned Branch ➔ `${branchName
│   ├── [KPI CARD] Current Bay ➔ u.location || 'Showroom Floor'
│   ├── [KPI CARD] Storage Sub-zone ➔ 'Display Zone A'
│   ├── [KPI CARD] Status at Location ➔ u.status
│   ├── [KPI CARD] Last Inspected ➔ 'Recent cycle count'
│   ├── [KPI CARD] Assigned Handler ➔ 'Branch Inventory Lead'
│   ├── [KPI CARD] Latest Movement ➔ u.source || u.sourcePo || 'Initial Inwarding'
│   ├── [KPI CARD] Source Inwarding ➔ u.sourcePo || 'PO-2026-001'
│   ├── [KPI CARD] Current Location ➔ `${branchName
│   ├── [KPI CARD] Physical Transfer State ➔ u.status === 'In Transit' ? 'In Transit between branches' : 'Stationed at branch'
│   ├── [KPI CARD] Sale Status ➔ u.status === 'Sold' ? 'Sold to Customer' : 'Unsold (In Inventory)'
│   ├── [KPI CARD] Reservation State ➔ u.status === 'Reserved' ? `Reserved for ${u.customer || 'Customer Order'
│   ├── [KPI CARD] Customer Name ➔ u.customer || '—'
│   └── [KPI CARD] Linked Order ➔ u.order || '—'
├── ⚡ ACTION BUTTONS & TRIGGERS (2 buttons)
│   ├── [BUTTON] "&larr; Back to Serialized Units"
│   └── [BUTTON] "Back"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/inventory/serialized-units/:id`
- **Route Name:** `inventory-unit-detail`
- **Source Component:** [`src/views/inventory/UnitDetail.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/inventory/UnitDetail.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/inventory/serialized-units/:id [inventory-unit-detail]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Serialized Unit Not Found"
│   ├── "Branch Context"
│   ├── "Status"
│   ├── "Branch"
│   └── "Location"
├── 📑 NAVIGATION TABS & FILTER PILLS (6 tabs)
│   ├── [TAB] "Overview"
│   ├── [TAB] "Identification"
│   ├── [TAB] "Cost"
│   ├── [TAB] "Location"
│   ├── [TAB] "Purchase Source"
│   └── [TAB] "Timeline"
├── 📊 SNAPSHOT METRICS & KPI CARDS (25 cards)
│   ├── [KPI CARD] Product ➔ u.product || 'BRG DS11'
│   ├── [KPI CARD] Serial Number ➔ u.serial || u.id
│   ├── [KPI CARD] Chassis Number ➔ u.chassis || 'CH-90111'
│   ├── [KPI CARD] VIN ➔ u.vin || u.chassis || 'VIN-UNKNOWN'
│   ├── [KPI CARD] Current Status ➔ u.status || 'Available'
│   ├── [KPI CARD] Branch / Bay ➔ `${branchName
│   ├── [KPI CARD] Chassis No. ➔ u.chassis || 'N/A'
│   ├── [KPI CARD] Motor Serial ➔ u.motorSerial || 'MTR-44102'
│   ├── [KPI CARD] Battery Serial ➔ u.batterySerial || 'BAT-88210'
│   ├── [KPI CARD] Color / Variant ➔ u.color || 'Onyx Black'
│   ├── [KPI CARD] Product Model ➔ u.product || 'BRG DS11'
│   ├── [KPI CARD] Assigned Branch ➔ `${branchName
│   ├── [KPI CARD] Current Bay ➔ u.location || 'Showroom Floor'
│   ├── [KPI CARD] Storage Sub-zone ➔ 'Display Zone A'
│   ├── [KPI CARD] Status at Location ➔ u.status
│   ├── [KPI CARD] Last Inspected ➔ 'Recent cycle count'
│   ├── [KPI CARD] Assigned Handler ➔ 'Branch Inventory Lead'
│   ├── [KPI CARD] Latest Movement ➔ u.source || u.sourcePo || 'Initial Inwarding'
│   ├── [KPI CARD] Source Inwarding ➔ u.sourcePo || 'PO-2026-001'
│   ├── [KPI CARD] Current Location ➔ `${branchName
│   ├── [KPI CARD] Physical Transfer State ➔ u.status === 'In Transit' ? 'In Transit between branches' : 'Stationed at branch'
│   ├── [KPI CARD] Sale Status ➔ u.status === 'Sold' ? 'Sold to Customer' : 'Unsold (In Inventory)'
│   ├── [KPI CARD] Reservation State ➔ u.status === 'Reserved' ? `Reserved for ${u.customer || 'Customer Order'
│   ├── [KPI CARD] Customer Name ➔ u.customer || '—'
│   └── [KPI CARD] Linked Order ➔ u.order || '—'
├── ⚡ ACTION BUTTONS & TRIGGERS (2 buttons)
│   ├── [BUTTON] "&larr; Back to Serialized Units"
│   └── [BUTTON] "Back"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/inventory/units/:id`
- **Route Name:** `inventory-unit-detail-alias`
- **Source Component:** [`src/views/inventory/UnitDetail.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/inventory/UnitDetail.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/inventory/units/:id [inventory-unit-detail-alias]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Serialized Unit Not Found"
│   ├── "Branch Context"
│   ├── "Status"
│   ├── "Branch"
│   └── "Location"
├── 📑 NAVIGATION TABS & FILTER PILLS (6 tabs)
│   ├── [TAB] "Overview"
│   ├── [TAB] "Identification"
│   ├── [TAB] "Cost"
│   ├── [TAB] "Location"
│   ├── [TAB] "Purchase Source"
│   └── [TAB] "Timeline"
├── 📊 SNAPSHOT METRICS & KPI CARDS (25 cards)
│   ├── [KPI CARD] Product ➔ u.product || 'BRG DS11'
│   ├── [KPI CARD] Serial Number ➔ u.serial || u.id
│   ├── [KPI CARD] Chassis Number ➔ u.chassis || 'CH-90111'
│   ├── [KPI CARD] VIN ➔ u.vin || u.chassis || 'VIN-UNKNOWN'
│   ├── [KPI CARD] Current Status ➔ u.status || 'Available'
│   ├── [KPI CARD] Branch / Bay ➔ `${branchName
│   ├── [KPI CARD] Chassis No. ➔ u.chassis || 'N/A'
│   ├── [KPI CARD] Motor Serial ➔ u.motorSerial || 'MTR-44102'
│   ├── [KPI CARD] Battery Serial ➔ u.batterySerial || 'BAT-88210'
│   ├── [KPI CARD] Color / Variant ➔ u.color || 'Onyx Black'
│   ├── [KPI CARD] Product Model ➔ u.product || 'BRG DS11'
│   ├── [KPI CARD] Assigned Branch ➔ `${branchName
│   ├── [KPI CARD] Current Bay ➔ u.location || 'Showroom Floor'
│   ├── [KPI CARD] Storage Sub-zone ➔ 'Display Zone A'
│   ├── [KPI CARD] Status at Location ➔ u.status
│   ├── [KPI CARD] Last Inspected ➔ 'Recent cycle count'
│   ├── [KPI CARD] Assigned Handler ➔ 'Branch Inventory Lead'
│   ├── [KPI CARD] Latest Movement ➔ u.source || u.sourcePo || 'Initial Inwarding'
│   ├── [KPI CARD] Source Inwarding ➔ u.sourcePo || 'PO-2026-001'
│   ├── [KPI CARD] Current Location ➔ `${branchName
│   ├── [KPI CARD] Physical Transfer State ➔ u.status === 'In Transit' ? 'In Transit between branches' : 'Stationed at branch'
│   ├── [KPI CARD] Sale Status ➔ u.status === 'Sold' ? 'Sold to Customer' : 'Unsold (In Inventory)'
│   ├── [KPI CARD] Reservation State ➔ u.status === 'Reserved' ? `Reserved for ${u.customer || 'Customer Order'
│   ├── [KPI CARD] Customer Name ➔ u.customer || '—'
│   └── [KPI CARD] Linked Order ➔ u.order || '—'
├── ⚡ ACTION BUTTONS & TRIGGERS (2 buttons)
│   ├── [BUTTON] "&larr; Back to Serialized Units"
│   └── [BUTTON] "Back"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/inventory/transfers`
- **Route Name:** `inventory-transfers`
- **Source Component:** [`src/views/inventory/Transfers.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/inventory/Transfers.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/inventory/transfers [inventory-transfers]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Transfers"
│   ├── "Create Transfer"
│   ├── "Branch Transfers"
│   └── "Transfer Contents"
├── 📑 NAVIGATION TABS & FILTER PILLS (6 tabs)
│   ├── [TAB] "All"
│   ├── [TAB] "Requested"
│   ├── [TAB] "Approved"
│   ├── [TAB] "Picking"
│   ├── [TAB] "In Transit"
│   └── [TAB] "Received"
├── 📊 SNAPSHOT METRICS & KPI CARDS (4 cards)
│   ├── [KPI CARD] Incoming ➔ String(branchTransfers.value.filter(t => t.direction === 'Inbound' && t.status !== 'Received').length)
│   ├── [KPI CARD] Outgoing ➔ String(branchTransfers.value.filter(t => t.direction === 'Outbound' && t.status !== 'Received').length)
│   ├── [KPI CARD] In Transit ➔ String(branchTransfers.value.filter(t => t.status === 'In Transit').length)
│   └── [KPI CARD] Received ➔ String(branchTransfers.value.filter(t => t.status === 'Received').length)
├── 📋 DATA TABLES & GRID COLUMNS (1 tables)
│   ├── [TABLE 1] Columns:
│   │   ├── [COL] "Transfer"
│   │   ├── [COL] "Direction"
│   │   ├── [COL] "From / To"
│   │   ├── [COL] "Units"
│   │   ├── [COL] "Dispatched"
│   │   ├── [COL] "Expected"
│   │   ├── [COL] "Status"
│   │   ├── [COL] "Actions"
│   │   ├── [COL] "Category"
│   │   ├── [COL] "Product Name"
│   │   └── [COL] "Quantity"
├── 📝 FORM FIELDS & INPUT CONTROLS (1 fields)
│   └── [FIELD] "branchSearchQuery"
├── ⚡ ACTION BUTTONS & TRIGGERS (2 buttons)
│   ├── [BUTTON] "Create Transfer"
│   └── [BUTTON] "Open &rsaquo;"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/inventory/transfers/create`
- **Route Name:** `inventory-create-transfer`
- **Source Component:** [`src/views/inventory/CreateTransfer.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/inventory/CreateTransfer.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/inventory/transfers/create [inventory-create-transfer]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Dealership Custody Rule:"
│   ├── "Transfer Route & Stock"
│   └── "Dispatch & Carrier Logistics"
├── 📝 FORM FIELDS & INPUT CONTROLS (10 fields)
│   ├── [FIELD] "form.fromBranch"
│   ├── [FIELD] "form.toBranch"
│   ├── [FIELD] "form.productId"
│   ├── [FIELD] "form.units"
│   ├── [FIELD] "form.requestedDate"
│   ├── [FIELD] "form.carrier"
│   ├── [FIELD] "form.driverContact"
│   ├── [FIELD] "form.gatePassNo"
│   ├── [FIELD] "form.expectedArrival"
│   └── [FIELD] "form.notes"
├── ⚡ ACTION BUTTONS & TRIGGERS (1 buttons)
│   └── [BUTTON] "Cancel"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/inventory/transfers/receive`
- **Route Name:** `inventory-receive-transfer`
- **Source Component:** [`src/views/inventory/ReceiveTransfer.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/inventory/ReceiveTransfer.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/inventory/transfers/receive [inventory-receive-transfer]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Transfer Record Not Found"
│   ├── "Transfer Already Fully Received"
│   ├── "Origin Branch"
│   ├── "Destination Branch"
│   └── "Carrier / Vehicle"
├── 📋 DATA TABLES & GRID COLUMNS (1 tables)
│   ├── [TABLE 1] Columns:
│   │   ├── [COL] "Product"
│   │   ├── [COL] "Type"
│   │   ├── [COL] "Dispatched"
│   │   ├── [COL] "Prev. Received"
│   │   ├── [COL] "Remaining"
│   │   ├── [COL] "Received Now *"
│   │   ├── [COL] "Damaged Qty"
│   │   └── [COL] "Shortage"
├── 📝 FORM FIELDS & INPUT CONTROLS (3 fields)
│   ├── [FIELD] "receiverName"
│   ├── [FIELD] "receiverLocation"
│   └── [FIELD] "receiverNotes"
├── ⚡ ACTION BUTTONS & TRIGGERS (4 buttons)
│   ├── [BUTTON] "Back"
│   ├── [BUTTON] "View All Transfers"
│   ├── [BUTTON] "View Complete Transfer Details &rsaquo;"
│   └── [BUTTON] "Confirm Arrival &amp; Post"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/inventory/transfers/receive/:id`
- **Route Name:** `inventory-receive-transfer-id`
- **Source Component:** [`src/views/inventory/ReceiveTransfer.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/inventory/ReceiveTransfer.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/inventory/transfers/receive/:id [inventory-receive-transfer-id]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Transfer Record Not Found"
│   ├── "Transfer Already Fully Received"
│   ├── "Origin Branch"
│   ├── "Destination Branch"
│   └── "Carrier / Vehicle"
├── 📋 DATA TABLES & GRID COLUMNS (1 tables)
│   ├── [TABLE 1] Columns:
│   │   ├── [COL] "Product"
│   │   ├── [COL] "Type"
│   │   ├── [COL] "Dispatched"
│   │   ├── [COL] "Prev. Received"
│   │   ├── [COL] "Remaining"
│   │   ├── [COL] "Received Now *"
│   │   ├── [COL] "Damaged Qty"
│   │   └── [COL] "Shortage"
├── 📝 FORM FIELDS & INPUT CONTROLS (3 fields)
│   ├── [FIELD] "receiverName"
│   ├── [FIELD] "receiverLocation"
│   └── [FIELD] "receiverNotes"
├── ⚡ ACTION BUTTONS & TRIGGERS (4 buttons)
│   ├── [BUTTON] "Back"
│   ├── [BUTTON] "View All Transfers"
│   ├── [BUTTON] "View Complete Transfer Details &rsaquo;"
│   └── [BUTTON] "Confirm Arrival &amp; Post"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/inventory/transfers/:id/receive`
- **Route Name:** `inventory-receive-transfer-param`
- **Source Component:** [`src/views/inventory/ReceiveTransfer.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/inventory/ReceiveTransfer.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/inventory/transfers/:id/receive [inventory-receive-transfer-param]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Transfer Record Not Found"
│   ├── "Transfer Already Fully Received"
│   ├── "Origin Branch"
│   ├── "Destination Branch"
│   └── "Carrier / Vehicle"
├── 📋 DATA TABLES & GRID COLUMNS (1 tables)
│   ├── [TABLE 1] Columns:
│   │   ├── [COL] "Product"
│   │   ├── [COL] "Type"
│   │   ├── [COL] "Dispatched"
│   │   ├── [COL] "Prev. Received"
│   │   ├── [COL] "Remaining"
│   │   ├── [COL] "Received Now *"
│   │   ├── [COL] "Damaged Qty"
│   │   └── [COL] "Shortage"
├── 📝 FORM FIELDS & INPUT CONTROLS (3 fields)
│   ├── [FIELD] "receiverName"
│   ├── [FIELD] "receiverLocation"
│   └── [FIELD] "receiverNotes"
├── ⚡ ACTION BUTTONS & TRIGGERS (4 buttons)
│   ├── [BUTTON] "Back"
│   ├── [BUTTON] "View All Transfers"
│   ├── [BUTTON] "View Complete Transfer Details &rsaquo;"
│   └── [BUTTON] "Confirm Arrival &amp; Post"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/inventory/transfers/detail`
- **Route Name:** `inventory-transfer-detail-legacy`
- **Source Component:** [`src/views/inventory/TransferDetail.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/inventory/TransferDetail.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/inventory/transfers/detail [inventory-transfer-detail-legacy]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Dispatch Transfer"
│   ├── "Receive Consignment"
│   ├── "Transfer Not Found"
│   ├── "&rarr;"
│   └── "&middot;"
├── 📊 SNAPSHOT METRICS & KPI CARDS (23 cards)
│   ├── [KPI CARD] Direction ➔ t.to === branchName ? 'Inbound' : 'Outbound'
│   ├── [KPI CARD] From Branch ➔ `${t.from
│   ├── [KPI CARD] To Branch ➔ `${t.to
│   ├── [KPI CARD] Total Units ➔ String(t.units || t.totalUnits || 0)
│   ├── [KPI CARD] Status ➔ t.status || 'In Transit'
│   ├── [KPI CARD] ETA / Arrival ➔ t.expectedArrival || 'Tomorrow'
│   ├── [KPI CARD] Primary Product ➔ t.product || t.items?.[0]?.product || 'BRG EV'
│   ├── [KPI CARD] Line Items Count ➔ `${t.items?.length || 1
│   ├── [KPI CARD] Dispatched Count ➔ `${t.items?.reduce((s
│   ├── [KPI CARD] Received Count ➔ `${t.items?.reduce((s
│   ├── [KPI CARD] Notes ➔ t.notes || 'Standard transfer'
│   ├── [KPI CARD] Dispatched Date ➔ t.dispatched || 'Pending dispatch'
│   ├── [KPI CARD] Dispatched By ➔ t.dispatchedBy || 'Depot Officer'
│   ├── [KPI CARD] Carrier / Logistics ➔ t.carrier || 'Internal logistics'
│   ├── [KPI CARD] Expected Arrival ➔ t.expectedArrival || 'Tomorrow 14:00'
│   ├── [KPI CARD] Authorized Origin ➔ `${t.from
│   ├── [KPI CARD] Origin Notes ➔ t.notes || '—'
│   ├── [KPI CARD] Receiving Status ➔ t.status === 'Received' ? 'Fully Received' : (t.status === 'Partially Received' ? 'Partial Intake Recorded' : 'Pending Intake')
│   ├── [KPI CARD] Received Date ➔ t.receivedDate || 'Awaiting bay arrival'
│   ├── [KPI CARD] Receiver Notes ➔ t.receiverNotes || 'Awaiting unloading inspection'
│   ├── [KPI CARD] Damaged Units Recorded ➔ `${t.items?.reduce((s
│   ├── [KPI CARD] Shortage Detected ➔ `${t.items?.reduce((s
│   └── [KPI CARD] Receiving Location ➔ `${t.to
├── 📋 DATA TABLES & GRID COLUMNS (1 tables)
│   ├── [TABLE 1] Columns:
│   │   ├── [COL] "Product"
│   │   ├── [COL] "SKU"
│   │   ├── [COL] "Dispatched"
│   │   ├── [COL] "Received"
│   │   └── [COL] "Serial Numbers"
├── ⚡ ACTION BUTTONS & TRIGGERS (4 buttons)
│   ├── [BUTTON] "Back"
│   ├── [BUTTON] "Dispatch Transfer"
│   ├── [BUTTON] "Receive Consignment"
│   └── [BUTTON] "Return to Transfers"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/inventory/transfers/:id`
- **Route Name:** `inventory-transfer-detail`
- **Source Component:** [`src/views/inventory/TransferDetail.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/inventory/TransferDetail.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/inventory/transfers/:id [inventory-transfer-detail]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Dispatch Transfer"
│   ├── "Receive Consignment"
│   ├── "Transfer Not Found"
│   ├── "&rarr;"
│   └── "&middot;"
├── 📊 SNAPSHOT METRICS & KPI CARDS (23 cards)
│   ├── [KPI CARD] Direction ➔ t.to === branchName ? 'Inbound' : 'Outbound'
│   ├── [KPI CARD] From Branch ➔ `${t.from
│   ├── [KPI CARD] To Branch ➔ `${t.to
│   ├── [KPI CARD] Total Units ➔ String(t.units || t.totalUnits || 0)
│   ├── [KPI CARD] Status ➔ t.status || 'In Transit'
│   ├── [KPI CARD] ETA / Arrival ➔ t.expectedArrival || 'Tomorrow'
│   ├── [KPI CARD] Primary Product ➔ t.product || t.items?.[0]?.product || 'BRG EV'
│   ├── [KPI CARD] Line Items Count ➔ `${t.items?.length || 1
│   ├── [KPI CARD] Dispatched Count ➔ `${t.items?.reduce((s
│   ├── [KPI CARD] Received Count ➔ `${t.items?.reduce((s
│   ├── [KPI CARD] Notes ➔ t.notes || 'Standard transfer'
│   ├── [KPI CARD] Dispatched Date ➔ t.dispatched || 'Pending dispatch'
│   ├── [KPI CARD] Dispatched By ➔ t.dispatchedBy || 'Depot Officer'
│   ├── [KPI CARD] Carrier / Logistics ➔ t.carrier || 'Internal logistics'
│   ├── [KPI CARD] Expected Arrival ➔ t.expectedArrival || 'Tomorrow 14:00'
│   ├── [KPI CARD] Authorized Origin ➔ `${t.from
│   ├── [KPI CARD] Origin Notes ➔ t.notes || '—'
│   ├── [KPI CARD] Receiving Status ➔ t.status === 'Received' ? 'Fully Received' : (t.status === 'Partially Received' ? 'Partial Intake Recorded' : 'Pending Intake')
│   ├── [KPI CARD] Received Date ➔ t.receivedDate || 'Awaiting bay arrival'
│   ├── [KPI CARD] Receiver Notes ➔ t.receiverNotes || 'Awaiting unloading inspection'
│   ├── [KPI CARD] Damaged Units Recorded ➔ `${t.items?.reduce((s
│   ├── [KPI CARD] Shortage Detected ➔ `${t.items?.reduce((s
│   └── [KPI CARD] Receiving Location ➔ `${t.to
├── 📋 DATA TABLES & GRID COLUMNS (1 tables)
│   ├── [TABLE 1] Columns:
│   │   ├── [COL] "Product"
│   │   ├── [COL] "SKU"
│   │   ├── [COL] "Dispatched"
│   │   ├── [COL] "Received"
│   │   └── [COL] "Serial Numbers"
├── ⚡ ACTION BUTTONS & TRIGGERS (4 buttons)
│   ├── [BUTTON] "Back"
│   ├── [BUTTON] "Dispatch Transfer"
│   ├── [BUTTON] "Receive Consignment"
│   └── [BUTTON] "Return to Transfers"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/inventory/inbound-deliveries`
- **Route Name:** `inventory-inbound-deliveries`
- **Source Component:** [`src/views/inventory/InboundDeliveries.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/inventory/InboundDeliveries.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/inventory/inbound-deliveries [inventory-inbound-deliveries]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Inbound Deliveries"
│   ├── "Receive Supplier Delivery"
│   ├── "Columns"
│   ├── "Export"
│   └── "Delivery Contents"
├── 📑 NAVIGATION TABS & FILTER PILLS (6 tabs)
│   ├── [TAB] "Clear"
│   ├── [TAB] "All"
│   ├── [TAB] "Scheduled"
│   ├── [TAB] "In Transit"
│   ├── [TAB] "Received"
│   └── [TAB] "Discrepancy"
├── 📊 SNAPSHOT METRICS & KPI CARDS (4 cards)
│   ├── [KPI CARD] Expected Today ➔ '2'
│   ├── [KPI CARD] In Transit ➔ '8 units'
│   ├── [KPI CARD] Awaiting Receive ➔ '1'
│   └── [KPI CARD] Discrepancies ➔ '1'
├── 📋 DATA TABLES & GRID COLUMNS (1 tables)
│   ├── [TABLE 1] Columns:
│   │   ├── [COL] "Inbound"
│   │   ├── [COL] "PO Reference"
│   │   ├── [COL] "Supplier"
│   │   ├── [COL] "Expected"
│   │   ├── [COL] "Products"
│   │   ├── [COL] "Status"
│   │   ├── [COL] "Category"
│   │   ├── [COL] "Product Name"
│   │   └── [COL] "Quantity"
├── 📝 FORM FIELDS & INPUT CONTROLS (1 fields)
│   └── [FIELD] "branchSearchQuery"
├── ⚡ ACTION BUTTONS & TRIGGERS (3 buttons)
│   ├── [BUTTON] "Columns"
│   ├── [BUTTON] "Export"
│   └── [BUTTON] "Open &rsaquo;"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/inventory/inbound-deliveries/detail`
- **Route Name:** `inventory-inbound-delivery-detail-legacy`
- **Source Component:** [`src/views/inventory/InboundDeliveryDetail.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/inventory/InboundDeliveryDetail.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/inventory/inbound-deliveries/detail [inventory-inbound-delivery-detail-legacy]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Receive Delivery"
│   ├── "Branch context"
│   ├── "PO Reference"
│   ├── "Expected"
│   └── "Discrepancies"
├── 📊 SNAPSHOT METRICS & KPI CARDS (25 cards)
│   ├── [KPI CARD] Inbound ➔ inboundId.value
│   ├── [KPI CARD] PO Reference ➔ isINB088.value ? 'PO-181' : 'PO-188'
│   ├── [KPI CARD] Supplier ➔ 'BRG Supply'
│   ├── [KPI CARD] Expected Date ➔ isINB088.value ? '28 Aug' : 'Today'
│   ├── [KPI CARD] Destination ➔ `${branchName
│   ├── [KPI CARD] Status ➔ isINB088.value ? 'Awaiting Receive' : 'In Transit'
│   ├── [KPI CARD] Expected Products ➔ isINB088.value ? 'BRG M3 × 2' : 'BRG E9 Pro × 2'
│   ├── [KPI CARD] Total Units ➔ '2'
│   ├── [KPI CARD] Serialized Tracking ➔ '2 / 2 Serialized'
│   ├── [KPI CARD] Source Batch ➔ 'BAT-2024-SUP-09'
│   ├── [KPI CARD] Packaging ➔ '2 Standard Crates'
│   ├── [KPI CARD] Unit Cost Scope ➔ 'Restricted (HQ Procurement)'
│   ├── [KPI CARD] Inspection Status ➔ isINB088.value ? 'Pending Physical Check' : 'Pending on Arrival'
│   ├── [KPI CARD] Required Checks ➔ 'Visual
│   ├── [KPI CARD] Photos Required ➔ '2 Attached'
│   ├── [KPI CARD] Assigned Inspector ➔ `${branchName
│   ├── [KPI CARD] QC Standard ➔ 'Zero Tolerance Policy'
│   ├── [KPI CARD] Condition ➔ 'Good'
│   ├── [KPI CARD] Receiving Status ➔ isINB088.value ? 'Awaiting Receive' : 'In Transit'
│   ├── [KPI CARD] Expected Arrival ➔ isINB088.value ? '28 Aug 15:00' : 'Today 17:30'
│   ├── [KPI CARD] Receiving Location ➔ 'Warehouse A'
│   ├── [KPI CARD] Assigned Receiver ➔ 'Branch Manager'
│   ├── [KPI CARD] Logistics Fleet ➔ 'BRG Dedicated Fleet'
│   ├── [KPI CARD] Challan / Waybill ➔ 'DC-SUP-9104'
│   └── [KPI CARD] Discrepancies Recorded ➔ 'None'
├── ⚡ ACTION BUTTONS & TRIGGERS (1 buttons)
│   └── [BUTTON] "Receive Delivery"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/inventory/inbound-deliveries/:id`
- **Route Name:** `inventory-inbound-delivery-detail`
- **Source Component:** [`src/views/inventory/InboundDeliveryDetail.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/inventory/InboundDeliveryDetail.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/inventory/inbound-deliveries/:id [inventory-inbound-delivery-detail]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Receive Delivery"
│   ├── "Branch context"
│   ├── "PO Reference"
│   ├── "Expected"
│   └── "Discrepancies"
├── 📊 SNAPSHOT METRICS & KPI CARDS (25 cards)
│   ├── [KPI CARD] Inbound ➔ inboundId.value
│   ├── [KPI CARD] PO Reference ➔ isINB088.value ? 'PO-181' : 'PO-188'
│   ├── [KPI CARD] Supplier ➔ 'BRG Supply'
│   ├── [KPI CARD] Expected Date ➔ isINB088.value ? '28 Aug' : 'Today'
│   ├── [KPI CARD] Destination ➔ `${branchName
│   ├── [KPI CARD] Status ➔ isINB088.value ? 'Awaiting Receive' : 'In Transit'
│   ├── [KPI CARD] Expected Products ➔ isINB088.value ? 'BRG M3 × 2' : 'BRG E9 Pro × 2'
│   ├── [KPI CARD] Total Units ➔ '2'
│   ├── [KPI CARD] Serialized Tracking ➔ '2 / 2 Serialized'
│   ├── [KPI CARD] Source Batch ➔ 'BAT-2024-SUP-09'
│   ├── [KPI CARD] Packaging ➔ '2 Standard Crates'
│   ├── [KPI CARD] Unit Cost Scope ➔ 'Restricted (HQ Procurement)'
│   ├── [KPI CARD] Inspection Status ➔ isINB088.value ? 'Pending Physical Check' : 'Pending on Arrival'
│   ├── [KPI CARD] Required Checks ➔ 'Visual
│   ├── [KPI CARD] Photos Required ➔ '2 Attached'
│   ├── [KPI CARD] Assigned Inspector ➔ `${branchName
│   ├── [KPI CARD] QC Standard ➔ 'Zero Tolerance Policy'
│   ├── [KPI CARD] Condition ➔ 'Good'
│   ├── [KPI CARD] Receiving Status ➔ isINB088.value ? 'Awaiting Receive' : 'In Transit'
│   ├── [KPI CARD] Expected Arrival ➔ isINB088.value ? '28 Aug 15:00' : 'Today 17:30'
│   ├── [KPI CARD] Receiving Location ➔ 'Warehouse A'
│   ├── [KPI CARD] Assigned Receiver ➔ 'Branch Manager'
│   ├── [KPI CARD] Logistics Fleet ➔ 'BRG Dedicated Fleet'
│   ├── [KPI CARD] Challan / Waybill ➔ 'DC-SUP-9104'
│   └── [KPI CARD] Discrepancies Recorded ➔ 'None'
├── ⚡ ACTION BUTTONS & TRIGGERS (1 buttons)
│   └── [BUTTON] "Receive Delivery"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/inventory/inbound-deliveries/receive`
- **Route Name:** `inventory-receive-supplier-delivery`
- **Source Component:** [`src/views/inventory/ReceiveSupplierDelivery.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/inventory/ReceiveSupplierDelivery.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/inventory/inbound-deliveries/receive [inventory-receive-supplier-delivery]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Receive Supplier Delivery"
│   ├── "Approved Inbound"
│   └── "Inspection"
├── 📝 FORM FIELDS & INPUT CONTROLS (8 fields)
│   ├── [FIELD] "form.inbound"
│   ├── [FIELD] "form.poReference"
│   ├── [FIELD] "form.expectedProducts"
│   ├── [FIELD] "form.receivingLocation"
│   ├── [FIELD] "form.serializedUnits"
│   ├── [FIELD] "form.condition"
│   ├── [FIELD] "form.photos"
│   └── [FIELD] "form.discrepancy"
├── ⚡ ACTION BUTTONS & TRIGGERS (1 buttons)
│   └── [BUTTON] "Post Receipt"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/inventory/stock-requests`
- **Route Name:** `inventory-stock-requests`
- **Source Component:** [`src/views/inventory/StockRequests.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/inventory/StockRequests.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/inventory/stock-requests [inventory-stock-requests]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Stock Requests"
│   └── "New Stock Request"
├── 📑 NAVIGATION TABS & FILTER PILLS (7 tabs)
│   ├── [TAB] "Clear"
│   ├── [TAB] "Reset filters"
│   ├── [TAB] "All"
│   ├── [TAB] "Pending"
│   ├── [TAB] "Approved"
│   ├── [TAB] "Partial"
│   └── [TAB] "Rejected"
├── 📊 SNAPSHOT METRICS & KPI CARDS (4 cards)
│   ├── [KPI CARD] Open ➔ String(open)
│   ├── [KPI CARD] Approved ➔ String(approved)
│   ├── [KPI CARD] Partial ➔ String(partial)
│   └── [KPI CARD] Fulfilled ➔ String(fulfilled)
├── 📋 DATA TABLES & GRID COLUMNS (2 tables)
│   ├── [TABLE 1] Columns:
│   │   ├── [COL] "Request"
│   │   ├── [COL] "Product"
│   │   ├── [COL] "Qty"
│   │   ├── [COL] "Expected"
│   │   ├── [COL] "Status"
│   │   └── [COL] "Actions"
│   ├── [TABLE 2] Columns:
│   │   ├── [COL] "Request"
│   │   ├── [COL] "Branch"
│   │   ├── [COL] "Products"
│   │   ├── [COL] "Units"
│   │   ├── [COL] "Need By"
│   │   ├── [COL] "Priority"
│   │   ├── [COL] "Status"
│   │   └── [COL] "Action"
├── 📝 FORM FIELDS & INPUT CONTROLS (2 fields)
│   ├── [FIELD] "branchSearchQuery"
│   └── [FIELD] "searchQuery"
├── ⚡ ACTION BUTTONS & TRIGGERS (1 buttons)
│   └── [BUTTON] "New Stock Request"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/inventory/stock-requests/create`
- **Route Name:** `inventory-create-stock-request`
- **Source Component:** [`src/views/inventory/CreateStockRequest.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/inventory/CreateStockRequest.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/inventory/stock-requests/create [inventory-create-stock-request]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Dealership Replenishment Workflow:"
│   └── "Demand & Justification"
├── 📝 FORM FIELDS & INPUT CONTROLS (8 fields)
│   ├── [FIELD] "form.productId"
│   ├── [FIELD] "form.currentStock"
│   ├── [FIELD] "form.requestedQty"
│   ├── [FIELD] "form.urgency"
│   ├── [FIELD] "form.expectedDemand"
│   ├── [FIELD] "form.orderLink"
│   ├── [FIELD] "form.reason"
│   └── [FIELD] "form.notes"
├── ⚡ ACTION BUTTONS & TRIGGERS (1 buttons)
│   └── [BUTTON] "Cancel"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/inventory/stock-requests/detail`
- **Route Name:** `inventory-stock-request-detail-legacy`
- **Source Component:** [`src/views/inventory/StockRequestDetail.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/inventory/StockRequestDetail.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/inventory/stock-requests/detail [inventory-stock-request-detail-legacy]
│
├── 📊 SNAPSHOT METRICS & KPI CARDS (20 cards)
│   ├── [KPI CARD] Request ID ➔ req.id
│   ├── [KPI CARD] Requesting Branch ➔ `${req.branch
│   ├── [KPI CARD] Requested By ➔ req.requestedBy
│   ├── [KPI CARD] Primary Product ➔ req.product
│   ├── [KPI CARD] Total Units Requested ➔ String(req.qty || 1)
│   ├── [KPI CARD] Reason for Request ➔ req.reason || 'Replenishment'
│   ├── [KPI CARD] Target Need Date ➔ req.needBy || req.expected || '31 Aug'
│   ├── [KPI CARD] Priority ➔ req.priority || 'Normal'
│   ├── [KPI CARD] Current Status ➔ req.status
│   ├── [KPI CARD] Approved By ➔ req.approvedBy || (req.status === 'Approved' ? 'Central Inventory Lead' : 'Pending Decision')
│   ├── [KPI CARD] Approval Date ➔ req.approvedDate || (req.status === 'Approved' ? 'Today' : '—')
│   ├── [KPI CARD] Rejection Reason ➔ req.rejectionReason || 'None'
│   ├── [KPI CARD] Approved Units ➔ req.status === 'Approved' ? `${req.qty
│   ├── [KPI CARD] Fulfilment Route ➔ req.status === 'Approved' ? `Approved from Central Pool &rarr; ${req.branch
│   ├── [KPI CARD] Fulfillment Type ➔ 'Inter-branch Transfer'
│   ├── [KPI CARD] Linked Transfer ID ➔ req.linkedTransferId || (req.status === 'Approved' ? 'TR-224 (Ready to Dispatch)' : 'Pending Approval')
│   ├── [KPI CARD] Courier / Fleet ➔ 'BRG Dedicated Logistics'
│   ├── [KPI CARD] Receiving Location ➔ `${req.branch
│   ├── [KPI CARD] Destination Bay ➔ 'Intake Bay 1'
│   └── [KPI CARD] SLA Target ➔ 'Within 48 Hours'
├── ⚡ ACTION BUTTONS & TRIGGERS (3 buttons)
│   ├── [BUTTON] "Back"
│   ├── [BUTTON] "Reject"
│   └── [BUTTON] "Approve Request"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/inventory/stock-requests/:id`
- **Route Name:** `inventory-stock-request-detail`
- **Source Component:** [`src/views/inventory/StockRequestDetail.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/inventory/StockRequestDetail.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/inventory/stock-requests/:id [inventory-stock-request-detail]
│
├── 📊 SNAPSHOT METRICS & KPI CARDS (20 cards)
│   ├── [KPI CARD] Request ID ➔ req.id
│   ├── [KPI CARD] Requesting Branch ➔ `${req.branch
│   ├── [KPI CARD] Requested By ➔ req.requestedBy
│   ├── [KPI CARD] Primary Product ➔ req.product
│   ├── [KPI CARD] Total Units Requested ➔ String(req.qty || 1)
│   ├── [KPI CARD] Reason for Request ➔ req.reason || 'Replenishment'
│   ├── [KPI CARD] Target Need Date ➔ req.needBy || req.expected || '31 Aug'
│   ├── [KPI CARD] Priority ➔ req.priority || 'Normal'
│   ├── [KPI CARD] Current Status ➔ req.status
│   ├── [KPI CARD] Approved By ➔ req.approvedBy || (req.status === 'Approved' ? 'Central Inventory Lead' : 'Pending Decision')
│   ├── [KPI CARD] Approval Date ➔ req.approvedDate || (req.status === 'Approved' ? 'Today' : '—')
│   ├── [KPI CARD] Rejection Reason ➔ req.rejectionReason || 'None'
│   ├── [KPI CARD] Approved Units ➔ req.status === 'Approved' ? `${req.qty
│   ├── [KPI CARD] Fulfilment Route ➔ req.status === 'Approved' ? `Approved from Central Pool &rarr; ${req.branch
│   ├── [KPI CARD] Fulfillment Type ➔ 'Inter-branch Transfer'
│   ├── [KPI CARD] Linked Transfer ID ➔ req.linkedTransferId || (req.status === 'Approved' ? 'TR-224 (Ready to Dispatch)' : 'Pending Approval')
│   ├── [KPI CARD] Courier / Fleet ➔ 'BRG Dedicated Logistics'
│   ├── [KPI CARD] Receiving Location ➔ `${req.branch
│   ├── [KPI CARD] Destination Bay ➔ 'Intake Bay 1'
│   └── [KPI CARD] SLA Target ➔ 'Within 48 Hours'
├── ⚡ ACTION BUTTONS & TRIGGERS (3 buttons)
│   ├── [BUTTON] "Back"
│   ├── [BUTTON] "Reject"
│   └── [BUTTON] "Approve Request"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/inventory/stock-adjustments`
- **Route Name:** `inventory-stock-adjustments`
- **Source Component:** [`src/views/inventory/StockAdjustments.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/inventory/StockAdjustments.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/inventory/stock-adjustments [inventory-stock-adjustments]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Stock Adjustments"
│   ├── "Adjustment Request"
│   ├── "Adjustments"
│   └── "New Adjustment"
├── 📑 NAVIGATION TABS & FILTER PILLS (1 tabs)
│   └── [TAB] "Clear"
├── 📊 SNAPSHOT METRICS & KPI CARDS (4 cards)
│   ├── [KPI CARD] Pending ➔ String(pending)
│   ├── [KPI CARD] Approved ➔ String(approved)
│   ├── [KPI CARD] Posted ➔ String(posted)
│   └── [KPI CARD] Rejected ➔ String(rejected)
├── 📋 DATA TABLES & GRID COLUMNS (2 tables)
│   ├── [TABLE 1] Columns:
│   │   ├── [COL] "Adjustment"
│   │   ├── [COL] "Product / Unit"
│   │   ├── [COL] "Before"
│   │   ├── [COL] "After"
│   │   ├── [COL] "Reason"
│   │   ├── [COL] "Status"
│   │   └── [COL] "Actions"
│   ├── [TABLE 2] Columns:
│   │   ├── [COL] "Adjustment"
│   │   ├── [COL] "Branch"
│   │   ├── [COL] "Unit/Product"
│   │   ├── [COL] "Type"
│   │   ├── [COL] "Qty Effect"
│   │   ├── [COL] "Reason"
│   │   ├── [COL] "Status"
│   │   ├── [COL] "Requested By"
│   │   └── [COL] "Action"
├── 📝 FORM FIELDS & INPUT CONTROLS (2 fields)
│   ├── [FIELD] "branchSearchQuery"
│   └── [FIELD] "searchQuery"
├── ⚡ ACTION BUTTONS & TRIGGERS (2 buttons)
│   ├── [BUTTON] "Adjustment Request"
│   └── [BUTTON] "New Adjustment"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/inventory/stock-adjustments/create`
- **Route Name:** `inventory-create-adjustment-request`
- **Source Component:** [`src/views/inventory/CreateAdjustmentRequest.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/inventory/CreateAdjustmentRequest.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/inventory/stock-adjustments/create [inventory-create-adjustment-request]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Adjustment Details"
│   └── "Evidence & Verification"
├── 📝 FORM FIELDS & INPUT CONTROLS (8 fields)
│   ├── [FIELD] "form.productUnit"
│   ├── [FIELD] "form.existingState"
│   ├── [FIELD] "form.correctedState"
│   ├── [FIELD] "form.reason"
│   ├── [FIELD] "form.evidence"
│   ├── [FIELD] "form.notes"
│   ├── [FIELD] "form.requestedBy"
│   └── [FIELD] "form.approval"
├── ⚡ ACTION BUTTONS & TRIGGERS (1 buttons)
│   └── [BUTTON] "Cancel"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/inventory/stock-adjustments/detail`
- **Route Name:** `inventory-adjustment-detail-legacy`
- **Source Component:** [`src/views/inventory/AdjustmentDetail.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/inventory/AdjustmentDetail.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/inventory/stock-adjustments/detail [inventory-adjustment-detail-legacy]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Stock Adjustment Not Found"
│   ├── "Branch context"
│   ├── "Approval"
│   ├── "Branch"
│   └── "Posted"
├── 📑 NAVIGATION TABS & FILTER PILLS (6 tabs)
│   ├── [TAB] "Adjustment"
│   ├── [TAB] "Reason"
│   ├── [TAB] "Before & After"
│   ├── [TAB] "Approval"
│   ├── [TAB] "Documents"
│   └── [TAB] "Activity"
├── 📊 SNAPSHOT METRICS & KPI CARDS (25 cards)
│   ├── [KPI CARD] Product / Unit ➔ adj.productUnit || adj.unitProduct || 'BRG Product'
│   ├── [KPI CARD] Before State ➔ adj.existingState || '6 available'
│   ├── [KPI CARD] After State ➔ adj.correctedState || '5 available'
│   ├── [KPI CARD] Reason ➔ adj.reason || 'Count variance'
│   ├── [KPI CARD] Status ➔ adj.status
│   ├── [KPI CARD] Evidence ➔ adj.evidence || '1 attachment'
│   ├── [KPI CARD] Net Difference ➔ adj.difference || adj.qtyEffect || 'Status change'
│   ├── [KPI CARD] Financial Impact ➔ isApproved ? 'Adjusted in ledger' : 'Pending HQ Review'
│   ├── [KPI CARD] Affected Branch ➔ `${branchName
│   ├── [KPI CARD] Attached Evidence ➔ adj.evidence || 'Physical_Count_Sheet.pdf'
│   ├── [KPI CARD] Uploaded By ➔ adj.requestedBy || 'Branch Manager'
│   ├── [KPI CARD] Upload Timestamp ➔ adj.requestedAt || 'Today 10:15'
│   ├── [KPI CARD] Verification Note ➔ adj.notes || 'Reconciliation variance recorded'
│   ├── [KPI CARD] Audit Standard ➔ 'Branch Cycle Audit Standard'
│   ├── [KPI CARD] Total Files ➔ '1 Document'
│   ├── [KPI CARD] Approval Status ➔ isApproved ? 'Approved & Posted' : (adj.status === 'Rejected' || adj.status === 'Recount Required' ? 'Rejected / Recount' : 'Awaiting Decision')
│   ├── [KPI CARD] Approved By ➔ adj.approvedBy || 'Pending Supervisor'
│   ├── [KPI CARD] Target SLA ➔ '24 Hours'
│   ├── [KPI CARD] Conditions ➔ 'Physical recount & evidence verification'
│   ├── [KPI CARD] Posting Authority ➔ 'Branch Manager & HQ Audit'
│   ├── [KPI CARD] Audit Ledger ➔ isApproved ? 'Posted to Stock Movement Ledger' : 'Pending Final Post'
│   ├── [KPI CARD] Requested ➔ `Submitted by ${adj.requestedBy || 'Store Officer'
│   ├── [KPI CARD] Current Stage ➔ adj.status
│   ├── [KPI CARD] Adjustment Reference ➔ adjustmentId.value
│   └── [KPI CARD] Branch Location ➔ adj.branch || 'Peshawar'
├── ⚡ ACTION BUTTONS & TRIGGERS (5 buttons)
│   ├── [BUTTON] "&larr; Back to Stock Adjustments"
│   ├── [BUTTON] "Back"
│   ├── [BUTTON] "Reject / Recount"
│   ├── [BUTTON] "Approve Adjustment"
│   └── [BUTTON] "Reject"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/inventory/stock-adjustments/:id`
- **Route Name:** `inventory-adjustment-detail`
- **Source Component:** [`src/views/inventory/AdjustmentDetail.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/inventory/AdjustmentDetail.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/inventory/stock-adjustments/:id [inventory-adjustment-detail]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Stock Adjustment Not Found"
│   ├── "Branch context"
│   ├── "Approval"
│   ├── "Branch"
│   └── "Posted"
├── 📑 NAVIGATION TABS & FILTER PILLS (6 tabs)
│   ├── [TAB] "Adjustment"
│   ├── [TAB] "Reason"
│   ├── [TAB] "Before & After"
│   ├── [TAB] "Approval"
│   ├── [TAB] "Documents"
│   └── [TAB] "Activity"
├── 📊 SNAPSHOT METRICS & KPI CARDS (25 cards)
│   ├── [KPI CARD] Product / Unit ➔ adj.productUnit || adj.unitProduct || 'BRG Product'
│   ├── [KPI CARD] Before State ➔ adj.existingState || '6 available'
│   ├── [KPI CARD] After State ➔ adj.correctedState || '5 available'
│   ├── [KPI CARD] Reason ➔ adj.reason || 'Count variance'
│   ├── [KPI CARD] Status ➔ adj.status
│   ├── [KPI CARD] Evidence ➔ adj.evidence || '1 attachment'
│   ├── [KPI CARD] Net Difference ➔ adj.difference || adj.qtyEffect || 'Status change'
│   ├── [KPI CARD] Financial Impact ➔ isApproved ? 'Adjusted in ledger' : 'Pending HQ Review'
│   ├── [KPI CARD] Affected Branch ➔ `${branchName
│   ├── [KPI CARD] Attached Evidence ➔ adj.evidence || 'Physical_Count_Sheet.pdf'
│   ├── [KPI CARD] Uploaded By ➔ adj.requestedBy || 'Branch Manager'
│   ├── [KPI CARD] Upload Timestamp ➔ adj.requestedAt || 'Today 10:15'
│   ├── [KPI CARD] Verification Note ➔ adj.notes || 'Reconciliation variance recorded'
│   ├── [KPI CARD] Audit Standard ➔ 'Branch Cycle Audit Standard'
│   ├── [KPI CARD] Total Files ➔ '1 Document'
│   ├── [KPI CARD] Approval Status ➔ isApproved ? 'Approved & Posted' : (adj.status === 'Rejected' || adj.status === 'Recount Required' ? 'Rejected / Recount' : 'Awaiting Decision')
│   ├── [KPI CARD] Approved By ➔ adj.approvedBy || 'Pending Supervisor'
│   ├── [KPI CARD] Target SLA ➔ '24 Hours'
│   ├── [KPI CARD] Conditions ➔ 'Physical recount & evidence verification'
│   ├── [KPI CARD] Posting Authority ➔ 'Branch Manager & HQ Audit'
│   ├── [KPI CARD] Audit Ledger ➔ isApproved ? 'Posted to Stock Movement Ledger' : 'Pending Final Post'
│   ├── [KPI CARD] Requested ➔ `Submitted by ${adj.requestedBy || 'Store Officer'
│   ├── [KPI CARD] Current Stage ➔ adj.status
│   ├── [KPI CARD] Adjustment Reference ➔ adjustmentId.value
│   └── [KPI CARD] Branch Location ➔ adj.branch || 'Peshawar'
├── ⚡ ACTION BUTTONS & TRIGGERS (5 buttons)
│   ├── [BUTTON] "&larr; Back to Stock Adjustments"
│   ├── [BUTTON] "Back"
│   ├── [BUTTON] "Reject / Recount"
│   ├── [BUTTON] "Approve Adjustment"
│   └── [BUTTON] "Reject"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/inventory/adjustments/:id`
- **Route Name:** `inventory-adjustment-detail-alias`
- **Source Component:** [`src/views/inventory/AdjustmentDetail.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/inventory/AdjustmentDetail.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/inventory/adjustments/:id [inventory-adjustment-detail-alias]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Stock Adjustment Not Found"
│   ├── "Branch context"
│   ├── "Approval"
│   ├── "Branch"
│   └── "Posted"
├── 📑 NAVIGATION TABS & FILTER PILLS (6 tabs)
│   ├── [TAB] "Adjustment"
│   ├── [TAB] "Reason"
│   ├── [TAB] "Before & After"
│   ├── [TAB] "Approval"
│   ├── [TAB] "Documents"
│   └── [TAB] "Activity"
├── 📊 SNAPSHOT METRICS & KPI CARDS (25 cards)
│   ├── [KPI CARD] Product / Unit ➔ adj.productUnit || adj.unitProduct || 'BRG Product'
│   ├── [KPI CARD] Before State ➔ adj.existingState || '6 available'
│   ├── [KPI CARD] After State ➔ adj.correctedState || '5 available'
│   ├── [KPI CARD] Reason ➔ adj.reason || 'Count variance'
│   ├── [KPI CARD] Status ➔ adj.status
│   ├── [KPI CARD] Evidence ➔ adj.evidence || '1 attachment'
│   ├── [KPI CARD] Net Difference ➔ adj.difference || adj.qtyEffect || 'Status change'
│   ├── [KPI CARD] Financial Impact ➔ isApproved ? 'Adjusted in ledger' : 'Pending HQ Review'
│   ├── [KPI CARD] Affected Branch ➔ `${branchName
│   ├── [KPI CARD] Attached Evidence ➔ adj.evidence || 'Physical_Count_Sheet.pdf'
│   ├── [KPI CARD] Uploaded By ➔ adj.requestedBy || 'Branch Manager'
│   ├── [KPI CARD] Upload Timestamp ➔ adj.requestedAt || 'Today 10:15'
│   ├── [KPI CARD] Verification Note ➔ adj.notes || 'Reconciliation variance recorded'
│   ├── [KPI CARD] Audit Standard ➔ 'Branch Cycle Audit Standard'
│   ├── [KPI CARD] Total Files ➔ '1 Document'
│   ├── [KPI CARD] Approval Status ➔ isApproved ? 'Approved & Posted' : (adj.status === 'Rejected' || adj.status === 'Recount Required' ? 'Rejected / Recount' : 'Awaiting Decision')
│   ├── [KPI CARD] Approved By ➔ adj.approvedBy || 'Pending Supervisor'
│   ├── [KPI CARD] Target SLA ➔ '24 Hours'
│   ├── [KPI CARD] Conditions ➔ 'Physical recount & evidence verification'
│   ├── [KPI CARD] Posting Authority ➔ 'Branch Manager & HQ Audit'
│   ├── [KPI CARD] Audit Ledger ➔ isApproved ? 'Posted to Stock Movement Ledger' : 'Pending Final Post'
│   ├── [KPI CARD] Requested ➔ `Submitted by ${adj.requestedBy || 'Store Officer'
│   ├── [KPI CARD] Current Stage ➔ adj.status
│   ├── [KPI CARD] Adjustment Reference ➔ adjustmentId.value
│   └── [KPI CARD] Branch Location ➔ adj.branch || 'Peshawar'
├── ⚡ ACTION BUTTONS & TRIGGERS (5 buttons)
│   ├── [BUTTON] "&larr; Back to Stock Adjustments"
│   ├── [BUTTON] "Back"
│   ├── [BUTTON] "Reject / Recount"
│   ├── [BUTTON] "Approve Adjustment"
│   └── [BUTTON] "Reject"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/inventory/cycle-counts`
- **Route Name:** `inventory-cycle-counts`
- **Source Component:** [`src/views/inventory/CycleCounts.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/inventory/CycleCounts.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/inventory/cycle-counts [inventory-cycle-counts]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Cycle Counts"
│   ├── "Start Count"
│   └── "Create Cycle Count"
├── 📑 NAVIGATION TABS & FILTER PILLS (1 tabs)
│   └── [TAB] "Clear"
├── 📊 SNAPSHOT METRICS & KPI CARDS (4 cards)
│   ├── [KPI CARD] Open ➔ '2'
│   ├── [KPI CARD] Due Today ➔ '1'
│   ├── [KPI CARD] Discrepancies ➔ '3'
│   └── [KPI CARD] Completed ➔ '9'
├── 📋 DATA TABLES & GRID COLUMNS (2 tables)
│   ├── [TABLE 1] Columns:
│   │   ├── [COL] "Count"
│   │   ├── [COL] "Scope"
│   │   ├── [COL] "Due"
│   │   ├── [COL] "Expected"
│   │   ├── [COL] "Counted"
│   │   ├── [COL] "Status"
│   │   └── [COL] "Actions"
│   ├── [TABLE 2] Columns:
│   │   ├── [COL] "Count"
│   │   ├── [COL] "Branch"
│   │   ├── [COL] "Scope"
│   │   ├── [COL] "Expected Units"
│   │   ├── [COL] "Counted"
│   │   ├── [COL] "Variance"
│   │   ├── [COL] "Status"
│   │   ├── [COL] "Owner"
│   │   └── [COL] "Action"
├── 📝 FORM FIELDS & INPUT CONTROLS (2 fields)
│   ├── [FIELD] "branchSearchQuery"
│   └── [FIELD] "searchQuery"
├── ⚡ ACTION BUTTONS & TRIGGERS (2 buttons)
│   ├── [BUTTON] "Start Count"
│   └── [BUTTON] "Create Cycle Count"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/inventory/cycle-counts/create`
- **Route Name:** `inventory-create-cycle-count`
- **Source Component:** [`src/views/inventory/CreateCycleCount.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/inventory/CreateCycleCount.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/inventory/cycle-counts/create [inventory-create-cycle-count]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Count Scope"
│   └── "Count Target & Location"
├── 📝 FORM FIELDS & INPUT CONTROLS (7 fields)
│   ├── [FIELD] "form.countName"
│   ├── [FIELD] "form.scope"
│   ├── [FIELD] "form.assignedTo"
│   ├── [FIELD] "form.scheduledDate"
│   ├── [FIELD] "form.expectedUnits"
│   ├── [FIELD] "form.targetLocation"
│   └── [FIELD] "form.notes"
├── ⚡ ACTION BUTTONS & TRIGGERS (1 buttons)
│   └── [BUTTON] "Cancel"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/inventory/cycle-counts/detail`
- **Route Name:** `inventory-cycle-count-detail-legacy`
- **Source Component:** [`src/views/inventory/CycleCountDetail.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/inventory/CycleCountDetail.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/inventory/cycle-counts/detail [inventory-cycle-count-detail-legacy]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Branch context"
│   ├── "Assignee"
│   ├── "Branch Team"
│   ├── "Due"
│   └── "Notes"
├── 📑 NAVIGATION TABS & FILTER PILLS (7 tabs)
│   ├── [TAB] "Count Summary"
│   ├── [TAB] "Expected Stock"
│   ├── [TAB] "Physical Count"
│   ├── [TAB] "Discrepancies"
│   ├── [TAB] "Adjustment Proposal"
│   ├── [TAB] "Approval"
│   └── [TAB] "Activity"
├── 📊 SNAPSHOT METRICS & KPI CARDS (25 cards)
│   ├── [KPI CARD] Scope ➔ isCC030.value ? 'Warehouse A' : 'Showroom'
│   ├── [KPI CARD] Expected ➔ isCC030.value ? '36' : '20'
│   ├── [KPI CARD] Counted ➔ isCC030.value ? '0' : '18'
│   ├── [KPI CARD] Matched ➔ isCC030.value ? '0' : '17'
│   ├── [KPI CARD] Discrepancies ➔ isCC030.value ? '0' : '1'
│   ├── [KPI CARD] Status ➔ isCC030.value ? 'Scheduled' : 'In Progress'
│   ├── [KPI CARD] Target Category ➔ 'All Active Electric Vehicles'
│   ├── [KPI CARD] Registered Units ➔ isCC030.value ? '36 in Warehouse' : '20 in Showroom'
│   ├── [KPI CARD] Chassis Assigned ➔ isCC030.value ? '36 Units' : '20 Units'
│   ├── [KPI CARD] Snapshot Date ➔ 'Today 08:00'
│   ├── [KPI CARD] System Lock ➔ 'No Lock during count'
│   ├── [KPI CARD] Location Filter ➔ `${branchName
│   ├── [KPI CARD] Count Session ➔ isCC030.value ? 'Scheduled (Not Started)' : 'Active Session #1'
│   ├── [KPI CARD] Count Method ➔ 'Barcode / QR Scan + Visual'
│   ├── [KPI CARD] Units Scanned ➔ isCC030.value ? '0 / 36' : '18 / 20'
│   ├── [KPI CARD] Time Started ➔ isCC030.value ? 'Pending' : 'Today 09:30'
│   ├── [KPI CARD] Count Operator ➔ `${branchName
│   ├── [KPI CARD] Verification Method ➔ 'Double Blind Check'
│   ├── [KPI CARD] Chassis Verified ➔ isCC030.value ? '0 Confirmed' : '17 Confirmed'
│   ├── [KPI CARD] Tags Scanned ➔ isCC030.value ? '0 Tags' : '18 Tags'
│   ├── [KPI CARD] Battery Serials ➔ 'Checked at Inspection'
│   ├── [KPI CARD] Unregistered Tags ➔ '0 Found'
│   ├── [KPI CARD] Relocated Units ➔ isCC030.value ? '0' : '1 (in QC Bay)'
│   ├── [KPI CARD] Scan Integrity ➔ '100% Validated'
│   └── [KPI CARD] Total Discrepancies ➔ isCC030.value ? '0' : '1 Unit Variance'
├── ⚡ ACTION BUTTONS & TRIGGERS (1 buttons)
│   └── [BUTTON] "Review Count"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/inventory/cycle-counts/:id`
- **Route Name:** `inventory-cycle-count-detail`
- **Source Component:** [`src/views/inventory/CycleCountDetail.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/inventory/CycleCountDetail.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/inventory/cycle-counts/:id [inventory-cycle-count-detail]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Branch context"
│   ├── "Assignee"
│   ├── "Branch Team"
│   ├── "Due"
│   └── "Notes"
├── 📑 NAVIGATION TABS & FILTER PILLS (7 tabs)
│   ├── [TAB] "Count Summary"
│   ├── [TAB] "Expected Stock"
│   ├── [TAB] "Physical Count"
│   ├── [TAB] "Discrepancies"
│   ├── [TAB] "Adjustment Proposal"
│   ├── [TAB] "Approval"
│   └── [TAB] "Activity"
├── 📊 SNAPSHOT METRICS & KPI CARDS (25 cards)
│   ├── [KPI CARD] Scope ➔ isCC030.value ? 'Warehouse A' : 'Showroom'
│   ├── [KPI CARD] Expected ➔ isCC030.value ? '36' : '20'
│   ├── [KPI CARD] Counted ➔ isCC030.value ? '0' : '18'
│   ├── [KPI CARD] Matched ➔ isCC030.value ? '0' : '17'
│   ├── [KPI CARD] Discrepancies ➔ isCC030.value ? '0' : '1'
│   ├── [KPI CARD] Status ➔ isCC030.value ? 'Scheduled' : 'In Progress'
│   ├── [KPI CARD] Target Category ➔ 'All Active Electric Vehicles'
│   ├── [KPI CARD] Registered Units ➔ isCC030.value ? '36 in Warehouse' : '20 in Showroom'
│   ├── [KPI CARD] Chassis Assigned ➔ isCC030.value ? '36 Units' : '20 Units'
│   ├── [KPI CARD] Snapshot Date ➔ 'Today 08:00'
│   ├── [KPI CARD] System Lock ➔ 'No Lock during count'
│   ├── [KPI CARD] Location Filter ➔ `${branchName
│   ├── [KPI CARD] Count Session ➔ isCC030.value ? 'Scheduled (Not Started)' : 'Active Session #1'
│   ├── [KPI CARD] Count Method ➔ 'Barcode / QR Scan + Visual'
│   ├── [KPI CARD] Units Scanned ➔ isCC030.value ? '0 / 36' : '18 / 20'
│   ├── [KPI CARD] Time Started ➔ isCC030.value ? 'Pending' : 'Today 09:30'
│   ├── [KPI CARD] Count Operator ➔ `${branchName
│   ├── [KPI CARD] Verification Method ➔ 'Double Blind Check'
│   ├── [KPI CARD] Chassis Verified ➔ isCC030.value ? '0 Confirmed' : '17 Confirmed'
│   ├── [KPI CARD] Tags Scanned ➔ isCC030.value ? '0 Tags' : '18 Tags'
│   ├── [KPI CARD] Battery Serials ➔ 'Checked at Inspection'
│   ├── [KPI CARD] Unregistered Tags ➔ '0 Found'
│   ├── [KPI CARD] Relocated Units ➔ isCC030.value ? '0' : '1 (in QC Bay)'
│   ├── [KPI CARD] Scan Integrity ➔ '100% Validated'
│   └── [KPI CARD] Total Discrepancies ➔ isCC030.value ? '0' : '1 Unit Variance'
├── ⚡ ACTION BUTTONS & TRIGGERS (1 buttons)
│   └── [BUTTON] "Review Count"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/inventory/stock-movement-ledger`
- **Route Name:** `inventory-stock-movement-ledger`
- **Source Component:** [`src/views/inventory/StockMovementLedger.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/inventory/StockMovementLedger.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/inventory/stock-movement-ledger [inventory-stock-movement-ledger]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Stock Movement Ledger"
│   ├── "Columns"
│   ├── "Export"
│   └── "Movement Ledger"
├── 📑 NAVIGATION TABS & FILTER PILLS (2 tabs)
│   ├── [TAB] "Clear"
│   └── [TAB] "Clear all filters"
├── 📊 SNAPSHOT METRICS & KPI CARDS (4 cards)
│   ├── [KPI CARD] Today ➔ '18 movements'
│   ├── [KPI CARD] Receipts ➔ '4'
│   ├── [KPI CARD] Sales ➔ '7'
│   └── [KPI CARD] Transfers ➔ '5'
├── 📋 DATA TABLES & GRID COLUMNS (2 tables)
│   ├── [TABLE 1] Columns:
│   │   ├── [COL] "Time"
│   │   ├── [COL] "Unit / Product"
│   │   ├── [COL] "Movement"
│   │   ├── [COL] "From"
│   │   ├── [COL] "To"
│   │   ├── [COL] "Reference"
│   │   └── [COL] "User"
│   ├── [TABLE 2] Columns:
│   │   ├── [COL] "Time"
│   │   ├── [COL] "Unit / Product"
│   │   ├── [COL] "Movement"
│   │   ├── [COL] "From"
│   │   ├── [COL] "To"
│   │   ├── [COL] "Reference"
│   │   └── [COL] "User"
├── 📝 FORM FIELDS & INPUT CONTROLS (2 fields)
│   ├── [FIELD] "branchSearchQuery"
│   └── [FIELD] "searchQuery"
├── ⚡ ACTION BUTTONS & TRIGGERS (2 buttons)
│   ├── [BUTTON] "Columns"
│   └── [BUTTON] "Export"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/inventory/quarantine`
- **Route Name:** `inventory-quarantine`
- **Source Component:** [`src/views/inventory/Quarantine.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/inventory/Quarantine.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/inventory/quarantine [inventory-quarantine]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Damaged / Quarantine"
│   ├── "Report Damaged / Quarantine"
│   ├── "Affected Units"
│   ├── "Damaged / Quarantine / Scrap"
│   └── "QC Hold"
├── 📑 NAVIGATION TABS & FILTER PILLS (1 tabs)
│   └── [TAB] "Clear"
├── 📊 SNAPSHOT METRICS & KPI CARDS (4 cards)
│   ├── [KPI CARD] Affected Units ➔ '4'
│   ├── [KPI CARD] Quarantine ➔ '2'
│   ├── [KPI CARD] Service Route ➔ '1'
│   └── [KPI CARD] Decision Pending ➔ '1'
├── 📋 DATA TABLES & GRID COLUMNS (2 tables)
│   ├── [TABLE 1] Columns:
│   │   ├── [COL] "Unit"
│   │   ├── [COL] "Product"
│   │   ├── [COL] "Condition"
│   │   ├── [COL] "Source"
│   │   ├── [COL] "Decision"
│   │   ├── [COL] "Status"
│   │   └── [COL] "Actions"
│   ├── [TABLE 2] Columns:
│   │   ├── [COL] "Serial"
│   │   ├── [COL] "Product"
│   │   ├── [COL] "Branch"
│   │   ├── [COL] "Reason"
│   │   ├── [COL] "Since"
│   │   ├── [COL] "Proposed Action"
│   │   ├── [COL] "Status"
│   │   └── [COL] "Action"
├── 📝 FORM FIELDS & INPUT CONTROLS (2 fields)
│   ├── [FIELD] "branchSearchQuery"
│   └── [FIELD] "searchQuery"
├── ⚡ ACTION BUTTONS & TRIGGERS (2 buttons)
│   ├── [BUTTON] "Report Damaged / Quarantine"
│   └── [BUTTON] "Edit &rarr;"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/inventory/quarantine/create`
- **Route Name:** `inventory-create-quarantine`
- **Source Component:** [`src/views/inventory/CreateQuarantineRecord.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/inventory/CreateQuarantineRecord.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/inventory/quarantine/create [inventory-create-quarantine]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Affected Unit Details"
│   ├── "Inspection & Disposition"
│   └── "Isolation active upon submit"
├── 📝 FORM FIELDS & INPUT CONTROLS (9 fields)
│   ├── [FIELD] "form.unit"
│   ├── [FIELD] "form.product"
│   ├── [FIELD] "form.source"
│   ├── [FIELD] "form.condition"
│   ├── [FIELD] "form.status"
│   ├── [FIELD] "form.decision"
│   ├── [FIELD] "form.evidence"
│   ├── [FIELD] "form.notes"
│   └── [FIELD] "form.approval"
├── ⚡ ACTION BUTTONS & TRIGGERS (1 buttons)
│   └── [BUTTON] "Cancel"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/inventory/quarantine/detail`
- **Route Name:** `inventory-quarantine-detail-legacy`
- **Source Component:** [`src/views/inventory/QuarantineDetail.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/inventory/QuarantineDetail.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/inventory/quarantine/detail [inventory-quarantine-detail-legacy]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Report Unit"
│   ├── "Branch context"
│   ├── "Assignee"
│   ├── "Branch Team"
│   └── "Due"
├── 📑 NAVIGATION TABS & FILTER PILLS (6 tabs)
│   ├── [TAB] "Quarantine Overview"
│   ├── [TAB] "Defect Analysis"
│   ├── [TAB] "Disposition"
│   ├── [TAB] "Supplier Claim"
│   ├── [TAB] "Approval"
│   └── [TAB] "Activity"
├── 📊 SNAPSHOT METRICS & KPI CARDS (25 cards)
│   ├── [KPI CARD] Unit ➔ isX5.value ? 'X5-00401' : 'M3-01014'
│   ├── [KPI CARD] Product ➔ isX5.value ? 'BRG X5' : 'BRG M3'
│   ├── [KPI CARD] Condition ➔ isX5.value ? 'Body panel dent' : 'Packaging damage'
│   ├── [KPI CARD] Source ➔ isX5.value ? 'Inbound INB-083' : 'TR-221'
│   ├── [KPI CARD] Decision ➔ isX5.value ? 'Supplier-return review' : 'QC / service'
│   ├── [KPI CARD] Status ➔ isX5.value ? 'Decision Pending' : 'Quarantine'
│   ├── [KPI CARD] Defect Classification ➔ isX5.value ? 'Exterior Panel Cosmetic Damage' : 'Transit Packaging & Casing Damage'
│   ├── [KPI CARD] Severity Level ➔ isX5.value ? 'Moderate (Surface Dent)' : 'Low (Protective Packaging Only)'
│   ├── [KPI CARD] Physical Location ➔ `${branchName
│   ├── [KPI CARD] Isolation Status ➔ 'Quarantine Lock Active'
│   ├── [KPI CARD] Drive / Operable State ➔ isX5.value ? 'Operable (Awaiting Bodywork)' : 'Fully Functional (Repack Needed)'
│   ├── [KPI CARD] Safety Hazard ➔ 'None Reported'
│   ├── [KPI CARD] Attached Inspection ➔ isX5.value ? 'Panel_Dent_Photo_01.jpg' : 'Packaging_Tear_Log.pdf'
│   ├── [KPI CARD] Inspected By ➔ `${branchName
│   ├── [KPI CARD] Inspection Timestamp ➔ 'Today 10:15'
│   ├── [KPI CARD] Physical Findings ➔ isX5.value ? '3cm dent on right rear door panel' : 'Outer carton torn during transit unloading'
│   ├── [KPI CARD] Checklist Signed ➔ 'Yes (100% Passed Safety)'
│   ├── [KPI CARD] Supporting Files ➔ '2 Files Attached'
│   ├── [KPI CARD] Proposed Disposition ➔ isX5.value ? 'Supplier Return / Warranty Claim' : 'Internal Service & Re-pack'
│   ├── [KPI CARD] Assigned Service Bay ➔ isX5.value ? 'Supplier RMA Dept' : `${branchName
│   ├── [KPI CARD] Approving Authority ➔ 'Central HQ QC Lead'
│   ├── [KPI CARD] Estimated Turnaround ➔ isX5.value ? '3-5 Business Days' : '24 Hours'
│   ├── [KPI CARD] Cost Allocation ➔ isX5.value ? 'Supplier Inbound Claim' : 'Internal Logistics'
│   ├── [KPI CARD] Disposition Status ➔ isX5.value ? 'Awaiting HQ Sign-off' : 'Approved for Service'
│   └── [KPI CARD] 10:45 ➔ 'Unit isolated to Quarantine QC Bay'
├── ⚡ ACTION BUTTONS & TRIGGERS (3 buttons)
│   ├── [BUTTON] "Back to List"
│   ├── [BUTTON] "Report Unit"
│   └── [BUTTON] "Disposition Review"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/inventory/quarantine/:id`
- **Route Name:** `inventory-quarantine-detail`
- **Source Component:** [`src/views/inventory/QuarantineDetail.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/inventory/QuarantineDetail.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/inventory/quarantine/:id [inventory-quarantine-detail]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Report Unit"
│   ├── "Branch context"
│   ├── "Assignee"
│   ├── "Branch Team"
│   └── "Due"
├── 📑 NAVIGATION TABS & FILTER PILLS (6 tabs)
│   ├── [TAB] "Quarantine Overview"
│   ├── [TAB] "Defect Analysis"
│   ├── [TAB] "Disposition"
│   ├── [TAB] "Supplier Claim"
│   ├── [TAB] "Approval"
│   └── [TAB] "Activity"
├── 📊 SNAPSHOT METRICS & KPI CARDS (25 cards)
│   ├── [KPI CARD] Unit ➔ isX5.value ? 'X5-00401' : 'M3-01014'
│   ├── [KPI CARD] Product ➔ isX5.value ? 'BRG X5' : 'BRG M3'
│   ├── [KPI CARD] Condition ➔ isX5.value ? 'Body panel dent' : 'Packaging damage'
│   ├── [KPI CARD] Source ➔ isX5.value ? 'Inbound INB-083' : 'TR-221'
│   ├── [KPI CARD] Decision ➔ isX5.value ? 'Supplier-return review' : 'QC / service'
│   ├── [KPI CARD] Status ➔ isX5.value ? 'Decision Pending' : 'Quarantine'
│   ├── [KPI CARD] Defect Classification ➔ isX5.value ? 'Exterior Panel Cosmetic Damage' : 'Transit Packaging & Casing Damage'
│   ├── [KPI CARD] Severity Level ➔ isX5.value ? 'Moderate (Surface Dent)' : 'Low (Protective Packaging Only)'
│   ├── [KPI CARD] Physical Location ➔ `${branchName
│   ├── [KPI CARD] Isolation Status ➔ 'Quarantine Lock Active'
│   ├── [KPI CARD] Drive / Operable State ➔ isX5.value ? 'Operable (Awaiting Bodywork)' : 'Fully Functional (Repack Needed)'
│   ├── [KPI CARD] Safety Hazard ➔ 'None Reported'
│   ├── [KPI CARD] Attached Inspection ➔ isX5.value ? 'Panel_Dent_Photo_01.jpg' : 'Packaging_Tear_Log.pdf'
│   ├── [KPI CARD] Inspected By ➔ `${branchName
│   ├── [KPI CARD] Inspection Timestamp ➔ 'Today 10:15'
│   ├── [KPI CARD] Physical Findings ➔ isX5.value ? '3cm dent on right rear door panel' : 'Outer carton torn during transit unloading'
│   ├── [KPI CARD] Checklist Signed ➔ 'Yes (100% Passed Safety)'
│   ├── [KPI CARD] Supporting Files ➔ '2 Files Attached'
│   ├── [KPI CARD] Proposed Disposition ➔ isX5.value ? 'Supplier Return / Warranty Claim' : 'Internal Service & Re-pack'
│   ├── [KPI CARD] Assigned Service Bay ➔ isX5.value ? 'Supplier RMA Dept' : `${branchName
│   ├── [KPI CARD] Approving Authority ➔ 'Central HQ QC Lead'
│   ├── [KPI CARD] Estimated Turnaround ➔ isX5.value ? '3-5 Business Days' : '24 Hours'
│   ├── [KPI CARD] Cost Allocation ➔ isX5.value ? 'Supplier Inbound Claim' : 'Internal Logistics'
│   ├── [KPI CARD] Disposition Status ➔ isX5.value ? 'Awaiting HQ Sign-off' : 'Approved for Service'
│   └── [KPI CARD] 10:45 ➔ 'Unit isolated to Quarantine QC Bay'
├── ⚡ ACTION BUTTONS & TRIGGERS (3 buttons)
│   ├── [BUTTON] "Back to List"
│   ├── [BUTTON] "Report Unit"
│   └── [BUTTON] "Disposition Review"
└── (No secondary dialogs)
```

### 📁 MODULE: `SALES` (42 Total Routes)

#### 📍 ROUTE: `/sales/dashboard`
- **Route Name:** `sales-dashboard`
- **Source Component:** [`src/views/sales/SalesDashboard.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/sales/SalesDashboard.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/sales/dashboard [sales-dashboard]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Sales Dashboard"
│   ├── "Sales Trend"
│   ├── "Top Products"
│   ├── "BRG E-125"
│   └── "12 units"
├── 📊 SNAPSHOT METRICS & KPI CARDS (12 cards)
│   ├── [KPI CARD] Units Sold ➔ '7'
│   ├── [KPI CARD] Collections ➔ 'PKR 1.32M'
│   ├── [KPI CARD] Outstanding ➔ 'PKR 520K'
│   ├── [KPI CARD] Net Sales ➔ 'PKR 28.4M'
│   ├── [KPI CARD] Orders ➔ '197'
│   ├── [KPI CARD] Avg Sale ➔ 'PKR 144K'
│   ├── [KPI CARD] Discounts ➔ 'PKR 0.9M'
│   ├── [KPI CARD] Gross Profit ➔ 'PKR 6.9M'
│   ├── [KPI CARD] Peshawar ➔ 98
│   ├── [KPI CARD] Islamabad ➔ 76
│   ├── [KPI CARD] Lahore ➔ 62
│   └── [KPI CARD] Rawalpindi ➔ 49
├── 📋 DATA TABLES & GRID COLUMNS (2 tables)
│   ├── [TABLE 1] Columns:
│   │   ├── [COL] "Product"
│   │   ├── [COL] "Revenue"
│   │   ├── [COL] "Units"
│   │   └── [COL] "Margin"
│   ├── [TABLE 2] Columns:
│   │   ├── [COL] "Branch"
│   │   ├── [COL] "Collected"
│   │   ├── [COL] "Outstanding"
│   │   └── [COL] "Overdue"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/sales/quotations`
- **Route Name:** `sales-quotations`
- **Source Component:** [`src/views/sales/Quotations.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/sales/Quotations.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/sales/quotations [sales-quotations]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Quotations"
│   ├── "New Quotation"
│   └── "Branch Quotations"
├── 📑 NAVIGATION TABS & FILTER PILLS (7 tabs)
│   ├── [TAB] "Reset Filters"
│   ├── [TAB] "Reset filters"
│   ├── [TAB] "All"
│   ├── [TAB] "Draft"
│   ├── [TAB] "Sent"
│   ├── [TAB] "Accepted"
│   └── [TAB] "Expired"
├── 📊 SNAPSHOT METRICS & KPI CARDS (4 cards)
│   ├── [KPI CARD] Open ➔ String(openCount || 18)
│   ├── [KPI CARD] Accepted ➔ String(acceptedCount || 7)
│   ├── [KPI CARD] Expiring ➔ String(expiringCount || 4)
│   └── [KPI CARD] Value ➔ valStr || 'PKR 4.2M'
├── 📋 DATA TABLES & GRID COLUMNS (2 tables)
│   ├── [TABLE 1] Columns:
│   │   ├── [COL] "Quotation"
│   │   ├── [COL] "Customer"
│   │   ├── [COL] "Product"
│   │   ├── [COL] "Value"
│   │   ├── [COL] "Status"
│   │   └── [COL] "Actions"
│   ├── [TABLE 2] Columns:
│   │   ├── [COL] "Quote"
│   │   ├── [COL] "Branch"
│   │   ├── [COL] "Customer"
│   │   ├── [COL] "Items"
│   │   ├── [COL] "Amount"
│   │   ├── [COL] "Valid Until"
│   │   ├── [COL] "Status"
│   │   ├── [COL] "Owner"
│   │   └── [COL] "Action"
├── 📝 FORM FIELDS & INPUT CONTROLS (2 fields)
│   ├── [FIELD] "branchSearchQuery"
│   └── [FIELD] "searchQuery"
├── ⚡ ACTION BUTTONS & TRIGGERS (3 buttons)
│   ├── [BUTTON] "New Quotation"
│   ├── [BUTTON] "Open &rsaquo;"
│   └── [BUTTON] "Edit &rarr;"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/sales/quotations/create`
- **Route Name:** `sales-create-quotation`
- **Source Component:** [`src/views/sales/CreateQuotation.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/sales/CreateQuotation.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/sales/quotations/create [sales-create-quotation]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Branch Assignment"
│   ├── "Customer & Commercial Terms"
│   ├── "Delivery & Validity Terms"
│   ├── "Vehicles & Quoted Items"
│   └── "Subtotal"
├── 📝 FORM FIELDS & INPUT CONTROLS (12 fields)
│   ├── [FIELD] "form.branch"
│   ├── [FIELD] "customerSearch"
│   ├── [FIELD] "form.paymentTerms"
│   ├── [FIELD] "form.taxRegFees"
│   ├── [FIELD] "form.deliveryLeadTime"
│   ├── [FIELD] "form.validity"
│   ├── [FIELD] "item.product"
│   ├── [FIELD] "item.quantity"
│   ├── [FIELD] "item.sellingPrice"
│   ├── [FIELD] "item.warranty"
│   ├── [FIELD] "form.discount"
│   └── [FIELD] "form.notes"
├── ⚡ ACTION BUTTONS & TRIGGERS (4 buttons)
│   ├── [BUTTON] "Create New Customer"
│   ├── [BUTTON] "+ Add New Customer"
│   ├── [BUTTON] "Add Vehicle"
│   └── [BUTTON] "Cancel"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/sales/quotations/detail`
- **Route Name:** `sales-quotation-detail-legacy`
- **Source Component:** [`src/views/sales/QuotationDetail.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/sales/QuotationDetail.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/sales/quotations/detail [sales-quotation-detail-legacy]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Quotation Not Found"
│   ├── "Related information"
│   ├── "Owner"
│   ├── "Hamza"
│   └── "Last Contact"
├── 📑 NAVIGATION TABS & FILTER PILLS (7 tabs)
│   ├── [TAB] "Summary"
│   ├── [TAB] "Items"
│   ├── [TAB] "Customer"
│   ├── [TAB] "Pricing"
│   ├── [TAB] "Communication"
│   ├── [TAB] "Documents"
│   └── [TAB] "Activity"
├── 📊 SNAPSHOT METRICS & KPI CARDS (25 cards)
│   ├── [KPI CARD] Status ➔ quoteStatus
│   ├── [KPI CARD] Customer ➔ customerName
│   ├── [KPI CARD] Product ➔ productName
│   ├── [KPI CARD] Quantity ➔ q?.quantity || '1 unit'
│   ├── [KPI CARD] Quoted Price ➔ quotePrice
│   ├── [KPI CARD] Valid Until ➔ q?.validTill || q?.validity || '31 Aug 2026'
│   ├── [KPI CARD] Item Name ➔ productName
│   ├── [KPI CARD] Specification ➔ 'Standard Electric Motor & Battery Pack'
│   ├── [KPI CARD] Inventory Allocation ➔ `${branchName
│   ├── [KPI CARD] Warranty Plan ➔ '1-Year Standard Service'
│   ├── [KPI CARD] Delivery Lead Time ➔ 'Within 3 business days'
│   ├── [KPI CARD] Chassis Reservation ➔ 'Reserved upon acceptance'
│   ├── [KPI CARD] Full Name ➔ customerName
│   ├── [KPI CARD] Phone ➔ '+92 312 5538198'
│   ├── [KPI CARD] Email ➔ `${customerName.toLowerCase().replace(/\s+/g
│   ├── [KPI CARD] Customer Type ➔ 'Retail Individual'
│   ├── [KPI CARD] Branch Association ➔ `${branchName
│   ├── [KPI CARD] Previous Purchases ➔ '1 Completed Unit'
│   ├── [KPI CARD] Base List Price ➔ q?.sellingPrice || quotePrice
│   ├── [KPI CARD] Permitted Discount ➔ q?.discount || 'PKR 0'
│   ├── [KPI CARD] Net Payable ➔ quotePrice
│   ├── [KPI CARD] Tax / Reg Fees ➔ 'Included in Quote'
│   ├── [KPI CARD] Payment Terms ➔ '100% Advance / Bank Transfer'
│   ├── [KPI CARD] Price Lock Validity ➔ '7 Days from generation'
│   └── [KPI CARD] WhatsApp Dispatch ➔ 'Sent (Delivered)'
├── ⚡ ACTION BUTTONS & TRIGGERS (4 buttons)
│   ├── [BUTTON] "Back to Quotations"
│   ├── [BUTTON] "Back to List"
│   ├── [BUTTON] "Accept Quote"
│   └── [BUTTON] "Convert to Sales Order"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/sales/quotations/:id`
- **Route Name:** `sales-quotation-detail`
- **Source Component:** [`src/views/sales/QuotationDetail.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/sales/QuotationDetail.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/sales/quotations/:id [sales-quotation-detail]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Quotation Not Found"
│   ├── "Related information"
│   ├── "Owner"
│   ├── "Hamza"
│   └── "Last Contact"
├── 📑 NAVIGATION TABS & FILTER PILLS (7 tabs)
│   ├── [TAB] "Summary"
│   ├── [TAB] "Items"
│   ├── [TAB] "Customer"
│   ├── [TAB] "Pricing"
│   ├── [TAB] "Communication"
│   ├── [TAB] "Documents"
│   └── [TAB] "Activity"
├── 📊 SNAPSHOT METRICS & KPI CARDS (25 cards)
│   ├── [KPI CARD] Status ➔ quoteStatus
│   ├── [KPI CARD] Customer ➔ customerName
│   ├── [KPI CARD] Product ➔ productName
│   ├── [KPI CARD] Quantity ➔ q?.quantity || '1 unit'
│   ├── [KPI CARD] Quoted Price ➔ quotePrice
│   ├── [KPI CARD] Valid Until ➔ q?.validTill || q?.validity || '31 Aug 2026'
│   ├── [KPI CARD] Item Name ➔ productName
│   ├── [KPI CARD] Specification ➔ 'Standard Electric Motor & Battery Pack'
│   ├── [KPI CARD] Inventory Allocation ➔ `${branchName
│   ├── [KPI CARD] Warranty Plan ➔ '1-Year Standard Service'
│   ├── [KPI CARD] Delivery Lead Time ➔ 'Within 3 business days'
│   ├── [KPI CARD] Chassis Reservation ➔ 'Reserved upon acceptance'
│   ├── [KPI CARD] Full Name ➔ customerName
│   ├── [KPI CARD] Phone ➔ '+92 312 5538198'
│   ├── [KPI CARD] Email ➔ `${customerName.toLowerCase().replace(/\s+/g
│   ├── [KPI CARD] Customer Type ➔ 'Retail Individual'
│   ├── [KPI CARD] Branch Association ➔ `${branchName
│   ├── [KPI CARD] Previous Purchases ➔ '1 Completed Unit'
│   ├── [KPI CARD] Base List Price ➔ q?.sellingPrice || quotePrice
│   ├── [KPI CARD] Permitted Discount ➔ q?.discount || 'PKR 0'
│   ├── [KPI CARD] Net Payable ➔ quotePrice
│   ├── [KPI CARD] Tax / Reg Fees ➔ 'Included in Quote'
│   ├── [KPI CARD] Payment Terms ➔ '100% Advance / Bank Transfer'
│   ├── [KPI CARD] Price Lock Validity ➔ '7 Days from generation'
│   └── [KPI CARD] WhatsApp Dispatch ➔ 'Sent (Delivered)'
├── ⚡ ACTION BUTTONS & TRIGGERS (4 buttons)
│   ├── [BUTTON] "Back to Quotations"
│   ├── [BUTTON] "Back to List"
│   ├── [BUTTON] "Accept Quote"
│   └── [BUTTON] "Convert to Sales Order"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/sales/orders`
- **Route Name:** `sales-orders`
- **Source Component:** [`src/views/sales/Orders.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/sales/Orders.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/sales/orders [sales-orders]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Orders"
│   ├── "Create Sale"
│   ├── "Branch Orders"
│   └── "Create Order"
├── 📑 NAVIGATION TABS & FILTER PILLS (9 tabs)
│   ├── [TAB] "Reset filters"
│   ├── [TAB] "All"
│   ├── [TAB] "New"
│   ├── [TAB] "Confirmed"
│   ├── [TAB] "Payment Pending"
│   ├── [TAB] "Reserved"
│   ├── [TAB] "Ready"
│   ├── [TAB] "Completed"
│   └── [TAB] "Returned"
├── 📊 SNAPSHOT METRICS & KPI CARDS (4 cards)
│   ├── [KPI CARD] Open Orders ➔ String(openCount)
│   ├── [KPI CARD] Reserved Units ➔ String(reservedCount)
│   ├── [KPI CARD] Unpaid / Partial ➔ String(unpaidCount)
│   └── [KPI CARD] Completed ➔ String(completedCount)
├── 📋 DATA TABLES & GRID COLUMNS (2 tables)
│   ├── [TABLE 1] Columns:
│   │   ├── [COL] "Order"
│   │   ├── [COL] "Customer"
│   │   ├── [COL] "Product"
│   │   ├── [COL] "Total"
│   │   ├── [COL] "Status"
│   │   └── [COL] "Action"
│   ├── [TABLE 2] Columns:
│   │   ├── [COL] "Order"
│   │   ├── [COL] "Branch"
│   │   ├── [COL] "Customer"
│   │   ├── [COL] "Unit"
│   │   ├── [COL] "Amount"
│   │   ├── [COL] "Paid"
│   │   ├── [COL] "Balance"
│   │   ├── [COL] "Status"
│   │   ├── [COL] "Delivery"
│   │   └── [COL] "Action"
├── 📝 FORM FIELDS & INPUT CONTROLS (2 fields)
│   ├── [FIELD] "branchSearchQuery"
│   └── [FIELD] "searchQuery"
├── ⚡ ACTION BUTTONS & TRIGGERS (4 buttons)
│   ├── [BUTTON] "Create Sale"
│   ├── [BUTTON] "Open &rsaquo;"
│   ├── [BUTTON] "Create Order"
│   └── [BUTTON] "View"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/sales/orders/create`
- **Route Name:** `sales-create-order`
- **Source Component:** [`src/views/sales/CreateSale.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/sales/CreateSale.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/sales/orders/create [sales-create-order]
│
├── 🏷️ HEADERS & TITLES
│   ├── "1. Dealership & Customer"
│   ├── "Step 1 of 4"
│   ├── "2. Vehicle Price & Discounts"
│   ├── "All amounts in PKR"
│   └── "Max 8% branch allowance"
├── 📋 DATA TABLES & GRID COLUMNS (1 tables)
│   ├── [TABLE 1] Columns:
│   │   ├── [COL] "Serial"
│   │   ├── [COL] "Chassis (VIN)"
│   │   ├── [COL] "Status"
│   │   ├── [COL] "Landed Cost"
│   │   └── [COL] "Select"
├── 📝 FORM FIELDS & INPUT CONTROLS (15 fields)
│   ├── [FIELD] "saleData.branch"
│   ├── [FIELD] "customerSearch"
│   ├── [FIELD] "saleData.salesperson"
│   ├── [FIELD] "saleData.product"
│   ├── [FIELD] "saleData.cataloguePrice"
│   ├── [FIELD] "saleData.discount"
│   ├── [FIELD] "saleData.finalPrice"
│   ├── [FIELD] "saleData.selectedUnit"
│   ├── [FIELD] "saleData.paymentMethod"
│   ├── [FIELD] "saleData.transactionId"
│   ├── [FIELD] "saleData.bankAccount"
│   ├── [FIELD] "saleData.chequeNo"
│   ├── [FIELD] "saleData.draweeBank"
│   ├── [FIELD] "saleData.amountReceived"
│   └── [FIELD] "saleData.balance"
├── ⚡ ACTION BUTTONS & TRIGGERS (3 buttons)
│   ├── [BUTTON] "Create New Customer"
│   ├── [BUTTON] "+ Add New Customer"
│   └── [BUTTON] "Cancel"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/sales/create-sale`
- **Route Name:** `sales-create-sale-alias`
- **Source Component:** [`src/views/sales/CreateSale.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/sales/CreateSale.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/sales/create-sale [sales-create-sale-alias]
│
├── 🏷️ HEADERS & TITLES
│   ├── "1. Dealership & Customer"
│   ├── "Step 1 of 4"
│   ├── "2. Vehicle Price & Discounts"
│   ├── "All amounts in PKR"
│   └── "Max 8% branch allowance"
├── 📋 DATA TABLES & GRID COLUMNS (1 tables)
│   ├── [TABLE 1] Columns:
│   │   ├── [COL] "Serial"
│   │   ├── [COL] "Chassis (VIN)"
│   │   ├── [COL] "Status"
│   │   ├── [COL] "Landed Cost"
│   │   └── [COL] "Select"
├── 📝 FORM FIELDS & INPUT CONTROLS (15 fields)
│   ├── [FIELD] "saleData.branch"
│   ├── [FIELD] "customerSearch"
│   ├── [FIELD] "saleData.salesperson"
│   ├── [FIELD] "saleData.product"
│   ├── [FIELD] "saleData.cataloguePrice"
│   ├── [FIELD] "saleData.discount"
│   ├── [FIELD] "saleData.finalPrice"
│   ├── [FIELD] "saleData.selectedUnit"
│   ├── [FIELD] "saleData.paymentMethod"
│   ├── [FIELD] "saleData.transactionId"
│   ├── [FIELD] "saleData.bankAccount"
│   ├── [FIELD] "saleData.chequeNo"
│   ├── [FIELD] "saleData.draweeBank"
│   ├── [FIELD] "saleData.amountReceived"
│   └── [FIELD] "saleData.balance"
├── ⚡ ACTION BUTTONS & TRIGGERS (3 buttons)
│   ├── [BUTTON] "Create New Customer"
│   ├── [BUTTON] "+ Add New Customer"
│   └── [BUTTON] "Cancel"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/sales/orders/detail`
- **Route Name:** `sales-order-detail-legacy`
- **Source Component:** [`src/views/sales/OrderDetail.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/sales/OrderDetail.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/sales/orders/detail [sales-order-detail-legacy]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Related information"
│   ├── "Invoice"
│   ├── "Delivery"
│   ├── "Today 16:00"
│   └── "Warranty"
├── 📑 NAVIGATION TABS & FILTER PILLS (11 tabs)
│   ├── [TAB] "Summary"
│   ├── [TAB] "Items & Serialized Unit"
│   ├── [TAB] "Customer"
│   ├── [TAB] "Price & Margin"
│   ├── [TAB] "Payments"
│   ├── [TAB] "Invoice"
│   ├── [TAB] "Delivery"
│   ├── [TAB] "Returns"
│   ├── [TAB] "Warranty"
│   ├── [TAB] "Documents"
│   └── [TAB] "Activity"
├── 📊 SNAPSHOT METRICS & KPI CARDS (25 cards)
│   ├── [KPI CARD] Status ➔ orderStatus
│   ├── [KPI CARD] Customer ➔ customerName
│   ├── [KPI CARD] Product ➔ productName
│   ├── [KPI CARD] Chassis ➔ chassisNo
│   ├── [KPI CARD] Order Total ➔ orderTotal
│   ├── [KPI CARD] Paid ➔ paidAmount
│   ├── [KPI CARD] Product Model ➔ productName
│   ├── [KPI CARD] Chassis Number ➔ chassisNo
│   ├── [KPI CARD] Allocated Unit ➔ u?.serial || o?.unit || `${productName.split(' ')[1] || 'DS11'
│   ├── [KPI CARD] Variant / Color ➔ 'Pearl White / Metallic'
│   ├── [KPI CARD] Battery Serial ➔ u?.batteryNumber || 'BAT-2026-9904'
│   ├── [KPI CARD] QC Inspection ➔ 'Passed 100% Checklist'
│   ├── [KPI CARD] Full Name ➔ customerName
│   ├── [KPI CARD] Contact Phone ➔ c?.phone || '+92 300 1234567'
│   ├── [KPI CARD] CNIC / National ID ➔ c?.cnic || '17301-8849201-3'
│   ├── [KPI CARD] Delivery Address ➔ c?.address || `${branchName
│   ├── [KPI CARD] Customer Segment ➔ 'Retail Individual'
│   ├── [KPI CARD] Account History ➔ 'Verified Buyer'
│   ├── [KPI CARD] Total Billed ➔ orderTotal
│   ├── [KPI CARD] Amount Received ➔ paidAmount
│   ├── [KPI CARD] Outstanding Balance ➔ outstandingBal
│   ├── [KPI CARD] Payment Method ➔ 'Bank Direct Deposit'
│   ├── [KPI CARD] Transaction Ref ➔ `TXN-${orderId.value.replace('ORD-'
│   ├── [KPI CARD] Payment Status ➔ outstandingBal !== 'PKR 0' && outstandingBal !== '0' ? 'Partial Receipt' : 'Fully Cleared'
│   └── [KPI CARD] Invoice Number ➔ `INV-${orderId.value.replace('ORD-'
├── ⚡ ACTION BUTTONS & TRIGGERS (4 buttons)
│   ├── [BUTTON] "Back to List"
│   ├── [BUTTON] "Delivery Handover"
│   ├── [BUTTON] "Cancel Order"
│   └── [BUTTON] "Order Actions"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/sales/orders/:id`
- **Route Name:** `sales-order-detail`
- **Source Component:** [`src/views/sales/OrderDetail.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/sales/OrderDetail.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/sales/orders/:id [sales-order-detail]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Related information"
│   ├── "Invoice"
│   ├── "Delivery"
│   ├── "Today 16:00"
│   └── "Warranty"
├── 📑 NAVIGATION TABS & FILTER PILLS (11 tabs)
│   ├── [TAB] "Summary"
│   ├── [TAB] "Items & Serialized Unit"
│   ├── [TAB] "Customer"
│   ├── [TAB] "Price & Margin"
│   ├── [TAB] "Payments"
│   ├── [TAB] "Invoice"
│   ├── [TAB] "Delivery"
│   ├── [TAB] "Returns"
│   ├── [TAB] "Warranty"
│   ├── [TAB] "Documents"
│   └── [TAB] "Activity"
├── 📊 SNAPSHOT METRICS & KPI CARDS (25 cards)
│   ├── [KPI CARD] Status ➔ orderStatus
│   ├── [KPI CARD] Customer ➔ customerName
│   ├── [KPI CARD] Product ➔ productName
│   ├── [KPI CARD] Chassis ➔ chassisNo
│   ├── [KPI CARD] Order Total ➔ orderTotal
│   ├── [KPI CARD] Paid ➔ paidAmount
│   ├── [KPI CARD] Product Model ➔ productName
│   ├── [KPI CARD] Chassis Number ➔ chassisNo
│   ├── [KPI CARD] Allocated Unit ➔ u?.serial || o?.unit || `${productName.split(' ')[1] || 'DS11'
│   ├── [KPI CARD] Variant / Color ➔ 'Pearl White / Metallic'
│   ├── [KPI CARD] Battery Serial ➔ u?.batteryNumber || 'BAT-2026-9904'
│   ├── [KPI CARD] QC Inspection ➔ 'Passed 100% Checklist'
│   ├── [KPI CARD] Full Name ➔ customerName
│   ├── [KPI CARD] Contact Phone ➔ c?.phone || '+92 300 1234567'
│   ├── [KPI CARD] CNIC / National ID ➔ c?.cnic || '17301-8849201-3'
│   ├── [KPI CARD] Delivery Address ➔ c?.address || `${branchName
│   ├── [KPI CARD] Customer Segment ➔ 'Retail Individual'
│   ├── [KPI CARD] Account History ➔ 'Verified Buyer'
│   ├── [KPI CARD] Total Billed ➔ orderTotal
│   ├── [KPI CARD] Amount Received ➔ paidAmount
│   ├── [KPI CARD] Outstanding Balance ➔ outstandingBal
│   ├── [KPI CARD] Payment Method ➔ 'Bank Direct Deposit'
│   ├── [KPI CARD] Transaction Ref ➔ `TXN-${orderId.value.replace('ORD-'
│   ├── [KPI CARD] Payment Status ➔ outstandingBal !== 'PKR 0' && outstandingBal !== '0' ? 'Partial Receipt' : 'Fully Cleared'
│   └── [KPI CARD] Invoice Number ➔ `INV-${orderId.value.replace('ORD-'
├── ⚡ ACTION BUTTONS & TRIGGERS (4 buttons)
│   ├── [BUTTON] "Back to List"
│   ├── [BUTTON] "Delivery Handover"
│   ├── [BUTTON] "Cancel Order"
│   └── [BUTTON] "Order Actions"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/sales/invoices`
- **Route Name:** `sales-invoices`
- **Source Component:** [`src/views/sales/Invoices.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/sales/Invoices.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/sales/invoices [sales-invoices]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Invoices & Receivables"
│   ├── "Columns"
│   ├── "Export"
│   └── "Invoices"
├── 📑 NAVIGATION TABS & FILTER PILLS (3 tabs)
│   ├── [TAB] "Clear"
│   ├── [TAB] "Clear all filters"
│   └── [TAB] "Reset Filters"
├── 📊 SNAPSHOT METRICS & KPI CARDS (4 cards)
│   ├── [KPI CARD] Paid ➔ '31'
│   ├── [KPI CARD] Partial ➔ '4'
│   ├── [KPI CARD] Unpaid ➔ '3'
│   └── [KPI CARD] Overdue ➔ '1'
├── 📋 DATA TABLES & GRID COLUMNS (2 tables)
│   ├── [TABLE 1] Columns:
│   │   ├── [COL] "Invoice"
│   │   ├── [COL] "Customer"
│   │   ├── [COL] "Order"
│   │   ├── [COL] "Amount"
│   │   ├── [COL] "Status"
│   │   └── [COL] "Actions"
│   ├── [TABLE 2] Columns:
│   │   ├── [COL] "Invoice"
│   │   ├── [COL] "Order"
│   │   ├── [COL] "Branch"
│   │   ├── [COL] "Customer"
│   │   ├── [COL] "Amount"
│   │   ├── [COL] "Issued"
│   │   ├── [COL] "Payment Status"
│   │   └── [COL] "Action"
├── 📝 FORM FIELDS & INPUT CONTROLS (1 fields)
│   └── [FIELD] "branchSearchQuery"
├── ⚡ ACTION BUTTONS & TRIGGERS (5 buttons)
│   ├── [BUTTON] "Create Invoice"
│   ├── [BUTTON] "Columns"
│   ├── [BUTTON] "Export"
│   ├── [BUTTON] "Open &rsaquo;"
│   └── [BUTTON] "Open"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/sales/invoices/create`
- **Route Name:** `sales-create-invoice`
- **Source Component:** [`src/views/sales/CreateInvoice.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/sales/CreateInvoice.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/sales/invoices/create [sales-create-invoice]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Assignment"
│   ├── "Customer Details"
│   ├── "Invoice Terms"
│   ├── "Line Items"
│   └── "Subtotal"
├── 📝 FORM FIELDS & INPUT CONTROLS (13 fields)
│   ├── [FIELD] "form.branch"
│   ├── [FIELD] "customerSearch"
│   ├── [FIELD] "form.relatedReference"
│   ├── [FIELD] "form.paymentTerms"
│   ├── [FIELD] "form.issueDate"
│   ├── [FIELD] "form.dueDate"
│   ├── [FIELD] "form.status"
│   ├── [FIELD] "item.description"
│   ├── [FIELD] "item.quantity"
│   ├── [FIELD] "item.unitPrice"
│   ├── [FIELD] "form.discount"
│   ├── [FIELD] "form.tax"
│   └── [FIELD] "form.notes"
├── ⚡ ACTION BUTTONS & TRIGGERS (4 buttons)
│   ├── [BUTTON] "Create New Customer"
│   ├── [BUTTON] "+ Add New Customer"
│   ├── [BUTTON] "Add Custom Item"
│   └── [BUTTON] "Cancel"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/sales/invoices/detail`
- **Route Name:** `sales-invoice-detail-legacy`
- **Source Component:** [`src/views/sales/InvoiceDetail.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/sales/InvoiceDetail.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/sales/invoices/detail [sales-invoice-detail-legacy]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Invoice Not Found"
│   ├── "Invoice"
│   ├── "Invoice No:"
│   ├── "Order No:"
│   └── "Date Issued:"
├── 📋 DATA TABLES & GRID COLUMNS (1 tables)
│   ├── [TABLE 1] Columns:
│   │   ├── [COL] "Description"
│   │   ├── [COL] "Qty"
│   │   ├── [COL] "Unit Price"
│   │   └── [COL] "Total Amount"
├── ⚡ ACTION BUTTONS & TRIGGERS (3 buttons)
│   ├── [BUTTON] "Back to Invoices"
│   ├── [BUTTON] "Print"
│   └── [BUTTON] "Download PDF"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/sales/invoices/:id`
- **Route Name:** `sales-invoice-detail`
- **Source Component:** [`src/views/sales/InvoiceDetail.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/sales/InvoiceDetail.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/sales/invoices/:id [sales-invoice-detail]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Invoice Not Found"
│   ├── "Invoice"
│   ├── "Invoice No:"
│   ├── "Order No:"
│   └── "Date Issued:"
├── 📋 DATA TABLES & GRID COLUMNS (1 tables)
│   ├── [TABLE 1] Columns:
│   │   ├── [COL] "Description"
│   │   ├── [COL] "Qty"
│   │   ├── [COL] "Unit Price"
│   │   └── [COL] "Total Amount"
├── ⚡ ACTION BUTTONS & TRIGGERS (3 buttons)
│   ├── [BUTTON] "Back to Invoices"
│   ├── [BUTTON] "Print"
│   └── [BUTTON] "Download PDF"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/sales/payments`
- **Route Name:** `sales-payments`
- **Source Component:** [`src/views/sales/Payments.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/sales/Payments.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/sales/payments [sales-payments]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Payments"
│   └── "Record Payment"
├── 📑 NAVIGATION TABS & FILTER PILLS (1 tabs)
│   └── [TAB] "Clear"
├── 📊 SNAPSHOT METRICS & KPI CARDS (8 cards)
│   ├── [KPI CARD] Collected ➔ 'PKR 8.7M'
│   ├── [KPI CARD] Cash ➔ 'PKR 1.4M'
│   ├── [KPI CARD] Bank ➔ 'PKR 6.8M'
│   ├── [KPI CARD] Unreconciled ➔ '3'
│   ├── [KPI CARD] Collected This Month ➔ 'PKR 25.5M'
│   ├── [KPI CARD] Unallocated ➔ 'PKR 0'
│   ├── [KPI CARD] Refunded ➔ 'PKR 0.4M'
│   └── [KPI CARD] Outstanding ➔ 'PKR 2.9M'
├── 📋 DATA TABLES & GRID COLUMNS (2 tables)
│   ├── [TABLE 1] Columns:
│   │   ├── [COL] "Payment"
│   │   ├── [COL] "Customer"
│   │   ├── [COL] "Method"
│   │   ├── [COL] "Amount"
│   │   ├── [COL] "Status"
│   │   └── [COL] "Actions"
│   ├── [TABLE 2] Columns:
│   │   ├── [COL] "Payment"
│   │   ├── [COL] "Order"
│   │   ├── [COL] "Customer"
│   │   ├── [COL] "Branch"
│   │   ├── [COL] "Method"
│   │   ├── [COL] "Amount"
│   │   ├── [COL] "Date"
│   │   ├── [COL] "Status"
│   │   └── [COL] "Actions"
├── 📝 FORM FIELDS & INPUT CONTROLS (1 fields)
│   └── [FIELD] "branchSearchQuery"
├── ⚡ ACTION BUTTONS & TRIGGERS (4 buttons)
│   ├── [BUTTON] "Record Payment"
│   ├── [BUTTON] "Columns"
│   ├── [BUTTON] "Export"
│   └── [BUTTON] "Open &rsaquo;"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/sales/payments/create`
- **Route Name:** `sales-create-payment`
- **Source Component:** [`src/views/sales/CreatePayment.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/sales/CreatePayment.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/sales/payments/create [sales-create-payment]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Dealership Cash Rule:"
│   ├── "Verification & Reconciliation"
│   └── "* (Mandatory for Bank Transfer)"
├── 📝 FORM FIELDS & INPUT CONTROLS (9 fields)
│   ├── [FIELD] "form.invoice_id"
│   ├── [FIELD] "form.customer"
│   ├── [FIELD] "form.order"
│   ├── [FIELD] "form.method"
│   ├── [FIELD] "e.g. PKR 280,000"
│   ├── [FIELD] "form.transactionRef"
│   ├── [FIELD] "form.bankAccount"
│   ├── [FIELD] "form.date"
│   └── [FIELD] "form.notes"
├── ⚡ ACTION BUTTONS & TRIGGERS (1 buttons)
│   └── [BUTTON] "Cancel"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/sales/payments/detail`
- **Route Name:** `sales-payment-detail-legacy`
- **Source Component:** [`src/views/sales/PaymentDetail.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/sales/PaymentDetail.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/sales/payments/detail [sales-payment-detail-legacy]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Payment Not Found"
│   ├── "Record Payment"
│   ├── "Related information"
│   ├── "Receipt"
│   └── "Posted"
├── 📑 NAVIGATION TABS & FILTER PILLS (5 tabs)
│   ├── [TAB] "Summary"
│   ├── [TAB] "Allocation"
│   ├── [TAB] "Bank Details"
│   ├── [TAB] "Customer Account"
│   └── [TAB] "Activity"
├── 📊 SNAPSHOT METRICS & KPI CARDS (25 cards)
│   ├── [KPI CARD] Payment ➔ p.id || paymentId.value
│   ├── [KPI CARD] Customer ➔ customerName
│   ├── [KPI CARD] Method ➔ method
│   ├── [KPI CARD] Amount ➔ amount
│   ├── [KPI CARD] Order Reference ➔ orderRef
│   ├── [KPI CARD] Status ➔ status
│   ├── [KPI CARD] Applied Invoice ➔ p.invoice_id || `INV-${orderRef.replace('ORD-'
│   ├── [KPI CARD] Total Order Value ➔ totalBilled
│   ├── [KPI CARD] Payment Allocation ➔ `${amount
│   ├── [KPI CARD] Unallocated Funds ➔ 'PKR 0'
│   ├── [KPI CARD] Remaining Balance ➔ remainingBal
│   ├── [KPI CARD] Allocation Rule ➔ 'First In First Out'
│   ├── [KPI CARD] Deposit Account ➔ p.bankAccount || 'Meezan Bank - Main Operational Account'
│   ├── [KPI CARD] Transaction Slip ➔ p.ref || p.transactionRef || `TXN-${paymentId.value.replace('PAY-'
│   ├── [KPI CARD] Bank Branch ➔ `${branchName
│   ├── [KPI CARD] Clearing Date ➔ p.date || 'Today 10:45'
│   ├── [KPI CARD] Bank Fee / Charges ➔ 'PKR 0'
│   ├── [KPI CARD] Reconciliation State ➔ is7788.value ? 'Cash Drawer Unverified' : 'Bank Matched 100%'
│   ├── [KPI CARD] Account Holder ➔ customerName
│   ├── [KPI CARD] Total Lifetime Orders ➔ '2 Completed'
│   ├── [KPI CARD] Credit Limit ➔ 'PKR 0 (Advance only)'
│   ├── [KPI CARD] Current Receivables ➔ remainingBal
│   ├── [KPI CARD] Payment Reliability ➔ 'Excellent (Prompt Pay)'
│   ├── [KPI CARD] Branch Account ➔ `${branchName
│   └── [KPI CARD] 10:45 ➔ `Payment of ${amount
├── ⚡ ACTION BUTTONS & TRIGGERS (3 buttons)
│   ├── [BUTTON] "Back to Payments"
│   ├── [BUTTON] "Back to List"
│   └── [BUTTON] "Record Payment"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/sales/payments/:id`
- **Route Name:** `sales-payment-detail`
- **Source Component:** [`src/views/sales/PaymentDetail.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/sales/PaymentDetail.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/sales/payments/:id [sales-payment-detail]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Payment Not Found"
│   ├── "Record Payment"
│   ├── "Related information"
│   ├── "Receipt"
│   └── "Posted"
├── 📑 NAVIGATION TABS & FILTER PILLS (5 tabs)
│   ├── [TAB] "Summary"
│   ├── [TAB] "Allocation"
│   ├── [TAB] "Bank Details"
│   ├── [TAB] "Customer Account"
│   └── [TAB] "Activity"
├── 📊 SNAPSHOT METRICS & KPI CARDS (25 cards)
│   ├── [KPI CARD] Payment ➔ p.id || paymentId.value
│   ├── [KPI CARD] Customer ➔ customerName
│   ├── [KPI CARD] Method ➔ method
│   ├── [KPI CARD] Amount ➔ amount
│   ├── [KPI CARD] Order Reference ➔ orderRef
│   ├── [KPI CARD] Status ➔ status
│   ├── [KPI CARD] Applied Invoice ➔ p.invoice_id || `INV-${orderRef.replace('ORD-'
│   ├── [KPI CARD] Total Order Value ➔ totalBilled
│   ├── [KPI CARD] Payment Allocation ➔ `${amount
│   ├── [KPI CARD] Unallocated Funds ➔ 'PKR 0'
│   ├── [KPI CARD] Remaining Balance ➔ remainingBal
│   ├── [KPI CARD] Allocation Rule ➔ 'First In First Out'
│   ├── [KPI CARD] Deposit Account ➔ p.bankAccount || 'Meezan Bank - Main Operational Account'
│   ├── [KPI CARD] Transaction Slip ➔ p.ref || p.transactionRef || `TXN-${paymentId.value.replace('PAY-'
│   ├── [KPI CARD] Bank Branch ➔ `${branchName
│   ├── [KPI CARD] Clearing Date ➔ p.date || 'Today 10:45'
│   ├── [KPI CARD] Bank Fee / Charges ➔ 'PKR 0'
│   ├── [KPI CARD] Reconciliation State ➔ is7788.value ? 'Cash Drawer Unverified' : 'Bank Matched 100%'
│   ├── [KPI CARD] Account Holder ➔ customerName
│   ├── [KPI CARD] Total Lifetime Orders ➔ '2 Completed'
│   ├── [KPI CARD] Credit Limit ➔ 'PKR 0 (Advance only)'
│   ├── [KPI CARD] Current Receivables ➔ remainingBal
│   ├── [KPI CARD] Payment Reliability ➔ 'Excellent (Prompt Pay)'
│   ├── [KPI CARD] Branch Account ➔ `${branchName
│   └── [KPI CARD] 10:45 ➔ `Payment of ${amount
├── ⚡ ACTION BUTTONS & TRIGGERS (3 buttons)
│   ├── [BUTTON] "Back to Payments"
│   ├── [BUTTON] "Back to List"
│   └── [BUTTON] "Record Payment"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/sales/customers`
- **Route Name:** `sales-customers`
- **Source Component:** [`src/views/sales/Customers.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/sales/Customers.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/sales/customers [sales-customers]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Customers"
│   ├── "Add Customer"
│   └── "Branch Customers"
├── 📑 NAVIGATION TABS & FILTER PILLS (3 tabs)
│   ├── [TAB] "Clear"
│   ├── [TAB] "Reset Filters"
│   └── [TAB] "Reset filters"
├── 📊 SNAPSHOT METRICS & KPI CARDS (7 cards)
│   ├── [KPI CARD] Customers ➔ '1
│   ├── [KPI CARD] Repeat Buyers ➔ '29%'
│   ├── [KPI CARD] Outstanding ➔ 'PKR 1.2M'
│   ├── [KPI CARD] Follow-ups ➔ '17'
│   ├── [KPI CARD] New This Month ➔ '96'
│   ├── [KPI CARD] Receivables ➔ 'PKR 2.9M'
│   └── [KPI CARD] Owned Units ➔ '1
├── 📋 DATA TABLES & GRID COLUMNS (2 tables)
│   ├── [TABLE 1] Columns:
│   │   ├── [COL] "Customer"
│   │   ├── [COL] "Name"
│   │   ├── [COL] "Phone"
│   │   ├── [COL] "Orders"
│   │   ├── [COL] "Outstanding"
│   │   ├── [COL] "Status"
│   │   └── [COL] "Actions"
│   ├── [TABLE 2] Columns:
│   │   ├── [COL] "Customer"
│   │   ├── [COL] "Phone"
│   │   ├── [COL] "Branch"
│   │   ├── [COL] "Orders"
│   │   ├── [COL] "Owned Units"
│   │   ├── [COL] "Lifetime Value"
│   │   ├── [COL] "Balance"
│   │   ├── [COL] "Last Activity"
│   │   └── [COL] "Actions"
├── 📝 FORM FIELDS & INPUT CONTROLS (2 fields)
│   ├── [FIELD] "branchSearchQuery"
│   └── [FIELD] "searchQuery"
├── ⚡ ACTION BUTTONS & TRIGGERS (5 buttons)
│   ├── [BUTTON] "Add Customer"
│   ├── [BUTTON] "Columns"
│   ├── [BUTTON] "Export"
│   ├── [BUTTON] "Open ›"
│   └── [BUTTON] "Open &rarr;"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/sales/customers/create`
- **Route Name:** `sales-create-customer`
- **Source Component:** [`src/views/sales/CreateCustomer.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/sales/CreateCustomer.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/sales/customers/create [sales-create-customer]
│
├── 🏷️ HEADERS & TITLES
│   └── "Address & Classification"
├── 📝 FORM FIELDS & INPUT CONTROLS (10 fields)
│   ├── [FIELD] "formData.firstName"
│   ├── [FIELD] "formData.lastName"
│   ├── [FIELD] "formData.phone"
│   ├── [FIELD] "formData.email"
│   ├── [FIELD] "formData.cnic"
│   ├── [FIELD] "formData.address"
│   ├── [FIELD] "formData.city"
│   ├── [FIELD] "formData.branch"
│   ├── [FIELD] "formData.status"
│   └── [FIELD] "formData.notes"
├── ⚡ ACTION BUTTONS & TRIGGERS (1 buttons)
│   └── [BUTTON] "Cancel"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/sales/customers/detail`
- **Route Name:** `sales-customer-detail-legacy`
- **Source Component:** [`src/views/sales/CustomerDetail.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/sales/CustomerDetail.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/sales/customers/detail [sales-customer-detail-legacy]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Branch Manager"
│   ├── "Super Admin"
│   ├── "Customer Code"
│   ├── "Primary Phone"
│   └── "Email Address"
├── 📑 NAVIGATION TABS & FILTER PILLS (10 tabs)
│   ├── [TAB] "Overview"
│   ├── [TAB] "Contact & Profile"
│   ├── [TAB] "Orders & Purchases"
│   ├── [TAB] "Invoices"
│   ├── [TAB] "Payments"
│   ├── [TAB] "Owned Vehicles"
│   ├── [TAB] "Warranty & Service"
│   ├── [TAB] "Leads & Inquiries"
│   ├── [TAB] "Documents & Notes"
│   └── [TAB] "Activity & Timeline"
├── 📋 DATA TABLES & GRID COLUMNS (4 tables)
│   ├── [TABLE 1] Columns:
│   │   ├── [COL] "Order Number"
│   │   ├── [COL] "Date"
│   │   ├── [COL] "Vehicle / Model"
│   │   ├── [COL] "Total Amount"
│   │   ├── [COL] "Paid Amount"
│   │   ├── [COL] "Balance"
│   │   ├── [COL] "Status"
│   │   └── [COL] "Action"
│   ├── [TABLE 2] Columns:
│   │   ├── [COL] "Invoice Number"
│   │   ├── [COL] "Issue Date"
│   │   ├── [COL] "Due Date"
│   │   ├── [COL] "Total Amount"
│   │   ├── [COL] "Paid Amount"
│   │   ├── [COL] "Outstanding"
│   │   ├── [COL] "Payment Status"
│   │   └── [COL] "Action"
│   ├── [TABLE 3] Columns:
│   │   ├── [COL] "Receipt / Payment #"
│   │   ├── [COL] "Linked Order"
│   │   ├── [COL] "Amount Cleared"
│   │   ├── [COL] "Payment Method"
│   │   ├── [COL] "Date"
│   │   ├── [COL] "Reference / Slip"
│   │   ├── [COL] "Status"
│   │   └── [COL] "Action"
│   ├── [TABLE 4] Columns:
│   │   ├── [COL] "Chassis / VIN"
│   │   ├── [COL] "Product Model"
│   │   ├── [COL] "Branch Location"
│   │   ├── [COL] "Handover Date"
│   │   ├── [COL] "Warranty Coverage"
│   │   └── [COL] "Action"
├── ⚡ ACTION BUTTONS & TRIGGERS (20 buttons)
│   ├── [BUTTON] "Back to Customers"
│   ├── [BUTTON] "Edit Customer"
│   ├── [BUTTON] "New Quote"
│   ├── [BUTTON] "Create Order"
│   ├── [BUTTON] "Edit Profile"
│   ├── [BUTTON] "+ New Order"
│   ├── [BUTTON] "+ Record Payment"
│   ├── [BUTTON] "Create New Order"
│   ├── [BUTTON] "View Order ›"
│   ├── [BUTTON] "Create First Order"
│   ├── [BUTTON] "Go to Invoices Hub"
│   ├── [BUTTON] "View Invoice ›"
│   ├── [BUTTON] "Record Payment"
│   ├── [BUTTON] "View Receipt ›"
│   ├── [BUTTON] "Record First Payment"
│   ├── [BUTTON] "View Vehicle ›"
│   ├── [BUTTON] "Warranty Certificate ›"
│   ├── [BUTTON] "+ Log Service Case"
│   ├── [BUTTON] "View Job Card ›"
│   └── [BUTTON] "View Lead ›"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/sales/customers/:id`
- **Route Name:** `sales-customer-detail`
- **Source Component:** [`src/views/sales/CustomerDetail.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/sales/CustomerDetail.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/sales/customers/:id [sales-customer-detail]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Branch Manager"
│   ├── "Super Admin"
│   ├── "Customer Code"
│   ├── "Primary Phone"
│   └── "Email Address"
├── 📑 NAVIGATION TABS & FILTER PILLS (10 tabs)
│   ├── [TAB] "Overview"
│   ├── [TAB] "Contact & Profile"
│   ├── [TAB] "Orders & Purchases"
│   ├── [TAB] "Invoices"
│   ├── [TAB] "Payments"
│   ├── [TAB] "Owned Vehicles"
│   ├── [TAB] "Warranty & Service"
│   ├── [TAB] "Leads & Inquiries"
│   ├── [TAB] "Documents & Notes"
│   └── [TAB] "Activity & Timeline"
├── 📋 DATA TABLES & GRID COLUMNS (4 tables)
│   ├── [TABLE 1] Columns:
│   │   ├── [COL] "Order Number"
│   │   ├── [COL] "Date"
│   │   ├── [COL] "Vehicle / Model"
│   │   ├── [COL] "Total Amount"
│   │   ├── [COL] "Paid Amount"
│   │   ├── [COL] "Balance"
│   │   ├── [COL] "Status"
│   │   └── [COL] "Action"
│   ├── [TABLE 2] Columns:
│   │   ├── [COL] "Invoice Number"
│   │   ├── [COL] "Issue Date"
│   │   ├── [COL] "Due Date"
│   │   ├── [COL] "Total Amount"
│   │   ├── [COL] "Paid Amount"
│   │   ├── [COL] "Outstanding"
│   │   ├── [COL] "Payment Status"
│   │   └── [COL] "Action"
│   ├── [TABLE 3] Columns:
│   │   ├── [COL] "Receipt / Payment #"
│   │   ├── [COL] "Linked Order"
│   │   ├── [COL] "Amount Cleared"
│   │   ├── [COL] "Payment Method"
│   │   ├── [COL] "Date"
│   │   ├── [COL] "Reference / Slip"
│   │   ├── [COL] "Status"
│   │   └── [COL] "Action"
│   ├── [TABLE 4] Columns:
│   │   ├── [COL] "Chassis / VIN"
│   │   ├── [COL] "Product Model"
│   │   ├── [COL] "Branch Location"
│   │   ├── [COL] "Handover Date"
│   │   ├── [COL] "Warranty Coverage"
│   │   └── [COL] "Action"
├── ⚡ ACTION BUTTONS & TRIGGERS (20 buttons)
│   ├── [BUTTON] "Back to Customers"
│   ├── [BUTTON] "Edit Customer"
│   ├── [BUTTON] "New Quote"
│   ├── [BUTTON] "Create Order"
│   ├── [BUTTON] "Edit Profile"
│   ├── [BUTTON] "+ New Order"
│   ├── [BUTTON] "+ Record Payment"
│   ├── [BUTTON] "Create New Order"
│   ├── [BUTTON] "View Order ›"
│   ├── [BUTTON] "Create First Order"
│   ├── [BUTTON] "Go to Invoices Hub"
│   ├── [BUTTON] "View Invoice ›"
│   ├── [BUTTON] "Record Payment"
│   ├── [BUTTON] "View Receipt ›"
│   ├── [BUTTON] "Record First Payment"
│   ├── [BUTTON] "View Vehicle ›"
│   ├── [BUTTON] "Warranty Certificate ›"
│   ├── [BUTTON] "+ Log Service Case"
│   ├── [BUTTON] "View Job Card ›"
│   └── [BUTTON] "View Lead ›"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/sales/leads`
- **Route Name:** `sales-leads`
- **Source Component:** [`src/views/sales/Leads.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/sales/Leads.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/sales/leads [sales-leads]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Leads & Inquiries"
│   ├── "Add Lead"
│   └── "Branch Leads"
├── 📑 NAVIGATION TABS & FILTER PILLS (10 tabs)
│   ├── [TAB] "Clear"
│   ├── [TAB] "Reset filters"
│   ├── [TAB] "Clear Filters"
│   ├── [TAB] "Reset all filters"
│   ├── [TAB] "All"
│   ├── [TAB] "New"
│   ├── [TAB] "Contacted"
│   ├── [TAB] "Qualified"
│   ├── [TAB] "Quoted"
│   └── [TAB] "Converted"
├── 📊 SNAPSHOT METRICS & KPI CARDS (4 cards)
│   ├── [KPI CARD] New ➔ '14'
│   ├── [KPI CARD] Contacted ➔ '21'
│   ├── [KPI CARD] Quoted ➔ '9'
│   └── [KPI CARD] Overdue ➔ '4'
├── 📋 DATA TABLES & GRID COLUMNS (1 tables)
│   ├── [TABLE 1] Columns:
│   │   ├── [COL] "Lead"
│   │   ├── [COL] "Name"
│   │   ├── [COL] "Source"
│   │   ├── [COL] "Interest"
│   │   ├── [COL] "Branch"
│   │   ├── [COL] "Owner"
│   │   ├── [COL] "Stage"
│   │   ├── [COL] "Next Follow-up"
│   │   └── [COL] "Action"
├── 📝 FORM FIELDS & INPUT CONTROLS (3 fields)
│   ├── [FIELD] "branchSearchQuery"
│   ├── [FIELD] "col.visible"
│   └── [FIELD] "searchQuery"
├── ⚡ ACTION BUTTONS & TRIGGERS (4 buttons)
│   ├── [BUTTON] "Add Lead"
│   ├── [BUTTON] "Columns"
│   ├── [BUTTON] "Export"
│   └── [BUTTON] "View"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/sales/leads/create`
- **Route Name:** `sales-create-lead`
- **Source Component:** [`src/views/sales/CreateLead.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/sales/CreateLead.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/sales/leads/create [sales-create-lead]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Lead Information"
│   ├── "Assignment & Scope"
│   ├── "Opportunity"
│   └── "Follow-up Timeline"
├── 📝 FORM FIELDS & INPUT CONTROLS (9 fields)
│   ├── [FIELD] "formData.name"
│   ├── [FIELD] "formData.phone"
│   ├── [FIELD] "formData.source"
│   ├── [FIELD] "formData.branch"
│   ├── [FIELD] "formData.owner"
│   ├── [FIELD] "formData.stage"
│   ├── [FIELD] "formData.product"
│   ├── [FIELD] "formData.budget"
│   └── [FIELD] "formData.nextFollowUp"
├── ⚡ ACTION BUTTONS & TRIGGERS (1 buttons)
│   └── [BUTTON] "Cancel"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/sales/leads/detail`
- **Route Name:** `sales-lead-detail-legacy`
- **Source Component:** [`src/views/sales/LeadDetail.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/sales/LeadDetail.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/sales/leads/detail [sales-lead-detail-legacy]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Related information"
│   ├── "Next Action"
│   ├── "Call today"
│   ├── "Quotation"
│   └── "Not created"
├── 📊 SNAPSHOT METRICS & KPI CARDS (25 cards)
│   ├── [KPI CARD] Customer ➔ leadCustomer.value
│   ├── [KPI CARD] Phone ➔ l.phone || '0312 553 8198'
│   ├── [KPI CARD] Desired Product ➔ l.product || l.interest || 'BRG X7'
│   ├── [KPI CARD] Budget ➔ l.budget || 'PKR 350
│   ├── [KPI CARD] Source ➔ l.source || 'Website'
│   ├── [KPI CARD] Owner ➔ l.owner || 'Hamza'
│   ├── [KPI CARD] Phone Number ➔ '0312 553 8198'
│   ├── [KPI CARD] Email Address ➔ 'sajid.khan@gmail.com'
│   ├── [KPI CARD] City ➔ 'Peshawar'
│   ├── [KPI CARD] Preferred Channel ➔ 'WhatsApp'
│   ├── [KPI CARD] Preferred Time ➔ '2 PM - 6 PM'
│   ├── [KPI CARD] Alt Phone ➔ '091 584 1122'
│   ├── [KPI CARD] Latest Message ➔ 'Inquiry received via Web Portal for BRG X7'
│   ├── [KPI CARD] Received Time ➔ 'Today 08:40'
│   ├── [KPI CARD] Communication Channel ➔ 'Web Chat / Website Form'
│   ├── [KPI CARD] Assigned Agent ➔ 'Hamza'
│   ├── [KPI CARD] Auto-reply Status ➔ 'Sent'
│   ├── [KPI CARD] Read Status ➔ 'Read by Branch Team'
│   ├── [KPI CARD] Next Scheduled Action ➔ 'Call today'
│   ├── [KPI CARD] Assigned Representative ➔ 'Hamza'
│   ├── [KPI CARD] Discussion Focus ➔ 'Vehicle specifications and financing options'
│   ├── [KPI CARD] Priority ➔ 'High Priority'
│   ├── [KPI CARD] Last Contact Attempt ➔ 'Pending first outreach'
│   ├── [KPI CARD] Target Date ➔ 'Today (Immediate)'
│   └── [KPI CARD] Quotation Status ➔ 'Not created'
├── ⚡ ACTION BUTTONS & TRIGGERS (4 buttons)
│   ├── [BUTTON] "Edit Lead"
│   ├── [BUTTON] "More"
│   ├── [BUTTON] "Create Quotation"
│   └── [BUTTON] "Convert to Customer"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/sales/leads/:id`
- **Route Name:** `sales-lead-detail`
- **Source Component:** [`src/views/sales/LeadDetail.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/sales/LeadDetail.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/sales/leads/:id [sales-lead-detail]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Related information"
│   ├── "Next Action"
│   ├── "Call today"
│   ├── "Quotation"
│   └── "Not created"
├── 📊 SNAPSHOT METRICS & KPI CARDS (25 cards)
│   ├── [KPI CARD] Customer ➔ leadCustomer.value
│   ├── [KPI CARD] Phone ➔ l.phone || '0312 553 8198'
│   ├── [KPI CARD] Desired Product ➔ l.product || l.interest || 'BRG X7'
│   ├── [KPI CARD] Budget ➔ l.budget || 'PKR 350
│   ├── [KPI CARD] Source ➔ l.source || 'Website'
│   ├── [KPI CARD] Owner ➔ l.owner || 'Hamza'
│   ├── [KPI CARD] Phone Number ➔ '0312 553 8198'
│   ├── [KPI CARD] Email Address ➔ 'sajid.khan@gmail.com'
│   ├── [KPI CARD] City ➔ 'Peshawar'
│   ├── [KPI CARD] Preferred Channel ➔ 'WhatsApp'
│   ├── [KPI CARD] Preferred Time ➔ '2 PM - 6 PM'
│   ├── [KPI CARD] Alt Phone ➔ '091 584 1122'
│   ├── [KPI CARD] Latest Message ➔ 'Inquiry received via Web Portal for BRG X7'
│   ├── [KPI CARD] Received Time ➔ 'Today 08:40'
│   ├── [KPI CARD] Communication Channel ➔ 'Web Chat / Website Form'
│   ├── [KPI CARD] Assigned Agent ➔ 'Hamza'
│   ├── [KPI CARD] Auto-reply Status ➔ 'Sent'
│   ├── [KPI CARD] Read Status ➔ 'Read by Branch Team'
│   ├── [KPI CARD] Next Scheduled Action ➔ 'Call today'
│   ├── [KPI CARD] Assigned Representative ➔ 'Hamza'
│   ├── [KPI CARD] Discussion Focus ➔ 'Vehicle specifications and financing options'
│   ├── [KPI CARD] Priority ➔ 'High Priority'
│   ├── [KPI CARD] Last Contact Attempt ➔ 'Pending first outreach'
│   ├── [KPI CARD] Target Date ➔ 'Today (Immediate)'
│   └── [KPI CARD] Quotation Status ➔ 'Not created'
├── ⚡ ACTION BUTTONS & TRIGGERS (4 buttons)
│   ├── [BUTTON] "Edit Lead"
│   ├── [BUTTON] "More"
│   ├── [BUTTON] "Create Quotation"
│   └── [BUTTON] "Convert to Customer"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/sales/follow-ups`
- **Route Name:** `sales-follow-ups`
- **Source Component:** [`src/views/sales/FollowUps.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/sales/FollowUps.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/sales/follow-ups [sales-follow-ups]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Follow-ups"
│   ├── "Follow-up"
│   ├── "Customer Follow-ups"
│   └── "Schedule Follow-up"
├── 📑 NAVIGATION TABS & FILTER PILLS (8 tabs)
│   ├── [TAB] "Clear"
│   ├── [TAB] "Reset Filters"
│   ├── [TAB] "Reset filters"
│   ├── [TAB] "All"
│   ├── [TAB] "Today"
│   ├── [TAB] "Upcoming"
│   ├── [TAB] "Overdue"
│   └── [TAB] "Completed"
├── 📊 SNAPSHOT METRICS & KPI CARDS (4 cards)
│   ├── [KPI CARD] Today ➔ String(todayCount)
│   ├── [KPI CARD] Overdue ➔ String(overdueCount)
│   ├── [KPI CARD] Upcoming ➔ String(upcomingCount)
│   └── [KPI CARD] Completed ➔ String(completedCount)
├── 📋 DATA TABLES & GRID COLUMNS (2 tables)
│   ├── [TABLE 1] Columns:
│   │   ├── [COL] "Customer"
│   │   ├── [COL] "Linked Record"
│   │   ├── [COL] "Owner"
│   │   ├── [COL] "Due"
│   │   ├── [COL] "Status"
│   │   └── [COL] "Actions"
│   ├── [TABLE 2] Columns:
│   │   ├── [COL] "Due"
│   │   ├── [COL] "Customer / Lead"
│   │   ├── [COL] "Type"
│   │   ├── [COL] "Branch"
│   │   ├── [COL] "Owner"
│   │   ├── [COL] "Priority"
│   │   ├── [COL] "Status"
│   │   └── [COL] "Actions"
├── 📝 FORM FIELDS & INPUT CONTROLS (2 fields)
│   ├── [FIELD] "branchSearchQuery"
│   └── [FIELD] "searchQuery"
├── ⚡ ACTION BUTTONS & TRIGGERS (5 buttons)
│   ├── [BUTTON] "Follow-up"
│   ├── [BUTTON] "Columns"
│   ├── [BUTTON] "Export"
│   ├── [BUTTON] "Open ›"
│   └── [BUTTON] "Schedule Follow-up"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/sales/follow-ups/create`
- **Route Name:** `sales-create-follow-up`
- **Source Component:** [`src/views/sales/CreateFollowUp.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/sales/CreateFollowUp.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/sales/follow-ups/create [sales-create-follow-up]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Follow-up Details"
│   └── "Assignment & Timeline"
├── 📝 FORM FIELDS & INPUT CONTROLS (11 fields)
│   ├── [FIELD] "form.customer"
│   ├── [FIELD] "form.linkedRecord"
│   ├── [FIELD] "form.taskType"
│   ├── [FIELD] "form.priority"
│   ├── [FIELD] "form.channel"
│   ├── [FIELD] "form.owner"
│   ├── [FIELD] "form.branch"
│   ├── [FIELD] "form.dueDate"
│   ├── [FIELD] "form.dueTime"
│   ├── [FIELD] "form.notes"
│   └── [FIELD] "reminder"
├── ⚡ ACTION BUTTONS & TRIGGERS (1 buttons)
│   └── [BUTTON] "Cancel"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/sales/follow-ups/detail`
- **Route Name:** `sales-follow-up-detail-legacy`
- **Source Component:** [`src/views/sales/FollowUpDetail.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/sales/FollowUpDetail.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/sales/follow-ups/detail [sales-follow-up-detail-legacy]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Related information"
│   ├── "Owner"
│   ├── "Hamza"
│   ├── "Due"
│   └── "Priority"
├── 📑 NAVIGATION TABS & FILTER PILLS (5 tabs)
│   ├── [TAB] "Overview"
│   ├── [TAB] "Linked Record"
│   ├── [TAB] "Customer"
│   ├── [TAB] "Notes & Actions"
│   └── [TAB] "Activity"
├── 📊 SNAPSHOT METRICS & KPI CARDS (25 cards)
│   ├── [KPI CARD] Customer ➔ customerName.value
│   ├── [KPI CARD] Linked Record ➔ linkedRecord.value
│   ├── [KPI CARD] Owner ➔ 'Hamza'
│   ├── [KPI CARD] Due ➔ dueTime.value
│   ├── [KPI CARD] Priority ➔ isSajid ? 'Normal' : 'High Priority'
│   ├── [KPI CARD] Status ➔ status.value
│   ├── [KPI CARD] Record Type ➔ isSajid ? 'Lead Inquiry (LD-551)' : 'Sale Order (ORD-2238)'
│   ├── [KPI CARD] Interested / Assigned Unit ➔ isSajid ? 'BRG X7 (Lithium 72V)' : 'BRG X7 (CH 8-BRG-26-01731)'
│   ├── [KPI CARD] Financial Value ➔ isSajid ? 'Budget: PKR 350
│   ├── [KPI CARD] Outstanding Balance ➔ isSajid ? 'PKR 0' : 'PKR 215
│   ├── [KPI CARD] Operational Status ➔ isSajid ? 'New Website Lead' : 'Awaiting Balance Payment'
│   ├── [KPI CARD] Allocated Branch ➔ `${branchName
│   ├── [KPI CARD] Customer ID ➔ isSajid ? 'Lead Profile' : 'CUS-0744'
│   ├── [KPI CARD] Phone Number ➔ isSajid ? '0312 553 8198' : '0333 118 2011'
│   ├── [KPI CARD] Total Orders ➔ isSajid ? '0 (Prospect)' : '2 Completed'
│   ├── [KPI CARD] Lifetime Sales ➔ isSajid ? 'PKR 0' : 'PKR 540
│   ├── [KPI CARD] Preferred Channel ➔ isSajid ? 'WhatsApp / Call' : 'Direct Call'
│   ├── [KPI CARD] Account Standing ➔ isSajid ? 'Warm Prospect' : 'Follow-up Required'
│   ├── [KPI CARD] Task Objective ➔ isSajid ? 'Discuss financing and battery warranty' : 'Collect remaining balance PKR 215
│   ├── [KPI CARD] Last Outreach ➔ isSajid ? 'Inquiry registered Today 08:40' : 'Yesterday 16:00 (Promised payment today)'
│   ├── [KPI CARD] Next Step ➔ isSajid ? 'Book showroom test drive' : 'Verify bank deposit with cashier'
│   ├── [KPI CARD] Assigned Staff ➔ 'Hamza'
│   ├── [KPI CARD] Escalation Tier ➔ isSajid ? 'Standard Sales Flow' : 'Branch Manager Alert'
│   ├── [KPI CARD] Target Completion ➔ 'Today by 17:00'
│   └── [KPI CARD] Today 09:00 ➔ 'Daily reminder notification pushed to Hamza'
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/sales/follow-ups/:id`
- **Route Name:** `sales-follow-up-detail`
- **Source Component:** [`src/views/sales/FollowUpDetail.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/sales/FollowUpDetail.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/sales/follow-ups/:id [sales-follow-up-detail]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Related information"
│   ├── "Owner"
│   ├── "Hamza"
│   ├── "Due"
│   └── "Priority"
├── 📑 NAVIGATION TABS & FILTER PILLS (5 tabs)
│   ├── [TAB] "Overview"
│   ├── [TAB] "Linked Record"
│   ├── [TAB] "Customer"
│   ├── [TAB] "Notes & Actions"
│   └── [TAB] "Activity"
├── 📊 SNAPSHOT METRICS & KPI CARDS (25 cards)
│   ├── [KPI CARD] Customer ➔ customerName.value
│   ├── [KPI CARD] Linked Record ➔ linkedRecord.value
│   ├── [KPI CARD] Owner ➔ 'Hamza'
│   ├── [KPI CARD] Due ➔ dueTime.value
│   ├── [KPI CARD] Priority ➔ isSajid ? 'Normal' : 'High Priority'
│   ├── [KPI CARD] Status ➔ status.value
│   ├── [KPI CARD] Record Type ➔ isSajid ? 'Lead Inquiry (LD-551)' : 'Sale Order (ORD-2238)'
│   ├── [KPI CARD] Interested / Assigned Unit ➔ isSajid ? 'BRG X7 (Lithium 72V)' : 'BRG X7 (CH 8-BRG-26-01731)'
│   ├── [KPI CARD] Financial Value ➔ isSajid ? 'Budget: PKR 350
│   ├── [KPI CARD] Outstanding Balance ➔ isSajid ? 'PKR 0' : 'PKR 215
│   ├── [KPI CARD] Operational Status ➔ isSajid ? 'New Website Lead' : 'Awaiting Balance Payment'
│   ├── [KPI CARD] Allocated Branch ➔ `${branchName
│   ├── [KPI CARD] Customer ID ➔ isSajid ? 'Lead Profile' : 'CUS-0744'
│   ├── [KPI CARD] Phone Number ➔ isSajid ? '0312 553 8198' : '0333 118 2011'
│   ├── [KPI CARD] Total Orders ➔ isSajid ? '0 (Prospect)' : '2 Completed'
│   ├── [KPI CARD] Lifetime Sales ➔ isSajid ? 'PKR 0' : 'PKR 540
│   ├── [KPI CARD] Preferred Channel ➔ isSajid ? 'WhatsApp / Call' : 'Direct Call'
│   ├── [KPI CARD] Account Standing ➔ isSajid ? 'Warm Prospect' : 'Follow-up Required'
│   ├── [KPI CARD] Task Objective ➔ isSajid ? 'Discuss financing and battery warranty' : 'Collect remaining balance PKR 215
│   ├── [KPI CARD] Last Outreach ➔ isSajid ? 'Inquiry registered Today 08:40' : 'Yesterday 16:00 (Promised payment today)'
│   ├── [KPI CARD] Next Step ➔ isSajid ? 'Book showroom test drive' : 'Verify bank deposit with cashier'
│   ├── [KPI CARD] Assigned Staff ➔ 'Hamza'
│   ├── [KPI CARD] Escalation Tier ➔ isSajid ? 'Standard Sales Flow' : 'Branch Manager Alert'
│   ├── [KPI CARD] Target Completion ➔ 'Today by 17:00'
│   └── [KPI CARD] Today 09:00 ➔ 'Daily reminder notification pushed to Hamza'
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/sales/custom-orders`
- **Route Name:** `sales-custom-orders`
- **Source Component:** [`src/views/sales/CustomOrders.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/sales/CustomOrders.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/sales/custom-orders [sales-custom-orders]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Custom Orders"
│   ├── "Custom Order"
│   ├── "Columns"
│   ├── "Export"
│   └── "Custom Orders / Reservations"
├── 📑 NAVIGATION TABS & FILTER PILLS (3 tabs)
│   ├── [TAB] "Clear"
│   ├── [TAB] "Reset Filters"
│   └── [TAB] "Reset filters"
├── 📊 SNAPSHOT METRICS & KPI CARDS (4 cards)
│   ├── [KPI CARD] Open ➔ '7'
│   ├── [KPI CARD] Deposits ➔ 'PKR 540K'
│   ├── [KPI CARD] Arriving ➔ '3'
│   └── [KPI CARD] Ready ➔ '2'
├── 📋 DATA TABLES & GRID COLUMNS (2 tables)
│   ├── [TABLE 1] Columns:
│   │   ├── [COL] "Custom Order"
│   │   ├── [COL] "Customer"
│   │   ├── [COL] "Requirement"
│   │   ├── [COL] "Deposit"
│   │   ├── [COL] "Status"
│   │   └── [COL] "Actions"
│   ├── [TABLE 2] Columns:
│   │   ├── [COL] "Order"
│   │   ├── [COL] "Customer"
│   │   ├── [COL] "Branch"
│   │   ├── [COL] "Product"
│   │   ├── [COL] "Deposit"
│   │   ├── [COL] "Total"
│   │   ├── [COL] "ETA"
│   │   ├── [COL] "Status"
│   │   └── [COL] "Actions"
├── 📝 FORM FIELDS & INPUT CONTROLS (2 fields)
│   ├── [FIELD] "branchSearchQuery"
│   └── [FIELD] "searchQuery"
├── ⚡ ACTION BUTTONS & TRIGGERS (6 buttons)
│   ├── [BUTTON] "Custom Order"
│   ├── [BUTTON] "Columns"
│   ├── [BUTTON] "Export"
│   ├── [BUTTON] "Open ›"
│   ├── [BUTTON] "Create Custom Order"
│   └── [BUTTON] "Open &rarr;"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/sales/custom-orders/create`
- **Route Name:** `sales-create-custom-order`
- **Source Component:** [`src/views/sales/CreateCustomOrder.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/sales/CreateCustomOrder.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/sales/custom-orders/create [sales-create-custom-order]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Requirement & Customer"
│   └── "Commercial & Reservation"
├── 📝 FORM FIELDS & INPUT CONTROLS (10 fields)
│   ├── [FIELD] "form.customer"
│   ├── [FIELD] "form.product"
│   ├── [FIELD] "form.budget"
│   ├── [FIELD] "form.desiredDate"
│   ├── [FIELD] "form.deposit"
│   ├── [FIELD] "form.paymentMethod"
│   ├── [FIELD] "form.transactionId"
│   ├── [FIELD] "form.status"
│   ├── [FIELD] "form.reservation"
│   └── [FIELD] "form.notes"
├── ⚡ ACTION BUTTONS & TRIGGERS (1 buttons)
│   └── [BUTTON] "Cancel"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/sales/custom-orders/detail`
- **Route Name:** `sales-custom-order-detail-legacy`
- **Source Component:** [`src/views/sales/CustomOrderDetail.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/sales/CustomOrderDetail.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/sales/custom-orders/detail [sales-custom-order-detail-legacy]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Requirement"
│   ├── "Status"
│   ├── "Customer"
│   ├── "Budget"
│   └── "Deposit"
├── 📑 NAVIGATION TABS & FILTER PILLS (10 tabs)
│   ├── [TAB] "Requirement"
│   ├── [TAB] "Customer"
│   ├── [TAB] "Deposit"
│   ├── [TAB] "Product or Product Request"
│   ├── [TAB] "Stock Request"
│   ├── [TAB] "Arrival"
│   ├── [TAB] "Reservation"
│   ├── [TAB] "Sale"
│   ├── [TAB] "Communication"
│   └── [TAB] "Activity"
├── ⚡ ACTION BUTTONS & TRIGGERS (2 buttons)
│   ├── [BUTTON] "Update Custom Order"
│   └── [BUTTON] "More"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/sales/custom-orders/:id`
- **Route Name:** `sales-custom-order-detail`
- **Source Component:** [`src/views/sales/CustomOrderDetail.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/sales/CustomOrderDetail.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/sales/custom-orders/:id [sales-custom-order-detail]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Requirement"
│   ├── "Status"
│   ├── "Customer"
│   ├── "Budget"
│   └── "Deposit"
├── 📑 NAVIGATION TABS & FILTER PILLS (10 tabs)
│   ├── [TAB] "Requirement"
│   ├── [TAB] "Customer"
│   ├── [TAB] "Deposit"
│   ├── [TAB] "Product or Product Request"
│   ├── [TAB] "Stock Request"
│   ├── [TAB] "Arrival"
│   ├── [TAB] "Reservation"
│   ├── [TAB] "Sale"
│   ├── [TAB] "Communication"
│   └── [TAB] "Activity"
├── ⚡ ACTION BUTTONS & TRIGGERS (2 buttons)
│   ├── [BUTTON] "Update Custom Order"
│   └── [BUTTON] "More"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/sales/delivery`
- **Route Name:** `sales-delivery`
- **Source Component:** [`src/views/sales/DeliveryHandover.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/sales/DeliveryHandover.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/sales/delivery [sales-delivery]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Delivery / Handover"
│   ├── "Schedule Handover"
│   ├── "Handover · SO-7731"
│   ├── "Ready"
│   └── "Customer Verification"
├── 📑 NAVIGATION TABS & FILTER PILLS (1 tabs)
│   └── [TAB] "Clear"
├── 📊 SNAPSHOT METRICS & KPI CARDS (4 cards)
│   ├── [KPI CARD] Ready Today ➔ String(readyToday || 6)
│   ├── [KPI CARD] Completed ➔ String(completed || 18)
│   ├── [KPI CARD] Documents Pending ➔ String(docsPending || 2)
│   └── [KPI CARD] Accessories Check ➔ String(accCheck || 1)
├── 📋 DATA TABLES & GRID COLUMNS (1 tables)
│   ├── [TABLE 1] Columns:
│   │   ├── [COL] "Order"
│   │   ├── [COL] "Customer"
│   │   ├── [COL] "Unit"
│   │   ├── [COL] "Scheduled"
│   │   ├── [COL] "Status"
│   │   └── [COL] "Actions"
├── 📝 FORM FIELDS & INPUT CONTROLS (4 fields)
│   ├── [FIELD] "branchSearchQuery"
│   ├── [FIELD] "formData.recipientName"
│   ├── [FIELD] "formData.handoverDate"
│   └── [FIELD] "formData.notes"
├── ⚡ ACTION BUTTONS & TRIGGERS (6 buttons)
│   ├── [BUTTON] "Schedule Handover"
│   ├── [BUTTON] "Columns"
│   ├── [BUTTON] "Export"
│   ├── [BUTTON] "Open &rsaquo;"
│   ├── [BUTTON] "Cancel"
│   └── [BUTTON] "Complete Handover & Mark Sold"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/sales/delivery/create`
- **Route Name:** `sales-create-delivery`
- **Source Component:** [`src/views/sales/CreateDeliveryHandover.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/sales/CreateDeliveryHandover.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/sales/delivery/create [sales-create-delivery]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Handover & Order Details"
│   ├── "Pre-delivery Verification Checklist"
│   ├── "Customer CNIC / Identity verified"
│   ├── "Payment completed and invoice issued"
│   └── "Chassis & Serial numbers verified"
├── 📝 FORM FIELDS & INPUT CONTROLS (11 fields)
│   ├── [FIELD] "form.order"
│   ├── [FIELD] "form.customer"
│   ├── [FIELD] "form.unit"
│   ├── [FIELD] "form.scheduled"
│   ├── [FIELD] "form.status"
│   ├── [FIELD] "form.identityVerified"
│   ├── [FIELD] "form.paymentComplete"
│   ├── [FIELD] "form.chassisVerified"
│   ├── [FIELD] "form.accessoriesIncluded"
│   ├── [FIELD] "form.warrantyBriefed"
│   └── [FIELD] "form.notes"
├── ⚡ ACTION BUTTONS & TRIGGERS (1 buttons)
│   └── [BUTTON] "Cancel"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/sales/delivery/detail`
- **Route Name:** `sales-delivery-detail-legacy`
- **Source Component:** [`src/views/sales/DeliveryHandoverDetail.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/sales/DeliveryHandoverDetail.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/sales/delivery/detail [sales-delivery-detail-legacy]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Delivery Handover Record Not Found"
│   ├── "Related information"
│   ├── "Handover Officer"
│   ├── "Scheduled"
│   └── "PDI Status"
├── 📊 SNAPSHOT METRICS & KPI CARDS (25 cards)
│   ├── [KPI CARD] Delivery ID ➔ deliveryRecord.value?.delivery_id || rawId.value
│   ├── [KPI CARD] Order Reference ➔ orderId.value
│   ├── [KPI CARD] Customer ➔ customerName.value
│   ├── [KPI CARD] Assigned Unit ➔ unitCode.value
│   ├── [KPI CARD] Scheduled Time ➔ scheduledTime.value
│   ├── [KPI CARD] Handover Officer ➔ deliveryRecord.value?.officer || 'Hamza'
│   ├── [KPI CARD] Status ➔ status.value
│   ├── [KPI CARD] Identity Verification ➔ deliveryRecord.value?.identityVerified ? 'Verified (Original CNIC Seen)' : 'Pending Verification'
│   ├── [KPI CARD] Financial Settlement ➔ deliveryRecord.value?.paymentComplete ? '100% Cleared via Bank Transfer' : 'Awaiting Clearing'
│   ├── [KPI CARD] PDI (Pre-Delivery Inspection) ➔ deliveryRecord.value?.pdiStatus || 'Passed 100%'
│   ├── [KPI CARD] Battery Charge Level ➔ '100% Full Charge'
│   ├── [KPI CARD] Key & Remote Set ➔ '2 Smart Keys + 2 Physical Keys'
│   ├── [KPI CARD] Charger & Toolkit ➔ deliveryRecord.value?.accessoriesIncluded ? 'Included & Packaged' : 'Missing items'
│   ├── [KPI CARD] Vehicle Model ➔ orderRecord.value?.product || 'BRG E-125 (2025)'
│   ├── [KPI CARD] Chassis Number ➔ unitCode.value
│   ├── [KPI CARD] Motor Serial ➔ 'MOT-72V-3500W-9912'
│   ├── [KPI CARD] Battery Serial ➔ 'BAT-7230-04421'
│   ├── [KPI CARD] Odometer Reading ➔ '2.4 KM (Testing)'
│   ├── [KPI CARD] Location ➔ `${branchName
│   ├── [KPI CARD] Customer Code ➔ deliveryRecord.value?.customer_id || 'CUST-101'
│   ├── [KPI CARD] Phone ➔ '+92 312 5538198'
│   ├── [KPI CARD] Total Sale Price ➔ orderRecord.value?.total || 'PKR 280
│   ├── [KPI CARD] Paid Amount ➔ orderRecord.value?.paid || 'PKR 280
│   ├── [KPI CARD] Outstanding Balance ➔ orderRecord.value?.balance || 'PKR 0'
│   └── [KPI CARD] Invoice Reference ➔ deliveryRecord.value?.invoice_id || `INV-${orderId.value.replace('ORD-'
├── ⚡ ACTION BUTTONS & TRIGGERS (3 buttons)
│   ├── [BUTTON] "Back to Delivery List"
│   ├── [BUTTON] "Back to List"
│   └── [BUTTON] "Complete Handover & Activate Warranty"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/sales/delivery/:id`
- **Route Name:** `sales-delivery-detail`
- **Source Component:** [`src/views/sales/DeliveryHandoverDetail.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/sales/DeliveryHandoverDetail.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/sales/delivery/:id [sales-delivery-detail]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Delivery Handover Record Not Found"
│   ├── "Related information"
│   ├── "Handover Officer"
│   ├── "Scheduled"
│   └── "PDI Status"
├── 📊 SNAPSHOT METRICS & KPI CARDS (25 cards)
│   ├── [KPI CARD] Delivery ID ➔ deliveryRecord.value?.delivery_id || rawId.value
│   ├── [KPI CARD] Order Reference ➔ orderId.value
│   ├── [KPI CARD] Customer ➔ customerName.value
│   ├── [KPI CARD] Assigned Unit ➔ unitCode.value
│   ├── [KPI CARD] Scheduled Time ➔ scheduledTime.value
│   ├── [KPI CARD] Handover Officer ➔ deliveryRecord.value?.officer || 'Hamza'
│   ├── [KPI CARD] Status ➔ status.value
│   ├── [KPI CARD] Identity Verification ➔ deliveryRecord.value?.identityVerified ? 'Verified (Original CNIC Seen)' : 'Pending Verification'
│   ├── [KPI CARD] Financial Settlement ➔ deliveryRecord.value?.paymentComplete ? '100% Cleared via Bank Transfer' : 'Awaiting Clearing'
│   ├── [KPI CARD] PDI (Pre-Delivery Inspection) ➔ deliveryRecord.value?.pdiStatus || 'Passed 100%'
│   ├── [KPI CARD] Battery Charge Level ➔ '100% Full Charge'
│   ├── [KPI CARD] Key & Remote Set ➔ '2 Smart Keys + 2 Physical Keys'
│   ├── [KPI CARD] Charger & Toolkit ➔ deliveryRecord.value?.accessoriesIncluded ? 'Included & Packaged' : 'Missing items'
│   ├── [KPI CARD] Vehicle Model ➔ orderRecord.value?.product || 'BRG E-125 (2025)'
│   ├── [KPI CARD] Chassis Number ➔ unitCode.value
│   ├── [KPI CARD] Motor Serial ➔ 'MOT-72V-3500W-9912'
│   ├── [KPI CARD] Battery Serial ➔ 'BAT-7230-04421'
│   ├── [KPI CARD] Odometer Reading ➔ '2.4 KM (Testing)'
│   ├── [KPI CARD] Location ➔ `${branchName
│   ├── [KPI CARD] Customer Code ➔ deliveryRecord.value?.customer_id || 'CUST-101'
│   ├── [KPI CARD] Phone ➔ '+92 312 5538198'
│   ├── [KPI CARD] Total Sale Price ➔ orderRecord.value?.total || 'PKR 280
│   ├── [KPI CARD] Paid Amount ➔ orderRecord.value?.paid || 'PKR 280
│   ├── [KPI CARD] Outstanding Balance ➔ orderRecord.value?.balance || 'PKR 0'
│   └── [KPI CARD] Invoice Reference ➔ deliveryRecord.value?.invoice_id || `INV-${orderId.value.replace('ORD-'
├── ⚡ ACTION BUTTONS & TRIGGERS (3 buttons)
│   ├── [BUTTON] "Back to Delivery List"
│   ├── [BUTTON] "Back to List"
│   └── [BUTTON] "Complete Handover & Activate Warranty"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/sales/returns`
- **Route Name:** `sales-returns`
- **Source Component:** [`src/views/sales/Returns.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/sales/Returns.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/sales/returns [sales-returns]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Returns"
│   ├── "Create Return"
│   ├── "Columns"
│   ├── "Export"
│   └── "Branch Returns"
├── 📑 NAVIGATION TABS & FILTER PILLS (4 tabs)
│   ├── [TAB] "Clear"
│   ├── [TAB] "Clear all filters"
│   ├── [TAB] "Reset Filters"
│   └── [TAB] "Reset filters"
├── 📊 SNAPSHOT METRICS & KPI CARDS (4 cards)
│   ├── [KPI CARD] In Inspection ➔ '1'
│   ├── [KPI CARD] Pending Approval ➔ '1'
│   ├── [KPI CARD] Exchanges ➔ '1'
│   └── [KPI CARD] Refunds ➔ '0'
├── 📋 DATA TABLES & GRID COLUMNS (2 tables)
│   ├── [TABLE 1] Columns:
│   │   ├── [COL] "Return"
│   │   ├── [COL] "Order"
│   │   ├── [COL] "Customer"
│   │   ├── [COL] "Unit"
│   │   ├── [COL] "Reason"
│   │   ├── [COL] "Requested"
│   │   ├── [COL] "Status"
│   │   └── [COL] "Actions"
│   ├── [TABLE 2] Columns:
│   │   ├── [COL] "Return"
│   │   ├── [COL] "Order"
│   │   ├── [COL] "Customer"
│   │   ├── [COL] "Unit"
│   │   ├── [COL] "Branch"
│   │   ├── [COL] "Reason"
│   │   ├── [COL] "Requested"
│   │   ├── [COL] "Status"
│   │   └── [COL] "Actions"
├── 📝 FORM FIELDS & INPUT CONTROLS (2 fields)
│   ├── [FIELD] "branchSearchQuery"
│   └── [FIELD] "searchQuery"
├── ⚡ ACTION BUTTONS & TRIGGERS (5 buttons)
│   ├── [BUTTON] "Create Return"
│   ├── [BUTTON] "Columns"
│   ├── [BUTTON] "Export"
│   ├── [BUTTON] "Open ›"
│   └── [BUTTON] "Open &rarr;"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/sales/returns/create`
- **Route Name:** `sales-create-return`
- **Source Component:** [`src/views/sales/CreateReturn.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/sales/CreateReturn.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/sales/returns/create [sales-create-return]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Original Order & Customer"
│   ├── "Unit & Destination"
│   └── "Return Reason & Inspection"
├── 📝 FORM FIELDS & INPUT CONTROLS (8 fields)
│   ├── [FIELD] "formData.orderNo"
│   ├── [FIELD] "formData.customer"
│   ├── [FIELD] "formData.unit"
│   ├── [FIELD] "formData.branch"
│   ├── [FIELD] "formData.requested"
│   ├── [FIELD] "formData.reason"
│   ├── [FIELD] "formData.status"
│   └── [FIELD] "formData.notes"
├── ⚡ ACTION BUTTONS & TRIGGERS (1 buttons)
│   └── [BUTTON] "Cancel"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/sales/returns/detail`
- **Route Name:** `sales-return-detail-legacy`
- **Source Component:** [`src/views/sales/ReturnDetail.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/sales/ReturnDetail.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/sales/returns/detail [sales-return-detail-legacy]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Related information"
│   ├── "Inspector"
│   ├── "Usman"
│   ├── "Approval"
│   └── "Pending"
├── 📑 NAVIGATION TABS & FILTER PILLS (9 tabs)
│   ├── [TAB] "Request"
│   ├── [TAB] "Original Sale"
│   ├── [TAB] "Unit"
│   ├── [TAB] "Inspection"
│   ├── [TAB] "Decision"
│   ├── [TAB] "Refund or Exchange"
│   ├── [TAB] "Stock Disposition"
│   ├── [TAB] "Documents"
│   └── [TAB] "Activity"
├── 📊 SNAPSHOT METRICS & KPI CARDS (25 cards)
│   ├── [KPI CARD] Status ➔ item.status || 'Inspection'
│   ├── [KPI CARD] Original Order ➔ item.order || item.orderNo || 'ORD-2188'
│   ├── [KPI CARD] Customer ➔ item.customer || 'Noman Ali'
│   ├── [KPI CARD] Unit ➔ item.unit || 'CH 8-BRG-26-01731'
│   ├── [KPI CARD] Reason ➔ item.reason || 'Battery Issue'
│   ├── [KPI CARD] Requested ➔ item.requested || 'Exchange'
│   ├── [KPI CARD] Sale Amount ➔ 'PKR 245
│   ├── [KPI CARD] Sale Date ➔ '14 Aug 2026'
│   ├── [KPI CARD] Salesperson ➔ 'Hamza Ali'
│   ├── [KPI CARD] Payment Method ➔ 'Bank Direct Deposit'
│   ├── [KPI CARD] Branch of Origin ➔ `${branchName
│   ├── [KPI CARD] Inspected By ➔ 'Usman (QC Lead)'
│   ├── [KPI CARD] Battery Capacity ➔ 'Degraded to 58% (Cell variance)'
│   ├── [KPI CARD] Motor Test ➔ 'Passed 100%'
│   ├── [KPI CARD] Cosmetic State ➔ 'Excellent (No physical impacts)'
│   ├── [KPI CARD] Warranty Validation ➔ 'Active Coverage (Day 18 of 365)'
│   ├── [KPI CARD] Inspection Report ➔ `QC_Inspection_${item.returnNo || 'RET104'
│   ├── [KPI CARD] Approval Status ➔ item.status === 'Completed' ? 'Approved & Signed Off' : 'Pending Management Sign-off'
│   ├── [KPI CARD] Approving Authority ➔ 'Central HQ Warranty Lead'
│   ├── [KPI CARD] Branch Recommendation ➔ 'Approve Immediate Exchange'
│   ├── [KPI CARD] Customer Goodwill ➔ 'High Priority VIP'
│   ├── [KPI CARD] SLA Target ➔ '24 Hours'
│   ├── [KPI CARD] Ledger Authorization ➔ item.status === 'Completed' ? 'Authorized' : 'Pending Approval'
│   ├── [KPI CARD] Resolution Path ➔ item.requested === 'Refund' ? 'Direct Refund' : 'Direct Unit Exchange'
│   └── [KPI CARD] Replacement Model ➔ 'BRG M3 (Identical Spec)'
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/sales/returns/:id`
- **Route Name:** `sales-return-detail`
- **Source Component:** [`src/views/sales/ReturnDetail.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/sales/ReturnDetail.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/sales/returns/:id [sales-return-detail]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Related information"
│   ├── "Inspector"
│   ├── "Usman"
│   ├── "Approval"
│   └── "Pending"
├── 📑 NAVIGATION TABS & FILTER PILLS (9 tabs)
│   ├── [TAB] "Request"
│   ├── [TAB] "Original Sale"
│   ├── [TAB] "Unit"
│   ├── [TAB] "Inspection"
│   ├── [TAB] "Decision"
│   ├── [TAB] "Refund or Exchange"
│   ├── [TAB] "Stock Disposition"
│   ├── [TAB] "Documents"
│   └── [TAB] "Activity"
├── 📊 SNAPSHOT METRICS & KPI CARDS (25 cards)
│   ├── [KPI CARD] Status ➔ item.status || 'Inspection'
│   ├── [KPI CARD] Original Order ➔ item.order || item.orderNo || 'ORD-2188'
│   ├── [KPI CARD] Customer ➔ item.customer || 'Noman Ali'
│   ├── [KPI CARD] Unit ➔ item.unit || 'CH 8-BRG-26-01731'
│   ├── [KPI CARD] Reason ➔ item.reason || 'Battery Issue'
│   ├── [KPI CARD] Requested ➔ item.requested || 'Exchange'
│   ├── [KPI CARD] Sale Amount ➔ 'PKR 245
│   ├── [KPI CARD] Sale Date ➔ '14 Aug 2026'
│   ├── [KPI CARD] Salesperson ➔ 'Hamza Ali'
│   ├── [KPI CARD] Payment Method ➔ 'Bank Direct Deposit'
│   ├── [KPI CARD] Branch of Origin ➔ `${branchName
│   ├── [KPI CARD] Inspected By ➔ 'Usman (QC Lead)'
│   ├── [KPI CARD] Battery Capacity ➔ 'Degraded to 58% (Cell variance)'
│   ├── [KPI CARD] Motor Test ➔ 'Passed 100%'
│   ├── [KPI CARD] Cosmetic State ➔ 'Excellent (No physical impacts)'
│   ├── [KPI CARD] Warranty Validation ➔ 'Active Coverage (Day 18 of 365)'
│   ├── [KPI CARD] Inspection Report ➔ `QC_Inspection_${item.returnNo || 'RET104'
│   ├── [KPI CARD] Approval Status ➔ item.status === 'Completed' ? 'Approved & Signed Off' : 'Pending Management Sign-off'
│   ├── [KPI CARD] Approving Authority ➔ 'Central HQ Warranty Lead'
│   ├── [KPI CARD] Branch Recommendation ➔ 'Approve Immediate Exchange'
│   ├── [KPI CARD] Customer Goodwill ➔ 'High Priority VIP'
│   ├── [KPI CARD] SLA Target ➔ '24 Hours'
│   ├── [KPI CARD] Ledger Authorization ➔ item.status === 'Completed' ? 'Authorized' : 'Pending Approval'
│   ├── [KPI CARD] Resolution Path ➔ item.requested === 'Refund' ? 'Direct Refund' : 'Direct Unit Exchange'
│   └── [KPI CARD] Replacement Model ➔ 'BRG M3 (Identical Spec)'
└── (No secondary dialogs)
```

### 📁 MODULE: `AFTER-SALES` (12 Total Routes)

#### 📍 ROUTE: `/after-sales/dashboard`
- **Route Name:** `after-sales-dashboard`
- **Source Component:** [`src/views/after-sales/AfterSalesDashboard.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/after-sales/AfterSalesDashboard.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/after-sales/dashboard [after-sales-dashboard]
│
├── 🏷️ HEADERS & TITLES
│   ├── "After-sales Dashboard"
│   ├── "Service Workload"
│   ├── "Branch Workload"
│   ├── "Response Time"
│   └── "Priority Cases"
├── 📊 SNAPSHOT METRICS & KPI CARDS (15 cards)
│   ├── [KPI CARD] Open Cases ➔ '14'
│   ├── [KPI CARD] Repairs In Progress ➔ '9'
│   ├── [KPI CARD] Awaiting Parts ➔ '5'
│   ├── [KPI CARD] Ready ➔ '6'
│   ├── [KPI CARD] Open Warranty ➔ store.cases.filter(c => c.type === 'Warranty').length.toString() || '18'
│   ├── [KPI CARD] Open Repairs ➔ store.repairs.length.toString() || '23'
│   ├── [KPI CARD] Overdue Service ➔ '6'
│   ├── [KPI CARD] Ready for Customer ➔ store.cases.filter(c => c.status === 'Ready').length.toString() || '11'
│   ├── [KPI CARD] Peshawar ➔ 18
│   ├── [KPI CARD] Islamabad ➔ 14
│   ├── [KPI CARD] Lahore ➔ 10
│   ├── [KPI CARD] Rawalpindi ➔ 7
│   ├── [KPI CARD] Same day ➔ 72
│   ├── [KPI CARD] 1-2 days ➔ 21
│   └── [KPI CARD] 3+ days ➔ 7
├── 📋 DATA TABLES & GRID COLUMNS (2 tables)
│   ├── [TABLE 1] Columns:
│   │   ├── [COL] "Case / Job"
│   │   ├── [COL] "Customer"
│   │   ├── [COL] "Unit"
│   │   ├── [COL] "Issue"
│   │   └── [COL] "Status"
│   ├── [TABLE 2] Columns:
│   │   ├── [COL] "Case"
│   │   ├── [COL] "Branch"
│   │   ├── [COL] "Customer"
│   │   ├── [COL] "Unit"
│   │   ├── [COL] "Type"
│   │   ├── [COL] "Age"
│   │   ├── [COL] "Status"
│   │   └── [COL] "Action"
├── ⚡ ACTION BUTTONS & TRIGGERS (1 buttons)
│   └── [BUTTON] "Open ›"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/after-sales/warranty`
- **Route Name:** `after-sales-warranty`
- **Source Component:** [`src/views/after-sales/WarrantyService.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/after-sales/WarrantyService.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/after-sales/warranty [after-sales-warranty]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Warranty & Service Cases"
│   ├── "Create Case"
│   ├── "Date"
│   ├── "Columns"
│   └── "Export"
├── 📑 NAVIGATION TABS & FILTER PILLS (3 tabs)
│   ├── [TAB] "Clear"
│   ├── [TAB] "Clear Filters"
│   └── [TAB] "Reset filters"
├── 📊 SNAPSHOT METRICS & KPI CARDS (4 cards)
│   ├── [KPI CARD] Open ➔ String(openCount || 14)
│   ├── [KPI CARD] Warranty ➔ String(warrantyCount || 8)
│   ├── [KPI CARD] Out of Warranty ➔ String(outOfWarrantyCount || 6)
│   └── [KPI CARD] Overdue ➔ '3'
├── 📋 DATA TABLES & GRID COLUMNS (2 tables)
│   ├── [TABLE 1] Columns:
│   │   ├── [COL] "Case"
│   │   ├── [COL] "Customer"
│   │   ├── [COL] "Unit"
│   │   ├── [COL] "Issue"
│   │   ├── [COL] "Priority"
│   │   ├── [COL] "Status"
│   │   └── [COL] "Actions"
│   ├── [TABLE 2] Columns:
│   │   ├── [COL] "Case"
│   │   ├── [COL] "Branch"
│   │   ├── [COL] "Customer"
│   │   ├── [COL] "Unit"
│   │   ├── [COL] "Type"
│   │   ├── [COL] "Opened"
│   │   ├── [COL] "Warranty"
│   │   ├── [COL] "Status"
│   │   └── [COL] "Actions"
├── 📝 FORM FIELDS & INPUT CONTROLS (3 fields)
│   ├── [FIELD] "branchSearchQuery"
│   ├── [FIELD] "searchQuery"
│   └── [FIELD] "selectedBranch"
├── ⚡ ACTION BUTTONS & TRIGGERS (5 buttons)
│   ├── [BUTTON] "Create Case"
│   ├── [BUTTON] "Date"
│   ├── [BUTTON] "Columns"
│   ├── [BUTTON] "Export"
│   └── [BUTTON] "Open ›"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/after-sales/warranty/create`
- **Route Name:** `after-sales-create-case`
- **Source Component:** [`src/views/after-sales/CreateCase.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/after-sales/CreateCase.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/after-sales/warranty/create [after-sales-create-case]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Estimated Cost"
│   ├── "Warranty Covered"
│   └── "Customer Payable"
├── 📝 FORM FIELDS & INPUT CONTROLS (13 fields)
│   ├── [FIELD] "customerSearch"
│   ├── [FIELD] "form.customerPhone"
│   ├── [FIELD] "form.customerEmail"
│   ├── [FIELD] "unitSearch"
│   ├── [FIELD] "form.odometer"
│   ├── [FIELD] "form.purchaseDate"
│   ├── [FIELD] "form.category"
│   ├── [FIELD] "form.complaint"
│   ├── [FIELD] "form.urgency"
│   ├── [FIELD] "form.branch"
│   ├── [FIELD] "form.assignedTech"
│   ├── [FIELD] "form.estimatedCompletion"
│   └── [FIELD] "form.notes"
├── ⚡ ACTION BUTTONS & TRIGGERS (1 buttons)
│   └── [BUTTON] "Cancel"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/after-sales/create-case`
- **Route Name:** `after-sales-create-case-alias`
- **Source Component:** [`src/views/after-sales/CreateCase.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/after-sales/CreateCase.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/after-sales/create-case [after-sales-create-case-alias]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Estimated Cost"
│   ├── "Warranty Covered"
│   └── "Customer Payable"
├── 📝 FORM FIELDS & INPUT CONTROLS (13 fields)
│   ├── [FIELD] "customerSearch"
│   ├── [FIELD] "form.customerPhone"
│   ├── [FIELD] "form.customerEmail"
│   ├── [FIELD] "unitSearch"
│   ├── [FIELD] "form.odometer"
│   ├── [FIELD] "form.purchaseDate"
│   ├── [FIELD] "form.category"
│   ├── [FIELD] "form.complaint"
│   ├── [FIELD] "form.urgency"
│   ├── [FIELD] "form.branch"
│   ├── [FIELD] "form.assignedTech"
│   ├── [FIELD] "form.estimatedCompletion"
│   └── [FIELD] "form.notes"
├── ⚡ ACTION BUTTONS & TRIGGERS (1 buttons)
│   └── [BUTTON] "Cancel"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/after-sales/warranty/detail`
- **Route Name:** `after-sales-case-detail-legacy`
- **Source Component:** [`src/views/after-sales/CaseDetail.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/after-sales/CaseDetail.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/after-sales/warranty/detail [after-sales-case-detail-legacy]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Service Case Not Found"
│   ├── "+ Create Repair Job"
│   ├── "Summary"
│   ├── "Status"
│   └── "Customer"
├── 📑 NAVIGATION TABS & FILTER PILLS (10 tabs)
│   ├── [TAB] "Summary"
│   ├── [TAB] "Customer"
│   ├── [TAB] "Unit"
│   ├── [TAB] "Warranty"
│   ├── [TAB] "Diagnosis"
│   ├── [TAB] "Resolution"
│   ├── [TAB] "Cost"
│   ├── [TAB] "Communication"
│   ├── [TAB] "Documents"
│   └── [TAB] "Timeline"
├── ⚡ ACTION BUTTONS & TRIGGERS (1 buttons)
│   └── [BUTTON] "+ Create Repair Job"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/after-sales/warranty/:id`
- **Route Name:** `after-sales-case-detail`
- **Source Component:** [`src/views/after-sales/CaseDetail.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/after-sales/CaseDetail.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/after-sales/warranty/:id [after-sales-case-detail]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Service Case Not Found"
│   ├── "+ Create Repair Job"
│   ├── "Summary"
│   ├── "Status"
│   └── "Customer"
├── 📑 NAVIGATION TABS & FILTER PILLS (10 tabs)
│   ├── [TAB] "Summary"
│   ├── [TAB] "Customer"
│   ├── [TAB] "Unit"
│   ├── [TAB] "Warranty"
│   ├── [TAB] "Diagnosis"
│   ├── [TAB] "Resolution"
│   ├── [TAB] "Cost"
│   ├── [TAB] "Communication"
│   ├── [TAB] "Documents"
│   └── [TAB] "Timeline"
├── ⚡ ACTION BUTTONS & TRIGGERS (1 buttons)
│   └── [BUTTON] "+ Create Repair Job"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/after-sales/cases/:id`
- **Route Name:** `after-sales-case-detail-canonical`
- **Source Component:** [`src/views/after-sales/CaseDetail.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/after-sales/CaseDetail.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/after-sales/cases/:id [after-sales-case-detail-canonical]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Service Case Not Found"
│   ├── "+ Create Repair Job"
│   ├── "Summary"
│   ├── "Status"
│   └── "Customer"
├── 📑 NAVIGATION TABS & FILTER PILLS (10 tabs)
│   ├── [TAB] "Summary"
│   ├── [TAB] "Customer"
│   ├── [TAB] "Unit"
│   ├── [TAB] "Warranty"
│   ├── [TAB] "Diagnosis"
│   ├── [TAB] "Resolution"
│   ├── [TAB] "Cost"
│   ├── [TAB] "Communication"
│   ├── [TAB] "Documents"
│   └── [TAB] "Timeline"
├── ⚡ ACTION BUTTONS & TRIGGERS (1 buttons)
│   └── [BUTTON] "+ Create Repair Job"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/after-sales/repairs`
- **Route Name:** `after-sales-repairs`
- **Source Component:** [`src/views/after-sales/RepairJobs.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/after-sales/RepairJobs.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/after-sales/repairs [after-sales-repairs]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Repair Jobs"
│   └── "Create Repair Job"
├── 📑 NAVIGATION TABS & FILTER PILLS (3 tabs)
│   ├── [TAB] "Clear"
│   ├── [TAB] "Reset filters"
│   └── [TAB] "Clear Filters"
├── 📊 SNAPSHOT METRICS & KPI CARDS (4 cards)
│   ├── [KPI CARD] Open Jobs ➔ String(openCount || 9)
│   ├── [KPI CARD] Awaiting Parts ➔ String(partsCount || 5)
│   ├── [KPI CARD] Approval Needed ➔ String(approvalCount || 2)
│   └── [KPI CARD] Ready ➔ String(readyCount || 6)
├── 📋 DATA TABLES & GRID COLUMNS (2 tables)
│   ├── [TABLE 1] Columns:
│   │   └── [COL] "Actions"
│   ├── [TABLE 2] Columns:
│   │   ├── [COL] "Repair ID"
│   │   ├── [COL] "Branch"
│   │   ├── [COL] "Customer"
│   │   ├── [COL] "Unit Serial"
│   │   ├── [COL] "Diagnosis"
│   │   ├── [COL] "Status"
│   │   └── [COL] "Actions"
├── 📝 FORM FIELDS & INPUT CONTROLS (3 fields)
│   ├── [FIELD] "branchSearchQuery"
│   ├── [FIELD] "col.visible"
│   └── [FIELD] "searchQuery"
├── ⚡ ACTION BUTTONS & TRIGGERS (4 buttons)
│   ├── [BUTTON] "Create Repair Job"
│   ├── [BUTTON] "Columns"
│   ├── [BUTTON] "Export"
│   └── [BUTTON] "Open ›"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/after-sales/repairs/create`
- **Route Name:** `after-sales-create-repair`
- **Source Component:** [`src/views/after-sales/CreateRepairJob.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/after-sales/CreateRepairJob.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/after-sales/repairs/create [after-sales-create-repair]
│
├── 📝 FORM FIELDS & INPUT CONTROLS (16 fields)
│   ├── [FIELD] "caseSearch"
│   ├── [FIELD] "form.customer"
│   ├── [FIELD] "form.unit"
│   ├── [FIELD] "form.branch"
│   ├── [FIELD] "form.unitModel"
│   ├── [FIELD] "form.diagnosis"
│   ├── [FIELD] "form.fault"
│   ├── [FIELD] "form.decision"
│   ├── [FIELD] "form.technician"
│   ├── [FIELD] "form.partItem"
│   ├── [FIELD] "form.partQty"
│   ├── [FIELD] "form.partCost"
│   ├── [FIELD] "form.partSource"
│   ├── [FIELD] "form.readyDate"
│   ├── [FIELD] "form.status"
│   └── [FIELD] "newTaskName"
├── ⚡ ACTION BUTTONS & TRIGGERS (2 buttons)
│   ├── [BUTTON] "+ Add"
│   └── [BUTTON] "Cancel"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/after-sales/create-repair`
- **Route Name:** `after-sales-create-repair-alias`
- **Source Component:** [`src/views/after-sales/CreateRepairJob.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/after-sales/CreateRepairJob.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/after-sales/create-repair [after-sales-create-repair-alias]
│
├── 📝 FORM FIELDS & INPUT CONTROLS (16 fields)
│   ├── [FIELD] "caseSearch"
│   ├── [FIELD] "form.customer"
│   ├── [FIELD] "form.unit"
│   ├── [FIELD] "form.branch"
│   ├── [FIELD] "form.unitModel"
│   ├── [FIELD] "form.diagnosis"
│   ├── [FIELD] "form.fault"
│   ├── [FIELD] "form.decision"
│   ├── [FIELD] "form.technician"
│   ├── [FIELD] "form.partItem"
│   ├── [FIELD] "form.partQty"
│   ├── [FIELD] "form.partCost"
│   ├── [FIELD] "form.partSource"
│   ├── [FIELD] "form.readyDate"
│   ├── [FIELD] "form.status"
│   └── [FIELD] "newTaskName"
├── ⚡ ACTION BUTTONS & TRIGGERS (2 buttons)
│   ├── [BUTTON] "+ Add"
│   └── [BUTTON] "Cancel"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/after-sales/repairs/detail`
- **Route Name:** `after-sales-repair-detail-legacy`
- **Source Component:** [`src/views/after-sales/RepairDetail.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/after-sales/RepairDetail.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/after-sales/repairs/detail [after-sales-repair-detail-legacy]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Repair Job Not Found"
│   ├── "Related information"
│   ├── "Update Status"
│   ├── "Approved"
│   └── "In Progress"
├── 📑 NAVIGATION TABS & FILTER PILLS (11 tabs)
│   ├── [TAB] "Manage Work Plan"
│   ├── [TAB] "Reserve More Parts"
│   ├── [TAB] "Diagnosis"
│   ├── [TAB] "Work"
│   ├── [TAB] "Parts"
│   ├── [TAB] "Labour"
│   ├── [TAB] "Cost"
│   ├── [TAB] "Warranty Coverage"
│   ├── [TAB] "Photos & Documents"
│   ├── [TAB] "Customer Approval"
│   └── [TAB] "Timeline"
├── 📊 SNAPSHOT METRICS & KPI CARDS (25 cards)
│   ├── [KPI CARD] Status ➔ job.status || 'In Progress'
│   ├── [KPI CARD] Case ➔ job.caseRef || 'SC-229'
│   ├── [KPI CARD] Unit ➔ `${job.unit || 'CHS-01882'
│   ├── [KPI CARD] Technician ➔ job.technician || 'Usman'
│   ├── [KPI CARD] Diagnosis ➔ job.diagnosis || 'Controller fault'
│   ├── [KPI CARD] Parts ➔ job.partsName || 'Service Kit'
│   ├── [KPI CARD] Labour ➔ job.labourList && job.labourList[0] ? `${job.labourList[0].hours
│   ├── [KPI CARD] Warranty ➔ job.warrantyCoverage?.status ? 'Covered' : 'Standard'
│   ├── [KPI CARD] Customer Approval ➔ job.customerApproval?.status || 'Confirmed'
│   ├── [KPI CARD] Promised ➔ job.promised || 'Tomorrow'
│   ├── [KPI CARD] Work Plan ➔ job.workPlan ? job.workPlan.map(w => w.task).join('; ') : 'Diagnostics and calibration'
│   ├── [KPI CARD] Current Step ➔ job.workPlan && job.workPlan[0] ? job.workPlan[0].task : 'Inspection'
│   ├── [KPI CARD] Bay Assigned ➔ 'Bay 2 (Electrical & Service)'
│   ├── [KPI CARD] Lead Technician ➔ job.technician || 'Technician Ali'
│   ├── [KPI CARD] Work Order Ref ➔ `WO-${job.repairId
│   ├── [KPI CARD] Target Completion ➔ job.promised || 'Tomorrow'
│   ├── [KPI CARD] Total Tasks ➔ job.workPlan ? `${job.workPlan.length
│   ├── [KPI CARD] Progress ➔ job.status === 'Ready' ? '100% Done' : job.status === 'Pending' ? 'Scheduled' : '50% Done'
│   ├── [KPI CARD] Lead Tech ➔ job.technician || 'Technician Ali'
│   ├── [KPI CARD] Est. Time ➔ job.labourList && job.labourList[0] ? `${job.labourList[0].hours
│   ├── [KPI CARD] Primary Part ➔ job.partsList && job.partsList[0] ? `${job.partsList[0].part
│   ├── [KPI CARD] Part SKU ➔ `PRT-${job.repairId
│   ├── [KPI CARD] Allocated Qty ➔ job.partsList && job.partsList[0] ? `${job.partsList[0].qty
│   ├── [KPI CARD] Stock Location ➔ `${branchName
│   └── [KPI CARD] Unit Cost ➔ job.costSummary?.partsTotal || 'PKR 2
├── 📋 DATA TABLES & GRID COLUMNS (3 tables)
│   ├── [TABLE 1] Columns:
│   │   ├── [COL] "Task"
│   │   ├── [COL] "Technician"
│   │   └── [COL] "Status"
│   ├── [TABLE 2] Columns:
│   │   ├── [COL] "Part"
│   │   ├── [COL] "Qty"
│   │   ├── [COL] "Cost"
│   │   ├── [COL] "Source"
│   │   └── [COL] "Status"
│   ├── [TABLE 3] Columns:
│   │   ├── [COL] "Work"
│   │   ├── [COL] "Hours"
│   │   ├── [COL] "Rate"
│   │   └── [COL] "Amount"
├── ⚡ ACTION BUTTONS & TRIGGERS (15 buttons)
│   ├── [BUTTON] "Back"
│   ├── [BUTTON] "Post to Finance"
│   ├── [BUTTON] "Confirm Schedule"
│   ├── [BUTTON] "Complete Service"
│   ├── [BUTTON] "Back to Repairs"
│   ├── [BUTTON] "Repair Actions"
│   ├── [BUTTON] "Approved"
│   ├── [BUTTON] "In Progress"
│   ├── [BUTTON] "Parts Waiting"
│   ├── [BUTTON] "Ready / Completed"
│   ├── [BUTTON] "More"
│   ├── [BUTTON] "Print Job Card"
│   ├── [BUTTON] "Generate Invoice"
│   ├── [BUTTON] "Cancel Repair Job"
│   └── [BUTTON] "Upload Photo / Document"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/after-sales/repairs/:id`
- **Route Name:** `after-sales-repair-detail`
- **Source Component:** [`src/views/after-sales/RepairDetail.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/after-sales/RepairDetail.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/after-sales/repairs/:id [after-sales-repair-detail]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Repair Job Not Found"
│   ├── "Related information"
│   ├── "Update Status"
│   ├── "Approved"
│   └── "In Progress"
├── 📑 NAVIGATION TABS & FILTER PILLS (11 tabs)
│   ├── [TAB] "Manage Work Plan"
│   ├── [TAB] "Reserve More Parts"
│   ├── [TAB] "Diagnosis"
│   ├── [TAB] "Work"
│   ├── [TAB] "Parts"
│   ├── [TAB] "Labour"
│   ├── [TAB] "Cost"
│   ├── [TAB] "Warranty Coverage"
│   ├── [TAB] "Photos & Documents"
│   ├── [TAB] "Customer Approval"
│   └── [TAB] "Timeline"
├── 📊 SNAPSHOT METRICS & KPI CARDS (25 cards)
│   ├── [KPI CARD] Status ➔ job.status || 'In Progress'
│   ├── [KPI CARD] Case ➔ job.caseRef || 'SC-229'
│   ├── [KPI CARD] Unit ➔ `${job.unit || 'CHS-01882'
│   ├── [KPI CARD] Technician ➔ job.technician || 'Usman'
│   ├── [KPI CARD] Diagnosis ➔ job.diagnosis || 'Controller fault'
│   ├── [KPI CARD] Parts ➔ job.partsName || 'Service Kit'
│   ├── [KPI CARD] Labour ➔ job.labourList && job.labourList[0] ? `${job.labourList[0].hours
│   ├── [KPI CARD] Warranty ➔ job.warrantyCoverage?.status ? 'Covered' : 'Standard'
│   ├── [KPI CARD] Customer Approval ➔ job.customerApproval?.status || 'Confirmed'
│   ├── [KPI CARD] Promised ➔ job.promised || 'Tomorrow'
│   ├── [KPI CARD] Work Plan ➔ job.workPlan ? job.workPlan.map(w => w.task).join('; ') : 'Diagnostics and calibration'
│   ├── [KPI CARD] Current Step ➔ job.workPlan && job.workPlan[0] ? job.workPlan[0].task : 'Inspection'
│   ├── [KPI CARD] Bay Assigned ➔ 'Bay 2 (Electrical & Service)'
│   ├── [KPI CARD] Lead Technician ➔ job.technician || 'Technician Ali'
│   ├── [KPI CARD] Work Order Ref ➔ `WO-${job.repairId
│   ├── [KPI CARD] Target Completion ➔ job.promised || 'Tomorrow'
│   ├── [KPI CARD] Total Tasks ➔ job.workPlan ? `${job.workPlan.length
│   ├── [KPI CARD] Progress ➔ job.status === 'Ready' ? '100% Done' : job.status === 'Pending' ? 'Scheduled' : '50% Done'
│   ├── [KPI CARD] Lead Tech ➔ job.technician || 'Technician Ali'
│   ├── [KPI CARD] Est. Time ➔ job.labourList && job.labourList[0] ? `${job.labourList[0].hours
│   ├── [KPI CARD] Primary Part ➔ job.partsList && job.partsList[0] ? `${job.partsList[0].part
│   ├── [KPI CARD] Part SKU ➔ `PRT-${job.repairId
│   ├── [KPI CARD] Allocated Qty ➔ job.partsList && job.partsList[0] ? `${job.partsList[0].qty
│   ├── [KPI CARD] Stock Location ➔ `${branchName
│   └── [KPI CARD] Unit Cost ➔ job.costSummary?.partsTotal || 'PKR 2
├── 📋 DATA TABLES & GRID COLUMNS (3 tables)
│   ├── [TABLE 1] Columns:
│   │   ├── [COL] "Task"
│   │   ├── [COL] "Technician"
│   │   └── [COL] "Status"
│   ├── [TABLE 2] Columns:
│   │   ├── [COL] "Part"
│   │   ├── [COL] "Qty"
│   │   ├── [COL] "Cost"
│   │   ├── [COL] "Source"
│   │   └── [COL] "Status"
│   ├── [TABLE 3] Columns:
│   │   ├── [COL] "Work"
│   │   ├── [COL] "Hours"
│   │   ├── [COL] "Rate"
│   │   └── [COL] "Amount"
├── ⚡ ACTION BUTTONS & TRIGGERS (15 buttons)
│   ├── [BUTTON] "Back"
│   ├── [BUTTON] "Post to Finance"
│   ├── [BUTTON] "Confirm Schedule"
│   ├── [BUTTON] "Complete Service"
│   ├── [BUTTON] "Back to Repairs"
│   ├── [BUTTON] "Repair Actions"
│   ├── [BUTTON] "Approved"
│   ├── [BUTTON] "In Progress"
│   ├── [BUTTON] "Parts Waiting"
│   ├── [BUTTON] "Ready / Completed"
│   ├── [BUTTON] "More"
│   ├── [BUTTON] "Print Job Card"
│   ├── [BUTTON] "Generate Invoice"
│   ├── [BUTTON] "Cancel Repair Job"
│   └── [BUTTON] "Upload Photo / Document"
└── (No secondary dialogs)
```

### 📁 MODULE: `FINANCE` (9 Total Routes)

#### 📍 ROUTE: `/finance/expenses`
- **Route Name:** `finance-expenses`
- **Source Component:** [`src/views/finance/Expenses.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/finance/Expenses.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/finance/expenses [finance-expenses]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Expenses"
│   ├── "Add Expense"
│   └── "Branch Expenses"
├── 📑 NAVIGATION TABS & FILTER PILLS (8 tabs)
│   ├── [TAB] "Clear"
│   ├── [TAB] "Clear Filters"
│   ├── [TAB] "All Categories"
│   ├── [TAB] "Utilities"
│   ├── [TAB] "Rent"
│   ├── [TAB] "Marketing"
│   ├── [TAB] "Logistics"
│   └── [TAB] "Maintenance"
├── 📊 SNAPSHOT METRICS & KPI CARDS (4 cards)
│   ├── [KPI CARD] This Month ➔ 'PKR 482K'
│   ├── [KPI CARD] Submitted ➔ String(submittedCount || 8)
│   ├── [KPI CARD] Pending ➔ String(pendingCount || 3)
│   └── [KPI CARD] Paid ➔ String(paidCount || 21)
├── 📋 DATA TABLES & GRID COLUMNS (2 tables)
│   ├── [TABLE 1] Columns:
│   │   ├── [COL] "Expense"
│   │   ├── [COL] "Category"
│   │   ├── [COL] "Vendor"
│   │   ├── [COL] "Amount"
│   │   ├── [COL] "Date"
│   │   ├── [COL] "Status"
│   │   └── [COL] "Actions"
│   ├── [TABLE 2] Columns:
│   │   ├── [COL] "Expense ID"
│   │   ├── [COL] "Branch"
│   │   ├── [COL] "Category"
│   │   ├── [COL] "Vendor"
│   │   ├── [COL] "Amount"
│   │   ├── [COL] "Status"
│   │   └── [COL] "Actions"
├── 📝 FORM FIELDS & INPUT CONTROLS (2 fields)
│   ├── [FIELD] "branchSearchQuery"
│   └── [FIELD] "searchQuery"
├── ⚡ ACTION BUTTONS & TRIGGERS (4 buttons)
│   ├── [BUTTON] "Add Expense"
│   ├── [BUTTON] "Columns"
│   ├── [BUTTON] "Export"
│   └── [BUTTON] "Open ›"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/finance/expenses/create`
- **Route Name:** `finance-create-expense`
- **Source Component:** [`src/views/finance/CreateExpense.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/finance/CreateExpense.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/finance/expenses/create [finance-create-expense]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Expense Details"
│   ├── "Showroom Outflow"
│   ├── "(Type numbers only)"
│   ├── "Payment & Evidence"
│   └── "Audit Compliance"
├── 📑 NAVIGATION TABS & FILTER PILLS (8 tabs)
│   ├── [TAB] "Facility & Maintenance"
│   ├── [TAB] "Staff Welfare & Refreshments"
│   ├── [TAB] "Local Logistics & Courier"
│   ├── [TAB] "Showroom Marketing & Banners"
│   ├── [TAB] "Office Stationery & Supplies"
│   ├── [TAB] "Security & Municipal Fees"
│   ├── [TAB] "Workshop Consumables & Cleaning"
│   └── [TAB] "Other Operating Expense"
├── 📝 FORM FIELDS & INPUT CONTROLS (9 fields)
│   ├── [FIELD] "form.category"
│   ├── [FIELD] "e.g. PKR 48,500"
│   ├── [FIELD] "form.date"
│   ├── [FIELD] "form.vendor"
│   ├── [FIELD] "form.paymentMethod"
│   ├── [FIELD] "form.transactionId"
│   ├── [FIELD] "form.description"
│   ├── [FIELD] "form.receipt"
│   └── [FIELD] "form.notes"
├── ⚡ ACTION BUTTONS & TRIGGERS (1 buttons)
│   └── [BUTTON] "Cancel"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/finance/create-expense`
- **Route Name:** `finance-create-expense-alias`
- **Source Component:** [`src/views/finance/CreateExpense.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/finance/CreateExpense.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/finance/create-expense [finance-create-expense-alias]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Expense Details"
│   ├── "Showroom Outflow"
│   ├── "(Type numbers only)"
│   ├── "Payment & Evidence"
│   └── "Audit Compliance"
├── 📑 NAVIGATION TABS & FILTER PILLS (8 tabs)
│   ├── [TAB] "Facility & Maintenance"
│   ├── [TAB] "Staff Welfare & Refreshments"
│   ├── [TAB] "Local Logistics & Courier"
│   ├── [TAB] "Showroom Marketing & Banners"
│   ├── [TAB] "Office Stationery & Supplies"
│   ├── [TAB] "Security & Municipal Fees"
│   ├── [TAB] "Workshop Consumables & Cleaning"
│   └── [TAB] "Other Operating Expense"
├── 📝 FORM FIELDS & INPUT CONTROLS (9 fields)
│   ├── [FIELD] "form.category"
│   ├── [FIELD] "e.g. PKR 48,500"
│   ├── [FIELD] "form.date"
│   ├── [FIELD] "form.vendor"
│   ├── [FIELD] "form.paymentMethod"
│   ├── [FIELD] "form.transactionId"
│   ├── [FIELD] "form.description"
│   ├── [FIELD] "form.receipt"
│   └── [FIELD] "form.notes"
├── ⚡ ACTION BUTTONS & TRIGGERS (1 buttons)
│   └── [BUTTON] "Cancel"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/finance/expenses/detail`
- **Route Name:** `finance-expense-detail-legacy`
- **Source Component:** [`src/views/finance/ExpenseDetail.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/finance/ExpenseDetail.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/finance/expenses/detail [finance-expense-detail-legacy]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Related information"
│   ├── "Super Admin"
│   ├── "Finance"
│   ├── "Expenses"
│   └── "Expense Detail"
├── 📊 SNAPSHOT METRICS & KPI CARDS (25 cards)
│   ├── [KPI CARD] Status ➔ exp.approval || 'Pending'
│   ├── [KPI CARD] Category ➔ exp.category || 'Utilities'
│   ├── [KPI CARD] Vendor ➔ exp.vendor || 'PESCO'
│   ├── [KPI CARD] Amount ➔ exp.amount || 'PKR 48
│   ├── [KPI CARD] Date ➔ exp.fullDate || exp.date || '27 Aug 2026'
│   ├── [KPI CARD] Payment Method ➔ exp.paymentMethod || 'Bank'
│   ├── [KPI CARD] Submitted by ➔ exp.submittedBy || 'Branch Manager'
│   ├── [KPI CARD] Approval ➔ exp.decision || 'Awaiting management'
│   ├── [KPI CARD] Receipt ➔ exp.receiptFile ? 'Attached' : 'None'
│   ├── [KPI CARD] Last Update ➔ exp.lastUpdate || 'Today 08:20'
│   ├── [KPI CARD] Current Approval ➔ exp.approval === 'Approved' ? 'Approved by Policy' : 'Pending Management Review'
│   ├── [KPI CARD] Branch Threshold ➔ `${exp.branchLimit || 'PKR 100K'
│   ├── [KPI CARD] Approving Authority ➔ 'Central Finance Lead / Super Admin'
│   ├── [KPI CARD] Submission Date ➔ `${exp.fullDate || exp.date
│   ├── [KPI CARD] Policy Verification ➔ 'Compliant with branch monthly budget'
│   ├── [KPI CARD] Audit Status ➔ 'Under Automated Compliance Check'
│   ├── [KPI CARD] SLA Window ➔ '24 Hours'
│   ├── [KPI CARD] Priority ➔ 'Normal'
│   ├── [KPI CARD] Approver Role ➔ 'Super Admin'
│   ├── [KPI CARD] Escalation ➔ 'Not required'
│   ├── [KPI CARD] Payment Status ➔ exp.payment || 'Unpaid'
│   ├── [KPI CARD] Disbursement Method ➔ exp.paymentMethod || 'Bank IBFT'
│   ├── [KPI CARD] Beneficiary Name ➔ exp.vendor || 'PESCO'
│   ├── [KPI CARD] Billing Period ➔ 'August 2026'
│   └── [KPI CARD] Settlement Amount ➔ exp.amount || 'PKR 48
├── ⚡ ACTION BUTTONS & TRIGGERS (3 buttons)
│   ├── [BUTTON] "Back"
│   ├── [BUTTON] "Approve"
│   └── [BUTTON] "Reject"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/finance/expenses/:id`
- **Route Name:** `finance-expense-detail`
- **Source Component:** [`src/views/finance/ExpenseDetail.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/finance/ExpenseDetail.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/finance/expenses/:id [finance-expense-detail]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Related information"
│   ├── "Super Admin"
│   ├── "Finance"
│   ├── "Expenses"
│   └── "Expense Detail"
├── 📊 SNAPSHOT METRICS & KPI CARDS (25 cards)
│   ├── [KPI CARD] Status ➔ exp.approval || 'Pending'
│   ├── [KPI CARD] Category ➔ exp.category || 'Utilities'
│   ├── [KPI CARD] Vendor ➔ exp.vendor || 'PESCO'
│   ├── [KPI CARD] Amount ➔ exp.amount || 'PKR 48
│   ├── [KPI CARD] Date ➔ exp.fullDate || exp.date || '27 Aug 2026'
│   ├── [KPI CARD] Payment Method ➔ exp.paymentMethod || 'Bank'
│   ├── [KPI CARD] Submitted by ➔ exp.submittedBy || 'Branch Manager'
│   ├── [KPI CARD] Approval ➔ exp.decision || 'Awaiting management'
│   ├── [KPI CARD] Receipt ➔ exp.receiptFile ? 'Attached' : 'None'
│   ├── [KPI CARD] Last Update ➔ exp.lastUpdate || 'Today 08:20'
│   ├── [KPI CARD] Current Approval ➔ exp.approval === 'Approved' ? 'Approved by Policy' : 'Pending Management Review'
│   ├── [KPI CARD] Branch Threshold ➔ `${exp.branchLimit || 'PKR 100K'
│   ├── [KPI CARD] Approving Authority ➔ 'Central Finance Lead / Super Admin'
│   ├── [KPI CARD] Submission Date ➔ `${exp.fullDate || exp.date
│   ├── [KPI CARD] Policy Verification ➔ 'Compliant with branch monthly budget'
│   ├── [KPI CARD] Audit Status ➔ 'Under Automated Compliance Check'
│   ├── [KPI CARD] SLA Window ➔ '24 Hours'
│   ├── [KPI CARD] Priority ➔ 'Normal'
│   ├── [KPI CARD] Approver Role ➔ 'Super Admin'
│   ├── [KPI CARD] Escalation ➔ 'Not required'
│   ├── [KPI CARD] Payment Status ➔ exp.payment || 'Unpaid'
│   ├── [KPI CARD] Disbursement Method ➔ exp.paymentMethod || 'Bank IBFT'
│   ├── [KPI CARD] Beneficiary Name ➔ exp.vendor || 'PESCO'
│   ├── [KPI CARD] Billing Period ➔ 'August 2026'
│   └── [KPI CARD] Settlement Amount ➔ exp.amount || 'PKR 48
├── ⚡ ACTION BUTTONS & TRIGGERS (3 buttons)
│   ├── [BUTTON] "Back"
│   ├── [BUTTON] "Approve"
│   └── [BUTTON] "Reject"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/finance/overview`
- **Route Name:** `finance-overview`
- **Source Component:** [`src/views/finance/FinanceOverview.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/finance/FinanceOverview.vue)
- **RBAC Access:** 🔒 **[Role Restricted / Super Admin Only]** (Roles: `Super Admin`)

```text
/finance/overview [finance-overview]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Finance Overview"
│   ├── "Branch Contribution"
│   ├── "Cash Collections"
│   ├── "Week 1"
│   └── "Week 2"
├── 📊 SNAPSHOT METRICS & KPI CARDS (8 cards)
│   ├── [KPI CARD] Net Sales ➔ 'PKR 28.4M'
│   ├── [KPI CARD] Collections ➔ 'PKR 25.5M'
│   ├── [KPI CARD] Receivables ➔ 'PKR 2.9M'
│   ├── [KPI CARD] Payables ➔ 'PKR 6.1M'
│   ├── [KPI CARD] Expenses ➔ 'PKR 3.2M'
│   ├── [KPI CARD] COGS ➔ 'PKR 14.6M'
│   ├── [KPI CARD] Gross Profit ➔ 'PKR 6.9M'
│   └── [KPI CARD] Net Operating Profit ➔ 'PKR 3.7M'
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/finance/receivables`
- **Route Name:** `finance-receivables`
- **Source Component:** [`src/views/finance/Receivables.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/finance/Receivables.vue)
- **RBAC Access:** 🔒 **[Role Restricted / Super Admin Only]** (Roles: `Super Admin`)

```text
/finance/receivables [finance-receivables]
│
├── 🏷️ HEADERS & TITLES
│   └── "Receivables"
├── 📑 NAVIGATION TABS & FILTER PILLS (2 tabs)
│   ├── [TAB] "Clear Filters"
│   └── [TAB] "Reset filters"
├── 📊 SNAPSHOT METRICS & KPI CARDS (4 cards)
│   ├── [KPI CARD] Total Receivables ➔ formatPKR(totalBal)
│   ├── [KPI CARD] Current ➔ formatPKR(currentBal)
│   ├── [KPI CARD] Overdue ➔ formatPKR(overdueBal)
│   └── [KPI CARD] Customers Overdue ➔ String(overdueCustCount || '0')
├── 📋 DATA TABLES & GRID COLUMNS (1 tables)
│   ├── [TABLE 1] Columns:
│   │   ├── [COL] "Customer"
│   │   ├── [COL] "Branch"
│   │   ├── [COL] "Order"
│   │   ├── [COL] "Total"
│   │   ├── [COL] "Paid"
│   │   ├── [COL] "Balance"
│   │   ├── [COL] "Due"
│   │   ├── [COL] "Age"
│   │   └── [COL] "Action"
├── 📝 FORM FIELDS & INPUT CONTROLS (1 fields)
│   └── [FIELD] "searchQuery"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/finance/payables`
- **Route Name:** `finance-payables`
- **Source Component:** [`src/views/finance/Payables.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/finance/Payables.vue)
- **RBAC Access:** 🔒 **[Role Restricted / Super Admin Only]** (Roles: `Super Admin`)

```text
/finance/payables [finance-payables]
│
├── 🏷️ HEADERS & TITLES
│   └── "Payables"
├── 📑 NAVIGATION TABS & FILTER PILLS (2 tabs)
│   ├── [TAB] "Clear Filters"
│   └── [TAB] "Reset filters"
├── 📊 SNAPSHOT METRICS & KPI CARDS (4 cards)
│   ├── [KPI CARD] Total Payables ➔ 'PKR 6.1M'
│   ├── [KPI CARD] Due This Week ➔ 'PKR 2.4M'
│   ├── [KPI CARD] Overdue ➔ 'PKR 0.7M'
│   └── [KPI CARD] Suppliers ➔ '6'
├── 📋 DATA TABLES & GRID COLUMNS (1 tables)
│   ├── [TABLE 1] Columns:
│   │   ├── [COL] "Supplier"
│   │   ├── [COL] "Bill"
│   │   ├── [COL] "PO"
│   │   ├── [COL] "Amount"
│   │   ├── [COL] "Paid"
│   │   ├── [COL] "Outstanding"
│   │   ├── [COL] "Due"
│   │   ├── [COL] "Match"
│   │   └── [COL] "Action"
├── 📝 FORM FIELDS & INPUT CONTROLS (1 fields)
│   └── [FIELD] "searchQuery"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/finance/cash-bank`
- **Route Name:** `finance-cash-bank`
- **Source Component:** [`src/views/finance/CashBank.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/finance/CashBank.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/finance/cash-bank [finance-cash-bank]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Cash / Bank"
│   └── "Reconciliation"
├── 📑 NAVIGATION TABS & FILTER PILLS (2 tabs)
│   ├── [TAB] "Clear Filters"
│   └── [TAB] "Reset filters"
├── 📊 SNAPSHOT METRICS & KPI CARDS (4 cards)
│   ├── [KPI CARD] Bank Balance ➔ 'PKR 18.6M'
│   ├── [KPI CARD] Cash on Hand ➔ 'PKR 1.2M'
│   ├── [KPI CARD] Unreconciled ➔ 'PKR 0.14M'
│   └── [KPI CARD] Last Reconciled ➔ 'Aug 26'
├── 📋 DATA TABLES & GRID COLUMNS (1 tables)
│   ├── [TABLE 1] Columns:
│   │   ├── [COL] "Date"
│   │   ├── [COL] "Account"
│   │   ├── [COL] "Reference"
│   │   ├── [COL] "Recorded"
│   │   ├── [COL] "Statement"
│   │   ├── [COL] "Difference"
│   │   ├── [COL] "Status"
│   │   └── [COL] "Action"
├── 📝 FORM FIELDS & INPUT CONTROLS (1 fields)
│   └── [FIELD] "searchQuery"
└── (No secondary dialogs)
```

### 📁 MODULE: `COMMUNICATION` (5 Total Routes)

#### 📍 ROUTE: `/communication/inbox`
- **Route Name:** `communication-inbox`
- **Source Component:** [`src/views/communication/ManagementInbox.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/communication/ManagementInbox.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/communication/inbox [communication-inbox]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Management Inbox"
│   ├── "New Conversation"
│   ├── "Columns"
│   ├── "Export"
│   └── "Conversations"
├── 📑 NAVIGATION TABS & FILTER PILLS (4 tabs)
│   ├── [TAB] "Clear"
│   ├── [TAB] "Inbox"
│   ├── [TAB] "Sent"
│   └── [TAB] "Unread"
├── 📊 SNAPSHOT METRICS & KPI CARDS (4 cards)
│   ├── [KPI CARD] Unread ➔ String(unreadCount)
│   ├── [KPI CARD] Stock Requests ➔ String(stockReqCount)
│   ├── [KPI CARD] Expense Questions ➔ String(expenseCount)
│   └── [KPI CARD] Service Escalations ➔ String(serviceCount)
├── 📋 DATA TABLES & GRID COLUMNS (2 tables)
│   ├── [TABLE 1] Columns:
│   │   ├── [COL] "Thread"
│   │   ├── [COL] "Linked Record"
│   │   ├── [COL] "From"
│   │   ├── [COL] "Last Message"
│   │   ├── [COL] "Priority"
│   │   └── [COL] "Status"
│   ├── [TABLE 2] Columns:
│   │   ├── [COL] "Thread Topic"
│   │   ├── [COL] "Branch"
│   │   ├── [COL] "Linked Context"
│   │   ├── [COL] "From"
│   │   ├── [COL] "Last Message Preview"
│   │   ├── [COL] "Priority"
│   │   └── [COL] "Action"
├── 📝 FORM FIELDS & INPUT CONTROLS (2 fields)
│   ├── [FIELD] "branchSearchQuery"
│   └── [FIELD] "searchQuery"
├── ⚡ ACTION BUTTONS & TRIGGERS (5 buttons)
│   ├── [BUTTON] "New Conversation"
│   ├── [BUTTON] "Columns"
│   ├── [BUTTON] "Export"
│   ├── [BUTTON] "Open ›"
│   └── [BUTTON] "New Thread"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/communication/inbox/create`
- **Route Name:** `communication-create-conversation`
- **Source Component:** [`src/views/communication/CreateConversation.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/communication/CreateConversation.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/communication/inbox/create [communication-create-conversation]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Topic & Linked Record"
│   └── "Message & Documents"
├── 📝 FORM FIELDS & INPUT CONTROLS (7 fields)
│   ├── [FIELD] "form.title"
│   ├── [FIELD] "form.linkedType"
│   ├── [FIELD] "form.linked"
│   ├── [FIELD] "form.recipient"
│   ├── [FIELD] "form.priority"
│   ├── [FIELD] "form.message"
│   └── [FIELD] "form.attachment"
├── ⚡ ACTION BUTTONS & TRIGGERS (1 buttons)
│   └── [BUTTON] "Cancel"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/communication/inbox/detail`
- **Route Name:** `communication-inbox-detail-legacy`
- **Source Component:** [`src/views/communication/ConversationDetail.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/communication/ConversationDetail.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/communication/inbox/detail [communication-inbox-detail-legacy]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Branch Manager"
│   ├── "Super Admin"
│   ├── "Peshawar (Requester)"
│   ├── "Lahore (Supplier)"
│   └── "Head Office Operations"
├── 📑 NAVIGATION TABS & FILTER PILLS (5 tabs)
│   ├── [TAB] "Preview"
│   ├── [TAB] "Thread"
│   ├── [TAB] "Attachments"
│   ├── [TAB] "Linked Record"
│   └── [TAB] "Participants"
├── 📋 DATA TABLES & GRID COLUMNS (1 tables)
│   ├── [TABLE 1] Columns:
│   │   ├── [COL] "Document Name"
│   │   ├── [COL] "Shared / Uploaded By"
│   │   ├── [COL] "Date & Time"
│   │   ├── [COL] "File Size & Format"
│   │   ├── [COL] "Operational Purpose"
│   │   └── [COL] "Actions"
├── 📝 FORM FIELDS & INPUT CONTROLS (4 fields)
│   ├── [FIELD] "replyText"
│   ├── [FIELD] "uploadForm.name"
│   ├── [FIELD] "uploadForm.scope"
│   └── [FIELD] "uploadForm.size"
├── ⚡ ACTION BUTTONS & TRIGGERS (7 buttons)
│   ├── [BUTTON] "Back to Management Inbox"
│   ├── [BUTTON] "Attach File"
│   ├── [BUTTON] "Attach Document"
│   ├── [BUTTON] "Send Reply"
│   ├── [BUTTON] "Upload Attachment"
│   ├── [BUTTON] "Download"
│   └── [BUTTON] "Cancel"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/communication/inbox/:id`
- **Route Name:** `communication-inbox-detail`
- **Source Component:** [`src/views/communication/ConversationDetail.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/communication/ConversationDetail.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/communication/inbox/:id [communication-inbox-detail]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Branch Manager"
│   ├── "Super Admin"
│   ├── "Peshawar (Requester)"
│   ├── "Lahore (Supplier)"
│   └── "Head Office Operations"
├── 📑 NAVIGATION TABS & FILTER PILLS (5 tabs)
│   ├── [TAB] "Preview"
│   ├── [TAB] "Thread"
│   ├── [TAB] "Attachments"
│   ├── [TAB] "Linked Record"
│   └── [TAB] "Participants"
├── 📋 DATA TABLES & GRID COLUMNS (1 tables)
│   ├── [TABLE 1] Columns:
│   │   ├── [COL] "Document Name"
│   │   ├── [COL] "Shared / Uploaded By"
│   │   ├── [COL] "Date & Time"
│   │   ├── [COL] "File Size & Format"
│   │   ├── [COL] "Operational Purpose"
│   │   └── [COL] "Actions"
├── 📝 FORM FIELDS & INPUT CONTROLS (4 fields)
│   ├── [FIELD] "replyText"
│   ├── [FIELD] "uploadForm.name"
│   ├── [FIELD] "uploadForm.scope"
│   └── [FIELD] "uploadForm.size"
├── ⚡ ACTION BUTTONS & TRIGGERS (7 buttons)
│   ├── [BUTTON] "Back to Management Inbox"
│   ├── [BUTTON] "Attach File"
│   ├── [BUTTON] "Attach Document"
│   ├── [BUTTON] "Send Reply"
│   ├── [BUTTON] "Upload Attachment"
│   ├── [BUTTON] "Download"
│   └── [BUTTON] "Cancel"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/communication/notifications`
- **Route Name:** `communication-notifications`
- **Source Component:** [`src/views/communication/Notifications.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/communication/Notifications.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/communication/notifications [communication-notifications]
│
├── 🏷️ HEADERS & TITLES
│   └── "Notifications"
├── 📑 NAVIGATION TABS & FILTER PILLS (9 tabs)
│   ├── [TAB] "Clear"
│   ├── [TAB] "Reset filters"
│   ├── [TAB] "All Categories"
│   ├── [TAB] "Inventory"
│   ├── [TAB] "Sales"
│   ├── [TAB] "Procurement"
│   ├── [TAB] "Finance"
│   ├── [TAB] "Service"
│   └── [TAB] "System"
├── 📊 SNAPSHOT METRICS & KPI CARDS (4 cards)
│   ├── [KPI CARD] Unread ➔ String(unreadCount)
│   ├── [KPI CARD] Inventory ➔ String(inventoryCount)
│   ├── [KPI CARD] Sales ➔ String(salesCount)
│   └── [KPI CARD] System / Ops ➔ String(systemCount)
├── 📋 DATA TABLES & GRID COLUMNS (1 tables)
│   ├── [TABLE 1] Columns:
│   │   ├── [COL] "Time"
│   │   ├── [COL] "Category"
│   │   ├── [COL] "Notification"
│   │   ├── [COL] "Branch"
│   │   ├── [COL] "Read"
│   │   └── [COL] "Action"
├── 📝 FORM FIELDS & INPUT CONTROLS (3 fields)
│   ├── [FIELD] "branchSearchQuery"
│   ├── [FIELD] "col.visible"
│   └── [FIELD] "searchQuery"
├── ⚡ ACTION BUTTONS & TRIGGERS (5 buttons)
│   ├── [BUTTON] "Columns"
│   ├── [BUTTON] "Export"
│   ├── [BUTTON] "Mark all read"
│   ├── [BUTTON] "Mark Read"
│   └── [BUTTON] "Open"
└── (No secondary dialogs)
```

### 📁 MODULE: `ANALYTICS` (9 Total Routes)

#### 📍 ROUTE: `/analytics/reports-hub`
- **Route Name:** `analytics-reports-hub`
- **Source Component:** [`src/views/analytics/ReportsHub.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/analytics/ReportsHub.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/analytics/reports-hub [analytics-reports-hub]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Reports Hub"
│   ├── "Trend"
│   ├── "Key Breakdown"
│   ├── "Top Segment"
│   └── "BRG E-Series"
├── 📊 SNAPSHOT METRICS & KPI CARDS (4 cards)
│   ├── [KPI CARD] Current Period ➔ 'PKR 8.7M'
│   ├── [KPI CARD] Prior Period ➔ 'PKR 7.9M'
│   ├── [KPI CARD] Records ➔ '248'
│   └── [KPI CARD] Export ➔ 'Ready'
├── 📋 DATA TABLES & GRID COLUMNS (1 tables)
│   ├── [TABLE 1] Columns:
│   │   ├── [COL] "Report"
│   │   ├── [COL] "Owner"
│   │   ├── [COL] "Scope"
│   │   ├── [COL] "Last Run"
│   │   ├── [COL] "Schedule"
│   │   └── [COL] "Action"
├── ⚡ ACTION BUTTONS & TRIGGERS (3 buttons)
│   ├── [BUTTON] "Export CSV"
│   ├── [BUTTON] "Export PDF"
│   └── [BUTTON] "Build Report"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/analytics/reports/build`
- **Route Name:** `analytics-build-report`
- **Source Component:** [`src/views/analytics/BuildReport.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/analytics/BuildReport.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/analytics/reports/build [analytics-build-report]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Build Custom Report"
│   ├── "Build Report"
│   ├── "Report Setup"
│   ├── "Date & Comparison"
│   └── "Included Metrics"
├── 📝 FORM FIELDS & INPUT CONTROLS (14 fields)
│   ├── [FIELD] "form.name"
│   ├── [FIELD] "form.category"
│   ├── [FIELD] "form.scope"
│   ├── [FIELD] "form.dateRange"
│   ├── [FIELD] "form.comparison"
│   ├── [FIELD] "form.status"
│   ├── [FIELD] "form.metrics.revenue"
│   ├── [FIELD] "form.metrics.volume"
│   ├── [FIELD] "form.metrics.orders"
│   ├── [FIELD] "form.metrics.margins"
│   ├── [FIELD] "form.metrics.kpi"
│   ├── [FIELD] "form.schedule"
│   ├── [FIELD] "form.format"
│   └── [FIELD] "form.email"
├── ⚡ ACTION BUTTONS & TRIGGERS (2 buttons)
│   ├── [BUTTON] "Cancel"
│   └── [BUTTON] "Generate Report"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/analytics/reports/sales`
- **Route Name:** `analytics-sales-report`
- **Source Component:** [`src/views/analytics/SalesReport.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/analytics/SalesReport.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/analytics/reports/sales [analytics-sales-report]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Sales Report"
│   ├── "Breakdown"
│   └── "Detailed Report"
├── 📑 NAVIGATION TABS & FILTER PILLS (1 tabs)
│   └── [TAB] "Clear Filters"
├── 📊 SNAPSHOT METRICS & KPI CARDS (4 cards)
│   ├── [KPI CARD] Net Sales ➔ '28.4M'
│   ├── [KPI CARD] Units ➔ '184'
│   ├── [KPI CARD] Orders ➔ '197'
│   └── [KPI CARD] Margin ➔ '24.3%'
├── 📋 DATA TABLES & GRID COLUMNS (1 tables)
│   ├── [TABLE 1] Columns:
│   │   ├── [COL] "Branch"
│   │   ├── [COL] "Sales"
│   │   ├── [COL] "Units"
│   │   ├── [COL] "Orders"
│   │   ├── [COL] "Discount"
│   │   └── [COL] "Margin"
├── ⚡ ACTION BUTTONS & TRIGGERS (3 buttons)
│   ├── [BUTTON] "Save View"
│   ├── [BUTTON] "Schedule"
│   └── [BUTTON] "Export"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/analytics/reports/inventory`
- **Route Name:** `analytics-inventory-report`
- **Source Component:** [`src/views/analytics/InventoryReport.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/analytics/InventoryReport.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/analytics/reports/inventory [analytics-inventory-report]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Inventory Report"
│   ├── "Breakdown"
│   └── "Detailed Report"
├── 📑 NAVIGATION TABS & FILTER PILLS (1 tabs)
│   └── [TAB] "Clear Filters"
├── 📊 SNAPSHOT METRICS & KPI CARDS (4 cards)
│   ├── [KPI CARD] Inventory Value ➔ '41.8M'
│   ├── [KPI CARD] Units ➔ '312'
│   ├── [KPI CARD] Available ➔ '228'
│   └── [KPI CARD] Low Stock ➔ '9'
├── 📋 DATA TABLES & GRID COLUMNS (1 tables)
│   ├── [TABLE 1] Columns:
│   │   ├── [COL] "Product"
│   │   ├── [COL] "Total"
│   │   ├── [COL] "Available"
│   │   ├── [COL] "Reserved"
│   │   ├── [COL] "Incoming"
│   │   └── [COL] "Value"
├── ⚡ ACTION BUTTONS & TRIGGERS (3 buttons)
│   ├── [BUTTON] "Save View"
│   ├── [BUTTON] "Schedule"
│   └── [BUTTON] "Export"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/analytics/reports/procurement`
- **Route Name:** `analytics-procurement-report`
- **Source Component:** [`src/views/analytics/ProcurementReport.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/analytics/ProcurementReport.vue)
- **RBAC Access:** 🔒 **[Role Restricted / Super Admin Only]** (Roles: `Super Admin`)

```text
/analytics/reports/procurement [analytics-procurement-report]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Procurement Report"
│   ├── "Breakdown"
│   └── "Detailed Report"
├── 📑 NAVIGATION TABS & FILTER PILLS (1 tabs)
│   └── [TAB] "Clear Filters"
├── 📊 SNAPSHOT METRICS & KPI CARDS (4 cards)
│   ├── [KPI CARD] PO Value ➔ '14.6M'
│   ├── [KPI CARD] Open POs ➔ '9'
│   ├── [KPI CARD] Receipts ➔ '18'
│   └── [KPI CARD] On-Time ➔ '91%'
├── 📋 DATA TABLES & GRID COLUMNS (1 tables)
│   ├── [TABLE 1] Columns:
│   │   ├── [COL] "Supplier"
│   │   ├── [COL] "POs"
│   │   ├── [COL] "Received"
│   │   ├── [COL] "Spend"
│   │   ├── [COL] "Lead Time"
│   │   └── [COL] "On-Time"
├── ⚡ ACTION BUTTONS & TRIGGERS (3 buttons)
│   ├── [BUTTON] "Save View"
│   ├── [BUTTON] "Schedule"
│   └── [BUTTON] "Export"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/analytics/reports/expense`
- **Route Name:** `analytics-expense-report`
- **Source Component:** [`src/views/analytics/ExpenseReport.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/analytics/ExpenseReport.vue)
- **RBAC Access:** 🔒 **[Role Restricted / Super Admin Only]** (Roles: `Super Admin`)

```text
/analytics/reports/expense [analytics-expense-report]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Expense Report"
│   ├── "Breakdown"
│   └── "Detailed Report"
├── 📑 NAVIGATION TABS & FILTER PILLS (1 tabs)
│   └── [TAB] "Clear Filters"
├── 📊 SNAPSHOT METRICS & KPI CARDS (4 cards)
│   ├── [KPI CARD] Expenses ➔ '3.2M'
│   ├── [KPI CARD] Pending ➔ '9'
│   ├── [KPI CARD] Recurring ➔ '27'
│   └── [KPI CARD] Largest Category ➔ 'Salaries'
├── 📋 DATA TABLES & GRID COLUMNS (1 tables)
│   ├── [TABLE 1] Columns:
│   │   ├── [COL] "Category"
│   │   ├── [COL] "Amount"
│   │   ├── [COL] "Share"
│   │   ├── [COL] "Budget"
│   │   └── [COL] "Variance"
├── ⚡ ACTION BUTTONS & TRIGGERS (3 buttons)
│   ├── [BUTTON] "Save View"
│   ├── [BUTTON] "Schedule"
│   └── [BUTTON] "Export"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/analytics/reports/profitability`
- **Route Name:** `analytics-profitability-report`
- **Source Component:** [`src/views/analytics/ProfitabilityReport.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/analytics/ProfitabilityReport.vue)
- **RBAC Access:** 🔒 **[Role Restricted / Super Admin Only]** (Roles: `Super Admin`)

```text
/analytics/reports/profitability [analytics-profitability-report]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Profitability Report"
│   ├── "Breakdown"
│   └── "Detailed Report"
├── 📑 NAVIGATION TABS & FILTER PILLS (1 tabs)
│   └── [TAB] "Clear Filters"
├── 📊 SNAPSHOT METRICS & KPI CARDS (4 cards)
│   ├── [KPI CARD] Gross Profit ➔ '6.9M'
│   ├── [KPI CARD] Net Op Profit ➔ '3.7M'
│   ├── [KPI CARD] Gross Margin ➔ '24.3%'
│   └── [KPI CARD] Net Margin ➔ '13.0%'
├── 📋 DATA TABLES & GRID COLUMNS (1 tables)
│   ├── [TABLE 1] Columns:
│   │   ├── [COL] "Branch"
│   │   ├── [COL] "Sales"
│   │   ├── [COL] "COGS"
│   │   ├── [COL] "Gross Profit"
│   │   ├── [COL] "OpEx"
│   │   └── [COL] "Net Operating Profit"
├── ⚡ ACTION BUTTONS & TRIGGERS (3 buttons)
│   ├── [BUTTON] "Save View"
│   ├── [BUTTON] "Schedule"
│   └── [BUTTON] "Export"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/analytics/reports/crm`
- **Route Name:** `analytics-crm-report`
- **Source Component:** [`src/views/analytics/CrmReport.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/analytics/CrmReport.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/analytics/reports/crm [analytics-crm-report]
│
├── 🏷️ HEADERS & TITLES
│   ├── "CRM Report"
│   ├── "Breakdown"
│   └── "Detailed Report"
├── 📑 NAVIGATION TABS & FILTER PILLS (1 tabs)
│   └── [TAB] "Clear Filters"
├── 📊 SNAPSHOT METRICS & KPI CARDS (4 cards)
│   ├── [KPI CARD] Leads ➔ '182'
│   ├── [KPI CARD] Qualified ➔ '71'
│   ├── [KPI CARD] Converted ➔ '54'
│   └── [KPI CARD] Conversion ➔ '29.7%'
├── 📋 DATA TABLES & GRID COLUMNS (1 tables)
│   ├── [TABLE 1] Columns:
│   │   ├── [COL] "Source"
│   │   ├── [COL] "Leads"
│   │   ├── [COL] "Qualified"
│   │   ├── [COL] "Quoted"
│   │   ├── [COL] "Converted"
│   │   └── [COL] "Rate"
├── ⚡ ACTION BUTTONS & TRIGGERS (3 buttons)
│   ├── [BUTTON] "Save View"
│   ├── [BUTTON] "Schedule"
│   └── [BUTTON] "Export"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/analytics/reports/branch`
- **Route Name:** `analytics-branch-report`
- **Source Component:** [`src/views/analytics/BranchReport.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/analytics/BranchReport.vue)
- **RBAC Access:** 🔒 **[Role Restricted / Super Admin Only]** (Roles: `Super Admin`)

```text
/analytics/reports/branch [analytics-branch-report]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Branch Report"
│   └── "Breakdown"
├── 📑 NAVIGATION TABS & FILTER PILLS (1 tabs)
│   └── [TAB] "Clear Filters"
├── 📊 SNAPSHOT METRICS & KPI CARDS (4 cards)
│   ├── [KPI CARD] Sales ➔ '9.8M'
│   ├── [KPI CARD] Units ➔ '66'
│   ├── [KPI CARD] Expenses ➔ '1.0M'
│   └── [KPI CARD] Net Operating Profit ➔ '1.4M'
├── 📋 DATA TABLES & GRID COLUMNS (1 tables)
│   ├── [TABLE 1] Columns:
│   │   ├── [COL] "Metric"
│   │   ├── [COL] "Previous"
│   │   └── [COL] "Variance"
├── ⚡ ACTION BUTTONS & TRIGGERS (3 buttons)
│   ├── [BUTTON] "Save View"
│   ├── [BUTTON] "Schedule"
│   └── [BUTTON] "Export"
└── (No secondary dialogs)
```

### 📁 MODULE: `SYSTEM` (8 Total Routes)

#### 📍 ROUTE: `/system/audit-log`
- **Route Name:** `system-audit-log`
- **Source Component:** [`src/views/system/AuditLog.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/system/AuditLog.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/system/audit-log [system-audit-log]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Audit Log"
│   ├── "Total Visible Events"
│   ├── "Audit Events"
│   ├── "Click record or row to inspect"
│   └── "Audit Event Trace"
├── 📑 NAVIGATION TABS & FILTER PILLS (2 tabs)
│   ├── [TAB] "Clear Filters"
│   └── [TAB] "Reset filters"
├── 📋 DATA TABLES & GRID COLUMNS (1 tables)
│   ├── [TABLE 1] Columns:
│   │   ├── [COL] "Timestamp"
│   │   ├── [COL] "User / Actor"
│   │   ├── [COL] "Role"
│   │   ├── [COL] "Branch"
│   │   ├── [COL] "Module"
│   │   ├── [COL] "Operation"
│   │   ├── [COL] "Affected Record"
│   │   ├── [COL] "Change / Description"
│   │   └── [COL] "Action"
├── 📝 FORM FIELDS & INPUT CONTROLS (1 fields)
│   └── [FIELD] "searchQuery"
├── ⚡ ACTION BUTTONS & TRIGGERS (3 buttons)
│   ├── [BUTTON] "Close"
│   ├── [BUTTON] "View Source Record"
│   └── [BUTTON] "Return to Audit Log"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/system/audit-log/:id`
- **Route Name:** `system-audit-log-detail`
- **Source Component:** [`src/views/system/AuditLog.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/system/AuditLog.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/system/audit-log/:id [system-audit-log-detail]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Audit Log"
│   ├── "Total Visible Events"
│   ├── "Audit Events"
│   ├── "Click record or row to inspect"
│   └── "Audit Event Trace"
├── 📑 NAVIGATION TABS & FILTER PILLS (2 tabs)
│   ├── [TAB] "Clear Filters"
│   └── [TAB] "Reset filters"
├── 📋 DATA TABLES & GRID COLUMNS (1 tables)
│   ├── [TABLE 1] Columns:
│   │   ├── [COL] "Timestamp"
│   │   ├── [COL] "User / Actor"
│   │   ├── [COL] "Role"
│   │   ├── [COL] "Branch"
│   │   ├── [COL] "Module"
│   │   ├── [COL] "Operation"
│   │   ├── [COL] "Affected Record"
│   │   ├── [COL] "Change / Description"
│   │   └── [COL] "Action"
├── 📝 FORM FIELDS & INPUT CONTROLS (1 fields)
│   └── [FIELD] "searchQuery"
├── ⚡ ACTION BUTTONS & TRIGGERS (3 buttons)
│   ├── [BUTTON] "Close"
│   ├── [BUTTON] "View Source Record"
│   └── [BUTTON] "Return to Audit Log"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/system/settings`
- **Route Name:** `system-settings`
- **Source Component:** [`src/views/system/Settings.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/system/Settings.vue)
- **RBAC Access:** 🔒 **[Role Restricted / Super Admin Only]** (Roles: `Super Admin`)

```text
/system/settings [system-settings]
│
├── 🏷️ HEADERS & TITLES
│   ├── "System Settings"
│   ├── "Business Profile"
│   ├── "Branch Defaults"
│   ├── "Product Master Data"
│   └── "Canonical Statuses"
├── 📑 NAVIGATION TABS & FILTER PILLS (12 tabs)
│   ├── [TAB] "Business Profile"
│   ├── [TAB] "Branch Defaults"
│   ├── [TAB] "Product Master Data"
│   ├── [TAB] "Statuses"
│   ├── [TAB] "Pricing Rules"
│   ├── [TAB] "Payment Methods"
│   ├── [TAB] "Expense Categories"
│   ├── [TAB] "Approval Rules"
│   ├── [TAB] "Numbering"
│   ├── [TAB] "Notifications"
│   ├── [TAB] "Data Import & Export"
│   └── [TAB] "Integrations"
├── 📋 DATA TABLES & GRID COLUMNS (5 tables)
│   ├── [TABLE 1] Columns:
│   │   ├── [COL] "Entity"
│   │   └── [COL] "Statuses"
│   ├── [TABLE 2] Columns:
│   │   ├── [COL] "Method"
│   │   ├── [COL] "Active"
│   │   └── [COL] "Requires Reference"
│   ├── [TABLE 3] Columns:
│   │   ├── [COL] "Category"
│   │   ├── [COL] "Active"
│   │   └── [COL] "Approval Rule"
│   ├── [TABLE 4] Columns:
│   │   ├── [COL] "Workflow"
│   │   ├── [COL] "Branch Limit"
│   │   ├── [COL] "Above Limit"
│   │   └── [COL] "Super Admin"
│   ├── [TABLE 5] Columns:
│   │   ├── [COL] "Business Document"
│   │   ├── [COL] "Active Prefix"
│   │   └── [COL] "Next Available ID"
├── 📝 FORM FIELDS & INPUT CONTROLS (22 fields)
│   ├── [FIELD] "businessProfile.name"
│   ├── [FIELD] "businessProfile.brand"
│   ├── [FIELD] "businessProfile.email"
│   ├── [FIELD] "businessProfile.phone"
│   ├── [FIELD] "businessProfile.website"
│   ├── [FIELD] "businessProfile.taxNumber"
│   ├── [FIELD] "businessProfile.address"
│   ├── [FIELD] "businessProfile.timezone"
│   ├── [FIELD] "businessProfile.currency"
│   ├── [FIELD] "branchDefaults.openingHours"
│   ├── [FIELD] "branchDefaults.expenseLimit"
│   ├── [FIELD] "branchDefaults.discountLimit"
│   ├── [FIELD] "productMasterData.tracking"
│   ├── [FIELD] "productMasterData.skuFormat"
│   ├── [FIELD] "productMasterData.warrantyDefault"
│   ├── [FIELD] "pricingRules.pricingMode"
│   ├── [FIELD] "pricingRules.minMargin"
│   ├── [FIELD] "pricingRules.discountThreshold"
│   ├── [FIELD] "num.prefix"
│   ├── [FIELD] "securitySettings.mfaPolicy"
│   ├── [FIELD] "securitySettings.sessionTimeout"
│   └── [FIELD] "securitySettings.passwordPolicy"
├── ⚡ ACTION BUTTONS & TRIGGERS (3 buttons)
│   ├── [BUTTON] "Restore Defaults"
│   ├── [BUTTON] "Save Changes"
│   └── [BUTTON] "Save Numbering"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/system/branch-team`
- **Route Name:** `system-branch-team`
- **Source Component:** [`src/views/system/BranchTeam.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/system/BranchTeam.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/system/branch-team [system-branch-team]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Branch Team"
│   ├── "Add Team Member"
│   └── "Branch Staff"
├── 📑 NAVIGATION TABS & FILTER PILLS (1 tabs)
│   └── [TAB] "Clear"
├── 📊 SNAPSHOT METRICS & KPI CARDS (4 cards)
│   ├── [KPI CARD] Team Members ➔ String(teamMembers.value.length || 8)
│   ├── [KPI CARD] Sales ➔ String(salesCount || 3)
│   ├── [KPI CARD] Service ➔ String(serviceCount || 2)
│   └── [KPI CARD] Sessions ➔ String(activeCount || 6)
├── 📋 DATA TABLES & GRID COLUMNS (1 tables)
│   ├── [TABLE 1] Columns:
│   │   ├── [COL] "Team Member"
│   │   ├── [COL] "Role / Function"
│   │   ├── [COL] "Phone Contact"
│   │   ├── [COL] "Email Address"
│   │   ├── [COL] "Last Active"
│   │   ├── [COL] "Status"
│   │   └── [COL] "Actions"
├── 📝 FORM FIELDS & INPUT CONTROLS (6 fields)
│   ├── [FIELD] "searchQuery"
│   ├── [FIELD] "memberForm.name"
│   ├── [FIELD] "memberForm.role"
│   ├── [FIELD] "memberForm.status"
│   ├── [FIELD] "memberForm.contact"
│   └── [FIELD] "memberForm.email"
├── ⚡ ACTION BUTTONS & TRIGGERS (4 buttons)
│   ├── [BUTTON] "Add Team Member"
│   ├── [BUTTON] "Columns"
│   ├── [BUTTON] "Export"
│   └── [BUTTON] "Cancel"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/system/account`
- **Route Name:** `system-account`
- **Source Component:** [`src/views/system/Account.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/system/Account.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/system/account [system-account]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Account Profile"
│   ├── "Account"
│   ├── "Personal Profile"
│   ├── "Admin Controlled"
│   └── "Access & Role Information"
├── 📝 FORM FIELDS & INPUT CONTROLS (5 fields)
│   ├── [FIELD] "profileForm.name"
│   ├── [FIELD] "profileForm.email"
│   ├── [FIELD] "profileForm.phone"
│   ├── [FIELD] "profileForm.photo"
│   └── [FIELD] "profileForm.contactPreference"
├── ⚡ ACTION BUTTONS & TRIGGERS (1 buttons)
│   └── [BUTTON] "Save Changes"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/system/security`
- **Route Name:** `system-security`
- **Source Component:** [`src/views/system/SecuritySessions.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/system/SecuritySessions.vue)
- **RBAC Access:** 🔒 **[Role Restricted / Super Admin Only]** (Roles: `Super Admin`)

```text
/system/security [system-security]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Security & Sessions"
│   └── "Active Sessions"
├── 📑 NAVIGATION TABS & FILTER PILLS (2 tabs)
│   ├── [TAB] "Clear"
│   └── [TAB] "Reset filters"
├── 📊 SNAPSHOT METRICS & KPI CARDS (4 cards)
│   ├── [KPI CARD] MFA ➔ 'Enabled'
│   ├── [KPI CARD] Active Sessions ➔ '2'
│   ├── [KPI CARD] Last Login ➔ 'Today 08:02'
│   └── [KPI CARD] Password ➔ 'Changed 41d ago'
├── 📝 FORM FIELDS & INPUT CONTROLS (2 fields)
│   ├── [FIELD] "searchQuery"
│   └── [FIELD] "col.visible"
├── ⚡ ACTION BUTTONS & TRIGGERS (3 buttons)
│   ├── [BUTTON] "Columns"
│   ├── [BUTTON] "Export"
│   └── [BUTTON] "Revoke"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/system/preferences`
- **Route Name:** `system-preferences`
- **Source Component:** [`src/views/system/Preferences.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/system/Preferences.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/system/preferences [system-preferences]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Preferences"
│   ├── "Appearance & Localization"
│   └── "Operational Notification Preferences"
├── 📝 FORM FIELDS & INPUT CONTROLS (8 fields)
│   ├── [FIELD] "preferencesForm.theme"
│   ├── [FIELD] "preferencesForm.language"
│   ├── [FIELD] "preferencesForm.dateFormat"
│   ├── [FIELD] "preferencesForm.tableDensity"
│   ├── [FIELD] "preferencesForm.inventoryAlerts"
│   ├── [FIELD] "preferencesForm.salesAlerts"
│   ├── [FIELD] "preferencesForm.serviceAlerts"
│   └── [FIELD] "preferencesForm.managementMessages"
├── ⚡ ACTION BUTTONS & TRIGGERS (1 buttons)
│   └── [BUTTON] "Save Preferences"
└── (No secondary dialogs)
```

#### 📍 ROUTE: `/system/logout`
- **Route Name:** `system-logout`
- **Source Component:** [`src/views/system/Logout.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/system/Logout.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/system/logout [system-logout]
│
├── 🏷️ HEADERS & TITLES
│   └── "Logout"
├── ⚡ ACTION BUTTONS & TRIGGERS (2 buttons)
│   ├── [BUTTON] "Cancel"
│   └── [BUTTON] "Sign Out"
└── (No secondary dialogs)
```

### 📁 MODULE: `AUDIT-LOGS` (1 Total Routes)

#### 📍 ROUTE: `/audit-logs/:id`
- **Route Name:** `audit-log-direct-alias`
- **Source Component:** [`src/views/system/AuditLog.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/system/AuditLog.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/audit-logs/:id [audit-log-direct-alias]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Audit Log"
│   ├── "Total Visible Events"
│   ├── "Audit Events"
│   ├── "Click record or row to inspect"
│   └── "Audit Event Trace"
├── 📑 NAVIGATION TABS & FILTER PILLS (2 tabs)
│   ├── [TAB] "Clear Filters"
│   └── [TAB] "Reset filters"
├── 📋 DATA TABLES & GRID COLUMNS (1 tables)
│   ├── [TABLE 1] Columns:
│   │   ├── [COL] "Timestamp"
│   │   ├── [COL] "User / Actor"
│   │   ├── [COL] "Role"
│   │   ├── [COL] "Branch"
│   │   ├── [COL] "Module"
│   │   ├── [COL] "Operation"
│   │   ├── [COL] "Affected Record"
│   │   ├── [COL] "Change / Description"
│   │   └── [COL] "Action"
├── 📝 FORM FIELDS & INPUT CONTROLS (1 fields)
│   └── [FIELD] "searchQuery"
├── ⚡ ACTION BUTTONS & TRIGGERS (3 buttons)
│   ├── [BUTTON] "Close"
│   ├── [BUTTON] "View Source Record"
│   └── [BUTTON] "Return to Audit Log"
└── (No secondary dialogs)
```

### 📁 MODULE: `AUDIT-LOG` (1 Total Routes)

#### 📍 ROUTE: `/audit-log/:id`
- **Route Name:** `audit-log-direct-alias-2`
- **Source Component:** [`src/views/system/AuditLog.vue`](file:///C:/xampp/htdocs/Aj Ecodrive/src/views/system/AuditLog.vue)
- **RBAC Access:** 🟢 **[Branch Manager Accessible]** (Roles: `Super Admin, Branch Manager`)

```text
/audit-log/:id [audit-log-direct-alias-2]
│
├── 🏷️ HEADERS & TITLES
│   ├── "Audit Log"
│   ├── "Total Visible Events"
│   ├── "Audit Events"
│   ├── "Click record or row to inspect"
│   └── "Audit Event Trace"
├── 📑 NAVIGATION TABS & FILTER PILLS (2 tabs)
│   ├── [TAB] "Clear Filters"
│   └── [TAB] "Reset filters"
├── 📋 DATA TABLES & GRID COLUMNS (1 tables)
│   ├── [TABLE 1] Columns:
│   │   ├── [COL] "Timestamp"
│   │   ├── [COL] "User / Actor"
│   │   ├── [COL] "Role"
│   │   ├── [COL] "Branch"
│   │   ├── [COL] "Module"
│   │   ├── [COL] "Operation"
│   │   ├── [COL] "Affected Record"
│   │   ├── [COL] "Change / Description"
│   │   └── [COL] "Action"
├── 📝 FORM FIELDS & INPUT CONTROLS (1 fields)
│   └── [FIELD] "searchQuery"
├── ⚡ ACTION BUTTONS & TRIGGERS (3 buttons)
│   ├── [BUTTON] "Close"
│   ├── [BUTTON] "View Source Record"
│   └── [BUTTON] "Return to Audit Log"
└── (No secondary dialogs)
```

