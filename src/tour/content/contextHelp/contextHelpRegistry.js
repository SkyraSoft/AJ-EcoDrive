/**
 * AJ EcoDrive — Context Help Registry ("What Does This Mean?")
 * PROGRAM: AJ-TOUR-RECONSTRUCT-2026
 * PHASE 6: CHECKPOINT 6.2 — FULL CURRICULUM ROLLOUT
 *
 * Implements compact, single-concept contextual explanations for:
 * - Vehicle Inventory & Lifecycle Statuses
 * - Key Financial & Operational Metrics (KPIs)
 * - Procurement & Supply Chain Stages
 * - Central Action Centre Queues & Governance
 * - Serialized Hardware Concepts (Chassis, Battery, SOH)
 *
 * Design Invariant: Compact, fast, non-intrusive. Never forces full page tour for a single definition.
 */

export const contextHelpRegistry = [
  // --- INVENTORY STATUSES ---
  {
    topicId: 'status-available',
    title: 'Status: Available',
    category: 'Inventory Status',
    targetId: 'shared.inventory.status.available',
    summary: 'Physically present and unencumbered vehicle ready for immediate customer quotation, reservation, or dispatch.',
    details: 'The unit has passed Pre-Delivery Inspection (PDI) or Goods Receipt verification and is stored in warehouse or showroom floor with zero active customer holds.',
    relatedTerms: ['status-reserved', 'status-in-transit'],
  },
  {
    topicId: 'status-reserved',
    title: 'Status: Reserved',
    category: 'Inventory Status',
    targetId: 'shared.inventory.status.reserved',
    summary: 'Allocated to a specific customer order by chassis/serial number. Locked from other sales.',
    details: 'A unit enters Reserved status only when an active Sales Order has a specific physical chassis assigned. Quotation alone never reserves stock.',
    relatedTerms: ['status-available', 'status-sold'],
  },
  {
    topicId: 'status-in-transit',
    title: 'Status: Transfer In Transit',
    category: 'Inventory Status',
    targetId: 'shared.inventory.status.in-transit',
    summary: 'Dispatched from source facility and en route to destination showroom or hub.',
    details: 'Custody is temporarily held by the logistics carrier. Units cannot be delivered to customers until the receiving branch acknowledges delivery and verifies serial numbers.',
    relatedTerms: ['status-available'],
  },
  {
    topicId: 'status-sold',
    title: 'Status: Sold',
    category: 'Inventory Status',
    targetId: 'shared.inventory.status.sold',
    summary: 'Customer handover completed; operational custody transferred; removed from active stock balance.',
    details: 'Handover protocol completed and keys delivered. Cost of Goods Sold is booked in the general ledger and vehicle enters warranty tracking.',
    relatedTerms: ['status-reserved'],
  },
  {
    topicId: 'status-in-service',
    title: 'Status: In Service',
    category: 'Inventory Status',
    targetId: 'shared.inventory.status.in-service',
    summary: 'Undergoing warranty repair, battery reconditioning, or routine showroom maintenance in the workshop.',
    details: 'Temporarily removed from sellable stock. Returns to Available upon workshop job card sign-off.',
    relatedTerms: ['status-available'],
  },

  // --- KEY PERFORMANCE INDICATORS (KPIS) ---
  {
    topicId: 'kpi-net-sales',
    title: 'KPI: Net Sales',
    category: 'Financial Metrics',
    targetId: 'sa.analytics.kpi.net-sales',
    summary: 'Gross Vehicle and Parts revenue minus approved trade discounts and returned goods allowances.',
    details: 'Net Sales = Gross Invoiced Amount - Commercial Discounts - Sales Returns / Customer Refunds. Represents real top-line realized revenue.',
    relatedTerms: ['kpi-gross-profit'],
  },
  {
    topicId: 'kpi-gross-profit',
    title: 'KPI: Gross Profit & Margin',
    category: 'Financial Metrics',
    targetId: 'sa.analytics.kpi.gross-profit',
    summary: 'Revenue remaining after deducting true landed Cost of Goods Sold (COGS).',
    details: 'Gross Profit = Net Sales - Landed Vehicle Unit Cost. Landed unit cost includes base supplier price, shipping freight, and customs clearance.',
    relatedTerms: ['kpi-net-sales'],
  },
  {
    topicId: 'kpi-inventory-valuation',
    title: 'KPI: Total Inventory Valuation',
    category: 'Financial Metrics',
    targetId: 'sa.analytics.kpi.inventory-valuation',
    summary: 'Balance sheet asset value of all physically held vehicles, spare parts, and accessories.',
    details: 'Valued at lower of landed cost or net realizable value across all company showrooms and central logistics hubs.',
    relatedTerms: ['kpi-aging-stock'],
  },
  {
    topicId: 'kpi-aging-stock',
    title: 'KPI: Aging Stock (> 60 Days)',
    category: 'Operational Metrics',
    targetId: 'sa.analytics.kpi.aging-stock',
    summary: 'Vehicles that have remained in showroom or warehouse inventory beyond target turnover cycle.',
    details: 'Monitored closely to prevent battery degradation through periodic trickle charging and to prompt promotional reallocation across branches.',
    relatedTerms: ['kpi-inventory-valuation'],
  },

  // --- WORKFLOW & FINANCIAL CONCEPTS ---
  {
    topicId: 'term-po-vs-receipt',
    title: 'Purchase Order vs Goods Receipt',
    category: 'Procurement Workflow',
    targetId: 'sa.procurement.orders.overview',
    summary: 'PO is commercial purchasing intent; Goods Receipt is physical stock intake and verification.',
    details: 'PO creates zero stock. Physical units are only entered into inventory ledgers upon verified Goods Receipt and serial/chassis barcode scanning.',
    relatedTerms: ['term-landed-cost'],
  },
  {
    topicId: 'term-landed-cost',
    title: 'Landed Cost Capitalisation',
    category: 'Procurement Workflow',
    targetId: 'sa.procurement.landed-costs.overview',
    summary: 'Apportioning freight, clearance, port duties, and transit insurance onto base unit asset cost.',
    details: 'Ensures that vehicle asset value reflects the total cost to bring the EV to showroom-ready state, preventing margin distortion.',
    relatedTerms: ['term-po-vs-receipt'],
  },
  {
    topicId: 'term-request-vs-transfer',
    title: 'Stock Request vs Transfer Order',
    category: 'Logistics Workflow',
    targetId: 'bm.inventory.stock-requests.overview',
    summary: 'Stock Request is a demand signal; Transfer Order is the authorized logistics movement.',
    details: 'Approving a showroom stock request authorizes planning. It does NOT move units. An Inter-Branch Transfer Order must be issued and dispatched with specific serial numbers.',
    relatedTerms: ['status-in-transit'],
  },
  {
    topicId: 'term-approval-vs-payment',
    title: 'Expense Approval vs Payout',
    category: 'Finance Workflow',
    targetId: 'sa.finance.expenses.overview',
    summary: 'Approving an expense confirms validity; payment disburses actual funds from cash or bank.',
    details: 'Expense approval authorizes expenditure against budget. Cash is deducted only when the payment voucher is posted with disbursement bank reference.',
    relatedTerms: [],
  },

  // --- SERIALIZED HARDWARE CONCEPTS ---
  {
    topicId: 'hardware-chassis-serial',
    title: 'Chassis & Frame Serial Number',
    category: 'Hardware Identity',
    targetId: 'shared.inventory.asset.chassis-serial',
    summary: 'Unique alphanumeric vehicle frame and chassis serial number stamped on vehicle structure.',
    details: 'Primary operational and warranty identifier for electric two-wheelers, three-wheelers, and commercial cargo EVs in the AJ EcoDrive fleet.',
    relatedTerms: ['hardware-battery-serial'],
  },
  {
    topicId: 'hardware-battery-serial',
    title: 'Battery Pack Serial Number',
    category: 'Hardware Identity',
    targetId: 'shared.inventory.asset.battery-serial',
    summary: 'Individual serialized barcode of the lithium-ion or sodium-ion battery pack installed in the unit.',
    details: 'Tracked independently of the vehicle frame to support modular battery swap, warranty degradation tracking, and secondary life repurposing.',
    relatedTerms: ['hardware-soh'],
  },
  {
    topicId: 'hardware-soh',
    title: 'State of Health (SOH)',
    category: 'Hardware Identity',
    targetId: 'shared.inventory.asset.soh',
    summary: 'Diagnostic metric representing current battery capacity relative to original manufactured rating (%).',
    details: 'Logged during workshop inspections and PDI to assess battery degradation, range retention, and warranty eligibility.',
    relatedTerms: ['hardware-battery-serial'],
  },

  // --- ACTION CENTRE CONCEPTS ---
  {
    topicId: 'queue-action-centre',
    title: 'Central Action Centre',
    category: 'Governance & Queues',
    targetId: 'sa.action-centre.hub.overview',
    summary: 'Unified Head Office clearinghouse consolidating cross-branch approvals and exception workflows.',
    details: 'Aggregates Product Requests, Stock Transfers, Expense Authorizations, PO Approvals, and Inventory Adjustments into prioritized review queues.',
    relatedTerms: [],
  },
];
