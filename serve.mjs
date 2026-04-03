import { createServer } from 'http';
import { readFile } from 'fs/promises';
import { extname, join } from 'path';
import { fileURLToPath } from 'url';
const __dirname = fileURLToPath(new URL('.', import.meta.url));
const MIME = { '.html':'text/html','.css':'text/css','.js':'application/javascript','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml','.ico':'image/x-icon','.woff2':'font/woff2','.mjs':'application/javascript' };

async function tryRead(filePath) {
  try { return await readFile(filePath); } catch { return null; }
}

createServer(async (req, res) => {
  let p = req.url.split('?')[0];

  let file, data;

  if (extname(p)) {
    // Has an extension — serve directly (CSS, JS, images, etc.)
    file = join(__dirname, p);
    data = await tryRead(file);
  } else {
    // No extension — try clean URL candidates in order:
    // 1. /path.html
    // 2. /path/index.html  (handles both /path and /path/)
    const base = p.replace(/\/$/, '') || '';
    const candidates = base === ''
      ? [join(__dirname, 'index.html')]
      : [
          join(__dirname, base + '.html'),
          join(__dirname, base, 'index.html'),
        ];

    for (const candidate of candidates) {
      data = await tryRead(candidate);
      if (data) { file = candidate; break; }
    }
  }

  if (data) {
    res.writeHead(200, { 'Content-Type': MIME[extname(file)] || 'application/octet-stream' });
    res.end(data);
  } else {
    try {
      const notFound = await readFile(join(__dirname, '404.html'));
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end(notFound);
    } catch {
      res.writeHead(404); res.end('Not found');
    }
  }
}).listen(4200, () => console.log('Agros-98 server → http://localhost:4200'));
