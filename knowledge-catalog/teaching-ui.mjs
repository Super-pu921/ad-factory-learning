import {teachingFieldLabel,teachingFieldSummary,teachingValueLabel} from './teaching-labels.mjs';

const element=(doc,tag,className='',text='')=>{const node=doc.createElement(tag);node.className=className;node.textContent=text;return node;};
const stateKeys=new Set(['state','status','overall','nextState','previousState','phase','phases','states','statuses']);
const phaseLabels={idle:'空闲',pending:'等待中',fulfilled:'已完成',rejected:'失败'};
const display=(value,key='')=>value===null?'—':typeof value==='boolean'?teachingValueLabel(value):typeof value==='object'?teachingFieldSummary(value):['phase','phases'].includes(key)&&Object.hasOwn(phaseLabels,value)?phaseLabels[value]:stateKeys.has(key)?teachingValueLabel(value):String(value);

export function teachingSentence(text){return String(text).replace(/\b[a-zA-Z]\w*(?:\.(?:\d+|[a-zA-Z]\w*))+\b/g,path=>{const parts=path.split('.');if(teachingFieldLabel(parts[0])===parts[0]||['Promise','JSON','Object','Array','Math','Date','document','window','navigator','localStorage','sessionStorage','console'].includes(parts[0]))return path;return parts.map(part=>/^\d+$/.test(part)?'第'+(Number(part)+1)+'项':teachingFieldLabel(part)).join(' / ');}).replace(/"([a-z-]+)"/g,(original,value)=>{const label=Object.hasOwn(phaseLabels,value)?phaseLabels[value]:teachingValueLabel(value);return label===value?original:'“'+label+'”';});}

/** Read-only presentation of the already-computed result. Never changes model data. */
export function renderTeachingData(doc,value){
 const root=element(doc,'div','teaching-data');
 const group=(key,part)=>{
  const section=element(doc,'section','teaching-data__group');
  section.append(element(doc,'h5','teaching-data__title',teachingFieldLabel(key)));
  if(Array.isArray(part)&&part.length&&part.every(row=>row&&typeof row==='object'&&!Array.isArray(row))){
   const columns=[...new Set(part.flatMap(row=>Object.keys(row)))].slice(0,10),wrap=element(doc,'div','teaching-data__table-wrap'),table=element(doc,'table','teaching-data__table'),head=doc.createElement('thead'),header=doc.createElement('tr'),body=doc.createElement('tbody');
   columns.forEach(name=>{const th=element(doc,'th','',teachingFieldLabel(name));th.scope='col';header.append(th);});head.append(header);
   part.forEach(row=>{const tr=doc.createElement('tr');columns.forEach(name=>tr.append(element(doc,'td','',display(row[name]??null,name))));body.append(tr);});
   table.append(head,body);wrap.append(table);section.append(wrap);
  }else if(Array.isArray(part)){
   const list=element(doc,'div','teaching-data__tags');if(!part.length)list.append(element(doc,'span','teaching-data__empty','暂无条目'));else part.forEach(item=>list.append(element(doc,'span','teaching-data__tag',display(item,key))));section.append(list);
  }else if(part&&typeof part==='object'){
   const list=element(doc,'dl','teaching-data__properties');Object.entries(part).forEach(([name,item])=>{const row=element(doc,'div','teaching-data__property'),statusLabel=key==='columns'?({todo:'待办',doing:'进行中',done:'已完成'}[name]):null;row.append(element(doc,'dt','',statusLabel||teachingFieldLabel(name)),element(doc,'dd','',display(item,name)));list.append(row);});section.append(list);
  }else section.append(element(doc,'p','teaching-data__value',display(part,key)));
  return section;
 };
 if(value&&typeof value==='object'&&!Array.isArray(value)){
  const metrics=element(doc,'dl','teaching-data__metrics');
  for(const[key,part]of Object.entries(value))if(part===null||typeof part!=='object'){const item=element(doc,'div','teaching-data__metric');item.append(element(doc,'dt','',teachingFieldLabel(key)),element(doc,'dd','',display(part,key)));metrics.append(item);}else root.append(group(key,part));
  if(metrics.childElementCount)root.prepend(metrics);
 }else root.append(group('result',value));
 return root;
}

let instance=0;
function disclosure(doc,title,className){const details=element(doc,'details',className);details.append(element(doc,'summary','',title));return details;}

