/**
 * AJ EcoDrive — Dynamic Occupied Region Registry & Collision Analyzer
 * PROGRAM: AJ-TOUR-RECONSTRUCT-2026
 * PHASE 6: CHECKPOINT 6.1 — GEOMETRY RUNTIME
 *
 * Measures live occupied zones (Header, Sidebar, Modals, Drawers, Floating HUD)
 * dynamically using getBoundingClientRect() rather than hardcoded pixel constants.
 */

export function isIntersecting(rectA, rectB, tolerance = 0) {
  if (!rectA || !rectB) return false;
  return !(
    rectA.right - tolerance <= rectB.left ||
    rectA.left + tolerance >= rectB.right ||
    rectA.bottom - tolerance <= rectB.top ||
    rectA.top + tolerance >= rectB.bottom
  );
}

/**
 * Measures all active persistent UI structures and active overlays.
 */
export function getOccupiedRegions(options = {}) {
  if (typeof document === 'undefined') return [];

  const regions = [];

  // 1. Application Header (Top Bar)
  const headerEl = document.querySelector('header, [data-tour-region="header"], .app-header');
  if (headerEl) {
    const r = headerEl.getBoundingClientRect();
    if (r.height > 0 && r.width > 0) {
      regions.push({ id: 'header', type: 'BLOCKING', top: r.top, left: r.left, right: r.right, bottom: r.bottom, width: r.width, height: r.height });
    }
  }

  // 2. Navigation Sidebar
  const sidebarEl = document.querySelector('aside, [data-tour-region="sidebar"], .app-sidebar');
  if (sidebarEl) {
    const r = sidebarEl.getBoundingClientRect();
    if (r.width > 0 && r.height > 0) {
      regions.push({ id: 'sidebar', type: 'BLOCKING', top: r.top, left: r.left, right: r.right, bottom: r.bottom, width: r.width, height: r.height });
    }
  }

  // 3. Floating HUD / Tour Controls
  const hudEl = document.querySelector('#dap-floating-hud, .dap-floating-hud, [data-tour-region="hud"]');
  if (hudEl) {
    const r = hudEl.getBoundingClientRect();
    if (r.width > 0 && r.height > 0) {
      regions.push({ id: 'hud', type: 'BLOCKING', top: r.top, left: r.left, right: r.right, bottom: r.bottom, width: r.width, height: r.height });
    }
  }

  // 4. Active Drawers (exclude if target is inside drawer)
  const drawerEls = document.querySelectorAll('[data-drawer], .drawer-container, [role="complementary"]');
  drawerEls.forEach((del, i) => {
    if (options.targetElement && del.contains(options.targetElement)) return;
    const r = del.getBoundingClientRect();
    if (r.width > 0 && r.height > 0) {
      regions.push({ id: `drawer-${i}`, type: 'BLOCKING', top: r.top, left: r.left, right: r.right, bottom: r.bottom, width: r.width, height: r.height });
    }
  });

  return regions;
}
