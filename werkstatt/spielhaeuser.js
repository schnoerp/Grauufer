// Grafik-Werkstatt: rendert die Häuser aus werkstatt/spielhaeuser/*.json als Spielbilder und bettet sie in index.html ein.
// Je Haus drei Bilder: außen (mit Dach), innen hinten (Boden, hintere Wände, Einrichtung) und innen vorn (die zwei niedrigen
// Wände zur Kamera), als PNG mit Farbtabelle. Maßstab wie im Spiel: ein Feld = TW = 160 Einheiten, gerastert wie pxl (Faktor RES/2 = 2,5).
// Aufruf: npm run haeuser
const { chromium } = require('@playwright/test');
const fs = require('fs'), path = require('path');
const DIR = __dirname, SPIEL = path.join(DIR, '..', 'index.html');
const GL = ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--no-sandbox'];
const K = 160 / (2.1 * Math.SQRT2), F = 2.5;
const { pngIndex } = require('./png.js');

const fertig = r => ({ u: pngIndex(r.px, r.sw, r.sh), w: r.w, h: r.h, x: r.x, y: r.y }); // Pixel je Meter (ein Feld 160 breit), Rasterfaktor wie PXF im Spiel

// im Browser: Ansicht rendern, auf den sichtbaren Teil zuschneiden (Raster 5, damit F glatt aufgeht) und wie pxl rastern
const BILD = async ([spec, innen, schicht, K, F]) => {
  const c = document.createElement('canvas'), s = Hausbau.Szene(c), [w, h] = s.groesse(spec, innen, K);
  s.renderer.setSize(w, h); s.zeige(spec, innen, 0, K, 0, { spiel: true, schicht });
  const [mx, my] = s.punkt(0, 0, 0), q = document.createElement('canvas'); q.width = w; q.height = h;
  const g = q.getContext('2d'); g.drawImage(c, 0, 0); const d = g.getImageData(0, 0, w, h).data;
  let x0 = w, y0 = h, x1 = 0, y1 = 0;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (d[(y * w + x) * 4 + 3] > 40) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
  x0 = Math.floor(x0 / 5) * 5; y0 = Math.floor(y0 / 5) * 5; const cw = Math.ceil((x1 - x0 + 1) / 5) * 5, ch = Math.ceil((y1 - y0 + 1) / 5) * 5;
  const sw = Math.round(cw / F), sh = Math.round(ch / F), o = document.createElement('canvas'); o.width = sw; o.height = sh;
  const og = o.getContext('2d'); og.imageSmoothingQuality = 'high'; og.drawImage(q, x0, y0, cw, ch, 0, 0, sw, sh);
  const D = og.getImageData(0, 0, sw, sh), p = D.data, B = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5], ST = 17;
  for (let y = 0, i = 0; y < sh; y++) for (let x = 0; x < sw; x++, i += 4) {
    const b = B[(y & 3) * 4 + (x & 3)]; if (p[i + 3] < 110) { p[i] = p[i + 1] = p[i + 2] = p[i + 3] = 0; continue; } p[i + 3] = 255; const t = (b / 16 - .47) * ST * .7;
    for (let k = 0; k < 3; k++) { const v = Math.round((p[i + k] + t) / ST) * ST; p[i + k] = v < 0 ? 0 : v > 255 ? 255 : v; }
  }
  return { px: Array.from(p), sw, sh, w: cw, h: ch, x: Math.round(mx - x0), y: Math.round(my - y0) };
};

(async () => {
  const b = await chromium.launch({ args: GL }), p = await b.newPage({ viewport: { width: 1200, height: 900 } });
  const fehler = []; p.on('pageerror', e => fehler.push(String(e))); p.on('console', m => { if (m.type() === 'error') fehler.push(m.text()); });
  await p.setContent('<html><body style="margin:0;background:transparent"></body></html>');
  await p.addScriptTag({ path: path.join(DIR, 'lib', 'three.min.js') });
  await p.addScriptTag({ path: path.join(DIR, 'modelle', 'hausbau.js') });
  const bilder = {};
  for (const datei of fs.readdirSync(path.join(DIR, 'spielhaeuser')).filter(f => f.endsWith('.json')).sort()) {
    const spec = JSON.parse(fs.readFileSync(path.join(DIR, 'spielhaeuser', datei), 'utf8')), name = datei.replace(/\.json$/, '');
    bilder[name] = {
      a: fertig(await p.evaluate(BILD, [spec, false, null, K, F])),
      h: fertig(await p.evaluate(BILD, [spec, true, 'hinten', K, F])),
      v: fertig(await p.evaluate(BILD, [spec, true, 'vorn', K, F])),
    };
  }
  await b.close();
  if (fehler.length) { console.error('Fehler beim Rendern:', fehler); process.exit(1); }
  // in index.html zwischen den Marken ersetzen
  const html = fs.readFileSync(SPIEL, 'utf8'), A = '/*#HAUSBILDER*/', E = '/*#HAUSBILDER-ENDE*/', i = html.indexOf(A), j = html.indexOf(E);
  if (i < 0 || j < i) { console.error('Marken /*#HAUSBILDER*/ … /*#HAUSBILDER-ENDE*/ fehlen in index.html.'); process.exit(1); }
  const js = 'const HAUSBILDER=' + JSON.stringify(bilder) + ';';
  fs.writeFileSync(SPIEL, html.slice(0, i + A.length) + js + html.slice(j));
  const kb = Math.round(js.length / 1024);
  console.log(`Häuser eingebettet: ${Object.keys(bilder).join(', ')} (${kb} KB)`);
})();
