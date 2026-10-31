import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const source=readFileSync(new URL('../order-lab.js',import.meta.url),'utf8');
const storage=new Map();
const localStorage={getItem:k=>storage.get(k)??null,setItem:(k,v)=>storage.set(k,String(v))};
let dialog;
const stage={innerHTML:'',querySelector:()=>({focus(){}}),appendChild(x){dialog=x}};
const table={innerHTML:''},message={textContent:''};
const document={
  getElementById:id=>({'orderLabRoot':stage,'orderLabTable':table,'orderLabMessage':message}[id]||null),
  querySelector:()=>dialog,
  createElement:tag=>{
    assert.equal(tag,'dialog');
    const callbacks={};
    return {className:'',innerHTML:'',setAttribute(){},querySelector:()=>({focus(){}}),addEventListener:(name,fn)=>{callbacks[name]=fn;},
      showModal(){this.isOpen=true;},close(){this.isOpen=false;callbacks.close?.();},remove(){this.removed=true;}}
  }
};
const win={};
vm.runInNewContext(source,{window:win,document,localStorage});
const lab=win.V8OrderLab;
assert.ok(lab);
assert.equal(lab.storageKey,'adFactoryLearning.v8.order-lab');
assert.equal(lab.orders.length,12);
assert.equal(lab.rows().total,12);
assert.equal(lab.rows('S-1008').total,1);
assert.equal(lab.rows('','生产中').total,6);
assert.equal(lab.rows('示例广告','生产中').total,3);
assert.equal(lab.rows('','生产中',99).page,2);
assert.equal(lab.rows('missing').total,0);
assert.equal(lab.rows('s-1008').total,1);

const positive=[
[0,'verify',{q:'S-1008',status:'',page:1},''],
[1,'verify',{q:'',status:'生产中',page:1},''],
[2,'verify',{q:'示例广告',status:'生产中',page:1},''],
[3,'clear',{q:'',status:'',page:1},''],
[4,'next',{q:'',status:'生产中',page:2},''],
[5,'detail-close',{q:'',status:'生产中',page:2},'S-1008']
];
for(const [step,action,s,id] of positive)assert.equal(lab.passes(step,action,s,id),true,'valid step '+step);
assert.equal(lab.passes(0,'verify',{q:'wrong',status:'',page:1}),false);
assert.equal(lab.passes(1,'verify',{q:'',status:'待生产',page:1}),false);
assert.equal(lab.passes(2,'verify',{q:'示例广告',status:'',page:1}),false);
assert.equal(lab.passes(4,'next',{q:'',status:'生产中',page:1}),false);
assert.equal(lab.passes(5,'detail-close',{q:'',status:'生产中',page:1},'S-1008'),false);

const input=(id,value)=>lab.input({target:{id,value}});
const click=(action,id='')=>lab.click({target:{closest:()=>({dataset:{orderlab:action,id}})},preventDefault(){}});
assert.match(lab.page(),/订单列表完整交互/);
assert.match(lab.lessonLink(51),/order-lab/);
assert.equal(lab.lessonLink(12),'');
input('orderLabQuery','incorrect');click('verify');
assert.equal(JSON.parse(storage.get(lab.storageKey)).step,0,'wrong answer cannot advance');
input('orderLabQuery','S-1008');click('verify');
assert.equal(JSON.parse(storage.get(lab.storageKey)).step,1);
input('orderLabStatus','生产中');click('verify');
assert.equal(JSON.parse(storage.get(lab.storageKey)).step,2);
input('orderLabQuery','示例广告');click('verify');
assert.equal(JSON.parse(storage.get(lab.storageKey)).step,3);
click('clear');
assert.equal(JSON.parse(storage.get(lab.storageKey)).step,4);
input('orderLabStatus','生产中');click('next');
assert.equal(JSON.parse(storage.get(lab.storageKey)).step,5);
assert.equal(JSON.parse(storage.get(lab.storageKey)).page,2);
click('detail','S-1008');
assert.ok(dialog.isOpen,'detail dialog must open');
assert.match(dialog.innerHTML,/S-1008/);
dialog.close();
assert.equal(JSON.parse(storage.get(lab.storageKey)).step,6);
assert.equal(storage.has('adFactoryLearning.v8.production'),false,'must never touch official progress');
assert.equal(storage.has('adFactoryLearning.v8.practice.missions'),false,'must never touch existing missions');
assert.match(lab.page(),/已完成全部六步/);
const again={};vm.runInNewContext(source,{window:again,document,localStorage});
assert.match(again.V8OrderLab.page(),/已完成全部六步/,'completion must survive reload');
console.log('P2.1 OK: 12 demo orders, six graded actions, negative checks, modal close, persistence, isolation.');
