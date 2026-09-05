import {
  existsSync,
  mkdirSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import {
  componentCategories,
  componentModels,
} from "./cut-list-component-data.mjs";
import { componentEditorialBySlug } from "./cut-list-component-editorial.mjs";
import { evaluateCutListExpression } from "./cut-list-expression.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outputRoot = join(root, "tools", "components");
const siteUrl = "https://woodcuttool.com";
const ogImage = `${siteUrl}/assets/og/cut-list-components.png`;
const editorialTeam = "WoodCutTool Editorial Team";

const existingTools = [
  {
    href: "/cabinet-cut-list-calculator/",
    title: "Cabinet Cut List Calculator",
    description: "Build a starter frameless cabinet parts list from outside dimensions, material thickness, back thickness, and shelf count.",
  },
  {
    href: "/drawer-box-calculator/",
    title: "Drawer Box Calculator",
    description: "Turn an opening and the selected slide clearance into a five-part drawer box list.",
  },
  {
    href: "/cabinet-door-calculator/",
    title: "Cabinet Door Calculator",
    description: "Calculate inset or overlay door sizes and optional Shaker rail, stile, and panel dimensions.",
  },
  {
    href: "/shelf-spacing-calculator/",
    title: "Shelf Spacing Calculator",
    description: "Calculate equal openings, shelf positions, centerlines, and optional 32 mm system locations.",
  },
];

function esc(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function jsonForHtml(value, spacing = 0) {
  return JSON.stringify(value, null, spacing)
    .replaceAll("<", "\\u003c")
    .replaceAll("\u2028", "\\u2028")
    .replaceAll("\u2029", "\\u2029");
}

function csvCell(value) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

function list(value) {
  return Array.isArray(value) ? value : [];
}

function clampText(value, limit) {
  const text = String(value ?? "").replace(/\s+/g, " ").trim();
  if (text.length <= limit) return text;
  return `${text.slice(0, Math.max(0, limit - 1)).trimEnd()}…`;
}

function formatNumber(value, maximumFractionDigits = 3) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits,
    minimumFractionDigits: 0,
  }).format(value);
}

function plural(value, singular, pluralValue = `${singular}s`) {
  return Number(value) === 1 ? singular : pluralValue;
}

function titleCase(value) {
  return String(value ?? "")
    .split(/[\s-]+/)
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(" ");
}

function absoluteUrl(route) {
  return new URL(route, siteUrl).href;
}

function localRouteFile(href) {
  const cleanPath = String(href).split(/[?#]/, 1)[0];
  const relative = cleanPath.replace(/^\/+/, "");
  if (!relative) return join(root, "index.html");
  if (/\.[a-z0-9]+$/i.test(relative)) return join(root, relative);
  return join(root, relative, "index.html");
}

function externalLinkAttributes(href) {
  return /^https?:\/\//i.test(href) ? ' target="_blank" rel="noopener noreferrer"' : "";
}

function schemaTag(schema) {
  return `<script type="application/ld+json">${jsonForHtml(schema)}</script>`;
}

function head({
  title,
  description,
  route,
  schemas,
  pageType = "website",
}) {
  const canonical = absoluteUrl(route);
  const safeTitle = clampText(title, 68);
  const safeDescription = clampText(description, 170);
  return `<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(safeTitle)}</title>
  <meta name="description" content="${esc(safeDescription)}">
  <meta name="robots" content="index,follow,max-image-preview:large">
  <link rel="canonical" href="${esc(canonical)}">
  <meta property="og:type" content="${esc(pageType)}">
  <meta property="og:site_name" content="WoodCutTool">
  <meta property="og:title" content="${esc(safeTitle)}">
  <meta property="og:description" content="${esc(safeDescription)}">
  <meta property="og:url" content="${esc(canonical)}">
  <meta property="og:image" content="${esc(ogImage)}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="Parametric woodworking components and generated cut-list parts">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(safeTitle)}">
  <meta name="twitter:description" content="${esc(safeDescription)}">
  <meta name="twitter:image" content="${esc(ogImage)}">
  <meta name="twitter:image:alt" content="Parametric woodworking components and generated cut-list parts">
  <link rel="icon" href="/favicon.ico?v=rounded-mask-20260619" sizes="any">
  <link rel="icon" type="image/png" sizes="32x32" href="/assets/icons/favicon-32x32.png?v=rounded-mask-20260619">
  <link rel="icon" type="image/png" sizes="16x16" href="/assets/icons/favicon-16x16.png?v=rounded-mask-20260619">
  <link rel="apple-touch-icon" sizes="180x180" href="/assets/icons/apple-touch-icon.png?v=rounded-mask-20260619">
  <link rel="manifest" href="/site.webmanifest?v=rounded-mask-20260619">
  <meta name="theme-color" content="#e8d9b4">
  <link rel="stylesheet" href="/assets/styles.css">
  <link rel="stylesheet" href="/assets/component-builder.css">
  <script defer src="/assets/site-chrome.js"></script>
  <script defer src="/assets/app.js"></script>
  <script defer src="/assets/component-builder.js"></script>
  ${schemas.map(schemaTag).join("\n  ")}
</head>`;
}

function pageShell({
  title,
  description,
  route,
  schemas,
  body,
  pageType,
}) {
  return `<!doctype html>
<html lang="en">
${head({ title, description, route, schemas, pageType })}
<body>
  <a class="skip-link" href="#main">Skip to content</a>
  <div data-site-header></div>
  ${body}
  <div data-site-footer></div>
</body>
</html>
`;
}

function breadcrumbSchema(items, route) {
  return {
    "@type": "BreadcrumbList",
    "@id": `${absoluteUrl(route)}#breadcrumb`,
    itemListElement: items.map(([name, item], index) => ({
      "@type": "ListItem",
      position: index + 1,
      name,
      item: absoluteUrl(item),
    })),
  };
}

function collectionSchemas({
  title,
  description,
  route,
  items,
  breadcrumbs,
  parentRoute = "/tools/",
}) {
  return [
    {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "CollectionPage",
          "@id": `${absoluteUrl(route)}#collection`,
          name: title,
          url: absoluteUrl(route),
          description,
          isPartOf: { "@id": `${absoluteUrl(parentRoute)}#collection` },
          mainEntity: { "@id": `${absoluteUrl(route)}#items` },
        },
        {
          "@type": "ItemList",
          "@id": `${absoluteUrl(route)}#items`,
          numberOfItems: items.length,
          itemListElement: items.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.name,
            url: absoluteUrl(item.route),
          })),
        },
        breadcrumbSchema(breadcrumbs, route),
      ],
    },
  ];
}

