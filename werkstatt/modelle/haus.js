// Haus wie in Pagan: Baukasten aus Feldern (2,1 m), Bruchsteinsockel, Fachwerk, Schieferdach, Einrichtung.
(function(){THREE.ColorManagement.legacyMode=false;
const W=1000,H=760,K=46;
const R=new THREE.WebGLRenderer({antialias:true,alpha:true,preserveDrawingBuffer:true});
R.setSize(W,H);R.outputEncoding=THREE.sRGBEncoding;R.shadowMap.enabled=true;R.shadowMap.type=THREE.PCFSoftShadowMap;
document.body.appendChild(R.domElement);
const scene=new THREE.Scene();
const cam=new THREE.OrthographicCamera(-W/2/K,W/2/K,H/2/K,-H/2/K,0.1,200);
const el=Math.PI/6,az=Math.PI/4,d=60;
function aim(tx,ty,tz){cam.position.set(tx+d*Math.cos(el)*Math.sin(az),ty+d*Math.sin(el),tz+d*Math.cos(el)*Math.cos(az));cam.lookAt(tx,ty,tz);}
const hemi=new THREE.HemisphereLight(0xfff3df,0x6a5844,0.7);scene.add(hemi);
const sun=new THREE.DirectionalLight(0xfff1dc,1.1);sun.position.set(-8,30,14);sun.castShadow=true;
sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-14,right:14,top:14,bottom:-14,near:1,far:80});sun.shadow.bias=-0.0006;sun.shadow.radius=3;
scene.add(sun);scene.add(sun.target);
const fill=new THREE.DirectionalLight(0xd8e4ff,0.22);fill.position.set(20,12,-8);scene.add(fill);

// ---- prozedurale Texturen ----
function tex(w,h,draw,rep=[1,1]){const c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d');draw(g,w,h);
  const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(rep[0],rep[1]);t.encoding=THREE.sRGBEncoding;t.anisotropy=4;return t;}
let seed=7;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;
const sh=(c,v)=>{const n=parseInt(c.slice(1),16);const f=x=>Math.max(0,Math.min(255,Math.round(x*v)));return`rgb(${f(n>>16)},${f(n>>8&255)},${f(n&255)})`;};
// Verwitterung: Schmutzflecken, Laufspuren, Moos, Risse
function grime(g,w,h,n,a){for(let i=0;i<n;i++){const x=rnd()*w,y=rnd()*h,r=6+rnd()*40;const gr=g.createRadialGradient(x,y,0,x,y,r);gr.addColorStop(0,`rgba(40,30,15,${a*rnd()})`);gr.addColorStop(1,'rgba(40,30,15,0)');g.fillStyle=gr;g.fillRect(x-r,y-r,2*r,2*r);}}
function moss(g,w,h,n,yb=0){for(let i=0;i<n;i++){const x=rnd()*w,y=yb?h*(rnd()**2):rnd()*h,r=3+rnd()*16;for(let k=0;k<14;k++){g.fillStyle=`rgba(${60+rnd()*30|0},${80+rnd()*30|0},${30+rnd()*15|0},${.35+rnd()*.4})`;g.beginPath();g.arc(x+(rnd()-.5)*r*2,y+(rnd()-.5)*r,1+rnd()*3,0,7);g.fill();}}}
function crack(g,x,y,len){g.strokeStyle='rgba(50,38,25,.55)';g.lineWidth=1;g.beginPath();g.moveTo(x,y);for(let i=0;i<len;i++){x+=(rnd()-.5)*8;y+=3+rnd()*5;g.lineTo(x,y);}g.stroke();}
const stoneT=tex(256,256,(g,w,h)=>{g.fillStyle='#3a362f';g.fillRect(0,0,w,h);let y=0;while(y<h){const rh=18+rnd()*20;let x=-rnd()*30;
  while(x<w){const rw=22+rnd()*44;g.fillStyle=sh(rnd()<.2?'#7a6e5c':'#827c70',.62+rnd()*.42);g.beginPath();g.moveTo(x+2+rnd()*3,y+2);g.lineTo(x+rw-2-rnd()*4,y+2+rnd()*2);g.lineTo(x+rw-3,y+rh-2-rnd()*3);g.lineTo(x+3,y+rh-3);g.closePath();g.fill();
  g.fillStyle='rgba(255,255,255,.06)';g.fillRect(x+5,y+3,rw-14,2);x+=rw;}y+=rh;}grime(g,w,h,40,.5);moss(g,w,h,10,1);});
