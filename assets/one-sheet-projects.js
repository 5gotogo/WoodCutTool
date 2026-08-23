(() => {
  const root = document.querySelector("[data-one-sheet-hub]");
  if (!root) return;

  const grid = root.querySelector("[data-one-sheet-grid]");
  const cards = [...root.querySelectorAll("[data-one-sheet-card]")];
  const search = root.querySelector("[data-one-sheet-search]");
  const category = root.querySelector("[data-one-sheet-category]");
  const yieldBand = root.querySelector("[data-one-sheet-yield-band]");
  const partBand = root.querySelector("[data-one-sheet-part-band]");
  const sort = root.querySelector("[data-one-sheet-sort]");
  const status = root.querySelector("[data-one-sheet-status]");
  const empty = root.querySelector("[data-one-sheet-empty]");
  const shortlist = root.querySelector("[data-one-sheet-shortlist]");
  const shortlistLinks = root.querySelector("[data-one-sheet-shortlist-links]");
  const storageKey = "woodcuttool:one-sheet-projects:saved:v1";
  const originalOrder = new Map(cards.map((card, index) => [card.dataset.slug, index]));
  let storageAvailable = true;
  let saved = new Set();

  try {
    const value = JSON.parse(window.localStorage.getItem(storageKey) || "[]");
    saved = new Set(Array.isArray(value) ? value.filter((slug) => originalOrder.has(slug)) : []);
  } catch {
    storageAvailable = false;
  }

  function saveShortlist() {
    if (!storageAvailable) return;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify([...saved]));
    } catch {
      storageAvailable = false;
    }
  }

  function renderShortlist() {
    cards.forEach((card) => {
      const button = card.querySelector("[data-one-sheet-save]");
      const active = saved.has(card.dataset.slug);
      button.setAttribute("aria-pressed", String(active));
      button.textContent = active ? "Saved to shortlist" : "Save to shortlist";
      button.disabled = !storageAvailable;
      if (!storageAvailable) button.title = "Local storage is unavailable in this browser.";
    });

    shortlistLinks.replaceChildren();
    [...saved]
      .sort((a, b) => originalOrder.get(a) - originalOrder.get(b))
      .forEach((slug) => {
        const card = cards.find((item) => item.dataset.slug === slug);
        if (!card) return;
        const link = document.createElement("a");
        link.href = `/examples/${slug}-cut-list/`;
        link.textContent = card.dataset.name;
        shortlistLinks.append(link);
      });
    shortlist.hidden = saved.size === 0;
  }

  function visibleCards() {
    return cards.filter((card) => !card.hidden);
  }

  function updateUrl() {
    const params = new URLSearchParams();
    if (search.value.trim()) params.set("q", search.value.trim());
    if (category.value) params.set("category", category.value);
    if (yieldBand.value) params.set("yield", yieldBand.value);
    if (partBand.value) params.set("parts", partBand.value);
    if (sort.value !== "featured") params.set("sort", sort.value);
    const next = `${window.location.pathname}${params.size ? `?${params}` : ""}${window.location.hash}`;
    window.history.replaceState(null, "", next);
  }

  function sortCards() {
    const sorted = [...cards].sort((a, b) => {
      if (sort.value === "yield-desc") return Number(b.dataset.yield) - Number(a.dataset.yield);
      if (sort.value === "yield-asc") return Number(a.dataset.yield) - Number(b.dataset.yield);
      if (sort.value === "parts-asc") return Number(a.dataset.parts) - Number(b.dataset.parts) || a.dataset.name.localeCompare(b.dataset.name);
      if (sort.value === "name") return a.dataset.name.localeCompare(b.dataset.name);
      return originalOrder.get(a.dataset.slug) - originalOrder.get(b.dataset.slug);
    });
    sorted.forEach((card) => grid.append(card));
  }

  function applyFilters() {
    const query = search.value.trim().toLowerCase();
    cards.forEach((card) => {
      card.hidden = Boolean(
        (query && !card.dataset.search.includes(query)) ||
        (category.value && card.dataset.category !== category.value) ||
        (yieldBand.value && card.dataset.yieldBand !== yieldBand.value) ||
        (partBand.value && card.dataset.partBand !== partBand.value)
      );
    });
    sortCards();
    const count = visibleCards().length;
    status.textContent = count === cards.length ? `Showing all ${cards.length} projects.` : `Showing ${count} of ${cards.length} projects.`;
    empty.hidden = count !== 0;
    grid.hidden = count === 0;
    updateUrl();
  }

  function resetFilters() {
    search.value = "";
    category.value = "";
    yieldBand.value = "";
    partBand.value = "";
    sort.value = "featured";
    applyFilters();
    search.focus();
  }

  function loadParams() {
    const params = new URLSearchParams(window.location.search);
    search.value = params.get("q") || "";
    category.value = params.get("category") || "";
    yieldBand.value = params.get("yield") || "";
    partBand.value = params.get("parts") || "";
    sort.value = params.get("sort") || "featured";
    if (!sort.value) sort.value = "featured";
  }

  [search, category, yieldBand, partBand, sort].forEach((control) => control.addEventListener(control === search ? "input" : "change", applyFilters));
  root.querySelector("[data-one-sheet-reset]").addEventListener("click", resetFilters);
  root.querySelector("[data-one-sheet-empty-reset]").addEventListener("click", resetFilters);
  root.querySelector("[data-one-sheet-random]").addEventListener("click", () => {
    const candidates = visibleCards();
    if (!candidates.length) return;
    const card = candidates[Math.floor(Math.random() * candidates.length)];
    card.classList.remove("is-random-pick");
    requestAnimationFrame(() => card.classList.add("is-random-pick"));
    card.scrollIntoView({ behavior: "smooth", block: "center" });
    card.querySelector("h2 a")?.focus({ preventScroll: true });
  });

  cards.forEach((card) => card.querySelector("[data-one-sheet-save]").addEventListener("click", () => {
    const slug = card.dataset.slug;
    if (saved.has(slug)) saved.delete(slug);
    else saved.add(slug);
    saveShortlist();
    renderShortlist();
  }));
  root.querySelector("[data-one-sheet-clear-saved]").addEventListener("click", () => {
    saved.clear();
    saveShortlist();
    renderShortlist();
  });

  loadParams();
  renderShortlist();
  applyFilters();
})();

