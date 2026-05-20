/* ================================================================
   HOMAUT — script.js
   ================================================================ */

/* ----------------------------------------------------------------
   NAVIGATION — scroll state + mobile menu
   ---------------------------------------------------------------- */
(function initNav() {
  const nav    = document.getElementById('nav');
  const toggle = document.getElementById('navToggle');
  const links  = document.getElementById('navLinks');
  if (!nav) return;

  function updateNav() {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }
  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const isOpen = toggle.classList.toggle('open');
      links.classList.toggle('open', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
      toggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
    });

    links.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('open');
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Abrir menu');
      });
    });
  }
})();

/* ----------------------------------------------------------------
   SMOOTH SCROLL — offsets fixed nav height
   ---------------------------------------------------------------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const id = this.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const navH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72;
    const top  = target.getBoundingClientRect().top + window.scrollY - navH;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ----------------------------------------------------------------
   REVEAL ON SCROLL
   ---------------------------------------------------------------- */
(function initReveal() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;

      /* Stagger siblings within same parent */
      const siblings = Array.from(
        el.parentElement.querySelectorAll(':scope > .reveal, :scope > * > .reveal')
      ).filter(s => s.parentElement === el.parentElement);
      const idx = siblings.indexOf(el);
      el.style.transitionDelay = `${idx * 0.08}s`;

      el.classList.add('visible');
      obs.unobserve(el);
    });
  }, {
    threshold:  0.08,
    rootMargin: '0px 0px -36px 0px'
  });

  document.querySelectorAll('.reveal').forEach(el => {
    if (!el.closest('.hero')) obs.observe(el);
  });

  /* Hero elements reveal on load with CSS delays */
  window.addEventListener('load', () => {
    document.querySelectorAll('.hero .reveal').forEach(el => el.classList.add('visible'));
  });
})();

/* ----------------------------------------------------------------
   MARQUEE — pause on reduced-motion
   ---------------------------------------------------------------- */
(function initMarquee() {
  const track = document.querySelector('.marquee-track');
  if (!track) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    track.style.animation = 'none';
  }
})();

/* ----------------------------------------------------------------
   CARD PARALLAX — subtle tilt on hover (pointer devices only)
   ---------------------------------------------------------------- */
(function initCardTilt() {
  const isTouch = window.matchMedia('(pointer: coarse)').matches;
  if (isTouch) return;

  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect    = card.getBoundingClientRect();
      const cx      = rect.left + rect.width  / 2;
      const cy      = rect.top  + rect.height / 2;
      const dx      = (e.clientX - cx) / (rect.width  / 2);
      const dy      = (e.clientY - cy) / (rect.height / 2);
      const rotateX = -dy * 3;
      const rotateY =  dx * 3;
      card.style.transform = `translateY(-4px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      card.style.transformOrigin = '50% 50%';
      card.style.willChange = 'transform';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform  = '';
      card.style.willChange = '';
    });
  });
})();
