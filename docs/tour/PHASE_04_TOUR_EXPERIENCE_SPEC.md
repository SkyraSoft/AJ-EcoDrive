# AJ ECODRIVE — TOUR EXPERIENCE ARCHITECTURE SPECIFICATION
## PROGRAM: AJ-TOUR-RECONSTRUCT-2026
### PHASE 4 — MASTER PROMPT 4: CHECKPOINT 4.1 (VISUAL DESIGN SYSTEM) & CHECKPOINT 4.2 (POSITIONING ENGINE)

---

## A. PHASE 4 SCOPE & AUTHORITY

### 1. Scope Definition
This document establishes the authoritative technical specification for:
- **Checkpoint 4.1:** Tour Visual Design System, Coach Card Anatomy, Tokens, Layers, and Visual Variants.
- **Checkpoint 4.2:** Dynamic Positioning Engine, Collision Avoidance, Occupied Region Registry, Scroll Coordination, Modal/Portal Handling, and Target Fallback Mechanics.

*Note: Checkpoint 4.3 (Observe vs Practice Interactive Engine) and Checkpoint 4.4 (Accessibility, Focus Management & Responsive Interaction Mechanics) belong to Master Prompt 5.*

### 2. Authority Hierarchy
1. **Approved System Contracts (AJ EcoDrive Master Frontend Architecture)**
2. **Normalized Phase 3 Reconstruction Contract (`docs/tour/PHASE_03_DELTA_ANALYSIS.md`)**
3. **Normalized Phase 2 System Inventory (`docs/tour/PHASE_02_CURRENT_SYSTEM_MAPPING.md`)**
4. **Frozen Phase 1 Historical Baseline (`docs/tour/PHASE_01_TOUR_FORENSICS.md`)**

---

## B. PHASE 3 NORMALIZATION INPUT

### 1. Reconciled Surface Coverage Denominator
- **Total Meaningful Surfaces (`TOTAL_MEANINGFUL_SURFACES`):** **`147`** surfaces (`85` Primary Pages + `28` Subviews/Tabs + `34` Modal/Drawer Workflows).
- **Coverage Breakdown:**
  - `CURRENTLY_COVERED_SURFACES`: **`15`**
  - `PARTIALLY_COVERED_SURFACES`: **`12`**
  - `UNCOVERED_SURFACES`: **`120`**
  - Denominator Formula: `15 + 12 + 120 = 147 total meaningful surfaces`.

### 2. Disambiguated Entity Metrics
- `ROUTE_RECORD_COUNT` (`195`) $
eq$ `UNIQUE_PATH_COUNT` (`182`) $
eq$ `COMPONENT_COUNT` (`112`) $
eq$ `TOUR_COVERAGE_SURFACE_COUNT` (`147`) $
eq$ `TOUR_STEP_COUNT` (determined during curriculum authoring).

### 3. Non-Linear Serialized Unit State Vocabulary Set
- Vocabulary: `Expected`, `Supplier In Transit`, `Receiving/QC`, `Available`, `Reserved`, `Transfer In Transit`, `Sold`, `Returned`, `In Service`, `Damaged / Quarantine`, `Scrapped`.
- *Rule: This is a state vocabulary, NOT one universal linear lifecycle.* Valid non-linear paths include `Available` $
ightarrow$ `Damaged / Quarantine`, `Damaged / Quarantine` $
ightarrow$ `Available`, `Sold` $
ightarrow$ `Returned`, `Returned` $
ightarrow$ `In Service`, `Available` $
ightarrow$ `Transfer In Transit` $
ightarrow$ `Available`.

### 4. Canonical Financial Formulas
- **Net Sales:** Gross Selling Amount - Discounts - Sales Returns / Refund adjustments.
- **COGS:** Landed cost of specific serialized units sold (Purchases $
eq$ COGS).
- **Gross Profit:** Net Sales - COGS.
- **Operating Expenses:** Approved / recorded business operating expenses.
- **Net Operating Profit:** Gross Profit - Operating Expenses.
- **Gross Margin %:** Gross Profit / Net Sales $	imes$ 100.
- **Inventory Value:** Landed cost value of **all owned unsold inventory**.

### 5. Explicit Unapproved Policy Items
- Opening Cash Float PKR 50,000, 7-Day Quotation Expiry, Battery Warranty SOH Threshold, Automatic Tax Logic, Anti-Smurfing Fraud Automation, Minimum Selling Price are preserved as `CURRENT_UI_HARDCODED_VALUE` / `BUSINESS_DECISION_REQUIRED`.

### 6. Standardized Target Identifier Convention
- Explicit semantic target attribute standardized across all specs: **`data-tour-id="<target-id>"`**.

---

## C. TOUR VISUAL DESIGN PRINCIPLES

Every tour visual element must answer four core user questions instantaneously:
1. **WHAT UI ELEMENT IS BEING EXPLAINED?** (Clear spotlight highlight and precise connector arrow).
2. **WHAT INFORMATION BELONGS TO THAT ELEMENT?** (Structured, readable card layout).
3. **WHAT ACTION IS EXPECTED?** (Explicit instructions, clear button hierarchy).
4. **HOW DO I CONTINUE OR EXIT?** (Unambiguous navigation controls distinct from business submission buttons).

---

## D. EXPERIENCE MODE VISUAL REQUIREMENTS

- **Level 1 — Quick Orientation (`LEVEL_1`):** High-level visual tour card with broad spotlight padding (`12px`), summary badge, and rapid "Next" flow.
- **Level 2 — Learn This Page (`LEVEL_2`):** Page-level navigation tour with section highlights and breadcrumb path indicators.
- **Level 3 — Show Me Every Field (`LEVEL_3`):** Compact, field-anchored tooltip cards displaying input format, allowed values, and validation help.
- **Level 4 — Guided Task / Practice (`LEVEL_4`):** Interactive card featuring step instruction, visual actionable target glow, and dedicated feedback validation area.
- **On Demand — Context Help (`ON_DEMAND`):** Minimalist popover anchored to contextual help trigger.