const plasterT=tex(256,256,(g,w,h)=>{g.fillStyle='#bfae88';g.fillRect(0,0,w,h);for(let i=0;i<3000;i++){g.fillStyle=`rgba(${rnd()<.5?80:230},${rnd()<.5?62:215},40,${rnd()*.07})`;g.fillRect(rnd()*w,rnd()*h,2+rnd()*5,2+rnd()*5);}
  for(let i=0;i<6;i++){const x=rnd()*w,wd=3+rnd()*8;const gr=g.createLinearGradient(0,0,0,h);gr.addColorStop(0,'rgba(60,45,25,.16)');gr.addColorStop(1,'rgba(60,45,25,0)');g.fillStyle=gr;g.fillRect(x,0,wd,h*(.3+rnd()*.7));}
  const gb=g.createLinearGradient(0,h*.6,0,h);gb.addColorStop(0,'rgba(50,38,20,0)');gb.addColorStop(1,'rgba(50,38,20,.55)');g.fillStyle=gb;g.fillRect(0,0,w,h);
  for(let i=0;i<3;i++){const x=rnd()*w*.8,y=rnd()*h*.7,pw=20+rnd()*40,ph=12+rnd()*26;g.fillStyle='#6a5a44';g.beginPath();g.ellipse(x,y,pw/2,ph/2,rnd(),0,7);g.fill();
    for(let k=0;k<4;k++){g.fillStyle=sh('#8a7a62',.7+rnd()*.4);g.fillRect(x-pw/2+4,y-ph/2+3+k*ph/4,pw-8,ph/4-2);}}
  for(let i=0;i<5;i++)crack(g,rnd()*w,rnd()*h*.6,6+rnd()*10);grime(g,w,h,25,.35);});
const woodT=tex(128,256,(g,w,h)=>{g.fillStyle='#4e3c2c';g.fillRect(0,0,w,h);for(let i=0;i<70;i++){g.strokeStyle=`rgba(${rnd()<.5?20:120},${rnd()<.5?16:100},${rnd()<.5?10:80},.3)`;g.lineWidth=1+rnd()*2;const x=rnd()*w;g.beginPath();g.moveTo(x,0);g.bezierCurveTo(x+6,h/3,x-6,h*2/3,x+rnd()*4,h);g.stroke();}
  for(let i=0;i<6;i++){g.fillStyle='rgba(15,10,5,.6)';g.fillRect(rnd()*w,rnd()*h,1+rnd(),20+rnd()*60);}grime(g,w,h,12,.4);});
const plankT=tex(256,256,(g,w,h)=>{const n=8;for(let i=0;i<n;i++){g.fillStyle=sh('#6e5034',.7+rnd()*.4);g.fillRect(i*w/n,0,w/n,h);g.fillStyle='rgba(0,0,0,.55)';g.fillRect(i*w/n,0,3,h);
  const cut=rnd()*h;g.fillRect(i*w/n,cut,w/n,3);for(let k=0;k<8;k++){g.fillStyle='rgba(30,18,5,.2)';g.fillRect(i*w/n+4+rnd()*20,rnd()*h,1,30+rnd()*60);}}
  grime(g,w,h,30,.55);for(let i=0;i<40;i++){g.strokeStyle=`rgba(200,170,90,${.4+rnd()*.4})`;g.lineWidth=1;const x=rnd()*w,y=rnd()*h,a=rnd()*7,l=6+rnd()*10;g.beginPath();g.moveTo(x,y);g.lineTo(x+Math.cos(a)*l,y+Math.sin(a)*l);g.stroke();}},[2,2]);
