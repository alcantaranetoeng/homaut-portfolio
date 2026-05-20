// ── Nav scroll
const nav = document.getElementById('mainNav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ── Mobile menu
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => mobileMenu.classList.add('open'));
document.getElementById('mobileClose').addEventListener('click', () => mobileMenu.classList.remove('open'));
function closeMobile() { mobileMenu.classList.remove('open'); }

// ── Scroll reveal
const revealEls = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), 0);
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
revealEls.forEach(el => revealObs.observe(el));

// ── FAQ accordion
function toggleFaq(btn) {
  const item = btn.closest('.faq__item');
  const answer = item.querySelector('.faq__answer');
  const isOpen = item.classList.contains('open');

  document.querySelectorAll('.faq__item').forEach(i => {
    i.classList.remove('open');
    i.querySelector('.faq__answer').style.maxHeight = null;
  });

  if (!isOpen) {
    item.classList.add('open');
    answer.style.maxHeight = answer.scrollHeight + 'px';
  }
}

// ── Form submit
function handleSubmit(e) {
  e.preventDefault();
  const btn = e.target.querySelector('.form-submit');
  btn.innerHTML = '✓ Mensagem enviada com sucesso!';
  btn.style.background = 'linear-gradient(135deg, #4CAF50, #388E3C)';
  btn.disabled = true;
  setTimeout(() => {
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="width:16px;height:16px"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg> Enviar Mensagem';
    btn.style.background = '';
    btn.disabled = false;
    e.target.reset();
  }, 4000);
}

// ── Smooth anchor scroll with offset
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});
