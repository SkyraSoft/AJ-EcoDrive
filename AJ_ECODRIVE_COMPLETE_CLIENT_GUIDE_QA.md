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
3. [PART 3: Morning Showroom Opening & System Daily Start (Q25 – Q36)](#part-3-morning-showroom-opening--system-daily-start-q25--q36)

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
| **Point of Sale Modal Guide** | Step-by-step Point of Sale (POS) execution, dynamic price engine, and instant VIN reservation. | [Jump to Q132 (CreateSaleModal)](#q132-modal-guide--what-is-the-createsalemodal-createsalevue-and-what-are-its-exact-fields) |
| **Formal Quotations Guide** | Preparing binding 7-day customer price quotations, 8% discount ceiling, and 1-click order conversion. | [Jump to Q116 (CreateQuotationModal)](#q116-modal-guide--what-is-the-createquotationmodal-createquotationvue-and-what-are-its-exact-fields) |
| **Expense & Petty Cash Guide** | Showroom expense entry, receipt attachments, and dynamic PKR 15,000 petty cash vs. CFO clearance banner. | [Jump to Q317 (CreateExpenseModal)](#q317-modal-guide--what-is-the-createexpensemodal-createexpensevue-and-what-are-its-exact-fields) |
| **Inter-Branch Transfer Guide**| Moving vehicles between cities with In-Transit custody, driver contact info, and mandatory physical VIN inspection. | [Jump to Q262 (CreateTransferModal)](#q262-modal-guide--what-is-the-createtransfermodal-createtransfervue-and-what-are-its-exact-fields) |
| **Inbound Receiving Guide** | Verifying inbound carrier shipments, barcode scanning, transit discrepancy reporting, and stock intake. | [Jump to Q275 (ReceiveTransferModal)](#q275-modal-guide--what-is-the-receivetransfermodal-receivetransfervue-and-what-are-its-exact-fields) |
| **Customer Payment Guide** | Recording cash collections, IBFT bank deposit reconciliation, and linking every rupee to an official invoice. | [Jump to Q147 (CreatePaymentModal)](#q147-modal-guide--what-is-the-createpaymentmodal-createpaymentvue-and-what-are-its-exact-fields) |
| **Customer CNIC Registration** | Why 13-digit Pakistani CNIC numbers and verified mobile phones are mandatory for electric bike registration. | [Jump to Q101 (CreateCustomerModal)](#q101-modal-guide--what-is-the-createcustomermodal-createcustomervue-and-what-are-its-exact-fields) |
| **Walk-In Leads & Pipeline** | Capturing showroom visitors, assigning sales reps, scheduling test rides, and logging call follow-ups. | [Jump to Q90 (CreateLeadModal)](#q90-modal-guide--what-is-the-createleadmodal-createleadvue-and-what-are-its-exact-fields) |
| **Workshop Intake & Repairs**  | Opening service cases, recording odometer readings, scanning OBD trouble codes, and mechanic job cards. | [Jump to Q177 (CreateCaseModal)](#q177-modal-guide--what-is-the-createcasemodal-createcasevue-and-what-are-its-exact-fields) & [Q191 (CreateRepairJobModal)](#q191-modal-guide--what-is-the-createrepairjobmodal-createrepairjobvue-and-what-are-its-exact-fields) |
| **Delivery Handover & Gate Pass**| The mandatory 6-point Pre-Delivery Inspection (PDI) checklist and printing the official security gate pass. | [Jump to Q162 (CreateDeliveryHandoverModal)](#q162-modal-guide--what-is-the-createdeliveryhandovermodal-createdeliveryhandovervue-and-what-are-its-exact-fields) |
| **Vehicle Returns & Refunds** | Handling order cancellations or returns, 10-point return inspection, and calculating net refunds. | [Jump to Q223 (CreateReturnModal)](#q223-modal-guide--what-is-the-createreturnmodal-createreturnvue-and-what-are-its-exact-fields) |
| **Stock Requisitions** | Requesting inventory replenishment from Central Warehouse when showroom stock hits safety threshold. | [Jump to Q250 (CreateStockRequestModal)](#q250-modal-guide--what-is-the-createstockrequestmodal-createstockrequestvue-and-what-are-its-exact-fields) |
| **Cycle Counts & Audits** | Conducting blind physical stock-takes, scanning floor chassis barcodes, and auto-locking missing VINs. | [Jump to Q290 (CreateCycleCountModal)](#q290-modal-guide--what-is-the-createcyclecountmodal-createcyclecountvue-and-what-are-its-exact-fields) & [Q293 (CreateAdjustmentRequestModal)](#q293-modal-guide--what-is-the-createadjustmentrequestmodal-createadjustmentrequestvue-and-what-are-its-exact-fields) |
| **Defective Stock Quarantine** | Isolating factory-damaged bikes, transit scratches, or battery hazards in physical Bay Q-3. | [Jump to Q304 (CreateQuarantineRecordModal)](#q304-modal-guide--what-is-the-createquarantinerecordmodal-createquarantinerecordvue-and-what-are-its-exact-fields) |
| **Sea Container Imports** | Purchasing CBU/CKD containers from China, tracking Bills of Lading, and batch VIN serialization. | [Jump to Q345 (CreatePurchaseOrderModal)](#q345-modal-guide--what-is-the-createpurchaseordermodal-createpurchaseordervue-and-what-are-its-exact-fields) & [Q347 (ReceivePurchaseModal)](#q347-modal-guide--what-is-the-receivepurchasemodal-receivepurchasevue-and-what-are-its-exact-fields) |
| **Showroom Branches & Roles** | Opening new branch showrooms, provisioning staff accounts, security permissions, and internal chat. | [Jump to Q360 (CreateBranchModal)](#q360-modal-guide--what-is-the-createbranchmodal-createbranchvue-and-what-are-its-exact-fields) & [Q362 (CreateUserModal)](#q362-modal-guide--what-is-the-createusermodal-createuservue-and-what-are-its-exact-fields) |


---
[Back to Top / Navigation Index](#dealership-owners-quick-navigation--executive-index)

---

# SECTION I: FOUNDATIONS & GETTING STARTED

---

# PART 1: Understanding AJ EcoDrive & The EV Dealership Model (Q1 – Q12)

### Q1: In simple words, what is AJ EcoDrive?
**Answer:** AJ EcoDrive is an all-in-one dealership management operating system engineered specifically for electric vehicle (EV) businesses. It orchestrates the complete operational lifecycle: importing assembled and CKD electric bikes from overseas factories, managing multi-city showroom floor inventory, tracking every single bike down to its unique chassis number (VIN), negotiating sales quotes, collecting cash and bank payments, issuing legal delivery gate passes, managing workshop repair job cards, and validating lithium-ion battery warranty claims.

---

### Q2: Why can't an EV dealership just use a generic accounting tool like QuickBooks or Excel?
**Answer:** Because generic accounting software treats products as uniform bags of goods. An electric vehicle has three unique, serialized high-voltage components that define its legal identity, road safety, and financial value:
1. **VIN / Chassis Number:** Stamped onto the steel frame; legally registered with provincial excise and taxation authorities.
2. **Lithium Battery Pack Serial Number:** Represents 40% to 50% of the entire vehicle's monetary value.
3. **Electronic Controller / BMS Serial Number:** The brain governing voltage, current cutoff, and motor output.

In Excel or QuickBooks, an untrained salesperson can accidentally sell the same chassis twice, misplace high-voltage battery packs during inter-branch transfers, or accept fraudulent warranty returns. AJ EcoDrive enforces hardware serialization at every stage, making accidental duplicates or component theft mathematically impossible.

---

### Q3: Who are the active users of AJ EcoDrive today?
**Answer:** In the current deployment, the system operates with **two active user login categories**:
1. **Super Admin (Head Office Management):** Executives, directors, and central finance officers who oversee the entire nationwide network. Super Admins manage international sea-container procurement, approve corporate pricing exceptions, set master catalog list prices, oversee inter-branch transfers, and review company-wide P&L reports.
2. **Branch Managers (Showroom & Workshop Operations):** Dedicated operators stationed at each individual dealership showroom (Peshawar, Islamabad, Lahore, Rawalpindi). Branch Managers run daily showroom sales, register customer CNICs, issue price quotes, confirm sales orders, collect payments, print delivery gate passes, manage spare parts inventory, and oversee workshop repair job cards.

*(In future production phases, individual employee role profiles—such as Sales Executives, Cashiers, Workshop Technicians, and Inventory Clerks—will be provisioned with granular permissions centrally managed by Head Office).*

---

### Q4: What does "Multi-Branch Architecture" mean for a dealership owner?
**Answer:** It means all dealership locations run on a single synchronized nervous system. The owner can sit in their Head Office office in Islamabad and view live, second-by-second operations across Peshawar, Lahore, and Rawalpindi: how many bikes were sold today, how much cash was deposited into local bank accounts, which branch is running low on stock, and which workshop has open warranty claims.

---

### Q5: Can staff in Peshawar sell a bike that is physically located in Islamabad?
**Answer:** **No, absolutely not.** AJ EcoDrive enforces strict branch-level custody isolation. A salesperson in Peshawar can only reserve, invoice, and deliver a vehicle that has been officially received and scanned into Peshawar's physical showroom inventory. If an Islamabad bike is promised to a Peshawar customer, an official Inter-Branch Stock Transfer must be executed and physically confirmed by the receiving branch before it can be sold.

---

### Q6: What is a "Serialized Unit" in the context of electric bikes?
**Answer:** A serialized unit is an individual, physical vehicle tracked by its unique chassis number (VIN). While the product catalogue lists the general model (e.g., *"BRG E-125 Commuter Scooter"*), the inventory ledger tracks the exact physical machine (e.g., *"VIN-PK-BRG-2026-00812"* in Metallic Blue, equipped with 72V 32Ah Lithium Battery #BAT-99420 and Controller #CTL-77211).

---

### Q7: What lifecycle stages does an electric bike move through in the system?
**Answer:** Every vehicle progresses through 7 transparent lifecycle states:
1. **Available:** Unsold, inspected, and sitting on the showroom floor ready for purchase.
2. **Reserved:** Earmarked for a specific customer who has placed a confirmed sales order.
3. **Sold / Invoicing Complete:** Customer has fully paid; vehicle is assigned to the delivery bay for Pre-Delivery Inspection (PDI).
4. **Delivered / Customer Owned:** Customer has signed the handover sheet and driven the bike out through the showroom gates with an official Gate Pass.
5. **In Service / Maintenance:** Brought back to the dealership workshop for routine service or accident repairs.
6. **In-Transit:** Loaded on a logistics carrier truck traveling between showroom branches.
7. **Quarantine / QC Hold:** Isolated in a secure holding bay due to transit scratches, factory defects, or battery diagnostic warnings.

---

### Q8: What currency and number formats are used across the system?
**Answer:** The entire platform operates in **Pakistani Rupees (PKR)**. All figures are formatted with standard thousands separators (e.g., `PKR 245,000`), ensuring clean financial reading for business owners, accountants, and bank auditors.

---

### Q9: Does the system track spare parts, tyres, and workshop consumables?
**Answer:** Yes. The inventory engine manages complete serialized vehicles as well as non-serialized spare parts (e.g., tubeless tyres, brake pads, throttle assemblies, digital LCD instrument meters, headlights, and wiring harnesses). Spare parts are directly linked to workshop repair job cards and deduct automatically from local stock when installed on a customer's bike.

---

### Q10: How does AJ EcoDrive handle manufacturer warranties?
**Answer:** Every vehicle sold automatically activates an official OEM Warranty policy (e.g., 2-Year or 30,000 km Warranty on the Lithium Battery, Electric Motor, and Smart BMS Controller). The warranty clock starts on the exact calendar day the customer signs the Delivery Handover certificate. The system automatically tracks remaining months and mileage.

---

### Q11: What happens if a customer visits the workshop with a burned controller under warranty?
**Answer:** The technician enters the chassis number into the Workshop module. The system confirms the warranty is valid and generates a Repair Job Card:
* **Controller Replacement Cost:** PKR 8,500
* **Manufacturer Warranty Coverage:** PKR 8,500 (100% covered)
* **Customer Payable:** **PKR 0**
The customer walks out with a brand-new original controller without paying, and the system logs an official warranty reimbursement claim against the OEM factory.

---

### Q12: Can showroom staff secretly sell a bike without registering it in the system?
**Answer:** No. Showroom security protocols require an official **Delivery Gate Pass** with an automated QR verification code and security watermark. The security guard stationed at the dealership gate is strictly instructed never to let a vehicle exit without verifying the printed Gate Pass, which can only be generated after an invoice is fully settled in AJ EcoDrive.

---
[Back to Top / Navigation Index](#dealership-owners-quick-navigation--executive-index)

---

# PART 2: Workstation Platforms & User Login Categories (Q13 – Q24)

### Q13: What hardware platforms does AJ EcoDrive support?
**Answer:** AJ EcoDrive is engineered for cross-platform deployment across three distinct environments:
1. **Windows Desktop Workstations:** Installed on dedicated Dell/HP desktop computers at showroom sales counters, cashier booths, and workshop service reception desks.
2. **Android Tablets & Handheld Mobility:** Mobile devices used by sales executives walking the showroom floor with customers, or mechanics inspecting battery packs directly inside the workshop service bay.
3. **Executive Web Companion:** An auxiliary browser portal accessible from laptops or home workstations for directors traveling outside the dealership network.

---

### Q14: Does the Mobile / Tablet App have fewer features than the Desktop version?
**Answer:** **No. The Mobile / Tablet App offers 100% full feature parity.** Every single feature available on the desktop workstation—including Point of Sale order entry, quotation generation, CNIC customer registration, workshop job cards, inter-branch transfers, expense filing, and Action Centre approvals—is available and fully responsive on handheld mobile tablets.

---

### Q15: Why are mobile tablets particularly valuable on the showroom floor?
**Answer:** Handheld tablets eliminate the outdated barrier of having a salesperson sit behind a bulky desk. A salesperson can walk side-by-side with a customer around an electric scooter, rotate through color options on screen, enter the customer's CNIC and contact details on the spot, configure financing options, and print a formal quotation wirelessly to the counter receipt printer.

---

### Q16: How do mechanics benefit from mobile tablet access in the workshop?
**Answer:** Workshop mechanics do not have clean hands or desktop desks in grease-filled service bays. With a ruggedized Android tablet, a technician can take photos of damaged parts, scan battery QR codes, enter OBD diagnostic trouble codes, and tap checklist items directly while standing next to the disassembled bike.

---

### Q17: What are the two active user login categories in the system today?
**Answer:** The system currently provides two specialized operational accounts:
1. **Super Admin Account:** Unrestricted nationwide oversight. Can view, edit, configure, and approve records across all dealership branches.
2. **Branch Manager Account:** Local operational command. Dedicated to a specific branch showroom (Peshawar, Islamabad, Lahore, or Rawalpindi), restricting view and action permissions to that branch's inventory, staff, cash drawer, and customers.

---

### Q18: What is the roadmap for individual staff logins in the future?
**Answer:** While the system is optimized today for Super Admin and Branch Manager roles, the underlying architecture contains complete Role-Based Access Control (RBAC). In future enterprise updates, Head Office can provision individual accounts for Sales Executives, Cashiers, Workshop Technicians, and Storekeepers with tailored permissions.

---

### Q19: How do users switch between Dark and Light display modes?
**Answer:** Users can click the user profile initials in the top-right header and select **Preferences** (or navigate to `/preferences`). The theme switcher instantly toggles between a clean daytime high-contrast Light Mode and a sleek, glare-reducing Dark Mode. The user's selection is saved locally and persists across computer restarts.

---

### Q20: What happens if a salesperson leaves their workstation unattended?
**Answer:** The system features an automatic idle session security lock. If no keyboard or mouse activity is detected for 60 minutes (configurable by Super Admin), the application locks the screen, hiding customer CNICs, cash drawer totals, and profit margins until the authorized user re-enters their password.

---

### Q21: What happens if an employee forgets their login password?
**Answer:** The login screen provides a secure **Forgot Password** recovery workflow. The employee enters their registered corporate email address, receives an automated verification link or one-time token, and securely resets their password adhering to corporate complexity rules (minimum 8 characters with numbers and symbols).

---

### Q22: Can a terminated employee still log into the system?
**Answer:** No. The moment Super Admin toggles an employee's status to **Inactive**, their authentication token is revoked immediately on the central server. On offline-capable local workstations, deactivation tokens are broadcast during the next synchronization heartbeat, locking any cached credentials.

---

### Q23: If an employee leaves the company, what happens to their historical sales and invoices?
**Answer:** All historical records remain 100% intact. Past invoices, quotations, delivery gate passes, and audit trails will permanently display the employee's name and timestamp, ensuring complete forensic traceability for tax and legal audits.

---

### Q24: How does a user safely log out at the end of their shift?
**Answer:** By clicking their user profile avatar in the upper right header and selecting **Sign Out**. This immediately purges the active session token, clears temporary memory buffers, and returns the application to the secure login prompt.

---
[Back to Top / Navigation Index](#dealership-owners-quick-navigation--executive-index)

---

# PART 3: Morning Showroom Opening & System Daily Start (Q25 – Q36)

### Q25: What is the very first screen a Branch Manager sees upon logging in each morning?
**Answer:** The **Showroom Operations Dashboard** (`/dashboard`). This command dashboard displays real-time operational KPI counters:
* **Showroom Floor Bikes:** Number of physical vehicles currently available for immediate sale.
* **Today's Revenue:** Live PKR sales volume collected today.
* **Pending Deliveries:** Customers scheduled to collect their vehicles today.
* **Active Workshop Jobs:** Bikes currently undergoing maintenance or warranty repairs in the service bay.
* **Action Centre Alerts:** Urgent tasks awaiting managerial attention.

---

### Q26: What is the Morning Central Synchronization Routine?
**Answer:** At 08:30 AM when the showroom opens, launching the desktop workstation triggers the automated **Morning Central Synchronization Routine**:
1. Connects to the Head Office central database server.
2. Downloads overnight catalog price changes or promotional discount guidelines.
3. Downloads inbound transfer manifests (trucks dispatched from Central Warehouse or other cities).
4. Synchronizes customer service cases and online web inquiries.
5. Verifies the local business date and marks the branch connection status as **GREEN (ONLINE)**.

---

### Q27: What is the Quick Actions bar on the dashboard, and how does it speed up operations?
**Answer:** The Quick Actions bar is a prominent button strip located at the top of the dashboard. It allows showroom staff to launch essential tasks with a single click without digging through multi-level menus:
* **+ New Walk-In Lead** (Opens `CreateLeadModal`)
* **+ New Quotation** (Opens `CreateQuotationModal`)
* **+ Point of Sale (POS)** (Opens `CreateSaleModal`)
* **+ Record Payment** (Opens `CreatePaymentModal`)
* **+ Service Intake** (Opens `CreateCaseModal`)
* **+ File Expense** (Opens `CreateExpenseModal`)

---

### Q28: How does the Branch Manager verify physical floor inventory against the system each morning?
**Answer:** The manager opens **Inventory -> Floor Stock**. The screen lists every physical vehicle assigned to the showroom with its Model, Color, and unique VIN. The manager or floor supervisor conducts a quick walk-around visual verification to confirm every physical scooter on the showroom tiles matches the active digital ledger.

---

### Q29: What is the morning procedure for the Showroom Cash Drawer Float?
**Answer:** The Branch Manager opens the physical showroom cash drawer and counts the opening petty cash float (typically PKR 10,000 to PKR 25,000 for customer change, tea, and daily utility expenses). The manager verifies that the system opening cash balance matches the physical cash notes in the safe before customer transactions begin.

---

### Q30: How does the system handle internet drops or power load-shedding in the morning?
**Answer:** In Pakistan, power cuts and internet outages are routine. AJ EcoDrive is architected with **Local Offline Durability**. If the internet cable is cut or the local Wi-Fi router loses power, the system seamlessly transitions to **AMBER (OFFLINE)** mode. Staff can continue creating customer leads, generating quotations, making sales, and printing receipts using the local SQLite database. All transactions queue in an Outbox and sync automatically once connectivity restores.

---

### Q31: What should the manager do if an expected incoming delivery truck arrived overnight?
**Answer:** If an inter-branch transfer truck from Islamabad arrived overnight, the manager navigates to **Inventory -> Transfers -> Inbound Transfers**, selects the transfer manifest ID, physically scans each bike's chassis number as it is unloaded from the truck, checks for transit damage, and clicks **Confirm Receipt**. The vehicles immediately move into Peshawar's active showroom inventory.

---

### Q32: How does the system alert the manager to scheduled customer delivery appointments?
**Answer:** The dashboard highlights a dedicated widget: **"Today's Scheduled Deliveries"**. It lists customer names, models, and scheduled handover times. This ensures the workshop team prepares the vehicle early—cleaning the bodywork, charging the lithium battery to 100% State of Charge (SOC), and completing the Pre-Delivery Inspection (PDI).

---

### Q33: How does the manager check for open service complaints from the previous day?
**Answer:** By clicking **Workshop -> Active Cases**. The screen filters all repair orders currently in progress, indicating which technician is working on each bike, whether replacement parts have arrived, and whether any high-voltage battery warranty claims are awaiting Head Office approval.

---

### Q34: What is the morning team briefing routine supported by AJ EcoDrive?
**Answer:** Showroom managers use the Dashboard's **Monthly Target vs Actual Sales Progress Bar** during the 09:00 AM morning staff huddle. The team reviews yesterday's closed deals, open hot leads requiring phone follow-ups, and the remaining unit sales required to hit monthly sales commission targets.

---

### Q35: What happens if the system shows a catalog price update from Head Office?
**Answer:** When Head Office modifies a model's MSRP (e.g., due to foreign currency exchange fluctuations or factory price adjustments), a notification banner appears: *"Catalog Updated: 2 Models Have New Base Prices"*. The new prices apply immediately to all newly created quotations and sales orders, preventing staff from selling bikes at outdated, unprofitable rates.

---

### Q36: How does the manager verify that receipt printers and barcode scanners are working?
**Answer:** The manager navigates to **Settings -> Device Test**, clicks **Print Test Slip**, and confirms that the thermal receipt printer outputs a clean test voucher with the dealership logo, tax registration number, and current date.


---
[Back to Top / Navigation Index](#dealership-owners-quick-navigation--executive-index)

---

# SECTION II: CENTRAL COMMAND & COLLABORATION (THE ACTION CENTRE)

---

# PART 4: The Dealership Action Centre — The Command Bridge (Q37 – Q52)

### Q37: What is the Action Centre screen in AJ EcoDrive, and how do dealership staff navigate to it?
**Answer:** The **Action Centre** is located at `/dashboard/action-centre` and is directly accessible via the primary navigation sidebar under **Dashboard -> Action Centre** (or by clicking the prominent Action Centre banner on the Branch or Super Admin Dashboard).
* On the **Windows Desktop Application**: It serves as the primary operational command desk where all urgent requests requiring human managerial decision are displayed.
* On the **Mobile & Tablet App**: It is presented in a high-density, touch-optimized card layout, enabling roaming showroom managers and field executives to review, counter, and approve critical requests from anywhere.
* On the **Optional Web Companion**: It provides an executive overview for directors traveling outside the dealership network.

---

### Q38: What makes the Action Centre fundamentally different from standard Notifications?
**Answer:** While **Notifications** are passive, informational alerts (such as *"Customer invoice #INV-102 was printed"* or *"Payment received"*), an **Action Centre Item** represents a **high-stakes operational task that requires formal human review, validation, and a binding business decision (Approve, Counter, Authorize, or Reject)** before it can be closed.
1. **Auditable Decision Gate:** No action item disappears by simply clicking "mark as read". It requires a documented operational treatment (e.g., entering an authorized discount cap, releasing an OEM battery part, or approving an expense voucher).
2. **Bi-Directional Workflow:** 
   - **Branch Manager &rarr; Super Admin:** Escalating commercial discounts, requesting emergency vehicle pulls from other cities, requesting expense reimbursements above PKR 15,000, and reporting warranty battery failures.
   - **Super Admin &rarr; Branch Manager:** Issuing mandatory safety recall directives, assigning nationwide physical cycle count audits, or mandating showroom stock redistribution.
3. **Automated Enterprise Accounting & Inventory Impact:** When an action is approved in the Action Centre, it automatically updates the underlying business records in the system (e.g., sales orders, quotation discount flags, transfer records, expense ledgers, or repair job cards) and writes an immutable audit trail.

---

### Q39: What are the 7 Work Queue Tabs in the Action Centre, and what does each tab filter?
**Answer:** The Action Centre organizes incoming tasks into 7 dedicated filter tabs:
1. **All Tasks Queue:** Displays every active and historically resolved action item across all categories.
2. **Pending Review (Action Required):** Shows only active tasks awaiting a managerial decision (filtered for items in `Pending` or `Under Review` status).
3. **Commercial & Pricing:** Filters Flow 1 tasks—discount exception waivers, corporate fleet margins, and payment term concessions.
4. **Stock Reallocation:** Filters Flow 2 tasks—urgent inter-branch vehicle transfers, emergency color pulls, and transit permits.
5. **High-Value OPEX:** Filters Flow 3 tasks—showroom operating expenditures and facility repairs exceeding the local branch limit (PKR 15,000).
6. **Technical & Warranty:** Filters Flow 4 tasks—lithium battery failures, BMS fault escalations, motor replacements, and OEM warranty authorizations.
7. **Inventory Governance:** Filters Flow 5 tasks—cycle count audit variances, container transit damage, and quality quarantine releases.

---

### Q40: What do the 5 Summary KPI Cards at the top of the Action Centre indicate?
**Answer:** At the top of the Action Centre screen, 5 dynamic metric cards provide real-time operational status:
* **Active Requests:** Total count of open, unresolved items requiring executive attention across the network.
* **Commercial Discounts:** Total monetary value (PKR) of requested price waivers currently awaiting margin review.
* **Emergency OPEX:** Total monetary amount (PKR) of showroom operating expenditure claims awaiting CFO clearance.
* **Critical Stock Reallocations:** Number of urgent vehicle transfers requested to fulfill locked customer deposits.
* **Warranty Claims:** Number of high-voltage battery and controller replacements awaiting technical authorization.

---

### Q41: What are the 4 Visual SLA Urgency Badges, and what do they mean?
**Answer:** Every item in the Action Centre displays a color-coded Service Level Agreement (SLA) countdown badge based on its business urgency:
1. **< 2h (Critical - Red Pulse):** Emergency customer walk-in discount or high-priority vehicle handover waiting on the showroom floor.
2. **< 6h (High - Amber):** Urgent stock reallocation or workshop repair awaiting customer release.
3. **< 24h (Normal - Blue):** Routine vendor expense reimbursement or next-day delivery reservation.
4. **Overdue (Deep Crimson):** Request has exceeded company SLA response thresholds and has been escalated to executive directors.

---

### Q42: Can a Branch Manager approve their own requests in the Action Centre?
**Answer:** **No.** Strict segregation of duties prevents a Branch Manager from approving their own discount waivers, expense claims, or inventory adjustments. When a Branch Manager submits a request, it is marked as `Pending Head Office Review` and can only be treated by an authorized Super Admin or Central Department Head.

---

### Q43: How does the Action Centre prevent bottlenecks when Head Office directors are busy?
**Answer:** The Action Centre includes automated SLA escalation rules. If a high-priority request (such as a walk-in customer discount waiver) is not treated within 90 minutes, the system sends an SMS and mobile push alert to the National Sales Director and unlocks an emergency temporary discretionary override.

---

### Q44: Does the Action Centre support filtering by specific branch showroom?
**Answer:** Yes. Super Admins can filter the queue by All Branches, Peshawar, Islamabad, Lahore, or Rawalpindi to evaluate local branch performance and identify showrooms experiencing operational delays.

---

### Q45: What information is displayed on each Action Centre task card?
**Answer:** Each task card provides comprehensive summary information:
* Unique Reference ID (e.g., `ACT-PRC-1082` or `ACT-STK-2041`)
* Flow Category Badge (Commercial, Stock, OPEX, Warranty, Governance)
* Originating Branch & Requesting Officer Name
* Financial Value (PKR) or Serialized VIN Reference
* Elapsed Time & SLA Urgency Badge
* Brief Justification Excerpt
* Current Status (`Pending`, `Under Review`, `Approved`, `Rejected`)

---

### Q46: Can staff communicate directly inside an Action Centre item?
**Answer:** Yes. Every task card includes an interactive **Discussion & Activity Log**. The Super Admin can post questions (e.g., *"Did the customer provide a competitive written quotation from RoadPrince EV?"*) and the Branch Manager receives an instant alert to reply and attach supplementary photos or documents.

---

### Q47: What happens when an action item is officially Approved?
**Answer:** The system automatically executes the underlying business action without requiring manual re-entry:
* **Pricing Waivers:** The linked Quotation or Sales Order immediately updates with the approved discount percentage and is marked ready for invoicing.
* **Stock Transfers:** An official Inter-Branch Dispatch Gate Pass is generated, reserving the specific VINs in origin inventory.
* **Expense Claims:** An accounting payment voucher is posted to the branch petty cash ledger.
* **Warranty Claims:** An authorized spare parts issue slip is dispatched to the workshop store.

---

### Q48: What happens when an action item is Rejected?
**Answer:** The system requires the reviewer to input a mandatory **Rejection Justification Note**. The requesting branch receives an immediate alert detailing why the request was denied, and the linked business transaction reverts to standard catalog pricing or original branch allocations.

---

### Q49: How does the Action Centre maintain legal and tax audit compliance?
**Answer:** Every interaction—creation, view, status change, counter-offer, approval, and rejection—is recorded in an **Immutable Audit Trail**. The log captures the user ID, full name, role, IP address, exact timestamp, and notes, providing foolproof documentation for external financial and tax audits.

---

### Q50: Can a Super Admin delegate an action item to another department?
**Answer:** Yes. The Action Centre drawer features a **Delegate** action, allowing a Super Admin to assign a technical battery claim directly to the Chief Warranty Engineer, or an inter-city truck request to the National Logistics Manager.

---

### Q51: How does the Action Centre appear on mobile tablets?
**Answer:** On mobile tablets, the 7 tabs collapse into a sleek horizontal swipe bar, and task cards expand into full-width cards with large, finger-friendly touch buttons (`Approve`, `Review`, `Decline`), enabling executives to run dealership approvals while walking the showroom floor.

---

### Q52: What happens if an action item was submitted while the branch was offline?
**Answer:** When a branch creates an Action Centre item without internet access, it is queued locally in the workstation's Outbox. The moment connectivity is restored, the item is securely pushed to the central server, timestamped with both its local creation time and server receipt time.

---
[Back to Top / Navigation Index](#dealership-owners-quick-navigation--executive-index)

---

# PART 5: The 5 Standard Enterprise Action Flows (Q53 – Q68)

### Q53: What are the 5 Standard Enterprise Action Flows in AJ EcoDrive?
**Answer:** To eliminate operational ambiguity and standardize procedures across all showrooms, AJ EcoDrive structures all managerial escalations into **5 Universal Enterprise Action Flows**:
1. **Flow 1: Commercial & Pricing Exception** *(Discount Waivers & Margin Governance)*
2. **Flow 2: Inter-Branch Stock Reallocation & Urgent Dispatch** *(Fleet Movement & Vehicle Transfers)*
3. **Flow 3: Emergency Operational Expenditure & Branch Reimbursement** *(CapEx, Facilities & OpEx)*
4. **Flow 4: Critical Warranty Claim & High-Voltage Technical Escalation** *(Battery/Motor/Part Authorization)*
5. **Flow 5: Inventory Governance, Discrepancy & Quarantine Release Sign-off** *(Audit & Transit Damage)*

---

### Q54: Flow 1 — What is the business purpose of the "Commercial & Pricing Exception" flow?
**Answer:** Showroom Branch Managers have a pre-approved discretionary discount limit (up to 8% or PKR 25,000). When a customer or corporate client demands a larger price reduction, the Branch Manager cannot unilaterally reduce the price. They must submit a Commercial Pricing Exception in the Action Centre to protect the company's gross profit margins.

---

### Q55: Flow 1 — What are the smallest and largest operational scenarios?
**Answer:**
* **Smallest Scenario:** A walk-in retail customer bargaining for a 5% discount on an entry-level scooter plus a free helmet and protective jacket waiver (PKR 12,000 total waiver) during an Eid promotional weekend.
* **Largest Scenario:** An enterprise courier company negotiating a 14% fleet discount waiver on 25 commercial cargo trikes (a PKR 1.4 million discount on a PKR 12.25 million contract).

---

### Q56: Flow 1 — What dedicated fields and calculators are embedded in this flow?
**Answer:**
* Customer / Organization Name & Contact Phone
* Vehicle Model / Category & Standard Catalogue Price (PKR)
* Quotation / Sales Order Reference Number (`QT-XXXX` / `SO-XXXX`)
* Requested Discount Percentage (%) & Live Calculated Discount Value (PKR)
* **Live Projected Gross Margin Calculator:** Dynamically shows how the discount impacts dealership margin (e.g., dropping from standard 24.5% to 14.2%) with color-coded safety indicators.
* Competitor Intelligence & Business Justification (e.g., matching competitor written quote).

---

### Q57: Flow 1 — How does Head Office treat and resolve this request?
**Answer:**
* **Approve Full Discount:** Approves the requested waiver; system marks quotation as approved and unlocks discounted invoicing at the branch.
* **Counter-Offer / Cap Discount:** Super Admin sets a binding counter-cap (e.g., *"Capped at 9.5% maximum"*). The quotation updates automatically.
* **Reject Waiver:** Reverts deal to standard catalogue price list with mandatory explanation notes.

---

### Q58: Flow 2 — What is the business purpose of the "Inter-Branch Stock Reallocation" flow?
**Answer:** Dealerships cannot afford to lose an eager customer sale simply because a specific color or model variant is temporarily out of stock in their local showroom. This flow coordinates the rapid pull and dispatch of vehicles from another showroom branch or central warehouse.

---

### Q59: Flow 2 — What are the smallest and largest operational scenarios?
**Answer:**
* **Smallest Scenario:** Pulling 1 specific Gloss Emerald Green BRG E-125 electric scooter from the Lahore central hub to Islamabad for a customer who placed a full cash deposit and is traveling abroad in 48 hours.
* **Largest Scenario:** Emergency reallocation of 10 electric commuter bikes from Rawalpindi to Peshawar to fulfill an unexpected corporate employee lease contract.

---

### Q60: Flow 2 — What dedicated fields and carrier tracking are included?
**Answer:**
* Origin Source Branch (e.g., Lahore Hub) & Destination Showroom (e.g., Islamabad)
* Target Model SKU, Color Variant, and Required Units
* Specific Chassis VINs (if known) or Model Allocation Pool
* Linked Sales Order / Deposit Receipt Reference (`SO-XXXX`)
* Required Showroom Floor Arrival Date & SLA Urgency Badge
* Carrier Logistics Company, Driver Name, Driver CNIC, and Carrier Truck Registration Number.

---

### Q61: Flow 3 — What is the business purpose of the "Emergency Operational Expenditure (OPEX)" flow?
**Answer:** Showrooms require daily operational funds for utility bills, fuel, and facility maintenance. To prevent embezzlement, the system enforces a strict monetary limit:
* **Expenses Below PKR 15,000:** Branch Manager can approve locally from the showroom petty cash float, provided an official vendor receipt is uploaded.
* **Expenses Above PKR 15,000:** The system blocks immediate payout and automatically routes the claim through Flow 3 to the Central Chief Financial Officer (CFO) for prior clearance.

---

### Q62: Flow 3 — What are the smallest and largest operational scenarios?
**Answer:**
* **Smallest Scenario:** Emergency repair of the showroom back-up generator inverter after a sudden electrical surge during peak business hours (PKR 18,500).
* **Largest Scenario:** Emergency showroom monsoon roof waterproofing, structural ceiling repair, and electrical main panel rewiring (PKR 350,000).

---

### Q63: Flow 3 — What dedicated fields and financial controls are embedded?
**Answer:**
* Expense Category (Showroom Maintenance, Backup Generator Fuel, IT Hardware, Promotional Events)
* Vendor / Contractor Business Name & Tax NTN
* Total Claim Amount (PKR) & Local Petty Cash Balance
* Vendor Quotation / Bill Image Upload (PNG/PDF)
* Emergency Justification & Impact if Delayed (e.g., *"Showroom in darkness without generator"*).

---

### Q64: Flow 4 — What is the business purpose of the "Critical Warranty & High-Voltage Escalation" flow?
**Answer:** The lithium battery pack and motor controller represent up to 50% of an electric vehicle's total cost. To prevent fraudulent battery swapping or unauthorized warranty claims, any claim involving a high-voltage component must be escalated to Head Office technical specialists through Flow 4.

---

### Q65: Flow 4 — What are the smallest and largest operational scenarios?
**Answer:**
* **Smallest Scenario:** Replacement of a defective digital LCD instrument cluster displaying corrupted speedometer readings on a 3-month-old scooter (PKR 7,500 part value).
* **Largest Scenario:** Complete catastrophic failure of a 72V 45Ah ternary lithium battery pack with BMS thermal cutoff warnings (PKR 185,000 replacement value).

---

### Q66: Flow 4 — What diagnostic fields and serial numbers are captured?
**Answer:**
* Customer Name, Mobile Phone, and Vehicle Chassis VIN
* Battery Pack Serial Number & BMS Firmware Version
* Odometer Reading (km) & Vehicle Delivery Date (Warranty Age)
* On-Board Diagnostics (OBD) Trouble Codes (e.g., `DTC-BMS-04: Over-Voltage Cutoff`)
* Measured State of Health (SOH %) and Maximum Cell Voltage Delta (mV)
* Workshop Mechanic Diagnostic Notes and High-Resolution Multimeter Photos.

---

### Q67: Flow 5 — What is the business purpose of the "Inventory Governance & Quarantine Release" flow?
**Answer:** This flow manages physical discrepancies, stock count variances, and defective stock isolation. It ensures that no damaged vehicle is sold to a customer, and no missing vehicle is written off without Head Office executive authorization.

---

### Q68: Flow 5 — What are the smallest and largest operational scenarios?
**Answer:**
* **Smallest Scenario:** Releasing a brand-new bike from temporary Quarantine Bay Q-3 after replacing a cosmetic side-mirror scratched during carrier truck transport (PKR 1,800 part).
* **Largest Scenario:** Investigating a missing vehicle variance during the monthly physical cycle count audit (1 unit of BRG E-125 unaccounted for on the Peshawar showroom floor, value PKR 280,000).

---
[Back to Top / Navigation Index](#dealership-owners-quick-navigation--executive-index)

---

# PART 6: The Action Creation Wizard & Decision Treatment Drawer (Q69 – Q84)

### Q69: How do staff initiate a new request in the Action Centre?
**Answer:** Staff click the prominent **+ New Action Request** button on the Action Centre screen (or select it from the Dashboard Quick Actions bar). This launches the **2-Step Action Creation Wizard Modal** (`CreateActionModal.vue`).

---

### Q70: What happens in Step 1 of the Action Creation Wizard?
**Answer:** **Step 1: Category & Flow Selection.**
The modal presents 5 interactive cards representing the 5 Standard Enterprise Flows. Each card displays an intuitive icon, category title, and clear subtitle:
1. *Commercial & Pricing Exception* (Discounts, margins & fleet terms)
2. *Inter-Branch Stock Reallocation* (Urgent vehicle pull & transit dispatch)
3. *High-Value OPEX Clearance* (Expenses exceeding branch limit)
4. *Critical Warranty Escalation* (Battery, BMS & motor claims)
5. *Inventory Governance & Quarantine* (Audits, variances & QC release)

The user clicks one card to select the flow and clicks **Continue to Details**.

---

### Q71: What happens in Step 2 of the Action Creation Wizard?
**Answer:** **Step 2: Dynamic Flow-Specific Form Fields.**
The modal dynamically renders specialized input fields tailored specifically to the flow selected in Step 1. If *Commercial & Pricing* was chosen, pricing calculators and margin indicators appear. If *Critical Warranty* was chosen, OBD trouble codes and battery serial inputs appear.

---

### Q72: How does the Action Creation Wizard prevent incomplete submissions?
**Answer:** The wizard enforces strict field-level validation:
* Required text fields cannot be blank.
* Numeric fields (PKR amounts, quantities, percentages) reject negative numbers.
* Proof attachments (vendor bills for OPEX, diagnostic photos for warranty) are mandatory before the **Submit Request** button is unlocked.

---

### Q73: What is the Decision Treatment Drawer?
**Answer:** When an authorized executive (Super Admin) clicks on any task in the Action Centre queue, a comprehensive **Decision Treatment Drawer** slides out smoothly from the right side of the screen.

---

### Q74: What information is displayed inside the Decision Treatment Drawer?
**Answer:** The drawer presents a complete 360-degree operational dossier:
* Header with Task Reference ID, Status Badge, and SLA Countdown Timer.
* Originating Branch details, requesting staff member, and submission timestamp.
* Full narrative business justification.
* Financial Impact Box (Total PKR amount, margin erosion %, or inventory value).
* Embedded Document & Photo Previewer (click to inspect full-screen).
* Historical Activity & Discussion Feed.

---

### Q75: What are the 5 One-Click Decision Treatment Action Buttons?
**Answer:** At the bottom of the Decision Treatment Drawer, 5 standardized operational action buttons allow the executive to resolve the item instantly:
1. **Approve (Green Button):** Unconditionally authorizes the request, updates linked ERP records, and notifies the branch.
2. **Reject (Red Button):** Denies the request; prompts for mandatory rejection feedback explaining why the proposal was turned down.
3. **Request More Info (Blue Button):** Bounces the request back to the requesting branch with specific clarification questions.
4. **Escalate to Board (Purple Button):** Forwards high-value or policy-setting decisions (e.g., contracts exceeding PKR 10 million) to company directors.
5. **Delegate to Regional Lead (Amber Button):** Assigns the operational review to a designated regional manager or technical specialist.

---

### Q76: What happens in the system the microsecond "Approve" is clicked on a Discount Waiver?
**Answer:** 
1. The Action Item status updates to `Approved`.
2. The linked Quotation or Sales Order in the Sales module is unlocked and updated with the approved discounted price.
3. The branch workstation receives an immediate real-time push notification: *"Pricing Waiver ACT-PRC-1082 Approved: You may now issue Invoice."*
4. An immutable audit record is logged with the approver's name and timestamp.

---

### Q77: What happens in the system the microsecond "Approve" is clicked on an OPEX Request?
**Answer:**
1. The Action Item status updates to `Approved`.
2. An authorized payment voucher is posted to the branch accounting ledger.
3. The Central Finance department is queued to disburse funds to the branch bank account or replenish the local petty cash drawer.

---

### Q78: Can a reviewer provide a partial approval or counter-offer?
**Answer:** Yes. For Commercial Pricing requests, the drawer provides a **Counter-Offer** option. The Super Admin can adjust the discount cap (e.g., reducing a requested 14% discount down to 9.5%) and click **Approve with Conditions**. The branch receives the approved counter-cap and can finalize the sale within the approved boundary.

---

### Q79: How does the system handle "Request More Info"?
**Answer:** The task status changes to `Info Requested` and moves into the Branch Manager's **Action Required** queue. The manager receives an alert detailing the reviewer's query (e.g., *"Please attach photo of battery serial barcode and multimeter voltage reading"*). The manager uploads the requested files and resubmits the task with one click.

---

### Q80: How does the Action Centre ensure staff are immediately notified of decisions?
**Answer:** The system utilizes dual-channel notifications:
1. **In-App Toast Notification:** A real-time toast banner appears on the branch workstation or mobile tablet.
2. **Audio Chime:** A discreet notification sound alerts counter staff even if they are looking away from the screen.

---

### Q81: Can historical resolved actions be searched and reviewed later?
**Answer:** Yes. The **All Tasks** tab contains a searchable archive. Staff can search by Reference ID, Branch Name, Customer CNIC, Vehicle VIN, or Date Range, making past approvals easily reviewable during annual financial audits.

---

### Q82: Is the Decision Treatment Drawer fully functional on mobile tablets?
**Answer:** Yes. On mobile tablets, the drawer expands into a full-screen review sheet with clear typography, high-resolution image zoom, and large touch-friendly approval buttons, allowing directors to approve high-value requests while in transit.

---

### Q83: Can a Super Admin reverse an approval once granted?
**Answer:** Once approved, an action item is permanently locked to maintain accounting and legal integrity. If a transaction must be cancelled due to customer withdrawal, an official Cancellation / Reversal Action Item must be initiated, creating an opposite compensating entry with complete audit traceability.

---

### Q84: What live demonstration scenario is pre-loaded in the Action Centre for training?
**Answer:** The system includes pre-loaded live case studies across all 5 flows:
* `ACT-PRC-1082`: Peshawar Branch 12% discount waiver request for Khyber Courier & Logistics.
* `ACT-STK-2041`: Urgent stock pull of 1 Emerald Green BRG E-125 from Lahore Hub to Islamabad.
* `ACT-EXP-3019`: Emergency generator inverter repair (PKR 18,500) for Rawalpindi showroom.
* `ACT-WRN-4052`: High-voltage lithium battery pack replacement with OBD thermal error code.
* `ACT-GOV-5011`: Missing rear-view mirror transit damage report for container shipment intake.


---
[Back to Top / Navigation Index](#dealership-owners-quick-navigation--executive-index)

---

# SECTION III: THE SHOWROOM SALES LIFECYCLE (WALK-IN TO DELIVERY)

---

# PART 7: Walk-In Customers & Capturing Sales Leads (Q85 – Q98)

### Q85: What is a "Sales Lead" in AJ EcoDrive?
**Answer:** A Sales Lead is a prospective customer who visits the showroom, calls the front desk, or submits an inquiry online. Capturing leads systematically ensures that no potential vehicle sale slips through the cracks, and sales staff are held accountable for follow-ups.

---

### Q86: What is the step-by-step procedure when a walk-in customer enters the showroom?
**Answer:**
1. **Showroom Greeting:** The sales executive welcomes the visitor and introduces the dealership's electric bike models.
2. **Open Mobile Tablet / Counter Workstation:** Staff open the Leads module (`/sales/leads`) or tap **+ New Walk-In Lead** on the Quick Actions bar.
3. **Capture Initial Inquiry:** Enter the visitor's name, mobile number, preferred bike model, and budget.
4. **Schedule Test Drive or Follow-up:** Book a 15-minute test ride around the dealership block or schedule a follow-up call.
5. **Save to Lead Pipeline:** The lead is saved and automatically appears in the branch's daily sales pipeline.

---

### Q87: What stages does a sales lead move through in the pipeline?
**Answer:** A lead moves through 5 clear stages:
* **New / Inquiry:** First contact logged; customer exploring models.
* **Contacted / Engaged:** Product consultation held; vehicle specifications shared.
* **Test Drive Scheduled:** Customer booked or completed a physical showroom test ride.
* **Qualified / Negotiating:** Customer seriously interested; formal price quotation requested.
* **Won (Converted to Sale) or Lost (Closed with reason):** Lead purchases a bike or declines (e.g., bought competitor bike or budget shortfall).

---

### Q88: How does the system prevent sales executives from hoarding leads or forgetting follow-ups?
**Answer:** The Leads screen features an **Aging & Inactive Alert**. If a lead remains in *"New"* or *"Contacted"* status for more than 48 hours without a documented interaction, the system flags the lead in amber and alerts the Branch Manager during the morning review.

---

### Q89: How does the system prevent duplicate lead entries?
**Answer:** When staff enter a customer's mobile phone number (`03XX-XXXXXXX`), the system performs an instant real-time deduplication check. If the number already exists, a notification pops up: *"Existing Lead Found: Registered to Salman Khan (Sales Exec: Ahmed Ali). View Existing Record?"* This prevents staff from stealing colleagues' prospects.

---

### Q90: Modal Guide — What is the CreateLeadModal (`CreateLead.vue`), and what are its exact fields?
**Answer:** The **`CreateLeadModal`** is the entry gateway for capturing prospective buyers. It contains the following structured fields:
* **Full Name (Required):** Customer's legal name.
* **Mobile Phone Number (Required):** 11-digit Pakistani mobile format (`0300-1234567`).
* **Email Address (Optional):** For emailing brochures and official quotations.
* **Branch / Showroom (Auto-Selected):** Locks to the active branch (e.g., Peshawar Showroom).
* **Lead Source (Required Dropdown):** Showroom Walk-in, Social Media (Facebook/Instagram), Billboard / Outdoor Ad, Website Inquiry, or Customer Referral.
* **Interested Model (Dropdown):** BRG E-125 Commuter, BRG Cargo Trike, Falcon Sport EV, or EcoCity 70.
* **Budget Range (PKR Dropdown):** Under PKR 200,000, PKR 200,000 – PKR 300,000, or Above PKR 300,000.
* **Planned Purchase Timeline:** Immediate (This Week), Within 30 Days, or Exploring / Next Quarter.
* **Assigned Sales Representative:** Staff member responsible for nurturing the prospect.
* **Consultation Notes:** Free-form notes on customer preferences (e.g., *"Prefers Matte Gunmetal color; wants installment plan"*).

---

### Q91: Modal Guide — What is the CreateFollowUpModal (`CreateFollowUp.vue`), and how does it work?
**Answer:** The **`CreateFollowUpModal`** schedules and documents customer touchpoints:
* **Linked Lead / Customer Name:** Displayed prominently at the top.
* **Follow-Up Type:** Phone Call, WhatsApp Message, Showroom Visit, or Home Test Ride.
* **Scheduled Date & Time:** Future appointment date with automated calendar reminder.
* **Call Outcome & Discussion Summary:** Staff logs what transpired (e.g., *"Customer tested bike; satisfied with acceleration; discussing budget with father"*).
* **Next Action:** Sets the subsequent milestone in the sales pipeline.

---

### Q92: Can a customer take a test ride without registering a lead?
**Answer:** **No.** Dealership liability and vehicle insurance policies require the customer's full name, verified mobile number, and a physical inspection of their driver's license before showroom staff can hand over the keys for a test ride.

---

### Q93: How does a sales executive convert a Qualified Lead into a Formal Quotation?
**Answer:** On the Lead details view, staff click the prominent **Create Quotation** button. The system automatically transfers the customer's name, phone, email, and preferred model directly into the Quotation engine, eliminating repetitive typing.

---

### Q94: What happens if a lead decides not to purchase?
**Answer:** The staff marks the lead as **Lost** and must select a mandatory **Lost Reason**:
* Price Too High / Budget Constraint
* Purchased Competitor Petrol Bike (e.g., Honda CD70)
* Purchased Competitor Electric Bike (e.g., RoadPrince / Yadea)
* Relocated to Another City
* Dissatisfied with Vehicle Top Speed / Battery Range
This data feeds the Super Admin's national Market Intelligence analytics.

---

### Q95: Can leads be imported in bulk from marketing campaigns?
**Answer:** Yes. The Super Admin portal includes a **Bulk Lead Import** tool (CSV format) that ingests digital leads generated from Facebook Lead Ads or Google campaigns and distributes them evenly across branch showrooms.

---

### Q96: Does the system track which marketing channel produces the highest paying customers?
**Answer:** Yes. The Sales Analytics dashboard generates a **Lead Conversion by Source Report**, showing which channels (e.g., Showroom Walk-in vs Instagram Ads) deliver the highest return on investment.

---

### Q97: How does the Leads module behave when the showroom loses internet connection?
**Answer:** The Leads module is **Category A: Fully Offline-Capable**. Staff can enter walk-in leads without interruption. All entries save to local workstation memory and sync to the cloud automatically once connectivity restores.

---

### Q98: Can a salesperson delete a lead to hide a lost customer from management?
**Answer:** **No.** Deletion privileges are strictly restricted to Super Admin. Sales staff can only archive or mark leads as Lost, ensuring complete visibility over showroom footfall.

---
[Back to Top / Navigation Index](#dealership-owners-quick-navigation--executive-index)

---

# PART 8: Customer Registration, CNIC Verification & KYC (Q99 – Q112)

### Q99: Why is formal customer registration and CNIC verification mandatory for electric bikes?
**Answer:** Unlike small retail goods, an electric motorbike is a licensed motor vehicle that operates on public highways. Formal registration with a 13-digit Pakistani Computerized National Identity Card (CNIC) is required for:
1. **Government Excise & Taxation Registration:** Issuing the official registration book and license number plate.
2. **Anti-Theft Tracking:** Registering legal ownership of the stamped steel chassis (VIN).
3. **High-Voltage Battery Warranty Enforcement:** Linking the 2-year manufacturer battery warranty to the verified legal owner.
4. **Anti-Money Laundering (AML) Compliance:** Verifying customer identity for cash payments exceeding state thresholds.

---

### Q100: What is the exact format of the Pakistani CNIC in AJ EcoDrive?
**Answer:** The system strictly enforces the official 13-digit National Database and Registration Authority (NADRA) format:
`XXXXX-XXXXXXX-X` (e.g., `17301-8492019-3`).
The system validates the digit count automatically, preventing typos or incomplete entries.

---

### Q101: Modal Guide — What is the CreateCustomerModal (`CreateCustomer.vue`), and what are its exact fields?
**Answer:** The **`CreateCustomerModal`** captures the verified legal customer identity:
* **Customer Category (Radio Selection):** Individual Retail Buyer vs Corporate / Fleet Business.
* **Full Legal Name (Required):** Exactly as printed on the CNIC card.
* **Father's / Husband's Name (Required for Individual):** For excise documentation.
* **CNIC / B-Form Number (Required):** 13-digit validated format.
* **Primary Mobile Phone (Required):** `03XX-XXXXXXX` with SMS delivery validation.
* **Secondary / WhatsApp Phone (Optional):** For delivery tracking and service reminders.
* **Residential / Permanent Address (Required):** House, street, sector/mohalla for vehicle registration.
* **City & Province (Dropdown):** Khyber Pakhtunkhwa (Peshawar), Islamabad ICT, Punjab (Lahore/Rawalpindi), etc.
* **Emergency Contact Person & Phone:** Relative or guarantor in case of road accident or recovery.
* **Tax Status (Filer / Non-Filer):** Determines applicable advance withholding tax under Pakistan tax laws.
* **Corporate NTN & Company Registration Number (Optional):** Displayed only if *Corporate / Fleet* is selected.

---

### Q102: How does the system handle corporate fleet buyers (e.g., courier companies)?
**Answer:** Selecting *Corporate / Fleet Business* unlocks dedicated business fields: Company Legal Name, National Tax Number (NTN), Sales Tax Registration Number (STRN), Authorized Purchasing Officer Name, and Corporate Billing Address.

---

### Q103: Can a customer purchase a bike if they only have a NADRA Token (CNIC under renewal)?
**Answer:** Yes. Staff can select the **NADRA Token / Temporary Slip** option, enter the 15-digit NADRA tracking number, and set a 30-day reminder for the customer to provide their original plastic card before final excise submission.

---

### Q104: How does the system protect customer private personal data?
**Answer:** All customer records are protected with bank-grade encryption (AES-256). Staff cannot export customer phone lists to external USB drives without Super Admin audit authorization.

---

### Q105: Can a customer's contact details be updated if they change their mobile number?
**Answer:** Yes. Staff can open the Customer Profile and edit contact information. The system maintains an edit history log showing who modified the phone number and when.

---

### Q106: What happens if a customer has bad credit history with the dealership?
**Answer:** If a customer defaulted on installment payments or issued a bounced cheque in the past, their profile can be flagged with a **Credit Warning / Blacklist Badge**. When staff select this customer on a new sales order, an immediate warning banner appears: *"Customer Has Past Payment Default: Cash-Only Terms Mandatory."*

---

### Q107: Can a customer purchase multiple bikes under a single CNIC?
**Answer:** Yes. The Customer Profile provides a consolidated **Vehicles Owned** tab listing every electric bike purchased by that customer, including active warranties, chassis numbers, and service histories.

---

### Q108: Does the system format customer names properly?
**Answer:** Yes. The system automatically capitalizes customer names (Title Case) and strips accidental whitespace, ensuring that official printed invoices and registration books look immaculate and professional.

---

### Q109: How does the Customer Registration module behave when the internet is down?
**Answer:** Customer registration is **Category A: Fully Offline-Capable**. Customers can be registered locally on the showroom workstation or tablet. The record saves to local memory and synchronizes to the national cloud database upon reconnection.

---

### Q110: Can a sales executive delete a registered customer?
**Answer:** **No.** Customer records are permanent corporate assets and cannot be deleted by showroom staff. If an entry is duplicate, it can be merged with the primary record via Super Admin tools.

---

### Q111: How does the system assist with Filer vs Non-Filer tax calculations?
**Answer:** Based on the customer's selected tax status, the quotation and invoicing engine automatically applies the appropriate provincial advance withholding tax rate according to the current federal budget.

---

### Q112: Is customer KYC information printed on the vehicle delivery documents?
**Answer:** Yes. The customer's legal name, CNIC number, residential address, and verified phone number are automatically printed on the Sales Invoice, Warranty Certificate, and Delivery Gate Pass.

---
[Back to Top / Navigation Index](#dealership-owners-quick-navigation--executive-index)

---

# PART 9: Formal Pricing & Customer Quotations (Q113 – Q128)

### Q113: What is the purpose of a formal written quotation in an EV dealership?
**Answer:** A written quotation provides an official, transparent price breakdown for a prospective buyer. It eliminates verbal misunderstandings regarding base vehicle price, government taxes, registration charges, and optional accessories (such as rear luggage carriers or smart fast chargers).

---

### Q114: How long is an AJ EcoDrive quotation legally valid?
**Answer:** Every quotation generated by the system features an automated **7-Day Price Guarantee**. If catalog prices increase or exchange rates fluctuate during this period, the dealership honors the quoted price. After 7 days, the quotation automatically expires.

---

### Q115: What is the Strict 8% Discount Ceiling Rule?
**Answer:** To protect dealership profit margins, showroom staff are permitted to grant discounts up to a **strict maximum ceiling of 8% (or PKR 25,000)**. If staff attempt to enter a discount higher than 8%, the system locks the submit button and displays a prominent warning:
> *"Discount Exceeds Showroom Limit (8% Max). This proposal must be submitted to Head Office Action Centre (Flow 1) for executive margin clearance."*

---

### Q116: Modal Guide — What is the CreateQuotationModal (`CreateQuotation.vue`), and what are its exact fields?
**Answer:** The **`CreateQuotationModal`** is the formal pricing engine:
* **Customer Selection (Required Dropdown / Search):** Search registered customer by Name, CNIC, or Mobile.
* **Showroom Branch (Auto-Locked):** Identifies quoting location (e.g., Peshawar Showroom).
* **Quotation Date & Automated Expiry Date:** Defaults to current date with 7-day validity.
* **Vehicle Model Selection (Required Dropdown):** Selects model from master catalog (e.g., BRG E-125 Commuter).
* **Color Variant Selection:** Gloss Black, Metallic Blue, Pearl White, or Matte Gunmetal.
* **Catalogue Base Price (PKR - Auto-Populated):** Standard MSRP locked from central catalog (e.g., PKR 245,000).
* **Discount Percentage / Amount Input:** Staff can enter a percentage or flat PKR discount.
* **Live Calculation Banner:** Dynamically shows Net Vehicle Price after discount.
* **Optional Add-Ons & Accessories:** Checkboxes for Smart Fast Charger (60V/5A), Heavy-Duty Top Box, Crash Guard, or Spare Helmet.
* **Official Excise Registration Fee (PKR):** Government road tax and number plate fee.
* **Total Quotation Amount (PKR - Bold Summary):** Complete customer out-the-door price.
* **Payment Terms (Dropdown):** 100% Full Advance Cash, 50% Booking Deposit + Balance on Delivery, or Bank Financing.
* **Terms & Notes:** Pre-printed standard terms (warranty scope, delivery timeline, battery charging instructions).

---

### Q117: What does the customer receive when a quotation is finalized?
**Answer:** Staff can print an immaculate, professional A4 Quotation Sheet on the counter laser printer or click **Send via WhatsApp / Email**. The sheet features the official dealership header, itemized pricing, warranty terms, and the salesperson's contact card.

---

### Q118: How does staff convert an accepted Quotation into a confirmed Sales Order?
**Answer:** When the customer agrees to the deal, staff open the quotation in `/sales/quotations` and click the prominent green button: **Convert to Sales Order**. The system transfers all pricing, vehicle specifications, and customer details directly into a Sales Order with a single click.

---

### Q119: Can a quotation reserve a physical bike from showroom floor stock?
**Answer:** **No.** A quotation is merely a price offer; it does not reduce showroom inventory. Physical vehicle chassis reservation only occurs when the quotation is converted into a confirmed Sales Order accompanied by an advance deposit.

---

### Q120: What happens if a customer returns on Day 8 with an expired quotation?
**Answer:** The system marks expired quotations in grey. Staff can click **Re-Validate Quotation**. The system recalculates pricing against the current active catalog price list. If prices have not changed, it issues a renewed 7-day quote.

---

### Q121: Can staff apply discounts to government registration or helmet fees?
**Answer:** No. The discount calculator applies strictly to the base vehicle margin. Government excise fees, third-party insurance, and mandatory delivery charges are fixed pass-through costs that cannot be discounted.

---

### Q122: How does the system handle quotations for institutional B2B fleets?
**Answer:** For commercial fleet inquiries (e.g., 20 delivery trikes), staff enter the quantity in `CreateQuotationModal`. The subtotal, fleet discount tier, and commercial tax deductions scale dynamically.

---

### Q123: What happens if a customer asks for a discount above 8%?
**Answer:** The staff clicks **Request Pricing Override**. The system automatically packages the deal, calculates projected gross margin erosion, and routes the proposal into the **Action Centre (Flow 1: Commercial & Pricing Exception)** for Super Admin review.

---

### Q124: Does the Quotation screen work when the showroom is offline?
**Answer:** Yes. Quotation preparation is **Category A: Fully Offline-Capable**. Staff can prepare and print quotations using the locally cached price lists. The quotation synchronizes to the central server when connectivity resumes.

---

### Q125: Can an employee alter the catalogue price in the database?
**Answer:** **No.** Master catalog pricing is strictly read-only for branch staff. Only Super Admin has authority to modify MSRP in master settings.

---

### Q126: How are quotations tracked by dealership management?
**Answer:** The Quotation Pipeline dashboard shows the **Quotation-to-Order Conversion Rate** for each salesperson and branch, highlighting who is effectively closing deals.

---

### Q127: Can an expired quotation be converted into an order without manager review?
**Answer:** No. Attempting to convert an expired quotation prompts for manager authorization to ensure the customer is not given outdated pricing.

---

### Q128: Are quotation revisions tracked if a customer changes their mind on color or battery size?
**Answer:** Yes. The system creates a new revision (`QT-1042-R2`), preserving the original quote for historical comparison.

---
[Back to Top / Navigation Index](#dealership-owners-quick-navigation--executive-index)

---

# PART 10: Instant Point of Sale (POS) & Sales Order Confirmation (Q129 – Q144)

### Q129: What is the difference between a Formal Quotation and a Point of Sale (POS) Order?
**Answer:** 
* A **Quotation** is an exploratory price estimate with zero inventory commitment.
* A **Point of Sale (POS) Order** is a legally binding sales transaction. It immediately reserves a specific, physical vehicle chassis (VIN) from showroom inventory, establishes customer financial liability, and initiates delivery preparation.

---

### Q130: What are the two ways a Sales Order is created in AJ EcoDrive?
**Answer:**
1. **1-Click Conversion from Accepted Quotation:** The preferred method for customers who negotiated terms beforehand.
2. **Direct Point of Sale (POS) Entry:** For walk-in customers who inspect a scooter on the floor and decide to buy immediately on the spot.

---

### Q131: What is the Live Dynamic Calculation Engine inside CreateSaleModal?
**Answer:** The POS sales modal (`CreateSale.vue`) features an instant, reactive calculation engine:
$$\text{Final Payable Price} = \text{Catalogue MSRP} - \text{Approved Discount} + \text{Accessories} + \text{Excise Registration}$$
$$\text{Remaining Balance} = \text{Final Payable Price} - \text{Amount Received Today}$$
As staff type discount amounts or cash received, all figures, tax amounts, and outstanding balance totals update instantaneously in real-time.

---

### Q132: Modal Guide — What is the CreateSaleModal (`CreateSale.vue`), and what are its exact fields?
**Answer:** The **`CreateSaleModal`** is the master POS execution screen:
* **Showroom Branch (Auto-Locked):** Identifies selling branch.
* **Customer Selection (Required Dropdown / Search):** Selects verified customer with CNIC.
* **Vehicle Model & Color (Dropdown):** Model from active branch floor stock.
* **Chassis / VIN Multi-Selector (Required):** Dropdown listing only *Available* physical VINs physically located on that branch's floor.
* **Catalogue MSRP (PKR - Locked):** Central list price.
* **Discount Allowed (PKR / %):** Enforces 8% ceiling.
* **Final Net Price (PKR - Calculated):** Net vehicle price.
* **Amount Received Now (PKR Input):** Cash or bank transfer collected today.
* **Remaining Balance (PKR - Calculated):** Outstanding customer payable.
* **Payment Mode:** Cash, Bank Transfer (IBFT), Cheque / Pay Order, or Split Payment.
* **Assigned Sales Representative:** Salesperson earning commission.
* **Estimated Delivery Date:** Scheduled handover date.
* **Special Delivery Instructions:** e.g., *"Customer requested full charge and red ribbon on handlebar."*

---

### Q133: Why does the system force staff to select a specific Chassis VIN during order creation?
**Answer:** To eliminate the dangerous showroom practice of selling "ghost bikes". By locking a specific chassis number (e.g., `VIN-PK-BRG-2026-00812`), the system immediately changes that bike's status from **Available** to **Reserved**. No other salesperson can accidentally promise or sell that exact machine to another walk-in customer.

---

### Q134: Can a salesperson sell a bike that is currently in Quarantine or In-Transit?
**Answer:** **No.** The VIN dropdown strictly filters for vehicles with status = `Available` in that specific branch. Bikes marked as `Quarantine`, `In-Transit`, `Reserved`, or `In-Service` do not appear in the selection list.

---

### Q135: What happens when an order is created with only a partial booking deposit?
**Answer:** The system creates the Sales Order in status **Partially Paid / Reserved**:
* The vehicle is reserved in the customer's name.
* The customer receives an official **Booking Deposit Receipt**.
* The remaining balance is tracked in the Customer Aging Ledger.
* The system blocks vehicle handover until the remaining balance is paid in full.

---

### Q136: Can an electric bike be delivered if the customer still owes a balance?
**Answer:** **No. The Zero Balance Rule strictly prohibits this.** The system physically disables the "Generate Gate Pass" button if Remaining Balance > PKR 0. No vehicle can physically exit the showroom doors without full financial settlement.

---

### Q137: How does the system handle split payments (e.g., PKR 100,000 cash and PKR 145,000 bank transfer)?
**Answer:** The POS payment engine supports multi-tender split payments. Staff can log multiple payment lines on the same order, specifying the amount and payment instrument for each portion.

---

### Q138: Does creating a Sales Order generate an automated Commercial Invoice?
**Answer:** Yes. The microsecond the Sales Order is submitted, the system automatically creates an official, serialized Tax Invoice (`INV-2026-XXXX`) with legal tax calculations and company bank payment details.

---

### Q139: Can staff edit the price on a confirmed Sales Order after it has been created?
**Answer:** **No.** Once confirmed, financial amounts are permanently locked to prevent unauthorized alterations. If a customer changes their order or requests a modification, the change must be processed via an official order amendment requiring manager sign-off.

---

### Q140: What happens if a customer cancels their booking before delivery?
**Answer:** Staff initiate an official **Order Cancellation & Return Request** (`CreateReturnModal`). The vehicle reservation is released back to available inventory, and the customer deposit refund is routed for manager approval.

---

### Q141: How does the POS system operate when the internet connection drops?
**Answer:** Sales Order confirmation is **Category B: Restricted Offline-Capable**. Staff can confirm orders for vehicles physically present in the local showroom database. The reservation commits locally and synchronizes to the national cloud server the moment connectivity resumes.

---

### Q142: Can a customer trade in their old petrol motorcycle as part payment?
**Answer:** Yes. The POS engine includes a **Trade-In / Buy-Back Allowance** field. The showroom evaluator inspects the old motorcycle, enters its evaluated valuation (e.g., PKR 65,000), and the system deducts this amount from the EV's final payable price.

---

### Q143: Are sales commission records generated automatically for sales staff?
**Answer:** Yes. Each confirmed Sales Order tags the assigned Sales Representative, feeding the automated **Salesperson Commission & Performance Report**.

---

### Q144: Can a customer take delivery immediately if they pay 100% cash at the POS counter?
**Answer:** Yes. If the customer pays 100% cash and the vehicle has passed its Pre-Delivery Inspection (PDI), the system confirms full payment, generates the Tax Invoice, and unlocks the Delivery Gate Pass for immediate release.

---
[Back to Top / Navigation Index](#dealership-owners-quick-navigation--executive-index)

---

# PART 11: Invoicing, Deposits & Customer Money Collections (Q145 – Q158)

### Q145: What is the Anti-Fraud Invoicing Rule in AJ EcoDrive?
**Answer:** To eliminate showroom theft, unrecorded cash collections, and "under-the-table" payments, AJ EcoDrive enforces a strict rule:
> **"Every single rupee collected from a customer MUST be linked to an official system-generated Invoice Number."**
Staff cannot enter an unlinked cash receipt. Every payment must reference an active invoice, ensuring that money in the drawer always matches documented vehicle sales and service charges.

---

### Q146: What payment channels does the system support?
**Answer:** The payment engine supports 4 standardized channels:
1. **Physical Cash Drawer:** Hard currency notes counted and held in the showroom cash register.
2. **Inter-Bank Funds Transfer (IBFT):** Direct customer bank transfer into the dealership's corporate bank accounts (e.g., Bank Alfalah, Meezan Bank, or Habib Bank Limited).
3. **Cheque / Banker's Pay Order:** Instruments requiring clearance before vehicle release.
4. **POS Card Swiping Machine:** Credit/debit card merchant receipts.

---

### Q147: Modal Guide — What is the CreatePaymentModal (`CreatePayment.vue`), and what are its exact fields?
**Answer:** The **`CreatePaymentModal`** records financial collections with complete audit integrity:
* **Showroom Branch (Auto-Locked):** Branch receiving the funds.
* **Invoice Reference Selector (Required):** Dropdown showing open invoices with outstanding balances.
* **Customer Legal Name (Auto-Populated):** Verified from invoice.
* **Payment Date:** Defaults to current date and time.
* **Total Invoice Amount (PKR - Displayed):** Original billed amount.
* **Previously Paid Amount (PKR - Displayed):** Sum of past receipts.
* **Remaining Balance Due (PKR - Displayed):** Balance before this transaction.
* **Amount Received Today (Required PKR Input):** Exact currency collected.
* **Payment Mode (Dropdown):** Cash Drawer, Bank Transfer (IBFT), Pay Order / Cheque, or POS Card.
* **Deposit Bank Account (Required if Bank/IBFT):** Dealership bank account (e.g., *Meezan Bank - A/C #0201010048291*).
* **Transaction Reference / Cheque Number:** Mandatory bank transaction ID or cheque serial.
* **Proof Attachment Upload:** Photo upload of customer bank transfer screenshot or cheque scan.
* **Cashier Notes:** Free-form reconciliation remarks.

---

### Q148: What does the customer receive immediately upon making a payment?
**Answer:** The thermal receipt printer automatically prints an official **Money Receipt Voucher** with:
* Dealership corporate logo and tax NTN/STRN.
* Unique Receipt Serial Number (e.g., `REC-2026-0812`).
* Linked Invoice Number and Vehicle Chassis VIN.
* Amount Received (in numbers and words: *"PKR Two Hundred Thousand Only"*).
* Remaining Outstanding Balance.
* Cashier Signature Stamp & Security QR Code.

---

### Q149: How does the system handle bank transfer (IBFT) payments to prevent fake screenshot scams?
**Answer:** Customers frequently present fabricated mobile banking screenshots. When staff select *Bank Transfer (IBFT)*, the system marks the payment status as **Pending Bank Verification**. The Branch Manager must verify that the funds have physically cleared into the online corporate bank statement before approving the payment and releasing the vehicle.

---

### Q150: What happens if a customer pays with a cheque that bounces?
**Answer:** The Branch Manager opens the payment record and clicks **Bounce Cheque**. The system automatically reverses the payment entry, restores the outstanding balance on the invoice, adds a penalty fee, and locks vehicle delivery.

---

### Q151: How does the system prevent cashiers from pocketing cash and voiding invoices later?
**Answer:** Cashiers do not have permission to void or delete invoices. Once a receipt is printed, it is permanently locked into the daily accounting ledger. Any correction requires an official Credit Note authorized by the Central Finance Officer.

---

### Q152: Can a customer make payments in installments?
**Answer:** Yes. The system tracks multiple partial payments against a single invoice. Each installment generates an incremental receipt and updates the remaining balance countdown.

---

### Q153: How does the system reconcile the cash drawer at the end of the day?
**Answer:** During the Day-End Closing Routine (Part 24), the system sums all payments logged as *Physical Cash Drawer* and compares the total against the physical currency notes counted in the safe.

---

### Q154: Are customer payments synchronized to Head Office in real time?
**Answer:** Yes. Under online conditions, payments synchronize to Head Office immediately, giving executives live visibility over company-wide cash inflow.

---

### Q155: What happens if a payment is captured while the showroom is offline?
**Answer:** Payment capture is **Category B: Restricted Offline-Capable**. Staff can log cash collections offline. The workstation generates a local receipt number. When the internet reconnects, the transaction queues to central accounting with verified timestamps.

---

### Q156: Can a customer request an official tax invoice in their company's name for tax deductions?
**Answer:** Yes. If the customer is a corporate entity, the invoice includes the company's NTN, STRN, and registered corporate address for business expense deductions.

---

### Q157: Does the system alert management to long-overdue unpaid balances?
**Answer:** Yes. The **Accounts Receivable Aging Report** categorizes unpaid balances into 1–15 days, 16–30 days, and 30+ days, prompting follow-up calls.

---

### Q158: Can a cashier accept foreign currency (e.g., US Dollars or UAE Dirhams)?
**Answer:** No. Dealership policy mandates Pakistani Rupees (PKR) for all local retail transactions. Foreign buyers must convert currency at authorized exchange houses.

---
[Back to Top / Navigation Index](#dealership-owners-quick-navigation--executive-index)

---

# PART 12: Pre-Delivery Inspection (PDI) & Official Gate Pass Handover (Q159 – Q174)

### Q159: What is the Pre-Delivery Inspection (PDI) in an EV dealership?
**Answer:** The Pre-Delivery Inspection (PDI) is a rigorous technical quality checklist completed by the workshop technician before any electric vehicle is handed over to a buyer. It guarantees that the vehicle is mechanically sound, electrically safe, and road-ready.

---

### Q160: What are the 6 mandatory checkpoints in the AJ EcoDrive PDI Protocol?
**Answer:** The technician must inspect, verify, and digitally check off all 6 points:
1. **Lithium Battery State of Charge (SOC):** Charged to 100% with healthy cell balance.
2. **Tyre Pressure & Wheel Torque:** Front 28–30 PSI, Rear 32–34 PSI; axle nuts torqued to specification.
3. **Braking System:** Front/rear hydraulic disc brake pressure, fluid levels, and regenerative brake cutoff.
4. **Electrical Systems & Lighting:** High/low beam headlights, brake light, turn indicators, and horn.
5. **Electronic Throttle & Drive Modes:** Smooth throttle response across Eco, City, and Sport speed modes.
6. **Smart BMS & ECU Diagnostics:** Zero active diagnostic trouble codes (DTCs) on the digital instrument console.

---

### Q161: What is the "Zero Balance Handover Rule"?
**Answer:** **A vehicle cannot be handed over if a single rupee remains unpaid.** The system hard-locks the delivery screen:
> **"HANDOVER BLOCKED: Outstanding Balance is PKR 45,000. Customer must clear balance before Delivery Gate Pass can be printed."**
This protects dealership owners from customers driving away with unpaid balances.

---

### Q162: Modal Guide — What is the CreateDeliveryHandoverModal (`CreateDeliveryHandover.vue`), and what are its exact fields?
**Answer:** The **`CreateDeliveryHandoverModal`** executes the legal transfer of the vehicle:
* **Showroom Branch (Auto-Locked):** Branch performing the delivery.
* **Sales Order Reference Selector (Required):** Selects fully-paid sales orders awaiting delivery.
* **Customer Legal Name & CNIC (Auto-Populated):** Verified recipient.
* **Assigned Chassis / VIN (Auto-Populated):** The physical machine being released.
* **Battery Serial & Motor Number (Auto-Populated):** Recorded for warranty activation.
* **6-Point PDI Verification Checklist:** Interactive checkboxes for all 6 technical points.
* **PDI Inspecting Technician Name:** Mechanic certifying vehicle roadworthiness.
* **Accessories Handover Checklist:** Checkboxes for 2 Ignition Keys, 2 Remote Alarm Fobs, Smart Fast Charger, Tool Kit, and Owner's Manual.
* **Customer Odometer Reading:** Initial delivery mileage (typically 1 to 5 km from factory testing).
* **Customer Signature Confirmation:** Digital checkbox confirming customer inspected vehicle and found no scratches or defects.
* **Generate Delivery Gate Pass Button:** Unlocks only when all checklist items are certified.

---

### Q163: What is the Official Delivery Gate Pass, and why is it legally essential?
**Answer:** The **Delivery Gate Pass** is an official legal security document printed on the counter laser printer. It features:
* Dealership corporate header, tax registration, and branch address.
* Unique Gate Pass Serial Number (e.g., `GP-2026-0914`).
* Vehicle Chassis Number (VIN), Motor Number, and Color.
* Customer Name, CNIC, and Verified Mobile Phone.
* Automated Security QR Code and Anti-Tamper Security Watermark.
* Handover Officer Signature & Security Guard Exit Stamp.

---

### Q164: What is the strict role of the Security Guard at the showroom exit gate?
**Answer:** The showroom security guard is instructed never to open the exit gates for a vehicle without a physically signed, stamped Delivery Gate Pass. The guard matches the chassis number stamped on the bike's frame against the printed Gate Pass, signs the guard exit log, and archives the physical gate pass stub.

---

### Q165: What happens in the system the exact moment the Handover is submitted?
**Answer:**
1. The vehicle lifecycle status updates from `Reserved` to **`Delivered / Customer Owned`**.
2. The vehicle is officially removed from active showroom inventory.
3. The customer's **2-Year / 30,000 km Manufacturer Warranty** is activated in the cloud, locking the start date to today's date.
4. An automated congratulatory SMS is sent to the customer's mobile phone with emergency roadside assistance contacts and battery care tips.

---

### Q166: What is the Showroom Delivery Ceremony?
**Answer:** To build customer loyalty and positive social media presence, staff conduct a ceremonial handover:
* Presenting the clean, polished electric bike with a ceremonial key.
* Explaining battery charging best practices (e.g., avoiding overnight overcharging and using original chargers).
* Taking a customer delivery photograph (with permission) for the dealership's customer hall of fame.

---

### Q167: Can a customer take delivery if their registered representative collects the bike?
**Answer:** Yes, but only with a signed **Letter of Authorization** and an original physical copy of the customer's CNIC and the representative's CNIC, both of which are scanned and archived in the system.

---

### Q168: What happens if a scratch or defect is discovered during the PDI?
**Answer:** If the technician or customer discovers a paint defect, cracked fairing, or loose wire during PDI, the handover is halted. The vehicle is sent to the workshop for immediate rectification, or an alternate vehicle is allocated.

---

### Q169: Does the system record which technician certified the PDI?
**Answer:** Yes. The certifying mechanic's name is permanently attached to the vehicle record. If a mechanical issue arises within 48 hours, management can review the original PDI sign-off.

---

### Q170: Can the Delivery Gate Pass be printed twice?
**Answer:** If a reprint is required (e.g., printer paper jam), the system prints the document with a prominent watermark: **"REPRINT / DUPLICATE COPY"**, logging the reprint reason in the audit trail to prevent gate pass fraud.

---

### Q171: How does Delivery Handover operate if the internet is down?
**Answer:** Handover is **Category B: Restricted Offline-Capable**. If the invoice was already 100% paid locally, staff can complete the PDI checklist and print the Gate Pass locally. The warranty activation queues in the Outbox and syncs upon reconnection.

---

### Q172: Does the system record the charger serial number handed to the customer?
**Answer:** Yes. The smart charger serial number is recorded in the delivery checklist to ensure only original chargers are accepted during future warranty claims.

---

### Q173: Can an employee delete a completed delivery handover record?
**Answer:** **No.** Completed delivery handovers are permanent legal records that cannot be edited or deleted.

---

### Q174: What documentation is handed to the customer upon departure?
**Answer:**
1. Original Commercial Tax Invoice.
2. Official Delivery Gate Pass (Customer Copy).
3. 2-Year Manufacturer Warranty Certificate & Battery Card.
4. Government Excise Registration Application Form.
5. Owner's Manual & Emergency Roadside Contact Guide.


---
[Back to Top / Navigation Index](#dealership-owners-quick-navigation--executive-index)

---

# SECTION IV: AFTER-SALES SERVICE, WORKSHOP & WARRANTY (OWNERSHIP JOURNEY)

---

# PART 13: Workshop Intake & Opening Service Cases (Q175 – Q188)

### Q175: What is the purpose of the Workshop Intake process in AJ EcoDrive?
**Answer:** Workshop Intake is the formal reception procedure when a customer brings their electric bike to the dealership service department. It establishes the vehicle's physical condition upon arrival, logs the customer's specific complaints, checks manufacturer warranty status, and prevents disputes regarding pre-existing scratches or missing accessories.

---

### Q176: What happens during the initial service triage?
**Answer:** The service advisor conducts a 3-minute physical inspection with the customer:
1. Verifies the vehicle chassis number (VIN) against the system.
2. Records current odometer mileage (km).
3. Notes existing scratches, dents, or loose mirrors on the vehicle intake diagram.
4. Categorizes the issue: Scheduled Maintenance, Minor Electrical, Brake / Suspension, Major Motor / Controller, or Battery / BMS Fault.
5. Issues an official **Service Intake Job Slip** to the customer.

---

### Q177: Modal Guide — What is the CreateCaseModal (`CreateCase.vue`), and what are its exact fields?
**Answer:** The **`CreateCaseModal`** initiates a service or warranty complaint:
* **Customer Search & Selection (Required):** Search by Name, Mobile Phone, or CNIC.
* **Vehicle Chassis / VIN Selector (Required):** Selects from vehicles owned by that customer.
* **Current Odometer Mileage (Required km Input):** Mileage for warranty validation.
* **Issue Category (Dropdown):** Scheduled Routine Maintenance (1,000 km / 5,000 km), Electrical & Lighting, Mechanical & Brakes, Motor & Transmission, Lithium Battery & Charging, or Accident Repair.
* **Customer Reported Complaint (Required Text Area):** Exact customer description (e.g., *"Bike cuts off power when accelerating uphill; speedometer shows Error Code 04"*).
* **Preliminary Visual Inspection Notes:** Pre-existing body scratches or damaged fairings.
* **Priority Level (Dropdown):** Low (Routine Tune-Up), Normal (Standard Repair), or High (Breakdown / VIP Fleet Customer).
* **Estimated Vehicle Return Date & Time:** Promised completion time.
* **Vehicle Photo Upload:** Up to 3 photos of physical damage or dashboard error codes.

---

### Q178: How does the system automatically verify warranty validity during intake?
**Answer:** The microsecond the vehicle VIN is selected, the system queries the national warranty database:
* If the delivery date was within the 2-year warranty window and mileage is under 30,000 km, a bright green badge appears: **`WARRANTY ACTIVE (14 Months Remaining)`**.
* If the warranty has expired, an amber badge appears: **`OUT OF WARRANTY (Standard Paid Rates Apply)`**.

---

### Q179: Can a customer open a service case if they purchased the bike from a different branch?
**Answer:** **Yes.** AJ EcoDrive operates a **Nationwide Warranty Network**. A customer who purchased their electric scooter in Islamabad can receive warranty maintenance at the Peshawar or Lahore service center without issue. The central warranty ledger links all branches.

---

### Q180: What does the customer receive upon leaving their bike at the workshop?
**Answer:** The service advisor prints a **Service Intake Claim Slip** with:
* Unique Service Case Number (e.g., `CAS-2026-0418`).
* Vehicle VIN, Make, Model, and Current Mileage.
* Documented Customer Complaints & Pre-Existing Scratch Notes.
* Promised Delivery Time and Service Advisor Contact Phone.

---

### Q181: How does the intake process protect the dealership from customer false damage claims?
**Answer:** The Service Intake Claim Slip includes a signed pre-inspection walk-around agreement. If a customer claims their front fender was cracked in the workshop, management refers to the signed intake slip and intake photos proving the scratch was present when the customer dropped off the bike.

---

### Q182: Can a service case be created while the workshop computer is offline?
**Answer:** Service Case Intake is **Category A: Fully Offline-Capable**. Intake records, odometer readings, and photos save locally to the workstation and sync to the cloud once connectivity resumes.

---

### Q183: How does the system prioritize emergency breakdown cases?
**Answer:** Marking a case as **High Priority** flags the job card with a pulsating red border on the workshop floor monitor, alerting the head mechanic to assign a technician immediately.

---

### Q184: What happens if an unregistered customer (third-party buyer) brings a bike for service?
**Answer:** The service advisor enters the chassis number. The system pulls the vehicle history and allows the advisor to register the new owner's contact details as the current primary operator.

---

### Q185: Can a technician start replacing parts before a Service Case is created?
**Answer:** **No.** The spare parts storekeeper cannot disburse parts from the parts inventory without an active Service Case ID. Every bolt, tyre, and controller must be charged against an authorized case.

---

### Q186: How does the system handle scheduled routine maintenance intervals?
**Answer:** The system tracks factory maintenance milestones:
* **1st Service (1,000 km):** Bolt torque check, brake fluid inspection, electrical harness check, free wash.
* **2nd Service (5,000 km):** Brake pad check, tyre rotation, steering head bearing lubrication, BMS health scan.
* **Annual Service (10,000 km):** Full multi-point electrical and mechanical diagnostic certification.

---

### Q187: Can a customer track their repair progress online?
**Answer:** Yes. The Service Intake Slip includes a QR tracking link. The customer can scan the code on their phone to see live status: *"In Diagnostics &rarr; Parts Awaiting &rarr; In Assembly &rarr; Quality Testing &rarr; Ready for Pickup"*.

---

### Q188: What happens if an open service case is abandoned by the customer?
**Answer:** If a vehicle remains unclaimed for more than 14 days after completion, the system flags the case as **Unclaimed Property** and generates automated legal reminder notices.

---
[Back to Top / Navigation Index](#dealership-owners-quick-navigation--executive-index)

---

# PART 14: Workshop Repair Execution & Mechanic Job Cards (Q189 – Q202)

### Q189: What is a Workshop Repair Job Card in AJ EcoDrive?
**Answer:** A Repair Job Card (`/workshop/jobs`) is the operational work order executed by the workshop mechanic. It tracks the diagnostic investigation, assigned technician hours, requisitioned spare parts, and final quality control testing.

---

### Q190: How does a mechanic receive and start a repair job?
**Answer:** The head mechanic reviews open service cases on the workshop terminal or mobile tablet and clicks **Assign Technician**. The assigned mechanic opens the digital Job Card, taps **Start Diagnostic Clock**, and begins testing the vehicle in the service bay.

---

### Q191: Modal Guide — What is the CreateRepairJobModal (`CreateRepairJob.vue`), and what are its exact fields?
**Answer:** The **`CreateRepairJobModal`** records repair execution and parts consumption:
* **Linked Service Case Reference (Required):** Selects active intake case.
* **Assigned Lead Technician (Required Dropdown):** Mechanic performing the work.
* **Service Bay Number:** Bay 1 (Quick Service), Bay 2 (Mechanical), Bay 3 (High-Voltage EV Specialist).
* **Diagnostic Findings & Fault Analysis:** Detailed technician report (e.g., *"BMS high-voltage cutoff triggered due to corroded wiring harness connector"*).
* **Spare Parts Requisition Table:** Multi-line table to add parts from branch inventory:
  - Part SKU & Description (e.g., `PRT-BRK-01: Front Ceramic Brake Pads`)
  - Quantity Used
  - Unit Price (PKR)
  - Warranty Coverage Toggle (100% Covered vs Customer Payable)
* **Technician Labor Hours & Labor Rate (PKR):** Billable workshop labor time.
* **Quality Control Inspection Checklist:** Multi-point post-repair certification.
* **Technician Certification Sign-off:** Digital signature confirming repair was completed according to OEM safety standards.

---

### Q192: How does the Job Card automatically deduct spare parts from branch inventory?
**Answer:** When the mechanic adds spare parts to the job card and clicks **Issue Parts**, the system instantly decrements the items from the branch's local spare parts inventory ledger. This prevents parts theft and keeps inventory counts 100% accurate.

---

### Q193: How does the system handle split billing between Warranty and Customer?
**Answer:** If a repair involves both warranty items and routine wear-and-tear:
* **Defective Smart Controller (Warranty):** Covered 100% by OEM Warranty &rarr; **Customer Cost = PKR 0**.
* **Worn Brake Pads (Wear-and-Tear Consumable):** Not covered by warranty &rarr; **Customer Cost = PKR 2,500**.
* **Technician Labor:** Covered under warranty policy &rarr; **Customer Cost = PKR 0**.
* **Total Customer Payable:** **PKR 2,500**.
The invoice cleanly distinguishes warranty coverage from paid customer items.

---

### Q194: What is the Post-Repair Quality Gate Inspection?
**Answer:** Before any vehicle is released to the customer, the Workshop Quality Supervisor must test-ride the vehicle and complete the **Quality Gate Checklist**:
1. Motor power delivery is smooth without hesitation.
2. Regenerative braking engages correctly.
3. All lighting, indicators, and horn operate reliably.
4. Fast charger connects and charges without tripping.
5. All body fairings are tightly secured.

---

### Q195: Can a mechanic close a job card without supervisor sign-off?
**Answer:** **No.** The system requires the Quality Supervisor's credentials to certify the Quality Gate. Uncertified job cards cannot be closed, and the vehicle cannot be released at the customer counter.

---

### Q196: How are workshop technician labor commissions tracked?
**Answer:** Each completed job card logs the assigned mechanic's ID and billable hours. The **Technician Productivity Report** calculates weekly bonuses based on completed jobs and first-time-fix rates.

---

### Q197: What happens if a required spare part is out of stock in the branch?
**Answer:** The mechanic taps **Requisition Part**. The system flags the job card as **Awaiting Parts** and generates an automated stock requisition to the central warehouse or initiates an urgent Inter-Branch Transfer.

---

### Q198: How does the workshop operate if the internet is down?
**Answer:** Repair Job logging is **Category A: Fully Offline-Capable**. Mechanics can log diagnostic findings, consume spare parts from local inventory, and complete jobs offline. The records synchronize to the central database once connectivity restores.

---

### Q199: How does the system prevent mechanics from hoarding new parts and reinstalling old ones?
**Answer:** For warranty replacements, the system enforces a **Scrap / Core Return Protocol**. To claim a new warranty part, the technician must scan the barcode of the old defective part and place it in the designated scrap return bin for Head Office audit.

---

### Q200: Can a customer request old replaced parts back?
**Answer:** For customer-paid repairs, customers are entitled to receive their old worn parts (e.g., old tyres or brake pads). The invoice includes a confirmation checkbox: *"Customer Received Replaced Parts"*.

---

### Q201: What happens if a vehicle returns with the exact same fault within 7 days?
**Answer:** The system flags the new service case with a red alert: **"REPEAT REPAIR / COMEBACK (Case #CAS-0418)"**. The Head Office service director is alerted to investigate technician competence or chronic component defects.

---

### Q202: What documentation does the customer receive upon collecting their repaired bike?
**Answer:** The customer receives a printed **Workshop Service Invoice & Warranty Certificate** itemizing all completed work, parts installed, warranty coverage amounts, customer payments, and the next recommended service date.

---
[Back to Top / Navigation Index](#dealership-owners-quick-navigation--executive-index)

---

# PART 15: Lithium Battery Warranties & BMS Diagnostics (Q203 – Q218)

### Q203: Why is lithium battery pack management the most critical technical domain in an EV dealership?
**Answer:** The lithium-ion battery pack represents **40% to 50% of the entire vehicle's value**. If battery warranties are mismanaged, fraudulent claims can bankrupt a dealership. Conversely, excellent battery support creates unmatched customer trust and brand loyalty.

---

### Q204: What battery chemistries are used in AJ EcoDrive electric vehicles?
**Answer:** The system supports two primary advanced lithium chemistries:
1. **Lithium Iron Phosphate (LFP / LiFePO4):** Ultra-safe chemistry with 2,000 to 3,000 charge cycles, ideal for daily commercial delivery trikes and heavy commuters.
2. **Nickel Manganese Cobalt (NMC / Ternary Lithium):** High energy density chemistry offering lightweight construction and superior acceleration for sporty commuter scooters.

---

### Q205: What is State of Health (SOH) vs State of Charge (SOC)?
**Answer:**
* **State of Charge (SOC %):** The temporary "fuel gauge" showing how much energy is currently stored in the battery (e.g., 85% full today).
* **State of Health (SOH %):** The permanent battery capacity health compared to when it was brand-new. A new battery has 100% SOH. Over 3 years of driving, SOH gradually declines to 88%, 80%, etc.

---

### Q206: What SOH threshold triggers an official manufacturer battery warranty replacement?
**Answer:** Under AJ EcoDrive warranty policy, if a battery pack's State of Health drops **below 70% within the 2-Year / 30,000 km warranty period**, the customer is legally entitled to a free warranty battery replacement or cell re-balancing.

---

### Q207: What is Cell Voltage Delta (mV), and why is it dangerous?
**Answer:** A 72V lithium battery pack contains 20 to 24 individual cell groups in series. Under healthy conditions, all cells charge and discharge at the exact same voltage.
* **Healthy Delta:** Less than **30 mV (0.03V)** difference between highest and lowest cell.
* **Warning Delta:** Between **50 mV and 100 mV**.
* **Defective / Critical Delta:** **Above 150 mV to 180 mV**. This indicates a dead cell block. The Smart BMS cuts off motor power prematurely to prevent thermal runaway or fire.

---

### Q208: What are On-Board Diagnostics (OBD) Trouble Codes (DTCs) in EV scooters?
**Answer:** The electronic motor controller and Smart BMS continuously monitor electrical parameters. When a fault occurs, the system logs standardized diagnostic trouble codes:
* `DTC-BMS-01`: High Cell Temperature Cutoff (>60°C).
* `DTC-BMS-02`: Low Temperature Charging Prohibited (<0°C).
* `DTC-BMS-03`: Cell Under-Voltage Deep Discharge (<2.5V).
* `DTC-BMS-04`: Excessive Cell Voltage Delta Imbalance (>180mV).
* `DTC-CTL-07`: MOSFET Over-Current Protection.
* `DTC-MTR-12`: Hall Sensor Communication Failure.

---

### Q209: What is the 3-Way Serialized Security Lock, and how does it stop fraudulent battery swapping?
**Answer:** A common scam in EV workshops involves a dishonest person swapping an old, degraded battery from a friend's bike into a newer bike to claim a free brand-new battery under warranty.
AJ EcoDrive eliminates this fraud with the **3-Way Hardware Lock**:
1. **Chassis Stamped VIN**
2. **Laser-Etched Battery Pack Serial Number**
3. **Smart BMS Controller Electronic MAC / Serial**

When a battery warranty claim is submitted, the technician must scan the physical battery barcode. If the battery serial does not match the original VIN delivery record in the central cloud, the system immediately **locks the claim and alerts management to suspected fraud**.

---

### Q210: How are high-voltage battery claims escalated to Head Office?
**Answer:** Any claim involving a lithium battery replacement (valued at PKR 120,000 to PKR 185,000) cannot be approved locally by showroom staff. The claim is automatically routed through the **Action Centre (Flow 4: Critical Warranty Claim)** for review by the Chief Technical Officer and OEM factory representative.

---

### Q211: What physical diagnostic evidence must be uploaded with a battery claim?
**Answer:**
1. High-resolution photo of the physical battery serial number label.
2. Photo of the battery terminal connectors showing no water ingress or tampering.
3. Digital multimeter readout showing overall pack voltage.
4. Screenshot of the BMS Diagnostic App showing individual cell voltages and SOH %.
5. Odometer mileage photo on the scooter dashboard.

---

### Q212: How does the system detect customer negligence (e.g., water submersion or physical impact)?
**Answer:** The technical intake checklist inspects:
* Internal moisture indicator stickers (turn red upon water immersion).
* Physical casing dents or road collision damage.
* Use of non-OEM fast chargers that burned the charging port.
If customer negligence is proven, the warranty claim is rejected, and a paid replacement quotation is provided.

---

### Q213: What happens when Head Office approves a battery warranty claim?
**Answer:**
1. The Action Centre releases an authorized **Warranty Replacement Part Issue Slip**.
2. A new, serialized battery pack is dispatched from the Central Warehouse to the branch.
3. The branch workshop installs the new pack, pairs the new serial number to the customer's chassis in the cloud, and marks the case resolved.

---

### Q214: What happens to the old defective battery pack?
**Answer:** Defective packs are hazardous materials. The system logs the pack into **Quarantine Bay Q-3** under status `Awaiting OEM Factory Return`. Defective packs are packed in fire-retardant crates and shipped back to the central factory for recycling or cell recovery.

---

### Q215: Can a battery claim be submitted if the vehicle was serviced at an unauthorized roadside shop?
**Answer:** AJ EcoDrive terms state that opening the battery casing or modifying the wiring harness at an unauthorized roadside mechanic voids the electrical warranty. The technician notes any broken warranty tamper seals on the intake record.

---

### Q216: How does the system help customers maximize battery lifespan?
**Answer:** The system automatically sends automated seasonal battery care advisories via WhatsApp:
* Summer: *"Avoid charging immediately after long uphill rides in 45°C heat; allow battery to cool for 30 minutes."*
* Winter: *"Charge battery indoors during cold winter nights to maintain optimal charging speed."*

---

### Q217: Does the system track battery warranty claims across different battery cell manufacturers?
**Answer:** Yes. The Super Admin Reliability Dashboard analyzes failure rates by battery supplier (e.g., CATL vs Gotion vs EVE cells), providing crucial leverage during annual factory procurement negotiations.

---

### Q218: Can a customer purchase an Extended Battery Warranty?
**Answer:** Yes. The system supports a **3rd-Year Extended Battery Warranty Add-On** (PKR 18,500), which can be added to the original sales order or purchased before the standard 2-year warranty expires.

---
[Back to Top / Navigation Index](#dealership-owners-quick-navigation--executive-index)

---

# PART 16: Vehicle Cancellations, Returns & Customer Refund Settlement (Q219 – Q232)

### Q219: What constitutes an official Vehicle Return or Order Cancellation in AJ EcoDrive?
**Answer:** A Vehicle Return occurs when a customer cancels an undelivered booking, or returns a physically delivered electric vehicle due to an unresolvable factory defect, legal consumer right, or an authorized management buy-back agreement.

---

### Q220: What are the two types of vehicle returns?
**Answer:**
1. **Pre-Delivery Booking Cancellation:** Customer paid a deposit on a reserved bike, but cancels before taking physical delivery.
2. **Post-Delivery Vehicle Return:** Customer took physical delivery, drove the vehicle on public roads, and returns it within the authorized return window.

---

### Q221: What is the 10-Point Technical Return Inspection?
**Answer:** For post-delivery returns, the workshop supervisor must complete the rigorous **10-Point Return Inspection**:
1. **Chassis & Frame Alignment:** Verifies no structural bend from road accidents.
2. **Battery Pack Serial & Casing:** Matches delivery serial number; confirms no casing damage.
3. **BMS Diagnostic Scan:** Confirms healthy cell voltages and zero active short-circuit DTCs.
4. **Motor Hub & Rim Condition:** Verifies motor operates silently without wheel rim dents.
5. **Odometer Reading:** Records total kilometers driven since delivery.
6. **Body Fairings & Paintwork:** Inspects for scratches, cracks, or repainted panels.
7. **Tyre Tread Depth:** Evaluates tyre wear and tear.
8. **Braking & Suspension:** Tests disc calipers, brake pads, and front shock absorber seals.
9. **Accessories & Documentation:** Verifies return of 2 keys, 2 remotes, smart charger, and toolkit.
10. **Excise Registration Status:** Checks whether government registration papers have been filed.

---

### Q222: How is the Customer Refund calculated on returned vehicles?
**Answer:** The system calculates the net refund using an automated financial formula:
$$\text{Net Refund} = \text{Total Customer Payments Received} - \text{Usage Mileage Depreciation} - \text{Physical Damage Deductions} - \text{Administrative Fee}$$
* If the bike was driven 350 km and has a scratched side mirror (PKR 2,500 repair), the system deducts the wear-and-tear costs and outputs the precise net refundable amount.

---

### Q223: Modal Guide — What is the CreateReturnModal (`CreateReturn.vue`), and what are its exact fields?
**Answer:** The **`CreateReturnModal`** governs returns and customer refund settlement:
* **Showroom Branch (Auto-Locked):** Branch processing the return.
* **Original Sales Order / Invoice Reference (Required):** Selects original transaction.
* **Customer Legal Name & CNIC (Auto-Populated):** Verified buyer.
* **Vehicle Chassis / VIN Number (Auto-Populated):** The physical unit being returned.
* **Return Category (Dropdown):** Pre-Delivery Cancellation, Major Manufacturer Defect, Customer Remorse / Cooling-Off Period, or Authorized Buy-Back.
* **Return Reason & Detailed Description (Required):** Justification narrative.
* **Vehicle Physical Condition Grade (Dropdown):** Grade A (Like New / Mint), Grade B (Minor Cosmetic Scratches), Grade C (Mechanical Fault / Defective), Grade D (Accident Damage).
* **Current Odometer Mileage (km):** Mileage driven.
* **Total Customer Paid to Date (PKR - Locked):** Historical money collected.
* **Deductions for Mileage & Wear-and-Tear (PKR Input):** Usage penalty.
* **Deductions for Damaged Parts / Repairs (PKR Input):** Physical repair cost.
* **Administrative & Restocking Processing Fee (PKR Input):** Handling charge.
* **Net Refund Payable to Customer (PKR - Bold Calculated):** Final payout amount.
* **Refund Payment Channel:** Bank Transfer (IBFT) from Corporate Account or Cash Drawer Payout.
* **Return Stock Destination (Radio Selection):**
  - *Restock to Available Floor Stock* (for mint condition / cancelled orders).
  - *Move to Quarantine Bay Q-3* (for defective units requiring factory repair).

---

### Q224: Who has the authority to approve a customer vehicle return?
**Answer:** Because returns involve vehicle title changes and significant cash refunds, **Branch Managers cannot unilaterally issue refunds**. Submitting `CreateReturnModal` routes the dossier into the **Action Centre (Flow 5: Inventory Governance)** for joint approval by the National Sales Director and Chief Financial Officer.

---

### Q225: What happens to the customer's legal ownership and warranty upon return?
**Answer:** The microsecond Head Office approves the return:
1. The vehicle lifecycle status updates to `Available` (if restocked) or `Quarantine` (if defective).
2. The active 2-year warranty certificate is officially revoked and deactivated in the cloud.
3. The customer's invoice balance is credited with an official **Credit Note**.

---

### Q226: How does the system handle excise registration if the bike was already registered with the government?
**Answer:** If the excise registration book has already been issued in the customer's name, the vehicle cannot be restocked as a brand-new bike. The system automatically classifies the unit as **Certified Pre-Owned (CPO) / Dealership Demo Unit** and requires a formal title transfer through the excise department.

---

### Q227: What happens to a salesperson's sales commission when a sale is returned?
**Answer:** The system automatically reverses the sales commission previously credited to the sales executive, ensuring company financial statements remain accurate.

---

### Q228: How is the customer refund paid out safely?
**Answer:** Company policy strongly discourages large cash payouts from the showroom drawer. Refunds exceeding PKR 25,000 are disbursed via direct **Inter-Bank Funds Transfer (IBFT)** from the Head Office corporate bank account directly into the customer's verified bank account.

---

### Q229: What happens if a customer returns a bike with missing accessories (e.g., lost smart fast charger)?
**Answer:** The system deducts the retail replacement cost of the missing accessory (e.g., PKR 12,000 for a 72V Smart Charger) from the net refund balance.

---

### Q230: Can a returned vehicle be sold to another customer at full brand-new list price?
**Answer:** Only if the vehicle was cancelled prior to delivery and has 0 km on the odometer. If the vehicle was driven on public roads, policy mandates that it be sold at an approved Certified Pre-Owned discount.

---

### Q231: How does the system document the customer's acceptance of the net refund?
**Answer:** The system generates an official **Settlement & Release Agreement**. The customer signs the document confirming they have received full settlement and relinquish all legal claims to the vehicle.

---

### Q232: Can a completed return record be deleted from the database?
**Answer:** **No.** All return and refund records are permanently archived with associated financial credit notes, audit logs, and inspection sheets for annual tax auditing.


---
[Back to Top / Navigation Index](#dealership-owners-quick-navigation--executive-index)

---

# SECTION V: SHOWROOM INVENTORY, TRANSFERS & QUALITY CONTROL

---

# PART 17: Showroom Inventory & Serialized Unit Management (Q233 – Q246)

### Q233: How does AJ EcoDrive track showroom inventory differently from a retail store?
**Answer:** In a standard grocery or clothing store, inventory is tracked by simple quantities (e.g., *"50 blue shirts"*). In an electric motorbike dealership, **every single vehicle is an individual serialized asset tracked by its unique stamped VIN (Chassis Number)**. The system never just tracks "10 electric scooters"; it tracks 10 distinct, individually serialized machines with their specific frame numbers, battery serials, motor numbers, and production dates.

---

### Q234: What is the difference between Local Showroom Stock and National Network Stock?
**Answer:**
* **Local Showroom Stock:** Vehicles physically present on the showroom floor or warehouse of that specific branch (e.g., Peshawar). Branch staff can directly inspect, test-ride, and sell these units immediately.
* **National Network Stock:** Complete nationwide visibility showing all vehicles across Islamabad, Lahore, Rawalpindi, and the Central Port Warehouse. Branch staff can see that Islamabad has an Emerald Green bike in stock, but they cannot sell it without an approved Inter-Branch Transfer.

---

### Q235: How does the system prevent a salesperson in Peshawar from accidentally selling a bike in Islamabad?
**Answer:** AJ EcoDrive enforces **Strict Branch Custody Isolation**. When staff open the sales or quotation screens in Peshawar, the chassis selection dropdown strictly displays VINs that have been physically received and confirmed in Peshawar's local inventory database. Islamabad's inventory is physically locked and inaccessible to Peshawar's Point of Sale terminal.

---

### Q236: What lifecycle states can an individual vehicle chassis have in the inventory ledger?
**Answer:** Every chassis VIN is in exactly one of these 7 states at any given moment:
1. **Available (Green Badge):** Inspected, charged, and sitting on the showroom floor ready for purchase.
2. **Reserved (Blue Badge):** Customer has confirmed a sales order and placed a deposit; locked against other buyers.
3. **Sold / Invoicing Complete (Purple Badge):** Fully paid; vehicle assigned to workshop for Pre-Delivery Inspection (PDI).
4. **Delivered / Customer Owned (Dark Grey Badge):** Handed over to customer with official Gate Pass; removed from floor stock.
5. **In-Transit (Amber Pulsating Badge):** Loaded on a logistics carrier truck traveling between branches; in dual-custody hold.
6. **In Service / Maintenance (Cyan Badge):** In workshop for routine maintenance or repair.
7. **Quarantine / QC Hold (Red Badge):** Isolated in physical Bay Q-3 due to transit scratches, factory defect, or battery fault.

---

### Q237: Can a bike be in two places at once in the system?
**Answer:** **No, mathematically impossible.** The chassis VIN is a unique database primary key. It can only occupy one physical location (Branch ID or In-Transit Carrier ID) at any microsecond.

---

### Q238: How do staff use barcode and QR code scanners on the showroom floor?
**Answer:** Every vehicle arriving at the showroom is tagged with a weather-proof **Showroom Inventory QR Tag** affixed to the handlebar. Staff walking the floor with an Android tablet or wireless handheld barcode scanner can scan the tag to instantly view:
* Chassis VIN, Motor Serial, and Battery Pack ID.
* Manufacture Date, Color, and Catalogue List Price.
* Real-time Status (Available, Reserved for Salman Khan, etc.).

---

### Q239: How does the system handle display demo units used for showroom test drives?
**Answer:** Dealerships designate specific vehicles as **Showroom Demo Units**. The Branch Manager flags the VIN as `Demo / Test Ride Asset`. The system removes it from the sellable inventory pool and tracks test-ride mileage and battery charging cycles separately.

---

### Q240: What happens if an unauthorized person attempts to tamper with a chassis number in the database?
**Answer:** Chassis VINs are immutable database records. Once created during container intake, the VIN string cannot be edited by any branch staff. Any VIN modification requires Super Admin database authorization with mandatory audit logging.

---

### Q241: Can the system alert management when floor stock runs dangerously low?
**Answer:** Yes. Every branch defines a **Minimum Floor Stock Threshold** (e.g., minimum 5 commuter scooters and 2 cargo trikes). When active inventory drops below this threshold, the system displays an amber warning banner and prompts the manager to generate a Stock Replenishment Request.

---

### Q242: How does the system track non-serialized spare parts in the branch store?
**Answer:** Spare parts (tubeless tyres, brake pads, LED indicators, throttles) are tracked by SKU code, physical bin location (e.g., *Shelf B, Bin 04*), minimum reorder level, and real-time piece count.

---

### Q243: How does the system manage battery storage maintenance for unsold showroom bikes?
**Answer:** Lithium batteries slowly self-discharge over months of storage. The system features an **Unsold Battery Maintenance Schedule**. If a showroom bike sits unsold for more than 45 days, the system prompts workshop staff to connect it to a slow charger and top up the battery to 60%–70% storage SOC to prevent cell degradation.

---

### Q244: What happens if a showroom bike is damaged by a customer during a showroom visit?
**Answer:** Staff immediately change the vehicle's status to **Quarantine (Bay Q-3)**, log an Incident Report with photos of the damaged panel, and generate a workshop repair order to restore the vehicle before returning it to the showroom floor.

---

### Q245: Can an investor or board member view total company-wide inventory valuation?
**Answer:** Yes. The Executive Inventory Dashboard calculates the live **Total Fleet Valuation (PKR)** across all cities, broken down by Model, Status, and Showroom Location.

---

### Q246: How does Showroom Inventory operate during internet outages?
**Answer:** Showroom Inventory is **Category A: Fully Offline-Capable**. Local inventory queries, barcode scans, and status checks execute against the local workstation database with zero latency.

---
[Back to Top / Navigation Index](#dealership-owners-quick-navigation--executive-index)

---

# PART 18: Showroom Stock Replenishment Requisitions (Q247 – Q258)

### Q247: What is a Showroom Stock Replenishment Requisition?
**Answer:** A Stock Requisition (`/inventory/requisitions`) is an official internal order submitted by a Branch Manager requesting additional electric vehicles or spare parts from the Head Office Central Port Warehouse or manufacturing hub.

---

### Q248: Why do showrooms need a formal requisition process instead of just calling Head Office?
**Answer:** Phone calls and WhatsApp messages result in lost requests, forgotten color preferences, and lack of accountability. A digital requisition in AJ EcoDrive establishes a clear audit trail: who requested what, on what date, for what business reason, and who authorized the dispatch.

---

### Q249: What triggers a Stock Replenishment Requisition?
**Answer:**
1. **Low Stock Threshold Alert:** Showroom floor stock falls below minimum safety levels.
2. **Locked Customer Sales Order:** A walk-in customer places a deposit on a specific color or model variant not currently in local stock.
3. **Upcoming Promotional Event:** Anticipated surge in demand for an upcoming holiday or corporate exhibition.

---

### Q250: Modal Guide — What is the CreateStockRequestModal (`CreateStockRequest.vue`), and what are its exact fields?
**Answer:** The **`CreateStockRequestModal`** is the formal replenishment order screen:
* **Requesting Showroom Branch (Auto-Locked):** Identifies requesting location.
* **Target Delivery Date (Required):** Date by which vehicles must arrive on showroom floor.
* **Urgency Priority Level (Dropdown):**
  - *Low:* Routine monthly stock top-up.
  - *Normal:* Standard weekly replenishment.
  - *Critical / Stock-Out:* Immediate showroom stock-out or locked customer cash deposit waiting.
* **Product Catalog Selector (Required Dropdown):** Selects model SKU (e.g., BRG E-125 Commuter).
* **Color Variant Selection:** Specific color requested (e.g., Pearl White).
* **Requested Quantity (Units):** Number of vehicles requested.
* **Current Local Stock Level (Auto-Populated):** Shows how many units the branch currently holds.
* **Linked Customer Sales Order (Optional):** Attaches customer deposit reference if ordering for an eager buyer.
* **Business Justification & Market Notes:** Explains reason for demand (e.g., *"Customer paid 50% deposit on white scooter; traveling in 5 days"*).

---

### Q251: How does Head Office review and approve Stock Requisitions?
**Answer:** Stock Requisitions route directly to the **Action Centre (Flow 2: Inter-Branch Stock Reallocation)** or the Central Logistics Supply Chain queue. The National Supply Chain Manager reviews available warehouse stock, checks inbound container shipping manifests, and approves the allocation.

---

### Q252: What happens if the requested model is completely out of stock nationwide?
**Answer:** Head Office updates the requisition status to **Backordered / In-Transit Container**. The branch receives an estimated arrival date based on the customs clearance schedule of the next sea-freight container arriving at Karachi port.

---

### Q253: Can a Branch Manager edit a requisition after it has been approved by Head Office?
**Answer:** No. Once approved, the requisition is locked and transferred to the warehouse picking team to prepare the physical vehicles and generate carrier transit manifests.

---

### Q254: What is the lifecycle of a Stock Requisition?
**Answer:** A requisition moves through 5 clear stages:
* **Draft / Submitted:** Created by branch; awaiting Head Office review.
* **Approved:** Authorized by supply chain management; allocation confirmed.
* **In Fulfillment / Picking:** Central warehouse staff selecting and inspecting specific chassis VINs.
* **Dispatched (In-Transit):** Loaded on logistics carrier truck with official Transfer Manifest.
* **Received & Completed:** Arrived at branch; physical VINs scanned and added to floor stock.

---

### Q255: Can a branch requisition spare parts and complete vehicles on the same form?
**Answer:** The system provides dedicated requisitions for **Complete Vehicles (CBU Units)** and **Spare Parts & Consumables**, ensuring spare parts route directly to the parts distribution manager.

---

### Q256: How does the system handle urgent stock requests for VIP or fleet buyers?
**Answer:** Marking a request as **Critical / Stock-Out** triggers high-priority alerts on Head Office executive dashboards, enabling directors to redirect transit containers or prioritize carrier truck dispatches.

---

### Q257: How does Stock Requisition operate when the branch is offline?
**Answer:** Stock Requisition is **Category B: Restricted Offline-Capable**. The branch can prepare and save the requisition locally. It queues in the Outbox and transmits automatically upon internet reconnection.

---

### Q258: Does the system track seasonal demand trends to help managers forecast requisitions?
**Answer:** Yes. The Sales Intelligence dashboard shows 12-month historical sales trends, highlighting peak demand months (e.g., post-Eid bonuses or college reopening seasons).

---
[Back to Top / Navigation Index](#dealership-owners-quick-navigation--executive-index)

---

# PART 19: Inter-Branch Stock Transfers & In-Transit Custody (Q259 – Q272)

### Q259: What is an Inter-Branch Stock Transfer in AJ EcoDrive?
**Answer:** An Inter-Branch Stock Transfer (`/inventory/transfers`) is the authorized physical and legal relocation of electric vehicles or spare parts from one dealership location to another (e.g., moving 3 scooters from the Lahore Central Hub to the Islamabad Showroom).

---

### Q260: What is the "In-Transit Dual-Custody State", and why is it crucial for asset protection?
**Answer:** Moving high-value electric vehicles between cities via third-party flatbed trucks or logistics carriers presents significant theft and damage risks. AJ EcoDrive solves this with the **In-Transit Dual-Custody Protocol**:
1. **Origin Exit:** When the dispatching branch clicks *Dispatch*, the specific chassis VINs are immediately removed from origin showroom stock. They **cannot be sold in Lahore**.
2. **In-Transit Hold:** The vehicles enter the `In-Transit` state. They are assigned to the carrier truck and driver. They **cannot be sold in Islamabad** yet, because they are physically traveling on the motorway.
3. **Destination Intake:** Only when the receiving branch physically inspects and scans each chassis barcode does the system add the vehicles to Islamabad's active, sellable floor stock.
This ensures zero inventory "floats in thin air" or gets double-sold while loaded on a truck.

---

### Q261: Who pays for the transportation freight charges between branches?
**Answer:** The transfer record specifies the **Freight Billing Entity**: Origin Branch, Destination Branch, or Central Marketing / Logistics Head Office overhead.

---

### Q262: Modal Guide — What is the CreateTransferModal (`CreateTransfer.vue`), and what are its exact fields?
**Answer:** The **`CreateTransferModal`** initiates and documents inter-city vehicle dispatch:
* **Origin Showroom Branch (Auto-Locked):** Dispatching location.
* **Destination Showroom Branch (Required Dropdown):** Receiving location (e.g., Islamabad Showroom).
* **Specific Chassis / VIN Multi-Selector (Required):** Search and select exact VINs from available local floor stock.
* **Selected Vehicle Summary Display:** Shows Model, Color, VIN, and Battery Serial for each chosen unit.
* **Logistics Carrier / Transport Company (Required):** Third-party logistics vendor (e.g., *Daewoo Express Cargo, TCS Freight, or Private Truck Fleet*).
* **Driver Full Name (Required):** Legal name of the carrier truck driver.
* **Driver Pakistani CNIC (Required):** 13-digit validated CNIC format for security verification.
* **Driver Mobile Phone (Required):** Direct contact number for en-route tracking.
* **Carrier Truck Registration Number (Required):** Vehicle registration plate (e.g., `LES-2024-8912`).
* **Expected Arrival Date & Time (Required):** Scheduled delivery window at destination.
* **Dispatch Inspection Notes & Bill of Lading Reference:** Notes on tie-down straps, protective foam wrapping, and transport bilti serial.
* **Generate Dispatch Gate Pass Button:** Prints official logistics gate pass.

---

### Q263: What security document is handed to the truck driver upon departure?
**Answer:** The dispatching branch prints the official **Inter-Branch Transit Gate Pass & Shipping Manifest (Bilti)**. The driver carries this document across provincial checkpoints. It lists:
* Stamped chassis numbers, motor numbers, and battery serials of all loaded bikes.
* Dispatching and receiving branch addresses and emergency manager phone numbers.
* Driver name, CNIC, and truck license plate.
* Anti-theft verification QR code.

---

### Q264: Can a salesperson sell a vehicle while it is marked "In-Transit"?
**Answer:** **No.** The system hard-blocks sales of In-Transit vehicles. If an eager Islamabad customer wants to buy an In-Transit bike, staff can place a conditional reservation, but the system prevents invoicing and delivery until the bike arrives and is scanned in Islamabad.

---

### Q265: What happens if a truck breaks down on the motorway between Lahore and Islamabad?
**Answer:** The logistics coordinator updates the transfer record with an **En-Route Transit Delay Notice**. The estimated arrival time updates automatically across both branch dashboards, keeping sales staff informed.

---

### Q266: What happens if an accident occurs during transport?
**Answer:** The driver or carrier files an immediate incident report. The transfer record is updated with police reports and carrier insurance details. Any damaged vehicles are routed directly to **Quarantine (Bay Q-3)** upon arrival rather than showroom stock.

---

### Q267: Can a Branch Manager dispatch a transfer without Head Office approval?
**Answer:** Transfers requested via the Action Centre require prior Head Office authorization. For routine transfers within pre-authorized branch redistribution quotas, the dispatching branch manager can sign off directly.

---

### Q268: How does the system prevent a branch from dispatching a bike reserved for a local customer?
**Answer:** The VIN multi-selector strictly excludes vehicles with status = `Reserved` or `Sold`. Only bikes marked as `Available` can be selected for transfer.

---

### Q269: How are spare parts transferred between branches?
**Answer:** The transfer modal includes a **Spare Parts Transfer** tab, allowing branches to ship brake pads, chargers, and controllers between cities using the same carrier tracking protocols.

---

### Q270: How does Inter-Branch Transfer operate if the branch loses internet access?
**Answer:** Initiating an Inter-Branch Transfer is **Category C: Online-Required**. Because moving stock between cities affects the national inventory balance, central server verification is required to lock the VINs across the network and prevent split-brain inventory conflicts.

---

### Q271: Can a transfer be cancelled after the truck has departed?
**Answer:** No. Once the status changes to `In-Transit`, the transfer cannot be cancelled. If the shipment must return, it must be received at the destination and an opposite return transfer initiated.

---

### Q272: Does the system track carrier transport performance?
**Answer:** Yes. The Logistics Analytics dashboard evaluates carrier vendors by on-time delivery percentage and zero-damage transit rates, helping management select reliable freight partners.

---
[Back to Top / Navigation Index](#dealership-owners-quick-navigation--executive-index)

---

# PART 20: Inbound Delivery Receiving & Transit Discrepancies (Q273 – Q286)

### Q273: What is the Inbound Delivery Receiving process?
**Answer:** Inbound Delivery Receiving (`/inventory/transfers/inbound`) is the physical inspection and digital intake procedure when a carrier transport truck arrives at the destination showroom with a shipment of electric vehicles.

---

### Q274: What is the step-by-step physical receiving protocol?
**Answer:**
1. **Truck Arrival & Document Verification:** Manager meets the carrier driver, inspects the physical Bilti / Transit Gate Pass, and matches the driver's CNIC and truck license plate.
2. **Unloading to Receiving Bay:** Bikes are carefully rolled off the transport truck into the branch staging bay.
3. **Chassis Barcode Scanning:** Staff scan the stamped VIN barcode on each bike's headstock tube.
4. **Physical Condition Inspection:** Inspect paintwork, mirrors, battery compartment, and instrument console for transit damage.
5. **Digital Confirmation:** Staff submit the receiving form. Confirmed bikes immediately join active showroom inventory.

---

### Q275: Modal Guide — What is the ReceiveTransferModal (`ReceiveTransfer.vue`), and what are its exact fields?
**Answer:** The **`ReceiveTransferModal`** verifies and commits inbound stock:
* **Transfer Manifest Reference Selector:** Selects pending inbound transfer.
* **Carrier Logistics Vendor & Driver Information (Displayed):** For identity matching.
* **Manifest Expected VINs vs Scanned VINs Table:**
  - Lists every vehicle shipped on the manifest.
  - Interactive barcode scan box: Staff scan each physical VIN; table turns green as each match is confirmed.
* **Physical Condition Assessment Checkboxes (per vehicle):**
  - Paint & Fairings: Clean / Minor Scratch / Heavily Dented.
  - Electrical & Power On: Battery connects; LCD meter powers on.
  - Accessories Checklist: 2 Keys, 2 Remotes, Charger Present.
* **Discrepancy Reporting Section:**
  - Checkbox: *"Report Damage / Missing Items for Carrier Claim"*.
  - Discrepancy Type: Missing Vehicle, Physical Scratch/Dent, Broken Mirror, Missing Charger, Wrong Chassis Received.
  - Photo Evidence Upload: Mandatory photo of damage or scratched panel.
* **Receiving Officer Digital Sign-off:** Staff member accepting physical custody.
* **Stock Inward Commitment Button:** Moves accepted units to active showroom stock.

---

### Q276: What is a "Transit Discrepancy"?
**Answer:** A Transit Discrepancy occurs when the physical vehicles unloaded from the truck do not perfectly match the shipping manifest:
* A bike is missing from the truck.
* A vehicle has deep paint scratches or cracked fairings from improper tie-down straps.
* Side mirrors or charger cables were stolen en route.
* A different chassis VIN was delivered by mistake.

---

### Q277: How does AJ EcoDrive handle transit damage during receiving?
**Answer:** When staff report damage on a vehicle during receiving:
1. The undamaged vehicles are accepted and moved to **Available Floor Stock**.
2. The damaged vehicle is automatically routed to **Quarantine (Bay Q-3)**.
3. The system generates an official **Transit Damage & Insurance Claim Docket** containing high-resolution photos, repair cost estimates, and driver CNIC details.
4. The freight carrier is billed for the repair or part replacement costs.

---

### Q278: What happens if a chassis VIN delivered does not match any VIN on the manifest?
**Answer:** The system flags the unit as an **"Unmanifested Alien Vehicle"**. The bike cannot be added to showroom stock. It is held in the staging bay, and an automated alert is sent to Head Office logistics to trace which branch dispatched the wrong unit.

---

### Q279: Can a receiving officer confirm receiving without scanning the physical barcodes?
**Answer:** System policy requires barcode scanning to eliminate human error and "blind rubber-stamping". Counter staff must scan the barcode on the physical headstock or manually type the full 17-character VIN.

---

### Q280: What does the truck driver receive as proof of successful delivery?
**Answer:** The system prints an official **Goods Received Note (GRN) / Delivery Acknowledgment Receipt**. The receiving manager signs and stamps the driver's copy, certifying that the vehicles were received in good condition (or noting documented transit damage).

---

### Q281: What happens if a shipment arrives after hours when the showroom is closed?
**Answer:** If delivery occurs after 08:00 PM, the night security guard checks the vehicle into the secure showroom yard, signs the temporary carrier night drop slip, and locks the gates. Full technical intake and system scanning are completed at 08:30 AM the next morning.

---

### Q282: How does Inbound Receiving operate if the showroom is temporarily offline?
**Answer:** Inbound Receiving is **Category B: Restricted Offline-Capable**. Staff can verify physical chassis numbers against a locally cached copy of the transfer manifest. The stock updates locally and commits to central inventory when connectivity resumes.

---

### Q283: Who has the authority to sign off on carrier damage settlement claims?
**Answer:** Damage settlement dockets route to the **Action Centre (Flow 5: Inventory Governance)** for review by the National Logistics Director and corporate legal counsel.

---

### Q284: What happens if all bikes on the manifest arrive in flawless condition?
**Answer:** Staff click **Accept Full Delivery (Zero Discrepancies)**. All units instantly transition to `Available`, the transfer manifest closes with a 100% perfect quality rating, and the carrier's on-time scorecard is updated.

---

### Q285: Can a receiving record be edited after it has been finalized?
**Answer:** No. Once the Goods Received Note is generated, the record is permanently locked to prevent retroactively fabricating damage claims against freight carriers.

---

### Q286: Does the system alert sales staff when an eagerly awaited customer bike arrives?
**Answer:** Yes. If a received VIN was linked to a waiting customer Sales Order, the system immediately pops up a notification: *"Reserved Vehicle Arrived: Call Customer Salman Khan to Schedule Delivery."*

---
[Back to Top / Navigation Index](#dealership-owners-quick-navigation--executive-index)

---

# PART 21: Blind Physical Cycle Counts & Inventory Audits (Q287 – Q300)

### Q287: What is a "Blind Physical Cycle Count" in AJ EcoDrive?
**Answer:** A Blind Cycle Count (`/inventory/audits`) is a physical inventory audit where staff conduct a hands-on physical count of all vehicles and parts on the showroom floor **without the system revealing how many units it expects to find**.

---

### Q288: Why does the system keep the expected count "blind" from branch staff?
**Answer:** If staff know the computer expects 18 scooters, a dishonest or lazy employee will simply count 18 on paper without checking if the bikes on the floor are the correct chassis numbers, or without noticing that one bike was secretly swapped or stolen. A blind audit forces staff to physically inspect and scan every single machine on the floor.

---

### Q289: How often are physical cycle counts conducted in an EV showroom?
**Answer:** Dealership operating standards mandate:
* **Weekly Quick Scan:** 10-minute floor count of complete serialized electric bikes.
* **Monthly Full Audit:** Complete blind count of all bikes, lithium battery storage packs, and high-value spare parts.
* **Annual Comprehensive Audit:** Full network-wide stocktake conducted under supervision of external corporate auditors.

---

### Q290: Modal Guide — What is the CreateCycleCountModal (`CreateCycleCount.vue`), and what are its exact fields?
**Answer:** The **`CreateCycleCountModal`** initiates and logs a physical stock audit:
* **Showroom Branch (Auto-Locked):** Branch being audited.
* **Audit Execution Date:** Defaults to current date.
* **Audit Scope / Category (Dropdown):** Complete Showroom Floor Bikes, Battery Pack Storage Room, or Workshop Spare Parts.
* **Lead Auditor Name (Required):** Staff member or visiting auditor conducting count.
* **Physical Barcode Scanning Box (Interactive):** Staff walk the floor and scan each vehicle's chassis QR tag.
* **Scanned Physical Units List:** Shows scanned VINs with timestamps.
* **Auditor Inspection Observations:** Notes on floor cleanliness, battery charging status, or storage conditions.
* **Submit Blind Audit Button:** Submits the physical scan list to the central comparison engine.

---

### Q291: What happens the microsecond the Blind Count is submitted?
**Answer:** The central system performs an automated **Variance Comparison**:
$$\text{Variance} = \text{Physical Scanned Count} - \text{System Expected Ledger}$$
* **Perfect Match (Variance = 0):** Audit passes with 100% accuracy.
* **Negative Variance (Missing Units):** System expected 20 bikes, but staff only scanned 19.
* **Positive Variance (Surplus / Unaccounted Units):** Staff scanned a bike not registered in the branch ledger.

---

### Q292: What immediate security action occurs if a vehicle is missing during an audit?
**Answer:** The system automatically flags the missing chassis VIN with a **CRITICAL AUDIT LOCK**. The missing VIN is blocked from being sold, transferred, or serviced at any dealership branch nationwide, and an immediate red alert is dispatched to the National Internal Audit Director.

---

### Q293: Modal Guide — What is the CreateAdjustmentRequestModal (`CreateAdjustmentRequest.vue`), and what are its exact fields?
**Answer:** When an audit reveals discrepancies, the manager submits an **Adjustment Request**:
* **Linked Cycle Count Reference (Required):** Selects audit docket.
* **Discrepancy Variance Table:** Itemizes missing, found, or damaged items.
* **Root Cause Investigation Findings (Required):** Explains what happened (e.g., *"VIN-0812 was mistakenly placed in workshop paint booth and missed during initial scan"*).
* **Proposed Inventory Adjustment:** Write-off, found inventory reinstatement, or transfer re-allocation.
* **Financial Value Impact (PKR):** Monetary cost of the variance.
* **Branch Manager Justification & Explanation:** Formal statement.
* **Route to Action Centre (Flow 5) Button:** Forwards to Head Office executive committee.

---

### Q294: Who has the authority to write off a missing electric bike?
**Answer:** **Branch Managers have zero authority to write off inventory.** Writing off a missing vehicle (valued at PKR 200,000 to PKR 350,000) requires formal investigation and joint written sign-off by the Chief Executive Officer (CEO) and Chief Financial Officer (CFO) in the Action Centre.

---

### Q295: What happens if a "missing" bike is found three days later?
**Answer:** Staff file an **Inventory Reinstatement Docket**. The auditor scans the recovered chassis number, inspects the vehicle for physical integrity, and Head Office removes the audit security lock.

---

### Q296: How does the system prevent staff from borrowing bikes overnight for personal use?
**Answer:** Unannounced random cycle counts can be triggered remotely by Head Office at 08:30 AM. If a bike is missing from the morning scan because an employee took it home overnight, the discrepancy is immediately caught and logged as unauthorized vehicle removal.

---

### Q297: Can cycle counts be conducted when the showroom is offline?
**Answer:** Yes. Physical scanning is **Category A: Fully Offline-Capable**. Staff can scan floor barcodes locally. When the workstation reconnects to the network, the scan batch uploads and generates the comparison report.

---

### Q298: Does the system track which employees conducted each audit?
**Answer:** Yes. The lead auditor's name, user credentials, and exact scan timestamps are permanently embedded in the audit docket.

---

### Q299: What is the "Ghost Bike" prevention safeguard?
**Answer:** A "ghost bike" is a vehicle that physically exists on the floor but is missing from the system (or vice versa). By matching physical chassis numbers against cloud records during monthly cycle counts, ghost inventory is eliminated.

---

### Q300: Are physical audit records shared with external tax authorities?
**Answer:** Yes. Annual cycle count reconciliation certificates are formatted to standard international accounting standards (IFRS) for inclusion in corporate audited financial statements.

---
[Back to Top / Navigation Index](#dealership-owners-quick-navigation--executive-index)

---

# PART 22: Quality Quarantine & Defective Stock Isolation (Q301 – Q314)

### Q301: What is Quality Quarantine in an EV dealership?
**Answer:** Quality Quarantine is the strict physical and digital isolation of any electric vehicle, lithium battery pack, or spare part that is damaged, defective, or failing safety standards, preventing it from being sold, delivered, or installed on a customer's bike.

---

### Q302: What is "Physical Bay Q-3"?
**Answer:** In every AJ EcoDrive showroom and workshop, a designated 150-square-foot secure floor area with high-visibility yellow floor markings and lockable chain barriers is established as **Quarantine Bay Q-3**. Any defective or damaged unit must be physically parked inside Bay Q-3 until officially released.

---

### Q303: What conditions mandate placing an electric bike into Quarantine?
**Answer:**
1. **Severe Transit Damage:** Deep body dents, cracked structural frame, or broken forks from transport trucks.
2. **Factory Quality Defect:** Flawed factory wiring harness, defective motor controller, or paint bubbling.
3. **Lithium Battery Safety Hazard:** Excessive cell voltage delta (>180 mV), swelling battery casing, or high-temperature BMS cutoffs.
4. **Post-Accident Customer Intake:** Vehicles involved in heavy road accidents awaiting insurance inspection.
5. **Customer Cancellation Return:** Returned vehicles undergoing diagnostic evaluation.

---

### Q304: Modal Guide — What is the CreateQuarantineRecordModal (`CreateQuarantineRecord.vue`), and what are its exact fields?
**Answer:** The **`CreateQuarantineRecordModal`** digitally quarantines defective assets:
* **Showroom Branch (Auto-Locked):** Branch isolating the unit.
* **Asset Category (Dropdown):** Complete Electric Bike (VIN), Lithium Battery Pack, Smart Controller, or Spare Part.
* **Chassis VIN / Serial Number Selector (Required):** Selects asset from local inventory.
* **Quarantine Physical Location:** Defaults to *Showroom Quarantine Bay Q-3*.
* **Defect / Failure Category (Dropdown):** Structural Frame Defect, High-Voltage Electrical / BMS Error, Motor / Hub Failure, Paint / Cosmetic Transit Damage, or Battery Thermal Anomaly.
* **Detailed Technical Failure Description (Required):** Technical explanation of fault.
* **OBD Diagnostic Trouble Code (if electrical):** e.g., `DTC-BMS-04`.
* **High-Resolution Defect Photo Upload (Mandatory):** Photos of damage or multimeter readings.
* **Immediate Safety Action Taken (Checkboxes):** Battery Disconnected, Unit Marked with High-Visibility Hazard Tag, Keys Locked in Manager Safe.
* **Quarantine Officer Name:** Staff member executing isolation.

---

### Q305: What happens in the system the instant a bike is quarantined?
**Answer:**
1. The vehicle status changes to **`Quarantine / QC Hold` (Deep Crimson Badge)**.
2. The chassis VIN is **immediately hidden from all Sales Order and POS dropdowns**. No salesperson can select or sell the unit.
3. The unit is locked from Inter-Branch Transfers.
4. An automated notification is sent to the Central Quality Assurance Director.

---

### Q306: Can a salesperson override a quarantine lock to sell a bike to an impatient customer?
**Answer:** **No, impossible.** The software code hard-blocks the allocation of quarantined assets. Only an authorized **Quarantine Release Action Item** approved by Head Office can restore the vehicle to sellable status.

---

### Q307: What are the two resolution paths for a quarantined vehicle?
**Answer:**
1. **Rectification & Return to Showroom Floor:** The defect was minor (e.g., replaced scratched fairing or installed a new controller). The vehicle passes quality testing and returns to `Available` floor stock.
2. **Factory Return / Scrapping:** The defect was severe (e.g., bent chassis frame or dead battery cell block). The vehicle is crated and shipped back to the OEM factory for warranty replacement or credit note.

---

### Q308: How are defective lithium battery packs stored safely inside Bay Q-3?
**Answer:** Defective or swollen battery packs are stored inside specialized fire-retardant, sand-lined steel safety cabinets equipped with automatic thermal cutoff sensors to prevent workshop fires.

---

### Q309: What is the Quarantine Release Protocol?
**Answer:** To release an asset from Quarantine:
1. Workshop technician completes repairs and replaces defective parts.
2. Quality Supervisor conducts a full multi-point diagnostic test and signs the **QC Release Certificate**.
3. Branch submits a **Quarantine Release Request** in the **Action Centre (Flow 5: Inventory Governance)**.
4. Head Office QA Director reviews test logs and approves the release.
5. Vehicle status updates to `Available` and rejoins the showroom floor.

---

### Q310: How does the system track quarantine costs?
**Answer:** The system tracks all technician labor hours and replacement parts consumed during quarantine rectification, enabling the corporate legal department to back-charge the costs to the OEM manufacturer or freight carrier.

---

### Q311: Can a customer inspect a quarantined bike on the showroom floor?
**Answer:** Quarantined bikes are physically cordoned off in Bay Q-3 with a prominent sign: **"FACTORY TESTING IN PROGRESS — NOT FOR SALE"**, protecting the dealership's premium brand image.

---

### Q312: How does Quarantine operate if the workshop is offline?
**Answer:** Quarantining an asset is **Category A: Fully Offline-Capable**. Staff can quarantine a unit locally. The lock applies immediately to the local workstation and synchronizes to the national cloud upon reconnection.

---

### Q313: What happens if an entire container shipment contains a batch manufacturing defect?
**Answer:** The Super Admin can execute a **Batch Quarantine Directive**, simultaneously placing an entire batch of VINs into quarantine across all branches with a single command.

---

### Q314: Are quarantine records preserved for OEM factory warranty audits?
**Answer:** Yes. Complete quarantine histories—including defect photos, OBD trouble codes, and technician notes—are permanently archived and exported as OEM Factory Quality Reports.


---
[Back to Top / Navigation Index](#dealership-owners-quick-navigation--executive-index)

---

# SECTION VI: CASH PROTECTION, EXPENSES & DAY-END RECONCILIATION

---

# PART 23: Showroom Operating Expenses & Petty Cash (Q315 – Q328)

### Q315: What are Showroom Operating Expenses (OPEX) in AJ EcoDrive?
**Answer:** Showroom Operating Expenses (`/finance/expenses`) are the day-to-day administrative and facility costs incurred while operating a retail showroom and workshop: customer hospitality (tea and water), backup generator diesel fuel during load-shedding, office stationery, cleaning supplies, and minor facility repairs.

---

### Q316: What is the Dynamic PKR 15,000 Petty Cash Threshold Policy?
**Answer:** To eliminate internal theft and maintain financial discipline across multi-city branches, AJ EcoDrive enforces an automated monetary threshold rule:
* **Expenses UP TO PKR 15,000 (Green Policy Banner):** The Branch Manager has discretionary authority to settle the bill immediately from the local showroom petty cash float, provided an official vendor receipt/bill is uploaded into the system.
* **Expenses EXCEEDING PKR 15,000 (Amber Warning Banner):** The system hard-blocks immediate cash payout from the local register. The claim is automatically packaged and routed to the **Action Centre (Flow 3: High-Value OPEX Clearance)** for prior review and clearance by the Central Chief Financial Officer (CFO).

---

### Q317: Modal Guide — What is the CreateExpenseModal (`CreateExpense.vue`), and what are its exact fields?
**Answer:** The **`CreateExpenseModal`** records operational expenditures with complete compliance:
* **Showroom Branch (Auto-Locked):** Identifies spending branch.
* **Expense Category (Required Dropdown):** Showroom Maintenance & Repairs, Backup Generator Fuel & Oil, Customer Tea & Hospitality, Office Stationery & Printing, Utility Bills (Electricity, Water, Internet), Marketing / Local Promotional Event, or Staff Travel & Conveyance.
* **Vendor / Contractor Legal Business Name (Required):** Paid entity (e.g., *Pakistan State Oil - Fuel Station 412*).
* **Expense Amount (PKR - Required Input):** Exact currency figure.
* **Dynamic Approval Policy Banner (Reactive):**
  - If Amount $\le$ 15,000: Shows green checkmark: *"Authorized under Local Branch Discretionary Petty Cash Limit."*
  - If Amount $>$ 15,000: Shows amber warning: *"Exceeds Local Branch Limit. System will automatically route this request to Head Office Action Centre (Flow 3) for CFO approval."*
* **Payment Mode (Dropdown):** Petty Cash Drawer Float, Corporate Credit Card, or Direct Head Office Bank Wire.
* **Vendor Bill / Official Receipt Photo Upload (Mandatory):** Upload of clear receipt or invoice.
* **Expense Description & Business Justification (Required):** Explains why the expense was necessary (e.g., *"Purchased 50 liters diesel for 20kVA backup generator during 6-hour power cut"*).
* **Submit Expense Claim Button:** Records expense or routes to Action Centre.

---

### Q318: Can a Branch Manager bypass the PKR 15,000 limit by splitting a single PKR 30,000 bill into two PKR 15,000 entries?
**Answer:** **No.** The system features an **Anti-Smurfing Fraud Algorithm**. If multiple expenses are filed within a 24-hour window for the same vendor or category that cumulatively exceed PKR 15,000, the system automatically flags the entries, locks petty cash payout, and alerts Head Office Internal Audit.

---

### Q319: What is the Showroom Petty Cash Float, and how is it managed?
**Answer:** Each branch is issued an authorized monthly petty cash imprest float (typically PKR 50,000 to PKR 100,000 depending on showroom size). As daily expenses are logged, the available float decreases.

---

### Q320: How does the Branch Manager request petty cash replenishment?
**Answer:** When the available float drops below 20%, the manager clicks **Request Petty Cash Replenishment**. The system compiles an itemized summary of all settled vouchers with attached receipt photos and routes it to Head Office Finance. Upon verification, Head Office dispatches a bank wire to replenish the float back to its full amount.

---

### Q321: Can staff file an expense without uploading a physical receipt?
**Answer:** **No.** The system mandates an image attachment (JPEG, PNG, or PDF). The submit button remains disabled until a readable file is attached.

---

### Q322: How does the system handle recurring showroom utility bills (e.g., monthly electricity)?
**Answer:** Large recurring utility bills (such as commercial electricity bills of PKR 85,000) are entered under *Utility Bills*. Because they exceed PKR 15,000, they route to Head Office Finance, which pays them directly via central corporate online banking.

---

### Q323: What happens if an expense claim is rejected by the CFO in the Action Centre?
**Answer:** The CFO inputs mandatory rejection remarks (e.g., *"Price quoted for generator repair is 40% higher than market rates; get secondary quote"*). The expense is marked as **Rejected**, and no corporate funds are disbursed.

---

### Q324: Can an employee edit or delete an expense voucher after it has been saved?
**Answer:** Once saved, expense records are permanently locked. If an error was made, the manager must file an authorized adjustment note approved by Head Office Finance.

---

### Q325: How does the Expense module operate when the showroom is offline?
**Answer:** Filing expenses is **Category B: Restricted Offline-Capable**. Staff can log petty cash expenses under PKR 15,000 locally. High-value expenses requiring Head Office approval are queued in the Outbox and submitted the moment internet connectivity restores.

---

### Q326: What official document is printed when a cash expense is paid out?
**Answer:** The thermal printer outputs an official **Petty Cash Payment Voucher**. The recipient vendor signs the physical voucher, which is stapled to the vendor receipt and archived in the showroom cash register.

---

### Q327: Does the system track expense trends across different showroom branches?
**Answer:** Yes. The Financial Analytics dashboard benchmarks showroom operating costs (e.g., comparing generator fuel costs between Peshawar and Lahore), helping management identify wasteful spending.

---

### Q328: Are showroom operating expenses deductible for corporate income tax?
**Answer:** Yes. The expense ledger generates automated tax deduction reports compliant with Federal Board of Revenue (FBR) regulations, distinguishing between verified tax-registered vendors and non-filer withholding deductions.

---
[Back to Top / Navigation Index](#dealership-owners-quick-navigation--executive-index)

---

# PART 24: Day-End Closing Reconciliation (Daily Z-Report) (Q329 – Q342)

### Q329: What is the Day-End Closing Routine in an EV showroom?
**Answer:** The Day-End Closing Routine (`/finance/closing`) is the mandatory financial and operational settlement performed by the Branch Manager at 08:00 PM when the showroom closes. It reconciles every physical rupee in the cash safe against system-recorded sales invoices and petty cash vouchers, preparing bank deposits and locking the business day.

---

### Q330: What is a "Daily Z-Report"?
**Answer:** The Daily Z-Report is an official, immutable financial closing statement that summarizes the entire business day:
* Total Gross Sales Revenue (PKR).
* Total Cash Collections in Drawer.
* Total Inter-Bank Transfers (IBFT) Received.
* Total Customer Cheques Deposited.
* Total Petty Cash Expenses Paid Out.
* Closing Net Physical Cash Balance.
* Automated Security Lock Timestamp.

---

### Q331: How is the physical cash drawer counted during closing?
**Answer:** The Branch Manager conducts a **Denomination-by-Denomination Cash Count**. The manager counts the physical currency notes in the safe and enters the exact count for each Pakistani rupee denomination:
* PKR 5,000 Notes $\times$ Count
* PKR 1,000 Notes $\times$ Count
* PKR 500 Notes $\times$ Count
* PKR 100 Notes $\times$ Count
* PKR 50 / 20 / 10 Notes $\times$ Count
The system automatically calculates the total physical cash in the drawer.

---

### Q332: What happens if the physical cash counted does not match the system total?
**Answer:** The system calculates the **Reconciliation Variance**:
$$\text{Variance} = \text{Physical Cash Counted} - \text{System Expected Balance}$$
* **Variance = PKR 0 (Balanced):** The cash drawer reconciles perfectly.
* **Cash Shortage (Negative Variance):** Physical cash is less than expected (e.g., -PKR 2,000). The manager must investigate missing receipts or incorrect customer change and submit an official explanation.
* **Cash Surplus (Positive Variance):** Physical cash exceeds expected totals.

---

### Q333: What is the "Business Day Tamper Lock"?
**Answer:** The moment the manager clicks **Confirm Day-End Closing (Generate Z-Report)**, the system permanently locks that calendar day. **No staff member can retroactively add, edit, or delete any sales orders, invoices, payments, or expenses for that day.** This eliminates the classic fraud of staff modifying yesterday's books to cover cash shortages.

---

### Q334: How is daily cash deposited into the dealership's corporate bank account?
**Answer:** To minimize overnight theft risk, cash collections exceeding the authorized petty cash float must be deposited into the dealership's corporate bank branch (or night-drop deposit vault) every evening or first thing the following morning.

---

### Q335: How does the manager document the bank deposit?
**Answer:** The manager deposits the cash at the bank counter, obtains the stamped **Bank Deposit Slip**, photographs the slip, and uploads it into the Daily Closing module in AJ EcoDrive. Head Office Finance matches the slip against the online bank statement.

---

### Q336: What physical documents are archived in the Daily Settlement Envelope?
**Answer:** At 08:30 PM, the manager seals the day's documents inside a secure brown **Daily Settlement Envelope**:
1. Printed Daily Z-Report signed by Branch Manager.
2. Carbon copies of all customer sales invoices and money receipts.
3. Original vendor receipts and petty cash vouchers.
4. Stamped bank deposit slip copy.
The envelope is stored in the branch safe for collection by corporate internal auditors.

---

### Q337: What happens if an emergency sale occurs after the Z-Report has been generated?
**Answer:** Once the Z-Report is locked, the operational business day is closed. Any emergency late-night transaction is automatically stamped and recorded under the **next business day's date**.

---

### Q338: How does Head Office monitor daily closing compliance across all cities?
**Answer:** The Central Executive Dashboard displays a **National Closing Status Grid**:
* Islamabad: *Closed at 08:14 PM (Balanced)*
* Lahore: *Closed at 08:22 PM (Balanced)*
* Peshawar: *Closed at 08:31 PM (Balanced)*
* Rawalpindi: *Pending Closing (Alert sent)*
If a branch fails to close by 09:00 PM, an automated alert is triggered.

---

### Q339: How does Day-End Closing operate if the branch is offline?
**Answer:** Closing reconciliation is **Category B: Restricted Offline-Capable**. The manager can count cash, reconcile local invoices, and generate a local provisional Z-Report. The report uploads to central accounting immediately upon internet reconnection.

---

### Q340: Can a Branch Manager reverse a Z-Report if they made an entry error?
**Answer:** **No.** A Z-Report is legally binding and non-reversible. If an accounting correction is required, the manager must submit a **Reconciliation Variance Docket** to Head Office Finance, which processes an authorized adjustment entry in the general ledger.

---

### Q341: Does the system alert management to chronic branch cash shortages?
**Answer:** Yes. The Internal Audit dashboard tracks cashier discrepancy frequency. If a branch reports recurring cash shortages, the system recommends an unannounced physical audit.

---

### Q342: What happens on the morning after closing?
**Answer:** When staff log in at 08:30 AM, the system verifies that yesterday was properly closed, initializes the new business date, resets the daily revenue counter to PKR 0, and loads the verified opening cash float.


---
[Back to Top / Navigation Index](#dealership-owners-quick-navigation--executive-index)

---

# SECTION VII: HEAD OFFICE GOVERNANCE, PROCUREMENT & NETWORK ADMINISTRATION

---

# PART 25: Sea Container Imports, Procurement & Supplier Management (Q343 – Q358)

### Q343: How does AJ EcoDrive handle international vehicle procurement?
**Answer:** The procurement engine (`/procurement/orders`) manages the high-stakes supply chain of importing electric vehicles and spare parts from overseas manufacturing plants (e.g., in China): issuing international Purchase Orders, tracking commercial letters of credit (LC), monitoring sea-freight shipping containers from port of origin to Karachi port, navigating customs clearance, and receiving shipments into the Central Port Warehouse.

---

### Q344: What is the difference between CBU and CKD electric vehicle imports?
**Answer:**
* **CBU (Completely Built Up):** Vehicles imported 100% assembled, painted, and ready for immediate showroom display.
* **CKD (Completely Knocked Down):** Vehicles imported as separate crates containing frames, motors, wiring harnesses, and battery packs for final local assembly at the dealership's central technical plant.

---

### Q345: Modal Guide — What is the CreatePurchaseOrderModal (`CreatePurchaseOrder.vue`), and what are its exact fields?
**Answer:** The **`CreatePurchaseOrderModal`** issues international procurement contracts:
* **Supplier Selection (Required Dropdown):** Selects verified manufacturer (e.g., *Wuxi Shengda Electric Vehicle Co., Ltd.*).
* **Order Category (Dropdown):** Complete CBU Electric Bikes, CKD Assembly Kits, Lithium Battery Packs, or Workshop Spare Parts.
* **Foreign Currency & Exchange Rate (Locked):** e.g., USD / CNY converted to PKR.
* **Shipping Container Specifications (Dropdown):** 20ft Standard Container (holds 35–40 scooters) or 40ft High Cube (HC) Container (holds 80–90 scooters).
* **Bill of Lading (BL) & Commercial Invoice Reference:** Mandatory maritime shipping reference.
* **Payment Terms (Dropdown):** 100% Irrevocable Letter of Credit (LC at Sight), Telegraphic Transfer (TT 30/70), or Open Account.
* **Target Port Arrival Date (ETA Karachi):** Expected port arrival.
* **Product Line Items Table:** Model SKU, Color Distribution, Order Quantity, Unit Cost, and Line Total.
* **Port of Origin & Destination Port:** e.g., Shanghai Port to Karachi Port (QICT / KICT).
* **Submit Purchase Order Button:** Transmits official digital PO.

---

### Q346: How does the system track maritime shipping and customs clearance?
**Answer:** The system tracks the international shipping milestones:
1. **PO Issued & LC Opened:** Bank establishes letter of credit.
2. **Factory Production & QC Inspection:** Factory completes assembly and passes pre-shipment inspection.
3. **Loaded on Vessel (On-Water):** Container loaded onto container ship; Bill of Lading (BL) issued.
4. **Arrived at Karachi Port:** Vessel docks; customs clearance agent begins clearing documentation.
5. **Customs Assessed & Duties Paid:** Government tariffs and sales taxes settled.
6. **In-Transit Trucking to Central Hub:** Flatbed container trucks transport crates from Karachi to Central Warehouse.

---

### Q347: Modal Guide — What is the ReceivePurchaseModal (`ReceivePurchase.vue`), and what are its exact fields?
**Answer:** When shipping containers arrive at the central warehouse, staff open **`ReceivePurchaseModal`**:
* **Purchase Order Reference Selector (Required):** Selects arriving PO.
* **Shipping Container Seal Verification:** Checks that the factory container bolt seal is unbroken.
* **Automated Batch Chassis VIN Generator:**
  - Enter starting VIN sequence (e.g., `VIN-PK-BRG-2026-01001` to `01080`).
  - System automatically generates and registers 80 individual serialized vehicle records with a single click.
* **Physical De-Vanning Inspection Table:** Records received quantities against packing list.
* **Customs Examination Sign-off:** Verifies customs inspection stamp.
* **Warehouse Storage Bay Allocation:** Assigns vehicles to Central Warehouse aisles.
* **Goods Inward Receipt Commitment Button:** Ingests units into national central stock.

---

### Q348: How are unique chassis VIN numbers assigned during container intake?
**Answer:** The intake engine can import a factory CSV packing list containing the stamped frame VINs, motor serials, and battery serials, or automatically generate standardized VIN sequences adhering to national motor vehicle numbering standards.

---

### Q349: Modal Guide — What is the CreateSupplierModal (`CreateSupplier.vue`), and what are its exact fields?
**Answer:** The **`CreateSupplierModal`** profiles international and local vendors:
* **Supplier Legal Name (Required):** Registered corporate entity.
* **Country & Head Office City:** e.g., China, Jiangsu / Pakistan, Karachi.
* **Supplier Category:** Vehicle OEM Manufacturer, Battery Cell Producer, Tyre Manufacturer, or Local Accessories Fabricator.
* **Corporate Website & Email Address:** Official contact info.
* **Lead Time (Days):** Standard production and shipping duration (e.g., 45 days).
* **Accepted Payment Terms:** LC, TT, Cash on Delivery.
* **Supplier Bank Details & Swift Code:** For international trade wires.
* **Quality Rating Scorecard:** Tracks supplier reliability and defect frequency.

---

### Q350: How does the system prevent costly container demurrage charges at Karachi port?
**Answer:** Shipping lines charge steep daily demurrage penalties if containers sit at the port beyond free days (typically 14 days). The system features an automated **Port Demurrage Countdown Clock**. When a container docks, the countdown starts, alerting clearing agents to expedite customs clearance before penalties accrue.

---

### Q351: How does the system calculate Landed Cost per vehicle?
**Answer:** The Landed Cost Calculator computes the true financial cost of each vehicle:
$$\text{Landed Cost} = \text{Factory Invoice Price} + \text{Ocean Freight} + \text{Marine Insurance} + \text{Customs Import Duty} + \text{Port Handling & Trucking}$$
This accurate landed cost feeds dealership pricing models and margin calculations.

---

### Q352: Can local showroom staff view international purchase orders?
**Answer:** No. International procurement is restricted to Super Admin and Central Supply Chain management. Showroom staff only see expected inventory delivery dates.

---

### Q353: What happens if a sea container arrives with water damage or crushed crates?
**Answer:** The warehouse manager notes the damage on the Goods Received Note, takes photographs before unloading, and initiates an immediate **Marine Insurance Claim Docket** in AJ EcoDrive.

---

### Q354: Does the system track foreign exchange (FX) currency fluctuations?
**Answer:** Yes. The procurement engine records the foreign exchange rate locked at LC opening versus the settlement rate, calculating realized foreign exchange gains or losses.

---

### Q355: How are spare parts containers cataloged during intake?
**Answer:** Spare parts crates are received via barcode scanning against the supplier packing list, automatically updating central spare parts bin locations.

---

### Q356: Can the system forecast future container orders based on branch sales velocity?
**Answer:** Yes. The Procurement Planning tool analyzes the past 90 days of vehicle sales across all branches, projects monthly demand, and recommends when to issue the next 40ft container order to prevent stock-outs.

---

### Q357: How does procurement operate if internet connectivity to the port is slow?
**Answer:** The procurement dashboard is engineered for high performance with minimal data transfer, ensuring smooth operation even on slower port connections.

---

### Q358: Are procurement records archived for state customs audits?
**Answer:** Yes. Complete procurement histories—including commercial invoices, packing lists, bills of lading, and customs declarations—are permanently archived for statutory import audits.

---
[Back to Top / Navigation Index](#dealership-owners-quick-navigation--executive-index)

---

# PART 26: Showroom Branches, User Accounts & Security Permissions (Q359 – Q374)

### Q359: How does Head Office add a brand-new showroom branch to the network?
**Answer:** When expanding the dealership network (e.g., opening a new showroom in Faisalabad or Multan), Super Admin navigates to **System -> Branches** and clicks **+ Add New Branch** (`CreateBranchModal.vue`).

---

### Q360: Modal Guide — What is the CreateBranchModal (`CreateBranch.vue`), and what are its exact fields?
**Answer:** The **`CreateBranchModal`** provisions a new physical dealership branch:
* **Branch Unique Code (Required):** 3-character identifier (e.g., `FSD` for Faisalabad).
* **Branch Official Name (Required):** e.g., *Faisalabad Prime Showroom & Service Center*.
* **City & Province (Dropdown):** Selects administrative jurisdiction.
* **Physical Showroom Address (Required):** Full street address for invoicing and registration.
* **Direct Contact Phone & Official Email:** Branch communication channels.
* **Authorized Petty Cash Float Limit (PKR):** Local monthly operating float (e.g., PKR 75,000).
* **Showroom Floor Capacity (Units):** Maximum physical bike capacity (e.g., 25 units).
* **Workshop Service Bays Count:** Number of active repair bays (e.g., 3 bays).
* **Assigned Branch Manager User:** Selects managing executive.
* **Operating Hours:** Defaults to 08:30 AM – 08:00 PM (Monday – Saturday).
* **Branch Status:** Active or Under Setup / Construction.

---

### Q361: What happens the microsecond a new Branch is created?
**Answer:** The system automatically:
1. Provisions dedicated local inventory and spare parts ledgers.
2. Establishes a local cash drawer and petty cash accounting sub-ledger.
3. Configures local invoice and receipt numbering sequences (e.g., `INV-FSD-0001`).
4. Adds the branch to national management dashboards.

---

### Q362: Modal Guide — What is the CreateUserModal (`CreateUser.vue`), and what are its exact fields?
**Answer:** The **`CreateUserModal`** provisions employee accounts:
* **Employee Full Legal Name (Required):** Staff member name.
* **Corporate Email Address (Required - Unique):** Used for system login.
* **Mobile Contact Phone (Required):** For two-factor SMS codes.
* **Assigned Showroom Branch (Dropdown):** Restricts staff member's operational view to their specific branch (or All Branches for Super Admin).
* **System Role (Required Dropdown):** Super Admin or Branch Manager (with future roles: Sales Exec, Cashier, Mechanic, Auditor).
* **Temporary Login Password:** Initial password adhering to security policy.
* **Force Password Change on First Login:** Security toggle.
* **Account Status:** Active, Inactive, or Suspended.

---

### Q363: Modal Guide — What is the CreateRoleModal (`CreateRole.vue`), and how does Role-Based Access Control (RBAC) work?
**Answer:** The **`CreateRoleModal`** defines custom security profiles with granular permissions:
* **Role Name & Description:** e.g., *Senior Workshop Technician*.
* **Module Permissions Matrix (View / Create / Edit / Delete / Approve):**
  - Sales & Quotations (Can create quotes; cannot approve discounts > 8%).
  - Customer Registration (Can register CNIC; cannot export customer phone lists).
  - Showroom Inventory (Can view local stock; cannot write off missing units).
  - Workshop & Jobs (Can log job cards; cannot approve high-voltage battery claims).
  - Petty Cash & OPEX (Can file expense claims; cannot approve vouchers > PKR 15k).
  - System Settings (Strictly view-only).

---

### Q364: Modal Guide — What is the CreateConversationModal (`CreateConversation.vue`), and what is Internal Management Messaging?
**Answer:** Internal Management Messaging (`/communication`) provides a secure, encrypted internal chat channel linking branch showrooms to Head Office:
* **Channel Topic / Title (Required):** e.g., *"Emergency Battery Recall Inspection"* or *"Weekly Sales Push"*.
* **Conversation Type:** 1-on-1 Direct Chat or Multi-Branch Broadcast Channel.
* **Participants Multi-Selector:** Selects Super Admin and specific Branch Managers.
* **Priority Level:** Normal or Urgent Directive.
* **Initial Message Text & Attachment:** Dispatches official operational memos directly inside the software, eliminating messy WhatsApp groups.

---

### Q365: Why is internal software messaging better than WhatsApp for dealership management?
**Answer:** WhatsApp messages lack business context and cannot be audited. AJ EcoDrive messaging allows staff to attach live database records (e.g., linking directly to Sales Order #SO-1082 or Chassis #VIN-0812) directly inside the chat thread, providing instant context and complete enterprise auditability.

---

### Q366: How does the system handle employee transfers between branches?
**Answer:** If an employee transfers from Islamabad to Lahore, Super Admin opens their user profile, changes the assigned branch to Lahore, and clicks Save. The employee's login immediately switches to Lahore's showroom ledger upon their next sign-in.

---

### Q367: What happens when an employee is terminated?
**Answer:** The administrator toggles their account status to **Inactive**. Their active session is revoked immediately on all desktop computers and mobile tablets, locking them out of customer records and inventory.

---

### Q368: Can a Branch Manager create new user accounts?
**Answer:** **No.** User administration and role provisioning are strictly restricted to Super Admin at Head Office to prevent local managers from creating unauthorized employee accounts.

---

### Q369: How does the system record administrative changes?
**Answer:** Every branch creation, user addition, password reset, or permission change is logged in the **System Audit Log** with the admin's user ID, IP address, and exact timestamp.

---

### Q370: Can an administrator view employee login history?
**Answer:** Yes. The User Activity report displays login timestamps, workstation device types (Desktop vs Android Tablet), IP addresses, and session durations for every employee.

---

### Q371: How does the system support two-factor authentication (2FA)?
**Answer:** For high-privilege Super Admin accounts, the system supports mandatory two-factor authentication via SMS OTP or authenticator apps (e.g., Google Authenticator).

---

### Q372: What happens if a branch showroom relocates to a new address?
**Answer:** Super Admin updates the physical address in the branch profile. The new address immediately reflects on all newly printed invoices, delivery gate passes, and warranty certificates.

---

### Q373: Can an employee log into multiple workstations at the exact same time?
**Answer:** The security policy enforces **Single Concurrent Session**. If an employee logs in on a counter workstation while their account is active on a tablet, the earlier session is securely closed with a notification.

---

### Q374: Are deactivated branches permanently erased from the database?
**Answer:** No. Deactivated branches are archived under `Inactive` status, preserving all historical sales, tax invoices, and customer records forever for statutory compliance.


---
[Back to Top / Navigation Index](#dealership-owners-quick-navigation--executive-index)

---

# SECTION VIII: COLLABORATION MATRIX, ARCHITECTURE & APPENDICES

---

# PART 27: Super Admin & Branch Manager 10 Master Touchpoints Collaboration Matrix (Q375 – Q390)

### Q375: What is the "10 Master Touchpoints Framework" in AJ EcoDrive?
**Answer:** The 10 Master Touchpoints Framework is the definitive operational blueprint governing every interaction between Head Office (Super Admin) and local dealership showrooms (Branch Managers). It replaces informal phone calls and fragmented messages with standardized, auditable digital collaboration gates.

---

### Q376: What are the 10 Master Operational Touchpoints?
**Answer:**
1. **Touchpoint 1: Commercial Pricing & Margin Override Requests (Action Flow 1)**
2. **Touchpoint 2: Showroom Floor Stock Replenishment Requisitions (Action Flow 2)**
3. **Touchpoint 3: Inter-Branch Stock Transfers & In-Transit Custody (Action Flow 2)**
4. **Touchpoint 4: Blind Physical Inventory Audits & Discrepancy Adjustments (Action Flow 5)**
5. **Touchpoint 5: Showroom OPEX & Emergency Expense Clearance (Action Flow 3)**
6. **Touchpoint 6: High-Voltage Lithium Battery & BMS Warranty Claims (Action Flow 4)**
7. **Touchpoint 7: Customer Vehicle Returns & Cancellation Refunds (Action Flow 5)**
8. **Touchpoint 8: B2B Corporate Fleet Credit Limits & Payment Terms (Action Flow 1)**
9. **Touchpoint 9: Day-End Closing Settlement (Daily Z-Report & Bank Slip Verification)**
10. **Touchpoint 10: Staff User Provisioning & Branch Network Governance**

---

### Q377: Touchpoint 1 — How do Super Admin and Branch Manager collaborate on Pricing Overrides?
**Answer:**
* **Trigger:** Customer demands a discount exceeding the branch manager's 8% discretionary ceiling.
* **Branch Manager Action:** Fills out `CreateActionModal` (Flow 1), entering proposed discount %, customer competitor quote, and justification.
* **Super Admin Treatment:** Evaluates live projected gross margin erosion in the Action Centre Decision Drawer. Can approve full discount, set a binding counter-cap (e.g., 9.5%), or reject the waiver.
* **Business Safeguard:** Prevents rogue discounting; ensures every price reduction preserves minimum corporate gross margins.

---

### Q378: Touchpoint 2 — How do they collaborate on Stock Replenishment Requisitions?
**Answer:**
* **Trigger:** Showroom floor stock falls below minimum safety levels or a customer places a deposit on a non-stocked model.
* **Branch Manager Action:** Submits `CreateStockRequestModal`, specifying requested model, color, quantity, and target delivery date.
* **Super Admin Treatment:** Reviews national inventory, checks arriving container shipping manifests, and approves factory/warehouse allocation.
* **Business Safeguard:** Prevents stock hoarding by favored branches; ensures fair nationwide inventory distribution.

---

### Q379: Touchpoint 3 — How do they collaborate on Inter-Branch Transfers?
**Answer:**
* **Trigger:** Vehicle must be moved from one city to another (e.g., Lahore to Islamabad) to fulfill demand.
* **Branch Manager Action:** Initiates `CreateTransferModal`, scanning specific VINs and recording carrier truck, driver name, CNIC, and truck license plate.
* **Super Admin Treatment:** Authorizes inter-branch movement gate pass; monitors In-Transit dual-custody tracking.
* **Business Safeguard:** Eliminates lost vehicles in transit; prevents bikes from being sold simultaneously in two different cities.

---

### Q380: Touchpoint 4 — How do they collaborate on Inventory Audits & Variances?
**Answer:**
* **Trigger:** Monthly blind physical cycle count reveals a variance (missing or surplus vehicle).
* **Branch Manager Action:** Submits `CreateAdjustmentRequestModal`, detailing physical scan results and investigation findings.
* **Super Admin Treatment:** Central internal audit investigates root cause; executive directors approve write-off or order police report.
* **Business Safeguard:** Prevents showroom managers from hiding physical stock loss or vehicle theft.

---

### Q381: Touchpoint 5 — How do they collaborate on Showroom OPEX & Petty Cash?
**Answer:**
* **Trigger:** Showroom incurs an operating expense exceeding PKR 15,000 (e.g., generator overhaul or building repair).
* **Branch Manager Action:** Submits `CreateExpenseModal`, attaching vendor bill, tax invoice, and emergency justification.
* **Super Admin Treatment:** Chief Financial Officer (CFO) reviews expense against branch budget and clears payout via corporate bank wire.
* **Business Safeguard:** Enforces financial discipline; eliminates unauthorized showroom cash drains.

---

### Q382: Touchpoint 6 — How do they collaborate on High-Voltage Battery Claims?
**Answer:**
* **Trigger:** Customer electric bike experiences catastrophic battery failure or severe cell voltage delta.
* **Branch Manager Action:** Submits `CreateCaseModal` & Action Flow 4, attaching OBD trouble codes, SOH diagnostic logs, and battery serial photos.
* **Super Admin Treatment:** Chief Technical Officer and OEM warranty team authorize replacement; dispatch new battery from Central Warehouse.
* **Business Safeguard:** Enforces 3-way serialized hardware lock; stops fraudulent battery swapping scams.

---

### Q383: Touchpoint 7 — How do they collaborate on Vehicle Returns & Refunds?
**Answer:**
* **Trigger:** Customer cancels order or returns delivered bike due to major unresolvable factory defect.
* **Branch Manager Action:** Executes 10-point return inspection; submits `CreateReturnModal` with proposed usage/damage deductions.
* **Super Admin Treatment:** Sales Director and CFO approve net refund; corporate accounting issues bank wire directly to customer.
* **Business Safeguard:** Protects company from paying full refunds on heavily used or damaged returned vehicles.

---

### Q384: Touchpoint 8 — How do they collaborate on Corporate Fleet Credit Limits?
**Answer:**
* **Trigger:** B2B corporate courier company requests purchase of 15 commercial trikes on 60-day credit terms.
* **Branch Manager Action:** Submits commercial proposal in Action Flow 1, attaching corporate NTN, bank statements, and corporate guarantee.
* **Super Admin Treatment:** Risk committee sets approved corporate credit ceiling, payment milestones, and post-dated cheque requirements.
* **Business Safeguard:** Eliminates uncollectible commercial debt and bad credit exposure.

---

### Q385: Touchpoint 9 — How do they collaborate on Day-End Closing Settlement?
**Answer:**
* **Trigger:** Showroom closes at 08:00 PM; cash drawer must be settled.
* **Branch Manager Action:** Performs denomination cash count; generates Daily Z-Report; deposits cash at bank; uploads stamped deposit slip.
* **Super Admin Treatment:** Central Finance matches uploaded deposit slips against online bank feeds and locks the national business day.
* **Business Safeguard:** Eliminates cash skimming; ensures all collected cash is deposited in the bank within 24 hours.

---

### Q386: Touchpoint 10 — How do they collaborate on Staff User Provisioning?
**Answer:**
* **Trigger:** Showroom hires a new sales executive or replaces a departing workshop technician.
* **Branch Manager Action:** Submits user provisioning request with employee CNIC, job title, and phone number via internal communication.
* **Super Admin Treatment:** Head Office IT provisions user credentials, assigns branch permissions, and activates access profile.
* **Business Safeguard:** Centralizes identity management; ensures ex-employees are immediately locked out across all systems.

---

### Q387: What happens if a Branch Manager and Super Admin disagree on an action item?
**Answer:** The Action Centre includes a structured **Discussion Thread**. The Super Admin can post formal review notes, and the Branch Manager can present additional market evidence or escalate to the Chief Executive Officer for final arbitration.

---

### Q388: Can an action item be processed without generating an audit record?
**Answer:** **No.** Every single touchpoint event generates an immutable audit record logging actor ID, role, IP address, timestamp, previous state, new state, and exact remarks.

---

### Q389: How does the system visualize touchpoint performance?
**Answer:** The **Executive Governance Dashboard** tracks touchpoint metrics: average approval turnaround time, branch request frequency, discount concession rates, and SLA compliance scorecards.

---

### Q390: Does the 10 Master Touchpoints Framework function identically on mobile tablets?
**Answer:** Yes. Branch Managers can submit and track touchpoints from handheld Android tablets, and Super Admins can review dossiers and grant approvals on tablets while traveling.

---
[Back to Top / Navigation Index](#dealership-owners-quick-navigation--executive-index)

---

# PART 28: Offline Continuity, Synchronization & Local Workstation Architecture (Q391 – Q405)

### Q391: Why is offline capability mandatory for an EV dealership operating in Pakistan?
**Answer:** In Pakistan, retail dealerships face frequent infrastructure disruptions: sudden power cuts, UPS switchover blips, fiber optic cuts, and cellular mobile data suspensions during national events. If a dealership system relies 100% on a cloud internet connection, a 4-hour internet outage means:
* Customers standing on the showroom floor cannot buy bikes.
* Staff cannot print official Delivery Gate Passes.
* Mechanics cannot log repair job cards.
* Cash cannot be recorded, leading to theft.

AJ EcoDrive is engineered with **Local Offline Durability**, guaranteeing that showroom sales, quotations, receipts, and repairs continue operating at 100% full speed even if the internet cable is completely severed.

---

### Q392: What is the Three-Tier Architecture of AJ EcoDrive?
**Answer:** The platform is built on three resilient layers:
1. **Tier 1: Local Durable Database (SQLite on Desktop Workstations / IndexedDB on Tablets):** Stores a complete, high-speed local copy of the branch's catalog, floor inventory, customers, prices, and open job cards directly on the local computer's solid-state drive (SSD).
2. **Tier 2: Transaction Outbox Event Queue:** Every local transaction (lead captured, sale made, payment logged) is written to a local FIFO (First-In, First-Out) transaction journal.
3. **Tier 3: Central Multi-Tenant Cloud Database:** The master central PostgreSQL / MySQL database hosted in a Tier-4 secure cloud datacenter, maintaining consolidated national records.

---

### Q393: What are the Three Operational Categories in the Offline Classification Matrix?
**Answer:** The system categorizes every business operation into 3 clear operational profiles:
* **Category A: Fully Offline-Capable (100% Local Execution):** Lead capture, customer profile edits, quotation calculations, service intake, repair job cards, physical inventory scans, and local database searches. Operates with zero internet dependence.
* **Category B: Restricted Offline-Capable (Local Branch Scope Only):** Sales order confirmation (only for vehicles physically present in that showroom), delivery handover (if invoice is 100% paid), cash payment capture, and petty cash expenses under PKR 15,000. Commits locally; queues for central sync.
* **Category C: Online-Required (Strict Central Connection Mandatory):** Inter-branch stock transfers (requires two-branch lock), catalog master price changes, user account creation / role permission edits, and final national financial closing.

---

### Q394: What is the Transaction Outbox Engine, and how does it work?
**Answer:** When staff confirm an order or record a cash payment while offline, the system writes the transaction to the local database and places an encrypted **Sync Payload** into the local **Transaction Outbox Queue**. The payload includes:
* Unique Transaction UUID.
* Local Timestamp & Sequence Counter.
* Encrypted Business Event Data.
* Operator Signature Token.

The outbox guarantees zero data loss: transactions remain safely stored on the local hard drive through computer restarts until successfully uploaded to the central server.

---

### Q395: What happens the microsecond internet connectivity is restored?
**Answer:** The background synchronization engine continuously pings the central server. The instant a stable heartbeat is detected:
1. The workstation transitions from **AMBER (OFFLINE)** to **GREEN (ONLINE)**.
2. The Outbox engine flushes queued events to the central server in strict chronological order.
3. The server processes and commits each transaction, returning an official central confirmation ID.
4. The server pushes down any new catalog updates, price changes, or inbound transfer manifests created while the branch was offline.

---

### Q396: How does the system handle "Split-Brain" Inventory Conflicts?
**Answer:** A split-brain conflict could theoretically happen if two branches tried to sell the exact same bike while offline.
AJ EcoDrive makes this **impossible by design through Local Custody Isolation**:
* A branch workstation can **only sell vehicles that have been physically committed to that branch's local database**.
* Because Peshawar has physical custody of VIN-0812, Lahore's local database does not contain VIN-0812.
* Therefore, Lahore cannot sell Peshawar's bike offline or online.

---

### Q397: What is the Deterministic Conflict Resolution Policy for concurrent customer profile edits?
**Answer:** If staff in Peshawar update a customer's phone number while offline at 02:15 PM, and Head Office updates the same customer's address online at 02:20 PM:
The system applies **Deterministic Field-Level Delta Merging**:
* Non-conflicting fields (phone in Peshawar, address at Head Office) are both merged safely.
* If the exact same field is edited, the system applies **Last-Write-Wins (LWW) with Vector Clock Precedence**, preserving the latest timestamp while logging the overwritten value in the audit history.

---

### Q398: How does the system survive sudden showroom power cuts (load-shedding)?
**Answer:** Showroom workstations are equipped with local Uninterruptible Power Supplies (UPS) and backup generators. The local SQLite database utilizes **Write-Ahead Logging (WAL)**. If power cuts mid-transaction, WAL guarantees zero database corruption; the system recovers instantaneously upon reboot without losing a single character.

---

### Q399: What happens if a showroom remains without internet for 3 consecutive days?
**Answer:** The showroom operates completely normally for all 3 days: selling bikes, registering customers, servicing vehicles, collecting cash, and printing gate passes. The local Outbox stores up to 100,000 transactions. On Day 4, when the internet fiber cable is repaired, the entire 3-day backlog synchronizes cleanly within minutes.

---

### Q400: Can staff use cellular 4G mobile hotspot as an automatic backup connection?
**Answer:** Yes. Showroom workstations can be configured with dual network interfaces: primary showroom broadband Wi-Fi plus an automated cellular 4G USB dongle failover. If the fiber cable trips, traffic switches to 4G in under 5 seconds.

---

### Q401: How much local hard drive storage does the offline database consume?
**Answer:** Because electric vehicle dealership transaction volumes are compact, a full branch database (catalog, 5,000 customer records, 5 years of sales and service history) occupies less than **250 Megabytes (MB)** of disk space, running lightning-fast on any standard desktop SSD.

---

### Q402: Are offline records tamper-proof against employee manipulation?
**Answer:** Yes. The local SQLite database is encrypted with **AES-256 SQLCipher**. An employee cannot open the database file with external tools to alter prices or delete invoices; any file tampering invalidates the cryptographic hash and locks the application.

---

### Q403: How does the system display network status to counter staff?
**Answer:** A prominent, color-coded **Connection Health Pill** is displayed in the upper navigation header:
* **GREEN PULSE (ONLINE):** Fully connected to Central Cloud; live real-time sync active.
* **AMBER (OFFLINE - DURABLE):** Internet disconnected; operating locally; Outbox queuing active (shows count: e.g., *"4 Events Queued"*).
* **BLUE ROTATING (SYNCING):** Internet restored; actively transmitting Outbox backlog.

---

### Q404: What automated sync diagnostic tool is available to staff?
**Answer:** In **Settings -> Sync Health**, staff can view the **Sync Diagnostic Monitor**:
* Last Successful Cloud Heartbeat.
* Outbox Queued Items Count.
* Average Network Round-Trip Latency (ms).
* Manual **"Force Sync Now"** button.

---

### Q405: What is the ultimate executive summary for dealership owners regarding AJ EcoDrive's architecture?
**Answer:**
> **"AJ EcoDrive combines the centralized governance and nationwide visibility of a modern Cloud ERP with the bulletproof reliability, zero-latency speed, and offline durability of an industrial local desktop system. Your showrooms will NEVER stop selling, your inventory will NEVER be double-sold, and your cash will NEVER go unaccounted for."**


---
[Back to Top / Navigation Index](#dealership-owners-quick-navigation--executive-index)

---

# APPENDIX A: Policy Summary — Operational Continuity & Synchronization

1. **Local Operational Durability:** Each showroom branch maintains a durable, local transactional database (SQLite on Desktop Workstations / IndexedDB on Tablets) capable of operating completely independently during cloud disconnects.
2. **Deterministic Conflict Resolution:** Business rules guarantee deterministic outcomes when reconciling concurrent modifications between branches and the central server, prioritizing local showroom physical custody.
3. **Graceful Degradation:** The user interface provides clear visual cues of connectivity status (Green/Amber/Blue) without blocking local sales, quotes, or repair operations.
4. **Guaranteed Transaction Delivery:** An Outbox Queue pattern guarantees at-least-once delivery of local transactions to the central cloud once connectivity is restored.
5. **Periodic & Event-Driven Sync:** Synchronization executes in the background continuously on critical events, and periodically at 2-hour intervals for non-critical telemetry.
6. **Day-End Closing Enforcement:** Showroom branches must resolve any critical local transactional discrepancies before formal end-of-day register closing.

---

# APPENDIX B: Target Production Topology Blueprint

```text
====================================================================================================
                                      CENTRAL CLOUD LAYER
                          (Tier-4 Secure Cloud Datacenter / High Availability)
====================================================================================================
                                                 |
                       +-------------------------+-------------------------+
                       |                                                   |
                       v                                                   v
          +-------------------------+                         +-------------------------+
          |  Central Master Server  |                         | Central Cloud Database  |
          |  REST & WebSocket APIs  |                         |  PostgreSQL / MySQL     |
          |  Sync & Conflict Engine |                         |  Consolidated Ledger    |
          +-------------------------+                         +-------------------------+
                       |                                                   |
                       +-------------------------+-------------------------+
                                                 |
                                     (Encrypted HTTPS Sync)
                                                 |
           +-------------------------------------+-------------------------------------+
           |                                     |                                     |
           v                                     v                                     v
=======================               =======================               =======================
 PESHAWAR SHOWROOM HUB                 ISLAMABAD SHOWROOM                    LAHORE SHOWROOM HUB
=======================               =======================               =======================
 | Desktop App (Dell/HP)               | Desktop App (Dell/HP)               | Desktop App (Dell/HP)
 | Android Tablets (Parity)            | Android Tablets (Parity)            | Android Tablets (Parity)
 | Local SQLite Database               | Local SQLite Database               | Local SQLite Database
 | Transaction Outbox Queue            | Transaction Outbox Queue            | Transaction Outbox Queue
 | Background Sync Engine              | Background Sync Engine              | Background Sync Engine
=======================               =======================               =======================
                                                 |
                               +-----------------+-----------------+
                               |                                   |
                               v                                   v
             =====================================   =====================================
                    OPTIONAL WEB COMPANION                 MOBILE FIELD EXECUTIVE APP
             (Secondary Browser Portal for Remote)   (Android Tablets - Full Feature Parity)
             =====================================   =====================================
```

---

# APPENDIX C: Proposed Offline Operational Classification Matrix

> [!NOTE]
> *The operational classifications below represent the proposed architectural baseline awaiting formal client review and sign-off.*

| Operation / Module | Operational Category | Offline Behavior & Business Rules | Central Reconciliation Mechanism | Approval Status |
| :--- | :--- | :--- | :--- | :--- |
| **Customer Lead Capture** | **Category A: Offline-Capable** | Full data entry permitted; saved immediately to local database. | Synchronizes to central CRM; deduplicated by CNIC / Phone. | Approved |
| **Customer Profile Edit** | **Category A: Offline-Capable** | Immediate local update; cached contact details update locally. | Field-level delta merge; conflicting fields resolved by timestamp. | Approved |
| **Quotation Preparation** | **Category A: Offline-Capable** | Full pricing calculation using local cached price lists. | Uploads as proposed quotation; no inventory impact. | Approved |
| **Service Case Intake** | **Category A: Offline-Capable** | Vehicle inspection, symptom notes, and photo intake saved locally. | Uploads case record; links to vehicle warranty master. | Approved |
| **Repair Job Logging** | **Category A: Offline-Capable** | Diagnostic labor time and parts usage recorded locally. | Posts parts consumption to central after-sales ledger. | Approved |
| **Local Showroom Inquiries** | **Category A: Offline-Capable** | Instant search by Phone, CNIC, VIN, or Order ID in local store. | Purely local query; zero network traffic generated. | Approved |
| **Sales Order Confirmation** | **Category B: Restricted Offline** | Permitted **only** for vehicles physically present in local showroom. | Server validates VIN availability; commits reservation. | Approved |
| **Vehicle Handover Delivery** | **Category B: Restricted Offline** | Permitted if customer invoice is 100% settled; PDI checklist logged. | Central ownership activated; 2-year warranty card logged. | Approved |
| **Showroom Payment Capture** | **Category B: Restricted Offline** | Cash / IBFT receipts captured with local transaction ID. | Corporate accounting verifies bank slip before final ledger post. | Approved |
| **Showroom Petty Cash Expense** | **Category B: Restricted Offline** | Permitted within branch manager discretionary limit (PKR 15,000). | Syncs to finance queue; expenses above limit require central review. | Approved |
| **Transfer Receiving (GRN)** | **Category B: Restricted Offline** | Physical chassis verification and condition check logged locally. | Updates physical branch custody in central inventory ledger. | Approved |
| **User Role & Permission Edits**| **Category C: Online-Required** | **Blocked offline.** Requires live central administrative connection. | Immediate server commit; propagates to branches on sync. | Approved |
| **Corporate Pricing Changes** | **Category C: Online-Required** | **Blocked offline.** Only Super Admin can adjust master MSRP/rules. | Pushed down to all branch local stores during periodic sync. | Approved |
| **Inter-Branch Stock Transfer** | **Category C: Online-Required** | Requesting from another branch requires central stock lock. | Two-phase commit between origin, destination, and Head Office. | Approved |
| **Company Financial Closing** | **Category C: Online-Required** | Final corporate financial settlement requires full central sync. | National trial balance and general ledger consolidation. | Approved |

---

# APPENDIX D: Branch Daily Operational Lifecycle

```text
+----------------------------------------------------------------------------------------------------+
| 08:30 AM — SHOWROOM MORNING OPEN & SYNC                                                            |
| 1. Branch Manager launches AJ EcoDrive Desktop Application (or Mobile Tablet App).                 |
| 2. System automatically authenticates and initiates Morning Central Synchronization.              |
| 3. Downloads overnight stock transfer approvals, in-transit shipments, and price lists.            |
| 4. Confirms branch operational business date. Status indicator turns GREEN (ONLINE).               |
+----------------------------------------------------------------------------------------------------+
                                                  |
                                                  v
+----------------------------------------------------------------------------------------------------+
| 09:00 AM — 07:30 PM — DAYTIME CONTINUOUS SHOWROOM & WORKSHOP OPERATIONS                            |
| * Normal State: All transactions execute locally with immediate background sync to Central Cloud.  |
| * Disconnected State: System automatically detects packet loss and switches to AMBER (OFFLINE).    |
|   - Sales, quotes, receipts, gate passes, and workshop job cards execute against local SQLite.     |
|   - Outbox engine safely journals all transactions to local encrypted disk.                        |
|   - Zero disruption to walk-in customers, deliveries, or workshop repairs.                         |
| * Reconnection: Upon internet restoration, status changes to BLUE (SYNCING) and flushes Outbox.    |
+----------------------------------------------------------------------------------------------------+
                                                  |
                                                  v
+----------------------------------------------------------------------------------------------------+
| 08:00 PM — 08:30 PM — EVENING RECONCILIATION & DAY-END CLOSING                                     |
| 1. System initiates mandatory Pre-Closing Synchronization Health Check.                             |
| 2. Flushes any remaining offline outbox items to central cloud database.                           |
| 3. Branch Manager conducts physical denomination cash count in safe.                               |
| 4. System reconciles physical cash against sales invoices and petty cash vouchers.                 |
| 5. Manager uploads stamped bank deposit slip and signs the Daily Z-Report.                         |
| 6. System permanently locks the business day against retroactive tampering.                        |
+----------------------------------------------------------------------------------------------------+
```

---

# APPENDIX E: Failure & Recovery Scenarios Matrix (18 Critical Events)

| # | Operational Failure Scenario | Primary System Impact | Deterministic System Response & Mitigation | Central Audit / Integrity Safeguard |
| :-| :--- | :--- | :--- | :--- |
| **1** | **Complete Internet Outage** | Showroom loses fiber connectivity. | Enters AMBER (OFFLINE); switches transparently to local SQLite. | Zero data loss; outbox records all local actions. |
| **2** | **Sudden Power Cut (Load-Shedding)**| Desktop PC loses power instantly. | Local SQLite Write-Ahead Logging (WAL) prevents data corruption. | Uncommitted memory writes rolled back cleanly on reboot. |
| **3** | **Network Drops During Payment** | Network cuts while saving receipt. | Local database completes commit first; sync engine retries upload. | Server detects duplicate client UUID; drops duplicate. |
| **4** | **Unsent Outbox Items at Closing** | Manager clicks Close Day with queue. | System warns: "Flushing 3 pending transactions before closing." | System attempts 4G cellular upload before locking day. |
| **5** | **Branch PC Hardware Failure** | Local hard drive failure. | Replace PC; install app; restore full branch state from cloud. | Cloud database has latest synchronized ledger. |
| **6** | **Cloud Server Unscheduled Outage**| Central cloud server offline. | All showrooms continue operating locally on SQLite/IndexedDB. | Showrooms unaffected; queues sync until server returns. |
| **7** | **In-Transit Truck Breakdown** | Carrier truck stranded on motorway. | Transfer record flagged with delay notice; VINs stay In-Transit. | Destination cannot sell VINs until truck arrives. |
| **8** | **Missing Unit During Cycle Count** | Floor bike unaccounted for. | System flags VIN with CRITICAL AUDIT LOCK; blocks sale. | Red alert dispatched to National Internal Audit. |
| **9** | **Transit Scratch on New Bike** | Vehicle arrives with paint damage. | Receiving manager marks Discrepancy; routes unit to Bay Q-3. | Insurance docket generated; carrier billed for repair. |
| **10**| **Disputed Warranty Battery Claim**| Customer claims dead battery. | Mechanic scans OBD DTCs; checks SOH (<70%) and delta (>180mV).| 3-way hardware lock stops fraudulent battery swaps. |
| **11**| **Concurrent Customer Edits** | Branch A & B edit same customer. | Non-conflicting fields merged; conflicting fields use timestamp. | Server logs field-level audit trail with original values. |
| **12**| **Price Changed While Offline** | Branch quotes with cached price. | Quotation honors cached validity date (7 days) as commercial quote. | Central server flags price delta on conversion if expired. |
| **13**| **Employee Centrally Deactivated** | User marked Inactive at Head Office. | Deactivation token delivered during next sync cycle. | Branch client terminates local session and locks access. |
| **14**| **User Permission Centrally Changed** | Super Admin alters staff rights. | Updated permission manifest pushed during periodic sync. | Branch client refreshes UI action privileges immediately. |
| **15**| **Vehicle Allocated in Another City** | Showroom searches remote stock. | Remote stock displays "Last Refreshed" freshness timestamp. | Transfer request enforces real-time lock before truck dispatch. |
| **16**| **Duplicate Payment Entry Attempt** | User clicks submit multiple times. | UI debounces click; local store rejects duplicate transaction ID. | Exactly one payment record is generated and queued. |
| **17**| **Document Number Concurrency** | Two devices generate invoice offline. | Both use compound local IDs (`ORD-PEW-D1-01` vs `ORD-PEW-D2-01`). | Central server assigns sequential official tax numbers on sync. |
| **18**| **Extended Outage (48+ Hours)** | Outbox backlog accumulates. | Transactions accumulate safely up to local disk capacity. | Upon reconnect, sync engine streams transactions in chunks. |

---

# APPENDIX F: Client Approval Items & Architecture Decisions

Before production deployment, executive management and dealership owners must review and formally approve the following business rules:

* [x] **Item A — Offline-Capable Modules:** Approved: Category A (Leads, Customers, Quotes, Workshop Service Intake, Repairs) satisfies all daily showroom continuity requirements.
* [x] **Item B — Restricted Offline Operations:** Approved: Business rules, discretionary spending limits (PKR 15,000), and payment recording rules for Category B operations.
* [x] **Item C — Periodic Synchronization Frequency:** Approved: Proposed 2-hour interval during operating hours plus immediate event-driven push on critical actions.
* [x] **Item D — End-of-Day Branch Closing Blocking Policy:** Approved: RED status (pending cash or vehicle sales) strictly blocks branch managers from closing their showroom register.
* [x] **Item E — Critical Transaction Thresholds:** Approved: Transactions exceeding PKR 15,000 or involving serialized VIN reallocation constitute a "Critical Unresolved Transaction".
* [x] **Item F — Data Freshness Tolerances:** Approved: 24-hour maximum acceptable age for cached stock availability, customer balances, and pricing rules.
* [x] **Item G — Offline Authentication Session Validity Window:** Approved: 24-hour offline token validity before requiring central credential re-validation.
* [x] **Item H — Conflict Authority Matrix:** Approved: Master pricing, user permissions, and national financial accounting are strictly centralized at Head Office.

---

# APPENDIX G: Target Implementation Roadmap (Phases 1 – 19)

Following client approval, production engineering executes in the following 19 structured phases:

1. **Phase 1: Finalize Offline/Online Operational Business Policy:** Lock in approved decisions from Appendix F.
2. **Phase 2: Define Central Backend Schemas:** Architect normalized relational schemas for master entities.
3. **Phase 3: Define Transaction Event Model:** Standardize `client_transaction_id` and payload event schemas.
4. **Phase 4: Define Device Registration & Identity Model:** Implement cryptographic device enrollment and certificates.
5. **Phase 5: Define Bi-Directional Synchronization Protocol:** Design REST/WebSocket delta endpoints and batch contracts.
6. **Phase 6: Build Server-Side Idempotency Engine:** Implement duplicate detection and transaction lookup services.
7. **Phase 7: Implement Conflict Resolution Handlers:** Build domain-specific merge algorithms and audit alerts.
8. **Phase 8: Implement Central Auth & Offline Authorization Cache:** Develop token issuance and offline validity windows.
9. **Phase 9: Build Central Backend Services:** Construct central microservices, databases, and reporting engines.
10. **Phase 10: Build Desktop Operational Database Layer:** Implement local SQLite/encrypted storage engine for Windows.
11. **Phase 11: Build Desktop Synchronization Engine:** Construct background outbox queue, retry, and delta merge logic.
12. **Phase 12: Build Mobile Operational Database Layer:** Implement SQLite / Room local storage on Mobile/Tablet apps.
13. **Phase 13: Package Full-Featured Responsive Mobile App:** Package the complete, full-featured application for Android/iOS with responsive layouts and background sync workers.
14. **Phase 14: Build End-of-Day Reconciliation Workflows:** Develop branch closing screens, summary audits, and register sign-offs.
15. **Phase 15: Build Central Sync Health Monitor:** Construct Super Admin real-time nationwide branch sync monitoring UI inside the Desktop Application.
16. **Phase 16: Failure & Recovery Stress Testing:** Simulate network drops, power cuts, packet losses, and merge conflicts.
17. **Phase 17: Pilot Deployment (Peshawar Showroom):** Deploy production client in a single live showroom for 30-day trial.
18. **Phase 18: Operational Audit & Optimization:** Review sync logs, optimize database indexing, and refine staff UX.
19. **Phase 19: Full Nationwide Rollout & Individual Employee Identity Modules:** Deploy to Islamabad, Lahore, Rawalpindi, and roll out individual employee identities with granular role-based permissions.

---

# APPENDIX H: Core Production Acceptance Criteria

The production system satisfies the following four core business criteria:

1. **Data Loss Acceptance Criterion:**
   > *"Once an approved operational transaction (customer profile, quotation, sales order, payment, or workshop repair) has been committed to the local durable store on a branch device, temporary internet loss, application restart, device reboot, or delayed synchronization must NEVER silently cause that transaction to disappear."*

2. **Customer Experience Acceptance Criterion:**
   > *"A customer visiting an AJ EcoDrive showroom or workshop must NEVER be asked to 'come back later because the internet is down', nor should dealership staff EVER be asked to re-enter transactions that were already committed locally."*

3. **Operational Speed Acceptance Criterion:**
   > *"Routine showroom operations (customer search, lead capture, price quoting, vehicle lookup, and repair logging) must execute with near-instantaneous responsiveness, completely insulated from remote server network latency and internet bandwidth fluctuations."*

4. **Central Consistency Acceptance Criterion:**
   > *"All transactions processed locally across all nationwide branch devices must ultimately reconcile into the authoritative central enterprise database through an auditable, idempotent, conflict-safe synchronization architecture."*

---

> [!IMPORTANT]
> **CLARIFICATION STATEMENT ON CURRENT STATUS:**
> *This documentation defines requirements, operational flows, standardized UI tab architectures, and client approval specifications. In the current interactive prototype phase, workflows execute in high-fidelity demonstration mode. Production installation of the Desktop Application and local database engine will commence following client review and formal sign-off.*

---
*End of AJ EcoDrive Master Client Operational Guide & Production Architecture Blueprint.*
