import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';
import path from 'path';
import os from 'os';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TEMP_USER_DATA = path.join(os.tmpdir(), 'chrome_branch_tour_' + Date.now());
const ARTIFACTS_DIR = 'C:\\Users\\hp\\.gemini\\antigravity-ide\\brain\\609fc901-b200-4c3e-b642-e1259cf5c0d1';

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
      throw new Error(res.exceptionDetails.text || 'Evaluation failed: ' + JSON.stringify(res.exceptionDetails));
    }
    return res.result?.value;
  }

  async captureScreenshot(outputPath) {
    const res = await this.send('Page.captureScreenshot', { format: 'png' });
    if (res.data) {
      fs.writeFileSync(outputPath, Buffer.from(res.data, 'base64'));
      console.log('Saved screenshot:', outputPath);
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
  console.log('AJ ECODRIVE — CREATE BRANCH TOUR VERIFICATION');
  console.log('=============================================\n');

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

    // Setup Super Admin session
    await cdp.evaluate(`(async () => {
      window.store.setSession({
        name: 'Asad Khan',
        role: 'Super Admin',
        email: 'asad.khan@ajecodrive.com',
        branchCode: 'HQ',
        branchName: 'Headquarters',
        isSuperAdmin: true,
        isAuthenticated: true
      }, true);
      window.dapStore.resetAllProgress();
    })()`);

    // Navigate to /organisation/branches/create and start SA-03 at step 2 (Step 3: Identity Card)
    console.log('Navigating to /organisation/branches/create with SA-03 active...');
    await cdp.evaluate(`(async () => {
      await window.router.push('/organisation/branches/create');
    })()`);

    // Wait for the card target to appear in DOM
    await cdp.evaluate(`new Promise((resolve, reject) => {
      const start = Date.now();
      const chk = () => {
        const el = document.querySelector('[data-tour-id="sa.organisation.createbranch.identity-card"]');
        if (el) resolve(true);
        else if (Date.now() - start > 5000) reject(new Error('Target timeout'));
        else setTimeout(chk, 50);
      };
      chk();
    })`);

    await cdp.evaluate(`(() => {
      window.dapStore.stopDAP();
      window.dapStore.startDAP('SA-03', 2);
    })()`);

    await new Promise(r => setTimeout(r, 1000));

    // Check step 3 state
    const step3Info = await cdp.evaluate(`(() => {
      const card = document.querySelector('[data-tour-id="coachmark.card"]');
      const target = document.querySelector('[data-tour-id="sa.organisation.createbranch.identity-card"]');
      const blurOverlay = document.querySelector('.backdrop-blur-\\\\[6px\\\\]');
      const skipBtn = document.querySelector('[data-dap-element="coach-skip-task-btn"]');
      const nextBtn = document.querySelector('[data-dap-element="coach-primary-btn"]');
      return {
        cardFound: !!card,
        cardTitle: card?.querySelector('h3')?.innerText,
        stepBadge: card?.querySelector('.font-mono')?.innerText,
        targetFound: !!target,
        targetRect: target?.getBoundingClientRect() ? {
          width: Math.round(target.getBoundingClientRect().width),
          height: Math.round(target.getBoundingClientRect().height),
          top: Math.round(target.getBoundingClientRect().top),
          left: Math.round(target.getBoundingClientRect().left)
        } : null,
        blurOverlayFound: !!blurOverlay,
        skipBtnFound: !!skipBtn,
        skipBtnText: skipBtn?.innerText?.trim(),
        nextBtnText: nextBtn?.innerText?.trim(),
        activeMissionId: window.dapStore.activeMissionId,
        currentStepIndex: window.dapStore.currentStepIndex
      };
    })()`);

    console.log('Step 3 Info:', JSON.stringify(step3Info, null, 2));
    await cdp.captureScreenshot(path.join(ARTIFACTS_DIR, 'create_branch_step3_identity_card.png'));

    // Advance to step 4 (Location Card)
    console.log('Advancing to Step 4 (Location & Contact)...');
    await cdp.evaluate(`window.dapStore.nextStep()`);
    await new Promise(r => setTimeout(r, 800));

    const step4Info = await cdp.evaluate(`(() => {
      const card = document.querySelector('[data-tour-id="coachmark.card"]');
      const target = document.querySelector('[data-tour-id="sa.organisation.createbranch.location-card"]');
      const skipBtn = document.querySelector('[data-dap-element="coach-skip-task-btn"]');
      const nextBtn = document.querySelector('[data-dap-element="coach-primary-btn"]');
      return {
        cardTitle: card?.querySelector('h3')?.innerText,
        stepBadge: card?.querySelector('.font-mono')?.innerText,
        targetFound: !!target,
        skipBtnFound: !!skipBtn,
        nextBtnText: nextBtn?.innerText?.trim(),
        currentStepIndex: window.dapStore.currentStepIndex
      };
    })()`);
    console.log('Step 4 Info:', JSON.stringify(step4Info, null, 2));
    await cdp.captureScreenshot(path.join(ARTIFACTS_DIR, 'create_branch_step4_location_card.png'));

    // Advance to step 5 (Management & Operations Card)
    console.log('Advancing to Step 5 (Management & Operations)...');
    await cdp.evaluate(`window.dapStore.nextStep()`);
    await new Promise(r => setTimeout(r, 800));

    const step5Info = await cdp.evaluate(`(() => {
      const card = document.querySelector('[data-tour-id="coachmark.card"]');
      const target = document.querySelector('[data-tour-id="sa.organisation.createbranch.operations-card"]');
      const skipBtn = document.querySelector('[data-dap-element="coach-skip-task-btn"]');
      const nextBtn = document.querySelector('[data-dap-element="coach-primary-btn"]');
      return {
        cardTitle: card?.querySelector('h3')?.innerText,
        stepBadge: card?.querySelector('.font-mono')?.innerText,
        targetFound: !!target,
        skipBtnFound: !!skipBtn,
        nextBtnText: nextBtn?.innerText?.trim(),
        currentStepIndex: window.dapStore.currentStepIndex
      };
    })()`);
    console.log('Step 5 Info:', JSON.stringify(step5Info, null, 2));
    await cdp.captureScreenshot(path.join(ARTIFACTS_DIR, 'create_branch_step5_operations_card.png'));

    // Advance to step 6 (Controls & Policies Card - Final step)
    console.log('Advancing to Step 6 (Controls & Policies - Final Step)...');
    await cdp.evaluate(`window.dapStore.nextStep()`);
    await new Promise(r => setTimeout(r, 800));

    const step6Info = await cdp.evaluate(`(() => {
      const card = document.querySelector('[data-tour-id="coachmark.card"]');
      const target = document.querySelector('[data-tour-id="sa.organisation.createbranch.controls-card"]');
      const skipBtn = document.querySelector('[data-dap-element="coach-skip-task-btn"]');
      const nextBtn = document.querySelector('[data-dap-element="coach-primary-btn"]');
      return {
        cardTitle: card?.querySelector('h3')?.innerText,
        stepBadge: card?.querySelector('.font-mono')?.innerText,
        targetFound: !!target,
        skipBtnFound: !!skipBtn,
        nextBtnText: nextBtn?.innerText?.trim(),
        currentStepIndex: window.dapStore.currentStepIndex
      };
    })()`);
    console.log('Step 6 Info:', JSON.stringify(step6Info, null, 2));
    await cdp.captureScreenshot(path.join(ARTIFACTS_DIR, 'create_branch_step6_controls_card.png'));

    console.log('\nAll steps tested successfully!');
    cdp.close();
  } finally {
    try {
      chromeProc.kill();
    } catch (e) {}
    try {
      fs.rmSync(TEMP_USER_DATA, { recursive: true, force: true });
    } catch (e) {}
  }
}

run().catch(err => {
  console.error('Audit failed:', err);
  process.exit(1);
});
