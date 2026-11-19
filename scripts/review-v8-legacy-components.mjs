import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { createLegacyCatalogView } from './v8-legacy-catalog-view.mjs';

const read = file => readFileSync(new URL(`../${file}`, import.meta.url));
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
const files = {
  legacy: 'data.json', catalog: 'knowledge-catalog/catalog.json',
  source: 'knowledge-catalog/source/D01-D16-V1.0.md', teaching: 'knowledge-catalog/teaching-manifest.json',
  app: 'app.js', demos: 'demos.js'
};
const snapshots = Object.fromEntries(Object.entries(files).map(([key, path]) => [key, read(path)]));
const parse = key => JSON.parse(snapshots[key].toString('utf8'));
const inputHash = key => sha256(key === 'legacy' || key === 'source'
  ? snapshots[key]
  : snapshots[key].toString('utf8').replace(/\r\n/g, '\n'));
const view = createLegacyCatalogView(parse('legacy'));
assert.ok(view.audit.checks.length && view.audit.checks.every(check => check.status === 'PASS'), 'Static source audit must pass');

const { components, lessons } = view.catalog;
const inventory = parse('catalog').entries;
const manifest = parse('teaching');
const sourceLines = snapshots.source.toString('utf8').split(/\r?\n/);
const knowledge = new Map(inventory.map(entry => [entry.id, entry]));
const teaching = new Map(manifest.topics.map(topic => [topic.knowledgeId, topic]));
assert.equal(knowledge.size, inventory.length, 'Catalog IDs must be unique');
assert.equal(teaching.size, manifest.topics.length, 'Teaching IDs must be unique');
assert.equal(manifest.productionMigration, 'BLOCKED');

// These references were compared against the named dispatch branch and the target's
// source description. They describe overlap for review, never target identity.
const behavioralReferences = {
  grid: [['K-D02-004'], '列数选择改变页面网格排列'],
  'split-view': [['K-D02-010', 'K-D02-011'], '用滑块改变双栏比例。分别核对分栏容器与拖动分隔线的边界'],
  chart: [['K-D09-001'], '旧样例为柱状展示，不能覆盖整个图表领域'],
  input: [['K-D04-001'], '单行文本输入限制 30 字符，并显示必填提示'],
  search: [['K-D04-008'], '搜索输入框共用建议列表，需另核对提交与清空'],
  radio: [['K-D04-015', 'K-D04-016'], '一组交付方式互斥选择，分别核对单项语义与组语义'],
  dropdown: [['K-D03-006'], '通过触发按钮展开操作菜单'],
  steps: [['K-D03-009'], '演示步骤推进和当前步骤状态'],
  validation: [['K-D06-018'], '只验证单个必填字段并给出反馈，无法据此认定校验汇总'],
  'editable-table': [['K-D12-014'], '展示报价明细并允许修改示例单价，覆盖范围待查'],
  'permission-matrix': [['K-D12-050'], '员工权限的虚构勾选样例，授权与执行语义待查'],
  'mobile-order-card': [['K-D12-020'], '移动订单卡片展示编号、客户、状态和金额'],
  segmented: [['K-D04-018'], '共享互斥按钮组演示，筛选语义与通用按钮组的关系待查'],
  stepper: [['K-D04-040'], '加减按钮改变数字。K-D03-009 同名条目描述流程步骤，已排除'],
  'tag-input': [['K-D04-026'], '标签输入候选，需比较新增、去重和删除的行为'],
  otp: [['K-D04-042'], '旧演示用单字段输入六位数字。目标为分格输入，自动移焦和粘贴待核对'],
  comparison: [['K-D05-005'], '用表格比较两类组件的多项特征'],
  'status-dot': [['K-D06-002'], '用圆点加文字展示设备在线状态'],
  undo: [['K-D06-020'], '单次模拟删除及撤销反馈，未建立完整撤销重做栈的关联'],
  'focus-ring': [['K-D15-012'], '对照焦点可见性核验旧组件的焦点提示'],
  'aria-live': [['K-D15-006'], '操作反馈用状态区域播报'],
  'keyboard-shortcuts': [['K-D15-002'], '旧示例说明搜索与焦点快捷键，完整键盘导航仍需分别核验'],
  'bulk-actions': [['K-D12-003'], '勾选订单后触发本地批量标记'],
  'filter-builder': [['K-D12-004'], '组合状态与金额条件，保存筛选能力需另核对'],
  wizard: [['K-D12-008'], '旧样例可前后切换步骤，完整表单校验和提交待查'],
  'empty-search': [['K-D06-009'], '显示无结果提示及重试入口，业务条件需另核对']
};

