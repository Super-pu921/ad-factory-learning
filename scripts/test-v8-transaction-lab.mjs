import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const code=fs.readFileSync(new URL('../transaction-lab.js',import.meta.url),'utf8');
const mem=new Map(),localStorage={getItem:k=>mem.get(k)||null,setItem:(k,v)=>mem.set(k,String(v))};
const win={};
vm.runInNewContext(code,{window:win,localStorage,indexedDB:{},document:{},queueMicrotask:()=>{}});
const lab=win.V8TransactionLab;assert.ok(lab);
assert.equal(lab.storage.database,'adFactoryLearning.v8.transaction-lab');
assert.equal(lab.storage.progress,'adFactoryLearning.v8.transaction-lab.progress');
assert.match(lab.page(),/数据关联与事务回滚/);
for(const id of [30,49,50,51,53,62,80])assert.match(lab.lessonLink(id),/transaction-lab/);
const tests=[
[0,'inspect',{}, {quantity:12,logCount:0},true],
[1,'committed',{}, {quantity:8,logCount:1,logs:[{requestId:'OUT-001'}]},true],
[1,'committed',{}, {quantity:7,logCount:1,logs:[{requestId:'OUT-001'}]},false],
[2,'insufficient',{quantity:8,logCount:1},{quantity:8,logCount:1},true],
[2,'insufficient',{quantity:8,logCount:1},{quantity:7,logCount:1},false],
[3,'aborted',{quantity:8,logCount:1},{quantity:8,logCount:1},true],
[3,'aborted',{quantity:8,logCount:1},{quantity:6,logCount:1},false],
[3,'committed',{quantity:8,logCount:1},{quantity:8,logCount:1},false],
[4,'committed',{}, {quantity:6,logCount:2,logs:[{requestId:'OUT-001'},{requestId:'OUT-002'}]},true],
[5,'duplicate',{quantity:6,logCount:2},{quantity:6,logCount:2},true],
[5,'duplicate',{quantity:6,logCount:2},{quantity:4,logCount:3},false]
];
for(const [s,kind,before,after,yes] of tests)assert.equal(lab.grade(s,kind,before,after),yes,'stage '+s+' '+kind);
for(const key of ['adFactoryLearning.v8.production','adFactoryLearning.v8.practice.missions','adFactoryLearning.v8.order-lab','adFactoryLearning.v8.bulk-lab'])assert.equal(mem.has(key),false);
const db=JSON.parse(fs.readFileSync('data.json','utf8'));assert.deepEqual([db.lessons.length,db.components.length,db.scenes.length],[90,88,6]);
const app=fs.readFileSync('app.js','utf8'),idx=fs.readFileSync('index.html','utf8'),sw=fs.readFileSync('sw.js','utf8');
assert.ok(app.includes('window.V8TransactionLab.page()'));assert.ok(app.includes('window.V8TransactionLab?.click(e)'));
assert.ok(idx.includes('src="./transaction-lab.js"'));assert.ok(sw.includes("'./transaction-lab.js'"));
assert.ok(sw.includes('ad-factory-learning-v8-p23-20261101'));
console.log('P2.3 unit and integration checks passed: '+tests.length+' stage cases; baseline 90/88/6.');
