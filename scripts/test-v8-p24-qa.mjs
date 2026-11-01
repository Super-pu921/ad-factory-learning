import assert from "node:assert/strict";
import fs from "node:fs";
const dir="v8-p24-qa/";
const read=path=>fs.readFileSync(path,"utf8");
const expected=["README.md","app.js","bulk-lab.js","customer-order-lab.js","data.json","demos.js","index.html","missions.js","order-lab.js","styles.css","transaction-lab.js"];
assert.deepEqual(fs.readdirSync(dir).sort(),expected,"QA only contains expected self-contained files");
const idx=read(dir+"index.html");
assert.match(idx,/P2\.4 独立 QA 预览/);
assert.match(idx,/customer-order-lab\.js/);
assert.match(idx,/src="\.\/app\.js"/);
assert.match(idx,/href="\.\/styles\.css"/);
assert.doesNotMatch(idx,/serviceWorker|manifest\.webmanifest|src="\.\/sw\.js"/,"QA must never register a Service Worker");
for(const file of ["styles.css","data.json","demos.js","customer-order-lab.js"]){
 assert.equal(read(dir+file),read(file),"QA copy must match development branch source "+file);
}
const transformations={
 "app.js":[["const STORAGE='adFactoryLearning.v8.production';","const STORAGE='adFactoryLearning.v8.p24.qa';"],["const OFFICIAL_STORAGE='adFactoryLearning.v2';","const OFFICIAL_STORAGE='adFactoryLearning.v2.p24-qa-disabled';"],["document.title=type==='home'?'学习工作台 V8 · 知识扩展版':($('#view h1')?.textContent||'学习工作台')+' · V8 正式版';","document.title=type==='home'?'学习工作台 V8 · P2.4 QA 预览':($('#view h1')?.textContent||'学习工作台')+' · V8 P2.4 QA 预览';"]],
 "missions.js":[["const STORAGE='adFactoryLearning.v8.practice.missions';","const STORAGE='adFactoryLearning.v8.practice.missions.p24.qa';"]],
 "order-lab.js":[['const STORAGE="adFactoryLearning.v8.order-lab";','const STORAGE="adFactoryLearning.v8.order-lab.p24.qa";']],
 "bulk-lab.js":[['const KEY="adFactoryLearning.v8.bulk-lab";','const KEY="adFactoryLearning.v8.bulk-lab.p24.qa";']],
 "transaction-lab.js":[['const DB_NAME="adFactoryLearning.v8.transaction-lab";','const DB_NAME="adFactoryLearning.v8.transaction-lab.p24.qa";'],['const PROGRESS="adFactoryLearning.v8.transaction-lab.progress";','const PROGRESS="adFactoryLearning.v8.transaction-lab.progress.p24.qa";']]
};
for(const [name,items] of Object.entries(transformations)){
 let source=read(name);
 for(const [from,to] of items){assert.ok(source.includes(from),"source anchor "+name);source=source.replace(from,to);}
 assert.equal(read(dir+name),source,"no accidental QA code drift "+name);
}
assert.match(read("customer-order-lab.js"),/location\.pathname\.includes\("\/v8-p24-qa\/"\)/);
assert.deepEqual((j=>[j.lessons.length,j.components.length,j.scenes.length])(JSON.parse(read(dir+"data.json"))),[90,88,6]);
console.log("P2.4 standalone QA static checks OK: 11 files, isolated keys, exact copies, no Service Worker, 90/88/6 baseline.");
