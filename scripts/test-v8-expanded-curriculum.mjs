import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {buttonPilot} from '../knowledge-catalog/button-pilot.mjs';
import {curriculum} from '../knowledge-catalog/curriculum.mjs';
import {expandedCurriculum,expandedDefinitions} from '../knowledge-catalog/expanded-curriculum.mjs';
import {remainingCurriculum} from '../knowledge-catalog/remaining-curriculum.mjs';
import {buildTeachingManifest} from './build-v8-teaching-manifest.mjs';
const catalog=JSON.parse(readFileSync(new URL('../knowledge-catalog/catalog.json',import.meta.url),'utf8'));
const all=[buttonPilot,...curriculum,...expandedCurriculum];
assert.equal(expandedDefinitions.length,255);assert.equal(all.length,320);
assert.equal(new Set(all.map(item=>item.knowledgeId)).size,320);
assert.equal(new Set(all.flatMap(item=>item.units.map(unit=>unit.id))).size,960);
for(const item of expandedCurriculum) {
  const source=catalog.entries.find(entry=>entry.id===item.knowledgeId);
  assert.equal(source?.name,item.title);assert.equal(source.canonicalId,source.id);
  assert.equal(item.units.length,3);assert.equal(new Set(item.units.map(unit=>unit.objective)).size,3);
  assert.ok(item.limits&&item.expected&&item.code&&item.implementationPath);
  assert.deepEqual(item.units.map(unit=>unit.level),['L1','L2','L3']);
  for(const unit of item.units){assert.equal(unit.acceptance.length,3);assert.ok(unit.exercise&&unit.summary&&unit.pitfall);for(const ref of unit.blockRefs)assert.equal(item.blocks[ref.id].version,ref.version);}
}
const manifest=buildTeachingManifest();assert.deepEqual(manifest,JSON.parse(readFileSync(new URL('../knowledge-catalog/teaching-manifest.json',import.meta.url),'utf8')));
assert.equal(manifest.statistics.teachingTopics,320+remainingCurriculum.length);assert.equal(manifest.statistics.layeredUnits,960+remainingCurriculum.length*3);
assert.equal(manifest.productionMigration,'BLOCKED');assert.equal(manifest.progressPersistence,'NONE');
assert.throws(()=>{expandedCurriculum[0].units[0].objective='mutate';},TypeError);
console.log('Expanded curriculum PASS: 320 unique canonical teaching components, 960 independent layered objectives and pinned units; reproducible manifest; migration BLOCKED.');
