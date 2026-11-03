import { appStoreRedirect } from "../lib/app-store.js";

export function onRequest({ request }) {
  if (request.method !== "GET") {
    return new Response(null, { status: 405, headers: { Allow: "GET" } });
  }

  const params = new URL(request.url).searchParams;
  const path = params.get("product") || "";
  if (!/^\/us\/app\/(?:[a-z0-9-]+\/)?id\d+$/i.test(path)) {
    return new Response(null, { status: 400 });
  }

  const destination = new URL(path, "https://apps.apple.com");
  destination.search = params.get("query") || "";
  return appStoreRedirect(request, destination);
}
