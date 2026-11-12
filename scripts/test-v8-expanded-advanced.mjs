import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import http from 'node:http';
import { advancedDefinitions, runAdvancedExample } from '../knowledge-catalog/expanded-advanced.mjs';

/** Real browser interaction. The caller owns the isolated page/server and selects a unit first. */
export async function exerciseAdvancedDemo(page, definition, level = 'L2') {
  const root = page.locator(`[data-demo="${definition.kind}"]`).first();
  await root.waitFor({state:'visible'});
  await root.locator('[data-reset]').click();
  assert.deepEqual(JSON.parse(await root.locator('[data-result]').textContent()), runAdvancedExample(definition));
  assert.equal(await root.locator('svg').count(), 1);
  const before = await root.locator('svg').evaluate(el=>el.outerHTML);
  for (const [key, value] of Object.entries(definition.changed)) {
    const control = root.locator(`[data-field="${key}"]`);
    if (typeof value === 'boolean') await control.setChecked(value);
    else await control.fill(typeof value === 'object' ? JSON.stringify(value) : String(value));
  }
  await root.locator('[data-run]').click();
  assert.equal(await root.getAttribute('data-valid'), 'true');
  const changed = JSON.parse(await root.locator('[data-result]').textContent());
  assert.deepEqual(changed, runAdvancedExample(definition, definition.changed));
  assert.notDeepEqual(changed, runAdvancedExample(definition), `${definition.knowledgeId}:操作须改变实际结果`);
  const after = await root.locator('svg').evaluate(el=>el.outerHTML);
  assert.notEqual(before, after, `${definition.knowledgeId}:SVG须响应模型变化`);
  if (level !== 'L1') {
    await root.locator('[data-invalid]').click();
    assert.equal(await root.getAttribute('data-valid'), 'false');
    assert.match(await root.locator('[data-error]').textContent(), /输入错误/);
    assert.equal(await root.locator('svg').count(), 0, '负例不保留过期图形');
    await root.locator('[data-reset]').click();
    assert.deepEqual(JSON.parse(await root.locator('[data-result]').textContent()), runAdvancedExample(definition));
  }
  if (level === 'L3') {
    await root.locator('details').evaluate(el=>{el.open=true;});
    await root.locator('[data-input]').fill(JSON.stringify(definition.changed));
    await root.locator('[data-run-json]').click();
    assert.deepEqual(JSON.parse(await root.locator('[data-result]').textContent()), changed);
  }
  return { knowledgeId: definition.knowledgeId, level, passed: true };
}

