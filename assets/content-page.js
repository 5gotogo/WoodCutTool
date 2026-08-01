(function () {
  const appScriptPath = "/assets/app.js";
  let appPromise = null;

  function loadApp() {
    if (window.WCTAppInitialized) return Promise.resolve();
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
      script.addEventListener("error", reject, { once: true });
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
        localStorage.setItem("woodcuttool-lang", event.target.value);
        loadApp().catch((error) => console.warn("Language runtime failed to load.", error));
      });
    }

    const savedLanguage = localStorage.getItem("woodcuttool-lang") || "en";
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