const slateT=tex(256,256,(g,w,h)=>{g.fillStyle='#1e2024';g.fillRect(0,0,w,h);const rh=16;for(let r=0;r*rh<h;r++){let x=(r%2)*14-14;while(x<w){const sw=20+rnd()*12;
  if(rnd()<.05){x+=sw;continue;}const dy=(rnd()-.5)*3;g.fillStyle=sh(rnd()<.15?'#5e5a50':'#4e535c',.65+rnd()*.45);g.beginPath();g.moveTo(x+1,r*rh+dy);g.lineTo(x+sw-1,r*rh);g.lineTo(x+sw-1-rnd()*2,r*rh+rh-3);g.quadraticCurveTo(x+sw/2,r*rh+rh+2+dy,x+1,r*rh+rh-3);g.fill();x+=sw;}}
  moss(g,w,h,22);grime(g,w,h,20,.4);},[3,3]);
const clothT=tex(64,64,(g,w,h)=>{g.fillStyle='#5e3028';g.fillRect(0,0,w,h);g.fillStyle='#7a4a34';for(let i=0;i<w;i+=16)g.fillRect(i,0,6,h);g.fillStyle='rgba(0,0,0,.2)';for(let j=0;j<h;j+=16)g.fillRect(0,j,w,4);},[3,3]);
const rugT=tex(128,128,(g,w,h)=>{g.fillStyle='#5c3a2a';g.fillRect(0,0,w,h);g.strokeStyle='#c8a050';g.lineWidth=6;g.strokeRect(10,10,w-20,h-20);g.strokeStyle='#8a3024';g.lineWidth=10;g.strokeRect(26,26,w-52,h-52);g.fillStyle='#c8a050';g.beginPath();g.moveTo(w/2,40);g.lineTo(w-40,h/2);g.lineTo(w/2,h-40);g.lineTo(40,h/2);g.fill();});
const groundT=tex(256,256,(g,w,h)=>{g.fillStyle='#646c3a';g.fillRect(0,0,w,h);for(let i=0;i<3000;i++){g.fillStyle=sh(rnd()<.5?'#5c6a30':'#8a9450',.8+rnd()*.4);g.fillRect(rnd()*w,rnd()*h,2,3+rnd()*4);}},[14,14]);

const M=(o)=>new THREE.MeshStandardMaterial(Object.assign({roughness:.85},o));
const mStone=M({map:stoneT}),mPlaster=M({map:plasterT,roughness:.95}),mWood=M({map:woodT}),mPlank=M({map:plankT}),mSlate=M({map:slateT,roughness:.7}),
  mIron=M({color:0x55524e,roughness:.5,metalness:.6}),mCloth=M({map:clothT,roughness:1}),mLinen=M({color:0xe8e0cc,roughness:1}),mRug=M({map:rugT,roughness:1}),
  mGlass=M({color:0x9fb8c8,roughness:.2,metalness:.1,emissive:0x203040}),mBook=c=>M({color:c,roughness:.8}),mFire=new THREE.MeshBasicMaterial({color:0xffa030}),
  mBrass=M({color:0xb08840,roughness:.4,metalness:.7}),mWax=M({color:0xf2e6c8,roughness:.6}),mBread=M({color:0xb07a3a}),mApple=M({color:0x9a2a20,roughness:.5});
function box(w,h,dp,m,x,y,z,p=scene,ry=0){const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,dp),m);o.position.set(x,y,z);o.rotation.y=ry;if(m===mWood&&SHAB){o.rotation.z+=(rnd()-.5)*.06;o.rotation.x+=(rnd()-.5)*.04;}o.castShadow=o.receiveShadow=true;p.add(o);return o;}
function cyl(r1,r2,h,m,x,y,z,p=scene,seg=14){const o=new THREE.Mesh(new THREE.CylinderGeometry(r1,r2,h,seg),m);o.position.set(x,y,z);o.castShadow=o.receiveShadow=true;p.add(o);return o;}
function uvScale(o,s){const g=o.geometry,uv=g.attributes.uv;const p=g.parameters;for(let i=0;i<uv.count;i++)uv.setXY(i,uv.getX(i)*s[0],uv.getY(i)*s[1]);uv.needsUpdate=true;return o;}

