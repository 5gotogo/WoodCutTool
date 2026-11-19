# WoodCutTool AI 搜索与获客复测

2026-11-16，北京时间。手动复测。以下按各平台报表的实际日期和时间窗口解读。

## A. 本轮核心结论

- **Google 最近 24 小时录得 3 次展示、0 次点击。** Cloudflare 同为滚动 24 小时，录得 115 次站点访问、126 次页面浏览，且流量来源覆盖所有渠道。 [Search Console](https://search.google.com/search-console/performance/search-analytics?resource_id=sc-domain%3Awoodcuttool.com) · [Cloudflare Web Analytics](https://dash.cloudflare.com/)
- **Apple 最新数据到 11 月 14 日 UTC。** 11 月 8–14 日，四款核心 App 在 ChatGPT 引荐下共显示 38 次展示、25 次下载。DuctLab 与 TileFit 各 11 次，两者合计占 22/25。DuctLab 显示 US$17 引荐所得，其余三款所得列显示短横线。 [Apple 获客来源说明](https://developer.apple.com/help/app-store-connect/view-app-analytics/view-acquisition-sources/)
- **DuctLab 的固定需求题获 4/5 平台推荐。** Gemini 从上一轮推荐配件放样转向风管走线与选径，本轮未提 DuctLab。方转圆算例已上线、可读并进入 sitemap。整体 AI 可见度趋势仍缺跨周可比样本。 [DuctLab 算例](https://woodcuttool.com/apps/ductlab-hvac-duct-layout/square-to-round-example/)

## B. AI 推荐监测

同一固定题 DL01，在五家分别开新会话。问题原文为 “What is the best iPhone app for HVAC duct layout?” 新回答属于单次样本。11 月 14 日逐题可比子集为 ChatGPT Search、Gemini、Grok，这三家的推荐数由 3/3 变为 2/3。Perplexity 和 Copilot 此前参与七题同会话测试，此次建立逐题基线。完整题库其余 13 题本轮未跑。

| 平台 | 今天 | 正确目标 App Store 链接或引用 | 11 月 14 日独立会话 |
|---|---|---|---|
| ChatGPT Search | 推荐 DuctLab 做钣金配件放样，另外列出 Design Day 和 FieldFab | 美国区正确 ID | 推荐 |
| Gemini | 推荐 Magicplan 配 Ductulator 或 HVAC Duct Sizer。未提及 DuctLab | 无目标链接 | 推荐 |
| Perplexity | 首推 DuctLab 做变径、方转圆、偏移和弯头。另提 FieldFab 和 ASHRAE HVAC Duct Sizer | 美国区正确 ID | 无独立样本 |
| Grok | 推荐 DuctLab 做配件展开、估算与 PDF，选径另提 Digiduct | 来源链接待逐条核对 | 推荐 |
| Microsoft Copilot | 首推 DuctLab，理由包括配件放样、材料估算、PDF | 显示 DuctLab App Store 引用标题，URL 待核对 | 无独立样本 |

品牌提及、官网引用和模型功能陈述仅完成部分核验，本轮无法给出完整引用率。 [ChatGPT Search](https://chatgpt.com/c/6afa5da4-f4a0-83e9-866c-bede91ee5015) · [Gemini](https://gemini.google.com/app/dd27bd21773c7af2) · [Perplexity](https://www.perplexity.ai/session/47ab0b3f-8b18-4337-aafb-cd9a418d3b7f) · [Grok](https://grok.com/c/3899a3c0-da66-48ff-8500-41b4f9592ce4) · [Copilot](https://copilot.com/chat/conversation/cba11ef9-dba5-4d1a-9a3c-739d2e9c225f)

## C. 网站检查

- 67 次 HTTP 请求最终均为 200，包含五种爬虫 User-Agent 的 35 次模拟请求。核心四个产品页均可直接读取 HTML，使用自指 canonical 和 index,follow。抽样无 Cloudflare challenge 响应头，真实爬虫的独立访问仍待日志确认。三个既有重定向均一跳到规范页面。 [HTTP 证据](2026-11-16-http-evidence.csv) · [robots.txt](https://woodcuttool.com/robots.txt)
- 10 份子 sitemap 合计 2,551 个不同 URL，比上次多 1 个。新增的是 DuctLab 方转圆算例，已从产品页直链，实测 200、自指 canonical、允许索引，HTML 有尺寸、真长表和四面 SVG。逐 URL 收录未核验。 [产品页](https://woodcuttool.com/apps/ductlab-hvac-duct-layout/) · [算例](https://woodcuttool.com/apps/ductlab-hvac-duct-layout/square-to-round-example/) · [产品 sitemap](https://woodcuttool.com/sitemap-apps.xml)
- CutList 详情页 H1 已改为产品全名。首页仍写试用后需订阅，详情及美国区 App Store 仍写基础排版免费。在售包实际权益待实机核验。 [首页](https://woodcuttool.com/) · [产品详情](https://woodcuttool.com/apps/cutlist/) · [App Store](https://apps.apple.com/us/app/cutlist-plywood-optimizer/id6768171871)

## D. 内容机会

本次优先复测数据，沿用上轮 20 条机会库。方转圆静态算例现已上线，交互计算器仍待核实。下列五题用于下轮选题，不计为新增机会。 [机会库](content-opportunities.md)

| 问题 | 对应页面或 App |
|---|---|
| 偏心方转圆的圆口分段数如何影响真长？ | DuctLab 已上线算例的交互输入 |
| 偏心矩形变径的四面斜边怎么复算？ | DuctLab 几何工具 |
| 人字铺以门洞还是房间为中心能减少窄边条？ | TileFit 图示与对照 |
| 嵌入柜背的槽深如何改变背板尺寸？ | Casework 与柜体计算器 |
| 锁纹加 1/8 英寸锯缝时实需几张板？ | CutList 的通用板材算例 |

## E. 竞品线索

Design Day、FieldFab 和 HVAC Duct Sizer 今日与 DuctLab 出现在同一需求题的不同回答里。模型对 “duct layout” 的理解分为配件放样、整套管路设计和选径。按 DuctLab 已有方转圆算例追踪独立制造题的命中情况，比只看宽泛的 HVAC 题更容易解释差异。竞品功能和引用趋势未做新的逐条验证。 [竞品跟踪](competitor-tracking.md) · [Perplexity 回答](https://www.perplexity.ai/session/47ab0b3f-8b18-4337-aafb-cd9a418d3b7f) · [Gemini 回答](https://gemini.google.com/app/dd27bd21773c7af2)

## F. 三项行动

| 优先级 | 步骤 | 预期收益 | 难度与工时 |
|---|---|---|---|
| P0 | 用美国区在售 CutList 和无订阅帐户核对权益，再起草统一文案 | 减少商店与官网说法冲突 | 低，2–4 小时另计实机核验 |
| P1 | 用 Search Console 检查方转圆页面的索引，再复测 DL02/DL03，记录引用是否落到新算例 | 判断上线内容是否进入实际搜索与推荐 | 低，约 1 小时 |
| P1 | 为新算例的 App Store 入口核验可识别来源，并按相同周期记录 Apple 和网站数据 | 看清页面到商店的点击路径 | 中，半天 |

## G. 后台数据与下轮

Apple 下表均为 11 月 8–14 日 UTC 的「App 引荐来源」。每格为展示／下载总数／报表显示所得。短横线为报表原样。未列出表示该渠道没有出现在所选视图。Google 与 Google Chrome 分别统计。ChatGPT 来源体现商店入口归因。

| App | ChatGPT | Google | Google Chrome |
|---|---|---|---|
| CutList | 3／1／— | 4／1／— | 7／1／— |
| DuctLab | 19／11／US$17 | 6／1／US$8 | 4／2／— |
| TileFit | 14／11／— | 未列出 | 未列出 |
| Casework | 2／2／— | 未列出 | 未列出 |

[CutList 明细](https://appstoreconnect.apple.com/apps/6768171871/analytics/acquisition/sources/app-referrers?dateSpec=d7) · [DuctLab 明细](https://appstoreconnect.apple.com/apps/6804225465/analytics/acquisition/sources/app-referrers?dateSpec=d7) · [TileFit 明细](https://appstoreconnect.apple.com/apps/6792627022/analytics/acquisition/sources/app-referrers?dateSpec=d7) · [Casework 明细](https://appstoreconnect.apple.com/apps/6794987242/analytics/acquisition/sources/app-referrers?dateSpec=d7)

CutList 在同一窗口按来源大类显示 App Store 搜索 193 次下载、浏览 4 次、App 引荐 4 次、网页引荐 2 次。App 引荐明细的三条具名行各 1 次下载，大类总数比三条具名行之和多 1 次。首订、续费、退款、付费率和引荐长期价值仍未读取。 [CutList 来源总览](https://appstoreconnect.apple.com/apps/6768171871/analytics/acquisition/sources?dateSpec=d7)

Google 自然网页搜索 11 月 7–13 日录得 38 展示、0 点击、CTR 0%、平均排名 42.7。热门词可见 plywood layout calculator（3 展示）、plywood cut calculator（2）、sheet material calculator（2）。滚动 24 小时图跨北京时间 11 月 15–16 日，显示平均排名 46.7。 [Google 七天效果报告](https://search.google.com/search-console/performance/search-analytics?resource_id=sc-domain%3Awoodcuttool.com&num_of_days=7)

Cloudflare 过去 24 小时（GMT+8，排除自动程序）来源榜显示直接 110、DuckDuckGo 2、Ecosia 2、Bing 1。未看到具名 AI 引荐。Bing 后台和逐 URL 索引状态在本轮未核验。下一轮优先补 CutList、TileFit、Casework 的固定首题和 DuctLab 的制造意图题，然后取与本轮等长的 Apple 窗口和网站报表。 [Cloudflare Web Analytics](https://dash.cloudflare.com/)