const openQuestions = {
  transition: '旧样例展示通用 CSS 过渡，未定位到职责相同的目录条目',
  'dependent-select': '旧样例按产品改变建议规格。资料不足以判定是级联选择还是独立业务规则',
  tree: '只展开工序层级，导航、选择和树表三种职责不能据此选定',
  'success-state': '旧样例给出成功反馈，需要明确与页面级成功状态的边界',
  'formula-builder': '旧样例计算固定公式，规则编辑能力及目标条目的对应关系待补证'
};

// Exact-name candidates reviewed against the old demo and the source topic's scope.
// The five exclusions below keep their source links for comparison only.
const nameReviews = {
  container: ['K-D02-001', '旧演示切换最大宽度，覆盖容器边界。目录另含边距'],
  stack: ['K-D02-005', '旧演示垂直排列工序并切换间距'],
  sidebar: ['K-D02-017', '旧演示可收起侧栏，客户、报价、订单为示意文字'],
  drawer: ['K-D07-009', '旧按钮打开侧边订单详情，覆盖侧边展开和详情展示'],
  breadcrumb: ['K-D03-001', '旧演示显示三级路径，点击上级输出模拟返回'],
  tabs: ['K-D03-007', '旧演示在基本信息、生产进度和财务内容间切换'],
  card: ['K-D05-001', '旧演示把客户名及状态归入卡片并突出重点'],
  table: ['K-D05-022', '旧订单表有表头、行及单元格，并提供金额排序和搜索'],
  list: ['K-D05-002', '旧演示将客户顺序列出，支持关键字筛选'],
  descriptions: ['K-D05-003', '旧演示按字段名和值展示订单属性'],
  statistic: ['K-D05-004', '旧演示突出回款金额及订单数量，趋势对比待查'],
  timeline: ['K-D05-006', '旧演示按时间组织订单事件并可添加进度记录'],
  textarea: ['K-D04-002', '旧演示提供售后说明多行文本及 180 字限制，自动高度待查'],
  'number-input': ['K-D04-003', '旧演示是最小值 0、步长 1 的数量输入，精度与上限待查'],
  select: ['K-D04-019', '旧演示用原生选择框单选产品工艺，搜索与禁用待查'],
  autocomplete: ['K-D04-022', '旧演示通过原生 datalist 给出静态建议，异步建议待查'],
  'date-picker': ['K-D04-029', '旧演示选交货日期，额外的禁用日期约束待查'],
  checkbox: ['K-D04-013', '旧演示切换图纸确认，覆盖勾选和取消，半选待查'],
  switch: ['K-D04-017', '旧演示通过开关切换自动匹配，禁用状态待查'],
  upload: ['K-D08-002', '旧演示可选择文件并读取名称，上传传输和进度待查'],
  form: ['K-D04-045', '旧演示以客户名和电话组成表单，校验必填后模拟保存'],
  button: ['K-D01-001', '旧演示展示保存、取消和禁用，覆盖点击事件及状态'],
  modal: ['K-D07-001', '旧入口打开新增客户弹窗，并提供取消与校验'],
  'confirm-dialog': ['K-D07-003', '旧演示支持确认及取消模拟删除，异步确认待查'],
  tooltip: ['K-D07-013', '旧按钮使用原生 title 给出订单编号说明，键盘行为待查'],
  pagination: ['K-D03-008', '旧演示前后翻页并显示当前页，直达页及每页数量待查'],
  accordion: ['K-D03-018', '旧演示用原生 details 分组展开材料和安装要求'],
  badge: ['K-D01-013', '旧演示用文本和颜色区分订单状态，数量样式待查'],
  alert: ['K-D06-003', '旧演示持续显示金额待核对提示，并可标记已处理'],
  toast: ['K-D06-004', '旧演示触发成功或错误轻提示'],
  'empty-state': ['K-D06-009', '旧演示显示无结果和重试入口，与 empty-search 共用分支'],
  skeleton: ['K-D06-011', '旧演示将骨架占位切换为加载后的记录提示'],
  progress: ['K-D06-013', '旧演示更新百分比和进度条宽度'],
  typography: ['K-D01-009', '旧演示对照标题、正文及辅助信息字号，可切换字重'],
  icon: ['K-D01-010', '旧演示展示图标形状及尺寸，操作语义待查'],
  divider: ['K-D01-016', '旧演示用横向 hr 分开客户、订单和付款信息'],
  spinner: ['K-D06-012', '旧演示可暂停或启动无百分比的旋转指示器'],
  'kanban-board': ['K-D12-001', '旧演示按订单状态展示卡片并提供推进按钮，跨列拖动待查'],
  slider: ['K-D04-038', '旧演示用 range 控件调节不透明度，覆盖单值范围'],
  password: ['K-D04-004', '旧演示切换密码输入的显隐，规则校验待查'],
  combobox: ['K-D04-021', '旧演示结合文本输入和原生建议列表，专属键盘交互待查'],
  currency: ['K-D04-010', '旧演示使用两位小数步长的元金额输入及货币显示'],
  popover: ['K-D07-011', '旧演示点击按钮展开操作区，精确定位和关闭规则待查'],
  'bottom-sheet': ['K-D07-010', '旧演示打开底部选项层，手势和高度调整待查'],
  'toggle-group': ['K-D04-018', '旧演示切换选中的状态按钮，与 segmented 共用分支，多选待查'],
  rating: ['K-D01-017', '旧演示提供五个星级按钮，半星及只读待查'],
  'activity-log': ['K-D05-007', '旧演示列出时间、操作角色及活动文字，新增记录和追溯待查'],
  carousel: ['K-D05-011', '旧演示前后切换画面序号，真实媒体及自动播放待查'],
  avatar: ['K-D01-011', '旧演示以姓氏首字显示身份占位，图片失败处理待查'],
  'color-picker': ['K-D04-041', '旧演示通过原生颜色控件预览 HEX 颜色，RGB 和透明度待查'],
  'inline-error': ['K-D06-018', '旧演示给出必填错误并更新 aria-invalid，错误描述关联待查'],
  approval: ['K-D12-006', '旧演示可通过或驳回待审核订单，完整发起与审查条件待查']
};

