/* ============================================================
   LUMI ARQUITETURA — script.js
   ============================================================ */

/* ============================================================
   NAVIGATION — scroll state + mobile menu
   ============================================================ */
const nav       = document.getElementById('nav');
const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('navMenu');

function updateNav() {
    nav.classList.toggle('scrolled', window.scrollY > 60);
}

window.addEventListener('scroll', updateNav, { passive: true });
updateNav();

hamburger.addEventListener('click', () => {
    const open = hamburger.classList.toggle('active');
    navMenu.classList.toggle('open', open);
    nav.classList.add('scrolled');
    hamburger.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
});

navMenu.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('open');
        hamburger.setAttribute('aria-label', 'Abrir menu');
    });
});

/* ============================================================
   SMOOTH SCROLL — offsets fixed nav
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const id = this.getAttribute('href');
        if (id === '#') return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 84;
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - navH, behavior: 'smooth' });
    });
});

/* ============================================================
   REVEAL ON SCROLL (IntersectionObserver)
   Hero elements are revealed instantly on load via CSS delays;
   all other .reveal elements go through the observer.
   ============================================================ */
const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el      = entry.target;
        const parent  = el.parentElement;
        const siblings = Array.from(parent.querySelectorAll(':scope > .reveal'));
        const idx     = siblings.indexOf(el);
        el.style.transitionDelay = `${idx * 0.08}s`;
        el.classList.add('visible');
        revealObs.unobserve(el);
    });
}, {
    threshold:  0.1,
    rootMargin: '0px 0px -40px 0px'
});

document.querySelectorAll('.reveal').forEach(el => {
    if (!el.closest('.hero')) revealObs.observe(el);
});

/* Hero: trigger reveal on load using CSS transition-delay defined in stylesheet */
window.addEventListener('load', () => {
    document.querySelectorAll('.hero .reveal').forEach(el => el.classList.add('visible'));
});

/* ============================================================
   HERO PARALLAX — only on pointer devices (not touch/mobile)
   Avoids jank on iOS and Android scroll performance issues.
   ============================================================ */
const heroContent = document.querySelector('.hero__content');
const prefersNoMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouch = window.matchMedia('(pointer: coarse)').matches;

if (heroContent && !isTouch && !prefersNoMotion) {
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        if (scrolled >= window.innerHeight) return;
        const progress = scrolled / window.innerHeight;
        heroContent.style.transform = `translateY(${scrolled * 0.16}px)`;
        heroContent.style.opacity   = String(Math.max(0, 1 - progress * 1.5));
    }, { passive: true });
}

/* ============================================================
   PROJECT FILTERS
   ============================================================ */
const filterBtns = document.querySelectorAll('.filter');
const projCards  = document.querySelectorAll('.projeto-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.dataset.filter;
        projCards.forEach(card => {
            card.classList.toggle('hidden', cat !== 'all' && card.dataset.category !== cat);
        });
    });
});

/* ============================================================
   TESTIMONIALS CAROUSEL
   ============================================================ */
(function initCarousel() {
    const track    = document.getElementById('depTrack');
    const slides   = Array.from(document.querySelectorAll('.dep__slide'));
    const dotsWrap = document.getElementById('depDots');
    const btnPrev  = document.getElementById('depPrev');
    const btnNext  = document.getElementById('depNext');
    if (!track || slides.length === 0) return;

    let current = 0;
    let timer   = null;

    const dots = slides.map((_, i) => {
        const dot = document.createElement('button');
        dot.classList.add('dep__dot');
        dot.setAttribute('aria-label', `Depoimento ${i + 1}`);
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => { goTo(i); resetTimer(); });
        dotsWrap.appendChild(dot);
        return dot;
    });

    function goTo(n) {
        current = ((n % slides.length) + slides.length) % slides.length;
        track.style.transform = `translateX(-${current * 100}%)`;
        dots.forEach((d, i) => d.classList.toggle('active', i === current));
    }

    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    function resetTimer() {
        clearInterval(timer);
        timer = setInterval(next, 5800);
    }

    btnNext.addEventListener('click', () => { next(); resetTimer(); });
    btnPrev.addEventListener('click', () => { prev(); resetTimer(); });

    /* Touch swipe */
    let touchX = 0;
    track.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
        const delta = touchX - e.changedTouches[0].clientX;
        if (Math.abs(delta) > 45) { delta > 0 ? next() : prev(); resetTimer(); }
    }, { passive: true });

    /* Pause on hover */
    track.addEventListener('mouseenter', () => clearInterval(timer));
    track.addEventListener('mouseleave', resetTimer);

    resetTimer();
})();

/* ============================================================
   FAQ ACCORDION
   ============================================================ */
document.querySelectorAll('.faq-item__q').forEach(btn => {
    btn.addEventListener('click', () => {
        const item   = btn.parentElement;
        const isOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
        if (!isOpen) item.classList.add('open');
    });
});

/* ============================================================
   CONTACT FORM — simulated submission
   ============================================================ */
(function initForm() {
    const form    = document.getElementById('contatoForm');
    const success = document.getElementById('formSuccess');
    if (!form) return;

    form.addEventListener('submit', e => {
        e.preventDefault();
        const btn  = form.querySelector('button[type="submit"]');
        const orig = btn.textContent;

        btn.textContent = 'Enviando...';
        btn.disabled    = true;

        setTimeout(() => {
            btn.textContent = 'Mensagem Enviada ✓';
            success.classList.add('show');
            setTimeout(() => {
                form.reset();
                btn.textContent = orig;
                btn.disabled    = false;
                success.classList.remove('show');
            }, 4500);
        }, 1600);
    });
})();

/* ============================================================
   FOOTER NEWSLETTER — simulated
   ============================================================ */
document.querySelectorAll('.footer__nl-form').forEach(form => {
    form.addEventListener('submit', e => {
        e.preventDefault();
        const input = form.querySelector('input');
        if (!input.value.includes('@')) return;
        const btn = form.querySelector('button');
        input.value       = '';
        input.placeholder = 'Inscrito com sucesso!';
        btn.textContent   = '✓';
        btn.disabled      = true;
    });
});

/* ============================================================
   STAT COUNTER ANIMATION
   ============================================================ */
function animateCount(el, rawTarget, duration) {
    const suffix  = rawTarget.replace(/[\d.]/g, '');
    const numeral = parseFloat(rawTarget);
    const isFloat = rawTarget.includes('.');
    const steps   = Math.ceil(duration / 16);
    let frame     = 0;

    const tick = () => {
        frame++;
        const progress = frame / steps;
        const eased    = 1 - Math.pow(1 - progress, 3);
        const current  = numeral * eased;
        el.textContent = (isFloat ? current.toFixed(1) : Math.round(current)) + suffix;
        if (frame < steps) requestAnimationFrame(tick);
        else el.textContent = rawTarget;
    };

    requestAnimationFrame(tick);
}

const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        animateCount(el, el.dataset.count, 1600);
        counterObs.unobserve(el);
    });
}, { threshold: 0.6 });

document.querySelectorAll('.stat__number').forEach(el => {
    el.dataset.count = el.textContent.trim();
    el.textContent   = '0';
    counterObs.observe(el);
});
