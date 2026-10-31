# P2.1 · 订单列表完整交互实训

## 目标
通过真实操作练习订单列表中的关键词搜索、状态筛选、组合筛选、重置、分页与详情抽屉。该任务是教学模拟，不是正式 ERP 功能。

## 入口
- 实战 → 进阶交互实训 → P2.1
- 实战 → 订单列表场景 → 开始完整交互实训

## 六个验收步骤
1. 搜索“示例客户A”，显示 2 条。
2. 清空关键词，筛选“生产中”，显示 5 条。
3. 筛选“待生产”并搜索“示例客户A”，显示 2 条。
4. 重置条件，恢复 12 条样本并回到第 1 页。
5. 筛选“生产中”并进入第 2 页，显示剩余 2 条且保留筛选。
6. 打开当前页订单详情，核对订单号与客户，关闭后保留第 2 页和筛选条件。

## 数据边界
- 12 条订单全部为虚构教学样本，客户使用“示例客户 A-F”。
- 状态只使用既有场景中的“待生产、生产中、已完成”显示值；本实训不提供状态修改。
- 不包含订单金额、材料阈值、单价、生产转移或真实客户资料。
- 订单数据为 JS 常量，不写入原有 ERP 模拟场景数据。

## 数据隔离
- P2.1 独立记录键：\`adFactoryLearning.v8.practice.p2.order-list\`
- 不读写 \`adFactoryLearning.v8.production\`。
- 不读写 \`adFactoryLearning.v8.practice.missions\`。
- 保存搜索、状态、页码、六步完成状态和反馈；不保存真实业务数据。

## 修改范围
- 新增 \`p2.js\` 和 P2.1 自动化测试。
- 修改 \`app.js\` 路由与事件委托、\`index.html\` 脚本加载、\`styles.css\` 页面样式、\`sw.js\` 静态资源缓存。
- 新增专属 GitHub Actions 工作流。
- 保留 90 课、88 组件、6 个 ERP 场景及 P0 六项实训。

## 验证
\`\`\`powershell
node --check app.js
node --check demos.js
node --check missions.js
node --check p2.js
node --check sw.js
node scripts/validate-v8-knowledge.mjs
node scripts/test-v8-missions.mjs
node scripts/test-p2-order-list.mjs
\`\`\`

验收视口：375px、390px、1440px。手机端使用订单卡片，桌面端使用表格；输入字号至少 16px，详情抽屉支持关闭按钮、遮罩点击与 Escape 键。

## 发布边界
只提交到 \`v8-p2-1-order-list-2026-10-31\`。不合并 main、不部署正式站点、不开始 P2.2。经独立 QA 与用户确认后再决定下一阶段。
