// Grafik-Werkstatt: bettet die Dungeons aus werkstatt/dungeons/*.json (Entwürfe aus dem Dungeon-Baukasten) in index.html ein
// (zwischen /*#DUNGEONS*/ und /*#DUNGEONS-ENDE*/). Der Dateiname wird zur festen Kennung des Dungeons. Seit Spiel-Rev 129.
// Aufruf: npm run dungeons
const fs = require('fs'), path = require('path');
const DIR = path.join(__dirname, 'dungeons'), SPIEL = path.join(__dirname, '..', 'index.html');
const liste = fs.readdirSync(DIR).filter(f => f.endsWith('.json')).sort().map(f => {
  const d = JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8'));
  if (!Array.isArray(d.raster) || !d.eingang || !d.ort) { console.error(`${f}: Raster, Treppe oder Gebiet fehlt.`); process.exit(1); }
  return { id: f.replace(/\.json$/, ''), name: d.name, stil: d.stil, ort: d.ort, raster: d.raster, eingang: d.eingang, gegner: d.gegner || [], schaetze: d.schaetze || [], truhen: d.truhen || [] };
});
const html = fs.readFileSync(SPIEL, 'utf8'), A = '/*#DUNGEONS*/', E = '/*#DUNGEONS-ENDE*/', i = html.indexOf(A), j = html.indexOf(E);
if (i < 0 || j < i) { console.error('Marken /*#DUNGEONS*/ … /*#DUNGEONS-ENDE*/ fehlen in index.html.'); process.exit(1); }
fs.writeFileSync(SPIEL, html.slice(0, i + A.length) + 'const DUNGEONS=' + JSON.stringify(liste) + ';' + html.slice(j));
console.log(`Dungeons eingebettet: ${liste.map(d => d.name).join(', ') || 'keine'}`);
