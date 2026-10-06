/**
 * AJ EcoDrive — Central Semantic Tour Target Registry
 * PROGRAM: AJ-TOUR-RECONSTRUCT-2026
 * PHASE 6: CHECKPOINT 6.1 — TARGET REGISTRY IMPLEMENTATION
 *
 * Implements the standard `data-tour-id` architecture with strict semantic naming:
 * <workspace>.<domain>.<surface>.<element>
 *
 * Enforces:
 * - Duplicate ID rejection
 * - Strict naming convention validation
 * - Target readiness classification
 * - Role & route awareness
 */

import { CURRICULUM_SEEDED_TARGETS } from './curriculumTargets.js';

const targetRegistry = new Map();

/**
 * Validates semantic Target ID naming structure:
 * <workspace>.<domain>.<surface>.<element-path>
 * Allowed workspaces: sa, bm, shared (lowercase only)
 * Minimum 4 dot-separated segments.
 */
export function validateTargetIdFormat(targetId) {
  if (typeof targetId !== 'string' || !targetId.trim()) {
    return { valid: false, error: 'Target ID must be a non-empty string' };
  }
  // Enforce lowercase only
  if (targetId !== targetId.toLowerCase()) {
    return {
      valid: false,
      error: `Target ID "${targetId}" must be entirely lowercase`,
    };
  }
  // Reject empty segments or consecutive dots
  if (targetId.includes('..') || targetId.startsWith('.') || targetId.endsWith('.')) {
    return {
      valid: false,
      error: `Target ID "${targetId}" contains invalid empty segments or dots`,
    };
  }
  const parts = targetId.split('.');
  if (parts.length < 4) {
    return { 
      valid: false, 
      error: `Target ID "${targetId}" must follow the strict 4-part semantic convention: <workspace>.<domain>.<surface>.<element-path>` 
    };
  }
  const [workspace, domain, surface, ...elementParts] = parts;
  if (!['sa', 'bm', 'shared'].includes(workspace)) {
    return { 
      valid: false, 
      error: `Target ID "${targetId}" has invalid workspace "${workspace}". Must be "sa", "bm", or "shared"` 
    };
  }
  const segRegex = /^[a-z0-9-]+$/;
  if (!segRegex.test(domain)) {
    return { valid: false, error: `Invalid domain segment "${domain}" in "${targetId}"` };
  }
  if (!segRegex.test(surface)) {
    return { valid: false, error: `Invalid surface segment "${surface}" in "${targetId}"` };
  }
  for (const seg of elementParts) {
    if (!segRegex.test(seg)) {
      return { valid: false, error: `Invalid element segment "${seg}" in "${targetId}"` };
    }
  }
  return { valid: true };
}

/**
 * Target Readiness Classes
 */
export const TARGET_READINESS_CLASSES = {
  STATIC_PAGE_TARGET: 'STATIC_PAGE_TARGET',
  ROUTE_MOUNT_TARGET: 'ROUTE_MOUNT_TARGET',
  ASYNC_CONTENT_TARGET: 'ASYNC_CONTENT_TARGET',
  USER_TRIGGERED_TARGET: 'USER_TRIGGERED_TARGET',
  MODAL_TARGET: 'MODAL_TARGET',
  DRAWER_TARGET: 'DRAWER_TARGET',
  CONDITIONAL_TARGET: 'CONDITIONAL_TARGET',
};

/**
 * Target State Model
 */
export const TARGET_STATES = {
  UNRESOLVED: 'UNRESOLVED',
  WAITING_FOR_TARGET: 'WAITING_FOR_TARGET',
  TARGET_FOUND: 'TARGET_FOUND',
  TARGET_VISIBLE: 'TARGET_VISIBLE',
  TARGET_OFFSCREEN: 'TARGET_OFFSCREEN',
  TARGET_OBSCURED: 'TARGET_OBSCURED',
  TARGET_HIDDEN_CONDITIONALLY: 'TARGET_HIDDEN_CONDITIONALLY',
  TARGET_TIMEOUT: 'TARGET_TIMEOUT',
  TARGET_REMOVED_DURING_STEP: 'TARGET_REMOVED_DURING_STEP',
};

/**
 * Registers a semantic target into the central registry.
 * Throws an error on duplicate IDs or malformed definitions.
 */
