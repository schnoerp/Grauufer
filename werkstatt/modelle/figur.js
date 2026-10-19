// Probe (Spiel-Rev 124): Avatar aus Querschnitten nach menschlichen Proportionen.
// Körper, Arme und Beine sind Querschnittskörper (Superellipsen in festen Höhen, glatt interpoliert) nach Durchschnittsmaßen eines
// erwachsenen Mannes (1,80 m, Kopf 0,23 m ≈ 7,8 Kopflängen); der Kopf ist eine Grundform (Schädel, schmaler werdendes Untergesicht),
// auf die Stirn, Brauenbogen, Augenhöhlen, Nase, Wangenknochen, Lippen, Kinn und Kiefer als weiche Wölbungen aufmodelliert werden.
// Kleidung liegt als eigene, etwas weitere Querschnittskörper darüber. Stoffe mit UV-Koordinaten (Karomuster liegt sauber auf).
// Maße in Metern, Blick nach +z, Füße bei y = 0. Benötigt THREE (three.js 0.149).
// window.Figur.bau(spec) → THREE.Group (Startfigur im Stehen; Farben und Größe aus der Avatar-Beschreibung)
(function(){
const V=(x,y,z)=>new THREE.Vector3(x,y,z);
const sp=(v,e)=>Math.sign(v)*Math.pow(Math.abs(v),2/e);
// Catmull-Rom über eine Zahlenfolge
function cr(a,i,t){const n=a.length,p0=a[Math.max(0,i-1)],p1=a[i],p2=a[Math.min(n-1,i+1)],p3=a[Math.min(n-1,i+2)];
  return .5*((2*p1)+(-p0+p2)*t+(2*p0-5*p1+4*p2-p3)*t*t+(-p0+3*p1-3*p2+p3)*t*t*t);}

// Querschnittskörper. Jeder Schnitt: c (Mitte), w (halbe Breite), f (Tiefe nach vorn), b (Tiefe nach hinten), e (Rundung 2 = Ellipse, größer = kantiger).
// Die Achse ergibt sich aus der Folge der Mitten; „vorn“ ist +z, „seitlich“ steht senkrecht darauf. opt.farbe(p,t,u) liefert eine Helligkeit oder [r,g,b] (linear, seit Spiel-Rev 127).
function querschnitte(S,opt={}){
  const N=opt.n||40,M=opt.m||Math.max(24,S.length*8),deckel=opt.deckel!==false;
  const kx=S.map(s=>s.c[0]),ky=S.map(s=>s.c[1]),kz=S.map(s=>s.c[2]),kw=S.map(s=>s.w),kf=S.map(s=>s.f),kb=S.map(s=>s.b),ke=S.map(s=>s.e||2.2);
  const ringe=[];
  for(let r=0;r<=M;r++){const u=r/M*(S.length-1),i=Math.min(S.length-2,Math.floor(u)),t=u-i;
    ringe.push({c:V(cr(kx,i,t),cr(ky,i,t),cr(kz,i,t)),w:cr(kw,i,t),f:cr(kf,i,t),b:cr(kb,i,t),e:cr(ke,i,t)});}
  const P=[],UV=[],I=[],CO=[];let vlaenge=0;
  for(let r=0;r<=M;r++){const R=ringe[r],a=ringe[Math.min(M,r+1)].c.clone().sub(ringe[Math.max(0,r-1)].c).normalize();
    const F=V(0,0,1).sub(a.clone().multiplyScalar(a.z)).normalize(),Sd=a.clone().cross(F).normalize();if(Sd.x<0)Sd.multiplyScalar(-1);
    if(r)vlaenge+=R.c.distanceTo(ringe[r-1].c);
    let bogen=0,vor=null;
    for(let j=0;j<=N;j++){const th=Math.PI+j/N*Math.PI*2,s=Math.sin(th),c=Math.cos(th);
      const p=R.c.clone().addScaledVector(Sd,R.w*sp(s,R.e)).addScaledVector(F,(c>=0?R.f:R.b)*sp(c,R.e));
      if(opt.form)opt.form(p,r/M,j/N);
      if(vor)bogen+=p.distanceTo(vor);vor=p;P.push(p.x,p.y,p.z);UV.push(bogen,vlaenge);if(opt.farbe){const f=opt.farbe(p,r/M,j/N);if(Array.isArray(f))CO.push(...f);else CO.push(f,f,f);}}}
  for(let r=0;r<M;r++)for(let j=0;j<N;j++){const a=r*(N+1)+j,b=a+N+1;I.push(a,b,a+1,a+1,b,b+1);}
  // Umlaufsinn prüfen: Flächen müssen nach außen zeigen (sonst blendet three.js sie aus)
  {const r=Math.floor(M/2),a=r*(N+1)+Math.floor(N/4),b=a+N+1,q=k=>V(P[k*3],P[k*3+1],P[k*3+2]);
    const n=q(b).sub(q(a)).cross(q(a+1).sub(q(a))),aus=q(a).sub(ringe[r].c);if(n.dot(aus)<0)for(let k=0;k<I.length;k+=3){const t=I[k+1];I[k+1]=I[k+2];I[k+2]=t;}}
  if(deckel){const fl=I.length&&I[1]!==N+1;for(const r of[0,M]){const mi=P.length/3,C=ringe[r].c;P.push(C.x,C.y,C.z);UV.push(0,0);if(opt.farbe){const k=r*(N+1)*3;CO.push(CO[k],CO[k+1],CO[k+2]);}
    for(let j=0;j<N;j++){const a=r*(N+1)+j;if((r>0)!==fl)I.push(a,mi,a+1);else I.push(a,a+1,mi);}}}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(P,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(UV,2));
  if(opt.farbe)g.setAttribute('color',new THREE.Float32BufferAttribute(CO,3));
  g.setIndex(I);g.computeVertexNormals();return g;}

// ---------- Kopf: Grundform mit aufmodellierten Wölbungen ----------
// Kopfmitte auf Augenhöhe; lokale Maße: Scheitel +0,108, Kinn −0,118, Breite ±0,075, Gesicht vorn +0,096, Hinterkopf −0,1
const WOELB=[ // [x, y, z, Höhe, sx, sy, sz, gespiegelt]
  [ .032, .014, .086, .0055,.017,.008,.014,1], [0,.013,.091,.003,.012,.009,.012,0],                 // Brauenbogen, Nasenwurzel oben
  [ .033,-.003, .083,-.0105,.017,.012,.016,1],                                                      // Augenhöhle
  [ .033, .006, .086, .0042,.017,.006,.012,1],[.033,-.012,.085,.0024,.015,.0045,.011,1],             // Ober- und Unterlid
  [0,-.012,.094,.008,.0075,.012,.012,0],[0,-.03,.095,.016,.008,.012,.012,0],[0,-.047,.094,.022,.0095,.0095,.012,0], // Nasenrücken bis Spitze
  [ .0125,-.053,.088,.0085,.0075,.007,.01,1],[0,-.06,.097,-.004,.006,.004,.006,0],                 // Nasenflügel, unter der Nase
  [ .049,-.018,.062,.0065,.018,.012,.02,1],[.044,-.056,.06,-.004,.016,.018,.018,1],                // Wangenknochen, Wangenmulde
  [0,-.078,.086,.0055,.024,.02,.02,0],                                                              // Mundpartie
  [0,-.071,.093,.0026,.013,.004,.008,0],[0,-.086,.091,.003,.012,.0045,.008,0],[0,-.0785,.095,-.0028,.014,.0016,.006,0], // Lippen, Mundspalte
  [0,-.108,.078,.007,.022,.012,.014,0],[.062,-.088,.0,.007,.022,.024,.024,1],                       // Kinn, Kieferwinkel
  [ .068,.024,.04,-.0028,.018,.02,.02,1],                                                           // Schläfe
];
function kopfGeo(){
  const LAT=96,LON=128,P=[],UV=[],I=[];
  for(let i=0;i<=LAT;i++){const phi=Math.PI*i/LAT,ny=Math.cos(phi),rs=Math.sin(phi);
    for(let j=0;j<=LON;j++){const th=Math.PI+2*Math.PI*j/LON,nx=rs*Math.sin(th),nz=rs*Math.cos(th);
      const un=Math.max(0,-ny);
      let rx=.075*(1-.13*Math.pow(un,2.2)),ry=ny>0?.108:.118,rz=nz>0?.096*(1-.1*un):(.1-.06*un)*(ny>0?1:1-.25*un);
      if(nz>0)rz*=1-.07*Math.pow(nz,6);                                                            // Gesicht etwas flacher
      // Untergesicht vorn eher senkrecht und der Kiefer breiter als bei einer Kugel (Superellipse statt Ellipse)
      const pz=nz>0&&ny<0?1-.45*Math.min(1,un*1.6):1,px=ny<0?1-.25*Math.min(1,un*1.4):1;
      let x=Math.sign(nx)*Math.pow(Math.abs(nx),px)*rx,y=ny*ry,z=Math.sign(nz)*Math.pow(Math.abs(nz),pz)*rz;
      const nl=Math.hypot(x/(rx*rx),y/(ry*ry),z/(rz*rz))||1,gx=x/(rx*rx)/nl,gy=y/(ry*ry)/nl,gz=z/(rz*rz)/nl;
      let d=0;for(const w of WOELB){const ax=w[7]?Math.abs(x):x,dx=(ax-w[0])/w[4],dy=(y-w[1])/w[5],dz=(z-w[2])/w[6];d+=w[3]*Math.exp(-(dx*dx+dy*dy+dz*dz));}
      P.push(x+gx*d,y+gy*d,z+gz*d);UV.push(j/LON,1-i/LAT);}}
  for(let i=0;i<LAT;i++)for(let j=0;j<LON;j++){const a=i*(LON+1)+j,b=a+LON+1;I.push(a,b,a+1,a+1,b,b+1);}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(P,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(UV,2));g.setIndex(I);g.computeVertexNormals();return g;}

// ---------- Texturen ----------
function tex(w,h,mal,rep){const c=document.createElement('canvas');c.width=w;c.height=h;mal(c.getContext('2d'),w,h);
  const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.encoding=THREE.sRGBEncoding;t.anisotropy=8;if(rep)t.repeat.set(rep,rep);return t;}
function rausch(g,w,h,st,seed){let a=seed>>>0;const r=()=>{a=(a*1664525+1013904223)>>>0;return a/4294967296;};const d=g.getImageData(0,0,w,h);
  for(let i=0;i<d.data.length;i+=4){const v=(r()-.5)*st;d.data[i]+=v;d.data[i+1]+=v;d.data[i+2]+=v;}g.putImageData(d,0,0);}
// Karomuster: eine Kachel = 9 cm Stoff (UV in Metern, daher repeat = 1/0,09)
function karo(f){return tex(256,256,(g,w,h)=>{g.fillStyle=f;g.fillRect(0,0,w,h);
  g.fillStyle='rgba(25,6,8,.5)';g.fillRect(34,0,80,h);g.fillRect(0,34,w,80);g.fillStyle='rgba(20,4,6,.35)';g.fillRect(34,34,80,80);
  g.fillStyle='rgba(240,205,175,.32)';g.fillRect(180,0,7,h);g.fillRect(0,180,w,7);
  g.globalAlpha=.05;for(let y=0;y<h;y+=2){g.fillStyle=y%4?'#000':'#fff';g.fillRect(0,y,w,1);}g.globalAlpha=1;rausch(g,w,h,18,7);},1/.09);}
function koern(f,st,seed,rep){return tex(128,128,(g,w,h)=>{g.fillStyle=f;g.fillRect(0,0,w,h);rausch(g,w,h,st,seed);},rep||8);}
// Haut: leichte Rötung an Wangen, Nase und Ohren über die Kopf-UV (u rundum ab Hinterkopf, v von unten)
function hautKopf(f){return tex(512,256,(g,w,h)=>{g.fillStyle=f;g.fillRect(0,0,w,h);
  const fleck=(u,v,r,c)=>{const gr=g.createRadialGradient(u*w,(1-v)*h,0,u*w,(1-v)*h,r*w);gr.addColorStop(0,c);gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.fillRect(0,0,w,h);};
  for(const u of[.42,.58])fleck(u,.44,.05,'rgba(190,70,60,.18)');fleck(.5,.45,.025,'rgba(190,70,60,.16)');
  for(const u of[.25,.75])fleck(u,.5,.03,'rgba(180,70,60,.18)');
  g.fillStyle='rgba(60,40,30,.08)';g.fillRect(w*.38,h*.62,w*.24,h*.14);                            // Bartschatten
  g.save();g.filter='blur(1.5px)';g.strokeStyle='rgba(70,45,30,.85)';g.lineWidth=h*.022;g.lineCap='round';                  // Augenbrauen
  for(const sg of[-1,1]){g.beginPath();g.moveTo(w*(.5+sg*.03),h*.452);g.quadraticCurveTo(w*(.5+sg*.075),h*.432,w*(.5+sg*.112),h*.452);g.stroke();}g.restore();
  g.fillStyle='rgba(140,60,50,.45)';g.fillRect(w*.486,h*.722,w*.028,h*.02);g.fillStyle='rgba(60,20,15,.6)';g.fillRect(w*.484,h*.731,w*.032,h*.004); // Lippen, Mundspalte
  rausch(g,w,h,10,3);},1);}

// ---------- Figur ----------
// Kopf mit Augen und Ohren (für alle Klassen gleich); gibt die Kopfgruppe zurück
function kopf(G,L,M,kopfHaut,m){
  const K=new THREE.Group();K.position.set(0,1.682,.006);K.userData.knochen='kopf';G.add(K);
  const kg=new THREE.Mesh(kopfGeo(),kopfHaut);kg.castShadow=kg.receiveShadow=true;K.add(kg);
  for(const s of[-1,1]){
    const a=new THREE.Mesh(new THREE.SphereGeometry(.0115,20,16),m.weiss);a.position.set(s*.033,-.003,.07);K.add(a);
    const ir=new THREE.Mesh(new THREE.SphereGeometry(.0062,16,12),m.iris);ir.position.set(s*.033,-.003,.0792);ir.scale.z=.45;K.add(ir);
    const pu=new THREE.Mesh(new THREE.SphereGeometry(.0028,10,8),m.dunkel);pu.position.set(s*.033,-.003,.082);pu.scale.z=.4;K.add(pu);
    const o=new THREE.Mesh(new THREE.SphereGeometry(.03,20,16,0,Math.PI*2,0,Math.PI),kopfHaut);o.scale.set(.33,1,.62);o.position.set(s*.073,-.012,-.008);o.rotation.y=s*.25;o.castShadow=true;K.add(o);
  }
  return K;}
// Hand: Handfläche, vier Finger leicht gekrümmt, Daumen nach vorn; h0 = Handgelenk
function hand(add,s,h0,haut){
    add(querschnitte([{c:[h0[0],h0[1]+.01,h0[2]],w:.022,f:.026,b:.022},{c:[h0[0]+s*.004,h0[1]-.03,h0[2]+.004],w:.016,f:.038,b:.03},{c:[h0[0]+s*.006,h0[1]-.075,h0[2]+.006],w:.014,f:.036,b:.028}]),haut);
    for(let f=0;f<4;f++){const z=h0[2]+.03-f*.017;add(querschnitte([{c:[h0[0]+s*.006,h0[1]-.07,z],w:.008,f:.0085,b:.0085},{c:[h0[0]+s*.006,h0[1]-.1,z+.006],w:.0075,f:.0075,b:.0075},{c:[h0[0]+s*.004,h0[1]-.123+f*.004,z+.016],w:.0065,f:.0065,b:.0065}],{n:12,m:10}),haut);}
    add(querschnitte([{c:[h0[0]-s*.006,h0[1]-.02,h0[2]+.03],w:.009,f:.01,b:.01},{c:[h0[0]-s*.008,h0[1]-.045,h0[2]+.05],w:.008,f:.008,b:.008},{c:[h0[0]-s*.006,h0[1]-.065,h0[2]+.058],w:.007,f:.007,b:.007}],{n:12,m:10}),haut);}
function startfigur(spec){
  const L=Object.assign({haut:'#c99068',augen:'#3a5068',hemd:'#9a2e32',hose:'#1e1a1e',stiefel:'#4a301c',guertel:'#5a3a22',groesse:1.8},spec);
  const M=o=>new THREE.MeshStandardMaterial(Object.assign({roughness:.8,metalness:0},o));
  const haut=M({map:koern(L.haut,8,3,4),roughness:.62}),kopfHaut=M({map:hautKopf(L.haut),roughness:.6}),
    hemd=M({map:karo(L.hemd),roughness:.95}),hose=M({map:koern(L.hose,18,5,10),roughness:.95}),stiefel=M({map:koern(L.stiefel,20,9,10),roughness:.5}),
    leder=M({map:koern(L.guertel,20,11,10),roughness:.55}),messing=M({color:0xc89a3c,roughness:.3,metalness:.85}),
    weiss=M({color:0xb8ab9c,roughness:.4}),iris=M({color:L.augen,roughness:.3}),dunkel=M({color:0x120c08,roughness:.4});
  const G=new THREE.Group(),add=(g,m,x=0,y=0,z=0)=>{const o=new THREE.Mesh(g,m);o.position.set(x,y,z);o.castShadow=o.receiveShadow=true;G.add(o);return o;};
  // Rumpf (Haut, bleibt unter dem Hemd bis auf den Hals)
  const RUMPF=[{c:[0,.84,-.005],w:.13,f:.09,b:.1},{c:[0,.9,-.005],w:.165,f:.1,b:.125},{c:[0,.97,0],w:.172,f:.1,b:.12},{c:[0,1.05,.005],w:.157,f:.1,b:.1},
    {c:[0,1.12,.008],w:.148,f:.1,b:.095},{c:[0,1.22,.008],w:.162,f:.112,b:.1},{c:[0,1.31,.005],w:.178,f:.12,b:.102},{c:[0,1.39,0],w:.19,f:.105,b:.095,e:2.6},
    {c:[0,1.445,-.01],w:.165,f:.075,b:.075,e:2.6},{c:[0,1.475,-.012],w:.085,f:.055,b:.06},{c:[0,1.5,-.014],w:.056,f:.054,b:.056}];
  // Hals (eigener Körper bis in den Kopf)
  add(querschnitte([{c:[0,1.43,-.012],w:.066,f:.06,b:.064},{c:[0,1.5,-.016],w:.06,f:.055,b:.06},{c:[0,1.56,-.02],w:.057,f:.05,b:.058},{c:[0,1.63,-.024],w:.054,f:.046,b:.056}],{deckel:false}),haut);
  // Hemd: Rumpf 1,4 cm weiter, Taille nicht eingeschnürt (Stoff fällt gerade), steckt am Gürtel
  const HEMD=RUMPF.slice(2,10).map((s,i)=>({c:s.c,w:Math.max(s.w,.165)+.014,f:Math.max(s.f,.105)+.014,b:s.b+.014,e:s.e}));
  HEMD[HEMD.length-1]={c:[0,1.5,-.015],w:.074,f:.066,b:.07};
  add(querschnitte(HEMD,{deckel:false,n:56}),hemd);
  // Kragen
  const kr=add(new THREE.TorusGeometry(.068,.013,10,36),hemd,0,1.503,-.013);kr.rotation.x=Math.PI/2-.18;kr.scale.set(1,1.02,1);
  for(let i=0;i<4;i++)add(new THREE.SphereGeometry(.0055,10,8),M({color:0xe8dcc4,roughness:.4}),0,1.4-i*.09,.124-(i>1?.004:0));
  // Arme: Schulter → Ellbogen → Handgelenk, Ärmel bis zum Ellbogen gekrempelt
  for(const s of[-1,1]){
    const A=[[.17,1.405,0],[.205,1.33,.005],[.212,1.24,0],[.218,1.155,-.016],[.225,1.07,0],[.232,.97,.025],[.24,.89,.045]];
    const R=[[.05,.054,.052],[.052,.058,.05],[.047,.052,.044],[.04,.04,.04],[.044,.043,.038],[.036,.033,.03],[.029,.022,.022]];
    const arm=A.map((p,i)=>({c:[s*p[0],p[1],p[2]],w:R[i][0],f:R[i][1],b:R[i][2]}));
    add(querschnitte(arm),haut);
    const aermel=arm.slice(0,4).map(q=>({c:q.c,w:q.w+.012,f:q.f+.012,b:q.b+.012}));aermel[0]={c:[s*.18,1.45,0],w:.07,f:.07,b:.07};
    add(querschnitte(aermel,{deckel:false,n:40}),hemd);
    const k=add(new THREE.TorusGeometry(.053,.015,10,28),hemd,s*.218,1.15,-.015);k.rotation.set(Math.PI/2,0,s*.05);
    hand(add,s,[s*.243,.88,.05],haut);
  }
  // Beine (Haut unter der Hose) und Hose
  for(const s of[-1,1]){
    const B=[[.088,.93,-.005,.09,.095,.1],[.093,.8,.005,.084,.09,.085],[.097,.66,.012,.072,.08,.068],[.099,.54,.01,.058,.058,.056],[.1,.49,.012,.052,.054,.05],
      [.101,.42,-.002,.055,.046,.062],[.102,.33,-.008,.053,.042,.06],[.103,.2,-.01,.04,.036,.042],[.104,.1,-.01,.034,.033,.035]];
    const bein=B.map(q=>({c:[s*q[0],q[1],q[2]],w:q[3],f:q[4],b:q[5]}));
    add(querschnitte(bein),haut);
    // Hose: weiter und gerader geschnitten, Saum im Stiefel
    const H=bein.slice(0,7).map((q,i)=>({c:q.c,w:Math.max(q.w,.062)+.017,f:Math.max(q.f,.062)+.016,b:Math.max(q.b,.064)+.016}));
    H[0]={c:[s*.084,.98,-.01],w:.12,f:.115,b:.13};
    add(querschnitte(H,{deckel:false,n:40}),hose);
    // Stiefel: Schaft und Fuß
    add(querschnitte([{c:[s*.102,.4,-.006],w:.074,f:.07,b:.08},{c:[s*.103,.3,-.01],w:.066,f:.058,b:.074},{c:[s*.104,.16,-.01],w:.052,f:.05,b:.056},{c:[s*.104,.08,-.006],w:.048,f:.052,b:.056}]),stiefel);
    add(querschnitte([{c:[s*.104,.05,-.06],w:.04,f:.03,b:.03},{c:[s*.104,.055,-.02],w:.046,f:.045,b:.045},{c:[s*.106,.045,.05],w:.05,f:.035,b:.035},{c:[s*.108,.035,.12],w:.044,f:.025,b:.025},{c:[s*.108,.03,.15],w:.03,f:.018,b:.018}].map(q=>({c:q.c,w:q.w,f:q.f,b:q.b,e:2.4})),{n:28}),stiefel);
    add(new THREE.BoxGeometry(.1,.016,.22),dunkel,s*.106,.008,.045);
  }
  // Gürtel mit Schnalle
  add(querschnitte([{c:[0,.965,0],w:.19,f:.125,b:.14},{c:[0,1.01,.002],w:.188,f:.124,b:.138}],{deckel:false,n:48}),leder);
  add(new THREE.BoxGeometry(.065,.05,.012),messing,0,.988,.128);add(new THREE.BoxGeometry(.04,.03,.014),leder,0,.988,.13);
  kopf(G,L,M,kopfHaut,{weiss,iris,dunkel});
  G.scale.setScalar((+L.groesse||1.8)/1.8);
  return G;}


// ---------- Klasse Magier (Zielbild des Auftraggebers, Spiel-Rev 124) ----------
// Kapuze, Schulterumhang und weite Robe mit Falten und Goldborte, weite Ärmel, Gürtel mit Schnalle, Tasche und Riemen,
// Bart, geschnitzter Stab mit leuchtendem Stein (blaues Licht).
function magier(spec){
  const L=Object.assign({haut:'#b07a56',augen:'#3a5068',robe:'#1a2554',borte:'#b8903e',leder:'#5a3a22',bart:'#6a5848',stiefel:'#3a2616',stein:'#2f6bff',groesse:1.8},spec);
  const M=o=>new THREE.MeshStandardMaterial(Object.assign({roughness:.8,metalness:0},o));
  const haut=M({map:koern(L.haut,8,3,4),roughness:.62}),kopfHaut=M({map:hautKopf(L.haut),roughness:.6}),
    robe=M({map:robenStoff(L.robe),roughness:.7,vertexColors:true}),robeHell=M({map:robenStoff(heller(L.robe,1.35)),roughness:.7}),robeKap=M({map:robenStoff(L.robe),roughness:.7}),borte=M({map:borteTex(L.borte),roughness:.4,metalness:.55}),
    leder=M({map:koern(L.leder,22,11,10),roughness:.55}),messing=M({color:0xc89a3c,roughness:.3,metalness:.85}),stiefel=M({map:koern(L.stiefel,20,9,10),roughness:.5}),
    bart=M({map:haarTex(L.bart),roughness:.9}),holz=M({map:holzTex(),roughness:.75}),
    stein=new THREE.MeshStandardMaterial({color:heller(L.stein,.7),emissive:L.stein,emissiveIntensity:1,roughness:.15,toneMapped:false}),futter=M({color:0x0b0f22,roughness:1,side:THREE.BackSide}),
    weiss=M({color:0xb8ab9c,roughness:.4}),iris=M({color:L.augen,roughness:.3}),dunkel=M({color:0x120c08,roughness:.4});
  let TAG=null;const G=new THREE.Group(),add=(g,m,x=0,y=0,z=0)=>{const o=new THREE.Mesh(g,m);o.position.set(x,y,z);o.castShadow=o.receiveShadow=true;if(TAG)o.userData.knochen=TAG;G.add(o);return o;};
  // senkrechte Falten: Auslenkung nach außen, nach unten stärker
  const welle=(r,k,ph)=>Math.sin(r*k+ph)+.45*Math.sin(r*k*2.3+ph*1.7);
  const falten=(amp,k,ph)=>(p,t,u)=>{const r=Math.atan2(p.x,p.z),a=amp*Math.pow(t,1.2);const d=a*welle(r,k,ph);p.x+=Math.sin(r)*d;p.z+=Math.cos(r)*d;};
  // Schattierung der Falten (wie Umgebungsverdeckung): Täler dunkel, Grate hell, nach unten kräftiger
  const faltenSchatten=(k,ph,st)=>(p,t)=>{const r=Math.atan2(p.x,p.z),w=(welle(r,k,ph)+1.45)/2.9;return 1-(st||.5)*Math.pow(t,.8)*(1-w);};
  // Robe vom Hals bis knapp über den Boden, unten weit
  const R=[[1.5,.075,.07,.072],[1.47,.16,.1,.1],[1.42,.205,.12,.11],[1.32,.195,.135,.115],[1.2,.18,.13,.11],[1.08,.178,.13,.12],[.95,.2,.14,.14],
    [.75,.225,.16,.165],[.5,.255,.185,.19],[.25,.285,.205,.215],[.06,.305,.22,.235]];
  const robenS=R.map(q=>({c:[0,q[0],-.01],w:q[1],f:q[2],b:q[3]}));
  add(querschnitte(robenS.slice().reverse(),{deckel:false,n:72,m:110,form:falten(.02,11,.6),farbe:(p,t)=>faltenSchatten(11,.6,.55)(p,1-t)}),robe);
  // Zierband mit goldenen Zeichen über dem Saum (durchsichtig, liegt dicht auf der Robe)
  add(querschnitte(robenS.filter(q=>q.c[1]<.42).slice().reverse().map(q=>({c:q.c,w:q.w+.003,f:q.f+.003,b:q.b+.003})),{deckel:false,n:72,m:30,form:falten(.02,11,.6)}),zierMat(L.borte));
  // Saumborte unten und senkrechte Borte vorn
  add(querschnitte([{c:[0,.05,-.01],w:.31,f:.226,b:.241},{c:[0,.1,-.01],w:.302,f:.22,b:.235}],{deckel:false,n:72,form:(p,t,u)=>{falten(.02,11,.6)(p,1-(.075/1.44),u);const r=Math.atan2(p.x,p.z);p.x+=Math.sin(r)*.003;p.z+=Math.cos(r)*.003;}}),borte);
  // Mittelbahn vorn (heller) mit Borten an beiden Seiten, vom Gürtel bis zum Saum
  const bahn=R.filter(q=>q[0]<1.0).map(q=>({c:[0,q[0],q[2]-.004],w:.055+(1-q[0])*.03,f:.004,b:.004}));
  add(querschnitte(bahn,{n:16,m:50}),robeHell);
  for(const sx of[-1,1])add(querschnitte(bahn.map(q=>({c:[sx*(q.w+.004),q.c[1],q.c[2]-.002-(q.w*q.w)*1.2],w:.009,f:.005,b:.005})),{n:10,m:50}),borte);
  add(querschnitte(R.filter(q=>q[0]>1.0).map(q=>({c:[0,q[0],q[2]-.006],w:.016,f:.005,b:.005})),{n:10,m:30}),borte);
  // Schulterumhang mit Kapuzenansatz, Borte am Rand
  const um=[[1.47,.17,.11,.125],[1.44,.215,.13,.14],[1.36,.245,.15,.16],[1.31,.25,.155,.165]];
  add(querschnitte(um.map(q=>({c:[0,q[0],-.012],w:q[1],f:q[2],b:q[3]})).reverse(),{deckel:false,n:64,form:falten(.008,7,.2),farbe:(p,t)=>faltenSchatten(7,.2,.4)(p,1-t)}),robe);
  add(querschnitte([{c:[0,1.3,-.012],w:.257,f:.16,b:.17},{c:[0,1.32,-.012],w:.254,f:.158,b:.168}],{deckel:false,n:64,form:falten(.008,7,.2)}),borte);
  // Kapuze: Schale um den Kopf, vorn offen, mit Borte am Gesichtsrand
  TAG='kopf';add(kapuze(),robeKap,0,1.682,.006);add(kapuzenRand(),borte,0,1.682,.006);
  const fu=add(kapuze(),futter,0,1.682,.006);fu.scale.setScalar(.985);TAG=null;
  // Halstuch unter dem Bart (heller Stoff), füllt die Kapuzenöffnung zum Umhang hin
  add(querschnitte([{c:[0,1.44,-.005],w:.1,f:.1,b:.09},{c:[0,1.5,-.008],w:.085,f:.085,b:.075},{c:[0,1.56,-.014],w:.068,f:.066,b:.064}],{deckel:false,n:40,form:falten(.004,8,1.1)}),robeHell);                              // dunkles Futter: Gesicht liegt im Schatten der Kapuze
  // Arme in Pose: rechte Hand hält den Stab vor dem Körper, linke Hand angehoben mit leuchtender Kugel.
  // Weite Ärmel folgen dem Arm und hängen am Unterarm nach unten durch, Borte am Saum.
  const ARM={'-1':[[-.17,1.41,0],[-.225,1.17,-.01],[-.25,1.08,.2]],'1':[[.17,1.41,0],[.24,1.18,-.03],[.26,1.13,.19]]};
  const lerp=(a,b,t)=>a.map((v,k)=>v+(b[k]-v)*t);
  for(const s of[-1,1]){const[sh,el,wr]=ARM[s];
    const oben=[0,.5,1].map(t=>lerp(sh,el,t)),unten=[.33,.66,1].map(t=>lerp(el,wr,t));
    // Haut: Oberarm unter dem Ärmel, Unterarm bis zum Handgelenk
    add(querschnitte([...oben,...unten].map((c,i)=>({c,w:[.05,.047,.042,.042,.036,.029][i],f:[.054,.05,.042,.043,.034,.024][i],b:[.052,.046,.04,.04,.032,.024][i]}))),haut);
    // Ärmel: oben anliegend, zum Handgelenk weit und nach unten durchhängend
    const ae=[...oben,...unten].map((c,i)=>{const t=Math.max(0,i-2)/3;return{c:[c[0],c[1]-.035*t*t,c[2]],w:[.068,.064,.064,.07,.082,.1][i],f:[.07,.066,.066,.074,.09,.115][i],b:[.072,.068,.068,.078,.1,.13][i]};});
    add(querschnitte(ae,{deckel:false,n:40,form:falten(.006,6,s),farbe:(p,t)=>.75+.25*Math.cos(t*2)}),robe);
    const e=ae[5],d=ae[4];add(querschnitte([{c:lerp(d.c,e.c,.85),w:e.w*.98,f:e.f*.98,b:e.b*.98},{c:lerp(d.c,e.c,1.05),w:e.w+.004,f:e.f+.004,b:e.b+.004}],{deckel:false,n:40}),borte);
    // Hand am Handgelenk, entlang des Unterarms ausgerichtet
    const H=handGruppe(s,haut);H.userData.knochen=s<0?'handR':'handL';const dir=new THREE.Vector3(...wr).sub(new THREE.Vector3(...el)).normalize();
    H.position.set(...wr);H.quaternion.setFromUnitVectors(new THREE.Vector3(0,-1,0),dir);
    if(s>0)H.quaternion.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,-1,0),-Math.PI/2));   // linke Handfläche nach oben
    G.add(H);
  }
  // leuchtende Kugel über der linken Hand
  const ku=ARM['1'][2],kp=[ku[0]+.01,ku[1]+.06,ku[2]+.07];
  leuchte(G,kp,.028,L.stein,3.4,1.25,stein,1.7,'handL');
  for(const s of[-1,1]){
    // Stiefelspitzen unter der Robe
    add(querschnitte([{c:[s*.1,.05,-.02],w:.046,f:.045,b:.045},{c:[s*.104,.045,.05],w:.05,f:.035,b:.035},{c:[s*.108,.035,.12],w:.044,f:.025,b:.025},{c:[s*.108,.03,.15],w:.03,f:.018,b:.018}].map(q=>({c:q.c,w:q.w,f:q.f,b:q.b,e:2.4})),{n:28}),stiefel);
  }
  // Gürtel mit großer Schnalle, Tasche an der Seite, Riemen quer über die Brust
  add(querschnitte([{c:[0,1.0,-.01],w:.192,f:.142,b:.132},{c:[0,1.05,-.01],w:.19,f:.14,b:.13}],{deckel:false,n:56}),leder);
  const sn=add(new THREE.TorusGeometry(.024,.007,8,20),messing,0,1.025,.135);
  add(rundKasten(.11,.12,.05,.012),leder,-.2,.93,.06).rotation.y=-.5;
  add(new THREE.BoxGeometry(.11,.035,.052),M({map:koern(L.leder,22,13,10),roughness:.5}),-.2,.985,.06).rotation.y=-.5;
  add(new THREE.SphereGeometry(.008,8,6),messing,-.18,.975,.088);
  // zwei Riemen über Kreuz von den Schultern zum Gürtel, in der Mitte eine runde Schnalle (wie im Zielbild)
  const brustZ=(x,y)=>{const f=y>1.4?.115-(y-1.4)*.6:y>1.25?.137:.134;return f*Math.sqrt(Math.max(0,1-(x/.21)**2))+.005;};
  for(const sx of[-1,1]){const rr=[];for(let k=0;k<=14;k++){const t=k/14,y=1.03+t*.42,x=sx*(-.16+t*.3);rr.push({c:[x,y,brustZ(x,y)],w:.015,f:.003,b:.003});}add(querschnitte(rr,{n:10,m:42}),leder);}
  add(new THREE.TorusGeometry(.019,.006,8,20),messing,0,1.24,brustZ(0,1.24)+.004);add(new THREE.CylinderGeometry(.013,.013,.006,16),messing,0,1.24,brustZ(0,1.24)+.003).rotation.x=Math.PI/2;
  // zweiter, schmaler Gürtel schräg über der Hüfte mit zwei Fläschchen
  add(querschnitte([{c:[0,.9,-.01],w:.205,f:.15,b:.15},{c:[0,.925,-.01],w:.204,f:.149,b:.149}],{deckel:false,n:56,form:(p)=>{p.y+=p.x*.18;}}),leder);
  for(const[fx,fc]of[[.1,0x7a2a8a],[.14,0x2a8a6a]]){const fz=.15*Math.sqrt(Math.max(0,1-(fx/.21)**2))+.012;
    add(new THREE.CylinderGeometry(.011,.013,.045,12),new THREE.MeshStandardMaterial({color:fc,roughness:.1,metalness:.1,transparent:true,opacity:.85}),fx,.91+fx*.18-.02,fz);
    add(new THREE.CylinderGeometry(.006,.006,.014,8),M({color:0x8a6a40,roughness:.8}),fx,.91+fx*.18+.01,fz);}
  // Kopf mit Bart
  const K=kopf(G,L,M,kopfHaut,{weiss,iris,dunkel});
  const b=new THREE.Mesh(bartGeo(),bart);b.castShadow=true;K.add(b);
  TAG='handR';
  // Stab in der rechten Hand: gedrehtes Holz, Krone aus vier Klauen, leuchtender Stein mit blauem Licht
  const sx=-.262,sz=.235;
  add(querschnitte([{c:[sx,.02,sz],w:.016,f:.016,b:.016},{c:[sx,.9,sz],w:.019,f:.019,b:.019},{c:[sx,1.6,sz],w:.018,f:.018,b:.018},{c:[sx,1.86,sz],w:.024,f:.024,b:.024}],{n:14,m:60,form:(p,t)=>{const a=t*40;p.x+=.003*Math.sin(a);p.z+=.003*Math.cos(a);}}),holz);
  for(let k=0;k<4;k++){const a=k*Math.PI/2+.4,kl=[];for(let q=0;q<=6;q++){const t=q/6,r=.025+.03*Math.sin(t*Math.PI*.9),y=1.86+t*.13;kl.push({c:[sx+Math.sin(a)*r,y,sz+Math.cos(a)*r],w:.007*(1-t*.6),f:.007*(1-t*.6),b:.007*(1-t*.6)});}add(querschnitte(kl,{n:10,m:20}),holz);}
  leuchte(G,[sx,1.94,sz],.032,L.stein,3.4,1.3,stein,0,'handR');TAG=null;
  binde(G,'magier');G.scale.setScalar((+L.groesse||1.8)/1.8);
  return G;}

