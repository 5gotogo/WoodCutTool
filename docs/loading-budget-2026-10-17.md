# LCP 与 1 秒加载预算，2026-10-17

状态：本地修复与验证完成，尚未部署。最终受控预算通过。这份报告区分 LCP、浏览器 loadEventEnd 和真实用户分位数；本地达标不等于线上全球访问已经低于 1 秒。

## 修改与原因

- 全站补齐完整 scoped CSS 内联，包含 Checklists、Apps、Blog 文章、通用内容、普通计算器、模板和工作流自有样式。保留各路由 CSS 的原始顺序和全部响应式/交互状态，减少阻塞首屏的额外 CSS 请求。代价是 HTML 增大，跨页访问不能独立复用内联 CSS 缓存。
- 导航及普通计算器 bootstrap 在内联 CSS 前预加载，保留原有 defer 执行顺序；HTML 解析较慢时不必再等待脚本请求。脚本请求仍只有一次。
- 在 HTML 中预加载 894 字节导航图标，消除“先执行导航脚本，再请求图标”的瀑布。仅在包含非懒加载远程图片的页面添加最多两个图片域名的 preconnect。
- Blog/Learn 的 12 张原有木工照片增加 480/960 像素 AVIF，保留原有 WebP、内容、尺寸及 alt。对应文件节省约 47%–65%；typed preload 与 picture 候选一致。
- Templates 四张原有照片增加 480/960/1448 像素 AVIF，保留 WebP/PNG。桌面 812 像素宽的首图从过大的 1448w WebP 改选 960w AVIF，93–181 KB → 19–35 KB，实际请求节省约 79%–81%。
- CutList 首屏截图增加 598 像素 AVIF，29,508 → 21,823 字节，约节省 26%。预加载首屏截图；下方画廊使用原生 lazy/low，重复的同一张截图复用相同 AVIF。
- 页面 runtime 选择剔除内联 CSS，修复普通模板和两个工具页面在再次生成时误加载 directory-page.js 的问题。App CSS 编译也剔除已有内联样式，避免旧选择器被保留。
- sitemap 签名忽略新增图片编码包装和 preconnect，保留正文、图片 src/alt、链接和 SEO 元数据的变更检测。sitemap/lastmod 没有更新。
- 性能脚本验证实际导航 HTTP 状态、等待有效 loadEventEnd，记录 LCP 四阶段，并新增每轮严格的 --max-lcp / --max-load 预算；失败原始样本仍写入 JSON。

