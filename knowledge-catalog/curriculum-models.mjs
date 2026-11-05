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

export function badgeCount(count,cap=99) {
  if(!Number.isInteger(count)||count<0||count>999||![9,99].includes(cap))throw new Error('通知数须为 0–999 整数，上限选择 9 或 99');
  return {text:count>cap?`${cap}+`:String(count),label:`${count} 条教学通知`};
}
export function aspectRatio(width,height) {
  if([width,height].some(value=>!Number.isInteger(value)||value<1||value>32))throw new Error('比例宽高须为 1–32 正整数');
  return `${width} / ${height}`;
}
export function breadcrumbPath(depth) {
  if(!Number.isInteger(depth)||depth<1||depth>3)throw new Error('教学路径深度须为 1–3');
  return ['教学中心','排版任务','任务详情'].slice(0,depth);
}
export function selectedOperations(ids) {
  const allowed=['print','cut','pack'];
  if(!Array.isArray(ids)||ids.some(id=>!allowed.includes(id))||new Set(ids).size!==ids.length)throw new Error('选择不重复的教学工序');
  return allowed.filter(id=>ids.includes(id));
}
export function timelineEvents(events,descending=false) {
  if(!Array.isArray(events)||events.length>20||typeof descending!=='boolean'||events.some(event=>!event||typeof event.id!=='string'||typeof event.text!=='string'||!Number.isSafeInteger(event.at)||Math.abs(event.at)>8640000000000000)||new Set(events.map(event=>event.id)).size!==events.length)throw new Error('教学事件数据无效，最多 20 条');
  return events.map(event=>({...event})).sort((a,b)=>(descending?b.at-a.at:a.at-b.at)||a.id.localeCompare(b.id));
}
export function retryTransition(state,event) {
  if(!state||!['idle','loading','error','success'].includes(state.phase)||!Number.isInteger(state.attempt)||state.attempt<0||state.attempt>5)throw new Error('重试状态无效');
  if(event==='reset'&&state.phase!=='loading')return {phase:'idle',attempt:0};
  if(event==='start'&&['idle','error'].includes(state.phase)&&state.attempt<5)return {phase:'loading',attempt:state.attempt+1};
  if(['fail','succeed'].includes(event)&&state.phase==='loading')return {phase:event==='fail'?'error':'success',attempt:state.attempt};
  throw new Error('当前状态不允许此操作，最多尝试 5 次');
}
export function tooltipVisible(hovered,focused,dismissed) {
  if([hovered,focused,dismissed].some(value=>typeof value!=='boolean'))throw new Error('提示框状态须为布尔值');
  return (hovered||focused)&&!dismissed;
}
export function previewCsv(raw) {
  if(typeof raw!=='string'||raw.length>2000)throw new Error('教学 CSV 最多 2000 个 UTF-16 代码单元');
  const text=raw.replace(/^\uFEFF/,''),rows=[];let row=[],value='',quoted=false,closed=false;
  const endField=()=>{row.push(value);value='';closed=false;};
  const endRow=()=>{endField();rows.push(row);row=[];};
  for(let index=0;index<text.length;index++) {
    const char=text[index];
    if(quoted){if(char==='"'){if(text[index+1]==='"'){value+='"';index++;}else {quoted=false;closed=true;}}else value+=char;continue;}
    if(closed&&![',','\r','\n'].includes(char))throw new Error('CSV 引号闭合后只能跟分隔符或换行');
    if(char==='"'){if(value!=='')throw new Error('CSV 引号须位于字段开头');quoted=true;}
    else if(char===',')endField();
    else if(char==='\n'||char==='\r'){if(char==='\r'){if(text[index+1]!=='\n')throw new Error('换行使用 LF 或 CRLF');index++;}endRow();}
    else value+=char;
  }
  if(quoted)throw new Error('CSV 引号没有闭合');
  if(value!==''||row.length||closed)endRow();
  if(!rows.length||rows[0].join(',')!=='id,qty'||rows[0].length!==2)throw new Error('CSV 表头须为 id,qty');
  if(rows.length>21)throw new Error('教学预览最多 20 行数据');
  const result=rows.slice(1).map((fields,index)=>{
    if(fields.length!==2)throw new Error(`第 ${index+2} 行须有两列`);
    const [id,quantity]=fields.map(field=>field.trim());
    if(!id||id.length>40||!/^\d{1,3}$/.test(quantity)||Number(quantity)<1||Number(quantity)>100)throw new Error(`第 ${index+2} 行 ID 须为 1–40 字符，qty 须为 1–100 整数`);
    return {id,qty:Number(quantity)};
  });
  if(new Set(result.map(item=>item.id)).size!==result.length)throw new Error('教学 ID 不得重复');
  return result;
}
export function donutSegments(raw) {
  const values=chartValues(raw).map(item=>item.value),sum=values.reduce((total,value)=>total+value,0);
  return values.map(value=>({value,percent:sum?value/sum*100:0}));
}
export function geojsonPoints(raw) {
  if(typeof raw!=='string'||raw.length>3000)throw new Error('教学 GeoJSON 最多 3000 个 UTF-16 代码单元');
  let data;try{data=JSON.parse(raw);}catch{throw new Error('GeoJSON 不是有效 JSON');}
  if(!data||data.type!=='FeatureCollection'||!Array.isArray(data.features)||data.features.length>5)throw new Error('仅支持最多 5 个 Point 的 FeatureCollection');
  return data.features.map((feature,index)=>{
    const geometry=feature?.geometry,properties=feature?.properties;
    if(feature?.type!=='Feature'||geometry?.type!=='Point'||!Array.isArray(geometry.coordinates)||geometry.coordinates.length!==2||geometry.coordinates.some(value=>typeof value!=='number')||properties!=null&&(typeof properties!=='object'||Array.isArray(properties)))throw new Error('每个 Feature 须为二维 Point，坐标为 [经度,纬度]');
    const [lon,lat]=geometry.coordinates,point=projectMarker(lon,lat),name=properties?.name??`教学点${index+1}`;
    if(typeof name!=='string'||name.length>40)throw new Error('点名称须为不超过 40 字符的文本');
    return {name,lon,lat,...point};
  });
}
export function viewportPoint(x,y,zoom,dx,dy) {
  if([x,y].some(value=>!Number.isFinite(value)||value<0||value>100)||![0.5,1,2].includes(zoom)||[dx,dy].some(value=>!Number.isFinite(value)||Math.abs(value)>30))throw new Error('坐标 0–100，倍数 0.5/1/2，平移 -30–30');
  return {x:x*zoom+dx,y:y*zoom+dy};
}
export function wizardAdvance(step,draft) {
  if(![0,1].includes(step)||!draft||!validateOrderCode(draft.code).valid)throw new Error('先填写有效教学编号：1–12 位大写字母、数字或连字符');
  if(step===1&&(!Number.isInteger(draft.quantity)||draft.quantity<1||draft.quantity>100))throw new Error('教学数量须为 1–100 整数');
  return step+1;
}
export function resolveThread(state,action) {
  if(state==='OPEN'&&action==='resolve')return 'RESOLVED';
  if(state==='RESOLVED'&&action==='reopen')return 'OPEN';
  throw new Error('评论状态不允许重复或未知转换');
}
export function validateStructuredQuote(raw) {
  if(typeof raw!=='string'||raw.length>1000)throw new Error('教学 JSON 最多 1000 字符');
  let value;try{value=JSON.parse(raw);}catch{throw new Error('JSON 语法无效');}
  if(!value||Array.isArray(value)||typeof value!=='object'||Object.keys(value).length!==3||Object.keys(value).some(key=>!['material','qty','rush'].includes(key))||!['板材','灯箱'].includes(value.material)||!Number.isInteger(value.qty)||value.qty<1||value.qty>100||typeof value.rush!=='boolean')throw new Error('仅允许 material（板材/灯箱）、qty（1–100 整数）、rush（布尔值）');
  return {material:value.material,qty:value.qty,rush:value.rush};
}
export function motionPreference(systemReduced,userChoice='system') {
  if(typeof systemReduced!=='boolean'||!['system','reduce','full'].includes(userChoice))throw new Error('动态偏好参数无效');
  return userChoice==='system'?systemReduced:userChoice==='reduce';
}
export function waitForDemo(ms,{signal}={}) {
  if(!Number.isInteger(ms)||ms<1||ms>1000)throw new Error('教学等待须为 1–1000 毫秒');
  if(signal&&typeof signal.addEventListener!=='function')throw new Error('signal 须为 AbortSignal');
  return new Promise((resolve,reject)=>{
    if(signal?.aborted){reject(new DOMException('教学任务已取消','AbortError'));return;}
    const abort=()=>{clearTimeout(timer);signal?.removeEventListener('abort',abort);reject(new DOMException('教学任务已取消','AbortError'));};
    const timer=setTimeout(()=>{signal?.removeEventListener('abort',abort);resolve('教学响应');},ms);
    signal?.addEventListener('abort',abort,{once:true});
  });
}
export function matchingTeachingUnits(units,level='all',difficulty='all') {
  if(!Array.isArray(units)||!['all','L1','L2','L3'].includes(level)||!['all','E1','E2','E3','E4','E5'].includes(difficulty))throw new Error('教学筛选参数无效');
  return units.filter(unit=>(level==='all'||unit.level===level)&&(difficulty==='all'||unit.difficulty===difficulty));
}
