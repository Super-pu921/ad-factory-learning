import {revealTeachingControls} from './teaching-ui-browser-helpers.mjs';
import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {createRequire} from 'node:module';
import {pathToFileURL,fileURLToPath} from 'node:url';
import http from 'node:http';
import {remainingEngineeringDefinitions as definitions,remainingEngineeringSkipped as skipped,runRemainingEngineeringExample as run} from '../knowledge-catalog/remaining-engineering.mjs';
import {curriculum} from '../knowledge-catalog/curriculum.mjs';
import {advancedDefinitions} from '../knowledge-catalog/expanded-advanced.mjs';
const persistent=new Set(['offline-storage','offline-queue','cache-persistence','state-persistence','autosave','autosave-debounce','draft-management','form-persistence']);
const ns=d=>'adFactoryLearning.v8.teaching.sandbox.'+d.knowledgeId;
const known=(d,value)=>assert.deepEqual(d.witness.path.split('.').reduce((v,k)=>v?.[k],value),d.witness.value,d.knowledgeId+' '+d.witness.path);

export async function exerciseRemainingEngineeringDemo(page,def,level='L2'){
 const root=page.locator(`[data-demo="${def.kind}"]`).first();await root.waitFor({state:'visible'});await revealTeachingControls(root);await root.locator('[data-reset]').click();const initial=JSON.parse(await root.locator('[data-result]').textContent());assert.deepEqual(initial,run(def));known(def,initial);
 const native=async()=>{await root.locator('[data-runtime]').click();await page.waitForFunction(kind=>document.querySelector(`[data-demo="${kind}"] [data-runtime-result]`)?.textContent?.startsWith('{'),def.kind,{timeout:6000});const value=JSON.parse(await root.locator('[data-runtime-result]').textContent());assert.equal(Object.hasOwn(value,'error'),false,def.knowledgeId+'原生路径:'+JSON.stringify(value));return value;};
 if(['async-request','request-dedup','request-batching','authentication','csp','optimistic-ui','pessimistic-ui'].includes(def.key)){
  const first=await native();if(def.key==='csp')assert.deepEqual(first.messages,['nonce-script']);if(def.key==='request-dedup'){assert.equal(first.sharedPromise,true);assert.equal(first.calls,initial.executions);}if(def.key==='request-batching')assert.equal(first.batches[0].length,2);if(def.key==='authentication')assert.equal(first.authenticated,false);if(def.key==='async-request')assert.equal(first.phase,'fulfilled');if(['optimistic-ui','pessimistic-ui'].includes(def.key))assert.equal(first.final,String(initial.value));
 }
 for(const[key,value]of Object.entries(def.changed)){const field=root.locator(`[data-field="${key}"]`);if(typeof value==='boolean')await field.setChecked(value);else await field.fill(typeof value==='object'||typeof value!==typeof def.input[key]?JSON.stringify(value):String(value));}
 await root.locator('[data-run]').click();assert.equal(await root.getAttribute('data-valid'),'true',def.knowledgeId);const changed=JSON.parse(await root.locator('[data-result]').textContent());assert.deepEqual(changed,run(def,def.changed));assert.notDeepEqual(initial,changed);
 const actual=await native();
 switch(def.key){
  case 'async-request':assert.equal(actual.phase,def.changed.fail?'rejected':'fulfilled');assert.equal(actual.promiseExecuted,true);break;
  case 'request-lifecycle':assert.equal(actual.status,def.changed.status);break;
  case 'request-dedup':assert.equal(actual.calls,changed.executions);break;
  case 'request-batching':assert.equal(actual.calls,changed.calls);break;
  case 'parallel-requests':case 'sequential-requests':assert.deepEqual(actual.results,def.changed.tasks.map(t=>t.id));assert.equal(actual.actualPromises,true);break;
  case 'dependent-queries':assert.equal(actual.dependentKey,def.changed.customerId);break;
  case 'polling':assert.deepEqual(actual.values,def.changed.snapshots.slice(0,def.changed.count));assert.equal(actual.intervalCleared,true);break;
  case 'swr':assert.equal(actual.first,String(changed.initial));assert.equal(actual.final,String(changed.final));break;
  case 'optimistic-ui':case 'pessimistic-ui':assert.equal(actual.first,String(changed.trace[0].value));assert.equal(actual.final,String(changed.value));break;
  case 'concurrency-control':assert.equal(actual.limited,true);assert.equal(actual.completed.length,def.changed.jobs.length);break;
  case 'autosave':assert.equal(actual.latest,changed.latestSaved);break;
  case 'autosave-debounce':assert.equal(actual.latest,def.changed.edits.at(-1).value);assert.ok(actual.writes>=1&&actual.writes<=def.changed.edits.length);break;
  case 'authentication':assert.equal(actual.authenticated,changed.authenticated);break;
  case 'xss':assert.equal(actual.childElements,0);assert.equal(actual.scriptElements,0);assert.equal(await root.locator('[data-xss-target]').textContent(),def.changed.payload);break;
  case 'csp':assert.deepEqual(actual.messages,def.changed.allowInline?['untrusted-inline','nonce-script']:['nonce-script']);assert.equal(actual.iframeExecuted,true);break;
  case 'lazy-loading':case 'code-splitting':case 'dynamic-import':case 'resource-prefetch':assert.equal(actual.loaded,true);assert.equal(actual.result,(def.changed.a??2)*(def.changed.b??3));assert.equal(actual.chunk,'engineering-isolated-chunk-v1');break;
  case 'render-optimization':assert.equal(actual.writes,changed.renders);break;
  case 'memory-management':case 'leak-detection':assert.equal(actual.removed,true);assert.equal(actual.before,actual.after);break;
  case 'web-worker':assert.equal(actual.sum,changed.sum);assert.equal(actual.worker,true);assert.equal(actual.terminated,true);break;
  case 'webassembly':assert.equal(actual.result,changed.result);assert.equal(actual.actualInstantiation,true);break;
  case 'image-optimization':assert.equal(actual.width,changed.width);assert.equal(actual.height,changed.height);assert.ok(actual.encodedBytes>20);break;
  case 'profiling':case 'performance-testing':assert.equal(actual.measured,true);assert.ok(actual.duration>=0);assert.equal(actual.actual,actual.size*(actual.size+1)/2);break;
  case 'component-testing':assert.equal(actual.passed,changed.passed);assert.equal(actual.actualDOM,true);break;
  case 'e2e-testing':assert.deepEqual(actual.submitted,changed.record);assert.equal(actual.actualDOM,true);break;
  case 'visual-regression':assert.equal(actual.changedChannels,changed.changedChannels);assert.equal(actual.actualCanvas,true);break;
  case 'accessibility-testing':assert.equal(actual.issues.length,changed.issues.length);assert.equal(actual.actualDOM,true);break;
  default:assert.equal(actual.executed,true);assert.deepEqual(actual.result,changed);
 }
 if(persistent.has(def.key)){
  if(level==='L3'){await root.locator('[data-save]').click();assert.equal(JSON.parse(await root.locator('[data-runtime-result]').textContent()).saved,true);await page.reload({waitUntil:'domcontentloaded'});await root.waitFor({state:'visible'});await revealTeachingControls(root);await root.locator('[data-restore]').click();assert.equal(JSON.parse(await root.locator('[data-runtime-result]').textContent()).restored,true);assert.deepEqual(JSON.parse(await root.locator('[data-result]').textContent()),changed);}
  await root.locator('[data-clear]').click();assert.equal(await page.evaluate(key=>localStorage.getItem(key),ns(def)),null,'只清除当前单例键');
 }
 if(level!=='L1'){await root.locator('[data-invalid]').click();assert.equal(await root.getAttribute('data-valid'),'false');assert.match(await root.locator('[data-error]').textContent(),/输入错误/);await root.locator('[data-reset]').click();assert.deepEqual(JSON.parse(await root.locator('[data-result]').textContent()),run(def));}
 return {id:def.knowledgeId,level,status:'PASS',runtime:true,refresh:persistent.has(def.key)&&level==='L3'};
}

