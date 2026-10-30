/* Isolated educational demos. No network calls or production data writes. */
window.V8Demos=(()=>{
'use strict';
const $=(q)=>document.querySelector(q);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const output=(label='点击或调整上面的控件')=>`<div class="demo-output" id="v8Outcome" role="status">${label}</div>`;
const action=(txt,act='act',secondary=false,attrs='')=>`<button type="button" class="btn ${secondary?'btn-ghost':'btn-primary'}" data-v8="${act}" ${attrs}>${txt}</button>`;
const field=(type='text',placeholder='请输入',attrs='')=>`<input class="field" data-v8-input="1" type="${type}" placeholder="${placeholder}" ${attrs}>`;
const select=(opts)=>`<select class="field" data-v8-input="1">${opts.map(x=>`<option>${esc(x)}</option>`).join('')}</select>`;
const box=(body)=>`<div class="v8-mini-card">${body}</div>`;
const sampleRows=[['BJ-1028','瑞冠口腔','待生产'],['BJ-1029','悦己瑜伽','生产中'],['BJ-1030','天悦广告','已完成']];
const simpleTable=(rows=sampleRows)=>`<div class="table-wrap"><table><thead><tr><th>编号</th><th>客户</th><th>状态</th></tr></thead><tbody>${rows.map(r=>`<tr>${r.map(c=>`<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
const check=(name='确认资料')=>`<label class="v8-inline"> <input type="checkbox" data-v8-input="1"> ${name}</label>`;
function render(c){const id=c.id;
switch(id){
case 'container':return `<div class="v8-controls"><label>内容最大宽度 ${select(['640px','480px','100%'])}</label></div><div class="v8-preview-frame"><div data-v8-sample style="width:100%;max-width:640px">${box('这是限制阅读宽度的内容容器。')}</div></div>${output('改变宽度，观察边界变化')}`;
case 'grid':return `<label>列数 ${select(['2列','3列','1列'])}</label><div class="v8-box-grid" data-v8-sample>${[1,2,3,4,5,6].map(x=>box('项目 '+x)).join('')}</div>${output('选择列数，观察布局')}`;
case 'stack':return `<label>元素间距 ${select(['8px','16px','28px'])}</label><div data-v8-sample style="display:grid;gap:8px">${[1,2,3].map(x=>box('工序 '+x)).join('')}</div>${output('调整垂直布局间距')}`;
case 'sidebar':return `<div class="controls">${action('收起侧栏')}</div><div class="v8-mini-layout"><nav data-v8-sample class="v8-mini-side">客户<br>报价<br>订单</nav>${box('主工作区')}</div>${output()}`;
case 'breadcrumb':return `<nav class="v8-crumb">${action('首页','crumb',true)} › ${action('客户管理','crumb',true)} › 新增客户</nav>${output('点击上级路径，模拟返回')}`;
case 'split-view':return `<label>左侧宽度 <input type="range" min="20" max="65" value="37" data-v8-input="1"></label><div class="v8-split" data-v8-sample><div>${box('客户列表')}</div><div>${box('客户详情')}</div></div>${output('拖动滑块改变分栏')}`;
case 'card':return `<div class="v8-cards">${box('客户：瑞冠口腔<br><small>待确认</small>')}${box('客户：悦己瑜伽<br><small>已成交</small>')}</div>${action('切换卡片重点')}${output()}`;
case 'list':return `${field('search','查找客户')}<div data-v8-sample>${['瑞冠口腔','悦己瑜伽','天悦广告'].map(x=>box(x)).join('')}</div>${output('输入关键词筛选列表')}`;
case 'descriptions':return `${box('<b>订单编号：</b>BJ-1028<br><b>产品：</b>无边发光字<br><b>状态：</b>待生产')}${action('显示更多字段')}${output('详情页应区分标签与内容')}`;
case 'statistic':return `<div class="v8-stats"><div><small>今日回款</small><strong data-v8-sample>¥ 12,860</strong></div><div><small>订单数量</small><strong>18</strong></div></div>${action('刷新示例数值')}${output()}`;
case 'chart':return `<label>数据规模 <input type="range" min="40" max="100" value="65" data-v8-input="1"></label><div class="v8-bars" data-v8-sample>${[55,75,42,65].map(n=>`<span style="height:${n}%"></span>`).join('')}</div>${output('改变滑块，观察柱状图')}`;
case 'timeline':return `<div class="v8-timeline" data-v8-sample><div>09:00 录入订单</div><div>11:30 排版完成</div><div>14:00 等待生产</div></div>${action('新增进度记录')}${output()}`;
case 'tree':return `${action('展开/收起生产工序')}${box('▾ 字壳加工<div data-v8-sample class="v8-indent">├ 切割<br>├ 围边<br>└ 焊接</div>')}${output()}`;
case 'virtual-list':return `<div class="v8-scroll-list" data-v8-sample>${Array.from({length:30},(_,i)=>`<div>生产记录 ${String(i+1).padStart(3,'0')}</div>`).join('')}</div>${output('长列表局部滚动；此为可视化示例，非虚拟化性能实现')}`;
case 'activity-log':return `<div data-v8-sample>${box('10:20 录单员新增报价')}${box('10:48 客服确认客户资料')}</div>${action('添加活动记录')}${output()}`;
case 'comparison':return `${simpleTable([['组件','Table','List'],['展示形式','多列比较','单项浏览'],['手机适配','需改卡片','较自然']])}${action('突出推荐项')}${output()}`;
case 'carousel':return `<div class="v8-center">${action('上一张','prev',true)}<div class="v8-carousel" data-v8-sample>画面 1 / 3</div>${action('下一张','next',true)}</div>${output()}`;
case 'textarea':return `<label>售后说明 ${`<textarea class="field" data-v8-input="1" rows="4" maxlength="180" placeholder="输入说明内容"></textarea>`}</label>${output('0 / 180 字')}`;
case 'number-input':return `<label>数量 ${field('number','输入数量','min="0" step="1" value="2"')}</label>${output('当前数量：2')}`;
case 'search':case 'autocomplete':case 'combobox':return `<label>查找产品 ${field('search','输入无边、不锈钢或铝板','list="demoSearchList"')}</label><datalist id="demoSearchList"><option value="无边发光字"><option value="不锈钢背发光字"><option value="铝单板"></datalist>${output('选择建议或输入关键词')}`;
case 'date-picker':return `<label>交货日期 ${field('date','')}</label>${output('选择交货日期')}`;
case 'radio':return `<fieldset class="v8-fieldset"><legend>交付方式</legend>${['送货','自提','快递'].map((x,i)=>`<label class="v8-inline"><input type="radio" data-v8-input="1" name="v8Radio" value="${x}" ${i===0?'checked':''}>${x}</label>`).join('')}</fieldset>${output('送货')}`;
case 'upload':case 'file-drop':return `<label class="v8-upload"><span>选择图片 / 文件</span>${field('file','','accept="image/*,.pdf,.svg"')}</label>${output('仅在浏览器读取文件名，不上传服务器')}`;
case 'slider':return `<label>不透明度 <input type="range" data-v8-input="1" min="0" max="100" value="65"></label>${output('65%')}`;
case 'stepper':return `<div class="v8-center">${action('－','minus',true)}<strong data-v8-sample>1</strong>${action('＋','plus')}</div>${output('单次增加或减少 1')}`;
case 'password':return `<label>密码 ${field('password','请输入测试值','autocomplete="new-password"')}</label>${action('显示 / 隐藏','toggle')}${output('敏感数据请勿输入到教学 Demo')}`;
case 'tag-input':return `${field('text','添加一个工艺标签')}<div class="controls" data-v8-sample><span class="token">焊接</span><span class="token">喷漆</span></div>${action('添加标签')}${output('输入内容后添加')}`;
case 'currency':return `<label>示例金额（元） ${field('number','输入金额','min="0" step="0.01" value="128.50"')}</label>${output('¥128.50')}`;
case 'otp':return `<label>验证码（仅演示） ${field('text','6 位数字','inputmode="numeric" maxlength="6" pattern="[0-9]*"')}</label>${output('输入 6 位数字后显示长度校验')}`;
case 'dropdown':case 'popover':case 'context-menu':return `${action('打开操作菜单','toggle')}<div data-v8-sample class="v8-floating" hidden>${action('编辑','choose',true)}${action('复制','choose',true)}${action('删除','choose',true)}</div>${output('可切换操作菜单')}`;
case 'confirm-dialog':return `${action('删除模拟记录','confirm')}${output('需要二次确认')}`;
case 'tooltip':return `<button type="button" class="btn btn-ghost" title="这是订单编号说明，也可键盘聚焦" data-v8="act">将鼠标移入或聚焦</button>${output('提示不应包含必须阅读的核心信息')}`;
case 'pagination':return `<div class="v8-center">${action('上一页','prev',true)}<strong data-v8-sample>第 1 / 3 页</strong>${action('下一页','next')}</div>${output()}`;
case 'steps':case 'wizard':return `<div class="v8-step-label" data-v8-sample>1. 客户资料 → 2. 订单规格 → 3. 确认</div><div class="controls">${action('上一步','prev',true)}${action('下一步','next')}</div>${output('步骤 1 / 3')}`;
case 'accordion':return `<details class="v8-details"><summary>材料要求</summary><p>不锈钢板厚度由报价规则确认。</p></details><details class="v8-details"><summary>安装要求</summary><p>根据现场结构与受力情况复核。</p></details>${output('点击标题展开或收起')}`;
case 'segmented':case 'toggle-group':return `<div class="v8-center">${['待处理','生产中','已完成'].map((x,i)=>action(x,'choose',i!==0)).join('')}</div>${output('当前：待处理')}`;
case 'command':return `${field('search','输入客户、报价或生产指令')}<div class="v8-commands" data-v8-sample>${['新建客户','新建报价','查看订单'].map(x=>box(x)).join('')}</div>${output('输入内容筛选命令建议')}`;
case 'bottom-sheet':return `${action('打开底部操作层','sheet')}${output('底部弹层适合移动端选择少量动作')}`;
case 'rating':return `<div class="v8-stars">${[1,2,3,4,5].map(x=>`<button type="button" aria-label="评 ${x} 分" data-v8="rating" data-value="${x}">☆</button>`).join('')}</div>${output('尚未评分')}`;
case 'alert':return `<div class="v8-alert" data-v8-sample>订单金额未确认，请先核对价格。</div>${action('标记已处理')}${output()}`;
case 'empty-state':case 'empty-search':return `${box('暂无符合条件的数据')}${action('重试查询')}${output('空状态应明确下一步操作')}`;
case 'skeleton':return `<div data-v8-sample class="v8-skeleton"><i></i><i></i><i></i></div>${action('加载完成')}${output('骨架屏只在数据加载中出现')}`;
case 'progress':return `<div class="progressbar"><span data-v8-sample style="width:25%"></span></div>${action('进度 +15%')}${output('当前 25%')}`;
case 'validation':case 'inline-error':return `<label>客户名称 ${field('text','必填项')}</label>${action('提交验证')}${output('尚未验证')}`;
case 'status-dot':return `<div class="controls"><span class="v8-status-dot" data-v8-sample></span><b id="v8StatusText">设备在线</b></div>${action('切换状态')}${output('状态需有颜色以外的文字')}`;
case 'success-state':return `${action('完成示例操作')}${output('请执行操作')}`;
case 'undo':return `<div data-v8-sample>${box('待处理订单：3 条')}</div>${action('模拟删除')}${action('撤销','undo',true)}${output('删除后可撤销')}`;
case 'typography':return `${box('<h3>一级标题 · 24px</h3><p>正文 · 15px</p><small>辅助信息 · 13px</small>')}${action('切换粗细')}${output()}`;
case 'icon':return `<div class="v8-icons" data-v8-sample>⌕　▤　◎　✦　◫</div>${action('切换图标大小')}${output('图标应有文字标签或可访问名称')}`;
case 'divider':return `${box('客户资料<hr>订单明细<hr>付款信息')}${action('切换间距')}${output()}`;
case 'avatar':return `<div class="v8-center"><div class="v8-avatar" data-v8-sample>张</div><span>张师傅</span></div>${action('切换身份')}${output()}`;
case 'color-picker':return `<label>选择主色 ${field('color','','value="#315dd0"')}</label><div data-v8-sample class="v8-colorbox">预览色</div>${output('#315dd0')}`;
case 'transition':return `${action('执行过渡')}${box('<span data-v8-sample class="v8-transition">样式过渡区域</span>')}${output()}`;
case 'spinner':return `<div data-v8-sample class="v8-spinner"></div>${action('停止 / 开始')}${output('加载中')}`;
case 'kanban-board':return `<div class="v8-board" data-v8-sample>${['待生产','生产中','已完成'].map((x,i)=>box(x+'<br>订单 '+(i+1))).join('')}</div>${action('推进第一张订单')}${output()}`;
case 'editable-table':return `${simpleTable([['1','无边字','¥120'],['2','不锈钢字','¥240']])}<label>修改明细单价 ${field('number','输入单价','value="120" min="0"')}</label>${output('通过输入更新示例单价')}`;
case 'dependent-select':return `<label>产品 ${select(['无边发光字','不锈钢字','铝单板门头'])}</label><div data-v8-sample class="demo-output">建议规格：围边 60mm（演示值）</div>${output('规则参数仅作为界面模拟，不代表实际生产标准')}`;
case 'permission-matrix':return `<div class="v8-controls">${['查看报价','编辑报价','审核订单'].map(x=>check(x)).join('')}</div>${output('勾选查看权限组合（本地模拟）')}`;
case 'mobile-order-card':return `${box('<b>BJ-1028</b>　瑞冠口腔<br>待生产 · ¥1,560')}${action('展开订单详情')}${output()}`;
case 'focus-ring':return `${field('text','按 Tab 移动焦点')}${action('继续操作','act',true)}${output('聚焦时必须有明显可见轮廓')}`;
case 'skip-link':return `<a href="#v8Outcome" class="btn btn-ghost">跳到演示反馈区域</a>${output('键盘用户可跳过重复导航')}`;
case 'aria-live':return `${action('更新动态信息')}${output('此区域会向读屏器播报内容')}`;
case 'keyboard-shortcuts':return `<div class="demo-output">/ 搜索 · Tab 切换焦点 · Esc 关闭弹窗</div>${action('测试快捷键')}${output('常用快捷键不会抢占输入框')}`;
case 'bulk-actions':return `<div class="v8-controls">${['BJ-1001','BJ-1002','BJ-1003'].map(x=>check(x)).join('')}</div>${action('批量标记')}${output('已选择 0 项')}`;
case 'filter-builder':return `<div class="controls">${select(['状态：待生产','状态：生产中','状态：已完成'])}${select(['金额：全部','金额：大于1000','金额：小于1000'])}</div>${action('应用筛选')}${output('点击应用生成筛选结果')}`;
case 'approval':return `<div data-v8-sample class="v8-approval">申请 → <b>待审核</b> → 通过</div><div class="controls">${action('通过','approve')}${action('驳回','reject',true)}</div>${output('状态：待审核')}`;
case 'formula-builder':return `<label>长度 (cm) ${field('number','','value="40" min="1"')}</label><label>单价 (元/单位) ${field('number','','value="2.5" min="0.1" step="0.1"')}</label>${action('执行演示公式')}${output('仅演示表达式计算，不代表真实报价规则')}`;
default:return `${box(`<b>${esc(c.name)}</b><p>${esc(c.desc)}</p>`)}${action('查看交互反馈')}${output('此组件采用说明型状态演示')}`;
}}
function respond(text){const el=$('#v8Outcome');if(el)el.textContent=text}
let n=1;
function handleClick(e){const b=e.target.closest('[data-v8]');if(!b)return false;e.preventDefault();const act=b.dataset.v8,all=$('#demoStage'),v=all?.querySelector('[data-v8-sample]');
 if(act==='confirm'){const d=document.createElement('div');d.className='modal-mask';d.innerHTML=`<div class="modal-dialog" role="dialog" aria-modal="true"><h2>确认删除模拟记录？</h2><p>只改变本次演示状态。</p><div class="modal-footer"><button class="btn btn-ghost" type="button" data-v8="close-confirm">取消</button><button class="btn btn-danger" type="button" data-v8="yes-confirm">确认删除</button></div></div>`;document.body.append(d);d.querySelector('button').focus();return true}
 if(act==='close-confirm'||act==='yes-confirm'){document.querySelector('.modal-mask:has([data-v8="close-confirm"])')?.remove();respond(act==='yes-confirm'?'模拟删除成功':'已取消');return true}
 if(act==='sheet'){const d=document.createElement('div');d.className='v8-sheet-backdrop';d.innerHTML=`<div class="v8-sheet">选择操作<hr><button class="btn btn-primary" data-v8="close-sheet">确认选择</button><button class="btn btn-ghost" data-v8="close-sheet">关闭</button></div>`;document.body.append(d);return true}
 if(act==='close-sheet'){document.querySelector('.v8-sheet-backdrop')?.remove();respond('底部操作层已关闭');return true}
 if(act==='minus'||act==='plus'){n=Math.max(0,n+(act==='plus'?1:-1));if(v)v.textContent=n;respond('当前数量 '+n);return true}
 if(act==='prev'||act==='next'){n=Math.max(1,Math.min(3,n+(act==='next'?1:-1)));if(v)v.textContent=v.classList.contains('v8-carousel')?`画面 ${n} / 3`:v.classList.contains('v8-step-label')?`${n}. ${['客户资料','订单规格','确认'][n-1]}`:`第 ${n} / 3 页`;respond(`当前第 ${n} 步`);return true}
 if(act==='rating'){const val=Number(b.dataset.value);document.querySelectorAll('[data-v8="rating"]').forEach(x=>{x.textContent=Number(x.dataset.value)<=val?'★':'☆'});respond(`评分 ${val} / 5`);return true}
 if(act==='undo'){if(v)v.innerHTML='<div class="v8-mini-card">待处理订单：3 条</div>';respond('已撤销删除');return true}
 if(act==='choose'||act==='crumb'){document.querySelectorAll('[data-v8="choose"]').forEach(x=>x.classList.add('btn-ghost'));b.classList.remove('btn-ghost');respond(`当前选择：${b.textContent.trim()}`);return true}
 if(act==='approve'||act==='reject'){if(v)v.innerHTML=act==='approve'?'申请 → <b>已通过</b>':'申请 → <b>已驳回</b>';respond(act==='approve'?'审核通过':'审核驳回');return true}
 if(act==='toggle'){const p=all?.querySelector('input[type="password"],input[type="text"]');if(p){p.type=p.type==='password'?'text':'password';respond(p.type==='text'?'密码已显示':'密码已隐藏')}else if(v){v.hidden=!v.hidden;respond(v.hidden?'菜单关闭':'菜单打开')}return true}
 if(act==='submit'||act==='act'){let f=all?.querySelector('input:not([type="checkbox"]):not([type="radio"]):not([type="range"]):not([type="color"]):not([type="file"])');if(f && f.value && ['客户名称','字段'].some(x=>all.innerText.includes(x)))respond(`示例操作：${f.value}`);else respond(`已响应：${b.textContent.trim()}`);if(v&&all?.querySelector('.v8-mini-layout'))v.hidden=!v.hidden;}
 
 if(act==='yes' )respond('操作成功');
 const c=window.location.hash.split('/').at(-1);
 if(c==='activity-log'&&v)v.insertAdjacentHTML('afterbegin','<div class="v8-mini-card">15:05 模拟新增活动</div>');
 if(c==='timeline'&&v)v.insertAdjacentHTML('beforeend','<div>16:30 模拟完成检验</div>');
 if(c==='tag-input'&&v){const t=all.querySelector('input');if(t?.value.trim()){v.insertAdjacentHTML('beforeend',`<span class="token">${esc(t.value.trim())}</span>`);t.value=''}}
 if(c==='progress'&&v){let cur=parseInt(v.style.width)||25;cur=(cur+15)%101;v.style.width=cur+'%';respond(`当前 ${cur}%`)}
 if(c==='skeleton'&&v){v.classList.toggle('v8-skeleton');v.innerHTML=v.classList.contains('v8-skeleton')?'<i></i><i></i><i></i>':'<div>加载完毕 · 3 条记录</div>'}
 if(c==='color-picker'&&v){const x=all.querySelector('input');v.style.background=x.value}
 if(c==='transition'&&v)v.classList.toggle('on');
 if(c==='spinner'&&v)v.classList.toggle('paused');
 if(c==='kanban-board'&&v){v.lastElementChild.textContent='待生产 → 已完成'}
 if(c==='success-state'&&v)v.innerHTML='<b>✓ 操作成功</b>';
 if(c==='undo'&&v)v.innerHTML='<div class="v8-mini-card">待处理订单：2 条（可撤销）</div>';
 if(c==='tree'&&v)v.hidden=!v.hidden;
 if(c==='alert'&&v)v.textContent='✓ 资料已核对';
 if(c==='avatar'&&v)v.textContent=v.textContent==='张'?'李':'张';
 if(c==='icon'&&v)v.style.fontSize=v.style.fontSize==='32px'?'20px':'32px';
 if(c==='statistic'&&v)v.textContent=v.textContent.includes('12,860')?'¥ 14,230':'¥ 12,860';
 if(c==='sidebar'&&v)v.classList.toggle('collapsed');
 if(c==='typography'&&v)v.style.fontWeight=v.style.fontWeight==='900'?'400':'900';
 if(c==='card'&&v)v.style.boxShadow=v.style.boxShadow?'':'0 14px 30px #315dd01c';
 if(c==='descriptions'&&v)v.innerHTML=v.innerHTML.includes('交货')?'<b>订单编号：</b>BJ-1028<br><b>产品：</b>无边发光字<br><b>状态：</b>待生产':'<b>订单编号：</b>BJ-1028<br><b>产品：</b>无边发光字<br><b>状态：</b>待生产<br><b>交货：</b>待确认';
 if(c==='divider'&&v)v.style.lineHeight=v.style.lineHeight==='2.5'?'1.5':'2.5';
 if(c==='mobile-order-card'&&v)v.innerHTML+='<p>商品：不锈钢字 · 交付：自提</p>';
 if(c==='empty-state'||c==='empty-search')respond('已重试，当前仍为空');
 if(c==='comparison'&&v)v.style.background='#eff3ff';
 if(c==='validation'||c==='inline-error'){const field=all?.querySelector('input');respond(field?.value.trim()?'校验通过':'客户名称不能为空');if(field)field.setAttribute('aria-invalid',String(!field.value.trim()));}
 if(c==='formula-builder'){const vals=[...all.querySelectorAll('input')].map(x=>Number(x.value));respond(vals.every(Number.isFinite)?`演示计算：${vals[0]} × ${vals[1]} = ${(vals[0]*vals[1]).toFixed(2)}`:'请填写有效数值');}
 if(c==='filter-builder')respond('已应用筛选条件（模拟）');
 if(c==='permission-matrix')respond(`已选 ${all?.querySelectorAll('input:checked').length||0} 项权限`);
 if(c==='tag-input'){const t=all?.querySelector('input');if(t?.value.trim()){v?.insertAdjacentHTML('beforeend',`<span class="token">${esc(t.value.trim())}</span>`);t.value='';}}
 return true;
}
function handleInput(e){const t=e.target;if(!t.closest('#demoStage'))return;const id=window.location.hash.split('/').at(-1),v=$('#demoStage [data-v8-sample]');
 if(id==='container'&&v)v.style.maxWidth=t.value;
 else if(id==='grid'&&v)v.style.gridTemplateColumns='repeat('+parseInt(t.value)+', minmax(0,1fr))';
 else if(id==='stack'&&v)v.style.gap=t.value;
 else if(id==='split-view'&&v)v.style.gridTemplateColumns=t.value+'% 1fr';
 else if(id==='chart'&&v)v.querySelectorAll('span').forEach((b,i)=>b.style.height=Math.max(12,(Number(t.value)+[0,22,-18,8][i])%101)+'%');
 else if(id==='list'||id==='command'){let txt=t.value.trim().toLowerCase();v?.querySelectorAll('.v8-mini-card').forEach(x=>x.hidden=!x.textContent.toLowerCase().includes(txt))}
 else if(id==='color-picker'&&v)v.style.background=t.value;
 else if(id==='date-picker')respond(t.value||'尚未选择日期');
 else if(id==='otp')respond(/^\d{6}$/.test(t.value)?'验证码格式正确':'请输入 6 位数字');
 else if(id==='textarea')respond(`${t.value.length} / 180 字`);
 else if(id==='number-input')respond(`当前数量：${t.value}`);
 else if(id==='currency')respond(`¥${Number(t.value||0).toFixed(2)}`);
 else if(id==='slider')respond(`${t.value}%`);
 else if(id==='dependent-select'&&v)v.textContent=`${t.value}：规格需按实际工艺配置（本地演示）`;
 else if(id==='bulk-actions')respond(`已选择 ${$('#demoStage')?.querySelectorAll('input:checked').length||0} 项`);
 else if(t.type==='file')respond(t.files?.length?`已选：${[...t.files].map(x=>x.name).join(', ')}`:'未选择文件');
 else if(t.type==='checkbox'||t.type==='radio')respond(`当前选择：${t.value==='on'?(t.checked?'开启':'关闭'):t.value}`);
 else respond(t.value||'值已清空');
}
return {render,handleClick,handleInput};
})();
