import puppeteer from 'puppeteer-core';
import { existsSync, mkdirSync, readdirSync } from 'fs';
import { join } from 'path';
const url = process.argv[2] || 'http://localhost:3000';
const label = process.argv[3] || '';
const dir = './temporary screenshots';
if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
const existing = readdirSync(dir).filter(f => f.endsWith('.png'));
let max = 0;
existing.forEach(f => { const m = f.match(/^screenshot-(\d+)/); if (m) max = Math.max(max, parseInt(m[1])); });
const n = max + 1;
const fname = label ? `screenshot-${n}-${label}.png` : `screenshot-${n}.png`;
const out = join(dir, fname);
const browser = await puppeteer.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
// Force all reveal elements visible for screenshot
await page.evaluate(() => {
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
  document.querySelectorAll('.prod-card').forEach(el => el.classList.add('prod-card--visible'));
});
await new Promise(r => setTimeout(r, 600));
await page.screenshot({ path: out, fullPage: true });
await browser.close();
console.log('Saved:', out);
