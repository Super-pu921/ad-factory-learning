import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {mkdirSync,writeFileSync} from 'node:fs';
import {teachingFieldLabel,teachingFieldSummary,teachingValueLabel} from '../knowledge-catalog/teaching-labels.mjs';
import {teachingSentence} from '../knowledge-catalog/teaching-ui.mjs';
import {buttonPilot} from '../knowledge-catalog/button-pilot.mjs';
import {curriculum} from '../knowledge-catalog/curriculum.mjs';
import {expandedCurriculum} from '../knowledge-catalog/expanded-curriculum.mjs';
import {remainingCurriculum} from '../knowledge-catalog/remaining-curriculum.mjs';

// Unknown names and API identifiers must remain exact; localization is presentation only.
for(const key of ['unknownFutureKey','__proto__','constructor','toString','中文名称'])assert.equal(teachingFieldLabel(key),key);
assert.equal(teachingValueLabel('unknownFutureState'),'unknownFutureState');
assert.equal(teachingSentence('调用 Promise.all、JSON.parse 和 window.location。'),'调用 Promise.all、JSON.parse 和 window.location。');
assert.match(teachingSentence('tasks.0.owner'),/第1项/);
const data={tasks:[{owner:'An',status:'doing'}]},original=JSON.stringify(data);
assert.ok(teachingFieldSummary(data).length<=160);assert.equal(JSON.stringify(data),original);
console.log('Teaching UI: unknown labels/API names/input immutability PASS');

