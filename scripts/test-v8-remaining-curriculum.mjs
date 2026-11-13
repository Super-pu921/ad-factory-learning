import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {buttonPilot} from '../knowledge-catalog/button-pilot.mjs';
import {curriculum} from '../knowledge-catalog/curriculum.mjs';
import {expandedCurriculum} from '../knowledge-catalog/expanded-curriculum.mjs';
import {remainingCurriculum,remainingDefinitions,remainingSkipped} from '../knowledge-catalog/remaining-curriculum.mjs';
import {buildTeachingManifest} from './build-v8-teaching-manifest.mjs';
const json=path=>JSON.parse(readFileSync(new URL(path,import.meta.url),'utf8'));
const catalog=json('../knowledge-catalog/catalog.json'),prior=json('../knowledge-catalog/fixtures/prior-teaching-hashes.json');
const old=[buttonPilot,...curriculum,...expandedCurriculum];assert.equal(old.length,320);assert.equal(Object.keys(prior).length,320);
for(const lesson of old)assert.equal(createHash('sha256').update(JSON.stringify(lesson)).digest('hex'),prior[lesson.knowledgeId],lesson.knowledgeId+'原320主题必须保持原内容与身份');
const oldIds=new Set(old.map(d=>d.knowledgeId)),expected=catalog.entries.filter(e=>e.id===e.canonicalId&&!oldIds.has(e.id));assert.equal(expected.length,513);
assert.equal(remainingDefinitions.length,501);assert.equal(remainingCurriculum.length,501);assert.equal(remainingSkipped.length,12);
const accounted=[...remainingDefinitions,...remainingSkipped];assert.equal(new Set(accounted.map(d=>d.knowledgeId)).size,513);assert.deepEqual(accounted.map(d=>d.knowledgeId).sort(),expected.map(e=>e.id).sort());
for(const def of accounted){assert.equal(oldIds.has(def.knowledgeId),false);assert.equal(catalog.entries.find(e=>e.id===def.knowledgeId)?.name,def.title);}
for(const def of remainingSkipped){assert.equal(def.status,'SKIPPED_MISSING_INPUT');assert.ok(def.reason?.length>10&&def.requiredInput?.length>5);assert.equal(remainingCurriculum.some(l=>l.knowledgeId===def.knowledgeId),false);}
for(const lesson of remainingCurriculum){assert.equal(lesson.units.length,3);assert.equal(new Set(lesson.units.map(u=>u.objective)).size,3);assert.deepEqual(lesson.units.map(u=>u.level),['L1','L2','L3']);assert.ok(lesson.limits&&lesson.code&&lesson.expected&&lesson.implementationPath);for(const unit of lesson.units){assert.equal(unit.acceptance.length,3);assert.ok(unit.exercise&&unit.summary&&unit.pitfall);for(const ref of unit.blockRefs)assert.equal(lesson.blocks[ref.id].version,ref.version);}}
const all=[...old,...remainingCurriculum];assert.equal(new Set(all.map(l=>l.knowledgeId)).size,821);assert.equal(new Set(all.flatMap(l=>l.units.map(u=>u.id))).size,2463);
const manifest=buildTeachingManifest();assert.deepEqual(manifest,json('../knowledge-catalog/teaching-manifest.json'));assert.deepEqual(manifest.coverage,{canonicalConcepts:833,implemented:821,skipped:12,unaccounted:0});assert.equal(manifest.statistics.teachingTopics,821);assert.equal(manifest.statistics.layeredUnits,2463);assert.equal(manifest.productionMigration,'BLOCKED');assert.equal(manifest.progressPersistence,'NONE');assert.equal(manifest.statistics.formalMigratedCourses,0);
const source=readFileSync(new URL('../data.json',import.meta.url));assert.equal(createHash('sha256').update(source).digest('hex'),'cc6ea2fbdafdfe42be8bda6dac8cee3908a34f2cd4f0e4eae92598be6399ea70');
console.log(JSON.stringify({status:'PASS',originalTopicsPreserved:320,newTopics:501,skipped:12,remainingAccounted:513,totalTopics:821,units:2463,canonical:833,unaccounted:0,productionMigration:'BLOCKED',formalMigratedCourses:0}));
