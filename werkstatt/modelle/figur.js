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
  const P=[],UV=[],I=[];let vlaenge=0;
  for(let r=0;r<=M;r++){const R=ringe[r],a=ringe[Math.min(M,r+1)].c.clone().sub(ringe[Math.max(0,r-1)].c).normalize();
    const F=V(0,0,1).sub(a.clone().multiplyScalar(a.z)).normalize(),Sd=a.clone().cross(F).normalize();if(Sd.x<0)Sd.multiplyScalar(-1);
    if(r)vlaenge+=R.c.distanceTo(ringe[r-1].c);
    let bogen=0,vor=null;
    for(let j=0;j<=N;j++){const th=Math.PI+j/N*Math.PI*2,s=Math.sin(th),c=Math.cos(th);
      const p=R.c.clone().addScaledVector(Sd,R.w*sp(s,R.e)).addScaledVector(F,(c>=0?R.f:R.b)*sp(c,R.e));
      if(opt.form)opt.form(p,r/M,j/N);
      if(vor)bogen+=p.distanceTo(vor);vor=p;P.push(p.x,p.y,p.z);UV.push(bogen,vlaenge);}}
  for(let r=0;r<M;r++)for(let j=0;j<N;j++){const a=r*(N+1)+j,b=a+N+1;I.push(a,b,a+1,a+1,b,b+1);}
  // Umlaufsinn prüfen: Flächen müssen nach außen zeigen (sonst blendet three.js sie aus)
  {const r=Math.floor(M/2),a=r*(N+1)+Math.floor(N/4),b=a+N+1,q=k=>V(P[k*3],P[k*3+1],P[k*3+2]);
    const n=q(b).sub(q(a)).cross(q(a+1).sub(q(a))),aus=q(a).sub(ringe[r].c);if(n.dot(aus)<0)for(let k=0;k<I.length;k+=3){const t=I[k+1];I[k+1]=I[k+2];I[k+2]=t;}}
  if(deckel){const fl=I.length&&I[1]!==N+1;for(const r of[0,M]){const mi=P.length/3,C=ringe[r].c;P.push(C.x,C.y,C.z);UV.push(0,0);
    for(let j=0;j<N;j++){const a=r*(N+1)+j;if((r>0)!==fl)I.push(a,mi,a+1);else I.push(a,a+1,mi);}}}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(P,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(UV,2));
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
function bau(spec={}){
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
    // Hand: Handfläche, vier Finger leicht gekrümmt, Daumen nach vorn
    const h0=[s*.243,.88,.05];
    add(querschnitte([{c:[h0[0],h0[1]+.01,h0[2]],w:.022,f:.026,b:.022},{c:[h0[0]+s*.004,h0[1]-.03,h0[2]+.004],w:.016,f:.038,b:.03},{c:[h0[0]+s*.006,h0[1]-.075,h0[2]+.006],w:.014,f:.036,b:.028}]),haut);
    for(let f=0;f<4;f++){const z=h0[2]+.03-f*.017;add(querschnitte([{c:[h0[0]+s*.006,h0[1]-.07,z],w:.008,f:.0085,b:.0085},{c:[h0[0]+s*.006,h0[1]-.1,z+.006],w:.0075,f:.0075,b:.0075},{c:[h0[0]+s*.004,h0[1]-.123+f*.004,z+.016],w:.0065,f:.0065,b:.0065}],{n:12,m:10}),haut);}
    add(querschnitte([{c:[h0[0]-s*.006,h0[1]-.02,h0[2]+.03],w:.009,f:.01,b:.01},{c:[h0[0]-s*.008,h0[1]-.045,h0[2]+.05],w:.008,f:.008,b:.008},{c:[h0[0]-s*.006,h0[1]-.065,h0[2]+.058],w:.007,f:.007,b:.007}],{n:12,m:10}),haut);
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
  // Kopf
  const K=new THREE.Group();K.position.set(0,1.682,.006);G.add(K);
  const kg=new THREE.Mesh(kopfGeo(),kopfHaut);kg.castShadow=kg.receiveShadow=true;K.add(kg);
  for(const s of[-1,1]){
    const a=new THREE.Mesh(new THREE.SphereGeometry(.0115,20,16),weiss);a.position.set(s*.033,-.003,.07);K.add(a);
    const ir=new THREE.Mesh(new THREE.SphereGeometry(.0062,16,12),iris);ir.position.set(s*.033,-.003,.0792);ir.scale.z=.45;K.add(ir);
    const pu=new THREE.Mesh(new THREE.SphereGeometry(.0028,10,8),dunkel);pu.position.set(s*.033,-.003,.082);pu.scale.z=.4;K.add(pu);
    // Ohr: flache Muschel
    const o=new THREE.Mesh(new THREE.SphereGeometry(.03,20,16,0,Math.PI*2,0,Math.PI),kopfHaut);o.scale.set(.33,1,.62);o.position.set(s*.073,-.012,-.008);o.rotation.y=s*.25;o.castShadow=true;K.add(o);
  }
  G.scale.setScalar((+L.groesse||1.8)/1.8);
  return G;}

window.Figur={bau,querschnitte};
})();
