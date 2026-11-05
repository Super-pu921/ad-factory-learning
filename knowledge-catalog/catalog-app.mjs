import {buttonPilot,calculateDemoQuote,createSubmissionGate} from './button-pilot.mjs';
import {curriculum,curriculumById} from './curriculum.mjs';
import {renderCurriculumDemo} from './curriculum-demos.mjs';

const domainNames=['基础控件与视觉元素','页面布局与响应式','导航与页面组织','表单与数据输入','数据展示与高级数据表格','状态与系统反馈','弹层、浮层与复杂交互','文件、媒体与专业编辑器','图表与专业数据可视化','地图与地理可视化','流程图、节点与画布编辑','企业业务组件与工作流','多人协作与实时交互','AI / Agent 专题','无障碍、国际化与主题','工程化交互与系统运行模式'];
const candidateNames=[['G01','浏览器运行与渲染'],['G02','Web 网络与通信'],['G03','数据库与数据建模'],['G04','前端框架运行原理'],['G05','CSS 与视觉渲染工程'],['G06','图形学与计算'],['G07','软件架构与设计模式'],['G08','开发工具链与协作工程'],['G09','云基础设施与部署运维'],['G11','数据结构与算法'],['G12','操作系统与计算机组成'],['G13','编程语言与类型系统'],['G14','数学与数据计算基础']];
const $ = id => document.getElementById(id);
const node = (tag,className='',text='') => {
  const element=document.createElement(tag);
  if(className) element.className=className;
  if(text) element.textContent=text;
  return element;
};
const button = (text,action,className='') => {
  const element=node('button',className,text);element.type='button';
  element.addEventListener('click',action);return element;
};
let catalog,byId,domain='all',limit=40,disposeExperiment=()=>{};
const hasTeaching=id=>id===buttonPilot.knowledgeId||curriculumById.has(id);

function renderDomains() {
  const options=[{id:'all',name:'全部领域',entries:catalog.entries.length},...catalog.domains.map((item,index)=>({...item,name:domainNames[index]}))];
  $('domains').replaceChildren(...options.map(item=>{
    const control=button(item.id==='all'?item.name:`${item.id} · ${item.name}`,()=>{
      domain=item.id;limit=40;
      [...$('domains').children].forEach(element=>element.setAttribute('aria-pressed',String(element.dataset.domain===domain)));
      renderResults();
    });
    control.dataset.domain=item.id;
    control.setAttribute('aria-pressed',String(domain===item.id));
    const taught=catalog.entries.filter(entry=>(item.id==='all'||entry.domain===item.id)&&hasTeaching(entry.id)).length;
    control.append(node('span','domain-count',`${item.entries} · 教学 ${taught}`));
    return control;
  }));
}

function renderResults() {
  const query=$('catalogSearch').value.trim().toLocaleLowerCase();
  const results=catalog.entries.filter(entry=>(domain==='all'||entry.domain===domain)&&
    (!$('teachingOnly').checked||hasTeaching(entry.id))&&
    (!query||[entry.id,entry.name,entry.topics,...(curriculumById.get(entry.id)?.units.map(unit=>unit.objective)||[])].some(value=>value.toLocaleLowerCase().includes(query))));
  const shown=results.slice(0,limit);
  $('resultCount').textContent=`${results.length} 个目录入口${results.length>shown.length?` · 已显示 ${shown.length} 个`:''}`;
  $('catalogResults').replaceChildren(...shown.map(entry=>{
    const article=node('article','entry');article.append(node('span','entry-id',entry.id));
    const title=node('h3');title.append(button(entry.name,()=>{location.hash=entry.id;}));article.append(title,node('p','',entry.topics));
    const tags=node('div','tags');tags.append(node('span','tag',entry.type));
    if(entry.canonicalId!==entry.id) tags.append(node('span','tag','历史别名'));
    if(entry.id===buttonPilot.knowledgeId) tags.append(node('span','tag sample','教学样板 · L1 / L2 / L3'));
    else if(curriculumById.has(entry.id))tags.append(node('span','tag sample','分层教学 · L1 / L2 / L3'));
    article.append(tags);return article;
  }));
  if(!shown.length) $('catalogResults').append(node('p','empty','没有匹配条目。可清除搜索或选择其他领域。'));
  $('showMore').hidden=shown.length>=results.length;
}

