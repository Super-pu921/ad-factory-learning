# V8 软件开发学习工作台 · 分层交互骨架预览

此目录为 **独立 V8 原型**，不覆盖仓库根目录正式学习手册，也不替换任何 V7 预览文件。

## 使用

部署在 GitHub Pages `/v8-preview/` 目录；访问 `https://super-pu921.github.io/ad-factory-learning/v8-preview/`。

- 首页：`#/home`，点击左上角品牌返回首页。
- 四个主模块：学习、组件、实战、我的。
- 独立路由示例：`#/learn/lesson/49`、`#/components/detail/modal`、`#/practice/scenario/customers`。
- 使用 hash 路由以支持 GitHub Pages 直接打开深层链接，不依赖服务器 404 回退。

## 阶段范围

- 从 V7 内容中保留真实示例 **10 节课程、12 个组件、3 个 ERP 场景**，暂不迁移其他条目。
- V7 的完整资料来源依然保留 **90 课、88 组件、6 场景**；样本进度与全量进度不应混淆。
- 独立本地存储：`adFactoryLearning.v8.skeleton`，不读取 V4、V6、V7 数据。
- 场景 Demo 全部为前端模拟，不会写入 ERP 或云端。

## 技术文件

- `index.html`：页面骨架及导航
- `styles.css`：响应式样式、分层布局
- `app.js`：hash 路由、页面模板、交互演示、状态、数据导入导出
- `data.json`：从原有 V7 内容抽取的真实样本数据

本阶段不添加框架构建依赖，以降低验证阻力。结构经确认后再决定是否迁移到 Vite + React + TypeScript。

## 重点验收

1. PC / 手机四大主模块路径清楚，页面不是单页滚动定位。
2. 组件搜索 Modal → 进入详情，Demo 首屏可见，返回后检索词保留。
3. 新增客户弹窗 Tab 焦点不逃逸、Escape 关闭并恢复触发按钮。
4. 课程章节 → 单课 → 小测验 → 返回，浏览器前进后退可用。
5. ERP 客户模拟新增、报价计算演示及订单筛选可操作。
6. 手机 360px/390px 与电脑 1440px 无页面级横向溢出。
7. 刷新后 V8 本地收藏、笔记和答题进度仍存在；不影响正式版数据。
8. 部署后分别实测 GitHub Pages HTTP 200 与页面交互，真实 iPhone Safari 由用户验收。

## 回退

只需删除或停止发布 `/v8-preview/` 目录。生产根目录无需修改。
