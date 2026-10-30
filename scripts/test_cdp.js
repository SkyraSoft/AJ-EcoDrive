const http = require('http');
const { spawn } = require('child_process');
const fs = require('fs');

async function testCDP() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const userDataDir = 'C:\\xampp\\htdocs\\ECodrive\\tmp_chrome_profile';

  console.log('Spawning Chrome with remote debugging on 9222...');
  const chromeProc = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9222',
    `--user-data-dir=${userDataDir}`,
    '--no-first-run',
    '--no-default-browser-check',
    'http://localhost:5173/'
  ]);

  // Wait 2 seconds for Chrome to bind port 9222
  await new Promise(r => setTimeout(r, 2000));

  // Query /json/version
  const versionData = await new Promise((resolve, reject) => {
    http.get('http://127.0.0.1:9222/json/version', res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });

  console.log('Chrome Browser Connected:', versionData.Browser);

  // Query /json to get page targets
  const targets = await new Promise((resolve, reject) => {
    http.get('http://127.0.0.1:9222/json', res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });

  const pageTarget = targets.find(t => t.type === 'page');
  console.log('Found page target:', pageTarget.url, 'ws:', pageTarget.webSocketDebuggerUrl);

  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);

  await new Promise((resolve) => ws.onopen = resolve);
  console.log('Connected to Chrome DevTools WebSocket!');

  let msgId = 1;
  function sendCommand(method, params = {}) {
    return new Promise((resolve) => {
      const id = msgId++;
      const handler = (evt) => {
        const msg = JSON.parse(evt.data);
        if (msg.id === id) {
          ws.removeEventListener('message', handler);
          resolve(msg.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  // Evaluate document.title
  const res = await sendCommand('Runtime.evaluate', {
    expression: 'document.title'
  });
  console.log('Page Title via CDP:', res.result.value);

  ws.close();
  chromeProc.kill();
  console.log('CDP Test Complete and Cleaned up.');
}

testCDP().catch(err => {
  console.error('CDP Test Error:', err);
  process.exit(1);
});
