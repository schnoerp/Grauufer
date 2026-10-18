// Grafik-Werkstatt: rendert das Logo (werkstatt/modelle/logo.js), rastert es wie das Spiel auf 144 × 144 Pixel und bettet es in
// index.html ein (zwischen /*#LOGOBILD*/ und /*#LOGOBILD-ENDE*/). Aufruf: npm run logo
const { chromium } = require('@playwright/test');
const fs = require('fs'), path = require('path');
const { pngIndex } = require('./png.js');
const DIR = __dirname, SPIEL = path.join(DIR, '..', 'index.html'), N = 144;
const GL = ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--no-sandbox'];

(async () => {
  const b = await chromium.launch({ args: GL }), p = await b.newPage();
  const fehler = []; p.on('pageerror', e => fehler.push(String(e)));
  await p.setContent('<html><body style="margin:0"></body></html>');
  await p.addScriptTag({ path: path.join(DIR, 'lib', 'three.min.js') });
  await p.addScriptTag({ path: path.join(DIR, 'modelle', 'logo.js') });
  const px = await p.evaluate(async N => {
    const i = new Image(); i.src = logo(N * 4); await i.decode();
    const c = document.createElement('canvas'); c.width = c.height = N; const g = c.getContext('2d'); g.imageSmoothingQuality = 'high'; g.drawImage(i, 0, 0, N, N);
    const d = g.getImageData(0, 0, N, N), a = d.data, B = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
    for (let y = 0, k = 0; y < N; y++) for (let x = 0; x < N; x++, k += 4) {
      const t0 = B[(y & 3) * 4 + (x & 3)]; if (a[k + 3] < 110) { a[k] = a[k + 1] = a[k + 2] = a[k + 3] = 0; continue; } a[k + 3] = 255; const t = (t0 / 16 - .47) * 12;
      for (let q = 0; q < 3; q++) a[k + q] = Math.max(0, Math.min(255, Math.round((a[k + q] + t) / 17) * 17));
    }
    return Array.from(a);
  }, N);
  await b.close();
  if (fehler.length) { console.error('Fehler beim Rendern:', fehler); process.exit(1); }
  const html = fs.readFileSync(SPIEL, 'utf8'), A = '/*#LOGOBILD*/', E = '/*#LOGOBILD-ENDE*/', i = html.indexOf(A), j = html.indexOf(E);
  if (i < 0 || j < i) { console.error('Marken /*#LOGOBILD*/ … /*#LOGOBILD-ENDE*/ fehlen in index.html.'); process.exit(1); }
  const js = `const LOGO_PNG='${pngIndex(px, N, N)}';`;
  fs.writeFileSync(SPIEL, html.slice(0, i + A.length) + js + html.slice(j));
  console.log(`Logo eingebettet (${N} × ${N}, ${Math.round(js.length / 1024)} KB)`);
})();
