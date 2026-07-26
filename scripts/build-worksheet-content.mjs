import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { worksheetCategories, worksheetEntries } from "./worksheet-data.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const siteUrl = "https://woodcuttool.com";

const esc = (value) => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

const jsonLd = (value) => `<script type="application/ld+json">${JSON.stringify(value, null, 2)}</script>`;

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

function titleFor(entry) {
  return `${entry.title} | WoodCutTool`;
}

function descriptionFor(entry) {
  return `Free ${entry.title.toLowerCase()} with eight project fields, example entries, a printable working copy, and a downloadable CSV.`;
}

function breadcrumbSchema(entry = null) {
  const trail = entry
    ? [["Home", "/"], ["Worksheets", "/worksheets/"], [entry.title, `/worksheets/${entry.slug}/`]]
    : [["Home", "/"], ["Worksheets", "/worksheets/"]];
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

function worksheetSchema(entry, description) {
  const route = `/worksheets/${entry.slug}/`;
  return {
    "@context": "https://schema.org",
    "@type": ["CreativeWork", "DigitalDocument"],
    name: entry.title,
    headline: entry.title,
    description,
    url: `${siteUrl}${route}`,
    mainEntityOfPage: `${siteUrl}${route}`,
    datePublished: entry.publishedDate,
    dateModified: entry.publishedDate,
    author: { "@type": "Organization", name: "WoodCutTool Editorial Team", url: `${siteUrl}/about/` },
    publisher: { "@type": "Organization", name: "WoodCutTool", url: `${siteUrl}/` },
    isAccessibleForFree: true,
    learningResourceType: "Worksheet",
    about: [entry.title, entry.category, "woodworking records", "project documentation"],
    hasPart: {
      "@type": "ItemList",
      numberOfItems: entry.fields.length,
      itemListElement: entry.fields.map(([name, instruction], index) => ({
        "@type": "ListItem",
        position: index + 1,
        name,
        description: instruction,
      })),
    },
    associatedMedia: {
      "@type": "DataDownload",
      name: `${entry.title} CSV`,
      contentUrl: `${siteUrl}${route}worksheet.csv`,
      encodingFormat: "text/csv",
    },
  };
}

function faqFor(entry) {
  return [
    [`When should I use the ${entry.title}?`, `Use it ${entry.stage}. Start a new copy when the project revision, material batch, setup, location, or responsible person changes.`],
    ["Is this worksheet a calculation or approval?", "No. It records project-specific inputs, observations, sources, owners, and decisions. Use the linked calculator, checklist, manufacturer information, drawing, or qualified review to produce and approve the underlying result."],
    ["Should I fill the browser form or the CSV?", "Use the browser form for a quick working or printed copy. Download the CSV when the record needs to be saved, shared, sorted, compared, or stored with the project revision."],
    ["What should happen when a value changes?", `Keep the previous record, identify the affected drawing, cut list, order, setup, assembly, or installation, then issue a new dated copy. The intended outcome is: ${entry.outcome}`],
  ];
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

const csvEscape = (value) => `"${String(value).replaceAll('"', '""')}"`;

function csvFor(entry) {
  const header = ["Order", "Field", "What to record", "Example", "Project value", "Source", "Owner", "Date"];
  const rows = entry.fields.map(([name, instruction, example], index) => [index + 1, name, instruction, example, "", "", "", ""]);
  return `${[header, ...rows].map((row) => row.map(csvEscape).join(",")).join("\n")}\n`;
}

function relatedEntries(entry) {
  const group = worksheetEntries.filter((candidate) => candidate.categorySlug === entry.categorySlug);
  const index = group.findIndex((candidate) => candidate.slug === entry.slug);
  return [1, 2, 3].map((offset) => group[(index + offset) % group.length]);
}

function worksheetPage(entry) {
  const route = `/worksheets/${entry.slug}/`;
  const title = titleFor(entry);
  const description = descriptionFor(entry);
  const faqs = faqFor(entry);
  const fieldForm = entry.fields.map(([name, instruction, example], index) => `<div class="worksheet-field">
          <label for="field-${index + 1}"><span class="worksheet-number">${String(index + 1).padStart(2, "0")}</span><span><strong>${esc(name)}</strong><small>${esc(instruction)}</small></span></label>
          <textarea id="field-${index + 1}" rows="3" placeholder="${esc(example)}"></textarea>
        </div>`).join("");
  const sampleRows = entry.fields.map(([name, instruction, example]) => `<tr><th scope="row">${esc(name)}</th><td>${esc(instruction)}</td><td>${esc(example)}</td></tr>`).join("");
  const related = relatedEntries(entry).map((candidate) => `<a class="research-card worksheet-related-card" href="/worksheets/${candidate.slug}/"><span>${esc(candidate.category)} · 8 fields</span><h2>${esc(candidate.title)}</h2><p>${esc(candidate.summary)}</p><strong>Open worksheet →</strong></a>`).join("");
  const resources = [
    [`/checklists/${entry.checklistSlug}/`, "Related release checklist", "Checklist"],
    ...entry.links,
  ].map(([href, label, kind]) => `<a class="research-card" href="${href}"><span>${esc(kind)}</span><h2>${esc(label)}</h2><p>Use this source to calculate, verify, diagnose, or approve the value before recording it here.</p><strong>Open resource →</strong></a>`).join("");
  const commonMistakes = entry.focusFields.map(([name, instruction]) => `<li><strong>${esc(name)}:</strong> do not replace “${esc(instruction.toLowerCase())}” with a check mark or an undocumented verbal decision.</li>`).join("");
  const faqMarkup = faqs.map(([question, answer]) => `<h3>${esc(question)}</h3><p>${esc(answer)}</p>`).join("");

  return pageShell({
    title,
    description,
    route,
    schemas: [worksheetSchema(entry, description), faqSchema(faqs), breadcrumbSchema(entry)],
    body: `<main id="main" class="article-shell research-shell worksheet-shell">
    <article class="article-body research-article worksheet-article">
      <p class="breadcrumb"><a href="/">Home</a> / <a href="/worksheets/">Worksheets</a> / ${esc(entry.title)}</p>
      <p class="eyebrow">Woodworking Worksheets · ${esc(entry.category)}</p>
      <h1>${esc(entry.title)}</h1>
      <p class="lead">${esc(entry.summary)}</p>
      <p class="article-byline">Published ${entry.publishedDate} by <a href="/about/">WoodCutTool Editorial Team</a> · A project record, not a substitute for drawings, product instructions, training, engineering, or approval</p>

      <section class="research-metrics" aria-label="Worksheet summary">
        <div class="research-metric"><span>Record fields</span><strong>${entry.fields.length}</strong><small>Project-specific values and sources</small></div>
        <div class="research-metric"><span>Working copy</span><strong>Fill + print</strong><small>Browser entries stay on this page only</small></div>
        <div class="research-metric"><span>Download</span><strong>CSV</strong><small>Blank value, source, owner, and date columns</small></div>
        <div class="research-metric"><span>Category</span><strong>${esc(entry.category)}</strong><small>${esc(entry.stage)}</small></div>
      </section>

      <section class="worksheet-answer"><p class="eyebrow">Record outcome</p><h2>What should this worksheet make traceable?</h2><p>${esc(entry.outcome)}</p><p>The worksheet is complete only when another person can identify the active revision, reproduce where the value came from, understand which physical condition or decision it describes, and see who owns the next action. A blank field is useful when it makes an unresolved condition visible. A guessed number entered only to make the page look complete is not.</p></section>

      <section><h2>Use one record for one controlled condition</h2><p>Use this worksheet ${esc(entry.stage)}. Keep the scope narrow enough that the location, material group, batch, setup, assembly, or room is unambiguous. If one value controls several downstream outputs, list those outputs beside the source rather than copying the number into unrelated notes. That makes it possible to update the drawing, cut list, purchase order, setup sheet, labels, or installation plan together when the source changes.</p><p>State units directly beside measurements and distinguish target, observed, calculated, required, and accepted values. Record the source at the same time as the value: a drawing revision, physical measurement, product sheet, test piece, approved sample, machine setup, photo, or signed field decision. Dates and owners matter because the same wall, material batch, setup, or finish can change later.</p></section>

      <section aria-labelledby="working-copy"><div class="worksheet-toolbar"><div><p class="eyebrow">Fillable working copy</p><h2 id="working-copy">${entry.fields.length}-field ${esc(entry.title)}</h2><p>Entries remain only in this browser page. Print now or download the CSV for a durable project record.</p></div><div class="worksheet-actions"><button class="button secondary" type="button" onclick="window.print()">Print worksheet</button><a class="button" href="${route}worksheet.csv" download>Download blank CSV</a><button class="button ghost" type="button" data-worksheet-clear>Clear fields</button></div></div>
        <form class="worksheet-form" aria-label="${esc(entry.title)} working copy">${fieldForm}</form>
      </section>

      <section><h2>Example field structure</h2><p>The examples show the level of specificity expected; they are not default values or project instructions. Replace them with the real project source, measured result, responsible person, and date.</p>
        <div class="research-table-wrap"><table class="research-table worksheet-table"><thead><tr><th>Field</th><th>What to record</th><th>Example format</th></tr></thead><tbody>${sampleRows}</tbody></table></div>
      </section>

      <section><h2>Five-step recording workflow</h2><ol><li><strong>Freeze the scope.</strong> Name the project, location, material group, batch, setup, assembly, or room and the revision being described.</li><li><strong>Collect evidence before transcribing.</strong> Bring the drawing, measurement, product data, test result, sample, photo, or approval to the place where the record is completed.</li><li><strong>Use explicit units and states.</strong> Separate required, planned, measured, observed, ordered, received, accepted, held, and completed values instead of combining them into one total.</li><li><strong>Assign differences.</strong> When evidence disagrees with the plan, record the variance, affected outputs, owner, and stop or release decision.</li><li><strong>Archive without erasing history.</strong> Save the dated CSV or printed copy with the project revision and issue a new record after a material, setup, field, or approval change.</li></ol></section>

      <section><h2>Common recording mistakes to avoid</h2><ul class="worksheet-mistakes">${commonMistakes}</ul><p>Other frequent failures are missing units, values copied from superseded drawings, totals that hide whole-unit purchasing, photos with no location or part ID, and “approved” entries with no approver. The record should make uncertainty visible. Use “not measured,” “held,” or “approval pending” when that is the true project state, then prevent dependent work from treating the blank as permission.</p></section>

      <section><h2>Version control and handoff</h2><p>Name saved files with the project, worksheet subject, revision or batch, and date. Keep the previous version when a value changes so the team can explain why material was ordered, a setup was released, a part was remade, or an installation moved. If a revised record changes physical work, update every dependent drawing, cut list, layout, purchase line, label, inspection, or room package and identify superseded stock.</p><p>At handoff, the receiver should be able to locate the source evidence and distinguish an observation from an approval. A worksheet can document that a wall is out of plumb or that a sample was tested, but the responsible designer, manufacturer instruction, qualified professional, or project authority still determines whether the condition is acceptable and what action is permitted.</p></section>

      <section><h2>Related worksheets in ${esc(entry.category)}</h2><div class="research-card-grid worksheet-related-grid">${related}</div></section>
      <section><h2>Calculate and verify before recording</h2><div class="research-card-grid worksheet-resource-grid">${resources}</div><p>Worksheets preserve evidence; they do not create it. Use the linked checklist to decide whether work can proceed, the Learn guide to understand the method, the calculator or app for project-specific quantities, and Troubleshooting when the observed result disagrees with the plan.</p></section>

      <section><h2>Safety and professional boundaries</h2><p>Follow current machine and product instructions and use appropriate guarding, support, PPE, dust or fume control, handling, ventilation, and cure requirements. Do not use a blank worksheet as permission to operate unfamiliar equipment or exceed a tool, fastener, hardware, coating, material, or structure rating. Structural, stair, guard, electrical, plumbing, gas, fire, accessibility, and building-code decisions require the appropriate qualified professional or authority.</p><p>Measurements can also create false confidence when the wrong finished plane, datum, product revision, or material batch was recorded. Verify the physical condition and the active source before irreversible work. When a record conflicts with the site, stock, tool, test, or current instruction, stop the affected work and resolve the source instead of changing a downstream value silently.</p></section>

      <section><h2>Frequently asked questions</h2>${faqMarkup}</section>
      <section class="research-note"><h2>Save the record with the project</h2><p><a class="button" href="${route}worksheet.csv" download>Download the worksheet CSV</a> <a class="button secondary" href="/worksheets/">Browse all 60 worksheets</a></p><p>Keep the source, project value, owner, date, and revision together so the next person can reproduce the decision.</p></section>
    </article>
  </main>`,
    extraScript: `<script>
  (() => {
    const button = document.querySelector("[data-worksheet-clear]");
    const fields = [...document.querySelectorAll(".worksheet-form textarea")];
    button.addEventListener("click", () => {
      fields.forEach((field) => { field.value = ""; });
      fields[0]?.focus();
    });
  })();
</script>`,
  });
}

function validateSource() {
  const expectedCategories = [
    "Measurements & Site Survey",
    "Cut List & Material Planning",
    "Machine Setup & Cutting Records",
    "Assembly & Hardware Records",
    "Installation & Field Change Records",
    "Finish, Handoff & Closeout",
  ];
  const seen = new Set();
  if (worksheetCategories.length !== expectedCategories.length) throw new Error(`Expected ${expectedCategories.length} worksheet categories.`);
  if (worksheetEntries.length !== 60) throw new Error(`Expected 60 worksheet entries, found ${worksheetEntries.length}.`);
  worksheetCategories.forEach((category, index) => {
    if (category.name !== expectedCategories[index]) throw new Error(`Unexpected worksheet category order: ${category.name}`);
    if (category.topics.length !== 10) throw new Error(`${category.name} has ${category.topics.length} topics; expected 10.`);
    if (category.baseFields.length !== 4) throw new Error(`${category.name} must have four shared fields.`);
  });
  for (const entry of worksheetEntries) {
    if (seen.has(entry.slug)) throw new Error(`Duplicate worksheet slug: ${entry.slug}`);
    seen.add(entry.slug);
    if (entry.fields.length !== 8) throw new Error(`${entry.slug} has ${entry.fields.length} fields; expected 8.`);
    if (entry.focusFields.length !== 4) throw new Error(`${entry.slug} must have four topic-specific fields.`);
    const title = titleFor(entry);
    const description = descriptionFor(entry);
    if (title.length < 20 || title.length > 70) throw new Error(`SEO title length ${title.length}: ${entry.slug}`);
    if (description.length < 120 || description.length > 165) throw new Error(`Meta description length ${description.length}: ${entry.slug}`);
    const localLinks = [`/checklists/${entry.checklistSlug}/`, ...entry.links.map(([href]) => href)];
    for (const href of localLinks) {
      const target = href.endsWith("/") ? join(root, href, "index.html") : join(root, href);
      if (!existsSync(target)) throw new Error(`Missing local resource ${href} for ${entry.slug}`);
    }
  }
}

validateSource();

const categorySections = worksheetCategories.map((category) => {
  const entries = worksheetEntries.filter((entry) => entry.categorySlug === category.slug);
  const cards = entries.map((entry) => `<a class="research-card worksheet-card" data-worksheet-card data-search="${esc(`${entry.title} ${entry.summary} ${entry.category}`.toLowerCase())}" href="/worksheets/${entry.slug}/"><span>${esc(entry.category)} · 8 fields</span><h2>${esc(entry.title)}</h2><p>${esc(entry.summary)}</p><strong>Open worksheet →</strong></a>`).join("");
  return `<section id="${category.slug}" data-worksheet-section><div class="section-heading compact"><p class="eyebrow">${esc(category.name)} · ${entries.length} worksheets</p><h2>${esc(category.name)}</h2><p>${esc(category.description)}</p></div><div class="research-card-grid worksheet-card-grid">${cards}</div></section>`;
}).join("");

const hubDescription = "Use 60 woodworking worksheets to record measurements, cut lists, material orders, machine setups, assembly, installation, finishing, and closeout.";
const hubSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Woodworking Worksheets",
  description: hubDescription,
  url: `${siteUrl}/worksheets/`,
  mainEntity: {
    "@type": "ItemList",
    numberOfItems: worksheetEntries.length,
    itemListElement: worksheetEntries.map((entry, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: entry.title,
      url: `${siteUrl}/worksheets/${entry.slug}/`,
    })),
  },
};
const categoryNav = worksheetCategories.map((category) => `<a href="#${category.slug}">${esc(category.name)} <span>${category.topics.length}</span></a>`).join("");
const hubHtml = pageShell({
  title: "60 Woodworking Worksheets: Measure, Build & Record",
  description: hubDescription,
  route: "/worksheets/",
  type: "website",
  schemas: [hubSchema, breadcrumbSchema()],
  body: `<main id="main" class="article-shell research-shell worksheet-shell worksheet-hub">
    <article class="article-body research-article worksheet-article">
      <p class="breadcrumb"><a href="/">Home</a> / Worksheets</p>
      <p class="eyebrow">New · 60 printable project records</p>
      <h1>Woodworking Worksheets: Record the Project, Not Just the Result</h1>
      <p class="lead">Capture measurements, sources, quantities, setups, inspections, adjustments, installation conditions, finish records, and closeout evidence in a consistent form. Every worksheet has eight task-specific fields, a fillable and printable working copy, a downloadable CSV, example formats, and links to the method or release check that produces the value.</p>
      <nav class="checklist-category-nav worksheet-category-nav" aria-label="Worksheet categories">${categoryNav}</nav>
      <section class="research-metrics" aria-label="Worksheet library summary">
        <div class="research-metric"><span>Detailed worksheets</span><strong>60</strong><small>One controlled record per page</small></div>
        <div class="research-metric"><span>Categories</span><strong>6</strong><small>Survey through closeout</small></div>
        <div class="research-metric"><span>Record fields</span><strong>480</strong><small>Eight fields per workflow</small></div>
        <div class="research-metric"><span>Downloads</span><strong>60 CSVs</strong><small>Value, source, owner, and date columns</small></div>
      </section>
      <section class="worksheet-answer"><p class="eyebrow">How this column is different</p><h2>Checklists release the work. Worksheets preserve the evidence.</h2><p><a href="/checklists/">Checklists</a> ask whether a release point has passed. <a href="/learn/">Learn guides</a> explain the method, <a href="/templates/">templates</a> provide project starting inputs, <a href="/examples/">examples</a> show complete sample data, and <a href="/troubleshooting/">Troubleshooting</a> diagnoses a disagreement. Worksheets capture the project-specific measurements, product identities, setup values, observations, owners, and dates produced by those activities.</p></section>
      <section class="checklist-finder worksheet-finder"><label for="worksheet-search"><strong>Find a project worksheet</strong><span>Search by measurement, material, machine, assembly, installation, finish, or closeout task.</span></label><input id="worksheet-search" type="search" placeholder="Try appliance opening, plywood order, first article, drawer slide…" autocomplete="off" data-worksheet-filter><p data-worksheet-status aria-live="polite">Showing all 60 worksheets.</p></section>
      ${categorySections}
      <section><h2>Use the library as a project evidence trail</h2><p>Begin with Measurements &amp; Site Survey to capture the physical conditions that control design. Cut List &amp; Material Planning connects those conditions to parts, stock groups, allowances, and orders. Machine Setup &amp; Cutting Records preserves test cuts and sampling. Assembly &amp; Hardware Records ties parts to joints and moving systems. Installation &amp; Field Change Records connects shop output to real rooms and structure. Finish, Handoff &amp; Closeout preserves samples, cure, punch work, delivered documents, and final variance.</p><p>Each worksheet can stand alone, but the strongest record chain carries stable project, part, material, room, batch, and revision IDs from one stage to the next. Use the downloadable CSVs when data needs sorting or comparison; use the printable working copy beside a wall, machine, assembly bench, or inspection area where writing directly into the project file is impractical.</p></section>
      <section><h2>Four rules shared by every worksheet</h2><ol class="checklist-principles"><li><strong>Record the source with the value.</strong> A number without its datum, drawing, product sheet, test, or measurement method cannot be reproduced.</li><li><strong>Separate states.</strong> Planned, ordered, received, accepted, cut, installed, and closed are different conditions.</li><li><strong>Preserve superseded records.</strong> Issue a new revision instead of overwriting why earlier work was released.</li><li><strong>Make holds visible.</strong> “Pending,” “not measured,” and “rejected” are safer than a guessed value that silently authorizes work.</li></ol></section>
      <section class="research-note"><h2>Start with the next value someone will need later</h2><p><a class="button" href="#measurements-site-survey">Browse measurement worksheets</a> <a class="button secondary" href="/checklists/">Open release checklists</a></p><p>Choose the record that supports the next design, purchase, setup, assembly, installation, finish, or closeout decision.</p></section>
    </article>
  </main>`,
  extraScript: `<script>
  (() => {
    const input = document.querySelector("[data-worksheet-filter]");
    const cards = [...document.querySelectorAll("[data-worksheet-card]")];
    const sections = [...document.querySelectorAll("[data-worksheet-section]")];
    const status = document.querySelector("[data-worksheet-status]");
    const filter = () => {
      const query = input.value.trim().toLowerCase();
      let visible = 0;
      cards.forEach((card) => {
        const matches = !query || card.dataset.search.includes(query);
        card.hidden = !matches;
        if (matches) visible += 1;
      });
      sections.forEach((section) => {
        section.hidden = !section.querySelector("[data-worksheet-card]:not([hidden])");
      });
      status.textContent = query ? "Showing " + visible + " matching worksheet" + (visible === 1 ? "" : "s") + "." : "Showing all 60 worksheets.";
    };
    input.addEventListener("input", filter);
  })();
</script>`,
});

await mkdir(join(root, "worksheets"), { recursive: true });
await writeFile(join(root, "worksheets", "index.html"), hubHtml);
for (const entry of worksheetEntries) {
  const dir = join(root, "worksheets", entry.slug);
  await mkdir(dir, { recursive: true });
  await Promise.all([
    writeFile(join(dir, "index.html"), worksheetPage(entry)),
    writeFile(join(dir, "worksheet.csv"), csvFor(entry)),
  ]);
}

console.log(`Generated ${worksheetEntries.length} woodworking worksheets, ${worksheetEntries.length} CSVs, and ${worksheetCategories.length} category sections.`);
