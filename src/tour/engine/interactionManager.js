/**
 * AJ EcoDrive — Interactive Engine & Mutation Risk Manager
 * PROGRAM: AJ-TOUR-RECONSTRUCT-2026
 * PHASE 6: PRACTICE MODE INTERACTION INTEGRITY RUNTIME
 *
 * Implements:
 * - Real live user input observation without synthetic simulation
 * - Non-blocking passive observation (zero event.preventDefault / stopPropagation)
 * - Postcondition verification (route changes, modal/drawer appearances)
 * - Keyboard activation support (Enter / Space on actionable elements)
 * - Invariant enforcement: hit-testing, inert exclusion, and prerequisite checking
 */

export const MUTATION_RISK_CLASSES = {
  RISK_0_READ_ONLY: 'RISK_0_READ_ONLY',
  RISK_1_UI_STATE_ONLY: 'RISK_1_UI_STATE_ONLY',
  RISK_2_DRAFT_OR_REVERSIBLE: 'RISK_2_DRAFT_OR_REVERSIBLE',
  RISK_3_BUSINESS_RECORD_MUTATION: 'RISK_3_BUSINESS_RECORD_MUTATION',
  RISK_4_SENSITIVE_OR_IRREVERSIBLE: 'RISK_4_SENSITIVE_OR_IRREVERSIBLE',
};

export const PRACTICE_INVARIANTS = {
  INV_PRACTICE_001: 'Expected interactive target must be hit-testable.',
  INV_PRACTICE_002: 'Tour visual layers must not intercept intended application target interaction.',
  INV_PRACTICE_003: 'Expected target must not be inside an inert subtree.',
  INV_PRACTICE_004: 'Tour event observers must not prevent the native expected action.',
  INV_PRACTICE_005: 'Practice completion must use the configured completion/postcondition rule.',
  INV_PRACTICE_006: 'Click observed != success when expected application outcome did not occur.',
  INV_PRACTICE_007: 'Tour must never forcibly enable application-disabled business controls.',
  INV_PRACTICE_008: 'If a prerequisite is required, tour must establish or teach it before the action step.',
  INV_PRACTICE_009: 'High-risk business actions remain deliberate user actions.',
  INV_PRACTICE_010: 'Keyboard activation must work wherever the underlying control supports it.',
};

let activeTargetElement = null;
let activeListeners = [];

export function cleanUpInteractionListeners() {
  if (activeTargetElement && activeListeners.length > 0) {
    for (const { element, event, handler } of activeListeners) {
      if (element && typeof element.removeEventListener === 'function') {
        element.removeEventListener(event, handler);
      }
    }
  }
  activeTargetElement = null;
  activeListeners = [];
}

/**
 * Checks whether an element is currently interactive and not inert or disabled.
 */
export function checkTargetInteractivity(targetEl) {
  if (!targetEl) {
    return { interactive: false, reason: 'TARGET_NOT_FOUND' };
  }
  const actionableEl = targetEl.matches('input, select, textarea, button, a, [role="button"]')
    ? targetEl
    : targetEl.querySelector('input, select, textarea, button, a, [role="button"]') || targetEl;

  if (actionableEl.disabled || actionableEl.getAttribute('aria-disabled') === 'true') {
    return { interactive: false, reason: 'TARGET_DISABLED_BY_APPLICATION' };
  }
  if (actionableEl.closest('[inert]')) {
    return { interactive: false, reason: 'TARGET_INSIDE_INERT_TREE' };
  }
  return { interactive: true, reason: 'OK' };
}

/**
 * Validates whether user input satisfies the step's expected rule.
 */
export function validateInputValue(val, step) {
  if (!step) return { valid: true };

  // If no validation required
  if (!step.validation && !step.expectedValue && !step.required && !step.pattern && !step.minLength) {
    return { valid: true };
  }

  const strVal = String(val !== undefined && val !== null ? val : '').trim();

  // 1. Required check
  if (step.required && !strVal) {
    return { valid: false, error: 'Please enter a value to proceed' };
  }

  // 2. Minimum length check
  if (step.minLength && strVal.length < step.minLength) {
    return { valid: false, error: `Value must be at least ${step.minLength} characters` };
  }

  // 3. Exact match check
  if (step.expectedValue !== undefined && step.expectedValue !== null) {
    if (strVal !== String(step.expectedValue).trim()) {
      return { valid: false, error: `Expected value: ${step.expectedValue}` };
    }
  }

  // 4. Phone validation
  if (step.validation === 'phone') {
    const clean = strVal.replace(/[\s\-\(\)\+]/g, '');
    if (clean.length < 7) {
      return { valid: false, error: 'Please enter a valid phone number (at least 7 digits)' };
    }
  }

  // 5. Numeric range check
  if (step.validation === 'number' || step.validation === 'positive_number') {
    const num = parseFloat(strVal);
    if (isNaN(num)) {
      return { valid: false, error: 'Please enter a valid numeric value' };
    }
    if (step.validation === 'positive_number' && num <= 0) {
      return { valid: false, error: 'Value must be greater than zero' };
    }
    if (step.min !== undefined && num < step.min) {
      return { valid: false, error: `Minimum required value is ${step.min}` };
    }
    if (step.max !== undefined && num > step.max) {
      return { valid: false, error: `Maximum allowed value is ${step.max}` };
    }
  }

  // 6. Pattern check
  if (step.pattern) {
    try {
      const reg = new RegExp(step.pattern);
      if (!reg.test(strVal)) {
        return { valid: false, error: step.patternError || 'Value does not match required format' };
      }
    } catch (e) {
      // ignore
    }
  }

  return { valid: true };
}

