/* popup.js — Inhalte aller Modals.
   Login und Registrierung werden einmal beim Start erzeugt, das Admin-Modal
   auf Zuruf mit Produktkontext. Formulare posten weiterhin auf die aktuelle
   Seite mit verstecktem formType — der Server unterscheidet daran. */

function modalShell(id, title, body, switcher = '') {
  return `
  <div class="modal" id="${id}" aria-hidden="true" role="dialog" aria-modal="true" aria-labelledby="${id}-title">
    <div class="modal__panel" tabindex="-1">
      <button class="modal__close" type="button" data-modal-close aria-label="Schließen">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" stroke-width="1.4"/>
        </svg>
      </button>
      <div class="modal__head">
        <h2 class="modal__title" id="${id}-title">${title}</h2>
        ${switcher}
      </div>
      ${body}
    </div>
  </div>`;
}

function buildAuthModals() {
  const host = document.getElementById('modals');
  if (!host) return;

  const login = modalShell(
    'modal-login',
    'Anmelden',
    `<form class="form" method="post" action="">
       <input type="hidden" name="formType" value="formLogin">
       <div class="field">
         <label for="login-mail">E-Mail</label>
         <input id="login-mail" type="email" name="mail" autocomplete="email" required>
       </div>
       <div class="field">
         <label for="login-pw">Passwort</label>
         <input id="login-pw" type="password" name="password" autocomplete="current-password" required>
       </div>
       <button class="btn btn--primary btn--block" type="submit">Anmelden</button>
       <p class="form__note">Demo-Stand. Bitte keine echten Zugangsdaten verwenden.</p>
     </form>`,
    `<p class="modal__switch">Noch kein Konto?
       <button type="button" data-modal-open="modal-register">Registrieren</button></p>`
  );

  const register = modalShell(
    'modal-register',
    'Konto anlegen',
    `<form class="form" method="post" action="">
       <input type="hidden" name="formType" value="formReg">
       <div class="field">
         <label for="reg-anrede">Anrede</label>
         <select id="reg-anrede" name="anrede" required>
           <option value="Herr">Herr</option>
           <option value="Frau">Frau</option>
           <option value="Divers">Divers</option>
         </select>
       </div>
       <div class="form__row">
         <div class="field">
           <label for="reg-first">Vorname</label>
           <input id="reg-first" type="text" name="first_name" autocomplete="given-name" required>
         </div>
         <div class="field">
           <label for="reg-last">Nachname</label>
           <input id="reg-last" type="text" name="last_name" autocomplete="family-name" required>
         </div>
       </div>
       <div class="form__row">
         <div class="field">
           <label for="reg-street">Straße</label>
           <input id="reg-street" type="text" name="street" autocomplete="address-line1" required>
         </div>
         <div class="field">
           <label for="reg-nr">Hausnummer</label>
           <input id="reg-nr" type="text" name="house_number" autocomplete="address-line2" required>
         </div>
       </div>
       <div class="form__row">
         <div class="field">
           <label for="reg-plz">PLZ</label>
           <input id="reg-plz" type="text" name="plz" inputmode="numeric" autocomplete="postal-code" required>
         </div>
         <div class="field">
           <label for="reg-city">Stadt</label>
           <input id="reg-city" type="text" name="city" autocomplete="address-level2" required>
         </div>
       </div>
       <div class="field">
         <label for="reg-mail">E-Mail</label>
         <input id="reg-mail" type="email" name="email" autocomplete="email" required>
       </div>
       <div class="field">
         <label for="reg-pw">Passwort</label>
         <input id="reg-pw" type="password" name="password" autocomplete="new-password" required>
       </div>
       <button class="btn btn--primary btn--block" type="submit">Konto anlegen</button>
       <p class="form__note">Demo-Stand. Bitte keine echten Daten verwenden.</p>
     </form>`,
    `<p class="modal__switch">Schon registriert?
       <button type="button" data-modal-open="modal-login">Anmelden</button></p>`
  );

  host.insertAdjacentHTML('beforeend', login + register);
}

