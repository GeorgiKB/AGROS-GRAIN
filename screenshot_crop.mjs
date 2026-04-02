import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const puppeteer = require('C:/Users/nateh/AppData/Local/Temp/puppeteer-test/node_modules/puppeteer');

const browser = await puppeteer.launch({
  executablePath: puppeteer.executablePath(),
  args: ['--no-sandbox']
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto('http://localhost:4200', { waitUntil: 'networkidle0' });
await new Promise(r => setTimeout(r, 800));

// Certs section
const certsEl = await page.$('.certs');
await certsEl.screenshot({ path: 'temporary screenshots/screenshot-crop-certs.png' });

// CTA band
const ctaEl = await page.$('.cta-band');
await ctaEl.screenshot({ path: 'temporary screenshots/screenshot-crop-cta.png' });

// Footer grid
const footerEl = await page.$('.footer');
await footerEl.screenshot({ path: 'temporary screenshots/screenshot-crop-footer.png' });

await browser.close();
console.log('Done');
