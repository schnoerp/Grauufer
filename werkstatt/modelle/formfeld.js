// Probe (Spiel-Rev 123): Avatar als Formfeld – eine durchgehende, weich verschmolzene Oberfläche statt zusammengesteckter Kugeln und Röhren.
// Jede Körperform ist ein Abstandsfeld (Ellipsoid, Kegelkapsel); weiche Vereinigung (smin) lässt Muskeln, Gelenke und Gesicht ineinanderfließen.
// Kleidung liegt als eigene, leicht aufgeblähte Schicht darüber. Die Oberfläche wird mit „Surface Nets“ auf einem feinen Raster berechnet
// (grob vorrechnen, fein nur nahe der Oberfläche), Normalen aus dem Feldgradienten, Farben je Punkt im Code (Haut, Karomuster, Leder).
// Maße in Metern, Startfigur (1,80 m) im Stehen, Blick nach +z. Benötigt THREE (three.js 0.149).
// window.Formfeld.bau(opt) → THREE.Mesh   opt.schritt: Rasterweite in Metern (Standard 0,0035)
(function(){
const sqrt=Math.sqrt,abs=Math.abs,max=Math.max,min=Math.min;
function smin(a,b,k){const h=max(k-abs(a-b),0)/k;return min(a,b)-h*h*k*.25;}
function smax(a,b,k){return -smin(-a,-b,k);}
// Kegelkapsel von a (Radius ra) nach b (Radius rb)
function cap(x,y,z,ax,ay,az,bx,by,bz,ra,rb){const px=x-ax,py=y-ay,pz=z-az,ux=bx-ax,uy=by-ay,uz=bz-az;
  let h=(px*ux+py*uy+pz*uz)/(ux*ux+uy*uy+uz*uz);h=h<0?0:h>1?1:h;const dx=px-ux*h,dy=py-uy*h,dz=pz-uz*h;return sqrt(dx*dx+dy*dy+dz*dz)-(ra+(rb-ra)*h);}
// Ellipsoid (Näherung nach Quilez)
function ell(x,y,z,cx,cy,cz,rx,ry,rz){const X=(x-cx)/rx,Y=(y-cy)/ry,Z=(z-cz)/rz,k0=sqrt(X*X+Y*Y+Z*Z),k1=sqrt(X*X/(rx*rx)+Y*Y/(ry*ry)+Z*Z/(rz*rz));
  return k1<1e-9?-min(rx,ry,rz):k0*(k0-1)/k1;}
function kugel(x,y,z,cx,cy,cz,r){const dx=x-cx,dy=y-cy,dz=z-cz;return sqrt(dx*dx+dy*dy+dz*dz)-r;}

// ---------- Anatomie (Haut) ----------
// Kopf: Schädel, Gesichtsschädel, Kiefer, Kinn, Wangenknochen, Brauenbogen, Augenhöhlen, Nase mit Flügeln, Lippen, Ohren
function kopf(x,y,z){const K=1.06;y=1.56+(y-1.56)/K;x/=K;z/=K;return kopf0(x,y,z)*K;}
function kopf0(x,y,z){const ax=abs(x);
  let d=ell(x,y,z,0,1.695,-.012,.077,.094,.097);
  d=smin(d,ell(x,y,z,0,1.628,.022,.068,.072,.075),.04);                      // Gesichtsschädel
  d=smin(d,ell(ax,y,z,.04,1.6,.05,.03,.03,.03),.03);                            // Wangen
  d=smin(d,cap(ax,y,z,.06,1.615,-.015,.024,1.565,.058,.026,.02),.03);           // Unterkiefer bis zum Kinn
  d=smin(d,ell(x,y,z,0,1.566,.068,.027,.02,.02),.02);                           // Kinn
  d=smin(d,ell(ax,y,z,.047,1.638,.06,.022,.016,.018),.02);                      // Wangenknochen
  d=smin(d,cap(ax,y,z,0,1.676,.086,.05,1.677,.07,.011,.008),.016);              // Brauenbogen
  d=smax(d,-kugel(ax,y,z,.033,1.654,.097,.0145),.01);                            // Augenhöhle
  d=smin(d,ell(ax,y,z,.033,1.666,.089,.016,.0045,.009),.004);                    // Oberlid
  d=smin(d,ell(ax,y,z,.033,1.643,.089,.014,.0035,.008),.004);                   // Unterlid
  // Nase: Rücken, Spitze, Flügel
  d=smin(d,cap(x,y,z,0,1.668,.093,0,1.622,.113,.0065,.0105),.012);
  d=smin(d,kugel(x,y,z,0,1.62,.112,.0105),.006);
  d=smin(d,kugel(ax,y,z,.0125,1.619,.102,.0085),.006);
  d=smax(d,-kugel(ax,y,z,.0085,1.611,.108,.0035),.003);                         // Nasenlöcher
  // Lippen und Mundspalte
  d=smin(d,ell(x,y,z,0,1.598,.088,.021,.006,.01),.008);
  d=smin(d,ell(x,y,z,0,1.587,.086,.018,.007,.01),.008);
  d=smax(d,-ell(x,y,z,0,1.5925,.097,.02,.0014,.011),.002);
  // Ohren mit Muschel
  const o=ell(ax,y,z,.08,1.645,-.008,.012,.031,.021);d=smin(d,o,.008);d=smax(d,-ell(ax,y,z,.088,1.643,-.005,.006,.018,.012),.004);
  return d;}
function augen(x,y,z){const K=1.06;return kugel(abs(x/K),1.56+(y-1.56)/K,z/K,.033,1.655,.082,.0128)*K;}
// Hals mit Kopfwendermuskel und Kehlkopf
function hals(x,y,z){const ax=abs(x);let d=cap(x,y,z,0,1.44,-.005,0,1.585,-.03,.054,.046);
  d=smin(d,cap(ax,y,z,.07,1.455,.035,.045,1.6,-.03,.018,.014),.02);d=smin(d,kugel(x,y,z,0,1.52,.045,.014),.015);return d;}
// Rumpf: Brustkorb, Brustmuskeln, Schlüsselbein, Trapezmuskel, Schulterblätter, Bauch, Flanken, Becken, Gesäß
function rumpf(x,y,z){const ax=abs(x);
  let d=ell(x,y,z,0,1.27,-.005,.158,.21,.108);
  d=smin(d,ell(ax,y,z,.072,1.325,.07,.078,.06,.04),.035);                       // Brustmuskel
  d=smin(d,cap(ax,y,z,.02,1.445,.055,.17,1.455,.02,.014,.012),.025);            // Schlüsselbein
  d=smin(d,cap(ax,y,z,.04,1.47,-.03,.17,1.435,-.01,.03,.024),.04);              // Trapezmuskel
  d=smin(d,ell(ax,y,z,.085,1.32,-.075,.07,.09,.035),.04);                       // Schulterblatt
  d=smin(d,ell(x,y,z,0,1.09,.012,.132,.15,.098),.07);                           // Bauch
  d=smin(d,ell(x,y,z,0,1.13,.07,.07,.1,.04),.04);                               // gerader Bauchmuskel
  d=smin(d,ell(x,y,z,0,.955,0,.162,.105,.108),.07);                             // Becken
  d=smin(d,ell(ax,y,z,.07,.905,-.06,.085,.085,.07),.05);                        // Gesäß
  return d;}
// Arme hängen locker, leicht angewinkelt: Deltamuskel, Bizeps, Trizeps, Unterarm, Hand mit Fingern und Daumen
function arme(x,y,z){const ax=abs(x);
  let d=ell(ax,y,z,.198,1.405,0,.062,.068,.06);                                 // Deltamuskel
  d=smin(d,cap(ax,y,z,.205,1.39,0,.23,1.12,-.02,.047,.037),.04);                // Oberarm
  d=smin(d,ell(ax,y,z,.222,1.26,.03,.03,.07,.028),.03);                         // Bizeps
  d=smin(d,ell(ax,y,z,.218,1.25,-.035,.03,.08,.03),.03);                        // Trizeps
  d=smin(d,cap(ax,y,z,.232,1.115,-.02,.248,.875,.055,.039,.026),.03);           // Unterarm
  d=smin(d,ell(ax,y,z,.236,1.04,0,.035,.06,.032),.03);                          // Unterarmmuskeln
  d=smin(d,ell(ax,y,z,.25,.83,.066,.019,.045,.032),.022);                       // Handfläche
  for(let i=0;i<4;i++){const fz=.088-i*.013;d=smin(d,cap(ax,y,z,.253,.8,fz,.252,.745,fz+.006,.0085,.007),.008);}
  d=smin(d,cap(ax,y,z,.238,.83,.09,.236,.79,.102,.009,.0075),.008);             // Daumen
  return d;}
// Beine: Oberschenkel (vorn kräftig), Knie, Wade, Schienbein, Knöchel, Fuß
function beine(x,y,z){const ax=abs(x);
  let d=cap(ax,y,z,.09,.93,0,.1,.5,.012,.088,.056);
  d=smin(d,ell(ax,y,z,.1,.72,.04,.06,.13,.05),.05);
  d=smin(d,kugel(ax,y,z,.1,.49,.025,.048),.03);
  d=smin(d,cap(ax,y,z,.1,.48,.005,.105,.09,-.012,.053,.034),.03);
  d=smin(d,ell(ax,y,z,.102,.36,-.035,.048,.09,.042),.04);                       // Wade
  d=smin(d,ell(ax,y,z,.105,.035,.04,.045,.035,.12),.035);                       // Fuß
  return d;}
function haut(x,y,z){let d=kopf(x,y,z);d=smin(d,hals(x,y,z),.022);d=smin(d,rumpf(x,y,z),.05);d=smin(d,arme(x,y,z),.035);d=smin(d,beine(x,y,z),.05);return d;}

// ---------- Kleidung ----------
// Hemd: Rumpf und Oberarme, 12 mm aufgebläht, Ärmel bis zum Ellbogen hochgekrempelt (Wulst), Kragen, Saum über dem Gürtel
function hemd(x,y,z){const ax=abs(x);
  let d=smin(rumpf(x,y,z),arme(x,y,z),.06)-.013;
  d=max(d,.998-y);                                                               // unten bis zum Gürtel (Hemd steckt in der Hose)
  if(ax>.165)d=max(d,1.105-y);                                                  // Ärmelende am Ellbogen
  d=min(d,cap(ax,y,z,.226,1.13,-.016,.233,1.1,-.02,.052,.049));                 // Krempe
  d=max(d,y-1.5);
  for(const sx of[-1,1]){const k=ell(x,y,z,sx*.045,1.478,.07,.04,.022,.01);d=smin(d,k,.006);}          // Kragenecken
  d=smax(d,-ell(x,y,z,0,1.49,.08,.028,.06,.05),.01);                            // offener Ausschnitt
  const fa=ax>.18?max(0,1-abs(y-1.16)/.06):max(0,1-abs(y-.97)/.05);               // Stofffalten am Ellbogen und über dem Gürtel
  return d+.0018*fa*Math.sin(y*110+Math.sin(x*35+z*20)*2.5);}
function hose(x,y,z){let d=smin(ell(x,y,z,0,.955,0,.162,.105,.108),beine(x,y,z),.06)-.015;d=smin(d,ell(abs(x),y,z,.07,.905,-.06,.085,.085,.07)-.015,.04);
  d=max(d,y-1.0);d=max(d,.3-y);const fa=max(0,1-abs(y-.5)/.05)+max(0,1-abs(y-.42)/.04);return d+.0015*fa*Math.sin(y*120+abs(x)*30+z*25);}
function stiefel(x,y,z){const ax=abs(x);let d=smin(cap(ax,y,z,.1,.42,.0,.105,.09,-.012,.062,.05),ell(ax,y,z,.105,.04,.045,.055,.045,.13),.04)-.004;
  d=max(d,y-.43);d=smin(d,max(cap(ax,y,z,.1,.415,0,.1,.395,0,.072,.072),y-.43),.01);d=min(d,max(ell(ax,y,z,.105,.012,.045,.06,.02,.14),-y));return d;}
function guertel(x,y,z){const d=ell(x,y,z,0,.985,.005,.16,.03,.112)-.012;return max(d,abs(y-.985)-.024);}

// alle Teile; Rückgabe Abstand, Teil in ART.t
const TEILE=['haut','auge','hemd','hose','stiefel','guertel'],ART={t:0};
function feld(x,y,z){let b=haut(x,y,z),t=0,v;
  if(y<1.75&&y>.6){v=hemd(x,y,z);if(v<b){b=v;t=2;}}
  if(y<1.08){v=hose(x,y,z);if(v<b){b=v;t=3;}v=guertel(x,y,z);if(v<b){b=v;t=5;}}
  if(y<.46){v=stiefel(x,y,z);if(v<b){b=v;t=4;}}
  if(y>1.6&&y<1.7){v=augen(x,y,z);if(v<b){b=v;t=1;}}
  ART.t=t;return b;}

// ---------- Farben je Punkt ----------
const C=(h)=>{const n=parseInt(h.slice(1),16);return[(n>>16)/255,(n>>8&255)/255,(n&255)/255];};
function farbe(x,y,z,t,L){if(y>1.5&&t<2){const K=1.06;x/=K;y=1.56+(y-1.56)/K;z/=K;}   // Kopfmaße wie in kopf()
  const ax=abs(x);
  if(t===0){let c=C(L.haut).slice();
    const rot=max(0,.03-kugel(x,y,z,0,1.62,.11,0))/.03*.18+max(0,.035-kugel(ax,y,z,.048,1.625,.07,0))/.035*.12+max(0,.03-kugel(ax,y,z,.085,1.645,-.005,0))/.03*.12;
    c[0]+=rot*.5;c[1]-=rot*.25;c[2]-=rot*.25;
    if(y<1.6&&y>1.55&&z>.04)for(let k=0;k<3;k++)c[k]*=.93;                       // Bartschatten
    if(abs(y-1.5925)<.006&&ax<.02&&z>.085){c=[c[0]*.8,c[1]*.55,c[2]*.5];}           // Lippen
    return c;}
  if(t===1){const dz=z-.083,dx=ax-.033,dy=y-1.655;const iris=dx*dx+dy*dy<.006*.006&&dz>.008;const pup=dx*dx+dy*dy<.0024*.0024&&dz>.01;
    return pup?[.04,.03,.03]:iris?C(L.augen):[.7,.64,.58];}
  if(t===2){const u=Math.atan2(x,z+.02)*.16,v=y,P=.09;
    // Streifen mit weichen Kanten (über etwa eine Rasterweite), damit die Farbübergänge nicht treppig werden
    const band=(q,a,b,w)=>{const f=((q%P)+P)%P;const e=(t)=>max(0,min(1,t/w+.5));return e(f-a)*e(b-f);};
    const A=band(u,.012,.04,.006),B=band(v,.012,.04,.006),hl=max(band(u,.062,.068,.004),band(v,.062,.068,.004));
    let c=C(L.hemd).slice();const dk=1-.45*max(A,B)-.2*A*B;for(let k=0;k<3;k++)c[k]*=dk;
    c=[c[0]*(1-.4*hl)+.35*hl,c[1]*(1-.4*hl)+.3*hl,c[2]*(1-.4*hl)+.25*hl];return c;}
  if(t===3)return C(L.hose);
  if(t===4){const c=C(L.stiefel).slice();if(y<.025)for(let k=0;k<3;k++)c[k]*=.4;return c;}
  if(t===5){if(ax<.032&&z>.09)return[.78,.6,.24];return C(L.guertel);}
  return[1,0,1];}

const lin=v=>Math.pow(Math.max(0,Math.min(1,v)),2.2);   // Farben sind sRGB, three.js rechnet linear
// ---------- Surface Nets ----------
function bau(opt={}){
  const L=Object.assign({haut:'#c99068',augen:'#3a5068',hemd:'#9a2e32',hose:'#1e1a1e',stiefel:'#4a301c',guertel:'#5a3a22'},opt.farben||{});
  const h=opt.schritt||.0035,G=4,x0=-.34,y0=-.01,z0=-.2,nx=Math.ceil(.68/h)+1,ny=Math.ceil(1.86/h)+1,nz=Math.ceil(.44/h)+1;
  // grob vorrechnen
  const gx=Math.ceil((nx-1)/G)+1,gy=Math.ceil((ny-1)/G)+1,gz=Math.ceil((nz-1)/G)+1,grob=new Float32Array(gx*gy*gz),hg=h*G;
  for(let k=0;k<gz;k++)for(let j=0;j<gy;j++)for(let i=0;i<gx;i++)grob[(k*gy+j)*gx+i]=feld(x0+i*hg,y0+j*hg,z0+k*hg);
  const band=hg*1.8,F=new Float32Array(nx*ny*nz);
  for(let k=0;k<nz;k++)for(let j=0;j<ny;j++)for(let i=0;i<nx;i++){const c=grob[(Math.round(k/G)*gy+Math.round(j/G))*gx+Math.round(i/G)];
    F[(k*ny+j)*nx+i]=abs(c)<band?feld(x0+i*h,y0+j*h,z0+k*h):c;}
  // Punkte je Zelle mit Vorzeichenwechsel
  const idx=new Int32Array((nx-1)*(ny-1)*(nz-1)).fill(-1),P=[],E=[[0,1],[2,3],[4,5],[6,7],[0,2],[1,3],[4,6],[5,7],[0,4],[1,5],[2,6],[3,7]],v=new Float32Array(8);
  const at=(i,j,k)=>F[(k*ny+j)*nx+i];
  for(let k=0;k<nz-1;k++)for(let j=0;j<ny-1;j++)for(let i=0;i<nx-1;i++){let neg=0;
    for(let c=0;c<8;c++){v[c]=at(i+(c&1),j+(c>>1&1),k+(c>>2&1));if(v[c]<0)neg++;}if(neg===0||neg===8)continue;
    let sx=0,sy=0,sz=0,n=0;for(const[a,b]of E){if((v[a]<0)===(v[b]<0))continue;const t=v[a]/(v[a]-v[b]);
      sx+=(a&1)+((b&1)-(a&1))*t;sy+=(a>>1&1)+((b>>1&1)-(a>>1&1))*t;sz+=(a>>2&1)+((b>>2&1)-(a>>2&1))*t;n++;}
    idx[(k*(ny-1)+j)*(nx-1)+i]=P.length/3;P.push(x0+(i+sx/n)*h,y0+(j+sy/n)*h,z0+(k+sz/n)*h);}
  // Vierecke über jede Kante mit Vorzeichenwechsel
  const I=[],ci=(i,j,k)=>idx[(k*(ny-1)+j)*(nx-1)+i];
  const quad=(a,b,c,d,flip)=>{if(a<0||b<0||c<0||d<0)return;if(flip)I.push(a,c,b,a,d,c);else I.push(a,b,c,a,c,d);};
  for(let k=1;k<nz-1;k++)for(let j=1;j<ny-1;j++)for(let i=1;i<nx-1;i++){const s=at(i,j,k)<0;
    if(i<nx-1&&(at(i+1,j,k)<0)!==s)quad(ci(i,j-1,k-1),ci(i,j,k-1),ci(i,j,k),ci(i,j-1,k),!s);
    if(j<ny-1&&(at(i,j+1,k)<0)!==s)quad(ci(i-1,j,k-1),ci(i-1,j,k),ci(i,j,k),ci(i,j,k-1),!s);
    if(k<nz-1&&(at(i,j,k+1)<0)!==s)quad(ci(i-1,j-1,k),ci(i,j-1,k),ci(i,j,k),ci(i-1,j,k),!s);}
  // Normalen aus dem Gradienten, Farben je Punkt
  const N=new Float32Array(P.length),Co=new Float32Array(P.length),e=h*.5;
  for(let p=0;p<P.length;p+=3){const x=P[p],y=P[p+1],z=P[p+2];
    let a=feld(x+e,y,z)-feld(x-e,y,z),b=feld(x,y+e,z)-feld(x,y-e,z),c=feld(x,y,z+e)-feld(x,y,z-e);const l=sqrt(a*a+b*b+c*c)||1;N[p]=a/l;N[p+1]=b/l;N[p+2]=c/l;
    feld(x,y,z);const f=farbe(x,y,z,ART.t,L);Co[p]=lin(f[0]);Co[p+1]=lin(f[1]);Co[p+2]=lin(f[2]);}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(P,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(N,3));
  g.setAttribute('color',new THREE.Float32BufferAttribute(Co,3));g.setIndex(I);
  const m=new THREE.Mesh(g,new THREE.MeshStandardMaterial({vertexColors:true,roughness:.78,metalness:0}));m.castShadow=m.receiveShadow=true;
  m.userData.dreiecke=I.length/3;return m;}

window.Formfeld={bau,feld,TEILE};
})();