const checks = {
  'stacked-bar': o=>assert.deepEqual(o.totals,[30,60,65]),
  'horizontal-bar': o=>assert.deepEqual(o.bars.map(r=>r.id),[2,3,1]),
  'grouped-bar': o=>assert.equal(o.maximum,40),
  'area': o=>assert.equal(o.trapezoidArea,75),
  'stacked-area': o=>assert.deepEqual(o.upper,[[0,30],[1,30],[2,40],[3,40]]),
  'pie': o=>assert.deepEqual(o.sectors.map(s=>s.end),[72,180,360]),
  'bubble': o=>assert.deepEqual(o.bubbles.map(r=>r.radius),[8,16,12]),
  'radar': o=>assert.deepEqual(o.vertices[0],[0,-.6]),
  'heatmap': o=>assert.equal(o.intensities[1][1],1),
  'histogram': o=>assert.deepEqual(o.bins.map(b=>b.count),[2,3,1]),
  'boxplot': o=>assert.deepEqual(o.outliers,[30]),
  'treemap': o=>assert.equal(o.rectangles[0].width,.5),
  'funnel': o=>assert.deepEqual(o.stages.map(s=>s.retained),[1,.7,.35,.2]),
  'gauge': o=>assert.equal(o.angle,18),
  'waterfall': o=>assert.equal(o.final,150),
  'candlestick': o=>assert.deepEqual(o.candles.map(c=>c.direction),['上涨','下跌']),
  'calendar': o=>assert.equal(o.cells[7].value,8),
  'bullet': o=>assert.equal(o.gap,-15),
  'sparkline': o=>assert.equal(o.change,8),
  'error-bar': o=>assert.deepEqual(o.intervals[1],{value:60,low:48,high:72}),
  'polar': o=>assert.equal(o.points[1].y,40),
  'range': o=>assert.equal(o.intervals[1].midpoint,55),
  'legend': o=>assert.equal(o.sourceCount,6),
  'axis': o=>assert.deepEqual(o.ticks,[0,20,40,60,80,100]),
  'data-zoom': o=>assert.equal(o.visible.length,6),
  'map-view': o=>assert.deepEqual(o.points[1],[180,100]),
  'clustering': o=>assert.deepEqual(o.clusters.map(c=>c.count),[2,2]),
  'map-expression': o=>assert.deepEqual(o.features.map(f=>f.color),['#2563eb','#be123c','#2563eb']),
  'route': o=>assert.deepEqual(o.lengths,[30,40]),
  'route-edit': o=>assert.equal(o.length,88.31),
  'geofence': o=>assert.deepEqual(o.events.map(e=>e.event),['保持','进入','保持','离开']),
  'choropleth': o=>assert.deepEqual(o.regions.map(r=>r.band),[0,1,2]),
  'measurement': o=>assert.deepEqual([o.area,o.perimeter],[1200,140]),
  'spatial-query': o=>assert.deepEqual(o.matches,[1,2]),
  'camera': o=>assert.deepEqual([o.center,o.scale],[[50,30],4]),
  'selection': o=>assert.deepEqual(o.selected,['A']),
  'alignment': o=>assert.deepEqual(o.point,[50,40]),
  'ruler': o=>assert.deepEqual(o.ticks[1],{world:20,pixel:20}),
  'clipboard': o=>assert.deepEqual(o.copies[0],{id:'A-copy',x:25,y:30}),
  'canvas-history': o=>assert.deepEqual([o.value,o.undoCount,o.redoCount],[50,2,0]),
  'shape-editor': o=>assert.deepEqual([o.area,o.center],[1800,[50,35]]),
  'connector': o=>assert.deepEqual(o.points,[[50,40],[100,70]]),
  'resizer': o=>assert.deepEqual(o.size,[80,50]),
  'grouping': o=>assert.deepEqual(o.world[0],{id:'A',x:30,y:30}),
  'node-validation': o=>assert.deepEqual(o.nodes.map(n=>n.valid),[true,true]),
  'edge-validation': o=>assert.equal(o.cyclic,false),
  'auto-layout': o=>assert.deepEqual(o.positions.find(p=>p.id==='D'),{id:'D',x:140,y:0}),
  'routing': o=>assert.equal(o.length,170),
  'serialization': o=>assert.equal(o.same,true),
  'dependency': o=>assert.deepEqual(o.order,['备料','制作','安装']),
  'throttle': o=>assert.deepEqual(o.accepted,[0,110,220]),
  'cache': o=>assert.deepEqual(o.readable,['A','B']),
  'invalidation': o=>assert.deepEqual(o.invalidated,['list','detail']),
  'cache-key': o=>assert.equal(o.key,'orders?page=1&status=%E5%BE%85%E5%AE%A1'),
  'normalization': o=>assert.equal(o.entities.B.name,'乙'),
  'eviction': o=>assert.deepEqual(o.oldestToNewest,['A','C']),
  'backoff': o=>assert.deepEqual(o.delays,[100,200,400,800,1000]),
  'idempotency': o=>assert.deepEqual([o.executions,o.total],[2,50]),
  'transaction': o=>assert.deepEqual([o.committed,o.balance],[true,80]),
  'partial-failure': o=>assert.deepEqual(o.results.map(r=>r.status),['成功','失败','成功']),
  'optimistic-lock': o=>assert.deepEqual([o.value,o.version],['甲稿',2]),
  'last-write': o=>assert.equal(o.winner.actor,'B'),
  'merge': o=>assert.deepEqual(o.merged,{title:'新',qty:2}),
  'event-sourcing': o=>assert.equal(o.balance,70),
  'reconciliation': o=>assert.deepEqual(o.differences,[{id:'B',left:50,right:40,delta:10}]),
  'state-machine': o=>assert.equal(o.state,'done'),
  'transition-validation': o=>assert.equal(o.state,'approved'),
  'dirty-form': o=>assert.equal(o.dirty,false),
  'command': o=>assert.deepEqual([o.position,o.undoable],[30,1]),
  'batch': o=>assert.deepEqual(o.batches,[[1,2,3],[4,5,6],[7]]),
  'bulk-recovery': o=>assert.deepEqual(o.retried,['B']),
  'masking': o=>assert.equal(o.masked,'*******8000'),
  'virtualization': o=>assert.deepEqual([o.start,o.end,o.totalHeight],[0,6,20000]),
  'memoization': o=>assert.deepEqual([o.computations,o.hits],[3,2]),
  'injection': o=>assert.equal(o.total,2400),
  'repository': o=>assert.equal(o.record.name,'甲'),
  'service': o=>assert.deepEqual([o.accepted,o.stock],[true,7]),
  'event-bus': o=>assert.deepEqual(o.deliveries.map(d=>d.subscriber),['看板','日志']),
  'configuration': o=>assert.deepEqual(o.effective,{pageSize:10,compact:false}),
  'logging': o=>assert.deepEqual(o.visible.map(e=>e.level),['warn','error']),
};

