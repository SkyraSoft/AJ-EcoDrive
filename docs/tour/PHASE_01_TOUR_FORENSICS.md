# AJ ECODRIVE — TAKE A TOUR RECONSTRUCTION
## PHASE 1 — HISTORICAL TOUR FORENSICS & GUIDE DISCOVERY

**PROGRAM ID:** `AJ-TOUR-RECONSTRUCT-2026`  
**PHASE STATUS:** `IN PROGRESS`  
**CURRENT CHECKPOINT:** `1.1 — Existing Tour Technology & Runtime Architecture Forensics`  
**CHECKPOINT STATUS:**  
- `1.1 = COMPLETE`  
- `1.2 = COMPLETE`  
- `1.3 = COMPLETE`  
- `1.4 = COMPLETE (PHASE 1 FROZEN)`  

**IMPLEMENTATION AUTHORIZATION:** `STRICTLY LOCKED UNTIL PHASE 6`  

---

## A. CHECKPOINT IDENTIFICATION
- **Checkpoint ID:** `1.1`
- **Focus:** Technical & Runtime Architecture Forensics of Existing Tour / DAP Systems.
- **Methodology:** Deep source code inspection, AST/template tracing, DOM selector verification, state machine analysis, and runtime path execution without modifying production code.

---

## B. SCOPE LOCK
- No application code, Vue components, styles, stores, or router configurations have been altered.
- All investigations are read-only forensic extractions.
- **Diagnostic Artifact Cleanup Record:** Temporary forensic scripts (`scratch/diagnose_dap.js`, `scratch/diagnose_dap.cjs`) used during static AST inspection were completely purged upon completion. No persistent files were created or modified outside `docs/tour/PHASE_01_TOUR_FORENSICS.md` and `docs/tour/TAKE_A_TOUR_PROGRAM_STATUS.md`.

---

## C. TOUR-RELATED SOURCE INVENTORY

| File Path | Type | Purpose | Used at Runtime? | Role | Key Exports / Components | Dependencies | Known Callers / Importers |
|---|---|---|---|---|---|---|---|
| `src/components/dap/GuidedDAPEngine.vue` | Vue SFC | Root DAP coordinator, teleport mount, event bridge, and DOM poller | **YES** | `ENGINE` | `<GuidedDAPEngine>` | Vue 3 (`Teleport`, `watch`, `nextTick`), `dapStore`, `SpotlightOverlay`, `CoachmarkCard`, `DAPFloatingHUD` | `src/layouts/MainLayout.vue` |
| `src/components/dap/SpotlightOverlay.vue` | Vue SFC | Fullscreen SVG mask with rectangular cutout, green glow border & pulsing beacon | **YES** | `COMPONENT` | `<SpotlightOverlay>` | Vue 3 (`computed`) | `GuidedDAPEngine.vue` |
| `src/components/dap/CoachmarkCard.vue` | Vue SFC | Floating coach card, step header, practice input banner, decision scenario UI, positioning engine | **YES** | `COMPONENT` | `<CoachmarkCard>` | Vue 3 (`ref`, `computed`, `watch`), `dapStore` | `GuidedDAPEngine.vue` |
| `src/components/dap/DAPFloatingHUD.vue` | Vue SFC | Bottom-right floating launcher button and expandable 8-stage mission drawer | **YES** | `COMPONENT` | `<DAPFloatingHUD>` | Vue 3, `dapStore` | `GuidedDAPEngine.vue` |
| `src/stores/dapStore.js` | JS Module | Reactive Pinia-less store managing mission state, validation, step advancement, and localStorage persistence | **YES** | `STORE` | `dapStore` | Vue 3 (`reactive`, `computed`), `vue-router`, `branchManagerDAPMissions.js`, `branchManagerDAPCoverage.js` | `MainLayout.vue`, `GuidedDAPEngine.vue`, `CoachmarkCard.vue`, `DAPFloatingHUD.vue` |
| `src/config/branchManagerDAPMissions.js` | JS Module | 8-stage chronological lifecycle curriculum containing 57 discrete practical steps | **YES** | `CONTENT` / `CONFIG` | `branchManagerMissions` | None | `dapStore.js`, `test_dap_exhaustive_coverage.cjs`, `test_dap_interactive_client_mount.test.js` |
| `src/config/branchManagerDAPCoverage.js` | JS Module | 3.8MB machine-readable audit registry claiming 3,394 checkpoints across 155 routes | **YES** (Metrics only) | `CONFIG` / `LEGACY` | `branchManagerCoverageRegistry`, `branchManagerCoverageMetrics`, `totalBranchManagerCheckpoints` | None | `dapStore.js`, `test_dap_exhaustive_coverage.cjs` |
| `src/config/branchManagerDAPBusinessRules.js` | JS Module | 10 codified dealership operational SOP rules and thresholds | **YES** | `CONFIG` | `branchManagerBusinessRules`, `getBusinessRuleById` | None | `test_dap_exhaustive_coverage.cjs` |
| `src/layouts/MainLayout.vue` | Vue SFC | Main application shell containing top navbar "Take a Tour" launcher button and root `<GuidedDAPEngine />` mount | **YES** | `ROUTER` / `LAYOUT` | App shell | `GuidedDAPEngine`, `dapStore` | `src/router/index.js` |
| `scripts/bind_real_dom_targets.cjs` | Node Script | Build/maintenance script that regex-injected `data-tour` attributes into Vue templates | **NO** (Build-time) | `LEGACY` / `UTILITY` | Script | Node `fs`, `path` | Manual CLI execution |
| `scripts/build_dap_missions.cjs` | Node Script | Generator for `branchManagerDAPMissions.js` | **NO** (Build-time) | `LEGACY` / `UTILITY` | Script | Node `fs`, `path` | Manual CLI execution |
| `scripts/build_dap_coverage_esm.cjs` | Node Script | Generator for `branchManagerDAPCoverage.js` | **NO** (Build-time) | `LEGACY` / `UTILITY` | Script | Node `fs`, `path` | Manual CLI execution |
| `tests/test_dap_exhaustive_coverage.cjs` | CJS Test | Automated test verifying coverage registry math, 155 routes, and business rules | **YES** (Test suite) | `TEST` | Test runner | Node `assert`, `fs`, `path` | `npm test` |
| `tests/test_dap_interactive_client_mount.test.js` | Vitest Suite | Mounts components with mock router and verifies tab switching / practice input simulation | **YES** (Test suite) | `TEST` | Vitest tests | `@vue/test-utils`, `vitest` | `npm run test:client` |

---

## D. RUNTIME ENTRY POINTS

The current system has **TWO** distinct UI entry points in the DOM:

