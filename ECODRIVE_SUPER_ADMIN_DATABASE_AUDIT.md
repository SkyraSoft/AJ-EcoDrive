# ECodrive ERP — Super Admin & Database Forensic Audit Report

**Date:** October 30, 2026  
**Target Environment:** Local XAMPP MySQL (127.0.0.1:3306/ecodrive), Express API (127.0.0.1:3000), Vite SPA (127.0.0.1:5173)  
**System Location:** `C:\xampp\htdocs\ECodrive`  
**Audit Scope:** Super Admin Enterprise Dashboard, All 11 Modules, 52 Database Tables, Multi-Tenant Branch Scoping & Authorization, Regression Test Suites, Concurrency Stress Verification, Browser Playbook, Data Immutability & Teardown, External Integrations (SMTP & Payments).

---

## 1. Executive Summary & Verification Context

An exhaustive, non-destructive forensic audit was conducted on the ECodrive ERP platform. The system operates on a dual-tier architecture:
- **Backend:** Node.js/Express with MySQL connection pooling, JWT Bearer authentication, and role/permission middleware.
- **Frontend:** Vue 3 (Vite) Single Page Application with reactive Pinia/Store architecture, dynamic branch authorization, and Tailwind CSS.

### Audit Summary Overview
- **Automated Backend Tests:** **306 / 306 Passed (100%)** across 19 suites and 54 sub-suites (exit code `0`).
- **Automated Frontend Tests:** **494 / 494 Passed (100%)** across 39 test suites (exit code `0`).
- **Production Build:** **100% Clean** (1,918 modules compiled, 0 errors, build time 14.18s).
- **Concurrency Stress Test:** **45 / 45 Concurrent Writes Passed (100%)** with zero primary key collisions.
- **Data Immutability Verification:** **15 / 15 Business Tables Bit-for-Bit Identical** (SHA-256 verified, 0 deletions, 0 mutations, 0 residue).
- **Live Branch Lifecycle & IDOR Test:** **9 / 9 Security Checks Passed (100%)**, verifying strict branch isolation and cross-branch IDOR blocking with HTTP 403.
- **Database Schema Integrity:** **52 / 52 Tables** verified in MySQL `ecodrive` schema.

---

## 2. Super Admin Dashboard & 11 Modules Verification

