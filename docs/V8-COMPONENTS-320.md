# V8 可运行教学组件清单：320 个主题 / 960 个单元

> 历史基线快照。当前清单见 [V8-COMPONENTS-CURRENT.md](V8-COMPONENTS-CURRENT.md)；本文件保留此前 320 项的交付口径。

清单快照：2026-11-13。本文件是内容与实现索引；整体验收及线上发布状态以本轮外部证据和最终验收报告为准。

“可运行教学组件”在本清单中指：原始知识目录的一个 canonical 永久 ID，对应一个有界、可交互、能够观察机制变化的本地教学实现，并配有 L1、L2、L3 三个教学单元。L1 认识并操作，L2 验证机制与边界，L3 完成小场景应用。同一机制服务三个教学目标，不把三个单元计成三个组件，也不表示已经建成生产级服务。

当前 320 个主题由原有 65 个教学主题、175 个基础扩展主题和 80 个高级扩展主题组成；原有 65 个的版本、内容哈希和单元元数据沿用原教学对象，本清单不重写其身份。

| 口径 | 数量 | 含义 |
| --- | ---: | --- |
| 原始目录条目 | 840 | 保留原始 ID 和七组已确认别名；目录收录不等于实施完成。 |
| 目录 canonical 主题 | 833 | 别名不重复计入主知识主题。 |
| 本清单可运行教学主题 | 320 | 每个 canonical ID 只列一次。 |
| 本清单分层教学单元 | 960 | 320 × 3，属于上述主题，不能再与主题相加。 |
| 其余未纳入本清单的 canonical 主题 | 513 | 当前分层教学覆盖状态为 NOT_IMPLEMENTED。 |
| 原站旧组件演示 | 88 | 独立的旧 Component 口径；未经权威映射，不与新 320 合并或据此去重。 |
| 正式迁移课程 | 0 | 教学内容建设不表示迁移已实施；productionMigration 仍为 BLOCKED。 |

840 个目录条目、320 个教学主题、960 个单元和 88 个旧演示属于不同统计口径，不能相加形成“已实现组件”总数。本文件不宣称全部 840 条已完成，不替换旧组件、课程或学习记录的 ID。

## 来源与直达链接

- 目录、原名、领域及 canonical 身份：[catalog.json](../knowledge-catalog/catalog.json)，来源原文为 [D01–D16 V1.0](../knowledge-catalog/source/D01-D16-V1.0.md)。
- 320 个主题、960 个单元及版本哈希：[teaching-manifest.json](../knowledge-catalog/teaching-manifest.json)，生成入口为 [build-v8-teaching-manifest.mjs](../scripts/build-v8-teaching-manifest.mjs)。
- 原有教学：[button-pilot.mjs](../knowledge-catalog/button-pilot.mjs)、[curriculum.mjs](../knowledge-catalog/curriculum.mjs)；基础扩展：[expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) 与 [expanded-basic-models.mjs](../knowledge-catalog/expanded-basic-models.mjs)；高级扩展：[expanded-advanced.mjs](../knowledge-catalog/expanded-advanced.mjs)；三层整合：[expanded-curriculum.mjs](../knowledge-catalog/expanded-curriculum.mjs)。
- 清单中的 L1/L2/L3 使用 `../knowledge-catalog/index.html#知识ID/层级`，与 [catalog-app.mjs](../knowledge-catalog/catalog-app.mjs) 的路由一致。需从仓库同源静态预览访问；源码平台可能显示 HTML 源文件，链接本身不代表该版本已经线上发布。

## 各领域数量

“未实施”仅指尚未建成本清单定义的目录分层教学，不据此断言旧站不存在同名或相近演示。

| 领域 | 教学主题 | 三层单元 | 目录 canonical 主题 | 未实施分层主题 |
| --- | ---: | ---: | ---: | ---: |
| D01 基础控件与视觉元素 | 22 | 66 | 22 | 0 |
| D02 页面布局与响应式 | 26 | 78 | 26 | 0 |
| D03 导航与页面组织 | 21 | 63 | 21 | 0 |
| D04 表单与数据输入 | 52 | 156 | 52 | 0 |
| D05 数据展示与高级数据表格 | 51 | 153 | 59 | 8 |
| D06 状态与系统反馈 | 28 | 84 | 39 | 11 |
| D07 弹层、浮层与复杂交互 | 4 | 12 | 30 | 26 |
| D08 文件、媒体与专业编辑器 | 4 | 12 | 60 | 56 |
| D09 图表与专业数据可视化 | 29 | 87 | 54 | 25 |
| D10 地图与地理可视化 | 14 | 42 | 32 | 18 |
| D11 流程图、节点与画布编辑 | 19 | 57 | 51 | 32 |
| D12 企业业务组件与工作流 | 4 | 12 | 70 | 66 |
| D13 多人协作与实时交互 | 4 | 12 | 44 | 40 |
| D14 AI / Agent 专题 | 4 | 12 | 85 | 81 |
| D15 无障碍、国际化与主题 | 4 | 12 | 62 | 58 |
| D16 工程化交互与系统运行模式 | 34 | 102 | 126 | 92 |
| 合计 | 320 | 960 | 833 | 513 |

## 教学能力与边界

- 实现操作限定在页面内的教学机制，主要使用固定虚构记录、手工输入及内存状态；原课程与真实学习记录不参与这些练习。教学目录的进度持久化状态为 NONE。
- 图表由输入数据派生实际 SVG 几何；地图是虚构平面坐标、矩形区域和有限路线算法，不提供地图瓦片、定位、路况或地球测量服务。画布、图和历史栈均为局部教学模型，不等于外部设计软件的完整编辑功能。
- JSON、CSV、TSV、Markdown、GeoJSON、日期、颜色与公式等均有各主题声明的有限格式或规模约束；简单公式使用明确白名单语法，不执行用户输入代码。文件选择主题只处理主动选择的文件元数据；文本/数据导出只涉及虚构教学内容，不代表任意真实文件导入导出或用户文件迁移已实现。
- 角色、审批、锁、版本、缓存、事务、协作、AI 工具调用与连接状态是可观察的本地教学规则。没有真实身份认证、生产权限系统、模型服务、跨设备协作或后端业务协议；本地计时、事件和队列不等于真实网络服务。
- 不从此清单推导生产数据迁移能力，不进行真实学习记录迁移；教学执行结果也不证明支付、订单、库存、财务或外部账户操作已实施。

## 未实施与缺资料状态

| 对象 | 状态 | 含义 |
| --- | --- | --- |
| K-D05-013 QR Code 二维码 | NOT_IMPLEMENTED | 尚未实现本目录的可运行分层教学；不是“因缺资料而已完成或跳过”。 |
| K-D05-014 Barcode 条形码 | NOT_IMPLEMENTED | 尚未实现真实编码机制及对应三层教学，不用静态图案或文本替换冒充。 |
| K-D12-026 Order QR Payment 聚合收款码 | NOT_IMPLEMENTED | 没有开发教学收款码组件，也没有接入真实收款渠道。 |
| 其余未列入的 canonical 主题 | NOT_IMPLEMENTED | 合计 513 个未覆盖主题，包含上述三个示例；不因目录有名称而标为已实现。 |
| PRD V1.3 原始资料 | SKIPPED_MISSING_INPUT | 缺少必需原始输入，不能补造其业务契约。 |
| P2.5 原始资料与验收输入 | SKIPPED_MISSING_INPUT | 保持缺资料状态，不以本地教学替代要求。 |
| P1.3 原始用户记录审计资料 | SKIPPED_MISSING_INPUT | 不读取用户浏览器或学习数据来凑齐证明，迁移前置条件未满足。 |
| 真实后端协议、身份与生产一致性契约 | SKIPPED_MISSING_INPUT | 本地有界模型不替代真实协议，未连接生产服务。 |
| D17 专业基础候选方向 | NOT_IN_SCOPE | 仍是未分配正式知识 ID 的候选方向；本轮不开发、不计数。 |
| 生产迁移 | BLOCKED | 缺失资料、权威映射及迁移前置条件未解除；静态和浏览器检查不能替代。 |

## 验收证据与结果使用

清单表示实现与教学内容可追溯，不给 320 个主题预写全局 PASS。逐项测试最终状态以本轮外部 `case-results.json` 和最终验收报告为准；尚未执行的引擎、宽度、层级或真实环境检查须保留未验证状态。

[test-v8-expanded-browser.mjs](../scripts/test-v8-expanded-browser.mjs) 按主题 ID、engine、width、level 记录场景结果。结果文件可能是分引擎或分宽度的局部产物；需结合执行范围、命令退出状态、失败信息和验收报告阅读，不能仅凭文件存在或局部 PASS 推断全部通过。原有 65 个教学主题另由既有教学回归与整合验收覆盖。

80 个高级扩展子任务已有实际阶段证据：[test-v8-expanded-advanced.mjs](../scripts/test-v8-expanded-advanced.mjs) 在 Node 22 完成 80 个已知值断言、80 个示例片段执行、80 个专属负例及 24 项边界检查；其独立 Chromium 容器完成 240 个 L1/L2/L3 场景、80 个 375px 窄屏检查，页面错误为 0，并验证 disposer。该证据来自子任务实际终端运行，不扩大为 320 个主题的最终整体验收或线上发布结论。

可复现的高级子任务命令（Node 22；浏览器依赖使用已有安装，不自动安装）：

```powershell
node scripts/test-v8-expanded-advanced.mjs
# 预先将 V8_PLAYWRIGHT_MODULE 指向现有 Playwright 安装
node scripts/test-v8-expanded-advanced.mjs --browser
```

## 完整 320 条清单

实现列给出实际演示入口及 kind；这是机制定位信息，不是逐项测试状态。各条目原名直接来自 canonical 目录。

### D01 基础控件与视觉元素（22 个主题）

