const http = require('http');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const mysql = require(path.resolve(__dirname, '../backend/node_modules/mysql2/promise'));

const DB_CONFIG = {
  host: '127.0.0.1',
  port: 3306,
  user: 'root',
  password: '',
  database: 'ecodrive'
};

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const USER_DATA_DIR = path.resolve(__dirname, '../tmp_chrome_diag');

let dbConn = null;
let chromeProc = null;
let ws = null;
let msgId = 1;

function sendCommand(method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = msgId++;
    const timer = setTimeout(() => {
      reject(new Error(`Timeout waiting for CDP response on method: ${method}`));
    }, 15000);

    const handler = (evt) => {
      try {
        const msg = JSON.parse(evt.data);
        if (msg.id === id) {
          clearTimeout(timer);
          ws.removeEventListener('message', handler);
          if (msg.error) {
            reject(new Error(`CDP Error in ${method}: ${msg.error.message}`));
          } else {
            resolve(msg.result);
          }
        }
      } catch (e) {
        // ignore
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id, method, params }));
  });
}

async function evalInBrowser(expr) {
  const res = await sendCommand('Runtime.evaluate', {
    expression: expr,
    returnByValue: true,
    awaitPromise: true
  });
  return res?.result?.value;
}

async function navigate(url, waitMs = 2000) {
  await sendCommand('Page.navigate', { url });
  await new Promise(r => setTimeout(r, waitMs));
}

