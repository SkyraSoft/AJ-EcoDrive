# AJ ECODRIVE — PLATFORM SUPPORT POLICY

> **Document Status:** Authoritative System Policy  
> **Canonical Product Versions:** Exactly Two (2) Supported Platforms  
> **Effective Date:** September 2026  

---

## 1. CANONICAL PRODUCT PLATFORMS

AJ EcoDrive is officially developed, supported, and deployed across exactly **two (2) product platforms**:

### 1. Web Application (`AJ EcoDrive Web`)
- **Primary Interface:** Modern Single Page Application (SPA) built with Vue 3 and Vite.
- **Accessibility:** Accessible via standard W3C-compliant web browsers (Google Chrome, Mozilla Firefox, Microsoft Edge, Apple Safari).
- **Responsive Browser Access:** Devices with smaller viewports (e.g., mobile phones or tablet web browsers) may access the Web Application through their browser when responsive layout rules permit.
- **Mobile Distinction:** Browser access on a mobile phone is strictly categorized as *Web Application Browser Access*. It does **NOT** constitute a native mobile application.

### 2. Desktop Application (`AJ EcoDrive Desktop`)
- **Primary Interface:** Native/Standalone Desktop client runtime package providing offline-ready dealership workstation capabilities, hardware integration (barcode scanners, POS thermal printers, battery BMS diagnostic interfaces), and local receipt caching.
- **Target OS:** Windows 10/11 Workstations (Dealership Branch Manager & Cashier desks).

---

## 2. EXPLICIT NON-SCOPE & MOBILE POLICY

> [!IMPORTANT]  
> **THERE IS NO SEPARATE NATIVE MOBILE APPLICATION.**

The following platforms are explicitly **OUT OF SCOPE** and **NOT PART OF PRODUCT ARCHITECTURE**:
- ❌ No native Android Application (`.apk` / Google Play Store).
- ❌ No native iOS Application (`.ipa` / Apple App Store).
- ❌ No hybrid mobile frameworks (React Native, Flutter, Ionic) for mobile app stores.
- ❌ No separate mobile-only backend endpoints or mobile app stores build targets.

Any past references or legacy notes suggesting separate native mobile applications are superseded by this policy.

---

## 3. SUMMARY COMPARISON MATRIX

| Dimension | Web Application | Desktop Application | Mobile Native Application |
| :--- | :--- | :--- | :--- |
| **Supported Status** | 🟢 **ACTIVE & SUPPORTED** | 🟢 **ACTIVE & SUPPORTED** | 🔴 **EXPLICITLY NOT SUPPORTED / OUT OF SCOPE** |
| **Runtime Environment** | Web Browsers (Desktop & Mobile Browser) | Standalone Desktop Runtime | N/A |
| **Primary Workstation** | Branch Manager / Central Management | Showroom POS & Workshop Desk | N/A |
| **Packaging** | Web SPA Distribution | Workstation Desktop Installer | N/A |
