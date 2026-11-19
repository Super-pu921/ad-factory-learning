import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {mkdirSync,readFileSync,writeFileSync} from 'node:fs';
const engines=createRequire(import.meta.url)(process.env.V8_PLAYWRIGHT_MODULE||'playwright');
const base=process.env.V8_CATALOG_TEST_URL||'http://127.0.0.1:8768/knowledge-catalog/';
const workbench=new URL('../index.html',base).href;
const manifest=JSON.parse(readFileSync(new URL('../knowledge-catalog/teaching-manifest.json',import.meta.url),'utf8'));
const legacy=JSON.parse(readFileSync(new URL('../data.json',import.meta.url),'utf8'));
const evidence=process.env.V8_EVIDENCE_DIR;if(evidence)mkdirSync(evidence,{recursive:true});
const records=[],learning={done:[7],favorites:['lesson:7'],notes:{7:'synthetic preserved note'},quiz:{7:{value:1,correct:true}}};
const seed=()=>{if(window===top&&localStorage.getItem('adFactoryLearning.v8.production')===null){localStorage.setItem('adFactoryLearning.v8.production',JSON.stringify({done:[7],favorites:['lesson:7'],notes:{7:'synthetic preserved note'},quiz:{7:{value:1,correct:true}}}));localStorage.setItem('adFactoryLearning.v8.order-lab','synthetic lab');}};
const init=async(browser,width)=>{const context=await browser.newContext({viewport:{width,height:900},serviceWorkers:'block'});await context.addInitScript(seed);return context;};
async function category(page,id){await page.locator(`a[data-teaching-domain="${id}"]`).click();await page.waitForURL(url=>url.hash===`#/components/category/${id}`);await page.locator('#teachingCategoryResults a').first().waitFor();}
async function returnToLibrary(page){const back=page.viewportSize().width===390?page.getByRole('button',{name:'返回组件目录',exact:true}):page.locator('.breadcrumb button[data-go="/components"]');await back.click();await page.waitForURL(url=>url.hash==='#/components');await page.locator('#teachingDomainGrid a').first().waitFor();}
async function preserved(page){assert.deepEqual(await page.evaluate(()=>({...localStorage})),{'adFactoryLearning.v8.production':JSON.stringify(learning),'adFactoryLearning.v8.order-lab':'synthetic lab'});}
assert.ok(!process.env.V8_LIBRARY_ENGINE||['chromium','webkit'].includes(process.env.V8_LIBRARY_ENGINE));
assert.ok(!process.env.V8_LIBRARY_WIDTH||['1440','390'].includes(process.env.V8_LIBRARY_WIDTH));
for(const name of ['chromium','webkit']){
 if(process.env.V8_LIBRARY_ENGINE&&process.env.V8_LIBRARY_ENGINE!==name)continue;
 const browser=await engines[name].launch({headless:true});
 try{for(const width of [1440,390]){
  if(process.env.V8_LIBRARY_WIDTH&&Number(process.env.V8_LIBRARY_WIDTH)!==width)continue;
  const context=await init(browser,width),page=await context.newPage(),errors=[],writes=[];page.setDefaultTimeout(12000);
  page.on('pageerror',error=>errors.push(error.message));page.on('request',request=>{if(request.method()!=='GET')writes.push(request.method()+' '+request.url());});
  try{
  await page.goto(workbench+'#/components');await page.locator('#teachingDomainGrid a').first().waitFor();
  assert.equal(await page.title(),'组件库 · V8 正式版');
  assert.equal(await page.locator('#teachingDomainGrid a').count(),16);
  assert.equal(await page.locator('#teachingDomainGrid .micro').allTextContents().then(xs=>xs.reduce((a,x)=>a+Number(x),0)),821);
  assert.equal(await page.locator('#componentCatalog .v8-category-tile .micro').allTextContents().then(xs=>xs.reduce((a,x)=>a+Number(x),0)),88);
  assert.ok((await page.locator('#teachingComponentCatalog').boundingBox()).y<(await page.locator('#componentCatalog').boundingBox()).y,'New categories precede the legacy list');
  if(evidence)await page.screenshot({path:`${evidence}/${name}-${width}-library.png`,fullPage:true,animations:'disabled'});
  const ids=[];
  for(const domain of manifest.domains){
   await category(page,domain.id);const links=await page.locator('#teachingCategoryResults a').evaluateAll(nodes=>nodes.map(node=>node.href));
   assert.equal(links.length,domain.teachingTopics,domain.id);
   for(const href of links){const url=new URL(href);assert.equal(url.pathname,new URL(base).pathname);assert.equal(url.searchParams.get('from'),'components');assert.match(url.hash,/^#K-D\d{2}-\d{3}\/L1$/);ids.push(url.hash.slice(1).split('/')[0]);}
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true,domain.id+' viewport');
   if(domain.id==='D16'){
    await page.locator('#teachingCategorySearch').fill('K-D16-001');assert.equal(await page.locator('#teachingCategoryResults a').count(),1);
    await page.locator('#teachingCategorySearch').fill('missing-synthetic-entry');assert.equal(await page.locator('#teachingCategoryResults a').count(),0);
    await page.locator('#teachingCategorySearch').fill('');await page.reload();await page.locator('#teachingCategoryResults a').first().waitFor();assert.equal(await page.locator('#teachingCategoryResults a').count(),domain.teachingTopics);
    if(evidence)await page.screenshot({path:`${evidence}/${name}-${width}-engineering-list.png`,animations:'disabled'});
   }
   records.push({engine:name,width,domain:domain.id,listed:links.length,status:'PASS'});await returnToLibrary(page);
  }
  assert.deepEqual(ids.sort(),manifest.topics.map(topic=>topic.knowledgeId).sort(),'Every authored topic is reachable once from the main categories');
  for(const [id,info]of Object.entries(legacy.componentCategories)){
   await page.locator(`#componentCatalog a[href="#/components/category/${id}"]`).click();
   await page.getByRole('heading',{name:info[0],exact:true}).waitFor();
   const links=await page.locator('#view .list-card a').evaluateAll(nodes=>nodes.map(node=>new URL(node.href).hash));
   assert.deepEqual(links,legacy.components.filter(component=>component.category===id).map(component=>'#/components/detail/'+component.id));await returnToLibrary(page);
  }
  await page.locator('#componentSearch').fill('K-D08-040');assert.equal(await page.locator('#teachingComponentResults a').count(),1);
  assert.equal(await page.locator('#teachingComponentCatalog').isVisible(),false);
  await page.locator('#componentSearch').fill('button');assert.ok(await page.locator('#componentResults a').count()>0);await page.getByRole('button',{name:'清除',exact:true}).click();
  for(const sample of [{domain:'D01',id:'K-D01-001',level:'L3'},{domain:'D08',id:'K-D08-040',level:'L2'},{domain:'D12',id:'K-D12-002',level:'L2'},{domain:'D16',id:'K-D16-001',level:'L2'}]){
   await category(page,sample.domain);await page.locator('#teachingCategorySearch').fill(sample.id);await page.locator(`#teachingCategoryResults a[href*="#${sample.id}/"]`).click();await page.waitForFunction(id=>document.getElementById('detailId')?.textContent===id,sample.id);
   await page.locator('.unit-tabs>button').nth(Number(sample.level[1])-1).click();await page.reload({waitUntil:'domcontentloaded'});
   await page.locator('.unit-tabs>button[aria-pressed=true]').filter({hasText:sample.level}).waitFor();assert.equal(new URL(page.url()).searchParams.get('from'),'components');
   if(sample.id==='K-D01-001'){await page.getByRole('button',{name:'生成教学报价',exact:true}).click();await page.getByText('教学金额 ¥241.00 · 2 项',{exact:true}).waitFor();}
   if(sample.id==='K-D08-040'){await page.locator('[data-editor]').fill('主组件库整合验收');await page.locator('[data-editor-apply]').click();assert.match(await page.locator('[data-result]').textContent(),/主组件库整合验收/);}
   if(sample.id==='K-D12-002'){const before=await page.locator('[data-result]').textContent();await page.locator('[data-scenario]').click();assert.notEqual(await page.locator('[data-result]').textContent(),before);}
   if(sample.id==='K-D16-001'){await page.locator('[data-runtime]').click();await page.waitForFunction(()=>document.querySelector('[data-runtime-result]')?.textContent.startsWith('{'));assert.equal(JSON.parse(await page.locator('[data-runtime-result]').textContent()).phase,'fulfilled');}
   if(evidence)await page.screenshot({path:`${evidence}/${name}-${width}-${sample.id}.png`,animations:'disabled'});
   await page.getByRole('button',{name:'返回组件列表',exact:true}).click();await page.waitForURL(url=>url.hash===`#/components/category/${sample.domain}`);await page.locator('#teachingCategoryResults a').first().waitFor();await returnToLibrary(page);
  }
  await page.locator('#globalSearch').click();await page.locator('#fullSearch').fill('K-D08-040');assert.equal(await page.locator('#globalSearchResults a').count(),1);
  await page.locator('#globalSearchResults a').click();await page.waitForFunction(()=>document.getElementById('detailId')?.textContent==='K-D08-040');await page.getByRole('button',{name:'返回组件列表',exact:true}).click();await page.waitForURL(url=>url.hash==='#/components/category/D08');
  await page.locator('#globalSearch').click();await page.locator('#fullSearch').fill('K-D16');assert.equal(await page.locator('#globalSearchResults a').count(),122);await page.locator((width===390?'#bottomNav':'#sideNav')+' [data-nav=components]').click();await page.locator('#teachingDomainGrid a').first().waitFor();await page.locator('#globalSearch').click();await page.locator('#fullSearch').waitFor();assert.equal(await page.locator('#globalSearchResults a').count(),122,'Returning to global search must retain all matches');
  await preserved(page);assert.deepEqual(errors,[]);assert.deepEqual(writes,[]);await context.close();console.log(`${name} ${width}: all 821 teaching links, 88 legacy links, four live demos, refresh/return/search/storage PASS`);
  }catch(error){if(evidence){writeFileSync(evidence+`/failure-${name}-${width}.json`,JSON.stringify({url:page.url(),errors,message:error.message,records},null,2));await page.screenshot({path:evidence+`/failure-${name}-${width}.png`,animations:'disabled'});}throw error;}
 }
 // Delayed responses must update a deep-linked category without losing typed filters.
 const delayed=await init(browser,390),page=await delayed.newPage(),errors=[];page.on('pageerror',error=>errors.push(error.message));
 let release;const held=new Promise(resolve=>{release=resolve;});await page.route('**/teaching-manifest.json',async route=>{await held;await route.continue();});
 await page.goto(workbench+'#/components/category/D08',{waitUntil:'domcontentloaded'});await page.locator('#teachingCategorySearch').fill('Rich');release();await page.locator('#teachingCategoryResults a').first().waitFor();assert.equal(await page.locator('#teachingCategoryResults a').count(),2);assert.equal(await page.locator('#teachingCategorySearch').inputValue(),'Rich');
 await page.unroute('**/teaching-manifest.json');await page.route('**/teaching-manifest.json',route=>route.fulfill({status:503,body:'synthetic outage'}));await page.reload();await page.getByRole('button',{name:'重试加载',exact:true}).waitFor();await page.unroute('**/teaching-manifest.json');await page.getByRole('button',{name:'重试加载',exact:true}).click();await page.locator('#teachingCategoryResults a').first().waitFor();assert.equal(await page.locator('#teachingCategoryResults a').count(),60);
 const malicious=structuredClone(manifest);malicious.topics[0].title='<img src=x onerror="window.__teachingXss=true">';await page.route('**/teaching-manifest.json',route=>route.fulfill({json:malicious}));await page.goto(workbench+'#/components/category/D01');await page.reload();await page.getByText(malicious.topics[0].title,{exact:true}).waitFor();assert.equal(await page.locator('img[src=x]').count(),0);assert.equal(await page.evaluate(()=>window.__teachingXss),undefined);await page.unroute('**/teaching-manifest.json');
 const invalid=structuredClone(manifest);invalid.topics[0].domain='D17';await page.route('**/teaching-manifest.json',route=>route.fulfill({json:invalid}));await page.goto(workbench+'#/components');await page.reload();await page.getByRole('button',{name:'重试加载',exact:true}).waitFor();assert.equal(await page.locator('#teachingDomainGrid a').count(),0);assert.equal(await page.locator('#componentCatalog .v8-category-tile').count(),10);await preserved(page);assert.deepEqual(errors,[]);await delayed.close();console.log(name+': delayed category response, HTTP failure/retry, untrusted title, invalid manifest fallback PASS');
 }finally{await browser.close();}
}
if(evidence)writeFileSync(evidence+'/component-library-results.json',JSON.stringify(records,null,2)+'\n');
console.log(JSON.stringify({status:'PASS',categoryChecks:records.length,listedTeachingTopics:821,legacyComponents:88,productionMigration:'BLOCKED'}));
