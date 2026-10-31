(function buildBulkLab(){
"use strict";
const KEY="adFactoryLearning.v8.bulk-lab.p22.qa";
const ids=Array.from({length:8},(_,i)=>"B-"+(2001+i));
const orders=ids.map((id,i)=>({id,customer:"虚构客户"+(i+1),status:"未归档",item:"示例标识"+(i+1)}));
const goals=[
"勾选本页 B-2001 和 B-2002 两条订单，并验证恰好选中两条。",
"翻到第 2 页，点击「全选本页」。只应增加第 2 页四条，不能误选其他订单；之前的两条仍保留。",
"取消勾选 B-2005，选中总数应从六条变为五条。",
"打开「批量归档（模拟）」确认框，再取消。验证五条订单都没有被修改。",
"再次打开确认框，输入精确确认词「确认归档 5」，只对当前五条执行模拟归档；防止重复提交。",
"点击「撤销本次归档」，把五条演示订单全部恢复，并保留一条撤销操作记录。"
];
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const firstTwo=["B-2001","B-2002"];
const onSecond=["B-2005","B-2006","B-2007","B-2008"];
const expectFive=["B-2001","B-2002","B-2006","B-2007","B-2008"];
const sorted=a=>[...a].sort();
const same=(a,b)=>JSON.stringify(sorted(a))===JSON.stringify(sorted(b));
const distinct=a=>[...new Set((Array.isArray(a)?a:[]).filter(id=>ids.includes(id)))];
function empty(){return {step:0,page:1,selected:[],archived:[],snapshot:[],logs:[],attempts:0,msg:""};}
function read(){try{const v=JSON.parse(localStorage.getItem(KEY)||"null");if(!v||typeof v!=="object")return empty();return {step:Math.max(0,Math.min(6,Number(v.step)||0)),page:[1,2].includes(Number(v.page))?Number(v.page):1,selected:distinct(v.selected),archived:distinct(v.archived),snapshot:distinct(v.snapshot),logs:Array.isArray(v.logs)?v.logs.filter(x=>typeof x==="string").slice(-20):[],attempts:Math.max(0,Number(v.attempts)||0),msg:String(v.msg||"").slice(0,160)};}catch{return empty()}}
let state=read(),busy=false;
function save(){try{localStorage.setItem(KEY,JSON.stringify(state));}catch{}}
function evaluate(step,action,s){
const count=s.selected.length;
if(step===0)return action==="verify"&&s.page===1&&same(s.selected,firstTwo);
if(step===1)return action==="select-page"&&s.page===2&&same(s.selected,[...firstTwo,...onSecond]);
if(step===2)return action==="uncheck"&&s.page===2&&same(s.selected,expectFive);
if(step===3)return action==="cancel"&&count===5&&s.archived.length===0&&same(s.selected,expectFive);
if(step===4)return action==="confirm"&&s.confirmPhrase==="确认归档 5"&&same(s.selected,expectFive)&&s.archived.length===0;
if(step===5)return action==="undo"&&s.archived.length===0&&same(s.snapshot,expectFive)&&s.logs.includes("已撤销 5 条模拟归档");
return false;
}
function visible(){return orders.slice((state.page-1)*4,state.page*4)}
function navButtons(){return `<div class="bulklab-pager"><button type="button" class="btn btn-ghost" data-bulk-action="prev" ${state.page===1?"disabled":""}>上一页</button><span>第 ${state.page}/2 页</span><button type="button" class="btn btn-ghost" data-bulk-action="next" ${state.page===2?"disabled":""}>下一页</button></div>`;}
function table(){return `<div class="bulklab-table-scroll"><table class="bulklab-table"><thead><tr><th scope="col">选择</th><th scope="col">订单编号</th><th scope="col">客户</th><th scope="col">演示状态</th></tr></thead><tbody>${visible().map(o=>`<tr><td><input type="checkbox" class="bulklab-check" data-bulk-id="${o.id}" aria-label="选择 ${o.id}" ${state.selected.includes(o.id)?"checked":""} ${state.step>=3?"disabled":""}></td><td>${esc(o.id)}</td><td>${esc(o.customer)}</td><td><span class="bulklab-status ${state.archived.includes(o.id)?"is-archived":""}">${state.archived.includes(o.id)?"模拟已归档":"未归档"}</span></td></tr>`).join("")}</tbody></table></div>${navButtons()}`;}
function viewStage(){
if(state.step===6)return `<div class="bulklab-success"><h2 tabindex="-1">六步训练已完成</h2><p>已验证本页全选、跨页保留、精确确认、取消不修改、一次提交和可撤销。</p><p class="bulklab-meta">操作记录：${state.logs.map(esc).join(" → ")}</p><button type="button" class="btn btn-ghost" data-bulk-action="restart">重新练习</button></div>`;
return `<div class="bulklab-steps">${goals.map((_,i)=>`<span class="${i<state.step?"complete":i===state.step?"active":""}" title="第 ${i+1} 步">${i+1}</span>`).join("")}</div><p class="micro">第 ${state.step+1}/6 步 · 教学数据，不会修改 ERP 真实订单</p><h2 tabindex="-1">${["精准勾选","跨页选择","取消部分选择","取消危险操作","精确确认并提交一次","撤销并记录"][state.step]}</h2><p class="bulklab-goal">${esc(goals[state.step])}</p><div class="bulklab-info">已选择 <strong id="bulklabSelected">${state.selected.length}</strong> 条 · 模拟归档 <strong id="bulklabArchived">${state.archived.length}</strong> 条</div><div class="bulklab-actions">${state.step===0?'<button type="button" class="btn btn-primary" data-bulk-action="verify">验证选择</button>':""}${state.step===1?'<button type="button" class="btn btn-soft" data-bulk-action="select-page">全选本页</button>':""}${state.step===3||state.step===4?'<button type="button" class="btn btn-primary" data-bulk-action="open-danger">批量归档（模拟）</button>':""}${state.step===5?'<button type="button" class="btn btn-primary" data-bulk-action="undo">撤销本次归档</button>':""}</div><div id="bulklabTable">${table()}</div><p class="bulklab-feedback" id="bulklabFeedback" role="status" aria-live="polite">${esc(state.msg||"请按本步说明操作；错误操作无法推进训练。")}</p>${state.logs.length?`<details><summary>查看操作日志</summary><ul>${state.logs.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></details>`:""}`;
}
function page(){return `<div class="page-enter detail-width"><div class="breadcrumb"><a href="#/components">组件</a><span>›</span><span>批量操作安全实训</span></div><a class="back-link" href="#/components">← 返回组件目录</a><h1>批量选择与危险操作确认</h1><p class="subhead">6 步验证：跨页勾选、本页全选、取消、二次确认、重复提交防护与撤销。8 条数据全部为虚构订单。</p><div id="bulklabRoot" class="card bulklab-card">${viewStage()}</div><p class="micro">「批量归档」为教学模拟，不对应或新增任何 ERP 生产业务操作；测试数据及成绩单独保存。</p></div>`;}
function lessonLink(id){return [15,30,57,58,62,80,86].includes(Number(id))?'<div class="related-knowledge"><strong>批量操作安全实训</strong><div><a href="#/components/bulk-lab">跨页选择、确认、撤销与日志练习</a></div></div>':""}
function draw(){const root=document.getElementById("bulklabRoot");if(root){root.innerHTML=viewStage();root.querySelector("h2")?.focus({preventScroll:true});}}
function tell(msg){state.attempts++;state.msg=msg;save();const p=document.getElementById("bulklabFeedback");if(p)p.textContent=msg;}
function stepForward(log=""){if(log)state.logs.push(log);state.step++;state.msg="";save();draw();}
function refreshTable(){const el=document.getElementById("bulklabTable");if(el)el.innerHTML=table();const c=document.getElementById("bulklabSelected");if(c)c.textContent=String(state.selected.length)}
function change(e){
const el=e.target, id=el?.dataset?.bulkId;if(!id||!ids.includes(id))return false;
if(state.step>=3)return true;
const next=new Set(state.selected);
if(el.checked)next.add(id);else next.delete(id);
state.selected=distinct([...next]);save();refreshTable();
if(state.step===2&&id==="B-2005"&&!el.checked){if(evaluate(2,"uncheck",state))stepForward("取消勾选 B-2005");else tell("本步只需取消 B-2005，保留另外五条。");}
return true;
}
function openDanger(trigger){
if(!(state.step===3||state.step===4)||!same(state.selected,expectFive)){tell("选择范围不正确，必须是本步骤指定的五条。");return;}
const dlg=document.createElement("dialog");dlg.className="bulklab-dialog";
dlg.setAttribute("aria-labelledby","bulklabDangerTitle");
dlg.innerHTML=`<div class="bulklab-modal"><h2 id="bulklabDangerTitle">危险操作确认 · 模拟</h2><p>将对 <strong>5 条虚构订单</strong>执行归档标记。必须核对选择范围。任何真实 ERP 订单均不会受影响。</p>${state.step===4?'<label>输入确认词：<strong>确认归档 5</strong><input id="bulklabPhrase" class="field" type="text" autocomplete="off" placeholder="确认归档 5"></label>':""}<div class="bulklab-dialog-actions"><button type="button" class="btn btn-ghost" data-bulk-action="cancel-danger">取消</button>${state.step===4?'<button type="button" class="btn btn-primary" data-bulk-action="confirm-danger">确认模拟归档</button>':""}</div><p id="bulklabDialogError" role="alert"></p></div>`;
const root=document.getElementById("bulklabRoot");if(!root)return;
root.appendChild(dlg);
const stage=state.step;
dlg.addEventListener("close",()=>{const value=dlg.returnValue;dlg.remove();busy=false;
 if(stage===3&&state.step===3&&(value==="cancel"||value==="")){if(evaluate(3,"cancel",state))stepForward("取消危险操作，0 条修改");else tell("取消后仍存在意外变更。");}
 if(stage===4&&state.step===4&&value!=="confirmed"){trigger?.focus();}
},{once:true});
dlg.showModal();dlg.querySelector("input,button")?.focus();
}
function click(e){
const button=e.target?.closest?.("[data-bulk-action]");if(!button)return false;e.preventDefault();
const action=button.dataset.bulkAction;
if(action==="cancel-danger"){document.querySelector(".bulklab-dialog")?.close("cancel");return true;}
if(action==="confirm-danger"){
 if(busy||state.step!==4)return true;
 const dlg=document.querySelector(".bulklab-dialog");if(!dlg)return true;
 const phrase=dlg.querySelector("#bulklabPhrase")?.value||"";
 if(!evaluate(4,"confirm",{...state,confirmPhrase:phrase})){dlg.querySelector("#bulklabDialogError").textContent="确认词不正确或选择数量已变化，操作未执行。";return true;}
 busy=true;state.snapshot=[...state.selected];state.archived=[...state.selected];state.selected=[];state.logs.push("确认归档 "+state.archived.length+" 条虚构订单");
 save();dlg.close("confirmed");state.step=5;state.msg="";save();draw();return true;
}
if(action==="restart"){state=empty();save();draw();return true;}
if(state.step===6)return true;
if(action==="prev"||action==="next"){const next=state.page+(action==="next"?1:-1);if(next>=1&&next<=2){state.page=next;save();refreshTable();}return true;}
if(action==="verify"){if(evaluate(0,"verify",state))stepForward("准确选择两条");else tell("请仅勾选 B-2001 和 B-2002。");return true;}
if(action==="select-page"){
 if(state.step===1&&state.page===2){state.selected=distinct([...state.selected,...onSecond]);if(evaluate(1,"select-page",state))stepForward("本页全选四条，跨页保留两条");else tell("请保留第一页两条，并仅全选第二页四条。");}
 else tell("请先翻到第二页，再执行全选本页。");
 return true;
}
if(action==="open-danger"){openDanger(button);return true;}
if(action==="undo"){
 if(state.step!==5)return true;
 state.archived=[];
 state.logs.push("已撤销 5 条模拟归档");save();
 if(evaluate(5,"undo",state))stepForward();else tell("撤销校验未通过。");
 return true;
}
return true;
}
window.V8BulkLab={page,lessonLink,click,change,evaluate,ids,orders,storageKey:KEY};
})();