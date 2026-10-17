(function(){THREE.ColorManagement.legacyMode=false;const S=160;const R=new THREE.WebGLRenderer({antialias:true,alpha:true,preserveDrawingBuffer:true});R.setSize(S,S);R.outputEncoding=THREE.sRGBEncoding;
document.body.appendChild(R.domElement);const scene=new THREE.Scene();const k=1.1;const cam=new THREE.OrthographicCamera(-k,k,k,-k,.1,50);
cam.position.set(6*Math.cos(Math.PI/4)*Math.sin(Math.PI/4)*1.0,6*Math.sin(Math.PI/3.2),6*Math.cos(Math.PI/4)*Math.cos(Math.PI/4));cam.lookAt(0,0,0);
scene.add(new THREE.HemisphereLight(0xfff3df,0x6a5844,.8));const sun=new THREE.DirectionalLight(0xfff1dc,1.1);sun.position.set(-2,6,4);scene.add(sun);
const M=o=>new THREE.MeshStandardMaterial(Object.assign({roughness:.7},o));
const steel=M({color:0xc0c4c8,metalness:.8,roughness:.3}),brass=M({color:0xc09040,metalness:.7,roughness:.35}),wood=M({color:0x7a5030,roughness:.85}),
 leather=M({color:0x5a3a22,roughness:.9}),iron=M({color:0x5a5650,metalness:.6,roughness:.5});
const g=new THREE.Group();scene.add(g);
const add=(geo,m,x=0,y=0,z=0,rx=0,ry=0,rz=0)=>{const o=new THREE.Mesh(geo,m);o.position.set(x,y,z);o.rotation.set(rx,ry,rz);g.add(o);return o;};
const B=(w,h,d,m,...a)=>add(new THREE.BoxGeometry(w,h,d),m,...a),C=(r1,r2,h,m,...a)=>add(new THREE.CylinderGeometry(r1,r2,h,18),m,...a),Sp=(r,m,...a)=>add(new THREE.SphereGeometry(r,18,14),m,...a);
const items={
schwert(){const p=new THREE.Group();B(.12,.03,1.3,steel,0,0,-.25);B(.42,.06,.07,brass,0,0,.43);C(.035,.035,.3,leather,0,0,.62,Math.PI/2);Sp(.06,brass,0,0,.8);g.rotation.y=-.6;},
schild(){C(.62,.62,.07,wood,0,0,0);add(new THREE.TorusGeometry(.62,.035,8,30),iron,0,.03,0,Math.PI/2);Sp(.14,iron,0,.04,0).scale.y=.6;B(1.2,.08,.1,iron,0,.04,0);B(.1,.08,1.2,iron,0,.04,0);g.rotation.x=-.3;},
heiltrank(){Sp(.3,M({color:0xc02020,roughness:.15,transparent:true,opacity:.9}),0,.3,0);C(.09,.11,.3,M({color:0xb0d0e0,roughness:.1,transparent:true,opacity:.6}),0,.7,0);C(.1,.1,.1,wood,0,.88,0);},
manatrank(){Sp(.3,M({color:0x2040c0,roughness:.15}),0,.3,0);C(.09,.11,.3,M({color:0xb0d0e0,roughness:.1,transparent:true,opacity:.6}),0,.7,0);C(.1,.1,.1,wood,0,.88,0);},
brot(){const b=Sp(.4,M({color:0xb07a3a}),0,.15,0);b.scale.set(1.5,.6,.9);for(let i=-1;i<=1;i++)B(.05,.04,.5,M({color:0xe0b070}),i*.25,.38,0,0,0,.2);},
apfel(){Sp(.28,M({color:0x9a2a20,roughness:.4}),0,.28,0);C(.02,.02,.16,wood,0,.6,0,0,0,.3);B(.14,.02,.08,M({color:0x4a7a2a}),.08,.62,0,0,.5,.3);},
schluessel(){add(new THREE.TorusGeometry(.18,.05,8,20),brass,-.45,0,0,Math.PI/2);C(.045,.045,.8,brass,.1,0,0,0,0,Math.PI/2);B(.08,.05,.2,brass,.42,0,.1);B(.08,.05,.14,brass,.3,0,.07);g.rotation.y=.5;},
kerze(){C(.12,.14,.06,brass,0,.03,0);C(.06,.06,.6,M({color:0xf2e6c8}),0,.36,0);add(new THREE.ConeGeometry(.04,.12,8),new THREE.MeshBasicMaterial({color:0xffc040}),0,.74,0);},
buch(){B(.8,.18,1.0,M({color:0x6a2a20}),0,.09,0);B(.74,.14,.96,M({color:0xe8dcc0}),.04,.09,0);B(.08,.05,.3,brass,0,.19,0);},
gold(){for(const[x,z,y]of[[0,0,0],[.2,.1,.06],[-.15,.18,.03],[.05,-.2,.09],[-.2,-.1,.12],[.1,.05,.15]])C(.18,.18,.05,brass,x,y,z);},
becher(){C(.2,.16,.45,M({color:0x8a6a4a}),0,.22,0);add(new THREE.TorusGeometry(.12,.035,8,14,Math.PI),M({color:0x8a6a4a}),.22,.25,0,0,0,-Math.PI/2);},
rolle(){C(.14,.14,.9,M({color:0xe8dcb8}),0,.14,0,0,0,Math.PI/2);B(.06,.3,.3,M({color:0x9a2a20}),0,.14,0);g.rotation.y=.4;},
dolch(){B(.08,.025,.7,steel,0,0,-.15);B(.26,.05,.05,iron,0,0,.22);C(.03,.03,.22,leather,0,0,.36,Math.PI/2);g.rotation.y=.9;},
edelstein(){add(new THREE.OctahedronGeometry(.3),M({color:0x30c070,roughness:.1,metalness:.2}),0,.3,0).scale.y=1.3;},
};
window.icon=n=>{while(g.children.length)g.remove(g.children[0]);g.rotation.set(0,0,0);items[n]();R.render(scene,cam);return R.domElement.toDataURL();};
window.names=Object.keys(items);})();
