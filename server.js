const http = require('http');
const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

const PORT = 3005;
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8'
};


function initializeAndReadJSON(fileName) {
  try {
    const workbook = xlsx.readFile(fileName);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    const jsonData = xlsx.utils.sheet_to_json(sheet);
    fs.writeFileSync(
      path.join(__dirname, 'devData.json'),
      JSON.stringify(jsonData, null, 4)
    );
    console.log(`Converted ${fileName} to devData.json`);
    return jsonData;
  } catch (err) {
    console.error(' Failed to convert spreadsheet:', err.message);
    return [];
  }
}

// Convert spreadsheet
initializeAndReadJSON(path.join(__dirname, "Dev Data Sheet.xlsx"));

function send(res, status, body, type = 'text/plain') {
  res.writeHead(status, { 'Content-Type': type });
  res.end(body);
}

const server = http.createServer((req, res) => {
  if (req.url.startsWith('/api/devs')) {
    fs.readFile(path.join(__dirname, 'devData.json'), 'utf-8', (err, text) => {
      if (err) return send(res, 500, JSON.stringify({ error: "Can't read devData.json" }), MIME['.json']);
      try {
        const data = JSON.parse(text);
        send(res, 200, JSON.stringify(data), MIME['.json']);
      } catch (e) {
        send(res, 500, JSON.stringify({ error: 'Invalid JSON format' }), MIME['.json']);
      }
    });
    return;
  }

  // connect to front end
  let filePath = req.url === '/' ? '/index.html' : req.url;
  filePath = path.join(__dirname, filePath);
  fs.readFile(filePath, (err, buf) => {
    if (err) return send(res, 404, 'Not Found');
    const ext = path.extname(filePath);
    send(res, 200, buf, MIME[ext] || 'application/octet-stream');
  });
});

server.listen(PORT, () => {
  console.log(`🚀 DevCards running at http://localhost:${PORT}`);
});