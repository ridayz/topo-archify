// Vision UI mockup — data dummy lokal
const $=s=>document.querySelector(s);
const MENUS=[["dashboard","📊","Dashboard"],["topology","🗺️","Topology"],["devices","🖥️","Perangkat"],["logs","📋","Log"],["settings","⚙️","Setting"]];
let route="dashboard";
const devices=[
{name:"Switch Core 1",ip:"192.168.1.2",type:"Switch",st:"up",up:"812 Mbps",lat:"4 ms"},
{name:"Router Utama",ip:"192.168.1.1",type:"Router",st:"up",up:"640 Mbps",lat:"6 ms"},
{name:"AP Lantai 2",ip:"192.168.1.20",type:"Access Point",st:"up",up:"210 Mbps",lat:"9 ms"},
{name:"CCTV Gudang",ip:"192.168.1.50",type:"CCTV",st:"down",up:"—",lat:"timeout"}];
let selPort=24;
function shell(){
$("#nav").innerHTML=MENUS.map(([r,i,l])=>`<button data-r="${r}" class="${route===r?"on":""}"><span>${i}</span>${l}</button>`).join("");
document.querySelectorAll("#nav button").forEach(b=>b.onclick=()=>{route=b.dataset.r;shell()});
}
function stats(){
const cards=[["Today's Traffic","1.84 Gbps","+5%","up","📶","i1"],["Avg Latency","6.2 ms","-1.2ms","up","⏱️","i2"],["Active Devices","18 / 20","+2","up","🖥️","i3"],["Packet Loss","0.4%","-0.1%","up","📉","i4"]];
$("#stats").innerHTML=cards.map(([l,v,d,c,ic,g])=>`<div class="glass"><div class="stat"><div><small>${l}</small><h2>${v}</h2><span class="delta ${c}">${d}</span></div><span class="ico ${g}">${ic}</span></div></div>`).join("");
}
function line(id,a,b,c1,c2){
if(typeof Chart==="undefined")return;
new Chart($("#"+id),{type:"line",data:{labels:a.map((_,i)=>i+1),datasets:[{data:a,borderColor:c1,backgroundColor:c1+"44",fill:true,tension:.45,pointRadius:0},{data:b,borderColor:c2,backgroundColor:"transparent",tension:.45,pointRadius:0}]},options:{plugins:{legend:{display:false}},scales:{x:{display:false,grid:{display:false}},y:{grid:{color:"rgba(255,255,255,.06)"},ticks:{color:"#A0AEC0"}}}}});
}
function paint(){
stats();
const up=Array.from({length:30},(_,i)=>400+Math.sin(i/4)*150+Math.random()*120);
const dn=Array.from({length:30},(_,i)=>250+Math.cos(i/5)*100+Math.random()*90);
const lat=Array.from({length:24},()=>2+Math.random()*8);
line("cMain",up,dn,"#00E0FF","#7928CA");
line("cLat",lat,lat.map(v=>v*.6),"#01B574","#01B57455");
if(typeof Chart!=="undefined")new Chart($("#cDonut"),{type:"doughnut",data:{labels:["Switch","Router","AP","CCTV"],datasets:[{data:[6,4,5,3],backgroundColor:["#0075FF","#7928CA","#00E0FF","#FF0080"],borderWidth:0}]},options:{cutout:"72%",plugins:{legend:{position:"bottom",labels:{color:"#A0AEC0",boxWidth:10}}}}});
$("#devN").textContent=devices.length;
$("#ports").innerHTML=Array.from({length:24},(_,i)=>{const n=i+1;return `<button class="port ${n===selPort?"on":""}" data-p="${n}"><span class="dot ${n===13?"r":n%5===0?"y":"g"}"></span>${n}</button>`}).join("");
document.querySelectorAll(".port").forEach(b=>b.onclick=()=>{selPort=+b.dataset.p;paint()});
$("#tbl").innerHTML=`<tr><th>Device</th><th>IP</th><th>Type</th><th>Uplink</th><th>Latency</th><th>Status</th></tr>`+devices.map(d=>`<tr><td><b>${d.name}</b></td><td>${d.ip}</td><td>${d.type}</td><td>${d.up}</td><td>${d.lat}</td><td><span class="badge ${d.st==="up"?"g":"r"}">${d.st}</span></td></tr>`).join("");
$("#addB").onclick=()=>alert("Mockup: form tambah perangkat di sini.");
setInterval(()=>{const u=Math.round(700+Math.random()*250);$("#upV").textContent=u+" Mbps";$("#upB").style.width=Math.min(100,u/12)+"%";},3000);
}
shell();paint();
