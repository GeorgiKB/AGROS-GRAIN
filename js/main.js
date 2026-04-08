/* ============================================================
   Agros-98 AD — Main JavaScript
   ============================================================ */

/* --- Skip Navigation Link --- */
(function () {
  var skip = document.createElement('a');
  skip.href = '#main-content';
  skip.className = 'skip-link';
  skip.textContent = 'Skip to main content';
  document.body.insertBefore(skip, document.body.firstChild);
  // Tag the first meaningful landmark as the skip target
  var main = document.querySelector('main') ||
             document.querySelector('[role="main"]') ||
             document.querySelector('.hero, .page-hero, .prod-hero, .contact-page, .products-section');
  if (main && !main.id) main.id = 'main-content';
})();

/* --- Cookie Consent Banner --- */
(function () {
  if (localStorage.getItem('agros_cookie_ok')) return;
  var banner = document.createElement('div');
  banner.setAttribute('role', 'region');
  banner.setAttribute('aria-label', 'Cookie notice');
  banner.style.cssText = 'position:fixed;bottom:0;left:0;right:0;z-index:9999;background:#1e160a;color:#e8c870;padding:1rem 1.5rem;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:0.75rem;font-family:system-ui,sans-serif;font-size:0.875rem;line-height:1.5;box-shadow:0 -2px 16px rgba(0,0,0,0.3);';
  banner.innerHTML = '<p style="margin:0;flex:1 1 280px;">This site uses functional cookies and map tiles from CARTO/OpenStreetMap. No tracking or advertising cookies are used. <a href="/privacy" style="color:#d4a843;text-decoration:underline;">Privacy Policy</a></p><button id="agros-cookie-ok" style="background:#d4a843;color:#1e160a;border:none;border-radius:6px;padding:0.5rem 1.25rem;font-weight:700;font-size:0.875rem;cursor:pointer;flex-shrink:0;">OK, got it</button>';
  document.body.appendChild(banner);
  document.getElementById('agros-cookie-ok').addEventListener('click', function () {
    localStorage.setItem('agros_cookie_ok', '1');
    banner.remove();
  });
})();

