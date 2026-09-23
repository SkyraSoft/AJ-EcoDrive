# AJ ECODRIVE — Electric Vehicle Dealership Management System

> **A Multi-Branch EV Showroom, Workshop, Inventory & Financial Management Platform**  
> *Built for high-volume operational speed, serialized VIN traceability, and multi-branch organizational control.*

---

## 1. Project Overview

**AJ ECODRIVE** is an enterprise management platform designed specifically for electric vehicle (EV) commercial distribution networks, retail showrooms, and after-sales service centers. Unlike generic ERP or retail POS tools, AJ ECODRIVE treats every electric bike as a serialized, unique asset tracked across its entire lifecycle:
* **Procurement & Inbound GRN:** Container imports, supplier tracking, VIN/Chassis allocation, motor and battery serial logging.
* **CRM & Sales Operations:** Walk-in lead management, quotation calculation, vehicle reservations, legal contracts, and sales handover.
* **Cashier & Payments:** Split invoicing, bank transfers (IBFT), cash drawers, deposit tracking, and receipt generation.
* **Handover & Delivery:** Pre-Delivery Inspections (PDI), road registration, customer ownership transfer, and automatic 2-year OEM warranty activation.
* **After-Sales & Workshop Repairs:** Intake diagnosis, repair job cards, warranty coverage verification, mechanic labor and spare parts billing.
* **Showroom Inventory & Logistics:** Real-time showroom stock, inter-branch transfer manifests, transit tracking, cycle counts, and quarantine holds.
* **Organization & Audit Ledger:** Branch-scoped authorization (Super Admin vs. Branch Manager), multi-branch communication inbox, and immutable audit logs.

---

## 2. Current Development Stage

> [!IMPORTANT]
> **CURRENT STAGE: FRONTEND-COMPLETE HIGH-FIDELITY PROTOTYPE (Pre-Backend Integration)**
>
> * **Interactive Client-Side Architecture:** The current application runs as a fully reactive, high-fidelity Vue 3 application. All forms, state transitions, validation rules, inventory allocations, financial calculations, cross-branch boundaries, and audit logs are 100% operational in memory.
> * **Current In-Memory Limitation:** Business data is maintained in the canonical store (`src/store.js`) during the active session. Changes do not persist to an external database when the browser tab is refreshed.
> * **Target Production Architecture:** The project has been fully documented for a **Local-First Distributed Branch Architecture** (Windows Desktop & Android Tablet operational clients with local durable databases, background synchronization outbox queues, central enterprise backend, and end-of-day reconciliation).

---

## 3. Technology Stack

