# 合成教学素材与独立参考

这里没有用户文档、照片、录音或业务记录。

- PDF：自行编写的有效 PDF 1.4，两页 240×140 pt，未压缩 ASCII 文本。独立 pypdf 解析得到 `V8 FIXTURE PAGE 1 / qty=2` 与 `V8 FIXTURE PAGE 2 / qty=3`。
- DOCX/XLSX：自行建立的最小 OOXML、ZIP store 包。Python zipfile CRC 检查通过；段落与两张工作表单元格有固定参考。
- MP4：FFmpeg testsrc，160×90、4 fps、1.5秒，H.264 baseline、yuv420p，无音轨。
- WAV：Python标准库生成的16kHz、16bit单声道、1.5秒440Hz合成音。
- VTT：自行编写的两条英文字幕。
- `format-reference.json`：已安装 reportlab 的 QR Version1、固定mask0、四种纠错级别及 Code39 独立结果，以及 pypdf/ZIP 的文字、单元格参考。不是从本项目算法反向生成的测试期望。
- QR 矩阵另在任务外证据目录光栅化，经已安装 FFmpeg quirc 解出 `HELLO`，不是仅比较图片外观。
- `prior-teaching-hashes.json`：任务起点 e802005a6e5830b81e29081608bcdfe5323ab4d9 的320主题内容SHA-256，用于保留既有教学对象及单元身份。

运行测试不需要Python、FFmpeg或新增依赖；参考及素材已固定随仓库交付。运行时的PDF/OOXML支持范围明确写在对应单元，未支持的压缩、脚本、加密、公式、共享字符串等不会被当成已成功解析。
