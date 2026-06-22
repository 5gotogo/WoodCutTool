import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const siteUrl = "https://woodcuttool.com";

const organization = {
  "@type": "Organization",
  "@id": `${siteUrl}/#organization`,
  name: "WoodCutTool",
  url: siteUrl
};

const commonFaq = [
  [
    "What is a woodworking calculator?",
    "A woodworking calculator is a planning tool that helps estimate cut lists, plywood layouts, material quantities, board feet, waste percentage, and project cost before cutting or buying stock."
  ],
  [
    "What is a cut list optimizer?",
    "A cut list optimizer turns part dimensions, quantities, stock size, kerf, and layout rules into a cutting plan so woodworkers can reduce waste and review the project before cutting."
  ],
  [
    "How do I reduce wood waste?",
    "Reduce wood waste by measuring real stock, entering every part, accounting for saw kerf, reviewing grain direction, comparing layouts, and using a plywood or cut list calculator before buying material."
  ],
  [
    "Which WoodCutTool page should I use first?",
    "Start with the tools hub if you are choosing a workflow. Use the plywood cut calculator for sheet goods, the cut list calculator for boards, the wood waste calculator for scrap cost, and CutList for saved iPhone projects."
  ]
];

const softwareTools = [
  {
    path: "/apps/cutlist/",
    file: "apps/cutlist/index.html",
    name: "CutList: Plywood Optimizer",
    subCategory: "Cut list optimizer",
    operatingSystem: "iOS",
    description: "Offline iPhone cut list optimizer for plywood layout planning, cut optimization, material saving, kerf settings, saved projects, and PDF export.",
    keywords: ["cut list optimizer", "plywood layout planning", "woodworking calculator", "material saving", "reduce wood waste"],
    features: ["Cut optimization", "Plywood layout planning", "Saw kerf settings", "Material waste review", "Saved local projects", "PDF export"],
    audience: "Woodworkers, cabinet makers, carpenters, DIY builders, and small shops",
    offerUrl: "https://apps.apple.com/us/app/cutlist-plywood-optimizer/id6768171871",
    downloadUrl: "https://apps.apple.com/us/app/cutlist-plywood-optimizer/id6768171871",
    product: true,
    faq: [
      ...commonFaq,
      ["Is CutList a product or a free calculator?", "CutList is an iPhone app product for saved woodworking projects, offline plywood layouts, cut optimization, and PDF export. WoodCutTool also provides free browser calculators for quick estimates."],
      ["Does CutList work offline?", "Yes. CutList is designed for offline iPhone project planning with no account required for the core cut list workflow."]
    ]
  },
  {
    path: "/plywood-cut-calculator/",
    file: "plywood-cut-calculator/index.html",
    name: "Plywood Cut Calculator",
    subCategory: "Plywood layout calculator",
    operatingSystem: "Any",
    description: "Free browser-based plywood cut calculator for sheet size, part dimensions, saw kerf, rotation rules, sheet count, layout preview, and waste percentage.",
    keywords: ["plywood cut calculator", "sheet cutting optimizer", "plywood layout planner", "woodworking calculator", "reduce plywood waste"],
    features: ["Plywood sheet layout", "Part quantity planning", "Kerf allowance", "Rotation setting", "Waste percentage", "Sheet count estimate"],
    audience: "DIY woodworkers, cabinet makers, garage shops, and sheet-good users",
    howto: [
      ["Enter your sheet size", "Set the plywood sheet dimensions you plan to buy, such as 48 by 96 inches for a standard 4x8 sheet."],
      ["Add your parts and quantities", "List each panel with its width, length, and how many you need."],
      ["Set the saw kerf", "Enter your blade kerf (often 1/8 inch) so the layout accounts for material removed by each cut."],
      ["Review the layout and sheet count", "Check the generated sheet layout, sheet count, and waste percentage, then adjust parts if needed before buying."]
    ],
    faq: [
      ...commonFaq,
      ["What is a plywood cut calculator?", "A plywood cut calculator estimates how project parts fit on plywood sheets after sheet size, part dimensions, quantity, saw kerf, and rotation settings are entered."],
      ["Can this calculator replace CutList?", "Use the browser calculator for quick estimates. Use CutList when the project needs saved local layouts, offline access, PDF export, or repeat editing on iPhone."]
    ]
  },
  {
    path: "/cut-list-calculator/",
    file: "cut-list-calculator/index.html",
    name: "Cut List Calculator",
    subCategory: "Board cut list calculator",
    operatingSystem: "Any",
    description: "Free woodworking cut list calculator for board stock, part dimensions, quantities, saw kerf, optimized cutting order, and waste percentage.",
    keywords: ["cut list calculator", "woodworking calculator", "board cut optimizer", "material calculator", "wood waste calculator"],
    features: ["Board stock planning", "Cut sequence estimate", "Part quantity entry", "Saw kerf allowance", "Waste percentage", "Related plywood workflow links"],
    audience: "Woodworkers, carpenters, DIY builders, and small shops",
    howto: [
      ["Enter your board stock size", "Set the length and width of the board you are cutting from."],
      ["List your parts and quantities", "Add each part with its dimensions and the number you need."],
      ["Set the saw kerf", "Enter your blade kerf so the cutting plan reflects real material loss between cuts."],
      ["Review the cutting plan", "Check the optimized cut order and waste percentage before cutting your boards."]
    ],
    faq: [
      ...commonFaq,
      ["Is this calculator for boards or plywood?", "The cut list calculator is best for board stock and linear cut planning. Use the plywood cut calculator or CutList app for sheet goods."],
      ["Can a cut list calculator help with buying material?", "Yes. It helps estimate how boards will be consumed before purchasing stock, but final buying decisions should also consider defects, trimming, and extra allowance."]
    ]
  },
  {
    path: "/wood-waste-calculator/",
    file: "wood-waste-calculator/index.html",
    name: "Wood Waste Calculator",
    subCategory: "Material waste calculator",
    operatingSystem: "Any",
    description: "Free material calculator for estimating used area, scrap area, wood waste percentage, and waste cost from project parts and stock dimensions.",
    keywords: ["wood waste calculator", "material calculator", "reduce wood waste", "waste percentage", "scrap cost calculator"],
    features: ["Waste percentage estimate", "Used area estimate", "Scrap area estimate", "Waste cost estimate", "Board and sheet workflow links"],
    audience: "Woodworkers, DIY builders, remodelers, and material planners",
    howto: [
      ["Enter your stock dimensions", "Set the size of the boards or sheets you are buying."],
      ["Add your project parts", "List every part with its dimensions and quantity."],
      ["Add material price (optional)", "Enter a price per unit area to estimate the cost of the wasted material."],
      ["Review waste percentage and cost", "Check the used area, scrap area, waste percentage, and waste cost before buying."]
    ],
    faq: [
      ...commonFaq,
      ["What does a wood waste calculator measure?", "It compares stock material against project parts to estimate used material, leftover material, waste percentage, and waste cost."],
      ["Why does waste matter for SEO product intent?", "Users calculating waste are often close to buying material or choosing a cut list optimizer, so the page should connect estimates to practical tools like CutList."]
    ]
  },
  {
    path: "/board-foot-calculator/",
    file: "board-foot-calculator/index.html",
    name: "Board Foot Calculator",
    subCategory: "Lumber material calculator",
    operatingSystem: "Any",
    description: "Free board foot calculator for estimating lumber volume and rough material cost from thickness, width, length, quantity, and price.",
    keywords: ["board foot calculator", "lumber calculator", "material calculator", "woodworking calculator", "carpentry material estimate"],
    features: ["Board foot calculation", "Lumber volume estimate", "Price per board foot", "Material cost estimate", "Related cut list links"],
    audience: "Woodworkers, carpenters, cabinet shops, and lumber buyers",
    howto: [
      ["Enter board dimensions", "Set the thickness, width, and length of the lumber you are pricing."],
      ["Set the quantity", "Enter how many boards of this size you need."],
      ["Add price per board foot", "Enter the lumber price per board foot to estimate total cost."],
      ["Review board feet and cost", "Check the total board feet and material cost before buying."]
    ],
    faq: [
      ...commonFaq,
      ["What is a board foot calculator?", "A board foot calculator estimates lumber volume from board length, width, thickness, and quantity."],
      ["How does board foot estimating connect to cut lists?", "Board feet help estimate lumber volume and cost. A cut list then helps validate whether the purchased boards can be cut into the required parts."]
    ]
  },
  {
    path: "/stair-stringer-calculator/",
    file: "stair-stringer-calculator/index.html",
    name: "Stair Stringer Calculator",
    subCategory: "DIY construction calculator",
    operatingSystem: "Any",
    description: "Free stair stringer calculator for rise, run, riser count, tread depth, stair angle, and stringer length planning.",
    keywords: ["stair stringer calculator", "DIY construction tools", "stair calculator", "rise and run calculator", "construction calculator"],
    features: ["Riser count", "Tread depth", "Stair angle", "Stringer length", "Rise and run planning"],
    audience: "DIY builders, remodelers, carpenters, and construction planners",
    howto: [
      ["Enter total rise", "Measure and enter the total vertical rise from the lower floor to the upper floor."],
      ["Enter total run", "Enter the available horizontal run for the staircase."],
      ["Set preferred riser height", "Choose a target riser height so the calculator can work out the number of steps."],
      ["Review stringer layout", "Check riser height, tread depth, stair angle, and stringer length before cutting."]
    ]
  },
  {
    path: "/tile-calculator/",
    file: "tile-calculator/index.html",
    name: "Tile Calculator",
    subCategory: "Tile material calculator",
    operatingSystem: "Any",
    description: "Free tile material calculator for tile count, box count, waste allowance, coverage, grout joints, and estimated material cost.",
    keywords: ["tile calculator", "material calculator", "DIY construction tools", "tile box calculator", "tile waste calculator"],
    features: ["Tile count estimate", "Box count estimate", "Waste allowance", "Grout joint planning", "Material cost estimate"],
    audience: "DIY remodelers, tile installers, homeowners, and construction planners",
    howto: [
      ["Enter the area to tile", "Set the room or wall dimensions you plan to cover."],
      ["Enter your tile size", "Add the tile dimensions and the grout joint width."],
      ["Set a waste allowance", "Choose a waste percentage to cover cuts and breakage."],
      ["Review tiles and boxes needed", "Check the tile count, boxes required, coverage, and material cost before buying."]
    ]
  }
];

