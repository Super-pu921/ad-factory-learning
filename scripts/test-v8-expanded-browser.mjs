import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {mkdirSync,writeFileSync,readFileSync} from 'node:fs';
import {expandedDefinitions} from '../knowledge-catalog/expanded-curriculum.mjs';
import {exerciseBasicDemo} from './test-v8-expanded-basic.mjs';
import {exerciseAdvancedDemo} from './test-v8-expanded-advanced.mjs';
const {chromium,webkit}=createRequire(import.meta.url)(process.env.V8_PLAYWRIGHT_MODULE||'playwright');
const base=process.env.V8_CATALOG_TEST_URL||'http://127.0.0.1:8768/knowledge-catalog/';
const evidence=process.env.V8_EVIDENCE_DIR;
const stats=JSON.parse(readFileSync(new URL('../knowledge-catalog/teaching-manifest.json',import.meta.url),'utf8')).statistics;
if(evidence)mkdirSync(evidence,{recursive:true});
const levels=(process.env.V8_EXPANDED_LEVELS||'L1,L2,L3').split(',');
assert.ok(levels.length&&levels.every(level=>['L1','L2','L3'].includes(level)));
const selectedIds=process.env.V8_EXPANDED_IDS?.split(',');
if(selectedIds)assert.ok(selectedIds.every(id=>expandedDefinitions.some(def=>def.knowledgeId===id)));
const definitions=selectedIds?expandedDefinitions.filter(def=>selectedIds.includes(def.knowledgeId)):expandedDefinitions;
const records=[];
for(const [engine,name] of [[chromium,'chromium'],[webkit,'webkit']]) {
  if(process.env.V8_EXPANDED_ENGINE&&process.env.V8_EXPANDED_ENGINE!==name)continue;
  const browser=await engine.launch({headless:true});
  try {
    for(const width of [1440,390]) {
      if(process.env.V8_EXPANDED_WIDTH&&Number(process.env.V8_EXPANDED_WIDTH)!==width)continue;
      const context=await browser.newContext({viewport:{width,height:900},serviceWorkers:'block'});
      await context.addInitScript(()=>{localStorage.setItem('adFactoryLearning.v8.production','synthetic-original-sentinel');localStorage.setItem('adFactoryLearning.v8.order-lab','synthetic-lab-sentinel');});
      const page=await context.newPage(),errors=[],writes=[];page.setDefaultTimeout(12000);
      page.on('pageerror',error=>errors.push(error.message));page.on('request',request=>{if(request.method()!=='GET')writes.push(request.method()+' '+request.url());});
      await page.goto(base,{waitUntil:'domcontentloaded'});
      await page.getByText(`已有教学：${stats.teachingTopics} 个主题 · ${stats.layeredUnits} 个分层单元`,{exact:true}).waitFor();
      let completed=0;
      for(const def of definitions) {
        await page.evaluate(id=>{location.hash=id;},def.knowledgeId);
        await page.waitForFunction(id=>document.getElementById('detailId').textContent===id,def.knowledgeId);
        for(const level of levels) {
          try {
            await page.locator('.unit-tabs>button').nth(Number(level[1])-1).click();
            assert.equal(new URL(page.url()).hash,`#${def.knowledgeId}/${level}`);
            assert.equal(await page.getByRole('link',{name:`本单元直达链接 · ${level}`,exact:true}).getAttribute('href'),`#${def.knowledgeId}/${level}`);
            await (def.kind.startsWith('advanced-')?exerciseAdvancedDemo:exerciseBasicDemo)(page,def,level);
            assert.deepEqual(errors,[],def.knowledgeId+' page errors');
            records.push({id:def.knowledgeId,engine:name,width,level,status:'PASS'});
          } catch(reason) {
            console.error(`FAIL ${name} ${width} ${def.knowledgeId} ${def.kind} ${level}`);
            if(evidence){writeFileSync(`${evidence}/case-results.json`,JSON.stringify(records,null,2));await page.screenshot({path:`${evidence}/failure-${name}-${width}-${def.knowledgeId}-${level}.png`,fullPage:true,animations:'disabled'});}
            throw reason;
          }
        }
        if(evidence&&['K-D02-024','K-D04-043','K-D05-025','K-D06-022','K-D09-006','K-D16-055'].includes(def.knowledgeId))await page.screenshot({path:`${evidence}/${name}-${width}-${def.knowledgeId}.png`,animations:'disabled'});
        await page.getByRole('button',{name:'关闭知识详情',exact:true}).click();
        await page.locator('#entryDialog').waitFor({state:'hidden'});
        if(++completed%25===0)console.log(`${name} ${width}: ${completed}/${definitions.length} components exercised`);
      }
      assert.deepEqual(await page.evaluate(()=>({...localStorage})),{'adFactoryLearning.v8.production':'synthetic-original-sentinel','adFactoryLearning.v8.order-lab':'synthetic-lab-sentinel'});
      assert.deepEqual(errors,[]);assert.deepEqual(writes,[]);
      await context.close();console.log(`${name} ${width}: ${definitions.length} components × ${levels.length} layers; actual controls/negative cases/viewport/disposal/synthetic storage PASS`);
    }
  }finally{await browser.close();}
}
if(evidence)writeFileSync(`${evidence}/case-results.json`,JSON.stringify(records,null,2)+'\n');
console.log(`Expanded browser PASS: ${records.length} individually recorded unit scenarios.`);
