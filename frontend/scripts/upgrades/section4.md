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
