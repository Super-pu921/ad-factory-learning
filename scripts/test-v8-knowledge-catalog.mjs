import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {buildKnowledgeCatalog} from './build-v8-knowledge-catalog.mjs';

const source=readFileSync(new URL('../knowledge-catalog/source/D01-D16-V1.0.md',import.meta.url));
const text=source.toString('utf8');
const hash=createHash('sha256').update(source).digest('hex');
const result=buildKnowledgeCatalog(text,hash);
const packaged=JSON.parse(readFileSync(new URL('../knowledge-catalog/catalog.json',import.meta.url),'utf8'));
assert.deepEqual(packaged,result,'packaged catalog must be reproducible from original source');
assert.deepEqual(result.statistics,{originalEntries:840,approvedAliasGroups:7,preliminaryCanonicalConcepts:833,sourceStatusUnspecified:319,authoredCourses:0,verifiedLegacyMappings:0});
for (const entry of result.entries) {
  const line=text.split(/\r?\n/)[entry.sourceLine-1];
  const cells=line.trim().slice(1,-1).split('|').map(cell=>cell.trim());
  assert.deepEqual([entry.id,entry.name,entry.type,entry.topics],[cells[0],cells[1],cells[2],cells.at(-1)]);
  assert.equal(entry.sourceStatus,cells.length===5?cells[3]:null);
}
assert.equal(result.entries.find(entry=>entry.id==='K-D13-002').canonicalId,'K-D01-012');
assert.equal(result.entries.find(entry=>entry.id==='K-D05-019').canonicalId,'K-D09-029');
assert.equal(result.entries.filter(entry=>entry.id!==entry.canonicalId).length,7);
assert.ok(result.entries.every(entry=>entry.legacyMappingStatus==='UNVERIFIED' && entry.courseStatus==='NOT_AUTHORED'));
assert.ok(result.entries.every(entry=>entry.domain!=='D17'));
assert.equal(result.migrationReadiness.status,'BLOCKED');
assert.throws(()=>buildKnowledgeCatalog(text.replace('| K-D01-001 |','| K-D01-002 |'),hash),/duplicate/);
assert.throws(()=>buildKnowledgeCatalog(text.replace(/\| K-D01-001[^\n]+/,'missing'),hash),/840/);
assert.throws(()=>buildKnowledgeCatalog(text.replace('| BASE | E |','| BASE | UNKNOWN |'),hash),/status/);
assert.throws(()=>buildKnowledgeCatalog(text.replace('| BASE | E |','| UNKNOWN | E |'),hash),/type/);
assert.throws(()=>buildKnowledgeCatalog(text.replace(/(\| K-D01-001[^\n]*)\|/,'$1'),hash),/Unterminated/);
assert.throws(()=>buildKnowledgeCatalog(text,'bad'),TypeError);
console.log('Knowledge source import OK: 840 original entries, 7 explicit aliases, 833 preliminary concepts; 319 unspecified source statuses retained; zero authored courses or verified legacy mappings; migration BLOCKED.');
