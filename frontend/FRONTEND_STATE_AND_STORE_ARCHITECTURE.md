# AJ ECODRIVE — FRONTEND STATE AND STORE ARCHITECTURE

> **Authoritative Specification:** Central Store Architecture & State Mutation Specification  

---

## 🏛️ 1. CENTRAL REACTIVE STORE SCHEME (`src/store.js`)

AJ EcoDrive utilizes a single authoritative reactive store object (`store`) containing:
- **`store.currentUser`:** Authenticated session user, role (`Super Admin` / `Branch Manager`), active branch.
- **`store.settings`:** Canonical dealership legal name (`AJ EcoDrive Ltd`), currency (`PKR`), document prefixes (`SO-`, `INV-`, `QT-`, `PO-`).
- **`store.branches`**, **`store.users`**, **`store.products`**, **`store.suppliers`**, **`store.purchaseOrders`**, **`store.serializedUnits`**, **`store.stockRequests`**, **`store.transfers`**, **`store.customers`**, **`store.leads`**, **`store.quotations`**, **`store.orders`**, **`store.invoices`**, **`store.payments`**, **`store.deliveries`**, **`store.repairs`**, **`store.expenses`**, **`store.auditLogs`**.

---

## 🏁 2. STORE ARCHITECTURE GATE

- **Single Source of Truth:** `src/store.js` + `src/stores/dapStore.js`
- **Orphan Component Stores:** **0**
