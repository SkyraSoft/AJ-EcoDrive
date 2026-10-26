# AJ ECODRIVE — Monorepo (Frontend & Backend)

> **Electric Vehicle Dealership & Multi-Branch Workshop Management System**  
> *A decoupled enterprise monorepo containing the Vue 3 frontend application and backend services.*

---

## 1. Monorepo Structure

```text
ECodrive/
├── frontend/                       # Vue 3 Frontend Single-Page Application (SPA)
│   ├── src/                        # Application source code (views, components, stores, tour)
│   ├── public/                     # Static assets, guide HTML, icons
│   ├── docs/                       # Architecture, design specifications, and audit reports
│   ├── tests/                      # Automated Vitest suites, integration and readiness tests
│   ├── scripts/                    # Build, audit, and HTML guide sync utilities
│   ├── scratch/                    # Test fixtures and schemas
│   ├── index.html                  # Vite SPA HTML entrypoint
│   ├── package.json                # Frontend package dependencies & scripts
│   ├── vite.config.js              # Vite bundler configuration
│   ├── vitest.config.js            # Vitest unit & integration test configuration
│   └── README.md                   # Detailed frontend documentation
├── backend/                        # Backend REST API & Real-time Services (Upcoming)
│   └── README.md                   # Backend architecture roadmap and API specifications
├── .git/                           # Single, preserved Git repository
├── .gitignore                      # Monorepo-level gitignore
└── README.md                       # Monorepo high-level overview (this file)
```

---

## 2. Quick Start

### Frontend (Active)

The frontend is a fully responsive, enterprise-grade Vue 3 SPA with comprehensive guided tours, role-based workflows, and 100% test coverage.

```bash
# Navigate to the frontend workspace
cd frontend

# Install frontend dependencies
npm install

# Start local development server
npm run dev

# Run full test suite
npm test

# Run Vitest test runner
npx vitest run

# Build for production
npm run build
```

### Backend (Roadmap)

The upcoming Node.js/Express backend provides REST endpoints, database persistence, and cross-branch synchronization. See [backend/README.md](backend/README.md) for full details.

---

## 3. Deployment Configuration

### Vercel / Netlify Deployment
When deploying the repository on Vercel or similar platforms:
- **Root Directory:** Set to `frontend`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`
