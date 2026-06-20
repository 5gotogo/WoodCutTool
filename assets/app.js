const APP_STORE_URL = "https://apps.apple.com/us/app/cutlist-plywood-optimizer/id6768171871";
const QUILTFIT_APP_STORE_URL = "https://apps.apple.com/us/app/quiltfit-quilt-design-planner/id6776541705";

const LANGUAGE_OPTIONS = {
  en: "English",
  "zh-CN": "简体中文",
  "zh-TW": "繁體中文",
  es: "Español",
  pt: "Português",
  fr: "Français",
  de: "Deutsch",
  nl: "Nederlands",
  it: "Italiano",
  ar: "العربية",
  ja: "日本語"
};

const translations = {
  "zh-CN": {
    "Skip to content": "跳到内容",
    "Download CutList": "下载 CutList",
    "Download CutList iOS": "下载 CutList iOS",
    "Download QuiltFit": "下载 QuiltFit",
    "Download QuiltFit iOS": "下载 QuiltFit iOS",
    "Home": "首页",
    "Sitemap": "站点地图",
    "Tile": "瓷砖",
    "Stringer": "楼梯",
    "Woodworking calculator for material savings": "节省材料的木工计算器",
    "Save plywood, reduce material cost, and eliminate waste before cutting.": "在切割前节省胶合板、降低材料成本并减少浪费。",
    "WoodCutTool helps cabinet makers, contractors, carpenters, and DIY builders plan cut lists instantly in the browser. No login, no upload, no CAD learning curve.": "WoodCutTool 帮助橱柜工、承包商、木匠和 DIY 用户直接在浏览器中规划切割清单。无需登录、无需上传，也不用学习 CAD。",
    "Save up to 20% material waste per project with a cleaner cut plan before you touch the saw.": "开锯前先生成更清晰的切割方案，每个项目最多可减少 20% 材料浪费。",
    "Open CutList": "打开 CutList",
    "Stair Stringer Calculator": "楼梯梁计算器",
    "No login required": "无需登录",
    "No data uploaded": "无需上传数据",
    "Runs fully in browser": "完全在浏览器中运行",
    "Built for workshop use": "为工作间使用而设计",
    "ROI preview": "收益预览",
    "Input -> output -> savings, before you buy plywood.": "购买胶合板前，先看输入、输出和节省。",
    "WoodCutTool makes the material saving visible like a calculator result: stock sheets in, optimized layout out, dollars saved per job.": "WoodCutTool 像计算器结果一样展示材料节省：输入板材，输出优化布局，并显示每个项目可节省的成本。",
    "Input": "输入",
    "Output": "输出",
    "Savings": "节省",
    "Result": "结果",
    "3 plywood sheets": "3 张胶合板",
    "2 sheets needed": "需要 2 张板",
    "Calculator result preview": "计算结果预览",
    "This is what saving material looks like.": "材料节省会这样呈现。",
    "Enter parts once and get a visual sheet layout, waste estimate, and a money-saving decision before cutting.": "只需输入一次零件，即可在切割前获得可视化板材布局、浪费估算和省钱判断。",
    "Optimized cut layout": "优化切割布局",
    "Waste": "浪费",
    "Choose the right tool": "选择合适工具",
    "Built around shop outcomes, not software features.": "围绕实际加工结果，而不是软件功能堆砌。",
    "Minimize plywood waste instantly": "快速减少胶合板浪费",
    "Fit quilt blocks and backing": "匹配被子方块和背布",
    "Estimate tile before ordering": "下单前估算瓷砖",
    "Generate precise stair cuts instantly": "快速生成精确楼梯切割尺寸",
    "Open CutList ->": "打开 CutList ->",
    "Open QuiltFit ->": "打开 QuiltFit ->",
    "Open Tile Calculator ->": "打开瓷砖计算器 ->",
    "Open Stringer ->": "打开楼梯计算器 ->",
    "Calculate material savings before the first cut.": "第一次切割前先计算材料节省。",
    "Optimize My Project": "优化我的项目",
    "Calculate Tile Material": "计算瓷砖材料",
    "Start Saving Material Now": "立即开始节省材料",
    "Woodworking guides": "木工指南",
    "Learn how to reduce material waste.": "学习如何减少材料浪费。",
    "Read guide": "阅读指南",
    "Quilt layout planner": "被子布局规划器",
    "QuiltFit Calculator": "QuiltFit 计算器",
    "Fit a quilt top from finished size, block size, seam allowance, border width, and backing overage. The calculator estimates blocks, backing, batting, and binding, then sends serious planning into QuiltFit for iPhone.": "根据成品尺寸、方块尺寸、缝份、边框宽度和背布余量规划被面。计算器会估算方块、背布、铺棉和包边，并引导到 iPhone 版 QuiltFit 做完整规划。",
    "Calculate quilt fit": "计算被子匹配",
    "Finished quilt": "被子成品",
    "Target width (in)": "目标宽度（英寸）",
    "Target length (in)": "目标长度（英寸）",
    "Finished block (in)": "成品方块（英寸）",
    "Seam allowance (in)": "缝份（英寸）",
    "Fabric setup": "布料设置",
    "Border width (in)": "边框宽度（英寸）",
    "Backing overage per side (in)": "每边背布余量（英寸）",
    "Fabric width (in)": "布宽（英寸）",
    "Quilt results": "被子结果",
    "Run the calculator to see block count, finished top size, backing fabric, batting size, and binding estimate.": "运行计算器即可查看方块数量、成品被面尺寸、背布、铺棉和包边估算。",
    "Continue in QuiltFit": "继续使用 QuiltFit",
    "Use the iPhone app for pattern design, fabric shopping lists, visual cutting plans, cut-piece tracking, and step-by-step sewing.": "使用 iPhone App 进行图案设计、布料购物清单、可视化裁剪方案、裁片跟踪和分步缝制。",
    "Quilt fit result": "被子匹配结果",
    "Block layout": "方块布局",
    "Total blocks": "方块总数",
    "Finished top": "成品被面",
    "Cut block size": "裁切方块尺寸",
    "Design the full quilt in QuiltFit for iPhone": "在 iPhone 版 QuiltFit 中设计完整被子",
    "Move from this quick estimate into the app to design patterns, build fabric shopping lists, track cut pieces, and follow step-by-step sewing.": "从快速估算进入 App，设计图案、生成布料购物清单、跟踪裁片并按步骤缝制。",
    "Pattern design": "图案设计",
    "Fabric shopping list": "布料购物清单",
    "Visual cutting plan": "可视化裁剪方案",
    "Step-by-step sewing": "分步缝制",
    "Tile Calculator": "瓷砖计算器",
    "Floor and wall tile estimator": "地面和墙面瓷砖估算器",
    "Room size": "房间尺寸",
    "Room length (ft)": "房间长度（英尺）",
    "Room width (ft)": "房间宽度（英尺）",
    "Tile setup": "瓷砖设置",
    "Tile length (in)": "瓷砖长度（英寸）",
    "Tile width (in)": "瓷砖宽度（英寸）",
    "Grout joint (in)": "美缝宽度（英寸）",
    "Waste allowance (%)": "损耗预留（%）",
    "Box and cost": "包装和成本",
    "Box coverage (ft²)": "每箱覆盖面积（平方英尺）",
    "Price per box": "每箱价格",
    "Calculate tile": "计算瓷砖",
    "Tile results": "瓷砖结果",
    "Tile calculator result": "瓷砖计算结果",
    "Tiles to buy": "需购买瓷砖",
    "Boxes required": "所需箱数",
    "Room area": "房间面积",
    "Estimated tile cost": "预计瓷砖成本",
    "CutList Calculator": "CutList 计算器",
    "Woodworking cut optimizer": "木工切割优化器",
    "Stock board": "原料板材",
    "Board length (in)": "板材长度（英寸）",
    "Board width (in)": "板材宽度（英寸）",
    "Board thickness (in)": "板材厚度（英寸）",
    "Saw kerf (in)": "锯缝（英寸）",
    "Cut pieces": "切割零件",
    "Part name": "零件名称",
    "Length (in)": "长度（英寸）",
    "Width (in)": "宽度（英寸）",
    "Qty": "数量",
    "Remove": "删除",
    "Add part": "添加零件",
    "Optimize cut list": "优化切割清单",
    "Cut plan results": "切割方案结果",
    "Optimized cutting plan": "优化切割方案",
    "Boards required": "所需板材",
    "Cut length": "切割长度",
    "Kerf loss": "锯缝损耗",
    "Step-by-step cutting guide": "分步切割指南",
    "Stringer Calculator": "楼梯梁计算器",
    "Stair layout tool": "楼梯布局工具",
    "Stair dimensions": "楼梯尺寸",
    "Total rise (in)": "总升高（英寸）",
    "Total run (in)": "总进深（英寸）",
    "Max riser (in)": "最大踏步高（英寸）",
    "Target tread (in)": "目标踏面深度（英寸）",
    "Calculate stringer": "计算楼梯梁",
    "Stringer results": "楼梯梁结果",
    "Stair stringer result": "楼梯梁计算结果",
    "Risers": "立板数",
    "Treads": "踏步数",
    "Riser height": "踏步高度",
    "Tread depth": "踏面深度"
  },
  "zh-TW": {
    "Skip to content": "跳到內容",
    "Download CutList": "下載 CutList",
    "Download CutList iOS": "下載 CutList iOS",
    "Download QuiltFit": "下載 QuiltFit",
    "Download QuiltFit iOS": "下載 QuiltFit iOS",
    "Home": "首頁",
    "Sitemap": "網站地圖",
    "Tile": "磁磚",
    "Stringer": "樓梯",
    "Woodworking calculator for material savings": "節省材料的木工計算器",
    "Save plywood, reduce material cost, and eliminate waste before cutting.": "在切割前節省夾板、降低材料成本並減少浪費。",
    "Open CutList": "開啟 CutList",
    "Stair Stringer Calculator": "樓梯樑計算器",
    "No login required": "無需登入",
    "No data uploaded": "不需上傳資料",
    "Runs fully in browser": "完全在瀏覽器中執行",
    "Built for workshop use": "為工作室使用而設計",
    "Choose the right tool": "選擇合適工具",
    "Minimize plywood waste instantly": "快速減少夾板浪費",
    "Fit quilt blocks and backing": "匹配拼布方塊與背布",
    "Estimate tile before ordering": "下單前估算磁磚",
    "Generate precise stair cuts instantly": "快速產生精準樓梯切割尺寸",
    "Open CutList ->": "開啟 CutList ->",
    "Open QuiltFit ->": "開啟 QuiltFit ->",
    "Open Tile Calculator ->": "開啟磁磚計算器 ->",
    "Open Stringer ->": "開啟樓梯計算器 ->",
    "Quilt layout planner": "拼布布局規劃器",
    "QuiltFit Calculator": "QuiltFit 計算器",
    "Calculate quilt fit": "計算拼布尺寸",
    "Finished quilt": "拼布成品",
    "Target width (in)": "目標寬度（英寸）",
    "Target length (in)": "目標長度（英寸）",
    "Finished block (in)": "成品方塊（英寸）",
    "Seam allowance (in)": "縫份（英寸）",
    "Fabric setup": "布料設定",
    "Border width (in)": "邊框寬度（英寸）",
    "Backing overage per side (in)": "每邊背布餘量（英寸）",
    "Fabric width (in)": "布寬（英寸）",
    "Quilt results": "拼布結果",
    "Continue in QuiltFit": "繼續使用 QuiltFit",
    "Quilt fit result": "拼布匹配結果",
    "Block layout": "方塊布局",
    "Total blocks": "方塊總數",
    "Finished top": "成品被面",
    "Cut block size": "裁切方塊尺寸",
    "Pattern design": "圖案設計",
    "Fabric shopping list": "布料購物清單",
    "Visual cutting plan": "視覺化裁剪方案",
    "Step-by-step sewing": "逐步縫製",
    "Tile Calculator": "磁磚計算器",
    "Room size": "房間尺寸",
    "Room length (ft)": "房間長度（英尺）",
    "Room width (ft)": "房間寬度（英尺）",
    "Tile setup": "磁磚設定",
    "Tile length (in)": "磁磚長度（英寸）",
    "Tile width (in)": "磁磚寬度（英寸）",
    "Grout joint (in)": "填縫寬度（英寸）",
    "Waste allowance (%)": "損耗預留（%）",
    "Box and cost": "包裝與成本",
    "Box coverage (ft²)": "每箱覆蓋面積（平方英尺）",
    "Price per box": "每箱價格",
    "Calculate tile": "計算磁磚",
    "Tile results": "磁磚結果",
    "Tile calculator result": "磁磚計算結果",
    "Tiles to buy": "需購買磁磚",
    "Boxes required": "所需箱數",
    "Room area": "房間面積",
    "Estimated tile cost": "預估磁磚成本",
    "CutList Calculator": "CutList 計算器",
    "Stock board": "原料板材",
    "Board length (in)": "板材長度（英寸）",
    "Board width (in)": "板材寬度（英寸）",
    "Board thickness (in)": "板材厚度（英寸）",
    "Saw kerf (in)": "鋸縫（英寸）",
    "Cut pieces": "切割零件",
    "Part name": "零件名稱",
    "Length (in)": "長度（英寸）",
    "Width (in)": "寬度（英寸）",
    "Qty": "數量",
    "Remove": "移除",
    "Add part": "新增零件",
    "Optimize cut list": "最佳化切割清單",
    "Cut plan results": "切割方案結果",
    "Boards required": "所需板材",
    "Cut length": "切割長度",
    "Kerf loss": "鋸縫損耗",
    "Stringer Calculator": "樓梯樑計算器",
    "Stair dimensions": "樓梯尺寸",
    "Total rise (in)": "總升高（英寸）",
    "Total run (in)": "總進深（英寸）",
    "Max riser (in)": "最大踏步高（英寸）",
    "Target tread (in)": "目標踏面深度（英寸）",
    "Calculate stringer": "計算樓梯樑",
    "Risers": "立板數",
    "Treads": "踏步數",
    "Riser height": "踏步高度",
    "Tread depth": "踏面深度"
  },
  es: {
    "Skip to content": "Saltar al contenido",
    "Download CutList": "Descargar CutList",
    "Download CutList iOS": "Descargar CutList iOS",
    "Download QuiltFit": "Descargar QuiltFit",
    "Download QuiltFit iOS": "Descargar QuiltFit iOS",
    "Home": "Inicio",
    "Sitemap": "Mapa del sitio",
    "Tile": "Azulejos",
    "Stringer": "Zancas",
    "Woodworking calculator for material savings": "Calculadora de carpintería para ahorrar material",
    "Save plywood, reduce material cost, and eliminate waste before cutting.": "Ahorra contrachapado, reduce costes y elimina desperdicio antes de cortar.",
    "Open CutList": "Abrir CutList",
    "Stair Stringer Calculator": "Calculadora de zancas",
    "No login required": "Sin inicio de sesión",
    "No data uploaded": "No se suben datos",
    "Runs fully in browser": "Funciona en el navegador",
    "Built for workshop use": "Diseñado para el taller",
    "Choose the right tool": "Elige la herramienta correcta",
    "Minimize plywood waste instantly": "Reduce desperdicio de contrachapado",
    "Fit quilt blocks and backing": "Ajusta bloques y reverso de quilt",
    "Estimate tile before ordering": "Calcula azulejos antes de pedir",
    "Generate precise stair cuts instantly": "Genera cortes precisos de escalera",
    "Open CutList ->": "Abrir CutList ->",
    "Open QuiltFit ->": "Abrir QuiltFit ->",
    "Open Tile Calculator ->": "Abrir calculadora de azulejos ->",
    "Open Stringer ->": "Abrir zancas ->",
    "Calculate material savings before the first cut.": "Calcula el ahorro antes del primer corte.",
    "Optimize My Project": "Optimizar mi proyecto",
    "Calculate Tile Material": "Calcular material de azulejo",
    "Read guide": "Leer guía",
    "Quilt layout planner": "Planificador de quilts",
    "QuiltFit Calculator": "Calculadora QuiltFit",
    "Calculate quilt fit": "Calcular quilt",
    "Finished quilt": "Quilt terminado",
    "Target width (in)": "Ancho objetivo (in)",
    "Target length (in)": "Largo objetivo (in)",
    "Finished block (in)": "Bloque terminado (in)",
    "Seam allowance (in)": "Margen de costura (in)",
    "Fabric setup": "Configuración de tela",
    "Border width (in)": "Ancho del borde (in)",
    "Backing overage per side (in)": "Exceso de reverso por lado (in)",
    "Fabric width (in)": "Ancho de tela (in)",
    "Quilt results": "Resultados del quilt",
    "Continue in QuiltFit": "Continuar en QuiltFit",
    "Quilt fit result": "Resultado de QuiltFit",
    "Block layout": "Distribución de bloques",
    "Total blocks": "Bloques totales",
    "Finished top": "Top terminado",
    "Cut block size": "Tamaño de corte del bloque",
    "Pattern design": "Diseño de patrones",
    "Fabric shopping list": "Lista de telas",
    "Visual cutting plan": "Plan visual de corte",
    "Step-by-step sewing": "Costura paso a paso",
    "Tile Calculator": "Calculadora de azulejos",
    "Room size": "Tamaño de la habitación",
    "Room length (ft)": "Largo de la habitación (ft)",
    "Room width (ft)": "Ancho de la habitación (ft)",
    "Tile setup": "Configuración de azulejos",
    "Tile length (in)": "Largo del azulejo (in)",
    "Tile width (in)": "Ancho del azulejo (in)",
    "Grout joint (in)": "Junta (in)",
    "Waste allowance (%)": "Merma (%)",
    "Box and cost": "Caja y coste",
    "Box coverage (ft²)": "Cobertura por caja (ft²)",
    "Price per box": "Precio por caja",
    "Calculate tile": "Calcular azulejos",
    "Tile results": "Resultados de azulejos",
    "Tiles to buy": "Azulejos a comprar",
    "Boxes required": "Cajas necesarias",
    "Room area": "Área",
    "Estimated tile cost": "Coste estimado",
    "CutList Calculator": "Calculadora CutList",
    "Stock board": "Tabla de stock",
    "Board length (in)": "Largo de tabla (in)",
    "Board width (in)": "Ancho de tabla (in)",
    "Board thickness (in)": "Grosor (in)",
    "Saw kerf (in)": "Kerf de sierra (in)",
    "Cut pieces": "Piezas",
    "Part name": "Nombre de pieza",
    "Length (in)": "Largo (in)",
    "Width (in)": "Ancho (in)",
    "Qty": "Cant.",
    "Remove": "Quitar",
    "Add part": "Agregar pieza",
    "Optimize cut list": "Optimizar lista de corte",
    "Boards required": "Tablas necesarias",
    "Cut length": "Longitud de corte",
    "Kerf loss": "Pérdida por kerf",
    "Stringer Calculator": "Calculadora de zancas",
    "Stair dimensions": "Dimensiones de escalera",
    "Total rise (in)": "Altura total (in)",
    "Total run (in)": "Recorrido total (in)",
    "Max riser (in)": "Contrahuella máx. (in)",
    "Target tread (in)": "Huella objetivo (in)",
    "Calculate stringer": "Calcular zanca",
    "Risers": "Contrahuellas",
    "Treads": "Huellas",
    "Riser height": "Altura de contrahuella",
    "Tread depth": "Profundidad de huella"
  },
  pt: {
    "Download CutList": "Baixar CutList",
    "Download CutList iOS": "Baixar CutList iOS",
    "Download QuiltFit": "Baixar QuiltFit",
    "Download QuiltFit iOS": "Baixar QuiltFit iOS",
    "Home": "Início",
    "Sitemap": "Mapa do site",
    "Tile": "Azulejos",
    "Stringer": "Escada",
    "Open CutList": "Abrir CutList",
    "No login required": "Sem login",
    "No data uploaded": "Nenhum dado enviado",
    "Runs fully in browser": "Roda no navegador",
    "Choose the right tool": "Escolha a ferramenta certa",
    "Open CutList ->": "Abrir CutList ->",
    "Open QuiltFit ->": "Abrir QuiltFit ->",
    "Open Tile Calculator ->": "Abrir calculadora de azulejos ->",
    "Open Stringer ->": "Abrir escada ->",
    "QuiltFit Calculator": "Calculadora QuiltFit",
    "Quilt layout planner": "Planejador de quilt",
    "Calculate quilt fit": "Calcular quilt",
    "Finished quilt": "Quilt finalizado",
    "Target width (in)": "Largura alvo (pol)",
    "Target length (in)": "Comprimento alvo (pol)",
    "Finished block (in)": "Bloco finalizado (pol)",
    "Seam allowance (in)": "Margem de costura (pol)",
    "Fabric setup": "Configuração do tecido",
    "Border width (in)": "Largura da borda (pol)",
    "Backing overage per side (in)": "Sobra do forro por lado (pol)",
    "Fabric width (in)": "Largura do tecido (pol)",
    "Quilt results": "Resultados do quilt",
    "Continue in QuiltFit": "Continuar no QuiltFit",
    "Quilt fit result": "Resultado do QuiltFit",
    "Block layout": "Layout dos blocos",
    "Total blocks": "Total de blocos",
    "Finished top": "Topo finalizado",
    "Cut block size": "Tamanho de corte do bloco",
    "Pattern design": "Design de padrões",
    "Fabric shopping list": "Lista de tecidos",
    "Visual cutting plan": "Plano visual de corte",
    "Step-by-step sewing": "Costura passo a passo",
    "Tile Calculator": "Calculadora de azulejos",
    "Room size": "Tamanho do ambiente",
    "Room length (ft)": "Comprimento do ambiente (pés)",
    "Room width (ft)": "Largura do ambiente (pés)",
    "Tile setup": "Configuração do azulejo",
    "Waste allowance (%)": "Perda (%)",
    "Calculate tile": "Calcular azulejo",
    "Tile results": "Resultados de azulejo",
    "Tiles to buy": "Azulejos a comprar",
    "Boxes required": "Caixas necessárias",
    "Room area": "Área",
    "Estimated tile cost": "Custo estimado",
    "CutList Calculator": "Calculadora CutList",
    "Stock board": "Madeira em estoque",
    "Cut pieces": "Peças de corte",
    "Part name": "Nome da peça",
    "Qty": "Qtd.",
    "Remove": "Remover",
    "Add part": "Adicionar peça",
    "Optimize cut list": "Otimizar lista de corte",
    "Stringer Calculator": "Calculadora de escada",
    "Stair dimensions": "Dimensões da escada",
    "Calculate stringer": "Calcular escada",
    "Risers": "Espelhos",
    "Treads": "Pisadas",
    "Riser height": "Altura do espelho",
    "Tread depth": "Profundidade da pisada"
  },
  fr: {
    "Download CutList": "Télécharger CutList",
    "Download CutList iOS": "Télécharger CutList iOS",
    "Download QuiltFit": "Télécharger QuiltFit",
    "Download QuiltFit iOS": "Télécharger QuiltFit iOS",
    "Home": "Accueil",
    "Sitemap": "Plan du site",
    "Tile": "Carrelage",
    "Stringer": "Escalier",
    "Open CutList": "Ouvrir CutList",
    "No login required": "Aucune connexion requise",
    "No data uploaded": "Aucune donnée envoyée",
    "Runs fully in browser": "Fonctionne dans le navigateur",
    "Choose the right tool": "Choisissez le bon outil",
    "Open CutList ->": "Ouvrir CutList ->",
    "Open QuiltFit ->": "Ouvrir QuiltFit ->",
    "Open Tile Calculator ->": "Ouvrir le calculateur de carrelage ->",
    "Open Stringer ->": "Ouvrir le calculateur d'escalier ->",
    "QuiltFit Calculator": "Calculateur QuiltFit",
    "Quilt layout planner": "Planificateur de quilt",
    "Calculate quilt fit": "Calculer le quilt",
    "Finished quilt": "Quilt fini",
    "Target width (in)": "Largeur cible (po)",
    "Target length (in)": "Longueur cible (po)",
    "Finished block (in)": "Bloc fini (po)",
    "Seam allowance (in)": "Marge de couture (po)",
    "Fabric setup": "Réglages du tissu",
    "Border width (in)": "Largeur de bordure (po)",
    "Backing overage per side (in)": "Surplus de dos par côté (po)",
    "Fabric width (in)": "Largeur du tissu (po)",
    "Quilt results": "Résultats du quilt",
    "Continue in QuiltFit": "Continuer dans QuiltFit",
    "Quilt fit result": "Résultat QuiltFit",
    "Block layout": "Disposition des blocs",
    "Total blocks": "Nombre de blocs",
    "Finished top": "Dessus fini",
    "Cut block size": "Taille de coupe du bloc",
    "Pattern design": "Création de motifs",
    "Fabric shopping list": "Liste de tissus",
    "Visual cutting plan": "Plan de coupe visuel",
    "Step-by-step sewing": "Couture étape par étape",
    "Tile Calculator": "Calculateur de carrelage",
    "Room size": "Dimensions de la pièce",
    "Waste allowance (%)": "Perte prévue (%)",
    "Calculate tile": "Calculer le carrelage",
    "Tile results": "Résultats du carrelage",
    "Tiles to buy": "Carreaux à acheter",
    "Boxes required": "Boîtes nécessaires",
    "Room area": "Surface",
    "Estimated tile cost": "Coût estimé",
    "CutList Calculator": "Calculateur CutList",
    "Stock board": "Planche brute",
    "Cut pieces": "Pièces à couper",
    "Part name": "Nom de la pièce",
    "Qty": "Qté",
    "Remove": "Supprimer",
    "Add part": "Ajouter une pièce",
    "Optimize cut list": "Optimiser la liste de coupe",
    "Stringer Calculator": "Calculateur de limon",
    "Stair dimensions": "Dimensions de l'escalier",
    "Calculate stringer": "Calculer le limon",
    "Risers": "Contremarches",
    "Treads": "Marches",
    "Riser height": "Hauteur de contremarche",
    "Tread depth": "Profondeur de marche"
  },
  de: {
    "Download CutList": "CutList laden",
    "Download CutList iOS": "CutList iOS laden",
    "Download QuiltFit": "QuiltFit laden",
    "Download QuiltFit iOS": "QuiltFit iOS laden",
    "Home": "Start",
    "Sitemap": "Sitemap",
    "Tile": "Fliesen",
    "Stringer": "Treppe",
    "Open CutList": "CutList öffnen",
    "No login required": "Keine Anmeldung nötig",
    "No data uploaded": "Keine Daten werden hochgeladen",
    "Runs fully in browser": "Läuft komplett im Browser",
    "Choose the right tool": "Das passende Werkzeug wählen",
    "Open CutList ->": "CutList öffnen ->",
    "Open QuiltFit ->": "QuiltFit öffnen ->",
    "Open Tile Calculator ->": "Fliesenrechner öffnen ->",
    "Open Stringer ->": "Treppenrechner öffnen ->",
    "QuiltFit Calculator": "QuiltFit Rechner",
    "Quilt layout planner": "Quilt-Layoutplaner",
    "Calculate quilt fit": "Quilt berechnen",
    "Finished quilt": "Fertiger Quilt",
    "Target width (in)": "Zielbreite (in)",
    "Target length (in)": "Ziellänge (in)",
    "Finished block (in)": "Fertiger Block (in)",
    "Seam allowance (in)": "Nahtzugabe (in)",
    "Fabric setup": "Stoffeinstellungen",
    "Border width (in)": "Randbreite (in)",
    "Backing overage per side (in)": "Rückseitenzugabe je Seite (in)",
    "Fabric width (in)": "Stoffbreite (in)",
    "Quilt results": "Quilt-Ergebnisse",
    "Continue in QuiltFit": "In QuiltFit fortfahren",
    "Quilt fit result": "QuiltFit-Ergebnis",
    "Block layout": "Blocklayout",
    "Total blocks": "Blöcke gesamt",
    "Finished top": "Fertiges Top",
    "Cut block size": "Zuschnittgröße Block",
    "Pattern design": "Musterdesign",
    "Fabric shopping list": "Stoff-Einkaufsliste",
    "Visual cutting plan": "Visueller Zuschnittplan",
    "Step-by-step sewing": "Schrittweises Nähen",
    "Tile Calculator": "Fliesenrechner",
    "Room size": "Raumgröße",
    "Waste allowance (%)": "Verschnitt (%)",
    "Calculate tile": "Fliesen berechnen",
    "Tile results": "Fliesenergebnisse",
    "Tiles to buy": "Zu kaufende Fliesen",
    "Boxes required": "Benötigte Kartons",
    "Room area": "Raumfläche",
    "Estimated tile cost": "Geschätzte Kosten",
    "CutList Calculator": "CutList Rechner",
    "Stock board": "Rohbrett",
    "Cut pieces": "Zuschnitte",
    "Part name": "Teilename",
    "Qty": "Anz.",
    "Remove": "Entfernen",
    "Add part": "Teil hinzufügen",
    "Optimize cut list": "Schnittliste optimieren",
    "Stringer Calculator": "Treppenwangen-Rechner",
    "Stair dimensions": "Treppenmaße",
    "Calculate stringer": "Treppe berechnen",
    "Risers": "Steigungen",
    "Treads": "Auftritte",
    "Riser height": "Steigungshöhe",
    "Tread depth": "Auftrittstiefe"
  },
  it: {
    "Download CutList": "Scarica CutList",
    "Download CutList iOS": "Scarica CutList iOS",
    "Download QuiltFit": "Scarica QuiltFit",
    "Download QuiltFit iOS": "Scarica QuiltFit iOS",
    "Home": "Home",
    "Sitemap": "Mappa del sito",
    "Tile": "Piastrelle",
    "Stringer": "Scala",
    "Open CutList": "Apri CutList",
    "No login required": "Nessun login richiesto",
    "No data uploaded": "Nessun dato caricato",
    "Runs fully in browser": "Funziona nel browser",
    "Choose the right tool": "Scegli lo strumento giusto",
    "Open CutList ->": "Apri CutList ->",
    "Open QuiltFit ->": "Apri QuiltFit ->",
    "Open Tile Calculator ->": "Apri calcolatore piastrelle ->",
    "Open Stringer ->": "Apri calcolatore scala ->",
    "QuiltFit Calculator": "Calcolatore QuiltFit",
    "Quilt layout planner": "Pianificatore quilt",
    "Calculate quilt fit": "Calcola quilt",
    "Finished quilt": "Quilt finito",
    "Target width (in)": "Larghezza target (in)",
    "Target length (in)": "Lunghezza target (in)",
    "Finished block (in)": "Blocco finito (in)",
    "Seam allowance (in)": "Margine di cucitura (in)",
    "Fabric setup": "Impostazioni tessuto",
    "Border width (in)": "Larghezza bordo (in)",
    "Backing overage per side (in)": "Eccedenza retro per lato (in)",
    "Fabric width (in)": "Larghezza tessuto (in)",
    "Quilt results": "Risultati quilt",
    "Continue in QuiltFit": "Continua in QuiltFit",
    "Quilt fit result": "Risultato QuiltFit",
    "Block layout": "Layout blocchi",
    "Total blocks": "Blocchi totali",
    "Finished top": "Top finito",
    "Cut block size": "Misura taglio blocco",
    "Pattern design": "Design pattern",
    "Fabric shopping list": "Lista tessuti",
    "Visual cutting plan": "Piano di taglio visivo",
    "Step-by-step sewing": "Cucito passo passo",
    "Tile Calculator": "Calcolatore piastrelle",
    "Room size": "Dimensioni stanza",
    "Waste allowance (%)": "Scarto (%)",
    "Calculate tile": "Calcola piastrelle",
    "Tile results": "Risultati piastrelle",
    "Tiles to buy": "Piastrelle da comprare",
    "Boxes required": "Scatole necessarie",
    "Room area": "Area stanza",
    "Estimated tile cost": "Costo stimato",
    "CutList Calculator": "Calcolatore CutList",
    "Stock board": "Tavola grezza",
    "Cut pieces": "Pezzi da tagliare",
    "Part name": "Nome pezzo",
    "Qty": "Qtà",
    "Remove": "Rimuovi",
    "Add part": "Aggiungi pezzo",
    "Optimize cut list": "Ottimizza lista tagli",
    "Stringer Calculator": "Calcolatore scala",
    "Stair dimensions": "Dimensioni scala",
    "Calculate stringer": "Calcola scala",
    "Risers": "Alzate",
    "Treads": "Pedate",
    "Riser height": "Altezza alzata",
    "Tread depth": "Profondità pedata"
  },
  ar: {
    "Skip to content": "تجاوز إلى المحتوى",
    "Download CutList": "تنزيل CutList",
    "Download CutList iOS": "تنزيل CutList iOS",
    "Download QuiltFit": "تنزيل QuiltFit",
    "Download QuiltFit iOS": "تنزيل QuiltFit iOS",
    "Home": "الرئيسية",
    "Sitemap": "خريطة الموقع",
    "Tile": "البلاط",
    "Stringer": "السلالم",
    "Open CutList": "فتح CutList",
    "No login required": "لا يلزم تسجيل الدخول",
    "No data uploaded": "لا يتم رفع البيانات",
    "Runs fully in browser": "يعمل بالكامل في المتصفح",
    "Choose the right tool": "اختر الأداة المناسبة",
    "Open CutList ->": "فتح CutList ->",
    "Open QuiltFit ->": "فتح QuiltFit ->",
    "Open Tile Calculator ->": "فتح حاسبة البلاط ->",
    "Open Stringer ->": "فتح حاسبة السلم ->",
    "QuiltFit Calculator": "حاسبة QuiltFit",
    "Quilt layout planner": "مخطط تصميم اللحاف",
    "Calculate quilt fit": "احسب مقاس اللحاف",
    "Finished quilt": "اللحاف النهائي",
    "Target width (in)": "العرض المطلوب (بوصة)",
    "Target length (in)": "الطول المطلوب (بوصة)",
    "Finished block (in)": "حجم البلوك النهائي (بوصة)",
    "Seam allowance (in)": "بدل الخياطة (بوصة)",
    "Fabric setup": "إعداد القماش",
    "Border width (in)": "عرض الحافة (بوصة)",
    "Backing overage per side (in)": "زيادة الخلفية لكل جانب (بوصة)",
    "Fabric width (in)": "عرض القماش (بوصة)",
    "Quilt results": "نتائج اللحاف",
    "Continue in QuiltFit": "المتابعة في QuiltFit",
    "Quilt fit result": "نتيجة QuiltFit",
    "Block layout": "تخطيط البلوكات",
    "Total blocks": "إجمالي البلوكات",
    "Finished top": "الوجه النهائي",
    "Cut block size": "حجم قص البلوك",
    "Pattern design": "تصميم النمط",
    "Fabric shopping list": "قائمة شراء القماش",
    "Visual cutting plan": "خطة قص مرئية",
    "Step-by-step sewing": "خياطة خطوة بخطوة",
    "Tile Calculator": "حاسبة البلاط",
    "Room size": "حجم الغرفة",
    "Waste allowance (%)": "نسبة الهدر (%)",
    "Calculate tile": "احسب البلاط",
    "Tile results": "نتائج البلاط",
    "Tiles to buy": "البلاط المطلوب",
    "Boxes required": "الصناديق المطلوبة",
    "Room area": "مساحة الغرفة",
    "Estimated tile cost": "التكلفة المقدرة",
    "CutList Calculator": "حاسبة CutList",
    "Stock board": "لوح خام",
    "Cut pieces": "قطع القص",
    "Part name": "اسم القطعة",
    "Qty": "الكمية",
    "Remove": "إزالة",
    "Add part": "إضافة قطعة",
    "Optimize cut list": "تحسين قائمة القص",
    "Stringer Calculator": "حاسبة السلم",
    "Stair dimensions": "أبعاد السلم",
    "Calculate stringer": "احسب السلم",
    "Risers": "القوائم",
    "Treads": "النائمات",
    "Riser height": "ارتفاع القائمة",
    "Tread depth": "عمق النائمة"
  },
  ja: {
    "Skip to content": "本文へ移動",
    "Download CutList": "CutList をダウンロード",
    "Download CutList iOS": "CutList iOS をダウンロード",
    "Download QuiltFit": "QuiltFit をダウンロード",
    "Download QuiltFit iOS": "QuiltFit iOS をダウンロード",
    "Home": "ホーム",
    "Sitemap": "サイトマップ",
    "Tile": "タイル",
    "Stringer": "階段",
    "Open CutList": "CutList を開く",
    "No login required": "ログイン不要",
    "No data uploaded": "データ送信なし",
    "Runs fully in browser": "ブラウザだけで動作",
    "Choose the right tool": "目的に合うツールを選択",
    "Open CutList ->": "CutList を開く ->",
    "Open QuiltFit ->": "QuiltFit を開く ->",
    "Open Tile Calculator ->": "タイル計算機を開く ->",
    "Open Stringer ->": "階段計算機を開く ->",
    "QuiltFit Calculator": "QuiltFit 計算機",
    "Quilt layout planner": "キルトレイアウトプランナー",
    "Calculate quilt fit": "キルトを計算",
    "Finished quilt": "完成キルト",
    "Target width (in)": "目標幅（インチ）",
    "Target length (in)": "目標長さ（インチ）",
    "Finished block (in)": "完成ブロック（インチ）",
    "Seam allowance (in)": "縫い代（インチ）",
    "Fabric setup": "生地設定",
    "Border width (in)": "ボーダー幅（インチ）",
    "Backing overage per side (in)": "各辺の裏布余裕（インチ）",
    "Fabric width (in)": "生地幅（インチ）",
    "Quilt results": "キルト結果",
    "Continue in QuiltFit": "QuiltFit で続ける",
    "Quilt fit result": "QuiltFit 結果",
    "Block layout": "ブロック配置",
    "Total blocks": "ブロック合計",
    "Finished top": "完成トップ",
    "Cut block size": "裁断ブロックサイズ",
    "Pattern design": "パターン設計",
    "Fabric shopping list": "生地買い物リスト",
    "Visual cutting plan": "視覚的な裁断計画",
    "Step-by-step sewing": "手順付き縫製",
    "Tile Calculator": "タイル計算機",
    "Room size": "部屋サイズ",
    "Waste allowance (%)": "余分率（%）",
    "Calculate tile": "タイルを計算",
    "Tile results": "タイル結果",
    "Tiles to buy": "購入タイル数",
    "Boxes required": "必要な箱数",
    "Room area": "部屋面積",
    "Estimated tile cost": "推定費用",
    "CutList Calculator": "CutList 計算機",
    "Stock board": "材料板",
    "Cut pieces": "切断部品",
    "Part name": "部品名",
    "Qty": "数量",
    "Remove": "削除",
    "Add part": "部品を追加",
    "Optimize cut list": "切断リストを最適化",
    "Stringer Calculator": "階段計算機",
    "Stair dimensions": "階段寸法",
    "Calculate stringer": "階段を計算",
    "Risers": "蹴上げ数",
    "Treads": "踏み面数",
    "Riser height": "蹴上げ高さ",
    "Tread depth": "踏み面奥行き"
  }
};

