# AJ EcoDrive ERP — Phase 8: User Training & Operational Guide

**Audience:** Super Admins, Branch Managers, Showroom Staff, Technical Support  
**Application Platform:** AJ EcoDrive ERP Desktop for Windows (v1.0.0)  

---

## 1. Quick-Start & Daily Operations

### 1.1 Launching & Logging In
1. Double-click the **AJ EcoDrive ERP** desktop icon or launch from the Windows Start menu.
2. Enter your corporate email and password.
3. Upon first login, ensure your computer has an active internet connection so your branch data and product catalogue can download to your local offline database.
4. Once loaded, verify your assigned branch is displayed in the top right header (e.g., *"Peshawar City Branch"*).

### 1.2 Understanding the Sync Status Bar
At the top of your screen, the synchronization status bar displays one of three states:

| Badge Indicator | Operational Meaning | Action Required |
| :--- | :--- | :--- |
| 🟢 **Online / Synced** | Connected to cloud server. All data is synchronized. | Normal operation. |
| 🟡 **Offline / Saved Locally (N)** | No internet connection. You have `N` changes saved safely on your PC. | Continue working normally. Do NOT panic. |
| 🔵 **Synchronizing...** | Reconnected to internet. Uploading pending records to cloud. | Allow sync to complete (~5-15 seconds). |
| 🔴 **Sync Attention Required** | A record was flagged for manager review or encountered an issue. | Click the badge to view conflict details. |

### 1.3 What "Saved Locally" Means
When you create a customer, generate a quotation, confirm an order, or log a repair while offline:
- Your transaction is **immediately saved** into your computer's secure local database.
- You can print documents, view customer profiles, and update orders without waiting for internet.
- **Your work is not lost if the app closes or the computer turns off.**

### 1.4 Exiting with Pending Changes
- If you close the app while offline changes are pending, a prompt will warn you:  
  *"You have N pending offline changes queued. All changes are durably saved locally and will resume synchronization on next launch."*
- Click **OK** to exit safely. When you reopen the app and connect to Wi-Fi/4G, the application will upload your records automatically.

### 1.5 Safe Logout vs. Window Close
- **Window Close (X):** Keeps your session active on this computer. Use this when stepping away or shutting down at the end of the day.
- **Logout:** Purges your security tokens and cached data. **Use this only if another employee needs to log into their own account on this computer.**

---

## 2. Role-Specific Instructions

### 2.1 Branch Manager Guide
- **Discount Ceilings:** You may approve customer discounts up to **8%**. Any quote exceeding 8% requires Head Office approval before order confirmation.
- **Petty Cash Vouchers:** Local branch expense vouchers up to **PKR 15,000** can be posted directly. Vouchers above PKR 15,000 route to Super Admin.
- **Chassis VIN Allocation:** Never assign the same vehicle VIN to two customers. In offline mode, the system locks the unit locally to protect your reservation.
- **Handling Conflict Warnings:** If a conflict alert appears (e.g., a customer phone number was updated concurrently by Head Office), open the *Action Centre* to select the correct information.

### 2.2 Super Admin / Head Office Guide
- **Enterprise Oversight:** Navigate to `/organisation/branches` to monitor sales velocity, inventory distribution, and active staff across all locations.
- **Approvals Workflow:** Check `/action-centre` daily for pending inter-branch vehicle transfers and high-value purchase orders (> PKR 500k).
- **Price List Updates:** Any changes made to base MSRP or vehicle specs replicate to all branch desktop clients during their next sync cycle.
- **User Account Governance:** If an employee leaves the company, immediately lock their user profile in `/organisation/users` to revoke their device tokens.

### 2.3 Technical Support / IT Administrator Guide
- **Installer Deployment:** Deploy `AJ EcoDrive ERP_1.0.0_x64_en-US.msi` using silent command:  
  `msiexec /i "AJ EcoDrive ERP_1.0.0_x64_en-US.msi" MSIINSTALLPERUSER=1 ALLUSERS=2 /qn`
- **Database Location:** The local SQLite database is stored at:  
  `%LOCALAPPDATA%\com.skyrasoft.ecodrive\ecodrive.db`
- **Credential Storage:** User session tokens are encrypted using Windows DPAPI and stored in `%APPDATA%\com.skyrasoft.ecodrive\secure_vault.json`.
- **Backend Health Check:** Verify production status anytime at `https://ecodrive.skyrasoft.com/api/v1/health`.

---

## 3. What Users Must NEVER Do

> [!CAUTION]
> **Zero-Tolerance Prohibited Actions:**
> 1. **NEVER share your login credentials** or let another employee operate under your account.
> 2. **NEVER delete or tamper with** the files in `%LOCALAPPDATA%\com.skyrasoft.ecodrive\`.
> 3. **NEVER uninstall the application** while the badge shows pending offline changes, as un-uploaded drafts may be wiped.
> 4. **NEVER adjust your computer's clock or system date manually**, as timestamp discrepancies can cause synchronization ordering errors.
> 5. **NEVER attempt to enter fake CNICs or phone numbers**, as the system enforces strict national validation.

---

## 4. How to Report a Problem or Sync Failure

If your status badge stays red or indicates an unresolved error for more than 15 minutes:
1. Confirm your computer has working internet by opening `https://aj-eco-drive.vercel.app` in Microsoft Edge.
2. Click the **Sync Status** badge and choose **"Retry Sync Now"**.
3. If the error persists, take a screenshot of the error dialog showing:
   - Error code / description
   - Number of pending changes
   - Your branch name
4. Contact IT Support at **`support@skyrasoft.com`** or via internal company escalation.
