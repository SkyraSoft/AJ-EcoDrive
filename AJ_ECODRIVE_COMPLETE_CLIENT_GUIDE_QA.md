# AJ ECODRIVE — COMPLETE CLIENT & USER OPERATIONAL GUIDE
## A Master Client Operational Guide & Production Architecture Blueprint (Questions, Scenarios, Branch Operational Continuity & Central Synchronization)

---

## ABOUT THIS GUIDE

This guide is written in **plain, simple language** for showroom staff, branch managers, dealership owners, system architects, and executive clients. It explains the entire **AJ ECODRIVE** Management System through practical real-life scenarios, detailed module workflows, and client-facing architectural requirements.

> [!IMPORTANT]
> **CRITICAL DISTINCTION — PROTOTYPE VS. INTENDED PRODUCTION ARCHITECTURE:**
> 
> * **CURRENT PROTOTYPE (Demonstration System):**
>   The software you are currently viewing in demonstrations is a high-fidelity **interactive frontend prototype**. It runs entirely inside your active web browser session with rich UI components, business logic, validation rules, status flows, and cross-module connections. Because it operates within browser memory, you can walk through the complete lifecycle of a vehicle from purchase order to workshop repair smoothly without needing a live backend database or cloud connection.
> 
> * **INTENDED FINAL PRODUCTION SYSTEM (Target Architecture Awaiting Client Approval):**
>   The final deployed enterprise solution will **NOT** be a browser-only, memory-dependent system. The production system is designed around a **Local-First Branch Operational Architecture**:
>   - **Branch Operational Clients:** Dedicated Desktop (Windows), Tablet, and Mobile (Android) applications designed for rapid showroom floor data entry and high-speed local search.
>   - **Local Durable Operational Store:** Persistent local database (e.g., SQLite / Room) on showroom devices, ensuring that committed customer profiles, quotations, sales, and service cases survive network drops, application restarts, and computer power outages.
>   - **Central Master Backend & Database:** Authoritative central system of record responsible for corporate accounting, global inventory reconciliation, master pricing, user permissions, audit trails, and multi-branch intelligence.
>   - **Two-Way Synchronization & Outbox Queue:** Automatic background synchronization with exponential retry, server idempotency (zero duplicate records), conflict detection, and periodic central data refresh (proposed default: every 2 hours during operating hours).
>   - **End-of-Day Reconciliation & Branch Closing:** Structured daily reconciliation verifying that all local branch transactions are fully uploaded and settled against the central host before closing showroom registers.

---

# TABLE OF CONTENTS