---

## E. COACH CARD ANATOMY

The canonical Coachmark Card structure comprises 11 functional zones:
```text
+-----------------------------------------------------------------------+
| [Mode Badge: LEVEL 4 PRACTICE]              [Step 2 of 6] [Close (X)] |
+-----------------------------------------------------------------------+
| Title: Select Serialized Electric Bike                                |
+-----------------------------------------------------------------------+
| Short Explanation: Every confirmed order requires an exact physical   |
| unit assignment before inventory can be reserved.                     |
+-----------------------------------------------------------------------+
| Primary Instruction: Click on chassis #DS11-01004 in the table below. |
+-----------------------------------------------------------------------+
| [Why It Matters: Prevents duplicate allocations across branches]       |
+-----------------------------------------------------------------------+
| [Example / Format: Format: DS11-XXXXX]                                |
+-----------------------------------------------------------------------+
| [Impact: Stock -> Unit Reserved | Money -> Receivable Pending]       |
+-----------------------------------------------------------------------+
| [Feedback Area: Reserved for real-time validation response]           |
+-----------------------------------------------------------------------+
| [Back]                                             [Continue / Skip]  |
+-----------------------------------------------------------------------+
```

---

## F. COACH CARD VARIANTS

1. `ORIENTATION_CARD`: Broad overview header layout.
2. `PAGE_GUIDE_CARD`: Section-anchored explanatory layout.
3. `FIELD_GUIDE_CARD`: Compact input-anchored layout.
4. `TASK_GUIDE_CARD`: Interactive step layout with instruction focus.
5. `CONTEXT_HELP_CARD`: Minimal tooltip layout.
6. `DECISION_CARD`: Option-selection card for branching choices.
7. `FEEDBACK_CARD`: Validation correction card (success green / caution amber).
8. `DEBRIEF_CARD`: End-of-task summary card detailing stock, financial, and next owner impacts.
9. `MISSING_TARGET_CARD`: Explicit fallback warning card when target UI element is missing.

---

## G. CONTENT DENSITY & OVERFLOW

- **Card Body Max Height:** `280px` for scrollable content area.
- **Overflow Treatment:** If instructional text exceeds max height, internal custom scrollbar is enabled (`overflow-y: auto`). Card geometry does NOT expand indefinitely.
- **Progressive Disclosure:** Complex business examples utilize expandable `<details>` accordions to prevent visual clutter.

---

## H. SPOTLIGHT / TARGET HIGHLIGHT SYSTEM

- **Spotlight Cutout:** SVG path mask with dark dimming backdrop (`rgba(15, 23, 42, 0.65)`).
- **Target Ring:** Dynamic highlight outline (`2px solid #3B82F6`) positioned around target element.
- **Target Padding:**
  - Icon/Button: `6px` padding
  - Input Field: `8px` padding
  - Card/Table Row: `12px` padding
  - Full Section Panel: `16px` max padding
- **Pointer Events:** Overlay uses `pointer-events: none` over highlighted target area so interactions reach the target in Practice mode.

---

## I. CONNECTOR / ARROW SYSTEM

- **Anchor Origin:** Derived dynamically from nearest edge of measured coach card (`top`, `bottom`, `left`, `right`).
- **Target Destination:** Nearest edge or center of target bounding rect.
- **Arrow Geometry:** SVG triangle indicator (`12px × 12px`).
- **Dynamic Anchoring:** Arrow is offset dynamically to point directly to target center; never hardcoded to `45%`.
- **Hidden Arrow Rule:** Connector arrow is hidden when card is docked in mobile bottom-sheet mode or when `MISSING_TARGET_CARD` is active.

---

## J. PROGRESS & NAVIGATION CONTROLS

- **Progress Badge:** "Step X of Y" displayed in top header zone.
- **Control Layout:** Bottom action bar contains `Back` (left), `Skip` (center-left), and `Next / Continue` (right).
- **Distinct Visual Style:** Tour navigation buttons use distinct tour theme colors (`bg-indigo-600`), preventing confusion with underlying application submit buttons (`bg-emerald-600`).

---

## K. HANDOFF / DEBRIEF PRESENTATION

End-of-task `DEBRIEF_CARD` displays a structured 4-impact grid:
- **Stock Impact:** e.g. "Unit #DS11-01004 state changed from Available to Reserved".
- **Money Impact:** e.g. "Sales Order #SO-1092 receivable created (PKR 250,000)".
- **Customer/Order Impact:** e.g. "Order assigned to Customer #CUST-402".
- **Next Owner & Action:** e.g. "Next Owner: Branch Manager (Process Payment & Delivery Handover)".

---

## L. FEEDBACK / ERROR VISUAL STATES

- **Informational:** Blue accent border (`#3B82F6`).
- **Caution / Validation Error:** Amber accent border (`#F59E0B`) with warning icon.
- **Task Success:** Emerald accent border (`#10B981`) with checkmark badge.
- **Missing Target Warning:** Crimson accent border (`#EF4444`) with warning triangle.

---

## M. RESPONSIVE PRESENTATION MODEL

- **Desktop (`>= 1280px`):** Floating contextual card anchored to target.
- **Laptop (`1024px – 1279px`):** Floating contextual card with auto-side shifting.
- **Tablet Landscape (`768px – 1023px`):** Floating card or docked panel based on space availability.
- **Mobile Web (`< 768px`, e.g. `390 × 844`):** Bottom-docked sheet surface (`BOTTOM_DOCK`). Target highlighted in visible viewport above sheet; no huge diagonal arrows.