// ---- Grundfläche ----
let SHAB=1;const T=2.1,NX=5,NZ=4,HX=NX*T,HZ=NZ*T,WH=3.0,WT=.28;
const grass=new THREE.Mesh(new THREE.PlaneGeometry(90,90),M({map:groundT,roughness:1}));grass.rotation.x=-Math.PI/2;grass.receiveShadow=true;scene.add(grass);
const house=new THREE.Group();scene.add(house);house.position.set(-HX/2,0,-HZ/2);
const floor=box(HX,.12,HZ,mPlank,HX/2,.06,HZ/2,house);uvScale(floor,[2.5,2]);
// Wand entlang x oder z; Öffnungen [von,bis,unten,oben]
const walls={};
function wall(name,axis,len,x,z,holes,hgt){const g=new THREE.Group();g.position.set(x,0,z);if(axis==='z')g.rotation.y=-Math.PI/2;house.add(g);walls[name]=g;
  const base=.8;const parts=[];
  // Segmente rund um die Öffnungen erzeugen
  const cuts=[0,...holes.flatMap(h=>[h[0],h[1]]),len];
  for(let i=0;i<cuts.length;i+=2){const a=cuts[i],b=cuts[i+1];if(b-a>.01){
    const s=box(b-a,Math.min(base,hgt),WT+.06,mStone,(a+b)/2,Math.min(base,hgt)/2,0,g);uvScale(s,[(b-a)/2,.5]);
    if(hgt>base){const p=box(b-a,hgt-base,WT,mPlaster,(a+b)/2,base+(hgt-base)/2,0,g);uvScale(p,[(b-a)/3,(hgt-base)/3]);}}}
  holes.forEach(([a,b,lo,hi])=>{ // über und unter der Öffnung
    if(lo>0){const s=box(b-a,Math.min(lo,base),WT+.06,mStone,(a+b)/2,Math.min(lo,base)/2,0,g);if(lo>base)box(b-a,lo-base,WT,mPlaster,(a+b)/2,base+(lo-base)/2,0,g);
      box(b-a+.2,.08,WT+.16,mWood,(a+b)/2,lo,0,g);}
    if(hi<hgt){box(b-a,hgt-hi,WT,mPlaster,(a+b)/2,hi+(hgt-hi)/2,0,g);}
    if(hi<=hgt)box(b-a+.3,.16,WT+.04,mWood,(a+b)/2,hi+.08,0,g);
    if(lo>0&&hi<=hgt){const gl=box(b-a-.1,hi-lo-.1,.04,mGlass,(a+b)/2,(lo+hi)/2,0,g);box(.06,hi-lo,.08,mWood,(a+b)/2,(lo+hi)/2,0,g);box(b-a,.06,.08,mWood,(a+b)/2,(lo+hi)/2,0,g);}
  });
  // Fachwerk: Pfosten, Riegel, Streben
  if(hgt>base+.3){const n=Math.round(len/1.05);for(let i=0;i<=n;i++){const x=i*len/n;if(holes.some(h=>x>h[0]-.05&&x<h[1]+.05))continue;
      box(.16,hgt-base,WT+.04,mWood,x,base+(hgt-base)/2,0,g);}
    box(len,.16,WT+.04,mWood,len/2,base+.08,0,g);if(hgt>=WH-.01)box(len,.18,WT+.05,mWood,len/2,hgt-.09,0,g);
    if(hgt>=WH-.01)for(let i=0;i<n;i+=2){const x0=i*len/n,x1=(i+1)*len/n;if(holes.some(h=>x1>h[0]&&x0<h[1]))continue;
      const st=box(Math.hypot(x1-x0,hgt-base-.3),.12,WT+.03,mWood,(x0+x1)/2,base+(hgt-base)/2,0,g);st.rotation.z=Math.atan2(hgt-base-.3,x1-x0)*(i%4?1:-1);}}
}
function buildWalls(cut){
  const hFront=cut?1.1:WH;
  wall('back','x',HX,0,0,[[1.0,2.0,1.3,2.3],[7.6,8.6,1.3,2.3]],WH);
  wall('left','z',HZ,0,0,[[3.4,4.6,1.3,2.3]],WH);
  wall('front','x',HX,0,HZ,[[2.0,3.0,1.3,2.3],[4.75,5.95,0,2.4],[7.6,8.6,1.3,2.3]],hFront);
  wall('right','z',HZ,HX,0,[[3.4,4.6,1.3,2.3]],hFront);
  // Ecksteine
  [[0,0],[HX,0],[0,HZ],[HX,HZ]].forEach(([x,z])=>{const s=box(.42,(x>0||z>0)&&cut?1.15:WH+.05,.42,mStone,x,((x>0||z>0)&&cut?1.15:WH+.05)/2,z,house);uvScale(s,[.3,1.3]);});
  if(!cut){// Tür
    const door=box(1.1,2.3,.08,mWood,5.35,1.2,HZ+.02,house);box(.08,.08,.1,mIron,5.75,1.2,HZ+.08,house);
    for(const y of[.5,1.9])box(1.1,.08,.1,mIron,5.35,y,HZ+.07,house);
    box(1.6,.18,.6,mStone,5.35,.09,HZ+.42,house);}
}
function roof(){const g=new THREE.Group();house.add(g);const ov=.5,rh=2.6,L=HX+2*ov,half=HZ/2+ov,sl=Math.hypot(half,rh);
  for(const s of[-1,1]){const geo=new THREE.BoxGeometry(L,.14,sl,30,1,14);const pa=geo.attributes.position;
    for(let i=0;i<pa.count;i++){const u=pa.getX(i)/L+.5,v=pa.getZ(i)/sl+.5;pa.setY(i,pa.getY(i)-.22*Math.sin(Math.PI*u)*Math.sin(Math.PI*Math.min(1,v*1.2))+(rnd()-.5)*.035);}
    geo.computeVertexNormals();const p=new THREE.Mesh(geo,mSlate);p.position.set(HX/2,WH+rh/2,HZ/2+s*half/2);p.rotation.x=s*Math.atan2(rh,half);p.castShadow=p.receiveShadow=true;g.add(p);uvScale(p,[L/3,sl/3]);
    if(s>0){const pt=box(1.3,.05,1.0,mWood,HX*.68,WH+rh*.42,HZ/2+half*.55,g);pt.rotation.x=Math.atan2(rh,half);pt.rotation.y=.12;
      const pt2=box(.9,.05,.7,mWood,HX*.71,WH+rh*.44,HZ/2+half*.5,g);pt2.rotation.x=Math.atan2(rh,half);pt2.rotation.y=-.2;}}
  const ridge=box(L+.1,.22,.3,mWood,HX/2,WH+rh-.12,HZ/2,g);ridge.rotation.z=.015;
  for(const x of[0,HX]){const sh=new THREE.Shape();sh.moveTo(-HZ/2,0);sh.lineTo(HZ/2,0);sh.lineTo(0,rh);sh.lineTo(-HZ/2,0);
    const gm=new THREE.Mesh(new THREE.ShapeGeometry(sh),mPlaster);gm.position.set(x+(x?.001:-.001),WH,HZ/2);gm.rotation.y=x?Math.PI/2:-Math.PI/2;gm.castShadow=true;g.add(gm);
    const b1=box(.14,.14,Math.hypot(HZ/2,rh)+.2,mWood,x,WH+rh/2,HZ/2-HZ/4,g);b1.rotation.x=-Math.atan2(rh,HZ/2);
    const b2=box(.14,.14,Math.hypot(HZ/2,rh)+.2,mWood,x,WH+rh/2,HZ/2+HZ/4,g);b2.rotation.x=Math.atan2(rh,HZ/2);
    box(.14,rh,.14,mWood,x,WH+rh/2,HZ/2,g);}
  const ch=box(.8,2.6,.8,mStone,1.2,WH+1.6,1.4,g);uvScale(ch,[.5,1.4]);box(.95,.15,.95,mStone,1.2,WH+2.95,1.4,g).rotation.z=.06;box(.3,.25,.3,mStone,1.35,WH+3.1,1.25,g).rotation.y=.4;
  return g;}

