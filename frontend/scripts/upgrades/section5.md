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
