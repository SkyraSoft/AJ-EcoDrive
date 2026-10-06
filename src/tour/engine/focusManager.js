/**
 * AJ EcoDrive — Accessible Focus & Keyboard Interaction Manager
 * PROGRAM: AJ-TOUR-RECONSTRUCT-2026
 * PHASE 6: CHECKPOINT 6.1 — ACCESSIBILITY RUNTIME
 *
 * Implements:
 * - Focus containment for modal Observe steps
 * - Non-modal Context Help freedom (no focus trap)
 * - Practice mode target focus handoff without focus stealing
 * - Polite vs Assertive screen reader announcements
 * - Escape key ownership hierarchy
 * - Reduced motion support
 */

let previousActiveElement = null;
let currentKeydownHandler = null;

export function isReducedMotionPreferred() {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function saveActiveElement() {
  if (typeof document !== 'undefined') {
    previousActiveElement = document.activeElement;
  }
}

export function restoreActiveElement() {
  if (previousActiveElement && typeof previousActiveElement.focus === 'function') {
    try {
      previousActiveElement.focus();
    } catch (e) {
      // ignore
    }
  }
  previousActiveElement = null;
}

/**
 * Traps keyboard focus within containerEl (used for Modal Observe cards).
 */
export function trapFocus(containerEl) {
  releaseFocusTrap();

  if (!containerEl) return;

  const focusableSelectors = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(', ');

  currentKeydownHandler = (e) => {
    if (e.key !== 'Tab') return;

    const focusables = Array.from(containerEl.querySelectorAll(focusableSelectors));
    if (focusables.length === 0) {
      e.preventDefault();
      return;
    }

    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first || !containerEl.contains(document.activeElement)) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last || !containerEl.contains(document.activeElement)) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  document.addEventListener('keydown', currentKeydownHandler);
}

export function releaseFocusTrap() {
  if (currentKeydownHandler) {
    document.removeEventListener('keydown', currentKeydownHandler);
    currentKeydownHandler = null;
  }
}

/**
 * Sets focus safely to the practice target element without interfering with user typing.
 */
export function focusPracticeTarget(targetEl) {
  if (!targetEl || typeof targetEl.focus !== 'function') return;
  // If user is already focused on target or child, don't re-steal
  if (document.activeElement && (document.activeElement === targetEl || targetEl.contains(document.activeElement))) {
    return;
  }
  try {
    targetEl.focus();
  } catch (e) {
    // ignore
  }
}

/**
 * Screen Reader Live Region Announcer
 */
let liveRegionPolite = null;
let liveRegionAssertive = null;

export function ensureLiveRegions() {
  if (typeof document === 'undefined') return;

  if (!liveRegionPolite) {
    liveRegionPolite = document.createElement('div');
    liveRegionPolite.setAttribute('aria-live', 'polite');
    liveRegionPolite.setAttribute('aria-atomic', 'true');
    liveRegionPolite.className = 'sr-only';
    liveRegionPolite.style.cssText = 'position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;';
    document.body.appendChild(liveRegionPolite);
  }

  if (!liveRegionAssertive) {
    liveRegionAssertive = document.createElement('div');
    liveRegionAssertive.setAttribute('aria-live', 'assertive');
    liveRegionAssertive.setAttribute('aria-atomic', 'true');
    liveRegionAssertive.className = 'sr-only';
    liveRegionAssertive.style.cssText = 'position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;';
    document.body.appendChild(liveRegionAssertive);
  }
}

export function announce(message, priority = 'polite') {
  ensureLiveRegions();
  const region = priority === 'assertive' ? liveRegionAssertive : liveRegionPolite;
  if (region) {
    region.textContent = '';
    setTimeout(() => {
      region.textContent = message;
    }, 50);
  }
}
