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
// Die Achse ergibt sich aus der Folge der Mitten; „vorn“ ist +z, „seitlich“ steht senkrecht darauf.
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
      if(vor)bogen+=p.distanceTo(vor);vor=p;P.push(p.x,p.y,p.z);UV.push(bogen,vlaenge);if(opt.farbe){const f=opt.farbe(p,r/M,j/N);CO.push(f,f,f);}}}
  for(let r=0;r<M;r++)for(let j=0;j<N;j++){const a=r*(N+1)+j,b=a+N+1;I.push(a,b,a+1,a+1,b,b+1);}
  // Umlaufsinn prüfen: Flächen müssen nach außen zeigen (sonst blendet three.js sie aus)
  {const r=Math.floor(M/2),a=r*(N+1)+Math.floor(N/4),b=a+N+1,q=k=>V(P[k*3],P[k*3+1],P[k*3+2]);
    const n=q(b).sub(q(a)).cross(q(a+1).sub(q(a))),aus=q(a).sub(ringe[r].c);if(n.dot(aus)<0)for(let k=0;k<I.length;k+=3){const t=I[k+1];I[k+1]=I[k+2];I[k+2]=t;}}
  if(deckel){const fl=I.length&&I[1]!==N+1;for(const r of[0,M]){const mi=P.length/3,C=ringe[r].c;P.push(C.x,C.y,C.z);UV.push(0,0);if(opt.farbe)CO.push(1,1,1);
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
  const K=new THREE.Group();K.position.set(0,1.682,.006);G.add(K);
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
  const G=new THREE.Group(),add=(g,m,x=0,y=0,z=0)=>{const o=new THREE.Mesh(g,m);o.position.set(x,y,z);o.castShadow=o.receiveShadow=true;G.add(o);return o;};
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
  add(kapuze(),robeKap,0,1.682,.006);add(kapuzenRand(),borte,0,1.682,.006);
  const fu=add(kapuze(),futter,0,1.682,.006);fu.scale.setScalar(.985);
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
    const H=handGruppe(s,haut),dir=new THREE.Vector3(...wr).sub(new THREE.Vector3(...el)).normalize();
    H.position.set(...wr);H.quaternion.setFromUnitVectors(new THREE.Vector3(0,-1,0),dir);
    if(s>0)H.quaternion.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,-1,0),-Math.PI/2));   // linke Handfläche nach oben
    G.add(H);
  }
  // leuchtende Kugel über der linken Hand
  const ku=ARM['1'][2],kp=[ku[0]+.01,ku[1]+.06,ku[2]+.07];
  leuchte(G,kp,.028,L.stein,3.4,1.25,stein,1.7);
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
  // Stab in der rechten Hand: gedrehtes Holz, Krone aus vier Klauen, leuchtender Stein mit blauem Licht
  const sx=-.262,sz=.235;
  add(querschnitte([{c:[sx,.02,sz],w:.016,f:.016,b:.016},{c:[sx,.9,sz],w:.019,f:.019,b:.019},{c:[sx,1.6,sz],w:.018,f:.018,b:.018},{c:[sx,1.86,sz],w:.024,f:.024,b:.024}],{n:14,m:60,form:(p,t)=>{const a=t*40;p.x+=.003*Math.sin(a);p.z+=.003*Math.cos(a);}}),holz);
  for(let k=0;k<4;k++){const a=k*Math.PI/2+.4,kl=[];for(let q=0;q<=6;q++){const t=q/6,r=.025+.03*Math.sin(t*Math.PI*.9),y=1.86+t*.13;kl.push({c:[sx+Math.sin(a)*r,y,sz+Math.cos(a)*r],w:.007*(1-t*.6),f:.007*(1-t*.6),b:.007*(1-t*.6)});}add(querschnitte(kl,{n:10,m:20}),holz);}
  leuchte(G,[sx,1.94,sz],.032,L.stein,3.4,1.3,stein,0);
  G.scale.setScalar((+L.groesse||1.8)/1.8);
  return G;}

