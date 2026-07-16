export const benchmarkVersion = "2026-07-16";
export const benchmarkMethod = "woodcuttool-maxrects-v1";
export const standardSheet = { length: 96, width: 48, area: 4608 };

const project = (slug, name, category, templatePath, parts) => ({ slug, name, category, templatePath, parts });
const part = (label, length, width, qty = 1) => ({ label, length, width, qty });

// Project inputs are planning examples derived from the public WoodCutTool template
// library. They are not dimensioned construction drawings and intentionally omit
// hardware, joinery, trim, defects, and structural engineering decisions.
export const projectBenchmarks = [
  project("base-cabinet", "Base cabinet", "Cabinets", "/templates/base-cabinet-cut-list/", [part("Sides", 34.5, 23.25, 2), part("Bottom", 30, 22.5), part("Stretchers", 30, 3, 2), part("Back", 31, 30)]),
  project("wall-cabinet", "Wall cabinet", "Cabinets", "/templates/wall-cabinet-cut-list/", [part("Sides", 30, 11.25, 2), part("Top and bottom", 30, 10.5, 2), part("Shelves", 28.5, 10.5, 2), part("Back", 30, 30)]),
  project("bathroom-vanity", "Bathroom vanity", "Cabinets", "/templates/bathroom-vanity-cut-list/", [part("Sides", 30, 21, 2), part("Bottom", 30, 20.25), part("Shelf", 28.5, 20.25), part("Back rails", 30, 4, 2)]),
  project("pantry-cabinet", "Pantry cabinet", "Cabinets", "/templates/pantry-cabinet-cut-list/", [part("Sides", 84, 16, 2), part("Top and bottom", 30, 14.5, 2), part("Shelves", 28.5, 14.5, 5), part("Back", 84, 30)]),
  project("laundry-cabinet", "Laundry room cabinet", "Cabinets", "/templates/laundry-room-cabinet-cut-list/", [part("Sides", 36, 23, 2), part("Top and bottom", 32, 21.5, 2), part("Shelves", 30.5, 21.5, 2), part("Back", 36, 32)]),
  project("shop-cabinet", "Shop storage cabinet", "Cabinets", "/templates/shop-storage-cabinet-cut-list/", [part("Sides", 72, 20, 2), part("Top and bottom", 36, 18.5, 2), part("Shelves", 34.5, 18.5, 4), part("Back", 72, 36)]),
  project("bookshelf", "Bookshelf", "Storage", "/templates/bookshelf-cut-list/", [part("Sides", 72, 11.25, 2), part("Top and bottom", 30, 10.5, 2), part("Shelves", 28.5, 10.5, 4), part("Back", 72, 30)]),
  project("cube-storage", "Cube storage unit", "Storage", "/templates/cube-storage-cut-list/", [part("Sides", 30, 13, 2), part("Top and bottom", 58.5, 13, 2), part("Vertical dividers", 28.5, 13, 3), part("Shelves", 18.75, 13, 6)]),
  project("mudroom-bench", "Mudroom bench", "Storage", "/templates/mudroom-bench-cut-list/", [part("Seat", 60, 18), part("Sides", 18, 17.25, 2), part("Dividers", 16.5, 17.25, 3), part("Bottom", 58.5, 16.5)]),
  project("window-seat", "Window seat", "Storage", "/templates/window-seat-cut-list/", [part("Seat", 72, 20), part("Front", 72, 18.5), part("Sides", 18.5, 18.5, 2), part("Dividers", 18.5, 18.5, 3)]),
  project("utility-closet", "Utility closet cabinet", "Storage", "/templates/utility-closet-cut-list/", [part("Sides", 84, 20, 2), part("Top and bottom", 30, 18.5, 2), part("Shelves", 28.5, 18.5, 3), part("Back", 84, 30)]),
  project("under-bed-drawers", "Under-bed drawers", "Storage", "/templates/under-bed-drawer-cut-list/", [part("Drawer bottoms", 36, 20, 2), part("Long sides", 36, 6, 4), part("Ends", 18.5, 6, 4), part("Faces", 38, 8, 2)]),
  project("coffee-table", "Coffee table", "Furniture", "/templates/coffee-table-cut-list/", [part("Top", 48, 24), part("Leg panels", 22.5, 22.5, 2), part("Lower shelf", 42, 20), part("Stretchers", 42, 4, 2)]),
  project("console-table", "Console table", "Furniture", "/templates/console-table-cut-list/", [part("Top", 48, 14), part("Sides", 30, 12.5, 2), part("Lower shelf", 45, 12.5), part("Back stretcher", 45, 4)]),
  project("record-cabinet", "Record cabinet", "Furniture", "/templates/record-cabinet-cut-list/", [part("Sides", 30, 16, 2), part("Top and bottom", 58.5, 15.25, 2), part("Dividers", 14.5, 15.25, 3), part("Back", 60, 30)]),
  project("media-cabinet", "Media wall cabinet", "Furniture", "/templates/media-wall-cabinet-cut-list/", [part("Sides", 24, 16, 2), part("Top and bottom", 72, 15.25, 2), part("Dividers", 22.5, 15.25, 4), part("Back", 72, 24)]),
  project("folding-craft-table", "Folding craft table", "Furniture", "/templates/folding-craft-table-cut-list/", [part("Center top", 36, 24), part("Folding leaves", 36, 12, 2), part("Leg panels", 28.5, 22.5, 2), part("Shelf", 32, 18)]),
  project("kids-table", "Kids table", "Furniture", "/templates/kids-table-cut-list/", [part("Top", 36, 24), part("Leg panels", 20, 20, 2), part("Long stretcher", 30, 4), part("End stretchers", 18, 4, 2)]),
  project("mobile-workbench", "Mobile workbench", "Shop", "/templates/mobile-workbench-cut-list/", [part("Top layers", 48, 24, 2), part("Leg panels", 28.5, 22.5, 2), part("Shelf", 42, 20), part("Caster pads", 4, 4, 4)]),
  project("assembly-table", "Assembly table", "Shop", "/templates/assembly-table-cut-list/", [part("Top layers", 60, 30, 2), part("Leg panels", 28.5, 28.5, 2), part("Shelf", 54, 24), part("Stretchers", 54, 4, 2)]),
  project("miter-saw-stand", "Miter saw stand", "Shop", "/templates/miter-saw-stand-cut-list/", [part("Top wings", 30, 16, 2), part("Saw deck", 24, 16), part("Leg panels", 28.5, 15.25, 4), part("Shelves", 28.5, 15.25, 2)]),
  project("french-cleat-wall", "French cleat tool wall", "Shop", "/templates/french-cleat-wall-cut-list/", [part("Back panels", 48, 24, 2), part("Cleat strips", 46.5, 3.5, 8), part("Top cap", 48, 2), part("Bottom spacer", 48, 2)]),
  project("rolling-cart", "Rolling utility cart", "Shop", "/templates/rolling-cart-cut-list/", [part("Top", 30, 18), part("Shelves", 30, 18, 2), part("Sides", 28.5, 18, 2), part("Caster blocks", 3, 3, 4)]),
  project("outdoor-storage-box", "Outdoor storage box", "Outdoor", "/templates/outdoor-storage-box-cut-list/", [part("Lid", 48, 24), part("Sides", 24, 22.5, 2), part("Front and back", 46.5, 22.5, 2), part("Bottom", 46.5, 22.5)])
];