export async function testRemainingEngineeringModels(){
 const catalog=JSON.parse(await readFile(new URL('../knowledge-catalog/catalog.json',import.meta.url),'utf8')),old=new Set([...curriculum,...advancedDefinitions].map(d=>d.knowledgeId)),expected=catalog.entries.filter(e=>e.domain==='D16'&&e.id===e.canonicalId&&!old.has(e.id)),all=[...definitions,...skipped];assert.equal(definitions.length,88);assert.equal(skipped.length,4);assert.equal(expected.length,92);assert.equal(new Set(all.map(d=>d.knowledgeId)).size,92);assert.deepEqual(all.map(d=>d.knowledgeId).sort(),expected.map(d=>d.id).sort());
 for(const d of all){const source=catalog.entries.find(e=>e.id===d.knowledgeId);assert.equal(source.canonicalId,d.knowledgeId);assert.equal(source.name,d.title);}
 for(const d of definitions){const source=JSON.stringify([d.input,d.changed,d.invalidInput]),output=run(d);known(d,output);assert.deepEqual(output,run(d));assert.notDeepEqual(output,run(d,d.changed),d.knowledgeId+'对比值必须改变实际结果');assert.throws(()=>run(d,d.invalidInput),d.knowledgeId+'负例');assert.throws(()=>run(d,{}));assert.equal(JSON.stringify([d.input,d.changed,d.invalidInput]),source);for(const field of ['principle','mechanism','limits','observe','interact','verify','apply','invariant','invalid'])assert.ok(d[field]?.length>4);const printed=execFileSync(process.execPath,['--input-type=module','-e',d.code],{cwd:fileURLToPath(new URL('../knowledge-catalog/',import.meta.url)),encoding:'utf8'}).trim();assert.equal(printed,d.expected,d.knowledgeId+'实际片段执行');}
 const get=key=>definitions.find(d=>d.key===key),go=(key,patch)=>run(get(key),{...get(key).input,...patch});
 assert.equal(go('webassembly',{a:-2,b:3}).result,1);assert.equal(go('webassembly',{a:2147483647,b:1}).result,-2147483648);
 assert.equal(go('optimistic-ui',{accepted:false}).value,5);assert.equal(go('pessimistic-ui',{accepted:false}).trace[0].value,5);
 assert.equal(go('compensation',{chargeSucceeds:false}).stock,10);assert.equal(go('distributed-transaction',{participants:[{id:'A',prepare:true}]}).decision,'commit');
 assert.equal(go('session-management',{now:120,lastSeen:90}).active,false);assert.equal(go('csrf',{submittedToken:'demo-csrf',origin:'https://evil.invalid'}).allowed,false);
 assert.deepEqual(go('rollback',{target:'v2'}).restored,{value:2});assert.equal(go('database-migration',{}).productionMigration,'BLOCKED');
 const record={id:'A',label:'x'};assert.deepEqual(go('backward-compatibility',{record}).name,'x');
 assert.equal(go('feature-verification',{unverified:['manual-runtime']}).accepted,false);
 assert.throws(()=>go('concurrency-control',{limit:100000000}));
 assert.throws(()=>go('integration-testing',{qty:Number.MAX_SAFE_INTEGER,cents:100}));
 const summary={status:'PASS',module:'engineering',implemented:88,skipped:4,canonicalTotal:92,knownValueAssertions:88,negativeCases:88,snippets:88,sourceUnchanged:true};console.log(JSON.stringify(summary));
 if(process.env.V8_EVIDENCE_DIR){await mkdir(process.env.V8_EVIDENCE_DIR,{recursive:true});await writeFile(process.env.V8_EVIDENCE_DIR+'/node-results.json',JSON.stringify(summary,null,2)+'\n');}
 return summary;
}

