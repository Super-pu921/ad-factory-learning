(function makeModule(){
"use strict";
const DB_NAME="adFactoryLearning.v8.transaction-lab.p23.qa";
const PROGRESS="adFactoryLearning.v8.transaction-lab.progress.p23.qa";
const MATERIAL="A-01";
const titles=["理解物料与流水关联","成功提交一次出库","拒绝库存不足","模拟流水写入失败并回滚","恢复后重试提交","同一请求不能重复扣库存"];
const goals=[
"查看 A-01 物料库存为 12 件、出库流水为 0 条，理解两个表通过 materialId 关联。",
"点击「模拟出库 4 件」，在同一个事务内更新库存并新增 OUT-001 流水。",
"尝试出库 20 件。系统必须拒绝，库存与流水都不改变。",
"先更新库存，再故意让流水写入发生主键冲突。整个 IndexedDB 事务必须自动回滚。",
"点击「重新出库 2 件」，成功新增 OUT-002 流水，库存从 8 变为 6。",
"使用同一个请求号 OUT-002 再次请求出库 2 件，验证只处理一次。"
];
const escapeHTML=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const progress=()=>{try{const v=JSON.parse(localStorage.getItem(PROGRESS)||"null");return Number.isInteger(v?.step)&&v.step>=0&&v.step<=6?{step:v.step,msg:String(v.msg||"").slice(0,250)}:{step:0,msg:""};}catch{return {step:0,msg:""}}};
let session=progress(),working=false;
function save(){try{localStorage.setItem(PROGRESS,JSON.stringify(session));}catch{}}
function openDB(){
return new Promise((resolve,reject)=>{
 if(!('indexedDB' in window)){reject(new Error("当前浏览器不支持 IndexedDB"));return;}
 const request=indexedDB.open(DB_NAME,1);
 request.onupgradeneeded=()=>{
  const db=request.result;
  const materials=db.createObjectStore("materials",{keyPath:"id"});
  const movements=db.createObjectStore("movements",{keyPath:"requestId"});
  movements.createIndex("materialId","materialId",{unique:false});
  materials.put({id:MATERIAL,name:"教学材料 A",quantity:12});
 };
 request.onsuccess=()=>resolve(request.result);
 request.onerror=()=>reject(request.error||new Error("数据库初始化失败"));
 request.onblocked=()=>reject(new Error("数据库被其他窗口占用"));
});
}
async function snapshot(){
const db=await openDB();
return new Promise((resolve,reject)=>{
 let material,logs=[],failed=false;
 const tx=db.transaction(["materials","movements"],"readonly");
 tx.objectStore("materials").get(MATERIAL).onsuccess=e=>{material=e.target.result};
 tx.objectStore("movements").index("materialId").getAll(MATERIAL).onsuccess=e=>{logs=e.target.result};
 tx.oncomplete=()=>{db.close();resolve({material,logs,quantity:material?.quantity,logCount:logs.length})};
 tx.onabort=()=>{db.close();reject(tx.error||new Error("读取失败"))};
 tx.onerror=()=>{failed=true};
});
}
async function perform(requestId,quantity,injectFailure=false){
const db=await openDB();
return new Promise((resolve,reject)=>{
 let result="unknown",started=false;
 const tx=db.transaction(["materials","movements"],"readwrite");
 const materials=tx.objectStore("materials"),movements=tx.objectStore("movements");
 tx.oncomplete=()=>{db.close();resolve(result)};
 tx.onabort=()=>{db.close();resolve("aborted")};
 const get=materials.get(MATERIAL);
 get.onsuccess=()=>{
   const row=get.result;
   if(!row){tx.abort();return;}
   const unique=movements.get(requestId);
   unique.onsuccess=()=>{
     if(unique.result){result="duplicate";return;}
     if(!Number.isInteger(quantity)||quantity<=0||row.quantity<quantity){result="insufficient";return;}
     const updated=materials.put({...row,quantity:row.quantity-quantity});
     updated.onsuccess=()=>{
       if(injectFailure){
         // OUT-001 is already committed. Duplicate primary key triggers
         // ConstraintError and aborts the WHOLE transaction, including material PUT.
         movements.add({requestId:"OUT-001",materialId:MATERIAL,quantity,reason:"模拟冲突"});
       } else {
         const created=movements.add({requestId,materialId:MATERIAL,quantity,reason:"教学出库"});
         created.onsuccess=()=>{result="committed"};
       }
     };
   };
 };
});
}
function grade(stage,kind,before,after){
const shape=(qty,num)=>after.quantity===qty&&after.logCount===num;
if(stage===0)return kind==="inspect"&&shape(12,0);
if(stage===1)return kind==="committed"&&shape(8,1)&&after.logs[0].requestId==="OUT-001";
if(stage===2)return kind==="insufficient"&&shape(8,1)&&before.quantity===after.quantity&&before.logCount===after.logCount;
if(stage===3)return kind==="aborted"&&shape(8,1)&&before.quantity===after.quantity&&before.logCount===after.logCount;
if(stage===4)return kind==="committed"&&shape(6,2)&&after.logs.some(x=>x.requestId==="OUT-002");
if(stage===5)return kind==="duplicate"&&shape(6,2)&&before.quantity===after.quantity&&before.logCount===after.logCount;
return false;
}
const commands=["检查关联","模拟出库 4 件","尝试出库 20 件","模拟流水写入失败","重新出库 2 件","重复请求 OUT-002"];
function expected(step){return [[12,0],[12,0],[8,1],[8,1],[8,1],[6,2],[6,2]][step]}
function panel(snap){
const qty=snap?.quantity??"—",count=snap?.logCount??"—";
return `<div class="txlab-stats"><div><span>材料 A-01 当前库存</span><strong>${qty}</strong><small>件</small></div><div><span>对应出库流水</span><strong>${count}</strong><small>条</small></div></div><div class="txlab-flow"><span>materials / A-01</span><span aria-hidden="true">→ materialId →</span><span>movements / 出库流水</span></div><div class="txlab-tablebox"><table class="txlab-table"><thead><tr><th>请求 ID</th><th>materialId</th><th>出库数量</th></tr></thead><tbody>${snap?.logs?.length?snap.logs.map(x=>`<tr><td>${escapeHTML(x.requestId)}</td><td>${escapeHTML(x.materialId)}</td><td>${x.quantity}</td></tr>`).join(""):'<tr><td colspan="3">尚无出库流水</td></tr>'}</tbody></table></div>`;
}
function stageView(snap){
if(session.step===6)return `<h2 tabindex="-1">六步全部通过</h2><p>真实 IndexedDB 已验证：关联、原子提交、库存不足拒绝、ConstraintError 回滚、恢复重试及重复请求防护。</p>${panel(snap)}<button type="button" class="btn btn-ghost" data-tx-action="restart">清空本练习数据并重新开始</button>`;
const step=session.step;
return `<div class="txlab-steps">${titles.map((_,i)=>`<span class="${i<step?'completed':i===step?'current':''}">${i+1}</span>`).join("")}</div><p class="micro">第 ${step+1}/6 步 · 原生 IndexedDB · 仅虚构数据</p><h2 tabindex="-1">${escapeHTML(titles[step])}</h2><p class="txlab-goal">${escapeHTML(goals[step])}</p>${panel(snap)}<div class="txlab-actions"><button type="button" class="btn btn-primary" data-tx-action="next" ${working?'disabled':''}>${escapeHTML(commands[step])}</button></div><p id="txlabMessage" class="txlab-feedback" role="status" aria-live="polite">${escapeHTML(session.msg||"按当前步骤操作，系统会重新读取数据库并验证结果。")}</p>`;
}
function page(){queueMicrotask(()=>refresh());return `<div class="page-enter detail-width"><div class="breadcrumb"><a href="#/components">组件</a><span>›</span><span>事务与回滚实训</span></div><a class="back-link" href="#/components">← 返回组件目录</a><h1>数据关联与事务回滚</h1><p class="subhead">六步操作原生 IndexedDB：库存与出库流水在同一事务中提交，失败整体回滚。仅用于教学。</p><div id="txlabRoot" class="card txlab-card"><p role="status">正在读取教学数据库…</p></div><p class="micro">全部数据为虚构样本；不会访问云端、真实库存、采购、生产或报价系统。清理浏览器数据会删除练习记录。</p></div>`}
function lessonLink(id){return [30,49,50,51,53,62,80].includes(Number(id))?'<div class="related-knowledge"><strong>事务与回滚实训</strong><div><a href="#/components/transaction-lab">材料与流水关联、原子提交和失败回滚</a></div></div>':""}
async function refresh(){
const root=document.getElementById("txlabRoot");if(!root)return;
try{
 const data=await snapshot();
 if(!root.isConnected)return;
 const [requiredQty,requiredCount]=expected(session.step);
 if(data.quantity!==requiredQty||data.logCount!==requiredCount){
  root.innerHTML=`<h2>检测到教学数据与进度不一致</h2><p>可能是其他标签页完成了操作，或存储记录被清除。为避免误判，请重新开始独立练习。</p>${panel(data)}<button type="button" class="btn btn-ghost" data-tx-action="restart">重置本练习</button>`;
 }else root.innerHTML=stageView(data);
}catch(err){root.innerHTML=`<h2>教学数据库无法访问</h2><p role="alert">${escapeHTML(err?.message||String(err))}</p>`;}
}
async function reset(){
const db=await openDB();db.close();
await new Promise((resolve,reject)=>{
 const r=indexedDB.deleteDatabase(DB_NAME);
 r.onsuccess=()=>resolve();
 r.onerror=()=>reject(r.error||new Error("重置失败"));
 r.onblocked=()=>reject(new Error("请关闭其他练习标签页后重试"));
});
session={step:0,msg:""};save();await refresh();
}
async function run(){
if(working||session.step>=6)return;
working=true;
const button=document.querySelector("#txlabRoot [data-tx-action='next']");
if(button)button.disabled=true;
const stage=session.step;
try{
 const before=await snapshot();
 const target=expected(stage);
 if(before.quantity!==target[0]||before.logCount!==target[1])throw new Error("教学数据已变化，请重置练习");
 let result;
 if(stage===0)result="inspect";
 if(stage===1)result=await perform("OUT-001",4);
 if(stage===2)result=await perform("OUT-INSUFFICIENT",20);
 if(stage===3)result=await perform("OUT-FAIL-001",2,true);
 if(stage===4)result=await perform("OUT-002",2);
 if(stage===5)result=await perform("OUT-002",2);
 const after=await snapshot();
 if(!grade(stage,result,before,after))throw new Error(`本步校验失败：${result}。请检查事务状态后重试。`);
 session.step++;session.msg="步骤已通过，已重新读取并核对库存和流水";save();
}catch(err){session.msg="未通过："+(err?.message||String(err));save();}
finally{working=false;await refresh();}
}
function click(e){const b=e.target?.closest?.("[data-tx-action]");if(!b)return false;e.preventDefault();if(b.dataset.txAction==="next")void run();if(b.dataset.txAction==="restart"&&!working){working=true;void reset().catch(err=>{session.msg="重置失败："+err.message;save()}).finally(()=>{working=false;void refresh()});}return true}
window.V8TransactionLab={page,lessonLink,click,snapshot,perform,grade,openDB,reset,storage:{database:DB_NAME,progress:PROGRESS}};
})();