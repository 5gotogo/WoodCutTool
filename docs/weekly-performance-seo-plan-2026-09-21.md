# WoodCutTool 性能与 SEO 周计划

执行窗口：2026-09-21 至 2026-09-27。延续用户于 9 月 20 日提出的“下周”规划，按一名开发者五个工作日安排。当前交付为计划，尚未执行其中的优化或部署。

本周目标：确认近期优化在线上的收益，补齐交互卡顿测试，修复测量证实的主要瓶颈，并精修已有搜索入口。时间分配约为性能 3 天、SEO 1 天、回归与发布准备 1 天；周末用于观察。

## 当前证据与优先级依据

| 已核实事实 | 对计划的影响 |
| --- | --- |
| 9 月 20 日线上抽查：首页轻量脚本及 planning、construction、templates CSS 已被相应页面引用；六个抽查 JS/CSS 文件与本地内容哈希一致；Blog 已使用内联样式 | 近期优化已有线上迹象，不重复安排资源拆分，也不沿用旧报告“尚未部署”的状态判断 |
| 抽查的六个 HTML 均为 200、Brotli 压缩、`CF-Cache-Status: DYNAMIC`；资源线上 `max-age=14400`，与仓库的 3600 或 0 不同；复查 planning.css 为 HIT，app.js 为 REVALIDATED | 优先核验实际缓存规则与发布一致性；不能据此认定 CDN 失效或缓存是慢的根因 |
| 首页和 Blog 的首次 HTML 差异为 Cloudflare 注入的 challenge-platform 脚本 | 分析真实浏览器是否受到额外请求或执行影响；不能仅因文件哈希不同判定旧版本，也不直接关闭防护 |
| `assets/content-page.js` 会在已保存非英语语言时加载 `/assets/app.js`；该文件当前为 289,312 字节，未压缩 | 英语首访的历史测试不能代表多语言访问；多语言运行时是优先测量与拆分候选 |
| `assets/plywood-workflow.js` 在 submit 中同步计算并绘制结果，resize 时直接重绘 | 应测试复杂清单和连续操作，确定是否需要分帧、合并重绘或 Worker；当前还没有测得交互延迟，不能把实现方式直接当作卡顿证据 |
| 现有性能脚本记录 LCP、CLS、启动长任务和 Blog 搜索耗时，但没有完整的交互延迟测试矩阵 | “首屏快”和“用起来不卡”必须分别验收 |
| 当前 SEO 审核扫描 2,484 个 index.html，问题输出为空；索引质量检查通过；2,385 个 Sitemap 路由在现有导航模型下全部可达，最大深度 3 | 保留已有 SEO 基础设施，把工作重心转向搜索机会与内容质量 |
| 原始 HTML 的 `<a href>` 独立抽查：2,380/2,385 路由可从首页到达，最大深度 4；另外 5 个是法律说明页 | 仅补必要的静态入口与检查口径，不做全站导航重构 |
| Learn 意图库已有 163 页、12 个主题、13 个候选集合，均有审阅记录 | 不重新盘点同一批意图，不凭相似标题批量合并 |

本次未取得最新 Cloudflare RUM 和 Search Console 账户数据。历史本地 LCP、旧截图和单次 HTTP 响应耗时均不作为当前线上 P75；本次也没有重新执行浏览器性能基准。

## 每日任务

### 周一 9/21：线上基线与缓存链路（P0，1 天）

上午建立可比较的基线，下午处理一个证据最充分的线上配置问题。

- 导出最近 7 天及前一个可比 7 天的 Cloudflare 数据，按页面组、移动/桌面、地区记录 LCP P75/P90、CLS、可用的交互指标和样本数；同时保留更长窗口，避免少量样本误导。不要对各页面百分位求平均冒充全站百分位。
- 固定重点页面：首页、Blog、胶合板计算器、柜门计算器，以及 Template、Worksheet、Learn、App 的代表页。记录部署版本、缓存响应头、LCP 元素和耗时分解；优先处理真实用户慢且有足够访问量的页面组。
- 核对 Cloudflare Cache Rules、Browser Cache TTL、Pages 发布配置、`_headers` 和 `functions/_middleware.js`。仓库没有显式 `_routes.json`，需检查实际构建生成的调用范围，再判断静态资源是否需要绕过 Functions。
- 若确认配置覆写或版本混用，做最小修复并核验缓存更新。固定文件名资源不直接改为一年 immutable；先明确版本化与回滚方式。API、归因跳转和无效搜索模板的 410 行为需保留。
- 记录真实浏览器中的 Cloudflare 注入脚本开销；只有证明其影响正常访客或抓取时才调整相应规则。

