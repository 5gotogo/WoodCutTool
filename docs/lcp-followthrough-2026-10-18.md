# LCP 后续修复与分发诊断，2026-10-18

状态：导航首屏开销已在源头修复，本地构建、全站检查及浏览器验证完成；本轮尚未部署。**真实用户的长尾 TTFB 仍未证明消除，不能宣布截图里的 LCP 已彻底解决。**

## 当前线上证据

只读查看 Cloudflare Web Analytics，过去 24 小时、GMT+8、排除自动程序：LCP 好 58%、需改进 23%、差 19%；P50/P75/P90/P99 为 2,020 / 3,664 / 7,048 / 17,196 ms。它与用户截图的过去 6 小时不是同一窗口，不计算两者的改善率。

P75 Sub-Parts 显示 TTFB 2,952 ms（92%）、Resource Load Delay 0、Resource Load Duration 0、Element Render Delay 258 ms（8%）。阶段分位数不能相加作为整体 LCP P75。

展开调试样本后：

| 页面 | 样本计数 | LCP | TTFB | 资源开始等待 | 资源请求阶段 | 绘制延迟 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| `/compare/track-saw-vs-table-saw-sheet-goods/` | 1 | 7,048 | 2,922 | 6 | 4,103 | 19 |
| `/learn/storage-bench-hinge-clearance-guide/` | 1 | 9,176 | 3,105 | 143 | 5,903 | 28 |

单位 ms。前者使用 `compare-saws-800.avif`，后者使用 `wood-09-closet-planning-960.avif`，已经有 link 发起及 high 优先级。不能再把它们诊断为没有 AVIF 或没有 preload；资源请求阶段也不能被当作服务器 CPU 时间或纯文件下载时间。各只有一个样本，不能建立稳定的单页分位数。

地区图可见美国 23 个好、1 个差；巴西 2 个好、6 个需改进、5 个差。小样本只用于选择后续调查范围，不能单凭国家分组归因。

## 本次修复

原来除 Wood 外，页面都会下载完整 `site-chrome.js`。虽然菜单 DOM 延迟插入，全部隐藏菜单的数据、描述、SVG 和渲染函数仍在首屏脚本中，与首图争带宽。

现在由 `scripts/build-site-navigation.mjs` 从同一个原始 chrome 源生成两个文件：

| 资产 | 原始大小 | gzip 大小 | 时机 |
| --- | ---: | ---: | --- |
| 原 `site-chrome.js` | 57,486 B | 14,538 B | 原首屏 |
| 新 `site-navigation.js` | 26,506 B | 6,906 B | 首屏 |
| 新 `site-menus.js` | 35,706 B | 9,256 B | 首次悬停、聚焦或展开菜单 |

首屏导航压缩字节减少 52.5%。打开菜单后总导航字节比旧版多约 1.6 KB，是拆分的代价；没有把全部加载成本消除。五个菜单共用一次模块请求，后续展开复用；失败可重试。顶栏、栏目高亮、CTA、页脚仍及时挂载，菜单文字、链接、图形、语言处理与旧版一致。

通用和 Wood 导航共用 `scripts/async-navigation.mjs` 的异步关闭逻辑；按 Escape、点外部、再次点击、切换菜单都不会在请求返回后误重新展开。Wood 生成资产字节未改变。

共享后处理和 bootstrap preload 一起切换到新资产，两个新文件补齐浏览器缓存配置。保留旧 authored 文件作为唯一的内容来源，CSS 选择和现有架构审计仍使用它。2,324 个修改 HTML 与 HEAD 的差异严格只有导航脚本/preload 的 URL 替换；正文、全部 JSON-LD、图片、样式及 sitemap 文件未改。完整 build 带出的无关 schema 排序与空白改动已恢复。

## 同条件弱网对照

同一份最终 HTML 和其他资产、本地 gzip、独立 Chrome、桌面 1440×900 / DPR 1，4 倍 CPU、配置 400 ms 延迟和 50 KB/s 下载，浏览器缓存关闭，每页三轮中位数。对照服务器唯一差异是把新导航 URL 映射到原始脚本；两边都保留相同页面、图片、CSS 和脚本执行顺序。本地 HTML 首字节通常几毫秒，不代表生产网络。

| 页面 | LCP 前 → 后（ms） | load 前 → 后（ms） | 总传输前 → 后（B） |
| --- | ---: | ---: | ---: |
| Troubleshooting | 780 → 792 | 1,374 → 1,206 | 43,506 → 35,874 |
| Track Saw vs Table Saw Sheet Goods | 1,708 → 1,492 | 1,693 → 1,484 | 49,523 → 41,891 |
| Storage Bench Hinge Clearance | 1,828 → 1,688 | 2,173 → 2,020 | 76,419 → 68,787 |
| Plywood Calculator | 752 → 736 | 2,069 → 1,850 | 50,379 → 42,747 |

两张首图页面 LCP 分别减少 216、140 ms。Troubleshooting 的文字 LCP 没有改善；12 ms 的增加不作为确定性回归。不能把脚本减少 52.5% 说成全站 LCP 减少 52.5%。