export const kerfPatterns = [
  project("twelve-inch-rips", "Eight 12 x 48 shelves", "Repeated shelves", "/learn/saw-kerf-explained/", [part("Shelf", 48, 12, 8)]),
  project("twenty-four-inch-panels", "Eight 24 x 24 panels", "Square panels", "/learn/kerf-allowance-for-table-saw-and-track-saw/", [part("Panel", 24, 24, 8)]),
  project("half-sheet-panels", "Four 48 x 24 panels", "Half-sheet panels", "/templates/4x8-plywood-sheet/", [part("Panel", 48, 24, 4)]),
  project("cabinet-sides", "Six 34.5 x 24 cabinet sides", "Cabinet sides", "/learn/cabinet-box-cut-list-basics/", [part("Cabinet side", 34.5, 24, 6)]),
  project("sixteen-inch-shelves", "Twelve 32 x 16 shelves", "Repeated shelves", "/learn/table-saw-repeat-cut-workflow/", [part("Shelf", 32, 16, 12)]),
  project("drawer-bottoms", "Twelve 24 x 18 drawer bottoms", "Drawer parts", "/templates/drawer-box-cut-list/", [part("Drawer bottom", 24, 18, 12)]),
  project("narrow-cleats", "Twenty 48 x 3 cleats", "Narrow strips", "/templates/french-cleat-wall-cut-list/", [part("Cleat", 48, 3, 20)]),
  project("bookcase-shelves", "Ten 30 x 11.25 shelves", "Bookcase shelves", "/templates/bookshelf-cut-list/", [part("Shelf", 30, 11.25, 10)]),
  project("door-panels", "Six 30 x 16 door panels", "Door panels", "/learn/cabinet-door-cut-list-planning/", [part("Door panel", 30, 16, 6)]),
  project("small-cubby-parts", "Twenty-four 18 x 12 cubby parts", "Cubby parts", "/templates/cube-storage-cut-list/", [part("Cubby part", 18, 12, 24)])
];

