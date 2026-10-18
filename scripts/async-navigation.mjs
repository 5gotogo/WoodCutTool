// Shared by the general and Wood navigation bundles. A pending expansion must
// never reopen a menu after Escape, an outside click, or another expansion.
export function asyncNavigation(source, ensureBody) {
  const start = source.indexOf("const ensureMenu = (item) => {");
  const end = source.indexOf("const openMenu = (item) => {", start);
  if (start < 0 || end < 0) throw new Error("Missing shared navigation boundaries");
  return (source.slice(0, start) + `const ensureMenu = async (item) => {
      if (item.querySelector(".mega-menu")) return;
      ${ensureBody}
    };

    ` + source.slice(end))
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
}