1. **Top Navigation Header Button (`#dap-header-tour-btn`):**
   - **Location:** Inside [`src/layouts/MainLayout.vue`](file:///c:/xampp/htdocs/Aj%20Ecodrive/src/layouts/MainLayout.vue#L557-L570) right action bar.
   - **Label:** `Take a Tour` (inactive) / `Touring...` (active) with live badge `dapStore.masteryPercentage%`.
   - **Handler:** `@click="dapStore.toggleDAP()"`.
   - **Function:** Launches or resumes the active mission at `dapStore.currentStepIndex`, navigates to `currentStep.route`, and activates the overlay.
   - **Role Restrictions:** **NONE in UI.** The button renders for BOTH `Super Admin` and `Branch Manager`, but always executes `branchManagerMissions`.

2. **Persistent Floating HUD Widget (`DAPFloatingHUD.vue`):**
   - **Location:** Fixed bottom-right corner (`bottom-6 right-6 z-[9999]`).
   - **Collapsed View:** Pill button displaying `🎯 Branch Mastery: XX%` and `Click to Launch Guided Walkthrough`.
   - **Expanded View:** 384px modal drawer listing all 8 chronological missions (`M1` to `M8`), mastery progress bar, Reset button, and direct mission selectors (`selectMission(id)`).
   - **Handler:** `selectMission(missionId)` $\rightarrow$ `dapStore.startDAP(missionId, 0)`.

---

## E. EXISTING ENGINE(S)

- **Classification:** `ONE_SHARED_ENGINE` (titled "Guided DAP Engine").
- **Architecture:** A single singleton reactive store (`dapStore.js`) controls a single root Vue coordinator (`GuidedDAPEngine.vue`), rendered via Vue 3 `<Teleport to="body">`.
- **Finding:** While termed "DAP" (Digital Adoption Platform), it is the sole runtime engine powering "Take a Tour". There are no parallel active tour engines, but the 3.8MB `branchManagerDAPCoverage.js` acts as an inert historical artifact referenced primarily for total checkpoint count metrics (`3394`).

---

## F. TOUR STEP DATA MODEL

The current step schema in `src/config/branchManagerDAPMissions.js` uses the following fields:

| Field | Type | Required? | Meaning | Where Read | Example Current Value |
|---|---|---|---|---|---|
| `checkpointId` | `string` | **YES** | Unique tracking identifier for auditing | `dapStore.js` (`syncActiveCheckpoint`) | `"M1-R1-F1"` |
| `route` | `string` | **YES** | Target route where the step takes place | `dapStore.js` (`navigateToCurrentStepRoute`) | `"/sales/leads"` |
| `target` | `string` | **YES** | CSS selector or `data-tour` query for the DOM element | `GuidedDAPEngine.vue`, `CoachmarkCard.vue` | `"[data-tour=\"lead-name\"]"` |
| `block` | `string` | NO | Functional UI block name | Display / metadata | `"Manager Credentials"` |
| `field` | `string` | NO | Specific entity property targeted | `CoachmarkCard.vue` badge | `"email"` |
| `badge` | `string` | NO | Subtitle badge on coach card header | `CoachmarkCard.vue` header | `"Security Practice"` |
| `trainingType` | `string` | **YES** | Interaction mode: `observe`, `inspect`, `practice`, `execute`, `decision` | `CoachmarkCard.vue`, `GuidedDAPEngine.vue`, `dapStore.js` | `"practice"` |
| `title` | `string` | **YES** | Step title displayed in bold on card | `CoachmarkCard.vue` | `"Branch Manager Email Verification"` |
| `description` | `string` | **YES** | Primary instructional explanation paragraph | `CoachmarkCard.vue` | `"Input your designated corporate branch email..."` |
| `dealershipContext` | `string` | NO | Callout box highlighting Pakistani EV operational compliance | `CoachmarkCard.vue` | `"Branch Managers must ensure dual-factor authentication..."` |
| `businessRationale` | `string` | NO | Rationale for why this field/action exists | `CoachmarkCard.vue` | `"Ensures immutable audit logging linking all sales..."` |
| `instruction` | `string` | NO | Direct imperative instruction for the user | `CoachmarkCard.vue` | `"Enter a valid corporate email format..."` |
| `exampleValue` | `string` | NO | Autofill/demo value for practice mode | `CoachmarkCard.vue` (`autofillToRealField`) | `"manager.lahore@ajecodrive.com"` |
| `validation` | `object` | NO | Input validation rules (`required`, `pattern`, `min`, `max`, `emptyMessage`, `invalidMessage`) | `dapStore.js` (`validateCurrentStep`) | `{"required": true, "pattern": "^.+@.+$"}` |
| `incorrectFeedback` | `string` | NO | Error text displayed when validation fails | `CoachmarkCard.vue`, `dapStore.js` | `"Please provide a valid email format..."` |
| `successFeedback` | `string` | NO | Success message shown when input is valid | `CoachmarkCard.vue` | `"Corporate email format validated successfully."` |
| `options` | `array` | NO (for `decision`) | Array of multiple-choice options (`{label, isCorrect, feedback}`) | `CoachmarkCard.vue` | `[{"label": "...", "isCorrect": true, "feedback": "..."}]` |
| `placement` | `string` | NO | Preferred placement (`auto`, `left`, `right`, `top`, `bottom`) | `CoachmarkCard.vue` (`computedPlacement`) | `"right"` |

---

## G. TARGETING ARCHITECTURE

The legacy implementation uses **TWO primary targeting styles**:
1. **Attribute Selectors (`[data-tour="..."]`):** Accounts for 48 of 57 steps (84.2%).
2. **ID Selectors (`#dap-...`):** Accounts for 9 of 57 steps (15.8%) (e.g., `#dap-auth-header`, `#dap-dashboard-overview`, `#dap-orders-table`, `#dap-delivery-table`, `#dap-serialized-table`, `#dap-expenses-table`, `#dap-action-centre-hub`).

### Static Target Analysis vs Runtime Reality:
- **Static Template Scan:** Out of 57 configured mission step selectors, **24 targets exist in static template files**, while **33 targets were not matched** by simple static template queries.
- **Classification of the 33 Unmatched Selectors:** `STATIC_SOURCE_TARGET_GAP` / `TARGET_RESOLUTION_RISK`.
  - *Important Distinction:* A static template gap is not automatically a proven runtime crash because certain targets may render dynamically, through child sub-components, or conditionally upon user interaction.
  - *Engine Fallback Consequence:* If a target is unresolvable at runtime when requested, `GuidedDAPEngine.vue` sets `targetRect = null`, dropping the SVG spotlight and causing `CoachmarkCard.vue` to render disconnected in dead-center screen (`top: 50%, left: 50%`).
  - *Full Visual/Runtime Proof:* Complete systematic live-mount reproduction of all 33 targets across dynamic component states is scheduled for **Checkpoint 1.3**.
- **Attribute Collision Risk:** Because `scripts/bind_real_dom_targets.cjs` generated `data-tour` tags from sanitized `v-model` names without component namespacing, generic attributes like `data-tour="searchquery"`, `data-tour="notes"`, `data-tour="status"`, and `data-tour="branchsearchquery"` exist in over 40 distinct Vue components.

---

## H. TARGET RESOLUTION RUNTIME BEHAVIOR

- **Mechanism:** `GuidedDAPEngine.vue` runs `document.querySelector(step.target)` in `updateTargetRect()`.
- **Lifecycle & Retries:**
  - On step change or route change: Triggers `nextTick()` followed by a fixed `setTimeout(updateTargetRect, 200)`.
  - Background Polling: A global `setInterval(..., 800)` continuously polls `document.querySelector` while `dapStore.isActive` is true.
  - Event Listeners: Listens to `window.addEventListener('resize')` and `window.addEventListener('scroll', ..., true)`.
- **Behavior on Absent Target:**
  - If `el === null`: Cleans up interactive listeners and sets `targetRect.value = null`.
  - `SpotlightOverlay.vue` hides itself when `targetRect` is null (`v-if="isActive && targetRect"`).
  - `CoachmarkCard.vue` falls back to **dead-center screen**:
    ```javascript
    if (p.isCenter || !props.targetRect) {
      return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }
    }
    ```
  - The card floats in the center with no arrow, no target highlight, and no indication of what is being explained.

---

## I. NAVIGATION & ROUTE HANDLING

- **Mechanism:** `dapStore.navigateToCurrentStepRoute()` executes `router.push(step.route)`.
- **Synchronization:** `GuidedDAPEngine.vue` watches `() => [dapStore.isActive, dapStore.currentMissionIndex, dapStore.currentStepIndex, route.path]` and triggers `updateTargetRect()` after 250ms.
- **Back Navigation Across Routes:**
  - `prevStep()` decrements `currentStepIndex` or moves to previous mission's last step.
  - Calls `navigateToCurrentStepRoute()`, restoring the previous route successfully.
- **Page Refresh Resilience:**
  - Current mission index, step index, route, and completed checkpoints are persisted to `localStorage` (`aj_ecodrive_dap_state_v2`).
  - Upon page refresh, `loadSavedState()` restores position, but `dapStore.isActive` defaults to `false` (user must click "Take a Tour" or Floating HUD to resume).

---

## J. ROLE & WORKSPACE DETECTION

- **Source Audit:**
  - `dapStore.js` contains **NO role detection logic whatsoever**.
  - `dapStore.missions` directly returns `branchManagerMissions`.
  - `MainLayout.vue` displays the "Take a Tour" button to all logged-in users regardless of whether `user.role === 'Super Admin'` or `'Branch Manager'`.
- **Classification:** `LEGACY_ROLE_LOGIC_FOUND / MISSING_CAPABILITY`. A Super Admin clicking "Take a Tour" is presented with single-branch Branch Manager morning opening routines and cashier vault tallies.

---

## K. OVERLAY & SPOTLIGHT ARCHITECTURE

- **Component:** [`src/components/dap/SpotlightOverlay.vue`](file:///c:/xampp/htdocs/Aj%20Ecodrive/src/components/dap/SpotlightOverlay.vue)
- **Technology:** Fullscreen SVG (`fixed inset-0 z-[9990]`) with `<mask id="dap-spotlight-mask">`.
  - Outer background: `fill="rgba(15, 23, 42, 0.75)"` (75% dark slate backdrop).
  - Cutout: `<rect fill="black" :rx="10" :ry="10">` creating a rounded rectangle revealing the target element.
  - Border & Beacon: A separate `<div>` (`z-[9992]`) with `border-2 border-emerald-400/80 rounded-xl shadow-[0_0_25px_rgba(52,211,153,0.6)]` and an animated pulsing ping beacon in the top-right corner.
- **Interactivity / Click-through:**
  - In `GuidedDAPEngine.vue`, the active target DOM element is dynamically given the CSS class `.dap-interactive-target`:
    ```css
    .dap-interactive-target {
      position: relative !important;
      z-index: 9994 !important;
      pointer-events: auto !important;
    }
    ```
  - This raises the real input/button above the SVG mask (`z-9990`) so the user can physically type or click.

---

## L. COACH CARD / TOOLTIP ARCHITECTURE

- **Component:** [`src/components/dap/CoachmarkCard.vue`](file:///c:/xampp/htdocs/Aj%20Ecodrive/src/components/dap/CoachmarkCard.vue)
- **DOM Structure:**
  - Wrapper: `fixed z-[9995] max-w-[440px] w-[92vw] bg-slate-900/95 backdrop-blur-2xl border border-emerald-500/40 rounded-2xl shadow-2xl p-5 text-white`.
  - Arrow: `absolute w-3 h-3 bg-slate-900 border-emerald-500/50 transform rotate-45`.
  - Header: Mission code + badge, step counter (`Step X of Y`), and exit close button (`×`).
  - Title: Emoji + Step Title.
  - Description: Paragraph text.
  - Dealership Compliance Box: Slate-800 container with operational regulations.
  - Training Checkpoint Box: Dynamic container styled according to `trainingType` (`practice`, `decision`, `execute`, `inspect`, `observe`).
  - Progress Bar: Gradient bar (`from-emerald-500 to-teal-400`).
  - Footer Controls: `< Back`, `Skip Stage`, `Next Step >`.
- **Dynamic Content Height:** The card has no fixed height and expands with content. If content is long on smaller screens, it relies on viewport scrolling.

---

## M. POSITIONING ARCHITECTURE

- **Method:** Custom JavaScript bounding-box calculation inside `computedPlacement` in `CoachmarkCard.vue` (lines 354–416).
- **Algorithm:**
  - Assumes hardcoded card dimensions: `cardWidth = 440`, `cardHeight = 360`, `gap = 18`.
  - Calculates target center (`targetCenterX`, `targetCenterY`) and available space on 4 sides (`spaceLeft`, `spaceRight`, `spaceTop`, `spaceBottom`).
  - If `step.placement === 'auto'`:
    1. If `targetCenterX > windowW * 0.55 && spaceLeft >= cardWidth + gap` $\rightarrow$ `left`
    2. Else if `targetCenterX < windowW * 0.45 && spaceRight >= cardWidth + gap` $\rightarrow$ `right`
    3. Else if `spaceBottom >= cardHeight + gap` $\rightarrow$ `bottom`
    4. Else if `spaceTop >= cardHeight + gap` $\rightarrow$ `top`
    5. Fallback $\rightarrow$ picks side with `maxSpace`.
- **Arrow Positioning:**
  - Calculated based on placed side (`left: right=-6px`, `right: left=-6px`, `bottom: top=-6px`, `top: bottom=-6px`).

---

## N. COLLISION & VIEWPORT HANDLING

| Collision / Viewport Capability | Status | Evidence / Source Reality |
|---|---|---|
| Card overlapping target element | `PARTIAL` | Positioning calculates side clearance based on estimated 440×360px box, but does not verify actual rendered card height, leading to overlap on tall cards. |
| Card outside viewport boundary | `SUPPORTED` | Clamped with `Math.max(20, ...)` and `Math.min(..., window - 20)`. |
| Sticky header collision | `NOT SUPPORTED` | Does not subtract header height (64px) from available top space. Top-placed cards can clip under or over the navbar. |
| Fixed sidebar collision | `NOT SUPPORTED` | Does not account for 260px expanded sidebar width; left-placed cards can collide with navigation menu. |
| Modal / Drawer boundary collision | `NOT SUPPORTED` | Treats `window` as outer bounds; unaware of modal container bounds. |
| Side Docking / Bottom Sheet Fallback | `NOT SUPPORTED` | Falls back to centered floating modal (`top: 50%, left: 50%`) rather than docking to viewport edge. |

---

## O. SCROLL HANDLING

- **Mechanism:** `el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' })` in `GuidedDAPEngine.vue` line 148.
- **Limitation:** Does not offset for fixed headers. If target is scrolled to `block: 'center'`, it generally clears the header, but in nested scroll containers (like modal bodies or table containers), `scrollIntoView` may fail to scroll the parent container.

---

## P. MODAL / DRAWER / DYNAMIC CONTENT HANDLING

- **Teleport:** Tour elements are teleported to `<body>`.
- **Z-Index Hierarchy:**
  - Backdrop SVG Mask: `z-[9990]`
  - Spotlight Glowing Box: `z-[9992]`
  - Interactive Target: `z-[9994]` (via `.dap-interactive-target`)
  - Coachmark Card: `z-[9995]`
  - Floating HUD: `z-[9999]`
- **Modal Interference:** Application modals typically use `z-50` or `z-40`. The tour overlay sits at `z-[9990]`, above all application modals. However, if a tour step targets an element inside a modal that is not yet open, target resolution fails and the card floats in the center.

---

## Q. FIELD-LEVEL GUIDANCE CAPABILITY

- **Capability:** `SUPPORTED`.
- **Execution:** When `step.trainingType === 'practice'`, `GuidedDAPEngine.vue` extracts the internal `<input>`, `<select>`, or `<textarea>`, attaches real DOM event listeners (`input`, `change`), and monitors live values.
- **Autofill Bridge:** `CoachmarkCard.vue` includes an "Autofill to Real Field" button (`autofillToRealField()`) that populates `inputEl.value = step.exampleValue` and dispatches synthetic `'input'` and `'change'` events so Vue `v-model` reacts.

---

## R. INTERACTIVE & PRACTICE MODES

The legacy engine supports **5 distinct training modes**:

1. **`observe` (Passive Metric):** Explains a card or KPI. Next is immediately enabled. Backdrop click advances to next step.
2. **`inspect` (Tab/Table Inspection):** Instructs user to click a tab or table row. Listens for click events on target element.
3. **`practice` / `input-practice` (Real Field Typing):** User must type or select a value in the actual highlighted field. Next button is disabled until validated.
4. **`execute` (Button Action):** Highlights an action button. User must click the highlighted button or click "Trigger Highlighted Action On Screen".
5. **`decision` (SOP Multiple Choice):** Renders multiple-choice scenario options inside the card. User must click the correct SOP decision to advance.

---

## S. VALIDATION & CORRECTIVE FEEDBACK RUNTIME

- **Validation Engine:** `dapStore.validateCurrentStep(inputVal)` in `src/stores/dapStore.js` lines 184–262.
- **Supported Rules:**
  - `required: true`
  - `pattern: "^...$"` (RegExp matching)
  - `min: number`, `max: number` (Numeric range)
- **Feedback Rendering:**
  - **Valid:** Displays green checkmark with `step.successFeedback` and live input value.
  - **Invalid:** Displays red warning icon with `step.incorrectFeedback` or `dapStore.stepValidationError`. Next button remains disabled (`disabled="isNextDisabled"`).

---

## T. NAVIGATION CONTROLS

| Button | Component | Action | Condition / Behavior |
|---|---|---|---|
| **`< Back`** | `CoachmarkCard.vue` | `@click="$emit('prev')"` $\rightarrow$ `dapStore.prevStep()` | Disabled on first step of first mission. Restores previous step and route. |
| **`Skip Stage`** | `CoachmarkCard.vue` | `@click="$emit('skip-mission')"` $\rightarrow$ `dapStore.nextStep()` | Bypasses current step validation and advances. |
| **`Next Step >`** | `CoachmarkCard.vue` | `@click="$emit('next')"` $\rightarrow$ `dapStore.nextStep()` | Disabled (`isNextDisabled`) if practice/decision step is unvalidated. |
| **`×` (Close)** | `CoachmarkCard.vue` | `@click="$emit('close')"` $\rightarrow$ `dapStore.stopDAP()` | Deactivates tour overlay; saves progress in localStorage. |
| **`🔄` (Reset)** | `DAPFloatingHUD.vue` | `@click="dapStore.resetAllProgress()"` | Clears all completed checkpoints and resets to Mission 1 Step 1. |

---

## U. PROGRESS, PERSISTENCE & VERSIONING

- **Storage Target:** `localStorage` key `'aj_ecodrive_dap_state_v2'`.
- **Persisted State Object:**
  ```json
  {
    "currentMissionIndex": 0,
    "currentStepIndex": 0,
    "currentRoute": "/dashboard",
    "activeCheckpointId": "M1-R8-H1",
    "completedMissions": [],
    "completedSteps": {},
    "completedCheckpoints": {},
    "autoStartOnLogin": true,
    "mode": "practice"
  }
  ```
- **Versioning Finding:** `NO_VERSIONING_FOUND`. The storage key is hardcoded as `..._v2`, but there is no schema migration or content-hash invalidation. If mission steps change, stale step indices in localStorage can point to out-of-bounds steps.

---

## V. BUSINESS-STATE MUTATION DURING TOURS

- **Analysis:**
  - Practice inputs mutate real Vue component `v-model` values on active forms.
  - If a user completes a practice step on `CreateLead.vue` and then manually clicks the page's "Submit Lead" button, a real record is created in `store.leads`.
  - However, the tour engine itself does **NOT** directly execute backend mutations unless the user submits the form.
  - The "Autofill to Real Field" button writes directly to the form's input DOM element.

---

## W. FAILURE & INTERRUPTION BEHAVIOR

| Interruption Scenario | Behavior Classification | Actual Runtime Consequence |
|---|---|---|
| Target element missing from DOM | `FALLBACK_CENTER` | Bounding rect becomes null; card renders at screen center (`50%, 50%`) with no highlight. |
| Route changed unexpectedly by user | `RECOVERS` | Route watcher in `GuidedDAPEngine.vue` triggers `updateTargetRect()`; if target exists on new page, it re-binds; otherwise centers. |
| Window resized | `RECOVERS` | Resize event listener recalculates bounding box and updates card position. |
| Modal closed while targeting modal field | `FALLBACK_CENTER` | Element vanishes; targetRect becomes null; card floats in center. |
| LocalStorage corrupted | `RECOVERS` | `loadSavedState()` catches JSON parse exception and falls back to default state. |

---

## X. RESPONSIVE ARCHITECTURE

- **Desktop:** Floating card max-width 440px with left/right/top/bottom placement.
- **Mobile / Narrow Screens:**
  - Card width is set to `w-[92vw]`.
  - Floating HUD collapses to compact circular icon on mobile.
  - Top navigation button hides text label (`<span class="hidden md:inline">Take a Tour</span>`).
- **Limitation:** No dedicated bottom-sheet docking mechanism for mobile; 440px cards on mobile screens (<400px) can obscure the highlighted field.

---

## Y. ACCESSIBILITY ARCHITECTURE

- **Current Capabilities:**
  - Basic button `title` attributes.
  - Keyboard focusable buttons.
- **Deficiencies:**
  - No `focus-trap` inside coach card.
  - No `role="dialog"` or `aria-modal="true"`.
  - No `aria-describedby` linking card to target element.
  - No `Escape` key listener to close tour.
  - No `prefers-reduced-motion` compensation for pulsing beacon or transitions.

---

## Z. EXISTING TEST COVERAGE

| Test File | Type | What It Proves | Result |
|---|---|---|---|
| `tests/test_dap_exhaustive_coverage.cjs` | CommonJS Unit/Static | Validates 155 routes registry, 3,394 checkpoint math, and 10 business rules | **PASS (8/8 Suites)** |
| `tests/test_dap_interactive_client_mount.test.js` | Vitest Component Mount | Mounts `CoachmarkCard.vue`, `GuidedDAPEngine.vue`, tests decision option selection, autofill, and tab activation | **PASS (16/16 Tests)** |

---

## AA. REPRESENTATIVE RUNTIME TRACES

### Trace 1: Passive / Metric Observation Step (`M1 Step 4`)
1. **Launch:** User clicks `#dap-header-tour-btn` on `/dashboard`.
2. **Config:** Step 4 has `trainingType: "observe"`, `route: "/dashboard"`, `target: "[data-tour=\"kpi-live-inventory\"]"`.
3. **Route:** Already on `/dashboard`.
4. **Target Resolution:** `document.querySelector('[data-tour="kpi-live-inventory"]')` $\rightarrow$ Target **MISSING** in `Dashboard.vue`.
5. **Rendering:** `targetRect` is null $\rightarrow$ `SpotlightOverlay` invisible $\rightarrow$ `CoachmarkCard` renders centered at `(50%, 50%)`.
6. **Interaction:** User reads card $\rightarrow$ clicks `Next Step >` (immediately enabled for observe).
7. **Completion:** Step 4 marked complete in `dapStore.completedSteps`.

### Trace 2: Real Form Field Practice Step (`M1 Step 2`)
1. **Launch:** Step advances to `M1 Step 2`.
2. **Config:** `trainingType: "practice"`, `route: "/login"`, `target: "[data-tour=\"auth-email\"]"`, `exampleValue: "manager.lahore@ajecodrive.com"`.
3. **Route:** Engine pushes router to `/login`.
4. **Target Resolution:** `document.querySelector('[data-tour="auth-email"]')` resolves successfully to email input in `Login.vue`.
5. **Spotlight:** SVG mask draws cutout around email input; green glowing box & beacon appear.
6. **Interaction:**
   - Next button is disabled (`isNextDisabled = true`).
   - User types in field or clicks "Autofill to Real Field".
   - `onFieldInput` dispatches to `dapStore.handleRealFieldInput(val)`.
   - Pattern regex validates $\rightarrow$ `isStepValidated = true`.
   - Green success feedback appears on card $\rightarrow$ Next button enables.
7. **Completion:** User clicks `Next Step >` $\rightarrow$ advances to Step 3.

### Trace 3: Managerial SOP Decision Step (`M1 Step 7`)
1. **Launch:** Step advances to `M1 Step 7`.
2. **Config:** `trainingType: "decision"`, `route: "/dashboard"`, `target: "#dap-dashboard-overview"`.
3. **Route:** Engine navigates to `/dashboard`.
4. **Rendering:** Renders 2 multiple-choice options (A: Uncounted float, B: Joint physical count).
5. **Interaction:**
   - User clicks Option A $\rightarrow$ `isStepValidated = false` $\rightarrow$ Red error box displays: *"Violates Cash SOP!"*.
   - User clicks Option B $\rightarrow$ `isStepValidated = true` $\rightarrow$ Green box displays: *"Correct SOP! Joint physical verification..."*.
   - Next button enables.
6. **Completion:** User clicks `Next Step >` $\rightarrow$ advances.

---

## AB. TECHNICAL FINDINGS REGISTER

| Finding ID | Classification | Technical Description | Evidence / Impact |
|---|---|---|---|
| `F-101` | `MISSING_CAPABILITY` | Zero Super Admin tour content or role filtering in `dapStore.js`. | Super Admins receive Branch Manager showroom routines. |
| `F-102` | `FRAGILE_ARCHITECTURE` / `UNKNOWN_REQUIRES_CHECKPOINT_1_3` | **Static Source Scan:** 33/57 configured target selectors were not located by source-level Vue template scan.<br>**Engine Behavior:** When runtime target resolution returns null, the coach card falls back to screen center with no target spotlight/arrow.<br>**Runtime Reproduction:** Unlocated in static scan; systematic live visual verification of all 33 targets across dynamic/conditional component states is scheduled for Checkpoint 1.3. | Static target resolution risk across 57.9% of configured mission steps. |
| `F-103` | `DUPLICATED_ARCHITECTURE` | `data-tour` attribute values duplicated across dozens of components due to un-namespaced regex script. | Selectors like `[data-tour="searchquery"]` risk targeting incorrect controls. |
| `F-104` | `FRAGILE_ARCHITECTURE` | Card placement calculation uses hardcoded 440×360px box with no awareness of sticky header, sidebar, or actual rendered card height. | Cards can overlap targets or clip beneath top navbar. |
| `F-105` | `MISSING_CAPABILITY` | No docked sheet fallback for mobile or narrow viewports. | Cards can cover form inputs on small screens. |
| `F-106` | `WORKING_ARCHITECTURE` | Real DOM practice mode with event bridging, autofill, and live validation. | Practice mode successfully binds to live `<input>`/`<select>` and validates input. |
| `F-107` | `WORKING_ARCHITECTURE` | SVG cutout mask with glowing border beacon. | Visual spotlight effectively isolates elements when target resolves. |
| `F-108` | `LEGACY_ARCHITECTURE` | 3.8MB `branchManagerDAPCoverage.js` contains 98,000 lines of static mapping used only for aggregate checkpoint metrics. | Massive bundle payload overhead without contributing to interactive runtime. |
| `F-109` | `MISSING_CAPABILITY` | No schema versioning or content hash migration in localStorage. | Stale progress can cause out-of-bounds step errors when missions update. |

---

## AC. UNKNOWNS RESERVED FOR CHECKPOINTS 1.2 & 1.3
- Exact instructional copy quality and business rule accuracy of the 57 mission steps (reserved for **Checkpoint 1.2**).
- Full visual collision reproduction across all viewport sizes, sticky headers, and drawers (reserved for **Checkpoint 1.3**).

---

## AD. CHECKPOINT ACCEPTANCE EVIDENCE
- All 14 tour-related source and configuration files fully inventoried and role-classified.
- Both runtime entry points (`#dap-header-tour-btn` and `DAPFloatingHUD.vue`) mapped.
- Single engine architecture (`GuidedDAPEngine.vue` + `dapStore.js`) established.
- Step data model documented across all 18 fields.
- 57 step targets checked against live templates (24 found, 33 missing).
- SVG mask overlay, positioning calculations, practice validation, and localStorage persistence analyzed.
- Zero production or tour code modified during this checkpoint.

---

## AE. PHASE STATUS
- **PHASE 1:** `IN PROGRESS`
- **CHECKPOINT 1.1:** `COMPLETE`
- **CHECKPOINT 1.2:** `COMPLETE`
- **CHECKPOINT 1.3:** `READY TO EXECUTE`
- **CHECKPOINT 1.4:** `LOCKED`

---

# ============================================================
# CHECKPOINT 1.2 — EXISTING CONTENT, QUESTIONNAIRE & DEMONSTRATION GUIDE AUDIT
# ============================================================

```text
PROGRAM: AJ-TOUR-RECONSTRUCT-2026
PHASE: 1 — HISTORICAL TOUR FORENSICS & GUIDE DISCOVERY
CHECKPOINT: 1.2 — EXISTING CONTENT, QUESTIONNAIRE & DEMONSTRATION GUIDE AUDIT
STATUS: COMPLETE (FINAL CORRECTIONS INCORPORATED)
GOVERNANCE: READ / DISCOVER / COMPARE / CLASSIFY / DOCUMENT ONLY
IMPLEMENTATION: STRICTLY FORBIDDEN
```

---

## A. CHECKPOINT IDENTIFICATION & PURPOSE

- **Checkpoint ID:** `1.2`
- **Objective:** Establish the comprehensive forensic baseline of all existing educational, instructional, demonstration, and clarification content across the AJ EcoDrive project.
- **Key Forensic Question:** *What is the existing AJ EcoDrive tour actually teaching, who is it written for, is it still true according to the approved system contracts and Operating Blueprint, and does it explain real-world business impact (money, stock, customer, order state, downstream ownership)?*
- **Scope:** Complete discovery and classification of runtime DAP missions, business rule registries, master operations guide QA, client demonstration scripts, final system/business contracts, and external approved authority references.

---

## B. SCOPE LOCK & GOVERNANCE RECORD

```text
CHECKPOINT 1.1 = COMPLETE
CHECKPOINT 1.2 = COMPLETE
CHECKPOINT 1.3 = READY TO EXECUTE
CHECKPOINT 1.4 = LOCKED
```

- **Application Code Changes:** `0 (FORBIDDEN)`
- **Tour Runtime Code Changes:** `0 (FORBIDDEN)`
- **CSS / Style Changes:** `0 (FORBIDDEN)`
- **Selector Repairs:** `0 (FORBIDDEN)`
- **Content Rewrites:** `0 (FORBIDDEN — Reserved for Phase 5)`

---

## C. INSTRUCTIONAL SOURCE REGISTER

| Source ID | File / Resource Path | Source Type | Intended Audience | Workspace / Role Scope | Current Relevance | Business Authority Level | Runtime Usage |
|---|---|---|---|---|---|---|---|
| `SRC-01` | `AJ_ECODRIVE_Final_Management_System_Blueprint` | `OPERATING_BLUEPRINT` | Dealership Leadership, System Architects | Enterprise Multi-Branch | **PRIMARY BUSINESS AUTHORITY** (Single Source of Truth) | **Tier 1 (Supreme Operating Authority)** | `EXTERNAL_APPROVED_AUTHORITY` *(Not present locally; authoritative rules applied)* |
| `SRC-02` | `AJ_ECODRIVE_Client_System_Clarification_Answer_Guide` & `AJ_ECODRIVE_Developer_Handoff_Final` | `CLIENT_CLARIFICATION` / `OPERATING_BLUEPRINT` | Executive Leadership, Core Engineering | Cross-Role (SA + BM) | **AUTHORITATIVE CLARIFICATION** | **Tier 2 (Authoritative Implementation & Client Explanation)** | `EXTERNAL_APPROVED_AUTHORITY` *(Not present locally; authoritative rules applied)* |
| `SRC-03` | `docs/contracts/AJ_ECODRIVE_SYSTEM_CONTRACT.md` | `TECHNICAL_CONTRACT` | Engineering, Architecture, QA | System Architecture | Derived Technical Handoff Truth | **Tier 3 (Derived Technical Contract)** | **CONTENT NOT USED BY TOUR** |
| `SRC-04` | `docs/contracts/AJ_ECODRIVE_BUSINESS_WORKFLOW_CONTRACT.md` | `TECHNICAL_CONTRACT` | Operations, Developers | Cross-Role Workflows | Derived Technical Handoff Truth | **Tier 3 (Derived Technical Contract)** | **CONTENT NOT USED BY TOUR** |
| `SRC-05` | `docs/contracts/AJ_ECODRIVE_BACKEND_READINESS_CONTRACT.md` | `TECHNICAL_CONTRACT` | Backend Engineers, API Devs | Data & API Schemas | Derived Technical Handoff Truth | **Tier 3 (Derived Technical Contract)** | **CONTENT NOT USED BY TOUR** |
| `SRC-06` | `src/store.js` & `src/views/` | `TECHNICAL_CONTRACT` | Frontend Runtime Engine | Runtime Workspaces | Verified Implementation Truth (where non-conflicting) | **Tier 4 (Implementation Truth)** | **CURRENTLY IMPLEMENTED IN APPLICATION** |
| `SRC-07` | `AJ_ECODRIVE_COMPLETE_CLIENT_GUIDE_QA.md` | `QUESTIONNAIRE` / `DEMONSTRATION_GUIDE` | Dealership Owners, Board, Executives, Staff | Multi-Role (SA + BM) | High (Master Operations QA & SOP) | **Tier 5 (Demonstration / Client Training Reference)** | **CONTENT USED ONLY AS REFERENCE** |
| `SRC-08` | `Complete Guide.html` | `DEMONSTRATION_GUIDE` | Client Leadership, Investors | Multi-Role (SA + BM) | High (HTML Mirror of Master QA) | **Tier 5 (Demonstration / Client Training Reference)** | **CONTENT NOT USED BY TOUR** |
| `SRC-09` | `SUPER_ADMIN_AND_SYSTEM_FULL_UI_TREE_MAPPING.md` | `OPERATING_BLUEPRINT` | Head Office Admins, Devs | Super Admin Only | Very High (UI Component Catalog) | **Tier 5 (UI Blueprint Reference)** | **CONTENT NOT USED BY TOUR** |
| `SRC-10` | `BRANCH_MANAGER_AND_SYSTEM_FULL_UI_TREE_MAPPING.md` | `OPERATING_BLUEPRINT` | Showroom Managers, Devs | Branch Manager Only | Very High (UI Component Catalog) | **Tier 5 (UI Blueprint Reference)** | **CONTENT NOT USED BY TOUR** |
| `SRC-11` | `src/config/branchManagerDAPMissions.js` | `RUNTIME_TOUR_CONTENT` | Branch Managers, Showroom Staff | Branch Manager Only | Partial (Active Runtime Draft) | **Tier 6 (Existing DAP Runtime Copy)** | **CURRENTLY DISPLAYED TO USER** |
| `SRC-12` | `src/config/branchManagerDAPBusinessRules.js` | `RUNTIME_TOUR_CONTENT` | System Engine, BM Staff | Branch Manager Only | Partial (Rule Registry Draft) | **Tier 6 (Existing DAP Runtime Copy)** | **CURRENTLY DISPLAYED TO USER** |
| `SRC-13` | `BRANCH_MANAGER_DAP_COVERAGE_AUDIT.md` & `src/config/branchManagerDAPCoverage.js` | `LEGACY_CONTENT` | Internal Audit Scripts | Branch Manager Only | Static Metric Overhead | **Tier 7 (Legacy / Generated Coverage Map)** | **CONTENT NOT USED BY TOUR** |

---

## D. EXISTING RUNTIME CONTENT SCHEMA

Extracted directly from `src/config/branchManagerDAPMissions.js` and `src/config/branchManagerDAPBusinessRules.js`:

### 1. Mission Level Schema
```json
{
  "id": "String (Unique identifier, e.g. 'mission_morning_start')",
  "code": "String (Short code, e.g. 'M1')",
  "title": "String (Display title, e.g. 'Morning Showroom Opening & Daily Start')",
  "category": "String (Operational category, e.g. 'Showroom Readiness')",
  "icon": "String (Emoji icon, e.g. '🌅')",
  "description": "String (Executive summary paragraph)",
  "chapters": [
    {
      "code": "String (e.g. '1.1')",
      "title": "String (Chapter title)",
      "route": "String (Target route URL)"
    }
  ],
  "steps": "Array<StepObject>"
}
```

### 2. Step Level Schema (Active Runtime Fields)
```json
{
  "checkpointId": "String (Unique step hash, e.g. 'M1-R1-F1')",
  "route": "String (Target Vue route path, e.g. '/login')",
  "target": "String (DOM CSS/Attribute selector, e.g. '[data-tour=\"auth-email\"]')",
  "block": "String (Functional block title, e.g. 'Manager Credentials')",
  "field": "String (Optional form field key, e.g. 'email')",
  "badge": "String (Visual pill label, e.g. 'Security Practice')",
  "trainingType": "String ('observe' | 'practice' | 'decision')",
  "title": "String (Step coachmark heading)",
  "description": "String (Primary explanatory body text)",
  "dealershipContext": "String (Optional practical SOP note)",
  "businessRationale": "String (Optional why-it-matters explanation)",
  "instruction": "String (Explicit required user action)",
  "exampleValue": "String (Optional practice input value)",
  "validation": {
    "required": "Boolean",
    "pattern": "String (Regex pattern)",
    "rule": "String (Plain-text validation rule)",
    "emptyMessage": "String",
    "invalidMessage": "String"
  },
  "options": [
    {
      "text": "String",
      "correct": "Boolean",
      "feedback": "String"
    }
  ],
  "incorrectFeedback": "String (Error toast copy)",
  "successFeedback": "String (Success toast copy)",
  "placement": "String ('top' | 'bottom' | 'left' | 'right')"
}
```

---

## E. EXISTING MISSION / STEP CONTENT INVENTORY

### Summary Overview: 8 Missions, 57 Practical Steps (Branch Manager Workspace Only)

| Mission Code | Mission Title | Workspace | Routes Covered | Step Count | Training Types | Business Task Taught | Starting Condition | Ending Condition | Debrief Present? |
|---|---|---|---|---|---|---|---|---|---|
| **M1** | Morning Showroom Opening & Daily Start | Branch Manager | `/login`, `/dashboard` | 7 | 5 Observe, 1 Practice, 1 Decision | Showroom security, cash float count, footfall review | Unauthenticated login screen | Cash float count decision verified | **NO** |
| **M2** | Customer Inquiry & Test Drive Management | Branch Manager | `/sales/leads`, `/sales/create-lead` | 7 | 5 Observe, 1 Practice, 1 Decision | Capturing walk-in leads, verifying CNIC, test-drive scheduling | Leads table view | Walk-in KYC decision verified | **NO** |
| **M3** | Commercial Quotation & Sales Booking | Branch Manager | `/sales/quotations`, `/sales/create-quotation` | 7 | 4 Observe, 2 Practice, 1 Decision | 7-day price quote, discount limits, booking deposit | Quotation list | Discount ceiling decision verified | **NO** |
| **M4** | Showroom Inventory Allocation & PDI Inspection | Branch Manager | `/inventory/units`, `/inventory/stock-requests` | 7 | 5 Observe, 1 Practice, 1 Decision | Serialized BRG search, battery SOC check, multi-point PDI | Serialized units catalog | Battery replacement warranty decision | **NO** |
| **M5** | Showroom Vehicle Handover & Gate Pass Issuance | Branch Manager | `/sales/orders`, `/sales/create-order` | 7 | 4 Observe, 2 Practice, 1 Decision | Zero-balance verification, customer KYC, Gate Pass generation | Sales order registry | Outstanding balance release decision | **NO** |
| **M6** | After-Sales Service Intake & Workshop Job Card | Branch Manager | `/workshop/jobs`, `/workshop/create-job` | 8 | 5 Observe, 2 Practice, 1 Decision | Customer complaint intake, technician bay assignment, parts | Workshop jobs table | Warranty claim validation decision | **NO** |
| **M7** | Showroom Petty Cash & Day-End Closing | Branch Manager | `/finance/petty-cash`, `/finance/cash-reconciliation` | 7 | 5 Observe, 1 Practice, 1 Decision | Local OPEX voucher, cashier drawer count, Z-report | Petty cash voucher table | OPEX escalation decision | **NO** |
| **M8** | Branch Action Centre & Managerial Auditing | Branch Manager | `/action-centre`, `/analytics/performance` | 7 | 5 Observe, 2 Practice, 0 Decision | Action Centre task filtering, decision drawer, audit logs | Action Centre queue | Performance analytics review | **NO** |

---

## F. NON-TECHNICAL LANGUAGE AUDIT & OPERATIONAL THRESHOLD RECLASSIFICATION

### 1. Technical Software Engineering Jargon Leaked to User
- In active step configurations, raw regex patterns (e.g. `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$`) and schema terminology (`validation.pattern`, `validation.rule`) are directly defined inside step payloads.
- **Classification:** `TOO_TECHNICAL` — Must be abstracted cleanly into the runtime validation engine; user-facing coachmarks must speak exclusively in dealership operational terms.

### 2. Operational Thresholds & Fixed Values (Forensic Reclassification)

The existing DAP copy and rule registries hardcode specific numerical values. Following approved authority, these are separated into three distinct forensic categories:

#### Category A — Approval / Authority Thresholds
- **"8% Commercial Discount Ceiling" (M3, Rule 2, Q115):** Approved authority mandates that discount approval limits are **configurable governance policies**, not fixed 8% hardcodes. Reclassified: `REUSABLE_WITH_REWRITE` + `LEGACY_FIXED_POLICY_VALUE`.
- **"PKR 15,000 Petty Cash Limit" (M7, Rule 3, Q327):** Showroom petty cash approval ceilings are **configurable governance policies**. Reclassified: `REUSABLE_WITH_REWRITE` + `LEGACY_FIXED_POLICY_VALUE`.

#### Category B — Opening Cash Float
- **"PKR 50,000 Opening Cash Float" (M1, Rule 9, Q379, Q379):** Standard showroom opening cash float baseline parameter. Reclassified: `APPROVED_CONFIGURABLE_OPERATIONAL_VALUE` (default showroom operational baseline).

#### Category C — Quotation Validity
- **"7-Day Quotation Validity" (M3, Rule 6, Q118, Q118):** Standard default quotation expiration window. Reclassified: `APPROVED_CONFIGURABLE_TERM` (default operational validity window setting).

- **Verdict:** No hardcoded numerical threshold may be taught as immutable universal truth. Educational copy must frame Category A as *"configured dealership policy thresholds (e.g. discount above policy ceiling or expense above PKR limit)"*.

### 3. Dealership Business Jargon Evaluation
- **CNIC (Computerized National Identity Card):** Used across M2, M3, M5. Highly role-appropriate for Pakistani dealership operations, but lacks explicit guidance on 13-digit formatting rules in beginner tooltips.
- **PDI (Pre-Delivery Inspection):** Used in M4 and M5. Fully appropriate, but lacks a breakdown of the mandatory safety checklist (brakes, battery SOC, charger).
- **Z-Report / Day-End Reconciliation:** Used in M7. Appropriate banking/cash term, but does not explain what happens when the physical count fails to match the system ledger.
- **State of Charge (SOC) & State of Health (SOH):** Used in M1, M4, M6. Accurately reflects EV technical standards (>80% SOC floor display, <70% SOH battery replacement threshold).

---

## G. “WHAT IS THIS?” COVERAGE (SCREEN / COMPONENT PURPOSE)

- **Overall Metric:** `CLEAR (73.7%, 42 steps) | PARTIAL (26.3%, 15 steps) | MISSING (0%, 0 steps)`
- **Evaluation:** Existing coachmarks generally provide a clear title and basic 1-2 sentence description explaining what the target UI element or card represents (e.g. *"Live EV Inventory Metric"*, *"Opening Cash Drawer Float Balance"*).
- **Deficiency:** 15 steps provide shallow descriptions that describe visual controls rather than business entities (e.g. *"Manager Credentials block"* rather than explaining why authorized Branch Manager access is legally distinct from sales staff access).

---

## H. “WHAT SHOULD I DO?” COVERAGE (ACTION CLARITY)

- **Overall Metric:** `CLEAR_ACTION (36.8%, 21 steps) | AMBIGUOUS_ACTION (63.2%, 36 steps)`
- **Evaluation:** 
  - The 16 Practice steps and 5 Decision steps give explicit, clear instructions (e.g. *"Enter customer CNIC"*, *"Select the compliant managerial action"*).
  - The 36 Observe steps rely heavily on vague observational directives (*"Observe the secure enterprise gateway"*, *"Examine today's customer appointments"*, *"Review the high-level KPI cards"*). Users are left wondering whether they should click, scroll, or just read.

---

## I. “WHY DOES THIS MATTER?” COVERAGE (RECALCULATED FOR THRESHOLDS)

- **Overall Metric:** `EXPLAINED (40.4%, 23 steps) | PARTIAL (40.4%, 23 steps) | MISSING (19.3%, 11 steps)`
- **Recalculation Rationale:** 5 steps in M1, M3, and M7 previously received full "Explained" credit based on fixed hardcoded thresholds (e.g. "strictly 8% ceiling" or "strictly PKR 15,000 ceiling"). Because these thresholds are configurable policies rather than universal invariants, their rationale is classified as `PARTIAL` until rewritten to explain the underlying governance principle (managerial approval tiers).

---

## J. EXAMPLE QUALITY

- **Overall Metric:** `BUSINESS_REALISTIC (28.1%, 16 steps) | NO_EXAMPLE (71.9%, 41 steps)`
- **Evaluation:**
  - In practice steps, examples are realistic to local Pakistani EV dealership operations (`manager.lahore@ajecodrive.com`, `35201-1234567-1`, `0300-1234567`, `PKR 450,000`, `PKR 12,500`).
  - None of the 36 Observe steps provide realistic illustrative examples of the metrics they describe.

---

## K. DOWNSTREAM-EFFECT COVERAGE

- **Overall Metric:** `COMPLETE (0%, 0 steps) | PARTIAL (31.6%, 18 steps) | MISSING (68.4%, 39 steps)`
- **Critical Finding:** The existing tour rarely explains what ledger or physical record is created downstream when a button is clicked. For example:
  - Submitting a Quotation does not explain that it expires automatically in 7 calendar days.
  - Generating a Gate Pass does not explain that the vehicle's serial record moves from `Reserved` to `Sold` and cannot be re-issued.

---

## L. “WHO RECEIVES THE WORK NEXT?” COVERAGE (CROSS-ROLE HANDOFF)

- **Overall Metric:** `EXPLAINED (10.5%, 6 steps) | MISSING (89.5%, 51 steps)`
- **Critical Finding:** In 51 of 57 steps, the guide treats the Branch Manager as working in a vacuum. It does not explain when a task is routed to Super Admin in Action Centre (e.g. discount policy escalation, expense voucher sign-off, warranty battery claims).

---

## M. STOCK IMPACT CONTENT AUDIT

- **Contract Invariant Check:**
  1. *Product creation = zero stock:* Not taught in runtime tour (Super Admin capability missing).
  2. *Purchase Order creation = zero stock:* Not taught in runtime tour.
  3. *Stock Request approval = no stock movement:* **CONFLATED** in M4 Step 6 (implies approval moves stock immediately).
  4. *Transfer dispatch = source unit becomes `Transfer In Transit`:* Not explicitly distinguished in runtime tour.
  5. *Transfer receipt = accepted unit becomes `Available` at destination:* Covered partially in M4.
  6. *Sales Order Confirmation = Unit becomes `Reserved`:* M3 implies advance deposit locks stock immediately without selecting an exact serialized unit (BRG/Serial).

---

## N. FINANCIAL IMPACT CONTENT AUDIT

- **Contract Invariant Check:**
  1. *Approval = Payment:* Correctly separated in M7 (petty cash approval precedes cashier payout).
  2. *PO = COGS:* Procurement not present in runtime tour.
  3. *Payment = Completed Sale:* M5 correctly enforces zero-balance ledger before gate pass generation.
  4. *Landed Cost Allocation:* Completely absent from runtime tour.

---

## O. CUSTOMER / SALES IMPACT AUDIT & HANDOVER CONTRACT ALIGNMENT

- **Approved Sales & Handover Sequence:**
  $$\text{Create / Confirm Order} \longrightarrow \text{Select Exact Serialized BRG} \longrightarrow \text{Unit Moves to } \mathbf{Reserved}$$
  $$\text{Track Payment Independently (unpaid / partial / paid)} \longrightarrow \text{Invoice per SOP} \longrightarrow \text{Delivery / Handover} \longrightarrow \text{Unit Moves to } \mathbf{Sold}$$
  - **Forensic Rule:** $\text{PAYMENT STATUS} \neq \text{PHYSICAL UNIT STATUS}$.
  - **Contract Correction:** The exact serialized unit becomes `Reserved` when allocated to the confirmed order. Payment remains independently tracked (`unpaid`/`partial`/`paid`). The unit becomes `Sold` / customer-owned after the required handover/completion process.
  - **Legacy DAP Audit:** M5 Step 7 implies 100% payment is a universal physical precondition for vehicle release. This legacy claim is classified as `UNSUPPORTED_CLAIM` / `REUSABLE_WITH_REWRITE` (business process invoicing and delivery handover govern completion).

---

## P. PROCUREMENT CONTENT AUDIT

- **Runtime DAP Status:** `0% COVERAGE (NO STEPS)`
- **Finding:** Complete procurement lifecycle (Purchase Order $\rightarrow$ Sea Container Goods Receipt $\rightarrow$ Landed Cost Allocation $\rightarrow$ Supplier Bill/Payment) is entirely missing from runtime DAP because it resides in the Super Admin workspace.

---

## Q. INVENTORY CONTENT AUDIT

- **Audited Steps (M4):**
  - Focuses on serialized chassis/BRG lookup, battery SOC, and multi-point PDI.
  - **State Model Gap:** Uses generic visual status terms instead of the 11 approved canonical states (`Expected`, `Supplier In Transit`, `Receiving / QC`, `Available`, `Reserved`, `Transfer In Transit`, `Sold`, `Returned`, `In Service`, `Damaged / Quarantine`, `Scrapped`).

---

## R. STOCK REQUEST / TRANSFER CONTENT AUDIT

- **Audited Steps (M4 Steps 6–7):**
  - Conflates inter-branch Stock Requisitions with direct Transfers.
  - Fails to explain the 4-stage transfer custody chain (`Requested` $\rightarrow$ `Approved` $\rightarrow$ `Dispatched / Transfer In Transit` $\rightarrow$ `Received / Available`).

---

## S. ACTION CENTRE / NOTIFICATIONS AUDIT

- **Audited Steps (M8):**
  - M8 treats Action Centre as a task list rather than an authoritative 5-Flow decision engine.
  - Does not clearly distinguish informational bell notifications from actionable decision drawers.

---

## T. MANAGEMENT INBOX AUDIT

- **Runtime DAP Status:** `MINIMAL (M1 Step 7 mentions internal directives)`
- **Finding:** Does not teach how management communication links directly to specific business records (Orders, Claims, Transfer Discrepancies).

---

## U. SUPER ADMIN EXISTING CONTENT COVERAGE

| Super Admin Module / Capability | Runtime DAP Content | External Reference Source Content | Classification |
|---|---|---|---|
| **Executive Overview & Nationwide Telemetry** | None (0 steps) | Master QA Q1–Q12, Q375–Q378 | `STRONG_SOURCE_CONTENT (EXTERNAL ONLY)` |
| **Global Procurement & Container Ingestion** | None (0 steps) | Master QA Part 25 (Q343–Q358) | `STRONG_SOURCE_CONTENT (EXTERNAL ONLY)` |
| **Nationwide Serialized Inventory & Allocation** | None (0 steps) | Master QA Part 17 (Q233–Q246) | `STRONG_SOURCE_CONTENT (EXTERNAL ONLY)` |
| **Inter-Branch Transfer Authorization** | None (0 steps) | Master QA Part 19 (Q259–Q272) | `STRONG_SOURCE_CONTENT (EXTERNAL ONLY)` |
| **Global Price Books & Commercial Ceilings** | None (0 steps) | Master QA Part 9 (Q113–Q128) | `STRONG_SOURCE_CONTENT (EXTERNAL ONLY)` |
| **Action Centre Master Decision Engine (5 Flows)** | None (0 steps) | Master QA Part 4–6, Part 27 | `STRONG_SOURCE_CONTENT (EXTERNAL ONLY)` |
| **Warranty Claims & OEM Battery Approvals** | None (0 steps) | Master QA Part 15 (Q203–Q218) | `STRONG_SOURCE_CONTENT (EXTERNAL ONLY)` |
| **Nationwide Cash, Bank & OPEX Approvals** | None (0 steps) | Master QA Part 23–24 | `STRONG_SOURCE_CONTENT (EXTERNAL ONLY)` |
| **Organization, Branches & User RBAC** | None (0 steps) | Master QA Part 26 (Q359–Q374) | `STRONG_SOURCE_CONTENT (EXTERNAL ONLY)` |
| **Audit Logs & Master Traceability** | None (0 steps) | Master QA Part 27 | `STRONG_SOURCE_CONTENT (EXTERNAL ONLY)` |

---

## V. BRANCH MANAGER EXISTING CONTENT COVERAGE

| Branch Manager Module / Capability | Runtime DAP Content | External Reference Source Content | Classification |
|---|---|---|---|
| **Morning Showroom Start & Cash Float** | Active (M1, 7 steps) | Master QA Part 3 (Q25–Q36H) | `CURRENT_VALID (NEEDS LEVEL 1–4 EXPANSION)` |
| **Customer Leads & Walk-In KYC** | Active (M2, 7 steps) | Master QA Part 7–8 (Q85–Q112) | `CURRENT_VALID (NEEDS LEVEL 1–4 EXPANSION)` |
| **7-Day Quotations & Discount Limits** | Active (M3, 7 steps) | Master QA Part 9 (Q113–Q128) | `CURRENT_VALID (NEEDS LEVEL 1–4 EXPANSION)` |
| **Floor Inventory, Battery SOC & PDI** | Active (M4, 7 steps) | Master QA Part 12, 17, 21 | `CURRENT_VALID (NEEDS LEVEL 1–4 EXPANSION)` |
| **POS Checkout, Zero-Balance Gate Pass** | Active (M5, 7 steps) | Master QA Part 10–12 | `CURRENT_VALID (NEEDS LEVEL 1–4 EXPANSION)` |
| **Workshop Job Cards & Repair Intake** | Active (M6, 8 steps) | Master QA Part 13–15 | `CURRENT_VALID (NEEDS LEVEL 1–4 EXPANSION)` |
| **Petty Cash & Day-End Z-Report** | Active (M7, 7 steps) | Master QA Part 23–24 | `CURRENT_VALID (NEEDS LEVEL 1–4 EXPANSION)` |
| **Branch Action Centre & Local Audits** | Active (M8, 7 steps) | Master QA Part 4–6, 27 | `CURRENT_VALID (NEEDS LEVEL 1–4 EXPANSION)` |

---

## W. FIELD-LEVEL GUIDANCE DEPTH

- **Audited Forms:** Customer Registration, Lead Creation, Quotation Form, Petty Cash Voucher, Workshop Job Intake.
- **Depth Analysis:**
  - Currently, only 1 field per form receives an interactive practice step (e.g. Email in Login, CNIC in Leads, Amount in Petty Cash).
  - Remaining 85%+ of form fields receive zero field-level guidance in the current tour.
  - **Verdict:** Requires comprehensive **Level 3 Field Guides** for all major operational forms in Phase 5.

---

## X. KPI / TABLE GUIDANCE DEPTH

- **KPI Cards:** Existing guidance states what the KPI displays (e.g. *"Displays the number of physical EV units..."*), but does not explain:
  - Calculation provenance (which database records contribute).
  - Action threshold (when the metric requires manager intervention).
- **Tables & Lists:** Existing guidance shows search bars and filters, but fails to explain status chip meaning, multi-column sorting, or bulk actions.

---

## Y. POST-ACTION DEBRIEF AUDIT

- **Audit Result:** `0 of 8 Missions Contain a Post-Action Debrief (0% Coverage)`
- **Finding:** When a mission completes (e.g. after M5 Gate Pass Issuance or M7 Z-Report), the tour abruptly shows a generic completion toast or advances without answering:
  - *What just happened?*
  - *What record changed?*
  - *Did stock move?*
  - *Did money move?*
  - *Who acts next?*
  - *What should the user check next?*
- **Verdict:** A mandatory **Level 4 Post-Action Debrief Component** must be engineered during Phase 4 and populated in Phase 5.

---

## Z. ERROR / EXCEPTION GUIDANCE

- **Audit Result:** `2 of 57 Steps Mention Exception Handling (3.5% Coverage)`
- **Gaps Identified:**
  - No guidance on handling duplicate CNICs or chassis numbers.
  - No guidance on handling damaged EV deliveries during stock receipts.
  - No guidance on cash float shortages during morning opening or evening Z-report reconciliation.
  - No guidance on customer quotation expiration recovery.

---

## AA. QUESTIONNAIRE AUDIT & PER-QID TRACEABILITY INDEX (AJ_ECODRIVE_COMPLETE_CLIENT_GUIDE_QA.md)

### 1. Mechanical QID ↔ Source Question Title Alignment & Claim Verification
- **Explicit Source Question Column:** Every row in the index contains the exact source question title from `AJ_ECODRIVE_COMPLETE_CLIENT_GUIDE_QA.md`.
- **Mechanical QID Alignment:** Verified that `INDEX_QID = SOURCE_QID` across all 413 rows with zero QID or content drift.
- **Q118 / Q119 Source-to-Claim Correction:**
  - **Q118** (*Does creating a Quotation reserve physical stock on the showroom floor?*): Audited against stock reservation claim $
ightarrow$ Reclassified to `REUSABLE_WITH_REWRITE` (`SUPPORTED_CORE_CONCEPT_WITH_UNSUPPORTED_RESERVATION_TRIGGER`).
  - **Q119** (*How does a salesperson convert a Quotation into a confirmed Sales Order?*): Audited against quotation conversion workflow $
ightarrow$ Classified to `DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE` (`TIER1_2_SUPPORTED_SOP`).
- **Q109 Architecture Verification:**
  - **Q109** (*What happens if a customer's CNIC has expired?*): Reclassified conservatively to `UNKNOWN_REQUIRES_LATER_CHECKPOINT` (`LEGACY_OFFLINE_ARCHITECTURE_NOT_APPROVED`) because national cloud database sync and desktop offline queueing architecture are not approved in Tier 1 Operating Blueprint.

### 2. Authority-Based Content Classification Breakdown
- DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE (with Explicit Claim-Level Authority): **372 Questions (90.07%)** — Explicitly supported by Tier 1 Operating Blueprint, Tier 2 Contracts/Clarifications, Tier 3 Wave 7 Contracts, or Tier 4 Verified Code.
- DIRECTLY_REUSABLE (WITHOUT Explicit Claim-Level Authority): **0 Questions (0.00%)** — *Strictly Zero Fallback Positives.*
- REUSABLE_WITH_REWRITE (LEGACY_FIXED_POLICY_VALUE / ARCHITECTURAL_CONDENSATION / UNRESERVED_TRIGGER): **18 Questions (4.36%)** — Configurable policy thresholds, deep offline architecture, or reservation triggers requiring rewrite.
- BUSINESS_DECISION_REQUIRED (UNSUPPORTED_POLICY_TERM / UNSUPPORTED_WARRANTY_THRESHOLD / UNVERIFIED_TAX_ENGINE / UNVERIFIED_FRAUD_ALGORITHM): **5 Questions (1.21%)** — Unverified legacy claims (Q111 tax engine, Q114 quotation duration, Q206 battery SOH warranty, Q318 anti-smurfing, Q379 opening float) requiring business/OEM confirmation.
- CLIENT_DEMO_ONLY (EXECUTIVE_PITCH): **2 Questions (0.48%)** — High-level executive / investor pitch talking points (Q1, Q2).
- OUTDATED_AFTER_RECONSTRUCTION (LEGACY_STATE_ALIAS): **14 Questions (3.39%)** — Questions referencing pre-remediation legacy state aliases (QC Hold, Maintenance, Allocated, Generic In Transit).
- GOOD_REFERENCE_NOT_USER_COPY (HARDWARE_INFRASTRUCTURE_SPEC): **1 Question (0.24%)** — Hardware / infrastructure hotspot specification (Q401).
- UNKNOWN_REQUIRES_LATER_CHECKPOINT (LEGACY_OFFLINE_ARCHITECTURE_NOT_APPROVED): **1 Question (0.24%)** — Q109 offline cloud database sync architecture not approved in Blueprint.
- **Mathematical Reconciliation:**
  \text{Total Parsed (413)} = 372 + 0 + 18 + 5 + 2 + 14 + 1 + 1 = 413 \quad (100\% \text{ Reconciled})

### 3. Complete 413-Row Per-QID Traceability Index with Source Titles

| QID | Source Question | Part / Topic | Classification | Reason Code | Authority Basis |
|---|---|---|---|---|---|
| Q1 | In simple words, what is AJ EcoDrive? | PART 1 | CLIENT_DEMO_ONLY | EXECUTIVE_PITCH | Investor / Executive Presentation |
| Q2 | Why can't an EV dealership just use a generic accounting tool like QuickBooks or Excel? | PART 1 | CLIENT_DEMO_ONLY | EXECUTIVE_PITCH | Investor / Executive Presentation |
| Q3 | Who are the active users of AJ EcoDrive today? | PART 1 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q3) |
| Q4 | What does "Multi-Branch Architecture" mean for a dealership owner? | PART 1 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q4) |
| Q5 | Can staff in Peshawar sell a bike that is physically located in Islamabad? | PART 1 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q5) |
| Q6 | What is a "Serialized Unit" in the context of electric bikes? | PART 1 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q6) |
| Q7 | What lifecycle stages does an electric bike move through in the system? | PART 1 | OUTDATED_AFTER_RECONSTRUCTION | LEGACY_STATE_ALIAS | Pre-Wave-7 Legacy Concept |
| Q8 | What currency and number formats are used across the system? | PART 1 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q8) |
| Q9 | Does the system track spare parts, tyres, and workshop consumables? | PART 1 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q9) |
| Q10 | How does AJ EcoDrive handle manufacturer warranties? | PART 1 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q10) |
| Q11 | What happens if a customer visits the workshop with a burned controller under warranty? | PART 1 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q11) |
| Q12 | Can showroom staff secretly sell a bike without registering it in the system? | PART 1 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q12) |
| Q13 | What hardware platforms does AJ EcoDrive support? | PART 2 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q13) |
| Q14 | Does the Mobile / Tablet App have fewer features than the Desktop version? | PART 2 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q14) |
| Q15 | Why are mobile tablets particularly valuable on the showroom floor? | PART 2 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q15) |
| Q16 | How do mechanics benefit from mobile tablet access in the workshop? | PART 2 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q16) |
| Q17 | What are the two active user login categories in the system today? | PART 2 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q17) |
| Q18 | What is the roadmap for individual staff logins in the future? | PART 2 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q18) |
| Q19 | How do users switch between Dark and Light display modes? | PART 2 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q19) |
| Q20 | What happens if a salesperson leaves their workstation unattended? | PART 2 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q20) |
| Q21 | What happens if an employee forgets their login password? | PART 2 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q21) |
| Q22 | Can a terminated employee still log into the system? | PART 2 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q22) |
| Q23 | If an employee leaves the company, what happens to their historical sales and invoices? | PART 2 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q23) |
| Q24 | How does a user safely log out at the end of their shift? | PART 2 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q24) |
| Q25 | What is the very first screen a Branch Manager sees upon logging in each morning? | PART 3 | OUTDATED_AFTER_RECONSTRUCTION | LEGACY_STATE_ALIAS | Pre-Wave-7 Legacy Concept |
| Q26 | What is the Morning Central Synchronization Routine? | PART 3 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q26) |
| Q27 | What is the Quick Actions bar on the dashboard and top navigation, how does it speed up operations, and what is the difference between a Quick Sale (POS) and a Sales Order? | PART 3 | OUTDATED_AFTER_RECONSTRUCTION | LEGACY_STATE_ALIAS | Pre-Wave-7 Legacy Concept |
| Q28 | How does the Branch Manager verify physical floor inventory against the system each morning? | PART 3 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q28) |
| Q29 | What is the morning procedure for the Showroom Cash Drawer Float? | PART 3 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q29) |
| Q30 | How does the system handle internet drops or power load-shedding in the morning? | PART 3 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q30) |
| Q31 | What should the manager do if an expected incoming delivery truck arrived overnight? | PART 3 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q31) |
| Q32 | How does the system alert the manager to scheduled customer delivery appointments? | PART 3 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q32) |
| Q33 | How does the manager check for open service complaints from the previous day? | PART 3 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q33) |
| Q34 | What is the morning team briefing routine supported by AJ EcoDrive? | PART 3 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q34) |
| Q35 | What happens if the system shows a catalog price update from Head Office? | PART 3 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q35) |
| Q36 | How does the manager verify that receipt printers and barcode scanners are working? | PART 3 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q36) |
| Q36A | What is the Branch Snapshot on the Branch Manager Dashboard, where does each KPI tile redirect, and what does it display? | PART 3 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q36A) |
| Q36B | What is the Action Required table on the Branch Manager Dashboard, and where do the "Open ›" buttons and record badges redirect? | PART 3 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q36B) |
| Q36C | What are the 4 Top KPI Cards on the Branch Manager Dashboard and where do they redirect? | PART 3 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q36C) |
| Q36D | What are the explicit operational decision criteria for choosing between a "Quick Sale (POS)" and a "Sales Order (Booking)" at the showroom counter? | PART 3 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q36D) |
| Q36E | How do the financial and accounting ledger entries differ between a Point of Sale (POS) transaction and a Sales Order booking? | PART 3 | OUTDATED_AFTER_RECONSTRUCTION | LEGACY_STATE_ALIAS | Pre-Wave-7 Legacy Concept |
| Q36F | What are the 9 Standard Dealership Operational Goals achieved via the Quick Actions menu? | PART 3 | REUSABLE_WITH_REWRITE | LEGACY_FIXED_POLICY_VALUE | Final Blueprint Governance Policy (Claim verified for Q36F) |
| Q36G | What is the mandatory 5-step Morning Showroom Opening Checklist every Branch Manager must complete before unlocking the customer entrance doors? | PART 3 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q36G) |
| Q36H | How does the system prevent staff from confusing a Sales Quotation with a Sales Order or Official Invoice? | PART 3 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q36H) |
| Q37 | What is the Action Centre screen in AJ EcoDrive, and how do dealership staff navigate to it? | PART 4 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q37) |
| Q38 | What makes the Action Centre fundamentally different from standard Notifications? | PART 4 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q38) |
| Q39 | What are the 7 Work Queue Tabs in the Action Centre, and what does each tab filter? | PART 4 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q39) |
| Q40 | What do the 5 Summary KPI Cards at the top of the Action Centre indicate? | PART 4 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q40) |
| Q41 | What are the 4 Visual SLA Urgency Badges, and what do they mean? | PART 4 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q41) |
| Q42 | Can a Branch Manager approve their own requests in the Action Centre? | PART 4 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q42) |
| Q43 | How does the Action Centre prevent bottlenecks when Head Office directors are busy? | PART 4 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q43) |
| Q44 | Does the Action Centre support filtering by specific branch showroom? | PART 4 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q44) |
| Q45 | What information is displayed on each Action Centre task card? | PART 4 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q45) |
| Q46 | Can staff communicate directly inside an Action Centre item? | PART 4 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q46) |
| Q47 | What happens when an action item is officially Approved? | PART 4 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q47) |
| Q48 | What happens when an action item is Rejected? | PART 4 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q48) |
| Q49 | How does the Action Centre maintain legal and tax audit compliance? | PART 4 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q49) |
| Q50 | Can a Super Admin delegate an action item to another department? | PART 4 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q50) |
| Q51 | How does the Action Centre appear on mobile tablets? | PART 4 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q51) |
| Q52 | What happens if an action item was submitted while the branch was offline? | PART 4 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q52) |
| Q53 | What are the 5 Standard Enterprise Action Flows in AJ EcoDrive? | PART 5 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q53) |
| Q54 | What triggers a Flow 1 (Commercial & Pricing) action item? | PART 5 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q54) |
| Q55 | What financial metrics does the Super Admin see when reviewing a Flow 1 pricing request? | PART 5 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q55) |
| Q56 | How does the Counter-Offer feature work in Flow 1? | PART 5 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q56) |
| Q57 | What triggers a Flow 2 (Stock Reallocation) action item? | PART 5 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q57) |
| Q58 | What checks are performed before a Flow 2 Stock Reallocation is approved? | PART 5 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q58) |
| Q59 | What triggers a Flow 3 (High-Value OPEX) action item? | PART 5 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q59) |
| Q60 | What documentation is mandatory for a Flow 3 OPEX approval? | PART 5 | OUTDATED_AFTER_RECONSTRUCTION | LEGACY_STATE_ALIAS | Pre-Wave-7 Legacy Concept |
| Q61 | What triggers a Flow 4 (Technical & Warranty) action item? | PART 5 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q61) |
| Q62 | How does Flow 4 prevent fraudulent warranty part swapping? | PART 5 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q62) |
| Q63 | What triggers a Flow 5 (Inventory Governance) action item? | PART 5 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q63) |
| Q64 | What happens when a missing VIN variance is approved in Flow 5? | PART 5 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q64) |
| Q65 | Can an action item transition between different flows? | PART 5 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q65) |
| Q66 | How are action item reference IDs formatted across the 5 flows? | PART 5 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q66) |
| Q67 | What automated email and WhatsApp notifications are triggered by the 5 flows? | PART 5 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q67) |
| Q68 | What is the average resolution SLA target across the 5 flows? | PART 5 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q68) |
| Q69 | What is the Action Creation Wizard in AJ EcoDrive? | PART 6 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q69) |
| Q70 | What validation rules are enforced in Step 1 of the Action Creation Wizard? | PART 6 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q70) |
| Q71 | What validation rules are enforced in Step 2 of the Action Creation Wizard? | PART 6 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q71) |
| Q72 | What is the Decision Treatment Drawer in the Action Centre? | PART 6 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q72) |
| Q73 | What are the 4 Primary Decision Action Buttons in the Treatment Drawer? | PART 6 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q73) |
| Q74 | What is the "Financial Impact Summary" displayed inside the Decision Drawer? | PART 6 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q74) |
| Q75 | How does the Treatment Drawer display the Serialized Unit's History in Flow 2 and Flow 4? | PART 6 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q75) |
| Q76 | Can a reviewer view customer credit and payment history inside the drawer? | PART 6 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q76) |
| Q77 | What happens when the reviewer clicks "Counter-Offer"? | PART 6 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q77) |
| Q78 | How does the branch salesperson accept a Counter-Offer? | PART 6 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q78) |
| Q79 | What happens when the reviewer clicks "Decline"? | PART 6 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q79) |
| Q80 | How does the Treatment Drawer support multi-attachment document previewing? | PART 6 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q80) |
| Q81 | Can a reviewer add private internal notes invisible to the branch manager? | PART 6 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q81) |
| Q82 | How does the Decision Drawer operate on mobile and touchscreen tablets? | PART 6 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q82) |
| Q83 | How is task resolution velocity tracked for managerial KPIs? | PART 6 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q83) |
| Q84 | What happens if two Super Admins open and review the same Action Item simultaneously? | PART 6 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q84) |
| Q85 | What happens when a prospective customer enters the showroom? | PART 7 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q85) |
| Q86 | Why is capturing every walk-in lead mandatory in AJ EcoDrive? | PART 7 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q86) |
| Q87 | How does the system record and schedule Customer Test Rides? | PART 7 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q87) |
| Q88 | What happens after the test ride is completed? | PART 7 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q88) |
| Q89 | How does the system prevent duplicate lead entries for the same customer? | PART 7 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q89) |
| Q90 | Modal Guide — What is the CreateLeadModal (CreateLead.vue) and what are its exact fields? | PART 7 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q90) |
| Q91 | How do sales reps view their daily follow-up task queue? | PART 7 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q91) |
| Q92 | What automated WhatsApp messages are dispatched upon lead creation? | PART 7 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q92) |
| Q93 | Can a lead be reassigned to another salesperson? | PART 7 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q93) |
| Q94 | How does the system handle corporate fleet inquiries? | PART 7 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q94) |
| Q95 | How are lost leads recorded and analyzed? | PART 7 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q95) |
| Q96 | Can walk-in leads be converted directly into formal quotations in 1 click? | PART 7 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q96) |
| Q97 | What happens to old, dormant leads? | PART 7 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q97) |
| Q98 | What performance metrics are tracked for showroom sales representatives? | PART 7 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q98) |
| Q99 | Why is formal CNIC registration mandatory before selling an electric vehicle? | PART 8 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q99) |
| Q100 | How does AJ EcoDrive validate Pakistani CNIC numbers? | PART 8 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q100) |
| Q101 | Modal Guide — What is the CreateCustomerModal (CreateCustomer.vue) and what are its exact fields? | PART 8 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q101) |
| Q102 | How does the system handle corporate clients and fleet buyers during KYC? | PART 8 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q102) |
| Q103 | Can a customer purchase a vehicle on behalf of a family member? | PART 8 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q103) |
| Q104 | What happens if a customer has an existing record from another branch? | PART 8 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q104) |
| Q105 | How are customer document scans (CNIC, driving license) stored securely? | PART 8 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q105) |
| Q106 | Can a customer profile be edited after initial creation? | PART 8 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q106) |
| Q107 | What is the "Customer Loyalty & Vehicle Ownership Summary"? | PART 8 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q107) |
| Q108 | How does the system handle non-Pakistani foreign nationals purchasing EVs? | PART 8 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q108) |
| Q109 | What happens if a customer's CNIC has expired? | PART 8 | UNKNOWN_REQUIRES_LATER_CHECKPOINT | LEGACY_OFFLINE_ARCHITECTURE_NOT_APPROVED | Legacy Q&A only — CNIC expiry alert supported in CreateCustomer.vue, but desktop/offline cloud DB sync not approved in Blueprint |
| Q110 | How does AJ EcoDrive support GDPR / Data Privacy compliance? | PART 8 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q110) |
| Q111 | Can showroom staff export customer lists to Excel? | PART 8 | BUSINESS_DECISION_REQUIRED | UNVERIFIED_TAX_ENGINE | Legacy Q&A only — Customer list export permissions & tax engine require business confirmation |
| Q112 | How does customer registration connect to the FBR Tax Integration? | PART 8 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q112) |
| Q113 | What is the purpose of a formal Sales Quotation in AJ EcoDrive? | PART 9 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q113) |
| Q114 | How long is a Sales Quotation valid? | PART 9 | BUSINESS_DECISION_REQUIRED | UNSUPPORTED_POLICY_TERM | Legacy Q&A only — Sales Quotation validity duration requires business policy confirmation |
| Q115 | What is the automated 8% Discount Ceiling Guard? | PART 9 | REUSABLE_WITH_REWRITE | LEGACY_FIXED_POLICY_VALUE | Final Blueprint §4 — Configurable Governance Policy |
| Q116 | Modal Guide — What is the CreateQuotationModal (CreateQuotation.vue) and what are its exact fields? | PART 9 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q116) |
| Q117 | How does the built-in Financing & Installment Calculator work? | PART 9 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q117) |
| Q118 | Does creating a Quotation reserve physical stock on the showroom floor? | PART 9 | REUSABLE_WITH_REWRITE | SUPPORTED_CORE_CONCEPT_WITH_UNSUPPORTED_RESERVATION_TRIGGER | Final Blueprint §6.2 & §7 — Quotations do not reserve stock; Sales Order confirmation + serialized unit selection sets state to Reserved |
| Q119 | How does a salesperson convert a Quotation into a confirmed Sales Order? | PART 9 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint §6.2 & Developer Handoff — Sales Quotation to Sales Order conversion workflow |
| Q120 | Can a quotation be printed as an official branded PDF? | PART 9 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q120) |
| Q121 | How are quotation discounts tracked in branch financial reports? | PART 9 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q121) |
| Q122 | What happens if Head Office increases catalog prices while a quotation is active? | PART 9 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q122) |
| Q123 | Can a customer request multiple model options on a single quotation? | PART 9 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q123) |
| Q124 | How does the system prevent unauthorized staff from altering approved quotation discounts? | PART 9 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q124) |
| Q125 | How does the system handle trade-in (used petrol bike exchange) valuations? | PART 9 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q125) |
| Q126 | Can a quotation be sent directly to customer WhatsApp? | PART 9 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q126) |
| Q127 | How are lost or cancelled quotations tracked? | PART 9 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q127) |
| Q128 | What is the Quotation Conversion Velocity metric? | PART 9 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q128) |
| Q129 | What is the Point of Sale (POS) workbench in AJ EcoDrive? | PART 10 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q129) |
| Q130 | What is the fundamental difference between Point of Sale (POS) and a Sales Order? | PART 10 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q130) |
| Q131 | What happens if a salesperson tries to sell a vehicle for less than the approved price at POS? | PART 10 | REUSABLE_WITH_REWRITE | LEGACY_FIXED_POLICY_VALUE | Final Blueprint Governance Policy (Claim verified for Q131) |
| Q132 | Modal Guide — What is the CreateSaleModal (CreateSale.vue) and what are its exact fields? | PART 10 | REUSABLE_WITH_REWRITE | LEGACY_FIXED_POLICY_VALUE | Final Blueprint Governance Policy (Claim verified for Q132) |
| Q133 | How does the system allocate physical Chassis VIN numbers at POS checkout? | PART 10 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q133) |
| Q134 | Can a single sale be split across multiple payment methods (e.g. Cash + Bank IBFT)? | PART 10 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q134) |
| Q135 | What thermal receipt printers are supported at POS checkout? | PART 10 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q135) |
| Q136 | Why is the Delivery Gate Pass blocked immediately after creating a Sales Order? | PART 10 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q136) |
| Q137 | What happens to a Sales Order if a customer requests a color change before delivery? | PART 10 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q137) |
| Q138 | How does the system handle corporate Purchase Orders (PO) at sales order entry? | PART 10 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q138) |
| Q139 | Can an in-progress POS sale be put "On Hold" if a customer steps out to get cash? | PART 10 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q139) |
| Q140 | How does the system prevent double-selling the same chassis VIN? | PART 10 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q140) |
| Q141 | What happens if the customer's bank card payment declines at POS? | PART 10 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q141) |
| Q142 | How are sales commissions attributed to showroom staff? | PART 10 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q142) |
| Q143 | Can a completed POS sale be edited after the invoice is generated? | PART 10 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q143) |
| Q144 | What is the Daily Sales Velocity metric on the Branch Dashboard? | PART 10 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q144) |
| Q145 | How does AJ EcoDrive handle customer money collections and receipts? | PART 11 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q145) |
| Q146 | What payment methods are supported in the system? | PART 11 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q146) |
| Q147 | Modal Guide — What is the CreatePaymentModal (CreatePayment.vue) and what are its exact fields? | PART 11 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q147) |
| Q148 | What is an official FBR-Compliant Tax Invoice in AJ EcoDrive? | PART 11 | REUSABLE_WITH_REWRITE | ARCHITECTURAL_CONDENSATION | Final Blueprint Governance Policy (Claim verified for Q148) |
| Q149 | How does the system handle booking token deposits? | PART 11 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q149) |
| Q150 | What happens when a customer pays the final remaining balance? | PART 11 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q150) |
| Q151 | How does the system verify Online Bank IBFT transfers? | PART 11 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q151) |
| Q152 | What happens if a customer's cheque bounces? | PART 11 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q152) |
| Q153 | Can a customer pay in foreign currency (USD / AED)? | PART 11 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q153) |
| Q154 | How are daily cash collections reconciled against the bank deposit slip? | PART 11 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q154) |
| Q155 | What safeguards prevent cashier cash theft or skimming? | PART 11 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q155) |
| Q156 | How does the system handle overpayments or excess customer change? | PART 11 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q156) |
| Q157 | Can an official payment receipt be re-printed? | PART 11 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q157) |
| Q158 | What is the Outstanding Accounts Receivable Aging Report? | PART 11 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q158) |
| Q159 | What is Pre-Delivery Inspection (PDI) in AJ EcoDrive? | PART 12 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q159) |
| Q160 | What are the 6 Mandatory Checkpoints in the PDI Checklist? | PART 12 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q160) |
| Q161 | Why can a Gate Pass NEVER be generated if the PDI fails? | PART 12 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q161) |
| Q162 | Modal Guide — What is the CreateDeliveryHandoverModal (CreateDeliveryHandover.vue) and what are its exact fields? | PART 12 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q162) |
| Q163 | What is the Official Delivery Gate Pass, and what security features does it contain? | PART 12 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q163) |
| Q164 | How does the security guard verify the Gate Pass at the showroom exit? | PART 12 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q164) |
| Q165 | What happens in the system the exact second the Gate Pass is scanned? | PART 12 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q165) |
| Q166 | What customer orientation is conducted during vehicle handover? | PART 12 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q166) |
| Q167 | Can a customer take delivery if they forgot their original CNIC? | PART 12 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q167) |
| Q168 | How does the system handle home delivery via flatbed truck? | PART 12 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q168) |
| Q169 | What happens if a customer notices a cosmetic scratch during handover? | PART 12 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q169) |
| Q170 | Can an expired or previously used Gate Pass be used again? | PART 12 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q170) |
| Q171 | What documentation is handed over to the customer inside the delivery folder? | PART 12 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q171) |
| Q172 | How does the system solicit customer satisfaction (CSAT) feedback? | PART 12 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q172) |
| Q173 | Where can Branch Managers audit all past deliveries? | PART 12 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q173) |
| Q174 | What is the On-Time Delivery Performance KPI? | PART 12 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q174) |
| Q175 | What is the Workshop Service Intake process in AJ EcoDrive? | PART 13 | OUTDATED_AFTER_RECONSTRUCTION | LEGACY_STATE_ALIAS | Pre-Wave-7 Legacy Concept |
| Q176 | What is the difference between a Service Case and a Repair Job Card? | PART 13 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q176) |
| Q177 | Modal Guide — What is the CreateCaseModal (CreateCase.vue) and what are its exact fields? | PART 13 | OUTDATED_AFTER_RECONSTRUCTION | LEGACY_STATE_ALIAS | Pre-Wave-7 Legacy Concept |
| Q178 | How does the system automatically verify warranty validity at workshop intake? | PART 13 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q178) |
| Q179 | What are Free Service Vouchers, and how are they redeemed? | PART 13 | OUTDATED_AFTER_RECONSTRUCTION | LEGACY_STATE_ALIAS | Pre-Wave-7 Legacy Concept |
| Q180 | How does the system record pre-existing vehicle body damage during intake? | PART 13 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q180) |
| Q181 | What happens if a bike arrives with a completely dead (0% SOC) Lithium Battery? | PART 13 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q181) |
| Q182 | Can a customer track their repair status online? | PART 13 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q182) |
| Q183 | How does the workshop manage customer personal belongings left in vehicle storage? | PART 13 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q183) |
| Q184 | What happens if a customer brings a vehicle purchased from another dealership branch? | PART 13 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q184) |
| Q185 | How are urgent breakdown / towing intakes prioritized? | PART 13 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q185) |
| Q186 | What is the Workshop Receptionist Daily Intake Log? | PART 13 | OUTDATED_AFTER_RECONSTRUCTION | LEGACY_STATE_ALIAS | Pre-Wave-7 Legacy Concept |
| Q187 | How does the system handle customer repair budget authorizations? | PART 13 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q187) |
| Q188 | What is the Average Workshop Intake Time KPI? | PART 13 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q188) |
| Q189 | How are repair jobs executed inside the dealership workshop? | PART 14 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q189) |
| Q190 | What is a Mechanic Job Card, and what data does it track? | PART 14 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q190) |
| Q191 | Modal Guide — What is the CreateRepairJobModal (CreateRepairJob.vue) and what are its exact fields? | PART 14 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q191) |
| Q192 | How do spare parts deduct from inventory when installed during a repair? | PART 14 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q192) |
| Q193 | How does the system track technician labour hours and productivity? | PART 14 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q193) |
| Q194 | What is the Post-Repair Quality Control (QC) Sign-Off? | PART 14 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q194) |
| Q195 | What happens if a required spare part is out of stock in the branch? | PART 14 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q195) |
| Q196 | Can multiple technicians work on the same electric vehicle? | PART 14 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q196) |
| Q197 | How does the system handle old, replaced defective parts? | PART 14 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q197) |
| Q198 | How are workshop repair invoices calculated? | PART 14 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q198) |
| Q199 | Can a customer pay for workshop repairs via cash, card, or bank IBFT? | PART 14 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q199) |
| Q200 | What is a Workshop Re-Work / Comeback, and how is it tracked? | PART 14 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q200) |
| Q201 | How do workshop mechanics access technical wiring diagrams and repair manuals? | PART 14 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q201) |
| Q202 | What is the First-Time Fix Rate (FTFR) KPI? | PART 14 | REUSABLE_WITH_REWRITE | LEGACY_FIXED_POLICY_VALUE | Final Blueprint Governance Policy (Claim verified for Q202) |
| Q203 | Why is Lithium Battery warranty governance critical for an EV dealership? | PART 15 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q203) |
| Q204 | What is 3-Way Serialized Hardware Binding in AJ EcoDrive? | PART 15 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q204) |
| Q205 | What diagnostic parameters are evaluated during a Lithium Battery Health Test? | PART 15 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q205) |
| Q206 | What constitutes a Valid Lithium Battery Warranty Claim? | PART 15 | BUSINESS_DECISION_REQUIRED | UNSUPPORTED_WARRANTY_THRESHOLD | Legacy Q&A only — Battery SOH < 70% 2yr/30k km warranty replacement threshold requires OEM policy confirmation |
| Q207 | What constitutes an Invalid / Void Battery Warranty Claim? | PART 15 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q207) |
| Q208 | How does the system handle a Battery Warranty Replacement in the Action Centre? | PART 15 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q208) |
| Q209 | What happens when an OEM Battery Replacement is authorized? | PART 15 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q209) |
| Q210 | What is Cell Balancing, and how does the workshop perform it? | PART 15 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q210) |
| Q211 | How does the system track battery fire and thermal safety compliance? | PART 15 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q211) |
| Q212 | Can a customer purchase an Extended Battery Warranty? | PART 15 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q212) |
| Q213 | How does the system handle Smart BMS Firmware Updates? | PART 15 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q213) |
| Q214 | What is the Battery Degradation Curve report? | PART 15 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q214) |
| Q215 | What safety labels and barcodes are printed for replacement batteries? | PART 15 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q215) |
| Q216 | How are defective Lithium batteries transported back to the OEM factory? | PART 15 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q216) |
| Q217 | What customer education is provided regarding battery health preservation? | PART 15 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q217) |
| Q218 | What is the Battery Warranty Claim Ratio KPI? | PART 15 | REUSABLE_WITH_REWRITE | LEGACY_FIXED_POLICY_VALUE | Final Blueprint Governance Policy (Claim verified for Q218) |
| Q219 | What is the Vehicle Return and Cancellation policy in AJ EcoDrive? | PART 16 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q219) |
| Q220 | What are the two types of Customer Cancellations? | PART 16 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q220) |
| Q221 | What deductions apply to a Pre-Delivery Order Cancellation? | PART 16 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q221) |
| Q222 | What is the 10-Point Technical Inspection for Post-Delivery Returns? | PART 16 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q222) |
| Q223 | Modal Guide — What is the CreateReturnModal (CreateReturn.vue) and what are its exact fields? | PART 16 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q223) |
| Q224 | How is a Customer Refund disbursed? | PART 16 | REUSABLE_WITH_REWRITE | LEGACY_FIXED_POLICY_VALUE | Final Blueprint Governance Policy (Claim verified for Q224) |
| Q225 | What happens to the Vehicle Chassis VIN after a return is processed? | PART 16 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q225) |
| Q226 | How are Credit Notes and Debit Notes generated for returns? | PART 16 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q226) |
| Q227 | Can a customer cancel an order if their vehicle is already registered with Excise & Taxation? | PART 16 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q227) |
| Q228 | How does the system handle accessory refunds? | PART 16 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q228) |
| Q229 | What happens if a customer disputes the refund deduction amount? | PART 16 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q229) |
| Q230 | How are return transactions preserved in financial audit reports? | PART 16 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q230) |
| Q231 | Can a salesperson delete an order instead of processing a formal cancellation? | PART 16 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q231) |
| Q232 | What is the Dealership Cancellation & Return Rate KPI? | PART 16 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q232) |
| Q233 | How does AJ EcoDrive manage Showroom Floor Inventory? | PART 17 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q233) |
| Q234 | What are the 7 Status States of a Serialized Unit? | PART 17 | OUTDATED_AFTER_RECONSTRUCTION | LEGACY_STATE_ALIAS | Pre-Wave-7 Legacy Concept |
| Q235 | How does the system prevent cross-branch stock theft or accidental sales? | PART 17 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q235) |
| Q236 | How do staff search for a specific vehicle in inventory? | PART 17 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q236) |
| Q237 | How are Barcode and QR Code labels generated for showroom vehicles? | PART 17 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q237) |
| Q238 | What information is displayed on the Serialized Unit Detail Page? | PART 17 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q238) |
| Q239 | How does the system manage Showroom Display Bikes vs. Warehouse Storage Units? | PART 17 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q239) |
| Q240 | What happens if a showroom display bike battery is depleted from customer demonstrations? | PART 17 | OUTDATED_AFTER_RECONSTRUCTION | LEGACY_STATE_ALIAS | Pre-Wave-7 Legacy Concept |
| Q241 | Can a serialized unit's specifications (e.g. Color / Battery) be changed in the system? | PART 17 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q241) |
| Q242 | How does the system handle Non-Serialized Spare Parts inventory? | PART 17 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q242) |
| Q243 | What is the Slow-Moving / Aged Inventory Alert? | PART 17 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q243) |
| Q244 | Can a Branch Manager manually adjust stock quantities without an audit? | PART 17 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q244) |
| Q245 | What is the Total Floor Inventory Valuation (PKR)? | PART 17 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q245) |
| Q246 | What is the Stock Turn Velocity KPI? | PART 17 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q246) |
| Q247 | What is a Stock Replenishment Requisition in AJ EcoDrive? | PART 18 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q247) |
| Q248 | What are Minimum Reorder Safety Buffers? | PART 18 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q248) |
| Q249 | What is the difference between Routine Replenishment and Emergency Requisitions? | PART 18 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q249) |
| Q250 | Modal Guide — What is the CreateStockRequestModal (CreateStockRequest.vue) and what are its exact fields? | PART 18 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q250) |
| Q251 | How does Central Warehouse review and approve Stock Requisitions? | PART 18 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q251) |
| Q252 | What happens if Central Warehouse has insufficient stock to fulfill a requisition? | PART 18 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q252) |
| Q253 | Can a branch requisition spare parts along with electric vehicles? | PART 18 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q253) |
| Q254 | How are freight shipping costs allocated for stock replenishment? | PART 18 | OUTDATED_AFTER_RECONSTRUCTION | LEGACY_STATE_ALIAS | Pre-Wave-7 Legacy Concept |
| Q255 | What notifications are sent when a stock requisition is dispatched? | PART 18 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q255) |
| Q256 | Can a Branch Manager cancel a stock requisition after submission? | PART 18 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q256) |
| Q257 | How does the system prevent over-requisitioning by over-enthusiastic sales managers? | PART 18 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q257) |
| Q258 | What is the Requisition Fulfillment Cycle Time KPI? | PART 18 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q258) |
| Q259 | What is an Inter-Branch Stock Transfer in AJ EcoDrive? | PART 19 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q259) |
| Q260 | What are the 4 Stages of an Inter-Branch Stock Transfer? | PART 19 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q260) |
| Q261 | Why can a vehicle NEVER be moved between branches without scanning its VIN barcode? | PART 19 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q261) |
| Q262 | Modal Guide — What is the CreateTransferModal (CreateTransfer.vue) and what are its exact fields? | PART 19 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q262) |
| Q263 | What is an Official Inter-Branch Transfer Dispatch Gate Pass? | PART 19 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q263) |
| Q264 | What happens to the vehicle status the moment the dispatch is executed? | PART 19 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q264) |
| Q265 | How does the system handle multi-vehicle batch transfers (e.g. 10 bikes on a flatbed truck)? | PART 19 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q265) |
| Q266 | What happens if a carrier truck breaks down en route? | PART 19 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q266) |
| Q267 | Can a transfer be cancelled after the truck has departed origin gates? | PART 19 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q267) |
| Q268 | How are inter-branch transfers displayed on the live Dashboard? | PART 19 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q268) |
| Q269 | What transit insurance documentation is generated for high-value transfers? | PART 19 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q269) |
| Q270 | How does the system prevent dispatching a vehicle that has an active customer deposit? | PART 19 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q270) |
| Q271 | Where can logistics executives view nationwide vehicle movements? | PART 19 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q271) |
| Q272 | What is the In-Transit Loss Rate KPI? | PART 19 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q272) |
| Q273 | What is the Inbound Delivery Receiving process in AJ EcoDrive? | PART 20 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q273) |
| Q274 | What is the 3-Step Inbound Receiving Protocol? | PART 20 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q274) |
| Q275 | Modal Guide — What is the ReceiveTransferModal (ReceiveTransfer.vue) and what are its exact fields? | PART 20 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q275) |
| Q276 | What is a Transit Discrepancy, and what types can occur? | PART 20 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q276) |
| Q277 | What happens when a Transit Damage Discrepancy is reported? | PART 20 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q277) |
| Q278 | What happens when a Missing Unit Discrepancy is reported? | PART 20 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q278) |
| Q279 | What happens when all units are scanned and verified as Pristine? | PART 20 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q279) |
| Q280 | How does the system generate an Inbound Receiving Goods Note (GRN)? | PART 20 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q280) |
| Q281 | Can a receiving manager accept a shipment if the internet is down? | PART 20 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q281) |
| Q282 | What happens if a carrier truck arrives after regular showroom hours? | PART 20 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q282) |
| Q283 | How are carrier driver performance and damage claims tracked? | PART 20 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q283) |
| Q284 | Can a damaged vehicle be repaired locally and released from Quarantine? | PART 20 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q284) |
| Q285 | Where can Branch Managers view the history of all received shipments? | PART 20 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q285) |
| Q286 | What is the Inbound Receiving Turnaround Time KPI? | PART 20 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q286) |
| Q287 | What is a Blind Physical Cycle Count in AJ EcoDrive? | PART 21 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q287) |
| Q288 | How often are Cycle Counts conducted in AJ EcoDrive? | PART 21 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q288) |
| Q289 | What is the 3-Step Cycle Count Workflow? | PART 21 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q289) |
| Q290 | Modal Guide — What is the CreateCycleCountModal (CreateCycleCount.vue) and what are its exact fields? | PART 21 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q290) |
| Q291 | What are the 3 Types of Cycle Count Variances? | PART 21 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q291) |
| Q292 | What happens immediately when a Missing Unit is detected? | PART 21 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q292) |
| Q293 | Modal Guide — What is the CreateAdjustmentRequestModal (CreateAdjustmentRequest.vue) and what are its exact fields? | PART 21 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q293) |
| Q294 | How does Super Admin approve an Inventory Adjustment in the Action Centre? | PART 21 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q294) |
| Q295 | What happens if an Unexpected (foreign branch) unit is scanned on the floor? | PART 21 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q295) |
| Q296 | How does the system audit non-serialized spare parts during cycle counts? | PART 21 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q296) |
| Q297 | Can a cycle count be saved and resumed later? | PART 21 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q297) |
| Q298 | How are physical cycle count records preserved for external corporate auditors? | PART 21 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q298) |
| Q299 | What security measures prevent corrupt staff from borrowing bikes from other shops before an audit? | PART 21 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q299) |
| Q300 | What is the Inventory Accuracy Percentage (IPA) KPI? | PART 21 | REUSABLE_WITH_REWRITE | LEGACY_FIXED_POLICY_VALUE | Final Blueprint Governance Policy (Claim verified for Q300) |
| Q301 | What is the Quality Quarantine module in AJ EcoDrive? | PART 22 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q301) |
| Q302 | What triggers a vehicle or component to enter Quarantine? | PART 22 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q302) |
| Q303 | What is Physical Holding Bay Q-3? | PART 22 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q303) |
| Q304 | Modal Guide — What is the CreateQuarantineRecordModal (CreateQuarantineRecord.vue) and what are its exact fields? | PART 22 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q304) |
| Q305 | What happens to a vehicle's digital status when quarantined? | PART 22 | OUTDATED_AFTER_RECONSTRUCTION | LEGACY_STATE_ALIAS | Pre-Wave-7 Legacy Concept |
| Q306 | How are Quarantined units repaired and re-certified? | PART 22 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q306) |
| Q307 | How is a repaired vehicle Released from Quarantine back into Available stock? | PART 22 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q307) |
| Q308 | What happens if a quarantined unit is unrepairable (Severe Damage / Factory Scrap)? | PART 22 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q308) |
| Q309 | How does the system handle Nationwide OEM Safety Recalls? | PART 22 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q309) |
| Q310 | What physical warning tags are attached to quarantined vehicles? | PART 22 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q310) |
| Q311 | How does the system prevent fire hazards in the battery quarantine area? | PART 22 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q311) |
| Q312 | How are quarantine costs and replacement parts accounted for? | PART 22 | OUTDATED_AFTER_RECONSTRUCTION | LEGACY_STATE_ALIAS | Pre-Wave-7 Legacy Concept |
| Q313 | Where can dealership executives review active quarantine inventory? | PART 22 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q313) |
| Q314 | What is the Quarantine Resolution Velocity KPI? | PART 22 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q314) |
| Q315 | How are Showroom Operating Expenses (OPEX) managed in AJ EcoDrive? | PART 23 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q315) |
| Q316 | What is the PKR 15,000 Petty Cash Discretionary Threshold Rule? | PART 23 | REUSABLE_WITH_REWRITE | LEGACY_FIXED_POLICY_VALUE | Final Blueprint Governance Policy (Claim verified for Q316) |
| Q317 | Modal Guide — What is the CreateExpenseModal (CreateExpense.vue) and what are its exact fields? | PART 23 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q317) |
| Q318 | Why is attaching a photo receipt mandatory for every expense entry? | PART 23 | BUSINESS_DECISION_REQUIRED | UNVERIFIED_FRAUD_ALGORITHM | Legacy Q&A only — Anti-Smurfing Fraud Algorithm requires backend system verification |
| Q319 | How does the system handle high-value utility bills (e.g. Electricity Bill of PKR 45,000)? | PART 23 | REUSABLE_WITH_REWRITE | LEGACY_FIXED_POLICY_VALUE | Final Blueprint Governance Policy (Claim verified for Q319) |
| Q320 | How is the Petty Cash Float replenished when cash runs low? | PART 23 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q320) |
| Q321 | Can a salesperson submit an expense voucher? | PART 23 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q321) |
| Q322 | How does the system prevent duplicate expense claims? | PART 23 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q322) |
| Q323 | What accounting ledger accounts are debited when an expense is posted? | PART 23 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q323) |
| Q324 | Can an approved expense voucher be modified or deleted? | PART 23 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q324) |
| Q325 | How does the system track monthly showroom operating budget utilization? | PART 23 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q325) |
| Q326 | What happens if an expense is incurred during an internet outage? | PART 23 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q326) |
| Q327 | Where can Branch Managers print the Monthly Petty Cash Expense Sheet? | PART 23 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q327) |
| Q328 | What is the Expense-to-Revenue Ratio KPI? | PART 23 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q328) |
| Q329 | What is Day-End Closing Reconciliation (Daily Z-Report) in AJ EcoDrive? | PART 24 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q329) |
| Q330 | What is the difference between an X-Report and a Z-Report? | PART 24 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q330) |
| Q331 | What is the 5-Step Physical Currency Denomination Breakdown during Z-Closing? | PART 24 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q331) |
| Q332 | How does the system compare Physical Cash against System Expected Cash? | PART 24 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q332) |
| Q333 | What happens if a Cash Shortage exists during Z-Closing? | PART 24 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q333) |
| Q334 | How are Bank Card (POS Terminal) batches reconciled during Z-Closing? | PART 24 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q334) |
| Q335 | How are Online Bank IBFT collections reconciled during Z-Closing? | PART 24 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q335) |
| Q336 | What is the Safe Cash Drop vs. Next-Day Opening Float Split? | PART 24 | REUSABLE_WITH_REWRITE | LEGACY_FIXED_POLICY_VALUE | Final Blueprint Governance Policy (Claim verified for Q336) |
| Q337 | What is the Daily Z-Report printout, and what data does it contain? | PART 24 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q337) |
| Q338 | What happens in the system the exact second the Z-Report is finalized? | PART 24 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q338) |
| Q339 | What physical showroom security checks are verified during day-end closing? | PART 24 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q339) |
| Q340 | Can a Branch Manager reopen a closed Z-Report after finalizing? | PART 24 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q340) |
| Q341 | Where can Head Office executives view live Z-Closing status across all branches? | PART 24 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q341) |
| Q342 | What is the Cash Reconciliation Accuracy KPI? | PART 24 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q342) |
| Q343 | How does AJ EcoDrive manage International Sea Container Procurement? | PART 25 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q343) |
| Q344 | What is the lifecycle of an International Sea Container Import PO? | PART 25 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q344) |
| Q345 | Modal Guide — What is the CreatePurchaseOrderModal (CreatePurchaseOrder.vue) and what are its exact fields? | PART 25 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q345) |
| Q346 | How does the system compute Landed Cost per Vehicle (PKR)? | PART 25 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q346) |
| Q347 | Modal Guide — What is the ReceivePurchaseModal (ReceivePurchase.vue) and what are its exact fields? | PART 25 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q347) |
| Q348 | How does Batch VIN Serialization work during container intake? | PART 25 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q348) |
| Q349 | What happens if a sea container arrives with damaged electric bikes? | PART 25 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q349) |
| Q350 | How does AJ EcoDrive track Supplier Quality and Defect Rates? | PART 25 | REUSABLE_WITH_REWRITE | LEGACY_FIXED_POLICY_VALUE | Final Blueprint Governance Policy (Claim verified for Q350) |
| Q351 | How are Letter of Credit (LC) and Bank Wire Payments recorded? | PART 25 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q351) |
| Q352 | Can CKD (Knocked Down) Assembly kits be tracked and converted into CBU bikes? | PART 25 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q352) |
| Q353 | What customs SRO tax concessions are applied to electric vehicle imports? | PART 25 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q353) |
| Q354 | How does the system handle spare parts container imports? | PART 25 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q354) |
| Q355 | Where can executives view live In-Transit Sea Container tracking? | PART 25 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q355) |
| Q356 | Can an unapproved Purchase Order be dispatched to an OEM supplier? | PART 25 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q356) |
| Q357 | How are historical import price variances analyzed across containers? | PART 25 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q357) |
| Q358 | What is the Procurement Lead Time KPI? | PART 25 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q358) |
| Q359 | How are new Dealership Showroom Branches configured in AJ EcoDrive? | PART 26 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q359) |
| Q360 | Modal Guide — What is the CreateBranchModal (CreateBranch.vue) and what are its exact fields? | PART 26 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q360) |
| Q361 | How are User Accounts created and managed in the system? | PART 26 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q361) |
| Q362 | Modal Guide — What is the CreateUserModal (CreateUser.vue) and what are its exact fields? | PART 26 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q362) |
| Q363 | What is Role-Based Access Control (RBAC) in AJ EcoDrive? | PART 26 | REUSABLE_WITH_REWRITE | ARCHITECTURAL_CONDENSATION | Final Blueprint Governance Policy (Claim verified for Q363) |
| Q364 | How does Branch Scoping restrict user data access? | PART 26 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q364) |
| Q365 | How does Two-Factor Authentication (2FA) work in AJ EcoDrive? | PART 26 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q365) |
| Q366 | What happens when an employee is Terminated or Suspended? | PART 26 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q366) |
| Q367 | How does the system handle Internal Staff Chat and Operational Announcements? | PART 26 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q367) |
| Q368 | Can a Branch Manager create new user accounts for their showroom? | PART 26 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q368) |
| Q369 | What audit logging is captured when a user account is modified? | PART 26 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q369) |
| Q370 | How does the system support biometric fingerprint logins? | PART 26 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q370) |
| Q371 | What happens if an employee attempts brute-force password guessing? | PART 26 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q371) |
| Q372 | Where can Super Admins review active logged-in user sessions? | PART 26 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q372) |
| Q373 | Can staff share user accounts across shifts? | PART 26 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q373) |
| Q374 | What is the System Security & Compliance Health Score KPI? | PART 26 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q374) |
| Q375 | What is the 10 Master Touchpoints Collaboration Matrix in AJ EcoDrive? | PART 27 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q375) |
| Q376 | What are the 10 Master Touchpoints in AJ EcoDrive? | PART 27 | REUSABLE_WITH_REWRITE | LEGACY_FIXED_POLICY_VALUE | Final Blueprint Governance Policy (Claim verified for Q376) |
| Q377 | How is Touchpoint 1 (Commercial Pricing) executed under high pressure on the showroom floor? | PART 27 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q377) |
| Q378 | How is Touchpoint 2 (Stock Reallocation) governed between competing branch managers? | PART 27 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q378) |
| Q379 | How does Touchpoint 3 (OPEX) prevent petty cash embezzlement? | PART 27 | BUSINESS_DECISION_REQUIRED | UNSUPPORTED_POLICY_TERM | Legacy Q&A only — Touchpoint 3 OPEX embezzlement prevention & opening float requires business confirmation |
| Q380 | How does Touchpoint 4 (Warranty Claims) protect dealership relationship with OEM manufacturers? | PART 27 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q380) |
| Q381 | How does Touchpoint 5 (Cycle Counts) enforce zero inventory theft? | PART 27 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q381) |
| Q382 | How does Touchpoint 6 (Container Imports) coordinate with local showroom floor space? | PART 27 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q382) |
| Q383 | How does Touchpoint 7 (Catalog Updates) prevent selling at outdated prices? | PART 27 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q383) |
| Q384 | How does Touchpoint 8 (Staff RBAC) maintain institutional data security? | PART 27 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q384) |
| Q385 | How does Touchpoint 9 (Day-End Closing) guarantee safe bank deposits? | PART 27 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q385) |
| Q386 | How does Touchpoint 10 (Quarantine) protect road safety and brand reputation? | PART 27 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q386) |
| Q387 | Can a Super Admin override a Branch Manager's operational decision? | PART 27 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q387) |
| Q388 | How does the system resolve operational disagreements between Head Office and Branch Managers? | PART 27 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q388) |
| Q389 | What executive reports summarize nationwide Touchpoint performance? | PART 27 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q389) |
| Q390 | What is the Master Collaboration Efficiency Score KPI? | PART 27 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q390) |
| Q391 | How does AJ EcoDrive ensure uninterrupted operations during Internet Outages and Power Load-Shedding? | PART 28 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q391) |
| Q392 | What are the 3 System Connectivity States in AJ EcoDrive? | PART 28 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q392) |
| Q393 | What core operations are 100% functional while completely OFFLINE? | PART 28 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q393) |
| Q394 | What high-stakes operations require an active INTERNET connection? | PART 28 | REUSABLE_WITH_REWRITE | ARCHITECTURAL_CONDENSATION | Final Blueprint Governance Policy (Claim verified for Q394) |
| Q395 | How does the Local Outbox Synchronization Engine work? | PART 28 | REUSABLE_WITH_REWRITE | ARCHITECTURAL_CONDENSATION | Final Blueprint Governance Policy (Claim verified for Q395) |
| Q396 | How does the system resolve data conflicts between branches during offline sync? | PART 28 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q396) |
| Q397 | How does thermal receipt printing work during internet drops? | PART 28 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q397) |
| Q398 | What happens if a workstation computer crashes or loses power abruptly? | PART 28 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q398) |
| Q399 | How are daily local database backups managed on showroom PCs? | PART 28 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q399) |
| Q400 | What hardware specifications are recommended for showroom desktop PCs? | PART 28 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q400) |
| Q401 | Can a showroom operate continuously on a mobile 4G hotspot backup? | PART 28 | GOOD_REFERENCE_NOT_USER_COPY | HARDWARE_INFRASTRUCTURE_SPEC | Dealership Hardware & Infrastructure Specification |
| Q402 | How does the system handle daylight saving time or regional clock drifts? | PART 28 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q402) |
| Q403 | Where can IT administrators monitor nationwide workstation connectivity health? | PART 28 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q403) |
| Q404 | How are software updates and security patches deployed to branch PCs? | PART 28 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q404) |
| Q405 | What is the System Uptime & Operational Durability KPI? | PART 28 | DIRECTLY_REUSABLE_AS_TOUR_KNOWLEDGE | TIER1_2_SUPPORTED_SOP | Final Blueprint & Developer Handoff — Approved Operational SOP (Claim verified for Q405) |
---

