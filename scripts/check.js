// Prüft index.html: Skript extrahieren, Syntax parsen, Spieltitel „Grauufer 1.0“ und Revision an beiden Stellen gleich.
const fs = require('fs'), path = require('path'), acorn = require('acorn');
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const a = html.indexOf('<script>') + 8, b = html.lastIndexOf('</script>');
if (a < 8 || b < 0) { console.error('Kein <script>-Block gefunden.'); process.exit(1); }
try { acorn.parse(html.slice(a, b), { ecmaVersion: 2022 }); }
catch (e) { console.error('Syntaxfehler im Spielskript:', e.message); process.exit(1); }
const t = html.match(/<title>Grauufer 1\.0 \(Rev (\d+)\)<\/title>/), r = html.match(/Revision (\d+)</);
if (!t || !r) { console.error('Revisionsangabe fehlt (Titel oder Titeldialog).'); process.exit(1); }
if (t[1] !== r[1]) { console.error(`Revision uneinheitlich: Titel ${t[1]}, Titeldialog ${r[1]}.`); process.exit(1); }
if (/https?:\/\/(?!www\.w3\.org)[^"'\s)]+\.(js|css|woff2?|png|jpg)/.test(html)) { console.error('Externe Datei im Spiel gefunden – das Spiel muss eigenständig laufen.'); process.exit(1); }
console.log(`Prüfung bestanden: Syntax ok, Revision ${t[1]}, keine externen Dateien.`);
