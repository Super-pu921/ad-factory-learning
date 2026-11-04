import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {auditV8MigrationData, EXPECTED} from './migration-audit-core.mjs';

// Fixture is constructed in memory; no browser storage or project files are written.
function fixture() {
 const phases=Array.from({length:13},(_,i)=>({id:i,name:'Stage '+i,start:i*7+1,end:Math.min(i*7+7,90)}));
 // 13 * 7 ends at 91; make final phase span 85..90 without overlap.
 for(let i=0;i<13;i++) { const a=i<12?i*7+1:85;const b=i<12?i*7+7:90; phases[i].start=a;phases[i].end=b; }
 // 12*7 = 84, final 6 = 90.
 const lessons=Array.from({length:90},(_,i)=>{
  const id=i+1,p=phases.find(x=>id>=x.start&&id<=x.end);
  return {id,chapterNumber:id,phase:p.name,title:'Synthetic '+id,
    opts:['A','B','C'],a:0,resourceId:1,
    relatedComponents:['component-1'],relatedScenes:[],referenceIds:[]};
 });
 const components=Array.from({length:88},(_,i)=>({id:'component-'+(i+1),name:'Synthetic component '+(i+1),category:'Category1',relatedLessons:i===0?[1]:[],relatedScenes:[],referenceIds:[]}));
 const scenes=['customers','quotes','orders','production','stock','payroll'].map(id=>({id}));
 const componentCategories=Object.fromEntries(Array.from({length:10},(_,i)=>['Category'+(i+1),['Category '+(i+1),'description']]));
 return {meta:{knowledgeRevision:'fixture-only',isPreview:false},lessons,components,scenes,phases,componentCategories,sources:[{id:'src1'}],resources:[{name:'Synthetic resource'}]};
}
const check=(r,id)=>r.checks.find(x=>x.id===id);
const baseline=fixture();
const first=auditV8MigrationData(baseline);
assert.deepEqual(first.baseline.expected,EXPECTED);
assert.deepEqual(first.baseline.observed,EXPECTED);
assert.equal(first.checks.every(c=>c.status==='PASS'),true,JSON.stringify(first.checks.filter(c=>c.status==='FAIL')));
assert.equal(first.statistics.deepDiveLessons,0);
assert.equal(first.migrationReadiness.status,'BLOCKED');
assert.equal(first.testCases.find(t=>t.id==='T10').status,'BLOCKED');
assert.ok(first.testCases.filter(t=>t.status==='PASS').every(t=>['T01','T02','T03'].includes(t.id)));
assert.equal(first.warnings.some(w=>w.id==='W01'),true,'asymmetry must only warn');
assert.equal(first.warnings.some(w=>w.id==='W02'&&w.review==='REQUIRES_REVIEW'),true);

const mutate=fn=>{const f=structuredClone(baseline);fn(f);return auditV8MigrationData(f)};
assert.equal(check(mutate(x=>x.lessons[1].id=1),'C03').status,'FAIL','duplicate lesson');
assert.equal(check(mutate(x=>x.lessons[1].relatedComponents=['missing-component']),'C05').status,'FAIL','unknown component');
assert.equal(check(mutate(x=>x.lessons[1].relatedScenes=['missing-scene']),'C05').status,'FAIL','unknown scene');
assert.equal(check(mutate(x=>x.components[1].referenceIds=['missing-source']),'C05').status,'FAIL','unknown source');
assert.equal(check(mutate(x=>x.lessons[1].a=99),'C06').status,'FAIL','invalid quiz index');
const invalidQuiz=mutate(x=>x.lessons[1].a=99);
assert.deepEqual(['T01','T02','T03'].map(id=>invalidQuiz.testCases.find(t=>t.id===id).status),
 ['PASS','PASS','FAIL'],'invalid quiz index cannot make source unreadable or corrupt IDs');
assert.deepEqual(['T01','T02','T03'].map(id=>invalidQuiz.testCases.find(t=>t.id===id).evidenceChecks),
 [['C01'],['C03'],['C02','C04','C05','C06','C07']],'each test must list its own evidence');
const duplicateLesson=mutate(x=>x.lessons[1].id=1);
assert.equal(duplicateLesson.testCases.find(t=>t.id==='T01').status,'PASS','duplicate ID does not make source unreadable');
assert.equal(duplicateLesson.testCases.find(t=>t.id==='T02').status,'FAIL','duplicate ID must fail identifier check');
const absentCollections=auditV8MigrationData({});
assert.deepEqual(['T01','T02','T03'].map(id=>absentCollections.testCases.find(t=>t.id===id).status),
 ['FAIL','BLOCKED','BLOCKED'],'unreadable entity collections block dependent tests');
assert.equal(check(mutate(x=>x.lessons[1].phase='missing-phase'),'C04').status,'FAIL','unknown phase');
assert.equal(check(mutate(x=>x.lessons[1].id='bad'),'C03').status,'FAIL','bad lesson id type');
assert.equal(check(mutate(x=>x.phases[0].start=2),'C04').status,'FAIL','phase mismatch');
assert.equal(check(mutate(x=>x.lessons[1].deepDive={referenceIds:['missing-source']}),'C05').status,'FAIL','deepDive missing source');
assert.equal(check(mutate(x=>x.components[1].category='bad'),'C05').status,'FAIL','missing category');
assert.deepEqual(auditV8MigrationData(baseline),auditV8MigrationData(baseline),'deterministic');
assert.equal(mutate(x=>x.lessons[1].a=99).migrationReadiness.status,'BLOCKED');

// Running in a repository: also verify the real static catalog without altering it.
const actual=JSON.parse(readFileSync(new URL('../data.json',import.meta.url),'utf8'));
const audited=auditV8MigrationData(actual);
assert.deepEqual(audited.baseline.observed,EXPECTED);
assert.equal(audited.checks.every(c=>c.status==='PASS'),true,JSON.stringify(audited.checks.filter(c=>c.status==='FAIL')));
assert.deepEqual([audited.statistics.lessonToComponent,audited.statistics.componentToLesson,audited.statistics.mutual,audited.statistics.unilateral],[203,176,34,311]);
assert.equal(audited.statistics.deepDiveLessons,35);
assert.equal(audited.migrationReadiness.status,'BLOCKED');
console.log('P3.2 static-only audit checks OK: local data.json baseline + in-memory negative fixtures; migration BLOCKED.');