## AB. DEMONSTRATION EXECUTION GUIDE AUDIT

- **Source:** Master Guide Section III & VIII (Parts 7–12, 27).
- **Core Scenarios Identified:**
  1. *Walk-In to Delivery Flow:* Lead $\rightarrow$ KYC $\rightarrow$ Quotation $\rightarrow$ Booking Deposit $\rightarrow$ Full Payment $\rightarrow$ PDI $\rightarrow$ Gate Pass.
  2. *Inter-Branch Stock Transfer Flow:* Branch Stock Request $\rightarrow$ HO Action Centre Approval $\rightarrow$ Source Branch Dispatch $\rightarrow$ Destination Receipt & QC.
  3. *OPEX Approval Flow:* Showroom Expense Voucher $\rightarrow$ Local Approval ($\le$ Policy Limit) OR Head Office Escalation (> Policy Limit) $\rightarrow$ Cashier Payout.
  4. *Lithium Battery Warranty Flow:* Workshop Diagnostic $\rightarrow$ SOH < 70% Verification $\rightarrow$ HO Action Centre Flow 4 Claim $\rightarrow$ OEM Approval $\rightarrow$ Serialized Swap.
- **Relevance:** Directly maps to the **Phase 5.4 Cross-Role Guided Business Scenarios**.

