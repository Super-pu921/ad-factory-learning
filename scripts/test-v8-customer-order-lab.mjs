import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
const code=fs.readFileSync(new URL("../customer-order-lab.js",import.meta.url),"utf8");
const memory=new Map();
const localStorage={getItem:key=>memory.get(key)??null,setItem:(key,value)=>memory.set(key,String(value)),removeItem:key=>memory.delete(key)};
const win={};
vm.runInNewContext(code,{window:win,localStorage,location:{pathname:"/"},queueMicrotask:()=>{}});
const lab=win.V8CustomerOrderLab;
assert.ok(lab,"module export");
assert.equal(lab.storage.database,"adFactoryLearning.v8.customer-order-lab");
assert.equal(lab.storage.progress,"adFactoryLearning.v8.customer-order-lab.progress");
assert.match(lab.page(),/客户 → 报价 → 订单/);
const make=(step)=>{
 const data={customers:[],quotes:[],orders:[]};
 if(step>=1)data.customers.push({customerId:"C-001",name:"教学客户甲"});
 if(step>=4)data.quotes.push({quoteId:"Q-001",customerId:"C-001",productName:"示例标识",quantity:2,status:step>=7?"converted":"ready"});
 if(step>=7)data.orders.push({orderId:"O-001",quoteId:"Q-001",status:"created"});
 return data;
};
for(let i=0;i<=8;i++)assert.equal(lab.validForStep(i,make(i)),true,"step "+i+" fixture");
const results=[
 {kind:"committed"},{kind:"missing-customer"},{kind:"invalid-quote"},
 {kind:"committed"},{kind:"queried"},{kind:"aborted",error:"ConstraintError"},
 {kind:"committed"},{kind:"duplicate"}
];
let passes=0;
for(let i=0;i<8;i++){
 const before=make(i),after=make(i+1);
 const lookup=i===4?{customer:{customerId:"C-001"},quotes:[{quoteId:"Q-001",customerId:"C-001"}]}:undefined;
 assert.equal(lab.grade(i,results[i],before,after,lookup),true,"grade positive "+i);passes++;
 assert.equal(lab.grade(i,{kind:"wrong"},before,after,lookup),false,"grade wrong result "+i);passes++;
 if(i>=1&&i!==3&&i!==6){
  const tampered=structuredClone(after);tampered.orders.push({orderId:"O-999",quoteId:"Q-001",status:"created"});
  assert.equal(lab.grade(i,results[i],before,tampered,lookup),false,"grade fake extra order "+i);passes++;
 }
}
assert.equal(lab.grade(5,{kind:"aborted",error:"AbortError"},make(5),make(6)),false,"rollback must be ConstraintError");
assert.equal(lab.grade(4,{kind:"queried"},make(4),make(5),{customer:{customerId:"C-404"},quotes:[]}),false,"query must reflect actual foreign key");
assert.equal(lab.grade(7,{kind:"duplicate"},make(7),make(6)),false,"duplicate must not change data");
const app=fs.readFileSync("app.js","utf8");
const index=fs.readFileSync("index.html","utf8");
const sw=fs.readFileSync("sw.js","utf8");
assert.match(app,/segments\[1\]==='customer-order-lab'/);
assert.match(app,/window.V8CustomerOrderLab\?\.click\(e\)/);
assert.match(index,/customer-order-lab\.js/);
assert.match(sw,/customer-order-lab\.js/);
assert.match(sw,/ad-factory-learning-v8-p24-20261101/);
const db=JSON.parse(fs.readFileSync("data.json","utf8"));
assert.deepEqual([db.lessons.length,db.components.length,db.scenes.length],[90,88,6]);
for(const key of ["adFactoryLearning.v8.production","adFactoryLearning.v8.practice.missions","adFactoryLearning.v8.order-lab","adFactoryLearning.v8.bulk-lab","adFactoryLearning.v8.transaction-lab.progress"]){
 assert.equal(memory.has(key),false,"previous storage unchanged "+key);
}
const winQA={};
vm.runInNewContext(code,{window:winQA,localStorage,location:{pathname:"/v8-p24-qa/index.html"},queueMicrotask:()=>{}});
assert.equal(winQA.V8CustomerOrderLab.storage.database,"adFactoryLearning.v8.customer-order-lab.qa");
assert.equal(winQA.V8CustomerOrderLab.storage.progress,"adFactoryLearning.v8.customer-order-lab.qa.progress");
console.log("P2.4 unit checks OK: "+passes+" grade assertions, 8 fixtures, QA/prod storage isolation and route/SW checks.");
