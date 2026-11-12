import {basicDefinitions,renderBasicDemo} from './expanded-basic.mjs';
import {advancedDefinitions,renderAdvancedDemo} from './expanded-advanced.mjs';

const freeze=value=>{if(value&&typeof value==='object'){Object.values(value).forEach(freeze);Object.freeze(value);}return value;};
export const expandedDefinitions=freeze([...basicDefinitions,...advancedDefinitions]);
export const expandedById=new Map(expandedDefinitions.map(def=>[def.knowledgeId,def]));
export const expandedCurriculum=freeze(expandedDefinitions.map(def=>{
  const advanced=def.kind.startsWith('advanced-');
  const initial=advanced?def.input:def.initial,changed=advanced?def.changed:def.good,invalid=advanced?def.invalidInput:def.bad;
  const api=advanced?'runAdvancedExample(knowledgeId, input)':'runBasicExample(knowledgeId, rawText)';
  const contract=`前置：能区分输入、当前状态和展示结果；用本单元的虚构数据操作，不代入真实账号或工单。机制接口为 ${api}，演示渲染与纯计算分别负责DOM交互和输入校验。初始输入：${JSON.stringify(initial)}。对比输入：${JSON.stringify(changed)}。负例输入：${JSON.stringify(invalid)}。原始教学数据不被原地修改；结果字段和初始预期输出见“代码与运行”。${advanced?'复杂输入可在“完整JSON输入”中逐字段修改；失败会移除失效图形。':'上方“演示输入”用于配置，下面的真实控件用于交互；失败保留最后一次有效预览。'}`;
  const units=[
    {difficulty:'E1',title:'认识与操作',objective:def.observe,exercise:def.interact,
      acceptance:[def.observe,'运行示例代码，输出与本单元给出的预期一致。',def.verify],
      pitfall:'只看目录名称或静态图片，不能证明已经完成 '+def.title+' 的操作。',summary:def.observe},
    {difficulty:'E2',title:'机制与边界',objective:def.verify,exercise:def.interact+' '+def.invalid,
      acceptance:[def.verify,def.invariant,def.invalid],
      pitfall:'合法输入的结果不能代替异常输入、空集合或边界验证。具体边界：'+def.invariant,summary:def.verify},
    {difficulty:'E3',title:'组合与应用',objective:def.apply,exercise:def.apply+' 操作前核对输入，完成后检查 '+def.invariant,
      acceptance:[def.apply,def.invariant,'关闭再打开本单元，确认演示初始状态恢复；原课程与真实学习记录不参与本练习。'],
      pitfall:'教学机制的可运行验证不等于真实后端、账户、数据迁移或完整生产服务已经验收。'+def.limits,summary:def.apply}
  ].map((unit,index)=>({...unit,id:`directory:${def.knowledgeId}:L${index+1}`,level:`L${index+1}`,blockRefs:[{id:'principle',version:'1'},{id:'mechanism',version:'1'},{id:'contract',version:'1'}]}));
  return {knowledgeId:def.knowledgeId,domain:def.knowledgeId.slice(2,5),kind:def.kind,title:def.title,version:'1',status:'BATCH_TEACHING',
    blocks:{principle:{version:'1',title:'概念与原理',body:def.principle},mechanism:{version:'1',title:'实现机制',body:def.mechanism},contract:{version:'1',title:'前置与输入输出契约',body:contract}},
    limits:def.limits,code:def.code,expected:def.expected,units,references:def.references||[],implementationPath:def.kind.startsWith('advanced-')?'./expanded-advanced.mjs':'./expanded-basic.mjs'};
}));
export function renderExpandedDemo(lesson,unit,{node}) {
  const definition=expandedById.get(lesson.knowledgeId);if(!definition)throw new Error('Unregistered expanded demo');
  const element=node('div','live-demo'),dispose=definition.kind.startsWith('advanced-')?renderAdvancedDemo(element,definition):renderBasicDemo(element,definition);
  element.append(node('p','subtle',definition.limits));
  return {element,dispose};
}
