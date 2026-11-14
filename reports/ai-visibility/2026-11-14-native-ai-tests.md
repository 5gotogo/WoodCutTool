# WoodCutTool 原生 AI 推荐抽测

2026-11-14，北京时间。使用用户现有 Chrome 会话，ChatGPT 选择网页搜索，Gemini 使用自动模式，Grok 使用当时的默认模式并观察到联网搜索。每款产品取固定题库第一题，各自在新会话提问，英文原句未提供品牌、产品名或官网。共 12 份回答。模型具体版本、实际服务地区及各题精确时间未核验。聊天链接指向原会话，访问可能依赖原账户。

| 固定题 | ChatGPT Search | Gemini | Grok |
|---|---|---|---|
| CL01 · iPhone plywood cut list | **推荐 CutList**，排在 SmartCut 后的第 2 项，理由包括离线、锯缝和纹理；提供正确的目标下载链接。 [会话](https://chatgpt.com/c/6af7cf54-be00-83e9-aef7-38466cb95cc9) | 首选 SmartCut，其余列出 CutList Optimal 和同类网页工具。未推荐 WoodCutTool 的 CutList。 [会话](https://gemini.google.com/app/27fdadecffa2b931) | 首选 SmartCut，提及的 CutList Pro 是另一款产品。展开的 53 项来源里出现 WoodCutTool 首页同标题条目，正文未推荐目标 App。 [会话](https://grok.com/c/2c0b1a96-9240-43c6-8f61-32447788ee8f) |
| DL01 · iPhone HVAC duct layout | **列出 DuctLab**，在 Design Day 和 FieldFab 之后展示，提供正确下载链接。 [会话](https://chatgpt.com/c/6af7cfe0-8534-83e8-974e-520b23598858) | **建议钣金配件放样选 DuctLab**，理由包括离线、分数英寸、尺寸和材料估算；展开引用验证了目标 Apple ID。 [会话](https://gemini.google.com/app/26a798fbb5d87afc) | **建议配件放样首选 DuctLab**，用 FieldFab 对应现场 AR；来源抽屉有 DuctLab 的 App Store 条目，打开后落到中国区 Today，未确认目标 Apple ID。 [会话](https://grok.com/c/2a039be2-8d4e-4d7f-a9b2-784e028b4992) |
| TF01 · tile layout for contractors | **推荐 TileFit**，列在 Floor Covering 后第 2 项，明确标注 WoodCutTool，同时给出正确下载链接。理由包括六种图案、多边形、切割与施工顺序。 [会话](https://chatgpt.com/c/6af7d018-535c-83ea-8940-4e79fb79ce6a) | 推荐商用 MeasureSquare、现场 TilePlan 或 TileForeman。未见 TileFit。 [会话](https://gemini.google.com/app/55c7c553b246b764) | 推荐 TilePlan、MeasureSquare 和 TileForeman。未见 TileFit。回答把 tileplan.app 与 tileplan.cc 合并讨论，涉及功能归属，待分别核对。 [会话](https://grok.com/c/39ee02da-f4a5-459a-a68c-9073d29f323a) |
| CW01 · cabinet cut list app | **推荐 Casework 与 CabbyCut 作为轻量 iPhone 工具**，同时优先将 Mozaik 推荐给橱柜厂。Casework 的 App Store 引用链接包含正确 Apple ID。 [会话](https://chatgpt.com/c/6af7d062-57e0-83ea-b471-d144ff1c6cfe) | 推荐 Mozaik、SketchList 3D、Cabinet Vision 等。回答大量覆盖桌面和 CNC 软件，未见 Casework。 [会话](https://gemini.google.com/app/9d28928e77551824) | 推荐 Web 端 ProCabinet.App、移动端 Cabsmith/CabbyCut 和生产端 Mozaik/Cabinet Vision。未见 Casework。 [会话](https://grok.com/c/155aba1e-8d26-46b7-bce5-5498fd6061e3) |

## 可证实的信号

- **DuctLab 是本次唯一被三家都列为适用选项的产品。** Gemini 和 Grok 的答案都主动区分配件下料与更宽泛的 HVAC 设计或现场工具，可将这一用途写进官网可引用的方转圆案例。
- **ChatGPT Search 所抽样的四题均出现目标 App，四个目标 Apple ID 都在正文或 App Store 引用中核验。** 其中 CutList 和 TileFit 都出现在列表第 2 项。Gemini 与 Grok 各推荐一款目标 App，都是 DuctLab。按产品汇总共 6/12 份回答推荐目标产品。
- **CutList 展现出官网发现与产品推荐之间的落差。** Grok 来源列表可找到首页对应条目，正文首选仍是 SmartCut。三家在此题都首选 SmartCut，Grok 和 Gemini 提到的同名或近名产品须以 Apple ID 区分。
- **其余官网引用、外部来源完整 URL 及模型功能表述准确性尚未逐条复核。** 结果中出现的竞品价格、评分和功能是待复核的模型陈述。记录中的空白代表未验证。Claude 因当前不可访问跳过，本次也未测试 Perplexity。剩余固定题尚未运行。

目标商店记录可用于复核产品归属。 [CutList](https://apps.apple.com/us/app/cutlist-plywood-optimizer/id6768171871) · [DuctLab](https://apps.apple.com/us/app/ductlab-hvac-duct-layout/id6804225465) · [TileFit](https://apps.apple.com/us/app/tilefit-tile-layout-planner/id6792627022) · [Casework](https://apps.apple.com/us/app/casework-cabinet-cut-lists/id6794987242)
