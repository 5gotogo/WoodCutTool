import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  projectPublishedDate,
  projectCategories,
  projectPlaybooks,
} from "./project-playbook-data.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const siteUrl = "https://woodcuttool.com";

const esc = (value) => String(value ?? "")
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function pick(object, keys, fallback = "") {
  for (const key of keys) {
    const value = object?.[key];
    if (value !== undefined && value !== null && value !== "") return value;
  }
  return fallback;
}

function asList(value) {
  if (Array.isArray(value)) return value;
  if (value === undefined || value === null || value === "") return [];
  return [value];
}

function text(value, fallback = "") {
  if (typeof value === "string" || typeof value === "number") return String(value);
  return fallback;
}

function jsonLd(value) {
  const json = JSON.stringify(value, null, 2).replaceAll("<", "\\u003c");
  return `<script type="application/ld+json">${json}</script>`;
}

function pageShell({ title, description, route, type = "article", schemas, body }) {
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
  <link rel="stylesheet" href="/assets/project-playbooks.css">
  <script defer src="/assets/site-chrome.js"></script>
  <script defer src="/assets/project-playbooks.js"></script>
  <script defer src="/assets/app.js"></script>
  <script defer src="/assets/conversion.js"></script>
  <noscript><style>.project-decision-result[hidden],.project-decision-outcome[hidden]{display:block!important}</style></noscript>
  ${schemas.map(jsonLd).join("\n  ")}
</head>
<body>
  <a class="project-skip-link" href="#main">Skip to content</a>
  <div data-site-header></div>
  ${body}
  <div data-site-footer></div>
</body>
</html>\n`;
}

function titleFor(entry) {
  return `${displayTitle(entry)} | WoodCutTool`;
}

function displayTitle(entry) {
  return /\bplaybook\b/i.test(entry.title) ? entry.title : `${entry.title} Project Playbook`;
}

function descriptionFor(entry) {
  const outcome = String(entry.promise || "").trim();
  if (outcome.length >= 120 && outcome.length <= 165 && /[.!?]$/.test(outcome)) return outcome;

  const projectName = String(entry.title || "project")
    .replace(/\s+Project Playbook$/i, "")
    .toLowerCase();
  return `Plan your ${projectName} with a private project brief, three decision challenges, six practical phases, linked resources, and downloadable CSV records.`;
}

function categoryName(category) {
  return text(pick(category, ["name", "title", "category"], "Project category"));
}

function categorySlug(category) {
  return text(pick(category, ["slug", "categorySlug"], slugify(categoryName(category))));
}

function categoryDescription(category) {
  return text(pick(category, ["description", "categoryDescription"], "Outcome-first project playbooks with explicit planning and release boundaries."));
}

function normalizeLink(link, index) {
  if (Array.isArray(link)) {
    return {
      href: text(link[0]),
      label: text(link[1], `Project resource ${index + 1}`),
      kind: text(link[2], "Resource"),
      description: text(link[3], "Open the supporting method, record, calculation, or release control for this project."),
    };
  }
  return {
    href: text(pick(link, ["href", "path", "url"])),
    label: text(pick(link, ["label", "title", "name"], `Project resource ${index + 1}`)),
    kind: text(pick(link, ["kind", "type"], "Resource")),
    description: text(pick(link, ["description", "summary", "purpose"], "Open the supporting method, record, calculation, or release control for this project.")),
  };
}

function normalizeBriefField(field, index) {
  if (Array.isArray(field)) {
    const label = text(field[0], `Project input ${index + 1}`);
    return {
      id: `${slugify(label) || "input"}-${index + 1}`,
      label,
      prompt: text(field[1], "Record the project-specific value and its source."),
      example: text(field[2], "Record a measured or verified project value."),
    };
  }
  const label = text(pick(field, ["label", "title", "name"], `Project input ${index + 1}`));
  return {
    id: `${slugify(text(pick(field, ["id", "key"], label))) || "input"}-${index + 1}`,
    label,
    prompt: text(pick(field, ["prompt", "description", "help"], "Record the project-specific value and its source.")),
    example: text(pick(field, ["example", "placeholder", "sample"], "Record a measured or verified project value.")),
  };
}

function normalizeMaterial(material, index) {
  if (Array.isArray(material)) {
    const hasExplicitQuantity = material.length >= 3;
    return {
      name: text(material[0], `Material group ${index + 1}`),
      quantity: hasExplicitQuantity ? text(material[1]) : "",
      specification: hasExplicitQuantity ? text(material[2], "Verify actual product and dimensions") : text(material[1], "Verify actual product and dimensions"),
      note: hasExplicitQuantity ? text(material[3]) : "",
    };
  }
  return {
    name: text(pick(material, ["name", "item", "material"], `Material group ${index + 1}`)),
    quantity: text(pick(material, ["quantity", "qty", "amount"])),
    specification: text(pick(material, ["specification", "spec", "size", "grade"], "Verify actual product and dimensions")),
    note: text(pick(material, ["note", "purpose", "boundary", "description"])),
  };
}

function normalizeOption(option, index) {
  if (Array.isArray(option)) {
    const label = text(option[0], `Option ${index + 1}`);
    const status = normalizeDecisionStatus(option[2]);
    return {
      value: `${slugify(label) || "option"}-${index + 1}`,
      label,
      detail: text(option[1], "Review how this choice changes dimensions, material, sequence, and verification."),
      status,
      points: Number(option[3] || 0),
    };
  }
  if (typeof option === "string") {
    return {
      value: `${slugify(option) || "option"}-${index + 1}`,
      label: option,
      detail: "Review how this choice changes dimensions, material, sequence, and verification before release.",
      status: "conditional",
      points: 0,
    };
  }
  const label = text(pick(option, ["label", "title", "name", "choice"], `Option ${index + 1}`));
  const outcome = text(pick(option, ["detail", "result", "outcome", "tradeoff", "guidance", "description"], "Review how this choice changes dimensions, material, sequence, and verification before release."));
  const takeaway = text(pick(option, ["takeaway", "lesson", "nextStep"]));
  return {
    value: `${slugify(text(pick(option, ["value", "id"], label))) || "option"}-${index + 1}`,
    label,
    detail: [outcome, takeaway].filter(Boolean).join(" "),
    status: normalizeDecisionStatus(option?.status),
    points: Number(option?.points || 0),
  };
}

function normalizeDecisionStatus(value) {
  return ["strong", "conditional", "stop"].includes(value) ? value : "conditional";
}

function decisionStatusLabel(status) {
  if (status === "strong") return "Strong path";
  if (status === "stop") return "Stop and resolve";
  return "Conditional — verify";
}

function normalizeDecision(decision, index) {
  if (Array.isArray(decision)) {
    const title = text(decision[0], `Decision challenge ${index + 1}`);
    return {
      id: `decision-${index + 1}-${slugify(title)}`,
      title,
      prompt: text(decision[1], "Choose the condition that best matches the verified project brief."),
      options: asList(decision[2]).map(normalizeOption),
      guidance: text(decision[3], "Use the selected consequence to update the source drawing, parts, material, sequence, and release checks."),
    };
  }
  const title = text(pick(decision, ["title", "name", "question", "prompt"], `Decision challenge ${index + 1}`));
  return {
    id: `decision-${index + 1}-${slugify(text(pick(decision, ["id", "key"], title)))}`,
    title,
    prompt: text(pick(decision, ["context", "description", "prompt", "question"], "Choose the condition that best matches the verified project brief.")),
    options: asList(pick(decision, ["options", "choices"], [])).map(normalizeOption),
    guidance: text(pick(decision, ["guidance", "reveal", "answer", "decisionRule", "rule"], "Use the selected consequence to update the source drawing, parts, material, sequence, and release checks.")),
  };
}

function normalizePhase(phase, index) {
  if (Array.isArray(phase)) {
    const title = text(phase[0], `Project phase ${index + 1}`);
    return {
      id: `phase-${index + 1}-${slugify(title)}`,
      title,
      goal: text(phase[1], "Complete this phase from verified inputs before releasing the next irreversible step."),
      steps: asList(phase[2]).map((step) => text(step)).filter(Boolean),
      evidence: text(phase[3], "Keep the source, observed result, owner, date, and active revision with the project."),
      stop: text(phase[4], "Stop when the physical condition and the controlling source disagree."),
      time: text(phase[5], "Project-specific"),
    };
  }
  const title = text(pick(phase, ["title", "name", "phase"], `Project phase ${index + 1}`));
  const rawSteps = pick(phase, ["steps", "actions", "tasks"], []);
  return {
    id: `phase-${index + 1}-${slugify(text(pick(phase, ["id", "key"], title)))}`,
    title,
    goal: text(pick(phase, ["goal", "objective", "summary", "purpose"], "Complete this phase from verified inputs before releasing the next irreversible step.")),
    steps: asList(rawSteps).map((step) => typeof step === "object" ? text(pick(step, ["text", "name", "title", "action"])) : text(step)).filter(Boolean),
    evidence: text(pick(phase, ["evidence", "deliverable", "output", "release"], "Keep the source, observed result, owner, date, and active revision with the project.")),
    stop: text(pick(phase, ["stop", "stopCondition", "holdPoint", "boundary"], "Stop when the physical condition and the controlling source disagree.")),
    time: text(pick(phase, ["time", "duration", "estimate"], "Project-specific")),
  };
}

function normalizeVariation(variation, index) {
  if (typeof variation === "string") {
    return {
      title: variation,
      condition: "Use when this variation matches the verified space, user, hardware, and project objective.",
      impact: "Update the brief, dimensions, parts, material groups, sequence, and release evidence affected by the change.",
    };
  }
  if (Array.isArray(variation)) {
    return {
      title: text(variation[0], `Variation ${index + 1}`),
      condition: text(variation[1], "Use only when the project condition is verified."),
      impact: text(variation[2], "Recalculate affected dimensions, parts, material, and sequence."),
    };
  }
  return {
    title: text(pick(variation, ["title", "name", "variation"], `Variation ${index + 1}`)),
    condition: text(pick(variation, ["condition", "when", "description"], "Use only when the project condition is verified.")),
    impact: text(pick(variation, ["impact", "change", "response", "guidance"], "Recalculate affected dimensions, parts, material, and sequence.")),
  };
}

function normalizeRisk(risk, index) {
  if (typeof risk === "string") {
    return {
      title: risk,
      signal: "Treat the first observed mismatch, movement, interference, or missing source as an early warning rather than a finish-stage correction.",
      response: "Hold affected work, preserve the condition, correct the controlling source, and repeat every dependent check under the new revision.",
    };
  }
  if (Array.isArray(risk)) {
    return {
      title: text(risk[0], `Project risk ${index + 1}`),
      signal: text(risk[1], "Watch for disagreement between the plan and the observed condition."),
      response: text(risk[2], "Hold affected work, correct the upstream source, and repeat the verification."),
    };
  }
  return {
    title: text(pick(risk, ["title", "name", "risk"], `Project risk ${index + 1}`)),
    signal: text(pick(risk, ["signal", "symptom", "description", "why"], "Watch for disagreement between the plan and the observed condition.")),
    response: text(pick(risk, ["response", "mitigation", "action", "stop"], "Hold affected work, correct the upstream source, and repeat the verification.")),
  };
}

function normalizeFinishLine(value) {
  if (typeof value === "string") return { summary: value, checks: [] };
  if (Array.isArray(value)) return { summary: "Close the playbook only when every listed result can be observed and reproduced.", checks: value.map((item) => text(item)).filter(Boolean) };
  return {
    summary: text(pick(value, ["summary", "description", "result"], "Close the playbook only when the finished result matches the released design and documented project brief.")),
    checks: asList(pick(value, ["checks", "criteria", "items"], [])).map((item) => text(item)).filter(Boolean),
  };
}

function entryView(entry) {
  const sourceCategorySlug = text(entry.categorySlug || entry.category);
  const category = projectCategories.find((candidate) => categorySlug(candidate) === sourceCategorySlug);
  return {
    ...entry,
    categorySlug: sourceCategorySlug,
    category: text(entry.categoryName || categoryName(category || {}), sourceCategorySlug),
    categoryDescription: text(entry.categoryDescription || categoryDescription(category || {})),
    briefFields: asList(entry.briefFields).map(normalizeBriefField),
    materials: asList(entry.materials).map(normalizeMaterial),
    decisions: asList(entry.decisions).map(normalizeDecision),
    phases: asList(entry.phases).map(normalizePhase),
    variations: asList(entry.variations).map(normalizeVariation),
    risks: asList(entry.risks).map(normalizeRisk),
    links: asList(entry.links).map(normalizeLink),
    finish: normalizeFinishLine(entry.finishLine),
  };
}

function breadcrumbSchema(entry = null) {
  const trail = entry
    ? [["Home", "/"], ["Project Playbooks", "/projects/"], [entry.title, `/projects/${entry.slug}/`]]
    : [["Home", "/"], ["Project Playbooks", "/projects/"]];
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

function faqSchema(faqs) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(([name, answer]) => ({
      "@type": "Question",
      name,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };
}

function hubFaqs() {
  return [
    ["How is a project playbook different from a cut list template?", "A template helps identify likely parts. A project playbook connects the brief, material choices, decisions, six work phases, release evidence, risks, and finish line so a builder can organize the complete workflow."],
    ["Are these dimensioned construction drawings?", "No. Every playbook is a planning workflow. Project dimensions, joinery, hardware, loads, structure, installation, product instructions, and local requirements still need project-specific verification and approval."],
    ["Do project playbooks require an account or internet connection?", "No account is required. Search, filters, progress, decisions, and brief entries run in the browser. Saved progress uses local browser storage when available and is not uploaded by this page."],
    ["Can I print or download a project playbook?", "Yes. Each detail page provides a print action, a static blank project-playbook.csv, and a browser-generated progress CSV containing the brief, phase status, and decision choices."],
  ];
}

function detailFaqs(entry) {
  return [
    [`Can I build the ${entry.title.toLowerCase()} exactly as shown?`, `No. This page is a planning playbook rather than a dimensioned drawing or approval. Verify the real site, design, loads, material, hardware, joinery, tooling, finish, installation, and applicable requirements before irreversible work.`],
    ["Where is my project progress saved?", "When browser storage is available, progress stays locally in this browser under a versioned WoodCutTool record. This page does not require an account and does not send the brief, choices, or phase status to a server."],
    ["What should I do when a phase cannot be completed?", "Keep the affected work on hold. Identify whether the mismatch comes from the design, measurement, material, hardware, setup, site, sequence, or current instructions. Correct the controlling source and repeat dependent checks before continuing."],
    ["Which CSV should I download?", "The static project-playbook.csv is a blank durable record of the published brief, materials, decisions, and six phases. The progress CSV is created in your browser and includes the values and completion state currently entered on the page."],
  ];
}

function articleSchema(entry, description) {
  const route = `/projects/${entry.slug}/`;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: entry.title,
    description,
    image: `${siteUrl}${projectImage(entry)}`,
    url: `${siteUrl}${route}`,
    mainEntityOfPage: `${siteUrl}${route}`,
    datePublished: projectPublishedDate,
    dateModified: projectPublishedDate,
    author: { "@type": "Organization", name: "WoodCutTool Editorial Team", url: `${siteUrl}/about/` },
    publisher: { "@type": "Organization", name: "WoodCutTool", url: `${siteUrl}/` },
    articleSection: entry.category,
    about: [entry.title, entry.category, "woodworking project planning", "project playbook"],
  };
}

function howToSchema(entry) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `${entry.title} planning playbook`,
    description: entry.promise,
    image: `${siteUrl}${projectImage(entry)}`,
    supply: entry.materials.map((material) => ({ "@type": "HowToSupply", name: `${material.name}: ${material.specification}` })),
    step: entry.phases.map((phase, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: phase.title,
      text: `${phase.goal} Evidence: ${phase.evidence} Hold point: ${phase.stop}`,
    })),
  };
}

function downloadSchema(entry) {
  const route = `/projects/${entry.slug}/project-playbook.csv`;
  return {
    "@context": "https://schema.org",
    "@type": "DataDownload",
    name: `${entry.title} project playbook CSV`,
    description: "Blank project brief, material, decision, phase, variation, risk, and closeout record for this planning playbook.",
    contentUrl: `${siteUrl}${route}`,
    encodingFormat: "text/csv",
    datePublished: projectPublishedDate,
    isAccessibleForFree: true,
  };
}

function csvCell(value) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

function csvFor(entry) {
  const rows = [["Record type", "Order", "Status / choice", "Item", "Prompt / specification", "Project value / evidence"]];
  entry.briefFields.forEach((field, index) => rows.push(["Brief", index + 1, "Open", field.label, field.prompt, ""]));
  entry.materials.forEach((material, index) => rows.push(["Material", index + 1, "Verify", material.name, [material.quantity, material.specification].filter(Boolean).join("; "), material.note]));
  entry.decisions.forEach((decision, index) => rows.push(["Decision", index + 1, "Choose", decision.title, `${decision.prompt} Options: ${decision.options.map((option) => option.label).join(" | ")}`, ""]));
  entry.phases.forEach((phase, index) => rows.push(["Phase", index + 1, "Open", phase.title, phase.goal, `Evidence: ${phase.evidence} Hold: ${phase.stop}`]));
  entry.variations.forEach((variation, index) => rows.push(["Variation", index + 1, "Review", variation.title, variation.condition, variation.impact]));
  entry.risks.forEach((risk, index) => rows.push(["Risk", index + 1, "Monitor", risk.title, risk.signal, risk.response]));
  rows.push(["Finish line", 1, "Open", "Project closeout", entry.finish.summary, ""]);
  entry.finish.checks.forEach((check, index) => rows.push(["Finish line", index + 2, "Open", `Closeout check ${index + 1}`, check, ""]));
  entry.links.forEach((link, index) => rows.push(["Resource", index + 1, link.kind, link.label, link.href, link.description]));
  return `${rows.map((row) => row.map(csvCell).join(",")).join("\n")}\n`;
}

function projectImage(entry, index = 0) {
  const value = `${entry.category} ${entry.title}`.toLowerCase();
  if (/sheet-goods|offcut/.test(value)) return "/assets/images/woodworking/wood-10-offcut-storage.webp";
  if (/miter|table saw/.test(value)) return "/assets/images/woodworking/wood-11-table-saw-planning.webp";
  if (/workbench|workstation|shop/.test(value)) return "/assets/images/woodworking/wood-07-workshop-bench.webp";
  if (/\b(?:outdoor|planter|garden|balcony)\b/.test(value)) return "/assets/images/woodworking/wood-05-material-selection.webp";
  if (/closet|storage|shelf|mudroom|pantry/.test(value)) return "/assets/images/woodworking/wood-09-closet-planning.webp";
  if (/cabinet|built-in|drawer|\bdoor\b|vanity/.test(value)) return "/assets/images/woodworking/wood-02-cabinet-hardware.webp";
  if (/furniture|chair|desk|table|nightstand|bench|small|renter/.test(value)) return "/assets/images/woodworking/wood-04-joinery-samples.webp";
  const fallback = [
    "/assets/images/woodworking/wood-07-workshop-bench.webp",
    "/assets/images/woodworking/wood-09-closet-planning.webp",
    "/assets/images/woodworking/wood-02-cabinet-hardware.webp",
  ];
  return fallback[index % fallback.length];
}

function renderList(items, emptyText) {
  const values = items.map((item) => text(item)).filter(Boolean);
  if (!values.length) return `<p>${esc(emptyText)}</p>`;
  return `<ul>${values.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>`;
}

function materialMarkup(entry) {
  const hasDetailedRows = entry.materials.some((material) => material.quantity || material.note);
  const rows = hasDetailedRows
    ? entry.materials.map((material) => `<tr><th scope="row">${esc(material.name)}</th><td>${esc(material.quantity || "Derive from the released parts list")}</td><td>${esc(material.specification)}</td><td>${esc(material.note || "Verify any substitution before release")}</td></tr>`).join("")
    : entry.materials.map((material) => `<tr><th scope="row">${esc(material.name)}</th><td>${esc(material.specification)}</td></tr>`).join("");
  const headings = hasDetailedRows
    ? "<tr><th>Material or hardware group</th><th>Planning quantity</th><th>Specification to verify</th><th>Release note</th></tr>"
    : "<tr><th>Material or hardware group</th><th>Specification to verify</th></tr>";
  return `<div class="project-table-wrap" role="region" tabindex="0" aria-label="${esc(entry.title)} material and hardware table"><table class="project-table"><thead>${headings}</thead><tbody>${rows}</tbody></table></div>`;
}

function briefMarkup(entry) {
  return entry.briefFields.map((field) => `<div class="project-brief-field"><label for="project-brief-${esc(field.id)}"><strong>${esc(field.label)}</strong><span>${esc(field.prompt)}</span></label><textarea id="project-brief-${esc(field.id)}" name="${esc(field.id)}" rows="3" placeholder="${esc(field.example)}" data-project-brief-field="${esc(field.id)}"></textarea></div>`).join("");
}

function decisionMarkup(entry) {
  return entry.decisions.map((decision, decisionIndex) => {
    const titleId = `project-${entry.slug}-${decision.id}-title`;
    const resultId = `project-${entry.slug}-${decision.id}-result`;
    const choices = decision.options.map((option, optionIndex) => `<label class="project-decision-choice" for="project-${esc(entry.slug)}-${esc(decision.id)}-${optionIndex + 1}"><input id="project-${esc(entry.slug)}-${esc(decision.id)}-${optionIndex + 1}" type="radio" name="project-${esc(decision.id)}" value="${esc(option.value)}" data-project-decision-choice data-project-decision-label="${esc(option.label)}"><span><strong>${esc(option.label)}</strong><small>Choose before revealing the planning consequence.</small></span></label>`).join("");
    const outcomes = decision.options.map((option) => `<p class="project-decision-outcome" hidden data-project-decision-outcome="${esc(option.value)}"><span class="project-decision-status project-decision-status-${esc(option.status)}">${esc(decisionStatusLabel(option.status))}</span><strong>${esc(option.label)}:</strong> ${esc(option.detail)}</p>`).join("");
    return `<article class="project-decision" data-project-decision="${esc(decision.id)}"><div class="project-decision-heading"><span>Decision challenge ${decisionIndex + 1} of ${entry.decisions.length}</span><h3 id="${esc(titleId)}" data-project-decision-title>${esc(decision.title)}</h3><p>${esc(decision.prompt)}</p></div><fieldset class="project-decision-options" aria-labelledby="${esc(titleId)}"><legend>Select the verified project condition</legend>${choices}</fieldset><button class="project-button project-button-secondary" type="button" disabled aria-expanded="false" aria-controls="${esc(resultId)}" data-project-decision-reveal>Reveal the consequence</button><div class="project-decision-result" id="${esc(resultId)}" tabindex="-1" hidden data-project-decision-result><h4>Carry the choice into the released plan</h4>${outcomes}</div></article>`;
  }).join("");
}

function phaseMarkup(entry) {
  return entry.phases.map((phase, index) => `<article class="project-phase" tabindex="-1" data-project-phase-block><header class="project-phase-heading"><span class="project-phase-number">${String(index + 1).padStart(2, "0")}</span><div><p>Phase ${index + 1} of ${entry.phases.length} · ${esc(phase.time)}</p><h3>${esc(phase.title)}</h3></div><input id="project-phase-${esc(entry.slug)}-${index + 1}" type="checkbox" value="${esc(phase.id)}" data-project-phase="${esc(phase.id)}"><label for="project-phase-${esc(entry.slug)}-${index + 1}">Mark phase complete</label></header><div class="project-phase-body"><h4>Outcome</h4><p>${esc(phase.goal)}</p><h4>Work sequence</h4>${renderList(phase.steps, "Use the active project brief to define the task sequence, then record each completed observation before release.")}<div class="project-phase-gates"><div><strong>Evidence to keep</strong><p>${esc(phase.evidence)}</p></div><div><strong>Hold point</strong><p>${esc(phase.stop)}</p></div></div></div></article>`).join("");
}

function variationMarkup(entry) {
  return entry.variations.map((variation) => `<article class="project-variation"><h3>${esc(variation.title)}</h3><p><strong>Use when:</strong> ${esc(variation.condition)}</p><p><strong>Carry through:</strong> ${esc(variation.impact)}</p></article>`).join("");
}

function riskMarkup(entry) {
  return entry.risks.map((risk) => `<article class="project-risk"><h3>${esc(risk.title)}</h3><p><strong>Early signal:</strong> ${esc(risk.signal)}</p><p><strong>Response:</strong> ${esc(risk.response)}</p></article>`).join("");
}

function resourceMarkup(entry) {
  const candidates = [
    { href: entry.templatePath, label: `${entry.title} starting template`, kind: "Template", description: "Adjust the likely parts and project constraints before releasing dimensions." },
    { href: entry.examplePath, label: `${entry.title} calculated example`, kind: "Example", description: "Inspect a complete parts input, modeled sheet result, limitations, and downloadable evidence." },
    ...entry.links,
  ];
  const resources = [...new Map(candidates.map((link) => [link.href, link])).values()];
  return resources.map((link) => `<a class="project-resource" href="${esc(link.href)}"><span>${esc(link.kind)}</span><h3>${esc(link.label)}</h3><p>${esc(link.description)}</p><strong>Open resource →</strong></a>`).join("");
}

function relatedProjectEntries(entry) {
  const all = projectPlaybooks.map(entryView);
  const sameCategory = all.filter((candidate) => candidate.categorySlug === entry.categorySlug);
  const position = sameCategory.findIndex((candidate) => candidate.slug === entry.slug);
  const same = sameCategory.filter((candidate) => candidate.slug !== entry.slug).slice(0, 2);
  const categoryOrder = projectCategories.map(categorySlug);
  const categoryIndex = categoryOrder.indexOf(entry.categorySlug);
  const nextCategorySlug = categoryOrder[(categoryIndex + 1) % categoryOrder.length];
  const nextCategory = all.filter((candidate) => candidate.categorySlug === nextCategorySlug);
  const crossCategory = nextCategory[(position >= 0 ? position : 0) % nextCategory.length];
  return [...same, crossCategory].filter(Boolean);
}

function relatedProjectMarkup(entry) {
  return relatedProjectEntries(entry).map((candidate) => `<a class="project-related-card" href="/projects/${esc(candidate.slug)}/"><span>${esc(candidate.category)} · ${esc(candidate.difficulty)}</span><h3>${esc(displayTitle(candidate))}</h3><p>${esc(candidate.promise)}</p><strong>Open related playbook →</strong></a>`).join("");
}

function detailPage(sourceEntry) {
  const entry = entryView(sourceEntry);
  const route = `/projects/${entry.slug}/`;
  const title = titleFor(entry);
  const description = descriptionFor(entry);
  const heading = displayTitle(entry);
  const faqs = detailFaqs(entry);
  const finishChecks = entry.finish.checks.length
    ? renderList(entry.finish.checks, "")
    : `<ul><li>The finished dimensions and moving clearances match the released project brief.</li><li>Material, hardware, finish, attachment, and safety boundaries are documented from current sources.</li><li>Changes, exceptions, punch items, and reusable project records have named owners and dispositions.</li></ul>`;
  const faqMarkup = faqs.map(([question, answer]) => `<details class="project-faq"><summary>${esc(question)}</summary><p>${esc(answer)}</p></details>`).join("");
  const image = projectImage(entry);
  const projectName = entry.title.replace(/\s+Project Playbook$/i, "");
  const exampleAction = entry.examplePath.includes(entry.slug)
    ? "Inspect the calculated example"
    : "Inspect the related planning example";

  return pageShell({
    title,
    description,
    route,
    schemas: [
      articleSchema(entry, description),
      howToSchema(entry),
      faqSchema(faqs),
      breadcrumbSchema(entry),
      downloadSchema(entry),
    ],
    body: `<main id="main" class="project-playbook" data-project-playbook data-project-slug="${esc(entry.slug)}" data-project-title="${esc(heading)}" data-project-route="${route}" data-project-category="${esc(entry.category)}" data-project-phase-count="${entry.phases.length}">
    <header class="project-hero">
      <div class="project-hero-copy">
        <p class="project-breadcrumb"><a href="/">Home</a> / <a href="/projects/">Project Playbooks</a> / ${esc(entry.title)}</p>
        <p class="project-eyebrow">${esc(entry.category)} · Outcome-first build planning</p>
        <h1>${esc(heading)}</h1>
        <p class="project-lead">${esc(entry.summary)} ${esc(entry.promise)}</p>
        <p class="article-byline project-byline">By <a href="/about/">WoodCutTool Editorial Team</a> · Published ${esc(projectPublishedDate)}</p>
        <div class="project-hero-actions"><button class="project-button" type="button" data-project-start>Start this playbook</button><button class="project-button project-button-secondary" type="button" hidden data-project-resume>Resume this playbook</button><a class="project-button project-button-ghost" href="#project-materials">Preview materials</a></div>
        <div class="project-progress-summary"><progress max="${entry.phases.length}" value="0" aria-labelledby="project-${esc(entry.slug)}-progress-label" data-project-progress></progress><strong id="project-${esc(entry.slug)}-progress-label" data-project-progress-text>0 of ${entry.phases.length} phases complete</strong><span data-project-storage-note>Progress stays in this browser only. No account is required; this feature does not send your brief or progress.</span></div>
        <div class="project-facts" aria-label="Project quick facts"><span><strong>Difficulty</strong>${esc(entry.difficulty)}</span><span><strong>Work sessions</strong>${esc(entry.sessions)}</span><span><strong>Sheet band</strong>${esc(entry.sheetBand)}</span><span><strong>Budget</strong>${esc(entry.budget)}</span><span><strong>Footprint</strong>${esc(entry.footprint)}</span><span><strong>Best for</strong>${esc(entry.audience)}</span></div>
        <p class="project-live-status" aria-live="polite" data-project-live-status>Ready to create a private working copy in this browser.</p>
      </div>
      <figure class="project-hero-visual"><img src="${image}" width="960" height="720" loading="eager" fetchpriority="high" alt="Workshop reference for ${esc(entry.category.toLowerCase())} project planning"><figcaption>Use the outcome to orient the work, then verify every real dimension, product, and release boundary.</figcaption></figure>
    </header>

    <article class="project-content">
      <section class="project-answer"><p class="project-eyebrow">The planning promise</p><h2>Know the next decision before material, time, or site access is committed</h2><p>${esc(entry.promise)}</p><p>This playbook turns that promise into a controlled sequence: capture the project brief, verify material and hardware groups, work through three consequential choices, complete six observable phases, and close against a named finish line. It is designed to keep related resources together without pretending that a generic page knows the dimensions, loads, products, tools, site conditions, or requirements of a real job.</p><p><strong>This is a planning playbook, not a dimensioned construction drawing, engineering review, code approval, machine instruction, or manufacturer authorization.</strong> Use it to organize questions and evidence. The released design, current product data, qualified review, field measurements, test pieces, and applicable requirements remain authoritative.</p></section>

      <section class="project-brief" id="project-brief" tabindex="-1" data-project-brief><div class="project-section-heading"><p class="project-eyebrow">Private local working copy</p><h2>Write the project brief before choosing a path</h2><p>A useful brief records both the value and its source. Write the room, product, drawing, measurement method, responsible person, date, and revision where those details control the result. Entries remain in this browser when storage is available; they are not uploaded by this page.</p></div><div class="project-brief-grid">${briefMarkup(entry)}</div><p class="project-boundary-note">Do not use a remembered dimension as a released input. If the source is missing, mark the field open and keep dependent purchasing, cutting, drilling, finishing, or installation on hold.</p></section>

      <section class="project-materials" id="project-materials"><div class="project-section-heading"><p class="project-eyebrow">Material and hardware map</p><h2>Verify purchasable groups, not just familiar names</h2><p>The groups below are specification prompts, not a purchase order. Derive quantities from the released parts list, then reconcile actual stock size, measured thickness, face and grade requirements, grain direction, trim, kerf, defects, test pieces, hardware model, finish system, and supplier packaging before ordering.</p></div>${materialMarkup(entry)}<p>A substitution is a design change when it alters thickness, stiffness, machining, fastener capacity, edge treatment, finish compatibility, reveal, movement, load, or installation sequence. Record the substitution, identify every dependent part or phase, and issue a new revision instead of quietly carrying an old quantity forward.</p></section>

      <section class="project-decisions" id="project-decisions"><div class="project-section-heading"><p class="project-eyebrow">Choose, then reveal</p><h2>Three decisions that change the project downstream</h2><p>Select the condition that matches the verified brief before opening the consequence. This small pause prevents a familiar preference from masquerading as a project fact. The reveal explains what must be carried into dimensions, material, sequence, and evidence; it does not approve the choice.</p></div><div class="project-decision-grid">${decisionMarkup(entry)}</div><p class="project-boundary-note">After each reveal, record the verified condition in the brief and update every dependent dimension, material row, phase, and release check before continuing.</p><noscript><p>Decision interaction needs JavaScript. The prompts and options remain readable; print the page and record the selected consequence manually.</p></noscript></section>

      <section class="project-phases" id="project-progress"><div class="project-section-heading"><p class="project-eyebrow">Six-phase path</p><h2>Move from verified input to documented finish</h2><p>Complete phases in the order shown unless the released project plan defines a safer dependency. Each checkbox represents a reviewed phase, not merely activity. Preserve the input, observed result, owner, date, revision, and exception record that lets another person reproduce why the work moved forward.</p></div><div class="project-phase-list">${phaseMarkup(entry)}</div></section>

      <section class="project-variations"><div class="project-section-heading"><p class="project-eyebrow">Adapt without losing control</p><h2>Useful variations and what they force you to revisit</h2><p>A variation is not a cosmetic label. It can change the finished envelope, part set, sheet grouping, joinery, hardware, load, stability, transport, finish, installation, or removal path. Choose it early enough to update the authoritative project sources.</p></div><div class="project-variation-grid">${variationMarkup(entry)}</div></section>

      <section class="project-risks"><div class="project-section-heading"><p class="project-eyebrow">Catch rework while it is still a decision</p><h2>Project risks, early signals, and hold actions</h2><p>Use these risks as observation prompts rather than predictions. When a signal appears, protect the current condition, keep affected work visible, identify the smallest upstream cause, and repeat every dependent calculation, sample, fit, or inspection under the corrected revision.</p></div><div class="project-risk-grid">${riskMarkup(entry)}</div><p>Never solve a mismatch by trimming or forcing the downstream part without recording what changed. A local adjustment can hide a wrong datum, wrong product, wrong material thickness, unsafe clearance, blocked assembly sequence, or installation conflict that will reappear later.</p></section>

      <section class="project-related"><div class="project-section-heading"><p class="project-eyebrow">Keep exploring</p><h2>Related playbooks with a useful shared decision</h2><p>Compare two projects in the same family, then look across to the next category for a different footprint or workflow. The links are deliberately stable so every playbook remains part of a connected, browsable project library.</p></div><div class="project-related-grid">${relatedProjectMarkup(entry)}</div></section>

      <section class="project-resources"><div class="project-section-heading"><p class="project-eyebrow">Connected project system</p><h2>Open the exact resource for the next task</h2><p>The playbook coordinates the work but does not replace calculation, a parts dataset, a release checklist, a field record, or a diagnostic method. Use the linked surfaces for their stated purpose and return the verified result to this project record.</p></div><div class="project-resource-grid">${resourceMarkup(entry)}</div></section>

      <section class="project-app-handoff" data-conversion-cta data-conversion-source="project-detail"><div><p class="project-eyebrow">From decisions to a reusable cut plan</p><h2>Build the released ${esc(projectName)} parts in CutList</h2><p>${esc(entry.finish.summary)} Once that outcome and its parts are released, enter the measured names, quantities, materials, kerf, and grain rules in CutList to compare layouts and keep the working cut plan. This playbook does not transfer project data automatically.</p><div class="project-app-actions"><a class="project-button" href="/go/cutlist/?source=project-detail&amp;placement=project-playbook" data-app-store-link data-platform-label data-conversion-placement="project-playbook" rel="nofollow noopener">Build the cut plan in CutList</a><a class="project-button project-button-secondary" href="/apps/cutlist/">See how CutList works</a></div></div><ul class="project-app-proof" aria-label="CutList trust points"><li>Free basic layouts</li><li>No login</li><li>No cloud upload</li><li>Works offline</li></ul></section>

      <section class="project-finish"><div class="project-section-heading"><p class="project-eyebrow">Finish line</p><h2>Close the project against observable results</h2><p>${esc(entry.finish.summary)}</p></div>${finishChecks}<p>Closeout should leave a usable trail for repair, repeat work, disassembly, warranty questions, and future changes. Save the released drawing or sketch, final parts and material records, product identities, approved exceptions, field changes, finish information, photographs where appropriate, and the final project-playbook CSV together.</p></section>

      <section class="project-boundaries"><div class="project-section-heading"><p class="project-eyebrow">Safety and authority boundaries</p><h2>Use the playbook to expose uncertainty, not to override it</h2></div><p>Follow current manufacturer instructions and use appropriate training, guarding, support, dust or fume control, ventilation, PPE, lifting methods, cure time, and disposal practices. Do not use this page as permission to operate unfamiliar equipment, defeat a safety system, exceed a tool or product rating, improvise a structural connection, or conceal work that has not passed the required inspection.</p><p>Structural, stair, guard, anchoring, seismic, electrical, plumbing, gas, fire, accessibility, and building-code decisions require the appropriate qualified professional or authority. Hardware clearances, fastener schedules, adhesive preparation, coating compatibility, load ratings, and installation methods come from the exact current product and project documentation. Verify them after any substitution.</p><p>Dimensions must name their datum, unit, finished or unfinished state, and measurement source. Check real openings at multiple locations; confirm square, level, plumb, flatness, obstructions, access, transport, assembly, service, and removal paths. Build a first article, sample, mockup, or dry fit when one failure could repeat across a batch or become expensive after finishing or installation.</p></section>

      <section class="project-downloads" id="project-downloads"><div><p class="project-eyebrow">Keep a durable record</p><h2>Print the page or take the project data with you</h2><p>The blank CSV mirrors the published playbook. The progress CSV is generated locally from the brief, decisions, and phase status currently shown in this browser.</p></div><div class="project-download-actions"><button class="project-button project-button-secondary" type="button" data-project-print>Print playbook</button><a class="project-button" href="${route}project-playbook.csv" download>Download blank CSV</a><button class="project-button project-button-secondary" type="button" data-project-download-progress>Download progress CSV</button><button class="project-button project-button-danger" type="button" data-project-clear>Clear local progress</button></div></section>

      <section class="project-faqs"><div class="project-section-heading"><p class="project-eyebrow">Questions before starting</p><h2>Project playbook FAQ</h2></div>${faqMarkup}</section>
      <nav class="project-next-actions" aria-label="Project playbook next actions"><a href="/projects/">Browse all 18 playbooks</a><a href="${esc(entry.templatePath)}">Open the starting template</a><a href="${esc(entry.examplePath)}">${esc(exampleAction)}</a></nav>
    </article>
  </main>`,
  });
}

function hubPage() {
  const title = "18 Woodworking Project Playbooks | WoodCutTool";
  const description = "Choose 18 visual woodworking project playbooks by category, difficulty, or work sessions, then save a private brief and six-phase progress locally.";
  const faqs = hubFaqs();
  const categoryOptions = projectCategories.map((category) => `<option value="${esc(categorySlug(category))}">${esc(categoryName(category))}</option>`).join("");
  const difficultyOptions = [...new Set(projectPlaybooks.map((entry) => String(entry.difficulty)))].sort().map((value) => `<option value="${esc(slugify(value))}">${esc(value)}</option>`).join("");
  const sessionOptions = [...new Set(projectPlaybooks.map((entry) => String(entry.sessions)))].sort().map((value) => `<option value="${esc(slugify(value))}">${esc(value)}</option>`).join("");
  const cards = projectPlaybooks.map((sourceEntry, index) => {
    const entry = entryView(sourceEntry);
    const search = `${entry.title} ${entry.summary} ${entry.promise} ${entry.category} ${entry.difficulty} ${entry.sessions} ${entry.audience}`.toLowerCase();
    return `<article class="project-card" data-project-card data-project-route="/projects/${esc(entry.slug)}/" data-project-category="${esc(entry.categorySlug)}" data-project-difficulty="${esc(slugify(entry.difficulty))}" data-project-sessions="${esc(slugify(entry.sessions))}" data-project-search="${esc(search)}"><a class="project-card-link" href="/projects/${esc(entry.slug)}/"><figure class="project-card-visual"><img src="${projectImage(entry, index)}" width="960" height="720" loading="lazy" alt="Workshop reference for ${esc(entry.category.toLowerCase())} project planning"><figcaption>${esc(entry.category)}</figcaption></figure><div class="project-card-copy"><div class="project-card-badges"><span>${esc(entry.difficulty)}</span><span>${esc(entry.sessions)}</span><span>${esc(entry.sheetBand)}</span></div><h2>${esc(entry.title)}</h2><p>${esc(entry.summary)}</p><strong>${esc(entry.promise)}</strong><em>Open the six-phase playbook →</em></div></a></article>`;
  }).join("");
  const categoryIntroductions = projectCategories.map((category) => `<article class="project-category-note" id="${esc(categorySlug(category))}"><h2>${esc(categoryName(category))}</h2><p>${esc(categoryDescription(category))}</p><span>3 complete project playbooks</span></article>`).join("");
  const faqMarkup = faqs.map(([question, answer]) => `<details class="project-faq"><summary>${esc(question)}</summary><p>${esc(answer)}</p></details>`).join("");
  const hubSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Woodworking Project Playbooks",
    description,
    url: `${siteUrl}/projects/`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: projectPlaybooks.length,
      itemListElement: projectPlaybooks.map((entry, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: entry.title,
        url: `${siteUrl}/projects/${entry.slug}/`,
      })),
    },
  };

  return pageShell({
    title,
    description,
    route: "/projects/",
    type: "website",
    schemas: [hubSchema, faqSchema(faqs), breadcrumbSchema()],
    body: `<main id="main" class="project-hub" data-project-hub>
    <header class="project-hub-hero"><div class="project-hub-copy"><p class="project-breadcrumb"><a href="/">Home</a> / Project Playbooks</p><p class="project-eyebrow">New · 18 outcome-first project paths</p><h1>Choose a Project. See the Decisions. Keep the Build Moving.</h1><p class="project-lead">Project Playbooks connect an attractive finished goal to the work that makes it real: a private project brief, verified material groups, three decision challenges, six observable phases, risks, variations, linked templates and examples, and a downloadable record.</p><div class="project-finder" aria-labelledby="project-finder-title"><div class="project-section-heading"><p class="project-eyebrow">Find a build path</p><h2 id="project-finder-title">Search the outcome or filter the commitment</h2><p>Filter by project family, difficulty, or work-session band. Random Pick chooses only from the playbooks still visible.</p></div><div class="project-filter-grid"><label for="project-search"><span>Search projects</span><input id="project-search" type="search" placeholder="Try cabinet, small space, storage, weekend…" autocomplete="off" data-project-search></label><label for="project-category"><span>Category</span><select id="project-category" data-project-category-filter><option value="">All categories</option>${categoryOptions}</select></label><label for="project-difficulty"><span>Difficulty</span><select id="project-difficulty" data-project-difficulty-filter><option value="">All difficulty levels</option>${difficultyOptions}</select></label><label for="project-sessions"><span>Work sessions</span><select id="project-sessions" data-project-sessions-filter><option value="">Any session band</option>${sessionOptions}</select></label><button class="project-button project-random-button" type="button" data-project-random>Random Pick</button></div><p class="project-filter-status" aria-live="polite" data-project-filter-status>Showing all 18 project playbooks.</p></div><div class="project-hub-metrics"><span><strong>18</strong> complete playbooks</span><span><strong>6</strong> project categories</span><span><strong>108</strong> work phases</span><span><strong>54</strong> decision challenges</span></div><p class="project-storage-note" data-project-storage-note>Progress stays in this browser only. No account is required; this feature does not send your brief or progress.</p></div><figure class="project-hub-visual"><img src="/assets/images/woodworking/wood-07-workshop-bench.webp" width="960" height="720" loading="eager" fetchpriority="high" alt="Organized woodworking bench ready for a project playbook"><figcaption>Start from the outcome, then keep decisions, evidence, and progress connected.</figcaption></figure></header>

    <section class="project-resume"><div class="project-section-heading"><p class="project-eyebrow">Continue privately</p><h2>Resume a playbook saved in this browser</h2><p>This area reads only the versioned local progress created by Project Playbooks. Clearing browser storage removes it; WoodCutTool does not use an account or upload the project brief.</p></div><div class="project-resume-list" data-project-resume-list><p class="project-resume-empty">No saved playbook yet. Start any project below and this area will offer a private resume shortcut.</p></div></section>

    <section class="project-category-overview"><div class="project-section-heading"><p class="project-eyebrow">Six distinct project families</p><h2>Pick the physical outcome that matches your space and appetite</h2><p>Each category has three playbooks rather than a long list of thin variants. The pages differ by footprint, audience, material pressure, decisions, sequence, risks, and finish line.</p></div><div class="project-category-grid">${categoryIntroductions}</div></section>

    <section class="project-catalog"><div class="project-section-heading"><p class="project-eyebrow">Complete catalog</p><h2>18 visual woodworking project playbooks</h2><p>Every card opens an independent six-phase workflow with a printable page, static project CSV, dynamic progress CSV, and links to existing WoodCutTool resources.</p></div><div class="project-card-grid">${cards}</div></section>

    <section class="project-system"><div class="project-section-heading"><p class="project-eyebrow">Why this column is different</p><h2>A project playbook connects the surfaces that already do one job well</h2></div><p><a href="/templates/">Templates</a> provide likely project parts and constraints. <a href="/examples/">Examples</a> publish complete inputs, modeled layouts, and downloadable evidence. <a href="/checklists/">Checklists</a> decide whether work can proceed. <a href="/worksheets/">Worksheets</a> preserve field and shop records. <a href="/troubleshooting/">Troubleshooting</a> starts when an observed result disagrees with the plan. A Project Playbook gives those resources an outcome-first order so a person can see where to start, what to decide, what evidence to keep, and what “finished” means.</p><p>The playbook deliberately does not invent universal dimensions or approvals. It keeps project-specific values blank, names the decisions that change downstream work, and sends calculation or release questions to the appropriate tool or resource. That makes it useful as a planning companion without turning a generic article into an unsafe construction drawing.</p></section>

    <section class="project-faqs"><div class="project-section-heading"><p class="project-eyebrow">Before choosing a project</p><h2>Project Playbooks FAQ</h2></div>${faqMarkup}</section>
  </main>`,
  });
}

function localPathExists(href) {
  if (!href || href.startsWith("#")) return true;
  let url;
  try {
    url = new URL(href, siteUrl);
  } catch {
    return false;
  }
  if (url.origin !== siteUrl) return true;
  const pathname = decodeURIComponent(url.pathname);
  const clean = pathname.replace(/^\/+/, "");
  if (!clean) return existsSync(join(root, "index.html"));
  if (pathname.endsWith("/")) return existsSync(join(root, clean, "index.html"));
  return existsSync(join(root, clean)) || existsSync(join(root, `${clean}.html`));
}

function visibleWordCount(html) {
  return html
    .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
    .replace(/<!--([\s\S]*?)-->/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z0-9#]+;/gi, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

function validateSource() {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(projectPublishedDate)) throw new Error(`Invalid projectPublishedDate: ${projectPublishedDate}`);
  if (projectCategories.length !== 6) throw new Error(`Expected 6 project categories, found ${projectCategories.length}.`);
  if (projectPlaybooks.length !== 18) throw new Error(`Expected 18 project playbooks, found ${projectPlaybooks.length}.`);

  const sourceCategorySlugs = projectCategories.map(categorySlug);
  if (new Set(sourceCategorySlugs).size !== sourceCategorySlugs.length) throw new Error("Project category slugs must be unique.");
  const counts = new Map(sourceCategorySlugs.map((slug) => [slug, 0]));
  const seen = new Set();

  for (const sourceEntry of projectPlaybooks) {
    const entry = entryView(sourceEntry);
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entry.slug)) throw new Error(`Invalid project slug: ${entry.slug}`);
    if (seen.has(entry.slug)) throw new Error(`Duplicate project slug: ${entry.slug}`);
    seen.add(entry.slug);
    if (!counts.has(entry.categorySlug)) throw new Error(`${entry.slug} uses unknown category slug ${entry.categorySlug}.`);
    counts.set(entry.categorySlug, counts.get(entry.categorySlug) + 1);
    if (!entry.category || !entry.categoryDescription) throw new Error(`${entry.slug} is missing flattened category metadata.`);
    if (entry.decisions.length !== 3) throw new Error(`${entry.slug} has ${entry.decisions.length} decisions; expected 3.`);
    if (entry.phases.length !== 6) throw new Error(`${entry.slug} has ${entry.phases.length} phases; expected 6.`);
    entry.decisions.forEach((decision) => {
      if (decision.options.length < 2) throw new Error(`${entry.slug} decision ${decision.title} needs at least two choices.`);
    });
    if (!entry.briefFields.length || !entry.materials.length || !entry.variations.length || !entry.risks.length) {
      throw new Error(`${entry.slug} needs brief fields, materials, variations, and risks.`);
    }
    if (!sourceEntry.variations.every((variation) => variation && typeof variation === "object" && !Array.isArray(variation))) {
      throw new Error(`${entry.slug} variations must provide project-specific condition and impact fields.`);
    }
    if (!sourceEntry.risks.every((risk) => risk && typeof risk === "object" && !Array.isArray(risk))) {
      throw new Error(`${entry.slug} risks must provide project-specific signal and response fields.`);
    }
    if (!sourceEntry.links.every((link) => Array.isArray(link) && String(link[3] || "").trim().length >= 30)) {
      throw new Error(`${entry.slug} resource links need project-specific descriptions.`);
    }
    if (!sourceEntry.finishLine || typeof sourceEntry.finishLine !== "object" || !Array.isArray(sourceEntry.finishLine.checks) || sourceEntry.finishLine.checks.length < 3) {
      throw new Error(`${entry.slug} finish line needs a summary and at least three observable checks.`);
    }

    const title = titleFor(entry);
    const description = descriptionFor(entry);
    if (title.length < 30 || title.length > 70) throw new Error(`SEO title length ${title.length}: ${entry.slug}`);
    if (description.length < 120 || description.length > 165) throw new Error(`Meta description length ${description.length}: ${entry.slug}`);

    const paths = [entry.templatePath, entry.examplePath, ...entry.links.map((link) => link.href)];
    for (const href of paths) {
      if (!href || !localPathExists(href)) throw new Error(`Missing local project resource ${href || "(empty)"} for ${entry.slug}.`);
    }

    const html = detailPage(sourceEntry);
    const words = visibleWordCount(html);
    if (words < 1300) throw new Error(`${entry.slug} has only ${words} visible words; expected at least 1300.`);
  }

  for (const [slug, count] of counts) {
    if (count !== 3) throw new Error(`Project category ${slug} has ${count} playbooks; expected 3.`);
  }
}

validateSource();

await mkdir(join(root, "projects"), { recursive: true });
await writeFile(join(root, "projects", "index.html"), hubPage());
for (const sourceEntry of projectPlaybooks) {
  const entry = entryView(sourceEntry);
  const directory = join(root, "projects", entry.slug);
  await mkdir(directory, { recursive: true });
  await Promise.all([
    writeFile(join(directory, "index.html"), detailPage(sourceEntry)),
    writeFile(join(directory, "project-playbook.csv"), csvFor(entry)),
  ]);
}

console.log(`Generated ${projectPlaybooks.length} project playbooks, ${projectPlaybooks.length} CSV files, and ${projectCategories.length} category paths.`);