// Leuchtender Stein: Kern, zwei Lichthöfe und ein farbiges Punktlicht; Figur.flackern(G, t) bewegt sie
function leuchte(G,pos,r,farbe,staerke,reichweite,kernMat,phase,knochen){
  const kern=new THREE.Mesh(new THREE.SphereGeometry(r,24,18),kernMat);kern.position.set(...pos);G.add(kern);
  const hof=k=>{const m=new THREE.Mesh(new THREE.SphereGeometry(r*k,20,14),new THREE.MeshBasicMaterial({color:new THREE.Color(farbe).multiplyScalar(.6),transparent:true,opacity:.5/k,blending:THREE.AdditiveBlending,depthWrite:false,toneMapped:false}));m.position.set(...pos);G.add(m);return m;};
  const h1=hof(1.8),h2=hof(4.2),licht=new THREE.PointLight(farbe,staerke,reichweite,2);licht.position.set(pos[0],pos[1],pos[2]+.02);G.add(licht);
  if(knochen)for(const o of[kern,h1,h2,licht])o.userData.knochen=knochen;
  (G.userData.leuchten=G.userData.leuchten||[]).push({kern,h1,h2,licht,staerke,phase,mat:kernMat});}
// Flackern: unregelmäßig aus mehreren Schwingungen, je Stein versetzt; t in Sekunden
function flackern(G,t){for(const l of G.userData.leuchten||[]){const p=l.phase,f=1+.22*Math.sin(t*11+p)+.14*Math.sin(t*23.7+p*2.1)+.09*Math.sin(t*41.3+p*3.3);
  l.licht.intensity=l.staerke*f;l.h1.scale.setScalar(.9+.15*f);l.h2.scale.setScalar(.85+.25*f);l.h1.material.opacity=.2*f;l.h2.material.opacity=.07*f;l.mat.emissiveIntensity=.7+.3*f;}}
