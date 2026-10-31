import assert from 'node:assert/strict';
import {webkit, devices} from 'playwright';

const url='http://127.0.0.1:8765/index.html#/components/order-lab';
const browser=await webkit.launch({headless:true});
let total=0;
const verify=(ok,label)=>{assert.ok(ok,label);total++};
const assertStep=async (page,n)=>{
  const t=await page.locator('#orderLabRoot .micro').first().innerText();
  verify(t.includes('第 '+n+'/6 步'),'expected step '+n+' got '+t);
};
const assertCount=async (page,n)=>{
  const t=await page.locator('.orderlab-count').innerText();
  verify(t.includes('匹配 '+n+' 条'),'expected '+n+' records got '+t);
};
const assertNoOverflow=async (page,width)=>{
  const metrics=await page.evaluate(()=>({
    scroll:document.documentElement.scrollWidth,
    client:document.documentElement.clientWidth,
    inner:window.innerWidth
  }));
  verify(metrics.scroll<=metrics.inner+1,'horizontal viewport overflow '+width+'px: '+JSON.stringify(metrics));
};
async function enterStepSix(page){
  await page.locator('#orderLabQuery').fill('S-1008');
  await page.getByRole('button',{name:'验证本步'}).click();
  await assertStep(page,2);
  await page.locator('#orderLabStatus').selectOption('生产中');
  await page.getByRole('button',{name:'验证本步'}).click();
  await assertStep(page,3);
  await page.locator('#orderLabQuery').fill('示例广告');
  await page.getByRole('button',{name:'验证本步'}).click();
  await assertStep(page,4);
  await page.getByRole('button',{name:'清除筛选'}).click();
  await assertStep(page,5);
  await page.locator('#orderLabStatus').selectOption('生产中');
  await page.getByRole('button',{name:'下一页'}).click();
  await assertStep(page,6);
}
try{
  const {defaultBrowserType,...iphone}=devices['iPhone 13'];
  const context=await browser.newContext({...iphone,locale:'zh-CN'});
  const page=await context.newPage();
  const pageErrors=[];
  page.on('pageerror',e=>pageErrors.push(String(e)));
  await page.goto(url,{waitUntil:'domcontentloaded'});
  await page.locator('#orderLabRoot').waitFor();
  verify(await page.evaluate(()=>Boolean(window.V8OrderLab)),'V8OrderLab initialized');
  await assertStep(page,1);
  await assertCount(page,12);
  await assertNoOverflow(page,390);
  const inputFont=await page.locator('#orderLabQuery').evaluate(e=>Number.parseFloat(getComputedStyle(e).fontSize));
  verify(inputFont>=16,'iPhone search font size >=16px');
  const selectFont=await page.locator('#orderLabStatus').evaluate(e=>Number.parseFloat(getComputedStyle(e).fontSize));
  verify(selectFont>=16,'iPhone select font size >=16px');
  await page.locator('#orderLabQuery').fill('not-found');
  await page.getByRole('button',{name:'验证本步'}).click();
  await assertStep(page,1);
  await assertCount(page,0);
  await page.locator('#orderLabQuery').fill('S-1008');
  await assertCount(page,1);
  verify(await page.locator('#orderLabQuery').evaluate(e=>document.activeElement===e),'input focus stable on WebKit');
  await page.getByRole('button',{name:'验证本步'}).click();
  await assertStep(page,2);
  await page.locator('#orderLabStatus').selectOption('生产中');
  await assertCount(page,6);
  await page.getByRole('button',{name:'验证本步'}).click();
  await assertStep(page,3);
  await page.locator('#orderLabQuery').fill('示例广告');
  await assertCount(page,3);
  await page.getByRole('button',{name:'验证本步'}).click();
  await assertStep(page,4);
  await page.getByRole('button',{name:'清除筛选'}).click();
  await assertStep(page,5);
  await assertCount(page,12);
  await page.locator('#orderLabStatus').selectOption('生产中');
  await page.getByRole('button',{name:'下一页'}).click();
  await assertStep(page,6);
  const filterState=await page.evaluate(()=>({
    status:document.querySelector('#orderLabStatus')?.value,
    pager:document.querySelector('.orderlab-count')?.textContent
  }));
  verify(filterState.status==='生产中'&&filterState.pager.includes('第 2/2 页'),'state persisted on filtered page 2');
  await page.locator('[data-orderlab="detail"][data-id="S-1008"]').click();
  const dialog=page.locator('dialog.orderlab-dialog');
  verify(await dialog.isVisible(),'native dialog opens in WebKit');
  verify((await dialog.innerText()).includes('S-1008'),'dialog selected record matches');
  await page.getByRole('button',{name:'关闭详情'}).click();
  await page.locator('#orderLabRoot h2').getByText('已完成全部六步').waitFor({state:'visible',timeout:5000});
  verify((await page.locator('#orderLabRoot').innerText()).includes('已完成全部六步'),'completed after dialog close');
  await page.reload({waitUntil:'domcontentloaded'});
  await page.locator('#orderLabRoot').waitFor();
  verify((await page.locator('#orderLabRoot').innerText()).includes('已完成全部六步'),'progress retained after reload');
  verify(await page.evaluate(()=>localStorage.getItem('adFactoryLearning.v8.order-lab')!==null),'independent order-lab progress exists');
  await page.setViewportSize({width:375,height:812});
  await assertNoOverflow(page,375);
  await page.getByRole('button',{name:'重新练习'}).click();
  await assertStep(page,1);
  await assertNoOverflow(page,375);
  // Re-run to step 6, test native Escape close.
  await enterStepSix(page);
  await page.locator('[data-orderlab="detail"][data-id="S-1008"]').click();
  await dialog.waitFor({state:'visible'});
  await page.keyboard.press('Escape');
  await page.locator('#orderLabRoot h2').getByText('已完成全部六步').waitFor({state:'visible',timeout:5000});
  verify(true,'Escape closes native WebKit dialog and preserves context');
  await assertNoOverflow(page,375);
  verify(pageErrors.length===0,'no WebKit JS errors: '+pageErrors.join('; '));
  await context.close();
  const desktop=await browser.newPage({viewport:{width:1440,height:900}});
  await desktop.goto(url,{waitUntil:'domcontentloaded'});
  await desktop.locator('#orderLabRoot').waitFor();
  await assertNoOverflow(desktop,1440);
  verify(await desktop.locator('h1').innerText()==='订单列表完整交互','desktop route renders');
  await desktop.close();
  console.log('WebKit simulated iPhone + desktop E2E passed: '+total+' checks. Not physical iPhone Safari hardware.');
}finally{
  await browser.close();
}
