(() => {
  const value = (form, name, fallback = 0) => {
    const raw = Number(form.elements[name]?.value);
    return Number.isFinite(raw) ? raw : fallback;
  };
  const fixed = (number, digits = 1) => new Intl.NumberFormat("en-US", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits === 0 ? 0 : 0
  }).format(Number.isFinite(number) ? number : 0);
  const money = (number) => `$${fixed(number, 2)}`;
  const metric = (number, label) => `<div class="metric"><strong>${number}</strong><span>${label}</span></div>`;
  const metrics = (items) => `<div class="metric-grid">${items.map(([number, label]) => metric(number, label)).join("")}</div>`;
  const list = (items) => `<ul class="plan-list">${items.map((item) => `<li>${item}</li>`).join("")}</ul>`;
  const notice = (text) => `<p class="notice">${text}</p>`;
  const read = (form) => Object.fromEntries(new FormData(form).entries());

  const unitContext = (form) => {
    const metric = form.elements.unit?.value === "metric";
    const toInches = (name, fallback = 0) => value(form, name, fallback) * (metric ? 1 / 25.4 : 1);
    const fromInches = (number) => number * (metric ? 25.4 : 1);
    const dimension = (number, digits = 2) => `${fixed(fromInches(number), digits)} ${metric ? "mm" : "in"}`;
    return { metric, toInches, fromInches, dimension, unit: metric ? "mm" : "in" };
  };

  const MaterialEngine = {
    sheetEstimate(parts, wastePercent = 0, sheetAreaSquareFeet = 32) {
      const areaSquareFeet = parts.reduce((sum, part) => sum + part.width * part.length * part.qty / 144, 0);
      const adjustedArea = areaSquareFeet * (1 + Math.max(0, wastePercent) / 100);
      return { areaSquareFeet, adjustedArea, sheets: Math.max(1, Math.ceil(adjustedArea / sheetAreaSquareFeet)) };
    },
    coverage(area, coats, coveragePerUnit, wastePercent = 0) {
      const adjustedArea = area * coats * (1 + Math.max(0, wastePercent) / 100);
      return { adjustedArea, units: Math.ceil(adjustedArea / Math.max(coveragePerUnit, 0.01)) };
    }
  };

  const AngleEngine = {
    slope(rise, run) {
      const safeRun = Math.max(run, 0.0001);
      return { angle: Math.atan(rise / safeRun) * 180 / Math.PI, length: Math.hypot(rise, run), slopePercent: rise / safeRun * 100 };
    },
    compoundCrown(cornerDegrees, springDegrees) {
      const corner = cornerDegrees * Math.PI / 180;
      const spring = springDegrees * Math.PI / 180;
      return {
        miter: Math.asin(Math.cos(spring) * Math.sin(corner / 2)) * 180 / Math.PI,
        bevel: Math.acos(Math.sin(spring) * Math.cos(corner / 2)) * 180 / Math.PI
      };
    },
    polygonMiter(sides) { return 180 / Math.max(3, sides); }
  };

  const SpacingEngine = {
    equalShelves({ insideHeight, shelfCount, thickness, bottomOffset = 0 }) {
      const count = Math.max(0, Math.round(shelfCount));
      const usableHeight = Math.max(0, insideHeight - bottomOffset - count * thickness);
      const gap = usableHeight / Math.max(1, count + 1);
      const shelves = Array.from({ length: count }, (_, index) => {
        const bottom = bottomOffset + gap * (index + 1) + thickness * index;
        return { index: index + 1, bottom, top: bottom + thickness, center: bottom + thickness / 2 };
      });
      return { gap, shelves, usableHeight };
    },
    equalParts({ opening, partWidth, maxGap }) { return spacing(opening, partWidth, maxGap); }
  };

  const CutListGenerator = {
    cabinet({ width, height, depth, thickness, backThickness, shelfCount, preset, waste }) {
      const insideWidth = Math.max(0, width - 2 * thickness);
      const shelfDepth = Math.max(0, depth - Math.max(backThickness, 0.25));
      const parts = [
        { name: "Side", qty: 2, length: height, width: depth, thickness },
        { name: "Top", qty: 1, length: insideWidth, width: depth, thickness },
        { name: "Bottom", qty: 1, length: insideWidth, width: depth, thickness },
        { name: "Adjustable shelf", qty: Math.max(0, Math.round(shelfCount)), length: insideWidth, width: shelfDepth, thickness },
        { name: "Back", qty: 1, length: height, width, thickness: backThickness }
      ].filter((part) => part.qty > 0 && part.length > 0 && part.width > 0);
      return { preset, insideWidth, shelfDepth, parts, material: MaterialEngine.sheetEstimate(parts, waste) };
    },
    drawerBox({ openingWidth, openingHeight, cabinetDepth, clearance, thickness, bottomThickness, bottomStyle, qty, waste }) {
      const boxWidth = Math.max(0, openingWidth - clearance);
      const boxHeight = Math.max(0, openingHeight - 0.5);
      const boxDepth = Math.max(0, cabinetDepth - 1);
      const insideWidth = Math.max(0, boxWidth - 2 * thickness);
      const capturedInset = 0.25;
      const bottomWidth = bottomStyle === "applied" ? boxWidth : insideWidth + 2 * capturedInset;
      const bottomDepth = bottomStyle === "applied" ? boxDepth : Math.max(0, boxDepth - 2 * thickness + 2 * capturedInset);
      const count = Math.max(1, Math.round(qty));
      const parts = [
        { name: "Drawer side", qty: 2 * count, length: boxDepth, width: boxHeight, thickness },
        { name: "Drawer front/back", qty: 2 * count, length: insideWidth, width: boxHeight, thickness },
        { name: "Drawer bottom", qty: count, length: bottomDepth, width: bottomWidth, thickness: bottomThickness }
      ];
      return { boxWidth, boxHeight, boxDepth, parts, material: MaterialEngine.sheetEstimate(parts, waste) };
    },
    cabinetDoor({ openingWidth, openingHeight, style, doorCount, edge, centerGap, railWidth, stileWidth, groove, waste }) {
      const inset = style === "inset";
      const totalWidth = inset ? openingWidth - 2 * edge : openingWidth + 2 * edge;
      const doorHeight = inset ? openingHeight - 2 * edge : openingHeight + 2 * edge;
      const count = Math.max(1, Math.min(2, Math.round(doorCount)));
      const doorWidth = Math.max(0, (totalWidth - (count === 2 ? centerGap : 0)) / count);
      const railLength = Math.max(0, doorWidth - 2 * stileWidth + 2 * groove);
      const panelWidth = railLength;
      const panelHeight = Math.max(0, doorHeight - 2 * railWidth + 2 * groove);
      const parts = [
        { name: "Stile", qty: 2 * count, length: doorHeight, width: stileWidth, thickness: 0.75 },
        { name: "Rail", qty: 2 * count, length: railLength, width: railWidth, thickness: 0.75 },
        { name: "Center panel", qty: count, length: panelHeight, width: panelWidth, thickness: 0.25 }
      ];
      return { count, doorWidth, doorHeight, railLength, panelWidth, panelHeight, parts, material: MaterialEngine.sheetEstimate(parts, waste) };
    }
  };

  globalThis.WoodCutToolEngines = { CutListGenerator, SpacingEngine, AngleEngine, MaterialEngine };

  function partsOutput(parts, units) {
    const text = parts.map((part) => `${part.qty} × ${part.name}: ${units.dimension(part.length)} × ${units.dimension(part.width)} × ${units.dimension(part.thickness)}`).join("\n");
    return `<div class="cut-list-output"><div class="cut-list-output-head"><h3>Copyable parts list</h3><button class="button secondary small" type="button" data-copy-cut-list>Copy parts</button></div><pre data-cut-list>${text}</pre></div>`;
  }

  function cabinetSvg({ width, height, shelves = [], label = "Cabinet" }, units) {
    const viewWidth = 420; const viewHeight = 300; const pad = 42;
    const scale = Math.min((viewWidth - pad * 2) / Math.max(width, 1), (viewHeight - pad * 2) / Math.max(height, 1));
    const w = width * scale; const h = height * scale; const x = (viewWidth - w) / 2; const y = (viewHeight - h) / 2;
    const shelfLines = shelves.map((position) => `<line x1="${x}" y1="${y + h - position * scale}" x2="${x + w}" y2="${y + h - position * scale}" />`).join("");
    return `<svg class="calculator-svg" viewBox="0 0 ${viewWidth} ${viewHeight}" role="img" aria-label="${label} dimension preview"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" />${shelfLines}<text x="${viewWidth / 2}" y="24" text-anchor="middle">${label}: ${units.dimension(width)} × ${units.dimension(height)}</text><text x="${viewWidth / 2}" y="${viewHeight - 8}" text-anchor="middle">Live dimension preview</text></svg>`;
  }

  function spacing(opening, part, maxGap) {
    const count = Math.max(1, Math.ceil((opening - maxGap) / (part + maxGap)));
    const gap = Math.max(0, (opening - count * part) / (count + 1));
    return { count, gap, center: part + gap };
  }

  function stairResult(rise, run, maxRiser) {
    const risers = Math.max(1, Math.ceil(rise / Math.max(maxRiser, 0.01)));
    const treads = Math.max(1, risers - 1);
    const riser = rise / risers;
    const tread = run / treads;
    const angle = Math.atan(rise / Math.max(run, 0.01)) * 180 / Math.PI;
    const length = Math.hypot(rise, run);
    return { risers, treads, riser, tread, angle, length };
  }

  const calculators = {
    fence(form) {
      const length = value(form, "length"); const height = value(form, "height"); const spacingFt = Math.max(value(form, "spacing"), 0.1);
      const sections = Math.max(1, Math.ceil(length / spacingFt)); const gates = Math.max(0, Math.round(value(form, "gates")));
      const posts = sections + 1 + gates; const waste = 1 + value(form, "waste") / 100;
      const pickets = Math.ceil((length * 12 / Math.max(value(form, "picketWidth") + value(form, "gap"), 0.01)) * waste);
      const rails = Math.ceil(sections * value(form, "rails") * waste); const cost = pickets * value(form, "unitCost");
      return `${metrics([[posts, "Posts to plan"], [pickets, "Pickets with waste"], [rails, "Rails with waste"], [money(cost), "Picket budget"]])}${list([`<strong>${sections}</strong> fence sections at about ${fixed(length / sections)} ft each.`, `Plan approximately <strong>${posts}</strong> post holes before adding corner or terrain-specific posts.`, `Fence face area: <strong>${fixed(length * height)} ft²</strong>.`])}${notice("Verify corner, end, gate, slope, and local footing requirements on the actual site.")}`;
    },
    deck(form) {
      const length = value(form, "length"); const width = value(form, "width"); const boardWidth = value(form, "boardWidth"); const gap = value(form, "gap");
      const courses = Math.ceil(width * 12 / Math.max(boardWidth + gap, 0.01)); const boardFeet = courses * length;
      const waste = 1 + value(form, "waste") / 100; const adjustedFeet = Math.ceil(boardFeet * waste); const joists = Math.ceil(length * 12 / Math.max(value(form, "joistSpacing"), 1)) + 1;
      const cost = adjustedFeet * value(form, "unitCost");
      return `${metrics([[`${fixed(length * width)} ft²`, "Deck surface"], [`${adjustedFeet} lf`, "Deck boards"], [joists, "Joist lines"], [money(cost), "Board budget"]])}${list([`<strong>${courses}</strong> board courses across the deck width.`, `Base board length before waste: <strong>${fixed(boardFeet)} linear ft</strong>.`, `Framing line count is an early layout count only; structural member sizing is not calculated.`])}${notice("Confirm approved span tables, footing details, ledger connections, railings, stairs, permits, and local code before construction.")}`;
    },
    deckBoard(form) {
      const length = value(form, "length"); const width = value(form, "width"); const effectiveWidth = Math.max(value(form, "boardWidth") + value(form, "gap"), 0.01);
      const courses = Math.ceil(width * 12 / effectiveWidth); const linearFeet = courses * length * (1 + value(form, "waste") / 100); const stockLength = Math.max(value(form, "stockLength"), 0.01); const boards = Math.ceil(linearFeet / stockLength);
      return `${metrics([[courses, "Board courses"], [`${fixed(linearFeet)} lf`, "Linear feet with waste"], [boards, `${fixed(stockLength)} ft boards`], [`${fixed(length * width)} ft²`, "Deck surface"]])}${list([`Effective board width including gap: <strong>${fixed(effectiveWidth, 3)} in</strong>.`, `Board courses run the <strong>${fixed(length)} ft</strong> deck length.`, `Use a higher allowance for diagonals, picture framing, seams, and board defects.`])}${notice("Confirm stock lengths and actual board coverage with your supplier before purchasing.")}`;
    },
    roof(form) {
      const rise = value(form, "rise"); const run = Math.max(value(form, "run"), 0.01); const span = value(form, "span"); const overhang = value(form, "overhang");
      const angle = Math.atan(rise / run) * 180 / Math.PI; const multiplier = Math.hypot(rise, run) / run; const horizontal = span * 6 + overhang; const rafter = horizontal * multiplier;
      return `${metrics([[`${fixed(rise * 12 / run, 2)}:12`, "Roof pitch"], [`${fixed(angle, 1)}°`, "Roof angle"], [`${fixed(rise / run * 100, 1)}%`, "Slope"], [`${fixed(rafter)} in`, "Approx. rafter"]])}${list([`Pitch multiplier: <strong>${fixed(multiplier, 4)}</strong>.`, `Half-span run plus overhang: <strong>${fixed(horizontal)} in</strong>.`, `Use the rafter value only as geometry before cut deductions.`])}${notice("This is not a structural roof design. Confirm loading, connections, bearing, material grade, and local code.")}`;
    },
    roofing(form) {
      const length = value(form, "length"); const run = value(form, "span") * 6; const multiplier = Math.hypot(12, value(form, "pitch")) / 12; const area = length * 2 * run / 12 * multiplier; const adjusted = area * (1 + value(form, "waste") / 100); const squares = adjusted / 100;
      return `${metrics([[`${fixed(area)} ft²`, "Roof surface"], [`${fixed(adjusted)} ft²`, "Area with waste"], [`${fixed(squares, 2)}`, "Roofing squares"], [money(squares * value(form, "unitCost")), "Shingle budget"]])}${list([`Simple gable estimate using a <strong>${fixed(value(form, "pitch"), 1)}:12</strong> pitch.`, `Slope multiplier: <strong>${fixed(multiplier, 4)}</strong>.`, `Waste allowance: <strong>${fixed(value(form, "waste"), 0)}%</strong>.`])}${notice("Add underlayment, flashing, ridge components, ventilation, and all manufacturer-required accessories separately.")}`;
    },
    concrete(form) {
      const diameter = value(form, "diameter"); const depth = value(form, "depth"); const postWidth = value(form, "postWidth"); const qty = Math.max(1, Math.round(value(form, "qty")));
      const gross = Math.PI * (diameter / 2) ** 2 * depth; const post = postWidth ** 2 * depth; const cubicFeet = Math.max(0, (gross - post) * qty / 1728) * (1 + value(form, "waste") / 100);
      const yields = { 40: 0.3, 50: 0.375, 60: 0.45, 80: 0.6 }; const bagSize = value(form, "bagSize"); const bags = Math.ceil(cubicFeet / (yields[bagSize] || 0.6));
      return `${metrics([[`${fixed(cubicFeet, 2)} ft³`, "Concrete volume"], [`${fixed(cubicFeet / 27, 2)} yd³`, "Cubic yards"], [bags, `${bagSize} lb bags`], [money(bags * value(form, "unitCost")), "Bag budget"]])}${list([`One net hole is about <strong>${fixed((gross - post) / 1728, 2)} ft³</strong> after the post displaces material.`, `Estimate includes <strong>${fixed(value(form, "waste"), 0)}%</strong> waste.`, `Bag yield varies by mix; check the bag label before purchase.`])}${notice("Verify frost depth, soil, drainage, footing dimensions, and local requirements for the exact project.")}`;
    },
    baluster(form) {
      const result = spacing(value(form, "opening"), value(form, "baluster"), value(form, "maxGap"));
      return `${metrics([[result.count, "Balusters"], [`${fixed(result.gap, 3)} in`, "Equal clear gap"], [`${fixed(result.center, 3)} in`, "Center-to-center"], [`${fixed(value(form, "opening"))} in`, "Clear opening"]])}${list([`Lay out <strong>${result.count + 1}</strong> equal openings at ${fixed(result.gap, 3)} in.`, `Start with an edge gap, then mark baluster centers at ${fixed(result.center, 3)} in apart.`, `Use actual baluster width for a final shop layout.`])}${notice("Confirm the applicable guard-opening rule and installation details; this is a straight-opening layout estimate.")}`;
    },
    cabinet(form) {
      const units = unitContext(form); const shelfCount = Math.max(0, Math.round(value(form, "shelves")));
      const project = CutListGenerator.cabinet({ width: units.toInches("width"), height: units.toInches("height"), depth: units.toInches("depth"), thickness: units.toInches("thickness"), backThickness: units.toInches("backThickness"), shelfCount, preset: read(form).cabinetType || "base", waste: value(form, "waste") });
      const shelfPositions = Array.from({ length: shelfCount }, (_, index) => units.toInches("height") * (index + 1) / (shelfCount + 1));
      return `${metrics([[project.parts.reduce((sum, part) => sum + part.qty, 0), "Total parts"], [`${fixed(project.material.areaSquareFeet, 2)} ft²`, "Panel area"], [project.material.sheets, "4×8 sheet estimate"], [`${fixed(value(form, "waste"), 0)}%`, "Waste allowance"]])}${cabinetSvg({ width: units.toInches("width"), height: units.toInches("height"), shelves: shelfPositions, label: "Cabinet" }, units)}${partsOutput(project.parts, units)}${list([`Inside width: <strong>${units.dimension(project.insideWidth)}</strong>.`, `Shelf depth allowance: <strong>${units.dimension(project.shelfDepth)}</strong>.`, `Preset: <strong>${project.preset}</strong>.`])}<div class="cta-row"><a class="button" href="/apps/cutlist/">Optimize this cut list in CutList</a></div>${notice("Confirm joinery, clearances, toe kick, face frame, doors, drawers, hardware, and finished dimensions before cutting.")}`;
    },
    drawerBox(form) {
      const units = unitContext(form);
      const project = CutListGenerator.drawerBox({ openingWidth: units.toInches("openingWidth"), openingHeight: units.toInches("openingHeight"), cabinetDepth: units.toInches("cabinetDepth"), clearance: units.toInches("clearance"), thickness: units.toInches("thickness"), bottomThickness: units.toInches("bottomThickness"), bottomStyle: read(form).bottomStyle || "captured", qty: value(form, "qty"), waste: value(form, "waste") });
      return `${metrics([[units.dimension(project.boxWidth), "Finished box width"], [units.dimension(project.boxHeight), "Finished box height"], [`${fixed(project.material.areaSquareFeet, 2)} ft²`, "Total part area"], [project.material.sheets, "4×8 sheet estimate"]])}${cabinetSvg({ width: project.boxWidth, height: project.boxHeight, shelves: [], label: "Drawer box" }, units)}${partsOutput(project.parts, units)}${list([`Finished depth: <strong>${units.dimension(project.boxDepth)}</strong>.`, `Slide choice: <strong>${read(form).slideType}</strong>.`, `Total side clearance: <strong>${units.dimension(units.toInches("clearance"))}</strong>.`, `Bottom method: <strong>${read(form).bottomStyle}</strong>.`, `Waste allowance: <strong>${fixed(value(form, "waste"), 0)}%</strong>.`])}<div class="cta-row"><a class="button" href="/apps/cutlist/">Optimize these drawer parts in CutList</a></div>${notice("Use the exact slide manufacturer's clearance, depth, notch, and locking-device requirements before cutting repeated boxes.")}`;
    },
    cabinetDoor(form) {
      const units = unitContext(form);
      const project = CutListGenerator.cabinetDoor({ openingWidth: units.toInches("openingWidth"), openingHeight: units.toInches("openingHeight"), style: read(form).doorStyle || "full", doorCount: Number(read(form).doorCount) || 1, edge: units.toInches("edge"), centerGap: units.toInches("centerGap"), railWidth: units.toInches("railWidth"), stileWidth: units.toInches("stileWidth"), groove: units.toInches("groove"), waste: value(form, "waste") });
      const diagramShelves = [units.toInches("railWidth"), Math.max(0, project.doorHeight - units.toInches("railWidth"))];
      return `${metrics([[project.count, "Door count"], [`${units.dimension(project.doorWidth)} × ${units.dimension(project.doorHeight)}`, "Finished door size"], [`${fixed(project.material.areaSquareFeet, 2)} ft²`, "Total part area"], [project.material.sheets, "4×8 sheet equivalent"]])}${cabinetSvg({ width: project.doorWidth, height: project.doorHeight, shelves: diagramShelves, label: "Cabinet door" }, units)}${partsOutput(project.parts, units)}${list([`Rail length: <strong>${units.dimension(project.railLength)}</strong>.`, `Panel size: <strong>${units.dimension(project.panelWidth)} × ${units.dimension(project.panelHeight)}</strong>.`, `Door style: <strong>${read(form).doorStyle}</strong>.`, `Waste allowance: <strong>${fixed(value(form, "waste"), 0)}%</strong>.`])}<div class="cta-row"><a class="button" href="/apps/cutlist/">Optimize these door parts in CutList</a></div>${notice("The sheet equivalent combines frame and panel area for planning only; solid-wood rails and stiles require a separate board takeoff. Verify hinge overlay, reveals, profile depth, panel expansion, and a test assembly before batching doors.")}`;
    },
    shelfSpacing(form) {
      const units = unitContext(form); const insideHeight = units.toInches("insideHeight"); const thickness = units.toInches("thickness");
      const project = SpacingEngine.equalShelves({ insideHeight, shelfCount: value(form, "shelves"), thickness, bottomOffset: units.toInches("bottomOffset") });
      const positions = project.shelves.map((shelf) => `Shelf ${shelf.index}: bottom ${units.dimension(shelf.bottom)}, top ${units.dimension(shelf.top)}, center ${units.dimension(shelf.center)}`);
      const system32 = read(form).system32 === "yes" ? project.shelves.map((shelf) => `${Math.round(shelf.center * 25.4 / 32) * 32} mm`).join(", ") : "Not requested";
      return `${metrics([[units.dimension(project.gap), "Equal clear opening"], [project.shelves.length, "Shelves"], [units.dimension(project.usableHeight), "Clear space total"], [system32, "Nearest 32mm centers"]])}${cabinetSvg({ width: insideHeight * 0.58, height: insideHeight, shelves: project.shelves.map((shelf) => shelf.bottom), label: "Shelf layout" }, units)}<div class="cut-list-output"><div class="cut-list-output-head"><h3>Copyable shelf positions</h3><button class="button secondary small" type="button" data-copy-cut-list>Copy positions</button></div><pre data-cut-list>${positions.join("\n")}</pre></div>${notice("Set the 32mm drilling datum from your cabinet system and verify fixed-shelf joinery, real material thickness, and top/bottom obstructions.")}`;
    },
    crown(form) {
      const angles = AngleEngine.compoundCrown(value(form, "corner"), value(form, "spring"));
      return `${metrics([[`${fixed(angles.miter, 2)}°`, "Miter setting"], [`${fixed(angles.bevel, 2)}°`, "Bevel setting"], [`${fixed(value(form, "corner") / 2, 2)}°`, "Corner half-angle"], [`${fixed(value(form, "face"))} in`, "Molding face"]])}${list([`Set up scrap at the measured <strong>${fixed(value(form, "spring"))}°</strong> spring angle.`, `Use the calculated settings for a test cut, then label inside/outside and left/right cuts.`, `Out-of-square corners need field adjustment.`])}${notice("Test on scrap before cutting finished molding. Saw scales and molding orientation can differ by tool and method.")}`;
    },
    stairs(form) {
      const r = stairResult(value(form, "rise"), value(form, "run"), Math.max(value(form, "maxRiser"), 0.01));
      return `${metrics([[r.risers, "Risers"], [r.treads, "Treads"], [`${fixed(r.riser)} in`, "Riser height"], [`${fixed(r.tread)} in`, "Tread depth"]])}${list([`Stair angle: <strong>${fixed(r.angle, 1)}°</strong>.`, `Approximate stringer length: <strong>${fixed(r.length)} in</strong>.`, `The layout uses the available run divided across ${r.treads} treads.`])}${notice("Verify all stair, guard, handrail, landing, headroom, and local building requirements before construction.")}`;
    },
    riseRun(form) {
      const rise = value(form, "rise"); const risers = Math.max(1, Math.round(value(form, "risers"))); const treads = Math.max(1, risers - 1); const tread = value(form, "tread"); const run = treads * tread; const angle = Math.atan(rise / run) * 180 / Math.PI;
      return `${metrics([[`${fixed(rise / risers)} in`, "Riser height"], [treads, "Treads"], [`${fixed(run)} in`, "Total run"], [`${fixed(Math.hypot(rise, run))} in`, "Stringer length"]])}${list([`Stair angle: <strong>${fixed(angle, 1)}°</strong>.`, `Tread depth: <strong>${fixed(tread)} in</strong>.`, `Compare this option with your actual available run and local requirements.`])}${notice("This is preliminary geometry, not a code compliance result.")}`;
    },
    stairAngle(form) {
      const rise = value(form, "rise"); const run = Math.max(value(form, "run"), 0.01); const angle = Math.atan(rise / run) * 180 / Math.PI;
      return `${metrics([[`${fixed(angle, 2)}°`, "Stair angle"], [`${fixed(rise / run * 100, 1)}%`, "Slope"], [`${fixed(rise * 12 / run, 2)}:12`, "Pitch"], [`${fixed(Math.hypot(rise, run))} in`, "Stringer length"]])}${list([`Total rise: <strong>${fixed(rise)} in</strong>.`, `Total run: <strong>${fixed(run)} in</strong>.`, `Use angle with a separate riser/tread layout check.`])}${notice("Verify stair code and actual site conditions before construction.")}`;
    },
    deckStain(form) {
      const area = value(form, "length") * value(form, "width"); const coated = area * value(form, "coats") * (1 + value(form, "waste") / 100); const gallons = Math.ceil(coated / Math.max(value(form, "coverage"), 1));
      return `${metrics([[`${fixed(area)} ft²`, "Deck surface"], [`${fixed(coated)} ft²`, "Coated coverage"], [gallons, "Gallons to buy"], [money(gallons * value(form, "unitCost")), "Stain budget"]])}${list([`Estimate assumes <strong>${fixed(value(form, "coats"), 0)}</strong> coats and ${fixed(value(form, "waste"), 0)}% waste.`, `Coverage setting: <strong>${fixed(value(form, "coverage"), 0)} ft² per gallon</strong>.`, `Add rails, stairs, fascia, and underside separately if they will be coated.`])}${notice("Follow the specific product label; wood condition and application method change actual coverage.")}`;
    },
    fenceStain(form) {
      const area = value(form, "length") * value(form, "height") * value(form, "sides"); const coated = area * value(form, "coats") * (1 + value(form, "waste") / 100); const gallons = Math.ceil(coated / Math.max(value(form, "coverage"), 1));
      return `${metrics([[`${fixed(area)} ft²`, "Fence face area"], [`${fixed(coated)} ft²`, "Coated coverage"], [gallons, "Gallons to buy"], [money(gallons * value(form, "unitCost")), "Stain budget"]])}${list([`Estimate covers <strong>${fixed(value(form, "sides"), 0)}</strong> fence side(s) and ${fixed(value(form, "coats"), 0)} coat(s).`, `Coverage setting: <strong>${fixed(value(form, "coverage"), 0)} ft² per gallon</strong>.`, `Picket edges and texture can increase actual usage.`])}${notice("Follow the product label and test a small area before purchasing all material.")}`;
    },
    rafter(form) {
      const run = value(form, "run") + value(form, "overhang"); const riseRatio = value(form, "rise") / Math.max(value(form, "run"), 0.01); const rise = run * riseRatio; const angle = Math.atan(riseRatio) * 180 / Math.PI;
      return `${metrics([[`${fixed(Math.hypot(run, rise))} in`, "Diagonal rafter"], [`${fixed(angle, 2)}°`, "Roof angle"], [`${fixed(riseRatio * 12, 2)}:12`, "Roof pitch"], [`${fixed(run)} in`, "Adjusted run"]])}${list([`Adjusted horizontal run includes <strong>${fixed(value(form, "overhang"))} in</strong> overhang.`, `Rise over adjusted run: <strong>${fixed(rise)} in</strong>.`, `Use as a geometry estimate before birdsmouth and ridge deductions.`])}${notice("Not a structural design or cut sheet. Confirm all roof details before cutting.")}`;
    },
    shingles(form) {
      const length = value(form, "length"); const run = value(form, "span") * 6; const multiplier = Math.hypot(12, value(form, "pitch")) / 12; const area = length * 2 * run / 12 * multiplier; const adjusted = area * (1 + value(form, "waste") / 100); const squares = adjusted / 100; const bundles = Math.ceil(squares * value(form, "bundles"));
      return `${metrics([[`${fixed(area)} ft²`, "Roof surface"], [`${fixed(adjusted)} ft²`, "Area with waste"], [`${fixed(squares, 2)}`, "Roofing squares"], [bundles, "Shingle bundles"]])}${list([`Estimate assumes a simple two-plane gable roof.`, `Pitch multiplier: <strong>${fixed(multiplier, 4)}</strong>.`, `Waste allowance: <strong>${fixed(value(form, "waste"), 0)}%</strong>.`])}${notice("Add ridge caps, starter, underlayment, flashing, valleys, vents, and manufacturer-specific requirements separately.")}`;
    },
    picket(form) {
      const result = spacing(value(form, "opening"), value(form, "picket"), value(form, "maxGap"));
      return `${metrics([[result.count, "Pickets"], [`${fixed(result.gap, 3)} in`, "Equal gap"], [`${fixed(result.center, 3)} in`, "Center-to-center"], [result.count + 1, "Gap spaces"]])}${list([`Mark the first picket after an edge gap of <strong>${fixed(result.gap, 3)} in</strong>.`, `Center spacing: <strong>${fixed(result.center, 3)} in</strong>.`, `Recheck the final gap with actual picket widths before fastening.`])}${notice("Account for wood movement, posts, gates, and any project-specific spacing requirement.")}`;
    },
    joist(form) {
      const span = value(form, "span"); const depth = Math.max(value(form, "depth"), 0.1); const ratio = span * 12 / depth;
      return `${metrics([[`${fixed(span)} ft`, "Clear span"], [`${fixed(value(form, "spacing"), 0)} in`, "Joist spacing"], [`${fixed(depth)} in`, "Nominal depth"], [`${fixed(ratio, 1)}:1`, "Span-to-depth ratio"]])}${list([`Record design load: <strong>${fixed(value(form, "load"), 0)} psf</strong>.`, `Use the inputs with an approved span table for the exact species and grade.`, `<strong>No safe-span approval is generated by this tool.</strong>`])}${notice("Structural safety depends on code tables, species, grade, loads, supports, connections, holes, notches, and local requirements. Consult an approved source or qualified professional.")}`;
    },
    shelfSag(form) {
      const span = value(form, "span"); const depth = value(form, "depth"); const thickness = Math.max(value(form, "thickness"), 0.01); const load = value(form, "load"); const modulus = Math.max(value(form, "modulus"), 1);
      const inertia = depth * thickness ** 3 / 12; const distributed = load / Math.max(span, 0.01); const deflection = 5 * distributed * span ** 4 / (384 * modulus * inertia); const ratio = deflection ? span / deflection : Infinity;
      return `${metrics([[`${fixed(deflection, 3)} in`, "Approx. mid-span sag"], [`L/${fixed(ratio, 0)}`, "Deflection ratio"], [`${fixed(inertia, 4)} in⁴`, "Section inertia"], [`${fixed(load)} lb`, "Uniform load"]])}${list([`Model: simply supported shelf with a uniform load.`, `Stiffness input: <strong>${fixed(modulus, 0)} psi</strong>.`, `Adding thickness, reducing span, or adding a support can materially reduce predicted deflection.`])}${notice("Actual shelf behavior varies with material direction, creep, brackets, fastening, concentrated loads, humidity, and construction. Do not use this as a safety certification.")}`;
    }
  };

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-construction-form]").forEach((form) => {
      const tool = form.closest("[data-calculator]");
      const result = tool?.querySelector("[data-construction-result]");
      const calculator = calculators[tool?.dataset.calculator];
      if (!result || !calculator) return;
      const run = () => { result.innerHTML = `<h2>${result.dataset.resultTitle || "Planning"} result</h2>${calculator(form)}`; };
      const unitSwitch = form.querySelector("[data-unit-switch]");
      if (unitSwitch) {
        unitSwitch.dataset.currentUnit = unitSwitch.value;
        unitSwitch.addEventListener("change", () => {
          const previous = unitSwitch.dataset.currentUnit || "imperial";
          const next = unitSwitch.value;
          if (previous !== next) {
            const factor = previous === "imperial" && next === "metric" ? 25.4 : 1 / 25.4;
            form.querySelectorAll("[data-dimension-input]").forEach((input) => {
              input.value = fixed((Number(input.value) || 0) * factor, next === "metric" ? 1 : 3).replaceAll(",", "");
            });
            unitSwitch.dataset.currentUnit = next;
          }
          form.querySelectorAll("[data-unit-label]").forEach((label) => { label.textContent = next === "metric" ? "mm" : "in"; });
          run();
        });
      }
      form.addEventListener("submit", (event) => { event.preventDefault(); run(); });
      form.addEventListener("input", (event) => { if (event.target !== unitSwitch) run(); });
      form.addEventListener("change", (event) => { if (event.target !== unitSwitch) run(); });
      result.addEventListener("click", async (event) => {
        const button = event.target.closest("[data-copy-cut-list]");
        if (!button) return;
        const text = result.querySelector("[data-cut-list]")?.textContent || "";
        if (!text) return;
        try {
          await navigator.clipboard.writeText(text);
          button.textContent = "Copied";
        } catch {
          button.textContent = "Select and copy the list";
        }
      });
      run();
    });
  });
})();
