export const groups = [
  ["Measured board", [
    ["length", "Board length", 1800],
    ["width", "Board width", 180],
    ["thickness", "Board thickness", 32]
  ]],
  ["Finished part", [
    ["partLength", "Part length", 420],
    ["partWidth", "Part width", 65],
    ["partThickness", "Part thickness", 24],
    ["quantity", "Parts needed", 4]
  ]],
  ["Material to reserve", [
    ["ends", "Total end loss", 60, true],
    ["edges", "Total edge loss", 20, true],
    ["removal", "Thickness removal", 6, true],
    ["extraLength", "Cleanup per blank · length", 30, true],
    ["extraWidth", "Cleanup per blank · width", 8, true],
    ["kerf", "Kerf per slot", 3, true]
  ]]
];

export const fields = groups.flatMap(([, group]) => group);
export const sample = {
  unit: "mm",
  ...Object.fromEntries(fields.map(([key, , value]) => [key, value]))
};

export function plan(input) {
  if (!["mm", "in"].includes(input?.unit)) throw new Error("Choose millimeters or inches.");
  const v = {};
  for (const [key, label, , optionalZero] of fields) {
    const value = input[key];
    const scale = key === "quantity" ? 1 : 1000;
    const scaled = Math.round(value * scale);
    const minimum = optionalZero ? 0 : 1;
    if (!Number.isFinite(value) || scaled < minimum || value > 50000 || scaled / scale !== value) {
      throw new Error(`Check ${label.toLowerCase()}. ${key === "quantity" ? "Use a positive whole number." : "Use up to three decimal places."}`);
    }
    v[key] = scaled;
  }

  const usableLength = v.length - v.ends;
  const usableWidth = v.width - v.edges;
  const cleanThickness = v.thickness - v.removal;
  if (Math.min(usableLength, usableWidth, cleanThickness) < 0) {
    throw new Error("End, edge and thickness loss must each fit within the corresponding board dimension.");
  }

  const blankLength = v.partLength + v.extraLength;
  const blankWidth = v.partWidth + v.extraWidth;
  const lengthSlot = blankLength + v.kerf;
  const widthSlot = blankWidth + v.kerf;
  const positions = Math.floor(usableLength / lengthSlot);
  const lanes = Math.floor(usableWidth / widthSlot);
  const candidates = positions * lanes;
  const thicknessMargin = cleanThickness - v.partThickness;
  const yieldCount = thicknessMargin >= 0 ? candidates : 0;

  return {
    blankLength: blankLength / 1000,
    blankWidth: blankWidth / 1000,
    usableLength: usableLength / 1000,
    usableWidth: usableWidth / 1000,
    cleanThickness: cleanThickness / 1000,
    thicknessMargin: thicknessMargin / 1000,
    lengthRemainder: (usableLength - positions * lengthSlot) / 1000,
    widthRemainder: (usableWidth - lanes * widthSlot) / 1000,
    positions, lanes, candidates, yieldCount,
    shortfall: Math.max(0, v.quantity - yieldCount),
    surplus: Math.max(0, yieldCount - v.quantity)
  };
}