function section(title,body) {
  const block=node('section','lesson-section');block.append(node('h3','',title));
  block.append(typeof body==='string'?node('p','',body):body);return block;
}

function renderL1Demo() {
  const demo=node('div','live-demo');demo.append(node('h4','','试一试 · 点击与禁用'));
  const output=node('p','feedback','已激活 0 次');output.setAttribute('role','status');
  let count=0;
  const activate=button('执行示例操作',()=>{output.textContent=`已激活 ${++count} 次`;},'primary');activate.id='activateDemo';
  const disabled=node('input');disabled.type='checkbox';disabled.id='disableDemo';
  disabled.addEventListener('change',()=>{activate.disabled=disabled.checked;});
  const label=node('label');label.append(disabled,document.createTextNode('禁用操作'));
  const controls=node('div','controls');controls.append(activate,label,button('重置',()=>{count=0;disabled.checked=false;activate.disabled=false;output.textContent='已激活 0 次';}));
  demo.append(controls,output);return demo;
}

function renderL2Demo() {
  const demo=node('div','live-demo');demo.append(node('h4','','试一试 · 等待、失败与重试'));
  const output=node('p','feedback','尚未执行');output.setAttribute('role','status');
  const failure=node('input');failure.type='checkbox';failure.id='simulateFailure';
  const label=node('label');label.append(failure,document.createTextNode('模拟失败'));
  const gate=createSubmissionGate();let attempts=0;
  const submit=button('提交示例',()=>gate(async()=>{
    const shouldFail=failure.checked;attempts++;submit.disabled=true;failure.disabled=true;submit.textContent='处理中…';
    output.classList.remove('error');output.textContent=`第 ${attempts} 次执行中`;
    try {
      await new Promise(resolve=>setTimeout(resolve,450));
      if(shouldFail) throw new Error('本次模拟失败，请重试');
      output.textContent=`第 ${attempts} 次执行成功`;
    } catch(error) { output.classList.add('error');output.textContent=`第 ${attempts} 次执行失败，可重试`; }
    finally { submit.disabled=false;failure.disabled=false;submit.textContent='提交示例'; }
  }),'primary');submit.id='submitDemo';
  const controls=node('div','controls');controls.append(submit,label);demo.append(controls,output);return demo;
}

function renderL3Demo() {
  const demo=node('div','live-demo');demo.append(node('h4','','试一试 · 教学报价'));
  const form=node('form');form.noValidate=true;
  const fields=node('div','quote-fields');
  const quantity=node('input');quantity.id='demoQuantity';quantity.inputMode='numeric';quantity.value='2';
  const price=node('input');price.id='demoPrice';price.inputMode='decimal';price.value='120.50';
  for(const [input,title] of [[quantity,'数量'],[price,'教学单价（元）']]) {const label=node('label','',title);label.append(input);fields.append(label);}
  const submit=node('button','primary','生成教学报价');submit.type='submit';
  const output=node('p','feedback','填写示例参数后生成金额');output.setAttribute('role','status');
  form.append(fields,submit,output);
  form.addEventListener('submit',event=>{
    event.preventDefault();output.classList.remove('error');
    try { const quote=calculateDemoQuote(quantity.value.trim(),price.value.trim());output.textContent=`教学金额 ¥${quote.formatted} · ${quote.quantity} 项`; }
    catch(error) { output.classList.add('error');output.textContent=error.message; }
  });
  demo.append(form,node('p','subtle','本练习只在内存计算，不创建订单或保存学习记录。'));return demo;
}

