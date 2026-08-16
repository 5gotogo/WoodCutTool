(function () {
  const APP_ID = "6768171871";
  const APP_PATH = "/go/cutlist/";
  const EVENT_ENDPOINT = "/api/conversion-event";
  const seenImpressions = new WeakSet();

  function cleanToken(value, fallback = "website") {
    const token = String(value || fallback)
      .toLowerCase()
      .replace(/[^a-z0-9_-]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 30);
    return token || fallback;
  }

  function routeSource() {
    const path = window.location.pathname;
    if (path === "/apps/cutlist/" || path === "/apps/cutlist-plywood-optimizer/") return "app-page";
    if (path === "/plywood-cut-calculator/" || path === "/cutlist/" || path === "/cut-list-calculator/") return "calculator-page";
    if (path.startsWith("/templates/")) return "template";
    if (path.startsWith("/examples/")) return "example";
    if (path.startsWith("/projects/")) return "project";
    if (path.startsWith("/learn/")) return "learn";
    if (path.startsWith("/troubleshooting/")) return "troubleshooting";
    if (path.startsWith("/blog/")) return "blog";
    return path === "/" ? "home" : "website";
  }

  function deviceClass() {
    const ua = navigator.userAgent || "";
    if (/iPad/i.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)) return "ipad";
    if (/iPhone|iPod/i.test(ua)) return "iphone";
    if (/Android/i.test(ua)) return "android";
    return window.matchMedia("(max-width: 760px)").matches ? "mobile-other" : "desktop";
  }

  function safeDetails(details = {}) {
    const allowed = {};
    for (const [key, value] of Object.entries(details)) {
      if (!/^[a-z][a-z0-9_]{0,31}$/.test(key)) continue;
      if (typeof value === "number" && Number.isFinite(value)) {
        allowed[key] = Math.round(value * 100) / 100;
      } else if (typeof value === "boolean") {
        allowed[key] = value;
      } else if (typeof value === "string") {
        allowed[key] = value.slice(0, 80);
      }
    }
    return allowed;
  }

  function track(event, details = {}) {
    if (navigator.doNotTrack === "1") return;
    const payload = JSON.stringify({
      event: cleanToken(event, "event"),
      source: cleanToken(details.source || routeSource()),
      path: window.location.pathname.slice(0, 180),
      device: deviceClass(),
      details: safeDetails(details),
      timestamp: new Date().toISOString(),
    });

    try {
      if (navigator.sendBeacon) {
        navigator.sendBeacon(EVENT_ENDPOINT, new Blob([payload], { type: "application/json" }));
      } else {
        fetch(EVENT_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: payload,
          keepalive: true,
          credentials: "same-origin",
        }).catch(() => {});
      }
    } catch {
      // Conversion measurement must never block the planning tools.
    }

    window.dispatchEvent(new CustomEvent("woodcuttool:conversion", {
      detail: JSON.parse(payload),
    }));
  }

  function placementFor(link) {
    return cleanToken(
      link.dataset.conversionPlacement ||
      link.closest("[data-conversion-cta]")?.dataset.conversionSource ||
      (link.classList.contains("nav-download-cta") ? "navigation" : "content"),
      "content",
    );
  }

  function redirectHref(source, placement) {
    const params = new URLSearchParams({
      source: cleanToken(source),
      placement: cleanToken(placement),
    });
    return `${APP_PATH}?${params.toString()}`;
  }

  function isCutListStoreLink(link) {
    const href = link.getAttribute("href") || "";
    return href.includes(`/id${APP_ID}`) || href.startsWith(APP_PATH);
  }

  function prepareLink(link) {
    if (!(link instanceof HTMLAnchorElement) || !isCutListStoreLink(link)) return;
    const placement = placementFor(link);
    const source = cleanToken(
      link.closest("[data-conversion-cta]")?.dataset.conversionSource || routeSource(),
    );
    link.href = redirectHref(source, placement);
    link.dataset.appStoreLink = "";
    link.dataset.conversionSource = source;
    link.dataset.conversionPlacement = placement;
    link.rel = "nofollow noopener";
    if (link.hasAttribute("data-platform-label")) {
      const label = link.querySelector("[data-platform-label-text]");
      link.dataset.originalLabel ||= (label || link).textContent.trim();
      if (deviceClass() === "iphone" || deviceClass() === "ipad") {
        if (label) {
          label.textContent = "App Store";
        } else {
          link.textContent = "App Store";
        }
        link.setAttribute("aria-label", "Get CutList on the App Store");
      }
    }
  }

  function prepareLinks(root = document) {
    root.querySelectorAll?.("a").forEach(prepareLink);
  }

  function observeCta(cta) {
    if (!(cta instanceof Element) || seenImpressions.has(cta)) return;
    if (!("IntersectionObserver" in window)) {
      seenImpressions.add(cta);
      track("cta_impression", { source: cta.dataset.conversionSource || routeSource() });
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      seenImpressions.add(cta);
      track("cta_impression", {
        source: cta.dataset.conversionSource || routeSource(),
        variant: cta.className,
      });
      observer.disconnect();
    }, { threshold: 0.35 });
    observer.observe(cta);
  }

  function prepareCtas(root = document) {
    root.querySelectorAll?.("[data-conversion-cta]").forEach(observeCta);
  }

  document.addEventListener("click", (event) => {
    const link = event.target.closest?.("a");
    if (!link || !isCutListStoreLink(link)) return;
    prepareLink(link);
    track("app_store_click", {
      source: link.dataset.conversionSource || routeSource(),
      placement: link.dataset.conversionPlacement || placementFor(link),
      label: link.textContent.trim(),
    });
  }, true);

  document.addEventListener("submit", (event) => {
    const form = event.target;
    if (!(form instanceof HTMLFormElement)) return;
    const calculator = form.id.replace(/-form$/, "");
    if (!calculator) return;
    track("calculator_submit", { calculator });
  }, true);

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (!(node instanceof Element)) continue;
        if (node.matches("a")) prepareLink(node);
        prepareLinks(node);
        if (node.matches("[data-conversion-cta]")) observeCta(node);
        prepareCtas(node);
      }
    }
  });

  function init() {
    document.documentElement.dataset.conversionDevice = deviceClass();
    prepareLinks();
    prepareCtas();
    observer.observe(document.body, { childList: true, subtree: true });
  }

  window.WCTConversion = {
    track,
    appStoreHref(source = routeSource(), placement = "content") {
      return redirectHref(source, placement);
    },
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
