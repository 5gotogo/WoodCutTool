const appStoreBaseUrl = "https://apps.apple.com/us/app/cutlist-plywood-optimizer/id6768171871";
const redirectBaseUrl = "/go/cutlist/";

const esc = (value) => String(value ?? "")
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

export function campaignToken(value) {
  return String(value || "website")
    .toLowerCase()
    .replaceAll(/[^a-z0-9_-]+/g, "-")
    .replaceAll(/^-+|-+$/g, "")
    .slice(0, 30) || "website";
}

export function cutlistRedirectUrl(source, placement = "content") {
  const params = new URLSearchParams({
    source: campaignToken(source),
    placement: campaignToken(placement),
  });
  return `${redirectBaseUrl}?${params.toString()}`;
}

export function directAppStoreUrl(source, providerToken = "") {
  const url = new URL(appStoreBaseUrl);
  url.searchParams.set("ct", campaignToken(source));
  url.searchParams.set("mt", "8");
  if (providerToken) url.searchParams.set("pt", String(providerToken));
  return url.toString();
}

const contextDefaults = {
  template: {
    eyebrow: "Make this template yours",
    title: "Replace the sample dimensions before the first sheet is cut",
    description: "Use the template to define the parts, then create a saved CutList project with your actual material, kerf, grain direction, and quantities.",
    primaryLabel: "Build the real project in CutList",
  },
  example: {
    eyebrow: "Turn the example into your project",
    title: "The published layout is evidence, not your final cut plan",
    description: "Recreate the example with your own dimensions in CutList, review the new sheet count, and keep the approved version available in the shop.",
    primaryLabel: "Create your own version in CutList",
  },
  guide: {
    eyebrow: "Move from reading to a checked plan",
    title: "Test the method with the parts you will actually cut",
    description: "Use CutList when the project needs saved revisions, offline access, a step-by-step cutting sequence, or a PDF shop handoff.",
    primaryLabel: "Plan a real project in CutList",
  },
  troubleshooting: {
    eyebrow: "Preserve the corrected revision",
    title: "Keep the verified fix from becoming another undocumented change",
    description: "After the cause is isolated, update one saved CutList project, regenerate the layout, and keep the corrected cut sequence with the job.",
    primaryLabel: "Save the corrected plan in CutList",
  },
  result: {
    eyebrow: "Keep the checked result",
    title: "Take the reviewed plan into the shop",
    description: "CutList keeps plywood projects, layouts, waste, and cutting sequences on your iPhone or iPad, fully offline.",
    primaryLabel: "Get CutList",
  },
};

export function cutlistConversionCta({
  context = "guide",
  source = "website",
  title,
  description,
  primaryLabel,
  secondaryHref = "/apps/cutlist/",
  secondaryLabel = "See how CutList works",
  projectName = "",
  proof = ["Free basic layouts", "No login", "No cloud upload", "Works offline"],
} = {}) {
  const defaults = contextDefaults[context] || contextDefaults.guide;
  const resolvedTitle = title || (projectName
    ? `${defaults.title}: ${projectName}`
    : defaults.title);
  const sourceToken = campaignToken(source);
  const placement = `${context}-cta`;
  const storeHref = cutlistRedirectUrl(sourceToken, placement);

  return `<section class="conversion-cta conversion-cta-${esc(context)}" data-conversion-cta data-conversion-source="${esc(sourceToken)}">
    <div class="conversion-cta-copy">
      <p class="eyebrow">${esc(defaults.eyebrow)}</p>
      <h2>${esc(resolvedTitle)}</h2>
      <p>${esc(description || defaults.description)}</p>
      <div class="cta-row">
        <a class="button" href="${storeHref}" data-app-store-link data-platform-label data-conversion-placement="${esc(placement)}" rel="nofollow noopener">${esc(primaryLabel || defaults.primaryLabel)}</a>
        <a class="button secondary" href="${esc(secondaryHref)}" data-conversion-placement="${esc(context)}-details">${esc(secondaryLabel)}</a>
      </div>
      <ul class="conversion-proof-list" aria-label="CutList trust points">
        ${proof.map((item) => `<li>${esc(item)}</li>`).join("")}
      </ul>
    </div>
    <a class="conversion-qr" href="${storeHref}" data-app-store-link data-conversion-placement="${esc(context)}-qr" aria-label="Scan or open the CutList App Store page">
      <img src="/assets/images/apps/cutlist/cutlist-app-store-qr.svg" width="132" height="132" loading="lazy" alt="QR code to get CutList on the App Store">
      <span><strong>On a computer?</strong> Scan with your iPhone or iPad.</span>
    </a>
  </section>`;
}

export function learnContextSupportsCutList(clusterId) {
  return new Set([
    "cabinet-planning",
    "plywood-sheet-goods",
    "cutting-quality",
    "shop-workflow",
    "layout-optimization",
    "cut-list-operations",
    "estimating-purchasing",
    "furniture-projects",
  ]).has(clusterId);
}

export const cutlistAppStoreId = "6768171871";
export const cutlistAppStoreBaseUrl = appStoreBaseUrl;
