# design.md — SPICES

Designsystem für den Gewürz-Shop. Kompletter Neubau, Stand 2026-08-17.
Nichts aus dem alten System (`mobile.css`, `style.css` alt, Kartenlayout, Sternchen-Grafiken, `header_img` als Kopfbild) wird übernommen.

Referenz für Haltung und Motion: [sofihealth.com](https://www.sofihealth.com/) — übernommen wird die
Haltung (selbstbewusst, minimal, sehr große Typo, Scroll-getriebene Reveals), **nicht** die Palette:
sofi ist hell, wir sind konsequent dark.

---

## 1. Haltung

**Wir verkaufen Qualität und verhalten uns auch so.**

Drei Regeln, aus denen sich alles andere ableitet:

1. **Ruhe schlägt Lautstärke.** Große Flächen Schwarz, viel Leere, wenige Elemente pro Bildschirm.
   Wer sicher ist, muss nicht schreien — er lässt Platz.
2. **Ein Element pro Blick.** Jede Sektion hat genau eine Aussage. Keine Sektion mit zwei gleich
   starken Botschaften.
3. **Das Produkt ist das Bild.** Kein Stock-Deko, keine Icons als Schmuck. Wenn ein Bild da ist,
   dann ist es das Gewürz.

**Das gilt auch für die Preise.** Ein Shop, der Premiumqualität behauptet, kann nicht zu
Grundnahrungsmittel-Preisen verkaufen — das widerspricht der eigenen Erzählung. Die Preise in
`Datenbanken.db` orientieren sich an echten Fachhändlern (Ankerkraut, Sonnentor & Co.) und spreizen
sich nach tatsächlichem Anbau-/Ernteaufwand: Grundgewürze wie Senfpulver oder Petersilie liegen bei
2–3 € pro 100 g, aufwendige Gewürze wie Sansibar-Nelken oder Banda-Muskatnuss bei 8–9 €, Kardamom
als eines der teuersten Gewürze der Welt bei 18 €. Eine flache Preisspanne über alle Sorten würde
den Qualitätsanspruch unglaubwürdig machen.

**Luxus ist eine Herkunft, kein Adjektiv.** Namen bekommen nur dann eine Herkunfts- oder
Sortenbezeichnung, wenn diese Bezeichnung in der echten Gewürzwelt existiert und etwas Konkretes
behauptet: Himalaya-Salz, Kampot-Pfeffer, Ceylon-Zimt, Sansibar-Nelken, Banda-Muskatnuss,
Alleppey-Kurkuma, Ancho-Chiliflocken, Chipotle-Morita, Pimenton-de-la-Vera, Madras-Currypulver und
Provence-Thymian sind anerkannte Fachbegriffe, keine erfundenen Etiketten — genau deshalb
rechtfertigen sie auch einen höheren Preis. Sechs Sorten (Kreuzkümmel, Lorbeerblatt, Petersilie,
Senfpulver, Knoblauchpulver, Kardamom) haben keine vergleichbare Bezeichnung am Markt und bleiben
bewusst beim schlichten Namen. „Luxus-Kreuzkümmel" wäre ein Etikett ohne Substanz — genau die Art
Marketingsprache, die die Haltung aus Regel 1 verbietet. Nicht jedes Produkt muss besonders klingen;
es muss besonders sein, wo es das tatsächlich ist.

Was daraus folgt, konkret:
- Keine Schlagschatten als Effekt, keine Farbverläufe als Dekoration, keine abgerundeten „freundlichen" Boxen.
- Kein `alert()`, kein Standard-Browser-Dialog. Feedback läuft über eigene, ruhige UI.
- Keine Emojis, keine Ausrufezeichen in der Copy.

---

## 2. Farbe

Dark Mode ist der einzige Modus. Kein Light-Theme, keine Umschaltung.

Die Basis ist nicht reines Schwarz, sondern ein minimal warmes Schwarz — reines `#000` wirkt auf
Displays hart und billig, ein Hauch Wärme wirkt wie Papier bei Nacht.

| Token | Wert | Einsatz |
|---|---|---|
| `--void` | `#080807` | Seitenhintergrund, Standard |
| `--ink` | `#0E0E0C` | Sektionen, die sich minimal abheben |
| `--surface` | `#141412` | Karten, Modals |
| `--surface-hi` | `#1C1B19` | Hover auf Karten, Inputs |
| `--line` | `rgba(240,235,226,.10)` | Hairlines, Rahmen |
| `--line-strong` | `rgba(240,235,226,.22)` | Rahmen bei Fokus/Hover |
| `--bone` | `#F2EDE4` | Primärtext, Weiß-Ersatz |
| `--bone-dim` | `#9C958A` | Fließtext, sekundär |
| `--bone-faint` | `#5F5A53` | Labels, Meta, deaktiviert |
| `--saffron` | `#E0B457` | **Der einzige Akzent.** |
| `--saffron-line` | `rgba(224,180,87,.30)` | Trennlinien, Rahmen oben an Karten |
| `--saffron-dim` | `rgba(224,180,87,.18)` | Akzentflächen |
| `--saffron-glow` | `rgba(224,180,87,.13)` | Streulicht hinter Sektionen |
| `--sage` | `#8FBF8A` | Status „lieferbar" |
| `--clay` | `#D2705C` | Status „nicht lieferbar", Löschen |

**Regel Akzent.** Safran trägt die Seite sichtbar mit, statt nur Zierde zu sein — reines Schwarz über
mehrere Bildschirme hinweg wirkt nicht edel, sondern unfertig. Er gehört auf:

- **alle strukturellen Trennlinien** — Sektionsköpfe, Kartenoberkanten, Kennzahlenraster, Footer
- **jedes Sektionslabel** (`01 —`, `02 —` …) und jede Prinzipiennummer
- **alle Zahlen, die eine Aussage tragen** — Kennzahlen, Preise, Zeilensummen
- **jedes vierte Wort im Laufband**, damit der Akzent quer über die volle Breite läuft
- **aktive und fokussierte Zustände** — Feldunterstriche, Rahmen des Gramm-Wählers, Scroll-Hinweis

Dazu zwei flächige Mittel, die den schwarzen Grund aufbrechen, ohne hart zu werden:

1. **Streulicht** (`.glow`): ein 720 px großer, mit `blur(120px)` weichgezeichneter Kreis in
   `--saffron-glow` hinter einer Sektion. Nie mehr als zwei pro Seite. Er muss bündig an der Kante
   sitzen, nicht darüber hinaus — sonst wächst die Scrollbreite des Dokuments.
2. **Die Abschlussfläche:** genau **eine** vollflächige Safranfläche pro Seite, ganz am Ende, mit
   `--void` als Textfarbe. Ein einzelner lauter Moment nach viel Ruhe. Zwei davon wären Dekoration.

Nie in Safran: der Seitenhintergrund, Fließtext, primäre Buttonflächen oberhalb des Abschlusses.

**Kein Weiß-auf-Weiß-Kompromiss:** `--bone` ist warm gebrochen (`#F2EDE4`), nie `#fff`. Kontrast
gegen `--void` liegt bei ~17:1, `--bone-dim` bei ~6.5:1, `--bone-faint` nur für Text ≥ 12px in
Versalien mit Sperrung (Labels), nie für Fließtext.

---

## 3. Typografie

**Eine Familie für alles.** Das ist der wichtigste Hebel für die Anmutung: sofi fährt die gesamte
Seite mit einem einzigen Schnitt. Wir machen es genauso.

```
--font: "Inter Tight", "Helvetica Neue", Helvetica, Arial, sans-serif;
```

`Inter Tight` als freier Ersatz für Helvetica Now Display (sofis Schrift, lizenzpflichtig).
Fallback ist bewusst Helvetica/Arial und nicht `system-ui` — Segoe UI hat eine andere Anmutung und
würde die Seite bei fehlendem Webfont sichtbar verändern.

### Skala

Alles fluid über `clamp()`, Breakpoints greifen nur ins Layout ein, nie in die Typo.

| Token | clamp | LH | Tracking | Einsatz |
|---|---|---|---|---|
| `--t-mega` | `clamp(3rem, 12vw, 10.5rem)` | `.92` | `-.04em` | Hero, ein bis zwei Wörter |
| `--t-display` | `clamp(2.25rem, 7vw, 6rem)` | `.95` | `-.035em` | Sektionsköpfe |
| `--t-headline` | `clamp(1.625rem, 4vw, 3.25rem)` | `1.05` | `-.028em` | Manifest, Fließtext-Statements |
| `--t-title` | `clamp(1.4rem, 2.4vw, 2.2rem)` | `1.05` | `-.02em` | Produktname, Kartentitel |
| `--t-body-l` | `clamp(1.05rem, 1.5vw, 1.375rem)` | `1.45` | `-.011em` | Subline, Einleitungen |
| `--t-body` | `clamp(.95rem, 1.1vw, 1.0625rem)` | `1.6` | `-.006em` | Fließtext |
| `--t-label` | `.6875rem` | `1` | `.16em` | Versal-Labels, Meta, Nav |

**Die Skala liegt bewusst unter der Referenz.** sofi fährt englische Kleinbuchstaben mit
`line-height: .91`. Deutsche Schlagzeilen sind großgeschrieben, deutlich länger („Geschmack",
„Herkunftsländer") und tragen Umlautpunkte über der Versalhöhe. Übernimmt man die Werte eins zu eins,
brechen Zeilen an unsinnigen Stellen und Glyphen laufen aus ihrer Zeile. Daher: kleinere Maxima,
Zeilenhöhen ab `.92` statt `.84`, dazu `text-wrap: balance`, `overflow-wrap: break-word` und
`hyphens: auto` auf allen drei Display-Klassen.

**Gewicht:** genau zwei — `500` für alles Große und die Navigation, `400` für Fließtext. Kein `700`,
kein `900`. Fett wird über Größe erzeugt, nicht über Strichstärke. Das ist der Unterschied zwischen
teuer und laut.

**Tracking-Regel:** Je größer, desto enger. Displaygrößen laufen auf `-.04em` bis `-.045em`;
Versal-Labels laufen als Einzige positiv auf `.16em`.

### Schreibweise

- **Durchgehend korrekte deutsche Rechtschreibung — auch in Überschriften.** „Mehr Geschmack", nicht
  „mehr geschmack". Die Referenz schreibt alles klein; das funktioniert im Englischen, wo
  Kleinschreibung nur eine Stilentscheidung ist. Im Deutschen ist sie ein Fehler, und ein Shop, der
  Qualität behauptet, macht keine Rechtschreibfehler als Designgeste. Die Wirkung kommt aus Größe,
  Tracking und Weißraum — die trägt auch ohne diesen Trick.
- **Kein `text-transform` auf Überschriften.** Weder `lowercase` noch `uppercase`.
- **Labels** sind die einzige Ausnahme: Versalien mit `.16em` Sperrung, gesetzt über
  `text-transform: uppercase` — `HERKUNFT`, `LIEFERBAR`, `01 — AUSWAHL`.

### Sektionsnummern

Jede Sektion auf der Startseite trägt ein Label `01 —`, `02 —` … in `--t-label`, Safran.
Gibt der Seite Ordnung und Selbstverständlichkeit ohne ein einziges zusätzliches Grafikelement.

---

## 4. Raum

Basis 4px. Genutzt werden nur diese Stufen:

```
--s-1: 4px    --s-2: 8px    --s-3: 12px   --s-4: 16px
--s-5: 24px   --s-6: 32px   --s-7: 48px   --s-8: 64px
--s-9: 96px   --s-10: 144px --s-11: 200px
```

- **Sektionsabstand:** `clamp(96px, 14vh, 200px)` vertikal. Großzügig — der Weißraum (Schwarzraum)
  ist das Qualitätssignal.
- **Seitenrand:** `--gutter: clamp(20px, 5vw, 80px)`.
- **Maximalbreite Inhalt:** `1680px`. Fließtext nie breiter als `62ch`.
- **Raster:** 12 Spalten, `gap: clamp(16px, 2vw, 32px)`. Produkte: 4 Spalten ab 1100px,
  3 ab 900px, 2 ab 560px, 1 darunter.

**Radien:** nur zwei. `0` für Flächen, Karten und Bilder. `999px` für Pills (Buttons, Badges,
Zähler). Dazwischen gibt es nichts — kein `8px`, kein `12px`. Die harte Kante ist Teil der Haltung.

---

## 5. Bildbehandlung

Die Produktfotos sind quadratisch, Gewürzhaufen auf hellem Marmor. Auf schwarzem Grund wären das
grelle weiße Kacheln — das killt die Ruhe.

**Lösung: die Probenscheibe.** Jedes Produktfoto wird kreisrund beschnitten und leicht
hochskaliert (`scale(1.12)`), sodass der Marmorrand verschwindet und der Gewürzhaufen die Scheibe
füllt. Ergebnis: ein heller Kreis auf Schwarz, der wie eine Porzellanschale im Labor wirkt —
absichtlich, kuratiert, hochwertig. Dazu ein `inset`-Ring in `--line` und `filter: contrast(1.04)
saturate(1.06)`.

Bei Hover: Scheibe `scale(1.05)`, `700ms`, plus ein weicher Safran-Glow dahinter. Der einzige Ort,
an dem ein Glow erlaubt ist.

**Vollflächige Medien** (Marktbild, Länder-Video) laufen unter einem Overlay aus
`--void` mit `.55` bis `.78` Deckkraft plus Vignette, damit Text darauf immer die vollen
Kontrastwerte hält. Bilder tragen nie Text ohne Overlay.

---

## 6. Motion

Das ist der Teil, der von sofi kommt. Vier Muster, alle in Vanilla-JS mit `IntersectionObserver`
und `requestAnimationFrame` — keine Bibliothek, kein Build.

**Kurven:**
```
--ease-out:  cubic-bezier(.16, 1, .3, 1)     /* Standard, alles Eintretende */
--ease-io:   cubic-bezier(.65, 0, .35, 1)    /* Zustandswechsel */
--dur-fast:  240ms   --dur:  620ms   --dur-slow: 1100ms
```

### 6.1 Wort-Reveal (Kernmuster)

Große Statements werden per JS in Wörter zerlegt. Jedes Wort steckt in einem Container mit
`overflow: hidden`; das Wort selbst startet unterhalb und fährt beim Eintritt in den Viewport nach
oben in Position. Stagger **45 ms** pro Wort, Dauer `--dur-slow`, `--ease-out`.
Ein Zeilenumbruch bricht den Stagger nicht.

**Zwei Details, ohne die das Muster im Deutschen kaputtgeht:**

1. Die Maske bekommt `padding: .22em .04em .18em` und dasselbe als negatives `margin`. Ohne diesen
   Ausgleich schneidet `overflow: hidden` bei enger Zeilenhöhe die Umlautpunkte oben und die
   Unterlängen von g, j, p unten ab — die Schrift sieht beschnitten aus, nicht gesetzt.
2. Der Startwert ist deshalb `translateY(140%)`, nicht `105%`. Das Wort muss auch hinter dem neuen
   Padding verschwinden, sonst blitzt vor der Animation eine Kante auf.

Das ist der Effekt, der die Seite teuer aussehen lässt. Er läuft **einmal** — kein Zurücksetzen
beim Rausscrollen, keine Wiederholung.

### 6.2 Sektions-Reveal

Alles andere (Bilder, Karten, Absätze) fährt schlicht: `opacity 0 → 1`,
`translateY(28px) → 0`, `--dur`, `--ease-out`, Stagger 80 ms für Geschwister.

### 6.3 Scroll-Bindung

- **Parallax** ist auf `translate3d` mit maximal 14 % Versatz begrenzt und nur auf Vollbild-Medien.
  Alle Ebenen teilen sich einen einzigen `rAF`-Loop, damit nie zwei Scroll-Handler gegeneinander
  laufen.
- **Zähler:** Kennzahlen zählen beim Eintritt in 1200 ms hoch (`ease-out`, Dezimalstellen bleiben
  stabil, kein Springen der Breite → `tabular-nums`).
- **Laufband:** Die Gewürznamen laufen als Endlos-Marquee, 60 s pro Durchlauf, per CSS
  `@keyframes`, pausiert bei `:hover`.

### 6.4 Micro-Interaktionen

- **Pill-Button:** Beim Hover wächst ein Kreis aus der Mitte auf und füllt die Pille
  (`transform: scale()` auf einem `::before`, `--dur-fast`), der Text wechselt die Farbe.
  Kein Farbwechsel per `background-color`-Transition — die Füllbewegung ist der Punkt.
- **Textlink:** Unterstrich wächst von links (`scaleX`), `--dur-fast`.
- **Karte:** Rahmen von `--line` auf `--line-strong`, Hintergrund auf `--surface-hi`, `--dur-fast`.
- **Nav:** blendet beim Runterscrollen aus, beim Hochscrollen sofort wieder ein; Hintergrund
  wechselt nach 40px Scroll auf `backdrop-filter: blur(20px)` + Hairline unten.

### 6.5 Pflicht

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation: none !important; transition: none !important; }
}
```
Zusätzlich schaltet das JS bei `prefers-reduced-motion` alle Reveals sofort in den Endzustand —
Inhalt darf nie unsichtbar bleiben, weil Motion aus ist. Gleiches gilt bei deaktiviertem JS:
Startwerte für Reveals werden **per JS gesetzt**, nicht im CSS. Ohne JS ist die Seite vollständig
lesbar.

---

## 7. Komponenten

### Navigation
Fixed, Höhe 68px, transparent bis 40px Scroll, danach Blur + Hairline. Links das Wortzeichen
`SPICES` (`--t-label`, Sperrung `.28em`), rechts Shop / Warenkorb (mit Safran-Zähler-Badge bei
Inhalt). Unter 760px klappt rechts ein Vollbild-Overlay-Menü auf.

### Button
Nur zwei Varianten, beide Pill (`999px`), Höhe 52px, Padding `0 32px`, `--t-label`-Sperrung
auf `.08em`, Schriftgröße `.875rem`, Gewicht 500.
- **Primär:** Fläche `--bone`, Text `--void`. Hover: Fläche füllt sich auf `--saffron`.
- **Sekundär (Ghost):** transparent, `1px` Rahmen `--line-strong`, Text `--bone`.
  Hover: Fläche füllt sich auf `--bone`, Text `--void`.

Es gibt keinen dritten Button. Destruktive Aktionen sind sekundäre Buttons mit `--clay` als Text-
und Rahmenfarbe.

### Produktkarte
Kein Rahmen im Ruhezustand — nur eine Hairline oben in `--saffron-line`, bei Hover volles Safran.
Aufbau von oben nach unten:

1. Probenscheibe (quadratisches Feld, Scheibe zentriert)
2. Herkunft als Versal-Label
3. Name in `--t-title` — `min-height: 2.1em` reserviert immer zwei Zeilen, unabhängig davon, ob
   der Name tatsächlich umbricht. Sonst variiert die Kartenhöhe je nach Namenslänge
   („Madras-Currypulver" zweizeilig, „Kardamom" einzeilig) und die Zeilen darunter stehen bei
   jeder Karte auf einer anderen Höhe — genau die Unruhe, die eine Karte pro Blick verhindern soll.
4. Zeile aus **100-g-Preis** (links, `--bone-dim`) und Status-Punkt + Text (rechts)
5. Zeile aus **Gramm-Wähler** (links) und **berechnetem Preis** (rechts, `--t-title`, Safran) —
   `flex-wrap: nowrap`, darf nie umbrechen, siehe Gramm-Wähler unten
6. Button „In den Warenkorb" (Ghost, volle Breite)

**Keine Bewertungen.** Weder Sterne noch Zahl noch Anzahl — die Felder existieren auch in der
Datenbank nicht mehr. Erfundene Bewertungen in einem Demo-Shop sind Behauptungen ohne Deckung; ohne
sie ist die Karte ruhiger und ehrlicher.

**Der 100-g-Preis bleibt immer sichtbar**, unabhängig von der gewählten Menge. Er ist die
Vergleichsgröße zwischen den Sorten; der berechnete Preis ist nur das Ergebnis der eigenen Auswahl.

### Produktraster: Spaltenzahl aus der Kartenbreite, nicht aus festen Haltepunkten
`.grid-products` benutzt `grid-template-columns: repeat(auto-fit, minmax(312px, 1fr))` statt fester
Spaltenzahlen pro Breakpoint. **312 px ist kein Stilwert, sondern eine Rechnung:** Gramm-Wähler
(129 px) + Abstand (`--s-2`) + der teuerste mögliche Zeilenpreis („180,00 €" — 1000 g Kardamom zu
18 €/100g, der höchste Preis im Katalog) + Kartenpolster (`--s-5` × 2) — das ist die schmalste
Breite, bei der diese Zeile garantiert nicht umbricht, ohne die Schrift zu verkleinern.

Der alte Ansatz (feste `repeat(4, …)` mit `@media`-Sprüngen auf 3/2/1) ist daran zerbrochen, dass
„3 Spalten" bei mittleren Bildschirmbreiten (z. B. 768 px Tablet) Karten von nur ~215 px ergab — enger
als die 312 px, die die Kaufzeile braucht. Mit `auto-fit` kann das nicht mehr passieren: der Browser
berechnet bei jeder Breite selbst, wie viele Spalten mit mindestens 312 px hineinpassen, und fällt
sonst automatisch auf weniger Spalten zurück. Ändert sich künftig der Preis-Höchstwert oder die
Gramm-Wähler-Breite, muss der 312-px-Wert neu gerechnet werden — er ist kein Freihandwert.

**Ausnahme: `.grid-products--four`** (Startseite, „Vier zum Anfangen"). Bei genau vier kuratierten
Karten kann `auto-fit` bei bestimmten Breiten drei Spalten plus eine einzeln verwaiste vierte Karte
in der nächsten Zeile ergeben — für eine Auswahl von vier Produkten sieht das unfertig aus. Diese
Sektion bekommt deshalb feste 1/2/4 Spalten (`min-width: 712px` → 2, `min-width: 1540px` → 4),
beide Schwellen so gerechnet, dass die resultierende Kartenbreite die 312-px-Grenze nie unterschreitet.
Der Katalog (`store.html`, 17 Sorten) bleibt bei `auto-fit`, weil ein unrunder Zeilenrest bei einer
langen, ungeraden Liste normal ist und keine eigene Logik rechtfertigt.

### Gramm-Wähler
Eine Pille mit `−`, Zahleneingabe, Einheit `g` und `+`. Höhe 44 px, Rahmen `--line-strong`, bei
Fokus im Inneren Safran. Schrittweite 10 g, Minimum 10 g, Vorgabe 100 g, **Obergrenze 1000 g pro
Position** — darüber ist es kein Haushaltseinkauf mehr, sondern ein Fall für den direkten Kontakt.
Die Einheit `g` steht mit `--s-2` Abstand auf beiden Seiten frei, damit sie nicht an der Zahl klebt.
Die Stepper-Knöpfe sind 30 px breit (statt der zuerst gebauten 34 px) — knapp über der
Mindestgröße für Touch-Ziele, aber schmal genug, dass die Zeile bei 312 px Kartenbreite noch passt.
Die nativen Spinner des `number`-Feldes sind entfernt — sie passen nicht zur Pille und sind zu klein
zum Treffen.

Verhalten:
- **Während des Tippens** läuft der Preis mit, ohne zu runden oder zu deckeln. Rundet oder kappt
  man bei jedem Tastendruck, springt der Cursor bzw. verschwindet die gerade getippte Ziffer.
- **Beim Verlassen des Feldes** (`change`) wird auf die Schrittweite gerundet, auf das Minimum
  angehoben und auf 1000 g gedeckelt.
- Derselbe Wähler steht auf der Karte und im Warenkorb, damit Auswahl und Korrektur sich gleich
  anfühlen. Im Warenkorb schreibt er direkt in den Store.

### Modal
Vollflächiger Backdrop `rgba(8,8,7,.8)` + `blur(8px)`. Panel: `--surface`, `1px` Hairline,
Radius 0, max. 480px breit, fährt mit `translateY(24px) → 0` + Fade in `--dur` ein.
Schließen per ✕ oben rechts, Klick auf Backdrop und `Esc`. Fokus wird beim Öffnen ins Panel
gesetzt und beim Schließen zurückgegeben.

### Toast
Ersetzt jedes `alert()`. Unten mittig, `--surface`, Hairline, Pill, fährt von unten ein,
verschwindet nach 3 s. `role="status"`, `aria-live="polite"`.

---

## 8. Seitenaufbau

### `index.html`
```
00  Nav (fixed)
01  Hero        — „Mehr / Geschmack", Marktbild als abgedunkelter Grund, Pill-CTA, Scroll-Cue
02  Laufband    — alle Gewürznamen im Endlos-Marquee, jedes vierte Wort in Safran
03  Manifest    — ein Satz in --t-headline, Wort-Reveal, Streulicht. Die zentrale Aussage.
04  Herkunft    — Vollbild-Video, Overlay, „Aus aller Welt"
05  Zahlen      — 3 Kennzahlen in Safran, zentriert, Count-up, Hintergrund identisch zum Rest der Seite
06  Auswahl     — 4 Produkte aus spices.json, Streulicht rechts, Link in den Katalog
07  Prinzipien  — 3 Spalten mit Safran-Nummern: Sortenrein / Kleine Chargen / Ohne Zusätze
08  Abschluss   — vollflächig Safran, „Jetzt schmecken", ein Button
09  Footer
```

Zahlen in Sektion 05 werden zur Laufzeit aus `spices.json` überschrieben (Sortenzahl,
Herkunftsländer), damit die Startseite nichts behauptet, was der Katalog nicht hergibt. Die
statischen Werte im HTML sind der Zustand ohne JavaScript und müssen stimmen.

### `store.html`
Nav → Seitenkopf („der / katalog" + Anzahl als Meta) → Produktraster → Footer.
Kein Header-Bild. Der Katalog ist eine Liste, keine Bühne.

### `shoppingcart.html`
Nav → Kopf („Warenkorb") → Positionsliste (Scheibe, Name, Herkunft, 100-g-Preis, Gramm-Wähler,
Zeilensumme in Safran) → Sticky-Summenpanel rechts (ab 960px) mit Zwischensumme, Versand, Gesamt und
Bestell-Button → Footer. Leerer Zustand ist gestaltet, nicht leer: eine Zeile Text plus Ghost-Button
in den Katalog.

Unter 760px wird die Position von Raster auf Umbruch umgestellt: Scheibe und Text in Zeile eins,
Gramm-Wähler und Summe in Zeile zwei. In einer festen Rasterspalte würde der Wähler zusammengedrückt.

Jede Mengenänderung zeichnet die Liste neu. Damit dabei weder Tastatureingabe noch wiederholtes
Klicken auf `+` abreißt, merkt sich die Seite vor dem Neuzeichnen, welches Element den Fokus hatte,
und setzt ihn danach zurück.

---

## 9. Verbindliche Regeln

1. **Ein Stylesheet.** Alles in `style.css`, Breakpoints innerhalb der Datei. `mobile.css`
   existiert nicht mehr.
2. **Alle Farben, Größen und Kurven kommen aus Tokens.** Kein Hex-Wert direkt im Regelwerk,
   keine px-Schriftgröße außerhalb der Skala.
3. **Nur zwei Schriftgewichte, nur zwei Radien, nur ein Akzent.**
4. **Korrekte deutsche Rechtschreibung überall**, auch in Display-Größen. Kein `text-transform`
   auf Überschriften.
5. **Keine Bewertungen.** Weder Sterne noch Zahlen — die Felder gibt es weder in der UI noch im
   Schema.
6. **Keine Icon-Dekoration.** Icons nur, wo sie eine Funktion tragen (Warenkorb, Schließen,
   Gramm-Wähler) und dann als Inline-SVG mit `currentColor`.
7. **Keine `alert()`, keine `confirm()`.** Toast oder Modal.
8. **Motion-Startwerte werden per JS gesetzt.** Ohne JS ist alles sichtbar.
9. **Jedes interaktive Element ist per Tastatur erreichbar** und hat einen sichtbaren Fokusring
   (`outline: 2px solid var(--saffron); outline-offset: 3px`). Der Fokusring wird nie entfernt.
10. **Bewegung darf nie Layout verschieben.** Nur `transform` und `opacity` werden animiert.
11. **Kein Element ragt über die Dokumentbreite hinaus** — auch nicht dekoratives wie das
    Streulicht. `overflow-x: clip` auf `body` verbirgt so etwas zwar, aber `scrollWidth` wächst
    trotzdem und macht spätere Überlauf-Fehler unauffindbar.

---

## 10. Abgrenzung zur Referenz

Was wir **nicht** übernehmen: die helle Palette, die Produktfotografie-Sprache, die
Wellness-/Daten-Tonalität, Next.js. Der Shop bleibt Vanilla ohne Build — das Motion-System läuft
in rund 150 Zeilen `motion.js`.

Ebenfalls nicht übernommen: die durchgehende Kleinschreibung. Sie ist der einzige Teil der Referenz,
der sich nicht ins Deutsche übersetzen lässt (siehe Abschnitt 3), und die Skala musste dafür
nachgezogen werden.

Was wir eigenständig setzen: Dark als einzige Mode, Safran als tragender Akzent bis hin zur
Abschlussfläche, die Probenscheibe als Bildsprache — und der Verkauf nach frei wählbarer Grammzahl
statt nach Stückzahl, was den 100-g-Preis zur eigentlichen Vergleichsgröße macht.
