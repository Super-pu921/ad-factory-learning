/**
 * V8 migration preflight STATIC auditor. Pure module: no storage, I/O, or mutations.
 * This is not a data migration engine and never approves production migration.
 */
export const EXPECTED = Object.freeze({lessons:90,components:88,scenes:6,phases:13,componentCategories:10});

const TC = Object.freeze({
  T01:'Source snapshot and baseline readability',
  T02:'Legacy identifier integrity',
  T03:'Static catalog counts, relationships and quiz integrity',
  T04:'Verified one-to-one mappings',
  T05:'Verified one-to-many mappings',
  T06:'Verified many-to-one mappings',
  T07:'Mapping conflicts and rejection',
  T08:'ContentBlock reuse',
  T09:'Published content-version pinning',
  T10:'Real user LearningProgress migration',
  T11:'KnowledgeProgress independence',
  T12:'Idempotent migration batch execution',
  T13:'Interrupted migration recovery',
  T14:'Write-failure handling',
  T15:'Production read-switch rollback',
  T16:'End-to-end production migration acceptance'
});
const arr = v => Array.isArray(v) ? v : [];
const sorted = a => [...a].sort((x,y)=>String(x).localeCompare(String(y),'en'));
const distinct = a => [...new Set(a)];
const isRecord = x => x !== null && typeof x === 'object' && !Array.isArray(x);
const nonEmpty = v => typeof v==='string' && v.trim().length>0;

