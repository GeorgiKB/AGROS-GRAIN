import puppeteer from 'puppeteer-core';

const execPath = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const browser = await puppeteer.launch({ headless: true, executablePath: execPath, args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto('http://localhost:4200', { waitUntil: 'networkidle0' });
await new Promise(r => setTimeout(r, 1000));

const certsEl = await page.$('.certs');
await certsEl.screenshot({ path: 'temporary screenshots/screenshot-crop-certs.png' });

const ctaEl = await page.$('.cta-band');
await ctaEl.screenshot({ path: 'temporary screenshots/screenshot-crop-cta.png' });

const footerEl = await page.$('.footer');
await footerEl.screenshot({ path: 'temporary screenshots/screenshot-crop-footer.png' });

await browser.close();
console.log('Done');
