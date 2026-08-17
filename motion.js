/* motion.js — Scroll-Motion ohne Bibliothek.
   Vier Muster: Wort-Reveal, Sektions-Reveal, Scroll-Bindung, Zähler.
   Siehe design.md, Abschnitt 6. */

const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const STAGGER = 45; // ms pro Wort

/* -------------------------------------------------- Wort-Reveal */

/* Zerlegt den Textinhalt in Wörter, behält Elemente (<br>, <em>) bei.
   Jedes Wort bekommt eine Maske mit overflow:hidden und einen Delay. */
function splitWords(root) {
  let i = 0;

  const walk = (node) => {
    [...node.childNodes].forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const parts = child.textContent.split(/(\s+)/);
        if (!parts.some((p) => p.trim())) return;
        const frag = document.createDocumentFragment();
        parts.forEach((part) => {
          if (!part.trim()) {
            if (part) frag.appendChild(document.createTextNode(part));
            return;
          }
          const mask = document.createElement('span');
          mask.className = 'word';
          const inner = document.createElement('span');
          inner.textContent = part;
          inner.style.setProperty('--d', `${i * STAGGER}ms`);
          i += 1;
          mask.appendChild(inner);
          frag.appendChild(mask);
        });
        child.replaceWith(frag);
      } else if (child.nodeType === Node.ELEMENT_NODE && child.tagName !== 'BR') {
        walk(child);
      }
    });
  };

  walk(root);
}

/* -------------------------------------------------- Reveal-Beobachter */

const revealer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-in');
    revealer.unobserve(entry.target);
  });
}, { threshold: 0.2, rootMargin: '0px 0px -8% 0px' });

/* Meldet neue Elemente an. Wird auch nach dem Nachladen von Produkten
   aufgerufen, damit dynamische Karten dieselbe Choreografie bekommen. */
function observe(scope = document) {
  scope.querySelectorAll('[data-split]:not([data-ready])').forEach((el) => {
    el.setAttribute('data-ready', '');
    if (REDUCED) { el.classList.add('is-in'); return; }
    splitWords(el);
    revealer.observe(el);
  });

  scope.querySelectorAll('[data-stagger]:not([data-ready])').forEach((group) => {
    group.setAttribute('data-ready', '');
    [...group.children].forEach((child, i) => {
      child.classList.add('rise');
      child.style.setProperty('--d', `${i * 80}ms`);
    });
  });

  scope.querySelectorAll('.rise:not([data-ready])').forEach((el) => {
    el.setAttribute('data-ready', '');
    if (REDUCED) { el.classList.add('is-in'); return; }
    revealer.observe(el);
  });

  scope.querySelectorAll('[data-count]:not([data-ready])').forEach((el) => {
    el.setAttribute('data-ready', '');
    if (REDUCED) { el.textContent = formatCount(el, Number(el.dataset.count)); return; }
    countUp(el);
  });
}

/* -------------------------------------------------- Zähler */

function formatCount(el, value) {
  const digits = Number(el.dataset.decimals || 0);
  return value.toLocaleString('de-DE', { minimumFractionDigits: digits, maximumFractionDigits: digits });
}

function countUp(el) {
  const target = Number(el.dataset.count);
  el.textContent = formatCount(el, 0);

  const io = new IntersectionObserver((entries) => {
    if (!entries[0].isIntersecting) return;
    io.disconnect();
    const start = performance.now();
    const dur = 1200;
    const tick = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = formatCount(el, target * eased);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, { threshold: 0.6 });

  io.observe(el);
}

/* -------------------------------------------------- Scroll-Bindung */

/* Parallax läuft über einen einzigen rAF-Loop. Animiert wird nur transform,
   damit kein Layout neu berechnet werden muss. */
function initScrollBound() {
  if (REDUCED) return;

  const layers = [...document.querySelectorAll('[data-parallax]')];
  if (!layers.length) return;

  let ticking = false;

  const update = () => {
    ticking = false;
    const vh = window.innerHeight;

    layers.forEach((layer) => {
      const rect = layer.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > vh) return;
      const depth = Number(layer.dataset.parallax) || 0.12;
      const p = (rect.top + rect.height / 2 - vh / 2) / vh;
      layer.style.transform = `translate3d(0, ${(-p * depth * 100).toFixed(2)}px, 0)`;
    });
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
}

/* -------------------------------------------------- Start */

document.addEventListener('DOMContentLoaded', () => {
  observe();
  initScrollBound();
});
