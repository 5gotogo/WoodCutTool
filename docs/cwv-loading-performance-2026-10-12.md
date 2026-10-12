# LCP 继续修复 — 2026-10-12

截图的过去 12 小时窗口为 LCP 良好 44%、需要改进 22%、差 33%，26 次访问、29 次浏览。7,523 毫秒是页面加载时间，不是 LCP；访问数不能当作 LCP 样本数。URL 标签被截断，Sheet Good 暂按 `/learn/sheet-good-edge-quality-acceptance/` 匹配，Drawer Slides 按现有 comparison 路径匹配。未获得底层 RUM 导出，因此不能确定所有截断路径，也不能给差样本指定根因。

## 线上核对

只读获取确认 Learn、Wood、Compare、Blog 已有此前生成的完整内联样式及轻量运行时。首页仍有阻塞的 interactive.css，Crown Molding 仍有 construction.css。Wood 的首屏主要绘制元素是 p.lead；当前页面已不依赖外部 CSS，继续对其内联样式做重复优化没有已测收益。

线上 Chrome 抽测三轮中位数：首页 LCP 1,072 ms / TTFB 364 ms，Crown Molding 1,112 / 337 ms，Wood Eastern Red Cedar 560 / 273 ms，Blog 528 / 295 ms。该客户端的 curl 响应经过 SEA 节点；它不是截图用户的地区分布，也不能排除其他用户出现较长 TTFB 或下载时间。这些均为修改前线上结果，不是发布后的验证。

## 修改

- 首页完整专用样式为 58,363 字节，替代通用 interactive.css 的 76,697 字节和旧的重复首屏内联规则。已将旧内联中实际生效的表单规则迁回 styles.css；移除首页阻塞 CSS 请求，语言、演示和转化脚本降低请求优先级。剩余 interactive.css 缩小至 52,138 字节。
- 23 个 Construction 页面内联完整 31,682 字节共享样式；三个 Cabinet/Drawer 页面同时保留并内联 component-builder.css。移除一个或两个 CSS 请求，保留无脚本样式。
- 为四张建设类首图新增 480×360 WebP，保留 800/1200 像素版本。图片和预加载的 srcset/sizes 完全一致。Crown Molding 在 390px、DPR 1 上的首图从 49,300 降到 25,538 字节；DPR 2/3 继续使用大图。没有修改图片内容、裁切或布局。
- 首页和 Blog 的 JSON-LD 移到 main 后，对象内容与顺序保留，让可见标题和样式更早到达解析器。
- 新增 _routes.json，静态 assets、favicon、manifest 和 robots/sitemap/feed 文件绕过全局 Functions middleware。HTML 继续运行 middleware，保留 www 页面跳转和无效搜索模板的 410；API 和 CutList 跳转继续走原处理器。这里只修复不必要的资源调用范围，没有证据证明它就是截图差样本的主要原因，也没有改变生产 Cache Rules。

Cloudflare 官方说明 [_routes.json 控制 Functions 调用范围](https://developers.cloudflare.com/pages/functions/routing/)，且 [_redirects 不适用于由 Functions 处理的响应](https://developers.cloudflare.com/pages/configuration/redirects/)。因此本轮保留 HTML 的现有 middleware，只排除静态资源。配置的实际边缘效果需发布后核对。

完整内联增加 HTML 大小并减少跨页面独立 CSS 缓存的收益。本轮针对冷缓存首屏；首图减量及总传输中位数的变化如下。

## 最终实测

本地 gzip 预览，独立 headless Chrome，英语，390×844、DPR 1、冷缓存、4× CPU、150 ms 配置网络延迟、200 KB/s 下载，每条路径三轮中位数。本地导航 TTFB 约 2–6 ms，不能模拟生产的源站/地区响应延迟。基线首页首轮存在 favicon 传输异常，原始记录保留，采用三轮中位数。

| 路径 | LCP 前 → 后（ms） | 总传输前 → 后（字节） |
| --- | ---: | ---: |
| `/` | 716 → 324 | 49428 → 42704 |
| `/crown-molding-angle-calculator/` | 800 → 684 | 91558 → 67589 |
| `/blog/` | 328 → 268 | 65712 → 65754 |
| `/learn/sheet-good-edge-quality-acceptance/` | 268 → 272 | 45355 → 45355 |
| `/wood/eastern-red-cedar/` | 256 → 260 | 22206 → 22206 |
| `/compare/drawer-slides-side-mount-vs-undermount/` | 628 → 620 | 67075 → 67075 |
| `/plywood-cut-calculator/` | 288 → 292 | 49950 → 49950 |

首页 LCP 改善约 55%，Crown Molding 约 15%，Blog 约 18%。其余页面为未改动对照，几毫秒波动不作为优化收益；Plywood 个别轮次出现约 670 ms 的绘制延迟，中位数接近原值，不能宣称其尾部延迟已消失。最终所有测量 CLS 为 0，无横向溢出；首页/Blog 仍记录到少量 50–60 ms 长任务，本轮没有测得真实 INP，也没有消除所有长任务。

## 验证

- 完整 npm run build 通过；新增图片后执行建设类生成和 apply:nav-cta，最终 npm run check、git diff --check 通过。共验证 2,512 个 HTML、2,412 个 sitemap URL。
- 6 路径 × 360/390/430/1440px，共 24 项布局/菜单检查；与修改前比较主要正文、表单、导航和菜单的实际计算样式，一致。手机和桌面截图已查看。
- 真实 Crown 输入更新、首页演示预设、Blog 全库搜索、中文语言切换、六个页面的无脚本标题样式通过，无浏览器脚本异常。
- 三类首图 × DPR 1/2/3，共 9 项请求检查，实际选用 480/800/1200 图且每次只请求一张首图；无重复 preload。
- 25 个修改页面的 main 内容完全保留，仅图片增加 480w 候选；全部 JSON-LD 对象保留。
- 路由守卫验证静态资源排除、当前所有 API/go 端点及尾斜杠调用、www 页面跳转的查询参数保留、搜索模板 410 和正常 HTML 回退。
- 最终重复 apply:nav-cta 后，3,681 个 HTML/CSS/JS/JSON 文件字节不变。

原始数据：[cwv-loading-performance-2026-10-12.json](cwv-loading-performance-2026-10-12.json)。

复测：

```sh
WCT_PREVIEW_GZIP=1 node scripts/dev-server.mjs --port 4196
# 独立 Chrome profile，remote-debugging-port=9357
node scripts/audit-site-performance.mjs --origin=http://127.0.0.1:4196 --cdp-port=9357 --routes=/,/crown-molding-angle-calculator/,/blog/,/learn/sheet-good-edge-quality-acceptance/,/wood/eastern-red-cedar/,/compare/drawer-slides-side-mount-vs-undermount/,/plywood-cut-calculator/ --runs=3 --output=/tmp/wct-lcp-final.json
WCT_PERF_ORIGIN=http://127.0.0.1:4196 WCT_CDP_PORT=9357 npm run test:lcp-entry-browser
```

本轮没有部署。发布后核对首页/Construction 的内联样式、首图选用及实际 Functions 调用范围，然后按相同路径、设备、地区、浏览器、时间窗口和足够的 LCP 样本数比较 P75/P90。Wood、Learn、Plywood 剩余差样本需要具体 LCP 元素和分组数据；不能用上述本地改善替代用户端验证。
