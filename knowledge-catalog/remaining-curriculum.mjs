import {remainingUiDefinitions,remainingUiSkipped,renderRemainingUiDemo} from './remaining-ui.mjs';
import {remainingSystemsDefinitions,remainingSystemsSkipped,renderRemainingSystemsDemo} from './remaining-systems.mjs';
import {remainingEngineeringDefinitions,remainingEngineeringSkipped,renderRemainingEngineeringDemo} from './remaining-engineering.mjs';
const freeze=value=>{if(value&&typeof value==='object'){Object.values(value).forEach(freeze);Object.freeze(value);}return value;};
export const remainingDefinitions=freeze([...remainingUiDefinitions,...remainingSystemsDefinitions,...remainingEngineeringDefinitions].sort((a,b)=>a.knowledgeId.localeCompare(b.knowledgeId)));
export const remainingSkipped=freeze([...remainingUiSkipped,...remainingSystemsSkipped,...remainingEngineeringSkipped].sort((a,b)=>a.knowledgeId.localeCompare(b.knowledgeId)));
export const remainingById=new Map(remainingDefinitions.map(d=>[d.knowledgeId,d]));
export const remainingSkippedById=new Map(remainingSkipped.map(d=>[d.knowledgeId,d]));
export const remainingCurriculum=freeze(remainingDefinitions.map(def=>{
 const module=def.kind.startsWith('remaining-ui-')?'remaining-ui':def.kind.startsWith('remaining-systems-')?'remaining-systems':'remaining-engineering';
 const contract=`仅使用当前单元的合成样例。完整初始输入：${JSON.stringify(def.input)}。对比输入：${JSON.stringify(def.changed)}。负例：${JSON.stringify(def.invalidInput)}。输入先校验，再执行机制；失败时移除旧结果。${def.limits} 原课程和真实学习记录不参与演示；涉及持久化的控件只读写本例专用沙箱配置，须用户显式操作。`;
 const units=[
  {title:'认识与操作',difficulty:'E1',objective:def.observe,exercise:def.interact,acceptance:[def.observe,def.verify,'实际操作专属控件，并核对变化后的DOM或运行输出。'],pitfall:'目录名称和静态截图不能证明机制已运行。'+def.limits,summary:def.observe},
  {title:'机制与边界',difficulty:'E2',objective:def.verify,exercise:def.interact+' '+def.invalid,acceptance:[def.verify,def.invariant,def.invalid],pitfall:'正例不能代替异常输入验证；应保留失败信息并恢复有效样例。',summary:def.verify},
  {title:'组合与应用',difficulty:'E3',objective:def.apply,exercise:def.apply+' 使用对比输入，执行专属控件并记录最终结果。',acceptance:[def.apply,def.invariant,'关闭再打开本例确认初始状态；显式保存的合成配置可单独恢复及清除，真实学习记录不参与。'],pitfall:'有限教学实现不等于真实服务、账户、模型推理或生产迁移已完成。'+def.limits,summary:def.apply}
 ].map((unit,n)=>({...unit,id:`directory:${def.knowledgeId}:L${n+1}`,level:'L'+(n+1),blockRefs:[{id:'principle',version:'1'},{id:'mechanism',version:'1'},{id:'contract',version:'1'}]}));
 return {knowledgeId:def.knowledgeId,domain:def.knowledgeId.slice(2,5),kind:def.kind,title:def.title,version:'1',status:'BATCH_TEACHING',blocks:{principle:{version:'1',title:'概念与原理',body:def.principle},mechanism:{version:'1',title:'实现机制',body:def.mechanism},contract:{version:'1',title:'前置与输入输出契约',body:contract}},limits:def.limits,code:def.code,expected:def.expected,units,references:def.references||[],implementationPath:'./'+module+'.mjs'};
}));
export function renderRemainingDemo(lesson,unit,{node}){const def=remainingById.get(lesson.knowledgeId);if(!def)throw new Error('未注册的本批教学');const element=node('div','live-demo'),render=def.kind.startsWith('remaining-ui-')?renderRemainingUiDemo:def.kind.startsWith('remaining-systems-')?renderRemainingSystemsDemo:renderRemainingEngineeringDemo;const dispose=render(element,def);element.append(node('p','subtle',def.limits));return {element,dispose};}
