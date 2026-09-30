# AJ EcoDrive — Branch Manager DAP Mapping vs Source Discrepancies Report

> **Specification:** `BRANCH_MANAGER_AND_SYSTEM_FULL_UI_TREE_MAPPING.md`  
> **Source Grounding:** Actual Vue 3 SFC Components (`src/views/`)  
> **Guiding Principle:** The DAP adapts to the real application. The application is NEVER artificially distorted merely to make a theoretical mapping pass.

---

## 📋 Executive Discrepancy Summary

This document transparently records every discrepancy discovered between the initial architectural UI tree mapping and the actual production Vue components. Rather than fabricating UI or silently altering business logic to artificially force a 100% match, each discrepancy is categorized, grounded in source code, and resolved cleanly through architectural DAP adaptation or formally logged for product reconciliation.

| Discrepancy Category | Discrepancy Type | Total Discrepancies Logged | DAP Engine Resolution | Product Change Required? |
| :--- | :--- | :---: | :--- | :---: |
| **Dashboard Tables Absence** | `TABLE_MISMATCH` | 5 | Checkpoint marked as `dapStatus: 'blocked'` awaiting product feature decision. No fake tables injected into production views. | **YES (Design Choice)** |
| **Control Tag Discrepancies** | `FIELD_TYPE_MISMATCH` | 3 | DAP binds directly to actual `<input type="text">` controls in SFC template rather than assumed `<select>` tags. | **NO (DAP Adapts)** |
| **Lazy Tab Rendering (`v-if`)** | `DYNAMIC_STATE_MISMATCH` | 6 | DAP engine implements stateful prerequisite tab navigation (clicks real tab button, waits for Vue `v-if` panel mount, then spotlights target). Inactive panels remain omitted from initial DOM. | **NO (DAP Adapts)** |
| **Parameterized Entity Lookups** | `DYNAMIC_STATE_MISMATCH` | 5 | DAP testing infrastructure provides real fixture IDs (`PO-2048`, `CUST-101`, `RJ-188`, `UNIT-101`, `TR-101`). Production component lookup logic is strictly preserved with zero artificial record fallbacks. | **NO (Test Fixture)** |
| **Read-Only / Computed Labels** | `LABEL_MISMATCH` | 2 | DAP classifies elements as read-only computed displays and checks actual rendered text rather than treating them as editable inputs. | **NO (DAP Adapts)** |

---

## 🔍 Detailed Discrepancy Ledger