const sameNameExclusions = {
  'file-drop': ['K-D08-003', '旧演示与 Upload 共用原生选择框，代码里没有文件拖放处理'],
  'context-menu': ['K-D07-014', '旧演示通过普通按钮打开菜单，缺少目标对象的右键触发及坐标'],
  command: ['K-D03-012', '旧演示只能按词筛选命令文字，缺少命令执行路径'],
  'virtual-list': ['K-D05-026', '旧演示一次渲染 30 条再局部滚动，缺少随滚动改变渲染窗口的机制'],
  'skip-link': ['K-D15-008', '旧锚点 #v8Outcome 会进入旧路由的首页回退分支，无法保留当前页并跳到目标']
};

function renderCaseLines(text, signature) {
  const lines = text.split(/\r?\n/);
  const start = lines.findIndex(line => line.startsWith(signature));
  assert.notEqual(start, -1, signature);
  const end = lines.findIndex((line, index) => index > start && /^\s*default:/.test(line));
  assert.ok(end > start, `${signature} default branch`);
  const result = new Map();
  for (let index = start + 1; index < end; index++) {
    // Adjacent case labels share a branch. Ignore code after the first non-label.
    const labels = lines[index].match(/^\s*(?:case '[a-z0-9-]+':\s*)+/)?.[0] ?? '';
    for (const [, id] of labels.matchAll(/case '([a-z0-9-]+)':/g)) {
      assert.ok(!result.has(id), `Duplicate render branch: ${id}`);
      result.set(id, index + 1);
    }
  }
  return result;
}

