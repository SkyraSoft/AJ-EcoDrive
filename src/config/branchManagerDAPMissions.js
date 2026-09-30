/**
 * AJ EcoDrive — Branch Manager DAP & Interactive Missions Registry
 * Exhaustive 8-Stage Chronological Lifecycle Curriculum
 * Total Operational Stages: 8
 * Total Practical Interactive Steps: 57
 * Total Audited System Checkpoints: 3394
 */

export const branchManagerMissions = [
  {
    "id": "mission_morning_start",
    "code": "M1",
    "title": "Morning Showroom Opening & Daily Start",
    "category": "Showroom Readiness",
    "icon": "🌅",
    "description": "Verify login security, executive dashboard metrics, today's footfall forecast, cash drawer float, and staff attendance.",
    "chapters": [
      {
        "code": "1.1",
        "title": "Authentication & Identity Security",
        "route": "/login"
      },
      {
        "code": "1.2",
        "title": "Showroom Command Hub & Overview",
        "route": "/dashboard"
      },
      {
        "code": "1.3",
        "title": "Managerial Quick Actions Palette",
        "route": "/dashboard/quick-actions"
      },
      {
        "code": "1.4",
        "title": "Branch Profile & Parameters",
        "route": "/organisation/branches"
      },
      {
        "code": "1.5",
        "title": "Staff Attendance & Access Roles",
        "route": "/organisation/users"
      },
      {
        "code": "1.7",
        "title": "Internal Directives & Staff Comms",
        "route": "/communication"
      }
    ],
    "steps": [
      {
        "checkpointId": "M1-R1-H1",
        "route": "/login",
        "target": "#dap-auth-header",
        "block": "Authentication Portal",
        "badge": "System Access",
        "trainingType": "observe",
        "title": "AJ EcoDrive Secure Gateway",
        "description": "Every morning starts with authenticating into the centralized ERP via your authorized Branch Manager credentials.",
        "dealershipContext": "Branch Managers must ensure dual-factor authentication is active and never share terminal sessions on floor computers.",
        "instruction": "Observe the secure enterprise gateway and active branch authentication endpoints.",
        "placement": "bottom"
      },
      {
        "checkpointId": "M1-R1-F1",
        "route": "/login",
        "target": "[data-tour=\"auth-email\"]",
        "block": "Manager Credentials",
        "field": "email",
        "badge": "Security Practice",
        "trainingType": "practice",
        "title": "Branch Manager Email Verification",
        "description": "Input your designated corporate branch email to begin the daily operational session.",
        "businessRationale": "Ensures immutable audit logging linking all sales authorizations and cash approvals to the specific Branch Manager.",
        "instruction": "Enter a valid corporate email format (e.g. manager.lahore@ajecodrive.com).",
        "exampleValue": "manager.lahore@ajecodrive.com",
        "validation": {
          "required": true,
          "pattern": "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
          "rule": "Must be a valid corporate email address format.",
          "emptyMessage": "Email address is required.",
          "invalidMessage": "Enter a valid email format (e.g. name@ajecodrive.com)."
        },
        "incorrectFeedback": "Please provide a valid email format with @ and a proper domain.",
        "successFeedback": "Corporate email format validated successfully.",
        "placement": "right"
      },
      {
        "checkpointId": "M1-R8-H1",
        "route": "/dashboard",
        "target": "#dap-dashboard-overview",
        "block": "Showroom Executive Cockpit",
        "badge": "Executive Oversight",
        "trainingType": "observe",
        "title": "Showroom Command Hub",
        "description": "The Command Hub aggregates live showroom operational telemetry: floor inventory, daily test drive schedule, customer inquiries, and cash float status.",
        "dealershipContext": "Review this overview at 09:00 AM daily before unlocking customer entry gates.",
        "instruction": "Review the high-level KPI cards and confirm that system operational status is nominal.",
        "placement": "left"
      },
      {
        "checkpointId": "M1-R8-K1",
        "route": "/dashboard",
        "target": "[data-tour=\"kpi-live-inventory\"]",
        "block": "Live EV Inventory Metric",
        "badge": "Inventory Health",
        "trainingType": "observe",
        "title": "Live Floor Stock & Battery Charge Status",
        "description": "Displays the number of physical EV units currently on the showroom floor ready for demonstration or immediate delivery.",
        "dealershipContext": "Showroom display units must be maintained above 80% State of Charge (SOC) to prevent battery degradation.",
        "instruction": "Verify that floor display units are physically accounted for and charging cables are safely secured.",
        "placement": "bottom"
      },
      {
        "checkpointId": "M1-R8-K2",
        "route": "/dashboard",
        "target": "[data-tour=\"kpi-daily-target\"]",
        "block": "Walk-In & Test Drive Forecast",
        "badge": "Sales Operations",
        "trainingType": "observe",
        "title": "Daily Appointments & Walk-In Forecast",
        "description": "Forecasts the expected footfall and scheduled VIP test drives for the current business day.",
        "dealershipContext": "Ensure dedicated sales advisors are rostered to cover peak customer footfall hours (11:00 AM - 02:00 PM and 05:00 PM - 08:00 PM).",
        "instruction": "Examine today's customer appointments and verify test drive fleet readiness.",
        "placement": "bottom"
      },
      {
        "checkpointId": "M1-R8-K3",
        "route": "/dashboard",
        "target": "[data-tour=\"kpi-cash-float\"]",
        "block": "Showroom Cash Float Tally",
        "badge": "Financial Control",
        "trainingType": "observe",
        "title": "Opening Cash Drawer Float Balance",
        "description": "Reflects the verified physical opening cash float in the showroom cashier till.",
        "dealershipContext": "Standard operating float is Rs. 50,000 for change and minor operational cash transactions.",
        "instruction": "Inspect the cashier cash float metric and confirm agreement with physical vault contents.",
        "placement": "bottom"
      },
      {
        "checkpointId": "M1-R8-DEC1",
        "route": "/dashboard",
        "target": "#dap-dashboard-overview",
        "block": "Morning Float Policy",
        "badge": "SOP Decision",
        "trainingType": "decision",
        "title": "Morning Showroom Cash Float Procedure",
        "description": "A cashier arrives at 09:05 AM and asks to unlock the cash drawer to serve an early walk-in customer before the physical count is signed.",
        "dealershipContext": "Under AJ EcoDrive Showroom Cash Regulations, no cash transactions may occur prior to dual-signature verification of the opening float register.",
        "instruction": "Select the compliant managerial action according to dealership SOP:",
        "options": [
          {
            "label": "A: Allow the cashier to start trading immediately to avoid keeping the customer waiting, and count the cash float later at 11:00 AM.",
            "isCorrect": false,
            "feedback": "Violates Cash SOP! Uncounted floats introduce untraceable variances between POS collections and drawer opening balance."
          },
          {
            "label": "B: Physically count the Rs. 50,000 cash drawer float with the cashier, verify denomination breakdown, and countersign the register before opening trading.",
            "isCorrect": true,
            "feedback": "Correct SOP! Joint physical verification protects both the cashier and branch management against cash discrepancies."
          }
        ],
        "placement": "left"
      },
      {
        "checkpointId": "M1-R10-B1",
        "route": "/dashboard/quick-actions",
        "target": "[data-tour=\"quick-action-lead\"]",
        "block": "Quick Actions Palette",
        "badge": "Action Execution",
        "trainingType": "execute",
        "actionName": "Launch Lead Registration Form",
        "title": "Managerial Quick Actions Hub",
        "description": "Quick Actions allow the Branch Manager to bypass deep menu trees and immediately execute high-frequency operations.",
        "dealershipContext": "Use Quick Actions during peak floor hours to rapidly assist floor staff with customer intake.",
        "instruction": "Click the button below to launch the fast walk-in lead registration module.",
        "placement": "right"
      },
      {
        "checkpointId": "M1-R11-TBL1",
        "route": "/organisation/branches",
        "target": "[data-tour=\"branch-profile-card\"]",
        "block": "Branch Facilities & Capacity",
        "badge": "Facility Inspection",
        "trainingType": "inspect",
        "title": "Branch Profile & Operational Capacity",
        "description": "View showroom storage capacity, DC fast charging stalls, workshop bay count, and registered operating licenses.",
        "instruction": "Inspect branch parameters, ensuring that charging station online status and active bay counts match reality.",
        "placement": "left"
      },
      {
        "checkpointId": "M1-R14-TBL1",
        "route": "/organisation/users",
        "target": "[data-tour=\"staff-table\"]",
        "block": "Staff Roster & Active Shifts",
        "badge": "Human Resources",
        "trainingType": "inspect",
        "title": "Staff Shift Attendance & Access Roster",
        "description": "Verify which sales advisors, workshop technicians, and cashiers are marked present on the branch roster.",
        "instruction": "Check that certified High-Voltage technicians and cashier shift supervisors are on active duty.",
        "placement": "top"
      }
    ]
  },
  {
    "id": "mission_customer_kyc",
    "code": "M2",
    "title": "Customer Arrival, Walk-In Leads & Identity Verification",
    "category": "Customer Intake",
    "icon": "👥",
    "description": "Capture prospect details, schedule test drives, register customer identities, and verify 13-digit Pakistani CNIC compliance.",
    "chapters": [
      {
        "code": "2.1",
        "title": "Walk-In Prospect Intake",
        "route": "/sales/leads"
      },
      {
        "code": "2.2",
        "title": "Test Drive & Prospect Follow-Ups",
        "route": "/sales/follow-ups"
      },
      {
        "code": "2.3",
        "title": "Customer Registration & CNIC KYC",
        "route": "/sales/customers"
      }
    ],
    "steps": [
      {
        "checkpointId": "M2-R28-H1",
        "route": "/sales/leads",
        "target": "[data-tour=\"lead-overview-kpi\"]",
        "block": "Leads Triage Pipeline",
        "badge": "Lead Management",
        "trainingType": "observe",
        "title": "Walk-In & Digital Inquiries Funnel",
        "description": "Tracks prospects from initial showroom arrival through qualification, test drive, and conversion into booking orders.",
        "dealershipContext": "Uncontacted walk-in leads older than 2 hours are flagged in the Action Centre for managerial intervention.",
        "instruction": "Observe the active pipeline status and unassigned prospect count.",
        "placement": "bottom"
      },
      {
        "checkpointId": "M2-R28-F1",
        "route": "/sales/leads",
        "target": "[data-tour=\"lead-name\"]",
        "block": "Prospect Identification",
        "field": "customerName",
        "badge": "Customer Data",
        "trainingType": "practice",
        "title": "Capture Prospect Full Name",
        "description": "Record the walk-in customer's primary name as shown on their identification document.",
        "businessRationale": "Accurate name capture prevents duplicate lead creation across regional branch databases.",
        "instruction": "Enter a valid customer full name (e.g. Tariq Mehmood).",
        "exampleValue": "Tariq Mehmood",
        "validation": {
          "required": true,
          "pattern": "^[a-zA-Z\\s.]{3,50}$",
          "rule": "Name must be at least 3 alphabetic characters.",
          "emptyMessage": "Customer name is mandatory.",
          "invalidMessage": "Enter a valid name containing only letters and spaces."
        },
        "incorrectFeedback": "Customer name must be at least 3 characters and contain valid alphabets.",
        "successFeedback": "Customer name validated successfully.",
        "placement": "right"
      },
      {
        "checkpointId": "M2-R28-F2",
        "route": "/sales/leads",
        "target": "[data-tour=\"lead-phone\"]",
        "block": "Prospect Contact",
        "field": "phone",
        "badge": "Contact Number",
        "trainingType": "practice",
        "title": "Customer Mobile Phone Validation",
        "description": "Record customer mobile number for automated WhatsApp booking updates and test drive reminders.",
        "businessRationale": "Standardized 11-digit format enables automated SMS gateway dispatch without delivery failure.",
        "instruction": "Enter valid Pakistani mobile number starting with 03 (e.g. 03001234567).",
        "exampleValue": "03001234567",
        "validation": {
          "required": true,
          "pattern": "^03[0-9]{9}$",
          "rule": "Must be an 11-digit Pakistani mobile number beginning with 03.",
          "emptyMessage": "Mobile phone number is mandatory.",
          "invalidMessage": "Format must be 03XXXXXXXXX (11 digits)."
        },
        "incorrectFeedback": "Mobile number must be exactly 11 digits and begin with 03 (e.g. 03001234567).",
        "successFeedback": "Valid Pakistani mobile number verified.",
        "placement": "right"
      },
      {
        "checkpointId": "M2-R28-F3",
        "route": "/sales/leads",
        "target": "[data-tour=\"lead-product\"]",
        "block": "Vehicle Interest",
        "field": "productInterest",
        "badge": "Model Selection",
        "trainingType": "practice",
        "title": "Select Interested EV Model",
        "description": "Choose which electric vehicle variant the prospect is evaluating for purchase.",
        "businessRationale": "Enables targeted follow-ups and matching against live branch showroom inventory.",
        "instruction": "Select an EV model from the available branch catalog options.",
        "exampleValue": "EcoDrive Apex 220km Range",
        "options": [
          {
            "label": "EcoDrive Alpha 150km Range (Urban City Edition)",
            "value": "EcoDrive Alpha 150km"
          },
          {
            "label": "EcoDrive Apex 220km Range (Long Range Executive)",
            "value": "EcoDrive Apex 220km Range"
          },
          {
            "label": "EcoDrive Fleet Van 300km (Commercial Cargo)",
            "value": "EcoDrive Fleet Van 300km"
          }
        ],
        "validation": {
          "required": true,
          "rule": "Must select a vehicle model from the active product catalog."
        },
        "incorrectFeedback": "Please select an EV model from the list.",
        "successFeedback": "EV model preference recorded.",
        "placement": "right"
      },
      {
        "checkpointId": "M2-R28-B1",
        "route": "/sales/leads",
        "target": "[data-tour=\"lead-submit\"]",
        "block": "Lead Ingestion",
        "badge": "Submission",
        "trainingType": "execute",
        "actionName": "Submit & Route Lead",
        "title": "Register & Auto-Assign Lead",
        "description": "Submitting the lead logs it into the CRM pipeline and dispatches a notification to the assigned sales advisor.",
        "instruction": "Click Submit to record the prospect into the showroom database.",
        "placement": "top"
      },
      {
        "checkpointId": "M2-R29-TBL1",
        "route": "/sales/follow-ups",
        "target": "[data-tour=\"test-drive-table\"]",
        "block": "Test Drive Calendar",
        "badge": "Test Drive Operations",
        "trainingType": "inspect",
        "title": "Test Drive Scheduling & Vehicle Availability",
        "description": "Inspect today's test drive booking schedule and check dedicated test drive vehicle battery SOC and registration.",
        "dealershipContext": "Test drive vehicles must have active insurance and customer signed indemnity waiver before leaving showroom perimeter.",
        "instruction": "Inspect scheduled test drive timeslots and confirm vehicle keys are checked out properly.",
        "placement": "left"
      },
      {
        "checkpointId": "M2-R29-DEC1",
        "route": "/sales/follow-ups",
        "target": "[data-tour=\"test-drive-table\"]",
        "block": "Test Drive Compliance",
        "badge": "SOP Decision",
        "trainingType": "decision",
        "title": "Test Drive Driving License Verification",
        "description": "A prospect requests an immediate test drive of the EcoDrive Apex 220km but only carries a digital photo of their driver license on a smartphone.",
        "dealershipContext": "Under AJ EcoDrive Fleet Insurance Policy, original physical valid driving license inspection is mandatory before handing over keys.",
        "instruction": "Select the compliant managerial response:",
        "options": [
          {
            "label": "A: Hand over the keys and allow the customer to drive alone since they showed a photo on their phone.",
            "isCorrect": false,
            "feedback": "Critical Insurance Breach! Fleet insurance is void in case of an accident without physical license verification and accompanied advisor."
          },
          {
            "label": "B: Require physical original driving license inspection, execute signed test drive indemnity agreement, and assign an advisor to accompany the customer.",
            "isCorrect": true,
            "feedback": "Compliant Decision! Adheres strictly to showroom fleet safety regulations and insurance coverage requirements."
          }
        ],
        "placement": "left"
      },
      {
        "checkpointId": "M2-R30-F1",
        "route": "/sales/customers",
        "target": "[data-tour=\"customer-cnic\"]",
        "block": "KYC Identity Form",
        "field": "cnic",
        "badge": "Identity Verification",
        "trainingType": "practice",
        "title": "Pakistani CNIC Registration & Format",
        "description": "Enter the customer's 13-digit Computerized National Identity Card number with standard hyphenation.",
        "businessRationale": "Mandatory for vehicle registration, excise transfer, and FBR sales tax invoicing in Pakistan.",
        "instruction": "Enter a valid CNIC in XXXXX-XXXXXXX-X format (e.g. 35201-1234567-1).",
        "exampleValue": "35201-1234567-1",
        "validation": {
          "required": true,
          "pattern": "^[0-9]{5}-[0-9]{7}-[0-9]{1}$",
          "rule": "Format must be 5 digits, hyphen, 7 digits, hyphen, 1 digit (XXXXX-XXXXXXX-X).",
          "emptyMessage": "CNIC is mandatory for vehicle booking and invoice generation.",
          "invalidMessage": "CNIC must strictly follow XXXXX-XXXXXXX-X format."
        },
        "incorrectFeedback": "CNIC format invalid. Must be 13 digits with hyphens (e.g. 35201-1234567-1).",
        "successFeedback": "Valid Pakistani CNIC format verified.",
        "placement": "right"
      },
      {
        "checkpointId": "M2-R30-B1",
        "route": "/sales/customers",
        "target": "[data-tour=\"customer-save\"]",
        "block": "Customer Master",
        "badge": "Data Persistence",
        "trainingType": "execute",
        "actionName": "Save Customer Record",
        "title": "Persist KYC-Verified Customer Profile",
        "description": "Saves the verified customer record to the central database, enabling formal quotations, orders, and gate passes.",
        "instruction": "Click Save to persist the customer master record.",
        "placement": "top"
      }
    ]
  },
  {
    "id": "mission_commercial_sales",
    "code": "M3",
    "title": "Commercial Pricing, Quotations, POS Booking & Invoicing",
    "category": "Sales & POS",
    "icon": "💼",
    "description": "Configure vehicle options, generate formal quotations, enforce discount ceilings, book orders, and process payments.",
    "chapters": [
      {
        "code": "3.1",
        "title": "EV Model Catalog & Specifications",
        "route": "/catalogue/products"
      },
      {
        "code": "3.2",
        "title": "Formal Sales Quotations",
        "route": "/sales/quotations"
      },
      {
        "code": "3.3",
        "title": "Point of Sale (POS) Instant Retail",
        "route": "/sales/create-sale"
      },
      {
        "code": "3.4",
        "title": "Vehicle Booking Orders",
        "route": "/sales/orders"
      },
      {
        "code": "3.5",
        "title": "Custom Fleet & Corporate Orders",
        "route": "/sales/custom-orders"
      },
      {
        "code": "3.6",
        "title": "Commercial Invoicing & Taxes",
        "route": "/sales/invoices"
      },
      {
        "code": "3.7",
        "title": "Customer Payment Settlement",
        "route": "/sales/payments"
      },
      {
        "code": "3.8",
        "title": "Sales Performance Analytics",
        "route": "/sales/dashboard"
      }
    ],
    "steps": [
      {
        "checkpointId": "M3-R20-TBL1",
        "route": "/catalogue/products",
        "target": "[data-tour=\"product-catalog-grid\"]",
        "block": "Product Catalog & Tariffs",
        "badge": "Price Master",
        "trainingType": "inspect",
        "title": "EV Model Catalog & Retail Tariffs",
        "description": "Review active showroom models, battery chemistries (LFP vs NMC), warranty tiers, and official ex-showroom price lists.",
        "instruction": "Inspect product cards and confirm retail prices reflect current Head Office approved price circulars.",
        "placement": "left"
      },
      {
        "checkpointId": "M3-R24-TBL1",
        "route": "/sales/quotations",
        "target": "[data-tour=\"quotation-table\"]",
        "block": "Quotations Ledger",
        "badge": "Commercial Quotes",
        "trainingType": "inspect",
        "title": "Active Quotations & Expiry Control",
        "description": "Formal quotations have a system validity of 7 calendar days to protect against raw material or battery tariff fluctuations.",
        "instruction": "Inspect quotation status chips (Draft, Sent, Accepted, Expired).",
        "placement": "left"
      },
      {
        "checkpointId": "M3-R24-F1",
        "route": "/sales/quotations",
        "target": "[data-tour=\"quote-discount\"]",
        "block": "Commercial Terms",
        "field": "discountAmount",
        "badge": "Discount Authority",
        "trainingType": "practice",
        "title": "Commercial Discount Ceiling Enforcement",
        "description": "Branch Managers possess discretionary authority to grant up to Rs. 25,000 commercial discount on standard EV models.",
        "businessRationale": "Discounts exceeding Rs. 25,000 require Super Admin / Commercial Director approval in the Action Centre.",
        "instruction": "Enter an approved discount amount up to Rs. 25,000 (e.g. 15000).",
        "exampleValue": "15000",
        "validation": {
          "required": true,
          "min": 0,
          "max": 25000,
          "rule": "Discount must be between 0 and 25,000 PKR.",
          "emptyMessage": "Enter 0 if no discount is offered.",
          "invalidMessage": "Discount cannot exceed Branch Manager ceiling of Rs. 25,000."
        },
        "incorrectFeedback": "Amount exceeds branch authority ceiling (Max Rs. 25,000). Escalate higher discounts.",
        "successFeedback": "Discount amount within branch discretionary authority.",
        "placement": "right"
      },
      {
        "checkpointId": "M3-R24-DEC1",
        "route": "/sales/quotations",
        "target": "[data-tour=\"quotation-table\"]",
        "block": "Discount Governance",
        "badge": "SOP Decision",
        "trainingType": "decision",
        "title": "Discount Escalation Boundary",
        "description": "A corporate fleet buyer purchasing 3 units requests an immediate cash discount of Rs. 60,000 per vehicle before signing the quotation.",
        "dealershipContext": "Under AJ EcoDrive Commercial Policy, discounts exceeding Rs. 25,000/unit cannot be approved by Branch Managers.",
        "instruction": "Select the correct managerial response:",
        "options": [
          {
            "label": "A: Grant the Rs. 60,000 discount directly in the quotation to close the sale today without informing Head Office.",
            "isCorrect": false,
            "feedback": "Policy Breach! Invoices with unauthorized discounts are blocked by Head Office accounting reconciliation."
          },
          {
            "label": "B: Prepare the formal quotation with the requested fleet discount and route an Escalation Request to Super Admin via Action Centre.",
            "isCorrect": true,
            "feedback": "Compliant Decision! Corporate fleet concessions must be authorized at Director level through proper escalation."
          }
        ],
        "placement": "left"
      },
      {
        "checkpointId": "M3-R26-TBL1",
        "route": "/sales/orders",
        "target": "#dap-orders-table",
        "block": "Vehicle Booking Orders",
        "badge": "Order Ledger",
        "trainingType": "inspect",
        "title": "Booking Orders & Inventory Lock",
        "description": "Orders represent binding commitments. Confirming a booking locks a vehicle allocation against customer CNIC.",
        "instruction": "Inspect the booking orders ledger and check payment status indicators (Pending, Advance Paid, Full Settlement).",
        "placement": "left"
      },
      {
        "checkpointId": "M3-R26-F1",
        "route": "/sales/orders",
        "target": "[data-tour=\"order-advance-amount\"]",
        "block": "Booking Deposit",
        "field": "advanceDeposit",
        "badge": "Advance Collection",
        "trainingType": "practice",
        "title": "Booking Advance Payment Verification",
        "description": "Record customer advance booking deposit. Minimum mandatory deposit is Rs. 50,000 to hold vehicle allocation.",
        "businessRationale": "Unfunded bookings automatically release reserved inventory back to floor pool after 48 hours.",
        "instruction": "Enter advance deposit amount (Minimum Rs. 50,000).",
        "exampleValue": "100000",
        "validation": {
          "required": true,
          "min": 50000,
          "rule": "Minimum booking advance deposit is Rs. 50,000.",
          "emptyMessage": "Advance deposit amount is mandatory.",
          "invalidMessage": "Advance amount must be at least Rs. 50,000."
        },
        "incorrectFeedback": "Minimum advance deposit of Rs. 50,000 is required to freeze unit allocation.",
        "successFeedback": "Advance deposit complies with booking threshold.",
        "placement": "right"
      },
      {
        "checkpointId": "M3-R27-TBL1",
        "route": "/sales/payments",
        "target": "[data-tour=\"payments-table\"]",
        "block": "Settlement Register",
        "badge": "Financial Tally",
        "trainingType": "inspect",
        "title": "Customer Payment Settlement Ledger",
        "description": "Tracks customer receipts across Bank Transfers (IBFT), Pay Orders, Credit Cards, and Cash Drawer deposits.",
        "instruction": "Inspect payment transaction statuses and verify bank clearance references.",
        "placement": "left"
      },
      {
        "checkpointId": "M3-R27-F1",
        "route": "/sales/payments",
        "target": "[data-tour=\"payment-ref\"]",
        "block": "Banking Reference",
        "field": "transactionReference",
        "badge": "Bank Traceability",
        "trainingType": "practice",
        "title": "Record Bank Transaction Reference",
        "description": "Enter the bank deposit slip number, IBFT reference, or pay order number for the received funds.",
        "businessRationale": "Ensures 1-to-1 automated reconciliation between branch bank statements and ERP general ledger.",
        "instruction": "Enter bank transaction reference (e.g. HBL-FT-9842105).",
        "exampleValue": "HBL-FT-9842105",
        "validation": {
          "required": true,
          "pattern": "^[A-Z0-9-]{6,30}$",
          "rule": "Reference must be 6-30 alphanumeric characters.",
          "emptyMessage": "Transaction reference is required for non-cash payments.",
          "invalidMessage": "Enter a valid bank reference string (letters, numbers, hyphens)."
        },
        "incorrectFeedback": "Enter a valid bank reference string of at least 6 alphanumeric characters.",
        "successFeedback": "Bank transaction reference recorded.",
        "placement": "right"
      }
    ]
  },
  {
    "id": "mission_pdi_gatepass",
    "code": "M4",
    "title": "Vehicle Allocation, 18-Point PDI & Delivery Gate Pass",
    "category": "PDI & Handover",
    "icon": "🔑",
    "description": "Allocate serialized VIN, perform 18-point Pre-Delivery Inspection, check battery State of Health, and authorize Gate Pass.",
    "chapters": [
      {
        "code": "4.2",
        "title": "18-Point PDI & Gate Pass Release",
        "route": "/sales/delivery-handover"
      },
      {
        "code": "4.5",
        "title": "Vehicle Returns & Exchanges",
        "route": "/sales/returns"
      }
    ],
    "steps": [
      {
        "checkpointId": "M4-R25-TBL1",
        "route": "/sales/delivery-handover",
        "target": "#dap-delivery-table",
        "block": "Delivery Handover Queue",
        "badge": "Vehicle Release",
        "trainingType": "inspect",
        "title": "Pending Delivery Handover Queue",
        "description": "Displays all fully paid booking orders ready for physical vehicle allocation, technical PDI, and customer key handover.",
        "dealershipContext": "Under no circumstances may a vehicle be released before 100% financial settlement and signed PDI checklist.",
        "instruction": "Inspect the pending deliveries list and identify orders awaiting gate pass generation.",
        "placement": "left"
      },
      {
        "checkpointId": "M4-R25-F1",
        "route": "/sales/delivery-handover",
        "target": "[data-tour=\"delivery-vin-select\"]",
        "block": "Chassis VIN Allocation",
        "field": "chassisVin",
        "badge": "Unit Allocation",
        "trainingType": "practice",
        "title": "Allocate Serialized Chassis VIN",
        "description": "Assign the physical 17-character VIN from showroom inventory to the customer's booking order.",
        "businessRationale": "VIN allocation permanently binds vehicle battery pack, motor serial, and warranty ledger to the buyer.",
        "instruction": "Enter or select the 17-character VIN (e.g. AJE78492048590123).",
        "exampleValue": "AJE78492048590123",
        "validation": {
          "required": true,
          "pattern": "^[A-HJ-NPR-Z0-9]{17}$",
          "rule": "Standard 17-character VIN excluding letters I, O, Q.",
          "emptyMessage": "Chassis VIN is mandatory for vehicle handover.",
          "invalidMessage": "VIN must be exactly 17 characters without I, O, or Q."
        },
        "incorrectFeedback": "VIN must be exactly 17 alphanumeric characters complying with ISO 3779 standard.",
        "successFeedback": "Valid 17-character Chassis VIN allocated.",
        "placement": "right"
      },
      {
        "checkpointId": "M4-R25-F2",
        "route": "/sales/delivery-handover",
        "target": "[data-tour=\"pdi-soh-check\"]",
        "block": "Battery Quality Inspection",
        "field": "batterySOH",
        "badge": "PDI Technical Check",
        "trainingType": "practice",
        "title": "Verify Battery State of Health (SOH >= 98%)",
        "description": "Record the diagnostic BMS readout of the vehicle battery State of Health prior to customer release.",
        "businessRationale": "AJ EcoDrive Quality Standard mandates that no new EV may be delivered with an SOH below 98%.",
        "instruction": "Enter verified battery SOH percentage (Minimum 98%).",
        "exampleValue": "99",
        "validation": {
          "required": true,
          "min": 98,
          "max": 100,
          "rule": "Battery SOH must be between 98% and 100% for delivery clearance.",
          "emptyMessage": "Battery SOH verification is mandatory.",
          "invalidMessage": "Delivery rejected: Battery SOH must be at least 98%."
        },
        "incorrectFeedback": "Delivery blocked! New vehicles cannot be delivered with battery SOH below 98%.",
        "successFeedback": "Battery State of Health meets delivery standard.",
        "placement": "right"
      },
      {
        "checkpointId": "M4-R25-DEC1",
        "route": "/sales/delivery-handover",
        "target": "#dap-delivery-table",
        "block": "PDI Defect Handling",
        "badge": "SOP Decision",
        "trainingType": "decision",
        "title": "PDI Inspection Exception Protocol",
        "description": "During 18-point PDI, the technician notes a minor 2-inch paint scratch on the rear bumper and a 30mV cell voltage delta.",
        "dealershipContext": "Customer is waiting in the showroom lounge for scheduled delivery handover.",
        "instruction": "Select the compliant Branch Manager action:",
        "options": [
          {
            "label": "A: Issue the Gate Pass immediately, release the vehicle, and tell the customer to bring it back next month if they notice it.",
            "isCorrect": false,
            "feedback": "Severe Quality Violation! Customer signature on PDI acknowledges zero defects. Concealing flaws causes disputes and warranty rejection."
          },
          {
            "label": "B: Hold vehicle release, explain the defect transparently to the customer, re-allocate a pristine backup unit from inventory, or arrange immediate workshop touchup.",
            "isCorrect": true,
            "feedback": "Exemplary Leadership! Transparent quality control protects customer trust and brand reputation."
          }
        ],
        "placement": "left"
      },
      {
        "checkpointId": "M4-R25-B1",
        "route": "/sales/delivery-handover",
        "target": "#dap-auth-gatepass",
        "block": "Gate Pass Authorization",
        "badge": "Security Release",
        "trainingType": "execute",
        "actionName": "Generate Official Gate Pass",
        "title": "Authorize Delivery Gate Pass",
        "description": "Generates the encrypted QR-code Gate Pass document presented to Showroom Security at exit gates.",
        "instruction": "Click Authorize Gate Pass to conclude vehicle handover and update inventory status to Delivered.",
        "placement": "top"
      }
    ]
  },
  {
    "id": "mission_inventory_logistics",
    "code": "M5",
    "title": "Serialized Inventory, Transfers & Inbound Procurement",
    "category": "Inventory & Fleet",
    "icon": "📦",
    "description": "Track floor units by VIN and battery serial, initiate inter-branch stock transfers, conduct cycle counts, and quarantine defective stock.",
    "chapters": [
      {
        "code": "5.1",
        "title": "Chassis VIN, Battery Barcode & Movement Ledger",
        "route": "/inventory/serialized-units"
      },
      {
        "code": "5.2",
        "title": "Inbound Shipments & Receiving",
        "route": "/inventory/inbound-deliveries"
      },
      {
        "code": "5.3",
        "title": "Warehouse Replenishment Requests",
        "route": "/inventory/stock-requests"
      },
      {
        "code": "5.4",
        "title": "Inter-Branch Stock Transfers",
        "route": "/inventory/transfers"
      },
      {
        "code": "5.5",
        "title": "Blind Cycle Counts & Stock Audits",
        "route": "/inventory/cycle-counts"
      },
      {
        "code": "5.6",
        "title": "Defective Stock Quarantine",
        "route": "/inventory/quarantine"
      },
      {
        "code": "5.7",
        "title": "Stock Adjustments & Variance Claims",
        "route": "/inventory/stock-adjustments"
      },
      {
        "code": "5.8",
        "title": "Special Catalogue Requests",
        "route": "/catalogue/requests"
      },
      {
        "code": "5.9",
        "title": "Procurement Orders & Receiving",
        "route": "/procurement"
      },
      {
        "code": "5.10",
        "title": "Inventory Dashboard & Valuations",
        "route": "/inventory/dashboard"
      }
    ],
    "steps": [
      {
        "checkpointId": "M5-R21-TBL1",
        "route": "/inventory/serialized-units",
        "target": "#dap-serialized-table",
        "block": "Serialized Units Ledger",
        "badge": "Chassis Master",
        "trainingType": "inspect",
        "title": "Chassis VIN & Battery Barcode Master Table",
        "description": "Every physical electric vehicle is uniquely tracked from assembly plant through showroom arrival to customer delivery.",
        "dealershipContext": "Branch Managers are personally responsible for the physical custody of all serialized assets on branch premises.",
        "instruction": "Inspect unit columns: VIN, Battery Serial, Model, Color, Location, Status, and SOC.",
        "placement": "left"
      },
      {
        "checkpointId": "M5-R21-F1",
        "route": "/inventory/serialized-units",
        "target": "[data-tour=\"unit-filter-status\"]",
        "block": "Inventory Filtration",
        "field": "unitStatusFilter",
        "badge": "Inventory Filter",
        "trainingType": "practice",
        "title": "Filter Units by Operational Status",
        "description": "Filter between Available floor stock, Reserved customer bookings, In-Transit stock, and Quarantined vehicles.",
        "businessRationale": "Quickly determines available stock for walk-in immediate delivery.",
        "instruction": "Select an inventory filter status from the options.",
        "exampleValue": "Available in Showroom",
        "options": [
          {
            "label": "Available in Showroom (Ready for Sale)",
            "value": "Available in Showroom"
          },
          {
            "label": "Reserved for Active Booking Orders",
            "value": "Reserved for Booking"
          },
          {
            "label": "In Transit from Central Warehouse",
            "value": "In Transit"
          },
          {
            "label": "Quarantine / Workshop Technical Hold",
            "value": "Quarantine / Workshop"
          }
        ],
        "validation": {
          "required": true,
          "rule": "Must choose a valid operational stock status."
        },
        "incorrectFeedback": "Please select a valid inventory status filter.",
        "successFeedback": "Inventory filter applied.",
        "placement": "right"
      },
      {
        "checkpointId": "M5-R22-TBL1",
        "route": "/inventory/transfers",
        "target": "[data-tour=\"transfers-table\"]",
        "block": "Stock Transfer Logistics",
        "badge": "Inter-Branch Logistics",
        "trainingType": "inspect",
        "title": "Inter-Branch Stock Transfers Log",
        "description": "Monitors inbound and outbound vehicle transfers between regional AJ EcoDrive branches.",
        "dealershipContext": "Transfer dispatches must be verified against carrier truck manifests before gate clearance.",
        "instruction": "Inspect transfer orders, carrier dispatch notes, and transit tracking numbers.",
        "placement": "left"
      },
      {
        "checkpointId": "M5-R22-F1",
        "route": "/inventory/transfers",
        "target": "[data-tour=\"transfer-dest-branch\"]",
        "block": "Transfer Destination",
        "field": "destinationBranch",
        "badge": "Branch Logistics",
        "trainingType": "practice",
        "title": "Select Transfer Destination Branch",
        "description": "Specify the recipient AJ EcoDrive showroom facility for the dispatched serialized vehicle.",
        "businessRationale": "Transfers update custody responsibility between Branch Managers automatically.",
        "instruction": "Select destination branch from the active dealership network.",
        "exampleValue": "Gulberg Showroom Lahore",
        "options": [
          {
            "label": "Gulberg Showroom Lahore",
            "value": "Gulberg Showroom Lahore"
          },
          {
            "label": "DHA Phase 6 Branch Karachi",
            "value": "DHA Phase 6 Karachi"
          },
          {
            "label": "Blue Area Showroom Islamabad",
            "value": "Blue Area Islamabad"
          }
        ],
        "validation": {
          "required": true,
          "rule": "Must select an authorized branch facility."
        },
        "incorrectFeedback": "Please select a valid destination branch.",
        "successFeedback": "Transfer destination confirmed.",
        "placement": "right"
      },
      {
        "checkpointId": "M5-R23-TBL1",
        "route": "/inventory/cycle-counts",
        "target": "[data-tour=\"cycle-count-table\"]",
        "block": "Cycle Count Audit",
        "badge": "Physical Audit",
        "trainingType": "inspect",
        "title": "Showroom Floor Cycle Count Audit",
        "description": "Periodic physical verification of serialized units, spare parts, and battery packs against ERP ledger balances.",
        "dealershipContext": "Conducted weekly by the Branch Manager and reconciles 100% of physical assets.",
        "instruction": "Review the cycle count schedule and variance percentage metrics.",
        "placement": "left"
      },
      {
        "checkpointId": "M5-R23-DEC1",
        "route": "/inventory/cycle-counts",
        "target": "[data-tour=\"cycle-count-table\"]",
        "block": "Stock Variance SOP",
        "badge": "SOP Decision",
        "trainingType": "decision",
        "title": "Stock Count Discrepancy Protocol",
        "description": "Physical count reveals 14 EcoDrive Alpha units on floor, while the ERP ledger shows 15 units. One VIN cannot be located.",
        "dealershipContext": "Internal Audit requires immediate logging of all serialized asset variances.",
        "instruction": "Select the compliant managerial response:",
        "options": [
          {
            "label": "A: Adjust the ERP ledger downward by 1 unit quietly and write it off as an unallocated transfer without notifying anyone.",
            "isCorrect": false,
            "feedback": "Severe Disciplinary Offense! Unauthorized inventory write-offs without incident logging are treated as asset misappropriation."
          },
          {
            "label": "B: Flag inventory discrepancy immediately, check gate pass security logs, initiate physical showroom perimeter search, and log Incident in Action Centre for Audit.",
            "isCorrect": true,
            "feedback": "Compliant Decision! Immediate escalation and security review are mandatory for missing serialized vehicles."
          }
        ],
        "placement": "left"
      }
    ]
  },
  {
    "id": "mission_workshop_bms",
    "code": "M6",
    "title": "Workshop Job Cards, Repairs & Battery BMS Diagnostic Lab",
    "category": "After-Sales & Workshop",
    "icon": "🔧",
    "description": "Manage customer service intake, open workshop job cards, assign high-voltage technicians, and analyze BMS telemetry.",
    "chapters": [
      {
        "code": "6.1",
        "title": "Service Case Intake & Diagnosis",
        "route": "/after-sales/cases"
      },
      {
        "code": "6.2",
        "title": "Workshop Job Cards Kanban",
        "route": "/after-sales/repair-jobs"
      },
      {
        "code": "6.3",
        "title": "Battery BMS Diagnostic Lab & Warranty",
        "route": "/after-sales/warranty-service"
      },
      {
        "code": "6.4",
        "title": "After-Sales Service Metrics",
        "route": "/after-sales/dashboard"
      }
    ],
    "steps": [
      {
        "checkpointId": "M6-R31-TBL1",
        "route": "/after-sales/cases",
        "target": "[data-tour=\"cases-table\"]",
        "block": "Service Intake Queue",
        "badge": "Service Cases",
        "trainingType": "inspect",
        "title": "Customer Service Case Intake Records",
        "description": "Review incoming customer after-sales requests: periodic maintenance, battery range diagnostics, charging fault codes, and warranty claims.",
        "instruction": "Inspect open service cases, customer reported symptoms, and vehicle odometer readings.",
        "placement": "left"
      },
      {
        "checkpointId": "M6-R32-TBL1",
        "route": "/after-sales/repair-jobs",
        "target": "[data-tour=\"kanban-board\"]",
        "block": "Workshop Bay Kanban",
        "badge": "Workshop Operations",
        "trainingType": "inspect",
        "title": "Workshop Job Cards Kanban Board",
        "description": "Visual tracking of vehicles in Diagnosis, Awaiting Parts, Under Active Repair, Quality Check (QC), and Ready for Collection.",
        "dealershipContext": "Vehicles under active repair must have physical high-voltage lockout tags attached to the battery service disconnect.",
        "instruction": "Inspect the bay assignment columns and observe technician workload distribution.",
        "placement": "top"
      },
      {
        "checkpointId": "M6-R32-F1",
        "route": "/after-sales/repair-jobs",
        "target": "[data-tour=\"jobcard-tech\"]",
        "block": "Technician Assignment",
        "field": "assignedTechnician",
        "badge": "Technician Certification",
        "trainingType": "practice",
        "title": "Assign Certified High-Voltage Technician",
        "description": "Assign work on powertrain and battery systems strictly to certified High-Voltage (HV) electric vehicle technicians.",
        "businessRationale": "Uncertified staff are strictly prohibited from opening battery enclosures under safety regulations.",
        "instruction": "Select a certified technician from the roster.",
        "exampleValue": "Mohammad Bilal (BMS Certified Tech)",
        "options": [
          {
            "label": "Mohammad Bilal (High-Voltage BMS Certified)",
            "value": "Mohammad Bilal (BMS Certified Tech)"
          },
          {
            "label": "Kashif Mehmood (Senior Chassis & Brake Tech)",
            "value": "Kashif Mehmood (Senior EV Tech)"
          }
        ],
        "validation": {
          "required": true,
          "rule": "Must select an authorized certified technician."
        },
        "incorrectFeedback": "Please assign a certified technician.",
        "successFeedback": "Certified technician assigned to job card.",
        "placement": "right"
      },
      {
        "checkpointId": "M6-R33-TBL1",
        "route": "/after-sales/warranty-service",
        "target": "[data-tour=\"bms-telemetry-chart\"]",
        "block": "BMS Telemetry Lab",
        "badge": "Battery Diagnostics",
        "trainingType": "inspect",
        "title": "Battery BMS Cell Telemetry & Thermal Analysis",
        "description": "Detailed analysis of individual cell voltages, temperature gradients across battery modules, and degradation curves.",
        "dealershipContext": "A healthy battery pack exhibits cell voltage variance of under 20mV across all series strings.",
        "instruction": "Inspect the cell voltage delta graph and thermal telemetry sensors.",
        "placement": "left"
      },
      {
        "checkpointId": "M6-R33-DEC1",
        "route": "/after-sales/warranty-service",
        "target": "[data-tour=\"bms-telemetry-chart\"]",
        "block": "Battery Warranty SOP",
        "badge": "SOP Decision",
        "trainingType": "decision",
        "title": "Battery Cell Imbalance Diagnostic Decision",
        "description": "Diagnostic scan on a 6-month-old vehicle reveals a severe 95mV cell voltage delta on Module 3, triggering an automated BMS derate warning.",
        "dealershipContext": "The vehicle is covered under AJ EcoDrive 8-Year Battery Warranty.",
        "instruction": "Select the compliant after-sales action:",
        "options": [
          {
            "label": "A: Reset the BMS fault code with the scan tool and return the car to the customer without replacing the defective module.",
            "isCorrect": false,
            "feedback": "Extremely Hazardous! A 95mV cell delta indicates internal cell degradation or dendrite growth. Suppressing warnings risks thermal runaway."
          },
          {
            "label": "B: Quarantine the battery pack, initiate a formal Warranty Claim in Action Centre, and order a replacement battery module from Central Logistics.",
            "isCorrect": true,
            "feedback": "Compliant Engineering Decision! Protects customer safety, enforces manufacturer warranty, and prevents battery failure."
          }
        ],
        "placement": "left"
      }
    ]
  },
  {
    "id": "mission_petty_cash",
    "code": "M7",
    "title": "Showroom Petty Cash & Expense Float Management",
    "category": "Showroom Finance",
    "icon": "💵",
    "description": "Monitor daily cash drawer float, record petty cash expenses, verify vendor receipts, and enforce discretionary limits.",
    "chapters": [
      {
        "code": "7.1",
        "title": "Showroom Financial Status",
        "route": "/finance/overview"
      },
      {
        "code": "7.2",
        "title": "Petty Cash Voucher Submission & Approvals",
        "route": "/finance/expenses"
      }
    ],
    "steps": [
      {
        "checkpointId": "M7-R34-K1",
        "route": "/finance/overview",
        "target": "[data-tour=\"finance-float-card\"]",
        "block": "Financial Overview",
        "badge": "Cash Control",
        "trainingType": "observe",
        "title": "Daily Showroom Cash Float Balance",
        "description": "Displays current physical cash holding in the branch cashier till, reflecting receipts minus verified expense vouchers.",
        "dealershipContext": "Cash float must be reconciled twice daily (12:00 PM mid-day check and 08:00 PM day-end closing).",
        "instruction": "Verify cash balance matches physical currency in cashier vault.",
        "placement": "bottom"
      },
      {
        "checkpointId": "M7-R35-TBL1",
        "route": "/finance/expenses",
        "target": "#dap-expenses-table",
        "block": "Petty Cash Expenses",
        "badge": "Expense Ledger",
        "trainingType": "inspect",
        "title": "Petty Cash Expenses Ledger",
        "description": "All minor showroom operational disbursements (generator fuel, guest tea, office supplies) must be logged with valid vendor tax receipts.",
        "instruction": "Inspect expense vouchers, approval statuses, and attached invoice scans.",
        "placement": "left"
      },
      {
        "checkpointId": "M7-R35-F1",
        "route": "/finance/expenses",
        "target": "[data-tour=\"expense-amount\"]",
        "block": "Expense Submission",
        "field": "amount",
        "badge": "Expense Amount",
        "trainingType": "practice",
        "title": "Record Expense Voucher Amount",
        "description": "Input the exact rupee amount spent. Single expense vouchers cannot exceed the Branch Manager discretionary ceiling of Rs. 25,000.",
        "businessRationale": "Expenses exceeding Rs. 25,000 require Head of Finance pre-approval via Action Centre.",
        "instruction": "Enter expense amount between Rs. 100 and Rs. 25,000 (e.g. 4500).",
        "exampleValue": "4500",
        "validation": {
          "required": true,
          "min": 100,
          "max": 25000,
          "rule": "Amount must be between 100 and 25,000 PKR.",
          "emptyMessage": "Expense amount is mandatory.",
          "invalidMessage": "Amount exceeds Branch Manager discretionary limit of Rs. 25,000."
        },
        "incorrectFeedback": "Amount exceeds Branch Manager single voucher limit of Rs. 25,000. Escalate to Finance Director.",
        "successFeedback": "Expense amount within authorized branch limit.",
        "placement": "right"
      },
      {
        "checkpointId": "M7-R35-DEC1",
        "route": "/finance/expenses",
        "target": "#dap-expenses-table",
        "block": "Expense Splitting Policy",
        "badge": "SOP Decision",
        "trainingType": "decision",
        "title": "Expense Voucher Governance & Splitting Rules",
        "description": "Showroom air conditioning maintenance invoice arrives totaling Rs. 42,000. The technician suggests splitting it into two Rs. 21,000 vouchers.",
        "dealershipContext": "Under AJ EcoDrive Financial Compliance Policy, splitting invoices to bypass managerial approval ceilings is strictly prohibited.",
        "instruction": "Select the compliant managerial action:",
        "options": [
          {
            "label": "A: Create two separate Rs. 21,000 vouchers so they both fall under the Rs. 25,000 ceiling and approve them immediately.",
            "isCorrect": false,
            "feedback": "Financial Audit Violation! Invoice splitting is flagged by automated audit scripts and considered intentional policy circumvention."
          },
          {
            "label": "B: Log the single invoice for Rs. 42,000 with vendor NTN/receipt attached, and route to Head of Finance for formal pre-approval.",
            "isCorrect": true,
            "feedback": "Compliant Decision! Transparent escalation ensures clean financial audit compliance."
          }
        ],
        "placement": "left"
      },
      {
        "checkpointId": "M7-R35-B1",
        "route": "/finance/expenses",
        "target": "[data-tour=\"expense-submit-btn\"]",
        "block": "Voucher Approval",
        "badge": "Approval Action",
        "trainingType": "execute",
        "actionName": "Approve & Post Expense Voucher",
        "title": "Approve & Post Petty Cash Voucher",
        "description": "Posts the verified expense voucher into the general ledger and updates physical cash float balance.",
        "instruction": "Click Approve to post the voucher and deduct from showroom petty cash float.",
        "placement": "top"
      }
    ]
  },
  {
    "id": "mission_action_centre_audit",
    "code": "M8",
    "title": "Action Centre Triage, Audit & Day-End Z-Closing",
    "category": "Day-End Audit",
    "icon": "🏁",
    "description": "Triage 5-flow operational escalations, review immutable audit logs, count physical vault cash, and generate Daily Z-Closing Report.",
    "chapters": [
      {
        "code": "8.1",
        "title": "Action Centre 5-Flow Escalation Triage",
        "route": "/dashboard/action-centre"
      },
      {
        "code": "8.2",
        "title": "Branch Analytics & Performance Audits",
        "route": "/analytics"
      },
      {
        "code": "8.3",
        "title": "Branch Preferences & Session Security",
        "route": "/system/preferences"
      },
      {
        "code": "8.4",
        "title": "Audit Logs & Operational Traceability",
        "route": "/audit-log"
      },
      {
        "code": "8.5",
        "title": "Cash Vault Count & Z-Closing Lock",
        "route": "/finance/cash-bank"
      },
      {
        "code": "8.6",
        "title": "Operational Closure",
        "route": "/dashboard"
      }
    ],
    "steps": [
      {
        "checkpointId": "M8-R9-H1",
        "route": "/dashboard/action-centre",
        "target": "#dap-action-centre-hub",
        "block": "Operational Triage Hub",
        "badge": "Action Centre",
        "trainingType": "observe",
        "title": "Action Centre 5-Flow Escalation Engine",
        "description": "The Action Centre unifies operational exceptions across 5 critical dealership workflows into a prioritized triage queue.",
        "dealershipContext": "Branch Managers must achieve a \"Zero Unresolved High-Priority Items\" status before executing Day-End Z-Closing.",
        "instruction": "Observe the 5-flow triage dashboard and review pending escalation tallies.",
        "placement": "left"
      },
      {
        "checkpointId": "M8-R9-T1",
        "route": "/dashboard/action-centre",
        "target": "[data-tour=\"flow-leads-tab\"]",
        "block": "Flow 1: Overdue Leads",
        "badge": "Lead Escalations",
        "trainingType": "inspect",
        "title": "Flow 1: Overdue Prospect Follow-Ups",
        "description": "Highlights walk-in and web leads that have not received an advisor response within the mandatory 2-hour SLA window.",
        "instruction": "Inspect overdue leads and reassign stalled prospects to available floor advisors.",
        "placement": "bottom"
      },
      {
        "checkpointId": "M8-R9-T2",
        "route": "/dashboard/action-centre",
        "target": "[data-tour=\"flow-bookings-tab\"]",
        "block": "Flow 2: Pending Deliveries",
        "badge": "Delivery Escalations",
        "trainingType": "inspect",
        "title": "Flow 2: Unallocated Booking Deliveries",
        "description": "Alerts manager to fully funded customer orders that lack physical chassis VIN allocation or pending 18-point PDI.",
        "instruction": "Inspect pending delivery bottlenecks and ensure vehicle readiness.",
        "placement": "bottom"
      },
      {
        "checkpointId": "M8-R9-T3",
        "route": "/dashboard/action-centre",
        "target": "[data-tour=\"flow-transfers-tab\"]",
        "block": "Flow 3: Transit Exceptions",
        "badge": "Logistics Escalations",
        "trainingType": "inspect",
        "title": "Flow 3: In-Transit Stock Transfer Delays",
        "description": "Tracks vehicles in transit between regional branches exceeding expected transit time (over 24 hours).",
        "instruction": "Inspect carrier tracking updates and contact transport logistics drivers.",
        "placement": "bottom"
      },
      {
        "checkpointId": "M8-R9-DEC1",
        "route": "/dashboard/action-centre",
        "target": "#dap-action-centre-hub",
        "block": "Day-End Safety Triage",
        "badge": "SOP Decision",
        "trainingType": "decision",
        "title": "Day-End Safety Alert Resolution",
        "description": "At 07:45 PM before closing, an Action Centre alert shows a customer EV in workshop bay 2 with active battery thermal sensor fault.",
        "dealershipContext": "Day-End closing cannot proceed with unaddressed high-voltage safety alerts.",
        "instruction": "Select the compliant managerial action:",
        "options": [
          {
            "label": "A: Silence the alert and leave the vehicle plugged into the DC fast charger overnight inside the closed showroom.",
            "isCorrect": false,
            "feedback": "Catastrophic Safety Violation! Leaving an EV with active thermal faults plugged in unattended risks electrical fire."
          },
          {
            "label": "B: Physically disconnect charger, move vehicle to outdoor quarantine holding bay, tag out high-voltage circuit, and log safety notes before closing.",
            "isCorrect": true,
            "feedback": "Compliant Safety Protocol! Isolates thermal risks and protects the showroom facility."
          }
        ],
        "placement": "left"
      },
      {
        "checkpointId": "M8-R36-TBL1",
        "route": "/finance/cash-bank",
        "target": "[data-tour=\"cash-tally-container\"]",
        "block": "Cash Vault Reconcile",
        "badge": "Vault Balancing",
        "trainingType": "inspect",
        "title": "Physical Cash Vault Drawer vs POS Tally",
        "description": "Reconciles physical bank notes inside the showroom vault against the total recorded daily sales receipts.",
        "instruction": "Inspect denomination count breakdown (Rs. 5000, 1000, 500 notes).",
        "placement": "left"
      },
      {
        "checkpointId": "M8-R36-F1",
        "route": "/finance/cash-bank",
        "target": "[data-tour=\"cash-closing-count\"]",
        "block": "Physical Vault Count",
        "field": "closingCashTally",
        "badge": "Closing Balance",
        "trainingType": "practice",
        "title": "Enter Verified Physical Cash Tally",
        "description": "Input the final counted rupee balance inside the branch cash drawer prior to sealing vault.",
        "businessRationale": "Ensures exact zero-discrepancy reconciliation between cash-in-hand and accounting ledger.",
        "instruction": "Enter physical cash count (e.g. 345000).",
        "exampleValue": "345000",
        "validation": {
          "required": true,
          "min": 0,
          "rule": "Must enter a valid non-negative rupee amount.",
          "emptyMessage": "Closing physical cash count is mandatory.",
          "invalidMessage": "Enter a valid non-negative cash amount."
        },
        "incorrectFeedback": "Closing cash count is required for reconciliation.",
        "successFeedback": "Physical cash balance matches daily POS collections ledger.",
        "placement": "right"
      },
      {
        "checkpointId": "M8-R36-B1",
        "route": "/finance/cash-bank",
        "target": "[data-tour=\"z-report-seal-btn\"]",
        "block": "Day-End Z-Report",
        "badge": "Day Closing",
        "trainingType": "execute",
        "actionName": "Generate Daily Z-Report & Seal Cash Register",
        "title": "Generate Daily Z-Report & Close Day",
        "description": "Generates the immutable Daily Z-Report, locks financial transactions for the business date, and transmits closure data to Head Office.",
        "instruction": "Click Generate Daily Z-Report to finalize day-end operations.",
        "placement": "top"
      },
      {
        "checkpointId": "M8-R8-H2",
        "route": "/dashboard",
        "target": "#dap-dashboard-overview",
        "block": "Full Operational Mastery",
        "badge": "Mastery Achieved",
        "trainingType": "observe",
        "title": "100% Branch Manager Dealership Certification",
        "description": "You have completed exhaustive practical training across all 155 branch manager routes, verified field validations, and mastered dealership SOPs.",
        "dealershipContext": "Your branch operational adoption state is permanently saved. You can relaunch any chapter or review compliance guidelines at any time.",
        "instruction": "Review your 100% Branch Mastery achievement in the floating HUD.",
        "placement": "left"
      }
    ]
  }
];

export const totalMissionSteps = 57;

export function findStepByCheckpointId(checkpointId) {
  for (const m of branchManagerMissions) {
    const s = m.steps.find(step => step.checkpointId === checkpointId);
    if (s) return s;
  }
  return null;
}

export function findMissionByRoute(route) {
  for (const m of branchManagerMissions) {
    if (m.chapters && m.chapters.some(c => c.route === route)) {
      return m;
    }
  }
  return null;
}

export default {
  missions: branchManagerMissions,
  totalSteps: totalMissionSteps,
  findStepByCheckpointId,
  findMissionByRoute
};
