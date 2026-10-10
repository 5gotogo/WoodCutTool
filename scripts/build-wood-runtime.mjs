import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import vm from "node:vm";

const root = resolve(import.meta.dirname, "..");
const chrome = readFileSync(join(root, "assets/site-chrome.js"), "utf8");
function between(source, start, end) {
  const a = source.indexOf(start), b = source.indexOf(end, a + start.length);
  if (a < 0 || b < 0) throw new Error(`Missing Wood runtime boundary: ${start}`);
  return source.slice(a, b).trim();
}

// Use the same header, footer and menu definitions as the rest of the site.
// Evaluate only their pure rendering functions, never browser initialization.
const boundary = chrome.lastIndexOf("\n  renderSiteChrome();");
if (boundary < 0) throw new Error("Missing shared chrome initialization boundary");
const context = vm.createContext({ window: { location: { pathname: "/wood/" } } });
vm.runInContext(chrome.slice(0, boundary) + `
  globalThis.renderWoodChrome = pathname => {
    window.location.pathname = pathname;
    deferredMenus.clear();
    const headerHtml = header();
    return {header: headerHtml, footer: footer(), menus: Object.fromEntries(
      [...deferredMenus].map(([key, render]) => [key, typeof render === "function" ? render() : render])
    )};
  };
})();`, context);

export function renderWoodChrome(pathname) {
  return context.renderWoodChrome(pathname);
}

export function woodRuntimeSource() {
  let navigation = between(chrome, "function initMegaNavigation()", "function initBackToTop()");
  const ensureStart = navigation.indexOf("const ensureMenu = (item) => {");
  const ensureEnd = navigation.indexOf("const openMenu = (item) => {", ensureStart);
  if (ensureStart < 0 || ensureEnd < 0) throw new Error("Missing shared navigation menu boundaries");
  navigation = navigation.slice(0, ensureStart) + `const ensureMenu = async (item) => {
      if (item.querySelector(".mega-menu")) return;
      const menus = await loadMenus();
      const markup = menus[item.dataset.menuKey || ""];
      if (!markup) throw new Error("Missing navigation menu");
      if (!item.querySelector(".mega-menu")) item.insertAdjacentHTML("beforeend", markup);
    };

    ` + navigation.slice(ensureEnd);
  navigation = navigation
    .replace('const nav = document.querySelector(".nav");', 'let pendingMenu = null;\n    let menuRequest = 0;\n    const nav = document.querySelector(".nav");')
    .replace("const closeSubmenus = () => {", "const closeSubmenus = () => {\n      menuRequest += 1;\n      pendingMenu = null;")
    .replace("const openMenu = (item) => {\n      ensureMenu(item);", `const openMenu = async (item) => {
      pendingMenu = item;
      const request = ++menuRequest;
      try { await ensureMenu(item); } catch (error) {
        if (request === menuRequest) pendingMenu = null;
        console.warn("Navigation menu failed to load.", error);
        return;
      }
      if (request !== menuRequest) return;
      pendingMenu = null;`)
    .replace(/(?<!await )ensureMenu\(item\);/g, 'ensureMenu(item).catch(error => console.warn("Navigation menu failed to load.", error));')
    .replace('if (!nav.classList.contains("nav-mega-open") && !nav.classList.contains("nav-mobile-open")) return;', 'if (!pendingMenu && !nav.classList.contains("nav-mega-open") && !nav.classList.contains("nav-mobile-open")) return;')
    .replace('if (item.classList.contains("is-open")) {', 'if (item.classList.contains("is-open") || pendingMenu === item) {');
  if (!navigation.includes("await ensureMenu(item)") || navigation.includes("deferredMenus.get")) throw new Error("Wood navigation extraction is stale");
  const experiences = between(chrome, "function initBackToTop()", "renderSiteChrome();");
  const languageLoader = readFileSync(join(root, "assets/content-page.js"), "utf8")
    .replace('"/assets/app.js"', '"/assets/wood-language.js"')
    .replaceAll("WCTAppInitialized", "WCTWoodLanguageInitialized")
    .replace('script.addEventListener("error", reject, { once: true });', `script.addEventListener("error", () => {
        appPromise = null;
        script.remove();
        reject(new Error("Language runtime failed to load"));
      }, {once: true});`)
    .replace('loadApp().catch((error) => console.warn("Language runtime failed to load.", error));', `const requested = event.target.value;
        const alreadyReady = window.WCTWoodLanguageInitialized;
        loadApp().then(() => {
          if (!alreadyReady) window.WCTWoodLanguage.setLanguage(requested);
        }).catch((error) => console.warn("Language runtime failed to load.", error));`);
  return `// Generated from shared site-chrome.js/content-page.js by scripts/build-wood-runtime.mjs.
(function () {
  // Keep the reserved header height, and mount after the text-led document
  // parses. Streaming a full header ahead of the lead delayed its paint.
  const header = document.querySelector("[data-site-header]");
  if (header) header.outerHTML = ${JSON.stringify(renderWoodChrome("/wood/").header)};
  let menusPromise = null;
  function loadMenus() {
    if (!menusPromise) menusPromise = fetch("/assets/wood-menus.json")
      .then(response => { if (!response.ok) throw new Error("HTTP " + response.status); return response.json(); })
      .catch(error => { menusPromise = null; throw error; });
    return menusPromise;
  }
  ${navigation}
  ${experiences}
  initMegaNavigation();
  const experience = () => { initBackToTop(); initMobileExperience(); };
  if ("requestIdleCallback" in window) requestIdleCallback(experience, {timeout: 1000});
  else setTimeout(experience, 0);
})();
${languageLoader.trimEnd()}
`;
}

