import {revealTeachingControls} from './teaching-ui-browser-helpers.mjs';
import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {createRequire} from 'node:module';
import {pathToFileURL,fileURLToPath} from 'node:url';
import http from 'node:http';
import {remainingUiDefinitions as definitions,runRemainingUiExample as run} from '../knowledge-catalog/remaining-ui.mjs';
import {qrVersion1,barcode39,parseTeachingPdf,parseTeachingOffice} from '../knowledge-catalog/remaining-formats.mjs';
import {teachingPdf,teachingDocxHex,teachingXlsxHex,bytesFromHex} from '../knowledge-catalog/remaining-fixtures.mjs';
import {parseCsv,stringifyCsv,mercator,decodePointMvt,validateProcess,placeOverlay} from '../knowledge-catalog/remaining-ui-models.mjs';

export async function testRemainingUiModels(){
 const catalog=JSON.parse(await readFile(new URL('../knowledge-catalog/catalog.json',import.meta.url),'utf8'));
 assert.equal(definitions.length,236);assert.equal(new Set(definitions.map(d=>d.knowledgeId)).size,236);
 for(const d of definitions){assert.equal(catalog.entries.find(e=>e.id===d.knowledgeId)?.name,d.title);const before=JSON.stringify([d.input,d.changed,d.invalidInput]),out=run(d);assert.equal(JSON.stringify(out),d.expected);assert.notDeepEqual(out,run(d,d.changed));assert.throws(()=>run(d,d.invalidInput),d.knowledgeId+'专属负例');assert.throws(()=>run(d,{}));assert.equal(JSON.stringify([d.input,d.changed,d.invalidInput]),before);const output=execFileSync(process.execPath,['--input-type=module','-e',d.code],{encoding:'utf8',cwd:fileURLToPath(new URL('../knowledge-catalog/',import.meta.url))}).trim();assert.equal(output,d.expected,d.knowledgeId+'实际代码片段');}
 const ref=JSON.parse(await readFile(new URL('../knowledge-catalog/fixtures/format-reference.json',import.meta.url),'utf8'));
 assert.equal(await readFile(new URL('../knowledge-catalog/fixtures/teaching.pdf',import.meta.url),'utf8'),teachingPdf,'PDF常量与实际交付文件相同');
 assert.deepEqual(bytesFromHex(teachingDocxHex),new Uint8Array(await readFile(new URL('../knowledge-catalog/fixtures/teaching.docx',import.meta.url))),'DOCX常量与实际交付文件相同');
 assert.deepEqual(bytesFromHex(teachingXlsxHex),new Uint8Array(await readFile(new URL('../knowledge-catalog/fixtures/teaching.xlsx',import.meta.url))),'XLSX常量与实际交付文件相同');
 for(const[key,matrix]of Object.entries(ref.qr)){const[level,text]=key.split(':');assert.deepEqual(qrVersion1(text,level).matrix,matrix,'独立reportlab QR参考 '+key);}
 for(const[key,value]of Object.entries(ref.barcodes||ref.barcode||{})){const [flag,text]=key.split(':');const result=barcode39(text,flag==='1');if(typeof value==='string')assert.equal(result.modules,value);else if(value.modules)assert.equal(result.modules,value.modules);}
 assert.deepEqual(parseTeachingPdf(teachingPdf).pages.map(p=>p.text),ref.pdfTexts);
 assert.deepEqual(parseTeachingOffice(bytesFromHex(teachingDocxHex),'docx').paragraphs,ref.docxParagraphs);
 assert.deepEqual(parseTeachingOffice(bytesFromHex(teachingXlsxHex),'xlsx').sheets.map(s=>s.rows),ref.xlsxRows);
 assert.throws(()=>parseTeachingPdf(teachingPdf.replace('/Type /Page','/Filter /FlateDecode /Type /Page')));
 const corrupt=bytesFromHex(teachingDocxHex);corrupt[50]^=1;assert.throws(()=>parseTeachingOffice(corrupt,'docx'));
 assert.deepEqual(parseCsv('id,note\nA,"a,b"\nB,"a""b"'),[['id','note'],['A','a,b'],['B','a"b']]);
 assert.deepEqual(parseCsv(stringifyCsv([['a,b','x"y'],['2','3']])),[['a,b','x"y'],['2','3']]);assert.throws(()=>parseCsv('"unterminated'));
 assert.deepEqual(parseCsv('a,b\r\n1,2\r\n'),[['a','b'],['1','2']]);
 assert.deepEqual(parseCsv('id,note\nA,"a\r\nb"'),[['id','note'],['A','a\r\nb']]);assert.throws(()=>parseCsv('"a"b,c'));
 assert.deepEqual(mercator(0,0,1),[256,256]);assert.deepEqual(mercator(0,0,2),[512,512]);assert.throws(()=>mercator(0,90));
 const get=id=>definitions.find(d=>d.knowledgeId===id),go=(id,patch={})=>run(get(id),{...get(id).input,...patch});
 assert.deepEqual(go('K-D10-015').tile,{name:'demo',extent:4096,point:[10,20]});assert.throws(()=>decodePointMvt([26,1,255]));
 assert.equal(go('K-D05-014').checksum,'$');assert.deepEqual(go('K-D05-048').rows.map(r=>r.qty),[2,3]);assert.deepEqual(go('K-D05-048',{page:2}).rows.map(r=>r.qty),[5,8]);
 assert.deepEqual(go('K-D06-037').delays,[2,4,8,10]);assert.equal(go('K-D06-031',{now:9}).expired,false);assert.equal(go('K-D06-031',{now:10}).expired,true);
 assert.deepEqual(go('K-D06-036').retry,['B']);assert.deepEqual(go('K-D06-035').trace.map(e=>e.state),['running','failed']);
 assert.equal(go('K-D09-030').total,16);assert.equal(go('K-D08-047').parsed.total,5);assert.deepEqual(go('K-D08-049').parsed,[{id:'B'},{id:'C'},{id:'D'}]);
 const importCase=go('K-D08-058',{text:'id,qty\nA,2\nA,3\nB,bad'});assert.equal(importCase.parsed.errors.length,2);assert.deepEqual(importCase.parsed.mapped,[{id:'A',qty:2}]);
 assert.equal(go('K-D08-057',{column:'id'}).parsed.mapped.length,0);assert.equal(go('K-D08-059').parsed.errors.length,2);
 assert.deepEqual(go('K-D08-030').hits,[2]);assert.deepEqual(go('K-D11-051').errors,[]);assert.equal(validateProcess(go('K-D11-051').nodes,[{from:'start',to:'task'}]).length>0,true);
 const bounds=placeOverlay([260,190,20,10],[100,60],[280,200]);assert.ok(bounds.x>=0&&bounds.y>=0&&bounds.x+100<=280&&bounds.y+60<=200);
 assert.equal(go('K-D15-033',{zone:'Asia/Shanghai'}).date,'11/05/2026, 00');assert.equal(go('K-D15-036',{locale:'en-US',value:1}).plural,'one');assert.equal(go('K-D15-041',{locale:'ar-EG'}).direction,'rtl');
 assert.equal(go('K-D14-066').result,5);assert.equal(go('K-D14-066',{op:'multiply'}).result,6);
 console.log(JSON.stringify({status:'PASS',module:'remaining-ui',topics:236,negativeCases:236,snippets:236,independentQrMatrices:Object.keys(ref.qr).length,originalInputMutation:false}));
}

