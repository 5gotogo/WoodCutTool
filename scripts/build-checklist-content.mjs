import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { checklistCategories, checklistEntries } from "./checklist-data.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const siteUrl = "https://woodcuttool.com";

const esc = (value) => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

function jsonLd(value) {
  return `<script type="application/ld+json">${JSON.stringify(value, null, 2)}</script>`;
}

function pageShell({ title, description, route, schemas, body, type = "article", extraScript = "" }) {
  const canonical = `${siteUrl}${route}`;
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <meta name="robots" content="index,follow,max-image-preview:large">
  <link rel="canonical" href="${canonical}">
  <meta property="og:type" content="${type}">
  <meta property="og:site_name" content="WoodCutTool">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${siteUrl}/assets/og/woodcuttool-og.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(description)}">
  <meta name="twitter:image" content="${siteUrl}/assets/og/woodcuttool-og.png">
  <link rel="icon" href="/favicon.ico?v=rounded-mask-20260619" sizes="any">
  <link rel="stylesheet" href="/assets/styles.css">
  <script defer src="/assets/site-chrome.js"></script>
  <script defer src="/assets/app.js"></script>
  ${schemas.map(jsonLd).join("\n  ")}
  <style>.mega-menu{display:none}</style>
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>
  <div data-site-header></div>
  ${body}
  <div data-site-footer></div>
  ${extraScript}