源头：[apply-nav-cta](../scripts/apply-nav-cta.mjs)、[CSS 编译](../scripts/build-site-styles.mjs)、[文章图片](../scripts/woodworking-images.mjs)、[CutList 生成器](../scripts/build-cutlist-landing.mjs)、[性能脚本](../scripts/audit-site-performance.mjs)。原理依据：[LCP 四阶段与阻塞样式](https://web.dev/articles/optimize-lcp)、[Pages 原生分发与缓存](https://developers.cloudflare.com/pages/configuration/serving-pages/)。

## 同条件前后对比

本地 gzip、独立 Chrome、英语、1440×900、DPR 1、冷浏览器缓存、4× CPU、配置 150 ms 网络延迟和 200 KB/s 下载。每条路径三轮中位数，未添加 HTML 响应延迟。本地不含 DNS/TLS；TTFB 通常为几毫秒。Crown 本轮沿用既有首图编码，LCP 中位数从 604 ms 变为 664 ms，未获得改善；完整加载缩短，且最终每轮仍通过 1 秒预算。

| 路径 | LCP 前 → 后，ms | load 前 → 后，ms | 总传输前 → 后，B |
| --- | ---: | ---: | ---: |
| `/checklists/` | 512 → 260 | 658 → 476 | 40269 → 40182 |
| `/privacy-policy/` | 508 → 284 | 667 → 494 | 34370 → 34261 |
| `/apps/cutlist/` | 876 → 564 | 828 → 554 | 104367 → 59864 |
| `/learn/entryway-shoe-cabinet-planning-guide/` | 772 → 588 | 918 → 654 | 130557 → 76099 |
| `/learn/material-substitution-approval-workflow/` | 908 → 640 | 891 → 630 | 126125 → 72109 |
| `/crown-molding-angle-calculator/` | 604 → 664 | 744 → 648 | 60762 → 60840 |
| `/blog/record-actual-yield-after-project/` | 612 → 280 | 774 → 566 | 93300 → 60488 |

## 1 秒预算

在同样的 CPU/带宽配置下，为每次 HTML 请求额外加入固定 250 ms 服务器响应延迟；手机 390×844、桌面 1440×900，DPR 1。它是受控的响应延迟，不是生产 TLS 或地理网络模拟。每页、每端三轮，要求每一轮 LCP 和 load 都低于 1000 ms。

- 手机 75 次：LCP 最大 596 ms，load 最大 927 ms。
- 桌面 75 次：LCP 最大 968 ms，load 最大 986 ms。
- 最终超标页面：手机 0，桌面 0。最大 CLS 0.01989274691358025，横向溢出 0 px。

Bookshelf 模板在相同延迟条件下，桌面 LCP 从 1048 ms 降到 696 ms，load 从 1031 ms 降到 703 ms。

表内为三轮中位数，单元格为 LCP / load，单位 ms；单次最大值和全部原始样本在 JSON 中。

| 路径 | 手机 LCP / load | 桌面 LCP / load |
| --- | ---: | ---: |
| `/` | 408 / 606 | 424 / 612 |
| `/checklists/` | 352 / 578 | 352 / 579 |
| `/wood-database/` | 384 / 593 | 372 / 593 |
| `/terms-of-service/` | 364 / 590 | 368 / 594 |
| `/privacy-policy/` | 364 / 590 | 368 / 593 |
| `/legal/DuctLab/privacy/` | 344 / 588 | 348 / 595 |
| `/plywood-cut-calculator/` | 376 / 768 | 372 / 768 |
| `/cabinet-cut-list-calculator/` | 548 / 715 | 672 / 736 |
| `/apps/cutlist/` | 384 / 650 | 668 / 654 |
| `/wood/aspen/` | 344 / 478 | 404 / 480 |
| `/legal/cutlist/privacy/` | 344 / 587 | 352 / 592 |
| `/cabinet-studio/` | 376 / 700 | 376 / 707 |
| `/compare/` | 564 / 742 | 608 / 852 |
| `/learn/entryway-shoe-cabinet-planning-guide/` | 368 / 657 | 684 / 755 |
| `/glossary/` | 376 / 592 | 384 / 594 |
| `/wood/paulownia/` | 344 / 478 | 412 / 481 |
| `/wood/ash/` | 348 / 481 | 408 / 484 |
| `/crown-molding-angle-calculator/` | 592 / 715 | 756 / 739 |
| `/board-foot-calculator/` | 400 / 920 | 400 / 920 |
| `/templates/bookshelf-cut-list/` | 356 / 700 | 696 / 703 |
| `/projects/base-cabinet/` | 428 / 677 | 688 / 677 |
| `/blog/record-actual-yield-after-project/` | 572 / 637 | 388 / 669 |
| `/templates/kitchen-cabinet-cut-list/` | 360 / 592 | 356 / 593 |
| `/templates/workbench-cut-list/` | 360 / 595 | 368 / 591 |
| `/templates/garage-shelving-cut-list/` | 356 / 699 | 360 / 699 |

全部较早超标样本保留在 JSON 的 intermediateOutliers 中：一批与生成检查重叠的 Wood Database 为 load 1,038 ms / TTFB 663 ms；后续隔离测试中，Checklists 一次 load 1,012 ms，导航脚本直到 660 ms 才开始请求；Bookshelf 模板三轮 LCP 为 1,040–1,048 ms，首图选中 93 KB WebP。对应修复分别是提前发现关键脚本和缩小模板首图。最终构建/检查结束后完整重跑，不按结果删除最终样本，也不把早期异常一概归因于网络。

## 验证与边界

- 完整 npm run build 通过；后续首图改动执行对应生成器与共享后处理。最终 npm run check、git diff --check 通过。
- 最终重复 apply:nav-cta，3707 个 HTML/CSS/JS/JSON 文件中 0 个文件字节发生变化。
- 32 项四视口修改前后计算样式一致、24 项 AVIF/WebP/DPR 首图单请求检查通过。
- 24 项响应式菜单/布局、9 项 Construction 首图检查通过；真实计算器编辑、首页预设、Blog 搜索、中文切换、无脚本样式通过，浏览器运行异常为空。
- 2502 个修改 HTML 的有效正文/链接/图片内容一致，全部 JSON-LD 数据保留。已查看桌面截图和图片压缩前后对照。CSS/图片生成仍由源头脚本维护。

截图的两周窗口为 LCP P75 2,676 ms；加载面板选中 P75 后摘要为 5,079 ms，侧栏 1,325 ms 是另一聚合显示，不能混用。页面/地区行旁的访问计数也不能当成 LCP 样本数。原打开窗口显示美国 1,131 ms、新加坡 1,210 ms，部分其他地区更慢。

本次只读线上浏览器基线的五个页面 load 约 0.97–1.39 秒，CutList LCP 1.12 秒；单次冷 curl 的 DNS 426 ms、连接完成 598 ms、TLS 完成 769 ms、首字节 1,122 ms。阶段时间、节点和连接复用会变化，不能把这些单次值当作真实用户分位数。Cloudflare Cache Rules 新页显示 0 条生效规则；没有更改缓存、安全或路由设置。

本轮尚未发布，真实用户的一秒目标仍待生产验证。发布后需要核对压缩/预加载/首图单次请求，再按同一时间窗、路径、设备、地区及足够样本比较 LCP 和 load 的 P75/P90。网络握手已经超过 1 秒的访问，无法仅靠页面代码保证总耗时低于 1 秒。本次未测量真实 INP。

原始数据：[loading-budget-2026-10-17.json](loading-budget-2026-10-17.json)。

## 复测

```sh
WCT_PREVIEW_GZIP=1 WCT_PREVIEW_HTML_DELAY_MS=250 node scripts/dev-server.mjs --port 4197
# 独立 Chrome: --headless=new --remote-debugging-port=9357 --user-data-dir=/tmp/wct-loading-profile
node scripts/audit-site-performance.mjs --origin=http://127.0.0.1:4197 --cdp-port=9357 --routes=/,/checklists/,/apps/cutlist/,/learn/entryway-shoe-cabinet-planning-guide/,/board-foot-calculator/,/projects/base-cabinet/ --runs=3 --max-lcp=1000 --max-load=1000 --output=/tmp/wct-loading-budget.json
# 桌面复测增加 --width=1440 --height=900
WCT_PERF_ORIGIN=http://127.0.0.1:4197 WCT_CDP_PORT=9357 npm run test:loading-browser
```
