// Grafik-Werkstatt: bereitet das Startbild vor und bettet es in index.html ein (zwischen /*#STARTBILD*/ und /*#STARTBILD-ENDE*/).
// Vorlage seit Spiel-Rev 121: werkstatt/logo/startbild_vorlage.jpg, vom Auftraggeber mit Gemini erstellt (Ausnahme laut CLAUDE.md, Abschnitt 2).
// Ablauf: Logo und Schriftzug ausschneiden, die eingebrannte Versionsnummer mit Hintergrund übermalen (die echte setzt das Spiel
// als Text darüber), Ränder weich in die Hintergrundfarbe auslaufen lassen, verkleinern und als JPEG einbetten.
// Kein Pixel-Raster (erster Schritt weg vom Pixel-Look). Aufruf: npm run logo
const { chromium } = require('@playwright/test');
const fs = require('fs'), path = require('path');
const DIR = __dirname, SPIEL = path.join(DIR, '..', 'index.html');
// Ausschnitt in der Vorlage (2734 × 1452), eingebrannte Versionsnummer, Quelle zum Übermalen (gleiche Zeilen weiter rechts), Zielbreite
const AUS = [350, 0, 2100, 1160], VER = [2180, 1050, 250, 100], QUELLE = 2440, BREITE = 1800, QUAL = 0.84;

(async () => {
  const b = await chromium.launch(), p = await b.newPage();
  const fehler = []; p.on('pageerror', e => fehler.push(String(e)));
  const src = 'data:image/jpeg;base64,' + fs.readFileSync(path.join(DIR, 'logo', 'startbild_vorlage.jpg')).toString('base64');
  const r = await p.evaluate(async ([src, AUS, VER, QUELLE, BREITE, QUAL]) => {
    const i = new Image(); i.src = src; await i.decode();
    const c = document.createElement('canvas'); c.width = i.width; c.height = i.height; const g = c.getContext('2d'); g.drawImage(i, 0, 0);
    // Versionsnummer übermalen: Streifen aus derselben Höhe weiter rechts, an den Rändern weich überblendet
    const [vx, vy, vw, vh] = VER, q = g.getImageData(QUELLE, vy, vw, vh), z = g.getImageData(vx, vy, vw, vh);
    for (let y = 0; y < vh; y++) for (let x = 0; x < vw; x++) {
      const k = (y * vw + x) * 4, m = Math.min(x, vw - 1 - x, y, vh - 1 - y), t = Math.min(1, m / 14);
      for (let n = 0; n < 3; n++) z.data[k + n] = z.data[k + n] * (1 - t) + q.data[k + n] * t;
    }
    g.putImageData(z, vx, vy);
    // Hintergrundfarbe = Mittel der Ausschnittränder
    const [ax, ay, aw, ah] = AUS, d = g.getImageData(ax, ay, aw, ah), a = d.data; let s = [0, 0, 0], n = 0;
    for (let x = 0; x < aw; x += 4) for (const y of [0, ah - 1]) { const k = (y * aw + x) * 4; s[0] += a[k]; s[1] += a[k + 1]; s[2] += a[k + 2]; n++; }
    for (let y = 0; y < ah; y += 4) for (const x of [0, aw - 1]) { const k = (y * aw + x) * 4; s[0] += a[k]; s[1] += a[k + 1]; s[2] += a[k + 2]; n++; }
    const hg = s.map(v => Math.round(v / n));
    // Ränder weich in die Hintergrundfarbe auslaufen lassen (unten schmal, damit der Schriftzug nicht verblasst)
    for (let y = 0; y < ah; y++) for (let x = 0; x < aw; x++) {
      const k = (y * aw + x) * 4, f = Math.min(1, x / 320, (aw - 1 - x) / 320, y / 110, (ah - 1 - y) / 45), t = f * f * (3 - 2 * f);
      for (let m = 0; m < 3; m++) a[k + m] = hg[m] + (a[k + m] - hg[m]) * t;
    }
    const o = document.createElement('canvas'); o.width = aw; o.height = ah; o.getContext('2d').putImageData(d, 0, 0);
    const h = Math.round(ah * BREITE / aw), e = document.createElement('canvas'); e.width = BREITE; e.height = h;
    const eg = e.getContext('2d'); eg.imageSmoothingQuality = 'high'; eg.drawImage(o, 0, 0, BREITE, h);
    return { url: e.toDataURL('image/jpeg', QUAL), w: BREITE, h, hg: '#' + hg.map(v => v.toString(16).padStart(2, '0')).join('') };
  }, [src, AUS, VER, QUELLE, BREITE, QUAL]);
  await b.close();
  if (fehler.length) { console.error('Fehler:', fehler); process.exit(1); }
  const html = fs.readFileSync(SPIEL, 'utf8'), A = '/*#STARTBILD*/', E = '/*#STARTBILD-ENDE*/', i = html.indexOf(A), j = html.indexOf(E);
  if (i < 0 || j < i) { console.error('Marken /*#STARTBILD*/ … /*#STARTBILD-ENDE*/ fehlen in index.html.'); process.exit(1); }
  const js = `const STARTBILD={u:'${r.url}',w:${r.w},h:${r.h},hg:'${r.hg}'};`;
  fs.writeFileSync(SPIEL, html.slice(0, i + A.length) + js + html.slice(j));
  console.log(`Startbild eingebettet (${r.w} × ${r.h}, Hintergrund ${r.hg}, ${Math.round(js.length / 1024)} KB)`);
})();
