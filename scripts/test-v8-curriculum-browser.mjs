import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {mkdirSync} from 'node:fs';
import {curriculum} from '../knowledge-catalog/curriculum.mjs';
const {chromium,webkit}=createRequire(import.meta.url)(process.env.V8_PLAYWRIGHT_MODULE||'playwright');
const base=process.env.V8_CATALOG_TEST_URL||'http://127.0.0.1:8768/knowledge-catalog/';
const evidence=process.env.V8_EVIDENCE_DIR;
if(evidence)mkdirSync(evidence,{recursive:true});

async function exercise(page,kind,level) {
  const root=page.locator(`[data-demo="${kind}"]`),result=root.locator('[data-result]');
  const contains=async text=>{await result.filter({hasText:text}).waitFor({state:'visible'});assert.ok((await result.textContent()).includes(text));};
  const click=text=>root.getByRole('button',{name:text,exact:true}).click();
  const fill=(label,value)=>root.getByLabel(label,{exact:false}).fill(value);
  switch(kind) {
    case 'icon': {
      const control=root.getByRole('button',{name:'收藏教学条目',exact:true});await control.click();assert.equal(await control.getAttribute('aria-pressed'),'true');
      await root.getByLabel('禁用图标按钮').check();assert.equal(await control.isDisabled(),true);await root.getByLabel('禁用图标按钮').uncheck();await control.click();await contains('未收藏');break;
    }
    case 'grid': {
      await root.getByLabel('列数').selectOption('3');assert.equal(await root.locator('.experiment-card').count(),6);
      assert.equal(await root.locator('.experiment-grid').evaluate(element=>getComputedStyle(element).gridTemplateColumns.split(' ').length),3);
      await root.getByLabel('空数据').check();await contains('0 张');await root.getByLabel('空数据').uncheck();await contains('6 张');break;
    }
    case 'tabs': {
      await root.getByRole('tab',{name:'概览',exact:true}).focus();await page.keyboard.press('ArrowLeft');
      assert.equal(await root.getByRole('tab',{name:'记录',exact:true}).getAttribute('aria-selected'),'true');
      await page.keyboard.press('Home');await contains('概览');await page.keyboard.press('End');await contains('记录');
      assert.equal(await root.locator('[role=tab][tabindex="0"]').count(),1);break;
    }
    case 'input': {
      await fill('教学编号','A'.repeat(13));await click('校验编号');await contains('1–12');assert.equal(await root.getByLabel('教学编号').inputValue(),'A'.repeat(13));
      await fill('教学编号',' JOB-01 ');await click('校验编号');await contains('有效编号：JOB-01');await click('清空编号');assert.equal(await root.getByLabel('教学编号').inputValue(),'');break;
    }
    case 'table': {
      assert.equal(await root.locator('tbody tr').first().locator('td').first().textContent(),'J-02');
      await fill('按编号筛选','J-02');assert.equal(await root.locator('tbody tr').count(),1);
      await fill('按编号筛选','');await click('切换金额排序');assert.equal(await root.locator('tbody tr').first().locator('td').first().textContent(),'J-01');
      await fill('按编号筛选','missing');await contains('没有匹配');break;
    }
    case 'toast': {
      await click('显示教学提示');await contains('非真实保存');
      if(level===0)await result.filter({hasText:/教学操作/}).waitFor({state:'hidden',timeout:5000});
      else {await click('关闭提示');assert.equal(await result.textContent(),'');}
      break;
    }
    case 'modal': {
      await click('打开草稿弹窗');const dialog=root.locator('dialog');await dialog.getByLabel('草稿内容').fill('取消草稿');await page.keyboard.press('Escape');await dialog.waitFor({state:'hidden'});await contains('原始教学草稿');
      await click('打开草稿弹窗');await dialog.getByLabel('草稿内容').fill('确认草稿');await dialog.getByRole('button',{name:'确认教学草稿',exact:true}).click();await dialog.waitFor({state:'hidden'});await contains('确认草稿');
      assert.equal(await page.locator('#entryDialog').evaluate(element=>element.open),true,'closing child dialog must not close the knowledge detail');
      assert.equal(await page.evaluate(()=>document.activeElement.textContent),'打开草稿弹窗');break;
    }
    case 'file': {
      const input=root.locator('input[type=file]');await input.setInputFiles({name:'demo.csv',mimeType:'text/csv',buffer:Buffer.from('a,b')});await contains('仅元数据通过');
      await input.setInputFiles({name:'demo.json',mimeType:'application/json',buffer:Buffer.from('{}')});await contains('仅允许');
      await click('清空文件');assert.equal(await input.inputValue(),'');break;
    }
    case 'chart': {
      await fill('分类数量','0,0');await click('绘制教学柱图');await contains('总数量 0');assert.equal(await root.locator('.mini-bar').count(),2);
      await fill('分类数量','-1,20');await click('绘制教学柱图');await contains('0–1000');assert.equal(await root.locator('.mini-bar').count(),2);break;
    }
    case 'marker': {
      await fill('经度','181');await click('放置教学标记');await contains('经度范围');
      await fill('经度','180');await fill('纬度','90');await click('放置教学标记');await contains('经度 180');assert.equal(await root.locator('.coordinate-marker').evaluate(element=>element.style.left),'100%');break;
    }
    case 'flow': {
      await fill('教学数量','6');await fill('教学库存','5');await click('追踪教学流程');await contains('等待补料');
      await fill('教学数量','5');await click('追踪教学流程');await contains('生成教学单');await fill('教学数量','0');await click('追踪教学流程');await contains('数量须为');break;
    }
    case 'approval': {
      await click('提交审核');await contains('REVIEW');await click('通过审核');await contains('不满足规则');
      await root.getByLabel('演示角色').selectOption('reviewer');await click('驳回修改');await contains('不满足规则');
      await fill('驳回原因','教学返工');await click('驳回修改');await contains('DRAFT');
      await root.getByLabel('演示角色').selectOption('requester');await click('提交审核');await root.getByLabel('演示角色').selectOption('reviewer');await click('通过审核');await contains('APPROVED');assert.equal(await root.locator('ol li').count(),4);break;
    }
    case 'counter': {
      await click('A 增加一次');await click('A 增加一次');await click('B 增加一次');await contains('副本 A：2 · 副本 B：1');
      await click('同步两副本');await contains('副本 A：3 · 副本 B：3');await click('同步两副本');await contains('副本 A：3 · 副本 B：3');break;
    }
    case 'tool': {
      await click('执行教学工具');await contains('尚未允许');await root.getByLabel('允许本次教学计算').check();await click('执行教学工具');await contains('结果 6');
      await fill('工具参数 JSON','{"operation":"eval","values":[1]}');await click('执行教学工具');await contains('仅允许');
      await fill('工具参数 JSON','{"operation":"sum","values":[-1,2,3]}');await click('执行教学工具');await contains('结果 4');break;
    }
    case 'contrast': {
      await contains('普通文字 AA 未通过');await fill('文字颜色','#000000');await click('计算文字对比度');await contains('21.00:1');
      await fill('文字颜色','#767676');await click('计算文字对比度');await contains('普通文字 AA 通过');
      await fill('文字颜色','red');await click('计算文字对比度');await contains('六位');break;
    }
    case 'history': {
      await click('添加教学工序');await click('添加教学工序');await contains('3 个');await click('撤销工序');await contains('2 个');await click('重做工序');await contains('3 个');
      await click('撤销工序');await click('添加教学工序');assert.equal(await root.getByRole('button',{name:'重做工序',exact:true}).isDisabled(),true);break;
    }
  }
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true,'viewport overflow');
  assert.equal(await page.locator('#entryDialog').evaluate(element=>element.scrollWidth<=element.clientWidth+1),true,'detail overflow');
}