function structuredEditor(doc,raw,key){
 const container=element(doc,'fieldset','teaching-editor'),legend=element(doc,'legend','',teachingFieldLabel(key)),preview=element(doc,'p','teaching-editor__summary'),editors=element(doc,'div','teaching-editor__rows');container.dataset.fieldEditor=key;container.append(legend,preview,editors);
 const advanced=disclosure(doc,'编辑原始数据','teaching-ui__advanced');advanced.dataset.advancedInput='';
 const label=raw.closest('label');if(!label)return null;
 const originalParent=label.parentNode;originalParent.insertBefore(container,label);advanced.append(label);container.append(advanced);
 let snapshot='';
 const parse=()=>{try{return JSON.parse(raw.value);}catch{return null;}};
 const makeScalar=(value,path,name)=>{
  const label=element(doc,'label','teaching-editor__field',teachingFieldLabel(name)),control=doc.createElement('input');control.dataset.teachingPath=JSON.stringify(path);control.setAttribute('aria-label',teachingFieldLabel(key)+' · '+(typeof path[0]==='number'?'第'+(path[0]+1)+'项 · ':'')+teachingFieldLabel(name));
  control.type=typeof value==='boolean'?'checkbox':typeof value==='number'?'number':'text';if(control.type==='number')control.step='any';if(control.type==='checkbox')control.checked=value;else control.value=String(value??'');
  control.addEventListener('input',()=>{const data=parse();if(data===null)return;let target=data;for(const property of path.slice(0,-1))target=target[property];target[path.at(-1)]=control.type==='checkbox'?control.checked:control.type==='number'?(control.value===''?null:Number(control.value)):control.value;raw.value=JSON.stringify(data);snapshot=raw.value;preview.textContent=teachingFieldSummary(data);});label.append(control);return label;
 };
 const flat=value=>value&&typeof value==='object'&&!Array.isArray(value)&&Object.values(value).every(v=>v===null||['string','number','boolean'].includes(typeof v));
 const refresh=()=>{
  if(snapshot===raw.value)return;snapshot=raw.value;const data=parse();preview.textContent=teachingFieldSummary(data);editors.replaceChildren();
  if(Array.isArray(data)&&data.length<=8&&data.every(v=>v===null||['string','number','boolean'].includes(typeof v)||flat(v))){
   data.forEach((row,index)=>{const item=element(doc,'div','teaching-editor__row');if(flat(row)){item.append(element(doc,'span','teaching-editor__index',String(index+1)));Object.entries(row).forEach(([name,v])=>item.append(makeScalar(v,[index,name],name)));}else item.append(makeScalar(row,[index],String(index+1)));editors.append(item);});
  }else if(flat(data)){const item=element(doc,'div','teaching-editor__row');Object.entries(data).forEach(([name,v])=>item.append(makeScalar(v,[name],name)));editors.append(item);}
  editors.hidden=!editors.childElementCount;
 };
 raw.addEventListener('input',refresh);refresh();return {refresh};
}