/* -------------------------------------------------- Admin */

function adminHost() {
  let el = document.getElementById('modal-admin');
  if (el) el.remove();
  document.getElementById('modals').insertAdjacentHTML('beforeend',
    modalShell('modal-admin', 'Verwalten', '<div class="modal__tabs" id="admin-body"></div>'));
  return document.getElementById('admin-body');
}

function openAdmin(index) {
  const body = adminHost();
  body.innerHTML = `
    <button class="btn btn--ghost btn--block" type="button" onclick="adminAdd()">Neues Gewürz</button>
    <button class="btn btn--ghost btn--block" type="button" onclick="adminEdit(${index})">Bearbeiten</button>
    <button class="btn btn--ghost btn--danger btn--block" type="button" onclick="adminDelete(${index})">Löschen</button>`;
  Modal.open('modal-admin');
}

async function adminEdit(index) {
  const spice = (await loadSpices())[index];
  const body = document.getElementById('admin-body') || adminHost();
  body.innerHTML = `
    <form class="form" method="post" action="">
      <input type="hidden" name="formType" value="hostedit">
      <input type="hidden" name="oldname" value="${esc(spice.name)}">
      <p class="form__note">Leere Felder bleiben unverändert.</p>
      <div class="field"><label>Name</label><input type="text" name="name" placeholder="${esc(spice.name)}"></div>
      <div class="field"><label>Herkunft</label><input type="text" name="origin" placeholder="${esc(spice.origin)}"></div>
      <div class="field"><label>Preis / 100 g</label><input type="number" step="0.10" name="price_per_100g" placeholder="${esc(spice.price_per_100g)}"></div>
      <div class="field"><label>Verfügbarkeit</label>
        <select name="available">
          <option value="1">Verfügbar</option>
          <option value="0">Nicht verfügbar</option>
        </select>
      </div>
      <button class="btn btn--primary btn--block" type="submit">Speichern</button>
    </form>`;
}

async function adminDelete(index) {
  const spice = (await loadSpices())[index];
  const body = document.getElementById('admin-body') || adminHost();
  body.innerHTML = `
    <form class="form" method="post" action="">
      <input type="hidden" name="formType" value="hostdel">
      <input type="hidden" name="name" value="${esc(spice.name)}">
      <p class="t-body">„${esc(spice.name)}" wird dauerhaft aus dem Katalog entfernt.</p>
      <button class="btn btn--ghost btn--danger btn--block" type="submit">Endgültig löschen</button>
    </form>`;
}

function adminAdd() {
  const body = document.getElementById('admin-body') || adminHost();
  body.innerHTML = `
    <form class="form" method="post" action="" enctype="multipart/form-data">
      <input type="hidden" name="formType" value="hostadd">
      <div class="field"><label for="add-pic">Produktfoto</label><input id="add-pic" type="file" name="picture" accept="image/*" required></div>
      <div class="field"><label for="add-name">Name</label><input id="add-name" type="text" name="name" required></div>
      <div class="field"><label for="add-origin">Herkunft</label><input id="add-origin" type="text" name="origin" required></div>
      <div class="field"><label for="add-price">Preis / 100 g</label><input id="add-price" type="number" step="0.10" name="price_per_100g" required></div>
      <div class="field"><label for="add-avail">Verfügbarkeit</label>
        <select id="add-avail" name="available" required>
          <option value="1">Verfügbar</option>
          <option value="0">Nicht verfügbar</option>
        </select>
      </div>
      <p class="form__note">Der Dateiname muss dem Produktnamen entsprechen.</p>
      <button class="btn btn--primary btn--block" type="submit">Anlegen</button>
    </form>`;
}

document.addEventListener('DOMContentLoaded', buildAuthModals);
