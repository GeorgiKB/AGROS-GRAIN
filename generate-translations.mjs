import fs from 'fs';

const BASE = 'C:/Users/G.Berbenkov/Desktop/Stufiyan Agro';

const pages = [
  'index.html', 'products.html', 'contact.html',
  'hulled-sunflower-kernels-bakery.html', 'hulled-sunflower-kernels-confectionery.html',
  'broken-sunflower-kernels.html', 'coriander-seeds.html', 'coriander-splits.html',
  'flaxseed-brown.html', 'flaxseed-yellow.html',
  'sunflower-oil-linoleic.html', 'sunflower-oil-oleic.html', 'coriander-oil.html',
  'flaxseed-oil.html', 'pumpkin-oil.html', 'walnut-oil.html',
  'sunflower-flour.html', 'sunflower-protein.html', 'coriander-flour.html',
  'flaxseed-flour.html', 'pumpkin-flour.html', 'walnut-flour.html',
];

function transformLangSwitcher(html, targetLang) {
  return html.replace(
    /<div class="nav__lang"><a href="([^"]+)" class="nav__lang-link nav__lang-link--active" hreflang="en" aria-current="true">EN<\/a><a href="bg\/([^"]+)" class="nav__lang-link" hreflang="bg">BG<\/a><a href="de\/([^"]+)" class="nav__lang-link" hreflang="de">DE<\/a><\/div>/,
    (_m, enSlug, bgSlug, deSlug) => {
      if (targetLang === 'bg') {
        return `<div class="nav__lang"><a href="../${enSlug}" class="nav__lang-link" hreflang="en">EN</a><a href="${bgSlug}" class="nav__lang-link nav__lang-link--active" hreflang="bg" aria-current="true">BG</a><a href="../de/${deSlug}" class="nav__lang-link" hreflang="de">DE</a></div>`;
      } else {
        return `<div class="nav__lang"><a href="../${enSlug}" class="nav__lang-link" hreflang="en">EN</a><a href="../bg/${bgSlug}" class="nav__lang-link" hreflang="bg">BG</a><a href="${deSlug}" class="nav__lang-link nav__lang-link--active" hreflang="de" aria-current="true">DE</a></div>`;
      }
    }
  );
}

function sr(str, from, to) { return str.split(from).join(to); }

