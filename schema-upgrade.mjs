#!/usr/bin/env node
/**
 * schema-upgrade.mjs
 * Upgrades all JSON-LD structured data across the Agros-98 AD website.
 *
 * Run from project root: node schema-upgrade.mjs
 *
 * Changes applied:
 *  1. Homepages (EN/BG/DE): full Organization @graph rewrite with @id, Corporation,
 *     naics, isicV4, areaServed, knowsAbout, slogan, numberOfEmployees,
 *     hasOfferCatalog, hasCertification, Brand entity, WebSite entity,
 *     SiteNavigationElement entries. Keeps sameAs LinkedIn, adds TODO comments.
 *  2. Product pages: add @id, replace inline manufacturer/brand with @id refs,
 *     add isRelatedTo array.
 *  3. products.html (all langs): add ItemList of all products.
 *  4. contact.html (all langs): add @id to existing org block + add ContactPage schema.
 *  5. production-process.html (all langs): add WebPage schema.
 *  6. news.html (all langs): add CollectionPage schema.
 *  7. News article pages: update author + publisher to use @id references.
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, basename, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = __dirname;
const BASE = 'https://www.agros-grain.com';

// ── Related slugs map (canonical EN slug → related EN slugs) ─────────────────
const RELATED_MAP = {
  'hulled-sunflower-kernels':             ['sunflower-flour', 'sunflower-oil-linoleic'],
  'hulled-sunflower-kernels-bakery':      ['hulled-sunflower-kernels', 'sunflower-flour', 'hulled-sunflower-kernels-confectionery'],
  'hulled-sunflower-kernels-confectionery':['hulled-sunflower-kernels', 'sunflower-flour', 'hulled-sunflower-kernels-bakery'],
  'broken-sunflower-kernels':             ['hulled-sunflower-kernels', 'sunflower-flour', 'sunflower-oil-linoleic'],
  'coriander':                            ['coriander-oil', 'coriander-flour'],
  'coriander-seeds':                      ['coriander', 'coriander-splits', 'coriander-flour'],
  'coriander-splits':                     ['coriander', 'coriander-seeds', 'coriander-oil'],
  'flaxseed-brown':                       ['flaxseed-yellow', 'flaxseed-oil', 'flaxseed-flour'],
  'flaxseed-yellow':                      ['flaxseed-brown', 'flaxseed-oil', 'flaxseed-flour'],
  'leinsamen-gelb':                       ['flaxseed-brown', 'flaxseed-oil', 'flaxseed-flour'],
  'sunflower-oil-linoleic':               ['sunflower-oil-oleic', 'sunflower-flour', 'sunflower-protein'],
  'sunflower-oil-oleic':                  ['sunflower-oil-linoleic', 'sunflower-flour', 'sunflower-protein'],
  'milk-thistle-oil':                     ['milk-thistle-flour', 'coriander-oil', 'flaxseed-oil'],
  'coriander-oil':                        ['coriander', 'coriander-flour', 'walnut-oil'],
  'flaxseed-oil':                         ['flaxseed-brown', 'flaxseed-yellow', 'flaxseed-flour'],
  'pumpkin-oil':                          ['pumpkin-flour', 'walnut-oil', 'coriander-oil'],
  'walnut-oil':                           ['walnut-flour', 'pumpkin-oil', 'coriander-oil'],
  'sunflower-flour':                      ['sunflower-protein', 'sunflower-oil-linoleic', 'hulled-sunflower-kernels'],
  'sunflower-protein':                    ['sunflower-flour', 'sunflower-oil-linoleic', 'sunflower-oil-oleic'],
  'coriander-flour':                      ['coriander', 'coriander-oil', 'walnut-flour'],
  'flaxseed-flour':                       ['flaxseed-brown', 'flaxseed-yellow', 'flaxseed-oil'],
  'pumpkin-flour':                        ['pumpkin-oil', 'walnut-flour', 'sunflower-flour'],
  'walnut-flour':                         ['walnut-oil', 'pumpkin-flour', 'sunflower-flour'],
  'milk-thistle-flour':                   ['milk-thistle-oil', 'sunflower-flour', 'flaxseed-flour'],
  'sunflower-tahini':                     ['hulled-sunflower-kernels', 'sunflower-flour', 'pumpkin-tahini'],
  'flaxseed-tahini':                      ['flaxseed-brown', 'flaxseed-oil', 'sunflower-tahini'],
  'pumpkin-tahini':                       ['pumpkin-oil', 'pumpkin-flour', 'sunflower-tahini'],
  'walnut-tahini':                        ['walnut-oil', 'walnut-flour', 'sunflower-tahini'],
};

// All product slugs per language (for ItemList on products.html)
const PRODUCT_SLUGS_EN = Object.keys(RELATED_MAP).filter(s => s !== 'leinsamen-gelb');
const PRODUCT_SLUGS_BG = PRODUCT_SLUGS_EN; // same slugs in /bg/
const PRODUCT_SLUGS_DE = PRODUCT_SLUGS_EN.map(s => s === 'flaxseed-yellow' ? 'leinsamen-gelb' : s);

// News article slugs per language (for CollectionPage on news.html)
const NEWS_SLUGS = {
  en: ['fuel-transport-costs-2026', 'hcn-content-flaxseed-buyers-guide', 'what-separates-good-flaxseed-from-cheap-flaxseed', 'yellow-flaxseed-crop-2026'],
  bg: ['fuel-transport-costs-2026', 'hcn-sadarzhanie-leneno-seme-rakovodstvo', 'what-separates-good-flaxseed-from-cheap-flaxseed', 'yellow-flaxseed-crop-2026'],
  de: ['fuel-transport-costs-2026', 'guter-leinsamen-vs-billig', 'hcn-gehalt-leinsamen-kaeuferratgeber', 'yellow-flaxseed-crop-2026'],
};

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Extract all <script type="application/ld+json"> blocks from HTML. */
function extractBlocks(html) {
  const re = /(<script\s+type="application\/ld\+json"\s*>)([\s\S]*?)(<\/script>)/g;
  const results = [];
  let m;
  while ((m = re.exec(html)) !== null) {
    let json = null;
    try { json = JSON.parse(m[2]); } catch (_) {}
    results.push({ open: m[1], content: m[2], close: m[3], full: m[0], json, index: m.index });
  }
  return results;
}

