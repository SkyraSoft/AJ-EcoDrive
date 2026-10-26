const fs = require('fs');
const path = require('path');

const guidePath = path.join(__dirname, '..', 'AJ_ECODRIVE_COMPLETE_CLIENT_GUIDE_QA.md');
let content = fs.readFileSync(guidePath, 'utf8');

const section2Start = '# SECTION II: CENTRAL COMMAND & COLLABORATION (THE ACTION CENTRE)';
const section3Start = '# SECTION III: THE SHOWROOM SALES LIFECYCLE (WALK-IN TO DELIVERY)';

const s2Idx = content.indexOf(section2Start);
const s3Idx = content.indexOf(section3Start);

if (s2Idx === -1 || s3Idx === -1) {
  console.error('Section markers not found!');
  process.exit(1);
}

const upgradedSection2 = `# SECTION II: CENTRAL COMMAND & COLLABORATION (THE ACTION CENTRE)

---

# PART 4: The Dealership Action Centre — The Command Bridge (Q37 – Q52)

### Q37: What is the Action Centre screen in AJ EcoDrive, and how do dealership staff navigate to it?
**Answer:** The **Action Centre** is the central operational command desk and decision engine of AJ EcoDrive. Unlike standard email or phone escalations, every managerial decision across all dealership branches is tracked, timed, and audited in a single high-visibility workspace:
* 📍 **System Navigation Path:**
  * **Desktop / Web:** `Left Sidebar` &rarr; `Dashboard` &rarr; `Action Centre` (`/dashboard/action-centre`) OR Click the **Action Centre Banner** / **Action Required** table on the Main Dashboard.
  * **Mobile / Tablet:** Tap `Menu (Hamburger)` &rarr; `Action Centre` (`/dashboard/action-centre`) OR Tap the urgent Action badge in the top navigation header.
* **On Desktop Workstations:** Operates as a dual-pane command bridge with dynamic work queues on the left and full context decision drawers on the right.
* **On Mobile & Tablets:** Renders as touch-optimized, high-density priority cards with 1-tap **Approve**, **Review**, or **Decline** buttons for roaming managers.
* **Executive Web Portal:** Provides remote directors and board members real-time visibility into pending multi-branch approval bottlenecks from anywhere in the world.

---

### Q38: What makes the Action Centre fundamentally different from standard Notifications?
**Answer:** Notifications are passive alerts, whereas Action Centre items are binding, auditable managerial decision gates:
* 📍 **System Navigation Path:** `Dashboard` &rarr; `Sidebar: Action Centre` (`/dashboard/action-centre`) vs `Top Header` &rarr; `Notification Bell`
* **Notifications (Passive Alerts):** Informational messages (e.g. *"Customer receipt #REC-901 printed"* or *"Inbound truck dispatched"*). They can be dismissed or marked as read without taking action.
* **Action Centre Tasks (Active Decision Gates):** High-stakes business events requiring formal human authorization:
  1. **Auditable Decision Gate:** Cannot be dismissed without a formal operational treatment (Approve, Counter-Offer, Authorize, or Reject with mandatory notes).
  2. **Bi-Directional Command:** Facilitates bottom-up requests from Branch Managers to Head Office (discounts > 8%, emergency stock reallocations, OPEX > PKR 15,000, lithium battery warranty replacements) AND top-down directives from Super Admin to branches (safety recalls, nationwide cycle count audits).
  3. **Automated Ledger Execution:** When approved, the system instantly executes the underlying transaction (e.g., updates invoice discount, unlocks inter-branch transit gate pass, releases petty cash disbursement, or issues OEM warranty replacement credit).

---

### Q39: What are the 7 Work Queue Tabs in the Action Centre, and what does each tab filter?
**Answer:** The Action Centre organizes incoming tasks into 7 dedicated work queues to allow instant triage:
* 📍 **System Navigation Path:** `Sidebar: Action Centre` (`/dashboard/action-centre`) &rarr; `Horizontal Tab Bar`

| Tab Name | Work Queue Focus & Operational Scope | Linked Business Entities |
| :--- | :--- | :--- |
| **1. All Tasks** | Master consolidated queue showing every active and resolved task across the network. | All Records (`ACT-PRC`, `ACT-STK`, `ACT-EXP`, `ACT-WRN`, `ACT-GOV`) |
| **2. Pending Review** | Filters only active requests requiring an immediate managerial decision (\`Pending\` or \`Under Review\`). | Critical & High SLA items |
| **3. Commercial & Pricing** | Pricing waivers, fleet discounts > 8%, payment concession terms, and promotional margin exceptions. | Quotations (`QT-`), Sales Orders (`ORD-`) |
| **4. Stock Reallocation** | Emergency inter-branch vehicle transfers, showroom color pulls, and factory container allocations. | Inter-Branch Transfers (`TR-`), Serialized Units (`VIN-`) |
| **5. High-Value OPEX** | Branch operating expenditures and emergency repair bills exceeding local limit (PKR 15,000). | Expense Vouchers (`EXP-`), Cash Ledgers |
| **6. Technical & Warranty** | High-voltage Lithium battery failures, Smart BMS errors, burnt motors, and OEM warranty authorizations. | Workshop Service Cases (`SC-`), Repair Job Cards (`JOB-`) |
| **7. Inventory Governance** | Cycle count physical variances, sea container transit damage, and quality quarantine releases. | Cycle Counts (`CC-`), Quarantine Logs (`QR-`) |

---

### Q40: What do the 5 Summary KPI Cards at the top of the Action Centre indicate?
**Answer:** At the top of `/dashboard/action-centre`, 5 interactive KPI counters provide an instant executive summary:
* 📍 **System Navigation Path:** `Sidebar: Action Centre` (`/dashboard/action-centre`) &rarr; `Top Metric Cards Row`
* **Active Requests:** Total count of open, unresolved items currently awaiting executive review across all branches.
* **Commercial Discounts:** Total monetary value (in PKR) of customer discount waivers currently awaiting gross margin clearance.
* **Emergency OPEX:** Total value (in PKR) of showroom operational expense claims awaiting CFO payment clearance.
* **Critical Stock Reallocations:** Number of urgent vehicle pull requests needed to fulfill customer delivery bookings.
* **Warranty Claims:** Number of high-voltage battery and controller replacements awaiting technical sign-off.
* *Clicking any KPI card instantly filters the table below to that specific category.*

---

### Q41: What are the 4 Visual SLA Urgency Badges, and what do they mean?
**Answer:** Every action item displays a real-time countdown badge enforcing dealership Service Level Agreements (SLAs):
* 📍 **System Navigation Path:** `Sidebar: Action Centre` (`/dashboard/action-centre`) &rarr; Task Card &rarr; `SLA Countdown Pill`
1. **< 2h (Critical - Red Pulse):** Emergency walk-in customer waiting at the sales counter or vehicle pending delivery today.
2. **< 6h (High - Amber):** Same-day inter-branch stock reallocation or workshop repair awaiting customer release.
3. **< 24h (Normal - Blue):** Routine vendor expense reimbursement or next-week delivery reservation.
4. **Overdue (Deep Crimson):** Breached company SLA response limits; automatically escalated to National Sales Director / CFO.

---

### Q42: Can a Branch Manager approve their own requests in the Action Centre?
**Answer:** **No. The system enforces strict separation of operational duties.**
* 📍 **System Navigation Path:** `Action Centre` (`/dashboard/action-centre`) &rarr; `Treatment Drawer`
* When a Branch Manager submits an escalation (e.g. requesting a 12% discount on an electric scooter or claiming PKR 28,000 for showroom air-conditioner repair), the system marks the task as \`Pending Head Office Review\`.
* The submitting manager's interface displays a read-only tracking view with status badges.
* Only an authorized **Super Admin** or designated Department Head can execute **Approve**, **Counter-Offer**, or **Decline**.

---

### Q43: How does the Action Centre prevent bottlenecks when Head Office directors are busy?
**Answer:** Through automated escalation protocols and mobile companion access:
* 📍 **System Navigation Path:** `Super Admin` &rarr; `Action Centre Settings` &rarr; `SLA Escalation Rules`
* **Mobile Push & SMS Alerts:** When a Critical SLA item (< 2h) remains pending for 60 minutes, automated push notifications are dispatched to executive mobile devices.
* **Emergency Temporary Delegation:** Super Admins can delegate approval authority to Regional Managers during executive travel.
* **Auto-Rollback Protection:** If a pricing waiver is not treated before the customer quote expires (7 days), the quotation automatically locks at standard list price to protect dealership profitability.

---

### Q44: Does the Action Centre support filtering by specific branch showroom?
**Answer:** Yes. The Action Centre provides comprehensive multi-branch filtering:
* 📍 **System Navigation Path:** `Sidebar: Action Centre` (`/dashboard/action-centre`) &rarr; `Branch Filter Dropdown`
* Executives can toggle between **All Branches**, **Peshawar**, **Islamabad**, **Lahore**, and **Rawalpindi** to compare branch responsiveness, audit regional operating expense claims, and track city-specific warranty defect rates.

---

### Q45: What information is displayed on each Action Centre task card?
**Answer:** Each task card provides complete operational context at a glance:
* 📍 **System Navigation Path:** `Sidebar: Action Centre` (`/dashboard/action-centre`) &rarr; `Task Cards List`
* **Unique Action Code:** Reference ID (e.g., \`ACT-PRC-1082\`, \`ACT-STK-2041\`).
* **Category Badge:** Visual pill indicating Flow 1 (Commercial), Flow 2 (Stock), Flow 3 (OPEX), Flow 4 (Warranty), or Flow 5 (Governance).
* **Branch & Submitter:** Originating dealership name (e.g., *Peshawar Showroom*) and requesting manager's full name.
* **Financial Value / Asset Tag:** Monetary impact in PKR (e.g., *PKR 25,000 Discount Waiver*) or Chassis VIN reference.
* **Elapsed Time & SLA Badge:** Real-time urgency timer (e.g., *Elapsed: 42 mins — SLA: < 2h Critical*).
* **Justification Excerpt:** First 2 lines of the branch manager's business explanation.
* **Status Badge:** \`Pending\`, \`Under Review\`, \`Approved\`, \`Rejected\`, or \`Counter-Offered\`.

---

### Q46: Can staff communicate directly inside an Action Centre item?
**Answer:** Yes. Every task card includes an interactive **Discussion & Activity Log**:
* 📍 **System Navigation Path:** `Sidebar: Action Centre` (`/dashboard/action-centre`) &rarr; Click any Task Card &rarr; `Activity & Discussion Tab`
* **Real-Time Threaded Chat:** Super Admins and Branch Managers can exchange messages directly within the task (e.g., Super Admin: *"Can the customer pay 50% cash today if we approve 10% discount?"* &rarr; Manager: *"Yes, customer has PKR 125,000 cash in hand"*).
* **Document & Photo Attachments:** Staff can attach competitor price quotes, damaged parts photos, or vendor expense invoices directly into the conversation.

---

### Q47: What happens when an action item is officially Approved?
**Answer:** The system executes the underlying business transaction automatically and instantaneously:
* 📍 **System Navigation Path:** `Action Centre` &rarr; Select Task &rarr; Click **"Approve"** Button
* **Commercial Pricing:** The linked Quotation or Sales Order updates with the approved discount, recalculates tax, and unlocks official Tax Invoicing.
* **Stock Reallocation:** An Inter-Branch Dispatch Gate Pass is generated, reserving the physical chassis VIN in origin inventory.
* **OPEX Claims:** A payment disbursement voucher posts to the branch petty cash ledger, crediting the cashier.
* **Warranty Replacements:** An authorized replacement parts voucher is dispatched to the workshop parts store, releasing a brand-new component at PKR 0 customer charge.

---

### Q48: What happens when an action item is Rejected?
**Answer:** The request is formally closed with a mandatory audit record:
* 📍 **System Navigation Path:** `Action Centre` &rarr; Select Task &rarr; Click **"Decline / Reject"** Button
* **Mandatory Rejection Note:** The reviewer must input an operational explanation (e.g., *"Gross margin too low; maximum allowable discount is 5%"*).
* **Instant Branch Notification:** The requesting branch receives an instant alert with the explanation.
* **Ledger Rollback:** The underlying quotation or order reverts to standard retail catalog pricing.

---

### Q49: How does the Action Centre maintain legal and tax audit compliance?
**Answer:** Every action is preserved in an immutable, forensic audit trail:
* 📍 **System Navigation Path:** `Sidebar: Analytics & Reports` &rarr; `Audit Logs` (`/reports/audit-logs`)
* **Captured Metadata:** User ID, role, IP address, device hostname, exact timestamp down to the second, original values, modified values, and full decision notes.
* **Tamper-Proof:** Audit records cannot be edited or deleted by any user (including Super Admin), ensuring complete transparency during corporate financial audits and FBR tax inspections.

---

### Q50: Can a Super Admin delegate an action item to another department?
**Answer:** Yes. The Action Centre includes a built-in **Task Delegation Engine**:
* 📍 **System Navigation Path:** `Action Centre` &rarr; Select Task &rarr; Click **"Delegate"** &rarr; Select Department / Officer
* A Super Admin can route technical Lithium battery warranty claims directly to the **Chief Technical Officer (CTO)** or inter-city vehicle freight logistics to the **Supply Chain Lead**, ensuring specialized review without bottlenecking executive leadership.

---

### Q51: How does the Action Centre appear on mobile tablets?
**Answer:** On mobile tablets, the interface adapts into an ergonomic mobile command console:
* 📍 **System Navigation Path:** Mobile Tablet &rarr; `/dashboard/action-centre`
* The 7 queue tabs transform into a swipeable horizontal filter bar.
* Task cards render with large touch-friendly buttons (\`Approve\`, \`Counter\`, \`Decline\`).
* Tapping a card opens a smooth slide-over bottom sheet containing the full financial impact analysis and one-touch biometric approval.

---

### Q52: What happens if an action item was submitted while the branch was offline?
**Answer:** Offline submissions are safeguarded by AJ EcoDrive's **Local Queue Engine**:
* 📍 **System Navigation Path:** `Top Header` &rarr; `Offline Outbox Indicator` (`/system/outbox`)
* When submitted without internet connectivity, the task is saved to the local SQLite database with a cryptographic local timestamp.
* The application continues normal branch workflows.
* Upon internet restoration, the Outbox automatically syncs the action item to the Head Office central server, preserving chronological audit integrity.

---
[Back to Top / Navigation Index](#dealership-owners-quick-navigation--executive-index)

---

# PART 5: The 5 Standard Enterprise Action Flows (Q53 – Q68)

### Q53: What are the 5 Standard Enterprise Action Flows in AJ EcoDrive?
**Answer:** AJ EcoDrive standardizes all dealership operational escalations into **5 Universal Action Flows**:
* 📍 **System Navigation Path:** `Sidebar: Action Centre` (`/dashboard/action-centre`) &rarr; Click `+ New Action Request` (`CreateActionWizard`)

```
[Dealership Operational Escalation]
                │
  ┌─────────────┼─────────────┬─────────────┬─────────────┐
  ▼             ▼             ▼             ▼             ▼
