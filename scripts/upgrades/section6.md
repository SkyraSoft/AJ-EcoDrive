# SECTION VI: CASH PROTECTION, EXPENSES & DAY-END RECONCILIATION

---

# PART 23: Showroom Operating Expenses & Petty Cash (Q315 – Q328)

### Q315: How are Showroom Operating Expenses (OPEX) managed in AJ EcoDrive?
**Answer:** Showroom operating expenses are managed via the **Showroom Expenses & Petty Cash Ledger**:
* 📍 **System Navigation Path:** `Top Nav` &rarr; `Quick Actions ⌄` &rarr; `Log Expense Voucher` (`CreateExpenseModal`) OR `Sidebar: Finance & Accounts` &rarr; `Showroom Expenses` (`/finance/expenses`) &rarr; Click `+ Add Expense Voucher`
* **Core Principle:** Governs everyday showroom operating costs (customer tea/coffee, showroom cleaning supplies, generator fuel during power load-shedding, minor electrical repairs) with automated petty cash reconciliation and CFO approval ceilings.

---

### Q316: What is the PKR 15,000 Petty Cash Discretionary Threshold Rule?
**Answer:** Strict expenditure governance boundary:
* 📍 **System Navigation Path:** `CreateExpenseModal` &rarr; `Expense Amount Validation`
* **Expenses &le; PKR 15,000:** Branch Manager has discretionary approval authority. The expense is paid immediately from the cashier's petty cash float and logged with an attached photo receipt.
* **Expenses > PKR 15,000:** The system automatically locks local cash disbursement and creates an Action Centre escalation (**Flow 3: `ACT-EXP-XXXX`**) requiring Head Office CFO clearance before payment can be issued.

---

### Q317: Modal Guide — What is the CreateExpenseModal (CreateExpense.vue) and what are its exact fields?
**Answer:** The `CreateExpenseModal` logs operational expenditures and routes approvals:
* 📍 **System Navigation Path:** `Top Nav` &rarr; `Quick Actions ⌄` &rarr; `Log Expense Voucher` (`CreateExpenseModal`)
* **Exact Form Fields:**
  * **Expense Category** *(Select, Required)*:
    * `Staff Tea, Refreshments & Hospitality`
    * `Showroom Cleaning & Janitorial Supplies`
    * `Generator Fuel & Load-Shedding Maintenance`
    * `Showroom Electricity / Internet / Utility Bills`
    * `Minor Facility & Showroom Tile Repairs`
    * `Local Marketing & Outdoor Banners`
    * `Emergency Workshop Consumables`
  * **Expense Title / Short Description** *(Text, Required)*: E.g., *Generator Diesel 20L for Load-Shedding Backup*.
  * **Amount in Pakistani Rupees (PKR)** *(Numeric, Required)*: Exact bill amount.
  * **Payment Source** *(Select)*: `Branch Petty Cash Drawer Float` or `Head Office Bank Transfer`.
  * **Vendor / Shop Name** *(Text, Required)*: Name of vendor.
  * **Vendor NTN / CNIC** *(Text, Optional)*: Tax identifier.
  * **Receipt / Invoice Photo Attachment** *(File Upload, Mandatory)*: High-res receipt image.
  * **Authorizing Branch Manager PIN** *(Security PIN)*: Managerial signature.

---

### Q318: Why is attaching a photo receipt mandatory for every expense entry?
**Answer:** Complete tax audit and financial substantiation:
* 📍 **System Navigation Path:** `CreateExpenseModal` &rarr; `Receipt Attachment Field`
* Prevents fictitious expense logging. Internal auditors and external FBR tax auditors inspect attached receipt photos directly from the financial reports.

---

### Q319: How does the system handle high-value utility bills (e.g. Electricity Bill of PKR 45,000)?
**Answer:** Automated Flow 3 CFO Routing:
* 📍 **System Navigation Path:** `CreateExpenseModal` &rarr; Enter Amount `45000` &rarr; Submit
* The system displays an informative banner: *"Amount exceeds PKR 15,000 limit — Routed to Head Office CFO for Bank Clearance"*.
* CFO reviews bill image in Action Centre (`ACT-EXP-XXXX`) and initiates direct online bank transfer to WAPDA / K-Electric, keeping showroom cash float intact.

