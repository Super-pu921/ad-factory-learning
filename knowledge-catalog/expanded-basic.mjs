import {basicSeeds} from './expanded-basic-definitions.mjs';
import {basicFixtures,runBasicModel,demoRows} from './expanded-basic-models.mjs';
import {basicExamples} from './expanded-basic-examples.mjs';

const familyLimits={
  visual:'只改变当前教学预览；不保存用户设置、不读取账户或剪贴板。',
  layout:'布局限定在当前教学框内；不更改工作台布局。安全区域的附加值为显式模拟值，未做真机刘海设备验收。',
  nav:'只切换当前教学框的三个虚构目标，不操作外层课程路由、浏览器历史或学习进度。',
  field:'输入为手工教学数据；不提交真实表单、不认证身份、不读取用户文件、不写学习记录。格式校验是有限教学契约，不能代替服务端校验。',
  grid:'仅处理内置三行或100项虚构数据。所有编辑为内存副本，代码/Markdown/TSV按受限文本处理，不执行表达式、不读系统剪贴板。',
  feedback:'所有业务状态和链路为教学模拟；没有真实请求、权限验证、账户、服务恢复或用户数据保存。'
};
export const basicDefinitions=basicSeeds.map(seed=>{
  const family=seed.kind.split('-')[0];
  const fixture=basicFixtures[seed.kind]||(family==='layout'?['240','160','0']:family==='nav'?['1','2','0']:null);
  if(!fixture)throw new Error('Missing fixture: '+seed.kind);
  const [initial,good,bad]=fixture;
  return {...seed,initial,good,bad,principle:seed.observe,mechanism:seed.verify,
    limits:familyLimits[family],interact:`将演示输入从 ${JSON.stringify(initial)} 改为 ${JSON.stringify(good)}，应用后操作预览控件，核对反馈。`,
    invariant:seed.verify,invalid:`尝试 ${JSON.stringify(bad)}；校验失败时保留上一次有效预览，不执行外部操作。`,
    code:`const {runBasicExample}=await import('./expanded-basic.mjs');\nconsole.log(JSON.stringify(runBasicExample('${seed.knowledgeId}',${JSON.stringify(initial)})));`,
    expected:JSON.stringify(basicExamples[seed.knowledgeId]),references:[]};
});
const byId=new Map(basicDefinitions.map(def=>[def.knowledgeId,def]));
export function runBasicExample(id,raw) {const def=byId.get(id);if(!def)throw new TypeError('Unknown component ID');return runBasicModel(def.kind,raw===undefined?def.initial:raw);}
const node=(tag,text='',className='')=>{const el=document.createElement(tag);el.textContent=text;if(className)el.className=className;return el;};
const button=(name,action)=>{const el=node('button',name);el.type='button';el.addEventListener('click',action);return el;};
const svgNode=(tag,attrs={})=>{const el=document.createElementNS('http://www.w3.org/2000/svg',tag);for(const [key,value] of Object.entries(attrs))el.setAttribute(key,String(value));return el;};
function chips(parent,values) {for(const value of values)parent.append(node('span',String(value),'basic-chip'));}
function selection(parent,values,current,change,{role='group',links=false,vertical=false}={}) {
  parent.setAttribute('role',role);parent.setAttribute('aria-label','教学选项');if(vertical)parent.classList.add('basic-vertical');
  const controls=values.map(value=>{
    const control=links?node('a',value.label):button(value.label,()=>change(value.value));
    if(links){control.href='#local-'+value.value;control.addEventListener('click',event=>{event.preventDefault();change(value.value);});control.setAttribute('aria-current',value.value===current?'page':'false');}
    else control.setAttribute('aria-pressed',String(value.value===current));
    if(role==='menu'||role==='menubar'){control.setAttribute('role','menuitem');control.removeAttribute('aria-pressed');control.tabIndex=value.value===current?0:-1;}
    control.dataset.choice=value.value;parent.append(control);return control;
  });
  parent.addEventListener('keydown',event=>{
    if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(event.key))return;
    const index=controls.indexOf(document.activeElement);if(index<0)return;event.preventDefault();
    const next=event.key==='Home'?0:event.key==='End'?controls.length-1:(index+(['ArrowLeft','ArrowUp'].includes(event.key)?-1:1)+controls.length)%controls.length;
    controls.forEach((control,i)=>{if(role==='menu'||role==='menubar')control.tabIndex=i===next?0:-1;});controls[next].focus();
  });
}