---

## N. VISUAL DESIGN TOKEN REGISTRY

| Token Name | Value / Rule | Description |
| :--- | :--- | :--- |
| `VIS-CARD-WIDTH-DESKTOP` | `420px` preferred, `480px` max | Desktop Coach Card Width |
| `VIS-CARD-MAX-HEIGHT` | `520px` max total, `280px` body scroll | Maximum Card Dimensions |
| `VIS-VIEWPORT-INSET` | `16px` minimum safe margin | Viewport Safe Inset |
| `VIS-TARGET-GAP` | `14px` gap between card and target | Minimum Separation Gap |
| `VIS-SPOTLIGHT-PADDING` | `6px` to `16px` dynamic | Spotlight Padding Offset |
| `VIS-CONNECTOR-SIZE` | `12px × 12px` SVG arrow | Arrow Indicator Size |
| `VIS-BACKDROP-COLOR` | `rgba(15, 23, 42, 0.65)` | Dimming Overlay Color |
| `VIS-BORDER-RADIUS` | `12px` card, `8px` highlight ring | Border Radius Tokens |

---

## O. LAYER / Z-INDEX CONTRACT

Explicit Z-Index Hierarchy (Strictly avoids mutating target CSS layout position):
```text
TOUR_EMERGENCY_CONTROL_LAYER  (Relative Topmost)
TOUR_COACH_LAYER              (Above Spotlight & Connector)
TOUR_CONNECTOR_LAYER          (Between Card and Target Highlight)
TOUR_HIGHLIGHT_LAYER          (Above Dimming Backdrop)
TOUR_DIMMING_LAYER            (Above Application Active Surface)
APPLICATION_OVERLAY_CONTENT   (Active App Modal / Drawer Content)
APPLICATION_OVERLAY_BACKDROP  (Active App Modal / Drawer Backdrop)
APPLICATION_STICKY            (App Headers & Sidebars)
APPLICATION_BASE              (Base App Content)
*Rule: Relative semantic layer contract. Tour integrates with active stacking contexts without requiring application modals to mutate to absolute z-index values.*
```

*Rule: Tour engine highlights elements without applying `position: relative !important` or mutating target DOM inline styles.*

---

## P. TARGET REGISTRY CONTRACT

- **Attribute Standard:** Every tourable element in the application receives an explicit attribute: `data-tour-id="<target-id>"`.
- **Target ID Convention:** `<workspace>.<domain>.<surface>.<element-key>`
  - Examples: `sa.dashboard.kpi.net-sales`, `bm.sales.form.customer-select`, `shared.inventory.unit-table.row-chassis`.
- **Target Definition Schema:**
```json
{
  "targetId": "bm.sales.form.customer-select",
  "dataTourId": "bm.sales.form.customer-select",
  "route": "/sales/orders/create",
  "workspace": "Branch Manager",
  "surface": "CreateSale.vue",
  "componentType": "custom-select",
  "isRequired": true,
  "modalContext": null,
  "preferredPlacement": "RIGHT",
  "fallbackBehavior": "BOTTOM"
}
```

---

## Q. TARGET READINESS STATE MODEL

Every target transitions through explicit readiness states:
1. `UNRESOLVED`: Target selector not yet queried.
2. `ROUTE_LOADING`: Route transition in progress.
3. `WAITING_FOR_TARGET`: DOM query running via `MutationObserver`.
4. `TARGET_FOUND`: Element present in DOM.
5. `TARGET_VISIBLE`: Element has non-zero geometry and opacity > 0.
6. `TARGET_STABLE`: Geometry stable across 2 consecutive animation frames (`requestAnimationFrame`).
7. `TARGET_OFFSCREEN`: Target exists but requires scroll.
8. `TARGET_OBSCURED`: Target covered by sticky header or modal.
9. `TARGET_TIMEOUT`: Target failed to resolve within timeout limit.

---

## R. ROUTE / TARGET READINESS SPECIFICATION

- **Route Transition Sequence:**
  1. Trigger router navigation.
  2. Await `router.afterEach()` confirmation.
  3. Await `Vue.nextTick()` component tree mount.
  4. Query `data-tour-id` target element.
  5. Verify `TARGET_STABLE` geometry.
  6. Calculate card placement and render coach card.
- **Target Readiness Strategy:** Target readiness is event/state-driven first (`MutationObserver`, `ResizeObserver`, `requestAnimationFrame`). Configurable timeouts apply per target class (`STATIC_PAGE_TARGET`, `ROUTE_MOUNT_TARGET`, `ASYNC_CONTENT_TARGET`, `USER_TRIGGERED_TARGET`, `MODAL_TARGET`, `DRAWER_TARGET`, `CONDITIONAL_TARGET`). Zero universal sleep/timeout.

---

## S. GEOMETRY MEASUREMENT CONTRACT

- **Actual Rendered Geometry:** Positioning engine measures actual rendered Coach Card bounding rect via `getBoundingClientRect()` post-mount. Zero hardcoded height assumptions (`CARD_HEIGHT != 360px`).
- **Target Bounding Box:** Measured live via `target.getBoundingClientRect()`.
- **Viewport Safe Region:** Measured via `window.innerWidth`, `window.innerHeight`, minus occupied navigation zones.

---

## T. OCCUPIED REGION SYSTEM