const supplementalTranslations = {
  "zh-CN": {
    "Language": "语言",
    "Static woodworking calculators. No login, no backend, no tracking database.": "静态木工计算器。无需登录、无后端、无跟踪数据库。"
  },
  "zh-TW": {
    "Language": "語言",
    "WoodCutTool helps cabinet makers, contractors, carpenters, and DIY builders plan cut lists instantly in the browser. No login, no upload, no CAD learning curve.": "WoodCutTool 幫助櫥櫃師傅、承包商、木匠和 DIY 使用者直接在瀏覽器中規劃切割清單。無需登入、無需上傳，也不用學 CAD。",
    "Save up to 20% material waste per project with a cleaner cut plan before you touch the saw.": "開鋸前先取得更清楚的切割方案，每個專案最多可減少 20% 材料浪費。",
    "Calculate material savings before the first cut.": "第一次切割前先計算材料節省。",
    "Optimize My Project": "最佳化我的專案",
    "Calculate Tile Material": "計算磁磚材料",
    "Start Saving Material Now": "立即開始節省材料",
    "Woodworking guides": "木工指南",
    "Learn how to reduce material waste.": "學習如何減少材料浪費。",
    "Read guide": "閱讀指南",
    "Static woodworking calculators. No login, no backend, no tracking database.": "靜態木工計算器。無需登入、無後端、無追蹤資料庫。"
  },
  es: {
    "Language": "Idioma",
    "WoodCutTool helps cabinet makers, contractors, carpenters, and DIY builders plan cut lists instantly in the browser. No login, no upload, no CAD learning curve.": "WoodCutTool ayuda a ebanistas, contratistas, carpinteros y aficionados a planificar listas de corte al instante en el navegador. Sin cuenta, sin cargas y sin curva de aprendizaje CAD.",
    "Save up to 20% material waste per project with a cleaner cut plan before you touch the saw.": "Ahorra hasta un 20% de material por proyecto con un plan de corte más limpio antes de usar la sierra.",
    "ROI preview": "Vista previa del ahorro",
    "Input -> output -> savings, before you buy plywood.": "Entrada -> salida -> ahorro, antes de comprar contrachapado.",
    "Input": "Entrada",
    "Output": "Salida",
    "Savings": "Ahorro",
    "Result": "Resultado",
    "Calculator result preview": "Vista previa del resultado",
    "This is what saving material looks like.": "Así se ve el ahorro de material.",
    "Calculate material savings before the first cut.": "Calcula el ahorro antes del primer corte.",
    "Start Saving Material Now": "Empieza a ahorrar material",
    "Woodworking guides": "Guías de carpintería",
    "Learn how to reduce material waste.": "Aprende a reducir desperdicio de material.",
    "Static woodworking calculators. No login, no backend, no tracking database.": "Calculadoras estáticas de carpintería. Sin login, sin backend y sin base de datos de seguimiento.",
    "Tile length (in)": "Largo del azulejo (in)",
    "Tile width (in)": "Ancho del azulejo (in)",
    "Box and cost": "Caja y coste",
    "Box coverage (ft²)": "Cobertura por caja (ft²)",
    "Price per box": "Precio por caja",
    "Board length (in)": "Largo de tabla (in)",
    "Board width (in)": "Ancho de tabla (in)",
    "Board thickness (in)": "Grosor (in)",
    "Saw kerf (in)": "Kerf de sierra (in)",
    "Length (in)": "Largo (in)",
    "Width (in)": "Ancho (in)",
    "Total rise (in)": "Altura total (in)",
    "Total run (in)": "Recorrido total (in)",
    "Max riser (in)": "Contrahuella máx. (in)",
    "Target tread (in)": "Huella objetivo (in)"
  },
  pt: {
    "Language": "Idioma",
    "Woodworking calculator for material savings": "Calculadora de marcenaria para economizar material",
    "Save plywood, reduce material cost, and eliminate waste before cutting.": "Economize compensado, reduza custos e elimine desperdício antes de cortar.",
    "WoodCutTool helps cabinet makers, contractors, carpenters, and DIY builders plan cut lists instantly in the browser. No login, no upload, no CAD learning curve.": "WoodCutTool ajuda marceneiros, empreiteiros, carpinteiros e usuários DIY a planejar listas de corte no navegador. Sem login, sem upload e sem curva de CAD.",
    "Save up to 20% material waste per project with a cleaner cut plan before you touch the saw.": "Economize até 20% de material por projeto com um plano de corte mais limpo antes de usar a serra.",
    "Stair Stringer Calculator": "Calculadora de escada",
    "Built for workshop use": "Feito para a oficina",
    "ROI preview": "Prévia de economia",
    "Input -> output -> savings, before you buy plywood.": "Entrada -> saída -> economia, antes de comprar compensado.",
    "Input": "Entrada",
    "Output": "Saída",
    "Savings": "Economia",
    "Result": "Resultado",
    "Calculator result preview": "Prévia do resultado",
    "This is what saving material looks like.": "É assim que a economia de material aparece.",
    "Minimize plywood waste instantly": "Reduza o desperdício de compensado",
    "Fit quilt blocks and backing": "Ajuste blocos e forro do quilt",
    "Estimate tile before ordering": "Estime azulejos antes de comprar",
    "Generate precise stair cuts instantly": "Gere cortes de escada precisos",
    "Calculate material savings before the first cut.": "Calcule a economia antes do primeiro corte.",
    "Optimize My Project": "Otimizar meu projeto",
    "Calculate Tile Material": "Calcular material de azulejo",
    "Start Saving Material Now": "Comece a economizar material",
    "Woodworking guides": "Guias de marcenaria",
    "Learn how to reduce material waste.": "Aprenda a reduzir desperdício de material.",
    "Static woodworking calculators. No login, no backend, no tracking database.": "Calculadoras estáticas de marcenaria. Sem login, sem backend e sem banco de rastreamento.",
    "Tile length (in)": "Comprimento do azulejo (pol)",
    "Tile width (in)": "Largura do azulejo (pol)",
    "Grout joint (in)": "Junta (pol)",
    "Box and cost": "Caixa e custo",
    "Box coverage (ft²)": "Cobertura por caixa (pés²)",
    "Price per box": "Preço por caixa",
    "Board length (in)": "Comprimento da tábua (pol)",
    "Board width (in)": "Largura da tábua (pol)",
    "Board thickness (in)": "Espessura da tábua (pol)",
    "Saw kerf (in)": "Espessura do corte (pol)",
    "Length (in)": "Comprimento (pol)",
    "Width (in)": "Largura (pol)",
    "Total rise (in)": "Altura total (pol)",
    "Total run (in)": "Avanço total (pol)",
    "Max riser (in)": "Espelho máximo (pol)",
    "Target tread (in)": "Pisada alvo (pol)"
  },
  fr: {
    "Language": "Langue",
    "Woodworking calculator for material savings": "Calculateur de menuiserie pour économiser du matériau",
    "Save plywood, reduce material cost, and eliminate waste before cutting.": "Économisez du contreplaqué, réduisez les coûts et limitez les chutes avant de couper.",
    "WoodCutTool helps cabinet makers, contractors, carpenters, and DIY builders plan cut lists instantly in the browser. No login, no upload, no CAD learning curve.": "WoodCutTool aide les menuisiers, entrepreneurs, charpentiers et bricoleurs à préparer des listes de coupe directement dans le navigateur. Aucun compte, aucun envoi, aucune formation CAD.",
    "Save up to 20% material waste per project with a cleaner cut plan before you touch the saw.": "Réduisez jusqu'à 20% de perte par projet avec un plan de coupe plus propre avant de scier.",
    "Stair Stringer Calculator": "Calculateur de limon d'escalier",
    "Built for workshop use": "Conçu pour l'atelier",
    "ROI preview": "Aperçu du gain",
    "Input -> output -> savings, before you buy plywood.": "Entrée -> sortie -> économies, avant d'acheter le contreplaqué.",
    "Input": "Entrée",
    "Output": "Sortie",
    "Savings": "Économies",
    "Result": "Résultat",
    "Calculator result preview": "Aperçu du résultat",
    "This is what saving material looks like.": "Voici à quoi ressemble l'économie de matériau.",
    "Minimize plywood waste instantly": "Réduire les chutes de contreplaqué",
    "Fit quilt blocks and backing": "Ajuster blocs et dos de quilt",
    "Estimate tile before ordering": "Estimer le carrelage avant commande",
    "Generate precise stair cuts instantly": "Générer des coupes d'escalier précises",
    "Calculate material savings before the first cut.": "Calculez les économies avant la première coupe.",
    "Optimize My Project": "Optimiser mon projet",
    "Calculate Tile Material": "Calculer le carrelage",
    "Start Saving Material Now": "Commencer à économiser",
    "Woodworking guides": "Guides de menuiserie",
    "Learn how to reduce material waste.": "Apprenez à réduire les chutes.",
    "Static woodworking calculators. No login, no backend, no tracking database.": "Calculateurs statiques de menuiserie. Aucun compte, aucun backend, aucune base de suivi.",
    "Room length (ft)": "Longueur de la pièce (ft)",
    "Room width (ft)": "Largeur de la pièce (ft)",
    "Tile length (in)": "Longueur du carreau (po)",
    "Tile width (in)": "Largeur du carreau (po)",
    "Grout joint (in)": "Joint (po)",
    "Box and cost": "Boîte et coût",
    "Box coverage (ft²)": "Couverture par boîte (ft²)",
    "Price per box": "Prix par boîte",
    "Board length (in)": "Longueur de planche (po)",
    "Board width (in)": "Largeur de planche (po)",
    "Board thickness (in)": "Épaisseur (po)",
    "Saw kerf (in)": "Trait de scie (po)",
    "Length (in)": "Longueur (po)",
    "Width (in)": "Largeur (po)",
    "Total rise (in)": "Hauteur totale (po)",
    "Total run (in)": "Reculement total (po)",
    "Max riser (in)": "Contremarche max. (po)",
    "Target tread (in)": "Marche cible (po)"
  },
  de: {
    "Language": "Sprache",
    "Woodworking calculator for material savings": "Holzrechner zum Materialsparen",
    "Save plywood, reduce material cost, and eliminate waste before cutting.": "Sparen Sie Sperrholz, senken Sie Materialkosten und vermeiden Sie Verschnitt vor dem Sägen.",
    "WoodCutTool helps cabinet makers, contractors, carpenters, and DIY builders plan cut lists instantly in the browser. No login, no upload, no CAD learning curve.": "WoodCutTool hilft Schreinern, Handwerkern und DIY-Bauern, Schnittlisten direkt im Browser zu planen. Ohne Login, Upload oder CAD-Einarbeitung.",
    "Save up to 20% material waste per project with a cleaner cut plan before you touch the saw.": "Sparen Sie pro Projekt bis zu 20% Material durch einen besseren Schnittplan vor dem Sägen.",
    "Stair Stringer Calculator": "Treppenwangen-Rechner",
    "Built for workshop use": "Für die Werkstatt gebaut",
    "ROI preview": "Ersparnis-Vorschau",
    "Input -> output -> savings, before you buy plywood.": "Eingabe -> Ausgabe -> Ersparnis, bevor Sie Sperrholz kaufen.",
    "Input": "Eingabe",
    "Output": "Ausgabe",
    "Savings": "Ersparnis",
    "Result": "Ergebnis",
    "Calculator result preview": "Ergebnisvorschau",
    "This is what saving material looks like.": "So sieht Materialersparnis aus.",
    "Minimize plywood waste instantly": "Sperrholzverschnitt reduzieren",
    "Fit quilt blocks and backing": "Quilt-Blöcke und Rückseite anpassen",
    "Estimate tile before ordering": "Fliesen vor der Bestellung schätzen",
    "Generate precise stair cuts instantly": "Präzise Treppenschnitte erzeugen",
    "Calculate material savings before the first cut.": "Berechnen Sie die Ersparnis vor dem ersten Schnitt.",
    "Optimize My Project": "Mein Projekt optimieren",
    "Calculate Tile Material": "Fliesenmaterial berechnen",
    "Start Saving Material Now": "Jetzt Material sparen",
    "Woodworking guides": "Holzbearbeitungs-Guides",
    "Learn how to reduce material waste.": "Lernen Sie, Verschnitt zu reduzieren.",
    "Static woodworking calculators. No login, no backend, no tracking database.": "Statische Holzrechner. Kein Login, kein Backend, keine Tracking-Datenbank.",
    "Room length (ft)": "Raumlänge (ft)",
    "Room width (ft)": "Raumbreite (ft)",
    "Tile length (in)": "Fliesenlänge (in)",
    "Tile width (in)": "Fliesenbreite (in)",
    "Grout joint (in)": "Fugenbreite (in)",
    "Box and cost": "Karton und Kosten",
    "Box coverage (ft²)": "Abdeckung pro Karton (ft²)",
    "Price per box": "Preis pro Karton",
    "Board length (in)": "Brettlänge (in)",
    "Board width (in)": "Brettbreite (in)",
    "Board thickness (in)": "Brettstärke (in)",
    "Saw kerf (in)": "Sägefuge (in)",
    "Length (in)": "Länge (in)",
    "Width (in)": "Breite (in)",
    "Total rise (in)": "Gesamthöhe (in)",
    "Total run (in)": "Gesamtlauf (in)",
    "Max riser (in)": "Max. Steigung (in)",
    "Target tread (in)": "Ziel-Auftritt (in)"
  },
  it: {
    "Language": "Lingua",
    "Woodworking calculator for material savings": "Calcolatore di falegnameria per risparmiare materiale",
    "Save plywood, reduce material cost, and eliminate waste before cutting.": "Risparmia compensato, riduci i costi e limita gli scarti prima del taglio.",
    "WoodCutTool helps cabinet makers, contractors, carpenters, and DIY builders plan cut lists instantly in the browser. No login, no upload, no CAD learning curve.": "WoodCutTool aiuta falegnami, imprese, carpentieri e utenti DIY a pianificare liste di taglio nel browser. Nessun login, nessun upload, nessuna curva CAD.",
    "Save up to 20% material waste per project with a cleaner cut plan before you touch the saw.": "Riduci fino al 20% di scarto per progetto con un piano di taglio più pulito prima di usare la sega.",
    "Stair Stringer Calculator": "Calcolatore cosciali scala",
    "Built for workshop use": "Pensato per l'officina",
    "ROI preview": "Anteprima risparmio",
    "Input -> output -> savings, before you buy plywood.": "Input -> output -> risparmio, prima di comprare compensato.",
    "Input": "Input",
    "Output": "Output",
    "Savings": "Risparmio",
    "Result": "Risultato",
    "Calculator result preview": "Anteprima risultato",
    "This is what saving material looks like.": "Ecco come appare il risparmio di materiale.",
    "Minimize plywood waste instantly": "Riduci lo scarto di compensato",
    "Fit quilt blocks and backing": "Adatta blocchi e retro del quilt",
    "Estimate tile before ordering": "Stima le piastrelle prima dell'ordine",
    "Generate precise stair cuts instantly": "Genera tagli scala precisi",
    "Calculate material savings before the first cut.": "Calcola il risparmio prima del primo taglio.",
    "Optimize My Project": "Ottimizza il progetto",
    "Calculate Tile Material": "Calcola materiale piastrelle",
    "Start Saving Material Now": "Inizia a risparmiare materiale",
    "Woodworking guides": "Guide di falegnameria",
    "Learn how to reduce material waste.": "Scopri come ridurre gli scarti.",
    "Static woodworking calculators. No login, no backend, no tracking database.": "Calcolatori statici di falegnameria. Nessun login, backend o database di tracciamento.",
    "Room length (ft)": "Lunghezza stanza (ft)",
    "Room width (ft)": "Larghezza stanza (ft)",
    "Tile length (in)": "Lunghezza piastrella (in)",
    "Tile width (in)": "Larghezza piastrella (in)",
    "Grout joint (in)": "Fuga (in)",
    "Box and cost": "Scatola e costo",
    "Box coverage (ft²)": "Copertura per scatola (ft²)",
    "Price per box": "Prezzo per scatola",
    "Board length (in)": "Lunghezza tavola (in)",
    "Board width (in)": "Larghezza tavola (in)",
    "Board thickness (in)": "Spessore tavola (in)",
    "Saw kerf (in)": "Kerf sega (in)",
    "Length (in)": "Lunghezza (in)",
    "Width (in)": "Larghezza (in)",
    "Total rise (in)": "Alzata totale (in)",
    "Total run (in)": "Sviluppo totale (in)",
    "Max riser (in)": "Alzata max (in)",
    "Target tread (in)": "Pedata target (in)"
  },
  ar: {
    "Language": "اللغة",
    "Woodworking calculator for material savings": "حاسبة نجارة لتوفير المواد",
    "Save plywood, reduce material cost, and eliminate waste before cutting.": "وفّر الخشب الرقائقي وقلّل التكلفة والهدر قبل القص.",
    "WoodCutTool helps cabinet makers, contractors, carpenters, and DIY builders plan cut lists instantly in the browser. No login, no upload, no CAD learning curve.": "يساعد WoodCutTool صناع الخزائن والمقاولين والنجارين والهواة على تخطيط قوائم القص داخل المتصفح. دون تسجيل دخول أو رفع ملفات أو تعلم CAD.",
    "Save up to 20% material waste per project with a cleaner cut plan before you touch the saw.": "قلّل هدر المواد حتى 20% في كل مشروع بخطة قص أوضح قبل استخدام المنشار.",
    "Stair Stringer Calculator": "حاسبة عارضة السلم",
    "Built for workshop use": "مصمم للاستخدام في الورشة",
    "ROI preview": "معاينة التوفير",
    "Input -> output -> savings, before you buy plywood.": "إدخال -> نتيجة -> توفير، قبل شراء الخشب الرقائقي.",
    "Input": "الإدخال",
    "Output": "النتيجة",
    "Savings": "التوفير",
    "Result": "النتيجة",
    "Calculator result preview": "معاينة نتيجة الحاسبة",
    "This is what saving material looks like.": "هكذا يبدو توفير المواد.",
    "Minimize plywood waste instantly": "قلّل هدر الخشب الرقائقي",
    "Fit quilt blocks and backing": "اضبط بلوكات اللحاف والخلفية",
    "Estimate tile before ordering": "قدّر البلاط قبل الطلب",
    "Generate precise stair cuts instantly": "أنشئ قصات سلم دقيقة",
    "Calculate material savings before the first cut.": "احسب التوفير قبل أول قص.",
    "Optimize My Project": "حسّن مشروعي",
    "Calculate Tile Material": "احسب مواد البلاط",
    "Start Saving Material Now": "ابدأ توفير المواد الآن",
    "Woodworking guides": "أدلة النجارة",
    "Learn how to reduce material waste.": "تعلّم كيف تقلّل هدر المواد.",
    "Static woodworking calculators. No login, no backend, no tracking database.": "حاسبات نجارة ثابتة. دون تسجيل دخول أو خادم أو قاعدة تتبع.",
    "Room length (ft)": "طول الغرفة (قدم)",
    "Room width (ft)": "عرض الغرفة (قدم)",
    "Tile length (in)": "طول البلاطة (بوصة)",
    "Tile width (in)": "عرض البلاطة (بوصة)",
    "Grout joint (in)": "فاصل الجبس (بوصة)",
    "Box and cost": "الصندوق والتكلفة",
    "Box coverage (ft²)": "تغطية الصندوق (قدم²)",
    "Price per box": "السعر لكل صندوق",
    "Board length (in)": "طول اللوح (بوصة)",
    "Board width (in)": "عرض اللوح (بوصة)",
    "Board thickness (in)": "سماكة اللوح (بوصة)",
    "Saw kerf (in)": "عرض قطع المنشار (بوصة)",
    "Length (in)": "الطول (بوصة)",
    "Width (in)": "العرض (بوصة)",
    "Total rise (in)": "الارتفاع الكلي (بوصة)",
    "Total run (in)": "الامتداد الكلي (بوصة)",
    "Max riser (in)": "أقصى قائمة (بوصة)",
    "Target tread (in)": "عمق النائمة المطلوب (بوصة)"
  },
  ja: {
    "Language": "言語",
    "Woodworking calculator for material savings": "材料を節約する木工計算機",
    "Save plywood, reduce material cost, and eliminate waste before cutting.": "切断前に合板を節約し、材料費と無駄を減らします。",
    "WoodCutTool helps cabinet makers, contractors, carpenters, and DIY builders plan cut lists instantly in the browser. No login, no upload, no CAD learning curve.": "WoodCutTool は家具職人、施工業者、大工、DIY ユーザーがブラウザ上で切断リストをすぐに作れるツールです。ログイン、アップロード、CAD 学習は不要です。",
    "Save up to 20% material waste per project with a cleaner cut plan before you touch the saw.": "のこぎりを使う前に整理された切断計画を作り、プロジェクトごとに最大 20% の材料ロスを削減できます。",
    "Stair Stringer Calculator": "階段ストリンガー計算機",
    "Built for workshop use": "作業場向けに設計",
    "ROI preview": "節約プレビュー",
    "Input -> output -> savings, before you buy plywood.": "合板を買う前に、入力 -> 出力 -> 節約を確認。",
    "Input": "入力",
    "Output": "出力",
    "Savings": "節約",
    "Result": "結果",
    "Calculator result preview": "計算結果プレビュー",
    "This is what saving material looks like.": "材料節約はこのように表示されます。",
    "Minimize plywood waste instantly": "合板の無駄をすばやく削減",
    "Fit quilt blocks and backing": "キルトブロックと裏布を調整",
    "Estimate tile before ordering": "注文前にタイルを見積もる",
    "Generate precise stair cuts instantly": "正確な階段カットを作成",
    "Calculate material savings before the first cut.": "最初のカット前に材料節約を計算。",
    "Optimize My Project": "プロジェクトを最適化",
    "Calculate Tile Material": "タイル材料を計算",
    "Start Saving Material Now": "今すぐ材料を節約",
    "Woodworking guides": "木工ガイド",
    "Learn how to reduce material waste.": "材料ロスを減らす方法を学ぶ。",
    "Static woodworking calculators. No login, no backend, no tracking database.": "静的な木工計算機。ログイン、バックエンド、追跡データベースはありません。",
    "Room length (ft)": "部屋の長さ（ft）",
    "Room width (ft)": "部屋の幅（ft）",
    "Tile length (in)": "タイル長さ（インチ）",
    "Tile width (in)": "タイル幅（インチ）",
    "Grout joint (in)": "目地幅（インチ）",
    "Box and cost": "箱と費用",
    "Box coverage (ft²)": "1箱の面積（ft²）",
    "Price per box": "1箱の価格",
    "Board length (in)": "板の長さ（インチ）",
    "Board width (in)": "板の幅（インチ）",
    "Board thickness (in)": "板の厚さ（インチ）",
    "Saw kerf (in)": "鋸刃幅（インチ）",
    "Length (in)": "長さ（インチ）",
    "Width (in)": "幅（インチ）",
    "Total rise (in)": "総高さ（インチ）",
    "Total run (in)": "総奥行き（インチ）",
    "Max riser (in)": "最大蹴上げ（インチ）",
    "Target tread (in)": "目標踏み面（インチ）"
  }
};