/** Serialize a JSON-LD object back into a <script> tag. */
function toScriptTag(obj) {
  return `<script type="application/ld+json">\n${JSON.stringify(obj, null, 2)}\n</script>`;
}

/** Determine language prefix from file path. Returns 'en', 'bg', or 'de'. */
function langOf(filePath) {
  const rel = filePath.replace(/\\/g, '/');
  if (rel.includes('/bg/')) return 'bg';
  if (rel.includes('/de/')) return 'de';
  return 'en';
}

/** URL prefix for a language: '' for EN, '/bg' for BG, '/de' for DE. */
function urlPrefix(lang) {
  return lang === 'en' ? '' : `/${lang}`;
}

/** Build product @id from lang prefix + slug. */
function productId(langSlug, lang) {
  return `${BASE}${urlPrefix(lang)}/${langSlug}#product`;
}

/** Build isRelatedTo array for a product slug + language. */
function buildRelatedTo(slug, lang) {
  const relatedSlugs = RELATED_MAP[slug] || [];
  return relatedSlugs.map(rs => ({
    '@type': 'Product',
    '@id': productId(rs, lang),
  }));
}

// ── Homepage builder ──────────────────────────────────────────────────────────

function buildHomepageSchema(lang) {
  const descriptions = {
    en: 'Bulgarian producer and exporter of sunflower kernels, cold-pressed oils, flaxseed, coriander, and specialty flours. FSSC 22000, EU Organic, Halal & Kosher certified.',
    bg: 'Български производител и износител на слънчогледови ядки, студено пресовани масла, ленено семе, кориандър и специални брашна. Сертифициран по FSSC 22000, ЕС Биологично, Халал и Кошер.',
    de: 'Bulgarischer Hersteller und Exporteur von Sonnenblumenkernen, kaltgepressten Ölen, Leinsamen, Koriander und Spezialmehlen. FSSC 22000, EU-Bio, Halal und Kosher zertifiziert.',
  };
  const slogans = {
    en: 'From Field to Final Packaging — Quality You Can Trace.',
    bg: 'От полето до крайната опаковка — качество, което можете да проследите.',
    de: 'Vom Feld zur fertigen Verpackung — Qualität, die Sie zurückverfolgen können.',
  };
  const catalogNames = {
    en: { catalog: 'Agros-98 AD Product Catalog', seeds: 'Seeds & Kernels', oils: 'Cold-Pressed Oils', flours: 'Flours & Proteins', tahinis: 'Tahinis & Butters' },
    bg: { catalog: 'Продуктов каталог на Agros-98 AD', seeds: 'Семена и ядки', oils: 'Студено пресовани масла', flours: 'Брашна и протеини', tahinis: 'Тахани и масла' },
    de: { catalog: 'Agros-98 AD Produktkatalog', seeds: 'Saaten & Kerne', oils: 'Kaltgepresste Öle', flours: 'Mehle & Proteine', tahinis: 'Tahinis & Buttern' },
  };
  const navLabels = {
    en: { home: 'Home', products: 'Products', news: 'News', contact: 'Contact' },
    bg: { home: 'Начало', products: 'Продукти', news: 'Новини', contact: 'Контакт' },
    de: { home: 'Startseite', products: 'Produkte', news: 'News', contact: 'Kontakt' },
  };

  const pfx = urlPrefix(lang);
  const cat = catalogNames[lang];
  const nav = navLabels[lang];

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['Organization', 'Corporation', 'LocalBusiness'],
        '@id': `${BASE}/#organization`,
        'name': 'Agros-98 AD',
        'url': `${BASE}/`,
        'logo': {
          '@type': 'ImageObject',
          'url': `${BASE}/Media/agros-logo.webp`,
        },
        'image': `${BASE}/Media/og-image.webp`,
        'description': descriptions[lang],
        'slogan': slogans[lang],
        'foundingDate': '1994',
        'vatID': 'BG208709219',
        'naics': '311224',
        'isicV4': '1040',
        'additionalType': 'https://www.wikidata.org/wiki/Q936971',
        'numberOfEmployees': {
          '@type': 'QuantitativeValue',
          'value': 50,
        },
        'address': {
          '@type': 'PostalAddress',
          'streetAddress': 'Industrial Zone',
          'addressLocality': 'Suvorovo',
          'addressRegion': 'Varna Province',
          'postalCode': '9170',
          'addressCountry': 'BG',
        },
        'contactPoint': [
          {
            '@type': 'ContactPoint',
            'telephone': '+359-879-127-112',
            'email': 'g.berbenkov@agros.net',
            'contactType': 'sales',
            'areaServed': 'Worldwide',
            'availableLanguage': ['English', 'Bulgarian', 'German'],
          },
          {
            '@type': 'ContactPoint',
            'email': 'office@agros.net',
            'contactType': 'customer service',
          },
        ],
        'areaServed': [
          { '@type': 'Place', 'name': 'Europe' },
          { '@type': 'Place', 'name': 'Middle East' },
          { '@type': 'Place', 'name': 'North America' },
        ],
        'knowsAbout': [
          'flaxseed',
          'sunflower kernels',
          'cold-pressed oils',
          'coriander seeds',
          'specialty flours',
          'sunflower protein',
          'seed processing',
          'oilseed crushing',
        ],
        'hasOfferCatalog': {
          '@type': 'OfferCatalog',
          'name': cat.catalog,
          'url': `${BASE}${pfx}/products`,
          'numberOfItems': 4,
          'itemListElement': [
            { '@type': 'OfferCatalog', 'name': cat.seeds,   'url': `${BASE}${pfx}/products` },
            { '@type': 'OfferCatalog', 'name': cat.oils,    'url': `${BASE}${pfx}/products` },
            { '@type': 'OfferCatalog', 'name': cat.flours,  'url': `${BASE}${pfx}/products` },
            { '@type': 'OfferCatalog', 'name': cat.tahinis, 'url': `${BASE}${pfx}/products` },
          ],
        },
        'hasCertification': [
          { '@type': 'Certification', 'name': 'FSSC 22000',                 'issuedBy': { '@type': 'Organization', 'name': 'FSSC' } },
          { '@type': 'Certification', 'name': 'ISO 22000',                  'issuedBy': { '@type': 'Organization', 'name': 'ISO' } },
          { '@type': 'Certification', 'name': 'EU Organic Certification',   'issuedBy': { '@type': 'Organization', 'name': 'European Commission' } },
          { '@type': 'Certification', 'name': 'Halal Certification',        'issuedBy': { '@type': 'Organization', 'name': 'Halal Certification Body' } },
          { '@type': 'Certification', 'name': 'Kosher Certification',       'issuedBy': { '@type': 'Organization', 'name': 'Kosher Certification Body' } },
        ],
        'sameAs': [
          'https://www.linkedin.com/company/agros-98/',
        ],
      },
      {
        '@type': 'Brand',
        '@id': `${BASE}/#brand`,
        'name': 'Agros-98 AD',
        'url': `${BASE}/`,
        'logo': {
          '@type': 'ImageObject',
          'url': `${BASE}/Media/agros-logo.webp`,
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${BASE}/#website`,
        'url': `${BASE}/`,
        'name': 'Agros-98 AD',
        'inLanguage': lang,
        'publisher': { '@id': `${BASE}/#organization` },
      },
      { '@type': 'SiteNavigationElement', 'name': nav.home,     'url': `${BASE}/` },
      { '@type': 'SiteNavigationElement', 'name': nav.products, 'url': `${BASE}${pfx}/products` },
      { '@type': 'SiteNavigationElement', 'name': nav.news,     'url': `${BASE}${pfx}/news` },
      { '@type': 'SiteNavigationElement', 'name': nav.contact,  'url': `${BASE}${pfx}/contact` },
    ],
  };
}

