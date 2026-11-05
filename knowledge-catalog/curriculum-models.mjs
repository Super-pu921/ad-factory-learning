/** Pure teaching mechanisms. No profiles, network, persistence or dynamic execution. */
export function gridTracks(columns) {
  if(!Number.isInteger(columns)||columns<1||columns>4)throw new Error('列数须为 1–4');
  return `repeat(${columns}, minmax(0, 1fr))`;
}
export function nextTab(index,key,count) {
  if(!Number.isInteger(count)||count<1||!Number.isInteger(index)||index<0||index>=count)throw new Error('标签索引无效');
  if(key==='Home')return 0;if(key==='End')return count-1;
  return key==='ArrowRight'?(index+1)%count:key==='ArrowLeft'?(index-1+count)%count:index;
}
export function validateOrderCode(raw) {
  const value=typeof raw==='string'?raw.trim():'';
  return {valid:/^[A-Z0-9-]{1,12}$/.test(value),value,message:'编号须为 1–12 位大写字母、数字或连字符'};
}
export function tableRows(rows,{query='',descending=false}={}) {
  return rows.filter(row=>row.id.toLowerCase().includes(query.toLowerCase()))
    .sort((a,b)=>(descending?b.cents-a.cents:a.cents-b.cents)||a.id.localeCompare(b.id));
}
export function toastDelay(seconds) {
  if(!Number.isInteger(seconds)||seconds<1||seconds>10)throw new Error('提示时间须为 1–10 秒');
  return seconds*1000;
}
export function resolveConfirmation(before,action,draft) {
  if(!['confirm','cancel'].includes(action))throw new Error('未知确认结果');
  return action==='confirm'?draft:before;
}
export function validateFileMetadata(file) {
  return Boolean(file&&typeof file.name==='string'&&/\.(csv|txt)$/i.test(file.name)&&
    Number.isSafeInteger(file.size)&&file.size>=0&&file.size<=1024*1024);
}
export function chartValues(text) {
  const values=typeof text==='string'?text.split(',').map(value=>value.trim()):[];
  if(!values.length||values.length>6||values.some(value=>!/^\d{1,4}$/.test(value)||+value>1000))throw new Error('输入 1–6 个 0–1000 的整数，以逗号分隔');
  const numbers=values.map(Number),max=Math.max(1,...numbers);
  return numbers.map(value=>({value,percent:value/max*100}));
}
export function projectMarker(longitude,latitude) {
  if(!Number.isFinite(longitude)||!Number.isFinite(latitude)||Math.abs(longitude)>180||Math.abs(latitude)>90)throw new Error('经度范围 -180–180，纬度范围 -90–90');
  return {x:(longitude+180)/360*100,y:(90-latitude)/180*100};
}
export function traceStockFlow(quantity,stock) {
  if(!Number.isSafeInteger(quantity)||quantity<1||quantity>10000||!Number.isSafeInteger(stock)||stock<0||stock>10000)throw new Error('数量须为 1–10000，库存须为 0–10000 的整数');
  return quantity<=stock?['开始','库存充足','生成教学单','结束']:['开始','库存不足','等待补料','结束'];
}
export function approvalTransition(state,action,actor,reason='') {
  if(state==='DRAFT'&&action==='submit'&&actor==='requester')return 'REVIEW';
  if(state==='REVIEW'&&action==='approve'&&actor==='reviewer')return 'APPROVED';
  if(state==='REVIEW'&&action==='reject'&&actor==='reviewer'&&reason.trim())return 'DRAFT';
  throw new Error('当前状态、演示角色或驳回原因不满足规则');
}
export function mergeCounters(left,right) {
  const valid=value=>value&&['a','b'].every(key=>Number.isSafeInteger(value[key])&&value[key]>=0&&value[key]<=1000000);
  if(!valid(left)||!valid(right))throw new Error('计数向量无效');
  return {a:Math.max(left.a,right.a),b:Math.max(left.b,right.b)};
}
export function runDemoTool(args,approved) {
  if(approved!==true)throw new Error('尚未允许本次教学计算');
  if(!args||typeof args!=='object'||Array.isArray(args)||Object.keys(args).some(key=>!['operation','values'].includes(key))||args.operation!=='sum'||!Array.isArray(args.values)||!args.values.length||args.values.length>6||args.values.some(n=>!Number.isSafeInteger(n)||Math.abs(n)>1000000))throw new Error('仅允许 sum 和 1–6 个有限范围整数');
  return {tool:'demo.sum',status:'success',result:args.values.reduce((sum,n)=>sum+n,0)};
}
export function contrastRatio(foreground,background) {
  const luminance=hex=>{
    if(typeof hex!=='string'||!/^#[0-9a-f]{6}$/i.test(hex))throw new Error('使用六位不透明十六进制颜色，例如 #315dd0');
    const channels=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255).map(c=>c<=0.04045?c/12.92:((c+0.055)/1.055)**2.4);
    return channels[0]*0.2126+channels[1]*0.7152+channels[2]*0.0722;
  };
  const a=luminance(foreground),b=luminance(background),ratio=(Math.max(a,b)+0.05)/(Math.min(a,b)+0.05);
  return {ratio,normalAA:ratio>=4.5,largeAA:ratio>=3};
}
export function createHistory(initial=[]) {
  const copy=value=>{
    if(!Array.isArray(value)||value.some(item=>typeof item!=='string'))throw new Error('历史值须为字符串数组');
    return [...value];
  };
  let present=copy(initial),past=[],future=[];
  return {
    apply(value){const next=copy(value);past.push(copy(present));past=past.slice(-50);present=next;future=[];},
    undo(){if(past.length){future.push(copy(present));present=past.pop();}},
    redo(){if(future.length){past.push(copy(present));present=future.pop();}},
    snapshot(){return {value:copy(present),canUndo:past.length>0,canRedo:future.length>0};}
  };
}
