# Schema Markup Changelog
**Date:** 2026-04-15  
**Scope:** All structured data (JSON-LD) across agros-grain.com — EN root, /bg, /de  
**Files modified:** 108 HTML files affected (112 scanned, 4 skipped: privacy, 404, plus unchanged pages)  
**JSON-LD blocks total after upgrade:** 294  
**Validation:** All 294 blocks parse as valid JSON with no schema.org type errors

---

## 1. Homepage — `index.html`, `bg/index.html`, `de/index.html`

**Before:** Single `@type: ["Organization", "LocalBusiness"]` block with name, url, logo, image, description, foundingDate, vatID, address, contactPoint, sameAs (LinkedIn only).

**After:** Full `@graph` with 7 entities:

| Entity | @id | Notes |
|--------|-----|-------|
| `Organization, Corporation, LocalBusiness` | `/#organization` | Canonical entity anchor for entire site |
| `Brand` | `/#brand` | Defines brand entity referenced by all product pages |
| `WebSite` | `/#website` | Associates site with publisher |
| `SiteNavigationElement` × 4 | — | Home, Products, News, Contact (translated per language) |

**New Organization properties added:**
- `@id: "https://www.agros-grain.com/#organization"` — canonical entity anchor
- `@type` extended to `["Organization", "Corporation", "LocalBusiness"]` — Corporation added (Agros-98 AD is a Bulgarian joint-stock company)
- `additionalType: "https://www.wikidata.org/wiki/Q936971"` — Wikidata food manufacturer entity
- `naics: "311224"` — oilseed processing NAICS code
- `isicV4: "1040"` — vegetable/animal oils & fats ISIC code
- `slogan` — translated per language (EN/BG/DE)
- `numberOfEmployees: {QuantitativeValue, value: 50}`
- `areaServed: [Europe, Middle East, North America]`
- `knowsAbout: [flaxseed, sunflower kernels, cold-pressed oils, coriander seeds, specialty flours, sunflower protein, seed processing, oilseed crushing]`
- `hasOfferCatalog` — OfferCatalog with 4 category sub-catalogs (Seeds & Kernels, Cold-Pressed Oils, Flours & Proteins, Tahinis & Butters), translated per language
- `hasCertification` — 5 certifications at org level (FSSC 22000, ISO 22000, EU Organic, Halal, Kosher)
- `logo` upgraded from plain string URL to `{@type: ImageObject, url: ...}` form
- HTML comment added before schema block listing TODO sameAs platforms: Europages, Kompass, Wikidata, Crunchbase

**Translations applied:**
- `description`, `slogan`, `hasOfferCatalog.name/itemListElement.name`, `SiteNavigationElement.name` all localised for BG and DE
- BG nav: Начало / Продукти / Новини / Контакт
- DE nav: Startseite / Produkte / News / Kontakt
- `WebSite.inLanguage` set to `"en"` / `"bg"` / `"de"` per file

---

## 2. Product Pages — all 27 products × 3 languages = 81 files

**Applies to:** `flaxseed-yellow.html`, `flaxseed-brown.html`, `hulled-sunflower-kernels.html`, `hulled-sunflower-kernels-bakery.html`, `hulled-sunflower-kernels-confectionery.html`, `broken-sunflower-kernels.html`, `coriander.html`, `coriander-seeds.html`, `coriander-splits.html`, `coriander-oil.html`, `coriander-flour.html`, `sunflower-oil-linoleic.html`, `sunflower-oil-oleic.html`, `flaxseed-oil.html`, `flaxseed-flour.html`, `flaxseed-tahini.html`, `pumpkin-oil.html`, `pumpkin-flour.html`, `pumpkin-tahini.html`, `walnut-oil.html`, `walnut-flour.html`, `walnut-tahini.html`, `sunflower-flour.html`, `sunflower-protein.html`, `sunflower-tahini.html`, `milk-thistle-oil.html`, `milk-thistle-flour.html`  
Plus `/bg/` and `/de/` equivalents (DE uses `leinsamen-gelb.html` instead of `flaxseed-yellow.html`).

