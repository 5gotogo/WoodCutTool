# Blog / Compare LCP 与卡顿修复记录 — 2026-09-07

## 结论

Cloudflare 截图中的过去 24 小时真实用户数据为：LCP P50 700 ms、P75 3,208 ms、P90 4,264 ms、P99 19,552 ms；72% 为“好”、16%“需要改进”、12%“差”。最慢样本指向文章内的木工图片，另一个慢样本指向 Compare 首图。

本轮修复了生成链路中的三项问题：Compare 首图没有预加载、部分 Compare 首图错误地使用懒加载、静态文章/Compare 页面仍在首屏加载完整计算器运行时。结果是 Blog / Compare 首屏 CSS 与 JS 的 gzip 体积由 127,415 字节降到 34,299 字节，减少 73.1%。

这是本地实验结果，不能替代部署后的 Cloudflare RUM。尤其截图样本量较小，P99 的单次异常可能同时包含地区网络、后台标签页或 CDN 长尾。

## 改动

- 新增由 `assets/styles.css` 生成的 `assets/editorial.css`，覆盖 Blog 与 Compare 页面，并保留共享导航、语言切换、Blog 目录筛选和动态状态所需选择器。
- 1,067 个静态 Blog 文章页与所有 Compare 页使用 `content-page.js`；默认英文不再下载和初始化完整 `app.js`，切换或恢复非英文时仍按需加载。
- 75 个可能成为 LCP 的 Compare 首图改为 `loading="eager" fetchpriority="high"`，并在文档头部预加载同一 URL。
- 821 个木工文章首图继续预加载。正文辅助图保持懒加载，但不再强制 `fetchpriority="low"`，使浏览器能在高视口或图片接近视口时提升优先级。
- 为复用率很高的 `/assets/images/*` 增加一天浏览器缓存和七天 stale-while-revalidate。
- `apply:nav-cta` 现在自动重建 App 与 Editorial 两份作用域样式；性能门禁检查生成一致性、90 KB 上限、静态运行时、图片预加载和优先级。

## 冷缓存限速结果

测试环境：Chrome headless，390 × 844 CSS 像素，4 倍 CPU 减速，150 ms 延迟，200,000 B/s 下载，禁用缓存，本地 gzip 预览，每页三轮。

| 路由 | LCP 三轮 | 中位数 | CLS |
| --- | --- | ---: | ---: |
| `/blog/appliance-garage-cabinet-cut-list/` | 1,120 / 1,112 / 1,120 ms | 1,120 ms | 0 |
| `/compare/best-plywood-tools/` | 840 / 716 / 712 ms | 716 ms | 0 |
| `/compare/cutlist-vs-sketchup/` | 836 / 848 / 832 ms | 836 ms | 0 |

浏览器实际传输的共享 CSS/JS 正文为：Editorial CSS 17,330 字节、content-page 665 字节、site-chrome 13,590 字节、conversion 2,714 字节。三条路由在 360/390/430/1440 px 均无横向溢出，首图加载完成，默认英文没有请求 `app.js`；切换简体中文时只请求一次并完成初始化。

## 验证与上线后复核

- `npm run check` 通过：2,470 个 HTML、2,368 个 Sitemap URL，以及生成器、SEO、架构、转化和 Core Web Vitals 门禁。
- `git diff --check` 通过。
- 部署后按部署时间切分 Cloudflare RUM，至少等待足够样本，再比较 Blog / Compare 的 P75、P90、P99，并按设备、地区和 LCP 元素分组。重点确认 `article-wood-photo-inline` 不再产生十几秒的长尾，同时确认 Compare 首图预加载命中。
