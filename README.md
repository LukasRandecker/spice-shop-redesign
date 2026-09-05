# Gewürz-Shop

Demo-Onlineshop für Gewürze: Produktkatalog mit Warenkorb, verkauft wird nach Gramm.
Vanilla HTML/CSS/JS ohne Framework und ohne Build-Schritt im Frontend.

**Live:** https://gewuerze.lukasrandecker.de

> ### Hinweis
> Das ist ein **Demo-Stand aus einem Hochschulprojekt**, kein Produktivsystem.
> Es gibt keinen Bezahlvorgang, keine Bestellabwicklung und keinen Versand — der
> Checkout zeigt eine Bestätigung und leert den Warenkorb, mehr nicht.
> Es werden **keine Kundendaten erhoben, übertragen oder gespeichert**: Login,
> Registrierung und Admin-Bereich wurden am 18.08.2026 vollständig entfernt, der
> Warenkorb liegt ausschließlich im `sessionStorage` des Browsers.
> Die Produktdaten sind echt recherchierte Sorten und Preisniveaus, aber es steht
> kein Händler dahinter.

## Wie die Seite gebaut wird

Die Seite ist **rein statisch**. Es gibt keinen Server zur Laufzeit — früher lief ein
Express-Prozess (`server.mjs`), der jede Anfrage direkt vom Dateisystem las; er ist
ersatzlos entfallen.

Die Daten kommen aus `Datenbanken.db` (SQLite, Tabelle `spices`). Der Build schreibt
daraus `spices.json`; **das Frontend liest immer nur diese JSON-Datei, nie die Datenbank.**

```bash
npm run build
```

Das sind zwei Schritte:

| Skript | Was es tut |
| --- | --- |
| `scripts/build-spices.mjs` | Schreibt `spices.json` aus `Datenbanken.db` |
| `scripts/build-dist.mjs` | Kopiert die auszuliefernden Dateien nach `dist/` |

Es gibt **keine Abhängigkeiten** — kein `npm install` nötig. Die Datenbank wird über
`node:sqlite` gelesen, das in Node ab 22.5 eingebaut ist.

### `Datenbanken.db` liegt bewusst nicht im Repo

Die Datei steht in `.gitignore`. Deshalb arbeitet `build-spices.mjs` in zwei Betriebsarten:

- **Datenbank vorhanden** (lokal): `spices.json` wird neu geschrieben.
- **Datenbank fehlt** (Cloudflare-Build): die eingecheckte `spices.json` wird geprüft
  und unverändert übernommen.

`spices.json` ist damit die eingefrorene, versionierte Quelle für den Build.
**Wer Produkte ändert, pflegt sie in `Datenbanken.db`, führt `npm run build` aus und
checkt die neu erzeugte `spices.json` mit ein.**

### Vorschau

```bash
npm run build && npm run preview
```

Läuft dann auf http://localhost:3000. Die Vorschau liefert `dist/` aus, nicht das
Wurzelverzeichnis — dieselben Dateien wie im Netz.

## Was veröffentlicht wird

`scripts/build-dist.mjs` arbeitet mit einer **Whitelist**: Was dort nicht aufgezählt
ist, landet nicht in `dist/`. Veröffentlicht werden die drei HTML-Dateien, `style.css`,
die vier JS-Dateien, `img/` und `spices.json` — sonst nichts.

Das ist Absicht und der Grund, warum nicht das Wurzelverzeichnis ausgeliefert wird:
`Datenbanken.db` bleibt so garantiert außen vor. Der Build bricht ab, wenn eine
`.db`-, `.mjs`- oder `.md`-Datei in `dist/` landet oder eine Datei die 25-MiB-Grenze
von Cloudflare Pages überschreitet.

## Deployment (Cloudflare Pages)

| Feld | Wert |
| --- | --- |
| Framework preset | None |
| Build command | `node scripts/build-spices.mjs && node scripts/build-dist.mjs` |
| Build output directory | `dist` |
| Node version | 22 oder höher |

Kein `_redirects` — es gibt drei echte HTML-Dateien und keinen Router.

## Struktur

```
index.html  store.html  shoppingcart.html   Die drei Seiten
style.css                                   Ein Stylesheet, Tokens siehe design.md
app.js                                      Helfer, Warenkorb, Produktkarte, Modal, Toast
motion.js                                   Scroll-Motion
index.js  store.js  shoppingcart.js         Je Seite
spices.json                                 Generiert, versioniert
Datenbanken.db                              Quelle, nicht im Repo, nicht ausgeliefert
scripts/                                    Build
```

Weitere Dokumentation: `design.md` (Designsystem, verbindlich), `CLAUDE.md`
(Projektkontext), `DEFINITION-OF-DONE.md` (Qualitätsschwelle).
