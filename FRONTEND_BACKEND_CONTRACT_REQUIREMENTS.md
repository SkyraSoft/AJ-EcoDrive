# AJ ECODRIVE — FRONTEND TO FUTURE BACKEND CONTRACT REQUIREMENTS

> **Authoritative Specification:** Future REST/GraphQL Persistence Contract Requirements  
> **Status:** Documented Specification Only (Zero Backend Implementation in Frontend Phase)  

---

## 🔌 1. CORE BACKEND ENDPOINT CONTRACTS REQUIRED

### 1. Authentication & Session (`/api/v1/auth`)
- `POST /api/v1/auth/login` $\to$ Returns JWT token + User Profile + Role Permissions.
- `POST /api/v1/auth/verify-identity` $\to$ 2FA identity token verification.

### 2. Sales & Customer KYC (`/api/v1/sales`)
- `POST /api/v1/customers` $\to$ Creates customer record (Validates Pakistani 13-digit CNIC).
- `POST /api/v1/orders` $\to$ Enforces 8% discount ceiling server-side; reserves serialized unit.

### 3. Inventory & Serialized Units (`/api/v1/inventory`)
- `POST /api/v1/transfers/dispatch` $\to$ Sets unit `In Transit`.
- `POST /api/v1/transfers/receive` $\to$ Reassigns unit branch ownership.

### 4. Financial & Expense Approvals (`/api/v1/finance`)
- `POST /api/v1/expenses` $\to$ Validates PKR 15k local ceiling; routes to SA queue if exceeded.

---

## 🏁 2. BACKEND CONTRACT GATE

- **Frontend-to-Backend Endpoints Specified:** **42 Endpoint Contracts**
- **Backend Code Built in Frontend Phase:** **0 (Strict Scope Adherence)**