另测 16 条截图涉及页面族及代表路径，390×844、DPR 1、4 倍 CPU、配置 150 ms 延迟、200 KB/s 下载，三轮共 48 次：各页 LCP 中位数 252–524 ms，单次最高 584 ms，CLS 0、横向溢出 0。最大长任务 117 ms，未测真实 INP。截图的部分 URL 被截断，Cabinet troubleshooting 以同族路径代表，Track Saw 覆盖 Table Saw、Panel Saw、Circular Saw 三条；不声称所有截断标签都已唯一识别。

## 冷连接与复用连接

新增 `npm run audit:delivery`。每个路径、每轮启动独立 curl 进程，连续请求两次；第一条建立新连接，第二条是否复用由 `newConnections` 核对。保留 DNS、TCP、TLS、请求等待、下载、HTTP 状态、压缩、CF-Ray、缓存响应头和页面资产标记。没有浏览器认证资料，没有重试或删除超时样本。

四路径 × 三轮 × 两次，共 24 条有效 HTTP 200 / gzip 样本。中位数：

| 路径 | 冷连接 TTFB | 复用连接 TTFB |
| --- | ---: | ---: |
| African Mahogany | 792 ms | 254 ms |
| Troubleshooting | 638 ms | 280 ms |
| Track Saw vs Table Saw Sheet Goods | 664 ms | 226 ms |
| Storage Bench Hinge Clearance | 679 ms | 254 ms |

全部样本冷连接 607–855 ms，复用连接 224–342 ms；命中 SEA/HKG 等节点。这个客户端没有复现 RUM 的约 3 秒 TTFB，不能排除慢地区的连接、丢包、边缘等待等原因。请求等待含请求网络往返，不能称作纯服务器处理时间。

随后用浏览器访问生产域名，桌面冷浏览器缓存、4 倍 CPU、配置 150 ms 延迟和 200 KB/s、每页三轮：四页 LCP 中位数依次为 436 / 444 / 772 / 900 ms，TTFB 中位数为 247 / 326 / 237 / 296 ms。这些导航会复用 DNS/TLS 连接；第一条新连接的 TTFB 为 662 ms。线上仍使用原完整导航脚本，本轮没有上线，所以不计算生产改善率。这一客户端仍未复现慢地区的秒级 TTFB。

四页响应均见 `DYNAMIC`，缺少 ETag、有边缘注入；单凭这些不能证明 Pages 内部静态缓存坏了。只读控制台确认当前 Cache Rules 0 条、缓存响应规则 0 条，HTTP/2、HTTP/3、TLS 1.3 已启用。对 African Mahogany 做 Brazil 条件的规则模拟，匹配项为 URL Normalization 与缓存参数，模拟结束 200；没有发现额外的匹配重定向/自定义缓存规则。模拟器不提供真实巴西连接或 PoP 延迟，也不证明缓存 HIT。

没有修改 DNS、缓存规则或安全防护。Pages 自带静态缓存，盲目加全站 HTML 缓存可能影响发布一致性、重定向及 Functions；本轮没有在缺少受控证据时这样做。依据：[Pages 分发与缓存](https://developers.cloudflare.com/pages/configuration/serving-pages/)、[LCP 阶段定义](https://web.dev/articles/optimize-lcp)。

## 验证与下一步

- 完整 `npm run build` 通过；清理无关生成变动后，最终 `npm run check`、站点验证及 `git diff --check` 通过。
- 新导航：20 个页面/视口组合、100 次菜单内容/属性比较、4 类异步竞态、失败重试、中文懒加载菜单与原始版本比较通过；运行异常为空。
- 原入口回归：24 项响应式布局/实际计算样式与修改前一致、9 项 DPR 图片请求检查、真实计算器编辑、首页预设、Blog 搜索、无脚本样式及语言切换通过；运行异常为空。
- 已查看手机菜单截图。完整测量与验证范围见[原始记录](lcp-followthrough-2026-10-18.json)。

下一阶段必须发布新资产后确认线上不再首屏请求旧脚本、菜单模块只按需加载，再按相同时间窗、设备、地区和足够样本核对 LCP/TTFB P75/P90。当前修复降低资源竞争；**它没有消除 HTML 返回前的真实网络等待**。如果新窗口仍由 TTFB 主导，应继续针对真实慢地区请求收集网络/边缘时序，而不是继续重复压缩已很小的 AVIF 或改 CSS。

复测：

```sh
npm run build
npm run check
WCT_PREVIEW_GZIP=1 node scripts/dev-server.mjs --port 4198
# 独立 Chrome：--headless=new --remote-debugging-port=9359 --user-data-dir=/tmp/wct-lcp-profile
WCT_CDP_PORT=9359 npm run test:navigation-browser
node scripts/audit-site-performance.mjs --origin=http://127.0.0.1:4198 --cdp-port=9359 --width=1440 --height=900 --routes=/troubleshooting/,/compare/track-saw-vs-table-saw-sheet-goods/,/learn/storage-bench-hinge-clearance-guide/,/plywood-cut-calculator/ --latency=400 --download-kbps=50 --runs=3 --output=/tmp/wct-slow-lcp.json
npm run audit:delivery -- --runs=3 --output=/tmp/wct-delivery.json
```
