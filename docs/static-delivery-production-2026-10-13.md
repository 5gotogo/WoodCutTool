# LCP 静态分发：生产验证，2026-10-13

WWW 301 规则已部署并处于活动状态。Pages 生产部署 `bcdb1c29-2fa5-4b04-b461-25d082843422` 对应提交 `fe421a4e3a44386d89f10faeab5092114509860d`，控制台显示 `success`，成功时间为 2026-10-13 00:00（GMT+8），生产分支为 `main`。核查期间该提交已被另一推送操作同步至远程并触发自动部署，本次没有重复发布代码。

## 线上交付与功能

Cloudflare 控制台部署详情的调用路由确认为：`include: ["/", "/api/*", "/go/*"]`、`exclude: []`。静态页面已不在 Functions 调用范围；根首页保留原有 middleware。独立部署域名的 Paulownia HTML 与当前仓库文件逐字节一致。

规则 ID：`e2f80adbfb9b45c0a4af833b38fba8a1`。匹配 `(http.host eq "www.woodcuttool.com")`，301 到 `concat("https://woodcuttool.com", http.request.uri.path)`，保留查询字符串。部署前规则概览未显示既有规则，旧页面规则显示 0 条；线上目标域名返回 200，无反向跳转。

19 项生产 HTTP 检查通过：

- Wood、Learn、计算器、法律页面、静态脚本、根首页返回 200。
- WWW 的首页、页面、assets、API、go 路径以及 HTTP WWW 请求返回 301，路径和查询参数原样保留。
- 旧工具路径和 `index.html` 返回 301，保留参数。
- 根首页无效 `q={search_term_string}` 返回 410、`noindex`；不存在页面返回 404。
- 下载跳转返回 302，目标 App Store 地址和 `ct=test` 正常。
- `/api/conversion-event` 两种尾斜杠形式用 POST + `DNT: 1` 返回 204。此请求不写入统计；它验证处理器与路由，不验证 D1 写入。

静态脚本 `/assets/wood-page.js` 返回 gzip、`CF-Cache-Status: HIT` 和 ETag；携带该 ETag 的条件请求返回 304、下载 0 字节。四个抽查静态 HTML 均为 gzip，但自定义域名仍返回 `DYNAMIC`，没有 ETag；响应中可见 Cloudflare email-decode 和 challenge-platform 注入代码。不能用这些响应头断言 Functions 仍被调用，也不能宣称 HTML 缓存已经命中。没有修改安全防护或新增 Cache Everything。

生产浏览器 QA 通过 24 项 360/390/430/1440px 布局、样式、菜单检查及 9 项 DPR 首图/preload 检查；真实计算器编辑、首页预设、Blog 搜索、中文切换及无脚本样式正常，运行时异常列表为空。已查看生产手机截图。

## 当前 LCP 复测

独立 Chrome、冷浏览器缓存、4 倍 CPU 降速、配置 150ms 网络延迟及 200KB/s 下载；移动端 390×844，桌面 1440×900，DPR 1。每页三轮，表中为中位数。这是访问真实生产域名的合成测量，不是 Cloudflare 的真实用户分位数。

| 页面 | 手机 LCP | 桌面 LCP |
| --- | ---: | ---: |
| 首页 | 740 ms | — |
| Paulownia | 420 ms | — |
| 材料替换审批指南 | 548 ms | 1,312 ms |
| Crown molding 计算器 | 1,176 ms | 1,128 ms |
| Sheet good edge quality 指南 | — | 1,184 ms |
| Cabinet back construction 指南 | — | 1,336 ms |

24 轮测量均 CLS 0、横向溢出 0。手机中位数 TTFB 为 310–426 ms，桌面为 336–339 ms。三个 Learn 桌面页面的 LCP 为首图，图片下载仍是主要耗时阶段。独立 curl 请求经不同边缘节点，四个静态 HTML 单次 TTFB 为 0.88–1.09 秒；一次 TLS 超时经重试成功。这些数值受客户端、地区、网络和连接复用影响，不能替代真实用户表现。

## 效果边界

尝试采集“发布前”浏览器样本时，仓库发生了并行推送，Pages 随后于 00:00 上线。该批浏览器样本可能已经属于新版本，因此不计算发布前后改善百分比。此前读到的 Cloudflare 24 小时 LCP P75 4.9 秒仍是历史窗口，不能与这里的实验中位数直接相减。

当前已证明：规则生效、代码成功上线、调用范围正确、重点页面加载和功能检查通过。尚未证明：真实用户 LCP P75/P90 已达到良好，或慢地区及少量首图样本已经改善。需要积累足够的发布后访问，再按相同窗口、页面、设备和地区比较；旧窗口会混入发布前数据。

原始复测数据：[生产验证 JSON](static-delivery-production-2026-10-13.json)。发布前诊断与回滚方式：[原报告](static-delivery-lcp-2026-10-12.md)。
