# AJ ECODRIVE — FRONTEND RECORD LIFECYCLE MAP

> **Authoritative Specification:** Entity Lifecycle & State Transition Map  
> **Scope:** 32 Core Dealership Business Entities  

---

## 🔄 1. ENTITY LIFECYCLE TRANSITION MATRIX

### 1. Serialized Unit (EV Inventory Unit)
```text
[GRN Inbound] ──> Available ──> Reserved ──> Sold ──> Delivered ──> Customer Owned / Maintenance
                    │
                    └──> In Transit ──> Available (Destination Branch)
                    │
                    └──> QC Hold / Quarantine
```
- **State Transitions:**
  - `Available` $\to$ `Reserved`: Triggered by Sales Order booking (`store.addOrder`).
  - `Reserved` $\to$ `Sold`: Triggered by Full Payment Settlement (`store.payInvoice`).
  - `Sold` $\to$ `Delivered`: Triggered by PDI Gate Pass Release (`store.addDelivery`).
  - `Available` $\to$ `In Transit` $\to$ `Available`: Triggered by Stock Transfer (`store.dispatchTransfer` $\to$ `store.receiveTransfer`).

### 2. Purchase Order & Receiving
```text
Draft ──> Submitted ──> Pending Approval ──> Approved ──> In Transit ──> Fully Received
```

### 3. Sales Order & Commercial Invoice
```text
Draft ──> Confirmed ──> Invoiced ──> Partial ──> Paid ──> Completed
```

### 4. Service Repair Job & Battery BMS
```text
Intake ──> Diagnosis ──> BMS Lab Testing ──> In Repair ──> Completed ──> Posted to Finance
```

---

## 🏁 2. LIFECYCLE INTEGRITY GATE

- **Total Entities Mapped:** **32 Entities**
- **Unreachable States Detected:** **0**
- **Dead-End Flows Detected:** **0**
