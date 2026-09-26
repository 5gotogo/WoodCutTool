export const MATERIALS = ["Plywood", "MDF", "Solid wood", "Other sheet goods"];

export function positive(value) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 && number <= 1200 ? number : null;
}

export function cleanOffcut(input) {
  const length = positive(input.length);
  const width = positive(input.width);
  const thickness = positive(input.thickness);
  const material = MATERIALS.includes(input.material) ? input.material : null;
  const label = String(input.label ?? "").trim().slice(0, 80);
  if (!label || !material || !length || !width || !thickness) return null;
  return {
    id: String(input.id ?? "").slice(0, 80) || crypto.randomUUID(),
    label,
    material,
    thickness,
    length,
    width,
    grain: Boolean(input.grain),
    note: String(input.note ?? "").trim().slice(0, 240),
  };
}

export function cleanPart(input) {
  const length = positive(input.length);
  const width = positive(input.width);
  const thickness = positive(input.thickness);
  const material = MATERIALS.includes(input.material) ? input.material : null;
  const trim = Number(input.trim);
  const kerf = Number(input.kerf);
  if (!length || !width || !thickness || !material || !Number.isFinite(trim) || trim < 0 || trim > 12 || !Number.isFinite(kerf) || kerf < 0 || kerf > 2) return null;
  return { length, width, thickness, material, trim, kerf, rotate: Boolean(input.rotate), grain: Boolean(input.grain) };
}

export function matchOffcut(offcut, part) {
  if (offcut.material !== part.material || Math.abs(offcut.thickness - part.thickness) > 0.001) return null;
  if (part.grain && !offcut.grain) return null;
  // A conservative blank reserves one kerf and trim on both edges of each axis.
  const needLength = part.length + 2 * part.trim + part.kerf;
  const needWidth = part.width + 2 * part.trim + part.kerf;
  const straight = offcut.length >= needLength && offcut.width >= needWidth;
  const canRotate = part.rotate && !part.grain;
  const rotated = canRotate && offcut.length >= needWidth && offcut.width >= needLength;
  if (!straight && !rotated) return null;
  const orientation = straight ? "As entered" : "Rotated 90°";
  const stockArea = offcut.length * offcut.width;
  const blankArea = needLength * needWidth;
  return { ...offcut, orientation, needLength, needWidth, remainingArea: Math.max(0, stockArea - blankArea), areaUsed: blankArea / stockArea };
}

export function rankedMatches(offcuts, part) {
  return offcuts.map((offcut) => matchOffcut(offcut, part)).filter(Boolean)
    .sort((a, b) => a.remainingArea - b.remainingArea || a.label.localeCompare(b.label));
}
