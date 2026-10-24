# 2026-10-24 科研型文章批次

新增 10 篇英文研究解读，沿用网站语言与博客结构。每篇有 8 节正文（715–771 个英文词）、比较表、检查清单、FAQ 和可核查参考资料；正文合计 7,357 个英文词。

这些文章属于文献解读、解析推导和研究方法设计，不是新完成的实验论文。所有自建数值案例均说明假设，没有将演示数据写成客户案例或实测结果。

## 文章目录

1. [胶合板方向刚度：旋转零件为何会改变力学模型](../blog/plywood-directional-stiffness-research/index.html)

   研究方法：相同几何与载荷下，改变假设弹性模量的挠度敏感性。

2. [木螺钉连接：抗拔、侧向受力与完整载荷路径](../blog/wood-screw-load-path-research/index.html)

   研究方法：偏心力矩与理想力偶反力推导。

3. [木器涂层与水分：延缓交换不等于永久密封](../blog/wood-finish-moisture-barrier-research/index.html)

   研究方法：明确标注假设的一阶响应模型。

4. [木材含水率仪：参考测量、偏差与取样深度](../blog/wood-moisture-meter-reference-research/index.html)

   研究方法：干基含水率、配对差值与取样一致性。

5. [木材密度与板材质量：为什么必须说明含水率基准](../blog/wood-density-panel-mass-research/index.html)

   研究方法：密度、厚度和体积的质量敏感性计算。

6. [柜体配合：公差叠加与测量不确定度的区别](../blog/cabinet-tolerance-measurement-uncertainty-research/index.html)

   研究方法：最坏情况边界、独立分量与相关分量。

7. [柜体对角线：相等读数能够证明什么](../blog/cabinet-diagonal-squareness-research/index.html)

   研究方法：平行四边形剪切公式与等腰梯形反例。

8. [板材排版下界：面积足够为什么仍然放不下](../blog/sheet-packing-lower-bound-proof-research/index.html)

   研究方法：几何反例、锯缝、可行性与最优性证据。

9. [开料方法实验：在同一批任务上做配对比较](../blog/cut-list-paired-benchmark-research/index.html)

   研究方法：逐任务差值、两种百分比与失败样本规则。

10. [木材胶接表面处理：如何设计能够解释接头的比较](../blog/wood-bond-surface-preparation-research/index.html)

   研究方法：名义应力、接头几何和受控试件设计。

## 来源与证据

- USDA Forest Products Laboratory《Wood Handbook》（2021）第 4、8、9、10、12、13、16 章：材料物性、紧固、梁模型、胶接、复合板、含水率测量及涂层。
- NIST TN 1297 第 5 节及附录 A：标准不确定度及含协方差的传播。
- NIST/SEMATECH：配对观察和随机区组设计。
- NPL Measurement Good Practice Guide 80：尺寸计量、误差和测量基准。
- Serairi 与 Haouari（2018），RAIRO Operations Research，DOI 10.1051/ro/2017019：二维装箱下界的研究背景。
- SCIP 官方文档：容量装箱模型；正文明确其不能替代二维排版可行性证明。

每篇页面的 Data and references 区域提供对应来源链接，正文标记对应的 [1]、[2] 引用。公开文献中的机理说明、本文自行推导的结果与建议开展的实验分开表述。

## 可维护来源

- 内容源：`scripts/blog-batch-2026-10-24-science.mjs`
- 注册入口：`scripts/build-blog-content.mjs`
- 构建：`npm run generate:blog`，然后执行仓库后处理、站点地图与验证流程。
- 每篇发布日及修改日：2026-10-24（Asia/Shanghai）。
- 保留完整英文研究正文，不使用通用分类模板替换为不相关的中文内容；本批未提供逐篇人工中文译文。

文献页面于 2026-10-24 核查。文中的三位小数用于复算，不代表实际仪器精度。本批为本地网站内容，部署状态应以实际发布记录为准。

## 本地验证结果

- 10 个唯一 slug、80 节正文、每篇至少 700 词的正文及主要来源检查通过。
- 14 项数值复核通过，覆盖挠度、响应模型、质量、不确定度、对角线和配对百分比。
- 10 篇完整正文均已输出，canonical 正确，无 noindex，并出现在归档、RSS、搜索索引和博客 sitemap 中。
- 清理无关生成改动后，`npm run check` 完整通过；验证 2,579 个 HTML 文件、10 份 sitemap 与 2,479 个 sitemap URL。
- 桌面文章预览通过；390 × 844 手机预览中页面宽度为 390 px，较宽的表格在自身容器内滚动。
- 手机端展开目录后，搜索 `cabinet tolerance measurement uncertainty` 返回对应的新文章。
- `git diff --check` 通过。未提交 Git，未部署。
