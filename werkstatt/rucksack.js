// Rucksack-Entwurf wie in Ultima VIII: Pagan – erzeugt die HTML-Seite für die Vorschau (Bildschirm 1250 x 650).
// Gegenstände liegen frei in der Ledertasche; links Ausrüstung mit Wertevorschau, Mengenregler und Knopf „Aufräumen“.
const fs = require('fs'), path = require('path');
module.exports = (I, hintergrund) => {
  const html0 = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
  const font = (html0.match(/@font-face\{[^}]*\}/g) || []).join('\n'); // eingebettete Schrift Pixelify Sans
  const bg = 'data:image/png;base64,' + fs.readFileSync(hintergrund).toString('base64');
  // frei verteilte Gegenstände: Name, x, y, Größe, Drehung (Tasche innen 470 x 320)
  const bag = [['brot',20,40,92,-10],['apfel',118,30,44,0],['apfel',140,48,44,0],['heiltrank',190,20,56,0],['heiltrank',214,30,56,0],['manatrank',262,24,56,0],
    ['gold',330,30,70,0],['buch',30,140,96,8],['rolle',140,130,92,15],['kerze',250,110,40,0],['becher',300,120,56,0],['dolch',360,110,90,0],
    ['edelstein',50,240,40,0],['schluessel',110,230,90,0],['schwert',200,200,150,-15]];
  const items = bag.map(([n,x,y,s,r]) => `<img src="${I[n]}" style="left:${x}px;top:${y}px;width:${s}px;transform:rotate(${r}deg)">`).join('');
  return `<!doctype html><html><head><meta charset="utf-8"><style>${font}
body{margin:0;width:1250px;height:650px;overflow:hidden;font-family:'Pixelify Sans',sans-serif;background:#222 url(${bg}) center/cover;}
.dim{position:absolute;inset:0;background:rgba(10,8,6,.55)}
.win{position:absolute;left:115px;top:40px;width:1020px;height:560px;}
.roll{position:absolute;left:-14px;right:-14px;height:26px;border-radius:13px;background:linear-gradient(#8a5a30,#c08850 40%,#6a4020);box-shadow:0 3px 6px #0008}
.roll:before,.roll:after{content:'';position:absolute;top:-4px;width:22px;height:34px;border-radius:8px;background:linear-gradient(90deg,#4a2a14,#8a5a30,#4a2a14)}
.roll:before{left:-10px}.roll:after{right:-10px}
.parch{position:absolute;top:13px;bottom:13px;left:0;right:0;background:radial-gradient(ellipse at 50% 40%,#f1e2bd,#dcc391 70%,#c7a86e);box-shadow:inset 0 0 40px #a0783c88;}
h1{position:absolute;top:22px;width:100%;text-align:center;margin:0;font-size:30px;color:#4a2c14;font-weight:500}
.seal{position:absolute;right:18px;top:20px;width:46px;height:46px;border-radius:50%;background:radial-gradient(circle at 35% 35%,#e04030,#9a1a12 70%);box-shadow:0 2px 4px #0006;color:#f0c0a0;text-align:center;line-height:46px;font-size:24px}
.eq{position:absolute;left:30px;top:80px;width:330px;height:440px;border:2px solid #a07a44;border-radius:10px;background:#e9d6a866}
.eq h2,.bagw h2{margin:8px 0 0;text-align:center;font-size:20px;color:#5a3a1a;font-weight:500}
.slot{position:absolute;width:66px;height:66px;border:2px solid #8a6434;border-radius:8px;background:#d6bd8acc;box-shadow:inset 0 0 8px #0003}
.slot img{width:100%}.slot span{position:absolute;top:68px;width:100%;text-align:center;font-size:12px;color:#6a4a2a}
.fig{position:absolute;left:115px;top:44px;width:100px;height:300px}
.stats{position:absolute;left:20px;right:20px;bottom:12px;font-size:15px;color:#4a2c14;line-height:1.45}
.up{color:#2a7a2a}
.bagw{position:absolute;left:385px;top:80px;width:605px;height:440px;}
.bag{position:absolute;left:30px;top:40px;width:540px;height:370px;border-radius:40px 40px 90px 90px;background:radial-gradient(ellipse at 50% 30%,#8a5a34,#5e3a1e 60%,#3e2410);box-shadow:inset 0 10px 30px #0009,0 6px 10px #0006;}
.bag:before{content:'';position:absolute;inset:12px;border:3px dashed #c89a60aa;border-radius:32px 32px 80px 80px}
.inner{position:absolute;left:35px;top:25px;width:470px;height:320px;border-radius:30px 30px 70px 70px;background:radial-gradient(ellipse at 50% 20%,#4a2c16,#2a180a);box-shadow:inset 0 8px 24px #000c}
.inner img{position:absolute;filter:drop-shadow(2px 4px 2px #0009)}
.hand{position:absolute;z-index:5}
.drag{width:86px;filter:drop-shadow(10px 16px 4px #000a)}
.tip{position:absolute;left:-150px;top:-36px;background:#f4e6c4;border:2px solid #8a6434;border-radius:6px;padding:4px 10px;font-size:14px;color:#3a2410;white-space:nowrap}
.btn{position:absolute;bottom:2px;padding:6px 16px;border:2px solid #6a4420;border-radius:6px;background:linear-gradient(#c89a5a,#9a6a34);color:#2a1606;font-size:16px;font-family:inherit}
.slider{position:absolute;left:330px;top:300px;width:220px;background:#f4e6c4;border:2px solid #6a4420;border-radius:8px;padding:8px 10px;font-size:14px;color:#3a2410;z-index:7;box-shadow:0 4px 10px #0008}
.track{height:8px;border-radius:4px;background:#b08850;margin:9px 0;position:relative}.knob{position:absolute;left:45%;top:-6px;width:18px;height:18px;border-radius:50%;background:#7a4a20;border:2px solid #f4e6c4}
.note{position:absolute;left:0;right:0;bottom:16px;text-align:center;font-size:13px;color:#7a5a3a}
.arrow{position:absolute;z-index:4}
</style></head><body><div class="dim"></div>
<div class="win"><div class="parch"></div><div class="roll" style="top:0"></div><div class="roll" style="bottom:0"></div>
<h1>Rucksack</h1><div class="seal">✕</div>
<div class="eq"><h2>Ausrüstung</h2>
<svg class="fig" viewBox="0 0 100 300"><g fill="#9a7a4a" opacity=".45"><circle cx="50" cy="34" r="20"/><rect x="28" y="58" width="44" height="96" rx="14"/><rect x="8" y="64" width="16" height="84" rx="8"/><rect x="76" y="64" width="16" height="84" rx="8"/><rect x="30" y="150" width="17" height="120" rx="8"/><rect x="53" y="150" width="17" height="120" rx="8"/></g></svg>
<div class="slot" style="left:132px;top:40px"><span>Kopf</span></div>
<div class="slot" style="left:24px;top:120px"><img src="${I.schwert}"><span>Waffe</span></div>
<div class="slot" style="left:240px;top:120px;outline:3px solid #2a8a2a;outline-offset:2px"><span>Schild</span></div>
<div class="slot" style="left:132px;top:132px"><span>Brust</span></div>
<div class="slot" style="left:24px;top:224px"><span>Ring</span></div>
<div class="slot" style="left:240px;top:224px"><span>Amulett</span></div>
<div class="slot" style="left:132px;top:236px"><span>Füße</span></div>
<div class="stats">Vorschau, während der Schild über der Figur schwebt:<br>Rüstung <b>6</b> → <b class="up">8 (+2)</b></div></div>
<div class="hand" style="left:300px;top:190px"><img class="drag" src="${I.schild}"><div class="tip">Rundschild – auf die Figur ziehen</div></div>
<div class="bagw"><h2>Ledertasche – Dinge frei ablegen</h2><div class="bag"><div class="inner">${items}</div></div>
<div class="slider">2 Heiltränke teilen<div class="track"><div class="knob"></div></div>Menge: <b>1</b> von 2 &nbsp; <u>Nehmen</u></div>
<button class="btn" style="left:60px">Aufräumen</button><button class="btn" style="right:60px">Gold: 37</button></div>
<div class="note">Entwurf – Inhalt und Werte sind Beispiele</div></div></body></html>`;
};
