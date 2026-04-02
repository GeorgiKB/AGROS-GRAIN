/* ============================================================
   Agros-98 AD — Main JavaScript
   ============================================================ */

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
      el.textContent = current + suffix;
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
    var filename = path.split('/').pop() || 'index.html';
    if (!filename || filename === '') filename = 'index.html';

    function isProductPage(f) {
      return f !== 'index.html' && f !== 'contact.html' && f !== 'products.html';
    }

    document.querySelectorAll('.nav__link').forEach(function (link) {
      var href = link.getAttribute('href');
      if (!href) return;
      var linkFile = href.split('/').pop();
      var active = false;
      if (linkFile === filename) {
        active = true;
      } else if (linkFile === 'products.html' && (filename === 'products.html' || isProductPage(filename))) {
        active = true;
      }
      if (active) link.classList.add('nav__link--active');
    });

    document.querySelectorAll('.nav__mobile-link').forEach(function (link) {
      var href = link.getAttribute('href');
      if (!href) return;
      var linkFile = href.split('/').pop();
      var active = false;
      if (linkFile === filename) {
        active = true;
      } else if (linkFile === 'products.html' && (filename === 'products.html' || isProductPage(filename))) {
        active = true;
      }
      if (active) link.classList.add('nav__mobile-link--active');
    });
  })();

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
        html += '<a href="' + pathPrefix + p.slug + '.html" class="nav__dropdown-link">' + p.name + '</a>';
      });
      html += '</div>';
    });
    html += '</div>';
    var certs = [
      { src: '/Media/certs/fssc22000.png', alt: 'FSSC 22000' },
      { src: '/Media/certs/eu-organic.png', alt: 'EU Organic' },
      { src: '/Media/certs/halal.png',      alt: 'Halal' },
      { src: '/Media/certs/kiwa.png',        alt: 'Kiwa' },
      { src: '/Media/certs/kosher.png',      alt: 'Kosher' },
    ];
    var certsHtml = '<div class="nav__dropdown-certs">';
    certs.forEach(function (c) {
      certsHtml += '<img src="' + c.src + '" alt="' + c.alt + '" class="nav__dropdown-cert-logo">';
    });
    certsHtml += '</div>';
    html += '<div class="nav__dropdown-footer">' + certsHtml + '<a href="' + pathPrefix + 'products.html" class="nav__dropdown-all">' + allLabel + '</a></div>';
    dd.innerHTML = html;
  }
  window.renderNavDropdown = renderNavDropdown;

})();
