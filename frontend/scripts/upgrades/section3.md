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
* 📍 **System Navigation Path:** Security Guard Mobile App &rarr; `Scan Gate Pass QR`
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
