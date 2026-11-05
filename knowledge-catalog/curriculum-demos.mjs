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
    default:throw new Error('未知教学实验');
  }
  root.append(controls,panel,output,node('p','subtle',lesson.limits));
  return {element:root,dispose};
}
