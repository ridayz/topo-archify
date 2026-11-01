const BOOT=["upgradeBrowser.js","config_web.js","required.js","resource_1.js","resource_2.js","bg_1.js","bg_2.js","en.js"];
const $=id=>document.getElementById(id);
const S={dev:null,devices:[],view:"Files",path:[]};
const DEMO={files:[["DCIM/Camera/IMG_01.jpg","2,4 MB"],["Download/AirDroid.apk","18 MB"],["Music/lagu.mp3","4,1 MB"]],apps:[["WhatsApp",""],["Chrome",""],["AirDroid",""]]};
const P=(bg,inner)=>'<svg viewBox="0 0 80 80"><rect x="4" y="0" width="72" height="72" rx="16" fill="'+bg+'"/><g transform="translate(20,18)"><g fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">'+inner+'</g></g><rect x="4" y="0" width="72" height="34" rx="16" fill="rgba(255,255,255,.22)"/></svg>';
const IC={
files:P('#f5a623','<path d="M3 8a2 2 0 0 1 2-2h6l3 3h9a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8z"/>'),
apps:P('#7b7de0','<rect x="3" y="3" width="8" height="8" rx="2"/><rect x="15" y="3" width="8" height="8" rx="2"/><rect x="3" y="15" width="8" height="8" rx="2"/><rect x="15" y="15" width="8" height="8" rx="2"/>'),
photos:P('#a0c4e8','<rect x="3" y="6" width="20" height="14" rx="2"/><circle cx="13" cy="13" r="3.5"/><path d="M6 19l4-3 3 2 3-2 4 3"/>'),
music:P('#5ac8fa','<circle cx="9" cy="20" r="3.5"/><circle cx="20" cy="18" r="3.5"/><path d="M12.5 20V6l11-2v12"/>'),
videos:P('#64d2ff','<rect x="3" y="6" width="20" height="14" rx="2"/><path d="M11 10l5 3-5 3z" fill="#fff" stroke="none"/>'),
messages:P('#34c759','<path d="M22 13a8 8 0 0 1-8 8H5l2-3a8 8 0 1 1 15-5z"/>'),
contacts:P('#ff9500','<circle cx="13" cy="9" r="4"/><path d="M5 22a8 8 0 0 1 16 0"/>'),
camera:P('#8e8e93','<path d="M4 9h4l2-2h6l2 2h4a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1z"/><circle cx="13" cy="14.5" r="3.5"/>'),
mirroring:P('#30b0c7','<rect x="3" y="5" width="13" height="9" rx="2"/><rect x="10" y="11" width="13" height="9" rx="2"/>'),
control:P('#0a84ff','<rect x="7" y="3" width="12" height="20" rx="3"/><circle cx="13" cy="17" r="2"/>'),
find:P('#ff3b30','<circle cx="13" cy="13" r="7"/><circle cx="13" cy="13" r="2.5"/>'),
ringtones:P('#af52de','<path d="M6 19a4 4 0 1 1 3-7 5 5 0 0 1 8-1l-2 2h4V9l-2 2a7 7 0 0 0-11 8z"/>')};
const APPS=[["Files","files"],["Apps","apps"],["Photos","photos"],["Music","music"],["Videos","videos"],["Messages","messages"],["Contacts","contacts"],["Camera","camera"],["Mirroring","mirroring"],["Control","control"],["Find Phone","find"],["Ringtones","ringtones"]];
function toast(m){const t=$("toast");t.textContent=m;t.style.display="block";clearTimeout(t._h);t._h=setTimeout(()=>t.style.display="none",2200);}
let bi=0;const tick=setInterval(()=>{const p=Math.round((bi+1)/BOOT.length*100);$("boot-bar").style.width=(p*2.6)+"px";$("boot-text").textContent=p+"%";if(++bi>=BOOT.length){clearInterval(tick);$("block-loading").style.display="none";$("desktop").classList.remove("hidden");init();}},160);
function init(){buildIcons();$("dev-url").textContent=location.host;$("btn-dev").onclick=()=>{$("dev-panel").classList.toggle("hidden");loadDevices();};$("dev-x").onclick=()=>$("dev-panel").classList.add("hidden");$("btn-sim").onclick=()=>{S.dev={id:"sim",name:"HP-sim",files:[{name:"DCIM/foto-sim.jpg",size:"1 MB"}],apps:[{name:"WhatsApp"},{name:"Chrome"}]};onPair();};$("win-x").onclick=()=>$("win").classList.add("hidden");$("search").oninput=e=>openWin(S.view,e.target.value);setInterval(loadDevices,5000);loadDevices();openWin("Files");}
async function loadDevices(){try{const r=await fetch("/api/devices");S.devices=await r.json();}catch(e){S.devices=[];}const L=$("dev-list");if(!L)return;if(!S.devices.length){L.innerHTML='<div class="dev-it">Belum ada HP di jaringan ini</div>';return;}L.innerHTML=S.devices.map(d=>'<div class="dev-it" data-id="'+d.id+'"><div class="dev-ic">📱</div><div><b>'+d.name+'</b></div></div>').join("");L.querySelectorAll(".dev-it[data-id]").forEach(el=>el.onclick=()=>{const d=S.devices.find(x=>x.id===el.dataset.id);if(d){S.dev=d;onPair();}});}
function onPair(){$("dev-panel").classList.add("hidden");$("tb-name").textContent=S.dev.name;const c=$("tb-conn");c.textContent="● online";c.className="pill on";toast("Terhubung: "+S.dev.name);openWin("Files");}
function buildIcons(){const w=$("icons");w.innerHTML="";APPS.forEach(([n,k],i)=>{const d=document.createElement("div");d.className="icon";d.style.animationDelay=(0.05*i)+"s";d.innerHTML='<div class="glyph">'+IC[k]+'</div><span>'+n+'</span>';d.onclick=()=>openWin(n);w.appendChild(d);});const dk=$("dock");dk.innerHTML="";["Files","Messages","Camera","Photos"].forEach(n=>{const a=APPS.find(x=>x[0]===n);const d=document.createElement("div");d.className="dock-it";d.innerHTML=IC[a[1]];d.title=n;d.onclick=()=>openWin(n);dk.appendChild(d);});}
function curDir(){return S.path.join("/");}
function allFiles(){const base=DEMO.files.map(r=>({name:r[0],size:r[1]}));if(S.dev&&S.dev.files)base.push(...S.dev.files);return base;}
function openWin(n,f=""){S.view=n;$("win").classList.remove("hidden");$("win-title").textContent=n;const b=$("win-body");f=(f||"").toLowerCase();
if(n==="Apps"){const rows=(S.dev&&S.dev.apps&&S.dev.apps.length?S.dev.apps:DEMO.apps.map(a=>({name:a[0]})));b.innerHTML="<table><tr><th>Aplikasi</th></tr>"+rows.filter(a=>(a.name||"").toLowerCase().includes(f)).map(a=>"<tr><td>📦 "+a.name+"</td></tr>").join("")+"</table>";return;}
if(n==="Photos"){b.innerHTML='<div class="ph-grid">'+["🌅","🌃","🏖️","🏔️","🌸","🐱"].map((e,i)=>'<div class="ph" style="background:hsl('+(i*40)+',45%,30%)">'+e+'</div>').join("")+'</div>';return;}
if(n==="Mirroring"||n==="Camera"){b.innerHTML='<div style="background:#000;color:#fff;height:340px;display:flex;flex-direction:column;gap:10px;align-items:center;justify-content:center"><div style="font-size:52px">📱</div><p>'+((S.dev&&S.dev.name)||"Belum ada perangkat")+'</p></div>';return;}
const dir=curDir();const all=allFiles();
const inDir=all.filter(r=>{const rel=r.name.startsWith(dir)?r.name.slice(dir.length).replace(/^\//,""):null;if(rel===null||rel===""||rel.includes("/"))return false;return true;});
const subs=[...new Set(all.map(r=>{const rel=r.name.startsWith(dir)?r.name.slice(dir.length).replace(/^\//,""):null;if(!rel||!rel.includes("/"))return null;return rel.split("/")[0];}).filter(Boolean))];
b.innerHTML='<div class="fbar"><span>📂 '+"/ "+S.path.join(" / ")+'</span><span><button class="btn ghost" onclick="goUp()">Naik</button> <button class="btn ghost" onclick="mkdir()">+ Folder</button></span></div><table><tr><th>Nama</th><th>Ukuran</th><th>Aksi</th></tr>'+subs.filter(d=>d.toLowerCase().includes(f)).map(d=>'<tr><td>📁 <a style="cursor:pointer" onclick="goDir(\''+d+'\')">'+d+'</a></td><td>folder</td><td></td></tr>').join("")+inDir.filter(r=>r.name.toLowerCase().includes(f)).map(r=>'<tr><td>📄 '+r.name.split("/").pop()+'</td><td>'+(r.size||"—")+'</td><td><button class="btn ghost" onclick="toast(\'Unduh '+r.name+'\')">Unduh</button></td></tr>').join("")+'</table>';}
window.goDir=d=>{S.path.push(d);openWin("Files",$("search").value||"");};
window.goUp=()=>{S.path.pop();openWin("Files",$("search").value||"");};
window.mkdir=()=>toast("Buat folder (demo)");
