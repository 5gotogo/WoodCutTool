export const conversionEventSchemas = Object.freeze({
  app_store_click: {
    required: ["source", "placement"],
    allowed: ["source", "placement", "label", "cluster", "app"],
  },
  calculator_complete: {
    required: ["calculator"],
    allowed: ["source", "calculator", "boards", "waste_percent", "rejected_count", "sheets", "baseline_sheets", "yield_percent", "estimated_cost", "estimated_savings", "cluster", "source_route", "result_class"],
  },
  calculator_submit: {
    required: ["calculator"],
    allowed: ["calculator", "cluster", "source_route"],
  },
  cta_impression: {
    required: ["source"],
    allowed: ["source", "variant", "cluster", "placement", "destination_type", "destination_route"],
  },
  image_download: {
    required: ["source"],
    allowed: ["source", "sheets", "yield_percent", "cluster", "source_route", "asset_route"],
  },
  topic_action_click: {
    required: ["cluster", "source_route", "placement", "destination_type", "destination_route"],
    allowed: ["cluster", "source_route", "placement", "destination_type", "destination_route"],
  },
  pillar_guide_click: {
    required: ["cluster", "source_route", "destination_route"],
    allowed: ["cluster", "source_route", "placement", "destination_type", "destination_route"],
  },
  worksheet_download: {
    required: ["cluster", "source_route", "asset_route"],
    allowed: ["cluster", "source_route", "placement", "asset_route"],
  },
  checklist_download: {
    required: ["cluster", "source_route", "asset_route"],
    allowed: ["cluster", "source_route", "placement", "asset_route"],
  },
  example_download: {
    required: ["cluster", "source_route", "asset_route"],
    allowed: ["cluster", "source_route", "placement", "asset_route"],
  },
  research_download: {
    required: ["cluster", "source_route", "dataset", "version"],
    allowed: ["cluster", "source_route", "placement", "asset_route", "dataset", "version"],
  },
  calculator_start: {
    required: ["cluster", "source_route", "calculator"],
    allowed: ["cluster", "source_route", "placement", "calculator"],
  },
  calculator_result: {
    required: ["cluster", "source_route", "calculator", "result_class"],
    allowed: ["cluster", "source_route", "placement", "calculator", "result_class"],
  },
  app_store_outbound: {
    required: ["cluster", "source_route", "placement", "app"],
    allowed: ["cluster", "source_route", "placement", "app", "destination_route"],
  },
});

const blockedDimensionPattern = /(email|phone|name|address|contact|document|dimension|measurement|note|query|referrer|local_storage|project_content|csv_row)/i;

function safeValue(value) {
  if (typeof value === "number" && Number.isFinite(value)) return Math.round(value * 100) / 100;
  if (typeof value === "boolean") return value;
  if (typeof value === "string") return value.slice(0, 180);
  return undefined;
}

export function sanitizeConversionDetails(event, value) {
  const schema = conversionEventSchemas[event];
  if (!schema) return { ok: false, error: "unknown-event", details: {} };
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return { ok: false, error: "invalid-details", details: {} };
  }

  const allowed = new Set(schema.allowed);
  const details = {};
  for (const [key, item] of Object.entries(value)) {
    if (!/^[a-z][a-z0-9_]{0,31}$/.test(key) || blockedDimensionPattern.test(key)) {
      return { ok: false, error: `blocked-dimension:${key}`, details: {} };
    }
    if (!allowed.has(key)) return { ok: false, error: `unknown-dimension:${key}`, details: {} };
    const sanitized = safeValue(item);
    if (sanitized === undefined) return { ok: false, error: `invalid-dimension:${key}`, details: {} };
    details[key] = sanitized;
  }
  for (const key of schema.required) {
    if (!(key in details) || details[key] === "") return { ok: false, error: `missing-dimension:${key}`, details: {} };
  }
  return { ok: true, error: null, details };
}
