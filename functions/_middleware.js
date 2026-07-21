export async function onRequest(context) {
  const url = new URL(context.request.url);

  if (url.hostname === "www.woodcuttool.com") {
    url.hostname = "woodcuttool.com";
    return Response.redirect(url.toString(), 301);
  }

  if (url.hostname === "woodcuttool.com" && url.pathname === "/" && url.searchParams.get("q") === "{search_term_string}") {
    return new Response("This invalid search template URL is gone.", {
      status: 410,
      headers: {
        "Cache-Control": "public, max-age=86400",
        "Content-Type": "text/plain; charset=utf-8",
        "X-Robots-Tag": "noindex"
      }
    });
  }

  return context.next();
}
