import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {curriculum} from '../knowledge-catalog/curriculum.mjs';
import * as model from '../knowledge-catalog/curriculum-models.mjs';
import {buildTeachingManifest} from './build-v8-teaching-manifest.mjs';

const catalog=JSON.parse(readFileSync(new URL('../knowledge-catalog/catalog.json',import.meta.url),'utf8'));
assert.equal(curriculum.length,32);assert.equal(new Set(curriculum.map(lesson=>lesson.domain)).size,16);
assert.equal(new Set(curriculum.map(lesson=>lesson.knowledgeId)).size,32);
assert.equal(new Set(curriculum.flatMap(lesson=>lesson.units.map(unit=>unit.id))).size,96);
for(const lesson of curriculum) {
  const source=catalog.entries.find(entry=>entry.id===lesson.knowledgeId);
  assert.equal(source?.name,lesson.title);assert.equal(source.canonicalId,source.id);
  assert.equal(lesson.units.length,3);assert.ok(lesson.limits.length>15);
  assert.deepEqual(lesson.units.map(unit=>unit.level),['L1','L2','L3']);
  for(const unit of lesson.units) {
    for(const field of ['title','objective','exercise','pitfall','summary'])assert.ok(typeof unit[field]==='string'&&unit[field].trim(),`${lesson.knowledgeId}: ${field}`);
    assert.equal(unit.acceptance.length,3);assert.match(unit.difficulty,/^E[1-5]$/);
    for(const ref of unit.blockRefs)assert.equal(lesson.blocks[ref.id].version,ref.version);
  }
  const output=execFileSync(process.execPath,['--input-type=module','-e',lesson.code],{cwd:new URL('../knowledge-catalog/',import.meta.url),encoding:'utf8'}).trim();
  assert.equal(output,lesson.expected,`runnable example ${lesson.knowledgeId}`);
}
assert.throws(()=>{curriculum[0].units[0].blockRefs[0].version='latest';},TypeError);
const manifest=buildTeachingManifest();
assert.deepEqual(manifest,JSON.parse(readFileSync(new URL('../knowledge-catalog/teaching-manifest.json',import.meta.url),'utf8')));
assert.deepEqual(manifest.statistics,{originalDirectoryEntries:840,teachingTopics:33,layeredUnits:99,coveredDomains:16,formalMigratedCourses:0});
assert.ok(manifest.domains.every(domain=>domain.teachingTopics>=2));
assert.equal(manifest.productionMigration,'BLOCKED');assert.equal(manifest.progressPersistence,'NONE');

