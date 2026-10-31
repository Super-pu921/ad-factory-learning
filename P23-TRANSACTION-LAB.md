# V8 P2.3 数据关联与事务回滚实训

## 功能范围

在原生 IndexedDB 中建立独立教学数据库 `adFactoryLearning.v8.transaction-lab`，含 `materials` 和 `movements` 两个对象仓库，以 `materialId` 关联物料和出库流水，`requestId` 是唯一请求号。

六步真实实训：
1. A-01 库存 12 件，流水 0 条；
2. OUT-001 出库 4 件；库存 8 件、流水 1 条；
3. 尝试出库 20 件，拒绝且数据保持 8/1；
4. 库存写入之后故意使用重复的 OUT-001 流水主键触发 ConstraintError，整个 readwrite 事务自动回滚，保持 8/1；
5. OUT-002 出库 2 件，得到 6/2；
6. 重复 OUT-002 请求不再扣库存，仍为 6/2。

只修改虚构教学数据，不连接 ERP 服务、客户资料或任何生产数据库。没有定义实际材料出库业务、审批权限、计价或物料阈值。

学习进度独立存储 `adFactoryLearning.v8.transaction-lab.progress`，不修改历史 90 课、88 组件、6 场景、六项基础实训、P2.1 与 P2.2 学习存储键。

关联课程：30、49、50、51、53、62、80。联系组件：Table、Undo、Editable Table、Validation、Confirm Dialog、Approval。

## 注意事项

- 这演示的是浏览器本地 IndexedDB 原子事务，不等同于云端/跨设备事务。清空浏览器数据会移除教学库存和进度。
- 回滚发生在事务尚未提交时；P2.2 的撤销发生在操作完成后。两种概念不应混淆。
- 本地用户若同时打开多个教学标签页，可能出现进度与数据不一致，页面应提示手动重置本练习，不能静默篡改其他学习数据。
- 不导入或修改真实广告加工 ERP 的数据。
- 回退方式：本分支未合并前关闭 Draft PR 即可；正式合并需另行确认。

## 验证（PowerShell）

```powershell
node --check transaction-lab.js
node --check app.js
node --check sw.js
node scripts/test-v8-transaction-lab.mjs
node scripts/test-v8-missions.mjs
node scripts/test-v8-order-lab.mjs
node scripts/test-v8-bulk-lab.mjs
node scripts/validate-v8-knowledge.mjs
```

GitHub Actions 另外使用 Playwright Chromium / WebKit 验证全部六步、真正的 IndexedDB 回滚、失败后刷新、重复请求与重置、手机视口 375px/390px 和桌面 1440px 横向溢出。
