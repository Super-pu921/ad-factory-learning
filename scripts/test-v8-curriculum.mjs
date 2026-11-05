import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {curriculum} from '../knowledge-catalog/curriculum.mjs';
import * as model from '../knowledge-catalog/curriculum-models.mjs';
import {buildTeachingManifest} from './build-v8-teaching-manifest.mjs';

const catalog=JSON.parse(readFileSync(new URL('../knowledge-catalog/catalog.json',import.meta.url),'utf8'));
assert.equal(curriculum.length,16);assert.equal(new Set(curriculum.map(lesson=>lesson.domain)).size,16);
assert.equal(new Set(curriculum.map(lesson=>lesson.knowledgeId)).size,16);
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
assert.deepEqual(manifest.statistics,{originalDirectoryEntries:840,teachingTopics:17,layeredUnits:51,coveredDomains:16,formalMigratedCourses:0});
assert.ok(manifest.domains.every(domain=>domain.teachingTopics>=1));
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
for(const path of ['curriculum.mjs','curriculum-models.mjs','curriculum-demos.mjs']) {
  const source=readFileSync(new URL('../knowledge-catalog/'+path,import.meta.url),'utf8');
  assert.doesNotMatch(source,/\b(?:localStorage|sessionStorage|indexedDB)\s*[.[]/);
  assert.doesNotMatch(source,/\.innerHTML\s*=|\beval\s*\(|\bnew Function\s*\(/);
}
console.log('Curriculum OK: D01-D16, 16 new topics / 48 units; total 17 topics / 51 units; all 16 examples executed, pinned content, model negative cases and immutable history verified. Migration BLOCKED.');