function detailSchemas(model) {
  const route = `/tools/components/${model.slug}/`;
  const category = categoryBySlug.get(model.categorySlug);
  const faqId = `${absoluteUrl(route)}#faq`;
  const applicationId = `${absoluteUrl(route)}#application`;
  return [
    {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebPage",
          "@id": absoluteUrl(route),
          url: absoluteUrl(route),
          name: model.title,
          description: model.description,
          dateModified: model.reviewedDate,
          datePublished: model.reviewedDate,
          mainEntity: { "@id": applicationId },
          isPartOf: { "@id": `${siteUrl}/tools/components/#collection` },
          breadcrumb: { "@id": `${absoluteUrl(route)}#breadcrumb` },
        },
        {
          "@type": "WebApplication",
          "@id": applicationId,
          name: model.name,
          url: absoluteUrl(route),
          description: model.description,
          applicationCategory: "DesignApplication",
          applicationSubCategory: "Woodworking cut list component builder",
          operatingSystem: "Any",
          browserRequirements: "Requires JavaScript in a modern web browser for live recalculation and project tray actions",
          isAccessibleForFree: true,
          featureList: [
            "Parametric component dimensions",
            "Pre-rendered default cut list",
            "Browser-side recalculation",
            "CSV and JSON export",
            "Combined project bill of materials tray",
          ],
          softwareVersion: model.modelVersion,
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
          },
        },
        {
          "@type": "FAQPage",
          "@id": faqId,
          mainEntity: list(model.faqs).map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer,
            },
          })),
        },
        breadcrumbSchema([
          ["Home", "/"],
          ["Tools", "/tools/"],
          ["Cut List Components", "/tools/components/"],
          [category.name, `/tools/components/${category.slug}/`],
          [model.name, route],
        ], route),
      ],
    },
  ];
}

function validateExpression(expression, inputIds, label) {
  const source = String(expression ?? "").trim();
  if (!source) throw new Error(`${label} has an empty expression.`);
  if (!/^[A-Za-z0-9_+\-*/().,\s]+$/.test(source)) {
    throw new Error(`${label} uses characters outside the expression allowlist: ${source}`);
  }
  const permittedNames = new Set([
    ...inputIds,
    "ceil",
    "floor",
    "round",
    "max",
    "min",
  ]);
  const names = source.match(/[A-Za-z_][A-Za-z0-9_]*/g) ?? [];
  for (const name of names) {
    if (!permittedNames.has(name)) {
      throw new Error(`${label} uses an unknown name "${name}".`);
    }
  }
  return source;
}

function evaluateExpression(expression, values, label) {
  const inputIds = Object.keys(values);
  const source = validateExpression(expression, inputIds, label);
  return evaluateCutListExpression(source, values, label);
}

function defaultInputsFor(model) {
  return Object.fromEntries(model.inputs.map((input) => [
    input.id,
    Number(input.default),
  ]));
}

function defaultPartsFor(model) {
  const values = defaultInputsFor(model);
  return model.parts.map((part, partIndex) => {
    const prefix = `${model.slug} part ${partIndex + 1} (${part.name})`;
    return {
      name: part.name,
      quantity: evaluateExpression(part.quantity, values, `${prefix} quantity`),
      length: evaluateExpression(part.length, values, `${prefix} length`),
      width: evaluateExpression(part.width, values, `${prefix} width`),
      thickness: evaluateExpression(part.thickness, values, `${prefix} thickness`),
      materialGroup: part.materialGroup,
      grain: part.grain,
      formulaNote: part.formulaNote,
    };
  });
}

function assertDefaultParts(model, parts) {
  if (!parts.length) throw new Error(`${model.slug} has no default output parts.`);
  for (const part of parts) {
    if (!Number.isInteger(part.quantity) || part.quantity <= 0) {
      throw new Error(`${model.slug} ${part.name} quantity must be a positive integer.`);
    }
    for (const field of ["length", "width", "thickness"]) {
      if (!Number.isFinite(part[field]) || part[field] <= 0) {
        throw new Error(`${model.slug} ${part.name} ${field} must be positive.`);
      }
    }
  }
}

function summaryFor(parts) {
  const pieceCount = parts.reduce((sum, part) => sum + part.quantity, 0);
  const squareInches = parts.reduce(
    (sum, part) => sum + part.length * part.width * part.quantity,
    0,
  );
  const materialGroups = new Set(parts.map((part) => part.materialGroup)).size;
  return {
    lineCount: parts.length,
    pieceCount,
    squareFeet: squareInches / 144,
    materialGroups,
  };
}

function summaryMarkup(parts) {
  const summary = summaryFor(parts);
  return `<div class="component-summary" data-component-summary aria-live="polite">
    <div><strong>${summary.lineCount}</strong><span>${plural(summary.lineCount, "part line")}</span></div>
    <div><strong>${summary.pieceCount}</strong><span>${plural(summary.pieceCount, "piece")}</span></div>
    <div><strong>${formatNumber(summary.squareFeet, 2)} ft²</strong><span>finished rectangle area</span></div>
    <div><strong>${summary.materialGroups}</strong><span>${plural(summary.materialGroups, "material group")}</span></div>
  </div>`;
}

function resultRows(parts) {
  return parts.map((part) => `<tr>
    <th scope="row">${esc(part.name)}</th>
    <td>${formatNumber(part.quantity, 0)}</td>
    <td>${formatNumber(part.thickness)} in</td>
    <td>${formatNumber(part.width)} in</td>
    <td>${formatNumber(part.length)} in</td>
    <td>${esc(part.materialGroup)}</td>
    <td>${esc(part.grain)}</td>
  </tr>`).join("\n");
}

function exampleCsv(model, parts) {
  const headers = [
    "component_slug",
    "component_name",
    "model_version",
    "reviewed_date",
    "part_name",
    "quantity",
    "length_in",
    "width_in",
    "thickness_in",
    "material_group",
    "grain",
    "formula_note",
  ];
  const rows = parts.map((part) => [
    model.slug,
    model.name,
    model.modelVersion,
    model.reviewedDate,
    part.name,
    part.quantity,
    part.length,
    part.width,
    part.thickness,
    part.materialGroup,
    part.grain,
    part.formulaNote,
  ]);
  return `${[headers, ...rows].map((row) => row.map(csvCell).join(",")).join("\n")}\n`;
}