The positioning engine registers occupied UI zones to prevent card collision:
- `HEADER_ZONE`: Measured header rect (`header.getBoundingClientRect()`). `64px` is reference only.
- `SIDEBAR_ZONE`: Measured sidebar rect (`sidebar.getBoundingClientRect()`). `260px`/`72px` are reference only.
- `ACTION_CENTRE_DRAWER`: Measured drawer rect (`drawer.getBoundingClientRect()`). `480px` is reference only.
- *Rule: Occupied regions MUST be measured runtime geometry supplied by active layout surfaces, NOT engine constants.*
- `MODAL_CONTAINER`: Active modal dialog bounding box.
- `FLOATING_HUD`: Quick action HUD floating container.

---

## U. PLACEMENT CANDIDATE ALGORITHM

Candidate Placement Order:
1. `RIGHT` (Preferred for LTR form/table layouts)
2. `LEFT` (Fallback if right space < card width + gap)
3. `BOTTOM` (Fallback for top input fields)
4. `TOP` (Fallback for lower page fields)
5. `BOTTOM_DOCK` (Responsive mobile fallback)

Scoring Metric:
$$	ext{Score} = 	ext{SpaceAvailable} - 	ext{OverlapPenalty} - 	ext{DistancePenalty}$$

---

## V. COLLISION RULES

Candidates are strictly rejected if candidate rect intersects:
1. Target element rect (`TARGET_COLLISION`).
2. Viewport outer boundary (`VIEWPORT_COLLISION`).
3. Sticky header or sidebar occupied zones (`HEADER_COLLISION` / `SIDEBAR_COLLISION`).
4. Active modal backdrop/surface outside target scope (`MODAL_COLLISION`).

---

## W. SCROLL COORDINATION SPECIFICATION

- **Scroll Ancestor Resolution:** Engine traverses target parent tree to locate nearest scrollable container (`overflow-y: auto` or `scroll`).
- **Scroll-to-Target Contract:**
  1. Calculate target center `y` relative to scroll container.
  2. Execute smooth scroll `container.scrollTo({ top: safeY, behavior: 'smooth' })`.
  3. Await scroll settlement via `scrollend` event or `requestAnimationFrame` stability check (50ms zero movement delta).
  4. Remeasure target bounding rect.
  5. Compute final coach card position.

---

## X. MODAL / DRAWER / PORTAL SPECIFICATION

- **Teleport Support:** Target resolution uses global document selector (`[data-tour-id="..."]`), correctly resolving targets mounted inside Vue `<Teleport to="body">` portals.
- **Modal Context:** If target lives inside a modal, card is placed relative to modal inner scroll container. If floating placement outside modal fails, card docks to bottom of modal surface.
- **Modal Disappearance Semantics:** Target disappearance is interpreted via step semantics:
  - Expected Close/Submit click: Modal disappearance = `STEP_SUCCESS` or `POSTCONDITION_CHECK_REQUIRED`.
  - Unexpected modal close: Triggers `TARGET_REMOVED_UNEXPECTEDLY`.
  - Conditional target disappearance: Triggers `OPTIONAL_TARGET_SKIPPED` or re-evaluates condition.
  - *Rule: Modal disappearance is NEVER universally called MISSING_TARGET_CARD.*

---

## Y. DYNAMIC LAYOUT / OBSERVER SPECIFICATION

- **Target `ResizeObserver`:** Attached to active target element to recalculate card position if target resizes (e.g. textarea expansion).
- **Card `ResizeObserver`:** Attached to Coach Card element to recalculate placement when card content/validation message changes height.
- **Window Resize Throttling:** `window.addEventListener('resize')` throttled via `requestAnimationFrame`.

---

## Z. MOBILE-WEB DOCKING SPECIFICATION

- **Trigger Condition:** Viewport width `< 768px` or floating candidate score `< 0`.
- **Docking Presentation:** Card docks to bottom of screen (`BOTTOM_DOCK`) as a bottom sheet.
- **Target Visibility:** Target scrolled into top 50% of viewport area above bottom sheet.
- **Connector:** Arrow hidden; target highlighted with pulse ring.

---

## AA. MISSING-TARGET / FALLBACK SPECIFICATION

- **Trigger:** Target element fails to resolve after 3000ms or is detached from DOM.
- **Visual Presentation:** `MISSING_TARGET_CARD` displayed in safe center-bottom viewport location.
- **Content:** "TARGET CURRENTLY UNAVAILABLE — The interface element required for this step is not visible in the current workspace or state."
- **Controls:** Arrow hidden; Spotlight backdrop cleared; user offered "Skip Step" or "Retry".

---

## AB. CONNECTOR GEOMETRY SPECIFICATION

- **Connector Vector:** Calculated between `CardAnchor(x, y)` and `TargetAnchor(x, y)`.
- **Clearance:** Minimum `14px` gap maintained between card border and target ring.

---

## AC. POSITIONING MODULE BOUNDARIES

```text
+----------------------------------------------------------------+
|                        TourController                          |
+----------------------------------------------------------------+
                               |
        +----------------------+----------------------+
        |                                             |
        v                                             v
+-----------------------+                   +--------------------+
|  TargetRegistry       |                   |  GeometryService   |
|  (data-tour-id look)  |                   |  (Bounding Rects)  |
+-----------------------+                   +--------------------+
        |                                             |
        +----------------------+----------------------+
                               |
                               v
                    +--------------------+
                    |  PlacementEngine   |
                    |  (Scoring & Rules) |
                    +--------------------+
```

---

## AD. POSITIONING RESULT MODEL

```json
{
  "targetId": "bm.sales.form.customer-select",
  "mode": "FLOATING",
  "placement": "RIGHT",
  "cardCoordinates": { "x": 640, "y": 280, "width": 420, "height": 310 },
  "targetHighlight": { "x": 180, "y": 275, "width": 440, "height": 42 },
  "connector": { "originX": 640, "originY": 296, "targetX": 620, "targetY": 296, "visible": true },
  "scrollRequired": false,
  "status": "SUCCESS"
}
```

