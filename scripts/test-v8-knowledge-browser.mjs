/** Existing Playwright installation only; isolated browser contexts and synthetic data. */
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {mkdirSync,readFileSync} from 'node:fs';
const require=createRequire(import.meta.url);
const {chromium,webkit}=require(process.env.V8_PLAYWRIGHT_MODULE||'playwright');
const base=process.env.V8_CATALOG_TEST_URL||'http://127.0.0.1:8766/knowledge-catalog/';
const evidence=process.env.V8_EVIDENCE_DIR;
if(evidence)mkdirSync(evidence,{recursive:true});

for(const [engine,name] of [[chromium,'chromium'],[webkit,'webkit']]) {
  const executablePath=process.env[name==='chromium'?'V8_CHROMIUM_EXECUTABLE':'V8_WEBKIT_EXECUTABLE'];
  const browser=await engine.launch({headless:true,...(executablePath?{executablePath}:{})});
  try {
    for(const [width,height] of [[1440,1000],[390,844]]) {
      const context=await browser.newContext({viewport:{width,height},serviceWorkers:'block'});
      await context.addInitScript(()=>{
        if(localStorage.getItem('adFactoryLearning.v8.production')===null)localStorage.setItem('adFactoryLearning.v8.production',JSON.stringify({done:[7],notes:{7:'synthetic sentinel'}}));
        if(localStorage.getItem('adFactoryLearning.v8.order-lab')===null)localStorage.setItem('adFactoryLearning.v8.order-lab','synthetic-lab-sentinel');
      });
      const page=await context.newPage();const errors=[];
      page.on('pageerror',error=>errors.push(error.message));
      await page.goto(new URL('../index.html#/components',base).href);
      assert.equal(await page.locator('#bottomNav a').count(),4,'the original four main navigation items stay intact');
      await page.getByRole('link',{name:'知识目录',exact:true}).click();
      await page.getByText('16 个领域 · 840 个原始入口 · 833 个初步概念',{exact:true}).waitFor();
      assert.equal(await page.locator('.entry').count(),40);
      await page.getByRole('button',{name:'加载更多',exact:true}).click();
      assert.equal(await page.locator('.entry').count(),80);
      await page.getByRole('button',{name:/D01 · 基础控件/}).click();
      assert.equal(await page.locator('.entry').count(),22);
      assert.equal(await page.locator('#domains button[aria-pressed=true]').count(),1);
      await page.locator('#catalogSearch').fill('no-such-knowledge-xyz');
      await page.getByText('没有匹配条目。可清除搜索或选择其他领域。',{exact:true}).waitFor();
      await page.getByRole('button',{name:'清除',exact:true}).click();
      assert.equal(await page.locator('.entry').count(),22);
      await page.getByRole('button',{name:/全部领域/}).click();
      await page.locator('#catalogSearch').fill('K-D05-019');
      await page.locator('.entry h3 button').click();
      await page.getByRole('button',{name:'查看主知识',exact:true}).click();
      await page.waitForFunction(()=>document.getElementById('detailId').textContent==='K-D09-029');
      await page.keyboard.press('Escape');
      await page.locator('dialog').waitFor({state:'hidden'});
      assert.equal(await page.locator('dialog[open]').count(),0);
      await page.getByRole('link',{name:'开始 Button 教学样板 →',exact:true}).click();
      await page.locator('#activateDemo').waitFor();
      await page.locator('#activateDemo').focus();await page.keyboard.press('Enter');await page.keyboard.press('Space');
      await page.getByText('已激活 2 次',{exact:true}).waitFor();
      await page.locator('#disableDemo').check();assert.equal(await page.locator('#activateDemo').isDisabled(),true);
      await page.getByRole('button',{name:'重置',exact:true}).click();
      await page.getByText('已激活 0 次',{exact:true}).waitFor();
      await page.getByRole('button',{name:/L2 · E2/}).click();
      await page.locator('#simulateFailure').check();await page.locator('#submitDemo').click();
      assert.equal(await page.locator('#submitDemo').isDisabled(),true);
      await page.getByText('第 1 次执行失败，可重试',{exact:true}).waitFor();
      await page.locator('#simulateFailure').uncheck();await page.locator('#submitDemo').click();
      await page.getByText('第 2 次执行成功',{exact:true}).waitFor();
      await page.getByRole('button',{name:/L3 · E2/}).click();
      await page.getByRole('button',{name:'生成教学报价',exact:true}).click();
      await page.getByText('教学金额 ¥241.00 · 2 项',{exact:true}).waitFor();
      await page.locator('#demoQuantity').fill('-1');await page.getByRole('button',{name:'生成教学报价',exact:true}).click();
      await page.getByText('数量须为 1–10000 的整数',{exact:true}).waitFor();
      await page.locator('#demoQuantity').fill('2');await page.locator('#demoPrice').fill('120.501');
      await page.getByRole('button',{name:'生成教学报价',exact:true}).click();
      await page.getByText('单价须为非负金额，最多六位整数及两位小数',{exact:true}).waitFor();
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1),true,'page must not overflow the viewport');
      assert.equal(await page.evaluate(()=>{const d=document.querySelector('dialog');return d.scrollWidth<=d.clientWidth+1;}),true,'dialog must not overflow horizontally');
      const state=await page.evaluate(()=>({main:JSON.parse(localStorage.getItem('adFactoryLearning.v8.production')),lab:localStorage.getItem('adFactoryLearning.v8.order-lab'),keys:Object.keys(localStorage).sort()}));
      assert.deepEqual(state,{main:{done:[7],notes:{7:'synthetic sentinel'}},lab:'synthetic-lab-sentinel',keys:['adFactoryLearning.v8.order-lab','adFactoryLearning.v8.production']});
      assert.deepEqual(errors,[]);
      if(evidence)await page.screenshot({path:`${evidence}/${name}-${width}-sample.png`,fullPage:true});
      await page.getByRole('button',{name:'关闭知识详情',exact:true}).click();
      await page.getByRole('button',{name:'清除',exact:true}).click();
      if(evidence)await page.screenshot({path:`${evidence}/${name}-${width}-directory.png`,fullPage:true});
      await context.close();
      console.log(`${name} ${width}: directory/search/alias/keyboard/L1-L3/error retry/viewport/synthetic storage isolation PASS`);
    }
    const errorsContext=await browser.newContext({serviceWorkers:'block'});
    const errorsPage=await errorsContext.newPage();
    await errorsContext.route('**/catalog.json',route=>route.fulfill({status:503,body:'synthetic outage'}));
    await errorsPage.goto(base);
    await errorsPage.getByText('读取失败：HTTP 503。请刷新页面重试。',{exact:true}).waitFor();
    await errorsContext.unroute('**/catalog.json');
    const malicious=JSON.parse(readFileSync(new URL('../knowledge-catalog/catalog.json',import.meta.url),'utf8'));
    malicious.entries[0].name='<img src=x onerror="window.__catalogXss=true">';
    await errorsContext.route('**/catalog.json',route=>route.fulfill({json:malicious}));
    await errorsPage.reload();
    await errorsPage.getByRole('button',{name:malicious.entries[0].name,exact:true}).waitFor();
    assert.equal(await errorsPage.locator('img[src=x]').count(),0);
    assert.equal(await errorsPage.evaluate(()=>window.__catalogXss),undefined);
    await errorsContext.close();
    console.log(`${name}: source failure and untrusted catalog text handling PASS`);
  } finally {await browser.close();}
}
