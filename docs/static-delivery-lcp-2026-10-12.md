# LCP 静态分发修复，2026-10-12

**状态更新（2026-10-13）：用户已明确授权部署，WWW 301 规则已激活，提交 `fe421a4e3` 的 Pages 生产部署已确认成功。** 发布前自动审批曾因缺少具体生产授权而拒绝，后续授权已解除该阻碍。本文的性能数据保留为发布前历史证据；线上验证及效果边界见 [生产复测报告](static-delivery-production-2026-10-13.md)。

## 当前证据

从现有 Chrome 的 Cloudflare Web Analytics 读取与截图一致的过去 24 小时窗口（GMT+8）：好 44%、需改进 27%、差 29%；LCP P50 2,660 ms、P75 4,900 ms、P90 10,916 ms、P99 21,264 ms。5,983 ms 是页面加载时间，不是 LCP。104 次访问和 109 次浏览也不能替代 LCP 样本数。

调试视图显示慢元素不只包含文字：`tools-measurement-800.webp` 的分组 P75 为 10,916 ms（2 条），`wood-02-cabinet-hardware.webp` 为 9,684 ms（2 条），展开后对应 `/learn/material-substitution-approval-workflow/`。其余可见首图分组包含 edge-banding（3,340 ms / 2 条）、tools-cabinet-800（6,376 ms / 1 条）、closet-planning（6,908 ms / 1 条）。这些分组样本很少，不能代表稳定的页面分位数。实际调试首图与本地桌面 LCP 相符；移动端往往是 `p.lead`，只测手机会漏掉桌面图片。

线上只读 GET 确认 Paulownia 和 Learn 已有此前生成的内联样式，仍返回 `CF-Cache-Status: DYNAMIC`。本客户端经 SEA 节点：Paulownia 单次首字节 6.81 秒，总请求 11.99 秒；Learn 单次首字节 2.74 秒。首页和一个脚本后续请求出现传输超时，未计为有效性能结果。不能据此把所有差样本归因于 Functions，也不能排除本客户端网络、地区差异或 Cloudflare 配置影响。

仓库确定存在的结构问题是全局 middleware + `include: ["/*"]`：每个静态 HTML 都进入 Functions，只有少数静态资源排除。middleware 实际只需要做 WWW 跳转和首页无效搜索模板的 410。此前移动端首屏优化没有移除这条公共请求链路。

## 修改与兼容性

- `_routes.json` 只包括 `/`、`/api/*`、`/go/*`。其余所有 2,512 个 HTML 路径和资源交给 Pages 静态分发。首页保留 410 条件；API 和下载跳转保留原处理器，含尾斜杠路径。
- 域名跳转移到 Cloudflare zone Redirect Rule。官方 `_redirects` 不支持域名级 source；Wrangler 4.149.0 也明确拒绝原来的 `https://www.woodcuttool.com/*`。移除这个无效规则，并把精确旧路径规则排在通配符之前；有效规则仍为 61 条。
- [config/cloudflare-canonical-redirect.json](../config/cloudflare-canonical-redirect.json) 保存待发布的规则内容：`http.host eq "www.woodcuttool.com"`，301 到 `concat("https://woodcuttool.com", http.request.uri.path)`，保留查询参数。现有动态路由的 middleware WWW 跳转继续作为防线。
- 性能脚本新增可配置桌面宽高、实际 LCP 图片 URL、元素面积、导航阶段、HTML 下载耗时，以及 TTFB / 资源开始等待 / 资源下载 / 元素绘制四阶段。文字没有独立 LCP 图片资源；其绘制阶段包含 HTML 下载和排版，不能被误称为纯 CPU 时间。
- 未修改页面正文、图像、计算器、SEO 数据、语言覆盖或缓存 TTL。没有添加 Cache Everything；Pages 原生缓存负责部署后的资产更新，避免自定义 HTML 缓存造成旧版本残留。

