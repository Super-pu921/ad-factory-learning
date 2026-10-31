# V8 知识升级 · 独立测试站

- 测试网址：https://super-pu921.github.io/ad-factory-learning/v8-knowledge-qa/
- 从 PR #3 的分支 `v8-knowledge-upgrade-2026-10-31` 截取的测试副本；正式版根目录资源保持不变。
- 测试使用独立 localStorage 键：`adFactoryLearning.v8.knowledge.qa`，不覆盖正式版 `adFactoryLearning.v8.production`。仍可只读复制旧的 `adFactoryLearning.v2` 记录。
- 本测试页不注册 Service Worker，不提供安装入口，不依赖单独的 PWA manifest。
- 测试工作可使用页面内收藏、测验、笔记、演示；这些写入均在独立命名空间与模拟数据中，不会修改正式网站学习记录。
- 先测试：第53、57、62、80、89课 → 组件 Modal/Table/Combobox/Formula Builder 的说明、Codex 和演示 → 全局搜索 → 手机 375px 排版。
- 验收通过后再决定是否合并 PR #3。网站 `main` 正式首页、`app.js`、`data.json`、`styles.css`、`demos.js`、`sw.js` 均未修改。
