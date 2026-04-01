const http = require('http');

async function testApi() {
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/audit',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  console.log("Testing /api/audit (Unauthenticated)...");
  
  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
      console.log('Status:', res.statusCode);
      console.log('Content-Type:', res.headers['content-type']);
      try {
        const json = JSON.parse(data);
        console.log('Response JSON:', json);
        if (res.statusCode === 401 && json.error === 'Unauthorized') {
          console.log('✅ SUCCESS: Correctly received 401 Unauthorized JSON.');
        } else {
          console.log('❌ UNEXPECTED: Status or error message does not match.');
        }
      } catch (e) {
        console.log('❌ FAILURE: Response is not valid JSON!');
        console.log('Raw Data (first 100 chars):', data.substring(0, 100));
      }
    });
  });

  req.on('error', (e) => {
    console.error(`Problem with request: ${e.message}`);
    console.log('\nNOTE: Make sure the dev server is running on http://localhost:3000');
  });

  req.write(JSON.stringify({ url: 'https://example.com' }));
  req.end();
}

testApi();