export async function exerciseRemainingUiDemo(page,def,level='L2'){
 const root=page.locator(`[data-demo="${def.kind}"]`).first();await root.waitFor({state:'visible'});await revealTeachingControls(root);await root.locator('[data-reset]').click();assert.equal(await root.getAttribute('data-valid'),'true');assert.deepEqual(JSON.parse(await root.locator('[data-result]').textContent()),run(def));
 if(def.knowledgeId==='K-D08-059')assert.equal(await root.locator('[data-visual] table').count(),2,'错误报告须实际展示原始行及错误原因');
 await root.locator('[data-input]').fill(JSON.stringify(def.changed));await root.locator('[data-run]').click();assert.equal(await root.getAttribute('data-valid'),'true',def.knowledgeId+'合法输入');assert.deepEqual(JSON.parse(await root.locator('[data-result]').textContent()),run(def,def.changed));
 const stage=root.locator('[data-visual]'),id=def.knowledgeId,domain=id.slice(2,5),n=Number(id.slice(-3));assert.ok(await stage.evaluate(e=>e.childElementCount)>0,id+'真实演示');
 const refreshInstance=async()=>{await page.reload({waitUntil:'domcontentloaded'});if(await page.evaluate(()=>typeof window.show==='function'))await page.evaluate(id=>window.show(id),def.knowledgeId);await root.waitFor({state:'visible'});await revealTeachingControls(root);};
 const nativeAction=async()=>{const action=stage.locator('[data-action]').first();if(await action.count()&&!await action.isDisabled())await action.click();};
 if(domain==='D05'){
  if(n===13){assert.equal(await stage.locator('svg rect').count()>100,true);await stage.getByRole('textbox',{name:'编码文本',exact:true}).fill('V8');await stage.getByRole('textbox',{name:'编码文本',exact:true}).press('Tab');assert.equal(await root.getAttribute('data-valid'),'true');}
  else if(n===14){assert.ok(await stage.locator('svg rect').count()>20);}
  else if(n===21){assert.equal(await stage.locator('dt').count(),1);await nativeAction();assert.equal(await stage.locator('dt').count(),2);}
  else if(n===53){await stage.locator('[data-save]').click();if(level==='L3')await refreshInstance();else await root.locator('[data-reset]').click();await stage.locator('[data-restore]').click();assert.deepEqual(JSON.parse(await root.locator('[data-result]').textContent()).state.widths,def.changed.widths);await stage.locator('[data-clear]').click();}
  else if(n===55){assert.equal(await stage.locator('[data-print-page]').count(),2);await page.emulateMedia({media:'print'});assert.equal(await root.locator('[data-run]').isVisible(),false);await page.emulateMedia({media:'screen'});}
  else {assert.ok(await stage.locator('tbody tr').count()>0);const sort=stage.getByRole('combobox',{name:'排序方向',exact:true});await sort.selectOption(def.changed.direction==='asc'?'desc':'asc');assert.equal(await root.getAttribute('data-valid'),'true');}
 }else if(domain==='D06'){
  await nativeAction();if(n===38){const dialog=stage.locator('dialog');if(await dialog.isVisible())await dialog.getByRole('button',{name:'确认离开',exact:true}).click();}assert.ok(await stage.locator('[role=status]').count()>=1);
 }else if(domain==='D07'){
  await stage.locator('[data-open]').click();const local=stage.locator('[data-overlay-panel]'),dialog=stage.locator('[data-inner-dialog]').first();
  if(await local.count()){const bounds=await local.boundingBox(),parent=await stage.locator('[data-overlay-stage]').boundingBox();assert.ok(bounds.x>=parent.x-1&&bounds.x+bounds.width<=parent.x+parent.width+1,'浮层适应实际窄屏容器');
   if(n===21){await local.getByRole('button',{name:'展开子菜单',exact:true}).click();await local.getByRole('button',{name:'子项目',exact:true}).click();}
   else if(n===22){await local.getByRole('button',{name:'下一步',exact:true}).click();assert.match(await local.textContent(),/步骤2/);await local.locator('[data-dismiss]').click();}
   else if(n===19||n===20){await local.scrollIntoViewIfNeeded();const box=await local.boundingBox();await page.mouse.move(box.x+10,box.y+10);await page.mouse.down();await page.mouse.move(box.x+25,box.y+25);await page.mouse.up();assert.equal(await local.getAttribute('data-dragged'),'true');await local.locator('[data-dismiss]').click();}
   else {if(n===24)assert.equal(await stage.locator('[data-portal] [data-overlay-panel]').count(),1);await local.locator('[data-confirm]').click();}
  }else{await dialog.waitFor({state:'visible'});assert.equal(await dialog.evaluate(e=>e.contains(document.activeElement)),true);
   if([5,8,28].includes(n)){await dialog.getByRole('button',{name:'打开第二层',exact:true}).click();const nested=dialog.locator('[data-nested-dialog]');await nested.getByRole('button',{name:'返回第一层',exact:true}).click();}
   if(n===23){await dialog.locator('[data-dismiss]').focus();await page.keyboard.press('Tab');assert.equal(await dialog.evaluate(e=>e.contains(document.activeElement)),true);}
   await dialog.locator('[data-confirm]').click();assert.equal(await dialog.count(),0);
  }
  assert.equal(await stage.locator('[data-open]').evaluate(e=>e===document.activeElement),true);
 }else if(domain==='D08'&&n<=16){
  if(n===2||n===3){if(n===2)await stage.getByRole('textbox').count();const payload={name:'synthetic.txt',mimeType:'text/plain',buffer:Buffer.from('fixture 123')};if(n===3)await stage.locator('[data-dropzone]').evaluate((zone)=>{const transfer=new DataTransfer();transfer.items.add(new File(['fixture 123'],'synthetic.txt',{type:'text/plain'}));zone.dispatchEvent(new DragEvent('drop',{dataTransfer:transfer,bubbles:true,cancelable:true}));});else await stage.locator('input[type=file]').setInputFiles(payload);await page.waitForFunction(kind=>document.querySelector(`[data-demo="${kind}"] [data-file-preview]`)?.textContent==='fixture 123',def.kind);}
  else if(n===14){const downloaded=page.waitForEvent('download');await stage.locator('[data-download]').click();assert.equal((await downloaded).suggestedFilename(),'second.txt');}
  else if(n===16)assert.equal(await stage.locator('[data-action]').isDisabled(),false);
  else {await nativeAction();}
 }else if(domain==='D08'&&n<=29){
  if(n===27){await stage.locator('.lazy-scroll').evaluate(e=>e.scrollTop=e.scrollHeight);}
  if([26,27,29].includes(n)){await page.waitForFunction(kind=>{const image=document.querySelector(`[data-demo="${kind}"] [data-decoded-image]`);return image?.naturalWidth===240;},def.kind);}
  if(n===21){await stage.locator('[data-thumbnail="2"]').click();assert.match(await root.locator('[data-native-status]').textContent(),/图片3/);}
  else if(n===22){await stage.getByRole('slider',{name:'对比分割',exact:true}).fill('60');await stage.getByRole('slider',{name:'对比分割',exact:true}).dispatchEvent('change');assert.equal(JSON.parse(await root.locator('[data-result]').textContent()).split,60);}
  else if(n===24){const image=stage.locator('svg').first();await image.hover({position:{x:40,y:40}});assert.equal(await image.locator('[data-moved]').count(),1);}
  else await nativeAction();
 }else if((domain==='D08'&&n<=32)||id==='K-D14-019'){
  assert.ok(await stage.locator('svg text,p').count()>0);await nativeAction();if(id==='K-D14-019')assert.equal(await stage.locator('svg').count(),1);else assert.equal(JSON.parse(await root.locator('[data-result]').textContent()).page,1);
 }else if(domain==='D08'&&n<=39){
  const media=stage.locator('[data-media]');await page.waitForFunction(kind=>{const e=document.querySelector(`[data-demo="${kind}"] [data-media]`);return e&&(e.readyState>=1||e.dataset.loadFailed==='true');},def.kind);assert.equal(await media.getAttribute('data-load-failed'),null,'真实媒体必须解码成功');
  assert.ok(await media.evaluate(e=>Number.isFinite(e.duration)&&e.duration>1));await stage.locator('[data-play]').click();await page.waitForFunction(kind=>{const e=document.querySelector(`[data-demo="${kind}"] [data-media]`);return e&&!e.paused&&e.currentTime>0;},def.kind);await stage.locator('[data-pause]').click();assert.equal(await media.evaluate(e=>e.paused),true);
  await stage.getByRole('spinbutton',{name:'跳转秒数',exact:true}).fill('0.8');await stage.getByRole('spinbutton',{name:'跳转秒数',exact:true}).press('Tab');await page.waitForFunction(kind=>document.querySelector(`[data-demo="${kind}"] [data-cue]`)?.textContent==='Frame two',def.kind);if(n===38){await stage.locator('[data-action]').click();assert.equal(await stage.locator('canvas').getAttribute('data-captured'),'true');}
 }else if(domain==='D08'){
  if(n===47){await stage.getByRole('spinbutton',{name:'单元格A1',exact:true}).fill('9');await stage.getByRole('spinbutton',{name:'单元格A1',exact:true}).press('Tab');assert.equal(await stage.locator('[data-formula-result]').textContent(),'16');}
  else if(n===56){assert.equal(await stage.locator('table').count(),2);await nativeAction();}
  else {const editor=stage.locator('[data-editor]');if([40,42,50].includes(n)){await editor.fill('合成编辑内容');await stage.getByRole('button',{name:'加粗',exact:true}).click();assert.equal(await editor.locator('strong').textContent(),'合成编辑内容');await editor.evaluate(element=>{const data=new DataTransfer();data.setData('text/plain','<img src=x onerror=alert(1)>');data.setData('text/html','<img src=x onerror=alert(1)>');element.dispatchEvent(new ClipboardEvent('paste',{clipboardData:data,bubbles:true,cancelable:true}));});assert.equal(await editor.locator('img,script').count(),0);assert.match(await editor.textContent(),/<img src=x onerror=alert\(1\)>/);}
   else if(n===54){await editor.fill('<b>synthetic</b>');await stage.locator('[data-copy]').click();await editor.fill('');await stage.locator('[data-paste]').click();assert.equal(await editor.inputValue(),'synthetic');}
   else if(n===51){await nativeAction();await editor.fill('自动保存合成内容');await page.waitForFunction(()=>document.querySelector('[data-native-status]')?.textContent==='本例自动保存完成');assert.match(await page.evaluate(key=>localStorage.getItem(key),'adFactoryLearning.v8.teaching.sandbox.'+id),/自动保存合成内容/);if(level==='L3'){await refreshInstance();await stage.locator('[data-restore]').click();assert.equal(await stage.locator('[data-editor]').inputValue(),'自动保存合成内容');}await stage.locator('[data-clear]').click();}
   else if(n===52){await stage.getByRole('combobox',{name:'历史版本',exact:true}).selectOption('修订');assert.equal(await editor.inputValue(),'修订');}
   else if(n===57){await stage.getByRole('combobox',{name:'数量来源列',exact:true}).selectOption('qty');assert.deepEqual(JSON.parse(await root.locator('[data-result]').textContent()).parsed.mapped,[{id:'A',qty:5},{id:'B',qty:7}]);}
   else if(n===58){await editor.fill('id,qty\nA,2\nA,3\nB,bad');await stage.locator('[data-editor-apply]').click();const parsed=JSON.parse(await root.locator('[data-result]').textContent()).parsed;assert.equal(parsed.errors.length,2);assert.deepEqual(parsed.mapped,[{id:'A',qty:2}]);assert.equal(await stage.locator('table').count(),2);}
   else if([60,61,62].includes(n)){const download=page.waitForEvent('download');await stage.locator('[data-download]').click();assert.ok((await download).suggestedFilename().includes('v8-fixture'));}
   else {await stage.locator('[data-editor-apply]').click();assert.equal(await root.getAttribute('data-valid'),'true');}
  }
 }else if(domain==='D09'){
  if(n===51){assert.equal(await stage.locator('[data-chart-layer]').count(),0);await nativeAction();}
  else if(n===48){const download=page.waitForEvent('download');await stage.locator('[data-download]').click();assert.equal((await download).suggestedFilename(),'v8-chart.svg');}
  else if(n===52){await stage.getByRole('combobox',{name:'图表编码',exact:true}).selectOption('bar');assert.ok(await stage.locator('[data-chart-item]').count()>0);}
  else {const item=stage.locator('[data-chart-item]').first();await item.focus();await page.keyboard.press('Enter');assert.match(await root.locator('[data-native-status]').textContent(),/选中/);if(n===46){await nativeAction();assert.match(await stage.textContent(),/明细/);}}
  assert.ok(await stage.locator('table').count()>0);
 }else if(domain==='D10'){
  if(n===7){await stage.locator('[data-geolocation]').click();await page.waitForFunction(()=>document.querySelector('[data-native-status]')?.textContent==='定位成功 1,2');}
  else if(n===10){await stage.locator('[data-fullscreen]').click();await page.waitForFunction(()=>Boolean(document.fullscreenElement)||document.querySelector('[data-native-status]')?.textContent.startsWith('原生全屏不可用'));assert.equal(await page.evaluate(()=>Boolean(document.fullscreenElement)),true,'原生全屏必须实际进入');await page.evaluate(()=>document.exitFullscreen());}
  else if(n===31){await stage.locator('[data-cache-save]').click();await page.waitForFunction(()=>document.querySelector('[data-native-status]')?.textContent==='本例合成瓦片已缓存');await stage.locator('[data-cache-read]').click();await page.waitForFunction(()=>document.querySelector('[data-native-status]')?.textContent.includes('离线缓存命中'));await page.waitForFunction(()=>document.querySelector('[data-cached-tile]')?.naturalWidth===64);await stage.locator('[data-cache-clear]').click();}
  else if(n===32){const download=page.waitForEvent('download');await stage.locator('[data-download]').click();assert.equal((await download).suggestedFilename(),'v8-map.svg');}
  else if(n===12){assert.equal(await stage.locator('[data-map-point]').count(),0);await nativeAction();assert.equal(await stage.locator('[data-map-point]').count(),3);}
  else {await stage.locator('[data-map-point]').first().focus();await page.keyboard.press('Enter');assert.match(await root.locator('[data-native-status]').textContent(),/经度/);if(n===15){assert.ok(Math.abs(Number(await stage.locator('[data-mvt-point]').getAttribute('cx'))-10/4096*280)<1e-8);}}
 }else if(domain==='D11'){
  if(n===51){await stage.locator('[data-xml-import]').click();assert.match(await root.locator('[data-native-status]').textContent(),/真实XML往返：3节点 2边/);}
  else if(n===18){const canvas=stage.locator('svg').first();await canvas.scrollIntoViewIfNeeded();const box=await canvas.boundingBox();await page.mouse.move(box.x+20,box.y+20);await page.mouse.down();await page.mouse.move(box.x+50,box.y+40);await page.mouse.move(box.x+70,box.y+30);await page.mouse.up();assert.ok((await canvas.locator('[data-freehand]').getAttribute('points')).split(' ').length>=3);}
  else if(n===50){await nativeAction();assert.ok(JSON.parse(await root.locator('[data-result]').textContent()).errors.length>0);}
  else {await stage.locator('[data-node]').first().focus();await page.keyboard.press('Enter');assert.match(await root.locator('[data-native-status]').textContent(),/键盘选中/);await nativeAction();}
 }else if(id==='K-D14-066'){
  await page.waitForFunction(()=>document.querySelector('[data-sandbox]')?.dataset.ready==='true');await stage.locator('[data-sandbox-run]').click();await page.waitForFunction(()=>document.querySelector('[data-sandbox]')?.dataset.verified==='true');assert.match(await root.locator('[data-native-status]').textContent(),/实际结果 6；父DOM DENIED；存储 DENIED/);
 }else if(domain==='D15'&&n<=25){
  if(n===1){await nativeAction();assert.equal(await stage.locator('[data-a11y-input]').evaluate(e=>e===document.activeElement),true);await stage.locator('[data-focus-restore]').click();assert.equal(await stage.locator('[data-action]').evaluate(e=>e===document.activeElement),true);}
  else if(n===2){await stage.locator('[data-roving="0"]').focus();await page.keyboard.press('ArrowRight');assert.equal(await stage.locator('[data-roving="1"]').evaluate(e=>e===document.activeElement),true);}
  else if(n===8){await stage.locator('[data-skip-link]').click();assert.equal(await stage.locator('section[tabindex="-1"]').evaluate(e=>e===document.activeElement),true);}
  else if(n===20){await nativeAction();await stage.locator('[data-a11y-dialog]').waitFor({state:'visible'});await page.keyboard.press('Escape');assert.equal(await stage.locator('[data-a11y-dialog]').isVisible(),false);}
  else if(n===23){const size=await stage.locator('[data-action]').boundingBox();assert.ok(size.width>=44&&size.height>=44);}
  else {await nativeAction();assert.ok(await stage.locator('[data-a11y-live]').count()>0);}
  assert.equal(await stage.locator('[data-a11y-input]').getAttribute('aria-describedby')!==null,true);
 }else if(domain==='D15'&&n<=48){
  await stage.getByRole('combobox',{name:'教学地区',exact:true}).selectOption('ar-EG');assert.equal(await stage.locator('[data-locale-region]').getAttribute('dir'),'rtl');assert.equal(await stage.locator('[data-locale-region]').getAttribute('lang'),'ar-EG');
 }else if(domain==='D15'){
  const components=stage.locator('[data-token-component]'),styles=await components.evaluateAll(es=>es.map(e=>{const s=getComputedStyle(e);return [s.backgroundColor,s.borderRadius,s.fontSize];}));assert.deepEqual(styles[0],styles[1]);
  if(n===59){await stage.locator('[data-save]').click();if(level==='L3')await refreshInstance();else await root.locator('[data-reset]').click();await stage.locator('[data-restore]').click();assert.equal(JSON.parse(await root.locator('[data-result]').textContent()).theme,'dark');await stage.locator('[data-clear]').click();}
  else if(n===58){await page.emulateMedia({colorScheme:'dark'});await page.waitForFunction(()=>document.querySelector('[data-token-region]')?.dataset.systemTheme==='dark');await page.emulateMedia({colorScheme:'light'});}
  else if(n===60){const download=page.waitForEvent('download');await stage.locator('[data-download]').click();assert.equal((await download).suggestedFilename(),'v8-tokens.json');}
  else if(n===62){await stage.locator('[data-consistency]').click();assert.match(await root.locator('[data-native-status]').textContent(),/计算样式一致/);}
  else await nativeAction();
 }
 if(level!=='L1'){await root.locator('[data-invalid]').click();assert.equal(await root.getAttribute('data-valid'),'false');assert.match(await root.locator('[data-error]').textContent(),/输入错误/);assert.equal(await stage.evaluate(e=>e.childElementCount),0);await root.locator('[data-reset]').click();assert.equal(await root.getAttribute('data-valid'),'true');}
 return {id,level,status:'PASS'};
}

