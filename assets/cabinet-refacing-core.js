const scale = 10000;
const maxDimension = 10000;
export const edges = ["left", "right", "top", "bottom"];
export const sample = Object.freeze({
  label: "B03", unit: "mm", mode: "overlay", layout: "pair",
  width: 600, height: 700, left: 12, right: 12, top: 10, bottom: 8, gap: 3
});

export function calculateFronts(input) {
  const label = typeof input.label === "string" ? input.label.trim() : "";
  if (!label || label.length > 64 || /[\x00-\x1f\x7f]/.test(label)) {
    return { error: "Enter an opening ID of up to 64 characters on one line." };
  }
  const { unit, mode, layout } = input;
  if (!["mm", "in"].includes(unit) || !["overlay", "inset"].includes(mode) || !["single", "pair"].includes(layout)) {
    return { error: "Choose valid units, front position and door count." };
  }

  const measurements = {};
  for (const key of ["width", "height", ...edges, "gap"]) {
    if (key === "gap" && layout === "single") {
      measurements.gap = 0;
      continue;
    }
    const value = input[key];
    const ticks = Math.round(value * scale);
    const needsPositive = ["width", "height", "gap"].includes(key);
    if (typeof value !== "number" || !Number.isFinite(value) || value > maxDimension ||
        ticks < (needsPositive ? 1 : 0) || Math.abs(value - ticks / scale) > 1e-12) {
      return { error: "Use positive opening dimensions and pair gaps, and nonnegative edge values. Enter up to four decimal places." };
    }
    measurements[key] = ticks;
  }

  const { width, height, left, right, top, bottom, gap } = measurements;
  const direction = mode === "overlay" ? 1 : -1;
  const faceWidth = width + direction * (left + right);
  const faceHeight = height + direction * (top + bottom);
  if (faceWidth <= 0 || faceHeight <= 0) {
    return { error: "The edge clearances leave no usable front area." };
  }
  if (gap >= faceWidth) {
    return { error: "The center gap must be smaller than the total front span." };
  }

  const x = -direction * left;
  const y = -direction * top;
  const leafWidth = (faceWidth - gap) / (layout === "pair" ? 2 : 1);
  const leaves = layout === "pair"
    ? [{ name: "Left", x }, { name: "Right", x: x + leafWidth + gap }]
    : [{ name: "Single", x }];
  return {
    record: { label, unit, mode, layout, ...Object.fromEntries(
      Object.entries(measurements).map(([key, ticks]) => [key, ticks / scale])
    ) },
    width: faceWidth / scale,
    height: faceHeight / scale,
    leaves: leaves.map((leaf) => ({ name: leaf.name, x: leaf.x / scale, y: y / scale, width: leafWidth / scale, height: faceHeight / scale }))
  };
}

function csvCell(value) {
  return '"' + String(value).replace(/^[\s]*[=+@-]/, "'$&").replaceAll('"', '""') + '"';
}

export function scheduleCsv(records) {
  const rows = [["Opening ID", "Leaf", "Units", "Position", "Opening width", "Opening height",
    "Left allowance", "Right allowance", "Top allowance", "Bottom allowance", "Center gap",
    "Nominal front width", "Nominal front height", "Status"]];
  for (const input of records) {
    const { record, leaves } = calculateFronts(input);
    for (const leaf of leaves) {
      rows.push([record.label, leaf.name, record.unit, record.mode, record.width, record.height,
        record.left, record.right, record.top, record.bottom, record.gap, leaf.width, leaf.height, "Mock-up required"]);
    }
  }
  return rows.map((row) => row.map(csvCell).join(",")).join("\r\n") + "\r\n";
}
