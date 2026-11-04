const K='kreasiku.v2',PAID=['Dibayar','Dikerjakan','Selesai'],CATS=['Logo','Poster','Banner','Kemasan','Media Sosial'],EM={Logo:'🎨',Poster:'🖼️',Banner:'🚩',Kemasan:'📦','Media Sosial':'📱'};
const day=n=>{const d=new Date();d.setDate(d.getDate()-n);return d.toISOString().slice(0,10)};
const h=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const rp=n=>'Rp '+Number(n).toLocaleString('id-ID'),fd=s=>new Date(s).toLocaleDateString('id-ID',{day:'2-digit',month:'short',year:'numeric'});
function seed(){
 const users=[{id:'c1',name:'Budi Santoso',role:'klien',email:'budi@mail.com',pw0:'klien123'},{id:'c2',name:'Maya Lestari',role:'klien',email:'maya@mail.com',pw0:'klien123'},{id:'d1',name:'Sari Studio',role:'desainer',email:'sari@kreasiku.id',pw0:'desainer123'},{id:'d2',name:'Raka Visual',role:'desainer',email:'raka@kreasiku.id',pw0:'desainer123'},{id:'a1',name:'Admin KreasiKu',role:'admin',email:'admin@kreasiku.id',pw0:'admin123'}];
 const sv=[['s1','Logo Bisnis Minimalis','Logo',350000,3,'d1','Logo modern + 3 revisi, file AI/PNG/SVG.'],['s2','Logo Maskot Karakter','Logo',600000,5,'d2','Logo maskot ilustratif untuk brand Anda.'],['s3','Poster Event & Promosi','Poster',200000,2,'d1','Poster A3 siap cetak, resolusi tinggi.'],['s4','Banner Spanduk / X-Banner','Banner',150000,2,'d2','Desain banner ukuran bebas siap cetak.'],['s5','Desain Kemasan Produk','Kemasan',750000,7,'d1','Kemasan box/pouch lengkap dengan dieline.'],['s6','Label Botol & Sachet','Kemasan',450000,4,'d2','Label produk F&B dan kosmetik.'],['s7','Paket Konten Instagram (10 post)','Media Sosial',400000,4,'d1','10 feed post dengan template konsisten.'],['s8','Template Story & Reels Cover','Media Sosial',250000,3,'d2','Set template story dan cover reels.']].map(a=>({id:a[0],title:a[1],cat:a[2],price:a[3],days:a[4],did:a[5],desc:a[6]}));
 const mk=(i,sid,cid,st,m,ago)=>{const s=sv.find(x=>x.id==sid);return{id:'INV-'+(2600+i),sid,cid,did:s.did,title:s.title,cat:s.cat,price:s.price,fee:Math.round(s.price*.1),brief:'Brief contoh pesanan.',status:st,method:m,created:day(ago),paid:PAID.includes(st)?day(ago):''}};
 const orders=[mk(1,'s1','c1','Selesai','QRIS',58),mk(2,'s5','c2','Selesai','VA BCA',47),mk(3,'s3','c1','Selesai','GoPay',35),mk(4,'s7','c2','Selesai','QRIS',24),mk(5,'s2','c1','Dikerjakan','VA Mandiri',12),mk(6,'s4','c2','Dibayar','GoPay',6),mk(7,'s6','c1','Selesai','Kartu Kredit',18),mk(8,'s8','c2','Menunggu Pembayaran','',2)];
 return{users,sv,orders,seq:2609,me:''};
}
let S=null;try{S=JSON.parse(localStorage.getItem(K))}catch(e){}if(!S)S=seed();
const save=()=>{try{localStorage.setItem(K,JSON.stringify(S))}catch(e){toast('Penyimpanan penuh – kurangi jumlah/ukuran foto')}};
const U=id=>S.users.find(u=>u.id==id),me=()=>U(S.me),O=id=>S.orders.find(o=>o.id==id);
let tab='katalog',fcat='',modal='',cur='',pend='',R={from:'',to:'',status:'paid',cat:'',did:''},DL=null;
try{window.claude&&claude.use('downloads').then(x=>DL=x).catch(()=>{})}catch(e){}
function toast(t){const e=document.getElementById('toast');e.textContent=t;e.style.display='block';clearTimeout(toast.t);toast.t=setTimeout(()=>e.style.display='none',2600)}
function saveFile(name,blob){
 if(DL){DL.save({filename:name,data:blob}).catch(e=>{if(e&&e.code!='declined')toast('Unduhan tidak tersedia')});return}
 const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();
}
const badge=s=>`<span class="bd ${s=='Selesai'?'ok':s=='Menunggu Pembayaran'?'wr':s=='Dibatalkan'?'er':''}">${s}</span>`;

