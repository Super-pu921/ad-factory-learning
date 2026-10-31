# V8 P2.2：批量选择、危险操作确认与撤销实训

## 已确认范围
本次只新增 **1 项教学实训，6 个步骤，8 条虚构订单**，与现有 90 课程、88 组件、6 ERP 场景、原有六项业务实训和 P2.1 订单查询实训并存。

功能训练：
1. 精准勾选两条；
2. 跨页保留所选，并只全选当前第二页四条；
3. 取消一条，准确留下五条；
4. 在危险操作对话框选择取消，确保零修改；
5. 输入 **确认归档 5** 才能提交模拟操作；错误词被拒绝，同一批次不能重复提交；
6. 撤销五条模拟归档，并保留演示操作日志。

注意：**「归档」完全是教学模拟**，不建立 ERP 正式订单的归档、删除或批量生产业务规则。不访问任何真实订单、API 或数据库。

## 访问与状态
- 组件目录「批量操作安全实训」
- 关联组件：bulk-actions、checkbox、confirm-dialog、undo、toast、table
- 关联课程：15、30、57、58、62、80、86
- 独立存储：\`adFactoryLearning.v8.bulk-lab\`
- 严禁改动原有的 \`adFactoryLearning.v8.production\`、\`adFactoryLearning.v8.practice.missions\`、\`adFactoryLearning.v8.order-lab\`。

## 验证（PowerShell）
\`\`\`powershell
node --check bulk-lab.js
node --check app.js
node scripts/test-v8-bulk-lab.mjs
node scripts/test-v8-missions.mjs
node scripts/test-v8-order-lab.mjs
node scripts/validate-v8-knowledge.mjs
\`\`\`

GitHub Actions 自动安装 Playwright Chromium + WebKit，运行模拟手机和桌面端点击、勾选、取消、确认与撤销流程。验收包括 375/390/1440px 无页面横向溢出（表格内部允许滚动）。

## 交付与回退
独立分支：\`v8-p22-bulk-safety-20261031\`。正式合并前需先通过 CI 与独立 QA 预览验收。出错可撤销本 PR 合并提交；没有正式数据迁移。服务工作线程单独升级缓存版本并加入本次新脚本，不清除用户的 localStorage 学习记录。