// Inject a TODO comment for future sameAs platforms before the homepage script tag.
const SAMEAS_TODO_COMMENT = `<!-- TODO SEO: Add to sameAs when company profiles are created:
     Europages : https://www.europages.com/[slug]
     Kompass   : https://www.kompass.com/[slug]
     Wikidata  : https://www.wikidata.org/wiki/Q[ID]
     Crunchbase: https://www.crunchbase.com/organization/[slug]
-->\n`;

// ── Product page upgrader ─────────────────────────────────────────────────────

function upgradeProductSchema(graphBlock, lang) {
  const graph = graphBlock.json;
  if (!graph['@graph']) return null;

  // Find the Product node
  const productIdx = graph['@graph'].findIndex(n => n['@type'] === 'Product');
  if (productIdx === -1) return null;

  const product = { ...graph['@graph'][productIdx] };

  // Derive slug from product URL
  const productUrl = product.url || '';
  // URL looks like https://www.agros-grain.com/flaxseed-yellow
  //              or https://www.agros-grain.com/bg/flaxseed-yellow
  const urlPath = productUrl.replace(BASE, '').replace(/^\//, '');
  // urlPath is e.g. 'flaxseed-yellow' or 'bg/flaxseed-yellow'
  const slug = urlPath.split('/').pop();

  if (!slug) return null;

  // Add @id
  product['@id'] = productId(slug, lang);

  // Replace manufacturer with @id reference
  product['manufacturer'] = {
    '@type': 'Organization',
    '@id': `${BASE}/#organization`,
  };

  // Replace brand with @id reference
  product['brand'] = {
    '@type': 'Brand',
    '@id': `${BASE}/#brand`,
  };

  // Add isRelatedTo (only if we have data)
  const related = buildRelatedTo(slug, lang);
  if (related.length > 0) {
    product['isRelatedTo'] = related;
  }

  // Rebuild the @graph
  const newGraph = {
    ...graph,
    '@graph': graph['@graph'].map((node, i) => (i === productIdx ? product : node)),
  };

  return newGraph;
}

// ── ItemList builder (for products.html) ─────────────────────────────────────

function buildItemList(lang) {
  const slugs = lang === 'de' ? PRODUCT_SLUGS_DE : lang === 'bg' ? PRODUCT_SLUGS_BG : PRODUCT_SLUGS_EN;
  const pfx = urlPrefix(lang);
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${BASE}${pfx}/products#product-list`,
    'name': lang === 'bg' ? 'Продукти на Agros-98 AD' : lang === 'de' ? 'Produkte von Agros-98 AD' : 'Agros-98 AD Products',
    'url': `${BASE}${pfx}/products`,
    'numberOfItems': slugs.length,
    'itemListElement': slugs.map((slug, i) => ({
      '@type': 'ListItem',
      'position': i + 1,
      'item': {
        '@type': 'Product',
        '@id': `${BASE}${pfx}/${slug}#product`,
        'url': `${BASE}${pfx}/${slug}`,
      },
    })),
  };
}

