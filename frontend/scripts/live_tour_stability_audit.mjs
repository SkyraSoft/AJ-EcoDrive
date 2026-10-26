import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';
import path from 'path';
import os from 'os';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TEMP_USER_DATA = path.join(os.tmpdir(), 'chrome_tour_audit_' + Date.now());

class CDPClient {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.ws = null;
    this.id = 1;
    this.callbacks = new Map();
  }

  async connect() {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.wsUrl);
      this.ws.onopen = () => resolve();
      this.ws.onerror = (err) => reject(err);
      this.ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.id && this.callbacks.has(msg.id)) {
          const { resolve, reject } = this.callbacks.get(msg.id);
          this.callbacks.delete(msg.id);
          if (msg.error) reject(new Error(msg.error.message));
          else resolve(msg.result);
        }
      };
    });
  }

  async send(method, params = {}) {
    const id = this.id++;
    return new Promise((resolve, reject) => {
      this.callbacks.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async evaluate(expression) {
    const res = await this.send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true
    });
    if (res.exceptionDetails) {
      throw new Error(res.exceptionDetails.text || 'Evaluation failed');
    }
    return res.result?.value;
  }

  async captureScreenshot(outputPath) {
    const res = await this.send('Page.captureScreenshot', { format: 'png' });
    if (res.data) {
      fs.writeFileSync(outputPath, Buffer.from(res.data, 'base64'));
    }
  }

  close() {
    if (this.ws) this.ws.close();
  }
}

async function waitForHttp(url, timeoutMs = 15000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok) return await res.json();
    } catch (e) {
      // wait
    }
    await new Promise(r => setTimeout(r, 200));
  }
  throw new Error(`Timeout waiting for ${url}`);
}

