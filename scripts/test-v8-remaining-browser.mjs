import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {mkdirSync,readFileSync,writeFileSync} from 'node:fs';
import {remainingDefinitions,remainingSkipped} from '../knowledge-catalog/remaining-curriculum.mjs';
import {exerciseRemainingUiDemo} from './test-v8-remaining-ui.mjs';
import {exerciseRemainingSystemsDemo} from './test-v8-remaining-systems.mjs';
import {exerciseRemainingEngineeringDemo} from './test-v8-remaining-engineering.mjs';
const engines=createRequire(import.meta.url)(process.env.V8_PLAYWRIGHT_MODULE||'playwright'),base=process.env.V8_CATALOG_TEST_URL||'http://127.0.0.1:8768/knowledge-catalog/';
const stats=JSON.parse(readFileSync(new URL('../knowledge-catalog/teaching-manifest.json',import.meta.url),'utf8')).statistics;
const evidence=process.env.V8_EVIDENCE_DIR;if(evidence)mkdirSync(evidence,{recursive:true});const records=[],levels=(process.env.V8_REMAINING_LEVELS||'L1,L2,L3').split(',');assert.ok(levels.every(l=>['L1','L2','L3'].includes(l)));
const ids=process.env.V8_REMAINING_IDS?.split(','),defs=ids?remainingDefinitions.filter(d=>ids.includes(d.knowledgeId)):remainingDefinitions;
for(const name of ['chromium','webkit']){
 if(process.env.V8_REMAINING_ENGINE&&process.env.V8_REMAINING_ENGINE!==name)continue;const browser=await engines[name].launch({headless:true});
 try{for(const width of [1440,390]){
  if(process.env.V8_REMAINING_WIDTH&&Number(process.env.V8_REMAINING_WIDTH)!==width)continue;const context=await browser.newContext({viewport:{width,height:900},permissions:['geolocation'],geolocation:{latitude:1,longitude:2}});
  await context.addInitScript(()=>{if(window!==window.top)return;localStorage.setItem('adFactoryLearning.v8.production','synthetic-original-sentinel');localStorage.setItem('adFactoryLearning.v8.order-lab','synthetic-lab-sentinel');});
  const page=await context.newPage(),errors=[],writes=[];page.setDefaultTimeout(12000);page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(r.method()!=='GET')writes.push(r.method()+' '+r.url());});await page.goto(base,{waitUntil:'domcontentloaded'});await page.getByText(`已有教学：${stats.teachingTopics} 个主题 · ${stats.layeredUnits} 个分层单元`,{exact:true}).waitFor();
  let completed=0;for(const def of defs){await page.evaluate(id=>location.hash=id,def.knowledgeId);await page.waitForFunction(id=>document.getElementById('detailId').textContent===id,def.knowledgeId);
   for(const level of levels){try{await page.locator('.unit-tabs>button').nth(Number(level[1])-1).click();assert.equal(new URL(page.url()).hash,`#${def.knowledgeId}/${level}`);const exercise=def.kind.startsWith('remaining-ui-')?exerciseRemainingUiDemo:def.kind.startsWith('remaining-systems-')?exerciseRemainingSystemsDemo:exerciseRemainingEngineeringDemo;await exercise(page,def,level);assert.deepEqual(errors,[],def.knowledgeId+'page errors');assert.equal(await page.locator('#entryDialog').evaluate(e=>e.open),true,'内层弹窗操作不得关闭目录');records.push({id:def.knowledgeId,engine:name,width,level,status:'PASS'});}catch(reason){console.error('FAILED',name,width,def.knowledgeId,level);if(evidence){writeFileSync(`${evidence}/remaining-cases-${name}.json`,JSON.stringify(records,null,2));await page.screenshot({path:`${evidence}/failure-${name}-${width}-${def.knowledgeId}-${level}.png`,fullPage:true});}throw reason;}}
   if(evidence&&['K-D05-013','K-D08-030','K-D09-030','K-D11-051','K-D14-066','K-D15-059','K-D16-041'].includes(def.knowledgeId))await page.screenshot({path:`${evidence}/${name}-${width}-${def.knowledgeId}.png`,animations:'disabled'});
   await page.getByRole('button',{name:'关闭知识详情',exact:true}).click();await page.locator('#entryDialog').waitFor({state:'hidden'});if(++completed%25===0){console.log(`${name} ${width}: ${completed}/${defs.length} topics`);if(evidence)writeFileSync(`${evidence}/remaining-cases-${name}.json`,JSON.stringify(records,null,2));}
  }
  for(const skipped of remainingSkipped){await page.evaluate(id=>location.hash=id,skipped.knowledgeId);await page.waitForFunction(id=>document.getElementById('detailId').textContent===id,skipped.knowledgeId);assert.equal(await page.locator('.unit-tabs').count(),0);assert.match(await page.locator('#detailBody').textContent(),/SKIPPED_MISSING_INPUT/);await page.getByRole('button',{name:'关闭知识详情',exact:true}).click();}
  assert.deepEqual(errors,[]);assert.deepEqual(writes,[]);assert.deepEqual(await page.evaluate(()=>({...localStorage})),{'adFactoryLearning.v8.production':'synthetic-original-sentinel','adFactoryLearning.v8.order-lab':'synthetic-lab-sentinel'});
  await context.close();console.log(`${name} ${width}: ${defs.length} topics × ${levels.length} layers; original storage/outer dialog/12 skips PASS`);
 }}finally{await browser.close();}
}
if(evidence)writeFileSync(`${evidence}/remaining-cases-${process.env.V8_REMAINING_ENGINE||'all'}.json`,JSON.stringify(records,null,2)+'\n');console.log(JSON.stringify({status:'PASS',scenarios:records.length,topics:defs.length,skipped:remainingSkipped.length,protectedStorage:true,productionMigration:'BLOCKED'}));
