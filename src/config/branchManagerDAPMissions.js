/**
 * AJ EcoDrive — Branch Manager DAP & Interactive Missions Registry
 * Chronological Dealership Lifecycle Order (Morning Start -> Leads -> POS -> PDI -> Stock -> Service -> Expenses -> Action Centre -> Z-Closing)
 */

export const branchManagerMissions = [
  // =========================================================================
  // MISSION 1: Morning Showroom Opening & System Daily Start
  // =========================================================================
  {
    id: 'mission_morning_start',
    code: 'M1',
    title: 'Morning Showroom Opening & Cash Float Verification',
    subtitle: 'Verify initial showroom readiness, cash float balance, and morning staff presence',
    icon: '🌅',
    category: 'Daily Operations',
    route: '/dashboard',
    steps: [
      {
        target: '#dap-dashboard-header',
        route: '/dashboard',
        title: 'Showroom Command Hub',
        description: 'Welcome to your daily Branch Manager dashboard. Each morning, start here to assess live branch status, active alerts, and footfall metrics before opening showroom shutters.',
        dealershipContext: 'In Pakistani dealership operations, morning readiness audits ensure biometric attendance is logged and physical security locks are released on time (typically 09:00 AM PKT).',
        actionRequired: 'Inspect your branch title and active date display.',
        badge: 'Stage 1: Morning Startup'
      },
      {
        target: '#dap-kpi-available-stock',
        route: '/dashboard',
        title: 'Available EV Showroom Floor Stock',
        description: 'This KPI snapshot displays physical units ready for immediate display and customer test rides (e.g., AJ E-Scooter Alpha 72V, AJ Cargo Rickshaw).',
        dealershipContext: 'Never allow floor display stock to drop below 3 units per primary model without triggering an emergency Central Warehouse requisition.',
        actionRequired: 'Review available display count.',
        badge: 'Stock Health'
      },
      {
        target: '#dap-kpi-open-orders',
        route: '/dashboard',
        title: 'Pending Customer Deliveries & Open Bookings',
        description: 'Displays customer orders booked in previous shifts that are awaiting final balance settlement or Pre-Delivery Inspection (PDI).',
        dealershipContext: 'Deliveries scheduled for today must have their serialized batteries charged to 100% SoC (State of Charge) by 10:00 AM.',
        actionRequired: 'Check the open delivery queue count.',
        badge: 'Order Tracking'
      },
      {
        target: '#dap-kpi-cash-float',
        route: '/dashboard',
        title: 'Showroom Morning Cash Drawer Float',
        description: 'Verifies the physical opening cash float (default PKR 25,000 in small denominations: PKR 100, 500, 1000 notes) in the showroom cash register.',
        dealershipContext: 'Both Cashier and Branch Manager must physically count and co-sign the opening drawer balance before the first customer transaction.',
        actionRequired: 'Confirm cash drawer float is co-signed.',
        badge: 'Cash Integrity'
      }
    ]
  },

  // =========================================================================
  // MISSION 2: Walk-in Lead Intake & Customer NADRA CNIC Verification
  // =========================================================================
  {
    id: 'mission_leads_kyc',
    code: 'M2',
    title: 'Customer Walk-in Intake & NADRA CNIC KYC',
    subtitle: 'Capture walk-in prospects, log test drives, and register verified customer KYC profiles',
    icon: '👥',
    category: 'Sales & Customer Care',
    route: '/sales/leads',
    steps: [
      {
        target: '#dap-leads-header',
        route: '/sales/leads',
        title: 'Showroom Walk-in Leads Ledger',
        description: 'Every customer entering the dealership for an EV inquiry or test ride is logged here to track footfall-to-conversion rates.',
        dealershipContext: 'Showroom sales executives are evaluated on their lead conversion ratio (target: > 28% from walk-in to test ride).',
        actionRequired: 'View the active leads roster.',
        badge: 'Lead Registry'
      },
      {
        target: '#dap-btn-new-lead',
        route: '/sales/leads',
        title: 'Register New Walk-in Prospect',
        description: 'Click this button to record customer contact details, model preference, budget range, and scheduled test ride time.',
        dealershipContext: 'Always capture WhatsApp numbers (+92-3XX) for automated digital brochure delivery.',
        actionRequired: 'Click or inspect the New Lead registration button.',
        interactiveType: 'click',
        badge: 'Lead Intake'
      },
      {
        target: '#dap-customers-tab',
        route: '/sales/customers',
        title: 'Customer Directory & NADRA KYC Hub',
        description: 'Navigates to the verified customer database where 13-digit CNIC records and FBR tax filer statuses are maintained.',
        dealershipContext: 'Pakistani EV regulations mandate 100% CNIC verification to bind vehicle frame VIN numbers to legal owners in excise registries.',
        actionRequired: 'Review customer KYC profiles.',
        badge: 'KYC Compliance'
      }
    ]
  },

  // =========================================================================
  // MISSION 3: POS Quotation, Vehicle Booking & Invoicing
  // =========================================================================
  {
    id: 'mission_pos_sales',
    code: 'M3',
    title: 'POS Quotation, EV Booking & FBR Tax Invoicing',
    subtitle: 'Generate formal price quotations, process booking deposits, and create commercial sales invoices',
    icon: '💳',
    category: 'Retail Sales & POS',
    route: '/sales/orders',
    steps: [
      {
        target: '#dap-orders-header',
        route: '/sales/orders',
        title: 'Sales & Booking Orders Command',
        description: 'Master ledger of all vehicle sales contracts, advance payment deposits, and customer delivery schedules.',
        dealershipContext: 'Sales orders transition from Booking Deposit Received (minimum 10% or PKR 30,000) to Ready for PDI once unit is reserved.',
        actionRequired: 'Examine the sales order table.',
        badge: 'Order Ledger'
      },
      {
        target: '#dap-btn-new-sale',
        route: '/sales/orders',
        title: 'Launch Point of Sale (POS) Booking Wizard',
        description: 'Launches the multi-step POS wizard to select model, bind 3-way serialized hardware, apply FBR filer tax, and generate the invoice.',
        dealershipContext: 'The POS system automatically prevents selling units currently marked under Quarantine or Maintenance.',
        actionRequired: 'Inspect the POS creation action.',
        badge: 'Point of Sale'
      },
      {
        target: '#dap-invoices-tab',
        route: '/sales/invoices',
        title: 'Commercial Invoices & Payment Receipts',
        description: 'Review issued invoices, customer installment balances, and print official computer-generated receipts.',
        dealershipContext: 'FBR tax compliant invoices must clearly show 18% General Sales Tax (GST) or applicable EV subsidy exemption line items.',
        actionRequired: 'Verify outstanding invoice balances.',
        badge: 'Finance Reconciliation'
      }
    ]
  },

  // =========================================================================
  // MISSION 4: Pre-Delivery Inspection (PDI) & Gate Pass Authorization
  // =========================================================================
  {
    id: 'mission_pdi_gatepass',
    code: 'M4',
    title: '18-Point PDI & Delivery Gate Pass Authorization',
    subtitle: 'Verify technician inspection checklist and electronically sign the physical exit Gate Pass',
    icon: '🛵',
    category: 'Vehicle Delivery',
    route: '/sales/delivery-handover',
    steps: [
      {
        target: '#dap-delivery-header',
        route: '/sales/delivery-handover',
        title: 'Delivery & Customer Handover Hub',
        description: 'The final critical stage before any electric motorcycle or rickshaw physically departs through showroom security gates.',
        dealershipContext: 'Zero vehicles may leave the premises without a Branch Manager signed digital Delivery Gate Pass.',
        actionRequired: 'Open the Delivery & Handover queue.',
        badge: 'Delivery Control'
      },
      {
        target: '#dap-pdi-checklist-section',
        route: '/sales/delivery-handover',
        title: '18-Point Mechanical & Electrical PDI Checklist',
        description: 'Mandatory verification covering brake torque, tire PSI, throttle response, lighting, horn, and battery BMS state-of-health.',
        dealershipContext: 'PDI must be signed off by a certified EV technician and verified by the Showroom Service Advisor.',
        actionRequired: 'Verify all 18 PDI checks are marked complete.',
        badge: 'Quality Control'
      },
      {
        target: '#dap-gatepass-qr-badge',
        route: '/sales/delivery-handover',
        title: '3-Way Hardware Binding & Gate Pass QR Code',
        description: 'Displays the cryptographic 3-way binding: Frame VIN + Lithium Battery Serial + Motor Controller BMS ID.',
        dealershipContext: 'Security guards scan this QR code at the showroom gate to verify customer CNIC against the vehicle chassis.',
        actionRequired: 'Review the digital Gate Pass authorization token.',
        badge: 'Gate Security'
      }
    ]
  },

  // =========================================================================
  // MISSION 5: Serialized Inventory & Inter-Branch Stock Transfers
  // =========================================================================
  {
    id: 'mission_inventory_transfers',
    code: 'M5',
    title: 'Serialized Inventory & Stock Transfer Logistics',
    subtitle: 'Track VIN-level assets, blind cycle counts, and inter-branch stock logistics',
    icon: '📦',
    category: 'Showroom Logistics',
    route: '/inventory/serialized-units',
    steps: [
      {
        target: '#dap-serialized-header',
        route: '/inventory/serialized-units',
        title: 'Serialized Unit Asset Ledger',
        description: 'Real-time database tracking individual frame VINs, battery pack barcodes, location bays, and warranty start dates.',
        dealershipContext: 'Every electric motorcycle is tracked as an individual serialized capital asset with live status indicators.',
        actionRequired: 'Review serialized unit statuses (Available, Reserved, Maintenance).',
        badge: 'Asset Tracking'
      },
      {
        target: '#dap-transfers-nav',
        route: '/inventory/transfers',
        title: 'Inter-Branch Stock Transfer Command',
        description: 'Manage vehicle movements between Central Warehouse and regional branches (Peshawar, Islamabad, Lahore, Rawalpindi).',
        dealershipContext: 'Transfers in-transit require carrier truck plate registration and driver CNIC logging for insurance coverage.',
        actionRequired: 'Inspect incoming and outgoing transfer manifests.',
        badge: 'Branch Logistics'
      },
      {
        target: '#dap-cyclecounts-nav',
        route: '/inventory/cycle-counts',
        title: 'Blind Cycle Counts & Stock Audits',
        description: 'Conduct weekly physical asset verification without system quantity previews to eliminate audit bias.',
        dealershipContext: 'Any variance between physical scan count and ledger count triggers an automated variance inquiry to the CFO.',
        actionRequired: 'Check scheduled cycle count audits.',
        badge: 'Audit Control'
      }
    ]
  },

  // =========================================================================
  // MISSION 6: Workshop Job Cards & Battery BMS Diagnostic Lab
  // =========================================================================
  {
    id: 'mission_workshop_service',
    code: 'M6',
    title: 'Workshop Job Cards & Battery BMS Diagnostic Lab',
    subtitle: 'Manage after-sales repair job cards, warranty claims, and lithium battery health diagnostics',
    icon: '🔧',
    category: 'After-Sales & Workshop',
    route: '/after-sales/repair-jobs',
    steps: [
      {
        target: '#dap-repairs-header',
        route: '/after-sales/repair-jobs',
        title: 'Workshop Job Cards Kanban Board',
        description: 'Live progress tracking of all vehicles in service bays: Intake -> Diagnostic -> Parts -> Active Repair -> QC -> Ready.',
        dealershipContext: 'EV workshop throughput target is < 4 hours for scheduled maintenance and < 24 hours for battery cell balancing.',
        actionRequired: 'Inspect active technician repair bays.',
        badge: 'Service Workshop'
      },
      {
        target: '#dap-warranty-cases-nav',
        route: '/after-sales/warranty-service',
        title: 'Battery BMS Lab & Warranty Claims',
        description: 'Specialized diagnostic suite analyzing lithium pack State-of-Health (SOH %), cell voltage deltas (mV), and cycle counts.',
        dealershipContext: 'Lithium battery packs showing cell voltage unbalance > 35mV are quarantined for bench top equalization or warranty replacement.',
        actionRequired: 'Review warranty diagnostic parameters.',
        badge: 'Battery Lab'
      }
    ]
  },

  // =========================================================================
  // MISSION 7: Showroom Petty Cash & Operational Expenses
  // =========================================================================
  {
    id: 'mission_petty_cash',
    code: 'M7',
    title: 'Showroom Petty Cash & Expense Approvals',
    subtitle: 'Approve daily branch operational expenses within managerial limits (< PKR 15,000)',
    icon: '💵',
    category: 'Branch Finance',
    route: '/finance/expenses',
    steps: [
      {
        target: '#dap-expenses-header',
        route: '/finance/expenses',
        title: 'Showroom Petty Cash Ledger',
        description: 'Tracks all showroom utility bills, maintenance expenses, staff tea/refreshments, and minor consumable purchases.',
        dealershipContext: 'Branch Managers have direct approval authority up to PKR 15,000. Expenses above PKR 15,000 route automatically to the Head Office CFO.',
        actionRequired: 'View pending expense claims.',
        badge: 'Expense Ledger'
      },
      {
        target: '#dap-btn-new-expense',
        route: '/finance/expenses',
        title: 'Submit / Record Operational Expense',
        description: 'Record vendor name, expense category, PKR amount, and upload mandatory photo attachment of the physical cash receipt.',
        dealershipContext: 'No cash disbursement is permitted without an attached physical receipt or vendor cash memo.',
        actionRequired: 'Inspect expense submission fields.',
        badge: 'Cash Voucher'
      }
    ]
  },

  // =========================================================================
  // MISSION 8: Action Centre Triage & Day-End Z-Closing Financial Sign-off
  // =========================================================================
  {
    id: 'mission_actioncentre_zclosing',
    code: 'M8',
    title: 'Action Centre Triage & Day-End Z-Closing',
    subtitle: 'Clear managerial approvals across 5 flows and perform day-end financial drawer reconciliation',
    icon: '⚖️',
    category: 'Management & Closing',
    route: '/dashboard/action-centre',
    steps: [
      {
        target: '#dap-actioncentre-header',
        route: '/dashboard/action-centre',
        title: 'Action Centre Command Bridge',
        description: 'Your central managerial inbox for clearing high-priority operational bottlenecks across all 5 enterprise workflows.',
        dealershipContext: 'All SLA-bound items must be treated before 05:30 PM to maintain 100% dealership operational compliance.',
        actionRequired: 'Review priority pending action cards.',
        badge: 'Action Centre'
      },
      {
        target: '#dap-actioncentre-table',
        route: '/dashboard/action-centre',
        title: 'Decision Treatment Drawer & Sign-off',
        description: 'Select any pending case to review 3-way compliance documents, inspect initiator notes, and execute digital approval or rejection.',
        dealershipContext: 'Approved gate passes instantly notify the showroom security gate and customer via SMS.',
        actionRequired: 'Inspect the action item table.',
        badge: 'Managerial Sign-off'
      },
      {
        target: '#dap-cashbank-nav',
        route: '/finance/cash-bank',
        title: 'Day-End Z-Closing & Cash Vault Balancing',
        description: 'Count physical currency denominations, verify net cash intake against POS sales, and lock the daily financial books.',
        dealershipContext: 'Physical cash exceeding PKR 150,000 is sealed in the showroom security drop vault for morning bank deposit.',
        actionRequired: 'Co-sign the daily Z-Closing reconciliation report.',
        badge: 'Z-Closing Audit'
      }
    ]
  }
]
