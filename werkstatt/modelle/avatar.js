// Avatar als Probefigur im Ziel-Stil A (Spiel-Rev 121): vorgerendert und gemalt wie Ultima VIII: Pagan in hoher Auflösung.
// Startaussehen aus dem Spiel (DEFLOOK): Mann mit Glatze, rotes Karohemd mit hochgekrempelten Ärmeln, dunkle Hose, Lederstiefel,
// Gürtel mit Messingschnalle, Kurzschwert. Alle Stoffe und Muster werden hier im Code gezeichnet (CanvasTexture), keine Bilddateien.
// Maße in Metern (1,80 m groß), Kamera wie im Spiel: 2:1 isometrisch (Höhenwinkel 30°, Blick über die Felddiagonale).
// window.avatar(opt) baut die Szene: opt.w, opt.h (Bildgröße), opt.k (Pixel je Meter), opt.boden (Schatten am Boden zeigen).
// window.shot(art, t, richtung) liefert ein Bild als PNG-Daten-URL: art 'idle' | 'walk' | 'attack' | 'death', t von 0 bis 1, richtung 0 bis 7.
(function(){
let R,scene,cam,root,body,spine,chest,neck,head,aR,aL,lR,lL;
const LOOK={skin:0xc99068,shirt:'#9a2e32',legs:0x1e1a1e,boot:0x4a301c,leather:0x5a3a22,brass:0xc89a3c};

// gemalte Stofftexturen: Karomuster mit Webstruktur, Körnung für Haut, Leder und Hose
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
const hex=n=>'#'+n.toString(16).padStart(6,'0');

function M(o){return new THREE.MeshStandardMaterial(Object.assign({roughness:.85,metalness:0},o));}
function mesh(g,m,p,x=0,y=0,z=0){const o=new THREE.Mesh(g,m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;p.add(o);return o;}
function J(p,x=0,y=0,z=0){const g=new THREE.Group();g.position.set(x,y,z);p.add(g);return g;}
// Glied als Kapsel zwischen Gelenk (oben) und lokalem -y
function glied(p,len,r0,r1,m){const g=new THREE.CylinderGeometry(r1,r0,len,16,1);const o=mesh(g,m,p,0,-len/2,0);
  mesh(new THREE.SphereGeometry(r0,16,10),m,p);mesh(new THREE.SphereGeometry(r1,16,10),m,p,0,-len,0);return o;}
// Drehkörper aus Profil [Radius, Höhe] (Rumpf, Kopf)
function dreh(p,profil,m,sx=1,sz=1,y=0){const g=new THREE.LatheGeometry(profil.map(([r,h])=>new THREE.Vector2(r,h)),32);const o=mesh(g,m,p,0,y,0);o.scale.set(sx,1,sz);return o;}

function baue(){

  const skin=M({map:koernung(hex(LOOK.skin),12,3),roughness:.68}),skinD=M({color:0xa86a48,roughness:.75}),
    shirt=M({map:karo(LOOK.shirt),roughness:.95}),hose=M({map:koernung(hex(LOOK.legs),20,5),roughness:.95}),
    stiefel=M({map:koernung(hex(LOOK.boot),24,9),roughness:.55}),leder=M({map:koernung(hex(LOOK.leather),22,11),roughness:.6}),
    messing=M({color:LOOK.brass,roughness:.32,metalness:.85}),stahl=M({color:0xc4c8cc,roughness:.22,metalness:.9}),
    dunkel=M({color:0x1a120c,roughness:.6}),auge=M({color:0xcfc4b2,roughness:.4}),iris=M({color:0x3a5068,roughness:.3});
  root=new THREE.Group();scene.add(root);
  body=J(root,0,.96,0);
  // Becken und Gürtel
  const becken=mesh(new THREE.SphereGeometry(.17,24,14),hose,body,0,-.02,0);becken.scale.set(1,.62,.72);
  const guertel=mesh(new THREE.CylinderGeometry(.165,.17,.06,28,1,true),leder,body,0,.06,0);guertel.scale.set(1,1,.74);
  mesh(new THREE.BoxGeometry(.07,.055,.02),messing,body,0,.06,.128);
  mesh(new THREE.BoxGeometry(.035,.03,.024),leder,body,0,.06,.13);
  const tasche=mesh(new THREE.BoxGeometry(.08,.1,.05),leder,body,.15,-.01,.04);tasche.rotation.y=.5;
  // Rumpf: Hemd als Drehkörper (Taille schmal, Brust breit), leicht abgeflacht
  spine=J(body,0,.08,0);
  dreh(spine,[[.0,-.04],[.165,-.04],[.172,.02],[.162,.12],[.178,.24],[.198,.33],[.2,.38],[.16,.44],[.08,.475],[.0,.48]],shirt,1,.64);
  chest=J(spine,0,.4,0);
  // Kragen, offener Ausschnitt mit Haut
  const kr=mesh(new THREE.TorusGeometry(.068,.02,8,20),shirt,chest,0,.07,.0);kr.rotation.x=Math.PI/2-.25;
  // Schultern: Deltamuskel unter dem Hemd verbindet Rumpf und Arm
  for(const s of[-1,1]){const d=mesh(new THREE.SphereGeometry(.072,20,14),shirt,chest,s*.175,-.025,0);d.scale.set(1,.82,.95);}
  neck=J(chest,0,.08,0);
  glied(neck,.06,.052,.05,skin).rotation.set(0,0,0);
  head=J(neck,0,.06,0);
  // Kopf mit Glatze: Schädel, Kiefer, Ohren, Nase, Brauen, Augen
  const sch=mesh(new THREE.SphereGeometry(.105,32,24),skin,head,0,.13,-.005);sch.scale.set(.9,1.04,1.02);
  const kiefer=mesh(new THREE.SphereGeometry(.085,24,16),skin,head,0,.065,.025);kiefer.scale.set(.92,.9,.95);
  const kinn=mesh(new THREE.SphereGeometry(.035,12,8),skin,head,0,.03,.075);kinn.scale.set(1.2,.9,.9);
  for(const s of[-1,1]){const o=mesh(new THREE.SphereGeometry(.026,10,8),skinD,head,s*.094,.11,-.01);o.scale.set(.45,1,.8);
    mesh(new THREE.SphereGeometry(.011,10,8),auge,head,s*.035,.125,.089);mesh(new THREE.SphereGeometry(.0075,8,6),iris,head,s*.035,.125,.098);
    const br=mesh(new THREE.BoxGeometry(.042,.013,.016),M({color:0x6a4a34,roughness:.9}),head,s*.036,.145,.095);br.rotation.z=s*-.15;}
  const nase=mesh(new THREE.ConeGeometry(.017,.05,8),skin,head,0,.105,.104);nase.rotation.x=Math.PI/2+.5;
  const mund=mesh(new THREE.BoxGeometry(.04,.006,.01),M({color:0x7a3c30}),head,0,.068,.098);
  // Arme: Hemdärmel bis zum Ellbogen hochgekrempelt, Unterarm Haut, Hände
  function arm(s){const sh=J(chest,s*.19,-.03,0);const ob=glied(sh,.26,.05,.047,shirt);
    const krempe=mesh(new THREE.TorusGeometry(.049,.016,8,18),shirt,sh,0,-.24,0);krempe.rotation.x=Math.PI/2;
    const el=J(sh,0,-.27,0);glied(el,.25,.045,.032,skin);
    const ha=J(el,0,-.27,0);const hd=mesh(new THREE.BoxGeometry(.05,.085,.075,2,2,2),skin,ha,0,-.03,.005);hd.geometry=rund(hd.geometry,.025);
    const dm=mesh(new THREE.CapsuleGeometry(.014,.03,4,8),skin,ha,0,-.02,.045);dm.rotation.x=.6;
    return{sh,el,ha};}
  aR=arm(-1);aL=arm(1);
  // Kurzschwert in der rechten Hand
  const sw=J(aR.ha,0,-.04,.01);sw.rotation.x=-1.05;
  mesh(new THREE.CylinderGeometry(.017,.017,.1,10),leder,sw,0,0,0);
  mesh(new THREE.SphereGeometry(.024,12,8),messing,sw,0,.06,0);
  mesh(new THREE.BoxGeometry(.15,.022,.035),messing,sw,0,-.06,0);
  const kl=mesh(new THREE.BoxGeometry(.05,.5,.008),stahl,sw,0,-.32,0);
  mesh(new THREE.ConeGeometry(.025,.07,4),stahl,sw,0,-.6,0).rotation.set(Math.PI,Math.PI/4,0);
  mesh(new THREE.BoxGeometry(.012,.44,.01),M({color:0x8a9096,roughness:.3,metalness:.8}),sw,0,-.3,.002);
  // Beine: Hose, Stiefel mit Stulpe
  function bein(s){const hp=J(body,s*.09,-.04,0);glied(hp,.44,.086,.066,hose);const kn=J(hp,0,-.44,0);glied(kn,.27,.064,.054,hose);
    const st=mesh(new THREE.CylinderGeometry(.06,.055,.2,16),stiefel,kn,0,-.32,0);
    const stulpe=mesh(new THREE.CylinderGeometry(.068,.064,.05,16),stiefel,kn,0,-.23,0);
    const an=J(kn,0,-.42,0);const fu=mesh(new THREE.BoxGeometry(.09,.06,.2,2,2,2),stiefel,an,0,-.02,.04);fu.geometry=rund(fu.geometry,.035);
    mesh(new THREE.BoxGeometry(.095,.018,.21),dunkel,an,0,-.05,.04);return{hp,kn,an};}
  lR=bein(-1);lL=bein(1);
}
// Kanten einer Box abrunden: Ecken zur Mitte ziehen (weiche, gemalte Formen statt harter Klötze)
function rund(g,r){const p=g.attributes.position,v=new THREE.Vector3();g.computeBoundingBox();const b=g.boundingBox,h=new THREE.Vector3();b.getSize(h);h.multiplyScalar(.5);
  for(let i=0;i<p.count;i++){v.fromBufferAttribute(p,i);const q=new THREE.Vector3(Math.max(-h.x+r,Math.min(h.x-r,v.x)),Math.max(-h.y+r,Math.min(h.y-r,v.y)),Math.max(-h.z+r,Math.min(h.z-r,v.z)));
    const d=v.clone().sub(q);if(d.length()>0)d.setLength(Math.min(r,d.length()));p.setXYZ(i,q.x+d.x,q.y+d.y,q.z+d.z);}
  p.needsUpdate=true;g.computeVertexNormals();return g;}

function pose(art,t,dir){
  root.rotation.y=Math.PI/4+dir*Math.PI/4;
  body.position.y=.96;body.rotation.set(0,0,0);spine.rotation.set(.04,0,0);chest.rotation.set(0,0,0);head.rotation.set(-.04,0,0);
  for(const l of[lR,lL]){l.hp.rotation.set(0,0,0);l.kn.rotation.set(0,0,0);l.an.rotation.set(0,0,0);}
  aR.sh.rotation.set(-.25,0,.1);aR.el.rotation.set(-.75,0,0);aR.ha.rotation.set(0,0,0);
  aL.sh.rotation.set(.05,0,-.12);aL.el.rotation.set(-.25,0,0);aL.ha.rotation.set(0,0,0);
  lR.hp.rotation.set(-.04,0,.03);lL.hp.rotation.set(.04,0,-.03);lR.kn.rotation.x=.06;lL.kn.rotation.x=.06;
  if(art==='idle'){body.position.y=.96+Math.sin(t*Math.PI*2)*.006;chest.rotation.x=Math.sin(t*Math.PI*2)*.02;}
  else if(art==='walk'){const p=t*Math.PI*2,s=Math.sin(p),c=Math.cos(p);
    lR.hp.rotation.x=-.5*s;lL.hp.rotation.x=.5*s;
    lR.kn.rotation.x=.1+.85*Math.max(0,c)*Math.max(0,s+.3);lL.kn.rotation.x=.1+.85*Math.max(0,-c)*Math.max(0,-s+.3);
    lR.an.rotation.x=.2*s;lL.an.rotation.x=-.2*s;
    body.position.y=.955+.025*Math.abs(c);body.rotation.y=.1*s;spine.rotation.y=-.14*s;
    aR.sh.rotation.x=-.25+.3*s;aL.sh.rotation.x=.05-.45*s;aL.el.rotation.x=-.25-.25*Math.max(0,-s);}
  else if(art==='attack'){
    const KF=[[-.25,.1,-.75,0,0,0],[-1.5,.45,-1.4,.5,.35,.08],[-2.75,.55,-1.0,.9,.5,.1],[-1.25,.05,-.15,.15,-.35,-.06],[-.55,-.1,-.25,.35,-.55,-.1],[-.35,.1,-.6,.1,-.2,0]];
    const k=KF[Math.round(t*5)];aR.sh.rotation.set(k[0],0,k[1]);aR.el.rotation.x=k[2];aR.ha.rotation.x=k[3];spine.rotation.y=k[4];spine.rotation.x=.04+k[5];
    lR.hp.rotation.x=-.4;lR.kn.rotation.x=.4;lL.hp.rotation.x=.35;lL.kn.rotation.x=.2;body.position.y=.92;aL.sh.rotation.set(-.5,0,-.4);aL.el.rotation.x=-.9;}
  else if(art==='death'){const k=Math.min(1,t*1.2);
    body.position.y=.96-.8*k;body.rotation.x=-1.3*k*k;head.rotation.x=.45*k;
    lR.kn.rotation.x=.1+1.5*Math.min(1,k*2)*(1-k*.6);lL.kn.rotation.x=.1+1.3*Math.min(1,k*2)*(1-k*.6);
    lR.hp.rotation.x=-1.0*Math.min(1,k*2)*(1-k*.7);lL.hp.rotation.x=-.8*Math.min(1,k*2)*(1-k*.7);
    aR.sh.rotation.x=-.25-1.4*k;aL.sh.rotation.x=-1.6*k;}
}

window.avatar=(opt={})=>{
  const W=opt.w||320,H=opt.h||560,K=opt.k||250,OX=W/2,OY=H-(opt.fuss||40);
  R=new THREE.WebGLRenderer({antialias:true,alpha:true,preserveDrawingBuffer:true});
  R.setSize(W,H);R.setPixelRatio(1);R.outputEncoding=THREE.sRGBEncoding;R.toneMapping=THREE.ACESFilmicToneMapping;R.toneMappingExposure=.92;
  R.shadowMap.enabled=true;R.shadowMap.type=THREE.PCFSoftShadowMap;document.body.appendChild(R.domElement);
  scene=new THREE.Scene();
  cam=new THREE.OrthographicCamera(-OX/K,(W-OX)/K,OY/K,-(H-OY)/K,.1,100);
  const el=Math.PI/6,az=Math.PI/4,d=20;cam.position.set(d*Math.cos(el)*Math.sin(az),d*Math.sin(el),d*Math.cos(el)*Math.cos(az));cam.lookAt(0,0,0);
  // Licht wie im Spiel von oben links, warm; kühles Gegenlicht als Kante, gedämpfter Himmel
  scene.add(new THREE.HemisphereLight(0xc8d0de,0x3a2c20,.42));
  const sonne=new THREE.DirectionalLight(0xffdcae,2.5);sonne.position.set(-3,7,4.5);sonne.castShadow=true;
  sonne.shadow.mapSize.set(2048,2048);Object.assign(sonne.shadow.camera,{left:-1.5,right:1.5,top:2.5,bottom:-.5,near:1,far:20});sonne.shadow.radius=3;sonne.shadow.bias=-.0006;scene.add(sonne);
  const kante=new THREE.DirectionalLight(0x9ab8ff,.9);kante.position.set(3,4,-5);scene.add(kante);
  if(opt.boden!==false){const b=new THREE.Mesh(new THREE.PlaneGeometry(6,6),new THREE.ShadowMaterial({opacity:.35}));b.rotation.x=-Math.PI/2;b.receiveShadow=true;scene.add(b);}
  baue();
};
window.shot=(art,t,dir)=>{pose(art,t,dir);R.render(scene,cam);return R.domElement.toDataURL('image/png');};
})();
