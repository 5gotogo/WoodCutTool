# LCP 导航等待优化，2026-10-28

本次完成了代码修复和本地验证，尚未推送或部署。主要收益是提前获取用户即将打开的站内页面，减少点击后的 HTML 等待；**没有证明外部首次访问的长尾 TTFB 已消除，也不能宣布真实用户 LCP 已达标。**

## 截图对应的真实用户证据

只读查看已打开的 Cloudflare Web Analytics，与截图相同的过去 12 小时、GMT+8、排除自动程序窗口：LCP 好 65%、需改进 24%、差 12%；P50/P75/P90/P99 为 664 / 2,592 / 9,360 / 25,060 ms。

P75 子阶段视图显示 TTFB 2,275 ms（91%）、资源加载延迟 0、资源加载时长 0、元素渲染延迟 227 ms（9%）。这些阶段分位数不能相加作为整体 LCP P75。百分比经界面四舍五入；77 次访问、83 次页面浏览不是 LCP 样本数。调试元素列表当时没有数据，截图中截断的 Cabinet 路径没有被唯一识别。

已确认现有页面使用内联 CSS，Learn 首图已有 AVIF 和匹配的高优先级 preload。当前静态页已绕过 Functions；不能再把问题解释为缺少这些已有优化。

## 修复

### 提前交付可见标题

共享后处理将全部 Learn、Troubleshooting、Worksheets 页面的 head JSON-LD 移到 `</main>` 后，共 338 页。对整个仓库的 2,582 个 HTML 核对：每个 JSON-LD 对象、正文/SEO 内容签名均与修改前一致；sitemap 日期和内容保持不变。其他页面族沿用原有 schema 生成方式。

Base Cabinets on an Uneven Floor 的 `<h1>` 之前原有 48,889 字节，现为 43,939 字节；该前缀 gzip 从 11,773 降到 10,320 字节。这个变化让慢速流式响应更早到达标题，不能减少收到 HTML 之前的网络等待。新增守卫防止相关生成器再次把 schema 放回 head。

### 对站内下一页提前获取 HTML

通用导航和 Wood 导航共用 authored `assets/site-chrome.js` 中的初始化函数，经现有生成器输出，无额外启动脚本请求。当前页面 `load` 后再等两帧，才注册浏览器原生 Speculation Rules：

- 使用 `prefetch` 和 `moderate`，浏览器根据悬停或按下链接的意图触发；初次加载时没有立即批量下载。
- 只匹配同源、尾斜杠的页面路径；排除当前页、首页、`/api/*`、`/go/*`、查询参数、锚点、下载、`nofollow`、新标签页和 `data-no-prefetch` 链接。
- HTML 预取不执行下一页的脚本、计算器或统计；没有采用 prerender。
- 不支持 API、开启 Save-Data 或处于 2G/slow-2G 时保持普通导航，浏览器也可以自行拒绝预取。

这是渐进增强。立即点击而来不及预取、外部首次访问、不支持或禁用预加载的浏览器，都仍需等待正常请求。生产环境是否允许并复用预取，必须发布后核对。