export function auditV8MigrationData(data) {
  const checks=[]; const warnings=[];
  const check=(id,status,message,details={})=>checks.push({id,status,message,...details});
  const warn=(id,message,details={})=>warnings.push({id,severity:'WARNING',review:'REQUIRES_REVIEW',message,...details});
  const root=isRecord(data)?data:{};
  const names=['lessons','components','scenes','phases'];
  const invalidRoot=names.filter(n=>!Array.isArray(root[n]));
  check('C01',invalidRoot.length?'FAIL':'PASS','Root entity collections must be arrays',{invalidFields:invalidRoot});
  const lessons=arr(root.lessons), components=arr(root.components),scenes=arr(root.scenes),phases=arr(root.phases);
  const categories=isRecord(root.componentCategories)?Object.keys(root.componentCategories):[];
  const observed={lessons:lessons.length,components:components.length,scenes:scenes.length,phases:phases.length,componentCategories:categories.length};
  const mismatch=Object.keys(EXPECTED).filter(k=>observed[k]!==EXPECTED[k]);
  check('C02',mismatch.length?'FAIL':'PASS','Frozen V8 static baseline counts',{expected:EXPECTED,observed,mismatched:mismatch});

  const errors=[];
  const ids=(list,type,valid)=>{
    const seen=new Set(); const found=new Set();
    list.forEach((item,index)=>{
      if (!isRecord(item)) {errors.push(`${type}[${index}] is not an object`);return;}
      if (!valid(item.id)) errors.push(`${type}[${index}].id invalid: ${String(item.id)}`);
      const key=String(item.id);
      if (seen.has(key)) errors.push(`${type} duplicate id: ${key}`);
      seen.add(key); found.add(item.id);
    });
    return found;
  };
  const lid=ids(lessons,'lessons',n=>Number.isInteger(n)&&n>=1&&n<=90);
  const cid=ids(components,'components',nonEmpty);
  const sid=ids(scenes,'scenes',nonEmpty);
  const pid=ids(phases,'phases',n=>Number.isInteger(n)&&n>=0&&n<=12);
  const cname=new Set(categories);
  if(!isRecord(root.componentCategories))errors.push('componentCategories must be object');
  const pnames=new Set();
  phases.forEach((p,i)=>{
    if(!isRecord(p))return;
    if(!nonEmpty(p.name))errors.push(`phases[${i}].name invalid`);
    if(pnames.has(p.name))errors.push(`phases duplicate name: ${String(p.name)}`);
    pnames.add(p.name);
    if(!Number.isInteger(p.start)||!Number.isInteger(p.end)||p.start>p.end)
      errors.push(`phases[${i}] invalid start/end`);
  });
  check('C03',errors.length?'FAIL':'PASS','Legacy ID types, ID uniqueness and phase identifiers',{errors:sorted(errors)});

  const stageErrors=[];
  const seenLessonsInRange=new Map();
  for(const l of lessons){
    if(!isRecord(l))continue;
    if(!pnames.has(l.phase))stageErrors.push(`lesson ${l.id}: unknown phase ${String(l.phase)}`);
    if(l.chapterNumber!==l.id)stageErrors.push(`lesson ${l.id}: chapterNumber mismatch`);
  }
  for(const p of phases){
    if(!isRecord(p)||!Number.isInteger(p.start)||!Number.isInteger(p.end)||p.start>p.end)continue;
    const members=lessons.filter(l=>isRecord(l)&&l.phase===p.name);
    if(members.length!==p.end-p.start+1) stageErrors.push(`phase ${String(p.name)}: ${members.length} lessons, expected ${p.end-p.start+1}`);
    for(const l of members) if(l.id<p.start||l.id>p.end)stageErrors.push(`phase ${String(p.name)}: lesson ${l.id} outside range`);
    for(let id=p.start;id<=p.end&&id<=10000;id++){
      if(!members.some(l=>l.id===id))stageErrors.push(`phase ${String(p.name)}: missing lesson ${id}`);
      seenLessonsInRange.set(id,(seenLessonsInRange.get(id)||0)+1);
    }
  }
  for(const l of lessons)if(isRecord(l)&&seenLessonsInRange.get(l.id)!==1)stageErrors.push(`lesson ${l.id}: phase ranges coverage != 1`);
  check('C04',stageErrors.length?'FAIL':'PASS','Lesson-to-phase coverage and explicit range consistency',{errors:sorted(distinct(stageErrors))});

  const sources=arr(root.sources), sourceIds=new Set(sources.map(s=>s?.id).filter(nonEmpty));
  const referenceErrors=[];
  function refs(obj,field,valid,path) {
    const values=obj[field];
    if(values===undefined){referenceErrors.push(`${path}.${field}: missing`);return;}
    if(!Array.isArray(values)){referenceErrors.push(`${path}.${field}: not array`);return;}
    values.forEach((v,i)=>{if(!valid.has(v))referenceErrors.push(`${path}.${field}[${i}]: unresolved ${String(v)}`);});
  }
  lessons.forEach((l,i)=>{
    if(!isRecord(l))return;
    const p=`lessons[${i}]`;
    refs(l,'relatedComponents',cid,p);refs(l,'relatedScenes',sid,p);refs(l,'referenceIds',sourceIds,p);
    if(l.deepDive!==undefined){
      if(!isRecord(l.deepDive))referenceErrors.push(`${p}.deepDive invalid`);
      else refs(l.deepDive,'referenceIds',sourceIds,`${p}.deepDive`);
    }
  });
  components.forEach((c,i)=>{
    if(!isRecord(c))return;
    const p=`components[${i}]`;
    refs(c,'relatedLessons',lid,p);refs(c,'relatedScenes',sid,p);refs(c,'referenceIds',sourceIds,p);
    if(!cname.has(c.category))referenceErrors.push(`${p}.category: unknown ${String(c.category)}`);
  });
  check('C05',referenceErrors.length?'FAIL':'PASS','Existing reference targets and component categories',{errors:sorted(referenceErrors)});

  const quizErrors=[];
  lessons.forEach((l,i)=>{
    if(!isRecord(l))return;
    if(!Array.isArray(l.opts)||l.opts.length<2||!Number.isInteger(l.a)||l.a<0||l.a>=l.opts.length)
      quizErrors.push(`lessons[${i}]: quiz options or correct-answer index invalid`);
  });
  check('C06',quizErrors.length?'FAIL':'PASS','Lesson quiz choices and correct-answer indexes',{errors:sorted(quizErrors)});
  const metaErrors=[];
  if(!isRecord(root.meta))metaErrors.push('meta missing/invalid');
  else{
    if(root.meta.isPreview!==false)metaErrors.push('meta.isPreview must be false');
    if(!nonEmpty(root.meta.knowledgeRevision))metaErrors.push('meta.knowledgeRevision missing');
  }
  check('C07',metaErrors.length?'FAIL':'PASS','Published catalog metadata',{errors:metaErrors});

  const lc=new Set(lessons.flatMap(l=>isRecord(l)?arr(l.relatedComponents).map(c=>`${l.id}|${c}`):[]));
  const cl=new Set(components.flatMap(c=>isRecord(c)?arr(c.relatedLessons).map(l=>`${l}|${c.id}`):[]));
  const mutual=[...lc].filter(x=>cl.has(x)).length;
  const unilateral=[...new Set([...lc,...cl])].filter(x=>!(lc.has(x)&&cl.has(x))).length;
  const linkStats={lessonToComponent:lc.size,componentToLesson:cl.size,mutual,unilateral};
  if(unilateral>0)warn('W01','Directional lesson/component recommendations are asymmetric; preserve meaning and require human review; do not auto-merge.',{statistics:linkStats});
  const resourceIds=distinct(lessons.filter(isRecord).map(l=>l.resourceId).filter(x=>x!==undefined));
  const resources=arr(root.resources);
  const explicitIds=resources.filter(r=>isRecord(r)&&Object.hasOwn(r,'id')).length;
  warn('W02','Legacy numeric resourceId has no approved foreign-key semantics; do not invent resource IDs or migrate by implicit array position.',{
    resourceIdValues:sorted(resourceIds), resourceRecords:resources.length, resourcesWithExplicitId:explicitIds
  });
  const deepDiveLessons=lessons.filter(l=>isRecord(l)&&isRecord(l.deepDive)).length;
  // Each test has its own evidence and prerequisite set. In particular, a
  // failed quiz (C06) must not imply that the source was unreadable (T01) or
  // that its identifier namespace was invalid (T02).
  const statusOf=(ids)=>checks.some(c=>ids.includes(c.id)&&c.status==='FAIL')?'FAIL':'PASS';
  const sourceReady=statusOf(['C01'])==='PASS';
  const evidence={
    T01:{checks:['C01'],status:statusOf(['C01'])},
    T02:{checks:['C03'],status:sourceReady?statusOf(['C03']):'BLOCKED'},
    T03:{checks:['C02','C04','C05','C06','C07'],status:sourceReady?statusOf(['C02','C04','C05','C06','C07']):'BLOCKED'}
  };
  const testCases=Object.entries(TC).map(([id,title])=>({
    id,title,
    status:evidence[id]?.status??(id==='T10'?'BLOCKED':'NOT_RUN'),
    scope:evidence[id]?'STATIC_ONLY':null,
    evidenceChecks:evidence[id]?.checks??[],
    note:id==='T10'?'P1.3 real user record validation pending':
      evidence[id]?'Static catalog audit only; no migration executed':'No migration engine or verified mapping available'
  }));
  return {
    schemaVersion:'1.0',tool:'v8-migration-static-readonly-audit',
    baseline:{expected:EXPECTED,observed}, checks,warnings,
    statistics:{...linkStats,deepDiveLessons,sourceRecords:sources.length,resourceRecords:resources.length},
    testCases,
    migrationReadiness:{status:'BLOCKED',reasons:[
      'P1.3 real browser learning records not verified',
      'LegacyIdMapping not verified or implemented',
      'Migration engine not implemented',
      'Production migration not approved'
    ]}
  };
}
