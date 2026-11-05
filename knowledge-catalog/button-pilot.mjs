/** Isolated teaching sample. IDs are sample-local, never legacy migration targets. */
function freeze(value) {
  if(value && typeof value==='object') { Object.values(value).forEach(freeze);Object.freeze(value); }
  return value;
}
export const buttonPilot = freeze({
  knowledgeId:'K-D01-001', title:'Button 操作按钮', status:'TEACHING_SAMPLE', version:'1',
  blocks:Object.freeze({
    concept:Object.freeze({version:'1',title:'按钮表达一个操作',body:'按钮用于触发操作，例如提交、重试或展开。前往另一个地址使用链接；按钮与链接应按行为选择。原生 button 提供键盘操作、焦点与 disabled 状态。'}),
    semantics:Object.freeze({version:'1',title:'先选语义，再管理状态',body:'表单内的 button 未声明 type 时可能提交表单。仅执行局部操作时使用 type="button"；提交表单时使用 type="submit"。可见文字应描述结果，例如“生成教学报价”。'}),
    busy:Object.freeze({version:'1',title:'禁用反馈与逻辑门禁配合',body:'请求开始前先锁定操作，再更新按钮的禁用与等待状态；异常也必须释放锁。只改变颜色或只依赖按钮禁用，不足以保护其他代码入口。前端锁只阻止当前页面重复操作，服务端幂等仍需单独设计。'})
  }),
  units:Object.freeze([
    Object.freeze({id:'button-l1',level:'L1',difficulty:'E1',title:'识别与操作原生按钮',blockRefs:[{id:'concept',version:'1'},{id:'semantics',version:'1'}],
      objective:'区分操作与导航，使用鼠标、Enter 或 Space 激活按钮，并观察禁用状态。',
      exercise:'先用键盘激活按钮两次；勾选禁用后再次尝试，再取消禁用并重置。',
      acceptance:['激活两次后计数为 2。','禁用时不会增加计数。','重置后计数为 0，键盘焦点仍清晰可见。'],
      pitfall:'不要把按钮只画成一个可点击的 div；不要用 disabled 代替对不可信输入和权限的校验。',
      summary:'一个操作对应清楚的名称、可识别的状态与实际反馈。'}),
    Object.freeze({id:'button-l2',level:'L2',difficulty:'E2',title:'实现等待、失败与重试',blockRefs:[{id:'concept',version:'1'},{id:'busy',version:'1'}],
      objective:'观察一次操作从空闲、等待到成功或失败的变化，避免同一执行窗口重复提交。',
      exercise:'快速激活提交按钮；开启模拟失败后提交，观察错误，再关闭失败并重试。',
      acceptance:['等待期间按钮禁用，并显示“处理中”。','一次等待窗口最多执行一个任务。','失败有明确结果且能再次提交；失败后不会永久锁定。'],
      pitfall:'使用 finally 释放锁；请求发出后不应读取已经被修改的表单值。前端防重不能承诺跨设备幂等。',
      summary:'状态反馈面向使用者，逻辑锁约束执行入口，两者各有作用。'}),
    Object.freeze({id:'button-l3',level:'L3',difficulty:'E2',title:'在教学报价中完成一次提交',blockRefs:[{id:'semantics',version:'1'},{id:'busy',version:'1'}],
      objective:'验证数量和单价，生成可复核的教学金额；不接入客户、订单或真实报价规则。',
      exercise:'用数量 2、单价 120.50 生成结果，再分别尝试负数量和三位小数的单价。',
      acceptance:['2 × 120.50 的教学金额为 241.00。','数量必须为 1–10000 的整数；单价最多两位小数。','非法输入不生成新结果；所有状态仅存在于当前样板页面内存。'],
      pitfall:'金额以整数分计算，避免用二进制浮点结果直接拼接金额。此练习没有订单落库、付款或权限实现。',
      summary:'有效输入、可复核计算和清楚反馈形成一条最小教学操作链。'})
  ])
});

export function calculateDemoQuote(quantity, price) {
  if (typeof quantity!=='string' || !/^\d+$/.test(quantity) || +quantity<1 || +quantity>10000) throw new Error('数量须为 1–10000 的整数');
  if (typeof price!=='string' || !/^\d{1,6}(\.\d{1,2})?$/.test(price)) throw new Error('单价须为非负金额，最多六位整数及两位小数');
  const [whole,fraction=''] = price.split('.');
  const unitCents = Number(whole)*100+Number(fraction.padEnd(2,'0'));
  const totalCents = Number(quantity)*unitCents;
  return Object.freeze({quantity:Number(quantity),unitCents,totalCents,formatted:(totalCents/100).toFixed(2)});
}

export function createSubmissionGate() {
  let running = false;
  return async task => {
    if (running) return {executed:false};
    running = true;
    try { return {executed:true,value:await task()}; }
    finally { running = false; }
  };
}
