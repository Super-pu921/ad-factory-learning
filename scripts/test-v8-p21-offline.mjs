import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {readFileSync} from 'node:fs';

const swSource=readFileSync(new URL('../sw.js',import.meta.url),'utf8');
const cacheName=swSource.match(/const CACHE='([^']+)'/)?.[1];
assert.ok(cacheName?.startsWith('ad-factory-learning-v8-'),'Expected V8 offline cache name');

const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const context=await browser.newContext({serviceWorkers:'allow'});
const page=await context.newPage();
const url='http://127.0.0.1:8765/index.html#/components/order-lab';
try {
  await page.goto(url,{waitUntil:'domcontentloaded'});
  await page.locator('#orderLabRoot').waitFor({timeout:15000});
  await page.evaluate(async()=>{
    await navigator.serviceWorker.register('./sw.js');
    await navigator.serviceWorker.ready;
  });
  await page.waitForFunction(()=>navigator.serviceWorker.controller!==null,null,{timeout:15000});
  const cached=await page.evaluate(async(cacheName)=>{
    const cache=await caches.open(cacheName);
    const matches=await Promise.all(['./index.html','./app.js','./data.json','./missions.js','./order-lab.js'].map(p=>cache.match(p)));
    return matches.map(Boolean);
  },cacheName);
  assert.ok(cached.every(Boolean),'Offline cache missing required V8 assets: '+JSON.stringify(cached));
  await context.setOffline(true);
  await page.reload({waitUntil:'domcontentloaded'});
  await page.locator('#orderLabRoot').waitFor({timeout:15000});
  assert.match(await page.locator('h1').innerText(),/订单列表完整交互/);
  assert.ok(await page.evaluate(()=>Boolean(window.V8OrderLab)),'P2.1 module unavailable offline');
  assert.ok(await page.evaluate(()=>Boolean(window.V8Missions)),'Existing six missions unavailable offline');
  await context.setOffline(false);
  console.log('P2.1 offline PWA passed: SW update, five cached assets, offline reload and both practice modules.');
} finally {
  await context.setOffline(false);
  await browser.close();
}