function modelArtifact(model, parts) {
  return {
    schemaVersion: "1.0",
    slug: model.slug,
    route: `/tools/components/${model.slug}/`,
    categorySlug: model.categorySlug,
    name: model.name,
    title: model.title,
    description: model.description,
    searchIntent: model.searchIntent,
    modelVersion: model.modelVersion,
    reviewedDate: model.reviewedDate,
    defaultInputs: defaultInputsFor(model),
    inputs: model.inputs,
    formulas: model.parts.map((part) => ({
      part: part.name,
      quantity: part.quantity,
      length: part.length,
      width: part.width,
      thickness: part.thickness,
      formulaNote: part.formulaNote,
    })),
    defaultParts: parts,
    assumptions: model.assumptions,
    checks: model.checks,
    stopConditions: model.stopConditions,
    sources: model.sources,
  };
}

function inputMarkup(model) {
  return model.inputs.map((input) => `<label for="${esc(input.id)}">
    ${esc(input.label)}
    <input
      id="${esc(input.id)}"
      name="${esc(input.id)}"
      type="number"
      value="${esc(input.default)}"
      min="${esc(input.min)}"
      max="${esc(input.max)}"
      step="${esc(input.step)}"
      inputmode="decimal"
      ${input.unit === "count" ? "" : "data-component-dimension"}
      aria-describedby="${esc(input.id)}-help"
      required>
    <small id="${esc(input.id)}-help">${esc(input.help)}</small>
  </label>`).join("\n");
}

function formulaTable(model) {
  return `<div class="component-table-wrap"><table class="component-table">
    <thead><tr><th>Part</th><th>Quantity</th><th>Length</th><th>Width</th><th>Thickness</th><th>Why this formula exists</th></tr></thead>
    <tbody>${model.parts.map((part) => `<tr>
      <th scope="row">${esc(part.name)}</th>
      <td><code>${esc(part.quantity)}</code></td>
      <td><code>${esc(part.length)}</code></td>
      <td><code>${esc(part.width)}</code></td>
      <td><code>${esc(part.thickness)}</code></td>
      <td>${esc(part.formulaNote)}</td>
    </tr>`).join("")}</tbody>
  </table></div>`;
}

function dimensionDiagram(model, parts) {
  const visibleParts = parts.slice(0, 5);
  const maxLength = Math.max(...visibleParts.map((part) => part.length), 1);
  const maxWidth = Math.max(...visibleParts.map((part) => part.width), 1);
  const positions = [
    [4, 6],
    [50, 8],
    [8, 52],
    [54, 51],
    [32, 29],
  ];
  return `<figure class="component-dimension-diagram" aria-labelledby="${esc(model.slug)}-diagram-caption">
    <div class="component-diagram-stage" role="img" aria-label="HTML and CSS dimension sketch of the default ${esc(model.name)} part groups">
      ${visibleParts.map((part, index) => {
        const [left, top] = positions[index];
        const width = Math.max(22, Math.min(42, part.length / maxLength * 42));
        const height = Math.max(18, Math.min(36, part.width / maxWidth * 36));
        return `<div class="component-diagram-part" style="--left:${left}%;--top:${top}%;--width:${width}%;--height:${height}%">
          <strong>${esc(part.name)} × ${formatNumber(part.quantity, 0)}</strong>
          <span>${formatNumber(part.length)} × ${formatNumber(part.width)} × ${formatNumber(part.thickness)} in</span>
        </div>`;
      }).join("")}
    </div>
    <figcaption id="${esc(model.slug)}-diagram-caption">Default-input planning sketch. Rectangles communicate the named part groups and their relative dimensions; they are not a cutting layout, joinery drawing, grain-match map, or scale print.</figcaption>
  </figure>`;
}

function sourceMarkup(sources) {
  return `<ul class="component-source-list">${sources.map((source) => `<li>
    <a href="${esc(source.url)}"${externalLinkAttributes(source.url)}>${esc(source.name)}</a>
    — ${esc(source.scope)}
  </li>`).join("")}</ul>`;
}

function resourceCards(links) {
  return `<div class="component-card-grid">${links.map((link) => `<a class="component-card" href="${esc(link.href)}"${externalLinkAttributes(link.href)}>
    <span>${esc(link.kind)}</span>
    <strong>${esc(link.label)}</strong>
    <em>${esc(link.description)}</em>
  </a>`).join("")}</div>`;
}

function modelCard(model) {
  const category = categoryBySlug.get(model.categorySlug);
  return `<a class="component-card" href="/tools/components/${esc(model.slug)}/">
    <span>${esc(category.name)} · ${model.inputs.length} inputs</span>
    <strong>${esc(model.name)}</strong>
    <em>${esc(model.description)}</em>
    <b>Build the component →</b>
  </a>`;
}

function categoryCard(category) {
  const models = modelsByCategory.get(category.slug);
  return `<a class="component-card" href="/tools/components/${esc(category.slug)}/">
    <span>${models.length} parametric models</span>
    <strong>${esc(category.title)}</strong>
    <em>${esc(category.description)}</em>
    <b>Open category →</b>
  </a>`;
}

function faqMarkup(model) {
  return `<div class="grid tools">${model.faqs.map((faq) => `<article class="card">
    <h3>${esc(faq.question)}</h3>
    <p>${esc(faq.answer)}</p>
  </article>`).join("")}</div>`;
}