Object.entries(supplementalTranslations).forEach(([lang, values]) => {
  translations[lang] = { ...(translations[lang] || {}), ...values };
});

const homepageTranslations = {
  "zh-CN": {
    "WoodCutTool makes the material saving visible like a calculator result: stock sheets in, optimized layout out, dollars saved per job.": "WoodCutTool 像计算器结果一样展示材料节省：输入板材，输出优化布局，并显示每个项目可节省的成本。",
    "96 x 48 sheets, cabinet sides, shelves, dividers, and back panels.": "96 x 48 板材、橱柜侧板、搁板、隔板和背板。",
    "Parts packed into sheets with kerf accounted for and cleaner offcuts.": "零件已排入板材，并考虑锯缝，余料更整洁。",
    "18-25% waste reduction on a typical cabinet project.": "典型橱柜项目可减少 18-25% 的浪费。",
    "96 x 48 plywood sheet": "96 x 48 胶合板",
    "2 cabinet sides": "2 块橱柜侧板",
    "3 shelves": "3 块搁板",
    "1 back panel": "1 块背板",
    "1/8 in saw kerf": "1/8 英寸锯缝",
    "Side": "侧板",
    "Back": "背板",
    "Shelf": "搁板",
    "1 sheet": "1 张板",
    "instead of 2": "而不是 2 张",
    "waste reduction": "浪费减少",
    "saved per project": "每个项目节省",
    "Turn part sizes and quantities into a board-by-board cut list optimizer that shows what to cut first and what material remains.": "把零件尺寸和数量转换成逐板切割优化方案，清楚显示先切什么以及剩余材料。",
    "Calculate block rows, columns, cut sizes, backing fabric, batting size, and binding strips for a quilt layout.": "为被子布局计算方块行列、裁切尺寸、背布、铺棉尺寸和包边条。",
    "Convert room dimensions and tile size into tile count, waste allowance, boxes required, cost, and edge-cut planning.": "把房间尺寸和瓷砖尺寸转换为瓷砖数量、损耗预留、所需箱数、成本和边缘切割规划。",
    "Calculate risers, tread depth, stair angle, plumb cut angle, and stringer length for stair layout.": "为楼梯布局计算立板、踏面深度、楼梯角度、垂直切割角和楼梯梁长度。",
    "Real job scenario": "真实项目场景",
    "Kitchen cabinet project: 4 sheets planned, fewer sheets wasted.": "厨房橱柜项目：计划 4 张板，减少板材浪费。",
    "A cabinet run can burn money fast when layouts are guessed. WoodCutTool shows the material impact before the first sheet is broken down.": "橱柜项目如果靠猜布局，很容易快速烧钱。WoodCutTool 会在第一张板切开前显示材料影响。",
    "Before": "之前",
    "4 sheets purchased": "购买 4 张板",
    "Manual spreadsheet layout, repeated measurements, and safety stock added just in case.": "手动表格排版、重复测量，并额外加入保险库存。",
    "42% estimated waste exposure": "预计浪费风险 42%",
    "After": "之后",
    "3 sheets optimized": "优化为 3 张板",
    "Visual cut layout, cut sequence, and reusable offcuts instead of another full sheet.": "可视化切割布局、切割顺序和可复用余料，而不是再买一整张板。",
    "21% estimated waste, about $55 saved": "预计浪费 21%，约节省 55 美元",
    "Why different": "为什么不同",
    "Built for speed, not CAD complexity.": "为速度而建，而不是 CAD 复杂度。",
    "Spreadsheets are easy to mistype. CAD tools are powerful but slow for quick material planning. WoodCutTool is for the moment before you cut.": "电子表格容易输错。CAD 工具强大，但用于快速材料规划太慢。WoodCutTool 专为切割前那一刻设计。",
    "Spreadsheets": "电子表格",
    "Manual formulas and hidden mistakes.": "手动公式和隐藏错误。",
    "CAD tools": "CAD 工具",
    "Too much setup for a quick cut plan.": "做一个快速切割方案却需要太多设置。",
    "Instant layout, no learning curve.": "即时布局，无学习成本。",
    "Use cases": "使用场景",
    "For builders who care about every sheet.": "适合重视每一张板材的制作者。",
    "Cabinet shops": "橱柜工坊",
    "Pack panels and shelves before sheet breakdown.": "在开板前排布面板和搁板。",
    "Contractors": "承包商",
    "Estimate material needs before heading to the job site.": "去工地前估算材料需求。",
    "Furniture builders": "家具制作者",
    "Reduce expensive hardwood and plywood offcuts.": "减少昂贵硬木和胶合板余料。",
    "DIY users": "DIY 用户",
    "Plan clean cuts without learning CAD software.": "无需学习 CAD，也能规划清晰切割。",
    "Use WoodCutTool for fast browser planning, then save real projects in CutList for iPhone with offline support, PDF export, and project history.": "用 WoodCutTool 在浏览器中快速规划，然后在 iPhone 版 CutList 中保存真实项目，支持离线、PDF 导出和项目历史。",
    "Offline support in CutList": "CutList 离线支持",
    "PDF export": "PDF 导出",
    "Project saving": "项目保存",
    "Plywood Cutting Optimization": "胶合板切割优化",
    "How to reduce sheet waste with grain direction, kerf planning, and batching.": "了解如何通过纹理方向、锯缝规划和批量处理减少板材浪费。",
    "Stair Stringer Calculator Guide": "楼梯梁计算器指南",
    "Learn how total rise, tread count, and stair angle affect a safe layout.": "了解总升高、踏步数量和楼梯角度如何影响安全布局。",
    "Cut List Optimization Tips": "切割清单优化技巧",
    "Practical ways to group cuts, account for kerf, and preserve useful offcuts.": "实用方法：分组切割、考虑锯缝并保留有用余料。",
    "Take this plan to the shop with CutList for iPhone": "用 iPhone 版 CutList 把方案带到工作间",
    "Save projects offline, export PDF cut plans, and keep every board, sheet, and waste estimate organized while you build.": "离线保存项目、导出 PDF 切割方案，并在制作过程中管理每块板材和浪费估算。"
  },
  "zh-TW": {
    "WoodCutTool makes the material saving visible like a calculator result: stock sheets in, optimized layout out, dollars saved per job.": "WoodCutTool 像計算器結果一樣呈現材料節省：輸入板材，輸出最佳化布局，並顯示每個專案可節省的成本。",
    "96 x 48 sheets, cabinet sides, shelves, dividers, and back panels.": "96 x 48 板材、櫥櫃側板、層板、隔板和背板。",
    "Parts packed into sheets with kerf accounted for and cleaner offcuts.": "零件已排入板材，並考慮鋸縫，餘料更整潔。",
    "18-25% waste reduction on a typical cabinet project.": "典型櫥櫃專案可減少 18-25% 浪費。",
    "96 x 48 plywood sheet": "96 x 48 夾板",
    "2 cabinet sides": "2 塊櫥櫃側板",
    "3 shelves": "3 塊層板",
    "1 back panel": "1 塊背板",
    "1/8 in saw kerf": "1/8 英寸鋸縫",
    "Side": "側板",
    "Back": "背板",
    "Shelf": "層板",
    "1 sheet": "1 張板",
    "instead of 2": "而不是 2 張",
    "waste reduction": "浪費減少",
    "saved per project": "每個專案節省",
    "Turn part sizes and quantities into a board-by-board cut list optimizer that shows what to cut first and what material remains.": "把零件尺寸和數量轉成逐板切割最佳化方案，清楚顯示先切什麼以及剩餘材料。",
    "Calculate block rows, columns, cut sizes, backing fabric, batting size, and binding strips for a quilt layout.": "為拼布布局計算方塊行列、裁切尺寸、背布、鋪棉尺寸和包邊條。",
    "Convert room dimensions and tile size into tile count, waste allowance, boxes required, cost, and edge-cut planning.": "把房間尺寸和磁磚尺寸轉換為磁磚數量、損耗預留、所需箱數、成本和邊緣切割規劃。",
    "Calculate risers, tread depth, stair angle, plumb cut angle, and stringer length for stair layout.": "為樓梯布局計算立板、踏面深度、樓梯角度、垂直切割角和樓梯樑長度。",
    "Real job scenario": "真實專案場景",
    "Kitchen cabinet project: 4 sheets planned, fewer sheets wasted.": "廚房櫥櫃專案：計畫 4 張板，減少板材浪費。",
    "A cabinet run can burn money fast when layouts are guessed. WoodCutTool shows the material impact before the first sheet is broken down.": "櫥櫃專案如果靠猜布局，很容易快速燒錢。WoodCutTool 會在第一張板切開前顯示材料影響。",
    "Before": "之前",
    "4 sheets purchased": "購買 4 張板",
    "After": "之後",
    "3 sheets optimized": "最佳化為 3 張板",
    "Why different": "為什麼不同",
    "Built for speed, not CAD complexity.": "為速度而建，而不是 CAD 複雜度。",
    "Use cases": "使用場景",
    "For builders who care about every sheet.": "適合重視每一張板材的製作者。",
    "Cabinet shops": "櫥櫃工坊",
    "Contractors": "承包商",
    "Furniture builders": "家具製作者",
    "DIY users": "DIY 使用者",
    "Plywood Cutting Optimization": "夾板切割最佳化",
    "Stair Stringer Calculator Guide": "樓梯樑計算器指南",
    "Cut List Optimization Tips": "切割清單最佳化技巧"
  },
  es: {
    "96 x 48 sheets, cabinet sides, shelves, dividers, and back panels.": "Tableros de 96 x 48, laterales de gabinete, estantes, divisores y paneles traseros.",
    "Parts packed into sheets with kerf accounted for and cleaner offcuts.": "Piezas acomodadas en tableros con kerf incluido y recortes más limpios.",
    "18-25% waste reduction on a typical cabinet project.": "Reducción de desperdicio del 18-25% en un proyecto típico de gabinetes.",
    "96 x 48 plywood sheet": "Tablero contrachapado 96 x 48",
    "2 cabinet sides": "2 laterales de gabinete",
    "3 shelves": "3 estantes",
    "1 back panel": "1 panel trasero",
    "1/8 in saw kerf": "Kerf de sierra de 1/8 in",
    "Side": "Lateral",
    "Back": "Trasero",
    "Shelf": "Estante",
    "1 sheet": "1 tablero",
    "instead of 2": "en vez de 2",
    "waste reduction": "menos desperdicio",
    "saved per project": "ahorrado por proyecto",
    "Turn part sizes and quantities into a board-by-board cut list optimizer that shows what to cut first and what material remains.": "Convierte tamaños y cantidades en un optimizador de cortes por tablero que muestra qué cortar primero y qué material queda.",
    "Calculate block rows, columns, cut sizes, backing fabric, batting size, and binding strips for a quilt layout.": "Calcula filas, columnas, tamaños de corte, tela trasera, guata y tiras de borde para un quilt.",
    "Convert room dimensions and tile size into tile count, waste allowance, boxes required, cost, and edge-cut planning.": "Convierte dimensiones de habitación y azulejo en cantidad, merma, cajas, coste y cortes de borde.",
    "Calculate risers, tread depth, stair angle, plumb cut angle, and stringer length for stair layout.": "Calcula contrahuellas, huella, ángulo, corte a plomo y longitud de zanca.",
    "Real job scenario": "Escenario real",
    "Kitchen cabinet project: 4 sheets planned, fewer sheets wasted.": "Proyecto de cocina: 4 tableros previstos, menos desperdicio.",
    "A cabinet run can burn money fast when layouts are guessed. WoodCutTool shows the material impact before the first sheet is broken down.": "Un proyecto de gabinetes puede gastar dinero rápido si se adivina el diseño. WoodCutTool muestra el impacto antes de cortar el primer tablero.",
    "Before": "Antes",
    "4 sheets purchased": "4 tableros comprados",
    "Manual spreadsheet layout, repeated measurements, and safety stock added just in case.": "Diseño manual en hoja de cálculo, medidas repetidas y material extra por seguridad.",
    "After": "Después",
    "3 sheets optimized": "3 tableros optimizados",
    "Why different": "Por qué es diferente",
    "Built for speed, not CAD complexity.": "Hecho para rapidez, no para complejidad CAD.",
    "Use cases": "Casos de uso",
    "For builders who care about every sheet.": "Para constructores que cuidan cada tablero.",
    "Cabinet shops": "Talleres de gabinetes",
    "Contractors": "Contratistas",
    "Furniture builders": "Fabricantes de muebles",
    "DIY users": "Usuarios DIY",
    "Plywood Cutting Optimization": "Optimización de corte de contrachapado",
    "Stair Stringer Calculator Guide": "Guía de calculadora de zancas",
    "Cut List Optimization Tips": "Consejos para optimizar listas de corte"
  },
  pt: {
    "96 x 48 sheets, cabinet sides, shelves, dividers, and back panels.": "Chapas 96 x 48, laterais de armário, prateleiras, divisórias e fundos.",
    "Parts packed into sheets with kerf accounted for and cleaner offcuts.": "Peças encaixadas nas chapas com corte considerado e sobras mais limpas.",
    "18-25% waste reduction on a typical cabinet project.": "Redução de 18-25% de desperdício em um projeto típico de armários.",
    "96 x 48 plywood sheet": "Chapa de compensado 96 x 48",
    "2 cabinet sides": "2 laterais de armário",
    "3 shelves": "3 prateleiras",
    "1 back panel": "1 painel traseiro",
    "1/8 in saw kerf": "Corte de serra de 1/8 pol",
    "Side": "Lateral",
    "Back": "Fundo",
    "Shelf": "Prateleira",
    "1 sheet": "1 chapa",
    "instead of 2": "em vez de 2",
    "waste reduction": "redução de desperdício",
    "saved per project": "economizado por projeto",
    "Real job scenario": "Cenário real",
    "Kitchen cabinet project: 4 sheets planned, fewer sheets wasted.": "Projeto de cozinha: 4 chapas planejadas, menos desperdício.",
    "Before": "Antes",
    "After": "Depois",
    "Why different": "Por que é diferente",
    "Use cases": "Casos de uso",
    "For builders who care about every sheet.": "Para quem se importa com cada chapa.",
    "Cabinet shops": "Marcenarias",
    "Contractors": "Empreiteiros",
    "Furniture builders": "Fabricantes de móveis",
    "DIY users": "Usuários DIY",
    "Plywood Cutting Optimization": "Otimização de corte de compensado",
    "Stair Stringer Calculator Guide": "Guia da calculadora de escada",
    "Cut List Optimization Tips": "Dicas de otimização de lista de corte"
  },
  fr: {
    "96 x 48 sheets, cabinet sides, shelves, dividers, and back panels.": "Panneaux 96 x 48, côtés de meuble, étagères, séparateurs et fonds.",
    "Parts packed into sheets with kerf accounted for and cleaner offcuts.": "Pièces placées sur les panneaux avec le trait de scie et des chutes plus propres.",
    "18-25% waste reduction on a typical cabinet project.": "Réduction de 18-25% des chutes sur un projet de meuble typique.",
    "96 x 48 plywood sheet": "Panneau contreplaqué 96 x 48",
    "2 cabinet sides": "2 côtés de meuble",
    "3 shelves": "3 étagères",
    "1 back panel": "1 fond",
    "1/8 in saw kerf": "Trait de scie 1/8 po",
    "Side": "Côté",
    "Back": "Fond",
    "Shelf": "Étagère",
    "1 sheet": "1 panneau",
    "instead of 2": "au lieu de 2",
    "waste reduction": "réduction des chutes",
    "saved per project": "économisés par projet",
    "Real job scenario": "Scénario réel",
    "Kitchen cabinet project: 4 sheets planned, fewer sheets wasted.": "Projet de cuisine : 4 panneaux prévus, moins de chutes.",
    "Before": "Avant",
    "After": "Après",
    "Why different": "Pourquoi différent",
    "Use cases": "Cas d'utilisation",
    "For builders who care about every sheet.": "Pour ceux qui comptent chaque panneau.",
    "Cabinet shops": "Ateliers de meubles",
    "Contractors": "Entrepreneurs",
    "Furniture builders": "Fabricants de meubles",
    "DIY users": "Bricoleurs",
    "Plywood Cutting Optimization": "Optimisation de coupe du contreplaqué",
    "Stair Stringer Calculator Guide": "Guide du calculateur de limon",
    "Cut List Optimization Tips": "Conseils d'optimisation de coupe"
  },
  de: {
    "96 x 48 sheets, cabinet sides, shelves, dividers, and back panels.": "96 x 48 Platten, Schrankseiten, Böden, Trennwände und Rückwände.",
    "Parts packed into sheets with kerf accounted for and cleaner offcuts.": "Teile auf Platten verteilt, Sägefuge berücksichtigt und sauberere Reste.",
    "18-25% waste reduction on a typical cabinet project.": "18-25% weniger Verschnitt bei einem typischen Schrankprojekt.",
    "96 x 48 plywood sheet": "96 x 48 Sperrholzplatte",
    "2 cabinet sides": "2 Schrankseiten",
    "3 shelves": "3 Böden",
    "1 back panel": "1 Rückwand",
    "1/8 in saw kerf": "1/8 in Sägefuge",
    "Side": "Seite",
    "Back": "Rückwand",
    "Shelf": "Boden",
    "1 sheet": "1 Platte",
    "instead of 2": "statt 2",
    "waste reduction": "weniger Verschnitt",
    "saved per project": "pro Projekt gespart",
    "Real job scenario": "Praxisbeispiel",
    "Kitchen cabinet project: 4 sheets planned, fewer sheets wasted.": "Küchenschrankprojekt: 4 Platten geplant, weniger verschwendet.",
    "Before": "Vorher",
    "After": "Nachher",
    "Why different": "Warum anders",
    "Use cases": "Anwendungsfälle",
    "For builders who care about every sheet.": "Für alle, die jede Platte ernst nehmen.",
    "Cabinet shops": "Schreinereien",
    "Contractors": "Auftragnehmer",
    "Furniture builders": "Möbelbauer",
    "DIY users": "DIY-Nutzer",
    "Plywood Cutting Optimization": "Sperrholz-Zuschnitt optimieren",
    "Stair Stringer Calculator Guide": "Treppenwangen-Rechner Guide",
    "Cut List Optimization Tips": "Tipps zur Schnittlisten-Optimierung"
  },
  it: {
    "96 x 48 sheets, cabinet sides, shelves, dividers, and back panels.": "Pannelli 96 x 48, fianchi, ripiani, divisori e schienali.",
    "Parts packed into sheets with kerf accounted for and cleaner offcuts.": "Pezzi disposti nei pannelli con kerf incluso e scarti più ordinati.",
    "18-25% waste reduction on a typical cabinet project.": "Riduzione scarti del 18-25% in un tipico progetto di mobili.",
    "96 x 48 plywood sheet": "Pannello compensato 96 x 48",
    "2 cabinet sides": "2 fianchi",
    "3 shelves": "3 ripiani",
    "1 back panel": "1 schienale",
    "1/8 in saw kerf": "Kerf sega 1/8 in",
    "Side": "Fianco",
    "Back": "Schienale",
    "Shelf": "Ripiano",
    "1 sheet": "1 pannello",
    "instead of 2": "invece di 2",
    "waste reduction": "riduzione scarti",
    "saved per project": "risparmiati per progetto",
    "Real job scenario": "Scenario reale",
    "Kitchen cabinet project: 4 sheets planned, fewer sheets wasted.": "Progetto cucina: 4 pannelli previsti, meno scarti.",
    "Before": "Prima",
    "After": "Dopo",
    "Why different": "Perché diverso",
    "Use cases": "Casi d'uso",
    "For builders who care about every sheet.": "Per chi dà valore a ogni pannello.",
    "Cabinet shops": "Falegnamerie",
    "Contractors": "Imprese",
    "Furniture builders": "Mobilieri",
    "DIY users": "Utenti DIY",
    "Plywood Cutting Optimization": "Ottimizzazione taglio compensato",
    "Stair Stringer Calculator Guide": "Guida calcolatore scala",
    "Cut List Optimization Tips": "Consigli per ottimizzare i tagli"
  },
  ar: {
    "96 x 48 sheets, cabinet sides, shelves, dividers, and back panels.": "ألواح 96 x 48، جوانب خزائن، رفوف، فواصل وألواح خلفية.",
    "Parts packed into sheets with kerf accounted for and cleaner offcuts.": "تم ترتيب القطع مع حساب عرض المنشار وبقايا أنظف.",
    "18-25% waste reduction on a typical cabinet project.": "تقليل الهدر 18-25% في مشروع خزائن نموذجي.",
    "96 x 48 plywood sheet": "لوح خشب رقائقي 96 x 48",
    "2 cabinet sides": "جانبان للخزانة",
    "3 shelves": "3 رفوف",
    "1 back panel": "لوح خلفي واحد",
    "1/8 in saw kerf": "عرض منشار 1/8 بوصة",
    "Side": "جانب",
    "Back": "خلفية",
    "Shelf": "رف",
    "1 sheet": "لوح واحد",
    "instead of 2": "بدلاً من 2",
    "waste reduction": "تقليل الهدر",
    "saved per project": "توفير لكل مشروع",
    "Real job scenario": "سيناريو عمل حقيقي",
    "Kitchen cabinet project: 4 sheets planned, fewer sheets wasted.": "مشروع خزائن مطبخ: 4 ألواح مخططة وهدر أقل.",
    "Before": "قبل",
    "After": "بعد",
    "Why different": "لماذا يختلف",
    "Use cases": "حالات الاستخدام",
    "For builders who care about every sheet.": "لمن يهتم بكل لوح.",
    "Cabinet shops": "ورش الخزائن",
    "Contractors": "المقاولون",
    "Furniture builders": "صناع الأثاث",
    "DIY users": "مستخدمو DIY",
    "Plywood Cutting Optimization": "تحسين قص الخشب الرقائقي",
    "Stair Stringer Calculator Guide": "دليل حاسبة السلم",
    "Cut List Optimization Tips": "نصائح تحسين قائمة القص"
  },
  ja: {
    "96 x 48 sheets, cabinet sides, shelves, dividers, and back panels.": "96 x 48 の板、キャビネット側板、棚板、仕切り、背板。",
    "Parts packed into sheets with kerf accounted for and cleaner offcuts.": "鋸刃幅を考慮して部品を配置し、余材を整理します。",
    "18-25% waste reduction on a typical cabinet project.": "一般的なキャビネット案件で 18-25% のロス削減。",
    "96 x 48 plywood sheet": "96 x 48 合板",
    "2 cabinet sides": "キャビネット側板 2 枚",
    "3 shelves": "棚板 3 枚",
    "1 back panel": "背板 1 枚",
    "1/8 in saw kerf": "1/8 インチの鋸刃幅",
    "Side": "側板",
    "Back": "背板",
    "Shelf": "棚板",
    "1 sheet": "1 枚",
    "instead of 2": "2 枚ではなく",
    "waste reduction": "ロス削減",
    "saved per project": "案件ごとの節約",
    "Real job scenario": "実際の案件例",
    "Kitchen cabinet project: 4 sheets planned, fewer sheets wasted.": "キッチンキャビネット案件：4 枚予定から無駄を削減。",
    "Before": "前",
    "After": "後",
    "Why different": "違い",
    "Use cases": "用途",
    "For builders who care about every sheet.": "1 枚ごとを大切にする制作者向け。",
    "Cabinet shops": "キャビネット工房",
    "Contractors": "施工業者",
    "Furniture builders": "家具制作者",
    "DIY users": "DIY ユーザー",
    "Plywood Cutting Optimization": "合板切断の最適化",
    "Stair Stringer Calculator Guide": "階段ストリンガー計算ガイド",
    "Cut List Optimization Tips": "切断リスト最適化のヒント"
  }
};

Object.entries(homepageTranslations).forEach(([lang, values]) => {
  translations[lang] = { ...(translations[lang] || {}), ...values };
});