// Zeichen in Gold auf durchsichtigem Grund (Runen, Bögen), als Band um den Saum
function zierMat(f){const t=tex(512,128,(g,w,h)=>{g.clearRect(0,0,w,h);g.strokeStyle=f;g.fillStyle=f;g.lineWidth=9;g.lineCap='round';
  for(let i=0;i<8;i++){const x=i*64+32,y=64;g.beginPath();
    if(i%2){g.moveTo(x,y-34);g.lineTo(x,y+34);g.moveTo(x-16,y-12);g.lineTo(x,y-28);g.lineTo(x+16,y-12);g.moveTo(x-14,y+18);g.lineTo(x+14,y+18);}
    else{g.arc(x,y,20,Math.PI*.15,Math.PI*1.85);g.moveTo(x,y-34);g.lineTo(x,y-22);g.moveTo(x,y+22);g.lineTo(x,y+34);}
    g.stroke();g.fillRect(x+28,y-3,6,6);}
  g.fillRect(0,4,w,4);g.fillRect(0,h-8,w,4);},1);t.repeat.set(1/.22,1/.3);
  return new THREE.MeshStandardMaterial({map:t,transparent:true,alphaTest:.4,roughness:.4,metalness:.55,depthWrite:true});}
function heller(hex,f){const c=new THREE.Color(hex);c.multiplyScalar(f);return'#'+c.getHexString();}
// Hand als eigene Gruppe (Finger zeigen nach −y), zum Ausrichten am Unterarm
function handGruppe(s,haut){const H=new THREE.Group();hand((g,m)=>{const o=new THREE.Mesh(g,m);o.castShadow=o.receiveShadow=true;H.add(o);return o;},s,[0,0,0],haut);return H;}
// Kapuze: weite Schale um den Kopf (lokal, Kopfmitte), Zipfel nach hinten oben, vorn ein großes ovales Gesichtsloch,
// dessen Rand etwas vorsteht (das Gesicht liegt im Schatten), hinten bis in den Nacken
const KAP={ox:.64,oy:-.28,oh:.94,rx:.126,ryo:.126,ryu:.14,rzv:.14,rzh:.142};
function kapuzenPunkt(nx,ny,nz){const k=KAP;let x=nx*k.rx,y=ny*(ny>0?k.ryo:k.ryu)+.018,z=nz*(nz>0?k.rzv:k.rzh)-.018;
  if(ny>.3&&nz<.2){const a=Math.pow(ny-.3,2)*Math.max(0,.2-nz);z-=a*.12;y+=a*.02;}                      // sanfter Zipfel hinten oben                             // Zipfel nach hinten oben
  if(ny<-.4){const f=1+Math.pow(-.4-ny,1.3)*.75;x*=f;z=z*f-(f-1)*.03;y-=(-.4-ny)*.06;}                // unten weit auf die Schultern fallend
  const e=(nx/k.ox)**2+((ny-k.oy)/k.oh)**2;if(nz>0){const r=Math.max(0,1-Math.abs(e-1)*2.2)*nz;z+=.03*r*Math.max(.2,ny+.3);y-=.01*r*Math.max(0,ny);}  // Rand steht über der Stirn vor         // vorstehender Rand
  return[x,y,z];}
function kapuze(){const LAT=72,LON=96,P=[],UV=[],I=[],ok=[];
  for(let i=0;i<=LAT;i++){const phi=Math.PI*i/LAT*.96;for(let j=0;j<=LON;j++){const th=Math.PI+2*Math.PI*j/LON,nx=Math.sin(phi)*Math.sin(th),ny=Math.cos(phi),nz=Math.sin(phi)*Math.cos(th);
    const q=kapuzenPunkt(nx,ny,nz);P.push(q[0],q[1],q[2]);UV.push(j/LON*1.2,i/LAT*.8);ok.push(!(nz>0&&(nx/KAP.ox)**2+((ny-KAP.oy)/KAP.oh)**2<1));}}
  for(let i=0;i<LAT;i++)for(let j=0;j<LON;j++){const a=i*(LON+1)+j,b=a+LON+1;if(ok[a]&&ok[b]&&ok[a+1]&&ok[b+1])I.push(a,b,a+1,a+1,b,b+1);}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(P,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(UV,2));g.setIndex(I);g.computeVertexNormals();return g;}
// Borte am Gesichtsrand der Kapuze: Rohr entlang des Lochrands
function kapuzenRand(){const pts=[],aMax=Math.acos(Math.max(-1,(-.98-KAP.oy)/KAP.oh));for(let k=0;k<=56;k++){const a=-aMax+k/56*aMax*2,nx=KAP.ox*Math.sin(a)*1.03,ny=KAP.oy+KAP.oh*Math.cos(a)*1.03;
    const nz=Math.sqrt(Math.max(.01,1-nx*nx-ny*ny));const q=kapuzenPunkt(nx,ny,nz);pts.push(new THREE.Vector3(q[0],q[1],q[2]));}
  return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),90,.0038,8,false);}