function visibleWordCount(html) {
  const visible = html
    .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&(?:[a-z]+|#\d+|#x[a-f0-9]+);/gi, " ")
    .replace(/\s+/g, " ");
  return visible.match(/[A-Za-z0-9][A-Za-z0-9'’.-]*/g)?.length ?? 0;
}

function normalizedVisibleText(html) {
  return html
    .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&(?:[a-z]+|#\d+|#x[a-f0-9]+);/gi, " ")
    .toLowerCase()
    .replace(/[^a-z0-9'’.-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function ngramSet(html, size = 5) {
  const words = normalizedVisibleText(html).split(" ").filter(Boolean);
  const grams = new Set();
  for (let index = 0; index <= words.length - size; index += 1) {
    grams.add(words.slice(index, index + size).join(" "));
  }
  return grams;
}

function jaccard(left, right) {
  let intersection = 0;
  for (const value of left) {
    if (right.has(value)) intersection += 1;
  }
  const union = left.size + right.size - intersection;
  return union ? intersection / union : 0;
}

function paragraphTexts(html) {
  return [...html.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)]
    .map((match) => normalizedVisibleText(match[1]))
    .filter((text) => text.split(" ").length >= 8);
}

function assertDetailDistinctiveness(entries) {
  const paragraphOwners = new Map();
  const gramsBySlug = new Map();
  for (const { model, html } of entries) {
    gramsBySlug.set(model.slug, ngramSet(html));
    for (const paragraph of new Set(paragraphTexts(html))) {
      if (!paragraphOwners.has(paragraph)) paragraphOwners.set(paragraph, new Set());
      paragraphOwners.get(paragraph).add(model.slug);
    }
  }

  let maximumSimilarity = 0;
  let closestPair = [];
  for (let leftIndex = 0; leftIndex < entries.length; leftIndex += 1) {
    for (let rightIndex = leftIndex + 1; rightIndex < entries.length; rightIndex += 1) {
      const left = entries[leftIndex].model.slug;
      const right = entries[rightIndex].model.slug;
      const similarity = jaccard(gramsBySlug.get(left), gramsBySlug.get(right));
      if (similarity > maximumSimilarity) {
        maximumSimilarity = similarity;
        closestPair = [left, right];
      }
    }
  }
  if (maximumSimilarity > 0.42) {
    throw new Error(
      `Component detail similarity is ${maximumSimilarity.toFixed(3)} for ${closestPair.join(" and ")}; expected at most 0.420.`,
    );
  }

  const sharedThreshold = Math.ceil(entries.length / 2);
  for (const { model, html } of entries) {
    const sharedWords = paragraphTexts(html)
      .filter((paragraph) => paragraphOwners.get(paragraph)?.size >= sharedThreshold)
      .reduce((sum, paragraph) => sum + paragraph.split(" ").length, 0);
    const totalWords = visibleWordCount(html);
    const sharedRatio = totalWords ? sharedWords / totalWords : 1;
    if (sharedRatio > 0.3) {
      throw new Error(
        `${model.slug} has ${(sharedRatio * 100).toFixed(1)}% shared paragraph words; expected at most 30%.`,
      );
    }
  }
  return { maximumSimilarity, closestPair };
}

function defaultPartCards(model, parts) {
  return `<div class="component-method-grid">${parts.map((part, index) => {
    const definition = model.parts[index];
    const pieceLabel = plural(part.quantity, "piece");
    return `<article>
      <h3>${esc(part.name)}</h3>
      <p><strong>${part.quantity} ${pieceLabel}</strong> at ${formatNumber(part.length)} × ${formatNumber(part.width)} × ${formatNumber(part.thickness)} in (length × width × thickness). Material group: ${esc(part.materialGroup)}. Grain: ${esc(part.grain)}.</p>
      <p>${esc(definition.formulaNote)}</p>
    </article>`;
  }).join("")}</div>`;
}

function detailBody(model, parts) {
  const route = `/tools/components/${model.slug}/`;
  const category = categoryBySlug.get(model.categorySlug);
  const related = model.relatedSlugs.map((slug) => modelBySlug.get(slug));
  const editorial = componentEditorialBySlug[model.slug];
  const config = {
    ...model,
    route,
    defaultInputs: defaultInputsFor(model),
    defaultParts: parts,
  };
  const partNames = model.parts.map((part) => part.name).join(", ");
  const inputNames = model.inputs.map((input) => input.label).join(", ");
  const body = `<main id="main" class="article-shell research-shell component-detail-shell">
  <article class="article-body research-article">
    <p class="breadcrumb"><a href="/">Home</a> / <a href="/tools/">Tools</a> / <a href="/tools/components/">Cut List Components</a> / <a href="/tools/components/${esc(category.slug)}/">${esc(category.name)}</a> / ${esc(model.name)}</p>
    <p class="eyebrow">${esc(category.name)} · Parametric component model</p>
    <h1>${esc(model.h1)}</h1>
    <p class="lead">${esc(model.intro)}</p>
    <p class="article-byline">Reviewed ${esc(model.reviewedDate)} by <a href="/about/">${editorialTeam}</a> · Model <code>${esc(model.modelVersion)}</code></p>

    <section class="component-boundary" aria-labelledby="role-boundary">
      <h2 id="role-boundary">What this builder does—and what it deliberately does not do</h2>
      <p>${esc(model.whatItBuilds)} The page answers the search intent “${esc(model.searchIntent)}” by turning a small, declared set of measurements into named rectangular planning parts. It does not invent room measurements, choose hardware, certify structure, approve code compliance, or guarantee that the resulting rectangles can be assembled safely.</p>
      <p>${esc(editorial.decisionContext)}</p>
    </section>

    <section aria-labelledby="builder-title">
      <div class="section-heading compact">
        <p class="eyebrow">Interactive builder</p>
        <h2 id="builder-title">Generate a ${esc(model.name)} cut list</h2>
        <p>The default result is present in the static HTML for readers and search engines. JavaScript recalculates it locally when an input changes; entered dimensions stay in this browser page.</p>
      </div>
      <div class="component-builder-layout">
        <form class="component-form-panel" data-component-form>
          <label for="component-unit">Display units
            <select id="component-unit" name="unit" data-component-unit>
              <option value="imperial" selected>Imperial (in)</option>
              <option value="metric">Metric (mm)</option>
            </select>
          </label>
          <div class="input-grid two">${inputMarkup(model)}</div>
          <div class="component-actions">
            <button class="button" type="button" data-component-add>Add current parts to project tray</button>
            <button class="button secondary" type="button" data-component-csv>Download CSV</button>
            <button class="button secondary" type="button" data-component-json>Download JSON</button>
            <button class="button secondary" type="button" data-component-layout>Use this cut list in sheet calculator</button>
            <button class="button ghost" type="button" data-component-copy>Copy parts</button>
          </div>
        </form>
        <div class="component-result-panel">
          <h3>Current result</h3>
          ${summaryMarkup(parts)}
          <div class="component-table-wrap"><table class="component-table">
            <thead><tr><th>Part</th><th>Qty</th><th>Thickness</th><th>Width</th><th>Length</th><th>Material</th><th>Grain</th></tr></thead>
            <tbody data-component-results>${resultRows(parts)}</tbody>
          </table></div>
        </div>
      </div>
      ${dimensionDiagram(model, parts)}
      <p><a href="${route}example-cut-list.csv" download>Download the pre-rendered example CSV</a> or inspect the versioned <a href="${route}model.json">model JSON</a>. The interactive download buttons use the current browser inputs, while these two static files preserve the reviewed default example.</p>
    </section>

    <script type="application/json" data-component-config>${jsonForHtml(config)}</script>

    <section>
      <h2>The answer first: what the default model produces</h2>
      <p>With the reviewed defaults, this ${esc(model.name.toLowerCase())} produces ${parts.length} named part lines: ${esc(partNames)}. The generator expands those formulas into ${summaryFor(parts).pieceCount} rectangular pieces covering approximately ${formatNumber(summaryFor(parts).squareFeet, 2)} square feet of finished face area. That area is useful for comparing configurations, but it is not a sheet purchase quantity because packing, kerf, edge trim, defects, grain, spare pieces, and purchasable stock formats still have to be modeled separately.</p>
      <p>${esc(editorial.workedExample)}</p>
      ${defaultPartCards(model, parts)}
    </section>

    <section>
      <h2>Formula model and variable definitions</h2>
      <p>The current model uses these project inputs: ${esc(inputNames)}. Each input has a visible default, allowed range, increment, and measurement note. Formulas are deliberately limited to arithmetic and a small group of rounding helpers so a reviewer can read the rule without executing opaque code. The static JSON repeats the same expressions used by the browser runtime and the default build check.</p>
      ${formulaTable(model)}
      <p>${esc(editorial.invalidConfiguration)}</p>
    </section>

    <section>
      <h2>Measure the inputs before trusting the output</h2>
      <p>The ${esc(model.name.toLowerCase())} model is controlled by ${esc(inputNames)}. Record those values from the named physical datums in this order:</p>
      <ol>${model.measurementSteps.map((step) => `<li>${esc(step)}</li>`).join("")}</ol>
    </section>

    <section>
      <h2>Declared assumptions and project boundaries</h2>
      <ul>${model.assumptions.map((assumption) => `<li>${esc(assumption)}</li>`).join("")}</ul>
    </section>

    <section>
      <h2>Validation checks before material is released</h2>
      <ol>${model.checks.map((check) => `<li>${esc(check)}</li>`).join("")}</ol>
    </section>

    <section class="research-note">
      <h2>Stop conditions: when not to use the generated list</h2>
      <ul>${model.stopConditions.map((condition) => `<li>${esc(condition)}</li>`).join("")}</ul>
    </section>

    <section>
      <h2>Common mistakes and how to prevent them</h2>
      <ul>${model.mistakes.map((mistake) => `<li>${esc(mistake)}</li>`).join("")}</ul>
    </section>

    <section>
      <h2>How CSV, JSON, and the project tray should be used</h2>
      <p>Export the ${esc(partNames)} rows with model <code>${esc(model.modelVersion)}</code>, then reconcile the ${esc([...new Set(parts.map((part) => part.materialGroup))].join(", "))} material group${new Set(parts.map((part) => part.materialGroup)).size === 1 ? "" : "s"} before layout. CSV carries the rectangular rows; JSON retains inputs and formula metadata; the browser-local project tray combines this result with other reviewed components.</p>
      <div class="cta-row"><a class="button" href="/apps/cutlist/">Optimize confirmed parts in CutList</a><a class="button secondary" href="/tools/components/">Review the combined project tray</a></div>
    </section>

    <section>
      <h2>Method, versioning, and reproducibility</h2>
      <p>Model <code>${esc(model.modelVersion)}</code>, reviewed ${esc(model.reviewedDate)}, publishes ${model.inputs.length} bounded inputs and ${model.parts.length} named output formulas under the stable canonical <code>${esc(route)}</code>. The build rejects unknown expression identifiers and nonpositive default dimensions; the browser rejects live combinations that calculate a zero or negative part instead of silently substituting a token size. Entered dimensions never create another indexed URL.</p>
    </section>

    <section>
      <h2>Sources and interpretation limits</h2>
      ${sourceMarkup(model.sources)}
    </section>

    <section id="faq">
      <div class="section-heading compact"><p class="eyebrow">FAQ</p><h2>${esc(model.name)} questions</h2></div>
      ${faqMarkup(model)}
    </section>

    <section>
      <div class="section-heading compact"><p class="eyebrow">Related component models</p><h2>Continue the assembly without duplicating the same intent</h2></div>
      <div class="component-card-grid">${related.map(modelCard).join("")}</div>
    </section>

    <section>
      <div class="section-heading compact"><p class="eyebrow">Real next actions</p><h2>Move from component math to verified planning</h2></div>
      ${resourceCards(model.links)}
    </section>

    <section class="component-boundary">
      <h2>${esc(model.name)} release decision</h2>
      <p>${esc(editorial.releaseDecision)}</p>
    </section>
  </article>
</main>`;

  const wordCount = visibleWordCount(body);
  if (wordCount < 1100) {
    throw new Error(`${model.slug} renders ${wordCount} visible words; expected at least 1100.`);
  }
  return body;
}

function renderDetail(model, parts) {
  const route = `/tools/components/${model.slug}/`;
  return pageShell({
    title: model.title,
    description: model.description,
    route,
    schemas: detailSchemas(model),
    pageType: "website",
    body: detailBody(model, parts),
  });
}

function categoryBody(category) {
  const models = modelsByCategory.get(category.slug);
  const sources = uniqueSources(models.flatMap((model) => model.sources));
  return `<main id="main" class="article-shell research-shell component-category-shell">
  <article class="article-body research-article">
    <p class="breadcrumb"><a href="/">Home</a> / <a href="/tools/">Tools</a> / <a href="/tools/components/">Cut List Components</a> / ${esc(category.name)}</p>
    <p class="eyebrow">Cut List Component Library · ${esc(category.name)}</p>
    <h1>${esc(category.title)}</h1>
    <p class="lead">${esc(category.description)}</p>

    <section class="component-boundary">
      <h2>Category role and boundary</h2>
      <p>This category contains four independent component algorithms. Each page asks for the measurements that control one assembly and returns named rectangular parts. It does not publish a separate page for every possible width, height, or thickness, and it does not turn a component result into a structural approval, installation release, or guaranteed stock quantity.</p>
      <p>Use these models after the project envelope and construction choice are known, but before confirmed rows enter CutList. Templates remain the project-specific starting points; Examples remain static evidence; Checklists release work; Worksheets retain measurements. The component library owns the calculation between those surfaces.</p>
    </section>

    <section>
      <div class="section-heading compact"><p class="eyebrow">Four models</p><h2>Choose the component whose inputs match the decision</h2></div>
      <div class="component-card-grid">${models.map(modelCard).join("")}</div>
    </section>

    <section>
      <h2>A practical ${esc(category.name.toLowerCase())} workflow</h2>
      <p>Move through the workflow in order. An accurate formula cannot compensate for a provisional opening, an unselected construction detail, or a product envelope taken from the wrong model. Keep one named revision from measurement through export.</p>
      <ol>${category.workflow.map((step) => `<li>${esc(step)}</li>`).join("")}</ol>
      <p>After generating one component, inspect the part names and dimensions before adding them to the local project tray. Repeat that review for the other components, then reconcile common material groups, grain rules, thicknesses, and quantities. Only confirmed rectangles should move into a sheet or board optimizer.</p>
    </section>

    <section>
      <h2>Evidence that should travel with the result</h2>
      <p>The category is useful only when another person can reproduce why the selected inputs were used. Attach the relevant evidence to the exported project record rather than relying on memory or a screenshot of the result.</p>
      <ul>${category.evidence.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>
      <p>Evidence should identify its source, owner, date, revision, and applicable component. A current manufacturer drawing is stronger than a generic note; a field measurement tied to a datum is stronger than “opening checked”; a first-article result is stronger than assuming repeated work will match the first calculation.</p>
    </section>

    <section class="research-note">
      <h2>Stop conditions for this category</h2>
      <p>Do not release generated rows to purchasing, cutting, machining, or installation while any of these conditions remains unresolved:</p>
      <ul>${category.stopConditions.map((condition) => `<li>${esc(condition)}</li>`).join("")}</ul>
      <p>Resolve the blocking decision, update the controlled input, and regenerate every dependent export. Do not patch a downstream CSV while leaving the source model or drawing unchanged, because the next regeneration would silently restore the obsolete value.</p>
    </section>

    <section>
      <h2>How the four pages remain distinct</h2>
      <p>All four models share a category because they participate in one assembly workflow, not because their formulas are interchangeable. Each URL has its own input contract, named part output, assumptions, validation checks, stop conditions, FAQ, related components, and versioned JSON. The category hub maps those choices without repeating their complete formula content.</p>
      <p>If two models eventually answer the same decision with the same evidence and output, they should be consolidated rather than kept as keyword variants. Conversely, components that share words can remain separate when they calculate different physical parts or require different measurements and release checks.</p>
    </section>

    <section>
      <h2>Sources used across this category</h2>
      <p>Open the exact source attached to each component before applying a product-specific dimension. External source links are provided directly so readers can inspect the current material rather than relying on an unsupported summary.</p>
      ${sourceMarkup(sources)}
    </section>

    <section>
      <h2>Next actions after the component list is verified</h2>
      <div class="component-card-grid">
        ${existingTools.map((tool) => `<a class="component-card" href="${tool.href}"><span>Existing tool</span><strong>${esc(tool.title)}</strong><em>${esc(tool.description)}</em></a>`).join("")}
      </div>
      <p>Use the existing focused calculator when its simpler scope matches the job. Use the component models when you need versioned formula metadata, static example files, and a multi-component project tray. Use <a href="/apps/cutlist/">CutList</a> only after the component rows have been reviewed and grouped by real stock.</p>
    </section>
  </article>
</main>`;
}

function renderCategory(category) {
  const route = `/tools/components/${category.slug}/`;
  const models = modelsByCategory.get(category.slug);
  return pageShell({
    title: category.title,
    description: category.description,
    route,
    schemas: collectionSchemas({
      title: category.title,
      description: category.description,
      route,
      parentRoute: "/tools/components/",
      items: models.map((model) => ({
        name: model.name,
        route: `/tools/components/${model.slug}/`,
      })),
      breadcrumbs: [
        ["Home", "/"],
        ["Tools", "/tools/"],
        ["Cut List Components", "/tools/components/"],
        [category.name, route],
      ],
    }),
    body: categoryBody(category),
  });
}

function uniqueSources(sources) {
  const seen = new Set();
  return sources.filter((source) => {
    const key = `${source.url}\u0000${source.name}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function hubBody() {
  const sources = uniqueSources(componentModels.flatMap((model) => model.sources));
  return `<main id="main" class="article-shell research-shell component-hub-shell">
  <article class="article-body research-article">
    <p class="breadcrumb"><a href="/">Home</a> / <a href="/tools/">Tools</a> / Cut List Components</p>
    <p class="eyebrow">Parametric woodworking library</p>
    <h1>Interactive Cut List Component Library</h1>
    <p class="lead">Turn verified component dimensions into named rectangular parts, downloadable CSV and JSON, and one browser-local project bill of materials. Browse 12 versioned models across three practical categories.</p>

    <section class="component-boundary">
      <h2>A component calculator, not a project-plan page factory</h2>
      <p>Each model owns one stable calculation: declared dimensions go in, named parts come out. The library does not generate indexed pages for dimension combinations, promise a complete build, approve structure or code, choose hardware, or guarantee an optimized sheet count. User-entered values remain browser-side and canonical URLs stay fixed.</p>
      <p>This role is deliberately different from the site's other columns. Templates supply static project starting points. Examples publish complete static inputs and modeled layouts. Learn explains methods. Checklists release irreversible steps, Worksheets retain evidence, and Troubleshooting isolates failures. Component builders expose the formula boundary between verified measurements and confirmed cut-list rows.</p>
    </section>

    <section>
      <div class="section-heading compact"><p class="eyebrow">Three categories</p><h2>Start with the assembly decision</h2><p>Each category contains exactly four distinct models plus workflow, evidence, and stop-condition guidance.</p></div>
      <div class="component-card-grid">${componentCategories.map(categoryCard).join("")}</div>
    </section>

    <section>
      <div class="section-heading compact"><p class="eyebrow">All 12 models</p><h2>Choose a model by the parts it calculates</h2><p>Do not choose by a familiar keyword alone. Open the model whose input definitions, assumptions, and output rows match the approved construction.</p></div>
      <div class="component-card-grid">${componentModels.map(modelCard).join("")}</div>
    </section>

    <section class="component-project-tray" aria-labelledby="project-tray-title">
      <div class="component-tray-toolbar">
        <div>
          <p class="eyebrow">Browser-local project tray</p>
          <h2 id="project-tray-title">Combined component bill of materials</h2>
          <p><strong data-component-project-count>0</strong> saved component results. Add a reviewed result from any detail page; the tray uses local browser storage and does not upload dimensions.</p>
        </div>
        <div class="component-actions">
          <button class="button" type="button" data-project-csv>Download combined CSV</button>
          <button class="button secondary" type="button" data-project-json>Download combined JSON</button>
          <button class="button secondary" type="button" data-project-layout>Open panel layout</button>
          <button class="button secondary" type="button" data-project-copy>Copy combined BOM</button>
          <button class="button ghost" type="button" data-project-clear>Clear tray</button>
        </div>
      </div>
      <p class="component-empty" data-component-project-empty>No component results are in this browser's project tray yet. Open a model, verify its inputs, and choose “Add current parts to project tray.”</p>
      <div class="component-table-wrap"><table class="component-table">
        <thead><tr><th>Component</th><th>Part</th><th>Qty</th><th>Thickness</th><th>Width</th><th>Length</th><th>Material</th><th>Grain</th><th>Source</th></tr></thead>
        <tbody data-component-project></tbody>
      </table></div>
      <p>The tray merges records for review; it does not silently merge unlike materials, convert a component into a complete project, or optimize stock. Reconcile thickness, material group, grain, face, quantity, and revision before sending confirmed rows to CutList.</p>
    </section>

    <section>
      <div class="section-heading compact"><p class="eyebrow">Existing focused tools</p><h2>Keep established calculator intents on their canonical pages</h2></div>
      <div class="component-card-grid">${existingTools.map((tool) => `<a class="component-card" href="${tool.href}"><span>Existing canonical tool</span><strong>${esc(tool.title)}</strong><em>${esc(tool.description)}</em><b>Open tool →</b></a>`).join("")}</div>
      <p>The library complements these calculators instead of cloning them under new slugs. Use an existing tool when its focused answer is sufficient. Use a component model when its distinct construction formula, versioned model data, static example export, and project-tray integration match the decision.</p>
    </section>

    <section>
      <h2>Method, verification, and source policy</h2>
      <p>Every model declares numeric inputs, readable arithmetic expressions, named part rows, assumptions, measurement steps, validation checks, stop conditions, common mistakes, related components, and reviewed sources. Before generation, the build asserts 12 unique model slugs, three unique categories, four models per category, valid related targets, allowed expression tokens, and positive default output dimensions.</p>
      <p>The default output is pre-rendered into each page and repeated in a downloadable example CSV and model JSON. Live changes run locally through the same declared model. A model version and reviewed date travel with the exports so a later revision can be compared rather than silently replacing the basis of an earlier project.</p>
      <p>External sources are linked directly without <code>nofollow</code>. A source note states what the reference supports and does not imply that a manufacturer detail applies to another product. Readers should verify the current source revision, exact hardware, real material, and local requirements before an irreversible step.</p>
      ${sourceMarkup(sources)}
    </section>

    <section class="research-note">
      <h2>Why dimensions never create new indexed URLs</h2>
      <p>A width, height, thickness, overlay, or clearance changes the result, not the search intent. The same canonical component page handles those values in the browser. The site does not create query-string canonicals, parameter landing pages, or prebuilt pages for every numeric combination. That keeps the library maintainable and prevents thousands of near-duplicate URLs from competing with the one reviewed model.</p>
      <p>A genuinely new URL requires a different physical component, input contract, formula, evidence, and next action. If two proposed pages would generate the same parts from the same inputs, they belong in one model with explicit options or should be rejected as duplicates.</p>
    </section>

    <section>
      <h2>Recommended workflow from measurement to layout</h2>
      <ol>
        <li>Measure the actual project envelope and identify datums, revision, units, material thickness, hardware, and construction choices.</li>
        <li>Choose the model whose declared assumptions match the component; do not substitute a similar name for a different formula.</li>
        <li>Review the pre-rendered example, enter project values, and inspect every generated part row.</li>
        <li>Apply model-specific checks and stop if source dimensions, hardware data, safety, structure, or installation conditions are unresolved.</li>
        <li>Add approved component results to the project tray and reconcile shared material groups, grain, face, thickness, and quantity.</li>
        <li>Export the combined BOM, retain model versions and sources, then open <a href="/apps/cutlist/">CutList</a> to plan confirmed rectangles on real stock.</li>
      </ol>
    </section>
  </article>
</main>`;
}

function renderHub() {
  const route = "/tools/components/";
  const title = "Interactive Cut List Component Library";
  const description = "Build 12 woodworking components from verified dimensions, export CSV or JSON, and combine parts in a browser-local project bill of materials.";
  return pageShell({
    title,
    description,
    route,
    schemas: collectionSchemas({
      title,
      description,
      route,
      items: componentModels.map((model) => ({
        name: model.name,
        route: `/tools/components/${model.slug}/`,
      })),
      breadcrumbs: [
        ["Home", "/"],
        ["Tools", "/tools/"],
        ["Cut List Components", route],
      ],
    }),
    body: hubBody(),
  });
}

function validateData() {
  if (!Array.isArray(componentCategories) || componentCategories.length !== 3) {
    throw new Error(`Expected 3 component categories, got ${componentCategories?.length ?? "invalid"}.`);
  }
  if (!Array.isArray(componentModels) || componentModels.length !== 12) {
    throw new Error(`Expected 12 component models, got ${componentModels?.length ?? "invalid"}.`);
  }

  const categorySlugs = componentCategories.map((category) => category.slug);
  const modelSlugs = componentModels.map((model) => model.slug);
  if (new Set(categorySlugs).size !== categorySlugs.length) {
    throw new Error("Component category slugs must be unique.");
  }
  if (new Set(modelSlugs).size !== modelSlugs.length) {
    throw new Error("Component model slugs must be unique.");
  }
  const allDirectorySlugs = [...categorySlugs, ...modelSlugs];
  if (new Set(allDirectorySlugs).size !== allDirectorySlugs.length) {
    throw new Error("Category and model slugs cannot share an output directory.");
  }

  const categorySet = new Set(categorySlugs);
  const modelSet = new Set(modelSlugs);
  for (const category of componentCategories) {
    if (!category.slug || !category.name || !category.title || !category.description) {
      throw new Error(`Category ${category.slug || "(missing slug)"} is missing required identity fields.`);
    }
    for (const field of ["workflow", "evidence", "stopConditions"]) {
      if (!Array.isArray(category[field]) || category[field].length < 3) {
        throw new Error(`${category.slug} needs at least 3 ${field} entries.`);
      }
    }
    const count = componentModels.filter((model) => model.categorySlug === category.slug).length;
    if (count !== 4) {
      throw new Error(`${category.slug} has ${count} models; expected 4.`);
    }
  }

  const outputs = new Map();
  for (const model of componentModels) {
    if (!categorySet.has(model.categorySlug)) {
      throw new Error(`${model.slug} references unknown category ${model.categorySlug}.`);
    }
    for (const field of [
      "name",
      "title",
      "description",
      "h1",
      "intro",
      "searchIntent",
      "whatItBuilds",
      "modelVersion",
      "reviewedDate",
    ]) {
      if (!String(model[field] ?? "").trim()) {
        throw new Error(`${model.slug} is missing ${field}.`);
      }
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(model.reviewedDate)) {
      throw new Error(`${model.slug} reviewedDate must be YYYY-MM-DD.`);
    }
    if (!Array.isArray(model.inputs) || model.inputs.length < 2) {
      throw new Error(`${model.slug} needs at least two numeric inputs.`);
    }
    const inputIds = model.inputs.map((input) => input.id);
    if (new Set(inputIds).size !== inputIds.length) {
      throw new Error(`${model.slug} input ids must be unique.`);
    }
    for (const input of model.inputs) {
      if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(input.id)) {
        throw new Error(`${model.slug} has invalid input id ${input.id}.`);
      }
      const defaultValue = Number(input.default);
      const min = Number(input.min);
      const max = Number(input.max);
      const step = Number(input.step);
      if (![defaultValue, min, max, step].every(Number.isFinite)) {
        throw new Error(`${model.slug} input ${input.id} must use finite numeric bounds.`);
      }
      if (min >= max || step <= 0 || defaultValue < min || defaultValue > max) {
        throw new Error(`${model.slug} input ${input.id} has an invalid default/range/step.`);
      }
    }
    if (!Array.isArray(model.parts) || model.parts.length < 1) {
      throw new Error(`${model.slug} needs at least one output part group.`);
    }
    for (const part of model.parts) {
      for (const field of ["quantity", "length", "width", "thickness"]) {
        validateExpression(part[field], inputIds, `${model.slug} ${part.name} ${field}`);
      }
    }
    for (const field of [
      "measurementSteps",
      "assumptions",
      "checks",
      "stopConditions",
      "mistakes",
      "faqs",
      "links",
    ]) {
      if (!Array.isArray(model[field]) || model[field].length < 3) {
        throw new Error(`${model.slug} needs at least three ${field} entries.`);
      }
    }
    if (!Array.isArray(model.sources) || model.sources.length < 1) {
      throw new Error(`${model.slug} needs at least one reviewed external source.`);
    }
    if (!Array.isArray(model.relatedSlugs) || model.relatedSlugs.length !== 3) {
      throw new Error(`${model.slug} must declare exactly three relatedSlugs.`);
    }
    if (new Set(model.relatedSlugs).size !== 3) {
      throw new Error(`${model.slug} relatedSlugs must be unique.`);
    }
    for (const relatedSlug of model.relatedSlugs) {
      if (relatedSlug === model.slug || !modelSet.has(relatedSlug)) {
        throw new Error(`${model.slug} has invalid related target ${relatedSlug}.`);
      }
    }
    for (const source of model.sources) {
      if (!source.name || !source.scope || !/^https:\/\//.test(source.url)) {
        throw new Error(`${model.slug} has an invalid external source.`);
      }
    }
    for (const link of model.links) {
      if (!link.href || !link.label || !link.kind || !link.description) {
        throw new Error(`${model.slug} has an incomplete resource link.`);
      }
      if (!/^(?:\/|https:\/\/)/.test(link.href)) {
        throw new Error(`${model.slug} resource link must be local or HTTPS: ${link.href}`);
      }
      if (link.href.startsWith("/") && !existsSync(localRouteFile(link.href))) {
        throw new Error(`${model.slug} resource link does not resolve locally: ${link.href}`);
      }
    }
    const parts = defaultPartsFor(model);
    assertDefaultParts(model, parts);
    outputs.set(model.slug, parts);
  }
  return outputs;
}

function safeRemoveDirectory(directoryName) {
  const target = resolve(outputRoot, directoryName);
  const prefix = `${resolve(outputRoot)}${sep}`;
  if (!target.startsWith(prefix)) {
    throw new Error(`Refusing to remove path outside ${outputRoot}: ${target}`);
  }
  rmSync(target, { recursive: true, force: true });
}

function cleanObsoleteDirectories(expectedDirectories) {
  if (!existsSync(outputRoot)) return [];
  const removed = [];
  for (const entry of readdirSync(outputRoot, { withFileTypes: true })) {
    if (!entry.isDirectory() || expectedDirectories.has(entry.name)) continue;
    safeRemoveDirectory(entry.name);
    removed.push(entry.name);
  }
  return removed;
}

function writeText(path, contents) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, contents, "utf8");
}

const categoryBySlug = new Map(componentCategories.map((category) => [category.slug, category]));
const modelBySlug = new Map(componentModels.map((model) => [model.slug, model]));
const modelsByCategory = new Map(componentCategories.map((category) => [
  category.slug,
  componentModels.filter((model) => model.categorySlug === category.slug),
]));

const defaultOutputs = validateData();
mkdirSync(outputRoot, { recursive: true });
const expectedDirectories = new Set([
  ...componentCategories.map((category) => category.slug),
  ...componentModels.map((model) => model.slug),
]);
const removedDirectories = cleanObsoleteDirectories(expectedDirectories);

writeText(join(outputRoot, "index.html"), renderHub());

for (const category of componentCategories) {
  writeText(
    join(outputRoot, category.slug, "index.html"),
    renderCategory(category),
  );
}

const renderedDetails = componentModels.map((model) => {
  const parts = defaultOutputs.get(model.slug);
  return {
    model,
    parts,
    html: renderDetail(model, parts),
  };
});
const distinctiveness = assertDetailDistinctiveness(renderedDetails);

for (const { model, parts, html } of renderedDetails) {
  const directory = join(outputRoot, model.slug);
  writeText(join(directory, "index.html"), html);
  writeText(join(directory, "example-cut-list.csv"), exampleCsv(model, parts));
  writeText(
    join(directory, "model.json"),
    `${jsonForHtml(modelArtifact(model, parts), 2)}\n`,
  );
}

console.log(
  `Generated 1 component hub, ${componentCategories.length} category hubs, `
  + `${componentModels.length} component detail pages, ${componentModels.length} example CSV files, `
  + `and ${componentModels.length} model JSON files.`
);
console.log(
  `Validated ${componentModels.length} unique models across ${componentCategories.length} categories `
  + `(${componentModels.length / componentCategories.length} models per category).`
);
console.log(
  `Component detail distinctiveness passed; maximum 5-gram Jaccard similarity `
  + `${distinctiveness.maximumSimilarity.toFixed(3)} (${distinctiveness.closestPair.join(" vs ")}).`
);
console.log(
  removedDirectories.length
    ? `Removed ${removedDirectories.length} obsolete component directories: ${removedDirectories.join(", ")}.`
    : "Removed 0 obsolete component directories."
);
