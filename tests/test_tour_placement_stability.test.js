import { describe, it, expect } from 'vitest';
import { calculatePlacement } from '../src/tour/positioning/placementEngine.js';
import { isIntersecting } from '../src/tour/geometry/occupiedRegions.js';

describe('Tour Placement Stability & Anti-Thrashing Suite (AJ-TOUR-STABILITY-2026)', () => {
  const standardViewport = { width: 1440, height: 900, top: 0, left: 0, right: 1440, bottom: 900 };
  const safeInsets = { top: 16, left: 16, right: 16, bottom: 16 };
  const standardCardSize = { width: 420, height: 260 };
  const occupiedHeaderAndSidebar = [
    { id: 'header', type: 'BLOCKING', top: 0, left: 256, right: 1440, bottom: 72, width: 1184, height: 72 },
    { id: 'sidebar', type: 'BLOCKING', top: 0, left: 0, right: 256, bottom: 900, width: 256, height: 900 }
  ];

  it('guarantees that a stationary target, stationary viewport, and unchanged card produce a stationary placement', () => {
    // Representative stationary table target
    const target = { top: 320, left: 288, right: 1408, bottom: 600, width: 1120, height: 280 };

    // Initial placement calculation
    const initial = calculatePlacement(
      standardViewport,
      target,
      standardCardSize,
      occupiedHeaderAndSidebar,
      safeInsets,
      'top',
      null
    );

    expect(initial.mode).toBeDefined();
    expect(initial.placement).toBeDefined();

    // 20 successive evaluation ticks with stationary conditions
    for (let tick = 1; tick <= 20; tick++) {
      const res = calculatePlacement(
        standardViewport,
        target,
        standardCardSize,
        occupiedHeaderAndSidebar,
        safeInsets,
        'top',
        initial.placement
      );

      expect(res.mode).toBe(initial.mode);
      expect(res.placement).toBe(initial.placement);
      expect(res.top).toBe(initial.top);
      expect(res.left).toBe(initial.left);
    }
  });

  it('preserves placement stability across minor subpixel dimensional fluctuations (hysteresis)', () => {
    const target = { top: 320, left: 288, right: 1408, bottom: 600, width: 1120, height: 280 };

    const initial = calculatePlacement(
      standardViewport,
      target,
      standardCardSize,
      occupiedHeaderAndSidebar,
      safeInsets,
      'top',
      null
    );

    let currentPlacement = initial.placement;

    // Simulate minor subpixel dimensional fluctuations (±3px height and width variations)
    const fluctuations = [
      { width: 421, height: 259 },
      { width: 419, height: 261 },
      { width: 422, height: 258 },
      { width: 420, height: 262 },
      { width: 418, height: 260 },
      { width: 420, height: 260 },
    ];

    for (const size of fluctuations) {
      const res = calculatePlacement(
        standardViewport,
        target,
        size,
        occupiedHeaderAndSidebar,
        safeInsets,
        'top',
        currentPlacement
      );

      // Placement must remain locked to the same direction without flipping
      expect(res.placement).toBe(initial.placement);
      expect(res.mode).toBe(initial.mode);
      currentPlacement = res.placement;
    }
  });

  it('guarantees deterministic, stationary placement for SA-06 Product Requests across reference viewports', () => {
    // Reference viewports: 1440x900 (Desktop), 1366x768 (Standard Laptop), 1280x800 (Compact Laptop), 1920x1080 (FHD)
    const resolutions = [
      { w: 1440, h: 900 },
      { w: 1366, h: 768 },
      { w: 1280, h: 800 },
      { w: 1920, h: 1080 }
    ];

    for (const res of resolutions) {
      const vp = { width: res.w, height: res.h, top: 0, left: 0, right: res.w, bottom: res.h };
      const sidebarWidth = 256;
      const headerHeight = 72;
      const contentWidth = Math.min(1280, res.w - sidebarWidth);
      const leftMargin = sidebarWidth + (res.w - sidebarWidth - contentWidth) / 2 + 32;
      const tableWidth = contentWidth - 64;

      const sa06TableRect = {
        top: 320,
        left: leftMargin,
        right: leftMargin + tableWidth,
        bottom: 580,
        width: tableWidth,
        height: 260,
      };

      const occupied = [
        { id: 'header', type: 'BLOCKING', top: 0, left: sidebarWidth, right: res.w, bottom: headerHeight, width: res.w - sidebarWidth, height: headerHeight },
        { id: 'sidebar', type: 'BLOCKING', top: 0, left: 0, right: sidebarWidth, bottom: res.h, width: sidebarWidth, height: res.h }
      ];

      // Initial placement
      const first = calculatePlacement(vp, sa06TableRect, standardCardSize, occupied, safeInsets, 'top', null);
      expect(first.mode).toMatch(/^(FLOATING|BOTTOM_DOCK)$/);

      // 10 repeated frames simulating stationary render
      for (let frame = 1; frame <= 10; frame++) {
        const next = calculatePlacement(vp, sa06TableRect, standardCardSize, occupied, safeInsets, 'top', first.placement);
        expect(next.placement).toBe(first.placement);
        expect(next.mode).toBe(first.mode);
      }
    }
  });

  it('maintains collision detection against targets and occupied regions', () => {
    // Target in the middle of screen
    const target = { top: 300, left: 500, right: 700, bottom: 400, width: 200, height: 100 };
    // Blocking modal overlay covering bottom area
    const occupied = [
      { id: 'modal', type: 'BLOCKING', top: 410, left: 400, right: 800, bottom: 850, width: 400, height: 440 }
    ];

    const res = calculatePlacement(standardViewport, target, standardCardSize, occupied, safeInsets, 'bottom', null);
    // Because bottom is blocked by modal, it must NOT place on bottom
    expect(res.placement).not.toBe('bottom');

    if (res.mode === 'FLOATING') {
      const cardRect = { top: res.top, left: res.left, right: res.left + standardCardSize.width, bottom: res.top + standardCardSize.height };
      expect(isIntersecting(cardRect, target, 2)).toBe(false);
      expect(isIntersecting(cardRect, occupied[0], 2)).toBe(false);
    }
  });

  it('maintains responsive repositioning when target moves or viewport changes', () => {
    // Initially at top
    const target1 = { top: 700, left: 500, right: 700, bottom: 800, width: 200, height: 100 };
    const res1 = calculatePlacement(standardViewport, target1, standardCardSize, [], safeInsets, 'top', null);
    expect(res1.placement).toBe('top');

    // Target moves to top of screen (user scrolled down)
    const target2 = { top: 30, left: 500, right: 700, bottom: 130, width: 200, height: 100 };
    // Now previous placement 'top' is no longer valid because it would be off-screen
    const res2 = calculatePlacement(standardViewport, target2, standardCardSize, [], safeInsets, 'top', res1.placement);
    // It must responsively move to a valid placement (e.g. right or bottom)
    expect(res2.placement).not.toBe('top');
    expect(['right', 'bottom', 'left']).toContain(res2.placement);
    expect(res2.mode).toBe('FLOATING');
  });

  it('retains mobile bottom-dock mode on small viewports (<=640px)', () => {
    const mobileViewport = { width: 390, height: 844, top: 0, left: 0, right: 390, bottom: 844 };
    const target = { top: 200, left: 20, right: 370, bottom: 250, width: 350, height: 50 };

    const res = calculatePlacement(mobileViewport, target, { width: 350, height: 200 }, [], safeInsets, 'right', null);
    expect(res.mode).toBe('BOTTOM_DOCK');
    expect(res.placement).toBe('dock');

    const boundary640 = { width: 640, height: 800, top: 0, left: 0, right: 640, bottom: 800 };
    const res640 = calculatePlacement(boundary640, target, { width: 350, height: 200 }, [], safeInsets, 'right', null);
    expect(res640.mode).toBe('BOTTOM_DOCK');
    expect(res640.placement).toBe('dock');
  });
});