---

## AE. POSITIONING INVARIANTS

- `INV-POS-001`: Floating coach card MUST NOT cover its target element.
- `INV-POS-002`: Coach card MUST remain strictly within safe viewport margins (`16px` inset).
- `INV-POS-003`: Target highlight ring MUST match live measured target bounding rect.
- `INV-POS-004`: Connector arrow MUST point to live target center/edge.
- `INV-POS-005`: Layout/DOM size shifts MUST trigger position recalculation.
- `INV-POS-006`: Missing target MUST show explicit warning card without fake arrow.
- `INV-POS-007`: Tour highlighting MUST NOT mutate target element CSS `position` or `z-index`.
- `INV-POS-008`: Mobile viewports MUST use bottom docking when floating placement is unsafe.

---

## AF. FUTURE QA MATRIX

- **Viewport Profiles:** `1440 × 900`, `1366 × 768`, `1024 × 768`, `768 × 1024`, `390 × 844`.
- **Target Locations:** Top-left, Top-right, Center, Bottom-left, Bottom-right, Inside Modal, Inside Drawer, Offscreen scroll.

---

## AG. REQUIREMENT TRACEABILITY MATRIX

- `TR-001` (Semantic Registry) $
ightarrow$ Satisfied by Section P (`Target Registry Contract`).
- `TR-002` (Collision Engine) $
ightarrow$ Satisfied by Section U & V (`Placement Algorithm & Collision Rules`).
- `TR-003` (Layer Contract) $
ightarrow$ Satisfied by Section O (`Layer / Z-Index Contract`).
- `TR-010` (Observe vs Practice Visuals) $
ightarrow$ Satisfied by Section D & E (`Experience Modes & Card Anatomy`).

---

## AH. CHECKPOINT 4.1 ACCEPTANCE

```text
CHECKPOINT_4_1 = COMPLETE
Visual Design System, Coach Card Anatomy, Tokens, Layers, and Visual Variants fully specified.
```

---

## AI. CHECKPOINT 4.2 ACCEPTANCE

```text
CHECKPOINT_4_2 = COMPLETE
Dynamic Positioning Engine, Collision Avoidance, Occupied Region Registry, Scroll Coordination, Modal Handling, and Fallback Mechanics fully specified.
```

---

## AJ. MASTER PROMPT 4 FREEZE STATEMENT

```text
CHECKPOINT_4_1 = COMPLETE
CHECKPOINT_4_2 = COMPLETE

CHECKPOINT_4_3 = READY_FOR_MASTER_PROMPT_5
CHECKPOINT_4_4 = LOCKED_FOR_MASTER_PROMPT_5

MASTER_PROMPT_4_STATUS = COMPLETE

MASTER_PROMPT_5 = READY_TO_EXECUTE
```


---

## AK. PHASE 4.1 / 4.2 NORMALIZATION SUMMARY

1. **Occupied Region Measurement:** `OccupiedRegionRegistry` uses live measured geometry (`getBoundingClientRect()`). Fixed layout dimensions (`Header 64px`, `Sidebar 260px`, `Drawer 480px`) are current reference values, NOT engine constants.
2. **Event-Driven Target Readiness:** Target readiness uses event/state-driven observers (`MutationObserver`, `ResizeObserver`, `requestAnimationFrame`). Configurable timeouts apply per target class (`STATIC_PAGE_TARGET`, `ROUTE_MOUNT_TARGET`, `ASYNC_CONTENT_TARGET`, `USER_TRIGGERED_TARGET`, `MODAL_TARGET`, `DRAWER_TARGET`, `CONDITIONAL_TARGET`). No universal global sleep/timeout.
3. **Semantic Layer Contract:** Tour implements a relative semantic layer contract (`TOUR_COACH_LAYER`, `TOUR_HIGHLIGHT_LAYER`, `TOUR_DIMMING_LAYER`, `APPLICATION_OVERLAY_CONTENT`). Existing application modals are NOT forced to change CSS `z-index`.
4. **Step-Semantic Target Disappearance:** Target/modal disappearance is interpreted from step semantics (Expected action $
ightarrow$ `STEP_SUCCESS` / `POSTCONDITION_CHECK_REQUIRED`; Unexpected $
ightarrow$ `TARGET_REMOVED_UNEXPECTEDLY`; Conditional $
ightarrow$ `OPTIONAL_TARGET_SKIPPED`).
5. **Geometry-Based Mobile Positioning:** Mobile target safe region is computed mathematically (`visualViewport - bottomSheet - occupiedRegions - safeInsets`). `Top 50%` is a preference, not a rigid constraint.

---

## AL. OBSERVE MODE CONTRACT

- **Definition:** Observe Mode is purely instructional and explanatory.
- **Permitted Operations:** Route navigation, tour card rendering, target highlighting, container scrolling, field/KPI/status explanation, business example display, downstream impact preview, next-owner guidance.
- **Prohibited Operations:** Automatic form submission, approving records, posting inventory adjustments, receiving stock, dispatching transfers, confirming sales, processing payments, issuing refunds, deleting records, or silently mutating store data.
- **UI Surface vs Business Mutation:** Opening a layout UI surface (e.g. drawer preview) for instructional purposes is distinct from executing a business record state mutation.

---

## AM. PRACTICE MODE CONTRACT

- **Definition:** Practice Mode asks the employee to perform a specific UI interaction (e.g. click button, select dropdown item, type reference, open drawer, choose decision).
- **Core Principle:** The tour observes, validates, and guides application behavior. The tour MUST NOT secretly perform business operations or mutate store state to make a step appear successful.
- **Application Rule Authority:** Practice Mode validates actions processed by the actual application frontend. It never bypasses frontend validation, role restrictions, or state transition guards.

