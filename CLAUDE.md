# CLAUDE.md — Gewürz-Shop (spice-shop-redesign)

## Was ist das
Demo-Onlineshop für Gewürze: Produktübersicht aus einer SQLite-Datenbank, Warenkorb, Registrierung/Login und ein einfacher Admin-Bereich zum Anlegen, Ändern und Löschen von Produkten. Ursprünglich ein Hochschulprojekt, wird jetzt aufgeräumt statt neu gebaut.

## Qualitätsstufe
Portfolio
Das Repo liegt öffentlich unter `github.com/LukasRandecker/spice-shop-redesign` — es wird gesehen, unabhängig davon, ob es vorgezeigt wird.

## Stack
- Framework: keins. Vanilla HTML/CSS/JS im Browser, Express 4 als Server (`server.mjs`, ESM)
- Sprache: JavaScript — siehe „Bewusste Entscheidungen"
- Styling: zwei handgeschriebene Stylesheets (`style.css`, `mobile.css`) — siehe Baustellen
- Datenbank: SQLite (`Datenbanken.db`) über `sqlite` + `sqlite3`
- Auth: aktuell keine funktionierende — siehe Baustellen
- Uploads: multer, Ziel `img/Produktfotos`
- Hosting: keins, läuft lokal auf Port 3000
- Node-Version: nicht festgelegt

## Befehle
```
node server.mjs    # Server auf http://localhost:3000
```
Es gibt **keine `package.json`** — kein `npm install`, kein Build, kein Lint, kein Test. Siehe Baustellen.

## Struktur
- Kein Build-Schritt: die `.html`-Dateien im Wurzelordner sind das Frontend, dazu je eine `.js` pro Seite (`index.js`, `store.js`, `shoppingcart.js`, `login.js`, `popup.js`).
- `server.mjs` macht alles: statische Auslieferung, DB-Zugriff, Uploads, Formularverarbeitung. Es gibt keine Routen-Dateien.
- **Alle** Formulare posten auf `*`; unterschieden wird über ein verstecktes Feld `formType` (`formLogin`, `formReg`, `hostadd`, `hostedit`, `hostdel`). Wer den Server ändert, muss dort ansetzen.
- `spices.json` wird beim Serverstart und nach jeder Produktänderung aus der DB neu geschrieben. Das Frontend liest diese Datei, nicht die DB.
- `app.use(express.static(... 'GIS_Projekt'))` zeigt auf einen Ordner, den es nicht mehr gibt — die Auslieferung läuft faktisch komplett über den Catch-all-Handler am Dateiende.

## Projektregeln
- **Kein Passwort unverschlüsselt.** Passwörter werden nur gehasht gespeichert, nie geloggt, nie in ein Cookie geschrieben, nie in `spices.json` oder eine andere ausgelieferte Datei. Gilt auch für Testdaten.
- **Jeder schreibende Endpunkt prüft die Berechtigung serverseitig.** `hostadd`/`hostedit`/`hostdel` verlangen einen vom Server geprüften Admin-Nachweis — nicht ein Cookie, dem der Server einfach glaubt.
- **Der Server liefert nur aus einem definierten öffentlichen Ordner aus.** Nicht `'.' + req.url` gegen das Dateisystem. Keine Auslieferung von `.db`-Dateien, unter keinen Umständen.
- **Ein Stylesheet.** Neues CSS kommt in `style.css` mit Breakpoints innerhalb der Datei. `mobile.css` wird nicht mehr erweitert, nur noch abgebaut.

## Bewusste Entscheidungen
- **Vanilla JS ohne Framework und ohne Build.** War Vorgabe des Hochschulprojekts und bleibt so: Das Projekt wird aufgeräumt, nicht auf React portiert. Nicht ungefragt „modernisieren".
- **SQLite als Datenbank.** Eine Datei, kein Datenbankserver, kein Free-Tier-Limit — für einen Demo-Shop ausreichend.
- **`spices.json` ist ein generierter Cache**, keine Redundanz und keine Quelle. Der Server schreibt sie; von Hand bearbeiten ist sinnlos, der nächste Start überschreibt es.
- **JavaScript statt TypeScript.** Entscheidung für dieses Projekt, nicht für neue: **jedes neue Projekt startet weiter in TypeScript ab der ersten Datei.**

## Bekannte Baustellen

**Sicherheit — hat Vorrang vor allem anderen:**
- [ ] **Passwörter liegen im Klartext in der DB.** `newUser()` speichert `password` roh, `checkUser()` vergleicht per `WHERE email = ? AND password = ?`. Braucht bcrypt-Hashing und einen Vergleich gegen den Hash
- [ ] **Admin-Funktionen sind ungeschützt.** `app.post('*')` führt `hostadd`/`hostedit`/`hostdel` ohne jede Berechtigungsprüfung aus — jeder kann Produkte anlegen, ändern, löschen
- [ ] **Der Login ist keiner.** `res.cookie("user", person)` legt die Kundendaten in ein ungesichertes, clientseitig beschreibbares Cookie. Braucht eine serverseitige Session oder ein signiertes Token
- [ ] **Die Datenbank ist über HTTP abrufbar.** Der Catch-all-Handler liest `'.' + req.url` direkt vom Dateisystem und `.db` steht in der Content-Type-Tabelle: `GET /Datenbanken.db` liefert die Kundentabelle inklusive Klartext-Passwörter, `../` erlaubt zusätzlich das Ausbrechen aus dem Ordner. Dieselbe Datei darf aus demselben Grund auch nicht ins öffentliche Repo

**Alles andere:**
- [ ] `package.json` anlegen — Abhängigkeiten (express, sqlite3, sqlite, multer, cookie-parser, body-parser) sind nirgends deklariert, das Projekt ist so bei niemandem installierbar. Dazu ein `start`-Skript für `server.mjs`
- [ ] `mobile.css` (501 Zeilen) und `style.css` (540 Zeilen) zu einem Stylesheet zusammenführen: ein Layout, Breakpoints innerhalb der Datei, Typografie über `clamp()`
- [ ] README anlegen mit Warnhinweis: Demo-Stand, keine echten Kundendaten, nicht produktionsreif
- [ ] `.claude/worktrees/nur-ein-test-4db807/` aufräumen — übrig gebliebene Kopie samt zweiter `Datenbanken.db`
- [ ] Vollständige DoD-Prüfung steht noch aus

## Nicht anfassen
- `Datenbanken.db` — enthält Kundendatensätze. Wird nicht ausgelesen, nicht ausgegeben, nicht verändert. Schemaänderungen nur nach Rücksprache.

## Zuletzt geprüft
- Lighthouse Mobile: nicht geprüft
- Tastaturbedienung: nicht geprüft
- Responsive 320–2560: nicht geprüft