[Flow 1]      [Flow 2]      [Flow 3]      [Flow 4]      [Flow 5]
Commercial    Stock         High-Value    Technical     Inventory
& Pricing     Reallocation  OPEX          & Warranty    Governance
(Discounts)   (Transfers)   (> PKR 15k)   (Batteries)   (Cycle Counts)
```

1. **Flow 1: Commercial & Pricing Escalations:** Discount approvals > 8%, corporate fleet pricing, and custom payment milestones.
2. **Flow 2: Stock Reallocation & Emergency Transfers:** Fast-tracking vehicle transfers between cities to fulfill locked customer bookings.
3. **Flow 3: High-Value Operational Expenses (OPEX):** Approving showroom expenditures, emergency utility repairs, and facility bills exceeding PKR 15,000.
4. **Flow 4: Technical & Lithium Battery Warranty Claims:** Authorizing OEM replacement of high-voltage batteries, Smart BMS units, and drive motors.
5. **Flow 5: Inventory Governance & Cycle Count Variances:** Resolving missing floor units, transit shipping damages, and quarantine releases.

---

### Q54: What triggers a Flow 1 (Commercial & Pricing) action item?
**Answer:** Flow 1 is automatically triggered whenever a quotation or sales order breaches dealership commercial pricing rules:
* 📍 **System Navigation Path:** `Sidebar: Sales & Revenue` &rarr; `Quotations` (`/sales/quotations`) &rarr; Enter Discount > 8%
* **Trigger Conditions:**
  * Sales representative enters a cash discount exceeding the branch manager's 8% discretionary ceiling.
  * Corporate client requests a batch purchase discount on 5+ electric scooters.
  * Customer requests a deferred payment installment plan without interest surcharges.
* **System Action:** The quotation status sets to \`Pending Commercial Approval\` and routes to the Action Centre under \`ACT-PRC-XXXX\`.

---

### Q55: What financial metrics does the Super Admin see when reviewing a Flow 1 pricing request?
**Answer:** The decision drawer displays an automated **Deal Profitability & Margin Analysis**:
* 📍 **System Navigation Path:** `Action Centre` &rarr; Select `ACT-PRC` Item &rarr; `Decision Treatment Drawer`
* **Base MSRP List Price:** Official retail price (e.g., `PKR 245,000`).
* **Dealer Landing Cost (COGS):** Landed import/assembly cost (e.g., `PKR 185,000`).
* **Standard Gross Margin:** Normal profit margin (e.g., `PKR 60,000` / `24.5%`).
* **Requested Discount Amount:** Requested price reduction (e.g., `PKR 25,000` / `10.2%`).
* **Net Revised Margin:** Resulting profit margin if approved (e.g., `PKR 35,000` / `15.9%`).
* **Breakeven Guard:** If the requested price falls below dealer landing cost, the system displays a flashing crimson warning: *"ALERT: SALE AT NEGATIVE MARGIN"*.

---

### Q56: How does the Counter-Offer feature work in Flow 1?
**Answer:** If the Super Admin considers the requested discount too aggressive, they can counter-offer:
* 📍 **System Navigation Path:** `Action Centre` &rarr; Select `ACT-PRC` Item &rarr; Click **"Counter-Offer"**
* Super Admin inputs an approved compromise (e.g. *"Approved at 6% cash discount + free rear storage box worth PKR 4,500"*).
* The branch manager receives the counter-offer on their sales screen with 1-click **Accept Counter** or **Decline**, allowing rapid closing while protecting margins.

---

### Q57: What triggers a Flow 2 (Stock Reallocation) action item?
**Answer:** Flow 2 is initiated when a branch requires immediate vehicle allocation from another branch or Central Warehouse:
* 📍 **System Navigation Path:** `Sidebar: Inventory` &rarr; `Stock Requests` (`/inventory/stock-requests`) OR `+ Inter-Branch Transfer`
* **Common Triggers:**
  * Peshawar has a customer with 100% cash ready for a *Metallic Crimson E-125*, but zero units are in Peshawar stock while Islamabad has 3 available units.
  * Central Warehouse initiates an emergency stock rebalancing to meet weekend promotional demand in Lahore.
* **Generated Code:** \`ACT-STK-XXXX\` with linked chassis VINs, carrier freight estimates, and origin/destination branches.

---

### Q58: What checks are performed before a Flow 2 Stock Reallocation is approved?
**Answer:** The system performs automated multi-point inventory checks:
* 📍 **System Navigation Path:** `Action Centre` &rarr; Select `ACT-STK` Item &rarr; `Inventory Impact Panel`
1. **Physical Availability Check:** Verifies the requested VIN is \`Available\` in origin inventory and not locked to another customer's sales deposit.
2. **Buffer Threshold Check:** Warns if dispatching the unit will drop the origin branch below its minimum showroom floor safety buffer.
3. **Logistics Transit Cost:** Displays estimated freight carrier cost (e.g., PKR 4,500 Islamabad to Peshawar) and carrier transit time (4 hours).

---

### Q59: What triggers a Flow 3 (High-Value OPEX) action item?
**Answer:** Flow 3 is triggered whenever a branch showroom operating expenditure exceeds the local discretionary limit:
* 📍 **System Navigation Path:** `Sidebar: Finance & Accounts` &rarr; `Showroom Expenses` (`/finance/expenses`) &rarr; Enter Amount > PKR 15,000
* **Discretionary Rule:**
  * **Expenses &le; PKR 15,000:** Branch Manager approves locally; deducted directly from cash drawer petty cash.
  * **Expenses > PKR 15,000:** System automatically locks payment and creates a Flow 3 task (\`ACT-EXP-XXXX\`) routing to Head Office CFO.
* **Examples:** Showroom generator overhaul (`PKR 35,000`), commercial display signage repair (`PKR 22,000`), or quarterly facility rent utilities (`PKR 48,000`).

---

### Q60: What documentation is mandatory for a Flow 3 OPEX approval?
**Answer:** The system enforces strict expense substantiation:
* 📍 **System Navigation Path:** `CreateExpenseModal` &rarr; `Attachments & Vendor Details`
* **Mandatory Attachments:** Vendor quotation/invoice photo, vendor NTN/tax number, and written description of work.
* **CFO Clearance:** The CFO reviews the attached invoice in the Action Centre, selects the debit accounting ledger (*Facility Maintenance / Marketing / Utilities*), and authorizes direct bank transfer or petty cash reimbursement.

---

### Q61: What triggers a Flow 4 (Technical & Warranty) action item?
**Answer:** Flow 4 is triggered when a customer vehicle experiences a major high-voltage component failure covered under warranty:
* 📍 **System Navigation Path:** `Sidebar: After-Sales & Workshop` &rarr; `Service Cases` (`/after-sales/warranty`) &rarr; Select `Warranty Claim`
* **High-Value Warranty Components:**
  * Lithium-ion Battery Pack replacement (`Value: PKR 95,000 – PKR 125,000`).
  * Brushless DC Hub Motor replacement (`Value: PKR 28,000`).
  * Smart BMS Electronic Controller replacement (`Value: PKR 14,500`).
* **System Action:** Generates \`ACT-WRN-XXXX\` and routes to Chief Technical Officer / Super Admin with attached OBD diagnostic logs.

---

### Q62: How does Flow 4 prevent fraudulent warranty part swapping?
**Answer:** Through 3-way serialized hardware binding:
* 📍 **System Navigation Path:** `Action Centre` &rarr; Select `ACT-WRN` Item &rarr; `Diagnostic Hardware Binding Panel`
* The system cross-references the scanned physical battery serial number against the original factory delivery record for that chassis VIN.
* If a mechanic attempts to claim warranty on a battery serial number that belongs to a different vehicle, the system flags a crimson alert: *"HARDWARE MISMATCH: BATTERY SERIAL NOT MATCHED TO VEHICLE DELIVERY RECORD"*.

---

### Q63: What triggers a Flow 5 (Inventory Governance) action item?
**Answer:** Flow 5 is triggered by physical inventory count variances or container transit damage:
* 📍 **System Navigation Path:** `Sidebar: Inventory` &rarr; `Cycle Counts & Audits` (`/inventory/cycle-counts`) OR `Quarantine` (`/inventory/quarantine`)
* **Trigger Events:**
  * **Cycle Count Variance:** A physical monthly stock-take finds 18 bikes on the showroom floor when the digital ledger records 19 bikes (missing 1 VIN).
  * **Container Unloading Damage:** A sea container from OEM factory arrives with 2 scratched or dented scooters.
  * **Quarantine Release:** Releasing an inspected vehicle from Holding Bay Q-3 back into Available showroom stock.

---

### Q64: What happens when a missing VIN variance is approved in Flow 5?
**Answer:** The system executes an official inventory write-off:
* 📍 **System Navigation Path:** `Action Centre` &rarr; Select `ACT-GOV` Item &rarr; Click **"Authorize Inventory Adjustment"**
* The missing VIN is permanently moved from \`Available\` to \`Missing / Investigation Locked\` status.
* An automatic financial write-off entry posts to the branch P&L balance sheet (*Inventory Shrinkage Expense*).
* An automated security incident report is logged, documenting the branch manager, auditor name, and timestamp for corporate investigation.

---

### Q65: Can an action item transition between different flows?
**Answer:** Yes. If an operational request expands in scope, it can be re-categorized:
* 📍 **System Navigation Path:** `Action Centre` &rarr; Task Card &rarr; `Action Menu (⋮)` &rarr; `Reclassify Flow`
* For example, if a routine workshop repair (Flow 4) reveals that the chassis frame was damaged during an inter-branch transfer, the service manager can link it to an Inventory Governance claim (Flow 5).

---

### Q66: How are action item reference IDs formatted across the 5 flows?
**Answer:** Reference IDs use standardized mnemonic prefixes for instant recognition:
* 📍 **System Navigation Path:** Visible on all cards, audit tables, and printed vouchers.
* \`ACT-PRC-YYYY-XXXX\` &rarr; Flow 1: Commercial & Pricing Waivers
* \`ACT-STK-YYYY-XXXX\` &rarr; Flow 2: Stock Reallocation & Transfers
* \`ACT-EXP-YYYY-XXXX\` &rarr; Flow 3: High-Value OPEX Claims
* \`ACT-WRN-YYYY-XXXX\` &rarr; Flow 4: Technical & Warranty Authorizations
* \`ACT-GOV-YYYY-XXXX\` &rarr; Flow 5: Inventory Governance & Cycle Count Adjustments

---

### Q67: What automated email and WhatsApp notifications are triggered by the 5 flows?
**Answer:** The system features integrated multi-channel alerts:
* 📍 **System Navigation Path:** `Sidebar: Settings` &rarr; `Notification Channels`
* **On Submission:** Super Admin receives instant email + mobile push with summary metrics.
* **On Approval:** Branch Manager receives real-time desktop pop-up and WhatsApp alert.
* **On Customer Impact (Flow 1 & 4):** Customer receives an automated SMS: *"Your custom discount / warranty claim has been approved by AJ EcoDrive Head Office"*.

---

### Q68: What is the average resolution SLA target across the 5 flows?
**Answer:** Corporate SLA performance benchmarks:
* 📍 **System Navigation Path:** `Sidebar: Analytics & Reports` &rarr; `SLA Performance Dashboard` (`/reports/sla-performance`)
* **Flow 1 (Pricing):** Target &le; 30 minutes (to close walk-in showroom deals on the spot).
* **Flow 2 (Stock Transfer):** Target &le; 2 hours.
* **Flow 3 (OPEX):** Target &le; 4 hours.
* **Flow 4 (Warranty):** Target &le; 6 hours.
* **Flow 5 (Governance):** Target &le; 24 hours.

---
[Back to Top / Navigation Index](#dealership-owners-quick-navigation--executive-index)

---

# PART 6: The Action Creation Wizard & Decision Treatment Drawer (Q69 – Q84)

### Q69: What is the Action Creation Wizard in AJ EcoDrive?
**Answer:** The **Action Creation Wizard** is a streamlined 2-step modal dialog that guides showroom staff and branch managers through creating standardized, audit-compliant escalation requests:
* 📍 **System Navigation Path:** `Top Navigation Header` &rarr; `Quick Actions ⌄` &rarr; `New Action Request` OR `Sidebar: Action Centre` (`/dashboard/action-centre`) &rarr; Click **"+ Create Action Request"** (`CreateActionWizard`)
* **Step 1 (Category & Business Entity Selection):** User selects one of the 5 Standard Flows and links the specific customer quotation, order, chassis VIN, repair job card, or expense voucher.
* **Step 2 (Parameters, Justification & Attachments):** User inputs requested financial figures (discount %, PKR amount), selects SLA urgency, writes business justification, and attaches photos or PDF documents.

---

### Q70: What validation rules are enforced in Step 1 of the Action Creation Wizard?
**Answer:** Step 1 enforces strict contextual validation:
* 📍 **System Navigation Path:** `CreateActionWizard` &rarr; `Step 1: Category & Entity Link`
* **Mandatory Entity Binding:** A Commercial request *must* link to an existing Quotation ID or Sales Order ID. An Inventory request *must* link to a valid Chassis VIN in the branch's active inventory.
* **Duplicate Prevention:** The wizard blocks creating duplicate active action items for the same business record.

---

### Q71: What validation rules are enforced in Step 2 of the Action Creation Wizard?
**Answer:** Step 2 ensures complete operational justification before submission:
* 📍 **System Navigation Path:** `CreateActionWizard` &rarr; `Step 2: Justification & Evidence`
* **Minimum Justification Length:** Requires at least 20 characters explaining the business necessity.
* **Numeric Boundary Checks:** Ensures discount percentages do not exceed 100% and expense amounts are positive non-zero numbers.
* **Attachment Mandate:** Enforces at least 1 image attachment for physical damage claims and expense vouchers exceeding PKR 25,000.

---

### Q72: What is the Decision Treatment Drawer in the Action Centre?
**Answer:** The **Decision Treatment Drawer** is an executive slide-over panel that opens on the right side of `/dashboard/action-centre` when a Super Admin clicks on any task card:
* 📍 **System Navigation Path:** `Sidebar: Action Centre` (`/dashboard/action-centre`) &rarr; Click any Task Card &rarr; Slide-over Drawer opens from right
* **Purpose:** It consolidates all operational data—financial impact analysis, customer profile, VIN history, activity chat, and decision action buttons—into a single focused view without navigating away from the triage list.

---

### Q73: What are the 4 Primary Decision Action Buttons in the Treatment Drawer?
**Answer:** The treatment drawer provides 4 distinct executive decision tools:
* 📍 **System Navigation Path:** `Action Centre` &rarr; Select Task &rarr; Bottom Sticky Action Bar

```
┌────────────────────────────────────────────────────────────────────────┐
│                      DECISION ACTION TOOLBAR                           │
├───────────────┬───────────────────┬──────────────────┬─────────────────┤
│  [✓ APPROVE]  │  [⚡ COUNTER-OFFER]│  [✕ DECLINE]     │  [↗ DELEGATE]   │
│  (Green)      │  (Blue)           │  (Crimson)       │  (Purple)       │
│  Full Consent │  Modify Terms     │  Reject with Note│  Reassign Dept  │
└───────────────┴───────────────────┴──────────────────┴─────────────────┘
```

1. **Approve (Emerald Green):** Grants full authorization; executes underlying ledger and status updates immediately.
2. **Counter-Offer (Royal Blue):** Adjusts requested terms (e.g. lowering a discount from 12% to 7%) and returns to branch.
3. **Decline (Crimson Red):** Rejects the request with a mandatory documented justification.
4. **Delegate (Amethyst Purple):** Reassigns the task to a specific department head (Technical, Logistics, Accounts).

---

### Q74: What is the "Financial Impact Summary" displayed inside the Decision Drawer?
**Answer:** An automated dynamic widget that computes the exact balance sheet effect:
* 📍 **System Navigation Path:** `Action Centre` &rarr; Select Task &rarr; `Drawer: Financial Impact Tab`
* Displays Original Gross Margin vs. Post-Approval Margin, Net Cash Impact (PKR), Tax GST adjustments, and branch budget utilization percentage.

---

### Q75: How does the Treatment Drawer display the Serialized Unit's History in Flow 2 and Flow 4?
**Answer:** It renders a complete **Lifecycle Timeline**:
* 📍 **System Navigation Path:** `Action Centre` &rarr; Select `ACT-STK` or `ACT-WRN` &rarr; `Drawer: Vehicle Timeline`
* Shows container import date, Bill of Lading, receiving warehouse, Pre-Delivery Inspection (PDI) score, past workshop visits, and previous warranty claims for that specific chassis VIN.

---

### Q76: Can a reviewer view customer credit and payment history inside the drawer?
**Answer:** Yes. For Commercial and Sales requests, the drawer embeds a **Customer Profile Card**:
* 📍 **System Navigation Path:** `Action Centre` &rarr; Select Task &rarr; `Drawer: Customer Insight Panel`
* Shows customer CNIC verification status, total lifetime electric scooters purchased, past payment punctuality, and open invoice balances across all branches.

---

### Q77: What happens when the reviewer clicks "Counter-Offer"?
**Answer:** The drawer opens an inline **Counter Negotiation Form**:
* 📍 **System Navigation Path:** `Treatment Drawer` &rarr; Click **"Counter-Offer"**
* Reviewer inputs revised discount percentage or authorized budget amount and types a counter note (e.g., *"Approved 6% discount if customer settles remaining balance via instant online IBFT today"*).
* Clicking **"Send Counter-Offer"** changes status to \`Counter-Offered\` and notifies the branch sales desk immediately.

---

### Q78: How does the branch salesperson accept a Counter-Offer?
**Answer:** The salesperson receives an instant interactive pop-up on their quotation/order screen:
* 📍 **System Navigation Path:** `Sidebar: Sales & Revenue` &rarr; `Quotations` (`/sales/quotations`) &rarr; Click **"Review Counter-Offer"**
* Salesperson can click **"Accept Counter-Offer"** (which automatically updates the quotation with the new terms) OR **"Withdraw Request"** if the customer refuses.

---

### Q79: What happens when the reviewer clicks "Decline"?
**Answer:** The system opens a **Decline Confirmation Modal**:
* 📍 **System Navigation Path:** `Treatment Drawer` &rarr; Click **"Decline / Reject"**
* Reviewer must select a structured rejection reason code (*Margin Below Floor / Stock Reserved for Existing Booking / Incomplete Diagnostic Data*) and type a detailed explanation.
* Upon confirmation, the task closes as \`Rejected\` and logs into the permanent audit trail.

---

### Q80: How does the Treatment Drawer support multi-attachment document previewing?
**Answer:** The drawer includes an integrated **Media & Document Lightbox**:
* 📍 **System Navigation Path:** `Treatment Drawer` &rarr; `Evidence & Documents Section` &rarr; Click any thumbnail
* Reviewers can zoom into high-resolution photos of damaged parts, preview PDF vendor invoices, and inspect OBD battery scan reports directly within the application without downloading external files.

---

### Q81: Can a reviewer add private internal notes invisible to the branch manager?
**Answer:** Yes. The drawer provides dual messaging modes:
* 📍 **System Navigation Path:** `Treatment Drawer` &rarr; `Discussion Tab` &rarr; Toggle **"Internal Executive Note"**
* **Public Discussion:** Visible to both Head Office and Branch Manager.
* **Internal Executive Note (Yellow Shading):** Visible strictly to Super Admins and Executive Directors for confidential margin discussions.

---

### Q82: How does the Decision Drawer operate on mobile and touchscreen tablets?
**Answer:** On touch devices, the drawer opens as a full-screen **Slide-Up Modal**:
* 📍 **System Navigation Path:** Tablet Screen &rarr; Tap Task Card &rarr; Slide-Up Modal
* Provides large, high-contrast action buttons at the bottom of the screen, full pinch-to-zoom support on damage photos, and biometric touch confirmation.

---

### Q83: How is task resolution velocity tracked for managerial KPIs?
**Answer:** The system calculates exact time-to-decision metrics:
* 📍 **System Navigation Path:** `Sidebar: Analytics & Reports` &rarr; `Executive Performance` (`/reports/executive-kpis`)
* Logs exact minutes elapsed between task submission, first review, and final resolution, generating monthly executive response SLA scorecards.

---

### Q84: What happens if two Super Admins open and review the same Action Item simultaneously?
**Answer:** AJ EcoDrive includes **Concurrent Review Locking**:
* 📍 **System Navigation Path:** `Action Centre` &rarr; `Task Card Header`
* When Administrator A opens a task drawer, a blue banner appears on Administrator B's screen: *"Currently being reviewed by [Admin Name]"*.
* If Administrator A submits a decision, Administrator B's screen updates instantly via live WebSocket synchronization, preventing conflicting duplicate approvals.

---
[Back to Top / Navigation Index](#dealership-owners-quick-navigation--executive-index)`;

content = content.substring(0, s2Idx) + upgradedSection2 + '\n\n' + content.substring(s3Idx);
fs.writeFileSync(guidePath, content, 'utf8');
console.log('Successfully upgraded Section II (Parts 4, 5, 6: Q37 to Q84) to 135% depth!');