// Bart: Schale über Kiefer, Kinn und Oberlippe, aus der Kopfgrundform abgeleitet
function bartGeo(){const g=kopfGeo(),p=g.attributes.position,I=g.index.array,neu=[];const v=new THREE.Vector3();
  const im=k=>{v.fromBufferAttribute(p,k);return v.y<-.04&&v.z>-.035&&!(v.y>-.092&&v.y<-.066&&Math.abs(v.x)<.022&&v.z>.07)&&!(v.y>-.062&&Math.abs(v.x)<.03&&v.z>.08);};
  for(let k=0;k<p.count;k++){v.fromBufferAttribute(p,k);const n=v.clone().normalize(),t=Math.max(0,Math.min(1,(-.05-v.y)/.07)),dick=.003+.019*t*t*(3-2*t)*Math.max(0,Math.min(1,(v.z+.02)/.08));p.setXYZ(k,v.x+n.x*dick,v.y+n.y*dick-dick*.9*t,v.z+n.z*dick);}
  for(let k=0;k<I.length;k+=3)if(im(I[k])&&im(I[k+1])&&im(I[k+2]))neu.push(I[k],I[k+1],I[k+2]);
  // Schnurrbart über der Oberlippe
  g.setIndex(neu);g.computeVertexNormals();return g;}
function rundKasten(w,h,d,r){const g=new THREE.BoxGeometry(w,h,d,3,3,3),p=g.attributes.position,v=new THREE.Vector3(),hw=w/2-r,hh=h/2-r,hd=d/2-r;
  for(let k=0;k<p.count;k++){v.fromBufferAttribute(p,k);const q=new THREE.Vector3(Math.max(-hw,Math.min(hw,v.x)),Math.max(-hh,Math.min(hh,v.y)),Math.max(-hd,Math.min(hd,v.z)));const dd=v.clone().sub(q);if(dd.length())dd.setLength(r);p.setXYZ(k,q.x+dd.x,q.y+dd.y,q.z+dd.z);}
  g.computeVertexNormals();return g;}
// Stoff der Robe: Grundfarbe mit feiner Webstruktur und leichtem Farbwechsel
function robenStoff(f){return tex(256,256,(g,w,h)=>{g.fillStyle=f;g.fillRect(0,0,w,h);g.globalAlpha=.06;for(let y=0;y<h;y+=2){g.fillStyle=y%4?'#000':'#fff';g.fillRect(0,y,w,1);}
  for(let x=0;x<w;x+=3){g.fillStyle=x%6?'#000':'#fff';g.fillRect(x,0,1,h);}g.globalAlpha=1;rausch(g,w,h,16,31);},4);}
// Goldborte mit Rautenmuster
function borteTex(f){return tex(128,32,(g,w,h)=>{g.fillStyle=f;g.fillRect(0,0,w,h);g.strokeStyle='rgba(80,50,10,.6)';g.lineWidth=2;
  for(let x=0;x<w;x+=16){g.beginPath();g.moveTo(x,h/2);g.lineTo(x+8,4);g.lineTo(x+16,h/2);g.lineTo(x+8,h-4);g.closePath();g.stroke();}
  g.fillStyle='rgba(255,240,190,.35)';g.fillRect(0,2,w,2);g.fillStyle='rgba(60,40,10,.4)';g.fillRect(0,h-4,w,2);rausch(g,w,h,20,37);},20);}
function haarTex(f){return tex(128,128,(g,w,h)=>{g.fillStyle=f;g.fillRect(0,0,w,h);for(let k=0;k<900;k++){const x=Math.random()*w,y=Math.random()*h;g.strokeStyle=Math.random()<.5?'rgba(0,0,0,.25)':'rgba(255,240,220,.18)';g.beginPath();g.moveTo(x,y);g.lineTo(x+(Math.random()-.5)*3,y+6+Math.random()*6);g.stroke();}},6);}
function holzTex(){return tex(64,256,(g,w,h)=>{g.fillStyle='#5a3a1e';g.fillRect(0,0,w,h);for(let k=0;k<40;k++){g.strokeStyle=k%2?'rgba(30,15,5,.4)':'rgba(140,95,50,.3)';g.beginPath();const x=Math.random()*w;g.moveTo(x,0);g.bezierCurveTo(x+6,h/3,x-6,h*2/3,x+3,h);g.stroke();}rausch(g,w,h,14,41);},6);}

// ---------- Gelenkgerüst für Krieger, Magier und Waldläufer (seit Spiel-Rev 125) ----------
// Knochen je Klasse (Ruhehaltung, Maße in Metern); R = rechte Körperseite (x negativ)
const ARM_HAENGT={schulterR:[-.17,1.405,0],ellbogenR:[-.218,1.155,-.016],handR:[-.24,.89,.045],schulterL:[.17,1.405,0],ellbogenL:[.218,1.155,-.016],handL:[.24,.89,.045]};
const KNOCHEN={
  grund:{becken:[0,.95,0,null],rumpf:[0,1.12,0,'becken'],brust:[0,1.32,0,'rumpf'],hals:[0,1.48,-.01,'brust'],kopf:[0,1.6,0,'hals'],
    huefteR:[-.09,.93,0,'becken'],knieR:[-.1,.5,.012,'huefteR'],fussR:[-.104,.09,-.01,'knieR'],huefteL:[.09,.93,0,'becken'],knieL:[.1,.5,.012,'huefteL'],fussL:[.104,.09,-.01,'knieL']},
  arme:{krieger:ARM_HAENGT,waldlaeufer:ARM_HAENGT,
    magier:{schulterR:[-.17,1.41,0],ellbogenR:[-.225,1.17,-.01],handR:[-.25,1.08,.2],schulterL:[.17,1.41,0],ellbogenL:[.24,1.18,-.03],handL:[.26,1.13,.19]}}};
const KNOCHEN_SPITZE={kopf:[0,.2,0],fussR:[0,-.05,.14],fussL:[0,-.05,.14]};
// Bindet die Figur an ein Gelenkgerüst: starre Teile (userData.knochen) hängen fest an ihrem Knochen, alle übrigen Flächen werden
// als SkinnedMesh weich an die nächstgelegenen Knochen gebunden (Gewichte nach Abstand zu den Knochenstrecken, Gegenseite abgeschwächt)
function binde(G,klasse){
  const D={...KNOCHEN.grund},A=KNOCHEN.arme[klasse];
  D.schulterR=[...A.schulterR,'brust'];D.ellbogenR=[...A.ellbogenR,'schulterR'];D.handR=[...A.handR,'ellbogenR'];
  D.schulterL=[...A.schulterL,'brust'];D.ellbogenL=[...A.ellbogenL,'schulterL'];D.handL=[...A.handL,'ellbogenL'];
  const B={},namen=Object.keys(D),liste=[];
  for(const n of namen){const b=new THREE.Bone();b.name=n;B[n]=b;liste.push(b);}
  for(const n of namen){const[x,y,z,el]=D[n],b=B[n];if(el){const[px,py,pz]=D[el];b.position.set(x-px,y-py,z-pz);B[el].add(b);}else{b.position.set(x,y,z);G.add(b);}}
  G.updateMatrixWorld(true);
  // Knochenstrecken: vom Gelenk zum Kind in der Kette, an den Enden eine feste Spitze
  const kind=n=>namen.find(m=>D[m][3]===n&&!(n==='brust'&&m.startsWith('schulter'))&&!(n==='becken'&&m.startsWith('huefte'))),strecke={};
  for(const n of namen){const a=new THREE.Vector3(...D[n].slice(0,3)),k=kind(n);let e;
    if(k)e=new THREE.Vector3(...D[k].slice(0,3));else if(KNOCHEN_SPITZE[n])e=a.clone().add(new THREE.Vector3(...KNOCHEN_SPITZE[n]));
    else{const el=new THREE.Vector3(...D[D[n][3]].slice(0,3));e=a.clone().add(a.clone().sub(el).setLength(.12));}
    strecke[n]=[a,e,n.endsWith('R')?-1:n.endsWith('L')?1:0];}
  const abstand=(p,[a,e])=>{const ab=e.clone().sub(a),t=Math.max(0,Math.min(1,p.clone().sub(a).dot(ab)/ab.lengthSq()));return p.distanceTo(a.clone().addScaledVector(ab,t));};
  // Teile sammeln, bevor sich die Szenenstruktur ändert
  const starr=[],weich=[];
  G.traverse(o=>{if(o.isBone||o===G)return;let q=o,k=null;while(q&&q!==G){if(q.userData.knochen){k=q.userData.knochen;break;}q=q.parent;}
    if(k){if(o.userData.knochen)starr.push([o,k]);}else if(o.isMesh)weich.push(o);});
  // Hilfsknochen für den Bogen (ohne Hautbindung): hält den Bogen beim Schuss senkrecht
  if(klasse==='waldlaeufer'){const b=new THREE.Bone();b.name='bogen';B.handL.add(b);B.bogen=b;G.updateMatrixWorld(true);}
  for(const[o,k]of starr)B[k].attach(o);
  const sk=new THREE.Skeleton(liste);
  const armKn=m=>/^(schulter|ellbogen|hand)/.test(m),beinKn=m=>/^(huefte|knie|fuss)/.test(m);
  for(const o of weich){const g=o.geometry.clone();g.applyMatrix4(o.matrixWorld);const P=g.attributes.position,n=P.count,SI=new Uint16Array(n*4),SW=new Float32Array(n*4),v=new THREE.Vector3();
    // Kleidung über dem ganzen Rumpf (Robe, Umhang, Wappenrock, Wams …) folgt nicht den Armen und den Beinen nur gedämpft
    g.computeBoundingBox();const breit=g.boundingBox.min.x<-.12&&g.boundingBox.max.x>.12;
    for(let i=0;i<n;i++){v.fromBufferAttribute(P,i);
      const d=namen.map((m,j)=>{let a=abstand(v,strecke[m]);const sd=strecke[m][2];if(sd&&Math.abs(v.x)>.02&&Math.sign(v.x)!==sd)a=a*3+.05;
        if(breit&&armKn(m))a=9;if(armKn(m)&&Math.abs(v.x)<.2&&v.y<1.05)a=9;/* Hüfte und Hose nie an die Hand */if(breit&&beinKn(m))a=a*1.6+.02;return[a,j];}).sort((x,y)=>x[0]-y[0]);
      const w0=1/(Math.pow(d[0][0],4)+1e-9),w1=1/(Math.pow(d[1][0],4)+1e-9),ws=w0+w1;SI[i*4]=d[0][1];SI[i*4+1]=d[1][1];SW[i*4]=w0/ws;SW[i*4+1]=w1/ws;}
    g.setAttribute('skinIndex',new THREE.Uint16BufferAttribute(SI,4));g.setAttribute('skinWeight',new THREE.Float32BufferAttribute(SW,4));
    const m=new THREE.SkinnedMesh(g,o.material);m.castShadow=o.castShadow;m.receiveShadow=o.receiveShadow;m.frustumCulled=false;o.parent.remove(o);G.add(m);m.bind(sk,new THREE.Matrix4());}
  for(const c of[...G.children])if(c.isGroup&&!c.children.length)G.remove(c);
  G.userData.knochenListe=B;G.userData.pose=(art,t)=>menschPose(B,klasse,art,t);}
// Bewegungen der drei Klassen: Ruhe, Laufen (Schrittzyklus), Angriff (Krieger: Schwerthieb, Waldläufer: Bogenschuss, Magier: Zauberstoß)
function menschPose(B,klasse,art,t){
  for(const n in B)B[n].rotation.set(0,0,0);B.becken.position.y=.95;
  const mag=klasse==='magier';
  if(art==='idle'){const a=Math.sin(t*Math.PI*2);B.brust.rotation.x=a*.02;B.becken.position.y=.95+a*.003;return;}
  if(art==='walk'){const p=t*Math.PI*2,s=Math.sin(p),c=Math.cos(p);
    B.huefteR.rotation.x=-.45*s;B.huefteL.rotation.x=.45*s;
    B.knieR.rotation.x=.85*Math.max(0,c)*Math.max(0,s+.25);B.knieL.rotation.x=.85*Math.max(0,-c)*Math.max(0,-s+.25);
    B.fussR.rotation.x=.2*s;B.fussL.rotation.x=-.2*s;
    B.becken.position.y=.945+.022*Math.abs(c);B.becken.rotation.y=.08*s;B.rumpf.rotation.y=-.12*s;
    if(mag){B.schulterR.rotation.x=.06*s;B.schulterL.rotation.x=-.06*s;}
    else{B.schulterR.rotation.x=.35*s;B.schulterL.rotation.x=-.3*s;B.ellbogenR.rotation.x=-.15-.12*Math.max(0,s);B.ellbogenL.rotation.x=-.12-.12*Math.max(0,-s);}
    B.kopf.rotation.y=.05*s;return;}
  if(art==='attack'){
    const kf=K=>{const u=Math.min(.999,t)*(K.length-1),i=Math.floor(u),f=u-i;return K[i].map((v,n)=>v+(K[i+1][n]-v)*f);};
    if(klasse==='krieger'){const k=kf([[0,0,0,0],[-2.2,-.7,.3,.04],[-2.6,-1,.45,.02],[-.8,-.15,-.3,.15],[-.35,-.2,-.4,.12],[-.1,-.1,-.12,.06]]);
      B.schulterR.rotation.set(k[0],0,k[2]*.3);B.ellbogenR.rotation.x=k[1];B.rumpf.rotation.y=k[2];B.rumpf.rotation.x=k[3];B.schulterL.rotation.set(-.5,0,-.2);B.ellbogenL.rotation.x=-.4;}
    else if(klasse==='waldlaeufer'){const k=kf([[0,0,0],[-1.2,-.4,.5],[-1.45,-1.6,1],[-1.45,-1.7,1],[-1.45,-.4,.6],[-.4,-.1,.2]]);
      B.schulterL.rotation.x=-1.45*Math.min(1,k[2]*1.4);B.bogen.rotation.x=1.45*Math.min(1,k[2]*1.4);B.rumpf.rotation.y=.45*k[2];
      B.schulterR.rotation.x=k[0];B.ellbogenR.rotation.x=k[1];}
    else{const k=kf([[0,0,0],[-.35,.25,.1],[-.75,.4,.18],[-1,.1,.25],[-.5,0,.12],[-.15,0,.04]]);
      B.schulterL.rotation.x=k[0];B.ellbogenL.rotation.x=-k[0]*.3;B.schulterR.rotation.x=-k[1]*.6;B.rumpf.rotation.x=k[2];B.kopf.rotation.x=-k[2]*.5;}
    B.huefteL.rotation.x=-.4;B.knieL.rotation.x=.35;B.huefteR.rotation.x=.28;B.knieR.rotation.x=.2;B.becken.position.y=.925;}
}