export function registerTarget(definition) {
  if (!definition || typeof definition !== 'object') {
    throw new Error('Target definition must be an object');
  }

  const { targetId } = definition;
  const validation = validateTargetIdFormat(targetId);
  if (!validation.valid) {
    throw new Error(`Target registration failed: ${validation.error}`);
  }

  if (targetRegistry.has(targetId)) {
    throw new Error(`Duplicate target ID detected: "${targetId}". Target IDs must be globally unique.`);
  }

  const targetDef = {
    targetId,
    selector: definition.selector || `[data-tour-id="${targetId}"]`,
    workspace: definition.workspace || (targetId.startsWith('sa.') ? 'Super Admin' : targetId.startsWith('bm.') ? 'Branch Manager' : 'Shared'),
    route: definition.route || '*',
    surface: definition.surface || 'General',
    required: definition.required !== false,
    readinessClass: definition.readinessClass || TARGET_READINESS_CLASSES.STATIC_PAGE_TARGET,
    preferredPlacement: definition.preferredPlacement || 'right',
    scrollContext: definition.scrollContext || 'window',
    responsiveAvailability: definition.responsiveAvailability || 'all',
    interactionExpectation: definition.interactionExpectation || 'none',
    description: definition.description || '',
    legacySelector: definition.legacySelector || null,
  };

  targetRegistry.set(targetId, targetDef);
  return targetDef;
}

export function getTarget(targetId) {
  return targetRegistry.get(targetId) || null;
}

export function hasTarget(targetId) {
  return targetRegistry.has(targetId);
}

export function getAllTargets() {
  return Array.from(targetRegistry.values());
}

export function clearRegistry() {
  targetRegistry.clear();
}

/**
 * Audits registry integrity and returns summary metrics
 */
export function validateRegistry() {
  const targets = getAllTargets();
  const duplicateCheck = new Set();
  const errors = [];

  for (const t of targets) {
    if (duplicateCheck.has(t.targetId)) {
      errors.push(`Duplicate ID: ${t.targetId}`);
    }
    duplicateCheck.add(t.targetId);

    const v = validateTargetIdFormat(t.targetId);
    if (!v.valid) {
      errors.push(v.error);
    }
  }

  return {
    total: targets.length,
    valid: errors.length === 0,
    errors,
  };
}

// ============================================================
// REPRESENTATIVE INITIAL SEED TARGETS (CHECKPOINT 6.1 PROOF SET)
// ============================================================

