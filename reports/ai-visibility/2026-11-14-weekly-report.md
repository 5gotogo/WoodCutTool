# WoodCutTool AI 搜索与 GEO 审计

2026-11-14，Asia/Shanghai。首次审计。技术证据来自当天生产环境 HTTPS 只读抽样，内容和竞品以公开页面或明确标注的检索摘要为依据。面向美国英语市场。

## A. 本周核心结论

- **最大的现有问题是 CutList 的订阅描述互相冲突。** 官网首页写明试用后需要订阅，产品详情页和美国 App Store 仍描述可免费使用基础排版。本地 CutList 的 Release 路径在引导后要求有效 Pro，商店当前在售构建仍需用设备核验。三处表述的差异可能误导搜索摘要、AI 回答和即将下载的用户。 [首页](https://woodcuttool.com/) · [详情页](https://woodcuttool.com/apps/cutlist/) · [美国 App Store](https://apps.apple.com/us/app/cutlist-plywood-optimizer/id6768171871)
- **最大的新内容机会是 DuctLab 的偏心方转圆与矩形变径。** 产品页和支持页描述了工作流，线上站点地图中未发现相关独立计算器。用户已有具体开口尺寸和放样问题，可以用静态算例和免费工具提供可引用结果，再导向多零件、项目估算与 PDF。 [DuctLab](https://woodcuttool.com/apps/ductlab-hvac-duct-layout/) · [支持页](https://woodcuttool.com/legal/DuctLab/support/) · [实际讨论](https://www.reddit.com/r/sheetmetal/comments/1rdt55w/layout_for_rectangle_to_round/)
- **趋势、表现最佳 App、用户最多的渠道均待验证。** 本次有网站抓取和公开检索证据。同日稍后补测三个原生 AI 平台，得到 12 份回答。跨周趋势及 App Store Connect、Search Console、Bing Webmaster 和网站分析渠道仍待建立可比数据。

## B. AI 推荐监测

同日使用 Chrome 补做三平台的各 App 首题，详情见[原生 AI 补测](2026-11-14-native-ai-tests.md)。ChatGPT Search 四题均推荐对应产品。Gemini 和 Grok 各推荐一款，均为 DuctLab。CutList、TileFit 和 Casework 各在 1/3 个平台的该题获推荐。其余题目、Claude 与 Perplexity 缺测。四产品的完整固定题仍见[题库](ai-query-library.md)。

历史的公共网页检索出现 TileFit 支持页、Kerf、XyloKerf 和 Cabsmith，只作网页发现及竞品线索。暂无上周配对样本。 [TileFit 支持页](https://woodcuttool.com/legal/TileFit/support/) · [Kerf](https://apps.apple.com/us/app/kerf-cut-list-optimizer/id6761802671) · [XyloKerf](https://apps.apple.com/us/app/xylokerf-cut-list-optimizer/id6766369684) · [Cabsmith](https://cabsmith.app/)

## C. 技术检查

| 优先级 | 检查 | 证据、影响与处理 |
|---|---|---|
| P0 | CutList 产品信息一致性 | 首页、App 详情和美国商店订阅口径有冲突。下载入口走 302，抽样正确指向 Apple ID 6768171871，返回中国商店地址。本地路由对 CN 做地区转换，美国跳转仍待美国出口实测。统一在售构建、产品文案、结构化数据和商店说明。 [首页](https://woodcuttool.com/) · [详情](https://woodcuttool.com/apps/cutlist/) · [下载入口](https://woodcuttool.com/go/cutlist/?source=app-page&placement=hero) · [美国商店](https://apps.apple.com/us/app/cutlist-plywood-optimizer/id6768171871) |
| P1 | Casework 和 TileFit 的内容入口 | 柜体计算器及柜体选型文章引导到 CutList，两篇瓷砖损耗指南可进入通用计算器，但缺少 TileFit 详情直链。增加对应产品路径并保留与各页面意图匹配的入口。 [柜体计算器](https://woodcuttool.com/cabinet-cut-list-calculator/) · [柜体选型](https://woodcuttool.com/blog/cut-list-app-for-cabinet-makers/) · [瓷砖损耗](https://woodcuttool.com/learn/tile-waste-allowance-guide/) · [大规格瓷砖](https://woodcuttool.com/learn/large-format-tile-waste-planning/) |
| P1 | Google 与 Bing 索引证据 | Google 主站和区域替代域名请求超时。Bing 重定向中国站，品牌加站点限定查询返回无结果，美国参数也重定向中国站。公共检索确实返回核心页面，Google、Bing 各自的实际索引状态仍待后台 URL Inspection。优先检查首页、四产品页和新计算器。 [Google URL Inspection](https://support.google.com/webmasters/answer/9012289/) · [Bing URL Inspection](https://www.bing.com/webmasters/help/url-inspection-55a30305) |
| P2 | 相似意图页面 | 首页、旧 `/cutlist/` 与完整版排版器均返回 200、自指 canonical。旧页和完整版同时在工具 sitemap 内。意图存在重叠，检查搜索后台是否争用同一组词，再决定突出功能差异、加强互链或合并。 [旧计算器](https://woodcuttool.com/cutlist/) · [完整版](https://woodcuttool.com/plywood-cut-calculator/) · [工具 sitemap](https://woodcuttool.com/sitemap-tools.xml) |
| 观察 | robots、sitemap 及爬虫 | 线上 robots 200，通配规则允许访问，当前也未针对 GPTBot 设置限制。主 sitemap 和 10 个子 sitemap 均 200 并可解析，合计 2,550 个不同的主 URL，其中 App 子地图 49 个 URL。五种爬虫 UA 各访问首页、四产品页、robots 和 sitemap，共 35/35 返回 200，响应头未见 `cf-mitigated`。请求仅模拟 UA，Cloudflare 实际验证爬虫事件和地区策略待核验。OAI-SearchBot 用于搜索发现，GPTBot 与训练相关，后续按用途决定策略。 [robots](https://woodcuttool.com/robots.txt) · [sitemap](https://woodcuttool.com/sitemap.xml) · [OpenAI 爬虫](https://developers.openai.com/api/docs/bots) · [Claude 爬虫](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler) · [Perplexity 爬虫](https://docs.perplexity.ai/docs/resources/perplexity-crawlers) |

首页和四产品页各有可直接读取的 HTML 主要正文、自指 canonical，均声明 `index,follow`，抽样响应无 `X-Robots-Tag`。首页、四个产品页和目录的响应见[HTTP 证据表](2026-11-14-http-evidence.csv)。`/apps/cutlist-plywood-optimizer/`、www 首页及 HTTP 首页 301 一跳到规范地址。App 目录直接链到四款产品，四个产品页均有下载入口。全站文章孤立性和内容相似度尚未做逐 URL 爬取。在线工具交互和用户输入结果依赖 JavaScript，静态页面可增补预计算的 HTML 示例。 [App 目录](https://woodcuttool.com/apps/) · [CutList](https://woodcuttool.com/apps/cutlist/) · [DuctLab](https://woodcuttool.com/apps/ductlab-hvac-duct-layout/) · [TileFit](https://woodcuttool.com/apps/tilefit-tile-layout-planner/) · [Casework](https://woodcuttool.com/apps/casework-cabinet-cut-lists/)

## D. 内容机会与优先优化页面

完整[机会库](content-opportunities.md)含每款 App 五条、共 20 条机会，以及五款计算器的可实现范围。以下是本轮五个优先问题。

| 专业问题 | 对应 App | 交付与依据 |
|---|---|---|
| How do I lay out a 22×10 rectangle to a 16-inch round with offset? | DuctLab | 方转圆真长工具。明确样例轴高、偏心和分段，给出可核对的表与图。 [真实讨论](https://www.reddit.com/r/sheetmetal/comments/1rdt55w/layout_for_rectangle_to_round/) |
| How do I calculate the four faces of an eccentric rectangular reducer? | DuctLab | 复用几何内核做四面展开工具，附对称与偏心对照。 [支持页](https://woodcuttool.com/legal/DuctLab/support/) |
| Should herringbone be centered on a doorway or on the room? | TileFit | 比较起点和最窄切片的交互工具，附同尺寸图。 [人字铺讨论](https://www.reddit.com/r/Tile/comments/1m5xczw) |
| How do I size a captured cabinet back from the actual dado depth? | Casework | 扩展现有工具对照平接、嵌入背板的尺寸和材料分组。 [柜体工具](https://woodcuttool.com/cabinet-cut-list-calculator/) |
| How many sheets do I need with grain locked and 1/8-inch kerf? | CutList | 扩充既有指南及工具示例，展示同一清单在两组约束下的结果。 [张数指南](https://woodcuttool.com/learn/how-many-sheets-of-plywood-do-i-need/) |

### 十个页面的优化顺序

顺序依据是信息准确性、购买意图和可就地调整的程度。最值得先做的三个页面为前 3 项。

| 排序与页面 | 现有内容和具体改法 |
|---|---|
| 1. [CutList 产品详情](https://woodcuttool.com/apps/cutlist/) | 保留排版、离线和扫描功能示例。确认实际订阅门槛后同步首屏、价格说明、FAQ 与 SoftwareApplication 描述，正文同时提供带 Apple ID 的标准下载入口或清晰商店链接。 |
| 2. [柜体 Cut List Calculator](https://woodcuttool.com/cabinet-cut-list-calculator/) | 已有零件算法说明、FAQ 和交互预览。加入一个基础柜的静态零件表、实际板厚和连接假设，并将柜体尺寸到零件的后续流程链到 Casework。 |
| 3. [DuctLab 产品详情](https://woodcuttool.com/apps/ductlab-hvac-duct-layout/) | 将大段产品描述拆成四种配件任务，先添加方转圆静态真长表、图、接缝余量说明和工具入口。每份输入参数均可复算。 |
| 4. [Tile Calculator](https://woodcuttool.com/tile-calculator/) | 现有页面提供 TileFit 链接和动态基础估算。补静态面积、箱数向上取整、库存余量和一个完整算例，说明矩形范围，增加人字铺试算入口。 |
| 5. [Tile Waste Allowance Guide](https://woodcuttool.com/learn/tile-waste-allowance-guide/) | 将通用步骤换成同一房间的直铺／人字铺图，逐项解释切片、破损备用、整箱和复用假设，加 TileFit 路径。 |
| 6. [Large Format Tile Waste Planning](https://woodcuttool.com/learn/large-format-tile-waste-planning/) | 加 12×24 瓷砖的直铺与三分之一错缝对照，标出最窄边条、砖厂限制和影响损耗的条件，加 TileFit 路径。 |
| 7. [Cut List App for Cabinet Makers](https://woodcuttool.com/blog/cut-list-app-for-cabinet-makers/) | 加“已有面板清单”和“根据柜体尺寸生成零件”两种流程，给出各自入口和同一项目的两个起点。 |
| 8. [Casework 产品详情](https://woodcuttool.com/apps/casework-cabinet-cut-lists/) | 在功能列表前加一个 18 mm 柜体和 6 mm 背板的示例图表，展示从构造选择到采购、PDF 与 CSV 的过程。 |
| 9. [Grain Direction in Plywood Layouts](https://woodcuttool.com/learn/grain-direction-in-plywood-layouts/) | 对照同一零件表的锁纹和允许旋转结果，标明纹理轴、锯缝和可再用余料。与连续门纹指南明确分工。 |
| 10. [旧 CutList 计算器](https://woodcuttool.com/cutlist/) | 给旧版和完整版的入口加明确功能差异与共享示例，结合后台查询重叠再决定 URL 策略。 |

### Swift 算法复用

- DuctLab 本地已有 `FabricationCalculator.swift`，包含 `squareToRound`、`rectangularTransition`、`ductOffset` 和 `elbow`。先将 iOS 结果导出为含分段、真长和面积的 JSON 测试样例，再把输入输出与几何核心做成独立模块。浏览器端先复用样例和测试口径，评估共享 Swift/Wasm 的构建和下载成本。首版若以 JS 实现，所有受支持几何输入与 Swift 固定样例比对后上线。
- TileFit 本地有 `TileGeometry.swift`、`TileLayoutEngine.swift`，Casework 有 `CaseworkEngine.swift`、`NestingOptimizer.swift`。用各自已有的几何、舍入和零件定义生成测试样例，再扩展 Web 入口。CutList 站点已有 `assets/plywood-core.js`，其示例可直接调用现有 Web 逻辑生成。工期估算已把跨端复算列入。

## E. 竞品、第三方与新 App

- **optiCutter** 的导入、材料分组和边封选项适合对照专业 Web 工具。**TilePlan Pro** 为人字铺设了独立页面。**Cabsmith** 公开展示柜体拆件、PDF 或 DXF 后续流程，官网将 iOS 列入路线图。**Static Equipment Academy** 是方转圆检索结果里的直接替代来源，页面正文待复核。现有信号支持比较页面内容与功能，AI 引用增长待重复测试。 [optiCutter](https://www.opticutter.com/cut-list-optimizer/edit) · [TilePlan Pro](https://tileplan.cc/patterns/herringbone) · [Cabsmith](https://cabsmith.app/) · [方转圆工具](https://staticequipmentacademy.com/free-resources/square-to-round-calculator/)
- 外部曝光候选为矩形转圆的 r/sheetmetal 现场问题、r/cabinetry 柜体表格对照、r/Tile 的起点选择。分别准备可复算真长表、匿名柜体零件表、双版人字铺示意，分享前核对版规和是否适合回应。相关品牌曝光量和合作意愿待验证。 [钣金讨论](https://www.reddit.com/r/sheetmetal/comments/1rdt55w/layout_for_rectangle_to_round/) · [柜体讨论](https://www.reddit.com/r/cabinetry/comments/1mpke03/cutlist_calculator_comparison_w_spreadsheet/) · [瓷砖讨论](https://www.reddit.com/r/Tile/comments/1m5xczw)
- 新推广候选 **FloorQuote** 已有公开产品页和商店入口。适合从现有材料估算工具导向包含工时、材料和客户报价的流程，与 TileFit 的施工布局形成衔接。建议用少量入口测量意图，再决定是否做独立报价计算器。 [FloorQuote](https://woodcuttool.com/apps/floorquote-flooring-quotes/) · [Cost Estimator](https://woodcuttool.com/cost-estimator/)
- 三个产品研究机会为 DuctLab 的可打印展开、TileFit 起点比较和 Casework 部件标签，详见[竞品记录](competitor-tracking.md)。

## F. 本周三项行动建议

| 优先级 | 工作 | 预期收益 | 难度与耗时 | 执行步骤 |
|---|---|---|---|---|
| P0 | 统一 CutList 试用与订阅文案 | 减少误导性摘要和下载后预期落差 | 低至中，2–4 小时另加在售版本核验 | 用美国商店在售构建及未订阅账户复核 → 明确免费 Web 与 App 的权益 → 同步官网源数据、FAQ、结构化数据和商店表述草稿 → 核对美国与中国下载路径 |
| P1 | 实现 DuctLab 方转圆工具的首版 | 形成可引用的几何答案与实际下载入口 | 中，3–5 天 | 定义输入边界 → 用 Swift 生成测试样例 → 提供静态结果和交互图 → 对照实测和容差 → 从产品和支持页互链 |
| P1 | 修复柜体与瓷砖的导流 | 把已有专业内容访客引到匹配的 App | 低至中，0.5–1 天 | 在柜体计算器和选型文章增加 Casework；两篇瓷砖指南增加 TileFit → 给每类入口加可校验的来源参数 → 用目标 Apple ID 核对跳转，随后观察点击 |

## G. 下周计划与授权

- 先读取足够权限的匿名／只读数据。窗口用 2026-11-02 至 2026-11-08 作为最近完整自然周，2026-10-26 至 2026-11-01 为前周，按各来源时区记录。App Store Connect 以 App × 渠道 × 周分开展示、下载、所得、试用、首订、续费和退款。Google 和 Chrome 保持独立。如果聚合报表无法把续费和原始引荐联系起来，渠道 LTV 和付费率记为不可归因。如果无法把某文章点击与实际下载联系起来，单列文章到 App Store 的点击。 [Apple App Analytics 来源说明](https://developer.apple.com/help/app-store-connect/view-app-analytics/view-acquisition-sources/)
- 待授权数据分别为 Google 搜索展示、点击、关键词和页面 CTR，网站分析的 AI 来源访问，App Store Connect 的下载及订阅指标，以及 Bing 和 Google 的逐 URL 索引结果。本轮未读取这些指标。历史参考为用户提供的 2026-08-15 至 2026-11-12 四款合计约 520 展示、261 下载、291 USD。App Store ChatGPT 引荐反映进入商店的来源，推荐表现以原生 AI 答案测量。
- 用现有 Chrome 会话补跑三平台剩余题，记录已验证的完整来源。Claude 与 Perplexity 恢复访问后再补测。如果后台访问仍不可用，优先核验 CutList 的在售权益和发布前的方转圆样例。Cloudflare 实际爬虫验证需要已有只读安全事件权限。
- 需要人工决定或开通的事项包括各平台登录会话与只读数据范围、CutList 在售权益核验、后续生产网站与商店文案的发布批准。如考虑社区分享，逐条确认版规和发帖授权。
- 已核实现有 Codex 原生心跳为启用状态，对应本聊天，每天 06:00（北京时间）。此次是手动首轮，定时触发的运行结果尚待首次实际触发确认。完整报告按周归档。 [Codex 定时任务](https://learn.chatgpt.com/docs/automations?surface=app)
