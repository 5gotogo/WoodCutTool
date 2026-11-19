# WoodCutTool 每日抓取与获客检查

2026-11-19，Asia/Shanghai。后台和公开响应于北京时间约 08:34–08:42 读取。作为 11 月 16 日周报的补充，尚余固定 AI 题及完整周研究待继续执行。

## A. 本轮核心结论

- **PerplexityBot 标识请求出现新的 403，需要用真实爬虫记录核验影响。** 11 月 17 日同一简写标识的七个地址都返回 200。本次初查中，首页、四款产品页和主 sitemap 返回 403，robots 仍返回 200。复查使用官方完整标识请求 CutList 详情，同样返回 403。请求来自本轮审计环境，真实 Perplexity 来源 IP 的访问状态待 Cloudflare 安全事件核验。 [HTTP 证据表](2026-11-19-http-evidence.csv)
- **Apple 的 ChatGPT 引荐最近七天显示 46 次展示、27 次下载。** 数据周期为 11 月 11–17 日 UTC，TileFit 11 次下载，DuctLab 9 次，CutList 4 次，Casework 3 次。DuctLab 显示 US$17 所得，其余三款所得列显示短横线。 [本轮指标记录](2026-11-19-observations.json)
- **Google 网页自然搜索 11 月 10–16 日录得 37 次展示、0 次点击。** 两个系统均缺本轮相邻且无重叠的对照周期。整体搜索可见度、引荐付费率和用户长期价值暂无法判断增长或下降。 [Google 效果报告](https://search.google.com/search-console/performance/search-analytics?resource_id=sc-domain%3Awoodcuttool.com&num_of_days=7)

## B. AI 推荐监测

尝试补题 CW03，原句为 “Is there an iPhone app for cabinet parts and cut list generation?” Gemini 提交后可见新的柜体应用对话标题，完整回答及原会话 URL 未取回。Perplexity 提交环节遇到连接超时，发送结果未确认。后续两次直接重连 Chrome 均超时。历史表记录 submitted_unverified 和 attempted_unverified，提及、推荐、官网引用和下载链接字段保留为空。今天可纳入推荐率计算的新回答数为 0。

11 月 16 日 DuctLab DL01 的 4/5 推荐结果仍为上次观测，今天未复测。此前三个 App 的完整独立题、完整来源列表和实际模型版本仍待补齐。 [上次周报](2026-11-16-weekly-report.md) · [固定题库](ai-query-library.md)

## C. 每日技术检查

首轮 67 次请求中，59 次取得 200 状态，6 次为 403，2 次连接超时。另做 17 次复查，总计 84 次请求。11 次 403 均使用 PerplexityBot 简写或官方完整 User-Agent。各次请求的网络出口与 Cloudflare 边缘机房存在差异，单次对照无法确定触发规则的唯一条件。

| 检查 | 结果与证据 | 处理优先级 |
|---|---|---|
| PerplexityBot 简写 | 首轮首页、四产品页和 sitemap.xml 返回 403，响应正文为 Your request was blocked.，server 为 cloudflare，robots 为 200。后续首页、CutList 和 sitemap 复查继续出现 403。 [首页](https://woodcuttool.com/) · [CutList](https://woodcuttool.com/apps/cutlist/) · [sitemap](https://woodcuttool.com/sitemap.xml) | P1，核验真实爬虫 |
| PerplexityBot 官方完整标识 | CutList 产品页返回 403，响应时间 2026-11-19 00:42:01 GMT，CF-Ray 为 a5cb2c310a15915e-DFW。相同标识的 robots 为 200，首页请求超时。 [详情页](https://woodcuttool.com/apps/cutlist/) | P1，按 Ray ID 查事件 |
| OAI-SearchBot、Googlebot、Bingbot、Claude-SearchBot | 首轮各七个地址均取得 200，未见 cf-mitigated 响应头。搜索爬虫访问需要结合服务方来源验证。 [原始响应表](2026-11-19-http-evidence.csv) | 持续观察 |
| robots 和站点地图 | robots 与上次规则一致，通配允许访问。十份子 sitemap 合计 2,551 个不同 URL，URL 集合与 11 月 17 日一致。 [robots](https://woodcuttool.com/robots.txt) · [sitemap](https://woodcuttool.com/sitemap.xml) | 无规则变更建议 |
| 首页和 Tile Calculator 超时 | 两个初次普通 UA 请求超时，复查均取得 200。其他复查也有连接超时，因此网络稳定性为本轮证据限制。 [首页](https://woodcuttool.com/) · [Tile Calculator](https://woodcuttool.com/tile-calculator/) | 后续观察 |
| CutList HTML 正文 | 初次普通 UA 请求有 200 状态但正文截在 CSS，中间未见 main 或 H1。随后普通 UA 复查取得含 main、H1 和产品文案的完整 HTML。状态码与可读正文分别核验。 [CutList](https://woodcuttool.com/apps/cutlist/) | 后续观察 |

Perplexity 官方建议以发布的 IP 范围识别服务方流量。Cloudflare Verified bot 可使用签名、IP 与稳定 UA 或反向 DNS 确认身份。本轮审计 UA 请求没有服务方身份验证。下一步按上述时间和 Ray ID 查命中规则，再查真正 PerplexityBot IP 的动作结果与近期成功记录。若服务方流量正常，可把本轮现象记为审计来源被拒绝。若真实搜索爬虫同样被拒绝，再制定针对已验证搜索用途的规则调整草稿。 [Perplexity 官方爬虫说明](https://docs.perplexity.ai/docs/resources/perplexity-crawlers) · [Cloudflare 身份验证说明](https://developers.cloudflare.com/bots/concepts/bot/verified-bots/)

## D. 内容机会进度

本轮执行每日技术与获客检查，新增专业内容机会为 0。已建立的四款 App 共 20 条机会继续保留。偏心方转圆算例已在上次检查中验证上线，下轮优先完成其索引查询及 DL03 推荐测试，观察引用是否落到算例 URL。 [内容机会库](content-opportunities.md) · [已有方转圆算例](https://woodcuttool.com/apps/ductlab-hvac-duct-layout/square-to-round-example/)

## E. 产品与竞品

FlashingLab 1.0 本轮后台仍显示正在等待审核，上次优先发布建议保持。当前公开上架状态与新增获客尚未确认。本次没有新的竞品功能、AI 引用增长或外部合作证据。 [FlashingLab 后台](https://appstoreconnect.apple.com/apps/6832892253/distribution/ios/version/inflight) · [竞品跟踪](competitor-tracking.md)

## F. 三项行动建议

| 优先级 | 工作与步骤 | 预期收益 | 难度与预计工时 |
|---|---|---|---|
| P1 | 在 Cloudflare 安全事件按 00:42:01 GMT 和 Ray ID 核对命中规则，再按官方 IP 检查真实 PerplexityBot 流量 | 确认本轮 403 是否影响搜索发现 | 低至中，约 30–60 分钟。浏览器连接恢复后可继续只读核查 |
| P1 | 恢复会话后取回 CW03 完整答案，记录会话 URL 和全部引用，再补跑 DL03 | 增加柜体与方转圆的可比需求样本 | 低，约 1–2 小时，平台响应时间另计 |
| P2 | 按固定完整自然周读取四款 App 三个引荐渠道和 Google 搜索结果，核对所得短横线及订阅事件口径 | 形成下一次可配对的获客对照 | 中，约 1 小时 |

## G. 后台实际数据与下轮

下表均为 App Store Connect 的「App 引荐来源」，日期 2026-11-11 至 2026-11-17 UTC。格内为展示次数／下载总数／报表显示所得。短横线和未列出分别保留原界面状态。下载总数的定义与首次下载次数不同。

| App | ChatGPT | Google | Google Chrome |
|---|---|---|---|
| CutList | 9／4／— | 4／1／— | 10／1／— |
| DuctLab | 15／9／US$17 | 2／1／US$8 | 3／2／— |
| TileFit | 17／11／— | 2／2／— | 未列出 |
| Casework | 5／3／— | 未列出 | 未列出 |

[CutList 来源](https://appstoreconnect.apple.com/apps/6768171871/analytics/acquisition/sources/app-referrers?dateSpec=d7) · [DuctLab 来源](https://appstoreconnect.apple.com/apps/6804225465/analytics/acquisition/sources/app-referrers?dateSpec=d7) · [TileFit 来源](https://appstoreconnect.apple.com/apps/6792627022/analytics/acquisition/sources/app-referrers?dateSpec=d7) · [Casework 来源](https://appstoreconnect.apple.com/apps/6794987242/analytics/acquisition/sources/app-referrers?dateSpec=d7)

上次窗口为 11 月 8–14 日 UTC，ChatGPT 引荐合计 38 展示、25 下载。本次窗口后移三天，与上次重叠四天，因此 46 展示、27 下载仅作为新的滚动窗口快照记录。Google 搜索窗口同样后移三天，37 展示、0 点击、CTR 0%、平均排名 45.9；上次为 38 展示、0 点击、平均排名 42.7。网站 AI 引荐访问、首订、试用、续费、退款、各文章实际带来的下载、本轮 Bing 索引数据均未更新。 [本轮结构化记录](2026-11-19-observations.json) · [上次周报](2026-11-16-weekly-report.md)

本轮需要确认的事项为 Perplexity 搜索流量的 Cloudflare 实际判定。生产策略如需调整，先形成规则与影响范围供用户批准。周内继续补足逐题测试及新内容研究，周报中的未完成项保留到下一次执行。