</body>
</html>\n`;
}

function descriptionFor(entry) {
  let description = `${entry.summary} Use 7 checks, pass criteria, evidence notes, and a downloadable CSV before release.`;
  if (description.length > 165) {
    const clipped = description.slice(0, 162);
    description = `${clipped.slice(0, clipped.lastIndexOf(" "))}.`;
  }
  return description;
}

function titleFor(entry) {
  return `${entry.title} | WoodCutTool`;
}

function breadcrumbSchema(entry = null) {
  const trail = entry
    ? [["Home", "/"], ["Checklists", "/checklists/"], [entry.title, `/checklists/${entry.slug}/`]]
    : [["Home", "/"], ["Checklists", "/checklists/"]];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map(([name, route], index) => ({
      "@type": "ListItem",
      position: index + 1,
      name,
      item: `${siteUrl}${route}`,
    })),
  };
}

function faqFor(entry) {
  return [
    [
      `When should I use the ${entry.title}?`,
      `Use it ${entry.stage}. Run the checklist again after any change that affects dimensions, material, tooling, hardware, finish, installation, or responsibility.`,
    ],
    [
      "Does checking every box guarantee the project is safe or code compliant?",
      "No. The checklist is a release-control aid, not engineering, code approval, machine training, or manufacturer certification. Follow current product instructions and use a qualified professional when the work crosses those boundaries.",
    ],
    [
      "What evidence should I keep?",
      "Keep the active revision, source measurements, product data, test or mockup result, person responsible, date, and the reason for any approved exception. The downloadable CSV provides a compact place to record those decisions.",
    ],
    [
      "What happens if one item fails?",
      `Stop the affected work, identify the source of the mismatch, correct the smallest upstream cause, and repeat the failed check. ${entry.releaseGate}`,
    ],
  ];
}

function articleSchema(entry, description, faqs) {
  const route = `/checklists/${entry.slug}/`;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: entry.title,
    description,
    url: `${siteUrl}${route}`,
    mainEntityOfPage: `${siteUrl}${route}`,
    datePublished: entry.publishedDate,
    dateModified: entry.publishedDate,
    author: { "@type": "Organization", name: "WoodCutTool Editorial Team", url: `${siteUrl}/about/` },
    publisher: { "@type": "Organization", name: "WoodCutTool", url: `${siteUrl}/` },
    articleSection: entry.category,
    about: [entry.title, entry.category, "woodworking checklist", "release control"],
    mainEntity: {
      "@type": "HowTo",
      name: `How to use the ${entry.title}`,
      totalTime: "PT15M",
      step: entry.checks.map(([name, verify, pass], index) => ({
        "@type": "HowToStep",
        position: index + 1,
        name,
        text: `${verify} Pass when: ${pass}`,
      })),
    },
    mentions: faqs.map(([name]) => ({ "@type": "Thing", name })),
  };
}

function faqSchema(faqs) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(([name, text]) => ({
      "@type": "Question",
      name,
      acceptedAnswer: { "@type": "Answer", text },
    })),
  };
}

function csvEscape(value) {
  const text = String(value).replaceAll('"', '""');
  return `"${text}"`;
}

function csvFor(entry) {
  const header = ["Order", "Status", "Check", "How to verify", "Pass criteria", "Evidence / owner / date"];
  const rows = entry.checks.map(([name, verify, pass], index) => [index + 1, "", name, verify, pass, ""]);
  return `${[header, ...rows].map((row) => row.map(csvEscape).join(",")).join("\n")}\n`;
}

function relatedEntries(entry) {
  const group = checklistEntries.filter((candidate) => candidate.categorySlug === entry.categorySlug);
  const index = group.findIndex((candidate) => candidate.slug === entry.slug);
  return [1, 2, 3].map((offset) => group[(index + offset) % group.length]);
}

function checklistPage(entry) {
  const route = `/checklists/${entry.slug}/`;
  const title = titleFor(entry);
  const description = descriptionFor(entry);
  const faqs = faqFor(entry);
  const checks = entry.checks.map(([name, verify, pass], index) => `<li class="checklist-item">
          <input id="check-${index + 1}" type="checkbox" data-checklist-item>
          <label for="check-${index + 1}"><span class="checklist-number">${String(index + 1).padStart(2, "0")}</span><span><strong>${esc(name)}</strong><small>Release check</small></span></label>
          <div class="checklist-detail"><p><strong>Verify</strong>${esc(verify)}</p><p><strong>Pass when</strong>${esc(pass)}</p><p class="checklist-evidence"><strong>Record</strong>Source, measured or observed result, owner, date, and any approved exception.</p></div>
        </li>`).join("");
  const related = relatedEntries(entry).map((candidate) => `<a class="research-card checklist-related-card" href="/checklists/${candidate.slug}/"><span>${esc(candidate.category)} · 7 checks</span><h2>${esc(candidate.title)}</h2><p>${esc(candidate.summary)}</p><strong>Open checklist →</strong></a>`).join("");
  const resourceLinks = entry.links.map(([href, label, kind]) => `<a class="research-card" href="${href}"><span>${esc(kind)}</span><h2>${esc(label)}</h2><p>Continue with the method, evidence, or action that supports this release decision.</p><strong>Open resource →</strong></a>`).join("");
  const faqMarkup = faqs.map(([question, answer]) => `<h3>${esc(question)}</h3><p>${esc(answer)}</p>`).join("");
  const firstThree = entry.checks.slice(0, 3).map(([name]) => `<li><strong>${esc(name)}</strong> must have a named source and an observable result; “looks fine” is not a release record.</li>`).join("");

  return pageShell({
    title,
    description,
    route,
    schemas: [articleSchema(entry, description, faqs), faqSchema(faqs), breadcrumbSchema(entry)],
    body: `<main id="main" class="article-shell research-shell checklist-shell">
    <article class="article-body research-article checklist-article">
      <p class="breadcrumb"><a href="/">Home</a> / <a href="/checklists/">Checklists</a> / ${esc(entry.title)}</p>
      <p class="eyebrow">Woodworking Checklists · ${esc(entry.category)}</p>
      <h1>${esc(entry.title)}</h1>
      <p class="lead">${esc(entry.summary)}</p>
      <p class="article-byline">Published ${entry.publishedDate} by <a href="/about/">WoodCutTool Editorial Team</a> · Practical release control, not a substitute for manufacturer instructions, training, engineering, or code review</p>

      <section class="research-metrics" aria-label="Checklist summary">
        <div class="research-metric"><span>Release checks</span><strong>${entry.checks.length}</strong><small>Every item needs evidence</small></div>
        <div class="research-metric"><span>Estimated review</span><strong>15 min</strong><small>Longer when a test fails</small></div>
        <div class="research-metric"><span>Category</span><strong>${esc(entry.category)}</strong><small>${esc(entry.stage)}</small></div>
        <div class="research-metric"><span>Download</span><strong>CSV</strong><small>Owner and evidence columns included</small></div>
      </section>

      <section class="checklist-answer"><p class="eyebrow">Release decision first</p><h2>What has to be true before work continues?</h2><p>${esc(entry.releaseGate)}</p><p>A checked box means the result was observed and compared with a pass criterion. It does not mean someone remembers discussing the issue. When an item fails, keep the current revision or setup intact, mark the affected work on hold, and correct the upstream source before generating new dimensions, buying more material, repeating a machining operation, or concealing the condition in later work.</p></section>

      <section><h2>Scope, owner, and evidence</h2><p>Use this checklist ${esc(entry.stage)}. Assign one person to own the review and name a second person for independent confirmation when the result controls safety, a large batch, expensive material, hidden work, or an external trade. The owner should be able to point to the drawing, measurement, product instruction, sample, mockup, test piece, or inspection that supports each answer.</p><p>Start from the active project revision. Record the unit and datum used, the actual material or hardware model, the test method, the observed result, and the date. If a condition is accepted as an exception, write who approved it, why it remains acceptable, and which downstream documents or teams must receive the decision. That short record is what turns a checklist from a memory aid into a repeatable release control.</p></section>

      <section aria-labelledby="working-checklist"><div class="checklist-toolbar"><div><p class="eyebrow">Interactive working copy</p><h2 id="working-checklist">${entry.checks.length}-point ${esc(entry.title)}</h2><p>Selections stay only in this page and reset when it is closed. Use the CSV for a durable project record.</p></div><div class="checklist-actions"><span class="checklist-progress" data-checklist-count aria-live="polite">0 of ${entry.checks.length} verified</span><button class="button secondary" type="button" onclick="window.print()">Print checklist</button><a class="button" href="/checklists/${entry.slug}/checklist.csv" download>Download CSV</a></div></div>
        <ol class="checklist-list">${checks}</ol>
      </section>

      <section class="checklist-stop"><p class="eyebrow">Hold point</p><h2>Stop when evidence and expectation disagree</h2><p><strong>${esc(entry.releaseGate)}</strong></p><p>Do not solve a failed item by quietly changing a downstream part. First identify whether the source is design, measurement, material, setup, hardware, environment, or installation. Preserve the failed sample or photograph the condition, update the responsible source, and rerun every dependent calculation or check. Restart only with a named revision and a fresh first article, mockup, fit test, or inspection appropriate to the work.</p></section>

      <section><h2>Three failure patterns this checklist prevents</h2><ul class="checklist-failure-list">${firstThree}</ul><p>The other recurring failure is sequence: a correct decision made after material is cut or hidden work is closed is still too late. Put the checklist at the release point named above, not at final inspection. Final inspection should confirm that controls worked; it should not be the first time someone asks what the controlling dimension, product model, or acceptance rule was.</p></section>

      <section><h2>How to record a defensible release</h2><p>For every completed row, record the source and the actual result. For example, “manufacturer sheet dated 2026-06, 16 mm minimum side clearance” is stronger than “manual checked”; “opening measured 914 mm at top, 912 mm at bottom from left finished panel” is stronger than “opening okay.” A short, concrete entry lets another person reproduce the conclusion and spot when a later substitution or revision invalidates it.</p><p>The downloadable CSV contains one row per check plus columns for status, evidence, owner, and date. Save it with the drawing or job traveler that it releases. If the project changes, keep the old file as evidence and issue a new checklist with the new revision. Never overwrite the only record of why material was ordered, a batch was machined, hardware was drilled, or site work was accepted.</p></section>

      <section><h2>Related checklists in ${esc(entry.category)}</h2><div class="research-card-grid checklist-related-grid">${related}</div></section>
      <section><h2>Use the right next resource</h2><div class="research-card-grid checklist-resource-grid">${resourceLinks}</div><p>A checklist can confirm that inputs, tests, and approvals exist, but it does not calculate a cut layout, choose a structural connection, certify a machine, or replace current product data. Use the linked method or tool for the next decision and return here to record the result before release.</p></section>

      <section><h2>Method and safety boundaries</h2><p>WoodCutTool checklists use a simple control loop: define the release point, verify the source, observe the real condition, compare it with an explicit pass rule, record the result, and stop when the two disagree. They deliberately avoid universal tolerances, load claims, coating schedules, and fastener capacities because those depend on the design, material, machine, hardware, environment, manufacturer, and local requirements.</p><p>Follow current machine and product instructions, use suitable PPE and dust or fume controls, and keep guards and safety systems in place. Structural, electrical, plumbing, gas, fire, accessibility, and building-code decisions require the appropriate qualified professional or authority. A completed page documents a workshop decision; it does not expand the user's training, the tool's rating, or the product's certified use.</p></section>

      <section><h2>Frequently asked questions</h2>${faqMarkup}</section>
      <section class="research-note"><h2>Keep the release with the project</h2><p><a class="button" href="/checklists/${entry.slug}/checklist.csv" download>Download the checklist CSV</a> <a class="button secondary" href="/checklists/">Browse all 70 checklists</a></p><p>Record one owner, one revision, and one observable result for every completed row.</p></section>
    </article>
  </main>`,
    extraScript: `<script>
  (() => {
    const items = [...document.querySelectorAll("[data-checklist-item]")];
    const output = document.querySelector("[data-checklist-count]");
    const update = () => {
      const complete = items.filter((item) => item.checked).length;
      output.textContent = complete + " of ${entry.checks.length} verified";
      output.dataset.complete = complete === items.length ? "true" : "false";
    };
    items.forEach((item) => item.addEventListener("change", update));
  })();
