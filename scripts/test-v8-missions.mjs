import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import vm from "node:vm";

const source=readFileSync(new URL("../missions.js",import.meta.url),"utf8");
const records=new Map();
const localStorage={
 getItem:key=>records.get(key)??null,
 setItem:(key,value)=>records.set(key,String(value))
};
let stageInputs={};
const root={
 innerHTML:"",
 querySelectorAll:()=>Object.entries(stageInputs).map(([name,value])=>({name,value})),
 querySelector:()=>({setAttribute(){},focus(){},textContent:""})
};
const document={getElementById:id=>id==="missionStage"?root:null};
function load(){
 const window={};
 vm.runInNewContext(source,{window,localStorage,document,console});
 assert.ok(window.V8Missions,"missions module missing");
 return window.V8Missions;
}
let missions=load();
assert.deepEqual(Array.from(missions.ids),[
 "validation","dependent-select","formula-builder","editable-table",
 "permission-matrix","kanban-board"
]);
const cases=[
 ["validation",0,{value:""},"check",true],
 ["validation",0,{value:"hello"},"check",false],
 ["validation",1,{value:"瑞冠口腔"},"check",true],
 ["validation",1,{value:" "},"check",false],
 ["dependent-select",0,{choice:"a"},"check",true],
 ["dependent-select",0,{choice:"b"},"check",false],
 ["dependent-select",1,{choice:"b"},"check",true],
 ["dependent-select",2,{choice:"reject"},"check",true],
 ["formula-builder",0,{choice:"long",value:"0.4"},"check",true],
 ["formula-builder",1,{choice:"area",value:"1.1"},"check",true],
 ["formula-builder",2,{choice:"review"},"check",true],
 ["formula-builder",2,{choice:"area",value:"0.88"},"check",false],
 ["editable-table",0,{value:"-1"},"check",true],
 ["editable-table",1,{value:"3"},"check",true],
 ["editable-table",2,{value:"9"},"cancel",true],
 ["editable-table",2,{value:"9"},"check",false],
 ["permission-matrix",0,{choice:"deny"},"check",true],
 ["permission-matrix",1,{choice:"allow"},"check",true],
 ["permission-matrix",2,{choice:"deny"},"check",true],
 ["kanban-board",0,{choice:"production"},"check",true],
 ["kanban-board",1,{choice:"reject"},"check",true],
 ["kanban-board",2,{choice:"pending-log",value:"字壳损坏",times:"2"},"check",true],
 ["kanban-board",2,{choice:"pending-log",value:"",times:"2"},"check",false],
];
for(const [id,step,values,action,expected] of cases){
 assert.equal(missions.grade(id,step,values,action).ok,expected,id+" step "+step);
}
assert.equal(missions.count(),0);
assert.match(missions.catalog(),/业务交互|业务实训/);
for(const id of missions.ids){
 assert.match(missions.page(id),/第 1/);
 assert.match(missions.page(id),/验证本步/);
}
for(const id of missions.ids){
 const n=missions.stepsFor(id);
 for(let step=0;step<n;step++){
  const good=cases.find(c=>c[0]===id&&c[1]===step&&c[4]===true);
  assert.ok(good,id+" lacks passing fixture for step "+step);
  stageInputs=good[2];
  const action=good[3];
  const handled=missions.handleClick({
   target:{closest:()=>({dataset:{missionId:id,missionAction:action}})},
   preventDefault(){}
  });
  assert.equal(handled,true,id+" click");
 }
 assert.match(missions.page(id),/实训完成/,id+" completed page");
}
assert.equal(missions.count(),6,"all six missions should persist");
assert.equal(records.has("adFactoryLearning.v8.production"),false,"production learning key must not be written");
assert.equal(records.has("adFactoryLearning.v8.practice.missions"),true,"mission progress should be persisted to an independent key");
missions=load();
assert.equal(missions.count(),6,"progress survives module reload");
console.log("Mission QA passed: 6 missions, 17 ordered steps, "+cases.length+" grade fixtures, persistence, reload and isolation.");
