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

  const targetDef = getTarget(targetId);
  let el = null;

  // 1. Primary semantic resolution via [data-tour-id="..."]
  if (options.recordId) {
    el = document.querySelector(`[data-tour-id="${targetId}"][data-record-id="${options.recordId}"]`) ||
         document.querySelector(`[data-record-id="${options.recordId}"] [data-tour-id="${targetId}"]`);
  }

  if (!el) {
    el = document.querySelector(`[data-tour-id="${targetId}"]`);
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
