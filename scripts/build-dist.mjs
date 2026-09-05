/* build-dist.mjs — kopiert die auszuliefernden Dateien nach dist/.

   Whitelist, keine Blacklist: Was hier nicht steht, wird nicht veröffentlicht.
   Vergessenes fehlt dann auf der Seite — das ist die sichere Richtung. So
   landen Datenbanken.db, CLAUDE.md, design.md und die Skripte selbst nie im
   öffentlichen Ordner.

   Danach drei Kontrollen, die den Build scheitern lassen statt still etwas
   Falsches auszuliefern:
     - keine .db/.mjs/.md-Datei in dist/
     - keine Datei über 25 MiB (Grenze von Cloudflare Pages)
     - jeder Whitelist-Eintrag ist tatsächlich vorhanden */

import { cpSync, rmSync, mkdirSync, existsSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative, extname, sep } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');

const WHITELIST = [
  'index.html',
  'store.html',
  'shoppingcart.html',
  'style.css',
  'app.js',
  'motion.js',
  'index.js',
  'store.js',
  'shoppingcart.js',
  'spices.json',
  'img',
];

const VERBOTEN = new Set(['.db', '.mjs', '.md']);
const MAX_BYTES = 25 * 1024 * 1024;

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });

const fehlend = WHITELIST.filter((name) => !existsSync(join(root, name)));
if (fehlend.length) {
  console.error(`Fehlt im Projekt, kann nicht kopiert werden: ${fehlend.join(', ')}`);
  process.exit(1);
}

for (const name of WHITELIST) {
  cpSync(join(root, name), join(dist, name), { recursive: true });
}

/* Alle kopierten Dateien einsammeln, um sie zu prüfen und aufzulisten. */
function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = join(dir, e.name);
    return e.isDirectory() ? walk(p) : [p];
  });
}

const dateien = walk(dist);
const probleme = [];

for (const p of dateien) {
  const rel = relative(dist, p).split(sep).join('/');
  const size = statSync(p).size;

  if (VERBOTEN.has(extname(p).toLowerCase()))
    probleme.push(`${rel} — Dateityp gehört nicht in den öffentlichen Ordner`);
  if (size > MAX_BYTES)
    probleme.push(`${rel} — ${(size / 1024 / 1024).toFixed(1)} MB, über dem 25-MiB-Limit von Cloudflare`);
}

const gesamt = dateien.reduce((n, p) => n + statSync(p).size, 0);
const groesste = dateien
  .map((p) => ({ rel: relative(dist, p).split(sep).join('/'), size: statSync(p).size }))
  .sort((a, b) => b.size - a.size)
  .slice(0, 5);

console.log(`dist/: ${dateien.length} Dateien, ${(gesamt / 1024 / 1024).toFixed(1)} MB gesamt.`);
console.log('Größte Dateien:');
for (const f of groesste) console.log(`  ${(f.size / 1024 / 1024).toFixed(2).padStart(6)} MB  ${f.rel}`);

if (probleme.length) {
  console.error('\nBuild abgebrochen:');
  for (const p of probleme) console.error(`  ${p}`);
  process.exit(1);
}
console.log('Prüfung bestanden: keine .db/.mjs/.md, keine Datei über 25 MiB.');
