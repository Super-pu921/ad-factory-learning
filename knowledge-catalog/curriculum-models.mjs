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

export function teachingHref(raw) {
  if(typeof raw!=='string'||raw.length>500)throw new Error('使用教学锚点或 HTTPS 链接');
  const value=raw.trim();
  if(/^#K-D(?:0[1-9]|1[0-6])-\d{3}(?:\/L[123])?$/.test(value))return {href:value,external:false};
  let url;try{url=new URL(value);}catch{throw new Error('使用教学锚点或 HTTPS 链接');}
  if(url.protocol!=='https:'||url.username||url.password)throw new Error('使用教学锚点或 HTTPS 链接，不包含账号密码');
  return {href:url.href,external:true};
}
export function flexConfig(direction,wrap) {
  if(!['row','column'].includes(direction)||typeof wrap!=='boolean')throw new Error('布局方向或换行设置无效');
  return {display:'flex',flexDirection:direction,flexWrap:wrap?'wrap':'nowrap'};
}
export function pagination(total,page,size) {
  if(!Number.isSafeInteger(total)||total<0||total>10000||!Number.isSafeInteger(page)||page<1||![5,10,20].includes(size))throw new Error('分页参数无效');
  const pages=Math.ceil(total/size),current=pages?Math.min(page,pages):0,start=current?(current-1)*size:0;
  return {page:current,pages,start,end:Math.min(start+size,total)};
}
export function decimalHundredths(raw,limit=100) {
  const message=`输入 -${limit}–${limit} 的十进制数，最多两位小数`;
  if(![100,1000000].includes(limit)||typeof raw!=='string'||!/^[-+]?\d{1,7}(?:\.\d{1,2})?$/.test(raw.trim()))throw new Error(message);
  const value=raw.trim(),negative=value[0]==='-',parts=value.replace(/^[-+]/,'').split('.');
  const hundredths=(Number(parts[0])*100+Number((parts[1]||'').padEnd(2,'0')))*(negative?-1:1);
  if(Math.abs(hundredths)>limit*100)throw new Error(message);
  return Object.is(hundredths,-0)?0:hundredths;
}
export function statisticChange(current,previous) {
  if([current,previous].some(value=>!Number.isSafeInteger(value)||value<0||value>1000000))throw new Error('统计值须为 0–1000000 的整数');
  return {delta:current-previous,percent:previous===0?null:(current-previous)/previous*100};
}
export function progressState(completed,total) {
  if(!Number.isInteger(total)||total<1||total>100||!Number.isInteger(completed)||completed<0||completed>total)throw new Error('总量须为 1–100，完成量须在 0 和总量之间');
  return {completed,total,percent:completed/total*100,done:completed===total};
}
export function formatTeachingJson(raw) {
  if(typeof raw!=='string'||raw.length>2000)throw new Error('教学 JSON 最多 2000 个 UTF-16 代码单元');
  let value;try{value=JSON.parse(raw);}catch{throw new Error('JSON 语法无效，请检查引号、逗号和括号');}
  return JSON.stringify(value,null,2);
}
export function linePoints(raw) {
  const values=chartValues(raw).map(item=>item.value),max=Math.max(1,...values);
  return values.map((value,index)=>({value,x:values.length===1?50:index/(values.length-1)*100,y:100-value/max*100}));
}
export function reorderLayers(layers,id,direction) {
  if(!Array.isArray(layers)||layers.length>10||layers.some(layer=>!layer||typeof layer.id!=='string'||typeof layer.visible!=='boolean')||new Set(layers.map(layer=>layer.id)).size!==layers.length||![-1,1].includes(direction))throw new Error('图层或移动方向无效');
  const index=layers.findIndex(layer=>layer.id===id);if(index<0)throw new Error('图层不存在');
  const result=layers.map(layer=>({...layer})),next=index+direction;
  if(next>=0&&next<result.length)[result[index],result[next]]=[result[next],result[index]];
  return result;
}
export function snapToGrid(x,y,step) {
  if([x,y].some(value=>!Number.isFinite(value)||value<0||value>100)||![5,10,20].includes(step))throw new Error('坐标须为 0–100，网格须为 5、10 或 20');
  return {x:Math.round(x/step)*step,y:Math.round(y/step)*step};
}
export function moveKanban(cards,id,target) {
  const states=['TODO','DOING','DONE'];
  if(!Array.isArray(cards)||cards.some(card=>!card||typeof card.id!=='string'||!states.includes(card.status))||new Set(cards.map(card=>card.id)).size!==cards.length)throw new Error('教学卡片无效');
  const card=cards.find(item=>item.id===id);
  if(!card||!states.includes(target)||Math.abs(states.indexOf(card.status)-states.indexOf(target))!==1)throw new Error('只能在相邻看板列间移动');
  return cards.map(item=>({...item,status:item.id===id?target:item.status}));
}
export function typingActive(lastEvent,now,ttl=1000) {
  if(!Number.isFinite(now)||now<0||!Number.isFinite(ttl)||ttl<=0||lastEvent!==null&&(!Number.isFinite(lastEvent)||lastEvent<0||lastEvent>now))throw new Error('教学时间无效');
  return lastEvent!==null&&now-lastEvent<ttl;
}
export function branchMessages(messages,index) {
  if(!Array.isArray(messages)||messages.length>20||messages.some(message=>!message||!['user','assistant'].includes(message.role)||typeof message.text!=='string'||message.text.length>200)||!Number.isInteger(index)||index<0||index>=messages.length)throw new Error('教学消息或分支位置无效');
  return messages.slice(0,index+1).map(message=>({...message}));
}
export function localizedNumber(raw,locale) {
  if(!['zh-CN','en-US','de-DE'].includes(locale))throw new Error('选择教学提供的地区格式');
  const hundredths=decimalHundredths(raw,1000000);
  return new Intl.NumberFormat(locale,{minimumFractionDigits:2,maximumFractionDigits:2}).format(hundredths/100);
}
export function createDebouncer(callback,wait=300,{set=setTimeout,clear=clearTimeout}={}) {
  if(typeof callback!=='function'||!Number.isInteger(wait)||wait<1||wait>10000)throw new Error('防抖回调或等待时间无效');
  let timer=null,closed=false;
  const cancel=()=>{if(timer!==null)clear(timer);timer=null;};
  return {run(...args){if(closed)return;cancel();timer=set(()=>{timer=null;callback(...args);},wait);},cancel,dispose(){closed=true;cancel();}};
}
