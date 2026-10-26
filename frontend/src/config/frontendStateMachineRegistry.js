/**
 * AJ EcoDrive — Master State Machine Registry
 * Machine-Readable Specification of Entity States & Valid Transitions
 */

export const stateMachineRegistry = [
  {
    "entity": "SerializedUnit",
    "description": "EV Serialized Inventory Unit Lifecycle",
    "initialState": "Inbound GRN",
    "states": [
      "Available",
      "Reserved",
      "Sold",
      "Delivered",
      "In Transit",
      "QC Hold",
      "Maintenance"
    ],
    "transitions": [
      {
        "from": "Inbound GRN",
        "to": "Available",
        "trigger": "Post GRN Receipt (store.addPurchaseOrder)",
        "actor": "Inventory Lead"
      },
      {
        "from": "Available",
        "to": "Reserved",
        "trigger": "Sales Order Booking (store.addOrder)",
        "actor": "Branch Manager"
      },
      {
        "from": "Reserved",
        "to": "Sold",
        "trigger": "Invoice Paid Settlement (store.payInvoice)",
        "actor": "Branch Manager"
      },
      {
        "from": "Sold",
        "to": "Delivered",
        "trigger": "PDI Handover Release (store.addDelivery)",
        "actor": "Delivery Officer"
      },
      {
        "from": "Available",
        "to": "In Transit",
        "trigger": "Dispatch Stock Transfer (store.dispatchTransfer)",
        "actor": "Origin BM"
      },
      {
        "from": "In Transit",
        "to": "Available",
        "trigger": "Receive Stock Transfer (store.receiveTransfer)",
        "actor": "Destination BM"
      }
    ]
  },
  {
    "entity": "PurchaseOrder",
    "description": "Factory Purchase Order Lifecycle",
    "initialState": "Draft",
    "states": [
      "Draft",
      "Submitted",
      "Pending Approval",
      "Approved",
      "In Transit",
      "Fully Received"
    ],
    "transitions": [
      {
        "from": "Draft",
        "to": "Approved",
        "trigger": "Submit Purchase Order (store.addPurchaseOrder)",
        "actor": "Branch Manager"
      },
      {
        "from": "Approved",
        "to": "Fully Received",
        "trigger": "Post Receipt (store.receivePurchaseOrder)",
        "actor": "Inventory Lead"
      }
    ]
  },
  {
    "entity": "Expense",
    "description": "Petty Cash Expense Voucher Lifecycle",
    "initialState": "Draft",
    "states": [
      "Draft",
      "Pending SA Approval",
      "Approved",
      "Rejected"
    ],
    "transitions": [
      {
        "from": "Draft",
        "to": "Pending SA Approval",
        "trigger": "Submit Voucher > PKR 15k (store.addExpense)",
        "actor": "Branch Manager"
      },
      {
        "from": "Pending SA Approval",
        "to": "Approved",
        "trigger": "SA Approve Expense (store.approveExpense)",
        "actor": "Super Admin"
      },
      {
        "from": "Pending SA Approval",
        "to": "Rejected",
        "trigger": "SA Reject Expense (store.rejectExpense)",
        "actor": "Super Admin"
      }
    ]
  }
];

export const totalEntitiesMapped = 3;

export default {
  stateMachines: stateMachineRegistry,
  totalEntities: totalEntitiesMapped
};
