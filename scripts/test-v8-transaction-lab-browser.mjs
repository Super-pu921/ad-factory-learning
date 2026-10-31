import assert from 'node:assert/strict';
import {chromium,webkit,devices} from 'playwright';
const url='http://127.0.0.1:8765/index.html#/components/transaction-lab';
let count=0;const check=(yes,msg)=>{assert.ok(yes,msg);count++};
async function run(engine,label){
 const browser=await engine.launch({headless:true,args:engine===chromium?['--no-sandbox']:[]});
 try{
 const ctx=await browser.newContext(engine===webkit?{...devices['iPhone 13'],locale:'zh-CN'}:{viewport:{width:390,height:844},locale:'zh-CN'});
 const page=await ctx.newPage();const errors=[];page.on('pageerror',e=>errors.push(String(e)));
 await page.goto(url,{waitUntil:'domcontentloaded'});await page.locator('#txlabRoot .txlab-stats').waitFor({timeout:15000});
 const stage=async n=>{await page.waitForFunction(x=>document.querySelector('#txlabRoot .micro')?.textContent.includes('第 '+x+'/6 步'),n,{timeout:12000})};
 const status=async(q,c,labelText)=>{const x=await page.evaluate(()=>window.V8TransactionLab.snapshot());check(x.quantity===q&&x.logCount===c,label+' '+labelText+' expected '+q+'/'+c+' actual '+x.quantity+'/'+x.logCount);return x};
 const advance=async next=>{await page.locator('[data-tx-action="next"]').click();await stage(next);check((await page.locator('#txlabRoot').innerText()).includes('步骤已通过'),label+' advance '+next)};
 await stage(1);await status(12,0,'seed');await advance(2);await status(12,0,'reference');
 await advance(3);let s=await status(8,1,'commit');check(s.logs.some(x=>x.requestId==='OUT-001'&&x.materialId==='A-01'&&x.quantity===4),label+' material relation');
 await advance(4);await status(8,1,'insufficient');
 await advance(5);s=await status(8,1,'atomic rollback');check(s.logs.every(x=>x.requestId!=='OUT-FAIL-001'),label+' no failed log');
 await page.reload({waitUntil:'domcontentloaded'});await stage(5);await status(8,1,'rollback persisted');
 await advance(6);s=await status(6,2,'retry');check(s.logs.some(x=>x.requestId==='OUT-002'&&x.quantity===2),label+' retry ledger');
 await page.locator('[data-tx-action="next"]').click();await page.getByText('六步全部通过').waitFor({timeout:10000});await status(6,2,'duplicate');
 await page.reload({waitUntil:'domcontentloaded'});await page.getByText('六步全部通过').waitFor();await status(6,2,'reload');
 for(const key of ['adFactoryLearning.v8.production','adFactoryLearning.v8.practice.missions','adFactoryLearning.v8.order-lab','adFactoryLearning.v8.bulk-lab'])check(await page.evaluate(k=>localStorage.getItem(k)===null,key),label+' untouched '+key);
 for(const width of [375,390,1440]){await page.setViewportSize({width,height:844});check(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1),label+' overflow '+width);}
 await page.getByRole('button',{name:'清空本练习数据并重新开始'}).click();await stage(1);await status(12,0,'reset');
 check(errors.length===0,label+' page errors '+errors.join('; '));
 await ctx.close();
 } finally { await browser.close() }
}
await run(chromium,'Chromium');await run(webkit,'WebKit iPhone');
console.log('P2.3 REAL IndexedDB Chromium and WebKit passed '+count+' assertions');
