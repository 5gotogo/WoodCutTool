(function () {
  function initDirectorySections() {
    const sections = [...document.querySelectorAll(".template-category-section")];
    if (!sections.length) return;
    const mobileQuery = window.matchMedia("(max-width: 680px)");

    const entries = sections.map((section, index) => {
      const heading = section.querySelector(":scope > .template-category-heading");
      const content = section.querySelector(":scope > .grid.tools");
      const title = heading?.querySelector("h2")?.textContent.trim() || `Section ${index + 1}`;
      if (!heading || !content) return null;
      if (!content.id) content.id = `directory-section-${section.id || index + 1}`;

      const button = document.createElement("button");
      button.className = "learn-section-toggle";
      button.type = "button";
      button.setAttribute("aria-controls", content.id);
      button.innerHTML = '<span aria-hidden="true"></span>';
      heading.append(button);

      const setExpanded = (expanded) => {
        content.hidden = !expanded;
        section.classList.toggle("is-expanded", expanded);
        button.setAttribute("aria-expanded", String(expanded));
        button.setAttribute("aria-label", `${expanded ? "Hide" : "Show"} ${title}`);
      };

      button.addEventListener("click", () => {
        section.dataset.directoryUserToggled = "true";
        setExpanded(button.getAttribute("aria-expanded") !== "true");
      });
      return { section, content, button, setExpanded, index };
    }).filter(Boolean);

    const sync = () => {
      entries.forEach(({ section, content, button, setExpanded, index }) => {
        if (!mobileQuery.matches) {
          content.hidden = false;
          button.hidden = true;
          section.classList.remove("is-expanded");
          return;
        }
        button.hidden = false;
        if (!section.dataset.directoryUserToggled) {
          setExpanded(index === 0 || Boolean(location.hash && `#${section.id}` === location.hash));
        }
      });
    };

    mobileQuery.addEventListener?.("change", sync);
    window.addEventListener("hashchange", sync);
    sync();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initDirectorySections, { once: true });
  else initDirectorySections();
})();
