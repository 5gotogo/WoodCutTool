import { conversionEventSchemas, sanitizeConversionDetails } from "../lib/conversion-event-schema.js";

function validToken(value, fallback = "website") {
  const token = String(value || fallback)
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 30);
  return token || fallback;
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

  if (!conversionEventSchemas[input?.event]) return new Response(null, { status: 400 });
  const sanitized = sanitizeConversionDetails(input.event, input.details);
  if (!sanitized.ok) return new Response(null, { status: 400 });

  const record = {
    type: "conversion_event",
    event: input.event,
    source: validToken(input.source),
    path: String(input.path || "/").slice(0, 180),
    device: validToken(input.device, "unknown"),
    details: sanitized.details,
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
