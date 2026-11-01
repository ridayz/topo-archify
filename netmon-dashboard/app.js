// NetMon SB Admin 2 — mockup lokal (localStorage), gaya SB Admin 2
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const LS="netmon_sb2_v1";
const MENUS=[["dashboard","📊 Dashboard"],["topology","🗺️ Topology"],["devices","🖥️ Perangkat"],["logs","📋 Log"],["settings","⚙️ Setting"]];
let S=load()||seed();
function seed(){return{theme:"light",route:"dashboard",dev:"sw-core-01",
devices:[
{id:"sw-core-01",name:"Switch Core 1",type:"switch",ip:"192.168.1.2",user:"admin",pass:"admin123",mode:"ssh",ports:24,status:"up"},
{id:"rtr-utama",name:"Router Utama",type:"router",ip:"192.168.1.1",user:"admin",pass:"admin",mode:"telnet",ports:8,status:"up"},
{id:"ap-lt2",name:"AP Lantai 2",type:"ap",ip:"192.168.1.20",user:"admin",pass:"",mode:"telnet",ports:4,status:"up"},
{id:"cctv-01",name:"CCTV Gudang",type:"cctv",ip:"192.168.1.50",user:"admin",pass:"cctv123",mode:"ssh",ports:2,status:"down"}],
selPort:{},topo:{nodes:[{id:"sw-core-01",x:340,y:120},{id:"rtr-utama",x:120,y:120},{id:"ap-lt2",x:340,y:320},{id:"cctv-01",x:580,y:320}],links:[["rtr-utama","sw-core-01"],["sw-core-01","ap-lt2"],["sw-core-01","cctv-01"]],labels:[{id:"l1",text:"Uplink 1G",x:200,y:90,size:14}]},
logs:[{t:now(),lvl:"info",msg:"Sistem NetMon dimulai"},{t:now(),lvl:"warn",msg:"CCTV Gudang (192.168.1.50) tidak merespons ping"}],
set:{poll:5,retention:30,alerts:true}}}
function load(){try{return JSON.parse(localStorage.getItem(LS))}catch{return null}}
function save(){localStorage.setItem(LS,JSON.stringify(S))}
function now(){return new Date().toLocaleString("id-ID")}
function rnd(a,b){return Math.round(a+Math.random()*(b-a))}
function log(lvl,msg){S.logs.unshift({t:now(),lvl,msg});S.logs=S.logs.slice(0,200);save();if(S.route==="logs")render()}
// ---------- shell ----------
document.documentElement.dataset.theme=S.theme;
function shell(){
if(S.route==="devices"&&!localStorage.getItem(LS))S.route="dashboard";
$("#nav").innerHTML=MENUS.map(([r,l])=>`<button data-r="${r}" class="${S.route===r?"on":""}">${l}</button>`).join("");
$$("#nav button").forEach(b=>b.onclick=()=>{S.route=b.dataset.r;save();shell();render()});
$("#burger").onclick=()=>document.body.classList.toggle("open");
$("#themeBtn").onclick=()=>{S.theme=S.theme==="light"?"dark":"light";document.documentElement.dataset.theme=S.theme;save()};
$("#q").oninput=e=>{if(S.route!=="devices"){S.route="devices";shell()}render(e.target.value)};
}
let charts=[];
function killCharts(){charts.forEach(c=>c.destroy());charts=[]}
// ---------- dashboard ----------
function dev(){return S.devices.find(d=>d.id===S.dev)||S.devices[0]}
function port(){return S.selPort[S.dev]??24}
function trafficSeries(){const p=port();return Array.from({length:24},(_,i)=>rnd(20+p*2,60+p*3))}
function renderDashboard(){
killCharts();
const d=dev(),p=port(),up=S.devices.filter(x=>x.status==="up").length;
const ts=trafficSeries(),lat=Array.from({length:24},()=>rnd(1,12));
$("#main").innerHTML=`
<h1 class="paget">Dashboard</h1><p class="sub">Klik port untuk melihat traffic &amp; latency port tersebut.</p>
<div class="row g4">
${statCard("var(--blue)","Traffic Port "+p,Math.round(ts[23])+" Mbps","📶")}
${statCard("var(--green)","Latency Port "+p,lat[23]+" ms","⏱️")}
${statCard("var(--cyan)","Port "+d.name,d.ports+" port","🔌")}
${statCard("var(--yellow)","Perangkat",up+"/"+S.devices.length+" online","🖥️")}
</div><br>
<div class="row g2">
<div class="card"><div class="chead">Traffic — ${esc(d.name)} Port ${p}<span class="badge up">live</span></div><div class="cbody"><canvas class="chart" id="cT"></canvas></div></div>
<div class="card"><div class="chead">Latency — Port ${p}<span class="badge warn">${lat[23]} ms</span></div><div class="cbody"><canvas class="chart" id="cL"></canvas></div></div>
</div><br>
<div class="row g2">
<div class="card"><div class="chead">Pilih Perangkat & Port</div><div class="cbody">
<label class="fl">Perangkat</label><select id="devSel">${S.devices.map(x=>`<option value="${x.id}" ${x.id===d.id?"selected":""}>${esc(x.name)} — ${x.ip}</option>`).join("")}</select>
<label class="fl">Port (klik salah satu)</label><div class="ports">${Array.from({length:d.ports},(_,i)=>{const n=i+1;const on=n===p;const ok=d.status==="up"&&Math.random()>.12;return `<button class="port ${on?"on":""}" data-p="${n}"><span class="dot ${on?"y":ok?"g":"r"}"></span><b>${n}</b><small>${ok?"up":"down"}</small></button>`}).join("")}</div>
</div></div>
<div class="card"><div class="chead">Status Port ${p}</div><div class="cbody">
<table class="tbl"><tr><th>Metrik</th><th>Nilai</th></tr>
<tr><td>Status</td><td><span class="badge up">UP · 1 Gbps Full</span></td></tr>
<tr><td>Traffic In / Out</td><td>${ts[23]} / ${rnd(10,40)} Mbps</td></tr>
<tr><td>Latency / Jitter</td><td>${lat[23]} ms / ${rnd(1,3)} ms</td></tr>
<tr><td>Error / Drop</td><td>${rnd(0,3)} / ${rnd(0,2)} pkt</td></tr></table>
<p style="color:var(--mut)">Data simulasi. Integrasi nyata: SNMP / Telnet / SSH per perangkat di menu Perangkat.</p>
</div></div>
</div>`;
$("#devSel").onchange=e=>{S.dev=e.target.value;save();render()};
$$(".port").forEach(b=>b.onclick=()=>{S.selPort[S.dev]=+b.dataset.p;log("info",`Port ${b.dataset.p} dipilih di ${d.name}`);save();render()});
mkChart("cT",ts,"#4e73df");mkChart("cL",lat,"#1cc88a");
}
function statCard(c,l,v,i){return `<div class="card"><div class="cbody"><div class="stat"><span class="bar" style="background:${c}"></span><div><div class="lbl">${l}</div><div class="val">${v}</div></div><span class="ico">${i}</span></div></div></div>`}
function mkChart(id,data,col){if(typeof Chart==="undefined")return;charts.push(new Chart($("#"+id),{type:"line",data:{labels:data.map((_,i)=>i+1),datasets:[{data,borderColor:col,backgroundColor:col+"33",fill:true,tension:.4,pointRadius:0}]},options:{responsive:true,plugins:{legend:{display:false}},scales:{x:{display:false}} }}))}
// ---------- devices ----------
function renderDevices(q=""){
killCharts();
const list=S.devices.filter(d=>!q||(d.name+d.ip).toLowerCase().includes(q.toLowerCase()));
$("#main").innerHTML=`<h1 class="paget">Perangkat</h1><p class="sub">Tambah / edit / hapus. Mode telnet hanya butuh password.</p>
<div class="toolbar"><button class="btn" id="addB">+ Tambah</button><span style="color:var(--mut)">${list.length} perangkat</span></div>
<div class="card"><div class="cbody" style="overflow:auto"><table class="tbl"><tr><th>Nama</th><th>Tipe</th><th>IP Manage</th><th>User</th><th>Mode</th><th>Status</th><th>Aksi</th></tr>
${list.map(d=>`<tr><td><b>${esc(d.name)}</b><br><small style="color:var(--mut)">${d.id}</small></td><td>${d.type}</td><td>${d.ip}</td><td>${esc(d.user||"—")}</td><td>${d.mode}</td><td><span class="badge ${d.status==="up"?"up":"down"}">${d.status}</span></td>
<td><button class="btn sm ghost" data-e="${d.id}">Edit</button> <button class="btn sm danger" data-h="${d.id}">Hapus</button></td></tr>`).join("")||`<tr><td colspan="7"><div class="empty">Tidak ada perangkat cocok.</div></td></tr>`}</table></div></div>
<div class="card" id="formC" style="display:none;margin-top:16px"><div class="chead" id="formT">Tambah perangkat</div><div class="cbody">
<label class="fl">Nama</label><input type="text" id="f_name"><label class="fl">Tipe</label><select id="f_type"><option>switch</option><option>router</option><option>ap</option><option>cctv</option><option>server</option><option>lainnya</option></select>
<label class="fl">IP Manage</label><input type="text" id="f_ip" placeholder="192.168.1.x">
<label class="fl">Mode</label><select id="f_mode"><option value="ssh">SSH (user + password)</option><option value="telnet">Telnet (password saja)</option></select>
<div id="uRow"><label class="fl">Username</label><input type="text" id="f_user"></div>
<label class="fl">Password</label><input type="password" id="f_pass">
<label class="fl">Jumlah port</label><input type="number" id="f_ports" value="24" min="1" max="96">
<br><br><button class="btn" id="saveB">Simpan</button> <button class="btn ghost" id="cancelB">Batal</button>
</div></div>`;
$("#addB").onclick=()=>openForm(null);
$("#f_mode")&&($("#f_mode").onchange=e=>$("#uRow").style.display=e.target.value==="telnet"?"none":"block");
$$("[data-e]").forEach(b=>b.onclick=()=>openForm(b.dataset.e));
$$("[data-h]").forEach(b=>b.onclick=()=>{if(!confirm("Hapus perangkat ini?"))return;const d=dev2(b.dataset.h);S.devices=S.devices.filter(x=>x.id!==b.dataset.h);S.topo.nodes=S.topo.nodes.filter(n=>n.id!==b.dataset.h);log("warn",`Perangkat ${d.name} dihapus`);save();render()});
}
function dev2(id){return S.devices.find(d=>d.id===id)}
function esc(s){return String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]))}
let editId=null;
function openForm(id){editId=id;$("#formC").style.display="block";$("#formT").textContent=id?"Edit perangkat":"Tambah perangkat";
const d=id?dev2(id):{name:"",type:"switch",ip:"",mode:"ssh",user:"",pass:"",ports:24};
f_name.value=d.name;f_type.value=d.type;f_ip.value=d.ip;f_mode.value=d.mode;f_user.value=d.user||"";f_pass.value=d.pass||"";f_ports.value=d.ports;$("#uRow").style.display=d.mode==="telnet"?"none":"block";
$("#formC").scrollIntoView({behavior:"smooth"});
$("#cancelB").onclick=()=>$("#formC").style.display="none";
$("#saveB").onclick=()=>{
if(!f_name.value.trim()||!f_ip.value.trim()){alert("Nama dan IP wajib diisi.");return}
if(f_mode.value==="ssh"&&!f_user.value.trim()){alert("Mode SSH butuh username.");return}
if(!f_pass.value){alert("Password wajib diisi.");return}
if(id){Object.assign(dev2(id),{name:f_name.value.trim(),type:f_type.value,ip:f_ip.value.trim(),mode:f_mode.value,user:f_mode.value==="telnet"?"":f_user.value.trim(),pass:f_pass.value,ports:+f_ports.value||24});log("info",`Perangkat ${f_name.value} diubah`)}
else{const nid=f_name.value.trim().toLowerCase().replace(/[^a-z0-9]+/g,"-");S.devices.push({id:nid+"-"+rnd(10,99),name:f_name.value.trim(),type:f_type.value,ip:f_ip.value.trim(),mode:f_mode.value,user:f_mode.value==="telnet"?"":f_user.value.trim(),pass:f_pass.value,ports:+f_ports.value||24,status:"up"});S.topo.nodes.push({id:S.devices.at(-1).id,x:rnd(80,500),y:rnd(60,340)});log("info",`Perangkat ${f_name.value} ditambah`)}
save();render()}}
// ---------- topology ----------
let tSel=null,linkFrom=null,tMode="move";
function renderTopo(){
killCharts();
const unplaced=S.devices.filter(d=>!S.topo.nodes.some(n=>n.id===d.id));
$("#main").innerHTML=`<h1 class="paget">Topology</h1><p class="sub">Mode Pindah: drag node. Mode Kabel: klik 2 perangkat untuk pasang / lepas kabel.</p>
<div class="toolbar">
<div class="grp"><button class="btn sm ${tMode==="move"?"":"ghost"}" id="mMove">✋ Pindah</button><button class="btn sm ${tMode==="cable"?"":"ghost"}" id="mCable">🔌 Kabel</button></div>
<select id="addNode" style="max-width:220px"><option value="">+ Tambah perangkat…</option>${unplaced.map(d=>`<option value="${d.id}">${esc(d.name)} (${d.ip})</option>`).join("")}</select>
<button class="btn sm" id="tAdd">+ Teks</button>
<button class="btn sm warn" id="tBig">A+</button><button class="btn sm warn" id="tSmall">A−</button>
<button class="btn sm ghost" id="tDel">Hapus pilihan</button>
<button class="btn sm ok" id="tSave">Simpan</button>
<span style="color:var(--mut)">Pilihan: <b id="tInfo">—</b></span></div>
<div class="row g2"><div id="topo" role="application" aria-label="Editor topologi"><svg id="wires"></svg><div id="nodes"></div></div>
<div class="card"><div class="chead">Daftar kabel (${S.topo.links.length})</div><div class="cbody" id="cableList"></div></div></div>`;
drawTopo();paintCables();
$("#mMove").onclick=()=>{tMode="move";linkFrom=null;save();renderTopo()};
$("#mCable").onclick=()=>{tMode="cable";save();renderTopo()};
$("#addNode").onchange=e=>{if(!e.target.value)return;S.topo.nodes.push({id:e.target.value,x:120+Math.random()*300,y:80+Math.random()*200});log("info","Perangkat ditambah ke topologi");save();renderTopo()};
$("#tAdd").onclick=()=>{S.topo.labels.push({id:"l"+Date.now(),text:"Teks baru — klik untuk edit",x:200,y:200,size:14});save();drawTopo()};
$("#tBig").onclick=()=>{const l=selLabel();if(l){l.size=Math.min(40,l.size+2);save();drawTopo()}};
$("#tSmall").onclick=()=>{const l=selLabel();if(l){l.size=Math.max(10,l.size-2);save();drawTopo()}};
$("#tDel").onclick=()=>{if(!tSel)return;
if(tSel.startsWith("L:")){S.topo.labels=S.topo.labels.filter(l=>"L:"+l.id!==tSel)}
else{S.topo.nodes=S.topo.nodes.filter(n=>n.id!==tSel);S.topo.links=S.topo.links.filter(x=>!x.includes(tSel))}
tSel=null;save();drawTopo();paintCables();log("warn","Item topologi dihapus")};
$("#tSave").onclick=()=>{save();log("info","Layout topologi disimpan");alert("Layout tersimpan.")};
}
function cableName(id){const d=dev2(id);return d?d.name:id}
function paintCables(){
const el=$("#cableList");if(!el)return;
el.innerHTML=S.topo.links.length?S.topo.links.map((x,i)=>`<div class="logline">🔌 ${esc(cableName(x[0]))} ↔ ${esc(cableName(x[1]))} <button class="btn sm danger" data-c="${i}" style="float:right">Lepas</button></div>`).join(""):`<div class="empty">Belum ada kabel. Aktifkan mode Kabel lalu klik 2 perangkat.</div>`;
el.querySelectorAll("[data-c]").forEach(b=>b.onclick=()=>{const x=S.topo.links.splice(+b.dataset.c,1)[0];log("warn",`Kabel ${cableName(x[0])} ↔ ${cableName(x[1])} dilepas`);save();drawTopo();paintCables()});
}
function selLabel(){return S.topo.labels.find(l=>"L:"+l.id===tSel)}
function drawTopo(){
const box=$("#nodes"),svg=$("#wires");box.innerHTML="";svg.innerHTML="";
const pos=id=>S.topo.nodes.find(n=>n.id===id);
S.topo.links.forEach(([a,b])=>{const A=pos(a),B=pos(b);if(!A||!B)return;
svg.innerHTML+=`<line x1="${A.x+55}" y1="${A.y+20}" x2="${B.x+55}" y2="${B.y+20}" stroke="#4e73df" stroke-width="3"/>`});
S.topo.nodes.forEach(n=>{const d=dev2(n.id);if(!d)return;
const el=document.createElement("div");el.className="node"+(tSel===n.id?" sel":"");el.style.left=n.x+"px";el.style.top=n.y+"px";
el.innerHTML=`${icon(d.type)} ${esc(d.name)}<br><small style="color:var(--mut)">${d.ip} · <span class="dot ${d.status==="up"?"g":"r"}"></span></small>`;
el.onclick=()=>{
if(tMode==="cable"){
if(!linkFrom){linkFrom=n.id;tSel=n.id;$("#tInfo").textContent=d.name+" → klik perangkat kedua";drawTopoSel();return}
if(linkFrom===n.id){linkFrom=null;tSel=null;drawTopo();return}
const i=S.topo.links.findIndex(x=>(x[0]===linkFrom&&x[1]===n.id)||(x[0]===n.id&&x[1]===linkFrom));
if(i>=0){S.topo.links.splice(i,1);log("warn",`Kabel ${cableName(linkFrom)} ↔ ${d.name} dilepas`)}
else{S.topo.links.push([linkFrom,n.id]);log("info",`Kabel ${cableName(linkFrom)} ↔ ${d.name} dipasang`)}
linkFrom=null;tSel=null;save();drawTopo();paintCables();return}
tSel=n.id;linkFrom=null;$("#tInfo").textContent=d.name;drawTopoSel()};
// drag hanya di mode pindah, biar klik kabel tidak geser
if(tMode==="move")drag(el,n);box.appendChild(el)});
S.topo.labels.forEach(l=>{const el=document.createElement("div");el.className="tlabel"+(tSel==="L:"+l.id?" sel":"");el.style.left=l.x+"px";el.style.top=l.y+"px";el.style.fontSize=l.size+"px";el.textContent=l.text;el.title="Klik 2x untuk edit";
el.onclick=()=>{tSel="L:"+l.id;$("#tInfo").textContent="teks: "+l.text;drawTopoSel()};
el.ondblclick=()=>{const v=prompt("Edit teks:",l.text);if(v!==null){l.text=v||"(kosong)";save();drawTopo()}};
drag(el,l);box.appendChild(el)});
}
function drawTopoSel(){drawTopo();const i=$("#tInfo");if(i&&tSel&&tSel.startsWith("L:")){const l=selLabel();if(l)i.textContent="teks: "+l.text}}
function icon(t){return{switch:"🔀",router:"🌐",ap:"📡",cctv:"🎥",server:"🗄️"}[t]||"📦"}
function drag(el,o){let sx,sy,ox,oy;el.onpointerdown=e=>{sx=e.clientX;sy=e.clientY;ox=o.x;oy=o.y;el.setPointerCapture(e.pointerId);el.onpointermove=ev=>{o.x=ox+ev.clientX-sx;o.y=oy+ev.clientY-sy;el.style.left=o.x+"px";el.style.top=o.y+"px";const svg=$("#wires");const pos=id=>S.topo.nodes.find(n=>n.id===id);svg.innerHTML=S.topo.links.map(([a,b])=>{const A=pos(a),B=pos(b);return A&&B?`<line x1="${A.x+55}" y1="${A.y+20}" x2="${B.x+55}" y2="${B.y+20}" stroke="#4e73df" stroke-width="3"/>`:""}).join("")};el.onpointerup=()=>el.onpointermove=null}}
// ---------- logs & settings ----------
function renderLogs(){
killCharts();
$("#main").innerHTML=`<h1 class="paget">Log</h1><p class="sub">${S.logs.length} entri · retensi ${S.set.retention} hari (simulasi).</p>
<div class="toolbar"><select id="lv" style="max-width:200px"><option value="">Semua level</option><option>info</option><option>warn</option><option>crit</option></select><button class="btn sm danger" id="clr">Bersihkan</button></div>
<div class="card"><div class="cbody" id="logB"></div></div>`;
const paint=f=>$("#logB").innerHTML=S.logs.filter(l=>!f||l.lvl===f).map(l=>`<div class="logline"><span style="color:var(--mut)">${l.t}</span> <span class="badge ${l.lvl==="info"?"up":l.lvl==="warn"?"warn":"down"}">${l.lvl}</span> ${esc(l.msg)}</div>`).join("")||`<div class="empty">Belum ada log.</div>`;
paint("");$("#lv").onchange=e=>paint(e.target.value);
$("#clr").onclick=()=>{if(confirm("Bersihkan semua log?")){S.logs=[];save();render()}};
}
function renderSettings(){
killCharts();
$("#main").innerHTML=`<h1 class="paget">Setting</h1><p class="sub">Tema, polling, dan preferensi notifikasi.</p>
<div class="row g2"><div class="card"><div class="chead">Tampilan</div><div class="cbody">
<label class="fl">Tema</label><select id="s_theme"><option value="light">Light</option><option value="dark">Dark</option></select>
<p style="color:var(--mut)">Gaya SB Admin 2: sidebar biru, kartu dengan aksen kiri, font Nunito.</p></div></div>
<div class="card"><div class="chead">Monitoring</div><div class="cbody">
<label class="fl">Interval polling (detik)</label><input type="number" id="s_poll" min="2" max="300">
<label class="fl">Retensi log (hari)</label><input type="number" id="s_ret" min="1" max="365">
<label class="fl"><input type="checkbox" id="s_al" style="width:auto"> Kirim alert Telegram saat down</label>
<br><br><button class="btn" id="s_save">Simpan</button> <button class="btn ghost" id="s_reset">Reset demo</button></div></div></div>`;
s_theme.value=S.theme;s_poll.value=S.set.poll;s_ret.value=S.set.retention;s_al.checked=S.set.alerts;
s_theme.onchange=e=>{S.theme=e.target.value;document.documentElement.dataset.theme=S.theme;save()};
$("#s_save").onclick=()=>{S.set.poll=+s_poll.value||5;S.set.retention=+s_ret.value||30;S.set.alerts=s_al.checked;save();log("info","Pengaturan disimpan");alert("Pengaturan tersimpan.")};
$("#s_reset").onclick=()=>{if(confirm("Reset semua data demo?")){localStorage.removeItem(LS);location.reload()}};
}
function render(q){tSel=null;linkFrom=null;
if(S.route==="dashboard")renderDashboard();else if(S.route==="devices")renderDevices(q||"");else if(S.route==="topology")renderTopo();else if(S.route==="logs")renderLogs();else renderSettings()}
shell();render();