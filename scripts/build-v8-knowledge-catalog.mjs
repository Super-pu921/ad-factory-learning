/** Reproducible import of the supplied catalog. No course authoring or user migration. */
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';

const domainCounts=[22,26,21,53,60,40,30,62,54,32,51,70,45,85,62,127];
const aliasPairs=[
  ['K-D05-019','K-D09-029'],['K-D06-019','K-D04-053'],
  ['K-D08-028','K-D16-093'],['K-D04-044','K-D08-001'],
  ['K-D13-002','K-D01-012'],['K-D08-053','K-D13-021'],
  ['K-D16-063','K-D06-038']
];

export function buildKnowledgeCatalog(markdown,sourceSha256) {
  if (typeof markdown !== 'string' || !/^[a-f0-9]{64}$/i.test(sourceSha256)) throw new TypeError('Catalog text and source SHA-256 are required');
  const entries=[];
  const ids=new Set();
  const canonical=new Map(aliasPairs);
  for (const [index,line] of markdown.split(/\r?\n/).entries()) {
    if (!/^\|\s*K-D\d{2}-\d{3}\s*\|/.test(line)) continue;
    if (!line.trim().endsWith('|')) throw new Error(`Unterminated source table at line ${index+1}`);
    const cells=line.trim().slice(1,-1).split('|').map(cell=>cell.trim());
    if (![4,5].includes(cells.length)) throw new Error(`Unsupported source table at line ${index+1}`);
    const [id,name,type]=cells;
    const status=cells.length===5?cells[3]:null;
    const topics=cells.at(-1);
    if (!/^K-D(?:0[1-9]|1[0-6])-\d{3}$/.test(id) || ids.has(id) || !name || !topics) throw new Error(`Invalid or duplicate catalog entry at line ${index+1}`);
    if (!['BASE','COMPOUND','PATTERN','BUSINESS','ENGINEERING'].includes(type)) throw new Error(`Invalid source type at line ${index+1}`);
    if (status!==null && !['E','D','N','R'].includes(status)) throw new Error(`Invalid source status at line ${index+1}`);
    ids.add(id);
    entries.push({id,name,type,domain:id.slice(2,5),sourceStatus:status,topics,sourceLine:index+1,
      canonicalId:canonical.get(id)||id,legacyMappingStatus:'UNVERIFIED',courseStatus:'NOT_AUTHORED'});
  }
  if (entries.length!==840) throw new Error(`Expected 840 original entries, found ${entries.length}`);
  const domains=domainCounts.map((expected,index)=>{
    const id=`D${String(index+1).padStart(2,'0')}`;
    const observed=entries.filter(entry=>entry.domain===id).length;
    if (observed!==expected) throw new Error(`${id}: expected ${expected}, found ${observed}`);
    for(let n=1;n<=expected;n++) if(!ids.has(`K-${id}-${String(n).padStart(3,'0')}`)) throw new Error(`${id}: missing original ID ${n}`);
    return {id,entries:observed};
  });
  for (const [alias,main] of aliasPairs) if(!ids.has(alias)||!ids.has(main)) throw new Error('Approved alias endpoint is missing');
  return {
    schemaVersion:'1.0',scope:'ORIGINAL_KNOWLEDGE_DIRECTORY_ONLY',
    source:{path:'source/D01-D16-V1.0.md',sha256:sourceSha256},
    statistics:{originalEntries:840,approvedAliasGroups:7,preliminaryCanonicalConcepts:new Set(entries.map(entry=>entry.canonicalId)).size,
      sourceStatusUnspecified:entries.filter(entry=>entry.sourceStatus===null).length,authoredCourses:0,verifiedLegacyMappings:0},
    domains,aliases:aliasPairs.map(([aliasId,canonicalId])=>({aliasId,canonicalId,basis:'V2.0 confirmed seven alias groups'})),
    entries,
    migrationReadiness:{status:'BLOCKED',reasons:['Legacy mappings not verified','Course model and content not implemented','P1.3 real user records not verified']}
  };
}

if (process.argv[1] && import.meta.url===pathToFileURL(process.argv[1]).href) {
  try {
    const bytes=readFileSync(new URL('../knowledge-catalog/source/D01-D16-V1.0.md',import.meta.url));
    const catalog=buildKnowledgeCatalog(bytes.toString('utf8'),createHash('sha256').update(bytes).digest('hex'));
    process.stdout.write(JSON.stringify(catalog,null,2)+'\n');
  } catch(error) {
    process.stderr.write(`Catalog import failed: ${error.message}\n`);
    process.exitCode=1;
  }
}
