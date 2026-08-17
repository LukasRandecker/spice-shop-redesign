/* login.js — Anmeldezustand in der Navigation.
   Liest den vom Server gesetzten user-Cookie. Das ist der Bestand und
   sicherheitstechnisch eine Baustelle (siehe CLAUDE.md); hier wird nur die
   Darstellung neu gebaut, nicht das Verfahren. */

function readUser() {
  const raw = document.cookie
    .split('; ')
    .find((c) => c.startsWith('user='));
  if (!raw) return null;
  try {
    const json = decodeURIComponent(raw.slice(5).replace(/\+/g, ' ')).replace(/^j:/, '');
    const parsed = JSON.parse(json);
    return Array.isArray(parsed) ? parsed[0] : parsed;
  } catch {
    return null;
  }
}

function isHost() {
  const user = readUser();
  return !!user && user.first_name === 'root' && user.last_name === 'host';
}

function logout() {
  document.cookie = 'user=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/';
  toast('Abgemeldet');
  setTimeout(() => window.location.reload(), 600);
}

function paintAuth() {
  const user = readUser();
  document.querySelectorAll('[data-auth]').forEach((el) => {
    const isLogout = el.dataset.auth === 'out';
    el.hidden = isLogout ? !user : !!user;
  });

  document.querySelectorAll('[data-greeting]').forEach((el) => {
    el.textContent = user ? user.first_name : '';
    el.hidden = !user;
  });

  document.querySelectorAll('[data-logout]').forEach((el) => {
    el.addEventListener('click', logout);
  });
}

document.addEventListener('DOMContentLoaded', paintAuth);