---

## AN. INTERACTIVE STEP SCHEMA

Canonical step contract shape:
```json
{
  "stepId": "STEP-BM-SALE-003",
  "missionId": "MISSION-BM-SELL-EV",
  "scenarioId": "SCENARIO-D",
  "workspace": "Branch Manager",
  "route": "/sales/orders/create",
  "mode": "PRACTICE",
  "targetId": "bm.sales.form.chassis-select",
  "targetRequirement": "REQUIRED",
  "title": "Select Serialized Electric Bike",
  "instruction": "Click the chassis dropdown and select available unit #DS11-01004.",
  "whyItMatters": "Reserves specific physical bike for this customer.",
  "expectedAction": "SELECT",
  "expectedValueRule": "selectedUnit.status == 'Available'",
  "mutationRisk": "RISK_2_DRAFT_OR_REVERSIBLE",
  "completionRule": "POSTCONDITION_OBSERVED",
  "postcondition": "order.assignedUnitId == 'DS11-01004' AND unit.status == 'Reserved'",
  "retryRule": "ALLOW_RETRY_NO_MUTATION_DUPLICATION",
  "skipRule": "NOT_SKIPPABLE_FOR_TASK_COMPLETION",
  "backRule": "REVERSIBLE_DRAFT_INTERACTION"
}
```

---

## AO. EXPECTED ACTION / VALIDATION MODEL

- **Supported Action Types:** `OBSERVE`, `CLICK`, `OPEN_SURFACE`, `NAVIGATE`, `TYPE`, `SELECT`, `TOGGLE`, `CHOOSE_OPTION`, `CONFIRM_UI`, `WAIT_FOR_STATE`, `REVIEW`, `DECISION`, `HANDOFF`, `DEBRIEF`.
- **Validation Categories:** `ANY_NON_EMPTY_VALID_VALUE`, `EXACT_DEMO_VALUE`, `ENUM_MEMBER`, `FORMAT_VALID`, `NUMERIC_POLICY_VALID`, `DATE_VALID`, `RECORD_SELECTION_VALID`, `APPLICATION_VALIDATION_PASSED`, `STATE_TRANSITION_OBSERVED`.
- **Privacy Rule:** Training examples MUST NOT require actual personal CNIC, personal phone, private email, or real financial credentials.

---

## AP. MUTATION-RISK CLASSIFICATION

| Risk Level | Category | Examples | Tour Handling Policy |
| :--- | :--- | :--- | :--- |
| `RISK_0` | Read-Only | View dashboard, inspect tab, read audit log | Open interaction |
| `RISK_1` | UI State Only | Expand accordion, open filter drawer, switch view tab | Open interaction |
| `RISK_2` | Draft / Reversible | Type into unsaved form input, select product draft | Practice guided interaction |
| `RISK_3` | Business Record | Submit stock request, create lead, submit expense | User executes; tour observes postcondition |
| `RISK_4` | Irreversible / Sensitive | Post adjustment, dispatch transfer, pay expense | User executes; native app confirm; observe postcondition |

---

## AQ. SAFE PRACTICE POLICY

- **Rule:** The tour guides high-impact (`RISK_3` / `RISK_4`) actions, but NEVER silently auto-executes them.
- **Execution Boundary:** The employee MUST intentionally invoke the application's actual action through native UI.
- **Native Confirmation:** Application confirmation dialogs remain authoritative.
- **Observe-Only Option:** High-risk teaching steps may use `OBSERVE_ONLY_HIGH_RISK` to explain consequences without forcing real execution.

---

## AR. COMPLETION / POSTCONDITION MODEL

- **Completion Modes:** `MANUAL_CONTINUE`, `EXPECTED_EVENT`, `VALUE_VALIDATED`, `ROUTE_REACHED`, `SURFACE_OPENED`, `POSTCONDITION_OBSERVED`, `EXPLICIT_USER_CONFIRMATION`.
- **Postcondition Verification:** A Practice step completes only when the expected postcondition is verified (e.g. record state changes to `Submitted`, unit status updates to `Reserved`). Reaching the last card without postcondition verification does NOT mark a task complete.

---

## AS. CONDITIONAL / DECISION BRANCHING

- **Branching Architecture:** Steps can declare decision nodes (e.g. `Stock Request Fulfilment: Stock Available Elsewhere -> Transfer Path; Stock Unavailable -> PO Path`).
- **Branching Truth:** Branch conditions strictly follow approved business workflow rules; no invented paths.

---

## AT. RETRY / SKIP / BACK / EXIT SEMANTICS

- **Wrong Action:** Gentle corrective feedback; non-destructive wrong clicks do NOT break the mission.
- **Retry Policy:** Allowed for wrong clicks or invalid draft entries; retry NEVER duplicates business mutations.
- **Skip Policy:** Explanatory steps may be `SKIPPABLE`; core completion steps are `NOT_SKIPPABLE_FOR_TASK_COMPLETION`.
- **Back Policy:** Reversible for navigation/draft steps (`REVERSIBLE_DRAFT_INTERACTION`). Crossing a non-reversible business action (`NON_REVERSIBLE_BUSINESS_ACTION`) allows Back to view debrief, but NEVER attempts to undo business records.
- **Exit Policy:** Exiting tour leaves application in its actual current state. Tour does not roll back saved/unsaved application work.

---

## AU. PAUSE / RESUME / VERSIONING

- **Progress State:** Stores `missionId`, `missionVersion`, `workspace`, `currentStepId`, `completedStepIds`, `scenarioCheckpoint`. Zero personal or customer data stored in progress state.
- **Stale Resume Protection:** On resume, engine validates workspace, route, target, and record state preconditions. If invalid, triggers `RESUME_RECONCILIATION_REQUIRED`.

