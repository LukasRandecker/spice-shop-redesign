/* index.js — Startseite: Laufband, Kennzahlen, Auswahl.
   Alle drei Blöcke werden aus spices.json gespeist, damit die Zahlen auf der
   Startseite dem Katalog entsprechen und nicht behauptet sind. */

function buildTicker(spices) {
  const track = document.getElementById('ticker');
  if (!track) return;

  const item = (name) =>
    `<span class="ticker__item">${esc(name)}</span><span class="ticker__dot">•</span>`;

  const run = spices.map((s) => item(s.name)).join('');
  track.innerHTML = run + run; // zweimal für den nahtlosen Umlauf
}

/* Setzt einen Zählerwert nach und meldet ihn erneut bei motion.js an. */
function setStat(index, value, decimals = 0) {
  const el = document.querySelectorAll('#stats [data-count]')[index];
  if (!el) return;
  el.dataset.count = value;
  if (decimals) el.dataset.decimals = decimals;
  el.removeAttribute('data-ready');
  observe(document.getElementById('stats'));
}

function buildStats(spices) {
  if (!spices.length) return;
  const countries = new Set(spices.map((s) => String(s.origin).trim())).size;

  setStat(0, spices.length);
  setStat(1, countries);
}

/* Ohne Bewertungen entscheidet die Verfügbarkeit: gezeigt werden vier
   lieferbare Sorten, die günstigste zuerst. */
function buildFeatured(spices) {
  const host = document.getElementById('featured');
  if (!host) return;

  const picked = spices
    .filter((s) => Number(s.available) === 1)
    .sort((a, b) => Number(a.price_per_100g) - Number(b.price_per_100g))
    .slice(0, 4);

  host.innerHTML = picked.map((s) => cardHTML(s, { admin: isHost() })).join('');
  host.querySelectorAll('.card').forEach((card, i) => card.style.setProperty('--d', `${i * 80}ms`));
  observe(host);
}

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const spices = await loadSpices();
    buildTicker(spices);
    buildStats(spices);
    buildFeatured(spices);
  } catch (err) {
    console.error('spices.json konnte nicht geladen werden:', err);
  }
});
