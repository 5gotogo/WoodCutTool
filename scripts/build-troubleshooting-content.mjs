import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { troubleshootingIssues } from "./troubleshooting-data.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const siteUrl = "https://woodcuttool.com";
const publishedDate = "2026-07-19";
const dateFor = (entry) => entry.publishedDate || publishedDate;

const esc = (value) => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

const lowerFirst = (value) => `${value.charAt(0).toLowerCase()}${value.slice(1)}`;
const plural = (count, singular, pluralValue = `${singular}s`) => count === 1 ? singular : pluralValue;

function jsonLd(value) {
  return `<script type="application/ld+json">${JSON.stringify(value, null, 2)}</script>`;
}

function breadcrumbSchema(entry = null) {
  const trail = entry
    ? [["Home", "/"], ["Troubleshooting", "/troubleshooting/"], [entry.title, `/troubleshooting/${entry.slug}/`]]
    : [["Home", "/"], ["Troubleshooting", "/troubleshooting/"]];
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

function descriptionFor(entry) {
  const suffix = "Follow a 10-minute check to find the root cause, choose a safe fix, and prevent the same workshop failure before more material is cut.";
  let description = `Diagnose ${entry.query}. ${suffix}`;
  if (description.length > 160) {
    description = `Diagnose ${entry.query}. Find the root cause with a practical check, choose a safe fix, and prevent the same failure before more material is cut.`;
  }
  if (description.length < 130) description += " Use the step-by-step decision table.";
  if (description.length > 160) {
    const clipped = description.slice(0, 157);
    description = `${clipped.slice(0, clipped.lastIndexOf(" "))}.`;
  }
  return description;
}

function titleFor(entry) {
  const title = `${entry.title} | WoodCutTool`;
  if (title.length <= 65) return title;
  return `${entry.title
    .replace(": Diagnose Before Fixing", ": Diagnosis")
    .replace(": Find and Merge Safely", ": Safe Fix")
    .replace(": Find the Reference Error", ": Reference Check")} | WoodCutTool`;
}

function pageShell({ title, description, route, schemas, body, type = "article" }) {
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
</body>
</html>\n`;
}

function metric(label, value, note) {
  return `<div class="research-metric"><span>${esc(label)}</span><strong>${esc(value)}</strong><small>${esc(note)}</small></div>`;
}

function faqFor(entry) {
  return [
    [
      `What should I check first when dealing with ${entry.query}?`,
      `Begin with the observable symptom and the first row of the diagnostic matrix. Record the result before changing the design or machine setup. That keeps one correction from hiding another cause and gives you a repeatable explanation for the final decision.`,
    ],
    [
      "Should I change the cut list to make the problem disappear?",
      `Only after measurements show the source dimensions or approved design must change. Do not edit a finished part merely to force a layout, conceal a setup error, or recover an installation conflict. Preserve the original revision and document the reason for every changed field.`,
    ],
    [
      "When is it safe to continue cutting or assembly?",
      `Continue only after one controlled test or first-article part passes the relevant dimension, fit, orientation, and safety checks. ${entry.stopCondition}`,
    ],
    [
      "Can an optimizer or calculator guarantee the fix?",
      `No. A calculator can expose geometry, quantities, kerf, sheet size, or clearance assumptions, but it cannot inspect the material, machine, wall, hardware, or physical assembly. Use the linked tool to verify arithmetic, then confirm the result against the actual project.`,
    ],
  ];
}

function articleSchema(entry, description, faqs) {
  const route = `/troubleshooting/${entry.slug}/`;
  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: entry.title,
    description,
    url: `${siteUrl}${route}`,
    mainEntityOfPage: `${siteUrl}${route}`,
    datePublished: dateFor(entry),
    dateModified: dateFor(entry),
    author: { "@type": "Organization", name: "WoodCutTool Editorial Team", url: `${siteUrl}/about/` },
    publisher: { "@type": "Organization", name: "WoodCutTool", url: `${siteUrl}/` },
    proficiencyLevel: "Beginner to intermediate",
    about: [entry.query, entry.category, "woodworking troubleshooting", "cut list verification"],
    mainEntity: {
      "@type": "HowTo",
      name: `How to diagnose ${entry.query}`,
      step: entry.fixSteps.map((text, index) => ({
        "@type": "HowToStep",
        position: index + 1,
        name: `Step ${index + 1}`,
        text,
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

function issuePage(entry) {
  const route = `/troubleshooting/${entry.slug}/`;
  const title = titleFor(entry);
  const description = descriptionFor(entry);
  const faqs = faqFor(entry);
  const [primaryHref, primaryLabel, guideHref, guideLabel, evidenceHref, evidenceLabel] = entry.links;
  const causeCards = entry.causes.map(([name, detail], index) => `<article class="troubleshooting-cause"><span>Cause ${index + 1}</span><h3>${esc(name)}</h3><p>${esc(detail)} This cause becomes more likely when it matches the physical pattern instead of only the expected answer.</p></article>`).join("");
  const matrixRows = entry.checks.map(([signal, test, likelyCause, action]) => `<tr><th scope="row">${esc(signal)}</th><td>${esc(test)}</td><td>${esc(likelyCause)}</td><td>${esc(action)}</td></tr>`).join("");
  const fixSteps = entry.fixSteps.map((step, index) => `<li><strong>${index + 1}. ${esc(step)}</strong> Record the starting condition and result so the next step tests one variable instead of changing several assumptions at once.</li>`).join("");
  const prevention = entry.prevention.map((item) => `<li>${esc(item)} Add the decision to the project record when it affects dimensions, material, orientation, hardware, or purchasing.</li>`).join("");
  const faqMarkup = faqs.map(([question, answer]) => `<h3>${esc(question)}</h3><p>${esc(answer)}</p>`).join("");

  return pageShell({
    title,
    description,
    route,
    schemas: [articleSchema(entry, description, faqs), faqSchema(faqs), breadcrumbSchema(entry)],
    body: `<main id="main" class="article-shell research-shell troubleshooting-shell">
    <article class="article-body research-article troubleshooting-article">
      <p class="breadcrumb"><a href="/">Home</a> / <a href="/troubleshooting/">Troubleshooting</a> / ${esc(entry.title)}</p>
      <p class="eyebrow">Troubleshooting · ${esc(entry.category)}</p>
      <h1>${esc(entry.title)}</h1>
      <p class="lead">${esc(entry.answer)}</p>
      <p class="article-byline">Published ${dateFor(entry)} by <a href="/about/">WoodCutTool Editorial Team</a> · Diagnostic workflow, not a substitute for machine, hardware, material, or building instructions</p>

      <section class="research-metrics" aria-label="Diagnostic summary">
        ${metric("Symptom", "1", "Start from the observed failure")}
        ${metric("Likely causes", String(entry.causes.length), "Test before changing dimensions")}
        ${metric("Diagnostic checks", String(entry.checks.length), "One controlled variable at a time")}
        ${metric("Release gate", "1st article", "Verify before batch work")}
      </section>

      <section class="troubleshooting-answer"><p class="eyebrow">The answer first</p><h2>What should you do right now?</h2><p>${esc(entry.answer)}</p><p>The important distinction is between a <strong>calculation problem</strong>, where the inputs or arithmetic are wrong; a <strong>fabrication problem</strong>, where the setup or material does not match the plan; and a <strong>design problem</strong>, where the intended part cannot satisfy the available geometry or clearance. The checks below separate those paths before you consume more stock or make a compensating edit that spreads the error.</p></section>

      <section><h2>Symptom fingerprint</h2><div class="troubleshooting-symptom"><strong>Observed condition</strong><p>${esc(entry.symptom)}</p></div><p>Photograph the condition, record the active revision, and write down the measurement method before touching the setup. A useful symptom is specific: which part, which face or edge, which direction, how many pieces, and whether the error is consistent or changing. That evidence helps distinguish one incorrect input from a process that is drifting.</p><p>Do not begin by trimming, forcing, or globally changing dimensions. Those actions may make one assembly look better while destroying interchangeability, grain intent, hardware clearance, or the ability to explain the final material count.</p></section>

      <section><h2>Most likely causes</h2><p>Use these as testable hypotheses, not automatic conclusions. More than one cause can exist, but changing several variables together makes it impossible to know which correction worked.</p><div class="troubleshooting-cause-grid">${causeCards}</div></section>

      <section><h2>10-minute diagnostic matrix</h2><p>Work down the rows in order. The “signal” column names the question, the test creates evidence, and the last two columns tell you what the result means and what to do next. Keep the original list or setup unchanged in a saved baseline so the comparison remains reversible.</p><div class="research-table-wrap troubleshooting-table-wrap"><table class="research-table troubleshooting-table"><thead><tr><th>Signal</th><th>Test</th><th>What the result means</th><th>Next action</th></tr></thead><tbody>${matrixRows}</tbody></table></div><p>If a check fails, correct that source and repeat the same check before moving on. If every check passes but the symptom remains, widen the investigation to the machine manual, hardware instructions, material supplier, field conditions, or a qualified trade as appropriate. A calculator is useful evidence, but it cannot observe physical setup.</p></section>

      <section><h2>Fix sequence: make the smallest verified correction</h2><ol class="troubleshooting-steps">${fixSteps}</ol><p>After step five, create one controlled first article or dry-fit. Compare it with the released dimension, orientation, clearance, and visible-face requirements. Only then should the corrected process be applied to repeated parts, the complete cabinet run, or the purchasing plan.</p></section>

      <section class="troubleshooting-stop"><p class="eyebrow">Stop condition</p><h2>When not to continue</h2><p><strong>${esc(entry.stopCondition)}</strong></p><p>A stop condition protects more than material. It prevents a questionable assumption from reaching machining, edge treatment, finishing, hardware installation, or site work where recovery becomes slower and more expensive. Mark the affected parts or documents so another person cannot resume from the unresolved setup.</p></section>

      <section><h2>Prevention checklist for the next release</h2><ul class="troubleshooting-checklist">${prevention}</ul><p>Prevention works best when it lives in the source project, not in memory. Put critical unit, material, grain, edge, hardware, trim, kerf, and revision decisions next to the affected part. When a change alters sheet count or assembly clearance, regenerate the downstream layout, labels, and purchase total together.</p></section>

      <section><h2>Use the right next tool</h2><div class="troubleshooting-link-grid"><a class="research-card" href="${primaryHref}"><span>Calculate</span><h2>${esc(primaryLabel)}</h2><p>Use your measured project inputs to verify the relevant dimensions, quantities, or layout.</p><strong>Open tool →</strong></a><a class="research-card" href="${guideHref}"><span>Learn</span><h2>${esc(guideLabel)}</h2><p>Read the deeper method and understand which assumptions must be recorded.</p><strong>Read guide →</strong></a><a class="research-card" href="${evidenceHref}"><span>Apply</span><h2>${esc(evidenceLabel)}</h2><p>Compare a related example, dataset, template, or project workflow before release.</p><strong>Open resource →</strong></a></div></section>

      <section><h2>Method and limits</h2><p>This page uses a fault-isolation method: define the observed failure, preserve a baseline, test one likely cause, record the result, make the smallest justified change, and verify a first article. It deliberately avoids universal tolerance claims because acceptable error depends on material, joinery, hardware, finish, machine capability, installation conditions, and the project drawing.</p><p>WoodCutTool calculators can help check arithmetic, usable stock, kerf, repeated quantities, or layout geometry. They do not certify structural design, machine condition, electrical or plumbing work, product installation, or building-code compliance. Follow manufacturer instructions and engage a qualified professional when the diagnosis crosses those boundaries.</p></section>

      <section><h2>Frequently asked questions</h2>${faqMarkup}</section>

      <section class="research-note"><h2>Turn the diagnosis into a verified plan</h2><p><a class="button" href="${primaryHref}">${esc(primaryLabel)}</a> <a class="button secondary" href="/troubleshooting/">Browse all troubleshooting topics</a></p><p>Save the corrected inputs, regenerate the layout or list, and release one revision that matches the shop and installation documents.</p></section>
    </article>
  </main>`,
  });
}

const categories = [...new Set(troubleshootingIssues.map((entry) => entry.category))];
const categoryOrder = ["Layouts", "Cutting", "Cabinets", "Materials", "Workflow"];
const categoryDescriptions = {
  Layouts: "Sheet count, fit, kerf, rotation, grain, offcuts, and first-cut problems.",
  Cutting: "Undersize parts, drifting repeats, square cuts, and machine-setup evidence.",
  Cabinets: "Case square, doors, drawers, fillers, appliance openings, and installation datums.",
  Materials: "Plywood, melamine, banding, shelf stiffness, defects, and usable sheet edges.",
  Workflow: "Quantities, duplicate rows, units, revisions, labels, hardware, and purchasing.",
};

const groupedSections = categoryOrder.map((category) => {
  const entries = troubleshootingIssues.filter((entry) => entry.category === category);
  const cards = entries.map((entry) => `<a class="research-card troubleshooting-card" href="/troubleshooting/${entry.slug}/"><span>${esc(category)} · ${entry.checks.length} checks</span><h2>${esc(entry.title)}</h2><p>${esc(entry.symptom)}</p><strong>Diagnose the problem →</strong></a>`).join("");
  return `<section id="${category.toLowerCase()}"><div class="section-heading compact"><p class="eyebrow">${esc(category)}</p><h2>${esc(category)} troubleshooting</h2><p>${esc(categoryDescriptions[category])}</p></div><div class="research-card-grid troubleshooting-card-grid">${cards}</div></section>`;
}).join("");

const hubDescription = `Diagnose ${troubleshootingIssues.length} common cut-list, plywood, cutting, cabinet, material, and workflow problems with answer-first checks, fixes, and prevention steps.`;
const hubSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Woodworking Troubleshooting",
  description: hubDescription,
  url: `${siteUrl}/troubleshooting/`,
  mainEntity: {
    "@type": "ItemList",
    numberOfItems: troubleshootingIssues.length,
    itemListElement: troubleshootingIssues.map((entry, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: entry.title,
      url: `${siteUrl}/troubleshooting/${entry.slug}/`,
    })),
  },
};

const categoryNav = categoryOrder.map((category) => `<a href="#${category.toLowerCase()}">${esc(category)} <span>${troubleshootingIssues.filter((entry) => entry.category === category).length}</span></a>`).join("");
const hubHtml = pageShell({
  title: `Woodworking Troubleshooting: Diagnose ${troubleshootingIssues.length} Problems`,
  description: hubDescription,
  route: "/troubleshooting/",
  type: "website",
  schemas: [hubSchema, breadcrumbSchema()],
  body: `<main id="main" class="article-shell research-shell troubleshooting-shell">
    <article class="article-body research-article troubleshooting-article">
      <p class="breadcrumb"><a href="/">Home</a> / Troubleshooting</p>
      <p class="eyebrow">New · Answer-first diagnostic library</p>
      <h1>Woodworking Troubleshooting: Find the Cause Before the Fix</h1>
      <p class="lead">Start with the failure you can see, then work through a short diagnostic sequence before changing dimensions or consuming more material. These pages connect problem-shaped searches to measurable checks, safe stop conditions, and the exact WoodCutTool resource needed for the next decision.</p>
      <div class="troubleshooting-category-nav" aria-label="Troubleshooting categories">${categoryNav}</div>
      <section class="research-metrics" aria-label="Troubleshooting library summary">
        ${metric("Diagnostic pages", String(troubleshootingIssues.length), "One specific symptom per page")}
        ${metric("Categories", String(categories.length), "Layouts, cutting, cabinets, materials, workflow")}
        ${metric("Minimum checks", String(Math.min(...troubleshootingIssues.map((entry) => entry.checks.length))), "Every page has a decision table")}
        ${metric("Thin pages", "0", "Cause, test, fix, stop, and prevention")}
      </section>
      <section class="troubleshooting-answer"><p class="eyebrow">How to use this library</p><h2>Search by symptom, not by the fix you hope will work</h2><p>Choose the page whose observed condition matches the project. Preserve the current list, layout, or setup; run the checks in order; and change one variable at a time. A specific diagnosis produces a defensible next action. A guessed fix can move the same error into assembly, finishing, installation, or the material order.</p></section>
      ${groupedSections}
      <section><h2>Why troubleshooting deserves its own column</h2><p><a href="/learn/">Learn guides</a> explain a complete method, <a href="/templates/">templates</a> help define a project, and <a href="/examples/">cut list examples</a> publish finished inputs and layouts. Troubleshooting pages begin later: something no longer fits, matches, cuts, or reconciles. Their job is to help a reader isolate the cause and return to the correct tool or source document.</p><p>That distinction also keeps search intent clear. A reader asking “why did my optimizer add a sheet?” needs a threshold test before a general optimization lesson. A reader asking “why are my drawer fronts uneven?” needs to separate case, hardware, box, and front errors before another dimension is cut.</p></section>
      <section class="research-note"><h2>Start with the planning evidence</h2><p><a class="button" href="/apps/cutlist/">Open CutList</a> <a class="button secondary" href="/examples/">Inspect cut list examples</a></p><p>Keep the current revision as a baseline, then use the matching diagnostic page to verify the next change.</p></section>
    </article>
  </main>`,
});

for (const entry of troubleshootingIssues) {
  const title = titleFor(entry);
  const description = descriptionFor(entry);
  if (title.length > 65) throw new Error(`SEO title is too long (${title.length}): ${entry.slug}`);
  if (description.length < 125 || description.length > 160) throw new Error(`Meta description length ${description.length}: ${entry.slug}`);
}

await mkdir(join(root, "troubleshooting"), { recursive: true });
await writeFile(join(root, "troubleshooting", "index.html"), hubHtml);
for (const entry of troubleshootingIssues) {
  const dir = join(root, "troubleshooting", entry.slug);
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, "index.html"), issuePage(entry));
}

console.log(`Generated ${troubleshootingIssues.length} troubleshooting pages across ${categories.length} ${plural(categories.length, "category", "categories")}.`);