// ── ContactPage builder ───────────────────────────────────────────────────────

function buildContactPage(lang) {
  const pfx = urlPrefix(lang);
  const names = { en: 'Contact Agros-98 AD', bg: 'Свържете се с Agros-98 AD', de: 'Kontakt — Agros-98 AD' };
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    '@id': `${BASE}${pfx}/contact`,
    'name': names[lang],
    'url': `${BASE}${pfx}/contact`,
    'inLanguage': lang,
    'mainEntity': { '@id': `${BASE}/#organization` },
    'breadcrumb': { '@id': `${BASE}${pfx}/contact#breadcrumb` },
  };
}

// ── WebPage builder (for production-process.html) ────────────────────────────

function buildProductionProcessPage(lang) {
  const pfx = urlPrefix(lang);
  const names = {
    en: 'Production Process — Agros-98 AD',
    bg: 'Производствен процес — Agros-98 AD',
    de: 'Produktionsprozess — Agros-98 AD',
  };
  const descs = {
    en: 'Five controlled stages from raw seed intake to finished product dispatch at Agros-98 AD.',
    bg: 'Пет контролирани етапа от приемане на суровото семе до изпращане на готовия продукт в Agros-98 AD.',
    de: 'Fünf kontrollierte Stufen von der Rohwarenerfassung bis zum Versand des Fertigprodukts bei Agros-98 AD.',
  };
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${BASE}${pfx}/production-process`,
    'url': `${BASE}${pfx}/production-process`,
    'name': names[lang],
    'description': descs[lang],
    'inLanguage': lang,
    'about': { '@id': `${BASE}/#organization` },
    'publisher': { '@id': `${BASE}/#organization` },
  };
}