原生预取使用独立的导航缓存，因此可以处理当前 `max-age=0, must-revalidate` 的 HTML，无需改变生产缓存 TTL。依据：[Chrome 导航预取文档](https://developer.chrome.com/docs/web-platform/prerender-pages#prefetch)、[实施指南](https://developer.chrome.com/docs/web-platform/implementing-speculation-rules)。

启动成本：通用导航 gzip 6,472 → 6,961 B，Wood 导航 4,217 → 4,705 B，分别增加 489、488 B。预取会额外下载用户最终未点击的候选 HTML；浏览器负责控制候选数量。Wood 启动文件仍低于现有 18 KB 原始字节预算。

## 可复现的浏览器结果

新增 `test:navigation-prefetch-browser` 用真实 HTTP 服务记录请求。对同一个目标 HTML、相同 gzip 和 `public, max-age=0, must-revalidate` 响应头，统一添加 1,200 ms 的服务端响应等待。比较正常点击和悬停预取完成后的点击，各三轮；独立 Chrome，桌面 1440×900。

| 三轮中位数 | 普通导航 | 预取完成后的导航 |
| --- | ---: | ---: |
| 点击后的 TTFB | 1,206 ms | 3.7 ms |
| 点击后的 LCP | 1,236 ms | 64 ms |
| 每轮目标 HTML 请求数 | 1 | 1 |

预取组的导航条目均为 `deliveryType: navigational-prefetch`，点击没有再请求一次 HTML。这个实验把等待提前到用户点击之前，**没有让服务器本身处理得更快**；不是生产改善率。

12 类排除链接的实际悬停、无支持/Save-Data/2G 降级、Wood 手机布局均通过。该测试从服务端观测预取，因为浏览器进程的预取请求不经过页面 target 的 CDP Fetch 拦截。

另做冷导航对照：本地 gzip、关闭浏览器缓存、4× CPU、配置 400 ms 延迟及 50 KB/s 下载、DPR 1，每页三轮。桌面结果：

| 路径 | 修改前 LCP | 修改后 LCP |
| --- | ---: | ---: |
| `/troubleshooting/base-cabinets-uneven-floor/` | 708 ms | 684 ms |
| `/troubleshooting/cabinet-back-will-not-fit/` | 720 ms | 680 ms |
| `/blog/tile-baseboard-trim-planning/` | 736 ms | 760 ms |
| `/learn/saw-kerf-explained/` | 1,324 ms | 1,348 ms |
| `/wood/mun-ebony/` | 680 ms | 700 ms |

冷加载的几十毫秒差异不作为确定性的全站改善；额外启动脚本也有成本。主要收益仍限定在预取命中的站内导航。这个本地预览的 TTFB 约几毫秒，不能模拟生产长尾。

## 验证与发布边界

- 完整 `npm run build` 通过；清理无关生成改动后，最终 `npm run check`、`git diff --check` 通过。
- 24 项 360/390/430/1440px 布局和样式检查、9 项 DPR 图片请求检查，以及真实计算器编辑、首页预设、Blog 搜索、语言切换、无脚本样式通过。
- 20 个页面/视口组合、100 次菜单比较、四类异步关闭竞态、网络失败重试、中文懒加载菜单通过。
- 最终弱网测量共 39 轮：手机八页的 LCP 中位数为 644–1,032 ms，桌面五页为 680–1,348 ms；单次最高 1,360 ms，全部无横向溢出。手机 Learn 和 Plywood 有小幅布局偏移，最大 CLS 0.032，其余测量为 0。
- 已删除构建带出的无关翻译、schema 重复、库存计数和 sitemap 日期变更，提交只包含本次性能修改。
- 浏览器完整原始记录和手机弱网结果见[验证数据](lcp-navigation-2026-10-28.json)。本轮没有测得真实 INP。

公开生产请求只覆盖两个代表路径，各冷连接/复用连接一次：Base Cabinets TTFB 1,169 / 331 ms，Saw Kerf 706 / 293 ms，HTTP 200、gzip。它们没有复现真实用户的秒级尾部；`DYNAMIC` 响应头本身也不能证明 Pages 内部静态缓存失效。静态分发继续由 [Pages 缓存机制](https://developers.cloudflare.com/pages/configuration/serving-pages/) 负责。

发布后应先验证真实悬停请求及导航复用，再用相同时间窗、设备、地区和足够样本比较 LCP/TTFB P75/P90。外部首次访问的长尾仍需要具体慢请求的网络/边缘时序；这次提交没有消除该等待。

```sh
npm run build
npm run check
WCT_PREVIEW_GZIP=1 node scripts/dev-server.mjs --port 4198
# 独立 Chrome：--headless=new --remote-debugging-port=9359 --user-data-dir=/tmp/wct-lcp-qa
WCT_PERF_ORIGIN=http://127.0.0.1:4198 WCT_CDP_PORT=9359 npm run test:navigation-prefetch-browser
```
