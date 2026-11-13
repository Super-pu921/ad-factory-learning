/** Exact canonical source names and deterministic engineering fixtures. */
const names={
  "K-D16-001": "Async Request 异步请求",
  "K-D16-002": "API Request Lifecycle 请求生命周期",
  "K-D16-003": "Loading State Management 加载状态管理",
  "K-D16-004": "Debounce 防抖",
  "K-D16-005": "Throttle 节流",
  "K-D16-006": "Request Cancellation 请求取消",
  "K-D16-007": "Request Deduplication 请求去重",
  "K-D16-008": "Request Batching 请求批处理",
  "K-D16-009": "Parallel Requests 并行请求",
  "K-D16-010": "Sequential Requests 顺序请求",
  "K-D16-011": "Dependent Queries 依赖查询",
  "K-D16-012": "Polling 轮询",
  "K-D16-013": "Long Polling 长轮询",
  "K-D16-014": "Server Sent Events 服务端事件流",
  "K-D16-015": "WebSocket 实时连接",
  "K-D16-016": "Request Timeout 请求超时",
  "K-D16-017": "Cache Management 缓存管理",
  "K-D16-018": "Cache Invalidation 缓存失效",
  "K-D16-019": "Cache Key 缓存键设计",
  "K-D16-020": "Stale While Revalidate 过期后重新验证",
  "K-D16-021": "Optimistic UI 乐观更新",
  "K-D16-022": "Pessimistic UI 悲观更新",
  "K-D16-023": "Data Normalization 数据规范化",
  "K-D16-024": "Data Synchronization 数据同步",
  "K-D16-025": "Offline Storage 离线存储",
  "K-D16-026": "Offline Queue 离线任务队列",
  "K-D16-027": "Background Sync 后台同步",
  "K-D16-028": "Cache Persistence 缓存持久化",
  "K-D16-029": "Cache Eviction 缓存淘汰",
  "K-D16-030": "Pagination Data Cache 分页缓存",
  "K-D16-031": "Retry / Backoff 重试退避",
  "K-D16-032": "Exponential Backoff 指数退避",
  "K-D16-033": "Circuit Breaker 熔断器",
  "K-D16-034": "Error Recovery 错误恢复",
  "K-D16-035": "Fallback Strategy 降级策略",
  "K-D16-036": "Idempotency 幂等性",
  "K-D16-037": "Duplicate Submission Prevention 防重复提交",
  "K-D16-038": "Transaction Handling 事务处理",
  "K-D16-039": "Compensation Transaction 补偿事务",
  "K-D16-040": "Partial Failure Handling 部分失败处理",
  "K-D16-041": "Dead Letter Queue 死信队列",
  "K-D16-042": "Graceful Degradation 优雅降级",
  "K-D16-043": "Concurrency Control 并发控制",
  "K-D16-044": "Optimistic Lock 乐观锁",
  "K-D16-045": "Pessimistic Lock 悲观锁",
  "K-D16-046": "Version Conflict 版本冲突",
  "K-D16-047": "Last Write Wins 最后写入优先",
  "K-D16-048": "Merge Strategy 数据合并策略",
  "K-D16-049": "Event Sourcing 事件溯源",
  "K-D16-050": "Change Data Capture 变更数据捕获",
  "K-D16-051": "Distributed Transaction 分布式事务",
  "K-D16-052": "Data Reconciliation 数据对账",
  "K-D16-053": "State Persistence 状态持久化",
  "K-D16-054": "State Machine 状态机",
  "K-D16-055": "State Transition Validation 状态转换校验",
  "K-D16-056": "Dirty Form 脏表单检测",
  "K-D16-057": "Autosave 自动保存",
  "K-D16-058": "Autosave Debounce 自动保存防抖",
  "K-D16-059": "Undo / Redo 撤销与重做",
  "K-D16-060": "Command Pattern 命令模式",
  "K-D16-061": "Draft Management 草稿管理",
  "K-D16-062": "Form Persistence 表单数据持久化",
  "K-D16-064": "Multi-step Submission 分步提交",
  "K-D16-065": "Batch Processing 批量处理",
  "K-D16-066": "Bulk Operation Recovery 批量操作恢复",
  "K-D16-067": "Data Migration 数据迁移",
  "K-D16-068": "Authentication 身份认证",
  "K-D16-069": "Authorization 权限授权",
  "K-D16-070": "RBAC 角色权限控制",
  "K-D16-071": "ABAC 属性权限控制",
  "K-D16-072": "Permission Guard 权限守卫",
  "K-D16-073": "Route Guard 路由守卫",
  "K-D16-074": "Token Refresh 令牌刷新",
  "K-D16-075": "Session Management 会话管理",
  "K-D16-076": "CSRF Protection 跨站请求伪造防护",
  "K-D16-077": "XSS Protection 跨站脚本防护",
  "K-D16-078": "Content Security Policy 内容安全策略",
  "K-D16-079": "Input Sanitization 输入净化",
  "K-D16-080": "Sensitive Data Masking 敏感数据脱敏",
  "K-D16-081": "Audit Logging 审计日志",
  "K-D16-082": "Lazy Loading 懒加载",
  "K-D16-083": "Code Splitting 代码分割",
  "K-D16-084": "Dynamic Import 动态导入",
  "K-D16-085": "Virtualization 虚拟化",
  "K-D16-086": "Memoization 记忆化",
  "K-D16-087": "Render Optimization 渲染优化",
  "K-D16-088": "Bundle Optimization 构建产物优化",
  "K-D16-089": "Memory Management 内存管理",
  "K-D16-090": "Memory Leak Detection 内存泄漏检测",
  "K-D16-091": "Web Worker 后台线程",
  "K-D16-092": "WebAssembly WebAssembly",
  "K-D16-093": "Image Optimization 图片优化",
  "K-D16-094": "Resource Prefetch 资源预取",
  "K-D16-095": "Performance Profiling 性能分析",
  "K-D16-096": "Component Architecture 组件架构",
  "K-D16-097": "State Management 状态管理",
  "K-D16-098": "Dependency Injection 依赖注入",
  "K-D16-099": "Repository Pattern 仓储模式",
  "K-D16-100": "Service Layer 服务层",
  "K-D16-101": "Event Bus 事件总线",
  "K-D16-102": "Plugin Architecture 插件架构",
  "K-D16-103": "Feature Flag 功能开关",
  "K-D16-104": "Configuration Management 配置管理",
  "K-D16-105": "Environment Management 环境管理",
  "K-D16-106": "Logging 日志系统",
  "K-D16-107": "Telemetry 遥测",
  "K-D16-108": "Observability 可观测性",
  "K-D16-109": "Error Monitoring 错误监控",
  "K-D16-110": "API Versioning API 版本管理",
  "K-D16-111": "Backward Compatibility 向后兼容",
  "K-D16-112": "Database Migration 数据库迁移",
  "K-D16-113": "Unit Testing 单元测试",
  "K-D16-114": "Component Testing 组件测试",
  "K-D16-115": "Integration Testing 集成测试",
  "K-D16-116": "End-to-end Testing 端到端测试",
  "K-D16-117": "Visual Regression Testing 视觉回归测试",
  "K-D16-118": "Accessibility Testing 无障碍测试",
  "K-D16-119": "Performance Testing 性能测试",
  "K-D16-120": "Contract Testing 契约测试",
  "K-D16-121": "Test Data Management 测试数据管理",
  "K-D16-122": "Mock Service 模拟服务",
  "K-D16-123": "CI 持续集成",
  "K-D16-124": "CD 持续交付与部署",
  "K-D16-125": "Release Management 发布管理",
  "K-D16-126": "Rollback 回滚机制",
  "K-D16-127": "Feature Verification 功能验收"
};
export const engineeringSpecs=[];
export const engineeringSkippedSpecs=[];
const copy=v=>JSON.parse(JSON.stringify(v));
function add(n,key,principle,input,patch,path,value,bad,invalid){const id=`K-D16-${String(n).padStart(3,'0')}`;engineeringSpecs.push({knowledgeId:id,title:names[id],key,principle,input,changed:{...copy(input),...copy(patch)},invalidInput:{...copy(input),...copy(bad)},invalid,witness:{path,value}});}
function skip(n,reason,requiredInput){const id=`K-D16-${String(n).padStart(3,'0')}`;engineeringSkippedSpecs.push({knowledgeId:id,title:names[id],status:'SKIPPED_MISSING_INPUT',reason,requiredInput});}
add(1,'async-request','真实本地Promise从等待到完成或失败；逻辑模型记录同一生命周期。',{delay:10,value:'教学响应',fail:false},{fail:true},'phases.2','fulfilled',{delay:-1},'延迟不能为负；不发送真实网络请求。');
add(2,'request-lifecycle','响应状态码与业务body分离，只有2xx进入成功分支。',{status:200,body:{value:'虚构响应'}},{status:503},'ok',true,{status:99},'状态码必须落在HTTP编码范围。');
add(3,'loading-management','加载状态来自未结算请求ID集合，重复start不能重复计数。',{events:[{id:'A',type:'start'},{id:'B',type:'start'},{id:'A',type:'settle'}]},{events:[{id:'A',type:'start'},{id:'A',type:'settle'}]},'pending.0','B',{events:[{id:'A',type:'unknown'}]},'未定义生命周期事件不能更改加载集合。');
add(7,'request-dedup','相同请求键共享同一在途Promise和结果，不重复执行本地任务。',{requests:[{key:'A',value:'one'},{key:'A',value:'one'},{key:'B',value:'two'}]},{requests:[{key:'A',value:'one'},{key:'B',value:'two'}]},'executions',2,{requests:[{key:'A',value:'one'},{key:'A',value:'other'}]},'同键不同载荷是冲突，不能无声复用。');
add(8,'request-batching','同一微任务窗口收集的请求合并执行，保留各请求身份。',{requests:[{id:'A',tick:0},{id:'B',tick:0},{id:'C',tick:1}]},{requests:[{id:'A',tick:0},{id:'B',tick:1},{id:'C',tick:2}]},'calls',2,{requests:[{id:'A',tick:0},{id:'A',tick:1}]},'批请求身份不得重复。');
add(9,'parallel-requests','多个真实Promise同时启动，结果数组保持输入顺序而完成顺序可以不同。',{tasks:[{id:'A',duration:20},{id:'B',duration:5}]},{tasks:[{id:'A',duration:5},{id:'B',duration:20}]},'elapsed',20,{tasks:[{id:'A',duration:-1}]},'任务耗时不能为负。');
add(10,'sequential-requests','后一个本地Promise等待前一个完成，历时是各步骤之和。',{tasks:[{id:'A',duration:5},{id:'B',duration:10}]},{tasks:[{id:'A',duration:10},{id:'B',duration:20}]},'elapsed',15,{tasks:[{id:'A',duration:-1}]},'顺序任务不能有负耗时。');
add(11,'dependent-queries','先取得客户身份，再以该结果作为第二查询的键。',{customers:[{id:'A',name:'甲'},{id:'B',name:'乙'}],orders:[{id:'O1',customerId:'A'},{id:'O2',customerId:'B'}],customerId:'A'},{customerId:'B'},'orders.0.id','O1',{customerId:'Z'},'前置查询未命中时不启动后续查询。');
add(12,'polling','拥有者限定轮询次数并清理计时器，每次读取下一条虚构快照。',{interval:10,count:2,snapshots:[10,20,30]},{count:3},'polls.length',2,{count:4},'轮询不能越过本地声明的快照序列。');
skip(13,'没有可随静态站交付的长轮询服务端等待、释放与超时协议，不能用一次setTimeout冒充HTTP长轮询。','独立可验证长轮询端点、等待/超时/取消协议与无用户数据的测试服务。');
skip(14,'没有可交付的text/event-stream端点及重连Last-Event-ID契约，静态文本不等于真实SSE连接。','可验证SSE服务、事件与重连协议、断流和取消夹具。');
skip(15,'没有可交付WebSocket握手和双向服务端契约，MessageChannel不能冒充WebSocket。','无用户资料的WebSocket端点、协议/关闭/异常/重连测试契约。');
add(20,'swr','过期缓存先展示旧值，再由真实本地异步任务替换为新值。',{cached:{at:0,value:'旧数据'},now:100,ttl:50,server:{value:'新数据'}},{now:20},'final','新数据',{ttl:0},'TTL必须大于零。');
add(21,'optimistic-ui','界面先应用变更，失败时真实回滚到变更前状态。',{before:5,delta:2,accepted:true},{accepted:false},'trace.0.value',7,{delta:-6},'乐观变更不得突破非负数量约束。');
add(22,'pessimistic-ui','等待期间保留旧值，只有确认成功后才应用变更。',{before:5,delta:2,accepted:true},{accepted:false},'trace.0.value',5,{delta:-6},'提交值必须满足非负数量约束。');
add(24,'data-sync','按稳定ID和版本合并副本，同版本不同值明确报告冲突。',{local:[{id:'A',version:1,value:'旧'}],remote:[{id:'A',version:2,value:'新'}]},{remote:[{id:'A',version:1,value:'分歧'}]},'merged.0.value','新',{remote:[{id:'A',version:-1,value:'x'}]},'版本号必须非负。');
add(25,'offline-storage','记录真实序列化到当前教学单例本地缓存，并可刷新后显式载入。',{records:[{id:'A',value:'虚构离线记录'}]},{records:[{id:'B',value:'新虚构记录'}]},'restored.0.id','A',{records:[{id:'A',value:'x'},{id:'A',value:'y'}]},'缓存记录身份必须唯一；本例用localStorage而非通用IndexedDB引擎。');
add(26,'offline-queue','离线任务保留身份与载荷，在线时生成待发送集合，本例只写隔离教学缓存。',{tasks:[{id:'A',payload:'虚构任务'}],online:false},{online:true},'queued.length',1,{tasks:[{id:'A',payload:100}]},'任务载荷必须符合本例文字契约。');
skip(27,'缺少可跨Chromium/WebKit验证的ServiceWorker Background Sync运行时与同步服务契约，普通定时器不等于后台同步。','受支持Background Sync运行时、service-worker作用域及无真实数据同步端点契约。');
add(28,'cache-persistence','缓存快照真实保存到当前教学键，重新载入后仍按显式到期时刻筛选。',{entries:[{key:'A',value:'甲',expires:100}],now:50},{now:120},'usable.length',1,{entries:[{key:'A',value:'甲',expires:-1}]},'缓存到期时刻不能为负。');
add(30,'pagination-cache','页面身份区分缓存项，命中复用该页ID，缺页明确需要请求。',{pages:[{page:1,ids:['A','B']},{page:2,ids:['C']}],requested:1},{requested:3},'hit',true,{pages:[{page:1,ids:['A']},{page:1,ids:['B']}]},'同页重复缓存会造成身份歧义。');
add(31,'retry-backoff','仅临时失败继续重试，固定退避间隔和尝试上限共同限定执行。',{maxAttempts:3,delay:10,outcomes:['transient','success']},{outcomes:['fatal','success']},'attempts',2,{maxAttempts:0},'尝试上限必须为正。');
add(33,'circuit-breaker','失败阈值打开熔断，冷却前拦截，冷却后半开试探决定恢复。',{threshold:2,cooldown:10,calls:[{at:0,success:false},{at:1,success:false},{at:3,success:true},{at:15,success:true}]},{threshold:1},'trace.2.executed',false,{cooldown:0},'冷却时长必须为正。');
add(34,'error-recovery','不同错误类型选择不同恢复入口，草稿保留而不是刷新丢失。',{error:'offline',draft:'虚构未完成输入'},{error:'expired'},'strategy','queue-draft',{error:'unknown'},'未知错误不能随意套用恢复策略。');
add(35,'fallback','主服务不可用才选择备用值，两者都不可用时明确缺失。',{primaryAvailable:false,fallbackAvailable:true,primary:'主值',fallback:'备用值'},{fallbackAvailable:false},'source','fallback',{fallbackAvailable:'yes'},'备用能力状态必须为布尔值。');
add(37,'duplicate-submit','在途与已完成请求身份分别保护重复入口，结算不会使同ID重新执行。',{events:[{id:'A',type:'submit'},{id:'A',type:'submit'},{id:'A',type:'settle'},{id:'A',type:'submit'}]},{events:[{id:'A',type:'submit'},{id:'B',type:'submit'}]},'executions',1,{events:[{id:'A',type:'unknown'}]},'未知提交生命周期事件必须拒绝。');
add(39,'compensation','先预留库存再扣虚构余额，第二步失败执行真实反向补偿恢复库存。',{stock:10,credit:1000,qty:2,cents:300,chargeSucceeds:false},{chargeSucceeds:true},'stock',10,{qty:0},'补偿事务的业务数量须为正。');
add(41,'dead-letter','达到最大尝试次数的任务移入死信集合，未达到者仍可重试。',{maxAttempts:3,tasks:[{id:'A',attempts:3,error:'失败'},{id:'B',attempts:1,error:'临时失败'}]},{maxAttempts:4},'deadLetters.0.id','A',{maxAttempts:0},'最大重试门槛须为正。');
add(42,'graceful-degradation','可选服务故障只禁用依赖能力，核心浏览在目录可用时继续。',{services:{catalog:true,search:false,orders:true}},{services:{catalog:true,search:true,orders:false}},'features.browse',true,{services:{catalog:'yes',search:true,orders:true}},'依赖可用性必须为显式布尔值。');
add(43,'concurrency-control','有限执行槽为任务派生不重叠调度，同槽顺序和并行上限可复核。',{limit:2,jobs:[{id:'A',duration:10},{id:'B',duration:5},{id:'C',duration:8}]},{limit:1},'elapsed',13,{limit:0},'并发槽必须大于零且运行时最大20。');
add(45,'pessimistic-lock','锁所有者才能释放，其他参与者申请时不能越过独占门禁。',{actions:[{actor:'An',type:'acquire'},{actor:'Bo',type:'acquire'}]},{actions:[{actor:'An',type:'acquire'},{actor:'An',type:'release'},{actor:'Bo',type:'acquire'}]},'owner','An',{actions:[{actor:'An',type:'steal'}]},'锁不支持未定义抢占操作。');
add(46,'version-conflict','旧草稿版本与当前版本不等时拒绝写入，保留当前新值。',{current:{version:2,value:'新值'},draft:{version:1,value:'旧稿'}},{draft:{version:2,value:'修订'}},'accepted',false,{draft:{version:-1,value:'坏版本'}},'草稿版本不得为负。');
add(50,'change-capture','前后快照按ID比较，分别产生插入、更新和删除事件。',{before:[{id:'A',value:'旧'},{id:'B',value:'保留'}],after:[{id:'A',value:'新'},{id:'B',value:'保留'}]},{after:[{id:'A',value:'旧'},{id:'C',value:'新增'}]},'changes.0.type','update',{after:[{id:'A',value:'x'},{id:'A',value:'y'}]},'快照内ID不能重复。');
add(51,'distributed-transaction','本地两阶段协调收集所有参与者prepare票，任一失败则统一回退。',{participants:[{id:'stock',prepare:true},{id:'billing',prepare:false}]},{participants:[{id:'stock',prepare:true},{id:'billing',prepare:true}]},'decision','abort',{participants:[]},'没有参与者不能宣称跨服务事务完成；仅本地协调模型。');
add(53,'state-persistence','带版本状态真实序列化并只在当前隔离教学键保存恢复。',{state:{page:1,filter:'all'},version:1},{state:{page:2,filter:'open'}},'equal',true,{version:0},'状态格式版本必须为正。');
add(57,'autosave','显式启用当前虚构样例后逐次保存，失败保存不覆盖最后成功值。',{edits:[{id:'E1',value:'甲'},{id:'E2',value:'乙'}],failIds:['E2']},{failIds:[]},'latestSaved','甲',{edits:[{id:'E1',value:100}]},'自动保存输入必须为文字；仅当前主题隔离键。');
add(58,'autosave-debounce','真实计时器在连续输入时重置，停顿达到门槛才写当前隔离教学键。',{delay:20,edits:[{at:0,value:'a'},{at:5,value:'ab'},{at:80,value:'abc'}]},{edits:[{at:0,value:'x'},{at:5,value:'xy'}]},'writes',2,{delay:0},'防抖延迟必须为正；实际计时仅演示有限输入。');
add(61,'draft-management','草稿与正式值分离，发布或放弃分别影响不同副本。',{published:'正式一',draft:'草稿二',action:'save-draft'},{action:'publish'},'published','正式一',{action:'delete-production'},'草稿操作不接受真实生产删除动作。');
add(62,'form-persistence','表单仅持久化白名单字段，未列字段不进入保存快照。',{form:{name:'教学',qty:2,secret:'虚构不保存'},allowedFields:['name','qty']},{allowedFields:['name']},'excluded.0','secret',{allowedFields:['']},'保存字段标识不得为空。');
add(64,'multi-step','只提交已经有效的前缀步骤，前缀任一校验失败都不部分提交。',{steps:[{id:'A',valid:true},{id:'B',valid:false}],submitted:2},{submitted:1},'accepted',false,{submitted:3},'提交步数不能超过实际步骤。');
add(67,'data-migration','只迁移当前虚构旧格式副本，字段label映射name并保留真实迁移BLOCKED。',{version:1,records:[{id:'A',label:'旧字段'}]},{version:2,records:[{id:'A',name:'新字段'}]},'records.0.name','旧字段',{version:3},'未知Schema版本不自动猜测；不访问真实记录。');
add(68,'authentication','虚构用户名和密码实际核对生成本地身份，浏览器额外执行教学摘要比较而非连接账户。',{accounts:[{username:'demo',password:'demo-pass'}],username:'demo',password:'wrong'},{password:'demo-pass'},'authenticated',false,{username:100},'凭据格式必须为文字；教学摘要不能用于真实密码系统。');
add(69,'authorization','读取与写入分别检查资源所有权，已认证身份不自动拥有全部操作。',{principal:{id:'An'},resource:{id:'R1',owner:'Bo'},action:'write'},{action:'read'},'allowed',false,{action:'execute'},'未声明资源动作不授权。');
add(70,'rbac','角色查出显式权限集合，每次动作都按集合判断。',{roles:{worker:['read'],manager:['read','write']},role:'worker',action:'write'},{role:'manager'},'allowed',false,{role:'unknown'},'未知角色不能继承权限。');
add(71,'abac','部门相同和等级足够两个属性条件必须同时满足。',{actor:{department:'design',level:1},resource:{department:'design',level:2}},{actor:{department:'design',level:3}},'allowed',false,{actor:{department:'design',level:-1}},'属性等级必须非负。');
add(72,'permission-guard','进入操作前检查完整必需权限集合，缺任一项就不执行。',{permissions:['read'],required:['read','write'],execute:true},{permissions:['read','write']},'executed',false,{required:[100]},'权限标识必须为文字。');
add(73,'route-guard','编辑页先检查登录再检查编辑权限，失败路由原因明确且不改真实导航。',{path:'/editor',authenticated:false,canEdit:false},{authenticated:true},'redirect','/login',{path:'/unknown'},'未定义路由不应绕过守卫。');
add(74,'token-refresh','访问令牌到期后只有刷新凭据仍有效才轮换，过期旧令牌不继续使用。',{now:15,expires:10,refreshExpires:20,tokenId:'synthetic-T1'},{now:25},'state','rotated',{expires:-1},'到期时刻不能为负；令牌全为虚构教学身份。');
add(75,'session-management','会话同时受绝对寿命和空闲超时限制，只读取输入教学时刻。',{now:100,created:0,lastSeen:90,absolute:200,idle:30},{now:130},'active',true,{lastSeen:110},'最后活动不能发生在当前时刻之后。');
add(76,'csrf','本地请求守卫同时比较来源和显式教学token，任一不符都拒绝。',{trustedOrigin:'https://teaching.invalid',origin:'https://teaching.invalid',expectedToken:'demo-csrf',submittedToken:'bad'},{submittedToken:'demo-csrf'},'allowed',false,{expectedToken:''},'空token不能提供CSRF门禁；不读取真实cookie。');
add(77,'xss','不可信标记通过真实textContent呈现，节点不被解析成可执行HTML。',{payload:'<img src=x onerror="alert(1)">'},{payload:'<script>throw new Error("unsafe")</script>'},'executed',false,{payload:100},'不可信内容须为文本，不能转为任意对象执行。');
add(78,'csp','隔离iframe实际应用CSP限制内联脚本，并用受允许nonce脚本回报结果。',{allowInline:false},{allowInline:true},'expectedMessages.length',1,{allowInline:'yes'},'策略选择必须是布尔值，示例不接受用户脚本。');
add(79,'input-sanitization','教学编号做去空格大写规范化和保守字符白名单，而不冒充通用HTML净化器。',{value:' ab-12 '},{value:'job-03'},'normalized','AB-12',{value:'<script>'},'白名单之外字符必须拒绝。');
add(81,'audit-logging','当前操作日志使用稳定顺序号并按行为人筛选，不写真实审计文件。',{entries:[{actor:'An',action:'read',at:1},{actor:'Bo',action:'write',at:2}],actor:'An'},{actor:'Bo'},'filtered.0.action','read',{entries:[{actor:'An',action:'read',at:-1}]},'日志时刻不能为负。');
add(82,'lazy-loading','独立计算代码只在显式可见需求后通过真实动态导入加载。',{visible:true,module:'calculator',a:2,b:3},{a:4},'expectedResult',6,{module:'shell'},'只允许加载固定教学模块，不接受任意URL。');
add(83,'code-splitting','模块清单区分首包和延迟包，并实际按需加载独立教学chunk。',{modules:[{id:'entry',bytes:100,eager:true},{id:'calculator',bytes:60,eager:false}]},{modules:[{id:'entry',bytes:100,eager:true},{id:'calculator',bytes:60,eager:true}]},'initialBytes',100,{modules:[{id:'A',bytes:-1,eager:true}]},'包大小须为非负整数；本例不改实际打包配置。');
add(84,'dynamic-import','固定模块URL通过原生import取得导出函数，再实际执行并核对返回值。',{exportName:'calculateChunk',a:2,b:3},{a:5},'expectedResult',6,{exportName:'eval'},'不能动态选取任意导出名或执行输入代码。');
add(87,'render-optimization','浅比较有效属性，等值状态不重复写入演示DOM。',{states:[{id:'A',value:1},{id:'A',value:1},{id:'A',value:2}]},{states:[{id:'A',value:1},{id:'A',value:1}]},'renders',2,{states:[{id:'A',value:'one'}]},'比较模型的数值属性必须为有限数。');
add(88,'bundle-optimization','从入口追踪真实依赖图可达集合，未引用模块不进入教学包分析。',{modules:[{id:'A',bytes:100,dependencies:['B']},{id:'B',bytes:50,dependencies:[]},{id:'C',bytes:80,dependencies:[]}],entries:['A']},{entries:['A','C']},'bytes',150,{entries:['Z']},'入口或依赖不存在时拒绝分析，不声称运行真实bundler。');
add(89,'memory-management','只管理当前样例拥有的引用集合，释放后不再持有，不宣称强制垃圾回收。',{actions:[{id:'A',type:'retain'},{id:'B',type:'retain'},{id:'A',type:'release'}]},{actions:[{id:'A',type:'retain'},{id:'A',type:'release'}]},'retained.0','B',{actions:[{id:'A',type:'destroy-host'}]},'引用管理只接受本地retain和release。');
add(90,'leak-detection','登记的监听器与已移除监听器求差，实际EventTarget清理后不能再次响应。',{attached:['A','B'],removed:['A']},{removed:['A','B']},'leakCandidates',1,{attached:['A','A']},'监听器身份须唯一；不声称测量浏览器堆。');
add(91,'web-worker','真实独立模块Worker计算数据总和，消息结果与主线程纯模型互相核对。',{values:[1,2,3]},{values:[5,6]},'sum',6,{values:[1,'x']},'Worker只接收有限数值数组，禁止任意代码。');
add(92,'webassembly','固定Wasm二进制实际执行32位加法，不用JavaScript结果冒充模块执行。',{a:2,b:3},{a:7},'result',5,{a:2147483648},'输入必须在有符号32位整数范围。');
add(93,'image-optimization','真实Canvas按最大边缩小固定虚构位图并编码PNG，尺寸约束先于实际分配。',{width:100,height:50,maximum:40},{maximum:20},'targetPixels',800,{width:1001},'教学位图维度限制1000，不分配无限画布。');
add(94,'resource-prefetch','先fetch固定教学chunk资源，再在使用时import执行，预取本身不执行代码。',{enabled:true,target:'calculator-chunk',a:2,b:3},{enabled:false},'executesBeforeUse',false,{target:'external-url'},'预取目标只能是同源固定教学chunk。');
add(95,'profiling','给定样本定位耗时占比与瓶颈，并用performance.now实际测量有界本地工作。',{samples:[{name:'parse',duration:2},{name:'render',duration:8}]},{samples:[{name:'parse',duration:9},{name:'render',duration:1}]},'bottleneck','render',{samples:[{name:'x',duration:-1}]},'耗时不能为负，不对真实应用性能作无证据保证。');
add(96,'component-architecture','状态字段必须有明确拥有者，重复拥有同一字段被报告为边界冲突。',{components:[{id:'Form',owns:['draft']},{id:'Summary',owns:['total']}]},{components:[{id:'Form',owns:['draft']},{id:'Summary',owns:['draft']}]},'conflicts.length',0,{components:[{id:'A',owns:['x']},{id:'A',owns:['y']}]},'组件身份不能重复。');
add(97,'state-management','局部与共享状态由不同动作更新，改变一个作用域不会覆盖另一个。',{initial:{local:'draft',global:'light'},actions:[{type:'set-local',value:'edited'}]},{actions:[{type:'set-global',value:'dark'}]},'global','light',{actions:[{type:'overwrite-all',value:'x'}]},'状态动作必须来自明确白名单。');
add(102,'plugin-architecture','注册插件按顺序执行自己的固定运算，重复插件身份拒绝。',{plugins:[{id:'double',operation:'double'},{id:'inc',operation:'increment'}],value:3},{plugins:[{id:'inc',operation:'increment'},{id:'double',operation:'double'}]},'value',7,{plugins:[{id:'x',operation:'shell'}]},'插件仅有本地注册运算，不加载未知代码。');
add(103,'feature-flag','稳定用户桶与灰度百分比决定启用，主开关关闭时所有桶都禁用。',{user:'demo-An',percent:100,master:true},{master:false},'enabled',true,{percent:101},'灰度比例不能超过100%。');
add(105,'environment','环境名称只选择显式教学配置，不改变宿主环境变量或部署配置。',{environment:'development',configs:{development:{label:'开发演示',diagnostics:true},test:{label:'测试演示',diagnostics:false},production:{label:'生产标签示例',diagnostics:false}}},{environment:'test'},'config.diagnostics',true,{environment:'host'},'未知环境不能猜测配置。');
add(107,'telemetry','采集同意与事件允许列表共同决定收集字段，实际无任何遥测网络发送。',{consent:true,events:[{type:'render',duration:3},{type:'private',duration:9}],allowedTypes:['render']},{consent:false},'collected.length',1,{events:[{type:'render',duration:-1}]},'遥测耗时必须非负，事件仅虚构数据。');
add(108,'observability','同一traceId关联日志与span，其他任务指标不得混入。',{traceId:'T1',logs:[{traceId:'T1',message:'ERROR synthetic'},{traceId:'T2',message:'ok'}],spans:[{traceId:'T1',duration:10},{traceId:'T2',duration:30}]},{traceId:'T2'},'duration',10,{traceId:''},'trace身份不能为空。');
add(109,'error-monitoring','错误消息和位置形成指纹，重复错误合并计数而不同位置分组。',{errors:[{message:'failure',location:'A:1'},{message:'failure',location:'A:1'},{message:'failure',location:'B:1'}]},{errors:[{message:'failure',location:'A:1'}]},'groups.0.count',2,{errors:[{message:100,location:'A:1'}]},'错误内容必须符合文字契约。');
add(110,'api-versioning','同一内部记录按显式版本输出旧label或新name字段，避免直接破坏旧客户端。',{version:'v1',record:{id:'A',name:'教学',active:true}},{version:'v2'},'payload.label','教学',{version:'v3'},'未声明API版本不能自动推断。');
add(111,'backward-compatibility','兼容入口接收旧label与新name，新字段存在时优先使用新格式。',{record:{id:'A',label:'旧教学'}},{record:{id:'A',label:'旧教学',name:'新教学'}},'name','旧教学',{record:{id:'A'}},'缺少所有已知名称字段时不能伪造默认值。');
add(112,'database-migration','仅当前虚构行执行可逆字段迁移，原副本保留且生产迁移始终BLOCKED。',{direction:'up',rows:[{id:'A',label:'旧字段'}]},{direction:'down',rows:[{id:'A',name:'新字段'}]},'rows.0.name','旧字段',{direction:'unknown'},'未知迁移方向不执行；不接数据库。');
add(113,'unit-testing','测试实际纯函数计算值与独立期望，注入错误算法会使测试失败。',{cases:[{input:3,expected:6},{input:4,expected:8}],injectBug:false},{injectBug:true},'passed',true,{cases:[{input:'3',expected:6}]},'被测函数输入必须为数值，不能替换结果标签。');
add(114,'component-testing','真实原生输入控件的必填与长度约束，与独立预期做组件级核对。',{value:'ABC',maximum:5,expectedValid:true},{value:''},'passed',true,{maximum:0},'最大长度必须为正。');
add(115,'integration-testing','校验器、整数分计算器与比对器实际串联，模块间返回值决定测试结果。',{qty:2,cents:100,expected:200},{expected:300},'passed',true,{cents:1.5},'整数分接口不能接小数分。');
add(116,'e2e-testing','本地表单实际输入、确认和点击提交形成完整用户路径，不创建真实订单。',{name:'教学订单',qty:2,confirmed:true},{confirmed:false},'accepted',true,{qty:-1},'数量不能为负；完整流程仍为教学沙箱。');
add(117,'visual-regression','真实像素通道逐项求差，与容差比较后报告改变通道数。',{before:[10,20,30,255],after:[10,20,30,255],tolerance:0},{after:[10,25,30,255]},'passed',true,{after:[10,20]},'像素向量长度必须一致。');
add(118,'accessibility-testing','审计可访问名称和键盘焦点这两个明确子集，并检查真实DOM标签关联。',{fields:[{id:'name',label:'名称',focusable:true}]},{fields:[{id:'name',label:'',focusable:true}]},'issues.length',0,{fields:[{id:'name',label:100,focusable:true}]},'标签描述必须为文字，不宣称全站WCAG合规。');
add(119,'performance-testing','有界负载实际求和并核对数学期望与操作预算，耗时另由浏览器测量。',{size:100,operationBudget:200},{size:300},'actual',5050,{size:10001},'测试负载超过10000必须拒绝。');
add(120,'contract-testing','接口字段按声明的标量类型逐项核对，多余字段单独报告。',{contract:{id:'string',qty:'number'},payload:{id:'A',qty:2}},{payload:{id:'A',qty:'2'}},'errors.length',0,{contract:{id:'function'}},'未定义契约类型不执行。');
add(121,'test-data','固定种子线性同余算法生成可复现虚构夹具，并列出本例清理身份。',{seed:1,count:3},{seed:2},'records.0.value',48,{count:31},'测试夹具最多30条，不读取真实记录。');
add(122,'mock-service','固定路由真实本地分派成功数据或受控503错误，不发网络请求。',{path:'/items',items:[{id:'A',value:'虚构'}]},{path:'/failure'},'status',200,{path:'/host'},'模拟服务不访问未知路由。');
add(123,'ci','实际解析源JSON、校验必需字段再生成内存产物，失败校验阻止打包。',{source:'{"id":"A","value":2}',required:['id','value']},{required:['id','value','missing']},'stages.2.passed',true,{source:'{bad json'},'非法源JSON在解析阶段失败，不伪造构建通过。');
add(124,'cd','验证和审批门禁共同决定候选可交付性，本地演示不会执行真实部署。',{artifact:{version:'demo-1'},testsPassed:true,approved:false},{approved:true},'ready',false,{artifact:{version:''}},'产物版本不能为空，交付准备不等于已部署。');
add(125,'release','版本与变更列表保持可追踪，选定发布记录不得覆盖其他版本历史。',{releases:[{version:'v1',changes:['首版']},{version:'v2',changes:['修订']}],selected:'v1'},{selected:'v2'},'selected.version','v1',{selected:'missing'},'不存在的发布版本不可选。');
add(126,'rollback','回退恢复选定旧快照副本，同时保留回退前状态供核对。',{versions:[{id:'v1',state:{value:1}},{id:'v2',state:{value:2}}],target:'v1',current:{value:3}},{target:'v2'},'restored.value',1,{target:'missing'},'未知版本不得执行回退；真实生产状态不参与。');
add(127,'feature-verification','每条验收期望与实际逐项比较，尚未验证的条件不能被藏入完成状态。',{cases:[{id:'A',expected:'5',actual:'5'}],unverified:[]},{cases:[{id:'A',expected:'5',actual:'4'}]},'accepted',true,{cases:[]},'没有验收条件不能宣称完成。');
