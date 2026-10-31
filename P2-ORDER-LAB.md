# V8 P2.1 · 订单列表完整交互

## 范围与基线

- 原课程 90 门、组件 88 个、ERP 场景 6 个和已上线 6 项实训保持原样。
- 本次新增 **1 个六步交互实训**：订单号搜索、状态筛选、组合筛选、清空条件、筛选状态下分页、详情抽屉与上下文保持。
- 使用 12 条虚构订单，3 条/页；没有订单 API，不修改价格规则、材料阈值、权限和实际生产状态。
- 存储键：\`adFactoryLearning.v8.order-lab\`。不写入 \`adFactoryLearning.v8.production\`、\`adFactoryLearning.v8.practice.missions\`。
- 入口：「组件 → 订单列表组合实训」；关联 Table、Search、Filter Builder、Pagination、Drawer、Descriptions、Badge 组件；关联第 50、51、56、59、79 课。
- 开发分支：\`v8-p2-order-lab-20261031\`；先验收，正式合并需另行确认。

## 功能校验

1. 输入 \`S-1008\`，唯一命中；无效关键词不能通过。
2. 清空关键词，筛选 \`生产中\`，命中 6 条。
3. 同时选中 \`生产中\` 和关键词 \`示例广告\`，命中 3 条。
4. 清空条件后共 12 条、第一页。
5. 再选 \`生产中\`，进入第二页，状态保持不变。
6. 打开当前页订单详情，对应订单编号、客户、产品正确；通过关闭按钮或 Esc 关闭，仍在第二页，且状态保持不变。

## 数据与交互风险

- 所有数据是假订单，不涉及任何实际客户或薪资。
- 不自动套用广告字的面积/最长边规则，订单金额不出现。
- iPhone 搜索框字号至少 16px，避免键盘激活时页面自动放大。
- 表格仅在内部滚动；页面本身不可出现横向溢出。
- 实训完成记录只保存本地，不默认同步云端。
- QA 目录须使用三种独立键，禁止注册 Service Worker。

## 验证与回退

PowerShell（仓库根目录）：

~~~powershell
node --check app.js
node --check order-lab.js
node --check demos.js
node --check missions.js
node scripts/test-v8-order-lab.mjs
node scripts/test-v8-missions.mjs
node scripts/validate-v8-knowledge.mjs
~~~

验收窗口：375px、390px、1440px；测试搜索输入、键盘、状态筛选、抽屉关闭和持久化。任何未实际执行的测试必须标为未验证。

回退：合并前只需删除独立分支/关闭 PR；正式发布后通过 revert 该 PR 的合并提交或重新部署稳定提交，不删除已有学习进度。