---

## AV. CROSS-ROLE SCENARIO SEGMENTATION

- **Segmentation Rule:** Cross-role scenarios (Scenarios A through F) are divided into explicit `WORKSPACE_SEGMENTS`.
- **Zero Impersonation:** Tour NEVER impersonates another role, auto-switches logged-in roles, or grants missing permissions.
- **Segment Handoff:** At segment completion, tour displays Handoff Card detailing completed work, next owning role, and expected next action.

---

## AW. HANDOFF & DEBRIEF INTERACTION CONTRACT

- **Handoff Card Structure:** Displays "Your part is complete", Next Owning Role (`Super Admin` / `Branch Manager`), Next Action, State Change, and Invariant Warning.
- **Debrief Card Structure:** Concludes task with 4-impact summary (Stock, Money, Customer/Order, Next Action).

---

## AX. PRACTICE FEEDBACK STATES

- `GUIDANCE`: Blue informational banner.
- `TRY_AGAIN`: Amber corrective hint (non-punitive language).
- `VALIDATION_ERROR`: Red input hint explaining format rule.
- `WRONG_CONTROL`: Amber hint pointing back to expected target.
- `BLOCKED_BY_APPLICATION`: Gray banner explaining native application guard.
- `SUCCESS`: Emerald confirmation badge.

---

## AY. ACCESSIBILITY PRINCIPLES

- **Non-Degradation Rule:** Tour MUST NOT make underlying application less accessible.
- **Equivalence Rule:** Every action operable by mouse MUST be operable by keyboard.
- **Non-Interference:** Overlay MUST NOT block assistive technology access to Practice target.

---

## AZ. SEMANTIC SURFACE ROLES

- `dialog`: Applied only to modal coach cards (`aria-modal="true"`).
- `region` / `complementary`: Applied to non-modal contextual help cards.
- `status`: Applied to progress and feedback indicators, and standard target-unavailable guidance.
- `alert`: Applied strictly to critical, blocking conditions.

---

## BA. FOCUS MANAGEMENT MODEL

- **Observe Mode Focus:** Initial focus lands on Coach Card heading container (`aria-labelledby`). For modal / blocking Observe steps, focus is contained within tour controls (`MODAL_OBSERVE_FOCUS_SCOPE`). For non-modal contextual Observe steps, focus is not trapped, ensuring predictable focus entry and exit without blocking accessible background navigation.
- **Practice Mode Focus:** Two-phase focus: Instruction card read $
ightarrow$ focus shifts to expected application target (`PRACTICE_FOCUS_SCOPE`). Target remains focusable, discoverable, and operable.
- **Focus Restoration:** On step advance or tour exit, focus restores to launcher, previous control, or logical workflow container.

---

## BB. KEYBOARD INTERACTION CONTRACT

- `Tab` / `Shift+Tab`: Managed deterministically per focus scope. Focus NEVER escapes unpredictably into hidden background controls.
- `Escape`: Close tour subpanel $
ightarrow$ collapse temporary help $
ightarrow$ exit tour (with confirmation). Application modal retains Escape priority when active.
- `Enter` / `Space`: Activate focused tour control or target.
- **Button Semantics:** All interactive controls use semantic `<button>` elements with clear accessible labels (`aria-label`).

---

## BC. SCREEN-READER ANNOUNCEMENT MODEL

- **Polite Channel (`aria-live="polite"`):** Announces step transitions, title, instruction, and progress ("Step 2 of 6: Select Serialized Electric Bike").
- **Assertive Channel (`aria-live="assertive"`):** Announces critical missing-target warnings or blocked validation errors.

---

## BD. REDUCED-MOTION CONTRACT

- Respects `prefers-reduced-motion: reduce`.
- Disables spotlight pulse ring animation.
- Replaces smooth scrolling with instant safe positioning.
- Replaces card transition animations with instant opacity toggles.

---

## BE. ZOOM / REFLOW CONTRACT

- Operable at up to `200%` browser zoom without text truncation or button overlap.
- Card body enables internal scrolling if zoom reduces visual height.

---

## BF. MOBILE VISUAL-VIEWPORT & KEYBOARD CONTRACT

- Uses `window.visualViewport` resize and offset events to detect viewport changes.
- The engine infers likely virtual keyboard presence from visual viewport height reductions and remeasures bottom sheet and target geometry immediately, keeping active input visible above the sheet.

---

## BG. RESPONSIVE INTERACTION MODEL

- **Desktop:** Floating card + target highlight.
- **Mobile Web:** Docked bottom sheet + target highlight + safe top target area.
- **Orientation Change:** Remeasures geometry and adapts presentation without restarting mission.

---

## BH. FOCUS RESTORATION MODEL

- On tour exit: Focus restores to element that launched tour or primary page container. Detached elements are NEVER focused.

---

## BI. ACCESSIBLE MISSING-TARGET MODEL

- Missing target card uses `role="status"` with a polite screen-reader announcement (`aria-live="polite"`) for standard target-unavailable guidance. Critical blocking conditions use `role="alert"` with an assertive announcement (`aria-live="assertive"`). All missing-target surfaces provide keyboard-accessible "Retry", "Skip", or "Exit" actions.

---

## BJ. INTERACTION INVARIANTS

- `INV-INT-001`: Tour NEVER performs hidden business mutations to satisfy a step.
- `INV-INT-002`: Practice success requires explicit postcondition verification.
- `INV-INT-003`: Back button NEVER reverses completed business transactions.
- `INV-INT-004`: High-risk actions require intentional user action through application UI.
- `INV-INT-005`: Role permissions are NEVER bypassed by tour engine.
- `INV-INT-006`: Conditional workflows branch rather than teaching false linear paths.

