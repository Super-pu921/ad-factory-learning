import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {pathToFileURL} from 'node:url';
import {basicDefinitions,runBasicExample} from '../knowledge-catalog/expanded-basic.mjs';
import {runBasicModel,demoRows} from '../knowledge-catalog/expanded-basic-models.mjs';
import {curriculum} from '../knowledge-catalog/curriculum.mjs';

export function testBasicModels() {
  assert.equal(basicDefinitions.length,175);assert.equal(new Set(basicDefinitions.map(def=>def.knowledgeId)).size,175);
  const catalog=JSON.parse(readFileSync(new URL('../knowledge-catalog/catalog.json',import.meta.url),'utf8'));
  const originalIds=new Set(['K-D01-001',...curriculum.map(item=>item.knowledgeId)]);
  for(const def of basicDefinitions) {
    const source=catalog.entries.find(item=>item.id===def.knowledgeId);
    assert.equal(source?.name,def.title);assert.equal(source.canonicalId,source.id);assert.ok(!originalIds.has(def.knowledgeId));
    assert.equal(JSON.stringify(runBasicExample(def.knowledgeId)),def.expected,def.knowledgeId);
    assert.notDeepEqual(runBasicExample(def.knowledgeId,def.good),runBasicExample(def.knowledgeId),`positive case changes ${def.knowledgeId}`);
    assert.throws(()=>runBasicExample(def.knowledgeId,def.bad),undefined,`negative case ${def.knowledgeId}`);
    const output=execFileSync(process.execPath,['--input-type=module','-e',def.code],{cwd:new URL('../knowledge-catalog/',import.meta.url),encoding:'utf8'}).trim();
    assert.equal(output,def.expected,'real code execution '+def.knowledgeId);
  }
  assert.deepEqual(runBasicModel('visual-avatars','1'),{visible:['An'],overflow:2});
  assert.deepEqual(runBasicModel('field-currency','0.10'),{cents:10});
  assert.deepEqual(runBasicModel('field-currency','999999.99'),{cents:99999999});
  for(const raw of ['1e2','-1','1.001','1000000','NaN'])assert.throws(()=>runBasicModel('field-currency',raw));
  for(const raw of ['javascript:alert(1)','http://example.test','https://a:b@example.test'])assert.throws(()=>runBasicModel('field-url',raw));
  assert.deepEqual(runBasicModel('field-date','2000-02-29'),{date:'2000-02-29'});
  for(const raw of ['1900-02-29','2026-02-30','2026-13-01'])assert.throws(()=>runBasicModel('field-date',raw));
  assert.deepEqual(runBasicModel('field-week','2020-W53'),{year:2020,week:53});
  assert.throws(()=>runBasicModel('field-week','2025-W53'));
  assert.deepEqual(runBasicModel('field-toggles',''),{selected:[]});
  assert.deepEqual(runBasicModel('grid-rowselect',''),{ids:[]});
  const before=JSON.stringify(demoRows);
  assert.deepEqual(runBasicModel('grid-pivot','group'),{groups:[{key:'cut',qty:5},{key:'print',qty:1}]});
  assert.deepEqual(runBasicModel('grid-sort','qty,group').rows.map(row=>row.id),['B','A','C']);
  assert.deepEqual(runBasicModel('grid-facet','cut:3').rows.map(row=>row.id),['C']);
  assert.equal(runBasicModel('grid-aggregate','qty').sum,6);
  assert.equal(runBasicModel('grid-aggregate','cents').sum,450);
  assert.deepEqual(runBasicModel('grid-scheduler','5,7'),{start:5,end:7});
  assert.throws(()=>runBasicModel('grid-scheduler','3,4'));
  assert.equal(runBasicModel('grid-formula','3*150').total,450);
  for(const raw of ['=SUM(A1)','2+2','1*alert(1)'])assert.throws(()=>runBasicModel('grid-formula',raw));
  for(const kind of ['grid-edit','grid-sort','grid-fill','grid-pinrow','grid-roworder']) {
    const def=basicDefinitions.find(item=>item.kind===kind);runBasicExample(def.knowledgeId,def.good);assert.equal(JSON.stringify(demoRows),before);
  }
  for(const file of ['expanded-basic.mjs','expanded-basic-models.mjs']) {
    const source=readFileSync(new URL('../knowledge-catalog/'+file,import.meta.url),'utf8');
    assert.doesNotMatch(source,/\b(localStorage|sessionStorage|indexedDB)\s*[.[]|\.innerHTML\s*=|\beval\s*\(|new\s+Function\b/);
  }
  console.log('Basic components PASS: 175 canonical IDs; 175 positive/negative fixtures; 175 real code subprocesses; exact cents, dates/weeks, URL protocol, ranges, pivots/sorts/immutable source and empty selections.');
}

/** Parameterized real DOM operations plus mechanism-specific assertions. No real browser profile. */
export async function exerciseBasicDemo(page,def,level='L2') {
  const root=page.locator(`[data-demo="${def.kind}"]`),preview=root.locator('[data-preview]'),input=root.locator('[data-input]');
  const result=async()=>JSON.parse(await root.locator('[data-result]').textContent());
  const apply=async raw=>{await input.fill(raw);await root.getByRole('button',{name:'应用演示值',exact:true}).click();};
  await root.waitFor();assert.deepEqual(await result(),runBasicExample(def.knowledgeId));
  await apply(def.good);assert.equal(await root.locator('[data-error]').textContent(),'');
  const model=runBasicExample(def.knowledgeId,def.good);assert.deepEqual(await result(),model);
  const [family,...tail]=def.kind.split('-'),variant=tail.join('-');
  if(family==='visual') {
    if(['group','toggle','toolbar'].includes(variant))assert.equal(await preview.locator('[aria-pressed=true]').count(),1);
    if(variant==='avatar')assert.equal(await preview.locator('.basic-avatar').textContent(),'LN');
    if(variant==='avatars')assert.equal(await preview.locator('.basic-avatar').count(),2);
    if(variant==='type')assert.equal(await preview.locator('p').evaluate(el=>getComputedStyle(el).fontSize),'24px');
    if(variant==='divider')assert.equal(await preview.getByRole('separator').getAttribute('aria-orientation'),'vertical');
    if(variant==='code'){assert.equal(await preview.locator('script').count(),0);assert.equal(await preview.locator('code').textContent(),def.good);}
    if(variant==='density')assert.equal(await preview.locator('li').first().evaluate(el=>getComputedStyle(el).paddingTop),'4px');
    if(level==='L2') {
      if(variant==='label'){await preview.getByText('点击字段标签',{exact:true}).click();assert.equal(await page.evaluate(()=>document.activeElement.id),def.knowledgeId+'-qty');}
      if(variant==='toggle'){await preview.getByRole('button').click();assert.equal((await result()).pressed,false);}
      if(variant==='group'){await preview.getByRole('button',{name:'A',exact:true}).click();assert.equal((await result()).selected,'A');}
      if(variant==='chip'){await preview.getByRole('button',{name:'移除 B',exact:true}).click();assert.deepEqual((await result()).tags,[]);}
      if(variant==='theme'){await preview.getByRole('button',{name:'切换预览主题',exact:true}).click();assert.equal((await result()).theme,'light');}
    }
  } else if(family==='layout') {
    const stage=preview.locator('[data-layout]');assert.equal(await stage.evaluate(el=>Math.round(el.getBoundingClientRect().width)),160);
    if(variant==='stack')assert.equal(await stage.evaluate(el=>getComputedStyle(el).flexDirection),'column');
    if(variant==='cluster')assert.equal(await stage.evaluate(el=>getComputedStyle(el).flexWrap),'wrap');
    if(variant==='masonry')assert.equal(await stage.evaluate(el=>getComputedStyle(el).columnCount),'2');
    if(variant==='query')assert.equal(await stage.locator('.basic-tile').first().evaluate(el=>getComputedStyle(el).fontWeight),'400');
    if(variant==='dashboard')assert.equal(await stage.locator('.basic-tile').count(),5);
    if(level==='L2') {
      if(variant==='splitter'){const separator=preview.getByRole('separator');await separator.focus();await page.keyboard.press('ArrowRight');assert.equal(await separator.getAttribute('aria-valuenow'),'60');}
      if(['scroll','sticky','affix'].includes(variant)){await preview.getByRole('button',{name:'滚动教学区域',exact:true}).click();assert.ok(await stage.evaluate(el=>el.scrollTop)>0);if(variant==='sticky')assert.ok(await stage.locator('header').evaluate(el=>{const parent=el.parentElement.getBoundingClientRect();const box=el.getBoundingClientRect();return box.top>=parent.top&&box.top<=parent.top+12;}));}
      if(variant==='portal'){const before=await stage.locator('[data-portal-node]').evaluate(el=>el.parentElement.className);await preview.getByRole('button',{name:'移动同一提示节点',exact:true}).click();assert.notEqual(await stage.locator('[data-portal-node]').evaluate(el=>el.parentElement.className),before);assert.equal(await stage.locator('[data-portal-node]').count(),1);}
      if(variant==='panel'){await preview.getByRole('button',{name:'折叠或展开',exact:true}).click();assert.equal(await stage.locator('[data-toggle]').isVisible(),false);}
      if(variant==='header'){await stage.locator('header').getByRole('button',{name:'切换辅助区域',exact:true}).click();assert.equal(await stage.locator('[data-toggle]').isVisible(),false);assert.ok((await stage.locator('header').textContent()).includes('工单标题'));}
      if(variant==='footer'){await stage.locator('footer').getByRole('button',{name:'完成底部教学检查',exact:true}).click();assert.equal(await stage.locator('footer output').textContent(),'教学检查完成');}
      if(variant==='safearea'){const before=await stage.evaluate(el=>parseFloat(getComputedStyle(el).paddingBottom));await preview.getByRole('button',{name:'切换24px模拟安全留白',exact:true}).click();assert.equal(await stage.evaluate(el=>parseFloat(getComputedStyle(el).paddingBottom))-before,24);}
    }
  } else if(family==='nav') {
    if(!['anchor','backtop','collapse'].includes(variant))await preview.locator('.basic-nav-content').filter({hasText:'工单'}).waitFor();
    if(level==='L2') {
      if(variant==='collapse'){await preview.locator('summary').click();assert.equal(await preview.locator('details').getAttribute('open'),null);}
      else if(variant==='backtop'){assert.ok(await preview.locator('[data-local-scroll]').evaluate(el=>el.scrollTop)>0);await preview.getByRole('button',{name:'返回教学区域顶部',exact:true}).click();assert.equal(await preview.locator('[data-local-scroll]').evaluate(el=>el.scrollTop),0);}
      else if(variant==='anchor'){await preview.getByRole('link',{name:'记录',exact:true}).click();assert.ok(await preview.locator('[data-local-scroll]').evaluate(el=>el.scrollTop)>100);}
      else if(['dropdown','speed','mega','command'].includes(variant)){await preview.getByRole('button',{name:variant==='speed'?'+ 快捷操作':'展开教学命令',exact:true}).click();if(variant==='command'){await preview.getByLabel('筛选教学命令').fill('记录');assert.equal(await preview.locator('[data-choice]:visible').count(),1);}await preview.locator('[data-choice="3"]').click();assert.equal((await result()).page,3);}
      else if(variant==='menubar'||variant==='menu'){const first=preview.locator('[data-choice="1"]');await first.focus();await page.keyboard.press('End');assert.equal(await page.evaluate(()=>document.activeElement.dataset.choice),'3');await page.keyboard.press('Enter');assert.equal((await result()).page,3);}
      else if(variant==='tree'){await preview.locator('summary').click();assert.equal(await preview.locator('[data-choice="3"]').isVisible(),false);}
      else if(variant==='tour'){assert.equal(await preview.locator('[data-tour-target]').count(),3);assert.equal(await preview.locator('[data-tour-target][data-active=true]').getAttribute('data-tour-target'),'2');await preview.getByRole('button',{name:'下一教学步骤',exact:true}).click();assert.equal(await preview.locator('[data-tour-target][data-active=true]').getAttribute('data-tour-target'),'3');}
    }
  } else if(family==='field') {
    if(['password','email','url','phone','search','date','time','month','week','datetime','color','slider','stepper','calendar'].includes(variant))assert.equal(await preview.getByLabel('交互字段',{exact:true}).inputValue(),def.good);
    if(variant==='radio')assert.equal(await preview.locator('input[type=radio]:checked').inputValue(),'B');
    if(variant==='multi')assert.deepEqual(await preview.locator('select').evaluate(el=>[...el.selectedOptions].map(option=>option.value)),['B','C']);
    if(variant==='checkbox')assert.equal(await preview.getByRole('checkbox').isChecked(),false);
    if(variant==='switch')assert.equal(await preview.getByRole('switch').getAttribute('aria-checked'),'true');
    if(variant==='fieldset')assert.equal(await preview.locator('legend').textContent(),'教学联系人与数量');
    if(variant==='builder')assert.equal(await preview.getByLabel('动态字段 note').count(),1);
    if(variant==='repeat')assert.deepEqual(await preview.locator('[data-stable-id]').evaluateAll(els=>els.map(el=>el.dataset.stableId)),['A','B','C']);
    if(variant==='condition')assert.equal(await preview.getByLabel('公司名称').inputValue(),'ACME');
    if(level==='L2') {
      if(variant==='password'){await preview.getByRole('button',{name:'切换密码显隐',exact:true}).click();assert.equal(await preview.getByLabel('交互字段',{exact:true}).getAttribute('type'),'text');}
      if(variant==='radio'){await preview.getByRole('radio').first().check();assert.equal((await result()).selected,'A');}
      if(variant==='switch'){await preview.getByRole('switch').click();assert.equal((await result()).checked,false);}
      if(variant==='stepper'){await preview.getByRole('button',{name:'增加2',exact:true}).click();assert.equal((await result()).value,6);}
      if(variant==='calendar'){await preview.getByRole('button',{name:'六月9日',exact:true}).click();assert.equal((await result()).date,'2026-06-09');}
      if(variant==='cascade'){await preview.getByLabel('教学父区域').selectOption('east');assert.deepEqual((await result()).path,['east','SH']);}
      if(variant==='combo'){await preview.getByRole('button',{name:'展开教学选项',exact:true}).click();assert.equal(await preview.getByRole('combobox').getAttribute('aria-expanded'),'true');await preview.getByRole('option',{name:'建议 C',exact:true}).click();assert.equal((await result()).selected,'C');}
      if(variant==='auto'){await preview.getByRole('combobox').fill('B');assert.equal(await preview.getByRole('option').count(),1);await preview.getByRole('option',{name:'建议 B',exact:true}).click();assert.equal((await result()).selected,'B');}
      if(variant==='async'){const select=preview.getByLabel('交互字段',{exact:true});assert.equal(await select.isDisabled(),true);await preview.getByRole('button',{name:'载入本地选项',exact:true}).click();await select.waitFor();await page.waitForFunction(id=>!document.querySelector(`[data-demo="${id}"] [data-preview] select`).disabled,def.kind);await select.selectOption('C');assert.equal((await result()).selected,'C');}
      if(variant==='signature'){const svg=preview.locator('svg'),box=await svg.boundingBox();await page.mouse.move(box.x+box.width*.1,box.y+box.height*.1);await page.mouse.down();await page.mouse.move(box.x+box.width*.7,box.y+box.height*.6,{steps:4});await page.mouse.up();assert.ok((await result()).points.length>=2);await preview.getByRole('button',{name:'清空教学轨迹',exact:true}).click();assert.equal(await preview.locator('polyline').getAttribute('points'),'');await apply(def.good);}
      if(['form','fieldset','summary'].includes(variant)){await preview.getByLabel('教学名称').fill('');await preview.getByLabel('教学数量').fill('0');await preview.getByRole('button',{name:'校验教学表单',exact:true}).click();assert.ok((await preview.getByRole('alert').textContent()).includes('名称必填'));assert.ok((await preview.getByRole('alert').textContent()).includes('数量须1–10'));}
    }
  } else if(family==='grid') {
    const table=preview.locator('table').first();
    if(variant==='pivot'){assert.ok((await table.textContent()).includes('A'));assert.equal(await table.locator('tr').count(),3);}
    if(variant==='virtual'||variant==='virtualgrid')assert.equal(await preview.locator('.basic-virtual-item').count(),variant==='virtual'?4:6);
    if(variant==='rowselect')assert.equal(await preview.locator('input[type=checkbox]:checked').count(),2);
    if(variant==='colorder')assert.deepEqual(await table.locator('thead th').allTextContents(),['qty','id','group']);
    if(variant==='pinrow')assert.equal(await table.locator('tbody tr').first().getAttribute('data-row-id'),'C');
    if(variant==='roworder')assert.deepEqual(await table.locator('tbody tr').evaluateAll(rows=>rows.map(row=>row.dataset.rowId)),['C','A','B']);
    if(variant==='resize')assert.equal(await table.locator('th').first().getAttribute('data-measured-width'),'160px');
    if(variant==='span')assert.equal(await table.locator('tbody tr:first-child td').first().getAttribute('rowspan'),'2');
    if(variant==='clipboard')assert.deepEqual(await table.locator('td').allTextContents(),['5','6','7','8']);
    if(variant==='formula')assert.equal(await preview.locator('output').textContent(),'3 × 150 分 = 450 分');
    if(variant==='code'){assert.equal(await preview.locator('img').count(),0);assert.equal(await preview.locator('pre').textContent(),'<img src=x>');}
    if(level==='L2') {
      if(variant==='export'){const [download]=await Promise.all([page.waitForEvent('download'),preview.getByRole('link',{name:'下载虚构教学数据',exact:true}).click()]);assert.equal(download.suggestedFilename(),'teaching.tsv');}
      if(variant==='keyboard'){const cell=table.locator('[tabindex="0"]');await cell.focus();await page.keyboard.press('ArrowLeft');assert.equal(await page.evaluate(()=>document.activeElement.dataset.column),'qty');}
      if(variant==='rowselect'){await apply('A');await preview.getByLabel('选择教学行 A').uncheck();assert.deepEqual((await result()).ids,[]);assert.equal(await preview.locator('[aria-selected=true]').count(),0);}
      if(variant==='chooser'){await apply('id');await preview.getByLabel('id',{exact:true}).click();assert.equal(await preview.getByLabel('id',{exact:true}).isChecked(),true);assert.equal(await root.locator('[data-error]').textContent(),'至少保留一个展示列');await apply(def.good);}
      if(variant==='infinite'){await preview.locator('.basic-infinite').evaluate(el=>{el.scrollTop=el.scrollHeight;});await root.locator('[data-result]').filter({hasText:'9'}).waitFor();assert.equal((await result()).count,9);await preview.getByRole('button',{name:'加载下一批教学条目',exact:true}).click();assert.equal((await result()).count,10);assert.equal(await preview.getByRole('button',{name:'加载下一批教学条目',exact:true}).isDisabled(),true);}
      if(variant==='tree'){await preview.getByRole('button',{name:'折叠教学子行',exact:true}).click();assert.equal(await preview.locator('tbody tr').count(),1);}
      if(variant==='group'){assert.equal(await preview.locator('details').count(),2);await preview.locator('summary').filter({hasText:'cut'}).click();assert.equal((await result()).rows.length,2);}
    }
  } else if(family==='feedback') {
    assert.equal(await preview.locator('[data-feedback-state]').getAttribute('data-feedback-state'),def.good);
    if(variant==='undo'||variant==='snackbar')assert.equal(await preview.locator('li').count(),3);
    if(variant==='center')assert.equal(await preview.locator('output').textContent(),'未读 0');
    if(variant==='circular')assert.ok(Number(await preview.locator('circle').getAttribute('stroke-dashoffset'))<60);
    if(variant==='overlay'||variant==='fullscreen')assert.equal(await preview.getByRole('button',{name:'底层教学操作',exact:true}).isDisabled(),false);
    if(level==='L2') {
      await apply(def.initial);
      if(variant==='inline'){await preview.getByRole('button',{name:'开始本地教学任务',exact:true}).click();assert.equal(await preview.locator('button').isDisabled(),true);await root.locator('[data-result]').filter({hasText:'complete'}).waitFor();}
      else if(variant==='boundary'){await preview.getByRole('button',{name:'旁边的正常教学操作',exact:true}).click();await preview.getByRole('button',{name:'旁边组件仍正常',exact:true}).waitFor();await preview.getByRole('button',{name:'运行安全教学任务',exact:true}).click();}
      else if(variant==='conflict'){await preview.getByRole('button',{name:'尝试写入旧版本',exact:true}).click();assert.ok((await preview.locator('[data-feedback-state]').textContent()).includes('未覆盖'));await preview.getByRole('button',{name:'重新载入教学版本',exact:true}).click();assert.equal((await result()).version,2);}
      else if(variant==='overlay'||variant==='fullscreen'){assert.equal(await preview.getByRole('button',{name:'底层教学操作',exact:true}).isDisabled(),true);await preview.getByRole('button',{name:'完成本地加载',exact:true}).click();assert.equal(await preview.getByRole('button',{name:'底层教学操作',exact:true}).isDisabled(),false);}
      else if(variant==='connection'){await preview.getByRole('button',{name:'建立本地教学连接',exact:true}).click();await root.locator('[data-result]').filter({hasText:'open'}).waitFor();assert.equal((await result()).state,'open');}
      else if(variant==='reconnecting'){await preview.getByRole('button',{name:'推进重连时钟',exact:true}).click();assert.equal(await preview.locator('[data-wait]').textContent(),'1');await preview.getByRole('button',{name:'推进重连时钟',exact:true}).click();assert.equal((await result()).state,'connected');}
      else if(['network','offline','sync'].includes(variant)){await preview.getByLabel('虚构教学草稿').fill('must preserve fictional draft');if(variant==='network'){await page.context().setOffline(true);await root.locator('[data-result]').filter({hasText:'offline'}).waitFor();await page.context().setOffline(false);await root.locator('[data-result]').filter({hasText:'online'}).waitFor();}else if(variant==='sync'){await preview.getByRole('button',{name:'开始本地同步',exact:true}).click();await root.locator('[data-result]').filter({hasText:'synced'}).waitFor();}else await preview.getByRole('button').last().click();assert.equal(await preview.getByLabel('虚构教学草稿').inputValue(),'must preserve fictional draft');}
      else {await preview.getByRole('button').first().click();assert.equal((await result()).state,def.good);}
    }
  }
  // Invalid input must leave the actual current preview intact, not merely preserve a counter.
  const before=await root.locator('[data-result]').textContent(),dom=await preview.evaluate(el=>el.innerHTML);
  await apply(def.bad);assert.ok((await root.locator('[data-error]').textContent()).length>0,def.knowledgeId+' negative UI');
  assert.equal(await input.getAttribute('aria-invalid'),'true');assert.equal(await root.locator('[data-result]').textContent(),before);
  assert.equal(await preview.evaluate(el=>el.innerHTML),dom);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true,'page overflow '+def.knowledgeId);
  assert.equal(await page.locator('#entryDialog').evaluate(el=>el.scrollWidth<=el.clientWidth+1),true,'detail overflow '+def.knowledgeId);
}

if(process.argv[1]&&pathToFileURL(process.argv[1]).href===import.meta.url)testBasicModels();
