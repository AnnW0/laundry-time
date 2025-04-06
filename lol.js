const http = require('http');

const options = {
  host: '172.31.193.178', // Your Kasa plug's IP
  port: 80,
  method: 'GET',
};

const req = http.request(options, (res) => {
  console.log(`Status Code: ${res.statusCode}`);
  res.on('data', (chunk) => {
    console.log(`Response: ${chunk}`);
  });
});

req.on('error', (error) => {
  console.error(`❌ HTTP Request Failed: ${error.message}`);
});

req.end();