if(process.argv.includes('--browser')){
 const engines=createRequire(import.meta.url)(process.env.V8_PLAYWRIGHT_MODULE||'playwright');
 const base=process.env.V8_CATALOG_TEST_URL||'http://127.0.0.1:8768/knowledge-catalog/';
 const evidence=process.env.V8_EVIDENCE_DIR;if(evidence)mkdirSync(evidence,{recursive:true});
 const records=[],layout=[];
 assert.ok(!process.env.V8_TEACHING_UI_ENGINE||['chromium','webkit'].includes(process.env.V8_TEACHING_UI_ENGINE));
 for(const name of ['chromium','webkit']){
  if(process.env.V8_TEACHING_UI_ENGINE&&process.env.V8_TEACHING_UI_ENGINE!==name)continue;
  const browser=await engines[name].launch({headless:true});
  try{for(const width of [1440,390]){
   const context=await browser.newContext({viewport:{width,height:900}});
   await context.addInitScript(()=>{if(window===top){localStorage.setItem('adFactoryLearning.v8.production','synthetic-original');localStorage.setItem('adFactoryLearning.v8.order-lab','synthetic-lab');}});
   const page=await context.newPage(),errors=[],writes=[];page.setDefaultTimeout(12000);
   page.on('pageerror',error=>errors.push(error.message));page.on('request',request=>{if(request.method()!=='GET')writes.push(request.method()+' '+request.url());});
   // Compare tokens against an actual original component rendered by the main workbench.
   await page.goto(new URL('../index.html#/components/detail/form',base).href);
   await page.locator('.demo-stage input:not([type=checkbox])').first().waitFor();
   const oldField=await page.locator('.demo-stage input:not([type=checkbox])').first().evaluate(node=>{const s=getComputedStyle(node);return{font:s.fontFamily,size:s.fontSize,radius:s.borderRadius,border:s.borderColor};});
   const oldButton=await page.locator('.demo-stage button').first().evaluate(node=>{const s=getComputedStyle(node);return{size:s.fontSize,radius:s.borderRadius,background:s.backgroundColor};});
   for(const id of ['K-D01-001','K-D04-035','K-D08-040','K-D12-002','K-D16-001']){
    await page.goto(base+'#'+id+'/L2',{waitUntil:'domcontentloaded'});await page.waitForFunction(id=>document.getElementById('detailId')?.textContent===id&&document.getElementById('entryDialog')?.open,id);const demo=page.locator('.teaching-ui');await demo.waitFor();
    assert.equal(await page.locator('#entryDialog').evaluate(node=>node.matches(':modal')),false,'Teaching detail must keep workbench navigation available');
    assert.equal(await page.locator(width===390?'.catalog-bottom-nav':'.catalog-sidebar').isVisible(),true);
    assert.equal(await page.locator('.unit-tabs>button').count(),3);
    assert.equal(await page.locator('.lesson-notes[open]').count(),0,'Notes/code are opt-in');
    assert.equal(await demo.locator('details[open]').count(),0,'Raw settings/results are closed initially');
    assert.ok((await demo.boundingBox()).y<850,'Live demo starts in the initial viewport');
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true,id+' viewport overflow');
    if(id==='K-D12-002'){
     const primary=demo.locator('[data-teaching-primary=""]').first();
     assert.deepEqual(await primary.evaluate(node=>{const s=getComputedStyle(node);return{size:s.fontSize,radius:s.borderRadius,background:s.backgroundColor};}),oldButton);
     const settings=demo.locator('details[data-teaching-settings]');await settings.locator(':scope > summary').click();
     const editor=demo.locator('fieldset[data-field-editor="move"]');const owner=editor.locator('input[data-teaching-path=\'["owner"]\']');
     assert.deepEqual(await owner.evaluate(node=>{const s=getComputedStyle(node);return{font:s.fontFamily,size:s.fontSize,radius:s.borderRadius,border:s.borderColor};}),oldField);
     await owner.fill('Lin');await demo.locator('[data-run]').click();
     assert.equal(JSON.parse(await demo.locator('[data-result]').textContent()).tasks[0].owner,'Lin','Chinese structured editor must update the real model');
     assert.equal(await demo.locator('[data-visual]').getByRole('cell',{name:'Lin',exact:true}).count(),1);
     await owner.focus();await page.keyboard.press('Escape');assert.equal(await page.locator('#entryDialog').evaluate(node=>node.open),true,'Editing Escape must not leave the lesson');
     assert.equal(await demo.locator('pre[data-result]').isVisible(),false,'Raw result remains opt-in after edits');
    }
    if(id==='K-D16-001'){
     await demo.locator('[data-runtime]').click();await page.waitForFunction(()=>document.querySelector('[data-runtime-result]')?.textContent?.startsWith('{'));
     assert.equal(JSON.parse(await demo.locator('[data-runtime-result]').textContent()).phase,'fulfilled');
     assert.match(await demo.locator('.teaching-ui__feedback').textContent(),/已完成/);
    }
    if(evidence)await page.screenshot({path:`${evidence}/${name}-${width}-${id}.png`,animations:'disabled'});
    records.push({engine:name,width,id,status:'PASS'});
   }
   // Metadata arriving between pointer down/up must not move the settings action.
   let releaseMedia;const heldMedia=new Promise(resolve=>{releaseMedia=resolve;});
   await page.route('**/fixtures/teaching.mp4',async route=>{await heldMedia;await route.continue();});
   await page.goto(base+'#K-D08-039/L2',{waitUntil:'domcontentloaded'});await page.waitForFunction(()=>document.getElementById('detailId')?.textContent==='K-D08-039');
   const mediaDemo=page.locator('.teaching-ui');await mediaDemo.waitFor();await mediaDemo.locator('details[data-teaching-settings]>summary').click();
   await mediaDemo.locator('[data-input]').fill(JSON.stringify({duration:1.5,time:.9,volume:.5,selected:1,playing:true}));
   const apply=mediaDemo.locator('[data-run]');await apply.scrollIntoViewIfNeeded();const before=await apply.boundingBox();
   await page.mouse.move(before.x+before.width/2,before.y+before.height/2);await page.mouse.down();releaseMedia();
   await page.waitForFunction(()=>document.querySelector('[data-media]')?.readyState>=1);const after=await apply.boundingBox();
   assert.ok(Math.abs(before.y-after.y)<=1,'Media metadata must not shift a pressed action: '+JSON.stringify({before,after}));await page.mouse.up();
   assert.equal(JSON.parse(await mediaDemo.locator('[data-result]').textContent()).cue,'Frame two','Pointer activation must reach the real settings action');
   await page.unroute('**/fixtures/teaching.mp4');records.push({engine:name,width,id:'K-D08-039',status:'PASS',metadataLayoutStable:true});
   await page.goto(base);await page.locator('#catalogSearch').fill('K-D12-002');
   const opener=page.locator('.entry h3 button');await opener.click();await page.locator('.teaching-ui').waitFor();
   await page.locator('.skip').focus();await page.keyboard.press('Enter');assert.match(new URL(page.url()).hash,/K-D12-002/);
   assert.equal(await page.evaluate(()=>document.activeElement.id),'detailTitle');
   await page.getByRole('button',{name:'关闭知识详情',exact:true}).click();await page.locator('#catalogDirectory').waitFor();
   assert.equal(await page.locator('#catalogSearch').inputValue(),'K-D12-002');assert.equal(await opener.evaluate(node=>node===document.activeElement),true,'Return must restore filter and opener focus');
   assert.deepEqual(await page.evaluate(()=>({...localStorage})),{'adFactoryLearning.v8.production':'synthetic-original','adFactoryLearning.v8.order-lab':'synthetic-lab'});
   if(process.argv.includes('--layout-all')){
    let scan;
    // Short-lived pages keep the bulk layout scan below browser history flooding limits.
    for(const [index,lesson] of [buttonPilot,...curriculum,...expandedCurriculum,...remainingCurriculum].entries()){
     if(index%40===0){await scan?.close();scan=await context.newPage();scan.setDefaultTimeout(12000);scan.on('pageerror',error=>errors.push(error.message));scan.on('request',request=>{if(request.method()!=='GET')writes.push(request.method()+' '+request.url());});await scan.goto(base+'#'+lesson.knowledgeId+'/L2',{waitUntil:'domcontentloaded'});}
     else await scan.evaluate(id=>{location.hash=id+'/L2';},lesson.knowledgeId);
     await scan.waitForFunction(id=>document.getElementById('detailId').textContent===id,lesson.knowledgeId).catch(error=>{throw new Error(name+' '+width+' '+lesson.knowledgeId+' route '+scan.url()+' '+errors.join(';')+' '+error.message);});
     assert.equal(await scan.locator('.teaching-ui').count(),1,lesson.knowledgeId+' live presentation');
     assert.equal(await scan.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true,lesson.knowledgeId+' default viewport overflow');
     assert.equal(await scan.locator('[data-teaching-settings][open],[data-advanced-input][open],[data-teaching-results][open],.lesson-notes[open]').count(),0,lesson.knowledgeId+' default diagnostics');
     layout.push({engine:name,width,id:lesson.knowledgeId,status:'PASS'});
     if(layout.length%100===0)console.log(name+' '+width+' layout '+lesson.knowledgeId);
    }
    await scan?.close();
    console.log(name+' '+width+': 821 default layouts/navigation/overflow PASS');
    if(evidence)writeFileSync(evidence+'/layout-results.json',JSON.stringify(layout,null,2)+'\n');
   }
   assert.deepEqual(await page.evaluate(()=>({...localStorage})),{'adFactoryLearning.v8.production':'synthetic-original','adFactoryLearning.v8.order-lab':'synthetic-lab'});
   assert.deepEqual(errors,[]);assert.deepEqual(writes,[]);await context.close();console.log(name+' '+width+': shared tokens, live editing, navigation/focus, folded diagnostics, viewport and storage PASS');
  }}finally{await browser.close();}
 }
 if(evidence)writeFileSync(evidence+'/ui-results.json',JSON.stringify(records,null,2)+'\n');
 console.log(JSON.stringify({status:'PASS',scenarios:records.length,defaultLayouts:layout.length,engines:new Set(records.map(record=>record.engine)).size,widths:2,productionMigration:'BLOCKED'}));
}