// ---------- gemeinsame Teile für Krieger und Waldläufer ----------
// Beine mit Hose und Stiefeln, Arme hängend mit Händen; Werte wie bei der Startfigur
function beineUndStiefel(add,haut,hose,stiefel,dunkel,opt={}){
  for(const s of[-1,1]){
    const B=[[.088,.93,-.005,.09,.095,.1],[.093,.8,.005,.084,.09,.085],[.097,.66,.012,.072,.08,.068],[.099,.54,.01,.058,.058,.056],[.1,.49,.012,.052,.054,.05],
      [.101,.42,-.002,.055,.046,.062],[.102,.33,-.008,.053,.042,.06],[.103,.2,-.01,.04,.036,.042],[.104,.1,-.01,.034,.033,.035]];
    const bein=B.map(q=>({c:[s*q[0],q[1],q[2]],w:q[3],f:q[4],b:q[5]}));
    const H=bein.slice(0,7).map(q=>({c:q.c,w:Math.max(q.w,.06)+.015,f:Math.max(q.f,.06)+.014,b:Math.max(q.b,.062)+.014}));H[0]={c:[s*.084,.98,-.01],w:.12,f:.115,b:.13};
    add(querschnitte(H,{deckel:false,n:40}),hose);
    const sh=opt.hoch?.5:.4;
    add(querschnitte([{c:[s*.101,sh,-.004],w:.072,f:.068,b:.078},{c:[s*.102,sh-.1,-.008],w:.066,f:.058,b:.074},{c:[s*.104,.16,-.01],w:.052,f:.05,b:.056},{c:[s*.104,.08,-.006],w:.048,f:.052,b:.056}]),stiefel);
    add(querschnitte([{c:[s*.104,.05,-.06],w:.04,f:.03,b:.03},{c:[s*.104,.055,-.02],w:.046,f:.045,b:.045},{c:[s*.106,.045,.05],w:.05,f:.035,b:.035},{c:[s*.108,.035,.12],w:.044,f:.025,b:.025},{c:[s*.108,.03,.15],w:.03,f:.018,b:.018}].map(q=>({c:q.c,w:q.w,f:q.f,b:q.b,e:2.4})),{n:28}),stiefel);
    add(new THREE.BoxGeometry(.1,.016,.22),dunkel,s*.106,.008,.045);
  }}
// Arm von der Schulter zum Handgelenk (Haut), Ärmel/Rüstung darüber legt die Klasse selbst an
const ARMPUNKTE=s=>[[s*.17,1.405,0],[s*.205,1.33,.005],[s*.212,1.24,0],[s*.218,1.155,-.016],[s*.225,1.07,0],[s*.232,.97,.025],[s*.24,.89,.045]];
const ARMRADIEN=[[.05,.054,.052],[.052,.058,.05],[.047,.052,.044],[.04,.04,.04],[.044,.043,.038],[.036,.033,.03],[.029,.022,.022]];
function arm(add,s,haut){const A=ARMPUNKTE(s);add(querschnitte(A.map((c,i)=>({c,w:ARMRADIEN[i][0],f:ARMRADIEN[i][1],b:ARMRADIEN[i][2]}))),haut);hand(add,s,[s*.243,.88,.05],haut);return A;}
const ueber=(A,von,bis,plus)=>A.slice(von,bis).map((c,i)=>({c,w:ARMRADIEN[von+i][0]+plus,f:ARMRADIEN[von+i][1]+plus,b:ARMRADIEN[von+i][2]+plus}));
// Rumpfform (unter der Kleidung), daraus abgeleitet Wams, Wappenrock usw.
const RUMPFFORM=[[.84,.165,.1,.12],[.97,.172,.1,.12],[1.05,.16,.1,.1],[1.12,.152,.1,.096],[1.22,.164,.112,.1],[1.31,.178,.12,.102],[1.39,.19,.105,.095],[1.445,.165,.075,.075],[1.48,.08,.06,.065]];
const rumpf=(von,bis,plus,e)=>RUMPFFORM.filter(q=>q[0]>=von&&q[0]<=bis).map(q=>({c:[0,q[0],-.005],w:q[1]+plus,f:q[2]+plus,b:q[3]+plus,e:e||2.3}));
function hals(add,haut){add(querschnitte([{c:[0,1.43,-.012],w:.066,f:.06,b:.064},{c:[0,1.5,-.016],w:.06,f:.055,b:.06},{c:[0,1.56,-.02],w:.057,f:.05,b:.058},{c:[0,1.63,-.024],w:.054,f:.046,b:.056}],{deckel:false}),haut);}
function haare(K,L,M,art){const m=M({map:haarTex(L.haarfarbe),roughness:.85});
  if(art==='kurz'){const g=new THREE.SphereGeometry(.084,40,24,0,Math.PI*2,0,Math.PI*.6);const o=new THREE.Mesh(g,m);o.scale.set(.97,1.08,1.18);o.position.set(0,.03,-.016);o.rotation.x=-.42;o.castShadow=true;K.add(o);}
  if(art==='bart'){const b=new THREE.Mesh(bartGeo(),m);b.scale.setScalar(.995);K.add(b);}}

// ---------- Klasse Krieger: Kettenhemd, blauer Wappenrock mit Goldkreuz (Siegelwächter), Schulterplatten, Schwert und Schild ----------
function krieger(spec){
  const L=Object.assign({haut:'#c08a62',augen:'#4a5a6a',haarfarbe:'#4a3020',rock:'#22356f',borte:'#c9a24e',leder:'#5a3a22',hose:'#2a2420',stiefel:'#3a2616',groesse:1.8},spec);
  const M=o=>new THREE.MeshStandardMaterial(Object.assign({roughness:.8,metalness:0},o));
  const haut=M({map:koern(L.haut,8,3,4),roughness:.62}),kopfHaut=M({map:hautKopf(L.haut),roughness:.6}),
    kette=M({map:kettenTex(),roughness:.45,metalness:.75}),stahl=M({color:0x9aa2aa,roughness:.28,metalness:.9}),stahlD=M({color:0x5a6068,roughness:.35,metalness:.85}),
    rock=M({map:robenStoff(L.rock),roughness:.75,vertexColors:true}),borte=M({map:borteTex(L.borte),roughness:.4,metalness:.55}),gold=M({color:0xd0a848,roughness:.3,metalness:.8}),
    leder=M({map:koern(L.leder,22,11,10),roughness:.55}),hose=M({map:koern(L.hose,18,5,10),roughness:.95}),stiefel=M({map:koern(L.stiefel,20,9,10),roughness:.5}),
    holz=M({map:holzTex(),roughness:.75}),weiss=M({color:0xb8ab9c,roughness:.4}),iris=M({color:L.augen,roughness:.3}),dunkel=M({color:0x120c08,roughness:.4});
  let TAG=null;const G=new THREE.Group(),add=(g,m,x=0,y=0,z=0)=>{const o=new THREE.Mesh(g,m);o.position.set(x,y,z);o.castShadow=o.receiveShadow=true;if(TAG)o.userData.knochen=TAG;G.add(o);return o;};
  beineUndStiefel(add,haut,hose,stiefel,dunkel,{hoch:true});
  // Beinschienen über den Stiefeln
  for(const s of[-1,1])add(querschnitte([{c:[s*.101,.48,.02],w:.06,f:.058,b:.04},{c:[s*.102,.3,.012],w:.056,f:.052,b:.036}],{n:24}),stahl);
  // Kettenhemd: Rumpf bis zur Hüfte, Ärmel bis zum Ellbogen
  add(querschnitte(rumpf(.8,1.48,.016),{deckel:false,n:56}),kette);
  // Wappenrock: vorn und hinten bis über die Knie, an den Seiten offen (zwei Bahnen), Goldborte, Kreuz vorn
  for(const z of[1,-1]){const bahn=[];for(let k=0;k<=10;k++){const y=.58+k*.088,q=RUMPFFORM.reduce((a,b)=>Math.abs(b[0]-y)<Math.abs(a[0]-y)?b:a);const tief=(z>0?q[2]:q[3])+.03+(y<.95?(.95-y)*.08:0);bahn.push({c:[0,y,z*tief],w:Math.min(q[1]*.78,.15)+(y<.95?(.95-y)*.06:0),f:.006,b:.006});}
    add(querschnitte(bahn,{n:24,m:40,farbe:(p,t)=>.7+.3*t}),rock);
    add(querschnitte(bahn.map(q=>({c:[q.c[0],q.c[1],q.c[2]+z*.002],w:q.w+.006,f:.004,b:.004})).slice(0,2),{n:24,m:6}),borte);}
  add(new THREE.BoxGeometry(.03,.2,.006),gold,0,1.16,.155);add(new THREE.BoxGeometry(.13,.03,.006),gold,0,1.2,.155);
  // Gürtel
  add(querschnitte([{c:[0,.95,-.005],w:.2,f:.14,b:.15},{c:[0,.995,-.005],w:.198,f:.138,b:.148}],{deckel:false,n:56}),leder);add(new THREE.BoxGeometry(.05,.04,.012),gold,0,.973,.143);
  // Arme: Kettenärmel, Lederarmschienen, Schulterplatten
  for(const s of[-1,1]){const A=arm(add,s,haut);add(querschnitte(ueber(A,0,4,.012),{deckel:false,n:32}),kette);
    add(querschnitte(ueber(A,4,7,.008),{n:24}),leder);
    TAG=s<0?'schulterR':'schulterL';const sp=add(new THREE.SphereGeometry(.085,24,14,0,Math.PI*2,0,Math.PI*.5),stahl,s*.185,1.43,0);sp.scale.set(1.1,.75,1);sp.rotation.z=-s*.45;
    const sp2=add(new THREE.SphereGeometry(.078,24,12,0,Math.PI*2,0,Math.PI*.5),stahlD,s*.2,1.39,0);sp2.scale.set(1.05,.6,.95);sp2.rotation.z=-s*.55;TAG=null;}
  // Schwert in der rechten Hand (Spitze schräg nach vorn unten)
  const sw=new THREE.Group();sw.position.set(-.245,.83,.075);sw.rotation.set(.12,0,.04);sw.userData.knochen='handR';G.add(sw);
  const m2=(g,m,x,y,z)=>{const o=new THREE.Mesh(g,m);o.position.set(x,y,z);o.castShadow=true;sw.add(o);return o;};
  m2(new THREE.CylinderGeometry(.014,.014,.1,10),leder,0,.04,0);m2(new THREE.SphereGeometry(.02,12,8),gold,0,.1,0);m2(new THREE.BoxGeometry(.16,.02,.03),gold,0,-.015,0);
  m2(new THREE.BoxGeometry(.045,.58,.008),stahl,0,-.31,0);m2(new THREE.ConeGeometry(.023,.06,4),stahl,0,-.63,0).rotation.set(Math.PI,Math.PI/4,0);m2(new THREE.BoxGeometry(.01,.5,.01),stahlD,0,-.28,.002);
  // Schild am linken Arm: Tropfenform, blau mit goldenem Kreuz (Wappen der Siegelwächter), Stahlrand
  const sh=new THREE.Group();sh.position.set(.3,1.06,.06);sh.rotation.set(0,.95,0);sh.userData.knochen='ellbogenL';G.add(sh);
  const form=new THREE.Shape();form.moveTo(-.2,.24);form.lineTo(.2,.24);form.quadraticCurveTo(.21,-.05,0,-.3);form.quadraticCurveTo(-.21,-.05,-.2,.24);
  const sg=new THREE.ExtrudeGeometry(form,{depth:.025,bevelEnabled:true,bevelThickness:.012,bevelSize:.012,bevelSegments:3,curveSegments:24});
  const sm=new THREE.Mesh(sg,[M({map:robenStoff(L.rock),roughness:.55}),stahl]);sm.castShadow=true;sh.add(sm);
  const kr=(w,h,y)=>{const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,.012),gold);o.position.set(0,y,.045);sh.add(o);};kr(.055,.4,-.02);kr(.3,.055,.07);
  // Kettenkragen um den Hals
  add(querschnitte([{c:[0,1.44,-.01],w:.1,f:.09,b:.09},{c:[0,1.5,-.014],w:.074,f:.068,b:.07},{c:[0,1.545,-.018],w:.064,f:.058,b:.062}],{deckel:false,n:36}),kette);
  // Hals, Kopf mit kurzem Haar und Bartschatten
  hals(add,haut);const K=kopf(G,L,M,kopfHaut,{weiss,iris,dunkel});haare(K,L,M,'kurz');
  binde(G,'krieger');G.scale.setScalar((+L.groesse||1.8)/1.8);return G;}

