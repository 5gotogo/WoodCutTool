export const bayTypes = {
  shelves: "Shelves only",
  single: "Single hanging",
  double: "Double hanging"
};

export const presets = {
  "reach-in": {
    title: "Three-bay reach-in",
    widths: [1824, 1810, 1816], maxHeight: 2420, maxDepth: 575,
    height: 2100, depth: 520, thickness: 18, left: 32, right: 36, shelfGap: 2, setback: 20,
    bays: [
      { type: "double", width: 620, shelves: 1 },
      { type: "shelves", width: 450, shelves: 5 },
      { type: "single", width: null, shelves: 1 }
    ]
  },
  "bypass-doors": {
    title: "Reach-in behind bypass doors",
    widths: [1580, 1568, 1575], maxHeight: 2200, maxDepth: 460,
    height: 1900, depth: 350, thickness: 18, left: 26, right: 26, shelfGap: 2, setback: 12,
    bays: [
      { type: "shelves", width: 700, shelves: 5 },
      { type: "shelves", width: null, shelves: 5 }
    ]
  },
  "linen": {
    title: "Narrow linen closet",
    widths: [932, 925, 917], maxHeight: 2100, maxDepth: 400,
    height: 1860, depth: 365, thickness: 19, left: 25, right: 25, shelfGap: 2, setback: 15,
    bays: [
      { type: "shelves", width: 335, shelves: 6 },
      { type: "shelves", width: null, shelves: 5 }
    ]
  },
  "walk-in": {
    title: "One wall of a walk-in",
    widths: [2580, 2564, 2572], maxHeight: 2460, maxDepth: 650,
    height: 2200, depth: 545, thickness: 19, left: 48, right: 60, shelfGap: 3, setback: 22,
    bays: [
      { type: "single", width: 700, shelves: 1 },
      { type: "shelves", width: 480, shelves: 6 },
      { type: "double", width: null, shelves: 1 },
      { type: "single", width: null, shelves: 1 }
    ]
  }
};

const epsilon = 1e-7;
const dimension = value => Number.isFinite(value) && value >= 0 && value <= 100000;
const failure = error => ({ error });

export function planCloset(input) {
  const { widths, maxHeight, maxDepth, height, depth, thickness, left, right, shelfGap, setback, bays } = input;
  if (widths.length !== 3 || ![...widths, maxHeight, maxDepth, height, depth, thickness].every(n => dimension(n) && n > 0)) {
    return failure("Enter positive opening and panel dimensions.");
  }
  if (![left, right, shelfGap, setback].every(dimension)) return failure("Enter zero or a positive dimension for each filler and shelf allowance.");
  if (bays.length < 1 || bays.length > 8) return failure("A straight run needs 1 to 8 bays.");
  if (height > maxHeight + epsilon || depth > maxDepth + epsilon) return failure("The proposed panels exceed the measured usable height or depth.");
  if (thickness >= Math.min(height, depth)) return failure("Panel thickness must be smaller than panel height and depth.");
  if (setback >= depth) return failure("Shelf front setback must be smaller than panel depth.");
  if (bays.some(bay => !Object.hasOwn(bayTypes, bay.type) ||
    (bay.width !== null && (!dimension(bay.width) || bay.width <= epsilon)) ||
    !Number.isInteger(bay.shelves) || bay.shelves < 0 || bay.shelves > 20)) {
    return failure("Give each bay a positive width or leave it blank for automatic sizing. Shelf counts must be whole numbers from 0 to 20.");
  }
  const opening = Math.min(...widths);
  const panelCount = bays.length + 1;
  const panelBudget = panelCount * thickness;
  const clearBudget = opening - left - right - panelBudget;
  if (clearBudget <= epsilon) return failure("Fillers and upright panels use all of the opening width.");
  const fixed = bays.reduce((sum, bay) => sum + (bay.width ?? 0), 0);
  const autoCount = bays.filter(bay => bay.width === null).length;
  const remainder = clearBudget - fixed;
  if (remainder < -epsilon || (autoCount && remainder <= epsilon)) {
    return failure("The specified bays use too much width. Reduce a bay or filler, or remove a bay.");
  }
  const autoWidth = autoCount ? remainder / autoCount : 0;
  const resolvedBays = bays.map((bay, index) => ({ ...bay, width: bay.width ?? autoWidth, number: index + 1 }));
  if (resolvedBays.some(bay => bay.shelves > 0 && bay.width - shelfGap <= epsilon)) {
    return failure("A bay with shelves is too narrow for the total shelf width allowance.");
  }
  if (resolvedBays.some(bay => bay.shelves * thickness > height + epsilon)) {
    return failure("The combined shelf thickness exceeds the panel height in at least one bay.");
  }
  const parts = [{ part: "Shared upright panel", quantity: panelCount, length: height, depth, thickness }];
  for (const bay of resolvedBays) {
    if (bay.shelves) parts.push({
      part: `Bay ${bay.number} shelf blank`, quantity: bay.shelves,
      length: bay.width - shelfGap, depth: depth - setback, thickness
    });
  }
  return {
    opening, left, right, panelBudget, clearBudget, autoWidth,
    unallocated: autoCount || remainder < epsilon ? 0 : remainder,
    bays: resolvedBays, parts
  };
}

export function formatDimension(mm, unit) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: unit === "in" ? 4 : 3, useGrouping: false })
    .format(unit === "in" ? mm / 25.4 : mm);
}

export function partsCsv(parts, unit) {
  const header = `Part,Quantity,Length (${unit}),Depth (${unit}),Thickness (${unit})`;
  return [header, ...parts.map(row => [
    row.part, row.quantity, ...[row.length, row.depth, row.thickness].map(value => formatDimension(value, unit))
  ].join(","))].join("\r\n") + "\r\n";
}
