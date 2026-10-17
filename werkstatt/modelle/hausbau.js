// Hausbau: erzeugt ein Haus wie in Ultima VIII: Pagan aus einer Beschreibung (JSON) – feldweise (ein Feld = 2,1 m),
// mit Wandart, Dachdeckung, Öffnungen, Einrichtung und einstellbarer Verwitterung. Wird vom Haus-Baukasten
// (werkstatt/baukasten.html) und vom Render-Ablauf (werkstatt/render.js) benutzt. Benötigt THREE (three.js 0.149).
(function(){
THREE.ColorManagement.legacyMode=false;
const T=2.1,WH=3.0,WT=.28,PI=Math.PI;
const KATALOG={
  bett:{name:'Bett',wand:1},truhe:{name:'Truhe',wand:1},schrank:{name:'Schrank',wand:1},regal:{name:'Bücherregal',wand:1},
  kamin:{name:'Kamin',wand:1},wandbrett:{name:'Wandbrett',wand:1},waffen:{name:'Waffen an der Wand',wand:1},
  tisch:{name:'Tisch mit Bänken'},faesser:{name:'Fässer'},kiste:{name:'Kiste'},saecke:{name:'Säcke'},hocker:{name:'Hocker'},
  teppich:{name:'Teppich'},kessel:{name:'Kessel'},stuhl:{name:'Stuhl (umgekippt)'},besen:{name:'Besen'},brennholz:{name:'Brennholz'}};
const OEFFNUNGEN=['wand','fenster','tuer','fenster_kaputt','fenster_vernagelt'];
const BEISPIEL={name:'Fischerhaus',breite:5,tiefe:4,wand:'fachwerk',dach:'schiefer',first:'x',verwitterung:.75,schornstein:true,
  oeffnungen:[{seite:'hinten',feld:0,art:'fenster'},{seite:'hinten',feld:4,art:'fenster'},{seite:'links',feld:2,art:'fenster'},
    {seite:'vorn',feld:1,art:'fenster'},{seite:'vorn',feld:2,art:'tuer'},{seite:'vorn',feld:4,art:'fenster_kaputt'},{seite:'rechts',feld:2,art:'fenster'}],
  einrichtung:[{art:'kamin',x:0,z:1,dreh:1},{art:'kessel',x:0,z:1,dreh:0},{art:'regal',x:1,z:0,dreh:0},{art:'schrank',x:2,z:0,dreh:0},{art:'wandbrett',x:3,z:0,dreh:0},
    {art:'bett',x:4,z:0,dreh:0},{art:'truhe',x:4,z:1,dreh:0},{art:'tisch',x:2,z:2,dreh:0},{art:'teppich',x:2,z:2,dreh:0},{art:'faesser',x:0,z:2,dreh:1},
    {art:'saecke',x:0,z:3,dreh:1},{art:'kiste',x:0,z:0,dreh:0},{art:'stuhl',x:3,z:1,dreh:0},{art:'hocker',x:1,z:1,dreh:0},{art:'besen',x:4,z:2,dreh:3},
    {art:'brennholz',x:5,z:0,dreh:3},{art:'faesser',x:5,z:3,dreh:3},{art:'kiste',x:1,z:4,dreh:2}]};

// ---------- Zufall, Texturen ----------
let seed=1;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;
const setSeed=s=>{seed=1;for(const c of String(s))seed=(seed*31+c.charCodeAt(0))%2147483647;if(seed<=0)seed+=2147483646;};
const sh=(c,v)=>{const n=parseInt(c.slice(1),16);const f=x=>Math.max(0,Math.min(255,Math.round(x*v)));return`rgb(${f(n>>16)},${f(n>>8&255)},${f(n&255)})`;};
function tex(w,h,draw){const c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d');draw(g,w,h);
  const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.encoding=THREE.sRGBEncoding;t.anisotropy=4;return t;}
function grime(g,w,h,n,a){for(let i=0;i<n;i++){const x=rnd()*w,y=rnd()*h,r=6+rnd()*40;const gr=g.createRadialGradient(x,y,0,x,y,r);gr.addColorStop(0,`rgba(40,30,15,${a*rnd()})`);gr.addColorStop(1,'rgba(40,30,15,0)');g.fillStyle=gr;g.fillRect(x-r,y-r,2*r,2*r);}}
function moss(g,w,h,n,yb){for(let i=0;i<n;i++){const x=rnd()*w,y=yb?h*(rnd()**2):rnd()*h,r=3+rnd()*16;for(let k=0;k<14;k++){g.fillStyle=`rgba(${60+rnd()*30|0},${80+rnd()*30|0},${30+rnd()*15|0},${.35+rnd()*.4})`;g.beginPath();g.arc(x+(rnd()-.5)*r*2,y+(rnd()-.5)*r,1+rnd()*3,0,7);g.fill();}}}
function crack(g,x,y,len){g.strokeStyle='rgba(50,38,25,.55)';g.lineWidth=1;g.beginPath();g.moveTo(x,y);for(let i=0;i<len;i++){x+=(rnd()-.5)*8;y+=3+rnd()*5;g.lineTo(x,y);}g.stroke();}
const CACHE={};
function texturen(v){const key=Math.round(v*4);if(CACHE[key])return CACHE[key];const V=key/4;setSeed('tex'+key);
  const t={
  stein:tex(256,256,(g,w,h)=>{g.fillStyle='#3a362f';g.fillRect(0,0,w,h);let y=0;while(y<h){const rh=18+rnd()*20;let x=-rnd()*30;
    while(x<w){const rw=22+rnd()*44;g.fillStyle=sh(rnd()<.2?'#7a6e5c':'#827c70',.62+rnd()*.42);g.beginPath();g.moveTo(x+2+rnd()*3,y+2);g.lineTo(x+rw-2-rnd()*4,y+2+rnd()*2);g.lineTo(x+rw-3,y+rh-2-rnd()*3);g.lineTo(x+3,y+rh-3);g.closePath();g.fill();
    g.fillStyle='rgba(255,255,255,.06)';g.fillRect(x+5,y+3,rw-14,2);x+=rw;}y+=rh;}grime(g,w,h,10+40*V,.5);moss(g,w,h,12*V,1);}),
  putz:tex(256,256,(g,w,h)=>{g.fillStyle=V<.3?'#d2c4a2':'#bfae88';g.fillRect(0,0,w,h);for(let i=0;i<3000;i++){g.fillStyle=`rgba(${rnd()<.5?80:230},${rnd()<.5?62:215},40,${rnd()*.07})`;g.fillRect(rnd()*w,rnd()*h,2+rnd()*5,2+rnd()*5);}
    for(let i=0;i<8*V;i++){const x=rnd()*w,wd=3+rnd()*8;const gr=g.createLinearGradient(0,0,0,h);gr.addColorStop(0,'rgba(60,45,25,.16)');gr.addColorStop(1,'rgba(60,45,25,0)');g.fillStyle=gr;g.fillRect(x,0,wd,h*(.3+rnd()*.7));}
    const gb=g.createLinearGradient(0,h*.6,0,h);gb.addColorStop(0,'rgba(50,38,20,0)');gb.addColorStop(1,`rgba(50,38,20,${.15+.4*V})`);g.fillStyle=gb;g.fillRect(0,0,w,h);
    for(let i=0;i<4*V;i++){const x=rnd()*w*.8,y=rnd()*h*.7,pw=20+rnd()*40,ph=12+rnd()*26;g.fillStyle='#6a5a44';g.beginPath();g.ellipse(x,y,pw/2,ph/2,rnd(),0,7);g.fill();
      for(let k=0;k<4;k++){g.fillStyle=sh('#8a7a62',.7+rnd()*.4);g.fillRect(x-pw/2+4,y-ph/2+3+k*ph/4,pw-8,ph/4-2);}}
    for(let i=0;i<6*V;i++)crack(g,rnd()*w,rnd()*h*.6,6+rnd()*10);grime(g,w,h,30*V,.35);}),
  holz:tex(128,256,(g,w,h)=>{g.fillStyle=V<.3?'#5e4630':'#4e3c2c';g.fillRect(0,0,w,h);for(let i=0;i<70;i++){g.strokeStyle=`rgba(${rnd()<.5?20:120},${rnd()<.5?16:100},${rnd()<.5?10:80},.3)`;g.lineWidth=1+rnd()*2;const x=rnd()*w;g.beginPath();g.moveTo(x,0);g.bezierCurveTo(x+6,h/3,x-6,h*2/3,x+rnd()*4,h);g.stroke();}
    for(let i=0;i<8*V;i++){g.fillStyle='rgba(15,10,5,.6)';g.fillRect(rnd()*w,rnd()*h,1+rnd(),20+rnd()*60);}grime(g,w,h,15*V,.4);}),
  bohlen:tex(256,256,(g,w,h)=>{const n=7;for(let i=0;i<n;i++){const y0=i*h/n;g.fillStyle=sh('#5a4430',.7+rnd()*.4);g.fillRect(0,y0,w,h/n);g.fillStyle='rgba(0,0,0,.55)';g.fillRect(0,y0,w,3);
    g.fillStyle='rgba(255,230,180,.08)';g.fillRect(0,y0+4,w,3);for(let k=0;k<10;k++){g.fillStyle='rgba(20,12,4,.25)';g.fillRect(rnd()*w,y0+4+rnd()*(h/n-8),30+rnd()*70,1);}}
    grime(g,w,h,10+30*V,.45);moss(g,w,h,8*V,1);}),
  dielen:tex(256,256,(g,w,h)=>{const n=8;for(let i=0;i<n;i++){g.fillStyle=sh('#6e5034',.7+rnd()*.4);g.fillRect(i*w/n,0,w/n,h);g.fillStyle='rgba(0,0,0,.55)';g.fillRect(i*w/n,0,3,h);
    const cut=rnd()*h;g.fillRect(i*w/n,cut,w/n,3);for(let k=0;k<8;k++){g.fillStyle='rgba(30,18,5,.2)';g.fillRect(i*w/n+4+rnd()*20,rnd()*h,1,30+rnd()*60);}}
    grime(g,w,h,40*V,.55);for(let i=0;i<50*V;i++){g.strokeStyle=`rgba(200,170,90,${.4+rnd()*.4})`;g.lineWidth=1;const x=rnd()*w,y=rnd()*h,a=rnd()*7,l=6+rnd()*10;g.beginPath();g.moveTo(x,y);g.lineTo(x+Math.cos(a)*l,y+Math.sin(a)*l);g.stroke();}}),
  schiefer:tex(256,256,(g,w,h)=>{g.fillStyle='#1e2024';g.fillRect(0,0,w,h);const rh=16;for(let r=0;r*rh<h;r++){let x=(r%2)*14-14;while(x<w){const sw=20+rnd()*12;
    if(rnd()<.07*V){x+=sw;continue;}const dy=(rnd()-.5)*3*V;g.fillStyle=sh(rnd()<.15?'#5e5a50':'#4e535c',.65+rnd()*.45);g.beginPath();g.moveTo(x+1,r*rh+dy);g.lineTo(x+sw-1,r*rh);g.lineTo(x+sw-1-rnd()*2,r*rh+rh-3);g.quadraticCurveTo(x+sw/2,r*rh+rh+2+dy,x+1,r*rh+rh-3);g.fill();x+=sw;}}
    moss(g,w,h,30*V);grime(g,w,h,25*V,.4);}),
  schindeln:tex(256,256,(g,w,h)=>{g.fillStyle='#2a1c12';g.fillRect(0,0,w,h);const rh=18;for(let r=0;r*rh<h;r++){let x=(r%2)*10-10;while(x<w){const sw=14+rnd()*10;
    if(rnd()<.06*V){x+=sw;continue;}g.fillStyle=sh(rnd()<.2?'#6a5038':'#5a4430',.6+rnd()*.5);g.fillRect(x+1,r*rh+(rnd()-.5)*2*V,sw-2,rh-2);g.fillStyle='rgba(0,0,0,.25)';g.fillRect(x+1,r*rh+rh-5,sw-2,3);x+=sw;}}
    moss(g,w,h,35*V);grime(g,w,h,25*V,.4);}),
  reet:tex(256,256,(g,w,h)=>{g.fillStyle='#6a5a36';g.fillRect(0,0,w,h);for(let i=0;i<2600;i++){g.strokeStyle=sh(rnd()<.5?'#a08a52':'#8a7440',.6+rnd()*.5);g.lineWidth=1+rnd();const x=rnd()*w,y=rnd()*h;g.beginPath();g.moveTo(x,y);g.lineTo(x+(rnd()-.5)*3,y+10+rnd()*14);g.stroke();}
    for(let r=0;r<h;r+=32){g.fillStyle='rgba(30,22,10,.35)';g.fillRect(0,r,w,3);}moss(g,w,h,40*V);grime(g,w,h,30*V,.5);}),
  stoff:tex(64,64,(g,w,h)=>{g.fillStyle='#5e3028';g.fillRect(0,0,w,h);g.fillStyle='#7a4a34';for(let i=0;i<w;i+=16)g.fillRect(i,0,6,h);g.fillStyle='rgba(0,0,0,.2)';for(let j=0;j<h;j+=16)g.fillRect(0,j,w,4);}),
  teppich:tex(128,128,(g,w,h)=>{g.fillStyle='#5c3a2a';g.fillRect(0,0,w,h);g.strokeStyle='#c8a050';g.lineWidth=6;g.strokeRect(10,10,w-20,h-20);g.strokeStyle='#8a3024';g.lineWidth=10;g.strokeRect(26,26,w-52,h-52);g.fillStyle='#c8a050';g.beginPath();g.moveTo(w/2,40);g.lineTo(w-40,h/2);g.lineTo(w/2,h-40);g.lineTo(40,h/2);g.fill();grime(g,w,h,20*V,.5);}),
  wiese:tex(256,256,(g,w,h)=>{g.fillStyle='#646c3a';g.fillRect(0,0,w,h);for(let i=0;i<3000;i++){g.fillStyle=sh(rnd()<.5?'#5c6a30':'#8a9450',.8+rnd()*.4);g.fillRect(rnd()*w,rnd()*h,2,3+rnd()*4);}})};
  return CACHE[key]=t;}

// ---------- Bausteine ----------
function Bau(spec,innen,drehung=0){
  const v=Math.max(0,Math.min(1,+spec.verwitterung||0)),tx=texturen(v);setSeed(spec.name||'haus');
  const B=Math.max(2,Math.min(9,spec.breite|0)),D=Math.max(2,Math.min(9,spec.tiefe|0)),HX=B*T,HZ=D*T;
  const M=o=>new THREE.MeshStandardMaterial(Object.assign({roughness:.85},o));
  const mt=(t,rx,ry,o)=>{const c=t.clone();c.needsUpdate=true;c.repeat.set(rx,ry);return M(Object.assign({map:c},o));};
  const mStein=M({map:tx.stein}),mPutz=M({map:tx.putz,roughness:.95}),mHolz=M({map:tx.holz}),mBohlen=M({map:tx.bohlen}),
    mEisen=M({color:0x55524e,roughness:.5,metalness:.6}),mStoff=M({map:tx.stoff,roughness:1}),mLeinen=M({color:0xe0d8c4,roughness:1}),
    mGlas=M({color:0x9fb8c8,roughness:.2,metalness:.1,emissive:0x203040}),mSchwarz=M({color:0x101010}),mFeuer=new THREE.MeshBasicMaterial({color:0xffa030}),
    mMessing=M({color:0xb08840,roughness:.4,metalness:.7}),mWachs=M({color:0xf2e6c8,roughness:.6}),mBrot=M({color:0xb07a3a}),mApfel=M({color:0x9a2a20,roughness:.5}),
    mTon=M({color:0x7a5a3a}),mTeller=M({color:0xc8c0b0,roughness:.4}),mSack=M({color:0x8a7048,roughness:1}),mStroh=[M({color:0x8a7030,roughness:1}),M({color:0x6a5420,roughness:1})],
    mUnkraut=[M({color:0x2e3a14,roughness:1}),M({color:0x4a4a1c,roughness:1})],mRuss=M({color:0,transparent:true,opacity:.35,depthWrite:false}),
    mNetz=M({color:0xe0e0d8,transparent:true,opacity:.35,side:THREE.DoubleSide}),mBuch=c=>M({color:c,roughness:.8});
  const root=new THREE.Group(),haus=new THREE.Group();root.add(haus);haus.position.set(-HX/2,0,-HZ/2);
  const J=v*.07;
  function box(w,h,d,m,x,y,z,p,ry=0){const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);o.position.set(x,y,z);o.rotation.y=ry;
    if(m===mHolz&&J){o.rotation.z+=(rnd()-.5)*J;o.rotation.x+=(rnd()-.5)*J*.6;}o.castShadow=o.receiveShadow=true;(p||haus).add(o);return o;}
  function cyl(r1,r2,h,m,x,y,z,p,seg=14){const o=new THREE.Mesh(new THREE.CylinderGeometry(r1,r2,h,seg),m);o.position.set(x,y,z);o.castShadow=o.receiveShadow=true;(p||haus).add(o);return o;}
  function kugel(r,m,x,y,z,p,sx=1,sy=1,sz=1){const o=new THREE.Mesh(new THREE.SphereGeometry(r,12,10),m);o.position.set(x,y,z);o.scale.set(sx,sy,sz);o.castShadow=true;(p||haus).add(o);return o;}
  function uv(o,s){const a=o.geometry.attributes.uv;for(let i=0;i<a.count;i++)a.setXY(i,a.getX(i)*s[0],a.getY(i)*s[1]);a.needsUpdate=true;return o;}
  const typ=['fachwerk','stein','holz'].includes(spec.wand)?spec.wand:'fachwerk';
  const sockel=typ==='fachwerk'?.8:typ==='holz'?.35:99,mOben=typ==='fachwerk'?mPutz:typ==='holz'?mBohlen:mStein;
  const oeff={};(spec.oeffnungen||[]).forEach(o=>{if(o&&o.art&&o.art!=='wand')oeff[o.seite+':'+o.feld]=o.art;});

  // Wand mit Öffnungen (Löcher in Metern entlang der Wand: [von, bis, unten, oben, art])
  function wand(seite,len,x,z,achse,hgt){const aus=seite==='hinten'||seite==='rechts'?-1:1,g=new THREE.Group();g.position.set(x,0,z);if(achse==='z')g.rotation.y=-PI/2;haus.add(g);
    const n=Math.round(len/T),loecher=[];
    for(let f=0;f<n;f++){const a=oeff[seite+':'+f];if(!a)continue;const m=(f+.5)*T;
      loecher.push(a==='tuer'?[m-.6,m+.6,0,2.4,a]:[m-.5,m+.5,1.3,2.3,a]);}
    const teil=(a,b,lo,hi)=>{if(hi<=lo+.01)return;const s=Math.min(hi,sockel);if(s>lo)uv(box(b-a,s-lo,WT+.06,mStein,(a+b)/2,(lo+s)/2,0,g),[(b-a)/2,(s-lo)/2]);
      const o=Math.max(lo,sockel);if(hi>o)uv(box(b-a,hi-o,WT,mOben,(a+b)/2,(o+hi)/2,0,g),typ==='holz'?[(b-a)/2.5,(hi-o)/2.5]:[(b-a)/3,(hi-o)/3]);};
    const cuts=[0,...loecher.flatMap(l=>[l[0],l[1]]),len];
    for(let i=0;i<cuts.length;i+=2)teil(cuts[i],cuts[i+1],0,hgt);
    loecher.forEach(([a,b,lo,hi,art])=>{teil(a,b,0,Math.min(lo,hgt));if(hi<hgt)teil(a,b,hi,hgt);
      if(lo>0&&lo<hgt)box(b-a+.2,.08,WT+.16,mHolz,(a+b)/2,lo,0,g);
      if(hi<=hgt)box(b-a+.3,.16,WT+.04,mHolz,(a+b)/2,hi+.08,0,g);
      if(lo>0&&hi<=hgt){const m=(a+b)/2;
        if(art==='fenster_kaputt'){box(b-a-.1,hi-lo-.1,.04,mSchwarz,m,(lo+hi)/2,0,g);box(.06,hi-lo,.08,mHolz,m,(lo+hi)/2,0,g).rotation.z=.2;}
        else{box(b-a-.1,hi-lo-.1,.04,mGlas,m,(lo+hi)/2,0,g);box(.06,hi-lo,.08,mHolz,m,(lo+hi)/2,0,g);box(b-a,.06,.08,mHolz,m,(lo+hi)/2,0,g);}
        if(art==='fenster_vernagelt')for(let k=0;k<3;k++){const br=box(b-a+.2,.14,.05,mHolz,m,lo+.25+k*.32,.18*aus,g);br.rotation.z=(rnd()-.5)*.35;}
        if(v>.4&&art!=='fenster_vernagelt'&&rnd()<v){const l=box(.5,.95,.05,mHolz,a-.3,(lo+hi)/2,.2*aus,g);l.rotation.y=-.9*aus;l.rotation.z=.25*v;}}
      if(art==='tuer'&&hgt>=WH-.01){box(b-a-.1,hi-.05,.08,mHolz,(a+b)/2,hi/2,.06*aus,g);box(.08,.08,.1,mEisen,b-.3,1.2,.12*aus,g);for(const y of[.5,1.9])box(b-a-.1,.08,.1,mEisen,(a+b)/2,y,.11*aus,g);
        box(1.6,.18,.6,mStein,(a+b)/2,.09,.45*aus,g);}});
    if(typ==='fachwerk'&&hgt>sockel+.3){const k=Math.round(len/1.05);
      for(let i=0;i<=k;i++){const px=i*len/k;if(loecher.some(l=>px>l[0]-.05&&px<l[1]+.05))continue;box(.16,hgt-sockel,WT+.04,mHolz,px,sockel+(hgt-sockel)/2,0,g);}
      box(len,.16,WT+.04,mHolz,len/2,sockel+.08,0,g);if(hgt>=WH-.01)box(len,.18,WT+.05,mHolz,len/2,hgt-.09,0,g);
      if(hgt>=WH-.01)for(let i=0;i<k;i+=2){const x0=i*len/k,x1=(i+1)*len/k;if(loecher.some(l=>x1>l[0]&&x0<l[1]))continue;
        const st=box(Math.hypot(x1-x0,hgt-sockel-.3),.12,WT+.03,mHolz,(x0+x1)/2,sockel+(hgt-sockel)/2,0,g);st.rotation.z=Math.atan2(hgt-sockel-.3,x1-x0)*(i%4?1:-1);}}
    if(typ==='stein'&&hgt>=WH-.01)box(len,.12,WT+.1,mStein,len/2,hgt-.06,0,g);
  }
  // innen: die beiden Wände zur Kamera hin niedrig (1,1 m), abhängig von der Drehung der Ansicht
  const niedrig=innen?[['vorn','rechts'],['rechts','hinten'],['hinten','links'],['links','vorn']][drehung&3]:[],hw=s=>niedrig.includes(s)?1.1:WH;
  wand('hinten',HX,0,0,'x',hw('hinten'));wand('links',HZ,0,0,'z',hw('links'));wand('vorn',HX,0,HZ,'x',hw('vorn'));wand('rechts',HZ,HX,0,'z',hw('rechts'));
  [[0,0,'hinten','links'],[HX,0,'hinten','rechts'],[0,HZ,'links','vorn'],[HX,HZ,'vorn','rechts']].forEach(([x,z,s1,s2])=>{const h=niedrig.includes(s1)||niedrig.includes(s2)?1.15:WH+.05;
    if(typ==='holz')box(.3,h,.3,mHolz,x,h/2,z);else uv(box(.42,h,.42,mStein,x,h/2,z),[.3,h/2.3]);});
  uv(box(HX,.12,HZ,M({map:tx.dielen}),HX/2,.06,HZ/2),[B/2,D/2]);

  // Dach (First entlang x oder z), Giebel, Schornstein
  const kamin=(spec.einrichtung||[]).find(e=>e.art==='kamin'&&e.x>=0&&e.x<B&&e.z>=0&&e.z<D);
  if(!innen){const g=new THREE.Group();haus.add(g);const lx=spec.first==='z'?HZ:HX,sp=spec.first==='z'?HX:HZ;g.position.set(HX/2,WH,HZ/2);if(spec.first==='z')g.rotation.y=PI/2;
    const art=['schiefer','reet','schindeln'].includes(spec.dach)?spec.dach:'schiefer',reet=art==='reet';
    const ov=reet?.7:.5,rh=sp*(reet?.45:.31),L=lx+2*ov,half=sp/2+ov,sl=Math.hypot(half,rh),dk=reet?.4:.14;
    for(const s of[-1,1]){const geo=new THREE.BoxGeometry(L,dk,sl,30,1,14),pa=geo.attributes.position;
      for(let i=0;i<pa.count;i++){const u=pa.getX(i)/L+.5,w=pa.getZ(i)/sl+.5;pa.setY(i,pa.getY(i)-(.06+.22*v)*Math.sin(PI*u)*Math.sin(PI*Math.min(1,w*1.2))+(rnd()-.5)*.04*v);}
      geo.computeVertexNormals();const p=new THREE.Mesh(geo,mt(tx[art],L/3,sl/3,{roughness:reet?1:.7}));p.position.set(0,rh/2+(reet?.1:0),s*half/2);p.rotation.x=s*Math.atan2(rh,half);p.castShadow=p.receiveShadow=true;g.add(p);
      if(s>0&&v>.5&&!reet){for(const[du,dw,ww,dd,ry]of[[.18,.55,1.3,1.0,.12],[.21,.5,.9,.7,-.2]]){const pt=box(ww,.05,dd,mHolz,lx*du,rh*(1-dw)+.02,half*dw,g);pt.rotation.x=Math.atan2(rh,half);pt.rotation.y=ry;}}}
    if(!reet){const r=box(L+.1,.22,.3,mHolz,0,rh-.12+(1-v)*.05,0,g);r.rotation.z=.015*v;}else{const r=cyl(.28,.28,L,mt(tx.reet,L/3,1,{roughness:1}),0,rh+.12,0,g,10);r.rotation.z=PI/2;}
    const mG=typ==='fachwerk'?mPutz:typ==='holz'?mHolz:mStein;
    for(const x of[-lx/2,lx/2]){const shp=new THREE.Shape();shp.moveTo(-sp/2,0);shp.lineTo(sp/2,0);shp.lineTo(0,rh);shp.lineTo(-sp/2,0);
      const gm=new THREE.Mesh(new THREE.ShapeGeometry(shp),mG);gm.position.set(x+(x>0?.001:-.001),0,0);gm.rotation.y=x>0?PI/2:-PI/2;gm.castShadow=true;g.add(gm);
      if(typ==='fachwerk'){const b1=box(.14,.14,Math.hypot(sp/2,rh)+.2,mHolz,x,rh/2,-sp/4,g);b1.rotation.x=-Math.atan2(rh,sp/2);
        const b2=box(.14,.14,Math.hypot(sp/2,rh)+.2,mHolz,x,rh/2,sp/4,g);b2.rotation.x=Math.atan2(rh,sp/2);box(.14,rh,.14,mHolz,x,rh/2,0,g);}}
    if(spec.schornstein){let cx=1.2,cz=1.4;if(kamin){const d=kamin.dreh&3,o=T/2-.55;cx=(kamin.x+.5)*T+(d===1?-o:d===3?o:0);cz=(kamin.z+.5)*T+(d===0?-o:d===2?o:0);}
      const hc=rh+1.4;uv(box(.8,hc,.8,mStein,cx,WH+hc/2,cz),[.5,hc/2]);box(.95,.15,.95,mStein,cx,WH+hc,cz).rotation.z=.06*v;if(v>.5)box(.3,.25,.3,mStein,cx+.15,WH+hc+.15,cz-.15).rotation.y=.4;}}

  // Einrichtung: jedes Teil im eigenen Feld, Rückseite bei dreh 0 zur hinteren Wand (−z)
  const B2=T/2,hinten=-B2+WT/2+.02;
  const TEILE={
    bett(f){box(1.2,.45,2.0,mHolz,0,.33,hinten+1.05,f);box(1.08,.2,1.85,mStoff,0,.62,hinten+1.1,f);box(.8,.16,.4,mLeinen,0,.76,hinten+.35,f);box(1.3,1.0,.12,mHolz,0,.6,hinten+.06,f);
      if(v>.3){const d=box(1.0,.12,1.1,mStoff,.05,.78,hinten+1.25,f);d.rotation.set(.12,.3,-.08);}},
    truhe(f){const z=hinten+.3;box(1.0,.55,.55,mHolz,0,.35,z,f);for(const x of[-.35,.35])box(.06,.57,.58,mEisen,x,.35,z,f);
      const l=new THREE.Mesh(new THREE.CylinderGeometry(.28,.28,1.0,12,1,false,0,PI),mHolz);l.rotation.z=PI/2;l.position.set(0,.62,z);l.castShadow=true;f.add(l);box(.12,.14,.06,mMessing,0,.55,z+.29,f);},
    schrank(f){const z=hinten+.3;box(1.3,2.2,.6,mHolz,0,1.15,z,f);box(.04,1.9,.04,M({color:0x2a1a0e}),0,1.2,z+.31,f);for(const x of[-.15,.15])box(.05,.12,.05,mEisen,x,1.2,z+.33,f);box(1.4,.12,.66,mHolz,0,2.28,z,f);},
    regal(f){const z=hinten+.2;for(const y of[.1,.75,1.4,2.05])box(1.2,.06,.38,mHolz,0,y,z,f);for(const x of[-.58,.58])box(.06,2.1,.38,mHolz,x,1.05,z,f);
      const c=[0x6a2a20,0x2a4a6a,0x3a5a2a,0x7a6a3a,0x4a2a4a,0x8a4a20];let k=0;
      for(const y of[.13,.78,1.43])for(let x=-.5;x<.45;x+=.1+rnd()*.04){if(rnd()<.15+.2*v)continue;const hb=.32+rnd()*.14;box(.08,hb,.26,mBuch(c[k++%6]),x,y+hb/2+.03,z,f).rotation.z=rnd()<.1*v?.3:0;}},
    kamin(f){uv(box(1.8,1.5,.7,mStein,0,.75,hinten+.35,f),[1,.8]);box(1.0,.8,.1,M({color:0x14100c}),0,.5,hinten+.71,f);
      box(.5,.12,.14,mHolz,-.1,.18,hinten+.85,f).rotation.y=.4;box(.5,.12,.14,mHolz,.1,.2,hinten+.85,f).rotation.y=-.5;
      const a=new THREE.Mesh(new THREE.ConeGeometry(.18,.5,8),mFeuer);a.position.set(0,.4,hinten+.85);f.add(a);
      const b=new THREE.Mesh(new THREE.ConeGeometry(.11,.34,8),new THREE.MeshBasicMaterial({color:0xffe080}));b.position.set(.02,.36,hinten+.87);f.add(b);
      const l=new THREE.PointLight(0xff9a40,2.2,7,1.6);l.position.set(0,.7,hinten+1.3);f.add(l);
      box(2.0,.08,.6,mHolz,0,1.55,hinten+.3,f);cyl(.07,.06,.22,mMessing,-.6,1.7,hinten+.3,f);cyl(.06,.05,.18,mTon,.6,1.68,hinten+.3,f);},
    wandbrett(f){const z=hinten+.12;box(1.2,.05,.25,mHolz,0,1.55,z,f);for(let i=0;i<4;i++){const p=cyl(.12,.12,.02,mTeller,-.4+i*.27,1.7,z-.02,f,16);p.rotation.x=PI/2.4;}cyl(.05,.05,.12,M({color:0x6a7a8a}),.45,1.64,z+.03,f);},
    waffen(f){const z=hinten+.04;box(.08,1.0,.03,M({color:0xb8bcc0,metalness:.8,roughness:.3}),-.3,1.9,z,f);box(.3,.05,.05,mMessing,-.3,1.45,z,f);
      const s=cyl(.38,.38,.05,mHolz,.3,1.8,z,f,20);s.rotation.x=PI/2;const b=cyl(.1,.1,.06,mEisen,.3,1.8,z+.04,f,12);b.rotation.x=PI/2;},
    tisch(f){box(2.0,.1,1.0,mHolz,0,.8,0,f);for(const[x,z]of[[-.85,-.4],[.85,-.4],[-.85,.4],[.85,.4]])box(.1,.78,.1,mHolz,x,.4,z,f);
      for(const z of[-.85,.85]){box(1.8,.08,.35,mHolz,0,.45,z,f);for(const x of[-.75,.75])box(.08,.42,.3,mHolz,x,.22,z,f);}
      cyl(.22,.18,.04,mTeller,-.5,.87,-.15,f);kugel(.15,mBrot,-.5,.95,-.15,f,1.4,.6,1);cyl(.06,.05,.16,mTon,.1,.93,.2,f);cyl(.06,.05,.16,mTon,.35,.93,-.25,f);
      cyl(.06,.07,.05,mMessing,.7,.88,.1,f);cyl(.03,.03,.22,mWachs,.7,1.01,.1,f);const fl=new THREE.Mesh(new THREE.ConeGeometry(.025,.07,6),new THREE.MeshBasicMaterial({color:0xffd070}));fl.position.set(.7,1.16,.1);f.add(fl);
      const l=new THREE.PointLight(0xffc070,.9,4,1.8);l.position.set(.7,1.3,.1);f.add(l);for(const[x,z]of[[.2,-.3],[.3,-.18]])kugel(.06,mApfel,x,.91,z,f);},
    teppich(f){const r=new THREE.Mesh(new THREE.PlaneGeometry(2.6,1.8),M({map:tx.teppich,roughness:1}));r.rotation.x=-PI/2;r.position.set(0,.125,0);r.receiveShadow=true;f.add(r);},
    faesser(f){for(const[x,z]of[[-.4,-.35],[.4,-.3]]){cyl(.36,.36,.9,mHolz,x,.57,z,f,16);for(const y of[.25,.85])cyl(.38,.38,.06,mEisen,x,y,z,f,16);}},
    kiste(f){box(.7,.6,.7,mHolz,0,.42,0,f).rotation.y=.2;box(.72,.06,.72,mHolz,0,.72,0,f).rotation.y=.2;},
    saecke(f){for(const[x,z,r]of[[-.3,-.2,.3],[.35,.1,.26]]){kugel(r,mSack,x,r*1.05+.1,z,f,1,1.15,1);const t=new THREE.Mesh(new THREE.ConeGeometry(r*.35,r*.6,8),M({color:0x7a6040,roughness:1}));t.position.set(x,r*2.3+.12,z);f.add(t);}},
    hocker(f){cyl(.2,.2,.04,mHolz,0,.5,0,f);for(const a of[0,2.1,4.2])cyl(.025,.025,.48,mHolz,Math.cos(a)*.13,.25,Math.sin(a)*.13,f,6);},
    kessel(f){const k=new THREE.Mesh(new THREE.SphereGeometry(.2,14,10,0,PI*2,PI/3,PI*2/3),mEisen);k.position.set(.6,.42,hinten+.95);k.castShadow=true;f.add(k);},
    stuhl(f){const c=new THREE.Group();c.position.set(0,.36,0);c.rotation.set(0,.7,PI/2.1);f.add(c);box(.45,.06,.45,mHolz,0,0,0,c);for(const[x,z]of[[-.18,-.18],[.18,-.18],[-.18,.18]])box(.05,.45,.05,mHolz,x,-.24,z,c);box(.45,.5,.05,mHolz,0,.25,-.2,c);},
    besen(f){const b=cyl(.02,.02,1.4,mHolz,0,.75,hinten+.15,f,6);b.rotation.x=-.25;cyl(.03,.14,.3,M({color:0xa08a50,roughness:1}),0,.15,hinten+.3,f,10);},
    brennholz(f){for(let r=0;r<3;r++)for(let i=0;i<5-r;i++){const l=cyl(.11,.11,1.1,mHolz,-.45+i*.23+r*.11,.12+r*.2,hinten+.65,f,8);l.rotation.x=PI/2;}}};
  (spec.einrichtung||[]).forEach(e=>{const fn=TEILE[e.art];if(!fn)return;const drin=e.x>=0&&e.x<B&&e.z>=0&&e.z<D;if(innen!==drin&&drin)return;
    const f=new THREE.Group();f.position.set((e.x+.5)*T,drin?.12:0,(e.z+.5)*T);f.rotation.y=(e.dreh&3)*PI/2;haus.add(f);fn(f);});

  // Verwitterung: Stroh, Ruß, Spinnweben, Putzbrocken innen; Unkraut und Dreck außen
  if(innen){for(let i=0;i<140*v;i++){const s=box(.22+rnd()*.25,.012,.025,mStroh[rnd()<.5?0:1],.3+rnd()*(HX-.6),.13,.3+rnd()*(HZ-.6),haus,rnd()*3);s.castShadow=false;}
    for(const[x,z,w,d]of[[HX/2,.35,HX,.5],[.35,HZ/2,.5,HZ]]){const p=new THREE.Mesh(new THREE.PlaneGeometry(w,d),mRuss);p.material.opacity=.15+.25*v;p.rotation.x=-PI/2;p.position.set(x,.125,z);haus.add(p);}
    if(v>.3)for(const[x,z,ry]of[[.16,.16,PI/4],[HX-.16,.16,-PI/4]]){const w=new THREE.Mesh(new THREE.CircleGeometry(.6,8,0,PI/2),mNetz);w.position.set(x,WH-.05,z);w.rotation.set(PI,ry+PI*.75,0);haus.add(w);}
    if(v>.5)for(let i=0;i<8*v;i++)box(.08+rnd()*.12,.05,.06+rnd()*.1,mPutz,.4+rnd()*(HX-.8),.14,.4+rnd()*(HZ-.8),haus,rnd()*3);}
  else{for(const k in oeff)if(oeff[k]==='tuer'){const[s,f]=k.split(':'),m=(+f+.5)*T;const p=s==='vorn'?[m,HZ+1.4]:s==='hinten'?[m,-1.4]:s==='links'?[-1.4,m]:[HX+1.4,m];
      const d=new THREE.Mesh(new THREE.CircleGeometry(2.0,24),M({color:0x3a2c1c,roughness:1,transparent:true,opacity:.4+.4*v}));d.rotation.x=-PI/2;d.scale.set(1.3,.8,1);d.position.set(p[0],.01,p[1]);d.receiveShadow=true;haus.add(d);}
    for(let i=0;i<180*v;i++){const s=rnd(),a=.2+rnd()*.35;let x,z;if(s<.3){x=rnd()*HX;z=HZ+a;}else if(s<.6){x=HX+a;z=rnd()*HZ;}else if(s<.8){x=-a;z=rnd()*HZ;}else{x=rnd()*HX;z=-a;}
      const c=new THREE.Mesh(new THREE.ConeGeometry(.05+rnd()*.07,.25+rnd()*.45,5),mUnkraut[rnd()<.5?0:1]);c.position.set(x,.15,z);c.rotation.set((rnd()-.5)*.5,0,(rnd()-.5)*.5);c.castShadow=true;haus.add(c);}}
  const wiese=new THREE.Mesh(new THREE.PlaneGeometry(120,120),mt(tx.wiese,18,18,{roughness:1}));wiese.rotation.x=-PI/2;wiese.receiveShadow=true;root.add(wiese);
  root.userData={HX,HZ,hoehe:innen?WH:WH+(spec.first==='z'?HX:HZ)*.45+1.5};
  return root;}

// ---------- Szene mit Spielkamera (45° seitlich, 30° von oben), Licht wie in der Werkstatt ----------
function Szene(canvas){
  const R=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true,preserveDrawingBuffer:true});
  R.outputEncoding=THREE.sRGBEncoding;R.shadowMap.enabled=true;R.shadowMap.type=THREE.PCFSoftShadowMap;
  const scene=new THREE.Scene(),cam=new THREE.OrthographicCamera(-1,1,1,-1,.1,300);
  const hemi=new THREE.HemisphereLight(0xfff3df,0x6a5844,.62);scene.add(hemi);
  const sun=new THREE.DirectionalLight(0xfff1dc,1.1);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.bias=-.0006;sun.shadow.radius=3;scene.add(sun);scene.add(sun.target);
  const fill=new THREE.DirectionalLight(0xd8e4ff,.22);fill.position.set(20,12,-8);scene.add(fill);
  let bau=null;
  return{renderer:R,
    // K = Pixel je Meter (46 entspricht den Werkstatt-Bildern; ein Feld im Spiel = K·2,1·√2·160/137 px); ohne K wird eingepasst
    zeige(spec,innen,drehung=0,K){if(bau){scene.remove(bau);bau.traverse(o=>{if(o.geometry)o.geometry.dispose();});}
      bau=Bau(spec,innen,drehung);bau.rotation.y=-drehung*PI/2;scene.add(bau);
      const{HX,HZ,hoehe}=bau.userData,w=R.domElement.width,h=R.domElement.height,dd=HX+HZ+2*T;
      const pw=dd*.7071,ph=dd*.3536+hoehe*.866;if(!K)K=Math.min(w/(pw*1.08),h/(ph*1.12));
      Object.assign(cam,{left:-w/2/K,right:w/2/K,top:h/2/K,bottom:-h/2/K});cam.updateProjectionMatrix();
      const ty=innen?1.0:hoehe*.42,el=PI/6,az=PI/4,d=80;cam.position.set(d*Math.cos(el)*Math.sin(az),ty+d*Math.sin(el),d*Math.cos(el)*Math.cos(az));cam.lookAt(0,ty,0);
      const s=Math.max(HX,HZ)*.9+4;sun.position.set(-8,30,14);Object.assign(sun.shadow.camera,{left:-s,right:s,top:s,bottom:-s,near:1,far:90});sun.shadow.camera.updateProjectionMatrix();
      hemi.intensity=innen?.5:.62;R.render(scene,cam);},
    groesse(spec,innen,K){const B=spec.breite*T,D=spec.tiefe*T,dd=B+D+2*T,ho=innen?WH:WH+(spec.first==='z'?B:D)*.45+1.5;return[Math.ceil(dd*.7071*K*1.08),Math.ceil((dd*.3536+ho*.866)*K*1.12)];}};
}
window.Hausbau={T,KATALOG,OEFFNUNGEN,BEISPIEL,Bau,Szene};
})();
