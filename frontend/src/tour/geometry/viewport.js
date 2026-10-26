/**
 * AJ EcoDrive — Viewport Geometry & Safe Insets Service
 * PROGRAM: AJ-TOUR-RECONSTRUCT-2026
 * PHASE 6: CHECKPOINT 6.1 — VIEWPORT SERVICE
 */

export function getViewportRect() {
  if (typeof window === 'undefined') {
    return { width: 1024, height: 768, top: 0, left: 0, right: 1024, bottom: 768 };
  }

  if (window.visualViewport) {
    const vv = window.visualViewport;
    return {
      width: vv.width,
      height: vv.height,
      top: vv.pageTop,
      left: vv.pageLeft,
      right: vv.pageLeft + vv.width,
      bottom: vv.pageTop + vv.height,
    };
  }

  return {
    width: window.innerWidth,
    height: window.innerHeight,
    top: window.scrollY || 0,
    left: window.scrollX || 0,
    right: (window.scrollX || 0) + window.innerWidth,
    bottom: (window.scrollY || 0) + window.innerHeight,
  };
}

export function getSafeInsets() {
  return {
    top: 16,
    left: 16,
    right: 16,
    bottom: 16,
  };
}
