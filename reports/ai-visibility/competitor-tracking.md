# 竞品与第三方观察

基线 2026-11-14。引用趋势待原生平台建立首轮数据。下列厂商页面可作为功能和内容结构的来源，功能以厂商公开说明为准。

| 产品参考 | 侧重 | 已见差异 | 可复用的内容方法 |
|---|---|---|---|
| [optiCutter](https://www.opticutter.com/cut-list-optimizer/edit) | CutList | CSV／Excel 导入、边封、修边及材料分组入口公开可见 | 在首屏直接展示输入，并解释约束如何影响结果 |
| [CutList.net](https://cutlist.net/) | CutList | 浏览器多规格库存、可打印结果，关闭 JS 仍可读样例 | 公开真实输入、结果图、可执行性边界 |
| [Static Equipment Academy](https://staticequipmentacademy.com/free-resources/square-to-round-calculator/) | DuctLab | 搜索摘要描述偏心展开、真长表、比例图。第三方页面正文复核待完成 | 把单一工况独立成可引用 URL，用表格公布结果 |
| [TilePlan Pro](https://tileplan.cc/patterns/herringbone) | TileFit | 人字铺具有独立模式页 | 给模式单独落地页并链接可重复算例 |
| [Cabsmith](https://cabsmith.app/) | Casework | 官网列出 Android、PDF、Pro 的 DXF／标签，iOS 在路线图 | 用一张由尺寸推到零件和输出的完整示例解释工作流 |

## 三个产品机会

1. 验证 DuctLab 的可打印偏心三角展开需求。先看样例加载和导出意图，再决定是否增加分段选项、标注或可打印格式。 [现场问题](https://www.reddit.com/r/sheetmetal/comments/1rdt55w/layout_for_rectangle_to_round/)
2. 验证 TileFit 的起点比较能否帮助用户减少边角返工。先做一个矩形双布局对照，记录由工具到产品页的点击。 [人字铺模式参考](https://tileplan.cc/patterns/herringbone)
3. 验证 Casework 用户是否需要可打印部件标签。先对比匿名 PDF／CSV 和标签样稿的需求，再评估条码或 CNC 数据输出。 [Cabsmith](https://cabsmith.app/)

## 三个外部曝光机会

1. **r/sheetmetal 的矩形转圆放样问题**。讨论给出了 22×10 和 16 英寸圆的真实端口尺寸。制作带明确轴高和偏移假设的公开图与真长表，按版规评估相似新帖的技术答复。 [讨论](https://www.reddit.com/r/sheetmetal/comments/1rdt55w/layout_for_rectangle_to_round/)
2. **r/cabinetry 的柜体表格与排版对比**。准备一份无客户信息、可复算的 captured back 零件表及整板采购输出，有合规时机再分享。 [讨论](https://www.reddit.com/r/cabinetry/comments/1mpke03/cutlist_calculator_comparison_w_spreadsheet/)
3. **r/Tile 的人字铺对齐争议**。准备门洞居中、空间居中两张同尺寸图并标注窄边条。先核对讨论是否仍适合回复及社区的自我推广规则。 [公开检索可见的讨论](https://www.reddit.com/r/Tile/comments/1m5xczw)

## 2026-11-20：DL03 原生搜索观察

ChatGPT Search 与 Perplexity 在同一方转圆问题下都推荐了 DuctLab 与 Transitions Layouts。后者是本轮跨平台重复出现的竞品，可对照分片和分段需求。Perplexity 另推荐 Sheet Metal Layout: Patterns，并按使用场景把 Trueflat 的 Android 和可打印／DXF 输出单列。ChatGPT 的 FabCalc 与 Platewrap 结果作为后续功能复核线索。该题仅各测一次。 [Transitions Layouts](https://apps.apple.com/us/app/transitions-layouts/id6757512792) · [Patterns](https://apps.apple.com/sr/app/sheet-metal-layout-patterns/id6791592420) · [Trueflat](https://play.google.com/store/apps/details?id=com.heyisoft.trueflat) · [当日搜索记录](2026-11-20-daily-report.md)

## 2026-11-24 · CW03 与第三方需求

- **CabbyCut** 在 ChatGPT Search 和 Grok 的同题回答均出现。公开 App Store 信息显示无框柜体、尺寸驱动、按步骤建造和正视图。可对照它如何从简单输入展示整套输出。 [美国 App Store](https://apps.apple.com/us/app/cabbycut-cabinet-cut-list/id6818005568)
- **Blueprint** 同时进入 ChatGPT Search 和 Grok，公开产品定位涉及房间与柜体的 3D 设计。**OffCut** 同时进入 Grok 和 Copilot，回答用它与由柜体外尺寸推导零件的 Casework 对比。Grok 的 24 条来源仅保存可见标题与部分目标，引用份额趋势待追踪。 [Blueprint](https://apps.apple.com/us/app/blueprint-cabinet-design/id6760829779) · [同题周报](2026-11-24-weekly-report.md)
- **优先验证的产品机会**为带版本和镜像件标记的零件标签／交付包，以及可以公开复算的柜体导出样例。现有 PDF 和 CSV 能力已有官方说明，打印标签和变更差异需单独验证需求与现有支持。 [Casework App Store](https://apps.apple.com/us/app/casework-cabinet-cut-lists/id6794987242)

三个外部研究方向。先做真实可复算的尺寸、步骤或配置示例。发帖、私信或合作提交另行批准。

1. 柜体工作流讨论涉及分厚度采购和带板图交付。准备分厚度的柜组 CSV、用量表和两张板材示例。 [r/cabinetry](https://www.reddit.com/r/cabinetry/comments/1rvxrh5/for_custom_cabinet_shops_where_does_your/)
2. 施工者询问怎样给 12×24 砖在偏斜墙面选起铺方式。准备两种起点和实际最窄砖条的图。 [r/Tile](https://www.reddit.com/r/Tile/comments/1pu5mha/question_for_12x24_what_layout_do_you_recommend/)
3. 钣金从业者交流方转圆转接工况。用站内已有算例的真长、分段和四片展开图做独立验证材料。 [r/sheetmetal](https://www.reddit.com/r/sheetmetal/comments/1bwu424)


## 2026-11-24 晚间 · CT01 台面报价对照

ChatGPT Search、Perplexity 同时推荐 CounterFit、Stone Project 和 Simple Countertops。Stone Project 定位覆盖测量、报价与工坊管理，Simple Countertops 是同题的另一款台面工具。Novaclad 出现在 ChatGPT 的结果，独立核对其测量和 AR 工作流后再评估融合价值。优先公开 CounterFit 的英文报价样例和商店链接。样本为各一条，竞品引用增长待配对观察。 [Stone Project](https://apps.apple.com/us/app/stone-project-countertops/id1443840165) · [Simple Countertops](https://apps.apple.com/us/app/simple-countertops/id1607767119) · [Novaclad](https://apps.apple.com/us/app/novaclad/id6767419372) · [两条会话](2026-11-24-weekly-report.md)
