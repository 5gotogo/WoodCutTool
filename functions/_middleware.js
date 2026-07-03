export async function onRequest(context) {
  const url = new URL(context.request.url);

  if (url.hostname === "www.woodcuttool.com") {
    url.hostname = "woodcuttool.com";
    return Response.redirect(url.toString(), 301);
  }

  if (url.hostname === "woodcuttool.com" && url.pathname === "/" && url.searchParams.get("q") === "{search_term_string}") {
    url.search = "";
    return Response.redirect(url.toString(), 301);
  }

  return context.next();
}