---

### Q320: How is the Petty Cash Float replenished when cash runs low?
**Answer:** Petty Cash Top-Up Requisition:
* 📍 **System Navigation Path:** `Sidebar: Finance & Accounts` &rarr; `Petty Cash Float` &rarr; Click **"Request Float Top-Up"**
* When available petty cash drops below **PKR 5,000**, the manager submits a summary reconciliation of all paid vouchers. Head Office finance transfers PKR 20,000 to replenish the branch float back to its standard ceiling.

---

### Q321: Can a salesperson submit an expense voucher?
**Answer:** Sales staff can enter expense drafts; only Branch Managers can authorize payment:
* 📍 **System Navigation Path:** `CreateExpenseModal` &rarr; `Manager Authorization PIN`
* Cashier or sales rep enters the expense draft, but cash is only disbursed when the Branch Manager verifies the physical paper bill and enters their security PIN.

---

### Q322: How does the system prevent duplicate expense claims?
**Answer:** Automated Receipt Hash & Amount Scanning:
* 📍 **System Navigation Path:** `CreateExpenseModal` &rarr; Duplicate Detection Engine
* If the same receipt photo or matching vendor bill number is uploaded twice within 30 days, the system flags a warning: *"POSSIBLE DUPLICATE: Matching invoice found for PKR [Amount] on [Date]"*.

---

### Q323: What accounting ledger accounts are debited when an expense is posted?
**Answer:** Standard Double-Entry General Ledger Accounting:
* 📍 **System Navigation Path:** `Sidebar: Finance & Accounts` &rarr; `General Ledger Entries` (`/finance/general-ledger`)
* `Debit: Operational Expense Account (e.g., Facility Utilities)`
* `Credit: Branch Cash Drawer Float Account (Asset)`

---

### Q324: Can an approved expense voucher be modified or deleted?
**Answer:** **No. Posted expense vouchers are legally permanent.**
* 📍 **System Navigation Path:** Expense Audit Trail
* To correct an error, the manager must submit an Expense Correction Reversal with written explanation, preserving complete forensic auditability.

---

### Q325: How does the system track monthly showroom operating budget utilization?
**Answer:** Monthly OPEX Budget vs Actual Progress Bar:
* 📍 **System Navigation Path:** `Sidebar: Finance & Accounts` &rarr; `Showroom Expenses` &rarr; `Monthly Budget Widget`
* Displays total monthly showroom OPEX budget (e.g., *PKR 75,000/month*), current spend (*PKR 42,300*), and remaining budget (*56.4% utilized*).

---

### Q326: What happens if an expense is incurred during an internet outage?
**Answer:** Offline Expense Logging with Outbox Queue:
* 📍 **System Navigation Path:** Local Desktop Application &rarr; `Log Expense Voucher`
* Expense is recorded in local SQLite database, deducting from local petty cash counter. Syncs to Head Office automatically upon internet reconnection.

---

### Q327: Where can Branch Managers print the Monthly Petty Cash Expense Sheet?
**Answer:** The **Monthly Petty Cash Summary Voucher**:
* 📍 **System Navigation Path:** `Sidebar: Finance & Accounts` &rarr; `Showroom Expenses` &rarr; Click **"Print Monthly OPEX Sheet"**
* Generates a consolidated PDF statement listing every voucher number, date, vendor, category, amount, and manager signature for corporate accounting filing.

---

### Q328: What is the Expense-to-Revenue Ratio KPI?
**Answer:** Operational cost efficiency benchmark:
* 📍 **System Navigation Path:** `Sidebar: Analytics & Reports` &rarr; `Financial Efficiency KPIs`
* Measures showroom OPEX as a percentage of total showroom sales revenue (Target: &le; 2.2% across dealership network).

