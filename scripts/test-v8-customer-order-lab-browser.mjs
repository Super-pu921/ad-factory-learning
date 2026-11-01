import assert from "node:assert/strict";
import {chromium,webkit} from "playwright";
const url=process.env.P24_TEST_URL||"http://127.0.0.1:8765/index.html#/components/customer-order-lab";
const isQA=url.includes("/v8-p24-qa/");
const oldKeys=["adFactoryLearning.v8.production","adFactoryLearning.v8.practice.missions","adFactoryLearning.v8.order-lab","adFactoryLearning.v8.bulk-lab","adFactoryLearning.v8.transaction-lab.progress"];
let checks=0;
const verify=(condition,message)=>{assert.ok(condition,message);checks++;};
async function run(engine,label){
 const browser=await engine.launch({headless:true,args:engine===chromium?["--no-sandbox"]:[]});
 try{
  const context=await browser.newContext({viewport:{width:390,height:844},locale:"zh-CN"});
  const page=await context.newPage(),errors=[];
  page.on("pageerror",e=>errors.push(String(e)));
  await page.goto(url,{waitUntil:"domcontentloaded"});
  await page.locator("#cqolabRoot .cqolab-stats").waitFor({timeout:20000});
  if(isQA){
   verify((await page.title()).includes("P2.4")&&await page.getByText("P2.4 独立 QA 预览",{exact:false}).count()>0,label+": visible independent QA banner");
   const keys=await page.evaluate(()=>({
    customer:window.V8CustomerOrderLab.storage,
    missions:window.V8Missions.storageKey,
    order:window.V8OrderLab.storageKey,
    bulk:window.V8BulkLab.storageKey,
    transaction:window.V8TransactionLab.storage
   }));
   verify(keys.customer.database==="adFactoryLearning.v8.customer-order-lab.qa"&&keys.customer.progress==="adFactoryLearning.v8.customer-order-lab.qa.progress",label+": P2.4 QA IndexedDB and progress names");
   verify(keys.missions==="adFactoryLearning.v8.practice.missions.p24.qa",label+": original missions isolated");
   verify(keys.order==="adFactoryLearning.v8.order-lab.p24.qa",label+": order lab isolated");
   verify(keys.bulk==="adFactoryLearning.v8.bulk-lab.p24.qa",label+": bulk lab isolated");
   verify(keys.transaction.database==="adFactoryLearning.v8.transaction-lab.p24.qa"&&keys.transaction.progress==="adFactoryLearning.v8.transaction-lab.progress.p24.qa",label+": transaction lab isolated");
   verify((await page.evaluate(async()=>navigator.serviceWorker?((await navigator.serviceWorker.getRegistrations()).length):0))===0,label+": QA registers no Service Worker");
  }
  const stage=async n=>{await page.waitForFunction(x=>document.querySelector("#cqolabRoot .micro")?.textContent.includes("第 "+x+" / 8 步"),n,{timeout:12000});};
  const snap=()=>page.evaluate(()=>window.V8CustomerOrderLab.snapshot());
  const status=async(c,q,o,message)=>{
   const x=await snap();verify(x.customers.length===c&&x.quotes.length===q&&x.orders.length===o,label+": "+message+" expected "+[c,q,o]+" got "+[x.customers.length,x.quotes.length,x.orders.length]);
   return x;
  };
  const next=async n=>{await page.locator('[data-cqolab="next"]').click();await stage(n);verify(true,label+": step "+n);};
  for(const key of oldKeys)await page.evaluate(k=>localStorage.setItem(k,"KEEP-"+k),key);
  await stage(1);await status(0,0,0,"seed");
  await page.locator('[data-cqolab="next"]').click();
  await page.getByText("未通过：").waitFor({state:"visible",timeout:10000}).catch(()=>{});
  await stage(1);await status(0,0,0,"invalid customer");
  await page.locator("#cqolabName").fill("教学客户甲");await next(2);
  await status(1,0,0,"customer committed");
  await next(3);await status(1,0,0,"missing customer rejected");
  await next(4);await status(1,0,0,"invalid quantity rejected");
  await page.locator("#cqolabProduct").fill("");
  await page.locator('[data-cqolab="next"]').click();
  await stage(4);await status(1,0,0,"missing product rejected");
  await page.locator("#cqolabProduct").fill("示例标识");
  await page.locator("#cqolabQuantity").fill("2");
  await next(5);let d=await status(1,1,0,"quote committed");
  verify(d.quotes[0].customerId==="C-001"&&d.quotes[0].status==="ready",label+": quote relationship");
  const duplicate=await page.evaluate(()=>window.V8CustomerOrderLab.createQuote("C-001","重复报价",2));
  verify(duplicate.kind==="aborted"&&duplicate.error==="ConstraintError",label+": duplicate quote constraint");
  await status(1,1,0,"duplicate quote unchanged");
  await next(6);await status(1,1,0,"true joined query");
  const joined=await page.evaluate(()=>window.V8CustomerOrderLab.queryCustomer("C-001"));
  verify(joined.customer.customerId==="C-001"&&joined.quotes.length===1&&joined.quotes[0].quoteId==="Q-001",label+": indexedDB customerId lookup");
  const rollback=await page.evaluate(()=>window.V8CustomerOrderLab.convertQuote(true));
  verify(rollback.kind==="aborted"&&rollback.error==="ConstraintError",label+": real IDB ConstraintError");
  d=await status(1,1,0,"transaction rollback");
  verify(d.quotes[0].status==="ready",label+": quote state rolled back");
  await next(7);d=await status(1,1,0,"graded rollback");
  verify(d.quotes[0].status==="ready",label+": graded rollback state");
  await page.reload({waitUntil:"domcontentloaded"});await stage(7);
  await status(1,1,0,"reload after rollback");
  await next(8);d=await status(1,1,1,"atomic convert");
  verify(d.quotes[0].status==="converted"&&d.orders[0].quoteId==="Q-001",label+": order foreign key and quote status");
  await page.locator('[data-cqolab="next"]').click();
  await page.getByText("八步实训已完成").waitFor({timeout:20000});
  await status(1,1,1,"duplicate and real reload");
  const p=await page.evaluate(()=>JSON.parse(localStorage.getItem(window.V8CustomerOrderLab.storage.progress)));
  verify(p.step===8&&p.pendingReload===false,label+": persisted progress after reload");
  await page.reload({waitUntil:"domcontentloaded"});
  await page.getByText("八步实训已完成").waitFor();
  await status(1,1,1,"second reload");
  for(const key of oldKeys)verify(await page.evaluate(k=>localStorage.getItem(k)==="KEEP-"+k,key),label+": protected legacy key "+key);
  for(const width of [375,390,1440]){
   await page.setViewportSize({width,height:844});
   verify(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1),label+": no page horizontal overflow "+width);
  }
  page.once("dialog",dlg=>dlg.dismiss());
  await page.locator('[data-cqolab="reset"]').click();
  await page.getByText("八步实训已完成").waitFor();
  await status(1,1,1,"reset cancelled");
  page.once("dialog",dlg=>dlg.accept());
  await page.locator('[data-cqolab="reset"]').click();
  await stage(1);await status(0,0,0,"only this lab reset");
  for(const key of oldKeys)verify(await page.evaluate(k=>localStorage.getItem(k)==="KEEP-"+k,key),label+": legacy key after reset "+key);
  verify(errors.length===0,label+": JS page errors "+errors.join("; "));
  await context.close();
 }finally{await browser.close();}
}
await run(chromium,"Chromium");
await run(webkit,"WebKit");
console.log("P2.4 "+(isQA?"QA preview":"development root")+" real IndexedDB browser checks OK: "+checks+" assertions.");