function summarizeParts(parts) {
  const expanded = [];
  for (const source of parts) {
    for (let index = 0; index < source.qty; index += 1) {
      expanded.push({ ...source, id: `${source.label} ${index + 1}`, qty: 1 });
    }
  }
  return expanded.filter((item) => item.length > 0 && item.width > 0);
}

// Deterministic rectangle-packing heuristic matched to the browser calculator's
// MaxRects-style placement rules. Results are estimates, not a mathematical proof
// of the globally optimal layout.
export function packSheets(parts, sheetLength = 96, sheetWidth = 48, kerf = 0.125, allowRotate = true) {
  const pieces = summarizeParts(parts).sort((a, b) => {
    const areaDiff = (b.length * b.width) - (a.length * a.width);
    if (areaDiff) return areaDiff;
    const longDiff = Math.max(b.length, b.width) - Math.max(a.length, a.width);
    if (longDiff) return longDiff;
    return Math.min(b.length, b.width) - Math.min(a.length, a.width);
  });
  const sheets = [];
  const newSheet = () => ({ freeRects: [{ x: 0, y: 0, w: sheetWidth, h: sheetLength }], placements: [], usedArea: 0 });
  const orientationsFor = (piece) => {
    const candidates = allowRotate
      ? [{ w: piece.width, h: piece.length, rotated: false }, { w: piece.length, h: piece.width, rotated: true }]
      : [{ w: piece.width, h: piece.length, rotated: false }];
    return candidates.filter((value, index, list) => index === list.findIndex((item) => item.w === value.w && item.h === value.h));
  };
  const splitFreeRects = (freeRects, block) => {
    const next = [];
    for (const rect of freeRects) {
      const separated = block.x >= rect.x + rect.w || block.x + block.w <= rect.x || block.y >= rect.y + rect.h || block.y + block.h <= rect.y;
      if (separated) {
        next.push(rect);
        continue;
      }
      const rectRight = rect.x + rect.w;
      const rectBottom = rect.y + rect.h;
      const blockRight = block.x + block.w;
      const blockBottom = block.y + block.h;
      if (block.x > rect.x) next.push({ x: rect.x, y: rect.y, w: block.x - rect.x, h: rect.h });
      if (blockRight < rectRight) next.push({ x: blockRight, y: rect.y, w: rectRight - blockRight, h: rect.h });
      if (block.y > rect.y) next.push({ x: rect.x, y: rect.y, w: rect.w, h: block.y - rect.y });
      if (blockBottom < rectBottom) next.push({ x: rect.x, y: blockBottom, w: rect.w, h: rectBottom - blockBottom });
    }
    return next
      .filter((rect) => rect.w > 0.01 && rect.h > 0.01)
      .filter((rect, index, list) => !list.some((other, otherIndex) => otherIndex !== index && rect.x >= other.x && rect.y >= other.y && rect.x + rect.w <= other.x + other.w && rect.y + rect.h <= other.y + other.h));
  };
  const findPlacement = (sheet, piece) => {
    let best = null;
    sheet.freeRects.forEach((rect) => {
      orientationsFor(piece).forEach((orientation) => {
        if (orientation.w > rect.w || orientation.h > rect.h) return;
        const areaFit = rect.w * rect.h - orientation.w * orientation.h;
        const shortSideFit = Math.min(Math.abs(rect.w - orientation.w), Math.abs(rect.h - orientation.h));
        const longSideFit = Math.max(Math.abs(rect.w - orientation.w), Math.abs(rect.h - orientation.h));
        const score = [rect.y, rect.x, orientation.rotated ? 1 : 0, shortSideFit, areaFit, longSideFit];
        if (!best || score.some((value, index) => value < best.score[index] && score.slice(0, index).every((prior, priorIndex) => prior === best.score[priorIndex]))) {
          best = { rect, orientation, score };
        }
      });
    });
    return best;
  };
  const placeOnSheet = (sheet, piece) => {
    const best = findPlacement(sheet, piece);
    if (!best) return false;
    const { rect, orientation } = best;
    const spacingW = orientation.w >= rect.w - 0.01 ? 0 : kerf;
    const spacingH = orientation.h >= rect.h - 0.01 ? 0 : kerf;
    const block = { x: rect.x, y: rect.y, w: Math.min(rect.w, orientation.w + spacingW), h: Math.min(rect.h, orientation.h + spacingH) };
    sheet.placements.push({ ...piece, x: rect.x, y: rect.y, w: orientation.w, h: orientation.h, rotated: orientation.rotated });
    sheet.usedArea += orientation.w * orientation.h;
    sheet.freeRects = splitFreeRects(sheet.freeRects, block);
    return true;
  };
  const rejected = [];
  for (const piece of pieces) {
    const fits = allowRotate
      ? (piece.width <= sheetWidth && piece.length <= sheetLength) || (piece.length <= sheetWidth && piece.width <= sheetLength)
      : piece.width <= sheetWidth && piece.length <= sheetLength;
    if (!fits) {
      rejected.push(piece);
      continue;
    }
    let placed = sheets.some((sheet) => placeOnSheet(sheet, piece));
    if (!placed) {
      const sheet = newSheet();
      placed = placeOnSheet(sheet, piece);
      if (placed) sheets.push(sheet);
    }
  }
  const usedArea = sheets.reduce((sum, sheet) => sum + sheet.usedArea, 0);
  const totalArea = sheets.length * sheetLength * sheetWidth;
  const wastePercent = totalArea ? ((totalArea - usedArea) / totalArea) * 100 : 0;
  return { sheets, rejected, usedArea, wastePercent };
}

export function projectResult(input, kerf = 0.125) {
  const allowed = packSheets(input.parts, 96, 48, kerf, true);
  const locked = packSheets(input.parts, 96, 48, kerf, false);
  const partCount = input.parts.reduce((sum, item) => sum + item.qty, 0);
  const partArea = input.parts.reduce((sum, item) => sum + item.length * item.width * item.qty, 0);
  return {
    ...input,
    partCount,
    partArea,
    theoreticalSheets: Math.ceil(partArea / standardSheet.area),
    allowedSheets: allowed.sheets.length,
    allowedYield: allowed.sheets.length ? partArea / (allowed.sheets.length * standardSheet.area) * 100 : 0,
    lockedSheets: locked.sheets.length,
    lockedYield: locked.sheets.length ? partArea / (locked.sheets.length * standardSheet.area) * 100 : 0,
    rejected: [...allowed.rejected, ...locked.rejected].length
  };
}
