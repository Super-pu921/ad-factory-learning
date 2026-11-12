# ad-factory-learning
软件开发零基础学习手册

V8 学习工作台保留原有课程、组件演示和实训，并提供 D01–D16 可运行组件与分层教学。

- [打开学习工作台](https://super-pu921.github.io/ad-factory-learning/)
- [浏览可运行教学组件](https://super-pu921.github.io/ad-factory-learning/knowledge-catalog/?teaching=1)
- [320 个组件逐项清单与 L1/L2/L3 链接](docs/V8-COMPONENTS-320.md)

| 内容 | 数量 |
| --- | ---: |
| 可运行教学组件（不重复 canonical 知识 ID） | 320 |
| L1 / L2 / L3 教学单元 | 960 |
| 原有课程 / 原有组件演示 / 场景 | 90 / 88 / 6 |
| 完整知识目录入口 / 初步独立概念 | 840 / 833 |

一个教学组件对应三层单元；单元、目录和旧演示不相加计数。演示使用有界的页面机制与虚构数据，具体能力和限制写在单元内，不等于已经接入真实后端服务。未覆盖的 513 个概念仍待建设，生产迁移保持 **BLOCKED**。原课程和学习记录不因新教学目录而迁移或改写。

使用 Node 22 运行已有验证，无需新增项目依赖：

```powershell
node scripts/test-v8-curriculum.mjs
node scripts/test-v8-expanded-basic.mjs
node scripts/test-v8-expanded-advanced.mjs
node scripts/test-v8-expanded-curriculum.mjs
```

浏览器检查使用既有 Playwright，在隔离上下文中执行；本地静态预览默认端口为 8768。可通过 `V8_PLAYWRIGHT_MODULE` 指向已有安装，通过 `V8_CATALOG_TEST_URL` 指定预览或正式站。最终测试和部署状态以实际执行证据为准，源码清单不代替验收。
