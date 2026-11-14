export const ductLabChinaProductPath = "/cn/app/ductlab-%E9%A3%8E%E7%AE%A1%E6%94%BE%E6%A0%B7%E4%B8%8E%E4%BC%B0%E7%AE%97/id6804225465";

async function isMissingFromStorefront(destination) {
  const productPage = new URL(destination);
  productPage.search = "";
  try {
    const response = await fetch(productPage, {
      signal: AbortSignal.timeout(1500),
    });
    if (response.body) await response.body.cancel();
    return response.status === 404;
  } catch {
    // A failed availability check leaves the regional destination in place.
    return false;
  }
}

export async function appStoreRedirect(request, destination) {
  if (request.cf?.country === "CN") {
    const chinaDestination = new URL(destination);
    chinaDestination.pathname = chinaDestination.pathname.endsWith("/id6804225465")
      ? ductLabChinaProductPath
      : chinaDestination.pathname.replace(/^\/us\//, "/cn/");
    if (!(await isMissingFromStorefront(chinaDestination))) destination = chinaDestination;
  }

  return new Response(null, {
    status: 302,
    headers: { Location: destination.href, "Cache-Control": "private, no-store" },
  });
}
