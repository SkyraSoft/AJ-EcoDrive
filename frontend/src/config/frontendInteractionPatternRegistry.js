/**
 * AJ EcoDrive — Master Interaction Pattern Architecture Registry
 * Machine-Readable Specification of UI Interaction Patterns & Audits
 */

export const interactionPatternRegistry = [
  {
    "actionId": "ACT-001",
    "label": "Archive Branch",
    "actor": "Super Admin",
    "route": "/organisation/branches",
    "intent": "Archive existing branch facility",
    "currentPattern": "CONFIRMATION_DIALOG",
    "recommendedPattern": "CONFIRMATION_DIALOG",
    "patternStatus": "CORRECT",
    "reason": "Destructive action with serious operational consequence; confirmation dialog is appropriate.",
    "requiredInputs": [
      "Branch ID",
      "Confirmation Reason"
    ],
    "decisionType": "binary_confirm",
    "reversibility": "Reversible by Super Admin",
    "risk": "HIGH",
    "downstreamRole": "Branch Manager",
    "downstreamRecord": "Branch",
    "successFeedback": "Toast: Branch archived successfully",
    "failureFeedback": "Inline error alert",
    "nextState": "Archived"
  },
  {
    "actionId": "ACT-002",
    "label": "Create Branch",
    "actor": "Super Admin",
    "route": "/organisation/branches/create",
    "intent": "Provision new dealership facility",
    "currentPattern": "DEDICATED_PAGE",
    "recommendedPattern": "DEDICATED_PAGE",
    "patternStatus": "CORRECT",
    "reason": "Multi-section form with facility details, manager info, location, and operational parameters.",
    "requiredInputs": [
      "Name",
      "Code",
      "City",
      "Address",
      "Manager CNIC"
    ],
    "decisionType": "submit",
    "reversibility": "Irreversible (Requires Archive)",
    "risk": "MEDIUM",
    "downstreamRole": "Super Admin / Branch Manager",
    "downstreamRecord": "Branch",
    "successFeedback": "Navigation to Branch List + Toast",
    "failureFeedback": "Inline Form Errors",
    "nextState": "Active"
  },
  {
    "actionId": "ACT-003",
    "label": "Approve Petty Cash Expense (> PKR 15k)",
    "actor": "Super Admin",
    "route": "/finance/expenses",
    "intent": "Approve branch petty cash expenditure exceeding local threshold",
    "currentPattern": "ACTION_CENTRE_ITEM",
    "recommendedPattern": "ACTION_CENTRE_ITEM",
    "patternStatus": "CORRECT",
    "reason": "Requires tracked operational resolution by Super Admin with audit trail.",
    "requiredInputs": [
      "Expense ID",
      "Approval Note"
    ],
    "decisionType": "multi_choice",
    "reversibility": "Irreversible",
    "risk": "HIGH",
    "downstreamRole": "Branch Manager",
    "downstreamRecord": "Expense",
    "successFeedback": "Action Centre item closed + Notification to BM",
    "failureFeedback": "Alert toast",
    "nextState": "Approved"
  },
  {
    "actionId": "ACT-004",
    "label": "Dispatch Inter-Branch Stock Transfer",
    "actor": "Branch Manager",
    "route": "/inventory/transfers/create",
    "intent": "Dispatch serialized unit to destination branch",
    "currentPattern": "DEDICATED_PAGE",
    "recommendedPattern": "DEDICATED_PAGE",
    "patternStatus": "CORRECT",
    "reason": "Complex multi-step selection involving inventory lookup, VIN verification, and logistics details.",
    "requiredInputs": [
      "Destination Branch",
      "Unit VIN",
      "Logistics Note"
    ],
    "decisionType": "submit",
    "reversibility": "Irreversible after dispatch (requires receive or cancel)",
    "risk": "HIGH",
    "downstreamRole": "Destination Branch Manager",
    "downstreamRecord": "Transfer / Serialized Unit",
    "successFeedback": "Transfer status updated to In Transit + Notification",
    "failureFeedback": "Validation alert",
    "nextState": "In Transit"
  },
  {
    "actionId": "ACT-005",
    "label": "Receive Inter-Branch Stock Transfer",
    "actor": "Destination Branch Manager",
    "route": "/inventory/transfers/receive",
    "intent": "Inspect VIN and accept incoming stock transfer",
    "currentPattern": "CONFIRMATION_DIALOG",
    "recommendedPattern": "CONFIRMATION_DIALOG",
    "patternStatus": "CORRECT",
    "reason": "Unit identity already specified; BM confirms inspection and ownership transfer.",
    "requiredInputs": [
      "Transfer ID",
      "Inspection Check"
    ],
    "decisionType": "binary_confirm",
    "reversibility": "Irreversible",
    "risk": "HIGH",
    "downstreamRole": "Super Admin / Origin BM",
    "downstreamRecord": "Transfer / Serialized Unit",
    "successFeedback": "Unit branch updated + Toast",
    "failureFeedback": "Error toast",
    "nextState": "Received"
  },
  {
    "actionId": "ACT-006",
    "label": "Settle Retail Sales Invoice",
    "actor": "Branch Manager",
    "route": "/sales/invoices",
    "intent": "Record customer payment against outstanding invoice balance",
    "currentPattern": "FORM_MODAL",
    "recommendedPattern": "FORM_MODAL",
    "patternStatus": "CORRECT",
    "reason": "Short contextual modal requiring payment reference, payment method, and payment amount.",
    "requiredInputs": [
      "Invoice ID",
      "Payment Amount",
      "Payment Method",
      "Transaction Ref"
    ],
    "decisionType": "submit",
    "reversibility": "Requires Void/Refund",
    "risk": "HIGH",
    "downstreamRole": "Delivery Officer",
    "downstreamRecord": "Invoice / Payment",
    "successFeedback": "Invoice status set to Paid + Receipt PDF generated",
    "failureFeedback": "Overpayment error alert",
    "nextState": "Paid"
  },
  {
    "actionId": "ACT-007",
    "label": "Execute 18-Point PDI Handover",
    "actor": "Delivery Officer",
    "route": "/sales/deliveries/create",
    "intent": "Complete 18 checklist items and release vehicle gate pass",
    "currentPattern": "WIZARD",
    "recommendedPattern": "WIZARD",
    "patternStatus": "CORRECT",
    "reason": "Sequential step-by-step checklist ensuring safety and completeness prior to vehicle release.",
    "requiredInputs": [
      "Order ID",
      "18 Checkbox Items",
      "Recipient CNIC"
    ],
    "decisionType": "submit",
    "reversibility": "Irreversible",
    "risk": "CRITICAL",
    "downstreamRole": "After-Sales Service Team",
    "downstreamRecord": "Delivery / Serialized Unit",
    "successFeedback": "Gate Pass issued + 2-Year Warranty Auto-registered",
    "failureFeedback": "Incomplete PDI alert",
    "nextState": "Delivered"
  }
];

export const totalActionsCount = 7;
export const correctPatternsCount = 7;

export default {
  actions: interactionPatternRegistry,
  totalActions: totalActionsCount,
  correctPatterns: correctPatternsCount
};