const rootCases = renderCaseLines(snapshots.app.toString('utf8'), 'function renderDemo(c)');
const sharedCases = renderCaseLines(snapshots.demos.toString('utf8'), 'function render(c)');
const englishKey = text => text.normalize('NFKC').toLowerCase().replace(/[^a-z0-9]/g, '');
const englishTitle = text => text.split(/[\u3400-\u9fff]/, 1)[0];
const page = 'https://super-pu921.github.io/ad-factory-learning/';
const cell = value => String(value).replaceAll('|', '\\|').replace(/\r?\n/g, ' ');
const refs = values => values.length ? values.map(id => `\`${id}\``).join('、') : '—';

function sourceReference(id) {
  const entry = knowledge.get(id);
  assert.ok(entry && knowledge.has(entry.canonicalId), `Unknown source entry: ${id}`);
  assert.ok(sourceLines[entry.sourceLine - 1]?.startsWith(`| ${id} |`), `Wrong source line: ${id}`);
  const canonical = knowledge.get(entry.canonicalId);
  const topic = teaching.get(canonical.id);
  if (topic) assert.equal(topic.title, canonical.name, `Teaching title drift: ${canonical.id}`);
  return `[${cell(entry.name)}](../${files.source}?plain=1#L${entry.sourceLine})` +
    `（\`${entry.id}\`${entry.id === canonical.id ? '' : ` → \`${canonical.id}\``}）` +
    (topic ? ` · [演示](${page}knowledge-catalog/#${canonical.id}/L1)` : ' · 待教学输入');
}

const rows = [];
const targetSources = new Map();
const counts = { behavioral: 0, nameOnly: 0, excluded: 0, unresolved: 0 };
const evidenceLabels = { behavioral: '演示行为', nameOnly: '仅题名', excluded: '机制不符', unresolved: '待补证' };
for (const [index, component] of components.entries()) {
  const { id, en, name, category } = component;
  const root = rootCases.get(id);
  const line = root ?? sharedCases.get(id);
  assert.ok(line, `No explicit legacy render branch: ${id}`);
  const demoFile = root ? files.app : files.demos;
  const matches = inventory.filter(entry => englishKey(englishTitle(entry.name)) === englishKey(en));
  const manual = Object.hasOwn(behavioralReferences, id) ? behavioralReferences[id] : null;
  const question = Object.hasOwn(openQuestions, id) ? openQuestions[id] : null;
  const comparison = Object.hasOwn(nameReviews, id) ? nameReviews[id] : null;
  const exclusion = Object.hasOwn(sameNameExclusions, id) ? sameNameExclusions[id] : null;
  const decision = comparison ?? exclusion;
  if (decision) assert.ok(matches.some(entry => entry.id === decision[0]), `Reviewed source title drift: ${id}`);
  let proposals = [];
  let evidence = 'unresolved';
  let note = question ?? '未发现同名条目，需补充语义依据';
  if (manual || comparison) {
    proposals = manual ? manual[0] : [comparison[0]];
    evidence = 'behavioral';
    note = (manual ?? comparison)[1];
  } else if (exclusion) {
    evidence = 'excluded';
    note = exclusion[1];
  } else if (!question && matches.length) {
    proposals = matches.map(entry => entry.id);
    evidence = 'nameOnly';
    note = '英文题名相符，实际职责、状态及交互待核验';
  }
  counts[evidence]++;
  for (const entryId of proposals) {
    const target = knowledge.get(entryId)?.canonicalId;
    assert.ok(target, `Unknown proposed knowledge ID: ${entryId}`);
    if (!targetSources.has(target)) targetSources.set(target, new Set());
    targetSources.get(target).add(id);
  }
  const reverse = lessons.filter(lesson => (lesson.relatedComponents ?? []).includes(id)).map(lesson => lesson.id);
  const demo = `[${demoFile}:${line}](../${demoFile}#L${line})`;
  rows.push([`[${cell(name)} · ${cell(en)}](${page}index.html#/components/detail/${id})`,
    `\`${id}\` · ${category}`, index, demo, refs(component.relatedLessons ?? []), refs(reverse),
    refs(component.relatedScenes ?? []), refs(component.referenceIds ?? []),
    exclusion ? `对照 ${sourceReference(exclusion[0])}` : proposals.map(sourceReference).join('<br>') || '—', evidenceLabels[evidence], cell(note)]);
}

