// Grafik-Werkstatt: bereitet das Logo vor und bettet es in index.html ein (zwischen /*#LOGOBILD*/ und /*#LOGOBILD-ENDE*/).
// Vorlage seit Spiel-Rev 113: werkstatt/logo/logo_vorlage.jpg, vom Auftraggeber selbst erstellt (Ausnahme laut CLAUDE.md, Abschnitt 2).
// Ablauf: schwarzen Hintergrund und dunklen Schein vom Rand her freistellen, auf N × N Pixel verkleinern und wie das Spiel rastern
// (16 Stufen je Farbkanal, Bayer-Dithering, keine halbdurchsichtigen Pixel). Aufruf: npm run logo
const { chromium } = require('@playwright/test');
const fs = require('fs'), path = require('path');
const { pngIndex } = require('./png.js');
const DIR = __dirname, SPIEL = path.join(DIR, '..', 'index.html'), N = 216, DUNKEL = 52;

(async () => {
  const b = await chromium.launch(), p = await b.newPage();
  const fehler = []; p.on('pageerror', e => fehler.push(String(e)));
  const src = 'data:image/jpeg;base64,' + fs.readFileSync(path.join(DIR, 'logo', 'logo_vorlage.jpg')).toString('base64');
  const px = await p.evaluate(async ([src, N, DUNKEL]) => {
    const i = new Image(); i.src = src; await i.decode();
    const S = Math.min(i.width, i.height), c = document.createElement('canvas'); c.width = c.height = S; const g = c.getContext('2d');
    g.drawImage(i, (i.width - S) / 2, (i.height - S) / 2, S, S, 0, 0, S, S);
    const D = g.getImageData(0, 0, S, S), a = D.data, frei = new Uint8Array(S * S), st = [];
    const dunkel = k => Math.max(a[k * 4], a[k * 4 + 1], a[k * 4 + 2]) < DUNKEL;
    for (let k = 0; k < S; k++) st.push(k, (S - 1) * S + k, k * S, k * S + S - 1);
    while (st.length) { const k = st.pop(); if (frei[k] || !dunkel(k)) continue; frei[k] = 1; const x = k % S, y = (k - x) / S;
      if (x > 0) st.push(k - 1); if (x < S - 1) st.push(k + 1); if (y > 0) st.push(k - S); if (y < S - 1) st.push(k + S); }
    for (let k = 0; k < S * S; k++) if (frei[k]) a[k * 4 + 3] = 0;
    g.putImageData(D, 0, 0);
    const o = document.createElement('canvas'); o.width = o.height = N; const og = o.getContext('2d'); og.imageSmoothingQuality = 'high'; og.drawImage(c, 0, 0, N, N);
    const E = og.getImageData(0, 0, N, N), e = E.data, B = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
    for (let y = 0, k = 0; y < N; y++) for (let x = 0; x < N; x++, k += 4) {
      const t0 = B[(y & 3) * 4 + (x & 3)]; if (e[k + 3] < 110) { e[k] = e[k + 1] = e[k + 2] = e[k + 3] = 0; continue; } e[k + 3] = 255; const t = (t0 / 16 - .47) * 12;
      for (let q = 0; q < 3; q++) e[k + q] = Math.max(0, Math.min(255, Math.round((e[k + q] + t) / 17) * 17));
    }
    return Array.from(e);
  }, [src, N, DUNKEL]);
  await b.close();
  if (fehler.length) { console.error('Fehler:', fehler); process.exit(1); }
  const html = fs.readFileSync(SPIEL, 'utf8'), A = '/*#LOGOBILD*/', E = '/*#LOGOBILD-ENDE*/', i = html.indexOf(A), j = html.indexOf(E);
  if (i < 0 || j < i) { console.error('Marken /*#LOGOBILD*/ … /*#LOGOBILD-ENDE*/ fehlen in index.html.'); process.exit(1); }
  const js = `const LOGO_PNG='${pngIndex(px, N, N)}';`;
  fs.writeFileSync(SPIEL, html.slice(0, i + A.length) + js + html.slice(j));
  console.log(`Logo eingebettet (${N} × ${N}, ${Math.round(js.length / 1024)} KB)`);
})();
