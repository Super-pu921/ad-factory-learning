import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {buttonPilot,calculateDemoQuote,createSubmissionGate} from '../knowledge-catalog/button-pilot.mjs';

const directory=JSON.parse(readFileSync(new URL('../knowledge-catalog/catalog.json',import.meta.url),'utf8'));
assert.equal(buttonPilot.knowledgeId,'K-D01-001');
assert.ok(directory.entries.some(entry=>entry.id===buttonPilot.knowledgeId));
assert.equal(buttonPilot.status,'TEACHING_SAMPLE');
assert.deepEqual(buttonPilot.units.map(unit=>[unit.level,unit.difficulty]),[['L1','E1'],['L2','E2'],['L3','E2']]);
for(const unit of buttonPilot.units) {
  assert.ok(unit.objective && unit.exercise && unit.pitfall && unit.summary);
  assert.equal(unit.acceptance.length,3);
  for(const ref of unit.blockRefs) assert.equal(buttonPilot.blocks[ref.id].version,ref.version,'sample content references must pin exact versions');
}
assert.throws(()=>{buttonPilot.units[0].blockRefs[0].version='latest';},TypeError);
assert.deepEqual(calculateDemoQuote('2','120.50'),{quantity:2,unitCents:12050,totalCents:24100,formatted:'241.00'});
assert.equal(calculateDemoQuote('3','0.10').formatted,'0.30');
assert.equal(calculateDemoQuote('1','0').formatted,'0.00');
assert.equal(calculateDemoQuote('10000','999999.99').formatted,'9999999900.00');
for(const qty of ['0','-1','1.1','1e2','10001','',null]) assert.throws(()=>calculateDemoQuote(qty,'1'));
for(const price of ['-1','1.001','1e2','1000000','NaN','',null]) assert.throws(()=>calculateDemoQuote('1',price));
const gate=createSubmissionGate();let finish,runs=0;
const first=gate(()=>{runs++;return new Promise(resolve=>{finish=resolve;});});
assert.deepEqual(await gate(()=>{runs++;}),{executed:false});
finish('done');assert.deepEqual(await first,{executed:true,value:'done'});assert.equal(runs,1);
await assert.rejects(gate(()=>{throw new Error('synthetic failure');}),/synthetic failure/);
assert.deepEqual(await gate(()=>42),{executed:true,value:42},'failure must release the gate');
for(const path of ['../knowledge-catalog/button-pilot.mjs','../knowledge-catalog/catalog-app.mjs']) {
  const source=readFileSync(new URL(path,import.meta.url),'utf8');
  assert.doesNotMatch(source,/\b(localStorage|indexedDB|sessionStorage)\s*[.[]/,'sample must not access persistent learning storage');
  assert.doesNotMatch(source,/\.innerHTML\s*=/,'catalog strings must not become executable HTML');
}
console.log('Knowledge sample OK: three independent L1/L2/L3 units, pinned block reuse, exact cents, negative inputs and concurrent/error gate; no stored progress.');