// ── CollectionPage builder (for news.html) ───────────────────────────────────

function buildNewsCollectionPage(lang) {
  const pfx = urlPrefix(lang);
  const slugs = NEWS_SLUGS[lang];
  const names = { en: 'News & Updates — Agros-98 AD', bg: 'Новини — Agros-98 AD', de: 'Neuigkeiten — Agros-98 AD' };
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${BASE}${pfx}/news`,
    'url': `${BASE}${pfx}/news`,
    'name': names[lang],
    'inLanguage': lang,
    'publisher': { '@id': `${BASE}/#organization` },
    'mainEntity': {
      '@type': 'ItemList',
      'itemListElement': slugs.map((slug, i) => ({
        '@type': 'ListItem',
        'position': i + 1,
        'url': `${BASE}${pfx}/news/${slug}`,
      })),
    },
  };
}

// ── Article upgrader ──────────────────────────────────────────────────────────

function upgradeArticleSchema(block) {
  const art = { ...block.json };

  // Replace author with @id reference (org is the author)
  art['author'] = { '@type': 'Organization', '@id': `${BASE}/#organization` };

  // Replace publisher with @id reference (keep logo for backwards compat)
  art['publisher'] = {
    '@type': 'Organization',
    '@id': `${BASE}/#organization`,
    'name': 'Agros-98 AD',
    'url': `${BASE}/`,
    'logo': {
      '@type': 'ImageObject',
      'url': `${BASE}/Media/agros-logo.webp`,
    },
  };

  return art;
}

// ── File processor ────────────────────────────────────────────────────────────

const changelog = [];