The Super Admin navigation structure defined in [`frontend/src/layouts/MainLayout.vue`](file:///C:/xampp/htdocs/ECodrive/frontend/src/layouts/MainLayout.vue#L120-L205) encompasses **11 core modules**, each linked to active backend API endpoints and database models:

| # | Module | Core Views & Submenus | API Endpoints | Database Tables | Audit Status |
|---|---|---|---|---|---|
| 1 | **Home / Dashboard** | Super Admin Dashboard, Branch Performance, Business Performance, Action Centre | `/api/v1/auth/me`, `/api/v1/analytics/reports/*` | `orders`, `invoices`, `payments`, `expenses`, `inventory_stock` | **FULLY VERIFIED** |
| 2 | **Organisation** | Branches, Users & Access, Roles & Permissions | `/api/v1/organisation/branches`, `/users`, `/roles` | `branches`, `users`, `roles`, `permissions`, `role_permissions` | **FULLY VERIFIED** |
| 3 | **Catalogue** | Categories, Products, Pricing Rules, Product Requests | `/api/v1/categories`, `/products`, `/catalogue/*` | `categories`, `products`, `price_rules`, `product_requests` | **FULLY VERIFIED** |
| 4 | **Procurement** | Suppliers, Purchase Orders, Goods Receipts, Landed Costs, Vendor Bills, Purchase Returns | `/api/v1/procurement/*` | `suppliers`, `purchase_orders`, `purchase_order_items`, `goods_receipts`, `goods_receipt_items`, `vendor_bills`, `vendor_debit_notes`, `purchase_returns`, `purchase_return_items` | **FULLY VERIFIED** |
| 5 | **Inventory** | Inventory Dashboard, Stock by Product, Serialized Units, Transfers, Stock Requests, Adjustments, Cycle Counts, Movements Ledger, Quarantine | `/api/v1/inventory/*`, `/api/v1/inventory-governance/*` | `inventory_stock`, `serialized_units`, `stock_transfers`, `stock_transfer_items`, `stock_adjustments`, `stock_movements`, `stock_requests`, `cycle_counts`, `quarantine_records` | **FULLY VERIFIED** |
| 6 | **Sales & CRM** | Sales Dashboard, Quotations, Orders, Invoices, Payments, Customers, Leads, Follow-ups, Custom Orders, Sales Returns, Delivery/Handover | `/api/v1/quotations`, `/orders`, `/invoices`, `/payments`, `/customers`, `/leads`, `/follow-ups`, `/sales/*` | `quotations`, `quotation_items`, `orders`, `order_items`, `invoices`, `invoice_items`, `payments`, `customers`, `leads`, `follow_ups`, `custom_orders`, `sales_returns`, `delivery_handovers` | **FULLY VERIFIED** |
| 7 | **After-Sales** | After-Sales Dashboard, Warranty Claims, Repair Jobs, Service Cases | `/api/v1/after-sales/*` | `service_cases`, `warranty_claims`, `repair_jobs`, `repair_job_items` | **FULLY VERIFIED** |
| 8 | **Finance** | Expenses, Finance Overview, Receivables, Payables, Cash/Bank Accounts | `/api/v1/finance/expenses`, `/cash-bank-accounts`, `/transactions`, `/general-ledger` | `expenses`, `expense_categories`, `cash_bank_accounts`, `financial_transactions`, `general_ledger` | **FULLY VERIFIED** |
| 9 | **Communication** | Management Inbox, Message Threads, Notifications | `/api/v1/communication/conversations`, `/notifications` | `conversations`, `conversation_messages` | **FULLY VERIFIED** |
| 10 | **Analytics** | Reports Hub (Sales, Inventory, Procurement, Expense, Profitability, CRM, Branch) | `/api/v1/analytics/custom-reports`, `/reports` | `custom_reports`, aggregated views from operational tables | **FULLY VERIFIED** |
| 11 | **System** | Audit Log, System Settings, Account Profile, Security Settings | `/api/v1/auth/me`, `/system/settings` | `users`, audit tables | **FULLY VERIFIED** |

---

## 3. Complete Forensic Inventory of All 52 Database Tables

The MySQL database `ecodrive` contains exactly **52 tables**. Every table has been inspected for columns, data types, keys, row count, backend model/controller/routes, and frontend views:

### 3.1 `branches`
- **Row Count:** 5 rows
- **Column Count:** 10 columns
- **Backend Model:** `backend/src/models/organisation.model.js`
- **Backend Controller:** `backend/src/controllers/organisation.controller.js`
- **Backend Routes:** `backend/src/routes/organisation.routes.js`
- **Frontend Views:** `frontend/src/views/organisation/Branches.vue, BranchDetail.vue, CreateBranch.vue, EditBranch.vue`
- **Functional Usage:** Operating branch master (HQ, Peshawar, Islamabad, Lahore, Rawalpindi)

| Column | Data Type | Nullable | Key | Default |
|---|---|---|---|---|
| `id` | `varchar(64)` | NO | PRI | NULL |
| `code` | `varchar(32)` | NO | UNI | NULL |
| `name` | `varchar(128)` | NO | - | NULL |
| `city` | `varchar(128)` | YES | - | `NULL` |
| `address` | `text` | YES | - | `NULL` |
| `phone` | `varchar(64)` | YES | - | `NULL` |
| `email` | `varchar(191)` | YES | - | `NULL` |
| `status` | `varchar(32)` | NO | - | `'Active'` |
| `created_at` | `timestamp` | NO | - | `current_timestamp()` |
| `updated_at` | `timestamp` | NO | - | `current_timestamp()` |

---

### 3.2 `cash_bank_accounts`
- **Row Count:** 6 rows
- **Column Count:** 15 columns
- **Backend Model:** `backend/src/models/expense.model.js`
- **Backend Controller:** `backend/src/controllers/finance.controller.js`
- **Backend Routes:** `backend/src/routes/finance.routes.js`
- **Frontend Views:** `frontend/src/views/finance/CashBank.vue`
- **Functional Usage:** Bank accounts (Meezan, Alfalah) and branch petty cash ledgers

| Column | Data Type | Nullable | Key | Default |
|---|---|---|---|---|
| `id` | `varchar(64)` | NO | PRI | NULL |
| `code` | `varchar(64)` | NO | UNI | NULL |
| `account_name` | `varchar(128)` | NO | - | NULL |
| `account_type` | `enum('Bank','Cash')` | NO | MUL | `'Bank'` |
| `bank_name` | `varchar(128)` | YES | - | `NULL` |
| `account_number` | `varchar(64)` | YES | - | `NULL` |
| `branch_id` | `varchar(64)` | NO | MUL | `'BR-HQ'` |
| `branch` | `varchar(128)` | NO | - | `'All Branches'` |
| `gl_account_code` | `varchar(64)` | NO | - | `'1000'` |
| `currency` | `varchar(16)` | NO | - | `'PKR'` |
| `opening_balance` | `decimal(15,2)` | NO | - | `0.00` |
| `current_balance` | `decimal(15,2)` | NO | - | `0.00` |
| `status` | `varchar(32)` | NO | - | `'Active'` |
| `created_at` | `timestamp` | NO | - | `current_timestamp()` |
| `updated_at` | `timestamp` | NO | - | `current_timestamp()` |

---

### 3.3 `categories`
- **Row Count:** 5 rows
- **Column Count:** 7 columns
- **Backend Model:** `backend/src/models/product.model.js`
- **Backend Controller:** `backend/src/controllers/category.controller.js`
- **Backend Routes:** `backend/src/routes/category.routes.js`
- **Frontend Views:** `frontend/src/views/catalogue/Categories.vue, CreateCategory.vue`
- **Functional Usage:** Product taxonomy, classification, active catalog status

| Column | Data Type | Nullable | Key | Default |
|---|---|---|---|---|
| `id` | `varchar(64)` | NO | PRI | NULL |
| `name` | `varchar(255)` | NO | - | NULL |
| `code` | `varchar(64)` | NO | UNI | NULL |
| `description` | `text` | YES | - | `NULL` |
| `status` | `varchar(64)` | NO | - | `'Active'` |
| `created_at` | `timestamp` | NO | - | `current_timestamp()` |
| `updated_at` | `timestamp` | NO | - | `current_timestamp()` |

---

### 3.4 `conversations`
- **Row Count:** 0 rows
- **Column Count:** 23 columns
- **Backend Model:** `backend/src/models/communication.model.js`
- **Backend Controller:** `backend/src/controllers/communication.controller.js`
- **Backend Routes:** `backend/src/routes/communication.routes.js`
- **Frontend Views:** `frontend/src/views/communication/Inbox.vue, CreateConversation.vue`
- **Functional Usage:** Internal branch-to-HQ communication threads, support inquiries

| Column | Data Type | Nullable | Key | Default |
|---|---|---|---|---|
| `id` | `varchar(64)` | NO | PRI | NULL |
| `title` | `varchar(255)` | NO | - | NULL |
| `subtitle` | `varchar(255)` | YES | - | `NULL` |
| `thread` | `varchar(255)` | YES | - | `NULL` |
| `subject` | `varchar(255)` | YES | - | `NULL` |
| `branch_id` | `varchar(64)` | NO | MUL | `'BR-01'` |
| `branch` | `varchar(128)` | NO | - | `'Peshawar'` |
| `linked` | `varchar(128)` | NO | MUL | `'General'` |
| `linked_type` | `varchar(128)` | NO | - | `'Stock Request'` |
| `from_user` | `varchar(128)` | YES | - | `NULL` |
| `recipient` | `varchar(128)` | YES | - | `NULL` |
| `last_msg` | `text` | YES | - | `NULL` |
| `priority` | `varchar(64)` | NO | - | `'Medium'` |
| `priority_class` | `varchar(128)` | NO | - | `'bg-blue-50 text-blue-700'` |
| `unread` | `int(11)` | NO | - | `0` |
| `status` | `varchar(64)` | NO | MUL | `'Open'` |
| `status_class` | `varchar(128)` | NO | - | `'bg-[#dcfce7] text-[#15803d]'` |
| `participants` | `varchar(255)` | YES | - | `NULL` |
| `last_reply` | `varchar(128)` | YES | - | `NULL` |
| `owner` | `varchar(128)` | YES | - | `NULL` |
| `replies` | `int(11)` | NO | - | `1` |
| `created_at` | `timestamp` | NO | - | `current_timestamp()` |
| `updated_at` | `timestamp` | NO | - | `current_timestamp()` |

---

### 3.5 `conversation_messages`
- **Row Count:** 0 rows
- **Column Count:** 9 columns
- **Backend Model:** `backend/src/models/communication.model.js`
- **Backend Controller:** `backend/src/controllers/communication.controller.js`
- **Backend Routes:** `backend/src/routes/communication.routes.js`
- **Frontend Views:** `frontend/src/views/communication/ConversationDetail.vue`
- **Functional Usage:** Individual messages, replies, and attachments within conversations

| Column | Data Type | Nullable | Key | Default |
|---|---|---|---|---|
| `id` | `int(11)` | NO | PRI | NULL |
| `conversation_id` | `varchar(64)` | NO | MUL | NULL |
| `sender` | `varchar(128)` | NO | - | NULL |
| `role` | `varchar(128)` | YES | - | `NULL` |
| `branch` | `varchar(128)` | YES | - | `NULL` |
| `text` | `text` | NO | - | NULL |
| `attachment` | `varchar(255)` | YES | - | `NULL` |
| `time` | `varchar(64)` | YES | - | `NULL` |
| `created_at` | `timestamp` | NO | - | `current_timestamp()` |

---

### 3.6 `customers`
- **Row Count:** 15 rows
- **Column Count:** 27 columns
- **Backend Model:** `backend/src/models/customer.model.js`
- **Backend Controller:** `backend/src/controllers/customer.controller.js`
- **Backend Routes:** `backend/src/routes/customer.routes.js`
- **Frontend Views:** `frontend/src/views/sales/Customers.vue, CustomerDetail.vue, CreateCustomer.vue`
- **Functional Usage:** Customer master data, phone/CNIC indexing, branch assignments

| Column | Data Type | Nullable | Key | Default |
|---|---|---|---|---|
| `id` | `varchar(64)` | NO | PRI | NULL |
| `code` | `varchar(64)` | NO | UNI | NULL |
| `name` | `varchar(255)` | NO | - | NULL |
| `first_name` | `varchar(128)` | YES | - | `NULL` |
| `last_name` | `varchar(128)` | YES | - | `NULL` |
| `phone` | `varchar(64)` | NO | MUL | NULL |
| `email` | `varchar(191)` | YES | - | `NULL` |
| `cnic` | `varchar(32)` | YES | - | `NULL` |
| `address` | `text` | YES | - | `NULL` |
| `city` | `varchar(128)` | YES | - | `NULL` |
| `branch_id` | `varchar(64)` | NO | MUL | `'BR-01'` |
| `branch` | `varchar(128)` | NO | - | `'Peshawar'` |
| `type` | `varchar(64)` | NO | - | `'Individual'` |
| `status` | `varchar(64)` | NO | MUL | `'Active'` |
| `status_class` | `varchar(128)` | NO | - | `'bg-[#dcfce7] text-[#165A31]'` |
| `spent` | `varchar(64)` | NO | - | `'PKR 0'` |
| `total_purchases` | `varchar(64)` | NO | - | `'PKR 0'` |
| `balance` | `varchar(64)` | NO | - | `'0'` |
| `outstanding` | `varchar(64)` | NO | - | `'PKR 0'` |
| `ltv` | `varchar(64)` | NO | - | `'0'` |
| `units` | `int(11)` | NO | - | `0` |
| `orders` | `int(11)` | NO | - | `0` |
| `orders_count` | `int(11)` | NO | - | `0` |
| `activity` | `varchar(128)` | NO | - | `'Just now'` |
| `notes` | `text` | YES | - | `NULL` |
| `created_at` | `timestamp` | NO | - | `current_timestamp()` |
| `updated_at` | `timestamp` | NO | - | `current_timestamp()` |

---

### 3.7 `custom_orders`
- **Row Count:** 0 rows
- **Column Count:** 21 columns
- **Backend Model:** `backend/src/models/sales_extensions.model.js`
- **Backend Controller:** `backend/src/controllers/sales_extensions.controller.js`
- **Backend Routes:** `backend/src/routes/sales_extensions.routes.js`
- **Frontend Views:** `frontend/src/views/sales/CustomOrders.vue, CustomOrderDetail.vue, CreateCustomOrder.vue`
- **Functional Usage:** Customized EV configurations, custom paint/battery upgrades, bookings

| Column | Data Type | Nullable | Key | Default |
|---|---|---|---|---|
| `id` | `varchar(64)` | NO | PRI | NULL |
| `order_no` | `varchar(64)` | NO | - | NULL |
| `customer` | `varchar(255)` | NO | - | NULL |
| `customer_id` | `varchar(64)` | YES | - | `NULL` |
| `product` | `varchar(255)` | NO | - | NULL |
| `requirement` | `text` | YES | - | `NULL` |
| `budget` | `varchar(64)` | YES | - | `NULL` |
| `total` | `varchar(64)` | YES | - | `NULL` |
| `deposit` | `varchar(64)` | YES | - | `NULL` |
| `payment_method` | `varchar(64)` | NO | - | `'Bank Transfer'` |
| `transaction_id` | `varchar(128)` | YES | - | `NULL` |
| `desired_date` | `varchar(64)` | YES | - | `NULL` |
| `eta` | `varchar(64)` | YES | - | `NULL` |
| `reservation` | `varchar(128)` | NO | - | `'On arrival'` |
| `status` | `varchar(64)` | NO | MUL | `'Sourcing'` |
| `status_class` | `varchar(128)` | NO | - | `'bg-[#fef3c7] text-[#b45309]'` |
| `branch_id` | `varchar(64)` | NO | MUL | `'BR-01'` |
| `branch` | `varchar(128)` | NO | - | `'Peshawar'` |
| `notes` | `text` | YES | - | `NULL` |
| `created_at` | `timestamp` | NO | - | `current_timestamp()` |
| `updated_at` | `timestamp` | NO | - | `current_timestamp()` |

---

### 3.8 `custom_reports`
- **Row Count:** 0 rows
- **Column Count:** 16 columns
- **Backend Model:** `backend/src/models/analytics.model.js`
- **Backend Controller:** `backend/src/controllers/analytics.controller.js`
- **Backend Routes:** `backend/src/routes/analytics.routes.js`
- **Frontend Views:** `frontend/src/views/analytics/ReportsHub.vue, BuildReport.vue`
- **Functional Usage:** Saved custom BI report definitions, query filters, metrics config

| Column | Data Type | Nullable | Key | Default |
|---|---|---|---|---|
| `id` | `varchar(64)` | NO | PRI | NULL |
| `name` | `varchar(255)` | NO | - | NULL |
| `report` | `varchar(255)` | NO | - | NULL |
| `category` | `varchar(128)` | NO | MUL | `'Sales Reports'` |
| `scope` | `varchar(128)` | NO | - | `'All Branches'` |
| `date_range` | `varchar(128)` | NO | - | `'This Month'` |
| `comparison` | `varchar(128)` | NO | - | `'Previous Period'` |
| `status` | `varchar(64)` | NO | MUL | `'All Active'` |
| `schedule` | `varchar(64)` | NO | - | `'Monthly'` |
| `format` | `varchar(64)` | NO | - | `'PDF Summary'` |
| `email` | `varchar(191)` | YES | - | `NULL` |
| `metrics` | `text` | YES | - | `NULL` |
| `owner` | `varchar(128)` | NO | - | `'Super Admin'` |
| `last_run` | `varchar(64)` | NO | - | `'Just now'` |
| `created_at` | `timestamp` | NO | - | `current_timestamp()` |
| `updated_at` | `timestamp` | NO | - | `current_timestamp()` |

---

### 3.9 `cycle_counts`
- **Row Count:** 0 rows
- **Column Count:** 17 columns
- **Backend Model:** `backend/src/models/inventory_governance.model.js`
- **Backend Controller:** `backend/src/controllers/inventory_governance.controller.js`
- **Backend Routes:** `backend/src/routes/inventory.routes.js`
- **Frontend Views:** `frontend/src/views/inventory/CycleCounts.vue, CreateCycleCount.vue`
- **Functional Usage:** Periodic branch inventory physical counts, variance audit logging

| Column | Data Type | Nullable | Key | Default |
|---|---|---|---|---|
| `id` | `varchar(64)` | NO | PRI | NULL |
| `session` | `varchar(64)` | NO | - | NULL |
| `name` | `varchar(255)` | NO | - | NULL |
| `scope` | `varchar(128)` | NO | - | NULL |
| `category` | `varchar(128)` | YES | - | `NULL` |
| `assigned_to` | `varchar(128)` | YES | - | `NULL` |
| `scheduled_date` | `varchar(64)` | NO | - | `'Today'` |
| `expected` | `varchar(64)` | NO | - | `'0 units'` |
| `counted` | `varchar(64)` | NO | - | `'0 units'` |
| `variance` | `varchar(64)` | NO | - | `'0'` |
| `location` | `varchar(128)` | YES | - | `NULL` |
| `notes` | `text` | YES | - | `NULL` |
| `status` | `varchar(64)` | NO | MUL | `'In Progress'` |
| `branch_id` | `varchar(64)` | NO | MUL | `'BR-01'` |
| `branch` | `varchar(128)` | NO | - | `'Peshawar'` |
| `created_at` | `timestamp` | NO | - | `current_timestamp()` |
| `updated_at` | `timestamp` | NO | - | `current_timestamp()` |

---

### 3.10 `delivery_handovers`
- **Row Count:** 0 rows
- **Column Count:** 22 columns
- **Backend Model:** `backend/src/models/sales_extensions.model.js`
- **Backend Controller:** `backend/src/controllers/sales_extensions.controller.js`
- **Backend Routes:** `backend/src/routes/sales_extensions.routes.js`
- **Frontend Views:** `frontend/src/views/sales/Delivery.vue, CreateDeliveryHandover.vue`
- **Functional Usage:** Vehicle delivery inspection checklist, customer handover signoff

| Column | Data Type | Nullable | Key | Default |
|---|---|---|---|---|
| `id` | `varchar(64)` | NO | PRI | NULL |
| `delivery_id` | `varchar(64)` | NO | - | NULL |
| `order_id` | `varchar(64)` | NO | MUL | NULL |
| `customer` | `varchar(255)` | NO | - | NULL |
| `customer_id` | `varchar(64)` | YES | - | `NULL` |
| `unit` | `varchar(128)` | NO | - | NULL |
| `unit_id` | `varchar(128)` | YES | - | `NULL` |
| `scheduled` | `varchar(64)` | YES | - | `NULL` |
| `scheduled_time` | `varchar(64)` | YES | - | `NULL` |
| `officer` | `varchar(128)` | YES | - | `NULL` |
| `status` | `varchar(64)` | NO | MUL | `'Ready'` |
| `status_class` | `varchar(128)` | NO | - | `'bg-[#dcfce7] text-[#165A31]'` |
| `branch_id` | `varchar(64)` | NO | MUL | `'BR-01'` |
| `branch` | `varchar(128)` | NO | - | `'Peshawar'` |
| `identity_verified` | `tinyint(1)` | NO | - | `0` |
| `payment_complete` | `tinyint(1)` | NO | - | `0` |
| `chassis_verified` | `tinyint(1)` | NO | - | `0` |
| `accessories_included` | `tinyint(1)` | NO | - | `0` |
| `warranty_briefed` | `tinyint(1)` | NO | - | `0` |
| `notes` | `text` | YES | - | `NULL` |
| `created_at` | `timestamp` | NO | - | `current_timestamp()` |
| `updated_at` | `timestamp` | NO | - | `current_timestamp()` |

---

### 3.11 `expenses`
- **Row Count:** 5 rows
- **Column Count:** 35 columns
- **Backend Model:** `backend/src/models/expense.model.js`
- **Backend Controller:** `backend/src/controllers/finance.controller.js`
- **Backend Routes:** `backend/src/routes/finance.routes.js`
- **Frontend Views:** `frontend/src/views/finance/Expenses.vue, ExpenseDetail.vue, CreateExpense.vue`
- **Functional Usage:** Branch operating expenses, dual-tier approval, disbursement tracking

| Column | Data Type | Nullable | Key | Default |
|---|---|---|---|---|
| `id` | `varchar(64)` | NO | PRI | NULL |
| `expense_number` | `varchar(64)` | NO | UNI | NULL |
| `branch_id` | `varchar(64)` | NO | MUL | `'BR-01'` |
| `branch` | `varchar(128)` | NO | - | `'Peshawar'` |
| `category_id` | `varchar(64)` | YES | - | `NULL` |
| `category` | `varchar(128)` | NO | MUL | NULL |
| `vendor_id` | `varchar(64)` | YES | - | `NULL` |
| `vendor` | `varchar(255)` | NO | - | NULL |
| `amount` | `varchar(64)` | NO | - | NULL |
| `raw_amount` | `decimal(15,2)` | NO | - | `0.00` |
| `date` | `varchar(64)` | NO | - | NULL |
| `full_date` | `date` | NO | MUL | NULL |
| `approval` | `enum('Pending','Approved','Rejected')` | NO | MUL | `'Pending'` |
| `approval_class` | `varchar(128)` | NO | - | `'bg-[#fef3c7] text-[#92400e]'` |
| `status` | `varchar(64)` | NO | - | `'Pending Approval'` |
| `payment` | `enum('Unpaid','Paid','Partial')` | NO | MUL | `'Unpaid'` |
| `payment_class` | `varchar(128)` | NO | - | `'text-gray-900 font-medium'` |
| `branch_limit` | `varchar(64)` | NO | - | `'PKR 15,000'` |
| `decision` | `varchar(255)` | YES | - | `NULL` |
| `payment_method` | `varchar(64)` | NO | - | `'Bank Transfer'` |
| `transaction_id` | `varchar(128)` | YES | - | `NULL` |
| `description` | `text` | YES | - | `NULL` |
| `receipt_file` | `varchar(255)` | YES | - | `NULL` |
| `receipt_type` | `varchar(64)` | NO | - | `'PDF Document'` |
| `submitted_by` | `varchar(128)` | YES | - | `NULL` |
| `approved_by` | `varchar(128)` | YES | - | `NULL` |
| `approved_date` | `date` | YES | - | `NULL` |
| `rejected_by` | `varchar(128)` | YES | - | `NULL` |
| `rejection_reason` | `text` | YES | - | `NULL` |
| `notes` | `text` | YES | - | `NULL` |
| `last_update` | `varchar(64)` | YES | - | `'Today 08:20'` |
| `gl_posted` | `tinyint(1)` | NO | - | `0` |
| `gl_entry_id` | `varchar(64)` | YES | - | `NULL` |
| `created_at` | `timestamp` | NO | - | `current_timestamp()` |
| `updated_at` | `timestamp` | NO | - | `current_timestamp()` |

---

### 3.12 `expense_categories`
- **Row Count:** 9 rows
- **Column Count:** 8 columns
- **Backend Model:** `backend/src/models/expense.model.js`
- **Backend Controller:** `backend/src/controllers/finance.controller.js`
- **Backend Routes:** `backend/src/routes/finance.routes.js`
- **Frontend Views:** `frontend/src/views/finance/Expenses.vue`
- **Functional Usage:** Operating expense categories (Rent, Utilities, Marketing, Logistics)

| Column | Data Type | Nullable | Key | Default |
|---|---|---|---|---|
| `id` | `varchar(64)` | NO | PRI | NULL |
| `code` | `varchar(64)` | NO | UNI | NULL |
| `name` | `varchar(128)` | NO | UNI | NULL |
| `description` | `varchar(255)` | YES | - | `NULL` |
| `gl_account_code` | `varchar(64)` | NO | - | `'5000'` |
| `status` | `varchar(32)` | NO | - | `'Active'` |
| `created_at` | `timestamp` | NO | - | `current_timestamp()` |
| `updated_at` | `timestamp` | NO | - | `current_timestamp()` |

---

### 3.13 `financial_transactions`
- **Row Count:** 59 rows
- **Column Count:** 30 columns
- **Backend Model:** `backend/src/models/expense.model.js`
- **Backend Controller:** `backend/src/controllers/finance.controller.js`
- **Backend Routes:** `backend/src/routes/finance.routes.js`
- **Frontend Views:** `frontend/src/views/finance/CashBank.vue`
- **Functional Usage:** Cash and bank transaction feed, reconciliation status

| Column | Data Type | Nullable | Key | Default |
|---|---|---|---|---|
| `id` | `varchar(64)` | NO | PRI | NULL |
| `transaction_number` | `varchar(64)` | NO | UNI | NULL |
| `account_id` | `varchar(64)` | NO | MUL | NULL |
| `account_name` | `varchar(128)` | NO | - | `'Bank'` |
| `branch_id` | `varchar(64)` | NO | MUL | `'BR-01'` |
| `branch` | `varchar(128)` | NO | - | `'Peshawar'` |
| `date` | `varchar(64)` | NO | - | `'Aug 27'` |
| `full_date` | `date` | NO | - | NULL |
| `type` | `enum('Deposit','Disbursement','Transfer','Reconciliation')` | NO | - | `'Disbursement'` |
| `category` | `varchar(64)` | NO | - | `'Operational'` |
| `reference` | `varchar(128)` | NO | MUL | NULL |
| `reference_type` | `varchar(64)` | YES | - | `NULL` |
| `reference_id` | `varchar(64)` | YES | - | `NULL` |
| `recorded` | `varchar(64)` | NO | - | NULL |
| `raw_recorded` | `decimal(15,2)` | NO | - | `0.00` |
| `statement` | `varchar(64)` | YES | - | `'—'` |
| `raw_statement` | `decimal(15,2)` | YES | - | `NULL` |
| `difference` | `varchar(64)` | NO | - | `'0'` |
| `raw_difference` | `decimal(15,2)` | NO | - | `0.00` |
| `status` | `enum('Matched','Review','Unreconciled')` | NO | MUL | `'Matched'` |
| `status_class` | `varchar(128)` | NO | - | `'bg-[#eefcf2] text-[#165A31]'` |
| `action` | `varchar(64)` | NO | - | `'Open'` |
| `action_class` | `varchar(128)` | NO | - | `'text-gray-500 hover:text-gray-900'` |
| `description` | `varchar(255)` | YES | - | `NULL` |
| `is_reversed` | `tinyint(1)` | NO | - | `0` |
| `reversal_reason` | `text` | YES | - | `NULL` |
| `reversed_by` | `varchar(128)` | YES | - | `NULL` |
| `reversed_at` | `timestamp` | YES | - | `NULL` |
| `created_at` | `timestamp` | NO | - | `current_timestamp()` |
| `updated_at` | `timestamp` | NO | - | `current_timestamp()` |

---

### 3.14 `follow_ups`
- **Row Count:** 2 rows
- **Column Count:** 22 columns
- **Backend Model:** `backend/src/models/follow_up.model.js`
- **Backend Controller:** `backend/src/controllers/follow_up.controller.js`
- **Backend Routes:** `backend/src/routes/follow_up.routes.js`
- **Frontend Views:** `frontend/src/views/sales/FollowUps.vue, FollowUpDetail.vue, CreateFollowUp.vue`
- **Functional Usage:** Lead/customer sales tasks, test drive bookings, scheduled reminders

| Column | Data Type | Nullable | Key | Default |
|---|---|---|---|---|
| `id` | `varchar(64)` | NO | PRI | NULL |
| `branch_id` | `varchar(64)` | NO | MUL | `'BR-01'` |
| `branch` | `varchar(128)` | NO | - | `'Peshawar'` |
| `lead_id` | `varchar(64)` | YES | MUL | `NULL` |
| `customer_id` | `varchar(64)` | YES | MUL | `NULL` |
| `customer_name` | `varchar(255)` | NO | - | NULL |
| `phone` | `varchar(64)` | YES | - | `NULL` |
| `linked_record_type` | `varchar(64)` | NO | - | `'Lead'` |
| `linked_record_id` | `varchar(64)` | YES | - | `NULL` |
| `task_type` | `varchar(64)` | NO | - | `'Lead follow-up'` |
| `channel` | `varchar(64)` | NO | - | `'Phone Call'` |
| `priority` | `varchar(64)` | NO | - | `'Medium'` |
| `priority_color` | `varchar(128)` | NO | - | `'bg-blue-50 text-blue-700'` |
| `status` | `varchar(64)` | NO | MUL | `'Due Today'` |
| `status_class` | `varchar(128)` | NO | - | `'bg-[#fef3c7] text-[#b45309]'` |
| `due_date` | `date` | YES | MUL | `NULL` |
| `due_time` | `varchar(32)` | NO | - | `'12:00'` |
| `owner` | `varchar(128)` | NO | - | `'Hamza'` |
| `notes` | `text` | YES | - | `NULL` |
| `completed_at` | `timestamp` | YES | - | `NULL` |
| `created_at` | `timestamp` | NO | - | `current_timestamp()` |
| `updated_at` | `timestamp` | NO | - | `current_timestamp()` |

---

### 3.15 `general_ledger`
- **Row Count:** 182 rows
- **Column Count:** 16 columns
- **Backend Model:** `backend/src/models/expense.model.js`
- **Backend Controller:** `backend/src/controllers/finance.controller.js`
- **Backend Routes:** `backend/src/routes/finance.routes.js`
- **Frontend Views:** `frontend/src/views/finance/FinanceOverview.vue`
- **Functional Usage:** Double-entry general ledger (Debit/Credit equilibrium journal)

| Column | Data Type | Nullable | Key | Default |
|---|---|---|---|---|
| `id` | `varchar(64)` | NO | PRI | NULL |
| `entry_number` | `varchar(64)` | NO | - | NULL |
| `entry_date` | `date` | NO | MUL | NULL |
| `branch_id` | `varchar(64)` | NO | MUL | `'BR-01'` |
| `branch` | `varchar(128)` | NO | - | `'Peshawar'` |
| `gl_account_code` | `varchar(64)` | NO | MUL | NULL |
| `gl_account_name` | `varchar(128)` | NO | - | NULL |
| `debit` | `decimal(15,2)` | NO | - | `0.00` |
| `credit` | `decimal(15,2)` | NO | - | `0.00` |
| `source_module` | `varchar(64)` | NO | - | `'Finance'` |
| `source_type` | `varchar(64)` | NO | MUL | NULL |
| `source_id` | `varchar(64)` | NO | - | NULL |
| `description` | `varchar(255)` | YES | - | `NULL` |
| `is_reversed` | `tinyint(1)` | NO | - | `0` |
| `reversal_entry_id` | `varchar(64)` | YES | - | `NULL` |
| `created_at` | `timestamp` | NO | - | `current_timestamp()` |

---

### 3.16 `goods_receipts`
- **Row Count:** 3 rows
- **Column Count:** 19 columns
- **Backend Model:** `backend/src/models/procurement.model.js`
- **Backend Controller:** `backend/src/controllers/procurement.controller.js`
- **Backend Routes:** `backend/src/routes/procurement.routes.js`
- **Frontend Views:** `frontend/src/views/procurement/ReceiptDetail.vue, ReceivePurchase.vue`
- **Functional Usage:** Goods Received Notes (GRN), delivery notes, bay inspections, carrier tracking

| Column | Data Type | Nullable | Key | Default |
|---|---|---|---|---|
| `id` | `varchar(64)` | NO | PRI | NULL |
| `receipt_number` | `varchar(64)` | NO | UNI | NULL |
| `po_id` | `varchar(64)` | NO | MUL | NULL |
| `po_number` | `varchar(64)` | NO | - | NULL |
| `supplier_id` | `varchar(64)` | NO | MUL | NULL |
| `supplier` | `varchar(255)` | NO | - | NULL |
| `branch_id` | `varchar(64)` | NO | MUL | `'BR-01'` |
| `branch` | `varchar(128)` | NO | - | `'Peshawar'` |
| `delivery_note` | `varchar(128)` | YES | - | `NULL` |
| `receipt_date` | `date` | NO | - | NULL |
| `received_by` | `varchar(128)` | NO | - | NULL |
| `location` | `varchar(128)` | YES | - | `NULL` |
| `total_received_units` | `int(11)` | NO | - | `0` |
| `total_accepted_units` | `int(11)` | NO | - | `0` |
| `total_damaged_units` | `int(11)` | NO | - | `0` |
| `status` | `varchar(64)` | NO | - | `'Posted'` |
| `notes` | `text` | YES | - | `NULL` |
| `created_at` | `timestamp` | NO | - | `current_timestamp()` |
| `updated_at` | `timestamp` | NO | - | `current_timestamp()` |

---

### 3.17 `goods_receipt_items`
- **Row Count:** 3 rows
- **Column Count:** 15 columns
- **Backend Model:** `backend/src/models/procurement.model.js`
- **Backend Controller:** `backend/src/controllers/procurement.controller.js`
- **Backend Routes:** `backend/src/routes/procurement.routes.js`
- **Frontend Views:** `frontend/src/views/procurement/ReceiptDetail.vue`
- **Functional Usage:** GRN line items, accepted quantity, damaged quantity, discrepancy reasons

| Column | Data Type | Nullable | Key | Default |
|---|---|---|---|---|
| `id` | `int(11)` | NO | PRI | NULL |
| `receipt_id` | `varchar(64)` | NO | MUL | NULL |
| `product_id` | `varchar(64)` | NO | MUL | NULL |
| `product` | `varchar(255)` | NO | - | NULL |
| `sku` | `varchar(128)` | YES | - | `NULL` |
| `ordered_quantity` | `int(11)` | NO | - | `0` |
| `previously_received_quantity` | `int(11)` | NO | - | `0` |
| `current_received_quantity` | `int(11)` | NO | - | `0` |
| `accepted_quantity` | `int(11)` | NO | - | `0` |
| `damaged_quantity` | `int(11)` | NO | - | `0` |
| `short_quantity` | `int(11)` | NO | - | `0` |
| `excess_quantity` | `int(11)` | NO | - | `0` |
| `discrepancy_reason` | `text` | YES | - | `NULL` |
| `unit_cost` | `decimal(15,2)` | NO | - | `0.00` |
| `created_at` | `timestamp` | NO | - | `current_timestamp()` |

---

### 3.18 `inventory_stock`
- **Row Count:** 34 rows
- **Column Count:** 10 columns
- **Backend Model:** `backend/src/models/inventory.model.js`
- **Backend Controller:** `backend/src/controllers/inventory.controller.js`
- **Backend Routes:** `backend/src/routes/inventory.routes.js`
- **Frontend Views:** `frontend/src/views/inventory/StockByProduct.vue, InventoryDashboard.vue`
- **Functional Usage:** Per-product per-branch on_hand, reserved, available, reorder levels

| Column | Data Type | Nullable | Key | Default |
|---|---|---|---|---|
| `id` | `int(11)` | NO | PRI | NULL |
| `product_id` | `varchar(64)` | NO | MUL | NULL |
| `branch_id` | `varchar(64)` | NO | MUL | `'BR-01'` |
| `branch` | `varchar(128)` | NO | - | `'Peshawar'` |
| `on_hand` | `int(11)` | NO | - | `0` |
| `reserved` | `int(11)` | NO | - | `0` |
| `available` | `int(11)` | NO | - | `0` |
| `reorder_level` | `int(11)` | NO | - | `5` |
| `created_at` | `timestamp` | NO | - | `current_timestamp()` |
| `updated_at` | `timestamp` | NO | - | `current_timestamp()` |

---

### 3.19 `invoices`
- **Row Count:** 8 rows
- **Column Count:** 21 columns
- **Backend Model:** `backend/src/models/invoice.model.js`
- **Backend Controller:** `backend/src/controllers/invoice.controller.js`
- **Backend Routes:** `backend/src/routes/invoice.routes.js`
- **Frontend Views:** `frontend/src/views/sales/Invoices.vue, InvoiceDetail.vue`
- **Functional Usage:** Customer commercial sales invoices, tax calculations, payment status

| Column | Data Type | Nullable | Key | Default |
|---|---|---|---|---|
| `id` | `varchar(64)` | NO | PRI | NULL |
| `invoice_number` | `varchar(64)` | NO | UNI | NULL |
| `order_id` | `varchar(64)` | YES | MUL | `NULL` |
| `order_number` | `varchar(64)` | YES | - | `NULL` |
| `customer_id` | `varchar(64)` | NO | MUL | NULL |
| `customer_name` | `varchar(255)` | NO | - | NULL |
| `branch_id` | `varchar(64)` | NO | MUL | `'BR-01'` |
| `branch` | `varchar(128)` | NO | - | `'Peshawar'` |
| `subtotal` | `decimal(15,2)` | NO | - | `0.00` |
| `discount` | `decimal(15,2)` | NO | - | `0.00` |
| `tax` | `decimal(15,2)` | NO | - | `0.00` |
| `total` | `decimal(15,2)` | NO | - | `0.00` |
| `paid_amount` | `decimal(15,2)` | NO | - | `0.00` |
| `outstanding_amount` | `decimal(15,2)` | NO | - | `0.00` |
| `status` | `varchar(64)` | NO | MUL | `'Unpaid'` |
| `status_class` | `varchar(128)` | NO | - | `'bg-[#eff6ff] text-[#2563eb]'` |
| `issued_date` | `date` | YES | - | `NULL` |
| `due_date` | `date` | YES | - | `NULL` |
| `notes` | `text` | YES | - | `NULL` |
| `created_at` | `timestamp` | NO | - | `current_timestamp()` |
| `updated_at` | `timestamp` | NO | - | `current_timestamp()` |

---

### 3.20 `invoice_items`
- **Row Count:** 8 rows
- **Column Count:** 9 columns
- **Backend Model:** `backend/src/models/invoice.model.js`
- **Backend Controller:** `backend/src/controllers/invoice.controller.js`
- **Backend Routes:** `backend/src/routes/invoice.routes.js`
- **Frontend Views:** `frontend/src/views/sales/InvoiceDetail.vue`
- **Functional Usage:** Invoice product lines, unit prices, taxes, line amounts

| Column | Data Type | Nullable | Key | Default |
|---|---|---|---|---|
| `id` | `int(11)` | NO | PRI | NULL |
| `invoice_id` | `varchar(64)` | NO | MUL | NULL |
| `product_id` | `varchar(64)` | YES | - | `NULL` |
| `description` | `varchar(255)` | NO | - | NULL |
| `quantity` | `int(11)` | NO | - | `1` |
| `unit_price` | `decimal(15,2)` | NO | - | `0.00` |
| `subtotal` | `decimal(15,2)` | NO | - | `0.00` |
| `created_at` | `timestamp` | NO | - | `current_timestamp()` |
| `updated_at` | `timestamp` | NO | - | `current_timestamp()` |

---

### 3.21 `leads`
- **Row Count:** 2 rows
- **Column Count:** 23 columns
- **Backend Model:** `backend/src/models/lead.model.js`
- **Backend Controller:** `backend/src/controllers/lead.controller.js`
- **Backend Routes:** `backend/src/routes/lead.routes.js`
- **Frontend Views:** `frontend/src/views/sales/Leads.vue, LeadDetail.vue, CreateLead.vue`
- **Functional Usage:** Prospective customer leads, source channels, pipeline stages

| Column | Data Type | Nullable | Key | Default |
|---|---|---|---|---|
| `id` | `varchar(64)` | NO | PRI | NULL |
| `lead_number` | `varchar(64)` | NO | UNI | NULL |
| `customer_name` | `varchar(255)` | NO | - | NULL |
| `phone` | `varchar(64)` | NO | MUL | NULL |
| `email` | `varchar(191)` | YES | - | `NULL` |
| `city` | `varchar(128)` | YES | - | `NULL` |
| `source` | `varchar(64)` | NO | - | `'Walk-in'` |
| `owner` | `varchar(128)` | NO | - | `'Hamza'` |
| `product_id` | `varchar(64)` | YES | - | `NULL` |
| `product_name` | `varchar(255)` | YES | - | `NULL` |
| `budget` | `varchar(64)` | YES | - | `'PKR 0'` |
| `budget_amount` | `decimal(15,2)` | NO | - | `0.00` |
| `stage` | `varchar(64)` | NO | MUL | `'New'` |
| `status` | `varchar(64)` | NO | - | `'New'` |
| `status_class` | `varchar(128)` | NO | - | `'bg-[#eff6ff] text-[#2563eb]'` |
| `customer_id` | `varchar(64)` | YES | MUL | `NULL` |
| `branch_id` | `varchar(64)` | NO | MUL | `'BR-01'` |
| `branch` | `varchar(128)` | NO | - | `'Peshawar'` |
| `next_follow_up` | `varchar(64)` | YES | - | `NULL` |
| `notes` | `text` | YES | - | `NULL` |
| `created_by` | `varchar(64)` | YES | - | `'System'` |
| `created_at` | `timestamp` | NO | - | `current_timestamp()` |
| `updated_at` | `timestamp` | NO | - | `current_timestamp()` |

---

### 3.22 `orders`
- **Row Count:** 16 rows
- **Column Count:** 26 columns
- **Backend Model:** `backend/src/models/order.model.js`
- **Backend Controller:** `backend/src/controllers/order.controller.js`
- **Backend Routes:** `backend/src/routes/order.routes.js`
- **Frontend Views:** `frontend/src/views/sales/Orders.vue, OrderDetail.vue, CreateSale.vue`
- **Functional Usage:** Sales orders, fulfillment status, branch scoping, financial balances

| Column | Data Type | Nullable | Key | Default |
|---|---|---|---|---|
| `id` | `varchar(64)` | NO | PRI | NULL |
| `order_number` | `varchar(64)` | NO | UNI | NULL |
| `quotation_id` | `varchar(64)` | YES | UNI | `NULL` |
| `customer_id` | `varchar(64)` | NO | MUL | NULL |
| `customer_name` | `varchar(255)` | NO | - | NULL |
| `branch_id` | `varchar(64)` | NO | MUL | `'BR-01'` |
| `branch` | `varchar(128)` | NO | - | `'Peshawar'` |
| `product_id` | `varchar(64)` | YES | - | `NULL` |
| `product` | `varchar(255)` | YES | - | `NULL` |
| `unit_id` | `varchar(64)` | YES | - | `NULL` |
| `unit` | `varchar(128)` | YES | - | `'To be allocated'` |
| `subtotal` | `decimal(15,2)` | NO | - | `0.00` |
| `discount` | `decimal(15,2)` | NO | - | `0.00` |
| `total` | `decimal(15,2)` | NO | - | `0.00` |
| `paid` | `decimal(15,2)` | NO | - | `0.00` |
| `balance` | `decimal(15,2)` | NO | - | `0.00` |
| `payment_method` | `varchar(64)` | YES | - | `'Bank Transfer'` |
| `transaction_id` | `varchar(128)` | YES | - | `NULL` |
| `bank_account` | `varchar(255)` | YES | - | `NULL` |
| `status` | `varchar(64)` | NO | MUL | `'Processing'` |
| `status_class` | `varchar(128)` | NO | - | `'bg-[#eff6ff] text-[#2563eb]'` |
| `delivery` | `varchar(64)` | YES | - | `'Pending'` |
| `salesperson` | `varchar(128)` | YES | - | `'Hamza Ali'` |
| `notes` | `text` | YES | - | `NULL` |
| `created_at` | `timestamp` | NO | - | `current_timestamp()` |
| `updated_at` | `timestamp` | NO | - | `current_timestamp()` |

---

### 3.23 `order_items`
- **Row Count:** 16 rows
- **Column Count:** 11 columns
- **Backend Model:** `backend/src/models/order.model.js`
- **Backend Controller:** `backend/src/controllers/order.controller.js`
- **Backend Routes:** `backend/src/routes/order.routes.js`
- **Frontend Views:** `frontend/src/views/sales/CreateSale.vue, OrderDetail.vue`
- **Functional Usage:** Order product lines, quantities, unit prices, subtotal calculation

| Column | Data Type | Nullable | Key | Default |
|---|---|---|---|---|
| `id` | `int(11)` | NO | PRI | NULL |
| `order_id` | `varchar(64)` | NO | MUL | NULL |
| `product_id` | `varchar(64)` | YES | - | `NULL` |
| `product` | `varchar(255)` | NO | - | NULL |
| `quantity` | `int(11)` | NO | - | `1` |
| `unit_price` | `decimal(15,2)` | NO | - | `0.00` |
| `subtotal` | `decimal(15,2)` | NO | - | `0.00` |
| `warranty` | `varchar(255)` | YES | - | `'1-Year Standard Service'` |
| `notes` | `text` | YES | - | `NULL` |
| `created_at` | `timestamp` | NO | - | `current_timestamp()` |
| `updated_at` | `timestamp` | NO | - | `current_timestamp()` |

---

### 3.24 `payments`
- **Row Count:** 8 rows
- **Column Count:** 18 columns
- **Backend Model:** `backend/src/models/payment.model.js`
- **Backend Controller:** `backend/src/controllers/payment.controller.js`
- **Backend Routes:** `backend/src/routes/payment.routes.js`
- **Frontend Views:** `frontend/src/views/sales/Payments.vue, PaymentDetail.vue`
- **Functional Usage:** Customer payment receipts against invoices, bank/cash reconciliation

| Column | Data Type | Nullable | Key | Default |
|---|---|---|---|---|
| `id` | `varchar(64)` | NO | PRI | NULL |
| `payment_number` | `varchar(64)` | NO | UNI | NULL |
| `invoice_id` | `varchar(64)` | NO | MUL | NULL |
| `order_id` | `varchar(64)` | YES | MUL | `NULL` |
| `customer_id` | `varchar(64)` | NO | MUL | NULL |
| `customer_name` | `varchar(255)` | NO | - | NULL |
| `branch_id` | `varchar(64)` | NO | MUL | `'BR-01'` |
| `branch` | `varchar(128)` | NO | - | `'Peshawar'` |
| `payment_method` | `varchar(64)` | NO | - | `'Bank Transfer'` |
| `amount` | `decimal(15,2)` | NO | - | `0.00` |
| `transaction_ref` | `varchar(128)` | YES | - | `NULL` |
| `bank_account` | `varchar(255)` | YES | - | `NULL` |
| `payment_date` | `date` | YES | - | `NULL` |
| `status` | `varchar(64)` | NO | MUL | `'Reconciled'` |
| `status_class` | `varchar(128)` | NO | - | `'bg-[#dcfce7] text-[#165A31]'` |
| `notes` | `text` | YES | - | `NULL` |
| `created_at` | `timestamp` | NO | - | `current_timestamp()` |
| `updated_at` | `timestamp` | NO | - | `current_timestamp()` |

---

### 3.25 `permissions`
- **Row Count:** 22 rows
- **Column Count:** 6 columns
- **Backend Model:** `backend/src/models/organisation.model.js`
- **Backend Controller:** `backend/src/controllers/organisation.controller.js`
- **Backend Routes:** `backend/src/routes/organisation.routes.js`
- **Frontend Views:** `frontend/src/views/organisation/Roles.vue`
- **Functional Usage:** Granular permissions (sales.read, procurement.write, finance.approve)

| Column | Data Type | Nullable | Key | Default |
|---|---|---|---|---|
| `id` | `varchar(64)` | NO | PRI | NULL |
| `code` | `varchar(64)` | NO | UNI | NULL |
| `name` | `varchar(128)` | NO | - | NULL |
| `module` | `varchar(64)` | NO | - | NULL |
| `description` | `text` | YES | - | `NULL` |
| `created_at` | `timestamp` | NO | - | `current_timestamp()` |

---

### 3.26 `price_rules`
- **Row Count:** 0 rows
- **Column Count:** 19 columns
- **Backend Model:** `backend/src/models/catalogue_extensions.model.js`
- **Backend Controller:** `backend/src/controllers/catalogue_extensions.controller.js`
- **Backend Routes:** `backend/src/routes/product.routes.js`
- **Frontend Views:** `frontend/src/views/catalogue/Pricing.vue, CreatePriceRule.vue, EditPriceRule.vue`
- **Functional Usage:** Discount ceilings, dealer tier margins, promotional pricing rules

| Column | Data Type | Nullable | Key | Default |
|---|---|---|---|---|
| `id` | `varchar(64)` | NO | PRI | NULL |
| `rule_name` | `varchar(255)` | YES | - | `NULL` |
| `product` | `varchar(255)` | NO | MUL | NULL |
| `product_id` | `varchar(64)` | YES | - | `NULL` |
| `selling_price` | `varchar(64)` | NO | - | NULL |
| `minimum` | `varchar(64)` | NO | - | NULL |
| `landed_cost_ref` | `varchar(64)` | YES | - | `NULL` |
| `markup` | `varchar(64)` | YES | - | `NULL` |
| `margin` | `varchar(64)` | YES | - | `NULL` |
| `branch_override` | `varchar(128)` | NO | MUL | `'None'` |
| `effective` | `varchar(64)` | YES | - | `NULL` |
| `discount_percent` | `decimal(5,2)` | NO | - | `0.00` |
| `start_date` | `varchar(64)` | YES | - | `NULL` |
| `end_date` | `varchar(64)` | YES | - | `NULL` |
| `rule_type` | `varchar(64)` | NO | - | `'standard'` |
| `reason` | `text` | YES | - | `NULL` |
| `status` | `varchar(64)` | NO | MUL | `'Active'` |
| `created_at` | `timestamp` | NO | - | `current_timestamp()` |
| `updated_at` | `timestamp` | NO | - | `current_timestamp()` |

---

### 3.27 `products`
- **Row Count:** 10 rows
- **Column Count:** 18 columns
- **Backend Model:** `backend/src/models/product.model.js`
- **Backend Controller:** `backend/src/controllers/product.controller.js`
- **Backend Routes:** `backend/src/routes/product.routes.js`
- **Frontend Views:** `frontend/src/views/catalogue/Products.vue, ProductDetail.vue, CreateProduct.vue, EditProduct.vue`
- **Functional Usage:** EVs, batteries, spare parts catalog, cost price, dealer & selling prices

| Column | Data Type | Nullable | Key | Default |
|---|---|---|---|---|
| `id` | `varchar(64)` | NO | PRI | NULL |
| `name` | `varchar(255)` | NO | - | NULL |
| `model_name` | `varchar(255)` | YES | - | `NULL` |
| `sku` | `varchar(128)` | NO | UNI | NULL |
| `category_id` | `varchar(64)` | NO | MUL | NULL |
| `category` | `varchar(255)` | NO | - | NULL |
| `specs` | `text` | YES | - | `NULL` |
| `selling_price` | `decimal(15,2)` | NO | - | `0.00` |
| `cost_price` | `decimal(15,2)` | NO | - | `0.00` |
| `dealer_price` | `decimal(15,2)` | NO | - | `0.00` |
| `warranty` | `varchar(128)` | YES | - | `NULL` |
| `warranty_months` | `int(11)` | NO | - | `12` |
| `is_serialized` | `tinyint(1)` | NO | - | `1` |
| `reorder_level` | `int(11)` | NO | - | `5` |
| `status` | `varchar(64)` | NO | MUL | `'Active'` |
| `status_class` | `varchar(128)` | NO | - | `'bg-[#dcfce7] text-[#165A31]'` |
| `created_at` | `timestamp` | NO | - | `current_timestamp()` |
| `updated_at` | `timestamp` | NO | - | `current_timestamp()` |

---

### 3.28 `product_requests`
- **Row Count:** 0 rows
- **Column Count:** 16 columns
- **Backend Model:** `backend/src/models/catalogue_extensions.model.js`
- **Backend Controller:** `backend/src/controllers/catalogue_extensions.controller.js`
- **Backend Routes:** `backend/src/routes/product.routes.js`
- **Frontend Views:** `frontend/src/views/catalogue/ProductRequests.vue`
- **Functional Usage:** Branch showroom requests for new products or non-stocked catalogue lines

| Column | Data Type | Nullable | Key | Default |
|---|---|---|---|---|
| `id` | `varchar(64)` | NO | PRI | NULL |
| `product_name` | `varchar(255)` | NO | - | NULL |
| `category` | `varchar(128)` | NO | - | NULL |
| `specifications` | `text` | YES | - | `NULL` |
| `reference` | `varchar(255)` | YES | - | `NULL` |
| `customer_demand` | `varchar(255)` | YES | - | `NULL` |
| `quantity` | `int(11)` | NO | - | `1` |
| `urgency` | `varchar(64)` | NO | - | `'Medium'` |
| `images` | `text` | YES | - | `NULL` |
| `reason` | `text` | NO | - | NULL |
| `status` | `varchar(64)` | NO | MUL | `'Submitted'` |
| `branch_id` | `varchar(64)` | NO | MUL | `'BR-01'` |
| `branch` | `varchar(128)` | NO | - | `'Peshawar'` |
| `requested_by` | `varchar(128)` | YES | - | `NULL` |
| `created_at` | `timestamp` | NO | - | `current_timestamp()` |
| `updated_at` | `timestamp` | NO | - | `current_timestamp()` |

---

### 3.29 `purchase_orders`
- **Row Count:** 7 rows
- **Column Count:** 29 columns
- **Backend Model:** `backend/src/models/procurement.model.js`
- **Backend Controller:** `backend/src/controllers/procurement.controller.js`
- **Backend Routes:** `backend/src/routes/procurement.routes.js`
- **Frontend Views:** `frontend/src/views/procurement/PurchaseOrders.vue, PurchaseOrderDetail.vue, CreatePurchaseOrder.vue`
- **Functional Usage:** Procurement orders to manufacturers, approval status, order tracking

| Column | Data Type | Nullable | Key | Default |
|---|---|---|---|---|
| `id` | `varchar(64)` | NO | PRI | NULL |
| `po_number` | `varchar(64)` | NO | UNI | NULL |
| `supplier_id` | `varchar(64)` | NO | MUL | NULL |
| `supplier` | `varchar(255)` | NO | - | NULL |
| `branch_id` | `varchar(64)` | NO | MUL | `'BR-01'` |
| `branch` | `varchar(128)` | NO | - | `'Peshawar'` |
| `destination` | `varchar(128)` | NO | - | `'Peshawar'` |
| `total_ordered` | `int(11)` | NO | - | `0` |
| `total_received` | `int(11)` | NO | - | `0` |
| `remaining_units` | `int(11)` | NO | - | `0` |
| `subtotal` | `decimal(15,2)` | NO | - | `0.00` |
| `tax` | `decimal(15,2)` | NO | - | `0.00` |
| `amount` | `decimal(15,2)` | NO | - | `0.00` |
| `order_date` | `date` | NO | - | NULL |
| `expected_date` | `date` | YES | - | `NULL` |
| `carrier` | `varchar(128)` | YES | - | `NULL` |
| `tracking` | `varchar(128)` | YES | - | `NULL` |
| `status` | `varchar(64)` | NO | MUL | `'Draft'` |
| `status_class` | `varchar(128)` | NO | - | `'bg-gray-100 text-gray-700'` |
| `match_status` | `varchar(64)` | NO | - | `'—'` |
| `requested_by` | `varchar(128)` | YES | - | `NULL` |
| `approved_by` | `varchar(128)` | YES | - | `NULL` |
| `approved_at` | `timestamp` | YES | - | `NULL` |
| `cancelled_by` | `varchar(128)` | YES | - | `NULL` |
| `cancelled_at` | `timestamp` | YES | - | `NULL` |
| `cancellation_reason` | `text` | YES | - | `NULL` |
| `notes` | `text` | YES | - | `NULL` |
| `created_at` | `timestamp` | NO | - | `current_timestamp()` |
| `updated_at` | `timestamp` | NO | - | `current_timestamp()` |

---

### 3.30 `purchase_order_items`
- **Row Count:** 12 rows
- **Column Count:** 12 columns
- **Backend Model:** `backend/src/models/procurement.model.js`
- **Backend Controller:** `backend/src/controllers/procurement.controller.js`
- **Backend Routes:** `backend/src/routes/procurement.routes.js`
- **Frontend Views:** `frontend/src/views/procurement/PurchaseOrderDetail.vue, CreatePurchaseOrder.vue`
- **Functional Usage:** Line items of purchase orders, ordered & received quantities, unit cost

| Column | Data Type | Nullable | Key | Default |
|---|---|---|---|---|
| `id` | `int(11)` | NO | PRI | NULL |
| `po_id` | `varchar(64)` | NO | MUL | NULL |
| `product_id` | `varchar(64)` | NO | MUL | NULL |
| `product` | `varchar(255)` | NO | - | NULL |
| `sku` | `varchar(128)` | YES | - | `NULL` |
| `ordered_quantity` | `int(11)` | NO | - | `1` |
| `received_quantity` | `int(11)` | NO | - | `0` |
| `unit_cost` | `decimal(15,2)` | NO | - | `0.00` |
| `subtotal` | `decimal(15,2)` | NO | - | `0.00` |
| `is_serialized` | `tinyint(1)` | NO | - | `1` |
| `created_at` | `timestamp` | NO | - | `current_timestamp()` |
| `updated_at` | `timestamp` | NO | - | `current_timestamp()` |

---

### 3.31 `purchase_returns`
- **Row Count:** 0 rows
- **Column Count:** 20 columns
- **Backend Model:** `backend/src/models/procurement.model.js`
- **Backend Controller:** `backend/src/controllers/procurement.controller.js`
- **Backend Routes:** `backend/src/routes/procurement.routes.js`
- **Frontend Views:** `frontend/src/views/procurement/PurchaseReturns.vue, PurchaseReturnDetail.vue, CreatePurchaseReturn.vue`
- **Functional Usage:** Defective/damaged unit returns to suppliers, return authorizations

| Column | Data Type | Nullable | Key | Default |
|---|---|---|---|---|
| `id` | `varchar(64)` | NO | PRI | NULL |
| `return_number` | `varchar(64)` | NO | UNI | NULL |
| `supplier_id` | `varchar(64)` | NO | MUL | NULL |
| `supplier` | `varchar(255)` | NO | - | NULL |
| `po_id` | `varchar(64)` | YES | MUL | `NULL` |
| `po_number` | `varchar(64)` | YES | - | `NULL` |
| `receipt_id` | `varchar(64)` | YES | MUL | `NULL` |
| `receipt_number` | `varchar(64)` | YES | - | `NULL` |
| `branch_id` | `varchar(64)` | NO | MUL | `'BR-01'` |
| `branch` | `varchar(128)` | NO | - | `'Peshawar'` |
| `total_units` | `int(11)` | NO | - | `0` |
| `total_credit_amount` | `decimal(15,2)` | NO | - | `0.00` |
| `reason` | `varchar(255)` | NO | - | NULL |
| `status` | `varchar(64)` | NO | - | `'Draft'` |
| `status_class` | `varchar(128)` | NO | - | `'bg-gray-100 text-gray-700'` |
| `created_by` | `varchar(128)` | NO | - | `'Store Lead'` |
| `approved_by` | `varchar(128)` | YES | - | `NULL` |
| `notes` | `text` | YES | - | `NULL` |
| `created_at` | `timestamp` | NO | - | `current_timestamp()` |
| `updated_at` | `timestamp` | NO | - | `current_timestamp()` |

---

### 3.32 `purchase_return_items`
- **Row Count:** 0 rows
- **Column Count:** 13 columns
- **Backend Model:** `backend/src/models/procurement.model.js`
- **Backend Controller:** `backend/src/controllers/procurement.controller.js`
- **Backend Routes:** `backend/src/routes/procurement.routes.js`
- **Frontend Views:** `frontend/src/views/procurement/PurchaseReturnDetail.vue`
- **Functional Usage:** Specific units and line items included in a purchase return

| Column | Data Type | Nullable | Key | Default |
|---|---|---|---|---|
| `id` | `int(11)` | NO | PRI | NULL |
| `return_id` | `varchar(64)` | NO | MUL | NULL |
| `product_id` | `varchar(64)` | NO | MUL | NULL |
| `product` | `varchar(255)` | NO | - | NULL |
| `sku` | `varchar(128)` | YES | - | `NULL` |
| `unit_id` | `varchar(128)` | YES | - | `NULL` |
| `serial_number` | `varchar(128)` | YES | - | `NULL` |
| `quantity` | `int(11)` | NO | - | `1` |
| `unit_cost` | `decimal(15,2)` | NO | - | `0.00` |
| `subtotal` | `decimal(15,2)` | NO | - | `0.00` |
| `condition` | `varchar(64)` | NO | - | `'Defective'` |
| `is_from_qc_hold` | `tinyint(1)` | NO | - | `0` |
| `created_at` | `timestamp` | NO | - | `current_timestamp()` |

---

### 3.33 `quarantine_records`
- **Row Count:** 1 rows
- **Column Count:** 16 columns
- **Backend Model:** `backend/src/models/inventory_governance.model.js`
- **Backend Controller:** `backend/src/controllers/inventory_governance.controller.js`
- **Backend Routes:** `backend/src/routes/inventory.routes.js`
- **Frontend Views:** `frontend/src/views/inventory/Quarantine.vue, CreateQuarantineRecord.vue`
- **Functional Usage:** Damaged, transit-dented, or defective units quarantined from sale

| Column | Data Type | Nullable | Key | Default |
|---|---|---|---|---|
| `id` | `varchar(64)` | NO | PRI | NULL |
| `unit` | `varchar(128)` | NO | MUL | NULL |
| `product` | `varchar(255)` | NO | - | NULL |
| `defect_type` | `varchar(128)` | YES | - | `NULL` |
| `severity` | `varchar(64)` | YES | - | `NULL` |
| `source` | `varchar(128)` | YES | - | `NULL` |
| `inspector` | `varchar(128)` | YES | - | `NULL` |
| `condition_desc` | `text` | YES | - | `NULL` |
| `status` | `varchar(64)` | NO | MUL | `'Quarantine'` |
| `notes` | `text` | YES | - | `NULL` |
| `evidence` | `text` | YES | - | `NULL` |
| `decision` | `varchar(128)` | YES | - | `NULL` |
| `branch_id` | `varchar(64)` | NO | MUL | `'BR-01'` |
| `branch` | `varchar(128)` | NO | - | `'Peshawar'` |
| `created_at` | `timestamp` | NO | - | `current_timestamp()` |
| `updated_at` | `timestamp` | NO | - | `current_timestamp()` |

---

### 3.34 `quotations`
- **Row Count:** 5 rows
- **Column Count:** 24 columns
- **Backend Model:** `backend/src/models/quotation.model.js`
- **Backend Controller:** `backend/src/controllers/quotation.controller.js`
- **Backend Routes:** `backend/src/routes/quotation.routes.js`
- **Frontend Views:** `frontend/src/views/sales/Quotations.vue, QuotationDetail.vue, CreateQuotation.vue`
- **Functional Usage:** Sales price quotes, tax/discount calculations, order conversion

| Column | Data Type | Nullable | Key | Default |
|---|---|---|---|---|
| `id` | `varchar(64)` | NO | PRI | NULL |
| `quote_number` | `varchar(64)` | NO | UNI | NULL |
| `customer_id` | `varchar(64)` | NO | MUL | NULL |
| `customer_name` | `varchar(255)` | NO | - | NULL |
| `branch_id` | `varchar(64)` | NO | MUL | `'BR-01'` |
| `branch` | `varchar(128)` | NO | - | `'Peshawar'` |
| `product_id` | `varchar(64)` | YES | - | `NULL` |
| `product` | `varchar(255)` | YES | - | `NULL` |
| `quantity` | `varchar(64)` | YES | - | `'1 unit'` |
| `subtotal` | `decimal(15,2)` | NO | - | `0.00` |
| `discount` | `decimal(15,2)` | NO | - | `0.00` |
| `total` | `decimal(15,2)` | NO | - | `0.00` |
| `status` | `varchar(64)` | NO | MUL | `'Draft'` |
| `status_class` | `varchar(128)` | NO | - | `'bg-[#eff6ff] text-[#2563eb]'` |
| `validity` | `varchar(64)` | YES | - | `NULL` |
| `payment_terms` | `varchar(255)` | YES | - | `'100% Advance / Bank Transfer'` |
| `tax_reg_fees` | `varchar(255)` | YES | - | `'Included in Quote'` |
| `delivery_lead_time` | `varchar(255)` | YES | - | `NULL` |
| `notes` | `text` | YES | - | `NULL` |
| `owner` | `varchar(128)` | YES | - | `'Hamza Ali'` |
| `sales_order_id` | `varchar(64)` | YES | - | `NULL` |
| `date` | `varchar(64)` | YES | - | `'Today'` |
| `created_at` | `timestamp` | NO | - | `current_timestamp()` |
| `updated_at` | `timestamp` | NO | - | `current_timestamp()` |

---

### 3.35 `quotation_items`
- **Row Count:** 6 rows
- **Column Count:** 11 columns
- **Backend Model:** `backend/src/models/quotation.model.js`
- **Backend Controller:** `backend/src/controllers/quotation.controller.js`
- **Backend Routes:** `backend/src/routes/quotation.routes.js`
- **Frontend Views:** `frontend/src/views/sales/CreateQuotation.vue, QuotationDetail.vue`
- **Functional Usage:** Quotation product line items, selling prices, warranties

| Column | Data Type | Nullable | Key | Default |
|---|---|---|---|---|
| `id` | `int(11)` | NO | PRI | NULL |
| `quotation_id` | `varchar(64)` | NO | MUL | NULL |
| `product_id` | `varchar(64)` | YES | - | `NULL` |
| `product` | `varchar(255)` | NO | - | NULL |
| `quantity` | `int(11)` | NO | - | `1` |
| `selling_price` | `decimal(15,2)` | NO | - | `0.00` |
| `subtotal` | `decimal(15,2)` | NO | - | `0.00` |
| `warranty` | `varchar(255)` | YES | - | `'1-Year Standard Service'` |
| `notes` | `text` | YES | - | `NULL` |
| `created_at` | `timestamp` | NO | - | `current_timestamp()` |
| `updated_at` | `timestamp` | NO | - | `current_timestamp()` |

---

### 3.36 `repair_jobs`
- **Row Count:** 2 rows
- **Column Count:** 35 columns
- **Backend Model:** `backend/src/models/after_sales.model.js`
- **Backend Controller:** `backend/src/controllers/after_sales.controller.js`
- **Backend Routes:** `backend/src/routes/after_sales.routes.js`
- **Frontend Views:** `frontend/src/views/after-sales/RepairJobs.vue, RepairDetail.vue, CreateRepairJob.vue`
- **Functional Usage:** Workshop repair orders, technician assignments, repair stages

| Column | Data Type | Nullable | Key | Default |
|---|---|---|---|---|
| `id` | `varchar(64)` | NO | PRI | NULL |
| `job_number` | `varchar(64)` | NO | UNI | NULL |
| `case_id` | `varchar(64)` | YES | MUL | `NULL` |
| `branch_id` | `varchar(64)` | NO | MUL | `'BR-01'` |
| `branch` | `varchar(128)` | NO | - | `'Peshawar'` |
| `customer_id` | `varchar(64)` | NO | MUL | NULL |
| `customer_name` | `varchar(255)` | NO | - | NULL |
| `customer_phone` | `varchar(64)` | YES | - | `NULL` |
| `unit_id` | `varchar(64)` | YES | MUL | `NULL` |
| `unit_serial` | `varchar(128)` | YES | - | `NULL` |
| `unit_model` | `varchar(128)` | YES | - | `NULL` |
| `vin` | `varchar(128)` | YES | - | `NULL` |
| `warranty_id` | `varchar(64)` | YES | - | `NULL` |
| `warranty_status` | `varchar(64)` | NO | - | `'Pending Verification'` |
| `technician` | `varchar(128)` | YES | - | `NULL` |
| `diagnosis` | `text` | NO | - | NULL |
| `fault` | `text` | YES | - | `NULL` |
| `decision` | `text` | YES | - | `NULL` |
| `status` | `varchar(64)` | NO | MUL | `'In Progress'` |
| `status_class` | `varchar(128)` | NO | - | `'bg-blue-50 text-blue-700'` |
| `customer_approval_status` | `varchar(64)` | NO | - | `'Pending'` |
| `ready_date` | `varchar(64)` | YES | - | `NULL` |
| `promised_date` | `varchar(64)` | YES | - | `NULL` |
| `parts_cost` | `decimal(15,2)` | NO | - | `0.00` |
| `labour_cost` | `decimal(15,2)` | NO | - | `0.00` |
| `total_cost` | `decimal(15,2)` | NO | - | `0.00` |
| `warranty_coverage` | `decimal(15,2)` | NO | - | `0.00` |
| `customer_payable` | `decimal(15,2)` | NO | - | `0.00` |
| `posted_to_finance` | `tinyint(1)` | NO | - | `0` |
| `invoice_id` | `varchar(64)` | YES | - | `NULL` |
| `work_plan` | `longtext` | YES | - | `NULL` |
| `notes` | `text` | YES | - | `NULL` |
| `completed_at` | `timestamp` | YES | - | `NULL` |
| `created_at` | `timestamp` | NO | - | `current_timestamp()` |
| `updated_at` | `timestamp` | NO | - | `current_timestamp()` |

---

### 3.37 `repair_job_items`
- **Row Count:** 4 rows
- **Column Count:** 14 columns
- **Backend Model:** `backend/src/models/after_sales.model.js`
- **Backend Controller:** `backend/src/controllers/after_sales.controller.js`
- **Backend Routes:** `backend/src/routes/after_sales.routes.js`
- **Frontend Views:** `frontend/src/views/after-sales/RepairDetail.vue`
- **Functional Usage:** Parts consumed and labor operations billable or covered under warranty

| Column | Data Type | Nullable | Key | Default |
|---|---|---|---|---|
| `id` | `int(11)` | NO | PRI | NULL |
| `repair_job_id` | `varchar(64)` | NO | MUL | NULL |
| `item_type` | `enum('part','labour')` | NO | - | `'part'` |
| `product_id` | `varchar(64)` | YES | MUL | `NULL` |
| `item_name` | `varchar(255)` | NO | - | NULL |
| `sku` | `varchar(128)` | YES | - | `NULL` |
| `quantity` | `decimal(10,2)` | NO | - | `1.00` |
| `unit_price` | `decimal(15,2)` | NO | - | `0.00` |
| `subtotal` | `decimal(15,2)` | NO | - | `0.00` |
| `is_warranty_covered` | `tinyint(1)` | NO | - | `0` |
| `coverage_status` | `varchar(64)` | NO | - | `'Paid'` |
| `source` | `varchar(128)` | NO | - | `'Service Stock'` |
| `status` | `varchar(64)` | NO | - | `'Allocated'` |
| `created_at` | `timestamp` | NO | - | `current_timestamp()` |

---

### 3.38 `roles`
- **Row Count:** 4 rows
- **Column Count:** 6 columns
- **Backend Model:** `backend/src/models/organisation.model.js`
- **Backend Controller:** `backend/src/controllers/organisation.controller.js`
- **Backend Routes:** `backend/src/routes/organisation.routes.js`
- **Frontend Views:** `frontend/src/views/organisation/Roles.vue, CreateRole.vue`
- **Functional Usage:** System security roles (Super Admin, Branch Manager, Technician, etc.)

| Column | Data Type | Nullable | Key | Default |
|---|---|---|---|---|
| `id` | `varchar(64)` | NO | PRI | NULL |
| `name` | `varchar(64)` | NO | UNI | NULL |
| `description` | `text` | YES | - | `NULL` |
| `is_system` | `tinyint(1)` | NO | - | `0` |
| `created_at` | `timestamp` | NO | - | `current_timestamp()` |
| `updated_at` | `timestamp` | NO | - | `current_timestamp()` |

---

### 3.39 `role_permissions`
- **Row Count:** 44 rows
- **Column Count:** 2 columns
- **Backend Model:** `backend/src/models/organisation.model.js`
- **Backend Controller:** `backend/src/controllers/organisation.controller.js`
- **Backend Routes:** `backend/src/routes/organisation.routes.js`
- **Frontend Views:** `frontend/src/views/organisation/Roles.vue`
- **Functional Usage:** Role-to-permission mapping junction table

| Column | Data Type | Nullable | Key | Default |
|---|---|---|---|---|
| `role_id` | `varchar(64)` | NO | PRI | NULL |
| `permission_id` | `varchar(64)` | NO | PRI | NULL |

---

### 3.40 `sales_returns`
- **Row Count:** 0 rows
- **Column Count:** 18 columns
- **Backend Model:** `backend/src/models/sales_extensions.model.js`
- **Backend Controller:** `backend/src/controllers/sales_extensions.controller.js`
- **Backend Routes:** `backend/src/routes/sales_extensions.routes.js`
- **Frontend Views:** `frontend/src/views/sales/Returns.vue, CreateReturn.vue`
- **Functional Usage:** Customer vehicle return requests, refunds, inspection disposition

| Column | Data Type | Nullable | Key | Default |
|---|---|---|---|---|
| `id` | `varchar(64)` | NO | PRI | NULL |
| `return_no` | `varchar(64)` | NO | - | NULL |
| `order_no` | `varchar(64)` | NO | MUL | NULL |
| `customer` | `varchar(255)` | NO | - | NULL |
| `customer_id` | `varchar(64)` | YES | - | `NULL` |
| `unit` | `varchar(128)` | NO | - | NULL |
| `unit_id` | `varchar(128)` | YES | - | `NULL` |
| `branch_id` | `varchar(64)` | NO | MUL | `'BR-01'` |
| `branch` | `varchar(128)` | NO | - | `'Peshawar'` |
| `reason` | `varchar(255)` | YES | - | `NULL` |
| `requested` | `varchar(64)` | NO | - | `'Exchange'` |
| `status` | `varchar(64)` | NO | MUL | `'Inspection'` |
| `status_class` | `varchar(128)` | NO | - | `'bg-orange-50 text-orange-700'` |
| `status_color` | `varchar(128)` | NO | - | `'bg-orange-50 text-orange-700'` |
| `refund_amount` | `decimal(15,2)` | NO | - | `0.00` |
| `notes` | `text` | YES | - | `NULL` |
| `created_at` | `timestamp` | NO | - | `current_timestamp()` |
| `updated_at` | `timestamp` | NO | - | `current_timestamp()` |

---

### 3.41 `serialized_units`
- **Row Count:** 4 rows
- **Column Count:** 25 columns
- **Backend Model:** `backend/src/models/inventory.model.js`
- **Backend Controller:** `backend/src/controllers/inventory.controller.js`
- **Backend Routes:** `backend/src/routes/inventory.routes.js`
- **Frontend Views:** `frontend/src/views/inventory/SerializedUnits.vue, UnitDetail.vue`
- **Functional Usage:** Individual vehicle chassis number, VIN, motor number, battery serial

| Column | Data Type | Nullable | Key | Default |
|---|---|---|---|---|
| `id` | `varchar(64)` | NO | PRI | NULL |
| `unit_id` | `varchar(64)` | NO | UNI | NULL |
| `serial_number` | `varchar(128)` | NO | UNI | NULL |
| `chassis_number` | `varchar(128)` | YES | - | `NULL` |
| `vin` | `varchar(128)` | YES | - | `NULL` |
| `motor_number` | `varchar(128)` | YES | - | `NULL` |
| `battery_number` | `varchar(128)` | YES | - | `NULL` |
| `product_id` | `varchar(64)` | NO | MUL | NULL |
| `product_name` | `varchar(255)` | NO | - | NULL |
| `sku` | `varchar(128)` | YES | - | `NULL` |
| `branch_id` | `varchar(64)` | NO | MUL | `'BR-01'` |
| `branch` | `varchar(128)` | NO | - | `'Peshawar'` |
| `location` | `varchar(128)` | NO | - | `'Showroom Floor'` |
| `landed_cost` | `decimal(15,2)` | NO | - | `0.00` |
| `selling_price` | `decimal(15,2)` | NO | - | `0.00` |
| `status` | `varchar(64)` | NO | MUL | `'Available'` |
| `status_class` | `varchar(128)` | NO | - | `'bg-[#dcfce7] text-[#165A31]'` |
| `condition_status` | `varchar(64)` | NO | - | `'Good'` |
| `source_po` | `varchar(64)` | YES | - | `NULL` |
| `receipt_id` | `varchar(64)` | YES | - | `NULL` |
| `order_id` | `varchar(64)` | YES | MUL | `NULL` |
| `customer_id` | `varchar(64)` | YES | - | `NULL` |
| `warranty_expiry` | `date` | YES | - | `NULL` |
| `created_at` | `timestamp` | NO | - | `current_timestamp()` |
| `updated_at` | `timestamp` | NO | - | `current_timestamp()` |

---

### 3.42 `service_cases`
- **Row Count:** 3 rows
- **Column Count:** 34 columns
- **Backend Model:** `backend/src/models/after_sales.model.js`
- **Backend Controller:** `backend/src/controllers/after_sales.controller.js`
- **Backend Routes:** `backend/src/routes/after_sales.routes.js`
- **Frontend Views:** `frontend/src/views/after-sales/WarrantyService.vue, CaseDetail.vue, CreateCase.vue`
- **Functional Usage:** Customer warranty/service tickets, VIN, complaints, diagnostic state

| Column | Data Type | Nullable | Key | Default |
|---|---|---|---|---|
| `id` | `varchar(64)` | NO | PRI | NULL |
| `case_number` | `varchar(64)` | NO | UNI | NULL |
| `branch_id` | `varchar(64)` | NO | MUL | `'BR-01'` |
| `branch` | `varchar(128)` | NO | - | `'Peshawar'` |
| `customer_id` | `varchar(64)` | NO | MUL | NULL |
| `customer_name` | `varchar(255)` | NO | - | NULL |
| `customer_phone` | `varchar(64)` | YES | - | `NULL` |
| `customer_email` | `varchar(191)` | YES | - | `NULL` |
| `customer_address` | `text` | YES | - | `NULL` |
| `unit_id` | `varchar(64)` | YES | MUL | `NULL` |
| `vin` | `varchar(128)` | YES | MUL | `NULL` |
| `unit_serial` | `varchar(128)` | YES | - | `NULL` |
| `unit_model` | `varchar(128)` | YES | - | `NULL` |
| `motor_number` | `varchar(128)` | YES | - | `NULL` |
| `battery_serial` | `varchar(128)` | YES | - | `NULL` |
| `odometer` | `varchar(64)` | YES | - | `NULL` |
| `warranty_id` | `varchar(64)` | YES | - | `NULL` |
| `warranty_status` | `varchar(64)` | NO | - | `'Active'` |
| `warranty_expiry` | `date` | YES | - | `NULL` |
| `category` | `varchar(64)` | NO | - | `'Electrical'` |
| `issue` | `text` | NO | - | NULL |
| `priority` | `varchar(32)` | NO | - | `'Medium'` |
| `status` | `varchar(64)` | NO | MUL | `'Diagnosis'` |
| `status_class` | `varchar(128)` | NO | - | `'bg-[#fef3c7] text-[#b45309]'` |
| `owner` | `varchar(128)` | NO | - | `'Peshawar Service Team'` |
| `assigned_tech` | `varchar(128)` | YES | - | `NULL` |
| `diagnosis_summary` | `text` | YES | - | `NULL` |
| `estimated_completion` | `varchar(64)` | YES | - | `NULL` |
| `total_cost` | `decimal(15,2)` | NO | - | `0.00` |
| `covered_by_warranty` | `decimal(15,2)` | NO | - | `0.00` |
| `customer_payable` | `decimal(15,2)` | NO | - | `0.00` |
| `notes` | `text` | YES | - | `NULL` |
| `created_at` | `timestamp` | NO | - | `current_timestamp()` |
| `updated_at` | `timestamp` | NO | - | `current_timestamp()` |

---

### 3.43 `stock_adjustments`
- **Row Count:** 10 rows
- **Column Count:** 19 columns
- **Backend Model:** `backend/src/models/inventory.model.js`
- **Backend Controller:** `backend/src/controllers/inventory.controller.js`
- **Backend Routes:** `backend/src/routes/inventory.routes.js`
- **Frontend Views:** `frontend/src/views/inventory/StockAdjustments.vue`
- **Functional Usage:** Manual inventory reconciliations, audit variances, write-offs

| Column | Data Type | Nullable | Key | Default |
|---|---|---|---|---|
| `id` | `varchar(64)` | NO | PRI | NULL |
| `adjustment_number` | `varchar(64)` | NO | UNI | NULL |
| `branch_id` | `varchar(64)` | NO | MUL | `'BR-01'` |
| `branch` | `varchar(128)` | NO | - | `'Peshawar'` |
| `product_id` | `varchar(64)` | NO | MUL | NULL |
| `product_name` | `varchar(255)` | NO | - | NULL |
| `unit_id` | `varchar(64)` | YES | - | `NULL` |
| `adjustment_type` | `varchar(64)` | NO | - | `'Quantity'` |
| `old_quantity` | `int(11)` | NO | - | `0` |
| `new_quantity` | `int(11)` | NO | - | `0` |
| `difference` | `int(11)` | NO | - | `0` |
| `reason` | `varchar(255)` | NO | - | NULL |
| `status` | `varchar(64)` | NO | MUL | `'Pending'` |
| `status_class` | `varchar(128)` | NO | - | `'bg-[#fef3c7] text-[#b45309]'` |
| `requested_by` | `varchar(128)` | NO | - | NULL |
| `approved_by` | `varchar(128)` | YES | - | `NULL` |
| `notes` | `text` | YES | - | `NULL` |
| `created_at` | `timestamp` | NO | - | `current_timestamp()` |
| `updated_at` | `timestamp` | NO | - | `current_timestamp()` |

---

### 3.44 `stock_movements`
- **Row Count:** 92 rows
- **Column Count:** 16 columns
- **Backend Model:** `backend/src/models/inventory.model.js`
- **Backend Controller:** `backend/src/controllers/inventory.controller.js`
- **Backend Routes:** `backend/src/routes/inventory.routes.js`
- **Frontend Views:** `frontend/src/views/inventory/StockMovementLedger.vue`
- **Functional Usage:** Immutable audit log of all stock increases, decrements, adjustments

| Column | Data Type | Nullable | Key | Default |
|---|---|---|---|---|
| `id` | `bigint(20)` | NO | PRI | NULL |
| `movement_number` | `varchar(64)` | NO | UNI | NULL |
| `reference_type` | `varchar(64)` | NO | MUL | NULL |
| `reference_id` | `varchar(128)` | NO | - | NULL |
| `product_id` | `varchar(64)` | NO | MUL | NULL |
| `product_name` | `varchar(255)` | NO | - | NULL |
| `unit_id` | `varchar(64)` | YES | - | `NULL` |
| `branch_id` | `varchar(64)` | NO | MUL | NULL |
| `branch` | `varchar(128)` | NO | - | NULL |
| `quantity` | `int(11)` | NO | - | NULL |
| `on_hand_before` | `int(11)` | NO | - | `0` |
| `on_hand_after` | `int(11)` | NO | - | `0` |
| `user` | `varchar(128)` | NO | - | `'System'` |
| `reason` | `varchar(255)` | NO | - | NULL |
| `notes` | `text` | YES | - | `NULL` |
| `created_at` | `timestamp` | NO | MUL | `current_timestamp()` |

---

### 3.45 `stock_requests`
- **Row Count:** 0 rows
- **Column Count:** 17 columns
- **Backend Model:** `backend/src/models/inventory_governance.model.js`
- **Backend Controller:** `backend/src/controllers/inventory_governance.controller.js`
- **Backend Routes:** `backend/src/routes/inventory.routes.js`
- **Frontend Views:** `frontend/src/views/inventory/StockRequests.vue, CreateStockRequest.vue`
- **Functional Usage:** Branch stock replenishment demands submitted to central warehouse

| Column | Data Type | Nullable | Key | Default |
|---|---|---|---|---|
| `id` | `varchar(64)` | NO | PRI | NULL |
| `request_no` | `varchar(64)` | NO | - | NULL |
| `product` | `varchar(255)` | NO | - | NULL |
| `product_id` | `varchar(64)` | YES | - | `NULL` |
| `current_stock` | `varchar(64)` | YES | - | `NULL` |
| `qty` | `int(11)` | NO | - | `1` |
| `units` | `varchar(64)` | YES | - | `NULL` |
| `urgency` | `varchar(64)` | NO | - | `'Medium'` |
| `expected_demand` | `varchar(255)` | YES | - | `NULL` |
| `order_link` | `varchar(128)` | YES | - | `NULL` |
| `reason` | `text` | NO | - | NULL |
| `notes` | `text` | YES | - | `NULL` |
| `status` | `varchar(64)` | NO | MUL | `'Pending'` |
| `branch_id` | `varchar(64)` | NO | MUL | `'BR-01'` |
| `branch` | `varchar(128)` | NO | - | `'Peshawar'` |
| `created_at` | `timestamp` | NO | - | `current_timestamp()` |
| `updated_at` | `timestamp` | NO | - | `current_timestamp()` |

---

### 3.46 `stock_transfers`
- **Row Count:** 11 rows
- **Column Count:** 19 columns
- **Backend Model:** `backend/src/models/inventory.model.js`
- **Backend Controller:** `backend/src/controllers/inventory.controller.js`
- **Backend Routes:** `backend/src/routes/inventory.routes.js`
- **Frontend Views:** `frontend/src/views/inventory/Transfers.vue`
- **Functional Usage:** Inter-branch vehicle and stock transfer requests, dispatch, intake

| Column | Data Type | Nullable | Key | Default |
|---|---|---|---|---|
| `id` | `varchar(64)` | NO | PRI | NULL |
| `transfer_number` | `varchar(64)` | NO | UNI | NULL |
| `from_branch_id` | `varchar(64)` | NO | MUL | NULL |
| `from_branch` | `varchar(128)` | NO | - | NULL |
| `to_branch_id` | `varchar(64)` | NO | MUL | NULL |
| `to_branch` | `varchar(128)` | NO | - | NULL |
| `total_units` | `int(11)` | NO | - | `1` |
| `carrier` | `varchar(255)` | YES | - | `NULL` |
| `status` | `varchar(64)` | NO | MUL | `'Pending'` |
| `status_class` | `varchar(128)` | NO | - | `'bg-[#fef3c7] text-[#b45309]'` |
| `requested_by` | `varchar(128)` | NO | - | NULL |
| `approved_by` | `varchar(128)` | YES | - | `NULL` |
| `dispatched_by` | `varchar(128)` | YES | - | `NULL` |
| `received_by` | `varchar(128)` | YES | - | `NULL` |
| `notes` | `text` | YES | - | `NULL` |
| `dispatched_at` | `timestamp` | YES | - | `NULL` |
| `received_at` | `timestamp` | YES | - | `NULL` |
| `created_at` | `timestamp` | NO | - | `current_timestamp()` |
| `updated_at` | `timestamp` | NO | - | `current_timestamp()` |

---

### 3.47 `stock_transfer_items`
- **Row Count:** 11 rows
- **Column Count:** 10 columns
- **Backend Model:** `backend/src/models/inventory.model.js`
- **Backend Controller:** `backend/src/controllers/inventory.controller.js`
- **Backend Routes:** `backend/src/routes/inventory.routes.js`
- **Frontend Views:** `frontend/src/views/inventory/Transfers.vue`
- **Functional Usage:** Line items and units attached to inter-branch stock transfers

| Column | Data Type | Nullable | Key | Default |
|---|---|---|---|---|
| `id` | `int(11)` | NO | PRI | NULL |
| `transfer_id` | `varchar(64)` | NO | MUL | NULL |
| `product_id` | `varchar(64)` | NO | - | NULL |
| `product_name` | `varchar(255)` | NO | - | NULL |
| `sku` | `varchar(128)` | YES | - | `NULL` |
| `quantity` | `int(11)` | NO | - | `1` |
| `dispatched_qty` | `int(11)` | NO | - | `0` |
| `received_qty` | `int(11)` | NO | - | `0` |
| `unit_ids` | `longtext` | YES | - | `NULL` |
| `created_at` | `timestamp` | NO | - | `current_timestamp()` |

---

### 3.48 `suppliers`
- **Row Count:** 4 rows
- **Column Count:** 18 columns
- **Backend Model:** `backend/src/models/procurement.model.js`
- **Backend Controller:** `backend/src/controllers/procurement.controller.js`
- **Backend Routes:** `backend/src/routes/procurement.routes.js`
- **Frontend Views:** `frontend/src/views/procurement/Suppliers.vue, SupplierDetail.vue, CreateSupplier.vue`
- **Functional Usage:** Vendor master records, contacts, currency, tax IDs, credit terms

| Column | Data Type | Nullable | Key | Default |
|---|---|---|---|---|
| `id` | `varchar(64)` | NO | PRI | NULL |
| `code` | `varchar(64)` | NO | UNI | NULL |
| `name` | `varchar(255)` | NO | UNI | NULL |
| `contact` | `varchar(128)` | NO | - | NULL |
| `phone` | `varchar(64)` | NO | - | NULL |
| `email` | `varchar(191)` | YES | - | `NULL` |
| `address` | `text` | YES | - | `NULL` |
| `city` | `varchar(128)` | YES | - | `NULL` |
| `country` | `varchar(128)` | NO | - | `'Pakistan'` |
| `tax_id` | `varchar(64)` | YES | - | `NULL` |
| `terms` | `varchar(64)` | NO | - | `'Net 30'` |
| `currency` | `varchar(32)` | NO | - | `'PKR'` |
| `status` | `varchar(64)` | NO | MUL | `'Active'` |
| `status_class` | `varchar(128)` | NO | - | `'bg-[#dcfce7] text-[#165A31]'` |
| `on_time` | `varchar(32)` | NO | - | `'100%'` |
| `notes` | `text` | YES | - | `NULL` |
| `created_at` | `timestamp` | NO | - | `current_timestamp()` |
| `updated_at` | `timestamp` | NO | - | `current_timestamp()` |

---

### 3.49 `users`
- **Row Count:** 5 rows
- **Column Count:** 12 columns
- **Backend Model:** `backend/src/models/user.model.js`
- **Backend Controller:** `backend/src/controllers/organisation.controller.js`
- **Backend Routes:** `backend/src/routes/organisation.routes.js`
- **Frontend Views:** `frontend/src/views/organisation/Users.vue, UserDetail.vue, CreateUser.vue, EditUser.vue`
- **Functional Usage:** User accounts, bcrypt password hash, role_id, branch_id assignment

| Column | Data Type | Nullable | Key | Default |
|---|---|---|---|---|
| `id` | `varchar(64)` | NO | PRI | NULL |
| `username` | `varchar(64)` | NO | UNI | NULL |
| `email` | `varchar(191)` | NO | UNI | NULL |
| `password_hash` | `varchar(255)` | NO | - | NULL |
| `name` | `varchar(128)` | NO | - | NULL |
| `role_id` | `varchar(64)` | NO | MUL | NULL |
| `branch_id` | `varchar(64)` | YES | MUL | `NULL` |
| `status` | `varchar(32)` | NO | - | `'Active'` |
| `phone` | `varchar(64)` | YES | - | `NULL` |
| `last_login_at` | `timestamp` | YES | - | `NULL` |
| `created_at` | `timestamp` | NO | - | `current_timestamp()` |
| `updated_at` | `timestamp` | NO | - | `current_timestamp()` |

---

### 3.50 `vendor_bills`
- **Row Count:** 3 rows
- **Column Count:** 18 columns
- **Backend Model:** `backend/src/models/procurement.model.js`
- **Backend Controller:** `backend/src/controllers/procurement.controller.js`
- **Backend Routes:** `backend/src/routes/procurement.routes.js`
- **Frontend Views:** `frontend/src/views/finance/Payables.vue, Procurement/VendorBills.vue`
- **Functional Usage:** Accounts Payable supplier bills generated from GRNs, settlement tracking

| Column | Data Type | Nullable | Key | Default |
|---|---|---|---|---|
| `id` | `varchar(64)` | NO | PRI | NULL |
| `bill_number` | `varchar(64)` | NO | UNI | NULL |
| `po_id` | `varchar(64)` | YES | MUL | `NULL` |
| `po_number` | `varchar(64)` | YES | - | `NULL` |
| `receipt_id` | `varchar(64)` | YES | - | `NULL` |
| `supplier_id` | `varchar(64)` | NO | MUL | NULL |
| `supplier` | `varchar(255)` | NO | - | NULL |
| `branch_id` | `varchar(64)` | NO | - | `'BR-01'` |
| `branch` | `varchar(128)` | NO | - | `'Peshawar'` |
| `amount` | `decimal(15,2)` | NO | - | `0.00` |
| `paid_amount` | `decimal(15,2)` | NO | - | `0.00` |
| `outstanding_amount` | `decimal(15,2)` | NO | - | `0.00` |
| `due_date` | `date` | YES | - | `NULL` |
| `status` | `varchar(64)` | NO | MUL | `'Open'` |
| `status_class` | `varchar(128)` | NO | - | `'bg-[#eff6ff] text-[#2563eb]'` |
| `match_status` | `varchar(64)` | NO | - | `'Matched'` |
| `created_at` | `timestamp` | NO | - | `current_timestamp()` |
| `updated_at` | `timestamp` | NO | - | `current_timestamp()` |

---

### 3.51 `vendor_debit_notes`
- **Row Count:** 0 rows
- **Column Count:** 17 columns
- **Backend Model:** `backend/src/models/procurement.model.js`
- **Backend Controller:** `backend/src/controllers/procurement.controller.js`
- **Backend Routes:** `backend/src/routes/procurement.routes.js`
- **Frontend Views:** `frontend/src/views/finance/Payables.vue, Procurement/Returns`
- **Functional Usage:** Debit notes offsetting Accounts Payable for approved purchase returns

| Column | Data Type | Nullable | Key | Default |
|---|---|---|---|---|
| `id` | `varchar(64)` | NO | PRI | NULL |
| `debit_note_number` | `varchar(64)` | NO | UNI | NULL |
| `return_id` | `varchar(64)` | NO | MUL | NULL |
| `return_number` | `varchar(64)` | NO | - | NULL |
| `supplier_id` | `varchar(64)` | NO | MUL | NULL |
| `supplier` | `varchar(255)` | NO | - | NULL |
| `vendor_bill_id` | `varchar(64)` | YES | MUL | `NULL` |
| `branch_id` | `varchar(64)` | NO | - | `'BR-01'` |
| `branch` | `varchar(128)` | NO | - | `'Peshawar'` |
| `amount` | `decimal(15,2)` | NO | - | `0.00` |
| `applied_amount` | `decimal(15,2)` | NO | - | `0.00` |
| `remaining_credit` | `decimal(15,2)` | NO | - | `0.00` |
| `status` | `varchar(64)` | NO | - | `'Applied'` |
| `status_class` | `varchar(128)` | NO | - | `'bg-[#eff6ff] text-[#2563eb]'` |
| `notes` | `text` | YES | - | `NULL` |
| `created_at` | `timestamp` | NO | - | `current_timestamp()` |
| `updated_at` | `timestamp` | NO | - | `current_timestamp()` |

---

### 3.52 `warranty_claims`
- **Row Count:** 1 rows
- **Column Count:** 20 columns
- **Backend Model:** `backend/src/models/after_sales.model.js`
- **Backend Controller:** `backend/src/controllers/after_sales.controller.js`
- **Backend Routes:** `backend/src/routes/after_sales.routes.js`
- **Frontend Views:** `frontend/src/views/after-sales/WarrantyService.vue`
- **Functional Usage:** OEM warranty validation claims, factory approvals, replacement coverage

| Column | Data Type | Nullable | Key | Default |
|---|---|---|---|---|
| `id` | `varchar(64)` | NO | PRI | NULL |
| `claim_number` | `varchar(64)` | NO | UNI | NULL |
| `case_id` | `varchar(64)` | YES | MUL | `NULL` |
| `repair_job_id` | `varchar(64)` | YES | MUL | `NULL` |
| `branch_id` | `varchar(64)` | NO | MUL | `'BR-01'` |
| `branch` | `varchar(128)` | NO | - | `'Peshawar'` |
| `unit_id` | `varchar(64)` | YES | - | `NULL` |
| `vin` | `varchar(128)` | YES | - | `NULL` |
| `customer_id` | `varchar(64)` | NO | MUL | NULL |
| `customer_name` | `varchar(255)` | NO | - | NULL |
| `claim_date` | `date` | NO | - | NULL |
| `claim_amount` | `decimal(15,2)` | NO | - | `0.00` |
| `coverage_policy` | `varchar(255)` | NO | - | `'Full System 2-Year OEM Warranty'` |
| `status` | `varchar(64)` | NO | MUL | `'Pending'` |
| `decision` | `varchar(255)` | YES | - | `NULL` |
| `authorized_by` | `varchar(128)` | YES | - | `NULL` |
| `rejection_reason` | `text` | YES | - | `NULL` |
| `notes` | `text` | YES | - | `NULL` |
| `created_at` | `timestamp` | NO | - | `current_timestamp()` |
| `updated_at` | `timestamp` | NO | - | `current_timestamp()` |

---


## 4. Multi-Tenant Branch Architecture & Authorization Audit

### 4.1 Server-Side Enforcement Primitives (`backend/src/utils/branchScope.js`)
Multi-tenant security is enforced on the server side using two primary defensive functions:
1. **`getEffectiveBranch(req)`:**
   - Evaluates the authenticated JWT user identity.
   - If the user is Super Admin (`role === 'Super Admin'` or `!user.branch_id`), allows querying enterprise-wide or filtering by specific branch via `?branch_id=...`.
   - If the user is a Branch User (e.g., `PEW-01`), the filter is **strictly forced** to the user's assigned branch (`BR-01`). Client-side overrides via query parameters are completely ignored.
2. **`assertBranchAccess(recordBranchId, req, res)`:**
   - Evaluates record-level ownership on single-resource fetch, update, and delete actions.
   - Prevents cross-branch Insecure Direct Object Reference (IDOR).
   - If a Branch Manager attempts to access a record belonging to another branch, the backend immediately terminates the request with **HTTP 403 Forbidden**.

### 4.2 Live Runtime Verification Results
A live audit script ([`scratch/test_branch_lifecycle.js`](file:///C:/xampp/htdocs/ECodrive/scratch/test_branch_lifecycle.js)) executed the following real operations against `http://127.0.0.1:3000`:

| Check | Action Description | Expected Result | Actual Result | Status |
|---|---|---|---|---|
| 1 | Super Admin Login (`ADMIN`) | HTTP 200 + Signed JWT | HTTP 200, JWT issued, `isSuperAdmin: true` | **PASS** |
| 2 | Branch Manager Login (`PEW-01`) | HTTP 200 + Signed JWT | HTTP 200, JWT issued, `branch_id: BR-01` | **PASS** |
| 3 | Branch Creation via API (`POST /api/v1/organisation/branches`) | HTTP 201 Created | HTTP 201 Created, branch `BR-VAL-99` | **PASS** |
| 4 | MySQL Database Persistence Verification | Record exists in `branches` | Row verified in MySQL `branches` table | **PASS** |
| 5 | Unauthorized Branch Creation by Branch Manager | HTTP 403 Forbidden | HTTP 403 Forbidden ("Insufficient permissions") | **PASS** |
| 6 | Branch Scoping Filter Override Prevention | Orders filtered strictly to `BR-01` | 11 orders returned, 0 foreign orders | **PASS** |
| 7 | Cross-Branch IDOR Protection (`PO-2008` in `BR-02`) | HTTP 403 for PEW-01, HTTP 200 for Super Admin | HTTP 403 for PEW-01; HTTP 200 for Super Admin | **PASS** |
| 8 | Branch Metrics Segmentation (BR-01 vs BR-03) | Segmented inventory counts | BR-01: 10 stock items; BR-03: 7 stock items | **PASS** |
| 9 | Clean Database Teardown | Zero residue | `BR-VAL-99` deleted, 0 rows remaining | **PASS** |

---

## 5. Test Execution & Concurrency Evidence Summary

### 5.1 Automated Test Execution
- **Backend Test Suite (`npm test --prefix backend`):**
  - **19 Test Suites, 54 Sub-Suites, 306 Tests**
  - **Result:** **306 Passed, 0 Failed, Exit Code 0**
  - Execution Time: ~21.7s
- **Frontend Test Suite (`npm test --prefix frontend`):**
  - **39 Test Suites, 494 Tests**
  - **Result:** **494 Passed, 0 Failed, Exit Code 0**
  - Execution Time: ~49.8s
- **Production Build (`npm run build --prefix frontend`):**
  - 1,918 modules transformed
  - Output: `frontend/dist` compiled cleanly with 0 TypeScript/Vite syntax errors
  - Execution Time: ~14.2s

### 5.2 Concurrency & Race Condition Verification
A live stress script ([`scratch/test_concurrency.js`](file:///C:/xampp/htdocs/ECodrive/scratch/test_concurrency.js)) executed **45 simultaneous database write operations** in parallel:
- 15 concurrent expense creations (`EXP-...`)
- 15 concurrent customer registrations (`CUST-...`)
- 15 concurrent follow-up logs (`FOL-...`)
- **Result:** All 45 operations completed with HTTP 201 Created, **zero duplicate key collisions**, and exact single-record deletion in teardown.

### 5.3 Manual & Browser Automation Playbook
Browser testing was executed using `puppeteer-core` driving system Google Chrome (`C:\Program Files\Google\Chrome\Application\chrome.exe`):
- Super Admin login and dashboard mount: **VERIFIED** (Screenshot captured in `scratch/browser_step2_admin_dashboard.png`)
- Purchase Order Creation modal navigation: **VERIFIED** (Screenshot captured in `scratch/browser_step3_po_modal.png`)
- Branch Manager (`PEW-01`) login and dashboard mount: **VERIFIED** (Screenshot captured in `scratch/browser_step4_pew01_dashboard.png`)

---

## 6. Forensic Data Immutability & Teardown Verification

To guarantee that automated tests and runtime audits never corrupt or delete seed business data, a forensic SHA-256 hash snapshot of all pre-existing rows was captured across **15 core operational business tables** before running the full backend test suite, and compared against the post-test state:

| Table Name | Baseline Rows | Pre-Test SHA-256 | Post-Test Rows | Post-Test SHA-256 | Result | Residue |
|---|---|---|---|---|---|---|
| `customers` | 15 | `1d47e80e4757...` | 15 | `1d47e80e4757...` | **MATCH (100% IDENTICAL)** | 0 rows |
| `expenses` | 5 | `4a8b0c9b4ef9...` | 5 | `4a8b0c9b4ef9...` | **MATCH (100% IDENTICAL)** | 0 rows |
| `orders` | 16 | `1208b8fa64b1...` | 16 | `1208b8fa64b1...` | **MATCH (100% IDENTICAL)** | 0 rows |
| `order_items` | 16 | `c429aaa9f2fe...` | 16 | `c429aaa9f2fe...` | **MATCH (100% IDENTICAL)** | 0 rows |
| `quotations` | 5 | `4e9e99ee19c8...` | 5 | `4e9e99ee19c8...` | **MATCH (100% IDENTICAL)** | 0 rows |
| `quotation_items` | 6 | `b7928a67c720...` | 6 | `b7928a67c720...` | **MATCH (100% IDENTICAL)** | 0 rows |
| `invoices` | 8 | `72108e5c3538...` | 8 | `72108e5c3538...` | **MATCH (100% IDENTICAL)** | 0 rows |
| `invoice_items` | 8 | `6446da9173d8...` | 8 | `6446da9173d8...` | **MATCH (100% IDENTICAL)** | 0 rows |
| `payments` | 8 | `88d42692c8ad...` | 8 | `88d42692c8ad...` | **MATCH (100% IDENTICAL)** | 0 rows |
| `suppliers` | 4 | `4f72f1fea63b...` | 4 | `4f72f1fea63b...` | **MATCH (100% IDENTICAL)** | 0 rows |
| `purchase_orders` | 7 | `26dbd9f6ea3a...` | 7 | `26dbd9f6ea3a...` | **MATCH (100% IDENTICAL)** | 0 rows |
| `purchase_order_items` | 12 | `b04ee66a5c46...` | 12 | `b04ee66a5c46...` | **MATCH (100% IDENTICAL)** | 0 rows |
| `products` | 10 | `36ba339e719b...` | 10 | `36ba339e719b...` | **MATCH (100% IDENTICAL)** | 0 rows |
| `inventory_stock` | 34 | `25bcd02dac38...` | 34 | `25bcd02dac38...` | **MATCH (100% IDENTICAL)** | 0 rows |
| `cash_bank_accounts` | 6 | `42abfc68e1ad...` | 6 | `42abfc68e1ad...` | **MATCH (100% IDENTICAL)** | 0 rows |

**Forensic Finding:** Zero existing business records were mutated or deleted. Every test suite cleaned its created records cleanly without leaving residual test data.

---

## 7. Feature Status Matrix

| Module / Capability | Functional Scope | Audit Status | Audit Evidence & Notes |
|---|---|---|---|
| **User Authentication** | Login, JWT generation, bcrypt verification, session profile (`/auth/me`) | **FULLY VERIFIED** | Automated tests pass; manual and Puppeteer browser logins verified. |
| **Role & Permission Control** | Super Admin enterprise access vs Branch Manager restrictions | **FULLY VERIFIED** | 403 Forbidden verified on unprivileged branch creation and cross-branch IDOR. |
| **Branch Multi-Tenancy** | Branch creation, switching, scoping, and isolation | **FULLY VERIFIED** | Live API test verified 9/9 branch checks. |
| **Procurement & Purchasing** | Suppliers, PO creation, Goods Receipts, Vendor Bills, Debit Notes | **FULLY VERIFIED** | CRUD and transaction lifecycle verified across all tables. |
| **Inventory Governance** | Stock balance, serial tracking, adjustments, transfers, quarantine | **FULLY VERIFIED** | Stock movements recorded and reservation releases verified. |
| **Sales & CRM** | Customers, Leads, Follow-ups, Quotations, Orders, Invoices, Delivery | **FULLY VERIFIED** | All endpoints backed by MySQL persistence. Concurrency tested. |
| **Financial Accounting** | Expenses, Cash/Bank accounts, Double-entry General Ledger | **FULLY VERIFIED** | Automated financial tests pass; balance verification verified. |
| **After-Sales & Warranty** | Service cases, Repair jobs, Warranty claims | **FULLY VERIFIED** | CRUD, itemization, and status transitions verified. |
| **Analytics & Reporting** | Branch performance, sales/expense reports, custom reports | **FULLY VERIFIED** | Branch metric segmentation verified. |
| **Password Reset OTP Delivery** | 6-digit OTP generation, identity verification, reset token | **PARTIALLY VERIFIED** | Cryptographically secure OTP is generated and verified in-memory. **External SMTP dispatch is disabled/unconfigured in `.env`**. |
| **Payment Gateway Integration** | Commercial customer payments, reconciliation | **PARTIALLY VERIFIED** | Internal double-entry accounting records payments to MySQL. **External 3rd-party credit card gateway (Stripe/JazzCash) is not live**. |

---

## 8. External Service Dependencies Reality

### 8.1 External SMTP / OTP Delivery
- **Backend Implementation:** [`backend/src/controllers/auth.controller.js`](file:///C:/xampp/htdocs/ECodrive/backend/src/controllers/auth.controller.js) implements:
  - `forgotPassword`: Generates a 6-digit cryptographically secure OTP using `crypto.randomInt(900000)`.
  - `verifyIdentity`: Enforces OTP expiration (10 min) and maximum 5 failed attempts before lockout.
  - `resetPassword`: Requires single-use `tempToken` and hashes new password via `bcrypt`.
- **Infrastructure Reality:** There is no third-party SMTP server (e.g., SendGrid, AWS SES, Mailgun) configured in [`backend/src/config/env.js`](file:///C:/xampp/htdocs/ECodrive/backend/src/config/env.js). In development/test environments, `devOtp` is returned in the API response for automated verification.
- **Classification:** **PARTIALLY VERIFIED (Local Simulation / In-Memory Session)**. External SMTP dispatch cannot be claimed complete without real credentials.

### 8.2 Payment Gateway Integration
- **Backend Implementation:** [`backend/src/controllers/payment.controller.js`](file:///C:/xampp/htdocs/ECodrive/backend/src/controllers/payment.controller.js) and [`backend/src/models/payment.model.js`](file:///C:/xampp/htdocs/ECodrive/backend/src/models/payment.model.js) record commercial transactions into the `payments`, `cash_bank_accounts`, and `general_ledger` tables.
- **Infrastructure Reality:** No external merchant payment gateway (e.g. Stripe, JazzCash, EasyPaisa, 1Link) with webhook listeners or real-time card settlement is configured.
- **Classification:** **PARTIALLY VERIFIED (Internal Ledger / Manual Bank Settlement)**. Automated online payment processing cannot be claimed complete without external provider contracts.

---

## 9. Residual Risks & Production Recommendations

1. **Production Demonstration Credentials:**
   - Default seed accounts (`ADMIN`, `PEW-01`, `ISB-01`, `LHR-01`, `RWP-01`) use the password `password123`.
   - **Recommendation:** Enforce immediate administrative password resets and rotate default passwords before exposing the application to public internet traffic.
2. **Third-Party Integrations:**
   - For public-facing customer self-service, provision a transactional SMTP relay (e.g., AWS SES or SendGrid) and an approved payment gateway API.
3. **Database Backup Strategy:**
   - The MySQL database `ecodrive` currently runs on local XAMPP storage (`C:\xampp\mysql\data`).
   - **Recommendation:** Configure automated daily `mysqldump` backups and binary transaction logging to guard against hardware or disk failure.

---

**Report Certification:**  
This document represents an objective, evidence-based audit of ECodrive ERP. All claims regarding test results, database schemas, and multi-tenant security are substantiated by repeatable automated test scripts and direct database queries.