const subpageTranslations = {
  "zh-CN": {
    "/ CutList Calculator": "/ CutList 计算器",
    "/ QuiltFit Calculator": "/ QuiltFit 计算器",
    "/ Tile Calculator": "/ 瓷砖计算器",
    "/ Stringer Calculator": "/ 楼梯梁计算器",
    "Calculate a board-by-board cutting plan from stock dimensions, part sizes, quantities, and saw kerf. The optimizer runs in your browser with no server dependency.": "根据原料尺寸、零件尺寸、数量和锯缝计算逐板切割方案。优化器直接在浏览器中运行，不依赖服务器。",
    "Enter your pieces and run the calculator to see boards required, cut sequence, and waste percentage.": "输入零件并运行计算器，即可查看所需板材、切割顺序和浪费比例。",
    "Plan quilt block counts, backing, batting, and binding.": "规划被子方块数量、背布、铺棉和包边。",
    "Open QuiltFit": "打开 QuiltFit",
    "Tile calculator": "瓷砖计算器",
    "Estimate tile count, boxes, waste, and material cost.": "估算瓷砖数量、箱数、损耗和材料成本。",
    "Open tile calculator": "打开瓷砖计算器",
    "Stringer calculator": "楼梯梁计算器",
    "Calculate stair risers, treads, angle, and stringer length.": "计算楼梯立板、踏步、角度和楼梯梁长度。",
    "Open stringer": "打开楼梯梁计算器",
    "Fast static calculators for planning before you cut.": "用于切割前规划的快速静态计算器。",
    "Design quilt patterns": "设计被子图案",
    "Optimize boards and parts for workshop projects.": "为工作间项目优化板材和零件。",
    "Estimate boxes and waste for floor or wall tile.": "估算地面或墙面瓷砖的箱数和损耗。",
    "Calculate stair layout from rise and run.": "根据升高和进深计算楼梯布局。",
    "Static calculators for layout, cutting, and material planning.": "用于布局、切割和材料规划的静态计算器。",
    "Estimate how many tiles and boxes to buy from room size, tile size, grout joint, waste allowance, box coverage, and price per box.": "根据房间尺寸、瓷砖尺寸、缝宽、损耗预留、每箱覆盖面积和每箱价格，估算要购买的瓷砖和箱数。",
    "Run the calculator to see tiles to buy, boxes required, material coverage, cost, and a simple layout preview.": "运行计算器即可查看需购买瓷砖、所需箱数、材料覆盖面积、成本和简单布局预览。",
    "Plan board cuts and waste before cutting material.": "切割材料前先规划板材切割和浪费。",
    "Fit blocks, backing, batting, and binding for quilt planning.": "为被子规划匹配方块、背布、铺棉和包边。",
    "Calculate stair risers, treads, angles, and stringer length.": "计算楼梯立板、踏步、角度和楼梯梁长度。",
    "Calculate riser count, riser height, tread depth, stair angle, plumb cut angle, and approximate stringer length from total rise and run.": "根据总升高和总进深计算立板数量、立板高度、踏面深度、楼梯角度、垂直切割角和近似楼梯梁长度。",
    "Run the calculator to get riser height, tread depth, number of steps, and cutting angles.": "运行计算器即可获得立板高度、踏面深度、台阶数量和切割角度。",
    "Optimize straight board cuts before buying lumber.": "购买木材前先优化直板切割。",
    "Estimate floor tile count, boxes, and waste.": "估算地砖数量、箱数和损耗。",
    "Calculate quilt blocks, backing, batting, and binding.": "计算被子方块、背布、铺棉和包边。",
    "Static stair and material calculators for quick planning.": "用于快速规划的静态楼梯和材料计算器。",
    "Backing size": "背布尺寸",
    "Backing fabric": "背布用量",
    "Batting size": "铺棉尺寸",
    "Binding": "包边",
    "Field layout": "铺贴布局",
    "Base tile count": "基础瓷砖数量",
    "Coverage to buy": "需购买覆盖面积",
    "Likely perimeter cuts": "可能的边缘切割",
    "Stair angle": "楼梯角度",
    "Plumb cut angle": "垂直切割角",
    "Approximate stringer length": "近似楼梯梁长度",
    "Total run": "总进深",
    "Take this plan to the shop with CutList for iPhone": "用 iPhone 版 CutList 把方案带到工作间",
    "Offline support": "离线支持",
    "in with": "英寸，",
    "in overage on each side.": "英寸每边余量。",
    "about": "约",
    "yards using": "码，使用",
    "panel": "幅",
    "panels": "幅",
    "of": "",
    "in fabric.": "英寸布料。",
    "in.": "英寸。",
    "tiles by": "块乘",
    "tiles before waste allowance.": "块，未计损耗。",
    "tiles, plus": "块，加上",
    "waste and breakage allowance.": "损耗和破损预留。",
    "ft² based on": "平方英尺，基于每块",
    "ft² per tile.": "平方英尺。",
    "edge tiles need checking against the room shape.": "块边缘瓷砖需要按房间形状确认。",
    "degrees from level.": "度（相对水平）。",
    "degrees from the stringer edge.": "度（相对楼梯梁边缘）。",
    "in before end cuts.": "英寸，未计端部切割。",
    "Always confirm local building requirements before cutting.": "切割前请务必确认当地建筑规范。",
    "binding strips across width of fabric.": "条横幅包边条。",
    "Check local code: riser height is above 7.75 in.": "请检查当地规范：立板高度超过 7.75 英寸。",
    "Riser height is within the common 7.75 in residential maximum.": "立板高度在常见住宅 7.75 英寸上限以内。"
  },
  "zh-TW": {
    "/ CutList Calculator": "/ CutList 計算器",
    "/ QuiltFit Calculator": "/ QuiltFit 計算器",
    "/ Tile Calculator": "/ 磁磚計算器",
    "/ Stringer Calculator": "/ 樓梯樑計算器",
    "Open QuiltFit": "開啟 QuiltFit",
    "Tile calculator": "磁磚計算器",
    "Open tile calculator": "開啟磁磚計算器",
    "Stringer calculator": "樓梯樑計算器",
    "Open stringer": "開啟樓梯樑計算器",
    "Backing size": "背布尺寸",
    "Backing fabric": "背布用量",
    "Batting size": "鋪棉尺寸",
    "Binding": "包邊",
    "Field layout": "鋪貼布局",
    "Base tile count": "基礎磁磚數量",
    "Coverage to buy": "需購買覆蓋面積",
    "Likely perimeter cuts": "可能的邊緣切割",
    "Stair angle": "樓梯角度",
    "Plumb cut angle": "垂直切割角",
    "Approximate stringer length": "近似樓梯樑長度",
    "Total run": "總進深",
    "Offline support": "離線支援"
  },
  es: {
    "Open QuiltFit": "Abrir QuiltFit",
    "Tile calculator": "Calculadora de azulejos",
    "Open tile calculator": "Abrir calculadora de azulejos",
    "Stringer calculator": "Calculadora de zancas",
    "Open stringer": "Abrir zancas",
    "Backing size": "Tamaño del reverso",
    "Backing fabric": "Tela de reverso",
    "Batting size": "Tamaño de guata",
    "Binding": "Borde",
    "Field layout": "Distribución",
    "Base tile count": "Cantidad base",
    "Coverage to buy": "Cobertura a comprar",
    "Likely perimeter cuts": "Cortes de perímetro",
    "Stair angle": "Ángulo de escalera",
    "Plumb cut angle": "Ángulo de corte a plomo",
    "Approximate stringer length": "Longitud aproximada de zanca",
    "Total run": "Recorrido total",
    "Offline support": "Soporte sin conexión"
  },
  pt: {
    "Open QuiltFit": "Abrir QuiltFit",
    "Tile calculator": "Calculadora de azulejos",
    "Open tile calculator": "Abrir calculadora de azulejos",
    "Stringer calculator": "Calculadora de escada",
    "Open stringer": "Abrir escada",
    "Backing size": "Tamanho do forro",
    "Backing fabric": "Tecido de forro",
    "Batting size": "Tamanho da manta",
    "Binding": "Acabamento",
    "Field layout": "Layout do piso",
    "Base tile count": "Quantidade base",
    "Coverage to buy": "Cobertura a comprar",
    "Likely perimeter cuts": "Cortes de borda",
    "Stair angle": "Ângulo da escada",
    "Plumb cut angle": "Ângulo de corte",
    "Approximate stringer length": "Comprimento aproximado",
    "Total run": "Avanço total",
    "Offline support": "Suporte offline"
  },
  fr: {
    "Open QuiltFit": "Ouvrir QuiltFit",
    "Tile calculator": "Calculateur de carrelage",
    "Open tile calculator": "Ouvrir le calculateur de carrelage",
    "Stringer calculator": "Calculateur de limon",
    "Open stringer": "Ouvrir le limon",
    "Backing size": "Taille du dos",
    "Backing fabric": "Tissu de dos",
    "Batting size": "Taille du molleton",
    "Binding": "Bordure",
    "Field layout": "Disposition",
    "Base tile count": "Nombre de base",
    "Coverage to buy": "Surface à acheter",
    "Likely perimeter cuts": "Coupes de bord probables",
    "Stair angle": "Angle d'escalier",
    "Plumb cut angle": "Angle de coupe d'aplomb",
    "Approximate stringer length": "Longueur approximative du limon",
    "Total run": "Reculement total",
    "Offline support": "Mode hors ligne"
  },
  de: {
    "Open QuiltFit": "QuiltFit öffnen",
    "Tile calculator": "Fliesenrechner",
    "Open tile calculator": "Fliesenrechner öffnen",
    "Stringer calculator": "Treppenwangen-Rechner",
    "Open stringer": "Treppenrechner öffnen",
    "Backing size": "Rückseitengröße",
    "Backing fabric": "Rückseitenstoff",
    "Batting size": "Vliesgröße",
    "Binding": "Einfassung",
    "Field layout": "Feldlayout",
    "Base tile count": "Basis-Fliesenzahl",
    "Coverage to buy": "Zu kaufende Fläche",
    "Likely perimeter cuts": "Voraussichtliche Randzuschnitte",
    "Stair angle": "Treppenwinkel",
    "Plumb cut angle": "Lot-Schnittwinkel",
    "Approximate stringer length": "Ungefähre Wangenlänge",
    "Total run": "Gesamtlauf",
    "Offline support": "Offline-Unterstützung"
  },
  it: {
    "Open QuiltFit": "Apri QuiltFit",
    "Tile calculator": "Calcolatore piastrelle",
    "Open tile calculator": "Apri calcolatore piastrelle",
    "Stringer calculator": "Calcolatore scala",
    "Open stringer": "Apri scala",
    "Backing size": "Dimensione retro",
    "Backing fabric": "Tessuto retro",
    "Batting size": "Dimensione imbottitura",
    "Binding": "Bordo",
    "Field layout": "Layout posa",
    "Base tile count": "Conteggio base",
    "Coverage to buy": "Copertura da acquistare",
    "Likely perimeter cuts": "Tagli perimetrali probabili",
    "Stair angle": "Angolo scala",
    "Plumb cut angle": "Angolo taglio a piombo",
    "Approximate stringer length": "Lunghezza approssimativa",
    "Total run": "Sviluppo totale",
    "Offline support": "Supporto offline"
  },
  ar: {
    "Open QuiltFit": "فتح QuiltFit",
    "Tile calculator": "حاسبة البلاط",
    "Open tile calculator": "فتح حاسبة البلاط",
    "Stringer calculator": "حاسبة السلم",
    "Open stringer": "فتح السلم",
    "Backing size": "حجم الخلفية",
    "Backing fabric": "قماش الخلفية",
    "Batting size": "حجم الحشوة",
    "Binding": "الحافة",
    "Field layout": "تخطيط البلاط",
    "Base tile count": "عدد البلاط الأساسي",
    "Coverage to buy": "المساحة للشراء",
    "Likely perimeter cuts": "قصات الحواف المحتملة",
    "Stair angle": "زاوية السلم",
    "Plumb cut angle": "زاوية القطع العمودي",
    "Approximate stringer length": "طول العارضة التقريبي",
    "Total run": "الامتداد الكلي",
    "Offline support": "دعم دون اتصال"
  },
  ja: {
    "Open QuiltFit": "QuiltFit を開く",
    "Tile calculator": "タイル計算機",
    "Open tile calculator": "タイル計算機を開く",
    "Stringer calculator": "階段計算機",
    "Open stringer": "階段計算機を開く",
    "Backing size": "裏布サイズ",
    "Backing fabric": "裏布",
    "Batting size": "キルト綿サイズ",
    "Binding": "バインディング",
    "Field layout": "配置",
    "Base tile count": "基本タイル数",
    "Coverage to buy": "購入する面積",
    "Likely perimeter cuts": "周辺カット候補",
    "Stair angle": "階段角度",
    "Plumb cut angle": "垂直カット角度",
    "Approximate stringer length": "概算ストリンガー長",
    "Total run": "総奥行き",
    "Offline support": "オフライン対応"
  }
};

Object.entries(subpageTranslations).forEach(([lang, values]) => {
  translations[lang] = { ...(translations[lang] || {}), ...values };
});

const legalTranslations = {
  "zh-CN": {
    "Privacy Policy": "隐私政策",
    "Terms of Service": "服务条款",
    "Contact Email": "联系邮箱",
    "/ Privacy Policy": "/ 隐私政策",
    "/ Terms of Service": "/ 服务条款",
    "Legal": "法律信息",
    "WoodCutTool provides browser-based calculators for layout, cutting, and material planning.": "WoodCutTool 提供基于浏览器的布局、切割和材料规划计算器。",
    "Information we collect": "我们收集的信息",
    "WoodCutTool does not require an account and does not ask you to upload project files. Calculator inputs are processed in your browser for the purpose of showing results.": "WoodCutTool 不要求创建账号，也不会要求你上传项目文件。计算器输入会在你的浏览器中处理，用于显示计算结果。",
    "Contact email": "联系邮箱",
    "If you contact us by email, we may use your email address and message only to respond to your request.": "如果你通过邮件联系我们，我们只会使用你的邮箱地址和邮件内容来回复你的请求。",
    "Third-party links": "第三方链接",
    "Some pages link to App Store product pages. Those external services are governed by their own privacy policies.": "部分页面会链接到 App Store 产品页。这些外部服务适用其自身的隐私政策。",
    "Changes": "变更",
    "We may update this policy as the site changes. The current version is published on this page.": "我们可能会随着网站变化更新本政策。当前版本会发布在本页面。",
    "Contact": "联系",
    "Email:": "邮箱：",
    "By using WoodCutTool, you agree to use the calculators as planning aids and to verify results before cutting or purchasing materials.": "使用 WoodCutTool 即表示你同意将计算器作为规划辅助工具，并在切割或购买材料前自行核对结果。",
    "Use of calculators": "计算器使用",
    "WoodCutTool results are estimates. You are responsible for checking measurements, local building requirements, material conditions, tool setup, and safety practices before acting on any result.": "WoodCutTool 的结果为估算值。在根据结果行动前，你需要自行检查尺寸、当地建筑要求、材料状态、工具设置和安全操作。",
    "No professional advice": "非专业建议",
    "The site does not provide engineering, construction, legal, or safety certification advice. For regulated projects, consult a qualified professional.": "本站不提供工程、施工、法律或安全认证建议。涉及监管要求的项目，请咨询合格专业人士。",
    "Availability": "可用性",
    "We may update, change, or discontinue parts of the site at any time.": "我们可能随时更新、更改或停止网站的部分功能。",
    "External links": "外部链接",
    "Links to App Store pages or other external services are provided for convenience. We are not responsible for third-party services.": "指向 App Store 页面或其他外部服务的链接仅为方便访问。我们不对第三方服务负责。"
  },
  "zh-TW": {
    "Privacy Policy": "隱私政策",
    "Terms of Service": "服務條款",
    "Contact Email": "聯絡信箱",
    "/ Privacy Policy": "/ 隱私政策",
    "/ Terms of Service": "/ 服務條款",
    "Legal": "法律資訊",
    "WoodCutTool provides browser-based calculators for layout, cutting, and material planning.": "WoodCutTool 提供基於瀏覽器的布局、切割與材料規劃計算器。",
    "Information we collect": "我們收集的資訊",
    "Contact email": "聯絡信箱",
    "Third-party links": "第三方連結",
    "Changes": "變更",
    "Contact": "聯絡",
    "Email:": "信箱：",
    "Use of calculators": "計算器使用",
    "No professional advice": "非專業建議",
    "Availability": "可用性",
    "External links": "外部連結"
  },
  es: {
    "Privacy Policy": "Política de privacidad",
    "Terms of Service": "Términos del servicio",
    "Contact Email": "Correo de contacto",
    "/ Privacy Policy": "/ Política de privacidad",
    "/ Terms of Service": "/ Términos del servicio",
    "Legal": "Legal",
    "WoodCutTool provides browser-based calculators for layout, cutting, and material planning.": "WoodCutTool ofrece calculadoras en el navegador para diseño, corte y planificación de materiales.",
    "Information we collect": "Información que recopilamos",
    "WoodCutTool does not require an account and does not ask you to upload project files. Calculator inputs are processed in your browser for the purpose of showing results.": "WoodCutTool no requiere cuenta ni pide subir archivos. Los datos de la calculadora se procesan en tu navegador para mostrar resultados.",
    "Contact email": "Correo de contacto",
    "If you contact us by email, we may use your email address and message only to respond to your request.": "Si nos contactas por correo, usaremos tu dirección y mensaje solo para responder.",
    "Third-party links": "Enlaces de terceros",
    "Some pages link to App Store product pages. Those external services are governed by their own privacy policies.": "Algunas páginas enlazan a App Store. Esos servicios externos tienen sus propias políticas.",
    "Changes": "Cambios",
    "We may update this policy as the site changes. The current version is published on this page.": "Podemos actualizar esta política cuando cambie el sitio. La versión actual se publica aquí.",
    "Contact": "Contacto",
    "Email:": "Correo:",
    "By using WoodCutTool, you agree to use the calculators as planning aids and to verify results before cutting or purchasing materials.": "Al usar WoodCutTool, aceptas usar las calculadoras como ayuda de planificación y verificar resultados antes de cortar o comprar materiales.",
    "Use of calculators": "Uso de calculadoras",
    "WoodCutTool results are estimates. You are responsible for checking measurements, local building requirements, material conditions, tool setup, and safety practices before acting on any result.": "Los resultados son estimaciones. Debes comprobar medidas, normas locales, materiales, herramientas y seguridad antes de actuar.",
    "No professional advice": "Sin asesoría profesional",
    "The site does not provide engineering, construction, legal, or safety certification advice. For regulated projects, consult a qualified professional.": "El sitio no ofrece asesoría de ingeniería, construcción, legal o certificación de seguridad. Consulta a un profesional cuando sea necesario.",
    "Availability": "Disponibilidad",
    "We may update, change, or discontinue parts of the site at any time.": "Podemos actualizar, cambiar o discontinuar partes del sitio en cualquier momento.",
    "External links": "Enlaces externos",
    "Links to App Store pages or other external services are provided for convenience. We are not responsible for third-party services.": "Los enlaces externos se ofrecen por comodidad. No somos responsables de servicios de terceros."
  },
  pt: {
    "Privacy Policy": "Política de Privacidade",
    "Terms of Service": "Termos de Serviço",
    "Contact Email": "Email de contato",
    "/ Privacy Policy": "/ Política de Privacidade",
    "/ Terms of Service": "/ Termos de Serviço",
    "Legal": "Legal",
    "WoodCutTool provides browser-based calculators for layout, cutting, and material planning.": "WoodCutTool oferece calculadoras no navegador para layout, corte e planejamento de materiais.",
    "Information we collect": "Informações que coletamos",
    "Contact email": "Email de contato",
    "Third-party links": "Links de terceiros",
    "Changes": "Alterações",
    "Contact": "Contato",
    "Email:": "Email:",
    "Use of calculators": "Uso das calculadoras",
    "No professional advice": "Sem aconselhamento profissional",
    "Availability": "Disponibilidade",
    "External links": "Links externos"
  },
  fr: {
    "Privacy Policy": "Politique de confidentialité",
    "Terms of Service": "Conditions d'utilisation",
    "Contact Email": "Email de contact",
    "/ Privacy Policy": "/ Politique de confidentialité",
    "/ Terms of Service": "/ Conditions d'utilisation",
    "Legal": "Mentions légales",
    "WoodCutTool provides browser-based calculators for layout, cutting, and material planning.": "WoodCutTool propose des calculateurs dans le navigateur pour la mise en page, la coupe et la planification des matériaux.",
    "Information we collect": "Informations collectées",
    "Contact email": "Email de contact",
    "Third-party links": "Liens tiers",
    "Changes": "Modifications",
    "Contact": "Contact",
    "Email:": "Email :",
    "Use of calculators": "Utilisation des calculateurs",
    "No professional advice": "Pas de conseil professionnel",
    "Availability": "Disponibilité",
    "External links": "Liens externes"
  },
  de: {
    "Privacy Policy": "Datenschutzerklärung",
    "Terms of Service": "Nutzungsbedingungen",
    "Contact Email": "Kontakt-E-Mail",
    "/ Privacy Policy": "/ Datenschutzerklärung",
    "/ Terms of Service": "/ Nutzungsbedingungen",
    "Legal": "Rechtliches",
    "WoodCutTool provides browser-based calculators for layout, cutting, and material planning.": "WoodCutTool bietet browserbasierte Rechner für Layout, Zuschnitt und Materialplanung.",
    "Information we collect": "Erfasste Informationen",
    "Contact email": "Kontakt-E-Mail",
    "Third-party links": "Links zu Dritten",
    "Changes": "Änderungen",
    "Contact": "Kontakt",
    "Email:": "E-Mail:",
    "Use of calculators": "Nutzung der Rechner",
    "No professional advice": "Keine professionelle Beratung",
    "Availability": "Verfügbarkeit",
    "External links": "Externe Links"
  },
  it: {
    "Privacy Policy": "Informativa sulla privacy",
    "Terms of Service": "Termini di servizio",
    "Contact Email": "Email di contatto",
    "/ Privacy Policy": "/ Informativa sulla privacy",
    "/ Terms of Service": "/ Termini di servizio",
    "Legal": "Legale",
    "WoodCutTool provides browser-based calculators for layout, cutting, and material planning.": "WoodCutTool offre calcolatori nel browser per layout, taglio e pianificazione dei materiali.",
    "Information we collect": "Informazioni raccolte",
    "Contact email": "Email di contatto",
    "Third-party links": "Link di terze parti",
    "Changes": "Modifiche",
    "Contact": "Contatto",
    "Email:": "Email:",
    "Use of calculators": "Uso dei calcolatori",
    "No professional advice": "Nessuna consulenza professionale",
    "Availability": "Disponibilità",
    "External links": "Link esterni"
  },
  ar: {
    "Privacy Policy": "سياسة الخصوصية",
    "Terms of Service": "شروط الخدمة",
    "Contact Email": "بريد التواصل",
    "/ Privacy Policy": "/ سياسة الخصوصية",
    "/ Terms of Service": "/ شروط الخدمة",
    "Legal": "قانوني",
    "WoodCutTool provides browser-based calculators for layout, cutting, and material planning.": "يوفر WoodCutTool حاسبات تعمل في المتصفح للتخطيط والقص والمواد.",
    "Information we collect": "المعلومات التي نجمعها",
    "Contact email": "بريد التواصل",
    "Third-party links": "روابط خارجية",
    "Changes": "التغييرات",
    "Contact": "تواصل",
    "Email:": "البريد:",
    "Use of calculators": "استخدام الحاسبات",
    "No professional advice": "ليست نصيحة مهنية",
    "Availability": "التوفر",
    "External links": "روابط خارجية"
  },
  ja: {
    "Privacy Policy": "プライバシーポリシー",
    "Terms of Service": "利用規約",
    "Contact Email": "連絡先メール",
    "/ Privacy Policy": "/ プライバシーポリシー",
    "/ Terms of Service": "/ 利用規約",
    "Legal": "法的情報",
    "WoodCutTool provides browser-based calculators for layout, cutting, and material planning.": "WoodCutTool はレイアウト、切断、材料計画のためのブラウザベース計算機を提供します。",
    "Information we collect": "収集する情報",
    "Contact email": "連絡先メール",
    "Third-party links": "第三者リンク",
    "Changes": "変更",
    "Contact": "連絡先",
    "Email:": "メール:",
    "Use of calculators": "計算機の利用",
    "No professional advice": "専門的助言ではありません",
    "Availability": "提供状況",
    "External links": "外部リンク"
  }
};

Object.entries(legalTranslations).forEach(([lang, values]) => {
  translations[lang] = { ...(translations[lang] || {}), ...values };
});

const footerTranslations = {
  "zh-CN": {
    "Plywood": "胶合板",
    "Guides": "指南",
    "All rights reserved.": "保留所有权利。",
    "Footer navigation": "页脚导航",
    "Legal navigation": "法律导航"
  },
  "zh-TW": {
    "Plywood": "夾板",
    "Guides": "指南",
    "All rights reserved.": "保留所有權利。",
    "Footer navigation": "頁腳導覽",
    "Legal navigation": "法律導覽"
  },
  es: {
    "Plywood": "Contrachapado",
    "Guides": "Guías",
    "All rights reserved.": "Todos los derechos reservados.",
    "Footer navigation": "Navegación del pie de página",
    "Legal navigation": "Navegación legal"
  },
  pt: {
    "Plywood": "Compensado",
    "Guides": "Guias",
    "All rights reserved.": "Todos os direitos reservados.",
    "Footer navigation": "Navegação do rodapé",
    "Legal navigation": "Navegação legal"
  },
  fr: {
    "Plywood": "Contreplaqué",
    "Guides": "Guides",
    "All rights reserved.": "Tous droits réservés.",
    "Footer navigation": "Navigation du pied de page",
    "Legal navigation": "Navigation juridique"
  },
  de: {
    "Plywood": "Sperrholz",
    "Guides": "Anleitungen",
    "All rights reserved.": "Alle Rechte vorbehalten.",
    "Footer navigation": "Footer-Navigation",
    "Legal navigation": "Rechtliche Navigation"
  },
  it: {
    "Plywood": "Compensato",
    "Guides": "Guide",
    "All rights reserved.": "Tutti i diritti riservati.",
    "Footer navigation": "Navigazione del footer",
    "Legal navigation": "Navigazione legale"
  },
  ar: {
    "Plywood": "خشب رقائقي",
    "Guides": "أدلة",
    "All rights reserved.": "جميع الحقوق محفوظة.",
    "Footer navigation": "تنقل التذييل",
    "Legal navigation": "تنقل قانوني"
  },
  ja: {
    "Plywood": "合板",
    "Guides": "ガイド",
    "All rights reserved.": "無断転載を禁じます。",
    "Footer navigation": "フッターナビゲーション",
    "Legal navigation": "法的情報ナビゲーション"
  }
};

Object.entries(footerTranslations).forEach(([lang, values]) => {
  translations[lang] = { ...(translations[lang] || {}), ...values };
});

const conversionHeroTranslations = {
  "zh-CN": {
    "Free woodworking calculator for sheet cutting": "免费的板材切割木工计算器",
    "Cut list optimizer for plywood cutting": "用于胶合板切割的切割清单优化器",
    "Plan sheet cuts, reduce material waste, and use a plywood layout tool directly in your browser.": "直接在浏览器中规划板材切割、减少材料浪费，并使用胶合板布局工具。",
    "No login. Works in browser. No data upload.": "无需登录。在浏览器中运行。无需上传数据。",
    "Start Free Optimization": "开始免费优化",
    "Try Cut Planner Instantly": "立即试用切割规划器",
    "Instant cut plan": "即时切割方案",
    "Sheet cutting calculator": "板材切割计算器",
    "Sheet width": "板材宽度",
    "Sheet height": "板材高度",
    "Generate Cut Plan": "生成切割方案",
    "Enter a sheet size to preview a material optimization tool workflow.": "输入板材尺寸，预览材料优化工具的工作流程。",
    "Cut plan generated": "切割方案已生成",
    "sheet": "板材",
    "sample parts": "示例零件",
    "estimated waste review": "预计浪费审核",
    "Open full CutList optimizer": "打开完整 CutList 优化器"
  },
  "zh-TW": {
    "Free woodworking calculator for sheet cutting": "免費板材切割木工計算器",
    "Cut list optimizer for plywood cutting": "用於夾板切割的切割清單最佳化工具",
    "Plan sheet cuts, reduce material waste, and use a plywood layout tool directly in your browser.": "直接在瀏覽器中規劃板材切割、減少材料浪費，並使用夾板布局工具。",
    "No login. Works in browser. No data upload.": "無需登入。在瀏覽器中執行。無需上傳資料。",
    "Start Free Optimization": "開始免費最佳化",
    "Try Cut Planner Instantly": "立即試用切割規劃器",
    "Instant cut plan": "即時切割方案",
    "Sheet cutting calculator": "板材切割計算器",
    "Sheet width": "板材寬度",
    "Sheet height": "板材高度",
    "Generate Cut Plan": "產生切割方案",
    "Enter a sheet size to preview a material optimization tool workflow.": "輸入板材尺寸，預覽材料最佳化工具流程。",
    "Cut plan generated": "切割方案已產生",
    "sheet": "板材",
    "sample parts": "示例零件",
    "estimated waste review": "預估浪費檢視",
    "Open full CutList optimizer": "開啟完整 CutList 最佳化工具"
  },
  es: {
    "Free woodworking calculator for sheet cutting": "Calculadora gratuita de carpintería para corte de tableros",
    "Cut list optimizer for plywood cutting": "Optimizador de lista de cortes para contrachapado",
    "Plan sheet cuts, reduce material waste, and use a plywood layout tool directly in your browser.": "Planifica cortes, reduce desperdicio y usa una herramienta de distribución de contrachapado en el navegador.",
    "No login. Works in browser. No data upload.": "Sin registro. Funciona en el navegador. Sin subir datos.",
    "Start Free Optimization": "Iniciar optimización gratis",
    "Try Cut Planner Instantly": "Probar planificador al instante",
    "Instant cut plan": "Plan de corte instantáneo",
    "Sheet cutting calculator": "Calculadora de corte de tableros",
    "Sheet width": "Ancho del tablero",
    "Sheet height": "Alto del tablero",
    "Generate Cut Plan": "Generar plan de corte",
    "Enter a sheet size to preview a material optimization tool workflow.": "Introduce el tamaño del tablero para previsualizar el flujo de optimización.",
    "Cut plan generated": "Plan de corte generado",
    "sheet": "tablero",
    "sample parts": "piezas de ejemplo",
    "estimated waste review": "revisión estimada de desperdicio",
    "Open full CutList optimizer": "Abrir optimizador CutList completo"
  },
  pt: {
    "Free woodworking calculator for sheet cutting": "Calculadora gratuita de marcenaria para corte de chapas",
    "Cut list optimizer for plywood cutting": "Otimizador de lista de corte para compensado",
    "Plan sheet cuts, reduce material waste, and use a plywood layout tool directly in your browser.": "Planeje cortes de chapa, reduza desperdício e use uma ferramenta de layout de compensado no navegador.",
    "No login. Works in browser. No data upload.": "Sem login. Funciona no navegador. Sem envio de dados.",
    "Start Free Optimization": "Iniciar otimização grátis",
    "Try Cut Planner Instantly": "Testar planejador agora",
    "Instant cut plan": "Plano de corte instantâneo",
    "Sheet cutting calculator": "Calculadora de corte de chapas",
    "Sheet width": "Largura da chapa",
    "Sheet height": "Altura da chapa",
    "Generate Cut Plan": "Gerar plano de corte",
    "Enter a sheet size to preview a material optimization tool workflow.": "Insira o tamanho da chapa para visualizar o fluxo de otimização.",
    "Cut plan generated": "Plano de corte gerado",
    "sheet": "chapa",
    "sample parts": "peças de exemplo",
    "estimated waste review": "revisão estimada de desperdício",
    "Open full CutList optimizer": "Abrir otimizador CutList completo"
  },
  fr: {
    "Free woodworking calculator for sheet cutting": "Calculateur gratuit de menuiserie pour panneaux",
    "Cut list optimizer for plywood cutting": "Optimiseur de liste de coupe pour contreplaqué",
    "Plan sheet cuts, reduce material waste, and use a plywood layout tool directly in your browser.": "Planifiez les coupes, réduisez les chutes et utilisez un outil de disposition de contreplaqué dans le navigateur.",
    "No login. Works in browser. No data upload.": "Sans compte. Fonctionne dans le navigateur. Aucun envoi de données.",
    "Start Free Optimization": "Démarrer l'optimisation gratuite",
    "Try Cut Planner Instantly": "Essayer le planificateur",
    "Instant cut plan": "Plan de coupe instantané",
    "Sheet cutting calculator": "Calculateur de coupe de panneaux",
    "Sheet width": "Largeur du panneau",
    "Sheet height": "Hauteur du panneau",
    "Generate Cut Plan": "Générer un plan de coupe",
    "Enter a sheet size to preview a material optimization tool workflow.": "Saisissez la taille du panneau pour voir le flux d'optimisation.",
    "Cut plan generated": "Plan de coupe généré",
    "sheet": "panneau",
    "sample parts": "pièces exemple",
    "estimated waste review": "estimation des chutes",
    "Open full CutList optimizer": "Ouvrir l'optimiseur CutList"
  },
  de: {
    "Free woodworking calculator for sheet cutting": "Kostenloser Holzrechner für Plattenzuschnitt",
    "Cut list optimizer for plywood cutting": "Schnittlisten-Optimierer für Sperrholz",
    "Plan sheet cuts, reduce material waste, and use a plywood layout tool directly in your browser.": "Planen Sie Plattenzuschnitte, reduzieren Sie Verschnitt und nutzen Sie ein Sperrholz-Layouttool im Browser.",
    "No login. Works in browser. No data upload.": "Kein Login. Läuft im Browser. Kein Upload.",
    "Start Free Optimization": "Kostenlos optimieren",
    "Try Cut Planner Instantly": "Zuschnittplaner testen",
    "Instant cut plan": "Sofortiger Zuschnittplan",
    "Sheet cutting calculator": "Plattenzuschnitt-Rechner",
    "Sheet width": "Plattenbreite",
    "Sheet height": "Plattenhöhe",
    "Generate Cut Plan": "Zuschnittplan erzeugen",
    "Enter a sheet size to preview a material optimization tool workflow.": "Geben Sie eine Plattengröße ein, um den Optimierungsablauf zu sehen.",
    "Cut plan generated": "Zuschnittplan erzeugt",
    "sheet": "Platte",
    "sample parts": "Beispielteile",
    "estimated waste review": "geschätzte Verschnittprüfung",
    "Open full CutList optimizer": "Vollständigen CutList-Optimierer öffnen"
  },
  it: {
    "Free woodworking calculator for sheet cutting": "Calcolatore gratuito per taglio pannelli",
    "Cut list optimizer for plywood cutting": "Ottimizzatore tagli per compensato",
    "Plan sheet cuts, reduce material waste, and use a plywood layout tool directly in your browser.": "Pianifica tagli, riduci scarti e usa uno strumento layout per compensato nel browser.",
    "No login. Works in browser. No data upload.": "Nessun login. Funziona nel browser. Nessun upload.",
    "Start Free Optimization": "Avvia ottimizzazione gratuita",
    "Try Cut Planner Instantly": "Prova subito il planner",
    "Instant cut plan": "Piano taglio istantaneo",
    "Sheet cutting calculator": "Calcolatore taglio pannelli",
    "Sheet width": "Larghezza pannello",
    "Sheet height": "Altezza pannello",
    "Generate Cut Plan": "Genera piano taglio",
    "Enter a sheet size to preview a material optimization tool workflow.": "Inserisci il pannello per vedere il flusso di ottimizzazione.",
    "Cut plan generated": "Piano taglio generato",
    "sheet": "pannello",
    "sample parts": "pezzi esempio",
    "estimated waste review": "stima scarti",
    "Open full CutList optimizer": "Apri ottimizzatore CutList"
  },
  ar: {
    "Free woodworking calculator for sheet cutting": "حاسبة نجارة مجانية لقص الألواح",
    "Cut list optimizer for plywood cutting": "محسن قائمة قص للخشب الرقائقي",
    "Plan sheet cuts, reduce material waste, and use a plywood layout tool directly in your browser.": "خطط قص الألواح وقلل الهدر واستخدم أداة تخطيط الخشب الرقائقي في المتصفح.",
    "No login. Works in browser. No data upload.": "دون تسجيل دخول. يعمل في المتصفح. لا رفع بيانات.",
    "Start Free Optimization": "ابدأ التحسين المجاني",
    "Try Cut Planner Instantly": "جرّب مخطط القص الآن",
    "Instant cut plan": "خطة قص فورية",
    "Sheet cutting calculator": "حاسبة قص الألواح",
    "Sheet width": "عرض اللوح",
    "Sheet height": "ارتفاع اللوح",
    "Generate Cut Plan": "إنشاء خطة قص",
    "Enter a sheet size to preview a material optimization tool workflow.": "أدخل حجم اللوح لمعاينة سير تحسين المواد.",
    "Cut plan generated": "تم إنشاء خطة القص",
    "sheet": "لوح",
    "sample parts": "قطع تجريبية",
    "estimated waste review": "مراجعة هدر تقديرية",
    "Open full CutList optimizer": "فتح محسن CutList الكامل"
  },
  ja: {
    "Free woodworking calculator for sheet cutting": "板材カット用の無料木工計算機",
    "Cut list optimizer for plywood cutting": "合板カット用の切断リスト最適化ツール",
    "Plan sheet cuts, reduce material waste, and use a plywood layout tool directly in your browser.": "ブラウザで板材カットを計画し、材料ロスを減らし、合板レイアウトツールを使えます。",
    "No login. Works in browser. No data upload.": "ログイン不要。ブラウザで動作。データ送信なし。",
    "Start Free Optimization": "無料で最適化を開始",
    "Try Cut Planner Instantly": "すぐにカット計画を試す",
    "Instant cut plan": "即時カットプラン",
    "Sheet cutting calculator": "板材カット計算機",
    "Sheet width": "板材幅",
    "Sheet height": "板材高さ",
    "Generate Cut Plan": "カットプランを生成",
    "Enter a sheet size to preview a material optimization tool workflow.": "板材サイズを入力して材料最適化の流れを確認します。",
    "Cut plan generated": "カットプラン生成済み",
    "sheet": "板材",
    "sample parts": "サンプル部品",
    "estimated waste review": "推定ロス確認",
    "Open full CutList optimizer": "完全版 CutList 最適化ツールを開く"
  }
};