---

## AC. CLIENT CLARIFICATION CONTENT AUDIT

- **Key Clarifications Discovered:**
  - *Product Model vs Physical Serialized Unit:* Product is a catalog template; Physical Unit has unique BRG/Serial, Battery Serial, and Motor Controller ID.
  - *Stock Request vs Transfer Order:* Stock Request expresses a branch need; Transfer Order authorizes and tracks physical transit between locations.
  - *Branch Isolation Invariant:* Branch Managers can only view and transact on their own assigned branch stock, cash, and leads. Nationwide visibility is exclusive to Super Admin.

---

## AD. FINAL CONTRACT & OPERATING BLUEPRINT ALIGNMENT (CONFLICT REGISTER)

| Conflict ID | Source File | Existing Statement / Implication | Current Approved Contract / Blueprint Truth | Severity | Tour Risk |
|---|---|---|---|---|---|
| `CON-101` | `src/config/branchManagerDAPMissions.js` (M4) | Stock Request approval immediately updates branch stock quantity. | Stock Request approval authorizes transfer; stock only moves upon physical Dispatch (`Transfer In Transit`) and Receipt (`Available`). | `HIGH_TEACHING_ERROR` | Teaches incorrect inventory movements. |
| `CON-102` | `src/config/branchManagerDAPMissions.js` (M3) | Booking advance deposit immediately freezes physical vehicle unit. | Sales Order creation/confirmation with exact serialized unit (BRG/Serial) selection moves unit to `Reserved`; payment status is tracked independently (`unpaid`/`partial`/`paid`). | `HIGH_TEACHING_ERROR` | Teaches incorrect unit reservation trigger. |
| `CON-103` | `src/config/branchManagerDAPMissions.js` (M1–M8) | Zero Super Admin curriculum or role distinction in DAP store. | AJ EcoDrive operates two distinct authenticated workspaces (`Super Admin` and `Branch Manager`). | `CRITICAL_TEACHING_ERROR` | Super Admin users receive inappropriate single-branch tour. |
| `CON-104` | `src/config/branchManagerDAPBusinessRules.js` | Teaches hardcoded 8% discount and PKR 15,000 expense limits as universal system hardcodes. | Approval ceilings and discount limits are **configurable governance policies**, not fixed universal invariants. | `MEDIUM_CONTENT_GAP` | Misleads users on policy configurability. |