const bgUI = [
  ['<html lang="en">', '<html lang="bg">'],
  // Nav
  ['class="nav__link">Home</a>', 'class="nav__link">Начало</a>'],
  ['class="nav__link">Products <', 'class="nav__link">Продукти <'],
  ['class="nav__link">Contact</a>', 'class="nav__link">Контакт</a>'],
  ['class="nav__cta">Request a Quote</a>', 'class="nav__cta">Запитване</a>'],
  ['class="nav__mobile-link">Home</a>', 'class="nav__mobile-link">Начало</a>'],
  ['class="nav__mobile-link">Products</a>', 'class="nav__mobile-link">Продукти</a>'],
  ['class="nav__mobile-link">Contact</a>', 'class="nav__mobile-link">Контакт</a>'],
  ['class="nav__mobile-cta">Request a Quote</a>', 'class="nav__mobile-cta">Запитване</a>'],
  // Category labels (global – hits breadcrumb, hero, footer, related cards)
  ['Flours &amp; Proteins', 'Брашна &amp; Протеини'],
  ['Seeds &amp; Kernels', 'Семена &amp; Ядки'],
  ['Cold-Pressed Oils', 'Студено пресовани масла'],
  // Breadcrumb
  ['breadcrumb__item"><a href="index.html">Home</a>', 'breadcrumb__item"><a href="index.html">Начало</a>'],
  ['breadcrumb__item"><a href="products.html">Products</a>', 'breadcrumb__item"><a href="products.html">Продукти</a>'],
  // Hero buttons
  ['btn btn--primary">Request a Price</a>', 'btn btn--primary">Запитване за цена</a>'],
  ['btn btn--outline-light">Request a Sample</a>', 'btn btn--outline-light">Запитване за мостра</a>'],
  // Hero certs
  ['prod-hero__cert">COA Available</span>', 'prod-hero__cert">COA наличен</span>'],
  ['prod-hero__cert">Certificate of Origin</span>', 'prod-hero__cert">Сертификат за произход</span>'],
  // Order details box
  ['prod-hero__moq-heading">Order Details', 'prod-hero__moq-heading">Детайли за поръчката'],
  ['prod-hero__moq-label">MOQ</span>', 'prod-hero__moq-label">МОК</span>'],
  ['prod-hero__moq-label">Origin</span>', 'prod-hero__moq-label">Произход</span>'],
  ['margin-bottom:0.75rem">Packaging Options', 'margin-bottom:0.75rem">Опции за опаковка'],
  ['prod-hero__moq-label">Option</span>', 'prod-hero__moq-label">Опция</span>'],
  // Product body
  ['id="prod-desc-title">Product Description', 'id="prod-desc-title">Описание на продукта'],
  ['prod-body__desc-title">Technical Specifications', 'prod-body__desc-title">Технически спецификации'],
  ['<th>Parameter</th><th>Specification</th>', '<th>Параметър</th><th>Спецификация</th>'],
  // Documentation section
  ['section__eyebrow">Documentation</p>', 'section__eyebrow">Документация</p>'],
  ['section__title">Available with Every Shipment</h2>', 'section__title">Налично с всяка пратка</h2>'],
  ['doc-card__title">Certificate of Analysis</p>', 'doc-card__title">Сертификат за анализ</p>'],
  ['doc-card__sub">Full parameter analysis per batch</p>', 'doc-card__sub">Пълен анализ на параметрите за партида</p>'],
  ['doc-card__title">Certificate of Origin</p>', 'doc-card__title">Сертификат за произход</p>'],
  ['doc-card__sub">Bulgarian origin, EUR.1 for EU</p>', 'doc-card__sub">Български произход, EUR.1 за ЕС</p>'],
  ['doc-card__title">Phytosanitary Certificate</p>', 'doc-card__title">Фитосанитарен сертификат</p>'],
  ['doc-card__sub">Issued by Bulgarian BFSA</p>', 'doc-card__sub">Издаден от БАБХ</p>'],
  ['doc-card__title">Third-Party Lab Report</p>', 'doc-card__title">Доклад от независима лаборатория</p>'],
  ['doc-card__sub">Accredited laboratory testing</p>', 'doc-card__sub">Изпитване в акредитирана лаборатория</p>'],
  ['doc-card__status--available">Standard</span>', 'doc-card__status--available">Стандартен</span>'],
  ['doc-card__status--on-request">On Request</span>', 'doc-card__status--on-request">При заявка</span>'],
  // FAQ
  ['section__eyebrow">FAQ</p>', 'section__eyebrow">ЧЗВ</p>'],
  ['section__title">Frequently Asked Questions</h2>', 'section__title">Често задавани въпроси</h2>'],
  // Related products
  ['section__eyebrow">Related Products</p>', 'section__eyebrow">Свързани продукти</p>'],
  ['section__title">You May Also Be Interested In</h2>', 'section__title">Може да ви интересуват и</h2>'],
  // CTA band
  ['cta-band__subtitle">Contact our sales team to discuss pricing, samples, and shipping terms.</p>',
   'cta-band__subtitle">Свържете се с нашия екип за обсъждане на цени, мостри и условия за доставка.</p>'],
  ['btn btn--gold">Request a Price</a>', 'btn btn--gold">Запитване за цена</a>'],
  ['btn btn--outline-light">All Products</a>', 'btn btn--outline-light">Всички продукти</a>'],
  // Footer
  ['footer__tagline">From field to final packaging — quality you can trace.</p>',
   'footer__tagline">От полето до крайната опаковка — качество, което можете да проследите.</p>'],
  ['footer__heading">Products</p>', 'footer__heading">Продукти</p>'],
  ['footer__heading">Company</p>', 'footer__heading">Компания</p>'],
  ['footer__heading">Contact</p>', 'footer__heading">Контакт</p>'],
  ['footer__link">Home</a>', 'footer__link">Начало</a>'],
  ['footer__link">All Products \u2192</a>', 'footer__link">Всички продукти \u2192</a>'],
  ['footer__link">Contact</a>', 'footer__link">Контакт</a>'],
  ['footer__link">Request a Quote</a>', 'footer__link">Запитване</a>'],
  ['<strong>Sales</strong>', '<strong>Продажби</strong>'],
  ['footer__bottom-link">Contact</a>', 'footer__bottom-link">Контакт</a>'],
  ['footer__bottom-link">Products</a>', 'footer__bottom-link">Продукти</a>'],
  // renderNavDropdown
  ['<script>renderNavDropdown();</script>',
   "<script>renderNavDropdown({ allLabel: 'Всички продукти \u2192', locationLabel: '\u0411\u044a\u043b\u0433\u0430\u0440\u0438\u044f | \u0421\u0443\u0432\u043e\u0440\u043e\u0432\u043e &amp; \u0412\u0430\u0440\u043d\u0430' });</script>"],
  // Products page filter buttons (if present)
  ['filter__btn" data-cat="all">All</button>', 'filter__btn" data-cat="all">Всички</button>'],
  // Contact page specific strings
  ['>Full Name</label>', '>\u041f\u044a\u043b\u043d\u043e \u0438\u043c\u0435</label>'],
  ['>Company</label>', '>\u041a\u043e\u043c\u043f\u0430\u043d\u0438\u044f</label>'],
  ['>Email Address</label>', '>\u0418\u043c\u0435\u0439\u043b</label>'],
  ['>Phone (optional)</label>', '>\u0422\u0435\u043b\u0435\u0444\u043e\u043d (\u043e\u043f\u0446\u0438\u043e\u043d\u0430\u043b\u043d\u043e)</label>'],
  ['>Product Interest</label>', '>\u0418\u043d\u0442\u0435\u0440\u0435\u0441 \u043a\u044a\u043c \u043f\u0440\u043e\u0434\u0443\u043a\u0442</label>'],
  ['>Message</label>', '>\u0421\u044a\u043e\u0431\u0449\u0435\u043d\u0438\u0435</label>'],
  ['placeholder="Your full name"', 'placeholder="\u0412\u0430\u0448\u0435\u0442\u043e \u0438\u043c\u0435"'],
  ['placeholder="Your company name"', 'placeholder="\u0418\u043c\u0435 \u043d\u0430 \u043a\u043e\u043c\u043f\u0430\u043d\u0438\u044f\u0442\u0430"'],
  ['placeholder="your@email.com"', 'placeholder="your@email.com"'],
  ['Send Message', '\u0418\u0437\u043f\u0440\u0430\u0442\u0438 \u0441\u044a\u043e\u0431\u0449\u0435\u043d\u0438\u0435'],
  ['Get in Touch', '\u0421\u0432\u044a\u0440\u0436\u0435\u0442\u0435 \u0441\u0435 \u0441 \u043d\u0430\u0441'],
];