Object.entries(conversionHeroTranslations).forEach(([lang, values]) => {
  translations[lang] = { ...(translations[lang] || {}), ...values };
});

const visualHomepageTranslations = {
  "zh-CN": {
    "Visual tool picker": "可视化工具选择",
    "Choose a calculator by looking at the job.": "看项目类型，直接选择合适计算器。",
    "CutList is the primary plywood layout tool; QuiltFit, Tile, and Stringer cover the other planning moments.": "CutList 是主要胶合板布局工具；QuiltFit、Tile 和 Stringer 覆盖其他规划场景。",
    "Primary": "主工具",
    "CutList optimizer": "CutList 优化器",
    "Plywood layout, cut order, waste.": "胶合板布局、切割顺序、浪费。",
    "App": "App",
    "QuiltFit planner": "QuiltFit 规划器",
    "Blocks, backing, binding.": "方块、背布、包边。",
    "Floor": "地面",
    "Tile calculator": "瓷砖计算器",
    "Boxes, cuts, waste.": "箱数、切割、损耗。",
    "Stairs": "楼梯",
    "Stringer calculator": "楼梯梁计算器",
    "Rise, run, angles.": "升高、进深、角度。",
    "Real cut preview": "真实切割预览",
    "See the waste before the saw starts.": "下锯前先看到浪费。",
    "A visual material optimization tool makes the decision obvious: buy less, cut cleaner, keep useful offcuts.": "可视化材料优化工具让决策更直观：少买材料、切得更干净、保留可用余料。",
    "4 sheets": "4 张板",
    "42% waste risk": "42% 浪费风险",
    "3 sheets": "3 张板",
    "21% waste estimate": "预计浪费 21%",
    "sheet saved": "节省板材",
    "typical savings": "典型节省",
    "CAD setup": "CAD 设置",
    "Plan in the browser. Save in the app.": "浏览器中规划，App 中保存。",
    "Start with the free woodworking calculator, then keep real CutList projects offline on iPhone.": "先用免费的木工计算器规划，再在 iPhone 上离线保存真实 CutList 项目。",
    "Offline projects": "离线项目",
    "Cut history": "切割历史",
    "Grain, kerf, batching.": "纹理、锯缝、批量。",
    "Rise, tread count, angle.": "升高、踏步数、角度。",
    "Group cuts, reduce waste.": "分组切割，减少浪费。"
  },
  "zh-TW": {
    "Visual tool picker": "視覺化工具選擇",
    "Choose a calculator by looking at the job.": "看專案類型，直接選擇合適計算器。",
    "CutList is the primary plywood layout tool; QuiltFit, Tile, and Stringer cover the other planning moments.": "CutList 是主要夾板布局工具；QuiltFit、Tile 和 Stringer 覆蓋其他規劃場景。",
    "Primary": "主工具",
    "CutList optimizer": "CutList 最佳化工具",
    "Plywood layout, cut order, waste.": "夾板布局、切割順序、浪費。",
    "App": "App",
    "QuiltFit planner": "QuiltFit 規劃器",
    "Blocks, backing, binding.": "方塊、背布、包邊。",
    "Floor": "地面",
    "Tile calculator": "磁磚計算器",
    "Boxes, cuts, waste.": "箱數、切割、損耗。",
    "Stairs": "樓梯",
    "Stringer calculator": "樓梯樑計算器",
    "Rise, run, angles.": "升高、進深、角度。",
    "Real cut preview": "真實切割預覽",
    "See the waste before the saw starts.": "下鋸前先看到浪費。",
    "A visual material optimization tool makes the decision obvious: buy less, cut cleaner, keep useful offcuts.": "視覺化材料最佳化工具讓決策更直觀：少買材料、切得更乾淨、保留可用餘料。",
    "4 sheets": "4 張板",
    "42% waste risk": "42% 浪費風險",
    "3 sheets": "3 張板",
    "21% waste estimate": "預估浪費 21%",
    "sheet saved": "節省板材",
    "typical savings": "典型節省",
    "CAD setup": "CAD 設定",
    "Plan in the browser. Save in the app.": "瀏覽器中規劃，App 中保存。",
    "Start with the free woodworking calculator, then keep real CutList projects offline on iPhone.": "先用免費木工計算器規劃，再在 iPhone 上離線保存真實 CutList 專案。",
    "Offline projects": "離線專案",
    "Cut history": "切割歷史",
    "Grain, kerf, batching.": "紋理、鋸縫、批量。",
    "Rise, tread count, angle.": "升高、踏步數、角度。",
    "Group cuts, reduce waste.": "分組切割，減少浪費。"
  },
  es: {
    "Visual tool picker": "Selector visual de herramientas",
    "Choose a calculator by looking at the job.": "Elige la calculadora según el trabajo.",
    "CutList is the primary plywood layout tool; QuiltFit, Tile, and Stringer cover the other planning moments.": "CutList es la herramienta principal para contrachapado; QuiltFit, Tile y Stringer cubren otros planes.",
    "Primary": "Principal",
    "CutList optimizer": "Optimizador CutList",
    "Plywood layout, cut order, waste.": "Distribución, orden de corte, desperdicio.",
    "App": "App",
    "QuiltFit planner": "Planificador QuiltFit",
    "Blocks, backing, binding.": "Bloques, trasera, borde.",
    "Floor": "Piso",
    "Tile calculator": "Calculadora de azulejos",
    "Boxes, cuts, waste.": "Cajas, cortes, merma.",
    "Stairs": "Escaleras",
    "Stringer calculator": "Calculadora de zancas",
    "Rise, run, angles.": "Altura, huella, ángulos.",
    "Real cut preview": "Vista real de corte",
    "See the waste before the saw starts.": "Ve el desperdicio antes de cortar.",
    "A visual material optimization tool makes the decision obvious: buy less, cut cleaner, keep useful offcuts.": "Una herramienta visual de optimización deja clara la decisión: comprar menos, cortar mejor y conservar recortes útiles.",
    "4 sheets": "4 tableros",
    "42% waste risk": "42% riesgo de merma",
    "3 sheets": "3 tableros",
    "21% waste estimate": "21% merma estimada",
    "sheet saved": "tablero ahorrado",
    "typical savings": "ahorro típico",
    "CAD setup": "configuración CAD",
    "Plan in the browser. Save in the app.": "Planifica en el navegador. Guarda en la app.",
    "Start with the free woodworking calculator, then keep real CutList projects offline on iPhone.": "Empieza con la calculadora gratuita y guarda proyectos CutList sin conexión en iPhone.",
    "Offline projects": "Proyectos sin conexión",
    "Cut history": "Historial de cortes",
    "Grain, kerf, batching.": "Veta, kerf, lotes.",
    "Rise, tread count, angle.": "Altura, peldaños, ángulo.",
    "Group cuts, reduce waste.": "Agrupa cortes, reduce merma."
  },
  pt: {
    "Visual tool picker": "Seletor visual de ferramentas",
    "Choose a calculator by looking at the job.": "Escolha a calculadora pelo tipo de trabalho.",
    "CutList is the primary plywood layout tool; QuiltFit, Tile, and Stringer cover the other planning moments.": "CutList é a principal ferramenta de layout de compensado; QuiltFit, Tile e Stringer cobrem outros planejamentos.",
    "Primary": "Principal",
    "CutList optimizer": "Otimizador CutList",
    "Plywood layout, cut order, waste.": "Layout, ordem de corte, desperdício.",
    "App": "App",
    "QuiltFit planner": "Planejador QuiltFit",
    "Blocks, backing, binding.": "Blocos, forro, acabamento.",
    "Floor": "Piso",
    "Tile calculator": "Calculadora de azulejos",
    "Boxes, cuts, waste.": "Caixas, cortes, perdas.",
    "Stairs": "Escadas",
    "Stringer calculator": "Calculadora de longarina",
    "Rise, run, angles.": "Altura, avanço, ângulos.",
    "Real cut preview": "Prévia real de corte",
    "See the waste before the saw starts.": "Veja o desperdício antes da serra.",
    "A visual material optimization tool makes the decision obvious: buy less, cut cleaner, keep useful offcuts.": "Uma ferramenta visual de otimização deixa claro: comprar menos, cortar melhor e guardar sobras úteis.",
    "4 sheets": "4 chapas",
    "42% waste risk": "42% risco de perda",
    "3 sheets": "3 chapas",
    "21% waste estimate": "21% perda estimada",
    "sheet saved": "chapa economizada",
    "typical savings": "economia típica",
    "CAD setup": "configuração CAD",
    "Plan in the browser. Save in the app.": "Planeje no navegador. Salve no app.",
    "Start with the free woodworking calculator, then keep real CutList projects offline on iPhone.": "Comece com a calculadora gratuita e mantenha projetos CutList offline no iPhone.",
    "Offline projects": "Projetos offline",
    "Cut history": "Histórico de cortes",
    "Grain, kerf, batching.": "Veio, corte, lote.",
    "Rise, tread count, angle.": "Altura, degraus, ângulo.",
    "Group cuts, reduce waste.": "Agrupe cortes, reduza perdas."
  },
  fr: {
    "Visual tool picker": "Sélecteur visuel d'outils",
    "Choose a calculator by looking at the job.": "Choisissez le calculateur selon le travail.",
    "CutList is the primary plywood layout tool; QuiltFit, Tile, and Stringer cover the other planning moments.": "CutList est l'outil principal pour le contreplaqué; QuiltFit, Tile et Stringer couvrent les autres besoins.",
    "Primary": "Principal",
    "CutList optimizer": "Optimiseur CutList",
    "Plywood layout, cut order, waste.": "Disposition, ordre de coupe, chutes.",
    "App": "App",
    "QuiltFit planner": "Planificateur QuiltFit",
    "Blocks, backing, binding.": "Blocs, doublure, bordure.",
    "Floor": "Sol",
    "Tile calculator": "Calculateur carrelage",
    "Boxes, cuts, waste.": "Boîtes, coupes, pertes.",
    "Stairs": "Escaliers",
    "Stringer calculator": "Calculateur de limon",
    "Rise, run, angles.": "Hauteur, giron, angles.",
    "Real cut preview": "Aperçu de coupe réel",
    "See the waste before the saw starts.": "Voyez les chutes avant de couper.",
    "A visual material optimization tool makes the decision obvious: buy less, cut cleaner, keep useful offcuts.": "Un outil visuel d'optimisation rend la décision claire : acheter moins, couper mieux, garder les chutes utiles.",
    "4 sheets": "4 panneaux",
    "42% waste risk": "42% risque de chutes",
    "3 sheets": "3 panneaux",
    "21% waste estimate": "21% chutes estimées",
    "sheet saved": "panneau économisé",
    "typical savings": "économie typique",
    "CAD setup": "configuration CAD",
    "Plan in the browser. Save in the app.": "Planifiez dans le navigateur. Enregistrez dans l'app.",
    "Start with the free woodworking calculator, then keep real CutList projects offline on iPhone.": "Commencez avec le calculateur gratuit, puis gardez vos projets CutList hors ligne sur iPhone.",
    "Offline projects": "Projets hors ligne",
    "Cut history": "Historique de coupe",
    "Grain, kerf, batching.": "Fil, trait, lots.",
    "Rise, tread count, angle.": "Hauteur, marches, angle.",
    "Group cuts, reduce waste.": "Groupez les coupes, réduisez les chutes."
  },
  de: {
    "Visual tool picker": "Visuelle Werkzeugauswahl",
    "Choose a calculator by looking at the job.": "Wählen Sie den Rechner nach dem Projekt.",
    "CutList is the primary plywood layout tool; QuiltFit, Tile, and Stringer cover the other planning moments.": "CutList ist das zentrale Sperrholz-Layouttool; QuiltFit, Tile und Stringer decken weitere Planungen ab.",
    "Primary": "Primär",
    "CutList optimizer": "CutList-Optimierer",
    "Plywood layout, cut order, waste.": "Layout, Schnittfolge, Verschnitt.",
    "App": "App",
    "QuiltFit planner": "QuiltFit-Planer",
    "Blocks, backing, binding.": "Blöcke, Rückseite, Einfassung.",
    "Floor": "Boden",
    "Tile calculator": "Fliesenrechner",
    "Boxes, cuts, waste.": "Kartons, Zuschnitte, Verlust.",
    "Stairs": "Treppen",
    "Stringer calculator": "Wangenrechner",
    "Rise, run, angles.": "Steigung, Auftritt, Winkel.",
    "Real cut preview": "Echte Schnittvorschau",
    "See the waste before the saw starts.": "Verschnitt sehen, bevor die Säge startet.",
    "A visual material optimization tool makes the decision obvious: buy less, cut cleaner, keep useful offcuts.": "Ein visuelles Optimierungstool macht die Entscheidung klar: weniger kaufen, sauberer schneiden, brauchbare Reste behalten.",
    "4 sheets": "4 Platten",
    "42% waste risk": "42% Verschnittrisiko",
    "3 sheets": "3 Platten",
    "21% waste estimate": "21% geschätzter Verschnitt",
    "sheet saved": "Platte gespart",
    "typical savings": "typische Ersparnis",
    "CAD setup": "CAD-Einrichtung",
    "Plan in the browser. Save in the app.": "Im Browser planen. In der App speichern.",
    "Start with the free woodworking calculator, then keep real CutList projects offline on iPhone.": "Starten Sie mit dem kostenlosen Holzrechner und speichern Sie echte CutList-Projekte offline auf dem iPhone.",
    "Offline projects": "Offline-Projekte",
    "Cut history": "Schnittverlauf",
    "Grain, kerf, batching.": "Maserung, Fuge, Chargen.",
    "Rise, tread count, angle.": "Steigung, Stufen, Winkel.",
    "Group cuts, reduce waste.": "Schnitte gruppieren, Verschnitt senken."
  },
  it: {
    "Visual tool picker": "Selettore visuale strumenti",
    "Choose a calculator by looking at the job.": "Scegli il calcolatore guardando il lavoro.",
    "CutList is the primary plywood layout tool; QuiltFit, Tile, and Stringer cover the other planning moments.": "CutList è lo strumento principale per il compensato; QuiltFit, Tile e Stringer coprono altri momenti di pianificazione.",
    "Primary": "Principale",
    "CutList optimizer": "Ottimizzatore CutList",
    "Plywood layout, cut order, waste.": "Layout, ordine tagli, scarti.",
    "App": "App",
    "QuiltFit planner": "Planner QuiltFit",
    "Blocks, backing, binding.": "Blocchi, retro, bordi.",
    "Floor": "Pavimento",
    "Tile calculator": "Calcolatore piastrelle",
    "Boxes, cuts, waste.": "Scatole, tagli, scarti.",
    "Stairs": "Scale",
    "Stringer calculator": "Calcolatore cosciale",
    "Rise, run, angles.": "Alzata, pedata, angoli.",
    "Real cut preview": "Anteprima taglio reale",
    "See the waste before the saw starts.": "Vedi gli scarti prima di tagliare.",
    "A visual material optimization tool makes the decision obvious: buy less, cut cleaner, keep useful offcuts.": "Uno strumento visuale rende chiaro cosa fare: comprare meno, tagliare meglio, tenere scarti utili.",
    "4 sheets": "4 pannelli",
    "42% waste risk": "42% rischio scarti",
    "3 sheets": "3 pannelli",
    "21% waste estimate": "21% scarti stimati",
    "sheet saved": "pannello risparmiato",
    "typical savings": "risparmio tipico",
    "CAD setup": "setup CAD",
    "Plan in the browser. Save in the app.": "Pianifica nel browser. Salva nell'app.",
    "Start with the free woodworking calculator, then keep real CutList projects offline on iPhone.": "Inizia con il calcolatore gratuito e conserva i progetti CutList offline su iPhone.",
    "Offline projects": "Progetti offline",
    "Cut history": "Cronologia tagli",
    "Grain, kerf, batching.": "Venatura, kerf, lotti.",
    "Rise, tread count, angle.": "Alzata, gradini, angolo.",
    "Group cuts, reduce waste.": "Raggruppa tagli, riduci scarti."
  },
  ar: {
    "Visual tool picker": "اختيار الأدوات بصرياً",
    "Choose a calculator by looking at the job.": "اختر الحاسبة حسب نوع العمل.",
    "CutList is the primary plywood layout tool; QuiltFit, Tile, and Stringer cover the other planning moments.": "CutList هي أداة تخطيط الخشب الرقائقي الأساسية؛ وتغطي QuiltFit وTile وStringer باقي احتياجات التخطيط.",
    "Primary": "أساسي",
    "CutList optimizer": "محسن CutList",
    "Plywood layout, cut order, waste.": "تخطيط الخشب، ترتيب القص، الهدر.",
    "App": "تطبيق",
    "QuiltFit planner": "مخطط QuiltFit",
    "Blocks, backing, binding.": "مربعات، خلفية، حواف.",
    "Floor": "أرضية",
    "Tile calculator": "حاسبة البلاط",
    "Boxes, cuts, waste.": "صناديق، قصات، هدر.",
    "Stairs": "سلالم",
    "Stringer calculator": "حاسبة عارضة السلم",
    "Rise, run, angles.": "ارتفاع، امتداد، زوايا.",
    "Real cut preview": "معاينة قص حقيقية",
    "See the waste before the saw starts.": "شاهد الهدر قبل بدء القص.",
    "A visual material optimization tool makes the decision obvious: buy less, cut cleaner, keep useful offcuts.": "أداة تحسين مرئية تجعل القرار واضحاً: اشترِ أقل، اقطع أنظف، واحتفظ بالبقايا المفيدة.",
    "4 sheets": "4 ألواح",
    "42% waste risk": "42% خطر هدر",
    "3 sheets": "3 ألواح",
    "21% waste estimate": "21% هدر تقديري",
    "sheet saved": "لوح موفر",
    "typical savings": "توفير نموذجي",
    "CAD setup": "إعداد CAD",
    "Plan in the browser. Save in the app.": "خطط في المتصفح. احفظ في التطبيق.",
    "Start with the free woodworking calculator, then keep real CutList projects offline on iPhone.": "ابدأ بحاسبة النجارة المجانية، ثم احفظ مشاريع CutList دون اتصال على iPhone.",
    "Offline projects": "مشاريع دون اتصال",
    "Cut history": "سجل القص",
    "Grain, kerf, batching.": "اتجاه الخشب، عرض القص، دفعات.",
    "Rise, tread count, angle.": "ارتفاع، عدد الدرجات، زاوية.",
    "Group cuts, reduce waste.": "اجمع القصات وقلل الهدر."
  },
  ja: {
    "Visual tool picker": "ビジュアルツール選択",
    "Choose a calculator by looking at the job.": "作業内容を見て計算機を選べます。",
    "CutList is the primary plywood layout tool; QuiltFit, Tile, and Stringer cover the other planning moments.": "CutList は主要な合板レイアウトツールです。QuiltFit、Tile、Stringer は他の計画場面を補います。",
    "Primary": "メイン",
    "CutList optimizer": "CutList 最適化",
    "Plywood layout, cut order, waste.": "合板配置、切断順、ロス。",
    "App": "アプリ",
    "QuiltFit planner": "QuiltFit プランナー",
    "Blocks, backing, binding.": "ブロック、裏布、縁取り。",
    "Floor": "床",
    "Tile calculator": "タイル計算機",
    "Boxes, cuts, waste.": "箱数、カット、ロス。",
    "Stairs": "階段",
    "Stringer calculator": "ストリンガー計算機",
    "Rise, run, angles.": "高さ、踏面、角度。",
    "Real cut preview": "実カットプレビュー",
    "See the waste before the saw starts.": "切る前にロスを確認。",
    "A visual material optimization tool makes the decision obvious: buy less, cut cleaner, keep useful offcuts.": "視覚的な材料最適化ツールで、少なく買い、きれいに切り、有用な余材を残せます。",
    "4 sheets": "4 枚",
    "42% waste risk": "42% ロスリスク",
    "3 sheets": "3 枚",
    "21% waste estimate": "21% 推定ロス",
    "sheet saved": "板を節約",
    "typical savings": "標準的な節約",
    "CAD setup": "CAD 設定",
    "Plan in the browser. Save in the app.": "ブラウザで計画。アプリで保存。",
    "Start with the free woodworking calculator, then keep real CutList projects offline on iPhone.": "無料の木工計算機から始め、実際の CutList プロジェクトを iPhone にオフライン保存できます。",
    "Offline projects": "オフライン案件",
    "Cut history": "切断履歴",
    "Grain, kerf, batching.": "木目、鋸幅、まとめ処理。",
    "Rise, tread count, angle.": "高さ、段数、角度。",
    "Group cuts, reduce waste.": "カットをまとめてロス削減。"
  }
};

Object.entries(visualHomepageTranslations).forEach(([lang, values]) => {
  translations[lang] = { ...(translations[lang] || {}), ...values };
});

const interactiveHeroTranslations = {
  "zh-CN": {
    "CutList visual planner": "CutList 可视化规划器",
    "Plywood cutting optimizer": "胶合板切割优化器",
    "Generate a visual sheet layout before you cut.": "下锯前先生成可视化板材布局。",
    "No login": "无需登录",
    "Browser only": "仅浏览器运行",
    "No upload": "无需上传",
    "Live cut board": "实时切割板",
    "Try the layout": "试试布局",
    "Cabinet": "橱柜",
    "Shelves": "搁板",
    "Desk": "桌面",
    "Waste target": "浪费目标",
    "Sheets needed": "所需板材",
    "Parts packed": "已排零件",
    "Saved": "节省",
    "Visual workflow": "可视化流程",
    "From rough idea to cut-ready board.": "从粗略想法到可切割板材。",
    "Measure": "测量",
    "Sheet size and parts.": "板材尺寸和零件。",
    "Pack": "排布",
    "Layout updates instantly.": "布局即时更新。",
    "Save": "节省",
    "Less waste, clearer cuts.": "更少浪费，更清晰切割。"
  },
  "zh-TW": {
    "CutList visual planner": "CutList 視覺化規劃器",
    "Plywood cutting optimizer": "夾板切割最佳化工具",
    "Generate a visual sheet layout before you cut.": "下鋸前先產生視覺化板材布局。",
    "No login": "無需登入",
    "Browser only": "僅瀏覽器執行",
    "No upload": "無需上傳",
    "Live cut board": "即時切割板",
    "Try the layout": "試試布局",
    "Cabinet": "櫥櫃",
    "Shelves": "層板",
    "Desk": "桌面",
    "Waste target": "浪費目標",
    "Sheets needed": "所需板材",
    "Parts packed": "已排零件",
    "Saved": "節省",
    "Visual workflow": "視覺化流程",
    "From rough idea to cut-ready board.": "從粗略想法到可切割板材。",
    "Measure": "測量",
    "Sheet size and parts.": "板材尺寸和零件。",
    "Pack": "排布",
    "Layout updates instantly.": "布局即時更新。",
    "Save": "節省",
    "Less waste, clearer cuts.": "更少浪費，更清晰切割。"
  },
  es: {
    "CutList visual planner": "Planificador visual CutList",
    "Plywood cutting optimizer": "Optimizador de corte de contrachapado",
    "Generate a visual sheet layout before you cut.": "Genera un diseño visual antes de cortar.",
    "No login": "Sin registro",
    "Browser only": "Solo navegador",
    "No upload": "Sin subir datos",
    "Live cut board": "Tablero en vivo",
    "Try the layout": "Prueba el diseño",
    "Cabinet": "Gabinete",
    "Shelves": "Estantes",
    "Desk": "Escritorio",
    "Waste target": "Objetivo de merma",
    "Sheets needed": "Tableros necesarios",
    "Parts packed": "Piezas colocadas",
    "Saved": "Ahorrado",
    "Visual workflow": "Flujo visual",
    "From rough idea to cut-ready board.": "De una idea rápida a un tablero listo.",
    "Measure": "Medir",
    "Sheet size and parts.": "Tamaño y piezas.",
    "Pack": "Acomodar",
    "Layout updates instantly.": "El diseño se actualiza al instante.",
    "Save": "Ahorrar",
    "Less waste, clearer cuts.": "Menos merma, cortes más claros."
  },
  pt: {
    "CutList visual planner": "Planejador visual CutList",
    "Plywood cutting optimizer": "Otimizador de corte de compensado",
    "Generate a visual sheet layout before you cut.": "Gere um layout visual antes de cortar.",
    "No login": "Sem login",
    "Browser only": "Só no navegador",
    "No upload": "Sem upload",
    "Live cut board": "Chapa ao vivo",
    "Try the layout": "Teste o layout",
    "Cabinet": "Armário",
    "Shelves": "Prateleiras",
    "Desk": "Mesa",
    "Waste target": "Meta de desperdício",
    "Sheets needed": "Chapas necessárias",
    "Parts packed": "Peças encaixadas",
    "Saved": "Economia",
    "Visual workflow": "Fluxo visual",
    "From rough idea to cut-ready board.": "Da ideia inicial à chapa pronta.",
    "Measure": "Medir",
    "Sheet size and parts.": "Tamanho e peças.",
    "Pack": "Encaixar",
    "Layout updates instantly.": "O layout atualiza na hora.",
    "Save": "Economizar",
    "Less waste, clearer cuts.": "Menos desperdício, cortes mais claros."
  },
  fr: {
    "CutList visual planner": "Planificateur visuel CutList",
    "Plywood cutting optimizer": "Optimiseur de coupe du contreplaqué",
    "Generate a visual sheet layout before you cut.": "Générez une disposition visuelle avant de couper.",
    "No login": "Sans compte",
    "Browser only": "Navigateur uniquement",
    "No upload": "Aucun envoi",
    "Live cut board": "Panneau en direct",
    "Try the layout": "Tester la disposition",
    "Cabinet": "Meuble",
    "Shelves": "Étagères",
    "Desk": "Bureau",
    "Waste target": "Objectif de chute",
    "Sheets needed": "Panneaux requis",
    "Parts packed": "Pièces placées",
    "Saved": "Économisé",
    "Visual workflow": "Flux visuel",
    "From rough idea to cut-ready board.": "De l'idée au panneau prêt à couper.",
    "Measure": "Mesurer",
    "Sheet size and parts.": "Taille et pièces.",
    "Pack": "Placer",
    "Layout updates instantly.": "La disposition se met à jour.",
    "Save": "Économiser",
    "Less waste, clearer cuts.": "Moins de chutes, coupes plus claires."
  },
  de: {
    "CutList visual planner": "Visueller CutList-Planer",
    "Plywood cutting optimizer": "Sperrholz-Zuschnittoptimierer",
    "Generate a visual sheet layout before you cut.": "Erzeugen Sie vor dem Sägen ein visuelles Layout.",
    "No login": "Kein Login",
    "Browser only": "Nur im Browser",
    "No upload": "Kein Upload",
    "Live cut board": "Live-Zuschnittplatte",
    "Try the layout": "Layout testen",
    "Cabinet": "Schrank",
    "Shelves": "Regale",
    "Desk": "Tisch",
    "Waste target": "Verschnittziel",
    "Sheets needed": "Benötigte Platten",
    "Parts packed": "Teile platziert",
    "Saved": "Gespart",
    "Visual workflow": "Visueller Ablauf",
    "From rough idea to cut-ready board.": "Von der Idee zur schnittfertigen Platte.",
    "Measure": "Messen",
    "Sheet size and parts.": "Plattengröße und Teile.",
    "Pack": "Packen",
    "Layout updates instantly.": "Layout aktualisiert sofort.",
    "Save": "Sparen",
    "Less waste, clearer cuts.": "Weniger Verschnitt, klarere Schnitte."
  },
  it: {
    "CutList visual planner": "Planner visuale CutList",
    "Plywood cutting optimizer": "Ottimizzatore taglio compensato",
    "Generate a visual sheet layout before you cut.": "Genera un layout visuale prima di tagliare.",
    "No login": "Nessun login",
    "Browser only": "Solo browser",
    "No upload": "Nessun upload",
    "Live cut board": "Pannello live",
    "Try the layout": "Prova il layout",
    "Cabinet": "Mobile",
    "Shelves": "Ripiani",
    "Desk": "Scrivania",
    "Waste target": "Obiettivo scarti",
    "Sheets needed": "Pannelli necessari",
    "Parts packed": "Pezzi disposti",
    "Saved": "Risparmiato",
    "Visual workflow": "Flusso visuale",
    "From rough idea to cut-ready board.": "Dall'idea al pannello pronto.",
    "Measure": "Misura",
    "Sheet size and parts.": "Dimensioni e pezzi.",
    "Pack": "Disponi",
    "Layout updates instantly.": "Il layout si aggiorna subito.",
    "Save": "Risparmia",
    "Less waste, clearer cuts.": "Meno scarti, tagli più chiari."
  },
  ar: {
    "CutList visual planner": "مخطط CutList المرئي",
    "Plywood cutting optimizer": "محسن قص الخشب الرقائقي",
    "Generate a visual sheet layout before you cut.": "أنشئ تخطيطاً مرئياً قبل القص.",
    "No login": "دون تسجيل دخول",
    "Browser only": "المتصفح فقط",
    "No upload": "دون رفع",
    "Live cut board": "لوح قص مباشر",
    "Try the layout": "جرّب التخطيط",
    "Cabinet": "خزانة",
    "Shelves": "رفوف",
    "Desk": "مكتب",
    "Waste target": "هدف الهدر",
    "Sheets needed": "الألواح المطلوبة",
    "Parts packed": "القطع المرتبة",
    "Saved": "التوفير",
    "Visual workflow": "سير مرئي",
    "From rough idea to cut-ready board.": "من فكرة أولية إلى لوح جاهز للقص.",
    "Measure": "قياس",
    "Sheet size and parts.": "حجم اللوح والقطع.",
    "Pack": "ترتيب",
    "Layout updates instantly.": "يتحدث التخطيط فوراً.",
    "Save": "توفير",
    "Less waste, clearer cuts.": "هدر أقل وقص أوضح."
  },
  ja: {
    "CutList visual planner": "CutList ビジュアルプランナー",
    "Plywood cutting optimizer": "合板カット最適化ツール",
    "Generate a visual sheet layout before you cut.": "切る前に板材レイアウトを可視化します。",
    "No login": "ログイン不要",
    "Browser only": "ブラウザのみ",
    "No upload": "アップロードなし",
    "Live cut board": "ライブ切断ボード",
    "Try the layout": "レイアウトを試す",
    "Cabinet": "キャビネット",
    "Shelves": "棚",
    "Desk": "デスク",
    "Waste target": "ロス目標",
    "Sheets needed": "必要な板材",
    "Parts packed": "配置済み部品",
    "Saved": "節約",
    "Visual workflow": "ビジュアル工程",
    "From rough idea to cut-ready board.": "ラフ案から切断可能な板へ。",
    "Measure": "測定",
    "Sheet size and parts.": "板材サイズと部品。",
    "Pack": "配置",
    "Layout updates instantly.": "レイアウトが即時更新。",
    "Save": "節約",
    "Less waste, clearer cuts.": "ロスを減らし、切断を明確に。"
  }
};

