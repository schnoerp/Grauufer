// Avatar im Ziel-Stil A (seit Spiel-Rev 121): vorgerendert und gemalt wie Ultima VIII: Pagan in hoher Auflösung.
// Das Aussehen steht in einer Beschreibung (spec, siehe Avatar.STANDARD), die der Avatar-Baukasten (werkstatt/avatarbaukasten.html)
// erzeugt. Alle Stoffe und Muster werden hier im Code gezeichnet (CanvasTexture), keine Bilddateien.
// Maße in Metern, Kamera wie im Spiel: 2:1 isometrisch (Höhenwinkel 30°, Blick über die Felddiagonale), Licht von oben links.
// Avatar.Szene(canvas, opt) → { groesse(w, h, k, fuss), baue(spec), fest(mesh, massstab), boden(an), zeige(art, t, richtung), renderer }
//   art: 'idle' | 'walk' | 'attack' | 'death', t von 0 bis 1, richtung 0 bis 7
// Für die Werkstatt (render.js): window.avatar(opt) baut eine Szene mit der Startfigur, window.shot(art, t, richtung) liefert ein PNG.
(function(){
const STANDARD={name:'Startfigur',geschlecht:'m',groesse:1.8,statur:1,schultern:1,kopf:1,beine:1,arme:1,
  haut:'#c99068',haare:'glatze',haarfarbe:'#5a3a20',bart:'kein',augen:'#3a5068',
  kleidung:'karohemd',hemd:'#9a2e32',hose:'#1e1a1e',stiefel:'#4a301c',guertel:'#5a3a22',umhang:'#3e4e66',
  ruestung:'keine',waffe:'kurzschwert'};
const AUSWAHL={geschlecht:{m:'Mann',w:'Frau'},haare:{glatze:'Glatze',kurz:'Kurz',lang:'Lang',zopf:'Zopf'},bart:{kein:'Kein Bart',stoppeln:'Stoppeln',voll:'Vollbart'},
  kleidung:{karohemd:'Karohemd',hemd:'Hemd',tshirt:'T-Shirt',umhang:'Hemd mit Umhang'},ruestung:{keine:'Keine',lederwams:'Lederwams'},
  waffe:{keine:'Keine',kurzschwert:'Kurzschwert',axt:'Axt',stab:'Stab'}};

// ---------- gemalte Stofftexturen ----------
function tex(w,h,mal){const c=document.createElement('canvas');c.width=w;c.height=h;mal(c.getContext('2d'),w,h);
  const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.encoding=THREE.sRGBEncoding;t.anisotropy=4;return t;}
function rauschen(g,w,h,st,seed){let a=seed>>>0;const r=()=>{a=(a*1664525+1013904223)>>>0;return a/4294967296;};
  const d=g.getImageData(0,0,w,h);for(let i=0;i<d.data.length;i+=4){const v=(r()-.5)*st;d.data[i]+=v;d.data[i+1]+=v;d.data[i+2]+=v;}g.putImageData(d,0,0);}
function karo(farbe){return tex(256,256,(g,w,h)=>{
  const dk='rgba(28,8,10,.62)',hl='rgba(240,200,170,.28)';g.fillStyle=farbe;g.fillRect(0,0,w,h);
  for(const o of[0,128]){g.fillStyle=dk;g.fillRect(o+20,0,52,h);g.fillRect(0,o+20,w,52);}
  for(const o of[0,128]){g.fillStyle='rgba(20,6,8,.5)';g.fillRect(o+20,o+20,52,52);g.fillStyle=hl;g.fillRect(o+98,0,4,h);g.fillRect(0,o+98,w,4);}
  g.globalAlpha=.045;for(let y=0;y<h;y+=2){g.fillStyle=y%4?'#000':'#fff';g.fillRect(0,y,w,1);}g.globalAlpha=1;rauschen(g,w,h,26,7);});}
function koernung(farbe,st,seed){return tex(128,128,(g,w,h)=>{g.fillStyle=farbe;g.fillRect(0,0,w,h);rauschen(g,w,h,st,seed);});}
function nachDunkel(hex,f){const c=new THREE.Color(hex);c.multiplyScalar(f);return'#'+c.getHexString();}

function M(o){return new THREE.MeshStandardMaterial(Object.assign({roughness:.85,metalness:0},o));}
function mesh(g,m,p,x=0,y=0,z=0){const o=new THREE.Mesh(g,m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;p.add(o);return o;}
function J(p,x=0,y=0,z=0){const g=new THREE.Group();g.position.set(x,y,z);p.add(g);return g;}
// Glied als Kapsel zwischen Gelenk (oben) und lokalem -y
function glied(p,len,r0,r1,m){const o=mesh(new THREE.CylinderGeometry(r1,r0,len,16,1),m,p,0,-len/2,0);
  mesh(new THREE.SphereGeometry(r0,16,10),m,p);mesh(new THREE.SphereGeometry(r1,16,10),m,p,0,-len,0);return o;}
// Drehkörper aus Profil [Radius, Höhe] (Rumpf, Wams)
function dreh(p,profil,m,sx=1,sz=1,y=0){const o=mesh(new THREE.LatheGeometry(profil.map(([r,h])=>new THREE.Vector2(r,h)),32),m,p,0,y,0);o.scale.set(sx,1,sz);return o;}
// Kanten einer Box abrunden: Ecken zur Mitte ziehen (weiche, gemalte Formen statt harter Klötze)
function rund(g,r){const p=g.attributes.position,v=new THREE.Vector3();g.computeBoundingBox();const h=new THREE.Vector3();g.boundingBox.getSize(h);h.multiplyScalar(.5);
  for(let i=0;i<p.count;i++){v.fromBufferAttribute(p,i);const q=new THREE.Vector3(Math.max(-h.x+r,Math.min(h.x-r,v.x)),Math.max(-h.y+r,Math.min(h.y-r,v.y)),Math.max(-h.z+r,Math.min(h.z-r,v.z)));
    const d=v.clone().sub(q);if(d.length()>0)d.setLength(Math.min(r,d.length()));p.setXYZ(i,q.x+d.x,q.y+d.y,q.z+d.z);}
  p.needsUpdate=true;g.computeVertexNormals();return g;}
const rundeBox=(w,h,d,r)=>rund(new THREE.BoxGeometry(w,h,d,2,2,2),r);

// ---------- Figur aus der Beschreibung bauen ----------
function figur(sp){
  const L=Object.assign({},STANDARD,sp||{}),frau=L.geschlecht==='w',st=+L.statur||1,sch=(+L.schultern||1)*(frau?.9:1),bn=+L.beine||1,ar=+L.arme||1;
  const hemdFarbe=L.kleidung==='tshirt'&&L.hemd===STANDARD.hemd?'#e6e2da':L.hemd;
  const skin=M({map:koernung(L.haut,12,3),roughness:.68}),skinD=M({color:nachDunkel(L.haut,.78),roughness:.75}),
    shirt=L.kleidung==='karohemd'?M({map:karo(L.hemd),roughness:.95}):M({map:koernung(hemdFarbe,16,4),roughness:.95}),
    hose=M({map:koernung(L.hose,20,5),roughness:.95}),stiefel=M({map:koernung(L.stiefel,24,9),roughness:.55}),leder=M({map:koernung(L.guertel,22,11),roughness:.6}),
    haar=M({map:koernung(L.haarfarbe,40,17),roughness:.8}),messing=M({color:0xc89a3c,roughness:.32,metalness:.85}),stahl=M({color:0xc4c8cc,roughness:.22,metalness:.9}),
    holz=M({map:koernung('#6a4628',30,21),roughness:.8}),dunkel=M({color:0x1a120c,roughness:.6}),auge=M({color:0xcfc4b2,roughness:.4}),iris=M({color:L.augen,roughness:.3});
  const F={},root=new THREE.Group();F.root=root;root.scale.setScalar((+L.groesse||1.8)/1.8);
  F.BY=.1+.86*bn;const body=F.body=J(root,0,F.BY,0);
  // Becken und Gürtel (Frauen mit breiterer Hüfte)
  const hb=st*(frau?1.1:1);
  const becken=mesh(new THREE.SphereGeometry(.17,24,14),hose,body,0,-.02,0);becken.scale.set(hb,.62,.72*st);
  const guertel=mesh(new THREE.CylinderGeometry(.165,.17,.06,28,1,true),leder,body,0,.06,0);guertel.scale.set(hb*.98,1,.74*st);
  mesh(new THREE.BoxGeometry(.07,.055,.02),messing,body,0,.06,.128*st);
  const tasche=mesh(new THREE.BoxGeometry(.08,.1,.05),leder,body,.15*hb,-.01,.04);tasche.rotation.y=.5;
  // Rumpf als Drehkörper (Taille schmal, Brust breit), Frauen mit schmalerer Taille
  const spine=F.spine=J(body,0,.08,0),rx=st*(frau?.95:1)*Math.max(.85,sch);
  const prof=frau?[[.0,-.04],[.17,-.04],[.172,.02],[.148,.12],[.16,.22],[.18,.29],[.18,.35],[.15,.43],[.08,.47],[.0,.48]]
    :[[.0,-.04],[.165,-.04],[.172,.02],[.162,.12],[.178,.24],[.198,.33],[.2,.38],[.16,.44],[.08,.475],[.0,.48]];
  dreh(spine,prof,shirt,rx,.64*st);
  if(frau)for(const s of[-1,1]){const b=mesh(new THREE.SphereGeometry(.062,16,12),shirt,spine,s*.07*st,.285,.045*st);b.scale.set(1.05,.85,.6);}
  const chest=F.chest=J(spine,0,.4,0);
  // Schultern: Deltamuskel unter dem Hemd verbindet Rumpf und Arm
  for(const s of[-1,1]){const d=mesh(new THREE.SphereGeometry(.072*Math.sqrt(st),20,14),shirt,chest,s*.175*sch,-.025,0);d.scale.set(1,.82,.95);}
  const kr=mesh(new THREE.TorusGeometry(.068,.02,8,20),shirt,chest,0,.07,0);kr.rotation.x=Math.PI/2-.25;
  // Lederwams über dem Hemd
  if(L.ruestung==='lederwams'){const w=M({map:koernung(nachDunkel(L.guertel,1.15),26,23),roughness:.55});
    dreh(spine,(frau?[[.0,.0],[.178,.0],[.156,.12],[.168,.22],[.19,.3],[.188,.36],[.158,.43],[.085,.47],[.0,.475]]:[[.0,.0],[.178,.0],[.17,.12],[.186,.24],[.206,.33],[.207,.38],[.166,.44],[.085,.475],[.0,.48]]),w,rx,.67*st);
    for(const s of[-1,1]){const p=mesh(new THREE.SphereGeometry(.07,16,10,0,Math.PI*2,0,Math.PI/2),w,chest,s*.18*sch,-.01,0);p.scale.set(1,.6,.95);p.rotation.z=-s*.35;}
    for(let i=0;i<4;i++)mesh(new THREE.SphereGeometry(.009,8,6),messing,spine,0,.12+i*.07,.135*st);}
  // Umhang: an den Schultern befestigt, fällt bis zu den Kniekehlen
  if(L.kleidung==='umhang'){const um=M({map:koernung(L.umhang,22,27),roughness:.92,side:THREE.DoubleSide});
    const o=mesh(new THREE.CylinderGeometry(.2*sch,.33,1.05,24,6,true,Math.PI*.62,Math.PI*1.76),um,chest,0,-.5,-.02);o.scale.set(st,1,.62*st);
    mesh(new THREE.TorusGeometry(.03,.008,6,12),messing,chest,-.11*sch,.04,.1*st);}
  // Hals und Kopf
  const neck=J(chest,0,.08,0);glied(neck,.06,.052,.05,skin);
  const head=F.head=J(neck,0,.06,0);head.scale.setScalar((+L.kopf||1)*(frau?.95:1));
  const sch0=mesh(new THREE.SphereGeometry(.105,32,24),skin,head,0,.13,-.005);sch0.scale.set(.9,1.04,1.02);
  const kiefer=mesh(new THREE.SphereGeometry(.085,24,16),skin,head,0,.065,.025);kiefer.scale.set(frau?.84:.92,frau?.86:.9,.95);
  const kinn=mesh(new THREE.SphereGeometry(.035,12,8),skin,head,0,.03,.075);kinn.scale.set(frau?.95:1.2,.9,.9);
  const braue=M({color:nachDunkel(L.haarfarbe,.8),roughness:.9});
  for(const s of[-1,1]){const o=mesh(new THREE.SphereGeometry(.026,10,8),skinD,head,s*.094,.11,-.01);o.scale.set(.45,1,.8);
    mesh(new THREE.SphereGeometry(.011,10,8),auge,head,s*.035,.125,.089);mesh(new THREE.SphereGeometry(.0075,8,6),iris,head,s*.035,.125,.098);
    const br=mesh(new THREE.BoxGeometry(.042,frau?.008:.013,.016),braue,head,s*.036,.145,.095);br.rotation.z=s*-.15;}
  const nase=mesh(new THREE.ConeGeometry(frau?.014:.017,frau?.042:.05,8),skin,head,0,.105,.104);nase.rotation.x=Math.PI/2+.5;
  mesh(new THREE.BoxGeometry(.04,.006,.01),M({color:frau?0x9a4a40:0x7a3c30}),head,0,.068,.098);
  // Haare
  if(L.haare!=='glatze'){const k=mesh(new THREE.SphereGeometry(.112,32,20,0,Math.PI*2,0,Math.PI*.56),haar,head,0,.135,-.012);k.scale.set(.93,1.04,1.04);k.rotation.x=-.32;
    if(L.haare==='lang'){const r=mesh(rundeBox(.2,.26,.07,.03),haar,head,0,.02,-.075);r.rotation.x=.12;
      for(const s of[-1,1]){const st2=mesh(rundeBox(.05,.2,.08,.024),haar,head,s*.088,.05,-.02);st2.rotation.z=s*.06;}}
    if(L.haare==='zopf')for(let i=0;i<6;i++)mesh(new THREE.SphereGeometry(.032-i*.003,12,8),haar,head,0,.1-i*.045,-.115-i*.008);}
  if(L.bart==='stoppeln'){const b=mesh(new THREE.SphereGeometry(.088,24,16,0,Math.PI*2,Math.PI*.42,Math.PI*.58),M({color:L.haarfarbe,roughness:.95,transparent:true,opacity:.42}),head,0,.07,.027);b.scale.set(.94,.92,.97);}
  if(L.bart==='voll'){const b=mesh(new THREE.SphereGeometry(.092,24,16,0,Math.PI*2,Math.PI*.4,Math.PI*.6),haar,head,0,.068,.03);b.scale.set(.95,1.05,1);
    mesh(new THREE.SphereGeometry(.04,12,8),haar,head,0,.02,.08).scale.set(1.2,1.2,.9);}
  // Arme: Ärmel bis zum Ellbogen hochgekrempelt (T-Shirt: kurz), Unterarm Haut, Hände
  const kurz=L.kleidung==='tshirt',ra=Math.sqrt(st);
  function arm(s){const sh=J(chest,s*.19*sch,-.03,0);
    if(kurz){glied(sh,.12*ar,.052*ra,.05*ra,shirt);const u=J(sh,0,-.12*ar,0);glied(u,.15*ar,.045*ra,.044*ra,skin);}
    else{glied(sh,.26*ar,.05*ra,.047*ra,shirt);const kp=mesh(new THREE.TorusGeometry(.049*ra,.016,8,18),shirt,sh,0,-.24*ar,0);kp.rotation.x=Math.PI/2;}
    const el=J(sh,0,-.27*ar,0);glied(el,.25*ar,.045*ra,.032*ra,skin);
    const ha=J(el,0,-.27*ar,0);mesh(rundeBox(.05,.085,.075,.025),skin,ha,0,-.03,.005);
    mesh(new THREE.CapsuleGeometry(.014,.03,4,8),skin,ha,0,-.02,.045).rotation.x=.6;return{sh,el,ha};}
  F.aR=arm(-1);F.aL=arm(1);
  // Waffe in der rechten Hand
  const w=J(F.aR.ha,0,-.04,.01);w.rotation.x=L.waffe==='stab'?1:-1.05;
  if(L.waffe==='kurzschwert'){mesh(new THREE.CylinderGeometry(.017,.017,.1,10),leder,w);mesh(new THREE.SphereGeometry(.024,12,8),messing,w,0,.06,0);
    mesh(new THREE.BoxGeometry(.15,.022,.035),messing,w,0,-.06,0);mesh(new THREE.BoxGeometry(.05,.5,.008),stahl,w,0,-.32,0);
    mesh(new THREE.ConeGeometry(.025,.07,4),stahl,w,0,-.6,0).rotation.set(Math.PI,Math.PI/4,0);
    mesh(new THREE.BoxGeometry(.012,.44,.01),M({color:0x8a9096,roughness:.3,metalness:.8}),w,0,-.3,.002);}
  if(L.waffe==='axt'){mesh(new THREE.CylinderGeometry(.018,.02,.62,10),holz,w,0,-.22,0);
    mesh(rundeBox(.03,.1,.14,.01),stahl,w,0,-.48,.06);mesh(new THREE.BoxGeometry(.01,.14,.05),stahl,w,0,-.48,.14);}
  if(L.waffe==='stab'){mesh(new THREE.CylinderGeometry(.024,.02,1.5,10),holz,w,0,-.12,0);
    mesh(new THREE.SphereGeometry(.04,14,10),M({color:0x7fc8c0,roughness:.2,emissive:0x2a6a64,emissiveIntensity:.6}),w,0,.65,0);}
  // Beine: Hose, Stiefel mit Stulpe
  const rb=Math.sqrt(st);
  function bein(s){const hp=J(body,s*.09*hb,-.04,0);glied(hp,.44*bn,.086*rb,.066*rb,hose);const kn=J(hp,0,-.44*bn,0);glied(kn,.27*bn,.064*rb,.054*rb,hose);
    mesh(new THREE.CylinderGeometry(.06*rb,.055*rb,.2*bn,16),stiefel,kn,0,-.32*bn,0);mesh(new THREE.CylinderGeometry(.068*rb,.064*rb,.05,16),stiefel,kn,0,-.23*bn,0);
    const an=J(kn,0,-.42*bn,0);mesh(rundeBox(.09,.06,.2,.035),stiefel,an,0,-.02,.04);
    mesh(new THREE.BoxGeometry(.095,.018,.21),dunkel,an,0,-.05,.04);return{hp,kn,an};}
  F.lR=bein(-1);F.lL=bein(1);
  return F;
}

function pose(F,art,t,dir){
  const{root,body,spine,chest,head,aR,aL,lR,lL,BY}=F;
  root.rotation.y=Math.PI/4+dir*Math.PI/4;
  body.position.y=BY;body.rotation.set(0,0,0);spine.rotation.set(.04,0,0);chest.rotation.set(0,0,0);head.rotation.set(-.04,0,0);
  for(const l of[lR,lL]){l.hp.rotation.set(0,0,0);l.kn.rotation.set(0,0,0);l.an.rotation.set(0,0,0);}
  aR.sh.rotation.set(-.25,0,.1);aR.el.rotation.set(-.75,0,0);aR.ha.rotation.set(0,0,0);
  aL.sh.rotation.set(.05,0,-.12);aL.el.rotation.set(-.25,0,0);aL.ha.rotation.set(0,0,0);
  lR.hp.rotation.set(-.04,0,.03);lL.hp.rotation.set(.04,0,-.03);lR.kn.rotation.x=.06;lL.kn.rotation.x=.06;
  if(art==='idle'){body.position.y=BY+Math.sin(t*Math.PI*2)*.006;chest.rotation.x=Math.sin(t*Math.PI*2)*.02;}
  else if(art==='walk'){const p=t*Math.PI*2,s=Math.sin(p),c=Math.cos(p);
    lR.hp.rotation.x=-.5*s;lL.hp.rotation.x=.5*s;
    lR.kn.rotation.x=.1+.85*Math.max(0,c)*Math.max(0,s+.3);lL.kn.rotation.x=.1+.85*Math.max(0,-c)*Math.max(0,-s+.3);
    lR.an.rotation.x=.2*s;lL.an.rotation.x=-.2*s;
    body.position.y=BY-.005+.025*Math.abs(c);body.rotation.y=.1*s;spine.rotation.y=-.14*s;
    aR.sh.rotation.x=-.25+.3*s;aL.sh.rotation.x=.05-.45*s;aL.el.rotation.x=-.25-.25*Math.max(0,-s);}
  else if(art==='attack'){
    const KF=[[-.25,.1,-.75,0,0,0],[-1.5,.45,-1.4,.5,.35,.08],[-2.75,.55,-1.0,.9,.5,.1],[-1.25,.05,-.15,.15,-.35,-.06],[-.55,-.1,-.25,.35,-.55,-.1],[-.35,.1,-.6,.1,-.2,0]];
    const k=KF[Math.min(5,Math.round(t*5))];aR.sh.rotation.set(k[0],0,k[1]);aR.el.rotation.x=k[2];aR.ha.rotation.x=k[3];spine.rotation.y=k[4];spine.rotation.x=.04+k[5];
    lR.hp.rotation.x=-.4;lR.kn.rotation.x=.4;lL.hp.rotation.x=.35;lL.kn.rotation.x=.2;body.position.y=BY-.04;aL.sh.rotation.set(-.5,0,-.4);aL.el.rotation.x=-.9;}
  else if(art==='death'){const k=Math.min(1,t*1.2);
    body.position.y=BY-.8*k*(BY/.96);body.rotation.x=-1.3*k*k;head.rotation.x=.45*k;
    lR.kn.rotation.x=.1+1.5*Math.min(1,k*2)*(1-k*.6);lL.kn.rotation.x=.1+1.3*Math.min(1,k*2)*(1-k*.6);
    lR.hp.rotation.x=-1.0*Math.min(1,k*2)*(1-k*.7);lL.hp.rotation.x=-.8*Math.min(1,k*2)*(1-k*.7);
    aR.sh.rotation.x=-.25-1.4*k;aL.sh.rotation.x=-1.6*k;}
}

// ---------- Szene: Kamera wie im Spiel, warmes Licht von oben links, kühle Kante ----------
function Szene(canvas,opt={}){
  const R=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true,preserveDrawingBuffer:true});
  R.setPixelRatio(1);R.outputEncoding=THREE.sRGBEncoding;R.toneMapping=THREE.ACESFilmicToneMapping;R.toneMappingExposure=.92;
  R.shadowMap.enabled=true;R.shadowMap.type=THREE.PCFSoftShadowMap;
  const scene=new THREE.Scene(),cam=new THREE.OrthographicCamera(-1,1,1,-1,.1,100);
  const el=Math.PI/6,az=Math.PI/4,d=20;cam.position.set(d*Math.cos(el)*Math.sin(az),d*Math.sin(el),d*Math.cos(el)*Math.cos(az));cam.lookAt(0,0,0);
  const himmel=new THREE.HemisphereLight(0xc8d0de,0x3a2c20,.42);scene.add(himmel);
  const sonne=new THREE.DirectionalLight(0xffdcae,2.5);sonne.position.set(-3,7,4.5);sonne.castShadow=true;
  sonne.shadow.mapSize.set(2048,2048);Object.assign(sonne.shadow.camera,{left:-1.5,right:1.5,top:2.5,bottom:-.5,near:1,far:20});sonne.shadow.radius=3;sonne.shadow.bias=-.0006;scene.add(sonne);
  const kante=new THREE.DirectionalLight(0x9ab8ff,.9);kante.position.set(3,4,-5);scene.add(kante);
  const boden=new THREE.Mesh(new THREE.PlaneGeometry(6,6),new THREE.ShadowMaterial({opacity:.35}));boden.rotation.x=-Math.PI/2;boden.receiveShadow=true;scene.add(boden);
  let F=null;
  const s={renderer:R,
    // Bildgröße w × h, k Pixel je Meter, Fußpunkt fuss Pixel über dem unteren Rand
    groesse(w,h,k,fuss){R.setSize(w,h,false);const ox=w/2,oy=h-fuss;Object.assign(cam,{left:-ox/k,right:(w-ox)/k,top:oy/k,bottom:-(h-oy)/k});cam.updateProjectionMatrix();},
    baue(spec){weg();F=figur(spec);scene.add(F.root);},
    // fertige Figur ohne Gelenke zeigen (Formfeld-Probe, seit Spiel-Rev 123): nur Drehen, keine Bewegungen
    fest(obj,massstab=1){weg();const g=new THREE.Group();obj.scale.setScalar(massstab);g.add(obj);F={root:g,fest:true};scene.add(g);},
    boden(an){boden.visible=an;},
    // Lichtstimmung: 'tag' (Standard) oder 'nacht' (dunkel und kontrastreich, kalte Lichtkante, für leuchtende Zauber; seit Spiel-Rev 124)
    licht(art){const n=art==='nacht';himmel.intensity=n?.16:.42;sonne.intensity=n?1.45:2.5;sonne.color.set(n?0xffd2a0:0xffdcae);kante.intensity=n?2.4:.9;kante.color.set(n?0x7f9fff:0x9ab8ff);R.toneMappingExposure=n?.95:.92;},
    // Bildpunkt eines Weltpunkts (für Lichtscheine, die das Spiel später flackernd darüberzeichnet)
    projiziere(v){F.root.updateMatrixWorld(true);const q=v.clone().applyMatrix4(F.root.matrixWorld).project(cam),w=R.domElement.width,h=R.domElement.height;return[(q.x+1)/2*w,(1-q.y)/2*h];},
    zeige(art,t,dir){if(F.fest)F.root.rotation.y=Math.PI/4+dir*Math.PI/4;else pose(F,art,t,dir);R.render(scene,cam);}};
  function weg(){if(!F)return;scene.remove(F.root);if(!F.fest)F.root.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material){if(o.material.map)o.material.map.dispose();o.material.dispose();}});F=null;}
  s.groesse(opt.w||320,opt.h||560,opt.k||250,opt.fuss||40);if(opt.boden===false)boden.visible=false;
  return s;
}

window.Avatar={STANDARD,AUSWAHL,Szene};
let W=null;
window.avatar=(opt={})=>{const c=document.createElement('canvas');document.body.appendChild(c);W=Szene(c,opt);W.baue(opt.spec||STANDARD);};
window.shot=(art,t,dir)=>{W.zeige(art,t,dir);return W.renderer.domElement.toDataURL('image/png');};
})();