export function renderBasicDemo(root,def) {
  if(!byId.has(def.knowledgeId))throw new TypeError('Unknown basic demo');
  root.dataset.demo=def.kind;root.classList.add('expanded-demo');
  const label=node('label','演示输入'),input=node(def.initial.includes('\n')?'textarea':'input');
  if(input.tagName==='INPUT')input.type=def.kind==='field-password'?'password':'text';input.value=def.initial;input.dataset.input='';input.maxLength=2000;
  label.append(input);const error=node('p','','basic-error');error.dataset.error='';error.setAttribute('role','alert');
  const preview=node('div','','basic-preview');preview.dataset.preview='';
  const output=node('pre','','basic-result');output.dataset.result='';output.setAttribute('role','status');
  let lastRaw=def.initial,disposed=false,cleanPaint=()=>{},teachingDraft='虚构教学备注';
  const setRaw=value=>{input.value=String(value);update();};
  const apply=button('应用演示值',()=>update());
  root.append(node('h4',def.title+' · 可运行演示'),node('p',def.limits,'subtle'),label,apply,error,preview,output);
  function update() {
    if(disposed)return;
    let model;try{model=runBasicExample(def.knowledgeId,input.value);}catch(reason){error.textContent=reason.message;input.setAttribute('aria-invalid','true');return;}
    cleanPaint();cleanPaint=()=>{};error.textContent='';input.setAttribute('aria-invalid','false');lastRaw=input.value;
    preview.replaceChildren();output.textContent=JSON.stringify(model);preview.dataset.validInput=lastRaw;
    const family=def.kind.split('-')[0],variant=def.kind.slice(family.length+1);
    if(family==='visual')paintVisual(variant,model);
    else if(family==='layout')paintLayout(variant,model);
    else if(family==='nav')paintNavigation(variant,model);
    else if(family==='field')paintField(variant,model);
    else if(family==='grid')paintGrid(variant,model);
    else if(family==='feedback')paintFeedback(variant,model);
    else throw new Error('No renderer for '+def.kind);
  }
  const choose=value=>{setRaw(value);preview.querySelector(`[data-choice="${String(value).replace(/[^\w-]/g,'')}"]`)?.focus();};
  const simpleChoices=(values,current,options={})=>{const group=node('div','','basic-actions');selection(group,values.map(value=>({value,label:value})),current,choose,options);preview.append(group);return group;};
  function paintVisual(variant,model) {
    switch(variant) {
      case 'group':simpleChoices(['A','B'],model.selected);break;
      case 'split':{preview.append(button('保存教学草稿',()=>setRaw('save')));const details=node('details'),summary=node('summary','更多动作');details.append(summary,button('导出教学视图',()=>setRaw('export')));preview.append(details,node('p','当前动作：'+model.action));break;}
      case 'fab':{const action=button('+ 创建教学卡片',()=>setRaw(Math.min(9,model.created+1)));action.className='basic-fab';preview.append(action,node('p',`虚构卡片 ${model.created} 张`));break;}
      case 'toggle':{const action=button(model.pressed?'关闭网格':'打开网格',()=>setRaw(model.pressed?'off':'on'));action.setAttribute('aria-pressed',String(model.pressed));preview.append(action);break;}
      case 'toolbar':simpleChoices(['left','center','right'],model.align,{role:'toolbar'});preview.append(Object.assign(node('p','教学工单标题'),{style:`text-align:${model.align}`}));break;
      case 'type':{const text=node('p','教学工单标题与说明');text.style.fontSize=model.size+'px';preview.append(text);break;}
      case 'icon':{const icon=node('span',model.icon==='check'?'✓':'ⓘ','basic-icon');icon.setAttribute('role','img');icon.setAttribute('aria-label',model.icon==='check'?'检查通过':'信息');preview.append(icon,node('span',model.icon));break;}
      case 'avatar':preview.append(node('span',model.initials,'basic-avatar'));break;
      case 'avatars':model.visible.forEach(name=>preview.append(node('span',name,'basic-avatar')));if(model.overflow)preview.append(node('span','+'+model.overflow,'basic-avatar'));break;
      case 'chip':for(const tag of model.tags){const chip=node('span',tag,'basic-chip');chip.append(button('移除 '+tag,()=>setRaw(model.tags.filter(value=>value!==tag).join(','))));preview.append(chip);}if(!model.tags.length)preview.append(node('p','无标签'));break;
      case 'label':{const a=node('input'),b=node('input');a.id=def.knowledgeId+'-name';b.id=def.knowledgeId+'-qty';a.setAttribute('aria-label','教学名称');b.setAttribute('aria-label','教学数量');const association=node('label','点击字段标签');association.htmlFor=def.knowledgeId+'-'+model.for;preview.append(association,a,b);break;}
      case 'divider':{preview.classList.add('basic-actions');preview.append(node('span','原始内容'));const line=node('div');line.setAttribute('role','separator');line.setAttribute('aria-orientation',model.orientation);line.className='basic-divider '+model.orientation;preview.append(line,node('span','补充内容'));break;}
      case 'swatch':{const swatch=node('span',model.color,'basic-swatch');swatch.style.background=model.color;preview.append(swatch);break;}
      case 'key':model.keys.forEach(key=>preview.append(node('kbd',key)));break;
      case 'code':preview.append(node('code',model.text));break;
      case 'theme':{const card=node('article','同一张教学工单','basic-theme');card.dataset.theme=model.theme;preview.append(card,button('切换预览主题',()=>setRaw(model.theme==='light'?'dark':'light')));break;}
      case 'density':{const list=node('ul');list.dataset.density=lastRaw;for(const value of ['A','B','C']){const li=node('li',value);li.style.padding=model.padding+'px';list.append(li);}preview.append(list);break;}
      default:throw new Error('Unimplemented visual component '+variant);
    }
  }
  function paintLayout(variant,model) {
    const stage=node('div','','basic-layout layout-'+variant);stage.style.width=model.width+'px';stage.dataset.layout=variant;preview.append(stage);
    const count=['scroll','sticky','affix'].includes(variant)?8:variant==='dashboard'?5:3;
    const cards=Array.from({length:count},(_,i)=>node('div',`教学卡片 ${i+1}${variant==='masonry'&&i%2?'\n较长说明\n仍按列流动':''}`,'basic-tile'));
    const toggle=()=>{const target=stage.querySelector('[data-toggle]');if(target){target.hidden=!target.hidden;const trigger=preview.querySelector('[data-layout-action]');trigger?.setAttribute('aria-expanded',String(!target.hidden));}};
    if(['shell','header','footer','sidebar'].includes(variant)) {
      stage.classList.add('basic-shell');const header=node('header','工单标题'),aside=node('aside','教学导航'),main=node('main','教学工单正文'),footer=node('footer','审核说明');aside.dataset.toggle='';stage.append(header,aside,main,footer);
      const action=button('切换辅助区域',toggle);action.dataset.layoutAction='';action.setAttribute('aria-expanded','true');if(variant==='header')header.append(action);else preview.append(action);
      if(variant==='footer'){const state=node('output','待检查');footer.append(state,button('完成底部教学检查',()=>{state.textContent='教学检查完成';}));}
    } else if(variant==='panel') {const content=node('section','教学工单备注');content.dataset.toggle='';stage.append(node('h5','内容面板'),content);const action=button('折叠或展开',toggle);action.dataset.layoutAction='';action.setAttribute('aria-expanded','true');preview.append(action);}
    else if(variant==='portal') {const source=node('div','原挂载区','basic-portal-source'),destination=node('div','门户根','basic-portal-root'),tip=node('p','同一个提示节点');tip.dataset.portalNode='';source.append(tip);stage.append(source,destination);preview.append(button('移动同一提示节点',()=>{(tip.parentNode===source?destination:source).append(tip);}));}
    else if(variant==='overlayroot') {stage.append(...cards);const overlay=node('div','局部浮层','basic-overlay');overlay.dataset.overlay='';stage.append(overlay);preview.append(button('切换局部浮层',()=>{overlay.hidden=!overlay.hidden;}));}
    else if(variant==='splitter') {const left=node('section','左侧详情'),right=node('section','右侧摘要'),separator=node('div','↔','basic-splitter');let ratio=50;const resize=()=>{stage.style.gridTemplateColumns=`minmax(0,${ratio}fr) 12px minmax(0,${100-ratio}fr)`;separator.setAttribute('aria-valuenow',String(ratio));};separator.role='separator';separator.tabIndex=0;separator.setAttribute('aria-orientation','vertical');separator.setAttribute('aria-valuemin','20');separator.setAttribute('aria-valuemax','80');separator.setAttribute('aria-label','教学分隔条');separator.addEventListener('keydown',event=>{if(!['ArrowLeft','ArrowRight'].includes(event.key))return;event.preventDefault();ratio=Math.max(20,Math.min(80,ratio+(event.key==='ArrowRight'?10:-10)));resize();});stage.append(left,separator,right);resize();}
    else if(variant==='safearea') {stage.append(...cards);stage.style.setProperty('--demo-inset','0px');preview.append(button('切换24px模拟安全留白',()=>{stage.style.setProperty('--demo-inset',stage.style.getPropertyValue('--demo-inset')==='0px'?'24px':'0px');}));}
    else {stage.append(...cards);if(variant==='sticky')stage.prepend(node('header','粘性标题'));if(variant==='affix')stage.append(node('span','局部固定标记','basic-affixed'));if(['scroll','sticky','affix'].includes(variant))preview.append(button('滚动教学区域',()=>{stage.scrollTop=120;}));if(variant==='resizable')stage.title='可拖动右下角手柄，也可用上方宽度输入';}
  }
  function paintNavigation(variant,model) {
    const options=[{value:'1',label:'概览'},{value:'2',label:'工单'},{value:'3',label:'记录'}];
    const content=node('section',model.label+' · 虚构教学内容','basic-nav-content');content.dataset.currentPage=String(model.page);
    const makeOptions=(target,optionsConfig={})=>selection(target,options,String(model.page),choose,optionsConfig);
    if(variant==='collapse'){const details=node('details'),summary=node('summary','折叠教学说明');details.open=model.page!==1;details.append(summary,content);preview.append(details);return;}
    if(['anchor','backtop'].includes(variant)){const area=node('div','','basic-scroll-doc');area.dataset.localScroll='';for(let i=1;i<=3;i++){const section=node('section',options[i-1].label);section.style.minHeight='140px';section.dataset.chapter=String(i);area.append(section);}preview.append(area);if(variant==='backtop'){area.scrollTop=(model.page-1)*120;preview.append(button('返回教学区域顶部',()=>{area.scrollTop=0;}));}else for(const option of options){const a=node('a',option.label);a.href='#chapter-'+option.value;a.addEventListener('click',event=>{event.preventDefault();area.scrollTop=(Number(option.value)-1)*140;});preview.append(a);}return;}
    if(variant==='pageheader'){const header=node('header',model.label);header.append(button('返回教学概览',()=>setRaw('1')));preview.append(header,content);return;}
    if(variant==='tour'){const targets=node('div','','basic-tour-targets');for(const option of options){const target=node('section',option.label+'教学区域','basic-tour-target');target.dataset.tourTarget=option.value;target.dataset.active=String(Number(option.value)===model.page);if(Number(option.value)===model.page){target.style.outline='3px solid #315dde';target.append(node('p','当前引导：请检查'+option.label+'区域。'));}targets.append(target);}preview.append(targets,button('上一引导目标',()=>setRaw(model.page===1?3:model.page-1)),button('下一教学步骤',()=>setRaw(model.page===3?1:model.page+1)),content);return;}
    if(variant==='stepper'){const steps=node('ol','','basic-steps');options.forEach(option=>{const li=node('li',option.label);li.setAttribute('aria-current',String(model.page)===option.value?'step':'false');if(String(model.page)===option.value)li.classList.add('current');steps.append(li);});preview.append(steps,button('下一教学步骤',()=>setRaw(model.page===3?1:model.page+1)),content);return;}
    if(variant==='tree'){const tree=node('div'),branch=node('details'),summary=node('summary','教学项目');tree.role='tree';branch.open=true;branch.append(summary);const group=node('div');makeOptions(group,{vertical:true});branch.append(group);tree.append(branch);preview.append(tree,content);return;}
    const group=node(['navigation','bottom','link','rail'].includes(variant)?'nav':'div','','basic-actions '+(['bottom','rail'].includes(variant)?'basic-'+variant:''));
    if(['dropdown','speed','mega','command'].includes(variant)){const opener=button(variant==='speed'?'+ 快捷操作':'展开教学命令',()=>{group.hidden=!group.hidden;opener.setAttribute('aria-expanded',String(!group.hidden));});opener.setAttribute('aria-expanded','false');group.hidden=true;preview.append(opener);if(variant==='command'){const query=node('input');query.setAttribute('aria-label','筛选教学命令');query.addEventListener('input',()=>{for(const command of group.querySelectorAll('[data-choice]'))command.hidden=!command.textContent.includes(query.value);});preview.append(query);}if(variant==='mega')group.append(node('strong','教学页面分组'));}
    makeOptions(group,{links:['navigation','bottom','link','rail'].includes(variant),vertical:variant==='rail',role:variant==='menubar'?'menubar':variant==='menu'||variant==='dropdown'?'menu':'group'});
    preview.append(group,content);
  }
  function paintField(variant,model) {
    const box=node('div','','basic-field-preview');preview.append(box);
    const native=(type,value,change=event=>setRaw(event.target.value))=>{const field=node('input');field.type=type;field.value=value;field.setAttribute('aria-label','交互字段');field.addEventListener('change',change);box.append(field);return field;};
    const choiceGroup=(values,current,multiple=false)=>{for(const value of values){const label=node('label',value),control=node('input');control.type=multiple?'checkbox':'radio';control.name=def.knowledgeId+'-choice';control.checked=multiple?current.includes(value):current===value;control.addEventListener('change',()=>{const selected=[...box.querySelectorAll('input:checked')].map(item=>item.value);setRaw(multiple?selected.join(','):value);});control.value=value;label.prepend(control);box.append(label);}};
    if(variant==='textarea'||variant==='mentions'){const field=node('textarea');field.setAttribute('aria-label','交互字段');field.value=lastRaw;field.addEventListener('change',()=>setRaw(field.value));box.append(field);if(variant==='mentions')box.append(button('插入教学成员Bo',()=>setRaw('@Bo ok')));return;}
    if(['password','email','url','phone','search','mask','currency','percent','unit','field','inputgroup'].includes(variant)) {
      const type={password:'password',email:'email',url:'url',phone:'tel',search:'search'}[variant]||'text';const field=native(type,lastRaw);
      if(variant==='password')box.append(button('切换密码显隐',()=>{field.type=field.type==='password'?'text':'password';}));
      if(variant==='unit'||variant==='percent'||variant==='currency'||variant==='inputgroup')box.append(node('span',variant==='unit'?'mm':variant==='percent'?'%':'¥'));
      if(variant==='mask')box.append(node('p',model.formatted));
      if(variant==='field'){const lab=node('label','工单名称');field.id=def.knowledgeId+'-field';lab.htmlFor=field.id;box.prepend(lab);}
      return;
    }
    if(variant==='checkbox'){const label=node('label','确认教学检查');const field=native('checkbox','',event=>setRaw(event.target.checked?'yes':'no'));field.checked=model.checked;label.append(field);box.append(label);return;}
    if(variant==='radio'){choiceGroup(['A','B','C'],model.selected);return;}
    if(variant==='switch'){const control=button(model.checked?'关闭教学开关':'开启教学开关',()=>setRaw(model.checked?'off':'on'));control.role='switch';control.setAttribute('aria-checked',String(model.checked));box.append(control);return;}
    if(variant==='toggles'){for(const value of ['A','B','C']){const control=button(value,()=>{const selected=model.selected.includes(value)?model.selected.filter(item=>item!==value):[...model.selected,value];setRaw(selected.join(','));});control.setAttribute('aria-pressed',String(model.selected.includes(value)));box.append(control);}return;}
    if(variant==='select'||variant==='multi'||variant==='async') {
      const select=node('select');select.setAttribute('aria-label','交互字段');select.multiple=variant==='multi';for(const value of ['A','B','C']){const option=node('option','方案 '+value);option.value=value;option.selected=variant==='multi'?model.selected.includes(value):model.selected===value;select.append(option);}select.addEventListener('change',()=>setRaw(select.multiple?[...select.selectedOptions].map(option=>option.value).join(','):select.value));box.append(select);
      if(variant==='async'){select.disabled=true;const status=node('p','等待本地选项');box.append(status);let timer;const load=button('载入本地选项',()=>{load.disabled=true;timer=setTimeout(()=>{if(disposed)return;select.disabled=false;status.textContent='本地选项已到达';},30);});box.append(load);cleanPaint=()=>clearTimeout(timer);}
      return;
    }
    if(variant==='combo'||variant==='auto'){const field=native('text',model.selected),suggestions=node('div');suggestions.id=def.knowledgeId+'-suggestions';suggestions.role='listbox';suggestions.setAttribute('aria-label','教学建议');field.setAttribute('role','combobox');field.setAttribute('aria-autocomplete','list');field.setAttribute('aria-controls',suggestions.id);field.setAttribute('aria-expanded',String(variant==='auto'));for(const value of ['A','B','C']){const suggestion=button('建议 '+value,()=>setRaw(value));suggestion.role='option';suggestion.setAttribute('aria-selected',String(value===model.selected));suggestions.append(suggestion);}const filter=()=>{[...suggestions.children].forEach(control=>{control.hidden=!control.textContent.includes(field.value);});};field.addEventListener('input',filter);if(variant==='combo'){suggestions.hidden=true;box.append(button('展开教学选项',()=>{suggestions.hidden=!suggestions.hidden;field.setAttribute('aria-expanded',String(!suggestions.hidden));}));}else filter();box.append(suggestions);return;}
    if(variant==='cascade'||variant==='tree'){const parent=node('select');parent.setAttribute('aria-label','教学父区域');for(const value of ['east','west']){const option=node('option',value);option.value=value;parent.append(option);}parent.value=model.path[0];const child=node('select');child.setAttribute('aria-label','教学子区域');for(const value of model.path[0]==='east'?['SH','HZ']:['CD']){const option=node('option',value);option.value=value;child.append(option);}child.value=model.path[1];parent.addEventListener('change',()=>setRaw(parent.value+'/'+(parent.value==='east'?'SH':'CD')));child.addEventListener('change',()=>setRaw(parent.value+'/'+child.value));if(variant==='tree'){const tree=node('details'),summary=node('summary','教学地区树');tree.open=true;tree.append(summary,parent,child);box.append(tree);}else box.append(parent,child);return;}
    if(variant==='transfer'){const available=node('div','候选：'),selected=node('div','已选：');for(const value of ['A','B','C']){const isSelected=model.selected.includes(value);(isSelected?selected:available).append(button((isSelected?'移回 ':'选入 ')+value,()=>{const values=isSelected?model.selected.filter(item=>item!==value):[...model.selected,value];setRaw(values.join(','));}));}box.append(available,selected);return;}
    if(variant==='tags'){chips(box,model.tags);box.append(button('添加green标签',()=>{if(!model.tags.includes('green'))setRaw([...model.tags,'green'].join(','));}));return;}
    if(['date','time','month','week','datetime','year','color','slider','stepper','calendar'].includes(variant)) {
      const type={date:'date',time:'time',month:'month',week:'week',datetime:'datetime-local',year:'number',color:'color',slider:'range',stepper:'number',calendar:'date'}[variant];const field=native(type,lastRaw);if(['slider','stepper','year'].includes(variant)){field.min=variant==='year'?'1900':'0';field.max=variant==='year'?'2100':variant==='stepper'?'20':'100';field.step=variant==='stepper'?'2':'1';}
      if(variant==='stepper')box.append(button('增加2',()=>setRaw(Math.min(20,model.value+2))));
      if(variant==='calendar'){const calendar=node('div','','basic-calendar');calendar.setAttribute('role','grid');for(let day=1;day<=30;day++){const date='2026-06-'+String(day).padStart(2,'0'),control=button(String(day),()=>setRaw(date));control.setAttribute('aria-label','六月'+day+'日');control.setAttribute('aria-pressed',String(model.date===date));calendar.append(control);}box.append(calendar);}
      return;
    }
    if(variant==='daterange'||variant==='timerange'||variant==='range') {const values=lastRaw.split(variant==='range'?',':'/'),type=variant==='range'?'range':variant==='daterange'?'date':'time';const fields=values.map(value=>{const field=node('input');field.type=type;field.value=value;field.setAttribute('aria-label',box.children.length?'范围终点':'范围起点');if(variant==='range'){field.min='0';field.max='100';}box.append(field);return field;});fields.forEach(field=>field.addEventListener('change',()=>setRaw(fields.map(item=>item.value).join(variant==='range'?',':'/'))));return;}
    if(variant==='otp'){const digits=node('div','','basic-actions');for(const [index,value] of model.digits.entries()){const field=node('input');field.value=value;field.maxLength=1;field.inputMode='numeric';field.setAttribute('aria-label',`第${index+1}位教学验证码`);field.style.width='2.4em';field.addEventListener('input',()=>{if(/^\d$/.test(field.value))field.nextElementSibling?.focus();});digits.append(field);}box.append(digits,button('合并教学验证码',()=>setRaw([...digits.children].map(field=>field.value).join(''))));return;}
    if(variant==='signature'){const svg=svgNode('svg',{viewBox:'0 0 100 100',role:'img','aria-label':'教学轨迹'}),poly=svgNode('polyline',{points:model.points.map(pair=>pair.join(',')).join(' '),fill:'none',stroke:'#315dde','stroke-width':2});svg.append(poly);let points=[];const point=event=>{const rect=svg.getBoundingClientRect();return [Math.max(0,Math.min(100,Math.round((event.clientX-rect.left)/rect.width*100))),Math.max(0,Math.min(100,Math.round((event.clientY-rect.top)/rect.height*100)))];};svg.addEventListener('pointerdown',event=>{points=[point(event)];svg.setPointerCapture(event.pointerId);});svg.addEventListener('pointermove',event=>{if(!(event.buttons&1)||!points.length||points.length>=40)return;points.push(point(event));poly.setAttribute('points',points.map(pair=>pair.join(',')).join(' '));});svg.addEventListener('pointerup',()=>{if(points.length>=2)setRaw(points.map(pair=>pair.join(',')).join(';'));});box.append(svg,button('使用教学示例轨迹',()=>setRaw(def.good)),button('清空教学轨迹',()=>{poly.setAttribute('points','');output.textContent='已清空教学轨迹';}));return;}
    if(['form','fieldset','summary'].includes(variant)){const form=node('form'),fields=node(variant==='fieldset'?'fieldset':'div');if(variant==='fieldset')fields.append(node('legend','教学联系人与数量'));const name=node('input'),qty=node('input');name.value=model.name;name.required=true;name.setAttribute('aria-label','教学名称');qty.type='number';qty.min='1';qty.max='10';qty.required=true;qty.value=String(model.qty);qty.setAttribute('aria-label','教学数量');fields.append(name,qty);const submit=node('button','校验教学表单');submit.type='submit';const errors=node('div');errors.setAttribute('role','alert');form.noValidate=true;form.addEventListener('submit',event=>{event.preventDefault();const messages=[];if(!name.value.trim())messages.push('名称必填');if(!qty.checkValidity())messages.push('数量须1–10');name.setAttribute('aria-invalid',String(!name.value.trim()));qty.setAttribute('aria-invalid',String(!qty.checkValidity()));errors.replaceChildren(...messages.map(message=>node('p',message)));if(!messages.length)setRaw(name.value+':'+qty.value);});form.append(fields,submit,errors);box.append(form);return;}
    if(variant==='dynamic'||variant==='builder'){const fields=node('fieldset');fields.append(node('legend','白名单字段配置'));model.fields.forEach(name=>{const label=node('label',name),field=node('input');field.setAttribute('aria-label','动态字段 '+name);label.append(field);fields.append(label);});box.append(fields,button('新增备注字段',()=>{if(!model.fields.includes('note'))setRaw([...model.fields,'note'].join(','));}));return;}
    if(variant==='repeat'){for(const item of model.items){const label=node('label','工序 '+item),field=node('input');field.value=item;field.dataset.stableId=item;label.append(field);box.append(label);}box.append(button('添加工序C',()=>{if(!model.items.includes('C'))setRaw([...model.items,'C'].join(','));}));return;}
    if(variant==='condition'){const company=node('input');company.type='checkbox';company.checked=model.type==='company';const label=node('label','公司工单');label.append(company);const value=node('input');value.setAttribute('aria-label',model.type==='company'?'公司名称':'个人姓名');value.value=model.name;company.addEventListener('change',()=>setRaw((company.checked?'company:':'person:')+value.value));value.addEventListener('change',()=>setRaw(model.type+':'+value.value));box.append(label,value);return;}
    throw new Error('Unimplemented input component '+variant);
  }
  function table(rows,columns=['id','group','qty','cents'],options={}) {
    const wrap=node('div','','basic-table-wrap'),table=node('table'),head=node('thead'),body=node('tbody'),header=node('tr');table.setAttribute('aria-label','教学数据网格');table.append(node('caption','虚构工单 · 只操作教学副本'));
    if(options.grouped){const groups=node('tr'),cell=node('th','工单字段组');cell.colSpan=columns.length;groups.append(cell);head.append(groups);}
    columns.forEach(column=>{const th=node('th',column);th.scope='col';header.append(th);});head.append(header);
    rows.forEach(row=>{const tr=node('tr');tr.dataset.rowId=row.id;columns.forEach(column=>{const td=node('td',String(row[column]??''));td.dataset.row=row.id;td.dataset.column=column;tr.append(td);});body.append(tr);});table.append(head,body);wrap.append(table);preview.append(wrap);return table;
  }
  function paintGrid(variant,model) {
    if(['card','descriptions','master'].includes(variant)){if(variant==='master')simpleChoices(['A','B','C'],model.id);const card=node(variant==='card'?'article':'dl','','basic-data-card');for(const [key,value] of Object.entries(model))card.append(node(variant==='card'?'strong':'dt',key),node(variant==='card'?'p':'dd',String(value)));preview.append(card);return;}
    if(variant==='log'){const list=node('ol');model.events.forEach(event=>list.append(node('li',`${event.seq} · ${event.action}`)));preview.append(list,button('记录教学审核动作',()=>setRaw('review')));return;}
    if(variant==='calendar'){const grid=node('div','','basic-calendar');for(let day=1;day<=30;day++){const control=button(String(day),()=>setRaw(day));control.setAttribute('aria-pressed',String(day===Number(lastRaw)));grid.append(control);}preview.append(grid,node('p',model.date));return;}
    if(variant==='scheduler'||variant==='gantt'){const track=node('div','','basic-time-track'),bar=node('span',`[${model.start},${model.end})`,'basic-time-bar');bar.style.left=(model.start*10)+'%';bar.style.width=((model.end-model.start)*10)+'%';if(variant==='scheduler'){const reserved=node('span','已有[3,5)','basic-reserved');reserved.style.left='30%';reserved.style.width='20%';track.append(reserved);}track.append(bar);preview.append(track);return;}
    if(variant==='carousel'||variant==='images'){const items=variant==='carousel'?[{id:String(model.index),color:['#315dde','#16715c','#b93d45'][model.index-1]}]:model.images;for(const item of items){const svg=svgNode('svg',{viewBox:'0 0 200 80',role:'img','aria-label':'教学图片 '+item.id});svg.append(svgNode('rect',{width:200,height:80,fill:item.color}));preview.append(svg);}if(variant==='carousel')preview.append(button('上一张',()=>setRaw(model.index===1?3:model.index-1)),button('下一张',()=>setRaw(model.index===3?1:model.index+1)));return;}
    if(variant==='code'){preview.append(node('pre',model.text));return;}
    if(variant==='json'){const details=node('details');details.open=true;details.append(node('summary','JSON层级'),node('pre',JSON.stringify(model.value,null,2)));preview.append(details);return;}
    if(variant==='markdown'){model.blocks.forEach(block=>preview.append(node(block.type,block.text)));return;}
    if(variant==='files'){const list=node('ul');model.files.forEach(name=>list.append(node('li',name)));preview.append(list);return;}
    if(variant==='keyvalue'){const list=node('dl');model.entries.forEach(([key,value])=>list.append(node('dt',key),node('dd',JSON.stringify(value))));preview.append(list);return;}
    if(variant==='tree'){table(model.ids.map(id=>({id,group:id==='P'?'父项':'子项',qty:id==='P'?2:1})),['id','group','qty']);preview.append(button(lastRaw==='open'?'折叠教学子行':'展开教学子行',()=>setRaw(lastRaw==='open'?'closed':'open')));return;}
    if(variant==='pivot'){const list=node('table');model.groups.forEach(group=>{const row=node('tr');row.append(node('th',String(group.key)),node('td',String(group.qty)));list.append(row);});preview.append(list);return;}
    if(variant==='virtual'||variant==='virtualgrid'){const viewport=node('div','','basic-virtual'),space=node('div'),window=node('div','','basic-virtual-window');space.style.height='2400px';window.style.top=(model.start*24)+'px';if(variant==='virtualgrid')window.classList.add('basic-virtual-grid');model.indices.forEach(index=>{const row=node('div','教学索引 '+index,'basic-virtual-item');row.dataset.index=String(index);window.append(row);});space.append(window);viewport.append(space);preview.append(viewport);viewport.scrollTop=model.start*24;let handling=false;viewport.addEventListener('scroll',()=>{if(handling)return;const start=Math.max(0,Math.min(94,Math.floor(viewport.scrollTop/24)));if(start===model.start)return;handling=true;setRaw(start);});return;}
    if(variant==='infinite'){const area=node('div','','basic-infinite');for(let i=0;i<model.count;i++)area.append(node('div','教学条目 '+i));const next=()=>setRaw(Math.min(4,Number(lastRaw)+1));const load=button('加载下一批教学条目',next);load.disabled=model.count===10;area.addEventListener('scroll',()=>{if(model.count>=10||area.scrollTop+area.clientHeight<area.scrollHeight-4)return;const y=area.scrollTop;next();const replacement=preview.querySelector('.basic-infinite');if(replacement)replacement.scrollTop=y;});preview.append(area,load);return;}
    if(variant==='clipboard'){const matrix=node('table');model.cells.forEach(cells=>{const row=node('tr');cells.forEach(value=>row.append(node('td',String(value))));matrix.append(row);});preview.append(matrix);return;}
    if(variant==='export'){const blob=new Blob([model.content],{type:'text/plain;charset=utf-8'}),url=URL.createObjectURL(blob),link=node('a','下载虚构教学数据');link.href=url;link.download='teaching.'+model.type;preview.append(node('pre',model.content),link);cleanPaint=()=>URL.revokeObjectURL(url);return;}
    if(variant==='formula'){preview.append(node('output',`${model.qty} × ${model.cents} 分 = ${model.total} 分`));return;}
    if(variant==='aggregate'){table(demoRows);preview.append(node('output',`${model.column} 合计 ${model.sum}`));return;}
    let rows=model.rows||demoRows,columns=model.columns||['id','group','qty','cents'];if(variant==='datagrid')rows=demoRows;
    if(variant==='group'){for(const group of ['cut','print']){const details=node('details'),summary=node('summary','教学工艺组 '+group);details.open=group===lastRaw;summary.addEventListener('click',event=>{event.preventDefault();setRaw(group);});details.append(summary);const groupTable=table(demoRows.filter(row=>row.group===group));details.append(groupTable.parentElement);preview.append(details);}return;}
    const grid=table(rows,variant==='visibility'?['id','group','qty','cents']:columns,{grouped:variant==='colgroup'&&model.grouped});
    if(variant==='list'||variant==='group'||variant==='headerfilter'||variant==='quick'||variant==='facet') {if(model.ids)grid.querySelector('tbody').replaceChildren(...[...grid.querySelectorAll('tbody tr')].filter(row=>model.ids.includes(row.dataset.rowId)));if(variant==='group')preview.prepend(node('h5','教学工艺组：'+lastRaw));if(variant==='headerfilter'){const filter=node('select');filter.setAttribute('aria-label','工艺列表头筛选');for(const group of ['cut','print']){const option=node('option',group);option.value=group;filter.append(option);}filter.value=lastRaw;filter.addEventListener('change',()=>setRaw(filter.value));grid.querySelector('th:nth-child(2)').append(filter);}return;}
    if(variant==='expand'){const tr=grid.querySelector(`tr[data-row-id="${model.id}"]`),details=node('tr'),cell=node('td','仅 '+model.id+' 的教学补充说明');cell.colSpan=4;details.dataset.expandedRow=model.id;details.append(cell);tr.after(details);return;}
    if(variant==='chooser'){const group=node('fieldset');group.append(node('legend','挂载教学列'));for(const column of ['id','group','qty','cents']){const label=node('label',column),check=node('input');check.type='checkbox';check.checked=model.columns.includes(column);check.addEventListener('change',()=>{const next=check.checked?[...model.columns,column]:model.columns.filter(value=>value!==column);if(next.length)setRaw(next.join(','));else {check.checked=true;error.textContent='至少保留一个展示列';}});label.prepend(check);group.append(label);}preview.prepend(group);return;}
    if(variant==='visibility'){for(const cell of grid.querySelectorAll('th,td'))cell.hidden=!model.columns.includes(cell.dataset.column||cell.textContent);return;}
    if(variant==='pincol'){grid.style.minWidth='560px';const index=['id','group','qty','cents'].indexOf(model.pinned);grid.querySelectorAll('tr').forEach(row=>{const cell=row.children[index];if(cell){cell.style.position='sticky';cell.style.left='0';cell.style.background='#eff4ff';cell.dataset.pinned='true';}});return;}
    if(variant==='resize'||variant==='autosize'){const column=grid.querySelector('th');column.style.width=variant==='resize'?model.width+'px':model.characters+'ch';column.style.minWidth=column.style.width;column.dataset.measuredWidth=column.style.width;if(variant==='autosize')column.textContent=model.title;return;}
    if(variant==='rowheight'){grid.querySelectorAll('tbody tr').forEach(row=>{row.style.height=model.height+'px';});return;}
    if(variant==='rowselect'){grid.querySelectorAll('tbody tr').forEach(row=>{const check=node('input');check.type='checkbox';check.setAttribute('aria-label','选择教学行 '+row.dataset.rowId);check.checked=model.ids.includes(row.dataset.rowId);check.addEventListener('change',()=>{const next=check.checked?[...model.ids,row.dataset.rowId]:model.ids.filter(id=>id!==row.dataset.rowId);setRaw(next.join(','));});row.firstChild.prepend(check);row.setAttribute('aria-selected',String(check.checked));});return;}
    if(variant==='cell'||variant==='keyboard'||variant==='datagrid'){grid.role='grid';const cells=[...grid.querySelectorAll('td')];cells.forEach(cell=>{cell.role='gridcell';const active=cell.dataset.row===(model.id||'A')&&cell.dataset.column===(model.column||'id');cell.tabIndex=active?0:-1;cell.setAttribute('aria-selected',String(active));cell.addEventListener('click',()=>{if(variant==='datagrid')setRaw(cell.dataset.row);else setRaw(cell.dataset.row+':'+cell.dataset.column);});cell.addEventListener('keydown',event=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key))return;event.preventDefault();const index=cells.indexOf(cell),r=Math.floor(index/4),c=index%4;const nr=Math.max(0,Math.min(2,r+(event.key==='ArrowDown'?1:event.key==='ArrowUp'?-1:0))),nc=Math.max(0,Math.min(3,c+(event.key==='ArrowRight'?1:event.key==='ArrowLeft'?-1:0)));cells[nr*4+nc].focus();});});return;}
    if(variant==='edit'){for(const row of grid.querySelectorAll('tbody tr')){const field=node('input');field.type='number';field.min='0';field.max='10';field.setAttribute('aria-label','编辑教学行 '+row.dataset.rowId);field.value=row.children[2].textContent;const commit=button('应用 '+row.dataset.rowId,()=>setRaw(row.dataset.rowId+':'+field.value));row.children[2].replaceChildren(field,commit);}return;}
    if(variant==='span'&&model.span===2){const first=grid.querySelector('tbody tr:first-child td');first.rowSpan=2;grid.querySelector('tbody tr:nth-child(2) td').remove();}
  }
  function paintFeedback(variant,model) {
    const good=model.state===def.good,advance=()=>setRaw(def.good),status=node('p',`教学状态：${model.state}`);status.dataset.feedbackState=model.state;preview.append(status);
    if(variant==='badge'||variant==='dot'){const badge=node('span',(variant==='dot'?'● ':'')+model.state,'basic-state-badge');badge.dataset.state=model.state;preview.append(badge,button('切换教学状态',()=>setRaw(good?def.initial:def.good)));return;}
    if(variant==='alert'){const alert=node('div','教学警告：请检查虚构工单');alert.role='alert';alert.hidden=good;preview.append(alert,button('关闭教学警告',advance),button('重新显示教学警告',()=>setRaw(def.initial)));return;}
    if(variant==='snackbar'||variant==='undo'){const rows=node('ul');for(const id of good?['A','B','C']:['A','C'])rows.append(node('li',id));const undo=button('撤销教学移除',advance);undo.disabled=good;preview.append(rows,undo);return;}
    if(variant==='notification'||variant==='center'){const list=node('div');for(let i=0;i<(variant==='center'?2:1);i++){const article=node('article',`教学通知 ${i+1}`);article.hidden=variant==='notification'&&good;article.dataset.read=String(good);list.append(article);}preview.append(list,button(variant==='center'?'全部标为已读':'关闭页内通知',advance));if(variant==='center')preview.append(node('output','未读 '+model.unread));return;}
    if(variant==='empty'){if(good)chips(preview,['A','B','C']);else preview.append(node('p','当前教学搜索没有匹配项'));preview.append(button('重置教学查询',advance));return;}
    if(variant==='skeleton'){if(!good)for(let i=0;i<3;i++)preview.append(node('div','','basic-skeleton'));else preview.append(node('article','真实的教学工单内容'));preview.append(button('完成本地加载',advance));return;}
    if(variant==='spinner'){if(!good){const spinner=node('span','◌','basic-spinner');spinner.role='status';spinner.setAttribute('aria-label','教学加载中');preview.append(spinner);}preview.append(button('完成本地加载',advance));return;}
    if(variant==='circular'){const svg=svgNode('svg',{viewBox:'0 0 100 100',role:'img','aria-label':`${model.percent}%教学进度`}),circle=svgNode('circle',{cx:50,cy:50,r:40,fill:'none',stroke:'#315dde','stroke-width':8,'stroke-dasharray':2*Math.PI*40,'stroke-dashoffset':2*Math.PI*40*(1-model.percent/100)});svg.append(circle);preview.append(svg,button('切换教学进度',()=>setRaw(good?def.initial:def.good)));return;}
    if(variant==='inline'){const action=button('开始本地教学任务',()=>{action.disabled=true;action.textContent='等待本地计时';timer=setTimeout(()=>{if(!disposed)advance();},40);});let timer;if(good)action.textContent='教学任务已完成';preview.append(action);cleanPaint=()=>clearTimeout(timer);return;}
    if(variant==='overlay'||variant==='fullscreen'){const frame=node('div','','basic-loading-frame'),under=button('底层教学操作',()=>{under.textContent='已执行教学操作';});under.disabled=!good;frame.append(under);if(!good)frame.append(node('div',variant==='fullscreen'?'覆盖整个教学框':'教学区域加载中','basic-overlay'));preview.append(frame,button('完成本地加载',advance));return;}
    if(variant==='error'){const field=node('input');field.setAttribute('aria-label','教学待修复字段');field.id=def.knowledgeId+'-errorfield';const hint=node('p',good?'':'教学错误：此字段必填');hint.id=def.knowledgeId+'-hint';field.setAttribute('aria-describedby',hint.id);field.setAttribute('aria-invalid',String(!good));field.value=good?'已修复':'';preview.append(field,hint,button('修复教学字段',advance));return;}
    if(variant==='boundary'){const box=node('div');try{if(!good)throw new Error('受控教学故障');box.append(node('p','局部任务正常'));}catch(reason){box.append(node('p','已捕获：'+reason.message));}const neighbor=button('旁边的正常教学操作',()=>{neighbor.textContent='旁边组件仍正常';});preview.append(box,neighbor,button('运行安全教学任务',advance));return;}
    if(variant==='conflict'){preview.append(node('p',good?'已重新载入版本2':'草稿版本1，当前源版本2'),button('尝试写入旧版本',()=>{status.textContent=model.version===2?'当前版本可继续教学':'版本冲突：旧草稿未覆盖新版本';}),button('重新载入教学版本',advance));return;}
    if(variant==='connection'){const connect=button('建立本地教学连接',()=>setRaw('connecting'));connect.disabled=model.state==='connecting'||good;preview.append(connect,button('关闭本地教学连接',()=>setRaw('closed')));if(model.state==='connecting'){const timer=setTimeout(()=>{if(!disposed)setRaw('open');},40);cleanPaint=()=>clearTimeout(timer);}return;}
    if(variant==='reconnecting'){let remaining=2;const countdown=node('output',good?'0':'2');countdown.dataset.wait='';const tick=button('推进重连时钟',()=>{if(--remaining<=0)advance();else countdown.textContent=String(remaining);});tick.disabled=good;preview.append(node('p','教学退避时钟：两次手动tick后恢复，不连接外部服务。'),countdown,tick);return;}
    if(['network','offline','sync'].includes(variant)){const draft=node('textarea');draft.setAttribute('aria-label','虚构教学草稿');draft.value=teachingDraft;draft.addEventListener('input',()=>{teachingDraft=draft.value;});const action=button('教学发送入口',()=>{status.textContent='仅演示界面可用，未发送请求';});action.disabled=!good;
      if(variant==='sync'){const sync=button('开始本地同步',()=>setRaw('syncing'));sync.disabled=model.state==='syncing'||good;preview.append(draft,sync);if(model.state==='syncing'){const timer=setTimeout(()=>{if(!disposed)setRaw('synced');},40);cleanPaint=()=>clearTimeout(timer);}return;}
      if(variant==='offline'){const banner=node('aside','离线横幅：教学草稿仍保留');banner.role='alert';banner.hidden=good;preview.append(banner);}
      if(variant==='network'){const offline=()=>setRaw('offline'),online=()=>setRaw('online');window.addEventListener('offline',offline);window.addEventListener('online',online);cleanPaint=()=>{window.removeEventListener('offline',offline);window.removeEventListener('online',online);};preview.append(node('p','跟随浏览器online/offline事件；上方输入可模拟同样状态。'));}
      preview.append(draft,action,button('恢复模拟链路',advance));return;}
    if(variant==='page'||variant==='result'){preview.append(node('h5',good?'教学内容可用':variant==='page'?'404 教学内容未找到':'教学任务失败'),button('重试教学任务',advance));return;}
    throw new Error('Unimplemented feedback component '+variant);
  }
  update();
  return ()=>{disposed=true;cleanPaint();root.replaceChildren();delete root.dataset.demo;};
}