export async function testRemainingUiBrowser(){
 const engine=process.env.V8_REMAINING_ENGINE||'chromium',playwright=createRequire(import.meta.url)(process.env.V8_PLAYWRIGHT_MODULE||'playwright');assert.ok(['chromium','webkit'].includes(engine));const evidence=process.env.V8_EVIDENCE_DIR;if(evidence)await mkdir(evidence,{recursive:true});
 const html='<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/remaining.css"><main></main><script type="module">import{remainingUiDefinitions as defs,renderRemainingUiDemo as render}from"/remaining-ui.mjs";window.show=id=>{window.dispose?.();window.dispose=render(document.querySelector("main"),defs.find(d=>d.knowledgeId===id));};window.ready=true;</script>';
 const allowed=new Set(['remaining-ui.mjs','remaining-ui-models.mjs','remaining-ui-visuals.mjs','remaining-ui-source.mjs','remaining-formats.mjs','remaining-fixtures.mjs','remaining.css','fixtures/teaching.wav','fixtures/teaching.mp4','fixtures/teaching.vtt']);
 const server=http.createServer(async(req,res)=>{try{const path=decodeURIComponent(req.url.slice(1));if(allowed.has(path)){res.setHeader('Content-Type',path.endsWith('.mjs')?'text/javascript':path.endsWith('.css')?'text/css':path.endsWith('.wav')?'audio/wav':path.endsWith('.mp4')?'video/mp4':'text/vtt');res.end(await readFile(new URL('../knowledge-catalog/'+path,import.meta.url)));}else if(req.url==='/'){res.setHeader('Content-Type','text/html');res.end(html);}else{res.writeHead(404);res.end();}}catch(e){res.writeHead(500);res.end(e.message);}});await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 let browser;const results=[];try{browser=await playwright[engine].launch({headless:true});const ids=process.env.V8_REMAINING_IDS?.split(','),defs=ids?definitions.filter(d=>ids.includes(d.knowledgeId)):definitions;
  for(const width of [1440,390]){if(process.env.V8_REMAINING_WIDTH&&Number(process.env.V8_REMAINING_WIDTH)!==width)continue;const context=await browser.newContext({viewport:{width,height:900},permissions:['geolocation'],geolocation:{latitude:1,longitude:2}});await context.addInitScript(()=>{if(window!==window.top)return;localStorage.setItem('adFactoryLearning.v8.production','synthetic-original-sentinel');localStorage.setItem('adFactoryLearning.v8.order-lab','synthetic-lab-sentinel');});const page=await context.newPage(),errors=[];page.setDefaultTimeout(12000);page.on('pageerror',e=>errors.push(e.message));await page.goto(`http://127.0.0.1:${server.address().port}/`);await page.waitForFunction(()=>window.ready);
   for(const def of defs)for(const level of ['L1','L2','L3']){await page.evaluate(id=>window.show(id),def.knowledgeId);try{await exerciseRemainingUiDemo(page,def,level);assert.deepEqual(errors,[]);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,def.knowledgeId+'窄屏溢出');results.push({engine,width,id:def.knowledgeId,level,status:'PASS'});}catch(e){console.error('FAILED',engine,width,def.knowledgeId,level);if(evidence){await writeFile(evidence+'/ui-cases-'+engine+'.json',JSON.stringify(results,null,2));await page.screenshot({path:evidence+'/ui-failure-'+engine+'-'+def.knowledgeId+'.png',fullPage:true});}throw e;}if(results.length%75===0)console.log(engine+' UI units='+results.length);}
   await page.evaluate(()=>window.dispose());assert.equal(await page.locator('main').evaluate(e=>e.childElementCount),0);assert.deepEqual(await page.evaluate(()=>({...localStorage})),{'adFactoryLearning.v8.production':'synthetic-original-sentinel','adFactoryLearning.v8.order-lab':'synthetic-lab-sentinel'});await context.close();
  }
  if(evidence)await writeFile(evidence+'/ui-cases-'+engine+'.json',JSON.stringify(results,null,2));console.log(JSON.stringify({status:'PASS',module:'remaining-ui',engine,unitScenarios:results.length,disposer:true,protectedStorage:true,pageErrors:0}));
 }finally{await browser?.close();await new Promise(resolve=>server.close(resolve));}
}
if(process.argv[1]&&pathToFileURL(process.argv[1]).href===import.meta.url){if(process.argv.includes('--browser'))await testRemainingUiBrowser();else await testRemainingUiModels();}