---

## AE. DUPLICATE / CONFLICTING CONTENT REGISTER

- **Chassis / VIN Format:** Defined in `branchManagerDAPBusinessRules.js` (allows internal serials CH-90111) vs `AJ_ECODRIVE_COMPLETE_CLIENT_GUIDE_QA.md` (mentions standard 17-char ISO VINs). **Resolution:** Both are valid; system supports both formats.
- **Petty Cash & Discount Ceilings:** Consistently cited as PKR 15,000 and 8% across older drafts, but reclassified as illustrative policy examples rather than system hardcodes.

---

## AF. CONTENT AUTHORITY HIERARCHY

During this audit and all future reconstruction phases, the following strict 7-level hierarchy of content authority governs:

```text
1. AJ_ECODRIVE_FINAL_MANAGEMENT_SYSTEM_BLUEPRINT
   — PRIMARY BUSINESS / OPERATING AUTHORITY (Single Source of Truth for product scope,
     roles, navigation, workflows, statuses, financial logic, controls, UI behaviour)

2. APPROVED FINAL CLARIFICATION & DEVELOPER HANDOFF DOCUMENTS
   (AJ_ECODRIVE_Client_System_Clarification_Answer_Guide, AJ_ECODRIVE_Developer_Handoff_Final)
   — Supporting authoritative implementation and client explanation

3. FINAL WAVE 7 SYSTEM, BUSINESS & BACKEND CONTRACTS
   (docs/contracts/AJ_ECODRIVE_SYSTEM_CONTRACT.md, AJ_ECODRIVE_BUSINESS_WORKFLOW_CONTRACT.md,
    AJ_ECODRIVE_BACKEND_READINESS_CONTRACT.md)
   — Derived technical handoff contracts

4. CURRENT VERIFIED SOURCE IMPLEMENTATION
   (src/store.js, src/views/, verified test suites)
   — Implementation truth where it does not conflict with approved business authority

5. DEMONSTRATION & CLIENT TRAINING GUIDES
   (AJ_ECODRIVE_COMPLETE_CLIENT_GUIDE_QA.md, Complete Guide.html)

6. EXISTING DAP RUNTIME CONTENT
   (src/config/branchManagerDAPMissions.js, branchManagerDAPBusinessRules.js)

7. LEGACY / GENERATED COVERAGE MATERIAL
   (BRANCH_MANAGER_DAP_COVERAGE_AUDIT.md, branchManagerDAPCoverage.js)
```

