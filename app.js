/* Quantum Travel — site behaviour
   ─────────────────────────────────────────────────────────────
   EDIT THIS BLOCK FIRST. Everything else reads from it.
*/
const SITE = {
  // Your CUSTOMER booking site, not the recruiting page. It looks like:
  // https://www.myvortex365.com/yourvortexname
  // Leave blank and every booking button opens the trip request form instead.
  bookingUrl: '',
  email: 'charity@quantumtravel365.com',
  phone: '(951) 000-0000',
  // Paste your GoHighLevel inbound webhook here when the form is ready.
  // Leave blank to run in preview mode (shows success, sends nothing).
  formEndpoint: ''
};

(function () {
  'use strict';

  /* ---------- booking links ---------- */
  const bookLinks = document.querySelectorAll('.js-book');
  bookLinks.forEach(function (a) {
    if (SITE.bookingUrl) {
      a.href = SITE.bookingUrl;
      a.target = '_blank';
      a.rel = 'noopener';
    } else {
      a.href = '#plan';
      a.removeAttribute('target');
    }
  });

  /* ---------- contact links ---------- */
  document.querySelectorAll('.js-email').forEach(function (a) {
    a.href = 'mailto:' + SITE.email;
    a.textContent = SITE.email;
  });
  document.querySelectorAll('.js-phone').forEach(function (a) {
    a.href = 'tel:' + SITE.phone.replace(/[^\d+]/g, '');
    a.textContent = SITE.phone;
  });

  /* ---------- nav ---------- */
  const nav = document.getElementById('nav');
  const onScroll = function () {
    if (window.scrollY > 40) nav.classList.add('solid');
    else nav.classList.remove('solid');
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- mobile menu ---------- */
  const burger = document.getElementById('burger');
  const menu = document.getElementById('mobileMenu');
  const toggleMenu = function (force) {
    const open = typeof force === 'boolean' ? force : !menu.classList.contains('open');
    menu.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  };
  burger.addEventListener('click', function () { toggleMenu(); });
  menu.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () { toggleMenu(false); });
  });
  window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') toggleMenu(false);
  });

  /* ---------- reveal on scroll ---------- */
  const items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- hero parallax (desktop only, subtle) ---------- */
  const heroImg = document.querySelector('.hero-media img');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (heroImg && !reduce && window.innerWidth > 900) {
    let ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        const y = Math.min(window.scrollY, window.innerHeight);
        heroImg.style.transform = 'translateY(' + (y * 0.12) + 'px) scale(1)';
        ticking = false;
      });
    }, { passive: true });
  }

  /* ---------- trip form ---------- */
  const form = document.getElementById('tripForm');
  const note = document.getElementById('formNote');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      const required = ['name', 'email'];
      const missing = required.filter(function (k) { return !String(data[k] || '').trim(); });
      if (missing.length) {
        note.textContent = 'Please add your name and email so I can reply.';
        note.classList.remove('ok');
        form.querySelector('[name="' + missing[0] + '"]').focus();
        return;
      }

      const button = form.querySelector('button[type="submit"]');
      const original = button.textContent;
      button.textContent = 'Sending…';
      button.disabled = true;

      const done = function () {
        button.textContent = 'Request sent';
        note.textContent = 'Got it. I will reply within one business day, usually much faster.';
        note.classList.add('ok');
        form.reset();
        setTimeout(function () {
          button.textContent = original;
          button.disabled = false;
        }, 4000);
      };

      if (!SITE.formEndpoint) {
        // Preview mode: no endpoint configured yet.
        console.info('[Quantum Travel] Trip request (preview mode):', data);
        setTimeout(done, 700);
        return;
      }

      fetch(SITE.formEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.assign({ source: 'website', page: location.href }, data))
      })
        .then(function (r) { if (!r.ok) throw new Error('Request failed'); return r; })
        .then(done)
        .catch(function () {
          button.textContent = original;
          button.disabled = false;
          note.textContent = 'That did not go through. Email ' + SITE.email + ' and I will pick it up there.';
          note.classList.remove('ok');
        });
    });
  }

  /* ---------- smooth anchor offset for fixed nav ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      const id = a.getAttribute('href');
      if (id === '#' || id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });
})();
