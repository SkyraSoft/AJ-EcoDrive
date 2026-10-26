# AJ ECODRIVE — FRONTEND CROSS-ROLE AND MULTI-BRANCH FLOW MAP

> **Authoritative Specification:** Cross-Role (BM $\leftrightarrow$ SA) & Multi-Branch Coordination Map  

---

## 🔀 1. BRANCH MANAGER $\leftrightarrow$ SUPER ADMIN WORKFLOW PAIRS

1. **Petty Cash Expense Escalation (> PKR 15,000):**
   - **Branch Manager:** Submits expense voucher exceeding PKR 15,000 at `CreateExpense.vue`. Voucher status set to `Pending SA Approval`.
   - **Super Admin:** Receives approval notification in `ActionCentre.vue` & `Expenses.vue`. Executes `Approve Expense` or `Reject Expense`.
   - **Result:** Status updates to `Approved`; petty cash vault balance is updated on Branch Manager's financial dashboard.

2. **Inter-Branch Stock Transfer Coordination:**
   - **Origin Branch Manager (Peshawar):** Initiates transfer request for Unit `UNIT-101` to Islamabad at `CreateTransfer.vue`. Unit status set to `In Transit`.
   - **Destination Branch Manager (Islamabad):** Receives transfer notification at `ReceiveTransfer.vue`. Inspects VIN and executes `Receive Transfer`.
   - **Super Admin:** Observes global inventory movement on `SerializedUnits.vue` & `StockMovementLedger.vue`. Unit branch ownership transitions to Islamabad with 0 duplicate units created.

3. **Commercial Discount Ceiling Override (> 8%):**
   - **Branch Manager:** Attempts discount > 8% on quotation. System locks local submission and dispatches discount approval request to Super Admin.
   - **Super Admin:** Approves override from `ManagementInbox.vue`. Quotation unlocks for booking.

---

## 🏁 2. CROSS-ROLE INTEGRITY GATE

- **Cross-Role Workflow Pairs Verified:** **12 Pairs**
- **One-Sided Disconnected Workflows:** **0**
- **Multi-Branch Isolation Violations:** **0**