依据：[Functions 路由](https://developers.cloudflare.com/pages/functions/routing/)、[Pages Redirects](https://developers.cloudflare.com/pages/configuration/redirects/)、[Pages 缓存建议](https://developers.cloudflare.com/pages/configuration/serving-pages/)、[LCP 四阶段定义](https://web.dev/articles/optimize-lcp)。

## 验证结果

完整 `npm run build`、`npm run check` 和 `git diff --check` 通过。构建产生的、与这次路由修改无关的 Construction sitemap 日期/hash 更新已恢复，不纳入性能修复。

路由守卫穷举全部 HTML；静态资源、API/go 尾斜杠、动态 WWW 跳转查询参数、无效搜索模板 410、有效首页和 404 文件均有检查。官方 Wrangler 的临时副本只给 Functions 响应增加 `x-wct-test-function` 标记；21 个 HTTP 请求验证静态 HTML/资源及 304 均没有标记，首页/API/go 有标记，旧路径/index.html 重定向和查询参数保留，缺失页面返回 404。localhost 不会保留生产 Host，因此仅在临时测试 middleware 中用测试头重建 Host 来验证 410；这个适配器不进入仓库或生产。边缘 WWW 规则尚未发布，不能声称已完成线上 WWW 迁移验证。

本地 gzip 预览、独立 Chrome、冷缓存、4× CPU、配置 150 ms 延迟和 200 KB/s 下载，每页三轮中位数。390×844 / DPR 1：15 条截图路径中位数范围 260–704 ms；1440×900 / DPR 1 的首图页面如下。截图的截断标签按当前路径匹配，Material、Sheet Good、Cabinet Back 的路径有控制台记录支持；Edge Banding 对应路径仍按仓库名称匹配。

| 路径 | 移动 LCP（ms） | 桌面 LCP（ms） |
| --- | ---: | ---: |
| `/crown-molding-angle-calculator/` | 704 | 748 |
| `/learn/material-substitution-approval-workflow/` | 268 | 916 |
| `/learn/sheet-good-edge-quality-acceptance/` | 288 | 752 |
| `/learn/cabinet-back-construction-dimension-guide/` | 284 | 912 |

所有 57 轮 CLS 为 0，无横向溢出。部分轮次有 51–128 ms 长任务；没有测得真实 INP。初次首页 favicon 传输存在异常，原始记录保留，使用三轮中位数。本地 TTFB 约 2–24 ms，不能模拟或证明生产 TTFB 改善。这些是前端不回归证据；**本轮没有声称本地 LCP 因路由修改而改善**。

`test:lcp-entry-browser` 通过 24 项 360/390/430/1440px 菜单及布局检查、9 项 DPR 首图/preload 检查、真实计算器编辑、首页预设、Blog 搜索、中文切换和无脚本样式。已查看手机和桌面截图。

原始数据：[static-delivery-lcp-2026-10-12.json](static-delivery-lcp-2026-10-12.json)。

## 发布与回滚

1. 经用户明确授权，发布上述 zone WWW Redirect Rule。先检查 `https://www.woodcuttool.com/wood/oak/?source=test`、首页、assets、API/go；应 301 到同路径的 HTTPS 主域名，保留查询参数。HTTP WWW 也应匹配相同主机条件。
2. 规则确已生效后，再发布仓库改动。不要用新的 ruleset 替换整个既有 ruleset；只增加此精确主机规则。
3. 核对生产静态页面的响应状态、ETag、条件请求、实际压缩及缓存表现；检查 Cloudflare Functions 调用只覆盖首页/API/go。根首页仍调用 middleware，因此不能期待它也完全绕过 Functions。
4. 重测上表桌面首图和 Wood/Learn 手机页面，记录实际 TTFB 与四阶段；再用新的等长时间窗口按页面、设备、地区与样本数检查 LCP P75/P90。旧 24 小时窗口会混入发布前数据；没有足够新样本时不要宣布解决。
5. 若路由或内容出现回归，将 `_routes.json` 恢复为原来的 `include: ["/*"]` 和资源排除项，再部署。新 WWW 规则与原 middleware 同向，可以保留；必要时在控制台关闭规则，动态路由仍有原跳转。性能脚本与测试不会改变页面行为。

若发布后静态 HTML 仍为 DYNAMIC，或 TTFB/图像响应仍数秒，不要继续靠 CSS 优化猜测；检查真实地区分布、现有 Cache/Worker/Transform 规则、响应中的挑战脚本与具体失败请求。当前没有调整安全防护，也没有删除或关闭既有规则。

复测：

```sh
WCT_PREVIEW_GZIP=1 node scripts/dev-server.mjs --port 4198
# 独立 Chrome：remote-debugging-port=9359
node scripts/audit-site-performance.mjs --origin=http://127.0.0.1:4198 --cdp-port=9359 --width=1440 --height=900 --routes=/crown-molding-angle-calculator/,/learn/material-substitution-approval-workflow/,/learn/sheet-good-edge-quality-acceptance/,/learn/cabinet-back-construction-dimension-guide/ --runs=3 --output=/tmp/wct-desktop-lcp.json
WCT_PERF_ORIGIN=http://127.0.0.1:4198 WCT_CDP_PORT=9359 npm run test:lcp-entry-browser
```

官方 Pages 调用验证：运行 `node scripts/test-pages-delivery.mjs --prepare` 创建独立临时副本；进入输出的目录，运行 `npx --yes wrangler@4.149.0 pages dev . --port 4201 --compatibility-date=2026-06-19`。然后在仓库运行 `node scripts/test-pages-delivery.mjs`。测试头与主机适配器只写入临时目录；不要部署这个临时副本。
