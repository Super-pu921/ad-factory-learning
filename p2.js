(function(){
'use strict';
const STORAGE_KEY='adFactoryLearning.v8.practice.p2.order-list';
const PAGE_SIZE=3;
const STATUSES=['待生产','生产中','已完成'];
const ORDERS=[
 {id:'P2-1001',customer:'示例客户A',product:'发光字',status:'待生产'},
 {id:'P2-1002',customer:'示例客户B',product:'不锈钢字',status:'生产中'},
 {id:'P2-1003',customer:'示例客户C',product:'标识牌',status:'已完成'},
 {id:'P2-1004',customer:'示例客户A',product:'灯箱',status:'待生产'},
 {id:'P2-1005',customer:'示例客户D',product:'门头字',status:'生产中'},
 {id:'P2-1006',customer:'示例客户E',product:'灯箱',status:'已完成'},
 {id:'P2-1007',customer:'示例客户F',product:'标识牌',status:'生产中'},
 {id:'P2-1008',customer:'示例客户B',product:'发光字',status:'待生产'},
 {id:'P2-1009',customer:'示例客户C',product:'不锈钢字',status:'生产中'},
 {id:'P2-1010',customer:'示例客户D',product:'门头字',status:'已完成'},
 {id:'P2-1011',customer:'示例客户E',product:'灯箱',status:'生产中'},
 {id:'P2-1012',customer:'示例客户F',product:'标识牌',status:'待生产'}
];
const STEPS=[
 {title:'按客户名称搜索',instruction:'在搜索框输入“示例客户A”，确认只显示 2 条匹配记录。'},
 {title:'按订单状态筛选',instruction:'清空关键词，选择“生产中”，确认显示 5 条记录。'},
 {title:'组合条件筛选',instruction:'选择“待生产”，再搜索“示例客户A”，确认两个条件同时生效并显示 2 条记录。'},
 {title:'重置筛选条件',instruction:'点击“重置条件”，确认关键词与状态都恢复默认，并回到第 1 页。'},
 {title:'分页并保留筛选',instruction:'选择“生产中”，进入第 2 页，确认筛选条件仍保留且显示剩余记录。'},
 {title:'查看订单详情并返回',instruction:'打开第 2 页任意一条订单详情，核对订单号与客户，关闭抽屉后确认仍停留在第 2 页。'}
];
const DEFAULT={query:'',status:'all',page:1,completedSteps:[],feedback:'从第 1 步开始。练习数据为虚构样本，不会写入真实 ERP。'};
function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function copy(v){return JSON.parse(JSON.stringify(v));}
function load(){
 try{
  const v=JSON.parse(localStorage.getItem(STORAGE_KEY)||'null');
  if(!v||typeof v!=='object')return copy(DEFAULT);
  const raw=Array.isArray(v.completedSteps)?new Set(v.completedSteps.filter(n=>Number.isInteger(n)&&n>=1&&n<=6))):new Set();
  const completedSteps=[];for(let n=1;n<=6&&raw.has(n);n++)completedSteps.push(n);
  return {query:typeof v.query==='string'?v.query.slice(0,80):'',status:STATUSES.includes(v.status)?v.status:'all',page:Number.isInteger(v.page)&&v.page>0?v.page:1,completedSteps,feedback:typeof v.feedback==='string'?v.feedback.slice(0,240):DEFAULT.feedback};
 }catch(e){return copy(DEFAULT);}
}
let state=load();
let drawerId=null,drawerSnapshot=null,drawerTriggerId=null;
function persist(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(state));return true;}catch(e){return false;}}
function filtered(){
 const q=state.query.trim().toLocaleLowerCase();
 return ORDERS.filter(o=>(state.status==='all'||o.status===state.status)&&(!q||o.id.toLocaleLowerCase().includes(q)||o.customer.toLocaleLowerCase().includes(q)));
}
function pageCount(){return Math.max(1,Math.ceil(filtered().length/PAGE_SIZE));}
function pageOrders(){const rows=filtered(),start=(state.page-1)*PAGE_SIZE;return rows.slice(start,start+PAGE_SIZE);}
function currentStep(){for(let i=1;i<=6;i++)if(!state.completedSteps.includes(i))return i;return 7;}
function complete(n,message){
 if(state.completedSteps.includes(n))return true;
 if(n>1&&!state.completedSteps.includes(n-1))return false;
 state.completedSteps.push(n);state.completedSteps.sort((a,b)=>a-b);state.feedback=message;persist();return true;
}
function clampPage(){state.page=Math.max(1,Math.min(state.page,pageCount()));}
clampPage();
function setQuery(value){
 state.query=String(value??'').slice(0,80);state.page=1;clampPage();const rows=filtered();
 if(state.status==='all'&&state.query.trim()==='示例客户A'&&rows.length===2)complete(1,'第 1 步完成：按客户名称搜索到 2 条记录。');
 else if(state.status==='待生产'&&state.query.trim()==='示例客户A'&&rows.length===2)complete(3,'第 3 步完成：关键词与订单状态组合筛选正确。');
 else if(!state.completedSteps.includes(currentStep()))state.feedback='搜索条件已更新。请核对结果数量与当前任务要求。';
 persist();refresh();return rows;
}
function setStatus(value){
 state.status=STATUSES.includes(value)?value:'all';state.page=1;clampPage();const rows=filtered();
 if(state.query.trim()===''&&state.status==='生产中'&&rows.length===5)complete(2,'第 2 步完成：状态筛选显示 5 条生产中订单。');
 else if(state.query.trim()==='示例客户A'&&state.status==='待生产'&&rows.length===2)complete(3,'第 3 步完成：组合筛选显示 2 条记录。');
 else if(!state.completedSteps.includes(currentStep()))state.feedback='状态条件已更新。筛选条件变化后，页码已自动回到第 1 页。';
 persist();refresh();return rows;
}
function reset(){
 state.query='';state.status='all';state.page=1;
 if(state.completedSteps.includes(3))complete(4,'第 4 步完成：筛选条件已清空，12 条模拟订单全部恢复。');
 else state.feedback='筛选条件已重置。当前显示全部模拟订单。';
 persist();refresh();return filtered();
}
function goPage(page){
 const next=Math.max(1,Math.min(Number(page)||1,pageCount()));if(next===state.page)return false;
 state.page=next;
 if(state.query.trim()===''&&state.status==='生产中'&&state.page===2&&pageOrders().length===2&&state.completedSteps.includes(4))complete(5,'第 5 步完成：进入第 2 页后，生产中筛选条件仍然保留。');
 else if(!state.completedSteps.includes(currentStep()))state.feedback='页码已切换。请确认列表仍遵守当前筛选条件。';
 persist();refresh();return true;
}
function openDetail(id,trigger){
 const order=pageOrders().find(o=>o.id===id);if(!order){state.feedback='只能查看当前页显示的订单。';refresh();return false;}
 drawerId=id;drawerSnapshot={query:state.query,status:state.status,page:state.page};drawerTriggerId=id;if(trigger&&trigger.dataset&&trigger.dataset.orderId)drawerTriggerId=trigger.dataset.orderId;
 refresh();if(typeof document!=='undefined'){const close=document.querySelector('[data-p2-action="drawer-close"]');if(close)close.focus();}return true;
}
function closeDetail(){
 if(!drawerId)return false;
 const same=drawerSnapshot&&drawerSnapshot.query===state.query&&drawerSnapshot.status===state.status&&drawerSnapshot.page===state.page;
 const selected=ORDERS.find(o=>o.id===drawerId);drawerId=null;drawerSnapshot=null;
 if(same&&selected&&state.completedSteps.includes(5))complete(6,'第 6 步完成：详情与所选订单一致，关闭后列表筛选及页码均得到保留。');
 else if(!state.completedSteps.includes(currentStep()))state.feedback='详情抽屉已关闭。返回列表时应保留原搜索、筛选和页码。';
 persist();refresh();
 if(typeof document!=='undefined'&&drawerTriggerId){const el=document.querySelector('[data-p2-action="detail"][data-order-id="'+drawerTriggerId+'"]');if(el&&typeof el.focus==='function')el.focus();}
 drawerTriggerId=null;return true;
}
function renderProgress(){
 const done=state.completedSteps.length,step=currentStep();
 const list=STEPS.map((s,i)=>{const n=i+1,cls=state.completedSteps.includes(n)?'done':n===step?'current':'';return '<li class="p2-step '+cls+'"><span class="p2-step-number">'+(state.completedSteps.includes(n)?'✓':String(n).padStart(2,'0'))+'</span><span><strong>'+esc(s.title)+'</strong><small>'+esc(s.instruction)+'</small></span></li>';}).join('');
 const instruction=step<=6?'<div class="p2-current-task"><span class="p2-eyebrow">当前任务 · '+step+'/6</span><strong>'+esc(STEPS[step-1].title)+'</strong><p>'+esc(STEPS[step-1].instruction)+'</p></div>':'<div class="p2-current-task p2-finished"><strong>全部实训完成</strong><p>已完成订单搜索、组合筛选、重置、分页及详情返回训练。</p></div>';
 return '<div class="p2-progress-head"><div><span class="p2-eyebrow">P2.1 INTERACTIVE PRACTICE</span><h2>实训进度</h2></div><strong class="p2-count">'+done+'/6</strong></div><div class="p2-progress-track"><span style="width:'+Math.round(done/6*100)+'%"></span></div>'+instruction+'<ol class="p2-step-list">'+list+'</ol><p class="p2-feedback" aria-live="polite">'+esc(state.feedback)+'</p>';
}
function renderRow(o){return '<tr><td><strong>'+esc(o.id)+'</strong></td><td>'+esc(o.customer)+'</td><td>'+esc(o.product)+'</td><td><span class="p2-status '+(o.status==='待生产'?'pending':o.status==='已完成'?'done':'working')+'">'+esc(o.status)+'</span></td><td><button type="button" class="btn btn-ghost btn-small" data-p2-action="detail" data-order-id="'+esc(o.id)+'">查看详情</button></td></tr>';}
function renderCard(o){return '<article class="p2-order-card"><div class="p2-order-card-top"><strong>'+esc(o.id)+'</strong><span class="p2-status '+(o.status==='待生产'?'pending':o.status==='已完成'?'done':'working')+'">'+esc(o.status)+'</span></div><p><span>客户</span><strong>'+esc(o.customer)+'</strong></p><p><span>产品</span><strong>'+esc(o.product)+'</strong></p><button type="button" class="btn btn-secondary btn-small" data-p2-action="detail" data-order-id="'+esc(o.id)+'">查看订单详情</button></article>';}
function renderResults(){
 const rows=filtered(),pages=pageCount(),visible=pageOrders(),count=rows.length;
 const table=visible.length?visible.map(renderRow).join(''):'<tr><td colspan="5"><div class="p2-empty">没有符合条件的模拟订单。尝试修改关键词或重置筛选。</div></td></tr>';
 const cards=visible.length?visible.map(renderCard).join(''):'<div class="p2-empty">没有符合条件的模拟订单。尝试修改关键词或重置筛选。</div>';
 return '<div class="p2-results-head"><div><strong>订单记录</strong><span>找到 '+count+' 条 · 共 '+ORDERS.length+' 条教学样本</span></div><span class="p2-page-label">第 '+state.page+' / '+pages+' 页</span></div><div class="p2-table-wrap"><table class="p2-table"><thead><tr><th>订单编号</th><th>客户名称</th><th>产品</th><th>状态</th><th>操作</th></tr></thead><tbody>'+table+'</tbody></table></div><div class="p2-order-cards">'+cards+'</div><div class="p2-pagination"><span>每页 '+PAGE_SIZE+' 条 · 当前 '+visible.length+' 条</span><div><button type="button" class="btn btn-secondary btn-small" data-p2-action="prev" '+(state.page<=1?'disabled':'')+'>上一页</button><span>第 '+state.page+' 页</span><button type="button" class="btn btn-secondary btn-small" data-p2-action="next" '+(state.page>=pages?'disabled':'')+'>下一页</button></div></div>';
}
function renderDrawer(){
 if(!drawerId)return '';const o=ORDERS.find(x=>x.id===drawerId);if(!o)return '';
 return '<div class="p2-drawer-wrap" data-p2-action="drawer-backdrop"><aside class="p2-drawer" role="dialog" aria-modal="true" aria-labelledby="p2DrawerTitle" tabindex="-1"><div class="p2-drawer-head"><div><span class="p2-eyebrow">SIMULATED ORDER</span><h2 id="p2DrawerTitle">订单详情</h2></div><button type="button" class="btn btn-ghost btn-small" data-p2-action="drawer-close" aria-label="关闭订单详情">关闭 ×</button></div><dl class="p2-detail-list"><div><dt>订单编号</dt><dd>'+esc(o.id)+'</dd></div><div><dt>客户名称</dt><dd>'+esc(o.customer)+'</dd></div><div><dt>产品类别</dt><dd>'+esc(o.product)+'</dd></div><div><dt>当前状态</dt><dd><span class="p2-status '+(o.status==='待生产'?'pending':o.status==='已完成'?'done':'working')+'">'+esc(o.status)+'</span></dd></div></dl><p class="p2-disclaimer">本订单为虚构教学数据。这里只练习读取详情，不提供状态修改或真实订单操作。</p></aside></div>';
}
function renderOrderList(){
 return '<div class="page-enter p2-order-shell" id="p2OrderMission"><div class="p2-breadcrumb"><a href="#/practice">实战</a><span>›</span><a href="#/practice/scenario/orders">订单列表场景</a><span>›</span><span>P2.1</span></div><header class="p2-page-head"><div><span class="p2-eyebrow">PHASE 2 · P2.1</span><h1>订单列表完整交互实训</h1><p>练习搜索、状态筛选、组合条件、分页与详情抽屉。</p></div><a class="btn btn-secondary" href="#/practice/scenario/orders">返回订单场景</a></header><div class="p2-notice"><strong>教学环境</strong><span>以下 12 条订单均为虚构样本，仅用于学习列表交互；不会连接或修改真实 ERP 数据。</span></div><div class="p2-layout"><section class="p2-workspace"><div class="p2-filter-panel"><div class="p2-filter-title"><div><strong>订单筛选</strong><span>可按订单编号、客户名称与状态组合查询</span></div><button type="button" class="btn btn-ghost btn-small" data-p2-action="reset">重置条件</button></div><div class="p2-filter-controls"><label class="p2-control"><span>关键词搜索</span><input class="field" id="p2OrderSearch" type="search" maxlength="80" placeholder="输入订单编号或客户名称" value="'+esc(state.query)+'"></label><label class="p2-control"><span>订单状态</span><select class="field" id="p2OrderStatus"><option value="all" '+(state.status==='all'?'selected':'')+'>全部状态</option>'+STATUSES.map(s=>'<option value="'+esc(s)+'" '+(state.status===s?'selected':'')+'>'+esc(s)+'</option>').join('')+'</select></label></div></div><div id="p2Results">'+renderResults()+'</div></section><aside class="p2-progress-panel" id="p2Progress">'+renderProgress()+'</aside></div><section class="p2-related"><strong>关联知识</strong><div><a href="#/learn/lesson/51">第 51 课 · 数据表与主键</a><a href="#/learn/lesson/56">第 56 课 · REST API</a><a href="#/learn/lesson/59">第 59 课 · 状态与路由</a><a href="#/learn/lesson/79">第 79 课 · 查询与索引</a></div><p>关联组件：数据表格、搜索框、高级筛选器、分页、抽屉。</p></section><div id="p2DrawerHost">'+renderDrawer()+'</div></div>';
}
function refresh(){
 if(typeof document==='undefined')return;const root=document.getElementById('p2OrderMission');if(!root)return;
 const results=root.querySelector('#p2Results');if(results)results.innerHTML=renderResults();
 const progress=root.querySelector('#p2Progress');if(progress)progress.innerHTML=renderProgress();
 const drawer=root.querySelector('#p2DrawerHost');if(drawer)drawer.innerHTML=renderDrawer();
}
function handleInput(e){const t=e&&e.target;if(!t)return false;if(t.id==='p2OrderSearch'){setQuery(t.value);return true;}if(t.id==='p2OrderStatus'){setStatus(t.value);return true;}return false;}
function handleClick(e){
 const t=e&&e.target&&e.target.closest?e.target.closest('[data-p2-action]'):null;if(!t)return false;
 const action=t.dataset.p2Action;if(action==='drawer-backdrop'&&e.target!==t)return false;
 if(e.preventDefault)e.preventDefault();
 if(action==='reset')reset();else if(action==='prev')goPage(state.page-1);else if(action==='next')goPage(state.page+1);else if(action==='detail')openDetail(t.dataset.orderId,t);else if(action==='drawer-close'||action==='drawer-backdrop')closeDetail();else return false;
 return true;
}
function handleKeydown(e){
 if(!drawerId||!e)return false;if(e.key==='Escape'){e.preventDefault();closeDetail();return true;}
 if(e.key==='Tab'){const close=typeof document!=='undefined'?document.querySelector('[data-p2-action="drawer-close"]'):null;if(close&&document.activeElement===close){e.preventDefault();close.focus();return true;}}
 return false;
}
function getState(){return copy(state);}
function getFilteredOrders(){return copy(filtered());}
function getPageOrders(){return copy(pageOrders());}
function getSelectedOrder(){return drawerId?copy(ORDERS.find(x=>x.id===drawerId)||null):null;}
function resetForTests(){state=copy(DEFAULT);drawerId=null;drawerSnapshot=null;drawerTriggerId=null;try{localStorage.removeItem(STORAGE_KEY);}catch(e){}}
window.V8P2={STORAGE_KEY,orders:copy(ORDERS),steps:copy(STEPS),pageSize:PAGE_SIZE,renderOrderList,handleInput,handleClick,handleKeydown,setQuery,setStatus,reset,goPage,openDetail,closeDetail,getState,getFilteredOrders,getPageOrders,getSelectedOrder,pageCount,currentStep,resetForTests};
})();