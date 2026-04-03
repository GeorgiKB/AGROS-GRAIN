import sharp from 'sharp';
import { exec } from 'child_process';
import { promisify } from 'util';
import { readdir, stat, unlink, readFile, writeFile } from 'fs/promises';
import { join, extname, basename, dirname } from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';

const execAsync = promisify(exec);
const require = createRequire(import.meta.url);
const ffmpegPath = (await import('ffmpeg-static')).default;

const MEDIA_DIR = './Media';
const MAX_WIDTH = 1400;
const WEBP_QUALITY = 90;

// ─── Helpers ────────────────────────────────────────────────────────────────

function fmtBytes(bytes) {
  if (bytes >= 1_000_000) return (bytes / 1_000_000).toFixed(2) + ' MB';
  return (bytes / 1_000).toFixed(1) + ' KB';
}

async function fileSize(p) {
  try { return (await stat(p)).size; }
  catch { return 0; }
}

async function* walkDir(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) yield* walkDir(full);
    else yield full;
  }
}

// ─── Step 1: Optimize images with Sharp ─────────────────────────────────────

const results = [];

for await (const filePath of walkDir(MEDIA_DIR)) {
  const ext = extname(filePath).toLowerCase();
  const name = basename(filePath);

  // Skip already-converted webp files
  if (ext === '.webp') continue;

  // Skip video
  if (ext === '.mp4') continue;

  if (!['.png', '.jpg', '.jpeg'].includes(ext)) continue;

  const beforeSize = await fileSize(filePath);
  const outPath = filePath.replace(/\.(png|jpg|jpeg)$/i, '.webp');

  try {
    if (name === 'flavicon.png') {
      // Favicon: 64×64 tiny webp
      await sharp(filePath)
        .resize(64, 64, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .webp({ quality: 85 })
        .toFile(outPath);
    } else {
      // All other images: max 800px wide, webp quality 80
      await sharp(filePath)
        .resize({ width: MAX_WIDTH, withoutEnlargement: true })
        .webp({ quality: WEBP_QUALITY })
        .toFile(outPath);
    }

    const afterSize = await fileSize(outPath);
    const saving = beforeSize - afterSize;
    const pct = ((saving / beforeSize) * 100).toFixed(1);
    console.log(`✓  ${filePath.replace('./Media/', 'Media/')}`);
    console.log(`   ${fmtBytes(beforeSize)} → ${fmtBytes(afterSize)}  (saved ${fmtBytes(saving)}, -${pct}%)`);
    results.push({ filePath, outPath, beforeSize, afterSize });
  } catch (err) {
    console.error(`✗  Failed: ${filePath} — ${err.message}`);
  }
}

// ─── Step 2: Compress hero.mp4 with FFmpeg ──────────────────────────────────

console.log('\n─── Compressing hero.mp4 ───────────────────────────────────────────────────');
const videoIn  = `${MEDIA_DIR}/hero.mp4`;
const videoOut = `${MEDIA_DIR}/hero-compressed.mp4`;
const videoBeforeSize = await fileSize(videoIn);

const ffmpegCmd = [
  `"${ffmpegPath}"`,
  `-i "${videoIn}"`,
  `-vf "scale=-2:1080"`,   // downscale to 1080p, keep aspect ratio
  `-c:v libx264`,
  `-crf 23`,              // quality factor (18=lossless, 28=aggressive, 32=very small)
  `-preset slow`,         // better compression at cost of encode time
  `-an`,                  // strip audio
  `-movflags +faststart`, // web optimisation (moov atom at start)
  `-y`,                   // overwrite without prompt
  `"${videoOut}"`,
].join(' ');

console.log('Running FFmpeg (this may take a minute)…');
try {
  await execAsync(ffmpegCmd, { maxBuffer: 50 * 1024 * 1024 });
  const videoAfterSize = await fileSize(videoOut);
  const videoSaving = videoBeforeSize - videoAfterSize;
  const videoPct = ((videoSaving / videoBeforeSize) * 100).toFixed(1);
  console.log(`✓  hero.mp4`);
  console.log(`   ${fmtBytes(videoBeforeSize)} → ${fmtBytes(videoAfterSize)}  (saved ${fmtBytes(videoSaving)}, -${videoPct}%)`);

  // Replace original with compressed version
  await unlink(videoIn);
  const { rename } = await import('fs/promises');
  await rename(videoOut, videoIn);
  console.log(`   Replaced original hero.mp4 with compressed version.`);
} catch (err) {
  console.error(`✗  FFmpeg failed: ${err.message}`);
  console.error(`   stderr: ${err.stderr}`);
}

// ─── Step 3: Update HTML references ─────────────────────────────────────────

console.log('\n─── Updating HTML files ────────────────────────────────────────────────────');

const HTML_DIRS = ['.', './bg', './de'];
const htmlFiles = [];
for (const dir of HTML_DIRS) {
  try {
    const entries = await readdir(dir);
    for (const f of entries) {
      if (f.endsWith('')) htmlFiles.push(join(dir, f));
    }
  } catch { /* dir may not exist */ }
}

for (const htmlFile of htmlFiles) {
  let content = await readFile(htmlFile, 'utf8');
  const original = content;

  // Replace .png and .jpg image references (src=, href=, content=, url() in CSS)
  // Exclude video src references, and skip flavicon specially
  content = content.replace(
    /(['"])((?:[^'"]*\/)?Media\/[^'"]*)\.(png|jpg|jpeg)(['"])/gi,
    (match, q1, path, ext, q2) => {
      // Don't touch video files
      if (path.includes('hero')) return match;
      return `${q1}${path}.webp${q2}`;
    }
  );

  // Also handle unquoted or other patterns for og:image and similar meta tags
  // e.g. content="...og-image.jpg"
  content = content.replace(
    /(content=")((?:[^"]*\/)?Media\/[^"]*)\.(png|jpg|jpeg)(")/gi,
    (match, pre, path, ext, post) => `${pre}${path}.webp${post}`
  );

  // Update favicon link: flavicon.png → flavicon.webp
  content = content.replace(/flavicon\.png/gi, 'flavicon.webp');

  if (content !== original) {
    await writeFile(htmlFile, content, 'utf8');
    console.log(`✓  Updated: ${htmlFile}`);
  }
}

// ─── Step 4: Delete original .png / .jpg files ──────────────────────────────

console.log('\n─── Deleting original source images ────────────────────────────────────────');

let deletedCount = 0;
let deletedBytes = 0;

for (const { filePath, outPath, beforeSize } of results) {
  // Only delete if the webp was successfully created
  const webpExists = (await fileSize(outPath)) > 0;
  if (webpExists) {
    await unlink(filePath);
    deletedBytes += beforeSize;
    deletedCount++;
    console.log(`✓  Deleted: ${filePath}`);
  } else {
    console.warn(`⚠  Skipped delete (webp missing): ${filePath}`);
  }
}

// ─── Summary ─────────────────────────────────────────────────────────────────

console.log('\n═══════════════════════════════════════════════════════════════════════════');
console.log('SUMMARY');
console.log(`  Images converted: ${results.length}`);
console.log(`  Originals deleted: ${deletedCount} (freed ${fmtBytes(deletedBytes)})`);
console.log(`  HTML files updated: ${htmlFiles.filter(f => true).length} scanned`);
console.log('═══════════════════════════════════════════════════════════════════════════\n');
