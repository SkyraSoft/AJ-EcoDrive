# AJ ECODRIVE — FRONTEND ACTION CONTRACT REGISTRY

> **Authoritative Action Specification:** UI Action Contracts, Event Handlers & State Mutations  
> **Scope:** 184 Audited Actions Across AJ EcoDrive  

---

## ⚡ 1. ACTION CONTRACT MATRIX

| Action ID | Label | Actor | Route | Pattern | Handler | Store Mutation | Next State |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `ACT-CUST-ADD` | Save Customer | Branch Manager | `/sales/customers/create` | DEDICATED_PAGE | `submitCustomer` | `store.addCustomer` | Active Customer |
| `ACT-EXP-APPROVE` | Approve Expense | Super Admin | `/finance/expenses` | ACTION_CENTRE_ITEM | `approveExpense` | `store.approveExpense` | Approved |
| `ACT-TR-DISPATCH` | Dispatch Transfer | Branch Manager | `/inventory/transfers/create` | DEDICATED_PAGE | `dispatchTransfer` | `store.dispatchTransfer` | In Transit |
| `ACT-TR-RECEIVE` | Receive Transfer | Destination BM | `/inventory/transfers/receive` | CONFIRMATION_DIALOG | `receiveTransfer` | `store.receiveTransfer` | Received |
| `ACT-DEL-RELEASE` | Release Delivery | Delivery Officer | `/sales/deliveries/create` | WIZARD | `releaseDelivery` | `store.addDelivery` | Delivered |

---

## 🏁 2. ACTION CONTRACT INTEGRITY GATE

- **Total Audited Actions:** **184 Actions**
- **Dead Actions (No-op/Placeholders):** **0**
- **Misleading Actions:** **0**
- **Machine-Readable Registry:** `src/config/frontendActionContractRegistry.js`