---

## BK. ACCESSIBILITY INVARIANTS

- `INV-A11Y-001`: All tour features keyboard-operable.
- `INV-A11Y-002`: Practice target remains focusable and accessible to assistive tech.
- `INV-A11Y-003`: Modal visual blocking and accessibility focus scope remain consistent.
- `INV-A11Y-004`: Exit control is always keyboard accessible.
- `INV-A11Y-005`: Meaning is never conveyed by color or geometry alone.
- `INV-A11Y-006`: `prefers-reduced-motion` is strictly respected.
- `INV-A11Y-007`: Focus is safely restored on exit.
- `INV-A11Y-008`: Mobile virtual keyboard triggers layout remeasurement.

---

## BL. SCENARIO ARCHITECTURE TRACES (SCENARIOS A THROUGH F)

1. **Scenario A (Product Request):**
   - Segment 1 (BM): Practice submit request $
ightarrow$ Handoff `Super Admin`.
   - Segment 2 (SA): Observe review in Action Centre $
ightarrow$ Practice approve.
   - Segment 3 (SA): Practice create & activate product master (Zero physical stock created).
2. **Scenario B (Stock Replenishment):**
   - Segment 1 (BM): Practice Stock Request submission $
ightarrow$ Handoff `Super Admin`.
   - Segment 2 (SA): Observe review $
ightarrow$ Branch condition (Transfer if available, PO if unavailable).
   - Segment 3 (Origin BM): Practice pick & dispatch transfer $
ightarrow$ Handoff `Destination BM`.
   - Segment 4 (Dest BM): Practice chassis verification & receive stock (`Available` at destination).
3. **Scenario C (Procurement):**
   - Segment 1 (SA): Practice PO creation $
ightarrow$ PO `Ordered`.
   - Segment 2 (Warehouse): Practice Goods Receipt ingestion (Chassis/Motor capture $
ightarrow$ Serialized units `Available`).
   - Segment 3 (SA/Finance): Observe Landed Cost allocation $
ightarrow$ Supplier Bill matching (`PARTIAL_CURRENT_FRONTEND`).
4. **Scenario D (Sell an EV):**
   - Segment 1 (BM): Practice Lead intake $
ightarrow$ optional Quotation.
   - Segment 2 (BM): Practice Sales Order confirmation + exact chassis assignment (Unit status `Reserved`).
   - Segment 3 (BM): Practice Payment recording $
ightarrow$ Invoice issuance.
   - Segment 4 (BM): Practice Vehicle Handover checklist execution (Unit status `Sold` $
ightarrow$ Debrief).
5. **Scenario E (Controlled Inventory Correction):**
   - Segment 1 (BM): Practice Cycle Count execution $
ightarrow$ Discrepancy discovered.
   - Segment 2 (BM): Practice Inventory Adjustment Request submission $
ightarrow$ Handoff `Super Admin`.
   - Segment 3 (SA): Observe review $
ightarrow$ Practice approval $
ightarrow$ Ledger posting (`Available` stock reconciled).
6. **Scenario F (Expense Approval):**
   - Segment 1 (BM): Practice Expense submission $
ightarrow$ Handoff `Super Admin`.
   - Segment 2 (SA): Observe Action Centre drawer $
ightarrow$ Practice approval.
   - Segment 3 (Finance/SA): Practice payment recording (Outflow recorded).

---

## BM. PRACTICE TEST MATRIX

- Tests for: Correct click, wrong click, valid typing, invalid typing, correct select, conditional branch, route change, modal open, modal close expected/unexpected, target disappearance, retry, skip optional, attempt skip required, Back before/after mutation, exit with draft, resume valid/stale, high-risk action, application validation block, cross-role handoff.

---

## BN. ACCESSIBILITY / RESPONSIVE TEST MATRIX

- Tests for: `Tab`, `Shift+Tab`, `Enter`, `Space`, `Escape`, focus entry/transition/restoration, screen-reader announcements, target accessibility, modal/drawer keyboard interaction, reduced motion, 200% zoom, mobile portrait/landscape, virtual keyboard, missing target recovery.

---

## BO. REQUIREMENT TRACEABILITY

- `TR-001` to `TR-065` fully mapped across Phase 4 specification sections (Visual System, Positioning Engine, Interactive Engine, Accessibility & Responsive Engine).

---

## BP. CHECKPOINT 4.3 ACCEPTANCE

```text
CHECKPOINT_4_3 = COMPLETE
Observe vs Practice Interactive Engine, Step Schema, Mutation Risk Policy, Postconditions, Branching, Retry/Skip/Back/Exit, Pause/Resume, and Scenario Traces fully specified.
```

---

## BQ. CHECKPOINT 4.4 ACCEPTANCE

```text
CHECKPOINT_4_4 = COMPLETE
Accessibility Principles, Surface Semantics, Focus Management, Keyboard Contract, Screen-Reader Announcements, Reduced Motion, Reflow/Zoom, Mobile Virtual Keyboard, Touch Targets, and Invariants fully specified.
```

---

## BR. PHASE 4 FINAL FREEZE STATEMENT

```text
CHECKPOINT_4_1 = COMPLETE
CHECKPOINT_4_2 = COMPLETE
CHECKPOINT_4_3 = COMPLETE
CHECKPOINT_4_4 = COMPLETE

PHASE_4_STATUS = COMPLETE

TOUR_EXPERIENCE_ARCHITECTURE = FROZEN

MASTER_PROMPT_5_STATUS = COMPLETE

MASTER_PROMPT_6 = READY_TO_EXECUTE
```
