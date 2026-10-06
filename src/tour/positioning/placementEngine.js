/**
 * AJ EcoDrive — Deterministic Pure Placement & Collision Engine
 * PROGRAM: AJ-TOUR-RECONSTRUCT-2026
 * PHASE 6: CHECKPOINT 6.1 — POSITIONING ENGINE
 *
 * Implements pure mathematical card placement:
 * - Real live target measurement
 * - Real live card measurement (replaces hardcoded 440x360 dimensions)
 * - Strict collision rejection against targets and occupied regions
 * - Graceful fallback to bottom-dock on constrained viewports
 * - Explicit TARGET_UNAVAILABLE state (no silent center fallback)
 */

import { isIntersecting } from '../geometry/occupiedRegions.js';
import { calculateConnector } from './connector.js';

export function calculatePlacement(
  viewportRect,
  targetRect,
  cardRect,
  occupiedRegions = [],
  safeInsets = { top: 16, left: 16, right: 16, bottom: 16 },
  preferredPlacement = 'right'
) {
  // 1. Missing target handling: Return explicit TARGET_UNAVAILABLE presentation mode
  if (!targetRect || targetRect.width === 0 || targetRect.height === 0) {
    return {
      mode: 'TARGET_UNAVAILABLE',
      placement: 'center',
      top: null,
      left: null,
      connector: null,
      collisionSummary: 'Target element is not present or visible in active viewport',
      reason: 'MISSING_TARGET',
    };
  }

  const gap = 16;
  const vw = viewportRect.width;
  const vh = viewportRect.height;
  const cw = cardRect.width || 380;
  const ch = cardRect.height || 260;

  // 2. Mobile or severely constrained viewport: Automatically dock to bottom
  if (vw < 640 || vh < 500) {
    return {
      mode: 'BOTTOM_DOCK',
      placement: 'dock',
      top: null,
      left: null,
      connector: null,
      collisionSummary: `Viewport constrained (${vw}x${vh}); bottom dock selected`,
      reason: 'CONSTRAINED_VIEWPORT',
    };
  }

  // 3. Priority candidate list
  const standardPlacements = ['right', 'left', 'bottom', 'top'];
  const candidates = [preferredPlacement];
  for (const p of standardPlacements) {
    if (!candidates.includes(p)) {
      candidates.push(p);
    }
  }

  // Safe viewport bounds
  const minX = safeInsets.left;
  const maxX = vw - safeInsets.right - cw;
  const minY = safeInsets.top;
  const maxY = vh - safeInsets.bottom - ch;

  for (const candidate of candidates) {
    let top = 0;
    let left = 0;

    if (candidate === 'right') {
      left = targetRect.right + gap;
      // Vertically center with target or align with top
      const idealTop = targetRect.top + (targetRect.height / 2) - (ch / 2);
      top = Math.max(minY, Math.min(maxY, idealTop));
    } else if (candidate === 'left') {
      left = targetRect.left - cw - gap;
      const idealTop = targetRect.top + (targetRect.height / 2) - (ch / 2);
      top = Math.max(minY, Math.min(maxY, idealTop));
    } else if (candidate === 'bottom') {
      top = targetRect.bottom + gap;
      const idealLeft = targetRect.left + (targetRect.width / 2) - (cw / 2);
      left = Math.max(minX, Math.min(maxX, idealLeft));
    } else if (candidate === 'top') {
      top = targetRect.top - ch - gap;
      const idealLeft = targetRect.left + (targetRect.width / 2) - (cw / 2);
      left = Math.max(minX, Math.min(maxX, idealLeft));
    }

    const testCardRect = {
      top,
      left,
      right: left + cw,
      bottom: top + ch,
      width: cw,
      height: ch,
    };

    // Hard Constraint 1: Check viewport bounds
    if (testCardRect.left < minX || testCardRect.right > vw - safeInsets.right ||
        testCardRect.top < minY || testCardRect.bottom > vh - safeInsets.bottom) {
      continue; // Exceeds safe viewport
    }

    // Hard Constraint 2: Must not intersect target element
    if (isIntersecting(testCardRect, targetRect, 2)) {
      continue; // Covers target
    }

    // Hard Constraint 3: Must not intersect blocking occupied regions
    let collidesWithOccupied = false;
    for (const region of occupiedRegions) {
      if (region.type === 'BLOCKING' && isIntersecting(testCardRect, region, 2)) {
        collidesWithOccupied = true;
        break;
      }
    }
    if (collidesWithOccupied) {
      continue; // Intersects occupied zone
    }

    // Valid candidate found!
    const connector = calculateConnector(testCardRect, targetRect, candidate);
    return {
      mode: 'FLOATING',
      placement: candidate,
      top: Math.round(top),
      left: Math.round(left),
      connector,
      collisionSummary: `Clean floating placement on ${candidate}`,
      reason: 'VALID_CANDIDATE',
    };
  }

  // 4. All floating candidates failed hard constraints: Fall back cleanly to BOTTOM_DOCK
  return {
    mode: 'BOTTOM_DOCK',
    placement: 'dock',
    top: null,
    left: null,
    connector: null,
    collisionSummary: 'All floating placements violated safe constraints; docked to bottom',
    reason: 'NO_CLEARANCE_DOCK_FALLBACK',
  };
}
