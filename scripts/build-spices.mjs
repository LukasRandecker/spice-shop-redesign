/* build-spices.mjs — erzeugt spices.json aus Datenbanken.db.
   Übernimmt den DB-Teil des früheren server.mjs. Der Express-Teil ist ersatzlos
   entfallen; das Frontend liest spices.json direkt, nie die Datenbank.

   Zwei Betriebsarten, weil Datenbanken.db per .gitignore nicht im Repo liegt:

   1. Datenbank vorhanden (lokal)  -> spices.json wird neu geschrieben.
   2. Datenbank fehlt (CI/Cloudflare) -> die eingecheckte spices.json wird
      geprüft und unverändert übernommen.

   Damit läuft derselbe Aufruf lokal wie im Build, ohne dass die Datenbank
   veröffentlicht werden muss. Wandert Datenbanken.db später doch ins Repo,
   erzeugt der Build die Datei automatisch wieder selbst.

   Liest über node:sqlite (in Node eingebaut, ab 22.5). Deshalb braucht das
   Projekt keine Abhängigkeiten und kein npm install. */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dbPath = join(root, 'Datenbanken.db');
const outPath = join(root, 'spices.json');

/* Das Frontend (app.js -> loadSpices) erwartet genau diese Form. */
function assertShape(data, quelle) {
  const amount = data?.arrayAmount?.[0]?.amount;
  const spices = data?.arraySpices;

  if (!Array.isArray(spices) || spices.length === 0)
    throw new Error(`${quelle}: arraySpices fehlt oder ist leer.`);
  if (amount !== spices.length)
    throw new Error(`${quelle}: arrayAmount (${amount}) und arraySpices (${spices.length}) widersprechen sich.`);

  return spices.length;
}

if (existsSync(dbPath)) {
  const { DatabaseSync } = await import('node:sqlite');
  const db = new DatabaseSync(dbPath, { readOnly: true });

  const data = {
    arrayAmount: db.prepare('SELECT COUNT(*) AS amount FROM spices').all(),
    arraySpices: db.prepare('SELECT * FROM spices').all(),
  };
  db.close();

  const n = assertShape(data, 'Datenbanken.db');
  writeFileSync(outPath, JSON.stringify(data, null, 2) + '\n', 'utf8');
  console.log(`spices.json aus Datenbanken.db erzeugt: ${n} Sorten.`);
} else if (existsSync(outPath)) {
  const n = assertShape(JSON.parse(readFileSync(outPath, 'utf8')), 'spices.json');
  console.log(`Datenbanken.db nicht vorhanden — eingecheckte spices.json übernommen: ${n} Sorten.`);
} else {
  console.error('Weder Datenbanken.db noch spices.json gefunden. Abbruch.');
  process.exit(1);
}
