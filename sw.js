/* V8 offline: production root assets only, preview folders remain untouched. */
const CACHE='ad-factory-learning-v8-p2-1-20261031';
const ASSETS=['./','./index.html','./styles.css','./app.js','./demos.js','./missions.js','./p2.js','./data.json','./manifest.webmanifest','./icon-192.png','./icon-512.png','./apple-touch-icon.png'];
const ASSET_PATHS=new Set(ASSETS.map(p=>new URL(p,self.registration.scope).pathname));
self.addEventListener('install',e=>{
 e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{
 e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('ad-factory-learning-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
 const req=e.request;
 if(req.method!=='GET')return;
 const url=new URL(req.url);
 if(url.origin!==self.location.origin||!ASSET_PATHS.has(url.pathname))return;
 e.respondWith(fetch(req).then(res=>{
  if(res.ok){const clone=res.clone();caches.open(CACHE).then(c=>c.put(req,clone)).catch(()=>{});}
  return res;
 }).catch(async()=>{
  const cached=await caches.match(req);
  if(cached)return cached;
  if(req.mode==='navigate')return caches.match('./index.html');
  return Response.error();
 }));
});