/**
 * Verifies postconditions after a user action occurs.
 */
export function evaluatePostcondition(step) {
  if (!step) return true;

  // 1. Route postcondition
  if (step.postconditionRoute) {
    if (typeof window !== 'undefined' && window.location.pathname === step.postconditionRoute) {
      return true;
    }
    return false;
  }

  // 2. DOM selector postcondition (e.g. modal, drawer, alert)
  if (step.postconditionSelector) {
    if (typeof document !== 'undefined') {
      try {
        const el = document.querySelector(step.postconditionSelector);
        if (el) {
          return true;
        }
      } catch (e) {
        // ignore
      }
    }
    return false;
  }

  // 3. Function / custom rule
  if (typeof step.postcondition === 'function') {
    try {
      return Boolean(step.postcondition());
    } catch (e) {
      return false;
    }
  }

  // If no postcondition specified, clicking the control satisfies the step
  return true;
}

/**
 * Binds DOM event listeners to the active target element for Practice mode.
 * Enforces non-blocking observation (never stops propagation or prevents default).
 */
export function bindTargetInteraction(targetEl, step, onValid, onInvalid) {
  cleanUpInteractionListeners();

  if (!targetEl || !step) return cleanUpInteractionListeners;

  activeTargetElement = targetEl;

  // Resolve actionable interactive control inside target
  const actionableEl = targetEl.matches('input, select, textarea, button, a, [role="button"]')
    ? targetEl
    : targetEl.querySelector('input, select, textarea, button, a, [role="button"]') || targetEl;

  // Invariant 007: Do not bypass legitimately disabled application controls
  if (actionableEl.disabled || actionableEl.getAttribute('aria-disabled') === 'true') {
    if (typeof onInvalid === 'function') {
      onInvalid('Control is currently disabled by application prerequisites.');
    }
    return cleanUpInteractionListeners;
  }

  // Invariant 003: Target must not be inside an inert tree
  if (actionableEl.closest('[inert]')) {
    if (typeof onInvalid === 'function') {
      onInvalid('Target control is inside an inert subtree.');
    }
    return cleanUpInteractionListeners;
  }

  function handleInput(e) {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    const res = validateInputValue(val, step);
    if (res.valid) {
      if (typeof onValid === 'function') onValid(true);
    } else {
      if (typeof onInvalid === 'function') onInvalid(res.error);
    }
  }

  function executeEvaluation() {
    const postconditionMet = evaluatePostcondition(step);
    if (postconditionMet) {
      if (typeof onValid === 'function') onValid(true);
    } else {
      // If an explicit postcondition was expected but did not appear
      if (step.postconditionRoute || step.postconditionSelector || step.postcondition) {
        if (typeof onInvalid === 'function') onInvalid('Expected application outcome did not occur.');
      } else {
        if (typeof onValid === 'function') onValid(true);
      }
    }
  }

  function handleActionClick(e) {
    // PASSIVE OBSERVATION: Never call e.preventDefault() or e.stopPropagation()
    // Let the application's native event handlers execute completely.
    executeEvaluation();
  }

  function handleActionKeydown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      handleActionClick(e);
    }
  }

  const isClickStep = (
    step.mode === 'CLICK' ||
    step.mode === 'OPEN_SURFACE' ||
    step.mode === 'PRACTICE' ||
    step.trainingType === 'practice' ||
    step.action === 'click' ||
    step.expectedAction === 'CLICK' ||
    step.actionType === 'CLICK' ||
    step.actionType === 'NAVIGATE' ||
    step.actionType === 'OPEN_MODAL' ||
    step.actionType === 'OPEN_DRAWER' ||
    actionableEl.matches('button, a, [role="button"]')
  );

  const listeners = [];

  if (actionableEl.matches('input, textarea')) {
    const inputH = { element: actionableEl, event: 'input', handler: handleInput };
    const changeH = { element: actionableEl, event: 'change', handler: handleInput };
    actionableEl.addEventListener('input', handleInput);
    actionableEl.addEventListener('change', handleInput);
    listeners.push(inputH, changeH);
  } else if (actionableEl.matches('select')) {
    const changeH = { element: actionableEl, event: 'change', handler: handleInput };
    actionableEl.addEventListener('change', handleInput);
    listeners.push(changeH);
  }

  if (isClickStep) {
    const clickH = { element: actionableEl, event: 'click', handler: handleActionClick };
    const keyH = { element: actionableEl, event: 'keydown', handler: handleActionKeydown };
    actionableEl.addEventListener('click', handleActionClick);
    actionableEl.addEventListener('keydown', handleActionKeydown);
    listeners.push(clickH, keyH);
  }

  activeListeners = listeners;
  return cleanUpInteractionListeners;
}
