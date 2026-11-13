import {uiSource} from './remaining-ui-source.mjs';
import {uiSpecs,runRemainingUiExample,clone} from './remaining-ui-models.mjs';
import {renderRemainingVisual} from './remaining-ui-visuals.mjs';
export {runRemainingUiExample};
const specs=new Map(uiSpecs.map(s=>[s.id,s]));
export const remainingUiDefinitions=uiSource.map(source=>{
 const spec=specs.get(source.id);if(!spec)throw new Error('缺少实现 '+source.id);
 const code=`const {runRemainingUiExample}=await import('./remaining-ui.mjs');\nconsole.log(JSON.stringify(runRemainingUiExample('${source.id}')));`;
 return {knowledgeId:source.id,title:source.name,kind:'remaining-ui-'+source.id.slice(2).toLowerCase(),
 principle:source.name+'解决的问题是：'+source.topics+'。'+spec.mechanism,
 mechanism:spec.mechanism,limits:spec.limit,
 observe:'识别 '+source.name+' 的真实输入与展示结果，操作演示控件观察 '+source.topics+'。',
 interact:'先运行默认样例，再使用对比输入修改 '+source.topics+'，操作下面的专属控件并核对实际DOM或解析结果。',
 verify:spec.assertion,apply:'把 '+source.name+' 应用于一份独立合成数据，说明 '+source.topics+' 的取舍及边界：'+spec.limit,
 invariant:spec.assertion,invalid:'运行非法输入，确认出现错误且旧结果不再显示；恢复初始输入后重做专属操作。',
 input:clone(spec.input),changed:clone(spec.changed),invalidInput:clone(spec.invalidInput),code,
 expected:JSON.stringify(runRemainingUiExample(source.id)),references:[]};
});
export const remainingUiSkipped=[];
export function renderRemainingUiDemo(root,def){
 root.replaceChildren();root.classList.add('remaining-demo');root.dataset.demo=def.kind;
 const make=(tag,text)=>{const e=document.createElement(tag);if(text)e.textContent=text;return e;};
 const label=make('label','完整教学输入 JSON'),input=make('textarea');input.dataset.input='';input.rows=4;input.setAttribute('aria-label','完整教学输入 JSON');label.append(input);
 const tools=make('div');tools.className='remaining-tools';
 const run=make('button','运行输入'),reset=make('button','恢复初始输入'),invalid=make('button','运行非法输入');run.dataset.run='';reset.dataset.reset='';invalid.dataset.invalid='';for(const b of[run,reset,invalid])b.type='button';tools.append(run,reset,invalid);
 const stage=make('div');stage.dataset.visual='';stage.className='remaining-stage';
 const error=make('p');error.dataset.error='';error.setAttribute('role','alert');
 const result=make('pre');result.dataset.result='';result.setAttribute('aria-label','计算结果');
 const status=make('p');status.dataset.nativeStatus='';status.setAttribute('role','status');
 root.append(label,tools,error,stage,status,result);
 let state=clone(def.input),disposeVisual=()=>{},disposed=false;
 const execute=()=>{disposeVisual();disposeVisual=()=>{};stage.replaceChildren();status.textContent='';try{state=JSON.parse(input.value);const output=runRemainingUiExample(def,state);root.dataset.valid='true';error.textContent='';result.textContent=JSON.stringify(output,null,2);disposeVisual=renderRemainingVisual(stage,def,state,output,{commit:next=>{input.value=JSON.stringify(next,null,2);execute();},status:message=>{status.textContent=message;},root});}catch(reason){root.dataset.valid='false';error.textContent='输入错误：'+reason.message;result.textContent='';stage.replaceChildren();}};
 const restore=()=>{input.value=JSON.stringify(def.input,null,2);execute();};
 run.addEventListener('click',execute);reset.addEventListener('click',restore);invalid.addEventListener('click',()=>{input.value=JSON.stringify(def.invalidInput,null,2);execute();});restore();
 return ()=>{if(disposed)return;disposed=true;disposeVisual();root.replaceChildren();};
}
