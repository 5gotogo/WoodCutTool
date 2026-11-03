export function appStoreRedirect(request, destination) {
  if (request.cf?.country === "CN") {
    destination.pathname = destination.pathname.replace(/^\/us\//, "/cn/");
  }
  return new Response(null, {
    status: 302,
    headers: { Location: destination.href, "Cache-Control": "private, no-store" },
  });
}
