/* ============================================================
   MENTORIA IA PARA DIREITO — Myrelle Santiago
   Premium Refined Edition
   ============================================================ */

(function () {
  'use strict';

  /* ── LUCIDE ICONS ────────────────────────────────────────── */
  if (window.lucide) {
    lucide.createIcons({
      attrs: { 'stroke-width': 1.5 }
    });
  }

  /* ── SCROLL PROGRESS BAR ─────────────────────────────────── */
  const progressBar = document.getElementById('scrollProgress');
  if (progressBar) {
    window.addEventListener('scroll', function () {
      var scrolled = window.scrollY;
      var total = document.documentElement.scrollHeight - window.innerHeight;
      progressBar.style.width = (total > 0 ? (scrolled / total) * 100 : 0) + '%';
    }, { passive: true });
  }

  /* ── NAV: scroll effect ─────────────────────────────────── */
  var nav = document.getElementById('nav');

  function updateNav() {
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  /* ── NAV: mobile toggle ──────────────────────────────────── */
  var navToggle = document.getElementById('navToggle');
  var navLinks  = document.getElementById('navLinks');

  navToggle.addEventListener('click', function () {
    var isOpen = navLinks.classList.toggle('open');
    navToggle.classList.toggle('active', isOpen);
    navToggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('open');
      navToggle.classList.remove('active');
      navToggle.setAttribute('aria-label', 'Abrir menu');
      document.body.style.overflow = '';
    });
  });

  /* ── SMOOTH SCROLL ───────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var href = this.getAttribute('href');
      if (href === '#') return;
      var target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      var offset = 80;
      var top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  /* ── SCROLL ANIMATIONS (IntersectionObserver) ────────────── */
  var animEls = document.querySelectorAll('.fade-up, .fade-left, .fade-right');

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        var el = entry.target;

        /* Stagger siblings that are direct children of the same parent */
        var siblings = el.parentElement
          ? Array.from(el.parentElement.children).filter(function (c) {
              return c.classList.contains('fade-up') ||
                     c.classList.contains('fade-left') ||
                     c.classList.contains('fade-right');
            })
          : [];

        var idx   = siblings.indexOf(el);
        var delay = Math.min(idx * 80, 320); /* cap stagger at 320ms */

        setTimeout(function () {
          el.classList.add('visible');
        }, delay);

        observer.unobserve(el);
      });
    }, {
      threshold:  0.10,
      rootMargin: '0px 0px -48px 0px'
    });

    animEls.forEach(function (el) { observer.observe(el); });

  } else {
    /* Fallback for browsers without IntersectionObserver */
    animEls.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ── FAQ ACCORDION ───────────────────────────────────────── */
  document.querySelectorAll('.faq-question').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var answer   = this.nextElementSibling;
      var expanded = this.getAttribute('aria-expanded') === 'true';

      /* Close all open items */
      document.querySelectorAll('.faq-question').forEach(function (other) {
        if (other === btn) return;
        other.setAttribute('aria-expanded', 'false');
        slideUp(other.nextElementSibling);
      });

      /* Toggle current */
      this.setAttribute('aria-expanded', String(!expanded));
      expanded ? slideUp(answer) : slideDown(answer);
    });
  });

  function slideDown(el) {
    if (!el) return;
    el.hidden = false;
    var h = el.scrollHeight;
    el.style.overflow  = 'hidden';
    el.style.maxHeight = '0';
    el.style.transition = 'max-height 0.38s cubic-bezier(0.4,0,0.2,1)';
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { el.style.maxHeight = h + 'px'; });
    });
    el.addEventListener('transitionend', function done() {
      el.style.maxHeight = '';
      el.style.overflow  = '';
      el.removeEventListener('transitionend', done);
    });
  }

  function slideUp(el) {
    if (!el || el.hidden) return;
    el.style.overflow   = 'hidden';
    el.style.maxHeight  = el.scrollHeight + 'px';
    el.style.transition = 'max-height 0.30s cubic-bezier(0.4,0,0.2,1)';
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { el.style.maxHeight = '0'; });
    });
    el.addEventListener('transitionend', function done() {
      el.hidden = true;
      el.style.maxHeight = '';
      el.style.overflow  = '';
      el.removeEventListener('transitionend', done);
    });
  }

  /* ── WHATSAPP FLOAT: fade out over footer ───────────────── */
  var waFloat = document.querySelector('.whatsapp-float');
  var footer  = document.querySelector('.footer');

  if (waFloat && footer && 'IntersectionObserver' in window) {
    var footerObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        waFloat.style.opacity      = entry.isIntersecting ? '0' : '1';
        waFloat.style.pointerEvents = entry.isIntersecting ? 'none' : '';
      });
    }, { threshold: 0.05 });
    footerObserver.observe(footer);
  }

  /* ── CARD HOVER TILT (subtle, desktop only) ─────────────── */
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.querySelectorAll('.audience-card, .modulo-card').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect  = card.getBoundingClientRect();
        var x     = e.clientX - rect.left - rect.width  / 2;
        var y     = e.clientY - rect.top  - rect.height / 2;
        var tiltX = -(y / rect.height) * 4;
        var tiltY =  (x / rect.width)  * 4;
        card.style.transform = 'translateY(-6px) rotateX(' + tiltX + 'deg) rotateY(' + tiltY + 'deg)';
        card.style.transition = 'transform 0.1s linear, box-shadow 0.32s ease, border-color 0.32s ease';
      });
      card.addEventListener('mouseleave', function () {
        card.style.transform  = '';
        card.style.transition = '';
      });
    });
  }

})();
