# 截图页面首屏加载修复 — 2026-10-11

截图的 24 小时窗口为 LCP 良好 42%、需要改进 25%、差 33%；INP 和 CLS 为绿色。49 次访问和 52 次浏览不能直接视为 LCP 样本数。4,605 毫秒是页面加载时间，也不是 LCP。部分 URL 标签被截断：Drawer Slides 暂按 /compare/drawer-slides-side-mount-vs-undermount/、Track Saw 暂按 /compare/track-saw-vs-circular-saw/ 匹配。没有取得底层分析导出，因此这两个匹配属于推断。

只读线上核对确认 Learn 文章仍请求 content.css，而 Paulownia 已有完整内联 Wood 样式和 wood-page.js。Wood、Wood Movement 的本地加载未复现截图中的严重延迟。单次线上请求无法确认用户所在地区的 TTFB，也不能给剩余差样本指定原因。本次没有部署。

## 修复

- 为全部 176 个 Learn 页面生成完整专用样式：54,950 → 39,942 字节。全部内联，去掉阻塞正文绘制的外部 CSS 请求；页面禁用脚本后仍有完整正文样式。
- 语言引导和转化脚本使用低请求优先级；目录控制器只在实际目录页加载。保留现有语言覆盖、导航、菜单、图片资源与响应式预加载策略。
- 修复重复生成时把内联 CSS 的目录类名误当成页面内容的问题，避免普通文章新增目录脚本。加入样式完整性、字节预算、资源选择、缓存和重复生成检查。
- 176 个页面的正文、链接与结构化数据完全保留（仅清理空白行）。专用样式不再进入通用内容页面集合，content.css 同时缩小到 51,151 字节；其他页面内容和运行时保持原样。

完整内联样式会增加 HTML 大小，并减少跨页面独立 CSS 缓存的收益。这里针对冷缓存首屏优化；实测 Learn 总传输仍减少约 3.2–3.4 KB，每页少一个阻塞 CSS 请求。

## 实测

独立 headless Chrome，本地 gzip 预览，英语，390×844、DPR 1、冷缓存、4 倍 CPU 降速、150 毫秒网络延迟、200 KB/s 下载。每条路径三轮，以下为中位数。Learn 使用修复重复生成之后的最终复测；其余路径使用完整构建后的三轮记录。基线首个 Material Substitution 请求有一次资源传输异常值，保留原记录并使用三轮中位数。

| 路径 | LCP 前 → 后（毫秒） | 总传输前 → 后（字节） |
| --- | ---: | ---: |
| `/learn/material-substitution-approval-workflow/` | 604 → 264 | 58,435 → 55,150 |
| `/learn/custom-wardrobe-planning-guide/` | 600 → 264 | 70,383 → 67,082 |
| `/learn/how-to-reduce-plywood-waste/` | 600 → 276 | 60,009 → 56,716 |
| `/learn/` | 548 → 300 | 53,576 → 50,338 |
| `/learn/topics/cabinet-planning/` | 536 → 260 | 39,770 → 36,329 |
| `/wood-movement/` | 268 → 268 | 41,774 → 41,774 |
| `/wood-movement/moisture-readings-and-service-range/` | 272 → 268 | 33,529 → 33,529 |
| `/wood/paulownia/` | 256 → 248 | 22,168 → 22,168 |
| `/wood/eastern-red-cedar/` | 256 → 260 | 22,206 → 22,206 |
| `/wood/brazilian-rosewood/` | 256 → 256 | 22,211 → 22,211 |
| `/wood/cocobolo/` | 244 → 256 | 22,197 → 22,197 |
| `/compare/drawer-slides-side-mount-vs-undermount/` | 612 → 612 | 67,075 → 67,075 |
| `/wood/cedar/` | 252 → 256 | 22,154 → 22,154 |
| `/wood/american-sycamore/` | 256 → 252 | 22,179 → 22,179 |
| `/wood/black-ash/` | 256 → 256 | 22,163 → 22,163 |
| `/plywood-cut-calculator/` | 280 → 276 | 49,950 → 49,950 |
| `/compare/track-saw-vs-circular-saw/` | 628 → 620 | 68,318 → 68,318 |

Learn 的 LCP 元素为 p.lead。三个截图文章改善约 54–56%；目录和主题页也移除了样式请求等待。其他路径为未改动对照，几毫秒波动属于测量噪声。所有最终测量 CLS 为 0，无横向溢出，未观察到超过 50 毫秒的任务。这些是本地实验室结果，不代表 Cloudflare 用户端的 P75/P90/P99，也没有测得真实 INP。

## 验证

- npm run build、最终 npm run check、git diff --check 通过。
- 6 条 Learn 路径 × 360/390/430/1440 像素，共 24 项布局/菜单检查；与优化前比较正文和菜单的实际计算样式，完全一致。
- 移动导航、菜单打开与 Escape 关闭、Learn 目录折叠/展开、无脚本正文样式、简体中文切换与原行为一致。
- 3 个文章 × DPR 1/2/3，共 9 项首图请求检查，没有重复请求不同尺寸首图。
- 手机和桌面截图已查看；浏览器未捕获脚本异常。
- 重复 apply:nav-cta 后，1,309 个 Learn/资源文件字节不变。

原始记录：[cwv-loading-performance-2026-10-11.json](cwv-loading-performance-2026-10-11.json)。

## 复测

```sh
WCT_PREVIEW_GZIP=1 node scripts/dev-server.mjs --port 4194
# 使用独立 Chrome profile，remote-debugging-port=9355。
node scripts/audit-site-performance.mjs --origin=http://127.0.0.1:4194 --cdp-port=9355 --routes=/learn/material-substitution-approval-workflow/,/learn/custom-wardrobe-planning-guide/,/learn/how-to-reduce-plywood-waste/,/learn/,/learn/topics/cabinet-planning/ --runs=3 --output=/tmp/wct-learn-perf.json
WCT_PERF_ORIGIN=http://127.0.0.1:4194 WCT_CDP_PORT=9355 npm run test:learn-lcp-browser
```

部署后确认 Learn 已内联专用样式，再用等长时间窗口、相同路径/设备/地区以及足够的样本数比较线上 LCP。Wood 和 Wood Movement 的剩余差样本需要查看具体 LCP 元素及这些分组；本次本地结果不能证明它们已经消失。