assert.equal(model.gridTracks(2),'repeat(2, minmax(0, 1fr))');assert.throws(()=>model.gridTracks(0));
assert.equal(model.nextTab(0,'ArrowLeft',3),2);assert.equal(model.nextTab(1,'Home',3),0);assert.equal(model.nextTab(0,'End',3),2);assert.throws(()=>model.nextTab(-1,'End',3));
assert.equal(model.validateOrderCode(' JOB-01 ').valid,true);for(const value of ['', 'lower', '中文', 'A'.repeat(13)])assert.equal(model.validateOrderCode(value).valid,false);
const rows=[{id:'B',cents:100},{id:'A',cents:100},{id:'C',cents:20}],original=structuredClone(rows);
assert.deepEqual(model.tableRows(rows).map(row=>row.id),['C','A','B']);assert.deepEqual(model.tableRows(rows,{query:'b'}).map(row=>row.id),['B']);assert.deepEqual(rows,original);
assert.equal(model.toastDelay(3),3000);assert.throws(()=>model.toastDelay(-1));
assert.equal(model.resolveConfirmation('old','cancel','new'),'old');assert.equal(model.resolveConfirmation('old','confirm','new'),'new');assert.throws(()=>model.resolveConfirmation('old','unknown','new'));
assert.equal(model.validateFileMetadata({name:'a.csv',size:1048576}),true);assert.equal(model.validateFileMetadata({name:'a.txt',size:0}),true);
for(const file of [{name:'a.json',size:1},{name:'a.csv',size:1048577},{name:'a.csv',size:-1},null])assert.equal(model.validateFileMetadata(file),false);
assert.deepEqual(model.chartValues('0,0'),[{value:0,percent:0},{value:0,percent:0}]);for(const values of ['-1,2','1,,2','1001','1,2,3,4,5,6,7'])assert.throws(()=>model.chartValues(values));
assert.deepEqual(model.projectMarker(0,0),{x:50,y:50});assert.deepEqual(model.projectMarker(180,-90),{x:100,y:100});for(const point of [[181,0],[0,91],[NaN,0]])assert.throws(()=>model.projectMarker(...point));
assert.equal(model.traceStockFlow(5,5)[1],'库存充足');assert.equal(model.traceStockFlow(1,0)[1],'库存不足');assert.throws(()=>model.traceStockFlow(0,5));
assert.equal(model.approvalTransition('DRAFT','submit','requester'),'REVIEW');assert.equal(model.approvalTransition('REVIEW','reject','reviewer','返工'),'DRAFT');
assert.throws(()=>model.approvalTransition('DRAFT','approve','reviewer'));assert.throws(()=>model.approvalTransition('REVIEW','approve','requester'));assert.throws(()=>model.approvalTransition('REVIEW','reject','reviewer',''));
const a={a:1,b:0},b={a:0,b:2},c={a:3,b:1};assert.deepEqual(model.mergeCounters(a,b),model.mergeCounters(b,a));assert.deepEqual(model.mergeCounters(a,a),a);assert.deepEqual(model.mergeCounters(model.mergeCounters(a,b),c),model.mergeCounters(a,model.mergeCounters(b,c)));assert.throws(()=>model.mergeCounters({a:-1,b:0},b));
assert.equal(model.runDemoTool({operation:'sum',values:[-1,2,3]},true).result,4);assert.throws(()=>model.runDemoTool({operation:'sum',values:[1]},false));
for(const args of [{operation:'eval',values:[1]},{operation:'sum',values:['1']},{operation:'sum',values:[]},{operation:'sum',values:[1],extra:'x'}])assert.throws(()=>model.runDemoTool(args,true));
assert.equal(model.contrastRatio('#000000','#ffffff').ratio,21);assert.equal(model.contrastRatio('#777777','#ffffff').normalAA,false);assert.equal(model.contrastRatio('#767676','#ffffff').normalAA,true);assert.throws(()=>model.contrastRatio('red','#ffffff'));
const history=model.createHistory(['a']);history.apply(['a','b']);history.undo();history.apply(['a','c']);assert.equal(history.snapshot().canRedo,false);
const copy=history.snapshot();copy.value.push('tamper');assert.deepEqual(history.snapshot().value,['a','c']);
const snapshot=history.snapshot();assert.throws(()=>history.apply([1]));assert.deepEqual(history.snapshot(),snapshot,'rejected edits must not change history');
const capped=model.createHistory([]);for(let i=0;i<60;i++)capped.apply([String(i)]);for(let i=0;i<60;i++)capped.undo();assert.deepEqual(capped.snapshot().value,['9']);assert.equal(capped.snapshot().canUndo,false);for(let i=0;i<60;i++)capped.redo();assert.deepEqual(capped.snapshot().value,['59']);
assert.deepEqual(model.teachingHref('#K-D01-001/L2'),{href:'#K-D01-001/L2',external:false});
assert.equal(model.teachingHref(' https://example.org ').href,'https://example.org/');
for(const href of ['javascript:alert(1)','data:text/html,hi','//example.org','http://example.org','https://user:pass@example.org','#K-D99-001',null])assert.throws(()=>model.teachingHref(href));
assert.deepEqual(model.flexConfig('row',true),{display:'flex',flexDirection:'row',flexWrap:'wrap'});assert.throws(()=>model.flexConfig('reverse',true));
assert.deepEqual(model.pagination(23,99,10),{page:3,pages:3,start:20,end:23});assert.deepEqual(model.pagination(0,1,5),{page:0,pages:0,start:0,end:0});assert.throws(()=>model.pagination(5,0,5));
assert.equal(model.decimalHundredths('-1.25'),-125);assert.equal(model.decimalHundredths('0'),0);assert.equal(model.decimalHundredths('-0'),0);assert.equal(model.decimalHundredths('100.00'),10000);
for(const value of ['','100.01','-100.01','1.234','1e2','Infinity','1,25',null])assert.throws(()=>model.decimalHundredths(value));
assert.deepEqual(model.statisticChange(12,0),{delta:12,percent:null});assert.deepEqual(model.statisticChange(8,10),{delta:-2,percent:-20});assert.throws(()=>model.statisticChange(-1,0));
assert.deepEqual(model.progressState(5,5),{completed:5,total:5,percent:100,done:true});assert.throws(()=>model.progressState(6,5));assert.throws(()=>model.progressState(0,0));
assert.equal(JSON.parse(model.formatTeachingJson('{"text":"<img src=x onerror=alert(1)>"}')).text,'<img src=x onerror=alert(1)>');
assert.equal(JSON.parse(model.formatTeachingJson('{"__proto__":{"polluted":true}}')).__proto__.polluted,true);assert.equal({}.polluted,undefined);
for(const value of ['{"a":1,}','x'.repeat(2001),undefined])assert.throws(()=>model.formatTeachingJson(value));
assert.deepEqual(model.linePoints('0'),[{value:0,x:50,y:100}]);assert.equal(model.linePoints('0,0')[1].x,100);assert.throws(()=>model.linePoints('1,,2'));
const layers=[{id:'base',visible:true},{id:'point',visible:false}],savedLayers=structuredClone(layers);
assert.deepEqual(model.reorderLayers(layers,'point',1),layers);assert.equal(model.reorderLayers(layers,'base',1)[1].id,'base');assert.deepEqual(layers,savedLayers);assert.throws(()=>model.reorderLayers(layers,'unknown',1));
assert.deepEqual(model.snapToGrid(25,35,10),{x:30,y:40});assert.deepEqual(model.snapToGrid(100,0,20),{x:100,y:0});assert.throws(()=>model.snapToGrid(101,0,10));assert.throws(()=>model.snapToGrid(0,0,0));
const cards=[{id:'A',status:'TODO'},{id:'B',status:'DOING'}],savedCards=structuredClone(cards);
assert.throws(()=>model.moveKanban(cards,'A','DONE'));assert.equal(model.moveKanban(cards,'A','DOING')[0].status,'DOING');assert.deepEqual(cards,savedCards);assert.throws(()=>model.moveKanban(cards,'missing','DOING'));
assert.equal(model.typingActive(100,1099),true);assert.equal(model.typingActive(100,1100),false);assert.equal(model.typingActive(null,0),false);assert.throws(()=>model.typingActive(100,99));
const messages=[{role:'user',text:'a'},{role:'assistant',text:'b'}],fork=model.branchMessages(messages,0);fork[0].text='changed';assert.equal(messages[0].text,'a');assert.equal(fork.length,1);assert.throws(()=>model.branchMessages(messages,2));
assert.equal(model.localizedNumber('1234.5','de-DE'),'1.234,50');assert.equal(model.localizedNumber('-1.25','en-US'),'-1.25');assert.throws(()=>model.localizedNumber('1,25','de-DE'));assert.throws(()=>model.localizedNumber('1','unknown'));
let clock=0,serial=0;const timers=new Map(),calls=[];
const fake={set(fn,delay){const id=++serial;timers.set(id,{fn,at:clock+delay});return id;},clear(id){timers.delete(id);}};
const advance=ms=>{clock+=ms;for(const [id,timer] of [...timers])if(timer.at<=clock){timers.delete(id);timer.fn();}};
const debounce=model.createDebouncer(value=>calls.push(value),300,fake);debounce.run('old');advance(200);debounce.run('new');advance(299);assert.deepEqual(calls,[]);advance(1);assert.deepEqual(calls,['new']);
debounce.run('cancelled');debounce.cancel();advance(300);assert.deepEqual(calls,['new']);debounce.run('disposed');debounce.dispose();advance(300);debounce.run('closed');advance(300);assert.deepEqual(calls,['new']);assert.equal(timers.size,0);
for(const path of ['curriculum.mjs','curriculum-models.mjs','curriculum-demos.mjs']) {
  const source=readFileSync(new URL('../knowledge-catalog/'+path,import.meta.url),'utf8');
  assert.doesNotMatch(source,/\b(?:localStorage|sessionStorage|indexedDB)\s*[.[]/);
  assert.doesNotMatch(source,/\.innerHTML\s*=|\beval\s*\(|\bnew Function\s*\(/);
}
console.log('Curriculum OK: D01-D16, 32 batch topics / 96 units; total 33 topics / 99 units; all 32 examples executed, pinned content, input/empty/negative cases, immutable state and deterministic timer cleanup verified. Migration BLOCKED.');