function render(){
 const u=me();
 const tabs=!u?[['katalog','Katalog']]:u.role=='klien'?[['katalog','Katalog'],['pesanan','Pesanan Saya']]:u.role=='desainer'?[['katalog','Katalog'],['layanan','Layanan Saya'],['pesanan','Pesanan Masuk']]:[['laporan','Laporan Keuangan'],['pesanan','Semua Pesanan'],['layanan','Kelola Layanan'],['pengguna','Pengguna'],['katalog','Katalog']];
 if(!tabs.some(t=>t[0]==tab))tab=tabs[0][0];
 hd.innerHTML=`<span class="lg">KreasiKu</span><nav>${tabs.map(t=>`<button class="${t[0]==tab?'on':''}" onclick="tab='${t[0]}';render()">${t[1]}</button>`).join('')}</nav>`+(u?`<span class="av">${h(u.name[0])}</span><span class="mut">${h(u.name)} · <b>${u.role}</b></span><button class="btn sec sm" onclick="logout()">Keluar</button>`:`<button class="btn sec sm" onclick="lm='up';modal='login';render()">Daftar</button><button class="btn sm" onclick="lm='in';modal='login';render()">Masuk</button>`);
 mn.innerHTML=({katalog,pesanan,layanan,laporan,pengguna})[tab]();
 md.innerHTML=modal?`<div class="modal" onclick="if(event.target==this){modal='';render()}"><div class="box ${modal=='det'||modal=='svf'?'wd':''}">${({login:mLogin,order:mOrder,pay:mPay,inv:mInv,det:mDet,svf:mSvf,cf:mCf})[modal]()}</div></div>`:'';
}
function login(id){S.me=id;save();modal='';tab='katalog';if(pend&&U(id).role=='klien'){const p=pend;pend='';return orderStart(p)}pend='';render()}
function logout(){S.me='';save();render()}
let lm='in',gi=0,q='',ed=null,cft='sv';
const GR={Logo:['#7c3aed','#ec4899'],Poster:['#f97316','#ef4444'],Banner:['#0ea5e9','#6366f1'],Kemasan:['#10b981','#14b8a6'],'Media Sosial':['#f43f5e','#a855f7']};
const SVG=b=>'data:image/svg+xml,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 260" font-family="Arial,sans-serif">${b}</svg>`);
const ART={
 s1:()=>SVG(`<rect width="400" height="260" fill="#f5f3ff"/><circle cx="200" cy="105" r="52" fill="#6d28d9"/><path d="M200 63 L238 128 L162 128Z" fill="#f0abfc"/><circle cx="200" cy="108" r="16" fill="#fff"/><text x="200" y="195" text-anchor="middle" font-size="30" font-weight="800" fill="#2e1065" letter-spacing="6">BRANDKU</text><text x="200" y="218" text-anchor="middle" font-size="11" fill="#7c3aed" letter-spacing="4">CREATIVE STUDIO</text>`),
 s2:()=>SVG(`<rect width="400" height="260" fill="#fff7ed"/><circle cx="130" cy="70" r="30" fill="#fb923c"/><circle cx="270" cy="70" r="30" fill="#fb923c"/><circle cx="200" cy="135" r="82" fill="#f97316"/><circle cx="130" cy="70" r="16" fill="#fed7aa"/><circle cx="270" cy="70" r="16" fill="#fed7aa"/><circle cx="170" cy="122" r="13" fill="#fff"/><circle cx="230" cy="122" r="13" fill="#fff"/><circle cx="173" cy="124" r="6" fill="#1f2937"/><circle cx="233" cy="124" r="6" fill="#1f2937"/><ellipse cx="200" cy="155" rx="22" ry="14" fill="#fed7aa"/><path d="M180 173 Q200 193 220 173" stroke="#7c2d12" stroke-width="5" fill="none" stroke-linecap="round"/><text x="200" y="250" text-anchor="middle" font-size="16" font-weight="800" fill="#9a3412">SI KUCING</text>`),
 s3:()=>SVG(`<rect width="400" height="260" fill="#e0e7ff"/><g transform="rotate(-4 200 130)"><rect x="120" y="14" width="160" height="232" rx="6" fill="#111827"/><circle cx="200" cy="85" r="42" fill="#f43f5e"/><circle cx="222" cy="72" r="26" fill="#fbbf24"/><text x="200" y="158" text-anchor="middle" font-size="22" font-weight="900" fill="#fff">MUSIK</text><text x="200" y="180" text-anchor="middle" font-size="22" font-weight="900" fill="#fbbf24">FEST 2026</text><rect x="150" y="196" width="100" height="3" fill="#fff"/><text x="200" y="218" text-anchor="middle" font-size="9" fill="#cbd5e1">12 DES · GOR KOTA</text></g>`),
 s4:()=>SVG(`<rect width="400" height="260" fill="#e0f2fe"/><rect x="30" y="50" width="340" height="130" rx="8" fill="#0369a1"/><circle cx="330" cy="60" r="60" fill="#38bdf8" opacity=".5"/><text x="50" y="108" font-size="34" font-weight="900" fill="#fff">GRAND SALE</text><text x="50" y="146" font-size="28" font-weight="900" fill="#fde047">DISKON 50%</text><rect x="50" y="156" width="110" height="14" rx="7" fill="#fff"/><rect x="60" y="180" width="6" height="60" fill="#475569"/><rect x="334" y="180" width="6" height="60" fill="#475569"/>`),
 s5:()=>SVG(`<rect width="400" height="260" fill="#ecfdf5"/><ellipse cx="200" cy="232" rx="110" ry="12" fill="#a7f3d0"/><path d="M110 90 L230 90 L290 60 L170 60Z" fill="#6ee7b7"/><rect x="110" y="90" width="120" height="130" fill="#10b981"/><path d="M230 90 L290 60 L290 190 L230 220Z" fill="#059669"/><circle cx="170" cy="140" r="26" fill="#fff"/><text x="170" y="146" text-anchor="middle" font-size="16" font-weight="900" fill="#047857">TEH</text><text x="170" y="196" text-anchor="middle" font-size="12" font-weight="700" fill="#d1fae5">ORGANIC</text>`),
 s6:()=>SVG(`<rect width="400" height="260" fill="#fdf2f8"/><rect x="178" y="22" width="44" height="30" rx="5" fill="#be185d"/><rect x="186" y="52" width="28" height="26" fill="#f9a8d4"/><rect x="146" y="78" width="108" height="156" rx="26" fill="#f472b6"/><rect x="146" y="120" width="108" height="76" fill="#fff"/><text x="200" y="152" text-anchor="middle" font-size="16" font-weight="900" fill="#be185d">ROSEA</text><text x="200" y="170" text-anchor="middle" font-size="9" fill="#9d174d" letter-spacing="2">FACE SERUM</text><text x="200" y="186" text-anchor="middle" font-size="8" fill="#9d174d">30 ML</text>`),
 s7:()=>SVG(`<rect width="400" height="260" fill="#fff1f2"/><rect x="140" y="12" width="120" height="236" rx="18" fill="#1f2937"/><rect x="147" y="26" width="106" height="208" rx="10" fill="#fff"/>${[0,1,2].map(r=>[0,1,2].map(c=>`<rect x="${150+c*34}" y="${60+r*34}" width="32" height="32" fill="${['#fb7185','#a78bfa','#fbbf24','#34d399','#60a5fa','#f472b6','#f97316','#818cf8','#2dd4bf'][r*3+c]}"/>`).join('')).join('')}<circle cx="165" cy="42" r="9" fill="#f43f5e"/><rect x="180" y="38" width="50" height="8" rx="4" fill="#e5e7eb"/>`),
 s8:()=>SVG(`<rect width="400" height="260" fill="#faf5ff"/>${[['#8b5cf6','#ec4899',60],['#f97316','#facc15',155],['#06b6d4','#6366f1',250]].map((a,i)=>`<defs><linearGradient id="g${i}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a[0]}"/><stop offset="1" stop-color="${a[1]}"/></linearGradient></defs><rect x="${a[2]-10}" y="${20+i%2*10}" width="100" height="190" rx="12" fill="url(#g${i})"/><text x="${a[2]+40}" y="${105+i%2*10}" text-anchor="middle" font-size="16" font-weight="900" fill="#fff">STORY</text><rect x="${a[2]+10}" y="${120+i%2*10}" width="60" height="6" rx="3" fill="#fff" opacity=".8"/>`).join('')}`)
};
const DEF={Logo:'s1',Poster:'s3',Banner:'s4',Kemasan:'s5','Media Sosial':'s7'};
const art=s=>(ART[s.id]||ART[DEF[s.cat]])();
const imgs=s=>s.imgs&&s.imgs.length?s.imgs:s.img?[s.img]:[];
const cover=s=>`<img src="${imgs(s)[0]||art(s)}" alt="${h(s.title)}">`;
const readImg=f=>new Promise(r=>{if(!f)return r('');const fr=new FileReader();fr.onload=()=>{const i=new Image();i.onload=()=>{const k=Math.min(1,600/Math.max(i.width,i.height)),c=document.createElement('canvas');c.width=i.width*k;c.height=i.height*k;c.getContext('2d').drawImage(i,0,0,c.width,c.height);r(c.toDataURL('image/jpeg',.8))};i.onerror=()=>r('');i.src=fr.result};fr.onerror=()=>r('');fr.readAsDataURL(f)});
async function sha(s){try{const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s));return[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')}catch(e){return'x'+btoa(s)}}
function fill(e,p){le.value=e;lp.value=p}
function mLogin(){
 if(lm=='up')return`<h2>Daftar Akun Klien</h2><div class="mut">Pendaftaran mandiri khusus Klien.</div><div class="fm" style="margin-top:10px"><div><label>Nama lengkap</label><input id="rn"></div><div><label>Email</label><input id="re" type="email"></div><div><label>No. HP</label><input id="rh" type="tel"></div><div><label>Password (min. 6 karakter)</label><input id="rq" type="password"></div><div><label>Ulangi password</label><input id="rq2" type="password"></div></div><div class="row"><button class="btn sec" onclick="lm='in';render()">Sudah punya akun</button><button class="btn" onclick="doReg()">Daftar</button></div>`;
 return`<h2>Masuk</h2><div class="fm" style="margin-top:10px"><div><label>Email</label><input id="le" type="email" autocomplete="username"></div><div><label>Password</label><input id="lp" type="password" autocomplete="current-password" onkeydown="if(event.key=='Enter')doLogin()"></div></div><div class="row"><button class="btn sec" onclick="lm='up';render()">Daftar sebagai Klien</button><button class="btn" onclick="doLogin()">Masuk</button></div><div class="card" style="margin-top:14px"><div class="mut" style="margin-bottom:6px">Akun demo (klik untuk mengisi):</div>${[['Admin','admin@kreasiku.id','admin123'],['Klien','budi@mail.com','klien123'],['Desainer','sari@kreasiku.id','desainer123']].map(a=>`<div><button class="btn sec sm" style="margin:2px 0" onclick="fill('${a[1]}','${a[2]}')">${a[0]}</button> <span class="mut">${a[1]} / ${a[2]}</span></div>`).join('')}</div><div class="row"><button class="btn sec sm" onclick="modal='';render()">Tutup</button></div>`}
async function doLogin(){const u=S.users.find(x=>x.email==le.value.trim().toLowerCase());if(!u||u.pw!=await sha(lp.value))return toast('Email atau password salah');lm='in';login(u.id)}
async function doReg(){const n=rn.value.trim(),e=re.value.trim().toLowerCase(),p=rq.value;if(!n||!e.includes('@')||p.length<6)return toast('Isi nama, email valid, dan password min. 6 karakter');if(p!=rq2.value)return toast('Ulangi password tidak sama');if(S.users.some(x=>x.email==e))return toast('Email sudah terdaftar');const u={id:'c'+Date.now(),name:n,role:'klien',email:e,phone:rh.value.trim(),pw:await sha(p)};S.users.push(u);save();lm='in';login(u.id);toast('Akun berhasil dibuat. Selamat datang, '+n+'!')}

function gridHTML(){
 const l=S.sv.filter(s=>(!fcat||s.cat==fcat)&&(!q||(s.title+' '+s.desc).toLowerCase().includes(q)));
 return l.map(s=>`<div class="card"><div class="cv" style="cursor:pointer" onclick="detail('${s.id}')">${cover(s)}</div><span class="bd">${s.cat}</span><h2 style="margin:8px 0 2px;font-size:16px">${h(s.title)}</h2><div class="mut">${h(s.desc)}</div><div class="mut" style="margin-top:6px">oleh ${h(U(s.did)?.name)} · ${s.days} hari${imgs(s).length>1?' · '+imgs(s).length+' foto':''}</div><div style="display:flex;justify-content:space-between;align-items:center;margin-top:10px"><b>${rp(s.price)}</b><span><button class="btn sec sm" onclick="detail('${s.id}')">Detail</button> <button class="btn sm" onclick="orderStart('${s.id}')">Pesan</button></span></div></div>`).join('')||'<div class="mut">Layanan tidak ditemukan.</div>';
}
function katalog(){
 return`<section class="hero"><div><h1>Wujudkan desain impianmu bersama desainer profesional</h1><p>Logo, poster, banner, desain kemasan, dan konten media sosial. Pesan, bayar, dan terima hasilnya dengan mudah.</p>${me()?'':`<button class="btn" style="margin-top:14px;background:#fff;color:#6d28d9" onclick="lm='up';modal='login';render()">Daftar Gratis sebagai Klien</button>`}</div><div class="hs"><div><b>${S.sv.length}</b>Layanan</div><div><b>${S.users.filter(u=>u.role=='desainer').length}</b>Desainer</div><div><b>5</b>Kategori</div></div></section><div class="chips">${['',...CATS].map(c=>`<button class="chip ${c==fcat?'on':''}" onclick="fcat='${c}';render()">${c||'Semua'}</button>`).join('')}</div><input placeholder="🔍 Cari layanan…" value="${h(q)}" oninput="q=this.value.toLowerCase();gr.innerHTML=gridHTML()" style="max-width:340px;margin-bottom:14px"><div class="grid" id="gr">${gridHTML()}</div>`;
}
function detail(id){cur=id;gi=0;modal='det';render()}
function mDet(){
 const s=S.sv.find(x=>x.id==cur),l=imgs(s).length?imgs(s):[art(s)];gi=Math.min(gi,l.length-1);
 return`<img src="${l[gi]}" alt="" style="width:100%;border-radius:12px;aspect-ratio:400/260;object-fit:cover;background:var(--ac2)">${l.length>1?`<div class="thumbs" style="margin-top:8px">${l.map((x,i)=>`<div class="th ${i==gi?'on':''}" onclick="gi=${i};render()"><img src="${x}" alt=""></div>`).join('')}</div>`:''}<h2 style="margin-top:12px">${h(s.title)}</h2><span class="bd">${s.cat}</span><p>${h(s.desc)}</p><div class="mut">oleh ${h(U(s.did)?.name)} · estimasi ${s.days} hari</div><div class="row" style="align-items:center;justify-content:space-between"><b style="font-size:20px">${rp(s.price)}</b><span><button class="btn sec" onclick="modal='';render()">Tutup</button> <button class="btn" onclick="orderStart('${s.id}')">Pesan Sekarang</button></span></div>`;
}
function orderStart(sid){
 const u=me();if(!u){pend=sid;modal='login';return render()}
 if(u.role!='klien'){return toast('Masuk sebagai Klien untuk memesan')}
 cur=sid;modal='order';render();
}
function mOrder(){const s=S.sv.find(x=>x.id==cur);return`<h2>Pesan: ${h(s.title)}</h2><div class="mut">${rp(s.price)} · estimasi ${s.days} hari</div><div class="fm" style="margin-top:10px"><div><label>Brief / kebutuhan desain</label><textarea id="brief" rows="4" placeholder="Nama brand, warna, gaya, ukuran…"></textarea></div></div><div class="row"><button class="btn sec" onclick="modal='';render()">Batal</button><button class="btn" onclick="doOrder()">Buat Pesanan & Bayar</button></div>`}
function doOrder(){
 const s=S.sv.find(x=>x.id==cur),id='INV-'+(S.seq++);
 S.orders.push({id,sid:s.id,cid:S.me,did:s.did,title:s.title,cat:s.cat,price:s.price,fee:Math.round(s.price*.1),brief:brief.value||'-',status:'Menunggu Pembayaran',method:'',created:day(0),paid:''});
 save();cur=id;modal='pay';render();
}

function mPay(){
 const o=O(cur),va='8808'+o.id.replace(/\D/g,'').padStart(8,'0');
 return`<h2>KreasiPay Sandbox</h2><div class="mut">Simulator payment gateway – tidak ada uang sungguhan.</div><div class="card" style="margin:10px 0"><div class="mut">${o.id} · ${h(o.title)}</div><b style="font-size:20px">${rp(o.price)}</b></div>${['QRIS','VA BCA','VA Mandiri','GoPay','Kartu Kredit'].map((m,i)=>`<label class="opt"><input type="radio" name="m" value="${m}" ${i?'':'checked'} onchange="payInfo()"> ${m}</label>`).join('')}<div id="pinfo" class="mut" style="text-align:center;margin-top:8px">${payHTML('QRIS',va)}</div><div class="row"><button class="btn sec" onclick="modal='';render()">Bayar Nanti</button><button class="btn dg" onclick="doPay(false)">Simulasi Gagal</button><button class="btn" id="pb" onclick="doPay(true)">Simulasi Bayar Sukses</button></div>`;
}
const payHTML=(m,va)=>m=='QRIS'||m=='GoPay'?`<div class="qr">▦</div>Scan kode QR (simulasi) dengan ${m=='QRIS'?'aplikasi e-wallet/mobile banking':'aplikasi Gojek'}`:m.startsWith('VA')?`Nomor Virtual Account ${m.slice(3)}<br><b style="font-size:18px;color:var(--tx)">${va}</b>`:`Kartu uji: <b style="color:var(--tx)">4811 1111 1111 1114</b>`;
function payInfo(){const o=O(cur),m=document.querySelector('input[name=m]:checked').value;pinfo.innerHTML=payHTML(m,'8808'+o.id.replace(/\D/g,'').padStart(8,'0'))}
function doPay(ok){
 const m=document.querySelector('input[name=m]:checked').value;pb.textContent='Memproses…';pb.disabled=true;
 setTimeout(()=>{
  if(!ok){toast('Pembayaran gagal (simulasi). Coba lagi.');return render()}
  const o=O(cur);o.status='Dibayar';o.method=m;o.paid=day(0);save();modal='inv';render();toast('Pembayaran berhasil ✓');
 },900);
}

const invHTML=o=>`<div class="inv"><div class="ih"><div><b class="lg">KreasiKu</b><div class="mut">Marketplace Jasa Desain Grafis</div></div><div style="text-align:right"><h2>INVOICE</h2><div>${o.id}</div><div class="mut">${fd(o.created)}</div></div></div><div class="ig"><div><div class="mut">Klien</div><b>${h(U(o.cid).name)}</b></div><div><div class="mut">Desainer</div><b>${h(U(o.did).name)}</b></div><div><div class="mut">Status</div><b>${o.status}</b></div></div><table><tr><th>Layanan</th><th>Kategori</th><th class="r">Harga</th></tr><tr><td style="white-space:normal">${h(o.title)}</td><td>${o.cat}</td><td class="r">${rp(o.price)}</td></tr></table><div class="tot">Total <b>${rp(o.price)}</b></div><div class="mut">Metode: ${o.method||'-'} · Dibayar: ${o.paid?fd(o.paid):'belum'}</div></div>`;
function mInv(){const o=O(cur);return invHTML(o)+`<div class="row"><button class="btn sec" onclick="modal='';render()">Tutup</button><button class="btn sec" onclick="invPDF('${o.id}')">Unduh PDF</button><button class="btn" onclick="window.print()">Cetak</button></div>`}
function invPDF(id){
 const o=O(id),d=new jspdf.jsPDF();d.setFontSize(20);d.text('KreasiKu',14,20);d.setFontSize(10);d.text('Marketplace Jasa Desain Grafis',14,26);d.setFontSize(16);d.text('INVOICE',196,20,{align:'right'});d.setFontSize(10);d.text(o.id+' | '+fd(o.created),196,26,{align:'right'});
 d.text('Klien: '+U(o.cid).name,14,40);d.text('Desainer: '+U(o.did).name,14,46);d.text('Status: '+o.status,14,52);
 d.autoTable({startY:60,head:[['Layanan','Kategori','Harga']],body:[[o.title,o.cat,rp(o.price)]],headStyles:{fillColor:[109,40,217]},columnStyles:{2:{halign:'right'}}});
 const y=d.lastAutoTable.finalY+8;d.setFontSize(12);d.text('Total: '+rp(o.price),196,y,{align:'right'});d.setFontSize(9);d.text('Metode: '+(o.method||'-')+' | Dibayar: '+(o.paid?fd(o.paid):'belum'),14,y);
 saveFile(o.id+'.pdf',d.output('blob'));
}

function pesanan(){
 const u=me(),k=u.role,l=S.orders.filter(o=>k=='admin'||(k=='klien'?o.cid==u.id:o.did==u.id)).slice().reverse();
 const act=o=>{let a=`<button class="btn sec sm" onclick="cur='${o.id}';modal='inv';render()">Invoice</button> `;
  if(k=='klien'&&o.status=='Menunggu Pembayaran')a+=`<button class="btn sm" onclick="cur='${o.id}';modal='pay';render()">Bayar</button> <button class="btn dg sm" onclick="setSt('${o.id}','Dibatalkan')">Batal</button>`;
  if(k=='desainer'&&o.status=='Dibayar')a+=`<button class="btn sm" onclick="setSt('${o.id}','Dikerjakan')">Mulai Kerjakan</button>`;
  if(k=='desainer'&&o.status=='Dikerjakan')a+=`<button class="btn sm" onclick="setSt('${o.id}','Selesai')">Tandai Selesai</button>`;
  return a};
 const earn=k=='desainer'?`<div class="stats"><div class="card stat"><span class="mut">Pendapatan bersih (setelah fee 10%)</span><b>${rp(l.filter(o=>PAID.includes(o.status)).reduce((a,o)=>a+o.price-o.fee,0))}</b></div></div>`:'';
 return`<h1>${k=='klien'?'Pesanan Saya':k=='desainer'?'Pesanan Masuk':'Semua Pesanan'}</h1>${earn}<div class="tw"><table><tr><th>Invoice</th><th>Tanggal</th><th>Layanan</th><th>${k=='klien'?'Desainer':'Klien'}</th><th class="r">Total</th><th>Status</th><th></th></tr>${l.map(o=>`<tr><td>${o.id}</td><td>${fd(o.created)}</td><td>${h(o.title)}</td><td>${h(U(k=='klien'?o.did:o.cid).name)}</td><td class="r">${rp(o.price)}</td><td>${badge(o.status)}</td><td>${act(o)}</td></tr>`).join('')||'<tr><td colspan="7" class="mut">Belum ada pesanan.</td></tr>'}</table></div>`;
}
function setSt(id,s){O(id).status=s;save();render()}

function layanan(){
 const u=me(),a=u.role=='admin',l=S.sv.filter(s=>a||s.did==u.id);
 return`<h1>${a?'Kelola Layanan':'Layanan Saya'}</h1><div class="mut">Tambah, edit, dan hapus menu layanan beserta foto contohnya.</div><div class="fl"><button class="btn" onclick="svForm()">+ Tambah Layanan</button></div><div class="tw"><table><tr><th>Foto</th><th>Layanan</th><th>Kategori</th>${a?'<th>Desainer</th>':''}<th class="r">Harga</th><th></th></tr>${l.map(s=>`<tr><td><div class="cv" style="width:64px;height:42px;margin:0">${cover(s)}</div></td><td>${h(s.title)} <span class="mut">(${imgs(s).length} foto)</span></td><td>${s.cat}</td>${a?`<td>${h(U(s.did)?.name)}</td>`:''}<td class="r">${rp(s.price)}</td><td><button class="btn sec sm" onclick="svForm('${s.id}')">Edit</button> <button class="btn dg sm" onclick="ask('sv','${s.id}')">Hapus</button></td></tr>`).join('')||'<tr><td colspan="6" class="mut">Belum ada layanan.</td></tr>'}</table></div>`;
}
function svForm(id){
 const s=id&&S.sv.find(x=>x.id==id);
 ed=s?{...s,imgs:[...imgs(s)]}:{id:'',title:'',cat:'Logo',price:'',days:3,desc:'',imgs:[],did:me().role=='desainer'?S.me:S.users.find(u=>u.role=='desainer').id};
 modal='svf';render();
}
function grab(){ed.title=ft.value;ed.cat=fc.value;ed.price=fp.value;ed.days=fdy.value;ed.desc=fe.value;const d=document.getElementById('fdd');if(d)ed.did=d.value}
function mSvf(){
 return`<h2>${ed.id?'Edit':'Tambah'} Layanan</h2><div class="fm" style="margin-top:10px"><div><label>Nama layanan</label><input id="ft" value="${h(ed.title)}"></div><div class="fl" style="margin:0"><div><label>Kategori</label><select id="fc">${CATS.map(c=>`<option ${c==ed.cat?'selected':''}>${c}</option>`).join('')}</select></div><div><label>Harga (Rp)</label><input id="fp" type="number" min="10000" value="${ed.price}"></div><div><label>Estimasi hari</label><input id="fdy" type="number" min="1" value="${ed.days}"></div></div>${me().role=='admin'?`<div><label>Desainer</label><select id="fdd">${S.users.filter(u=>u.role=='desainer').map(u=>`<option value="${u.id}" ${u.id==ed.did?'selected':''}>${h(u.name)}</option>`).join('')}</select></div>`:''}<div><label>Deskripsi</label><textarea id="fe" rows="3">${h(ed.desc)}</textarea></div><div><label>Foto contoh (maks. 6)</label><div class="thumbs">${ed.imgs.map((x,i)=>`<div class="th"><img src="${x}" alt=""><button onclick="rmImg(${i})">×</button></div>`).join('')||'<span class="mut">Belum ada foto – memakai ilustrasi bawaan.</span>'}</div><input type="file" accept="image/*" multiple onchange="addImgs(this.files)"></div></div><div class="row"><button class="btn sec" onclick="modal='';render()">Batal</button><button class="btn" onclick="saveSv()">Simpan</button></div>`;
}
async function addImgs(files){grab();for(const f of [...files]){if(ed.imgs.length>=6){toast('Maksimal 6 foto');break}const x=await readImg(f);if(x)ed.imgs.push(x)}render()}
function rmImg(i){grab();ed.imgs.splice(i,1);render()}
function saveSv(){
 grab();if(!ed.title.trim()||!(+ed.price>0))return toast('Isi nama layanan dan harga');
 const o={id:ed.id||'s'+Date.now(),title:ed.title.trim(),cat:ed.cat,price:+ed.price,days:+ed.days||3,did:ed.did,desc:ed.desc.trim()||'-',imgs:ed.imgs},i=S.sv.findIndex(s=>s.id==o.id);
 i<0?S.sv.push(o):S.sv[i]=o;save();modal='';render();toast(i<0?'Layanan ditambahkan':'Layanan diperbarui');
}
function pengguna(){
 return`<h1>Pengguna</h1><div class="mut">Klien mendaftar sendiri. Akun Desainer dibuat oleh Admin di sini.</div><div class="card fm" style="margin:12px 0"><h2>Tambah akun Desainer</h2><div class="fl" style="margin:0"><input id="un" placeholder="Nama"><input id="ue" type="email" placeholder="Email"><input id="up" placeholder="Password (min. 6)"><button class="btn" onclick="addDs()">Tambah</button></div></div><div class="tw"><table><tr><th>Nama</th><th>Email</th><th>Peran</th><th></th></tr>${S.users.map(u=>`<tr><td>${h(u.name)}</td><td>${h(u.email)}</td><td><span class="bd">${u.role}</span></td><td>${u.role=='admin'?'':`<button class="btn dg sm" onclick="ask('us','${u.id}')">Hapus</button>`}</td></tr>`).join('')}</table></div>`;
}
async function addDs(){const n=un.value.trim(),e=ue.value.trim().toLowerCase(),p=up.value;if(!n||!e.includes('@')||p.length<6)return toast('Isi nama, email valid, dan password min. 6 karakter');if(S.users.some(x=>x.email==e))return toast('Email sudah terdaftar');S.users.push({id:'d'+Date.now(),name:n,role:'desainer',email:e,pw:await sha(p)});save();render();toast('Akun desainer dibuat')}
function ask(t,id){cft=t;cur=id;modal='cf';render()}
function mCf(){const t=cft=='sv'?S.sv.find(x=>x.id==cur)?.title:U(cur)?.name;return`<h2>Hapus ${cft=='sv'?'layanan':'akun'}?</h2><p>${h(t)}</p><div class="row"><button class="btn sec" onclick="modal='';render()">Batal</button><button class="btn dg" onclick="doDel()">Ya, hapus</button></div>`}
function doDel(){
 if(cft=='sv')S.sv=S.sv.filter(s=>s.id!=cur);
 else{if(S.orders.some(o=>o.cid==cur||o.did==cur)){modal='';render();return toast('Akun punya riwayat pesanan, tidak bisa dihapus')}S.sv=S.sv.filter(s=>s.did!=cur);S.users=S.users.filter(u=>u.id!=cur)}
 save();modal='';render();toast('Dihapus');
}
const rows=()=>S.orders.filter(o=>(R.status=='paid'?PAID.includes(o.status):R.status=='all'||o.status==R.status)&&(!R.from||(o.paid||o.created)>=R.from)&&(!R.to||(o.paid||o.created)<=R.to)&&(!R.cat||o.cat==R.cat)&&(!R.did||o.did==R.did)).sort((a,b)=>(b.paid||b.created).localeCompare(a.paid||a.created));
const sum=l=>{const p=l.filter(o=>PAID.includes(o.status)),g=p.reduce((a,o)=>a+o.price,0),f=p.reduce((a,o)=>a+o.fee,0);return{n:p.length,g,f,d:g-f}};
function laporan(){
 const l=rows(),t=sum(l),set=(k)=>`onchange="R.${k}=this.value;render()"`;
 return`<h1>Laporan Keuangan</h1><div class="mut">Pendapatan platform = fee 10% dari setiap pesanan yang sudah dibayar.</div><div class="fl"><div><label>Dari tanggal</label><input type="date" value="${R.from}" ${set('from')}></div><div><label>Sampai</label><input type="date" value="${R.to}" ${set('to')}></div><div><label>Status</label><select ${set('status')}>${[['paid','Sudah dibayar'],['all','Semua'],['Selesai','Selesai'],['Dikerjakan','Dikerjakan'],['Dibayar','Dibayar'],['Menunggu Pembayaran','Menunggu Pembayaran'],['Dibatalkan','Dibatalkan']].map(a=>`<option value="${a[0]}" ${R.status==a[0]?'selected':''}>${a[1]}</option>`).join('')}</select></div><div><label>Kategori</label><select ${set('cat')}><option value="">Semua</option>${CATS.map(c=>`<option ${R.cat==c?'selected':''}>${c}</option>`).join('')}</select></div><div><label>Desainer</label><select ${set('did')}><option value="">Semua</option>${S.users.filter(u=>u.role=='desainer').map(u=>`<option value="${u.id}" ${R.did==u.id?'selected':''}>${h(u.name)}</option>`).join('')}</select></div><button class="btn sec sm" onclick="R={from:'',to:'',status:'paid',cat:'',did:''};render()">Reset</button><button class="btn sm" onclick="repPDF()">Cetak PDF</button><button class="btn sm" onclick="repXL()">Ekspor Excel</button></div><div class="stats"><div class="card stat"><span class="mut">Transaksi dibayar</span><b>${t.n}</b></div><div class="card stat"><span class="mut">Total pembayaran</span><b>${rp(t.g)}</b></div><div class="card stat"><span class="mut">Pendapatan platform</span><b>${rp(t.f)}</b></div><div class="card stat"><span class="mut">Pendapatan desainer</span><b>${rp(t.d)}</b></div></div><div class="tw"><table><tr><th>Invoice</th><th>Tanggal</th><th>Klien</th><th>Desainer</th><th>Kategori</th><th>Metode</th><th>Status</th><th class="r">Total</th><th class="r">Fee</th></tr>${l.map(o=>`<tr><td>${o.id}</td><td>${fd(o.paid||o.created)}</td><td>${h(U(o.cid).name)}</td><td>${h(U(o.did).name)}</td><td>${o.cat}</td><td>${o.method||'-'}</td><td>${badge(o.status)}</td><td class="r">${rp(o.price)}</td><td class="r">${PAID.includes(o.status)?rp(o.fee):'-'}</td></tr>`).join('')||'<tr><td colspan="9" class="mut">Tidak ada data untuk filter ini.</td></tr>'}</table></div>`;
}
function repPDF(){
 const l=rows(),t=sum(l),d=new jspdf.jsPDF('l');d.setFontSize(16);d.text('Laporan Keuangan KreasiKu',14,16);d.setFontSize(9);
 d.text('Periode: '+(R.from?fd(R.from):'awal')+' s/d '+(R.to?fd(R.to):'sekarang')+' | Kategori: '+(R.cat||'Semua')+' | Desainer: '+(R.did?U(R.did).name:'Semua')+' | Dicetak: '+fd(day(0)),14,22);
 d.text(`Transaksi dibayar: ${t.n}   Total: ${rp(t.g)}   Pendapatan platform: ${rp(t.f)}   Pendapatan desainer: ${rp(t.d)}`,14,28);
 d.autoTable({startY:33,head:[['Invoice','Tanggal','Klien','Desainer','Layanan','Status','Metode','Total','Fee']],body:l.map(o=>[o.id,fd(o.paid||o.created),U(o.cid).name,U(o.did).name,o.title,o.status,o.method||'-',rp(o.price),PAID.includes(o.status)?rp(o.fee):'-']),foot:[['','','','','','','TOTAL (dibayar)',rp(t.g),rp(t.f)]],headStyles:{fillColor:[109,40,217]},footStyles:{fillColor:[237,233,254],textColor:20},styles:{fontSize:8}});
 saveFile('laporan-keuangan.pdf',d.output('blob'));
}
function repXL(){
 const l=rows(),t=sum(l),r=l.map(o=>({Invoice:o.id,Tanggal:o.paid||o.created,Klien:U(o.cid).name,Desainer:U(o.did).name,Layanan:o.title,Kategori:o.cat,Status:o.status,Metode:o.method||'-','Nilai Order':o.price,'Dibayar':PAID.includes(o.status)?o.price:0,'Fee Platform (10%)':PAID.includes(o.status)?o.fee:0,'Pendapatan Desainer':PAID.includes(o.status)?o.price-o.fee:0}));
 r.push({Invoice:'TOTAL','Dibayar':t.g,'Fee Platform (10%)':t.f,'Pendapatan Desainer':t.d});
 const wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,XLSX.utils.json_to_sheet(r),'Laporan');
 saveFile('laporan-keuangan.xlsx',new Blob([XLSX.write(wb,{bookType:'xlsx',type:'array'})],{type:'application/octet-stream'}));
}
(async()=>{for(const u of S.users)if(u.pw0){u.pw=await sha(u.pw0);delete u.pw0}save();render()})();
