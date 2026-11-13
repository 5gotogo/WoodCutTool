export const storageKey = "wct-furniture-fit-v1";
export const maxStops = 30;
export const maxDimension = 100000;

export const kinds = {
  opening: { label: "Door or opening", axes: ["width", "height"] },
  straight: { label: "Straight passage", axes: ["width", "height"] },
  lift: { label: "Lift interior", axes: ["width", "height", "depth"] },
  placement: { label: "Final recess", axes: ["width", "height", "depth"] },
  turn: { label: "Turn or landing", axes: [] },
  stairs: { label: "Stair flight", axes: [] }
};

export const orientations = {
  face: { label: "Upright, width across", axes: ["width", "height", "depth"] },
  side: { label: "Upright, depth across", axes: ["depth", "height", "width"] },
  endFace: { label: "On end, height across", axes: ["height", "width", "depth"] },
  endSide: { label: "On end, depth across", axes: ["depth", "width", "height"] },
  backFace: { label: "On back, width across", axes: ["width", "depth", "height"] },
  backEnd: { label: "On back, height across", axes: ["height", "depth", "width"] }
};

export const emptyStop = () => ({ name: "", kind: "opening", orientation: "face", width: null, height: null, depth: null, note: "" });

export function samplePlan() {
  return {
    version: 1, unit: "mm", name: "Hall cabinet, wrapped", width: 920, height: 1480, depth: 440, allowance: 20,
    stops: [
      { ...emptyStop(), name: "Building entry", orientation: "side", width: 820, height: 2040 },
      { ...emptyStop(), name: "Lift opening", orientation: "side", width: 800, height: 2000 },
      { ...emptyStop(), name: "Lift interior", kind: "lift", orientation: "side", width: 1100, height: 2200, depth: 1400 },
      { ...emptyStop(), name: "Hall corner", kind: "turn", note: "Measure both hall legs and photograph the inside corner. Confirm the swept path on site." },
      { ...emptyStop(), name: "Cabinet recess", kind: "placement", width: 955, height: 1520, depth: 455, note: "Check the wall and baseboard at the rear." }
    ]
  };
}

const dimension = (value) => value === null || (Number.isFinite(value) && value > 0 && value <= maxDimension);
const shortText = (value, max) => typeof value === "string" && value.length <= max;

export function validPlan(plan) {
  return Boolean(plan && plan.version === 1 && ["mm", "in"].includes(plan.unit) &&
    shortText(plan.name, 100) && [plan.width, plan.height, plan.depth].every(dimension) &&
    (plan.allowance === null || plan.allowance === 0 || dimension(plan.allowance)) &&
    Array.isArray(plan.stops) && plan.stops.length <= maxStops &&
    plan.stops.every(stop => stop && Object.hasOwn(kinds, stop.kind) && Object.hasOwn(orientations, stop.orientation) &&
      shortText(stop.name, 100) && shortText(stop.note, 500) && [stop.width, stop.height, stop.depth].every(dimension)));
}

export function evaluateStop(plan, stop) {
  const axes = kinds[stop.kind].axes;
  if (!axes.length) return { status: "review", checks: [] };
  const oriented = orientations[stop.orientation].axes;
  const checks = axes.map((axis, index) => {
    const piece = plan[oriented[index]];
    const clear = stop[axis];
    const gap = piece === null || clear === null ? null : clear - piece;
    const reserve = gap === null || plan.allowance === null ? null : gap - plan.allowance;
    return { axis, piece, clear, gap, reserve };
  });
  const tolerance = 1e-8;
  let status = "clear";
  if (checks.some(check => check.reserve === null)) status = "pending";
  if (checks.some(check => check.gap !== null && check.gap < -tolerance)) status = "blocked";
  else if (checks.some(check => check.gap !== null && check.gap <= tolerance)) status = "contact";
  else if (checks.some(check => check.reserve !== null && check.reserve < -tolerance)) status = "tight";
  return { status, checks };
}

export const labels = {
  clear: "Meets allowance", tight: "Below allowance", contact: "No clearance", blocked: "Too small",
  pending: "Measurements needed", review: "Field review"
};

export const scale = (unit) => unit === "in" ? 25.4 : 1;

export function formatDimension(value, unit) {
  if (value === null) return "";
  const rounded = Number((value / scale(unit)).toFixed(unit === "in" ? 6 : 4));
  return String(rounded || value / scale(unit));
}

export function routeCsv(plan) {
  const { unit } = plan;
  const display = value => formatDimension(value, unit);
  const rows = [["Piece", "Piece width", "Piece height", "Piece depth", "Unit", "Total allowance per axis",
    "Stop", "Checkpoint", "Type", "Orientation", "Axis", "Piece extent", "Clear span", "Gap", "After allowance", "Status", "Notes"]];
  plan.stops.forEach((stop, index) => {
    const { status, checks } = evaluateStop(plan, stop);
    const prefix = [plan.name, display(plan.width), display(plan.height), display(plan.depth), unit, display(plan.allowance),
      index + 1, stop.name, kinds[stop.kind].label, checks.length ? orientations[stop.orientation].label : ""];
    for (const check of checks.length ? checks : [null]) {
      rows.push([...prefix, ...(check ? [check.axis, ...[check.piece, check.clear, check.gap, check.reserve].map(display)] : ["", "", "", "", ""]),
        labels[status], stop.note]);
    }
  });
  const cell = value => '"' + String(value).replaceAll('"', '""') + '"';
  const textColumns = new Set([0, 7, 16]);
  return rows.map(row => row.map((value, index) => cell(
    textColumns.has(index) && /^[\s\uFEFF]*[=+\-@\t\r\n]/.test(value) ? "'" + value : value
  )).join(",")).join("\r\n") + "\r\n";
}