Both schema structures present across the site were handled:
- **Pattern A** (3 pages): `@graph` containing Product + FAQPage in a single block
- **Pattern B** (24 pages): Standalone `@type: "Product"` block separate from FAQPage

**Changes per product page:**

| Property | Before | After |
|----------|--------|-------|
| `@id` | missing | `https://www.agros-grain.com/[lang-prefix]/[slug]#product` |
| `manufacturer` | `{@type: Organization, name: ..., url: ...}` | `{@type: Organization, @id: ".../#organization"}` |
| `brand` | `{@type: Brand, name: ...}` | `{@type: Brand, @id: ".../#brand"}` |
| `isRelatedTo` | missing | Array of `{@type: Product, @id: ...#product}` refs |

**`isRelatedTo` sources:** Derived from `relatedSlugs` in `js/products-data.js`. Extra pages not in products-data.js were assigned logical relationships:
- `hulled-sunflower-kernels-bakery` → [hulled-sunflower-kernels, sunflower-flour, hulled-sunflower-kernels-confectionery]
- `hulled-sunflower-kernels-confectionery` → [hulled-sunflower-kernels, sunflower-flour, hulled-sunflower-kernels-bakery]
- `broken-sunflower-kernels` → [hulled-sunflower-kernels, sunflower-flour, sunflower-oil-linoleic]
- `coriander-seeds` → [coriander, coriander-splits, coriander-flour]
- `coriander-splits` → [coriander, coriander-seeds, coriander-oil]

**Language handling:** All `@id` and `isRelatedTo` URLs use the correct language-scoped URL (e.g., `/bg/flaxseed-brown#product` for the BG version). DE `leinsamen-gelb` uses `/de/leinsamen-gelb#product` as its own `@id` and references `/de/flaxseed-brown`, `/de/flaxseed-oil`, `/de/flaxseed-flour` as related.

---

## 3. Products Listing Page — `products.html`, `bg/products.html`, `de/products.html`

**Before:** BreadcrumbList only.

**Added:** `ItemList` schema appended to `<head>`:

```json
{
  "@type": "ItemList",
  "@id": "https://www.agros-grain.com/products#product-list",
  "name": "Agros-98 AD Products",
  "url": "https://www.agros-grain.com/products",
  "numberOfItems": 27,
  "itemListElement": [ ... ]
}
```

- 27 `ListItem` entries, each referencing a `Product` entity by `@id`
- DE version uses `leinsamen-gelb` (not `flaxseed-yellow`) in position 14
- BG and DE versions use language-scoped `@id` URLs (`/bg/[slug]#product`, `/de/[slug]#product`)
- List name translated: BG = "Продукти на Agros-98 AD", DE = "Produkte von Agros-98 AD"

---

## 4. Contact Page — `contact.html`, `bg/contact.html`, `de/contact.html`

**Before:** Full duplicate `Organization/LocalBusiness` block + BreadcrumbList.

**Changes:**
1. Added `@id: "https://www.agros-grain.com/#organization"` to the existing Organization block (making it a proper reference to the canonical entity defined on the homepage)
2. Added `ContactPage` schema appended to `<head>`:

```json
{
  "@type": "ContactPage",
  "@id": "https://www.agros-grain.com/contact",
  "name": "Contact Agros-98 AD",
  "url": "https://www.agros-grain.com/contact",
  "inLanguage": "en",
  "mainEntity": { "@id": "https://www.agros-grain.com/#organization" }
}
```

Contact page name translated: BG = "Свържете се с Agros-98 AD", DE = "Kontakt — Agros-98 AD"

---

## 5. Production Process Page — `production-process.html`, `bg/production-process.html`, `de/production-process.html`

**Before:** BreadcrumbList only.

**Added:** `WebPage` schema appended to `<head>`:

```json
{
  "@type": "WebPage",
  "@id": "https://www.agros-grain.com/production-process",
  "url": "https://www.agros-grain.com/production-process",
  "name": "Production Process — Agros-98 AD",
  "description": "Five controlled stages from raw seed intake to finished product dispatch at Agros-98 AD.",
  "inLanguage": "en",
  "about": { "@id": "https://www.agros-grain.com/#organization" },
  "publisher": { "@id": "https://www.agros-grain.com/#organization" }
}
```

