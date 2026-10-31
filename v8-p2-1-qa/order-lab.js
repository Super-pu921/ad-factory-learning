(function setupV8OrderLab(){
'use strict';
const STORAGE='adFactoryLearning.v8.p2.1.order.qa';
const records=[
 ['QA-1001','瑞冠口腔','待生产','广告字'],
 ['QA-1002','天悦广告','待生产','灯箱'],
 ['QA-1003','悦己瑜伽','生产中','标识牌'],
 ['QA-1004','瑞冠口腔','待生产','门头字'],
 ['QA-1005','海城商贸','已完成','灯箱'],
 ['QA-1006','星辰标识','生产中','广告字'],
 ['QA-1007','瑞冠口腔','待生产','标识牌'],
 ['QA-1008','明匠工坊','待生产','灯箱'],
 ['QA-1009','星锐广告','已完成','广告字'],
 ['QA-1010','瑞冠口腔','待生产','门头字'],
 ['QA-1011','绿野设计','待生产','灯箱'],
 ['QA-1012','天悦广告','生产中','标识牌'],
 ['QA-1013','瑞冠口腔','待生产','广告字'],
 ['QA-1014','岭南门店','已完成','广告字'],
 ['QA-1015','青山文化','生产中','灯箱']
].map(([id,customer,status,product])=>Object.freeze({id,customer,status,product}));
const titles=[
 ['搜索订单','使用搜索框输入「瑞冠」，观察订单编号或客户名称匹配后再点击「验收本步」。'],
 ['状态筛选','清空关键词，仅选择「待生产」，确保列表只显示待生产的订单。'],
 ['组合筛选','在「待生产」的基础上再次搜索「瑞冠」，检查两个条件同时生效。'],
 ['重置条件','点击「重置条件」，恢复全部 15 条订单和第一页。'],
 ['翻页与条件保持','再次选择「待生产」，点击下一页，观察筛选条件仍然保留。'],
 ['查看与关闭详情','在当前第二页打开 QA-1011，核对详情后关闭抽屉。确认仍停留在待生产第二页。']
];
const PAGE_SIZE=5;
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function stored(){try{const v=JSON.parse(localStorage.getItem(STORAGE)||'{}');return v&&typeof v==='object'&&!Array.isArray(v)?v:{}}catch{return {}}}
let progress=stored();
progress.passed=Math.min(6,Math.max(0,Number.isInteger(progress.passed)?progress.passed:0));
progress.attempts=Math.max(0,Number.isInteger(progress.attempts)?progress.attempts:0);
let ui={query:'',status:'',page:1,viewed:null,closed:false};
let opener=null;
function save(){try{localStorage.setItem(STORAGE,JSON.stringify({passed:progress.passed,attempts:progress.attempts}))}catch{}}
function filterOrders(query=ui.query,status=ui.status){
 const q=String(query).trim().toLocaleLowerCase();
 return records.filter(o=>(!q||[o.id,o.customer].some(t=>t.toLocaleLowerCase().includes(q)))&&(!status||o.status===status));
}
function snapshot(){const filtered=filterOrders(),maxPage=Math.max(1,Math.ceil(filtered.length/PAGE_SIZE));const page=Math.min(Math.max(1,ui.page),maxPage);return {filtered,rows:filtered.slice((page-1)*PAGE_SIZE,page*PAGE_SIZE),page,maxPage}}
function evaluateStep(index=progress.passed){
 const snap=snapshot(), f=snap.filtered;
 switch(index){
 case 0:return ui.query.trim()==='瑞冠'&&ui.status===''&&f.length===5;
 case 1:return ui.query.trim()===''&&ui.status==='待生产'&&f.length===8;
 case 2:return ui.query.trim()==='瑞冠'&&ui.status==='待生产'&&f.length===5;
 case 3:return ui.query.trim()===''&&ui.status===''&&snap.page===1&&f.length===15;
 case 4:return ui.query.trim()===''&&ui.status==='待生产'&&snap.page===2&&snap.maxPage===2;
 case 5:return ui.query.trim()===''&&ui.status==='待生产'&&snap.page===2&&ui.viewed==='QA-1011'&&ui.closed===true;
 default:return false;
 }
}
function setFilters(query,status){
 ui.query=String(query??'');ui.status=String(status??'');ui.page=1;ui.viewed=null;ui.closed=false;return snapshot();
}
function changePage(to){
 const {maxPage}=snapshot();ui.page=Math.max(1,Math.min(maxPage,to));ui.viewed=null;ui.closed=false;return snapshot();
}
function resetFilters(){return setFilters('','')}
function stepHtml(){
 if(progress.passed===6)return `<div class="orderlab-complete" role="status"><strong>六步实训已完成</strong><p>已实际验证搜索、状态筛选、组合筛选、重置、分页和详情返回。练习不会修改真实订单。</p><button class="btn btn-ghost" data-order-lab="restart" type="button">重新练习</button></div>`;
 const [title,help]=titles[progress.passed];
 return `<p class="micro">第 ${progress.passed+1}/6 步 · 已尝试 ${progress.attempts} 次</p><h2>${esc(title)}</h2><p class="mission-instructions">${esc(help)}</p><div class="orderlab-actions"><button class="btn btn-primary" type="button" data-order-lab="check">验收本步</button><span class="micro">真实操作正确才会通过</span></div>`;
}
function tableHtml(){
 const snap=snapshot(); const first=snap.filtered.length?((snap.page-1)*PAGE_SIZE+1):0,last=Math.min(snap.filtered.length,snap.page*PAGE_SIZE);
 return `<div class="orderlab-table-wrap"><table class="orderlab-table"><caption class="v8-sr-only">模拟订单结果</caption><thead><tr><th scope="col">订单编号</th><th scope="col">客户名称</th><th scope="col">状态</th><th scope="col">操作</th></tr></thead><tbody>${snap.rows.length?snap.rows.map(o=>`<tr><td>${esc(o.id)}</td><td>${esc(o.customer)}</td><td><span class="orderlab-status">${esc(o.status)}</span></td><td><button type="button" class="btn btn-ghost btn-small" data-order-lab="open" data-order-id="${esc(o.id)}" aria-label="查看订单 ${esc(o.id)}">详情</button></td></tr>`).join(''):'<tr><td colspan="4" class="orderlab-empty">没有匹配订单，修改或重置筛选条件。</td></tr>'}</tbody></table></div><div class="orderlab-footer"><span class="micro">第 ${first}–${last} 条 / 共 ${snap.filtered.length} 条 · 第 ${snap.page}/${snap.maxPage} 页</span><div class="orderlab-page-controls"><button type="button" class="btn btn-ghost btn-small" data-order-lab="prev" ${snap.page===1?'disabled':''}>上一页</button><button type="button" class="btn btn-ghost btn-small" data-order-lab="next" ${snap.page===snap.maxPage?'disabled':''}>下一页</button></div></div>`;
}
function layout(){
 return `<div class="page-enter detail-width orderlab-page" id="orderLabRoot"><div class="breadcrumb"><a href="#/components">组件</a><span>›</span><span>订单列表实训</span></div><a class="back-link" href="#/components">← 返回组件目录</a><h1>订单列表完整交互</h1><p class="subhead">P2.1 · 操作六个任务，学习搜索、状态、组合筛选、分页和详情抽屉。所有 15 条订单均为虚构练习数据。</p><div class="card orderlab-lesson"><div class="orderlab-steps" aria-label="练习完成步骤">${titles.map((_,i)=>`<span class="${i<progress.passed?'done':i===progress.passed?'current':''}">${i+1}</span>`).join('')}</div><div id="orderLabStep">${stepHtml()}</div><p class="orderlab-feedback" id="orderLabFeedback" role="status" aria-live="polite">操作后点击「验收本步」。</p></div><div class="card orderlab-workspace"><div class="orderlab-toolbar"><label class="mission-field"><span>搜索订单编号 / 客户</span><input id="orderLabQuery" class="field" type="search" value="${esc(ui.query)}" placeholder="例如：瑞冠" autocomplete="off"></label><label class="mission-field"><span>生产状态</span><select id="orderLabStatus" class="field"><option value="">全部状态</option>${['待生产','生产中','已完成'].map(x=>`<option value="${esc(x)}" ${x===ui.status?'selected':''}>${esc(x)}</option>`).join('')}</select></label><button type="button" class="btn btn-ghost" data-order-lab="reset">重置条件</button></div><div id="orderLabResults">${tableHtml()}</div></div><dialog id="orderLabDrawer" class="orderlab-dialog" aria-labelledby="orderLabDrawerTitle"><div id="orderLabDrawerBody"></div><button type="button" class="btn btn-primary" data-order-lab="close">关闭详情</button></dialog><p class="micro orderlab-notice">训练数据与正式 ERP、报价引擎及其他 V8 学习记录完全隔离；不支持修改真实订单。每页显示 5 条仅为教学示例。</p></div>`;
}
function updateResults(){const node=document.getElementById('orderLabResults');if(node)node.innerHTML=tableHtml();}
function feedback(message,failed=false){const node=document.getElementById('orderLabFeedback');if(node){node.textContent=message;node.classList.toggle('needs-attention',failed)}}
function handleInput(e){
 if(!e?.target)return false;
 if(e.target.id==='orderLabQuery'){setFilters(e.target.value,ui.status);updateResults();return true}
 if(e.target.id==='orderLabStatus'){setFilters(ui.query,e.target.value);updateResults();return true}
 return false;
}
function closeDialog(){
 const dialog=document.getElementById('orderLabDrawer');
 if(!dialog||!dialog.open)return;
 dialog.close(); 
}
function handleClick(e){
 const target=e.target.closest?.('[data-order-lab]');
 if(!target)return false;
 const action=target.dataset.orderLab;
 if(!['check','next','prev','reset','restart','open','close'].includes(action))return false;
 e.preventDefault();
 if(action==='reset'){resetFilters();const q=document.getElementById('orderLabQuery'),s=document.getElementById('orderLabStatus');if(q)q.value='';if(s)s.value='';updateResults();feedback('条件已重置，当前显示全部订单。');return true}
 if(action==='prev'||action==='next'){changePage(ui.page+(action==='next'?1:-1));updateResults();feedback('已翻页，当前筛选条件保持不变。');return true}
 if(action==='restart'){progress={passed:0,attempts:0};save();resetFilters();const root=document.getElementById('orderLabRoot');if(root)root.outerHTML=layout();return true}
 if(action==='open'){
  const order=records.find(x=>x.id===target.dataset.orderId);
  const dialog=document.getElementById('orderLabDrawer');
  if(!order||!dialog)return true;
  opener=target;ui.viewed=order.id;ui.closed=false;
  const body=document.getElementById('orderLabDrawerBody');
  if(body)body.innerHTML=`<h2 id="orderLabDrawerTitle">订单详情 · ${esc(order.id)}</h2><p class="micro">教学模拟数据 · 不可修改真实订单</p><dl class="info-list"><div><dt>客户</dt><dd>${esc(order.customer)}</dd></div><div><dt>品类</dt><dd>${esc(order.product)}</dd></div><div><dt>当前状态</dt><dd>${esc(order.status)}</dd></div></dl>`;
  dialog.showModal();dialog.querySelector('[data-order-lab="close"]')?.focus();
  return true;
 }
 if(action==='close'){closeDialog();return true}
 if(action==='check'){
  progress.attempts++;
  const ok=evaluateStep();
  if(ok){progress.passed++;save();document.getElementById('orderLabStep').innerHTML=stepHtml();feedback(progress.passed===6?'所有六步完成，练习成绩已保存。':'本步通过，请完成下一个操作。');}
  else{save();feedback('尚未满足本步条件。请按任务说明操作列表，再次验收。',true);}
  return true;
 }
 return false;
}
function handleClose(){const dlg=document.getElementById('orderLabDrawer');if(!dlg)return;ui.closed=true;if(opener?.isConnected)opener.focus();opener=null;feedback('已关闭详情，筛选和分页条件没有重置。')}
document.addEventListener('close',e=>{if(e.target.id==='orderLabDrawer')handleClose()},true);
window.V8OrderLab={page:layout,handleClick,handleInput,storageKey:STORAGE,
 __test:{records,filterOrders,snapshot,evaluateStep,setFilters,resetFilters,changePage,progress:()=>progress,ui:()=>({...ui}),closeOrder:()=>{ui.closed=true},viewOrder:id=>{ui.viewed=id;ui.closed=false},pass:()=>{if(!evaluateStep())return false;progress.passed++;save();return true},restart:()=>{progress={passed:0,attempts:0};save();resetFilters()}}};
})();