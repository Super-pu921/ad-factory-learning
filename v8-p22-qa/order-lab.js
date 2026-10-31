(function createOrderLab(){
"use strict";
const STORAGE="adFactoryLearning.v8.order-lab.p22.qa";
const labels=["搜索订单编号","按状态筛选","组合查询","清除筛选","保留筛选条件翻页","详情抽屉及返回"];
const descriptions=[
"输入 S-1008，验证只出现这一条订单。",
"选择生产中，验证只显示生产中的 6 条订单。",
"保持生产中，输入“示例广告”，验证出现 3 条订单。",
"点击清除筛选，恢复全部 12 条订单。",
"选择生产中，然后点击下一页，状态筛选必须保持。",
"打开当前页任一条订单详情，再关闭抽屉；页码和筛选条件都不能丢失。"
];
const orders=Array.from({length:12},(_,i)=>({
id:"S-"+String(1001+i),
customer:([0,2,4,6,8,10].includes(i)?"示例广告":"示例客户")+(i+1),
status:([1,3,4,6,7,10].includes(i)?"生产中":[0,5,11].includes(i)?"待生产":"已完成"),
product:"教学用广告标识"+(i+1)
}));
const esc=x=>String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const clean=x=>String(x??"").trim().toLowerCase();
function rows(q="",status="",page=1){
let matches=orders.filter(o=>(!clean(q)||clean(o.id).includes(clean(q))||clean(o.customer).includes(clean(q)))&&(!status||o.status===status));
const pages=Math.max(1,Math.ceil(matches.length/3)),p=Math.max(1,Math.min(pages,Math.trunc(Number(page))||1));
return {items:matches.slice((p-1)*3,p*3),total:matches.length,pages,page:p};
}
const blank=()=>({step:0,q:"",status:"",page:1,tries:0,message:""});
function read(){
try{let x=JSON.parse(localStorage.getItem(STORAGE)||"null");if(!x||typeof x!=="object")return blank();
return {step:Math.min(6,Math.max(0,Number(x.step)||0)),q:String(x.q||"").slice(0,50),status:["","待生产","生产中","已完成"].includes(x.status)?x.status:"",page:Math.max(1,Number(x.page)||1),tries:Math.max(0,Number(x.tries)||0),message:String(x.message||"").slice(0,150)};}catch{return blank();}
}
let state=read();
function persist(){try{localStorage.setItem(STORAGE,JSON.stringify(state));}catch{}}
function passes(step,action,s,orderId=""){
const result=rows(s.q,s.status,s.page);
if(step===0)return action==="verify"&&clean(s.q)==="s-1008"&&s.status===""&&result.total===1;
if(step===1)return action==="verify"&&s.q===""&&s.status==="生产中"&&result.total===6;
if(step===2)return action==="verify"&&clean(s.q)==="示例广告"&&s.status==="生产中"&&result.total===3;
if(step===3)return action==="clear"&&s.q===""&&s.status===""&&result.page===1&&result.total===12;
if(step===4)return action==="next"&&s.q===""&&s.status==="生产中"&&result.page===2;
if(step===5)return action==="detail-close"&&s.q===""&&s.status==="生产中"&&result.page===2&&result.items.some(x=>x.id===orderId);
return false;
}
function table(){
const d=rows(state.q,state.status,state.page);state.page=d.page;
return `<p class="orderlab-count" role="status">匹配 ${d.total} 条 · 第 ${d.page}/${d.pages} 页</p><div class="orderlab-scroll"><table class="orderlab-table"><thead><tr><th>编号</th><th>客户</th><th>状态</th><th>操作</th></tr></thead><tbody>${d.items.length?d.items.map(x=>`<tr><td>${esc(x.id)}</td><td>${esc(x.customer)}</td><td>${esc(x.status)}</td><td><button type="button" class="btn btn-ghost btn-small" data-orderlab="detail" data-id="${x.id}" ${state.step!==5?"disabled":""}>详情</button></td></tr>`).join(""):`<tr><td colspan="4">没有匹配订单</td></tr>`}</tbody></table></div><div class="orderlab-pager"><button type="button" class="btn btn-ghost" data-orderlab="prev" ${d.page===1?"disabled":""}>上一页</button><span>${d.page} / ${d.pages}</span><button type="button" class="btn btn-ghost" data-orderlab="next" ${d.page>=d.pages?"disabled":""}>下一页</button></div>`;
}
function stage(){
if(state.step===6)return `<h2 tabindex="-1">已完成全部六步</h2><p>搜索、筛选、组合、重置、分页和详情全部通过。本练习未写入真实订单。</p><button type="button" class="btn btn-ghost" data-orderlab="restart">重新练习</button>`;
return `<div class="orderlab-progress">${labels.map((v,i)=>`<span class="${i<state.step?"done":i===state.step?"current":""}">${i+1}</span>`).join("")}</div><p class="micro">第 ${state.step+1}/6 步 · 完成 ${state.step} 步</p><h2 tabindex="-1">${esc(labels[state.step])}</h2><p>${esc(descriptions[state.step])}</p><div class="orderlab-fields"><label>订单号或客户名称<input id="orderLabQuery" type="search" class="field" value="${esc(state.q)}" placeholder="输入订单号或客户"></label><label>订单状态<select id="orderLabStatus" class="field">${["","待生产","生产中","已完成"].map(x=>`<option value="${x}" ${state.status===x?"selected":""}>${x||"全部状态"}</option>`).join("")}</select></label></div><div class="orderlab-buttons"><button type="button" class="btn btn-ghost" data-orderlab="clear">清除筛选</button>${state.step<3?`<button type="button" class="btn btn-primary" data-orderlab="verify">验证本步</button>`:""}</div><div id="orderLabTable">${table()}</div><p class="orderlab-feedback" id="orderLabMessage" aria-live="polite">${esc(state.message||"按上方要求操作，系统将检查实际查询结果。")}</p>`;
}
function page(){return `<div class="page-enter detail-width"><div class="breadcrumb"><a href="#/components">组件</a><span>›</span><span>订单列表交互实训</span></div><a class="back-link" href="#/components">← 返回组件目录</a><h1>订单列表完整交互</h1><p class="subhead">六步练习：搜索、状态筛选、组合条件、重置、分页与详情抽屉。仅使用虚构数据。</p><div class="card orderlab-card" id="orderLabRoot">${stage()}</div><p class="micro">独立训练记录，不调用真实 ERP 接口；列表中的状态仅用于筛选，不执行生产流转。</p></div>`;}
function lessonLink(id){return [50,51,56,59,79].includes(Number(id))?'<div class="related-knowledge"><strong>订单列表实训</strong><div><a href="#/components/order-lab">搜索、组合筛选与分页练习</a></div></div>':"";}
function draw(){const el=document.getElementById("orderLabRoot");if(el){el.innerHTML=stage();el.querySelector("h2")?.focus({preventScroll:true});}}
function feedback(text){state.tries++;state.message=text;persist();const el=document.getElementById("orderLabMessage");if(el)el.textContent=text;}
function advance(){state.step++;state.message="";if(state.step===1){state.q="";state.status="";state.page=1;}if(state.step===3)state.page=1;persist();draw();}
function input(e){
const id=e.target?.id;if(id!=="orderLabQuery"&&id!=="orderLabStatus")return false;
if(id==="orderLabQuery")state.q=e.target.value;else state.status=e.target.value;
state.page=1;persist();
const t=document.getElementById("orderLabTable");if(t)t.innerHTML=table();
return true;
}
function openDetail(id){
const selected=rows(state.q,state.status,state.page).items.find(x=>x.id===id);if(!selected||state.step!==5)return;
const el=document.createElement("dialog");el.className="orderlab-dialog";el.setAttribute("aria-labelledby","orderlab-title");
el.innerHTML=`<div class="orderlab-drawer"><h2 id="orderlab-title">${esc(selected.id)}</h2><dl><div><dt>客户</dt><dd>${esc(selected.customer)}</dd></div><div><dt>状态</dt><dd>${esc(selected.status)}</dd></div><div><dt>产品</dt><dd>${esc(selected.product)}</dd></div></dl><button class="btn btn-primary" type="button" data-orderlab="close">关闭详情</button></div>`;
document.getElementById("orderLabRoot")?.appendChild(el);
el.addEventListener("close",()=>{const correct=passes(5,"detail-close",state,id);el.remove();if(correct)advance();else feedback("列表上下文发生变化，请检查筛选和当前页。");},{once:true});
el.showModal();el.querySelector("button")?.focus();
}
function click(e){
const button=e.target?.closest?.("[data-orderlab]");if(!button)return false;e.preventDefault();
const action=button.dataset.orderlab;if(action==="close"){document.querySelector(".orderlab-dialog")?.close();return true;}
if(action==="restart"){state=blank();persist();draw();return true;}
if(state.step===6)return true;
if(action==="detail"){openDetail(button.dataset.id);return true;}
if(action==="clear"){state.q="";state.status="";state.page=1;if(passes(state.step,action,state))advance();else{persist();draw();feedback("已清除条件。本步尚未完成，请按要求操作。");}return true;}
if(action==="prev"||action==="next"){const d=rows(state.q,state.status,state.page),p=state.page+(action==="next"?1:-1);if(p<1||p>d.pages)return true;state.page=p;if(passes(state.step,action,state))advance();else{persist();const t=document.getElementById("orderLabTable");if(t)t.innerHTML=table();if(state.step===4)feedback("请保持生产中筛选，然后进入第二页。");}return true;}
if(action==="verify"){if(passes(state.step,action,state))advance();else feedback("条件未符合本步要求，请检查输入及结果。");return true;}
return true;
}
window.V8OrderLab={page,lessonLink,click,input,rows,passes,orders,storageKey:STORAGE};
})();