export async function testRemainingEngineeringBrowser({engine='chromium',levels=['L1','L2','L3']}={}){
 const modulePath=process.env.V8_PLAYWRIGHT_MODULE;assert.ok(modulePath,'指定现有Playwright路径');const playwright=createRequire(import.meta.url)(modulePath);assert.ok(['chromium','webkit'].includes(engine));const records=[];
 const html='<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><main></main><script type="module">import{remainingEngineeringDefinitions as defs,renderRemainingEngineeringDemo as render}from"/remaining-engineering.mjs";window.show=(id,updateHistory=true)=>{window.dispose?.();window.dispose=render(document.querySelector("main"),defs.find(d=>d.knowledgeId===id));if(updateHistory&&location.hash!=="#"+id)history.replaceState(null,"","#"+id);};window.ready=true;if(location.hash)window.show(location.hash.slice(1).split("/")[0]);</script>';
 const routes=new Set(['/remaining-engineering.mjs','/remaining-engineering-definitions.mjs','/remaining-engineering-chunk.mjs','/teaching-ui.mjs','/teaching-labels.mjs']);const server=http.createServer(async(req,res)=>{const path=new URL(req.url,'http://127.0.0.1').pathname;if(routes.has(path)){res.setHeader('Content-Type','text/javascript');res.end(await readFile(new URL('../knowledge-catalog'+path,import.meta.url)));}else{res.setHeader('Content-Type','text/html');res.end(html);}});await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
 const save=async()=>{if(process.env.V8_EVIDENCE_DIR){await mkdir(process.env.V8_EVIDENCE_DIR,{recursive:true});await writeFile(process.env.V8_EVIDENCE_DIR+`/case-results-${engine}.json`,JSON.stringify(records,null,2)+'\n');}};
 try{browser=await playwright[engine].launch({headless:true});const context=await browser.newContext({viewport:{width:1100,height:900}});await context.addInitScript(()=>{if(window===top){localStorage.setItem('adFactoryLearning.v8.production','synthetic-preserve');localStorage.setItem('adFactoryLearning.v8.order-lab','synthetic-preserve-lab');}});const page=await context.newPage(),errors=[],requests=[];page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>requests.push({method:r.method(),url:r.url()}));await page.goto(`http://127.0.0.1:${server.address().port}/`);await page.waitForFunction(()=>window.ready);const capabilities=await page.evaluate(()=>({syncManager:typeof SyncManager,backgroundSync:Boolean(navigator.serviceWorker&&'SyncManager'in window),worker:typeof Worker,wasm:typeof WebAssembly}));let units=0;
 for(const d of definitions){for(const level of levels){await page.evaluate(id=>window.show(id),d.knowledgeId);try{records.push({...await exerciseRemainingEngineeringDemo(page,d,level),engine,width:1100});}catch(error){records.push({id:d.knowledgeId,level,engine,width:1100,status:'FAIL',error:error.message});await save();console.error('FAILED',engine,d.knowledgeId,level);throw error;}units++;}if(units%45===0){console.log(engine+' units='+units);await save();}}
 await page.setViewportSize({width:375,height:812});for(const d of definitions){await page.evaluate(id=>window.show(id,false),d.knowledgeId);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,d.knowledgeId+'窄屏溢出');}
 await page.evaluate(()=>window.dispose());assert.equal(await page.locator('main').evaluate(e=>e.childElementCount),0);assert.deepEqual(errors,[]);assert.ok(requests.every(r=>r.method==='GET'&&r.url.startsWith(`http://127.0.0.1:${server.address().port}/`)));assert.equal(await page.evaluate(()=>localStorage.getItem('adFactoryLearning.v8.production')),'synthetic-preserve');assert.equal(await page.evaluate(()=>localStorage.getItem('adFactoryLearning.v8.order-lab')),'synthetic-preserve-lab');for(const d of definitions.filter(d=>persistent.has(d.key)))assert.equal(await page.evaluate(key=>localStorage.getItem(key),ns(d)),null,'必须清理自己的教学键');await save();
 const summary={status:'PASS',module:'engineering',engine,topics:88,units,mobileTopics:88,pageErrors:0,disposer:true,externalRequests:0,persistentInstancesCleared:8,sentinelPreserved:true,capabilities};console.log(JSON.stringify(summary));if(process.env.V8_EVIDENCE_DIR)await writeFile(process.env.V8_EVIDENCE_DIR+`/browser-summary-${engine}.json`,JSON.stringify(summary,null,2)+'\n');await context.close();return summary;
 }finally{await browser?.close();await new Promise(r=>server.close(r));}
}
if(process.argv[1]&&pathToFileURL(process.argv[1]).href===import.meta.url){await testRemainingEngineeringModels();const flag=process.argv.find(a=>a.startsWith('--browser'));if(flag)await testRemainingEngineeringBrowser({engine:flag.split('=')[1]||'chromium'});}