// Leuchtender Stein: Kern, zwei Lichthöfe und ein farbiges Punktlicht; Figur.flackern(G, t) bewegt sie
function leuchte(G,pos,r,farbe,staerke,reichweite,kernMat,phase){
  const kern=new THREE.Mesh(new THREE.SphereGeometry(r,24,18),kernMat);kern.position.set(...pos);G.add(kern);
  const hof=k=>{const m=new THREE.Mesh(new THREE.SphereGeometry(r*k,20,14),new THREE.MeshBasicMaterial({color:new THREE.Color(farbe).multiplyScalar(.6),transparent:true,opacity:.5/k,blending:THREE.AdditiveBlending,depthWrite:false,toneMapped:false}));m.position.set(...pos);G.add(m);return m;};
  const h1=hof(1.8),h2=hof(4.2),licht=new THREE.PointLight(farbe,staerke,reichweite,2);licht.position.set(pos[0],pos[1],pos[2]+.02);G.add(licht);
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
  const G=new THREE.Group(),add=(g,m,x=0,y=0,z=0)=>{const o=new THREE.Mesh(g,m);o.position.set(x,y,z);o.castShadow=o.receiveShadow=true;G.add(o);return o;};
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
    const sp=add(new THREE.SphereGeometry(.085,24,14,0,Math.PI*2,0,Math.PI*.5),stahl,s*.185,1.43,0);sp.scale.set(1.1,.75,1);sp.rotation.z=-s*.45;
    const sp2=add(new THREE.SphereGeometry(.078,24,12,0,Math.PI*2,0,Math.PI*.5),stahlD,s*.2,1.39,0);sp2.scale.set(1.05,.6,.95);sp2.rotation.z=-s*.55;}
  // Schwert in der rechten Hand (Spitze schräg nach vorn unten)
  const sw=new THREE.Group();sw.position.set(-.245,.83,.075);sw.rotation.set(.12,0,.04);G.add(sw);
  const m2=(g,m,x,y,z)=>{const o=new THREE.Mesh(g,m);o.position.set(x,y,z);o.castShadow=true;sw.add(o);return o;};
  m2(new THREE.CylinderGeometry(.014,.014,.1,10),leder,0,.04,0);m2(new THREE.SphereGeometry(.02,12,8),gold,0,.1,0);m2(new THREE.BoxGeometry(.16,.02,.03),gold,0,-.015,0);
  m2(new THREE.BoxGeometry(.045,.58,.008),stahl,0,-.31,0);m2(new THREE.ConeGeometry(.023,.06,4),stahl,0,-.63,0).rotation.set(Math.PI,Math.PI/4,0);m2(new THREE.BoxGeometry(.01,.5,.01),stahlD,0,-.28,.002);
  // Schild am linken Arm: Tropfenform, blau mit goldenem Kreuz (Wappen der Siegelwächter), Stahlrand
  const sh=new THREE.Group();sh.position.set(.3,1.06,.06);sh.rotation.set(0,.95,0);G.add(sh);
  const form=new THREE.Shape();form.moveTo(-.2,.24);form.lineTo(.2,.24);form.quadraticCurveTo(.21,-.05,0,-.3);form.quadraticCurveTo(-.21,-.05,-.2,.24);
  const sg=new THREE.ExtrudeGeometry(form,{depth:.025,bevelEnabled:true,bevelThickness:.012,bevelSize:.012,bevelSegments:3,curveSegments:24});
  const sm=new THREE.Mesh(sg,[M({map:robenStoff(L.rock),roughness:.55}),stahl]);sm.castShadow=true;sh.add(sm);
  const kr=(w,h,y)=>{const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,.012),gold);o.position.set(0,y,.045);sh.add(o);};kr(.055,.4,-.02);kr(.3,.055,.07);
  // Kettenkragen um den Hals
  add(querschnitte([{c:[0,1.44,-.01],w:.1,f:.09,b:.09},{c:[0,1.5,-.014],w:.074,f:.068,b:.07},{c:[0,1.545,-.018],w:.064,f:.058,b:.062}],{deckel:false,n:36}),kette);
  // Hals, Kopf mit kurzem Haar und Bartschatten
  hals(add,haut);const K=kopf(G,L,M,kopfHaut,{weiss,iris,dunkel});haare(K,L,M,'kurz');
  G.scale.setScalar((+L.groesse||1.8)/1.8);return G;}

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
  const G=new THREE.Group(),add=(g,m,x=0,y=0,z=0)=>{const o=new THREE.Mesh(g,m);o.position.set(x,y,z);o.castShadow=o.receiveShadow=true;G.add(o);return o;};
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
  add(kapuze(),umhangKap,0,1.682,.006);const fu=add(kapuze(),futter,0,1.682,.006);fu.scale.setScalar(.985);
  add(new THREE.TorusGeometry(.022,.006,8,16),messing,-.09,1.46,.1);
  // Köcher auf dem Rücken mit Pfeilen
  const kq=new THREE.Group();kq.position.set(.08,1.25,-.17);kq.rotation.set(-.12,0,-.45);G.add(kq);
  const k1=new THREE.Mesh(new THREE.CylinderGeometry(.045,.04,.5,16,1,true),leder);k1.castShadow=true;kq.add(k1);
  for(let i=0;i<6;i++){const a=i*1.1,pf=new THREE.Group();pf.position.set(Math.sin(a)*.022,.25,Math.cos(a)*.022);kq.add(pf);
    const st=new THREE.Mesh(new THREE.CylinderGeometry(.004,.004,.12,6),holz);st.position.y=.04;pf.add(st);
    for(let f=0;f<3;f++){const fe=new THREE.Mesh(new THREE.BoxGeometry(.002,.05,.016),feder);fe.position.y=.08;fe.rotation.y=f*Math.PI/3*2;pf.add(fe);}}
  add(querschnitte([{c:[-.14,1.4,.12],w:.015,f:.003,b:.003},{c:[0,1.2,.155],w:.015,f:.003,b:.003},{c:[.16,1.0,.13],w:.015,f:.003,b:.003}],{n:10,m:20}),leder);
  // Langbogen in der linken Hand, senkrecht, mit Sehne
  const bx=.27,bz=.09,bogen=[];for(let k=0;k<=16;k++){const t=k/16,y=.35+t*1.2,c=Math.sin(t*Math.PI);bogen.push({c:[bx,y,bz+c*.13],w:.012-.004*Math.abs(t-.5),f:.013,b:.013});}
  add(querschnitte(bogen,{n:10,m:60}),holz);add(new THREE.CylinderGeometry(.0018,.0018,1.2,4),sehne,bx,.95,bz);
  add(new THREE.CylinderGeometry(.018,.018,.1,10),leder,bx,.95,bz+.13);
  // Hals, Kopf mit Bart unter der Kapuze
  hals(add,haut);const K=kopf(G,L,M,kopfHaut,{weiss,iris,dunkel});haare(K,L,M,'bart');
  G.scale.setScalar((+L.groesse||1.8)/1.8);return G;}
