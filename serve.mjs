import { createServer } from 'http';
import { readFile } from 'fs/promises';
import { extname, join } from 'path';
import { fileURLToPath } from 'url';
const __dirname = fileURLToPath(new URL('.', import.meta.url));
const MIME = { '.html':'text/html','.css':'text/css','.js':'application/javascript','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml','.ico':'image/x-icon','.woff2':'font/woff2','.mjs':'application/javascript' };
createServer(async (req, res) => {
  let p = req.url.split('?')[0];
  if (p === '/' || p === '') p = '/index.html';
  if (!extname(p)) p += '.html';
  const file = join(__dirname, p);
  try {
    const data = await readFile(file);
    res.writeHead(200, { 'Content-Type': MIME[extname(file)] || 'application/octet-stream' });
    res.end(data);
  } catch {
    try {
      const data = await readFile(join(__dirname, '404.html'));
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end(data);
    } catch {
      res.writeHead(404); res.end('Not found');
    }
  }
}).listen(4200, () => console.log('Agros-98 server → http://localhost:4200'));
