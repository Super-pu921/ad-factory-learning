import * as model from './curriculum-models.mjs';

/** Per-topic browser experiments. All state is instance-local and disposable. */
export function renderCurriculumDemo(lesson,unit,{node,button}) {
  const root=node('div','live-demo batch-demo');root.dataset.demo=lesson.kind;
  root.append(node('h4','',`互动实验 · ${lesson.title}`));
  const controls=node('form','controls'),panel=node('div','experiment-panel'),output=node('p','feedback');
  output.setAttribute('role','status');output.dataset.result='';
  let dispose=()=>{};
  const ok=text=>{output.classList.remove('error');output.textContent=text;};
  const safe=fn=>()=>{try{fn();}catch(error){output.classList.add('error');output.textContent=error.message;}};
  let submit=()=>{};
  controls.addEventListener('submit',event=>{event.preventDefault();submit();});
  const run=(text,fn)=>{submit=safe(fn);const control=node('button','primary',text);control.type='submit';controls.append(control);return control;};
  const field=(label,value,type='text')=>{
    const wrapper=node('label','experiment-field',label),input=node('input');input.type=type;
    if(type!=='file')input.value=value;
    wrapper.append(input);controls.append(wrapper);return input;
  };
  const select=(label,values)=>{
    const wrapper=node('label','experiment-field',label),input=node('select');
    for(const [value,text] of values){const option=node('option','',text);option.value=value;input.append(option);}
    wrapper.append(input);controls.append(wrapper);return input;
  };
  const number=input=>input.value.trim()===''?NaN:Number(input.value);
  const add=(text,fn)=>{const control=button(text,safe(fn));controls.append(control);return control;};
  switch(lesson.kind) {
    case 'icon': {
      let pressed=false;
      const control=add('☆',()=>{pressed=!pressed;refresh();});control.setAttribute('aria-label','收藏教学条目');
      const disabled=field('禁用图标按钮','', 'checkbox');
      const refresh=()=>{control.setAttribute('aria-pressed',String(pressed));control.textContent=pressed?'★':'☆';ok(pressed?'教学条目已收藏（仅内存）':'教学条目未收藏');};
      disabled.addEventListener('change',()=>{control.disabled=disabled.checked;});refresh();break;
    }
    case 'grid': {
      const columns=select('列数',[[1,'1 列'],[2,'2 列'],[3,'3 列']]);columns.value='2';
      const gap=select('间隔',[[8,'8 px'],[20,'20 px']]),empty=field('空数据','','checkbox');
      panel.classList.add('experiment-grid');
      const refresh=()=>{
        panel.style.gridTemplateColumns=model.gridTracks(Number(columns.value));panel.style.gap=`${gap.value}px`;
        panel.replaceChildren(...(empty.checked?[node('p','','暂无教学卡片')]:['排版','切割','装配','检查','包装','发货'].map(text=>node('div','experiment-card',text))));
        ok(`${empty.checked?0:6} 张教学卡片 · ${columns.value} 列 · 间隔 ${gap.value}px`);
      };
      for(const control of [columns,gap,empty])control.addEventListener('change',refresh);refresh();break;
    }
    case 'tabs': {
      const labels=['概览','明细','记录'],contents=['教学任务 J-01 · 待检查','材料：示例板材；数量：2','教学任务创建于当前页面内存'];
      const tablist=node('div','controls');tablist.setAttribute('role','tablist');tablist.setAttribute('aria-label','教学详情栏目');
      const prefix=`${unit.id.replace(/[^a-z0-9]/gi,'-')}-tabs`;let index=0;
      const pane=node('div','experiment-card');pane.id=`${prefix}-panel`;pane.setAttribute('role','tabpanel');pane.tabIndex=0;
      const refresh=()=>{
        [...tablist.children].forEach((tab,i)=>{tab.setAttribute('aria-selected',String(i===index));tab.tabIndex=i===index?0:-1;});
        pane.setAttribute('aria-labelledby',`${prefix}-${index}`);pane.textContent=contents[index];ok(`当前面板：${labels[index]}`);
      };
      labels.forEach((label,i)=>{
        const tab=button(label,()=>{index=i;refresh();});tab.id=`${prefix}-${i}`;tab.setAttribute('role','tab');tab.setAttribute('aria-controls',pane.id);
        tab.addEventListener('keydown',event=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(event.key)){event.preventDefault();index=model.nextTab(index,event.key,labels.length);refresh();tablist.children[index].focus();}});
        tablist.append(tab);
      });panel.append(tablist,pane);refresh();break;
    }
    case 'input': {
      const input=field('教学编号','JOB-01');
      run('校验编号',()=>{const result=model.validateOrderCode(input.value);if(!result.valid)throw new Error(result.message);ok(`有效编号：${result.value}`);});
      add('清空编号',()=>{input.value='';ok('编号已清空，尚未提交');input.focus();});ok('按规则校验后才产生有效值');break;
    }
    case 'table': {
      const rows=[{id:'J-01',cents:30000},{id:'J-02',cents:10000},{id:'J-03',cents:20000},{id:'J-04',cents:10000}];
      const query=field('按编号筛选','');let descending=false;
      add('切换金额排序',()=>{descending=!descending;refresh();});
      const refresh=()=>{
        const view=model.tableRows(rows,{query:query.value,descending});
        const table=node('table'),caption=node('caption','','虚构教学订单'),head=node('thead'),tr=node('tr');
        for(const label of ['编号','教学金额（元）']){const th=node('th','',label);th.scope='col';tr.append(th);}head.append(tr);
        const body=node('tbody');view.forEach(row=>{const line=node('tr');line.append(node('td','',row.id),node('td','',(row.cents/100).toFixed(2)));body.append(line);});
        table.append(caption,head,body);panel.replaceChildren(table);ok(view.length?`${view.length} 条结果 · ${descending?'降序':'升序'}`:'没有匹配教学记录');
      };query.addEventListener('input',refresh);refresh();break;
    }
    case 'toast': {
      let timer;const clear=()=>{clearTimeout(timer);output.textContent='';};
      add('显示教学提示',()=>{clear();ok('教学操作已演示完成（非真实保存）');timer=setTimeout(clear,model.toastDelay(3));});
      add('关闭提示',clear);dispose=clear;ok('提示将在显示三秒后自动关闭，也可手动关闭');break;
    }
    case 'modal': {
      let accepted='原始教学草稿';
      const dialog=node('dialog','experiment-dialog'),title=node('h3','','编辑教学草稿');title.id=`${unit.id.replace(/[^a-z0-9]/gi,'-')}-dialog`;
      dialog.setAttribute('aria-labelledby',title.id);
      const label=node('label','experiment-field','草稿内容'),input=node('input');label.append(input);
      dialog.append(title,label,button('确认教学草稿',()=>dialog.close('confirm')),button('取消编辑',()=>dialog.close('cancel')));
      dialog.addEventListener('cancel',()=>{dialog.returnValue='cancel';});
      dialog.addEventListener('close',()=>{accepted=model.resolveConfirmation(accepted,dialog.returnValue==='confirm'?'confirm':'cancel',input.value);ok(`已接受的教学草稿：${accepted}`);if(root.isConnected)opener.focus();});
      const opener=add('打开草稿弹窗',()=>{input.value=accepted;dialog.returnValue='cancel';dialog.showModal();});
      panel.append(dialog);dispose=()=>{if(dialog.open)dialog.close('cancel');dialog.remove();};ok(`已接受的教学草稿：${accepted}`);break;
    }
    case 'file': {
      const file=field('选择教学 txt/csv 文件','','file');file.accept='.txt,.csv';
      file.addEventListener('change',safe(()=>{
        const selected=file.files[0];if(!selected){ok('未选择文件');return;}
        if(!model.validateFileMetadata(selected))throw new Error('仅允许不超过 1 MiB 的 txt/csv；未读取正文、未上传');
        ok(`仅元数据通过：${selected.name} · ${selected.size} 字节；未读取正文、未上传`);
      }));add('清空文件',()=>{file.value='';ok('文件选择已清空，未上传');});ok('只检查用户主动选择文件的元数据');break;
    }
    case 'chart': {
      const input=field('分类数量（逗号分隔）','12,8,20');
      const refresh=()=>{
        const values=model.chartValues(input.value);panel.replaceChildren();
        values.forEach((item,i)=>{const row=node('div','mini-bar-row'),label=node('span','',`分类 ${i+1}：${item.value}`),track=node('div','mini-bar-track'),bar=node('div','mini-bar');bar.style.width=`${item.percent}%`;track.append(bar);row.append(label,track);panel.append(row);});
        ok(`${values.length} 个分类 · 总数量 ${values.reduce((sum,item)=>sum+item.value,0)} · 共同零基线`);
      };run('绘制教学柱图',refresh);refresh();break;
    }
    case 'marker': {
      const lon=field('经度','0'),lat=field('纬度','0');
      panel.classList.add('coordinate-plane');panel.setAttribute('role','img');
      const marker=node('span','coordinate-marker','●');panel.append(marker);
      const refresh=()=>{
        const longitude=number(lon),latitude=number(lat),point=model.projectMarker(longitude,latitude);
        marker.style.left=`${point.x}%`;marker.style.top=`${point.y}%`;panel.setAttribute('aria-label',`经纬示意点 ${longitude},${latitude}`);
        ok(`经度 ${longitude} · 纬度 ${latitude} · 坐标示意，无真实底图或测距`);
      };run('放置教学标记',refresh);refresh();break;
    }
    case 'flow': {
      const qty=field('教学数量','2'),stock=field('教学库存','5');
      const refresh=()=>{
        const path=model.traceStockFlow(number(qty),number(stock)),list=node('ol','flow-lane');path.forEach(text=>list.append(node('li','',text)));panel.replaceChildren(list);ok(path.join(' → '));
      };run('追踪教学流程',refresh);refresh();break;
    }
    case 'approval': {
      let state='DRAFT';const actor=select('演示角色',[['requester','申请者'],['reviewer','审核者']]),reason=field('驳回原因','');const log=[];
      const refresh=()=>{const list=node('ol');log.forEach(text=>list.append(node('li','',text)));panel.replaceChildren(list);ok(`教学审批状态：${state}`);};
      for(const [action,label] of [['submit','提交审核'],['approve','通过审核'],['reject','驳回修改']])add(label,()=>{const next=model.approvalTransition(state,action,actor.value,reason.value);log.push(`${state} → ${next}${action==='reject'?`：${reason.value.trim()}`:''}`);state=next;refresh();});
      add('重置审批演示',()=>{state='DRAFT';log.length=0;refresh();});refresh();break;
    }
    case 'counter': {
      let a={a:0,b:0},b={a:0,b:0};
      const refresh=()=>{panel.textContent=`A 向量 ${JSON.stringify(a)}；B 向量 ${JSON.stringify(b)}`;ok(`副本 A：${a.a+a.b} · 副本 B：${b.a+b.b}（仅本地模拟）`);};
      add('A 增加一次',()=>{if(a.a>=1000000)throw new Error('教学计数已到上限');a.a++;refresh();});
      add('B 增加一次',()=>{if(b.b>=1000000)throw new Error('教学计数已到上限');b.b++;refresh();});
      add('同步两副本',()=>{const merged=model.mergeCounters(a,b);a={...merged};b={...merged};refresh();});
      add('重置副本',()=>{a={a:0,b:0};b={a:0,b:0};refresh();});refresh();break;
    }
    case 'tool': {
      const label=node('label','experiment-field','工具参数 JSON'),input=node('textarea');input.value='{"operation":"sum","values":[1,2,3]}';label.append(input);controls.append(label);
      const approved=field('允许本次教学计算','','checkbox');
      run('执行教学工具',()=>{const result=model.runDemoTool(JSON.parse(input.value),approved.checked);ok(`${result.tool} · ${result.status} · 结果 ${result.result}（本地模拟）`);});
      ok('尚未执行，不连接模型或外部服务');break;
    }
    case 'contrast': {
      const foreground=field('文字颜色','#777777'),background=field('背景颜色','#ffffff'),preview=node('p','contrast-preview','教学文字 Aa 123');panel.append(preview);
      const refresh=()=>{
        const result=model.contrastRatio(foreground.value,background.value);preview.style.color=foreground.value;preview.style.backgroundColor=background.value;
        ok(`对比度 ${result.ratio.toFixed(2)}:1 · 普通文字 AA ${result.normalAA?'通过':'未通过'} · 大字 AA ${result.largeAA?'通过':'未通过'}`);
      };run('计算文字对比度',refresh);refresh();break;
    }
    case 'history': {
      let history=model.createHistory(['排版']),serial=1;
      const refresh=()=>{const snapshot=history.snapshot(),list=node('ol');snapshot.value.forEach(text=>list.append(node('li','',text)));panel.replaceChildren(list);undo.disabled=!snapshot.canUndo;redo.disabled=!snapshot.canRedo;ok(`${snapshot.value.length} 个教学工序 · 撤销${snapshot.canUndo?'可用':'不可用'} · 重做${snapshot.canRedo?'可用':'不可用'}`);};
      add('添加教学工序',()=>{history.apply([...history.snapshot().value,`新增工序 ${serial++}`]);refresh();});
      const undo=add('撤销工序',()=>{history.undo();refresh();}),redo=add('重做工序',()=>{history.redo();refresh();});
      add('重置工序',()=>{history=model.createHistory(['排版']);serial=1;refresh();});refresh();break;
    }
    case 'link': {
      const input=field('教学目标地址','#K-D01-001/L2');
      run('生成教学链接',()=>{
        const target=model.teachingHref(input.value),link=node('a','inline-link',target.external?'打开教学外链（新窗口）':'前往指定教学单元');link.href=target.href;
        if(target.external){link.target='_blank';link.rel='noopener noreferrer';}
        panel.replaceChildren(link);ok(target.external?'已生成 HTTPS 外链，尚未访问':'已生成目录内直达链接，尚未跳转');
      });ok('支持目录教学锚点或 HTTPS 地址');break;
    }
    case 'flex': {
      const direction=select('主轴方向',[['row','横向 row'],['column','纵向 column']]),wrap=field('允许换行','','checkbox');wrap.checked=true;
      panel.classList.add('flex-experiment');
      for(const text of ['排版','切割','装配','检查'])panel.append(node('div','experiment-card',text));
      const refresh=()=>{Object.assign(panel.style,model.flexConfig(direction.value,wrap.checked));ok(`四张卡片 · ${direction.value} · ${wrap.checked?'允许换行':'不换行'}`);};
      direction.addEventListener('change',refresh);wrap.addEventListener('change',refresh);refresh();break;
    }
    case 'pagination': {
      const items=Array.from({length:23},(_,index)=>`J-${String(index+1).padStart(3,'0')}`),size=select('每页条数',[[5,'5 条'],[10,'10 条'],[20,'20 条']]),empty=field('空集合','','checkbox');let current=1;
      const previous=add('上一页',()=>{current--;refresh();}),next=add('下一页',()=>{current++;refresh();});
      const refresh=()=>{
        const view=empty.checked?[]:items,state=model.pagination(view.length,current,Number(size.value));current=state.page||1;
        const list=node('ol');for(const id of view.slice(state.start,state.end))list.append(node('li','',id));panel.replaceChildren(list);
        previous.disabled=state.page<=1;next.disabled=state.page===0||state.page>=state.pages;
        ok(`第 ${state.page}/${state.pages} 页 · ${view.length} 条教学记录 · 当前 ${state.end-state.start} 条`);
      };
      for(const input of [size,empty])input.addEventListener('change',()=>{current=1;refresh();});refresh();break;
    }
    case 'number': {
      const input=field('教学调整量','-1.25');input.inputMode='decimal';const accepted=node('p','accepted-value','尚无有效百分位');panel.append(accepted);
      run('校验教学数字',()=>{const value=model.decimalHundredths(input.value);accepted.textContent=`最后有效百分位：${value}`;ok(`已接受 ${(value/100).toFixed(2)}`);});ok('范围 -100–100，最多两位小数；空值不等于零');break;
    }
    case 'statistic': {
      const current=field('当期教学件数','12'),previous=field('上期教学件数','10');
      const refresh=()=>{const result=model.statisticChange(number(current),number(previous));panel.textContent=`当期 ${number(current)} 件 · 差值 ${result.delta>0?'+':''}${result.delta} 件`;
        ok(result.percent===null?'上期为零，相对变化无法计算':`相对变化 ${result.percent>0?'+':''}${result.percent.toFixed(2)}%`);};
      run('计算教学指标',refresh);refresh();break;
    }
    case 'progress': {
      let completed=0;const unknown=field('总量未知','','checkbox'),label=node('label','','教学步骤进度'),bar=node('progress');bar.max=5;label.append(bar);panel.append(label);
      const advance=add('推进教学步骤',()=>{completed++;refresh();});add('重置教学进度',()=>{completed=0;refresh();});
      const refresh=()=>{const state=model.progressState(completed,5);if(unknown.checked)bar.removeAttribute('value');else bar.value=completed;advance.disabled=unknown.checked||state.done;ok(unknown.checked?'总量未知，不报告百分比':`${completed}/5 · ${state.percent}% · ${state.done?'教学计数完成':'教学计数进行中'}`);};
      unknown.addEventListener('change',refresh);refresh();break;
    }
    case 'popover': {
      const anchor=node('div','popover-anchor'),popup=node('div','teaching-popover','工序说明：先核对教学材料，再安排教学工序。');popup.hidden=true;popup.id=`${unit.id}-popover`;
      const trigger=button('展开工序说明',()=>setOpen(popup.hidden));trigger.setAttribute('aria-controls',popup.id);
      const setOpen=(open,restore=false)=>{popup.hidden=!open;trigger.setAttribute('aria-expanded',String(open));ok(open?'说明已展开':'说明已关闭');if(restore)trigger.focus();};
      const outside=event=>{if(!anchor.contains(event.target)&&!popup.hidden)setOpen(false);};
      const escape=event=>{if(event.key==='Escape'&&!popup.hidden){event.preventDefault();event.stopPropagation();setOpen(false,true);}};
      document.addEventListener('pointerdown',outside);document.addEventListener('keydown',escape,true);
      dispose=()=>{document.removeEventListener('pointerdown',outside);document.removeEventListener('keydown',escape,true);};
      anchor.append(trigger,popup);panel.append(anchor);setOpen(false);break;
    }
    case 'json': {
      const label=node('label','experiment-field','教学 JSON'),input=node('textarea');input.value='{"qty":2,"name":"教学"}';label.append(input);controls.append(label);
      const preview=node('pre');preview.dataset.jsonPreview='';panel.append(preview);
      run('格式化教学 JSON',()=>{preview.textContent=model.formatTeachingJson(input.value);ok('JSON 语法有效，仅生成内存预览');});ok('尚未解析，无文件读取或导入');break;
    }
    case 'line': {
      const input=field('有序观测值','2,5,3');
      const svgNode=(tag,attrs)=>{const element=document.createElementNS('http://www.w3.org/2000/svg',tag);for(const [key,value] of Object.entries(attrs))element.setAttribute(key,String(value));return element;};
      const refresh=()=>{
        const points=model.linePoints(input.value),svg=svgNode('svg',{viewBox:'-5 -10 110 120',role:'img','aria-label':'按教学序号排列的折线图',class:'teaching-line-chart'});
        svg.append(svgNode('polyline',{points:points.map(point=>`${point.x},${point.y}`).join(' '),fill:'none',stroke:'#315dd0','stroke-width':1.5}));
        points.forEach(point=>svg.append(svgNode('circle',{cx:point.x,cy:point.y,r:2.5,fill:'#315dd0'})));
        const list=node('ol');points.forEach((point,index)=>list.append(node('li','',`教学序号 ${index+1}：${point.value}`)));panel.replaceChildren(svg,list);ok(`${points.length} 个有效观测 · 等间隔教学序号，无预测`);
      };run('绘制教学折线',refresh);refresh();break;
    }
    case 'layers': {
      const names={base:'底图示意',route:'路线示意',point:'点位示意'};let layers=Object.keys(names).map(id=>({id,visible:true}));
      const selected=select('操作图层',Object.entries(names));selected.value='route';
      const visibility=Object.keys(names).map(id=>{const input=field(`显示${names[id]}`,'','checkbox');input.checked=true;input.addEventListener('change',()=>{layers=layers.map(layer=>({...layer,visible:layer.id===id?input.checked:layer.visible}));refresh();});return input;});
      add('图层上移',()=>{layers=model.reorderLayers(layers,selected.value,1);refresh();});add('图层下移',()=>{layers=model.reorderLayers(layers,selected.value,-1);refresh();});
      const refresh=()=>{
        const plane=node('div','layer-plane');plane.setAttribute('aria-label','虚构图层坐标示意');
        for(const [index,layer] of layers.entries()){const item=node('div',`layer-shape layer-${layer.id}`,names[layer.id]);item.hidden=!layer.visible;item.style.zIndex=String(index);item.dataset.layer=layer.id;plane.append(item);}
        panel.replaceChildren(plane,node('p','',`底到顶：${layers.map(layer=>names[layer.id]).join(' → ')}`));ok(`可见 ${layers.filter(layer=>layer.visible).length}/3 层 · 无实际地图服务`);
      };refresh();break;
    }
    case 'snap': {
      const x=field('原始横坐标','23'),y=field('原始纵坐标','37'),step=select('吸附网格',[[5,'5'],[10,'10'],[20,'20']]);step.value='10';
      const refresh=()=>{
        const result=model.snapToGrid(number(x),number(y),Number(step.value)),plane=node('div','coordinate-plane');
        for(const [px,py,text] of [[number(x),number(y),'○'],[result.x,result.y,'◆']]){const marker=node('span','coordinate-marker',text);marker.style.left=`${px}%`;marker.style.top=`${py}%`;plane.append(marker);}
        panel.replaceChildren(plane);ok(`原始 ${number(x)},${number(y)} → 吸附 ${result.x},${result.y}`);
      };run('吸附教学点',refresh);refresh();break;
    }
    case 'kanban': {
      let cards=[{id:'A',status:'TODO'},{id:'B',status:'DOING'}];const selected=select('选择教学卡片',[['A','A · 排版'],['B','B · 切割']]),target=select('目标看板列',[['TODO','TODO 待办'],['DOING','DOING 进行中'],['DONE','DONE 完成']]);target.value='DOING';
      const refresh=()=>{const board=node('div','teaching-board');for(const status of ['TODO','DOING','DONE']){const lane=node('section','experiment-card');lane.append(node('h5','',status));for(const card of cards.filter(item=>item.status===status))lane.append(node('p','',`教学卡片 ${card.id}`));board.append(lane);}panel.replaceChildren(board);};
      run('移动教学卡片',()=>{cards=model.moveKanban(cards,selected.value,target.value);refresh();ok(`${selected.value} → ${target.value} · 共两张教学卡片`);});refresh();ok('A 在 TODO，B 在 DOING；只允许相邻列流转');break;
    }
    case 'typing': {
      const input=field('本地模拟输入','');let timer=null,last=null;
      const refresh=()=>ok(model.typingActive(last,performance.now())?'本地模拟：正在输入（未发送）':'本地模拟：暂无输入信号');
      const clear=()=>{clearTimeout(timer);timer=null;};
      input.addEventListener('input',()=>{clear();last=input.value?performance.now():null;refresh();if(last!==null)timer=setTimeout(()=>{timer=null;last=null;refresh();},1000);});
      add('清空模拟输入',()=>{input.value='';clear();last=null;refresh();});dispose=clear;refresh();break;
    }
    case 'branch': {
      const original=[{role:'user',text:'教学任务：比较两种排版'},{role:'assistant',text:'教学示例：方案甲'},{role:'user',text:'再比较材料'},{role:'assistant',text:'教学示例：材料对比'}];let branch=[];
      const from=select('分支起点',original.map((message,index)=>[index,`第 ${index+1} 条 · ${message.role}`]));from.value='1';const input=field('分支续写文本','教学方案乙');
      const refresh=()=>{panel.replaceChildren();for(const [title,messages] of [['原始教学对话（4 条）',original],['当前教学分支',branch]]){const section=node('section');section.append(node('h5','',title));const list=node('ol');messages.forEach(message=>list.append(node('li','',`${message.role}：${message.text}`)));section.append(list);panel.append(section);}};
      add('从选中点建立分支',()=>{branch=model.branchMessages(original,Number(from.value));refresh();ok(`分支 ${branch.length} 条 · 原始对话 4 条`);});
      run('追加教学续写',()=>{const text=input.value.trim();if(!branch.length||!text||text.length>80||branch.length>=20)throw new Error('先建立分支，再输入 1–80 字文本；分支最多 20 条');branch=[...branch,{role:'user',text}];refresh();ok(`分支 ${branch.length} 条 · 原始对话 4 条 · 无 AI 调用`);});refresh();ok('尚未建立分支，仅使用四条虚构教学消息');break;
    }
    case 'locale': {
      const input=field('规范十进制数','1234.5'),locale=select('显示地区',[['zh-CN','中文（中国）'],['en-US','英文（美国）'],['de-DE','德文（德国）']]);
      const refresh=()=>{const formatted=model.localizedNumber(input.value,locale.value);panel.textContent=`地区格式：${formatted}`;ok(`内部百分位：${model.decimalHundredths(input.value,1000000)} · 显示地区 ${locale.value}`);};
      run('格式化教学数字',refresh);locale.addEventListener('change',safe(refresh));refresh();break;
    }
    case 'debounce': {
      const input=field('防抖教学搜索',''),names=['排版教学','切割教学','装配教学','检查教学'];let calls=0;
      const debouncer=model.createDebouncer(query=>{calls++;const matches=names.filter(name=>name.includes(query));panel.textContent=matches.length?matches.join(' · '):'没有匹配教学名称';ok(`已执行 ${calls} 次 · 查询“${query}”`);},300);
      input.addEventListener('input',()=>{debouncer.run(input.value.trim());ok(`等待安静 300 ms · 已执行 ${calls} 次`);});
      add('取消待执行搜索',()=>{debouncer.cancel();ok(`已取消 · 已执行 ${calls} 次`);});dispose=()=>debouncer.dispose();panel.textContent=names.join(' · ');ok('尚未执行 · 四个本地教学名称');break;
    }
    case 'badge': {
      const count=field('教学通知数量','120'),cap=select('徽标显示上限',[[9,'9+'],[99,'99+']]);cap.value='99';const badge=node('span','teaching-badge');badge.setAttribute('role','img');panel.append(badge);
      const refresh=()=>{const state=model.badgeCount(number(count),Number(cap.value));badge.textContent=state.text;badge.setAttribute('aria-label',state.label);ok(`实际 ${number(count)} 条 · 显示 ${state.text}`);};run('更新教学徽标',refresh);refresh();break;
    }
    case 'aspect': {
      const ratio=select('容器比例',[['16,9','16:9'],['4,3','4:3'],['1,1','1:1']]),width=select('实验容器宽度',[[160,'160 px'],[240,'240 px']]),box=node('div','aspect-experiment','无外部图片的教学占位');panel.append(box);
      const refresh=()=>{const [w,h]=ratio.value.split(',').map(Number);box.style.aspectRatio=model.aspectRatio(w,h);box.style.width=`${width.value}px`;ok(`比例 ${w}:${h} · 目标宽度 ${width.value}px，受可用空间限制`);};for(const input of [ratio,width])input.addEventListener('change',refresh);refresh();break;
    }
    case 'breadcrumb': {
      const depth=select('教学路径深度',[[1,'1 · 教学中心'],[2,'2 · 排版任务'],[3,'3 · 任务详情']]);depth.value='3';
      const refresh=()=>{const path=model.breadcrumbPath(Number(depth.value)),nav=node('nav'),list=node('ol','breadcrumb-demo');nav.setAttribute('aria-label','教学面包屑');path.forEach((text,index)=>{const item=node('li');if(index===path.length-1){item.textContent=text;item.setAttribute('aria-current','page');}else item.append(button(text,()=>{depth.value=String(index+1);refresh();}));list.append(item);});nav.append(list);panel.replaceChildren(nav);ok(`当前教学位置：${path.at(-1)} · 未改变实际路由`);};depth.addEventListener('change',refresh);refresh();break;
    }
    case 'checks': {
      const entries=[['print','印刷'],['cut','切割'],['pack','包装']],inputs=entries.map(([id,label])=>({id,input:field(`选择${label}`,'','checkbox')}));
      const refresh=()=>{const selected=model.selectedOperations(inputs.filter(item=>item.input.checked).map(item=>item.id));panel.textContent=`已选 ${selected.length}/3：${selected.join(', ')||'无'}`;};
      inputs.forEach(item=>item.input.addEventListener('change',refresh));add('全选教学工序',()=>{inputs.forEach(item=>{item.input.checked=true;});refresh();});add('清空教学工序',()=>{inputs.forEach(item=>{item.input.checked=false;});refresh();});
      run('核对教学选择',()=>{const selected=model.selectedOperations(inputs.filter(item=>item.input.checked).map(item=>item.id));if(!selected.length)throw new Error('至少选择一个教学工序');ok(`仅核对：${selected.join(', ')} · 没有执行批处理`);});refresh();ok('尚未提交选择');break;
    }
    case 'timeline': {
      const base=Date.UTC(2026,0,1,8),events=[{id:'T-01',at:base,text:'教学任务创建'},{id:'T-02',at:base+600000,text:'教学排版完成'}];let serial=3;
      const descending=field('时间倒序','','checkbox'),minute=field('新增事件分钟偏移','5');
      const refresh=()=>{const list=node('ol');for(const event of model.timelineEvents(events,descending.checked))list.append(node('li','',`${new Date(event.at).toISOString()} · ${event.id} · ${event.text}`));panel.replaceChildren(list);ok(`${events.length} 条虚构教学事件 · UTC 时间`);};
      add('添加教学事件',()=>{const offset=number(minute);if(!Number.isInteger(offset)||offset<0||offset>60||events.length>=20)throw new Error('分钟偏移须为 0–60 整数，最多 20 条事件');events.push({id:`T-${String(serial++).padStart(2,'0')}`,at:base+offset*60000,text:'新增教学事件'});refresh();});descending.addEventListener('change',refresh);refresh();break;
    }
    case 'retry': {
      const fail=field('模拟教学失败','','checkbox');fail.checked=true;let state={phase:'idle',attempt:0},timer=null;
      const refresh=()=>{start.disabled=state.phase==='loading'||state.phase==='success'||state.attempt>=5;reset.disabled=state.phase==='loading';ok(`教学任务 ${state.phase} · 已尝试 ${state.attempt}/5 次`);};
      const start=add('执行或重试教学任务',()=>{state=model.retryTransition(state,'start');const shouldFail=fail.checked;refresh();timer=setTimeout(()=>{timer=null;state=model.retryTransition(state,shouldFail?'fail':'succeed');refresh();},300);});
      const reset=add('重置重试实验',()=>{state=model.retryTransition(state,'reset');refresh();});dispose=()=>clearTimeout(timer);refresh();break;
    }
    case 'tooltip': {
      const anchor=node('div','popover-anchor'),trigger=button('聚焦查看术语说明',()=>{}),tip=node('div','teaching-popover','出血：此处只展示教学定义。');tip.id=`${unit.id}-tooltip`;tip.setAttribute('role','tooltip');trigger.setAttribute('aria-describedby',tip.id);let hovered=false,focused=false,dismissed=false;
      const refresh=()=>{tip.hidden=!model.tooltipVisible(hovered,focused,dismissed);ok(tip.hidden?'术语提示已隐藏':'术语提示可见');};
      trigger.addEventListener('pointerenter',()=>{hovered=true;dismissed=false;refresh();});anchor.addEventListener('pointerleave',()=>{hovered=false;if(!focused)dismissed=false;refresh();});trigger.addEventListener('focus',()=>{focused=true;dismissed=false;refresh();});trigger.addEventListener('blur',()=>{focused=false;if(!hovered)dismissed=false;refresh();});
      const escape=event=>{if(event.key==='Escape'&&!tip.hidden){event.preventDefault();event.stopPropagation();dismissed=true;refresh();}};document.addEventListener('keydown',escape,true);dispose=()=>document.removeEventListener('keydown',escape,true);anchor.append(trigger,tip);panel.append(anchor);refresh();break;
    }
    case 'csv': {
      const label=node('label','experiment-field','教学 CSV 文本'),input=node('textarea');input.value='id,qty\nA,2\n"B,教学",3';label.append(input);controls.append(label);
      run('预览教学 CSV',()=>{const rows=model.previewCsv(input.value),list=node('ol');for(const row of rows)list.append(node('li','',`${row.id} · 数量 ${row.qty}`));panel.replaceChildren(list);ok(`${rows.length} 行教学预览 · 尚未导入`);});ok('只解析主动键入的文本，不读取文件');break;
    }
    case 'donut': {
      const input=field('占比教学数量','2,3');
      const refresh=()=>{const segments=model.donutSegments(input.value),svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 100 100');svg.setAttribute('class','teaching-donut');svg.setAttribute('role','img');svg.setAttribute('aria-label','教学数量占比环形图');let offset=0;
        const circle=(color,percent,from)=>{const c=document.createElementNS(svg.namespaceURI,'circle');for(const [key,value] of Object.entries({cx:50,cy:50,r:34,fill:'none',stroke:color,'stroke-width':14,pathLength:100,'stroke-dasharray':`${percent} ${100-percent}`,'stroke-dashoffset':-from,transform:'rotate(-90 50 50)'}))c.setAttribute(key,String(value));svg.append(c);};circle('#e1e8f4',100,0);
        const colors=['#315dd0','#b75d32','#248267','#8c57ad','#876400','#3f7d9e'];segments.forEach((item,index)=>{if(item.percent)circle(colors[index],item.percent,offset);offset+=item.percent;});const list=node('ol');segments.forEach(item=>list.append(node('li','',`数量 ${item.value} · ${item.percent.toFixed(2)}%`)));panel.replaceChildren(svg,list);ok(segments.every(item=>!item.value)?'总量为零，没有可定义的占比':'按总量计算占比，文字数据可复核');};run('绘制教学环形图',refresh);refresh();break;
    }
    case 'geojson': {
      const label=node('label','experiment-field','教学 GeoJSON'),input=node('textarea');input.value='{"type":"FeatureCollection","features":[{"type":"Feature","geometry":{"type":"Point","coordinates":[0,0]},"properties":{"name":"教学点"}}]}';label.append(input);controls.append(label);
      run('预览教学点集合',()=>{const points=model.geojsonPoints(input.value),plane=node('div','coordinate-plane'),list=node('ol');for(const point of points){const marker=node('span','coordinate-marker','●');marker.style.left=`${point.x}%`;marker.style.top=`${point.y}%`;plane.append(marker);list.append(node('li','',`${point.name} · 经度 ${point.lon} · 纬度 ${point.lat}`));}panel.replaceChildren(plane,list);ok(`${points.length} 个教学 Point · 无实际底图或文件读取`);});ok('仅接受限量二维 Point 集合');break;
    }
    case 'viewport': {
      const zoom=select('视口缩放倍数',[[0.5,'0.5×'],[1,'1×'],[2,'2×']]);zoom.value='1';const dx=field('水平平移','0'),dy=field('垂直平移','0');
      const refresh=()=>{const point=model.viewportPoint(25,30,Number(zoom.value),number(dx),number(dy)),plane=node('div','coordinate-plane'),marker=node('span','coordinate-marker','◆');marker.style.left=`${point.x}%`;marker.style.top=`${point.y}%`;plane.append(marker);panel.replaceChildren(plane);ok(`原点 25,30 → 视口 ${point.x},${point.y} · 超出框的图形会裁切`);};run('更新教学视口',refresh);refresh();break;
    }
    case 'wizard': {
      let step=0;const code=field('向导教学编号','JOB-01'),quantity=field('向导教学数量','2');
      const refresh=()=>{code.parentElement.hidden=step!==0;quantity.parentElement.hidden=step!==1;previous.disabled=step===0;next.disabled=step===2;panel.textContent=step===2?`内存预览：${code.value.trim()} · 数量 ${number(quantity)}`:`正在编辑第 ${step+1} 步`;ok(`第 ${step+1}/3 步 · 未保存订单或学习记录`);};
      const previous=add('向导上一步',()=>{step--;refresh();}),next=add('校验并到下一步',()=>{step=model.wizardAdvance(step,{code:code.value,quantity:number(quantity)});refresh();});refresh();break;
    }
    case 'resolution': {
      let state='OPEN';const onlyOpen=field('仅显示未解决评论','','checkbox');
      const refresh=()=>{panel.replaceChildren(...(onlyOpen.checked&&state==='RESOLVED'?[node('p','','暂无未解决教学评论')]:[node('p','','教学甲：核对材料。'),node('p','','教学乙：已补充教学说明。')]));resolve.disabled=state==='RESOLVED';reopen.disabled=state==='OPEN';ok(`教学评论 ${state} · 原始两条评论保持`);};
      const resolve=add('解决教学评论',()=>{state=model.resolveThread(state,'resolve');refresh();}),reopen=add('重新打开教学评论',()=>{state=model.resolveThread(state,'reopen');refresh();});onlyOpen.addEventListener('change',refresh);refresh();break;
    }
    case 'structured': {
      const label=node('label','experiment-field','教学结构化输出'),input=node('textarea');input.value='{"material":"板材","qty":2,"rush":false}';label.append(input);controls.append(label);const preview=node('pre');panel.append(preview);
      run('核对教学输出结构',()=>{const value=model.validateStructuredQuote(input.value);preview.textContent=JSON.stringify(value,null,2);ok('三个字段结构通过 · 无模型调用或业务提交');});ok('尚未校验教学数据');break;
    }
    case 'motion': {
      const preference=select('本实验动态偏好',[['system','跟随系统'],['reduce','减少动态'],['full','完整动态']]),media=matchMedia('(prefers-reduced-motion: reduce)'),track=node('div','motion-track'),dot=node('span','motion-dot','●');track.append(dot);panel.append(track);
      const refresh=()=>{const reduced=model.motionPreference(media.matches,preference.value);dot.classList.toggle('motion-dot-running',!reduced);ok(`${reduced?'减少动态：圆点静止':'完整动态：圆点缓慢移动'} · 仅影响本实验`);};preference.addEventListener('change',refresh);media.addEventListener('change',refresh);dispose=()=>media.removeEventListener('change',refresh);refresh();break;
    }
    case 'cancellation': {
      let controller=null,disposed=false;
      const start=add('启动可取消教学任务',()=>{controller=new AbortController();const active=controller;start.disabled=true;cancel.disabled=false;ok('教学任务等待中（600 ms，无网络）');model.waitForDemo(600,{signal:active.signal}).then(value=>{if(!disposed)ok(`${value} · 教学任务完成`);},error=>{if(!disposed){output.classList.toggle('error',error.name!=='AbortError');output.textContent=error.name==='AbortError'?'教学任务已取消，可重新启动':error.message;}}).finally(()=>{if(!disposed&&controller===active){controller=null;start.disabled=false;cancel.disabled=true;}});});
      const cancel=add('取消教学任务',()=>controller?.abort());cancel.disabled=true;dispose=()=>{disposed=true;controller?.abort();};ok('尚未启动，不执行真实请求');break;
    }
    default:throw new Error('未知教学实验');
  }
  root.append(controls,panel,output,node('p','subtle',lesson.limits));
  return {element:root,dispose};
}