// ---------- Gegner Skelettkrieger (Zielbild des Auftraggebers, Spiel-Rev 125) ----------
// Knochen mit Gelenkköpfen, Schädel mit Augenhöhlen und Zähnen, Brustkorb aus Rippenbögen; Lederschulterstücke mit Nieten,
// Brustriemen, Gürtel mit runder Schnalle, zerrissener roter Lendenschurz, Lederstiefel, Schwert und runder Holzschild mit Eisenrand.
function skelett(spec){
  const L=Object.assign({knochen:'#c4b592',tuch:'#7a2a1e',leder:'#5a3a22',stiefel:'#3a2616',groesse:1.8},spec);
  const M=o=>new THREE.MeshStandardMaterial(Object.assign({roughness:.8,metalness:0},o));
  const kn=M({map:koern(L.knochen,26,51,8),roughness:.6}),knD=M({map:koern(heller(L.knochen,.78),26,53,8),roughness:.65}),loch=M({color:0x0c0806,roughness:1}),
    leder=M({map:koern(L.leder,24,11,10),roughness:.55}),stiefel=M({map:koern(L.stiefel,20,9,10),roughness:.5}),eisen=M({color:0x7a7470,roughness:.4,metalness:.8}),
    stahl=M({color:0xa8aeb4,roughness:.25,metalness:.9}),stahlD=M({color:0x60666c,roughness:.35,metalness:.85}),holz=M({map:holzTex(),roughness:.75}),
    tuch=M({map:robenStoff(L.tuch),roughness:.9,vertexColors:true,side:THREE.DoubleSide}),dunkel=M({color:0x120c08,roughness:.4});
  const G=new THREE.Group(),add=(g,m,x=0,y=0,z=0)=>{const o=new THREE.Mesh(g,m);o.position.set(x,y,z);o.castShadow=o.receiveShadow=true;G.add(o);return o;};
  const kugel=(r,m,x,y,z)=>add(new THREE.SphereGeometry(r,14,10),m,x,y,z);
  // Knochen zwischen zwei Punkten mit Gelenkköpfen an beiden Enden
  const knochen=(a,b,r0,r1)=>{const A=new THREE.Vector3(...a),B=new THREE.Vector3(...b),m=A.clone().lerp(B,.5);
    add(querschnitte([{c:a,w:r0,f:r0,b:r0},{c:m.toArray(),w:Math.min(r0,r1)*.72,f:Math.min(r0,r1)*.72,b:Math.min(r0,r1)*.72},{c:b,w:r1,f:r1,b:r1}],{n:12,m:12}),kn);
    kugel(r0*1.25,knD,...a);kugel(r1*1.25,knD,...b);};
  // Beine im breiten Stand, Knie leicht gebeugt, Stiefel ab der Wade
  for(const s of[-1,1]){const hu=[s*.09,.9,0],kn2=[s*.13,.5,.05],fu=[s*.15,.1,-.01];knochen(hu,kn2,.024,.02);knochen(kn2,fu,.02,.016);
    add(new THREE.SphereGeometry(.03,14,10),knD,s*.13,.5,.065);                                                        // Kniescheibe
    add(querschnitte([{c:[s*.142,.36,.02],w:.064,f:.062,b:.07},{c:[s*.146,.26,.008],w:.058,f:.054,b:.064},{c:[s*.15,.15,-.004],w:.05,f:.05,b:.056},{c:[s*.15,.08,-.006],w:.048,f:.052,b:.056}]),stiefel);
    add(querschnitte([{c:[s*.142,.375,.02],w:.072,f:.07,b:.078},{c:[s*.142,.34,.02],w:.07,f:.068,b:.076}],{deckel:false,n:24}),leder);
    add(querschnitte([{c:[s*.15,.05,-.06],w:.04,f:.03,b:.03},{c:[s*.15,.055,-.02],w:.046,f:.045,b:.045},{c:[s*.152,.045,.05],w:.05,f:.035,b:.035},{c:[s*.154,.035,.12],w:.044,f:.025,b:.025},{c:[s*.154,.03,.15],w:.03,f:.018,b:.018}].map(q=>({c:q.c,w:q.w,f:q.f,b:q.b,e:2.4})),{n:24}),stiefel);
    add(new THREE.BoxGeometry(.1,.016,.22),dunkel,s*.152,.008,.045);}
  // Becken
  const be=add(new THREE.TorusGeometry(.08,.025,10,24,Math.PI*1.4),kn,0,.93,0);be.rotation.set(Math.PI/2,0,Math.PI*.8);be.scale.set(1.25,.85,1);
  // Wirbelsäule leicht nach vorn gebeugt, Brustkorb aus Rippenbögen, Brustbein, Schlüsselbeine
  for(let i=0;i<14;i++){const t=i/13,y=.95+t*.55,z=-.035-.03*Math.sin(t*Math.PI)+t*.03;kugel(.017-.004*t,i%2?knD:kn,0,y,z);}
  // Rippen: je Seite ein Bogen von der Wirbelsäule nach vorn und abwärts zum Brustbein (vorn offen)
  for(let i=0;i<6;i++)for(const s of[-1,1]){const y=1.4-i*.05,br=.1+.03*Math.sin((i+1.2)/7*Math.PI),pts=[];
    for(let k=0;k<=10;k++){const a=k/10*Math.PI*.92,x=s*Math.sin(a)*br*1.05,z=-.04-Math.cos(a)*br*.7+.04,yy=y-Math.pow(k/10,1.6)*.05;pts.push(new THREE.Vector3(x,yy,z+(k/10)*.06));}
    add(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),20,.0075,6,false),kn);}
  add(querschnitte([{c:[0,1.39,.098],w:.016,f:.008,b:.008},{c:[0,1.22,.1],w:.014,f:.008,b:.008}],{n:10,m:10}),kn);
  for(const s of[-1,1])knochen([s*.02,1.44,.07],[s*.16,1.45,.02],.011,.013);
  // Arme: rechts mit Schwert gesenkt, links angewinkelt mit Schild
  const AR={'-1':[[-.18,1.42,0],[-.24,1.15,.03],[-.26,.92,.12]],'1':[[.18,1.42,0],[.25,1.18,.06],[.23,1.06,.25]]};
  for(const s of[-1,1]){const[sh,el,wr]=AR[s];knochen(sh,el,.02,.017);knochen(el,wr,.016,.013);
    knochen([el[0]+s*.012,el[1],el[2]],[wr[0]+s*.012,wr[1],wr[2]],.011,.009);                                          // zweiter Unterarmknochen
    const H=new THREE.Group();H.position.set(...wr);const dir=new THREE.Vector3(...wr).sub(new THREE.Vector3(...el)).normalize();H.quaternion.setFromUnitVectors(new THREE.Vector3(0,-1,0),dir);G.add(H);
    const hk=(g,x,y,z)=>{const o=new THREE.Mesh(g,kn);o.position.set(x,y,z);o.castShadow=true;H.add(o);};
    hk(new THREE.BoxGeometry(.035,.045,.03),0,-.03,0);for(let f=0;f<4;f++)for(let g=0;g<3;g++)hk(new THREE.SphereGeometry(.007,8,6),-.013+f*.009,-.06-g*.016,.012+g*.008);}
  // Schulterstücke aus Leder mit Nieten, rechts zweilagig
  for(const s of[-1,1]){const sp=add(new THREE.SphereGeometry(.075,22,12,0,Math.PI*2,0,Math.PI*.5),leder,s*.18,1.44,0);sp.scale.set(1.1,.7,1.05);sp.rotation.z=-s*.5;
    for(let k=0;k<4;k++){const a=k/3*Math.PI-Math.PI/2;add(new THREE.SphereGeometry(.007,8,6),eisen,s*(.18+.06*Math.cos(a)*.3)+s*.03,1.45-.01*k,.05*Math.sin(a));}
    if(s<0){const s2=add(new THREE.SphereGeometry(.07,22,12,0,Math.PI*2,0,Math.PI*.5),leder,s*.2,1.4,0);s2.scale.set(1.05,.55,1);s2.rotation.z=.6;}}
  // Brustriemen von der linken Schulter zur rechten Hüfte, Gürtel mit runder Schnalle
  {const rr=[];for(let k=0;k<=10;k++){const t=k/10,y=1.44-t*.48,x=.15-t*.3;rr.push({c:[x,y,.115-.02*Math.sin(t*Math.PI)],w:.016,f:.004,b:.004});}add(querschnitte(rr,{n:10,m:30}),leder);}
  add(querschnitte([{c:[0,.955,0],w:.15,f:.1,b:.1},{c:[0,1.0,0],w:.145,f:.097,b:.097}],{deckel:false,n:40}),leder);
  add(new THREE.TorusGeometry(.025,.008,8,20),eisen,0,.978,.103);add(new THREE.CylinderGeometry(.017,.017,.008,16),stahlD,0,.978,.1).rotation.x=Math.PI/2;
  // Lendenschurz vorn und hinten: unten zerrissen (Zacken), Falten schattiert
  for(const z of[1,-1]){const bahn=[];for(let k=0;k<=6;k++){const y=.97-k*.05;bahn.push({c:[0,y,z*(.1+k*.007)],w:.11+k*.007,f:.004,b:.004});}
    const g=querschnitte(bahn,{n:28,m:24,form:(p,t,u)=>{const zack=Math.max(0,t-.6)/.4;p.y+=zack*(.06*Math.abs(Math.sin(u*31))+.03*Math.sin(u*13));p.z+=z*.01*Math.sin(u*17);},farbe:(p,t,u)=>.6+.4*Math.abs(Math.sin(u*9))*(1-t*.4)});
    add(g,tuch);}
  // Schädel: Hirnschale, Wangenknochen, Augenhöhlen, Nasenloch, Oberkiefer mit Zähnen, Unterkiefer
  const K=new THREE.Group();K.position.set(0,1.66,.01);K.rotation.x=.08;G.add(K);
  const kk=(g,m,x,y,z,sx=1,sy=1,sz=1)=>{const o=new THREE.Mesh(g,m);o.position.set(x,y,z);o.scale.set(sx,sy,sz);o.castShadow=true;K.add(o);return o;};
  kk(new THREE.SphereGeometry(.088,32,24),kn,0,.028,-.005,.88,.98,1.05);
  kk(new THREE.SphereGeometry(.07,24,16),kn,0,-.02,.03,.9,.85,.95);
  for(const s of[-1,1]){kk(new THREE.SphereGeometry(.024,16,12),loch,s*.033,-.0,.077,1,.9,.7);kk(new THREE.SphereGeometry(.016,12,8),kn,s*.055,-.025,.058,1,.7,1);}
  kk(new THREE.ConeGeometry(.012,.026,3),loch,0,-.033,.088,1,1,.5).rotation.x=Math.PI;
  kk(new THREE.BoxGeometry(.07,.02,.04),kn,0,-.06,.058);for(let i=-3;i<=3;i++)kk(new THREE.BoxGeometry(.008,.012,.006),knD,i*.0095,-.072,.079);
  const kie=kk(new THREE.BoxGeometry(.07,.026,.05),kn,0,-.092,.048);for(let i=-3;i<=3;i++)kk(new THREE.BoxGeometry(.008,.011,.006),knD,i*.0095,-.081,.074);
  for(const s of[-1,1])kk(new THREE.BoxGeometry(.012,.05,.05),kn,s*.04,-.075,.02).rotation.x=.3;
  // Hals aus Wirbeln
  for(let i=0;i<3;i++)kugel(.018,i%2?knD:kn,0,1.52+i*.035,-.01);
  // Schwert in der rechten Hand, Spitze schräg nach vorn unten
  const sw=new THREE.Group();sw.position.set(-.265,.88,.13);sw.rotation.set(-.45,0,.05);G.add(sw);
  const m2=(g,m,x,y,z)=>{const o=new THREE.Mesh(g,m);o.position.set(x,y,z);o.castShadow=true;sw.add(o);return o;};
  m2(new THREE.CylinderGeometry(.013,.013,.1,10),leder,0,.04,0);m2(new THREE.SphereGeometry(.018,10,8),eisen,0,.1,0);m2(new THREE.BoxGeometry(.15,.018,.026),eisen,0,-.015,0);
  m2(new THREE.BoxGeometry(.045,.62,.008),stahl,0,-.33,0);m2(new THREE.ConeGeometry(.023,.06,4),stahl,0,-.67,0).rotation.set(Math.PI,Math.PI/4,0);m2(new THREE.BoxGeometry(.01,.54,.01),stahlD,0,-.3,.002);
  // Runder Holzschild am linken Arm: Bretter, Eisenrand mit Nieten, Buckel in der Mitte
  const sh=new THREE.Group();sh.position.set(.3,1.1,.24);sh.rotation.set(0,.9,0);G.add(sh);
  const sm=(g,m,x,y,z)=>{const o=new THREE.Mesh(g,m);o.position.set(x,y,z);o.castShadow=true;sh.add(o);return o;};
  sm(new THREE.CylinderGeometry(.2,.2,.025,40),M({map:schildTex(),roughness:.7}),0,0,0).rotation.x=Math.PI/2;
  sm(new THREE.TorusGeometry(.2,.012,10,48),eisen,0,0,0);
  for(let k=0;k<16;k++){const a=k/16*Math.PI*2;sm(new THREE.SphereGeometry(.007,8,6),eisen,Math.cos(a)*.185,Math.sin(a)*.185,.015);}
  const bu=sm(new THREE.SphereGeometry(.05,20,12,0,Math.PI*2,0,Math.PI*.5),stahl,0,0,.012);bu.rotation.x=Math.PI/2;
  G.scale.setScalar((+L.groesse||1.8)/1.8);return G;}
