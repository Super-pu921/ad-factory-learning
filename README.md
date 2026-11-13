# ad-factory-learning
软件开发零基础学习手册

V8 学习工作台保留原有课程、组件演示和实训，并提供 D01–D16 可运行组件与分层教学。

- [打开学习工作台](https://super-pu921.github.io/ad-factory-learning/)
- [浏览可运行教学组件](https://super-pu921.github.io/ad-factory-learning/knowledge-catalog/?teaching=1)
- [821 个教学主题逐项清单与 L1/L2/L3 链接](docs/V8-COMPONENTS-CURRENT.md)

| 内容 | 数量 |
| --- | ---: |
| 可运行教学主题（不重复 canonical 知识 ID） | 821 |
| L1 / L2 / L3 教学单元 | 2463 |
| 原有课程 / 原有组件演示 / 场景 | 90 / 88 / 6 |
| 完整知识目录入口 / 初步独立概念 | 840 / 833 |

一个教学主题对应三层单元；单元、目录和旧演示不相加计数。本批 513 个剩余概念中新增 501 项教学，12 项因缺少必要服务或运行条件明确跳过；833 个独立概念均有去向。原有 320 项教学内容与身份保持不变。演示使用有界的真实页面机制、算法和合成数据，具体能力和限制写在单元内，不等于已经接入真实后端、模型推理或完整生产服务。生产迁移保持 **BLOCKED**，正式迁移 Course 为 0。原课程和学习记录不因新目录而迁移或改写。

文件练习只使用项目内合成 PDF、DOCX、XLSX、PNG、MP4、WAV 和字幕。需要保存的示例须显式操作，只读写当前主题专用 `adFactoryLearning.v8.teaching.sandbox.${knowledgeId}` 键；不遍历或迁移原学习记录。地图缓存使用专用合成 cache，不清理其他缓存。浏览器验收使用全新隔离上下文和虚拟位置，不读取真实浏览器账户或设备位置。

使用 Node 22 运行已有验证，无需新增项目依赖：

```powershell
node scripts/test-v8-curriculum.mjs
node scripts/test-v8-expanded-basic.mjs
node scripts/test-v8-expanded-advanced.mjs
node scripts/test-v8-expanded-curriculum.mjs
node scripts/test-v8-remaining-ui.mjs
node scripts/test-v8-remaining-systems.mjs
node scripts/test-v8-remaining-engineering.mjs
node scripts/test-v8-remaining-curriculum.mjs
```

浏览器检查使用既有 Playwright，在隔离上下文中执行；本地静态预览默认端口为 8768。可通过 `V8_PLAYWRIGHT_MODULE` 指向已有安装，通过 `V8_CATALOG_TEST_URL` 指定预览或正式站。最终测试和部署状态以实际执行证据为准，源码清单不代替验收。