// ---- Einrichtung ----
function furnish(){const f=new THREE.Group();house.add(f);
  // Kamin an der linken Wand
  const fp=box(1.8,1.5,.7,mStone,.5,.75,1.6,f);fp.rotation.y=Math.PI/2;uvScale(fp,[1,.8]);box(.1,.8,1.0,M({color:0x14100c}),.86,.5,1.6,f);
  box(.5,.12,.14,mWood,1.0,.18,1.5,f).rotation.y=.4;box(.5,.12,.14,mWood,1.0,.2,1.7,f).rotation.y=-.5;
  const fl=new THREE.Mesh(new THREE.ConeGeometry(.18,.5,8),mFire);fl.position.set(.98,.4,1.6);f.add(fl);
  const fl2=new THREE.Mesh(new THREE.ConeGeometry(.11,.34,8),new THREE.MeshBasicMaterial({color:0xffe080}));fl2.position.set(1.0,.36,1.62);f.add(fl2);
  const fire=new THREE.PointLight(0xff9a40,2.2,7,1.6);fire.position.set(1.1,.7,1.6);f.add(fire);
  box(.6,.08,2.0,mWood,.5,1.55,1.6,f);cyl(.07,.06,.22,mBrass,.5,1.7,1.0,f);cyl(.06,.05,.18,M({color:0x8a5a3a}),.5,1.68,2.2,f);
  // Bett hinten rechts
  const bx=HX-1.25,bz=1.25;box(1.2,.45,2.1,mWood,bx,.33,bz,f);box(1.08,.2,1.95,mCloth,bx,.62,bz+.05,f);box(.8,.16,.4,mLinen,bx,.76,bz-.72,f);
  box(1.3,1.0,.12,mWood,bx,.6,bz-1.05,f);
  // Truhe am Bettende
  const ch=box(1.0,.55,.55,mWood,bx,.35,bz+1.45,f);for(const x of[-.35,.35])box(.06,.57,.58,mIron,bx+x,.35,bz+1.45,f);
  const lid=new THREE.Mesh(new THREE.CylinderGeometry(.28,.28,1.0,12,1,false,0,Math.PI),mWood);lid.rotation.z=Math.PI/2;lid.position.set(bx,.62,bz+1.45);lid.castShadow=true;f.add(lid);
  box(.12,.14,.06,mBrass,bx,.55,bz+1.74,f);
  // Schrank an der Rückwand
  const sx=4.4;box(1.3,2.2,.6,mWood,sx,1.15,.45,f);box(.04,1.9,.04,M({color:0x2a1a0e}),sx,1.2,.76,f);for(const x of[-.15,.15])box(.05,.12,.05,mIron,sx+x,1.2,.78,f);
  box(1.4,.12,.66,mWood,sx,2.28,.45,f);
  // Regal mit Büchern an der Rückwand
  const rx=2.6;for(const y of[.1,.75,1.4,2.05])box(1.2,.06,.38,mWood,rx,y,.32,f);for(const x of[-.58,.58])box(.06,2.1,.38,mWood,rx+x,1.05,.32,f);
  const cols=[0x6a2a20,0x2a4a6a,0x3a5a2a,0x7a6a3a,0x4a2a4a,0x8a4a20];let k=0;
  for(const y of[.13,.78,1.43])for(let x=-.5;x<.45;x+=.1+rnd()*.04){if(rnd()<.15)continue;const hb=.32+rnd()*.14;box(.08,hb,.26,mBook(cols[k++%6]),rx+x,y+hb/2+.03,.32,f);}
  cyl(.1,.12,.25,M({color:0x9a7a5a}),rx+.3,2.21,.32,f);
  // Tisch mit Bänken in der Mitte
  const tx=4.6,tz=5.2;box(2.0,.1,1.0,mWood,tx,.8,tz,f);for(const[x,z]of[[-.85,-.4],[.85,-.4],[-.85,.4],[.85,.4]])box(.1,.78,.1,mWood,tx+x,.4,tz+z,f);
  for(const z of[-.85,.85]){box(1.8,.08,.35,mWood,tx,.45,tz+z,f);for(const x of[-.75,.75])box(.08,.42,.3,mWood,tx+x,.22,tz+z,f);}
  // Dinge auf dem Tisch
  cyl(.22,.18,.04,M({color:0xb8b0a0,roughness:.4}),tx-.5,.87,tz-.15,f);const br=new THREE.Mesh(new THREE.SphereGeometry(.15,12,8),mBread);br.scale.set(1.4,.6,1);br.position.set(tx-.5,.95,tz-.15);br.castShadow=true;f.add(br);
  cyl(.06,.05,.16,M({color:0x7a5a3a}),tx+.1,.93,tz+.2,f);cyl(.06,.05,.16,M({color:0x7a5a3a}),tx+.35,.93,tz-.25,f);
  cyl(.06,.07,.05,mBrass,tx+.7,.88,tz+.1,f);cyl(.03,.03,.22,mWax,tx+.7,1.01,tz+.1,f);
  const cf=new THREE.Mesh(new THREE.ConeGeometry(.025,.07,6),new THREE.MeshBasicMaterial({color:0xffd070}));cf.position.set(tx+.7,1.16,tz+.1);f.add(cf);
  const cl=new THREE.PointLight(0xffc070,.9,4,1.8);cl.position.set(tx+.7,1.3,tz+.1);f.add(cl);
  for(const[x,z]of[[.2,-.3],[.3,-.18]]){const a=new THREE.Mesh(new THREE.SphereGeometry(.06,10,8),mApple);a.position.set(tx+x,.91,tz+z);a.castShadow=true;f.add(a);}
  // Teppich, Fässer, Kiste
  const rg=new THREE.Mesh(new THREE.PlaneGeometry(2.6,1.8),mRug);rg.rotation.x=-Math.PI/2;rg.position.set(tx,.125,tz);rg.receiveShadow=true;f.add(rg);
  for(const[x,z]of[[.6,HZ-2.6],[.6,HZ-3.4]]){cyl(.36,.36,.9,mWood,x,.57,z,f,16);for(const y of[.25,.85])cyl(.38,.38,.06,mIron,x,y,z,f,16);}
  box(.7,.6,.7,mWood,1.4,.42,.6,f);box(.72,.06,.72,mWood,1.4,.72,.6,f);
  // Säcke, Kessel, Hocker, Wandbrett mit Geschirr, Besen
  for(const[x,z,r]of[[1.2,HZ-2.9,.3],[1.0,HZ-2.2,.26]]){const sk=new THREE.Mesh(new THREE.SphereGeometry(r,12,10),M({color:0x8a7048,roughness:1}));sk.scale.set(1,1.15,1);sk.position.set(x,r*1.05+.1,z);sk.castShadow=true;f.add(sk);const tie=new THREE.Mesh(new THREE.ConeGeometry(r*.35,r*.6,8),M({color:0x7a6040,roughness:1}));tie.position.set(x,r*2.3+.12,z);f.add(tie);}
  const ket=new THREE.Mesh(new THREE.SphereGeometry(.2,14,10,0,Math.PI*2,Math.PI/3,Math.PI*2/3),mIron);ket.position.set(1.15,.42,2.25);ket.castShadow=true;f.add(ket);
  cyl(.2,.2,.04,mWood,2.0,.5,2.6,f);for(const a of[0,2.1,4.2])cyl(.025,.025,.48,mWood,2.0+Math.cos(a)*.13,.25,2.6+Math.sin(a)*.13,f,6);
  box(1.2,.05,.25,mWood,7.4,1.55,.22,f);for(let i=0;i<4;i++){const pl=cyl(.12,.12,.02,M({color:0xc8c0b0,roughness:.4}),7.0+i*.27,1.7,.2,f,16);pl.rotation.x=Math.PI/2.4;}
  cyl(.05,.05,.12,M({color:0x6a7a8a}),7.85,1.64,.25,f);
  const bm=cyl(.02,.02,1.4,mWood,HX-.4,.75,3.2,f,6);bm.rotation.z=.25;const bh=cyl(.03,.14,.3,M({color:0xa08a50,roughness:1}),HX-.25,.12,3.2,f,10);
  for(let i=0;i<110;i++){const st=box(.22+rnd()*.25,.012,.025,M({color:rnd()<.5?0x8a7030:0x6a5420,roughness:1}),rnd()<.6?.6+rnd()*2.4:HX-2.2+rnd()*2,.13,rnd()<.6?HZ-3.6+rnd()*2:rnd()*3,f,rnd()*3);st.castShadow=false;}
  const soot=M({color:0x000000,transparent:true,opacity:.35,depthWrite:false});for(const[x,z,w,d]of[[HX/2,.35,HX,.5],[.35,HZ/2,.5,HZ]]){const sp=new THREE.Mesh(new THREE.PlaneGeometry(w,d),soot);sp.rotation.x=-Math.PI/2;sp.position.set(x,.125,z);f.add(sp);}
  const web=M({color:0xe0e0d8,transparent:true,opacity:.35,side:THREE.DoubleSide});for(const[x,z,ry]of[[.16,.16,Math.PI/4],[HX-.16,.16,-Math.PI/4]]){const w=new THREE.Mesh(new THREE.CircleGeometry(.6,8,0,Math.PI/2),web);w.position.set(x,WH-.05,z);w.rotation.set(Math.PI,ry+Math.PI*.75,0);f.add(w);}
  const ch2=new THREE.Group();ch2.position.set(6.9,.36,3.2);ch2.rotation.set(0,.7,Math.PI/2.1);f.add(ch2);box(.45,.06,.45,mWood,0,0,0,ch2);for(const[x,z]of[[-.18,-.18],[.18,-.18],[-.18,.18]])box(.05,.45,.05,mWood,x,-.24,z,ch2);box(.45,.5,.05,mWood,0,.25,-.2,ch2);
  for(let i=0;i<7;i++)box(.08+rnd()*.12,.05,.06+rnd()*.1,mPlaster,.4+rnd()*.5,.14,3.0+rnd()*1.2,f,rnd()*3);
  const blk=box(1.0,.12,1.1,mCloth,HX-1.15,.78,1.4,f);blk.rotation.set(.12,.3,-.08);
  // Schwert und Schild an der Rückwand
  const sw=box(.08,1.0,.03,M({color:0xb8bcc0,metalness:.8,roughness:.3}),6.4,1.9,.2,f);box(.3,.05,.05,mBrass,6.4,1.45,.2,f);
  const sd=cyl(.38,.38,.05,mWood,6.9,1.8,.2,f,20);sd.rotation.x=Math.PI/2;const sb=cyl(.1,.1,.06,mIron,6.9,1.8,.24,f,12);sb.rotation.x=Math.PI/2;
}
window.render=(mode)=>{
  while(house.children.length>1)house.remove(house.children[house.children.length-1]);
  const cut=mode==='innen';buildWalls(cut);if(cut)furnish();else{roof();
    // Kleinkram draußen
    const bx=HX+.8;cyl(.36,.36,.9,mWood,bx,.45,HZ-1,house,16);box(.7,.6,.7,mWood,bx+.2,.3,HZ-2.2,house);box(1.6,.45,.4,mWood,2.5,.25,HZ+.8,house).rotation.z=.08;
    const dirt=new THREE.Mesh(new THREE.CircleGeometry(2.2,24),M({color:0x3a2c1c,roughness:1,transparent:true,opacity:.8}));dirt.rotation.x=-Math.PI/2;dirt.scale.set(1.3,.8,1);dirt.position.set(5.35,.01,HZ+1.4);dirt.receiveShadow=true;house.add(dirt);
    const weed=M({color:0x2e3a14,roughness:1}),weed2=M({color:0x4a4a1c,roughness:1});
    for(let i=0;i<140;i++){const side=rnd();let x,z;if(side<.45){x=rnd()*HX;z=HZ+.2+rnd()*.35;}else if(side<.9){x=HX+.2+rnd()*.35;z=rnd()*HZ;}else{x=-.3;z=rnd()*HZ;}
      if(x>4.6&&x<6.1&&z>HZ)continue;const c=new THREE.Mesh(new THREE.ConeGeometry(.05+rnd()*.07,.25+rnd()*.45,5),rnd()<.5?weed:weed2);c.position.set(x,.15,z);c.rotation.set((rnd()-.5)*.5,0,(rnd()-.5)*.5);c.castShadow=true;house.add(c);}
    for(let r=0;r<3;r++)for(let i=0;i<5-r;i++){const lg=cyl(.11,.11,1.1,mWood,HX+.45,.12+r*.2,.8+i*.23+r*.11,house,8);lg.rotation.x=Math.PI/2;}
    const sh1=box(.55,1.0,.05,mWood,1.25,1.75,HZ+.25,house);sh1.rotation.y=-.9;sh1.rotation.z=.25;
    box(.5,.95,.05,mWood,8.0,1.8,HZ+.2,house);
    const pane=box(.42,.42,.05,M({color:0x101010}),8.35,2.05,HZ+.02,house);}
  hemi.intensity=cut?.5:.62;
  aim(0,cut?1.2:2.2,0);R.render(scene,cam);return R.domElement.toDataURL('image/png');};
})();