---
[Back to Top / Navigation Index](#dealership-owners-quick-navigation--executive-index)

---

# PART 24: Day-End Closing Reconciliation (Daily Z-Report) (Q329 – Q342)

### Q329: What is Day-End Closing Reconciliation (Daily Z-Report) in AJ EcoDrive?
**Answer:** Day-End Closing Reconciliation is the mandatory 10-step financial and operational audit conducted by the Branch Manager and Lead Cashier at 07:00 PM before locking showroom doors:
* 📍 **System Navigation Path:** `Sidebar: Finance & Accounts` &rarr; `Day-End Closing (Z-Report)` (`/finance/day-end-closing`) &rarr; Click `+ Start Daily Z-Report`
* **Core Objective:** Reconciles every single Rupee collected in the cashier safe against system sales invoices, audits remaining physical cash float, verifies credit card terminal batch totals, and generates an immutable, signed **Daily Z-Report**.

---

### Q330: What is the difference between an X-Report and a Z-Report?
**Answer:** Mid-day inspection vs. Day-end permanent closing:
* 📍 **System Navigation Path:** `Sidebar: Finance & Accounts` &rarr; `Cash Registers`
* **X-Report (Interim Reading):** Real-time snapshot of sales and cash collections taken anytime during the day (e.g., at 02:00 PM shift change). Does not close or reset registers.
* **Z-Report (Final End-of-Day Closing):** Official day-end closing report that reconciles all payment tenders, locks the business day's sales ledger, and resets daily transaction counters.

---

### Q331: What is the 5-Step Physical Currency Denomination Breakdown during Z-Closing?
**Answer:** Detailed physical cash note counting:
* 📍 **System Navigation Path:** `Day-End Closing Screen` &rarr; `Physical Cash Denomination Counter`

```
┌────────────────────────────────────────────────────────────────────────┐
│                   PHYSICAL CASH DENOMINATION COUNT                     │
├────────────────────────────────────────────────────────────────────────┤
│  PKR 5,000 Notes:  [Count: 42] ──► Total: PKR 210,000                  │
│  PKR 1,000 Notes:  [Count: 35] ──► Total: PKR  35,000                  │
│  PKR   500 Notes:  [Count: 18] ──► Total: PKR   9,000                  │
│  PKR   100 Notes:  [Count: 25] ──► Total: PKR   2,500                  │
│  PKR    50 Notes:  [Count: 10] ──► Total: PKR     500                  │
├────────────────────────────────────────────────────────────────────────┤
│  TOTAL PHYSICAL CASH IN SAFE:      PKR 257,000                         │
└────────────────────────────────────────────────────────────────────────┘
```

---

### Q332: How does the system compare Physical Cash against System Expected Cash?
**Answer:** Automated Cash Variance Engine:
* 📍 **System Navigation Path:** `Day-End Closing Screen` &rarr; `Cash Reconciliation Table`
* **Formula:** `[Opening Float]` + `[Cash Sales Collected]` + `[Cash Advance Deposits]` - `[Cash Petty OPEX Paid]` = **`System Expected Cash`**.
* The system computes `Variance = Physical Cash Count - System Expected Cash`:
  * **Zero Variance (PKR 0.00):** Perfect reconciliation &rarr; Green Checkmark.
  * **Cash Shortage (- PKR):** Red Alert &rarr; Mandatory shortage explanation note.
  * **Cash Overage (+ PKR):** Blue Alert &rarr; Mandatory overage investigation note.

---

### Q333: What happens if a Cash Shortage exists during Z-Closing?
**Answer:** Mandatory Audit Variance Protocol:
* 📍 **System Navigation Path:** `Day-End Closing Screen` &rarr; `Variance Justification Section`
* Cashier cannot alter past invoices. The manager must document the exact shortage amount (e.g., *- PKR 1,000*) with written cashier statement.
* Generates an Action Centre Incident Report (**Flow 5: `ACT-GOV-XXXX`**) for Head Office CFO review.

---

### Q334: How are Bank Card (POS Terminal) batches reconciled during Z-Closing?
**Answer:** Bank POS Terminal Settlement Cross-Check:
* 📍 **System Navigation Path:** `Day-End Closing Screen` &rarr; `Card Terminal Batch Section`
* Cashier prints the physical settlement summary slip from the bank credit card machine (HBL / Alfalah terminal) and enters total card settlement amount (PKR), attaching a photo of the thermal batch slip.

---

### Q335: How are Online Bank IBFT collections reconciled during Z-Closing?
**Answer:** Online Bank Statement Verification:
* 📍 **System Navigation Path:** `Day-End Closing Screen` &rarr; `Online IBFT Reconciliation Tab`
* Cross-checks each 12-digit bank UTR reference recorded in the system against the official online banking corporate statement, verifying 100% fund clearance into the dealership bank account.

---

### Q336: What is the Safe Cash Drop vs. Next-Day Opening Float Split?
**Answer:** Segregation of Revenue Cash vs. Petty Float:
* 📍 **System Navigation Path:** `Day-End Closing Screen` &rarr; `Cash Allocation Section`
* Total Physical Cash: `PKR 257,000`
  * **Next-Day Opening Float Retained:** `PKR 15,000` (Locked in safe till for tomorrow morning).
  * **Bank Cash Drop Deposit:** `PKR 242,000` (Sealed in bank tamper-evident bag for morning bank branch deposit).

---

### Q337: What is the Daily Z-Report printout, and what data does it contain?
**Answer:** The permanent legal and financial closing document:
* 📍 **System Navigation Path:** `Day-End Closing Screen` &rarr; Click **"Generate & Print Z-Report"**
* **Summary Sections:**
  1. Branch Details & Business Date.
  2. Total Gross Sales Revenue (PKR) & Total Electric Bikes Sold (Units).
  3. Total Customer Payments Collected (Cash, IBFT, Card, Cheque).
  4. Total Petty Cash Expenses Paid (PKR).
  5. Physical Cash Breakdown & Zero-Variance Audit Certification.
  6. Cashier Signature & Branch Manager Signature.

---

### Q338: What happens in the system the exact second the Z-Report is finalized?
**Answer:** End-of-Day Ledger Lock & Business Date Roll:
* 📍 **System Navigation Path:** Core Financial Engine
* Today's financial sales ledger locks permanently (read-only).
* Branch business date advances to the next operational calendar day.
* Full consolidated financial summary automatically syncs to Head Office central database.

---

### Q339: What physical showroom security checks are verified during day-end closing?
**Answer:** Showroom Physical Lockup Checklist:
* 📍 **System Navigation Path:** `Day-End Closing Screen` &rarr; `Physical Security Checklist Tab`
* Manager confirms:
  1. Main compound vehicle gates locked and padlocked.
  2. Workshop power main circuit breakers turned OFF.
  3. All charging bikes unplugged (fire prevention policy).
  4. CCTV security cameras operating and recording.
  5. Master safe dual-locked with physical keys.

---

### Q340: Can a Branch Manager reopen a closed Z-Report after finalizing?
**Answer:** **No. Finalized Z-Reports are cryptographically immutable.**
* 📍 **System Navigation Path:** Financial Security Architecture
* If an unrecorded transaction is discovered after closing, it must be recorded as an adjustment on the following business day's ledger.

---

### Q341: Where can Head Office executives view live Z-Closing status across all branches?
**Answer:** The **Nationwide Day-End Closing Monitor**:
* 📍 **System Navigation Path:** `Super Admin Dashboard` &rarr; `Network Closing Status Widget` (`/finance/network-closing`)
* Live dashboard showing closing status across all 4 showrooms (e.g. *Islamabad: CLOSED (Zero Variance)*, *Peshawar: CLOSED (Zero Variance)*, *Lahore: CLOSING IN PROGRESS*, *Rawalpindi: CLOSED*).

---

### Q342: What is the Cash Reconciliation Accuracy KPI?
**Answer:** Financial governance score:
* 📍 **System Navigation Path:** `Sidebar: Analytics & Reports` &rarr; `Cash Governance Scorecards`
* Measures percentage of business days closed with zero cash variance (Target: &ge; 99.5% zero-variance across dealership network).

---
[Back to Top / Navigation Index](#dealership-owners-quick-navigation--executive-index)
