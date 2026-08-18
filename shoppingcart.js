/* shoppingcart.js — Warenkorbseite.
   Positionen werden in Gramm geführt; der Preis ergibt sich aus dem
   100-g-Preis. Versand ab 39 € kostenfrei, darunter pauschal 4,90 €. */

const SHIPPING = 4.9;
const FREE_FROM = 39;

function lineHTML(line) {
  const name = esc(line.name);
  return `
  <div class="cart__line" data-line="${name}">
    <div class="disc">
      <img src="img/Produktfotos/${encodeURIComponent(line.name)}.png" alt="${name}" loading="lazy" width="96" height="96">
    </div>
    <div class="cart__info">
      <h2 class="t-title card__name">${name}</h2>
      <p class="t-label">${esc(line.origin)}</p>
      <p class="t-label cart__unit">${money(line.price)} pro 100 g</p>
      <button class="cart__remove t-label" type="button" data-remove="${name}">Entfernen</button>
    </div>
    ${gramField(line.name, line.grams, { idPrefix: 'cart' })}
    <p class="t-title cart__sum num">${money(priceFor(line.price, line.grams))}</p>
  </div>`;
}

function summaryHTML(subtotal) {
  const shipping = subtotal >= FREE_FROM || subtotal === 0 ? 0 : SHIPPING;
  return `
  <aside class="summary">
    <p class="t-label">Zusammenfassung</p>
    <div class="summary__row"><span>Zwischensumme</span><span class="num">${money(subtotal)}</span></div>
    <div class="summary__row"><span>Versand</span><span class="num">${shipping ? money(shipping) : 'kostenfrei'}</span></div>
    ${shipping ? `<p class="form__note">Noch ${money(FREE_FROM - subtotal)} bis zum kostenfreien Versand.</p>` : ''}
    <div class="summary__row summary__row--total"><span class="t-label">Gesamt</span><b class="num">${money(subtotal + shipping)}</b></div>
    <button class="btn btn--primary btn--block" type="button" id="checkout">Bestellen</button>
    <p class="form__note">Demo-Bestellung. Es wird nichts versendet und nichts berechnet.</p>
  </aside>`;
}

/* Merkt sich, worauf der Fokus lag, damit +/- und Tastatureingabe beim
   Neuzeichnen nicht den Fokus verlieren. */
function focusKey() {
  const el = document.activeElement;
  const line = el?.closest?.('[data-line]');
  if (!line) return null;
  if (el.matches('[data-gram]')) return { line: line.dataset.line, role: 'input' };
  const step = el.closest('[data-gram-step]');
  if (step) return { line: line.dataset.line, role: `step${step.dataset.gramStep}` };
  return null;
}

function restoreFocus(key) {
  if (!key) return;
  const line = document.querySelector(`[data-line="${CSS.escape(key.line)}"]`);
  if (!line) return;
  const el = key.role === 'input'
    ? line.querySelector('[data-gram]')
    : line.querySelector(`[data-gram-step="${key.role.slice(4)}"]`);
  el?.focus({ preventScroll: true });
}

function renderCart() {
  const host = document.getElementById('cart');
  if (!host) return;

  const key = focusKey();
  const lines = Cart.read();

  if (!lines.length) {
    host.innerHTML = `
      <div class="empty">
        <h2 class="t-headline">Noch nichts drin</h2>
        <p class="t-lead">Der Warenkorb ist leer. Der Katalog ist einen Klick entfernt.</p>
        <a class="btn btn--ghost" href="store.html">Zum Katalog</a>
      </div>`;
    return;
  }

  host.innerHTML = `<div>${lines.map(lineHTML).join('')}</div>${summaryHTML(Cart.total())}`;
  restoreFocus(key);
}

/* -------------------------------------------------- Mengen im Warenkorb */

document.addEventListener('click', (e) => {
  const step = e.target.closest('.cart__line [data-gram-step]');
  if (!step) return;
  const name = step.closest('[data-line]').dataset.line;
  const line = Cart.read().find((l) => l.name === name);
  if (line) Cart.setGrams(name, clampGrams(line.grams + Number(step.dataset.gramStep)));
});

/* Während des Tippens nur die Zeilensumme mitlaufen lassen — ein
   Neuzeichnen bei jedem Tastendruck würde die Eingabe zerreißen. */
document.addEventListener('input', (e) => {
  const input = e.target.closest('.cart__line [data-gram]');
  if (!input) return;
  const row = input.closest('[data-line]');
  const line = Cart.read().find((l) => l.name === row.dataset.line);
  if (!line) return;
  row.querySelector('.cart__sum').textContent = money(priceFor(line.price, Math.max(0, Number(input.value) || 0)));
});

document.addEventListener('change', (e) => {
  const input = e.target.closest('.cart__line [data-gram]');
  if (!input) return;
  const name = input.closest('[data-line]').dataset.line;
  Cart.setGrams(name, clampGrams(input.value));
});

/* -------------------------------------------------- Bestellung */

function orderModal(total) {
  const host = document.getElementById('modals');
  document.getElementById('modal-order')?.remove();

  host.insertAdjacentHTML('beforeend', modalShell('modal-order', 'Danke', `
    <div class="stack">
      <p class="t-body">Die Bestellung über <span class="saffron">${money(total)}</span> ist eingegangen.</p>
      <button class="btn btn--ghost btn--block" type="button" data-modal-close>Schließen</button>
    </div>`));

  Modal.open('modal-order');
}

document.addEventListener('click', (e) => {
  const remove = e.target.closest('[data-remove]');
  if (remove) {
    Cart.remove(remove.dataset.remove);
    toast('Position entfernt');
    return;
  }

  if (e.target.closest('#checkout')) {
    const subtotal = Cart.total();
    const total = subtotal >= FREE_FROM ? subtotal : subtotal + SHIPPING;
    orderModal(total);
    Cart.clear();
  }
});

document.addEventListener('cart:change', renderCart);
document.addEventListener('DOMContentLoaded', renderCart);
