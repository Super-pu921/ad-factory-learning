import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';

const source=fs.readFileSync(new URL('../bulk-lab.js',import.meta.url),'utf8');
const mem=new Map();
const localStorage={getItem:k=>mem.get(k)||null,setItem:(k,v)=>mem.set(k,String(v))};
let currentDialog=null,phrase='',errorText='';
const divs={bulklabRoot:{innerHTML:'',appendChild(d){currentDialog=d;},querySelector:()=>({focus(){}})},bulklabTable:{innerHTML:''},bulklabSelected:{textContent:''},bulklabFeedback:{textContent:''}};
const document={
 getElementById:id=>divs[id]||null,
 querySelector:selector=>selector==='.bulklab-dialog'?currentDialog:null,
 createElement:tag=>{
  assert.equal(tag,'dialog');
  let onclose=()=>{};
  const fake={returnValue:'',className:'',innerHTML:'',setAttribute(){},showModal(){this.open=true;},
   querySelector:sel=>{
    if(sel==='#bulklabPhrase')return {get value(){return phrase}};
    if(sel==='#bulklabDialogError')return {set textContent(x){errorText=x}};
    return {focus(){}};
   },addEventListener:(type,fn)=>{if(type==='close')onclose=fn;},
   close(value=''){this.open=false;this.returnValue=value;onclose();},remove(){currentDialog=null;}
  };
  return fake;
 }
};
function load(){const win={};vm.runInNewContext(source,{window:win,document,localStorage,console});return win.V8BulkLab;}
const lab=load();
assert.ok(lab);assert.equal(lab.orders.length,8);assert.equal(lab.storageKey,'adFactoryLearning.v8.bulk-lab');
const take=()=>JSON.parse(mem.get(lab.storageKey)||'{}');
const click=(action,id)=>lab.click({target:{closest:()=>({dataset:{bulkAction:action,id}})},preventDefault(){}});
const select=(id,checked)=>lab.change({target:{dataset:{bulkId:id},checked}});
assert.match(lab.page(),/批量选择与危险操作确认/);
assert.equal(lab.evaluate(0,'verify',{page:1,selected:['B-2001','B-2002']}),true);
assert.equal(lab.evaluate(0,'verify',{page:1,selected:['B-2001','B-2003']}),false);
click('verify');assert.equal(take().step,0,'cannot advance without selection');
select('B-2001',true);select('B-2002',true);
click('verify');assert.equal(take().step,1);
click('select-page');assert.equal(take().step,1,'cannot select page2 without navigation');
click('next');assert.equal(take().page,2);
click('select-page');assert.equal(take().step,2);
assert.equal(take().selected.length,6,'must keep 2 selected from page 1 and only 4 from page 2');
select('B-2005',false);assert.equal(take().step,3);assert.equal(take().selected.length,5);
click('open-danger');assert.ok(currentDialog?.open);assert.equal(take().archived.length,0);
click('cancel-danger');assert.equal(take().step,4);assert.equal(take().archived.length,0,'cancel does not write');
click('open-danger');assert.ok(currentDialog?.open);
phrase='确认归档 6';click('confirm-danger');
assert.equal(take().step,4);assert.equal(take().archived.length,0,'incorrect phrase cannot commit');
assert.ok(errorText.includes('不正确'));
phrase='确认归档 5';click('confirm-danger');
assert.equal(take().step,5);assert.equal(take().archived.length,5);
assert.equal(take().selected.length,0);
assert.equal(take().logs.filter(x=>x.includes('确认归档')).length,1);
click('confirm-danger');
assert.equal(take().archived.length,5,'repeated confirm must be ignored');
assert.equal(take().logs.filter(x=>x.includes('确认归档')).length,1,'only one transaction');
click('undo');assert.equal(take().step,6);assert.equal(take().archived.length,0);
assert.equal(take().snapshot.length,5);assert.ok(take().logs.includes('已撤销 5 条模拟归档'));
assert.match(lab.page(),/六步训练已完成/);
const second=load();assert.match(second.page(),/六步训练已完成/,'progress survives reload');
for(const k of ['adFactoryLearning.v8.production','adFactoryLearning.v8.practice.missions','adFactoryLearning.v8.order-lab'])assert.equal(mem.has(k),false,k+' must remain untouched');
click('restart');assert.equal(take().step,0);assert.equal(take().selected.length,0);
console.log('P2.2 Node QA passed: 8 fictional records; 6 steps; page-scoped selection, cancel, exact confirm, double-submit guard, undo, reload and storage isolation.');
