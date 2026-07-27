import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { constructionTools } from "./construction-tool-data.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const siteUrl = "https://woodcuttool.com";
const appStoreApps = JSON.parse(
  readFileSync(join(root, "data", "app-store-apps.json"), "utf8")
);
const appStoreReviews = JSON.parse(
  readFileSync(join(root, "data", "app-store-reviews.json"), "utf8")
);
const appStoreAppsBySlug = new Map(appStoreApps.map((app) => [app.slug, app]));

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
    // These reviews are visibly rendered on this page from the same source.
    // Do not turn them into an aggregateRating: the source data is a selected
    // review feed, not a complete count of every App Store rating.
    appStoreReviewSlug: "cutlist-plywood-optimizer",
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
    path: "/kerf-calculator/",
    file: "kerf-calculator/index.html",
    name: "Kerf Calculator",
    subCategory: "Saw kerf calculator",
    operatingSystem: "Any",
    description: "Free saw kerf calculator for estimating material lost, remaining board length, and waste percentage from blade width, number of cuts, and stock length.",
    keywords: ["kerf calculator", "saw kerf calculator", "blade width calculator", "woodworking calculator", "cut list calculator"],
    features: ["Blade width input", "Cut count input", "Material lost estimate", "Remaining length estimate", "Waste percentage estimate", "CutList workflow link"],
    audience: "Woodworkers, carpenters, DIY builders, and small shops",
    howto: [
      ["Enter blade width", "Add the saw blade kerf or blade width that will be removed by each cut."],
      ["Enter the number of cuts", "Count each pass of the blade that removes material from the stock."],
      ["Enter board length", "Set the usable starting length of the board or strip before cutting."],
      ["Review material lost", "Check material lost, remaining length, and waste percentage before finalizing the cut list."]
    ],
    faq: [
      ...commonFaq,
      ["What is a kerf calculator?", "A kerf calculator estimates the material removed by a saw blade by multiplying blade width by the number of cuts."],
      ["Why should I calculate kerf before making a cut list?", "Kerf reduces the usable stock length, so including it before cutting helps prevent short final parts and more accurate waste estimates."]
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
  },
  {
    path: "/drill-bit-finder/",
    file: "drill-bit-finder/index.html",
    name: "Drill Bit Finder",
    subCategory: "Pilot hole size calculator",
    operatingSystem: "Any",
    description: "Free drill bit finder for matching screw diameter, material type, pilot holes, clearance holes, fractional bit sizes, and metric drill sizes.",
    keywords: ["drill bit finder", "pilot hole calculator", "screw pilot hole size", "woodworking drill bit"],
    features: ["Screw diameter input", "Softwood and hardwood pilot sizes", "Clearance hole estimate", "Fractional bit match", "Metric size reference"],
    audience: "Woodworkers, DIY builders, cabinet makers, and repair users",
    howto: [
      ["Enter the screw diameter", "Measure or select the screw shank diameter before drilling."],
      ["Choose the hole type", "Select a softwood pilot, hardwood pilot, or clearance hole based on the joint."],
      ["Review the nearest bit", "Use the suggested fractional and metric bit sizes as a starting point, then test in scrap."]
    ]
  },
  {
    path: "/fraction-calculator/",
    file: "fraction-calculator/index.html",
    name: "Fraction Calculator",
    subCategory: "Woodworking measurement converter",
    operatingSystem: "Any",
    description: "Free fraction calculator for converting common woodworking fractions into decimal inches, millimeters, and the nearest 1/32 inch.",
    keywords: ["fraction calculator", "woodworking fractions", "fraction to decimal inches", "shop measurement converter"],
    features: ["Whole-inch input", "Numerator and denominator input", "Decimal inches", "Millimeter conversion", "Nearest 1/32 inch"],
    audience: "Woodworkers, carpenters, DIY builders, and students",
    howto: [
      ["Enter the whole inches", "Add the whole-inch portion of the measurement, if any."],
      ["Enter the fraction", "Set the numerator and denominator from your plan or tape measure."],
      ["Read the converted measurement", "Use the decimal and millimeter result for a cut list or shop layout."]
    ]
  },
  {
    path: "/inch-mm-converter/",
    file: "inch-mm-converter/index.html",
    name: "Inch to mm Converter",
    subCategory: "Imperial and metric measurement converter",
    operatingSystem: "Any",
    description: "Free inch to mm converter for woodworking plans, hardware sizes, sheet goods, cabinet layouts, and mixed imperial or metric measurements.",
    keywords: ["inch to mm converter", "mm to inches converter", "woodworking measurement converter", "imperial metric converter"],
    features: ["Inches to millimeters", "Millimeters to inches", "Feet conversion", "Fractional inch reference"],
    audience: "Woodworkers, cabinet makers, DIY builders, and makers",
    howto: [
      ["Choose a conversion direction", "Select inches to millimeters or millimeters to inches."],
      ["Enter the measurement", "Add the dimension from the plan, hardware specification, or material label."],
      ["Use the practical result", "Review the converted value and fractional-inch reference before marking stock."]
    ]
  },
  {
    path: "/lumber-calculator/",
    file: "lumber-calculator/index.html",
    name: "Lumber Calculator",
    subCategory: "Lumber volume and cost calculator",
    operatingSystem: "Any",
    description: "Free lumber calculator for estimating board feet, linear feet, waste allowance, and cost from board dimensions, quantity, and price.",
    keywords: ["lumber calculator", "board foot calculator", "lumber cost calculator", "woodworking material estimate"],
    features: ["Board foot estimate", "Linear feet estimate", "Waste allowance", "Lumber cost estimate", "Quantity input"],
    audience: "Woodworkers, carpenters, cabinet shops, and lumber buyers",
    howto: [
      ["Enter board dimensions", "Set the lumber length, width, thickness, and quantity."],
      ["Set waste and price", "Add a practical waste allowance and the price per board foot."],
      ["Review the order estimate", "Check total board feet, linear feet, and estimated cost before buying stock."]
    ]
  },
  {
    path: "/material-cost-calculator/",
    file: "material-cost-calculator/index.html",
    name: "Material Cost Calculator",
    subCategory: "Woodworking project budget calculator",
    operatingSystem: "Any",
    description: "Free material cost calculator for estimating woodworking project costs from wood, sheet goods, hardware, finish, waste, tax, and labor.",
    keywords: ["material cost calculator", "woodworking project cost", "lumber cost estimate", "DIY project budget"],
    features: ["Wood and sheet-goods cost", "Hardware and finish cost", "Waste allowance", "Tax estimate", "Optional labor cost"],
    audience: "Woodworkers, DIY builders, cabinet makers, and project planners",
    howto: [
      ["Enter direct material costs", "Add wood, sheet goods, hardware, finish, and supply costs."],
      ["Set project allowances", "Include waste, tax, and optional labor inputs."],
      ["Review the budget", "Use the total estimate to compare design options before purchasing materials."]
    ]
  },
  {
    path: "/material-list-generator/",
    file: "material-list-generator/index.html",
    name: "Material List Generator",
    subCategory: "Woodworking material list builder",
    operatingSystem: "Any",
    description: "Free material list generator for turning woodworking part dimensions, quantities, and waste allowance into a practical project checklist.",
    keywords: ["material list generator", "woodworking material list", "cut list material estimate", "plywood sheet estimate"],
    features: ["Part name input", "Dimensions and quantities", "Area totals", "Waste allowance", "4x8 sheet equivalent"],
    audience: "Woodworkers, DIY builders, cabinet makers, and project planners",
    howto: [
      ["Add every project part", "Enter a name, dimensions, and quantity for each panel or part."],
      ["Set a realistic allowance", "Choose a waste allowance that fits the material and project risk."],
      ["Use the generated checklist", "Review the line items and sheet equivalent before moving to an exact layout."]
    ]
  },
  {
    path: "/screw-size-finder/",
    file: "screw-size-finder/index.html",
    name: "Screw Size Finder",
    subCategory: "Woodworking screw size calculator",
    operatingSystem: "Any",
    description: "Free screw size finder for estimating practical screw gauge, length, and pilot bit size from material thickness, joint type, and load.",
    keywords: ["screw size finder", "wood screw size calculator", "pilot bit size", "woodworking fastener guide"],
    features: ["Material thickness input", "Face and edge joint options", "Load selection", "Screw gauge estimate", "Pilot bit estimate"],
    audience: "Woodworkers, DIY builders, cabinet makers, and repair users",
    howto: [
      ["Enter material thickness", "Set the thickness of the part receiving the screw."],
      ["Choose the joint and load", "Select a face or edge joint and the expected load level."],
      ["Test the recommendation", "Use the screw and pilot-bit estimate as a starting point and test the joint in scrap."]
    ]
  },
  {
    path: "/sheet-calculator/",
    file: "sheet-calculator/index.html",
    name: "Sheet Calculator",
    subCategory: "Plywood and panel quantity calculator",
    operatingSystem: "Any",
    description: "Free sheet calculator for estimating plywood, MDF, melamine, and panel sheets from part size, quantity, waste allowance, and sheet price.",
    keywords: ["sheet calculator", "plywood sheet calculator", "MDF sheet calculator", "panel quantity estimator"],
    features: ["Custom sheet size", "Part dimension input", "Quantity input", "Waste allowance", "Sheet count and cost estimate"],
    audience: "Woodworkers, cabinet makers, DIY builders, and material planners",
    howto: [
      ["Set the stock sheet size", "Enter the dimensions and price of the sheet good you will buy."],
      ["Enter repeated parts", "Add a part length, width, quantity, and waste allowance."],
      ["Check an exact layout next", "Use this estimate first, then verify fit with the plywood cut calculator before buying."]
    ]
  },
  {
    path: "/wood-weight-calculator/",
    file: "wood-weight-calculator/index.html",
    name: "Wood Weight Calculator",
    subCategory: "Lumber and plywood weight calculator",
    operatingSystem: "Any",
    description: "Free wood weight calculator for estimating the handling and delivery weight of boards, plywood, MDF, and panels from dimensions and density.",
    keywords: ["wood weight calculator", "plywood weight calculator", "lumber weight calculator", "MDF weight estimate"],
    features: ["Board and sheet dimensions", "Quantity input", "Material density input", "Pounds and kilograms", "Weight per piece"],
    audience: "Woodworkers, DIY builders, delivery planners, and cabinet makers",
    howto: [
      ["Enter the part dimensions", "Set the length, width, thickness, and quantity of the boards or panels."],
      ["Use a material density", "Enter a density that matches the wood species or sheet material as closely as possible."],
      ["Plan handling safely", "Review total and per-piece weight before transport, lifting, or installation."]
    ]
  }
];

