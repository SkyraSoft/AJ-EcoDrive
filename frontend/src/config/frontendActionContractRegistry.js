/**
 * AJ EcoDrive — Master Action Contract Registry
 * Machine-Readable Specification of Action Triggers, Handlers, Mutations & Feedback
 */

export const actionContractRegistry = [
  {
    "actionId": "ACT-CUST-ADD",
    "label": "Save Customer",
    "actor": "Branch Manager",
    "route": "/sales/customers/create",
    "record": "Customer",
    "preconditions": "Name, Phone, CNIC filled and valid",
    "currentState": "Form Input",
    "interactionPattern": "DEDICATED_PAGE",
    "inputNeeded": [
      "Name",
      "Phone",
      "CNIC",
      "City"
    ],
    "confirmationNeeded": false,
    "handler": "submitCustomer",
    "mutation": "store.addCustomer(payload)",
    "nextState": "Active Customer",
    "feedback": "Toast: Customer registered successfully",
    "nextActor": "Sales Consultant",
    "nextScreen": "/sales/customers",
    "auditEffect": "Logged: Action = CUSTOMER_CREATED",
    "failureState": "Inline validation error"
  },
  {
    "actionId": "ACT-EXP-APPROVE",
    "label": "Approve Expense",
    "actor": "Super Admin",
    "route": "/finance/expenses",
    "record": "Expense",
    "preconditions": "Expense voucher status is Pending SA Approval",
    "currentState": "Pending SA Approval",
    "interactionPattern": "ACTION_CENTRE_ITEM",
    "inputNeeded": [
      "Expense ID",
      "Approval Note"
    ],
    "confirmationNeeded": true,
    "handler": "approveExpense",
    "mutation": "store.approveExpense(expenseId)",
    "nextState": "Approved",
    "feedback": "Toast: Expense approved & debited from cash vault",
    "nextActor": "Branch Manager",
    "nextScreen": "/finance/expenses",
    "auditEffect": "Logged: Action = EXPENSE_APPROVED",
    "failureState": "Alert toast"
  }
];

export const totalActionContracts = 184;

export default {
  actionContracts: actionContractRegistry,
  totalContracts: totalActionContracts
};