// ---------- Klasse Waldläufer: grüner Kapuzenumhang, Lederwams, Bogen, Köcher mit Pfeilen ----------
function waldlaeufer(spec){
  const L=Object.assign({haut:'#c08a62',augen:'#4a6a3a',haarfarbe:'#5a3a20',umhang:'#2e4a26',wams:'#5e3e24',leder:'#4a3020',hose:'#3a3226',stiefel:'#3a2616',groesse:1.8},spec);
  const M=o=>new THREE.MeshStandardMaterial(Object.assign({roughness:.8,metalness:0},o));
  const haut=M({map:koern(L.haut,8,3,4),roughness:.62}),kopfHaut=M({map:hautKopf(L.haut),roughness:.6}),
    umhang=M({map:robenStoff(L.umhang),roughness:.85,vertexColors:true}),umhangKap=M({map:robenStoff(L.umhang),roughness:.85}),futter=M({color:0x10140c,roughness:1,side:THREE.BackSide}),
    wams=M({map:koern(L.wams,26,23,10),roughness:.55}),leder=M({map:koern(L.leder,22,11,10),roughness:.55}),hemd=M({map:robenStoff('#5a5a3e'),roughness:.9}),
    hose=M({map:koern(L.hose,18,5,10),roughness:.95}),stiefel=M({map:koern(L.stiefel,20,9,10),roughness:.5}),messing=M({color:0xb08a3c,roughness:.35,metalness:.8}),
    holz=M({map:holzTex(),roughness:.7}),feder=M({color:0xd8d0c0,roughness:.8}),sehne=M({color:0xd8cfb0,roughness:.6}),
    weiss=M({color:0xb8ab9c,roughness:.4}),iris=M({color:L.augen,roughness:.3}),dunkel=M({color:0x120c08,roughness:.4});
  let TAG=null;const G=new THREE.Group(),add=(g,m,x=0,y=0,z=0)=>{const o=new THREE.Mesh(g,m);o.position.set(x,y,z);o.castShadow=o.receiveShadow=true;if(TAG)o.userData.knochen=TAG;G.add(o);return o;};
  beineUndStiefel(add,haut,hose,stiefel,dunkel,{hoch:true});
  // Hemd darunter, Lederwams mit Schnürung, Gürtel mit Tasche und Messer
  add(querschnitte(rumpf(.9,1.48,.012),{deckel:false,n:56}),hemd);
  add(querschnitte(rumpf(.82,1.44,.022,2.5),{deckel:false,n:56}),wams);
  for(let i=0;i<5;i++)add(new THREE.BoxGeometry(.05,.006,.006),leder,0,1.0+i*.08,.142+(i>2?-.01:0)).rotation.z=(i%2?.4:-.4);
  add(querschnitte([{c:[0,.95,-.005],w:.2,f:.14,b:.15},{c:[0,.99,-.005],w:.198,f:.138,b:.148}],{deckel:false,n:56}),leder);add(new THREE.BoxGeometry(.04,.035,.012),messing,0,.97,.143);
  add(rundKasten(.08,.09,.04,.01),leder,.17,.9,.08).rotation.y=.6;add(new THREE.BoxGeometry(.025,.16,.02),leder,-.17,.88,.09).rotation.z=.15;
  // Arme mit Hemdärmeln und Armschienen
  for(const s of[-1,1]){const A=arm(add,s,haut);add(querschnitte(ueber(A,0,5,.012),{deckel:false,n:32}),hemd);add(querschnitte(ueber(A,4,7,.01),{n:24}),leder);}
  // Kapuzenumhang: Kapuze auf, Umhang bis zu den Waden, vorn offen
  const falten=(amp,k,ph)=>(p,t)=>{const r=Math.atan2(p.x,p.z),d=amp*Math.pow(t,1.2)*(Math.sin(r*k+ph)+.45*Math.sin(r*k*2.3+ph*1.7));p.x+=Math.sin(r)*d;p.z+=Math.cos(r)*d;};
  const U=[[1.47,.17,.11,.125],[1.4,.235,.14,.15],[1.25,.25,.15,.17],[1.0,.255,.15,.19],[.7,.27,.15,.21],[.42,.29,.15,.23]];
  const um=querschnitte(U.map(q=>({c:[0,q[0],-.015],w:q[1],f:q[2],b:q[3]})).reverse(),{deckel:false,n:64,m:60,form:falten(.016,9,.4),farbe:(p,t)=>{const r=Math.atan2(p.x,p.z);return .55+.45*(.5+.5*Math.sin(r*9+.4))*(1-t*.3);}});
  // vorn öffnen: Dreiecke entfernen, deren Punkte vorn in der Mitte liegen
  {const P=um.attributes.position,I=um.index.array,neu=[];for(let k=0;k<I.length;k+=3){let vorn=true;for(let q=0;q<3;q++){const x=P.getX(I[k+q]),z=P.getZ(I[k+q]),y=P.getY(I[k+q]);if(!(z>0&&Math.abs(x)<.12+(1.3-y)*.12))vorn=false;}if(!vorn)neu.push(I[k],I[k+1],I[k+2]);}um.setIndex(neu);}
  const um2=new THREE.Mesh(um,M({map:robenStoff(L.umhang),roughness:.85,vertexColors:true,side:THREE.DoubleSide}));um2.castShadow=um2.receiveShadow=true;G.add(um2);
  TAG='kopf';add(kapuze(),umhangKap,0,1.682,.006);const fu=add(kapuze(),futter,0,1.682,.006);fu.scale.setScalar(.985);TAG='brust';
  add(new THREE.TorusGeometry(.022,.006,8,16),messing,-.09,1.46,.1);TAG=null;
  // Köcher auf dem Rücken mit Pfeilen
  const kq=new THREE.Group();kq.position.set(.08,1.25,-.17);kq.rotation.set(-.12,0,-.45);kq.userData.knochen='brust';G.add(kq);
  const k1=new THREE.Mesh(new THREE.CylinderGeometry(.045,.04,.5,16,1,true),leder);k1.castShadow=true;kq.add(k1);
  for(let i=0;i<6;i++){const a=i*1.1,pf=new THREE.Group();pf.position.set(Math.sin(a)*.022,.25,Math.cos(a)*.022);kq.add(pf);
    const st=new THREE.Mesh(new THREE.CylinderGeometry(.004,.004,.12,6),holz);st.position.y=.04;pf.add(st);
    for(let f=0;f<3;f++){const fe=new THREE.Mesh(new THREE.BoxGeometry(.002,.05,.016),feder);fe.position.y=.08;fe.rotation.y=f*Math.PI/3*2;pf.add(fe);}}
  add(querschnitte([{c:[-.14,1.4,.12],w:.015,f:.003,b:.003},{c:[0,1.2,.155],w:.015,f:.003,b:.003},{c:[.16,1.0,.13],w:.015,f:.003,b:.003}],{n:10,m:20}),leder);
  TAG='bogen';
  // Langbogen in der linken Hand, senkrecht, mit Sehne
  const bx=.27,bz=.09,bogen=[];for(let k=0;k<=16;k++){const t=k/16,y=.35+t*1.2,c=Math.sin(t*Math.PI);bogen.push({c:[bx,y,bz+c*.13],w:.012-.004*Math.abs(t-.5),f:.013,b:.013});}
  add(querschnitte(bogen,{n:10,m:60}),holz);add(new THREE.CylinderGeometry(.0018,.0018,1.2,4),sehne,bx,.95,bz);
  add(new THREE.CylinderGeometry(.018,.018,.1,10),leder,bx,.95,bz+.13);TAG=null;
  // Hals, Kopf mit Bart unter der Kapuze
  hals(add,haut);const K=kopf(G,L,M,kopfHaut,{weiss,iris,dunkel});haare(K,L,M,'bart');
  binde(G,'waldlaeufer');G.scale.setScalar((+L.groesse||1.8)/1.8);return G;}
// ---------- Gegner Skelettkrieger (Zielbild des Auftraggebers, Spiel-Rev 125) ----------
// Knochen mit Gelenkköpfen, Schädel mit Augenhöhlen und Zähnen, Brustkorb aus Rippenbögen; Lederschulterstücke mit Nieten,
// Brustriemen, Gürtel mit runder Schnalle, zerrissener roter Lendenschurz, Lederstiefel, Schwert und runder Holzschild mit Eisenrand.
function skelett(spec){
  const L=Object.assign({knochen:'#c4b592',tuch:'#7a2a1e',leder:'#5a3a22',stiefel:'#3a2616',groesse:1.8},spec);
  const M=o=>new THREE.MeshStandardMaterial(Object.assign({roughness:.8,metalness:0},o));
  const kn=M({map:koern(L.knochen,26,51,8),roughness:.6}),knD=M({map:koern(heller(L.knochen,.78),26,53,8),roughness:.65}),loch=M({color:0x0c0806,roughness:1}),
    leder=M({map:koern(L.leder,24,11,10),roughness:.55}),stiefel=M({map:koern(L.stiefel,20,9,10),roughness:.5}),eisen=M({color:0x7a7470,roughness:.4,metalness:.8}),
    stahl=M({color:0xa8aeb4,roughness:.25,metalness:.9}),stahlD=M({color:0x60666c,roughness:.35,metalness:.85}),
    tuch=M({map:robenStoff(L.tuch),roughness:.9,vertexColors:true,side:THREE.DoubleSide}),dunkel=M({color:0x120c08,roughness:.4});
  // Gelenkgerüst: jedes Gelenk eine Gruppe; Teile werden in den Koordinaten ihres Gelenks angelegt
  const J=(p,x,y,z)=>{const g=new THREE.Group();g.position.set(x,y,z);p.add(g);return g;};
  const an=(p,g,m,x=0,y=0,z=0)=>{const o=new THREE.Mesh(g,m);o.position.set(x,y,z);o.castShadow=o.receiveShadow=true;p.add(o);return o;};
  const kugel=(p,r,m,x,y,z)=>an(p,new THREE.SphereGeometry(r,14,10),m,x,y,z);
  const knochen=(p,a,b,r0,r1)=>{const A=new THREE.Vector3(...a),B=new THREE.Vector3(...b),c=A.clone().lerp(B,.5),rm=Math.min(r0,r1)*.72;
    an(p,querschnitte([{c:a,w:r0,f:r0,b:r0},{c:c.toArray(),w:rm,f:rm,b:rm},{c:b,w:r1,f:r1,b:r1}],{n:12,m:12}),kn);kugel(p,r0*1.25,knD,...a);kugel(p,r1*1.25,knD,...b);};
  const G=new THREE.Group(),R={};
  R.becken=J(G,0,.93,0);
  // Becken, Gürtel mit runder Schnalle, Lendenschurz vorn und hinten (unten zerrissen)
  const be=an(R.becken,new THREE.TorusGeometry(.08,.025,10,24,Math.PI*1.4),kn);be.rotation.set(Math.PI/2,0,Math.PI*.8);be.scale.set(1.25,.85,1);
  an(R.becken,querschnitte([{c:[0,.025,0],w:.15,f:.1,b:.1},{c:[0,.07,0],w:.145,f:.097,b:.097}],{deckel:false,n:40}),leder);
  an(R.becken,new THREE.TorusGeometry(.025,.008,8,20),eisen,0,.048,.103);an(R.becken,new THREE.CylinderGeometry(.017,.017,.008,16),stahlD,0,.048,.1).rotation.x=Math.PI/2;
  R.schurz=[];
  for(const z of[1,-1]){const S2=J(R.becken,0,.04,z*.1);R.schurz.push(S2);const bahn=[];for(let k=0;k<=6;k++){const y=-k*.05;bahn.push({c:[0,y,z*k*.007],w:.11+k*.007,f:.004,b:.004});}
    an(S2,querschnitte(bahn,{n:28,m:24,form:(p,t,u)=>{const zack=Math.max(0,t-.6)/.4;p.y+=zack*(.06*Math.abs(Math.sin(u*31))+.03*Math.sin(u*13));p.z+=z*.01*Math.sin(u*17);},farbe:(p,t,u)=>.6+.4*Math.abs(Math.sin(u*9))*(1-t*.4)}),tuch);}
  // Wirbelsäule und Brustkorb (Gelenk über dem Becken)
  R.rumpf=J(R.becken,0,.03,0);
  for(let i=0;i<14;i++){const t=i/13,y=-.01+t*.55,z=-.035-.03*Math.sin(t*Math.PI)+t*.03;kugel(R.rumpf,.017-.004*t,i%2?knD:kn,0,y,z);}
  for(let i=0;i<6;i++)for(const s of[-1,1]){const y=.44-i*.05,br=.1+.03*Math.sin((i+1.2)/7*Math.PI),pts=[];
    for(let k=0;k<=10;k++){const a=k/10*Math.PI*.92;pts.push(new THREE.Vector3(s*Math.sin(a)*br*1.05,y-Math.pow(k/10,1.6)*.05,-Math.cos(a)*br*.7+(k/10)*.06));}
    an(R.rumpf,new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),20,.0075,6,false),kn);}
  an(R.rumpf,querschnitte([{c:[0,.43,.098],w:.016,f:.008,b:.008},{c:[0,.26,.1],w:.014,f:.008,b:.008}],{n:10,m:10}),kn);
  for(const s of[-1,1])knochen(R.rumpf,[s*.02,.48,.07],[s*.16,.49,.02],.011,.013);
  {const rr=[];for(let k=0;k<=10;k++){const t=k/10;rr.push({c:[.15-t*.3,.48-t*.48,.115-.02*Math.sin(t*Math.PI)],w:.016,f:.004,b:.004});}an(R.rumpf,querschnitte(rr,{n:10,m:30}),leder);}
  for(const s of[-1,1]){const sp=an(R.rumpf,new THREE.SphereGeometry(.075,22,12,0,Math.PI*2,0,Math.PI*.5),leder,s*.18,.48,0);sp.scale.set(1.1,.7,1.05);sp.rotation.z=-s*.5;
    for(let k=0;k<4;k++){const a=k/3*Math.PI-Math.PI/2;an(R.rumpf,new THREE.SphereGeometry(.007,8,6),eisen,s*(.21+.018*Math.cos(a)),.49-.01*k,.05*Math.sin(a));}
    if(s<0){const s2=an(R.rumpf,new THREE.SphereGeometry(.07,22,12,0,Math.PI*2,0,Math.PI*.5),leder,s*.2,.44,0);s2.scale.set(1.05,.55,1);s2.rotation.z=.6;}}
  // Hals und Schädel
  for(let i=0;i<3;i++)kugel(R.rumpf,.018,i%2?knD:kn,0,.56+i*.035,-.01);
  R.kopf=J(R.rumpf,0,.67,.01);R.kopf.rotation.x=.08;
  const kk=(g,m,x,y,z,sx=1,sy=1,sz=1)=>{const o=an(R.kopf,g,m,x,y,z);o.scale.set(sx,sy,sz);return o;};
  kk(new THREE.SphereGeometry(.088,32,24),kn,0,.028,-.005,.88,.98,1.05);kk(new THREE.SphereGeometry(.07,24,16),kn,0,-.02,.03,.9,.85,.95);
  for(const s of[-1,1]){kk(new THREE.SphereGeometry(.024,16,12),loch,s*.033,0,.077,1,.9,.7);kk(new THREE.SphereGeometry(.016,12,8),kn,s*.055,-.025,.058,1,.7,1);}
  kk(new THREE.ConeGeometry(.012,.026,3),loch,0,-.033,.088,1,1,.5).rotation.x=Math.PI;
  kk(new THREE.BoxGeometry(.07,.02,.04),kn,0,-.06,.058);for(let i=-3;i<=3;i++)kk(new THREE.BoxGeometry(.008,.012,.006),knD,i*.0095,-.072,.079);
  R.kiefer=J(R.kopf,0,-.07,.02);an(R.kiefer,new THREE.BoxGeometry(.07,.026,.05),kn,0,-.022,.028);for(let i=-3;i<=3;i++)an(R.kiefer,new THREE.BoxGeometry(.008,.011,.006),knD,i*.0095,-.011,.054);
  for(const s of[-1,1])an(R.kiefer,new THREE.BoxGeometry(.012,.05,.05),kn,s*.04,-.005,0).rotation.x=.3;
  // Arme: Schulter → Ellbogen → Hand, rechts Schwert, links Schild
  const ARM={'-1':[[-.18,.46,0],[-.06,-.27,.03],[-.02,-.23,.09]],'1':[[.18,.46,0],[.07,-.24,.06],[-.02,-.12,.19]]};
  for(const s of[-1,1]){const[sh,el,wr]=ARM[s],k=s<0?'R':'L';
    const S1=R['schulter'+k]=J(R.rumpf,...sh);knochen(S1,[0,0,0],el,.02,.017);
    const E=R['ellbogen'+k]=J(S1,...el);knochen(E,[0,0,0],wr,.016,.013);knochen(E,[s*.012,0,0],[wr[0]+s*.012,wr[1],wr[2]],.011,.009);
    const H=R['hand'+k]=J(E,...wr);const dir=new THREE.Vector3(...wr).normalize();const HH=J(H,0,0,0);HH.quaternion.setFromUnitVectors(new THREE.Vector3(0,-1,0),dir);
    an(HH,new THREE.BoxGeometry(.035,.045,.03),kn,0,-.03,0);for(let f=0;f<4;f++)for(let g=0;g<3;g++)an(HH,new THREE.SphereGeometry(.007,8,6),kn,-.013+f*.009,-.06-g*.016,.012+g*.008);}
  // Schwert in der rechten Hand
  const sw=J(R.handR,-.005,-.04,.0);sw.rotation.set(-.45,0,.05);R.schwert=sw;
  const m2=(g,m,x,y,z)=>an(sw,g,m,x,y,z);
  m2(new THREE.CylinderGeometry(.013,.013,.1,10),leder,0,.04,0);m2(new THREE.SphereGeometry(.018,10,8),eisen,0,.1,0);m2(new THREE.BoxGeometry(.15,.018,.026),eisen,0,-.015,0);
  m2(new THREE.BoxGeometry(.045,.62,.008),stahl,0,-.33,0);m2(new THREE.ConeGeometry(.023,.06,4),stahl,0,-.67,0).rotation.set(Math.PI,Math.PI/4,0);m2(new THREE.BoxGeometry(.01,.54,.01),stahlD,0,-.3,.002);
  // Runder Holzschild am linken Unterarm
  const sh=J(R.ellbogenL,-.0,-.1,.12);sh.rotation.set(0,.9,0);
  const sm=(g,m,x,y,z)=>an(sh,g,m,x,y,z);
  sm(new THREE.CylinderGeometry(.2,.2,.025,40),M({map:schildTex(),roughness:.7}),0,0,0).rotation.x=Math.PI/2;sm(new THREE.TorusGeometry(.2,.012,10,48),eisen,0,0,0);
  for(let k=0;k<16;k++){const a=k/16*Math.PI*2;sm(new THREE.SphereGeometry(.007,8,6),eisen,Math.cos(a)*.185,Math.sin(a)*.185,.015);}
  sm(new THREE.SphereGeometry(.05,20,12,0,Math.PI*2,0,Math.PI*.5),stahl,0,0,.012).rotation.x=Math.PI/2;
  // Beine: Hüfte → Knie → Fuß, Stiefel am Unterschenkel und Fuß
  for(const s of[-1,1]){const k=s<0?'R':'L';
    const HU=R['huefte'+k]=J(R.becken,s*.09,-.03,0);knochen(HU,[0,0,0],[s*.012,-.4,.03],.024,.02);
    const KN=R['knie'+k]=J(HU,s*.012,-.4,.03);an(KN,new THREE.SphereGeometry(.03,14,10),knD,0,0,.017);knochen(KN,[0,0,0],[s*.01,-.4,-.04],.02,.016);
    an(KN,querschnitte([{c:[s*.004,-.14,-.01],w:.064,f:.062,b:.07},{c:[s*.006,-.24,-.022],w:.058,f:.054,b:.064},{c:[s*.01,-.35,-.034],w:.05,f:.05,b:.056},{c:[s*.01,-.42,-.036],w:.048,f:.052,b:.056}]),stiefel);
    an(KN,querschnitte([{c:[s*.004,-.125,-.01],w:.072,f:.07,b:.078},{c:[s*.004,-.16,-.01],w:.07,f:.068,b:.076}],{deckel:false,n:24}),leder);
    const FU=R['fuss'+k]=J(KN,s*.01,-.4,-.04);
    an(FU,querschnitte([{c:[0,-.05,-.05],w:.04,f:.03,b:.03},{c:[0,-.045,-.01],w:.046,f:.045,b:.045},{c:[s*.002,-.055,.06],w:.05,f:.035,b:.035},{c:[s*.004,-.065,.13],w:.044,f:.025,b:.025},{c:[s*.004,-.07,.16],w:.03,f:.018,b:.018}].map(q=>({c:q.c,w:q.w,f:q.f,b:q.b,e:2.4})),{n:24}),stiefel);
    an(FU,new THREE.BoxGeometry(.1,.016,.22),dunkel,s*.002,-.092,.055);}
  G.scale.setScalar((+L.groesse||1.8)/1.8);
  G.userData.gelenke=R;G.userData.pose=(art,t)=>skelettPose(R,art,t);skelettPose(R,'idle',0);
  return G;}