function appStoreReviewSchema(tool) {
  const reviewSource = appStoreReviews[tool.appStoreReviewSlug];
  if (!reviewSource?.reviews) return [];

  return reviewSource.reviews
    .filter((review) => (
      review.author
      && review.title
      && review.content
      && Number.isFinite(Number(review.rating))
      && review.updated
    ))
    .slice(0, 6)
    .map((review) => ({
      "@type": "Review",
      name: review.title,
      reviewBody: review.content,
      datePublished: review.updated.slice(0, 10),
      author: {
        "@type": "Person",
        name: review.author
      },
      reviewRating: {
        "@type": "Rating",
        ratingValue: Number(review.rating),
        bestRating: 5,
        worstRating: 1
      }
    }));
}

function appStoreAggregateRating(tool) {
  const app = appStoreAppsBySlug.get(tool.appStoreReviewSlug);
  const ratingValue = Number(app?.averageUserRating);
  const ratingCount = Number(app?.userRatingCount);

  if (!Number.isFinite(ratingValue) || ratingValue <= 0 || !Number.isInteger(ratingCount) || ratingCount < 1) {
    return null;
  }

  return {
    "@type": "AggregateRating",
    ratingValue,
    ratingCount,
    bestRating: 5,
    worstRating: 1
  };
}

