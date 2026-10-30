# AJ EcoDrive — Backend Services & API Gateway

> **Step 1: Core Express Gateway & Health Check Architecture**  
> *Stack: Node.js (ES Modules), Express 4.x, Mongoose, CORS, Dotenv, Nodemon, Supertest.*

---

## 1. Overview & Architecture

The **AJ EcoDrive Backend** provides the RESTful API services for the EcoDrive Electric Vehicle ERP platform.

In **Step 1**, the core runtime architecture is established:
- **Express 4.x Application (`src/app.js`):** JSON body parsing, CORS configured for `http://localhost:5173` with authorization and branch headers, JSON 404 handler, and centralized error handling middleware.
- **Resilient MongoDB Configuration (`src/config/db.js`):** Automatic connection handling with timeout; if MongoDB is unavailable or unconfigured, the server boots in an offline/degraded mode without crashing.
- **Health Verification Endpoint (`GET /api/v1/health`):** Real-time JSON health check reporting uptime, environment, system memory, and actual database connection status.
- **Server Lifecycle (`src/server.js`):** Graceful shutdown on `SIGINT` and `SIGTERM`.

---

## 2. Directory Structure

```
backend/
├── .env                  # Local environment configuration (git-ignored)
├── .env.example          # Safe configuration template (committed)
├── .gitignore            # Backend-specific ignore rules
├── package.json          # Node.js project manifest & scripts
├── README.md             # Setup and operational instructions
├── src/
│   ├── app.js            # Express application configuration & middleware
│   ├── server.js         # HTTP server entrypoint & graceful shutdown
│   ├── config/
│   │   ├── db.js         # Mongoose connection & real status monitor
│   │   └── env.js        # Environment variables loader
│   ├── middleware/
│   │   ├── errorHandler.js # Centralized JSON error response handler
│   │   └── notFound.js   # JSON 404 handler for unregistered routes
│   └── routes/
│       ├── health.routes.js # GET /api/v1/health implementation
│       └── index.js      # Versioned API router (/api/v1)
└── tests/
    └── health.test.js    # Automated suite (Node native test runner + Supertest)
```

---

## 3. Quick Start (Windows Setup Guide)

Open PowerShell in the project directory:

```powershell
# 1. Navigate to the backend directory
cd C:\xampp\htdocs\ECodrive\backend

# 2. Install dependencies
npm install

# 3. Configure environment variables
# Copy .env.example to .env (if not already created)
Copy-Item .env.example .env

# 4. Start the backend in development mode (with auto-reload)
npm run dev

# Or start in standard production mode:
npm start
```

---

## 4. Operational Verification

### Run Automated Tests
```powershell
npm test
```
*Executes the automated test suite testing root routes, `/api/v1/health`, 404 handling, and CORS headers.*

### Test Health Endpoint Live
With the server running on port 3000:
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/v1/health" | ConvertTo-Json -Depth 4
```

Expected JSON response:
```json
{
  "ok": true,
  "status": "healthy",       // or "degraded (db offline)" if MongoDB is not running
  "service": "AJ EcoDrive ERP Backend API",
  "version": "1.0.0",
  "uptime": "15s",
  "timestamp": "2026-10-26T17:37:23.955Z",
  "environment": "development",
  "database": {
    "status": "disconnected", // or "connected"
    "isConnected": false,
    "host": null,
    "name": null,
    "error": "connect ECONNREFUSED 127.0.0.1:27017",
    "lastConnected": null
  },
  "system": {
    "nodeVersion": "v24.15.0",
    "platform": "win32",
    "memoryUsageMB": 18
  }
}
```

---

## 5. MongoDB Database Setup (Optional for Step 1)

If you have a local MongoDB instance:
1. Ensure the MongoDB service is running on `127.0.0.1:27017`:
   ```powershell
   net start MongoDB
   ```
2. Or update `MONGODB_URI` in `backend/.env` to point to your MongoDB Atlas cloud cluster:
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/ecodrive_erp?retryWrites=true&w=majority
   ```
3. Restart the server (`npm run dev`). The `/api/v1/health` endpoint will immediately report `"status": "healthy"` and `"isConnected": true`.

---

## 6. Next Steps (Step 2 Roadmap)
- User Authentication & JWT Token Generator (`/api/v1/auth`)
- User Schema & Role Capabilities Middleware (Super Admin vs. Branch Manager)
- First Domain Data Model (Customers & Lead Ingestion)
