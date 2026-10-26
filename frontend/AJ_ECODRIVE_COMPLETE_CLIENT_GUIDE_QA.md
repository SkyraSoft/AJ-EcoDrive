# AJ ECODRIVE CLIENT OPERATIONS GUIDE & SYSTEM ARCHITECTURE QA
### Comprehensive Operational Manual, Non-Technical Leadership Guide & Complete Architecture Specification
**Document Version:** 3.0 (Master Enterprise Chronological Edition)  
**Target Audience:** Dealership Owners, Board Members, Head Office Executives, Branch Managers & System Auditors  
**Scope:** Multi-Branch EV Dealership Operations, Sales Lifecycle, Action Centre Decision Engine, Workshop Management, Serialized Inventory, Cash Controls & Offline Architecture  

---

# TABLE OF CONTENTS

### SECTION I: FOUNDATIONS & GETTING STARTED
1. [PART 1: Understanding AJ EcoDrive & The EV Dealership Model (Q1 – Q12)](#part-1-understanding-aj-ecodrive--the-ev-dealership-model-q1--q12)
2. [PART 2: Workstation Platforms & User Login Categories (Q13 – Q24)](#part-2-workstation-platforms--user-login-categories-q13--q24)
3. [PART 3: Morning Showroom Opening & System Daily Start (Q25 – Q36H)](#part-3-morning-showroom-opening--system-daily-start-q25--q36h)

### SECTION II: CENTRAL COMMAND & COLLABORATION (THE ACTION CENTRE)
4. [PART 4: The Dealership Action Centre — The Command Bridge (Q37 – Q52)](#part-4-the-dealership-action-centre--the-command-bridge-q37--q52)
5. [PART 5: The 5 Standard Enterprise Action Flows (Q53 – Q68)](#part-5-the-5-standard-enterprise-action-flows-q53--q68)
6. [PART 6: The Action Creation Wizard & Decision Treatment Drawer (Q69 – Q84)](#part-6-the-action-creation-wizard--decision-treatment-drawer-q69--q84)

### SECTION III: THE SHOWROOM SALES LIFECYCLE (WALK-IN TO DELIVERY)
7. [PART 7: Walk-In Customers & Capturing Sales Leads (Q85 – Q98)](#part-7-walk-in-customers--capturing-sales-leads-q85--q98)
8. [PART 8: Customer Registration, CNIC Verification & KYC (Q99 – Q112)](#part-8-customer-registration-cnic-verification--kyc-q99--q112)
9. [PART 9: Formal Pricing & Customer Quotations (Q113 – Q128)](#part-9-formal-pricing--customer-quotations-q113--q128)
10. [PART 10: Instant Point of Sale (POS) & Sales Order Confirmation (Q129 – Q144)](#part-10-instant-point-of-sale-pos--sales-order-confirmation-q129--q144)
11. [PART 11: Invoicing, Deposits & Customer Money Collections (Q145 – Q158)](#part-11-invoicing-deposits--customer-money-collections-q145--q158)
12. [PART 12: Pre-Delivery Inspection (PDI) & Official Gate Pass Handover (Q159 – Q174)](#part-12-pre-delivery-inspection-pdi--official-gate-pass-handover-q159--q174)

### SECTION IV: AFTER-SALES SERVICE, WORKSHOP & WARRANTY (OWNERSHIP JOURNEY)
13. [PART 13: Workshop Intake & Opening Service Cases (Q175 – Q188)](#part-13-workshop-intake--opening-service-cases-q175--q188)
14. [PART 14: Workshop Repair Execution & Mechanic Job Cards (Q189 – Q202)](#part-14-workshop-repair-execution--mechanic-job-cards-q189--q202)
15. [PART 15: Lithium Battery Warranties & BMS Diagnostics (Q203 – Q218)](#part-15-lithium-battery-warranties--bms-diagnostics-q203--q218)
16. [PART 16: Vehicle Cancellations, Returns & Customer Refund Settlement (Q219 – Q232)](#part-16-vehicle-cancellations-returns--customer-refund-settlement-q219--q232)

### SECTION V: SHOWROOM INVENTORY, TRANSFERS & QUALITY CONTROL
17. [PART 17: Showroom Inventory & Serialized Unit Management (Q233 – Q246)](#part-17-showroom-inventory--serialized-unit-management-q233--q246)
18. [PART 18: Showroom Stock Replenishment Requisitions (Q247 – Q258)](#part-18-showroom-stock-replenishment-requisitions-q247--q258)
19. [PART 19: Inter-Branch Stock Transfers & In-Transit Custody (Q259 – Q272)](#part-19-inter-branch-stock-transfers--in-transit-custody-q259--q272)
20. [PART 20: Inbound Delivery Receiving & Transit Discrepancies (Q273 – Q286)](#part-20-inbound-delivery-receiving--transit-discrepancies-q273--q286)
21. [PART 21: Blind Physical Cycle Counts & Inventory Audits (Q287 – Q300)](#part-21-blind-physical-cycle-counts--inventory-audits-q287--q300)
22. [PART 22: Quality Quarantine & Defective Stock Isolation (Q301 – Q314)](#part-22-quality-quarantine--defective-stock-isolation-q301--q314)

### SECTION VI: CASH PROTECTION, EXPENSES & DAY-END RECONCILIATION
23. [PART 23: Showroom Operating Expenses & Petty Cash (Q315 – Q328)](#part-23-showroom-operating-expenses--petty-cash-q315--q328)
24. [PART 24: Day-End Closing Reconciliation (Daily Z-Report) (Q329 – Q342)](#part-24-day-end-closing-reconciliation-daily-z-report-q329--q342)

### SECTION VII: HEAD OFFICE GOVERNANCE, PROCUREMENT & NETWORK ADMINISTRATION
25. [PART 25: Sea Container Imports, Procurement & Supplier Management (Q343 – Q358)](#part-25-sea-container-imports-procurement--supplier-management-q343--q358)
26. [PART 26: Showroom Branches, User Accounts & Security Permissions (Q359 – Q374)](#part-26-showroom-branches-user-accounts--security-permissions-q359--q374)

### SECTION VIII: COLLABORATION MATRIX, ARCHITECTURE & APPENDICES
27. [PART 27: Super Admin & Branch Manager 10 Master Touchpoints Collaboration Matrix (Q375 – Q390)](#part-27-super-admin--branch-manager-10-master-touchpoints-collaboration-matrix-q375--q390)
28. [PART 28: Offline Continuity, Synchronization & Local Workstation Architecture (Q391 – Q405)](#part-28-offline-continuity-synchronization--local-workstation-architecture-q391--q405)
29. [APPENDIX A: Policy Summary — Operational Continuity & Synchronization](#appendix-a-policy-summary--operational-continuity--synchronization)
30. [APPENDIX B: Target Production Topology Blueprint](#appendix-b-target-production-topology-blueprint)
31. [APPENDIX C: Proposed Offline Operational Classification Matrix](#appendix-c-proposed-offline-operational-classification-matrix)
32. [APPENDIX D: Branch Daily Operational Lifecycle](#appendix-d-branch-daily-operational-lifecycle)
33. [APPENDIX E: Failure & Recovery Scenarios Matrix (18 Critical Events)](#appendix-e-failure--recovery-scenarios-matrix-18-critical-events)
34. [APPENDIX F: Client Approval Items & Architecture Decisions](#appendix-f-client-approval-items--architecture-decisions)
35. [APPENDIX G: Target Implementation Roadmap (Phases 1 – 19)](#appendix-g-target-implementation-roadmap-phases-1--19)
36. [APPENDIX H: Core Production Acceptance Criteria](#appendix-h-core-production-acceptance-criteria)

---

# DEALERSHIP OWNER'S QUICK NAVIGATION & EXECUTIVE INDEX
### "Plain-English Answers for Dealership Investors, Directors & Non-Technical Owners"

> ### 🚀 LIVE PRESENTATION & CLIENT DEMONSTRATION ACCESS
> **Live Production Deployment URL:** [https://aj-eco-drive.vercel.app](https://aj-eco-drive.vercel.app)  
> **Source Code & Architecture Repository:** [https://github.com/SkyraSoft/AJ-EcoDrive](https://github.com/SkyraSoft/AJ-EcoDrive)  
> **Universal Demo Password:** `password123` *(or `password`)*
>
> | Presentation Role | Branch / Location Scope | Username / Code | Common Password | Operational Capabilities |
> | :--- | :--- | :--- | :--- | :--- |
> | **Super Admin** | **Head Office (All Branches)** | `ADMIN` *(or `admin`)* | `password123` | Nationwide control across all 4 showrooms, procurement, global pricing, user management, and system-wide Action Centre approvals. |
> | **Branch Manager** | **Peshawar Showroom & Workshop** | `PEW-01` *(or `peshawar`)* | `password123` | Scoped strictly to Peshawar showroom floor inventory, sales orders, walk-in leads, expenses, and workshop repair jobs. |
> | **Branch Manager** | **Islamabad Showroom** | `ISB-01` *(or `islamabad`)* | `password123` | Scoped strictly to Islamabad showroom floor, local commercial sales, cash registers, and stock requisition. |
> | **Branch Manager** | **Lahore Showroom** | `LHE-01` *(or `lahore`)* | `password123` | Scoped strictly to Lahore commercial sales, inventory management, customer payments, and local team dispatch. |
> | **Branch Manager** | **Rawalpindi Showroom** | `RWP-01` *(or `rawalpindi`)* | `password123` | Scoped strictly to Rawalpindi twin-cities operations, local stock receipts, inter-branch transfers, and petty cash. |
>
> *Tip: On the live login screen ([https://aj-eco-drive.vercel.app/login](https://aj-eco-drive.vercel.app/login)), click any role badge to **1-click auto-fill** credentials and log in instantly.*

---

If you are a dealership owner, board member, or business executive who does not write software code, this index is designed specifically for you. Click any question below to jump straight to the exact operational answer:

| Dealership Business Concern | Plain-English Executive Summary | Direct Answer Jump Link |
| :--- | :--- | :--- |
| **Cash & Money Protection** | How physical cash in the branch drawer is counted, locked, and reconciled against corporate bank deposit slips. | [Jump to Q315](#q315), [Q329](#q329) & [Q331](#q331) |
| **Rogue Discount Prevention** | Why showroom staff cannot exceed an 8% discount ceiling without Head Office Action Centre approval. | [Jump to Q115](#q115), [Q131](#q131) & [Q377](#q377) |
| **No Bike Leaves Without Cash** | Why the system physically blocks generating or printing the official Delivery Gate Pass until balance is PKR 0. | [Jump to Q136](#q136) & [Q161](#q161) |
| **Selling Remote Stock Blocked**| Why staff in Peshawar cannot accidentally sell a scooter sitting in Islamabad without an approved transfer. | [Jump to Q5](#q5), [Q235](#q235) & [Q396](#q396) |
| **Battery Warranty Protection** | How 3-way serialized hardware locking and OBD diagnostic codes stop fraudulent battery swapping scams. | [Jump to Q203](#q203), [Q209](#q209) & [Q382](#q382) |
| **Missing Inventory / Theft** | What happens when a physical bike is missing from the floor during the monthly count (auto-locking VINs). | [Jump to Q287](#q287), [Q292](#q292) & [Q380](#q380) |
| **Showroom Expenses & Bills** | Why branch managers can only spend up to PKR 15,000 petty cash; larger bills route directly to CFO. | [Jump to Q316](#q316), [Q317](#q317) & [Q381](#q381) |
| **Internet & Power Outages** | Why showroom sales, receipts, and repairs continue instantly even if the internet drops or power trips. | [Jump to Q30](#q30), [Q391](#q391) & [Appendix E](#appendix-e-failure--recovery-scenarios-matrix-18-critical-events) |
| **The Action Centre Command** | Complete operational manual for the 5 enterprise flows, creation wizard, decision drawer, and treatment buttons. | [Jump to Part 4](#part-4-the-dealership-action-centre--the-command-bridge-q37--q52) & [Part 5](#part-5-the-5-standard-enterprise-action-flows-q53--q68) |
| **The 5 Standard Flows** | Deep dive into Commercial, Stock Reallocation, OPEX, Warranty, and Governance flows. | [Jump to Part 5](#part-5-the-5-standard-enterprise-action-flows-q53--q68) |
| **Action Creation Wizard** | Step-by-step 2-step modal creation flow and Head Office slide-out decision treatment drawer. | [Jump to Part 6](#part-6-the-action-creation-wizard--decision-treatment-drawer-q69--q84) |
| **10 Master Touchpoints** | The complete operational collaboration manual between Super Admin and Branch Managers. | [Jump to Part 27](#part-27-super-admin--branch-manager-10-master-touchpoints-collaboration-matrix-q375--q390) |

---
[Back to Top / Navigation Index](#dealership-owners-quick-navigation--executive-index)

---

# SECTION I: FOUNDATIONS & GETTING STARTED

---

# PART 1: Understanding AJ EcoDrive & The EV Dealership Model (Q1 – Q12)

### Q1: In simple words, what is AJ EcoDrive?
**Answer:** AJ EcoDrive is an enterprise-grade Dealership Management System (DMS) and Operating Platform engineered specifically for electric vehicle (EV) businesses. It acts as the central digital nervous system of the dealership, managing every stage of operations:
* 📍 **System Navigation Path:** `Main Application Shell` &rarr; `Role-Based Dashboard` (`/dashboard`)
* **Global Procurement:** Importing CBU (Completely Built Up) and CKD (Completely Knocked Down) containers from international OEM factories with Bill of Lading and shipping container tracking.
* **Serialized Inventory Control:** Tracking every single electric scooter down to its physical Frame VIN, Lithium Battery Serial Number, and Motor Controller ID across all branch showrooms (Peshawar, Islamabad, Lahore, Rawalpindi).
* **Commercial Sales Operations:** Seamlessly managing walk-in leads, 7-day binding customer price quotations with automated discount caps, 1-click Point of Sale (POS) checkout, and scheduled customer booking orders.
* **Financial Protection:** Enforcing double-entry cashier ledger reconciliations, petty cash controls (PKR 15,000 threshold), automated FBR-compliant tax invoicing, and bank IBFT payment verification.
* **Workshop & Warranty Governance:** Managing repair job cards, technician bay assignments, spare parts consumption, and 3-way serialized lithium battery warranty validation.

---

### Q2: Why can't an EV dealership just use a generic accounting tool like QuickBooks or Excel?
**Answer:** Because generic accounting software treats products as interchangeable numeric quantities (like bags of cement or bottles of water). An electric vehicle is a complex, high-voltage asset governed by three distinct, serialized components that dictate legal ownership, road safety, and financial value:
* 📍 **System Navigation Path:** `Sidebar: Inventory` &rarr; `Serialized Units` (`/inventory/serialized-units`)
1. **VIN / Chassis Number (Stasis Identity):** Stamped permanently onto the steel chassis frame; legally registered with provincial excise, taxation, and traffic police databases.
2. **Lithium Battery Pack Serial Number (High-Value Asset):** The battery constitutes **40% to 50% of the entire vehicle's monetary worth** (e.g., PKR 110,000 of a PKR 245,000 electric scooter).
3. **Electronic Controller / Smart BMS Serial Number (Brain):** The micro-controller unit governing voltage discharge, thermal safety limits, and motor wattage output.

**The Fatal Flaws of Excel / Generic Software in Dealerships:**
* In Excel or basic accounting tools, a salesperson can accidentally sell the same chassis number twice to different customers on the same weekend.
* Mechanics can swap a customer's degraded or burned battery into a showroom display bike without any digital trace.
* Showroom cashiers can alter past sales records to conceal cash shortages.
* AJ EcoDrive makes these fraud vectors impossible by mathematically enforcing **3-way serialized hardware binding** and immutable, timestamped audit logs.

---

### Q3: Who are the active users of AJ EcoDrive today?
**Answer:** In the current production deployment, the platform operates with **two primary operational user tiers**:
* 📍 **System Navigation Path:** `Login Portal` (`/login`) &rarr; Select `Super Admin` or `Branch Manager` Badge
1. **Super Admin (Head Office & Executive Leadership):**
   * **Scope:** Unrestricted nationwide oversight across all 4 branch dealerships (Peshawar, Islamabad, Lahore, Rawalpindi) and Central Distribution Warehouses.
   * **Key Duties:** Approving commercial discount waivers > 8%, authorizing inter-branch vehicle transfers, releasing high-value OPEX claims > PKR 15,000, managing sea container procurement, setting master catalog prices, and inspecting consolidated P&L balance sheets.
2. **Branch Managers (Showroom & Workshop Commanders):**
   * **Scope:** Geographically locked to their assigned physical showroom location.
   * **Key Duties:** Opening morning cash drawer floats, conducting daily floor VIN audits, executing walk-in sales, generating customer quotations, registering customer CNICs, collecting cash/bank payments, issuing Delivery Gate Passes, dispatching inter-branch transfers, and overseeing workshop repair job cards.

*(Underlying RBAC architecture is already primed for individual sub-roles—such as Sales Representatives, Cashiers, Workshop Technicians, and Storekeepers—to be provisioned as branch headcount expands).*

---

### Q4: What does "Multi-Branch Architecture" mean for a dealership owner?
**Answer:** Multi-Branch Architecture means that all geographically separated dealership showrooms, warehouses, and workshop service bays operate in real-time synchronization on a unified master ledger:
* 📍 **System Navigation Path:** `Super Admin Dashboard` (`/dashboard`) &rarr; `Branch Selector Dropdown` (Upper Header)
* **Real-Time Executive Visibility:** A dealership owner sitting in Islamabad Head Office can view live, second-by-second operations across Peshawar, Lahore, and Rawalpindi without making phone calls or waiting for end-of-month spreadsheets.
* **Instant Performance Auditing:** Instantly view how many scooters were sold today in Peshawar, how much cash is physically sitting in the Lahore safe, which branch is running low on battery packs, and which workshop has customer warranty tickets awaiting parts.
* **Central Policy Enforcement:** When Head Office updates an MSRP list price or issues a safety recall, the rule instantly propagates across all branch workstations nationwide.

---

### Q5: Can staff in Peshawar sell a bike that is physically located in Islamabad?
**Answer:** **No. The system strictly prohibits cross-branch phantom selling.**
* 📍 **System Navigation Path:** `Sidebar: Sales & Revenue` &rarr; `Point of Sale (POS)` OR `+ Quick Sale` Modal
* **Custody Isolation Rule:** A salesperson in Peshawar can only allocate, invoice, and deliver a chassis VIN that currently has a physical status of `Available` within **Peshawar Showroom Inventory**.
* **Inter-Branch Transfer Protocol:** If a customer in Peshawar urgently demands a Metallic Red scooter that is physically in Islamabad, the Peshawar manager cannot sell it on the spot. They must:
  1. Launch `+ Inter-Branch Transfer` (`CreateTransferModal`) to request the vehicle.
  2. Islamabad approves and dispatches the bike via a logistics carrier truck (`Status: In-Transit`).
  3. When the truck arrives in Peshawar, the manager scans the chassis barcode and confirms intake (`ReceiveTransferModal`).
  4. Only after intake confirmation does the VIN unlock in Peshawar's sales ledger for customer invoicing.

---

### Q6: What is a "Serialized Unit" in the context of electric bikes?
**Answer:** In AJ EcoDrive, a "Serialized Unit" represents a specific, physical machine with permanent, unalterable hardware identities:
* 📍 **System Navigation Path:** `Sidebar: Inventory` &rarr; `Serialized Units` (`/inventory/serialized-units`)
* **Catalog Model vs. Serialized Machine:** While the catalog contains the generic product blueprint (e.g., *"Model: BRG E-125 Commuter Scooter, 1500W Brushless Motor"*), the serialized inventory ledger tracks the physical vehicle:
  * **Chassis Frame VIN:** `PK-BRG-2026-00812` (Stamped into frame)
  * **Color:** Metallic Cobalt Blue
  * **Lithium Battery Serial:** `BAT-72V32AH-2026-00812` (NMC Cell Pack)
  * **Motor Controller Serial:** `CTL-72V1500W-09412` (Sine-wave BMS)
  * **Physical Location:** Peshawar Showroom Floor — Bay A-2
  * **Current Status:** `Available`
* This granular tracking ensures that if a battery is swapped or a frame is inspected, the system knows the exact history of that physical unit from the factory shipping container to the customer's driveway.

---

### Q7: What lifecycle stages does an electric bike move through in the system?
**Answer:** Every vehicle progresses through 7 strictly defined lifecycle states, preventing skipped operational steps:
* 📍 **System Navigation Path:** `Sidebar: Inventory` &rarr; `Serialized Units` &rarr; Filter by `Status Tag`

```
[1. Available (Showroom Floor)]
              │ (Customer Places Order / POS)
              ▼
[2. Reserved (Locked to Customer)] ──► Deposit Captured / Inbound Stock Mapped
              │ (Full Settlement & PDI Passed)
              ▼
[3. Sold / Ready for Handover]
              │ (Delivery Handover Sheet & Gate Pass)
              ▼
[4. Delivered / Customer Owned]
              │ (Customer Returns for Maintenance)
              ▼
[5. In Service / Workshop Bay] ──► Job Card / Warranty Repair
              ▲
              │
[6. In-Transit] ───────────────► Carrier Truck Moving Between Branches
[7. Quarantine / QC Hold] ─────► Factory Transit Damage / Battery Diagnostic Isolation
```

---

### Q8: What currency and number formats are used across the system?
**Answer:** The entire platform is localized for standard Pakistani commerce and tax compliance:
* 📍 **System Navigation Path:** Visible globally across all financial cards, invoice printouts, and balance sheets.
* **Currency Code:** **Pakistani Rupee (PKR)**.
* **Standard Formatting:** Formatted with standard thousands separators (e.g., `PKR 245,000` or `PKR 1,450,000`).
* **Decimal Handling:** All cash register and customer receipt totals display zero decimals (rounded to whole Rupees), while bank disbursements and tax withholding computations maintain standard rounding precision.

---

### Q9: Does the system track spare parts, tyres, and workshop consumables?
**Answer:** Yes. AJ EcoDrive includes a specialized **Spare Parts & Workshop Inventory Engine** operating alongside vehicle tracking:
* 📍 **System Navigation Path:** `Sidebar: Inventory` &rarr; `Spare Parts & Accessories` (`/inventory/parts`)
* **Managed Item Types:**
  * High-frequency wear parts (Brake pads, tubeless tyres, inner tubes, drive belts).
  * Electronic components (Throttle assemblies, digital LCD instrument meters, LED headlamp clusters, 12V DC-DC converters).
  * Workshop consumables (Hydraulic brake fluid, wiring harness looms, high-voltage heat-shrink wraps).
* **Automatic Job Card Consumption:** When a workshop technician adds *"1x Set Hydraulic Brake Pads (Part #BRK-PAD-01)"* to an active repair ticket, the part automatically deducts from the showroom workshop cabinet inventory and posts to the repair invoice.

---

### Q10: How does AJ EcoDrive handle manufacturer warranties?
**Answer:** Every vehicle sold automatically activates an official OEM Digital Warranty Certificate upon delivery:
* 📍 **System Navigation Path:** `Sidebar: After-Sales & Workshop` &rarr; `Warranty Policies` (`/after-sales/warranty`)
* **Standard Coverage Terms:**
  * **Lithium-Ion Battery Pack:** 2 Years or 30,000 km (whichever occurs first).
  * **Electric Hub Motor & Controller:** 2 Years or 25,000 km.
  * **Vehicle Chassis & Frame:** 3 Years.
* **Automated Activation:** The warranty period starts on the exact calendar date the customer signs the Delivery Handover certificate. The system tracks remaining warranty months and mileage automatically when the customer returns for periodic checkups.

---

### Q11: What happens if a customer visits the workshop with a burned controller under warranty?
**Answer:** The workshop receptionist conducts an instant digital warranty intake:
* 📍 **System Navigation Path:** `Sidebar: After-Sales & Workshop` &rarr; `Active Service Cases` (`/after-sales/warranty`) &rarr; Click `+ New Service Intake` (`CreateCaseModal`)
* **Step 1: Serial Verification:** The receptionist scans the bike's chassis VIN. The system verifies active warranty coverage (e.g., 14 months elapsed, 12,400 km traveled).
* **Step 2: Component Diagnostic:** The mechanic plugs in the diagnostic harness, confirms controller MOSFET burnout, and opens a warranty claim.
* **Step 3: Zero-Balance Customer Invoice:**
  * OEM Smart Controller Replacement: `PKR 8,500`
  * Manufacturer Warranty Subsidy Credit: `- PKR 8,500`
  * Net Amount Payable by Customer: **`PKR 0.00`**
* **Step 4: Factory Reimbursement:** The defective controller is tagged with serial number and quarantined; the system creates a warranty debit memo against the OEM manufacturer.

---

### Q12: Can showroom staff secretly sell a bike without registering it in the system?
**Answer:** **No. Showroom physical security and digital gates prevent unregistered vehicle exits.**
* 📍 **System Navigation Path:** `Sidebar: Sales & Revenue` &rarr; `Delivery Handovers & Gate Passes` (`/sales/deliveries`)
* **Mandatory Gate Pass Enforcement:** Every dealership branch employs a security guard at the physical compound gate. Security protocol mandates that no electric bike may pass the physical barrier without an original, printed **Delivery Gate Pass**.
* **Gate Pass Safeguards:**
  * Can only be printed when the sales invoice has **PKR 0.00 remaining balance** and the 6-point Pre-Delivery Inspection (PDI) checklist is signed off.
  * Contains an encrypted, time-sensitive **QR Verification Code**, VIN barcode, customer CNIC, and authorizing manager signature.
  * Attempting to exit with a Quotation, Pro-forma, or manual slip results in immediate gate stoppage and security escalation.

---
[Back to Top / Navigation Index](#dealership-owners-quick-navigation--executive-index)

---

# PART 2: Workstation Platforms & User Login Categories (Q13 – Q24)

### Q13: What hardware platforms does AJ EcoDrive support?
**Answer:** AJ EcoDrive is engineered for resilient cross-platform operations across three specialized environments:
* 📍 **System Navigation Path:** Cross-Device Browser & Local Desktop Shell
1. **Windows Desktop Workstations:** Installed on dedicated counter PCs (Dell, HP, Lenovo) at showroom sales desks, cashier booths, and workshop reception. Optimized for thermal barcode label printers, 80mm POS receipt printers, and USB barcode guns.
2. **Android Tablets & Rugged Handhelds:** Mobile touch devices used by sales representatives walking the floor with customers and workshop mechanics inspecting bikes inside service bays.
3. **Executive Web Companion:** Secure browser portal accessible from laptops or home computers for directors and Head Office executives traveling outside the dealership network.

---

### Q14: Does the Mobile / Tablet App have fewer features than the Desktop version?
**Answer:** **No. The Mobile / Tablet App maintains 100% full feature parity.**
* 📍 **System Navigation Path:** Responsive Layout (Auto-adapts on screens from 360px to 4K displays)
* Every operational capability on desktop—including Point of Sale transactions, quotation builders, customer CNIC capture, workshop job cards, stock transfer dispatches, petty cash vouchers, and Action Centre decision drawers—is 100% functional on handheld tablets.
* The UI automatically reflows into high-density touch-optimized cards, expandable bottom sheets, and sticky action buttons for seamless one-handed tablet operation.

---

### Q15: Why are mobile tablets particularly valuable on the showroom floor?
**Answer:** Mobile tablets transform the customer buying experience and eliminate desk friction:
* 📍 **System Navigation Path:** Handheld Tablet &rarr; `Dashboard` &rarr; `+ New Walk-In Lead` OR `+ Quick Sale`
* **Side-by-Side Sales Engagement:** Sales reps walk alongside customers on the showroom floor, presenting technical specifications, battery chemistry benefits, and color options directly on screen.
* **Instant Digital Quotation:** Sales reps configure accessories (smart helmet, fast charger, rear top box) and financing plans on the spot, emailing or WhatsApping a formal PDF quote to the customer in seconds.
* **Instant Test-Ride Logging:** The customer's CNIC and driving license are scanned via tablet camera before the customer takes the demo bike onto the road.

---

### Q16: How do mechanics benefit from mobile tablet access in the workshop?
**Answer:** Electric vehicle servicing requires mobility around the vehicle chassis and high-voltage battery compartment:
* 📍 **System Navigation Path:** Handheld Tablet &rarr; `Sidebar: After-Sales & Workshop` &rarr; `Active Service Cases` (`/after-sales/warranty`)
* **Grease-Free Digital Workbenches:** Ruggedized tablets mounted on mobile tool carts allow technicians to tap inspection checklists without walking back and forth to a front-desk computer.
* **Photo Damage Evidence:** Mechanics snap high-resolution photos of collision scratches, cracked plastic fairings, or oxidized wire harnesses, attaching them directly to the customer's digital job card.
* **Live BMS Telemetry & Error Codes:** Technicians enter OBD trouble codes (e.g., `ERR-BMS-04: High Voltage Cell Imbalance`) and log cell voltages directly while testing the battery pack.

---

### Q17: What are the two active user login categories in the system today?
**Answer:** AJ EcoDrive operates with two specialized role environments:
* 📍 **System Navigation Path:** `Login Screen` (`/login`)

| User Category | Assigned Role Scope | Active Demo Credentials | Primary Screen Access |
| :--- | :--- | :--- | :--- |
| **Super Admin** | **Head Office Executive** (Nationwide Multi-Branch Scope) | `ADMIN` / `password123` | Master Action Centre, Procurement, Global Pricing, Branch Performance, System Audit Logs |
| **Branch Manager** | **Dealership Commander** (Scoped to Peshawar, Islamabad, Lahore, or Rawalpindi) | `PEW-01`, `ISB-01`, `LHE-01`, `RWP-01` / `password123` | Branch Dashboard, Floor Stock VINs, Walk-In Leads, POS & Booking, Showroom Petty Cash, Workshop Job Cards |

*On the live demonstration login page ([https://aj-eco-drive.vercel.app/login](https://aj-eco-drive.vercel.app/login)), clicking any role badge auto-fills the credentials instantly for frictionless demonstration.*

---

### Q18: What is the roadmap for individual staff logins in the future?
**Answer:** The platform's Role-Based Access Control (RBAC) security foundation is fully architected for granular role expansion:
* 📍 **System Navigation Path:** `Super Admin` &rarr; `Sidebar: System Administration` &rarr; `Staff Accounts & Permissions` (`/settings/users`)
* **Future Specialized Employee Roles:**
  * **Showroom Sales Executive:** Can capture walk-in leads, build quotations, and initiate sales orders (cannot view branch profit margins or approve discounts > 8%).
  * **Branch Cashier:** Can record customer payments, print receipts, and manage the daily cash drawer float (cannot alter sales pricing).
  * **Workshop Technician:** Can view repair job cards, log labour hours, and request replacement spare parts from the storekeeper.
  * **Inventory Storekeeper:** Can scan inbound delivery shipments, manage spare parts shelves, and conduct monthly blind cycle counts.

---

### Q19: How do users switch between Dark and Light display modes?
**Answer:** The interface includes a high-performance theme toggle engine:
* 📍 **System Navigation Path:** `Top Navigation Header` &rarr; `User Profile Avatar` &rarr; `Theme Preferences` (OR navigate to `/preferences`)
* **Light Mode:** High-contrast, clean daylight mode optimized for brightly lit showroom sales floors and outdoor delivery bays.
* **Dark Mode:** Sleek, low-glare dark palette reducing eye fatigue for evening accounting work, dim workshop bays, and executive command centers.
* **Instant Persistence:** Theme preference is saved to local storage immediately and persists seamlessly across computer reboots and browser refreshes.

---

### Q20: What happens if a salesperson leaves their workstation unattended?
**Answer:** Automatic idle session security prevents unauthorized access:
* 📍 **System Navigation Path:** `Settings & Security` &rarr; `Session Security Timeout`
* **60-Minute Idle Lockout:** If no mouse, keyboard, or touch interaction is detected for 60 minutes, the screen automatically locks.
* **Data Masking:** Customer CNIC numbers, cash drawer financial balances, profit margins, and supplier pricing are instantly blurred behind a secure PIN/password prompt.
* **Zero Work Disruption:** When the salesperson re-enters their password, their unsubmitted quotation or active POS form is restored exactly as they left it.

---

### Q21: What happens if an employee forgets their login password?
**Answer:** Secure self-service and managerial reset workflows:
* 📍 **System Navigation Path:** `Login Screen` &rarr; Click **"Forgot Password?"** Link (`/auth/forgot-password`)
* **Automated Reset:** The employee inputs their registered corporate email address (`staff@ajecodrive.com`) to receive a cryptographically signed one-time reset link valid for 15 minutes.
* **Managerial Reset Override:** Branch Managers and Super Admins can also issue an emergency temporary password from the Staff Administration workbench (`/settings/users`), forcing the employee to choose a new password upon their next login.

---

### Q22: Can a terminated employee still log into the system?
**Answer:** **No. Access termination is instant and nationwide.**
* 📍 **System Navigation Path:** `Super Admin` &rarr; `Sidebar: Settings & System` &rarr; `User Management` (`/settings/users`) &rarr; Select User &rarr; Toggle `Status: Inactive`
* **Immediate Token Revocation:** The moment Super Admin deactivates an employee account, all active JWT authentication tokens are blacklisted on the central server.
* **Offline Terminal Invalidation:** For local offline workstations, account deactivation instructions are broadcast during the next synchronization heartbeat, preventing cached logins.

---

### Q23: If an employee leaves the company, what happens to their historical sales and invoices?
**Answer:** **All historical records remain 100% immutable and permanent.**
* 📍 **System Navigation Path:** `Sidebar: Analytics & Reports` &rarr; `Audit Trail & Forensic Logs` (`/reports/audit-logs`)
* Every historical invoice, quotation, receipt, gate pass, and workshop job card permanently preserves the former employee's name, user ID, and exact creation timestamp.
* Customer relationships are preserved; historical commissions and sales performance remain locked for tax and legal compliance.

---

### Q24: How does a user safely log out at the end of their shift?
**Answer:** Through the secure session termination protocol:
* 📍 **System Navigation Path:** `Top Navigation Header` &rarr; `User Profile Dropdown` &rarr; Click **"Sign Out"**
* **Local Memory Purge:** Clicking Sign Out purges cached user tokens, clears active form state from temporary memory, commits any pending offline outbox items, and redirects the terminal to the secure login prompt.

---
[Back to Top / Navigation Index](#dealership-owners-quick-navigation--executive-index)

---

# PART 3: Morning Showroom Opening & System Daily Start (Q25 – Q36H)

### Q25: What is the very first screen a Branch Manager sees upon logging in each morning?
**Answer:** The **Showroom Operations Dashboard** (`/dashboard`). This command dashboard displays real-time operational KPI counters:
* 📍 **System Navigation Path:** `Login Screen` &rarr; `Branch Manager Role` &rarr; `Main Dashboard` (`/dashboard`)
* **Showroom Floor Bikes:** Number of physical vehicles currently available for immediate sale.
* **Today's Revenue:** Live PKR sales volume collected today.
* **Pending Deliveries:** Customers scheduled to collect their vehicles today.
* **Active Workshop Jobs:** Bikes currently undergoing maintenance or warranty repairs in the service bay.
* **Action Centre Alerts:** Urgent tasks awaiting managerial attention.

---

### Q26: What is the Morning Central Synchronization Routine?
**Answer:** At 08:30 AM when the showroom opens, launching the desktop workstation triggers the automated **Morning Central Synchronization Routine**:
* 📍 **System Navigation Path:** `Top Header Bar` &rarr; `Cloud Connectivity Badge` (`GREEN (ONLINE) / AMBER (OFFLINE)`)
1. Connects to the Head Office central database server.
2. Downloads overnight catalog price changes or promotional discount guidelines.
3. Downloads inbound transfer manifests (trucks dispatched from Central Warehouse or other cities).
4. Synchronizes customer service cases and online web inquiries.
5. Verifies the local business date and marks the branch connection status as **GREEN (ONLINE)**.

---

### Q27: What is the Quick Actions bar on the dashboard and top navigation, how does it speed up operations, and what is the difference between a Quick Sale (POS) and a Sales Order?
**Answer:** The Quick Actions suite is engineered to give dealership personnel instant, 1-click execution across all high-frequency dealership operations. It is accessible both globally via the top application header (`+ Quick Sale` button and `Quick Actions ⌄` dropdown) and centrally via the Showroom Dashboard Quick Actions action grid.
* 📍 **System Navigation Path:** `Any Screen` &rarr; `Top Navigation Bar` &rarr; `+ Quick Sale` (or `Quick Actions ⌄` dropdown) OR `Branch Manager Dashboard` &rarr; `Quick Actions Grid`

Crucially, **every Quick Action launches directly in-context as an active modal overlay**. Staff never lose their current workflow or page context—they simply fill the form, click submit, and receive instant confirmation.

#### 1. Complete Categorized Quick Actions Suite
* **Sales & Commercial Transactions:**
  * **+ Quick Sale / Point of Sale (POS)** (Directly launches `CreateSaleModal` in `mode="pos"`):
    * 📍 **System Navigation Path:** `Top Nav` &rarr; `+ Quick Sale` button (OR `Quick Actions ⌄` &rarr; `Point of Sale (POS)`)
    * Rapid checkout for ready showroom floor units. Instantly assigns physical VIN, captures full payment (or instant financing), updates unit status to `Sold/Ready for PDI`, and generates the customer invoice.
  * **+ New Order / Booking** (Directly launches `CreateSaleModal` in `mode="order"`):
    * 📍 **System Navigation Path:** `Top Nav` &rarr; `Quick Actions ⌄` &rarr; `New Order / Booking` OR `Sidebar: Sales & Revenue` &rarr; `Sales Orders` (`/sales/orders`) &rarr; `+ New Order`
    * Advance customer reservation, custom vehicle allocation, or pre-order booking against incoming shipments. Accepts booking deposits, marks stock as `Reserved`, and schedules future delivery milestones.
  * **+ New Walk-In Lead** (Directly launches `CreateLeadModal`):
    * 📍 **System Navigation Path:** `Top Nav` &rarr; `Quick Actions ⌄` &rarr; `New Walk-In Lead` OR `Sidebar: CRM & Leads` &rarr; `Walk-In Leads` (`/sales/leads`) &rarr; `+ Add Lead`
    * Rapid capture of showroom walk-in visitors, contact numbers, CNIC, interest tags, assigned sales representative, and test ride scheduling.
  * **+ New Quotation** (Directly launches `CreateQuotationModal`):
    * 📍 **System Navigation Path:** `Top Nav` &rarr; `Quick Actions ⌄` &rarr; `New Quotation` OR `Sidebar: Sales & Revenue` &rarr; `Quotations` (`/sales/quotations`) &rarr; `+ New Quotation`
    * Generates binding 7-day customer price quotations with dynamic financing calculators, accessory add-ons, and an automated 8% discount ceiling guard. Converts to a Sales Order in 1 click.
  * **+ Record Payment** (Directly launches `CreatePaymentModal`):
    * 📍 **System Navigation Path:** `Top Nav` &rarr; `Quick Actions ⌄` &rarr; `Record Payment` OR `Sidebar: Finance & Accounts` &rarr; `Customer Payments Ledger` (`/sales/payments`) &rarr; `+ Record Payment`
    * Immediately records customer collections (Cash, Pay Order, Cheque, Online IBFT, Credit Card), generates an official receipt, and reconciles pending invoice balances.
* **Showroom & Fleet Operations:**
  * **+ Stock Request** (Directly launches `CreateStockRequestModal`):
    * 📍 **System Navigation Path:** `Top Nav` &rarr; `Quick Actions ⌄` &rarr; `Stock Replenishment Request` OR `Sidebar: Inventory` &rarr; `Stock Requests` (`/inventory/stock-requests`) &rarr; `+ New Requisition`
    * Initiates formal stock replenishment requisitions to Central Warehouse when showroom floor inventory drops below safety thresholds.
  * **+ Inter-Branch Transfer** (Directly launches `CreateTransferModal`):
    * 📍 **System Navigation Path:** `Top Nav` &rarr; `Quick Actions ⌄` &rarr; `Inter-Branch Transfer` OR `Sidebar: Inventory` &rarr; `Transfers` (`/inventory/transfers`) &rarr; `+ Dispatch Transfer`
    * Dispatches vehicles between dealership branches (e.g., Peshawar to Islamabad) with carrier driver info, transit custody tracking, and physical VIN handovers.
  * **+ Log Showroom Expense** (Directly launches `CreateExpenseModal`):
    * 📍 **System Navigation Path:** `Top Nav` &rarr; `Quick Actions ⌄` &rarr; `Log Expense Voucher` OR `Sidebar: Finance & Accounts` &rarr; `Showroom Expenses` (`/finance/expenses`) &rarr; `+ Add Expense Voucher`
    * Records branch operating expenditures (tea, utility bills, maintenance). Expenses under PKR 15,000 deduct from the petty cash float; expenses exceeding PKR 15,000 route automatically to the CFO via Action Centre.
  * **+ Service Intake** (Directly launches `CreateCaseModal`):
    * 📍 **System Navigation Path:** `Top Nav` &rarr; `Quick Actions ⌄` &rarr; `Service Intake Case` OR `Sidebar: After-Sales & Workshop` &rarr; `Active Service Cases` (`/after-sales/warranty`) &rarr; `+ New Intake Job Card`
    * Checks customer electric bikes into the workshop service bay, logging odometer readings, symptoms, technician assignment, and warranty coverage status.
* **Super Admin Enterprise Actions:**
  * **+ Purchase Order / Sea Container Intake** (Directly launches `CreatePurchaseOrderModal`):
    * 📍 **System Navigation Path:** `Super Admin Dashboard` &rarr; `Sidebar: Procurement & OEM` &rarr; `Purchase Orders` (`/procurement/purchase-orders`) &rarr; `+ New Container PO`
    * Head Office procurement of CBU/CKD container shipments from international OEM manufacturers with Bill of Lading numbers and batch VIN tracking.

---

#### 2. Critical Operational Difference: Quick Sale (POS) vs. Sales Order (Booking) at Branch Manager Level
Dealerships operate with two distinct sales motions. Conflating them creates inventory chaos and cash reconciliation errors. AJ EcoDrive enforces a strict architectural and operational boundary between them:

| Dimension | Point of Sale (POS) / Quick Sale | Sales Order (Booking / Advance Order) |
| :--- | :--- | :--- |
| **Operational Intent** | **Immediate Over-the-Counter Fulfillment.** Customer walks in, selects a scooter physically sitting on the showroom floor, pays in full, and takes delivery today. | **Advance Reservation / Scheduled Fulfillment.** Customer orders a scooter arriving on an upcoming container, books a specific custom color, or pays a partial down payment. |
| **Inventory Impact** | **Instant VIN Allocation.** The exact physical chassis/VIN on the showroom floor is immediately assigned and moves from `Available` to `Sold` (or `PDI Ready`). | **Reservation Hold.** The model/SKU is marked as `Reserved`. Physical VIN assignment can be attached immediately or mapped to an inbound PO / Transfer truck. |
| **Payment Status** | **100% Paid or Instant Disbursal.** Invoice is marked `Paid`. Customer receives official Tax Invoice immediately. | **Partial / Deposit.** Accepts token/advance payment (e.g., PKR 25,000 booking deposit). Balance is tracked as `Unpaid` or `Partially Paid`. |
| **Gate Pass Issuance** | **Immediate Gate Pass Eligible.** Delivery gate pass can be printed immediately upon completion of the 6-point Pre-Delivery Inspection (PDI). | **Gate Pass Blocked.** The system physically locks and prohibits Gate Pass printing until the remaining financial balance reaches PKR 0. |
| **Workflow Path** | `Walk-In -> POS Modal -> Full Payment -> Instant VIN -> PDI -> Gate Pass` | `Lead/Quote -> Booking Order Modal -> Deposit Payment -> Inbound Stock Allocation -> Final Balance Settlement -> PDI -> Gate Pass` |

---

### Q28: How does the Branch Manager verify physical floor inventory against the system each morning?
**Answer:** The manager conducts a visual floor stock audit by matching physical showroom units against the active serialized digital ledger:
* 📍 **System Navigation Path:** `Branch Manager Dashboard` &rarr; `Left Sidebar: Inventory` &rarr; `Serialized Units / Floor Stock` (`/inventory/serialized-units?status=Available`)
* **Procedure:** The screen lists every physical vehicle assigned to the showroom with its Model Name, Frame/Chassis VIN, Motor Serial Number, and Battery Serial Number. The manager or floor supervisor conducts a quick walk-around visual verification to confirm every physical scooter on the showroom tiles matches the active digital ledger before customer entry.

---

### Q29: What is the morning procedure for the Showroom Cash Drawer Float?
**Answer:** The Showroom Cash Drawer Float is the dedicated physical currency reserve maintained in the branch cashier's till at the start of each business day. It guarantees that the branch can immediately provide cash change to paying customers and pay for minor day-to-day operational supplies without disrupting daily sales receipts.

* 📍 **System Navigation Path:**
  * **Primary Float Ledger:** `Branch Manager / Cashier Dashboard` &rarr; `Sidebar: Finance & Accounts` &rarr; `Showroom Expenses & Cash Drawer` (`/finance/expenses`)
  * **Payment Ledger:** `Sidebar: Finance & Accounts` &rarr; `Customer Payments Ledger` (`/sales/payments`)
  * **Quick Cash Logging:** `Top Navigation Bar` &rarr; `Quick Actions ⌄` &rarr; `Log Expense Voucher` (or `Record Payment`)

#### Mandatory 6-Step Morning Cash Drawer Float Procedure (08:35 AM):

1. **Dual-Key Safe Access & Physical Count (08:35 AM):**
   * The Branch Manager and Lead Cashier open the showroom safe and retrieve the cash till.
   * Physically count all currency notes in the float tray, sorting by denomination (PKR 5,000, 1,000, 500, 100, 50 notes).
2. **Reconciliation with Yesterday's Closing Balance:**
   * Navigate to `Finance & Accounts` &rarr; `Showroom Expenses & Cash Drawer` (`/finance/expenses`).
   * Verify that the physical cash count in hand **exactly matches** the system's recorded *Closing Float Carry-Forward* from the previous evening.
3. **Safe-to-Till Opening Float Transfer:**
   * Transfer the standard approved opening float (typically **PKR 10,000 to PKR 25,000**, depending on branch volume) from the master safe into the active counter cash drawer.
   * This float is reserved exclusively for giving customer change and daily operational necessities (tea, cleaning supplies, drinking water).
4. **Float Replenishment Threshold Check:**
   * If the opening cash balance has fallen below the branch emergency safety threshold (e.g., **PKR 5,000**), the manager must click `+ Quick Actions` &rarr; `Log Expense Voucher` or submit an *Emergency Float Reimbursement Requisition* to Head Office via the Action Centre (`/dashboard/action-centre`).
5. **Petty Cash Operating Expenditure Rules:**
   * **Minor OPEX (< PKR 15,000):** Paid directly from the petty cash float and logged immediately into `Finance` &rarr; `Expenses` with an attached photo receipt.
   * **Major OPEX (> PKR 15,000):** Cannot be paid out of the cash drawer without automated CFO approval through the Action Centre.
6. **Discrepancy Reporting & Zero-Variance Protocol:**
   * If any variance exists between the physical cash count and the system ledger (e.g., missing PKR 500), the manager must **NOT** alter past sales records.
   * The manager immediately clicks `Action Centre` (`/dashboard/action-centre`) &rarr; `Submit Cash Float Variance Notice` to document the discrepancy with an audit explanation before the first customer transaction begins.

---

### Q30: How does the system handle internet drops or power load-shedding in the morning?
**Answer:** In Pakistan, power cuts and internet outages are routine. AJ EcoDrive is architected with **Local Offline Durability**:
* 📍 **System Navigation Path:** `Top Header Bar` &rarr; `System Status Indicator` (Switches from `GREEN (ONLINE)` to `AMBER (OFFLINE)`)
* If the internet cable is cut or the local Wi-Fi router loses power, the desktop application seamlessly transitions to **AMBER (OFFLINE)** mode. Staff can continue creating customer leads, generating quotations, making sales, and printing receipts using the local SQLite database. All transactions queue in an Outbox and sync automatically to Head Office once connectivity restores.

---

### Q31: What should the manager do if an expected incoming delivery truck arrived overnight?
**Answer:** If an inter-branch transfer truck from Islamabad arrived overnight, the manager confirms inbound delivery:
* 📍 **System Navigation Path:** `Branch Manager Dashboard` &rarr; `Sidebar: Inventory` &rarr; `Transfers` &rarr; `Inbound Shipments Tab` (`/inventory/transfers?tab=inbound`)
* **Procedure:** Select the transfer manifest ID, physically scan each bike's chassis number barcode as it is unloaded from the carrier truck, check for exterior transit damage, and click **Confirm Receipt**. The vehicles immediately move from `In-Transit` status into the showroom's active `Available Floor Inventory`.

---

### Q32: How does the system alert the manager to scheduled customer delivery appointments?
**Answer:** The system highlights scheduled handovers through automated dashboard widgets:
* 📍 **System Navigation Path:** `Branch Manager Dashboard` &rarr; `Today's Scheduled Deliveries Widget` OR `Sidebar: Sales & Revenue` &rarr; `Sales Orders` (`/sales/orders?status=ReadyForDelivery`)
* **Procedure:** It lists customer names, vehicle models, VIN allocations, and scheduled handover times. This ensures the workshop team prepares the vehicle early—cleaning the bodywork, charging the lithium battery to 100% State of Charge (SOC), and completing the 6-point Pre-Delivery Inspection (PDI).

---

### Q33: How does the manager check for open service complaints from the previous day?
**Answer:** The manager audits open workshop repair orders and warranty tickets:
* 📍 **System Navigation Path:** `Branch Manager Dashboard` &rarr; `Sidebar: After-Sales & Workshop` &rarr; `Service Cases & Warranty` (`/after-sales/warranty?status=In-Progress`)
* **Procedure:** The screen filters all repair orders currently in progress, indicating which technician is working on each bike, whether replacement spare parts have arrived from the central warehouse, and whether any high-voltage battery warranty claims are awaiting Head Office approval.

---

### Q34: What is the morning team briefing routine supported by AJ EcoDrive?
**Answer:** Showroom managers guide the 09:00 AM staff huddle using live sales metrics:
* 📍 **System Navigation Path:** `Branch Manager Dashboard` &rarr; `Monthly Target vs Actual Sales Progress Bar` OR `Sidebar: Analytics & Reports` &rarr; `Sales Performance` (`/reports/sales-performance`)
* **Procedure:** The team reviews yesterday's closed deals, open hot leads requiring phone follow-ups, workshop bay turnaround times, and the remaining unit sales required to hit monthly sales commission targets.

---

### Q35: What happens if the system shows a catalog price update from Head Office?
**Answer:** When Head Office modifies a model's MSRP (e.g., due to foreign currency exchange fluctuations or factory price adjustments), a system alert is broadcast:
* 📍 **System Navigation Path:** `Top Navigation Bar` &rarr; `Notification Bell Icon` OR `Sidebar: Products & Catalog` &rarr; `Product Pricing` (`/catalog/products`)
* A notification banner appears: *"Catalog Updated: 2 Models Have New Base Prices"*. The new prices apply immediately to all newly created quotations and sales orders, preventing staff from selling bikes at outdated, unprofitable rates.

---

### Q36: How does the manager verify that receipt printers and barcode scanners are working?
**Answer:** Hardware peripherals are tested through the built-in device diagnostics utility:
* 📍 **System Navigation Path:** `Branch Manager Dashboard` &rarr; `Sidebar: Settings & System` &rarr; `Hardware & POS Peripherals` (`/settings/devices`)
* **Procedure:** The manager navigates to the Hardware screen, clicks **Print Test Slip**, and confirms that the thermal receipt printer outputs a clean test voucher with the dealership logo, tax registration number, and current date. The manager also scans a sample VIN barcode to verify the handheld scanner is responsive.

---

### Q36A: What is the Branch Snapshot on the Branch Manager Dashboard, where does each KPI tile redirect, and what does it display?
**Answer:** The **Branch Snapshot** is a 6-tile live operational widget located on the main dashboard (`/dashboard`) for branch managers. Every tile is an interactive drill-down button that navigates directly to the filtered operational workbench:
* 📍 **System Navigation Path:** `Branch Manager Dashboard` (`/dashboard`) &rarr; `Branch Snapshot Widget` (Upper Section)

| Snapshot KPI Tile | Live Metric Displayed | Exact System Navigation Path & Route | Operational Purpose & Workflow |
| :--- | :--- | :--- | :--- |
| **Open Orders** | Total active customer orders not yet delivered | `Sidebar: Sales & Revenue` &rarr; `Sales Orders` (`/sales/orders?status=Open`) | Opens the Sales Orders management workbench. Allows the manager to review pending customer agreements, allocate chassis VINs, and track payment balances. |
| **Available Stock** | Total physical vehicles on the showroom floor ready for sale | `Sidebar: Inventory` &rarr; `Serialized Units` (`/inventory/serialized-units?status=Available`) | Opens the Serialized Inventory screen filtered to Available bikes. Used to verify chassis numbers, exterior colors, and showroom display units. |
| **Reserved** | Units locked to confirmed customer deposits | `Sidebar: Inventory` &rarr; `Serialized Units` (`/inventory/serialized-units?status=Reserved`) | Opens the Serialized Inventory filtered to Reserved status. Verifies which VINs are locked to customer sales orders and awaiting final invoicing or PDI. |
| **Incoming** | In-transit stock transfer shipments en route to this branch | `Sidebar: Inventory` &rarr; `Transfers` (`/inventory/transfers?tab=inbound`) | Opens the Inter-Branch Transfers view. Used by the branch manager to inspect incoming freight trucks, verify carrier manifests, and confirm inbound delivery receipts. |
| **Low Stock** | Product models whose available units are below reorder threshold | `Sidebar: Inventory` &rarr; `Stock by Product` (`/inventory/stock-by-product?filter=low-stock`) | Opens the Stock by Product inventory screen with low-stock alert filters applied. Allows the manager to immediately submit a Stock Replenishment Request (`CreateStockRequestModal`). |
| **Service Cases** | Open workshop repair tickets and warranty complaints | `Sidebar: After-Sales & Workshop` &rarr; `Warranty & Service Desk` (`/after-sales/warranty?status=Open`) | Opens the Warranty & After-Sales Service desk. Displays customer bikes in the workshop, technician job assignments, and Lithium battery warranty claims. |

*Hovering over any Branch Snapshot card highlights the tile in emerald with an interactive arrow indicator, enabling 1-click drill-down.*

---

### Q36B: What is the Action Required table on the Branch Manager Dashboard, and where do the "Open ›" buttons and record badges redirect?
**Answer:** The **Action Required** table on the dashboard (`/dashboard`) is the central operational triage queue for the branch manager. It highlights urgent threshold breaches, pending regulatory approvals, and due tasks:
* 📍 **System Navigation Path:** `Branch Manager Dashboard` (`/dashboard`) &rarr; `Action Required Section`

1. **Priority Actions Row (High / Med Priority):**
   * **Scope of Tasks:** Incoming stock waiting to be received, inter-branch transfers ready to dispatch, low-stock reorder warnings, unpaid customer balances, and overdue customer follow-ups.
   * **Main "Open ›" Button & Row Click:** Redirects directly to `/dashboard/action-centre?priority=Critical` in the Action Centre.
   * **Direct Record Badge Links:** Branch managers can click the individual record code pills to jump directly to specific sub-modules:
     * `TR` &rarr; `Sidebar: Inventory` &rarr; **Inter-Branch Transfers** (`/inventory/transfers`)
     * `PO` &rarr; `Sidebar: Procurement` &rarr; **Purchase Orders & Receipts** (`/procurement/purchase-orders`)
     * `SKU` &rarr; `Sidebar: Inventory` &rarr; **Stock Replenishment Requests** (`/inventory/stock-requests`)
     * `ORD` &rarr; `Sidebar: Sales & Revenue` &rarr; **Sales Orders** (`/sales/orders`)
     * `LD` &rarr; `Sidebar: CRM & Leads` &rarr; **Walk-In Leads & Pipeline** (`/sales/leads`)

2. **Due / Overdue Row (Med / High Priority):**
   * **Scope of Tasks:** Showroom petty cash expense corrections, customer vehicle returns pending physical inspection, workshop warranty escalation tasks, and official Head Office executive directives.
   * **Main "Open ›" Button & Row Click:** Redirects directly to `/dashboard/action-centre?priority=High` in the Action Centre.
   * **Direct Record Badge Links:**
     * `EXP` &rarr; `Sidebar: Finance & Accounts` &rarr; **Showroom Expenses** (`/finance/expenses`)
     * `RET` &rarr; `Sidebar: Sales & Revenue` &rarr; **Vehicle Returns & Refunds** (`/sales/returns`)
     * `SC` &rarr; `Sidebar: After-Sales & Workshop` &rarr; **Service Cases & Workshop** (`/after-sales/warranty`)
     * `TASK` &rarr; `Sidebar: Dashboard` &rarr; **Action Centre Directives** (`/dashboard/action-centre`)

---

### Q36C: What are the 4 Top KPI Cards on the Branch Manager Dashboard and where do they redirect?
**Answer:** At the very top of the Branch Manager Dashboard, 4 high-level daily financial and operational cards provide instant visibility. Each card is interactive and clickable:
* 📍 **System Navigation Path:** `Branch Manager Dashboard` (`/dashboard`) &rarr; `Top Metric Header Row`
* **Today's Sales (PKR):** Clickable &rarr; Redirects to **Sales Orders** (`/sales/orders`) or **Sales Dashboard` (`/sales/dashboard`).
* **Units Sold:** Clickable &rarr; Redirects to **Sales Orders** (`/sales/orders`) to review closed vehicle deliveries.
* **Payments Collected (PKR):** Clickable &rarr; Redirects to **Customer Payments Ledger** (`/sales/payments`) to audit cash and bank collections.
* **Expenses (PKR):** Clickable &rarr; Redirects to **Showroom Expenses** (`/finance/expenses`) to monitor daily petty cash burn.

---

### Q36D: What are the explicit operational decision criteria for choosing between a "Quick Sale (POS)" and a "Sales Order (Booking)" at the showroom counter?
**Answer:** Showroom sales representatives and branch managers must evaluate four mandatory operational criteria when choosing which workflow to launch:
* 📍 **System Navigation Path:** `Top Header Bar` &rarr; `+ Quick Sale` button (POS Mode) OR `Top Header Bar` &rarr; `Quick Actions ⌄` &rarr; `New Order / Booking` (Booking Order Mode)

```
[Customer at Showroom Sales Counter]
                │
                ▼
      Is physical vehicle present
     on showroom floor right now? ────(NO: Backorder/Incoming)───► [Launch New Order / Booking]
                │
              (YES)
                ▼
    Is customer paying 100% in full
    today (Cash/IBFT/Instant Disbursal)? ───(NO: Token Deposit)────► [Launch New Order / Booking]
                │
              (YES)
                ▼
     Is customer taking delivery
     today (immediate PDI & Gate Pass)? ───(NO: Future Delivery)───► [Launch New Order / Booking]
                │
              (YES)
                ▼
   [Launch Point of Sale (POS) / Quick Sale]
   ↳ Instant physical VIN assigned
   ↳ Full invoice marked Paid
   ↳ Unit moved to Sold/Ready
   ↳ Pre-Delivery Inspection (PDI) unlocked
   ↳ Delivery Gate Pass eligible immediately
```

* **When to choose Point of Sale (POS) / Quick Sale (`CreateSaleModal` in `mode="pos"`):**
  1. The customer selects a physical electric bike currently displayed on the showroom floor tiles.
  2. The customer settles 100% of the invoice balance on the spot (Cash, credit card, or verified bank IBFT).
  3. The customer intends to ride or transport the vehicle out of the dealership premises today.
* **When to choose Sales Order / Vehicle Booking (`CreateSaleModal` in `mode="order"`):**
  1. **Advance Deposit / Partial Payment:** Customer pays a booking token (e.g. PKR 25,000) and will pay the remaining balance over days or weeks.
  2. **Incoming Stock Allocation:** Customer orders a specific color or model arriving on an upcoming sea container or inter-branch transfer truck.
  3. **Commercial Fleet / Institutional Bookings:** Corporate clients placing batch vehicle orders pending corporate PO verification.
  4. **Deferred Handover:** Customer buys today but requests delivery next Friday (vehicle is held in `Reserved` status so nobody else can buy it).

---

### Q36E: How do the financial and accounting ledger entries differ between a Point of Sale (POS) transaction and a Sales Order booking?
**Answer:** AJ EcoDrive enforces double-entry audit rigor to prevent revenue recognition errors and tax miscalculations:
* 📍 **System Navigation Path:** `Sidebar: Finance & Accounts` &rarr; `Financial Reports / General Ledger` (`/finance/general-ledger`)

| Financial / Accounting Aspect | Point of Sale (POS) / Quick Sale | Sales Order (Booking / Advance Order) |
| :--- | :--- | :--- |
| **Revenue Recognition** | **Immediate Commercial Revenue.** Recognized immediately in today's Income Statement upon invoice issuance. | **Deferred / Customer Advance Liability.** Token payments are credited to *Customer Advance Deposits (Liability)* until official delivery. |
| **Accounts Receivable** | **Zero Balance (PKR 0).** Customer account is cleared simultaneously with receipt posting. | **Active Balance Tracked.** Remaining unpaid amount sits in Accounts Receivable aging reports until final settlement. |
| **Tax Invoicing** | **Official FBR-Compliant Tax Invoice.** Generated immediately with unique serial number, QR verification, and GST line items. | **Pro-Forma Quotation / Booking Acknowledgment.** Official tax invoice is generated only upon final settlement and delivery handover. |
| **Inventory Asset Account** | **Inventory &rarr; Cost of Goods Sold (COGS).** Unit asset value moves immediately out of Showroom Floor Inventory into COGS. | **Floor Stock &rarr; Reserved Inventory.** Asset stays on dealership balance sheet as *Allocated/Reserved Stock* until Gate Pass issuance. |

---

### Q36F: What are the 9 Standard Dealership Operational Goals achieved via the Quick Actions menu?
**Answer:** The Quick Actions menu in the top navigation bar and dashboard action grid directly serves 9 core dealership goals:
* 📍 **System Navigation Path:** `Top Header Bar` &rarr; `Quick Actions ⌄` (or `+ Quick Sale` button)

1. **Goal 1: Instant Walk-In Customer Checkout** &rarr; `Point of Sale (POS)` (`CreateSaleModal` in `pos` mode): Finalizes floor sales in under 60 seconds with instant VIN assignment.
2. **Goal 2: Pipeline Lead Capture** &rarr; `New Walk-In Lead` (`CreateLeadModal`): Captures customer CNIC, phone number, test ride preference, and assigns a sales rep before the customer exits the door.
3. **Goal 3: Binding Price Commitments** &rarr; `New Quotation` (`CreateQuotationModal`): Issues formal 7-day price quotes with financing terms and automated 8% discount ceiling guards.
4. **Goal 4: Scheduled Fleet & Custom Bookings** &rarr; `New Order / Booking` (`CreateSaleModal` in `order` mode): Reserves incoming stock and records token deposits.
5. **Goal 5: Cash Reconciliation & Collections** &rarr; `Record Payment` (`CreatePaymentModal`): Reconciles cash, cheque, and IBFT deposits directly against open customer invoices.
6. **Goal 6: Floor Inventory Replenishment** &rarr; `Stock Replenishment Request` (`CreateStockRequestModal`): Triggers stock requisition from Central Warehouse when floor stock reaches low safety buffer.
7. **Goal 7: Multi-City Stock Rebalancing** &rarr; `Inter-Branch Transfer` (`CreateTransferModal`): Moves units between cities with carrier tracking and transit discrepancy logging.
8. **Goal 8: Petty Cash Governance** &rarr; `Log Expense Voucher` (`CreateExpenseModal`): Logs showroom OPEX (under PKR 15,000 petty cash; over PKR 15,000 auto-routes to CFO).
9. **Goal 9: After-Sales Service Intake** &rarr; `Service Intake Case` (`CreateCaseModal`): Checks customer bikes into the service bay with OBD trouble codes and technician job cards.

---

### Q36G: What is the mandatory 5-step Morning Showroom Opening Checklist every Branch Manager must complete before unlocking the customer entrance doors?
**Answer:** To ensure dealership security, floor safety, and zero inventory leakage, every Branch Manager follows this 5-step morning opening checklist between 08:30 AM and 09:00 AM:

1. **Step 1: Workstation Boot & Synchronization Check (08:30 AM):**
   * 📍 **System Navigation Path:** `Top Header Bar` &rarr; `Connectivity Badge`
   * Power on main counter PC, verify green **ONLINE** connectivity badge, and download overnight Head Office price updates or incoming transfer manifests.
2. **Step 2: Showroom Cash Drawer Float Count (08:35 AM):**
   * 📍 **System Navigation Path:** `Sidebar: Finance & Accounts` &rarr; `Showroom Expenses & Cash Drawer` (`/finance/expenses`)
   * Count physical cash notes in the safe and confirm the physical total matches the system opening cash float (typically PKR 15,000 to PKR 25,000).
3. **Step 3: Physical Floor Stock VIN Audit (08:45 AM):**
   * 📍 **System Navigation Path:** `Sidebar: Inventory` &rarr; `Serialized Units` (`/inventory/serialized-units?status=Available`)
   * Walk the showroom floor tiles with a handheld tablet or floor sheet to verify that every physical electric scooter's chassis VIN matches the **Available** units ledger.
4. **Step 4: Overnight Shipment & Transfer Intake (08:50 AM):**
   * 📍 **System Navigation Path:** `Sidebar: Inventory` &rarr; `Transfers` (`/inventory/transfers?tab=inbound`)
   * If carrier trucks arrived overnight, scan inbound VIN barcodes, log physical exterior condition, and confirm receipt in the system.
5. **Step 5: Morning Sales Huddle & Delivery Briefing (09:00 AM):**
   * 📍 **System Navigation Path:** `Branch Manager Dashboard` (`/dashboard`)
   * Review today's scheduled delivery appointments, hot leads needing phone follow-ups, and daily sales targets with showroom sales reps and workshop technicians before opening doors.

---

### Q36H: How does the system prevent staff from confusing a Sales Quotation with a Sales Order or Official Invoice?
**Answer:** AJ EcoDrive establishes clear visual, legal, and functional barriers between quotations, orders, and invoices:
* 📍 **System Navigation Path:** `Sidebar: Sales & Revenue` &rarr; `Quotations` (`/sales/quotations`) &rarr; Select Quotation &rarr; Click `Convert to Order` button
* **Watermark & Header Banners:** Quotations print with a prominent watermark: *"PRICE ESTIMATE — NOT AN INVOICE / NON-BINDING AFTER 7 DAYS"*.
* **No Inventory Allocation:** Creating a Quotation **does NOT reserve or lock physical stock**. Other showroom salespeople can freely sell that vehicle. Physical reservation only occurs when the quote is converted to an active Sales Order or POS transaction.
* **No Gate Pass Eligibility:** Security guards will strictly confiscate any vehicle attempting to exit with a Quotation or Pro-forma document. Gate Passes require a verified Tax Invoice with zero remaining balance.
* **1-Click Order Conversion:** When the customer returns within 7 days, clicking **"Convert to Order"** on the quotation screen converts it into an active Sales Order without re-entering customer CNIC, model specs, or discount terms.

---
[Back to Top / Navigation Index](#dealership-owners-quick-navigation--executive-index)

---

# SECTION II: CENTRAL COMMAND & COLLABORATION (THE ACTION CENTRE)

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
| **2. Pending Review** | Filters only active requests requiring an immediate managerial decision (`Pending` or `Under Review`). | Critical & High SLA items |
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
* When a Branch Manager submits an escalation (e.g. requesting a 12% discount on an electric scooter or claiming PKR 28,000 for showroom air-conditioner repair), the system marks the task as `Pending Head Office Review`.
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
* **Unique Action Code:** Reference ID (e.g., `ACT-PRC-1082`, `ACT-STK-2041`).
* **Category Badge:** Visual pill indicating Flow 1 (Commercial), Flow 2 (Stock), Flow 3 (OPEX), Flow 4 (Warranty), or Flow 5 (Governance).
* **Branch & Submitter:** Originating dealership name (e.g., *Peshawar Showroom*) and requesting manager's full name.
* **Financial Value / Asset Tag:** Monetary impact in PKR (e.g., *PKR 25,000 Discount Waiver*) or Chassis VIN reference.
* **Elapsed Time & SLA Badge:** Real-time urgency timer (e.g., *Elapsed: 42 mins — SLA: < 2h Critical*).
* **Justification Excerpt:** First 2 lines of the branch manager's business explanation.
* **Status Badge:** `Pending`, `Under Review`, `Approved`, `Rejected`, or `Counter-Offered`.

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
* Task cards render with large touch-friendly buttons (`Approve`, `Counter`, `Decline`).
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
* **System Action:** The quotation status sets to `Pending Commercial Approval` and routes to the Action Centre under `ACT-PRC-XXXX`.

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
* **Generated Code:** `ACT-STK-XXXX` with linked chassis VINs, carrier freight estimates, and origin/destination branches.

---

### Q58: What checks are performed before a Flow 2 Stock Reallocation is approved?
**Answer:** The system performs automated multi-point inventory checks:
* 📍 **System Navigation Path:** `Action Centre` &rarr; Select `ACT-STK` Item &rarr; `Inventory Impact Panel`
1. **Physical Availability Check:** Verifies the requested VIN is `Available` in origin inventory and not locked to another customer's sales deposit.
2. **Buffer Threshold Check:** Warns if dispatching the unit will drop the origin branch below its minimum showroom floor safety buffer.
3. **Logistics Transit Cost:** Displays estimated freight carrier cost (e.g., PKR 4,500 Islamabad to Peshawar) and carrier transit time (4 hours).

---

### Q59: What triggers a Flow 3 (High-Value OPEX) action item?
**Answer:** Flow 3 is triggered whenever a branch showroom operating expenditure exceeds the local discretionary limit:
* 📍 **System Navigation Path:** `Sidebar: Finance & Accounts` &rarr; `Showroom Expenses` (`/finance/expenses`) &rarr; Enter Amount > PKR 15,000
* **Discretionary Rule:**
  * **Expenses <= PKR 15,000:** Branch Manager approves locally; deducted directly from cash drawer petty cash.
  * **Expenses > PKR 15,000:** System automatically locks payment and creates a Flow 3 task (`ACT-EXP-XXXX`) routing to Head Office CFO.
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
* **System Action:** Generates `ACT-WRN-XXXX` and routes to Chief Technical Officer / Super Admin with attached OBD diagnostic logs.

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
* The missing VIN is permanently moved from `Available` to `Missing / Investigation Locked` status.
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
* `ACT-PRC-YYYY-XXXX` &rarr; Flow 1: Commercial & Pricing Waivers
* `ACT-STK-YYYY-XXXX` &rarr; Flow 2: Stock Reallocation & Transfers
* `ACT-EXP-YYYY-XXXX` &rarr; Flow 3: High-Value OPEX Claims
* `ACT-WRN-YYYY-XXXX` &rarr; Flow 4: Technical & Warranty Authorizations
* `ACT-GOV-YYYY-XXXX` &rarr; Flow 5: Inventory Governance & Cycle Count Adjustments

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
* **Flow 1 (Pricing):** Target <= 30 minutes (to close walk-in showroom deals on the spot).
* **Flow 2 (Stock Transfer):** Target <= 2 hours.
* **Flow 3 (OPEX):** Target <= 4 hours.
* **Flow 4 (Warranty):** Target <= 6 hours.
* **Flow 5 (Governance):** Target <= 24 hours.

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
* Clicking **"Send Counter-Offer"** changes status to `Counter-Offered` and notifies the branch sales desk immediately.

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
* Upon confirmation, the task closes as `Rejected` and logs into the permanent audit trail.

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
[Back to Top / Navigation Index](#dealership-owners-quick-navigation--executive-index)

---

# SECTION III: THE SHOWROOM SALES LIFECYCLE (WALK-IN TO DELIVERY)

---

# PART 7: Walk-In Customers & Capturing Sales Leads (Q85 – Q98)

### Q85: What happens when a prospective customer enters the showroom?
**Answer:** When a prospective customer enters the dealership, showroom staff initiate the digital sales pipeline:
* 📍 **System Navigation Path:** `Top Navigation Header` &rarr; `Quick Actions ⌄` &rarr; `New Walk-In Lead` (`CreateLeadModal`) OR `Sidebar: CRM & Leads` &rarr; `Walk-In Leads` (`/sales/leads`) &rarr; Click `+ Add Lead`
* **Procedure:** The sales representative captures the visitor's core profile—Full Name, Mobile Number (WhatsApp-enabled), City/Area, Interested EV Model (e.g., *BRG E-125 Commuter* or *Sprint Li-72*), Test Ride preference, and assigns an internal Sales Executive ID.
* **Instant CRM Tagging:** The lead is marked as \`Hot\` (ready to buy this week), \`Warm\` (evaluating budget/financing), or \`Cold\` (general inquiry), triggering automated follow-up scheduling.

---

### Q86: Why is capturing every walk-in lead mandatory in AJ EcoDrive?
**Answer:** Mandatory lead capture eliminates customer drop-off and tracks showroom footfall ROI:
* 📍 **System Navigation Path:** `Sidebar: CRM & Leads` &rarr; `Lead Pipeline Workbench` (`/sales/leads`)
* **Conversion Rate Analytics:** Dealership leadership tracks the exact conversion ratio from Showroom Walk-Ins &rarr; Test Rides &rarr; Quotations &rarr; Invoiced Sales.
* **Sales Rep Commission Attribution:** Guarantees that the salesperson who initially engaged the customer is credited if the customer returns days later to complete the purchase.

---

### Q87: How does the system record and schedule Customer Test Rides?
**Answer:** Through the built-in **Test Ride Verification Protocol**:
* 📍 **System Navigation Path:** `Lead Detail Page` (`/sales/leads/:id`) &rarr; Click **"Schedule Test Ride"**
* **Pre-Ride Verification Checklist:**
  1. Captures Customer CNIC / Driving License photo.
  2. Selects registered Showroom Demo Fleet Bike (e.g. `VIN-DEMO-PEW-01`).
  3. Records starting odometer reading and battery State of Charge (SOC &ge; 50%).
  4. Generates an electronic Test Ride Indemnity Slip with customer digital signature.

---

### Q88: What happens after the test ride is completed?
**Answer:** The salesperson logs immediate customer feedback:
* 📍 **System Navigation Path:** `Lead Detail Page` &rarr; Click **"Complete Test Ride"**
* **Post-Ride Data Entry:** Ending odometer reading, customer ride rating (1 to 5 stars), feedback on acceleration/braking/seat comfort, and next commercial step (e.g., *Prepare Financing Quotation*).

---

### Q89: How does the system prevent duplicate lead entries for the same customer?
**Answer:** Automated mobile number and CNIC de-duplication:
* 📍 **System Navigation Path:** `CreateLeadModal` &rarr; Real-time field validation
* When entering a mobile number (`03XX-XXXXXXX`) or 13-digit CNIC, the system queries the nationwide database. If a matching record exists, an alert pops up: *"Existing Lead Found: Assigned to [Sales Rep Name] in Peshawar"*, preventing conflicting sales attribution.

---

### Q90: Modal Guide — What is the CreateLeadModal (CreateLead.vue) and what are its exact fields?
**Answer:** The `CreateLeadModal` is the high-velocity popup used to register walk-in prospects in under 30 seconds:
* 📍 **System Navigation Path:** `Top Nav` &rarr; `Quick Actions ⌄` &rarr; `New Walk-In Lead` (`CreateLeadModal`)
* **Core Form Fields:**
  * **Customer Full Name** *(Text, Required)*: Primary buyer name.
  * **Mobile Phone Number** *(11-digit Phone, Required)*: Standard Pakistani format (`03001234567`).
  * **CNIC / B-Form** *(13-digit Numeric, Optional at Lead stage)*: NADRA citizen ID.
  * **Target EV Model** *(Dropdown, Required)*: Selects from active catalog models.
  * **Color Preference** *(Dropdown)*: Metallic Blue, Crimson Red, Pearl White, Matte Black.
  * **Lead Temperature / Priority** *(Select)*: `Hot (1-3 Days)`, `Warm (1-2 Weeks)`, `Cold (Browsing)`.
  * **Assigned Sales Representative** *(Dropdown)*: Active dealership staff member.
  * **Test Ride Requested** *(Toggle)*: Unlocks demo fleet scheduling.
  * **Source Channel** *(Select)*: Walk-In, Facebook / Instagram Ads, Referral, Outdoor Banner.

---

### Q91: How do sales reps view their daily follow-up task queue?
**Answer:** Through the **My Open Leads & Follow-ups** widget:
* 📍 **System Navigation Path:** `Sidebar: CRM & Leads` &rarr; `My Follow-ups Tab` (`/sales/leads?view=my-tasks`)
* Displays due phone calls, pending test ride reminders, and expiring quotations sorted by customer priority score.

---

### Q92: What automated WhatsApp messages are dispatched upon lead creation?
**Answer:** The system connects to official WhatsApp Business API:
* 📍 **System Navigation Path:** `Sidebar: Settings` &rarr; `Automated Messaging Templates`
* **Automated Welcome Message:** *"Dear [Customer Name], thank you for visiting AJ EcoDrive Peshawar! Here is the digital brochure for the [Model Name] you explored today: [Brochure Link]"*.

---

### Q93: Can a lead be reassigned to another salesperson?
**Answer:** Yes. Branch Managers have managerial reassignment permissions:
* 📍 **System Navigation Path:** `Sidebar: CRM & Leads` &rarr; Select Lead &rarr; Click **"Reassign Lead"**
* If a sales rep is on sick leave or fails to follow up within 48 hours, the manager reallocates the lead, updating the audit history with justification notes.

---

### Q94: How does the system handle corporate fleet inquiries?
**Answer:** By toggling **Lead Type: Corporate / Commercial**:
* 📍 **System Navigation Path:** `CreateLeadModal` &rarr; Toggle `Corporate Account`
* Unlocks fields for Company Name, NTN Tax Number, Fleet Size (e.g. 10 to 50 delivery bikes), and Corporate Procurement Officer contact details.

---

### Q95: How are lost leads recorded and analyzed?
**Answer:** Leads that choose not to purchase are closed with structured lost reason codes:
* 📍 **System Navigation Path:** `Lead Detail Page` &rarr; Click **"Mark as Lost"**
* **Reason Categories:** *Price Too High, Competitor Chosen (RoadPrince/Metro), Lack of Battery Charging Infrastructure, Financing Declined, Delivery Timeline Too Long*.
* Generates monthly lost-sale analytics for Head Office executive review.

---

### Q96: Can walk-in leads be converted directly into formal quotations in 1 click?
**Answer:** Yes. Seamless 1-click pipeline progression:
* 📍 **System Navigation Path:** `Lead Detail Page` &rarr; Click **"Convert to Quotation"**
* Pre-populates customer name, mobile number, CNIC, and selected model into `CreateQuotationModal` instantly without manual re-typing.

---

### Q97: What happens to old, dormant leads?
**Answer:** Automated archiving and re-engagement campaigns:
* 📍 **System Navigation Path:** `Sidebar: CRM & Leads` &rarr; `Archived / Dormant Leads`
* Leads inactive for > 60 days move to Dormant status and are targeted during seasonal promotional discount campaigns (e.g. *Eid Special Cashback Offer*).

---

### Q98: What performance metrics are tracked for showroom sales representatives?
**Answer:** The **Sales Rep Performance Scorecard**:
* 📍 **System Navigation Path:** `Sidebar: Analytics & Reports` &rarr; `Sales Rep Scorecards` (`/reports/sales-reps`)
* Tracks Total Leads Captured, Test Rides Conducted, Quotation Conversion %, Average Deal Margin %, and Total PKR Revenue Generated per month.

---
[Back to Top / Navigation Index](#dealership-owners-quick-navigation--executive-index)

---

# PART 8: Customer Registration, CNIC Verification & KYC (Q99 – Q112)

### Q99: Why is formal CNIC registration mandatory before selling an electric vehicle?
**Answer:** Electric vehicles are motorized transport assets subject to provincial transport authority laws, excise registration, and anti-theft regulations in Pakistan:
* 📍 **System Navigation Path:** `Sidebar: Customers` &rarr; `Customer Directory` (`/customers`) &rarr; `+ Register Customer` (`CreateCustomerModal`)
* **Legal & Regulatory Mandates:**
  1. **Excise & Taxation Registration:** The 13-digit Computerized National Identity Card (CNIC) is legally stamped onto the official vehicle registration book/card.
  2. **Anti-Theft & Serialized Ownership:** Binds the physical chassis VIN and Lithium Battery serial number to a verified citizen identity.
  3. **Warranty Protection:** Prevents unauthorized third parties from claiming warranty repairs on stolen or transferred components.

---

### Q100: How does AJ EcoDrive validate Pakistani CNIC numbers?
**Answer:** The system enforces standard NADRA 13-digit format validation:
* 📍 **System Navigation Path:** `CreateCustomerModal` &rarr; `CNIC Input Field`
* **Format:** `XXXXX-XXXXXXX-X` (e.g., `17301-8492019-3` for Khyber Pakhtunkhwa / Peshawar, `37405-XXXXXXX-X` for Rawalpindi/Islamabad).
* **Validation Algorithm:** Validates 13 numeric digits, structural hyphens, and gender checksum (odd last digit for males, even for females).

---

### Q101: Modal Guide — What is the CreateCustomerModal (CreateCustomer.vue) and what are its exact fields?
**Answer:** The `CreateCustomerModal` registers verified retail and commercial buyers into the central database:
* 📍 **System Navigation Path:** `Sidebar: Customers` &rarr; Click `+ Register Customer` OR Inside `CreateSaleModal` click `+ New Customer`
* **Exact Form Fields:**
  * **Customer Type** *(Select)*: `Individual Retail` or `Corporate / Commercial Entity`.
  * **Full Name (as per CNIC)** *(Text, Required)*: Exact legal citizen name.
  * **Father / Husband Name** *(Text)*: Required for vehicle excise registration forms.
  * **CNIC Number** *(13-digit Masked Input, Required)*: `XXXXX-XXXXXXX-X`.
  * **Mobile Number** *(Phone, Required)*: `03XX-XXXXXXX` with SMS/WhatsApp verification toggle.
  * **Alternate Phone** *(Phone, Optional)*: Secondary family or landline number.
  * **Residential Address** *(Textarea, Required)*: Permanent legal residence.
  * **City & District** *(Dropdown, Required)*: Peshawar, Islamabad, Rawalpindi, Lahore, etc.
  * **CNIC Front & Back Photos** *(File Upload)*: High-resolution scans for digital KYC record.

---

### Q102: How does the system handle corporate clients and fleet buyers during KYC?
**Answer:** Corporate KYC requires company tax and incorporation data:
* 📍 **System Navigation Path:** `CreateCustomerModal` &rarr; Select `Customer Type: Corporate`
* **Corporate Fields:** Company Legal Name, National Tax Number (NTN), Sales Tax Registration Number (STRN), Authorized Purchase Officer Name, and Official Company Stamp/Authorization Letter upload.

---

### Q103: Can a customer purchase a vehicle on behalf of a family member?
**Answer:** Yes, via the **Beneficiary / Registered Owner Assignment**:
* 📍 **System Navigation Path:** `CreateCustomerModal` &rarr; `Beneficiary Details Section`
* The system records the Payer Details (e.g., Father paying via bank cheque) and the Registered Vehicle Owner Details (e.g., Son whose CNIC will be attached to Excise registration).

---

### Q104: What happens if a customer has an existing record from another branch?
**Answer:** The customer profile is synchronized across all dealership locations:
* 📍 **System Navigation Path:** `Customer Directory` (`/customers`) &rarr; Search by CNIC or Phone
* If a customer registered in Islamabad walks into the Peshawar showroom, entering their CNIC instantly retrieves their verified KYC record, past vehicle purchase history, and service records.

---

### Q105: How are customer document scans (CNIC, driving license) stored securely?
**Answer:** Document attachments are encrypted and stored in secure cloud storage with strict access control:
* 📍 **System Navigation Path:** `Customer Profile Page` (`/customers/:id`) &rarr; `KYC Documents Tab`
* Sensitive documents are accessible only to Branch Managers, Compliance Officers, and Super Admins. Data is masked from unauthorized external access.

---

### Q106: Can a customer profile be edited after initial creation?
**Answer:** Yes, with audit logging:
* 📍 **System Navigation Path:** `Customer Profile Page` &rarr; Click **"Edit Profile"**
* Address, phone numbers, and email can be updated. Changing a verified CNIC number requires Managerial Authorization and logs a mandatory justification note in the audit trail.

---

### Q107: What is the "Customer Loyalty & Vehicle Ownership Summary"?
**Answer:** An interactive widget on the customer profile page:
* 📍 **System Navigation Path:** `Customer Profile Page` (`/customers/:id`) &rarr; `Fleet & Purchases Overview`
* Displays all electric scooters owned by the customer, active warranty statuses, total lifetime rupees spent, and lifetime workshop service visit count.

---

### Q108: How does the system handle non-Pakistani foreign nationals purchasing EVs?
**Answer:** By selecting **Identity Type: Passport / POC**:
* 📍 **System Navigation Path:** `CreateCustomerModal` &rarr; `Identity Type Dropdown` &rarr; `Passport / POC Card`
* Allows entering foreign passport numbers, visa validity dates, and embassy/workplace verification documents.

---

### Q109: What happens if a customer's CNIC has expired?
**Answer:** The system flags an alert:
* 📍 **System Navigation Path:** `CreateCustomerModal` &rarr; `CNIC Expiry Date Field`
* Warns the salesperson that an expired CNIC will be rejected by provincial Excise & Taxation departments, prompting the customer to provide a NADRA renewal token.

---

### Q110: How does AJ EcoDrive support GDPR / Data Privacy compliance?
**Answer:** Built-in customer data governance:
* 📍 **System Navigation Path:** `Sidebar: Settings` &rarr; `Data Privacy & Consent`
* Captures customer consent for marketing SMS/WhatsApp messages and provides data anonymization options upon formal legal request.

---

### Q111: Can showroom staff export customer lists to Excel?
**Answer:** **Only authorized Super Admins and Branch Managers have export permissions.**
* 📍 **System Navigation Path:** `Sidebar: Customers` &rarr; `Customer Directory` &rarr; `Export CSV / Excel`
* Sales representatives cannot export customer databases, preventing customer data theft by departing employees.

---

### Q112: How does customer registration connect to the FBR Tax Integration?
**Answer:** Verified customer CNIC/NTN numbers are automatically embedded into official electronic tax invoices:
* 📍 **System Navigation Path:** `Sidebar: Sales & Revenue` &rarr; `Invoices` (`/sales/invoices`)
* Complies with Federal Board of Revenue (FBR) POS invoicing regulations for serialized automotive goods in Pakistan.

---
[Back to Top / Navigation Index](#dealership-owners-quick-navigation--executive-index)

---

# PART 9: Formal Pricing & Customer Quotations (Q113 – Q128)

### Q113: What is the purpose of a formal Sales Quotation in AJ EcoDrive?
**Answer:** A Sales Quotation is a binding, professional price estimate issued to prospective buyers:
* 📍 **System Navigation Path:** `Top Nav` &rarr; `Quick Actions ⌄` &rarr; `New Quotation` (`CreateQuotationModal`) OR `Sidebar: Sales & Revenue` &rarr; `Quotations` (`/sales/quotations`) &rarr; `+ New Quotation`
* **Key Capabilities:**
  * Locks base vehicle MSRP, optional add-ons, registration fees, and promotional discounts for a guaranteed **7-day validity period**.
  * Dynamic financing calculator computing monthly installments, down payments, and bank markup.
  * Watermarked printable PDF quotation for customer bank loans and corporate procurement approvals.

---

### Q114: How long is a Sales Quotation valid?
**Answer:** Quotations are valid for **7 calendar days** by default:
* 📍 **System Navigation Path:** `CreateQuotationModal` &rarr; `Validity Period Field`
* After 7 days, the quote automatically transitions to \`Expired\` status, protecting the dealership from honoring outdated prices if Head Office updates catalog MSRP.

---

### Q115: What is the automated 8% Discount Ceiling Guard?
**Answer:** A built-in gross margin security rule:
* 📍 **System Navigation Path:** `CreateQuotationModal` &rarr; `Discount Percentage Input`
* **Rule:** Branch sales staff can grant up to an **8% discretionary discount** (e.g., PKR 19,600 on a PKR 245,000 scooter).
* **Ceiling Guard:** If a salesperson enters a discount **> 8%** (e.g. 12%), the system blocks immediate quotation printing and creates an Action Centre escalation (\`ACT-PRC-XXXX\`) requiring Head Office Super Admin approval.

---

### Q116: Modal Guide — What is the CreateQuotationModal (CreateQuotation.vue) and what are its exact fields?
**Answer:** The `CreateQuotationModal` is the dynamic price calculation workbench:
* 📍 **System Navigation Path:** `Top Nav` &rarr; `Quick Actions ⌄` &rarr; `New Quotation` (`CreateQuotationModal`)
* **Exact Form Fields:**
  * **Customer Selection** *(Dropdown / Search)*: Selects existing customer or opens `CreateCustomerModal`.
  * **EV Model Selection** *(Dropdown, Required)*: Base catalog model with live MSRP display.
  * **Exterior Color** *(Select)*: Available color variants.
  * **Base MSRP List Price (PKR)** *(Read-Only)*: Auto-filled from master catalog.
  * **Selected Accessories & Add-Ons** *(Multi-Select Checkboxes)*:
    * Smart Bluetooth Helmet (`+ PKR 6,500`)
    * High-Speed Fast Charger (`+ PKR 12,000`)
    * Rear Heavy-Duty Storage Box (`+ PKR 4,500`)
    * Anti-Theft GPS Tracker (`+ PKR 8,500`)
  * **Excise Registration & Number Plate Fee** *(Toggle/Input)*: `+ PKR 15,000`.
  * **Commercial Discount** *(Input: % or PKR)*: Governed by 8% ceiling guard.
  * **Payment Plan** *(Select)*: `Full Cash Settlement`, `Bank Lease / Auto Loan`, `In-House Installments`.
  * **Quotation Notes / Terms** *(Textarea)*: Custom delivery or warranty remarks.

---

### Q117: How does the built-in Financing & Installment Calculator work?
**Answer:** Real-time loan amortization computation:
* 📍 **System Navigation Path:** `CreateQuotationModal` &rarr; `Payment Plan: Financing / Lease`
* Sales reps input Down Payment (e.g. 30% / PKR 73,500), Loan Tenure (12, 24, or 36 months), and Bank Markup Rate (e.g. 18%).
* The system instantly computes Monthly Installment (e.g., PKR 16,840/month) and total markup, printing a complete repayment schedule on the quotation.

---

### Q118: Does creating a Quotation reserve physical stock on the showroom floor?
**Answer:** **No. A Quotation does NOT reserve or lock physical inventory.**
* 📍 **System Navigation Path:** `Sidebar: Inventory` &rarr; `Serialized Units` (`/inventory/serialized-units`)
* Other showroom salespeople can freely sell that vehicle. Physical inventory allocation only occurs when the quotation is officially converted into a **Sales Order** or **Point of Sale (POS)** transaction with a captured cash deposit.

---

### Q119: How does a salesperson convert a Quotation into a confirmed Sales Order?
**Answer:** Through 1-click order conversion:
* 📍 **System Navigation Path:** `Sidebar: Sales & Revenue` &rarr; `Quotations` (`/sales/quotations`) &rarr; Select Quote &rarr; Click **"Convert to Order"**
* Copies customer profile, pricing, discount terms, and accessories into `CreateSaleModal` in `order` mode, prompting the cashier to record the booking deposit.

---

### Q120: Can a quotation be printed as an official branded PDF?
**Answer:** Yes. Professional PDF generation:
* 📍 **System Navigation Path:** `Quotation Detail Page` &rarr; Click **"Print Quotation PDF"**
* Generates a branded document featuring dealership logo, branch address, contact numbers, technical specifications, payment terms, and a clear *"PRICE ESTIMATE — NOT AN INVOICE"* legal banner.

---

### Q121: How are quotation discounts tracked in branch financial reports?
**Answer:** Through the **Discounts & Margins Variance Report**:
* 📍 **System Navigation Path:** `Sidebar: Analytics & Reports` &rarr; `Discount Variance Report` (`/reports/discounts`)
* Audits total rupees discounted per branch, identifying sales reps who consistently discount above company averages.

---

### Q122: What happens if Head Office increases catalog prices while a quotation is active?
**Answer:** Active quotations within their 7-day window are honored:
* 📍 **System Navigation Path:** `Sidebar: Sales & Revenue` &rarr; `Quotations`
* The system respects the price locked on the active quotation until its expiration date, ensuring commercial trust with the customer.

---

### Q123: Can a customer request multiple model options on a single quotation?
**Answer:** Yes, multi-model comparison quotes:
* 📍 **System Navigation Path:** `CreateQuotationModal` &rarr; Click **"+ Add Model Comparison"**
* Generates a side-by-side comparison (e.g. *E-125 Lead Acid vs. E-125 Lithium-Ion*) displaying specs, range, charging time, and monthly installments.

---

### Q124: How does the system prevent unauthorized staff from altering approved quotation discounts?
**Answer:** Cryptographic version hashing:
* 📍 **System Navigation Path:** `Quotation Detail Page` &rarr; `Version History Tab`
* Once an Action Centre pricing waiver is approved, the quotation terms are locked. Any attempt to modify the price generates a new revision that restarts the approval process.

---

### Q125: How does the system handle trade-in (used petrol bike exchange) valuations?
**Answer:** Through the **Trade-In / Buyback Module**:
* 📍 **System Navigation Path:** `CreateQuotationModal` &rarr; `Trade-In Exchange Section`
* Evaluator inputs used petrol bike details (e.g., *2022 Honda CG-125, Assessed Value: PKR 95,000*), which deducts as a direct credit against the new electric scooter purchase.

---

### Q126: Can a quotation be sent directly to customer WhatsApp?
**Answer:** Yes, 1-click WhatsApp dispatch:
* 📍 **System Navigation Path:** `Quotation Detail Page` &rarr; Click **"Send via WhatsApp"**
* Formats a clean WhatsApp summary message with a direct secure link to download the official PDF quotation.

---

### Q127: How are lost or cancelled quotations tracked?
**Answer:** Structured quotation cancellation workflow:
* 📍 **System Navigation Path:** `Quotation Detail Page` &rarr; Click **"Cancel Quotation"**
* Captures cancellation reason (*Competitor Bought / Budget Cancelled / Financing Rejected*), updating sales pipeline analytics.

---

### Q128: What is the Quotation Conversion Velocity metric?
**Answer:** Tracks how fast quotes turn into cash:
* 📍 **System Navigation Path:** `Sidebar: Analytics & Reports` &rarr; `Sales Pipeline Metrics`
* Measures average days elapsed between quotation issuance and final sales order conversion across branches (Target: &le; 4.2 days).

---
[Back to Top / Navigation Index](#dealership-owners-quick-navigation--executive-index)

---

# PART 10: Instant Point of Sale (POS) & Sales Order Confirmation (Q129 – Q144)

### Q129: What is the Point of Sale (POS) workbench in AJ EcoDrive?
**Answer:** The Point of Sale (POS) is the high-velocity showroom counter checkout engine designed for immediate over-the-counter vehicle sales:
* 📍 **System Navigation Path:** `Top Navigation Header` &rarr; `+ Quick Sale` button (OR `Quick Actions ⌄` &rarr; `Point of Sale (POS)`) OR `Sidebar: Sales & Revenue` &rarr; `Point of Sale` (`/sales/pos`)
* **Operational Flow:**
  1. Select walk-in customer.
  2. Select physical showroom floor unit (scans chassis VIN barcode).
  3. Capture 100% full payment (Cash, Card, Online IBFT).
  4. Unit status instantly updates to `Sold / PDI Ready`.
  5. Official FBR Tax Invoice and Delivery Receipt print in under 60 seconds.

---

### Q130: What is the fundamental difference between Point of Sale (POS) and a Sales Order?
**Answer:** AJ EcoDrive enforces an absolute operational and financial boundary between them:
* 📍 **System Navigation Path:** `CreateSaleModal` (`mode="pos"` vs `mode="order"`)

| Dimension | Point of Sale (POS) / Quick Sale | Sales Order (Booking / Advance Order) |
| :--- | :--- | :--- |
| **Operational Intent** | **Immediate Fulfillment:** Customer takes physical showroom floor bike today. | **Scheduled Fulfillment:** Customer books incoming container stock or custom color. |
| **Inventory Impact** | **Instant VIN Allocation:** Moves from `Available` to `Sold`. | **Reservation Hold:** Moves from `Available` to `Reserved`. |
| **Payment Status** | **100% Fully Settled:** Cashier records full invoice amount. | **Partial / Token Deposit:** Records advance (e.g. PKR 25,000); balance remains open. |
| **Gate Pass Issuance** | **Immediate Gate Pass Eligible** after 6-point PDI. | **Gate Pass Blocked** until remaining balance reaches PKR 0. |

---

### Q131: What happens if a salesperson tries to sell a vehicle for less than the approved price at POS?
**Answer:** Hard price floor locking:
* 📍 **System Navigation Path:** `CreateSaleModal` &rarr; `Price Override Protection`
* The POS engine strictly prohibits entering a net sale price below minimum authorized margins. If a discount > 8% was not approved in the Action Centre, the POS checkout button remains physically locked.

---

### Q132: Modal Guide — What is the CreateSaleModal (CreateSale.vue) and what are its exact fields?
**Answer:** The `CreateSaleModal` is the master commercial execution modal supporting both POS and Booking modes:
* 📍 **System Navigation Path:** `Top Nav` &rarr; `+ Quick Sale` (POS) OR `Quick Actions ⌄` &rarr; `New Order / Booking` (Order)
* **Exact Form Fields:**
  * **Sale Mode** *(Internal Toggle)*: `mode="pos"` (Instant POS) or `mode="order"` (Booking Order).
  * **Customer Selection** *(Search / Dropdown)*: Selects verified customer with CNIC display.
  * **Product Model** *(Dropdown, Required)*: Active EV model (e.g., *BRG E-125 Lithium*).
  * **Chassis / VIN Selection** *(Dropdown / Barcode Scanner)*:
    * In POS Mode: Lists only `Available` physical units on showroom floor.
    * In Order Mode: Can select Available stock OR assign to Inbound Container PO.
  * **Battery Serial & Controller Serial** *(Auto-Filled upon VIN selection)*: 3-way hardware binding.
  * **Base MSRP List Price (PKR)** *(Read-Only)*: Official retail price.
  * **Accessories & Add-ons** *(Checkboxes)*: Fast charger, smart helmet, tracker.
  * **Discounts Applied** *(Input)*: Validated against 8% ceiling.
  * **Excise Registration Fee** *(Input)*: Provincial registration charges.
  * **Payment Method & Split Tender** *(Select/Input)*:
    * Cash in Hand (PKR)
    * Credit / Debit Card (Bank POS Terminal Auth Code)
    * Online Bank IBFT (Bank Transaction UTR Reference)
    * Cheque / Pay Order (Cheque Number & Bank Name)
  * **Initial Amount Paid (PKR)** *(Numeric, Required)*:
    * POS Mode: Must equal 100% Total Amount.
    * Order Mode: Accepts partial token deposit (min. PKR 20,000).

---

### Q133: How does the system allocate physical Chassis VIN numbers at POS checkout?
**Answer:** Direct physical barcode scanning:
* 📍 **System Navigation Path:** `CreateSaleModal` &rarr; `Chassis VIN Field` &rarr; Scan with USB Barcode Gun
* Sales reps scan the physical barcode stamped on the scooter's steering stem. The system instantly verifies that the chassis is physically in local showroom inventory, matches the customer's selected color, and is not locked to another customer.

---

### Q134: Can a single sale be split across multiple payment methods (e.g. Cash + Bank IBFT)?
**Answer:** Yes. **Split-Tender Payment Processing**:
* 📍 **System Navigation Path:** `CreateSaleModal` &rarr; `Payment Section` &rarr; Click **"+ Add Payment Method"**
* Example: Total Invoice PKR 245,000 &rarr; Customer pays **PKR 100,000 Cash** at the counter + **PKR 145,000 via Online Bank IBFT Transfer**. The system records both ledger lines under a single consolidated receipt.

---

### Q135: What thermal receipt printers are supported at POS checkout?
**Answer:** Standard POS thermal printers:
* 📍 **System Navigation Path:** `Sidebar: Settings` &rarr; `Hardware & POS Peripherals` (`/settings/devices`)
* Supports standard **80mm and 58mm thermal POS receipt printers** (Epson, Xprinter, Rongta) via USB or LAN, printing high-contrast tax receipts with QR codes in 1.2 seconds.

---

### Q136: Why is the Delivery Gate Pass blocked immediately after creating a Sales Order?
**Answer:** Strict asset leakage prevention:
* 📍 **System Navigation Path:** `Sidebar: Sales & Revenue` &rarr; `Delivery Gate Passes` (`/sales/deliveries`)
* When a Sales Order is booked with a partial deposit, the vehicle status is `Reserved`. The system physically disables and locks the **"Generate Gate Pass"** button until the remaining balance is paid in full (Balance = PKR 0).

---

### Q137: What happens to a Sales Order if a customer requests a color change before delivery?
**Answer:** Secure VIN re-allocation:
* 📍 **System Navigation Path:** `Sales Order Detail Page` (`/sales/orders/:id`) &rarr; Click **"Re-allocate VIN / Color"**
* Manager releases the original reserved chassis (reverts to `Available`) and assigns a new available VIN matching the customer's updated color preference.

---

### Q138: How does the system handle corporate Purchase Orders (PO) at sales order entry?
**Answer:** Corporate Credit Billing:
* 📍 **System Navigation Path:** `CreateSaleModal` &rarr; `Payment Method: Corporate PO / Credit`
* Attaches Corporate PO Number and 30-day payment milestone terms, routing invoice balance to Accounts Receivable aging ledger.

---

### Q139: Can an in-progress POS sale be put "On Hold" if a customer steps out to get cash?
**Answer:** Yes. **Hold / Resume Cart Engine**:
* 📍 **System Navigation Path:** `CreateSaleModal` &rarr; Click **"Hold Transaction"**
* Parks the active transaction in the POS Hold Queue, temporarily holding the VIN for 45 minutes while allowing the cashier to serve other customers.

---

### Q140: How does the system prevent double-selling the same chassis VIN?
**Answer:** Instant database row-level locking:
* 📍 **System Navigation Path:** Database Engine & UI Validation
* The exact millisecond a salesperson selects a VIN in `CreateSaleModal`, the unit is locked with a temporary reservation mutex. If another salesperson on another tablet attempts to select the same VIN, the system displays: *"VIN Locked: Currently in checkout with Sales Rep [Name]"*.

---

### Q141: What happens if the customer's bank card payment declines at POS?
**Answer:** Graceful payment retry:
* 📍 **System Navigation Path:** `CreateSaleModal` &rarr; `Payment Verification Step`
* The transaction is not committed. The cashier can retry the card, switch to Cash/IBFT, or save the transaction as a pending Booking Order.

---

### Q142: How are sales commissions attributed to showroom staff?
**Answer:** Direct Sales Representative tagging:
* 📍 **System Navigation Path:** `CreateSaleModal` &rarr; `Sales Executive Field`
* The system logs the selling employee's ID, automatically computing monthly commission bonuses based on company margin tiers.

---

### Q143: Can a completed POS sale be edited after the invoice is generated?
**Answer:** **No. Invoiced sales are legally immutable.**
* 📍 **System Navigation Path:** `Sidebar: Sales & Revenue` &rarr; `Invoices` (`/sales/invoices`)
* To correct an error, the branch manager must initiate an official **Sales Return / Credit Note** (`CreateReturnModal`), which requires audit justification and manager sign-off.

---

### Q144: What is the Daily Sales Velocity metric on the Branch Dashboard?
**Answer:** Live daily sales counter:
* 📍 **System Navigation Path:** `Branch Manager Dashboard` (`/dashboard`) &rarr; `Units Sold KPI Card`
* Displays total units sold today vs daily branch sales target, updating in real time with celebratory visual animations upon target achievement.

---
[Back to Top / Navigation Index](#dealership-owners-quick-navigation--executive-index)

---

# PART 11: Invoicing, Deposits & Customer Money Collections (Q145 – Q158)

### Q145: How does AJ EcoDrive handle customer money collections and receipts?
**Answer:** All cash, cheque, and electronic collections are governed by the **Customer Payments Ledger**:
* 📍 **System Navigation Path:** `Top Nav` &rarr; `Quick Actions ⌄` &rarr; `Record Payment` (`CreatePaymentModal`) OR `Sidebar: Finance & Accounts` &rarr; `Customer Payments` (`/sales/payments`) &rarr; Click `+ Record Payment`
* **Core Rule:** Every single Rupee entering the dealership must be linked directly to a verified customer, an official sales order/invoice ID, and a designated bank or cashier till account.

---

### Q146: What payment methods are supported in the system?
**Answer:** Complete multi-tender payment processing:
* 📍 **System Navigation Path:** `CreatePaymentModal` &rarr; `Payment Method Dropdown`
1. **Cash in Till:** Physical currency deposited into branch cashier safe.
2. **Online Bank IBFT (Inter-Bank Fund Transfer):** Direct electronic transfer to corporate bank account (Meezan Bank, HBL, Bank Alfalah).
3. **Credit / Debit Card (POS Terminal):** Card swipe with terminal authorization slip attachment.
4. **Cheque / Banker's Pay Order:** Direct clearing with cheque number, issuing bank, and clearing date tracking.
5. **Bank Auto Financing / Lease Disbursement:** Direct settlement from leasing bank.

---

### Q147: Modal Guide — What is the CreatePaymentModal (CreatePayment.vue) and what are its exact fields?
**Answer:** The `CreatePaymentModal` records money collections and generates official receipts:
* 📍 **System Navigation Path:** `Top Nav` &rarr; `Quick Actions ⌄` &rarr; `Record Payment` (`CreatePaymentModal`)
* **Exact Form Fields:**
  * **Customer Selection** *(Search / Dropdown, Required)*: Selects paying customer.
  * **Linked Invoice / Sales Order** *(Dropdown, Required)*: Shows open orders with outstanding balance.
  * **Payment Purpose** *(Select)*: `Booking Deposit`, `Milestone Installment`, `Final Balance Settlement`, `Workshop Repair Payment`.
  * **Payment Method** *(Select, Required)*: Cash, IBFT, Credit Card, Cheque, Pay Order.
  * **Amount Paid (PKR)** *(Numeric, Required)*: Amount collected today.
  * **Bank Account Deposited Into** *(Dropdown)*: Branch Cash Safe, Meezan Main Account, HBL Ops Account.
  * **Bank Transaction Reference / UTR** *(Text)*: Mandatory for online IBFT.
  * **Cheque Number & Bank Name** *(Text)*: Mandatory for cheque collections.
  * **Payment Slip / Receipt Photo** *(File Upload)*: Bank deposit slip scan.
  * **Internal Notes** *(Textarea)*: Cashier audit remarks.

---

### Q148: What is an official FBR-Compliant Tax Invoice in AJ EcoDrive?
**Answer:** The official legal commercial invoice generated upon full settlement:
* 📍 **System Navigation Path:** `Sidebar: Sales & Revenue` &rarr; `Invoices` (`/sales/invoices/:id`) &rarr; Click **"Print Tax Invoice"**
* **Invoice Header:** Dealership Legal Name, Branch Address, NTN, STRN, Customer Name, CNIC, and unique Invoice Number (`INV-PEW-2026-XXXX`).
* **Line Items:** Base EV Model, Chassis VIN, Motor Serial, Battery Serial, Spare Parts, Excise Registration, GST Sales Tax breakdown (18%), and Total Amount Paid (PKR).

---

### Q149: How does the system handle booking token deposits?
**Answer:** Automated Customer Advance Accounting:
* 📍 **System Navigation Path:** `Sidebar: Finance & Accounts` &rarr; `Customer Advance Deposits` (`/finance/advances`)
* When a customer pays a PKR 25,000 token deposit on an upcoming electric scooter, the system logs a credit to *Customer Advance Liabilities* and issues an official **Booking Deposit Receipt**. The customer's sales order reflects: *Total: PKR 245,000 — Paid: PKR 25,000 — Remaining Balance: PKR 220,000*.

---

### Q150: What happens when a customer pays the final remaining balance?
**Answer:** Automatic status reconciliation:
* 📍 **System Navigation Path:** `Sidebar: Sales & Revenue` &rarr; `Sales Orders` (`/sales/orders/:id`) &rarr; Click **"Record Final Settlement"**
* Balance updates to **PKR 0.00**, invoice marks `Fully Paid`, and the vehicle unlocks for **Pre-Delivery Inspection (PDI)** and **Delivery Gate Pass** generation.

---

### Q151: How does the system verify Online Bank IBFT transfers?
**Answer:** Unique Bank UTR Transaction Reconciliation:
* 📍 **System Navigation Path:** `CreatePaymentModal` &rarr; `Bank Reference Field`
* The cashier inputs the 12-digit bank transaction reference from the customer's mobile banking app and attaches a screenshot. Branch Managers cross-verify against the online banking portal before authorizing delivery.

---

### Q152: What happens if a customer's cheque bounces?
**Answer:** Cheque dishonor workflow:
* 📍 **System Navigation Path:** `Sidebar: Finance & Accounts` &rarr; `Customer Payments` &rarr; Select Cheque Payment &rarr; Click **"Mark Dishonored / Bounced"**
* Reverses the payment entry, adds a PKR 1,500 bank penalty surcharge, reverts invoice status to `Unpaid`, and immediately locks vehicle delivery.

---

### Q153: Can a customer pay in foreign currency (USD / AED)?
**Answer:** Standard protocol requires conversion to PKR:
* 📍 **System Navigation Path:** `CreatePaymentModal` &rarr; `Notes Section`
* Cashier converts foreign currency through authorized exchange and deposits equivalent PKR into the till with attached currency exchange receipt.

---

### Q154: How are daily cash collections reconciled against the bank deposit slip?
**Answer:** Daily Cash Drop Reconciliation:
* 📍 **System Navigation Path:** `Sidebar: Finance & Accounts` &rarr; `Daily Cash Reconciliations` (`/finance/cash-drops`)
* Branch Manager packages physical cash collections, deposits them at the local bank branch, and uploads the stamped bank deposit slip, reconciling cashier till to PKR 0 balance.

---

### Q155: What safeguards prevent cashier cash theft or skimming?
**Answer:** Multi-layer financial audit controls:
* 📍 **System Navigation Path:** `Sidebar: Analytics & Reports` &rarr; `Cash Audit Logs`
* System receipts are sequentially numbered with encrypted QR codes. Customer receives an instant SMS verification of amount paid. Unrecorded cash cannot unlock Delivery Gate Passes.

---

### Q156: How does the system handle overpayments or excess customer change?
**Answer:** Customer Credit Balance Ledger:
* 📍 **System Navigation Path:** `Customer Profile Page` &rarr; `Credit Ledger Tab`
* Any excess payment is credited to the customer's wallet balance, automatically available for future workshop services or accessories.

---

### Q157: Can an official payment receipt be re-printed?
**Answer:** Yes, with duplicate watermark:
* 📍 **System Navigation Path:** `Sidebar: Finance & Accounts` &rarr; `Customer Payments` &rarr; Select Payment &rarr; Click **"Reprint Receipt"**
* Prints an exact copy watermarked with *"DUPLICATE RECEIPT — ORIGINAL ISSUED ON [DATE]"*.

---

### Q158: What is the Outstanding Accounts Receivable Aging Report?
**Answer:** Tracks unpaid customer and corporate balances:
* 📍 **System Navigation Path:** `Sidebar: Analytics & Reports` &rarr; `Accounts Receivable Aging` (`/reports/ar-aging`)
* Categorizes open balances by age: `Current (0-30 Days)`, `Overdue (31-60 Days)`, `Critical (61-90 Days)`, `Default Risk (> 90 Days)`.

---
[Back to Top / Navigation Index](#dealership-owners-quick-navigation--executive-index)

---

# PART 12: Pre-Delivery Inspection (PDI) & Official Gate Pass Handover (Q159 – Q174)

### Q159: What is Pre-Delivery Inspection (PDI) in AJ EcoDrive?
**Answer:** Pre-Delivery Inspection (PDI) is the mandatory 6-point technical and safety audit conducted by certified workshop technicians immediately before handing over an electric vehicle to a customer:
* 📍 **System Navigation Path:** `Sidebar: Sales & Revenue` &rarr; `Sales Orders` (`/sales/orders/:id`) &rarr; Click **"Start PDI Checklist"** (`CreateDeliveryHandoverModal`)
* **Core Objective:** Guarantees that every electric scooter leaving the showroom floor is 100% roadworthy, physically pristine, electrically balanced, and safe to ride.

---

### Q160: What are the 6 Mandatory Checkpoints in the PDI Checklist?
**Answer:** The system enforces a comprehensive technical verification:
* 📍 **System Navigation Path:** `CreateDeliveryHandoverModal` &rarr; `6-Point PDI Tab`

```
┌────────────────────────────────────────────────────────────────────────┐
│                   6-POINT PRE-DELIVERY INSPECTION (PDI)                │
├────────────────────────────────────────────────────────────────────────┤
│  [✓] 1. Battery State of Charge (SOC): Charged to 100% & Balanced      │
│  [✓] 2. Smart BMS Diagnostics: 0 Fault Codes & Stable Cell Voltages    │
│  [✓] 3. Braking & Throttle Safety: Hydraulic Disc Pressure Verified    │
│  [✓] 4. Electrical System: LED Headlight, Indicators, Horn & LCD Meter │
│  [✓] 5. Mechanical Integrity: Tyre Pressure (32 PSI) & Torque Checked  │
│  [✓] 6. Cosmetic & Accessories: Zero Transit Scratches + Charger/Keys  │
└────────────────────────────────────────────────────────────────────────┘
```

1. **Battery State of Charge (SOC):** 100% full charge verified; cell voltages balanced.
2. **Smart BMS Diagnostics:** OBD scan passes with zero error codes.
3. **Braking & Throttle Safety:** Front/rear hydraulic disc brake cutoff sensors tested.
4. **Lighting & Electrical:** High/low beam LED headlight, turn signals, brake light, horn, and LCD instrument cluster verified.
5. **Tyres & Fasteners:** Front/rear tyre pressure set to 32 PSI; axle nut torque verified.
6. **Cosmetic & Toolkit Handover:** Body fairings checked for scratches; 2x original keys, 2x remote alarms, and OEM smart charger packed.

---

### Q161: Why can a Gate Pass NEVER be generated if the PDI fails?
**Answer:** Strict customer safety and liability protection:
* 📍 **System Navigation Path:** `CreateDeliveryHandoverModal` &rarr; Validation Engine
* If any PDI item fails (e.g., brake light bulb loose or tyre pressure low), the system blocks gate pass generation. The technician must repair the defect and re-verify before the system unlocks customer handover.

---

### Q162: Modal Guide — What is the CreateDeliveryHandoverModal (CreateDeliveryHandover.vue) and what are its exact fields?
**Answer:** The `CreateDeliveryHandoverModal` executes the PDI checklist and generates the official Delivery Gate Pass:
* 📍 **System Navigation Path:** `Sidebar: Sales & Revenue` &rarr; `Sales Orders` &rarr; Click `Deliver Vehicle` (`CreateDeliveryHandoverModal`)
* **Exact Form Fields:**
  * **Order Reference** *(Read-Only)*: Linked Sales Order ID and Customer Name.
  * **Chassis Frame VIN** *(Read-Only)*: Verified physical vehicle chassis number.
  * **Assigned PDI Technician** *(Dropdown, Required)*: Certified workshop mechanic.
  * **6-Point PDI Checkbox Matrix** *(Mandatory All Checked)*: Battery, BMS, Brakes, Lights, Tyres, Cosmetics.
  * **Starting Odometer Reading (km)** *(Numeric, Required)*: Factory testing mileage (typically 1 to 5 km).
  * **Battery State of Charge (%)** *(Numeric, Required)*: Must be &ge; 95%.
  * **Handover Checklist Items**: 2x Keys, 2x Remote FOBs, 1x Smart Charger, 1x User Manual & Warranty Card.
  * **Customer Receiving Signature** *(Digital Signature Canvas)*: Touchscreen signature.
  * **Authorizing Manager PIN** *(Security PIN)*: Managerial clearance.

---

### Q163: What is the Official Delivery Gate Pass, and what security features does it contain?
**Answer:** The Delivery Gate Pass is the legal security document authorizing physical compound exit:
* 📍 **System Navigation Path:** `Sidebar: Sales & Revenue` &rarr; `Delivery Gate Passes` (`/sales/deliveries/:id/gate-pass`)
* **Security & Forensic Features:**
  * **Encrypted QR Verification Code:** Scanned by gate security guard to verify authenticity.
  * **Chassis Frame VIN Barcode:** Matches stamped frame on vehicle.
  * **Customer CNIC & Full Name:** Verified citizen identity.
  * **Dealership Security Seal & Timestamp:** Exact time vehicle exited dealership compound.
  * **Invoice Zero-Balance Certification:** Cryptographically confirms PKR 0 outstanding.

---

### Q164: How does the security guard verify the Gate Pass at the showroom exit?
**Answer:** Handheld QR verification scan:
* 📍 **System Navigation Path:** Security Scanner Terminal / Mobile Web Browser &rarr; `Scan Gate Pass QR`
* Security guard scans the QR code on the driver's printed gate pass. The mobile screen flashes **GREEN: AUTHORIZED EXIT** with photo of the vehicle and customer name, unlocking the barrier.

---

### Q165: What happens in the system the exact second the Gate Pass is scanned?
**Answer:** Final lifecycle state transition:
* 📍 **System Navigation Path:** `Sidebar: Inventory` &rarr; `Serialized Units`
* Unit status changes permanently from `Sold / Ready` to **`Delivered / Customer Owned`**.
* Official **OEM Warranty Period Starts** on this calendar date.
* Vehicle exits active showroom asset balance sheet.

---

### Q166: What customer orientation is conducted during vehicle handover?
**Answer:** The 5-minute **EV Driver Orientation Briefing**:
* 📍 **System Navigation Path:** `CreateDeliveryHandoverModal` &rarr; `Customer Briefing Checklist`
* Staff demonstrate: Keyless remote start, Eco/Sport speed mode toggles, Lithium battery charging etiquette (avoiding overnight overcharging), and emergency high-voltage circuit breaker switch.

---

### Q167: Can a customer take delivery if they forgot their original CNIC?
**Answer:** **No. Delivery requires physical CNIC presentation.**
* 📍 **System Navigation Path:** `CreateDeliveryHandoverModal` &rarr; `Identity Verification`
* Showroom manager must inspect the physical NADRA CNIC card and verify it matches the registered invoice identity before handing over keys.

---

### Q168: How does the system handle home delivery via flatbed truck?
**Answer:** Third-Party Carrier Delivery Protocol:
* 📍 **System Navigation Path:** `CreateDeliveryHandoverModal` &rarr; `Delivery Type: Flatbed / Home Delivery`
* Records flatbed driver name, truck license plate number, carrier contact number, and destination address. Gate pass authorizes carrier dispatch.

---

### Q169: What happens if a customer notices a cosmetic scratch during handover?
**Answer:** Pre-Delivery Rectification Voucher:
* 📍 **System Navigation Path:** `CreateDeliveryHandoverModal` &rarr; Click **"Log Delivery Exception"**
* Records scratch location with photo. If minor, workshop team polishes fairing on the spot; if part requires replacement, a free replacement appointment is scheduled.

---

### Q170: Can an expired or previously used Gate Pass be used again?
**Answer:** **No. Gate Passes are single-use tokens.**
* 📍 **System Navigation Path:** Security Verification Engine
* Once scanned at the gate, the pass status updates to `Executed / Closed`. Any subsequent scan triggers a crimson warning: *"FRAUD ALERT: GATE PASS ALREADY EXECUTED ON [DATE/TIME]"*.

---

### Q171: What documentation is handed over to the customer inside the delivery folder?
**Answer:** The **AJ EcoDrive Official Ownership Welcome Pack**:
* 📍 **System Navigation Path:** `Sales Order Detail Page` &rarr; Click **"Print Complete Delivery Pack"**
* Contains: Original Tax Invoice, Payment Receipts, Official Stamped Warranty Certificate, Pre-Delivery Inspection (PDI) Report, Excise Registration Application, and Owner's Manual.

---

### Q172: How does the system solicit customer satisfaction (CSAT) feedback?
**Answer:** Automated Post-Delivery Feedback SMS:
* 📍 **System Navigation Path:** `Sidebar: Settings` &rarr; `Customer Experience (CSAT)`
* 2 hours after gate exit, customer receives an automated SMS/WhatsApp: *"How was your delivery experience at AJ EcoDrive? Rate us 1 to 5 stars: [Feedback Link]"*.

---

### Q173: Where can Branch Managers audit all past deliveries?
**Answer:** The **Delivery Handovers Workbench**:
* 📍 **System Navigation Path:** `Sidebar: Sales & Revenue` &rarr; `Deliveries & Handovers` (`/sales/deliveries`)
* Displays chronological delivery log, filterable by date, customer, VIN, and delivering sales executive.

---

### Q174: What is the On-Time Delivery Performance KPI?
**Answer:** Dealership punctuality score:
* 📍 **System Navigation Path:** `Sidebar: Analytics & Reports` &rarr; `Delivery Fulfillment Scorecard`
* Measures percentage of vehicles delivered exactly on or before the promised customer booking date (Target: &ge; 96.5% on-time delivery across network).

---
[Back to Top / Navigation Index](#dealership-owners-quick-navigation--executive-index)

---

# SECTION IV: AFTER-SALES SERVICE, WORKSHOP & WARRANTY (OWNERSHIP JOURNEY)

---

# PART 13: Workshop Intake & Opening Service Cases (Q175 – Q188)

### Q175: What is the Workshop Service Intake process in AJ EcoDrive?
**Answer:** Workshop Service Intake is the formal reception protocol when a customer brings an electric vehicle into the dealership workshop for periodic maintenance, warranty repair, or accident damage:
* 📍 **System Navigation Path:** `Top Nav` &rarr; `Quick Actions ⌄` &rarr; `Service Intake Case` (`CreateCaseModal`) OR `Sidebar: After-Sales & Workshop` &rarr; `Active Service Cases` (`/after-sales/warranty`) &rarr; Click `+ New Service Intake`
* **Operational Flow:**
  1. Service receptionist scans vehicle chassis VIN or enters customer mobile number.
  2. System retrieves verified digital service history and active OEM warranty coverage.
  3. Receptionist logs customer-reported symptoms, starting odometer reading, and battery SOC.
  4. Generates an electronic Workshop Intake Job Card with customer signature.

---

### Q176: What is the difference between a Service Case and a Repair Job Card?
**Answer:** AJ EcoDrive establishes a clear 2-tier service architecture:
* 📍 **System Navigation Path:** `Sidebar: After-Sales & Workshop` &rarr; `Service Cases` vs `Job Cards`
* **Service Case (`SC-PEW-XXXX`):** The master customer ticket representing the customer's visit, symptom intake, warranty claim validation, customer communication, and final invoicing.
* **Repair Job Card (`JOB-PEW-XXXX`):** The internal workshop technical ticket assigned to a specific technician, tracking mechanic labour hours, installed spare parts, and OBD diagnostic checks.

---

### Q177: Modal Guide — What is the CreateCaseModal (CreateCase.vue) and what are its exact fields?
**Answer:** The `CreateCaseModal` executes the front-desk workshop intake in under 45 seconds:
* 📍 **System Navigation Path:** `Top Nav` &rarr; `Quick Actions ⌄` &rarr; `Service Intake Case` (`CreateCaseModal`)
* **Exact Form Fields:**
  * **Customer / Vehicle Lookup** *(Search Input)*: Search by VIN, Customer Phone, or CNIC.
  * **Vehicle Chassis VIN** *(Auto-Populated)*: Unique serialized chassis identity.
  * **Current Odometer (km)** *(Numeric, Required)*: Mileage at intake.
  * **Battery State of Charge (%)** *(Numeric, Required)*: Battery percentage on arrival.
  * **Service Category** *(Select, Required)*:
    * `Periodic Maintenance (Free Service Voucher 1, 2, or 3)`
    * `Warranty Claim (Battery / Motor / Controller)`
    * `Running Repair (Brakes / Tyres / Electrical)`
    * `Accident / Bodywork Repair`
  * **Customer Reported Symptoms** *(Textarea, Required)*: Detailed description of issue.
  * **Physical Exterior Inspection Checklist**: Marks pre-existing body scratches with interactive vehicle diagram.
  * **Assigned Lead Technician / Service Advisor** *(Dropdown)*: Workshop staff assignment.
  * **Promised Completion Date & Time** *(Datetime)*: Delivery commitment to customer.

---

### Q178: How does the system automatically verify warranty validity at workshop intake?
**Answer:** Instant cryptographic warranty calculation:
* 📍 **System Navigation Path:** `CreateCaseModal` &rarr; `Warranty Status Banner`
* When the chassis VIN is selected, the system calculates time elapsed since initial Delivery Gate Pass date and compares current odometer reading against warranty thresholds (e.g., *Elapsed: 8 months / 6,420 km &rarr; Status: GREEN (ACTIVE 2-YEAR WARRANTY)*).

---

### Q179: What are Free Service Vouchers, and how are they redeemed?
**Answer:** Periodic OEM maintenance vouchers:
* 📍 **System Navigation Path:** `CreateCaseModal` &rarr; `Service Category: Free Service Voucher`
* New electric bikes include **3 Free Scheduled Services** (1st Service: 1,000 km, 2nd Service: 5,000 km, 3rd Service: 10,000 km). System validates voucher eligibility and zeros out labour charges automatically.

---

### Q180: How does the system record pre-existing vehicle body damage during intake?
**Answer:** Interactive 2D Vehicle Body Inspection Map:
* 📍 **System Navigation Path:** `CreateCaseModal` &rarr; `Visual Condition Mapper`
* Service advisor taps on a 2D diagram of the electric scooter (front mudguard, side fairing, rear lamp) to mark pre-existing scratches or cracks, taking photos via mobile tablet to prevent false customer damage claims upon pickup.

---

### Q181: What happens if a bike arrives with a completely dead (0% SOC) Lithium Battery?
**Answer:** Deep Discharge Recovery Protocol:
* 📍 **System Navigation Path:** `CreateCaseModal` &rarr; `Battery Diagnostic Intake Warning`
* System flags a deep discharge warning, routing the battery to the workshop **Pulse Recovery Bench** for controlled reactivation before conducting full BMS diagnostic scans.

---

### Q182: Can a customer track their repair status online?
**Answer:** Yes. Real-Time Customer Service Portal:
* 📍 **System Navigation Path:** Public Web Link sent via SMS/WhatsApp (`https://aj-eco-drive.vercel.app/track-service/:id`)
* Customer can view real-time repair progress: `Intake Received` &rarr; `In Diagnosis` &rarr; `Parts Replaced` &rarr; `Quality Tested` &rarr; `Ready for Pickup`.

---

### Q183: How does the workshop manage customer personal belongings left in vehicle storage?
**Answer:** Storage Inventory Checklist:
* 📍 **System Navigation Path:** `CreateCaseModal` &rarr; `Customer Belongings Section`
* Records items left under the seat (smart charger, rain jacket, documents) and prints an itemized receiving slip for the customer.

---

### Q184: What happens if a customer brings a vehicle purchased from another dealership branch?
**Answer:** Seamless Nationwide Warranty & Service Support:
* 📍 **System Navigation Path:** `CreateCaseModal` &rarr; Search Nationwide VIN Database
* A vehicle sold in Islamabad can be serviced in Peshawar with zero friction. The system accesses the master centralized history, honoring all OEM warranty terms.

---

### Q185: How are urgent breakdown / towing intakes prioritized?
**Answer:** Emergency SLA Tagging:
* 📍 **System Navigation Path:** `CreateCaseModal` &rarr; Toggle `Priority: Emergency / Roadside Tow`
* Places the ticket at the top of the workshop triage board with flashing red indicators, assigning the next available diagnostic bay immediately.

---

### Q186: What is the Workshop Receptionist Daily Intake Log?
**Answer:** Master daily service workbench:
* 📍 **System Navigation Path:** `Sidebar: After-Sales & Workshop` &rarr; `Daily Intake Log` (`/after-sales/intake-log`)
* Summarizes all vehicles checked in today, categorized by maintenance type, promised handover times, and revenue potential.

---

### Q187: How does the system handle customer repair budget authorizations?
**Answer:** Estimated Repair Cost Ceiling:
* 📍 **System Navigation Path:** `CreateCaseModal` &rarr; `Customer Authorized Budget Field`
* If estimated repairs exceed the customer's initial authorized budget (e.g. initial estimate PKR 3,000 vs. actual repair PKR 9,500), the system requires sending an automated WhatsApp budget approval request before proceeding.

---

### Q188: What is the Average Workshop Intake Time KPI?
**Answer:** Service desk efficiency metric:
* 📍 **System Navigation Path:** `Sidebar: Analytics & Reports` &rarr; `Workshop KPIs`
* Measures average time elapsed from customer arrival to completed job card issuance (Target: &le; 4 minutes).

---
[Back to Top / Navigation Index](#dealership-owners-quick-navigation--executive-index)

---

# PART 14: Workshop Repair Execution & Mechanic Job Cards (Q189 – Q202)

### Q189: How are repair jobs executed inside the dealership workshop?
**Answer:** Workshop operations are managed via the **Technician Job Card Workbench**:
* 📍 **System Navigation Path:** `Sidebar: After-Sales & Workshop` &rarr; `Workshop Job Cards` (`/after-sales/job-cards`) &rarr; Select Job Card (`CreateRepairJobModal`)
* **Execution Workflow:**
  1. Lead Mechanic reviews assigned job card on workshop tablet.
  2. Mechanic runs OBD diagnostic scan and logs component faults.
  3. Requisitions replacement spare parts from the internal store.
  4. Performs mechanical/electrical repairs and logs labour hours.
  5. Conducts post-repair road test and signs off Quality Control (QC).

---

### Q190: What is a Mechanic Job Card, and what data does it track?
**Answer:** The digital work order for the technician:
* 📍 **System Navigation Path:** `Job Card Detail Page` (`/after-sales/job-cards/:id`)
* Tracks assigned mechanic name, repair bay number, start/stop labour timer, consumed spare parts with SKU codes, diagnostic OBD trouble codes, and quality inspection sign-off.

---

### Q191: Modal Guide — What is the CreateRepairJobModal (CreateRepairJob.vue) and what are its exact fields?
**Answer:** The `CreateRepairJobModal` assigns work orders to technicians:
* 📍 **System Navigation Path:** `Service Case Detail Page` &rarr; Click `+ Create Repair Job Card`
* **Exact Form Fields:**
  * **Linked Service Case** *(Read-Only)*: Customer and VIN reference.
  * **Assigned Technician** *(Dropdown, Required)*: Certified EV mechanic.
  * **Service Bay Number** *(Select)*: Bay 1 (Diagnostics), Bay 2 (Mechanical), Bay 3 (Electrical/Battery).
  * **Diagnostic Trouble Codes (DTC)** *(Multi-Select / Text)*: `ERR-BMS-02`, `ERR-MTR-01`, `ERR-THROTTLE-04`.
  * **Required Spare Parts Requisition** *(Search & Multi-Add)*:
    * Selects parts from workshop store (e.g., Brake Pads, Throttle, Controller).
  * **Labour Operation Items** *(Checklist / Hours)*:
    * Brake bleeding & caliper adjustment (0.5 hrs / PKR 500)
    * Wiring harness continuity repair (1.0 hrs / PKR 1,000)
    * Motor hall sensor replacement (1.5 hrs / PKR 1,500)
  * **Technician Notes** *(Textarea)*: Technical observations.

---

### Q192: How do spare parts deduct from inventory when installed during a repair?
**Answer:** Instant automated stock deduction:
* 📍 **System Navigation Path:** `CreateRepairJobModal` &rarr; `Spare Parts Section`
* When the technician adds *"1x Throttle Grip Assembly (SKU: EL-THR-01)"* to an approved job card, the part instantly deducts from the branch workshop parts cabinet inventory and attaches to the customer invoice at retail price (or PKR 0 if covered under warranty).

---

### Q193: How does the system track technician labour hours and productivity?
**Answer:** Interactive Work Timer & Flat-Rate Labour System:
* 📍 **System Navigation Path:** `Job Card Detail Page` &rarr; Click **"Start Work / Pause / Complete"**
* Technicians tap Start when commencing work. The system compares actual time spent against standard flat-rate labour benchmarks (e.g. standard brake pad replacement: 30 mins), computing mechanic efficiency ratings.

---

### Q194: What is the Post-Repair Quality Control (QC) Sign-Off?
**Answer:** Mandatory 5-point quality gate:
* 📍 **System Navigation Path:** `Job Card Detail Page` &rarr; `QC Sign-Off Tab`
* Workshop Foreman inspects:
  1. All bolts torqued to manufacturer specs.
  2. Electronic throttle smooth return spring action.
  3. Front & rear brake hydraulic pressure.
  4. Headlight, indicators, and horn operation.
  5. Clean bodywork with zero grease smudges.

---

### Q195: What happens if a required spare part is out of stock in the branch?
**Answer:** Emergency Internal Part Requisition:
* 📍 **System Navigation Path:** `CreateRepairJobModal` &rarr; Click **"Request Out-of-Stock Part"**
* Launches `CreateStockRequestModal` to requisition the part from Central Warehouse or initiates an emergency local cash purchase voucher (`CreateExpenseModal`).

---

### Q196: Can multiple technicians work on the same electric vehicle?
**Answer:** Yes. Multi-Technician Job Card Assignment:
* 📍 **System Navigation Path:** `CreateRepairJobModal` &rarr; `Secondary Technicians Section`
* Allows assigning an Electrical Specialist for BMS diagnostics and a Mechanical Technician for tyre/suspension repairs, splitting labour credit accurately.

---

### Q197: How does the system handle old, replaced defective parts?
**Answer:** Defective Core Return & Scrap Management:
* 📍 **System Navigation Path:** `Job Card Detail Page` &rarr; `Scrap & Core Return Protocol`
* Replaced warranty parts (e.g. defective controllers, motors) are tagged with barcode labels and placed in the **OEM Core Return Bin** for return to Head Office. Non-warranty scrap is offered to the customer or safely recycled.

---

### Q198: How are workshop repair invoices calculated?
**Answer:** Automated Itemized Billing Engine:
* 📍 **System Navigation Path:** `Sidebar: After-Sales & Workshop` &rarr; `Repair Invoices` (`/after-sales/invoices`)
* Total Bill = `[Installed Spare Parts Total]` + `[Labour Charges Total]` + `[Consumables / Fluid Fee]` - `[Warranty Subsidy Credits]` + `[Sales Tax / GST]`.

---

### Q199: Can a customer pay for workshop repairs via cash, card, or bank IBFT?
**Answer:** Yes. Full multi-tender payment processing:
* 📍 **System Navigation Path:** `Service Case Detail Page` &rarr; Click **"Collect Payment"** (`CreatePaymentModal`)
* Same robust cashier reconciliation as vehicle sales, printing thermal POS receipts and FBR-compliant workshop tax invoices.

---

### Q200: What is a Workshop Re-Work / Comeback, and how is it tracked?
**Answer:** Service Comeback Audit Flag:
* 📍 **System Navigation Path:** `Sidebar: Analytics & Reports` &rarr; `Workshop Comeback Rate`
* If a customer returns within 14 days with the same symptom, the ticket is flagged as a **Service Comeback**. The original technician is assigned for free rectification, and the incident is recorded in workshop quality scorecards.

---

### Q201: How do workshop mechanics access technical wiring diagrams and repair manuals?
**Answer:** Integrated **EV Technical Knowledgebase**:
* 📍 **System Navigation Path:** Workshop Tablet &rarr; `Job Card` &rarr; Click **"View Wiring Schematics"**
* Mechanics can pull up high-resolution circuit diagrams, BMS pinout charts, motor controller wiring colors, and torque specifications directly on their tablet screen.

---

### Q202: What is the First-Time Fix Rate (FTFR) KPI?
**Answer:** Workshop diagnostic accuracy metric:
* 📍 **System Navigation Path:** `Sidebar: Analytics & Reports` &rarr; `First-Time Fix Performance`
* Measures the percentage of electric vehicles resolved successfully on their first workshop visit without repeat complaints (Target: &ge; 94.8% across network).

---
[Back to Top / Navigation Index](#dealership-owners-quick-navigation--executive-index)

---

# PART 15: Lithium Battery Warranties & BMS Diagnostics (Q203 – Q218)

### Q203: Why is Lithium Battery warranty governance critical for an EV dealership?
**Answer:** The Lithium-Ion Battery Pack represents **40% to 50% of the entire monetary value of an electric vehicle** (e.g., PKR 95,000 to PKR 125,000 on a PKR 245,000 scooter):
* 📍 **System Navigation Path:** `Sidebar: After-Sales & Workshop` &rarr; `Battery Diagnostics & Warranty` (`/after-sales/battery-lab`)
* Uncontrolled or fraudulent warranty claims can destroy dealership profitability. AJ EcoDrive enforces rigorous scientific, serialized, and telemetry-based battery warranty validation.

---

### Q204: What is 3-Way Serialized Hardware Binding in AJ EcoDrive?
**Answer:** Cryptographic hardware pairing preventing component theft and fraudulent warranty claims:
* 📍 **System Navigation Path:** `Sidebar: Inventory` &rarr; `Serialized Units` (`/inventory/serialized-units/:id`)

```
┌────────────────────────────────────────────────────────────────────────┐
│                   3-WAY SERIALIZED HARDWARE BINDING                    │
├────────────────────────────────────────────────────────────────────────┤
│  [1. Frame VIN] ──────────► PK-BRG-2026-00812 (Chassis Frame)          │
│         │                                                              │
│         ├─────────────────► BAT-72V32AH-2026-00812 (Lithium Battery)   │
│         │                                                              │
│         └─────────────────► CTL-72V1500W-09412 (Smart BMS Controller)  │
└────────────────────────────────────────────────────────────────────────┘
```

* When a customer brings a bike into the workshop, the technician scans the battery pack's physical QR barcode. The system verifies that the battery serial matches the original factory assembly record for that chassis VIN.

---

### Q205: What diagnostic parameters are evaluated during a Lithium Battery Health Test?
**Answer:** Automated 6-point BMS telemetry scan:
* 📍 **System Navigation Path:** `Battery Diagnostic Lab` &rarr; `Scan BMS Telemetry`
1. **State of Health (SOH %):** Remaining battery capacity relative to original factory nominal capacity.
2. **State of Charge (SOC %):** Current stored energy level.
3. **Individual Cell Voltage Delta (&Delta;V):** Maximum voltage variance between series cells (Threshold: &le; 0.030V; Delta > 0.080V indicates cell imbalance).
4. **Internal Cell Resistance (m&Omega;):** Impedance testing for degraded cells.
5. **BMS Thermal Sensor Logs:** Peak recorded temperatures (flags thermal abuse > 60°C).
6. **Cumulative Charge Cycles:** Total lifetime charge/discharge cycles.

---

### Q206: What constitutes a Valid Lithium Battery Warranty Claim?
**Answer:** Standard OEM Warranty Criteria:
* 📍 **System Navigation Path:** `Battery Warranty Policy Guidelines`
* **Eligible Conditions:**
  * Battery State of Health (SOH) drops below **70%** within the 2-Year / 30,000 km warranty period under normal usage.
  * Internal BMS failure with zero external water ingress or collision damage.
  * Sudden cell drop causing sudden cutoff during normal acceleration.

---

### Q207: What constitutes an Invalid / Void Battery Warranty Claim?
**Answer:** Strict exclusions protecting the dealership:
* 📍 **System Navigation Path:** `Battery Warranty Policy Guidelines`
* **Void Conditions:**
  1. **Water Ingress / Submersion:** Rust or water stains inside battery casing.
  2. **Physical Collision Damage:** Dented, punctured, or cracked aluminium battery housing.
  3. **Unauthorized Modification:** Broken tamper-evident warranty seal stickers or non-OEM fast chargers used.
  4. **Deep Storage Neglect:** Battery left at 0% discharge for > 90 days resulting in cell sulfation.

---

### Q208: How does the system handle a Battery Warranty Replacement in the Action Centre?
**Answer:** Automated Flow 4 Escalation:
* 📍 **System Navigation Path:** `Service Case Detail Page` &rarr; Click **"Submit Battery Warranty Claim"** &rarr; Action Centre (`ACT-WRN-XXXX`)
* The system attaches the digital BMS diagnostic scan, SOH percentage, photos of casing/seals, and chassis delivery date.
* Chief Technical Officer (CTO) reviews evidence and clicks **"Authorize OEM Battery Replacement"**.

---

### Q209: What happens when an OEM Battery Replacement is authorized?
**Answer:** Automated 4-Step Hardware & Accounting Reconciliation:
* 📍 **System Navigation Path:** `Action Centre` &rarr; `Approve ACT-WRN`
1. **Zero Customer Charge:** Generates a PKR 0 customer replacement invoice with OEM warranty subsidy credit.
2. **Hardware Re-Binding:** Replaces old battery serial with brand-new battery serial in the chassis VIN record.
3. **Defective Core Quarantine:** Defective battery moves to `Quarantine Bay Q-3` with return tag for OEM factory credit.
4. **Warranty Renewal:** New battery inherits remaining original vehicle warranty period.

---

### Q210: What is Cell Balancing, and how does the workshop perform it?
**Answer:** Active battery pack reconditioning:
* 📍 **System Navigation Path:** `Battery Lab Workbench` &rarr; `Cell Balancing Protocol`
* If a battery SOH is healthy but individual cell voltages are drifted (e.g. Cell 1: 3.65V vs Cell 7: 3.42V), the workshop connects the pack to the **Active Equalizer Bench** for 6 hours, restoring full range without replacing the pack.

---

### Q211: How does the system track battery fire and thermal safety compliance?
**Answer:** High-Voltage Safety Audit Protocol:
* 📍 **System Navigation Path:** `Sidebar: After-Sales & Workshop` &rarr; `Battery Safety Logs`
* Every battery stored in the workshop is assigned a dedicated fireproof charging locker with automated thermal cutoff sensors.

---

### Q212: Can a customer purchase an Extended Battery Warranty?
**Answer:** Yes. **AJ EcoDrive Battery Shield+ Policy**:
* 📍 **System Navigation Path:** `CreateSaleModal` &rarr; `Add-ons: Extended Warranty (Year 3)`
* Extends battery replacement coverage for a 3rd year (up to 45,000 km) for an additional fee (e.g. PKR 18,500), tracked in the digital warranty certificate.

---

### Q213: How does the system handle Smart BMS Firmware Updates?
**Answer:** Over-the-Wire (OTW) Diagnostic Flashing:
* 📍 **System Navigation Path:** `Battery Diagnostic Lab` &rarr; `Flash BMS Firmware`
* Workshop tablets connect via Bluetooth/CAN-bus to flash updated OEM battery management firmware, improving regenerative braking efficiency and cold-weather range.

---

### Q214: What is the Battery Degradation Curve report?
**Answer:** Enterprise battery reliability analytics:
* 📍 **System Navigation Path:** `Sidebar: Analytics & Reports` &rarr; `Battery Degradation Analytics` (`/reports/battery-health`)
* Tracks average SOH loss per 10,000 km across different battery cell manufacturers (CATL, Gotion, EVE), identifying superior battery chemistries for future procurement.

---

### Q215: What safety labels and barcodes are printed for replacement batteries?
**Answer:** Serialized High-Voltage Warning Labels:
* 📍 **System Navigation Path:** `Battery Lab` &rarr; Click **"Print Battery QR Label"**
* Prints thermal waterproof labels with serial number, nominal voltage (72V), capacity (32Ah), chemistry (LiFePO4 / NMC), and emergency fire safety QR codes.

---

### Q216: How are defective Lithium batteries transported back to the OEM factory?
**Answer:** Hazardous Materials (HAZMAT) Freight Manifest:
* 📍 **System Navigation Path:** `Sidebar: Inventory` &rarr; `Transfers` &rarr; `HAZMAT Battery Return Manifest`
* Generates specialized logistics transport permits with certified fireproof battery transport packaging checklists.

---

### Q217: What customer education is provided regarding battery health preservation?
**Answer:** Automated Battery Care SMS Tips:
* 📍 **System Navigation Path:** `Sidebar: Settings` &rarr; `Customer Education Automated Tips`
* Monthly automated WhatsApp advice sent to owners: Avoiding deep discharges below 15%, parking under shade during extreme summer heat, and recommended charging habits.

---

### Q218: What is the Battery Warranty Claim Ratio KPI?
**Answer:** Dealership quality benchmark:
* 📍 **System Navigation Path:** `Sidebar: Analytics & Reports` &rarr; `Warranty Ratio Scorecard`
* Measures percentage of delivered vehicles experiencing battery warranty claims within 12 months (Target: &le; 1.8% across network).

---
[Back to Top / Navigation Index](#dealership-owners-quick-navigation--executive-index)

---

# PART 16: Vehicle Cancellations, Returns & Customer Refund Settlement (Q219 – Q232)

### Q219: What is the Vehicle Return and Cancellation policy in AJ EcoDrive?
**Answer:** Formal operational governance for handling customer order cancellations, pre-delivery deposit refunds, and post-delivery returns:
* 📍 **System Navigation Path:** `Sidebar: Sales & Revenue` &rarr; `Returns & Refunds` (`/sales/returns`) &rarr; Click `+ New Return / Refund` (`CreateReturnModal`)
* **Core Rule:** No vehicle can be returned or refund issued via verbal agreement. Every cancellation requires a formal physical inspection, calculated deductions, and managerial sign-off.

---

### Q220: What are the two types of Customer Cancellations?
**Answer:** Distinct operational cancellation paths:
* 📍 **System Navigation Path:** `CreateReturnModal` &rarr; `Cancellation Type Select`
1. **Pre-Delivery Order Cancellation:** Customer booked a vehicle with a deposit (e.g. PKR 25,000) but cancels before vehicle handover.
2. **Post-Delivery Vehicle Return:** Customer took physical delivery with a Gate Pass but returns the vehicle within the allowable 3-day return window due to technical dissatisfaction or legal cooling-off provisions.

---

### Q221: What deductions apply to a Pre-Delivery Order Cancellation?
**Answer:** Standard Dealership Administrative Deductions:
* 📍 **System Navigation Path:** `CreateReturnModal` &rarr; `Refund Calculation Panel`
* **Standard Policy:**
  * Deposit Collected: `PKR 25,000`
  * Order Processing & Re-stocking Deduction: `- PKR 5,000`
  * Net Refund Payable to Customer: **`PKR 20,000`**
* Reserved vehicle chassis VIN unlocks and returns to `Available` showroom floor stock immediately.

---

### Q222: What is the 10-Point Technical Inspection for Post-Delivery Returns?
**Answer:** Mandatory physical audit before accepting a returned vehicle:
* 📍 **System Navigation Path:** `CreateReturnModal` &rarr; `10-Point Return Inspection Tab`
1. Odometer reading verified (Must be &le; 100 km).
2. Zero collision scratches, dents, or frame damage.
3. Battery SOH verified at 100% with original matching serial number.
4. Smart controller and motor electrical integrity intact.
5. 2x original keys, 2x remote alarms, and OEM smart charger returned.
6. Original excise documentation and tax invoice returned.

---

### Q223: Modal Guide — What is the CreateReturnModal (CreateReturn.vue) and what are its exact fields?
**Answer:** The `CreateReturnModal` executes vehicle cancellations and computes net customer refunds:
* 📍 **System Navigation Path:** `Sidebar: Sales & Revenue` &rarr; `Returns & Refunds` &rarr; Click `+ New Return` (`CreateReturnModal`)
* **Exact Form Fields:**
  * **Linked Sales Order / Invoice** *(Search / Dropdown, Required)*: Selects active sale.
  * **Return Classification** *(Select)*: `Pre-Delivery Cancellation` or `Post-Delivery Return`.
  * **Cancellation Reason** *(Select/Text)*: *Customer Financial Emergency, Color Change Request, Minor Defect, Relocation*.
  * **Total Amount Originally Paid (PKR)** *(Auto-Filled)*: Gross customer payment.
  * **Administrative / Restocking Fee (PKR)** *(Numeric)*: Policy deduction.
  * **Mileage Usage Depreciation (PKR)** *(Numeric)*: For post-delivery returns (PKR 50/km).
  * **Damaged / Missing Parts Deduction (PKR)** *(Numeric)*: Cosmetic scratch charges.
  * **Net Refund Payable (PKR)** *(Auto-Calculated)*: Net amount to disburse.
  * **Refund Disbursement Method** *(Select)*: `Bank IBFT Reversal`, `Crossed Cheque`, `Cashier Till Payout`.
  * **Authorizing Branch Manager PIN** *(Security PIN)*: Mandatory managerial authorization.

---

### Q224: How is a Customer Refund disbursed?
**Answer:** Secure accounting payout channels:
* 📍 **System Navigation Path:** `Sidebar: Finance & Accounts` &rarr; `Disbursements` (`/finance/refunds`)
* **Standard Protocol:** Refunds exceeding PKR 15,000 are disbursed exclusively via **Crossed Bank Cheque** or **Direct Bank IBFT** to the customer's verified bank account matching their CNIC name, preventing cash drawer depletion.

---

### Q225: What happens to the Vehicle Chassis VIN after a return is processed?
**Answer:** Automated Inventory Quarantine & Re-Certification:
* 📍 **System Navigation Path:** `Sidebar: Inventory` &rarr; `Quarantine` (`/inventory/quarantine`)
* The returned vehicle does NOT immediately go back to the sales floor. It moves to **Holding Bay Q-3 (Returned Stock)** for thorough workshop detailing and battery re-certification before the branch manager can re-list it as `Available`.

---

### Q226: How are Credit Notes and Debit Notes generated for returns?
**Answer:** Automated Tax & Accounting Adjustment Vouchers:
* 📍 **System Navigation Path:** `Sidebar: Sales & Revenue` &rarr; `Credit Notes` (`/sales/credit-notes`)
* The system generates an official FBR-Compliant **Credit Note** linking to the original Tax Invoice, reversing sales revenue and adjusting output GST liability.

---

### Q227: Can a customer cancel an order if their vehicle is already registered with Excise & Taxation?
**Answer:** **Post-Registration returns require official Excise Ownership Transfer.**
* 📍 **System Navigation Path:** `CreateReturnModal` &rarr; `Excise Registration Warning`
* If the registration card has been issued in the customer's name, the vehicle is legally second-hand. Return requires executing an official Excise Transfer to the dealership, deducting full excise registration fees and transfer charges from the refund.

---

### Q228: How does the system handle accessory refunds?
**Answer:** Itemized accessory inspection:
* 📍 **System Navigation Path:** `CreateReturnModal` &rarr; `Accessories Inspection Section`
* Unopened accessories (smart helmet, tracker) are refunded at 100%. Installed or scratched accessories are deducted or retained by the customer.

---

### Q229: What happens if a customer disputes the refund deduction amount?
**Answer:** Action Centre Managerial Dispute Escalation:
* 📍 **System Navigation Path:** `CreateReturnModal` &rarr; Click **"Escalate Dispute to Action Centre"**
* Generates an Action Centre request (`ACT-PRC-XXXX`) allowing Super Admin / Head of Sales to review customer dispute notes and authorize an exceptional full refund if deemed appropriate for customer goodwill.

---

### Q230: How are return transactions preserved in financial audit reports?
**Answer:** Permanent forensic return ledgers:
* 📍 **System Navigation Path:** `Sidebar: Analytics & Reports` &rarr; `Sales Returns Audit Ledger` (`/reports/sales-returns`)
* Logs original invoice number, customer CNIC, return date, inspection photos, approving manager name, and refund cheque reference for tax auditors.

---

### Q231: Can a salesperson delete an order instead of processing a formal cancellation?
**Answer:** **No. Deleting sales orders or invoices is architecturally impossible.**
* 📍 **System Navigation Path:** System Security Architecture
* AJ EcoDrive enforces zero hard-deletions. All cancellations must pass through the auditable `CreateReturnModal` workflow.

---

### Q232: What is the Dealership Cancellation & Return Rate KPI?
**Answer:** Commercial satisfaction metric:
* 📍 **System Navigation Path:** `Sidebar: Analytics & Reports` &rarr; `Sales Cancellation Rate`
* Measures total cancellations as a percentage of booked orders (Target: &le; 2.5% network-wide).

---
[Back to Top / Navigation Index](#dealership-owners-quick-navigation--executive-index)

---

# SECTION V: SHOWROOM INVENTORY, TRANSFERS & QUALITY CONTROL

---

# PART 17: Showroom Inventory & Serialized Unit Management (Q233 – Q246)

### Q233: How does AJ EcoDrive manage Showroom Floor Inventory?
**Answer:** Showroom floor inventory is managed via the **Serialized Unit Inventory Workbench**:
* 📍 **System Navigation Path:** `Sidebar: Inventory` &rarr; `Serialized Units` (`/inventory/serialized-units`) OR `Stock by Product` (`/inventory/stock-by-product`)
* **Core Principle:** Every physical electric bike on the showroom tiles is tracked as an individual serialized asset, bound to its unique Chassis Frame VIN, Lithium Battery Serial Number, Motor Serial Number, and Physical Location (Peshawar Showroom, Bay A-1).

---

### Q234: What are the 7 Status States of a Serialized Unit?
**Answer:** Strict operational lifecycle state machine:
* 📍 **System Navigation Path:** `Sidebar: Inventory` &rarr; `Serialized Units` &rarr; Filter by `Status Tag`
1. **Available (Emerald):** Unsold, pristine condition, ready on showroom floor for immediate POS sale.
2. **Reserved (Amber):** Locked to a customer booking deposit; cannot be sold to anyone else.
3. **Sold / Invoicing Complete (Blue):** Fully paid; assigned to workshop delivery bay for 6-point PDI.
4. **Delivered (Gray):** Handed over to customer with executed Delivery Gate Pass.
5. **In-Transit (Purple):** Loaded on logistics carrier truck moving between branch dealerships.
6. **In Service (Teal):** Customer-owned vehicle undergoing maintenance in the workshop.
7. **Quarantine / QC Hold (Crimson):** Isolated in Bay Q-3 due to transit damage or battery diagnostic alert.

---

### Q235: How does the system prevent cross-branch stock theft or accidental sales?
**Answer:** Strict Branch Custody Isolation:
* 📍 **System Navigation Path:** `Sidebar: Inventory` &rarr; `Serialized Units`
* A salesperson in Peshawar cannot select or sell a VIN assigned to Islamabad. Attempting to assign an out-of-branch VIN triggers a hard security block: *"ACCESS DENIED: VIN [Number] is in Islamabad Showroom Custody"*.

---

### Q236: How do staff search for a specific vehicle in inventory?
**Answer:** Universal Multi-Attribute Inventory Search:
* 📍 **System Navigation Path:** `Sidebar: Inventory` &rarr; `Serialized Units` &rarr; `Search Bar`
* Staff can search instantly by Chassis Frame VIN (e.g. `00812`), Battery Serial Number, Motor Serial Number, Color, Model Name, or Status.

---

### Q237: How are Barcode and QR Code labels generated for showroom vehicles?
**Answer:** Built-in **Thermal Barcode Label Printing**:
* 📍 **System Navigation Path:** `Serialized Unit Detail Page` &rarr; Click **"Print VIN Barcode Label"**
* Generates waterproof thermal barcode stickers affixed to the vehicle's frame and battery cover, readable by standard handheld USB barcode scanners.

---

### Q238: What information is displayed on the Serialized Unit Detail Page?
**Answer:** Complete 360-degree vehicle identity dossier:
* 📍 **System Navigation Path:** `Sidebar: Inventory` &rarr; `Serialized Units` &rarr; Select Unit (`/inventory/serialized-units/:id`)
* Displays Frame VIN, Model Name, Color, Battery Chemistry & Serial, Motor Controller Serial, Import Sea Container PO, Landed Cost (PKR), Current Status, Current Branch Bay Location, and Full Chronological Audit Timeline.

---

### Q239: How does the system manage Showroom Display Bikes vs. Warehouse Storage Units?
**Answer:** Sub-Location Bay Tagging:
* 📍 **System Navigation Path:** `Serialized Unit Detail Page` &rarr; `Bay Location Field`
* Tags exact physical position: `Showroom Display Floor (Main Window)`, `Showroom Floor (Row B)`, `Backroom Storage Warehouse (Crate 4)`, or `Workshop Holding Bay`.

---

### Q240: What happens if a showroom display bike battery is depleted from customer demonstrations?
**Answer:** Daily Showroom Battery Maintenance Protocol:
* 📍 **System Navigation Path:** `Sidebar: Inventory` &rarr; `Floor Stock Battery Audit`
* Showroom staff check display bike battery State of Charge (SOC) daily; display units must maintain &ge; 60% SOC to ensure immediate customer test rides and protect lithium cells from deep-discharge degradation.

---

### Q241: Can a serialized unit's specifications (e.g. Color / Battery) be changed in the system?
**Answer:** Hardware Component Modification with Managerial PIN:
* 📍 **System Navigation Path:** `Serialized Unit Detail Page` &rarr; Click **"Modify Component Spec"**
* If a technician swaps a battery pack under warranty, entering Manager PIN and justification logs the new serial number into the permanent VIN history.

---

### Q242: How does the system handle Non-Serialized Spare Parts inventory?
**Answer:** Quantity & Bin-Location Warehouse Ledger:
* 📍 **System Navigation Path:** `Sidebar: Inventory` &rarr; `Spare Parts & Accessories` (`/inventory/parts`)
* Tracks physical quantities, reorder safety thresholds, bin shelf locations (e.g. `Shelf C-4`), unit cost (PKR), and retail price for high-frequency consumable parts.

---

### Q243: What is the Slow-Moving / Aged Inventory Alert?
**Answer:** Aged Stock Aging Matrix:
* 📍 **System Navigation Path:** `Sidebar: Analytics & Reports` &rarr; `Inventory Aging Report` (`/reports/inventory-aging`)
* Identifies vehicles sitting on the showroom floor for **> 45 days**, alerting the branch manager to initiate promotional discounts or inter-branch transfers to higher-demand cities.

---

### Q244: Can a Branch Manager manually adjust stock quantities without an audit?
**Answer:** **No. Unilateral stock modifications are strictly prohibited.**
* 📍 **System Navigation Path:** `Sidebar: Inventory` &rarr; `Adjustments`
* Any stock adjustment requires initiating an official **Cycle Count Variance Request** (`CreateAdjustmentRequestModal`), routing to Head Office via Action Centre Flow 5.

---

### Q245: What is the Total Floor Inventory Valuation (PKR)?
**Answer:** Live Balance Sheet Asset Valuation:
* 📍 **System Navigation Path:** `Branch Manager Dashboard` &rarr; `Inventory Asset Valuation Card`
* Computes live monetary worth of all available showroom vehicles based on landed dealer import cost.

---

### Q246: What is the Stock Turn Velocity KPI?
**Answer:** Inventory turnover efficiency metric:
* 📍 **System Navigation Path:** `Sidebar: Analytics & Reports` &rarr; `Inventory Turnover Rate`
* Measures average days taken to sell incoming vehicle shipments (Target: &le; 21 days from container intake to customer delivery).

---
[Back to Top / Navigation Index](#dealership-owners-quick-navigation--executive-index)

---

# PART 18: Showroom Stock Replenishment Requisitions (Q247 – Q258)

### Q247: What is a Stock Replenishment Requisition in AJ EcoDrive?
**Answer:** A Stock Replenishment Requisition is a formal branch inventory request submitted by a Branch Manager to the Central Distribution Warehouse to restock low floor inventory:
* 📍 **System Navigation Path:** `Top Nav` &rarr; `Quick Actions ⌄` &rarr; `Stock Replenishment Request` (`CreateStockRequestModal`) OR `Sidebar: Inventory` &rarr; `Stock Requests` (`/inventory/stock-requests`) &rarr; Click `+ New Requisition`
* **Operational Intent:** Ensures branch showrooms never run out of high-demand electric scooter models by triggering automated warehouse pick-and-pack dispatches.

---

### Q248: What are Minimum Reorder Safety Buffers?
**Answer:** Automated low-stock trigger thresholds:
* 📍 **System Navigation Path:** `Sidebar: Inventory` &rarr; `Stock by Product` &rarr; `Reorder Thresholds`
* Each branch maintains minimum floor safety buffers (e.g., minimum 3x *BRG E-125* and 2x *Sprint Li-72* in Peshawar). When available units drop to &le; 1, the dashboard triggers a flashing amber **Low Stock Alert**.

---

### Q249: What is the difference between Routine Replenishment and Emergency Requisitions?
**Answer:** Priority routing in the supply chain:
* 📍 **System Navigation Path:** `CreateStockRequestModal` &rarr; `Priority Dropdown`
* **Routine Replenishment:** Weekly planned batch stock delivery via scheduled company freight truck (Target: 3 to 5 business days).
* **Emergency Requisition:** High-priority pull to fulfill locked, fully-paid customer orders (Target: &le; 24 hours dispatch).

---

### Q250: Modal Guide — What is the CreateStockRequestModal (CreateStockRequest.vue) and what are its exact fields?
**Answer:** The `CreateStockRequestModal` initiates formal replenishment requests:
* 📍 **System Navigation Path:** `Top Nav` &rarr; `Quick Actions ⌄` &rarr; `Stock Replenishment Request` (`CreateStockRequestModal`)
* **Exact Form Fields:**
  * **Requesting Branch** *(Read-Only)*: Originating showroom (e.g., *Peshawar Showroom*).
  * **Target Fulfill Source** *(Dropdown)*: `Central Warehouse (Islamabad)` or `Regional Hub`.
  * **Requisition Priority** *(Select)*: `Routine Weekly Restock` or `Emergency Customer Fulfillment`.
  * **Product Models & Quantities Matrix** *(Multi-Row Item Table)*:
    * Select Product Model (e.g., *BRG E-125 Commuter*)
    * Color Preference (e.g., *2x Metallic Blue, 2x Pearl White*)
    * Quantity Requested (e.g., *4 Units*)
  * **Current Available Floor Units** *(Auto-Displayed)*: Live local stock count.
  * **Business Justification & Remarks** *(Textarea, Required)*: Sales demand forecast notes.

---

### Q251: How does Central Warehouse review and approve Stock Requisitions?
**Answer:** Central Supply Chain Fulfillment Queue:
* 📍 **System Navigation Path:** `Super Admin` &rarr; `Sidebar: Inventory` &rarr; `Warehouse Requisitions Queue` (`/inventory/warehouse-queue`)
* Warehouse Manager reviews available stock in Central Warehouse, confirms vehicle availability, and clicks **"Approve & Create Transfer Manifest"**, which automatically transitions the request into an active **Inter-Branch Stock Transfer**.

---

### Q252: What happens if Central Warehouse has insufficient stock to fulfill a requisition?
**Answer:** Partial Fulfillment & Split Dispatch:
* 📍 **System Navigation Path:** `Warehouse Requisitions Queue` &rarr; Click **"Partial Fulfill"**
* Warehouse Manager allocates available units (e.g. 2 of 4 requested bikes) and creates an inbound priority backorder for the remaining 2 units against the next incoming OEM sea container.

---

### Q253: Can a branch requisition spare parts along with electric vehicles?
**Answer:** Yes. Combined Requisition Orders:
* 📍 **System Navigation Path:** `CreateStockRequestModal` &rarr; `Spare Parts Section`
* Branch managers can add spare parts boxes (e.g., *10x Brake Pad Sets, 5x Fast Chargers, 2x Smart Helmets*) to the same replenishment manifest.

---

### Q254: How are freight shipping costs allocated for stock replenishment?
**Answer:** Central vs Branch Logistics Accounting:
* 📍 **System Navigation Path:** `Sidebar: Finance & Accounts` &rarr; `Logistics Freight Expenses`
* Shipping costs are logged under *Inter-Branch Logistics OPEX*, tracking cost-per-unit freight efficiency across transport routes.

---

### Q255: What notifications are sent when a stock requisition is dispatched?
**Answer:** Multi-Channel Dispatch Alert:
* 📍 **System Navigation Path:** Automated Notification Engine
* When the warehouse loads the freight carrier, the requesting Branch Manager receives an instant desktop notification, email, and WhatsApp message containing the **Carrier Driver Contact Number** and **Truck License Plate**.

---

### Q256: Can a Branch Manager cancel a stock requisition after submission?
**Answer:** Yes, prior to warehouse pick-and-pack:
* 📍 **System Navigation Path:** `Stock Request Detail Page` &rarr; Click **"Cancel Requisition"**
* Requisitions in `Pending` status can be cancelled with justification notes. Once marked `Pick & Pack In Progress`, cancellation requires warehouse manager sign-off.

---

### Q257: How does the system prevent over-requisitioning by over-enthusiastic sales managers?
**Answer:** Maximum Showroom Capacity Floor Limits:
* 📍 **System Navigation Path:** `CreateStockRequestModal` &rarr; `Showroom Capacity Guard`
* Each branch has a physical floor capacity cap (e.g., Peshawar: max 25 display/storage units). Requisitions exceeding capacity trigger a managerial warning requiring Head Office justification.

---

### Q258: What is the Requisition Fulfillment Cycle Time KPI?
**Answer:** Supply chain responsiveness metric:
* 📍 **System Navigation Path:** `Sidebar: Analytics & Reports` &rarr; `Supply Chain Velocity`
* Measures average hours elapsed from branch requisition submission to physical truck arrival at showroom doors (Target: &le; 36 hours network-wide).

---
[Back to Top / Navigation Index](#dealership-owners-quick-navigation--executive-index)

---

# PART 19: Inter-Branch Stock Transfers & In-Transit Custody (Q259 – Q272)

### Q259: What is an Inter-Branch Stock Transfer in AJ EcoDrive?
**Answer:** An Inter-Branch Stock Transfer is the formal logistics and legal custody workflow for moving physical electric vehicles between dealership branches (e.g., Peshawar to Islamabad) or from Central Warehouse to a branch:
* 📍 **System Navigation Path:** `Top Nav` &rarr; `Quick Actions ⌄` &rarr; `Inter-Branch Transfer` (`CreateTransferModal`) OR `Sidebar: Inventory` &rarr; `Transfers` (`/inventory/transfers`) &rarr; Click `+ Dispatch Transfer`
* **Core Rule:** Physical inventory custody is tracked continuously. During transport, vehicles reside in an immutable **`In-Transit`** state, ensuring accountability for freight drivers, origin dispatchers, and destination receivers.

---

### Q260: What are the 4 Stages of an Inter-Branch Stock Transfer?
**Answer:** Sequential multi-point custody lifecycle:
* 📍 **System Navigation Path:** `Sidebar: Inventory` &rarr; `Transfers` &rarr; `Transfer Detail Page`

```
[1. Transfer Draft / Approval] ──► Action Centre Authorization (Flow 2)
              │
              ▼
[2. Physical VIN Barcode Scan] ──► Verified at Origin Showroom Gate
              │
              ▼
[3. In-Transit Custody State]  ──► Assigned to Carrier Truck / Driver
              │
              ▼
[4. Inbound Destination Scan]  ──► Confirmed & Added to Available Floor Stock
```

---

### Q261: Why can a vehicle NEVER be moved between branches without scanning its VIN barcode?
**Answer:** Elimination of phantom stock errors and vehicle misplacement:
* 📍 **System Navigation Path:** `CreateTransferModal` &rarr; `Mandatory Barcode Scan Step`
* Dispatchers must physically scan the stamped chassis VIN barcode on each scooter before loading it onto the carrier truck. The system verifies that every single loaded vehicle matches the transfer manifest down to the exact serial number.

---

### Q262: Modal Guide — What is the CreateTransferModal (CreateTransfer.vue) and what are its exact fields?
**Answer:** The `CreateTransferModal` executes vehicle transfer dispatches:
* 📍 **System Navigation Path:** `Top Nav` &rarr; `Quick Actions ⌄` &rarr; `Inter-Branch Transfer` (`CreateTransferModal`)
* **Exact Form Fields:**
  * **Origin Branch** *(Read-Only)*: Dispatching showroom (e.g., *Islamabad Showroom*).
  * **Destination Branch** *(Dropdown, Required)*: Receiving showroom (e.g., *Peshawar Showroom*).
  * **Transfer Purpose** *(Select)*: `Emergency Customer Booking Fulfillment`, `Routine Stock Rebalancing`, `Quarantine / Repair Transfer`.
  * **Selected Chassis VINs Matrix** *(Barcode Scanner / Search)*:
    * Selects available physical units in origin stock.
    * Auto-displays Frame VIN, Battery Serial, Model, and Color.
  * **Logistics Carrier / Transport Company** *(Text, Required)*: E.g., *TCS Freight / Bilal Logistics / Dealership Truck*.
  * **Carrier Driver Full Name** *(Text, Required)*: Authorized transport driver.
  * **Driver Mobile Number** *(Phone, Required)*: Contact for real-time transit tracking.
  * **Carrier Truck License Plate** *(Text, Required)*: Vehicle registration (e.g., *ICT-LEA-9412*).
  * **Estimated Transit Duration (Hours)** *(Numeric)*: Expected travel time.
  * **Dispatch Security Gate Pass PIN** *(Manager Security PIN)*: Authorizes physical gate exit.

---

### Q263: What is an Official Inter-Branch Transfer Dispatch Gate Pass?
**Answer:** The legal transport document accompanying the carrier truck:
* 📍 **System Navigation Path:** `Transfer Detail Page` &rarr; Click **"Print Dispatch Gate Pass"**
* Contains itemized list of all Chassis VINs, Battery Serials, Driver CNIC, Truck Registration, Origin Dispatcher Signature, and Security QR Code for highway transit inspections.

---

### Q264: What happens to the vehicle status the moment the dispatch is executed?
**Answer:** Instant status transition to **`In-Transit`**:
* 📍 **System Navigation Path:** `Sidebar: Inventory` &rarr; `Serialized Units`
* The vehicle leaves Origin `Available` inventory and moves to `In-Transit`. Origin showroom cannot sell it, and Destination showroom cannot sell it until physical intake scan.

---

### Q265: How does the system handle multi-vehicle batch transfers (e.g. 10 bikes on a flatbed truck)?
**Answer:** Consolidated Batch Transfer Manifests:
* 📍 **System Navigation Path:** `CreateTransferModal` &rarr; `Batch Scan Mode`
* Dispatcher scans 10 consecutive chassis barcodes; system groups them into a single consolidated master manifest (`TR-2026-XXXX`), generating a unified carrier bill of lading.

---

### Q266: What happens if a carrier truck breaks down en route?
**Answer:** In-Transit Logistics Exception Logging:
* 📍 **System Navigation Path:** `Transfer Detail Page` &rarr; Click **"Log Transit Delay / Incident"**
* Dispatcher logs breakdown location and revised arrival time, notifying destination branch manager automatically.

---

### Q267: Can a transfer be cancelled after the truck has departed origin gates?
**Answer:** **No. Active In-Transit transfers cannot be cancelled unilaterally.**
* 📍 **System Navigation Path:** Transfer Security Engine
* Once the carrier exits origin gates, the transfer must proceed to destination or be formally redirected with Super Admin authorization.

---

### Q268: How are inter-branch transfers displayed on the live Dashboard?
**Answer:** The **Incoming Stock** Snapshot KPI Tile:
* 📍 **System Navigation Path:** `Branch Manager Dashboard` (`/dashboard`) &rarr; `Incoming Tile` (`/inventory/transfers?tab=inbound`)
* Displays total vehicles currently on carrier trucks en route to this branch, with countdown arrival timers.

---

### Q269: What transit insurance documentation is generated for high-value transfers?
**Answer:** Commercial Transit Insurance Certificate:
* 📍 **System Navigation Path:** `Transfer Detail Page` &rarr; Click **"Generate Insurance Transit Slip"**
* Computes total declared cargo valuation (PKR) and attaches OEM transit insurance policy numbers for highway carrier coverage.

---

### Q270: How does the system prevent dispatching a vehicle that has an active customer deposit?
**Answer:** Hard Reservation Interlock:
* 📍 **System Navigation Path:** `CreateTransferModal` &rarr; `VIN Selection Validation`
* The transfer engine strictly filters out units in `Reserved` status. A vehicle locked to a Peshawar customer booking cannot be selected for dispatch to Lahore.

---

### Q271: Where can logistics executives view nationwide vehicle movements?
**Answer:** The **National Logistics Fleet Map**:
* 📍 **System Navigation Path:** `Super Admin` &rarr; `Sidebar: Inventory` &rarr; `National Transfer Map` (`/inventory/transfer-map`)
* Visual dashboard tracking all carrier trucks moving across the motorway network (Peshawar, Islamabad, Rawalpindi, Lahore).

---

### Q272: What is the In-Transit Loss Rate KPI?
**Answer:** Supply chain security benchmark:
* 📍 **System Navigation Path:** `Sidebar: Analytics & Reports` &rarr; `Logistics Security KPIs`
* Measures transit damage or discrepancy rate across all carrier shipments (Target: 0.00% across network).

---
[Back to Top / Navigation Index](#dealership-owners-quick-navigation--executive-index)

---

# PART 20: Inbound Delivery Receiving & Transit Discrepancies (Q273 – Q286)

### Q273: What is the Inbound Delivery Receiving process in AJ EcoDrive?
**Answer:** Inbound Delivery Receiving is the physical verification and digital intake protocol when a logistics carrier truck arrives at a dealership branch:
* 📍 **System Navigation Path:** `Sidebar: Inventory` &rarr; `Transfers` &rarr; `Inbound Shipments Tab` (`/inventory/transfers?tab=inbound`) &rarr; Click **"Receive Shipment"** (`ReceiveTransferModal`)
* **Core Rule:** No vehicle moves into active showroom sales inventory until its chassis barcode is physically scanned at the receiving bay and inspected for transit damage.

---

### Q274: What is the 3-Step Inbound Receiving Protocol?
**Answer:** Systematic quality and security verification:
* 📍 **System Navigation Path:** `ReceiveTransferModal` &rarr; `Intake Workflow`
1. **Carrier Manifest Cross-Verification:** Match carrier driver credentials and truck license plate against digital dispatch record.
2. **Physical VIN Barcode Scan:** Scan stamped chassis VIN on each unloaded scooter.
3. **Physical Condition & Cosmetic Inspection:** Check body fairings, mirrors, digital meters, and battery casing for transit scratches or cracks.

---

### Q275: Modal Guide — What is the ReceiveTransferModal (ReceiveTransfer.vue) and what are its exact fields?
**Answer:** The `ReceiveTransferModal` executes inbound intake and logs transit discrepancies:
* 📍 **System Navigation Path:** `Sidebar: Inventory` &rarr; `Transfers` &rarr; Click `Receive Shipment` (`ReceiveTransferModal`)
* **Exact Form Fields:**
  * **Transfer Reference** *(Read-Only)*: Linked Transfer ID (`TR-2026-XXXX`).
  * **Carrier Details** *(Read-Only)*: Driver name and truck license plate.
  * **Itemized VIN Receiving Matrix** *(Barcode Scan / Interactive Checklist)*:
    * Frame Chassis VIN
    * Scanned Status: `Confirmed Matched`
    * Physical Condition: `Pristine (No Damage)`, `Minor Cosmetic Scratch`, `Severe Transit Damage`.
    * Battery Tested & Operational: `Yes / No`.
  * **Discrepancy Reporting Toggle**: Unlocks variance reporting if units are missing or damaged.
  * **Damage Evidence Photos** *(File Upload)*: Mandatory high-resolution photos for damaged units.
  * **Receiving Manager Signature / PIN** *(Security PIN)*: Mandatory managerial sign-off.

---

### Q276: What is a Transit Discrepancy, and what types can occur?
**Answer:** Any variance between the dispatch manifest and physical goods received:
* 📍 **System Navigation Path:** `ReceiveTransferModal` &rarr; `Log Discrepancy Section`
1. **Missing Unit Variance:** Manifest lists 5 bikes, but only 4 bikes were unloaded from the truck.
2. **Transit Cosmetic Damage:** Body panel scratched or indicator cracked during road transport.
3. **Hardware Serial Mismatch:** An unloaded bike has a chassis VIN different from the dispatch manifest.

---

### Q277: What happens when a Transit Damage Discrepancy is reported?
**Answer:** Automated Action Centre Flow 5 Escalation:
* 📍 **System Navigation Path:** `ReceiveTransferModal` &rarr; Submit with Damage Tag &rarr; Action Centre (`ACT-GOV-XXXX`)
* The damaged vehicle is immediately routed to **`Quarantine Bay Q-3`** (cannot be sold).
* An automated transit insurance damage claim is generated against the freight carrier.
* Undamaged pristine units from the same truck are approved and moved to `Available` stock immediately.

---

### Q278: What happens when a Missing Unit Discrepancy is reported?
**Answer:** Immediate Security Lockdown & Investigation:
* 📍 **System Navigation Path:** `ReceiveTransferModal` &rarr; Submit with Missing Unit Tag
* The missing VIN remains locked in `In-Transit / Under Investigation` status.
* Automated emergency security alerts are dispatched to Origin Branch Manager, Logistics Carrier Head, and Super Admin.

---

### Q279: What happens when all units are scanned and verified as Pristine?
**Answer:** Instant Inventory Activation:
* 📍 **System Navigation Path:** `ReceiveTransferModal` &rarr; Click **"Confirm Full Clean Receipt"**
* All vehicles move instantly from `In-Transit` to **`Available Floor Inventory`**.
* The receiving branch manager receives an instant green confirmation banner; bikes are immediately selectable for POS checkout.

---

### Q280: How does the system generate an Inbound Receiving Goods Note (GRN)?
**Answer:** Official Goods Received Note (GRN) Generation:
* 📍 **System Navigation Path:** `Transfer Detail Page` &rarr; Click **"Print Goods Received Note (GRN)"**
* Generates an official signed legal receipt handed to the carrier driver, confirming clean delivery or itemizing documented damage exceptions.

---

### Q281: Can a receiving manager accept a shipment if the internet is down?
**Answer:** Yes. **Offline Receiving Mode**:
* 📍 **System Navigation Path:** Local Desktop Application &rarr; `Inbound Transfers`
* The local SQLite database allows scanning and verifying cached transfer manifests offline. Intake confirmations queue in the Outbox and sync to Head Office upon connectivity restoration.

---

### Q282: What happens if a carrier truck arrives after regular showroom hours?
**Answer:** Night-Intake Temporary Staging Protocol:
* 📍 **System Navigation Path:** `ReceiveTransferModal` &rarr; `Intake Mode: Night Staging`
* Security guard parks vehicles in the secure internal garage bay; formal VIN inspection and digital intake are completed by the branch manager at 08:50 AM during the morning opening checklist.

---

### Q283: How are carrier driver performance and damage claims tracked?
**Answer:** Carrier Logistics Reliability Scorecard:
* 📍 **System Navigation Path:** `Sidebar: Analytics & Reports` &rarr; `Carrier Performance Scorecards` (`/reports/carriers`)
* Audits damage claim frequency per logistics vendor (TCS, Bilal Logistics, In-House Fleet), identifying transport vendors with high transit damage rates.

---

### Q284: Can a damaged vehicle be repaired locally and released from Quarantine?
**Answer:** Yes, via Workshop Repair & Re-Certification:
* 📍 **System Navigation Path:** `Quarantine Detail Page` &rarr; Click **"Open Internal Repair Ticket"**
* Workshop replaces scratched fairing panel. Once QC inspection passes, branch manager submits **Quarantine Release Request** (`ACT-GOV-XXXX`) to restore unit to `Available` stock.

---

### Q285: Where can Branch Managers view the history of all received shipments?
**Answer:** The **Inbound Receiving Archive**:
* 📍 **System Navigation Path:** `Sidebar: Inventory` &rarr; `Transfers` &rarr; `Completed Receiving Tab`
* Displays chronological archive of all historical incoming transfers with signed GRNs and damage reports.

---

### Q286: What is the Inbound Receiving Turnaround Time KPI?
**Answer:** Warehouse receiving efficiency metric:
* 📍 **System Navigation Path:** `Sidebar: Analytics & Reports` &rarr; `Inbound Receiving KPIs`
* Measures average minutes taken from carrier truck arrival to completed digital GRN intake (Target: &le; 25 minutes for a 10-bike batch).

---
[Back to Top / Navigation Index](#dealership-owners-quick-navigation--executive-index)

---

# PART 21: Blind Physical Cycle Counts & Inventory Audits (Q287 – Q300)

### Q287: What is a Blind Physical Cycle Count in AJ EcoDrive?
**Answer:** A Blind Physical Cycle Count is an unannounced inventory audit where branch staff or corporate auditors physically scan every vehicle on the showroom floor and storage rooms without seeing the expected system quantities:
* 📍 **System Navigation Path:** `Sidebar: Inventory` &rarr; `Cycle Counts & Audits` (`/inventory/cycle-counts`) &rarr; Click `+ Start Cycle Count` (`CreateCycleCountModal`)
* **Why "Blind"?** The screen hides system numbers to prevent lazy auditors from checking boxes without physically walking the floor and verifying every stamped chassis VIN.

---

### Q288: How often are Cycle Counts conducted in AJ EcoDrive?
**Answer:** Scheduled and surprise audit intervals:
* 📍 **System Navigation Path:** `Sidebar: Inventory` &rarr; `Cycle Counts`
1. **Daily Morning Walk-Around (08:45 AM):** Visual verification of floor display units.
2. **Weekly Branch Audit:** Complete scan of all vehicles and high-value battery packs.
3. **Monthly Corporate Audit:** Surprise blind count conducted by Central Head Office auditors across all branches.

---

### Q289: What is the 3-Step Cycle Count Workflow?
**Answer:** Rigorous stock-take procedure:
* 📍 **System Navigation Path:** `CreateCycleCountModal` &rarr; `Audit Workflow`
1. **Freeze Inventory Operations:** Temporarily pauses POS checkout and transfer dispatches during counting.
2. **Barcode Scanning:** Auditor scans physical chassis VIN barcode on every scooter in showroom and warehouse.
3. **Automated Variance Reconciliation:** System compares scanned VIN list against digital ledger, instantly highlighting Matched, Missing, or Unexpected units.

---

### Q290: Modal Guide — What is the CreateCycleCountModal (CreateCycleCount.vue) and what are its exact fields?
**Answer:** The `CreateCycleCountModal` initiates a physical stock-take audit session:
* 📍 **System Navigation Path:** `Sidebar: Inventory` &rarr; `Cycle Counts` &rarr; Click `+ Start Count` (`CreateCycleCountModal`)
* **Exact Form Fields:**
  * **Audit Session Name** *(Text)*: E.g., *Peshawar End-of-Month Floor Count*.
  * **Audited Branch / Location** *(Dropdown, Required)*: Showroom location.
  * **Audit Scope** *(Select)*: `Complete Showroom & Warehouse`, `Serialized Vehicles Only`, `Lithium Battery Packs Only`, `Spare Parts Only`.
  * **Lead Auditor Name** *(Text, Required)*: Corporate auditor or manager name.
  * **Barcode Scan Input Terminal** *(Continuous Scan Field)*: Scans chassis VINs continuously.
  * **Audit Remarks & Notes** *(Textarea)*: Floor condition observations.

---

### Q291: What are the 3 Types of Cycle Count Variances?
**Answer:** Clear categorization of audit findings:
* 📍 **System Navigation Path:** `Cycle Count Results Screen` (`/inventory/cycle-counts/:id`)
1. **Matched Units (Green):** Physical VIN scanned matches digital ledger exactly.
2. **Missing Units (Red):** Recorded in digital ledger as Available in Peshawar, but physical vehicle was not scanned on the floor.
3. **Unexpected / Unrecorded Units (Blue):** Physical scooter scanned on the floor, but digital ledger lists it as assigned to Islamabad or Central Warehouse.

---

### Q292: What happens immediately when a Missing Unit is detected?
**Answer:** Instant Automated Security Lockdown:
* 📍 **System Navigation Path:** `Cycle Count Reconciliation Engine`
* The missing chassis VIN is automatically locked in status **`Missing / Investigation Locked`**.
* The VIN cannot be sold, transferred, or invoiced by any user.
* An emergency Action Centre escalation (**Flow 5: `ACT-GOV-XXXX`**) is generated for Head Office executive review.

---

### Q293: Modal Guide — What is the CreateAdjustmentRequestModal (CreateAdjustmentRequest.vue) and what are its exact fields?
**Answer:** The `CreateAdjustmentRequestModal` submits formal inventory variance write-offs or write-ins:
* 📍 **System Navigation Path:** `Cycle Count Results Screen` &rarr; Click `Request Inventory Adjustment` (`CreateAdjustmentRequestModal`)
* **Exact Form Fields:**
  * **Linked Cycle Count Session** *(Read-Only)*: Audit reference ID.
  * **Chassis Frame VIN** *(Read-Only)*: Serialized unit reference.
  * **Adjustment Type** *(Select)*: `Write-Off (Missing Unit)`, `Write-In (Found Stock)`, `Serial Correction`.
  * **Financial Impact (PKR Landed Cost)** *(Auto-Calculated)*: Balance sheet write-off amount.
  * **Investigation Findings & Justification** *(Textarea, Mandatory &ge; 30 characters)*: Root cause explanation.
  * **Police FIR / Incident Report Number** *(Text, Optional)*: For suspected theft cases.
  * **Auditor & Manager Signatures** *(Dual PIN)*: Dual managerial authorization.

---

### Q294: How does Super Admin approve an Inventory Adjustment in the Action Centre?
**Answer:** Formal Executive Balance Sheet Write-Off:
* 📍 **System Navigation Path:** `Action Centre` &rarr; Select `ACT-GOV` Item &rarr; Click **"Authorize Write-Off"**
* Super Admin reviews investigation notes. Approval posts an automatic accounting entry to *Inventory Shrinkage Expense* and permanently archives the VIN record.

---

### Q295: What happens if an Unexpected (foreign branch) unit is scanned on the floor?
**Answer:** Automatic Custody Correction & Transfer Reconciliation:
* 📍 **System Navigation Path:** `Cycle Count Results Screen` &rarr; `Unexpected Stock Resolver`
* System checks recent transfer logs. If the unit was physically delivered from Islamabad but never digitally received, the system prompts the manager to execute a retro-active **Receiving Intake GRN**.

---

### Q296: How does the system audit non-serialized spare parts during cycle counts?
**Answer:** Quantity Count & Tolerance Variance:
* 📍 **System Navigation Path:** `CreateCycleCountModal` &rarr; `Scope: Spare Parts`
* Storekeeper enters physical count per SKU. The system computes variance percentage against ledger. Variances within 2% tolerance are approved locally; variances > 2% require Head Office clearance.

---

### Q297: Can a cycle count be saved and resumed later?
**Answer:** Yes. **Multi-Session Audit Suspension**:
* 📍 **System Navigation Path:** `Cycle Count Workbench` &rarr; Click **"Pause / Save Draft"**
* Allows pausing counting during showroom lunch breaks or shift handovers, resuming seamlessly without losing scanned VIN buffers.

---

### Q298: How are physical cycle count records preserved for external corporate auditors?
**Answer:** Immutable Signed Audit Certificates:
* 📍 **System Navigation Path:** `Cycle Count Detail Page` &rarr; Click **"Print Signed Audit Certificate"**
* Generates an official signed PDF report detailing all scanned VINs, timestamps, variances, and auditor signatures for external chartered accountants and bank auditors.

---

### Q299: What security measures prevent corrupt staff from borrowing bikes from other shops before an audit?
**Answer:** Simultaneous Nationwide Freeze & Surprise Audits:
* 📍 **System Navigation Path:** `Super Admin` &rarr; `Trigger Global Network Audit`
* Head Office can trigger a simultaneous nationwide count across all branches at 09:00 AM, preventing movement of vehicles between branches to cover shortages.

---

### Q300: What is the Inventory Accuracy Percentage (IPA) KPI?
**Answer:** Dealership inventory integrity score:
* 📍 **System Navigation Path:** `Sidebar: Analytics & Reports` &rarr; `Inventory Accuracy KPIs`
* Computes `(Matched Units / Total Units) * 100` (Target: &ge; 99.8% inventory accuracy across all branches).

---
[Back to Top / Navigation Index](#dealership-owners-quick-navigation--executive-index)

---

# PART 22: Quality Quarantine & Defective Stock Isolation (Q301 – Q314)

### Q301: What is the Quality Quarantine module in AJ EcoDrive?
**Answer:** Quality Quarantine is the security and inventory isolation engine that digitally and physically locks defective, damaged, or uncertified electric vehicles and high-voltage components:
* 📍 **System Navigation Path:** `Sidebar: Inventory` &rarr; `Quality Quarantine` (`/inventory/quarantine`) &rarr; Click `+ Quarantine Unit` (`CreateQuarantineRecordModal`)
* **Core Principle:** Any vehicle in Quarantine is assigned to **Physical Holding Bay Q-3** and is mathematically locked from being selected in Point of Sale (POS), Quotations, or Inter-Branch Transfers.

---

### Q302: What triggers a vehicle or component to enter Quarantine?
**Answer:** Multi-channel quality defect triggers:
* 📍 **System Navigation Path:** `Sidebar: Inventory` &rarr; `Quarantine Log`
1. **Transit Freight Damage:** Scratches, dents, or cracked fairings discovered during Inbound Receiving.
2. **BMS / Battery Diagnostic Warning:** High cell voltage delta or thermal fault during Pre-Delivery Inspection.
3. **Factory Recall Directive:** Head Office safety recall on a specific manufacturing batch.
4. **Customer Vehicle Return:** Returned vehicle undergoing workshop re-certification.

---

### Q303: What is Physical Holding Bay Q-3?
**Answer:** Dedicated Physical Isolation Area:
* 📍 **System Navigation Path:** Dealership Workshop Layout & Floor Plan
* A designated, yellow-striped secure zone in the dealership workshop where quarantined vehicles and defective batteries are physically stored under lock and key, separated from pristine sales stock.

---

### Q304: Modal Guide — What is the CreateQuarantineRecordModal (CreateQuarantineRecord.vue) and what are its exact fields?
**Answer:** The `CreateQuarantineRecordModal` isolates defective assets:
* 📍 **System Navigation Path:** `Sidebar: Inventory` &rarr; `Quality Quarantine` &rarr; Click `+ Quarantine Unit` (`CreateQuarantineRecordModal`)
* **Exact Form Fields:**
  * **Asset Category** *(Select)*: `Complete Electric Vehicle (VIN)`, `Lithium Battery Pack`, `Motor Controller`.
  * **Serialized Reference** *(Search / Dropdown, Required)*: Selects Chassis VIN or Battery Serial.
  * **Quarantine Reason Code** *(Select, Required)*:
    * `Transit Shipping Damage (Cosmetic)`
    * `High-Voltage Electrical / BMS Fault`
    * `Mechanical / Frame Integrity Defect`
    * `Manufacturer OEM Recall Batch`
    * `Customer Return Inspection`
  * **Severity Level** *(Select)*: `Minor (Repairable On-Site)`, `Major (OEM Return Required)`, `Critical Safety Hazard (Battery Swell)`.
  * **Detailed Defect Description** *(Textarea, Required)*: Technical notes.
  * **Damage Evidence Photos** *(File Upload, Mandatory &ge; 1 photo)*: High-res images.
  * **Quarantine Holding Bay** *(Select)*: `Bay Q-3 (General)` or `Fireproof Battery Locker`.

---

### Q305: What happens to a vehicle's digital status when quarantined?
**Answer:** Immediate status lock to **`Quarantine / QC Hold`**:
* 📍 **System Navigation Path:** `Sidebar: Inventory` &rarr; `Serialized Units`
* The unit turns crimson across all inventory screens. POS checkout buttons display a locked warning: *"LOCKED: Unit is in Quality Quarantine (Reason: [Reason])"*.

---

### Q306: How are Quarantined units repaired and re-certified?
**Answer:** Workshop Rectification Workflow:
* 📍 **System Navigation Path:** `Quarantine Detail Page` (`/inventory/quarantine/:id`) &rarr; Click **"Open Workshop Rectification Job"**
* Generates an internal workshop job card. Technicians replace damaged body panels, flash BMS firmware, or balance battery cells, signing off a 5-point post-repair inspection.

---

### Q307: How is a repaired vehicle Released from Quarantine back into Available stock?
**Answer:** Action Centre Flow 5 Governance Sign-Off:
* 📍 **System Navigation Path:** `Quarantine Detail Page` &rarr; Click **"Request Quarantine Release"** &rarr; Action Centre (`ACT-GOV-XXXX`)
* Workshop Foreman and Branch Manager submit post-repair photos and QC test reports. Super Admin reviews and clicks **"Authorize Quarantine Release"**, restoring unit status to `Available`.

---

### Q308: What happens if a quarantined unit is unrepairable (Severe Damage / Factory Scrap)?
**Answer:** OEM Factory Return or Scrap Decommissioning:
* 📍 **System Navigation Path:** `Quarantine Detail Page` &rarr; Click **"Decommission / Return to OEM"**
* Generates an OEM Return Debit Memo for full factory credit or processes an insurance write-off.

---

### Q309: How does the system handle Nationwide OEM Safety Recalls?
**Answer:** Batch Recall Directive Engine:
* 📍 **System Navigation Path:** `Super Admin` &rarr; `Sidebar: Procurement` &rarr; `Broadcast Safety Recall`
* Super Admin selects affected factory batch (e.g. *All E-125 units produced between March 1 and March 15 with Controller Batch #CTL-902*). The system instantly moves all matching VINs across all branches into `Quarantine / Recall Hold` status.

---

### Q310: What physical warning tags are attached to quarantined vehicles?
**Answer:** Waterproof Crimson Quarantine Barcode Tags:
* 📍 **System Navigation Path:** `Quarantine Detail Page` &rarr; Click **"Print Quarantine Tag"**
* Prints a high-visibility crimson warning tag affixed to the handlebars: *"DO NOT MOVE / DO NOT SELL — QUALITY QUARANTINE REF: QR-2026-XXXX"*.

---

### Q311: How does the system prevent fire hazards in the battery quarantine area?
**Answer:** Thermal Monitoring & Battery Isolation:
* 📍 **System Navigation Path:** `Sidebar: After-Sales & Workshop` &rarr; `Quarantine Safety Logs`
* Damaged lithium batteries with thermal swelling or electrolyte leaks are strictly assigned to the **Fireproof Sand Locker**, with automated temperature sensor logging.

---

### Q312: How are quarantine costs and replacement parts accounted for?
**Answer:** Warranty & Scrap Expense Ledgers:
* 📍 **System Navigation Path:** `Sidebar: Finance & Accounts` &rarr; `Quality & Warranty Cost Center`
* Costs incurred to repair transit-damaged or factory-defective stock are debited to *OEM Warranty Recovery* or *Carrier Insurance Claims*, keeping branch showroom P&L clean.

---

### Q313: Where can dealership executives review active quarantine inventory?
**Answer:** The **Quarantine Management Workbench**:
* 📍 **System Navigation Path:** `Sidebar: Inventory` &rarr; `Quality Quarantine` (`/inventory/quarantine`)
* Summarizes all units currently in holding bays across all branches, filterable by defect severity, days in quarantine, and repair status.

---

### Q314: What is the Quarantine Resolution Velocity KPI?
**Answer:** Quality turnaround benchmark:
* 📍 **System Navigation Path:** `Sidebar: Analytics & Reports` &rarr; `Quality Resolution KPIs`
* Measures average days taken to repair and release quarantined vehicles back to showroom floor (Target: &le; 3 business days).

---
[Back to Top / Navigation Index](#dealership-owners-quick-navigation--executive-index)

---

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

---

# SECTION VII: HEAD OFFICE GOVERNANCE, PROCUREMENT & NETWORK ADMINISTRATION

---

# PART 25: Sea Container Imports, Procurement & Supplier Management (Q343 – Q358)

### Q343: How does AJ EcoDrive manage International Sea Container Procurement?
**Answer:** International supply chain and OEM container procurement is managed via the **Global Procurement & Container Management Workbench**:
* 📍 **System Navigation Path:** `Super Admin` &rarr; `Sidebar: Procurement` &rarr; `Purchase Orders` (`/procurement/purchase-orders`) &rarr; Click `+ New Container PO` (`CreatePurchaseOrderModal`)
* **Core Capabilities:** Tracks overseas OEM manufacturing orders (China, Taiwan), 40ft High-Cube shipping containers, commercial Bills of Lading, customs clearance at Karachi Port, landed cost breakdowns (PKR), and automated batch VIN serialization upon warehouse intake.

---

### Q344: What is the lifecycle of an International Sea Container Import PO?
**Answer:** 6-Stage International Procurement Lifecycle:
* 📍 **System Navigation Path:** `Sidebar: Procurement` &rarr; `Purchase Order Detail Page`

```
[1. PO Draft & Pro-Forma Approval] ──► OEM Factory Order Placed (USD / CNY)
              │
              ▼
[2. Factory Production & Stamping]  ──► Frame VINs & Battery Serials Assigned
              │
              ▼
[3. Ocean Freight / In-Transit]     ──► 40ft Container on Vessel (Bill of Lading)
              │
              ▼
[4. Karachi Port Customs Clearance] ──► Customs Duties, Taxes & Freight Paid
              │
              ▼
[5. Central Warehouse Intake Scan]  ──► Physical Container Unloaded (GRN Generated)
              │
              ▼
[6. Batch Serialization Complete]   ──► Units Activated in Nationwide Available Stock
```

---

### Q345: Modal Guide — What is the CreatePurchaseOrderModal (CreatePurchaseOrder.vue) and what are its exact fields?
**Answer:** The `CreatePurchaseOrderModal` initiates international container purchase orders:
* 📍 **System Navigation Path:** `Super Admin` &rarr; `Sidebar: Procurement` &rarr; Click `+ New Container PO` (`CreatePurchaseOrderModal`)
* **Exact Form Fields:**
  * **OEM Supplier Name** *(Dropdown, Required)*: E.g., *Shenzhen EV Manufacturing Ltd / Wuxi SuperSpeed EV Co.*
  * **Procurement Category** *(Select)*: `CBU (Completely Built Units)`, `CKD (Knocked Down Kits)`, `Lithium Battery Packs (Batch)`, `Spare Parts Container`.
  * **Supplier Currency & Exchange Rate** *(Select/Numeric)*: `USD (1 USD = PKR 278.50)` or `CNY (1 CNY = PKR 38.60)`.
  * **Ordered EV Models & Quantities Matrix** *(Multi-Row Table)*:
    * Select Product Model (e.g. *BRG E-125 Commuter Scooter*)
    * Color Breakdown (e.g. *25x Metallic Blue, 25x Pearl White, 20x Crimson Red*)
    * Unit FOB Price (USD)
  * **Shipping Container Specifications**:
    * Container Number (e.g., `MSKU-948201-4`)
    * Shipping Line (Maersk / COSCO / MSC)
    * Bill of Lading (B/L) Number
    * Target Port of Discharge: `Karachi Port (QICT / KICT)`.
  * **Expected Factory Dispatch Date & Arrival Date** *(Date Range)*.

---

### Q346: How does the system compute Landed Cost per Vehicle (PKR)?
**Answer:** Comprehensive Multi-Factor Landed Cost Engine:
* 📍 **System Navigation Path:** `Purchase Order Detail Page` &rarr; `Landed Cost Calculation Tab`
* **Landed Cost Breakdown:**
  * Base Factory FOB Purchase Price: `USD 520 (PKR 144,820)`
  * Ocean Container Freight (per unit share): `+ PKR 12,500`
  * Karachi Port Customs Duty (EV SRO Concession): `+ PKR 14,480 (10%)`
  * Additional Customs Regulatory Duties & Clearance Fees: `+ PKR 4,200`
  * Inland Trucking Freight (Karachi to Islamabad Central Warehouse): `+ PKR 8,000`
  * Assembly / Uncrating Labour: `+ PKR 1,000`
  * **Total True Landed Cost per Unit:** **`PKR 185,000`**

---

### Q347: Modal Guide — What is the ReceivePurchaseModal (ReceivePurchase.vue) and what are its exact fields?
**Answer:** The `ReceivePurchaseModal` executes sea container unloading and batch VIN intake:
* 📍 **System Navigation Path:** `Purchase Order Detail Page` &rarr; Click `Unload & Receive Container` (`ReceivePurchaseModal`)
* **Exact Form Fields:**
  * **Linked Purchase Order Reference** *(Read-Only)*: PO ID (`PO-2026-XXXX`).
  * **Container Seal Inspection Checkbox**: Verifies intact OEM customs seal number.
  * **Receiving Warehouse Location** *(Dropdown, Required)*: `Central Warehouse (Islamabad)`.
  * **Batch VIN Import / Barcode Scan Matrix**:
    * Automated Excel/CSV Batch Upload of OEM VIN & Battery serial list.
    * OR Handheld USB Barcode Scanner continuous scanning.
  * **Unloading Physical Condition Checklist**:
    * Total Units Expected: `70 Units`
    * Total Units Pristine: `68 Units`
    * Damaged / Scratched in Transit: `2 Units (Routed to Bay Q-3)`
  * **Warehouse Receiving Master GRN PIN** *(Security PIN)*: Mandatory sign-off.

---

### Q348: How does Batch VIN Serialization work during container intake?
**Answer:** Automated High-Velocity Serialized Asset Creation:
* 📍 **System Navigation Path:** `ReceivePurchaseModal` &rarr; `Upload Serialized Manifest`
* Uploading the factory CSV manifest creates 70 individual serialized records in seconds, pairing each Chassis Frame VIN with its corresponding Lithium Battery Serial and Motor Controller ID, setting initial status to `Available (Central Warehouse)`.

---

### Q349: What happens if a sea container arrives with damaged electric bikes?
**Answer:** Automated Marine Transit Damage Claim:
* 📍 **System Navigation Path:** `ReceivePurchaseModal` &rarr; `Log Container Damage`
* The damaged bikes are tagged with photos and routed to `Quarantine Bay Q-3`. The system generates an official **Marine Cargo Insurance Claim Certificate** for financial compensation against the shipping line.

---

### Q350: How does AJ EcoDrive track Supplier Quality and Defect Rates?
**Answer:** OEM Supplier Quality Scorecard:
* 📍 **System Navigation Path:** `Super Admin` &rarr; `Sidebar: Procurement` &rarr; `Supplier Analytics` (`/procurement/suppliers`)
* Audits defect rates across international factories (e.g. *Shenzhen EV Co: 0.8% defect rate vs. Wuxi Motors: 3.2% defect rate*), guiding contract negotiations.

---

### Q351: How are Letter of Credit (LC) and Bank Wire Payments recorded?
**Answer:** International Trade Finance Accounting:
* 📍 **System Navigation Path:** `Purchase Order Detail Page` &rarr; `Payments & LC Tab`
* Tracks LC Issuance Number, Issuing Bank (Meezan Bank / Standard Chartered), Swift Wire Reference, Currency Conversion Rate, and Advance Milestone Payments (30% deposit upon order, 70% against Bill of Lading).

---

### Q352: Can CKD (Knocked Down) Assembly kits be tracked and converted into CBU bikes?
**Answer:** Yes. **CKD Assembly & Manufacturing Module**:
* 📍 **System Navigation Path:** `Sidebar: Procurement` &rarr; `CKD Assembly Workbench` (`/procurement/assembly`)
* Tracks raw unassembled components (Frames, Motors, Wire Looms, Wheels) and generates a serializing work order when local technicians assemble them into a finished electric bike.

---

### Q353: What customs SRO tax concessions are applied to electric vehicle imports?
**Answer:** Pakistan EV Policy (SRO 644/837) Compliance:
* 📍 **System Navigation Path:** `Purchase Order Detail Page` &rarr; `Customs SRO Tax Configuration`
* Applies special EV concessionary customs tariffs (1% to 10% customs duty and 1% sales tax on EV CKD components) as per Government of Pakistan National Electric Vehicle Policy.

---

### Q354: How does the system handle spare parts container imports?
**Answer:** Batch Spare Parts Intake Ledger:
* 📍 **System Navigation Path:** `CreatePurchaseOrderModal` &rarr; `Category: Spare Parts Container`
* Imports 200+ distinct part SKUs (tyres, throttles, headlights, brake calipers), automatically updating inventory stock quantities and updating Landed Cost per part.

---

### Q355: Where can executives view live In-Transit Sea Container tracking?
**Answer:** The **Global Ocean Freight Vessel Tracker**:
* 📍 **System Navigation Path:** `Sidebar: Procurement` &rarr; `Vessel In-Transit Dashboard` (`/procurement/vessels`)
* Displays active vessels, ETA at Karachi Port, customs clearance status, and inland trailer freight progress to Islamabad.

---

### Q356: Can an unapproved Purchase Order be dispatched to an OEM supplier?
**Answer:** **No. POs require dual Super Admin & CFO authorization.**
* 📍 **System Navigation Path:** Procurement Authorization Engine
* The system enforces dual digital signatures before releasing the official PDF Purchase Order to the overseas OEM supplier.

---

### Q357: How are historical import price variances analyzed across containers?
**Answer:** Container Inflation & Landed Cost Variance Report:
* 📍 **System Navigation Path:** `Sidebar: Analytics & Reports` &rarr; `Import Price Variance Report` (`/reports/import-variance`)
* Graphs FOB purchase price trends, ocean freight container rate fluctuations, and USD/PKR exchange rate impacts over the last 24 months.

---

### Q358: What is the Procurement Lead Time KPI?
**Answer:** Supply chain planning benchmark:
* 📍 **System Navigation Path:** `Sidebar: Analytics & Reports` &rarr; `Procurement KPIs`
* Measures average days elapsed from Purchase Order placement to physical container intake at Central Warehouse (Target: 45 to 60 calendar days).

---
[Back to Top / Navigation Index](#dealership-owners-quick-navigation--executive-index)

---

# PART 26: Showroom Branches, User Accounts & Security Permissions (Q359 – Q374)

### Q359: How are new Dealership Showroom Branches configured in AJ EcoDrive?
**Answer:** Showroom branches are provisioned via the **Dealership Network & Branch Administration Workbench**:
* 📍 **System Navigation Path:** `Super Admin` &rarr; `Sidebar: Settings & System` &rarr; `Showroom Branches` (`/settings/branches`) &rarr; Click `+ Add Showroom Branch` (`CreateBranchModal`)
* **Core Principle:** Each branch is a distinct operational entity with its own dedicated physical inventory holding bays, local cashier safes, assigned staff, and local tax registration.

---

### Q360: Modal Guide — What is the CreateBranchModal (CreateBranch.vue) and what are its exact fields?
**Answer:** The `CreateBranchModal` opens a new dealership location in the system:
* 📍 **System Navigation Path:** `Super Admin` &rarr; `Sidebar: Settings & System` &rarr; `Showroom Branches` &rarr; Click `+ Add Showroom Branch`
* **Exact Form Fields:**
  * **Branch Code** *(Text, Required)*: Unique 3-4 letter identifier (`PEW-01`, `ISB-01`, `LHE-01`, `RWP-01`).
  * **Showroom Branch Name** *(Text, Required)*: E.g., *Peshawar University Road Showroom & 3S Workshop*.
  * **Physical Street Address** *(Textarea, Required)*: Official commercial showroom location.
  * **City & Province** *(Dropdown, Required)*: Peshawar (KP), Islamabad (ICT), Lahore (Punjab), Rawalpindi (Punjab).
  * **Assigned Branch Manager** *(Dropdown, Required)*: Active manager account.
  * **Branch Contact Phone & Email** *(Contact Details)*.
  * **Branch Facilities Available** *(Checkboxes)*: `Showroom Sales Floor`, `3S Service Workshop`, `Battery Diagnostic Lab`, `Storage Warehouse`.
  * **Standard Cash Drawer Float Limit (PKR)** *(Numeric)*: Default daily float (e.g. `PKR 25,000`).
  * **Petty Cash Discretionary Limit (PKR)** *(Numeric)*: Default ceiling (`PKR 15,000`).

---

### Q361: How are User Accounts created and managed in the system?
**Answer:** User accounts are managed via the **Staff Directory & User Management Workbench**:
* 📍 **System Navigation Path:** `Super Admin` &rarr; `Sidebar: Settings & System` &rarr; `User Accounts` (`/settings/users`) &rarr; Click `+ Add New User` (`CreateUserModal`)
* **Security Rule:** Every user is bound to a verified employee profile, assigned role permissions, and scoped to a specific branch showroom.

---

### Q362: Modal Guide — What is the CreateUserModal (CreateUser.vue) and what are its exact fields?
**Answer:** The `CreateUserModal` provisions staff credentials:
* 📍 **System Navigation Path:** `Super Admin` &rarr; `Sidebar: Settings & System` &rarr; `User Accounts` &rarr; Click `+ Add New User`
* **Exact Form Fields:**
  * **Employee Full Name** *(Text, Required)*: Legal employee name.
  * **Employee CNIC Number** *(13-digit Masked, Required)*: NADRA citizen ID.
  * **Corporate Email Address** *(Email, Required)*: `name@ajecodrive.com`.
  * **Mobile Number** *(Phone, Required)*: Two-Factor Auth mobile phone.
  * **Assigned Primary Role** *(Dropdown, Required)*:
    * `Super Admin (Head Office Nationwide)`
    * `Branch Manager (Showroom Command)`
    * `Showroom Sales Representative`
    * `Branch Cashier / Accounts Clerk`
    * `Workshop Service Advisor / Foreman`
    * `Workshop Certified EV Technician`
    * `Inventory Storekeeper`
  * **Assigned Branch Scope** *(Dropdown, Required)*: `All Branches (Super Admin Only)` or specific branch (`Peshawar Showroom`).
  * **Initial Temporary Password** *(Password Input, Required)*: Forces password change upon first login.
  * **Account Status** *(Toggle)*: `Active` or `Inactive`.

---

### Q363: What is Role-Based Access Control (RBAC) in AJ EcoDrive?
**Answer:** Mathematical security permission matrix enforcing principle of least privilege:
* 📍 **System Navigation Path:** `Sidebar: Settings & System` &rarr; `Role Permissions Matrix` (`/settings/roles`)
* Sales reps cannot view wholesale landing costs or approve discounts > 8%. Cashiers cannot modify sales invoices. Workshop mechanics cannot access financial ledgers.

---

### Q364: How does Branch Scoping restrict user data access?
**Answer:** Architectural multi-tenant isolation:
* 📍 **System Navigation Path:** Core Database & API Layer
* When a Branch Manager (`PEW-01`) logs in, all database queries automatically filter with `WHERE branch_id = 'PEW-01'`. The manager cannot see customer leads, cash drawers, or workshop tickets belonging to Lahore or Islamabad.

---

### Q365: How does Two-Factor Authentication (2FA) work in AJ EcoDrive?
**Answer:** Time-Based One-Time Password (TOTP) & SMS 2FA:
* 📍 **System Navigation Path:** `User Preferences` &rarr; `Security & 2FA Tab`
* Users scan a QR code with Google Authenticator or receive an SMS OTP when logging into new or unrecognized devices.

---

### Q366: What happens when an employee is Terminated or Suspended?
**Answer:** Instant Nationwide Session Blacklisting:
* 📍 **System Navigation Path:** `User Accounts` (`/settings/users`) &rarr; Select User &rarr; Toggle **"Inactive / Terminate"**
* Super Admin deactivation immediately invalidates all active JWT tokens on central servers and broadcasts revocation commands to offline workstation caches.

---

### Q367: How does the system handle Internal Staff Chat and Operational Announcements?
**Answer:** Integrated **Dealership Team Chat & Announcement Broadcast**:
* 📍 **System Navigation Path:** `Top Navigation Header` &rarr; `Team Chat Icon` (`/chat`)
* Provides branch group channels (`#peshawar-team`, `#workshop-techs`) and nationwide executive broadcast banners for Head Office directives.

---

### Q368: Can a Branch Manager create new user accounts for their showroom?
**Answer:** Branch Managers can create staff drafts; Super Admin authorizes:
* 📍 **System Navigation Path:** `Branch Manager` &rarr; `Request Staff Account`
* Prevents rogue account creation and phantom payroll entries.

---

### Q369: What audit logging is captured when a user account is modified?
**Answer:** Security Audit Trail:
* 📍 **System Navigation Path:** `Sidebar: Analytics & Reports` &rarr; `Security Audit Logs`
* Logs exact timestamp, admin username, modified permissions, and IP address for every user modification.

---

### Q370: How does the system support biometric fingerprint logins?
**Answer:** Windows Hello & WebAuthn Biometric Authentication:
* 📍 **System Navigation Path:** `User Preferences` &rarr; `Biometric Login Settings`
* Allows counter staff to tap a USB fingerprint scanner for 1-second login without typing passwords in front of customers.

---

### Q371: What happens if an employee attempts brute-force password guessing?
**Answer:** Automated 5-Attempt Account Lockout:
* 📍 **System Navigation Path:** Login Security Engine
* 5 consecutive incorrect password attempts locks the account for 30 minutes, dispatching an alert to the IT Security Administrator.

---

### Q372: Where can Super Admins review active logged-in user sessions?
**Answer:** The **Active Sessions & Device Monitor**:
* 📍 **System Navigation Path:** `Super Admin` &rarr; `Sidebar: Settings & System` &rarr; `Active Sessions` (`/settings/sessions`)
* Displays all active users across the country, device IP, browser/desktop client, and provides 1-click **"Kill Session"** capability.

---

### Q373: Can staff share user accounts across shifts?
**Answer:** **Strictly Prohibited by System Policy.**
* 📍 **System Navigation Path:** Compliance Guidelines
* Every employee must operate under their unique assigned user ID to maintain forensic traceability for cash collections, discounts, and inventory handovers.

---

### Q374: What is the System Security & Compliance Health Score KPI?
**Answer:** Enterprise security benchmark:
* 📍 **System Navigation Path:** `Sidebar: Analytics & Reports` &rarr; `Security Scorecard`
* Evaluates network compliance: 2FA adoption %, password rotation freshness, and zero unauthenticated terminal breaches.

---
[Back to Top / Navigation Index](#dealership-owners-quick-navigation--executive-index)

---

# SECTION VIII: COLLABORATION MATRIX, ARCHITECTURE & APPENDICES

---

# PART 27: Super Admin & Branch Manager 10 Master Touchpoints Collaboration Matrix (Q375 – Q390)

### Q375: What is the 10 Master Touchpoints Collaboration Matrix in AJ EcoDrive?
**Answer:** The 10 Master Touchpoints Collaboration Matrix is the foundational operational contract defining how **Head Office Executive Leadership (Super Admin)** and **Dealership Showroom Commanders (Branch Managers)** collaborate to run a secure, profitable multi-city EV enterprise:
* 📍 **System Navigation Path:** Master Enterprise Operating Architecture
* **Core Philosophy:** Clear segregation of duties, zero operational bottlenecks, automated decision routing, and 100% auditable collaboration across commercial sales, inventory custody, cash protection, and technical warranty.

---

### Q376: What are the 10 Master Touchpoints in AJ EcoDrive?
**Answer:** The complete 10 operational collaboration touchpoints:
* 📍 **System Navigation Path:** `Dashboard` &rarr; `Action Centre` (`/dashboard/action-centre`)

| Touchpoint # | Operational Domain | Branch Manager Role (Showroom Ground) | Super Admin Role (Head Office Leadership) | Primary Workflow / Screen |
| :--- | :--- | :--- | :--- | :--- |
| **Touchpoint 1** | **Commercial Pricing & Discount Exceptions** | Enters customer discount &le; 8%; escalates requests > 8% with justification. | Reviews gross margin impact in Action Centre; executes Approve / Counter-Offer / Reject. | `CreateQuotationModal` &rarr; `ACT-PRC` |
| **Touchpoint 2** | **Inter-Branch Vehicle Transfers** | Requests vehicle pull from other city; scans physical VIN at dispatch/receiving. | Authorizes inter-city logistics; monitors nationwide inventory distribution. | `CreateTransferModal` &rarr; `ACT-STK` |
| **Touchpoint 3** | **Showroom Operating Expenses (OPEX)** | Approves petty OPEX &le; PKR 15,000; logs bills with photo receipts. | Reviews claims > PKR 15,000; authorizes online bank disbursements. | `CreateExpenseModal` &rarr; `ACT-EXP` |
| **Touchpoint 4** | **Lithium Battery & OEM Warranty Claims** | Conducts OBD diagnostic scan; submits battery SOH data & casing photos. | Validates 3-way serialized hardware binding; approves OEM factory replacement. | `CreateCaseModal` &rarr; `ACT-WRN` |
| **Touchpoint 5** | **Physical Inventory Audits & Cycle Counts** | Conducts blind barcode scan of all showroom floor bikes and parts shelves. | Reviews missing VIN variances; authorizes formal balance sheet write-offs. | `CreateCycleCountModal` &rarr; `ACT-GOV` |
| **Touchpoint 6** | **Global Sea Container Imports & POs** | Submits stock replenishment requisitions based on showroom demand. | Procures CBU/CKD 40ft containers from China; manages customs clearance & landed cost. | `CreatePurchaseOrderModal` &rarr; `ReceivePurchaseModal` |
| **Touchpoint 7** | **Master Product Catalog & MSRP Pricing** | Sells vehicles at active catalog prices; receives automatic price update alerts. | Updates master MSRP, promotional discounts, and technical specs nationwide. | `Sidebar: Products` &rarr; `/catalog/products` |
| **Touchpoint 8** | **Staff Account Provisioning & Security** | Assigns daily shift roles; reports staff terminations or credential resets. | Provisions user accounts, configures RBAC permission tiers, and monitors security logs. | `Sidebar: Settings` &rarr; `/settings/users` |
| **Touchpoint 9** | **Day-End Cash Closing & Z-Reports** | Counts physical cash note denominations; reconciles till; drops cash at bank. | Inspects nationwide daily closing dashboard; audits cash variances across branches. | `Sidebar: Finance` &rarr; `/finance/day-end-closing` |
| **Touchpoint 10** | **Quality Quarantine & Safety Recalls** | Isolates transit-damaged stock in Bay Q-3; performs local re-certification. | Broadcasts nationwide OEM recall directives; authorizes quarantine stock releases. | `Sidebar: Inventory` &rarr; `/inventory/quarantine` |

---

### Q377: How is Touchpoint 1 (Commercial Pricing) executed under high pressure on the showroom floor?
**Answer:** Rapid 15-Minute Action Centre SLA:
* 📍 **System Navigation Path:** `CreateQuotationModal` &rarr; Action Centre (`ACT-PRC-XXXX`)
* When a high-value customer threatens to walk away unless granted a 10% discount, the branch manager submits a Flow 1 pricing waiver with priority `< 2h Critical`. Super Admin receives an instant push alert, inspects net dealer margin on their phone, and approves the deal in under 90 seconds while the customer is drinking tea at the sales counter.

---

### Q378: How is Touchpoint 2 (Stock Reallocation) governed between competing branch managers?
**Answer:** Centralized Head Office Neutral Arbitration:
* 📍 **System Navigation Path:** `Action Centre` &rarr; `ACT-STK-XXXX`
* If Peshawar requests a high-demand Metallic Red scooter from Islamabad, the Islamabad manager cannot arbitrarily refuse. Super Admin reviews nationwide demand analytics and approves the transfer to maximize overall dealership revenue.

---

### Q379: How does Touchpoint 3 (OPEX) prevent petty cash embezzlement?
**Answer:** Dual-Layer Financial Verification:
* 📍 **System Navigation Path:** `Sidebar: Finance & Accounts` &rarr; `Showroom Expenses`
* Branch managers cannot exceed PKR 15,000 without CFO clearance. Every single rupee spent locally requires a photo receipt and is audited during the mandatory Day-End Z-Closing reconciliation.

---

### Q380: How does Touchpoint 4 (Warranty Claims) protect dealership relationship with OEM manufacturers?
**Answer:** Ironclad Technical Evidence Submissions:
* 📍 **System Navigation Path:** `Sidebar: After-Sales & Workshop` &rarr; `Battery Diagnostic Lab`
* Every battery warranty claim submitted to the Chinese factory includes digital BMS logs, cell delta telemetry, and photo proof of intact seals, ensuring 100% factory reimbursement without warranty dispute rejections.

---

### Q381: How does Touchpoint 5 (Cycle Counts) enforce zero inventory theft?
**Answer:** Surprise Blind Physical Counts:
* 📍 **System Navigation Path:** `Sidebar: Inventory` &rarr; `Cycle Counts & Audits`
* Branch staff cannot view expected quantities while scanning. Any missing chassis VIN is immediately locked nationwide, preventing staff from covering shortages by borrowing bikes from other shops.

---

### Q382: How does Touchpoint 6 (Container Imports) coordinate with local showroom floor space?
**Answer:** Advance Inbound Shipment Tracking:
* 📍 **System Navigation Path:** `Sidebar: Procurement` &rarr; `Purchase Orders`
* Branch managers see incoming containers 14 days before port arrival, allowing them to pre-sell units via **Sales Orders (Bookings)** before the ship docks at Karachi.

---

### Q383: How does Touchpoint 7 (Catalog Updates) prevent selling at outdated prices?
**Answer:** Instant Nationwide Broadcast Banners:
* 📍 **System Navigation Path:** Top Header Alert System
* When Head Office updates base MSRP, active POS forms and new quotations update immediately. Unfinished drafts display an alert: *"Price Updated by Head Office"*.

---

### Q384: How does Touchpoint 8 (Staff RBAC) maintain institutional data security?
**Answer:** Zero Data Leakage Architecture:
* 📍 **System Navigation Path:** `Sidebar: Settings & System` &rarr; `User Management`
* Departing sales reps cannot export customer phone lists or view profit margins. User account termination takes effect nationwide in under 1 second.

---

### Q385: How does Touchpoint 9 (Day-End Closing) guarantee safe bank deposits?
**Answer:** Bank Deposit Slip Stamped Cross-Reconciliation:
* 📍 **System Navigation Path:** `Sidebar: Finance & Accounts` &rarr; `Daily Cash Drops`
* Cashier drops the day's cash collection into the corporate bank account each morning. The stamped bank deposit slip is uploaded to AJ EcoDrive, cross-reconciling the previous day's Z-Report to PKR 0.00 variance.

---

### Q386: How does Touchpoint 10 (Quarantine) protect road safety and brand reputation?
**Answer:** Strict Defective Stock Quarantine Locks:
* 📍 **System Navigation Path:** `Sidebar: Inventory` &rarr; `Quality Quarantine`
* Transit-damaged scooters or vehicles with unstable BMS voltages can never be delivered to customers. Only formal re-certification releases the vehicle from Bay Q-3.

---

### Q387: Can a Super Admin override a Branch Manager's operational decision?
**Answer:** Yes. Super Admin possesses ultimate enterprise administrative authority:
* 📍 **System Navigation Path:** Super Admin Master Controls
* Super Admins can re-allocate stock, cancel fraudulent orders, or adjust pricing exceptions with mandatory audit justification notes.

---

### Q388: How does the system resolve operational disagreements between Head Office and Branch Managers?
**Answer:** Action Centre Discussion Thread & Revision History:
* 📍 **System Navigation Path:** `Action Centre` &rarr; `Activity & Discussion Thread`
* All operational arguments, counter-offers, and managerial rationales are permanently preserved in the task history, fostering transparent executive accountability.

---

### Q389: What executive reports summarize nationwide Touchpoint performance?
**Answer:** The **Executive Dealership Collaboration Scorecard**:
* 📍 **System Navigation Path:** `Sidebar: Analytics & Reports` &rarr; `Executive Collaboration Report` (`/reports/collaboration`)
* Evaluates branch compliance, SLA decision speeds, cash accuracy, and warranty recovery efficiency across all dealership locations.

---

### Q390: What is the Master Collaboration Efficiency Score KPI?
**Answer:** Overall dealership operational health score:
* 📍 **System Navigation Path:** `Super Admin Dashboard` &rarr; `Enterprise Health Index`
* Composite index measuring SLA response rates, zero-variance closings, inventory accuracy, and customer satisfaction (Target: &ge; 98.2% enterprise health).

---
[Back to Top / Navigation Index](#dealership-owners-quick-navigation--executive-index)

---

# PART 28: Offline Continuity, Synchronization & Local Workstation Architecture (Q391 – Q405)

### Q391: How does AJ EcoDrive ensure uninterrupted operations during Internet Outages and Power Load-Shedding?
**Answer:** AJ EcoDrive is engineered with **Local Offline Durability & Dual-Tier Synchronization Architecture**:
* 📍 **System Navigation Path:** `Top Header Bar` &rarr; `Connectivity Badge` (`GREEN (ONLINE) / AMBER (OFFLINE)`)
* **The Reality in Pakistan:** Power cuts, UPS cutovers, and local fiber internet disruptions are routine daily events.
* **The AJ EcoDrive Solution:** Showroom counter workstations run on a local embedded SQLite database engine. When internet drops, the system seamlessly transitions to **AMBER (OFFLINE)** mode. Staff can continue capturing walk-in leads, creating quotations, executing POS sales, recording cash payments, and printing thermal receipts without missing a second of business.

---

### Q392: What are the 3 System Connectivity States in AJ EcoDrive?
**Answer:** High-visibility real-time status indicators in the application header:
* 📍 **System Navigation Path:** `Top Header Bar` &rarr; `System Status Badge`
1. **GREEN (ONLINE):** Full high-speed bi-directional synchronization with Head Office cloud server.
2. **AMBER (OFFLINE):** Internet unavailable; all transactions executing locally and queuing in local Outbox.
3. **BLUE (SYNCING):** Connectivity restored; local Outbox actively pushing transactions and pulling central updates.

---

### Q393: What core operations are 100% functional while completely OFFLINE?
**Answer:** Full Showroom Sales & Workshop Continuity:
* 📍 **System Navigation Path:** Local Workstation Engine
* **Fully Operational Offline:**
  * Creating new Walk-In Leads (`CreateLeadModal`).
  * Generating formal Customer Price Quotations (`CreateQuotationModal`).
  * Executing Point of Sale (POS) checkouts on local floor stock (`CreateSaleModal`).
  * Recording Cash / Card payments and printing thermal POS receipts (`CreatePaymentModal`).
  * Opening Workshop Service Intake cases and Mechanic Job Cards (`CreateCaseModal`).
  * Executing 6-point Pre-Delivery Inspections (PDI) and printing Delivery Gate Passes.
  * Logging Showroom Petty Cash expenses (`CreateExpenseModal`).

---

### Q394: What high-stakes operations require an active INTERNET connection?
**Answer:** Centralized Multi-Branch Decision Gates:
* 📍 **System Navigation Path:** Cloud Decision Engine
* **Operations Requiring Connectivity:**
  * Submitting Action Centre requests requiring Head Office approval (Commercial discounts > 8%, OPEX > PKR 15,000, OEM battery warranty replacements).
  * Direct inter-branch vehicle transfers involving live stock re-allocation in another city.
  * Downloading fresh international sea container purchase order manifests.

---

### Q395: How does the Local Outbox Synchronization Engine work?
**Answer:** Cryptographic First-In First-Out (FIFO) Synchronization Queue:
* 📍 **System Navigation Path:** `Sidebar: Settings & System` &rarr; `Offline Outbox Monitor` (`/system/outbox`)
* Every offline transaction is signed with a local cryptographic hash and stored in the local SQLite queue.
* The moment internet connectivity restores, a background synchronization worker transmits the queued transactions in exact chronological order, verifying server acknowledgment before clearing local buffers.

---

### Q396: How does the system resolve data conflicts between branches during offline sync?
**Answer:** Deterministic Timestamp & Custody Conflict Resolution:
* 📍 **System Navigation Path:** Central Conflict Resolution Engine
* **Branch Custody Isolation Prevents Conflicts:** Because a branch can only sell VINs in its own physical custody, two branches can *never* sell the same physical chassis.
* **Last-Write-Wins with Forensic Audit:** For shared customer profile updates, changes are merged with complete audit logging.

---

### Q397: How does thermal receipt printing work during internet drops?
**Answer:** Direct Local Raw POS Printer Driver:
* 📍 **System Navigation Path:** Local Hardware Spooler
* Thermal receipt printers connect via direct local USB or LAN serial port, bypassing cloud print queues to print receipts instantly even if internet cables are physically severed.

---

### Q398: What happens if a workstation computer crashes or loses power abruptly?
**Answer:** ACID-Compliant Database Crash Recovery:
* 📍 **System Navigation Path:** SQLite Write-Ahead Logging (WAL) Engine
* The local SQLite database uses Write-Ahead Logging (WAL). If power cuts mid-transaction, uncommitted drafts roll back safely with zero database corruption, while committed sales are preserved 100%.

---

### Q399: How are daily local database backups managed on showroom PCs?
**Answer:** Automated Encrypted Local & Cloud Backups:
* 📍 **System Navigation Path:** `Sidebar: Settings & System` &rarr; `Database Backups` (`/settings/backups`)
* The system takes an automated encrypted backup at 07:05 PM during Day-End Z-Closing, storing a copy locally on the workstation hard drive and mirroring an encrypted snapshot to Head Office cloud storage.

---

### Q400: What hardware specifications are recommended for showroom desktop PCs?
**Answer:** Standard Commercial Workstation Specs:
* 📍 **System Navigation Path:** IT Deployment Guide
* **Minimum Specs:** Intel Core i3 (8th Gen+) or AMD Ryzen 3, 8GB DDR4 RAM, 256GB NVMe SSD, Gigabit LAN, Windows 10/11 Pro 64-bit, 80mm Thermal POS Printer, USB Barcode Scanner.

---

### Q401: Can a showroom operate continuously on a mobile 4G hotspot backup?
**Answer:** Yes. Low-Bandwidth Optimization:
* 📍 **System Navigation Path:** Network Settings
* AJ EcoDrive uses high-efficiency compressed JSON payloads (typically < 15 KB per transaction), running flawlessly over a mobile phone 4G hotspot or backup Jazz/Zong data SIM.

---

### Q402: How does the system handle daylight saving time or regional clock drifts?
**Answer:** Network Time Protocol (NTP) Synchronization:
* 📍 **System Navigation Path:** Core System Architecture
* Workstations sync their internal clock with Head Office central NTP time servers upon every heartbeat, preventing clock tampering on cashier terminals.

---

### Q403: Where can IT administrators monitor nationwide workstation connectivity health?
**Answer:** The **Nationwide Workstation Heartbeat & Health Console**:
* 📍 **System Navigation Path:** `Super Admin` &rarr; `Sidebar: Settings & System` &rarr; `Network Terminal Health` (`/settings/terminals`)
* Real-time map displaying connectivity status, SQLite database size, sync latency (ms), and active software versions across all showroom terminals.

---

### Q404: How are software updates and security patches deployed to branch PCs?
**Answer:** Zero-Downtime Background Auto-Update:
* 📍 **System Navigation Path:** Application Update Engine
* New software updates download silently in the background and apply seamlessly during morning workstation boot-up without requiring manual IT technician visits to branch showrooms.

---

### Q405: What is the System Uptime & Operational Durability KPI?
**Answer:** Enterprise reliability benchmark:
* 📍 **System Navigation Path:** `Sidebar: Analytics & Reports` &rarr; `System Reliability KPIs`
* Measures overall showroom transactional availability (Target: **99.99% Operational Uptime** across all physical dealership locations).

---
[Back to Top / Navigation Index](#dealership-owners-quick-navigation--executive-index)

---

# APPENDICES

---

### APPENDIX A: Policy Summary — Operational Continuity & Synchronization
* **Core Philosophy:** Local Showroom Autonomy with Centralized Financial & Inventory Governance.
* **Offline Threshold:** Showrooms can operate offline for up to 7 consecutive calendar days before mandatory central synchronization lock.
* **Data Privacy:** Customer CNIC and financial data encrypted at rest (AES-256) and in transit (TLS 1.3).

---

### APPENDIX B: Target Production Topology Blueprint
* **Central Cloud Server:** Master PostgreSQL Database, API Gateways, FBR E-Invoicing Webhook Service, and Central Action Centre Engine.
* **Branch Workstations:** Local SQLite Engine, Offline Queue Worker, Thermal POS Receipt Service, Barcode Scanner Drivers.
* **Mobile Companion:** Progressive Web Application (PWA) / Hybrid Android APK for roaming showroom sales executives and workshop mechanics.

---

### APPENDIX C: Proposed Offline Operational Classification Matrix
* **Tier 1 (Always Available Offline):** Leads, Quotes, POS Sales, Receipts, Job Cards, PDI Checklists, Petty OPEX.
* **Tier 2 (Queued for Sync):** Customer Profile Updates, Transfer Intake Confirmations, Cycle Count Scans.
* **Tier 3 (Online Mandatory):** Action Centre Approvals > 8%, High-Value OPEX > PKR 15k, Master MSRP Updates.

---

### APPENDIX D: Branch Daily Operational Lifecycle
* **08:30 AM:** Workstation Boot & Morning Central Synchronization (Q26).
* **08:35 AM:** Cash Drawer Float Physical Count & Ledger Reconciliation (Q29).
* **08:45 AM:** Showroom Floor Stock VIN Visual Audit (Q28).
* **08:50 AM:** Overnight Freight Transfer Receiving & Intake (Q31).
* **09:00 AM:** Morning Team Briefing & Target Review (Q34).
* **09:00 AM – 07:00 PM:** Active Showroom Sales, Leads, POS Checkout & Workshop Repairs.
* **07:00 PM:** Day-End Closing Z-Report, Physical Denomination Count & Bank Drop Lockup (Q329–Q342).

---

### APPENDIX E: Failure & Recovery Scenarios Matrix (18 Critical Events)
1. **Event 1: Power Load-Shedding Mid-Sale** &rarr; Workstation runs on UPS; SQLite WAL engine prevents database corruption; transaction completes on battery.
2. **Event 2: Fiber Internet Cable Cut** &rarr; Terminal auto-switches to AMBER (OFFLINE); transactions queue in local Outbox.
3. **Event 3: Thermal Receipt Paper Jam** &rarr; POS terminal allows 1-click **"Reprint Receipt"** with duplicate watermark.
4. **Event 4: Barcode Scanner Failure** &rarr; System allows manual 17-digit VIN text entry with NADRA checksum validation.
5. **Event 5: Cash Drawer Variance at Night** &rarr; System generates Action Centre Flow 5 incident notice; past sales locked.
6. **Event 6: Customer Bounced Cheque** &rarr; Payment dishonored; invoice reverts to Unpaid; Gate Pass locked.
7. **Event 7: Stolen or Missing Showroom Bike** &rarr; Missing VIN locked in Cycle Count; FIR attached; balance sheet written off.
8. **Event 8: Damaged Bike in Inbound Transfer** &rarr; Scratched unit routed to Bay Q-3; carrier insurance claim auto-generated.
9. **Event 9: Lithium Battery Thermal Swell** &rarr; Routed immediately to Fireproof Sand Locker; Flow 4 OEM claim submitted.
10. **Event 10: Unauthorized Staff Discount Attempt** &rarr; System blocks checkout; routes to Action Centre Flow 1.
11. **Event 11: Terminated Employee Attempting Login** &rarr; JWT token blacklisted; offline credentials purged on sync.
12. **Event 12: Customer Disputes Return Deduction** &rarr; Escalated to Super Admin via Action Centre dispute drawer.
13. **Event 13: Factory Recall on Brake Calipers** &rarr; Batch VINs locked into Quarantine Recall status across all branches.
14. **Event 14: Accidental Double-Scan of VIN** &rarr; System blocks duplicate scan with alert: *"VIN already scanned in manifest"*.
15. **Event 15: Cross-Branch Selling Attempt** &rarr; Hard custody lock: *"Unit physically in Islamabad; dispatch transfer required"*.
16. **Event 16: PDI Inspection Failure** &rarr; Delivery Gate Pass locked until workshop foreman signs off defect rectification.
17. **Event 17: Showroom Air-Conditioner Breakdown (> PKR 15k)** &rarr; Routed to CFO via Flow 3 for online bank payment.
18. **Event 18: Complete Hard Drive Failure on Branch PC** &rarr; Install fresh app; restore latest Z-Report snapshot from Head Office cloud in 10 minutes.

---

### APPENDIX F: Client Approval Items & Architecture Decisions
* **Decision 1:** 8% Discretionary Discount Ceiling for Branch Managers approved.
* **Decision 2:** PKR 15,000 Petty Cash OPEX local approval limit approved.
* **Decision 3:** Mandatory 3-Way Serialized Hardware Binding (Frame + Battery + Controller) approved.
* **Decision 4:** 7-Day Quotation Validity Window approved.
* **Decision 5:** Dual-Key Day-End Cashier Z-Closing procedure approved.

---

### APPENDIX G: Target Implementation Roadmap (Phases 1 – 19)
* **Phase 1 – 6 (Completed):** Multi-Branch Core, Serialized Inventory, POS Engine, Action Centre Command, Cash Ledgers.
* **Phase 7 – 12 (Completed):** Workshop Job Cards, Lithium Battery Diagnostics, PDI Gate Passes, Inbound Receiving.
* **Phase 13 – 19 (Current Master Baseline):** Enterprise Offline Synchronization, FBR E-Invoicing, Advanced CSAT, AI Sales Forecasting.

---

### APPENDIX H: Core Production Acceptance Criteria
* **Criteria 1 (Zero Data Loss):** 100% transactional recovery across simulated power cuts and network drops.
* **Criteria 2 (Zero Inventory Leakage):** No vehicle can exit showroom gates without verified QR Gate Pass.
* **Criteria 3 (Zero Revenue Leakage):** No price discount > 8% or expense > PKR 15,000 can execute without Action Centre sign-off.
* **Criteria 4 (Forensic Auditability):** Every business event permanently recorded with immutable user ID, role, and timestamp.

---
[Back to Top / Navigation Index](#dealership-owners-quick-navigation--executive-index)