async function run() {
  console.log('AJ ECODRIVE — LIVE TOUR STABILITY ACCEPTANCE AUDIT');
  console.log('==================================================\n');

  fs.mkdirSync(TEMP_USER_DATA, { recursive: true });

  const chromeProc = spawn(CHROME_PATH, [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-gpu',
    `--user-data-dir=${TEMP_USER_DATA}`,
    '--window-size=1440,900',
    'about:blank'
  ]);

  try {
    console.log('Waiting for Chrome DevTools Protocol...');
    const list = await waitForHttp('http://127.0.0.1:9222/json');
    const targetPage = list.find(p => p.type === 'page') || list[0];
    const wsUrl = targetPage.webSocketDebuggerUrl;

    const cdp = new CDPClient(wsUrl);
    await cdp.connect();
    console.log('Connected to Chromium via CDP WebSocket.');

    await cdp.send('Page.enable');
    await cdp.send('Runtime.enable');
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false
    });

    // 1. Navigate to frontend
    console.log('Navigating to http://localhost:5173/ ...');
    await cdp.send('Page.navigate', { url: 'http://localhost:5173/' });
    await new Promise(r => setTimeout(r, 2000));

    // Wait for app ready
    await cdp.evaluate(`new Promise(resolve => {
      const chk = () => {
        if (window.store && window.dapStore && window.dapStore.missions) resolve(true);
        else setTimeout(chk, 100);
      };
      chk();
    })`);

    // Helper to ensure auth, route navigation and tour startup
    async function setupTour(role, route, missionId, stepIdx = 0, expectedTargetSelector = null) {
      await cdp.evaluate(`(async () => {
        window.store.setSession({
          name: '${role === 'Super Admin' ? 'Asad Khan' : 'Kashif Mehmood'}',
          role: '${role}',
          email: '${role === 'Super Admin' ? 'asad.khan@ajecodrive.com' : 'kashif@peshawar.ajecodrive.com'}',
          branchCode: '${role === 'Super Admin' ? 'HQ' : 'PES'}',
          branchName: '${role === 'Super Admin' ? 'Headquarters' : 'Peshawar'}',
          isSuperAdmin: ${role === 'Super Admin'},
          isAuthenticated: true
        }, true);
        window.dapStore.resetAllProgress();
        if (window.router.currentRoute.value.path !== '${route}') {
          await window.router.push('${route}');
        }
      })()`);

      if (expectedTargetSelector) {
        await cdp.evaluate(`new Promise((resolve, reject) => {
          const start = Date.now();
          const chk = () => {
            const el = document.querySelector('${expectedTargetSelector}');
            if (el) resolve(true);
            else if (Date.now() - start > 5000) reject(new Error('Target timeout: ${expectedTargetSelector}'));
            else setTimeout(chk, 50);
          };
          chk();
        })`);
      }

      // Stop previous tour to ensure clean step transition
      await cdp.evaluate(`(() => {
        window.dapStore.stopDAP();
      })()`);

      await cdp.evaluate(`(() => {
        window.dapStore.startDAP('${missionId}', ${stepIdx});
      })()`);

      // Wait for card to appear
      await cdp.evaluate(`new Promise((resolve, reject) => {
        const start = Date.now();
        const chk = () => {
          const card = document.querySelector('[data-tour-id="coachmark.card"]');
          if (card) resolve(true);
          else if (Date.now() - start > 5000) reject(new Error('Card timeout for mission ${missionId}'));
          else setTimeout(chk, 50);
        };
        chk();
      })`);

      // Allow 800ms for full transition settlement
      await new Promise(r => setTimeout(r, 800));
    }

    // -------------------------------------------------------------
    // PRIMARY REPRODUCTION: SA-06 Branch Catalogue Requests, Step 1 of 1
    // -------------------------------------------------------------
    console.log('\n--- PRIMARY REPRODUCTION: SA-06 (Branch Catalogue Requests) ---');
    console.log('Role: Super Admin');
    console.log('Route: /catalogue/requests');
    console.log('Mission: SA-06 Step 1 of 1 (Showroom Request Queue)');

    await setupTour('Super Admin', '/catalogue/requests', 'SA-06', 0, '[data-tour-id="sa.catalogue.requests.queue"]');

    // Check if target and card exist
    const initialCheck = await cdp.evaluate(`(() => {
      const card = document.querySelector('[data-tour-id="coachmark.card"]');
      const target = document.querySelector('[data-tour-id="sa.catalogue.requests.queue"]');
      return {
        cardFound: Boolean(card),
        targetFound: Boolean(target),
        placement: card?.dataset?.placement,
        mode: card?.dataset?.mode
      };
    })()`);

    console.log('Initial setup check:', initialCheck);

    // Give 300ms for entrance transition to fully settle
    await new Promise(r => setTimeout(r, 300));

    console.log('Starting 10-second high-frequency sampling (100ms interval = 100 samples)...');
    console.log('Conditions: stationary mouse, stationary viewport, no scroll, no resize.');

    const samples = [];
    const sampleCount = 100;
    const sampleInterval = 100;

    for (let i = 0; i < sampleCount; i++) {
      const tStart = Date.now();
      const sample = await cdp.evaluate(`(() => {
        const card = document.querySelector('[data-tour-id="coachmark.card"]');
        const target = document.querySelector('[data-tour-id="sa.catalogue.requests.queue"]');
        const cr = card ? card.getBoundingClientRect() : null;
        const tr = target ? target.getBoundingClientRect() : null;
        const connector = document.querySelector('svg line');
        
        return {
          tick: ${i},
          timestamp: Date.now(),
          card: cr ? { top: cr.top, left: cr.left, width: cr.width, height: cr.height, right: cr.right, bottom: cr.bottom } : null,
          target: tr ? { top: tr.top, left: tr.left, width: tr.width, height: tr.height, right: tr.right, bottom: tr.bottom } : null,
          placement: card?.dataset?.placement || 'unknown',
          mode: card?.dataset?.mode || 'unknown',
          hasConnector: Boolean(connector),
          connectorLine: connector ? {
            x1: connector.getAttribute('x1'),
            y1: connector.getAttribute('y1'),
            x2: connector.getAttribute('x2'),
            y2: connector.getAttribute('y2')
          } : null
        };
      })()`);

      samples.push(sample);
      const elapsed = Date.now() - tStart;
      const waitTime = Math.max(0, sampleInterval - elapsed);
      if (waitTime > 0) await new Promise(r => setTimeout(r, waitTime));
    }

    // Capture screenshot at 10 seconds
    const screenshotDir = 'C:\\xampp\\htdocs\\Aj Ecodrive\\.temp_tour_screenshots';
    fs.mkdirSync(screenshotDir, { recursive: true });
    const screenshotPath = path.join(screenshotDir, 'sa_06_live_stable_10s.png');
    await cdp.captureScreenshot(screenshotPath);
    console.log(`Saved live confirmation screenshot to ${screenshotPath}`);

    // Analyze Samples
    const firstSample = samples[0];
    const uniquePlacements = new Set(samples.map(s => s.placement));
    const uniqueModes = new Set(samples.map(s => s.mode));

    let unexpectedCardMovements = 0;
    let targetRectChanges = 0;
    let placementFlipFlops = 0;

    for (let i = 1; i < samples.length; i++) {
      const prev = samples[i - 1];
      const cur = samples[i];

      if (cur.placement !== prev.placement) {
        placementFlipFlops++;
      }

      // Card position change threshold (>= 1px)
      if (
        Math.abs(cur.card.top - prev.card.top) >= 1 ||
        Math.abs(cur.card.left - prev.card.left) >= 1
      ) {
        unexpectedCardMovements++;
        console.warn(`[TICK ${i}] Unexpected card movement: (${prev.card.top}, ${prev.card.left}) -> (${cur.card.top}, ${cur.card.left})`);
      }

      // Target position change threshold (>= 1px)
      if (
        Math.abs(cur.target.top - prev.target.top) >= 1 ||
        Math.abs(cur.target.left - prev.target.left) >= 1
      ) {
        targetRectChanges++;
      }
    }

    const sa06Pass = (
      uniquePlacements.size === 1 &&
      unexpectedCardMovements === 0 &&
      targetRectChanges === 0 &&
      placementFlipFlops === 0
    );

    console.log('\n--- SA-06 METRIC SUMMARY ---');
    console.log(`Total samples: ${samples.length} (over 10.0s)`);
    console.log(`Settled placement: ${firstSample.placement} (${firstSample.mode})`);
    console.log(`Card position: top=${firstSample.card.top}px, left=${firstSample.card.left}px, w=${firstSample.card.width}px, h=${firstSample.card.height}px`);
    console.log(`Target position: top=${firstSample.target.top}px, left=${firstSample.target.left}px, w=${firstSample.target.width}px, h=${firstSample.target.height}px`);
    console.log(`Connector attached: ${firstSample.hasConnector}`);
    console.log(`UNIQUE_PLACEMENTS = ${uniquePlacements.size}`);
    console.log(`UNEXPECTED_CARD_MOVEMENTS = ${unexpectedCardMovements}`);
    console.log(`TARGET_RECT_CHANGES = ${targetRectChanges}`);
    console.log(`PLACEMENT_FLIP_FLOPS = ${placementFlipFlops}`);
    console.log(`SA-06 LIVE RESULT: ${sa06Pass ? 'PASS' : 'FAIL'}`);

    // -------------------------------------------------------------
    // REPRESENTATIVE LIVE TEST CASES (Stationary checks)
    // -------------------------------------------------------------
    console.log('\n--- REPRESENTATIVE LIVE TEST CASES ---');
    const representativeCases = [
      {
        name: 'SA normal button target',
        role: 'Super Admin',
        route: '/organisation/branches',
        mission: 'SA-02',
        step: 1,
        targetSelector: '[data-tour-id="sa.organisation.branches.create-btn"]'
      },
      {
        name: 'SA form field',
        role: 'Super Admin',
        route: '/catalogue/pricing',
        mission: 'SA-07',
        step: 1,
        targetSelector: '[data-tour-id="sa.form.pricing.searchquery"]'
      },
      {
        name: 'SA modal/drawer target',
        role: 'Super Admin',
        route: '/dashboard/action-centre',
        mission: 'SA-19',
        step: 0,
        targetSelector: '[data-tour-id="sa.action-centre.queue.list"]'
      },
      {
        name: 'BM normal page target',
        role: 'Branch Manager',
        route: '/dashboard',
        mission: 'BM-02',
        step: 0,
        targetSelector: '[data-tour-id="bm.dashboard.kpi.net-sales"]'
      },
      {
        name: 'BM form field',
        role: 'Branch Manager',
        route: '/sales/customers/create',
        mission: 'BM-04',
        step: 1,
        targetSelector: '[data-tour-id="bm.customer.form.phone"]'
      },
      {
        name: 'mobile 390x844 bottom dock',
        role: 'Branch Manager',
        route: '/dashboard',
        mission: 'BM-02',
        step: 0,
        viewport: { width: 390, height: 844 },
        targetSelector: '[data-tour-id="bm.dashboard.kpi.net-sales"]'
      }
    ];

    let repSuccessCount = 0;
    let repFailureCount = 0;

    for (const testCase of representativeCases) {
      if (testCase.viewport) {
        await cdp.send('Emulation.setDeviceMetricsOverride', {
          width: testCase.viewport.width,
          height: testCase.viewport.height,
          deviceScaleFactor: 1,
          mobile: true
        });
      } else {
        await cdp.send('Emulation.setDeviceMetricsOverride', {
          width: 1440,
          height: 900,
          deviceScaleFactor: 1,
          mobile: false
        });
      }

      await setupTour(testCase.role, testCase.route, testCase.mission, testCase.step, testCase.targetSelector);
      await new Promise(r => setTimeout(r, 400)); // settle transition

      // Sample 20 ticks (2 seconds)
      const caseSamples = [];
      for (let s = 0; s < 20; s++) {
        const res = await cdp.evaluate(`(() => {
          const card = document.querySelector('[data-tour-id="coachmark.card"]');
          const cr = card ? card.getBoundingClientRect() : null;
          return {
            card: cr ? { top: cr.top, left: cr.left } : null,
            placement: card?.dataset?.placement,
            mode: card?.dataset?.mode
          };
        })()`);
        caseSamples.push(res);
        await new Promise(r => setTimeout(r, 100));
      }

      const casePlacements = new Set(caseSamples.map(s => s.placement));
      let caseMovements = 0;
      for (let i = 1; i < caseSamples.length; i++) {
        const c1 = caseSamples[i-1].card;
        const c2 = caseSamples[i].card;
        if (c1 && c2 && (Math.abs(c1.top - c2.top) >= 1 || Math.abs(c1.left - c2.left) >= 1)) {
          caseMovements++;
          console.log(`[CASE ${testCase.name} MOVEMENT] tick ${i}: (${c1.top}, ${c1.left}) -> (${c2.top}, ${c2.left})`);
        }
      }

      const isMobileCase = testCase.name.includes('mobile');
      const pass = casePlacements.size === 1 && caseMovements === 0 && (!isMobileCase || caseSamples[0].mode === 'BOTTOM_DOCK');

      console.log(`[CASE] ${testCase.name}: ${pass ? 'PASS' : 'FAIL'} (placements=${casePlacements.size}, movements=${caseMovements}, mode=${caseSamples[0]?.mode})`);
      if (pass) repSuccessCount++;
      else repFailureCount++;
    }

    console.log(`\nRepresentative cases: ${repSuccessCount} passed, ${repFailureCount} failed.`);

    cdp.close();

    return {
      sa06Pass,
      samplesCount: samples.length,
      uniquePlacements: uniquePlacements.size,
      unexpectedCardMovements,
      targetRectChanges,
      placementFlipFlops,
      repTotal: representativeCases.length,
      repSuccessCount,
      repFailureCount
    };
  } finally {
    try {
      chromeProc.kill('SIGKILL');
    } catch (e) {}
    try {
      fs.rmSync(TEMP_USER_DATA, { recursive: true, force: true });
    } catch (e) {}
  }
}

run().then(res => {
  console.log('\nFINAL AUDIT RESULT DATA:', JSON.stringify(res, null, 2));
  process.exit(res.sa06Pass && res.repFailureCount === 0 ? 0 : 1);
}).catch(err => {
  console.error('Fatal error during audit:', err);
  process.exit(1);
});
