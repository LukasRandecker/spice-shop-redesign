/* app.js — gemeinsame Basis aller Seiten.
   Navigation, Overlay-Menü, Modal-System, Toasts, Warenkorb-Store.
   Siehe design.md, Abschnitt 7 und 9. */

/* -------------------------------------------------- Helfer */

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

/* Alles aus der Datenbank läuft durch esc(), bevor es in innerHTML landet. */
function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[c]);
}

/* Preise immer deutsch: 4,50 € */
const priceFmt = new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const money = (n) => priceFmt.format(Number(n) || 0) + ' €';

/* Mengen. Verkauft wird nach Gramm, der Preis steht pro 100 g in der Datenbank.
   1 kg ist die Obergrenze pro Position — darüber ist es kein Haushaltseinkauf mehr. */
const GRAM_MIN = 10;
const GRAM_STEP = 10;
const GRAM_DEFAULT = 100;
const GRAM_MAX = 1000;

const clampGrams = (g) => {
  const rounded = Math.round((Number(g) || GRAM_DEFAULT) / GRAM_STEP) * GRAM_STEP;
  return Math.min(GRAM_MAX, Math.max(GRAM_MIN, rounded));
};
const priceFor = (pricePer100g, grams) => (Number(pricePer100g) || 0) * grams / 100;

let spicesCache = null;

async function loadSpices() {
  if (spicesCache) return spicesCache;
  const res = await fetch('spices.json');
  const data = await res.json();
  spicesCache = (data.arraySpices || []).map((s, i) => ({ ...s, index: i }));
  return spicesCache;
}

/* -------------------------------------------------- Warenkorb */

const CART_KEY = 'spices.cart';

const Cart = {
  read() {
    try {
      const raw = sessionStorage.getItem(CART_KEY);
      const list = raw ? JSON.parse(raw) : [];
      return Array.isArray(list) ? list : [];
    } catch {
      return [];
    }
  },

  write(list) {
    sessionStorage.setItem(CART_KEY, JSON.stringify(list));
    Cart.paintBadge();
    document.dispatchEvent(new CustomEvent('cart:change', { detail: list }));
  },

  add(spice, grams = GRAM_DEFAULT) {
    const list = Cart.read();
    const hit = list.find((l) => l.name === spice.name);
    if (hit) hit.grams += grams;
    else list.push({ name: spice.name, origin: spice.origin, price: Number(spice.price_per_100g), grams });
    Cart.write(list);
  },

  setGrams(name, grams) {
    const list = Cart.read();
    const hit = list.find((l) => l.name === name);
    if (!hit) return;
    if (grams < GRAM_MIN) return Cart.remove(name);
    hit.grams = grams;
    Cart.write(list);
  },

  remove(name) {
    Cart.write(Cart.read().filter((l) => l.name !== name));
  },

  clear() {
    Cart.write([]);
  },

  /* Der Zähler in der Navigation zeigt Positionen, nicht Gramm. */
  count() {
    return Cart.read().length;
  },

  total() {
    return Cart.read().reduce((sum, l) => sum + priceFor(l.price, l.grams), 0);
  },

  paintBadge() {
    const badge = $('[data-cart-count]');
    if (!badge) return;
    const n = Cart.count();
    badge.textContent = n;
    badge.hidden = n === 0;
  }
};

/* -------------------------------------------------- Produktkarte */

const CART_ICON = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
  <path d="M1 1h2l2 9h8l2-6H4" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/>
  <circle cx="6.5" cy="13.5" r="1.2" fill="currentColor"/><circle cx="12" cy="13.5" r="1.2" fill="currentColor"/>
</svg>`;

const GEAR_ICON = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
  <circle cx="8" cy="8" r="2.4" stroke="currentColor" stroke-width="1.3"/>
  <path d="M8 1v1.8M8 13.2V15M15 8h-1.8M2.8 8H1M12.9 3.1l-1.3 1.3M4.4 11.6l-1.3 1.3M12.9 12.9l-1.3-1.3M4.4 4.4L3.1 3.1"
        stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
</svg>`;

const MINUS_ICON = `<svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M2 6h8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`;
const PLUS_ICON = `<svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M6 2v8M2 6h8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`;

/* Gramm-Wähler. Wird auf der Karte und im Warenkorb verwendet, damit
   Auswahl und Korrektur sich gleich anfühlen. */
function gramField(name, grams, { idPrefix = 'g' } = {}) {
  const id = `${idPrefix}-${name.replace(/\W+/g, '-').toLowerCase()}`;
  return `
  <div class="gram">
    <button class="gram__step" type="button" data-gram-step="-${GRAM_STEP}" aria-label="Menge verringern">${MINUS_ICON}</button>
    <label class="sr-only" for="${id}">Menge in Gramm für ${esc(name)}</label>
    <input class="gram__input num" id="${id}" type="number" inputmode="numeric"
           value="${grams}" min="${GRAM_MIN}" max="${GRAM_MAX}" step="${GRAM_STEP}" data-gram>
    <span class="gram__unit" aria-hidden="true">g</span>
    <button class="gram__step" type="button" data-gram-step="${GRAM_STEP}" aria-label="Menge erhöhen">${PLUS_ICON}</button>
  </div>`;
}