assert.equal(rows.length, 88);
assert.equal(new Set(components.map(component => component.id)).size, rows.length);
const reviewedIds = [behavioralReferences, openQuestions, nameReviews, sameNameExclusions].flatMap(Object.keys);
assert.equal(new Set(reviewedIds).size, reviewedIds.length, 'Each old component may have one review decision');
assert.ok(reviewedIds.every(id => components.some(component => component.id === id)));
const sharedTargets = [...targetSources].filter(([, sources]) => sources.size > 1).sort(([a], [b]) => a.localeCompare(b));
const output = [
  '# P7 旧组件候选知识关联核对', '',
  `覆盖 ${rows.length} 个旧组件。${counts.behavioral} 个有演示行为依据，${counts.excluded} 个因关键机制不符排除同名关联，${counts.unresolved} 个待补证，${counts.nameOnly} 个仅有英文题名线索。`,
  '全部为 `UNVERIFIED`。已核验正式映射 0 项。生产迁移 `BLOCKED`。', '',
  '“演示行为”说明静态代码与目标描述有可核对的重叠。“机制不符”行保留对照目标，排除该候选关联。“仅题名”提供人工查找线索。',
  '本表为逐项源码核对，线上对照测试另附验收报告。',
  '正向课号来自组件的 `relatedLessons`，反向课号来自课程的 `relatedComponents`。课号、场景与参考来源保留原方向。',
  '`components` 下标用于定位静态证据，组件身份以旧 ID 为准。正式对应关系需审查真实职责、覆盖边界、版本、映射组及签核记录。', '',
  '## 共享候选目标', '',
  '| 目录主 ID | 旧组件 ID |', '| --- | --- |',
  ...sharedTargets.map(([target, sources]) => `| \`${target}\` | ${refs([...sources])} |`), '',
  '共享目标待复核课程、交互及历史身份后再确定映射组。', '',
  '## 逐项证据', '',
  '| 旧组件 | 旧 ID / 分类 | `components` 下标 | 演示源码 | 正向课号 | 反向课号 | 场景 ID | 参考来源 ID | 候选或对照知识 | 依据 | 审查说明 |',
  '| --- | --- | ---: | --- | --- | --- | --- | --- | --- | --- | --- |',
  ...rows.map(row => `| ${row.join(' | ')} |`), '',
  '## 静态输入快照', '',
  '| 文件 | SHA-256 |', '| --- | --- |',
  ...Object.entries(files).map(([key, path]) => `| [${path}](../${path}) | \`${inputHash(key)}\` |`), '',
  '`data.json` 与目录原文按原始字节计算。其余源码和清单统一用 LF 计算，以兼容 Windows Git 检出。', '',
  '在仓库根目录用 Node 22 执行 `node scripts/review-v8-legacy-components.mjs` 可将核对表输出到标准输出。',
  '运行 `node scripts/review-v8-legacy-components.mjs --check` 可比较生成内容与本表。工具只读取上表中的版本库静态文件和本表。', ''
].join('\n');

if (process.argv.length === 2) {
  process.stdout.write(output);
} else if (process.argv.length === 3 && process.argv[2] === '--check') {
  const checked = read('docs/V8-LEGACY-COMPONENT-REVIEW.md').toString('utf8').replace(/\r\n/g, '\n');
  assert.ok(checked === output, 'Legacy component evidence is stale; regenerate and review the report');
  console.log(`P7 review PASS: ${rows.length} legacy sources, ${counts.behavioral} behavioral, ${counts.excluded} mechanism exclusions, ${counts.nameOnly} name-only, ${counts.unresolved} unresolved, ${sharedTargets.length} shared targets, zero verified mappings. Migration BLOCKED.`);
} else {
  throw new Error('Usage: node scripts/review-v8-legacy-components.mjs [--check]');
}
