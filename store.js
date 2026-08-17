/* store.js — Katalogseite.
   Das Raster ist reines CSS-Grid; die alte Aufteilung in Zeilen-Container
   samt Neuaufbau beim Resize entfällt ersatzlos. */

async function renderCatalog() {
  const host = document.getElementById('shop');
  if (!host) return;

  try {
    const spices = await loadSpices();
    const admin = isHost();

    host.innerHTML = spices.map((s) => cardHTML(s, { admin })).join('');
    host.querySelectorAll('.card').forEach((card, i) => {
      card.style.setProperty('--d', `${(i % 4) * 80}ms`);
    });

    const count = document.getElementById('catalog-count');
    if (count) count.textContent = spices.length;

    observe(host);
  } catch (err) {
    console.error('spices.json konnte nicht geladen werden:', err);
    host.innerHTML = `<p class="t-body">Der Katalog konnte nicht geladen werden.
      Läuft der Server? <code>node server.mjs</code></p>`;
  }
}

document.addEventListener('DOMContentLoaded', renderCatalog);