交付：线上基线表、配置差异清单、一个可复核的修复或“无需调整”结论。没有账户数据时完成公开响应头、资源版本和浏览器对照，把账户核验单列为待办，不阻塞后续本地任务。

相关入口：`_headers`、`functions/_middleware.js`、`wrangler.toml`、`scripts/audit-site-performance.mjs`。

### 周二 9/22：非英语访问与首次加载（P0，1 天）

- 对首页、Blog、一个内容页、一个计算器测四种情况：英语首访、首次切换中文、已保存中文后重新打开、已保存另一种支持语言后重新打开；区分冷缓存与热缓存。
- 记录实际压缩传输量、JS 解析执行时间、LCP、布局变化及语言切换到可用状态的耗时。
- 若完整 app.js 是主要成本，先提取静态页面需要的语言能力，让代表静态页面不因翻译而初始化无关计算器；保持现有语言、持久化选择和失败重试。所有改动从源文件/生成器完成。
- 一天内优先完成一个可用试点与复测，再推广相同机制。若拆分涉及大面积耦合，交付边界清晰的下一批任务，本周改修周一证据最强的加载瓶颈，避免带着未完成重构进入发布。

验收：目标页面翻译完整，刷新后语言保留，菜单与计算器正常；相同测试条件下资源或执行成本确有下降，英语首访没有明显回退。以实测收益决定是否保留改动，不预先承诺固定提升百分比。

相关入口：`assets/app.js`、`assets/content-page.js`、`scripts/site-performance-profile.mjs`、`scripts/apply-nav-cta.mjs`。

### 周三 9/23：交互卡顿专项（P0，1 天）

- 给现有浏览器检查补上真实输入/点击后的延迟记录，避免只派发脚本事件就称为真实 INP。实验室交互延迟与线上 INP 分开报告。
- 胶合板计算器：小清单、较大清单、接近当前合法上限的清单，覆盖计算、修改后重算、切换板材结果、导出；同时检查计算正确性和未排入零件提示。
- Blog：首次搜索、连续输入、清空搜索；全站：菜单首次打开、语言切换、长页滚动与窗口变化。
- 录制主线程 trace，优先修复最慢的一条操作链：合并重复 DOM 更新、避免重复布局、分帧处理或合并 resize 重绘；只有计算本身确实阻塞时才考虑 Worker。

验收：目标普通操作在固定移动端测试条件下，以不超过 200 ms 的下一次绘制延迟为工程目标；耗时计算应先显示反馈并保持界面可响应，结果完成时间另列。修复前后记录相同数据集、至少三次结果与最长任务；计算结果、保存和导出无回归。

相关入口：`assets/plywood-workflow.js`、`assets/cut-handoff-model.js`、`assets/blog-index.js`、`assets/site-chrome.js`、`scripts/audit-site-performance.mjs` 及现有浏览器测试。

### 周四 9/24：精修搜索入口（P1，1 天）

- 使用最近至少 90 天的 Search Console 页面/查询聚合数据筛选 3–5 个页面：优先有曝光、排名约 4–15、相近排名与设备下 CTR 偏低、且与木工工具/CutList 相关的页面。留存修改前 28 天基线。
- 每页只处理已确认机会：标题是否准确匹配问题、开头是否直接回答、示例是否可复现、正文是否链接到合适计算器/模板，以及内容中的过时事实。不要只增加字数。
- 没有 Search Console 数据时，从 `/plywood-cut-calculator/`、`/cabinet-door-calculator/`、`/learn/plywood-cut-list-guide/`、`/templates/plywood-chair-cut-list/`、`/apps/cutlist/` 选择 3 页做内容和操作路径审阅；这些是流程候选，不是已证实的流量最高页。
- 在相关的静态法律说明页面中，为缺少原始 HTML 入链的五页补适当入口，并给架构审核增加“原始 HTML / JS 渲染后”两种口径。涉及 `/terms-of-service/`、`/cookie-policy/`、`/copyright-notice/`、`/acceptable-use-policy/`、`/external-links-policy/`。
- 检查所改页面的 canonical、robots、结构化数据与可见内容一致性，以及 Sitemap lastmod。保留已有 73 个待扩充 Blog 页的 noindex，除非逐页达到发布质量要求；同 URL 的语言切换不虚构独立语言 URL 或 hreflang。