export function woodLanguageSource() {
  const app = readFileSync(join(root, "assets/app.js"), "utf8");
  const dictionaries = vm.createContext({});
  vm.runInContext(app.slice(0, app.indexOf("const originalTextNodes =")) + "\nglobalThis.data = {translations, LANGUAGE_OPTIONS};", dictionaries);
  const html = readdirSync(join(root, "wood"), { recursive: true }).filter(file => file.endsWith(".html"))
    .map(file => readFileSync(join(root, "wood", file), "utf8").replace(/<(?:style|script)\b[^>]*>[\s\S]*?<\/(?:style|script)>/gi, ""));
  const source = [chrome, ...html].join("\n");
  const escaped = key => key.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
  const translations = Object.fromEntries(Object.entries(dictionaries.data.translations).map(([lang, values]) => [lang,
    Object.fromEntries(Object.entries(values).filter(([key]) => source.includes(key) || source.includes(escaped(key))))
  ]));
  // Keep the shared translation behavior and all language options. Wood pages
  // never use Blog's remote translation provider or calculator initialization.
  let i18n = between(app, "const originalTextNodes =", "function initHeroCutPlanner()");
  i18n = i18n.replace('const getActiveLang = () => normalizeLang(localStorage.getItem("woodcuttool-lang") || "en");',
    'const getActiveLang = () => { try { return normalizeLang(localStorage.getItem("woodcuttool-lang") || "en"); } catch { return normalizeLang(document.documentElement.lang); } };')
    .replace('localStorage.setItem("woodcuttool-lang", nextLang);', 'try { localStorage.setItem("woodcuttool-lang", nextLang); } catch {}');
  return `// Generated Wood-only translations from assets/app.js by scripts/build-wood-runtime.mjs.
(function () {
  const LANGUAGE_OPTIONS = ${JSON.stringify(dictionaries.data.LANGUAGE_OPTIONS)};
  const translations = ${JSON.stringify(translations)};
  ${i18n}
  window.WCTWoodLanguage = Object.freeze({setLanguage});
  function init() {
    if (window.WCTWoodLanguageInitialized) return;
    window.WCTWoodLanguageInitialized = true;
    initI18n();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, {once: true});
  else init();
})();
`;
}

export function buildWoodRuntime() {
  for (const [file, source] of [
    ["wood-page.js", woodRuntimeSource()],
    ["wood-language.js", woodLanguageSource()],
    ["wood-menus.json", JSON.stringify(renderWoodChrome("/wood/").menus)],
  ]) {
    writeFileSync(join(root, "assets", file), source + (source.endsWith("\n") ? "" : "\n"));
    console.log(`Built ${file}: ${Buffer.byteLength(source)} bytes.`);
  }
}