function log(filePath, action) {
  const rel = filePath.replace(ROOT, '').replace(/\\/g, '/').replace(/^\//, '');
  changelog.push({ file: rel, action });
  console.log(`  [${rel}] ${action}`);
}

function processFile(filePath) {
  let html = readFileSync(filePath, 'utf8');
  const fname = basename(filePath);
  const lang = langOf(filePath);
  let changed = false;

  // ── HOMEPAGE ────────────────────────────────────────────────────────────────
  if (fname === 'index.html') {
    const blocks = extractBlocks(html);
    const orgBlock = blocks.find(b => b.json && (
      (Array.isArray(b.json['@type']) && b.json['@type'].includes('Organization')) ||
      b.json['@type'] === 'Organization' || b.json['@type'] === 'LocalBusiness'
    ));
    if (orgBlock) {
      const newSchema = buildHomepageSchema(lang);
      // Inject TODO comment + new script tag in place of old block
      html = html.replace(orgBlock.full, SAMEAS_TODO_COMMENT + toScriptTag(newSchema));
      log(filePath, 'Homepage: replaced Organization/LocalBusiness with full @graph (Corporation, @id, naics, isicV4, areaServed, knowsAbout, slogan, numberOfEmployees, hasOfferCatalog, hasCertification, Brand, WebSite, SiteNavigationElements)');
      changed = true;
    }
  }

  // ── PRODUCT PAGES ───────────────────────────────────────────────────────────
  {
    const blocks = extractBlocks(html);
    for (const block of blocks) {
      if (!block.json) continue;

      // Pattern A: @graph containing a Product node
      if (block.json['@graph']) {
        const existingProduct = block.json['@graph'].find(n => n['@type'] === 'Product');
        if (!existingProduct) continue;
        // Skip if already upgraded
        if (existingProduct['@id']) break;

        const upgraded = upgradeProductSchema(block, lang);
        if (!upgraded) continue;

        html = html.replace(block.full, toScriptTag(upgraded));
        const slug = (upgraded['@graph'].find(n => n['@type'] === 'Product') || {})['@id'] || '?';
        log(filePath, `Product (@graph): added @id (${slug}), replaced manufacturer/brand with @id refs, added isRelatedTo`);
        changed = true;
        break;
      }

      // Pattern B: standalone @type:"Product" block
      if (block.json['@type'] === 'Product') {
        // Skip if already upgraded
        if (block.json['@id']) break;

        const product = { ...block.json };

        // Derive slug from product URL
        const productUrl = product.url || '';
        const urlPath = productUrl.replace(BASE, '').replace(/^\//, '');
        const slug = urlPath.split('/').pop();
        if (!slug) break;

        // Add @id
        product['@id'] = productId(slug, lang);

        // Replace manufacturer
        product['manufacturer'] = {
          '@type': 'Organization',
          '@id': `${BASE}/#organization`,
        };

        // Replace brand
        product['brand'] = {
          '@type': 'Brand',
          '@id': `${BASE}/#brand`,
        };

        // Add isRelatedTo
        const related = buildRelatedTo(slug, lang);
        if (related.length > 0) {
          product['isRelatedTo'] = related;
        }

        html = html.replace(block.full, toScriptTag(product));
        log(filePath, `Product (standalone): added @id (${product['@id']}), replaced manufacturer/brand with @id refs, added isRelatedTo`);
        changed = true;
        break;
      }
    }
  }

  // ── PRODUCTS LISTING PAGE ───────────────────────────────────────────────────
  if (fname === 'products.html') {
    // Only add if ItemList not already present
    if (!html.includes('"ItemList"')) {
      const itemList = buildItemList(lang);
      // Append just before </head>
      html = html.replace('</head>', toScriptTag(itemList) + '\n</head>');
      log(filePath, `Products listing: added ItemList schema (${itemList.numberOfItems} products)`);
      changed = true;
    }
  }

  // ── CONTACT PAGE ────────────────────────────────────────────────────────────
  if (fname === 'contact.html') {
    // Add @id to existing org block if missing
    const blocks = extractBlocks(html);
    for (const block of blocks) {
      if (!block.json) continue;
      const types = Array.isArray(block.json['@type']) ? block.json['@type'] : [block.json['@type']];
      if (!types.includes('Organization') && !types.includes('LocalBusiness')) continue;
      if (!block.json['@id']) {
        const upgraded = { ...block.json, '@id': `${BASE}/#organization` };
        html = html.replace(block.full, toScriptTag(upgraded));
        log(filePath, 'Contact: added @id to existing Organization block');
        changed = true;
      }
      break;
    }
    // Add ContactPage schema if not already present
    if (!html.includes('"ContactPage"')) {
      const cp = buildContactPage(lang);
      html = html.replace('</head>', toScriptTag(cp) + '\n</head>');
      log(filePath, 'Contact: added ContactPage schema with mainEntity @id reference');
      changed = true;
    }
  }

  // ── PRODUCTION PROCESS PAGE ─────────────────────────────────────────────────
  if (fname === 'production-process.html') {
    if (!html.includes('"WebPage"')) {
      const wp = buildProductionProcessPage(lang);
      html = html.replace('</head>', toScriptTag(wp) + '\n</head>');
      log(filePath, 'Production Process: added WebPage schema with about → #organization');
      changed = true;
    }
  }

  // ── NEWS LISTING PAGE ───────────────────────────────────────────────────────
  if (fname === 'news.html') {
    if (!html.includes('"CollectionPage"')) {
      const cp = buildNewsCollectionPage(lang);
      html = html.replace('</head>', toScriptTag(cp) + '\n</head>');
      log(filePath, `News listing: added CollectionPage schema (${NEWS_SLUGS[lang].length} articles)`);
      changed = true;
    }
  }

  // ── NEWS ARTICLE PAGES ──────────────────────────────────────────────────────
  {
    const blocks = extractBlocks(html);
    for (const block of blocks) {
      if (!block.json) continue;
      // Handle both Article and NewsArticle types
      const articleType = block.json['@type'];
      if (articleType !== 'Article' && articleType !== 'NewsArticle') continue;
      // Check if already uses @id refs
      const publisherId = (block.json['publisher'] || {})['@id'];
      const authorId    = (block.json['author']    || {})['@id'];
      if (publisherId === `${BASE}/#organization` && authorId === `${BASE}/#organization`) continue;

      const upgraded = upgradeArticleSchema(block);
      html = html.replace(block.full, toScriptTag(upgraded));
      log(filePath, 'Article: replaced author + publisher with @id references to #organization');
      changed = true;
      break;
    }
  }

  if (changed) {
    writeFileSync(filePath, html, 'utf8');
  }
  return changed;
}

// ── Walk directory recursively ────────────────────────────────────────────────

function walk(dir, callback) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      // Skip node_modules, Media, css, js, temporary screenshots, and hidden dirs
      if (['node_modules', 'Media', 'css', 'js', 'temporary screenshots', '.git'].includes(entry)) continue;
      walk(full, callback);
    } else if (entry.endsWith('.html')) {
      callback(full);
    }
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────

console.log('Agros-98 Schema Upgrade — starting...\n');

let total = 0;
let modified = 0;

walk(ROOT, (filePath) => {
  total++;
  if (processFile(filePath)) modified++;
});

console.log(`\nDone. Processed ${total} HTML files, modified ${modified}.\n`);

// ── Validation pass ───────────────────────────────────────────────────────────
console.log('Validation pass — re-parsing all modified JSON-LD...\n');

let errors = 0;
walk(ROOT, (filePath) => {
  const html = readFileSync(filePath, 'utf8');
  const blocks = extractBlocks(html);
  for (const block of blocks) {
    if (block.json === null) {
      console.error(`  PARSE ERROR in ${filePath.replace(ROOT, '')}`);
      console.error(`  Content snippet: ${block.content.slice(0, 120)}...`);
      errors++;
    }
  }
});

if (errors === 0) {
  console.log(`All JSON-LD blocks parse correctly.\n`);
} else {
  console.error(`${errors} JSON-LD parse error(s) found — review above.\n`);
}

// ── Emit changelog JSON ───────────────────────────────────────────────────────
writeFileSync(join(ROOT, 'schema-upgrade-log.json'), JSON.stringify(changelog, null, 2), 'utf8');
console.log('Changelog written to schema-upgrade-log.json');
