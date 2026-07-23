const appStoreUrl = "https://apps.apple.com/us/app/cutlist-plywood-optimizer/id6768171871";

function token(value, fallback) {
  const result = String(value || fallback)
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 30);
  return result || fallback;
}

export function onRequest(context) {
  if (context.request.method !== "GET") {
    return new Response(null, {
      status: 405,
      headers: { Allow: "GET" },
    });
  }
  const requestUrl = new URL(context.request.url);
  const source = token(requestUrl.searchParams.get("source"), "website");
  const placement = token(requestUrl.searchParams.get("placement"), "content");
  const destination = new URL(appStoreUrl);
  destination.searchParams.set("ct", source);
  destination.searchParams.set("mt", "8");

  const providerToken = String(context.env.APPLE_PROVIDER_TOKEN || "").trim();
  if (/^\d+$/.test(providerToken)) destination.searchParams.set("pt", providerToken);

  console.log(JSON.stringify({
    type: "app_store_redirect",
    app: "cutlist",
    source,
    placement,
    timestamp: new Date().toISOString(),
  }));

  return Response.redirect(destination.toString(), 302);
}