const deUI = [
  ['<html lang="en">', '<html lang="de">'],
  // Nav
  ['class="nav__link">Home</a>', 'class="nav__link">Startseite</a>'],
  ['class="nav__link">Products <', 'class="nav__link">Produkte <'],
  ['class="nav__link">Contact</a>', 'class="nav__link">Kontakt</a>'],
  ['class="nav__cta">Request a Quote</a>', 'class="nav__cta">Angebot anfragen</a>'],
  ['class="nav__mobile-link">Home</a>', 'class="nav__mobile-link">Startseite</a>'],
  ['class="nav__mobile-link">Products</a>', 'class="nav__mobile-link">Produkte</a>'],
  ['class="nav__mobile-link">Contact</a>', 'class="nav__mobile-link">Kontakt</a>'],
  ['class="nav__mobile-cta">Request a Quote</a>', 'class="nav__mobile-cta">Angebot anfragen</a>'],
  // Category labels
  ['Flours &amp; Proteins', 'Mehle &amp; Proteine'],
  ['Seeds &amp; Kernels', 'Samen &amp; Kerne'],
  ['Cold-Pressed Oils', 'Kaltgepresste \u00d6le'],
  // Breadcrumb
  ['breadcrumb__item"><a href="index.html">Home</a>', 'breadcrumb__item"><a href="index.html">Startseite</a>'],
  ['breadcrumb__item"><a href="products.html">Products</a>', 'breadcrumb__item"><a href="products.html">Produkte</a>'],
  // Hero buttons
  ['btn btn--primary">Request a Price</a>', 'btn btn--primary">Preis anfragen</a>'],
  ['btn btn--outline-light">Request a Sample</a>', 'btn btn--outline-light">Muster anfragen</a>'],
  // Hero certs
  ['prod-hero__cert">COA Available</span>', 'prod-hero__cert">COA verf\u00fcgbar</span>'],
  ['prod-hero__cert">Certificate of Origin</span>', 'prod-hero__cert">Ursprungszeugnis</span>'],
  // Order details
  ['prod-hero__moq-heading">Order Details', 'prod-hero__moq-heading">Bestelldetails'],
  ['prod-hero__moq-label">MOQ</span>', 'prod-hero__moq-label">Mindestbestellmenge</span>'],
  ['prod-hero__moq-label">Origin</span>', 'prod-hero__moq-label">Herkunft</span>'],
  ['margin-bottom:0.75rem">Packaging Options', 'margin-bottom:0.75rem">Verpackungsoptionen'],
  ['prod-hero__moq-label">Option</span>', 'prod-hero__moq-label">Option</span>'],
  // Product body
  ['id="prod-desc-title">Product Description', 'id="prod-desc-title">Produktbeschreibung'],
  ['prod-body__desc-title">Technical Specifications', 'prod-body__desc-title">Technische Spezifikationen'],
  ['<th>Parameter</th><th>Specification</th>', '<th>Parameter</th><th>Spezifikation</th>'],
  // Documentation section
  ['section__eyebrow">Documentation</p>', 'section__eyebrow">Dokumentation</p>'],
  ['section__title">Available with Every Shipment</h2>', 'section__title">Mit jeder Lieferung verf\u00fcgbar</h2>'],
  ['doc-card__title">Certificate of Analysis</p>', 'doc-card__title">Analysezertifikat</p>'],
  ['doc-card__sub">Full parameter analysis per batch</p>', 'doc-card__sub">Vollst\u00e4ndige Parameteranalyse je Charge</p>'],
  ['doc-card__title">Certificate of Origin</p>', 'doc-card__title">Ursprungszeugnis</p>'],
  ['doc-card__sub">Bulgarian origin, EUR.1 for EU</p>', 'doc-card__sub">Bulgarische Herkunft, EUR.1 f\u00fcr die EU</p>'],
  ['doc-card__title">Phytosanitary Certificate</p>', 'doc-card__title">Phytosanit\u00e4res Zertifikat</p>'],
  ['doc-card__sub">Issued by Bulgarian BFSA</p>', 'doc-card__sub">Ausgestellt von der bulgarischen BFSA</p>'],
  ['doc-card__title">Third-Party Lab Report</p>', 'doc-card__title">Drittlaborbericht</p>'],
  ['doc-card__sub">Accredited laboratory testing</p>', 'doc-card__sub">Akkreditierte Laborpr\u00fcfung</p>'],
  ['doc-card__status--available">Standard</span>', 'doc-card__status--available">Standard</span>'],
  ['doc-card__status--on-request">On Request</span>', 'doc-card__status--on-request">Auf Anfrage</span>'],
  // FAQ
  ['section__eyebrow">FAQ</p>', 'section__eyebrow">FAQ</p>'],
  ['section__title">Frequently Asked Questions</h2>', 'section__title">H\u00e4ufig gestellte Fragen</h2>'],
  // Related products
  ['section__eyebrow">Related Products</p>', 'section__eyebrow">Verwandte Produkte</p>'],
  ['section__title">You May Also Be Interested In</h2>', 'section__title">Das k\u00f6nnte Sie auch interessieren</h2>'],
  // CTA band
  ['cta-band__subtitle">Contact our sales team to discuss pricing, samples, and shipping terms.</p>',
   'cta-band__subtitle">Kontaktieren Sie unser Vertriebsteam f\u00fcr Preisausk\u00fcnfte, Muster und Lieferbedingungen.</p>'],
  ['btn btn--gold">Request a Price</a>', 'btn btn--gold">Preis anfragen</a>'],
  ['btn btn--outline-light">All Products</a>', 'btn btn--outline-light">Alle Produkte</a>'],
  // Footer
  ['footer__tagline">From field to final packaging — quality you can trace.</p>',
   'footer__tagline">Vom Feld bis zur Endverpackung \u2014 Qualit\u00e4t, die Sie nachverfolgen k\u00f6nnen.</p>'],
  ['footer__heading">Products</p>', 'footer__heading">Produkte</p>'],
  ['footer__heading">Company</p>', 'footer__heading">Unternehmen</p>'],
  ['footer__heading">Contact</p>', 'footer__heading">Kontakt</p>'],
  ['footer__link">Home</a>', 'footer__link">Startseite</a>'],
  ['footer__link">All Products \u2192</a>', 'footer__link">Alle Produkte \u2192</a>'],
  ['footer__link">Contact</a>', 'footer__link">Kontakt</a>'],
  ['footer__link">Request a Quote</a>', 'footer__link">Angebot anfragen</a>'],
  ['<strong>Sales</strong>', '<strong>Vertrieb</strong>'],
  ['footer__bottom-link">Contact</a>', 'footer__bottom-link">Kontakt</a>'],
  ['footer__bottom-link">Products</a>', 'footer__bottom-link">Produkte</a>'],
  // renderNavDropdown
  ['<script>renderNavDropdown();</script>',
   "<script>renderNavDropdown({ allLabel: 'Alle Produkte \u2192', locationLabel: 'Bulgarien | Suworowo &amp; Warna' });</script>"],
  // Products page filter buttons
  ['filter__btn" data-cat="all">All</button>', 'filter__btn" data-cat="all">Alle</button>'],
  // Contact page
  ['>Full Name</label>', '>Vollst\u00e4ndiger Name</label>'],
  ['>Company</label>', '>Unternehmen</label>'],
  ['>Email Address</label>', '>E-Mail-Adresse</label>'],
  ['>Phone (optional)</label>', '>Telefon (optional)</label>'],
  ['>Product Interest</label>', '>Produktinteresse</label>'],
  ['>Message</label>', '>Nachricht</label>'],
  ['placeholder="Your full name"', 'placeholder="Ihr vollst\u00e4ndiger Name"'],
  ['placeholder="Your company name"', 'placeholder="Ihr Unternehmensname"'],
  ['Send Message', 'Nachricht senden'],
  ['Get in Touch', 'Kontakt aufnehmen'],
];

let created = 0;
for (const page of pages) {
  const srcPath = `${BASE}/${page}`;
  if (!fs.existsSync(srcPath)) { console.warn(`SKIP (not found): ${page}`); continue; }
  const src = fs.readFileSync(srcPath, 'utf8');

  for (const [lang, uiMap] of [['bg', bgUI], ['de', deUI]]) {
    let html = src;

    // Fix asset paths
    html = html.replace(/href="css\//g, 'href="../css/');
    html = html.replace(/src="js\/products-data\.js"/g, `src="../js/products-data-${lang}.js"`);
    html = html.replace(/src="js\/main\.js"/g, 'src="../js/main.js"');

    // Transform language switcher
    html = transformLangSwitcher(html, lang);

    // Apply UI translations
    for (const [from, to] of uiMap) {
      html = sr(html, from, to);
    }

    const outDir = `${BASE}/${lang}`;
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);
    fs.writeFileSync(`${outDir}/${page}`, html, 'utf8');
    created++;
    console.log(`  created ${lang}/${page}`);
  }
}
console.log(`\nDone — ${created} files created.`);