1. [PART 1: Understanding AJ EcoDrive & The Big Picture (Q1 – Q15)](#part-1-understanding-aj-ecodrive--the-big-picture-q1--q15)
2. [PART 2: Logging In, Access Platforms & User Roles (Q16 – Q28)](#part-2-logging-in--user-roles-q16--q28)
3. [PART 3: A Day in the Life of a Branch Manager & Operational Continuity (Q29 – Q42s)](#part-3-a-day-in-the-life-of-a-branch-manager-q29--q42)
4. [PART 4: Handling Walk-In Customers & Managing Leads (Q43 – Q58)](#part-4-handling-walk-in-customers--managing-leads-q43--q58)
5. [PART 5: Quotations & Price Calculations (Q59 – Q75)](#part-5-quotations--price-calculations-q59--q75)
6. [PART 6: Sales Orders & Reserving a Specific Bike (Q76 – Q92)](#part-6-sales-orders--reserving-a-specific-bike-q76--q92)
7. [PART 7: Invoicing, Deposits & Receiving Payments (Q93 – Q108)](#part-7-invoicing-deposits--receiving-payments-q93--q108)
8. [PART 8: Delivery Handover, Ownership & Warranty Activation (Q109 – Q126)](#part-8-delivery-handover-ownership--warranty-activation-q109--q126)
9. [PART 9: After-Sales Service, Warranty Claims & Workshop Repairs (Q127 – Q150)](#part-9-after-sales-service-warranty-claims--workshop-repairs-q127--q150)
10. [PART 10: Showroom Inventory, Transfers & Stock Requests (Q151 – Q172)](#part-10-showroom-inventory-transfers--stock-requests-q151--q172)
11. [PART 11: Branch Petty Cash, Expenses & Internal Messages (Q173 – Q185)](#part-11-branch-petty-cash-expenses--internal-messages-q173--q185)
12. [PART 12: Super Admin / Head Office Operations & Imports (Q186 – Q200)](#part-12-super-admin--head-office-operations--imports-q186--q200)
13. [PART 13: System Settings, Numbering, Audit Logs & Client Demos (Q201 – Q210)](#part-13-system-settings-numbering-audit-logs--client-demos-q201--q210)
14. [PART 14: System Architecture, Operational Continuity & Synchronization Policy (Q211 – Q225)](#part-14-system-architecture-operational-continuity--synchronization-policy-q211--q225)
15. [APPENDIX A: Policy Summary — Operational Continuity & Synchronization](#appendix-a-policy-summary--operational-continuity--synchronization)
16. [APPENDIX B: Target Production Topology Blueprint](#appendix-b-target-production-topology-blueprint)
17. [APPENDIX C: Proposed Offline Operational Classification Matrix](#appendix-c-proposed-offline-operational-classification-matrix)
18. [APPENDIX D: Branch Daily Operational Lifecycle](#appendix-d-branch-daily-operational-lifecycle)
19. [APPENDIX E: Failure & Recovery Scenarios Matrix (18 Critical Events)](#appendix-e-failure--recovery-scenarios-matrix-18-critical-events)
20. [APPENDIX F: Client Approval Items & Architecture Decisions](#appendix-f-client-approval-items--architecture-decisions)
21. [APPENDIX G: Target Implementation Roadmap (Phases 1 – 19)](#appendix-g-target-implementation-roadmap-phases-1--19)
22. [APPENDIX H: Core Production Acceptance Criteria](#appendix-h-core-production-acceptance-criteria)

---

# PART 1: Understanding AJ EcoDrive & The Big Picture (Q1 – Q15)

### Q1: In simple words, what is AJ EcoDrive?
**Answer:** AJ EcoDrive is a complete business management system designed specifically for electric vehicle (EV) dealerships. It handles everything that happens inside an EV showroom and workshop: from importing bikes from manufacturers, tracking every single scooter by its unique chassis number, negotiating sales with customers, receiving cash and bank payments, handing over the bike with official registration, and managing after-sales battery warranty and workshop repairs.

### Q2: Why can't we just use a generic accounting tool like QuickBooks or Excel?
**Answer:** Because generic tools do not understand electric vehicles. An EV is not a bag of sugar. Every single electric bike has a unique VIN (Chassis Number), a Motor Number, and a Battery Serial Number. In Excel, someone can easily sell the same chassis twice by mistake or lose track of whether a battery is still under its 2-year warranty. AJ EcoDrive prevents these mistakes automatically.

### Q3: Who are the main people using this system?
**Answer:** 
1. **Branch Managers & Sales Staff:** Work in the local showrooms (Peshawar, Islamabad, Lahore, Rawalpindi). They handle walk-in customers, create quotes, collect payments, and manage showroom bikes.
2. **Workshop Technicians & Service Advisors:** Inspect customer bikes, fix issues, replace parts, and check if repairs are covered under free warranty.
3. **Super Admins & Head Office Executives:** Oversee all showrooms across the country, purchase new containers of bikes from China or local suppliers, approve large expenses, and analyze company revenue.

### Q4: What does "Multi-Branch System" mean for our business?
**Answer:** It means AJ EcoDrive runs all your dealership locations under one roof. The Peshawar showroom, Islamabad showroom, and Lahore showroom each see their own local stock and sales, while the Head Office can see the entire company at a glance.

### Q5: Can staff in Peshawar sell a bike that is physically located in Islamabad?
**Answer:** No. The system strictly isolates showroom inventory. A salesperson in Peshawar can only reserve and sell bikes that are physically present in the Peshawar showroom. If Peshawar needs a bike from Islamabad, they must submit a Stock Transfer Request first.

### Q6: What does "Serialized Unit" mean?
**Answer:** In EV dealerships, "serialized unit" means an individual, physical vehicle identified by its unique **VIN / Chassis Number**. While a product category might be "BRG E-125", the actual serialized unit on the showroom floor is "VIN-PK-BRG-2026-00812". The system tracks its exact lifecycle from the day it arrives in a shipping container until it is retired.

### Q7: What are the different states a bike goes through in its life?
**Answer:** A bike moves through these clear stages:
1. **Available:** Sitting in the showroom, ready to be inspected and sold.
2. **Reserved:** A customer has agreed to buy it, so no other customer can take it.
3. **Sold:** Payment has been received; bike is being prepped for delivery.
4. **Delivered / Customer Owned:** The customer has physically driven the bike home.
5. **In Service / Maintenance:** The customer brought it back to the workshop for maintenance.
6. **Transfer in Transit:** The bike is currently loaded on a truck traveling between branches.
7. **QC Hold:** Flagged for quality inspection or transit damage.

### Q8: What currency does the system use?
**Answer:** The entire system operates in **Pakistani Rupees (PKR)** across all invoices, quotes, payments, reports, and dashboards.

### Q9: Does the system track spare parts like tyres, brake pads, and batteries?
**Answer:** Yes. The catalogue includes vehicles, spare parts, and workshop labour rates. Parts are linked directly to repair job cards and warranty claims.

### Q10: How does AJ EcoDrive handle warranties?
**Answer:** Every vehicle sold automatically activates an official OEM Warranty (e.g., 2-Year or 3-Year Battery and Controller Warranty). The start date is locked to the exact day the customer receives the bike. When the customer visits the workshop, the system automatically checks whether their warranty is active.

### Q11: What happens if a customer comes in for a repair under warranty?
**Answer:** The system creates a Repair Job Card. If a faulty controller costs PKR 6,000 to replace, but the vehicle has an active warranty, the system marks:
* **Gross Repair Cost:** PKR 6,000
* **Warranty Coverage:** PKR 6,000 (100%)
* **Customer Payable:** **PKR 0**
The customer walks away satisfied without paying a single rupee, and the dealership records the claim.

### Q12: What if the repair is due to an accident not covered by warranty?
**Answer:** The technician marks the repair as non-warranty. The customer payable becomes PKR 6,000, and an official invoice is generated for the customer to pay at the counter.

### Q13: What is the "Audit Log" that everyone talks about?
**Answer:** It is a digital black box. Every time anyone creates an order, approves a discount, changes a role, dispatches a transfer, or collects money, the system automatically logs who did it, what branch they belong to, the exact minute it happened, and what changed. Nobody can alter or delete this history.

### Q14: Is my customer data connected across all screens?
**Answer:** Yes. When you register customer "Ahsan Khan" once, his name, phone, CNIC, and address automatically link to his Quotations, Sales Orders, Invoices, Delivery Handover, Warranty Card, and Workshop Case. You never have to re-type customer details twice.

### Q15: Why is this version called an "Interactive Prototype"?
**Answer:** It means the complete layout, buttons, popups, workflows, calculations, and rules are 100% operational in your browser so you can test, train staff, and evaluate the business workflows before the production client applications, synchronization layer, and central database are deployed.

---

# PART 2: Logging In, Access Platforms & User Roles (Q16 – Q28)

### Q16: How do I open and log into AJ EcoDrive in the intended production system?
**Answer:**
1. **Branch Showroom & Workshop Staff (Desktop / Android Operational Clients):**
   - **Showroom Desktops (Windows):** Staff launch the dedicated AJ EcoDrive Desktop Application from their desktop shortcut. This native client connects directly to the local operational database on the PC for high-speed local data entry and instant search.
   - **Showroom Tablets & Handhelds (Android):** Sales consultants on the showroom floor and technicians in the workshop bay launch the AJ EcoDrive Android Application on their tablets.
   - **Authentication:** When connected, staff authenticate against the central directory. In offline mode, staff can log in using cached, encrypted credentials within an approved offline session validity window.
2. **Super Admin & Executive Management (Central Web Management Portal):**
   - Executives and central administrators access the Central Web Portal via any secure modern browser with Multi-Factor Authentication (MFA) to manage cross-branch approvals, master procurement, system configuration, and national financial reporting.

### Q17: What demo accounts can I use right now to test the system?
**Answer:** The current interactive demonstration system features pre-configured credentials for both Super Admin and Branch Managers. You simply enter the **Username / Branch Code** and the universal demo password **`password`**:

1. **SUPER ADMIN (Company-Wide Management):**
   * **Username / Code:** `admin` (or `ADMIN`, `superadmin`, `admin@ajecodrive.com`)
   * **Password:** `password` (also accepts `password123` or `admin123`)
   * **Workspace:** Gives full nationwide oversight across all 4 showrooms (Peshawar, Islamabad, Lahore, Rawalpindi) with live branch switching, master procurement, system configuration, and company-wide financials.

2. **BRANCH MANAGERS (Local Showroom Operations):**
   * **Username / Code:** Enter the showroom **Branch Code** (or city name):
     * **Peshawar Showroom:** `PEW-01` (or `peshawar` or `PEW`)
     * **Islamabad Showroom:** `ISB-01` (or `islamabad` or `ISB`)
     * **Lahore Showroom:** `LHE-01` (or `lahore` or `LHE`)
     * **Rawalpindi Showroom:** `RWP-01` (or `rawalpindi` or `RWP`)
   * **Password:** `password` (also accepts `password123`)
   * **Workspace:** Automatically opens the local showroom workspace locked strictly to that branch's inventory, walk-in leads, quotations, customer sales, and workshop repairs.

*(In the future production deployment, each employee will have a unique personal corporate identity and role-based access control managed centrally by Head Office).*

### Q18: What is the visual difference when a Branch Manager logs in versus a Super Admin?
**Answer:** 
* When a **Branch Manager** logs in, the green top banner and sidebar display: **"WORKSPACE: Branch Manager"** and locks the showroom to **Peshawar**.
* When a **Super Admin** logs in, the sidebar displays: **"SIGNED IN AS: Super Admin"** with a branch dropdown allowing them to view Peshawar, Islamabad, Lahore, or Rawalpindi.

### Q19: Can a Branch Manager switch their showroom to another city?
**Answer:** No. For security and operational accuracy, a Branch Manager's account is locked to their physical showroom. They cannot accidentally view or tamper with other showrooms' records.

### Q20: Where can I see my personal user profile?
**Answer:** Click on your user avatar or initials in the top right corner of the header, and select **My Account** (or navigate to `/account`).

### Q21: What information can I edit in My Account?
**Answer:** You can update your display name, contact phone number, email address, and notification preferences.

### Q22: Can a Branch Manager promote themselves to Super Admin from their Account page?
**Answer:** No. The role and branch fields are strictly read-only and greyed out. Only the Super Admin from the central Users & Access module can change someone's role.

### Q23: How do I change display preferences like Dark/Light theme or date formatting?
**Answer:** In the top right user menu, click **Preferences** (or navigate to `/preferences`). Here you can set date formats (e.g., `DD MMM YYYY`), table row density (Compact or Comfortable), and alert toggles.

### Q24: What happens if I click "Forgot Password" on the login screen?
**Answer:** The system guides you through the recovery flow: you enter your registered email, receive a mock reset token, verify your identity, and set a new password according to the password policy (minimum 8 characters).

### Q25: How do I log out safely at the end of my shift?
**Answer:** Click your user initials in the top right corner of the screen and click **Sign Out**. The session will be cleared immediately and you will be returned to the Login screen.

### Q26: What happens if I leave my computer unattended?
**Answer:** The system settings define a standard session timeout policy of 60 minutes. In the production client, the screen locks automatically after the idle threshold, requiring password re-entry to protect local showroom records and financial transactions.

### Q27: Can an employee who has been deactivated log in?
**Answer:** No. If an administrator sets an employee's status to **Inactive**, their login is blocked immediately on the central server. On offline branch operational clients, deactivation tokens propagate automatically during the next synchronization cycle, terminating any cached offline authorization.

### Q28: If an employee leaves the company, do past invoices and records lose their name?
**Answer:** No. Historical traceability is preserved forever. Past orders, invoices, and audit logs will continue to show that the former employee created them.

---

# PART 3: A Day in the Life of a Branch Manager & Operational Continuity (Q29 – Q42)

### Q29: What is the very first screen a Branch Manager sees in the morning?
**Answer:** The **Branch Performance Dashboard** (Home -> Dashboard). It shows live counts of vehicles currently in the showroom, today's sales revenue, pending customer deliveries, and open repair jobs in the workshop.

### Q30: What is the "Action Centre"?
**Answer:** The Action Centre (Dashboard -> Action Centre) is your daily to-do list. Instead of hunting through different screens, the Action Centre highlights everything requiring immediate action:
* Customer quotations awaiting confirmation.
* Bikes ready for customer delivery.
* Incoming transfers on trucks arriving today.
* Low stock warnings for fast-selling models.
* Customer follow-ups due today.

### Q31: How do I quickly know if a customer follow-up call is due today?
**Answer:** Check the **Follow-ups Due Today** card on the dashboard or navigate to **Sales -> Follow-Ups**. It highlights calls scheduled for today with a green badge and gives you one-click access to the customer's phone number.

### Q32: What does the "Unread Alerts" bell icon in the top header mean?
**Answer:** The bell icon shows your active branch notifications. If Head Office approves a stock transfer, or an incoming shipment has been dispatched, a badge appears with the count. Clicking it opens a preview, and clicking any alert takes you directly to that record.

### Q33: How does a Branch Manager know how many bikes are ready to be sold today?
**Answer:** Look at the **Available Units** KPI card on the dashboard, or click **Inventory -> Serialized Units**. Filter by status **Available**. You will see every bike physically on the floor with its colour and chassis number.

### Q34: Can a Branch Manager view the national sales of other cities?
**Answer:** No. Branch Managers see their own showroom metrics. Only Super Admins have global cross-branch visibility.

### Q35: What should I do if a customer calls about an order they placed yesterday?
**Answer:** Use the global search bar at the top of the screen. In the production operational client, searches execute with near-instant speed directly against the local durable database on the branch computer. You can type the customer's phone number, CNIC, name, or Order ID (e.g., `ORD-2241`), and press Enter. The customer's order opens immediately without waiting for central network round-trip latency.

### Q36: Where do I find messages or memos sent by the Head Office?
**Answer:** Click **Communications -> Inbox** in the sidebar. You will see the **Management Inbox**, which serves as the official operational communication hub for your showroom:
* **Direct Threads with Head Office:** Urgent stock allocation approvals, expense authorizations, and executive directives.
* **Multi-Branch Collaboration Threads:** Collaborative conversations where multiple branch managers (e.g., Peshawar and Lahore) and Head Office coordinate inter-branch stock transfers and regional logistics together in a single thread.
* **Document Attachments Table:** Formal files, signed booking forms, carrier dispatch slips, and PDI checklists organized in a clean table showing who shared each file, the exact timestamp, file size, and download actions.
* **System Announcements:** Company-wide policies, price adjustments, and holiday schedules.

### Q37: How do I know if the workshop is overloaded today?
**Answer:** The dashboard features an **After-Sales Service** widget showing how many repair jobs are currently **In Progress**, **Awaiting Parts**, or **Quality Check**.

### Q38: Can I create a new lead, quote, or expense directly from the dashboard? How do Dashboard Quick Actions work?
**Answer:** **Yes — and Quick Actions open directly in-context as interactive modal popups instead of redirecting you away!**
On the Branch Manager Dashboard, the **Quick Actions** card provides one-click instant creation buttons:
1. **New Quotation:** Opens the Quotation creation modal popup directly over the dashboard.
2. **Request Stock:** Opens the Inter-Branch Stock Request form modal directly in place.
3. **Record Expense:** Opens the Branch Expense entry modal directly in place.
4. **Open Service Case:** Opens the Workshop Warranty / Repair Case modal directly in place.
When you finish and save, the modal closes and you remain right on your dashboard without having had to leave the screen.

### Q39: What should I check before opening the showroom doors each morning?
**Answer:** 
1. **Launch the Branch Client & Run Morning Sync:** Open the AJ EcoDrive operational application. The system connects to the central server to pull overnight stock transfer approvals, newly dispatched shipments, master price list adjustments, and executive directives, while confirming the branch operational date.
2. **Check the Action Centre:** Review customer bike handovers scheduled for today.
3. **Check Stock Requests:** Verify which inventory requests were approved by Head Office.
4. **Check Follow-Ups:** Plan phone calls for interested prospects due today.

### Q40: What happens if the internet goes down temporarily?
**Answer:** Temporary internet loss will not stop showroom operations. AJ ECODRIVE is designed around a **Local-First Branch Operational Architecture** using a durable local operational data layer on branch desktop, tablet, and mobile clients for approved workflows. Changes made while offline are committed immediately to the device's local database and placed into an Outbox Synchronization Queue. When internet connectivity returns, the client automatically uploads and synchronizes those changes with the central backend and refreshes relevant central data. The branch will also perform periodic synchronization/reconciliation during the working day (proposed default: every 2 hours) and a controlled end-of-day synchronization and closing process. Critical operations may require live central verification according to approved business rules.

*(Note: In the current interactive prototype demonstration, operations run locally in browser session memory so you can preview workflows; the production architecture uses a persistent, durable local database on the machine).*

### Q40a: Why does AJ EcoDrive require a local operational data layer instead of a traditional browser-only website?
**Answer:** Because branch managers and showroom staff are **busy operational users** working in fast-paced retail and workshop environments. Their primary daily requirement is:
* **Fast Data Entry:** Registering walk-ins, building quotes, and logging repairs without waiting for remote server round-trips.
* **Instant Local Search:** Looking up customers by phone number or CNIC, and bikes by Chassis / VIN in milliseconds.
* **Zero Network Dependency:** Operations must continue smoothly even when local internet providers experience latency, throttling, or unexpected cable cuts.

**Consider this realistic dealership morning scenario:**
* **09:30 AM:** A customer arrives at the showroom to buy a BRG E-125 scooter.
* **09:32 AM:** Sales staff searches the customer's phone number locally in 0.2 seconds.
* **09:35 AM:** Customer profile details are updated.
* **09:45 AM:** Formal quotation is prepared.
* **10:00 AM:** Customer agrees to purchase; sales contract creation begins.
* **10:05 AM:** The local showroom internet connection fails completely.
* **10:06 AM:** Staff continues permitted sales operations without interruption because the application operates against the local operational store.
* **10:25 AM:** The sale is completed, assigned a unique local transaction ID, committed to the local database, and queued in the Outbox.
* **10:30 AM:** Internet is still down; staff continues serving subsequent walk-in customers and logging repair jobs.
* **11:15 AM:** Showroom internet connectivity is restored.
* **11:16 AM:** The synchronization engine automatically detects connectivity and begins uploading queued transactions in the background.
* **11:20 AM:** Central server confirms and reconciles all transactions into the national master ledger.

Under AJ EcoDrive's architecture:
* The customer is **never** told: *"Please come back later because our internet is down."*
* The staff is **never** told: *"Please re-enter everything you typed this morning when the internet comes back."*

### Q40b: What is the core business idea and real-world banking inspiration behind this branch operational model?
**Answer:** The proposed branch architecture follows the proven operational principles of **decentralized branch banking systems** (such as documented in Oracle FLEXCUBE branch architectures):
1. **Branch-Local Operational Capability:** Each branch maintains a localized operational data layer containing the data necessary for daily branch business.
2. **Offline Transaction Tanking:** When connectivity to the central host is interrupted, branch staff continue approved operational transactions, which are durably stored ("tanked") in a local transaction queue.
3. **Upload & Untanking Upon Reconnection:** When the central link is restored, tanked transactions are systematically uploaded, validated, and untanked into the central system of record.
4. **Periodic Host Replication:** The central host periodically pushes updated master data, authorizations, and cross-branch information down to branch nodes.

*(Architectural Note: This reference serves as architectural inspiration for high-reliability branch operations; it is not a claim that AJ EcoDrive is a bank or implements every banking feature).*

### Q40c: How does the current interactive prototype differ from the intended final production architecture?
**Answer:** The table below clearly contrasts the two environments:

| Feature / Dimension | Current Interactive Prototype (Demo) | Intended Final Production System (Target) |
| :--- | :--- | :--- |
| **Execution Environment** | Web browser tab | Native Desktop (Windows), Tablet, & Mobile (Android) clients |
| **Data Storage** | Temporary browser memory (Vue reactivity / JS state) | Persistent local database (e.g. SQLite / Room) on device |
| **Network Reliance** | Single isolated session | Central enterprise backend & central SQL database |
| **Data Durability** | Discarded on browser tab close or refresh | 100% durable; survives tab close, app restart, and PC reboot |
| **Synchronization** | None (self-contained logic) | Bi-directional synchronization engine with Outbox queue |
| **Idempotency** | In-memory unique keys | Server-side idempotency keys & duplicate transaction prevention |
| **Reconciliation** | Real-time in-session mock updates | Periodic 2-hour delta sync + formal End-of-Day branch closing |
| **Audit Authority** | In-memory session audit ledger | Immutable central cryptographic audit ledger across all branches |

### Q40d: What is the intended production topology connecting branches and the Head Office?
**Answer:** The future production system is structured into two distinct operational tiers connected across secure WAN/Internet:

```text
CENTRAL SYSTEM (Head Office / Cloud Infrastructure)
─────────────────────────────────────────────────────────────────
  Central Enterprise Backend (REST / Sync APIs)
  Central Authoritative Database
  Central Authentication & Corporate Directory
  Central Role & Permission Management
  National Consolidated Reporting & Financial Ledger
  Central Master Catalog & Master Price Lists
  Central Multi-Branch Audit Vault
  Central Synchronization & Reconciliation Services
─────────────────────────────────────────────────────────────────
                              ↕
                SECURE INTERNET / WAN / VPN
                              ↕
BRANCH OPERATIONAL CLIENTS (Showrooms & Workshops)
─────────────────────────────────────────────────────────────────
  [ Desktop (Windows) ]     [ Tablet (Android) ]     [ Mobile ]
  Local Operational Database (Durable SQLite / Room store)
  Local Transaction Outbox Queue (Pending Sync)
  Local Search Index & Fast Working Cache
  Local Business Validation & Workflow Engine
  Background Synchronization Engine
─────────────────────────────────────────────────────────────────
```

In addition, a **Central Web Administration Portal** is provided for Super Admins, auditors, and executive management for global governance, central approvals, and cross-branch oversight.

### Q40e: How does the Local-First Operational Model work during daily branch operations?
**Answer:** When staff perform an approved operation (e.g., entering a customer, creating a quote, logging a service case):
1. **User Action:** Staff fills out the form and clicks "Save" or "Confirm".
2. **Local Validation:** The local client validates required fields, business rules, and constraints instantly.
3. **Local Durable Commit:** The record is written directly to the local database on the machine.
4. **Outbox Queue Entry:** A synchronization task with a unique `client_transaction_id` is placed into the local Outbox Queue.
5. **Immediate Feedback:** The user receives instant confirmation and can proceed to their next task with zero delay.
6. **Background Central Sync:** In the background, the synchronization engine transmits the queued change to the central backend. Once confirmed by the server, the local record is flagged as `Synced`.

Staff are never forced to wait for remote server latency for routine operational tasks.

### Q40f: Why is durable local data completely different from web browser memory or open tabs?
**Answer:** Browser memory relies on active JavaScript variables. If a user refreshes the browser, closes the tab, or the computer crashes, browser memory is erased. 
By contrast, **Durable Local Storage** in the production client writes records to encrypted, persistent files on the computer's hard drive (such as an embedded relational database). Even if:
* The computer suddenly loses power,
* The operating system reboots for an update,
* The application is closed and reopened hours later,
every customer entered, quote prepared, and transaction recorded remains fully intact on the disk and ready for synchronization.

### Q40g: What operations can staff perform offline versus what operations require live internet connection?
**Answer:** To ensure both operational continuity and enterprise safety, operations are classified into three distinct categories (proposed policy subject to final client approval):

* **Category A: Fully Offline-Capable (Immediate Local Execution)**
  * Registering new walk-in leads and customer accounts.
  * Updating customer contact details, addresses, and notes.
  * Preparing price quotations and calculating net pricing.
  * Intake of workshop service cases, defect descriptions, and inspection job cards.
  * Adding repair notes, labor time, and requested spare parts.
  * Routine local inquiries (searching local stock, viewing historical showroom orders).
* **Category B: Restricted Offline-Capable (Permitted Under Defined Business Rules & Limits)**
  * Sales order creation and vehicle reservation (restricted to verified local showroom stock).
  * Recording customer payments (subject to daily offline threshold limits and required physical proof).
  * Logging showroom petty cash expenses (within branch manager authorized limits).
  * Dispatching approved inventory transfers.
* **Category C: Online-Required / Centrally Verified (Must Have Live Central Connection)**
  * Modifying user roles, security permissions, or employee access rights.
  * Super Admin creation of new branches or corporate catalog price list revisions.
  * Approving inter-branch stock transfers from another city.
  * Final inter-branch financial settlements and company-wide closing.
  * Approving expense requests that exceed the branch manager's discretionary ceiling.

### Q40h: How does the system ensure sales and customer records are never lost during an outage?
**Answer:**
1. **Atomic Local Commit:** When a sale or customer profile is confirmed, it is committed to local disk storage before acknowledging success to the user.
2. **Unique Client Transaction Identifier (`client_transaction_id`):** Every offline record is tagged with a globally unique identifier combining the branch code, device ID, and sequential timestamp (e.g., `TX-PEW-DEV1-20260923-00042`).
3. **Outbox Retention:** The record remains in the local Outbox until an explicit cryptographic acknowledgment is returned by the central backend.
4. **Zero Silent Loss:** If the client application is shut down, the Outbox is reloaded automatically upon the next launch, guaranteeing that no transaction is ever dropped.

### Q40i: How does the server prevent duplicate sales or payments when an offline device uploads its queue?
**Answer:** Through **Idempotent Server Processing**. When a branch client uploads a batch of transactions after a network restoration:
* If the network drops *while* the server is acknowledging upload attempt #1, the client will retry upload attempt #2 with the exact same `client_transaction_id`.
* The central server inspects its transaction registry. Recognizing that `TX-PEW-DEV1-20260923-00042` has already been recorded, it **does not** create a duplicate sale or duplicate payment.
* Instead, the server returns the existing confirmed transaction reference and status code, allowing the client to safely mark the record as `Synced`.

### Q40j: What does the Outbox / Sync Queue do and what sync statuses will staff see?
**Answer:** The Outbox is a dedicated background manager that handles data transport between the branch and Head Office. Staff will see a subtle, non-intrusive status indicator in the application header:
* `ONLINE`: Connected to Head Office; transactions synchronize in real time.
* `OFFLINE`: Network unavailable; transactions are safely saved to local disk.
* `PENDING SYNC (3)`: Operational records are waiting in the Outbox for network availability.
* `SYNCING...`: Currently transferring queued records to the central server.
* `SYNCED`: All local transactions match the central system of record.
* `ATTENTION / CONFLICT`: An item requires review before final central settlement.

Staff also see a clear timestamp: *"Last Synchronized: Today at 10:42 AM"*.

### Q40k: How does Periodic Central Data Refresh work during the working day?
**Answer:** Periodic synchronization is a **two-way reconciliation** that occurs at scheduled intervals (proposed default: **every 2 hours** during active operating hours, configurable by management):
1. **Outbound Push:** The client uploads all pending local sales, customer edits, workshop entries, and expenses.
2. **Inbound Pull:** The central server sends down updated enterprise data:
   * Newly approved inter-branch stock allocations and truck dispatches.
   * Central price adjustments and promotional campaigns.
   * Cross-branch vehicle availability across Islamabad, Lahore, and Rawalpindi.
   * Central management announcements and executive directives.
   * Updated customer credit balances or payments made at other branches.
3. **Delta Merging:** Crucially, periodic sync **does not wipe or replace** the local database. It performs an incremental delta merge, protecting all local in-progress work while refreshing external data.

### Q40l: What happens if the branch computer restarts or shuts down while offline?
**Answer:** Nothing is lost. When the computer reboots and staff launch AJ EcoDrive:
1. The application immediately mounts the local durable database.
2. It detects all un-synchronized transactions in the Outbox.
3. It displays the pending synchronization badge (e.g., `Pending: 4`).
4. As soon as the network becomes available, the sync engine resumes uploading right where it left off.

### Q40m: How are data conflicts handled when the branch and Head Office make simultaneous changes?
**Answer:** AJ EcoDrive enforces domain-specific conflict resolution rules rather than naive "last-write-wins":
* **Customer Profile:** Non-conflicting fields are merged automatically; conflicting contact updates are resolved using server timestamp versioning.
* **Product Catalog & Pricing:** Strictly **Server-Authoritative**. Central management controls prices.
* **Vehicle Inventory:** Reconciled via a **Transactional Movement Ledger** rather than overwriting count totals.
* **Customer Payments:** Handled as an **Append-Only Ledger**. Multiple payments across branches are combined additively.
* **User Permissions & Security:** Strictly **Server-Authoritative**. Deactivations and permission revocations take precedence.

### Q40n: How does the Branch Daily Working Model operate from morning open to evening close?
**Answer:** A typical operational day follows this structured flow:
1. **Morning Open (08:30 AM):** Branch Manager opens application $\to$ Morning sync pulls latest central stock, prices, and approvals $\to$ Confirms branch operational date.
2. **Daily Showroom Operations (09:00 AM – 06:00 PM):** Fast walk-in customer capture, quotations, sales, and workshop repairs executed with zero latency against local store.
3. **Continuous Background Sync:** When online, changes sync in real time; if offline, transactions tank safely in the local Outbox.
4. **Periodic Reconciliation:** Every 2 hours, client pushes local delta and pulls central updates.
5. **Evening End-of-Day Sync (06:00 PM):** Branch Manager initiates End-of-Day sync $\to$ All remaining Outbox items upload to Head Office.
6. **Branch Closing Review:** Manager inspects the closing summary screen $\to$ Resolves any conflicts $\to$ Formally closes the branch register for the day.

### Q40o: What is the End-of-Day Reconciliation and Branch Closing process?
**Answer:** At the end of each business day, the Branch Manager opens the **Branch Closing & Reconciliation** screen. The system presents a clear summary:
* **Total Transactions Today:** e.g., 48
* **Successfully Synchronized:** 46
* **Pending Synchronization:** 2
* **Conflicts / Requires Review:** 0

The system evaluates closing status through three proposed closure levels:
* **GREEN (Ready to Close):** All financial, sales, and inventory transactions are 100% synchronized with the central server. The manager enters the physical cash drawer balance and clicks **Complete Branch Close**.
* **AMBER (Conditional Close):** Non-critical operational records (e.g. general customer inquiry notes) are pending, but all sales and money are synced. The manager may proceed with closing.
* **RED (Closing Blocked):** Un-synchronized vehicle sales, physical stock movements, or cash payments exist without central confirmation. The system prompts the manager to re-establish connection or contact Head Office support before final sign-off.

*(Note: The exact blocking policy for Amber and Red levels will be formally selected during client approval).*

### Q40p: How do Branch Manager permissions and offline authentication work securely?
**Answer:** 
* **Cached Authorization:** The local client caches the user's role, permissions, and encrypted hash upon their last successful online login, with a defined time-to-live validity window (e.g., 24 to 48 hours).
* **Role Enforcement:** Working offline does **not** grant elevated permissions. A Branch Manager remains strictly confined to branch-level operational boundaries.
* **Safety Boundaries:** High-risk actions (such as changing employee roles, wiping audit records, or granting discretionary discounts above branch ceilings) are hard-coded to require live central cryptographic verification.

### Q40q: How are document numbers (Invoices, Orders, Receipts) generated without conflicts when multiple devices work offline?
**Answer:** In a multi-device offline deployment, two devices must never generate the same invoice number (e.g., Device A creating `INV-1001` while Device B creates `INV-1001`). AJ EcoDrive resolves this through:
1. **Unique Client Transaction ID:** Every record is initially identified by its unique origin string (e.g., `ORD-PEW-POS1-00821`).
2. **Reserved Numbering Blocks / Server Settlement:** In the target architecture, each branch/device is either allocated a reserved range of sequential numbers, or the transaction receives its official legal tax invoice number upon central synchronization.

### Q40r: How does Super Admin monitor the synchronization health of all nationwide branches?
**Answer:** In the Central Web Management Portal, Super Admin has access to the **Central Synchronization & Branch Health Dashboard**. This screen displays a nationwide map showing:
* **Showroom Status:** Peshawar (Online), Islamabad (Online), Lahore (Offline — 35 mins), Rawalpindi (Online).
* **Last Sync Timestamp:** Peshawar (10:45 AM), Islamabad (10:44 AM), Lahore (09:12 AM).
* **Pending Outbox Count:** Lahore has 6 transactions queued for upload.
* **Conflict Alerts:** Flags any transactions requiring central administrative review.

This gives executive management complete visibility over connectivity health across all corporate dealerships.

### Q40s: What is the difference between Local Synchronization and Central Backup?
**Answer:** 
* **Local Synchronization:** Is an operational workflow mechanism that moves daily business transactions between branch devices and the central server to maintain business continuity and unified company ledgers.
* **Central Backup:** Is a disaster recovery safety mechanism managed by Head Office infrastructure (automated daily snapshots, offsite cloud storage, and write-once cryptographic archives) to protect corporate history against catastrophic hardware failure.
Both mechanisms are essential and operate together in the production architecture.

### Q41: How do I know which salesperson sold which bike?
**Answer:** Every Sales Order records the assigned salesperson (e.g., "Hamza Ali" or "Bilal Khan"). This attribution is committed into the local transaction record and synchronized to the central master ledger, enabling filtering by individual staff performance across all showrooms.

### Q42: Can a Branch Manager delete a transaction if they make a mistake?
**Answer:** No. In an enterprise system, transactions cannot be silently deleted locally or centrally. If a mistake is made, the order or quote can be **Cancelled** or **Returned**, which creates an immutable audit trail entry that reconciles across both the local client and the central ledger.

---

---

# PART 4: Handling Walk-In Customers & Managing Leads (Q43 – Q58)

### Q43: A new visitor walks into the showroom asking about electric scooters. What screen do I open?
**Answer:** Go to **CRM / Sales -> Leads** and click **+ Create Lead**.

### Q44: What basic information do I enter for a new visitor?
**Answer:**
* **Customer Name:** e.g., "Kashif Mehmood"
* **Phone Number:** e.g., `+92 321 9876543`
* **Model of Interest:** e.g., "BRG E-125"
* **Lead Source:** Walk-in Showroom
* **Initial Status:** New or Qualified

### Q45: What is the difference between a "Lead" and a "Customer"?
**Answer:** 
* A **Lead** is an interested prospect who is browsing, asking for prices, or taking a test drive. They haven't spent any money yet.
* A **Customer** is an official account in your master CRM who has purchased a vehicle, booked an order, or holds an active warranty.

### Q46: Can I schedule a follow-up call with a lead who wants to think about it?
**Answer:** Yes. On the Lead card, click **Add Follow-Up**. Select a date (e.g., tomorrow), set a priority, and enter a note like *"Customer will confirm with his father tonight."*

### Q47: Where will this scheduled follow-up appear tomorrow?
**Answer:** It will appear on your **Dashboard**, in the **Action Centre**, and in the dedicated **Sales -> Follow-Ups** screen under "Due Today".

### Q48: The customer calls back and says, "I want to buy the bike!" How do I turn the Lead into an official Customer?
**Answer:** Open the lead record (`LeadDetail`) and click the green **Convert to Customer** button.

### Q49: What happens behind the scenes when I click "Convert to Customer"?
**Answer:**
1. A new official record is created in the **Customer Master** with an ID like `CUST-832`.
2. The lead's status changes to **Converted**.
3. All phone numbers, emails, and notes transfer to the new customer profile.
4. An entry is made in the system Audit Log.

### Q50: What if the customer already exists in our system? Will it create a duplicate?
**Answer:** No. If the phone number matches an existing customer, the system links the lead to the existing customer's profile rather than creating a duplicate.

### Q51: Is the Customer Detail screen different for a Super Admin versus a Branch Manager?
**Answer:** **No.** Both the Super Admin and the Branch Manager use the **exact same unified, comprehensive Customer Detail screen**. There is zero confusion or visual disconnect:
* When a **Branch Manager** views the screen, it indicates their local showroom branch (e.g., "Peshawar Branch") and scopes actions to their showroom.
* When a **Super Admin** views the screen, it shows the customer's registered branch nationwide and provides unrestricted executive authority.
Both roles see the exact same 4 financial metric cards, the exact same 10 operational tabs, and have full permission to edit customer details.

### Q52: Can I edit a customer's details after they are created? Are all fields editable?
**Answer:** **Yes, 100% of the customer's information is editable.** You can click the **"Edit Customer"** button in the top action bar or the **"Edit Profile"** button inside the Contact tab. This opens the customer modal pre-filled with all their existing information. You can edit:
* **First Name & Last Name**
* **Mobile Phone Number**
* **Email Address**
* **CNIC / National ID Number**
* **Full Residential / Business Address**
* **City**
* **Showroom Branch Assignment** (Peshawar, Islamabad, Lahore, Rawalpindi)
* **Customer Status** (Active, Lead, Inactive)
* **Internal Dealership Notes & VIP Preferences**
When you click **Update Customer**, the record updates immediately, an immutable record is written to the system Audit Log, and all existing sales orders, purchases, vehicle ownership, and payment histories are **strictly preserved** without any loss of data.

### Q53: How does the "automatic addition of purchases and payments" work? It used to be confusing—how is it connected now?
**Answer:** In AJ EcoDrive, customer profiles are automatically and reactively connected to every single transaction:
1. **When a Sales Order is confirmed:** The customer's **Total Orders** counter increases by 1, and their **Lifetime Sales (LTV)** immediately increases by the order amount. If the order has an unpaid balance, it is automatically added to their **Outstanding Balance**. The order also appears instantly in their **Orders & Purchases** tab.
2. **When an Invoice is issued or a Payment is recorded:** As soon as cash, cheque, or bank transfer is received, the customer's **Outstanding Balance decreases immediately**, and the receipt is permanently catalogued under their **Payments** tab with full bank reference details.
3. **When a Vehicle is delivered:** As soon as the customer signs the handover protocol, that vehicle's unique VIN / Chassis Number automatically moves into their **Owned Vehicles** tab, and their **2-Year OEM Warranty** card is activated.
You never have to manually update customer spending or type payment amounts into a customer profile; the entire system connects and synchronizes customer finances automatically from real operational events.

### Q54: What do the 4 top summary cards on the Customer Detail screen tell me?
**Answer:**
1. **Lifetime Sales (LTV):** The total cumulative amount this customer has spent on electric bikes, accessories, and spare parts across their entire relationship with your dealership.
2. **Total Orders:** The exact count of confirmed sales orders placed by this customer.
3. **Owned Vehicles:** How many physical electric scooters are registered to this customer and currently on the road.
4. **Outstanding Balance:** Any pending unpaid amount owed across their active invoices. If the customer has paid in full, it displays **"PKR 0 (Account clear / Zero balance)"** in green.

### Q55: What are the 10 tabs on the Customer Detail screen and what does each one contain?
**Answer:**
1. **Overview:** Complete customer profile card, financial snapshot (total billed, total received, balance due, payment compliance), and quick previews of recent orders and receipts.
2. **Contact & Profile:** Full personal details, CNIC verification, phone, email, residential address, city, branch, and an inline "Edit Profile" button.
3. **Orders & Purchases:** Interactive table of all confirmed sales orders with vehicle model, total price, paid amount, remaining balance, and direct links to view full Order Details.
4. **Invoices:** Official commercial invoices, billing dates, due dates, paid amounts, and payment status (Paid, Partial, Unpaid).
5. **Payments:** Complete payment ledger showing receipt numbers, payment methods (Cash, Bank Transfer, Online), cleared dates, and transaction references.
6. **Owned Vehicles:** Every electric bike owned by this customer, including Chassis / VIN number, product model, color, registration date, and warranty status.
7. **Warranty & Service:** Active 2-Year OEM battery/motor warranty certificates and any workshop repair job cards logged for their bikes.
8. **Leads & Inquiries:** Past showroom walk-in inquiries or online leads that led to this customer's purchase.
9. **Documents & Notes:** Verified document checklist (CNIC copy, sales agreement, PDI delivery inspection, warranty booklet) plus internal dealership notes.
10. **Activity & Timeline:** Tamper-proof audit history recording every single event tied to this customer (registration date, order confirmations, payment receipts, profile edits, and staff signatures).

### Q56: Can I create a new Quotation, Sales Order, or Record a Payment directly from the customer's screen without losing my place?
**Answer:** Yes. On the Customer Detail screen, the header and overview cards provide quick-action buttons: **"Create Order"**, **"New Quote"**, and **"+ Record Payment"**. Clicking any of these opens the respective form directly inside an in-context **modal popup** on your current screen with the customer's name, phone, branch, and customer ID automatically pre-selected. You do not get navigated away from the customer's page, and closing or completing the form returns you immediately to the customer record with updated statistics.

### Q56b: How does the Customer Search autocomplete dropdown work, and does it close automatically?
**Answer:** When typing into the "Search customer..." field on any sales or quotation form:
1. Matching customer names and phone numbers appear instantly in a scrollable dropdown list.
2. Clicking a customer selects them immediately and closes the list.
3. If you click anywhere outside the dropdown or tab away to another field, the list **automatically dismisses and closes**, preventing it from blocking lower cards (such as Pricing or Notes).
4. Pressing the `Escape` key also instantly closes the dropdown.

### Q56c: What happens if I click "+ Add New Customer" while creating a sale or quotation? Will canceling close my order form?
**Answer:** **No.** The "+ Add New Customer" dialog is fully isolated as a nested modal. If you click "Cancel", the "X" button, or click the outer backdrop of the customer registration popup, **only** the customer popup closes. Your underlying Sales Order or Quotation form remains completely intact with all entered items, quantities, and pricing safely preserved. Once saved, the new customer is immediately selected in the parent order.

### Q57: What happens if a customer has an unpaid balance and wants to buy another bike?
**Answer:** The customer screen clearly flags their outstanding balance in amber (e.g. `PKR 85,000`). When a salesperson creates a new quote or order, the system alerts them to the pending balance so the branch manager can collect the previous payment before releasing another vehicle.

### Q58: Can a Branch Manager or Super Admin export the customer list or print customer records?
**Answer:** Yes. From **Sales -> Customers**, you can filter customers by branch, balance status, or keyword, and click **Export to CSV / Excel** to download the complete customer register for accounting or marketing audits.

---

# PART 5: Quotations & Price Calculations (Q59 – Q75)

### Q59: What is a Quotation?
**Answer:** A Quotation is a formal price estimate given to a customer. It tells the customer: *"If you buy this BRG E-125 within the next 7 days, the total price including registration will be PKR 270,000."*

### Q60: How do I create a new Quotation?
**Answer:** Go to **Sales -> Quotations** and click **+ Create Quotation**.

### Q61: What fields do I fill in the Quotation form?
**Answer:**
1. **Customer:** Search and select an existing customer or click "+ Quick Create Customer".
2. **Product:** Select the EV model (e.g., "BRG E-125").
3. **Quantity:** e.g., 1 unit.
4. **Unit Price:** Automatically fills from the official price list (e.g., PKR 280,000).
5. **Discount:** e.g., PKR 10,000.
6. **Validity Date:** Defaults to 7 days from today.
7. **Payment Terms:** e.g., "100% Advance / Bank Transfer".
8. **Delivery Lead Time:** e.g., "Within 3 business days".

### Q62: Does creating a quotation deduct a bike from inventory?
**Answer:** **No.** This is a critical business rule. A quotation is only a proposal. The customer hasn't committed yet. Creating a quotation does **not** change inventory or reserve a vehicle.

### Q63: How is the quotation Net Total calculated?
**Answer:** The system calculates:
$$\text{Net Total} = (\text{Unit Selling Price} \times \text{Quantity}) - \text{Discount}$$
For example: $(\text{PKR } 280,000 \times 1) - \text{PKR } 10,000 = \textbf{PKR 270,000}$.

### Q64: Can a salesperson give an unauthorized 50% discount?
**Answer:** No. The system settings define a **Max Branch Discount Allowance** (e.g., 10%). If a salesperson enters a discount higher than permitted, it triggers a manager approval requirement.

### Q65: Can I print the Quotation to hand it to the customer on paper?
**Answer:** Yes. Open the quotation and click the **Print** button in the top right. It formats a clean, branded quotation document with your company name, logo, vehicle specifications, validity date, and terms.

### Q66: Can I download the quotation as a PDF?
**Answer:** Yes. Click **Download PDF** to save or email the quote directly to the client.

### Q67: Where does the Quotation show its unique tracking number?
**Answer:** In the top header. The system automatically gives it a number like `QT-1109` using the prefix defined in your system settings.

### Q68: What are the different statuses a Quotation can have?
**Answer:**
* **Draft:** Being prepared; not yet given to the customer.
* **Open / Sent:** Provided to the customer; waiting for their response.
* **Accepted:** The customer agreed to buy.
* **Expired:** The validity date passed without customer response.
* **Rejected:** The customer declined.

### Q69: What happens if a customer accepts the quotation after its expiry date?
**Answer:** The salesperson can review current pricing and click **Edit Quotation** to renew the validity period.

### Q70: How do I turn an accepted Quotation into a confirmed Sales Order?
**Answer:** Open the quotation (`QuotationDetail`) and click the green **Convert to Sales Order** button.

### Q71: Do I have to re-enter all the items when converting a Quote to an Order?
**Answer:** No. The system automatically copies the customer, products, agreed prices, discounts, and terms directly into the new Sales Order.

### Q72: What happens to the Quotation status after conversion?
**Answer:** Its status automatically updates to **Accepted** with a reference linking directly to the new Sales Order ID (`SO-XXXX`).

### Q73: Can a customer ask for accessories (like a helmet or rear cargo box) on the quotation?
**Answer:** Yes. You can click **+ Add Line Item** and add accessories from the catalogue with their individual prices.

### Q74: Can I see who created a specific quotation?
**Answer:** Yes. Every quotation records the salesperson's name and showroom location in its header and audit timeline.

### Q75: Where do I see all open quotations waiting for customer decisions?
**Answer:** Go to **Sales -> Quotations** and click the **Open** status tab.

---

# PART 6: Sales Orders & Reserving a Specific Bike (Q76 – Q92)

### Q76: What is a Sales Order?
**Answer:** A Sales Order is an official contract between the customer and the dealership. It confirms: *"Customer Ahsan Khan has purchased 1 BRG E-125 for PKR 270,000, and vehicle chassis number VIN-PK-BRG-2026-00997 has been reserved for him."*

### Q77: What is "Unit Reservation" and why is it so important?
**Answer:** In an EV dealership, you cannot just say "we sold a bike." You must allocate the **exact physical scooter** that will be prepped, registered, and handed over. Reserving the unit locks its unique chassis number to that customer's order.

### Q78: What happens to the physical bike when I reserve it for an order?
**Answer:**
1. The bike's status in the showroom's local inventory immediately changes from **Available** to **Reserved**.
2. The bike is stamped with `reserved_for_order: ORD-XXXX` and associated with the sales order's unique `client_transaction_id`.
3. It is committed to the local durable store and queued in the Outbox for central synchronization.
4. It immediately disappears from the list of available bikes that other showroom staff can sell.

### Q79: Can another salesperson in the showroom accidentally sell a Reserved bike to someone else?
**Answer:** **No.** The system strictly blocks this. Locally, the unit is marked Reserved immediately, so any attempt to select that chassis displays an instant error: *"Unit is already reserved for Order SO-XXXX."* During central synchronization, the reservation is officially posted to the national ledger. If two disconnected devices ever attempted to reserve the same unit simultaneously, the server's transactional conflict engine detects the collision and preserves the earlier verified transaction.

### Q80: How do I select which bike to reserve for an order?
**Answer:** On the Sales Order form, in the **Allocate Serialized Unit** dropdown, the system displays only the bikes physically present in your showroom with status **Available**. You pick the matching colour and chassis number.

### Q81: What if our showroom has zero available units of that model?
**Answer:** You cannot reserve a unit that doesn't exist. You have two choices:
1. Submit an **Inter-Branch Stock Request** to have a bike shipped from another branch.
2. Create a **Custom Order** (pre-booking) for a vehicle arriving in the next container.

### Q82: What is a Custom Order / Pre-Booking?
**Answer:** When a customer orders a specific colour or model that is currently in transit or at the factory, you create a Custom Order with an expected delivery date. When the shipment arrives, the unit is allocated to them.

### Q83: Where do I see all confirmed Sales Orders?
**Answer:** Go to **Sales -> Orders**. You will see the complete list with customer names, order numbers, amounts, payment statuses, and delivery statuses.

### Q84: What do the different order statuses mean?
**Answer:**
* **Processing / Ready:** Order confirmed, unit reserved, awaiting payment or prep.
* **Invoiced:** An invoice has been generated for payment.
* **Delivered:** The customer has completed payment and taken the bike home.
* **Cancelled:** The order was cancelled and any reserved unit was returned to available stock.

### Q85: What happens if a customer cancels their order before taking delivery?
**Answer:** When you cancel the order, the system automatically **releases the reserved bike**. The bike's status changes from **Reserved** back to **Available** so it can be sold to someone else immediately.

### Q86: Can a Sales Order have multiple vehicles (e.g. a commercial fleet order)?
**Answer:** Yes. A corporate client can purchase 5 or 10 units on a single Sales Order, and each vehicle's chassis number is linked individually.

### Q87: Where do I see which order a specific bike is tied to?
**Answer:** Go to **Inventory -> Serialized Units** and click on the bike. The Unit Detail screen shows: `Reserved For: Order ORD-2241 (Customer: Ahsan Khan)`.

### Q88: Who is authorized to confirm a Sales Order?
**Answer:** Sales Executives can draft orders; Branch Managers confirm them.

### Q89: Can I edit an order after it has been fully delivered to the customer?
**Answer:** No. Once a vehicle has been handed over and ownership is registered, the order is locked to preserve legal and tax history.

### Q90: Does creating a Sales Order automatically generate an invoice?
**Answer:** You can generate the invoice with one click by clicking **Generate Invoice** on the Order Detail screen.

### Q91: What document number does a Sales Order get?
**Answer:** It gets an official prefix like `SO-7741` or `ORD-2241`, matching your dealership numbering configuration.

### Q92: Where can I see the full timeline of an order from quote to delivery?
**Answer:** On the Order Detail screen, scroll down to the **Activity & Timeline** section. It records every event with timestamps and user names.

---

# PART 7: Invoicing, Deposits & Receiving Payments (Q93 – Q108)

### Q93: What is an Invoice in AJ EcoDrive?
**Answer:** An Invoice is the legal financial bill presented to the customer. It shows the gross vehicle price, any applied discount, sales tax, total payable, amount paid so far, and remaining outstanding balance.

### Q94: How is an Invoice created?
**Answer:** Open any confirmed Sales Order and click **Create Invoice** (or go to **Sales -> Invoices -> + Create Invoice**).

### Q95: Can a customer pay in installments or partial advance payments?
**Answer:** **Yes.** AJ EcoDrive supports full payments and partial split payments. For example:
* Total Invoice: PKR 270,000
* Advance Booking Deposit: PKR 150,000 (Paid today)
* Outstanding Balance: **PKR 120,000** (To be paid at handover)

### Q96: What does the Invoice status show when only a deposit is paid?
**Answer:** The invoice status displays a yellow badge: **Partial**, and clearly shows:
* **Paid Amount:** PKR 150,000
* **Outstanding:** PKR 120,000

### Q97: How do I select the Payment Method when recording a payment or creating a sale?
**Answer:** The **Payment Method** is a standardized dropdown selection with all supported business channels:
1. **Bank Transfer (IBFT / Direct Deposit)**: Direct wire or mobile banking transfer to the dealership's account.
2. **Cash (Showroom Cash Register)**: Physical currency handed over at the dealership counter.
3. **Cheque / Pay Order**: Demand draft, cross cheque, or banker's cheque.
4. **Card / POS Terminal**: Debit or credit card swiped at the branch POS machine.
5. **Online Payment Gateway**: Digital payment via QR code, Easypaisa, JazzCash, or online portal.

### Q97b: What extra fields appear if the customer pays via Bank Transfer or Cheque?
**Answer:**
* **If Bank Transfer is chosen:** The system dynamically reveals and enforces:
  - **Transaction ID / Reference Number \***: The bank transfer reference code, IBFT receipt number, or deposit slip ID. The system validates this field and **blocks saving** if it is left empty.
  - **Target Deposit Bank Account**: A dropdown to specify which dealership bank account received the funds (e.g. *Meezan Bank - Main Operations*, *Habib Bank Limited (HBL) - Revenue Collection*, or *Bank Alfalah - Dealership Escrow*).
* **If Cheque is chosen:** The system prompts for the **Cheque Number \*** and the **Drawee Bank Name**.
* **If Cash is chosen:** The system credits the showroom cash drawer without requiring external bank reference numbers.

### Q98: Can a cashier accidentally enter a payment higher than the outstanding balance?
**Answer:** **No.** The system has strict anti-overpayment validation. If the balance is PKR 120,000 and the cashier accidentally types PKR 150,000, the system blocks it with an error: *"Payment amount cannot exceed invoice outstanding balance."*

### Q99: What happens when the final balance of PKR 120,000 is recorded?
**Answer:**
1. Outstanding balance drops to **PKR 0**.
2. Invoice status turns to a green badge: **Paid**.
3. A formal receipt is logged under **Sales -> Payments**.
4. The Sales Order reflects that financial settlement is complete.

### Q100: Can a customer pay half in Cash and half via Meezan Bank transfer?
**Answer:** Yes. You simply record two separate payment entries against the same invoice:
* Payment 1: PKR 100,000 (Cash) -> Ref: `TXN-CASH-01`
* Payment 2: PKR 170,000 (Bank Transfer) -> Ref: `MEEZAN-FT-88910`
Both appear on the customer's ledger.

### Q100b: What is the operational difference between a payment recorded at the showroom counter and a centrally settled payment?
**Answer:** In the production system, payments follow a two-stage financial verification model:
1. **Branch Counter Capture (Local Record):** When a customer hands over cash or presents an IBFT transfer receipt, the cashier records the payment locally. A local customer receipt is generated with a unique `client_transaction_id`. The showroom cash drawer balance is updated, and the transaction is queued in the Outbox.
2. **Central Settlement & Posting (Corporate Ledger):** When the branch synchronizes with Head Office, the payment transaction uploads to the central financial server. Corporate accounting verifies the bank deposit or bank transaction reference against the company's bank statement, officially clearing and posting the payment into the corporate general ledger. This ensures branch staff can serve paying customers quickly while Head Office retains strict fiscal oversight.

### Q101: How do I print an official customer Invoice?
**Answer:** Open `InvoiceDetail` and click the **Print** button in the header. The invoice prints with your dealership's legal name, NTN tax number, customer address, line items, and paid stamp.

### Q102: Can a customer take the vehicle home before the invoice is 100% paid?
**Answer:** Dealership policy requires full payment before delivery. The delivery handover checklist will warn the staff if an invoice has an unpaid balance.

### Q103: Where can the dealership accountant see all payments collected today?
**Answer:** Go to **Sales -> Payments**. You can filter by today's date, showroom branch, and payment method (Cash vs Bank Transfer) to balance the cash register.

### Q104: What is the "Receivables" screen in the Finance menu?
**Answer:** Go to **Finance -> Receivables**. This screen shows all customers across the dealership who owe money, how much they owe, and how many days their payment is overdue.

### Q105: Can an invoice be deleted after a payment is recorded?
**Answer:** No. Accounting principles prevent deleting invoices that have cash or bank payments attached to them.

### Q106: What happens if an invoice is cancelled?
**Answer:** Its status becomes **Cancelled**, outstanding balance is cleared, and no further payments can be recorded against it.

### Q107: Can we apply sales tax to an invoice?
**Answer:** Yes. The invoice calculation includes subtotal, discount, and tax based on the canonical tax rate configured in Settings (e.g. 18%).

### Q108: Does the customer get an SMS or notification when a payment is logged?
**Answer:** Yes, the event system emits a **Payment Posted** notification linked directly to the transaction reference.

---

# PART 8: Delivery Handover, Ownership & Warranty Activation (Q109 – Q126)

### Q109: What is the Delivery Handover process?
**Answer:** Delivery Handover is the official ceremony where the customer arrives at the showroom, inspects their prepped scooter, signs the handover certificate, receives the keys and charger, and drives the vehicle home.

### Q110: Where do I start a Delivery Handover in the system?
**Answer:** Go to **Sales -> Delivery Handover** and click **+ New Handover** (or launch it from the confirmed Sales Order).

### Q111: What physical checks must staff complete during handover?
**Answer:** The system features an inspection checklist:
* Physical inspection (paint, mirrors, bodywork: zero scratches).
* Battery health & initial charge verified at 100%.
* Both master keys and remote fobs provided.
* Smart fast-charger handed over with warranty seal.
* Customer orientation completed (controls, charging safety, tyre pressure).

### Q112: What fields are filled in the Delivery Handover screen?
**Answer:**
* **Order ID:** Links to the customer's Sales Order.
* **Customer Name:** e.g., Ahsan Khan.
* **Chassis / VIN:** The exact allocated bike.
* **Delivery Officer:** The staff member conducting the handover.
* **Customer Acceptance Signature / Confirmation:** Verified.

### Q113: What happens the exact second I click "Complete Handover"?
**Answer:** Four critical things happen simultaneously:
1. **Delivery Status:** Marked **Delivered**.
2. **Vehicle Status:** Changes from **Sold** to **Customer Owned / Delivered**.
3. **Official Ownership:** An official **Ownership Record** (`OWN-XXXX`) is minted linking that chassis number to the customer's CNIC forever.
4. **OEM Warranty:** The **2-Year Battery & Controller Warranty** (`WAR-XXXX`) is automatically activated.

### Q114: Can a warranty activate before the customer actually takes delivery?
**Answer:** **No.** This is a major consumer protection feature in AJ EcoDrive. A 2-year warranty should not run down while a bike is sitting in a warehouse. It only activates on the exact day the customer drives it out of the showroom.

### Q115: Where does the dealership see the customer's new Ownership record?
**Answer:** Under **CustomerDetail -> Vehicles Owned** and in the vehicle's own lifecycle history under **Inventory -> Serialized Units**.

### Q116: What information is printed on the Delivery Handover Certificate?
**Answer:** It prints:
* Dealership Legal Header & Showroom Branch.
* Customer Full Name, Phone, and CNIC.
* Vehicle Model, Colour, VIN / Chassis Number, and Motor Number.
* Handover date and battery state of charge.
* Signatures of Delivery Officer and Customer.

### Q117: What is the Warranty Card number?
**Answer:** The system automatically generates a unique warranty certificate number like `WAR-7500` or `WAR-101`.

### Q118: How long is the standard AJ EcoDrive battery warranty valid for?
**Answer:** The default policy is 24 months (2 Years) from the handover date. The expiry date is calculated automatically (e.g., Handover: 22 Sep 2026 $\rightarrow$ Expiry: 22 Sep 2028).

### Q119: What components are typically covered under the OEM Warranty?
**Answer:**
1. Lithium Battery Pack (capacity degradation, cell failure).
2. Intelligent Brushless Controller.
3. Electric Drive Motor.
4. Digital Instrument Display Cluster.

### Q120: What is NOT covered by the warranty?
**Answer:** Normal wear-and-tear items (tyres, brake pads, accidental crash damage, water submersion, or physical abuse).

### Q121: Can a customer check their warranty status at any showroom nationwide?
**Answer:** Yes. Because warranty records are centralized, an Ahsan Khan who bought his bike in Peshawar can visit the Islamabad workshop, and the technician can verify his active warranty immediately by typing his chassis number.

### Q122: Can a bike be delivered if its chassis number hasn't been allocated?
**Answer:** No. The system requires an allocated vehicle before a delivery handover record can be created.

### Q123: What happens to the showroom inventory count when a vehicle is delivered?
**Answer:** The vehicle leaves showroom custody. Showroom available stock is unaffected because the bike was already in "Reserved/Sold" status, but total branch physical assets decrease by one.

### Q124: Can a delivered bike be returned if there is an issue?
**Answer:** Yes. The system has a dedicated **Sales Returns** module (`Sales -> Returns`) where a formal return inspection and refund/exchange can be processed.

### Q125: Where can I see all deliveries scheduled for this week?
**Answer:** Go to **Sales -> Delivery Handover** and use the **Scheduled** filter tab.

### Q126: Does the customer receive an audit confirmation of their ownership?
**Answer:** Yes, an event `DELIVERY_COMPLETED` is logged in the system audit timeline with the officer's name.

---

# PART 9: After-Sales Service, Warranty Claims & Workshop Repairs (Q127 – Q150)

### Q127: A customer walks into our workshop with an electric scooter making a strange noise. What screen do I open?
**Answer:** Go to **After-Sales -> Warranty & Service** (or `AfterSalesDashboard`) and click **+ Create Service Case**.

### Q128: How do I look up the customer's vehicle during intake?
**Answer:** Type the customer's name, phone number, or the vehicle's **Chassis / VIN number**. The system pulls up their vehicle, purchase date, and active warranty status instantly.

### Q129: What is a "Service Case"?
**Answer:** A Service Case is the customer complaint ticket. For example: *"Customer reports throttle stuttering at low speeds and rear brake squeaking."*

### Q130: What happens to the bike's status in inventory when a service case is opened?
**Answer:** The bike's status automatically transitions from **Delivered** to **Maintenance / In Service**. This lets the dealership know the bike is currently inside the workshop facility.

### Q131: What is a "Repair Job Card"?
**Answer:** A Repair Job Card (`CreateRepairJob`) is the technical work order for the mechanics. It lists the exact spare parts needed and the labour operations to be performed.

### Q132: How do I add spare parts to the repair job?
**Answer:** In the repair form, click **+ Add Part**. Select the part from the catalogue (e.g., *"Electronic Throttle Assembly"*), enter quantity (e.g., 1), and the unit cost (PKR 4,500) fills automatically.

### Q133: How do I add mechanic labour charges?
**Answer:** Click **+ Add Labour**. Select or type the task (e.g., *"Throttle Replacement & Diagnostic Scan"*), enter hours (e.g., 1.5 hours), and the hourly rate (e.g., PKR 1,000) calculates PKR 1,500.

### Q134: How does the system calculate the Gross Repair Cost?
**Answer:**
$$\text{Gross Repair Cost} = \text{Parts Total} + \text{Labour Total}$$
In our example: $\text{PKR } 4,500 (\text{Parts}) + \text{PKR } 1,500 (\text{Labour}) = \textbf{PKR 6,000}$.

### Q135: How does Warranty Coverage work on the repair job card?
**Answer:** On the job card, there is a **Warranty Coverage** selector:
* **Full (100% OEM Warranty):** The issue is due to a factory defect covered by warranty.
* **None (0% - Paid Customer Service):** The issue is due to wear, accident, or out-of-warranty.
* **Custom Coverage:** Dealership provides goodwill or partial coverage.

### Q136: If the repair is 100% under warranty, what does the customer pay?
**Answer:** The system calculates:
$$\text{Customer Payable} = \text{Gross Cost (PKR 6,000)} - \text{Warranty Coverage (PKR 6,000)} = \textbf{PKR 0}$$
The customer pays **zero rupees**.

### Q137: If the repair is NOT covered by warranty (e.g. customer punctured a tyre), what happens?
**Answer:**
* Parts (Rear Tubeless Tyre): PKR 3,500
* Labour (Fitment & Balancing): PKR 1,000
* Warranty Coverage: **PKR 0**
* Customer Payable: **PKR 4,500**

### Q138: How does this non-warranty repair turn into money for the dealership?
**Answer:** On the completed repair job, click **Post to Finance**. The system automatically creates a formal Finance Invoice (`INV-REP-XXXX`) for PKR 4,500, which the cashier collects before the customer leaves.

### Q139: Can a technician post the same repair to finance twice by mistake?
**Answer:** No. Once posted, the job card is permanently stamped `posted_to_finance: true`, and the button is disabled.

### Q140: How do mechanics track their progress on a job?
**Answer:** In `RepairDetail`, there is a step-by-step checklist:
1. Intake scan & diagnostic verification (Completed).
2. Disassembly & component inspection (Completed).
3. Spare part replacement (In Progress).
4. Road test & final quality check (Pending).

### Q141: What happens when the technician clicks "Complete Repair"?
**Answer:** 
1. Job status updates to **Completed**.
2. Progress bar reaches 100%.
3. An automatic notification is sent to the Branch Manager: *"Repair job RJ-XXXX completed and ready for pickup."*

### Q142: How does the customer know their bike is ready?
**Answer:** Staff can view the notification and send an SMS or call the customer directly from the service case contact card.

### Q143: Does the customer get a printed Workshop Invoice / Job Card?
**Answer:** Yes. You can print the formal Job Card showing parts replaced, labour done, warranty coverage breakdown, and customer payable.

### Q144: Can I view all past repairs ever done on a specific vehicle?
**Answer:** Yes. Open the vehicle's `UnitDetail` screen and scroll to **Service & Warranty History**. Every repair job, date, replaced part, and mileage is listed chronologically.

### Q145: What if a repaired part fails again 2 weeks later?
**Answer:** The workshop manager can look up the previous job card number, check which mechanic worked on it, and verify the warranty on the replacement part.

### Q146: Who pays for the parts used in a free warranty repair?
**Answer:** In the dealership accounting, warranty expenses are charged against the manufacturer's warranty reimbursement account, not the customer.

### Q147: What does "QC Hold" mean in the workshop?
**Answer:** If a bike fails the final road test or has an unresolved electrical issue, the service advisor puts it on QC Hold so it cannot be released until safe.

### Q148: Can a customer open a service case without an appointment?
**Answer:** Yes, emergency and walk-in service visits are fully supported.

### Q149: Where does the workshop manager see how many bikes are waiting for parts?
**Answer:** In **After-Sales -> Repair Jobs**, filter by status **Awaiting Parts**.

### Q150: What happens to the bike's status when the customer picks it up from the workshop?
**Answer:** The service case is closed, and the vehicle status returns to **Delivered / Customer Custody**.

---

# PART 10: Showroom Inventory, Transfers & Stock Requests (Q151 – Q172)

### Q151: How does a Branch Manager check exactly what stock is in their showroom?
**Answer:** Go to **Inventory -> Stock by Product** for model summaries (e.g., 5 BRG E-125, 3 BRG X7), or go to **Inventory -> Serialized Units** to see every individual chassis number.

### Q152: Our showroom in Peshawar is running low on BRG E-125 scooters. How do I get more bikes?
**Answer:** Go to **Inventory -> Stock Requests** and click **+ Create Stock Request**.

### Q153: What do I fill in a Stock Request?
**Answer:**
* **Requesting Branch:** Peshawar Showroom.
* **Target Source:** Central Warehouse or Islamabad Branch.
* **Product:** BRG E-125.
* **Quantity Requested:** e.g., 4 units.
* **Urgency:** High.
* **Reason:** *"Weekend sales surge; only 1 display model remaining."*

### Q154: Who approves a Stock Request?
**Answer:** Stock Requests are sent to the **Super Admin / Central Inventory Manager**, who reviews stock levels and approves or adjusts the request.

### Q155: Once approved, how are the bikes physically moved between showrooms?
**Answer:** A formal **Stock Transfer** (`CreateTransfer`) is created to track the shipment.

### Q156: Can someone transfer a bike to the same branch (e.g. Peshawar to Peshawar)?
**Answer:** No. The system validates origin and destination: they must be different branches.

### Q157: What happens when the origin branch clicks "Dispatch Transfer"?
**Answer:** 
1. Transfer status becomes **In Transit**.
2. The specific vehicle chassis numbers are marked **Transfer In Transit**.
3. Physical custody is transferred to the carrier truck (e.g., *"EcoPak Logistics"*).
4. The destination branch receives an alert: *"Transfer TR-XXXX (4 units) dispatched and on the way."*

### Q158: What happens when the delivery truck arrives at the destination showroom?
**Answer:** The receiving manager opens `ReceiveTransfer`, inspects the truck, verifies the physical chassis numbers match the transport manifest, and clicks **Receive Transfer**.

### Q159: What happens behind the scenes when the transfer is received?
**Answer:**
1. The bikes' physical branch location updates immediately to the new city.
2. The bikes' status returns to **Available**.
3. **No duplicate vehicles are created.** The same VINs are simply moved to the new branch.
4. Total company stock remains mathematically identical.

### Q160: What if one bike fell off the truck and arrived scratched?
**Answer:** When receiving the transfer, the manager marks 3 units as **Accepted (Good Condition)** and 1 unit as **Damaged (QC Hold)**. The damaged bike is quarantined for inspection while the other 3 become available for sale immediately.

### Q161: What is a "Physical Cycle Count"?
**Answer:** A Cycle Count (`Inventory -> Cycle Counts`) is an inventory audit where staff walk the showroom floor with a clipboard or tablet, scan/check every physical bike, and compare the physical count against the system records.

### Q162: What happens if the physical count doesn't match the system?
**Answer:** The manager logs an **Inventory Discrepancy**. For example: System says 10 scooters, physical count found 9. An investigation is launched and an authorized **Stock Adjustment** is submitted to resolve the difference.

### Q163: Can any salesperson perform a stock adjustment to write off a missing bike?
**Answer:** **No.** Stock adjustments cannot be done casually. All stock adjustments start as **Pending Approval** and require Super Admin authorization with an audited explanation.

### Q164: What is the "Quarantine" screen in the Inventory menu?
**Answer:** Quarantine is the digital holding area for bikes that cannot be sold right now. This includes bikes with transit damage, factory recall notices, or units awaiting quality inspection.

### Q165: Can a salesperson accidentally sell a quarantined bike?
**Answer:** No. Quarantined bikes have status **QC Hold** and will never appear in the sales reservation dropdown.

### Q166: What is the "Stock Movement Ledger"?
**Answer:** Go to **Inventory -> Stock Movement Ledger**. It is the comprehensive, tamper-proof history of every inventory movement across the company (every GRN receipt, customer reservation, handover delivery, inter-branch transfer dispatch, transfer receipt, warranty intake, and adjustment). In the production architecture, inventory synchronization reconciles these discrete **movement transactions** rather than blindly overwriting stock count totals, ensuring mathematical auditability across branches.

### Q167: Can I search for a bike by its Motor Serial Number instead of Chassis?
**Answer:** Yes. In Serialized Units, you can search by VIN, Chassis Number, Motor Number, or Battery Serial.

### Q168: What colour options are tracked on serialized units?
**Answer:** Every unit records its exact factory paint finish (e.g., Eco Green, Gloss Black, Pearl White, Metallic Grey).

### Q169: Can a Branch Manager see incoming transfers that are on their way to their showroom?
**Answer:** Yes. In **Inventory -> Transfers**, click the **Inbound** tab to see trucks currently on the road headed for your showroom.

### Q170: Does the system record transport carrier information for transfers?
**Answer:** Yes, including carrier company name, driver contact, expected arrival date, and vehicle tracking numbers.

### Q171: What happens if a transfer is cancelled before the truck leaves?
**Answer:** The transfer status becomes **Cancelled**, and the allocated bikes immediately return to Available status at the origin branch.

### Q172: How does the system prevent two branches from claiming the same bike?
**Answer:** Every serialized vehicle record has exactly one authoritative physical custodian (`branch_id`). A vehicle cannot physically exist in two showrooms at once. In the production operational client:
1. Staff can only reserve units physically present in their own showroom's local inventory.
2. Inquiries regarding bikes located in other cities display a clear **"Last Synchronized"** timestamp (e.g., *"Islamabad Stock — Refreshed 18 mins ago"*).
3. If a showroom requests or reserves a unit from another branch, the transaction requires a central transactional check before the transfer manifest is confirmed, guaranteeing zero double-allocations.

---

# PART 11: Branch Petty Cash, Expenses & Internal Messages (Q173 – Q185)

### Q173: How does a showroom pay for daily local expenses like staff tea, cleaning supplies, or electricity bills?
**Answer:** Go to **Finance -> Expenses** and click **+ Create Expense**.

### Q174: What information is entered for a branch expense?
**Answer:**
* **Category:** Utilities, Office Supplies, Tea/Refreshments, Local Marketing, or Showroom Maintenance.
* **Amount:** e.g., PKR 8,500.
* **Merchant / Vendor:** e.g., *"Peshawar Electric Supply Co."*
* **Receipt / Invoice Attachment:** Upload or note.
* **Description:** e.g., *"Monthly showroom electricity bill."*

### Q175: What is the "Branch Expense Approval Limit"?
**Answer:** In the system settings, every branch has an approval threshold (default: **PKR 100,000**).
* If an expense is **below** PKR 100,000, the Branch Manager can approve it locally.
* If an expense is **above** PKR 100,000 (e.g. showroom renovation costing PKR 350,000), it automatically routes to the **Super Admin** for authorization.

### Q176: What happens when an expense is approved?
**Answer:** The expense is marked **Approved** and posted to the branch financial ledger, deducting from the branch petty cash balance.

### Q177: What happens if the Super Admin rejects an expense?
**Answer:** The expense status becomes **Rejected** with an explanation (e.g., *"Invoice receipt missing; please re-submit with stamped bill"*).

### Q178: What is the "Management Inbox" in the Communications menu?
**Answer:** Go to **Communications -> Inbox**. It is your internal dealership messaging and operational collaboration hub. Instead of relying on scattered, easily lost personal WhatsApp chats or phone calls, staff and management can discuss business transactions directly inside the system with full audit traceability.

### Q179: Can a conversation in the Inbox be linked to a specific Sales Order, Stock Request, or Warranty Case?
**Answer:** **Yes.** Every conversation can be formally linked to an operational document (e.g., Stock Request `SR-122`, Expense `EXP-402`, Warranty Case `SC-229`, or Sales Order `ORD-2241`). When viewing the thread, there is a prominent **"View Record &rarr;"** button that deep-links directly to the underlying transaction so you never lose business context.

### Q180: How do Attachments work in a conversation? Are they shown in cards or in a table?
**Answer:** Attachments are displayed in a clean, comprehensive **Table** (not cramped inside cards). When you open the **Attachments** tab inside any conversation, you see a structured ledger containing:
1. **Document Name & Format:** The exact file name with a file-type badge (e.g., `customer_requirement_sr122.pdf`, `lahore_transfer_dispatch_slip.pdf`, `signed_sales_order_ORD2241.pdf`).
2. **Shared / Uploaded By:** The exact staff member who uploaded the file along with their branch badge (e.g., `Ahsan Khan (Branch Manager — Peshawar)`, `Sami Ullah (Branch Manager — Lahore)`, or `Super Admin (Head Office)`).
3. **Upload Date & Time:** Exact audit timestamp (e.g., `Yesterday 09:30 AM`, `Today 10:45 AM`).
4. **File Size & Format:** e.g., `245 KB · Adobe PDF Document`, `512 KB · Adobe PDF Document`.
5. **Operational Purpose / Scope:** Clear business purpose (e.g., *"Customer Booking Evidence"*, *"Inter-Branch Dispatch Slip"*, *"Executive Transfer Authorization"*).
6. **Actions:** Interactive **Download** and **Preview** buttons. Clicking Download or Preview triggers a simulated notification so clients and trainees can experience the exact file retrieval workflow.

### Q181: Can I upload a new attachment to an existing conversation during a demonstration?
**Answer:** **Yes.** Click the **"+ Upload Attachment"** button at the top of the Attachments table. A clean popup allows you to enter a file name (e.g., `pdi_handover_signed_checklist.pdf`), choose its operational purpose (e.g., Customer Proof, Dispatch Slip, Diagnostic Report), and click **Attach File**. The new document immediately appears in the Attachments table, an automated note is posted to the message stream, and an entry is logged in the system Audit Log.

### Q182: Why and how are multiple Branch Managers involved in a single message thread?
**Answer:** In an automotive and EV dealership network, branches do not operate in isolation—they constantly share regional inventory, coordinate inter-branch logistics, and resolve cross-city customer warranties. AJ EcoDrive supports **Multi-Branch Collaboration Threads**:
* **Example — Inter-Branch Stock Transfer (Thread SR-122):**
  1. **Peshawar Branch Manager (Ahsan Khan):** Submits request `SR-122` for 5 scooters to satisfy urgent customer bookings.
  2. **Super Admin (Head Office):** Notes that Central Warehouse is waiting for new import shipments, but Lahore showroom holds 8 surplus units. Head Office loops in Lahore.
  3. **Lahore Branch Manager (Sami Ullah):** Confirms surplus stock and offers to dispatch 5 units (with VIN numbers) via carrier truck `TR-401` the next morning.
  4. **Super Admin:** Authorizes the inter-branch transfer and uploads the formal HQ approval memo.
All three parties participate in the **same thread**, eliminating misunderstandings, preventing double allocations, and keeping a permanent record of who authorized what.

### Q183: How do participants know which showroom sent which message in a multi-branch conversation?
**Answer:** Every message bubble clearly displays the sender's full name and a color-coded **Showroom Branch Badge**:
* **[Peshawar Showroom]** in Emerald Green.
* **[Lahore Showroom]** in Sky Blue.
* **[Islamabad Showroom]** in Amber.
* **[Rawalpindi Showroom]** in Teal.
* **[Head Office Operations]** in Executive Purple.
Furthermore, the **Participants** tab lists every manager and executive in the thread, their role, their branch, and their operational scope (e.g., Requesting Showroom, Supplying Showroom, Authorizing Authority).

### Q184: How do I know if I have unread messages in the inbox?
**Answer:** An unread message badge appears next to **Communications -> Inbox** in the sidebar navigation and on the bell/inbox icons in the top header. When you open a thread, its status changes from **Unread** to **Open** automatically.

### Q185: If I click on an alert that says "New Quotation Generated" or "Stock Request Approved", where does it take me?
**Answer:** The system uses deep linking: clicking any notification or conversation reference takes you straight to that specific quotation, order, transfer, or invoice detail screen (`/sales/quotations/detail?id=QT-XXXX` or `/inventory/transfers`).

---

# PART 12: Super Admin / Head Office Operations & Imports (Q186 – Q200)

### Q186: What does the Super Admin see when they log into AJ EcoDrive?
**Answer:** The **Super Admin Executive Dashboard**. It provides a bird's-eye view of the entire national business: total revenue across all cities, national vehicle inventory, total customer receivables, procurement pipeline, and branch performance comparisons.

### Q187: How does Head Office order new containers of electric bikes from suppliers in China or local manufacturers?
**Answer:** Go to **Procurement -> Purchase Orders** and click **+ Create Purchase Order**.

### Q188: What information is entered on a Purchase Order (PO)?
**Answer:**
* **Supplier:** e.g., "BRG Factory China".
* **Destination Branch:** e.g., Central Warehouse or Peshawar Showroom.
* **Items Ordered:** e.g., 20 units of "BRG E-125" at import cost PKR 210,000 each.
* **Total Order Value:** PKR 4,200,000.
* **Expected Delivery Date:** e.g., 30 days.

### Q189: What lifecycle does a Purchase Order follow?
**Answer:**
1. **Draft / Pending Approval:** Order drafted by procurement officer.
2. **Approved:** Super Admin authorizes the expenditure.
3. **Ordered / In Transit:** Container shipped by the supplier.
4. **Partially Received:** First batch of containers arrived and inspected.
5. **Fully Received / Closed:** Entire shipment verified and entered into stock.

### Q190: What is a "Goods Receipt Note" (GRN)?
**Answer:** When the shipping container physically arrives at the warehouse, the warehouse team performs a Goods Receipt (`ReceivePurchase`). They open the container, check the bikes, and officially receive them into the system.

### Q191: How are the new chassis numbers entered when a container is received?
**Answer:** During receiving, the system records the exact VIN, Chassis Number, Motor Serial, and Battery Serial for every newly arrived scooter.

### Q192: What happens to inventory the moment a GRN receipt is posted?
**Answer:**
1. Each vehicle is registered as a unique **Serialized Unit** with status **Available**.
2. Total product stock increments automatically by the accepted quantity.
3. The Purchase Order updates its received counts.
4. If all 20 units arrived, the PO marks **Fully Received**.

### Q193: What if the shipment was for 20 bikes, but only 12 arrived in the first truck?
**Answer:** The system handles **Partial Receiving**. The PO status becomes **Partially Received** (12/20 received, 8 remaining). When the remaining 8 arrive next week, a second GRN receipt closes the order.

### Q194: How does Super Admin create a new employee account?
**Answer:** Go to **Organisation -> Users & Access** and click **+ Create User**. Fill in name, email, mobile, assigned branch, and assign their role (e.g. Sales Executive, Branch Manager, Technician).

### Q195: Can Super Admin customize permissions for different roles?
**Answer:** Yes. In **Organisation -> Roles & Permissions**, you can configure which screens and actions each role can perform.

### Q196: How does the company add a brand new showroom (e.g. opening a new branch in Multan)?
**Answer:** Go to **Organisation -> Branches** and click **+ Create Branch**. Enter branch name ("Multan Showroom"), code (`BR-05`), address, phone, and assign a Branch Manager. The new branch immediately becomes available across the system.

### Q197: Can Super Admin compare revenue between Peshawar and Islamabad showrooms?
**Answer:** Yes. The **Branch Performance** screen shows side-by-side revenue, sales volume, margin, and stock turnover for every location.

### Q198: How does Super Admin approve a high-value showroom expense?
**Answer:** In the Action Centre or Finance module, pending expenses above the branch limit appear with **Approve** and **Reject** buttons. Clicking Approve immediately releases the funds.

### Q199: Can Super Admin see all audit events that happened across the country today?
**Answer:** Yes. Go to **System -> Audit Log**. Filter by date, branch, or action type to inspect everything that occurred.

### Q200: Can Super Admin update product selling prices centrally?
**Answer:** Yes. In **Catalogue -> Pricing Rules**, Super Admin can adjust standard MSRP prices, minimum gross margin targets, and seasonal promotional rates.

---

# PART 13: System Settings, Numbering, Audit Logs & Multi-Platform Clients (Q201 – Q210)

### Q201: Where are the master company settings configured?
**Answer:** Go to **System -> Settings**. This central hub manages:
* **Business Profile:** Company legal name, brand distribution name, official email, phone, website, physical address, and NTN registration number.
* **Branch Defaults:** Standard operating hours, local expense thresholds, and discount allowances.
* **Product Master Data:** SKU formatting and default warranty terms.
* **Numbering:** Custom prefix patterns for all 13 document types.
* **Security:** MFA and session timeout policies.

### Q202: Can we customize document prefixes to match our company naming style?
**Answer:** **Yes.** In **Settings -> Numbering**, every prefix is editable:
* Sales Orders: change `SO-` to `AJ-SO-`
* Quotations: change `QT-` to `AJ-QT-`
* Invoices: change `INV-` to `AJ-INV-`
* Purchase Orders: change `PO-` to `AJ-PO-`
* Service Cases: change `SC-` to `AJ-SC-`
Click **Save Changes**, and all future documents will immediately use your custom prefixes. In the production architecture, these prefixes combine with unique `client_transaction_id` tracking to ensure concurrency-safe document creation across all offline branch devices.

### Q203: What happens if someone clicks "Restore Defaults" in Settings? Does it delete our sales data?
**Answer:** **No.** The "Restore Defaults" button only resets configuration settings (like opening hours or tax rate) back to factory presets. It has safety guards that **strictly preserve** all your customers, products, bikes, invoices, and audit logs.

### Q204: Can anyone tamper with or edit the Audit Log?
**Answer:** No. Audit logs are cryptographically immutable. In the production client, audit events are committed to a write-ahead local audit log that is synchronized to the central Head Office audit vault. There are no "Edit" or "Delete" capabilities anywhere in the system.

### Q205: How do I export reports for our tax accountant or board meeting?
**Answer:** In **Analytics -> Reports Hub**, select your date range and branch, then click **Export to Excel / CSV** or **Print Summary**.

### Q206: How do I explain this system to our client during a 15-minute demonstration?
**Answer:** Follow this simple 5-step storyline:
1. **Showroom Floor:** Show the bikes currently available in Peshawar (`Inventory -> Serialized Units`).
2. **Customer Walk-in:** Walk through creating a Quote and converting it to an Order (`Sales -> Quotations`).
3. **Locking the Bike:** Show how the bike's chassis number automatically turns from "Available" to "Reserved".
4. **Collecting Cash & Handover:** Record the payment, complete the handover checklist, and show the active 2-Year Warranty card.
5. **After-Sales & Head Office:** File a quick workshop service case showing PKR 0 customer payable under warranty, then switch to Super Admin to show the executive dashboard and audit log.

### Q207: What is the most impressive feature to highlight to the dealership owner?
**Answer:** Highlight **Traceability**: Take any single chassis number and show how you can trace its entire history — which container it arrived in from China, which customer bought it, who collected the money, which technician serviced it, and every audit log entry tied to it.

### Q208: What should I tell the client if they ask, "Can this connect to our FBR digital tax invoicing later?"
**Answer:** Tell them: *"Yes. All invoice models, tax rates, and customer CNIC fields are already architected with standardized IDs and calculations, making backend FBR API integration straightforward."*

### Q209: What client platforms will showroom staff and central executives use in production?
**Answer:** The production architecture provides tailored native and web experiences optimized for specific operational roles:
1. **Showroom Desktop Operational Client (Windows):** Built for high-volume sales counters, cashiers, and branch managers. Features rapid keyboard shortcuts, barcode/VIN scanner support, instant local database queries, and background synchronization.
2. **Showroom Tablet & Handheld Operational Client (Android):** Built for walk-around sales consultants on the showroom floor and technicians in the workshop service bays. Runs a local durable mobile database (e.g. Room/SQLite) with offline capability and automatic synchronization.
3. **Central Web Administration Portal:** Accessible via secure browsers for Super Admins, corporate controllers, auditors, and executive leadership for nationwide management, central approvals, master configuration, and sync health monitoring.

### Q210: What is the final takeaway about AJ EcoDrive?
**Answer:** AJ EcoDrive transforms an EV dealership from disconnected spreadsheets into a **unified, resilient enterprise system**. It balances **local-first branch operational autonomy** (ensuring showrooms never stop serving customers even during internet outages) with **authoritative central governance** (ensuring zero lost inventory, zero duplicate records, and complete financial peace of mind).

---

# PART 14: System Architecture, Operational Continuity & Synchronization Policy (Q211 – Q225)

### Q211: What is the fundamental architecture of the AJ EcoDrive production system?
**Answer:** AJ EcoDrive is architected as a **Two-Tier Distributed Operational System**:
* **Central Host Tier (System of Record):** Central backend and database acting as the ultimate authority for financial settlement, national inventory accounting, user authorization, and master pricing.
* **Branch Operational Tier (Working Replica):** Showroom Desktop and Android clients running local durable databases and outbox queues to execute daily transactions locally and quickly with zero network lag.
* **Synchronization Bridge:** Bi-directional sync service connecting branch nodes to the central host with automatic retry, server idempotency, and delta reconciliation.

### Q212: How does the system guarantee zero data loss during power failures or computer crashes?
**Answer:** In the production operational client, every saved transaction (quote, customer edit, payment, or sale) is written to a **Durable Local Database** with Write-Ahead Logging (WAL) and ACID transactions on the physical disk before acknowledging success to the user. Even if power cuts out instantly, the committed records remain safely stored on disk and are automatically reloaded when the system powers back on.

### Q213: What happens to a customer's quote or sales order if a salesperson accidentally closes the application?
**Answer:** Unlike web browser tabs where unsaved component state is lost upon closing, the production client commits each form stage to the local database. When the salesperson reopens the application, their in-progress draft or confirmed order is immediately available in their showroom queue.

### Q214: How does the server guarantee that retrying an upload won't duplicate a PKR 270,000 bike sale?
**Answer:** Every transaction generated by a branch device is tagged with an immutable **`client_transaction_id`** (idempotency key). If an upload succeeds at the server but the connection drops before the acknowledgment reaches the branch, the branch will re-upload the same packet upon reconnection. The central server detects the existing key, recognizes that the sale has already been posted, skips creation of a duplicate sale, and simply returns the confirmed transaction reference.

### Q215: What is the proposed frequency for periodic synchronization during the business day?
**Answer:** The proposed default is **every 2 hours** during active operating hours (e.g., 10:00 AM, 12:00 PM, 02:00 PM, 04:00 PM, 06:00 PM), with an additional manual **"Sync Now"** button available at any time. This frequency is **fully configurable** by dealership management based on showroom internet reliability and bandwidth.

### Q216: How does End-of-Day Branch Reconciliation work and why is it essential?
**Answer:** At closing, the Branch Manager reviews a consolidated reconciliation dashboard showing all transactions recorded that day (Sales, Payments, Inventory Receipts, Dispatches, and Expenses). The system verifies that every item in the Outbox has been acknowledged by Head Office. This guarantees that Head Office has an exact, reconciled record of all daily branch revenues and vehicle movements before the showroom opens the next morning.

### Q217: Can a branch operate offline indefinitely?
**Answer:** **No.** While offline operation is supported to protect branch business continuity, enterprise safety boundaries enforce an **Offline Session Validity Window** (proposed: 24 to 48 hours). If a device remains disconnected beyond this threshold, high-risk financial and reservation actions are locked until the client successfully synchronizes with the central server, preventing data divergence and unauthorized activity.

### Q218: How does the system handle concurrent edits to the same customer profile?
**Answer:** If staff at Branch A and staff at Branch B update different fields of the same customer profile (e.g., Branch A updates the phone number while Branch B updates the address), the central engine performs a **Field-Level Delta Merge**. If both update the same field simultaneously, the server applies timestamp versioning and logs the event in the audit trail for review.

### Q219: How is vehicle inventory reconciled between showrooms and Head Office?
**Answer:** Inventory synchronization does not overwrite count totals. Instead, it processes **Discrete Movement Transactions** (e.g., `ALLOCATE_VIN`, `DELIVERY_HANDOVER`, `DISPATCH_TRANSFER`). The central server processes each movement against the national serialized registry, ensuring that chassis custody is maintained with 100% mathematical integrity.

### Q220: How does payment settlement differ between branch cash registers and central bank accounts?
**Answer:** 
* **Branch Level:** Cashier records the payment locally, prints a receipt with a local transaction reference, and places physical cash in the branch drawer.
* **Central Level:** Head Office receives the transaction record during sync, matches bank transfer references against incoming bank statements, and officially credits the customer's account in the corporate general ledger.

### Q221: How are document numbers generated safely across multiple disconnected showroom devices?
**Answer:** During offline creation, documents use a compound identifier including the branch code and local device sequence (e.g., `ORD-PEW-D1-00104`). Upon central synchronization, the central server assigns the official sequential company document number (e.g., `AJ-SO-2026-004812`), ensuring seamless concurrency without numbering collisions.

### Q222: How does Super Admin monitor nationwide branch connectivity and sync health?
**Answer:** The Central Web Management Portal includes a dedicated **Central Synchronization & Branch Health Dashboard**. Super Admins see real-time status indicators for every branch:
* Connectivity state (`ONLINE`, `OFFLINE`, `SYNCING`)
* Timestamp of last successful two-way synchronization
* Count of pending transactions in each branch's outbox
* Any data reconciliation conflicts requiring management intervention

### Q223: What is the difference between local operational synchronization and central disaster recovery backups?
**Answer:** 
* **Synchronization:** A continuous operational workflow that exchanges transaction deltas between branch working databases and the central database.
* **Backup:** An automated IT infrastructure process that creates encrypted, write-once, offsite snapshots of the entire central database for disaster recovery against physical data center loss.

### Q224: Will the Android application support the exact same offline workflows as the Windows desktop client?
**Answer:** Yes. The Android application will implement a local durable mobile store (such as Room / SQLite) and the identical synchronization engine contract, allowing showroom floor consultants and workshop mechanics to operate seamlessly without continuous Wi-Fi connectivity.

### Q225: What are the next steps for the client to review and approve before technical implementation begins?
**Answer:** Dealership executive leadership should review the **Client Approval Decisions (Appendix F)** covering offline-permitted modules, periodic sync intervals, end-of-day closing blocking rules, and data freshness thresholds. Once approved, technical development will proceed according to the **19-Phase Implementation Roadmap (Appendix G)**.

---

# APPENDIX A: Policy Summary — Operational Continuity & Synchronization

The AJ ECODRIVE enterprise platform is governed by the following core architectural policies:

1. **Local-First Operational Execution:** Branch operational clients (Desktop and Android) prioritize local responsiveness. Permitted daily showroom operations execute against local durable storage, ensuring staff experience zero network lag and zero interruptions during internet outages.
2. **Central Authoritative Governance:** The central backend and cloud database serve as the single authoritative system of record. Corporate accounting, master catalog pricing, legal document numbering, and role-based permissions are governed centrally.
3. **Durable Local Persistence:** Local records are committed to persistent on-device databases (e.g., SQLite / Room) with write-ahead transaction logging. Operational safety never relies on temporary browser memory, open browser tabs, or volatile memory.
4. **Outbox Synchronization Architecture:** All local business mutations generate structured synchronization tasks stored in a durable Outbox Queue tagged with immutable `client_transaction_id` keys.
5. **Idempotent Server Ingestion:** The central backend enforces strict idempotency. Retried or re-transmitted sync packets are recognized and acknowledged without generating duplicate sales, payments, or stock movements.
6. **Bi-Directional Periodic Refresh:** The system executes scheduled two-way delta synchronizations (proposed default: every 2 hours during business hours) to upload local branch deltas and download central price changes, stock approvals, and announcements without overwriting local in-progress work.
7. **Domain-Specific Conflict Resolution:** Conflict handling follows domain rules (customer profile merge, server-authoritative pricing and permissions, transactional movement ledger for inventory, and append-only ledgers for payments).
8. **End-of-Day Reconciliation & Branch Closing:** Showrooms must complete a daily reconciliation process before closing registers, verifying that all daily transactions are accounted for and synchronized with Head Office.
9. **Security & Session Boundaries:** Offline operations operate within a defined session validity window (24–48 hours) under cached authorization. Offline mode never elevates user privileges.
10. **Central Health Monitoring:** Head Office maintains real-time visibility over all branch connectivity states, last sync timestamps, and pending outbox backlogs.

---

# APPENDIX B: Target Production Topology Blueprint

```text
                                  ┌──────────────────────────────────────────────┐
                                  │           CENTRAL SYSTEM HOST                │
                                  │        (Cloud / Head Office Datacenter)      │
                                  ├──────────────────────────────────────────────┤
                                  │ • Central Enterprise Backend (REST / Sync)   │
                                  │ • Central Master Relational Database         │
                                  │ • Corporate Directory & Authentication       │
                                  │ • Role & Permission Authority                │
                                  │ • Master Inventory & Serialization Ledger    │
                                  │ • Corporate Financial Ledger & Settlement    │
                                  │ • Cryptographic Master Audit Vault           │
                                  │ • Central Sync & Reconciliation Engine       │
                                  └──────────────────────┬───────────────────────┘
                                                         │
                                               SECURE WAN / INTERNET
                                                         │
                        ┌────────────────────────────────┼────────────────────────────────┐
                        │                                │                                │
     ┌──────────────────┴───────────────┐ ┌──────────────┴────────────────┐ ┌─────────────┴─────────────────┐
     │      PESHAWAR SHOWROOM           │ │      ISLAMABAD SHOWROOM       │ │       LAHORE SHOWROOM          │
     ├──────────────────────────────────┤ ├───────────────────────────────┤ ├────────────────────────────────┤
     │ • Desktop Operational Client     │ │ • Desktop Operational Client  │ │ • Desktop Operational Client   │
     │ • Android Tablet Client          │ │ • Android Tablet Client       │ │ • Android Tablet Client        │
     │ • Local Durable Database (SQLite)│ │ • Local Durable Database      │ │ • Local Durable Database       │
     │ • Transaction Outbox Queue       │ │ • Transaction Outbox Queue    │ │ • Transaction Outbox Queue     │
     │ • Fast Local Search & Index      │ │ • Fast Local Search & Index   │ │ • Fast Local Search & Index    │
     │ • Background Sync Engine         │ │ • Background Sync Engine      │ │ • Background Sync Engine       │
     └──────────────────────────────────┘ └───────────────────────────────┘ └────────────────────────────────┘
                                                         │
                                  ┌──────────────────────┴───────────────────────┐
                                  │       CENTRAL WEB ADMINISTRATION PORTAL      │
                                  │  (Super Admin / Executive Management Access) │
                                  ├──────────────────────────────────────────────┤
                                  │ • Cross-Branch Executive Dashboards          │
                                  │ • Nationwide Inventory Transfers & Approvals │
                                  │ • Master Price List & Promotion Management   │
                                  │ • Global Branch Health & Sync Monitor        │
                                  │ • Company-Wide Financial Reporting & Audit   │
                                  └──────────────────────────────────────────────┘
```

---

# APPENDIX C: Proposed Offline Operational Classification Matrix

> [!NOTE]
> *The operational classifications below represent the proposed architectural baseline awaiting formal client review and sign-off.*

| Operation / Module | Operational Category | Offline Behavior & Business Rules | Central Reconciliation Mechanism | Approval Status |
| :--- | :--- | :--- | :--- | :--- |
| **Customer Lead Capture** | **Category A: Offline-Capable** | Full data entry permitted; saved immediately to local database. | Synchronizes to central CRM; deduplicated by CNIC / Phone. | Proposed |
| **Customer Profile Edit** | **Category A: Offline-Capable** | Immediate local update; cached contact details update locally. | Field-level delta merge; conflicting fields resolved by timestamp. | Proposed |
| **Quotation Preparation** | **Category A: Offline-Capable** | Full pricing calculation using local cached price lists. | Uploads as proposed quotation; no inventory impact. | Proposed |
| **Service Case Intake** | **Category A: Offline-Capable** | Vehicle inspection, symptom notes, and photo intake saved locally. | Uploads case record; links to vehicle warranty master. | Proposed |
| **Repair Job Logging** | **Category A: Offline-Capable** | Mechanic labor time and parts usage recorded locally. | Posts parts consumption to central after-sales ledger. | Proposed |
| **Local Showroom Inquiries** | **Category A: Offline-Capable** | Instant search by Phone, CNIC, VIN, or Order ID in local store. | Purely local query; zero network traffic generated. | Proposed |
| **Sales Order Confirmation** | **Category B: Restricted Offline** | Permitted **only** for vehicles physically present in local showroom. | Server validates VIN availability; commits reservation. | Proposed |
| **Vehicle Handover Delivery** | **Category B: Restricted Offline** | Permitted if customer invoice is 100% settled; PDI checklist logged. | Central ownership activated; 2-year warranty card logged. | Proposed |
| **Showroom Payment Capture** | **Category B: Restricted Offline** | Cash / IBFT receipts captured with local transaction ID. | Corporate accounting verifies bank slip before final ledger post. | Proposed |
| **Showroom Petty Cash Expense** | **Category B: Restricted Offline** | Permitted within branch manager discretionary limit (e.g. PKR 15k). | Syncs to finance queue; expenses above limit require central review. | Proposed |
| **Transfer Receiving (GRN)** | **Category B: Restricted Offline** | Physical chassis verification and condition check logged locally. | Updates physical branch custody in central inventory ledger. | Proposed |
| **User Role & Permission Edits**| **Category C: Online-Required** | **Blocked offline.** Requires live central administrative connection. | Immediate server commit; propagates to branches on sync. | Proposed |
| **Corporate Pricing Changes** | **Category C: Online-Required** | **Blocked offline.** Only Super Admin can adjust master MSRP/rules. | Pushed down to all branch local stores during periodic sync. | Proposed |
| **Inter-Branch Stock Transfer** | **Category C: Online-Required** | Requesting from another branch requires central stock lock. | Two-phase commit between origin, destination, and Head Office. | Proposed |
| **Company Financial Closing** | **Category C: Online-Required** | Final corporate financial settlement requires full central sync. | National trial balance and general ledger consolidation. | Proposed |

---

# APPENDIX D: Branch Daily Operational Lifecycle

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ 08:30 AM — SHOWROOM MORNING OPEN & SYNC                                                │
│ 1. Branch Manager launches AJ EcoDrive Desktop Application on counter computer.         │
│ 2. System automatically authenticates and initiates Morning Central Synchronization.  │
│ 3. Downloads overnight stock transfer approvals, in-transit shipments, and price lists.│
│ 4. Confirms branch operational business date. Status indicator turns GREEN (ONLINE).   │
└──────────────────────────────────────────┬─────────────────────────────────────────────┘
                                           │
┌──────────────────────────────────────────▼─────────────────────────────────────────────┐
│ 09:00 AM – 06:00 PM — ACTIVE SHOWROOM & WORKSHOP OPERATIONS                            │
│ • Staff register walk-ins, prepare quotes, and log repair jobs with instant response.  │
│ • Transactions commit to local durable database with unique client_transaction_ids.    │
│ • When online: Changes synchronize in the background in near-real time.                │
│ • If internet drops: System shifts gracefully to OFFLINE mode; transactions queue.     │
│ • Periodic Sync: Every 2 hours, client pushes local delta and pulls central updates.   │
└──────────────────────────────────────────┬─────────────────────────────────────────────┘
                                           │
┌──────────────────────────────────────────▼─────────────────────────────────────────────┐
│ 06:00 PM — END-OF-DAY RECONCILIATION & CLOSING INITIATION                              │
│ 1. Branch Manager navigates to Branch Closing & Reconciliation dashboard.              │
│ 2. System triggers final outbound sync of all pending Outbox transactions.             │
│ 3. Displays daily transaction summary: Total Recorded, Synced, Pending, Conflicts.     │
└──────────────────────────────────────────┬─────────────────────────────────────────────┘
                                           │
┌──────────────────────────────────────────▼─────────────────────────────────────────────┐
│ CLOSING STATUS EVALUATION                                                              │
│ • GREEN: 100% Transactions Synced $\to$ Manager enters cash drawer balance $\to$ Closed. │
│ • AMBER: Non-critical records pending $\to$ Conditional close allowed with manager note.│
│ • RED: Unsynced bike sales / cash payments $\to$ Closing blocked; resolve connection.   │
└──────────────────────────────────────────┬─────────────────────────────────────────────┘
                                           │
┌──────────────────────────────────────────▼─────────────────────────────────────────────┐
│ NEXT-DAY MORNING AUDIT & ROLL-FORWARD                                                  │
│ Upon launching next morning, client verifies prior day closing status before opening.  │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

# APPENDIX E: Failure & Recovery Scenarios Matrix (18 Critical Events)

| # | Event / Failure Scenario | Immediate System Reaction | Operational Continuity Strategy | Recovery & Reconciliation Behavior |
| :- | :--- | :--- | :--- | :--- |
| **1** | **Internet Connection Drops** | Header badge shifts to `OFFLINE`. | Staff continue Category A & B operations without interruption. | When connection returns, sync engine uploads queued records. |
| **2** | **Internet Connection Restored** | Header badge shifts to `SYNCING...`. | Staff continue working locally while Outbox empties in background. | Records marked `SYNCED`; central server returns acknowledgments. |
| **3** | **Central Server Down / Maintenance** | Client detects timeout; sets backoff. | Branch operations continue uninterrupted against local store. | Client retries periodically with exponential backoff. |
| **4** | **High Network Latency / Slow 3G** | Local UI remains instantaneous. | Form saves never wait for remote server response. | Sync engine batches uploads asynchronously without UI freezing. |
| **5** | **Computer Sudden Power Cut** | Machine shuts down instantly. | Write-Ahead Logging (WAL) guarantees zero corruption of disk DB. | On reboot, app recovers cleanly; pending Outbox reloads. |
| **6** | **Application Unexpected Crash** | OS closes application process. | Last committed record is safely persisted on physical disk. | On relaunch, app detects un-synced items and resumes sync. |
| **7** | **UPS / Inverter Battery Depletion**| PC turns off mid-transaction. | Uncommitted form inputs abort; committed records remain intact. | Staff re-opens app; historical records remain 100% intact. |
| **8** | **Staff Accidentally Closes App** | Application window closes. | Disk database retains all saved quotes, orders, and customer data. | Re-launching app restores immediate operational state. |
| **9** | **Network Switches (Wi-Fi $\to$ 4G Hotspot)**| Temporary socket disconnect. | Sync pauses gracefully during network handshake. | Engine re-establishes connection and resumes queued packets. |
| **10**| **Upload Retry After Timeout** | Outbox retries same batch. | Uses identical `client_transaction_id` idempotency key. | Central server detects duplicate packet; prevents double billing. |
| **11**| **Concurrent Customer Edits** | Branch A & B edit same customer. | Non-conflicting fields merged; conflicting fields use timestamp. | Server logs field-level audit trail with original values. |
| **12**| **Price Changed Centrally While Offline**| Branch prepares quote with cached price. | Quotation honors cached validity date (7 days) as commercial quote. | Central server flags price delta on conversion if expired. |
| **13**| **Employee Centrally Deactivated** | User marked Inactive at Head Office. | Deactivation token delivered during next periodic sync cycle. | Branch client terminates local session and locks access. |
| **14**| **User Permission Centrally Changed** | Super Admin alters staff rights. | Updated permission manifest pushed during periodic sync. | Branch client refreshes UI action privileges immediately. |
| **15**| **Vehicle Allocated in Another City** | Showroom searches remote stock. | Remote stock displays "Last Refreshed" freshness timestamp. | Transfer request enforces real-time lock before truck dispatch. |
| **16**| **Duplicate Payment Entry Attempt** | Cashier clicks submit multiple times. | UI debounces click; local store rejects duplicate transaction ID. | Exactly one payment record is generated and queued. |
| **17**| **Document Number Concurrency** | Two devices generate invoice offline. | Both use compound local IDs (`ORD-PEW-D1-01` vs `ORD-PEW-D2-01`). | Central server assigns sequential official tax numbers on sync. |
| **18**| **Extended Outage (48+ Hours)** | Outbox backlog accumulates. | Transactions accumulate safely up to local disk capacity. | Upon reconnect, sync engine streams transactions in throttled chunks. |

---

# APPENDIX F: Client Approval Items & Architecture Decisions

Before technical implementation begins, executive management and dealership owners must review and formally approve the following business rules:

* [ ] **Item A — Offline-Capable Modules:** Confirm whether Category A (Leads, Customers, Quotes, Workshop Service Intake, Repairs) satisfies all daily showroom continuity requirements.
* [ ] **Item B — Restricted Offline Operations:** Approve specific business rules, discretionary spending limits, and payment recording rules for Category B operations.
* [ ] **Item C — Periodic Synchronization Frequency:** Confirm whether the proposed **2-hour interval** during operating hours is acceptable, or specify an alternative frequency.
* [ ] **Item D — End-of-Day Branch Closing Blocking Policy:** Formally decide whether an **AMBER** status (non-critical notes pending) or **RED** status (pending cash or vehicle sales) should strictly block branch managers from closing their showroom register.
* [ ] **Item E — Critical Transaction Thresholds:** Define the exact transaction types and financial amounts that constitute a "Critical Unresolved Transaction".
* [ ] **Item F — Data Freshness Tolerances:** Establish the maximum acceptable age for cached stock availability, customer balances, and pricing rules.
* [ ] **Item G — Offline Authentication Session Validity Window:** Decide how long a previously authenticated device can operate disconnected before requiring central credential re-validation (e.g., 24 hours vs. 48 hours).
* [ ] **Item H — Conflict Authority Matrix:** Formally approve the domain conflict hierarchy (confirming central authority for master pricing, user permissions, and national financial accounting).

---

# APPENDIX G: Target Implementation Roadmap (Phases 1 – 19)

Following client approval, production engineering will execute in the following 19 structured phases:

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
12. **Phase 12: Build Android Operational Database Layer:** Implement Room/SQLite local database on Android.
13. **Phase 13: Build Android Synchronization Engine:** Implement mobile background sync workers and network observers.
14. **Phase 14: Build End-of-Day Reconciliation Workflows:** Develop branch closing screens, summary audits, and register sign-offs.
15. **Phase 15: Build Central Sync Health Monitor:** Construct Super Admin real-time nationwide branch sync monitoring UI.
16. **Phase 16: Failure & Recovery Stress Testing:** Simulate network drops, power cuts, packet losses, and merge conflicts.
17. **Phase 17: Pilot Deployment (Peshawar Showroom):** Deploy production client in a single live showroom for 30-day trial.
18. **Phase 18: Operational Audit & Optimization:** Review sync logs, optimize database indexing, and refine staff UX.
19. **Phase 19: Full Nationwide Rollout:** Deploy to Islamabad, Lahore, Rawalpindi, and subsequent expansion showrooms.

---

# APPENDIX H: Core Production Acceptance Criteria

The future production system will be accepted only when it demonstrably satisfies the following four core business criteria:

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
> *This documentation revision defines requirements, architectural specifications, and client approval points only. No offline database, synchronization engine, backend API, desktop application, or Android application has been implemented at this stage. Implementation will commence only after client review and formal sign-off.*

---
*End of AJ EcoDrive Master Client Operational Guide & Production Architecture Blueprint.*