// Bewegungen des Skeletts: Ruhe, Laufen (Schrittzyklus), Angriff (Schwerthieb von oben)
function skelettPose(R,art,t){
  const set=(g,x=0,y=0,z=0)=>g.rotation.set(x,y,z);
  R.becken.position.y=.93;set(R.becken);set(R.rumpf,.12,0,0);set(R.kopf,-.04,0,0);set(R.kiefer);
  set(R.schulterR,0,0,.05);set(R.ellbogenR);set(R.handR);set(R.schulterL,0,0,-.05);set(R.ellbogenL);set(R.handL);
  set(R.huefteR,-.04,0,.06);set(R.knieR,.08);set(R.fussR,-.04);set(R.huefteL,.04,0,-.06);set(R.knieL,.08);set(R.fussL,-.04);
  for(const sc of R.schurz)set(sc);
  if(art==='idle'){const a=Math.sin(t*Math.PI*2);R.becken.position.y=.93+a*.004;R.rumpf.rotation.x=.12+a*.015;R.kiefer.rotation.x=Math.max(0,a)*.06;}
  else if(art==='walk'){const p=t*Math.PI*2,s=Math.sin(p),c=Math.cos(p);
    R.huefteR.rotation.x=-.48*s;R.huefteL.rotation.x=.48*s;
    R.knieR.rotation.x=.12+.9*Math.max(0,c)*Math.max(0,s+.25);R.knieL.rotation.x=.12+.9*Math.max(0,-c)*Math.max(0,-s+.25);
    R.fussR.rotation.x=.25*s-.05;R.fussL.rotation.x=-.25*s-.05;
    R.becken.position.y=.925+.03*Math.abs(c);R.becken.rotation.y=.1*s;R.rumpf.rotation.y=-.16*s;R.rumpf.rotation.z=.03*c;
    R.schulterR.rotation.x=.3*s;R.schulterL.rotation.x=-.2*s;R.ellbogenR.rotation.x=-.15-.15*Math.max(0,s);
    R.kopf.rotation.y=.08*s;R.schurz[0].rotation.x=-.25*Math.abs(s);R.schurz[1].rotation.x=.18*Math.abs(s);}
  else if(art==='attack'){
    // Schlüsselbilder: ausholen über den Kopf, zuschlagen nach vorn unten, zurück
    const KF=[[0,0,0,0,.12],[-2.3,-.6,.35,.25,.05],[-2.7,-.9,.5,.3,0],[-.9,-.1,-.3,-.25,.32],[-.4,-.25,-.45,-.3,.28],[-.1,-.1,-.15,-.1,.18]];
    const u=Math.min(.999,t)*(KF.length-1),i=Math.floor(u),f=u-i,k=KF[i].map((v,n)=>v+(KF[i+1][n]-v)*f);
    R.schulterR.rotation.set(k[0],0,.05+k[2]*.4);R.ellbogenR.rotation.x=k[1];R.rumpf.rotation.y=k[3];R.rumpf.rotation.x=k[4];
    R.schulterL.rotation.set(-.35,0,-.15);R.ellbogenL.rotation.x=-.3;
    R.huefteL.rotation.x=-.45;R.knieL.rotation.x=.4;R.huefteR.rotation.x=.3;R.knieR.rotation.x=.25;R.becken.position.y=.9;R.kiefer.rotation.x=.12;}
}
// Schildbretter: senkrechte Holzbretter mit Fugen
function schildTex(){return tex(128,128,(g,w,h)=>{g.fillStyle='#5a3c22';g.fillRect(0,0,w,h);for(let x=0;x<w;x+=21){g.fillStyle=`rgba(${(x*7)%40+20},${(x*5)%20+10},0,.25)`;g.fillRect(x,0,21,h);g.fillStyle='rgba(20,10,4,.7)';g.fillRect(x,0,2,h);}
  for(let k=0;k<30;k++){g.strokeStyle='rgba(30,15,5,.35)';g.beginPath();const x=Math.random()*w;g.moveTo(x,0);g.bezierCurveTo(x+4,h/3,x-4,h*2/3,x+2,h);g.stroke();}rausch(g,w,h,18,57);},1);}
// Kettengeflecht: versetzte Ringe
function kettenTex(){return tex(128,128,(g,w,h)=>{g.fillStyle='#4a4e54';g.fillRect(0,0,w,h);
  for(let y=0;y<h;y+=8)for(let x=0;x<w;x+=8){const ox=(y/8)%2?4:0;g.strokeStyle='rgba(200,206,214,.75)';g.lineWidth=2;g.beginPath();g.arc(x+ox,y,3.2,0,Math.PI*2);g.stroke();g.strokeStyle='rgba(20,22,26,.6)';g.beginPath();g.arc(x+ox+.8,y+.8,3.2,Math.PI*.1,Math.PI*.9);g.stroke();}
  rausch(g,w,h,14,43);},40);}

// ---------- Wolf (Gegner Wolf, Frostwolf, Aschenhund; seit Spiel-Rev 127, nach der Baubeschreibung des Auftraggebers) ----------
// Maße: Schulterhöhe 0,8 m, Körper 1,3 m, Schwanz 0,45 m; schlank, tiefer Brustkorb, eingezogene Taille, keilförmiger Kopf. Blickrichtung +z.
const WOLFFELL={
  wolf:{ruecken:'#393A37',flanke:'#77766F',bauch:'#B8B4A6',nase:'#1D1B1A',augen:'#E4B94A'},
  frostwolf:{ruecken:'#D7DDE0',flanke:'#A3B3BE',bauch:'#F0F2EE',nase:'#303B46',augen:'#81DFFF',pfoten:'#7d8a94'},
  aschenhund:{ruecken:'#171819',flanke:'#292729',bauch:'#414040',nase:'#0D0C0C',augen:'#FF741C',risse:'#E64A18'}};
const linF=h=>{const c=new THREE.Color(h);return[c.r,c.g,c.b].map(v=>Math.pow(v,2.2));};
const mischF=(a,b,t)=>{t=Math.max(0,Math.min(1,t));return a.map((v,i)=>v+(b[i]-v)*t);};
const glatt=(a,b,x)=>{const t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t);};
// Körper in Längsrichtung (z): Schnitte {z, y, w (halbe Breite), u (nach unten), o (nach oben)}; gebaut stehend, dann umgelegt
function liegend(S,opt={}){const g=querschnitte(S.map(q=>({c:[q.x||0,q.z,-q.y],w:q.w,f:q.u,b:q.o,e:q.e||2.2})),opt);g.rotateX(Math.PI/2);return g;}
// Fell zottelig machen: Punkte entlang der Flächennormale versetzen (Menge je Punkt aus maske)
function zotteln(g,maske,staerke){g.computeVertexNormals();const P=g.attributes.position,N=g.attributes.normal,v=new THREE.Vector3();
  for(let i=0;i<P.count;i++){v.fromBufferAttribute(P,i);const m=maske(v);if(m<=0)continue;
    const n=.5+.5*Math.sin(v.x*157+v.y*91)*Math.sin(v.z*133+v.y*61)+.25*Math.sin(v.x*311+v.z*277);
    const d=staerke*m*Math.max(0,n);P.setXYZ(i,v.x+N.getX(i)*d,v.y+N.getY(i)*d,v.z+N.getZ(i)*d);}
  P.needsUpdate=true;g.computeVertexNormals();return g;}
function fellTex(){return tex(128,128,(g,w,h)=>{g.fillStyle='#e6e6e6';g.fillRect(0,0,w,h);
  for(let k=0;k<1400;k++){const x=Math.random()*w,y=Math.random()*h;g.strokeStyle=Math.random()<.55?'rgba(0,0,0,.32)':'rgba(255,255,255,.35)';g.lineWidth=1;
    g.beginPath();g.moveTo(x,y);g.lineTo(x+(Math.random()-.5)*2,y+5+Math.random()*7);g.stroke();}},7);}
