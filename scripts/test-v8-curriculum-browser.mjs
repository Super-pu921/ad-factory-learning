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
    case 'link': {
      await fill('教学目标地址','javascript:alert(1)');await click('生成教学链接');await contains('HTTPS');assert.equal(await root.locator('.experiment-panel a').count(),0);
      await fill('教学目标地址','https://example.org');await click('生成教学链接');assert.equal(await root.getByRole('link',{name:'打开教学外链（新窗口）'}).getAttribute('rel'),'noopener noreferrer');
      await fill('教学目标地址','#K-D01-001/L2');await click('生成教学链接');assert.equal(await root.getByRole('link',{name:'前往指定教学单元'}).getAttribute('href'),'#K-D01-001/L2');break;
    }
    case 'flex': {
      const cards=root.locator('.experiment-card');assert.equal(await cards.count(),4);
      assert.ok(await cards.nth(2).evaluate((element)=>element.offsetTop)>await cards.first().evaluate(element=>element.offsetTop),'wrap must create multiple rows');
      await root.getByLabel('允许换行').uncheck();assert.equal(await cards.nth(2).evaluate(element=>element.offsetTop),await cards.first().evaluate(element=>element.offsetTop));
      await root.getByLabel('主轴方向').selectOption('column');assert.equal(await root.locator('.flex-experiment').evaluate(element=>getComputedStyle(element).flexDirection),'column');break;
    }
    case 'pagination': {
      assert.equal(await root.locator('ol li').count(),5);for(let index=0;index<4;index++)await click('下一页');await contains('第 5/5 页');assert.equal(await root.locator('ol li').count(),3);
      assert.equal(await root.getByRole('button',{name:'下一页',exact:true}).isDisabled(),true);await root.getByLabel('每页条数').selectOption('10');await contains('第 1/3 页');
      await root.getByLabel('空集合').check();await contains('第 0/0 页');assert.equal(await root.locator('ol li').count(),0);break;
    }
    case 'number': {
      await click('校验教学数字');await contains('已接受 -1.25');await fill('教学调整量','1.234');await click('校验教学数字');await contains('最多两位');assert.equal(await root.locator('.accepted-value').textContent(),'最后有效百分位：-125');
      await fill('教学调整量','0');await click('校验教学数字');await contains('已接受 0.00');await fill('教学调整量','');await click('校验教学数字');await contains('最多两位');break;
    }
    case 'statistic': {
      await contains('+20.00%');await fill('上期教学件数','0');await click('计算教学指标');await contains('无法计算');await fill('当期教学件数','-1');await click('计算教学指标');await contains('整数');break;
    }
    case 'progress': {
      await click('推进教学步骤');await click('推进教学步骤');await contains('2/5 · 40%');await root.getByLabel('总量未知').check();assert.equal(await root.locator('progress').getAttribute('value'),null);await contains('总量未知');
      await root.getByLabel('总量未知').uncheck();for(let index=0;index<3;index++)await click('推进教学步骤');await contains('教学计数完成');assert.equal(await root.getByRole('button',{name:'推进教学步骤',exact:true}).isDisabled(),true);await click('重置教学进度');await contains('0/5');break;
    }
    case 'popover': {
      const trigger=root.getByRole('button',{name:'展开工序说明',exact:true});await trigger.click();assert.equal(await trigger.getAttribute('aria-expanded'),'true');await page.keyboard.press('Escape');await contains('说明已关闭');
      assert.equal(await page.locator('#entryDialog').evaluate(element=>element.open),true);assert.equal(await trigger.evaluate(element=>element===document.activeElement),true);
      await trigger.click();await root.getByRole('heading',{level:4}).click();assert.equal(await trigger.getAttribute('aria-expanded'),'false');break;
    }
    case 'json': {
      await fill('教学 JSON','{"text":"<img src=x onerror=alert(1)>"}');await click('格式化教学 JSON');await contains('语法有效');assert.equal(await root.locator('img').count(),0);assert.ok((await root.locator('[data-json-preview]').textContent()).includes('<img'));
      const before=await root.locator('[data-json-preview]').textContent();await fill('教学 JSON','{"qty":1,}');await click('格式化教学 JSON');await contains('语法无效');assert.equal(await root.locator('[data-json-preview]').textContent(),before);break;
    }
    case 'line': {
      await fill('有序观测值','0');await click('绘制教学折线');assert.equal(await root.locator('circle').count(),1);assert.equal(await root.locator('circle').getAttribute('cx'),'50');
      await fill('有序观测值','0,0');await click('绘制教学折线');assert.equal(await root.locator('circle').count(),2);await fill('有序观测值','-1');await click('绘制教学折线');await contains('0–1000');assert.equal(await root.locator('circle').count(),2);break;
    }
    case 'layers': {
      await root.getByLabel('显示点位示意').uncheck();await contains('可见 2/3');assert.equal(await root.locator('[data-layer=point]').isVisible(),false);
      await click('图层上移');assert.equal(await root.locator('[data-layer]').last().getAttribute('data-layer'),'route');await click('图层上移');assert.equal(await root.locator('[data-layer]').last().getAttribute('data-layer'),'route');
      await root.getByLabel('显示点位示意').check();await contains('可见 3/3');break;
    }
    case 'snap': {
      await contains('吸附 20,40');await fill('原始横坐标','25');await fill('原始纵坐标','35');await click('吸附教学点');await contains('吸附 30,40');
      await fill('原始横坐标','101');await click('吸附教学点');await contains('坐标须为');assert.equal(await root.locator('.coordinate-marker').count(),2);break;
    }
    case 'kanban': {
      await root.getByLabel('目标看板列').selectOption('DONE');await click('移动教学卡片');await contains('相邻');assert.ok((await root.locator('.teaching-board section').first().textContent()).includes('卡片 A'));
      await root.getByLabel('目标看板列').selectOption('DOING');await click('移动教学卡片');await contains('A → DOING');assert.equal(await root.locator('.teaching-board section').nth(1).locator('p').count(),2);break;
    }
    case 'typing': {
      await fill('本地模拟输入','教学');await contains('正在输入');await contains('暂无输入信号');await fill('本地模拟输入','教学二');await contains('正在输入');await click('清空模拟输入');await contains('暂无输入信号');break;
    }
    case 'branch': {
      await click('追加教学续写');await contains('先建立分支');await click('从选中点建立分支');await contains('分支 2 条');await click('追加教学续写');await contains('分支 3 条');
      assert.equal(await root.locator('.experiment-panel section').first().locator('li').count(),4);await fill('分支续写文本','');await click('追加教学续写');await contains('1–80');await click('从选中点建立分支');await contains('分支 2 条');break;
    }
    case 'locale': {
      await root.getByLabel('显示地区').selectOption('de-DE');assert.equal(await root.locator('.experiment-panel').textContent(),'地区格式：1.234,50');await contains('123450');
      await fill('规范十进制数','1,25');await click('格式化教学数字');await contains('十进制');assert.equal(await root.locator('.experiment-panel').textContent(),'地区格式：1.234,50');break;
    }
    case 'debounce': {
      await fill('防抖教学搜索','排');await fill('防抖教学搜索','切割');await contains('已执行 1 次');assert.equal(await root.locator('.experiment-panel').textContent(),'切割教学');
      await fill('防抖教学搜索','装配');await click('取消待执行搜索');await contains('已取消 · 已执行 1 次');await page.waitForTimeout(400);await contains('已取消 · 已执行 1 次');
      await fill('防抖教学搜索','');await contains('已执行 2 次');assert.ok((await root.locator('.experiment-panel').textContent()).includes('检查教学'));break;
    }
    case 'badge': {
      await contains('实际 120 条');assert.equal(await root.locator('.teaching-badge').getAttribute('aria-label'),'120 条教学通知');
      await fill('教学通知数量','0');await click('更新教学徽标');assert.equal(await root.locator('.teaching-badge').textContent(),'0');await fill('教学通知数量','-1');await click('更新教学徽标');await contains('0–999');assert.equal(await root.locator('.teaching-badge').textContent(),'0');break;
    }
    case 'aspect': {
      await root.getByLabel('容器比例').selectOption('1,1');const size=await root.locator('.aspect-experiment').boundingBox();assert.ok(Math.abs(size.width-size.height)<1,'square ratio');await root.getByLabel('容器比例').selectOption('16,9');const wide=await root.locator('.aspect-experiment').boundingBox();assert.ok(Math.abs(wide.width/wide.height-16/9)<0.02);break;
    }
    case 'breadcrumb': {
      assert.equal(await root.locator('[aria-current=page]').textContent(),'任务详情');await click('教学中心');await contains('当前教学位置：教学中心');assert.equal(await root.locator('.breadcrumb-demo li').count(),1);await root.getByLabel('教学路径深度').selectOption('3');assert.equal(await root.locator('.breadcrumb-demo li').count(),3);break;
    }
    case 'checks': {
      await click('核对教学选择');await contains('至少选择');await root.getByLabel('选择切割',{exact:true}).check();await click('核对教学选择');await contains('仅核对：cut');await click('全选教学工序');assert.equal(await root.locator('input[type=checkbox]:checked').count(),3);await click('清空教学工序');assert.equal(await root.locator('input[type=checkbox]:checked').count(),0);break;
    }
    case 'timeline': {
      await click('添加教学事件');assert.equal(await root.locator('ol li').count(),3);assert.ok((await root.locator('ol li').nth(1).textContent()).includes('T-03'));
      await root.getByLabel('时间倒序').check();assert.ok((await root.locator('ol li').first().textContent()).includes('T-02'));await fill('新增事件分钟偏移','61');await click('添加教学事件');await contains('0–60');assert.equal(await root.locator('ol li').count(),3);break;
    }
    case 'retry': {
      await click('执行或重试教学任务');assert.equal(await root.getByRole('button',{name:'执行或重试教学任务',exact:true}).isDisabled(),true);await contains('error');await root.getByLabel('模拟教学失败').uncheck();await click('执行或重试教学任务');await contains('success');await contains('2/5');await click('重置重试实验');await contains('idle');break;
    }
    case 'tooltip': {
      const trigger=root.getByRole('button',{name:'聚焦查看术语说明',exact:true});await trigger.focus();await root.getByRole('tooltip').waitFor({state:'visible'});assert.equal(await trigger.getAttribute('aria-describedby'),await root.getByRole('tooltip').getAttribute('id'));
      await page.keyboard.press('Escape');await contains('提示已隐藏');assert.equal(await page.locator('#entryDialog').evaluate(element=>element.open),true);break;
    }
    case 'csv': {
      await click('预览教学 CSV');await contains('2 行教学预览');assert.ok((await root.locator('ol li').nth(1).textContent()).includes('B,教学'));
      await fill('教学 CSV 文本','id,qty\nA,2\nA,3');await click('预览教学 CSV');await contains('不得重复');assert.equal(await root.locator('ol li').count(),2);
      await fill('教学 CSV 文本','id,qty\n"<img src=x onerror=alert(1)>",2');await click('预览教学 CSV');await contains('1 行教学预览');assert.equal(await root.locator('img').count(),0);break;
    }
    case 'donut': {
      assert.ok((await root.locator('ol').textContent()).includes('40.00%'));await fill('占比教学数量','0,0');await click('绘制教学环形图');await contains('总量为零');assert.equal(await root.locator('circle').count(),1);await fill('占比教学数量','-1');await click('绘制教学环形图');await contains('0–1000');assert.equal(await root.locator('circle').count(),1);break;
    }
    case 'geojson': {
      await click('预览教学点集合');await contains('1 个教学 Point');await fill('教学 GeoJSON','{"type":"FeatureCollection","features":[]}');await click('预览教学点集合');await contains('0 个教学 Point');
      await fill('教学 GeoJSON','{"type":"FeatureCollection","features":[{"type":"Feature","geometry":{"type":"Point","coordinates":[181,0]},"properties":{}}]}');await click('预览教学点集合');await contains('经度范围');assert.equal(await root.locator('.coordinate-marker').count(),0);break;
    }
    case 'viewport': {
      await root.getByLabel('视口缩放倍数').selectOption('2');await fill('水平平移','10');await fill('垂直平移','-10');await click('更新教学视口');await contains('视口 60,50');assert.equal(await root.locator('.coordinate-marker').evaluate(element=>element.style.left),'60%');
      await fill('水平平移','31');await click('更新教学视口');await contains('平移 -30–30');assert.equal(await root.locator('.coordinate-marker').evaluate(element=>element.style.left),'60%');break;
    }
    case 'wizard': {
      await fill('向导教学编号','bad');await click('校验并到下一步');await contains('有效教学编号');await fill('向导教学编号','JOB-03');await click('校验并到下一步');await contains('第 2/3');
      assert.equal(await root.getByLabel('向导教学编号').isVisible(),false);await fill('向导教学数量','101');await click('校验并到下一步');await contains('1–100');await fill('向导教学数量','3');await click('校验并到下一步');await contains('第 3/3');assert.ok((await root.locator('.experiment-panel').textContent()).includes('JOB-03 · 数量 3'));
      await click('向导上一步');assert.equal(await root.getByLabel('向导教学数量').inputValue(),'3');break;
    }
    case 'resolution': {
      await root.getByLabel('仅显示未解决评论').check();await click('解决教学评论');await contains('RESOLVED');assert.ok((await root.locator('.experiment-panel').textContent()).includes('暂无未解决'));await click('重新打开教学评论');await contains('OPEN');assert.equal(await root.locator('.experiment-panel p').count(),2);break;
    }
    case 'structured': {
      await click('核对教学输出结构');await contains('三个字段结构通过');const before=await root.locator('pre').textContent();
      await fill('教学结构化输出','{"material":"板材","qty":"2","rush":false}');await click('核对教学输出结构');await contains('仅允许');assert.equal(await root.locator('pre').textContent(),before);break;
    }
    case 'motion': {
      await page.emulateMedia({reducedMotion:'reduce'});await contains('减少动态');assert.equal(await root.locator('.motion-dot').evaluate(element=>getComputedStyle(element).animationName),'none');
      await root.getByLabel('本实验动态偏好').selectOption('full');await contains('完整动态');assert.equal(await root.locator('.motion-dot').evaluate(element=>getComputedStyle(element).animationName),'teaching-dot');
      await root.getByLabel('本实验动态偏好').selectOption('reduce');await contains('减少动态');await page.emulateMedia({reducedMotion:'no-preference'});await contains('减少动态');break;
    }
    case 'cancellation': {
      await click('启动可取消教学任务');await contains('等待中');await click('取消教学任务');await contains('已取消');await click('启动可取消教学任务');await contains('教学任务完成');assert.equal(await root.getByRole('button',{name:'取消教学任务',exact:true}).isDisabled(),true);break;
    }
    default:throw new Error(`Unexercised demo: ${kind}`);
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
      let releaseCatalog;const heldCatalog=new Promise(resolve=>{releaseCatalog=resolve;});
      await page.route('**/catalog.json',async route=>{await heldCatalog;await route.continue();});
      const catalogRequested=page.waitForRequest('**/catalog.json');await page.goto(base,{waitUntil:'domcontentloaded'});await catalogRequested;
      await page.getByLabel('教学层级',{exact:true}).selectOption('L3');await page.getByLabel('教学难度',{exact:true}).selectOption('E3');releaseCatalog();
      await page.getByText('已有教学：49 个主题 · 147 个分层单元',{exact:true}).waitFor();assert.ok(await page.locator('.entry').count()>0,'queued filters apply after slow catalog load');assert.deepEqual(errors,[],'early filter changes must not throw');await page.unroute('**/catalog.json');
      await page.getByLabel('教学层级',{exact:true}).selectOption('all');await page.getByLabel('教学难度',{exact:true}).selectOption('all');
      await page.getByLabel('只看已有教学').check();assert.equal(await page.locator('.entry').count(),40);await page.getByRole('button',{name:'加载更多',exact:true}).click();assert.equal(await page.locator('.entry').count(),49);
      await page.getByLabel('教学层级',{exact:true}).selectOption('L1');await page.getByLabel('教学难度',{exact:true}).selectOption('E2');await page.locator('#catalogSearch').fill('K-D01-001');assert.equal(await page.locator('.entry').count(),0,'level and difficulty must match the same unit');
      await page.getByLabel('教学层级',{exact:true}).selectOption('L2');assert.equal(await page.locator('.entry').count(),1);await page.locator('.entry h3 button').click();await page.locator('.unit-tabs>button[aria-pressed=true]').filter({hasText:'L2'}).waitFor();assert.equal(new URL(page.url()).hash,'#K-D01-001/L2');await page.getByRole('button',{name:'关闭知识详情',exact:true}).click();
      await page.getByRole('button',{name:'清除',exact:true}).click();await page.getByLabel('教学难度',{exact:true}).selectOption('E5');assert.equal(await page.locator('.entry').count(),0);
      await page.getByLabel('教学层级',{exact:true}).selectOption('all');await page.getByLabel('教学难度',{exact:true}).selectOption('all');await page.getByRole('button',{name:'加载更多',exact:true}).click();assert.equal(await page.locator('.entry').count(),49);
      for(const lesson of curriculum) {
        await page.evaluate(id=>{location.hash=id;},lesson.knowledgeId);
        await page.waitForFunction(id=>document.getElementById('detailId').textContent===id,lesson.knowledgeId);
        for(let index=0;index<3;index++) {
          await page.locator('.unit-tabs>button').nth(index).click();
          assert.equal(new URL(page.url()).hash,`#${lesson.knowledgeId}/L${index+1}`);
          assert.equal(await page.getByRole('link',{name:`本单元直达链接 · L${index+1}`,exact:true}).getAttribute('href'),`#${lesson.knowledgeId}/L${index+1}`);
          assert.ok((await page.locator('#detailBody').textContent()).includes(lesson.units[index].objective));
          await exercise(page,lesson.kind,index);
        }
        if(evidence&&['donut','csv','geojson','motion'].includes(lesson.kind))await page.screenshot({path:`${evidence}/${name}-${width}-${lesson.kind}.png`});
        await page.getByRole('button',{name:'关闭知识详情',exact:true}).click();await page.locator('#entryDialog').waitFor({state:'hidden'});
      }
      for(const [id,layer] of [['K-D01-001','L2'],['K-D08-045','L3']]) {
        await page.goto(`${base}#${id}/${layer}`);await page.locator('.unit-tabs>button[aria-pressed=true]').filter({hasText:layer}).waitFor();
        await page.reload();await page.locator('.unit-tabs>button[aria-pressed=true]').filter({hasText:layer}).waitFor();
      }
      await page.goto(`${base}#K-D08-045/L9`);await page.locator('.unit-tabs>button[aria-pressed=true]').filter({hasText:'L1'}).waitFor();
      await page.getByRole('button',{name:'关闭知识详情',exact:true}).click();assert.equal(new URL(page.url()).hash,'');
      await page.goto(`${base}#K-D07-011/L2`);await page.getByRole('button',{name:'展开工序说明',exact:true}).click();
      await page.evaluate(()=>{location.hash='K-D04-003/L2';});await page.locator('[data-demo=number]').waitFor();
      await page.keyboard.press('Escape');await page.locator('#entryDialog').waitFor({state:'hidden'});
      assert.equal(new URL(page.url()).hash,'','disposed popover must not capture Escape in another lesson');
      await page.goto(`${base}#K-D07-013/L2`);await page.getByRole('button',{name:'聚焦查看术语说明',exact:true}).focus();await page.getByRole('tooltip').waitFor({state:'visible'});
      await page.evaluate(()=>{location.hash='K-D04-003/L2';});await page.locator('[data-demo=number]').waitFor();await page.keyboard.press('Escape');await page.locator('#entryDialog').waitFor({state:'hidden'});
      assert.equal(new URL(page.url()).hash,'','disposed tooltip must not capture Escape in another lesson');
      const state=await page.evaluate(()=>({...localStorage}));assert.deepEqual(state,{'adFactoryLearning.v8.production':'synthetic-main-sentinel','adFactoryLearning.v8.order-lab':'synthetic-lab-sentinel'});
      assert.deepEqual(errors,[]);assert.deepEqual(writes,[]);
      if(evidence)await page.screenshot({path:`${evidence}/${name}-${width}-teaching.png`});
      await context.close();console.log(`${name} ${width}: 48 topics × 3 layers, actual controls/negative cases, independent level/difficulty filters, deep links/reload, viewport and synthetic storage preservation PASS`);
    }
  } finally {await browser.close();}
}
