/** Bounded teaching mechanisms. No storage, network, user files or evaluation of code. */
export const demoRows=Object.freeze([
  Object.freeze({id:'A',group:'cut',qty:2,cents:100}),
  Object.freeze({id:'B',group:'print',qty:1,cents:200}),
  Object.freeze({id:'C',group:'cut',qty:3,cents:150})
]);
const fail=message=>{throw new TypeError(message);};
const text=value=>typeof value==='string'&&value.length<=2000?value:fail('输入必须是最多 2000 字符的文本');
const integer=(raw,min,max)=>/^\d+$/.test(raw)&&Number.isSafeInteger(Number(raw))&&Number(raw)>=min&&Number(raw)<=max?Number(raw):fail(`请输入 ${min}–${max} 的整数`);
const choice=(raw,values)=>values.includes(raw)?raw:fail('值不在演示白名单中');
const parts=(raw,allowed,allowEmpty=false)=>{if(raw===''&&allowEmpty)return [];const values=raw.split(',');if(!values.length||new Set(values).size!==values.length||values.some(value=>!allowed.includes(value)))fail('选项必须唯一且来自白名单');return values;};
const isoDate=raw=>{if(!/^\d{4}-\d{2}-\d{2}$/.test(raw)||raw<'1900-01-01'||raw>'2100-12-31')fail('日期限定为 1900–2100 年的 YYYY-MM-DD');const date=new Date(raw+'T00:00:00.000Z');if(!Number.isFinite(+date)||date.toISOString().slice(0,10)!==raw)fail('日期不存在');return raw;};
const time=raw=>/^([01]\d|2[0-3]):[0-5]\d$/.test(raw)?raw:fail('时间须为 HH:mm');
const json=raw=>{const value=JSON.parse(raw);if(raw.length>1000)fail('JSON 演示上限 1000 字符');return value;};
export const basicFixtures={
  'visual-group':['A','B','Z'], 'visual-split':['save','export','Z'], 'visual-fab':['0','2','-1'],
  'visual-toggle':['off','on','Z'], 'visual-toolbar':['left','center','Z'], 'visual-type':['16','24','0'],
  'visual-icon':['info','check','Z'], 'visual-avatar':['An Bo','Li Na',''], 'visual-avatars':['2','1','0'],
  'visual-chip':['A,B','B','A,A'], 'visual-label':['name','qty','Z'], 'visual-divider':['horizontal','vertical','Z'],
  'visual-swatch':['#315dde','#16715c','red'], 'visual-key':['Ctrl+K','Shift+Enter','Z'],
  'visual-code':['const qty = 2;','<script>demo</script>',''], 'visual-theme':['light','dark','Z'], 'visual-density':['normal','compact','Z'],
  'field-textarea':['line 1\nline 2','a\nb\nc',''], 'field-password':['demo1234','safe56789','123'],
  'field-email':['demo@example.test','new@example.test','broken'], 'field-url':['https://example.test/a','https://example.test/b','javascript:alert(1)'],
  'field-phone':['13800000000','13900000000','123'], 'field-search':['A','B',''], 'field-mask':['123456','654321','123x'],
  'field-currency':['12.30','0.10','1.234'], 'field-percent':['25','50.5','101'], 'field-unit':['12','20.5','-1'],
  'field-checkbox':['yes','no','Z'], 'field-radio':['A','B','Z'], 'field-switch':['off','on','Z'],
  'field-toggles':['A,B','B,C','A,A'], 'field-select':['A','B','Z'], 'field-multi':['A,B','B,C','Z'],
  'field-combo':['A','B','Z'], 'field-auto':['A','C','Z'], 'field-cascade':['east/SH','west/CD','east/CD'],
  'field-tree':['east/SH','west/CD','east/CD'], 'field-transfer':['A','A,C','A,A'], 'field-tags':['red,blue','green','red,red'],
  'field-mentions':['@An hello','@Bo ok','@Unknown'], 'field-async':['A','B','Z'],
  'field-date':['2026-06-01','2026-06-07','2026-02-30'], 'field-daterange':['2026-06-01/2026-06-03','2026-07-01/2026-07-02','2026-06-03/2026-06-01'],
  'field-time':['09:00','17:30','25:00'], 'field-timerange':['09:00/17:00','10:00/12:30','17:00/09:00'],
  'field-month':['2026-06','2026-12','2026-13'], 'field-year':['2026','2030','1800'],
  'field-week':['2026-W01','2026-W26','2025-W53'], 'field-calendar':['2026-06-01','2026-06-07','2026-02-30'],
  'field-datetime':['2026-06-01T09:00','2026-06-07T17:30','2026-02-30T09:00'],
  'field-slider':['20','60','101'], 'field-range':['20,80','30,70','80,20'], 'field-stepper':['2','4','3'],
  'field-color':['#315dde','#16715c','red'], 'field-otp':['123456','654321','12x456'],
  'field-signature':['10,10;80,40','20,20;60,70;90,40','-1,10;80,40'],
  'field-form':['Lin:2','Bo:3',':2'], 'field-field':['Lin','Bo',''], 'field-fieldset':['Lin:2','Bo:3','Lin:0'],
  'field-inputgroup':['12.30','0.10','-1'], 'field-dynamic':['name,qty','name,qty,note','name,name'],
  'field-builder':['name,qty','name,note','__proto__'], 'field-repeat':['A,B','A,B,C','A,A'],
  'field-condition':['person:Lin','company:ACME','company:'], 'field-summary':['Lin:2','Bo:3',':0'],
  'grid-card':['A','B','Z'], 'grid-list':['cut','print','Z'], 'grid-descriptions':['A','B','Z'],
  'grid-log':['save','review',''], 'grid-calendar':['1','7','32'], 'grid-scheduler':['1,3','5,7','3,4'],
  'grid-gantt':['1,3','2,5','5,2'], 'grid-carousel':['1','2','0'], 'grid-images':['red','blue','Z'],
  'grid-code':['const n=1;','<img src=x>',''], 'grid-json':['{"qty":2}','{"qty":3}','{'],
  'grid-markdown':['# Demo\n* safe','# Work\n* review',''], 'grid-files':['csv','pdf','Z'],
  'grid-keyvalue':['{"id":"A","qty":2}','{"id":"B"}','[]'], 'grid-datagrid':['A','C','Z'],
  'grid-tree':['closed','open','Z'], 'grid-pivot':['group','id','Z'], 'grid-virtual':['0','5','101'],
  'grid-virtualgrid':['0','6','101'], 'grid-infinite':['1','2','0'], 'grid-master':['A','B','Z'],
  'grid-expand':['A','B','Z'], 'grid-colgroup':['grouped','flat','Z'], 'grid-chooser':['id,qty','id,group','id,id'],
  'grid-pincol':['id','qty','Z'], 'grid-resize':['100','160','20'], 'grid-colorder':['id,group,qty','qty,id,group','id,qty'],
  'grid-visibility':['id,qty','id,group','id,id'], 'grid-rowselect':['A','A,C','Z'], 'grid-cell':['A:qty','B:cents','Z:qty'],
  'grid-pinrow':['A','C','Z'], 'grid-roworder':['A,B,C','C,A,B','A,A,B'], 'grid-group':['cut','print','Z'],
  'grid-aggregate':['qty','cents','Z'], 'grid-edit':['A:2','A:5','A:-1'], 'grid-sort':['group,qty','qty,group','bad'],
  'grid-facet':['cut:2','cut:3','cut:-1'], 'grid-headerfilter':['cut','print','Z'], 'grid-quick':['A','B',''],
  'grid-span':['1','2','0'], 'grid-clipboard':['1\t2\n3\t4','5\t6\n7\t8','1\t2\n3'],
  'grid-export':['csv','tsv','xml'], 'grid-autosize':['short','longer title',''], 'grid-rowheight':['24','40','10'],
  'grid-keyboard':['A:qty','B:cents','Z:id'], 'grid-fill':['2','3','-1'], 'grid-formula':['2*100','3*150','2+2']
};
const feedbackStates={badge:['draft','approved'],dot:['offline','online'],alert:['warning','dismissed'],snackbar:['removed','restored'],notification:['open','closed'],center:['unread','read'],result:['failure','success'],empty:['missing','reset'],skeleton:['loading','ready'],spinner:['loading','ready'],circular:['20','80'],inline:['idle','complete'],overlay:['loading','ready'],fullscreen:['loading','ready'],error:['invalid','valid'],undo:['removed','restored'],page:['404','200'],boundary:['throw','safe'],conflict:['stale','reloaded'],network:['offline','online'],offline:['offline','online'],connection:['closed','open','connecting'],reconnecting:['waiting','connected'],sync:['dirty','synced','syncing']};
for(const [kind,states] of Object.entries(feedbackStates))basicFixtures['feedback-'+kind]=[states[0],states[1],'INVALID'];
export function runBasicModel(kind,value) {
  const raw=text(value);
  if(kind.startsWith('layout-'))return {variant:kind.slice(7),width:integer(raw,160,520)};
  if(kind.startsWith('nav-'))return {page:integer(raw,1,3),label:['概览','工单','记录'][Number(raw)-1]};
  if(kind.startsWith('feedback-')){const variant=kind.slice(9);choice(raw,feedbackStates[variant]||[]);return {state:raw,...(variant==='circular'?{percent:Number(raw)}:{}),...(variant==='center'?{unread:raw==='read'?0:2}:{}),...(variant==='conflict'?{version:raw==='reloaded'?2:1}:{})};}
  switch(kind) {
    case 'visual-group':return {selected:choice(raw,['A','B'])};
    case 'visual-split':return {action:choice(raw,['save','export'])};
    case 'visual-fab':return {created:integer(raw,0,9)};
    case 'visual-toggle':return {pressed:choice(raw,['off','on'])==='on'};
    case 'visual-toolbar':return {align:choice(raw,['left','center','right'])};
    case 'visual-type':return {size:integer(raw,12,32)};
    case 'visual-icon':return {icon:choice(raw,['info','check'])};
    case 'visual-avatar':{const names=raw.trim().split(/\s+/);if(names.length!==2||names.some(name=>!name))fail('需要两个非空名字片段');return {initials:names.map(name=>Array.from(name)[0]).join('').toUpperCase()};}
    case 'visual-avatars':{const count=integer(raw,1,3);return {visible:['An','Bo','Cy'].slice(0,count),overflow:3-count};}
    case 'visual-chip':return {tags:parts(raw,['A','B','C'],true)};
    case 'visual-label':return {for:choice(raw,['name','qty'])};
    case 'visual-divider':return {orientation:choice(raw,['horizontal','vertical'])};
    case 'visual-swatch':case 'field-color':if(!/^#[\da-f]{6}$/i.test(raw))fail('请输入六位十六进制颜色');return {color:raw.toLowerCase()};
    case 'visual-key':return {keys:choice(raw,['Ctrl+K','Shift+Enter']).split('+')};
    case 'visual-code':case 'grid-code':if(!raw.trim())fail('代码文本不能为空');return {text:raw};
    case 'visual-theme':return {theme:choice(raw,['light','dark'])};
    case 'visual-density':return {padding:choice(raw,['normal','compact'])==='compact'?4:12};
    case 'field-textarea':if(!raw.trim())fail('文本不能为空');return {lines:raw.split('\n').length,text:raw};
    case 'field-password':if(raw.length<6||raw.length>32)fail('教学密码须 6–32 字符');return {length:raw.length};
    case 'field-email':if(!/^[\w.+-]+@[\w.-]+\.[a-z]{2,}$/i.test(raw))fail('教学邮箱格式无效');return {value:raw};
    case 'field-url':{let url;try{url=new URL(raw);}catch{fail('网址无效');}if(url.protocol!=='https:'||url.username||url.password)fail('仅允许无凭据的 HTTPS 网址');return {href:url.href};}
    case 'field-phone':if(!/^1[3-9]\d{9}$/.test(raw))fail('教学手机号须为大陆 11 位格式');return {masked:raw.slice(0,3)+'****'+raw.slice(-4)};
    case 'field-search':case 'grid-quick':if(!raw.trim())fail('搜索词不能为空');return {ids:demoRows.filter(row=>Object.values(row).join(' ').toLowerCase().includes(raw.toLowerCase())).map(row=>row.id)};
    case 'field-mask':case 'field-otp':if(!/^\d{6}$/.test(raw))fail('需要 6 位数字');return kind==='field-mask'?{formatted:raw.slice(0,3)+'-'+raw.slice(3)}:{digits:raw.split('')};
    case 'field-currency':case 'field-inputgroup':{if(!/^\d{1,6}(\.\d{1,2})?$/.test(raw))fail('金额最多六位整数及两位小数');const [a,b='']=raw.split('.');return {cents:Number(a)*100+Number(b.padEnd(2,'0'))};}
    case 'field-percent':case 'field-unit':{if(!/^\d{1,4}(\.\d{1,2})?$/.test(raw))fail('需要非负普通十进制');const n=Number(raw);if(n>(kind==='field-percent'?100:1000))fail('超出教学范围');return {value:n,unit:kind==='field-percent'?'%':'mm'};}
    case 'field-checkbox':return {checked:choice(raw,['yes','no'])==='yes'};
    case 'field-switch':return {checked:choice(raw,['off','on'])==='on'};
    case 'field-radio':case 'field-select':case 'field-combo':case 'field-auto':case 'field-async':return {selected:choice(raw,['A','B','C'])};
    case 'field-toggles':case 'field-multi':case 'field-transfer':return {selected:parts(raw,['A','B','C'],true)};
    case 'field-cascade':case 'field-tree':{choice(raw,['east/SH','east/HZ','west/CD']);return {path:raw.split('/')};}
    case 'field-tags':{const tags=raw.split(',');if(!tags.length||tags.length>5||tags.some(tag=>!/^[a-z]{1,8}$/.test(tag))||new Set(tags).size!==tags.length)fail('最多五个不重复小写标签');return {tags};}
    case 'field-mentions':{const matches=raw.match(/@\w+/g)||[];if(!matches.length||matches.some(name=>!['@An','@Bo'].includes(name)))fail('仅允许教学成员 An、Bo');return {mentions:matches,text:raw};}
    case 'field-date':case 'field-calendar':return {date:isoDate(raw)};
    case 'field-time':return {time:time(raw)};
    case 'field-daterange':case 'field-timerange':{const values=raw.split('/');if(values.length!==2)fail('范围需要两个端点');const check=kind==='field-daterange'?isoDate:time;values.forEach(check);if(values[0]>values[1])fail('范围起点不得晚于终点');return {start:values[0],end:values[1]};}
    case 'field-month':if(!/^\d{4}-(0[1-9]|1[0-2])$/.test(raw))fail('月份无效');isoDate(raw+'-01');return {month:raw};
    case 'field-year':return {year:integer(raw,1900,2100)};
    case 'field-week':{if(!/^\d{4}-W\d{2}$/.test(raw))fail('周格式无效');const year=integer(raw.slice(0,4),1900,2100),week=Number(raw.slice(-2));const jan1=new Date(Date.UTC(year,0,1)).getUTCDay();const leap=(year%4===0&&year%100!==0)||year%400===0;const max=jan1===4||(jan1===3&&leap)?53:52;if(week<1||week>max)fail('该年的 ISO 周不存在');return {year,week};}
    case 'field-datetime':{const pair=raw.split('T');if(pair.length!==2)fail('需要明确日期和时间');isoDate(pair[0]);time(pair[1]);return {localDateTime:raw};}
    case 'field-slider':return {value:integer(raw,0,100)};
    case 'field-range':{const range=raw.split(',');if(range.length!==2)fail('需要两个端点');const [low,high]=range.map(value=>integer(value,0,100));if(low>high)fail('滑块端点不能交叉');return {low,high};}
    case 'field-stepper':{const value=integer(raw,0,20);if(value%2)fail('步长为 2');return {value};}
    case 'field-signature':{const points=raw.split(';').map(pair=>pair.split(','));if(points.length<2||points.length>40||points.some(pair=>pair.length!==2))fail('需要 2–40 个坐标点');return {points:points.map(pair=>pair.map(value=>integer(value,0,100)))};}
    case 'field-form':case 'field-fieldset':case 'field-summary':{const [name,qty,...rest]=raw.split(':');if(rest.length||!name?.trim()||name.length>20)fail('名称必填且最多20字符');return {name,qty:integer(qty,1,10)};}
    case 'field-field':if(!raw.trim()||raw.length>20)fail('名称必填且最多20字符');return {name:raw};
    case 'field-dynamic':case 'field-builder':return {fields:parts(raw,['name','qty','note'])};
    case 'field-repeat':return {items:parts(raw,['A','B','C'])};
    case 'field-condition':{const [type,name,...rest]=raw.split(':');choice(type,['person','company']);if(rest.length||!name?.trim())fail('当前显示字段为必填');return {type,name};}
    case 'grid-card':case 'grid-descriptions':case 'grid-datagrid':case 'grid-master':case 'grid-expand':{choice(raw,['A','B','C']);return {...demoRows.find(row=>row.id===raw)};}
    case 'grid-list':case 'grid-headerfilter':case 'grid-group':return {rows:demoRows.filter(row=>row.group===choice(raw,['cut','print']))};
    case 'grid-log':if(!/^[a-z]{1,12}$/.test(raw))fail('日志动作为1–12个小写字母');return {events:[{seq:1,action:raw}]};
    case 'grid-calendar':return {date:`2026-06-${String(integer(raw,1,30)).padStart(2,'0')}`};
    case 'grid-scheduler':case 'grid-gantt':{const pair=raw.split(',');if(pair.length!==2)fail('需要开始、结束槽位');const [start,end]=pair.map(value=>integer(value,0,10));if(start>=end)fail('开始必须早于结束');if(kind==='grid-scheduler'&&start<5&&end>3)fail('与已有 [3,5) 时段冲突');return {start,end};}
    case 'grid-carousel':return {index:integer(raw,1,3)};
    case 'grid-images':return {images:[{id:'red',color:'#b93d45'},{id:'blue',color:'#315dde'}].filter(image=>image.id===choice(raw,['red','blue']))};
    case 'grid-json':return {value:json(raw)};
    case 'grid-markdown':if(!raw.trim())fail('Markdown不能为空');return {blocks:raw.split('\n').map(line=>({type:line.startsWith('# ')?'h3':line.startsWith('* ')?'li':'p',text:line.replace(/^(# |\* )/,'')}))};
    case 'grid-files':return {files:['demo.csv','guide.pdf','jobs.csv'].filter(name=>name.endsWith('.'+choice(raw,['csv','pdf'])))};
    case 'grid-keyvalue':{const value=json(raw);if(!value||Array.isArray(value)||typeof value!=='object')fail('需要JSON对象');return {entries:Object.entries(value)};}
    case 'grid-tree':return {ids:choice(raw,['open','closed'])==='open'?['P','A','B']:['P']};
    case 'grid-pivot':{choice(raw,['group','id']);const groups=new Map();for(const row of demoRows)groups.set(row[raw],(groups.get(row[raw])||0)+row.qty);return {groups:[...groups].map(([key,qty])=>({key,qty}))};}
    case 'grid-virtual':case 'grid-virtualgrid':{const start=integer(raw,0,94),size=kind==='grid-virtual'?4:6;return {start,indices:Array.from({length:size},(_,i)=>start+i),total:100};}
    case 'grid-infinite':return {count:Math.min(10,integer(raw,1,4)*3)};
    case 'grid-colgroup':return {grouped:choice(raw,['grouped','flat'])==='grouped'};
    case 'grid-chooser':case 'grid-visibility':return {columns:parts(raw,['id','group','qty','cents'])};
    case 'grid-pincol':return {pinned:choice(raw,['id','qty'])};
    case 'grid-resize':return {width:integer(raw,60,240)};
    case 'grid-colorder':{const columns=parts(raw,['id','group','qty']);if(columns.length!==3)fail('必须保留三个列ID');return {columns};}
    case 'grid-rowselect':return {ids:parts(raw,['A','B','C'],true)};
    case 'grid-cell':case 'grid-keyboard':{const [id,column,...rest]=raw.split(':');if(rest.length)fail('选区格式错误');choice(id,['A','B','C']);choice(column,['id','group','qty','cents']);return {id,column};}
    case 'grid-pinrow':{choice(raw,['A','B','C']);return {rows:[...demoRows.filter(row=>row.id===raw),...demoRows.filter(row=>row.id!==raw)]};}
    case 'grid-roworder':{const ids=parts(raw,['A','B','C']);if(ids.length!==3)fail('必须保留三行身份');return {rows:ids.map(id=>({...demoRows.find(row=>row.id===id)}))};}
    case 'grid-aggregate':{choice(raw,['qty','cents']);return {column:raw,sum:demoRows.reduce((sum,row)=>sum+row[raw],0)};}
    case 'grid-edit':{const [id,qty,...rest]=raw.split(':');choice(id,['A','B','C']);if(rest.length)fail('编辑格式错误');const next=integer(qty,0,10);return {rows:demoRows.map(row=>({...row,...(row.id===id?{qty:next}:{})}))};}
    case 'grid-sort':{const keys=raw.split(',');if(keys.length!==2||new Set(keys).size!==2||keys.some(key=>!['qty','group'].includes(key)))fail('排序白名单为group与qty');return {rows:[...demoRows].sort((a,b)=>{for(const key of keys){const n=typeof a[key]==='number'?a[key]-b[key]:a[key].localeCompare(b[key]);if(n)return n;}return a.id.localeCompare(b.id);})};}
    case 'grid-facet':{const [group,min,...rest]=raw.split(':');choice(group,['cut','print']);if(rest.length)fail('筛选格式错误');const qty=integer(min,0,10);return {rows:demoRows.filter(row=>row.group===group&&row.qty>=qty)};}
    case 'grid-span':return {span:integer(raw,1,2)};
    case 'grid-clipboard':{const rows=raw.split('\n').map(row=>row.split('\t'));if(rows.length>5||rows.some(row=>row.length!==rows[0].length)||rows[0].length>5)fail('仅支持最多5×5的矩形TSV');return {cells:rows.map(row=>row.map(value=>integer(value,0,100)))};}
    case 'grid-export':{const separator=choice(raw,['csv','tsv'])==='csv'?',':'\t';return {content:[['id','qty'],...demoRows.map(row=>[row.id,row.qty])].map(row=>row.join(separator)).join('\n'),type:raw};}
    case 'grid-autosize':if(!raw.trim())fail('标题不能为空');return {title:raw,characters:Math.max(7,Math.min(30,Array.from(raw).length+2))};
    case 'grid-rowheight':return {height:integer(raw,24,72)};
    case 'grid-fill':return {rows:demoRows.map(row=>({...row,qty:integer(raw,0,10)}))};
    case 'grid-formula':{if(!/^\d{1,4}\*\d{1,5}$/.test(raw))fail('只支持两个非负整数相乘');const [qty,cents]=raw.split('*').map(Number);return {qty,cents,total:qty*cents};}
    default:throw new Error('Unknown basic mechanism: '+kind);
  }
}