Name and description translated per language (BG/DE).

---

## 6. News Listing Page — `news.html`, `bg/news.html`, `de/news.html`

**Before:** BreadcrumbList only.

**Added:** `CollectionPage` schema appended to `<head>`:

```json
{
  "@type": "CollectionPage",
  "@id": "https://www.agros-grain.com/news",
  "url": "https://www.agros-grain.com/news",
  "name": "News & Updates — Agros-98 AD",
  "inLanguage": "en",
  "publisher": { "@id": "https://www.agros-grain.com/#organization" },
  "mainEntity": {
    "@type": "ItemList",
    "itemListElement": [ 4 ListItems with article URLs ]
  }
}
```

Article URL slugs differ per language (BG: `hcn-sadarzhanie-leneno-seme-rakovodstvo`, DE: `hcn-gehalt-leinsamen-kaeuferratgeber`, etc.)

---

## 7. News Article Pages — 12 files (4 articles × 3 languages)

**Articles:** `hcn-content-flaxseed-buyers-guide`, `what-separates-good-flaxseed-from-cheap-flaxseed`, `fuel-transport-costs-2026`, `yellow-flaxseed-crop-2026`

**Note:** Two article types found across the site — `Article` (hcn + what-separates articles) and `NewsArticle` (fuel-transport + yellow-flaxseed-crop articles). Both were updated identically.

**Before:**
```json
"author": { "@type": "Organization", "name": "Agros-98 AD", "url": "..." },
"publisher": { "@type": "Organization", "name": "Agros-98 AD", "url": "...", "logo": {...} }
```

**After:**
```json
"author": { "@type": "Organization", "@id": "https://www.agros-grain.com/#organization" },
"publisher": {
  "@type": "Organization",
  "@id": "https://www.agros-grain.com/#organization",
  "name": "Agros-98 AD",
  "url": "https://www.agros-grain.com/",
  "logo": { "@type": "ImageObject", "url": "https://www.agros-grain.com/Media/agros-logo.webp" }
}
```

Publisher retains `name`, `url`, and `logo` for Google News compatibility (Google still requires these fields on publisher even when @id is present).

---

## What Was NOT Changed

- All existing `BreadcrumbList` schemas — preserved exactly as-is
- All `FAQPage` schemas on product pages — preserved exactly as-is
- All `additionalProperty` (PropertyValue) specs on product pages — preserved
- All `hasCertification` entries on individual product pages — preserved
- All `Offer`, `OfferShippingDetails`, `MerchantReturnPolicy` data — preserved
- `privacy.html` and `404.html` — no schema added (appropriate for these page types)
- All visible HTML, CSS, JavaScript — zero changes

---

## Known Gaps / Future Work

1. **`sameAs` profiles** — LinkedIn is the only populated entry. Add Europages, Kompass, Wikidata, and Crunchbase URLs once those company profiles are created. TODO comments are in place in all 3 homepage files.

2. **`numberOfEmployees: 50`** — approximate value used. Update when precise headcount is confirmed.

3. **`isRelatedTo` on DE pages** — uses canonical EN slugs for related products (e.g., `/de/flaxseed-brown`). If DE ever gets German-language slugs for those related products, update the RELATED_MAP in `schema-upgrade.mjs`.

4. **Privacy page** — consider adding `WebPage` schema for completeness, though this provides minimal SEO value.

5. **Wikidata Q-number** — `Q936971` used as additionalType (food manufacturer). Confirm this is the most appropriate Wikidata entity, or substitute with a more specific entity once a company-specific Wikidata entry is created.

---

## Files Modified Summary

| Page Type | Files | Changes |
|-----------|-------|---------|
| Homepages | 3 | Full @graph rewrite |
| Product pages | 81 | @id, manufacturer/brand @id refs, isRelatedTo |
| Products listing | 3 | Added ItemList |
| Contact pages | 3 | Added @id to org + added ContactPage |
| Production Process | 3 | Added WebPage |
| News listing | 3 | Added CollectionPage |
| News articles | 12 | Updated author/publisher to @id refs |
| **Total** | **108** | |
