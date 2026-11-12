/** Topic-specific teaching seeds; IDs/titles copied from the protected source catalog. */
export const basicSeeds=[
  {
    "knowledgeId": "K-D01-004",
    "kind": "visual-group",
    "title": "Button Group 按钮组",
    "observe": "按钮组把相关操作放在同一组内，选中值独立于按钮外观。",
    "verify": "A/B 互斥，aria-pressed 与选中项同步。",
    "apply": "为虚构工单工具区选择 A 或 B，不累计两次业务操作。"
  },
  {
    "knowledgeId": "K-D01-005",
    "kind": "visual-split",
    "title": "Split Button 分裂按钮",
    "observe": "分裂按钮保留主动作并提供次级动作。",
    "verify": "保存与导出使用不同动作值，展开菜单不执行主动作。",
    "apply": "把工单保存作为默认入口，导出作为次级入口。"
  },
  {
    "knowledgeId": "K-D01-006",
    "kind": "visual-fab",
    "title": "Floating Action Button",
    "observe": "悬浮主操作在内容区内保持醒目的创建入口。",
    "verify": "激活后创建计数增加，计数限定 0–9。",
    "apply": "在教学看板中创建虚构卡片。"
  },
  {
    "knowledgeId": "K-D01-007",
    "kind": "visual-toggle",
    "title": "Toggle Button 切换按钮",
    "observe": "切换按钮有持续的选中状态。",
    "verify": "一次激活翻转 pressed，禁用选项不会伪装第三种状态。",
    "apply": "打开或关闭教学预览网格。"
  },
  {
    "knowledgeId": "K-D01-008",
    "kind": "visual-toolbar",
    "title": "Toolbar 工具栏",
    "observe": "工具栏把同一上下文的操作集中排列。",
    "verify": "方向键移动焦点，对齐选项 left/center/right 互斥。",
    "apply": "调整虚构工单标题的对齐方式。"
  },
  {
    "knowledgeId": "K-D01-009",
    "kind": "visual-type",
    "title": "Typography 排版文字",
    "observe": "字号改变可读性与内容占用，正文仍保留语义。",
    "verify": "字号限制 12–32px，内容不因字号变化而丢失。",
    "apply": "比较窄屏工单标题的两种字号。"
  },
  {
    "knowledgeId": "K-D01-010",
    "kind": "visual-icon",
    "title": "Icon 图标",
    "observe": "图标的外观与可访问名称分别提供信息。",
    "verify": "info/check 白名单图形与文字名称一致。",
    "apply": "切换工单信息和检查通过图形。"
  },
  {
    "knowledgeId": "K-D01-011",
    "kind": "visual-avatar",
    "title": "Avatar 头像",
    "observe": "头像缺图时仍可用姓名缩写表达身份。",
    "verify": "两个姓名片段生成两个首字母，不读取账户头像。",
    "apply": "区分虚构成员 An Bo 和 Li Na。"
  },
  {
    "knowledgeId": "K-D01-012",
    "kind": "visual-avatars",
    "title": "Avatar Group 头像组",
    "observe": "头像组用可见成员与溢出数量表达集合。",
    "verify": "可见数加溢出数恒为三个成员。",
    "apply": "限制窄屏成员显示数量，同时保留总数。"
  },
  {
    "knowledgeId": "K-D01-014",
    "kind": "visual-chip",
    "title": "Chip / Tag 标签",
    "observe": "标签用可移除的小块表示有限选项。",
    "verify": "移除只影响指定标签；不接受重复 ID。",
    "apply": "撤回虚构工单的一项筛选标签。"
  },
  {
    "knowledgeId": "K-D01-015",
    "kind": "visual-label",
    "title": "Label 字段标签",
    "observe": "字段标签通过 for 与控件建立程序关联。",
    "verify": "点击标签聚焦对应输入框，切换目标更新关联。",
    "apply": "为工单名称和数量提供准确标签。"
  },
  {
    "knowledgeId": "K-D01-016",
    "kind": "visual-divider",
    "title": "Divider 分隔线",
    "observe": "分隔线表达内容分组而不是可点击操作。",
    "verify": "水平与垂直方向反映在 separator 语义和样式上。",
    "apply": "在教学工具栏与正文间分隔内容。"
  },
  {
    "knowledgeId": "K-D01-018",
    "kind": "visual-swatch",
    "title": "Color Swatch 色板",
    "observe": "色板同时显示颜色和可读的颜色值。",
    "verify": "仅接受六位十六进制颜色，不靠色块独自传递信息。",
    "apply": "核对虚构工单的蓝色与绿色分类。"
  },
  {
    "knowledgeId": "K-D01-019",
    "kind": "visual-key",
    "title": "Keyboard Key 快捷键视觉",
    "observe": "kbd 元素呈现快捷键按键组合。",
    "verify": "Ctrl+K 与 Shift+Enter 分成独立按键展示，不接管系统快捷键。",
    "apply": "在命令说明中明确按键组合。"
  },
  {
    "knowledgeId": "K-D01-020",
    "kind": "visual-code",
    "title": "Inline Code 行内代码",
    "observe": "行内代码按文本展示符号与表达式。",
    "verify": "输入的 HTML 保持普通代码文字，不进入可执行 DOM。",
    "apply": "在教学说明中显示含尖括号的示例。"
  },
  {
    "knowledgeId": "K-D01-021",
    "kind": "visual-theme",
    "title": "Theme Switch 主题切换",
    "observe": "主题变量仅改变教学预览的前景与背景。",
    "verify": "light/dark 切换不改工作台根样式。",
    "apply": "比较同一虚构卡片的两种主题。"
  },
  {
    "knowledgeId": "K-D01-022",
    "kind": "visual-density",
    "title": "Density Control 密度控制",
    "observe": "密度控制改变行内留白而不删减数据。",
    "verify": "compact 为4px，normal为12px，条目身份与数量不变。",
    "apply": "让窄屏教学列表保留完整内容。"
  },
  {
    "knowledgeId": "K-D02-001",
    "kind": "layout-container",
    "title": "Container 容器",
    "observe": "容器约束内容宽度并在可用空间内排列。",
    "verify": "宽度在160–520px内，预览最大宽度不超过父级。",
    "apply": "约束工单详情的阅读宽度。"
  },
  {
    "knowledgeId": "K-D02-005",
    "kind": "layout-stack",
    "title": "Stack 垂直布局",
    "observe": "垂直布局沿块轴顺序排列项目。",
    "verify": "flex-direction 为column，项目顺序不变。",
    "apply": "按步骤竖排教学表单字段。"
  },
  {
    "knowledgeId": "K-D02-006",
    "kind": "layout-inline",
    "title": "Inline Layout 行内布局",
    "observe": "行内布局沿同一行安排短内容。",
    "verify": "行内子项按DOM顺序排列，可用宽度受容器限制。",
    "apply": "并排显示工单编号和状态。"
  },
  {
    "knowledgeId": "K-D02-007",
    "kind": "layout-cluster",
    "title": "Cluster Layout 集群布局",
    "observe": "集群布局允许多项按宽度自动换行。",
    "verify": "flex-wrap 为wrap，窄容器产生更多行。",
    "apply": "让多个工单筛选标签自然换行。"
  },
  {
    "knowledgeId": "K-D02-008",
    "kind": "layout-masonry",
    "title": "Masonry 瀑布流",
    "observe": "多栏布局让不同高度卡片沿列流动。",
    "verify": "CSS columns 呈现两栏；不声称按最短列执行JS布局。",
    "apply": "比较不同说明长度的教学卡片。"
  },
  {
    "knowledgeId": "K-D02-010",
    "kind": "layout-split",
    "title": "Split Layout 分栏布局",
    "observe": "分栏布局将主内容与辅助内容并置。",
    "verify": "两列比例改变时两侧内容仍保留。",
    "apply": "在工单列表旁放置摘要。"
  },
  {
    "knowledgeId": "K-D02-011",
    "kind": "layout-splitter",
    "title": "Splitter 分隔调整器",
    "observe": "分隔调整器通过可聚焦分隔条调整相邻区域。",
    "verify": "左右键以10个百分点调整分栏比例，限制20–80%。",
    "apply": "用键盘为工单详情分配更多宽度。"
  },
  {
    "knowledgeId": "K-D02-012",
    "kind": "layout-resizable",
    "title": "Resizable Panels 可调整面板",
    "observe": "可调整面板提供有边界的尺寸修改。",
    "verify": "面板保留 resize 手柄及可操作宽度输入，内容不丢失。",
    "apply": "调整教学备注面板的宽度。"
  },
  {
    "knowledgeId": "K-D02-013",
    "kind": "layout-scroll",
    "title": "Scroll Area 滚动区域",
    "observe": "滚动区域限制视口并保留所有项目。",
    "verify": "滚动只改变区域位置，项目总数仍为八个。",
    "apply": "查看长工单列表底部条目。"
  },
  {
    "knowledgeId": "K-D02-014",
    "kind": "layout-shell",
    "title": "App Shell 应用框架",
    "observe": "应用框架组织header、sidebar、main和footer。",
    "verify": "区域身份分别保留，侧栏隐藏不删除主内容。",
    "apply": "在同一教学框内切换紧凑导航。"
  },
  {
    "knowledgeId": "K-D02-015",
    "kind": "layout-header",
    "title": "Header 页面顶部区域",
    "observe": "顶部区域标识当前页面与主要操作。",
    "verify": "header 保留标题，展开辅助内容不替换标题。",
    "apply": "为工单详情放置页面标题和辅助动作。"
  },
  {
    "knowledgeId": "K-D02-016",
    "kind": "layout-footer",
    "title": "Footer 页面底部区域",
    "observe": "底部区域承载与当前内容相关的补充操作。",
    "verify": "footer 排在正文之后，状态更新仍在底部区域内。",
    "apply": "在工单预览末尾显示审核结果。"
  },
  {
    "knowledgeId": "K-D02-017",
    "kind": "layout-sidebar",
    "title": "Sidebar 侧边栏",
    "observe": "侧边栏为主内容提供相邻导航。",
    "verify": "折叠时侧栏隐藏，主内容保持可见。",
    "apply": "在窄宽度下收起教学导航。"
  },
  {
    "knowledgeId": "K-D02-018",
    "kind": "layout-panel",
    "title": "Panel 内容面板",
    "observe": "内容面板是有标题和独立边界的内容块。",
    "verify": "折叠控制同步 hidden 与 aria-expanded。",
    "apply": "临时折叠虚构工单备注。"
  },
  {
    "knowledgeId": "K-D02-019",
    "kind": "layout-affix",
    "title": "Affix 固定定位",
    "observe": "固定定位依据包含块而不随内部滚动移动。",
    "verify": "演示使用带transform的局部包含块，不固定整个工作台。",
    "apply": "比较内部滚动时的教学操作标记。"
  },
  {
    "knowledgeId": "K-D02-020",
    "kind": "layout-sticky",
    "title": "Sticky Region 粘性区域",
    "observe": "粘性区域在自己的滚动容器内保持顶端位置。",
    "verify": "滚动后标题仍位于容器顶部，未脱离其父区域。",
    "apply": "在长工单记录内保留列标题。"
  },
  {
    "knowledgeId": "K-D02-021",
    "kind": "layout-portal",
    "title": "Portal 渲染门户",
    "observe": "门户改变节点的DOM挂载位置。",
    "verify": "实际把同一节点移到相邻门户根，而不是复制节点。",
    "apply": "让教学提示脱离原内容容器。"
  },
  {
    "knowledgeId": "K-D02-022",
    "kind": "layout-overlayroot",
    "title": "Overlay Root 浮层根节点",
    "observe": "浮层根提供有界的叠放坐标系。",
    "verify": "浮层在局部根内绝对定位，不遮挡主站导航。",
    "apply": "在工单预览上方显示局部提示。"
  },
  {
    "knowledgeId": "K-D02-023",
    "kind": "layout-responsive",
    "title": "Responsive Layout 响应式布局",
    "observe": "响应式排列由可用宽度决定列数。",
    "verify": "auto-fit 网格按最小轨道宽度重新排版。",
    "apply": "比较160px和240px教学容器内的卡片。"
  },
  {
    "knowledgeId": "K-D02-024",
    "kind": "layout-query",
    "title": "Container Queries 容器查询",
    "observe": "容器查询按祖先容器宽度应用样式。",
    "verify": "使用container-type与真实@container规则，200px为示例断点。",
    "apply": "让同一工单摘要适应侧栏和主区。"
  },
  {
    "knowledgeId": "K-D02-025",
    "kind": "layout-dashboard",
    "title": "Dashboard Grid 仪表盘网格",
    "observe": "仪表盘网格允许部分项目跨列。",
    "verify": "首卡跨两列，重排不改变五个卡片身份。",
    "apply": "排列虚构工单指标与说明。"
  },
  {
    "knowledgeId": "K-D02-026",
    "kind": "layout-safearea",
    "title": "Safe Area Layout 安全区域布局",
    "observe": "安全区域内边距为设备遮挡保留空间。",
    "verify": "真实env安全区与明确标注的24px模拟附加值分别计算。",
    "apply": "观察教学框底部操作的留白，不声称真机刘海验收。"
  },
  {
    "knowledgeId": "K-D03-002",
    "kind": "nav-anchor",
    "title": "Anchor 锚点导航",
    "observe": "锚点导航把局部滚动区移到目标章节。",
    "verify": "点击链接滚动对应章节，不改外层知识路由。",
    "apply": "在工单预览的三节说明间定位。"
  },
  {
    "knowledgeId": "K-D03-003",
    "kind": "nav-menu",
    "title": "Menu 菜单",
    "observe": "菜单承载一组可执行动作。",
    "verify": "选择动作后当前内容变化，方向键移动菜单项焦点。",
    "apply": "选择工单的概览、记录或操作视图。"
  },
  {
    "knowledgeId": "K-D03-004",
    "kind": "nav-menubar",
    "title": "Menubar 菜单栏",
    "observe": "菜单栏持续提供一排菜单动作。",
    "verify": "左右键及Home/End移动焦点，激活才改变选择。",
    "apply": "通过键盘操作教学菜单栏。"
  },
  {
    "knowledgeId": "K-D03-005",
    "kind": "nav-navigation",
    "title": "Navigation Menu 导航菜单",
    "observe": "导航菜单标记当前视图位置。",
    "verify": "aria-current 只出现在当前目标。",
    "apply": "在三页虚构工单内容间切换。"
  },
  {
    "knowledgeId": "K-D03-006",
    "kind": "nav-dropdown",
    "title": "Dropdown Menu 下拉菜单",
    "observe": "下拉菜单先展开再选择动作。",
    "verify": "触发器的expanded与菜单可见性同步，选中后关闭。",
    "apply": "从紧凑工具区进入教学记录。"
  },
  {
    "knowledgeId": "K-D03-009",
    "kind": "nav-stepper",
    "title": "Stepper 步骤指示",
    "observe": "步骤指示器呈现有序阶段与当前步骤。",
    "verify": "当前步骤在1–3内，未把查看步骤当作保存完成。",
    "apply": "查看工单建单、检查与交付三个阶段。"
  },
  {
    "knowledgeId": "K-D03-010",
    "kind": "nav-bottom",
    "title": "Bottom Navigation 底部导航",
    "observe": "底部导航为有限的主要视图提供入口。",
    "verify": "三项导航保留文字和当前项，不改主站四导航。",
    "apply": "切换教学框内的工单内容。"
  },
  {
    "knowledgeId": "K-D03-011",
    "kind": "nav-speed",
    "title": "Speed Dial 快捷操作菜单",
    "observe": "快捷操作菜单从一个主入口展开多项动作。",
    "verify": "收起时动作不可见，选择后恢复收起状态。",
    "apply": "从教学创建入口选择后续操作。"
  },
  {
    "knowledgeId": "K-D03-012",
    "kind": "nav-command",
    "title": "Command Palette 命令面板",
    "observe": "命令面板把文本筛选与命令选择组合。",
    "verify": "过滤只匹配白名单命令，不执行任意字符串。",
    "apply": "输入工单关键词后执行匹配命令。"
  },
  {
    "knowledgeId": "K-D03-013",
    "kind": "nav-tree",
    "title": "Tree Navigation 树形导航",
    "observe": "树形导航保留父子层级与可展开状态。",
    "verify": "展开父节点后显示子项，选中项身份不因折叠丢失。",
    "apply": "从虚构项目树进入工单或记录。"
  },
  {
    "knowledgeId": "K-D03-014",
    "kind": "nav-tour",
    "title": "Tour 新手引导",
    "observe": "引导步骤把说明和当前目标关联。",
    "verify": "三个目标中只有当前目标被高亮。",
    "apply": "按顺序识别工单区的三个区域。"
  },
  {
    "knowledgeId": "K-D03-015",
    "kind": "nav-backtop",
    "title": "Back To Top 返回顶部",
    "observe": "返回顶部只改变目标滚动区域的位置。",
    "verify": "滚动区回到scrollTop=0，原内容仍保留。",
    "apply": "从长工单说明底部回到标题。"
  },
  {
    "knowledgeId": "K-D03-016",
    "kind": "nav-pageheader",
    "title": "Page Header 页面标题栏",
    "observe": "页面标题栏结合当前位置与返回动作。",
    "verify": "返回只回到本示例概览，不操作浏览器历史。",
    "apply": "在虚构工单详情中恢复概览。"
  },
  {
    "knowledgeId": "K-D03-017",
    "kind": "nav-link",
    "title": "Nav Link 导航链接",
    "observe": "导航链接把目的地与当前位置状态分开表达。",
    "verify": "使用真实a元素，并在局部处理演示目标。",
    "apply": "标明当前查看的工单页面。"
  },
  {
    "knowledgeId": "K-D03-019",
    "kind": "nav-collapse",
    "title": "Collapsible 折叠内容",
    "observe": "折叠内容通过原生details与summary组织。",
    "verify": "关闭时正文隐藏，再展开仍保留原内容。",
    "apply": "收起和恢复教学工单的补充说明。"
  },
  {
    "knowledgeId": "K-D03-020",
    "kind": "nav-rail",
    "title": "Navigation Rail 导航轨道",
    "observe": "导航轨道用窄区域呈现图形与名称。",
    "verify": "纵向入口保留可读名称与当前项。",
    "apply": "在窄教学框内切换工单子页。"
  },
  {
    "knowledgeId": "K-D03-021",
    "kind": "nav-mega",
    "title": "Mega Menu 大型菜单",
    "observe": "大型菜单把入口按组排列。",
    "verify": "分组标题与命令分开，选择命令后收起菜单。",
    "apply": "从两组教学入口选择工单或记录。"
  },
  {
    "knowledgeId": "K-D04-002",
    "kind": "field-textarea",
    "title": "Textarea 多行输入框",
    "observe": "多行输入保留换行。",
    "verify": "行数由实际换行计算，空白提交被拒绝。",
    "apply": "录入三行虚构工单备注。"
  },
  {
    "knowledgeId": "K-D04-004",
    "kind": "field-password",
    "title": "Password Input 密码输入",
    "observe": "密码输入默认隐藏字符。",
    "verify": "显隐切换不改值，结果只显示长度。",
    "apply": "核对教学密码而不把原文写入反馈。"
  },
  {
    "knowledgeId": "K-D04-005",
    "kind": "field-email",
    "title": "Email Input 邮箱输入",
    "observe": "邮箱输入提供浏览器语义及有界格式检查。",
    "verify": "本例只接受简单ASCII邮箱，不声称覆盖所有邮件地址。",
    "apply": "为虚构联系人检查example.test地址。"
  },
  {
    "knowledgeId": "K-D04-006",
    "kind": "field-url",
    "title": "URL Input 网址输入",
    "observe": "网址输入验证语法和允许的协议。",
    "verify": "只允许无凭据HTTPS，javascript协议被拒绝。",
    "apply": "审阅虚构工单的资料链接但不导航。"
  },
  {
    "knowledgeId": "K-D04-007",
    "kind": "field-phone",
    "title": "Phone Input 手机号输入",
    "observe": "手机号输入按约定格式校验。",
    "verify": "本例限定大陆11位格式，反馈只显示脱敏号码。",
    "apply": "检查虚构联系人号码，不发送短信。"
  },
  {
    "knowledgeId": "K-D04-008",
    "kind": "field-search",
    "title": "Search Input 搜索输入框",
    "observe": "搜索输入驱动静态数据过滤。",
    "verify": "匹配实际行字段，清除与空输入分别处理。",
    "apply": "查找虚构工单B。"
  },
  {
    "knowledgeId": "K-D04-009",
    "kind": "field-mask",
    "title": "Masked Input 格式化输入",
    "observe": "格式化输入将原始数字与展示分组分开。",
    "verify": "六位数字显示成三位加连字符，不接受混入字母。",
    "apply": "核对教学编号的原始值与格式化值。"
  },
  {
    "knowledgeId": "K-D04-010",
    "kind": "field-currency",
    "title": "Currency Input 货币输入",
    "observe": "货币输入用整数分保留金额精度。",
    "verify": "0.10解析为10分，超过两位小数被拒绝。",
    "apply": "审阅虚构工单的演示单价。"
  },
  {
    "knowledgeId": "K-D04-011",
    "kind": "field-percent",
    "title": "Percentage Input 百分比输入",
    "observe": "百分比输入约束有效上下界。",
    "verify": "仅接受0–100的普通十进制，单位不进入数值。",
    "apply": "输入教学工单完成比例。"
  },
  {
    "knowledgeId": "K-D04-012",
    "kind": "field-unit",
    "title": "Unit Input 单位输入",
    "observe": "带单位输入把数值和单位分开。",
    "verify": "mm独立显示，非负范围为0–1000。",
    "apply": "填写虚构工单的毫米长度。"
  },
  {
    "knowledgeId": "K-D04-013",
    "kind": "field-checkbox",
    "title": "Checkbox 复选框",
    "observe": "复选框表达独立的二值选择。",
    "verify": "选中与取消都能提交明确布尔值。",
    "apply": "确认或取消教学工单检查项。"
  },
  {
    "knowledgeId": "K-D04-015",
    "kind": "field-radio",
    "title": "Radio Button 单选按钮",
    "observe": "单选按钮在同名组内互斥。",
    "verify": "选中B后A不再选中。",
    "apply": "选择虚构工单材料方案。"
  },
  {
    "knowledgeId": "K-D04-017",
    "kind": "field-switch",
    "title": "Switch 开关",
    "observe": "开关表达即时的开启和关闭状态。",
    "verify": "role=switch的checked与可见状态同步。",
    "apply": "开启教学预览标记。"
  },
  {
    "knowledgeId": "K-D04-018",
    "kind": "field-toggles",
    "title": "Toggle Group 切换按钮组",
    "observe": "切换按钮组允许有限的多项开关组合。",
    "verify": "每项pressed独立，ID集合无重复。",
    "apply": "选择教学工单中要显示的工具。"
  },
  {
    "knowledgeId": "K-D04-019",
    "kind": "field-select",
    "title": "Select 下拉选择",
    "observe": "下拉选择把值限制在既定选项。",
    "verify": "显示名称和提交ID分开，未知ID不被接受。",
    "apply": "为虚构工单选择A/B/C方案。"
  },
  {
    "knowledgeId": "K-D04-020",
    "kind": "field-multi",
    "title": "Multi Select 多选下拉",
    "observe": "多选下拉保留多个独立选中值。",
    "verify": "集合无重复，未选择的选项不进入结果。",
    "apply": "选择虚构工单的多个工艺。"
  },
  {
    "knowledgeId": "K-D04-021",
    "kind": "field-combo",
    "title": "Combobox 组合框",
    "observe": "组合框允许输入并选择已有选项。",
    "verify": "演示输入最终必须命中A/B/C白名单。",
    "apply": "用键盘输入工单方案ID。"
  },
  {
    "knowledgeId": "K-D04-022",
    "kind": "field-auto",
    "title": "Autocomplete 自动完成",
    "observe": "自动完成显示有限静态建议。",
    "verify": "建议按输入过滤，选择后才形成合法完整值。",
    "apply": "从教学方案中补全C。"
  },
  {
    "knowledgeId": "K-D04-023",
    "kind": "field-cascade",
    "title": "Cascader 级联选择",
    "observe": "级联选择的子项受父项限制。",
    "verify": "east/CD非法，切换父项重置子项。",
    "apply": "选择华东上海或西部成都教学区域。"
  },
  {
    "knowledgeId": "K-D04-024",
    "kind": "field-tree",
    "title": "Tree Select 树形选择",
    "observe": "树形选择在层级结构中选定叶节点。",
    "verify": "叶节点保持完整父子路径，不能拼出不存在的路径。",
    "apply": "从演示地区树选一个目的地。"
  },
  {
    "knowledgeId": "K-D04-025",
    "kind": "field-transfer",
    "title": "Transfer 穿梭选择",
    "observe": "穿梭选择将项从候选区转到选中区。",
    "verify": "同一ID只存在于一个选中集合，支持移回。",
    "apply": "为虚构工单分配A和C教学工序。"
  },
  {
    "knowledgeId": "K-D04-026",
    "kind": "field-tags",
    "title": "Tag Input 标签输入",
    "observe": "标签输入将文本拆为有限唯一集合。",
    "verify": "只接受最多五个小写短标签。",
    "apply": "维护教学工单red/blue分类。"
  },
  {
    "knowledgeId": "K-D04-027",
    "kind": "field-mentions",
    "title": "Mentions 提及输入",
    "observe": "提及输入引用既有成员名。",
    "verify": "仅An和Bo可被解析为提及，不查找真实账户。",
    "apply": "在虚构工单备注中提及Bo。"
  },
  {
    "knowledgeId": "K-D04-028",
    "kind": "field-async",
    "title": "Async Select 异步选择",
    "observe": "异步选择在结果到达前区分加载与可选状态。",
    "verify": "本地延时加载有取消清理，等待期间控件禁用。",
    "apply": "等待教学方案数据后选择B。"
  },
  {
    "knowledgeId": "K-D04-029",
    "kind": "field-date",
    "title": "Date Picker 日期选择",
    "observe": "日期选择区分有效日历日期和字符串。",
    "verify": "二月三十日被拒绝，不静默滚入三月。",
    "apply": "选择虚构工单2026年六月七日。"
  },
  {
    "knowledgeId": "K-D04-030",
    "kind": "field-daterange",
    "title": "Date Range Picker 日期范围",
    "observe": "日期范围由有序的两个日期组成。",
    "verify": "起点不能晚于终点，两个端点都要合法。",
    "apply": "安排虚构工单的两日制作窗口。"
  },
  {
    "knowledgeId": "K-D04-031",
    "kind": "field-time",
    "title": "Time Picker 时间选择",
    "observe": "时间选择在24小时钟内表达分钟。",
    "verify": "时为00–23，分为00–59。",
    "apply": "选择教学班次的17:30。"
  },
  {
    "knowledgeId": "K-D04-032",
    "kind": "field-timerange",
    "title": "Time Range Picker 时间范围",
    "observe": "时间范围需要明确顺序约定。",
    "verify": "本例不跨午夜，结束早于开始被拒绝。",
    "apply": "审阅虚构班次10:00到12:30。"
  },
  {
    "knowledgeId": "K-D04-033",
    "kind": "field-month",
    "title": "Month Picker 月份选择",
    "observe": "月份选择只表达年与月。",
    "verify": "月份限定01–12，不补造具体业务日期。",
    "apply": "选择教学报表月份。"
  },
  {
    "knowledgeId": "K-D04-034",
    "kind": "field-year",
    "title": "Year Picker 年份选择",
    "observe": "年份选择使用明确的年限。",
    "verify": "本例1900–2100，不改系统日期。",
    "apply": "选择教学档案年份2030。"
  },
  {
    "knowledgeId": "K-D04-035",
    "kind": "field-week",
    "title": "Week Picker 周选择",
    "observe": "ISO周以周所属年和周序号表示。",
    "verify": "按年份判断52或53周，2025-W53被拒绝。",
    "apply": "比较教学周与普通日期。"
  },
  {
    "knowledgeId": "K-D04-036",
    "kind": "field-calendar",
    "title": "Calendar Grid 日历网格",
    "observe": "日历网格把日期安排进周与日的位置。",
    "verify": "六月30天实际可选，选中日期同步输入与结果。",
    "apply": "从六月网格选择七日。"
  },
  {
    "knowledgeId": "K-D04-037",
    "kind": "field-datetime",
    "title": "Date Time Picker 日期时间",
    "observe": "日期时间组合保留本地墙钟语义。",
    "verify": "本例不声称带有时区，日期与时间分别校验。",
    "apply": "选择教学工单的17:30本地时间。"
  },
  {
    "knowledgeId": "K-D04-038",
    "kind": "field-slider",
    "title": "Slider 滑动条",
    "observe": "滑动条为有界数值提供连续控制。",
    "verify": "范围0–100，键盘增减同步输出。",
    "apply": "调整虚构预览强度到60。"
  },
  {
    "knowledgeId": "K-D04-039",
    "kind": "field-range",
    "title": "Range Slider 双端滑动条",
    "observe": "双端滑块共同表示一个区间。",
    "verify": "下界不能超过上界，两个端点分别可操作。",
    "apply": "选择教学工单数量区间30–70。"
  },
  {
    "knowledgeId": "K-D04-040",
    "kind": "field-stepper",
    "title": "Stepper Input 步进输入",
    "observe": "步进输入遵守固定步长。",
    "verify": "从2加到4，奇数被拒绝而不是悄悄取整。",
    "apply": "按偶数批量调整教学工单数量。"
  },
  {
    "knowledgeId": "K-D04-041",
    "kind": "field-color",
    "title": "Color Picker 颜色选择",
    "observe": "颜色选择提供可见色块与可编辑值。",
    "verify": "结果保留六位十六进制颜色。",
    "apply": "为虚构工单选择绿色标识。"
  },
  {
    "knowledgeId": "K-D04-042",
    "kind": "field-otp",
    "title": "OTP Input 验证码输入",
    "observe": "验证码输入组织固定长度数字。",
    "verify": "六位数字分别显示，不验证真实身份或发送短信。",
    "apply": "核对教学验证码654321。"
  },
  {
    "knowledgeId": "K-D04-043",
    "kind": "field-signature",
    "title": "Signature Pad 手写签名",
    "observe": "手写板将指针轨迹转为有界坐标点。",
    "verify": "支持画线、示例轨迹和清空；不采集真实签名。",
    "apply": "在教学网格中描绘虚构折线。"
  },
  {
    "knowledgeId": "K-D04-045",
    "kind": "field-form",
    "title": "Form 表单",
    "observe": "表单将多字段作为一次校验单位。",
    "verify": "名称必填且数量1–10，失败不提交部分值。",
    "apply": "检查虚构工单Bo数量3。"
  },
  {
    "knowledgeId": "K-D04-046",
    "kind": "field-field",
    "title": "Form Field 表单字段",
    "observe": "表单字段把标签、值和错误关联。",
    "verify": "空名称错误关联到当前输入而不是整页。",
    "apply": "修复虚构工单缺少的名称。"
  },
  {
    "knowledgeId": "K-D04-047",
    "kind": "field-fieldset",
    "title": "Fieldset 字段分组",
    "observe": "字段分组通过fieldset与legend说明共同目的。",
    "verify": "同组姓名和数量一起提交，legend保持可读。",
    "apply": "区分教学联系人组与其他内容。"
  },
  {
    "knowledgeId": "K-D04-048",
    "kind": "field-inputgroup",
    "title": "Input Group 输入组合",
    "observe": "输入组合把固定前后缀与原始值分离。",
    "verify": "金额分值计算不读取前缀符号。",
    "apply": "核对虚构工单¥0.10的实际分值。"
  },
  {
    "knowledgeId": "K-D04-049",
    "kind": "field-dynamic",
    "title": "Dynamic Form 动态表单",
    "observe": "动态表单按当前字段清单构建输入。",
    "verify": "删除字段不删除其他字段，字段ID必须唯一。",
    "apply": "给教学工单新增备注输入。"
  },
  {
    "knowledgeId": "K-D04-050",
    "kind": "field-builder",
    "title": "Form Builder 表单构建器",
    "observe": "表单构建器只解释受限字段配置。",
    "verify": "白名单name/qty/note，不执行表达式或未知属性。",
    "apply": "建立教学工单名称加备注的小表单。"
  },
  {
    "knowledgeId": "K-D04-051",
    "kind": "field-repeat",
    "title": "Repeatable Field 重复字段组",
    "observe": "重复字段组用稳定ID保留多项值。",
    "verify": "添加或移除一项不交换其他项身份。",
    "apply": "把第三项教学工序C加入工单。"
  },
  {
    "knowledgeId": "K-D04-052",
    "kind": "field-condition",
    "title": "Conditional Field 条件字段",
    "observe": "条件字段只在当前条件下参与校验。",
    "verify": "公司分支需要公司名，切换条件显隐一致。",
    "apply": "为虚构公司ACME显示公司字段。"
  },
  {
    "knowledgeId": "K-D04-053",
    "kind": "field-summary",
    "title": "Validation Summary 校验汇总",
    "observe": "校验汇总集中呈现字段错误并指回输入。",
    "verify": "修正名称数量后旧错误消失，不显示成功假象。",
    "apply": "一次定位虚构工单的两个缺失字段。"
  },
  {
    "knowledgeId": "K-D05-001",
    "kind": "grid-card",
    "title": "Card 信息卡片",
    "observe": "信息卡片展示单个实体的摘要。",
    "verify": "切换实体ID时标题、数量和分值同步。",
    "apply": "查看虚构工单B的摘要。"
  },
  {
    "knowledgeId": "K-D05-002",
    "kind": "grid-list",
    "title": "List 列表",
    "observe": "列表表达同构条目集合。",
    "verify": "按cut/print过滤，不修改原三行。",
    "apply": "列出同一教学工艺的工单。"
  },
  {
    "knowledgeId": "K-D05-003",
    "kind": "grid-descriptions",
    "title": "Descriptions 详情描述",
    "observe": "详情描述为字段提供明确的名称和值。",
    "verify": "选定行后用dl/dt/dd展示相同实体。",
    "apply": "核对虚构工单B的详情字段。"
  },
  {
    "knowledgeId": "K-D05-007",
    "kind": "grid-log",
    "title": "Activity Log 操作记录",
    "observe": "操作记录用序号保存事件的可读顺序。",
    "verify": "本地操作产生记录，序号与动作分别显示。",
    "apply": "观察教学审核动作记录。"
  },
  {
    "knowledgeId": "K-D05-008",
    "kind": "grid-calendar",
    "title": "Calendar 日历",
    "observe": "日历展示一天与其内容的关系。",
    "verify": "固定2026年六月，合法日号映射到真实日期。",
    "apply": "定位教学工单七日安排。"
  },
  {
    "knowledgeId": "K-D05-009",
    "kind": "grid-scheduler",
    "title": "Scheduler 资源排程",
    "observe": "资源排程检查时段是否与已有占用相交。",
    "verify": "半开区间允许端点相邻，拒绝与[3,5)重叠。",
    "apply": "为教学设备预约5–7槽位。"
  },
  {
    "knowledgeId": "K-D05-010",
    "kind": "grid-gantt",
    "title": "Gantt Chart 甘特图",
    "observe": "甘特条按开始结束位置表达持续区间。",
    "verify": "开始必须小于结束，条的位置与长度分别计算。",
    "apply": "显示虚构工单2–5槽位的持续条。"
  },
  {
    "knowledgeId": "K-D05-011",
    "kind": "grid-carousel",
    "title": "Carousel 轮播",
    "observe": "轮播让一个活动项目占据当前展示位。",
    "verify": "三个项目中只有当前项展示，前后操作可循环。",
    "apply": "查看教学工单第二张示意图。"
  },
  {
    "knowledgeId": "K-D05-012",
    "kind": "grid-images",
    "title": "Image List 图片列表",
    "observe": "图片列表把图片与其名称一起组织。",
    "verify": "本例只用内置SVG色块，不加载私人图片。",
    "apply": "过滤并查看蓝色教学示意图。"
  },
  {
    "knowledgeId": "K-D05-015",
    "kind": "grid-code",
    "title": "Code Block 代码块",
    "observe": "代码块保留空白和特殊字符。",
    "verify": "尖括号保持文本，不执行输入代码。",
    "apply": "审阅带HTML外观的教学代码。"
  },
  {
    "knowledgeId": "K-D05-016",
    "kind": "grid-json",
    "title": "JSON Viewer JSON 查看器",
    "observe": "JSON查看器将合法数据转换为只读层级。",
    "verify": "只做JSON解析，错误不覆盖有效预览。",
    "apply": "核对教学工单qty从2变3。"
  },
  {
    "knowledgeId": "K-D05-017",
    "kind": "grid-markdown",
    "title": "Markdown Viewer Markdown 查看器",
    "observe": "Markdown查看器解释有限的标题和列表语法。",
    "verify": "仅支持#标题和*列表，HTML当作文本。",
    "apply": "展示教学工单的安全说明列表。"
  },
  {
    "knowledgeId": "K-D05-018",
    "kind": "grid-files",
    "title": "File List 文件列表",
    "observe": "文件列表展示有限的名称与类型。",
    "verify": "全部为虚构文件，不读取磁盘或文件正文。",
    "apply": "按csv或pdf筛选教学附件。"
  },
  {
    "knowledgeId": "K-D05-020",
    "kind": "grid-keyvalue",
    "title": "Key Value 查看器",
    "observe": "键值查看器保留对象键与值的对应。",
    "verify": "只接受JSON对象，不把数组伪装键值实体。",
    "apply": "核对教学对象id与qty。"
  },
  {
    "knowledgeId": "K-D05-023",
    "kind": "grid-datagrid",
    "title": "Data Grid 数据网格",
    "observe": "数据网格让选定行与焦点单元格保持对应。",
    "verify": "选择实体不改变源行顺序。",
    "apply": "在三行教学数据间定位C。"
  },
  {
    "knowledgeId": "K-D05-024",
    "kind": "grid-tree",
    "title": "Tree Table 树形表格",
    "observe": "树形表格区分父项与可展开子行。",
    "verify": "展开后子行出现，关闭仍保留父项身份。",
    "apply": "展开虚构工单组P。"
  },
  {
    "knowledgeId": "K-D05-025",
    "kind": "grid-pivot",
    "title": "Pivot Table 数据透视表",
    "observe": "透视表按所选维度聚合数值。",
    "verify": "按group合计cut=5、print=1。",
    "apply": "比较教学工艺数量汇总与逐ID汇总。"
  },
  {
    "knowledgeId": "K-D05-026",
    "kind": "grid-virtual",
    "title": "Virtual List 虚拟列表",
    "observe": "虚拟列表只挂载当前窗口。",
    "verify": "100项中DOM仅保留四项，偏移改变可见索引。",
    "apply": "查看教学列表第5项后的窗口。"
  },
  {
    "knowledgeId": "K-D05-027",
    "kind": "grid-virtualgrid",
    "title": "Virtual Grid 虚拟网格",
    "observe": "虚拟网格按窗口渲染二维单元。",
    "verify": "100个索引中只显示六格，不复制全部DOM。",
    "apply": "查看第6项开始的教学网格。"
  },
  {
    "knowledgeId": "K-D05-028",
    "kind": "grid-infinite",
    "title": "Infinite List 无限滚动列表",
    "observe": "无限列表按批次追加数据。",
    "verify": "每批三项，总量十项；支持区域滚动与加载按钮。",
    "apply": "逐批加载教学工单，不重复既有项。"
  },
  {
    "knowledgeId": "K-D05-029",
    "kind": "grid-master",
    "title": "Master Detail 主从数据视图",
    "observe": "主从视图把当前主行与详情关联。",
    "verify": "选B后从区仅显示B的数据。",
    "apply": "从教学工单列表查看选中详情。"
  },
  {
    "knowledgeId": "K-D05-030",
    "kind": "grid-expand",
    "title": "Expandable Rows 可展开行",
    "observe": "可展开行为当前行增加补充区域。",
    "verify": "展开B不展开A/C，原数据行仍保留。",
    "apply": "查看教学工单B的额外说明。"
  },
  {
    "knowledgeId": "K-D05-031",
    "kind": "grid-colgroup",
    "title": "Column Grouping 列分组",
    "observe": "列分组用上层表头表达字段关系。",
    "verify": "grouped使用colspan，flat保留原字段。",
    "apply": "比较教学网格的分组表头。"
  },
  {
    "knowledgeId": "K-D05-032",
    "kind": "grid-chooser",
    "title": "Column Chooser 列配置器",
    "observe": "列配置器让用户选择将要挂载的字段。",
    "verify": "复选框选择唯一列集合，重新渲染不改源对象。",
    "apply": "把教学网格切为ID与工艺两列。"
  },
  {
    "knowledgeId": "K-D05-033",
    "kind": "grid-pincol",
    "title": "Column Pinning 列固定",
    "observe": "固定列在水平滚动区内保留位置。",
    "verify": "选定列使用sticky，不复制行数据。",
    "apply": "滚动时保留教学工单ID。"
  },
  {
    "knowledgeId": "K-D05-034",
    "kind": "grid-resize",
    "title": "Column Resizing 列宽调整",
    "observe": "列宽调整改变字段占用而不截掉原值。",
    "verify": "宽度限60–240px，表格在局部区域滚动。",
    "apply": "扩大教学网格第一列。"
  },
  {
    "knowledgeId": "K-D05-035",
    "kind": "grid-colorder",
    "title": "Column Reordering 列排序",
    "observe": "列重排只改变展示字段的顺序。",
    "verify": "三个字段ID各出现一次，顺序跟配置一致。",
    "apply": "把数量放到教学网格最前。"
  },
  {
    "knowledgeId": "K-D05-036",
    "kind": "grid-visibility",
    "title": "Column Visibility 列可见性",
    "observe": "列可见性保留完整单元格但隐藏未选列。",
    "verify": "hidden状态同步到表头和单元格。",
    "apply": "隐藏教学网格不需查看的金额列。"
  },
  {
    "knowledgeId": "K-D05-037",
    "kind": "grid-rowselect",
    "title": "Row Selection 行选择",
    "observe": "行选择按稳定行ID形成集合。",
    "verify": "A/C同时选中，无重复或未知ID。",
    "apply": "为两张虚构工单建立教学选集。"
  },
  {
    "knowledgeId": "K-D05-038",
    "kind": "grid-cell",
    "title": "Cell Selection 单元格选区",
    "observe": "单元格选区用行ID和列ID共同定位。",
    "verify": "选B:cents只高亮对应单元格。",
    "apply": "定位教学网格中的单一金额。"
  },
  {
    "knowledgeId": "K-D05-039",
    "kind": "grid-pinrow",
    "title": "Row Pinning 行固定",
    "observe": "行固定让指定行优先显示。",
    "verify": "C移到首行但总数仍三，不复制C。",
    "apply": "优先查看教学异常工单C。"
  },
  {
    "knowledgeId": "K-D05-040",
    "kind": "grid-roworder",
    "title": "Row Reordering 行排序",
    "observe": "行重排按显式身份序列生成视图。",
    "verify": "C/A/B为完整排列，不接受遗漏或重复。",
    "apply": "按教学检查顺序排列工单。"
  },
  {
    "knowledgeId": "K-D05-041",
    "kind": "grid-group",
    "title": "Row Grouping 行分组",
    "observe": "行分组保留组头与原始明细。",
    "verify": "print组包含B，cut组包含A/C。",
    "apply": "按工艺查看教学工单的组内明细。"
  },
  {
    "knowledgeId": "K-D05-042",
    "kind": "grid-aggregate",
    "title": "Row Aggregation 行聚合",
    "observe": "行聚合将指定数值列合并为摘要。",
    "verify": "qty总量为6，cents合计450，不混合量纲。",
    "apply": "分别核对教学数量和单价总和。"
  },
  {
    "knowledgeId": "K-D05-043",
    "kind": "grid-edit",
    "title": "Inline Editing 行内编辑",
    "observe": "行内编辑先校验候选值再更新演示副本。",
    "verify": "A数量变5，B/C不变，源常量保持2/1/3。",
    "apply": "修正教学工单A的数量。"
  },
  {
    "knowledgeId": "K-D05-044",
    "kind": "grid-sort",
    "title": "Multi Sort 多列排序",
    "observe": "多列排序按优先级依次比较。",
    "verify": "同组内再按数量，稳定行ID用于最终相同值。",
    "apply": "比较按工艺优先与数量优先的教学顺序。"
  },
  {
    "knowledgeId": "K-D05-045",
    "kind": "grid-facet",
    "title": "Faceted Filtering 数据分面筛选",
    "observe": "分面筛选组合分类与数值约束。",
    "verify": "cut且qty>=3仅剩C。",
    "apply": "查找教学切割工艺的大数量工单。"
  },
  {
    "knowledgeId": "K-D05-046",
    "kind": "grid-headerfilter",
    "title": "Header Filter 表头筛选",
    "observe": "表头筛选只影响对应列条件。",
    "verify": "group为print时只剩B。",
    "apply": "从工艺列筛选教学网格。"
  },
  {
    "knowledgeId": "K-D05-047",
    "kind": "grid-quick",
    "title": "Quick Filter 快速筛选",
    "observe": "快速筛选在多字段文本中查找。",
    "verify": "匹配B显示B，不修改任意字段。",
    "apply": "用一个查询查找教学工单。"
  },
  {
    "knowledgeId": "K-D05-051",
    "kind": "grid-span",
    "title": "Cell Spanning 单元格合并",
    "observe": "单元格合并需要真实rowspan和被覆盖位置。",
    "verify": "跨度1或2，合并只影响首列对应行。",
    "apply": "观察教学网格合并前后的结构。"
  },
  {
    "knowledgeId": "K-D05-052",
    "kind": "grid-clipboard",
    "title": "Clipboard Grid 剪贴板网格操作",
    "observe": "网格粘贴将TSV拆成矩形单元格。",
    "verify": "最多5×5，参差行与非整数拒绝。",
    "apply": "把手工教学数字粘到2×2网格，不读取系统剪贴板。"
  },
  {
    "knowledgeId": "K-D05-054",
    "kind": "grid-export",
    "title": "Grid Export 网格导出",
    "observe": "导出将教学数据序列化为明确格式。",
    "verify": "CSV/TSV分隔符不同，实际生成可下载的内存Blob。",
    "apply": "下载三行虚构教学工单。"
  },
  {
    "knowledgeId": "K-D05-056",
    "kind": "grid-autosize",
    "title": "Grid Column Auto-size 列宽自适应",
    "observe": "列宽自适应依据标题长度设置字符宽度。",
    "verify": "宽度为7–30ch的有界单宽字符规则，不宣称通用字体测量。",
    "apply": "比较长短教学标题的占用。"
  },
  {
    "knowledgeId": "K-D05-057",
    "kind": "grid-rowheight",
    "title": "Grid Row Height 行高控制",
    "observe": "行高控制改变行视口尺寸。",
    "verify": "24–72px，数据和行数不变。",
    "apply": "为教学网格设置40px行高。"
  },
  {
    "knowledgeId": "K-D05-058",
    "kind": "grid-keyboard",
    "title": "Grid Keyboard Navigation 网格键盘导航",
    "observe": "网格键盘导航在有限单元间移动焦点。",
    "verify": "方向键按行列边界夹取，数据值不变。",
    "apply": "不用鼠标定位教学金额单元格。"
  },
  {
    "knowledgeId": "K-D05-059",
    "kind": "grid-fill",
    "title": "Grid Range Fill 区域填充",
    "observe": "区域填充给选定教学区域写入同一值。",
    "verify": "只生成副本，原三行数据不变。",
    "apply": "将三张虚构工单数量填为3。"
  },
  {
    "knowledgeId": "K-D05-060",
    "kind": "grid-formula",
    "title": "Grid Formula Cell 公式单元格",
    "observe": "公式单元格解释受限运算语法。",
    "verify": "只支持两个非负整数相乘，不eval表达式。",
    "apply": "核对教学数量3与单价150分得到450分。"
  },
  {
    "knowledgeId": "K-D06-001",
    "kind": "feedback-badge",
    "title": "Status Badge 状态标签",
    "observe": "状态标签同时给出状态文字和视觉区分。",
    "verify": "draft与approved仅改变教学状态，不代表审批身份。",
    "apply": "查看虚构工单的待审与通过标识。"
  },
  {
    "knowledgeId": "K-D06-002",
    "kind": "feedback-dot",
    "title": "Status Dot 状态圆点",
    "observe": "状态圆点必须配有可读状态名称。",
    "verify": "离线在线的文字与圆点同步，不仅改变颜色。",
    "apply": "辨认教学连接的两种状态。"
  },
  {
    "knowledgeId": "K-D06-003",
    "kind": "feedback-alert",
    "title": "Alert 警告提示",
    "observe": "警告提示把需要注意的内容就近呈现。",
    "verify": "关闭后提示隐藏，重新触发可以恢复。",
    "apply": "确认虚构工单的一项教学警告。"
  },
  {
    "knowledgeId": "K-D06-005",
    "kind": "feedback-snackbar",
    "title": "Snackbar 操作反馈条",
    "observe": "操作反馈条把结果与有限撤销入口放在一起。",
    "verify": "撤销恢复被移除的演示项，不操作真实工单。",
    "apply": "撤回教学列表中的一次移除。"
  },
  {
    "knowledgeId": "K-D06-006",
    "kind": "feedback-notification",
    "title": "Notification 通知",
    "observe": "页内通知独立于系统通知权限。",
    "verify": "关闭仅移除当前通知卡片，原内容保留。",
    "apply": "处理一条教学交付提醒。"
  },
  {
    "knowledgeId": "K-D06-007",
    "kind": "feedback-center",
    "title": "Notification Center 通知中心",
    "observe": "通知中心区分未读集合与已读集合。",
    "verify": "两条通知全部标读后未读数为零。",
    "apply": "整理虚构工单的教学通知。"
  },
  {
    "knowledgeId": "K-D06-008",
    "kind": "feedback-result",
    "title": "Result 结果页面",
    "observe": "结果页区分成功与失败并提供后续动作。",
    "verify": "重试后成功说明同步，不把显示成功当作已保存。",
    "apply": "观察教学任务失败后的返回结果。"
  },
  {
    "knowledgeId": "K-D06-010",
    "kind": "feedback-empty",
    "title": "Search Empty 搜索无结果",
    "observe": "搜索无结果应保留条件和恢复入口。",
    "verify": "重置查询后虚构三项再次出现。",
    "apply": "从教学工单未命中状态恢复列表。"
  },
  {
    "knowledgeId": "K-D06-011",
    "kind": "feedback-skeleton",
    "title": "Skeleton 骨架屏",
    "observe": "骨架屏占据内容将来出现的位置。",
    "verify": "加载完成后骨架被真实教学文字替换。",
    "apply": "比较虚构工单的加载前后结构。"
  },
  {
    "knowledgeId": "K-D06-012",
    "kind": "feedback-spinner",
    "title": "Spinner 加载指示器",
    "observe": "加载指示器表达进行中而非百分比。",
    "verify": "完成后指示器消失，保留文字状态。",
    "apply": "识别教学任务加载与完成。"
  },
  {
    "knowledgeId": "K-D06-014",
    "kind": "feedback-circular",
    "title": "Circular Progress 环形进度",
    "observe": "环形进度用实际比例计算描边偏移。",
    "verify": "20%与80%的圆周占用不同。",
    "apply": "核对虚构任务进度的数字与图形。"
  },
  {
    "knowledgeId": "K-D06-015",
    "kind": "feedback-inline",
    "title": "Inline Loading 行内加载",
    "observe": "行内加载限制当前按钮的重复操作。",
    "verify": "本地延时完成前按钮禁用，离开时清理计时。",
    "apply": "防止教学动作在等待中重复触发。"
  },
  {
    "knowledgeId": "K-D06-016",
    "kind": "feedback-overlay",
    "title": "Loading Overlay 加载遮罩",
    "observe": "加载遮罩阻止区域内的底层操作。",
    "verify": "遮罩出现时底层按钮禁用，完成后可用。",
    "apply": "保护教学预览区的一次待处理操作。"
  },
  {
    "knowledgeId": "K-D06-017",
    "kind": "feedback-fullscreen",
    "title": "Fullscreen Loading 全屏加载",
    "observe": "全屏加载在限定教学框内覆盖内容。",
    "verify": "不遮挡工作台导航，完成后恢复框内控件。",
    "apply": "观察局部教学应用框的全屏等待。"
  },
  {
    "knowledgeId": "K-D06-018",
    "kind": "feedback-error",
    "title": "Field Error 字段错误提示",
    "observe": "字段错误与对应输入建立描述关联。",
    "verify": "修正值后错误清除，aria-invalid恢复false。",
    "apply": "修复虚构工单的一项输入。"
  },
  {
    "knowledgeId": "K-D06-020",
    "kind": "feedback-undo",
    "title": "Undo Feedback 撤销反馈",
    "observe": "撤销反馈同时展示当前结果和恢复入口。",
    "verify": "恢复原始副本后取消重复撤销资格。",
    "apply": "核对教学移除及恢复后的条目数量。"
  },
  {
    "knowledgeId": "K-D06-021",
    "kind": "feedback-page",
    "title": "Error Page 错误页面",
    "observe": "错误页面提供清晰的错误码与恢复动作。",
    "verify": "404与200状态分开显示，不执行网络导航。",
    "apply": "在教学应用框中从缺页返回内容。"
  },
  {
    "knowledgeId": "K-D06-022",
    "kind": "feedback-boundary",
    "title": "Error Boundary 错误边界",
    "observe": "错误边界把失败限制在局部任务内。",
    "verify": "try/catch捕获示例错误，旁边的正常组件继续运行。",
    "apply": "让教学故障不覆盖整个知识页面。"
  },
  {
    "knowledgeId": "K-D06-024",
    "kind": "feedback-conflict",
    "title": "Conflict Warning 冲突警告",
    "observe": "冲突提示阻止以旧版本覆盖新版本。",
    "verify": "版本1不能写入版本2，重新载入后版本更新。",
    "apply": "审阅虚构工单的版本冲突。"
  },
  {
    "knowledgeId": "K-D06-025",
    "kind": "feedback-network",
    "title": "Network Status 网络状态",
    "observe": "网络状态展示区分模拟链路是否可用。",
    "verify": "离线时发送入口禁用，在线时可用；无真实请求。",
    "apply": "比较教学链路的在线与离线界面。"
  },
  {
    "knowledgeId": "K-D06-026",
    "kind": "feedback-offline",
    "title": "Offline Banner 离线横幅",
    "observe": "离线横幅保留草稿并阻止错误的成功提示。",
    "verify": "恢复模拟链路不会清空教学草稿。",
    "apply": "让虚构工单备注在离线提示中保留。"
  },
  {
    "knowledgeId": "K-D06-027",
    "kind": "feedback-connection",
    "title": "Connection Indicator 连接指示器",
    "observe": "连接指示器区分closed与open。",
    "verify": "连接文字和动作资格同步，不连接真实WebSocket。",
    "apply": "观察教学协作入口的连接状态。"
  },
  {
    "knowledgeId": "K-D06-028",
    "kind": "feedback-reconnecting",
    "title": "Reconnecting State 重连状态",
    "observe": "重连提示表达等待和恢复两个阶段。",
    "verify": "本例手动推进本地状态，不声称服务已真正重连。",
    "apply": "从教学等待状态恢复可操作状态。"
  },
  {
    "knowledgeId": "K-D06-029",
    "kind": "feedback-sync",
    "title": "Sync Status 同步状态",
    "observe": "同步状态把本地修改和已同步分开。",
    "verify": "dirty未显示为synced，模拟确认后才改变状态。",
    "apply": "核对虚构工单草稿的教学同步过程。"
  }
];
