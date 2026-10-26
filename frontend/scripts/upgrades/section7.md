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
