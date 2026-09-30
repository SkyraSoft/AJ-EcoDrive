# AJ ECODRIVE — FRONTEND INTERACTION PATTERN ARCHITECTURE

> **Authoritative Specification:** UI Interaction Surfaces & Interaction Pattern Decision Engine  
> **Scope:** 15 Complete UI Interaction Surface Types Across AJ EcoDrive  

---

## 🏛️ 1. INTERACTION PATTERN TAXONOMY & USAGE RULES

| Surface Type | When to Use | Recommended Scope | Example in System |
| :--- | :--- | :--- | :--- |
| **CONFIRMATION_DIALOG** | Simple binary verification of already-specified destructive/high-risk actions. | Low data input, High risk | Archive Branch, Void Invoice |
| **BINARY_CHOICE_DIALOG** | Strict binary decision (Yes/No, Pass/Fail) with no intermediate state. | Binary outcomes | Customer Identity Verified |
| **MULTI_OPTION_DIALOG** | Decision with 3-4 distinct outcomes requiring immediate choice. | 3-4 options | Approval Queue Decision (Approve / Reject / Conditional) |
| **FORM_MODAL** | Short, contextual, self-contained data entry preserving underlying page context. | 2-5 fields | Record Payment Reference, Add Note |
| **DEDICATED_PAGE** | Complex multi-section data entry or multi-entity business workflows. | Many fields, High context | Create Branch, Issue Sales Order |
| **DRAWER** | Detailed side-by-side inspection or light contextual editing. | Read-heavy | Unit Inspection Drawer |
| **ACTION_CENTRE_ITEM** | Actionable work item requiring tracking, ownership, and resolution. | Role workflow handoff | Over-threshold Expense Approval |
| **NOTIFICATION** | FYI awareness alert requiring no immediate record mutation. | Informational | Transfer Received Toast/FYI |
| **MESSAGE_INBOX** | Peer-to-peer or inter-role contextual communication. | Communication | Branch Clarification Message |
| **TOAST** | Short-lived, passive feedback message (3-5 seconds). | Feedback | Saved Successfully |
| **PAGE_ALERT_BANNER** | Persistent visual warning at top of page until condition resolves. | Critical Warning | Overdue Unpaid Invoice Warning |
| **WIZARD_STEPPER** | Sequential multi-step process where step $N+1$ depends on step $N$. | Guided process | 18-Point PDI Handover |
| **INLINE_ACTION** | Immediate, low-risk single-click state change. | Low risk | Filter Table, Mark Read |
| **REVIEW_SCREEN** | Pre-submission confirmation step summarizing financial/legal impact. | High consequence | Sales Order Pre-Booking Review |
| **ASYNC_APPROVAL_WORKFLOW** | Multi-role workflow where request moves to another role queue. | Cross-role handoff | Discount Override Approval |

---

## 🏁 2. INTERACTION PATTERN ARCHITECTURE GATE

- **Total Surfaces Audited:** **15 Surface Types**
- **Standardized Surface Rules:** **100% Defined**
- **Machine-Readable Registry:** `src/config/frontendInteractionPatternRegistry.js`