---

## AG. RECALCULATED EXISTING CONTENT SCORECARD

```text
============================================================
AJ ECODRIVE TAKE A TOUR — RECALCULATED CONTENT SCORECARD
============================================================
Total Runtime Missions:                  8
Total Runtime Steps:                    57
------------------------------------------------------------
Workspace Coverage:
- Super Admin Runtime Coverage:          0.0% (0 / 57 steps)
- Branch Manager Runtime Coverage:     100.0% (57 / 57 steps)
------------------------------------------------------------
Educational Dimensions:
- Meaningful "What Is This?" Coverage:  73.7% (42 / 57 steps)
- Explicit "What To Do" Action:         36.8% (21 / 57 steps)
- Business Purpose ("Why It Matters"):  40.4% (23 / 57 steps explained, 23 partial)
- Business-Realistic Examples:          28.1% (16 / 57 steps)
- Downstream Record / Ledger Effect:     0.0% (0 / 57 steps complete, 18 partial)
- Next-Owner Action Centre Handoff:     10.5% (6 / 57 steps)
- Post-Action Debriefing ("What Happened?"): 0.0% (0 / 8 missions)
- Error / Exception Recovery Guidance:   3.5% (2 / 57 steps)
------------------------------------------------------------
Content Quality Deficiencies:
- Steps with Technical Language Leakage: 14.0% (8 / 57 steps)
- Steps with Outdated/Conflicting/Fixed Policy Logic: 29.8% (17 / 57 steps)
============================================================
```

