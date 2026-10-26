# AJ EcoDrive — Backend Services & API Gateway

> **Architectural Roadmap & Enterprise Backend Specifications**  
> *Target Stack: Node.js, Express / Fastify, PostgreSQL / SQLite (Local-First Offline-Ready), Redis Cache, and JWT Role-Based Access Control.*

---

## 1. Overview & Architecture

The **AJ EcoDrive Backend** will provide scalable, resilient REST APIs and real-time synchronization services for the AJ EcoDrive Electric Vehicle Dealership Management System.

Built to support both **Headquarters Multi-Tenant Operations** and **Branch Local-First Offline Resilience**, the backend implements:
- **Central Headquarters API Gateway:** Manages global product catalogs, price rules, cross-branch transfers, master procurement, and organization-wide rollups.
- **Branch Offline Sync Outbox Engine:** Syncs local branch transactions (cash receipts, job cards, customer bookings) to the central data lake with automatic conflict resolution.
- **Deterministic Ledger & Audit Subsystem:** Immutable recording of inventory movements, serial state changes, and financial journal entries.

---

## 2. Target Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Runtime & Framework** | Node.js (v20+ LTS) / Express / Fastify | High-throughput, asynchronous RESTful API services |
| **Database (Primary)** | PostgreSQL (HQ) / SQLite3 (Branch Local) | ACID-compliant relational data store with JSONB support |
| **Caching & Queues** | Redis / BullMQ | Session caching, job queues, background report generation |
| **Authentication & RBAC** | JWT (JSON Web Tokens) & Argon2 hashing | Fine-grained Super Admin vs. Branch Manager role enforcement |
| **Data Validation** | Zod / Joi | Strict schema enforcement matching frontend action contracts |
| **Documentation & Spec** | OpenAPI 3.1 / Swagger | Self-documenting API contracts |

---

## 3. Core Domain Modules to Implement

1. **Authentication & Session Management (`/api/v1/auth`)**
   - User identity verification, multi-factor tokens, role capabilities, and password lifecycle.
2. **Inventory & Serialized VIN Ledger (`/api/v1/inventory`)**
   - Serialized chassis/motor/battery tracking, stock levels by branch, inbound supplier GRN, transfer manifests, cycle counts, and quarantine states.
3. **Sales, Quotations & CRM (`/api/v1/sales`)**
   - Quotation calculations, commercial discounts (BM 8% ceiling), invoices, partial payments, PDI delivery handover, and automatic warranty provisioning.
4. **Procurement & Landed Costs (`/api/v1/procurement`)**
   - Purchase orders, supplier tracking, vendor bills, and container landed cost distributions (Customs, Freight, Assembly).
5. **After-Sales & Workshop (`/api/v1/after-sales`)**
   - Intake diagnosis, repair job cards, warranty verification, mechanic labor and spare parts tracking.
6. **Finance & Cash Drawers (`/api/v1/finance`)**
   - Expense vouchers (BM PKR 15,000 threshold), payables, receivables, split payments, and cashier reconciliation.
7. **Cross-Branch Synchronization (`/api/v1/sync`)**
   - Delta sync endpoints consuming branch offline outboxes with deterministic timestamps.

---

## 4. Getting Started (Upcoming Development)

```bash
# Navigate to backend directory
cd backend

# Initialize dependencies (once scaffolded)
npm install

# Start development server
npm run dev
```

For the complete frontend-to-backend contract definitions and schemas, refer to:
- `../frontend/FRONTEND_BACKEND_CONTRACT_REQUIREMENTS.md`
- `../frontend/FRONTEND_ACTION_CONTRACT_REGISTRY.md`
- `../frontend/FRONTEND_FORM_SCHEMA_REGISTRY.md`