function softwareSchema(tool) {
  const url = `${siteUrl}${tool.path}`;
  const schema = {
    "@type": "SoftwareApplication",
    "@id": `${url}#software`,
    name: tool.name,
    url,
    applicationCategory: "UtilitiesApplication",
    applicationSubCategory: tool.subCategory,
    operatingSystem: tool.operatingSystem,
    description: tool.description,
    keywords: tool.keywords.join(", "),
    featureList: tool.features,
    isAccessibleForFree: true,
    audience: {
      "@type": "Audience",
      audienceType: tool.audience
    },
    provider: {
      "@id": `${siteUrl}/#organization`
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: tool.offerUrl || url
    },
    potentialAction: {
      "@type": "UseAction",
      target: url
    }
  };

  if (tool.downloadUrl) {
    schema.downloadUrl = tool.downloadUrl;
  }

  return schema;
}

function productSchema(tool) {
  const url = `${siteUrl}${tool.path}`;
  return {
    "@type": "Product",
    "@id": `${url}#product`,
    name: tool.name,
    brand: {
      "@id": `${siteUrl}/#organization`
    },
    category: "Woodworking software",
    description: tool.description,
    url,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: tool.offerUrl || url
    }
  };
}

function faqSchema(tool) {
  const faq = tool.faq || commonFaq;
  return {
    "@type": "FAQPage",
    "@id": `${siteUrl}${tool.path}#faq`,
    mainEntity: faq.map(([name, text]) => ({
      "@type": "Question",
      name,
      acceptedAnswer: {
        "@type": "Answer",
        text
      }
    }))
  };
}