Object.entries(interactiveHeroTranslations).forEach(([lang, values]) => {
  translations[lang] = { ...(translations[lang] || {}), ...values };
});

const playfulInteractionTranslations = {
  "zh-CN": {
    "Animate Optimization": "动画优化",
    "Add parts": "添加零件",
    "Add sample parts": "添加示例零件",
    "Add side panel": "加侧板",
    "Add shelf": "加搁板",
    "Add back panel": "加背板",
    "Back panel": "背板",
    "Demo actions": "演示操作",
    "Random demo": "随机演示",
    "Shuffle layout": "随机重排",
    "Show before": "查看优化前",
    "Compare before optimization": "对比优化前",
    "Show optimized": "查看优化后",
    "Show optimized layout": "查看优化后布局"
  },
  "zh-TW": {
    "Animate Optimization": "動畫最佳化",
    "Add parts": "新增零件",
    "Add sample parts": "新增示例零件",
    "Add side panel": "加側板",
    "Add shelf": "加層板",
    "Add back panel": "加背板",
    "Back panel": "背板",
    "Demo actions": "演示操作",
    "Random demo": "隨機演示",
    "Shuffle layout": "隨機重排",
    "Show before": "查看最佳化前",
    "Compare before optimization": "對比最佳化前",
    "Show optimized": "查看最佳化後",
    "Show optimized layout": "查看最佳化後布局"
  },
  es: {
    "Animate Optimization": "Animar optimización",
    "Add parts": "Añadir piezas",
    "Add sample parts": "Añadir piezas de ejemplo",
    "Add side panel": "Añadir lateral",
    "Add shelf": "Añadir estante",
    "Add back panel": "Añadir panel trasero",
    "Back panel": "Panel trasero",
    "Demo actions": "Acciones de demo",
    "Random demo": "Demo aleatoria",
    "Shuffle layout": "Reordenar",
    "Show before": "Ver antes",
    "Compare before optimization": "Comparar antes",
    "Show optimized": "Ver optimizado",
    "Show optimized layout": "Ver layout optimizado"
  },
  pt: {
    "Animate Optimization": "Animar otimização",
    "Add parts": "Adicionar peças",
    "Add sample parts": "Adicionar peças de exemplo",
    "Add side panel": "Adicionar lateral",
    "Add shelf": "Adicionar prateleira",
    "Add back panel": "Adicionar painel traseiro",
    "Back panel": "Painel traseiro",
    "Demo actions": "Ações da demo",
    "Random demo": "Demo aleatória",
    "Shuffle layout": "Reorganizar",
    "Show before": "Ver antes",
    "Compare before optimization": "Comparar antes",
    "Show optimized": "Ver otimizado",
    "Show optimized layout": "Ver layout otimizado"
  },
  fr: {
    "Animate Optimization": "Animer l'optimisation",
    "Add parts": "Ajouter des pièces",
    "Add sample parts": "Ajouter des pièces exemple",
    "Add side panel": "Ajouter un côté",
    "Add shelf": "Ajouter une étagère",
    "Add back panel": "Ajouter un fond",
    "Back panel": "Fond",
    "Demo actions": "Actions de démo",
    "Random demo": "Démo aléatoire",
    "Shuffle layout": "Réorganiser",
    "Show before": "Voir avant",
    "Compare before optimization": "Comparer avant",
    "Show optimized": "Voir optimisé",
    "Show optimized layout": "Voir la disposition optimisée"
  },
  de: {
    "Animate Optimization": "Optimierung animieren",
    "Add parts": "Teile hinzufügen",
    "Add sample parts": "Beispielteile hinzufügen",
    "Add side panel": "Seitenwand hinzufügen",
    "Add shelf": "Boden hinzufügen",
    "Add back panel": "Rückwand hinzufügen",
    "Back panel": "Rückwand",
    "Demo actions": "Demo-Aktionen",
    "Random demo": "Zufallsdemo",
    "Shuffle layout": "Layout mischen",
    "Show before": "Vorher zeigen",
    "Compare before optimization": "Vorher vergleichen",
    "Show optimized": "Optimiert zeigen",
    "Show optimized layout": "Optimiertes Layout zeigen"
  },
  it: {
    "Animate Optimization": "Anima ottimizzazione",
    "Add parts": "Aggiungi pezzi",
    "Add sample parts": "Aggiungi pezzi esempio",
    "Add side panel": "Aggiungi fianco",
    "Add shelf": "Aggiungi ripiano",
    "Add back panel": "Aggiungi schienale",
    "Back panel": "Schienale",
    "Demo actions": "Azioni demo",
    "Random demo": "Demo casuale",
    "Shuffle layout": "Rimescola layout",
    "Show before": "Mostra prima",
    "Compare before optimization": "Confronta prima",
    "Show optimized": "Mostra ottimizzato",
    "Show optimized layout": "Mostra layout ottimizzato"
  },
  ar: {
    "Animate Optimization": "تحريك التحسين",
    "Add parts": "إضافة قطع",
    "Add sample parts": "إضافة قطع تجريبية",
    "Add side panel": "إضافة جانب",
    "Add shelf": "إضافة رف",
    "Add back panel": "إضافة لوح خلفي",
    "Back panel": "لوح خلفي",
    "Demo actions": "إجراءات العرض",
    "Random demo": "عرض عشوائي",
    "Shuffle layout": "إعادة ترتيب",
    "Show before": "إظهار قبل",
    "Compare before optimization": "مقارنة قبل التحسين",
    "Show optimized": "إظهار المحسن",
    "Show optimized layout": "إظهار التخطيط المحسن"
  },
  ja: {
    "Animate Optimization": "最適化をアニメ表示",
    "Add parts": "部品を追加",
    "Add sample parts": "サンプル部品を追加",
    "Add side panel": "側板を追加",
    "Add shelf": "棚板を追加",
    "Add back panel": "背板を追加",
    "Back panel": "背板",
    "Demo actions": "デモ操作",
    "Random demo": "ランダムデモ",
    "Shuffle layout": "配置をシャッフル",
    "Show before": "最適化前を表示",
    "Compare before optimization": "最適化前と比較",
    "Show optimized": "最適化後を表示",
    "Show optimized layout": "最適化後レイアウトを表示"
  }
};

Object.entries(playfulInteractionTranslations).forEach(([lang, values]) => {
  translations[lang] = { ...(translations[lang] || {}), ...values };
});

const blogUiTranslations = {
  "zh-CN": {
    "Languages": "语言",
    "Read this article in another language.": "用其他语言阅读这篇文章。",
    "Read the blog library in another language.": "用其他语言阅读博客文章库。",
    "Directory": "目录",
    "Find articles faster.": "更快查找文章。",
    "Search the library": "搜索文章库",
    "No matching articles.": "没有匹配的文章。",
    "Article translations": "文章翻译",
    "Industry research library": "行业研究文章库",
    "Research Lens": "研究视角",
    "Question": "问题",
    "Working Insight": "核心洞察",
    "Decision Metrics": "决策指标",
    "Field Checklist": "现场检查清单",
    "Related Articles": "相关文章",
    "Read guide": "阅读指南"
  },
  "zh-TW": {
    "Languages": "語言",
    "Read this article in another language.": "用其他語言閱讀這篇文章。",
    "Read the blog library in another language.": "用其他語言閱讀部落格文章庫。",
    "Directory": "目錄",
    "Find articles faster.": "更快查找文章。",
    "Search the library": "搜尋文章庫",
    "No matching articles.": "沒有符合的文章。",
    "Article translations": "文章翻譯",
    "Industry research library": "產業研究文章庫",
    "Research Lens": "研究視角",
    "Question": "問題",
    "Working Insight": "核心洞察",
    "Decision Metrics": "決策指標",
    "Field Checklist": "現場檢查清單",
    "Related Articles": "相關文章",
    "Read guide": "閱讀指南"
  },
  es: {
    "Languages": "Idiomas",
    "Read this article in another language.": "Lee este artículo en otro idioma.",
    "Read the blog library in another language.": "Lee la biblioteca del blog en otro idioma.",
    "Directory": "Directorio",
    "Find articles faster.": "Encuentra artículos más rápido.",
    "Search the library": "Buscar en la biblioteca",
    "No matching articles.": "No hay artículos coincidentes.",
    "Article translations": "Traducciones del artículo",
    "Research Lens": "Enfoque de investigación",
    "Question": "Pregunta",
    "Working Insight": "Hallazgo principal",
    "Decision Metrics": "Métricas de decisión",
    "Field Checklist": "Lista de verificación",
    "Related Articles": "Artículos relacionados",
    "Read guide": "Leer guía"
  },
  pt: {
    "Languages": "Idiomas",
    "Read this article in another language.": "Leia este artigo em outro idioma.",
    "Read the blog library in another language.": "Leia a biblioteca do blog em outro idioma.",
    "Directory": "Diretório",
    "Find articles faster.": "Encontre artigos mais rápido.",
    "Search the library": "Pesquisar na biblioteca",
    "No matching articles.": "Nenhum artigo encontrado.",
    "Article translations": "Traduções do artigo",
    "Research Lens": "Perspectiva de pesquisa",
    "Question": "Pergunta",
    "Working Insight": "Insight principal",
    "Decision Metrics": "Métricas de decisão",
    "Field Checklist": "Lista de verificação",
    "Related Articles": "Artigos relacionados",
    "Read guide": "Ler guia"
  },
  fr: {
    "Languages": "Langues",
    "Read this article in another language.": "Lire cet article dans une autre langue.",
    "Read the blog library in another language.": "Lire la bibliothèque du blog dans une autre langue.",
    "Directory": "Répertoire",
    "Find articles faster.": "Trouvez les articles plus vite.",
    "Search the library": "Rechercher dans la bibliothèque",
    "No matching articles.": "Aucun article correspondant.",
    "Article translations": "Traductions de l’article",
    "Research Lens": "Angle de recherche",
    "Question": "Question",
    "Working Insight": "Idée clé",
    "Decision Metrics": "Indicateurs de décision",
    "Field Checklist": "Liste de contrôle",
    "Related Articles": "Articles liés",
    "Read guide": "Lire le guide"
  },
  de: {
    "Languages": "Sprachen",
    "Read this article in another language.": "Diesen Artikel in einer anderen Sprache lesen.",
    "Read the blog library in another language.": "Die Blogbibliothek in einer anderen Sprache lesen.",
    "Directory": "Verzeichnis",
    "Find articles faster.": "Artikel schneller finden.",
    "Search the library": "Bibliothek durchsuchen",
    "No matching articles.": "Keine passenden Artikel.",
    "Article translations": "Artikelübersetzungen",
    "Research Lens": "Recherchefokus",
    "Question": "Frage",
    "Working Insight": "Zentrale Erkenntnis",
    "Decision Metrics": "Entscheidungsmetriken",
    "Field Checklist": "Checkliste",
    "Related Articles": "Ähnliche Artikel",
    "Read guide": "Leitfaden lesen"
  },
  it: {
    "Languages": "Lingue",
    "Read this article in another language.": "Leggi questo articolo in un'altra lingua.",
    "Read the blog library in another language.": "Leggi la raccolta del blog in un'altra lingua.",
    "Directory": "Indice",
    "Find articles faster.": "Trova articoli più rapidamente.",
    "Search the library": "Cerca nella raccolta",
    "No matching articles.": "Nessun articolo corrispondente.",
    "Article translations": "Traduzioni dell’articolo",
    "Research Lens": "Prospettiva di ricerca",
    "Question": "Domanda",
    "Working Insight": "Intuizione principale",
    "Decision Metrics": "Metriche decisionali",
    "Field Checklist": "Lista di controllo",
    "Related Articles": "Articoli correlati",
    "Read guide": "Leggi guida"
  },
  ar: {
    "Languages": "اللغات",
    "Read this article in another language.": "اقرأ هذه المقالة بلغة أخرى.",
    "Read the blog library in another language.": "اقرأ مكتبة المدونة بلغة أخرى.",
    "Directory": "الفهرس",
    "Find articles faster.": "اعثر على المقالات بسرعة أكبر.",
    "Search the library": "ابحث في المكتبة",
    "No matching articles.": "لا توجد مقالات مطابقة.",
    "Article translations": "ترجمات المقالة",
    "Research Lens": "منظور البحث",
    "Question": "السؤال",
    "Working Insight": "الرؤية العملية",
    "Decision Metrics": "مقاييس القرار",
    "Field Checklist": "قائمة التحقق",
    "Related Articles": "مقالات ذات صلة",
    "Read guide": "اقرأ الدليل"
  },
  ja: {
    "Languages": "言語",
    "Read this article in another language.": "この記事を別の言語で読む。",
    "Read the blog library in another language.": "ブログライブラリを別の言語で読む。",
    "Directory": "目次",
    "Find articles faster.": "記事をすばやく探す。",
    "Search the library": "ライブラリを検索",
    "No matching articles.": "一致する記事はありません。",
    "Article translations": "記事の翻訳",
    "Research Lens": "リサーチ視点",
    "Question": "問い",
    "Working Insight": "実務上の洞察",
    "Decision Metrics": "判断指標",
    "Field Checklist": "現場チェックリスト",
    "Related Articles": "関連記事",
    "Read guide": "ガイドを読む"
  }
};

Object.entries(blogUiTranslations).forEach(([lang, values]) => {
  translations[lang] = { ...(translations[lang] || {}), ...values };
});

