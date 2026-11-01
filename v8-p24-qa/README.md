# V8 P2.4 · 独立 QA 预览

- **项目**：软件开发学习工作台（不是实际广告 ERP）。
- **入口（开发分支内）**：`v8-p24-qa/index.html#/components/customer-order-lab`。
- **状态**：本目录首先提交到 `v8-p24-customer-order-lab-20261101`；正式 `main` 与 GitHub Pages 尚未发布此目录。
- 独立存储：`adFactoryLearning.v8.p24.qa`（课程）；`adFactoryLearning.v8.practice.missions.p24.qa`、`adFactoryLearning.v8.order-lab.p24.qa`、`adFactoryLearning.v8.bulk-lab.p24.qa`、`adFactoryLearning.v8.transaction-lab.p24.qa` / `adFactoryLearning.v8.transaction-lab.progress.p24.qa`；P2.4 `adFactoryLearning.v8.customer-order-lab.qa` 及同名前缀 `.progress`。
- 本目录独立复制入口与学习相关 JS/JSON/CSS，不注册 Service Worker，不写入正式存储键。
- 本目录内的 P2.4 副本强制使用 `.qa` 数据库，不依赖目录名称；即使将预览 ZIP 单独解压、在根路径启动，也不会写入正式 P2.4 数据库。
- 顶部显示 QA 标识；所有业务记录均为虚构教学数据，不接入正式 ERP。
- **重要**：浏览器内的 QA 数据不会包含在原 V8 JSON 备份中；单独清理本练习仅删除 P2.4 QA 数据库与 P2.4 QA 进度。
- QA 自动测试使用 GitHub Actions 本地 HTTP 服务和 Chromium/WebKit；没有完成真实 iPhone Safari 实机测试。
- **不得将该测试目录误认为已公开部署**；需要正式站访问须另行评审批准并部署。

## 在 Windows PowerShell 本地预览

1. 从本次 GitHub Actions 成功任务下的 `v8-p24-qa-preview` 下载 ZIP，并解压到独立空文件夹。
2. PowerShell 切换到解压后的 `index.html` 所在文件夹。
3. 有 Python 时运行 `py -m http.server 8765`（或者 `python -m http.server 8765`）。
4. 浏览器打开 `http://localhost:8765/index.html#/components/customer-order-lab`。
5. 仅用于本地人工验收，使用虚构名字和数据；不要通过 `file://` 直接打开。

如需要从 Git 仓库本身运行 QA，则在仓库根目录启动相同 HTTP 服务，访问 `http://localhost:8765/v8-p24-qa/index.html#/components/customer-order-lab`。

注：此 ZIP 是测试预览资源，不是已部署的公网服务。正式发布仍需另行确认。
