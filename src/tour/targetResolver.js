/**
 * AJ EcoDrive — Semantic Target Resolver & Readiness Coordinator
 * PROGRAM: AJ-TOUR-RECONSTRUCT-2026
 * PHASE 6: CHECKPOINT 6.1 — TARGET RESOLVER IMPLEMENTATION
 */

import { getTarget, TARGET_STATES } from './targetRegistry.js';

/**
 * Finds the nearest scrollable ancestor element.
 */
export function findScrollContainer(element) {
  if (!element || typeof window === 'undefined') return window;

  let parent = element.parentElement;
  while (parent && parent !== document.body && parent !== document.documentElement) {
    const style = window.getComputedStyle(parent);
    const overflowY = style.overflowY;
    const overflowX = style.overflowX;
    const isScrollable = (overflowY === 'auto' || overflowY === 'scroll' || overflowX === 'auto' || overflowX === 'scroll');

    if (isScrollable && (parent.scrollHeight > parent.clientHeight || parent.scrollWidth > parent.clientWidth)) {
      return parent;
    }
    parent = parent.parentElement;
  }
  return window;
}

/**
 * Shared role table aliases.
 * When Branch Manager missions target a table on a shared view,
 * fallback to the corresponding Super Admin table target attribute.
 */
export const SHARED_TABLE_ALIASES = {
  'bm.sales.leads.table': 'sa.sales.leads.table',
  'bm.sales.customers.table': 'sa.sales.customers.table',
  'bm.sales.quotations.table': 'sa.sales.quotations.table',
  'bm.sales.orders.table': 'sa.sales.orders.table',
  'bm.sales.payments.table': 'sa.sales.payments.table',
  'bm.sales.returns.table': 'sa.sales.returns.table',
  'bm.inventory.units.table': 'sa.inventory.units.table',
  'bm.inventory.requests.table': 'sa.inventory.requests.table',
  'bm.inventory.transfers.table': 'sa.inventory.transfers.table',
  'bm.procurement.receipts.table': 'sa.procurement.receipts.table',
  'bm.inventory.adjustments.table': 'sa.inventory.adjustments.table',
  'bm.service.cases.table': 'sa.service.cases.table',
  'bm.finance.expenses.table': 'sa.finance.expenses.table',
};

export const SHARED_ACTION_CENTRE_ALIASES = {
  'bm.action-centre.header.filters': 'sa.action-centre.header.filters',
  'bm.action-centre.header.create-btn': 'sa.action-centre.header.create-btn',
  'bm.action-centre.modal.type-commercial-pricing': 'sa.action-centre.modal.type-commercial-pricing',
  'bm.action-centre.modal.type-stock-reallocation': 'sa.action-centre.modal.type-stock-reallocation',
  'bm.action-centre.modal.type-operational-expense': 'sa.action-centre.modal.type-operational-expense',
  'bm.action-centre.modal.type-warranty-escalation': 'sa.action-centre.modal.type-warranty-escalation',
  'bm.action-centre.modal.type-inventory-governance': 'sa.action-centre.modal.type-inventory-governance',
  'bm.action-centre.modal.field-title': 'sa.action-centre.modal.field-title',
  'bm.action-centre.modal.field-priority': 'sa.action-centre.modal.field-priority',
  'bm.action-centre.modal.field-customer': 'sa.action-centre.modal.field-customer',
  'bm.action-centre.modal.field-phone': 'sa.action-centre.modal.field-phone',
  'bm.action-centre.modal.field-model': 'sa.action-centre.modal.field-model',
  'bm.action-centre.modal.field-orderref': 'sa.action-centre.modal.field-orderref',
  'bm.action-centre.modal.field-unitcount': 'sa.action-centre.modal.field-unitcount',
  'bm.action-centre.modal.field-discount': 'sa.action-centre.modal.field-discount',
  'bm.action-centre.modal.field-justification': 'sa.action-centre.modal.field-justification',
  'bm.action-centre.modal.submit-btn': 'sa.action-centre.modal.submit-btn',
  'bm.action-centre.queue.list': 'sa.action-centre.queue.list',
};

export const ALL_SHARED_ALIASES = {
  ...SHARED_TABLE_ALIASES,
  ...SHARED_ACTION_CENTRE_ALIASES,
  'bm.sales.delivery.create-btn': 'bm.sales.handover.create-btn',
  'bm.sales.delivery.table': 'bm.sales.handover.table',
};

/**
 * Resolves a target element in the active DOM and evaluates its state and geometry.
 */
