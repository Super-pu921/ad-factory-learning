# P2.4 客户 → 报价 → 订单组合实战（开发分支）
- 教学独立数据库：`adFactoryLearning.v8.customer-order-lab` 版本 1。
- 独立进度：`adFactoryLearning.v8.customer-order-lab.progress`。
- 后续 QA 预览目录 `/v8-p24-qa/` 使用 `.qa` 数据库及进度键，当前阶段尚未生成 QA 目录。
- 对象仓库 customers(customerId), quotes(quoteId, customerId index), orders(orderId, quoteId unique index)。
- 八步：创建客户 → 拒绝缺失客户 → 拒绝非法数量 → 创建报价 → 查询客户与报价 → 注入重复订单主键引发 ConstraintError 自动回滚 → 原子转单 → 拒绝重复并真实刷新验证。
- 报价不计算金额；状态 ready/converted 和 created 都是虚构教学值。
- 使用同一个 IndexedDB 事务提交报价转换与订单创建；成功以 transaction.oncomplete 为准。失败后再次读取三仓库进行判分。
- 重置前必须确认；只删除当前教学数据库及当前进度，其他 V8 记录不处理。
- 本地 IndexedDB 不跨设备同步；现有 V8 JSON 备份不包含该数据库。

## 验证命令
```powershell
node --check customer-order-lab.js
node --check app.js
node --check sw.js
node scripts/validate-v8-knowledge.mjs
node scripts/test-v8-missions.mjs
node scripts/test-v8-order-lab.mjs
node scripts/test-v8-bulk-lab.mjs
node scripts/test-v8-transaction-lab.mjs
node scripts/test-v8-customer-order-lab.mjs
# 启动本地 HTTP 服务后：
node scripts/test-v8-transaction-lab-browser.mjs
node scripts/test-v8-customer-order-lab-browser.mjs
```

GitHub Actions: `.github/workflows/v8-p24-customer-order-lab-qa.yml`，包括 Node、Chromium 和 WebKit；**不代表真实 iPhone Safari 实机测试**。

## 修改边界与回退
仅新增 P2.4 模块、测试、工作流及本说明；仅在 `app.js`、`index.html`、`styles.css`、`sw.js` 做最小接入。不修改 `data.json`、旧模块、真实 ERP 或旧进度键。

开发分支 `v8-p24-customer-order-lab-20261101` 源于 `main` `b1354f03ce90d6281a12cf5cf922bb4243a4843a`。本阶段不合并、不发布、不创建 QA 预览。分支有问题可直接废弃本分支，主分支不受影响。
