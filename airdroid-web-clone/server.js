const http=require("http"),fs=require("fs"),path=require("path");
const PORT=8080;
const sessions=new Map();
const devices=new Map();
const MIME={".html":"text/html",".css":"text/css",".js":"text/javascript",".json":"application/json"};
function mk(){return "AD-"+Math.floor(100000+Math.random()*899999);}
function send(res,c,t,m){res.writeHead(c,{"Content-Type":m||"application/json","Access-Control-Allow-Origin":"*"});res.end(t);}
function body(req,cb){let d="";req.on("data",x=>d+=x);req.on("end",()=>{try{cb(JSON.parse(d||"{}"));}catch{cb({});}});}
const srv=http.createServer((req,res)=>{
const u=new URL(req.url,"http://x");
if(req.method==="OPTIONS"){res.writeHead(204,{"Access-Control-Allow-Origin":"*","Access-Control-Allow-Methods":"*","Access-Control-Allow-Headers":"*"});return res.end();}
if(u.pathname==="/api/devices"&&req.method==="GET"){const now=Date.now();for(const[k,v]of devices)if(now-v.seen>45000)devices.delete(k);return send(res,200,JSON.stringify([...devices.values()]));}
if(u.pathname==="/api/devices/register"&&req.method==="POST")return body(req,b=>{const id=b.id||("dev-"+Math.floor(Math.random()*1e6));devices.set(id,{id,name:b.name||"HP",model:b.model||"",ip:req.socket.remoteAddress||"",seen:Date.now(),files:b.files||[],apps:b.apps||[]});return send(res,200,JSON.stringify({id}));});
if(u.pathname==="/api/devices/push"&&req.method==="POST")return body(req,b=>{const d=devices.get(b.id);if(!d)return send(res,404,'{"error":"unknown"}');d.seen=Date.now();if(b.files)d.files=b.files;if(b.apps)d.apps=b.apps;if(b.name)d.name=b.name;return send(res,200,'{"ok":true}');});
if(u.pathname==="/api/session/create"&&req.method==="POST"){const c=mk();sessions.set(c,{exp:Date.now()+120000,phone:null,files:[]});return send(res,200,JSON.stringify({code:c}));}
let m=u.pathname.match(/^\/api\/session\/([A-Za-z0-9-]+)\/(status|join|files)$/);
if(m){const s=sessions.get(m[1]);if(!s)return send(res,404,'{"error":"unknown"}');
if(Date.now()>s.exp&&m[2]==="status")return send(res,410,'{"error":"expired"}');
if(m[2]==="status")return send(res,200,JSON.stringify({paired:!!s.phone,phone:s.phone,files:s.files}));
if(m[2]==="join"&&req.method==="POST")return body(req,b=>{s.phone={name:b.name||"HP",at:new Date().toISOString()};return send(res,200,'{"ok":true}');});
if(m[2]==="files"){
if(req.method==="GET")return send(res,200,JSON.stringify(s.files));
return body(req,b=>{
if(b.op==="delete"){s.files=s.files.filter(x=>x.name!==b.name);return send(res,200,'{"ok":true}');}
if(b.op==="rename"){const f=s.files.find(x=>x.name===b.name);if(f)f.name=b.to||f.name;return send(res,200,'{"ok":true}');}
if(b.op==="mkdir"){s.files.push({name:(b.name||"Folder-baru")+"/",size:"folder"});return send(res,200,'{"ok":true}');}
if(b.op==="apps"&&Array.isArray(b.apps)){s.apps=b.apps;return send(res,200,'{"ok":true}');}
s.files.push({name:b.name||"file",size:b.size||""});return send(res,200,'{"ok":true}');});}}
let a=u.pathname.match(/^\/api\/session\/([A-Za-z0-9-]+)\/apps$/);
if(a){const s=sessions.get(a[1]);if(!s)return send(res,404,'{"error":"unknown"}');if(req.method==="GET")return send(res,200,JSON.stringify(s.apps||[]));return body(req,b=>{s.apps=b.apps||[];return send(res,200,'{"ok":true}');});}
let p=u.pathname;if(p.startsWith("/pair/"))p="/phone.html";if(p==="/")p="/index.html";
const fp=path.join(__dirname,p.split("?")[0].replace(/\.\./g,""));
fs.readFile(fp,(e,d)=>{if(e)return send(res,404,"nf","text/plain");send(res,200,d,MIME[path.extname(fp)]||"text/plain");});
});
srv.listen(PORT,()=>console.log("Lokal: http://localhost:"+PORT));