</script>`,
  });
}

function validateSource() {
  const expectedCategories = [
    "Planning & Measurement",
    "Materials & Purchasing",
    "Cutting & Machining",
    "Assembly & Joinery",
    "Cabinets & Hardware",
    "Installation & Site Work",
    "Finishing & Handoff",
  ];
  const seen = new Set();
  if (checklistCategories.length !== expectedCategories.length) throw new Error(`Expected ${expectedCategories.length} checklist categories.`);
  if (checklistEntries.length !== 70) throw new Error(`Expected 70 checklist entries, found ${checklistEntries.length}.`);
  checklistCategories.forEach((category, index) => {
    if (category.name !== expectedCategories[index]) throw new Error(`Unexpected category order: ${category.name}`);
    if (category.topics.length !== 10) throw new Error(`${category.name} has ${category.topics.length} topics; expected 10.`);
  });
  for (const entry of checklistEntries) {
    if (seen.has(entry.slug)) throw new Error(`Duplicate checklist slug: ${entry.slug}`);
    seen.add(entry.slug);
    if (entry.checks.length !== 7) throw new Error(`${entry.slug} has ${entry.checks.length} checks; expected 7.`);
    if (entry.focusChecks.length !== 3) throw new Error(`${entry.slug} must have three topic-specific checks.`);
    const title = titleFor(entry);
    const description = descriptionFor(entry);
    if (title.length < 20 || title.length > 70) throw new Error(`SEO title length ${title.length}: ${entry.slug}`);
    if (description.length < 120 || description.length > 165) throw new Error(`Meta description length ${description.length}: ${entry.slug}`);
    for (const [href] of entry.links) {
      const target = href.endsWith("/") ? join(root, href, "index.html") : join(root, href);
      if (!existsSync(target)) throw new Error(`Missing local resource ${href} for ${entry.slug}`);
    }
  }
}

validateSource();

const categorySections = checklistCategories.map((category) => {
  const entries = checklistEntries.filter((entry) => entry.categorySlug === category.slug);
  const cards = entries.map((entry) => `<a class="research-card checklist-card" data-checklist-card data-search="${esc(`${entry.title} ${entry.summary} ${entry.category}`.toLowerCase())}" href="/checklists/${entry.slug}/"><span>${esc(entry.category)} · 7 checks</span><h2>${esc(entry.title)}</h2><p>${esc(entry.summary)}</p><strong>Open checklist →</strong></a>`).join("");
  return `<section id="${category.slug}" data-checklist-section><div class="section-heading compact"><p class="eyebrow">${esc(category.name)} · ${entries.length} checklists</p><h2>${esc(category.name)}</h2><p>${esc(category.description)}</p></div><div class="research-card-grid checklist-card-grid">${cards}</div></section>`;
}).join("");

const hubDescription = "Use 70 woodworking checklists for planning, buying, cutting, assembly, cabinets, installation, finishing, and project handoff with clear release gates.";
const hubSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Woodworking Checklists",
  description: hubDescription,
  url: `${siteUrl}/checklists/`,
  mainEntity: {
    "@type": "ItemList",
    numberOfItems: checklistEntries.length,
    itemListElement: checklistEntries.map((entry, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: entry.title,
      url: `${siteUrl}/checklists/${entry.slug}/`,
    })),
  },
};
const categoryNav = checklistCategories.map((category) => `<a href="#${category.slug}">${esc(category.name)} <span>${category.topics.length}</span></a>`).join("");
const hubHtml = pageShell({
  title: "70 Woodworking Checklists: Plan, Build & Install",
  description: hubDescription,
  route: "/checklists/",
  type: "website",
  schemas: [hubSchema, breadcrumbSchema()],
  body: `<main id="main" class="article-shell research-shell checklist-shell checklist-hub">
    <article class="article-body research-article checklist-article">
      <p class="breadcrumb"><a href="/">Home</a> / Checklists</p>
      <p class="eyebrow">New · 70 release-ready workshop controls</p>
      <h1>Woodworking Checklists: Verify the Work Before It Becomes Rework</h1>
      <p class="lead">Use a checklist at the moment a project changes state: design to order, stock to cutting, parts to assembly, cabinets to installation, or finish to handoff. Every page pairs seven observable checks with pass criteria, a stop condition, a printable working copy, and a downloadable CSV record.</p>
      <nav class="checklist-category-nav" aria-label="Checklist categories">${categoryNav}</nav>
      <section class="research-metrics" aria-label="Checklist library summary">
        <div class="research-metric"><span>Detailed checklists</span><strong>70</strong><small>One release decision per page</small></div>
        <div class="research-metric"><span>Categories</span><strong>7</strong><small>Planning through closeout</small></div>
        <div class="research-metric"><span>Release checks</span><strong>490</strong><small>Seven checks per workflow</small></div>
        <div class="research-metric"><span>Downloads</span><strong>70 CSVs</strong><small>Evidence, owner, and date fields</small></div>
      </section>
      <section class="checklist-answer"><p class="eyebrow">How this column is different</p><h2>Learn explains the method. Checklists decide whether work can proceed.</h2><p><a href="/learn/">Learn guides</a> teach complete workflows, <a href="/templates/">templates</a> provide starting inputs, <a href="/examples/">examples</a> show finished datasets, and <a href="/troubleshooting/">Troubleshooting</a> starts after a failure appears. Checklists sit at the handoff between those surfaces. They ask whether the drawing, material, setup, test, approval, and evidence are complete enough to release the next irreversible step.</p></section>
      <section class="checklist-finder"><label for="checklist-search"><strong>Find a release checklist</strong><span>Search by task, hardware, material, installation, or finishing stage.</span></label><input id="checklist-search" type="search" placeholder="Try drawer slides, plywood order, glue-up, wall cabinet…" autocomplete="off" data-checklist-filter><p data-checklist-status aria-live="polite">Showing all 70 checklists.</p></section>
      ${categorySections}
      <section><h2>Use the library as a connected project control system</h2><p>Begin with Planning &amp; Measurement to release dimensions and responsibility. Move to Materials &amp; Purchasing only when the specification and usable-stock assumptions are clear. Cutting &amp; Machining and Assembly &amp; Joinery use first articles and dry fits to keep one setup error from becoming a batch. Cabinets &amp; Hardware and Installation &amp; Site Work connect the shop model to real products and field conditions. Finishing &amp; Handoff preserves the approved sample, cure limits, final condition, and as-built record.</p><p>Each checklist links to a calculator, Learn guide, template, troubleshooting path, reference, or CutList action. The links are not decoration: they are where the evidence comes from. Run the method, calculation, mockup, or diagnostic step, then return to the checklist and record the result that supports release.</p></section>
      <section><h2>Release rules shared by every checklist</h2><ol class="checklist-principles"><li><strong>Name the revision.</strong> A correct check against an obsolete drawing is still a failed release.</li><li><strong>Use an observable result.</strong> Record a measurement, product requirement, test, sample, fit, photo, or signed decision.</li><li><strong>Assign an owner.</strong> “The team checked it” does not identify who can answer a question later.</li><li><strong>Stop at disagreement.</strong> Do not hide a failed input by trimming, forcing, over-ordering, or shifting a downstream part.</li><li><strong>Regenerate dependencies.</strong> A changed dimension can affect layouts, quantities, labels, hardware, purchasing, and installation together.</li></ol></section>
      <section class="research-note"><h2>Start at the next irreversible decision</h2><p><a class="button" href="#planning-measurement">Browse planning checks</a> <a class="button secondary" href="/apps/cutlist/">Open CutList</a></p><p>Choose the checklist that controls the next order, cut, glue-up, drilling pattern, installation, coating, or handoff.</p></section>
    </article>
  </main>`,
  extraScript: `<script>
  (() => {
    const input = document.querySelector("[data-checklist-filter]");
    const cards = [...document.querySelectorAll("[data-checklist-card]")];
    const sections = [...document.querySelectorAll("[data-checklist-section]")];
    const status = document.querySelector("[data-checklist-status]");
    const filter = () => {
      const query = input.value.trim().toLowerCase();
      let visible = 0;
      cards.forEach((card) => {
        const matches = !query || card.dataset.search.includes(query);
        card.hidden = !matches;
        if (matches) visible += 1;
      });
      sections.forEach((section) => {
        section.hidden = !section.querySelector("[data-checklist-card]:not([hidden])");
      });
      status.textContent = query ? "Showing " + visible + " matching checklist" + (visible === 1 ? "" : "s") + "." : "Showing all 70 checklists.";
    };
    input.addEventListener("input", filter);
  })();
</script>`,
});

await mkdir(join(root, "checklists"), { recursive: true });
await writeFile(join(root, "checklists", "index.html"), hubHtml);
for (const entry of checklistEntries) {
  const dir = join(root, "checklists", entry.slug);
  await mkdir(dir, { recursive: true });
  await Promise.all([
    writeFile(join(dir, "index.html"), checklistPage(entry)),
    writeFile(join(dir, "checklist.csv"), csvFor(entry)),
  ]);
}

console.log(`Generated ${checklistEntries.length} woodworking checklists, ${checklistEntries.length} CSVs, and ${checklistCategories.length} category sections.`);