/** Shared presentation only; keeps original nodes, event handlers and data-* contracts. */
export function enhanceTeachingDemo(root,{definition}={}){
 if(root.dataset.teachingUi)return()=>{};root.dataset.teachingUi='true';root.classList.add('teaching-ui');
 const doc=root.ownerDocument,original=[...root.childNodes],panel=element(doc,'section','teaching-ui__panel'),header=element(doc,'header','teaching-ui__header'),body=element(doc,'div','teaching-ui__body'),actions=element(doc,'div','teaching-ui__actions'),settings=disclosure(doc,'示例设置','teaching-ui__settings'),debug=disclosure(doc,'边界与调试','teaching-ui__advanced');
 settings.dataset.teachingSettings='';debug.dataset.advancedInput='';
 header.append(element(doc,'strong','','现场交互'),element(doc,'span','teaching-ui__badge','仅本地样例'));
 const resultDetails=disclosure(doc,'查看运行数据','teaching-ui__diagnostics');resultDetails.dataset.teachingResults='';
 const visual=definition?root.querySelector('[data-visual],[data-preview]'):null,form=definition?[...root.querySelectorAll('form')].find(node=>!visual?.contains(node)):null,source=definition?root.querySelector('[data-input]'):null,rawResults=definition?[...root.querySelectorAll('pre[data-result],pre[data-runtime-result]')]:[],error=definition?root.querySelector('[data-error]'):null;
 const reset=root.querySelector('[data-reset]'),scenario=root.querySelector('[data-scenario]'),run=root.querySelector('[data-run]')||(source?[...root.querySelectorAll('button')].find(button=>button.textContent==='应用演示值'):null),actual=root.querySelector('[data-runtime]'),negative=root.querySelector('[data-invalid]');
 const formId=form?.id||'teaching-config-'+(++instance);if(form)form.id=formId;
 for(const control of[scenario,reset,actual])if(control){if(control===scenario)control.textContent='对比示例';if(control===reset)control.textContent='重置示例';if(control===actual&&!/自动保存/.test(control.textContent))control.textContent='运行演示';actions.append(control);}
 if(actual)actual.dataset.teachingPrimary='';
 if(!scenario&&definition&&source){const compare=element(doc,'button','','对比示例');compare.type='button';compare.dataset.scenario='';compare.addEventListener('click',()=>{source.value=Object.hasOwn(definition,'changed')?JSON.stringify(definition.changed,null,2):definition.good;run?.click();});actions.prepend(compare);}
 if(negative)debug.append(negative);
 if(form){if(run){run.textContent='应用设置';run.dataset.teachingPrimary=actual?'secondary':'';}settings.append(form);}
 else if(source){const label=source.closest('label')||source;settings.dataset.advancedInput='';settings.querySelector('summary').textContent=Object.hasOwn(definition,'changed')?'高级输入':'示例设置';settings.append(label);if(run){if(run.dataset.run!==undefined)run.textContent='应用设置';settings.append(run);}}
 for(const result of rawResults)resultDetails.append(result);
 if(actions.childElementCount)body.append(actions);if(error)body.append(error);if(visual)body.append(visual);
 const runtimeMount=root.querySelector('[data-runtime-mount]');if(runtimeMount)body.append(runtimeMount);
 const nativeStatus=root.querySelector('[data-native-status]');if(nativeStatus)body.append(nativeStatus);
 const runtimeResult=rawResults.find(node=>node.hasAttribute('data-runtime-result'));let runtimeFeedback;
 if(runtimeResult){runtimeFeedback=element(doc,'div','teaching-ui__feedback');runtimeFeedback.setAttribute('role','status');body.append(runtimeFeedback);}
 const moved=new Set([form,visual,error,source?.closest('label'),...rawResults,reset,scenario,run,actual,negative,runtimeMount,nativeStatus]);
 const notes=[];
 for(const node of original){if(moved.has(node)||panel.contains(node)||body.contains(node)||settings.contains(node)||debug.contains(node)||resultDetails.contains(node))continue;if(node.nodeType!==1)continue;
  if(node.tagName==='P'&&(node.classList.contains('subtle')||node.textContent===definition?.principle||node.textContent===definition?.limits)){notes.push(node);continue;}
  if(node.querySelector?.('[data-reset],[data-run],[data-invalid]')&&!node.querySelector('input,textarea,select'))continue;
  body.append(node);
 }
 if(form||source)body.append(settings);if(debug.childElementCount>1)body.append(debug);if(rawResults.length)body.append(resultDetails);
 if(notes.length){const limits=disclosure(doc,'使用范围','teaching-ui__limits');limits.append(...notes);body.append(limits);}
 panel.append(header,body);root.replaceChildren(panel);
 const editors=[];
 for(const raw of root.querySelectorAll('[data-field]')){
  const label=raw.closest('label'),key=raw.dataset.field;if(label){const text=[...label.childNodes].find(n=>n.nodeType===3);if(text)text.nodeValue=teachingFieldLabel(key);raw.setAttribute('aria-label',teachingFieldLabel(key)+' ('+key+')');}
  if(raw.tagName==='TEXTAREA'&&/^[\[{]/.test(raw.value.trim())){const editor=structuredEditor(doc,raw,key);if(editor)editors.push(editor);}
 }
 let previousPrimary;
 const decorate=()=>{
  for(const button of root.querySelectorAll('button'))button.classList.add('teaching-ui__button');
  for(const control of root.querySelectorAll('[data-save],[data-restore],[data-clear]')){const parent=control.parentElement;if(parent&&[...parent.children].every(node=>node.tagName==='BUTTON'))parent.classList.add('teaching-ui__actions');}
  for(const input of root.querySelectorAll('input,textarea,select')){input.classList.add('teaching-ui__field');if(input.type==='checkbox'||input.type==='radio')input.style.removeProperty('width');}
  const primary=actual||visual?.querySelector('[data-open],[data-play],[data-editor-apply],[data-action],[data-sandbox-run],[data-download],[data-geolocation],[data-fullscreen],[data-cache-save],[data-xml-import],[data-consistency]')||(!definition?root.querySelector('form button[type=submit],.controls button,button:not([role=tab]):not([role=menuitem])'):null)||actions.querySelector('[data-scenario]');
  if(previousPrimary&&previousPrimary!==primary)previousPrimary.removeAttribute('data-teaching-primary');if(primary)primary.dataset.teachingPrimary='';previousPrimary=primary;
  editors.forEach(editor=>editor.refresh());
  if(runtimeResult&&runtimeFeedback){try{const value=JSON.parse(runtimeResult.textContent);runtimeFeedback.replaceChildren(renderTeachingData(doc,value));}catch{runtimeFeedback.textContent=/尚未/.test(runtimeResult.textContent)?'点击“运行演示”查看交互结果。':runtimeResult.textContent.replace('本地机制运行中','演示运行中…');}}
 };
 let queued=false,active=true;const observer=new MutationObserver(records=>{if(records.every(record=>runtimeFeedback?.contains(record.target)))return;if(queued)return;queued=true;queueMicrotask(()=>{queued=false;if(active)decorate();});});
 decorate();observer.observe(root,{childList:true,subtree:true});return()=>{active=false;observer.disconnect();};
}
