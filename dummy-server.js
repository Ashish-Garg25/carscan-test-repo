const http = require('http');

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/upload-batch') {
    let body = '';
    req.on('data', chunk => (body += chunk));
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const screenshots = data.screenshots || [];
        console.log(`\nBatch received`);
        console.log(`Mobile: ${data.mobileNumber}`);
        console.log(`Screenshots: ${screenshots.length}`);
        screenshots.forEach((s, i) => {
          const sizeKB = ((s.image.length * 3) / 4 / 1024).toFixed(1);
          console.log(`  [${i + 1}] ${s.filename} | ${sizeKB} KB | ${s.timestamp}`);
        });

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          successful: screenshots.length,
          failed: 0,
          total: screenshots.length,
          details: screenshots.map((_, index) => ({
            index,
            filename: screenshots[index].filename,
            status: 'success',
          })),
        }));
      } catch (e) {
        console.error('Parse error:', e);
        res.writeHead(400);
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(3000, () => {
  console.log('Dummy server running on http://localhost:3000');
  console.log('Run: ngrok http 3000');
  console.log('Then set API_BASE_URL to the ngrok URL in your .env');
});
