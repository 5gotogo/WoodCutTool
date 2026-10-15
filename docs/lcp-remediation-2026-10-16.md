# LCP 首图修复与线上等待诊断，2026-10-16

本轮修复了 23 个 Construction 计算器和 76 个 Compare 页面的图片传输瓶颈。代码与本地验证已完成，尚未部署。**线上 TTFB 尾部问题仍未解决，不能把本轮合成测试当作真实用户 LCP 已达标的证明。**

## 当前真实用户证据

只读查看用户已登录的 Cloudflare Web Analytics，过去 24 小时、GMT+8、排除自动程序，与截图一致：LCP 良好 61%、需改进 24%、差 16%；P50/P75/P90/P99 分别为 1,048 / 3,148 / 6,212 / 21,340 ms。141 次访问、145 次浏览不是 LCP 样本数；1,293 ms 是页面加载时间。

Sub-Parts 的 P75 视图显示 TTFB 2,497 ms（90%）、资源开始等待 0 ms、资源下载 0 ms、绘制延迟 271 ms（10%）。各阶段聚合统计不能直接相加作为整体 LCP P75。

展开图片调试样本后，确认截图中截断的 Track Saw 路径是 `/compare/track-saw-vs-panel-saw/`：

| 页面 | 计数 | LCP | TTFB | 资源开始等待 | 资源下载 | 绘制延迟 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Cabinet Cut List | 1 | 6,212 ms | 1,393 ms | 11 ms | 4,779 ms | 31 ms |
| Track Saw vs Panel Saw | 1 | 3,460 ms | 3,331 ms | 5 ms | 78 ms | 47 ms |

前者图片下载慢，后者主要在等待 HTML。国家分组可见美国 17 个良好、2 个需改进样本；其他多个差分组只有一个样本。不能仅凭这些小分组把原因归到某一个地区、设备或页面实现。

## 修改

- 10 张现有首图各生成 480、800、原宽度三个 AVIF 版本；补齐 6 张缺失的 480px WebP。保留原图片内容、构图、alt、尺寸和所有既有 WebP 文件。
- 两类页面通过共享 `scripts/lcp-images.mjs` 输出 AVIF `<picture>`、WebP 回退和带 `type="image/avif"` 的响应式 preload。预加载与 source 的候选、sizes 完全一致；不支持 AVIF 的浏览器可使用 WebP。
- Cabinet 的 800px 图片从 33,556 降至 13,061 字节（减少 61%），Compare 锯床图从 34,712 降至 15,079 字节（减少 57%）。Compare 手机 DPR 1 从 800px WebP 改用 480px AVIF，34,712 → 8,654 字节。
- 增加预览服务 AVIF MIME 类型、图片字节预算、候选存在性和至少 20% 减量守卫。生成资产随仓库保存；正常 Pages 构建不需要安装图片编码器。重新编码可运行 `python3 scripts/build-lcp-images.py`，需要带 AVIF 支持的 Pillow。
- 99 页正文文本、JSON-LD 对象完全保留。只迁移图片技术标记的 sitemap 内容 hash，沿用原编辑日期；sitemap XML 和 URL 清单没有变化。Wood、Plywood、Wood Database、Shelf Pin 页面未修改。

## 同条件性能结果

独立 headless Chrome、本地 gzip 预览、英语、冷缓存、4× CPU、配置 150 ms 延迟及 200 KB/s 下载、DPR 1；桌面 1440×900，手机 390×844。每页三轮取中位数。本地 TTFB 不能模拟线上服务器或地区网络等待。

| 页面 / 设备 | LCP 前 → 后 | 总传输前 → 后 |
| --- | ---: | ---: |
| Cabinet Cut List / 桌面 | 720 → 488 ms | 77,619 → 57,181 B |
| Track Saw vs Panel Saw / 桌面 | 616 → 516 ms | 68,371 → 48,816 B |
| Track Saw vs Circular Saw / 手机 | 624 → 424 ms | 68,466 → 42,484 B |
| Track Saw vs Circular Saw / 桌面，文字 LCP | 264 → 264 ms | 68,466 → 48,909 B |
| Lignum Vitae / 桌面，对照 | 324 → 324 ms | 22,237 → 22,237 B |