| Route | Mapping Specification | Actual Source Reality | Discrepancy Type | DAP Engine Resolution | Product Change Required? |
| :--- | :--- | :--- | :---: | :--- | :---: |
| `/dashboard` | Mapped "Command Queue Table" in overview | `src/views/dashboard/ActionCentre.vue` has the table on `/dashboard/action-centre`; `/dashboard` overview provides KPI summary cards | `TABLE_MISMATCH` | Logged as mapping discrepancy. Authentic view provides KPI cards. | **Product Decision** |
| `/sales/dashboard` | Mapped "Top Products Table" and "Collections & Outstanding Table" in Branch Manager view | `src/views/sales/SalesDashboard.vue` provides 4 KPI blocks and quick action cards for BM; detailed tables reside in Super Admin view and dedicated report routes (`/sales/orders`) | `TABLE_MISMATCH` | Reverted test-injected tables. Logged as mapping discrepancy. DAP skips nonexistent tables in BM flow. | **Product Decision** (Whether BM dashboard should embed tables) |
| `/inventory/dashboard` | Mapped "Aged & Low Stock Table" and "Inbound Pipeline Table" in Branch Manager view | `src/views/inventory/InventoryDashboard.vue` provides KPI summaries and category valuation; detailed records reside in `/inventory/serialized-units` | `TABLE_MISMATCH` | Reverted test-injected tables. Logged as mapping discrepancy. | **Product Decision** |
| `/analytics/reports-hub` | Mapped "Saved & Recent Reports Table" in Branch Manager view | `src/views/analytics/ReportsHub.vue` provides KPI cards and report template builder; tabular report data is rendered in `/analytics/reports/build` | `TABLE_MISMATCH` | Reverted test-injected tables. Logged as mapping discrepancy. | **Product Decision** |
| `/procurement/purchase-orders/create` | Mapped `form.supplier` as `<select>` dropdown | `src/views/procurement/CreatePurchaseOrder.vue` renders `<input data-tour="po-supplier" v-model="form.supplier" type="text" />` | `FIELD_TYPE_MISMATCH` | DAP binds to actual `<input>` tag, listens for native `input` events, and verifies v-model reactivity. | **NO** |
| `/procurement/purchase-orders/create` | Mapped `form.shipmentMethod` as `<select>` dropdown | `src/views/procurement/CreatePurchaseOrder.vue` renders text `<input data-tour="po-shipment-method" v-model="form.shipmentMethod" type="text" />` | `FIELD_TYPE_MISMATCH` | DAP binds to actual `<input>` tag. | **NO** |
| `/procurement/purchase-orders/create` | Mapped `form.paymentTerms` as `<select>` dropdown | `src/views/procurement/CreatePurchaseOrder.vue` renders text `<input data-tour="po-payment-terms" v-model="form.paymentTerms" type="text" />` | `FIELD_TYPE_MISMATCH` | DAP binds to actual `<input>` tag. | **NO** |
| `/procurement/suppliers/:id` | Mapped all tabs (Overview, Contacts, Products, POs, Receipts, Bills, Returns, Performance, Documents, Activity) as immediately visible | Tabs are conditionally mounted with `v-if="activeTab === '...'"` in `SupplierDetail.vue`. Inactive tab DOM elements do not exist until tab is clicked | `DYNAMIC_STATE_MISMATCH` | Reverted `v-show` distortions. DAP uses two-step interaction: Step N clicks tab button; Step N+1 waits for Vue `v-if` render and spotlights panel control. | **NO** |
| `/sales/customers/:id` | Mapped all tabs (Overview, Orders, Quotes, Invoices, Payments, Deliveries, Units, Leads, Notes) as immediately visible | Tabs are conditionally mounted with `v-if="activeTab === '...'"` in `CustomerDetail.vue`. | `DYNAMIC_STATE_MISMATCH` | Reverted `v-show` distortions. DAP executes stateful prerequisite tab click. | **NO** |
| `/communication/conversations/:id` | Mapped Attachments, Linked Records, and Participants as immediately visible | Tabs are conditionally mounted with `v-if="currentTab === '...'"` in `ConversationDetail.vue`. | `DYNAMIC_STATE_MISMATCH` | Reverted `v-show` distortions. DAP clicks tab before inspecting contents. | **NO** |
| `/inventory/transfers/:id` | Mapped Items & Units table as immediately visible | Table is conditionally mounted with `v-if="branchCurrentTab === 'Items & Units'"` in `TransferDetail.vue`. | `DYNAMIC_STATE_MISMATCH` | Reverted `v-show` distortions. DAP clicks "Items & Units" tab first. | **NO** |
| `/catalogue/products/:id` | Mapped all 11 tabs as immediately visible | Tabs are conditionally mounted with `v-if` / `v-else-if` in `ProductDetail.vue`. | `DYNAMIC_STATE_MISMATCH` | Reverted `v-show` distortions. DAP clicks target tab first. | **NO** |
| `/after-sales/repairs/:id` | Mapped all 9 tabs as immediately visible | Tabs are conditionally mounted with `v-if="activeTab === '...'"` in `RepairDetail.vue`. | `DYNAMIC_STATE_MISMATCH` | Reverted `v-show` distortions. DAP clicks target tab first. | **NO** |
| `/after-sales/repairs/:id` | Assumed route renders regardless of parameter state | Component requires valid parameter ID (`route.params.id`); returns null if nonexistent | `DYNAMIC_STATE_MISMATCH` | Removed test fallback `|| store.repairs?.[0]`. Test fixtures supply valid ID `RJ-188`. | **NO** |
| `/inventory/serialized-units/:id` | Assumed route renders regardless of parameter state | Component requires valid VIN / Unit ID; returns null if nonexistent | `DYNAMIC_STATE_MISMATCH` | Test fixtures supply valid ID `UNIT-101` / `DS11-01004`. | **NO** |
| `/sales/customers/:id` | Assumed route renders regardless of parameter state | Component requires valid Customer ID; returns null if nonexistent | `DYNAMIC_STATE_MISMATCH` | Test fixtures supply valid ID `CUST-101` / `CUST-163`. | **NO** |
| `/procurement/purchase-orders/:id` | Assumed route renders regardless of parameter state | Component requires valid PO ID; returns null if nonexistent | `DYNAMIC_STATE_MISMATCH` | Test fixtures supply valid ID `PO-2048`. | **NO** |
| `/inventory/transfers/:id` | Assumed route renders regardless of parameter state | Component requires valid Transfer ID; returns null if nonexistent | `DYNAMIC_STATE_MISMATCH` | Test fixtures supply valid ID `TR-101`. | **NO** |

---

## 🛡️ Production Behavior Integrity Guarantee

All test-driven product distortions have been audited and completely eliminated:
- **`v-show` Tab Distortions:** REVERTED (Original `v-if` restored across all 6 detail views).
- **Injected Product Tables:** REVERTED (Removed from `SalesDashboard.vue`, `InventoryDashboard.vue`, and `ReportsHub.vue`).
- **Test-Only Entity Fallbacks:** REVERTED (Removed `store.repairs?.[0]` fallback from `RepairDetail.vue`).
- **Total Test-Induced Production Behavior Changes Remaining:** **0**
