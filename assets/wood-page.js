// Generated from shared site-chrome.js/content-page.js by scripts/build-wood-runtime.mjs.
(function () {
  // Keep the reserved header height, and mount after the text-led document
  // parses. Streaming a full header ahead of the lead delayed its paint.
  const header = document.querySelector("[data-site-header]");
  if (header) header.outerHTML = "<header class=\"site-header\"><nav class=\"nav\" aria-label=\"Main navigation\"><a class=\"brand\" href=\"/\" aria-label=\"WoodCutTool home\"><img class=\"brand-icon\" src=\"/assets/icons/brand-icon.webp\" width=\"34\" height=\"34\" alt=\"\"><span class=\"brand-name\">WoodCutTool</span></a><div class=\"nav-links nav-links-mega\" id=\"site-navigation\"><div class=\"nav-menu-item\" data-menu-key=\"Tools\"><div class=\"nav-menu-control\"><a class=\"nav-trigger\" href=\"/tools/\">Tools</a><button class=\"nav-menu-toggle\" type=\"button\" aria-label=\"Open Tools menu\" aria-haspopup=\"true\" aria-expanded=\"false\"><span class=\"visually-hidden\">Open Tools menu</span></button></div></div><div class=\"nav-menu-item\" data-menu-key=\"Projects\"><div class=\"nav-menu-control\"><a class=\"nav-trigger\" href=\"/projects/\">Projects</a><button class=\"nav-menu-toggle\" type=\"button\" aria-label=\"Open Projects menu\" aria-haspopup=\"true\" aria-expanded=\"false\"><span class=\"visually-hidden\">Open Projects menu</span></button></div></div><div class=\"nav-menu-item\" data-menu-key=\"Learn\"><div class=\"nav-menu-control\"><a class=\"nav-trigger\" href=\"/learn/\">Learn</a><button class=\"nav-menu-toggle\" type=\"button\" aria-label=\"Open Learn menu\" aria-haspopup=\"true\" aria-expanded=\"false\"><span class=\"visually-hidden\">Open Learn menu</span></button></div></div><div class=\"nav-menu-item active\" data-menu-key=\"Resources\"><div class=\"nav-menu-control\"><a class=\"nav-trigger active\" href=\"/research/\">Resources</a><button class=\"nav-menu-toggle\" type=\"button\" aria-label=\"Open Resources menu\" aria-haspopup=\"true\" aria-expanded=\"false\"><span class=\"visually-hidden\">Open Resources menu</span></button></div></div><div class=\"nav-menu-item\" data-menu-key=\"Apps\"><div class=\"nav-menu-control\"><a class=\"nav-trigger\" href=\"/apps/\">Apps</a><button class=\"nav-menu-toggle\" type=\"button\" aria-label=\"Open Apps menu\" aria-haspopup=\"true\" aria-expanded=\"false\"><span class=\"visually-hidden\">Open Apps menu</span></button></div></div></div><button class=\"mobile-nav-toggle\" type=\"button\" aria-controls=\"site-navigation\" aria-expanded=\"false\"><span class=\"mobile-nav-toggle-icon\" aria-hidden=\"true\"><span></span><span></span><span></span></span><span class=\"visually-hidden\">Open menu</span></button><a class=\"button small nav-download-cta\" href=\"/tools/\" aria-label=\"Browse Tools\"><span data-platform-label-text>Browse Tools</span></a></nav></header>";
  let menusPromise = null;
  function loadMenus() {
    if (!menusPromise) menusPromise = fetch("/assets/wood-menus.json")
      .then(response => { if (!response.ok) throw new Error("HTTP " + response.status); return response.json(); })
      .catch(error => { menusPromise = null; throw error; });
    return menusPromise;
  }
  function initMegaNavigation() {
    let pendingMenu = null;
    let menuRequest = 0;
    const nav = document.querySelector(".nav");
    const navLinks = document.querySelector(".nav-links-mega");
    if (!nav || !navLinks || navLinks.dataset.boundMegaNavigation) return;
    navLinks.dataset.boundMegaNavigation = "true";

    const mobileQuery = window.matchMedia("(max-width: 979px)");
    const mobileToggle = nav.querySelector(".mobile-nav-toggle");
    const items = [...navLinks.querySelectorAll(".nav-menu-item")];
    if (!items.length) return;

    const updateMenuTop = () => {
      const header = nav.closest(".site-header");
      const bottom = header ? header.getBoundingClientRect().bottom : nav.getBoundingClientRect().bottom;
      document.documentElement.style.setProperty("--mega-menu-top", `${Math.max(0, Math.round(bottom))}px`);
    };

    const closeSubmenus = () => {
      menuRequest += 1;
      pendingMenu = null;
      items.forEach((item) => {
        item.classList.remove("is-open");
        const toggle = item.querySelector(".nav-menu-toggle");
        const label = item.querySelector(".nav-trigger")?.textContent.trim() || "navigation";
        toggle?.setAttribute("aria-expanded", "false");
        toggle?.setAttribute("aria-label", `Open ${label} menu`);
        if (toggle?.querySelector(".visually-hidden")) {
          toggle.querySelector(".visually-hidden").textContent = `Open ${label} menu`;
        }
      });
      nav.classList.remove("nav-mega-open");
    };

    const setMobileNavigation = (isOpen) => {
      if (!mobileQuery.matches) isOpen = false;
      nav.classList.toggle("nav-mobile-open", isOpen);
      document.body.classList.toggle("mobile-navigation-open", isOpen);
      mobileToggle?.setAttribute("aria-expanded", String(isOpen));
      mobileToggle?.setAttribute("aria-label", `${isOpen ? "Close" : "Open"} menu`);
      if (mobileToggle?.querySelector(".visually-hidden")) {
        mobileToggle.querySelector(".visually-hidden").textContent = `${isOpen ? "Close" : "Open"} menu`;
      }
      if (isOpen) {
        updateMenuTop();
      } else {
        closeSubmenus();
      }
    };

    const closeMenus = () => {
      closeSubmenus();
      setMobileNavigation(false);
    };

    const ensureMenu = async (item) => {
      if (item.querySelector(".mega-menu")) return;
      const menus = await loadMenus();
      const markup = menus[item.dataset.menuKey || ""];
      if (!markup) throw new Error("Missing navigation menu");
      if (!item.querySelector(".mega-menu")) item.insertAdjacentHTML("beforeend", markup);
    };

    const openMenu = async (item) => {
      pendingMenu = item;
      const request = ++menuRequest;
      try { await ensureMenu(item); } catch (error) {
        if (request === menuRequest) pendingMenu = null;
        console.warn("Navigation menu failed to load.", error);
        return;
      }
      if (request !== menuRequest) return;
      pendingMenu = null;
      updateMenuTop();
      items.forEach((candidate) => {
        const isCurrent = candidate === item;
        candidate.classList.toggle("is-open", isCurrent);
        const toggle = candidate.querySelector(".nav-menu-toggle");
        const label = candidate.querySelector(".nav-trigger")?.textContent.trim() || "navigation";
        const action = isCurrent ? "Close" : "Open";
        toggle?.setAttribute("aria-expanded", String(isCurrent));
        toggle?.setAttribute("aria-label", `${action} ${label} menu`);
        if (toggle?.querySelector(".visually-hidden")) {
          toggle.querySelector(".visually-hidden").textContent = `${action} ${label} menu`;
        }
      });
      nav.classList.add("nav-mega-open");
    };

    mobileToggle?.addEventListener("click", () => {
      setMobileNavigation(!nav.classList.contains("nav-mobile-open"));
    });

    items.forEach((item) => {
      const toggle = item.querySelector(".nav-menu-toggle");
      if (!toggle) return;
      toggle.setAttribute("aria-expanded", "false");
      item.addEventListener("pointerenter", (event) => {
        if (!mobileQuery.matches && event.pointerType !== "touch") ensureMenu(item).catch(error => console.warn("Navigation menu failed to load.", error));
      });
      item.addEventListener("focusin", () => {
        if (!mobileQuery.matches) ensureMenu(item).catch(error => console.warn("Navigation menu failed to load.", error));
      });
      toggle.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (item.classList.contains("is-open") || pendingMenu === item) {
          closeSubmenus();
        } else {
          openMenu(item);
        }
      });
    });

    document.addEventListener("click", (event) => {
      if (!pendingMenu && !nav.classList.contains("nav-mega-open") && !nav.classList.contains("nav-mobile-open")) return;
      if (!event.target.closest(".site-header")) closeMenus();
    });

    navLinks.addEventListener("click", (event) => {
      if (mobileQuery.matches && event.target.closest("a")) closeMenus();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenus();
    });

    window.addEventListener("scroll", () => {
      if (nav.classList.contains("nav-mega-open")) updateMenuTop();
    }, { passive: true });

    mobileQuery.addEventListener?.("change", closeMenus);
  }
  function initBackToTop() {
    if (typeof document.createElement !== "function" || document.querySelector("[data-back-to-top]")) return;
    const button = document.createElement("button");
    button.className = "back-to-top";
    button.type = "button";
    button.hidden = true;
    button.dataset.backToTop = "true";
    button.setAttribute("aria-label", "Back to top");
    button.innerHTML = `<span aria-hidden="true">↑</span>`;
    document.body.append(button);

    let updateFrame = 0;
    let isVisible = false;
    const updateVisibility = () => {
      updateFrame = 0;
      const nextVisible = window.scrollY >= 1100;
      if (nextVisible === isVisible) return;
      isVisible = nextVisible;
      button.hidden = !nextVisible;
    };
    const requestVisibilityUpdate = () => {
      if (!updateFrame) updateFrame = window.requestAnimationFrame(updateVisibility);
    };

    button.addEventListener("click", () => {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
    window.addEventListener("scroll", requestVisibilityUpdate, { passive: true });
    updateVisibility();
  }

  function initMobileExperience() {
    const header = document.querySelector(".site-header");
    if (!header) return;
    const mobileQuery = window.matchMedia("(max-width: 680px)");

    const progress = document.createElement("span");
    progress.className = "reading-progress";
    progress.setAttribute("aria-hidden", "true");
    progress.innerHTML = "<span></span>";
    header.append(progress);

    let scrollFrame = 0;
    const updatePageProgress = () => {
      scrollFrame = 0;
      const scrollable = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const ratio = Math.min(1, Math.max(0, window.scrollY / scrollable));
      progress.style.setProperty("--reading-progress", ratio.toFixed(4));
      header.classList.toggle("is-page-scrolled", window.scrollY > 12);
    };
    const requestPageProgress = () => {
      if (scrollFrame) return;
      scrollFrame = window.requestAnimationFrame(updatePageProgress);
    };

    const rails = [...document.querySelectorAll("[data-mobile-rail]")].map((rail, railIndex) => {
      const items = [...rail.children];
      if (items.length < 2) return null;

      const status = document.createElement("div");
      status.className = "mobile-rail-status";
      status.setAttribute("aria-hidden", "true");
      status.innerHTML = `<span class="mobile-rail-track"><span></span></span><span class="mobile-rail-count">1 / ${items.length}</span>`;
      rail.insertAdjacentElement("afterend", status);
      rail.dataset.mobileRailIndex = String(railIndex + 1);
      rail.tabIndex = 0;

      let railFrame = 0;
      const getActiveIndex = () => {
        const railCenter = rail.getBoundingClientRect().left + rail.clientWidth / 2;
        let activeIndex = 0;
        let nearestDistance = Number.POSITIVE_INFINITY;
        items.forEach((item, index) => {
          const rect = item.getBoundingClientRect();
          const distance = Math.abs(rect.left + rect.width / 2 - railCenter);
          if (distance < nearestDistance) {
            nearestDistance = distance;
            activeIndex = index;
          }
        });
        return activeIndex;
      };
      const updateRail = () => {
        railFrame = 0;
        if (!mobileQuery.matches) return;
        const activeIndex = getActiveIndex();
        const ratio = items.length > 1 ? activeIndex / (items.length - 1) : 0;
        status.style.setProperty("--mobile-rail-progress", ratio.toFixed(4));
        const count = status.querySelector(".mobile-rail-count");
        if (count) count.textContent = `${activeIndex + 1} / ${items.length}`;
        rail.classList.toggle("is-scroll-start", activeIndex === 0);
        rail.classList.toggle("is-scroll-end", activeIndex === items.length - 1);
      };
      const requestRailUpdate = () => {
        if (railFrame) return;
        railFrame = window.requestAnimationFrame(updateRail);
      };
      rail.addEventListener("scroll", requestRailUpdate, { passive: true });
      rail.addEventListener("keydown", (event) => {
        if (!mobileQuery.matches || !["ArrowLeft", "ArrowRight"].includes(event.key)) return;
        event.preventDefault();
        const rtl = document.documentElement.dir === "rtl";
        const forward = event.key === "ArrowRight" ? 1 : -1;
        const targetIndex = Math.min(items.length - 1, Math.max(0, getActiveIndex() + (rtl ? -forward : forward)));
        const railRect = rail.getBoundingClientRect();
        const targetRect = items[targetIndex].getBoundingClientRect();
        const inset = Number.parseFloat(getComputedStyle(rail).paddingLeft) || 0;
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        rail.scrollBy({ left: targetRect.left - railRect.left - inset, behavior: reduceMotion ? "auto" : "smooth" });
      });
      updateRail();
      return { update: updateRail };
    }).filter(Boolean);

    const sync = () => {
      updatePageProgress();
      rails.forEach(({ update }) => update());
    };
    window.addEventListener("scroll", requestPageProgress, { passive: true });
    window.addEventListener("resize", sync, { passive: true });
    mobileQuery.addEventListener?.("change", sync);
    sync();
  }
  initMegaNavigation();
  const experience = () => { initBackToTop(); initMobileExperience(); };
  if ("requestIdleCallback" in window) requestIdleCallback(experience, {timeout: 1000});
  else setTimeout(experience, 0);
})();
(function () {
  const appScriptPath = "/assets/wood-language.js";
  let appPromise = null;

  function loadApp() {
    if (window.WCTWoodLanguageInitialized) return Promise.resolve();
    if (appPromise) return appPromise;

    const existing = document.querySelector(`script[src="${appScriptPath}"]`);
    if (existing) {
      appPromise = new Promise((resolve, reject) => {
        existing.addEventListener("load", resolve, { once: true });
        existing.addEventListener("error", reject, { once: true });
      });
      return appPromise;
    }

    appPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = appScriptPath;
      script.async = true;
      script.addEventListener("load", resolve, { once: true });
      script.addEventListener("error", () => {
        appPromise = null;
        script.remove();
        reject(new Error("Language runtime failed to load"));
      }, {once: true});
      document.head.appendChild(script);
    });
    return appPromise;
  }

  function initContentPage() {
    const selectors = document.querySelectorAll(".language-picker select");
    for (const selector of selectors) {
      if (selector.dataset.boundContentLanguageLoader) continue;
      selector.dataset.boundContentLanguageLoader = "true";
      selector.addEventListener("change", (event) => {
        try { localStorage.setItem("woodcuttool-lang", event.target.value); } catch {}
        const requested = event.target.value;
        const alreadyReady = window.WCTWoodLanguageInitialized;
        loadApp().then(() => {
          if (!alreadyReady) window.WCTWoodLanguage.setLanguage(requested);
        }).catch((error) => console.warn("Language runtime failed to load.", error));
      });
    }

    let savedLanguage = "en";
    try { savedLanguage = localStorage.getItem("woodcuttool-lang") || "en"; } catch {}
    if (savedLanguage !== "en") {
      loadApp().catch((error) => console.warn("Language runtime failed to load.", error));
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initContentPage, { once: true });
  } else {
    initContentPage();
  }
})();