const dutchTranslations = {
  "/ CutList Calculator": "/ CutList-calculator",
  "/ Privacy Policy": "/ Privacybeleid",
  "/ QuiltFit Calculator": "/ QuiltFit-calculator",
  "/ Stringer Calculator": "/ Trapboomcalculator",
  "/ Terms of Service": "/ Servicevoorwaarden",
  "/ Tile Calculator": "/ Tegelcalculator",
  "1 back panel": "1 achterpaneel",
  "1 sheet": "1 plaat",
  "1/8 in saw kerf": "1/8 inch zaagsnede",
  "18-25% waste reduction on a typical cabinet project.": "18-25% minder afval bij een typisch kastproject.",
  "2 cabinet sides": "2 kastzijkanten",
  "2 sheets needed": "2 platen nodig",
  "21% estimated waste, about $55 saved": "21% geschat afval, ongeveer $55 bespaard",
  "21% waste estimate": "21% geschat afval",
  "3 plywood sheets": "3 multiplexplaten",
  "3 sheets": "3 platen",
  "3 sheets optimized": "3 platen geoptimaliseerd",
  "3 shelves": "3 planken",
  "4 sheets": "4 platen",
  "4 sheets purchased": "4 platen gekocht",
  "42% estimated waste exposure": "42% geschat afvalrisico",
  "42% waste risk": "42% afvalrisico",
  "96 x 48 plywood sheet": "96 x 48 multiplexplaat",
  "96 x 48 sheets, cabinet sides, shelves, dividers, and back panels.": "96 x 48 platen, kastzijkanten, planken, tussenschotten en achterpanelen.",
  "A cabinet run can burn money fast when layouts are guessed. WoodCutTool shows the material impact before the first sheet is broken down.": "Een kastenproject kan snel geld kosten wanneer de indeling wordt gegokt. WoodCutTool toont de materiaalimpact voordat de eerste plaat wordt opgedeeld.",
  "A visual material optimization tool makes the decision obvious: buy less, cut cleaner, keep useful offcuts.": "Een visuele materiaaloptimalisatietool maakt de keuze duidelijk: minder kopen, schoner zagen en bruikbare resten bewaren.",
  "Add back panel": "Achterpaneel toevoegen",
  "Add part": "Onderdeel toevoegen",
  "Add parts": "Onderdelen toevoegen",
  "Add sample parts": "Voorbeeldonderdelen toevoegen",
  "Add shelf": "Plank toevoegen",
  "Add side panel": "Zijpaneel toevoegen",
  "After": "Na",
  "All rights reserved.": "Alle rechten voorbehouden.",
  "Always confirm local building requirements before cutting.": "Controleer altijd de lokale bouwvoorschriften voordat u gaat zagen.",
  "Animate Optimization": "Optimalisatie animeren",
  "App": "App",
  "Approximate stringer length": "Geschatte lengte van de trapboom",
  "Article translations": "Artikelvertalingen",
  "Availability": "Beschikbaarheid",
  "Back": "Achterkant",
  "Back panel": "Achterpaneel",
  "Backing fabric": "Achterstof",
  "Backing overage per side (in)": "Extra achterstof per zijde (in)",
  "Backing size": "Afmeting achterstof",
  "Base tile count": "Basisaantal tegels",
  "Batting size": "Afmeting tussenvulling",
  "Before": "Voor",
  "Binding": "Bies",
  "Block layout": "Blokindeling",
  "Blocks, backing, binding.": "Blokken, achterstof, bies.",
  "Board length (in)": "Planklengte (in)",
  "Board thickness (in)": "Plankdikte (in)",
  "Board width (in)": "Plankbreedte (in)",
  "Boards required": "Benodigde planken",
  "Border width (in)": "Randbreedte (in)",
  "Box and cost": "Doos en kosten",
  "Box coverage (ft²)": "Dekking per doos (ft²)",
  "Boxes required": "Benodigde dozen",
  "Boxes, cuts, waste.": "Dozen, sneden, afval.",
  "Browser only": "Alleen browser",
  "Built around shop outcomes, not software features.": "Gebouwd rond werkplaatsresultaten, niet rond softwarefuncties.",
  "Built for speed, not CAD complexity.": "Gebouwd voor snelheid, niet voor CAD-complexiteit.",
  "Built for workshop use": "Gemaakt voor gebruik in de werkplaats",
  "By using WoodCutTool, you agree to use the calculators as planning aids and to verify results before cutting or purchasing materials.": "Door WoodCutTool te gebruiken, gaat u ermee akkoord de calculators als planningshulpmiddel te gebruiken en resultaten te controleren voordat u zaagt of materiaal koopt.",
  "CAD setup": "CAD-instelling",
  "CAD tools": "CAD-tools",
  "Cabinet": "Kast",
  "Cabinet shops": "Kastenmakers",
  "Calculate Tile Material": "Tegelmateriaal berekenen",
  "Calculate a board-by-board cutting plan from stock dimensions, part sizes, quantities, and saw kerf. The optimizer runs in your browser with no server dependency.": "Bereken een zaagplan per plank op basis van voorraadmaten, onderdeelafmetingen, aantallen en zaagsnede. De optimizer draait in uw browser zonder server.",
  "Calculate block rows, columns, cut sizes, backing fabric, batting size, and binding strips for a quilt layout.": "Bereken blokrijen, kolommen, snijmaten, achterstof, tussenvulling en biesstroken voor een quiltindeling.",
  "Calculate material savings before the first cut.": "Bereken materiaalbesparing voor de eerste zaagsnede.",
  "Calculate quilt blocks, backing, batting, and binding.": "Bereken quiltblokken, achterstof, tussenvulling en bies.",
  "Calculate quilt fit": "Quiltpassing berekenen",
  "Calculate riser count, riser height, tread depth, stair angle, plumb cut angle, and approximate stringer length from total rise and run.": "Bereken aantal stootborden, stootbordhoogte, aantreediepte, traphoek, loodsnedehoek en geschatte trapboomlengte uit totale stijging en loop.",
  "Calculate risers, tread depth, stair angle, plumb cut angle, and stringer length for stair layout.": "Bereken stootborden, aantreediepte, traphoek, loodsnedehoek en trapboomlengte voor de trapindeling.",
  "Calculate stair layout from rise and run.": "Bereken trapindeling uit stijging en loop.",
  "Calculate stair risers, treads, angle, and stringer length.": "Bereken stootborden, treden, hoek en trapboomlengte.",
  "Calculate stair risers, treads, angles, and stringer length.": "Bereken stootborden, treden, hoeken en trapboomlengte.",
  "Calculate stringer": "Trapboom berekenen",
  "Calculate tile": "Tegels berekenen",
  "Calculator result preview": "Voorbeeld van calculatorresultaat",
  "Changes": "Wijzigingen",
  "Check local code: riser height is above 7.75 in.": "Controleer lokale regels: de stootbordhoogte is hoger dan 7,75 inch.",
  "Choose a calculator by looking at the job.": "Kies een calculator op basis van de klus.",
  "Choose the right tool": "Kies het juiste hulpmiddel",
  "Compare before optimization": "Vergelijk voor optimalisatie",
  "Contact": "Contact",
  "Contact Email": "Contact-e-mail",
  "Contact email": "Contact-e-mail",
  "Continue in QuiltFit": "Verder in QuiltFit",
  "Contractors": "Aannemers",
  "Convert room dimensions and tile size into tile count, waste allowance, boxes required, cost, and edge-cut planning.": "Zet kamerafmetingen en tegelformaat om naar tegelaantal, afvalmarge, benodigde dozen, kosten en planning van randsneden.",
  "Coverage to buy": "Te kopen dekking",
  "Cut List Optimization Tips": "Tips voor zaaglijstoptimalisatie",
  "Cut block size": "Snijmaat blok",
  "Cut history": "Zaaggeschiedenis",
  "Cut length": "Zaaglengte",
  "Cut list optimizer for plywood cutting": "Zaaglijstoptimizer voor multiplex",
  "Cut pieces": "Te zagen onderdelen",
  "Cut plan generated": "Zaagplan gegenereerd",
  "Cut plan results": "Resultaten zaagplan",
  "CutList Calculator": "CutList-calculator",
  "CutList is the primary plywood layout tool; QuiltFit, Tile, and Stringer cover the other planning moments.": "CutList is de hoofdtool voor multiplexindeling; QuiltFit, Tegel en Trapboom dekken de andere planningsmomenten.",
  "CutList optimizer": "CutList-optimizer",
  "CutList visual planner": "Visuele CutList-planner",
  "DIY users": "Doe-het-zelvers",
  "Decision Metrics": "Beslissingsstatistieken",
  "Demo actions": "Demo-acties",
  "Design quilt patterns": "Quiltpatronen ontwerpen",
  "Design the full quilt in QuiltFit for iPhone": "Ontwerp de volledige quilt in QuiltFit voor iPhone",
  "Desk": "Bureau",
  "Directory": "Overzicht",
  "Download CutList": "CutList downloaden",
  "Download CutList iOS": "CutList iOS downloaden",
  "Download QuiltFit": "QuiltFit downloaden",
  "Download QuiltFit iOS": "QuiltFit iOS downloaden",
  "Email:": "E-mail:",
  "Enter a sheet size to preview a material optimization tool workflow.": "Voer een plaatafmeting in om een materiaaloptimalisatieworkflow te bekijken.",
  "Enter parts once and get a visual sheet layout, waste estimate, and a money-saving decision before cutting.": "Voer onderdelen een keer in en krijg voor het zagen een visuele plaatindeling, afvalschatting en kostenbesparende keuze.",
  "Enter your pieces and run the calculator to see boards required, cut sequence, and waste percentage.": "Voer uw onderdelen in en start de calculator om benodigde planken, zaagvolgorde en afvalpercentage te zien.",
  "Estimate boxes and waste for floor or wall tile.": "Schat dozen en afval voor vloer- of wandtegels.",
  "Estimate floor tile count, boxes, and waste.": "Schat aantal vloertegels, dozen en afval.",
  "Estimate how many tiles and boxes to buy from room size, tile size, grout joint, waste allowance, box coverage, and price per box.": "Schat hoeveel tegels en dozen u moet kopen op basis van kamermaat, tegelformaat, voeg, afvalmarge, doosdekking en prijs per doos.",
  "Estimate material needs before heading to the job site.": "Schat de materiaalbehoefte voordat u naar de klus gaat.",
  "Estimate tile before ordering": "Schat tegels voor u bestelt",
  "Estimate tile count, boxes, waste, and material cost.": "Schat tegelaantal, dozen, afval en materiaalkosten.",
  "Estimated tile cost": "Geschatte tegelkosten",
  "External links": "Externe links",
  "Fabric setup": "Stofinstellingen",
  "Fabric shopping list": "Stoffenboodschappenlijst",
  "Fabric width (in)": "Stofbreedte (in)",
  "Fast static calculators for planning before you cut.": "Snelle statische calculators voor planning voordat u zaagt.",
  "Field Checklist": "Werkplaatschecklist",
  "Field layout": "Veldindeling",
  "Find articles faster.": "Vind artikelen sneller.",
  "Finished block (in)": "Afgewerkt blok (in)",
  "Finished quilt": "Afgewerkte quilt",
  "Finished top": "Afgewerkte top",
  "Fit a quilt top from finished size, block size, seam allowance, border width, and backing overage. The calculator estimates blocks, backing, batting, and binding, then sends serious planning into QuiltFit for iPhone.": "Pas een quilttop op basis van eindmaat, blokmaat, naadtoeslag, randbreedte en extra achterstof. De calculator schat blokken, achterstof, tussenvulling en bies en stuurt serieuze planning door naar QuiltFit voor iPhone.",
  "Fit blocks, backing, batting, and binding for quilt planning.": "Pas blokken, achterstof, tussenvulling en bies voor quiltplanning.",
  "Fit quilt blocks and backing": "Pas quiltblokken en achterstof",
  "Floor": "Vloer",
  "Floor and wall tile estimator": "Calculator voor vloer- en wandtegels",
  "Footer navigation": "Footernavigatie",
  "For builders who care about every sheet.": "Voor makers die om elke plaat geven.",
  "Free woodworking calculator for sheet cutting": "Gratis houtbewerkingscalculator voor plaatzagen",
  "From rough idea to cut-ready board.": "Van ruwe gedachte naar zaagklare plank.",
  "Furniture builders": "Meubelmakers",
  "Generate Cut Plan": "Zaagplan maken",
  "Generate a visual sheet layout before you cut.": "Maak een visuele plaatindeling voordat u zaagt.",
  "Generate precise stair cuts instantly": "Genereer direct nauwkeurige trapzaagsneden",
  "Grain, kerf, batching.": "Nerf, zaagsnede, batching.",
  "Group cuts, reduce waste.": "Groepeer sneden, verminder afval.",
  "Grout joint (in)": "Voegbreedte (in)",
  "Guides": "Gidsen",
  "Home": "Home",
  "How to reduce sheet waste with grain direction, kerf planning, and batching.": "Hoe u plaatafval vermindert met nerfrichting, zaagsnedplanning en batching.",
  "If you contact us by email, we may use your email address and message only to respond to your request.": "Als u per e-mail contact opneemt, gebruiken we uw e-mailadres en bericht alleen om op uw verzoek te reageren.",
  "Industry research library": "Bibliotheek met brancheonderzoek",
  "Information we collect": "Informatie die we verzamelen",
  "Input": "Invoer",
  "Input -> output -> savings, before you buy plywood.": "Invoer -> uitvoer -> besparing, voordat u multiplex koopt.",
  "Instant cut plan": "Direct zaagplan",
  "Instant layout, no learning curve.": "Directe indeling, geen leercurve.",
  "Kerf loss": "Verlies door zaagsnede",
  "Kitchen cabinet project: 4 sheets planned, fewer sheets wasted.": "Keukenkastproject: 4 platen gepland, minder platen verspild.",
  "Language": "Taal",
  "Languages": "Talen",
  "Layout updates instantly.": "De indeling wordt direct bijgewerkt.",
  "Learn how to reduce material waste.": "Leer hoe u materiaalafval vermindert.",
  "Learn how total rise, tread count, and stair angle affect a safe layout.": "Leer hoe totale stijging, aantal treden en traphoek een veilige indeling beinvloeden.",
  "Legal": "Juridisch",
  "Legal navigation": "Juridische navigatie",
  "Length (in)": "Lengte (in)",
  "Less waste, clearer cuts.": "Minder afval, duidelijkere sneden.",
  "Likely perimeter cuts": "Waarschijnlijke randsneden",
  "Links to App Store pages or other external services are provided for convenience. We are not responsible for third-party services.": "Links naar App Store-pagina's of andere externe diensten worden voor gemak aangeboden. Wij zijn niet verantwoordelijk voor diensten van derden.",
  "Live cut board": "Live zaagbord",
  "Manual formulas and hidden mistakes.": "Handmatige formules en verborgen fouten.",
  "Manual spreadsheet layout, repeated measurements, and safety stock added just in case.": "Handmatige spreadsheetindeling, herhaalde metingen en extra veiligheidsvoorraad voor de zekerheid.",
  "Max riser (in)": "Max. stootbord (in)",
  "Measure": "Meten",
  "Minimize plywood waste instantly": "Verminder multiplexafval direct",
  "Move from this quick estimate into the app to design patterns, build fabric shopping lists, track cut pieces, and follow step-by-step sewing.": "Ga van deze snelle schatting naar de app om patronen te ontwerpen, stoffenlijsten te maken, gesneden delen te volgen en stap voor stap te naaien.",
  "No data uploaded": "Geen gegevens geupload",
  "No login": "Geen login",
  "No login required": "Geen login nodig",
  "No login. Works in browser. No data upload.": "Geen login. Werkt in de browser. Geen gegevensupload.",
  "No matching articles.": "Geen overeenkomende artikelen.",
  "No professional advice": "Geen professioneel advies",
  "No upload": "Geen upload",
  "Offline projects": "Offline projecten",
  "Offline support": "Offline ondersteuning",
  "Offline support in CutList": "Offline ondersteuning in CutList",
  "Open CutList": "CutList openen",
  "Open CutList ->": "CutList openen ->",
  "Open QuiltFit": "QuiltFit openen",
  "Open QuiltFit ->": "QuiltFit openen ->",
  "Open Stringer ->": "Trapboom openen ->",
  "Open Tile Calculator ->": "Tegelcalculator openen ->",
  "Open full CutList optimizer": "Volledige CutList-optimizer openen",
  "Open stringer": "Trapboom openen",
  "Open tile calculator": "Tegelcalculator openen",
  "Optimize My Project": "Mijn project optimaliseren",
  "Optimize boards and parts for workshop projects.": "Optimaliseer planken en onderdelen voor werkplaatsprojecten.",
  "Optimize cut list": "Zaaglijst optimaliseren",
  "Optimize straight board cuts before buying lumber.": "Optimaliseer rechte plankzaagsneden voordat u hout koopt.",
  "Optimized cut layout": "Geoptimaliseerde zaagindeling",
  "Optimized cutting plan": "Geoptimaliseerd zaagplan",
  "Output": "Uitvoer",
  "PDF export": "PDF-export",
  "Pack": "Indelen",
  "Pack panels and shelves before sheet breakdown.": "Deel panelen en planken in voordat u platen opdeelt.",
  "Part name": "Onderdeelnaam",
  "Parts packed": "Onderdelen ingedeeld",
  "Parts packed into sheets with kerf accounted for and cleaner offcuts.": "Onderdelen in platen geplaatst met zaagsnede meegerekend en schonere resten.",
  "Pattern design": "Patroonontwerp",
  "Plan board cuts and waste before cutting material.": "Plan plankzaagsneden en afval voordat u materiaal zaagt.",
  "Plan clean cuts without learning CAD software.": "Plan nette sneden zonder CAD-software te leren.",
  "Plan in the browser. Save in the app.": "Plan in de browser. Bewaar in de app.",
  "Plan quilt block counts, backing, batting, and binding.": "Plan aantallen quiltblokken, achterstof, tussenvulling en bies.",
  "Plan sheet cuts, reduce material waste, and use a plywood layout tool directly in your browser.": "Plan plaatzaagsneden, verminder materiaalafval en gebruik een multiplexindelingstool direct in uw browser.",
  "Plumb cut angle": "Loodsnedehoek",
  "Plywood": "Multiplex",
  "Plywood Cutting Optimization": "Multiplexzaagoptimalisatie",
  "Plywood cutting optimizer": "Multiplexzaagoptimizer",
  "Plywood layout, cut order, waste.": "Multiplexindeling, zaagvolgorde, afval.",
  "Practical ways to group cuts, account for kerf, and preserve useful offcuts.": "Praktische manieren om sneden te groeperen, zaagsnede mee te rekenen en bruikbare resten te bewaren.",
  "Price per box": "Prijs per doos",
  "Primary": "Primair",
  "Privacy Policy": "Privacybeleid",
  "Project saving": "Project opslaan",
  "Qty": "Aantal",
  "Question": "Vraag",
  "Quilt fit result": "Resultaat quiltpassing",
  "Quilt layout planner": "Quiltindelingsplanner",
  "Quilt results": "Quiltresultaten",
  "QuiltFit Calculator": "QuiltFit-calculator",
  "QuiltFit planner": "QuiltFit-planner",
  "ROI preview": "Besparingsvoorbeeld",
  "Random demo": "Willekeurige demo",
  "Read guide": "Gids lezen",
  "Read the blog library in another language.": "Lees de blogbibliotheek in een andere taal.",
  "Read this article in another language.": "Lees dit artikel in een andere taal.",
  "Real cut preview": "Echt zaagvoorbeeld",
  "Real job scenario": "Echt werkscenario",
  "Reduce expensive hardwood and plywood offcuts.": "Verminder dure hardhout- en multiplexresten.",
  "Related Articles": "Gerelateerde artikelen",
  "Remove": "Verwijderen",
  "Research Lens": "Onderzoeksblik",
  "Result": "Resultaat",
  "Rise, run, angles.": "Stijging, loop, hoeken.",
  "Rise, tread count, angle.": "Stijging, aantal treden, hoek.",
  "Riser height": "Stootbordhoogte",
  "Riser height is within the common 7.75 in residential maximum.": "De stootbordhoogte valt binnen het gebruikelijke residentiele maximum van 7,75 inch.",
  "Risers": "Stootborden",
  "Room area": "Kameroppervlak",
  "Room length (ft)": "Kamerlengte (ft)",
  "Room size": "Kamerafmeting",
  "Room width (ft)": "Kamerbreedte (ft)",
  "Run the calculator to get riser height, tread depth, number of steps, and cutting angles.": "Start de calculator voor stootbordhoogte, aantreediepte, aantal treden en zaaghoeken.",
  "Run the calculator to see block count, finished top size, backing fabric, batting size, and binding estimate.": "Start de calculator om aantal blokken, afgewerkte topmaat, achterstof, tussenvulling en biesschatting te zien.",
  "Run the calculator to see tiles to buy, boxes required, material coverage, cost, and a simple layout preview.": "Start de calculator om te kopen tegels, benodigde dozen, materiaaldekking, kosten en een eenvoudige indelingspreview te zien.",
  "Runs fully in browser": "Draait volledig in de browser",
  "Save": "Opslaan",
  "Save plywood, reduce material cost, and eliminate waste before cutting.": "Bespaar multiplex, verlaag materiaalkosten en beperk afval voordat u zaagt.",
  "Save projects offline, export PDF cut plans, and keep every board, sheet, and waste estimate organized while you build.": "Bewaar projecten offline, exporteer PDF-zaagplannen en houd elke plank, plaat en afvalschatting georganiseerd tijdens het bouwen.",
  "Save up to 20% material waste per project with a cleaner cut plan before you touch the saw.": "Bespaar tot 20% materiaalafval per project met een schoner zaagplan voordat u de zaag aanraakt.",
  "Saved": "Bespaard",
  "Savings": "Besparing",
  "Saw kerf (in)": "Zaagsnede (in)",
  "Seam allowance (in)": "Naadtoeslag (in)",
  "Search the library": "Bibliotheek doorzoeken",
  "See the waste before the saw starts.": "Zie het afval voordat de zaag start.",
  "Sheet cutting calculator": "Plaatzaagcalculator",
  "Sheet height": "Plaathoogte",
  "Sheet size and parts.": "Plaatformaat en onderdelen.",
  "Sheet width": "Plaatbreedte",
  "Sheets needed": "Benodigde platen",
  "Shelf": "Plank",
  "Shelves": "Planken",
  "Show before": "Voor tonen",
  "Show optimized": "Geoptimaliseerd tonen",
  "Show optimized layout": "Geoptimaliseerde indeling tonen",
  "Shuffle layout": "Indeling schudden",
  "Side": "Zijkant",
  "Sitemap": "Sitemap",
  "Skip to content": "Naar inhoud springen",
  "Some pages link to App Store product pages. Those external services are governed by their own privacy policies.": "Sommige pagina's linken naar App Store-productpagina's. Die externe diensten vallen onder hun eigen privacybeleid.",
  "Spreadsheets": "Spreadsheets",
  "Spreadsheets are easy to mistype. CAD tools are powerful but slow for quick material planning. WoodCutTool is for the moment before you cut.": "Spreadsheets zijn gevoelig voor typefouten. CAD-tools zijn krachtig maar traag voor snelle materiaalplanning. WoodCutTool is gemaakt voor het moment voordat u zaagt.",
  "Stair Stringer Calculator": "Trapboomcalculator",
  "Stair Stringer Calculator Guide": "Gids voor trapboomcalculator",
  "Stair angle": "Traphoek",
  "Stair dimensions": "Trapafmetingen",
  "Stair layout tool": "Trapindelingstool",
  "Stair stringer result": "Trapboomresultaat",
  "Stairs": "Trappen",
  "Start Free Optimization": "Gratis optimalisatie starten",
  "Start Saving Material Now": "Begin nu materiaal te besparen",
  "Start with the free woodworking calculator, then keep real CutList projects offline on iPhone.": "Begin met de gratis houtbewerkingscalculator en bewaar echte CutList-projecten daarna offline op iPhone.",
  "Static calculators for layout, cutting, and material planning.": "Statische calculators voor indeling, zagen en materiaalplanning.",
  "Static stair and material calculators for quick planning.": "Statische trap- en materiaalcalculators voor snelle planning.",
  "Static woodworking calculators. No login, no backend, no tracking database.": "Statische houtbewerkingscalculators. Geen login, geen backend, geen trackingdatabase.",
  "Step-by-step cutting guide": "Stap-voor-stap zaaggids",
  "Step-by-step sewing": "Stap-voor-stap naaien",
  "Stock board": "Voorraadplank",
  "Stringer": "Trapboom",
  "Stringer Calculator": "Trapboomcalculator",
  "Stringer calculator": "Trapboomcalculator",
  "Stringer results": "Trapboomresultaten",
  "Take this plan to the shop with CutList for iPhone": "Neem dit plan mee naar de werkplaats met CutList voor iPhone",
  "Target length (in)": "Doellengte (in)",
  "Target tread (in)": "Doelaantrede (in)",
  "Target width (in)": "Doelbreedte (in)",
  "Terms of Service": "Servicevoorwaarden",
  "The site does not provide engineering, construction, legal, or safety certification advice. For regulated projects, consult a qualified professional.": "De site geeft geen engineering-, bouw-, juridisch of veiligheidscertificeringsadvies. Raadpleeg voor gereguleerde projecten een gekwalificeerde professional.",
  "Third-party links": "Links van derden",
  "This is what saving material looks like.": "Zo ziet materiaalbesparing eruit.",
  "Tile": "Tegels",
  "Tile Calculator": "Tegelcalculator",
  "Tile calculator": "Tegelcalculator",
  "Tile calculator result": "Resultaat tegelcalculator",
  "Tile length (in)": "Tegellengte (in)",
  "Tile results": "Tegelresultaten",
  "Tile setup": "Tegelinstellingen",
  "Tile width (in)": "Tegelbreedte (in)",
  "Tiles to buy": "Te kopen tegels",
  "Too much setup for a quick cut plan.": "Te veel voorbereiding voor een snel zaagplan.",
  "Total blocks": "Totaal blokken",
  "Total rise (in)": "Totale stijging (in)",
  "Total run": "Totale loop",
  "Total run (in)": "Totale loop (in)",
  "Tread depth": "Aantreediepte",
  "Treads": "Treden",
  "Try Cut Planner Instantly": "Probeer de zaagplanner direct",
  "Try the layout": "Probeer de indeling",
  "Turn part sizes and quantities into a board-by-board cut list optimizer that shows what to cut first and what material remains.": "Zet onderdeelmaten en aantallen om in een zaaglijstoptimizer per plank die toont wat eerst wordt gezaagd en welk materiaal overblijft.",
  "Use WoodCutTool for fast browser planning, then save real projects in CutList for iPhone with offline support, PDF export, and project history.": "Gebruik WoodCutTool voor snelle browserplanning en bewaar echte projecten daarna in CutList voor iPhone met offline ondersteuning, PDF-export en projectgeschiedenis.",
  "Use cases": "Toepassingen",
  "Use of calculators": "Gebruik van calculators",
  "Use the iPhone app for pattern design, fabric shopping lists, visual cutting plans, cut-piece tracking, and step-by-step sewing.": "Gebruik de iPhone-app voor patroonontwerp, stoffenboodschappenlijsten, visuele snijplannen, tracking van gesneden delen en stap-voor-stap naaien.",
  "Visual cut layout, cut sequence, and reusable offcuts instead of another full sheet.": "Visuele zaagindeling, zaagvolgorde en herbruikbare resten in plaats van nog een volledige plaat.",
  "Visual cutting plan": "Visueel snijplan",
  "Visual tool picker": "Visuele toolkiezer",
  "Visual workflow": "Visuele workflow",
  "Waste": "Afval",
  "Waste allowance (%)": "Afvalmarge (%)",
  "Waste target": "Afvaldoel",
  "We may update this policy as the site changes. The current version is published on this page.": "We kunnen dit beleid bijwerken wanneer de site verandert. De huidige versie staat op deze pagina.",
  "We may update, change, or discontinue parts of the site at any time.": "We kunnen onderdelen van de site op elk moment bijwerken, wijzigen of stopzetten.",
  "Why different": "Waarom anders",
  "Width (in)": "Breedte (in)",
  "WoodCutTool does not require an account and does not ask you to upload project files. Calculator inputs are processed in your browser for the purpose of showing results.": "WoodCutTool vereist geen account en vraagt u niet om projectbestanden te uploaden. Calculatorinvoer wordt in uw browser verwerkt om resultaten te tonen.",
  "WoodCutTool helps cabinet makers, contractors, carpenters, and DIY builders plan cut lists instantly in the browser. No login, no upload, no CAD learning curve.": "WoodCutTool helpt kastenmakers, aannemers, timmerlieden en doe-het-zelvers direct zaaglijsten in de browser te plannen. Geen login, geen upload en geen CAD-leercurve.",
  "WoodCutTool makes the material saving visible like a calculator result: stock sheets in, optimized layout out, dollars saved per job.": "WoodCutTool maakt materiaalbesparing zichtbaar als een calculatorresultaat: voorraadplaten erin, geoptimaliseerde indeling eruit, dollars bespaard per klus.",
  "WoodCutTool provides browser-based calculators for layout, cutting, and material planning.": "WoodCutTool biedt browsercalculators voor indeling, zagen en materiaalplanning.",
  "WoodCutTool results are estimates. You are responsible for checking measurements, local building requirements, material conditions, tool setup, and safety practices before acting on any result.": "WoodCutTool-resultaten zijn schattingen. U bent verantwoordelijk voor het controleren van maten, lokale bouwvereisten, materiaalcondities, gereedschapsinstellingen en veiligheidspraktijken voordat u op een resultaat vertrouwt.",
  "Woodworking calculator for material savings": "Houtbewerkingscalculator voor materiaalbesparing",
  "Woodworking cut optimizer": "Houtzaagoptimizer",
  "Woodworking guides": "Houtbewerkingsgidsen",
  "Working Insight": "Werkbaar inzicht",
  "about": "ongeveer",
  "binding strips across width of fabric.": "biesstroken over de stofbreedte.",
  "degrees from level.": "graden vanaf waterpas.",
  "degrees from the stringer edge.": "graden vanaf de rand van de trapboom.",
  "edge tiles need checking against the room shape.": "randtegels moeten worden gecontroleerd tegen de kamervorm.",
  "estimated waste review": "afvalschatting bekijken",
  "ft² based on": "ft² op basis van",
  "ft² per tile.": "ft² per tegel.",
  "in before end cuts.": "in voor eindsneden.",
  "in fabric.": "in stof.",
  "in overage on each side.": "in extra aan elke zijde.",
  "in with": "in met",
  "in.": "in.",
  "instead of 2": "in plaats van 2",
  "of": "van",
  "panel": "paneel",
  "panels": "panelen",
  "sample parts": "voorbeeldonderdelen",
  "saved per project": "bespaard per project",
  "sheet": "plaat",
  "sheet saved": "plaat bespaard",
  "tiles before waste allowance.": "tegels voor afvalmarge.",
  "tiles by": "tegels bij",
  "tiles, plus": "tegels, plus",
  "typical savings": "typische besparing",
  "waste and breakage allowance.": "afval- en breukmarge.",
  "waste reduction": "afvalvermindering",
  "yards using": "yard met"
};

translations.nl = { ...(translations.nl || {}), ...dutchTranslations };

const originalTextNodes = new WeakMap();
const originalAttributes = new WeakMap();

const normalizeLang = (lang) => {
  const value = String(lang || "").toLowerCase();
  if (value.startsWith("zh-tw") || value.startsWith("zh-hk") || value.startsWith("zh-hant")) return "zh-TW";
  if (value.startsWith("zh")) return "zh-CN";
  if (value.startsWith("pt")) return "pt";
  if (value.startsWith("es")) return "es";
  if (value.startsWith("fr")) return "fr";
  if (value.startsWith("de")) return "de";
  if (value.startsWith("nl")) return "nl";
  if (value.startsWith("it")) return "it";
  if (value.startsWith("ar")) return "ar";
  if (value.startsWith("ja")) return "ja";
  return "en";
};

const getActiveLang = () => normalizeLang(localStorage.getItem("woodcuttool-lang") || navigator.language || "en");
const isBlogPage = () => Boolean(document.querySelector("[data-blog-index], .blog-article-shell"));
const googleTranslateLanguages = {
  "zh-CN": "zh-CN",
  "zh-TW": "zh-TW",
  es: "es",
  pt: "pt",
  fr: "fr",
  de: "de",
  nl: "nl",
  it: "it",
  ar: "ar",
  ja: "ja"
};
let googleTranslateReady = false;
let pendingGoogleTranslateLang = null;
let blogTranslationsPromise = null;
let blogTranslationsLoaded = false;

const translateString = (text, lang = getActiveLang()) => {
  if (lang === "en") return text;
  const dict = translations[lang] || {};
  const trimmed = text.trim();
  if (!trimmed) return text;
  const translated = dict[trimmed];
  if (!translated) return text;
  return text.replace(trimmed, translated);
};

const t = (text, lang = getActiveLang()) => translateString(text, lang);

function translateElement(root = document.body, lang = getActiveLang()) {
  if (!root) return;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      if (!parent || ["SCRIPT", "STYLE", "TEXTAREA", "OPTION"].includes(parent.tagName)) return NodeFilter.FILTER_REJECT;
      if (parent.matches("input, select")) return NodeFilter.FILTER_REJECT;
      return node.textContent.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    }
  });
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach((node) => {
    if (!originalTextNodes.has(node)) originalTextNodes.set(node, node.textContent);
    node.textContent = translateString(originalTextNodes.get(node), lang);
  });

  root.querySelectorAll?.("[aria-label], [title]").forEach((element) => {
    if (!originalAttributes.has(element)) {
      originalAttributes.set(element, {
        ariaLabel: element.getAttribute("aria-label"),
        title: element.getAttribute("title")
      });
    }
    const original = originalAttributes.get(element);
    if (original.ariaLabel) element.setAttribute("aria-label", translateString(original.ariaLabel, lang));
    if (original.title) element.setAttribute("title", translateString(original.title, lang));
  });
}

function loadBlogTranslations() {
  if (!isBlogPage()) return Promise.resolve();
  if (blogTranslationsLoaded) return Promise.resolve();
  if (!blogTranslationsPromise) {
    blogTranslationsPromise = fetch("/assets/blog-translations.json?v=20260620-i18n-nl-v2")
      .then((response) => {
        if (!response.ok) throw new Error(`Blog translations failed: ${response.status}`);
        return response.json();
      })
      .then((data) => {
        Object.entries(data || {}).forEach(([lang, values]) => {
          translations[lang] = { ...(translations[lang] || {}), ...values };
        });
        blogTranslationsLoaded = true;
      })
      .catch((error) => {
        console.warn(error);
      });
  }
  return blogTranslationsPromise;
}

function ensureGoogleTranslateElement() {
  if (document.getElementById("google_translate_element")) return;
  const holder = document.createElement("div");
  holder.id = "google_translate_element";
  holder.className = "google-translate-holder";
  holder.setAttribute("aria-hidden", "true");
  document.body.appendChild(holder);
}

function setGoogleTranslateCookie(lang) {
  const value = lang === "en" ? "" : `/en/${googleTranslateLanguages[lang] || lang}`;
  const cookie = value ? `googtrans=${value}; path=/` : "googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  document.cookie = cookie;
  document.cookie = cookie.replace("path=/", `domain=.${location.hostname}; path=/`);
}

function applyGoogleTranslate(lang) {
  if (!isBlogPage()) return;
  if (lang === "zh-CN" || lang === "zh-TW") return;
  const code = googleTranslateLanguages[lang];
  if (lang === "en") {
    setGoogleTranslateCookie("en");
    return;
  }
  if (!code) return;

  pendingGoogleTranslateLang = lang;
  setGoogleTranslateCookie(lang);
  ensureGoogleTranslateElement();

  if (!window.google?.translate?.TranslateElement && !document.querySelector("script[data-google-translate]")) {
    window.googleTranslateElementInit = () => {
      googleTranslateReady = true;
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: Object.values(googleTranslateLanguages).join(","),
          autoDisplay: false
        },
        "google_translate_element"
      );
      applyGoogleTranslate(pendingGoogleTranslateLang || lang);
    };

    const script = document.createElement("script");
    script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    script.dataset.googleTranslate = "true";
    document.head.appendChild(script);
    return;
  }

  const combo = document.querySelector(".goog-te-combo");
  if (!combo) {
    if (!googleTranslateReady) return;
    window.setTimeout(() => applyGoogleTranslate(lang), 250);
    return;
  }

  if (combo.value !== code) {
    combo.value = code;
    combo.dispatchEvent(new Event("change"));
  }
}

function setLanguage(lang) {
  const nextLang = normalizeLang(lang);
  localStorage.setItem("woodcuttool-lang", nextLang);
  document.documentElement.lang = nextLang;
  document.documentElement.dir = nextLang === "ar" ? "rtl" : "ltr";
  const selector = document.getElementById("language-select");
  if (selector) selector.value = nextLang;
  translateElement(document.body, nextLang);
  if (isBlogPage() && nextLang !== "en") {
    loadBlogTranslations().then(() => translateElement(document.body, nextLang));
  }
  applyGoogleTranslate(nextLang);
}

function initI18n() {
  const nav = document.querySelector(".nav");
  if (nav && !document.getElementById("language-select")) {
    const label = document.createElement("label");
    label.className = "language-picker";
    label.innerHTML = `
      <span>Language</span>
      <select id="language-select" aria-label="Language">
        ${Object.entries(LANGUAGE_OPTIONS).map(([value, name]) => `<option value="${value}">${name}</option>`).join("")}
      </select>
    `;
    nav.appendChild(label);
    label.querySelector("select").addEventListener("change", (event) => setLanguage(event.target.value));
  }

  setLanguage(getActiveLang());
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) translateElement(node, getActiveLang());
      });
    });
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

function initHeroCutPlanner() {
  const form = document.getElementById("hero-cut-form");
  const preview = document.getElementById("hero-plan-preview");
  if (!form || !preview) return;

  const presets = {
    cabinet: { width: 2440, height: 1220, waste: 18, parts: 5, sheets: 2, saved: 48 },
    shelves: { width: 2440, height: 1220, waste: 12, parts: 7, sheets: 2, saved: 64 },
    desk: { width: 2000, height: 900, waste: 24, parts: 4, sheets: 1, saved: 31 }
  };
  let activePreset = "cabinet";
  let addedParts = 0;
  let showBefore = false;

  const render = ({ animate = false } = {}) => {
    const width = Math.max(1, numberValue(form, "sheetWidth", 2440));
    const height = Math.max(1, numberValue(form, "sheetHeight", 1220));
    const wasteTarget = Math.max(8, Math.min(35, numberValue(form, "wasteTarget", presets[activePreset].waste)));
    const area = width * height;
    const baseParts = presets[activePreset]?.parts || 5;
    const sampleParts = Math.max(3, Math.min(10, Math.round(baseParts + addedParts + area / 4200000 - wasteTarget / 30)));
    const visibleWaste = showBefore
      ? Math.min(48, wasteTarget + 15 + addedParts * 3)
      : Math.max(6, wasteTarget - addedParts);
    const sheets = Math.max(
      1,
      Math.min(5, presets[activePreset].sheets + (sampleParts > 7 ? 1 : 0) + (showBefore && visibleWaste > 30 ? 1 : 0))
    );
    const saved = showBefore ? 0 : Math.max(18, Math.round(presets[activePreset].saved + (24 - wasteTarget) * 1.9 - addedParts * 3));
    const extraPieces = Array.from({ length: Math.min(3, Math.max(0, sampleParts - 5)) }, (_, index) => {
      const label = String.fromCharCode(70 + index);
      return `<span class="planner-part extra extra${index + 1}">${label}</span>`;
    }).join("");
    const boardClass = `planner-sheet advanced-sheet ${showBefore ? "layout-before" : "layout-optimized"} ${animate ? "is-optimizing" : ""}`;

    preview.innerHTML = `
      <div class="${boardClass}" aria-hidden="true">
        <span class="planner-part one">A</span>
        <span class="planner-part two">B</span>
        <span class="planner-part three">C</span>
        <span class="planner-part four">D</span>
        <span class="planner-part five">E</span>
        ${extraPieces}
        <span class="planner-waste">${format(visibleWaste, 0)}% ${t("Waste")}</span>
      </div>
      <div class="lab-stats">
        <div><strong>${sheets}</strong><span>${t("Sheets needed")}</span></div>
        <div><strong>${sampleParts}</strong><span>${t("Parts packed")}</span></div>
        <div><strong>$${saved}</strong><span>${t("Saved")}</span></div>
      </div>
    `;
    const compareButton = document.querySelector("[data-toggle-before]");
    if (compareButton) {
      compareButton.textContent = t(showBefore ? "Show optimized layout" : "Compare before optimization");
      compareButton.classList.toggle("active", showBefore);
    }
    translateElement(preview, getActiveLang());
  };

  const applyPreset = (name) => {
    const preset = presets[name];
    if (!preset) return;
    activePreset = name;
    addedParts = 0;
    showBefore = false;
    form.elements.sheetWidth.value = preset.width;
    form.elements.sheetHeight.value = preset.height;
    form.elements.wasteTarget.value = preset.waste;
    document.querySelectorAll("[data-preset]").forEach((button) => {
      button.classList.toggle("active", button.dataset.preset === name);
    });
    render({ animate: true });
  };

  document.querySelectorAll("[data-preset]").forEach((button) => {
    button.addEventListener("click", () => applyPreset(button.dataset.preset));
  });

  document.querySelectorAll("[data-add-part]").forEach((button) => {
    button.addEventListener("click", () => {
      addedParts = Math.min(3, addedParts + 1);
      showBefore = false;
      render({ animate: true });
    });
  });

  document.querySelector("[data-shuffle-layout]")?.addEventListener("click", () => {
    const names = Object.keys(presets);
    activePreset = names[Math.floor(Math.random() * names.length)];
    const preset = presets[activePreset];
    addedParts = Math.floor(Math.random() * 4);
    showBefore = false;
    form.elements.sheetWidth.value = preset.width;
    form.elements.sheetHeight.value = preset.height;
    form.elements.wasteTarget.value = Math.round(8 + Math.random() * 20);
    document.querySelectorAll("[data-preset]").forEach((button) => {
      button.classList.toggle("active", button.dataset.preset === activePreset);
    });
    render({ animate: true });
  });

  document.querySelector("[data-toggle-before]")?.addEventListener("click", () => {
    showBefore = !showBefore;
    render({ animate: true });
  });

  form.addEventListener("input", render);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    showBefore = false;
    render({ animate: true });
  });

  render();
}

const format = (value, digits = 2) => {
  if (!Number.isFinite(value)) return "0";
  const fixed = value.toFixed(digits);
  return fixed.replace(/\.?0+$/, "");
};

const numberValue = (form, name, fallback = 0) => {
  const input = form.elements[name];
  const value = input ? Number(input.value) : fallback;
  return Number.isFinite(value) ? value : fallback;
};

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const cutColors = ["#3478f6", "#f5a623", "#ff6b4a", "#31b56a", "#a96df0", "#2bb8c5", "#e05289"];

const appCta = () => `
  <div class="cta-panel" id="download-cutlist">
    <h3>Take this plan to the shop with CutList for iPhone</h3>
    <p>Save projects offline, export PDF cut plans, and keep every board, sheet, and waste estimate organized while you build.</p>
    <div class="cta-row">
      <a class="button" href="${APP_STORE_URL}" rel="nofollow">Download CutList iOS</a>
    </div>
    <ul class="feature-list" aria-label="CutList app features">
      <li>Offline support</li>
      <li>PDF export</li>
      <li>Project saving</li>
    </ul>
  </div>
`;

const quiltFitCta = () => `
  <div class="cta-panel" id="download-quiltfit">
    <h3>Design the full quilt in QuiltFit for iPhone</h3>
    <p>Move from this quick estimate into the app to design patterns, build fabric shopping lists, track cut pieces, and follow step-by-step sewing.</p>
    <div class="cta-row">
      <a class="button" href="${QUILTFIT_APP_STORE_URL}" rel="nofollow">Download QuiltFit iOS</a>
    </div>
    <ul class="feature-list" aria-label="QuiltFit app features">
      <li>Pattern design</li>
      <li>Fabric shopping list</li>
      <li>Visual cutting plan</li>
      <li>Step-by-step sewing</li>
    </ul>
  </div>
`;

function getRows(container) {
  return [...container.querySelectorAll(".piece-row")].map((row) => {
    const data = {};
    row.querySelectorAll("input").forEach((input) => {
      data[input.name] = input.name === "label" ? input.value.trim() : Number(input.value);
    });
    return data;
  });
}