(function () {
  'use strict';

  /* --- Nav Scroll --- */
  var nav = document.querySelector('.nav');
  var hasBreadcrumb = !!document.querySelector('.breadcrumb');
  if (nav) {
    function handleNavScroll() {
      if (window.scrollY > 60 || hasBreadcrumb) {
        nav.classList.add('nav--scrolled');
      } else {
        nav.classList.remove('nav--scrolled');
      }
    }
    window.addEventListener('scroll', handleNavScroll, { passive: true });
    handleNavScroll();
  }

  /* --- Hamburger / Mobile Nav --- */
  var hamburger = document.querySelector('.nav__hamburger');
  var mobileNav = document.querySelector('.nav__mobile');
  var body = document.body;

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', function () {
      var isOpen = hamburger.classList.toggle('is-open');
      mobileNav.classList.toggle('is-open', isOpen);
      body.style.overflow = isOpen ? 'hidden' : '';
      hamburger.setAttribute('aria-expanded', isOpen);
    });

    // Close on mobile link click
    var mobileLinks = mobileNav.querySelectorAll('.nav__mobile-link, .nav__mobile-cta');
    mobileLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.classList.remove('is-open');
        mobileNav.classList.remove('is-open');
        body.style.overflow = '';
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });

    // Close on outside click
    mobileNav.addEventListener('click', function (e) {
      if (e.target === mobileNav) {
        hamburger.classList.remove('is-open');
        mobileNav.classList.remove('is-open');
        body.style.overflow = '';
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });

    // Inject language switcher into mobile nav from desktop nav
    var desktopLangLinks = document.querySelectorAll('.nav__lang .nav__lang-link');
    if (desktopLangLinks.length) {
      var langDiv = document.createElement('div');
      langDiv.className = 'nav__mobile-lang';
      desktopLangLinks.forEach(function (link) {
        var a = document.createElement('a');
        a.href = link.getAttribute('href');
        a.textContent = link.textContent.trim();
        a.className = 'nav__mobile-lang-link' + (link.classList.contains('nav__lang-link--active') ? ' nav__mobile-lang-link--active' : '');
        var hl = link.getAttribute('hreflang');
        if (hl) a.setAttribute('hreflang', hl);
        if (link.getAttribute('aria-current')) a.setAttribute('aria-current', link.getAttribute('aria-current'));
        langDiv.appendChild(a);
      });
      mobileNav.appendChild(langDiv);
    }
  }

  /* --- Reveal Animations (IntersectionObserver) --- */
  var reveals = document.querySelectorAll('.reveal');
  if (reveals.length && 'IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    reveals.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    // Fallback: show all
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* --- Counter Animations --- */
  function animateCounter(el, target, suffix, duration) {
    var start = 0;
    var startTime = null;
    suffix = suffix || '';

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = Math.round(eased * target);
      if (current > 0) el.textContent = current + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var counters = document.querySelectorAll('[data-counter]');
  if (counters.length && 'IntersectionObserver' in window) {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var target = parseInt(el.getAttribute('data-counter'), 10);
          var suffix = el.getAttribute('data-suffix') || '';
          animateCounter(el, target, suffix, 1800);
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(function (el) {
      counterObserver.observe(el);
    });
  }

  /* --- Smooth Scroll for anchor links --- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        var navH = nav ? nav.offsetHeight : 0;
        var top = target.getBoundingClientRect().top + window.scrollY - navH - 24;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  /* --- Contact Form --- */
  var contactForm = document.querySelector('.contact-form form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = contactForm.querySelector('[type="submit"]');
      var original = btn.textContent;
      btn.textContent = 'Sending…';
      btn.disabled = true;
      setTimeout(function () {
        btn.textContent = 'Message Sent ✓';
        btn.style.background = '#2a6e3f';
        setTimeout(function () {
          btn.textContent = original;
          btn.disabled = false;
          btn.style.background = '';
          contactForm.reset();
        }, 3000);
      }, 1200);
    });
  }

  /* --- FAQ accordion --- */
  var faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(function (item) {
    var btn = item.querySelector('.faq-question');
    if (btn) {
      btn.addEventListener('click', function () {
        var isOpen = item.classList.contains('is-open');
        // Close all
        faqItems.forEach(function (i) { i.classList.remove('is-open'); });
        // Toggle current
        if (!isOpen) item.classList.add('is-open');
      });
    }
  });

  /* --- Products grid filtering (products.html) --- */
  var catTabs = document.querySelectorAll('.cat-tab');
  if (catTabs.length) {
    catTabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        catTabs.forEach(function (t) { t.classList.remove('is-active'); });
        tab.classList.add('is-active');
        var cat = tab.getAttribute('data-cat');
        filterProducts(cat);
      });
    });
  }

  function filterProducts(cat) {
    var cards = document.querySelectorAll('.prod-card');
    cards.forEach(function (card) {
      var cardCat = card.getAttribute('data-category');
      if (cat === 'all' || cardCat === cat) {
        card.style.display = '';
        card.style.opacity = '0';
        card.style.transform = 'translateY(16px)';
        requestAnimationFrame(function () {
          card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        });
      } else {
        card.style.display = 'none';
      }
    });
  }

  /* --- Active nav link --- */
  (function () {
    var path = window.location.pathname;
    // Get the last non-empty segment as the slug (clean URLs, no .html)
    var segments = path.replace(/\/$/, '').split('/').filter(Boolean);
    var slug = segments.pop() || '';

    var nonProductSlugs = ['', 'contact', 'products', 'news', 'privacy', 'index', 'en', 'bg', 'de'];
    var isUnderNews = segments.indexOf('news') !== -1;

    function isProductPage(s) {
      return !isUnderNews && nonProductSlugs.indexOf(s) === -1;
    }

    document.querySelectorAll('.nav__link').forEach(function (link) {
      var href = link.getAttribute('href');
      if (!href) return;
      var linkSlug = href.replace(/\/$/, '').split('/').filter(Boolean).pop() || '';
      var active = false;
      if (linkSlug === slug) {
        active = true;
      } else if (linkSlug === 'products' && (slug === 'products' || isProductPage(slug))) {
        active = true;
      }
      if (active) link.classList.add('nav__link--active');
    });

    document.querySelectorAll('.nav__mobile-link').forEach(function (link) {
      var href = link.getAttribute('href');
      if (!href) return;
      var linkSlug = href.replace(/\/$/, '').split('/').filter(Boolean).pop() || '';
      var active = false;
      if (linkSlug === slug) {
        active = true;
      } else if (linkSlug === 'products' && (slug === 'products' || isProductPage(slug))) {
        active = true;
      }
      if (active) link.classList.add('nav__mobile-link--active');
    });
  })();

  /* --- Render related products section --- */
  function renderRelatedProducts(opts) {
    opts = opts || {};
    if (!window.AGROS_PRODUCTS) return;

    var pathPrefix = opts.pathPrefix || '/';

    // Build slug → product map
    var productMap = {};
    window.AGROS_PRODUCTS.forEach(function (p) { productMap[p.slug] = p; });

    // Determine related slugs
    var relatedSlugs = opts.relatedSlugs;
    if (!relatedSlugs) {
      var path = window.location.pathname;
      var segments = path.replace(/\/$/, '').split('/').filter(Boolean);
      var currentSlug = segments[segments.length - 1] || '';
      var currentProduct = productMap[currentSlug];
      if (!currentProduct) return;
      relatedSlugs = currentProduct.relatedSlugs || [];
      relatedSlugs = relatedSlugs.filter(function (s) { return s !== currentSlug; });
    }
    relatedSlugs = relatedSlugs.slice(0, 3);
    if (!relatedSlugs.length) return;

    function slugToName(slug) {
      return slug.replace(/-/g, ' ').replace(/\b\w/g, function (c) { return c.toUpperCase(); });
    }

    var cardsHtml = relatedSlugs.map(function (slug) {
      var p = productMap[slug];
      if (p) {
        var cat = p.category || 'seeds';
        var specHtml = (p.specs || []).slice(0, 2).map(function (s) {
          return '<div class="prod-card__spec-row"><span class="prod-card__spec-key">' + s.key + '</span><span class="prod-card__spec-val">' + s.val + '</span></div>';
        }).join('');
        return '<a href="' + pathPrefix + p.slug + '" class="prod-card prod-card--visible" data-category="' + cat + '">' +
          '<div class="prod-card__cat-bar prod-card__cat-bar--' + cat + '"><span>' + p.categoryLabel + '</span></div>' +
          '<div class="prod-card__img-wrap"><img src="/' + p.image.replace(/^\.\.\//, '') + '" alt="' + p.name + '" loading="lazy" width="84" height="84"/></div>' +
          '<div class="prod-card__body">' +
          '<h3 class="prod-card__name">' + p.name + '</h3>' +
          '<p class="prod-card__tagline">' + p.tagline + '</p>' +
          '<div class="prod-card__specs-mini">' + specHtml + '</div>' +
          '</div>' +
          '<div class="prod-card__footer"><span class="prod-card__cta">' + cta + '</span><span class="prod-card__packaging">MOQ: ' + (p.moq || '') + '</span></div>' +
          '</a>';
      } else {
        var name = slugToName(slug);
        return '<a href="' + pathPrefix + slug + '" class="prod-card prod-card--visible">' +
          '<div class="prod-card__body"><h3 class="prod-card__name">' + name + '</h3></div>' +
          '<div class="prod-card__footer"><span class="prod-card__cta">' + cta + '</span></div>' +
          '</a>';
      }
    }).join('');

    var eyebrow = opts.eyebrow || 'Related Products';
    var label   = opts.label   || 'You May Also Need';
    var cta     = opts.cta     || 'View Full Spec →';
    var sectionHtml =
      '<section class="related-section" aria-labelledby="related-title">' +
      '<div class="container">' +
      '<div class="section__header reveal"><p class="section__eyebrow">' + eyebrow + '</p>' +
      '<h2 class="section__title" id="related-title">' + label + '</h2></div>' +
      '<div class="related-grid reveal">' + cardsHtml + '</div>' +
      '</div></section>';

    var ctaBand = document.querySelector('.cta-band');
    if (ctaBand) {
      ctaBand.insertAdjacentHTML('beforebegin', sectionHtml);
      // Trigger reveal observer on new elements
      var newReveals = ctaBand.previousElementSibling.querySelectorAll('.reveal');
      newReveals.forEach(function (el) { el.classList.add('is-visible'); });
    }
  }
  window.renderRelatedProducts = renderRelatedProducts;

  /* --- Render nav dropdown --- */
  function renderNavDropdown(opts) {
    opts = opts || {};
    var pathPrefix = opts.pathPrefix || '';
    var allLabel = opts.allLabel || 'All Products →';
    var locationLabel = opts.locationLabel || 'Bulgaria | Suvorovo &amp; Varna';
    var dd = document.getElementById('nav-dropdown');
    if (!dd || !window.AGROS_PRODUCTS) return;
    var cats = window.AGROS_CATEGORIES;
    var html = '<div class="nav__dropdown-body">';
    Object.keys(cats).forEach(function (key) {
      var meta = cats[key];
      var prods = window.AGROS_PRODUCTS.filter(function (p) { return p.category === key; });
      html += '<div class="nav__dropdown-col"><div class="nav__dropdown-heading">' + meta.label + '</div>';
      prods.forEach(function (p) {
        html += '<a href="' + pathPrefix + p.slug + '" class="nav__dropdown-link">' + p.name + '</a>';
      });
      html += '</div>';
    });
    html += '</div>';
    var certs = [
      { src: '/Media/certs/fssc22000.webp', alt: 'FSSC 22000' },
      { src: '/Media/certs/eu-organic.webp', alt: 'EU Organic' },
      { src: '/Media/certs/halal.webp',      alt: 'Halal' },
      { src: '/Media/certs/kiwa.webp',        alt: 'Kiwa' },
      { src: '/Media/certs/kosher.webp',      alt: 'Kosher' },
    ];
    var certsHtml = '<div class="nav__dropdown-certs">';
    certs.forEach(function (c) {
      certsHtml += '<img src="' + c.src + '" alt="' + c.alt + '" class="nav__dropdown-cert-logo">';
    });
    certsHtml += '</div>';
    html += '<div class="nav__dropdown-footer">' + certsHtml + '<a href="' + pathPrefix + 'products" class="nav__dropdown-all">' + allLabel + '</a></div>';
    dd.innerHTML = html;
  }
  window.renderNavDropdown = renderNavDropdown;

  /* --- Hero Scroll Indicator --- */
  var heroScroll = document.querySelector('.hero__scroll');
  if (heroScroll) {
    function triggerHeroScroll() {
      var target = document.querySelector('.stats-bar') || document.querySelector('section:not(.hero)');
      if (target) {
        var navH = nav ? nav.offsetHeight : 0;
        var top = target.getBoundingClientRect().top + window.scrollY - navH;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    }
    heroScroll.addEventListener('click', triggerHeroScroll);
    heroScroll.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        triggerHeroScroll();
      }
    });
  }

})();