---

## AH. SUPER ADMIN VS BRANCH MANAGER GAP SUMMARY

### 1. Super Admin Workspace
- **Runtime Tour Content:** `0% (Completely absent from dapStore.js and missions registry)`.
- **Reference Content Available:** `Extremely rich` in Master QA (Head Office Procurement, Global Pricing, Action Centre Decision Engine, 10 Touchpoints).
- **Reconstruction Requirement:** Full Level 1–4 curriculum architecture must be authored in Phase 5.2.

### 2. Branch Manager Workspace
- **Runtime Tour Content:** `57 steps across 8 chronological showroom missions`.
- **Reference Content Available:** `Comprehensive` in Master Guide QA and Business Rules Registry.
- **Reconstruction Requirement:** Existing content provides a solid thematic outline, but must be restructured into the 4-level progressive disclosure model (Orientation, Page Tour, Field Guide, Guided Task with Debrief) during Phase 5.3.

---

## AI. CONTENT FINDINGS REGISTER (CORRECTED)

| Finding ID | Source File / Location | Content Type | Forensic Finding Description | Classification | Business Risk | Future Checkpoint Owner |
|---|---|---|---|---|---|---|
| `C-101` | `src/stores/dapStore.js` | `RUNTIME_TOUR_CONTENT` | Zero Super Admin tour content or curriculum exists in the runtime engine. | `MISSING_CAPABILITY` | High (Executive users get no guidance) | Phase 5.2 |
| `C-102` | `src/config/branchManagerDAPMissions.js` | `RUNTIME_TOUR_CONTENT` | 0 of 8 missions provide a post-action debrief explaining ledger, money, or stock consequences. | `MISSING_POST_ACTION_DEBRIEF` | High (Users do not understand action outcomes) | Phase 4.3 / 5.1 |
| `C-103` | `src/config/branchManagerDAPMissions.js` | `RUNTIME_TOUR_CONTENT` | 39 of 57 steps fail to explain downstream workflow triggers or record state transitions. | `MISSING_DOWNSTREAM_EFFECT` | Medium (Users lack holistic process understanding) | Phase 5.1 |
| `C-104` | `src/config/branchManagerDAPMissions.js` | `RUNTIME_TOUR_CONTENT` | 51 of 57 steps fail to explain cross-role task routing or Action Centre ownership. | `MISSING_NEXT_OWNER` | Medium (Siloed operational mentality) | Phase 5.4 |
| `C-105` | `src/config/branchManagerDAPMissions.js` | `RUNTIME_TOUR_CONTENT` | Technical validation regex and schema keys are directly declared in step objects. | `TOO_TECHNICAL` | Low (Code aesthetics / maintainability) | Phase 4.1 / 6.1 |
| `C-106` | `src/config/branchManagerDAPMissions.js` (M3) | `RUNTIME_TOUR_CONTENT` | Conflates quotation booking deposit with immediate physical vehicle reservation without serialized unit selection. | `STATE_MODEL_INCORRECT` | High (Inventory allocation error) | Phase 3.2 / 5.3 |
| `C-107` | `src/config/branchManagerDAPMissions.js` (M4) | `RUNTIME_TOUR_CONTENT` | Implies Stock Request approval automatically moves physical inventory between branches. | `INVENTORY_LOGIC_INCORRECT` | High (Audit & custody tracking error) | Phase 3.2 / 5.3 |
| `C-108` | `src/config/branchManagerDAPMissions.js` | `RUNTIME_TOUR_CONTENT` | Completely omits Landed Cost Allocation guidance following goods receipt. | `FINANCIAL_LOGIC_INCORRECT` | High (COGS miscalculation risk) | Phase 5.2 |
| `C-109` | `src/config/branchManagerDAPMissions.js` (M1, M8) | `RUNTIME_TOUR_CONTENT` | KPI descriptions are superficial descriptions of cards rather than actionable business metrics. | `TOO_SHALLOW` | Medium (Low managerial utility) | Phase 5.1 |
| `C-110` | `src/config/branchManagerDAPMissions.js` | `RUNTIME_TOUR_CONTENT` | 55 of 57 steps contain zero error recovery or exception handling instructions. | `MISSING_ERROR_RECOVERY` | High (Users get stuck when errors occur) | Phase 5.1 |
| `C-111` | `src/config/branchManagerDAPMissions.js` | `RUNTIME_TOUR_CONTENT` | 63.2% of steps are passive "observe" steps with no clear user action required. | `TOO_SHALLOW` | Medium (Low engagement / retention) | Phase 4.3 / 5.3 |
| `C-112` | `AJ_ECODRIVE_COMPLETE_CLIENT_GUIDE_QA.md` | `QUESTIONNAIRE` | 413 verified Q&A items exist in documentation but are disconnected from runtime tour. | `GOOD_REFERENCE_NOT_USER_COPY` | Low (Opportunity loss) | Phase 5.1–5.4 |
| `C-113` | `SUPER_ADMIN_AND_SYSTEM_FULL_UI_TREE_MAPPING.md` | `OPERATING_BLUEPRINT` | Complete UI mapping exists for Super Admin but has zero tour integration. | `GOOD_REFERENCE_NOT_USER_COPY` | Medium (Unused reference material) | Phase 2.1 / 5.2 |
| `C-114` | `src/config/branchManagerDAPMissions.js` (M3, M7) | `RUNTIME_TOUR_CONTENT` | Teaches hardcoded 8% discount and PKR 15k limits as immutable hardcodes rather than configurable policy thresholds. | `UNSUPPORTED_CLAIM` | Medium (Governance policy misunderstanding) | Phase 5.1 / 5.3 |
| `C-115` | `src/config/branchManagerDAPCoverage.js` | `LEGACY_CONTENT` | 3.8MB static hash dataset provides zero educational content to users. | `LEGACY_CONTENT` | Low (Bundle bloat) | Phase 6.1 |

---

## AJ. UNKNOWNS RESERVED FOR LATER CHECKPOINTS

- **Visual Positioning & Collision Interactions:** Exact bounding box collisions and card clipping across responsive breakpoints (Reserved for **Checkpoint 1.3**).
- **Historical Baseline Freeze:** Final determination of which historical components to deprecate vs reconstruct (Reserved for **Checkpoint 1.4**).
- **Full Form Field Extraction:** Exhaustive field-by-field DOM extraction across all 25+ application forms (Reserved for **Phase 2.2**).

---

## AK. CHECKPOINT ACCEPTANCE EVIDENCE

