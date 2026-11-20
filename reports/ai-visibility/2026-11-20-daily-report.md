# WoodCutTool 每日 GEO 检查 · 2026-11-20

检查时间约为北京时间 07:04–07:14。本次执行每日技术检查，补测一条固定需求在两个 AI 产品上的表现，并接续 11 月 16 日的周报。

## A. 本轮核心结论

- **官方 PerplexityBot 抓取仍受影响。** Cloudflare 最近 24 小时的近似范围内，用当时全部 21 个官方公开 IP 过滤并逐条展开，共核对到 9 条 PerplexityBot 请求。5 条内容页请求全部触发 Bot Fight Mode 的托管质询，另 4 条 `robots.txt` 请求未触发缓解。最新内容页样本为 11 月 20 日 03:56:42，来自 `18.97.9.102`。有充分证据确认官方来源遇到质询，页面最终 HTTP 状态和是否获取正文在该界面未显示。11 月 19 日的本地 User-Agent 复测通过只说明该测试来源可以访问。 [Cloudflare 安全流量](https://dash.cloudflare.com/c844a6d036b7b9227506b4520c0e5a51/woodcuttool.com/security/analytics) · [官方 IP 清单](https://www.perplexity.ai/perplexitybot.json) · [逐条证据](2026-11-20-perplexity-official-requests.csv)
- **DuctLab 在本轮唯一完成的固定问题中获得 2/2 次推荐。** ChatGPT Search 和 Perplexity 都将它列为首个匹配项，并给出了正确的 App Store 下载入口。两份回答可核对的来源均未见方转圆官网算例。样本尚不足以判断总体排名、趋势或四款 App 的相对表现。 [ChatGPT 会话](https://chatgpt.com/c/6aff80df-8164-83ea-a2e3-8b42e84e0881) · [Perplexity 会话](https://www.perplexity.ai/session/1ae0b32a-9246-4a67-acc7-8cae3610aca6)
- **站点地图新增 11 个 URL。** 其中 9 个为 Cabinet Refacing 专题与子页，另有 CabinetRefit 的隐私及支持页。公开 App Store 上架状态尚未查实。 [专题](https://woodcuttool.com/cabinet-refacing/) · [产品支持](https://woodcuttool.com/legal/CabinetRefit/support/)

## B. AI 推荐监测

**DL03** — “Is there an app for square to round duct layout?” 英文原句，无品牌提示。ChatGPT 显式选择网页搜索，Perplexity 使用常规搜索。模型具体版本、地域及个性化影响待验证。

| 产品 | WoodCutTool 正文提及 | DuctLab 提及／推荐 | 官网引用 | App Store 链接 | 推荐理由 |
|---|---|---|---|---|---|
| ChatGPT Search，约 07:05 | 无 | 有／有，列第一且标记直接匹配 | 可见来源未见，隐藏链接未全部取回 | 有 | 8–48 分段、真长、角度、面积、三角放样、离线及 PDF |
| Perplexity，约 07:10 | 无 | 有／有，列第一，并直接推荐给偏心转接场景 | 完整十条来源均无 | 有 | 矩形开口、圆口、长度、偏移、真长与三角放样 |

两份回答的 DuctLab 主要能力与官方产品说明相符。ChatGPT 的 DuctLab 卡片同时带有标成 DuctCalc.Ca 的图片，属于一处来源呈现错配。两份回答均未交代 DuctLab 使用需要订阅。详细竞品及可见 URL 已入历史表。此次未获得 Gemini、Grok、Copilot、其他三个 App、以及 CW03 的新增回答。11 月 16 日的 4/5 是另一道 DuctLab 问题 DL01，无法与今日 2/2 作同题对比。 [DuctLab App Store](https://apps.apple.com/us/app/ductlab-hvac-duct-layout/id6804225465) · [固定题库](ai-query-library.md) · [历史数据](ai-visibility-history.csv)

## C. 技术检查

| 优先级 | 检查 | 结果及影响 |
|---|---|---|
| P1 | 真实 PerplexityBot | 5 条被质询的请求覆盖柜体校方、交付尺寸换算、车库架板件模板及两个木材资料页。请求日志里的 Cloudflare「已通过验证自动程序类别」均为「无」，身份由官方 IP 加完整 User-Agent 独立交叉核对。内容页质询会妨碍模型获得可供引用的网页正文。 [请求样本](2026-11-20-perplexity-official-requests.csv) |
| 正常 | 公网技术抽样 | 59 次初查中 58 次完整返回 200（含跟随重定向）。五种搜索爬虫 UA 的 35 次请求全部返回 200。首页与四款产品页有自指 canonical、`index,follow`、可读取的原始 HTML 正文及 H1，未见 noindex 响应头。 [逐请求证据](2026-11-20-http-evidence.csv) |
| 正常 | robots、sitemap、别名 | robots 为通配允许；10 份子站点地图有 2,562 个不重复 URL，比 19 日新增 11 条、移除 0 条。HTTP 首页及查验的旧 CutList 别名各经一次 301 到正式 URL。www 在本机一度解析失败，经 Google 公共 DNS 取得 IP 后，HTTPS 实测 301 到主域再返回 200。 [robots.txt](https://woodcuttool.com/robots.txt) · [sitemap.xml](https://woodcuttool.com/sitemap.xml) |
| 持续观察 | 索引及深层页面 | 方转圆算例当前 200、自指 canonical、正文可读。公开检索找到了 DuctLab 产品和支持页，未验证算例在 Google/Bing 的单 URL 索引状态。独立页面与全站重复内容没有作本日全量复核。 [方转圆算例](https://woodcuttool.com/apps/ductlab-hvac-duct-layout/square-to-round-example/) |

Cloudflare 的 AI Crawl Control 按标签显示最近一小时有 7 次 PerplexityBot 标识的 200，路径与本轮公开复测一致。该聚合未核对来源 IP，另有可展开的官方 IP 流量证据。OAI-SearchBot 和 GPTBot 分别用于搜索发现与训练抓取。人工复测使用搜索用途标识，其他爬虫的真实来源访问状态本轮未逐条验证。 [Perplexity 爬虫说明](https://docs.perplexity.ai/docs/resources/perplexity-crawlers) · [OpenAI 爬虫说明](https://platform.openai.com/docs/bots)

## D. 内容机会

本轮最优先的是把 DuctLab 方转圆算例接到已被两家 AI 证实存在的需求。原算例已有输入和真长结果，保留现有 URL，补足 8–48 分段选择与输出、PDF 用途和订阅说明的对应关系，并从产品页使用明确的「offset square-to-round worked example」锚文本链接。另一处可验证的新机会来自 Cabinet Refacing 的成对覆面门算例。现有页面已覆盖制作步骤，可在原文增加两扇门中缝改变时的尺寸对照，以及在 CabinetRefit 确认上架后加入官方产品入口。 [方转圆算例](https://woodcuttool.com/apps/ductlab-hvac-duct-layout/square-to-round-example/) · [柜门算例](https://woodcuttool.com/cabinet-refacing/worked-example-overlay-pair/) · [20 条基线机会与五个计算器](content-opportunities.md)

## E. 竞品及第三方

两个平台均推荐了 Transitions Layouts。Perplexity 还列出 Sheet Metal Layout: Patterns 与 Trueflat，竞争重点是分片方式、真长标记、可打印模板及 DXF。ChatGPT 列出 Platewrap 和 FabCalc。支持范围以竞品发布方的说明为准。今天补充的外部机会仍以已建立的社区清单为底稿，暂无新沟通或合作结果。 [Transitions Layouts](https://apps.apple.com/us/app/transitions-layouts/id6757512792) · [Sheet Metal Layout: Patterns](https://apps.apple.com/sr/app/sheet-metal-layout-patterns/id6791592420) · [Trueflat](https://play.google.com/store/apps/details?id=com.heyisoft.trueflat) · [竞品与社区记录](competitor-tracking.md)

## F. 三项行动建议

| 优先级 | 步骤 | 预期收益 | 实施难度与工时 |
|---|---|---|---|
| P1 | 先确认获批的 Cloudflare 修复路径。基础 Bot Fight Mode 的质询无法用普通 WAF Skip 排除。若已有适用的 Super Bot Fight Mode，评估限定主域、官方 IP 与完整 Bot UA，仅跳过对应爬虫检查的规则；若只有基础模式，先向 Cloudflare 核实身份识别，并评估关闭基础模式对全站的影响。用官方 IP 的内容页请求、响应和正文记录验收。 | 恢复官网内容被 Perplexity 自动抓取的机会 | 中，规则评估 30–60 分钟，需等待实际爬虫回访 |
| P1 | 给 DuctLab 算例补一段可引用的偏心输入与结果摘要，核对产品页至算例的锚文本，补充公开可核查的 PDF 能力和订阅说明。后续复跑 DL03 并检查两种引用入口。 | 增加官网算例曝光，同时保留直接下载路径 | 低，约 1–2 小时 |
| P2 | 核对 CabinetRefit 的正式 App Store 状态及产品页，再决定是否从翻新专题加入引用与下载入口。检查新上架 11 个 URL 的索引和主要内部入口。 | 让新增翻新内容更容易形成从搜索到产品的路径 | 低，约 1 小时 |

Cloudflare 说明直接 `IP Access Allow` 会绕开多类 WAF 与限速规则，变更前需要评估影响。此次仅做只读排查。生产安全策略、套餐和发布决定仍需用户批准。 [Bot Fight Mode 限制](https://developers.cloudflare.com/bots/get-started/bot-fight-mode/#limitations) · [Super Bot Fight Mode](https://developers.cloudflare.com/bots/get-started/super-bot-fight-mode/) · [IP Access 影响](https://developers.cloudflare.com/waf/tools/ip-access-rules/)

## G. 真实获客及下轮

本日未读取新增的 App Store Connect、Search Console、Bing Webmaster 或网站 AI 来源快照。最近一次后台数据仍是 11 月 19 日读取的 11 月 11–17 日 UTC Apple 窗口，ChatGPT 引荐四款合计 46 展示、27 下载，DuctLab 所得列显示 US$17。该数据为应用引荐。渠道转化、首订、续费和退款无新数据。已存在的 Codex 自动任务 ID 可查看，本次由该任务触发，无需另建。下轮继续按官方 IP 查内容页成功记录，并补 Gemini、Grok、Copilot 的 DL03 和 Casework 的 CW03，周度窗口复查真实获客。 [11 月 19 日数据](2026-11-19-daily-report.md) · [11 月 16 日周报](2026-11-16-weekly-report.md)