function wolf(spec){
  const art=WOLFFELL[spec.fell]?spec.fell:'wolf',L=WOLFFELL[art];
  const RU=linF(L.ruecken),FL=linF(L.flanke),BA=linF(L.bauch),PF=L.pfoten?linF(L.pfoten):mischF(FL,RU,.35);
  const M=o=>new THREE.MeshStandardMaterial(Object.assign({roughness:.85,metalness:0},o));
  const fell=M({map:fellTex(),vertexColors:true,roughness:.92}),nase=M({color:L.nase,roughness:.35}),
    zahn=M({color:0xe8e0cc,roughness:.4}),rachen=M({color:0x3a1212,roughness:.6}),
    auge=new THREE.MeshStandardMaterial({color:0x000000,emissive:L.augen,emissiveIntensity:1.6,roughness:.2,toneMapped:false}),
    narbe=M({color:0x8e7068,roughness:.7});
  const J=(p,x,y,z)=>{const g=new THREE.Group();g.position.set(x,y,z);p.add(g);return g;};
  const an=(p,g,m,x=0,y=0,z=0)=>{const o=new THREE.Mesh(g,m);o.position.set(x,y,z);o.castShadow=o.receiveShadow=true;p.add(o);return o;};
  // Farbe je Ringwinkel: h = 0 unten (Bauch), 1 oben (Rücken)
  const hoehe=u=>(1-Math.cos(Math.PI+u*Math.PI*2))/2;
  const rumpfFarbe=(p,t,u)=>{const h=hoehe(u),seite=Math.abs(Math.sin(Math.PI+u*Math.PI*2));
    let f=mischF(BA,FL,glatt(.15,.5,h));f=mischF(f,RU,glatt(.62,.92,h));if(h>.9&&seite<.25)f=mischF(f,RU.map(v=>v*.7),.6);return f;};
  const G=new THREE.Group(),R={};
  R.rumpf=J(G,0,0,0);
  // Rumpf: Kruppe → eingezogene Taille → tiefer Brustkorb → Brust
  const RS=[{z:-.47,y:.64,w:.05,u:.05,o:.04},{z:-.4,y:.635,w:.1,u:.11,o:.09},{z:-.3,y:.63,w:.112,u:.13,o:.1},{z:-.17,y:.625,w:.095,u:.09,o:.09},
    {z:-.04,y:.625,w:.11,u:.14,o:.1},{z:.1,y:.635,w:.13,u:.2,o:.13},{z:.22,y:.645,w:.125,u:.21,o:.15},{z:.32,y:.635,w:.1,u:.17,o:.11},{z:.39,y:.63,w:.06,u:.1,o:.06}];
  an(R.rumpf,zotteln(liegend(RS,{n:44,m:72,farbe:rumpfFarbe}),p=>glatt(.08,.28,p.z)*.6+glatt(.5,.66,p.y)*.2+(p.y<.48?.25:0),.016),fell);
  // Hals mit struppiger Mähne
  R.hals=J(R.rumpf,0,.7,.28);R.hals.rotation.x=-.1;
  an(R.hals,zotteln(liegend([{z:-.08,y:-.03,w:.11,u:.15,o:.11},{z:.06,y:.04,w:.095,u:.12,o:.11},{z:.18,y:.1,w:.075,u:.09,o:.085},{z:.26,y:.13,w:.06,u:.07,o:.065}],
    {n:40,m:40,farbe:(p,t,u)=>{const h=hoehe(u);return mischF(mischF(BA,FL,glatt(.25,.55,h)),RU,glatt(.7,.95,h));}}),()=>1,.016),fell);
  // Kopf: breiter Schädel, keilförmige Schnauze, Unterkiefer als eigenes Gelenk
  R.kopf=J(R.hals,0,.13,.24);R.kopf.rotation.x=.18;
  const kopfFarbe=(p,t,u)=>{const h=hoehe(u),seite=Math.abs(Math.sin(Math.PI+u*Math.PI*2));let f=mischF(BA,FL,glatt(.3,.6,h));
    if(t<.45)f=mischF(f,RU,glatt(.75,1,h)*.7);if(t>.75)f=mischF(f,RU.map(v=>v*.8),glatt(.55,.9,h)*.6);if(t>.4&&t<.7&&seite>.8&&h<.55)f=mischF(f,BA,.6);return f;};
  an(R.kopf,liegend([{z:-.08,y:.01,w:.065,u:.065,o:.065},{z:-.02,y:.012,w:.076,u:.07,o:.074},{z:.04,y:.0,w:.066,u:.06,o:.06},{z:.09,y:-.014,w:.048,u:.046,o:.044},
    {z:.145,y:-.022,w:.036,u:.032,o:.034},{z:.19,y:-.026,w:.026,u:.022,o:.026}],{n:36,m:48,farbe:kopfFarbe}),fell);
  // Wangenfell
  for(const s of[-1,1]){const w=an(R.kopf,new THREE.SphereGeometry(.05,16,12),fell,s*.05,-.03,.0);w.scale.set(.7,.9,1.2);
    const gw=w.geometry,C=[];for(let i=0;i<gw.attributes.position.count;i++)C.push(...mischF(BA,FL,.35));gw.setAttribute('color',new THREE.Float32BufferAttribute(C,3));}
  an(R.kopf,new THREE.SphereGeometry(.021,16,12),nase,0,-.012,.195).scale.set(1.1,.85,.9);
  for(const s of[-1,1]){
    an(R.kopf,new THREE.SphereGeometry(.0115,14,10),auge,s*.04,.03,.056).scale.set(1,.7,.8);
    const br=an(R.kopf,new THREE.SphereGeometry(.018,12,8),fell,s*.044,.044,.05);br.scale.set(1.2,.45,.8);
    {const gw=br.geometry,C=[];for(let i=0;i<gw.attributes.position.count;i++)C.push(...RU);gw.setAttribute('color',new THREE.Float32BufferAttribute(C,3));}
    // angelegte Ohren
    const oh=J(R.kopf,s*.046,.064,-.04);oh.rotation.set(-.85,0,-s*.35);
    const og=new THREE.ConeGeometry(.037,.1,12,1);og.translate(0,.047,0);const C=[];for(let i=0;i<og.attributes.position.count;i++)C.push(...mischF(FL,RU,.6));
    og.setAttribute('color',new THREE.Float32BufferAttribute(C,3));an(oh,og,fell).scale.set(1,1,.45);
    an(oh,new THREE.ConeGeometry(.018,.06,10,1).translate(0,.032,.007),rachen).scale.set(1,1,.3);
    // Fangzähne oben
    an(R.kopf,new THREE.ConeGeometry(.0045,.022,6).rotateX(Math.PI),zahn,s*.016,-.048,.158);}
  // kleine Narbe über dem linken Auge (links = +x)
  an(R.kopf,new THREE.BoxGeometry(.004,.032,.004),narbe,.05,.052,.045).rotation.set(.3,0,.5);
  // Lefzen: dunkle Mundlinie, darunter der Rachen
  an(R.kopf,liegend([{z:.03,y:-.045,w:.045,u:.006,o:.004},{z:.17,y:-.042,w:.024,u:.005,o:.004}],{n:16,m:12}),nase);
  an(R.kopf,liegend([{z:.0,y:-.05,w:.038,u:.012,o:.004},{z:.15,y:-.047,w:.02,u:.008,o:.004}],{n:16,m:12}),rachen);
  R.kiefer=J(R.kopf,0,-.046,.02);
  an(R.kiefer,liegend([{z:-.04,y:-.012,w:.044,u:.024,o:.008},{z:.06,y:-.012,w:.034,u:.02,o:.008},{z:.15,y:-.01,w:.02,u:.013,o:.006}],
    {n:24,m:24,farbe:()=>mischF(BA,FL,.25)}),fell);
  for(const s of[-1,1])an(R.kiefer,new THREE.ConeGeometry(.004,.018,6),zahn,s*.013,.004,.13);
  // Beine: vorn Schulter → Ellbogen → Pfote, hinten Hüfte → Knie → Sprunggelenk → Pfote
  const beinFarbe=s=>(p,t,u)=>{const th=Math.PI+u*Math.PI*2,innen=Math.sin(th)*s<0?1:0,vorn=Math.max(0,Math.cos(th));
    let f=mischF(FL,BA,(innen*.55+glatt(.4,1,t)*.35)*glatt(.1,.35,t));f=mischF(f,RU,vorn*glatt(.2,.6,t)*.3);return f;};
  const pfote=(p,s)=>{const pg=new THREE.SphereGeometry(.036,16,12),C=[];for(let i=0;i<pg.attributes.position.count;i++)C.push(...PF);
    pg.setAttribute('color',new THREE.Float32BufferAttribute(C,3));const o=an(p,pg,fell,0,.004,.028);o.scale.set(.8,.75,1.25);
    for(let k=-1;k<=1;k++)an(p,new THREE.ConeGeometry(.004,.012,5).rotateX(Math.PI/2+.6),nase,k*.012+s*.002,-.012,.075);};
  R.vorn=[];R.hinten=[];
  for(const s of[-1,1]){
    const SH=J(R.rumpf,s*.085,.62,.2),EL=J(SH,0,-.21,-.025),PW=J(EL,0,-.27,.005),PP=J(PW,0,-.115,.012);
    an(SH,querschnitte([{c:[0,.02,.02],w:0.065,f:0.088,b:0.077},{c:[0,-.06,0],w:0.059,f:0.077,b:0.071},{c:[0,-.17,-.02],w:0.047,f:0.053,b:0.053},{c:[0,-.23,-.025],w:0.040,f:0.042,b:0.047}],{n:24,m:24,deckel:false,farbe:beinFarbe(s)}),fell);
    an(EL,querschnitte([{c:[0,.02,0],w:0.038,f:0.040,b:0.047},{c:[0,-.1,.004],w:0.031,f:0.033,b:0.035},{c:[0,-.22,.006],w:0.025,f:0.026,b:0.026},{c:[0,-.28,.006],w:0.024,f:0.026,b:0.024}],{n:20,m:20,deckel:false,farbe:beinFarbe(s)}),fell);
    an(PW,querschnitte([{c:[0,.01,0],w:0.025,f:0.026,b:0.024},{c:[0,-.07,.008],w:0.024,f:0.026,b:0.021},{c:[0,-.11,.014],w:0.026,f:0.031,b:0.021}],{n:18,m:12,deckel:false,farbe:()=>mischF(FL,PF,.5)}),fell);
    pfote(PP,s);R.vorn.push([SH,EL,PW,PP]);
    const HU=J(R.rumpf,s*.08,.64,-.35),KN=J(HU,0,-.23,.09),SP=J(KN,0,-.25,-.11),HP=J(SP,0,-.145,.02);
    an(HU,zotteln(querschnitte([{c:[0,.0,-.02],w:0.073,f:0.106,b:0.106},{c:[0,-.06,.01],w:0.076,f:0.118,b:0.106},{c:[0,-.16,.06],w:0.057,f:0.071,b:0.077},{c:[0,-.24,.09],w:0.040,f:0.042,b:0.047}],{n:28,m:28,deckel:false,farbe:beinFarbe(s)}),p=>p.z<-.02&&p.y<-.04?1:0,.016),fell);
    an(KN,querschnitte([{c:[0,.02,0],w:0.038,f:0.042,b:0.047},{c:[0,-.12,-.05],w:0.031,f:0.031,b:0.047},{c:[0,-.22,-.095],w:0.024,f:0.024,b:0.028},{c:[0,-.26,-.11],w:0.026,f:0.024,b:0.031}],{n:20,m:20,deckel:false,farbe:beinFarbe(s)}),fell);
    an(SP,querschnitte([{c:[0,.01,0],w:0.024,f:0.024,b:0.028},{c:[0,-.08,.01],w:0.021,f:0.024,b:0.021},{c:[0,-.14,.018],w:0.025,f:0.028,b:0.021}],{n:18,m:12,deckel:false,farbe:()=>mischF(FL,PF,.5)}),fell);
    pfote(HP,s);R.hinten.push([HU,KN,SP,HP]);}
  // buschiger Schwanz mit dunkler Spitze, in zwei Gelenken
  R.schwanz=J(R.rumpf,0,.665,-.45);R.schwanz.rotation.x=.55;R.schwanz2=null;
  {const T1=[{c:[0,0,0],w:.035,f:.035,b:.035},{c:[0,-.07,-.02],w:.05,f:.052,b:.055},{c:[0,-.17,-.03],w:.062,f:.065,b:.068},{c:[0,-.24,-.03],w:.064,f:.066,b:.07}];
    const T2=[{c:[0,0,0],w:.064,f:.066,b:.07},{c:[0,-.08,.005],w:.058,f:.06,b:.064},{c:[0,-.16,.01],w:.04,f:.042,b:.044},{c:[0,-.22,.012],w:.012,f:.012,b:.012}];
    const sf=(von,bis)=>(p,t,u)=>{const tt=von+(bis-von)*t,oben=Math.max(0,-Math.cos(Math.PI+u*Math.PI*2));return mischF(mischF(mischF(FL,BA,(1-oben)*.4),RU,oben*.6),RU.map(v=>v*.55),glatt(.78,.95,tt));};
    an(R.schwanz,zotteln(querschnitte(T1,{n:24,m:24,farbe:sf(0,.5)}),()=>1,.018),fell);
    R.schwanz2=J(R.schwanz,0,-.24,-.03);an(R.schwanz2,zotteln(querschnitte(T2,{n:24,m:24,farbe:sf(.5,1)}),()=>1,.018),fell);}
  // Aschenhund: glühende Risse an Schultern und Flanken
  if(L.risse){const glut=new THREE.MeshBasicMaterial({color:L.risse,toneMapped:false});
    const breite=z=>{for(let i=0;i<RS.length-1;i++)if(z>=RS[i].z&&z<=RS[i+1].z){const f=(z-RS[i].z)/(RS[i+1].z-RS[i].z),A=RS[i],B=RS[i+1];return{w:A.w+(B.w-A.w)*f,y:A.y+(B.y-A.y)*f,u:A.u+(B.u-A.u)*f,o:A.o+(B.o-A.o)*f};}return RS[0];};
    const RISSE=[[[.26,.02],[.21,.05],[.16,.0],[.11,.04]],[[.19,-.07],[.14,-.04],[.09,-.09],[.04,-.06]],[[.02,.04],[-.05,.07],[-.11,.03]],[[-.16,-.02],[-.23,.02],[-.3,-.03],[-.36,.0]]];
    for(const s of[-1,1])for(const r of RISSE){const pts=r.map(([z,dy])=>{const q=breite(z),h=dy>0?q.o:q.u,x=q.w*Math.sqrt(Math.max(0,1-Math.pow(dy/h,2)));return new THREE.Vector3(s*(x+.004),q.y+dy,z);});
      an(R.rumpf,new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),16,.0042,5,false),glut).castShadow=false;}}
  G.userData.gelenke=R;G.userData.pose=(a,t)=>wolfPose(R,a,t);wolfPose(R,'idle',0);
  return G;}
// Bewegungen des Wolfs: Ruhe (Atmen, Schwanz), Laufen (Trab: diagonale Beinpaare), Angriff (ducken, Sprung mit offenem Maul, Biss, zurück)
function wolfPose(R,art,t){
  R.rumpf.position.set(0,0,0);R.rumpf.rotation.set(0,0,0);R.hals.rotation.set(-.1,0,0);R.kopf.rotation.set(.18,0,0);R.kiefer.rotation.set(.04,0,0);
  R.schwanz.rotation.set(.55,0,0);R.schwanz2.rotation.set(.12,0,0);
  for(const B of[...R.vorn,...R.hinten])for(const g of B)g.rotation.set(0,0,0);
  const bein=(B,a,b,c,d=0)=>{B[0].rotation.x=a;B[1].rotation.x=b;B[2].rotation.x=c;B[3].rotation.x=d;};
  if(art==='idle'){const a=Math.sin(t*Math.PI*2);R.rumpf.position.y=a*.004;R.hals.rotation.x=-.1+a*.02;R.schwanz.rotation.z=.12*a;R.schwanz2.rotation.z=.15*a;R.kiefer.rotation.x=.04+Math.max(0,a)*.03;return;}
  if(art==='walk'){const p=t*Math.PI*2;
    // Trab: vorn links mit hinten rechts, vorn rechts mit hinten links
    for(let i=0;i<2;i++){const ph=p+(i?Math.PI:0),s=Math.sin(ph),c=Math.cos(ph),hebt=Math.max(0,c);
      bein(R.vorn[i],-.42*s,.95*hebt*Math.max(0,s+.3),.45*hebt,-.3*hebt);
      const ph2=p+(i?0:Math.PI),s2=Math.sin(ph2),c2=Math.cos(ph2),hebt2=Math.max(0,c2);
      bein(R.hinten[i],-.38*s2,-.45*hebt2,.7*hebt2,-.25*hebt2);}
    R.rumpf.position.y=.016*Math.cos(2*p);R.rumpf.rotation.z=.025*Math.sin(p);R.hals.rotation.x=-.06+.04*Math.cos(2*p);R.kopf.rotation.x=.12;
    R.schwanz.rotation.z=.22*Math.sin(p);R.schwanz2.rotation.z=.25*Math.sin(p-.8);R.schwanz.rotation.x=.75;return;}
  if(art==='attack'){
    // Schlüsselbilder: [vor, hoch, Neigung, Vorderbein, Hinterbein, Hals, Kopf, Kiefer]
    const KF=[[0,0,0,0,0,-.1,.18,.04],[-.04,-.07,.05,.25,.45,.2,.3,.12],[.16,.1,-.2,-.9,.75,-.35,-.25,.75],[.24,.02,.1,-.35,.3,.15,.35,.15],[.12,0,.04,-.1,.1,0,.2,.08],[.03,0,0,0,0,-.08,.18,.04]];
    const u=Math.min(.999,t)*(KF.length-1),i=Math.floor(u),f=u-i,k=KF[i].map((v,n)=>v+(KF[i+1][n]-v)*f);
    R.rumpf.position.set(0,k[1],k[0]);R.rumpf.rotation.x=k[2];R.hals.rotation.x=k[5];R.kopf.rotation.x=k[6];R.kiefer.rotation.x=k[7];
    for(const B of R.vorn)bein(B,k[3],k[3]<0?-k[3]*.3:k[3]*1.6,k[3]<0?.2:-k[3]*.8);
    for(const B of R.hinten)bein(B,k[4]>.3?-k[4]*.5:k[4],k[4]>.3?-k[4]*.4:-k[4],k[4]*1.1);
    R.schwanz.rotation.x=.55-k[2]*2;}
}
function bau(spec={}){return spec.klasse==='magier'?magier(spec):spec.klasse==='krieger'?krieger(spec):spec.klasse==='waldlaeufer'?waldlaeufer(spec):spec.klasse==='skelett'?skelett(spec):spec.klasse==='wolf'?wolf(spec):startfigur(spec);}
window.Figur={bau,querschnitte,flackern,pose:(G,art,t)=>G.userData.pose&&G.userData.pose(art,t)};
})();