function softwareSchema(tool, { includeReviews = false } = {}) {
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

  if (includeReviews) {
    const reviews = appStoreReviewSchema(tool);
    if (reviews.length) schema.review = reviews;

    const aggregateRating = appStoreAggregateRating(tool);
    if (aggregateRating) schema.aggregateRating = aggregateRating;
  }

  return schema;
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
  const graph = [organization, softwareSchema(tool, { includeReviews: true })];
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
  const browserTools = softwareTools.filter((tool) => !tool.path.startsWith("/apps/"));
  const referenceTools = [
    {
      path: "/wood/",
      name: "Wood Species Library"
    },
    ...constructionTools.map((tool) => ({ path: tool.route, name: tool.name }))
  ];
  const itemListElement = [...browserTools, ...referenceTools].map((tool, index) => ({
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
        description: "A topic hub for woodworking calculators, cut list optimization, deck and fence material estimates, stair layout, roof geometry, and practical DIY construction planning.",
        keywords: "woodworking calculator, cut list optimizer, deck calculator, fence calculator, roof pitch calculator, DIY construction tools",
        about: ["woodworking calculator", "cut list optimizer", "deck material planning", "fence material planning", "roof pitch", "DIY construction tools"],
        mainEntity: {
          "@type": "ItemList",
          itemListElement
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${siteUrl}/tools/#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: `${siteUrl}/`
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Tools",
            item: `${siteUrl}/tools/`
          }
        ]
      },
      ...browserTools.slice(0, 5).map(softwareSchema),
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