* **Core Framework:** [Vue.js 3](https://vuejs.org/) (Composition API, `<script setup>`)
* **Build Tool & Bundler:** [Vite 6](https://vitejs.dev/)
* **Routing:** [Vue Router 4](https://router.vuejs.org/) (Role-based route guards and branch scoping)
* **Styling & Design System:** [Tailwind CSS v4](https://tailwindcss.com/) with PostCSS & Autoprefixer
* **Iconography:** [Lucide Vue](https://lucide.dev/) (`lucide-vue-next` & `@lucide/vue`)
* **State Management:** Canonical reactive store (`src/store.js`) with fine-grained mutation methods and deterministic audit logging
* **Testing:** Pure Node.js integration test suites with zero external test runner overhead

---

## 4. Getting Started & Local Development

### Prerequisites
* [Node.js](https://nodejs.org/) (Version 18.x or 20.x recommended)
* `npm` (Version 9.x or higher)

### Installation
Clone the repository and install dependencies:
```bash
# Clone the repository
git clone https://github.com/SkyraSoft/AJ-EcoDrive.git
cd AJ-EcoDrive

# Install dependencies
npm install
```

### Running Locally
Launch the local development server with Hot Module Replacement (HMR):
```bash
npm run dev
```
Navigate to `http://localhost:5173` in your web browser.

### Building for Production
Validate types, compile assets, and generate the optimized production bundle:
```bash
npm run build
```
Build output is generated cleanly into the `dist/` directory.

### Running Automated Integration Tests
Execute the comprehensive test suites covering all business journeys, entity integrity, financial math, and audit immutability:
```bash
# Run master readiness test suite (112 assertions)
npm test

# Run full cross-entity, audit, and master test suites
npm run test:integration
```

---

## 5. Pre-Configured Demo Credentials

The interactive prototype includes ready-to-test role-based accounts:

| Role | Username / Branch Code | Password | Workspace Scope |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin` (or `superadmin`) | `password` | Nationwide oversight across all 4 showrooms, procurement, global settings, and audit logs. |
| **Peshawar Branch Manager** | `PEW-01` (or `peshawar`) | `password` | Scoped strictly to Peshawar showroom floor inventory, sales, leads, expenses, and workshop jobs. |
| **Islamabad Branch Manager** | `ISB-01` (or `islamabad`) | `password` | Scoped strictly to Islamabad showroom operations. |
| **Lahore Branch Manager** | `LHE-01` (or `lahore`) | `password` | Scoped strictly to Lahore showroom operations. |
| **Rawalpindi Branch Manager** | `RWP-01` (or `rawalpindi`) | `password` | Scoped strictly to Rawalpindi showroom operations. |

---

## 6. Project Directory Structure

```text
AJ-EcoDrive/
├── public/                 # Static public assets, favicon, and SVG icons
├── src/                    # Application source code
│   ├── assets/             # Brand logos and global style sheets (style.css)
│   ├── components/         # Reusable UI primitives (BaseInput, BaseButton, modals)
│   ├── layouts/            # MainLayout (header, sidebar navigation, unread alerts)
│   ├── router/             # Vue Router configuration & role-based navigation guards
│   ├── views/              # Feature modules grouped by business domain:
│   │   ├── after-sales/    # Warranty claims, workshop service cases, repair jobs
│   │   ├── analytics/      # Reports hub, sales & financial reporting
│   │   ├── auth/           # Login, identity verification, password recovery
│   │   ├── catalogue/      # EV models, spare parts, price lists, product requests
│   │   ├── communication/  # Management Inbox, multi-branch messaging threads
│   │   ├── dashboard/      # Super Admin & Branch Manager executive KPI dashboards
│   │   ├── finance/        # Showroom petty cash expenses, customer receivables
│   │   ├── inventory/      # Serialized units (VIN), stock requests, transfers, cycle counts
│   │   ├── organisation/   # Branches, employees, roles & permission matrices
│   │   ├── procurement/    # Purchase orders, supplier catalog, goods receipts (GRN)
│   │   ├── sales/          # Leads, quotations, sales orders, invoices, deliveries
│   │   └── system/         # Company settings, audit logs, preferences, sessions
│   ├── App.vue             # Root Vue component
│   ├── auth.js             # Session authentication, SHA-256 demo hashing, permissions
│   ├── main.js             # Application entry point
│   └── store.js            # Canonical enterprise reactive store & audit engine
├── tests/                  # Automated integration & regression test suites
│   ├── test_master_readiness.js        # Complete 112-test business lifecycle audit
│   ├── test_cross_entity_validation.js # Cross-module ID resolution & relationship tests
│   ├── test_prompt7_audit.js           # Audit log immutability & timeline tests
│   ├── test_prompt6_communication.js   # Messaging, inbox & notification tests
│   ├── test_phase3_prompt5.js          # Sales, delivery & workshop integration tests
│   └── test_phase2_prompt4.js          # Procurement & inventory movement tests
├── .env.example            # Environment configuration template
├── .gitignore              # Git ignore rules for node_modules, dist, and local caches
├── AJ_ECODRIVE_COMPLETE_CLIENT_GUIDE_QA.md # 248-Question Master Client & Architecture Guide
├── index.html              # HTML5 application shell
├── package.json            # NPM dependencies and operational test scripts
├── vite.config.js          # Vite configuration with Tailwind CSS & Vue plugins
└── README.md               # Project documentation and engineering guide
```

---

## 7. Master Engineering & Client Documentation Index

The complete business logic, operational flows, and production architecture are documented in detail within [AJ_ECODRIVE_COMPLETE_CLIENT_GUIDE_QA.md](file:///c:/xampp/htdocs/ECodrive/AJ_ECODRIVE_COMPLETE_CLIENT_GUIDE_QA.md):

* **Part 1:** Understanding AJ EcoDrive & The Big Picture (Q1 – Q15)
* **Part 2:** Logging In, Access Platforms & User Roles (Q16 – Q28)
* **Part 3:** A Day in the Life of a Branch Manager & Operational Continuity (Q29 – Q42s)
* **Part 4:** Handling Walk-In Customers & Managing Leads (Q43 – Q58)
* **Part 5:** Quotations & Price Calculations (Q59 – Q75)
* **Part 6:** Sales Orders & Reserving a Specific Bike (Q76 – Q92)
* **Part 7:** Invoicing, Deposits & Receiving Payments (Q93 – Q108)
* **Part 8:** Delivery Handover, Ownership & Warranty Activation (Q109 – Q126)
* **Part 9:** After-Sales Service, Warranty Claims & Workshop Repairs (Q127 – Q150)
* **Part 10:** Showroom Inventory, Transfers & Stock Requests (Q151 – Q172)
* **Part 11:** Branch Petty Cash, Expenses & Internal Messages (Q173 – Q185)
* **Part 12:** Super Admin / Head Office Operations & Imports (Q186 – Q200)
* **Part 13:** System Settings, Numbering, Audit Logs & Multi-Platform Clients (Q201 – Q210)
* **Part 14:** System Architecture, Operational Continuity & Synchronization Policy (Q211 – Q225)
* **Appendix A:** Policy Summary — Operational Continuity & Synchronization
* **Appendix B:** Target Production Topology Blueprint
* **Appendix C:** Proposed Offline Operational Classification Matrix (Categories A, B, C)
* **Appendix D:** Branch Daily Operational Lifecycle (Morning to Close)
* **Appendix E:** Failure & Recovery Scenarios Matrix (18 Critical Outage Scenarios)
* **Appendix F:** Client Approval Items & Architecture Decisions (Items A – H)
* **Appendix G:** Target Implementation Roadmap (Phases 1 – 19)
* **Appendix H:** Core Production Acceptance Criteria (Data Loss, UX, Speed, Consistency)

---

## 8. Target Production Architecture & Operational Continuity

The target production deployment follows a **Two-Tier Distributed Architecture** inspired by decentralized branch banking operational principles (e.g. Oracle FLEXCUBE branch architectures):

```text
CENTRAL SYSTEM (Head Office / Cloud Datacenter)
  • Authoritative Central Database & Enterprise REST/Sync APIs
  • National Inventory Ledger & Central Financial Settlement
  • Master Pricing, User Permissions & Cryptographic Audit Vault
                       ↕ [Secure WAN / Internet]
BRANCH OPERATIONAL CLIENTS (Showrooms & Workshops)
  • Windows Desktop Operational Client & Android Tablet/Mobile Application
  • Local Durable Database (e.g., SQLite / Room) with WAL
  • Fast Local Search & Local Workflow Execution (Zero Network Latency)
  • Transaction Outbox Queue (client_transaction_id)
  • Two-Way Synchronization Engine (Proposed default: every 2 hours)
  • End-of-Day Branch Reconciliation & Register Closing
```

---

## 9. Future Application Release & Update Strategy

To support ongoing maintenance across nationwide showroom branches without complex third-party app store dependencies:

### 1. Automated Build Pipeline (GitHub Actions)
```text
Developer Push / Version Tag (e.g. v1.2.0)
       ↓
GitHub Actions CI/CD
       ↓
Run Automated Regression Test Suites
       ↓
Build Windows Desktop Installer / Portable Package
Build Signed Android APK Package
       ↓
Generate GitHub Release & Update Manifest (version, notes, hash, download URL)
```

### 2. Desktop Auto-Update Feed (Windows)
* The installed Windows Desktop operational client queries a lightweight JSON update feed (hosted on the company's release server or GitHub Releases API).
* When a new version is detected, the application displays a non-intrusive notification: *"A new version of AJ EcoDrive is available. Update now or at branch closing."*
* The client downloads the delta package, verifies the cryptographic checksum, and applies the update upon application restart.

### 3. Android Private Distribution & Update Compatibility
* **No Mandatory Google Play Store Dependency:** Android natively supports direct distribution from the dealership's private web portal or company server. Showroom tablets install the signed APK directly.
* **Signing Key Continuity:** To satisfy Android's package manager update requirements, the application's private release signing key will be generated and stored securely in dedicated enterprise key vaults outside the Git repository. Every subsequent APK release will use the identical signing key and an incremented `versionCode`.
* **In-App Update Detection:** The Android client checks the update endpoint upon startup. If a newer `versionCode` is available, it downloads the APK and prompts the user to apply the update seamlessly.

---

## 10. License & Confidentiality

Copyright © 2026 **SkyraSoft / AJ EcoDrive Ltd.** All rights reserved.  
This software and documentation are proprietary and confidential. Unauthorized copying, reverse engineering, or distribution is strictly prohibited.