function renderUnit(unit,container) {
  const goal=section('学习目标',unit.objective);container.replaceChildren(goal);
  for(const ref of unit.blockRefs) { const block=buttonPilot.blocks[ref.id];container.append(section(block.title,block.body)); }
  container.append([renderL1Demo,renderL2Demo,renderL3Demo][buttonPilot.units.indexOf(unit)]());
  const code=unit.level==='L1'?'<button type="button">执行示例操作</button>':unit.level==='L2'?`const { createSubmissionGate } = await import('./button-pilot.mjs');\nconst gate = createSubmissionGate();\nconst performTask = () => Promise.resolve('示例完成');\nconsole.log(await gate(performTask));\n// { executed: true, value: '示例完成' }`:`const { calculateDemoQuote } = await import('./button-pilot.mjs');\nconst quote = calculateDemoQuote('2', '120.50');\nconsole.log(quote.formatted); // "241.00"`;
  const codeContent=node('div');codeContent.append(node('p','','运行环境：支持 ES Modules 和原生 dialog 的现代浏览器，无第三方依赖。HTML 片段可放入页面；JavaScript 片段可在本页控制台运行。下方源码包含完整实现。'),node('pre','',code));
  const sourceLink=node('a','inline-link','查看完整样板源码');sourceLink.href='./button-pilot.mjs';sourceLink.target='_blank';sourceLink.rel='noopener';codeContent.append(sourceLink);
  container.append(section('代码与运行',codeContent),section('动手练习',unit.exercise));
  const list=node('ol');unit.acceptance.forEach(item=>list.append(node('li','',item)));
  container.append(section('验收条件',list),section('常见误区',unit.pitfall),section('小结',unit.summary));
}

function renderDetail() {
  disposeExperiment();disposeExperiment=()=>{};
  let id,level;
  try{[id,level]=decodeURIComponent(location.hash.slice(1)).split('/');}catch{return;}
  if(!id) return;
  const entry=byId.get(id),body=$('detailBody');
  $('detailTitle').textContent=entry?.name||'未找到知识条目';$('detailId').textContent=id;body.replaceChildren();
  if(!entry) body.append(node('p','','此 ID 不在当前原始目录中。'));
  else {
    body.append(node('p','',entry.topics));
    const trace=node('a','inline-link','查看原始目录条目');trace.href=`https://github.com/Super-pu921/ad-factory-learning/blob/main/knowledge-catalog/source/D01-D16-V1.0.md#L${entry.sourceLine}`;trace.target='_blank';trace.rel='noopener';body.append(trace);
    if(entry.canonicalId!==entry.id) {
      const alias=node('p','subtle',`此入口保留原 ID，主知识为 ${entry.canonicalId}。`);body.append(alias,button('查看主知识',()=>{location.hash=entry.canonicalId;}));
    }
    if(entry.id===buttonPilot.knowledgeId) {
      body.append(node('p','subtle','教学样板 · 分层目标与验收独立，不关联原有学习进度。'));
      const tabs=node('div','unit-tabs');tabs.setAttribute('aria-label','选择教学层级');
      const content=node('div');
      const select=unit=>{
        [...tabs.children].forEach((control,index)=>control.setAttribute('aria-pressed',String(buttonPilot.units[index]===unit)));
        renderUnit(unit,content);
        addUnitLink(entry.id,unit,content);
      };
      for(const unit of buttonPilot.units) tabs.append(button(`${unit.level} · ${unit.difficulty} · ${unit.title}`,()=>{setUnitRoute(entry.id,unit.level);select(unit);}));
      body.append(tabs,content);select(buttonPilot.units.find(unit=>unit.level===level)||buttonPilot.units[0]);
    } else if(curriculumById.has(entry.id)) {
      const lesson=curriculumById.get(entry.id),tabs=node('div','unit-tabs'),content=node('div');
      body.append(node('p','subtle','分层教学 · 各单元目标与验收独立，交互仅在内存运行。'));
      tabs.setAttribute('aria-label','选择教学层级');
      const select=unit=>{
        disposeExperiment();disposeExperiment=()=>{};
        [...tabs.children].forEach((control,index)=>control.setAttribute('aria-pressed',String(lesson.units[index]===unit)));
        content.replaceChildren(section('学习目标',unit.objective));
        for(const ref of unit.blockRefs){const block=lesson.blocks[ref.id];content.append(section(block.title,block.body));}
        const experiment=renderCurriculumDemo(lesson,unit,{node,button});disposeExperiment=experiment.dispose;content.append(experiment.element);
        const code=node('div');code.append(node('p','','浏览器控制台可运行下列 JavaScript；无第三方依赖。可复制代码至当前目录页面控制台，预期输出见下方。'),node('pre','',lesson.code),node('p','',`预期输出：${lesson.expected}`));
        const implementation=node('a','inline-link','查看完整交互实现');implementation.href='./curriculum-demos.mjs';implementation.target='_blank';implementation.rel='noopener';code.append(implementation);
        content.append(section('代码与运行',code),section('动手练习',unit.exercise));
        const checks=node('ol');unit.acceptance.forEach(check=>checks.append(node('li','',check)));
        content.append(section('验收条件',checks),section('常见误区',unit.pitfall),section('小结',unit.summary));
        if(lesson.references.length){const refs=node('ul');for(const [label,url] of lesson.references){const li=node('li'),link=node('a','',label);link.href=url;link.target='_blank';link.rel='noopener';li.append(link);refs.append(li);}content.append(section('延伸资料',refs));}
        addUnitLink(entry.id,unit,content);
      };
      for(const unit of lesson.units)tabs.append(button(`${unit.level} · ${unit.difficulty} · ${unit.title}`,()=>{setUnitRoute(entry.id,unit.level);select(unit);}));
      body.append(tabs,content);select(lesson.units.find(unit=>unit.level===level)||lesson.units[0]);
    } else if(entry.canonicalId===entry.id) body.append(node('p','subtle','当前已收录目录主题，完整教学内容待建设。'));
  }
  if(!$('entryDialog').open) $('entryDialog').showModal();
}