function howToSchema(tool) {
  const url = `${siteUrl}${tool.path}`;
  return {
    "@type": "HowTo",
    "@id": `${url}#howto`,
    name: `How to use the ${tool.name}`,
    description: tool.description,
    step: tool.howto.map(([name, text], i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name,
      text,
      url: `${url}#step-${i + 1}`
    }))
  };
}

function pageGraph(tool) {
  const graph = [organization, softwareSchema(tool)];
  if (tool.product) {
    graph.push(productSchema(tool));
  }
  if (tool.howto) {
    graph.push(howToSchema(tool));
  }
  graph.push(faqSchema(tool));
  return {
    "@context": "https://schema.org",
    "@graph": graph
  };
}

function toolsHubGraph() {
  const itemListElement = softwareTools.map((tool, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: tool.name,
    url: `${siteUrl}${tool.path}`
  }));

  return {
    "@context": "https://schema.org",
    "@graph": [
      organization,
      {
        "@type": "CollectionPage",
        "@id": `${siteUrl}/tools/#collection`,
        name: "WoodCutTool Tools Hub",
        url: `${siteUrl}/tools/`,
        description: "A topic hub for woodworking calculators, material calculators, DIY construction tools, cut list optimizer workflows, and productivity apps by WoodCutTool.",
        keywords: "woodworking calculator, cut list optimizer, material calculator, DIY construction tools",
        about: ["woodworking calculator", "cut list optimizer", "material calculator", "DIY construction tools"],
        mainEntity: {
          "@type": "ItemList",
          itemListElement
        }
      },
      ...softwareTools.slice(0, 5).map(softwareSchema),
      {
        "@type": "FAQPage",
        "@id": `${siteUrl}/tools/#faq`,
        mainEntity: commonFaq.map(([name, text]) => ({
          "@type": "Question",
          name,
          acceptedAnswer: {
            "@type": "Answer",
            text
          }
        }))
      }
    ]
  };
}

function schemaScript(schema) {
  return `<script type="application/ld+json">\n  ${JSON.stringify(schema, null, 2)}\n  </script>`;
}

function replaceFirstJsonLd(file, schema) {
  const absolute = join(root, file);
  const html = readFileSync(absolute, "utf8");
  const script = schemaScript(schema);

  if (/<script type="application\/ld\+json">[\s\S]*?<\/script>/.test(html)) {
    writeFileSync(absolute, html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, script));
    return;
  }

  if (!html.includes("</head>")) {
    throw new Error(`No </head> tag found in ${file}`);
  }

  writeFileSync(absolute, html.replace("</head>", `  ${script}\n</head>`));
}

replaceFirstJsonLd("tools/index.html", toolsHubGraph());

for (const tool of softwareTools) {
  replaceFirstJsonLd(tool.file, pageGraph(tool));
}

console.log(`Applied JSON-LD schema to ${softwareTools.length + 1} tool pages.`);
