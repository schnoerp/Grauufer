// Skelettkrieger im Kenney-Stil: Modell aus Grundformen, Kamera 2:1 isometrisch, weiches Licht.
(function(){
const W=256,H=512,K=86.6,OX=128,OY=445;
const R=new THREE.WebGLRenderer({antialias:true,alpha:true,preserveDrawingBuffer:true});
R.setSize(W,H);R.setPixelRatio(1);R.outputEncoding=THREE.sRGBEncoding;
R.shadowMap.enabled=true;R.shadowMap.type=THREE.PCFSoftShadowMap;
document.body.appendChild(R.domElement);
const scene=new THREE.Scene();
const cam=new THREE.OrthographicCamera(-OX/K,(W-OX)/K,OY/K,-(H-OY)/K,0.1,100);
const el=Math.PI/6,az=Math.PI/4,d=20;
cam.position.set(d*Math.cos(el)*Math.sin(az),d*Math.sin(el),d*Math.cos(el)*Math.cos(az));cam.lookAt(0,0,0);
scene.add(new THREE.HemisphereLight(0xfff3df,0x7a6450,0.75));
const sun=new THREE.DirectionalLight(0xfff1dc,1.15);sun.position.set(-1.6,7.5,3);sun.castShadow=true;
sun.shadow.mapSize.set(1024,1024);Object.assign(sun.shadow.camera,{left:-2,right:2,top:2,bottom:-2,near:1,far:20});sun.shadow.radius=4;sun.shadow.bias=-0.0008;
scene.add(sun);
const fill=new THREE.DirectionalLight(0xd8e4ff,0.25);fill.position.set(4,3,-2);scene.add(fill);
const ground=new THREE.Mesh(new THREE.PlaneGeometry(6,6),new THREE.ShadowMaterial({opacity:0.28}));
ground.rotation.x=-Math.PI/2;ground.receiveShadow=true;scene.add(ground);

const M=(c,r=.8,m=0)=>new THREE.MeshStandardMaterial({color:c,roughness:r,metalness:m});
const bone=M(0xe8ddc4,.72),boneD=M(0xd2c4a3,.8),dark=M(0x16110d,1),
  eye=new THREE.MeshBasicMaterial({color:0xff4030}),
  iron=M(0x7a756e,.45,.55),rust=M(0x8b5a3b,.75,.25),wood=M(0x7d5434,.85),
  leather=M(0x553a26,.9),cloth=M(0x4a3426,.95),steel=M(0xb9bcc0,.3,.75);
function mesh(g,m,p,x=0,y=0,z=0){const o=new THREE.Mesh(g,m);o.position.set(x,y,z);o.castShadow=true;p.add(o);return o;}
function J(p,x=0,y=0,z=0){const g=new THREE.Group();g.position.set(x,y,z);p.add(g);return g;}
function seg(p,len,r){mesh(new THREE.CylinderGeometry(r,r*.8,len,8),bone,p,0,-len/2,0);
  mesh(new THREE.SphereGeometry(r*1.55,10,8),boneD,p);
  mesh(new THREE.SphereGeometry(r*1.35,10,8),boneD,p,0,-len,0);}

const root=new THREE.Group();root.scale.setScalar(1.1);scene.add(root);
const body=J(root,0,0.83,0);
// Becken, Gürtel, Lendentuch
const pel=mesh(new THREE.SphereGeometry(.1,14,10),bone,body);pel.scale.set(1.4,.8,.9);
const belt=mesh(new THREE.TorusGeometry(.15,.022,6,20),leather,body,0,.03,0);belt.rotation.x=Math.PI/2;belt.scale.set(1,.75,1);
mesh(new THREE.BoxGeometry(.06,.05,.02),iron,body,0,.03,.12);
const lf=mesh(new THREE.BoxGeometry(.15,.22,.015),cloth,body,0,-.11,.1);lf.rotation.x=.08;
const lb=mesh(new THREE.BoxGeometry(.22,.24,.015),cloth,body,0,-.11,-.1);lb.rotation.x=-.08;
// Wirbelsäule und Brustkorb
const spine=J(body,0,.04,0);
for(let i=0;i<5;i++)mesh(new THREE.SphereGeometry(.026,8,6),boneD,spine,0,.03+i*.06,-.03);
mesh(new THREE.CylinderGeometry(.014,.014,.32,6),bone,spine,0,.16,-.03);
const chest=J(spine,0,.3,0);
[[-.02,.12],[.04,.14],[.10,.15],[.16,.14],[.21,.12]].forEach(([y,r])=>{
  const t=mesh(new THREE.TorusGeometry(r*1.1,.019,6,18,Math.PI*1.55),bone,chest,0,y,-.01);
  t.rotation.set(Math.PI/2,0,Math.PI*0.225+Math.PI/2);t.scale.set(1,.78,1);});
mesh(new THREE.BoxGeometry(.04,.22,.025),bone,chest,0,.1,.12);
const clav=mesh(new THREE.CylinderGeometry(.018,.018,.38,6),bone,chest,0,.25,.02);clav.rotation.z=Math.PI/2;
// Schulterplatte (rostig) links
const pad=mesh(new THREE.SphereGeometry(.09,10,8,0,Math.PI*2,0,Math.PI/2),iron,chest,.2,.27,0);pad.rotation.z=-.5;
// Hals, Kopf, Helm
const neck=J(chest,0,.28,-.01);
for(let i=0;i<2;i++)mesh(new THREE.SphereGeometry(.024,8,6),boneD,neck,0,i*.045,0);
const head=J(neck,0,.08,0);head.scale.setScalar(1.18);
const sk=mesh(new THREE.SphereGeometry(.105,16,12),bone,head,0,.1,0);sk.scale.set(.92,1,1.05);
mesh(new THREE.BoxGeometry(.12,.05,.1),bone,head,0,.02,.045);
for(const s of[-1,1]){mesh(new THREE.SphereGeometry(.03,10,8),dark,head,s*.042,.1,.078);
  mesh(new THREE.SphereGeometry(.012,8,6),eye,head,s*.042,.1,.1);}
mesh(new THREE.ConeGeometry(.014,.03,4),dark,head,0,.065,.1).rotation.x=Math.PI;
for(let i=-2;i<=2;i++)mesh(new THREE.BoxGeometry(.016,.018,.012),boneD,head,i*.02,.042,.096);
mesh(new THREE.SphereGeometry(.118,14,8,0,Math.PI*2,0,Math.PI/2),iron,head,0,.13,-.005);
const rim=mesh(new THREE.TorusGeometry(.118,.012,6,20),rust,head,0,.13,-.005);rim.rotation.x=Math.PI/2;
mesh(new THREE.BoxGeometry(.022,.09,.02),iron,head,0,.1,.115);
mesh(new THREE.ConeGeometry(.02,.06,6),iron,head,0,.26,-.005);
// Arme
function arm(s){const sh=J(chest,s*.2,.24,0);seg(sh,.27,.03);const el=J(sh,0,-.27,0);seg(el,.24,.025);
  const ha=J(el,0,-.25,0);const hb=mesh(new THREE.BoxGeometry(.05,.07,.035),bone,ha,0,-.025,0);return{sh,el,ha};}
const aR=arm(-1),aL=arm(1);
// Schwert in der rechten Hand (Klinge entlang lokaler -y, dann nach vorn gedreht)
const sw=J(aR.ha,0,-.04,0);sw.rotation.x=-0.95;
mesh(new THREE.CylinderGeometry(.016,.016,.11,8),leather,sw,0,0,0);
mesh(new THREE.SphereGeometry(.025,8,6),iron,sw,0,.07,0);
mesh(new THREE.BoxGeometry(.18,.025,.035),rust,sw,0,-.065,0);
mesh(new THREE.BoxGeometry(.055,.62,.012),steel,sw,0,-.39,0);
mesh(new THREE.ConeGeometry(.039,.07,4),steel,sw,0,-.735,0).rotation.set(Math.PI,Math.PI/4,0);
// Rundschild am linken Unterarm
const sg=J(chest,.17,.02,.2);sg.rotation.set(Math.PI/2,0,0);sg.rotation.order='YXZ';sg.rotation.y=.55;
mesh(new THREE.CylinderGeometry(.24,.24,.035,22),wood,sg);
const sr=mesh(new THREE.TorusGeometry(.24,.016,6,24),iron,sg);sr.rotation.x=Math.PI/2;
mesh(new THREE.SphereGeometry(.06,10,8,0,Math.PI*2,0,Math.PI/2),iron,sg,0,.017,0);
for(const a of[0,Math.PI/2]){const b=mesh(new THREE.BoxGeometry(.47,.04,.02),rust,sg,0,.02,0);b.rotation.y=a;}
// Beine
function leg(s){const hp=J(body,s*.095,-.03,0);seg(hp,.36,.038);const kn=J(hp,0,-.36,0);seg(kn,.35,.032);
  const an=J(kn,0,-.36,0);mesh(new THREE.BoxGeometry(.075,.04,.14),boneD,an,0,-.02,.035);return{hp,kn,an};}
const lR=leg(-1),lL=leg(1);

function pose(kind,t,dir){
  root.rotation.y=Math.PI/4+dir*Math.PI/4;root.position.y=0;
  body.rotation.set(0,0,0);spine.rotation.set(.05,0,0);head.rotation.set(-.05,0,0);
  for(const l of[lR,lL]){l.hp.rotation.set(0,0,0);l.kn.rotation.set(0,0,0);l.an.rotation.set(0,0,0);}
  aR.sh.rotation.set(-.35,0,.12);aR.el.rotation.set(-1.0,0,0);aR.ha.rotation.set(0,0,0);
  aL.sh.rotation.set(-.45,0,-.25);aL.el.rotation.set(-1.25,0,0);
  lR.hp.rotation.x=-.08;lL.hp.rotation.x=.06;lR.kn.rotation.x=.12;lL.kn.rotation.x=.1;
  if(kind==='idle'){const b=Math.sin(t*Math.PI*2)*.015;body.position.y=.83+b;}
  else if(kind==='walk'){const p=t*Math.PI*2,s=Math.sin(p),c=Math.cos(p);
    lR.hp.rotation.x=-.55*s;lL.hp.rotation.x=.55*s;
    lR.kn.rotation.x=.15+.75*Math.max(0,c);lL.kn.rotation.x=.15+.75*Math.max(0,-c);
    lR.an.rotation.x=.25*s;lL.an.rotation.x=-.25*s;
    body.position.y=.82+.035*Math.abs(c);body.rotation.y=.12*s;
    aR.sh.rotation.x=-.35+.35*s;aL.sh.rotation.x=-.45-.15*s;}
  else if(kind==='attack'){const KF=[[-.35,.12,-1.0,0,0],[-1.6,.5,-1.3,.6,.3],[-2.7,.6,-.9,1.0,.45],[-1.3,.1,-.2,.2,-.3],[-.6,-.1,-.3,.4,-.5],[-.4,.1,-.8,.1,-.2]];
    const k=KF[Math.round(t*5)];aR.sh.rotation.set(k[0],0,k[1]);aR.el.rotation.x=k[2];aR.ha.rotation.x=k[3];spine.rotation.y=k[4];
    lR.hp.rotation.x=-.35;lR.kn.rotation.x=.35;lL.hp.rotation.x=.35;lL.kn.rotation.x=.25;body.position.y=.79;
    aL.sh.rotation.set(-.6,0,-.35);}
  else if(kind==='death'){const k=Math.min(1,t*1.2);
    body.position.y=.83-.68*k;body.rotation.x=-1.25*k*k;head.rotation.x=.5*k;
    lR.kn.rotation.x=.12+1.6*Math.min(1,k*2)*(1-k*.6);lL.kn.rotation.x=.1+1.4*Math.min(1,k*2)*(1-k*.6);
    lR.hp.rotation.x=-1.0*Math.min(1,k*2)*(1-k*.7);lL.hp.rotation.x=-.8*Math.min(1,k*2)*(1-k*.7);
    aR.sh.rotation.x=-.35-1.4*k;aL.sh.rotation.x=-.45-1.6*k;}
}
window.shot=(kind,t,dir)=>{pose(kind,t,dir);R.render(scene,cam);return R.domElement.toDataURL('image/png');};
})();
