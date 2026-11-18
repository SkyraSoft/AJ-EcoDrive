const https = require('https');

async function request(url, options = {}, body = null) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const reqOptions = {
      hostname: u.hostname,
      port: u.port || 443,
      path: u.pathname + u.search,
      method: options.method || 'GET',
      headers: options.headers || {}
    };

    const req = https.request(reqOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });

    req.on('error', reject);
    if (body) {
      req.write(typeof body === 'string' ? body : JSON.stringify(body));
    }
    req.end();
  });
}

async function run() {
  console.log('=== TESTING PRODUCTION API (https://ecodrive.skyrasoft.com/api/v1) ===\n');

  // 1. Health check
  console.log('1. Testing /health endpoint:');
  const healthRes = await request('https://ecodrive.skyrasoft.com/api/v1/health', {
    headers: { 'Origin': 'http://tauri.localhost' }
  });
  console.log(`   Status: ${healthRes.statusCode}`);
  console.log(`   CORS Header (access-control-allow-origin): ${healthRes.headers['access-control-allow-origin'] || 'None'}`);
  console.log(`   Body: ${healthRes.body.trim()}`);
  const healthPass = healthRes.statusCode === 200 && healthRes.headers['access-control-allow-origin'] === 'http://tauri.localhost';

  // 2. Preflight OPTIONS request
  console.log('\n2. Testing CORS Preflight (OPTIONS /auth/login):');
  const optionsRes = await request('https://ecodrive.skyrasoft.com/api/v1/auth/login', {
    method: 'OPTIONS',
    headers: {
      'Origin': 'http://tauri.localhost',
      'Access-Control-Request-Method': 'POST',
      'Access-Control-Request-Headers': 'Content-Type, Authorization'
    }
  });
  console.log(`   Status: ${optionsRes.statusCode}`);
  console.log(`   Allow-Origin: ${optionsRes.headers['access-control-allow-origin'] || 'None'}`);
  console.log(`   Allow-Methods: ${optionsRes.headers['access-control-allow-methods'] || 'None'}`);
  console.log(`   Allow-Headers: ${optionsRes.headers['access-control-allow-headers'] || 'None'}`);
  const preflightPass = (optionsRes.statusCode === 200 || optionsRes.statusCode === 204) &&
                        optionsRes.headers['access-control-allow-origin'] === 'http://tauri.localhost';

  // 3. Login with invalid credentials
  console.log('\n3. Testing Login with deliberate invalid credentials:');
  const loginRes = await request('https://ecodrive.skyrasoft.com/api/v1/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Origin': 'http://tauri.localhost'
    }
  }, {
    username: 'invalid_test_probe_user',
    password: 'DeliberateInvalidPassword123!'
  });
  console.log(`   Status: ${loginRes.statusCode}`);
  console.log(`   Allow-Origin: ${loginRes.headers['access-control-allow-origin'] || 'None'}`);
  let parsedBody = {};
  try { parsedBody = JSON.parse(loginRes.body); } catch(e) {}
  console.log(`   Response Error: ${parsedBody.error || 'N/A'}`);
  console.log(`   Response Message: ${parsedBody.message || loginRes.body.trim()}`);
  const loginPass = loginRes.statusCode === 401 &&
                    loginRes.headers['access-control-allow-origin'] === 'http://tauri.localhost' &&
                    (parsedBody.error === 'INVALID_CREDENTIALS' || parsedBody.status === 'error' || parsedBody.ok === false);

  console.log('\n=== SUMMARY ===');
  console.log(`Health Check: ${healthPass ? 'PASS' : 'FAIL'}`);
  console.log(`CORS Preflight: ${preflightPass ? 'PASS' : 'FAIL'}`);
  console.log(`Auth Error Handling: ${loginPass ? 'PASS' : 'FAIL'}`);
  console.log(`Overall Production API Verification: ${healthPass && preflightPass && loginPass ? 'PASS' : 'FAIL'}`);
}

run().catch(err => {
  console.error('API Verification error:', err.message);
  process.exit(1);
});
