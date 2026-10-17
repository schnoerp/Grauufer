// Grafik-Werkstatt: rendert die 3D-Modelle aus werkstatt/modelle mit three.js im Chromium von Playwright
// und legt die Vorschaubilder in werkstatt/vorschau ab. Aufruf: npm run grafik
const { chromium } = require('@playwright/test');
const fs = require('fs'), path = require('path');
const DIR = __dirname, OUT = path.join(DIR, 'vorschau');
const THREE_JS = path.join(DIR, '..', 'node_modules', 'three', 'build', 'three.min.js');
const GL = ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--no-sandbox'];

// Hilfsfunktionen im Browser: Bilder zusammensetzen und wie im Spiel rastern (pxl aus index.html, Spiel-Rev 59)
const HELFER = `
window.ladeBild=s=>new Promise(r=>{const i=new Image();i.onload=()=>r(i);i.src=s;});
window.raster=(c,f)=>{const w=Math.round(c.width*f),h=Math.round(c.height*f),o=document.createElement('canvas');o.width=w;o.height=h;
  const g=o.getContext('2d');g.imageSmoothingQuality='high';g.drawImage(c,0,0,w,h);const D=g.getImageData(0,0,w,h),d=D.data;
  const B=[0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5],ST=17;
  for(let y=0,i=0;y<h;y++)for(let x=0;x<w;x++,i+=4){const b=B[(y&3)*4+(x&3)];if(d[i+3]<110){d[i+3]=0;continue;}d[i+3]=255;const t=(b/16-.47)*ST*.7;
    for(let k=0;k<3;k++){const v=Math.round((d[i+k]+t)/ST)*ST;d[i+k]=v<0?0:v>255?255:v;}}
  g.putImageData(D,0,0);const z=document.createElement('canvas');z.width=w*2;z.height=h*2;const gz=z.getContext('2d');gz.imageSmoothingEnabled=false;gz.drawImage(o,0,0,w*2,h*2);return z;};
window.bogen=async(zeilen,cw,ch,crop)=>{const c=document.createElement('canvas');const n=Math.max(...zeilen.map(z=>z[1].length));
  c.width=n*cw+20;c.height=zeilen.length*(ch+28)+10;const g=c.getContext('2d');g.fillStyle='#d6ac84';g.fillRect(0,0,c.width,c.height);
  g.font='16px sans-serif';g.fillStyle='#3c2819';
  for(let r=0;r<zeilen.length;r++){const y=r*(ch+28)+6;g.fillText(zeilen[r][0],12,y+14);
    for(let k=0;k<zeilen[r][1].length;k++){const i=await ladeBild(zeilen[r][1][k]);g.drawImage(i,crop[0],crop[1],cw,ch,10+k*cw,y+20,cw,ch);}}
  return c.toDataURL();};`;

async function seite(b, modell, w, h) {
  const p = await b.newPage({ viewport: { width: w, height: h } });
  const fehler = []; p.on('pageerror', e => fehler.push(String(e)));
  p.on('console', m => { if (m.type() === 'error') fehler.push(m.text()); });
  await p.setContent('<html><body style="margin:0;background:transparent"></body></html>');
  await p.addScriptTag({ path: THREE_JS });
  await p.addScriptTag({ content: HELFER });
  if (modell) await p.addScriptTag({ path: path.join(DIR, 'modelle', modell) });
  p.fehler = fehler; return p;
}
const speichere = (name, url) => fs.writeFileSync(path.join(OUT, name), Buffer.from(url.split(',')[1], 'base64'));

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const b = await chromium.launch({ args: GL });
  const alleFehler = [];

  // 1. Skelettkrieger: 8 Richtungen und alle Bewegungen als Bogen
  {
    const p = await seite(b, 'skelettkrieger.js', 256, 512);
    const shot = (k, t, d) => p.evaluate(([k, t, d]) => window.shot(k, t, d), [k, t, d]);
    const z = [['8 Blickrichtungen (Stehen)', []], ['Laufen', []], ['Angriff', []], ['Sterben', []]];
    for (let d = 0; d < 8; d++) z[0][1].push(await shot('idle', 0, d));
    for (let f = 0; f < 8; f++) z[1][1].push(await shot('walk', f / 8, 1));
    for (let f = 0; f < 6; f++) z[2][1].push(await shot('attack', f / 5, 1));
    for (let f = 0; f < 5; f++) z[3][1].push(await shot('death', f / 4, 1));
    speichere('skelettkrieger_bewegungen.png', await p.evaluate(z => window.bogen(z, 118, 175, [69, 292]), z));
    alleFehler.push(...p.fehler); await p.close();
  }
  // 2. Haus außen und innen, innen zusätzlich wie im Spiel gerastert (ein Feld etwa 160 px breit)
  {
    const p = await seite(b, 'haus.js', 1000, 760);
    for (const m of ['aussen', 'innen']) speichere(`haus_${m}.png`, await p.evaluate(m => window.render(m), m));
    speichere('haus_innen_pixel.png', await p.evaluate(async () => {
      const i = await ladeBild(window.render('innen')); const c = document.createElement('canvas'); c.width = i.width; c.height = i.height;
      c.getContext('2d').drawImage(i, 0, 0); return raster(c, 160 / 137 / 2).toDataURL();
    }));
    alleFehler.push(...p.fehler); await p.close();
  }
  // 3. Gegenstände: einzeln auf den sichtbaren Teil zugeschnitten (128 x 128) und als Bogen
  const symbole = {};
  {
    const p = await seite(b, 'gegenstaende.js', 160, 160);
    const namen = await p.evaluate(() => window.names);
    for (const n of namen) symbole[n] = await p.evaluate(async n => {
      const i = await ladeBild(window.icon(n)); const c = document.createElement('canvas'); c.width = c.height = 160; const g = c.getContext('2d'); g.drawImage(i, 0, 0);
      const d = g.getImageData(0, 0, 160, 160).data; let x0 = 160, y0 = 160, x1 = 0, y1 = 0;
      for (let y = 0; y < 160; y++) for (let x = 0; x < 160; x++) if (d[(y * 160 + x) * 4 + 3] > 8) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); }
      const s = Math.max(x1 - x0, y1 - y0) + 8, o = document.createElement('canvas'); o.width = o.height = 128;
      o.getContext('2d').drawImage(c, (x0 + x1) / 2 - s / 2, (y0 + y1) / 2 - s / 2, s, s, 0, 0, 128, 128); return o.toDataURL();
    }, n);
    speichere('gegenstaende.png', await p.evaluate(z => window.bogen(z, 128, 128, [0, 0]), [['Gegenstände (Rucksack und Boden)', Object.values(symbole)]]));
    alleFehler.push(...p.fehler); await p.close();
  }
  // 4. Rucksack-Entwurf wie in Ultima VIII: Pagan (Seite aus rucksack.js, Bildschirm 1250 x 650)
  {
    const html = require('./rucksack.js')(symbole, path.join(DIR, 'vorschau', 'haus_innen.png'));
    const p = await b.newPage({ viewport: { width: 1250, height: 650 } });
    await p.setContent(html); await p.waitForTimeout(300);
    await p.screenshot({ path: path.join(OUT, 'rucksack_entwurf.png') }); await p.close();
  }
  await b.close();
  if (alleFehler.length) { console.error('Fehler beim Rendern:', alleFehler); process.exit(1); }
  console.log('Vorschaubilder erzeugt in werkstatt/vorschau:', fs.readdirSync(OUT).join(', '));
})();
