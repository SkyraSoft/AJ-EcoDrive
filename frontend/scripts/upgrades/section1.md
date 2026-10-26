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
