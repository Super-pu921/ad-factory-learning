(function createCustomerOrderLab(){
"use strict";
const qa=location.pathname.includes("/v8-p24-qa/");
const DB="adFactoryLearning.v8.customer-order-lab"+(qa?".qa":"");
const PROGRESS=DB+".progress";
const titles=["建立虚构客户","拒绝不存在的客户引用","拒绝非法报价数量","建立有效教学报价","查询客户与报价关系","模拟事务失败与回滚","原子事务生成订单","重复转单与刷新恢复"];
const hints=["输入虚构客户名称（2–30 字），建立 C-001。","尝试为不存在的客户 C-404 建立报价，数据库不能变化。","尝试用数量 -1 创建报价，数据库不能变化。","填写产品名称和正整数数量，将 Q-001 关联 C-001。","从真实 IndexedDB 查询 C-001 关联的 Q-001。","同一事务先改变报价状态，再重复写入 O-001 触发 ConstraintError；全部回滚。","将 Q-001 转成 O-001，报价改为 converted；两项操作一起提交。","再次转换相同报价，不得重复生成订单；随后真实刷新页面重新核对。"];
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function progress(){try{const x=JSON.parse(localStorage.getItem(PROGRESS)||"null");return x&&Number.isInteger(x.step)&&x.step>=0&&x.step<=8?{step:x.step,pendingReload:x.pendingReload===true,msg:String(x.msg||"").slice(0,250)}:{step:0,pendingReload:false,msg:""};}catch{return {step:0,pendingReload:false,msg:""};}}
let session=progress(),busy=false;
const save=()=>{try{localStorage.setItem(PROGRESS,JSON.stringify(session));}catch{}};
function openDB(){
 return new Promise((resolve,reject)=>{
  if(!window.indexedDB){reject(new Error("浏览器不支持 IndexedDB"));return;}
  const r=indexedDB.open(DB,1);
  r.onupgradeneeded=()=>{
   const db=r.result;
   db.createObjectStore("customers",{keyPath:"customerId"});
   const quotes=db.createObjectStore("quotes",{keyPath:"quoteId"});
   quotes.createIndex("customerId","customerId",{unique:false});
   const orders=db.createObjectStore("orders",{keyPath:"orderId"});
   orders.createIndex("quoteId","quoteId",{unique:true});
  };
  r.onsuccess=()=>{r.result.onversionchange=()=>r.result.close();resolve(r.result);};
  r.onerror=()=>reject(r.error||new Error("教学数据库打开失败"));
  r.onblocked=()=>reject(new Error("数据库被其他标签页占用，请关闭其他练习窗口"));
 });
}
async function snapshot(){
 const db=await openDB();
 return new Promise((resolve,reject)=>{
  const tx=db.transaction(["customers","quotes","orders"],"readonly"),data={customers:[],quotes:[],orders:[]};
  for(const name of Object.keys(data)){tx.objectStore(name).getAll().onsuccess=e=>{data[name]=e.target.result.sort((a,b)=>JSON.stringify(a).localeCompare(JSON.stringify(b)));};}
  tx.oncomplete=()=>{db.close();resolve(data);};
  tx.onabort=()=>{db.close();reject(tx.error||new Error("读取数据失败"));};
 });
}
async function write(stores,callback){
 const db=await openDB();
 return new Promise((resolve,reject)=>{
  let result={kind:"unknown"};
  const tx=db.transaction(stores,"readwrite");
  tx.oncomplete=()=>{db.close();resolve(result);};
  tx.onabort=()=>{const error=tx.error?.name||"AbortError";db.close();resolve({kind:"aborted",error});};
  try{callback(tx,value=>{result=value;});}catch(e){try{tx.abort();}catch{}db.close();reject(e);}
 });
}
function createCustomer(name){
 const clean=String(name??"").trim();
 if(clean.length<2||clean.length>30)return Promise.resolve({kind:"invalid-name"});
 return write(["customers"],(tx,set)=>{tx.objectStore("customers").add({customerId:"C-001",name:clean}).onsuccess=()=>set({kind:"committed"});});
}
function createQuote(customerId,productName,quantity){
 const product=String(productName??"").trim(),q=Number(quantity);
 if(!product||product.length>50||!Number.isInteger(q)||q<=0||q>10000)return Promise.resolve({kind:"invalid-quote"});
 return write(["customers","quotes"],(tx,set)=>{
  tx.objectStore("customers").get(customerId).onsuccess=e=>{
   if(!e.target.result){set({kind:"missing-customer"});return;}
   tx.objectStore("quotes").add({quoteId:"Q-001",customerId,productName:product,quantity:q,status:"ready"}).onsuccess=()=>set({kind:"committed"});
  };
 });
}
async function queryCustomer(customerId){
 const db=await openDB();
 return new Promise((resolve,reject)=>{
  let customer=null,quotes=[];
  const tx=db.transaction(["customers","quotes"],"readonly");
  tx.objectStore("customers").get(customerId).onsuccess=e=>customer=e.target.result||null;
  tx.objectStore("quotes").index("customerId").getAll(customerId).onsuccess=e=>quotes=e.target.result;
  tx.oncomplete=()=>{db.close();resolve({customer,quotes});};
  tx.onabort=()=>{db.close();reject(tx.error||new Error("关联查询失败"));};
 });
}
function convertQuote(injectFailure=false){
 return write(["quotes","orders"],(tx,set)=>{
  const quotes=tx.objectStore("quotes"),orders=tx.objectStore("orders");
  quotes.get("Q-001").onsuccess=e=>{
   const q=e.target.result;
   if(!q){set({kind:"missing-quote"});return;}
   orders.index("quoteId").get("Q-001").onsuccess=ev=>{
    if(ev.target.result||q.status==="converted"){set({kind:"duplicate"});return;}
    if(q.status!=="ready"){set({kind:"invalid-state"});return;}
    quotes.put({...q,status:"converted"}).onsuccess=()=>{
     orders.add({orderId:"O-001",quoteId:"Q-001",status:"created"}).onsuccess=()=>{
      if(injectFailure){
       // Deliberate duplicate primary key: the IndexedDB transaction must abort.
       orders.add({orderId:"O-001",quoteId:"Q-001",status:"created"});
      }else set({kind:"committed"});
     };
    };
   };
  };
 });
}
function validForStep(step,d){
 const c=d.customers,q=d.quotes,o=d.orders;
 if(c.length!==(step===0?0:1)||q.length!==(step<4?0:1)||o.length!==(step<7?0:1))return false;
 if(step>0&&!(c[0].customerId==="C-001"&&c[0].name.trim().length>=2))return false;
 if(step>=4&&!(q[0].quoteId==="Q-001"&&q[0].customerId==="C-001"&&q[0].productName.trim()&&Number.isInteger(q[0].quantity)&&q[0].quantity>0&&q[0].status===(step<7?"ready":"converted")))return false;
 if(step>=7&&!(o[0].orderId==="O-001"&&o[0].quoteId==="Q-001"&&o[0].status==="created"))return false;
 return true;
}
const unchanged=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
function grade(step,result,before,after,lookup){
 if(!validForStep(step,before)||!validForStep(step+1,after))return false;
 if(step===0)return result.kind==="committed";
 if(step===1)return result.kind==="missing-customer"&&unchanged(before,after);
 if(step===2)return result.kind==="invalid-quote"&&unchanged(before,after);
 if(step===3)return result.kind==="committed";
 if(step===4)return result.kind==="queried"&&lookup?.customer?.customerId==="C-001"&&lookup?.quotes?.length===1&&lookup.quotes[0].quoteId==="Q-001"&&lookup.quotes[0].customerId==="C-001"&&unchanged(before,after);
 if(step===5)return result.kind==="aborted"&&result.error==="ConstraintError"&&unchanged(before,after);
 if(step===6)return result.kind==="committed";
 if(step===7)return result.kind==="duplicate"&&unchanged(before,after);
 return false;
}
function dataView(d){
 const c=d.customers.length,q=d.quotes.length,o=d.orders.length;
 return `<div class="cqolab-stats"><div><span>客户</span><strong>${c}</strong></div><div><span>报价</span><strong>${q}</strong></div><div><span>订单</span><strong>${o}</strong></div></div>
 <div class="cqolab-scroll"><table><thead><tr><th>实体</th><th>主键</th><th>关联</th><th>状态 / 内容</th></tr></thead><tbody>
 ${d.customers.map(x=>`<tr><td>客户</td><td>${esc(x.customerId)}</td><td>—</td><td>${esc(x.name)}</td></tr>`).join("")}
 ${d.quotes.map(x=>`<tr><td>报价</td><td>${esc(x.quoteId)}</td><td>${esc(x.customerId)}</td><td>${esc(x.status)} · ${esc(x.productName)} × ${x.quantity}</td></tr>`).join("")}
 ${d.orders.map(x=>`<tr><td>订单</td><td>${esc(x.orderId)}</td><td>${esc(x.quoteId)}</td><td>${esc(x.status)}</td></tr>`).join("")}
 ${!(c+q+o)?'<tr><td colspan="4">暂无教学记录</td></tr>':""}</tbody></table></div>`;
}
function fields(step){
 if(step===0)return '<label class="cqolab-label">虚构客户名称<input class="field" id="cqolabName" maxlength="30" autocomplete="off" placeholder="例如：教学客户甲"></label>';
 if(step===3)return '<div class="cqolab-fields"><label class="cqolab-label">教学产品名称<input class="field" id="cqolabProduct" maxlength="50" placeholder="例如：示例标识"></label><label class="cqolab-label">数量<input class="field" id="cqolabQuantity" type="number" min="1" max="10000" step="1" value="2"></label></div>';
 return "";
}
function stage(d){
 if(session.step===8)return `<h2 tabindex="-1">八步实训已完成</h2><p>已通过真实 IndexedDB 验证客户、报价、订单的关联、事务回滚、防重复提交，以及刷新后的数据恢复。</p>${dataView(d)}<button class="btn btn-ghost" type="button" data-cqolab="reset">重置本练习</button>`;
 return `<div class="cqolab-steps">${titles.map((_,i)=>`<span class="${i<session.step?"done":i===session.step?"current":""}">${i+1}</span>`).join("")}</div>
 <p class="micro">第 ${session.step+1} / 8 步 · 原生 IndexedDB</p><h2 tabindex="-1">${esc(titles[session.step])}</h2><p>${esc(hints[session.step])}</p>
 ${dataView(d)}${fields(session.step)}
 <div class="cqolab-actions"><button type="button" class="btn btn-primary" data-cqolab="next" ${busy?"disabled":""}>${esc(["创建客户","尝试缺失客户","尝试无效报价","保存教学报价","查询关联","触发事务回滚","创建订单","重复转单并刷新"][session.step])}</button>
 <button type="button" class="btn btn-ghost" data-cqolab="reset" ${busy?"disabled":""}>重置本练习</button></div>
 <p id="cqolabMessage" class="cqolab-feedback" role="status" aria-live="polite">${esc(session.msg||"按当前要求操作，系统将重新读取数据库并自动判分。")}</p>`;
}
function page(){
 queueMicrotask(()=>{void refresh();});
 return '<div class="page-enter detail-width"><div class="breadcrumb"><a href="#/components">组件</a><span>›</span><span>客户报价订单实训</span></div><a class="back-link" href="#/components">← 返回组件目录</a><h1>客户 → 报价 → 订单组合实战</h1><p class="subhead">八步真实数据关联与事务训练。全部为虚构教学数据，不代表真实 ERP 计价和订单规则。</p><div class="card cqolab-card" id="cqolabRoot"><p role="status">正在读取教学数据库…</p></div><p class="micro">本地 IndexedDB 数据不会跨设备同步；当前 V8 JSON 学习备份不包含此数据库。</p></div>';
}
async function refresh(){
 const root=document.getElementById("cqolabRoot");if(!root)return;
 try{
  const d=await snapshot();if(!root.isConnected)return;
  if(session.pendingReload&&session.step===7){if(validForStep(8,d)){session.step=8;session.msg="真实页面刷新后，重新读取三类数据成功。";}session.pendingReload=false;save();}
  if(!validForStep(session.step,d)){
   root.innerHTML=`<h2>教学进度与数据库不一致</h2><p role="alert">可能其他标签页修改了数据，或浏览器清除了部分记录。为避免误判，请手动重置本练习。</p>${dataView(d)}<button type="button" class="btn btn-ghost" data-cqolab="reset">重置本练习</button>`;
  }else{root.innerHTML=stage(d);root.querySelector("h2")?.focus({preventScroll:true});}
 }catch(e){root.innerHTML=`<h2>无法读取教学数据库</h2><p role="alert">${esc(e.message)}</p><button type="button" class="btn btn-ghost" data-cqolab="retry">重试读取</button>`;}
}
async function run(){
 if(busy||session.step>=8)return;
 busy=true;document.querySelector('#cqolabRoot [data-cqolab="next"]')?.setAttribute("disabled","");
 const step=session.step;
 try{
  const before=await snapshot();
  if(!validForStep(step,before))throw new Error("数据已被其他窗口修改，请手动重置本练习。");
  let result,lookup;
  if(step===0)result=await createCustomer(document.getElementById("cqolabName")?.value);
  if(step===1)result=await createQuote("C-404","教学标识",2);
  if(step===2)result=await createQuote("C-001","教学标识",-1);
  if(step===3)result=await createQuote("C-001",document.getElementById("cqolabProduct")?.value,document.getElementById("cqolabQuantity")?.value);
  if(step===4){lookup=await queryCustomer("C-001");result={kind:"queried"};}
  if(step===5)result=await convertQuote(true);
  if(step===6)result=await convertQuote(false);
  if(step===7)result=await convertQuote(false);
  const after=await snapshot();
  if(!grade(step,result,before,after,lookup))throw new Error("本步未通过：操作结果或实际数据库快照不符合要求（"+(result?.kind||"unknown")+"）。");
  if(step===7){session.pendingReload=true;session.msg="重复转单已拒绝，正在刷新并重新读取数据库。";save();location.reload();return;}
  session.step++;session.msg="本步已通过，已重新读取数据库核对关联与状态。";save();
 }catch(e){session.msg="未通过："+(e?.message||String(e));save();}
 finally{busy=false;if(!session.pendingReload)await refresh();}
}
async function reset(){
 const db=await openDB();db.close();
 await new Promise((resolve,reject)=>{
  const r=indexedDB.deleteDatabase(DB);
  r.onsuccess=resolve;
  r.onerror=()=>reject(r.error||new Error("重置失败"));
  r.onblocked=()=>reject(new Error("重置被其他标签页阻止，请关闭其他练习窗口"));
 });
 localStorage.removeItem(PROGRESS);session={step:0,pendingReload:false,msg:""};await refresh();
}
function click(e){
 const el=e.target?.closest?.("[data-cqolab]");if(!el)return false;e.preventDefault();
 if(el.dataset.cqolab==="next")void run();
 if(el.dataset.cqolab==="retry")void refresh();
 if(el.dataset.cqolab==="reset"&&!busy&&window.confirm("确认重置？仅清除 P2.4 教学数据库和本实训进度。")){
  busy=true;void reset().catch(err=>{session.msg="重置失败："+err.message;save();}).finally(()=>{busy=false;void refresh();});
 }
 return true;
}
window.V8CustomerOrderLab={page,click,openDB,snapshot,createCustomer,createQuote,queryCustomer,convertQuote,grade,validForStep,reset,storage:{database:DB,progress:PROGRESS}};
})();