| ID | 原名 | 领域 | 三层直达链接 | 实现 / kind |
| --- | --- | --- | --- | --- |
| K-D01-001 | Button 操作按钮 | D01 | [L1](../knowledge-catalog/index.html#K-D01-001/L1) · [L2](../knowledge-catalog/index.html#K-D01-001/L2) · [L3](../knowledge-catalog/index.html#K-D01-001/L3) | [catalog-app.mjs](../knowledge-catalog/catalog-app.mjs) · `button-pilot` |
| K-D01-002 | Icon Button 图标按钮 | D01 | [L1](../knowledge-catalog/index.html#K-D01-002/L1) · [L2](../knowledge-catalog/index.html#K-D01-002/L2) · [L3](../knowledge-catalog/index.html#K-D01-002/L3) | [curriculum-demos.mjs](../knowledge-catalog/curriculum-demos.mjs) · `icon` |
| K-D01-003 | Link 链接 | D01 | [L1](../knowledge-catalog/index.html#K-D01-003/L1) · [L2](../knowledge-catalog/index.html#K-D01-003/L2) · [L3](../knowledge-catalog/index.html#K-D01-003/L3) | [curriculum-demos.mjs](../knowledge-catalog/curriculum-demos.mjs) · `link` |
| K-D01-004 | Button Group 按钮组 | D01 | [L1](../knowledge-catalog/index.html#K-D01-004/L1) · [L2](../knowledge-catalog/index.html#K-D01-004/L2) · [L3](../knowledge-catalog/index.html#K-D01-004/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `visual-group` |
| K-D01-005 | Split Button 分裂按钮 | D01 | [L1](../knowledge-catalog/index.html#K-D01-005/L1) · [L2](../knowledge-catalog/index.html#K-D01-005/L2) · [L3](../knowledge-catalog/index.html#K-D01-005/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `visual-split` |
| K-D01-006 | Floating Action Button | D01 | [L1](../knowledge-catalog/index.html#K-D01-006/L1) · [L2](../knowledge-catalog/index.html#K-D01-006/L2) · [L3](../knowledge-catalog/index.html#K-D01-006/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `visual-fab` |
| K-D01-007 | Toggle Button 切换按钮 | D01 | [L1](../knowledge-catalog/index.html#K-D01-007/L1) · [L2](../knowledge-catalog/index.html#K-D01-007/L2) · [L3](../knowledge-catalog/index.html#K-D01-007/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `visual-toggle` |
| K-D01-008 | Toolbar 工具栏 | D01 | [L1](../knowledge-catalog/index.html#K-D01-008/L1) · [L2](../knowledge-catalog/index.html#K-D01-008/L2) · [L3](../knowledge-catalog/index.html#K-D01-008/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `visual-toolbar` |
| K-D01-009 | Typography 排版文字 | D01 | [L1](../knowledge-catalog/index.html#K-D01-009/L1) · [L2](../knowledge-catalog/index.html#K-D01-009/L2) · [L3](../knowledge-catalog/index.html#K-D01-009/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `visual-type` |
| K-D01-010 | Icon 图标 | D01 | [L1](../knowledge-catalog/index.html#K-D01-010/L1) · [L2](../knowledge-catalog/index.html#K-D01-010/L2) · [L3](../knowledge-catalog/index.html#K-D01-010/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `visual-icon` |
| K-D01-011 | Avatar 头像 | D01 | [L1](../knowledge-catalog/index.html#K-D01-011/L1) · [L2](../knowledge-catalog/index.html#K-D01-011/L2) · [L3](../knowledge-catalog/index.html#K-D01-011/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `visual-avatar` |
| K-D01-012 | Avatar Group 头像组 | D01 | [L1](../knowledge-catalog/index.html#K-D01-012/L1) · [L2](../knowledge-catalog/index.html#K-D01-012/L2) · [L3](../knowledge-catalog/index.html#K-D01-012/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `visual-avatars` |
| K-D01-013 | Badge 状态徽标 | D01 | [L1](../knowledge-catalog/index.html#K-D01-013/L1) · [L2](../knowledge-catalog/index.html#K-D01-013/L2) · [L3](../knowledge-catalog/index.html#K-D01-013/L3) | [curriculum-demos.mjs](../knowledge-catalog/curriculum-demos.mjs) · `badge` |
| K-D01-014 | Chip / Tag 标签 | D01 | [L1](../knowledge-catalog/index.html#K-D01-014/L1) · [L2](../knowledge-catalog/index.html#K-D01-014/L2) · [L3](../knowledge-catalog/index.html#K-D01-014/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `visual-chip` |
| K-D01-015 | Label 字段标签 | D01 | [L1](../knowledge-catalog/index.html#K-D01-015/L1) · [L2](../knowledge-catalog/index.html#K-D01-015/L2) · [L3](../knowledge-catalog/index.html#K-D01-015/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `visual-label` |
| K-D01-016 | Divider 分隔线 | D01 | [L1](../knowledge-catalog/index.html#K-D01-016/L1) · [L2](../knowledge-catalog/index.html#K-D01-016/L2) · [L3](../knowledge-catalog/index.html#K-D01-016/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `visual-divider` |
| K-D01-017 | Rating 评分控件 | D01 | [L1](../knowledge-catalog/index.html#K-D01-017/L1) · [L2](../knowledge-catalog/index.html#K-D01-017/L2) · [L3](../knowledge-catalog/index.html#K-D01-017/L3) | [curriculum-demos.mjs](../knowledge-catalog/curriculum-demos.mjs) · `rating` |
| K-D01-018 | Color Swatch 色板 | D01 | [L1](../knowledge-catalog/index.html#K-D01-018/L1) · [L2](../knowledge-catalog/index.html#K-D01-018/L2) · [L3](../knowledge-catalog/index.html#K-D01-018/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `visual-swatch` |
| K-D01-019 | Keyboard Key 快捷键视觉 | D01 | [L1](../knowledge-catalog/index.html#K-D01-019/L1) · [L2](../knowledge-catalog/index.html#K-D01-019/L2) · [L3](../knowledge-catalog/index.html#K-D01-019/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `visual-key` |
| K-D01-020 | Inline Code 行内代码 | D01 | [L1](../knowledge-catalog/index.html#K-D01-020/L1) · [L2](../knowledge-catalog/index.html#K-D01-020/L2) · [L3](../knowledge-catalog/index.html#K-D01-020/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `visual-code` |
| K-D01-021 | Theme Switch 主题切换 | D01 | [L1](../knowledge-catalog/index.html#K-D01-021/L1) · [L2](../knowledge-catalog/index.html#K-D01-021/L2) · [L3](../knowledge-catalog/index.html#K-D01-021/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `visual-theme` |
| K-D01-022 | Density Control 密度控制 | D01 | [L1](../knowledge-catalog/index.html#K-D01-022/L1) · [L2](../knowledge-catalog/index.html#K-D01-022/L2) · [L3](../knowledge-catalog/index.html#K-D01-022/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `visual-density` |

### D02 页面布局与响应式（26 个主题）

| ID | 原名 | 领域 | 三层直达链接 | 实现 / kind |
| --- | --- | --- | --- | --- |
| K-D02-001 | Container 容器 | D02 | [L1](../knowledge-catalog/index.html#K-D02-001/L1) · [L2](../knowledge-catalog/index.html#K-D02-001/L2) · [L3](../knowledge-catalog/index.html#K-D02-001/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `layout-container` |
| K-D02-002 | Box 盒模型容器 | D02 | [L1](../knowledge-catalog/index.html#K-D02-002/L1) · [L2](../knowledge-catalog/index.html#K-D02-002/L2) · [L3](../knowledge-catalog/index.html#K-D02-002/L3) | [curriculum-demos.mjs](../knowledge-catalog/curriculum-demos.mjs) · `box` |
| K-D02-003 | Flex Layout 弹性布局 | D02 | [L1](../knowledge-catalog/index.html#K-D02-003/L1) · [L2](../knowledge-catalog/index.html#K-D02-003/L2) · [L3](../knowledge-catalog/index.html#K-D02-003/L3) | [curriculum-demos.mjs](../knowledge-catalog/curriculum-demos.mjs) · `flex` |
| K-D02-004 | Grid Layout 网格布局 | D02 | [L1](../knowledge-catalog/index.html#K-D02-004/L1) · [L2](../knowledge-catalog/index.html#K-D02-004/L2) · [L3](../knowledge-catalog/index.html#K-D02-004/L3) | [curriculum-demos.mjs](../knowledge-catalog/curriculum-demos.mjs) · `grid` |
| K-D02-005 | Stack 垂直布局 | D02 | [L1](../knowledge-catalog/index.html#K-D02-005/L1) · [L2](../knowledge-catalog/index.html#K-D02-005/L2) · [L3](../knowledge-catalog/index.html#K-D02-005/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `layout-stack` |
| K-D02-006 | Inline Layout 行内布局 | D02 | [L1](../knowledge-catalog/index.html#K-D02-006/L1) · [L2](../knowledge-catalog/index.html#K-D02-006/L2) · [L3](../knowledge-catalog/index.html#K-D02-006/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `layout-inline` |
| K-D02-007 | Cluster Layout 集群布局 | D02 | [L1](../knowledge-catalog/index.html#K-D02-007/L1) · [L2](../knowledge-catalog/index.html#K-D02-007/L2) · [L3](../knowledge-catalog/index.html#K-D02-007/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `layout-cluster` |
| K-D02-008 | Masonry 瀑布流 | D02 | [L1](../knowledge-catalog/index.html#K-D02-008/L1) · [L2](../knowledge-catalog/index.html#K-D02-008/L2) · [L3](../knowledge-catalog/index.html#K-D02-008/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `layout-masonry` |
| K-D02-009 | Aspect Ratio 比例容器 | D02 | [L1](../knowledge-catalog/index.html#K-D02-009/L1) · [L2](../knowledge-catalog/index.html#K-D02-009/L2) · [L3](../knowledge-catalog/index.html#K-D02-009/L3) | [curriculum-demos.mjs](../knowledge-catalog/curriculum-demos.mjs) · `aspect` |
| K-D02-010 | Split Layout 分栏布局 | D02 | [L1](../knowledge-catalog/index.html#K-D02-010/L1) · [L2](../knowledge-catalog/index.html#K-D02-010/L2) · [L3](../knowledge-catalog/index.html#K-D02-010/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `layout-split` |
| K-D02-011 | Splitter 分隔调整器 | D02 | [L1](../knowledge-catalog/index.html#K-D02-011/L1) · [L2](../knowledge-catalog/index.html#K-D02-011/L2) · [L3](../knowledge-catalog/index.html#K-D02-011/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `layout-splitter` |
| K-D02-012 | Resizable Panels 可调整面板 | D02 | [L1](../knowledge-catalog/index.html#K-D02-012/L1) · [L2](../knowledge-catalog/index.html#K-D02-012/L2) · [L3](../knowledge-catalog/index.html#K-D02-012/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `layout-resizable` |
| K-D02-013 | Scroll Area 滚动区域 | D02 | [L1](../knowledge-catalog/index.html#K-D02-013/L1) · [L2](../knowledge-catalog/index.html#K-D02-013/L2) · [L3](../knowledge-catalog/index.html#K-D02-013/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `layout-scroll` |
| K-D02-014 | App Shell 应用框架 | D02 | [L1](../knowledge-catalog/index.html#K-D02-014/L1) · [L2](../knowledge-catalog/index.html#K-D02-014/L2) · [L3](../knowledge-catalog/index.html#K-D02-014/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `layout-shell` |
| K-D02-015 | Header 页面顶部区域 | D02 | [L1](../knowledge-catalog/index.html#K-D02-015/L1) · [L2](../knowledge-catalog/index.html#K-D02-015/L2) · [L3](../knowledge-catalog/index.html#K-D02-015/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `layout-header` |
| K-D02-016 | Footer 页面底部区域 | D02 | [L1](../knowledge-catalog/index.html#K-D02-016/L1) · [L2](../knowledge-catalog/index.html#K-D02-016/L2) · [L3](../knowledge-catalog/index.html#K-D02-016/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `layout-footer` |
| K-D02-017 | Sidebar 侧边栏 | D02 | [L1](../knowledge-catalog/index.html#K-D02-017/L1) · [L2](../knowledge-catalog/index.html#K-D02-017/L2) · [L3](../knowledge-catalog/index.html#K-D02-017/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `layout-sidebar` |
| K-D02-018 | Panel 内容面板 | D02 | [L1](../knowledge-catalog/index.html#K-D02-018/L1) · [L2](../knowledge-catalog/index.html#K-D02-018/L2) · [L3](../knowledge-catalog/index.html#K-D02-018/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `layout-panel` |
| K-D02-019 | Affix 固定定位 | D02 | [L1](../knowledge-catalog/index.html#K-D02-019/L1) · [L2](../knowledge-catalog/index.html#K-D02-019/L2) · [L3](../knowledge-catalog/index.html#K-D02-019/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `layout-affix` |
| K-D02-020 | Sticky Region 粘性区域 | D02 | [L1](../knowledge-catalog/index.html#K-D02-020/L1) · [L2](../knowledge-catalog/index.html#K-D02-020/L2) · [L3](../knowledge-catalog/index.html#K-D02-020/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `layout-sticky` |
| K-D02-021 | Portal 渲染门户 | D02 | [L1](../knowledge-catalog/index.html#K-D02-021/L1) · [L2](../knowledge-catalog/index.html#K-D02-021/L2) · [L3](../knowledge-catalog/index.html#K-D02-021/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `layout-portal` |
| K-D02-022 | Overlay Root 浮层根节点 | D02 | [L1](../knowledge-catalog/index.html#K-D02-022/L1) · [L2](../knowledge-catalog/index.html#K-D02-022/L2) · [L3](../knowledge-catalog/index.html#K-D02-022/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `layout-overlayroot` |
| K-D02-023 | Responsive Layout 响应式布局 | D02 | [L1](../knowledge-catalog/index.html#K-D02-023/L1) · [L2](../knowledge-catalog/index.html#K-D02-023/L2) · [L3](../knowledge-catalog/index.html#K-D02-023/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `layout-responsive` |
| K-D02-024 | Container Queries 容器查询 | D02 | [L1](../knowledge-catalog/index.html#K-D02-024/L1) · [L2](../knowledge-catalog/index.html#K-D02-024/L2) · [L3](../knowledge-catalog/index.html#K-D02-024/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `layout-query` |
| K-D02-025 | Dashboard Grid 仪表盘网格 | D02 | [L1](../knowledge-catalog/index.html#K-D02-025/L1) · [L2](../knowledge-catalog/index.html#K-D02-025/L2) · [L3](../knowledge-catalog/index.html#K-D02-025/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `layout-dashboard` |
| K-D02-026 | Safe Area Layout 安全区域布局 | D02 | [L1](../knowledge-catalog/index.html#K-D02-026/L1) · [L2](../knowledge-catalog/index.html#K-D02-026/L2) · [L3](../knowledge-catalog/index.html#K-D02-026/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `layout-safearea` |

### D03 导航与页面组织（21 个主题）

| ID | 原名 | 领域 | 三层直达链接 | 实现 / kind |
| --- | --- | --- | --- | --- |
| K-D03-001 | Breadcrumb 面包屑 | D03 | [L1](../knowledge-catalog/index.html#K-D03-001/L1) · [L2](../knowledge-catalog/index.html#K-D03-001/L2) · [L3](../knowledge-catalog/index.html#K-D03-001/L3) | [curriculum-demos.mjs](../knowledge-catalog/curriculum-demos.mjs) · `breadcrumb` |
| K-D03-002 | Anchor 锚点导航 | D03 | [L1](../knowledge-catalog/index.html#K-D03-002/L1) · [L2](../knowledge-catalog/index.html#K-D03-002/L2) · [L3](../knowledge-catalog/index.html#K-D03-002/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `nav-anchor` |
| K-D03-003 | Menu 菜单 | D03 | [L1](../knowledge-catalog/index.html#K-D03-003/L1) · [L2](../knowledge-catalog/index.html#K-D03-003/L2) · [L3](../knowledge-catalog/index.html#K-D03-003/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `nav-menu` |
| K-D03-004 | Menubar 菜单栏 | D03 | [L1](../knowledge-catalog/index.html#K-D03-004/L1) · [L2](../knowledge-catalog/index.html#K-D03-004/L2) · [L3](../knowledge-catalog/index.html#K-D03-004/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `nav-menubar` |
| K-D03-005 | Navigation Menu 导航菜单 | D03 | [L1](../knowledge-catalog/index.html#K-D03-005/L1) · [L2](../knowledge-catalog/index.html#K-D03-005/L2) · [L3](../knowledge-catalog/index.html#K-D03-005/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `nav-navigation` |
| K-D03-006 | Dropdown Menu 下拉菜单 | D03 | [L1](../knowledge-catalog/index.html#K-D03-006/L1) · [L2](../knowledge-catalog/index.html#K-D03-006/L2) · [L3](../knowledge-catalog/index.html#K-D03-006/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `nav-dropdown` |
| K-D03-007 | Tabs 标签页 | D03 | [L1](../knowledge-catalog/index.html#K-D03-007/L1) · [L2](../knowledge-catalog/index.html#K-D03-007/L2) · [L3](../knowledge-catalog/index.html#K-D03-007/L3) | [curriculum-demos.mjs](../knowledge-catalog/curriculum-demos.mjs) · `tabs` |
| K-D03-008 | Pagination 分页 | D03 | [L1](../knowledge-catalog/index.html#K-D03-008/L1) · [L2](../knowledge-catalog/index.html#K-D03-008/L2) · [L3](../knowledge-catalog/index.html#K-D03-008/L3) | [curriculum-demos.mjs](../knowledge-catalog/curriculum-demos.mjs) · `pagination` |
| K-D03-009 | Stepper 步骤指示 | D03 | [L1](../knowledge-catalog/index.html#K-D03-009/L1) · [L2](../knowledge-catalog/index.html#K-D03-009/L2) · [L3](../knowledge-catalog/index.html#K-D03-009/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `nav-stepper` |
| K-D03-010 | Bottom Navigation 底部导航 | D03 | [L1](../knowledge-catalog/index.html#K-D03-010/L1) · [L2](../knowledge-catalog/index.html#K-D03-010/L2) · [L3](../knowledge-catalog/index.html#K-D03-010/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `nav-bottom` |
| K-D03-011 | Speed Dial 快捷操作菜单 | D03 | [L1](../knowledge-catalog/index.html#K-D03-011/L1) · [L2](../knowledge-catalog/index.html#K-D03-011/L2) · [L3](../knowledge-catalog/index.html#K-D03-011/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `nav-speed` |
| K-D03-012 | Command Palette 命令面板 | D03 | [L1](../knowledge-catalog/index.html#K-D03-012/L1) · [L2](../knowledge-catalog/index.html#K-D03-012/L2) · [L3](../knowledge-catalog/index.html#K-D03-012/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `nav-command` |
| K-D03-013 | Tree Navigation 树形导航 | D03 | [L1](../knowledge-catalog/index.html#K-D03-013/L1) · [L2](../knowledge-catalog/index.html#K-D03-013/L2) · [L3](../knowledge-catalog/index.html#K-D03-013/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `nav-tree` |
| K-D03-014 | Tour 新手引导 | D03 | [L1](../knowledge-catalog/index.html#K-D03-014/L1) · [L2](../knowledge-catalog/index.html#K-D03-014/L2) · [L3](../knowledge-catalog/index.html#K-D03-014/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `nav-tour` |
| K-D03-015 | Back To Top 返回顶部 | D03 | [L1](../knowledge-catalog/index.html#K-D03-015/L1) · [L2](../knowledge-catalog/index.html#K-D03-015/L2) · [L3](../knowledge-catalog/index.html#K-D03-015/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `nav-backtop` |
| K-D03-016 | Page Header 页面标题栏 | D03 | [L1](../knowledge-catalog/index.html#K-D03-016/L1) · [L2](../knowledge-catalog/index.html#K-D03-016/L2) · [L3](../knowledge-catalog/index.html#K-D03-016/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `nav-pageheader` |
| K-D03-017 | Nav Link 导航链接 | D03 | [L1](../knowledge-catalog/index.html#K-D03-017/L1) · [L2](../knowledge-catalog/index.html#K-D03-017/L2) · [L3](../knowledge-catalog/index.html#K-D03-017/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `nav-link` |
| K-D03-018 | Accordion 手风琴 | D03 | [L1](../knowledge-catalog/index.html#K-D03-018/L1) · [L2](../knowledge-catalog/index.html#K-D03-018/L2) · [L3](../knowledge-catalog/index.html#K-D03-018/L3) | [curriculum-demos.mjs](../knowledge-catalog/curriculum-demos.mjs) · `accordion` |
| K-D03-019 | Collapsible 折叠内容 | D03 | [L1](../knowledge-catalog/index.html#K-D03-019/L1) · [L2](../knowledge-catalog/index.html#K-D03-019/L2) · [L3](../knowledge-catalog/index.html#K-D03-019/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `nav-collapse` |
| K-D03-020 | Navigation Rail 导航轨道 | D03 | [L1](../knowledge-catalog/index.html#K-D03-020/L1) · [L2](../knowledge-catalog/index.html#K-D03-020/L2) · [L3](../knowledge-catalog/index.html#K-D03-020/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `nav-rail` |
| K-D03-021 | Mega Menu 大型菜单 | D03 | [L1](../knowledge-catalog/index.html#K-D03-021/L1) · [L2](../knowledge-catalog/index.html#K-D03-021/L2) · [L3](../knowledge-catalog/index.html#K-D03-021/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `nav-mega` |

### D04 表单与数据输入（52 个主题）

| ID | 原名 | 领域 | 三层直达链接 | 实现 / kind |
| --- | --- | --- | --- | --- |
| K-D04-001 | Text Input 单行输入框 | D04 | [L1](../knowledge-catalog/index.html#K-D04-001/L1) · [L2](../knowledge-catalog/index.html#K-D04-001/L2) · [L3](../knowledge-catalog/index.html#K-D04-001/L3) | [curriculum-demos.mjs](../knowledge-catalog/curriculum-demos.mjs) · `input` |
| K-D04-002 | Textarea 多行输入框 | D04 | [L1](../knowledge-catalog/index.html#K-D04-002/L1) · [L2](../knowledge-catalog/index.html#K-D04-002/L2) · [L3](../knowledge-catalog/index.html#K-D04-002/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `field-textarea` |
| K-D04-003 | Number Input 数字输入 | D04 | [L1](../knowledge-catalog/index.html#K-D04-003/L1) · [L2](../knowledge-catalog/index.html#K-D04-003/L2) · [L3](../knowledge-catalog/index.html#K-D04-003/L3) | [curriculum-demos.mjs](../knowledge-catalog/curriculum-demos.mjs) · `number` |
| K-D04-004 | Password Input 密码输入 | D04 | [L1](../knowledge-catalog/index.html#K-D04-004/L1) · [L2](../knowledge-catalog/index.html#K-D04-004/L2) · [L3](../knowledge-catalog/index.html#K-D04-004/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `field-password` |
| K-D04-005 | Email Input 邮箱输入 | D04 | [L1](../knowledge-catalog/index.html#K-D04-005/L1) · [L2](../knowledge-catalog/index.html#K-D04-005/L2) · [L3](../knowledge-catalog/index.html#K-D04-005/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `field-email` |
| K-D04-006 | URL Input 网址输入 | D04 | [L1](../knowledge-catalog/index.html#K-D04-006/L1) · [L2](../knowledge-catalog/index.html#K-D04-006/L2) · [L3](../knowledge-catalog/index.html#K-D04-006/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `field-url` |
| K-D04-007 | Phone Input 手机号输入 | D04 | [L1](../knowledge-catalog/index.html#K-D04-007/L1) · [L2](../knowledge-catalog/index.html#K-D04-007/L2) · [L3](../knowledge-catalog/index.html#K-D04-007/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `field-phone` |
| K-D04-008 | Search Input 搜索输入框 | D04 | [L1](../knowledge-catalog/index.html#K-D04-008/L1) · [L2](../knowledge-catalog/index.html#K-D04-008/L2) · [L3](../knowledge-catalog/index.html#K-D04-008/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `field-search` |
| K-D04-009 | Masked Input 格式化输入 | D04 | [L1](../knowledge-catalog/index.html#K-D04-009/L1) · [L2](../knowledge-catalog/index.html#K-D04-009/L2) · [L3](../knowledge-catalog/index.html#K-D04-009/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `field-mask` |
| K-D04-010 | Currency Input 货币输入 | D04 | [L1](../knowledge-catalog/index.html#K-D04-010/L1) · [L2](../knowledge-catalog/index.html#K-D04-010/L2) · [L3](../knowledge-catalog/index.html#K-D04-010/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `field-currency` |
| K-D04-011 | Percentage Input 百分比输入 | D04 | [L1](../knowledge-catalog/index.html#K-D04-011/L1) · [L2](../knowledge-catalog/index.html#K-D04-011/L2) · [L3](../knowledge-catalog/index.html#K-D04-011/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `field-percent` |
| K-D04-012 | Unit Input 单位输入 | D04 | [L1](../knowledge-catalog/index.html#K-D04-012/L1) · [L2](../knowledge-catalog/index.html#K-D04-012/L2) · [L3](../knowledge-catalog/index.html#K-D04-012/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `field-unit` |
| K-D04-013 | Checkbox 复选框 | D04 | [L1](../knowledge-catalog/index.html#K-D04-013/L1) · [L2](../knowledge-catalog/index.html#K-D04-013/L2) · [L3](../knowledge-catalog/index.html#K-D04-013/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `field-checkbox` |
| K-D04-014 | Checkbox Group 复选框组 | D04 | [L1](../knowledge-catalog/index.html#K-D04-014/L1) · [L2](../knowledge-catalog/index.html#K-D04-014/L2) · [L3](../knowledge-catalog/index.html#K-D04-014/L3) | [curriculum-demos.mjs](../knowledge-catalog/curriculum-demos.mjs) · `checks` |
| K-D04-015 | Radio Button 单选按钮 | D04 | [L1](../knowledge-catalog/index.html#K-D04-015/L1) · [L2](../knowledge-catalog/index.html#K-D04-015/L2) · [L3](../knowledge-catalog/index.html#K-D04-015/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `field-radio` |
| K-D04-016 | Radio Group 单选组 | D04 | [L1](../knowledge-catalog/index.html#K-D04-016/L1) · [L2](../knowledge-catalog/index.html#K-D04-016/L2) · [L3](../knowledge-catalog/index.html#K-D04-016/L3) | [curriculum-demos.mjs](../knowledge-catalog/curriculum-demos.mjs) · `radio` |
| K-D04-017 | Switch 开关 | D04 | [L1](../knowledge-catalog/index.html#K-D04-017/L1) · [L2](../knowledge-catalog/index.html#K-D04-017/L2) · [L3](../knowledge-catalog/index.html#K-D04-017/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `field-switch` |
| K-D04-018 | Toggle Group 切换按钮组 | D04 | [L1](../knowledge-catalog/index.html#K-D04-018/L1) · [L2](../knowledge-catalog/index.html#K-D04-018/L2) · [L3](../knowledge-catalog/index.html#K-D04-018/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `field-toggles` |
| K-D04-019 | Select 下拉选择 | D04 | [L1](../knowledge-catalog/index.html#K-D04-019/L1) · [L2](../knowledge-catalog/index.html#K-D04-019/L2) · [L3](../knowledge-catalog/index.html#K-D04-019/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `field-select` |
| K-D04-020 | Multi Select 多选下拉 | D04 | [L1](../knowledge-catalog/index.html#K-D04-020/L1) · [L2](../knowledge-catalog/index.html#K-D04-020/L2) · [L3](../knowledge-catalog/index.html#K-D04-020/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `field-multi` |
| K-D04-021 | Combobox 组合框 | D04 | [L1](../knowledge-catalog/index.html#K-D04-021/L1) · [L2](../knowledge-catalog/index.html#K-D04-021/L2) · [L3](../knowledge-catalog/index.html#K-D04-021/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `field-combo` |
| K-D04-022 | Autocomplete 自动完成 | D04 | [L1](../knowledge-catalog/index.html#K-D04-022/L1) · [L2](../knowledge-catalog/index.html#K-D04-022/L2) · [L3](../knowledge-catalog/index.html#K-D04-022/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `field-auto` |
| K-D04-023 | Cascader 级联选择 | D04 | [L1](../knowledge-catalog/index.html#K-D04-023/L1) · [L2](../knowledge-catalog/index.html#K-D04-023/L2) · [L3](../knowledge-catalog/index.html#K-D04-023/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `field-cascade` |
| K-D04-024 | Tree Select 树形选择 | D04 | [L1](../knowledge-catalog/index.html#K-D04-024/L1) · [L2](../knowledge-catalog/index.html#K-D04-024/L2) · [L3](../knowledge-catalog/index.html#K-D04-024/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `field-tree` |
| K-D04-025 | Transfer 穿梭选择 | D04 | [L1](../knowledge-catalog/index.html#K-D04-025/L1) · [L2](../knowledge-catalog/index.html#K-D04-025/L2) · [L3](../knowledge-catalog/index.html#K-D04-025/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `field-transfer` |
| K-D04-026 | Tag Input 标签输入 | D04 | [L1](../knowledge-catalog/index.html#K-D04-026/L1) · [L2](../knowledge-catalog/index.html#K-D04-026/L2) · [L3](../knowledge-catalog/index.html#K-D04-026/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `field-tags` |
| K-D04-027 | Mentions 提及输入 | D04 | [L1](../knowledge-catalog/index.html#K-D04-027/L1) · [L2](../knowledge-catalog/index.html#K-D04-027/L2) · [L3](../knowledge-catalog/index.html#K-D04-027/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `field-mentions` |
| K-D04-028 | Async Select 异步选择 | D04 | [L1](../knowledge-catalog/index.html#K-D04-028/L1) · [L2](../knowledge-catalog/index.html#K-D04-028/L2) · [L3](../knowledge-catalog/index.html#K-D04-028/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `field-async` |
| K-D04-029 | Date Picker 日期选择 | D04 | [L1](../knowledge-catalog/index.html#K-D04-029/L1) · [L2](../knowledge-catalog/index.html#K-D04-029/L2) · [L3](../knowledge-catalog/index.html#K-D04-029/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `field-date` |
| K-D04-030 | Date Range Picker 日期范围 | D04 | [L1](../knowledge-catalog/index.html#K-D04-030/L1) · [L2](../knowledge-catalog/index.html#K-D04-030/L2) · [L3](../knowledge-catalog/index.html#K-D04-030/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `field-daterange` |
| K-D04-031 | Time Picker 时间选择 | D04 | [L1](../knowledge-catalog/index.html#K-D04-031/L1) · [L2](../knowledge-catalog/index.html#K-D04-031/L2) · [L3](../knowledge-catalog/index.html#K-D04-031/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `field-time` |
| K-D04-032 | Time Range Picker 时间范围 | D04 | [L1](../knowledge-catalog/index.html#K-D04-032/L1) · [L2](../knowledge-catalog/index.html#K-D04-032/L2) · [L3](../knowledge-catalog/index.html#K-D04-032/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `field-timerange` |
| K-D04-033 | Month Picker 月份选择 | D04 | [L1](../knowledge-catalog/index.html#K-D04-033/L1) · [L2](../knowledge-catalog/index.html#K-D04-033/L2) · [L3](../knowledge-catalog/index.html#K-D04-033/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `field-month` |
| K-D04-034 | Year Picker 年份选择 | D04 | [L1](../knowledge-catalog/index.html#K-D04-034/L1) · [L2](../knowledge-catalog/index.html#K-D04-034/L2) · [L3](../knowledge-catalog/index.html#K-D04-034/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `field-year` |
| K-D04-035 | Week Picker 周选择 | D04 | [L1](../knowledge-catalog/index.html#K-D04-035/L1) · [L2](../knowledge-catalog/index.html#K-D04-035/L2) · [L3](../knowledge-catalog/index.html#K-D04-035/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `field-week` |
| K-D04-036 | Calendar Grid 日历网格 | D04 | [L1](../knowledge-catalog/index.html#K-D04-036/L1) · [L2](../knowledge-catalog/index.html#K-D04-036/L2) · [L3](../knowledge-catalog/index.html#K-D04-036/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `field-calendar` |
| K-D04-037 | Date Time Picker 日期时间 | D04 | [L1](../knowledge-catalog/index.html#K-D04-037/L1) · [L2](../knowledge-catalog/index.html#K-D04-037/L2) · [L3](../knowledge-catalog/index.html#K-D04-037/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `field-datetime` |
| K-D04-038 | Slider 滑动条 | D04 | [L1](../knowledge-catalog/index.html#K-D04-038/L1) · [L2](../knowledge-catalog/index.html#K-D04-038/L2) · [L3](../knowledge-catalog/index.html#K-D04-038/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `field-slider` |
| K-D04-039 | Range Slider 双端滑动条 | D04 | [L1](../knowledge-catalog/index.html#K-D04-039/L1) · [L2](../knowledge-catalog/index.html#K-D04-039/L2) · [L3](../knowledge-catalog/index.html#K-D04-039/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `field-range` |
| K-D04-040 | Stepper Input 步进输入 | D04 | [L1](../knowledge-catalog/index.html#K-D04-040/L1) · [L2](../knowledge-catalog/index.html#K-D04-040/L2) · [L3](../knowledge-catalog/index.html#K-D04-040/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `field-stepper` |
| K-D04-041 | Color Picker 颜色选择 | D04 | [L1](../knowledge-catalog/index.html#K-D04-041/L1) · [L2](../knowledge-catalog/index.html#K-D04-041/L2) · [L3](../knowledge-catalog/index.html#K-D04-041/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `field-color` |
| K-D04-042 | OTP Input 验证码输入 | D04 | [L1](../knowledge-catalog/index.html#K-D04-042/L1) · [L2](../knowledge-catalog/index.html#K-D04-042/L2) · [L3](../knowledge-catalog/index.html#K-D04-042/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `field-otp` |
| K-D04-043 | Signature Pad 手写签名 | D04 | [L1](../knowledge-catalog/index.html#K-D04-043/L1) · [L2](../knowledge-catalog/index.html#K-D04-043/L2) · [L3](../knowledge-catalog/index.html#K-D04-043/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `field-signature` |
| K-D04-045 | Form 表单 | D04 | [L1](../knowledge-catalog/index.html#K-D04-045/L1) · [L2](../knowledge-catalog/index.html#K-D04-045/L2) · [L3](../knowledge-catalog/index.html#K-D04-045/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `field-form` |
| K-D04-046 | Form Field 表单字段 | D04 | [L1](../knowledge-catalog/index.html#K-D04-046/L1) · [L2](../knowledge-catalog/index.html#K-D04-046/L2) · [L3](../knowledge-catalog/index.html#K-D04-046/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `field-field` |
| K-D04-047 | Fieldset 字段分组 | D04 | [L1](../knowledge-catalog/index.html#K-D04-047/L1) · [L2](../knowledge-catalog/index.html#K-D04-047/L2) · [L3](../knowledge-catalog/index.html#K-D04-047/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `field-fieldset` |
| K-D04-048 | Input Group 输入组合 | D04 | [L1](../knowledge-catalog/index.html#K-D04-048/L1) · [L2](../knowledge-catalog/index.html#K-D04-048/L2) · [L3](../knowledge-catalog/index.html#K-D04-048/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `field-inputgroup` |
| K-D04-049 | Dynamic Form 动态表单 | D04 | [L1](../knowledge-catalog/index.html#K-D04-049/L1) · [L2](../knowledge-catalog/index.html#K-D04-049/L2) · [L3](../knowledge-catalog/index.html#K-D04-049/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `field-dynamic` |
| K-D04-050 | Form Builder 表单构建器 | D04 | [L1](../knowledge-catalog/index.html#K-D04-050/L1) · [L2](../knowledge-catalog/index.html#K-D04-050/L2) · [L3](../knowledge-catalog/index.html#K-D04-050/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `field-builder` |
| K-D04-051 | Repeatable Field 重复字段组 | D04 | [L1](../knowledge-catalog/index.html#K-D04-051/L1) · [L2](../knowledge-catalog/index.html#K-D04-051/L2) · [L3](../knowledge-catalog/index.html#K-D04-051/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `field-repeat` |
| K-D04-052 | Conditional Field 条件字段 | D04 | [L1](../knowledge-catalog/index.html#K-D04-052/L1) · [L2](../knowledge-catalog/index.html#K-D04-052/L2) · [L3](../knowledge-catalog/index.html#K-D04-052/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `field-condition` |
| K-D04-053 | Validation Summary 校验汇总 | D04 | [L1](../knowledge-catalog/index.html#K-D04-053/L1) · [L2](../knowledge-catalog/index.html#K-D04-053/L2) · [L3](../knowledge-catalog/index.html#K-D04-053/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `field-summary` |

### D05 数据展示与高级数据表格（51 个主题）

| ID | 原名 | 领域 | 三层直达链接 | 实现 / kind |
| --- | --- | --- | --- | --- |
| K-D05-001 | Card 信息卡片 | D05 | [L1](../knowledge-catalog/index.html#K-D05-001/L1) · [L2](../knowledge-catalog/index.html#K-D05-001/L2) · [L3](../knowledge-catalog/index.html#K-D05-001/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `grid-card` |
| K-D05-002 | List 列表 | D05 | [L1](../knowledge-catalog/index.html#K-D05-002/L1) · [L2](../knowledge-catalog/index.html#K-D05-002/L2) · [L3](../knowledge-catalog/index.html#K-D05-002/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `grid-list` |
| K-D05-003 | Descriptions 详情描述 | D05 | [L1](../knowledge-catalog/index.html#K-D05-003/L1) · [L2](../knowledge-catalog/index.html#K-D05-003/L2) · [L3](../knowledge-catalog/index.html#K-D05-003/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `grid-descriptions` |
| K-D05-004 | Statistic 统计指标 | D05 | [L1](../knowledge-catalog/index.html#K-D05-004/L1) · [L2](../knowledge-catalog/index.html#K-D05-004/L2) · [L3](../knowledge-catalog/index.html#K-D05-004/L3) | [curriculum-demos.mjs](../knowledge-catalog/curriculum-demos.mjs) · `statistic` |
| K-D05-005 | Comparison 对比展示 | D05 | [L1](../knowledge-catalog/index.html#K-D05-005/L1) · [L2](../knowledge-catalog/index.html#K-D05-005/L2) · [L3](../knowledge-catalog/index.html#K-D05-005/L3) | [curriculum-demos.mjs](../knowledge-catalog/curriculum-demos.mjs) · `comparison` |
| K-D05-006 | Timeline 时间线 | D05 | [L1](../knowledge-catalog/index.html#K-D05-006/L1) · [L2](../knowledge-catalog/index.html#K-D05-006/L2) · [L3](../knowledge-catalog/index.html#K-D05-006/L3) | [curriculum-demos.mjs](../knowledge-catalog/curriculum-demos.mjs) · `timeline` |
| K-D05-007 | Activity Log 操作记录 | D05 | [L1](../knowledge-catalog/index.html#K-D05-007/L1) · [L2](../knowledge-catalog/index.html#K-D05-007/L2) · [L3](../knowledge-catalog/index.html#K-D05-007/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `grid-log` |
| K-D05-008 | Calendar 日历 | D05 | [L1](../knowledge-catalog/index.html#K-D05-008/L1) · [L2](../knowledge-catalog/index.html#K-D05-008/L2) · [L3](../knowledge-catalog/index.html#K-D05-008/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `grid-calendar` |
| K-D05-009 | Scheduler 资源排程 | D05 | [L1](../knowledge-catalog/index.html#K-D05-009/L1) · [L2](../knowledge-catalog/index.html#K-D05-009/L2) · [L3](../knowledge-catalog/index.html#K-D05-009/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `grid-scheduler` |
| K-D05-010 | Gantt Chart 甘特图 | D05 | [L1](../knowledge-catalog/index.html#K-D05-010/L1) · [L2](../knowledge-catalog/index.html#K-D05-010/L2) · [L3](../knowledge-catalog/index.html#K-D05-010/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `grid-gantt` |
| K-D05-011 | Carousel 轮播 | D05 | [L1](../knowledge-catalog/index.html#K-D05-011/L1) · [L2](../knowledge-catalog/index.html#K-D05-011/L2) · [L3](../knowledge-catalog/index.html#K-D05-011/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `grid-carousel` |
| K-D05-012 | Image List 图片列表 | D05 | [L1](../knowledge-catalog/index.html#K-D05-012/L1) · [L2](../knowledge-catalog/index.html#K-D05-012/L2) · [L3](../knowledge-catalog/index.html#K-D05-012/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `grid-images` |
| K-D05-015 | Code Block 代码块 | D05 | [L1](../knowledge-catalog/index.html#K-D05-015/L1) · [L2](../knowledge-catalog/index.html#K-D05-015/L2) · [L3](../knowledge-catalog/index.html#K-D05-015/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `grid-code` |
| K-D05-016 | JSON Viewer JSON 查看器 | D05 | [L1](../knowledge-catalog/index.html#K-D05-016/L1) · [L2](../knowledge-catalog/index.html#K-D05-016/L2) · [L3](../knowledge-catalog/index.html#K-D05-016/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `grid-json` |
| K-D05-017 | Markdown Viewer Markdown 查看器 | D05 | [L1](../knowledge-catalog/index.html#K-D05-017/L1) · [L2](../knowledge-catalog/index.html#K-D05-017/L2) · [L3](../knowledge-catalog/index.html#K-D05-017/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `grid-markdown` |
| K-D05-018 | File List 文件列表 | D05 | [L1](../knowledge-catalog/index.html#K-D05-018/L1) · [L2](../knowledge-catalog/index.html#K-D05-018/L2) · [L3](../knowledge-catalog/index.html#K-D05-018/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `grid-files` |
| K-D05-020 | Key Value 查看器 | D05 | [L1](../knowledge-catalog/index.html#K-D05-020/L1) · [L2](../knowledge-catalog/index.html#K-D05-020/L2) · [L3](../knowledge-catalog/index.html#K-D05-020/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `grid-keyvalue` |
| K-D05-022 | Table 数据表格 | D05 | [L1](../knowledge-catalog/index.html#K-D05-022/L1) · [L2](../knowledge-catalog/index.html#K-D05-022/L2) · [L3](../knowledge-catalog/index.html#K-D05-022/L3) | [curriculum-demos.mjs](../knowledge-catalog/curriculum-demos.mjs) · `table` |
| K-D05-023 | Data Grid 数据网格 | D05 | [L1](../knowledge-catalog/index.html#K-D05-023/L1) · [L2](../knowledge-catalog/index.html#K-D05-023/L2) · [L3](../knowledge-catalog/index.html#K-D05-023/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `grid-datagrid` |
| K-D05-024 | Tree Table 树形表格 | D05 | [L1](../knowledge-catalog/index.html#K-D05-024/L1) · [L2](../knowledge-catalog/index.html#K-D05-024/L2) · [L3](../knowledge-catalog/index.html#K-D05-024/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `grid-tree` |
| K-D05-025 | Pivot Table 数据透视表 | D05 | [L1](../knowledge-catalog/index.html#K-D05-025/L1) · [L2](../knowledge-catalog/index.html#K-D05-025/L2) · [L3](../knowledge-catalog/index.html#K-D05-025/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `grid-pivot` |
| K-D05-026 | Virtual List 虚拟列表 | D05 | [L1](../knowledge-catalog/index.html#K-D05-026/L1) · [L2](../knowledge-catalog/index.html#K-D05-026/L2) · [L3](../knowledge-catalog/index.html#K-D05-026/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `grid-virtual` |
| K-D05-027 | Virtual Grid 虚拟网格 | D05 | [L1](../knowledge-catalog/index.html#K-D05-027/L1) · [L2](../knowledge-catalog/index.html#K-D05-027/L2) · [L3](../knowledge-catalog/index.html#K-D05-027/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `grid-virtualgrid` |
| K-D05-028 | Infinite List 无限滚动列表 | D05 | [L1](../knowledge-catalog/index.html#K-D05-028/L1) · [L2](../knowledge-catalog/index.html#K-D05-028/L2) · [L3](../knowledge-catalog/index.html#K-D05-028/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `grid-infinite` |
| K-D05-029 | Master Detail 主从数据视图 | D05 | [L1](../knowledge-catalog/index.html#K-D05-029/L1) · [L2](../knowledge-catalog/index.html#K-D05-029/L2) · [L3](../knowledge-catalog/index.html#K-D05-029/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `grid-master` |
| K-D05-030 | Expandable Rows 可展开行 | D05 | [L1](../knowledge-catalog/index.html#K-D05-030/L1) · [L2](../knowledge-catalog/index.html#K-D05-030/L2) · [L3](../knowledge-catalog/index.html#K-D05-030/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `grid-expand` |
| K-D05-031 | Column Grouping 列分组 | D05 | [L1](../knowledge-catalog/index.html#K-D05-031/L1) · [L2](../knowledge-catalog/index.html#K-D05-031/L2) · [L3](../knowledge-catalog/index.html#K-D05-031/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `grid-colgroup` |
| K-D05-032 | Column Chooser 列配置器 | D05 | [L1](../knowledge-catalog/index.html#K-D05-032/L1) · [L2](../knowledge-catalog/index.html#K-D05-032/L2) · [L3](../knowledge-catalog/index.html#K-D05-032/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `grid-chooser` |
| K-D05-033 | Column Pinning 列固定 | D05 | [L1](../knowledge-catalog/index.html#K-D05-033/L1) · [L2](../knowledge-catalog/index.html#K-D05-033/L2) · [L3](../knowledge-catalog/index.html#K-D05-033/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `grid-pincol` |
| K-D05-034 | Column Resizing 列宽调整 | D05 | [L1](../knowledge-catalog/index.html#K-D05-034/L1) · [L2](../knowledge-catalog/index.html#K-D05-034/L2) · [L3](../knowledge-catalog/index.html#K-D05-034/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `grid-resize` |
| K-D05-035 | Column Reordering 列排序 | D05 | [L1](../knowledge-catalog/index.html#K-D05-035/L1) · [L2](../knowledge-catalog/index.html#K-D05-035/L2) · [L3](../knowledge-catalog/index.html#K-D05-035/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `grid-colorder` |
| K-D05-036 | Column Visibility 列可见性 | D05 | [L1](../knowledge-catalog/index.html#K-D05-036/L1) · [L2](../knowledge-catalog/index.html#K-D05-036/L2) · [L3](../knowledge-catalog/index.html#K-D05-036/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `grid-visibility` |
| K-D05-037 | Row Selection 行选择 | D05 | [L1](../knowledge-catalog/index.html#K-D05-037/L1) · [L2](../knowledge-catalog/index.html#K-D05-037/L2) · [L3](../knowledge-catalog/index.html#K-D05-037/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `grid-rowselect` |
| K-D05-038 | Cell Selection 单元格选区 | D05 | [L1](../knowledge-catalog/index.html#K-D05-038/L1) · [L2](../knowledge-catalog/index.html#K-D05-038/L2) · [L3](../knowledge-catalog/index.html#K-D05-038/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `grid-cell` |
| K-D05-039 | Row Pinning 行固定 | D05 | [L1](../knowledge-catalog/index.html#K-D05-039/L1) · [L2](../knowledge-catalog/index.html#K-D05-039/L2) · [L3](../knowledge-catalog/index.html#K-D05-039/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `grid-pinrow` |
| K-D05-040 | Row Reordering 行排序 | D05 | [L1](../knowledge-catalog/index.html#K-D05-040/L1) · [L2](../knowledge-catalog/index.html#K-D05-040/L2) · [L3](../knowledge-catalog/index.html#K-D05-040/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `grid-roworder` |
| K-D05-041 | Row Grouping 行分组 | D05 | [L1](../knowledge-catalog/index.html#K-D05-041/L1) · [L2](../knowledge-catalog/index.html#K-D05-041/L2) · [L3](../knowledge-catalog/index.html#K-D05-041/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `grid-group` |
| K-D05-042 | Row Aggregation 行聚合 | D05 | [L1](../knowledge-catalog/index.html#K-D05-042/L1) · [L2](../knowledge-catalog/index.html#K-D05-042/L2) · [L3](../knowledge-catalog/index.html#K-D05-042/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `grid-aggregate` |
| K-D05-043 | Inline Editing 行内编辑 | D05 | [L1](../knowledge-catalog/index.html#K-D05-043/L1) · [L2](../knowledge-catalog/index.html#K-D05-043/L2) · [L3](../knowledge-catalog/index.html#K-D05-043/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `grid-edit` |
| K-D05-044 | Multi Sort 多列排序 | D05 | [L1](../knowledge-catalog/index.html#K-D05-044/L1) · [L2](../knowledge-catalog/index.html#K-D05-044/L2) · [L3](../knowledge-catalog/index.html#K-D05-044/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `grid-sort` |
| K-D05-045 | Faceted Filtering 数据分面筛选 | D05 | [L1](../knowledge-catalog/index.html#K-D05-045/L1) · [L2](../knowledge-catalog/index.html#K-D05-045/L2) · [L3](../knowledge-catalog/index.html#K-D05-045/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `grid-facet` |
| K-D05-046 | Header Filter 表头筛选 | D05 | [L1](../knowledge-catalog/index.html#K-D05-046/L1) · [L2](../knowledge-catalog/index.html#K-D05-046/L2) · [L3](../knowledge-catalog/index.html#K-D05-046/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `grid-headerfilter` |
| K-D05-047 | Quick Filter 快速筛选 | D05 | [L1](../knowledge-catalog/index.html#K-D05-047/L1) · [L2](../knowledge-catalog/index.html#K-D05-047/L2) · [L3](../knowledge-catalog/index.html#K-D05-047/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `grid-quick` |
| K-D05-051 | Cell Spanning 单元格合并 | D05 | [L1](../knowledge-catalog/index.html#K-D05-051/L1) · [L2](../knowledge-catalog/index.html#K-D05-051/L2) · [L3](../knowledge-catalog/index.html#K-D05-051/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `grid-span` |
| K-D05-052 | Clipboard Grid 剪贴板网格操作 | D05 | [L1](../knowledge-catalog/index.html#K-D05-052/L1) · [L2](../knowledge-catalog/index.html#K-D05-052/L2) · [L3](../knowledge-catalog/index.html#K-D05-052/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `grid-clipboard` |
| K-D05-054 | Grid Export 网格导出 | D05 | [L1](../knowledge-catalog/index.html#K-D05-054/L1) · [L2](../knowledge-catalog/index.html#K-D05-054/L2) · [L3](../knowledge-catalog/index.html#K-D05-054/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `grid-export` |
| K-D05-056 | Grid Column Auto-size 列宽自适应 | D05 | [L1](../knowledge-catalog/index.html#K-D05-056/L1) · [L2](../knowledge-catalog/index.html#K-D05-056/L2) · [L3](../knowledge-catalog/index.html#K-D05-056/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `grid-autosize` |
| K-D05-057 | Grid Row Height 行高控制 | D05 | [L1](../knowledge-catalog/index.html#K-D05-057/L1) · [L2](../knowledge-catalog/index.html#K-D05-057/L2) · [L3](../knowledge-catalog/index.html#K-D05-057/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `grid-rowheight` |
| K-D05-058 | Grid Keyboard Navigation 网格键盘导航 | D05 | [L1](../knowledge-catalog/index.html#K-D05-058/L1) · [L2](../knowledge-catalog/index.html#K-D05-058/L2) · [L3](../knowledge-catalog/index.html#K-D05-058/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `grid-keyboard` |
| K-D05-059 | Grid Range Fill 区域填充 | D05 | [L1](../knowledge-catalog/index.html#K-D05-059/L1) · [L2](../knowledge-catalog/index.html#K-D05-059/L2) · [L3](../knowledge-catalog/index.html#K-D05-059/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `grid-fill` |
| K-D05-060 | Grid Formula Cell 公式单元格 | D05 | [L1](../knowledge-catalog/index.html#K-D05-060/L1) · [L2](../knowledge-catalog/index.html#K-D05-060/L2) · [L3](../knowledge-catalog/index.html#K-D05-060/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `grid-formula` |

### D06 状态与系统反馈（28 个主题）

| ID | 原名 | 领域 | 三层直达链接 | 实现 / kind |
| --- | --- | --- | --- | --- |
| K-D06-001 | Status Badge 状态标签 | D06 | [L1](../knowledge-catalog/index.html#K-D06-001/L1) · [L2](../knowledge-catalog/index.html#K-D06-001/L2) · [L3](../knowledge-catalog/index.html#K-D06-001/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `feedback-badge` |
| K-D06-002 | Status Dot 状态圆点 | D06 | [L1](../knowledge-catalog/index.html#K-D06-002/L1) · [L2](../knowledge-catalog/index.html#K-D06-002/L2) · [L3](../knowledge-catalog/index.html#K-D06-002/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `feedback-dot` |
| K-D06-003 | Alert 警告提示 | D06 | [L1](../knowledge-catalog/index.html#K-D06-003/L1) · [L2](../knowledge-catalog/index.html#K-D06-003/L2) · [L3](../knowledge-catalog/index.html#K-D06-003/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `feedback-alert` |
| K-D06-004 | Toast 轻提示 | D06 | [L1](../knowledge-catalog/index.html#K-D06-004/L1) · [L2](../knowledge-catalog/index.html#K-D06-004/L2) · [L3](../knowledge-catalog/index.html#K-D06-004/L3) | [curriculum-demos.mjs](../knowledge-catalog/curriculum-demos.mjs) · `toast` |
| K-D06-005 | Snackbar 操作反馈条 | D06 | [L1](../knowledge-catalog/index.html#K-D06-005/L1) · [L2](../knowledge-catalog/index.html#K-D06-005/L2) · [L3](../knowledge-catalog/index.html#K-D06-005/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `feedback-snackbar` |
| K-D06-006 | Notification 通知 | D06 | [L1](../knowledge-catalog/index.html#K-D06-006/L1) · [L2](../knowledge-catalog/index.html#K-D06-006/L2) · [L3](../knowledge-catalog/index.html#K-D06-006/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `feedback-notification` |
| K-D06-007 | Notification Center 通知中心 | D06 | [L1](../knowledge-catalog/index.html#K-D06-007/L1) · [L2](../knowledge-catalog/index.html#K-D06-007/L2) · [L3](../knowledge-catalog/index.html#K-D06-007/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `feedback-center` |
| K-D06-008 | Result 结果页面 | D06 | [L1](../knowledge-catalog/index.html#K-D06-008/L1) · [L2](../knowledge-catalog/index.html#K-D06-008/L2) · [L3](../knowledge-catalog/index.html#K-D06-008/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `feedback-result` |
| K-D06-009 | Empty State 空状态 | D06 | [L1](../knowledge-catalog/index.html#K-D06-009/L1) · [L2](../knowledge-catalog/index.html#K-D06-009/L2) · [L3](../knowledge-catalog/index.html#K-D06-009/L3) | [curriculum-demos.mjs](../knowledge-catalog/curriculum-demos.mjs) · `empty` |
| K-D06-010 | Search Empty 搜索无结果 | D06 | [L1](../knowledge-catalog/index.html#K-D06-010/L1) · [L2](../knowledge-catalog/index.html#K-D06-010/L2) · [L3](../knowledge-catalog/index.html#K-D06-010/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `feedback-empty` |
| K-D06-011 | Skeleton 骨架屏 | D06 | [L1](../knowledge-catalog/index.html#K-D06-011/L1) · [L2](../knowledge-catalog/index.html#K-D06-011/L2) · [L3](../knowledge-catalog/index.html#K-D06-011/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `feedback-skeleton` |
| K-D06-012 | Spinner 加载指示器 | D06 | [L1](../knowledge-catalog/index.html#K-D06-012/L1) · [L2](../knowledge-catalog/index.html#K-D06-012/L2) · [L3](../knowledge-catalog/index.html#K-D06-012/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `feedback-spinner` |
| K-D06-013 | Progress 进度条 | D06 | [L1](../knowledge-catalog/index.html#K-D06-013/L1) · [L2](../knowledge-catalog/index.html#K-D06-013/L2) · [L3](../knowledge-catalog/index.html#K-D06-013/L3) | [curriculum-demos.mjs](../knowledge-catalog/curriculum-demos.mjs) · `progress` |
| K-D06-014 | Circular Progress 环形进度 | D06 | [L1](../knowledge-catalog/index.html#K-D06-014/L1) · [L2](../knowledge-catalog/index.html#K-D06-014/L2) · [L3](../knowledge-catalog/index.html#K-D06-014/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `feedback-circular` |
| K-D06-015 | Inline Loading 行内加载 | D06 | [L1](../knowledge-catalog/index.html#K-D06-015/L1) · [L2](../knowledge-catalog/index.html#K-D06-015/L2) · [L3](../knowledge-catalog/index.html#K-D06-015/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `feedback-inline` |
| K-D06-016 | Loading Overlay 加载遮罩 | D06 | [L1](../knowledge-catalog/index.html#K-D06-016/L1) · [L2](../knowledge-catalog/index.html#K-D06-016/L2) · [L3](../knowledge-catalog/index.html#K-D06-016/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `feedback-overlay` |
| K-D06-017 | Fullscreen Loading 全屏加载 | D06 | [L1](../knowledge-catalog/index.html#K-D06-017/L1) · [L2](../knowledge-catalog/index.html#K-D06-017/L2) · [L3](../knowledge-catalog/index.html#K-D06-017/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `feedback-fullscreen` |
| K-D06-018 | Field Error 字段错误提示 | D06 | [L1](../knowledge-catalog/index.html#K-D06-018/L1) · [L2](../knowledge-catalog/index.html#K-D06-018/L2) · [L3](../knowledge-catalog/index.html#K-D06-018/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `feedback-error` |
| K-D06-020 | Undo Feedback 撤销反馈 | D06 | [L1](../knowledge-catalog/index.html#K-D06-020/L1) · [L2](../knowledge-catalog/index.html#K-D06-020/L2) · [L3](../knowledge-catalog/index.html#K-D06-020/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `feedback-undo` |
| K-D06-021 | Error Page 错误页面 | D06 | [L1](../knowledge-catalog/index.html#K-D06-021/L1) · [L2](../knowledge-catalog/index.html#K-D06-021/L2) · [L3](../knowledge-catalog/index.html#K-D06-021/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `feedback-page` |
| K-D06-022 | Error Boundary 错误边界 | D06 | [L1](../knowledge-catalog/index.html#K-D06-022/L1) · [L2](../knowledge-catalog/index.html#K-D06-022/L2) · [L3](../knowledge-catalog/index.html#K-D06-022/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `feedback-boundary` |
| K-D06-023 | Retry Panel 重试面板 | D06 | [L1](../knowledge-catalog/index.html#K-D06-023/L1) · [L2](../knowledge-catalog/index.html#K-D06-023/L2) · [L3](../knowledge-catalog/index.html#K-D06-023/L3) | [curriculum-demos.mjs](../knowledge-catalog/curriculum-demos.mjs) · `retry` |
| K-D06-024 | Conflict Warning 冲突警告 | D06 | [L1](../knowledge-catalog/index.html#K-D06-024/L1) · [L2](../knowledge-catalog/index.html#K-D06-024/L2) · [L3](../knowledge-catalog/index.html#K-D06-024/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `feedback-conflict` |
| K-D06-025 | Network Status 网络状态 | D06 | [L1](../knowledge-catalog/index.html#K-D06-025/L1) · [L2](../knowledge-catalog/index.html#K-D06-025/L2) · [L3](../knowledge-catalog/index.html#K-D06-025/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `feedback-network` |
| K-D06-026 | Offline Banner 离线横幅 | D06 | [L1](../knowledge-catalog/index.html#K-D06-026/L1) · [L2](../knowledge-catalog/index.html#K-D06-026/L2) · [L3](../knowledge-catalog/index.html#K-D06-026/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `feedback-offline` |
| K-D06-027 | Connection Indicator 连接指示器 | D06 | [L1](../knowledge-catalog/index.html#K-D06-027/L1) · [L2](../knowledge-catalog/index.html#K-D06-027/L2) · [L3](../knowledge-catalog/index.html#K-D06-027/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `feedback-connection` |
| K-D06-028 | Reconnecting State 重连状态 | D06 | [L1](../knowledge-catalog/index.html#K-D06-028/L1) · [L2](../knowledge-catalog/index.html#K-D06-028/L2) · [L3](../knowledge-catalog/index.html#K-D06-028/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `feedback-reconnecting` |
| K-D06-029 | Sync Status 同步状态 | D06 | [L1](../knowledge-catalog/index.html#K-D06-029/L1) · [L2](../knowledge-catalog/index.html#K-D06-029/L2) · [L3](../knowledge-catalog/index.html#K-D06-029/L3) | [expanded-basic.mjs](../knowledge-catalog/expanded-basic.mjs) · `feedback-sync` |

### D07 弹层、浮层与复杂交互（4 个主题）

| ID | 原名 | 领域 | 三层直达链接 | 实现 / kind |
| --- | --- | --- | --- | --- |
| K-D07-001 | Modal 弹窗 | D07 | [L1](../knowledge-catalog/index.html#K-D07-001/L1) · [L2](../knowledge-catalog/index.html#K-D07-001/L2) · [L3](../knowledge-catalog/index.html#K-D07-001/L3) | [curriculum-demos.mjs](../knowledge-catalog/curriculum-demos.mjs) · `modal` |
| K-D07-011 | Popover 弹出层 | D07 | [L1](../knowledge-catalog/index.html#K-D07-011/L1) · [L2](../knowledge-catalog/index.html#K-D07-011/L2) · [L3](../knowledge-catalog/index.html#K-D07-011/L3) | [curriculum-demos.mjs](../knowledge-catalog/curriculum-demos.mjs) · `popover` |
| K-D07-013 | Tooltip 提示框 | D07 | [L1](../knowledge-catalog/index.html#K-D07-013/L1) · [L2](../knowledge-catalog/index.html#K-D07-013/L2) · [L3](../knowledge-catalog/index.html#K-D07-013/L3) | [curriculum-demos.mjs](../knowledge-catalog/curriculum-demos.mjs) · `tooltip` |
| K-D07-030 | Focus Restoration 焦点恢复 | D07 | [L1](../knowledge-catalog/index.html#K-D07-030/L1) · [L2](../knowledge-catalog/index.html#K-D07-030/L2) · [L3](../knowledge-catalog/index.html#K-D07-030/L3) | [curriculum-demos.mjs](../knowledge-catalog/curriculum-demos.mjs) · `focus` |

### D08 文件、媒体与专业编辑器（4 个主题）

| ID | 原名 | 领域 | 三层直达链接 | 实现 / kind |
| --- | --- | --- | --- | --- |
| K-D08-001 | File Picker 文件选择器 | D08 | [L1](../knowledge-catalog/index.html#K-D08-001/L1) · [L2](../knowledge-catalog/index.html#K-D08-001/L2) · [L3](../knowledge-catalog/index.html#K-D08-001/L3) | [curriculum-demos.mjs](../knowledge-catalog/curriculum-demos.mjs) · `file` |
| K-D08-017 | File Metadata 文件元数据 | D08 | [L1](../knowledge-catalog/index.html#K-D08-017/L1) · [L2](../knowledge-catalog/index.html#K-D08-017/L2) · [L3](../knowledge-catalog/index.html#K-D08-017/L3) | [curriculum-demos.mjs](../knowledge-catalog/curriculum-demos.mjs) · `metadata` |
| K-D08-045 | JSON Editor JSON 编辑器 | D08 | [L1](../knowledge-catalog/index.html#K-D08-045/L1) · [L2](../knowledge-catalog/index.html#K-D08-045/L2) · [L3](../knowledge-catalog/index.html#K-D08-045/L3) | [curriculum-demos.mjs](../knowledge-catalog/curriculum-demos.mjs) · `json` |
| K-D08-055 | CSV Import Preview CSV 导入预览 | D08 | [L1](../knowledge-catalog/index.html#K-D08-055/L1) · [L2](../knowledge-catalog/index.html#K-D08-055/L2) · [L3](../knowledge-catalog/index.html#K-D08-055/L3) | [curriculum-demos.mjs](../knowledge-catalog/curriculum-demos.mjs) · `csv` |

### D09 图表与专业数据可视化（29 个主题）

| ID | 原名 | 领域 | 三层直达链接 | 实现 / kind |
| --- | --- | --- | --- | --- |
| K-D09-001 | Bar Chart 柱状图 | D09 | [L1](../knowledge-catalog/index.html#K-D09-001/L1) · [L2](../knowledge-catalog/index.html#K-D09-001/L2) · [L3](../knowledge-catalog/index.html#K-D09-001/L3) | [curriculum-demos.mjs](../knowledge-catalog/curriculum-demos.mjs) · `chart` |
| K-D09-002 | Stacked Bar 堆叠柱状图 | D09 | [L1](../knowledge-catalog/index.html#K-D09-002/L1) · [L2](../knowledge-catalog/index.html#K-D09-002/L2) · [L3](../knowledge-catalog/index.html#K-D09-002/L3) | [expanded-advanced.mjs](../knowledge-catalog/expanded-advanced.mjs) · `advanced-stacked-bar` |
| K-D09-003 | Horizontal Bar 横向条形图 | D09 | [L1](../knowledge-catalog/index.html#K-D09-003/L1) · [L2](../knowledge-catalog/index.html#K-D09-003/L2) · [L3](../knowledge-catalog/index.html#K-D09-003/L3) | [expanded-advanced.mjs](../knowledge-catalog/expanded-advanced.mjs) · `advanced-horizontal-bar` |
| K-D09-004 | Grouped Bar 分组柱状图 | D09 | [L1](../knowledge-catalog/index.html#K-D09-004/L1) · [L2](../knowledge-catalog/index.html#K-D09-004/L2) · [L3](../knowledge-catalog/index.html#K-D09-004/L3) | [expanded-advanced.mjs](../knowledge-catalog/expanded-advanced.mjs) · `advanced-grouped-bar` |
| K-D09-005 | Line Chart 折线图 | D09 | [L1](../knowledge-catalog/index.html#K-D09-005/L1) · [L2](../knowledge-catalog/index.html#K-D09-005/L2) · [L3](../knowledge-catalog/index.html#K-D09-005/L3) | [curriculum-demos.mjs](../knowledge-catalog/curriculum-demos.mjs) · `line` |
| K-D09-006 | Area Chart 面积图 | D09 | [L1](../knowledge-catalog/index.html#K-D09-006/L1) · [L2](../knowledge-catalog/index.html#K-D09-006/L2) · [L3](../knowledge-catalog/index.html#K-D09-006/L3) | [expanded-advanced.mjs](../knowledge-catalog/expanded-advanced.mjs) · `advanced-area` |
| K-D09-007 | Stacked Area 堆叠面积图 | D09 | [L1](../knowledge-catalog/index.html#K-D09-007/L1) · [L2](../knowledge-catalog/index.html#K-D09-007/L2) · [L3](../knowledge-catalog/index.html#K-D09-007/L3) | [expanded-advanced.mjs](../knowledge-catalog/expanded-advanced.mjs) · `advanced-stacked-area` |
| K-D09-008 | Pie Chart 饼图 | D09 | [L1](../knowledge-catalog/index.html#K-D09-008/L1) · [L2](../knowledge-catalog/index.html#K-D09-008/L2) · [L3](../knowledge-catalog/index.html#K-D09-008/L3) | [expanded-advanced.mjs](../knowledge-catalog/expanded-advanced.mjs) · `advanced-pie` |
| K-D09-009 | Donut Chart 环形图 | D09 | [L1](../knowledge-catalog/index.html#K-D09-009/L1) · [L2](../knowledge-catalog/index.html#K-D09-009/L2) · [L3](../knowledge-catalog/index.html#K-D09-009/L3) | [curriculum-demos.mjs](../knowledge-catalog/curriculum-demos.mjs) · `donut` |
| K-D09-010 | Scatter Plot 散点图 | D09 | [L1](../knowledge-catalog/index.html#K-D09-010/L1) · [L2](../knowledge-catalog/index.html#K-D09-010/L2) · [L3](../knowledge-catalog/index.html#K-D09-010/L3) | [curriculum-demos.mjs](../knowledge-catalog/curriculum-demos.mjs) · `scatter` |
| K-D09-011 | Bubble Chart 气泡图 | D09 | [L1](../knowledge-catalog/index.html#K-D09-011/L1) · [L2](../knowledge-catalog/index.html#K-D09-011/L2) · [L3](../knowledge-catalog/index.html#K-D09-011/L3) | [expanded-advanced.mjs](../knowledge-catalog/expanded-advanced.mjs) · `advanced-bubble` |
| K-D09-012 | Radar Chart 雷达图 | D09 | [L1](../knowledge-catalog/index.html#K-D09-012/L1) · [L2](../knowledge-catalog/index.html#K-D09-012/L2) · [L3](../knowledge-catalog/index.html#K-D09-012/L3) | [expanded-advanced.mjs](../knowledge-catalog/expanded-advanced.mjs) · `advanced-radar` |
| K-D09-013 | Heatmap 热力图 | D09 | [L1](../knowledge-catalog/index.html#K-D09-013/L1) · [L2](../knowledge-catalog/index.html#K-D09-013/L2) · [L3](../knowledge-catalog/index.html#K-D09-013/L3) | [expanded-advanced.mjs](../knowledge-catalog/expanded-advanced.mjs) · `advanced-heatmap` |
| K-D09-014 | Histogram 直方图 | D09 | [L1](../knowledge-catalog/index.html#K-D09-014/L1) · [L2](../knowledge-catalog/index.html#K-D09-014/L2) · [L3](../knowledge-catalog/index.html#K-D09-014/L3) | [expanded-advanced.mjs](../knowledge-catalog/expanded-advanced.mjs) · `advanced-histogram` |
| K-D09-015 | Boxplot 箱线图 | D09 | [L1](../knowledge-catalog/index.html#K-D09-015/L1) · [L2](../knowledge-catalog/index.html#K-D09-015/L2) · [L3](../knowledge-catalog/index.html#K-D09-015/L3) | [expanded-advanced.mjs](../knowledge-catalog/expanded-advanced.mjs) · `advanced-boxplot` |
| K-D09-016 | Treemap 矩形树图 | D09 | [L1](../knowledge-catalog/index.html#K-D09-016/L1) · [L2](../knowledge-catalog/index.html#K-D09-016/L2) · [L3](../knowledge-catalog/index.html#K-D09-016/L3) | [expanded-advanced.mjs](../knowledge-catalog/expanded-advanced.mjs) · `advanced-treemap` |
| K-D09-018 | Funnel 漏斗图 | D09 | [L1](../knowledge-catalog/index.html#K-D09-018/L1) · [L2](../knowledge-catalog/index.html#K-D09-018/L2) · [L3](../knowledge-catalog/index.html#K-D09-018/L3) | [expanded-advanced.mjs](../knowledge-catalog/expanded-advanced.mjs) · `advanced-funnel` |
| K-D09-019 | Gauge 仪表盘 | D09 | [L1](../knowledge-catalog/index.html#K-D09-019/L1) · [L2](../knowledge-catalog/index.html#K-D09-019/L2) · [L3](../knowledge-catalog/index.html#K-D09-019/L3) | [expanded-advanced.mjs](../knowledge-catalog/expanded-advanced.mjs) · `advanced-gauge` |
| K-D09-020 | Waterfall 瀑布图 | D09 | [L1](../knowledge-catalog/index.html#K-D09-020/L1) · [L2](../knowledge-catalog/index.html#K-D09-020/L2) · [L3](../knowledge-catalog/index.html#K-D09-020/L3) | [expanded-advanced.mjs](../knowledge-catalog/expanded-advanced.mjs) · `advanced-waterfall` |
| K-D09-021 | Candlestick K 线图 | D09 | [L1](../knowledge-catalog/index.html#K-D09-021/L1) · [L2](../knowledge-catalog/index.html#K-D09-021/L2) · [L3](../knowledge-catalog/index.html#K-D09-021/L3) | [expanded-advanced.mjs](../knowledge-catalog/expanded-advanced.mjs) · `advanced-candlestick` |
| K-D09-027 | Calendar Heatmap 日历热力图 | D09 | [L1](../knowledge-catalog/index.html#K-D09-027/L1) · [L2](../knowledge-catalog/index.html#K-D09-027/L2) · [L3](../knowledge-catalog/index.html#K-D09-027/L3) | [expanded-advanced.mjs](../knowledge-catalog/expanded-advanced.mjs) · `advanced-calendar` |
| K-D09-028 | Bullet Chart 子弹图 | D09 | [L1](../knowledge-catalog/index.html#K-D09-028/L1) · [L2](../knowledge-catalog/index.html#K-D09-028/L2) · [L3](../knowledge-catalog/index.html#K-D09-028/L3) | [expanded-advanced.mjs](../knowledge-catalog/expanded-advanced.mjs) · `advanced-bullet` |
| K-D09-029 | Sparkline 迷你趋势图 | D09 | [L1](../knowledge-catalog/index.html#K-D09-029/L1) · [L2](../knowledge-catalog/index.html#K-D09-029/L2) · [L3](../knowledge-catalog/index.html#K-D09-029/L3) | [expanded-advanced.mjs](../knowledge-catalog/expanded-advanced.mjs) · `advanced-sparkline` |
| K-D09-031 | Error Bar 误差线图 | D09 | [L1](../knowledge-catalog/index.html#K-D09-031/L1) · [L2](../knowledge-catalog/index.html#K-D09-031/L2) · [L3](../knowledge-catalog/index.html#K-D09-031/L3) | [expanded-advanced.mjs](../knowledge-catalog/expanded-advanced.mjs) · `advanced-error-bar` |
| K-D09-032 | Polar Chart 极坐标图 | D09 | [L1](../knowledge-catalog/index.html#K-D09-032/L1) · [L2](../knowledge-catalog/index.html#K-D09-032/L2) · [L3](../knowledge-catalog/index.html#K-D09-032/L3) | [expanded-advanced.mjs](../knowledge-catalog/expanded-advanced.mjs) · `advanced-polar` |
| K-D09-035 | Range Chart 区间图 | D09 | [L1](../knowledge-catalog/index.html#K-D09-035/L1) · [L2](../knowledge-catalog/index.html#K-D09-035/L2) · [L3](../knowledge-catalog/index.html#K-D09-035/L3) | [expanded-advanced.mjs](../knowledge-catalog/expanded-advanced.mjs) · `advanced-range` |
| K-D09-036 | Chart Legend 图例 | D09 | [L1](../knowledge-catalog/index.html#K-D09-036/L1) · [L2](../knowledge-catalog/index.html#K-D09-036/L2) · [L3](../knowledge-catalog/index.html#K-D09-036/L3) | [expanded-advanced.mjs](../knowledge-catalog/expanded-advanced.mjs) · `advanced-legend` |
| K-D09-038 | Chart Axis 坐标轴 | D09 | [L1](../knowledge-catalog/index.html#K-D09-038/L1) · [L2](../knowledge-catalog/index.html#K-D09-038/L2) · [L3](../knowledge-catalog/index.html#K-D09-038/L3) | [expanded-advanced.mjs](../knowledge-catalog/expanded-advanced.mjs) · `advanced-axis` |
| K-D09-040 | Chart Data Zoom 数据缩放 | D09 | [L1](../knowledge-catalog/index.html#K-D09-040/L1) · [L2](../knowledge-catalog/index.html#K-D09-040/L2) · [L3](../knowledge-catalog/index.html#K-D09-040/L3) | [expanded-advanced.mjs](../knowledge-catalog/expanded-advanced.mjs) · `advanced-data-zoom` |

### D10 地图与地理可视化（14 个主题）

| ID | 原名 | 领域 | 三层直达链接 | 实现 / kind |
| --- | --- | --- | --- | --- |
| K-D10-001 | Map View 地图视图 | D10 | [L1](../knowledge-catalog/index.html#K-D10-001/L1) · [L2](../knowledge-catalog/index.html#K-D10-001/L2) · [L3](../knowledge-catalog/index.html#K-D10-001/L3) | [expanded-advanced.mjs](../knowledge-catalog/expanded-advanced.mjs) · `advanced-map-view` |
| K-D10-002 | Map Marker 地图标记 | D10 | [L1](../knowledge-catalog/index.html#K-D10-002/L1) · [L2](../knowledge-catalog/index.html#K-D10-002/L2) · [L3](../knowledge-catalog/index.html#K-D10-002/L3) | [curriculum-demos.mjs](../knowledge-catalog/curriculum-demos.mjs) · `marker` |
| K-D10-003 | Marker Clustering 标记聚合 | D10 | [L1](../knowledge-catalog/index.html#K-D10-003/L1) · [L2](../knowledge-catalog/index.html#K-D10-003/L2) · [L3](../knowledge-catalog/index.html#K-D10-003/L3) | [expanded-advanced.mjs](../knowledge-catalog/expanded-advanced.mjs) · `advanced-clustering` |
| K-D10-013 | Layer Manager 图层管理器 | D10 | [L1](../knowledge-catalog/index.html#K-D10-013/L1) · [L2](../knowledge-catalog/index.html#K-D10-013/L2) · [L3](../knowledge-catalog/index.html#K-D10-013/L3) | [curriculum-demos.mjs](../knowledge-catalog/curriculum-demos.mjs) · `layers` |
| K-D10-017 | GeoJSON Viewer 地理数据查看器 | D10 | [L1](../knowledge-catalog/index.html#K-D10-017/L1) · [L2](../knowledge-catalog/index.html#K-D10-017/L2) · [L3](../knowledge-catalog/index.html#K-D10-017/L3) | [curriculum-demos.mjs](../knowledge-catalog/curriculum-demos.mjs) · `geojson` |
| K-D10-018 | Feature Inspector 地理要素检查器 | D10 | [L1](../knowledge-catalog/index.html#K-D10-018/L1) · [L2](../knowledge-catalog/index.html#K-D10-018/L2) · [L3](../knowledge-catalog/index.html#K-D10-018/L3) | [curriculum-demos.mjs](../knowledge-catalog/curriculum-demos.mjs) · `inspector` |
| K-D10-019 | Map Expression 地图表达式 | D10 | [L1](../knowledge-catalog/index.html#K-D10-019/L1) · [L2](../knowledge-catalog/index.html#K-D10-019/L2) · [L3](../knowledge-catalog/index.html#K-D10-019/L3) | [expanded-advanced.mjs](../knowledge-catalog/expanded-advanced.mjs) · `advanced-map-expression` |
| K-D10-021 | Route Visualization 路线展示 | D10 | [L1](../knowledge-catalog/index.html#K-D10-021/L1) · [L2](../knowledge-catalog/index.html#K-D10-021/L2) · [L3](../knowledge-catalog/index.html#K-D10-021/L3) | [expanded-advanced.mjs](../knowledge-catalog/expanded-advanced.mjs) · `advanced-route` |
| K-D10-022 | Route Editing 路线编辑 | D10 | [L1](../knowledge-catalog/index.html#K-D10-022/L1) · [L2](../knowledge-catalog/index.html#K-D10-022/L2) · [L3](../knowledge-catalog/index.html#K-D10-022/L3) | [expanded-advanced.mjs](../knowledge-catalog/expanded-advanced.mjs) · `advanced-route-edit` |
| K-D10-023 | Geofence 地理围栏 | D10 | [L1](../knowledge-catalog/index.html#K-D10-023/L1) · [L2](../knowledge-catalog/index.html#K-D10-023/L2) · [L3](../knowledge-catalog/index.html#K-D10-023/L3) | [expanded-advanced.mjs](../knowledge-catalog/expanded-advanced.mjs) · `advanced-geofence` |
| K-D10-025 | Choropleth Map 分级统计地图 | D10 | [L1](../knowledge-catalog/index.html#K-D10-025/L1) · [L2](../knowledge-catalog/index.html#K-D10-025/L2) · [L3](../knowledge-catalog/index.html#K-D10-025/L3) | [expanded-advanced.mjs](../knowledge-catalog/expanded-advanced.mjs) · `advanced-choropleth` |
| K-D10-027 | Spatial Measurement 空间测量 | D10 | [L1](../knowledge-catalog/index.html#K-D10-027/L1) · [L2](../knowledge-catalog/index.html#K-D10-027/L2) · [L3](../knowledge-catalog/index.html#K-D10-027/L3) | [expanded-advanced.mjs](../knowledge-catalog/expanded-advanced.mjs) · `advanced-measurement` |
| K-D10-028 | Spatial Query 空间查询 | D10 | [L1](../knowledge-catalog/index.html#K-D10-028/L1) · [L2](../knowledge-catalog/index.html#K-D10-028/L2) · [L3](../knowledge-catalog/index.html#K-D10-028/L3) | [expanded-advanced.mjs](../knowledge-catalog/expanded-advanced.mjs) · `advanced-spatial-query` |
| K-D10-029 | Map Camera 地图视角控制 | D10 | [L1](../knowledge-catalog/index.html#K-D10-029/L1) · [L2](../knowledge-catalog/index.html#K-D10-029/L2) · [L3](../knowledge-catalog/index.html#K-D10-029/L3) | [expanded-advanced.mjs](../knowledge-catalog/expanded-advanced.mjs) · `advanced-camera` |

### D11 流程图、节点与画布编辑（19 个主题）

| ID | 原名 | 领域 | 三层直达链接 | 实现 / kind |
| --- | --- | --- | --- | --- |
| K-D11-004 | Zoom / Pan 缩放与平移 | D11 | [L1](../knowledge-catalog/index.html#K-D11-004/L1) · [L2](../knowledge-catalog/index.html#K-D11-004/L2) · [L3](../knowledge-catalog/index.html#K-D11-004/L3) | [curriculum-demos.mjs](../knowledge-catalog/curriculum-demos.mjs) · `viewport` |
| K-D11-005 | Selection Box 框选 | D11 | [L1](../knowledge-catalog/index.html#K-D11-005/L1) · [L2](../knowledge-catalog/index.html#K-D11-005/L2) · [L3](../knowledge-catalog/index.html#K-D11-005/L3) | [expanded-advanced.mjs](../knowledge-catalog/expanded-advanced.mjs) · `advanced-selection` |
| K-D11-006 | Multi Selection 多选对象 | D11 | [L1](../knowledge-catalog/index.html#K-D11-006/L1) · [L2](../knowledge-catalog/index.html#K-D11-006/L2) · [L3](../knowledge-catalog/index.html#K-D11-006/L3) | [curriculum-demos.mjs](../knowledge-catalog/curriculum-demos.mjs) · `selection` |
| K-D11-007 | Snap to Grid 网格吸附 | D11 | [L1](../knowledge-catalog/index.html#K-D11-007/L1) · [L2](../knowledge-catalog/index.html#K-D11-007/L2) · [L3](../knowledge-catalog/index.html#K-D11-007/L3) | [curriculum-demos.mjs](../knowledge-catalog/curriculum-demos.mjs) · `snap` |
| K-D11-008 | Alignment Guides 对齐辅助线 | D11 | [L1](../knowledge-catalog/index.html#K-D11-008/L1) · [L2](../knowledge-catalog/index.html#K-D11-008/L2) · [L3](../knowledge-catalog/index.html#K-D11-008/L3) | [expanded-advanced.mjs](../knowledge-catalog/expanded-advanced.mjs) · `advanced-alignment` |
| K-D11-012 | Canvas Ruler 标尺 | D11 | [L1](../knowledge-catalog/index.html#K-D11-012/L1) · [L2](../knowledge-catalog/index.html#K-D11-012/L2) · [L3](../knowledge-catalog/index.html#K-D11-012/L3) | [expanded-advanced.mjs](../knowledge-catalog/expanded-advanced.mjs) · `advanced-ruler` |
| K-D11-014 | Canvas Clipboard 画布剪贴板 | D11 | [L1](../knowledge-catalog/index.html#K-D11-014/L1) · [L2](../knowledge-catalog/index.html#K-D11-014/L2) · [L3](../knowledge-catalog/index.html#K-D11-014/L3) | [expanded-advanced.mjs](../knowledge-catalog/expanded-advanced.mjs) · `advanced-clipboard` |
| K-D11-015 | Canvas Undo / Redo 画布撤销重做 | D11 | [L1](../knowledge-catalog/index.html#K-D11-015/L1) · [L2](../knowledge-catalog/index.html#K-D11-015/L2) · [L3](../knowledge-catalog/index.html#K-D11-015/L3) | [expanded-advanced.mjs](../knowledge-catalog/expanded-advanced.mjs) · `advanced-canvas-history` |
| K-D11-017 | Shape Editor 图形编辑器 | D11 | [L1](../knowledge-catalog/index.html#K-D11-017/L1) · [L2](../knowledge-catalog/index.html#K-D11-017/L2) · [L3](../knowledge-catalog/index.html#K-D11-017/L3) | [expanded-advanced.mjs](../knowledge-catalog/expanded-advanced.mjs) · `advanced-shape-editor` |
| K-D11-019 | Connector 连线工具 | D11 | [L1](../knowledge-catalog/index.html#K-D11-019/L1) · [L2](../knowledge-catalog/index.html#K-D11-019/L2) · [L3](../knowledge-catalog/index.html#K-D11-019/L3) | [expanded-advanced.mjs](../knowledge-catalog/expanded-advanced.mjs) · `advanced-connector` |
| K-D11-026 | Node Resizer 节点调整大小 | D11 | [L1](../knowledge-catalog/index.html#K-D11-026/L1) · [L2](../knowledge-catalog/index.html#K-D11-026/L2) · [L3](../knowledge-catalog/index.html#K-D11-026/L3) | [expanded-advanced.mjs](../knowledge-catalog/expanded-advanced.mjs) · `advanced-resizer` |
| K-D11-027 | Node Grouping 节点分组 | D11 | [L1](../knowledge-catalog/index.html#K-D11-027/L1) · [L2](../knowledge-catalog/index.html#K-D11-027/L2) · [L3](../knowledge-catalog/index.html#K-D11-027/L3) | [expanded-advanced.mjs](../knowledge-catalog/expanded-advanced.mjs) · `advanced-grouping` |
| K-D11-028 | Node Validation 节点校验 | D11 | [L1](../knowledge-catalog/index.html#K-D11-028/L1) · [L2](../knowledge-catalog/index.html#K-D11-028/L2) · [L3](../knowledge-catalog/index.html#K-D11-028/L3) | [expanded-advanced.mjs](../knowledge-catalog/expanded-advanced.mjs) · `advanced-node-validation` |
| K-D11-029 | Edge Validation 连线校验 | D11 | [L1](../knowledge-catalog/index.html#K-D11-029/L1) · [L2](../knowledge-catalog/index.html#K-D11-029/L2) · [L3](../knowledge-catalog/index.html#K-D11-029/L3) | [expanded-advanced.mjs](../knowledge-catalog/expanded-advanced.mjs) · `advanced-edge-validation` |
| K-D11-030 | Auto Layout 自动布局 | D11 | [L1](../knowledge-catalog/index.html#K-D11-030/L1) · [L2](../knowledge-catalog/index.html#K-D11-030/L2) · [L3](../knowledge-catalog/index.html#K-D11-030/L3) | [expanded-advanced.mjs](../knowledge-catalog/expanded-advanced.mjs) · `advanced-auto-layout` |
| K-D11-031 | Edge Routing 连线路径规划 | D11 | [L1](../knowledge-catalog/index.html#K-D11-031/L1) · [L2](../knowledge-catalog/index.html#K-D11-031/L2) · [L3](../knowledge-catalog/index.html#K-D11-031/L3) | [expanded-advanced.mjs](../knowledge-catalog/expanded-advanced.mjs) · `advanced-routing` |
| K-D11-032 | Diagram Serialization 图形序列化 | D11 | [L1](../knowledge-catalog/index.html#K-D11-032/L1) · [L2](../knowledge-catalog/index.html#K-D11-032/L2) · [L3](../knowledge-catalog/index.html#K-D11-032/L3) | [expanded-advanced.mjs](../knowledge-catalog/expanded-advanced.mjs) · `advanced-serialization` |
| K-D11-033 | Flowchart 流程图 | D11 | [L1](../knowledge-catalog/index.html#K-D11-033/L1) · [L2](../knowledge-catalog/index.html#K-D11-033/L2) · [L3](../knowledge-catalog/index.html#K-D11-033/L3) | [curriculum-demos.mjs](../knowledge-catalog/curriculum-demos.mjs) · `flow` |
| K-D11-040 | Dependency Graph 依赖关系图 | D11 | [L1](../knowledge-catalog/index.html#K-D11-040/L1) · [L2](../knowledge-catalog/index.html#K-D11-040/L2) · [L3](../knowledge-catalog/index.html#K-D11-040/L3) | [expanded-advanced.mjs](../knowledge-catalog/expanded-advanced.mjs) · `advanced-dependency` |

### D12 企业业务组件与工作流（4 个主题）

| ID | 原名 | 领域 | 三层直达链接 | 实现 / kind |
| --- | --- | --- | --- | --- |
| K-D12-001 | Kanban Board 看板 | D12 | [L1](../knowledge-catalog/index.html#K-D12-001/L1) · [L2](../knowledge-catalog/index.html#K-D12-001/L2) · [L3](../knowledge-catalog/index.html#K-D12-001/L3) | [curriculum-demos.mjs](../knowledge-catalog/curriculum-demos.mjs) · `kanban` |
| K-D12-004 | Advanced Filter 高级筛选器 | D12 | [L1](../knowledge-catalog/index.html#K-D12-004/L1) · [L2](../knowledge-catalog/index.html#K-D12-004/L2) · [L3](../knowledge-catalog/index.html#K-D12-004/L3) | [curriculum-demos.mjs](../knowledge-catalog/curriculum-demos.mjs) · `advanced` |
| K-D12-006 | Approval Flow 审批流程 | D12 | [L1](../knowledge-catalog/index.html#K-D12-006/L1) · [L2](../knowledge-catalog/index.html#K-D12-006/L2) · [L3](../knowledge-catalog/index.html#K-D12-006/L3) | [curriculum-demos.mjs](../knowledge-catalog/curriculum-demos.mjs) · `approval` |
| K-D12-008 | Step Wizard 分步向导 | D12 | [L1](../knowledge-catalog/index.html#K-D12-008/L1) · [L2](../knowledge-catalog/index.html#K-D12-008/L2) · [L3](../knowledge-catalog/index.html#K-D12-008/L3) | [curriculum-demos.mjs](../knowledge-catalog/curriculum-demos.mjs) · `wizard` |

### D13 多人协作与实时交互（4 个主题）

| ID | 原名 | 领域 | 三层直达链接 | 实现 / kind |
| --- | --- | --- | --- | --- |
| K-D13-009 | Typing Indicator 正在输入提示 | D13 | [L1](../knowledge-catalog/index.html#K-D13-009/L1) · [L2](../knowledge-catalog/index.html#K-D13-009/L2) · [L3](../knowledge-catalog/index.html#K-D13-009/L3) | [curriculum-demos.mjs](../knowledge-catalog/curriculum-demos.mjs) · `typing` |
| K-D13-017 | Comment Resolution 评论解决 | D13 | [L1](../knowledge-catalog/index.html#K-D13-017/L1) · [L2](../knowledge-catalog/index.html#K-D13-017/L2) · [L3](../knowledge-catalog/index.html#K-D13-017/L3) | [curriculum-demos.mjs](../knowledge-catalog/curriculum-demos.mjs) · `resolution` |
| K-D13-029 | Edit Lock 编辑锁 | D13 | [L1](../knowledge-catalog/index.html#K-D13-029/L1) · [L2](../knowledge-catalog/index.html#K-D13-029/L2) · [L3](../knowledge-catalog/index.html#K-D13-029/L3) | [curriculum-demos.mjs](../knowledge-catalog/curriculum-demos.mjs) · `lock` |
| K-D13-034 | CRDT 协同数据类型 | D13 | [L1](../knowledge-catalog/index.html#K-D13-034/L1) · [L2](../knowledge-catalog/index.html#K-D13-034/L2) · [L3](../knowledge-catalog/index.html#K-D13-034/L3) | [curriculum-demos.mjs](../knowledge-catalog/curriculum-demos.mjs) · `counter` |

### D14 AI / Agent 专题（4 个主题）

| ID | 原名 | 领域 | 三层直达链接 | 实现 / kind |
| --- | --- | --- | --- | --- |
| K-D14-007 | Conversation Branch 对话分支 | D14 | [L1](../knowledge-catalog/index.html#K-D14-007/L1) · [L2](../knowledge-catalog/index.html#K-D14-007/L2) · [L3](../knowledge-catalog/index.html#K-D14-007/L3) | [curriculum-demos.mjs](../knowledge-catalog/curriculum-demos.mjs) · `branch` |
| K-D14-012 | Prompt Variables 提示词变量 | D14 | [L1](../knowledge-catalog/index.html#K-D14-012/L1) · [L2](../knowledge-catalog/index.html#K-D14-012/L2) · [L3](../knowledge-catalog/index.html#K-D14-012/L3) | [curriculum-demos.mjs](../knowledge-catalog/curriculum-demos.mjs) · `prompt` |
| K-D14-013 | Structured Output 结构化输出 | D14 | [L1](../knowledge-catalog/index.html#K-D14-013/L1) · [L2](../knowledge-catalog/index.html#K-D14-013/L2) · [L3](../knowledge-catalog/index.html#K-D14-013/L3) | [curriculum-demos.mjs](../knowledge-catalog/curriculum-demos.mjs) · `structured` |
| K-D14-043 | Tool Call Card 工具调用卡片 | D14 | [L1](../knowledge-catalog/index.html#K-D14-043/L1) · [L2](../knowledge-catalog/index.html#K-D14-043/L2) · [L3](../knowledge-catalog/index.html#K-D14-043/L3) | [curriculum-demos.mjs](../knowledge-catalog/curriculum-demos.mjs) · `tool` |

### D15 无障碍、国际化与主题（4 个主题）

| ID | 原名 | 领域 | 三层直达链接 | 实现 / kind |
| --- | --- | --- | --- | --- |
| K-D15-015 | Reduced Motion 减少动态效果 | D15 | [L1](../knowledge-catalog/index.html#K-D15-015/L1) · [L2](../knowledge-catalog/index.html#K-D15-015/L2) · [L3](../knowledge-catalog/index.html#K-D15-015/L3) | [curriculum-demos.mjs](../knowledge-catalog/curriculum-demos.mjs) · `motion` |
| K-D15-021 | Color Contrast 色彩对比度 | D15 | [L1](../knowledge-catalog/index.html#K-D15-021/L1) · [L2](../knowledge-catalog/index.html#K-D15-021/L2) · [L3](../knowledge-catalog/index.html#K-D15-021/L3) | [curriculum-demos.mjs](../knowledge-catalog/curriculum-demos.mjs) · `contrast` |
| K-D15-030 | Date Formatting 日期格式化 | D15 | [L1](../knowledge-catalog/index.html#K-D15-030/L1) · [L2](../knowledge-catalog/index.html#K-D15-030/L2) · [L3](../knowledge-catalog/index.html#K-D15-030/L3) | [curriculum-demos.mjs](../knowledge-catalog/curriculum-demos.mjs) · `date` |
| K-D15-031 | Number Formatting 数字格式化 | D15 | [L1](../knowledge-catalog/index.html#K-D15-031/L1) · [L2](../knowledge-catalog/index.html#K-D15-031/L2) · [L3](../knowledge-catalog/index.html#K-D15-031/L3) | [curriculum-demos.mjs](../knowledge-catalog/curriculum-demos.mjs) · `locale` |

### D16 工程化交互与系统运行模式（34 个主题）

| ID | 原名 | 领域 | 三层直达链接 | 实现 / kind |
| --- | --- | --- | --- | --- |
| K-D16-004 | Debounce 防抖 | D16 | [L1](../knowledge-catalog/index.html#K-D16-004/L1) · [L2](../knowledge-catalog/index.html#K-D16-004/L2) · [L3](../knowledge-catalog/index.html#K-D16-004/L3) | [curriculum-demos.mjs](../knowledge-catalog/curriculum-demos.mjs) · `debounce` |
| K-D16-005 | Throttle 节流 | D16 | [L1](../knowledge-catalog/index.html#K-D16-005/L1) · [L2](../knowledge-catalog/index.html#K-D16-005/L2) · [L3](../knowledge-catalog/index.html#K-D16-005/L3) | [expanded-advanced.mjs](../knowledge-catalog/expanded-advanced.mjs) · `advanced-throttle` |
| K-D16-006 | Request Cancellation 请求取消 | D16 | [L1](../knowledge-catalog/index.html#K-D16-006/L1) · [L2](../knowledge-catalog/index.html#K-D16-006/L2) · [L3](../knowledge-catalog/index.html#K-D16-006/L3) | [curriculum-demos.mjs](../knowledge-catalog/curriculum-demos.mjs) · `cancellation` |
| K-D16-016 | Request Timeout 请求超时 | D16 | [L1](../knowledge-catalog/index.html#K-D16-016/L1) · [L2](../knowledge-catalog/index.html#K-D16-016/L2) · [L3](../knowledge-catalog/index.html#K-D16-016/L3) | [curriculum-demos.mjs](../knowledge-catalog/curriculum-demos.mjs) · `timeout` |
| K-D16-017 | Cache Management 缓存管理 | D16 | [L1](../knowledge-catalog/index.html#K-D16-017/L1) · [L2](../knowledge-catalog/index.html#K-D16-017/L2) · [L3](../knowledge-catalog/index.html#K-D16-017/L3) | [expanded-advanced.mjs](../knowledge-catalog/expanded-advanced.mjs) · `advanced-cache` |
| K-D16-018 | Cache Invalidation 缓存失效 | D16 | [L1](../knowledge-catalog/index.html#K-D16-018/L1) · [L2](../knowledge-catalog/index.html#K-D16-018/L2) · [L3](../knowledge-catalog/index.html#K-D16-018/L3) | [expanded-advanced.mjs](../knowledge-catalog/expanded-advanced.mjs) · `advanced-invalidation` |
| K-D16-019 | Cache Key 缓存键设计 | D16 | [L1](../knowledge-catalog/index.html#K-D16-019/L1) · [L2](../knowledge-catalog/index.html#K-D16-019/L2) · [L3](../knowledge-catalog/index.html#K-D16-019/L3) | [expanded-advanced.mjs](../knowledge-catalog/expanded-advanced.mjs) · `advanced-cache-key` |
| K-D16-023 | Data Normalization 数据规范化 | D16 | [L1](../knowledge-catalog/index.html#K-D16-023/L1) · [L2](../knowledge-catalog/index.html#K-D16-023/L2) · [L3](../knowledge-catalog/index.html#K-D16-023/L3) | [expanded-advanced.mjs](../knowledge-catalog/expanded-advanced.mjs) · `advanced-normalization` |
| K-D16-029 | Cache Eviction 缓存淘汰 | D16 | [L1](../knowledge-catalog/index.html#K-D16-029/L1) · [L2](../knowledge-catalog/index.html#K-D16-029/L2) · [L3](../knowledge-catalog/index.html#K-D16-029/L3) | [expanded-advanced.mjs](../knowledge-catalog/expanded-advanced.mjs) · `advanced-eviction` |
| K-D16-032 | Exponential Backoff 指数退避 | D16 | [L1](../knowledge-catalog/index.html#K-D16-032/L1) · [L2](../knowledge-catalog/index.html#K-D16-032/L2) · [L3](../knowledge-catalog/index.html#K-D16-032/L3) | [expanded-advanced.mjs](../knowledge-catalog/expanded-advanced.mjs) · `advanced-backoff` |
| K-D16-036 | Idempotency 幂等性 | D16 | [L1](../knowledge-catalog/index.html#K-D16-036/L1) · [L2](../knowledge-catalog/index.html#K-D16-036/L2) · [L3](../knowledge-catalog/index.html#K-D16-036/L3) | [expanded-advanced.mjs](../knowledge-catalog/expanded-advanced.mjs) · `advanced-idempotency` |
| K-D16-038 | Transaction Handling 事务处理 | D16 | [L1](../knowledge-catalog/index.html#K-D16-038/L1) · [L2](../knowledge-catalog/index.html#K-D16-038/L2) · [L3](../knowledge-catalog/index.html#K-D16-038/L3) | [expanded-advanced.mjs](../knowledge-catalog/expanded-advanced.mjs) · `advanced-transaction` |
| K-D16-040 | Partial Failure Handling 部分失败处理 | D16 | [L1](../knowledge-catalog/index.html#K-D16-040/L1) · [L2](../knowledge-catalog/index.html#K-D16-040/L2) · [L3](../knowledge-catalog/index.html#K-D16-040/L3) | [expanded-advanced.mjs](../knowledge-catalog/expanded-advanced.mjs) · `advanced-partial-failure` |
| K-D16-044 | Optimistic Lock 乐观锁 | D16 | [L1](../knowledge-catalog/index.html#K-D16-044/L1) · [L2](../knowledge-catalog/index.html#K-D16-044/L2) · [L3](../knowledge-catalog/index.html#K-D16-044/L3) | [expanded-advanced.mjs](../knowledge-catalog/expanded-advanced.mjs) · `advanced-optimistic-lock` |
| K-D16-047 | Last Write Wins 最后写入优先 | D16 | [L1](../knowledge-catalog/index.html#K-D16-047/L1) · [L2](../knowledge-catalog/index.html#K-D16-047/L2) · [L3](../knowledge-catalog/index.html#K-D16-047/L3) | [expanded-advanced.mjs](../knowledge-catalog/expanded-advanced.mjs) · `advanced-last-write` |
| K-D16-048 | Merge Strategy 数据合并策略 | D16 | [L1](../knowledge-catalog/index.html#K-D16-048/L1) · [L2](../knowledge-catalog/index.html#K-D16-048/L2) · [L3](../knowledge-catalog/index.html#K-D16-048/L3) | [expanded-advanced.mjs](../knowledge-catalog/expanded-advanced.mjs) · `advanced-merge` |
| K-D16-049 | Event Sourcing 事件溯源 | D16 | [L1](../knowledge-catalog/index.html#K-D16-049/L1) · [L2](../knowledge-catalog/index.html#K-D16-049/L2) · [L3](../knowledge-catalog/index.html#K-D16-049/L3) | [expanded-advanced.mjs](../knowledge-catalog/expanded-advanced.mjs) · `advanced-event-sourcing` |
| K-D16-052 | Data Reconciliation 数据对账 | D16 | [L1](../knowledge-catalog/index.html#K-D16-052/L1) · [L2](../knowledge-catalog/index.html#K-D16-052/L2) · [L3](../knowledge-catalog/index.html#K-D16-052/L3) | [expanded-advanced.mjs](../knowledge-catalog/expanded-advanced.mjs) · `advanced-reconciliation` |
| K-D16-054 | State Machine 状态机 | D16 | [L1](../knowledge-catalog/index.html#K-D16-054/L1) · [L2](../knowledge-catalog/index.html#K-D16-054/L2) · [L3](../knowledge-catalog/index.html#K-D16-054/L3) | [expanded-advanced.mjs](../knowledge-catalog/expanded-advanced.mjs) · `advanced-state-machine` |
| K-D16-055 | State Transition Validation 状态转换校验 | D16 | [L1](../knowledge-catalog/index.html#K-D16-055/L1) · [L2](../knowledge-catalog/index.html#K-D16-055/L2) · [L3](../knowledge-catalog/index.html#K-D16-055/L3) | [expanded-advanced.mjs](../knowledge-catalog/expanded-advanced.mjs) · `advanced-transition-validation` |
| K-D16-056 | Dirty Form 脏表单检测 | D16 | [L1](../knowledge-catalog/index.html#K-D16-056/L1) · [L2](../knowledge-catalog/index.html#K-D16-056/L2) · [L3](../knowledge-catalog/index.html#K-D16-056/L3) | [expanded-advanced.mjs](../knowledge-catalog/expanded-advanced.mjs) · `advanced-dirty-form` |
| K-D16-059 | Undo / Redo 撤销与重做 | D16 | [L1](../knowledge-catalog/index.html#K-D16-059/L1) · [L2](../knowledge-catalog/index.html#K-D16-059/L2) · [L3](../knowledge-catalog/index.html#K-D16-059/L3) | [curriculum-demos.mjs](../knowledge-catalog/curriculum-demos.mjs) · `history` |
| K-D16-060 | Command Pattern 命令模式 | D16 | [L1](../knowledge-catalog/index.html#K-D16-060/L1) · [L2](../knowledge-catalog/index.html#K-D16-060/L2) · [L3](../knowledge-catalog/index.html#K-D16-060/L3) | [expanded-advanced.mjs](../knowledge-catalog/expanded-advanced.mjs) · `advanced-command` |
| K-D16-065 | Batch Processing 批量处理 | D16 | [L1](../knowledge-catalog/index.html#K-D16-065/L1) · [L2](../knowledge-catalog/index.html#K-D16-065/L2) · [L3](../knowledge-catalog/index.html#K-D16-065/L3) | [expanded-advanced.mjs](../knowledge-catalog/expanded-advanced.mjs) · `advanced-batch` |
| K-D16-066 | Bulk Operation Recovery 批量操作恢复 | D16 | [L1](../knowledge-catalog/index.html#K-D16-066/L1) · [L2](../knowledge-catalog/index.html#K-D16-066/L2) · [L3](../knowledge-catalog/index.html#K-D16-066/L3) | [expanded-advanced.mjs](../knowledge-catalog/expanded-advanced.mjs) · `advanced-bulk-recovery` |
| K-D16-080 | Sensitive Data Masking 敏感数据脱敏 | D16 | [L1](../knowledge-catalog/index.html#K-D16-080/L1) · [L2](../knowledge-catalog/index.html#K-D16-080/L2) · [L3](../knowledge-catalog/index.html#K-D16-080/L3) | [expanded-advanced.mjs](../knowledge-catalog/expanded-advanced.mjs) · `advanced-masking` |
| K-D16-085 | Virtualization 虚拟化 | D16 | [L1](../knowledge-catalog/index.html#K-D16-085/L1) · [L2](../knowledge-catalog/index.html#K-D16-085/L2) · [L3](../knowledge-catalog/index.html#K-D16-085/L3) | [expanded-advanced.mjs](../knowledge-catalog/expanded-advanced.mjs) · `advanced-virtualization` |
| K-D16-086 | Memoization 记忆化 | D16 | [L1](../knowledge-catalog/index.html#K-D16-086/L1) · [L2](../knowledge-catalog/index.html#K-D16-086/L2) · [L3](../knowledge-catalog/index.html#K-D16-086/L3) | [expanded-advanced.mjs](../knowledge-catalog/expanded-advanced.mjs) · `advanced-memoization` |
| K-D16-098 | Dependency Injection 依赖注入 | D16 | [L1](../knowledge-catalog/index.html#K-D16-098/L1) · [L2](../knowledge-catalog/index.html#K-D16-098/L2) · [L3](../knowledge-catalog/index.html#K-D16-098/L3) | [expanded-advanced.mjs](../knowledge-catalog/expanded-advanced.mjs) · `advanced-injection` |
| K-D16-099 | Repository Pattern 仓储模式 | D16 | [L1](../knowledge-catalog/index.html#K-D16-099/L1) · [L2](../knowledge-catalog/index.html#K-D16-099/L2) · [L3](../knowledge-catalog/index.html#K-D16-099/L3) | [expanded-advanced.mjs](../knowledge-catalog/expanded-advanced.mjs) · `advanced-repository` |
| K-D16-100 | Service Layer 服务层 | D16 | [L1](../knowledge-catalog/index.html#K-D16-100/L1) · [L2](../knowledge-catalog/index.html#K-D16-100/L2) · [L3](../knowledge-catalog/index.html#K-D16-100/L3) | [expanded-advanced.mjs](../knowledge-catalog/expanded-advanced.mjs) · `advanced-service` |
| K-D16-101 | Event Bus 事件总线 | D16 | [L1](../knowledge-catalog/index.html#K-D16-101/L1) · [L2](../knowledge-catalog/index.html#K-D16-101/L2) · [L3](../knowledge-catalog/index.html#K-D16-101/L3) | [expanded-advanced.mjs](../knowledge-catalog/expanded-advanced.mjs) · `advanced-event-bus` |
| K-D16-104 | Configuration Management 配置管理 | D16 | [L1](../knowledge-catalog/index.html#K-D16-104/L1) · [L2](../knowledge-catalog/index.html#K-D16-104/L2) · [L3](../knowledge-catalog/index.html#K-D16-104/L3) | [expanded-advanced.mjs](../knowledge-catalog/expanded-advanced.mjs) · `advanced-configuration` |
| K-D16-106 | Logging 日志系统 | D16 | [L1](../knowledge-catalog/index.html#K-D16-106/L1) · [L2](../knowledge-catalog/index.html#K-D16-106/L2) · [L3](../knowledge-catalog/index.html#K-D16-106/L3) | [expanded-advanced.mjs](../knowledge-catalog/expanded-advanced.mjs) · `advanced-logging` |
