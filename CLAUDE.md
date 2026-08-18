# CLAUDE.md — Gewürz-Shop (spice-shop-redesign)

## Was ist das
Demo-Onlineshop für Gewürze: anonymer Produktkatalog aus einer SQLite-Datenbank mit Warenkorb. Ursprünglich ein Hochschulprojekt, wird jetzt aufgeräumt statt neu gebaut. Registrierung/Login und der Admin-Bereich wurden am 2026-08-18 vollständig entfernt (siehe „Bewusste Entscheidungen"); Produktpflege läuft seither direkt in der Datenbank.

## Qualitätsstufe
Portfolio
Das Repo liegt öffentlich unter `github.com/LukasRandecker/spice-shop-redesign` — es wird gesehen, unabhängig davon, ob es vorgezeigt wird.

## Stack
- Framework: keins. Vanilla HTML/CSS/JS im Browser, Express 4 als Server (`server.mjs`, ESM)
- Sprache: JavaScript — siehe „Bewusste Entscheidungen"
- Styling: ein handgeschriebenes Stylesheet (`style.css`), Tokens und Breakpoints darin — Regelwerk in `design.md`
- Datenbank: SQLite (`Datenbanken.db`, nur noch Tabelle `spices`) über `sqlite` + `sqlite3`
- Auth: keine — Login/Registrierung/Admin wurden entfernt, siehe „Bewusste Entscheidungen"
- Hosting: keins, läuft lokal auf Port 3000
- Node-Version: nicht festgelegt

## Befehle
```
node server.mjs    # Server auf http://localhost:3000
```
Es gibt **keine `package.json`** — kein `npm install`, kein Build, kein Lint, kein Test. Siehe Baustellen.

## Struktur
- Kein Build-Schritt: die `.html`-Dateien im Wurzelordner sind das Frontend. Das JS ist zweigeteilt:
  - **gemeinsam auf jeder Seite:** `app.js` (Helfer, Warenkorb-Store, Produktkarte, Toast, Modal-System, Navigation), `motion.js` (Scroll-Motion)
  - **pro Seite:** `index.js`, `store.js`, `shoppingcart.js`
- Alles, was aus der DB kommt, läuft vor `innerHTML` durch `esc()` in `app.js`.
- `server.mjs` liefert nur noch statisch aus und schreibt `spices.json` aus der DB. Es gibt keine schreibenden Endpunkte und keine Routen-Dateien mehr.
- `spices.json` wird beim Serverstart aus der DB neu geschrieben. Das Frontend liest diese Datei, nicht die DB.

## Projektregeln
- **Der Server liefert nur aus einem definierten öffentlichen Ordner aus.** Nicht `'.' + req.url` gegen das Dateisystem. Keine Auslieferung von `.db`-Dateien, unter keinen Umständen. **Noch nicht umgesetzt** — siehe Baustellen, Sicherheit.
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

## Bekannte Baustellen

**Sicherheit — hat Vorrang vor allem anderen:**
- [x] ~~Passwörter liegen im Klartext in der DB~~ — gegenstandslos: Login/Registrierung und die Tabelle `customers` wurden am 2026-08-18 komplett entfernt
- [x] ~~Admin-Funktionen sind ungeschützt~~ — gegenstandslos: der gesamte Admin-Bereich wurde am 2026-08-18 entfernt
- [x] ~~Der Login ist keiner~~ — gegenstandslos: Login wurde am 2026-08-18 entfernt
- [ ] **Die Datenbank ist über HTTP abrufbar.** Der Catch-all-Handler liest `'.' + req.url` direkt vom Dateisystem, `../` erlaubt das Ausbrechen aus dem Ordner. `GET /Datenbanken.db` liefert nach wie vor die rohe DB-Datei aus (seit 2026-08-18 nur noch die Tabelle `spices`, keine Kundendaten mehr — die Lücke selbst ist damit aber nicht behoben). Braucht einen definierten öffentlichen Ordner statt direktem Dateisystemzugriff

**Alles andere:**
- [ ] `package.json` anlegen — Abhängigkeiten (express, sqlite3, sqlite) sind nirgends deklariert, das Projekt ist so bei niemandem installierbar. Dazu ein `start`-Skript für `server.mjs`
- [x] ~~`mobile.css` und `style.css` zu einem Stylesheet zusammenführen~~ — erledigt mit dem Redesign: `style.css` ist neu gebaut, `mobile.css` gelöscht, Typografie durchgehend `clamp()`
- [ ] Der Catch-all-Handler hängt den Query-String an den Dateipfad: `GET /style.css?v=1` liefert 404. Cache-Busting und jeder Link mit Parameter sind damit unmöglich
- [x] ~~Herkunftsdaten bereinigen: „Mexiko"/„Mexico" nebeneinander~~ — bei der Preis-/Namensmigration am 2026-08-17 mitkorrigiert (Ancho-Chiliflocken trägt jetzt „Mexiko")
- [ ] README anlegen mit Warnhinweis: Demo-Stand, keine echten Kundendaten, nicht produktionsreif
- [ ] `.claude/worktrees/nur-ein-test-4db807/` aufräumen — übrig gebliebene Kopie samt zweiter `Datenbanken.db`
- [ ] Vollständige DoD-Prüfung steht noch aus

## Nicht anfassen
- `Datenbanken.db` — Schemaänderungen nur nach Rücksprache. (Die Tabelle `customers` wurde am 2026-08-18 nach expliziter Rücksprache entfernt; verbleibend: `spices`.)

## Zuletzt geprüft
- Lighthouse Mobile: nicht geprüft
- Tastaturbedienung: nicht geprüft
- Responsive: 320 bis 2560 px geprüft (2026-08-17), inkl. Grenzwerte 711/712 und 1439/1540 px der Produktraster. Kein horizontaler Überlauf, keine umbrechende Preiszeile — auch nicht im teuersten Fall (1000 g Kardamom = 180,00 €)
- Motion (Reveals, Sticky-Szene, Zähler): im Browser-Pane nicht prüfbar, da dort `requestAnimationFrame` und `IntersectionObserver` pausieren. Endzustände geprüft, Ablauf nicht
