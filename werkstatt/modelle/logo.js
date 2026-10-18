// Grauufer-Logo als 3D-Modell (seit Spiel-Rev 112): „G“ aus Stein mit Querbalken, Rissen und Moos, in der Mitte das zerbrochene Amulett
// (goldenes Kreuz auf Blau). window.logo(N) rendert es N × N mit durchsichtigem Hintergrund. Eingebettet mit npm run logo.
(function(){
window.logo=function(N){
const R=new THREE.WebGLRenderer({antialias:true,alpha:true,preserveDrawingBuffer:true});R.setSize(N,N);R.outputEncoding=THREE.sRGBEncoding;R.shadowMap.enabled=true;
const sc=new THREE.Scene(),cam=new THREE.OrthographicCamera(-1.25,1.25,1.25,-1.25,.1,50);cam.position.set(0,0,10);cam.lookAt(0,0,0);
sc.add(new THREE.HemisphereLight(0xfff0dc,0x302820,.55));const sun=new THREE.DirectionalLight(0xfff2e0,1.25);sun.position.set(-4,5,6);sc.add(sun);
const rim=new THREE.DirectionalLight(0xffc070,.35);rim.position.set(5,-3,2);sc.add(rim);
let s=7;const rnd=()=>(s=(s*16807)%2147483647)/2147483647;
// Steintextur
const tc=document.createElement('canvas');tc.width=tc.height=256;const g=tc.getContext('2d');g.fillStyle='#7c766c';g.fillRect(0,0,256,256);
for(let i=0;i<5000;i++){const v=110+rnd()*70|0;g.fillStyle=`rgba(${v},${v-6},${v-14},.35)`;g.fillRect(rnd()*256,rnd()*256,1+rnd()*3,1+rnd()*3);}
for(let i=0;i<40;i++){g.strokeStyle='rgba(30,24,20,.55)';g.lineWidth=.6+rnd();g.beginPath();let x=rnd()*256,y=rnd()*256;g.moveTo(x,y);for(let k=0;k<5;k++){x+=(rnd()-.5)*30;y+=(rnd()-.5)*30;g.lineTo(x,y);}g.stroke();}
// Moos unten links
for(let i=0;i<900;i++){const a=rnd()*6.28,r=rnd()*70;const x=40+Math.cos(a)*r,y=215+Math.sin(a)*r*.6;g.fillStyle=rnd()<.5?'rgba(78,106,46,.8)':'rgba(94,126,54,.8)';g.fillRect(x,y,2+rnd()*3,2+rnd()*3);}
const tex=new THREE.CanvasTexture(tc);tex.encoding=THREE.sRGBEncoding;
const stein=new THREE.MeshStandardMaterial({map:tex,bumpMap:tex,bumpScale:.04,roughness:.9});
// G als Ringausschnitt mit Querbalken
const sh=new THREE.Shape(),Ra=1.0,Ri=.7,a0=.62,a1=Math.PI*2-.02;
sh.absarc(0,0,Ra,a0,a1,false);sh.lineTo(Math.cos(a1)*Ri,Math.sin(a1)*Ri);sh.absarc(0,0,Ri,a1,a0,true);sh.closePath();
const ext={depth:.35,bevelEnabled:true,bevelThickness:.08,bevelSize:.06,bevelSegments:3,curveSegments:96};
const gG=new THREE.ExtrudeGeometry(sh,ext);
// UV fürs Gesicht: Position -> UV
const p=gG.attributes.position,uv=gG.attributes.uv;for(let i=0;i<p.count;i++)uv.setXY(i,(p.getX(i)+1.1)/2.2,(p.getY(i)+1.1)/2.2);
const mG=new THREE.Mesh(gG,stein);mG.position.z=-.2;sc.add(mG);
const bar=new THREE.Shape();bar.moveTo(.42,-.2);bar.lineTo(1.0,-.2);bar.lineTo(1.0,.1);bar.lineTo(.42,.1);bar.closePath();
const gB=new THREE.ExtrudeGeometry(bar,ext);const pb=gB.attributes.position,ub=gB.attributes.uv;for(let i=0;i<pb.count;i++)ub.setXY(i,(pb.getX(i)+1.1)/2.2,(pb.getY(i)+1.1)/2.2);
const mB=new THREE.Mesh(gB,stein);mB.position.z=-.2;sc.add(mB);
// Kerbe oben (tiefer Riss)
const kerbe=new THREE.Mesh(new THREE.BoxGeometry(.05,.4,.6),new THREE.MeshStandardMaterial({color:0x16100c}));kerbe.position.set(-.08,.84,.1);kerbe.rotation.z=.25;sc.add(kerbe);
// Amulett
const blau=new THREE.MeshStandardMaterial({color:0x102a60,roughness:.85,metalness:0});
const gold=new THREE.MeshStandardMaterial({color:0xd8a038,roughness:.5,metalness:.55});
const am=new THREE.Mesh(new THREE.CylinderGeometry(.4,.4,.14,64),gold);am.rotation.x=Math.PI/2;am.position.z=.08;am.position.x=-.06;sc.add(am);
const am2=new THREE.Mesh(new THREE.CylinderGeometry(.34,.34,.16,64),blau);am2.rotation.x=Math.PI/2;am2.position.z=.1;am2.position.x=-.06;sc.add(am2);
for(const[w,h]of[[.12,.56],[.56,.12]]){const k=new THREE.Mesh(new THREE.BoxGeometry(w,h,.06),gold);k.position.z=.2;sc.add(k);}
const st=new THREE.Mesh(new THREE.OctahedronGeometry(.09),gold);st.scale.set(1,1,.4);st.position.z=.22;sc.add(st);
// Zickzack-Riss durchs Amulett
const pts=[[-.3,.25],[-.1,.08],[-.16,-.02],[.06,-.12],[.02,-.2],[.28,-.28]];
for(let i=0;i<pts.length-1;i++){const[a,b]=[pts[i],pts[i+1]],l=Math.hypot(b[0]-a[0],b[1]-a[1]);const r=new THREE.Mesh(new THREE.BoxGeometry(l,.028,.05),new THREE.MeshBasicMaterial({color:0x0c0806}));
  r.position.set((a[0]+b[0])/2,(a[1]+b[1])/2,.25);r.rotation.z=Math.atan2(b[1]-a[1],b[0]-a[0]);sc.add(r);}
sc.rotation.x=-.08;sc.rotation.y=.12;
R.render(sc,cam);return R.domElement.toDataURL();};
})();