验收：3–5 页有明确修改理由、前后快照和生成器来源；没有死链或索引信号回归；相关行动链接可用。SEO 成效在后续完整 28 天窗口比较，并标注同期排名、季节性和查询结构变化。

相关入口：`scripts/seo-meta.mjs`、各栏目生成器、`scripts/audit-site-architecture.mjs`、`data/seo/learn-intent-inventory.json`、`docs/learn-intent-review.md`。

### 周五 9/25：回归、防退化与发布准备（P0，1 天）

- 对改动运行对应生成器及必要后处理，最终执行 `npm run build`、`npm run check`、`git diff --check`；审核生成文件变动范围。
- 沿用现有 16 条代表路由基准，在 390px、4× CPU、150 ms 延迟、200 KB/s 下载、冷缓存下至少三次复测；性能对照测试串行进行。多语言与交互专项加入固定回归集，重点页补充热缓存和高 DPR 场景。
- 360/390/430/1440px 检查菜单、表单、结果、语言、滚动、导出及页面溢出；保留截图和原始结果。
- 保留已有 CSS/JS 体积预算，增加本周修复的回归保护。实验室指标若明显回退（例如超过基线 10%），先重复确认并解释，不把正常测量噪声当作故障。
- 准备包含部署版本、变更、对照数据及回滚方法的发布记录；进入实际执行阶段后，按届时授权发布并核对线上资源与行为。

交付：验收报告、可发布版本、未完成事项。若未部署，明确写“本地验收通过”，线上验收保留待办。

### 周末 9/26–9/27：观察，不扩大改动

检查已发布版本的错误、主要操作和真实用户指标是否异常。形成一页复盘：完成了什么、实测改善、样本限制、下一轮优先项。计划本身不创建定时任务。

## 成功标准与范围控制

- 真实用户长期目标：移动和桌面分别达到 P75 LCP ≤2.5 秒、INP ≤200 ms、CLS ≤0.1；本周先建立可比较基线及改善证据，样本不足不宣布达标。
- 性能交付：一个已证实的加载瓶颈和一个已证实的交互瓶颈得到修复，或留下测量支持的无需修改结论；不会为了凑数量修改代码。
- SEO 交付：3–5 个已有页面完成有依据的精修，相关技术检查通过。搜索排名、自然流量增长不作为五天内必达承诺。
- 所有优化保持计算正确、语言功能、导航、可访问性和本地数据行为。测量只使用必要的聚合数据，不上传项目名称、尺寸或用户标识。
- 本周不批量新增文章、不整体重写框架、不在没有查询证据时批量合并/重定向/noindex。完整资源指纹化、全语言独立 URL 和全站导航静态化留作后续评估。
- 超时先减少 SEO 精修数量或缩小语言试点，保留测量、至少一条完整修复路径和周五回归时间。线上配置和账户数据依赖需单列，不阻塞无依赖工作。

## 本次规划检查与参考

本次已通过：SEO、Indexability、Architecture、Learn intents 审核，Core Web Vitals 静态规则检查、Sitemap signals 测试和 diff 检查。没有为规划重新运行完整 build 或浏览器基准。

仓库依据：`docs/loading-performance-2026-09-18.md`、`docs/blog-lcp-2026-09-17.md`、`docs/lcp-audit-2026-09-16.md`、`docs/seo-priority-execution-plan-2026-2027.md`。

- [Google Web Vitals](https://web.dev/articles/vitals)：指标阈值、真实用户与实验室证据的区别。
- [Google 页面体验说明](https://developers.google.com/search/docs/appearance/page-experience)：Core Web Vitals 是搜索考量之一，良好分数不保证排名。
- [Google 可抓取链接](https://developers.google.com/search/docs/crawling-indexing/links-crawlable)及 [JavaScript SEO](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics)：原始 HTML 与渲染后链接均应正确，不将使用 JS 等同于无法收录。
- [Cloudflare Pages Functions 路由](https://developers.cloudflare.com/pages/functions/routing/)及 [Headers](https://developers.cloudflare.com/pages/configuration/headers/)：核查实际函数调用范围与响应头，不能仅从仓库配置推断线上行为。
