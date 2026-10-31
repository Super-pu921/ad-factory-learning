import assert from 'node:assert/strict';
import {chromium} from 'playwright';

const base='http://127.0.0.1:8765/index.html';
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
let checks=0;
async function check(cond,label){assert.ok(cond,label);checks++;}
try{
  const page=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:2});
  const errors=[];
  page.on('pageerror',e=>errors.push(String(e)));
  await page.goto(base+'#/components/order-lab',{waitUntil:'domcontentloaded'});
  await page.waitForSelector('#orderLabRoot');
  const step=async n=>check((await page.locator('#orderLabRoot .micro').first().innerText()).includes('第 '+n+'/6 步'),'step '+n);
  const count=async n=>check((await page.locator('.orderlab-count').innerText()).includes('匹配 '+n+' 条'),'result count '+n);
  await step(1);await count(12);
  await page.locator('#orderLabQuery').fill('wrong');
  await page.getByRole('button',{name:'验证本步'}).click();
  await step(1);await count(0);
  await page.locator('#orderLabQuery').fill('S-1008');
  await count(1);
  await check(await page.locator('#orderLabQuery').evaluate(el=>document.activeElement===el),'search focus preserved while typing');
  await page.getByRole('button',{name:'验证本步'}).click();
  await step(2);
  await page.locator('#orderLabStatus').selectOption('生产中');
  await count(6);
  await page.getByRole('button',{name:'验证本步'}).click();
  await step(3);
  await page.locator('#orderLabQuery').fill('示例广告');
  await count(3);
  await page.getByRole('button',{name:'验证本步'}).click();
  await step(4);
  await page.getByRole('button',{name:'清除筛选'}).click();
  await step(5);await count(12);
  await page.locator('#orderLabStatus').selectOption('生产中');
  await count(6);
  await page.getByRole('button',{name:'下一页'}).click();
  await step(6);
  await check((await page.locator('.orderlab-count').innerText()).includes('第 2/2 页'),'filter persisted at page 2');
  await check(await page.locator('#orderLabStatus').inputValue()==='生产中','status retained when paging');
  await page.locator('[data-orderlab="detail"][data-id="S-1008"]').click();
  const dialog=page.locator('dialog.orderlab-dialog');
  await check(await dialog.isVisible(),'drawer visible');
  await check((await dialog.innerText()).includes('S-1008'),'drawer shows selected order');
  await page.getByRole('button',{name:'关闭详情'}).click();
  await page.locator('#orderLabRoot h2').getByText('已完成全部六步').waitFor({state:'visible',timeout:5000}).catch(async e=>{
    const state=await page.evaluate(()=>({record:localStorage.getItem('adFactoryLearning.v8.order-lab'),dialogOpen:!!document.querySelector('dialog[open]'),body:document.getElementById('orderLabRoot')?.innerText.slice(0,600)}));
    throw new Error('detail close did not complete: '+JSON.stringify(state)+'; '+String(e));
  });
  await check((await page.locator('#orderLabRoot').innerText()).includes('已完成全部六步'),'all 6 steps completed');
  await page.reload({waitUntil:'domcontentloaded'});
  await page.waitForSelector('#orderLabRoot');
  await check((await page.locator('#orderLabRoot').innerText()).includes('已完成全部六步'),'progress persists after reload');
  await check(await page.evaluate(()=>window.V8OrderLab.storageKey==='adFactoryLearning.v8.order-lab'),'separate progress key');
  await check(await page.evaluate(()=>localStorage.getItem('adFactoryLearning.v8.order-lab')!==null),'progress was saved');
  await page.goto(base+'#/learn/lesson/51');
  await check(await page.locator('a[href="#/components/order-lab"]').count()>0,'lesson link to lab');
  await page.goto(base+'#/components/detail/table');
  await check(await page.locator('a[href="#/components/order-lab"]').count()>0,'component link to lab');
  await page.goto(base+'#/components');
  await check(await page.locator('a[href="#/components/order-lab"]').count()>0,'catalog link to lab');
  for(const width of [375,390,1440]){
    await page.setViewportSize({width,height:844});
    await page.goto(base+'#/components/order-lab');
    await check(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1),'no horizontal body overflow at '+width+'px');
    if(width<500){
      await page.getByRole('button',{name:'重新练习'}).click();
      const font=await page.locator('#orderLabQuery').evaluate(el=>Number.parseFloat(getComputedStyle(el).fontSize));
      await check(font>=16,'input font >=16px at '+width);
    }
  }
  await check(errors.length===0,'no page JS errors: '+errors.join('; '));
  await page.close();
  console.log('Chromium E2E PASSED ('+checks+' assertions): order lab 6 steps, failures, context, drawer, storage, links, mobile layout.');
}finally{await browser.close();}
