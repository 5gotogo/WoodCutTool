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
      const width = value(form, "width"); const height = value(form, "height"); const depth = value(form, "depth"); const thickness = value(form, "thickness"); const shelves = Math.max(0, Math.round(value(form, "shelves")));
      const insideWidth = Math.max(0, width - 2 * thickness); const area = (2 * height * depth + (2 + shelves) * insideWidth * depth + width * height) / 144;
      const sheets = Math.ceil(area * (1 + value(form, "waste") / 100) / 32); const type = read(form).cabinetType === "wall" ? "wall" : "base";
      return `${metrics([[2, "Side panels"], [2 + shelves, "Top, bottom & shelves"], [1, "Back panel"], [sheets, "4×8 sheet estimate"]])}${list([`Sides: <strong>${fixed(height)} × ${fixed(depth)} in</strong> (2).`, `Top, bottom, and shelves: <strong>${fixed(insideWidth)} × ${fixed(depth)} in</strong> (${2 + shelves}).`, `Back: <strong>${fixed(width)} × ${fixed(height)} in</strong> (1).`, `This is a ${type} cabinet starter list with ${fixed(value(form, "waste"), 0)}% sheet waste.`])}<div class="cta-row"><a class="button" href="/apps/cutlist/">Send confirmed parts to CutList</a></div>${notice("Confirm joinery, clearances, toe kick, face frame, doors, drawers, hardware, and finished dimensions before cutting.")}`;
    },
    crown(form) {
      const corner = value(form, "corner") * Math.PI / 180; const spring = value(form, "spring") * Math.PI / 180;
      const miter = Math.asin(Math.cos(spring) * Math.sin(corner / 2)) * 180 / Math.PI; const bevel = Math.acos(Math.sin(spring) * Math.cos(corner / 2)) * 180 / Math.PI;
      return `${metrics([[`${fixed(miter, 2)}°`, "Miter setting"], [`${fixed(bevel, 2)}°`, "Bevel setting"], [`${fixed(value(form, "corner") / 2, 2)}°`, "Corner half-angle"], [`${fixed(value(form, "face"))} in`, "Molding face"]])}${list([`Set up scrap at the measured <strong>${fixed(value(form, "spring"))}°</strong> spring angle.`, `Use the calculated settings for a test cut, then label inside/outside and left/right cuts.`, `Out-of-square corners need field adjustment.`])}${notice("Test on scrap before cutting finished molding. Saw scales and molding orientation can differ by tool and method.")}`;
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
      const run = () => { result.innerHTML = `<h2>${tool.querySelector("h2")?.textContent || "Planning"} result</h2>${calculator(form)}`; };
      form.addEventListener("submit", (event) => { event.preventDefault(); run(); });
      run();
    });
  });
})();
