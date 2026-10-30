软件开发学习手册 V3（手机版修复）

问题说明：iPhone 文件 App、聊天附件的 HTML 预览有时不运行 JavaScript，因此界面会显示，但按钮不会响应。这不是简单 CSS 修改能够解决的问题。

推荐使用方法：
1. 在 GitHub 新建一个公开仓库（不要放个人业务数据），例如 ad-factory-learning。
2. 把 ZIP 解压后根目录中的 index.html、sw.js、manifest.webmanifest 和三个 PNG 图标上传到仓库根目录。
3. 打开仓库 Settings → Pages，在 Build and deployment 中选择 Deploy from a branch；Branch 选择 main 和 /(root)，保存。
4. 等待 GitHub Pages 显示网址，然后在 iPhone Safari 中打开该 HTTPS 地址。
5. 首次加载后，在 Safari 中选择分享 → 添加到主屏幕，之后可尝试离线打开已缓存的课程。请先在有网情况下加载和确认交互正常。

重要限制：
- 在 iPhone 直接从“文件”App 预览单个 HTML，仍然可能只显示页面而不执行脚本。V3 会在此情况下展示可阅读的 67 课静态内容和提示，而不是保留无响应的按钮。
- 电脑版可直接双击“软件开发学习手册_V3_移动端修复.html”在 Chrome/Edge 中离线使用。
- 学习进度保存在当前浏览器或已安装 Web App 的本地存储中，不会自动跨浏览器同步。更换打开方式前应使用设置中的 JSON 导出并在新环境导入。
- GitHub Pages 上的网页文件公开可读；不要上传客户、订单、个人信息或密钥。