function setUnitRoute(id,level) {
  history.replaceState(null,'',`${location.pathname}${location.search}#${id}/${level}`);
}
function addUnitLink(id,unit,container) {
  const link=node('a','inline-link',`本单元直达链接 · ${unit.level}`);link.href=`#${id}/${unit.level}`;
  container.append(section('分享与复习',link));
}

$('searchForm').addEventListener('submit',event=>event.preventDefault());
$('catalogSearch').addEventListener('input',()=>{limit=40;renderResults();});
$('teachingOnly').addEventListener('change',()=>{limit=40;renderResults();});
$('clearSearch').addEventListener('click',()=>{$('catalogSearch').value='';limit=40;renderResults();$('catalogSearch').focus();});
$('showMore').addEventListener('click',()=>{limit+=40;renderResults();});
function clearDetailRoute() {
  disposeExperiment();disposeExperiment=()=>{};
  if(location.hash)history.replaceState(null,'',location.pathname+location.search);
}
$('closeDialog').addEventListener('click',()=>{clearDetailRoute();$('entryDialog').close();});
$('entryDialog').addEventListener('cancel',event=>{if(event.target===$('entryDialog'))clearDetailRoute();});
window.addEventListener('hashchange',()=>{if(catalog) {if(location.hash)renderDetail();else {disposeExperiment();disposeExperiment=()=>{};$('entryDialog').close();}}});

try {
  const response=await fetch('./catalog.json',{cache:'no-store'});
  if(!response.ok) throw new Error(`HTTP ${response.status}`);
  catalog=await response.json();
  if(!Array.isArray(catalog.entries)||catalog.entries.length!==840)throw new Error('目录结构不完整');
  byId=new Map(catalog.entries.map(entry=>[entry.id,entry]));
  $('summary').textContent=`16 个领域 · ${catalog.entries.length} 个原始入口 · ${catalog.statistics.preliminaryCanonicalConcepts} 个初步概念`;
  $('teachingCoverage').textContent=`已有教学：${curriculum.length+1} 个主题 · ${curriculum.reduce((count,lesson)=>count+lesson.units.length,buttonPilot.units.length)} 个分层单元`;
  candidateNames.forEach(([key,name])=>$('d17List').append(node('li','',`${key} · ${name}`)));
  renderDomains();renderResults();renderDetail();
} catch(error) {
  $('summary').textContent='目录暂时无法读取';
  $('catalogResults').replaceChildren(node('p','error-box',`读取失败：${error.message}。请刷新页面重试。`));
}