async function runDiag() {
  if (!fs.existsSync(USER_DATA_DIR)) {
    fs.mkdirSync(USER_DATA_DIR, { recursive: true });
  }

  dbConn = await mysql.createConnection(DB_CONFIG);
  console.log('[DB] Connected to MySQL database.');

  chromeProc = spawn(CHROME_PATH, [
    '--headless=new',
    '--remote-debugging-port=9222',
    `--user-data-dir=${USER_DATA_DIR}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-gpu',
    'http://localhost:5173/login'
  ]);

  await new Promise(r => setTimeout(r, 2500));

  const targets = await new Promise((resolve, reject) => {
    http.get('http://127.0.0.1:9222/json', res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });

  const pageTarget = targets.find(t => t.type === 'page');
  ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
  await new Promise(resolve => ws.onopen = resolve);

  await sendCommand('Page.enable');
  await sendCommand('DOM.enable');
  await sendCommand('Runtime.enable');

  // Authenticate
  await navigate('http://localhost:5173/login', 1500);
  await evalInBrowser(`(() => {
    const inputs = document.querySelectorAll('input');
    if (inputs[0]) { inputs[0].value = 'ADMIN'; inputs[0].dispatchEvent(new Event('input', { bubbles: true })); }
    if (inputs[1]) { inputs[1].value = 'password123'; inputs[1].dispatchEvent(new Event('input', { bubbles: true })); }
    const form = document.querySelector('form');
    if (form) { form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })); }
  })()`);
  await new Promise(r => setTimeout(r, 2000));

  // --- 1. Diagnose Custom Orders ---
  console.log('\n--- 1. Diagnosing Custom Orders ---');
  await navigate('http://localhost:5173/sales/custom-orders/create', 2000);
  const coDiag = await evalInBrowser(`(() => {
    const custInp = document.querySelector('[data-tour="customer"]');
    const prodInp = document.querySelector('[data-tour="product"]');
    const budgetInp = document.querySelector('[data-tour="budget"]');
    const depositInp = document.querySelector('[data-tour="deposit"]');
    const txnInp = document.querySelector('[data-tour="transactionid"]');
    const paySel = document.querySelector('[data-tour="paymentmethod"]');
    const branchSel = document.querySelector('[data-tour="custom-order-branch"]');

    if (custInp) { custInp.value = 'Browser Test Sardar Khan'; custInp.dispatchEvent(new Event('input', { bubbles: true })); }
    if (prodInp) { prodInp.value = 'BRG DS11 Cargo Special'; prodInp.dispatchEvent(new Event('input', { bubbles: true })); }
    if (budgetInp) { budgetInp.value = '185,000'; budgetInp.dispatchEvent(new Event('input', { bubbles: true })); }
    if (depositInp) { depositInp.value = '50,000'; depositInp.dispatchEvent(new Event('input', { bubbles: true })); }
    if (txnInp) { txnInp.value = 'TXN-BRW-881'; txnInp.dispatchEvent(new Event('input', { bubbles: true })); }
    if (paySel) { paySel.value = 'Cash'; paySel.dispatchEvent(new Event('change', { bubbles: true })); }
    if (branchSel) { branchSel.value = 'Peshawar'; branchSel.dispatchEvent(new Event('change', { bubbles: true })); }

    const form = document.querySelector('form');
    let submitted = false;
    if (form) {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
      submitted = true;
    }
    return {
      custFound: !!custInp,
      prodFound: !!prodInp,
      depositFound: !!depositInp,
      txnFound: !!txnInp,
      submitted
    };
  })()`);
  console.log('Custom Order Form Diag:', coDiag);
  await new Promise(r => setTimeout(r, 2000));
  const [coRows] = await dbConn.execute('SELECT * FROM `custom_orders` WHERE `customer` LIKE "%Browser Test%"');
  console.log('Custom Order DB Rows count:', coRows.length, coRows[0]?.id);

  // --- 2. Diagnose Price Rules ---
  console.log('\n--- 2. Diagnosing Price Rules ---');
  await navigate('http://localhost:5173/catalogue/pricing/create', 2000);
  const prDiag = await evalInBrowser(`(() => {
    const selects = document.querySelectorAll('select');
    if (selects[0]) {
      selects[0].value = 'BRG DS11';
      selects[0].dispatchEvent(new Event('change', { bubbles: true }));
    }
    const inputs = document.querySelectorAll('input');
    for (const inp of inputs) {
      const ph = (inp.placeholder || '').toLowerCase();
      if (ph.includes('185') || ph.includes('selling')) {
        inp.value = '168K';
        inp.dispatchEvent(new Event('input', { bubbles: true }));
      } else if (ph.includes('176') || ph.includes('minimum')) {
        inp.value = '158K';
        inp.dispatchEvent(new Event('input', { bubbles: true }));
      } else if (ph.includes('promo') || ph.includes('reason')) {
        inp.value = 'Browser Test Promo';
        inp.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }
    const btns = Array.from(document.querySelectorAll('button'));
    const createBtn = btns.find(b => b.textContent.includes('Create Price Rule'));
    let clicked = false;
    if (createBtn) {
      createBtn.click();
      clicked = true;
    }
    return {
      selectCount: selects.length,
      inputCount: inputs.length,
      createBtnFound: !!createBtn,
      clicked
    };
  })()`);
  console.log('Price Rule Form Diag:', prDiag);
  await new Promise(r => setTimeout(r, 2000));
  const [prRows] = await dbConn.execute('SELECT * FROM `price_rules` WHERE `selling_price` = "168K" OR `product` = "BRG DS11"');
  console.log('Price Rule DB Rows count:', prRows.length, prRows[0]?.id);

  // --- 3. Diagnose Conversations ---
  console.log('\n--- 3. Diagnosing Conversations ---');
  await navigate('http://localhost:5173/communication/inbox/create', 2000);
  const convDiag = await evalInBrowser(`(() => {
    const titleInp = document.querySelector('[data-tour="title"]');
    const msgInp = document.querySelector('[data-tour="message"]');
    if (titleInp) {
      titleInp.value = 'Browser Test Fleet Allocation Inquiry';
      titleInp.dispatchEvent(new Event('input', { bubbles: true }));
    }
    if (msgInp) {
      msgInp.value = 'Initial message for browser automated conversation thread';
      msgInp.dispatchEvent(new Event('input', { bubbles: true }));
    }
    const form = document.querySelector('form');
    let submitted = false;
    if (form) {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
      submitted = true;
    }
    return {
      titleFound: !!titleInp,
      msgFound: !!msgInp,
      formFound: !!form,
      submitted
    };
  })()`);
  console.log('Conversation Form Diag:', convDiag);
  await new Promise(r => setTimeout(r, 2000));
  const [convRows] = await dbConn.execute('SELECT * FROM `conversations` WHERE `title` LIKE "%Browser Test%"');
  console.log('Conversation DB Rows count:', convRows.length, convRows[0]?.id);

  if (chromeProc) chromeProc.kill();
  if (dbConn) await dbConn.end();
  process.exit(0);
}

runDiag().catch(err => {
  console.error('[DIAG ERROR]', err);
  if (chromeProc) chromeProc.kill();
  process.exit(1);
});
