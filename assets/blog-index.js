(function () {
  function initBlogDirectory() {
    const root = document.querySelector("[data-blog-index]");
    if (!root) return;
    const input = root.querySelector("[data-blog-search-input]");
    if (!input) return;

    const status = root.querySelector("[data-blog-search-status]");
    const empty = root.querySelector("[data-blog-search-empty]");
    const featured = root.querySelector("[data-blog-featured]");
    const directoryPanel = root.querySelector("[data-blog-directory-panel]");
    const directoryResults = root.querySelector("[data-blog-search-results]");
    const cards = [...root.querySelectorAll("[data-blog-card]")];
    const categoryLinks = [...root.querySelectorAll("[data-blog-category-link]")];
    const sections = [...root.querySelectorAll("[data-blog-section]")];
    const blogMain = root.querySelector(".blog-main");
    const mobileQuery = window.matchMedia("(max-width: 680px)");
    const sectionCards = cards.filter((card) => !featured?.contains(card));
    const normalize = (value) => String(value || "").toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim();
    const cardHaystacks = new WeakMap(cards.map((element) => [element, normalize(element.dataset.blogSearch)]));
    const totalArticles = Number(root.dataset.blogCount || 0);
    let activeCategory = "";
    let mobileVisibleLimit = 24;
    let filterFrame = 0;
    let filterRevision = 0;
    let searchIndexPromise = null;

    const mobilePager = document.createElement("div");
    mobilePager.className = "blog-mobile-pager";
    mobilePager.hidden = true;
    mobilePager.innerHTML = '<p data-blog-page-status></p><button class="button secondary" type="button">More</button>';
    blogMain?.append(mobilePager);
    const mobilePagerStatus = mobilePager.querySelector("[data-blog-page-status]");
    const mobilePagerButton = mobilePager.querySelector("button");

    categoryLinks.forEach((link) => {
      const count = link.querySelector("[data-blog-category-count]");
      if (count) count.dataset.originalBlogCategoryCount = count.textContent;
    });

    const matchesCard = (element, terms) => terms.every((term) => (cardHaystacks.get(element) || "").includes(term));
    const setVisible = (element, visible) => {
      element.hidden = !visible;
      element.style.display = visible ? "" : "none";
    };

    const loadSearchIndex = () => {
      if (!searchIndexPromise) {
        searchIndexPromise = fetch("/assets/blog-search-index.json")
          .then((response) => {
            if (!response.ok) throw new Error(`Blog search index failed: ${response.status}`);
            return response.json();
          });
      }
      return searchIndexPromise;
    };

    const renderResults = (results) => {
      if (!directoryResults) return;
      directoryResults.replaceChildren();
      for (const result of results.slice(0, 80)) {
        const link = document.createElement("a");
        link.href = result.url;
        const number = document.createElement("span");
        number.textContent = "→";
        const title = document.createElement("strong");
        title.textContent = result.title;
        const category = document.createElement("em");
        category.textContent = result.category;
        link.append(number, title, category);
        directoryResults.append(link);
      }
      if (results.length > 80) {
        const archive = document.createElement("a");
        archive.href = "/blog/archive/";
        archive.innerHTML = `<span>+</span><strong>Browse all results in the complete archive</strong><em>${results.length - 80} more matches</em>`;
        directoryResults.append(archive);
      }
    };

    function applyMobilePagination() {
      if (!mobileQuery.matches) {
        mobilePager.hidden = true;
        return;
      }
      const eligible = sectionCards.filter((card) => card.dataset.blogFilterMatch !== "false");
      eligible.forEach((card, index) => setVisible(card, index < mobileVisibleLimit));
      sections.forEach((section) => setVisible(section, [...section.querySelectorAll("[data-blog-card]")].some((card) => !card.hidden)));
      const shown = Math.min(mobileVisibleLimit, eligible.length);
      mobilePager.hidden = eligible.length === 0;
      if (mobilePagerStatus) mobilePagerStatus.textContent = `${activeCategory ? `${activeCategory} · ` : ""}${shown} / ${eligible.length}`;
      if (mobilePagerButton) mobilePagerButton.hidden = shown >= eligible.length;
    }

    async function applyFilter() {
      filterFrame = 0;
      const revision = ++filterRevision;
      const terms = normalize(input.value).split(" ").filter(Boolean);
      const visibleByCategory = new Map();

      cards.forEach((card) => {
        const matched = (!activeCategory || card.dataset.blogCategory === activeCategory) && matchesCard(card, terms);
        card.dataset.blogFilterMatch = String(matched);
        setVisible(card, matched);
      });

      let results = [];
      if (terms.length || activeCategory) {
        try {
          const index = await loadSearchIndex();
          if (revision !== filterRevision) return;
          results = index.filter((item) => {
            const categoryMatches = !activeCategory || item.category === activeCategory;
            const haystack = normalize(item.search);
            return categoryMatches && terms.every((term) => haystack.includes(term));
          });
          results.forEach((item) => visibleByCategory.set(item.category, (visibleByCategory.get(item.category) || 0) + 1));
          renderResults(results);
        } catch (error) {
          console.warn(error);
          if (status) status.textContent = "Search is temporarily unavailable.";
        }
      }
      categoryLinks.forEach((link) => {
        const category = link.dataset.blogCategoryLink || "";
        const count = terms.length || activeCategory
          ? visibleByCategory.get(category) || 0
          : Number(link.querySelector("[data-blog-category-count]")?.dataset.originalBlogCategoryCount || 0);
        const countElement = link.querySelector("[data-blog-category-count]");
        if (countElement) countElement.textContent = String(count);
        setVisible(link, count > 0);
      });
      sections.forEach((section) => setVisible(section, [...section.querySelectorAll("[data-blog-card]")].some((card) => !card.hidden)));
      if (featured) setVisible(featured, [...featured.querySelectorAll("[data-blog-card]")].some((card) => !card.hidden));
      if (status) status.textContent = terms.length || activeCategory ? `${results.length} matches${results.length > 80 ? " · showing first 80" : ""}` : `${totalArticles} articles`;
      if (empty) empty.hidden = !(terms.length || activeCategory) || results.length > 0;
      applyMobilePagination();
    }

    const scheduleFilter = () => {
      if (!filterFrame) filterFrame = requestAnimationFrame(applyFilter);
    };

    try {
      const query = new URLSearchParams(location.search).get("q");
      if (query) {
        input.value = query;
        if (directoryPanel) directoryPanel.open = true;
      }
    } catch {}

    input.addEventListener("input", () => {
      activeCategory = "";
      mobileVisibleLimit = 24;
      scheduleFilter();
    });
    input.addEventListener("focus", () => {
      loadSearchIndex().catch(() => {});
    }, { once: true });
    categoryLinks.forEach((link) => link.addEventListener("click", () => {
      if (!mobileQuery.matches) return;
      activeCategory = link.dataset.blogCategoryLink || "";
      input.value = "";
      mobileVisibleLimit = 24;
      scheduleFilter();
    }));
    mobilePagerButton?.addEventListener("click", () => {
      mobileVisibleLimit += 24;
      applyMobilePagination();
    });
    mobileQuery.addEventListener?.("change", () => {
      mobileVisibleLimit = 24;
      scheduleFilter();
    });
    applyFilter();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initBlogDirectory, { once: true });
  else initBlogDirectory();
})();