function setupRows(containerId, addButtonId, template) {
  const container = document.getElementById(containerId);
  const addButton = document.getElementById(addButtonId);
  if (!container || !addButton) return;

  const refreshRemoveButtons = () => {
    container.querySelectorAll(".remove-row").forEach((button) => {
      button.disabled = container.children.length <= 1;
    });
  };

  addButton.addEventListener("click", () => {
    container.insertAdjacentHTML("beforeend", template());
    refreshRemoveButtons();
  });

  container.addEventListener("click", (event) => {
    if (!event.target.matches(".remove-row")) return;
    const row = event.target.closest(".piece-row");
    if (row && container.children.length > 1) row.remove();
    refreshRemoveButtons();
  });

  refreshRemoveButtons();
}

function summarizeParts(parts) {
  const expanded = [];
  parts.forEach((part, index) => {
    const quantity = Math.max(0, Math.floor(part.qty || 0));
    for (let i = 0; i < quantity; i += 1) {
      expanded.push({
        id: `${part.label || `Piece ${index + 1}`} ${i + 1}`,
        label: part.label || `Piece ${index + 1}`,
        length: Number(part.length),
        width: Number(part.width || 0),
        qty: 1
      });
    }
  });
  return expanded.filter((part) => part.length > 0);
}

function optimizeLinearCuts(parts, boardLength, boardWidth, kerf) {
  const allPieces = summarizeParts(parts);
  const pieces = allPieces
    .filter((part) => (part.width <= boardWidth || boardWidth <= 0) && part.length + kerf <= boardLength)
    .sort((a, b) => b.length - a.length);
  const rejected = allPieces.filter((part) => (boardWidth > 0 && part.width > boardWidth) || part.length + kerf > boardLength);
  const boards = [];

  pieces.forEach((piece) => {
    let placed = false;
    const cutLength = piece.length + kerf;
    for (const board of boards) {
      if (board.remaining >= cutLength) {
        board.cuts.push(piece);
        board.used += piece.length;
        board.kerf += kerf;
        board.remaining -= cutLength;
        placed = true;
        break;
      }
    }
    if (!placed) {
      boards.push({
        cuts: [piece],
        used: piece.length,
        kerf,
        remaining: boardLength - cutLength
      });
    }
  });

  const totalBoardLength = boards.length * boardLength;
  const usedLength = boards.reduce((sum, board) => sum + board.used, 0);
  const kerfLoss = boards.reduce((sum, board) => sum + board.kerf, 0);
  const wasteLength = Math.max(0, totalBoardLength - usedLength - kerfLoss);
  const wastePercent = totalBoardLength > 0 ? (wasteLength / totalBoardLength) * 100 : 0;
  return { boards, rejected, usedLength, kerfLoss, wasteLength, wastePercent };
}

function renderLinearPlan(result, boardLength) {
  if (!result.boards.length) return "<p class=\"notice\">No valid cuts fit the selected board width.</p>";
  const guide = result.boards.flatMap((board, boardIndex) =>
    board.cuts.map((cut, cutIndex) => `
      <li>
        <strong>Board ${boardIndex + 1}, cut ${cutIndex + 1}</strong>
        ${escapeHtml(cut.label)} at ${format(cut.length)} in.
      </li>
    `)
  ).join("");

  return `
    <div class="cut-visuals" aria-label="Visual cut layout">
      ${result.boards.map((board, index) => {
        const waste = Math.max(0, board.remaining);
        const cutText = board.cuts.map((cut) => `${escapeHtml(cut.label)} ${format(cut.length)} in`).join(", ");
        const segments = board.cuts.map((cut, cutIndex) => {
          const width = Math.max(2.4, (cut.length / boardLength) * 100);
          const color = cutColors[cutIndex % cutColors.length];
          const kerfWidth = Math.max(0.6, (result.boards.length ? result.boards[index].kerf / Math.max(board.cuts.length, 1) : 0) / boardLength * 100);
          return `
            <span class="cut-segment" style="--segment-width:${width}%; --segment-color:${color};">
              <b>${cutIndex + 1}</b>
              <span>${escapeHtml(cut.label)}</span>
              <small>${format(cut.length)} in</small>
            </span>
            <span class="kerf-segment" style="--kerf-width:${kerfWidth}%;" title="Saw kerf"></span>
          `;
        }).join("");
        const wasteWidth = Math.max(0, (waste / boardLength) * 100);
        return `
          <article class="cut-board-card">
            <div class="cut-board-header">
              <div>
                <strong>Board ${index + 1}</strong>
                <p>${cutText}</p>
              </div>
              <span>${format(boardLength)} in stock</span>
            </div>
            <div class="cut-board">
              ${segments}
              ${wasteWidth > 0 ? `<span class="waste-segment" style="--waste-width:${wasteWidth}%;">Waste<br><small>${format(waste)} in</small></span>` : ""}
            </div>
            <div class="cut-board-scale">
              <span>0 in</span>
              <span>${format(boardLength)} in</span>
            </div>
            <small>${format(waste)} in remaining after kerf.</small>
          </article>
        `;
      }).join("")}
    </div>
    <div class="cut-guide">
      <h3>Step-by-step cutting guide</h3>
      <ol>${guide}</ol>
    </div>
  `;
}

function initCutList() {
  const form = document.getElementById("cut-list-form");
  const result = document.getElementById("cut-list-result");
  if (!form || !result) return;

  setupRows("cut-rows", "add-cut-row", () => `
    <div class="piece-row four">
      <label>Part name <input name="label" value="Shelf"></label>
      <label>Length (in) <input name="length" type="number" min="0.01" step="0.01" value="24"></label>
      <label>Width (in) <input name="width" type="number" min="0.01" step="0.01" value="8"></label>
      <label>Qty <input name="qty" type="number" min="1" step="1" value="2"></label>
      <button class="button secondary remove-row" type="button">Remove</button>
    </div>
  `);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const boardLength = numberValue(form, "boardLength", 96);
    const boardWidth = numberValue(form, "boardWidth", 8);
    const kerf = numberValue(form, "kerf", 0.125);
    const parts = getRows(document.getElementById("cut-rows"));
    const plan = optimizeLinearCuts(parts, boardLength, boardWidth, kerf);
    const rejected = plan.rejected.length
      ? `<p class="notice">${plan.rejected.length} pieces are too large for the selected board and were excluded.</p>`
      : "";

    result.innerHTML = `
      <h2>Optimized cutting plan</h2>
      <div class="metric-grid">
        <div class="metric"><strong>${plan.boards.length}</strong><span>Boards required</span></div>
        <div class="metric"><strong>${format(plan.wastePercent)}%</strong><span>Waste</span></div>
        <div class="metric"><strong>${format(plan.usedLength)} in</strong><span>Cut length</span></div>
        <div class="metric"><strong>${format(plan.kerfLoss)} in</strong><span>Kerf loss</span></div>
      </div>
      ${renderLinearPlan(plan, boardLength)}
      ${rejected}
      ${appCta()}
    `;
    translateElement(result, getActiveLang());
  });
}

function packSheets(parts, sheetLength, sheetWidth, kerf, allowRotate) {
  const pieces = summarizeParts(parts)
    .filter((part) => part.width > 0)
    .sort((a, b) => Math.max(b.length, b.width) - Math.max(a.length, a.width));
  const sheets = [];

  const newSheet = () => ({ rows: [], placements: [], usedArea: 0 });
  const placeOnSheet = (sheet, piece) => {
    const orientations = allowRotate
      ? [
          { w: piece.width, h: piece.length, rotated: false },
          { w: piece.length, h: piece.width, rotated: true }
        ]
      : [{ w: piece.width, h: piece.length, rotated: false }];

    for (const row of sheet.rows) {
      for (const o of orientations) {
        if (o.w <= row.remainingWidth && o.h <= row.height) {
          const placement = { ...piece, x: row.x, y: row.y, w: o.w, h: o.h, rotated: o.rotated };
          sheet.placements.push(placement);
          sheet.usedArea += o.w * o.h;
          row.x += o.w + kerf;
          row.remainingWidth -= o.w + kerf;
          return true;
        }
      }
    }

    const usedHeight = sheet.rows.reduce((sum, row) => sum + row.height + kerf, 0);
    for (const o of orientations) {
      if (o.w <= sheetWidth && usedHeight + o.h <= sheetLength) {
        const row = { x: 0, y: usedHeight, height: o.h, remainingWidth: sheetWidth - o.w - kerf };
        sheet.rows.push(row);
        sheet.placements.push({ ...piece, x: 0, y: usedHeight, w: o.w, h: o.h, rotated: o.rotated });
        sheet.usedArea += o.w * o.h;
        row.x = o.w + kerf;
        return true;
      }
    }
    return false;
  };

  const rejected = [];
  pieces.forEach((piece) => {
    const fits = allowRotate
      ? (piece.width <= sheetWidth && piece.length <= sheetLength) || (piece.length <= sheetWidth && piece.width <= sheetLength)
      : piece.width <= sheetWidth && piece.length <= sheetLength;
    if (!fits) {
      rejected.push(piece);
      return;
    }
    let placed = false;
    for (const sheet of sheets) {
      if (placeOnSheet(sheet, piece)) {
        placed = true;
        break;
      }
    }
    if (!placed) {
      const sheet = newSheet();
      placeOnSheet(sheet, piece);
      sheets.push(sheet);
    }
  });

  const sheetArea = sheetLength * sheetWidth;
  const usedArea = sheets.reduce((sum, sheet) => sum + sheet.usedArea, 0);
  const wastePercent = sheets.length ? ((sheets.length * sheetArea - usedArea) / (sheets.length * sheetArea)) * 100 : 0;
  return { sheets, rejected, usedArea, wastePercent };
}

function drawSheet(canvas, sheets, sheetLength, sheetWidth) {
  if (!canvas || !sheets.length) return;
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const width = canvas.clientWidth;
  const height = Math.max(360, Math.min(560, width * 0.92));
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);

  const sheet = sheets[0];
  const pad = 18;
  const scale = Math.min((width - pad * 2) / sheetWidth, (height - pad * 2) / sheetLength);
  const originX = (width - sheetWidth * scale) / 2;
  const originY = (height - sheetLength * scale) / 2;

  ctx.shadowColor = "rgba(25, 42, 70, 0.16)";
  ctx.shadowBlur = 18;
  ctx.shadowOffsetY = 8;
  ctx.fillStyle = "#fff2c8";
  ctx.strokeStyle = "#8b5a20";
  ctx.lineWidth = 3;
  ctx.fillRect(originX, originY, sheetWidth * scale, sheetLength * scale);
  ctx.shadowColor = "transparent";
  ctx.strokeRect(originX, originY, sheetWidth * scale, sheetLength * scale);

  const colors = ["#2f80ed", "#f5a623", "#ff6b3d", "#25c46a", "#9b51e0", "#21b8c7", "#e94f86", "#7fdb6a"];
  sheet.placements.forEach((part, index) => {
    const x = originX + part.x * scale;
    const y = originY + part.y * scale;
    const w = part.w * scale;
    const h = part.h * scale;
    ctx.fillStyle = colors[index % colors.length];
    ctx.globalAlpha = 0.98;
    ctx.fillRect(x, y, w, h);
    ctx.globalAlpha = 1;
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, w, h);
    if (w > 36 && h > 26) {
      ctx.fillStyle = "rgba(255, 255, 255, 0.94)";
      ctx.beginPath();
      ctx.arc(x + 17, y + 17, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = colors[index % colors.length];
      ctx.font = "700 13px system-ui";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(String(index + 1), x + 17, y + 17);
      if (w > 70 && h > 48) {
        ctx.fillStyle = "#ffffff";
        ctx.font = "800 13px system-ui";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        const label = part.label.length > 14 ? `${part.label.slice(0, 13)}...` : part.label;
        ctx.fillText(label, x + w / 2, y + h / 2 + 8);
      }
      ctx.textAlign = "start";
      ctx.textBaseline = "alphabetic";
    }
  });
}

function initPlywood() {
  const form = document.getElementById("plywood-form");
  const result = document.getElementById("plywood-result");
  if (!form || !result) return;

  setupRows("plywood-rows", "add-plywood-row", () => `
    <div class="piece-row four">
      <label>Panel name <input name="label" value="Panel"></label>
      <label>Length (in) <input name="length" type="number" min="0.01" step="0.01" value="30"></label>
      <label>Width (in) <input name="width" type="number" min="0.01" step="0.01" value="18"></label>
      <label>Qty <input name="qty" type="number" min="1" step="1" value="2"></label>
      <button class="button secondary remove-row" type="button">Remove</button>
    </div>
  `);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const sheetLength = numberValue(form, "sheetLength", 96);
    const sheetWidth = numberValue(form, "sheetWidth", 48);
    const kerf = numberValue(form, "kerf", 0.125);
    const allowRotate = form.elements.rotate.value === "yes";
    const packed = packSheets(getRows(document.getElementById("plywood-rows")), sheetLength, sheetWidth, kerf, allowRotate);
    const yieldPercent = Math.max(0, 100 - packed.wastePercent);
    const estimatedCost = packed.sheets.length * 42;
    const wasteValue = estimatedCost * (packed.wastePercent / 100);
    const sequence = packed.sheets.flatMap((sheet, sheetIndex) =>
      sheet.placements.map((part, index) => `<li><strong>Cut ${index + 1}, sheet ${sheetIndex + 1}</strong>: ${escapeHtml(part.label)} ${format(part.h)} x ${format(part.w)} in${part.rotated ? " rotated" : ""}</li>`)
    ).join("");

    result.innerHTML = `
      <h2>Plywood layout result</h2>
      <div class="app-result-card">
        <div class="app-metric-grid">
          <div class="app-metric yield"><small>Yield</small><strong>${format(yieldPercent, 1)}%</strong><span>Total yield</span></div>
          <div class="app-metric sheets"><small>Sheets</small><strong>${packed.sheets.length}</strong><span>Sheets used</span></div>
          <div class="app-metric cost"><small>Cost</small><strong>$${format(estimatedCost, 0)}</strong><span>Material cost</span></div>
          <div class="app-metric waste"><small>Waste</small><strong>$${format(wasteValue, 2)}</strong><span>Waste value</span></div>
        </div>
        <div class="app-action-row">
          <a class="button small app-action dark" href="${APP_STORE_URL}" rel="nofollow">Share PDF</a>
          <a class="button small app-action blue" href="${APP_STORE_URL}" rel="nofollow">Save Images</a>
          <a class="button small app-action blue" href="${APP_STORE_URL}" rel="nofollow">AirPrint</a>
        </div>
        <div class="app-tabs" aria-label="Layout view selector">
          <span class="active">Layout</span>
          <span>Parts View</span>
        </div>
        <div class="sheet-result-card">
          <div class="sheet-result-header">
            <div>
              <strong>Project sheet layout</strong>
              <span>Yield ${format(yieldPercent, 1)}% · Used ${format(packed.usedArea / 144)} ft² / Total ${format((packed.sheets.length * sheetLength * sheetWidth) / 144)} ft²</span>
            </div>
            <b>${format(yieldPercent, 1)}%</b>
          </div>
          <canvas class="sheet-preview" id="sheet-canvas" aria-label="First sheet layout preview"></canvas>
        </div>
      </div>
      <ul class="plan-list">${sequence || "<li>No parts fit the selected sheet size.</li>"}</ul>
      ${packed.rejected.length ? `<p class="notice">${packed.rejected.length} pieces are too large for the sheet.</p>` : ""}
      ${appCta()}
    `;
    drawSheet(document.getElementById("sheet-canvas"), packed.sheets, sheetLength, sheetWidth);
    translateElement(result, getActiveLang());
  });
}

function initStairs() {
  const form = document.getElementById("stair-form");
  const result = document.getElementById("stair-result");
  if (!form || !result) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const totalRise = numberValue(form, "totalRise", 108);
    const totalRun = numberValue(form, "totalRun", 120);
    const maxRiser = numberValue(form, "maxRiser", 7.75);
    const targetTread = numberValue(form, "targetTread", 10);
    const risers = Math.max(1, Math.ceil(totalRise / maxRiser));
    const treads = Math.max(1, risers - 1);
    const riserHeight = totalRise / risers;
    const treadDepth = totalRun > 0 ? totalRun / treads : targetTread;
    const actualRun = treadDepth * treads;
    const stairAngle = Math.atan(riserHeight / treadDepth) * (180 / Math.PI);
    const plumbAngle = 90 - stairAngle;
    const stringerLength = Math.sqrt(totalRise ** 2 + actualRun ** 2);
    const codeNote = riserHeight > 7.75 ? "Check local code: riser height is above 7.75 in." : "Riser height is within the common 7.75 in residential maximum.";

    result.innerHTML = `
      <h2>Stair stringer result</h2>
      <div class="metric-grid">
        <div class="metric"><strong>${risers}</strong><span>Risers</span></div>
        <div class="metric"><strong>${treads}</strong><span>Treads</span></div>
        <div class="metric"><strong>${format(riserHeight)} in</strong><span>Riser height</span></div>
        <div class="metric"><strong>${format(treadDepth)} in</strong><span>Tread depth</span></div>
      </div>
      <ul class="plan-list">
        <li><strong>${t("Stair angle")}</strong>: ${format(stairAngle)} ${t("degrees from level.")}</li>
        <li><strong>${t("Plumb cut angle")}</strong>: ${format(plumbAngle)} ${t("degrees from the stringer edge.")}</li>
        <li><strong>${t("Approximate stringer length")}</strong>: ${format(stringerLength)} ${t("in before end cuts.")}</li>
        <li><strong>${t("Total run")}</strong>: ${format(actualRun)} ${t("in.")}</li>
      </ul>
      <p class="notice">${t(codeNote)} ${t("Always confirm local building requirements before cutting.")}</p>
      ${appCta()}
    `;
    translateElement(result, getActiveLang());
  });
}

function initBoardFoot() {
  const form = document.getElementById("board-foot-form");
  const result = document.getElementById("board-foot-result");
  if (!form || !result) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const lengthFeet = numberValue(form, "lengthFeet", 8);
    const width = numberValue(form, "width", 6);
    const thickness = numberValue(form, "thickness", 1);
    const qty = numberValue(form, "qty", 1);
    const price = numberValue(form, "price", 0);
    const boardFeet = (thickness * width * lengthFeet * qty) / 12;
    const cost = boardFeet * price;

    result.innerHTML = `
      <h2>Board foot estimate</h2>
      <div class="metric-grid">
        <div class="metric"><strong>${format(boardFeet)}</strong><span>Board feet</span></div>
        <div class="metric"><strong>${format(cost)}</strong><span>Total cost</span></div>
        <div class="metric"><strong>${format(boardFeet / Math.max(qty, 1))}</strong><span>BF per board</span></div>
        <div class="metric"><strong>${format(price)}</strong><span>Price per BF</span></div>
      </div>
      ${appCta()}
    `;
    translateElement(result, getActiveLang());
  });
}

function initWaste() {
  const form = document.getElementById("waste-form");
  const result = document.getElementById("waste-result");
  if (!form || !result) return;

  setupRows("waste-rows", "add-waste-row", () => `
    <div class="piece-row four">
      <label>Part name <input name="label" value="Part"></label>
      <label>Length (in) <input name="length" type="number" min="0.01" step="0.01" value="24"></label>
      <label>Width (in) <input name="width" type="number" min="0.01" step="0.01" value="12"></label>
      <label>Qty <input name="qty" type="number" min="1" step="1" value="2"></label>
      <button class="button secondary remove-row" type="button">Remove</button>
    </div>
  `);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const stockLength = numberValue(form, "stockLength", 96);
    const stockWidth = numberValue(form, "stockWidth", 48);
    const stockQty = numberValue(form, "stockQty", 1);
    const cost = numberValue(form, "cost", 0);
    const stockArea = stockLength * stockWidth * stockQty;
    const usedArea = getRows(document.getElementById("waste-rows")).reduce((sum, part) => {
      return sum + Math.max(0, part.length || 0) * Math.max(0, part.width || 0) * Math.max(0, Math.floor(part.qty || 0));
    }, 0);
    const wasteArea = Math.max(0, stockArea - usedArea);
    const wastePercent = stockArea > 0 ? (wasteArea / stockArea) * 100 : 0;
    const wasteCost = stockArea > 0 ? cost * (wasteArea / stockArea) : 0;

    result.innerHTML = `
      <h2>Wood waste estimate</h2>
      <div class="metric-grid">
        <div class="metric"><strong>${format(wastePercent)}%</strong><span>Waste</span></div>
        <div class="metric"><strong>${format(usedArea / 144)}</strong><span>Sq ft used</span></div>
        <div class="metric"><strong>${format(wasteArea / 144)}</strong><span>Sq ft waste</span></div>
        <div class="metric"><strong>${format(wasteCost)}</strong><span>Waste cost</span></div>
      </div>
      ${appCta()}
    `;
    translateElement(result, getActiveLang());
  });
}

function initQuiltFit() {
  const form = document.getElementById("quiltfit-form");
  const result = document.getElementById("quiltfit-result");
  if (!form || !result) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const quiltWidth = numberValue(form, "quiltWidth", 60);
    const quiltLength = numberValue(form, "quiltLength", 72);
    const blockSize = numberValue(form, "blockSize", 10);
    const seamAllowance = numberValue(form, "seamAllowance", 0.25);
    const borderWidth = numberValue(form, "borderWidth", 2);
    const backingOverage = numberValue(form, "backingOverage", 4);
    const fabricWidth = numberValue(form, "fabricWidth", 42);

    const centerWidth = Math.max(1, quiltWidth - borderWidth * 2);
    const centerLength = Math.max(1, quiltLength - borderWidth * 2);
    const columns = Math.max(1, Math.ceil(centerWidth / blockSize));
    const rows = Math.max(1, Math.ceil(centerLength / blockSize));
    const blocks = columns * rows;
    const actualTopWidth = columns * blockSize + borderWidth * 2;
    const actualTopLength = rows * blockSize + borderWidth * 2;
    const cutBlockSize = blockSize + seamAllowance * 2;
    const backingWidth = actualTopWidth + backingOverage * 2;
    const backingLength = actualTopLength + backingOverage * 2;
    const backingPanels = Math.max(1, Math.ceil(backingWidth / fabricWidth));
    const backingYards = (backingLength * backingPanels) / 36;
    const bindingLength = (actualTopWidth + actualTopLength) * 2 + 12;
    const bindingStrips = Math.max(1, Math.ceil(bindingLength / fabricWidth));

    const gridCells = Array.from({ length: Math.min(blocks, 80) }, (_, index) => {
      const row = Math.floor(index / columns) + 1;
      const col = (index % columns) + 1;
      return `<span title="Block row ${row}, column ${col}">${index + 1}</span>`;
    }).join("");

    result.innerHTML = `
      <h2>Quilt fit result</h2>
      <div class="metric-grid">
        <div class="metric"><strong>${columns} x ${rows}</strong><span>Block layout</span></div>
        <div class="metric"><strong>${blocks}</strong><span>Total blocks</span></div>
        <div class="metric"><strong>${format(actualTopWidth)} x ${format(actualTopLength)} in</strong><span>Finished top</span></div>
        <div class="metric"><strong>${format(cutBlockSize)} in</strong><span>Cut block size</span></div>
      </div>
      <div class="quilt-preview" style="--quilt-cols:${Math.min(columns, 10)}" aria-label="Quilt block layout preview">
        ${gridCells}
      </div>
      <ul class="plan-list">
        <li><strong>${t("Backing size")}</strong>: ${format(backingWidth)} x ${format(backingLength)} ${t("in with")} ${format(backingOverage)} ${t("in overage on each side.")}</li>
        <li><strong>${t("Backing fabric")}</strong>: ${t("about")} ${format(backingYards, 2)} ${t("yards using")} ${backingPanels} ${t(backingPanels === 1 ? "panel" : "panels")} ${t("of")} ${format(fabricWidth)} ${t("in fabric.")}</li>
        <li><strong>${t("Batting size")}</strong>: ${format(backingWidth)} x ${format(backingLength)} ${t("in.")}</li>
        <li><strong>${t("Binding")}</strong>: ${t("about")} ${format(bindingLength)} ${t("in.")} ${bindingStrips} ${t("binding strips across width of fabric.")}</li>
      </ul>
      ${quiltFitCta()}
    `;
    translateElement(result, getActiveLang());
  });
}

function initTileCalculator() {
  const form = document.getElementById("tile-form");
  const result = document.getElementById("tile-result");
  if (!form || !result) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const roomLength = numberValue(form, "roomLength", 12);
    const roomWidth = numberValue(form, "roomWidth", 10);
    const tileLength = numberValue(form, "tileLength", 12);
    const tileWidth = numberValue(form, "tileWidth", 12);
    const grout = numberValue(form, "grout", 0.125);
    const wastePercent = numberValue(form, "wastePercent", 10);
    const boxCoverage = numberValue(form, "boxCoverage", 15);
    const pricePerBox = numberValue(form, "pricePerBox", 0);

    const roomArea = roomLength * roomWidth;
    const moduleLength = (tileLength + grout) / 12;
    const moduleWidth = (tileWidth + grout) / 12;
    const tileArea = (tileLength * tileWidth) / 144;
    const tilesLong = Math.max(1, Math.ceil(roomLength / moduleLength));
    const tilesWide = Math.max(1, Math.ceil(roomWidth / moduleWidth));
    const fieldTiles = tilesLong * tilesWide;
    const totalTiles = Math.ceil(fieldTiles * (1 + wastePercent / 100));
    const coverageNeeded = totalTiles * tileArea;
    const boxes = boxCoverage > 0 ? Math.ceil(coverageNeeded / boxCoverage) : 0;
    const estimatedCost = boxes * pricePerBox;
    const cutRows = Math.max(0, tilesLong * 2 + tilesWide * 2 - 4);

    const previewCells = Array.from({ length: Math.min(fieldTiles, 96) }, (_, index) => {
      const edge = index < tilesWide || index >= fieldTiles - tilesWide || index % tilesWide === 0 || index % tilesWide === tilesWide - 1;
      return `<span class="${edge ? "edge" : ""}"></span>`;
    }).join("");

    result.innerHTML = `
      <h2>Tile calculator result</h2>
      <div class="metric-grid">
        <div class="metric"><strong>${totalTiles}</strong><span>Tiles to buy</span></div>
        <div class="metric"><strong>${boxes}</strong><span>Boxes required</span></div>
        <div class="metric"><strong>${format(roomArea)} ft²</strong><span>Room area</span></div>
        <div class="metric"><strong>$${format(estimatedCost, 2)}</strong><span>Estimated tile cost</span></div>
      </div>
      <div class="tile-preview" style="--tile-cols:${Math.min(tilesWide, 12)}" aria-label="Tile layout preview">
        ${previewCells}
      </div>
      <ul class="plan-list">
        <li><strong>${t("Field layout")}</strong>: ${tilesLong} ${t("tiles by")} ${tilesWide} ${t("tiles before waste allowance.")}</li>
        <li><strong>${t("Base tile count")}</strong>: ${fieldTiles} ${t("tiles, plus")} ${format(wastePercent)}% ${t("waste and breakage allowance.")}</li>
        <li><strong>${t("Coverage to buy")}</strong>: ${t("about")} ${format(coverageNeeded)} ${t("ft² based on")} ${format(tileArea)} ${t("ft² per tile.")}</li>
        <li><strong>${t("Likely perimeter cuts")}</strong>: ${t("about")} ${cutRows} ${t("edge tiles need checking against the room shape.")}</li>
      </ul>
    `;
    translateElement(result, getActiveLang());
  });
}

function initBlogDirectorySearch() {
  const root = document.querySelector("[data-blog-index]");
  if (!root) return;

  const input = root.querySelector("[data-blog-search-input]");
  const status = root.querySelector("[data-blog-search-status]");
  const empty = root.querySelector("[data-blog-search-empty]");
  const featured = root.querySelector("[data-blog-featured]");
  const cards = [...root.querySelectorAll("[data-blog-card]")];
  const directoryItems = [...root.querySelectorAll("[data-blog-directory-item]")];
  const categoryLinks = [...root.querySelectorAll("[data-blog-category-link]")];
  const sections = [...root.querySelectorAll("[data-blog-section]")];
  if (!input) return;

  const normalize = (value) => String(value || "").toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim();
  const getTerms = () => normalize(input.value).split(" ").filter(Boolean);
  const isMatch = (element, terms) => {
    const searchText = `${element.dataset.blogSearch || ""} ${normalize(element.textContent)}`;
    return terms.every((term) => searchText.includes(term));
  };

  const applyFilter = () => {
    const terms = getTerms();
    let visibleItems = 0;
    const visibleByCategory = new Map();

    cards.forEach((card) => {
      const matched = !terms.length || isMatch(card, terms);
      card.hidden = !matched;
      card.style.display = matched ? "" : "none";
    });

    directoryItems.forEach((item) => {
      const matched = !terms.length || isMatch(item, terms);
      item.hidden = !matched;
      item.style.display = matched ? "" : "none";
      if (matched) {
        visibleItems += 1;
        const category = item.dataset.blogCategory || "";
        visibleByCategory.set(category, (visibleByCategory.get(category) || 0) + 1);
      }
    });

    categoryLinks.forEach((link) => {
      const category = link.dataset.blogCategoryLink || "";
      const count = visibleByCategory.get(category) || 0;
      const countElement = link.querySelector("[data-blog-category-count]");
      if (countElement) countElement.textContent = String(count);
      const hideLink = terms.length > 0 && count === 0;
      link.hidden = hideLink;
      link.style.display = hideLink ? "none" : "";
    });

    sections.forEach((section) => {
      const visibleCards = [...section.querySelectorAll("[data-blog-card]")].some((card) => !card.hidden);
      const hideSection = terms.length > 0 && !visibleCards;
      section.hidden = hideSection;
      section.style.display = hideSection ? "none" : "";
    });

    if (featured) {
      const visibleFeaturedCards = [...featured.querySelectorAll("[data-blog-card]")].some((card) => !card.hidden);
      const hideFeatured = terms.length > 0 && !visibleFeaturedCards;
      featured.hidden = hideFeatured;
      featured.style.display = hideFeatured ? "none" : "";
    }

    if (status) {
      status.textContent = terms.length ? `${visibleItems} matches` : `${directoryItems.length} articles`;
    }

    if (empty) {
      empty.hidden = visibleItems > 0;
    }
  };

  input.addEventListener("input", applyFilter);
  applyFilter();
}

document.addEventListener("DOMContentLoaded", () => {
  initI18n();
  initHeroCutPlanner();
  initCutList();
  initPlywood();
  initStairs();
  initBoardFoot();
  initWaste();
  initQuiltFit();
  initTileCalculator();
  initBlogDirectorySearch();
});