for(const [engine,name] of [[chromium,'chromium'],[webkit,'webkit']]) {
  const browser=await engine.launch({headless:true});
  try {
    for(const width of [1440,390]) {
      const context=await browser.newContext({viewport:{width,height:900},serviceWorkers:'block'});
      await context.addInitScript(()=>{localStorage.setItem('adFactoryLearning.v8.production','synthetic-main-sentinel');localStorage.setItem('adFactoryLearning.v8.order-lab','synthetic-lab-sentinel');});
      const page=await context.newPage(),errors=[],writes=[];page.setDefaultTimeout(12000);
      page.on('pageerror',error=>errors.push(error.message));page.on('request',request=>{if(request.method()!=='GET')writes.push(request.method()+' '+request.url());});
      await page.goto(base);await page.getByText('已有教学：17 个主题 · 51 个分层单元',{exact:true}).waitFor();
      await page.getByLabel('只看已有教学').check();assert.equal(await page.locator('.entry').count(),17);
      for(const lesson of curriculum) {
        await page.evaluate(id=>{location.hash=id;},lesson.knowledgeId);
        await page.waitForFunction(id=>document.getElementById('detailId').textContent===id,lesson.knowledgeId);
        for(let index=0;index<3;index++) {
          await page.locator('.unit-tabs>button').nth(index).click();
          assert.ok((await page.locator('#detailBody').textContent()).includes(lesson.units[index].objective));
          await exercise(page,lesson.kind,index);
        }
        if(evidence&&['grid','counter'].includes(lesson.kind))await page.screenshot({path:`${evidence}/${name}-${width}-${lesson.kind}.png`});
        await page.getByRole('button',{name:'关闭知识详情',exact:true}).click();await page.locator('#entryDialog').waitFor({state:'hidden'});
      }
      const state=await page.evaluate(()=>({...localStorage}));assert.deepEqual(state,{'adFactoryLearning.v8.production':'synthetic-main-sentinel','adFactoryLearning.v8.order-lab':'synthetic-lab-sentinel'});
      assert.deepEqual(errors,[]);assert.deepEqual(writes,[]);
      if(evidence)await page.screenshot({path:`${evidence}/${name}-${width}-teaching.png`});
      await context.close();console.log(`${name} ${width}: 16 topics × 3 layers, actual controls/negative cases, teaching filter, viewport and synthetic storage preservation PASS`);
    }
  } finally {await browser.close();}
}
