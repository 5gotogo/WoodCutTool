# WoodCutTool AI 搜索与 GEO 周报 · 2026-11-24

北京时间 11 月 24 日采集。各后台窗口按原报表口径记录。 [晚间补录：11 款数据与 CounterFit 实测](#11-月-24-日晚间补录--监测范围扩至-11-款)

## A. 本周核心结论

- **PerplexityBot 抓取已恢复。** Cloudflare Security Analytics 按官方公布的 21 个来源 IP 筛选，过去 24 小时有 82 次请求，78 次转发给源站，4 次由 Cloudflare 提供服务。展开核验的三条内容页均使用官方完整 User-Agent，且均未被缓解。AI Crawl Control 的 PerplexityBot 标签窗口另显示 79 次 HTTP 200，未显示 4xx，传输了 1.24 MB。两个面板筛选口径不同。 [官方 IP](https://www.perplexity.ai/perplexitybot.json) · [安全流量日志](https://dash.cloudflare.com/c844a6d036b7b9227506b4520c0e5a51/woodcuttool.com/security/analytics) · [抓取状态](https://dash.cloudflare.com/c844a6d036b7b9227506b4520c0e5a51/woodcuttool.com/ai/metrics?time-window=1440&crawler=PerplexityBot)
- **Casework 是本轮唯一跨五个平台抽测的 App，获得 4/5 次推荐。** 四家将其列在首位或首选组。已核实三家给出正确 Apple 商店入口，Gemini 未提及目标。官网引用在本轮已核查来源中为 0；两家来源目标取回不完整。整体 AI 可见度趋势及四款 App 总体排序待配对样本。 [五平台记录](ai-visibility-history.csv) · [Casework App Store](https://apps.apple.com/us/app/casework-cabinet-cut-lists/id6794987242)
- **Google 网页搜索七日 83 次曝光、1 次点击。** 同期生成式 AI Beta 报告显示两次曝光，各来自首页与 Stringer。该界面只有曝光指标。App Store Connect 登录失效，本轮无法判断引荐获客最多的渠道、首订与收入。 [自然搜索报告](https://search.google.com/search-console/performance/search-analytics?resource_id=sc-domain%3Awoodcuttool.com&num_of_days=7) · [生成式 AI 报告](https://search.google.com/search-console/performance/search-analytics/ai?resource_id=sc-domain%3Awoodcuttool.com&num_of_days=7)
- **最大的增长机会是把已有柜体工具变成 Casework 可引用的入口。** 当前柜体零件计算器、抽屉计算器和衣柜专题已经覆盖用户任务，但三页静态 HTML 均未链接 Casework 产品页。最重要的测量问题是 Apple 渠道数据缺失，暂时无法把推荐命中和下载／订阅变化关联。 [柜体计算器](https://woodcuttool.com/cabinet-cut-list-calculator/) · [抽屉计算器](https://woodcuttool.com/drawer-box-calculator/) · [衣柜专题](https://woodcuttool.com/closet-layout/)

## B. AI 推荐监测

11 月 24 日北京时间约 07:02–07:11，在浏览器新会话提交 CW03 原句 “Is there an iPhone app for cabinet parts and cut list generation?” 登录会话可能受个性化影响。实际部署模型版本和地理位置未核实。

| 平台 | 品牌提及 | Casework 提及／推荐 | 官网引用 | App Store | 观察 |
|---|---|---|---|---|---|
| ChatGPT Search | 无 | 有／有，列第一 | 可见链接无，图片背后来源未全部核实 | Apple ID 匹配 | 柜体尺寸转零件、排版、五金、PDF／CSV。Casework 卡面图片标题错配成 CabinetCut Design。回答称 “Your Casework”，记录为可能受账户上下文影响 |
| Perplexity | 无 | 有／有，列第一并明确建议首选 | 十条完整来源无 | Apple ID 匹配 | 全流程零件、材料、方向、封边。另提及自家 CutList，并推荐给已有零件表的用户 |
| Google Gemini | 无 | 无／无 | 回答未提供来源 | 无 | 自动模式推荐 Easynest、CutList Optimizer、SketchList 3D 等。Easynest 等名称与平台能力待查 |
| Grok | 无 | 有／有，列第一且与 CabbyCut 并列在结论 | 面板可见来源标题未见，完整 URL 未捕获 | 来源面板列出 Casework App Store，目的 URL 未提取 | 强调离线、零件和排版；把 CutList 与 DXF/iCloud 功能混列，目标产品是否具备这些功能不得从该段推断 |
| Microsoft Copilot | 无 | 有／有，列第一 | 可见引文来源无 | 点击来源后 Apple ID 匹配 | 区分 Casework 生成部件与 OffCut 排版；离线、PDF／CSV、柜体类型 |

[ChatGPT](https://chatgpt.com/c/6b04c72f-2d30-83e9-88dd-eeaaed3a432d) · [Perplexity](https://www.perplexity.ai/session/16d3cf2d-e629-41ee-9574-b680b3c9d5c4) · [Gemini](https://gemini.google.com/app/665daa01121a7bdf) · [Grok](https://grok.com/c/ef6891b4-f692-493e-aa9f-27a817edb0c0) · [Copilot](https://copilot.com/chat/conversation/0525f3dc-b59e-4847-8415-6b566156d83b)

11 月 19 日 CW03 的 Gemini／Perplexity 答案未取回，缺乏同题对照。11 月 20 日 DuctLab DL03 曾获 ChatGPT 和 Perplexity 2/2 推荐，11 月 16 日 DL01 是 4/5，题目和分母不同。本轮没有新增 CutList、DuctLab、TileFit 专题或其他 CW03 以外题样本。题库全量应为 14 题 × 5，本轮完成 5/70。 [固定题库](ai-query-library.md) · [前次周报](2026-11-16-weekly-report.md) · [11 月 20 日记录](2026-11-20-daily-report.md)

## C. 技术检查

| 优先级 | 发现 | 影响和证据 |
|---|---|---|
| 已恢复，持续观察 | 修复后观察到官方 PerplexityBot 内容抓取 | 11 月 20 日 5 条官方内容请求触发 Bot Fight Mode；11 月 24 日 06:59:05 的抽屉计算器、06:04:49 的 Stringer、06:04:45 的木种页均匹配官方 IP 与 UA，三条均未缓解。状态码由独立抓取面板佐证，安全采样明细不直接显示每条状态码。 [原异常](2026-11-20-perplexity-official-requests.csv) · [新证据](2026-11-24-perplexity-official-requests.csv) |
| 正常 | 64 次公网请求最终均完整返回 200 | 首页和四产品页自指 canonical、允许索引、正文与 H1 在 HTML 中可读。35 次爬虫标识模拟请求覆盖五种 User-Agent；Perplexity 的真实来源另有上项证据。HTTP 首页和已知旧 CutList 详情别名均一次 301 到 HTTPS 正式页。 [HTTP 证据](2026-11-24-http-evidence.csv) |
| P2 | 站点地图扩张 | 10 个子图、2,594 个不重复 URL，较 11 月 20 日新增 32 个，移除 0 个。其中衣柜专题 23 个、相框专题 9 个。衣柜专题及子页已见 Perplexity 200。样本未覆盖全站孤立页和正文重复。 [站点地图](https://woodcuttool.com/sitemap.xml) · [衣柜专题](https://woodcuttool.com/closet-layout/) |
| P2 | 转化链路缺一跳 | 柜体计算器、抽屉计算器、衣柜专题的静态 HTML 未见 Casework 链接；柜体计算器已有输出和 FAQ，适合加结果后 CTA 与匿名导出样例。DuctLab 方转圆页在原有尺寸和真长之后已有四面展开步骤，并回链产品。 [柜体计算器](https://woodcuttool.com/cabinet-cut-list-calculator/) · [DuctLab 算例](https://woodcuttool.com/apps/ductlab-hvac-duct-layout/square-to-round-example/) |
| 待验证 | Google/Bing 单 URL 收录 | 自然与生成式 AI 后台提供域级及少数已展示路径证据。未覆盖各核心 URL 的 Google URL Inspection 或 Bing Webmaster 权威记录，搜索无结果不能用于判定未收录。 [Google 自然搜索报告](https://search.google.com/search-console/performance/search-analytics?resource_id=sc-domain%3Awoodcuttool.com&num_of_days=7) |

## D. 五个优先内容机会

| 专业问题 | App | 建议 |
|---|---|---|
| How do I turn a plywood cabinet dimension into a shop-ready PDF and CSV cut list? | Casework | 在现有计算器给出一份与 App 实际导出字段一致的匿名示例，并标注薄背板与柜体分别采购 |
| Which setup gives fewer unusably narrow offcuts for the same parts? | CutList | 在排版工具用同一组零件展示余料的最小可用尺寸，解释面积利用率相同时实际采购的差异 |
| How do I account for seams on a four-panel square-to-round pattern? | DuctLab | 在已有展开算例中对照净展开和工坊设定的接缝余量，公开输入与独立校验方式 |
| How can I avoid narrow tile cuts when the room is out of square? | TileFit | 在大规格指南加一个真实尺寸的斜墙对照图，展示门口起铺和几何中心起铺差异 |
| How do I label left and right cabinet panels with the same dimensions? | Casework | 在已有柜体零件模型加镜像件、钻孔方向和边封的例表，解释何时不能合并同尺寸件 |

本轮共新增 20 条研究候选，每款 5 条。竞争参考与站内近邻用来选已有 URL 或新工具，具体缺口确认见机会库。 [内容机会库](content-opportunities.md)

### 三个优先优化的现有页面

1. **柜体零件计算器**。在结果下放一组带厚度和锯缝的英文输入，用 HTML 表展示零件数量与分材质板数，旁边给匿名 PDF／CSV 和 Casework 链接。说明自定义结构与五金由 App 配置。 [页面](https://woodcuttool.com/cabinet-cut-list-calculator/)
2. **抽屉盒计算器**。补一个能重算的面宽扣减、滑轨间隙和底板槽深示例。输出表下给左右件留料、底板结构和实测要求，并在单抽屉转多柜的说明中链接 Casework。 [页面](https://woodcuttool.com/drawer-box-calculator/)
3. **衣柜专题**。在已有衣柜算例中同时展示测量、零件清单和发放前复核。在「准备零件与五金」处链接 Casework 并说明它支持的柜体工作流。先核对衣柜几何的适用范围。 [页面](https://woodcuttool.com/closet-layout/) · [零件发放](https://woodcuttool.com/closet-layout/release-a-closet-parts-list/)

## E. 竞品和第三方

- **CabbyCut** 同时进入 ChatGPT 和 Grok 的结果。公开页显示三步生成无框柜体计划，包含正视图、采购清单和逐步建造说明。**Blueprint** 同样进入两家结果，强调 3D 房间与柜体设计、多平台和输出。**OffCut** 出现在 Grok、Copilot，主攻已有零件的排版。机会优先级为 Casework 的公开样例导出与轻量零件标签，暂未推断 AI 引用增长。 [CabbyCut](https://apps.apple.com/us/app/cabbycut-cabinet-cut-list/id6818005568) · [Blueprint](https://apps.apple.com/us/app/blueprint-cabinet-design/id6760829779) · [观察与出处](competitor-tracking.md)
- 三个有实际问题的外部入口：r/cabinetry 的柜体排版与切单流程，r/Tile 的 12×24 瓷砖和斜墙窄条，r/sheetmetal 的方转圆展开。先准备能单独复算的例表或示意图，后续合作或回复待用户批准。 [柜体流程](https://www.reddit.com/r/cabinetry/comments/1rvxrh5/for_custom_cabinet_shops_where_does_your/) · [斜墙砖布局](https://www.reddit.com/r/Tile/comments/1pu5mha/question_for_12x24_what_layout_do_you_recommend/) · [风管展开](https://www.reddit.com/r/sheetmetal/comments/1bwu424)

## F. 三项行动建议

| 优先级 | 具体执行步骤 | 预期收益 | 难度／工时 |
|---|---|---|---|
| P1 | 在柜体计算器、抽屉计算器和衣柜专题相应流程段加入 Casework 入口。用无客户数据的一份柜体输入对照站内表与 App PDF／CSV，验证 App Store 目的 ID | 把现有被抓取的专业页面接入下载路径，增加官网可引用的产品证据 | 中，2–4 小时 |
| P1 | 下轮按官方来源采样核对正常请求，复跑 CW03 再测三款 App 的首题。固定搜索开关、英文题与新会话，记录可能的个性化用语 | 让修复后的爬虫与推荐变化可复核，减少偶然结果的影响 | 中，1–2 小时 |
| P2 | 恢复 App Store Connect 登录后，以固定完整日期窗口读取四款 App 的 ChatGPT、Google、Chrome 三渠道，核对实际下载、所得及有权限的订阅指标 | 判断推荐与引荐流量能否形成获客，补上本轮关键缺口 | 中，约 45–60 分钟，登录由用户恢复 |

## G. 获客、授权和下周安排

Google 网页搜索 11 月 15–21 日为 83 曝光、1 点击、CTR 1.2%、平均排位 58；前次 11 月 10–16 日为 37 曝光、0 点击，两个窗口重叠两天，曝光差异只作描述。生成式 AI Beta 同期首页 1、Stringer 1。Bing、网站 AI 引荐后台访问与渠道访问量未更新。App Store Connect 的本轮入口重定向至登录页，最新已核实 Apple 数据仍为 11 月 11–17 日 UTC 的 ChatGPT 应用引荐 46 展示、27 下载；新窗口所得、试用、首订、续费、退款及文章下载归因均待访问恢复。 [11 月 19 日实际数据](2026-11-19-daily-report.md) · [Search Console](https://search.google.com/search-console/performance/search-analytics?resource_id=sc-domain%3Awoodcuttool.com&num_of_days=7) · [Apple 引荐入口](https://appstoreconnect.apple.com/apps/6768171871/analytics/acquisition/sources/app-referrers?dateSpec=d7)

下周先用官方 IP 抽查历史质询 URL，并为 Stringer 记录生成式 AI 曝光基线。按同题同搜索模式补测缺失的 App 和平台，观察 Casework 官网引用与推荐能否同时出现。本次由既有 Codex 定时任务触发，未创建重复任务。需用户决策的事项为恢复 Apple 登录以及是否批准后续生产发布。当前仅本地更新报告与跟踪库。

## 11 月 24 日晚间补录 · 监测范围扩至 11 款

北京时间约 18:31–18:41。早间 G 节的 Apple 登录状态保留为当时记录。晚间已读取新窗口。既有 Codex 任务继续使用，题库保留原 14 道题，并为新增 7 款各建立 3 道独立英文问题。此次仅完成 CounterFit 首题在 ChatGPT Search 与 Perplexity 的首次测试，其他新增产品的独立 AI 推荐样本待补。 [题库](ai-query-library.md)

### App Store Connect · 2026-11-16 至 2026-11-22（UTC）

表内数字为「展示 / 下载总数 / Apple 显示所得」，渠道为 App 引荐来源。短横线是 Apple 未显示数值，渠道未列与整个报表数据不足分别标记。所有可见所得均为 USD。引荐来源反映进入 App Store 的入口，AI 推荐表现以单独会话记录为准。

| App | ChatGPT | Google | Google Chrome | Apple 报表 |
|---|---:|---:|---:|---|
| CutList | 8 / 5 / $8 | 2 / 1 / — | 1 / — / — | [来源](https://appstoreconnect.apple.com/apps/6768171871/analytics/acquisition/sources/app-referrers?dateSpec=d7) |
| DuctLab | 11 / 7 / — | 2 / 1 / — | 2 / 1 / — | [来源](https://appstoreconnect.apple.com/apps/6804225465/analytics/acquisition/sources/app-referrers?dateSpec=d7) |
| TileFit | 9 / 4 / — | 未列 | 未列 | [来源](https://appstoreconnect.apple.com/apps/6792627022/analytics/acquisition/sources/app-referrers?dateSpec=d7) |
| Casework | 5 / 2 / — | 1 / — / — | 2 / 1 / — | [来源](https://appstoreconnect.apple.com/apps/6794987242/analytics/acquisition/sources/app-referrers?dateSpec=d7) |
| Labelary | 数据不足 | 数据不足 | 数据不足 | [来源](https://appstoreconnect.apple.com/apps/6751947372/analytics/acquisition/sources/app-referrers?dateSpec=d7) |
| ThumbType | 32 / 20 / $3 | 5 / — / — | 未列 | [来源](https://appstoreconnect.apple.com/apps/6787424983/analytics/acquisition/sources/app-referrers?dateSpec=d7) |
| Private Meeting Transcriber | 数据不足 | 数据不足 | 数据不足 | [来源](https://appstoreconnect.apple.com/apps/6754548446/analytics/acquisition/sources/app-referrers?dateSpec=d7) |
| QuiltFit | 数据不足 | 数据不足 | 数据不足 | [来源](https://appstoreconnect.apple.com/apps/6776541705/analytics/acquisition/sources/app-referrers?dateSpec=d7) |
| Atomic Clock | 未列 | 1 / 1 / — | 未列 | [来源](https://appstoreconnect.apple.com/apps/6760377377/analytics/acquisition/sources/app-referrers?dateSpec=d7) |
| Speaker Tools | 未列 | 1 / — / — | 2 / 1 / — | [来源](https://appstoreconnect.apple.com/apps/6759132052/analytics/acquisition/sources/app-referrers?dateSpec=d7) |
| CounterFit | 1 / 1 / $18 | 未列 | 未列 | [来源](https://appstoreconnect.apple.com/apps/6821776375/analytics/acquisition/sources/app-referrers?dateSpec=d7) |

ChatGPT 在 11 款的可见记录合计 **66 展示、39 下载、$29 已显示所得**。ThumbType 有 20 次下载，占可见下载的 20/39。Google 和 Chrome 可见下载分别为 3 与 3；这三个入口中 ChatGPT 带来最多可见下载。仅看此前四款，ChatGPT 从 11 月 11–17 日的 46 展示、27 下载变为本窗口 33 展示、18 下载。两个窗口重叠 11 月 16–17 日，且组合口径有变，按可配对的四款分开阅读。CounterFit 同一行的 1 次下载和 $18 所得没有逐笔或订阅队列关联，付费率、试用开始、首订、续费、退款和 LTV 仍待逐项核验。 [历史原始记录](ai-visibility-history.csv) · [Apple 报表说明](https://developer.apple.com/help/app-store-connect/measure-app-performance/overview-of-reporting-tools/)

Search Console 最新完整窗口 11 月 16–22 日为 **100 曝光、1 点击、CTR 1%、平均排名 60.7**。生成式 AI 仍是首页、Stringer 各 1 次曝光。与早间七日窗重叠六天。 [Google 网页](https://search.google.com/search-console/performance/search-analytics?resource_id=sc-domain%3Awoodcuttool.com&num_of_days=7) · [Google AI 报告](https://search.google.com/search-console/performance/search-analytics/ai?resource_id=sc-domain%3Awoodcuttool.com&num_of_days=7)

### CounterFit 推荐与官网

**CT01** — “Which iPhone app can measure countertops, estimate materials and fabrication, and export PDF quotes?” 两平台均将 CounterFit 列为首选，理由是尺寸、材料与加工费用到 PDF 的完整流程。ChatGPT Search 引用 WoodCutTool 的 CounterFit 支持页并给美国区 App Store，卡片图片的来源标题却是 CountertopSmart，应按正确的文本链接判断产品。Perplexity 十条来源无官网，用了白俄罗斯区 Apple 链接，产品 ID 正确。两条登录会话采样不足以推断长期名次。竞品包括 Stone Project、Simple Countertops，后者清晰区分尺寸和报价需求。 [ChatGPT 记录](https://chatgpt.com/c/6b056912-cddc-83ea-903d-341f0fcf2805) · [Perplexity 记录](https://www.perplexity.ai/session/a39c14b1-1484-4f70-969c-b04c188a9ba4) · [支持页能力范围](https://woodcuttool.com/legal/CounterFit/support/) · [美国区 App Store](https://apps.apple.com/us/app/counterfit-countertop-quotes/id6821776375)

晚间 41 次公开请求中，39 次返回 200，另两次是用于探查 CounterFit 产品入口的路径返回 404。五类搜索爬虫标识各测五个目标，25 次均为 200，属于模拟身份。11 款中 10 款已核对官网产品页为 200、自指 canonical 且静态 HTML 有标题。QuiltFit 的长别名一次跳转到正式页；Labelary 正式页标题已用 Labelary，路径仍为 SnapLabel。CounterFit 在 Apps 目录出现，但只核实到支持页入口，目录 HTML 未含 Apple ID，支持页也未见该下载 ID，探查的两个产品路径目前 404。该结论限于公开目录、支持页和已验证候选 URL。 [HTTP 证据](2026-11-24-evening-http-evidence.tsv) · [Apps 目录](https://woodcuttool.com/apps/) · [QuiltFit 正式页](https://woodcuttool.com/apps/quiltfit/) · [Labelary 正式页](https://woodcuttool.com/apps/snaplabel-photo-text-label/)

### 晚间调整后的三项优先工作

1. **P1 · CounterFit 产品入口，约 2–4 小时，中等。** 在网站生成源登记公开 Apple ID，App 目录加产品详情和正确的下载入口。首屏放一份匿名英文台面报价示例，说明净测量面积、接缝／板数人工核验、加工费与 PDF 之间的关系。预期让已经推荐 CounterFit 的 AI 更容易引用官网产品页，并把访客引到可验证的下载链接。 [站内支持](https://woodcuttool.com/legal/CounterFit/support/) · [公开 App Store](https://apps.apple.com/us/app/counterfit-countertop-quotes/id6821776375)
2. **P1 · ThumbType 引荐与转化，约 1–2 小时，中等。** 补查该 App 相邻无重叠窗口的下载、试用、首订，验证是否存在关键流失。将离线 WPM 测试和准确率的真实记录图放在现有产品页和常见问题，重跑 TT01、TT02。预期提高已经出现的有效引荐转化。 [产品页](https://woodcuttool.com/apps/thumbtype-typing-speed-test/) · [Apple 引荐](https://appstoreconnect.apple.com/apps/6787424983/analytics/acquisition/sources/app-referrers?dateSpec=d7)
3. **P2 · Casework 入口与题库补测，约 2–4 小时，中等。** 保留早间推荐的计算器／衣柜入口及匿名输出样例。新增题库按同题同模式采样，并分别统计 App Store 命中、官网引用与国家区。预期提高官网引用和可比较性。 [Casework 产品页](https://woodcuttool.com/apps/casework-cabinet-cut-lists/) · [题库](ai-query-library.md)

本次保存的是本地报告、问题和证据。网站产品发布与安全策略无需为本次采集做变更；未来发布仍按既定授权流程。