Cabinet 桌面 LCP 减少约 32%，Panel Saw 桌面约 16%，Circular Saw 手机约 32%。其他未修改的手机对照页中位数约 264–316 ms；几毫秒到十余毫秒的波动不作为优化收益。最终 45 轮本地测量均 CLS 0、横向溢出 0；部分轮次仍有 50–85 ms 长任务，未测得真实 INP。

## 线上 TTFB 的边界与后续验证

修改前访问真实域名、同样降速条件、桌面三轮的 LCP 中位数：Cabinet 1,016 ms、Panel Saw 944 ms、Lignum Vitae 500 ms、Ash 448 ms。这一客户端没有复现 RUM 的数秒 TTFB，不能用它排除其他用户的慢请求。

单次 curl：Ash 自定义域名 HTTP 200、gzip、TTFB 0.988 s、`CF-Cache-Status: DYNAMIC`、没有 ETag；Pages 原生域名 TTFB 1.097 s。两次请求不构成受控对照，不能据此认定自定义域名一定慢。只读控制台确认没有 Cache Rules、开发模式关闭、没有连接 zone Workers。

Pages 有自己的静态资产缓存。自定义域名的 DYNAMIC 不能独自证明 Pages 内部缓存失效。Cloudflare [Pages 分发文档](https://developers.cloudflare.com/pages/configuration/serving-pages/) 提醒自定义缓存可能造成发布后旧内容、重定向及 Functions 问题；因此没有在缺少因果验证时新增全站 HTML 缓存，也没有修改安全防护、DNS、重定向或生产设置。

发布本轮代码后，先核对 AVIF MIME、实际选图与单请求，再以足够的新样本按相同路径、国家、设备比较 LCP 和 TTFB P75/P90。若 Wood 的文字样本和 Panel Saw 仍由 TTFB 主导，需要对这些具体慢请求继续做 Cloudflare Trace/网络时序诊断，区分 DNS/TLS、边缘等待、连接和地区链路；图片优化无法消除 HTML 返回前的等待。阶段定义依据 [web.dev LCP 优化说明](https://web.dev/articles/optimize-lcp)。

## 验证

- 完整 `npm run build`、`npm run check`、`git diff --check` 通过；2,526 个 HTML 页面。
- 8 条图片路径 × DPR 1/2/3 × AVIF/WebP，共 48 项图片选择、回退、单请求和布局检查；实际请求与选中资源一致。
- WebP 回退测试使用 Chrome 禁用 AVIF 解码，并在测试响应中移除不受支持的 AVIF preload，模拟旧浏览器跳过 typed preload 的行为；不是实际旧浏览器测试。原始页面的 source/preload 一致性由 AVIF 测试与静态守卫检查。
- 6 路径 × 360/390/430/1440px，共 24 项布局、菜单及修改前后实际计算样式对比；另有 9 项 Construction DPR 预加载检查。
- 真实计算器编辑、首页预设、Blog 搜索、中文切换、无脚本样式正常；测试未捕获运行时异常。
- 已查看 Cabinet 桌面及 Panel Saw 手机截图，以及原 WebP/AVIF 图片对照。
- 重复 `apply:nav-cta` 后 3,736 个 HTML/CSS/JS/JSON/AVIF 文件字节不变。

完整测量与验证范围见 [原始记录](lcp-remediation-2026-10-16.json)。

```sh
WCT_PREVIEW_GZIP=1 node scripts/dev-server.mjs --port 4198
# 使用独立 Chrome 配置，remote-debugging-port=9359
WCT_PERF_ORIGIN=http://127.0.0.1:4198 WCT_CDP_PORT=9359 npm run test:lcp-images-browser
WCT_PERF_ORIGIN=http://127.0.0.1:4198 WCT_CDP_PORT=9359 npm run test:lcp-entry-browser
node scripts/audit-site-performance.mjs --origin=http://127.0.0.1:4198 --cdp-port=9359 --width=1440 --height=900 --routes=/cabinet-cut-list-calculator/,/compare/track-saw-vs-panel-saw/ --runs=3 --output=/tmp/wct-lcp-desktop.json
```