export function resolveTarget(targetId, options = {}) {
  if (!targetId || typeof document === 'undefined') {
    return {
      state: TARGET_STATES.UNRESOLVED,
      element: null,
      rect: null,
      targetDef: null,
    };
  }

  const targetDef = getTarget(targetId) || (ALL_SHARED_ALIASES[targetId] ? getTarget(ALL_SHARED_ALIASES[targetId]) : null);
  let el = null;

  // 1. Primary semantic resolution via [data-tour-id="..."]
  if (options.recordId) {
    el = document.querySelector(`[data-tour-id="${targetId}"][data-record-id="${options.recordId}"]`) ||
         document.querySelector(`[data-record-id="${options.recordId}"] [data-tour-id="${targetId}"]`);
  }

  if (!el) {
    el = document.querySelector(`[data-tour-id="${targetId}"]`);
  }

  // 1b. Fallback to shared alias when role targets share the identical component DOM element
  if (!el && ALL_SHARED_ALIASES[targetId]) {
    const aliasId = ALL_SHARED_ALIASES[targetId];
    if (options.recordId) {
      el = document.querySelector(`[data-tour-id="${aliasId}"][data-record-id="${options.recordId}"]`) ||
           document.querySelector(`[data-record-id="${options.recordId}"] [data-tour-id="${aliasId}"]`);
    }
    if (!el) {
      el = document.querySelector(`[data-tour-id="${aliasId}"]`);
    }
  }

  // 2. Fallback to custom selector or legacy selector if registered
  if (!el && targetDef) {
    if (targetDef.selector && targetDef.selector !== `[data-tour-id="${targetId}"]`) {
      try {
        el = document.querySelector(targetDef.selector);
      } catch (e) {
        // ignore invalid query selector
      }
    }
    if (!el && targetDef.legacySelector) {
      try {
        el = document.querySelector(targetDef.legacySelector);
      } catch (e) {
        // ignore invalid query selector
      }
    }
  }

  // 3. Fallback to raw selector if targetId itself is passed as a CSS selector (migration bridge)
  if (!el && (targetId.startsWith('#') || targetId.startsWith('.') || targetId.startsWith('['))) {
    try {
      el = document.querySelector(targetId);
    } catch (e) {
      // ignore
    }
  }

  if (!el) {
    return {
      state: TARGET_STATES.WAITING_FOR_TARGET,
      element: null,
      rect: null,
      targetDef,
    };
  }

  // Evaluate element visibility and geometry
  const rect = el.getBoundingClientRect();
  const style = window.getComputedStyle(el);

  if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
    return {
      state: TARGET_STATES.TARGET_HIDDEN_CONDITIONALLY,
      element: el,
      rect,
      targetDef,
    };
  }

  if (rect.width === 0 || rect.height === 0) {
    return {
      state: TARGET_STATES.TARGET_HIDDEN_CONDITIONALLY,
      element: el,
      rect,
      targetDef,
    };
  }

  const viewportHeight = window.innerHeight;
  const viewportWidth = window.innerWidth;

  // Check offscreen
  const isOffscreen = (
    rect.bottom < 0 ||
    rect.top > viewportHeight ||
    rect.right < 0 ||
    rect.left > viewportWidth
  );

  if (isOffscreen) {
    return {
      state: TARGET_STATES.TARGET_OFFSCREEN,
      element: el,
      rect,
      targetDef,
    };
  }

  return {
    state: TARGET_STATES.TARGET_VISIBLE,
    element: el,
    rect: {
      top: rect.top,
      left: rect.left,
      bottom: rect.bottom,
      right: rect.right,
      width: rect.width,
      height: rect.height,
    },
    targetDef,
  };
}

/**
 * Checks whether target geometry has stabilized (e.g., animations finished).
 */
export function isGeometryStable(element, callback) {
  if (!element || typeof window === 'undefined') {
    callback(true, null);
    return;
  }

  const rect1 = element.getBoundingClientRect();
  requestAnimationFrame(() => {
    const rect2 = element.getBoundingClientRect();
    const isStable = (
      Math.abs(rect1.top - rect2.top) < 1 &&
      Math.abs(rect1.left - rect2.left) < 1 &&
      Math.abs(rect1.width - rect2.width) < 1 &&
      Math.abs(rect1.height - rect2.height) < 1
    );
    callback(isStable, rect2);
  });
}

/**
 * Asynchronously waits for a target to be mounted and visible in the DOM.
 * Enforces clean event/rAF-driven checks with a strict timeout boundary.
 */
export function waitForTarget(targetId, timeout = 3000, options = {}) {
  return new Promise((resolve) => {
    const startTime = Date.now();

    function check() {
      const res = resolveTarget(targetId, options);
      if (res.state === TARGET_STATES.TARGET_VISIBLE || res.state === TARGET_STATES.TARGET_OFFSCREEN) {
        isGeometryStable(res.element, (stable, finalRect) => {
          resolve({
            ...res,
            rect: finalRect ? {
              top: finalRect.top,
              left: finalRect.left,
              bottom: finalRect.bottom,
              right: finalRect.right,
              width: finalRect.width,
              height: finalRect.height,
            } : res.rect,
          });
        });
        return;
      }

      if (Date.now() - startTime >= timeout) {
        resolve({
          state: TARGET_STATES.TARGET_TIMEOUT,
          element: null,
          rect: null,
          targetDef: getTarget(targetId),
        });
        return;
      }

      requestAnimationFrame(check);
    }

    check();
  });
}
