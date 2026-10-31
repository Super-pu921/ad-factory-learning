(function setupV8Missions(){
'use strict';
const STORAGE='adFactoryLearning.v8.practice.missions.p23.qa';
const lessons={
  validation:[13,62], 'dependent-select':[56,58], 'formula-builder':[48,49,66],
  'editable-table':[49,53,80], 'permission-matrix':[57,86], 'kanban-board':[15,62,87]
};
const specs=[
  {id:'validation',title:'客户表单校验',category:'表单与错误处理',intro:'先触发空值错误，再修改为有效客户名称。验证错误提示、保存条件和输入保留。',steps:[
    {title:'验证空客户名称',prompt:'模拟新增客户时，先保持客户名称为空，点击「验证本步」，确认系统拒绝保存。',kind:'validation-empty',why:'必填校验要明确拒绝空字符串和纯空格；实际系统服务端仍须复核。'},
    {title:'修正客户资料',prompt:'填写至少两个字符的客户名称（例如「瑞冠口腔」），再验证是否可以保存。',kind:'validation-valid',why:'错误修正后应恢复可提交状态，不应清空其他已输入字段。'}
  ]},
  {id:'dependent-select',title:'材料规格依赖选择',category:'表单与业务关联',intro:'体验上级条件改变时的候选材料切换。阈值、材料 A/B 均为教学示例，不作为生产依据。',steps:[
    {title:'小尺寸材料',prompt:'模拟规则：长边不超过 100cm 时选择「示例材料 A」。本订单长边 80cm，应选哪项？',kind:'dependent-a',why:'依赖选择首先匹配父级条件与尺寸，错误候选不得静默保存。'},
    {title:'大尺寸材料',prompt:'当长边超过 100cm，模拟匹配为「示例材料 B」。本订单长边 120cm，应选哪项？',kind:'dependent-b',why:'上游尺寸变化后必须清理不再有效的旧材料选择。'},
    {title:'非法尺寸阻断',prompt:'输入 -5cm 属于无效尺寸。请选择系统应该采取的处理方式。',kind:'dependent-invalid',why:'非法尺寸必须阻止选材，不可用默认材料掩盖输入错误。'}
  ]},
  {id:'formula-builder',title:'广告字计价规则判定',category:'报价规则引擎',intro:'以已确认的最长边/面积条件练习规则判断。只检验计价量，不涉及单价及任何新增区间定价规则。',steps:[
    {title:'小尺寸最长边',prompt:'20×40cm，两个边都不足 1m：请选择计价方式，并填写计价量（单位 m）。',kind:'price-long',why:'已确认：两边均不足 1m 时按最长边；本例计价量为 0.4m。'},
    {title:'大尺寸面积',prompt:'110×100cm，两边均不小于 1m：请选择计价方式，并填写计价量（单位 ㎡）。',kind:'price-area',why:'已确认：两边均不小于 1m 时按面积；本例计价量为 1.1㎡。'},
    {title:'未确认的混合尺寸',prompt:'110×80cm，一边大于等于 1m、另一边不足 1m：现有两条规则均不覆盖，应如何处理？',kind:'price-mixed',why:'混合边界尚未确认；正确行为是转人工核实，不能擅自推导新规则。'}
  ]},
  {id:'editable-table',title:'报价明细编辑与取消',category:'报价明细',intro:'用一行合成报价数据模拟校验、保存和取消。示例单价 ¥125 仅为 UI 教学数据。',steps:[
    {title:'拒绝无效数量',prompt:'将数量设为 -1，点击「检查并保存」。正确结果应是拒绝写入。',kind:'edit-invalid',why:'数量是正整数，负数和空值不应进入正式报价明细。'},
    {title:'有效修改与汇总',prompt:'将数量设为 3，单价固定 ¥125；保存后教学合计应为 ¥375。',kind:'edit-valid',why:'数量应先验证再参与计算；变更只影响当前行。'},
    {title:'取消保留原值',prompt:'模拟把已保存数量 3 改成 9，但本次操作应当取消。请输入 9 并点击「取消本次编辑」。',kind:'edit-cancel',why:'取消必须丢弃草稿，不得悄悄覆盖已经保存的数量 3。'}
  ]},
  {id:'permission-matrix',title:'岗位权限与对象保护',category:'权限与安全',intro:'模拟岗位权限矩阵的授权判断。这里只是学习练习，实际系统必须由服务端检查具体人员、资源和对象。',steps:[
    {title:'业务员访问工资',prompt:'业务员申请查看全部员工计件工资，按照本练习的最小权限配置，应如何处理？',kind:'permission-sales',why:'工资属于敏感数据，业务员默认不应读取全部员工工资。'},
    {title:'财务核对工资',prompt:'经授权的财务岗位需要查看计件工资汇总，按照本练习的岗位规则，如何处理？',kind:'permission-finance',why:'授权要与岗位职责一致，并在服务端检查是否属于被允许的资源范围。'},
    {title:'生产岗位改报价规则',prompt:'生产主管尝试修改报价规则引擎的价格配置，按最小权限原则应如何处理？',kind:'permission-production',why:'生产推进权限不等于价格规则修改权限；前端隐藏按钮不是有效的安全控制。'}
  ]},
  {id:'kanban-board',title:'生产看板状态流转',category:'生产闭环',intro:'练习合法推进、阻止跳步和补料回退。只修改教学状态，补料示例保留原因及次数的追溯要求。',steps:[
    {title:'正常推进',prompt:'订单当前为「待生产」，工序已经开始，下一步选择哪个状态？',kind:'kanban-next',why:'状态变更应遵循已定义的生产流程，不能跳过必要的环节。'},
    {title:'阻止非法跳步',prompt:'另一张订单仍是「待生产」，有人直接选择「已完成」，系统应该如何处理？',kind:'kanban-skip',why:'直接跳步可能绕过工序和质检；应拒绝非法流转并说明原因。'},
    {title:'补料回退与追踪',prompt:'订单已在生产中，获准补料后需回退「待生产」。选择带有追踪记录的操作，填写原因（至少 3 字），并把原有 1 次补料记录更新为 2 次。',kind:'kanban-rework',why:'补料必须记录原因和次数，并明确回退到待生产，便于后续追责和防重复生产。'}
  ]}
];
const map=Object.fromEntries(specs.map(x=>[x.id,x]));
const esc=v=>String(v??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
function load(){try{const v=JSON.parse(localStorage.getItem(STORAGE)||'{}');return v&&typeof v==='object'&&!Array.isArray(v)?v:{}}catch{return {}}}
let state=load();
function persist(){try{localStorage.setItem(STORAGE,JSON.stringify(state))}catch{}}
const complete=id=>(state[id]?.passed||[]).length===(map[id]?.steps.length||-1);
function count(){return specs.filter(x=>complete(x.id)).length}
function grade(id,index,data={},action='check'){
 const kind=map[id]?.steps?.[index]?.kind;
 const v=String(data.value??'').trim(),choice=String(data.choice??'');
 switch(kind){
  case 'validation-empty':return {ok:!v,reason:!v?'已识别空客户名称，保存被拒绝。':'本步先不填名称，验证必填错误是否会出现。'};
  case 'validation-valid':return {ok:v.length>=2&&v.length<=30,reason:v.length>=2&&v.length<=30?'有效客户名称通过验证，模拟保存成功。':'客户名称需要 2–30 个字符；不要只输入空格。'};
  case 'dependent-a':return {ok:choice==='a',reason:choice==='a'?'80cm 已匹配示例材料 A。':'本练习约定 100cm 及以下选择材料 A。'};
  case 'dependent-b':return {ok:choice==='b',reason:choice==='b'?'120cm 已匹配示例材料 B。':'大于 100cm 的教学示例应选择材料 B，并清理旧选择。'};
  case 'dependent-invalid':return {ok:choice==='reject',reason:choice==='reject'?'非法尺寸被拒绝，未选择材料。':'尺寸小于 0，必须阻止继续选材。'};
  case 'price-long':return {ok:choice==='long'&&Number.isFinite(Number(v))&&Math.abs(Number(v)-0.4)<0.00001,reason:choice==='long'&&Math.abs(Number(v)-0.4)<0.00001?'两边都小于 1m，最长边计价量 0.4m。':'请选择最长边，并填写 0.4m。'};
  case 'price-area':return {ok:choice==='area'&&v!==''&&Number.isFinite(Number(v))&&Math.abs(Number(v)-1.1)<0.00001,reason:choice==='area'&&Math.abs(Number(v)-1.1)<0.00001?'两边均不小于 1m，面积计价量 1.1㎡。':'请选择面积，并填写 1.1㎡。'};
  case 'price-mixed':return {ok:choice==='review',reason:choice==='review'?'正确：当前已确认规则没有覆盖混合尺寸，转人工确认。':'不能擅自确定一边达到 1m 的混合尺寸计价方式。'};
  case 'edit-invalid':return {ok:action==='check'&&v==='-1',reason:v==='-1'?'已拦截负数数量，本行没有写入。':'本步输入 -1，再验证系统会拒绝保存。'};
  case 'edit-valid':return {ok:action==='check'&&v==='3',reason:v==='3'?'数量 3 已模拟保存，3 × ¥125 = ¥375。':'输入正整数 3，才能得到示例合计 ¥375。'};
  case 'edit-cancel':return {ok:action==='cancel'&&v==='9',reason:action==='cancel'&&v==='9'?'编辑已取消：已保存数量仍为 3，未写入草稿 9。':'请先输入草稿数量 9，然后点击「取消本次编辑」。'};
  case 'permission-sales':return {ok:choice==='deny',reason:choice==='deny'?'已阻止业务员查看全部员工工资。':'本练习中业务员不具备读取全部工资的授权。'};
  case 'permission-finance':return {ok:choice==='allow',reason:choice==='allow'?'已授权财务查看其权限范围内的工资汇总。':'本练习中的财务岗位经授权可以查看工资汇总。'};
  case 'permission-production':return {ok:choice==='deny',reason:choice==='deny'?'已拒绝生产岗位修改报价规则。':'生产岗位的工序管理权限不包含报价规则配置权限。'};
  case 'kanban-next':return {ok:choice==='production',reason:choice==='production'?'状态从待生产推进到生产中。':'工序开始后应进入生产中。'};
  case 'kanban-skip':return {ok:choice==='reject',reason:choice==='reject'?'已阻止直接跳过工序。':'不能从待生产直接跳到已完成。'};
  case 'kanban-rework':return {ok:choice==='pending-log'&&v.length>=3&&String(data.times??'')==='2',reason:choice==='pending-log'&&v.length>=3&&String(data.times??'')==='2'?'状态回退待生产；补料原因及第 2 次记录已保留（模拟）。':'应选择「回退待生产并记录」，填写至少 3 字的原因，次数为 2。'};
 }
 return {ok:false,reason:'未知练习步骤，未保存。'};
}
const opt=(items,placeholder='请选择处理方式')=>`<label class="mission-field"><span>${esc(placeholder)}</span><select class="field" name="choice"><option value="">请选择</option>${items.map(([v,label])=>`<option value="${esc(v)}">${esc(label)}</option>`).join('')}</select></label>`;
const inp=(label,placeholder='',type='text',value='')=>`<label class="mission-field"><span>${esc(label)}</span><input class="field" name="value" type="${type}" placeholder="${esc(placeholder)}" value="${esc(value)}"></label>`;
function controls(kind){
 if(kind==='validation-empty')return inp('客户名称（故意留空）','请输入客户名称');
 if(kind==='validation-valid')return inp('客户名称','例如：瑞冠口腔');
 if(kind==='dependent-a'||kind==='dependent-b')return `<div class="mission-fixture">示例订单长边：<strong>${kind==='dependent-a'?'80':'120'}cm</strong></div>${opt([['a','示例材料 A'],['b','示例材料 B']],'选择匹配的示例材料')}`;
 if(kind==='dependent-invalid')return `<div class="mission-fixture">长边输入：<strong>-5cm</strong></div>${opt([['a','仍用材料 A'],['b','仍用材料 B'],['reject','拒绝并提示非法尺寸']])}`;
 if(kind==='price-long'||kind==='price-area')return `<div class="mission-fixture">已确认计价规则 · ${kind==='price-long'?'20 × 40cm':'110 × 100cm'}</div>${opt([['long','按最长边'],['area','按面积'],['review','转人工确认']],'选择计价方式')}${inp(kind==='price-long'?'计价量（m）':'计价量（㎡）','请输入数值','number')}`;
 if(kind==='price-mixed')return `<div class="mission-fixture">110 × 80cm · 混合边界</div>${opt([['long','自动按最长边'],['area','自动按面积'],['review','待确认规则，转人工核实']])}`;
 if(kind.startsWith('edit-'))return `<div class="mission-fixture">编号 BJ-1028 · 示例单价 <strong>¥125</strong> · ${kind==='edit-invalid'?'原数量 1':kind==='edit-valid'?'原数量 1':'已保存数量 3'}</div>${inp('编辑数量',kind==='edit-invalid'?'输入 -1':kind==='edit-valid'?'输入 3':'输入 9','number',kind==='edit-invalid'?'1':kind==='edit-valid'?'1':'3')}`;
 if(kind.startsWith('permission-'))return `<div class="mission-fixture">${kind==='permission-sales'?'业务员 → 查看全部员工工资':kind==='permission-finance'?'财务 → 查看授权范围内工资汇总':'生产主管 → 修改价格配置'}</div>${opt([['allow','允许操作'],['deny','拒绝操作']],'权限判断')}`;
 if(kind==='kanban-next')return `<div class="mission-fixture">待生产 → ？</div>${opt([['production','生产中'],['done','已完成'],['pending','保留待生产']])}`;
 if(kind==='kanban-skip')return `<div class="mission-fixture">待生产 → 已完成（尝试跳步）</div>${opt([['done','接受跳步'],['reject','拒绝非法跳步']])}`;
 if(kind==='kanban-rework')return `<div class="mission-fixture">生产中 · 原补料次数 1</div>${opt([['pending','仅回退待生产'],['pending-log','回退待生产并记录原因/次数']])}${inp('补料原因（至少 3 字）','如：字壳损坏') }<label class="mission-field"><span>累计补料次数</span><input name="times" class="field" type="number" value="1" min="0" max="20"></label>`;
 return '';
}
function progressOf(id){const d=state[id]||{};return {passed:Array.isArray(d.passed)?d.passed:[],attempts:Number(d.attempts)||0,feedback:d.feedback||''};}
function stage(id){
 const item=map[id],p=progressOf(id),idx=p.passed.length,total=item.steps.length;
 if(idx>=total)return `<div class="mission-success" role="status"><strong>实训完成 · ${total}/${total} 步</strong><p>本项训练已验证通过。你可以查看对应组件的说明与 Codex 任务，再考虑如何实现真实业务。</p><div class="mission-actions"><a class="btn btn-soft" href="#/components/detail/${esc(id)}">返回组件</a><button class="btn btn-ghost" type="button" data-mission-action="reset" data-mission-id="${esc(id)}">重新练习</button></div></div>`;
 const step=item.steps[idx],isCancel=step.kind==='edit-cancel';
 return `<div class="mission-stage"><div class="mission-steps" aria-label="完成进度">${item.steps.map((s,i)=>`<span class="${i<idx?'done':i===idx?'current':''}" title="${esc(s.title)}">${i+1}</span>`).join('')}</div><p class="micro">第 ${idx+1} / ${total} 步 · ${esc(item.category)} · 已尝试 ${p.attempts} 次</p><h2>${esc(step.title)}</h2><p class="mission-instructions">${esc(step.prompt)}</p><div class="mission-controls">${controls(step.kind)}</div><div class="mission-actions"><button type="button" class="btn btn-primary" data-mission-action="${isCancel?'cancel':'check'}" data-mission-id="${esc(id)}">${isCancel?'取消本次编辑':'验证本步'}</button><a class="btn btn-ghost" href="#/components/detail/${esc(id)}">查看原组件</a></div><div class="mission-feedback ${p.feedback.startsWith('请')?'needs-attention':''}" id="missionFeedback" role="status" aria-live="polite">${esc(p.feedback||'请完成上方操作。系统会检查真实输入，而不是只记录点击。')}</div><details class="mission-hint"><summary>查看原理说明</summary><p>${esc(step.why)}</p></details></div>`;
}
function catalog(){
 const done=count();return `<div class="page-enter detail-width"><div class="breadcrumb"><a href="#/components">组件</a><span>›</span><span>业务实训</span></div><h1>组件业务实训</h1><p class="subhead">6 个可交互、可自动判定的教学任务。通过真实输入完成练习，不涉及正式订单与生产数据。</p><div class="mission-overview"><strong>${done} / 6</strong><span>已完成</span><div class="progressbar" aria-label="练习完成数"><span style="width:${done/6*100}%"></span></div></div><div class="mission-grid">${specs.map(s=>`<a class="card mission-tile" href="#/components/mission/${s.id}"><div class="mission-tile-head"><strong>${esc(s.title)}</strong><span class="token ${complete(s.id)?'token-green':'token-neutral'}">${complete(s.id)?'已通过':'待练习'}</span></div><p>${esc(s.intro)}</p><span class="micro">${(state[s.id]?.passed||[]).length}/${s.steps.length} 步 · ${esc(s.category)}</span></a>`).join('')}</div><p class="micro mission-caution">所有尺寸阈值、材料 A/B、单价和岗位判断均为练习样本。报价混合边界不自动推定，未定义的规则必须人工确认。</p></div>`;
}
function page(id){
 const item=map[id];if(!item)return `<div class="page-enter detail-width"><h1>找不到这个实训</h1><a href="#/components/missions">返回实训目录</a></div>`;
 return `<div class="page-enter detail-width"><div class="breadcrumb"><a href="#/components">组件</a><span>›</span><a href="#/components/missions">业务实训</a><span>›</span><span>${esc(item.title)}</span></div><a class="back-link" href="#/components/missions">← 返回实训目录</a><h1>${esc(item.title)}</h1><p class="subhead">${esc(item.intro)}</p><div class="card mission-shell" id="missionStage">${stage(id)}</div><p class="micro mission-caution">练习成绩保存在当前浏览器独立的数据键中。练习结果不代表生产系统已经实现对应的权限、计价和库存保护。</p></div>`;
}
function lessonLinks(id){const items=specs.filter(s=>(lessons[s.id]||[]).includes(Number(id)));if(!items.length)return '';return `<div class="related-knowledge"><strong>可操作实训</strong><div>${items.map(s=>`<a href="#/components/mission/${s.id}">${esc(s.title)} · ${complete(s.id)?'已通过':'开始'}</a>`).join('')}</div></div>`;}
function has(id){return Boolean(map[id])}
function handleClick(event){
 const target=event.target.closest('[data-mission-action]');if(!target)return false;
 const id=target.dataset.missionId,action=target.dataset.missionAction;
 if(!map[id])return false;
 event.preventDefault();
 if(action==='reset'){state[id]={passed:[],attempts:0,feedback:''};persist();const root=document.getElementById('missionStage');if(root)root.innerHTML=stage(id);return true}
 const root=document.getElementById('missionStage');if(!root)return true;
 const p=progressOf(id),idx=p.passed.length;
 if(idx>=map[id].steps.length)return true;
 const data=Object.fromEntries([...root.querySelectorAll('input[name],select[name]')].map(el=>[el.name,el.value]));
 const result=grade(id,idx,data,action);
 p.attempts++;
 if(result.ok){p.passed=[...p.passed,idx];p.feedback='';}
 else{p.feedback='请检查：'+result.reason;}
 state[id]=p;persist();
 root.innerHTML=stage(id);
 if(result.ok&&p.passed.length<map[id].steps.length){const feedback=root.querySelector('#missionFeedback');if(feedback)feedback.textContent='上一步通过：'+result.reason+' 请继续下一步。';}
 const focus=root.querySelector('.mission-stage h2, .mission-success strong');if(focus){focus.setAttribute('tabindex','-1');focus.focus({preventScroll:true});}
 return true;
}
window.V8Missions={has,catalog,page,lessonLinks,handleClick,grade,count,ids:specs.map(x=>x.id),stepsFor:id=>map[id]?.steps.length||0,storageKey:STORAGE};
})();