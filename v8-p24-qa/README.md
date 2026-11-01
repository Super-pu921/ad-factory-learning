# V8 P2.4 · 独立 QA 预览

- **项目**：软件开发学习工作台（不是实际广告 ERP）。
- **入口（开发分支内）**：`v8-p24-qa/index.html#/components/customer-order-lab`。
- **状态**：本目录首先提交到 `v8-p24-customer-order-lab-20261101`；正式 `main` 与 GitHub Pages 尚未发布此目录。
- 独立存储：`adFactoryLearning.v8.p24.qa`（课程）；`adFactoryLearning.v8.practice.missions.p24.qa`、`adFactoryLearning.v8.order-lab.p24.qa`、`adFactoryLearning.v8.bulk-lab.p24.qa`、`adFactoryLearning.v8.transaction-lab.p24.qa` / `adFactoryLearning.v8.transaction-lab.progress.p24.qa`；P2.4 `adFactoryLearning.v8.customer-order-lab.qa` 及同名前缀 `.progress`。
- 本目录独立复制入口与学习相关 JS/JSON/CSS，不注册 Service Worker，不写入正式存储键。
- 顶部显示 QA 标识；所有业务记录均为虚构教学数据，不接入正式 ERP。
- **重要**：浏览器内的 QA 数据不会包含在原 V8 JSON 备份中；单独清理本练习仅删除 P2.4 QA 数据库与 P2.4 QA 进度。
- QA 自动测试使用 GitHub Actions 本地 HTTP 服务和 Chromium/WebKit；没有完成真实 iPhone Safari 实机测试。
- **不得将该测试目录误认为已公开部署**；需要正式站访问须另行评审批准并部署。