export async function testAdvancedModels() {
  const catalog = JSON.parse(await readFile(new URL('../knowledge-catalog/catalog.json',import.meta.url),'utf8'));
  const previous = await readFile(new URL('../knowledge-catalog/curriculum.mjs',import.meta.url),'utf8');
  assert.equal(advancedDefinitions.length,80);
  assert.equal(new Set(advancedDefinitions.map(d=>d.knowledgeId)).size,80);
  assert.equal(new Set(advancedDefinitions.map(d=>d.kind)).size,80);
  let snippets=0;
  for(const d of advancedDefinitions){
    const entry=catalog.entries.find(e=>e.id===d.knowledgeId);
    assert.ok(entry,`${d.knowledgeId}:目录ID存在`);assert.equal(entry.canonicalId,d.knowledgeId);assert.equal(entry.name,d.title);
    assert.ok(!previous.includes(`lesson('${d.knowledgeId}'`));
    for(const field of ['principle','mechanism','limits','observe','interact','verify','apply','invariant','invalid'])assert.ok(d[field]?.length>5,`${d.knowledgeId}:${field}`);
    const input=JSON.stringify(d.input), result=runAdvancedExample(d), changed=runAdvancedExample(d,d.changed);
    assert.equal(JSON.stringify(d.input),input,'不修改调用者输入');
    assert.notDeepEqual(result,changed,`${d.knowledgeId}:对比场景有真实差异`);
    assert.deepEqual(result,runAdvancedExample(d),'可确定性重复执行');
    assert.throws(()=>runAdvancedExample(d,{}),/缺少必需/);
    assert.throws(()=>runAdvancedExample(d,d.invalidInput),`${d.knowledgeId}:主题专属负例`);
    assert.throws(()=>runAdvancedExample(d,null));
    assert.ok(checks[d.kind.slice(9)],'必须有独立已知值断言');checks[d.kind.slice(9)](result);
    const printed=execFileSync(process.execPath,['--input-type=module','-e',d.code],{cwd:fileURLToPath(new URL('../knowledge-catalog/',import.meta.url)),encoding:'utf8'}).trim();
    assert.equal(printed,d.expected,`${d.knowledgeId}:公开片段可运行`);snippets++;
  }
  // Cross-input laws exercise meaningful mechanism boundaries rather than merely snapshotting implementation.
  const byKind=key=>advancedDefinitions.find(d=>d.kind===`advanced-${key}`);
  const run=(key,patch)=>{const d=byKind(key);return runAdvancedExample(d,{...d.input,...patch});};
  assert.equal(run('pie',{values:[1,1]}).sectors[0].end,180);
  assert.throws(()=>run('pie',{values:[0,0]}));
  assert.throws(()=>run('funnel',{values:[10,20]}));
  assert.throws(()=>run('candlestick',{rows:[{open:20,close:30,high:25,low:10}]}));
  assert.throws(()=>run('range',{rows:[{low:30,high:20}]}));
  assert.throws(()=>run('data-zoom',{start:4,end:3}));
  assert.throws(()=>run('clustering',{cell:0}));
  assert.equal(run('measurement',{points:[[0,0],[0,10],[10,10],[10,0]]}).area,100);
  assert.deepEqual(run('spatial-query',{boundary:[30,30,30,30]}).matches,[1]);
  assert.throws(()=>run('camera',{padding:100}));
  assert.equal(run('canvas-history',{actions:[{type:'move',by:1},{type:'undo'},{type:'move',by:2},{type:'redo'}]}).value,22);
  assert.throws(()=>run('auto-layout',{edges:[['A','B'],['B','A']]}));
  assert.throws(()=>run('normalization',{rows:[{id:'A'},{id:'A'}]}));
  assert.equal(run('cache-key',{params:{status:'待审',page:1}}).key,run('cache-key',{}).key);
  assert.deepEqual(run('transaction',{changes:[-101,200]}),{committed:false,balance:100,attempted:[-1]});
  assert.equal(run('optimistic-lock',{writes:[{version:0,value:'过期'}]}).value,'原稿');
  assert.deepEqual(run('merge',{remote:{title:'另一稿',qty:2}}).conflicts,['title']);
  assert.equal(run('dirty-form',{current:{name:'甲',qty:1}}).dirty,false);
  assert.equal(run('service',{quantity:11}).stock,10);
  assert.throws(()=>run('configuration',{overrides:{unknown:true}}));
  assert.throws(()=>run('configuration',{overrides:{compact:'true'}}));
  assert.throws(()=>run('masking',{keep:12}));
  assert.throws(()=>run('virtualization',{scroll:-1}));
  assert.equal(run('virtualization',{count:0,scroll:0}).indexes.length,0);
  console.log(JSON.stringify({status:'PASS',topics:80,knownValueAssertions:Object.keys(checks).length,snippets,negativeCases:80,boundaryChecks:24}));
}
/** Optional isolated harness, using only an explicitly supplied existing Playwright installation. */
export async function testAdvancedBrowser({engine='chromium',levels=['L1','L2','L3']}={}) {
  const modulePath=process.env.V8_PLAYWRIGHT_MODULE;
  assert.ok(modulePath,'浏览器检查须通过V8_PLAYWRIGHT_MODULE指定现有Playwright，不安装依赖');
  const playwright=createRequire(import.meta.url)(modulePath);
  assert.ok(['chromium','webkit'].includes(engine));
  const html='<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>本地教学机制隔离检查</title><main id="demo"></main><script type="module">import{advancedDefinitions,renderAdvancedDemo}from"/expanded-advanced.mjs";window.show=id=>{window.dispose?.();window.dispose=renderAdvancedDemo(document.querySelector("main"),advancedDefinitions.find(d=>d.knowledgeId===id));};window.ready=true;</script>';
  const server=http.createServer(async(req,res)=>{
    if(req.url==='/expanded-advanced.mjs'){res.setHeader('Content-Type','text/javascript');res.end(await readFile(new URL('../knowledge-catalog/expanded-advanced.mjs',import.meta.url)));}
    else if(req.url==='/'){res.setHeader('Content-Type','text/html');res.end(html);}
    else {res.statusCode=404;res.end();}
  });
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  let browser;
  try{
    browser=await playwright[engine].launch({headless:true});
    const context=await browser.newContext(), page=await context.newPage(), errors=[];
    page.on('pageerror',error=>errors.push(error.message));
    await page.goto(`http://127.0.0.1:${server.address().port}/`);await page.waitForFunction(()=>window.ready);
    let units=0;
    for(const d of advancedDefinitions){
      for(const level of levels){await page.evaluate(id=>window.show(id),d.knowledgeId);await exerciseAdvancedDemo(page,d,level);units++;}
    }
    await page.setViewportSize({width:375,height:812});
    for(const d of advancedDefinitions){
      await page.evaluate(id=>window.show(id),d.knowledgeId);
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`${d.knowledgeId}:窄屏不得横向溢出`);
    }
    await page.evaluate(()=>window.dispose());
    assert.equal(await page.locator('main').evaluate(el=>el.childElementCount),0,'disposer清除当前演示');
    assert.equal(await page.locator('main').getAttribute('data-demo'),null,'disposer清除挂载标记');
    assert.deepEqual(errors,[]);
    console.log(JSON.stringify({status:'PASS',engine,topics:80,units,mobileTopics:80,pageErrors:0,disposer:true,isolated:true}));
    await context.close();
  }finally{await browser?.close();await new Promise(resolve=>server.close(resolve));}
}
if(process.argv[1]&&pathToFileURL(process.argv[1]).href===import.meta.url){
  await testAdvancedModels();
  const browserFlag=process.argv.find(arg=>arg.startsWith('--browser'));
  if(browserFlag)await testAdvancedBrowser({engine:browserFlag.split('=')[1]||'chromium'});
}