function cardHTML(spice, { admin = false } = {}) {
  const available = Number(spice.available) === 1;
  const name = esc(spice.name);
  const base = Number(spice.price_per_100g);

  return `
  <article class="card rise" data-base="${base}">
    <div class="disc">
      <img src="img/Produktfotos/${encodeURIComponent(spice.name)}.png" alt="${name}" loading="lazy" width="240" height="240">
    </div>
    <div class="card__head">
      <p class="t-label">${esc(spice.origin)}</p>
      <h3 class="t-title card__name">${name}</h3>
    </div>
    <div class="card__foot">
      <p class="t-label card__base">${money(base)} pro 100 g</p>
      <p class="t-label status ${available ? 'status--in' : 'status--out'}">${available ? 'Lieferbar' : 'Ausverkauft'}</p>
    </div>
    <div class="card__buy">
      ${gramField(spice.name, GRAM_DEFAULT, { idPrefix: 'card' })}
      <p class="t-title card__price num" data-total>${money(priceFor(base, GRAM_DEFAULT))}</p>
    </div>
    <div class="card__actions">
      ${available
        ? `<button class="btn btn--ghost btn--sm" type="button" data-add="${spice.index}">In den Warenkorb ${CART_ICON}</button>`
        : `<button class="btn btn--ghost btn--sm" type="button" disabled>Bald wieder da</button>`}
      ${admin ? `<button class="card__admin" type="button" data-admin="${spice.index}" aria-label="${name} verwalten">${GEAR_ICON}</button>` : ''}
    </div>
  </article>`;
}

/* Hält Eingabefeld und Preis einer Karte synchron. */
function syncCard(card) {
  const input = card.querySelector('[data-gram]');
  const out = card.querySelector('[data-total]');
  if (!input || !out) return;
  const grams = clampGrams(input.value);
  out.textContent = money(priceFor(card.dataset.base, grams));
  return grams;
}

document.addEventListener('input', (e) => {
  const input = e.target.closest('.card [data-gram]');
  if (!input) return;
  const card = input.closest('.card');
  const out = card.querySelector('[data-total]');
  /* Während des Tippens nicht runden — sonst springt der Cursor. */
  out.textContent = money(priceFor(card.dataset.base, Math.max(0, Number(input.value) || 0)));
});

document.addEventListener('change', (e) => {
  const input = e.target.closest('.card [data-gram]');
  if (!input) return;
  const card = input.closest('.card');
  input.value = clampGrams(input.value);
  syncCard(card);
});

document.addEventListener('click', (e) => {
  const step = e.target.closest('.card [data-gram-step]');
  if (!step) return;
  const card = step.closest('.card');
  const input = card.querySelector('[data-gram]');
  input.value = clampGrams(Number(input.value) + Number(step.dataset.gramStep));
  syncCard(card);
});

/* Ein Delegate für alle Produktraster — funktioniert auch für nachgeladene Karten. */
document.addEventListener('click', async (e) => {
  const add = e.target.closest('[data-add]');
  if (add) {
    const spice = (await loadSpices())[Number(add.dataset.add)];
    if (spice) {
      const card = add.closest('.card');
      const grams = clampGrams(card?.querySelector('[data-gram]')?.value ?? GRAM_DEFAULT);
      Cart.add(spice, grams);
      toast(`${grams} g ${spice.name} im Warenkorb`);
    }
    return;
  }
  const admin = e.target.closest('[data-admin]');
  if (admin) openAdmin(Number(admin.dataset.admin));
});

/* -------------------------------------------------- Toast */

function toast(message, variant = '') {
  let host = $('.toast-host');
  if (!host) {
    host = document.createElement('div');
    host.className = 'toast-host';
    document.body.appendChild(host);
  }
  const el = document.createElement('div');
  el.className = 'toast' + (variant ? ` toast--${variant}` : '');
  el.setAttribute('role', 'status');
  el.setAttribute('aria-live', 'polite');
  el.textContent = message;
  host.appendChild(el);
  setTimeout(() => el.remove(), 3200);
}

/* -------------------------------------------------- Modal */

const Modal = {
  lastFocus: null,

  open(id) {
    const el = document.getElementById(id);
    if (!el) return;
    Modal.closeAll();
    Modal.lastFocus = document.activeElement;
    el.classList.add('is-open');
    el.removeAttribute('aria-hidden');
    document.body.classList.add('is-locked');
    const target = el.querySelector('input, select, button:not(.modal__close)') || el.querySelector('.modal__panel');
    if (target) target.focus({ preventScroll: true });
  },

  close(el) {
    el.classList.remove('is-open');
    el.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('is-locked');
    if (Modal.lastFocus) Modal.lastFocus.focus({ preventScroll: true });
  },

  closeAll() {
    $$('.modal.is-open').forEach(Modal.close);
  }
};

document.addEventListener('click', (e) => {
  const opener = e.target.closest('[data-modal-open]');
  if (opener) {
    e.preventDefault();
    Modal.open(opener.dataset.modalOpen);
    return;
  }
  if (e.target.closest('[data-modal-close]') || e.target.classList.contains('modal')) {
    const modal = e.target.closest('.modal');
    if (modal) Modal.close(modal);
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') Modal.closeAll();
});

/* -------------------------------------------------- Navigation */

function initNav() {
  const nav = $('.nav');
  const menu = $('.menu');
  const toggle = $('.nav__toggle');
  if (!nav) return;

  let last = window.scrollY;

  const onScroll = () => {
    const y = window.scrollY;
    nav.classList.toggle('is-stuck', y > 40);
    const menuOpen = menu && menu.classList.contains('is-open');
    nav.classList.toggle('is-hidden', y > last && y > 260 && !menuOpen);
    last = y;
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const open = menu.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.querySelector('span').textContent = open ? 'Schließen' : 'Menü';
      document.body.classList.toggle('is-locked', open);
    });
    $$('a', menu).forEach((a) => a.addEventListener('click', () => toggle.click()));
  }
}

/* -------------------------------------------------- Start */

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  Cart.paintBadge();
  const year = $('[data-year]');
  if (year) year.textContent = new Date().getFullYear();
});
