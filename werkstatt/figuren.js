// Grafik-Werkstatt: rendert die festen Spielfiguren (Klassen aus werkstatt/modelle/figur.js) in 8 Blickrichtungen und bettet sie in index.html ein
// (zwischen /*#FIGURBILDER*/ und /*#FIGURBILDER-ENDE*/). Seit Spiel-Rev 125.
// Je Figur und Richtung ein Bild (WebP mit Durchsichtigkeit) in doppelter Spielauflösung, dazu der Fußpunkt und die Lage der leuchtenden
// Steine (für den flackernden Lichtschein, den das Spiel in jedem Bild darüberzeichnet). Licht: Stimmung „nacht“ wie in der Werkstatt.
// Aufruf: npm run figuren
const { chromium } = require('@playwright/test');
const fs = require('fs'), path = require('path');
const DIR = __dirname, SPIEL = path.join(DIR, '..', 'index.html');
const GL = ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--no-sandbox'];
// Spielmaßstab: 60 Einheiten je Meter (wie die bisherigen Figuren nach Spiel-Rev 110), gerendert doppelt so fein
const K = 120, W = 200, H = 300, FUSS = 20;
const FIGUREN = [
  { name: 'magier_m', spec: { klasse: 'magier' } },
  { name: 'krieger_m', spec: { klasse: 'krieger' } },
  { name: 'laeufer_m', spec: { klasse: 'waldlaeufer' } },
  { name: 'skeleton', spec: { klasse: 'skelett' } },        // Gegner Skelettkrieger (Schlüssel wie im Spiel)
];

(async () => {
  const b = await chromium.launch({ args: GL }), p = await b.newPage();
  const fehler = []; p.on('pageerror', e => fehler.push(String(e))); p.on('console', m => { if (m.type() === 'error') fehler.push(m.text()); });
  await p.setContent('<html><body style="margin:0;background:transparent"></body></html>');
  for (const f of ['lib/three.min.js', 'modelle/avatar.js', 'modelle/figur.js']) await p.addScriptTag({ path: path.join(DIR, f) });
  const bilder = {};
  for (const fig of FIGUREN) {
    bilder[fig.name] = await p.evaluate(async ([spec, K, W, H, FUSS]) => {
      const c = document.createElement('canvas'); document.body.appendChild(c);
      const s = Avatar.Szene(c, { w: W, h: H, k: K, fuss: FUSS, boden: false }); s.licht('nacht');
      const G = Figur.bau(spec); s.fest(G); Figur.flackern(G, 0);
      const d = [];
      for (let r = 0; r < 8; r++) {
        s.zeige('idle', 0, r);
        const q = document.createElement('canvas'); q.width = W; q.height = H; const g = q.getContext('2d'); g.drawImage(c, 0, 0);
        const px = g.getImageData(0, 0, W, H).data; let x0 = W, y0 = H, x1 = 0, y1 = 0;
        for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (px[(y * W + x) * 4 + 3] > 8) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
        x0 = Math.max(0, x0 - 2); y0 = Math.max(0, y0 - 2); x1 = Math.min(W - 1, x1 + 2); y1 = Math.min(H - 1, y1 + 2);
        const o = document.createElement('canvas'); o.width = x1 - x0 + 1; o.height = y1 - y0 + 1; o.getContext('2d').drawImage(q, x0, y0, o.width, o.height, 0, 0, o.width, o.height);
        const licht = (G.userData.leuchten || []).map(l => { const [lx, ly] = s.projiziere(l.kern.position); return [Math.round(lx - x0), Math.round(ly - y0), l.phase]; });
        d.push({ u: o.toDataURL('image/webp', .9), w: o.width, h: o.height, ax: Math.round(W / 2 - x0), ay: Math.round(H - FUSS - y0), licht });
      }
      return d;
    }, [fig.spec, K, W, H, FUSS]);
  }
  await b.close();
  if (fehler.length) { console.error('Fehler beim Rendern:', fehler); process.exit(1); }
  const html = fs.readFileSync(SPIEL, 'utf8'), A = '/*#FIGURBILDER*/', E = '/*#FIGURBILDER-ENDE*/', i = html.indexOf(A), j = html.indexOf(E);
  if (i < 0 || j < i) { console.error('Marken /*#FIGURBILDER*/ … /*#FIGURBILDER-ENDE*/ fehlen in index.html.'); process.exit(1); }
  const js = 'const FIGURBILDER=' + JSON.stringify(bilder) + ';';
  fs.writeFileSync(SPIEL, html.slice(0, i + A.length) + js + html.slice(j));
  console.log(`Figuren eingebettet: ${Object.keys(bilder).join(', ')} (${Math.round(js.length / 1024)} KB)`);
})();
