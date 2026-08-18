//using import instead of request because it's the modern way
import express from 'express';
import fs from 'fs';
import path from 'path';
import {open} from 'sqlite';
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

const dbFilePath = "Datenbanken.db";

//database
async function getDataSpices() {
    const db = await open({
        filename: dbFilePath,
        driver: sqlite3.Database,
    });

    const jsonDataAmount = JSON.stringify(await db.all('SELECT COUNT(*) AS amount FROM spices')); //how many spices are there
    const jsonDataSpices = JSON.stringify(await db.all('SELECT * FROM spices')); //all info of every spice
    const jsonDataFinal = '{ "arrayAmount":'+jsonDataAmount+',"arraySpices":'+jsonDataSpices+'}';
    fs.writeFile("spices.json", jsonDataFinal, (err) => {
        if (err) {
            console.error('Fehler beim Schreiben der Datei:', err);
            return;
        }
        console.log('Daten erfolgreich in die JSON-Datei geschrieben.');
    });
    await db.close();
}
getDataSpices();


// all die verschiedenen Dateiendungen, die ausgeliefert werden
const extToContentType = {
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.svg': 'image/svg+xml',
    '.mov': 'video/quicktime',
    '.jpg': 'image/jpeg',
    '.png': 'image/png',
    '.html': 'text/html',
};

//server structure onload/navigation
app.use((req, res) => {
    //if I just type localhost:3000 I dont enter server error, I will open the index.html, if I want special page I can do this
    let filePath = '.'+req.url;
    if(filePath==="./")
        filePath="./index.html";
    else
        filePath = './'+req.url;

    //witch .??? do I have/use
    const extname = path.extname(filePath);
    const contentType = extToContentType[extname] || 'text/html';


    //AI-generated
    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Seite nicht gefunden.');
            } else {
                // server error
                res.writeHead(500);
                res.end('Sorry, ein interner Serverfehler ist aufgetreten.');
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

//start the Server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server läuft auf Port ${PORT}`);
});
