# AJ ECODRIVE — FRONTEND MASTER TRACEABILITY MATRIX

| UI Block ID | Route | Component | Data Source | Producing Role | Branch Scope | Downstream Consumer | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :---: |
| `customer-kyc-cnic` | `/sales/customers/create` | `CreateCustomer.vue` | `store.customers` | Branch Manager | Own Branch | Order Booking, Ownership | ✅ Verified |
| `sales-order-discount` | `/sales/create-sale` | `CreateSale.vue` | `store.orders` | Branch Manager | Own Branch | Commercial Invoice (8% ceiling) | ✅ Verified |
| `unit-chassis-vin` | `/inventory/receive-purchase`| `ReceivePurchase.vue` | `store.serializedUnits`| Inventory Lead | Current Branch | Unit Detail, Transfer, Sales | ✅ Verified |
| `petty-cash-amount` | `/finance/expenses/create` | `CreateExpense.vue` | `store.expenses` | Branch Manager | Own Branch | Cash Vault (PKR 15k limit) | ✅ Verified |
| `repair-battery-soh` | `/after-sales/create-repair`| `CreateRepairJob.vue` | `store.repairs` | Service Advisor | Workshop Desk | OEM Warranty Billing | ✅ Verified |
