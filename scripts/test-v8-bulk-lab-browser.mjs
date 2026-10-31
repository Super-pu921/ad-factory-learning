import assert from 'node:assert/strict';
import {chromium,webkit,devices} from 'playwright';
const URL='http://127.0.0.1:8765/index.html#/components/bulk-lab';
let checks=0;
function ok(condition,description){assert.ok(condition,description);checks++;}
async function checkStage(page,n){const txt=await page.locator('#bulklabRoot .micro').first().innerText();ok(txt.includes('第 '+n+'/6 步'),description(n,txt));}
function description(n,txt){return 'Expected stage '+n+', got '+txt}
async function flow(type,label,viewport){
const browser=await type.launch({headless:true,args:type===chromium?['--no-sandbox']:[]});
try {
 const context=await browser.newContext(viewport?{viewport,locale:'zh-CN'}:{...devices['iPhone 13'],locale:'zh-CN'});
 const page=await context.newPage();
 const errors=[];page.on('pageerror',e=>errors.push(String(e)));
 await page.goto(URL,{waitUntil:'domcontentloaded'});
 await page.locator('#bulklabRoot').waitFor();
 await checkStage(page,1);
 ok(await page.getByRole('checkbox').count()===4,label+': page 1 has only 4 selectable rows');
 await page.getByRole('button',{name:'验证选择'}).click();await checkStage(page,1);
 await page.getByRole('checkbox',{name:'选择 B-2001'}).check();
 await page.getByRole('checkbox',{name:'选择 B-2002'}).check();
 ok((await page.locator('#bulklabSelected').innerText())==='2',label+': two selections');
 await page.getByRole('button',{name:'验证选择'}).click();await checkStage(page,2);
 await page.getByRole('button',{name:'全选本页'}).click();await checkStage(page,2);
 await page.getByRole('button',{name:'下一页'}).click();
 ok((await page.locator('.bulklab-pager').innerText()).includes('第 2/2 页'),label+': page 2');
 await page.getByRole('button',{name:'全选本页'}).click();await checkStage(page,3);
 ok((await page.locator('#bulklabSelected').innerText())==='6',label+': cross-page selection count');
 await page.getByRole('checkbox',{name:'选择 B-2005'}).uncheck();await checkStage(page,4);
 ok((await page.locator('#bulklabSelected').innerText())==='5',label+': deselected one');
 await page.getByRole('button',{name:'批量归档（模拟）'}).click();
 const dialog=page.locator('.bulklab-dialog');ok(await dialog.isVisible(),label+': confirm modal shown');
 await page.getByRole('button',{name:'取消',exact:true}).click();await page.waitForFunction(()=>document.querySelector('#bulklabRoot .micro')?.textContent?.includes('第 5/6 步'),null,{timeout:5000});await checkStage(page,5);
 ok((await page.locator('#bulklabArchived').innerText())==='0',label+': cancel did not mutate');
 await page.getByRole('button',{name:'批量归档（模拟）'}).click();
 await page.locator('#bulklabPhrase').fill('确认归档 6');
 await page.getByRole('button',{name:'确认模拟归档'}).click();
 ok((await page.locator('#bulklabArchived').innerText())==='0',label+': invalid phrase blocked');
 await page.locator('#bulklabPhrase').fill('确认归档 5');
 await page.getByRole('button',{name:'确认模拟归档'}).click();
 await checkStage(page,6);
 ok((await page.locator('#bulklabArchived').innerText())==='5',label+': five rows archived once');
 await page.getByRole('button',{name:'撤销本次归档'}).click();
 await page.getByText('六步训练已完成').waitFor();
 ok((await page.locator('#bulklabRoot').innerText()).includes('已撤销 5 条模拟归档'),label+': undo audit record');
 await page.reload({waitUntil:'domcontentloaded'});
 await page.getByText('六步训练已完成').waitFor();
 ok(await page.evaluate(()=>localStorage.getItem('adFactoryLearning.v8.bulk-lab')!==null),label+': progress persisted');
 for(const width of [375,390,1440]){
  await page.setViewportSize({width,height:844});
  await page.goto(URL,{waitUntil:'domcontentloaded'});
  ok(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1),label+': no body overflow at '+width);
  if(width===375){await page.getByRole('button',{name:'重新练习'}).click();
   const scroll=await page.locator('.bulklab-table-scroll').evaluate(e=>({scroll:e.scrollWidth,client:e.clientWidth}));
   ok(scroll.scroll>scroll.client,label+': table scroll is internal');
  }
 }
 ok(errors.length===0,label+': no page errors: '+errors.join('; '));
 await context.close();
}finally{await browser.close();}
}
await flow(chromium,'Chromium',{width:390,height:844});
await flow(webkit,'WebKit',null);
console.log('P2.2 browser pass, '+checks+' checks in Chromium + WebKit (iPhone simulation).');
