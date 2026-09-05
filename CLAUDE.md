# CLAUDE.md — Gewürz-Shop (spice-shop-redesign)

## Was ist das
Demo-Onlineshop für Gewürze: anonymer Produktkatalog aus einer SQLite-Datenbank mit Warenkorb. Ursprünglich ein Hochschulprojekt, wird jetzt aufgeräumt statt neu gebaut. Registrierung/Login und der Admin-Bereich wurden am 2026-08-18 vollständig entfernt (siehe „Bewusste Entscheidungen"); Produktpflege läuft seither direkt in der Datenbank.

## Qualitätsstufe
Portfolio
Das Repo liegt öffentlich unter `github.com/LukasRandecker/spice-shop-redesign` — es wird gesehen, unabhängig davon, ob es vorgezeigt wird.

## Stack
- Framework: keins. Vanilla HTML/CSS/JS im Browser. **Kein Server zur Laufzeit** — die Seite ist seit 2026-09-05 rein statisch, siehe „Bewusste Entscheidungen"
- Sprache: JavaScript — siehe „Bewusste Entscheidungen"
- Styling: ein handgeschriebenes Stylesheet (`style.css`), Tokens und Breakpoints darin — Regelwerk in `design.md`
- Datenbank: SQLite (`Datenbanken.db`, nur noch Tabelle `spices`), gelesen über `node:sqlite` — nur zur Bauzeit, nie zur Laufzeit
- Auth: keine — Login/Registrierung/Admin wurden entfernt, siehe „Bewusste Entscheidungen"
- Hosting: Cloudflare Pages, `gewuerze.lukasrandecker.de` (Build-Output `dist/`)
- Node-Version: ab 22.5 (`node:sqlite` ist erst dort eingebaut), in `package.json` als `engines` festgehalten

## Befehle
```
npm run build      # spices.json aus der DB + dist/ zusammenstellen
npm run preview    # dist/ auf http://localhost:3000 ausliefern
```
**Kein `npm install` nötig** — das Projekt hat keine Abhängigkeiten. Kein Lint, kein Test. Siehe Baustellen.

## Struktur
- Kein Build-Schritt im Frontend: die `.html`-Dateien im Wurzelordner sind das Frontend, sie werden unverändert ausgeliefert. Das JS ist zweigeteilt:
  - **gemeinsam auf jeder Seite:** `app.js` (Helfer, Warenkorb-Store, Produktkarte, Toast, Modal-System, Navigation), `motion.js` (Scroll-Motion)
  - **pro Seite:** `index.js`, `store.js`, `shoppingcart.js`
- Alles, was aus der DB kommt, läuft vor `innerHTML` durch `esc()` in `app.js`.
- `server.mjs` ist am 2026-09-05 gelöscht worden. An seine Stelle treten zwei Build-Skripte:
  - `scripts/build-spices.mjs` schreibt `spices.json` aus der DB
  - `scripts/build-dist.mjs` kopiert die auszuliefernden Dateien nach `dist/` — **Whitelist**, und bricht ab, wenn eine `.db`/`.mjs`/`.md` oder eine Datei über 25 MiB darin landet
- `spices.json` wird zur Bauzeit erzeugt und **eingecheckt**. Das Frontend liest diese Datei, nie die DB.
- `Datenbanken.db` steht in `.gitignore` und liegt nicht im Repo. Deshalb hat `build-spices.mjs` zwei Betriebsarten: DB vorhanden → neu erzeugen; DB fehlt (Cloudflare) → die eingecheckte `spices.json` prüfen und übernehmen.

## Projektregeln
- **Veröffentlicht wird ausschließlich `dist/`, nie das Wurzelverzeichnis.** Was nicht in der Whitelist von `scripts/build-dist.mjs` steht, geht nicht ins Netz. Keine Auslieferung von `.db`-Dateien, unter keinen Umständen. **Umgesetzt am 2026-09-05** — der Catch-all-Handler existiert nicht mehr.
- **Ein Stylesheet.** Alles CSS liegt in `style.css`, Breakpoints innerhalb der Datei. `mobile.css` ist entfernt und kommt nicht zurück.
- **`design.md` ist verbindlich.** Farben, Schriftgrößen, Abstände und Kurven kommen aus den dort definierten Tokens. Keine Hex-Werte und keine px-Schriftgrößen direkt im Regelwerk.

## Bewusste Entscheidungen
- **Vanilla JS ohne Framework und ohne Build.** War Vorgabe des Hochschulprojekts und bleibt so: Das Projekt wird aufgeräumt, nicht auf React portiert. Nicht ungefragt „modernisieren".
- **SQLite als Datenbank.** Eine Datei, kein Datenbankserver, kein Free-Tier-Limit — für einen Demo-Shop ausreichend.
- **Verkauft wird nach Gramm, nicht nach Stück.** Auf der Karte wird eine Grammzahl gewählt (10-g-Schritte, Vorgabe 100 g, Obergrenze 1000 g pro Position), der Preis errechnet sich aus `price_per_100g`. Der 100-g-Preis bleibt immer sichtbar, weil er die Vergleichsgröße zwischen den Sorten ist.
- **Preise sind Premium-Preise, keine Grundnahrungsmittel-Preise.** Am 2026-08-17 nach Rücksprache auf realistische Fachhändlerniveaus umgestellt (2,60 € bis 18,00 € pro 100 g, gestaffelt nach Anbau-/Ernteaufwand). Siehe `design.md`, Abschnitt 1. Neue Sorten (direkt in der DB angelegt) sollten sich in diese Spanne einordnen, nicht darunter.
- **Das Produktraster (`.grid-products`) berechnet seine Spaltenzahl aus der Kartenbreite** (`auto-fit, minmax(312px, 1fr)`), nicht aus festen `@media`-Sprüngen. 312 px ist die Mindestbreite, bei der Gramm-Wähler + höchstmöglicher Zeilenpreis (180,00 €, Kardamom bei 1000 g) garantiert nebeneinander passen. Siehe `design.md`, Abschnitt „Produktraster". Wer neue harte Spalten-Breakpoints einführt, reißt diese Garantie wieder auf.
- **Namen tragen nur eine Herkunfts-/Sortenbezeichnung, wenn es sie wirklich gibt.** Am 2026-08-17 wurden 11 der 17 Sorten auf anerkannte Fachbegriffe umbenannt (Himalaya-Salz, Kampot-Pfeffer, Ceylon-Zimt, Sansibar-Nelken, Banda-Muskatnuss, Alleppey-Kurkuma, Ancho-Chiliflocken, Chipotle-Morita, Pimenton-de-la-Vera, Madras-Currypulver, Provence-Thymian). Die restlichen 6 (Kreuzkümmel, Lorbeerblatt, Petersilie, Senfpulver, Knoblauchpulver, Kardamom) haben keine vergleichbare Bezeichnung am Markt und blieben bewusst unangetastet — ein erfundenes Prädikat wäre unglaubwürdig. Jede Umbenennung zieht auch die zugehörige Bilddatei in `img/Produktfotos/` mit (Dateiname = exakter Produktname).
- **Keine Bewertungen.** `rating` und `num_ratings` wurden am 2026-08-17 nach Rücksprache aus der Tabelle `spices` entfernt (Sicherung: außerhalb des Repos). Erfundene Bewertungen in einem Demo-Shop sind Behauptungen ohne Deckung. Nicht wieder einführen.
- **`spices.json` ist ein generierter Cache**, keine Redundanz und keine Quelle. Der Server schreibt sie; von Hand bearbeiten ist sinnlos, der nächste Start überschreibt es.
- **JavaScript statt TypeScript.** Entscheidung für dieses Projekt, nicht für neue: **jedes neue Projekt startet weiter in TypeScript ab der ersten Datei.**
- **Login, Registrierung und Admin-Bereich sind am 2026-08-18 komplett entfernt worden**, nach Rücksprache. Auth war laut Baustellen ohnehin nie sicher (Klartext-Passwörter, ungeschützte Admin-Endpunkte, Cookie ohne Session), und für einen Portfolio-Demo-Shop trägt eine kaputte Login-Attrappe nichts bei. Entfernt wurden: `login.js`, `popup.js` (Login-/Register-/Admin-Modals; `modalShell()` lebt jetzt in `app.js`, gebraucht für die Bestellbestätigung), die Login-/Logout-Buttons in der Navigation, das Gear-Icon auf der Produktkarte, sowie in `server.mjs` die Endpunkte `formLogin`/`formReg`/`hostadd`/`hostedit`/`hostdel` samt `multer`, `cookie-parser` und `body-parser`. Die Tabelle `customers` wurde aus `Datenbanken.db` gelöscht (enthielt nur Klartext-Passwörter, war nach der Entfernung ungenutzt). Der Warenkorb-Checkout zeigt seither nur noch eine Bestätigung ohne Namen/Adresse, weil diese Daten nicht mehr erhoben werden. Produktpflege (anlegen/ändern/löschen) läuft seither ausschließlich direkt in `Datenbanken.db`, nicht mehr über die Oberfläche.
- **Rein statisch, kein Server zur Laufzeit (2026-09-05).** Das Frontend las ohnehin nur `spices.json`; der Express-Prozess schrieb diese Datei beim Start und lieferte ansonsten Dateien aus. Damit war er entbehrlich. `server.mjs` ist gelöscht, der DB-Teil lebt in `scripts/build-spices.mjs` weiter. **Das schließt zugleich die Sicherheitslücke:** ohne Catch-all-Handler gibt es kein `'.' + req.url`, kein Ausbrechen über `../` und kein abrufbares `Datenbanken.db`. Produktpflege bleibt: DB ändern, `npm run build`, neue `spices.json` mit einchecken.
- **Das Hintergrundvideo liegt als `.mp4` vor, nicht mehr als `.mov` (2026-09-05).** Die Quelle war 27,2 MB — über dem 25-MiB-Limit von Cloudflare Pages, und `video/quicktime` meldet Chrome als nicht abspielbar (im Browser geprüft). Neu kodiert mit H.264/CRF 24 und `+faststart`: 3,5 MB. Die Tonspur ist entfallen, weil das Element `muted` ist und dekorativ läuft — hörbar war sie nie.

## Bekannte Baustellen

**Sicherheit — hat Vorrang vor allem anderen:**
- [x] ~~Passwörter liegen im Klartext in der DB~~ — gegenstandslos: Login/Registrierung und die Tabelle `customers` wurden am 2026-08-18 komplett entfernt
- [x] ~~Admin-Funktionen sind ungeschützt~~ — gegenstandslos: der gesamte Admin-Bereich wurde am 2026-08-18 entfernt
- [x] ~~Der Login ist keiner~~ — gegenstandslos: Login wurde am 2026-08-18 entfernt
- [x] ~~**Die Datenbank ist über HTTP abrufbar.**~~ — behoben am 2026-09-05 durch den Umbau auf statisch. `server.mjs` samt Catch-all-Handler ist gelöscht, es gibt keinen `'.' + req.url`-Pfad mehr. `Datenbanken.db` steht nicht in der Whitelist von `scripts/build-dist.mjs` und liegt damit nicht im veröffentlichten Ordner. Gegen die lokale Vorschau geprüft: `/Datenbanken.db` → 404, `/../Datenbanken.db` → 404, `/..%2fDatenbanken.db` → 400
- [x] ~~Eine **zweite `Datenbanken.db` mit Klartext-Passwörtern** lag im Branch `claude/nur-ein-test-4db807`~~ — am 2026-09-05 entfernt. Die Datei war dort *versioniert* (nicht nur ignoriert) und enthielt eine Tabelle `customers` mit 2 Datensätzen samt Anschrift, E-Mail und Passwort im Klartext. Der Branch war nie gepusht (auf dem Remote lag nur `main`), also nichts öffentlich geworden. Worktree und Branch sind gelöscht

**Alles andere:**
- [x] ~~`package.json` anlegen~~ — erledigt am 2026-09-05, mit `build`- und `preview`-Skript. Es sind **keine** Abhängigkeiten nötig: Express ist entfallen, `sqlite`/`sqlite3` sind durch das eingebaute `node:sqlite` ersetzt
- [x] ~~`mobile.css` und `style.css` zu einem Stylesheet zusammenführen~~ — erledigt mit dem Redesign: `style.css` ist neu gebaut, `mobile.css` gelöscht, Typografie durchgehend `clamp()`
- [x] ~~Der Catch-all-Handler hängt den Query-String an den Dateipfad~~ — gegenstandslos seit dem Umbau auf statisch: der Handler existiert nicht mehr, Cloudflare ignoriert den Query-String beim Auflösen der Datei
- [x] ~~Herkunftsdaten bereinigen: „Mexiko"/„Mexico" nebeneinander~~ — bei der Preis-/Namensmigration am 2026-08-17 mitkorrigiert (Ancho-Chiliflocken trägt jetzt „Mexiko")
- [x] ~~README anlegen mit Warnhinweis~~ — erledigt am 2026-09-05: Demo-Stand, keine Kundendaten, kein Bezahlvorgang, dazu Build- und Deploy-Anleitung
- [x] ~~`.claude/worktrees/nur-ein-test-4db807/` aufräumen~~ — erledigt am 2026-09-05, Worktree und zugehöriger Branch entfernt (siehe Sicherheit)
- [ ] Die Produktfotos sind 17 PNGs à ~1,4 MB, zusammen 23 MB. Für die Auslieferung reicht das, für den Katalog ist es viel — als WebP mit passender Kantenlänge wäre es ein Bruchteil. Betrifft direkt den DoD-Punkt Performance
- [ ] Vollständige DoD-Prüfung steht noch aus

## Nicht anfassen
- `Datenbanken.db` — Schemaänderungen nur nach Rücksprache. (Die Tabelle `customers` wurde am 2026-08-18 nach expliziter Rücksprache entfernt; verbleibend: `spices`.)

## Zuletzt geprüft
- Statischer Umbau (2026-09-05): `npm run build` erzeugt `spices.json` mit 17 Sorten (deckungsgleich mit `SELECT COUNT(*)`) und ein `dist/` aus 30 Dateien, 28,2 MB. Gegen die Vorschau aus `dist/` geprüft: Startseite, Katalog (17 Sorten, 15 Kauf-Buttons — zwei Sorten sind `available = 0`), Warenkorb inkl. Summen (9,10 € + 4,90 € Versand = 14,00 €) und Bestellbestätigung. Keine Konsolenfehler, alle Anfragen 200/206
- Auslieferungsgrenzen (2026-09-05): keine Datei in `dist/` über 25 MiB, größte ist `img/Laender_video.mp4` mit 3,37 MB. Keine `.db`, keine `.mjs`, keine `.md` in `dist/`
- Video (2026-09-05): `Laender_video.mp4`, H.264/yuv420p, 1920×1080, 9,96 s, 3,5 MB, `moov` am Dateianfang. Im Browser dekodiert (`readyState` 4, kein Fehler). Derselbe Browser meldet `video/quicktime` als nicht abspielbar — die alte `.mov` wäre eine schwarze Fläche gewesen
- Lighthouse Mobile: nicht geprüft
- Tastaturbedienung: nicht geprüft
- Responsive: 320 bis 2560 px geprüft (2026-08-17), inkl. Grenzwerte 711/712 und 1439/1540 px der Produktraster. Kein horizontaler Überlauf, keine umbrechende Preiszeile — auch nicht im teuersten Fall (1000 g Kardamom = 180,00 €)
- Motion (Reveals, Sticky-Szene, Zähler): im Browser-Pane nicht prüfbar, da dort `requestAnimationFrame` und `IntersectionObserver` pausieren. Endzustände geprüft, Ablauf nicht
