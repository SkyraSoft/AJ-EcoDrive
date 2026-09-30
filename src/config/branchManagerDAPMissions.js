/**
 * AJ EcoDrive — Branch Manager DAP & Interactive Missions Registry
 * Audited 8-Stage Chronological Lifecycle with Zero-Overlap Dynamic Placement Hints
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
        target: '#dap-dashboard-overview',
        route: '/dashboard',
        title: 'Showroom Command Hub',
        description: 'Welcome to your daily Branch Manager dashboard. Each morning, start here to assess live branch status, active alerts, and footfall metrics before opening showroom shutters.',
        dealershipContext: 'In Pakistani dealership operations, morning readiness audits ensure biometric attendance is logged and physical security locks are released on time (typically 09:00 AM PKT).',
        actionRequired: 'Inspect your branch operational summary and active date.',
        badge: 'Stage 1: Morning Startup',
        placement: 'bottom'
      },
      {
        target: '#dap-kpi-available-stock',
        route: '/dashboard',
        title: 'Available EV Showroom Floor Stock',
        description: 'This KPI snapshot displays physical units ready for immediate display and customer test rides (e.g., AJ E-Scooter Alpha 72V, AJ Cargo Rickshaw).',
        dealershipContext: 'Never allow floor display stock to drop below 3 units per primary model without triggering an emergency Central Warehouse requisition.',
        actionRequired: 'Review available display count.',
        badge: 'Stock Health',
        placement: 'left'
      },
      {
        target: '#dap-kpi-open-orders',
        route: '/dashboard',
        title: 'Pending Customer Deliveries & Open Bookings',
        description: 'Displays customer orders booked in previous shifts that are awaiting final balance settlement or Pre-Delivery Inspection (PDI).',
        dealershipContext: 'Deliveries scheduled for today must have their serialized batteries charged to 100% SoC (State of Charge) by 10:00 AM.',
        actionRequired: 'Check the open delivery queue count.',
        badge: 'Order Tracking',
        placement: 'left'
      },
      {
        target: '#dap-kpi-cash-float',
        route: '/dashboard',
        title: 'Showroom Morning Cash Drawer Float',
        description: 'Verifies the physical opening cash float (default PKR 25,000 in small denominations: PKR 100, 500, 1000 notes) in the showroom cash register.',
        dealershipContext: 'Both Cashier and Branch Manager must physically count and co-sign the opening drawer balance before the first customer transaction.',
        actionRequired: 'Confirm cash drawer float is co-signed.',
        badge: 'Cash Integrity',
        placement: 'bottom'
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
        badge: 'Lead Registry',
        placement: 'bottom'
      },
      {
        target: '#dap-btn-new-lead',
        route: '/sales/leads',
        title: 'Register New Walk-in Prospect',
        description: 'Click this button to record customer contact details, model preference, budget range, and scheduled test ride time.',
        dealershipContext: 'Always capture WhatsApp numbers (+92-3XX) for automated digital brochure delivery.',
        actionRequired: 'Click or inspect the New Lead registration button.',
        badge: 'Lead Intake',
        placement: 'left'
      },
      {
        target: '#dap-leads-table',
        route: '/sales/leads',
        title: 'Active Prospect Pipeline & Follow-ups',
        description: 'Track lead stages from initial walk-in to test ride scheduled, price negotiation, and booking conversion.',
        dealershipContext: 'Uncontacted leads over 24 hours trigger an amber alert on the Branch Manager Action Centre.',
        actionRequired: 'Review follow-up due dates.',
        badge: 'Pipeline Audit',
        placement: 'top'
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
        badge: 'Order Ledger',
        placement: 'bottom'
      },
      {
        target: '#dap-btn-new-sale',
        route: '/sales/orders',
        title: 'Launch Point of Sale (POS) Booking Wizard',
        description: 'Launches the multi-step POS wizard to select model, bind 3-way serialized hardware, apply FBR filer tax, and generate the invoice.',
        dealershipContext: 'The POS system automatically prevents selling units currently marked under Quarantine or Maintenance.',
        actionRequired: 'Inspect the POS creation action.',
        badge: 'Point of Sale',
        placement: 'left'
      },
      {
        target: '#dap-orders-table',
        route: '/sales/orders',
        title: 'Customer Order Fulfillment Status',
        description: 'Displays customer name, reserved VIN number, deposit paid, and outstanding receivable balance.',
        dealershipContext: 'Full payment must be verified in bank ledger or cash drawer before dispatching vehicle for Pre-Delivery Inspection (PDI).',
        actionRequired: 'Check payment settlement column.',
        badge: 'Order Audit',
        placement: 'top'
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
        badge: 'Delivery Control',
        placement: 'bottom'
      },
      {
        target: '#dap-delivery-table',
        route: '/sales/delivery-handover',
        title: 'Handover Verification & Gate Pass Dispatch',
        description: 'Verify the 18-point mechanical inspection (brakes, tire PSI, throttle, lights) and 3-way serialized hardware binding.',
        dealershipContext: 'Security guards scan the QR code on the printed Gate Pass to confirm legal release.',
        actionRequired: 'Review delivery checklist verification status.',
        badge: 'Gate Pass Security',
        placement: 'top'
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
        badge: 'Asset Tracking',
        placement: 'bottom'
      },
      {
        target: '#dap-serialized-table',
        route: '/inventory/serialized-units',
        title: 'Frame VIN & Battery Barcode Registry',
        description: 'Detailed grid showing 17-character chassis number, lithium pack ID, and current branch storage location.',
        dealershipContext: 'Units with showroom floor age > 45 days are highlighted for active promotional test rides.',
        actionRequired: 'Inspect individual unit record.',
        badge: 'VIN Ledger',
        placement: 'top'
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
        title: 'Workshop Job Cards Command',
        description: 'Live progress tracking of all vehicles in service bays: Intake -> Diagnostic -> Parts -> Active Repair -> QC -> Ready.',
        dealershipContext: 'EV workshop throughput target is < 4 hours for scheduled maintenance and < 24 hours for battery cell balancing.',
        actionRequired: 'Inspect active technician repair bays.',
        badge: 'Service Workshop',
        placement: 'bottom'
      },
      {
        target: '#dap-repairs-table',
        route: '/after-sales/repair-jobs',
        title: 'Repair Job Cards & Technician Assignment',
        description: 'Manage diagnostic findings, replaced spare parts (controller, motor, battery module), and customer warranty coverage.',
        dealershipContext: 'Repairs covered under the 3-Year Factory Warranty require zero customer out-of-pocket charges.',
        actionRequired: 'Inspect active repair job card status.',
        badge: 'Workshop QC',
        placement: 'top'
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
        badge: 'Expense Ledger',
        placement: 'bottom'
      },
      {
        target: '#dap-btn-new-expense',
        route: '/finance/expenses',
        title: 'Submit / Record Operational Expense',
        description: 'Record vendor name, expense category, PKR amount, and upload mandatory photo attachment of the physical cash receipt.',
        dealershipContext: 'No cash disbursement is permitted without an attached physical receipt or vendor cash memo.',
        actionRequired: 'Inspect expense submission fields.',
        badge: 'Cash Voucher',
        placement: 'left'
      },
      {
        target: '#dap-expenses-table',
        route: '/finance/expenses',
        title: 'Expense Approval Queue & Receipt Verification',
        description: 'Examine expense category, claimed PKR amount, and attached physical receipt photos before granting approval.',
        dealershipContext: 'Disbursed expenses instantly deduct from the showroom petty cash ledger balance.',
        actionRequired: 'Verify expense voucher approval status.',
        badge: 'Expense Audit',
        placement: 'top'
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
        badge: 'Action Centre',
        placement: 'bottom'
      },
      {
        target: '#dap-actioncentre-table',
        route: '/dashboard/action-centre',
        title: 'Decision Treatment Drawer & Sign-off',
        description: 'Select any pending case to review 3-way compliance documents, inspect initiator notes, and execute digital approval or rejection.',
        dealershipContext: 'Approved gate passes instantly notify the showroom security gate and customer via SMS.',
        actionRequired: 'Inspect the action item table.',
        badge: 'Managerial Sign-off',
        placement: 'top'
      }
    ]
  }
]
