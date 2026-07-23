const allowedEvents = new Set([
  "app_store_click",
  "calculator_complete",
  "calculator_submit",
  "cta_impression",
  "image_download",
]);

function validToken(value, fallback = "website") {
  const token = String(value || fallback)
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 30);
  return token || fallback;
}

function safeDetails(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const result = {};
  for (const [key, item] of Object.entries(value).slice(0, 12)) {
    if (!/^[a-z][a-z0-9_]{0,31}$/.test(key)) continue;
    if (typeof item === "number" && Number.isFinite(item)) {
      result[key] = Math.round(item * 100) / 100;
    } else if (typeof item === "boolean") {
      result[key] = item;
    } else if (typeof item === "string") {
      result[key] = item.slice(0, 80);
    }
  }
  return result;
}

export async function onRequest(context) {
  const request = context.request;
  if (request.method !== "POST") {
    return new Response(null, {
      status: 405,
      headers: { Allow: "POST" },
    });
  }
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > 4096) return new Response(null, { status: 413 });

  let input;
  try {
    input = await request.json();
  } catch {
    return new Response(null, { status: 400 });
  }

  if (!allowedEvents.has(input?.event)) return new Response(null, { status: 400 });

  const record = {
    type: "conversion_event",
    event: input.event,
    source: validToken(input.source),
    path: String(input.path || "/").slice(0, 180),
    device: validToken(input.device, "unknown"),
    details: safeDetails(input.details),
    timestamp: /^\d{4}-\d{2}-\d{2}T/.test(input.timestamp || "")
      ? input.timestamp
      : new Date().toISOString(),
  };

  console.log(JSON.stringify(record));
  return new Response(null, {
    status: 204,
    headers: {
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex",
    },
  });
}
