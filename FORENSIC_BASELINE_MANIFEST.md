# AJ ECODRIVE — FORENSIC BASELINE MANIFEST

> **Baseline Commit Hash:** `480b57f`  
> **Active Git Branch:** `main`  
> **Timestamp:** `2026-09-30T19:34:08.199Z`  
> **Adversarial Audit Scope:** Full Forensic Investigation of Vue 3 Frontend  

---

## 📊 1. FORENSIC BASELINE METRICS INVENTORY

| Forensic Metric Category | Measured Count | Source Reference | Baseline Status |
| :--- | :---: | :--- | :---: |
| **Total Vue Component Files** | **147 Files** | `src/views/`, `src/layouts/`, `src/components/` | **VERIFIED** |
| **Router Declarations** | **194 Declarations** | `src/router/index.js` | **VERIFIED** |
| **Canonical Navigable Routes** | **189 Routes** | Reconciled paths (5 legacy parameter duplicates) | **VERIFIED** |
| **Raw Interactive DOM Controls** | **583 Controls** | AST/Regex extraction of `<input>`, `<select>`, `<textarea>` | **VERIFIED** |
| **Raw Action Triggers (Buttons/Links)**| **987 Elements** | AST/Regex extraction of `<button>`, `<a>` | **VERIFIED** |
| **Hardcoded Literals & Numeric Fallbacks** | **458 Literals** | Currency strings (e.g. `PKR ...`) & numeric fallbacks (`\|\| number`) | **VERIFIED** |
| **Action Centre Queue Items (Seeded)** | **5 Items** | `store.actionQueue` in `src/store.js` | **VERIFIED** |

---

## 🗄️ 2. RAW MACHINE-READABLE FORENSIC DATASETS

The following raw machine-readable datasets have been extracted directly from the source code into `scratch/forensic/`:
1. `scratch/forensic/routes.json`
2. `scratch/forensic/components.json`
3. `scratch/forensic/controls.json`
4. `scratch/forensic/actions.json`
5. `scratch/forensic/dynamic_values.json`
6. `scratch/forensic/states.json`
7. `scratch/forensic/transitions.json`
8. `scratch/forensic/business_rules.json`
9. `scratch/forensic/interaction_surfaces.json`
10. `scratch/forensic/action_centre.json`
11. `scratch/forensic/data_sources.json`
12. `scratch/forensic/hardcoded_operational_values.json`

---

## 🔬 3. REGRESSION CASES AUDIT MATRIX

| Regression Case | Subject | Layer A (Observed Source Truth) | Layer C (Expected Business Story) | Layer D (Gap & Finding) |
| :--- | :--- | :--- | :--- | :--- |
| **Case A** | `/password-updated` | Maps to `PasswordUpdated.vue` under `AuthLayout.vue` | Maps to `PasswordUpdated.vue` | **FIXED**: Parser boundary bug corrected. |
| **Case B** | `CreatePurchaseOrder` | Route is `procurement/purchase-orders/create`; 12 form fields | Route should match router; fields should match catalogue | **DATA LOSS FOUND**: 4 fields discarded on save (`estimatedFreight`, `paymentTerms`, `documents`, `notes`). |
| **Case C** | `CreateBranch` | 14 form fields with manager dropdown select | Manager assignment with facility parameters | **HALLUCINATION RESOLVED**: `Manager CNIC` does not exist in form. |
| **Case D** | System RBAC Roles | Exactly 2 roles (`Super Admin`, `Branch Manager`) | Dealership operations | **RESOLVED**: Personas (Cashier, Service Advisor) are contextual personas. |
| **Case E** | PDI Checklist Count | Exactly 5 verification checkboxes | 18-point automotive PDI checklist | **GAP CLASSIFIED**: Code has 5 checks; 18-point is expected business rule. |
| **Case F** | Cryptographic Audit | Standard in-memory structured Audit Log | Tamper-evident cryptographic ledger | **GAP CLASSIFIED**: In-memory audit log in code; cryptographic hash chaining is future backend spec. |

---

## 🏁 4. BASELINE GATE CONCLUSION
The baseline manifest is frozen at commit `480b57f`. Adversarial findings are cataloged in `scratch/forensic/` for systematic remediation.