// Schildbretter: senkrechte Holzbretter mit Fugen
function schildTex(){return tex(128,128,(g,w,h)=>{g.fillStyle='#5a3c22';g.fillRect(0,0,w,h);for(let x=0;x<w;x+=21){g.fillStyle=`rgba(${(x*7)%40+20},${(x*5)%20+10},0,.25)`;g.fillRect(x,0,21,h);g.fillStyle='rgba(20,10,4,.7)';g.fillRect(x,0,2,h);}
  for(let k=0;k<30;k++){g.strokeStyle='rgba(30,15,5,.35)';g.beginPath();const x=Math.random()*w;g.moveTo(x,0);g.bezierCurveTo(x+4,h/3,x-4,h*2/3,x+2,h);g.stroke();}rausch(g,w,h,18,57);},1);}
// Kettengeflecht: versetzte Ringe
function kettenTex(){return tex(128,128,(g,w,h)=>{g.fillStyle='#4a4e54';g.fillRect(0,0,w,h);
  for(let y=0;y<h;y+=8)for(let x=0;x<w;x+=8){const ox=(y/8)%2?4:0;g.strokeStyle='rgba(200,206,214,.75)';g.lineWidth=2;g.beginPath();g.arc(x+ox,y,3.2,0,Math.PI*2);g.stroke();g.strokeStyle='rgba(20,22,26,.6)';g.beginPath();g.arc(x+ox+.8,y+.8,3.2,Math.PI*.1,Math.PI*.9);g.stroke();}
  rausch(g,w,h,14,43);},40);}

function bau(spec={}){return spec.klasse==='magier'?magier(spec):spec.klasse==='krieger'?krieger(spec):spec.klasse==='waldlaeufer'?waldlaeufer(spec):spec.klasse==='skelett'?skelett(spec):startfigur(spec);}
window.Figur={bau,querschnitte,flackern};
})();