export function seedRepresentativeTargets() {
  const seedList = [
    // Shared Layout & Navigation
    {
      targetId: 'shared.layout.header.role-badge',
      workspace: 'Shared',
      route: '*',
      surface: 'MainLayout Header',
      readinessClass: TARGET_READINESS_CLASSES.STATIC_PAGE_TARGET,
      preferredPlacement: 'bottom',
      description: 'Active authenticated workspace indicator badge in top navbar',
    },
    {
      targetId: 'shared.layout.header.branch-switcher',
      workspace: 'Super Admin',
      route: '*',
      surface: 'MainLayout Header',
      readinessClass: TARGET_READINESS_CLASSES.STATIC_PAGE_TARGET,
      preferredPlacement: 'bottom',
      description: 'Multi-branch viewport switcher in top navigation',
    },
    {
      targetId: 'shared.layout.header.action-centre',
      workspace: 'Shared',
      route: '*',
      surface: 'MainLayout Header',
      readinessClass: TARGET_READINESS_CLASSES.STATIC_PAGE_TARGET,
      preferredPlacement: 'bottom',
      description: 'Action Centre pending task badge trigger in top header',
    },
    {
      targetId: 'shared.layout.nav.sidebar',
      workspace: 'Shared',
      route: '*',
      surface: 'MainLayout Sidebar',
      readinessClass: TARGET_READINESS_CLASSES.STATIC_PAGE_TARGET,
      preferredPlacement: 'right',
      description: 'Primary dealership navigation sidebar rail',
    },

    // Super Admin Dashboard KPIs & Tables
    {
      targetId: 'sa.dashboard.kpi.net-sales',
      workspace: 'Super Admin',
      route: '/dashboard',
      surface: 'Super Admin Dashboard',
      readinessClass: TARGET_READINESS_CLASSES.ROUTE_MOUNT_TARGET,
      preferredPlacement: 'bottom',
      description: 'Consolidated network net sales revenue KPI card',
    },
    {
      targetId: 'sa.dashboard.kpi.gross-profit',
      workspace: 'Super Admin',
      route: '/dashboard',
      surface: 'Super Admin Dashboard',
      readinessClass: TARGET_READINESS_CLASSES.ROUTE_MOUNT_TARGET,
      preferredPlacement: 'bottom',
      description: 'Consolidated gross profit margin KPI card',
    },
    {
      targetId: 'sa.dashboard.kpi.inventory-value',
      workspace: 'Super Admin',
      route: '/dashboard',
      surface: 'Super Admin Dashboard',
      readinessClass: TARGET_READINESS_CLASSES.ROUTE_MOUNT_TARGET,
      preferredPlacement: 'bottom',
      description: 'Total active owned unsold inventory valuation KPI card',
    },
    {
      targetId: 'sa.dashboard.table.branch-performance',
      workspace: 'Super Admin',
      route: '/dashboard',
      surface: 'Super Admin Dashboard',
      readinessClass: TARGET_READINESS_CLASSES.ROUTE_MOUNT_TARGET,
      preferredPlacement: 'top',
      description: 'Multi-branch commercial performance comparison leaderboard',
    },

    // Branch Manager Dashboard KPIs
    {
      targetId: 'bm.dashboard.kpi.net-sales',
      workspace: 'Branch Manager',
      route: '/dashboard',
      surface: 'Branch Dashboard',
      readinessClass: TARGET_READINESS_CLASSES.ROUTE_MOUNT_TARGET,
      preferredPlacement: 'bottom',
      description: 'Showroom local net sales revenue KPI card',
    },
    {
      targetId: 'bm.dashboard.kpi.floor-stock',
      workspace: 'Branch Manager',
      route: '/dashboard',
      surface: 'Branch Dashboard',
      readinessClass: TARGET_READINESS_CLASSES.ROUTE_MOUNT_TARGET,
      preferredPlacement: 'bottom',
      description: 'Showroom physical available floor stock count KPI card',
    },
    {
      targetId: 'bm.dashboard.kpi.pending-deliveries',
      workspace: 'Branch Manager',
      route: '/dashboard',
      surface: 'Branch Dashboard',
      readinessClass: TARGET_READINESS_CLASSES.ROUTE_MOUNT_TARGET,
      preferredPlacement: 'bottom',
      description: 'Showroom reserved units awaiting customer handover delivery',
    },

    // Form Controls (Customer Creation Form)
    {
      targetId: 'bm.customer.form.first-name',
      workspace: 'Branch Manager',
      route: '/sales/customers',
      surface: 'Create Customer Modal',
      readinessClass: TARGET_READINESS_CLASSES.MODAL_TARGET,
      preferredPlacement: 'right',
      scrollContext: 'modal',
      interactionExpectation: 'type',
      description: 'Customer first legal name input field',
    },
    {
      targetId: 'bm.customer.form.phone',
      workspace: 'Branch Manager',
      route: '/sales/customers',
      surface: 'Create Customer Modal',
      readinessClass: TARGET_READINESS_CLASSES.MODAL_TARGET,
      preferredPlacement: 'right',
      scrollContext: 'modal',
      interactionExpectation: 'type',
      description: 'Customer primary contact telephone number input',
    },
    {
      targetId: 'bm.customer.form.cnic',
      workspace: 'Branch Manager',
      route: '/sales/customers',
      surface: 'Create Customer Modal',
      readinessClass: TARGET_READINESS_CLASSES.MODAL_TARGET,
      preferredPlacement: 'right',
      scrollContext: 'modal',
      interactionExpectation: 'type',
      description: 'Customer identity card number input field',
    },

    // Action Centre Queue & Drawer
    {
      targetId: 'sa.action-centre.queue.list',
      workspace: 'Super Admin',
      route: '/dashboard/action-centre',
      surface: 'Action Centre Hub',
      readinessClass: TARGET_READINESS_CLASSES.ROUTE_MOUNT_TARGET,
      preferredPlacement: 'right',
      description: 'Central executive task queues list',
    },
    {
      targetId: 'sa.action-centre.drawer.approve-btn',
      workspace: 'Super Admin',
      route: '/dashboard/action-centre',
      surface: 'Action Centre Treatment Drawer',
      readinessClass: TARGET_READINESS_CLASSES.DRAWER_TARGET,
      preferredPlacement: 'left',
      scrollContext: 'drawer',
      interactionExpectation: 'click',
      description: 'Executive approval authorization button in treatment drawer',
    },

    // Transfers Table Action
    {
      targetId: 'bm.transfers.row.receive-btn',
      workspace: 'Branch Manager',
      route: '/inventory/transfers',
      surface: 'Transfers Table',
      readinessClass: TARGET_READINESS_CLASSES.ROUTE_MOUNT_TARGET,
      preferredPlacement: 'left',
      interactionExpectation: 'click',
      description: 'Inbound transfer row receive units action button',
    },

    // Offscreen / Dynamic Target (Footer or Table Bottom)
    {
      targetId: 'shared.layout.footer.version-tag',
      workspace: 'Shared',
      route: '*',
      surface: 'Application Footer',
      readinessClass: TARGET_READINESS_CLASSES.STATIC_PAGE_TARGET,
      preferredPlacement: 'top',
      description: 'Application software build and environment version tag in footer',
    },
  ];

  for (const item of seedList) {
    if (!targetRegistry.has(item.targetId)) {
      registerTarget(item);
    }
  }

  if (Array.isArray(CURRICULUM_SEEDED_TARGETS)) {
    for (const item of CURRICULUM_SEEDED_TARGETS) {
      if (!targetRegistry.has(item.targetId)) {
        registerTarget(item);
      }
    }
  }
}

// Automatically seed representative targets on import
seedRepresentativeTargets();