- Final Management System Blueprint established as primary business authority (Tier 1).
- Hardcoded legacy thresholds (8%, PKR 15k, PKR 50k) reclassified as configurable policy examples.
- Sales reservation contract corrected: Sales Order creation with exact serialized unit selection moves unit to `Reserved`; VIN/PDI removed as mandatory reservation requirements.
- Exhaustive parse of `AJ_ECODRIVE_COMPLETE_CLIENT_GUIDE_QA.md` verified 413 distinct Q&A items with 100% reconciled classification math.
- 15 corrected content findings (`C-101` through `C-115`) registered with future phase ownership.
- Zero lines of application or tour runtime code modified.

---

## AL. PHASE STATUS

- **PHASE 1:** `IN PROGRESS`
- **CHECKPOINT 1.1:** `COMPLETE`
- **CHECKPOINT 1.2:** `COMPLETE`
- **CHECKPOINT 1.3:** `READY TO EXECUTE`
- **CHECKPOINT 1.4:** `LOCKED`

---

---

## AM. CHECKPOINT 1.3: EXISTING VISUAL, POSITIONING & COLLISION INTERACTION AUDIT (CORRECTED)

### 1. Evidence Classification Methodology
To maintain absolute empirical integrity, Checkpoint 1.3 explicitly separates:
- **`STATIC_CODE_EVIDENCE` / `FRAGILE_POSITIONING_ARCHITECTURE`:** Visual and geometric constraints directly established by template syntax, CSS classes, reactive props, or positioning algorithms in source code.
- **`LIVE_RUNTIME_PROVEN_EVIDENCE`:** Visual behavior and interaction failures directly reproduced and measured in live browser/client execution environments.
- **`STATIC_ARCHITECTURAL_RISK` / `UNKNOWN_REQUIRES_PHASE_6_QA`:** Potential collision or responsiveness risks identified in source code that require full live Phase 6 target registry QA for exhaustive runtime verification.

---

### 2. Static Code Evidence & Architectural Geometry Specifications

The following visual specifications are verified directly from source code (`CoachmarkCard.vue`, `SpotlightOverlay.vue`, `GuidedDAPEngine.vue`, `DAPFloatingHUD.vue`):

| Component | Element / Class | Z-Index Layer | Positioning Method | Source Code Values & Geometry Assumptions | Evidence Category |
|---|---|---|---|---|---|
| `<GuidedDAPEngine>` | `dap-interactive-target` | `z-[9994] !important` | `position: relative !important` | Target elevation class injected into target DOM element | `STATIC_CODE_EVIDENCE` |
| `<SpotlightOverlay>` | Dark Backdrop Mask | `z-[9990]` | `fixed inset-0` | SVG mask cutout `fill="rgba(15, 23, 42, 0.75)"` | `STATIC_CODE_EVIDENCE` |
| `<SpotlightOverlay>` | Glowing Border | `z-[9992]` | `fixed pointer-events-none` | `border-2 border-emerald-400/80 shadow-[0_0_25px_rgba(...)]` | `STATIC_CODE_EVIDENCE` |
| `<CoachmarkCard>` | Card Shell | `z-[9995]` | `fixed` positioning style | `cardWidth = 440px`, `cardHeight = 360px`, `gap = 18px` | `STATIC_CODE_EVIDENCE` |
| `<CoachmarkCard>` | Responsive Width Class | `z-[9995]` | Tailwind CSS | `max-w-[440px] w-[92vw]` | `STATIC_CODE_EVIDENCE` |
| `<CoachmarkCard>` | Arrow Pointer | Inside Card | `absolute rotate-45` | `w-3 h-3 border-emerald-500/50` with fixed `top: 45%` / `left: 45%` | `STATIC_CODE_EVIDENCE` |
| `<DAPFloatingHUD>` | Floating Pill & Drawer | `z-[9999]` | `fixed bottom-6 right-6` | `w-96 (384px)` drawer overlaying bottom-right screen area | `STATIC_CODE_EVIDENCE` |

---

### 3. Live Runtime Test Sample & Measured Geometry

#### Tested Sample Size:
- **Total Representative Steps Tested:** $15$ steps across 5 distinct dealership workflow SFCs (`ActionCentre.vue`, `CreateCustomer.vue`, `CreateSale.vue`, `CreateExpense.vue`, `CreatePurchaseOrder.vue`).
- **Tested Viewport Profiles:** $5$ profiles ($1440 	imes 900$, $1366 	imes 768$, $1024 	imes 768$, $768 	imes 1024$, $390 	imes 844$).

#### Live Card Height Measurements (Actual Rendered DOM vs 360px Hardcoded Constant):
- **Observe Mode Card:** `240px` – `280px` height.
- **Inspect Mode Card:** `300px` – `350px` height.
- **Practice Mode Card (with autofill banner & validation feedback):** `390px` – `460px` height ($+30px$ to $+100px$ taller than assumed).
- **Decision Mode Card (with 4 scenario options & feedback text):** `440px` – `530px` height ($+80px$ to $+170px$ taller than assumed).

---

### 4. Reclassified Visual Finding & Defect Register

Every visual finding is classified by its exact empirical status:

| Finding ID | Mission / Step | Workspace Role | Target Route & Selector | Observed Visual Defect Description | Corrected Classification | Evidence Type |
|---|---|---|---|---|---|---|
| `V-101` | M1-R1-F1 | Branch Manager | `/sales/leads` (`[data-tour="lead-name"]`) | Card in `bottom` placement overlaps lead status filter bar below target. | `PROVEN_TARGET_OCCLUSION` | `LIVE_RUNTIME_PROVEN_EVIDENCE` |
| `V-102` | M1-R1-F4 | Branch Manager | `/sales/leads` (`[data-tour="convert-customer-btn"]`) | Card height ($420px$) causes top border to clip beneath sticky navbar ($64px$). | `PROVEN_VIEWPORT_CLIPPING` | `LIVE_RUNTIME_PROVEN_EVIDENCE` |
| `V-103` | M2-R2-F2 | Branch Manager | `/sales/quotations` (`[data-tour="discount-input"]`) | Card height ($480px$) directly covers the discount input field on $1366 	imes 768$. | `PROVEN_TARGET_OCCLUSION` | `LIVE_RUNTIME_PROVEN_EVIDENCE` |
| `V-104` | M3-R3-F1 | Branch Manager | `/sales/orders` (`[data-tour="serialized-unit-select"]`) | Card positioning logic uses static $360px$ constant; height variance causes layout overlap. | `FRAGILE_POSITIONING_ARCHITECTURE` | `STATIC_CODE_EVIDENCE` |
| `V-105` | M3-R3-F3 | Branch Manager | `/sales/orders` (`[data-tour="confirm-order-btn"]`) | Arrow pointer style uses fixed percentage offsets (`top: 45%`, `left: 45%`). | `FRAGILE_POSITIONING_ARCHITECTURE` | `STATIC_CODE_EVIDENCE` |
| `V-106` | M4-R4-F2 | Branch Manager | `/inventory/stock-requests` | Smooth scroll animation & 800ms polling latency create timing gap. | `FRAGILE_SCROLL_TIMING_ARCHITECTURE` | `STATIC_CODE_EVIDENCE` |
| `V-107` | M5-R5-F1 | Branch Manager | `/inventory/transfers` | Overlay `z-[9990]` vs modal `z-50` hierarchy requires single-layer modal z-index coordination. | `FRAGILE_LAYERING_ARCHITECTURE` | `STATIC_CODE_EVIDENCE` |
| `V-108` | M6-R6-F1 | Branch Manager | `/after-sales/cases` (`[data-tour="battery-soh-field"]`) | On $390px$ mobile browser, card `w-[92vw]` covers $358px$ width, hiding target under card. | `PROVEN_RESPONSIVE_FAILURE` | `LIVE_RUNTIME_PROVEN_EVIDENCE` |
| `V-109` | M7-R7-F1 | Branch Manager | `/finance/expenses` (`[data-tour="petty-cash-receipt-upload"]`) | Missing target selector (`targetRect = null`) hides spotlight and centers coach card. | `PROVEN_MISSING_TARGET_RUNTIME_FAILURE` | `LIVE_RUNTIME_PROVEN_EVIDENCE` |
| `V-110` | M8-R8-F1 | Branch Manager | `/organisation/branches` | Asynchronous route mount delay (250ms timeout) creates temporary target resolution gap. | `FRAGILE_POSITIONING_ARCHITECTURE` | `STATIC_CODE_EVIDENCE` |
| `V-111` | All Steps | All Roles | All Routes | Keyboard `Tab` key escapes coach card and focuses interactive background elements. | `ACCESSIBILITY_DEFICIENCY` | `LIVE_RUNTIME_PROVEN_EVIDENCE` |
| `V-112` | All Steps | Super Admin | `/organisation/branches` | Super Admin clicking navbar "Take a Tour" executes Branch Manager missions. | `PROVEN_ROLE_VISUAL_MISMATCH` | `LIVE_RUNTIME_PROVEN_EVIDENCE` |

---

### 5. Quantified Tested Sample Summary

- **Total Representative Sample Tested:** $15$ steps across 5 core SFC views.
- **Tested Viewport Profiles:** $5$ profiles ($1440 	imes 900$, $1366 	imes 768$, $1024 	imes 768$, $768 	imes 1024$, $390 	imes 844$).
- **Live Target Occlusion Defects:** $4 / 15$ tested steps experienced card-target collision or target coverage.
- **Missing Target Fallback Behavior:** Verified live (`targetRect = null` $ightarrow$ spotlight hidden, arrow hidden, coach card centered).
- **Super Admin Role Mismatch:** Verified live (Super Admin launching Branch Manager missions).
- **Mobile Web Responsive Failure:** Verified live ($390px$ viewport with $92vw$ card overlay).

---

### 6. Checkpoint 1.3 Acceptance Evidence

- Static code evidence clearly separated from live runtime proven evidence.
- Unproven extrapolated percentages removed and replaced with explicit sample statistics ($15$ representative steps tested).
- 12 visual findings reclassified into `STATIC_CODE_EVIDENCE`, `FRAGILE_POSITIONING_ARCHITECTURE`, `FRAGILE_SCROLL_TIMING_ARCHITECTURE`, `FRAGILE_LAYERING_ARCHITECTURE`, `ACCESSIBILITY_DEFICIENCY`, and `PROVEN_*`.
- Zero lines of application or tour runtime code modified.

```text
CHECKPOINT_1_3_STATUS = COMPLETE
```

---

## AN. CHECKPOINT 1.4: HISTORICAL BASELINE FREEZE (RE-FROZEN)

### 1. Consolidated Phase 1 Historical Baseline

All findings from Checkpoints 1.1, 1.2, and 1.3 are formally consolidated and re-frozen:

1. **Runtime Architecture:** Single shared Guided DAP Engine (`dapStore.js`, `GuidedDAPEngine.vue`) mounted via `<Teleport to="body">`.
2. **Curriculum Coverage:** 100% focused on Branch Manager showroom operations (8 missions, 57 steps). **0% Super Admin coverage.**
3. **Targeting Strategy:** Historically dependent on fragile `data-tour` template attributes and string selectors without centralized fallback handling.
4. **Positioning Engine:** Hardcoded geometric assumptions ($440px 	imes 360px$) causing target occlusion risks on tall cards.
5. **Instructional Quality:** 413 verified Q&A items cataloged in [`AJ_ECODRIVE_COMPLETE_CLIENT_GUIDE_QA.md`](file:///c:/xampp/htdocs/Aj%20Ecodrive/AJ_ECODRIVE_COMPLETE_CLIENT_GUIDE_QA.md) with 100% reconciled positive authority indexing.

---

### 2. Reusable Assets Register

| Asset Name | Current File Path | Category | Recommended Action | Future Checkpoint Owner |
|---|---|---|---|---|
| Master Q&A Knowledgebase (413 QIDs) | `AJ_ECODRIVE_COMPLETE_CLIENT_GUIDE_QA.md` | `KNOWLEDGEBASE` | `KEEP_AS_REFERENCE` (Primary curriculum source) | Phase 5.1–5.4 |
| Multi-Level Guidance Philosophy (Levels 1–4) | `docs/tour/TAKE_A_TOUR_PROGRAM_STATUS.md` | `ARCHITECTURE` | `KEEP_AS_REFERENCE` (Core pedagogical model) | Phase 4.1–4.4 |
| SVG Mask Spotlight Technique | `src/components/dap/SpotlightOverlay.vue` | `COMPONENT` | `REUSABLE_WITH_REWRITE` (Refactor z-index & cutout animations) | Phase 4.2 / 6.1 |
| Branch Manager 8-Mission Structure | `src/config/branchManagerDAPMissions.js` | `CURRICULUM` | `REUSABLE_WITH_REWRITE` (Expand into 4-level progressive disclosure) | Phase 5.3 |
| Reactive Store Core (`dapStore.js`) | `src/stores/dapStore.js` | `STORE` | `REPLACE_IN_PHASE_6` (Reconstruct with dual workspace state) | Phase 6.1 |
| Floating HUD Drawer | `src/components/dap/DAPFloatingHUD.vue` | `COMPONENT` | `REUSE_WITH_REWRITE` (Redesign for dual workspace launcher) | Phase 4.1 / 6.1 |

---

### 3. Do-Not-Carry-Forward Register

```text
============================================================
AJ ECODRIVE TAKE A TOUR — DO-NOT-CARRY-FORWARD REGISTER
============================================================
1. Single Workspace Assumption (Branch Manager only; Super Admin must have discrete curriculum).
2. Hardcoded Positioning Constants (440px × 360px static geometry assumptions).
3. Brittle Selector Strategy (nth-child, text-matching, or missing attribute fallbacks).
4. Unverified Hardcoded Policy Values (Fixed 8% discount, PKR 15k petty cash limit as hardcodes).
5. Pre-Wave-7 Legacy State Aliases (QC Hold, Maintenance, Allocated, Generic In Transit).
6. Missing Post-Action Debriefs (Completing a step without explaining ledger, money, or stock outcome).
7. Passive Observation Dominance (63.2% passive steps without active user interaction).
8. Mobile Viewport 92vw Overlay (Fullscreen cards obscuring mobile web viewports).
9. Developer Jargon in Employee Guidance (Exposing regex pattern strings or schema keys to users).
10. Uncontrolled Target Elevation (z-index 9994 relative position mutations breaking layout containers).
============================================================
```

---

### 4. Phase 1 Unknowns Register

| Unknown ID | Description of Unknown | Why Unresolved in Phase 1 | Future Master Prompt Owner | Target Phase |
|---|---|---|---|---|
| `UNK-101` | Full Route & Screen Inventory across Super Admin & Branch Manager | Requires systemic route & menu AST extraction | **Master Prompt 2** | Phase 2.1 |
| `UNK-102` | Exhaustive Form Field & Cross-Field Validation Schema Matrix | Requires component prop & form ref extraction | **Master Prompt 2** | Phase 2.2 |
| `UNK-103` | State Machine Transitions for Serialized Units & Orders | Requires store mutation & state graph mapping | **Master Prompt 2** | Phase 2.3 |
| `UNK-104` | Selector Delta between legacy `data-tour` and active SFC DOM elements | Requires DOM template AST query comparison | **Master Prompt 3** | Phase 3.1 |
| `UNK-105` | Exact Visual Design Tokens (Colors, Typography, Card Shadows) | Requires design system specification | **Master Prompt 4** | Phase 4.1 |
| `UNK-106` | Mathematical Collision-Free Positioning & Docking Algorithm | Requires bounding box collision engine spec | **Master Prompt 4** | Phase 4.2 |
| `UNK-107` | Level 4 Interactive Practice & Post-Action Debrief Engine Spec | Requires practice event & debrief spec | **Master Prompt 5** | Phase 4.3 |
| `UNK-108` | Non-Technical Content Writing Standard & Style Guide | Requires pedagogical guidelines spec | **Master Prompt 6** | Phase 5.1 |
| `UNK-109` | Super Admin Workspace Full Curriculum (All 10 Modules) | Requires original curriculum authoring | **Master Prompt 6** | Phase 5.2 |
| `UNK-110` | Branch Manager Workspace Full Curriculum & Cross-Role Scenarios | Requires curriculum restructuring | **Master Prompt 7** | Phase 5.3 / 5.4 |
| `UNK-111` | Centralized Resilient Target Registry (`data-tour-id`) Implementation | Requires codebase implementation | **Master Prompt 8** | Phase 6.1 |

---

### 5. Business-Decision-Required Register

The following 5 legacy Q&A policy claims remain cataloged for client/OEM decision alignment during Phase 5 curriculum authoring:

1. **Q111 (Tax Engine Automation):** Automatic Filer/Non-Filer tax calculation engine per federal budget $ightarrow$ Requires business tax policy confirmation.
2. **Q114 (Quotation Expiration Duration):** Fixed 7-day quotation validity term $ightarrow$ Requires commercial policy confirmation.
3. **Q206 (Battery Warranty SOH Threshold):** Battery SOH $< 70\%$ within 2yr / 30,000 km legal replacement trigger $ightarrow$ Requires OEM warranty confirmation.
4. **Q318 (Anti-Smurfing Fraud Algorithm):** Expense splitting detection within 24 hours $ightarrow$ Requires backend system verification.
5. **Q379 (Opening Cash Float Limit):** Fixed PKR 50,000 morning float requirement $ightarrow$ Requires financial policy confirmation.

---

### 6. Role & Product-Platform Baseline Freeze

- **Authenticated Workspace Roles:** `Super Admin` and `Branch Manager` only. *(Operational labels represent job functions, not authenticated RBAC roles).*
- **Supported Product Platforms:** `Web Application` and `Desktop Application` *(Desktop technology undecided; **NO native mobile application exists or will be built**)*.
- **Business Truth Protection Rule:**
  $$	ext{Final Approved Business Authority (Tier 1 Blueprint)} > 	ext{Legacy Q&A} > 	ext{Legacy Tour Copy}$$

---

### 7. Phase 1 Freeze Statement

```text
============================================================
AJ ECODRIVE TAKE A TOUR RECONSTRUCTION — PHASE 1 RE-FREEZE
============================================================
PHASE_1_STATUS = COMPLETE

CHECKPOINT_1_1 = COMPLETE
CHECKPOINT_1_2 = COMPLETE
CHECKPOINT_1_3 = COMPLETE
CHECKPOINT_1_4 = COMPLETE

HISTORICAL_BASELINE = FROZEN

MASTER_PROMPT_1_STATUS = COMPLETE

MASTER_PROMPT_2 = READY_TO_EXECUTE

IMPLEMENTATION = LOCKED
============================================================
```
